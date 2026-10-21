

(async()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,f)=>{
    const x=clamp((f-a)/(b-a),0,1);
    return x*x*(3-2*x);
  };
  const kf=(f,k)=>{
    if(f<=k[0][0])return k[0][1];
    for(let i=1;i<k.length;i++){
      if(f<=k[i][0]){
        return k[i-1][1]+
          (k[i][1]-k[i-1][1])*
          smooth(k[i-1][0],k[i][0],f);
      }
    }
    return k[k.length-1][1];
  };

  async function waitGame(){
    for(let i=0;i<1000;i++){
      const g=window.gameReview;
      if(
        g?.scene &&
        g?.player &&
        g?.groundY &&
        window.gameZombie &&
        window.FLORESTA_MODULES?.three
      ) return g;
      await sleep(20);
    }
    throw new Error("Jogo não ficou disponível para os novos inimigos.");
  }

  try{
    const game=await waitGame();
    const T=await window.__LOCAL_IMPORT(window.FLORESTA_MODULES.three);
    const TAU=Math.PI*2;
    const V=(x,y,z)=>new T.Vector3(x,y,z);
    const W=o=>o.getWorldPosition(new T.Vector3());

    const status=document.getElementById("status");

    function randomPoint(min,max){
      const a=Math.random()*TAU;
      const r=min+Math.random()*(max-min);
      return {
        x:game.player.x+Math.sin(a)*r,
        z:game.player.z+Math.cos(a)*r
      };
    }

    function faceXZ(root,x,z,turnSpeed,dt){
      const dx=x-root.position.x;
      const dz=z-root.position.z;
      const desired=Math.atan2(dx,dz);
      const diff=Math.atan2(
        Math.sin(desired-root.rotation.y),
        Math.cos(desired-root.rotation.y)
      );
      root.rotation.y+=
        diff*(1-Math.exp(-turnSpeed*dt));
    }

    function axeFacing(root,range,halfAngleDeg){
      const dx=root.position.x-game.player.x;
      const dz=root.position.z-game.player.z;
      const d=Math.hypot(dx,dz);
      if(d>range)return false;
      if(d<.001)return true;

      const tx=dx/d,tz=dz/d;
      const fx=-Math.sin(game.player.yaw);
      const fz=-Math.cos(game.player.yaw);

      return (
        fx*tx+fz*tz
      )>=Math.cos(halfAngleDeg*Math.PI/180);
    }

    function damagePlayer(amount,label,id){
      return window.gameZombie?.hurtPlayer?.(
        amount,
        label,
        id
      );
    }

    // ==========================================================
    // OLHO VOADOR
    // Exact custom rig/mesh structure and animation math adapted
    // from the supplied Olho Voador HTML, but using the game's
    // existing Three.js/renderer.
    // ==========================================================
    function buildFlyingEye(){
      const entity=new T.Group();
      entity.name="Enemy_FlyingEye";

      // V45: the original preview was display-sized, not gameplay-sized.
      // Keep the exact rig/animations but make the creature physically small.
      // Body becomes ~0.37 m wide and the full wing span stays compact.
      entity.scale.setScalar(.30);

      game.scene.add(entity);

      const rig=new T.Group();
      entity.add(rig);

      const MT=[];
      const mk=(c,o=1,x={})=>{
        const m=new T.MeshStandardMaterial(Object.assign({
          color:c,
          roughness:.9,
          flatShading:true,
          transparent:true,
          opacity:o,
          side:T.DoubleSide,
          depthWrite:o>.9
        },x));
        m.userData.o=o;
        MT.push(m);
        return m;
      };

      const skin=mk(0x2c2c33);
      const lidM=mk(0x3a3a42);
      const armM=mk(0x1f1f25);
      const wingM=mk(0x44444e,.93);
      const eyeM=mk(0xe9e4da,1,{roughness:.35});
      const irisM=mk(0x6b5a48,1,{roughness:.5});
      const pupM=new T.MeshBasicMaterial({
        color:0x050505,
        transparent:true
      });
      pupM.userData.o=1;
      MT.push(pupM);

      const B={};
      function bn(n,p,x,y,z){
        const b=new T.Bone();
        b.name=n;
        b.position.set(x,y,z);
        (p||rig).add(b);
        B[n]=b;
        return b;
      }
      function ms(g,m,p,x=0,y=0,z=0){
        const o=new T.Mesh(g,m);
        o.position.set(x,y,z);
        o.castShadow=true;
        o.receiveShadow=false;
        p.add(o);
        return o;
      }

      const root=bn("Eye_Root",0,0,0,0);
      const body=bn("Eye_Body",root,0,0,0);
      const ball=bn("EyeBall",body,0,0,.14);
      const lid=bn("Eyelid",ball,0,0,0);

      ms(new T.SphereGeometry(.62,14,10),skin,body,0,0,-.12)
        .scale.set(1,1,.95);
      ms(new T.SphereGeometry(.52,18,12),eyeM,ball);

      const ir=ms(
        new T.SphereGeometry(.525,18,8,0,TAU,0,.62),
        irisM,ball
      );
      ir.rotation.x=Math.PI/2;

      const pu=ms(
        new T.SphereGeometry(.532,14,6,0,TAU,0,.27),
        pupM,ball
      );
      pu.rotation.x=Math.PI/2;

      ms(
        new T.SphereGeometry(.57,18,8,0,TAU,0,Math.PI/2),
        lidM,lid
      );

      {
        let p=body;
        for(let i=1;i<=3;i++){
          const b=bn(
            "Tendril_0"+i,
            p,
            0,
            i>1?-.32:-.55,
            i>1?0:-.08
          );
          ms(
            new T.CylinderGeometry(
              .04-.008*i,.012,.32,6
            ),
            skin,b,0,-.16,0
          );
          p=b;
        }
      }

      const WL=[1.1,1,.9,.6];
      const WR=[.07,.055,.045,.03,.015];
      const MW=[1,.85,.55,.28];
      const WG={};

      for(const s of "LR"){
        const g=s==="L"?1:-1;
        const nm=[
          "Wing_"+s+"_01",
          "Wing_"+s+"_02",
          "Wing_"+s+"_03",
          "WingTip_"+s
        ];

        const bs=[];
        let p=body;

        nm.forEach((n,i)=>{
          const b=bn(
            n,p,
            i?0:.5*g,
            i?WL[i-1]:.25,
            0
          );

          ms(
            new T.CylinderGeometry(
              WR[i+1],
              WR[i],
              WL[i],
              6
            ),
            armM,b,0,WL[i]/2,0
          );

          bs.push(b);
          p=b;
        });

        const te=new T.Object3D();
        te.position.set(0,WL[3],0);
        bs[3].add(te);

        const tr=[];
        for(let i=0;i<4;i++){
          const m=bn(
            "Mem_"+s+"_0"+(i+1),
            bs[i],
            0,WL[i]*.5,0
          );
          const a=new T.Object3D();
          a.position.set(-g*MW[i],-.05,0);
          m.add(a);
          tr.push(a);
        }

        const R=new T.Object3D();
        R.position.set(.3*g,-.25,-.05);
        body.add(R);

        const geo=new T.BufferGeometry();
        geo.setAttribute(
          "position",
          new T.BufferAttribute(new Float32Array(30),3)
        );
        geo.setIndex([
          0,1,5,1,6,5,1,2,6,2,7,6,
          2,3,7,3,8,7,3,4,8,0,5,9
        ]);

        const me=new T.Mesh(geo,wingM);
        me.frustumCulled=false;
        game.scene.add(me);

        WG[s]={
          pts:[bs[0],bs[1],bs[2],bs[3],te],
          tr,R,geo,mesh:me
        };
      }

      function upMem(){
        for(const s of "LR"){
          const q=WG[s];
          const a=q.geo.attributes.position;

          [...q.pts,...q.tr,q.R].forEach((o,i)=>{
            const v=W(o);
            a.setXYZ(i,v.x,v.y,v.z);
          });

          a.needsUpdate=true;
          q.geo.computeVertexNormals();
        }
      }

      const rest={};
      for(const n in B){
        rest[n]={
          p:B[n].position.clone(),
          q:B[n].quaternion.clone()
        };
      }

      function reset(){
        for(const n in B){
          B[n].position.copy(rest[n].p);
          B[n].quaternion.copy(rest[n].q);
          B[n].scale.set(1,1,1);
        }
      }

      // V71B — visual REWORK supplied by the user. The original gameplay
      // rig, bone names, hit timing and AI remain authoritative.
      const eyeVisualMeshes=[];
      const eyeLidSheets=[];
      const eyeWingParts=[];

      function eyeNoise3(x,y,z){
        return Math.sin(x*13+y*7+z*9)*Math.sin(y*19-z*11+x*5);
      }
      function eyeOrganic(rx,ry,rz,amount=.045){
        const g=new T.SphereGeometry(1,28,20);
        const a=g.attributes.position;
        for(let i=0;i<a.count;i++){
          const x=a.getX(i),y=a.getY(i),z=a.getZ(i);
          const kk=1+amount*eyeNoise3(x,y,z);
          a.setXYZ(i,x*rx*kk,y*ry*kk,z*rz*kk);
        }
        g.computeVertexNormals();
        return g;
      }
      function eyeTube(points,radii,sides=9,steps=26){
        const curve=new T.CatmullRomCurve3(points.map(p=>V(...p)));
        const frames=curve.computeFrenetFrames(steps,false);
        const ar=[],uv=[],ix=[];
        for(let j=0;j<=steps;j++){
          const u=j/steps,p=curve.getPointAt(u);
          const ri=u*(radii.length-1),lo=Math.floor(ri);
          const r=T.MathUtils.lerp(radii[lo],radii[Math.min(radii.length-1,lo+1)],ri%1);
          for(let k=0;k<=sides;k++){
            const ang=k/sides*TAU,c=Math.cos(ang)*r,s=Math.sin(ang)*r;
            const n=frames.normals[j],bb=frames.binormals[j];
            ar.push(p.x+n.x*c+bb.x*s,p.y+n.y*c+bb.y*s,p.z+n.z*c+bb.z*s);
            uv.push(k/sides,u);
            if(j<steps&&k<sides){
              const q=j*(sides+1)+k;
              ix.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);
            }
          }
        }
        const g=new T.BufferGeometry();
        g.setAttribute('position',new T.Float32BufferAttribute(ar,3));
        g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
        g.setIndex(ix); g.computeVertexNormals();
        return g;
      }
      function eyeSculpt(g,m,p,x=0,y=0,z=0){
        const o=ms(g,m,p,x,y,z); o.userData.rework=true; eyeVisualMeshes.push(o); return o;
      }
      function eyeClearVisual(p){
        for(const o of [...p.children]){
          if(o.isMesh){ p.remove(o); o.geometry?.dispose?.(); }
        }
      }
      function eyeTexture(kind){
        const c=document.createElement('canvas'); c.width=c.height=192;
        const ctx=c.getContext('2d'),d=ctx.createImageData(192,192); let seed=739;
        for(let i=0;i<d.data.length;i+=4){
          seed=(seed*1664525+1013904223)>>>0;
          const vv=150+(seed>>>24)*.3;
          d.data[i]=d.data[i+1]=d.data[i+2]=vv; d.data[i+3]=255;
        }
        ctx.putImageData(d,0,0);
        const t=new T.CanvasTexture(c); t.wrapS=t.wrapT=T.RepeatWrapping; t.repeat.set(3,3); return t;
      }
      function eyeSurface(m,kind='skin'){
        m.flatShading=false; m.roughness=kind==='skin'?.83:.94;
        m.bumpMap=eyeTexture(kind); m.bumpScale=kind==='skin'?.0022:.0015; m.roughnessMap=m.bumpMap; m.needsUpdate=true;
      }

      for(const b of Object.values(B)) eyeClearVisual(b);
      eyeSurface(skin); eyeSurface(lidM); eyeSurface(armM);
      skin.color.set(0x343937); lidM.color.set(0x474b44); armM.color.set(0x303530);

      eyeSculpt(eyeOrganic(.61,.60,.50,.03),skin,body,0,0,-.11);
      eyeSculpt(new T.SphereGeometry(.525,42,30),eyeM,ball); eyeM.roughness=.22;

      const eyeCanvas=document.createElement('canvas'); eyeCanvas.width=768; eyeCanvas.height=384;
      const ectx=eyeCanvas.getContext('2d'); ectx.fillStyle='#d0d0bd'; ectx.fillRect(0,0,768,384);
      for(let j=0;j<76;j++){
        ectx.strokeStyle=j%3?'#8c827b66':'#8a625e88'; ectx.lineWidth=.5+(j%4)*.35;
        ectx.beginPath(); let x=(j*137)%768,y=(j*71)%384; ectx.moveTo(x,y);
        for(let k=0;k<7;k++){ x+=Math.sin(j+k*1.3)*9; y+=7; ectx.lineTo(x,y); } ectx.stroke();
      }
      eyeM.map=new T.CanvasTexture(eyeCanvas);
      if('colorSpace' in eyeM.map) eyeM.map.colorSpace=T.SRGBColorSpace; else eyeM.map.encoding=T.sRGBEncoding;
      eyeM.needsUpdate=true;

      const irisCanvas=document.createElement('canvas'); irisCanvas.width=irisCanvas.height=384;
      const ic=irisCanvas.getContext('2d'); ic.fillStyle='#191e1b'; ic.fillRect(0,0,384,384);
      for(let j=0;j<950;j++){
        const aa=j*2.39996,r=56+(j%25);
        ic.strokeStyle=['#7f826b','#999b7d','#505d51','#b8b59a','#343e37'][j%5];
        ic.lineWidth=.7+j%3; ic.beginPath();
        ic.moveTo(192+Math.cos(aa)*r,192+Math.sin(aa)*r);
        ic.lineTo(192+Math.cos(aa+.013)*182,192+Math.sin(aa+.013)*182); ic.stroke();
      }
      const irisTex=new T.CanvasTexture(irisCanvas);
      if('colorSpace' in irisTex) irisTex.colorSpace=T.SRGBColorSpace; else irisTex.encoding=T.sRGBEncoding;
      irisM.map=irisTex; irisM.color.set(0xffffff); irisM.roughness=.32;

      const ig=new T.SphereGeometry(.532,42,24,0,TAU,0,.60); ig.rotateX(Math.PI/2);
      const iu=ig.attributes.uv,ip=ig.attributes.position;
      for(let i=0;i<iu.count;i++) iu.setXY(i,.5+ip.getX(i)/.61,.5+ip.getY(i)/.61);
      eyeSculpt(ig,irisM,ball);
      const pg=new T.SphereGeometry(.537,32,16,0,TAU,0,.22); pg.rotateX(Math.PI/2); eyeSculpt(pg,pupM,ball);

      const cornea=new T.MeshPhysicalMaterial({color:0xffffff,roughness:.035,metalness:0,transparent:true,opacity:.12,clearcoat:1,clearcoatRoughness:.015,depthWrite:false});
      cornea.userData.o=.12; MT.push(cornea);
      const cg=new T.SphereGeometry(.544,42,24,0,TAU,0,.63); cg.rotateX(Math.PI/2); eyeSculpt(cg,cornea,ball);
      const glow=new T.MeshBasicMaterial({color:0xf2f6ed,transparent:true,opacity:.6,depthWrite:false}); glow.userData.o=.6; MT.push(glow);
      eyeSculpt(eyeOrganic(.035,.055,.006,0),glow,ball,-.09,.12,.524);

      lid.visible=false;
      for(const top of [true,false]){
        const g=new T.BufferGeometry(),pos=new Float32Array(37*11*3),idx=[];
        for(let j=0;j<10;j++) for(let i=0;i<36;i++){
          const aa=j*37+i; idx.push(aa,aa+1,aa+37,aa+1,aa+38,aa+37);
        }
        g.setAttribute('position',new T.BufferAttribute(pos,3)); g.setIndex(idx);
        const mm=eyeSculpt(g,lidM,ball); mm.userData.top=top; eyeLidSheets.push(mm);
      }
      for(let j=0;j<7;j++){
        const pts=[];
        for(let k=0;k<=20;k++){
          const aa=k/20*Math.PI;
          pts.push([Math.cos(aa)*(.56+j*.004),Math.sin(aa)*(.27+j*.045)-.01,.12+Math.sin(aa)*(.21-j*.032)]);
        }
        eyeSculpt(eyeTube(pts,[.017,.026,.017],6,24),lidM,body);
      }
      for(const s of 'LR'){
        for(let i=0;i<4;i++){
          const bb=B[i===3?'WingTip_'+s:'Wing_'+s+'_0'+(i+1)];
          eyeSculpt(eyeTube([[0,-.03,0],[.035,WL[i]*.4,.015],[0,WL[i]+.03,0]],[WR[i],WR[i]*.7,WR[i+1]],8,16),armM,bb);
          eyeSculpt(eyeOrganic(WR[i]*1.3,WR[i]*1.4,WR[i]*1.2,.07),skin,bb);
        }
      }
      for(let i=1;i<=3;i++){
        const bb=B['Tendril_0'+i];
        for(let j=-2;j<=2;j++) eyeSculpt(eyeTube([[j*.065,.04,0],[j*.09,-.15,.025],[j*.115,-.36,-.02]],[.022-(i-1)*.005,.014,.003],7,12),skin,bb);
      }

      // Replace the preview membrane with a subdivided membrane attached to
      // the entity itself, so visibility follows the enemy correctly.
      for(const s of 'LR'){
        const q=WG[s],old=q.geo,idx=old.index.array,weights=[],indices=[],uv=[]; const div=8;
        for(let tr=0;tr<idx.length;tr+=3){
          const base=weights.length;
          for(let j=0;j<=div;j++) for(let k=0;k<=div-j;k++){
            weights.push([idx[tr],idx[tr+1],idx[tr+2],j/div,k/div]); uv.push(j/div,k/div);
          }
          const at=(j,k)=>base+j*(div+1)-j*(j-1)/2+k;
          for(let j=0;j<div;j++) for(let k=0;k<div-j;k++){
            indices.push(at(j,k),at(j+1,k),at(j,k+1));
            if(k<div-j-1) indices.push(at(j+1,k),at(j+1,k+1),at(j,k+1));
          }
        }
        const g=new T.BufferGeometry();
        g.setAttribute('position',new T.BufferAttribute(new Float32Array(weights.length*3),3));
        g.setAttribute('uv',new T.Float32BufferAttribute(uv,2)); g.setIndex(indices);
        const mat=wingM.clone(); eyeSurface(mat,'leather'); mat.color.set(0x363b36); mat.side=T.DoubleSide; mat.transparent=true; mat.opacity=.88; mat.userData.o=.88; MT.push(mat);
        q.mesh.removeFromParent(); entity.add(q.mesh); q.mesh.geometry=g; q.mesh.material=mat; q.geo=g;
        const part={q,g,weights,wp:[...q.pts,...q.tr,q.R].map(()=>V(0,0,0)),objects:[...q.pts,...q.tr,q.R],ribs:[]};
        for(let i=0;i<4;i++){
          const rg=new T.BufferGeometry().setFromPoints([V(0,0,0),V(0,0,0)]);
          const line=new T.Line(rg,new T.LineBasicMaterial({color:0x72786d,transparent:true,opacity:.75})); entity.add(line); part.ribs.push(line);
        }
        eyeWingParts.push(part);
      }
      for(const s of 'LR') WG[s].tr.forEach((o,i)=>o.position.x*=[.32,.72,.85,.80][i]);

      function updateEyeSheets(){
        const close=clamp((lid.rotation.x-.22)/1.23,0,1);
        for(const o of eyeLidSheets){
          const a=o.geometry.attributes.position,sign=o.userData.top?1:-1; let n=0;
          for(let j=0;j<=10;j++) for(let i=0;i<=36;i++){
            const x=(i/36*2-1)*.554,edge=Math.sqrt(Math.max(0,.554*.554-x*x)),v=j/10;
            const y=sign*edge*(.57*(1-close)+(1-.57*(1-close))*v);
            const z=Math.sqrt(Math.max(0,.554*.554-x*x-y*y))+.007;
            a.setXYZ(n++,x,y,z);
          }
          a.needsUpdate=true;
        }
      }

      upMem=function(){
        entity.updateMatrixWorld(true);
        for(const w of eyeWingParts){
          w.objects.forEach((o,i)=>{
            o.getWorldPosition(w.wp[i]); entity.worldToLocal(w.wp[i]);
          });
          const a=w.g.attributes.position,now=performance.now()/1000;
          for(let i=0;i<w.weights.length;i++){
            const [i0,i1,i2,u,v]=w.weights[i],r=1-u-v,p0=w.wp[i0],p1=w.wp[i1],p2=w.wp[i2];
            a.setXYZ(i,p0.x*r+p1.x*u+p2.x*v,p0.y*r+p1.y*u+p2.y*v,p0.z*r+p1.z*u+p2.z*v+Math.sin(now*8+u*5+v*4)*u*v*r*.18);
          }
          a.needsUpdate=true;
          for(let i=0;i<4;i++){
            const at=w.ribs[i].geometry.attributes.position,p0=w.wp[i+1],p1=w.wp[i+5];
            at.setXYZ(0,p0.x,p0.y,p0.z); at.setXYZ(1,p1.x,p1.y,p1.z); at.needsUpdate=true;
          }
        }
      };

      const eyePoseNodes=Object.values(B);
      const eyeBlendPose=eyePoseNodes.map(b=>({p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
      let eyeBlendStart=-10;
      function captureEyeTransition(){
        eyeBlendStart=performance.now()/1000;
        for(let i=0;i<eyePoseNodes.length;i++){
          const b=eyePoseNodes[i],v=eyeBlendPose[i]; v.p.copy(b.position); v.q.copy(b.quaternion); v.s.copy(b.scale);
        }
      }
      function blendEyeTransition(now){
        let a=clamp((now-eyeBlendStart)/.23,0,1); a=a*a*(3-2*a); if(a===1)return;
        for(let i=0;i<eyePoseNodes.length;i++){
          const b=eyePoseNodes[i],v=eyeBlendPose[i]; if(b===root)continue;
          b.position.lerpVectors(v.p,b.position,a); b.quaternion.slerpQuaternions(v.q,b.quaternion,a); b.scale.lerpVectors(v.s,b.scale,a);
        }
      }

      let fade=1,lidB=.22;
      const mem=(p,a,lag)=>{
        for(const s of "LR"){
          const g=s==="L"?1:-1;
          for(let i=1;i<=4;i++){
            B["Mem_"+s+"_0"+i].rotation.z=
              g*a*Math.sin(p-lag*i)*(.5+.2*i);
          }
        }
      };
      const wj=(s,j,sw=0,tw=0)=>{
        const g=s==="L"?1:-1;
        for(let i=0;i<3;i++){
          B["Wing_"+s+"_0"+(i+1)].rotation.set(
            i?0:sw,
            i?0:tw*g,
            -g*j[i]
          );
        }
        B["WingTip_"+s].rotation.z=-g*j[3];
      };
      const flap=(p,o)=>{
        for(const s of "LR"){
          const k=s==="L"?(o.kl??1):(o.kr??1);
          const j=[];
          for(let i=0;i<4;i++){
            j.push(
              o.b[i]+
              o.a*k*[1,.6,.7,.8][i]*
              Math.sin(p-o.lag*i)
            );
          }
          wj(
            s,j,
            o.sw||0,
            (o.tw||0)*Math.cos(p)
          );
        }
        mem(p,o.m??.5,o.lag);
      };
      const tend=(p,a,l=0)=>{
        for(let i=1;i<=3;i++){
          B["Tendril_0"+i].rotation.set(
            l/3+a*.5*Math.sin(p-i*.8),
            0,
            a*.35*Math.sin(p-i*1.3)
          );
        }
      };

      function hover(f){
        const p=TAU*f/30;
        body.position.y=.12*Math.sin(p-1.2);
        body.rotation.set(
          .04*Math.sin(p+.5),
          0,
          .03*Math.sin(p/2)
        );
        flap(p,{
          b:[.55,.15,0,-.05],
          a:.3,lag:.6,m:.5
        });
        tend(p,.4);
      }
      function fly(f){
        const p=TAU*f/24;
        body.position.y=.18*Math.sin(p-1.1);
        body.rotation.set(
          .22+.05*Math.sin(2*p),
          0,
          .05*Math.sin(p)
        );
        flap(p,{
          b:[.85,.2,-.05,-.1],
          a:.75,lag:.55,sw:-.15,m:.8
        });
        tend(p,.8,.5);
      }
      function flyFast(f){
        const p=TAU*f/18;
        body.position.y=.1*Math.sin(p-1.1);
        body.rotation.set(
          .62+.03*Math.sin(2*p),
          0,
          .03*Math.sin(p)
        );
        flap(p,{
          b:[.95,-.1,-.3,-.3],
          a:.65,lag:.5,sw:-.3,m:1.2
        });
        tend(p,.7,1.1);
      }
      function dStart(f){
        body.position.y=kf(f,[
          [0,0],[10,.3],[30,.1]
        ]);
        body.rotation.set(
          kf(f,[
            [0,.04],[10,-.4],
            [18,-.3],[30,1.15]
          ]),
          0,0
        );
        const j=[
          kf(f,[[0,.55],[8,.08],[16,.05],[30,.15]]),
          kf(f,[[0,.15],[10,0],[18,-.5],[30,-1]]),
          kf(f,[[0,0],[10,-.1],[18,-.45],[30,-.85]]),
          kf(f,[[0,-.05],[18,-.3],[30,-.7]])
        ];
        for(const s of "LR"){
          wj(
            s,j,
            kf(f,[[0,0],[16,-.1],[30,-.55]])
          );
        }
        mem(f*.9,.4,.5);
        tend(
          f*.5,.3,
          kf(f,[[0,0],[30,1.3]])
        );
        lidB=.22*(1-smooth(10,30,f));
        ball.rotation.x=.3*smooth(14,30,f);
      }
      function dLoop(f){
        const p=TAU*f/12;
        body.rotation.set(
          1.2+.03*Math.sin(p),0,0
        );
        for(const s of "LR"){
          wj(s,[.15,-1,-.85,-.7],-.55);
        }
        mem(p,.9,.3);
        tend(p,.5,1.3);
        lidB=0;
      }
      function dHit(f){
        const a=kf(f,[
          [0,1],[3,.7],[9,1.15],[18,1]
        ]);
        const q=1+(1-a)*.4;
        body.scale.set(q,q,a);

        body.rotation.set(
          kf(f,[
            [0,1.2],[3,1.35],
            [8,.5],[18,.1]
          ]),
          0,
          .1*Math.sin(f*1.5)*(1-f/18)
        );

        const j=[
          kf(f,[[0,.15],[3,.15],[8,.5],[18,.9]]),
          kf(f,[[0,-1],[3,-1],[10,-.2],[18,.1]]),
          kf(f,[[0,-.85],[8,-.4],[18,0]]),
          kf(f,[[0,-.7],[18,-.05]])
        ];

        for(const s of "LR"){
          wj(
            s,j,
            kf(f,[[0,-.55],[18,0]])
          );
        }

        mem(f*.5,.8,.5);
        tend(
          f*.4,.6,
          kf(f,[[0,1.3],[18,0]])
        );
        lidB=.22+1.1*kf(f,[
          [0,0],[2,1],[8,.9],[14,0]
        ]);
      }
      function dRec(f){
        const p=TAU*(f-8)/14;
        body.rotation.set(
          kf(f,[
            [0,.1],[8,-.35],
            [20,-.15],[36,.04]
          ]),
          0,0
        );
        body.position.y=
          .12*Math.sin(p-1.2)*
          smooth(14,36,f);

        if(f<8){
          const j=[
            kf(f,[[0,.9],[4,1.45],[8,.85]]),
            kf(f,[[0,.1],[4,.1],[8,.2]]),
            kf(f,[[0,0],[8,-.05]]),
            kf(f,[[0,-.05],[8,-.1]])
          ];
          for(const s of "LR")wj(s,j);
          mem(f,.3,.5);
        }else{
          flap(p,{
            b:[
              .85-.3*smooth(24,36,f),
              .2,-.05,-.1
            ],
            a:.8*(1-.65*smooth(22,36,f)),
            lag:.55,m:.7
          });
        }

        tend(p,.5,.4);
        lidB=.22+.8*(1-smooth(0,6,f));
      }
      function hit(f){
        const d=kf(f,[
          [0,0],[3,1],[18,0]
        ]);
        body.position.z=-.6*d;
        body.rotation.set(
          -.5*d,
          0,
          .25*Math.sin(f*1.6)*(1-f/18)
        );
        for(const s of "LR"){
          wj(s,[
            .55+.95*d,
            .15+.4*d,
            -.1*d,
            -.1*d
          ]);
        }
        mem(f*1.2,.9*d+.2,.5);
        tend(f*.3,.5,-.8*d);
        lidB=.22+.8*kf(f,[
          [0,0],[3,1],[10,.5],[18,0]
        ]);
        ball.rotation.set(
          .3*Math.sin(f*2.5)*(1-f/18),
          .2*Math.sin(f*3),
          0
        );
      }
      function death(f){
        const s=smooth(0,40,f);
        body.rotation.set(
          kf(f,[[0,0],[30,.6],[60,.3]]),
          0,
          kf(f,[[0,0],[60,2.8]])
        );
        flap(TAU*f/20,{
          b:[.6+1.1*s,.3*s,.2*s,.1*s],
          a:.6*(1-smooth(0,28,f)),
          lag:.6,m:.3
        });
        tend(f*.2,.3*(1-s));
        ball.rotation.x=-.9*smooth(10,30,f);
        lidB=.22+1.3*smooth(18,34,f);
        fade=kf(f,[
          [0,1],[40,1],[60,0]
        ]);
      }

      const CL={
        Eye_Hover:{len:60,loop:1,fn:hover},
        Eye_Fly:{len:24,loop:1,fn:fly},
        Eye_FlyFast:{len:18,loop:1,fn:flyFast},
        Eye_Dive_Start:{len:30,fn:dStart,nolook:1,noblink:1},
        Eye_Dive_Loop:{len:12,loop:1,fn:dLoop,nolook:1,noblink:1},
        Eye_Dive_Hit:{len:18,fn:dHit,nolook:1,noblink:1},
        Eye_Dive_Recovery:{len:36,fn:dRec,nolook:1,noblink:1},
        Eye_Hit:{len:18,fn:hit,nolook:1,noblink:1},
        Eye_Death:{len:60,fn:death,nolook:1,noblink:1,hold:1}
      };

      let clip="Eye_Hover";
      let elapsed=0;
      let prevFrame=-1;
      let queue=[];
      let blinkAt=2+Math.random()*3;
      let blinkStart=-9;

      function play(name,chain=null){
        captureEyeTransition();
        clip=name;
        elapsed=0;
        prevFrame=-1;
        queue=chain?chain.slice():queue;
      }

      function attackChain(){
        queue=[
          "Eye_Dive_Loop",
          "Eye_Dive_Hit",
          "Eye_Dive_Recovery"
        ];
        play("Eye_Dive_Start");
      }

      function apply(dt,target){
        const c=CL[clip];
        elapsed+=dt;
        let f=elapsed*30;
        let ended=false;

        if(c.loop){
          f%=c.len;
        }else if(f>=c.len){
          f=c.len;
          ended=true;
        }

        reset();
        fade=1;
        lidB=.22;
        c.fn(f);
        blendEyeTransition(performance.now()/1000);

        MT.forEach(m=>{
          m.opacity=m.userData.o*fade;
        });

        entity.updateMatrixWorld(true);

        if(target&&!c.nolook){
          const local=body.worldToLocal(target.clone());
          const yw=clamp(
            Math.atan2(local.x,local.z),
            -.9,.9
          );
          const pt=clamp(
            -Math.atan2(
              local.y,
              Math.hypot(local.x,local.z)
            ),
            -.6,.6
          );
          ball.rotation.set(pt,yw,0);
        }

        blinkAt-=dt;
        if(blinkAt<=0){
          blinkStart=.001;
          blinkAt=2.5+Math.random()*3;
        }
        if(blinkStart>=0){
          blinkStart+=dt;
          if(blinkStart>.2)blinkStart=-1;
        }
        const bl=
          blinkStart>=0&&!c.noblink
            ? Math.sin(blinkStart/.2*Math.PI)
            : 0;

        lid.rotation.x=clamp(
          lidB+bl*(1.45-lidB),
          0,1.5
        );
        updateEyeSheets();
        ball.rotation.y+=.009*Math.sin(performance.now()*.029)*Math.pow(Math.max(0,Math.sin(performance.now()*.0014)),16);

        entity.updateMatrixWorld(true);
        upMem();

        const crossed=(frame)=>{
          if(prevFrame<0)return f>=frame;
          if(c.loop&&f<prevFrame){
            return frame>prevFrame||frame<=f;
          }
          return frame>prevFrame&&frame<=f;
        };

        const result={
          clip,
          frame:f,
          hit:
            clip==="Eye_Dive_Hit" &&
            crossed(3)
        };

        prevFrame=f;

        if(ended&&!c.hold){
          if(queue.length){
            const next=queue.shift();
            play(next);
          }else{
            play("Eye_Hover");
          }
        }

        return result;
      }

      function dispose(){
        entity.visible=false;
        for(const s of "LR"){
          WG[s].mesh.visible=false;
        }
      }

      return {
        root:entity,
        apply,
        play,
        attackChain,
        dispose,
        get clip(){return clip;},
        get materials(){return MT;},
        modelSet:"REWORK-2026"
      };
    }

    // ==========================================================
    // NOCTURNE
    // Exact custom rig and animation functions adapted from the
    // supplied Nocturne HTML, without its preview renderer/particles.
    // ==========================================================
    function buildNocturne(){
      const entity=new T.Group();
      entity.name="Enemy_Nocturne";
      game.scene.add(entity);

      const MT=[];
      const WS=[];

      const mk=(c,o)=>{
        const m=new T.MeshStandardMaterial({
          color:c,
          roughness:1,
          flatShading:true,
          transparent:true,
          opacity:o,
          depthWrite:o>.9
        });
        m.userData.o=o;
        MT.push(m);
        return m;
      };

      const core=mk(0x1c1b2a,.97);
      const smoke=mk(0x3a3852,.4);
      const claw=mk(0x0b0a10,1);
      const eyeM=new T.MeshBasicMaterial({
        color:0xffffff,
        transparent:true
      });
      eyeM.userData.o=1;
      MT.push(eyeM);

      const B={};

      function bn(n,p,x,y,z){
        const b=new T.Bone();
        b.name=n;
        b.position.set(x,y,z);
        (p||entity).add(b);
        B[n]=b;
        return b;
      }
      function ms(g,m,p,x=0,y=0,z=0){
        const o=new T.Mesh(g,m);
        o.position.set(x,y,z);
        o.castShadow=true;
        o.receiveShadow=false;
        p.add(o);
        return o;
      }
      function wisp(
        p,r,x,y,z,
        sx=1,sy=1,sz=1
      ){
        const m=ms(
          new T.IcosahedronGeometry(r,1),
          smoke,p,x,y,z
        );
        m.userData={
          b:V(sx,sy,sz),
          ph:Math.random()*TAU
        };
        m.scale.copy(m.userData.b);
        WS.push(m);
      }

      const root=bn("Shadow_Root",0,0,0,0);
      const body=bn("Shadow_Body",root,0,2.3,0);
      const s1=bn("Spine_01",body,0,.1,0);
      const s2=bn("Spine_02",s1,0,.25,0);
      const ch=bn("Chest",s2,0,.25,0);
      const nk=bn("Neck",ch,0,.4,.06);
      const hd=bn("Head",nk,0,.16,.06);

      ms(
        new T.SphereGeometry(.32,10,8),
        core,body
      ).scale.set(1,1.2,.9);

      ms(
        new T.SphereGeometry(.4,10,8),
        core,s2,0,.1,0
      ).scale.set(1.1,1.2,.9);

      ms(
        new T.SphereGeometry(.5,10,8),
        core,ch,0,.15,0
      ).scale.set(1.35,.9,.9);

      ms(
        new T.CylinderGeometry(.1,.15,.3,8),
        core,nk,0,.08,0
      );

      ms(
        new T.SphereGeometry(.26,10,8),
        core,hd,0,.1,.06
      ).scale.set(1,.95,1.1);

      const jw=ms(
        new T.ConeGeometry(.12,.22,6),
        core,hd,0,.02,.3
      );
      jw.rotation.x=Math.PI/2;

      for(const s of[-1,1]){
        ms(
          new T.SphereGeometry(.035,6,6),
          eyeM,hd,.09*s,.14,.3
        );
      }

      wisp(hd,.2,0,.32,-.1,1,1.6,1);
      wisp(ch,.32,0,.55,-.1,2,.9,1);
      wisp(s2,.4,0,.1,-.25,1.3,1.4,.8);

      const TL=[.4,.4,.38,.36,.34];
      let tp=body;

      for(let i=0;i<5;i++){
        const b=bn(
          "SmokeTail_0"+(i+1),
          tp,
          0,
          i?-TL[i-1]:-.1,
          0
        );

        const r0=.34-.055*i;
        const r1=Math.max(
          .04,
          .34-.055*(i+1)
        );

        ms(
          new T.CylinderGeometry(
            r0,r1,TL[i],9,1
          ),
          mk(0x1f1e2e,.88-.15*i),
          b,0,-TL[i]/2,0
        );

        wisp(
          b,r0*1.5,
          0,-TL[i]/2,0,
          1,1.1,1
        );

        tp=b;
      }

      const L1=.75,L2=.75;

      for(const s of "LR"){
        const g=s==="L"?1:-1;
        const sh=bn(
          "Shoulder_"+s,
          ch,.52*g,.38,0
        );
        const ua=bn(
          "UpperArm_"+s,
          sh,.12*g,0,0
        );
        const fo=bn(
          "Forearm_"+s,
          ua,0,-L1,0
        );
        const ha=bn(
          "Hand_"+s,
          fo,0,-L2,0
        );

        ms(
          new T.SphereGeometry(.26,8,8),
          core,sh
        ).scale.set(1,.9,1);

        wisp(
          sh,.3,.1*g,.18,0,
          1.3,1.4,1
        );

        ms(
          new T.CylinderGeometry(.15,.11,L1,8),
          core,ua,0,-L1/2,0
        );

        ms(
          new T.CylinderGeometry(.11,.08,L2,8),
          core,fo,0,-L2/2,0
        );

        wisp(
          fo,.16,0,-L2/2,0,
          1,2,1
        );

        ms(
          new T.SphereGeometry(.11,8,8),
          core,ha,0,-.08,0
        ).scale.set(1,1.2,1.1);

        for(let i=1;i<=3;i++){
          const fb=bn(
            "Claw_"+s+i,
            ha,(i-2)*.07,-.16,0
          );
          const c=ms(
            new T.ConeGeometry(.028,.26,5),
            claw,fb,0,-.13,0
          );
          c.rotation.x=Math.PI;
        }
      }

      const rest={};
      for(const n in B){
        rest[n]={
          p:B[n].position.clone(),
          q:B[n].quaternion.clone()
        };
      }

      function reset(){
        for(const n in B){
          B[n].position.copy(rest[n].p);
          B[n].quaternion.copy(rest[n].q);
          B[n].scale.set(1,1,1);
        }
      }

      // V71B — Nocturne REWORK visual on the existing gameplay rig.
      const noctVisualMeshes=[];
      const noctSmokeShells=[];
      function noctNoise3(x,y,z){return Math.sin(x*13+y*7+z*9)*Math.sin(y*19-z*11+x*5);}
      function noctOrganic(rx,ry,rz,amount=.045){
        const g=new T.SphereGeometry(1,26,18),a=g.attributes.position;
        for(let i=0;i<a.count;i++){
          const x=a.getX(i),y=a.getY(i),z=a.getZ(i),kk=1+amount*noctNoise3(x,y,z);
          a.setXYZ(i,x*rx*kk,y*ry*kk,z*rz*kk);
        }
        g.computeVertexNormals(); return g;
      }
      function noctTube(points,radii,sides=9,steps=24){
        const curve=new T.CatmullRomCurve3(points.map(p=>V(...p))),frames=curve.computeFrenetFrames(steps,false),a=[],uv=[],ix=[];
        for(let j=0;j<=steps;j++){
          const u=j/steps,p=curve.getPointAt(u),ri=u*(radii.length-1),lo=Math.floor(ri),r=T.MathUtils.lerp(radii[lo],radii[Math.min(radii.length-1,lo+1)],ri%1);
          for(let k=0;k<=sides;k++){
            const ang=k/sides*TAU,c=Math.cos(ang)*r,s=Math.sin(ang)*r,n=frames.normals[j],bb=frames.binormals[j];
            a.push(p.x+n.x*c+bb.x*s,p.y+n.y*c+bb.y*s,p.z+n.z*c+bb.z*s); uv.push(k/sides,u);
            if(j<steps&&k<sides){const q=j*(sides+1)+k;ix.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}
          }
        }
        const g=new T.BufferGeometry(); g.setAttribute('position',new T.Float32BufferAttribute(a,3)); g.setAttribute('uv',new T.Float32BufferAttribute(uv,2)); g.setIndex(ix); g.computeVertexNormals(); return g;
      }
      function noctSculpt(g,m,p,x=0,y=0,z=0){const o=ms(g,m,p,x,y,z);o.userData.rework=true;noctVisualMeshes.push(o);return o;}
      function noctClearVisual(p){for(const o of [...p.children])if(o.isMesh){p.remove(o);o.geometry?.dispose?.();}}
      function noctTexture(){
        const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),d=ctx.createImageData(128,128);let seed=913;
        for(let i=0;i<d.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const v=135+(seed>>>24)*.35;d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255;}ctx.putImageData(d,0,0);
        const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,3);return t;
      }
      function noctSurface(m){m.flatShading=false;m.roughness=.96;m.bumpMap=noctTexture();m.bumpScale=.0015;m.roughnessMap=m.bumpMap;m.needsUpdate=true;}

      for(const b of Object.values(B)) noctClearVisual(b); WS.length=0;
      core.color.set(0x11171c); claw.color.set(0x080b0e); smoke.color.set(0x46515b); noctSurface(core); noctSurface(claw);
      noctSculpt(noctOrganic(.38,.55,.32,.12),core,body,0,.05,0);
      noctSculpt(noctOrganic(.58,.52,.4,.13),core,s2,0,.08,-.04);
      noctSculpt(noctOrganic(.86,.49,.43,.10),core,ch,0,.2,-.03);
      nk.position.set(0,.12,.18); rest.Neck.p.copy(nk.position); hd.position.set(0,.02,.18); rest.Head.p.copy(hd.position);
      noctSculpt(noctOrganic(.25,.31,.25,.13),core,hd,0,0,.04);
      noctSculpt(noctTube([[0,.1,.08],[0,-.14,.18],[0,-.3,.12]],[.19,.14,0]),core,hd);
      for(const s of[-1,1]) noctSculpt(noctOrganic(.029,.037,.018,0),eyeM,hd,s*.095,.015,.268);
      for(const side of 'LR'){
        const sign=side==='L'?1:-1,sh=B['Shoulder_'+side],ua=B['UpperArm_'+side],fo=B['Forearm_'+side],hand=B['Hand_'+side];
        sh.position.x=sign*.72; rest[sh.name].p.copy(sh.position);
        noctSculpt(noctOrganic(.32,.3,.31,.14),core,sh,0,.02,0);
        noctSculpt(noctTube([[0,.05,0],[sign*.07,-.32,-.035],[0,-.77,0]],[.23,.20,.105]),core,ua);
        noctSculpt(noctTube([[0,.045,0],[-sign*.05,-.29,.06],[0,-.78,0]],[.13,.19,.085]),core,fo);
        noctSculpt(noctOrganic(.16,.21,.105,.09),core,hand,0,-.10,0);
        for(let i=1;i<=3;i++){
          const bb=B['Claw_'+side+i]; bb.position.x=(i-2)*.11; rest[bb.name].p.copy(bb.position);
          noctSculpt(noctTube([[0,.035,0],[(i-2)*.035,-.15,.04],[(i-2)*.04,-.31,.1],[0,-.4,.23]],[.048,.035,.021,0],9,18),claw,bb);
        }
        noctSculpt(noctTube([[sign*.1,-.08,0],[sign*.25,-.16,.09],[sign*.26,-.29,.22],[sign*.18,-.31,.28]],[.065,.045,.025,0]),claw,hand);
      }
      for(let i=1;i<=5;i++){
        const bb=B['SmokeTail_0'+i],r=.37-(i-1)*.065;
        const mm=core.clone();mm.transparent=true;mm.opacity=.86-i*.07;mm.userData.o=mm.opacity;MT.push(mm);
        const seg=noctSculpt(noctTube([[0,.07,0],[.04,-.2,0],[0,-TL[i-1]-.04,0]],[r,r*.84,Math.max(.005,r-.06)]),mm,bb); seg.visible=false;
      }
      for(const boneNode of [ch,B.Shoulder_L,B.Shoulder_R,s2,hd]){
        for(let i=0;i<5;i++){
          const x=(i-2)*.1; const o=noctSculpt(noctTube([[x,.12,-.08],[x+.09,.3,-.12],[x-.05,.5,-.1],[x+.08,.72,-.16]],[.095,.08,.045,0],7,16),core,boneNode); o.scale.y=.6+(i%3)*.27;
        }
      }

      const noctNoiseGLSL=`float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float ns(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}float fb(vec3 p){return .57*ns(p)+.28*ns(p*2.03)+.15*ns(p*4.1);}`;
      for(const o of [...noctVisualMeshes]){
        if(o.material===eyeM||o.material===claw||o.parent?.name?.startsWith('SmokeTail'))continue;
        const mat=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,uniforms:{time:{value:0},fade:{value:1},phase:{value:noctVisualMeshes.indexOf(o)*1.7}},vertexShader:`uniform float time;uniform float phase;varying vec3 p;varying vec3 norm;varying vec3 view;${noctNoiseGLSL}void main(){p=position;float n=fb(position*9.+vec3(phase,-time*.8,0));vec3 pos=position+normal*(.018+.09*n);vec4 mv=modelViewMatrix*vec4(pos,1.);norm=normalize(normalMatrix*normal);view=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}`,fragmentShader:`uniform float time;uniform float fade;uniform float phase;varying vec3 p;varying vec3 norm;varying vec3 view;${noctNoiseGLSL}void main(){float n=fb(p*12.+vec3(phase,-time,0));float fr=pow(1.-abs(dot(normalize(norm),normalize(view))),1.3);float a=smoothstep(.31,.66,n)*(.10+fr*.40)*fade;if(a<.018)discard;gl_FragColor=vec4(mix(vec3(.07,.09,.11),vec3(.23,.26,.29),n),a);}`});
        const shell=new T.Mesh(o.geometry,mat);shell.position.copy(o.position);shell.rotation.copy(o.rotation);shell.scale.copy(o.scale);o.parent.add(shell);noctSmokeShells.push(shell);
      }

      // Continuous smoke-tail mesh in ENTITY LOCAL coordinates.
      const tailSources=[body,...Array.from({length:5},(_,i)=>B['SmokeTail_0'+(i+1)])];
      const tailPoints=tailSources.map(()=>V(0,0,0));tailPoints.push(V(0,0,0));
      const tailCurve=new T.CatmullRomCurve3(tailPoints),tailGeom=new T.BufferGeometry(),tailSegments=40,tailSides=10;
      const tailPos=new Float32Array((tailSegments+1)*(tailSides+1)*3),tailIndex=[];
      for(let j=0;j<tailSegments;j++)for(let i=0;i<tailSides;i++){const aa=j*(tailSides+1)+i;tailIndex.push(aa,aa+1,aa+tailSides+1,aa+1,aa+tailSides+2,aa+tailSides+1);}
      tailGeom.setAttribute('position',new T.BufferAttribute(tailPos,3));tailGeom.setIndex(tailIndex);
      const tailMat=core.clone();tailMat.transparent=true;tailMat.opacity=.86;tailMat.userData.o=.86;MT.push(tailMat);
      const tailMesh=new T.Mesh(tailGeom,tailMat);tailMesh.frustumCulled=false;entity.add(tailMesh);
      const tailP=V(0,0,0),tailT=V(0,0,0),tailN=V(0,0,0),tailC=V(0,0,0),tailAxis=V(0,0,1);

      function updateNocturneVisualEffects(now){
        for(const s of noctSmokeShells){s.material.uniforms.time.value=now;s.material.uniforms.fade.value=fade;}
        entity.updateMatrixWorld(true);
        for(let i=0;i<tailSources.length;i++){
          tailSources[i].getWorldPosition(tailPoints[i]);entity.worldToLocal(tailPoints[i]);
        }
        tailPoints[6].copy(tailPoints[5]).addScaledVector(tailT.copy(tailPoints[5]).sub(tailPoints[4]).normalize(),.55);tailPoints[6].x+=.3*Math.sin(now*.7);
        for(let j=0;j<=tailSegments;j++){
          const u=j/tailSegments;tailCurve.getPoint(u,tailP);tailCurve.getTangent(u,tailT);tailN.crossVectors(tailT,tailAxis).normalize();if(tailN.lengthSq()<.001)tailN.set(1,0,0);tailC.crossVectors(tailN,tailT).normalize();
          const r=.38*Math.pow(1-u,.7);
          for(let k=0;k<=tailSides;k++){
            const aa=k/tailSides*TAU,rr=r*(1+.07*Math.sin(u*40+aa*3-now)),id=(j*(tailSides+1)+k)*3;
            tailPos[id]=tailP.x+rr*(tailN.x*Math.cos(aa)+tailC.x*Math.sin(aa));
            tailPos[id+1]=tailP.y+rr*(tailN.y*Math.cos(aa)+tailC.y*Math.sin(aa));
            tailPos[id+2]=tailP.z+rr*(tailN.z*Math.cos(aa)+tailC.z*Math.sin(aa));
          }
        }
        tailGeom.attributes.position.needsUpdate=true;tailMesh.visible=fade>.001;
        ch.scale.x*=1+.015*Math.sin(now*1.6);ch.scale.z*=1+.02*Math.sin(now*1.6);
        if(clip==='Shadow_Death') eyeM.opacity=Math.max(0,fade*fade);
      }

      const noctPoseNodes=Object.values(B),noctBlendPose=noctPoseNodes.map(b=>({p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
      let noctBlendStart=-10;
      function captureNoctTransition(){noctBlendStart=performance.now()/1000;for(let i=0;i<noctPoseNodes.length;i++){const b=noctPoseNodes[i],v=noctBlendPose[i];v.p.copy(b.position);v.q.copy(b.quaternion);v.s.copy(b.scale);}}
      function blendNoctTransition(now){let a=clamp((now-noctBlendStart)/.23,0,1);a=a*a*(3-2*a);if(a===1)return;for(let i=0;i<noctPoseNodes.length;i++){const b=noctPoseNodes[i],v=noctBlendPose[i];if(b===root)continue;b.position.lerpVectors(v.p,b.position,a);b.quaternion.slerpQuaternions(v.q,b.quaternion,a);b.scale.lerpVectors(v.s,b.scale,a);}}

      let fade=1;

      function arm(s,ux,uz,fx,hx,cu){
        const g=s==="L"?1:-1;
        B["UpperArm_"+s].rotation.set(
          ux,0,uz*g
        );
        B["Forearm_"+s].rotation.set(
          fx,0,0
        );
        B["Hand_"+s].rotation.set(
          hx,0,0
        );

        for(let i=1;i<4;i++){
          B["Claw_"+s+i].rotation.set(
            -cu,
            0,
            (i-2)*.15*g
          );
        }
      }

      function tail(p,lean,amp,st=1){
        for(let i=1;i<=5;i++){
          const b=B["SmokeTail_0"+i];
          b.rotation.set(
            lean*(i===1?.4:.15)+
            amp*Math.sin(p-i*.8)*(.3+.12*i),
            0,
            amp*.7*
            Math.sin(p*.8-i+1)*
            (.3+.1*i)
          );
          b.scale.y=st;
        }
      }

      const ph=q=>q==="L"?0:1.3;

      function idle(f){
        const p=TAU*f/90;
        const s=Math.sin(p);

        body.position.y=2.3+.12*s;
        s1.rotation.x=.05*Math.sin(p-.6);
        ch.rotation.y=.12*Math.sin(p+.5);
        hd.rotation.set(
          .06*s,
          .3*Math.sin(p),
          0
        );

        for(const q of "LR"){
          const a=p+ph(q);
          arm(
            q,
            -.12+.07*Math.sin(a),
            .4+.06*Math.sin(a+1),
            -.55+.1*Math.sin(a+.5),
            -.1,
            .35+.25*Math.sin(2*a)
          );
        }
        tail(p,0,.3);
      }

      function fly(f){
        const p=TAU*f/36;
        const s=Math.sin(p);

        body.position.y=
          2.25+.08*Math.sin(2*p);
        body.rotation.set(
          .32+.04*s,
          0,
          .06*Math.sin(p)
        );
        hd.rotation.x=-.25;

        for(const q of "LR"){
          arm(
            q,
            .45+.12*Math.sin(p+ph(q)),
            .55,
            -.35,
            -.1,
            .4+.2*Math.sin(2*p)
          );
        }

        tail(p,.35,.3,1.1);
      }

      function flyFast(f){
        const p=TAU*f/24;

        body.position.y=
          2.1+.04*Math.sin(2*p);
        body.rotation.set(
          .8,0,.04*Math.sin(p)
        );
        hd.rotation.x=-.6;
        ch.rotation.y=.05*Math.sin(p);

        for(const q of "LR"){
          arm(q,.95,.3,-.1,-.1,.5);
        }

        tail(p,.6,.15,1.3);
      }

      function attack(q,f){
        const g=q==="L"?1:-1;
        const o=q==="L"?"R":"L";
        const p=TAU*f/27;
        const pit=x=>kf(x,[
          [0,0],[14,-.25],
          [20,.45],[34,.25],[54,0]
        ]);

        body.position.y=
          2.3+.1*Math.sin(TAU*f/54);

        body.position.z=kf(f,[
          [0,0],[14,-.25],
          [20,1],[34,.8],[54,0]
        ]);

        body.rotation.x=pit(f);

        ch.rotation.y=-g*kf(f,[
          [0,0],[14,-.55],
          [20,.75],[34,.45],[54,0]
        ]);

        hd.rotation.x=
          -.2*smooth(14,20,f);

        arm(
          q,
          kf(f,[
            [0,-.12],[14,1],
            [20,-1.7],[34,-1.2],[54,-.12]
          ]),
          kf(f,[
            [0,.4],[14,1.1],
            [20,-.2],[34,.2],[54,.4]
          ]),
          kf(f,[
            [0,-.55],[14,-.2],
            [20,-.1],[34,-.7],[54,-.55]
          ]),
          kf(f,[
            [0,-.1],[14,.4],
            [20,-.3],[54,-.1]
          ]),
          kf(f,[
            [0,.3],[14,-.2],
            [20,.1],[26,.95],
            [34,.8],[54,.3]
          ])
        );

        arm(
          o,
          kf(f,[
            [0,-.12],[14,-.5],
            [20,.4],[54,-.12]
          ]),
          .5,-.5,-.1,.3
        );

        tail(p,.7*pit(f-5),.25);
      }

      function dash(f){
        const p=TAU*f/30;

        fade=kf(f,[
          [0,1],[9,1],
          [11,.04],[22,.04],
          [25,1]
        ]);

        body.position.y=
          2.3-
          .2*smooth(0,10,f)+
          .2*smooth(10,24,f)*
          (1-smooth(40,60,f));

        body.rotation.x=kf(f,[
          [0,0],[10,-.35],
          [16,.9],[24,.8],
          [28,.4],[44,.2],[60,0]
        ]);

        ch.rotation.y=
          .25*Math.sin(
            smooth(24,36,f)*Math.PI
          );

        hd.rotation.x=
          -.3*smooth(10,16,f)*
          (1-smooth(28,40,f));

        const ux=kf(f,[
          [0,-.12],[10,1],
          [22,.9],[28,-1.6],
          [44,-.9],[60,-.12]
        ]);

        const uz=kf(f,[
          [0,.4],[10,.9],
          [22,.3],[28,-.1],
          [44,.4],[60,.4]
        ]);

        for(const q of "LR"){
          arm(
            q,
            ux,uz,
            kf(f,[
              [0,-.5],[22,-.1],
              [28,-.1],[44,-.6],[60,-.5]
            ]),
            -.1,
            kf(f,[
              [0,.2],[24,-.2],
              [30,.95],[44,.5],[60,.3]
            ])
          );
        }

        tail(
          p,
          .8*kf(f-4,[
            [0,0],[10,-.3],
            [16,.9],[28,.5],
            [44,.2],[60,0]
          ]),
          .2,
          1+
          .3*smooth(10,22,f)*
          (1-smooth(28,44,f))
        );
      }

      function hit(f){
        const p=TAU*f/24;

        body.position.y=2.3;
        body.position.z=kf(f,[
          [0,0],[4,-.55],[24,0]
        ]);

        body.rotation.x=kf(f,[
          [0,0],[4,-.5],[24,0]
        ]);

        ch.rotation.z=
          .2*Math.sin(f*1.8)*
          (1-f/24);

        hd.rotation.x=
          .4*kf(f,[
            [0,0],[4,1],[24,0]
          ]);

        for(const q of "LR"){
          arm(
            q,
            kf(f,[
              [0,-.12],[4,.6],[24,-.12]
            ]),
            kf(f,[
              [0,.4],[4,.9],[24,.4]
            ]),
            -.4,-.1,.6
          );
        }

        fade=
          f<12
            ? .7+.3*Math.cos(f*1.2)
            : 1;

        tail(
          p,
          -.3*kf(f,[
            [0,0],[4,1],[24,0]
          ]),
          .35
        );
      }

      function death(f){
        const p=TAU*f/30;

        body.position.y=
          2.3-kf(f,[
            [0,0],[20,.2],[60,1.3]
          ]);

        body.rotation.x=kf(f,[
          [0,0],[20,-.4],[60,.3]
        ]);

        hd.rotation.x=kf(f,[
          [0,0],[20,.5],[60,.8]
        ]);

        body.scale.setScalar(
          kf(f,[
            [0,1],[60,.55]
          ])
        );

        fade=kf(f,[
          [0,1],[12,1],[56,0]
        ]);

        for(const q of "LR"){
          arm(
            q,
            kf(f,[
              [0,-.12],[30,.3]
            ]),
            kf(f,[
              [0,.4],[30,.2]
            ]),
            -.2,.2,.1
          );
        }

        tail(
          p,0,
          .3+.5*smooth(0,50,f),
          1+.4*smooth(0,60,f)
        );
      }

      const CL={
        Shadow_Idle:{len:90,loop:1,fn:idle},
        Shadow_Fly:{len:36,loop:1,fn:fly},
        Shadow_FlyFast:{len:24,loop:1,fn:flyFast},
        Shadow_Attack_Left:{
          len:54,
          fn:f=>attack("L",f),
          hitFrame:20
        },
        Shadow_Attack_Right:{
          len:54,
          fn:f=>attack("R",f),
          hitFrame:20
        },
        Shadow_DashAttack:{
          len:60,
          fn:dash,
          hitFrame:28
        },
        Shadow_Hit:{len:24,fn:hit},
        Shadow_Death:{
          len:60,fn:death,hold:1
        }
      };

      let clip="Shadow_Idle";
      let elapsed=0;
      let prevFrame=-1;

      function play(name){
        captureNoctTransition();
        clip=name;
        elapsed=0;
        prevFrame=-1;
      }

      function apply(dt){
        const c=CL[clip];
        elapsed+=dt;

        let f=elapsed*30;
        let ended=false;

        if(c.loop){
          f%=c.len;
        }else if(f>=c.len){
          f=c.len;
          ended=true;
        }

        reset();
        fade=1;
        c.fn(f);
        blendNoctTransition(performance.now()/1000);

        MT.forEach(m=>{
          m.opacity=m.userData.o*fade;
        });

        const now=performance.now()/1000;
        WS.forEach(m=>{
          const kk=
            1+.12*Math.sin(
              now*3+m.userData.ph
            );
          m.scale.copy(
            m.userData.b
          ).multiplyScalar(kk);
        });
        updateNocturneVisualEffects(now);

        const crossed=(frame)=>{
          if(prevFrame<0)return f>=frame;
          if(c.loop&&f<prevFrame){
            return frame>prevFrame||frame<=f;
          }
          return frame>prevFrame&&frame<=f;
        };

        const result={
          clip,
          frame:f,
          hit:
            c.hitFrame!=null &&
            crossed(c.hitFrame)
        };

        prevFrame=f;

        if(ended&&!c.hold){
          play("Shadow_Idle");
        }

        return result;
      }

      return {
        root:entity,
        apply,
        play,
        get clip(){return clip;},
        modelSet:"REWORK-2026"
      };
    }

    // ==========================================================
    // ORC ARQUEIRO
    // Exact custom rig/bow/IK/shoot animation adapted from the
    // supplied Orc Arqueiro HTML.
    // ==========================================================
    function buildOrcArcher(){
      const entity=new T.Group();
      entity.name="Enemy_OrcArcher";
      game.scene.add(entity);

      const M=c=>new T.MeshStandardMaterial({
        color:c,
        roughness:.85,
        flatShading:true
      });

      const skin=M(0x6f8230);
      const lea=M(0x6b4423);
      const leaD=M(0x3e2a1a);
      const cloth=M(0x3a3a44);
      const wood=M(0x8a5a2b);
      const metal=M(0x5b6066);
      const bone=M(0xd8d0b0);
      const eye=M(0xe8c020);

      const B={};

      function bn(
        n,p,x,y,z,rx=0
      ){
        const b=new T.Bone();
        b.name=n;
        b.position.set(x,y,z);
        b.rotation.x=rx;
        (p||entity).add(b);
        B[n]=b;
        return b;
      }

      function ms(
        g,m,p,x=0,y=0,z=0
      ){
        const o=new T.Mesh(g,m);
        o.position.set(x,y,z);
        o.castShadow=true;
        o.receiveShadow=false;
        p.add(o);
        return o;
      }

      const root=bn("Orc_Root",0,0,0,0);
      const pel=bn("Pelvis",root,0,1.1,0);

      ms(
        new T.BoxGeometry(.6,.3,.4),
        cloth,pel
      );
      ms(
        new T.BoxGeometry(.64,.08,.44),
        leaD,pel,0,.12,0
      );

      const s1=bn(
        "Spine_01",
        pel,0,.12,0,.25
      );
      const s2=bn(
        "Spine_02",
        s1,0,.2,0,.2
      );
      const ch=bn(
        "Chest",
        s2,0,.2,0,.15
      );

      ms(
        new T.SphereGeometry(.34,10,8),
        skin,s1,0,.1,.06
      ).scale.set(1.1,1,.9);

      ms(
        new T.BoxGeometry(1,.6,.55),
        skin,ch,0,.22,0
      );

      ms(
        new T.BoxGeometry(1.02,.5,.6),
        lea,ch,0,.18,-.01
      );

      const nk=bn(
        "Neck",
        ch,0,.5,.05,.3
      );
      const hd=bn(
        "Head",
        nk,0,.12,.04,.25
      );

      ms(
        new T.SphereGeometry(.2,12,10),
        skin,hd,0,.1,.08
      ).scale.set(1.15,.95,1.1);

      ms(
        new T.ConeGeometry(.27,.32,8),
        cloth,hd,0,.2,0
      );

      const jw=bn(
        "Jaw",
        hd,0,0,.12
      );

      ms(
        new T.BoxGeometry(.22,.07,.18),
        skin,jw,0,-.03,.08
      );

      for(const s of[-1,1]){
        ms(
          new T.ConeGeometry(.025,.12,6),
          bone,jw,.07*s,.05,.15
        );
        ms(
          new T.SphereGeometry(.025,6,6),
          eye,hd,.08*s,.14,.2
        );
      }

      const L1=.44,L2=.44;

      for(const s of "LR"){
        const g=s==="L"?1:-1;

        const cla=bn(
          "Clavicle_"+s,
          ch,.4*g,.42,0
        );

        const up=bn(
          "UpperArm_"+s,
          cla,.14*g,0,0
        );

        ms(
          new T.SphereGeometry(.17,8,8),
          lea,cla,.06*g,0,0
        );

        ms(
          new T.CylinderGeometry(
            .13,.1,L1,8
          ),
          skin,up,0,-L1/2,0
        );

        const fo=bn(
          "Forearm_"+s,
          up,0,-L1,0
        );

        ms(
          new T.CylinderGeometry(
            .1,.09,L2,8
          ),
          lea,fo,0,-L2/2,0
        );

        const ha=bn(
          "Hand_"+s,
          fo,0,-L2,0
        );

        ms(
          new T.SphereGeometry(.1,8,8),
          skin,ha,0,-.06,0
        ).scale.set(1,1.2,1);

        for(let i=0;i<3;i++){
          bn(
            "Finger_"+s+(i+1),
            ha,(i-1)*.05,-.14,.02
          );
        }

        const th=bn(
          "Thigh_"+s,
          pel,.2*g,-.05,0
        );
        const ca=bn(
          "Calf_"+s,
          th,0,-.5,0
        );
        const ft=bn(
          "Foot_"+s,
          ca,0,-.5,0
        );

        ms(
          new T.CylinderGeometry(
            .15,.12,.5,8
          ),
          cloth,th,0,-.25,0
        );
        ms(
          new T.CylinderGeometry(
            .11,.1,.5,8
          ),
          leaD,ca,0,-.25,0
        );
        ms(
          new T.BoxGeometry(.18,.1,.34),
          leaD,ft,0,-.04,.08
        );

        bn(
          "Toe_"+s,
          ft,0,-.08,.24
        );
      }

      const BS=new T.Object3D();
      BS.name="BowSocket";
      B.Hand_L.add(BS);

      const AS=new T.Object3D();
      AS.name="ArrowSocket";
      B.Hand_R.add(AS);
      B.ArrowSocket=AS;

      const QS=new T.Object3D();
      QS.name="QuiverSocket";
      QS.position.set(-.2,.35,-.34);
      ch.add(QS);

      const qDirL=
        V(.15,1,-.1).normalize();

      const qm=ms(
        new T.CylinderGeometry(.11,.08,.5,8),
        leaD,QS,0,.12,0
      );
      qm.quaternion.setFromUnitVectors(
        V(0,1,0),
        qDirL
      );

      const Z=V(0,0,1);

      function newArrow(addWorld=true){
        const g=new T.Group();
        const L=.85;

        const sh=ms(
          new T.CylinderGeometry(
            .012,.012,L,5
          ),
          wood,g,0,0,L/2
        );
        sh.rotation.x=Math.PI/2;

        const tp=ms(
          new T.ConeGeometry(
            .035,.12,6
          ),
          metal,g,0,0,L+.04
        );
        tp.rotation.x=Math.PI/2;

        ms(
          new T.BoxGeometry(.08,.01,.14),
          leaD,g,0,0,.08
        );
        ms(
          new T.BoxGeometry(.01,.08,.14),
          leaD,g,0,0,.08
        );

        if(addWorld)game.scene.add(g);
        return g;
      }

      for(let i=0;i<3;i++){
        const a=newArrow(false);
        QS.add(a);
        a.position.set(
          (i-1)*.05,
          0,
          .03*i
        );
        a.quaternion.setFromUnitVectors(
          Z,qDirL
        );
      }

      const bp=[];
      for(let i=0;i<=16;i++){
        const z=-.62+1.24*i/16;
        bp.push(
          V(
            0,
            .22*(z/.62)**2,
            z
          )
        );
      }

      ms(
        new T.TubeGeometry(
          new T.CatmullRomCurve3(bp),
          24,.02,6
        ),
        wood,BS
      );

      ms(
        new T.BoxGeometry(.05,.05,.16),
        leaD,BS
      );

      const sg=new T.BufferGeometry();
      sg.setAttribute(
        "position",
        new T.BufferAttribute(
          new Float32Array(9),3
        )
      );

      const strL=new T.Line(
        sg,
        new T.LineBasicMaterial({
          color:0xe8e0b8
        })
      );
      strL.frustumCulled=false;
      BS.add(strL);

      function setStr(x,y,z){
        const a=sg.attributes.position;
        a.array.set([
          0,.22,-.62,
          x,y,z,
          0,.22,.62
        ]);
        a.needsUpdate=true;
      }
      setStr(0,.22,0);

      const rest={};
      for(const n in B){
        rest[n]={
          p:B[n].position.clone(),
          q:B[n].quaternion.clone()
        };
      }

      function reset(){
        for(const n in B){
          B[n].position.copy(rest[n].p);
          B[n].quaternion.copy(rest[n].q);
        }
      }

      // V71B — Orc Archer REWORK visual, keeping the original sockets/IK.
      const orcVisualMeshes=[];
      const orcSecondary=[];
      function orcNoise3(x,y,z){return Math.sin(x*13+y*7+z*9)*Math.sin(y*19-z*11+x*5);}
      function orcOrganic(rx,ry,rz,amount=.045){
        const g=new T.SphereGeometry(1,26,18),a=g.attributes.position;
        for(let i=0;i<a.count;i++){const x=a.getX(i),y=a.getY(i),z=a.getZ(i),kk=1+amount*orcNoise3(x,y,z);a.setXYZ(i,x*rx*kk,y*ry*kk,z*rz*kk);}g.computeVertexNormals();return g;
      }
      function orcTube(points,radii,sides=9,steps=24){
        const curve=new T.CatmullRomCurve3(points.map(p=>V(...p))),frames=curve.computeFrenetFrames(steps,false),a=[],uv=[],ix=[];
        for(let j=0;j<=steps;j++){const u=j/steps,p=curve.getPointAt(u),ri=u*(radii.length-1),lo=Math.floor(ri),r=T.MathUtils.lerp(radii[lo],radii[Math.min(radii.length-1,lo+1)],ri%1);
          for(let k=0;k<=sides;k++){const ang=k/sides*TAU,c=Math.cos(ang)*r,s=Math.sin(ang)*r,n=frames.normals[j],bb=frames.binormals[j];a.push(p.x+n.x*c+bb.x*s,p.y+n.y*c+bb.y*s,p.z+n.z*c+bb.z*s);uv.push(k/sides,u);if(j<steps&&k<sides){const q=j*(sides+1)+k;ix.push(q,q+1,q+sides+1,q+1,q+sides+2,q+sides+1);}}}
        const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();return g;
      }
      function orcSculpt(g,m,p,x=0,y=0,z=0){const o=ms(g,m,p,x,y,z);o.userData.rework=true;orcVisualMeshes.push(o);return o;}
      function orcClearVisual(p){for(const o of [...p.children])if(o.isMesh){p.remove(o);o.geometry?.dispose?.();}}
      function orcTexture(kind){
        const c=document.createElement('canvas');c.width=c.height=128;const ctx=c.getContext('2d'),d=ctx.createImageData(128,128);let seed=739;
        for(let i=0;i<d.data.length;i+=4){seed=(seed*1664525+1013904223)>>>0;const vv=150+(seed>>>24)*.3;d.data[i]=d.data[i+1]=d.data[i+2]=vv;d.data[i+3]=255;}ctx.putImageData(d,0,0);
        if(kind==='leather'){ctx.strokeStyle='#505050';ctx.lineWidth=.5;for(let j=0;j<90;j++){ctx.beginPath();ctx.moveTo((j*83)%128,(j*47)%128);ctx.lineTo((j*83)%128+6,(j*47)%128+13);ctx.stroke();}}
        const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(3,3);return t;
      }
      function orcSurface(m,kind='skin'){m.flatShading=false;m.roughness=kind==='skin'?.83:.94;m.bumpMap=orcTexture(kind);m.bumpScale=kind==='skin'?.002:.0015;m.roughnessMap=m.bumpMap;m.needsUpdate=true;}

      for(const bb of Object.values(B)) if(bb!==AS) orcClearVisual(bb);
      for(const mm of [skin,lea,leaD,cloth,wood,metal,bone]) orcSurface(mm,mm===skin?'skin':'leather');
      skin.color.set(0x71753d);lea.color.set(0x65412a);cloth.color.set(0x343936);metal.metalness=.65;metal.roughness=.65;
      orcSculpt(orcOrganic(.4,.27,.29,.025),cloth,pel,0,0,0);
      orcSculpt(orcOrganic(.43,.36,.32,.035),skin,s1,0,.11,.02);
      orcSculpt(orcOrganic(.59,.39,.37,.035),lea,ch,0,.17,-.02);
      for(const s of[-1,1])orcSculpt(orcOrganic(.30,.27,.30,.035),skin,ch,s*.27,.25,.11);
      for(let j=0;j<3;j++)orcSculpt(orcTube([[-.48,.29-j*.16,.24],[0,.20-j*.16,.38],[.48,.29-j*.16,.24]],[.06,.08,.06],10,22),leaD,ch);
      for(const s of[-1,1]){
        orcSculpt(orcTube([[s*.36,.53,-.16],[s*.40,.34,.25],[s*.31,-.04,.34]],[.08,.095,.08]),lea,ch);
        for(let j=0;j<5;j++)orcSculpt(orcOrganic(.017,.017,.012,0),metal,ch,s*(.39-j*.015),.38-j*.085,.34);
      }
      orcSculpt(orcTube([[-.37,.1,.12],[-.2,.1,.29],[.2,.1,.29],[.37,.1,.12]],[.06,.065,.065,.06]),leaD,pel);
      orcSculpt(orcOrganic(.072,.058,.018,0),metal,pel,0,.1,.35);
      orcSculpt(orcOrganic(.226,.225,.22,.035),skin,hd,0,.10,.07);
      orcSculpt(orcOrganic(.16,.09,.10,.025),skin,jw,0,-.025,.095);
      orcSculpt(orcOrganic(.15,.045,.035,.01),leaD,hd,0,.025,.252);
      orcSculpt(orcOrganic(.075,.065,.075,.04),skin,hd,0,.125,.255);
      for(const s of[-1,1]){
        orcSculpt(orcOrganic(.028,.019,.018,0),eye,hd,s*.092,.169,.245);
        const brow=orcSculpt(orcOrganic(.105,.04,.049,.02),skin,hd,s*.085,.204,.235);brow.rotation.z=-s*.19;
        orcSculpt(orcTube([[s*.108,-.02,.24],[s*.122,.035,.282],[s*.113,.103,.276]],[.031,.023,0],10,16),bone,jw);
        orcSculpt(orcOrganic(.052,.017,.07,.02),skin,hd,s*.05,.071,.23);
        for(let j=0;j<4;j++)orcSculpt(orcTube([[s*(.02+j*.025),0,.25],[s*(.019+j*.025),.024,.253]],[.012,.003],6,5),bone,jw);
        orcSculpt(orcTube([[s*.17,.14,.05],[s*.3,.18,-.01],[s*.34,.26,-.045]],[.07,.045,0]),skin,hd);
      }
      const hoodGeo=new T.BufferGeometry(),hoodPos=[],hoodIx=[];
      for(let j=0;j<=18;j++)for(let i=0;i<=36;i++){const aa=i/36*TAU,tt=.025+j/18*Math.PI*.85,r=.29;hoodPos.push(Math.sin(tt)*Math.cos(aa)*r,.11+Math.cos(tt)*.33,.02+Math.sin(tt)*Math.sin(aa)*.27);}
      for(let j=0;j<18;j++)for(let i=0;i<36;i++){const n=j*37+i,x=(hoodPos[n*3]+hoodPos[(n+38)*3])/2,y=(hoodPos[n*3+1]+hoodPos[(n+38)*3+1])/2,z=(hoodPos[n*3+2]+hoodPos[(n+38)*3+2])/2;if(z>.105&&y<.29)continue;hoodIx.push(n,n+1,n+37,n+1,n+38,n+37);}
      hoodGeo.setAttribute('position',new T.Float32BufferAttribute(hoodPos,3));hoodGeo.setIndex(hoodIx);hoodGeo.computeVertexNormals();cloth.side=T.DoubleSide;orcSculpt(hoodGeo,cloth,hd);
      const hp=[[-.24,-.08,.14],[-.25,.14,.18],[-.16,.29,.19],[0,.32,.20],[.16,.29,.19],[.25,.14,.18],[.24,-.08,.14]];orcSculpt(orcTube(hp,[.025,.037,.036,.04,.036,.037,.025]),cloth,hd);
      for(const side of'LR'){
        const sign=side==='L'?1:-1,sh=B['Clavicle_'+side],up=B['UpperArm_'+side],fo=B['Forearm_'+side],ha=B['Hand_'+side];
        orcSculpt(orcOrganic(.24,.22,.23,.035),lea,sh,.07*sign,.03,0);
        orcSculpt(orcTube([[0,.03,0],[sign*.04,-.19,.015],[0,-L1-.035,0]],[.18,.205,.125]),skin,up);
        orcSculpt(orcTube([[0,.03,0],[-sign*.025,-.18,.015],[0,-L2-.035,0]],[.135,.175,.108]),skin,fo);
        for(let j=0;j<5;j++){const g=new T.TorusGeometry(.133-j*.005,.025,8,18);g.rotateX(Math.PI/2);orcSculpt(g,j%2?lea:leaD,fo,0,-.18-j*.045,0);}
        orcSculpt(orcOrganic(.125,.10,.095,.035),skin,ha,0,-.034,.035);
        for(let i=1;i<=3;i++){const fb=B['Finger_'+side+i];fb.position.set((i-2)*.065,-.058,.055);rest[fb.name].p.copy(fb.position);orcSculpt(orcTube([[0,0,0],[0,-.07,.035],[0,-.09,.10],[0,-.045,.13]],[.027,.026,.023,.015],8,14),skin,fb);}
        orcSculpt(orcTube([[sign*.08,-.005,0],[sign*.135,-.03,.075],[sign*.07,-.05,.12]],[.037,.03,.02]),skin,ha);
        orcSculpt(orcTube([[0,.07,0],[0,-.23,.01],[0,-.54,0]],[.20,.19,.13]),cloth,B['Thigh_'+side]);
        orcSculpt(orcTube([[0,.04,0],[0,-.21,.01],[0,-.52,0]],[.15,.14,.11]),leaD,B['Calf_'+side]);
        orcSculpt(orcOrganic(.15,.087,.245,.015),leaD,B['Foot_'+side],0,-.04,.105);
        orcSculpt(orcOrganic(.15,.15,.065,.025),lea,B['Calf_'+side],0,0,.11);
        for(let j=0;j<4;j++){const g=new T.TorusGeometry(.146-j*.007,.018,6,18);g.rotateX(Math.PI/2);orcSculpt(g,lea,B['Calf_'+side],0,-.10-j*.085,0);}
      }
      for(const o of [...BS.children])if(o.isMesh){BS.remove(o);o.geometry?.dispose?.();}
      const bg=orcTube(bp.map(p=>[p.x,p.y,p.z]),[.010,.026,.037,.046,.04,.026,.01],12,48);const bow=orcSculpt(bg,wood,BS);bow.scale.x=.60;bow.userData.bow=true;orcSecondary.push(bow);
      for(let i=0;i<8;i++){const g=new T.TorusGeometry(.045,.007,6,14);orcSculpt(g,leaD,BS,0,0,-.075+i*.021);}
      qm.geometry?.dispose?.();qm.geometry=new T.CylinderGeometry(.15,.12,.59,18,1,true);qm.material=leaD;

      const orcPoseNodes=Object.values(B),orcBlendPose=orcPoseNodes.map(b=>({p:b.position.clone(),q:b.quaternion.clone(),s:b.scale.clone()}));
      let orcBlendStart=-10;
      function captureOrcTransition(){orcBlendStart=performance.now()/1000;for(let i=0;i<orcPoseNodes.length;i++){const b=orcPoseNodes[i],v=orcBlendPose[i];v.p.copy(b.position);v.q.copy(b.quaternion);v.s.copy(b.scale);}}
      function blendOrcTransition(now){let a=clamp((now-orcBlendStart)/.20,0,1);a=a*a*(3-2*a);if(a===1)return;for(let i=0;i<orcPoseNodes.length;i++){const b=orcPoseNodes[i],v=orcBlendPose[i];if(b===root)continue;b.position.lerpVectors(v.p,b.position,a);b.quaternion.slerpQuaternions(v.q,b.quaternion,a);b.scale.lerpVectors(v.s,b.scale,a);}}
      const orcQsRest=QS.rotation.clone();
      function updateOrcVisualEffects(now,f){
        QS.rotation.z=orcQsRest.z+.025*Math.sin(now*(clip==='Walk'?10:2));QS.rotation.x=orcQsRest.x+.025*Math.sin(now*3-.5);
        for(const s of'LR')for(let i=1;i<=3;i++)B['Finger_'+s+i].rotation.x=(clip==='Shoot'&&released&&s==='R'?-.42:0)+.035*Math.sin(now*2+i*.6);
        for(const o of orcSecondary)if(o.userData.bow)o.scale.y=1+(clip==='Shoot'&&!released?.12*smooth(50,74,f):0);
      }

      const YD=V(0,-1,0);

      function aim(b,t){
        b.parent.updateWorldMatrix(true,false);
        const p=W(b);
        const d=t.clone().sub(p).normalize();

        const w=
          new T.Quaternion()
            .setFromUnitVectors(YD,d);

        b.quaternion.copy(
          b.parent
            .getWorldQuaternion(
              new T.Quaternion()
            )
            .invert()
            .multiply(w)
        );
      }

      function ik(up,fo,t,pole){
        up.parent.updateWorldMatrix(true,false);
        const s=W(up);

        let dv=t.clone().sub(s);
        const d=Math.min(
          dv.length(),
          L1+L2-.003
        );
        dv.normalize();

        const a=
          (L1*L1-L2*L2+d*d)/
          (2*d);

        const h=Math.sqrt(
          Math.max(
            0,
            L1*L1-a*a
          )
        );

        const pv=pole.clone().sub(s);
        pv.sub(
          dv.clone()
            .multiplyScalar(
              pv.dot(dv)
            )
        ).normalize();

        aim(
          up,
          s.clone()
            .addScaledVector(dv,a)
            .addScaledVector(pv,h)
        );
        aim(fo,t);
      }

      let rq=new T.Quaternion();

      const cs=(x,y,z)=>
        V(x,y,z).applyQuaternion(rq);

      function stance(c,h){
        B.Pelvis.position.y=
          1.1-.127*c*c;

        B.Spine_01.rotation.x=.25*h;
        B.Spine_02.rotation.x=.2*h;
        B.Chest.rotation.x=.15*h;

        for(const s of "LR"){
          B["Thigh_"+s].rotation.x=
            -.6*c;
          B["Calf_"+s].rotation.x=c;
          B["Foot_"+s].rotation.x=
            -.4*c;
        }
      }

      function prep(){
        root.updateMatrixWorld(true);
        rq=root.getWorldQuaternion(
          new T.Quaternion()
        );
        return {
          SL:W(B.UpperArm_L),
          SR:W(B.UpperArm_R)
        };
      }

      const carryL=(P,c)=>
        P.SL.clone().add(
          cs(
            -.1,
            c?-.2:-.5,
            c?.5:.4
          )
        );

      const carryR=(P,sw)=>
        P.SR.clone().add(
          cs(.05,-.5,.25+sw)
        );

      function idle(f,c){
        const p=
          TAU*f/(c?60:90);
        const s=Math.sin(p);

        stance(
          c?.55:.3,
          1
        );

        B.Spine_02.rotation.x+=.03*s;
        B.Chest.rotation.x+=.03*s;
        B.Pelvis.position.y+=.006*s;
        B.Head.rotation.y=
          (c?.15:.5)*s+
          .1*Math.sin(2*p);

        const P=prep();

        return {
          P,
          L:carryL(P,c),
          R:carryR(P,0)
            .add(
              cs(
                0,
                .015*s,
                0
              )
            )
        };
      }

      function walk(f){
        const p=TAU*f/36;
        const s=Math.sin(p);
        const k=Math.cos(p);

        stance(.25,1);

        B.Pelvis.position.y+=
          .03*Math.cos(2*p);

        B.Thigh_L.rotation.x+=-.55*s;
        B.Thigh_R.rotation.x+=.55*s;

        B.Calf_L.rotation.x+=
          .7*Math.max(0,k);

        B.Calf_R.rotation.x+=
          .7*Math.max(0,-k);

        for(const q of "LR"){
          B["Foot_"+q].rotation.x=
            -(
              B["Thigh_"+q].rotation.x+
              B["Calf_"+q].rotation.x
            );
        }

        B.Pelvis.rotation.y=.12*s;
        B.Spine_02.rotation.y=-.2*s;
        B.Neck.rotation.y=.1*s;

        const P=prep();

        return {
          P,
          L:carryL(P,0)
            .add(
              cs(
                0,
                .03*Math.cos(2*p),
                0
              )
            ),
          R:carryR(P,.3*s)
        };
      }

      const quiverTail=()=>W(QS);
      const quiverDir=()=>
        qDirL.clone()
          .transformDirection(
            B.Chest.matrixWorld
          );

      function shoot(f){
        const aimA=
          smooth(30,50,f)*
          (1-smooth(90,108,f));

        const rec=
          Math.sin(
            clamp((f-78)/10,0,1)*
            Math.PI
          );

        stance(
          .55,
          1-.5*aimA
        );

        B.Neck.rotation.x-=.3*aimA;
        B.Spine_02.rotation.y-=.15*aimA;
        B.Chest.rotation.x-=.05*rec;
        B.Pelvis.position.z=-.04*rec;

        const P=prep();

        const L=
          carryL(P,1).lerp(
            P.SL.clone().add(
              cs(
                -.4,.05,
                .72-.06*rec
              )
            ),
            aimA
          );

        const cR=carryR(P,0);

        const R=()=>{
          const pQ=quiverTail();
          const nock=
            BS.localToWorld(
              V(0,.22,0)
            );
          const back=
            V(0,1,0)
              .transformDirection(
                BS.matrixWorld
              );

          if(f<26){
            return cR.clone().lerp(
              pQ,
              smooth(6,22,f)
            );
          }

          if(f<44){
            return pQ.clone().lerp(
              nock,
              smooth(26,42,f)
            );
          }

          if(f<78){
            return nock.addScaledVector(
              back,
              .45*smooth(50,74,f)+
              .006*Math.sin(f*2.1)*
              smooth(70,76,f)
            );
          }

          const dd=
            .45+
            .25*Math.sin(
              clamp((f-78)/8,0,1)*
              Math.PI
            );

          return nock
            .addScaledVector(back,dd)
            .lerp(
              cR,
              smooth(84,108,f)
            );
        };

        return {
          P,L,R,
          draw:f>=44&&f<90
        };
      }

      const CL={
        Idle:{len:90,loop:1,fn:f=>idle(f,0)},
        CombatIdle:{len:60,loop:1,fn:f=>idle(f,1)},
        Walk:{len:36,loop:1,fn:walk},
        Shoot:{len:108,fn:shoot}
      };

      const oldOrcWalk=CL.Walk.fn;
      CL.Walk.fn=function(f){
        const result=oldOrcWalk(f),phase=TAU*f/36;
        B.Chest.rotation.z=.025*Math.sin(phase);
        B.Head.rotation.y=-B.Pelvis.rotation.y*.5;
        for(const side of'LR'){
          const u=((f/36)+(side==='L'?0:.5))%1;
          const stanceU=u/.6;
          const z=u<.6?.27-.54*stanceU:-.27+.54*smooth(.6,1,u);
          const y=u<.6?.055:.055+.11*Math.sin((u-.6)/.4*Math.PI);
          const hipY=B.Pelvis.position.y-.05,dy=hipY-y,d=Math.min(.997,Math.hypot(dy,z)),bend=2*Math.acos(d);
          const thigh=-Math.atan2(z,dy)-bend/2;
          B['Thigh_'+side].rotation.x=thigh;B['Calf_'+side].rotation.x=bend;B['Foot_'+side].rotation.x=-thigh-bend+.12*Math.sin(u*TAU);B['Toe_'+side].rotation.x=u>.45&&u<.6?-.3*Math.sin((u-.45)/.15*Math.PI):0;
        }
        return result;
      };

      const QF=
        new T.Quaternion()
          .setFromAxisAngle(
            V(1,0,0),
            -Math.PI/2
          );

      let clip="Idle";
      let elapsed=0;
      let prevFrame=-1;
      let currentArrow=null;
      let released=false;
      let lastY=.22;
      const flying=[];

      function play(name){
        if(clip===name&&CL[name].loop)return;
        captureOrcTransition();
        clip=name;
        elapsed=0;
        prevFrame=-1;

        if(name==="Shoot"){
          released=false;
          lastY=.22;

          if(currentArrow){
            currentArrow.removeFromParent();
            currentArrow=null;
          }

          currentArrow=newArrow(true);
        }
      }

      function render(f,target){
        reset();

        if(clip==="Shoot"&&!currentArrow&&!released){
          currentArrow=newArrow(true);
        }

        const o=CL[clip].fn(f);
        blendOrcTransition(performance.now()/1000);
        const P=o.P;

        ik(
          B.UpperArm_L,
          B.Forearm_L,
          o.L,
          P.SL.clone()
            .add(
              cs(.4,-.3,-.5)
            )
        );

        game.scene.updateMatrixWorld(true);

        const hq=
          B.Hand_L.getWorldQuaternion(
            new T.Quaternion()
          );

        BS.quaternion.copy(
          hq.invert()
            .multiply(
              rq.clone()
                .multiply(QF)
            )
        );

        game.scene.updateMatrixWorld(true);

        const R=
          typeof o.R==="function"
            ? o.R()
            : o.R;

        ik(
          B.UpperArm_R,
          B.Forearm_R,
          R,
          P.SR.clone()
            .add(
              o.draw
                ? cs(-.5,.2,-.6)
                : cs(-.4,-.3,-.5)
            )
        );

        game.scene.updateMatrixWorld(true);

        if(currentArrow){
          const qD=quiverDir();

          if(clip!=="Shoot"||f<24){
            currentArrow.position.copy(
              quiverTail()
            );
            currentArrow.quaternion
              .setFromUnitVectors(
                Z,qD
              );
          }else if(f<78){
            const hand=W(AS);
            const dB=
              W(BS)
                .sub(hand)
                .normalize();

            const dir=
              qD.lerp(
                dB,
                smooth(26,42,f)
              ).normalize();

            currentArrow.position.copy(hand);
            currentArrow.quaternion
              .setFromUnitVectors(
                Z,dir
              );
          }else if(!released){
            released=true;

            const start=
              currentArrow.position.clone();

            const targetPoint=
              target?.clone?.() ||
              new T.Vector3(
                game.player.x,
                game.groundY(
                  game.player.x,
                  game.player.z
                )+1.2,
                game.player.z
              );

            // V45: compensate gravity before launch. The previous arrow
            // aimed directly at the player and then gravity pulled it under
            // the body before arrival.
            const dx=targetPoint.x-start.x;
            const dz=targetPoint.z-start.z;
            const horizontal=Math.hypot(dx,dz);
            const launchSpeed=18;
            const flightTime=clamp(
              horizontal/launchSpeed,
              .05,
              1.25
            );

            targetPoint.y+=
              .5*9.8*flightTime*flightTime;

            const velocity=
              targetPoint
                .sub(start)
                .normalize()
                .multiplyScalar(launchSpeed);

            flying.push({
              m:currentArrow,
              v:velocity,
              t:0
            });

            currentArrow=null;
          }
        }

        let y=.22,x=0,z=0;

        if(clip==="Shoot"){
          if(f>=44&&f<78){
            const h=
              BS.worldToLocal(
                W(AS)
              );
            y=clamp(h.y,.22,1.3);
            x=clamp(h.x,-.1,.1);
            z=clamp(h.z,-.1,.1);
            lastY=y;
          }else if(f>=78){
            const kk=f-78;
            y=
              .22+
              (lastY-.22)*
              Math.exp(-kk/3)*
              Math.cos(kk*1.7);
          }
        }

        setStr(x,y,z);
        updateOrcVisualEffects(performance.now()/1000,f);
      }

      function arrowSweptHitsPlayer(from,to){
        const px=game.player.x;
        const pz=game.player.z;
        const ground=
          game.groundY(px,pz);

        const vx=to.x-from.x;
        const vz=to.z-from.z;
        const vv=vx*vx+vz*vz;

        let t=0;
        if(vv>.000001){
          t=clamp(
            (
              (px-from.x)*vx+
              (pz-from.z)*vz
            )/vv,
            0,1
          );
        }

        const x=from.x+vx*t;
        const y=from.y+(to.y-from.y)*t;
        const z=from.z+vz*t;

        const dx=x-px;
        const dz=z-pz;

        // Vertical player capsule: feet/legs through head.
        const horizontalHit=
          dx*dx+dz*dz<=.58*.58;
        const verticalHit=
          y>=ground+.18 &&
          y<=ground+1.82;

        return horizontalHit&&verticalHit;
      }

      function updateProjectiles(dt){
        for(let i=flying.length-1;i>=0;i--){
          const a=flying[i];

          // Keep the previous position: at ~30 Hz a fast arrow can travel
          // more than half a metre in one frame and point-sampling can skip
          // completely through the player's body.
          const from=a.m.position.clone();

          a.v.y-=9.8*dt;
          a.m.position.addScaledVector(
            a.v,dt
          );

          const to=a.m.position;

          a.m.quaternion
            .setFromUnitVectors(
              Z,
              a.v.clone().normalize()
            );

          a.t+=dt;

          if(arrowSweptHitsPlayer(from,to)){
            const applied=damagePlayer(
              18,
              "Orc Arqueiro",
              "orc-arrow"
            );

            if(applied&&status){
              status.textContent=
                "Flecha do Orc acertou você • -18 de vida";
            }

            game.scene.remove(a.m);
            flying.splice(i,1);
            continue;
          }

          const gy=
            game.groundY(
              a.m.position.x,
              a.m.position.z
            );

          if(
            a.t>4 ||
            a.m.position.y<gy-.1
          ){
            game.scene.remove(a.m);
            flying.splice(i,1);
          }
        }
      }

      function apply(dt,target){
        elapsed+=dt;

        const c=CL[clip];
        let f=elapsed*30;
        let ended=false;

        if(c.loop){
          f%=c.len;
        }else if(f>=c.len){
          f=c.len;
          ended=true;
        }

        render(f,target);
        updateProjectiles(dt);

        prevFrame=f;

        if(ended){
          play("CombatIdle");
        }

        return {
          clip,
          frame:f,
          ended
        };
      }

      return {
        root:entity,
        apply,
        play,
        get clip(){return clip;},
        modelSet:"REWORK-2026"
      };
    }

    // ==========================================================
    // V56 — MULTI-INSTANCE SPECIAL CREATURE DIRECTOR
    // ==========================================================
    const enemies=[];
    let specialSerial=0;

    function currentDay(){
      return Math.max(
        1,
        Number(game.dayNight?.day)||1
      );
    }

    function isNight(){
      const h=Number(game.dayNight?.hour)||0;
      return h>=19||h<5.8;
    }

    function nightProgress(){
      const h=Number(game.dayNight?.hour)||0;
      const elapsed=
        h>=19
          ? h-19
          : 5+h;

      return clamp(
        elapsed/10.8,
        0,1
      );
    }

    function specialPlan(day=currentDay()){
      if(day<=1)return {eye:0,orc:0,nocturne:0};
      if(day===2)return {eye:1,orc:1,nocturne:0};
      if(day===3)return {eye:1,orc:1,nocturne:1};
      if(day===4)return {eye:2,orc:1,nocturne:1};
      if(day===5)return {eye:2,orc:2,nocturne:1};
      if(day<=7)return {eye:2,orc:2,nocturne:2};
      if(day<=9)return {eye:3,orc:3,nocturne:2};
      return {eye:3,orc:3,nocturne:3};
    }

    const THRESHOLDS={
      eye:[.20,.56,.82],
      orc:[.31,.66,.88],
      nocturne:[.50,.75,.92]
    };

    function createEnemy(type,{manual=false,day=currentDay()}={}){
      specialSerial++;

      let model,label,maxHp;

      if(type==="eye"){
        model=buildFlyingEye();
        label="Olho Voador";
        maxHp=120;
      }else if(type==="nocturne"){
        model=buildNocturne();
        label="Nocturne";
        maxHp=
          340+
          Math.min(
            220,
            Math.max(0,day-3)*20
          );
      }else if(type==="orc"){
        model=buildOrcArcher();
        label="Orc Arqueiro";
        maxHp=165;
      }else{
        throw new Error("Tipo especial desconhecido: "+type);
      }

      model.root.visible=false;

      const e={
        id:`${type}-${specialSerial}`,
        type,label,model,
        root:model.root,
        hp:maxHp,
        maxHp,
        alive:false,
        spawned:false,
        manual:!!manual,
        difficultyDay:day,
        state:"waiting",
        attackCooldown:0,
        dashCooldown:0,
        deathTimer:0,
        deadAt:0,
        lastSwing:-1
      };

      enemies.push(e);
      return e;
    }

    function eyeSpawnPoint(near=false){
      const yaw=game.player.yaw||0;

      if(near){
        return {
          x:game.player.x-Math.sin(yaw)*7.5,
          z:game.player.z-Math.cos(yaw)*7.5
        };
      }

      const behind=yaw+Math.PI;
      const angle=behind+(Math.random()-.5)*1.55;
      const radius=24+Math.random()*8;

      return {
        x:game.player.x-Math.sin(angle)*radius,
        z:game.player.z-Math.cos(angle)*radius
      };
    }

    function spawnEnemy(e,near=false,manual=e.manual){
      if(e.spawned||e.alive)return false;

      e.spawned=true;
      e.manual=!!manual;
      e.alive=true;
      e.hp=e.maxHp;
      e.state="active";

      const p=
        e.type==="eye"
          ? eyeSpawnPoint(near)
          : near
            ? {
                x:game.player.x-Math.sin(game.player.yaw)*7,
                z:game.player.z-Math.cos(game.player.yaw)*7
              }
            : randomPoint(
                e.type==="nocturne"?22:18,
                28
              );

      e.root.position.x=p.x;
      e.root.position.z=p.z;

      if(e.type==="eye"){
        e.root.position.y=game.groundY(p.x,p.z)+2.65;
        e.model.play("Eye_Hover");
      }else if(e.type==="nocturne"){
        e.root.position.y=game.groundY(p.x,p.z)+.15;
        e.model.play("Shadow_Fly");
      }else{
        e.root.position.y=game.groundY(p.x,p.z);
        e.model.play("CombatIdle");
      }

      e.root.visible=true;

      if(status){
        status.textContent=
          e.manual
            ? `${e.label} spawnado manualmente`
            : `${e.label} entrou na noite do Dia ${currentDay()}`;
      }

      return true;
    }

    function spawnType(type,count=1,{manual=false,near=manual,day=currentDay()}={}){
      count=Math.max(1,Math.min(6,Math.floor(Number(count)||1)));
      let spawned=0;

      for(let i=0;i<count;i++){
        const e=createEnemy(type,{manual,day});
        if(spawnEnemy(e,near,manual))spawned++;
      }

      return spawned;
    }

    function killEnemy(e){
      if(!e.alive)return;

      const xpByType={
        eye:80,
        nocturne:300,
        orc:110
      };

      const deathPosition=e.root.position.clone();

      e.alive=false;
      e.state="dead";
      e.deadAt=performance.now();

      window.gameProgression?.dropXP?.(
        xpByType[e.type]||75,
        deathPosition,
        e.label
      );

      if(e.type==="eye"){
        e.model.play("Eye_Death");
        e.deathTimer=2;
      }else if(e.type==="nocturne"){
        e.model.play("Shadow_Death");
        e.deathTimer=2;
      }else{
        e.deathTimer=.35;
      }

      if(status)status.textContent=`${e.label} derrotado`;
    }

    function hitEnemy(e,damage,sourceLabel="Machado"){
      if(!e.alive)return;

      damage*=window.gameParry?.damageMultiplierFor?.(e.id)??1;
      e.hp=Math.max(0,e.hp-damage);

      if(e.hp<=0){
        killEnemy(e);
        return;
      }

      if(e.type==="eye"){
        e.model.play("Eye_Hit");
      }else if(e.type==="nocturne"){
        e.model.play("Shadow_Hit");
      }

      if(status){
        status.textContent=
          `${sourceLabel} acertou ${e.label} • ${Math.max(0,Math.round(e.hp))}/${e.maxHp} HP`;
      }
    }

    function enforceEyePlayerClearance(e){
      if(!e?.root?.visible)return;

      let dx=e.root.position.x-game.player.x;
      let dz=e.root.position.z-game.player.z;
      let d=Math.hypot(dx,dz);
      const minDist=1.60;

      if(d>=minDist)return;

      if(d<.0001){
        const yaw=game.player.yaw||0;
        dx=Math.sin(yaw);
        dz=Math.cos(yaw);
        d=1;
      }

      e.root.position.x=
        game.player.x+(dx/d)*minDist;

      e.root.position.z=
        game.player.z+(dz/d)*minDist;
    }

    function updateEye(e,dt,now){
      if(!e.root.visible)return;
      if(e.__parryBrokenUntil>now&&e.alive)return;

      if(!e.alive){
        e.model.apply(
          dt,
          new T.Vector3(
            game.player.x,
            game.groundY(game.player.x,game.player.z)+1.2,
            game.player.z
          )
        );

        e.deathTimer-=dt;

        if(e.deathTimer<=0){
          e.root.visible=false;
          e.model.dispose();
        }
        return;
      }

      const px=game.player.x;
      const pz=game.player.z;
      const gy=game.groundY(px,pz);

      enforceEyePlayerClearance(e);

      const dx=px-e.root.position.x;
      const dz=pz-e.root.position.z;
      const dist=Math.hypot(dx,dz);

      faceXZ(e.root,px,pz,4.2,dt);

      const target=new T.Vector3(px,gy+1.15,pz);
      const anim=e.model.apply(dt,target);

      if(anim.hit&&dist<1.95){
        damagePlayer(18,"Olho Voador",e.id);
      }

      if(
        e.model.clip==="Eye_Dive_Start"||
        e.model.clip==="Eye_Dive_Loop"||
        e.model.clip==="Eye_Dive_Hit"
      ){
        const l=Math.max(.001,dist);
        const speed=e.model.clip==="Eye_Dive_Loop"?6.1:4.8;
        const advance=Math.min(speed*dt,Math.max(0,dist-1.60));

        e.root.position.x+=dx/l*advance;
        e.root.position.z+=dz/l*advance;
        enforceEyePlayerClearance(e);
        return;
      }

      if(e.model.clip==="Eye_Dive_Recovery"){
        const wanted=
          game.groundY(e.root.position.x,e.root.position.z)+2.65;

        e.root.position.y+=
          (wanted-e.root.position.y)*
          (1-Math.exp(-3*dt));
        return;
      }

      if(now>=e.attackCooldown&&dist<8.5){
        e.attackCooldown=now+3300+Math.random()*1600;
        e.model.attackChain();
        return;
      }

      if(
        e.model.clip==="Eye_Hit"||
        e.model.clip==="Eye_Death"
      )return;

      if(dist>3.1){
        e.model.play(dist>9?"Eye_FlyFast":"Eye_Fly");

        const l=Math.max(.001,dist);
        const speed=dist>9?3.6:2.25;
        const advance=Math.min(speed*dt,Math.max(0,dist-1.85));

        e.root.position.x+=dx/l*advance;
        e.root.position.z+=dz/l*advance;
        enforceEyePlayerClearance(e);
      }else{
        e.model.play("Eye_Hover");
        enforceEyePlayerClearance(e);
      }

      const wantedY=
        game.groundY(e.root.position.x,e.root.position.z)+2.65;

      e.root.position.y+=
        (wantedY-e.root.position.y)*
        (1-Math.exp(-2.5*dt));
    }

    function updateNocturne(e,dt,now){
      if(!e.root.visible)return;
      if(e.__parryBrokenUntil>now&&e.alive)return;

      if(!e.alive){
        e.model.apply(dt);
        e.deathTimer-=dt;
        if(e.deathTimer<=0)e.root.visible=false;
        return;
      }

      const px=game.player.x;
      const pz=game.player.z;
      const dx=px-e.root.position.x;
      const dz=pz-e.root.position.z;
      const dist=Math.hypot(dx,dz);

      faceXZ(e.root,px,pz,5.4,dt);

      const anim=e.model.apply(dt);

      if(anim.hit){
        const dash=e.model.clip==="Shadow_DashAttack";
        const range=dash?2.7:2.25;

        if(dist<range){
          const extra=
            Math.max(
              0,
              Math.floor((e.difficultyDay-3)/2)*2
            );

          damagePlayer(
            dash?42+extra:30+extra,
            "Nocturne",
            e.id
          );
        }
      }

      if(
        e.model.clip==="Shadow_Hit"||
        e.model.clip==="Shadow_Death"
      )return;

      if(
        (
          e.model.clip==="Shadow_Attack_Left"||
          e.model.clip==="Shadow_Attack_Right"||
          e.model.clip==="Shadow_DashAttack"
        ) &&
        anim.frame<
          (e.model.clip==="Shadow_DashAttack"?60:54)
      ){
        if(e.model.clip==="Shadow_DashAttack"){
          const l=Math.max(.001,dist);
          e.root.position.x+=dx/l*5.8*dt;
          e.root.position.z+=dz/l*5.8*dt;
        }
        return;
      }

      if(dist<2.2&&now>=e.attackCooldown){
        e.attackCooldown=now+2400+Math.random()*800;
        e.model.play(
          Math.random()<.5
            ?"Shadow_Attack_Left"
            :"Shadow_Attack_Right"
        );
        return;
      }

      if(dist>=4.5&&dist<9&&now>=e.dashCooldown){
        e.dashCooldown=now+6500+Math.random()*2500;
        e.model.play("Shadow_DashAttack");
        return;
      }

      if(dist>2){
        e.model.play(dist>8?"Shadow_FlyFast":"Shadow_Fly");
        const l=Math.max(.001,dist);
        const speed=dist>8?4.2:2.6;
        e.root.position.x+=dx/l*speed*dt;
        e.root.position.z+=dz/l*speed*dt;
      }else{
        e.model.play("Shadow_Idle");
      }

      e.root.position.y=
        game.groundY(e.root.position.x,e.root.position.z)+.12;
    }

    function updateOrc(e,dt,now){
      if(!e.root.visible)return;
      if(e.__parryBrokenUntil>now&&e.alive)return;

      if(!e.alive){
        e.deathTimer-=dt;
        e.root.scale.multiplyScalar(Math.max(.90,1-dt*1.6));
        if(e.deathTimer<=0)e.root.visible=false;
        return;
      }

      const px=game.player.x;
      const pz=game.player.z;
      const dx=px-e.root.position.x;
      const dz=pz-e.root.position.z;
      const dist=Math.hypot(dx,dz);

      faceXZ(e.root,px,pz,4.7,dt);

      const anim=e.model.apply(
        dt,
        new T.Vector3(
          px,
          game.groundY(px,pz)+1.05,
          pz
        )
      );

      if(e.model.clip==="Shoot"&&anim.frame<108)return;

      if(dist>=5.5&&dist<=11.3&&now>=e.attackCooldown){
        e.attackCooldown=now+3000+Math.random()*1200;
        e.model.play("Shoot");
        return;
      }

      if(dist>10.2){
        e.model.play("Walk");
        const l=Math.max(.001,dist);
        e.root.position.x+=dx/l*1.28*dt;
        e.root.position.z+=dz/l*1.28*dt;
      }else if(dist<5.3){
        e.model.play("Walk");
        const l=Math.max(.001,dist);
        e.root.position.x-=dx/l*.95*dt;
        e.root.position.z-=dz/l*.95*dt;
      }else{
        e.model.play("CombatIdle");
      }

      e.root.position.y=
        game.groundY(e.root.position.x,e.root.position.z);
    }

    window.addEventListener("game:axe-impact",ev=>{
      if(window.gameRightHand?.current!=="axe")return;

      const swing=ev.detail?.swingId??performance.now();

      for(const e of enemies){
        if(
          !e.alive||
          !e.root.visible||
          e.lastSwing===swing
        )continue;

        const range=e.type==="eye"?2.8:2.55;

        if(!axeFacing(e.root,range,e.type==="eye"?82:72))continue;

        e.lastSwing=swing;
        hitEnemy(
          e,
          window.gameProgression?.modifyAxeDamage?.(34)??34
        );
        break;
      }
    });

    const autoState={
      night:false,
      day:0,
      spawned:{eye:0,orc:0,nocturne:0}
    };

    function beginNight(day){
      autoState.night=true;
      autoState.day=day;
      autoState.spawned={eye:0,orc:0,nocturne:0};

      if(status){
        status.textContent=
          day===1
            ?"Primeira noite • somente zumbis"
            :`Noite do Dia ${day} iniciada`;
      }
    }

    function despawnAutomaticAtDawn(){
      for(const e of enemies){
        if(!e.manual&&e.alive){
          e.alive=false;
          e.state="dawn-despawn";
          e.root.visible=false;
          e.deadAt=performance.now();
        }
      }
    }

    function updateAutomaticDirector(){
      if(!isNight()){
        if(autoState.night){
          despawnAutomaticAtDawn();
          autoState.night=false;
        }
        return;
      }

      const day=currentDay();

      if(!autoState.night||autoState.day!==day){
        beginNight(day);
      }

      const plan=specialPlan(day);
      const progress=nightProgress();

      for(const type of ["eye","orc","nocturne"]){
        while(autoState.spawned[type]<plan[type]){
          const idx=autoState.spawned[type];
          const list=THRESHOLDS[type];
          const threshold=list[Math.min(idx,list.length-1)];

          if(progress<threshold)break;

          spawnType(
            type,
            1,
            {
              manual:false,
              near:false,
              day
            }
          );

          autoState.spawned[type]++;
        }
      }
    }

    let last=performance.now();
    let accum=0;
    let cleanupAt=0;

    function loop(now){
      requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

      const rawDt=Math.min(
        .05,
        Math.max(0,(now-last)/1000)
      );
      last=now;

      accum+=rawDt;
      if(accum<(1/30))return;

      const dt=Math.min(.066,accum);
      accum=0;

      updateAutomaticDirector();

      for(const e of enemies){
        if(!e.root.visible)continue;

        if(e.type==="eye")updateEye(e,dt,now);
        else if(e.type==="nocturne")updateNocturne(e,dt,now);
        else if(e.type==="orc")updateOrc(e,dt,now);
      }

      if(now>=cleanupAt){
        cleanupAt=now+5000;

        for(let i=enemies.length-1;i>=0;i--){
          const e=enemies[i];

          if(
            !e.alive&&
            !e.root.visible&&
            e.deadAt&&
            now-e.deadAt>6000
          ){
            e.root.removeFromParent?.();
            enemies.splice(i,1);
          }
        }
      }
    }

    requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

    window.gameSpecialCreatures={
 combatTargets(){return enemies.filter(e=>e.alive&&e.root.visible).map(e=>({root:e.root,radius:e.type==='eye'?.65:.52,height:e.type==='eye'?0:1.1,hit(damage){hitEnemy(e,damage,'Lança')}}));},
      version:"V71B",
      modelSet:"REWORK-2026",
      get all(){return enemies;},
      get active(){
        return enemies.filter(e=>e.alive&&e.root.visible);
      },
      get eye(){
        return enemies.find(e=>e.type==="eye"&&e.alive)||null;
      },
      get nocturne(){
        return enemies.find(e=>e.type==="nocturne"&&e.alive)||null;
      },
      get orc(){
        return enemies.find(e=>e.type==="orc"&&e.alive)||null;
      },
      get tonightPlan(){return specialPlan();},
      damageRing(x,z,waveRadius,thickness,baseDamage,maxRadius,sourceLabel="Dano em área",hitSet=null){
        let hits=0;
        const set=hitSet||new Set();
        for(const e of enemies){
          if(!e?.alive||!e.root?.visible||set.has(e))continue;
          const d=Math.hypot(e.root.position.x-x,e.root.position.z-z);
          if(Math.abs(d-waveRadius)>thickness)continue;
          set.add(e);
          const falloff=Math.max(.45,1-.5*d/Math.max(.001,maxRadius||waveRadius||1));
          hitEnemy(e,Math.max(0,baseDamage)*falloff,sourceLabel);
          hits++;
        }
        return hits;
      },
      damageRadius(x,z,radius,baseDamage,sourceLabel="Dano em área",hitSet=null){
        let hits=0;
        const set=hitSet||new Set();
        for(const e of enemies){
          if(!e?.alive||!e.root?.visible||set.has(e))continue;
          const d=Math.hypot(e.root.position.x-x,e.root.position.z-z);
          if(d>radius)continue;
          set.add(e);
          const falloff=Math.max(.60,1-.40*d/Math.max(.001,radius));
          hitEnemy(e,Math.max(0,baseDamage)*falloff,sourceLabel);
          hits++;
        }
        return hits;
      },
      spawn(type,count=1){
        return spawnType(
          type,
          count,
          {
            manual:true,
            near:true,
            day:currentDay()
          }
        );
      },
      spawnEye(count=1){return this.spawn("eye",count);},
      spawnNocturne(count=1){return this.spawn("nocturne",count);},
      spawnOrc(count=1){return this.spawn("orc",count);},
      spawnAllNow(){
        return {
          eye:this.spawnEye(1),
          nocturne:this.spawnNocturne(1),
          orc:this.spawnOrc(1)
        };
      }
    };

    if(status){
      status.textContent=
        "Progressão de inimigos pronta • primeira noite: somente zumbis";
    }

  }catch(err){
    console.error(
      "Novos inimigos V44:",
      err
    );

    const status=document.getElementById("status");
    if(status){
      status.textContent+=
        " • novos inimigos indisponíveis: "+
        String(err?.message||err);
    }
  }
})();

