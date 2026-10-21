
(async()=>{
  if(window.__V168_MESTRE_MARCIAL__) return;
  window.__V168_MESTRE_MARCIAL__=true;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
  async function waitGame(){
    for(let i=0;i<1800;i++){
      const g=window.gameReview;
      if(g?.scene&&g?.camera&&g?.renderer&&g?.player&&g?.groundY&&window.__THREE_MODULE&&window.__FBX_MODULE?.FBXLoader&&window.gameZombie) return g;
      await sleep(20);
    }
    throw new Error('V168: jogo/Three/FBXLoader não ficaram prontos.');
  }
  async function gunzipB64(b64){
    const reply=await fetch(b64,{cache:'force-cache'});if(!reply.ok)throw new Error('Mestre Marcial recurso '+reply.status+': '+b64);const raw=new Uint8Array(await reply.arrayBuffer());
    if(raw[0]!==31||raw[1]!==139)return raw; // Evita descompressao duplicada se o servidor usou Content-Encoding.
    if(typeof DecompressionStream!=='undefined'){
      const ds=new DecompressionStream('gzip');
      return new Uint8Array(await new Response(new Blob([raw]).stream().pipeThrough(ds)).arrayBuffer());
    }
    if(window.__FFLATE_GUNZIP_SYNC)return window.__FFLATE_GUNZIP_SYNC(raw);
    throw new Error('Sem descompressor gzip neste navegador.');
  }
  try{
    const game=await waitGame(),T=window.__THREE_MODULE,{FBXLoader}=window.__FBX_MODULE;
    const scene=game.scene,player=game.player,camera=game.camera;
    const CFG={maxHp:650,phase2At:.5,moveSpeed:2.55,attackRange:2.65,aggroRange:42,bodyRadius:.72,xpReward:300};

    const [buf1,buf2,animBytes,walkBytes]=await Promise.all([
      gunzipB64('assets/stream/martial-1.fbx.gz'),gunzipB64('assets/stream/martial-2.fbx.gz'),gunzipB64('assets/stream/martial-3.fbx.gz'),
      gunzipB64('assets/stream/martial-4.fbx.gz'),
    ]);
    const animData=JSON.parse(new TextDecoder().decode(animBytes));
    const loader=new FBXLoader();
    const model1=loader.parse(buf1.buffer,'');
    const model2=loader.parse(buf2.buffer,'');
    const walkFbx={animations:[T.AnimationClip.parse(JSON.parse(new TextDecoder().decode(walkBytes)))]};
    const walkSrc=(walkFbx.animations&&walkFbx.animations[0])?walkFbx.animations[0]:null;
    if(walkSrc)walkSrc.name='Walking';
    model1.name='MestreMarcial_Fase1';model2.name='MestreMarcial_Fase2';

    function makeTexture(b64,mime){
      const tx=new T.TextureLoader().load(b64);
      tx.colorSpace=T.SRGBColorSpace;tx.flipY=true;tx.wrapS=tx.wrapT=T.ClampToEdgeWrapping;tx.needsUpdate=true;return tx;
    }
    const tx1=makeTexture('assets/stream/martial-texture-1.jpg','image/jpeg'),tx2=makeTexture('assets/stream/martial-texture-2.jpg','image/jpeg');
    function applyTexture(m,tx){
      m.traverse(o=>{if(!o.isMesh)return;const arr=Array.isArray(o.material)?o.material:[o.material];const out=arr.map(src=>{const mt=src?.clone?src.clone():new T.MeshStandardMaterial();mt.map=tx;if(mt.color)mt.color.set(0xffffff);if('metalness'in mt)mt.metalness=0;if('roughness'in mt)mt.roughness=.82;if(mt.emissive)mt.emissive.set(0);mt.needsUpdate=true;return mt});o.material=Array.isArray(o.material)?out:out[0];o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;});
    }
    applyTexture(model1,tx1);applyTexture(model2,tx2);
    function normalizeModel(m){
      m.position.set(0,0,0);m.scale.setScalar(1);m.updateMatrixWorld(true);
      let box=new T.Box3().setFromObject(m),sz=box.getSize(new T.Vector3());
      if(sz.y>0){const sc=2.08/sz.y;m.scale.setScalar(sc);m.updateMatrixWorld(true);box=new T.Box3().setFromObject(m)}
      const c=box.getCenter(new T.Vector3());m.position.x-=c.x;m.position.z-=c.z;m.position.y-=box.min.y;m.updateMatrixWorld(true);
    }
    normalizeModel(model1);normalizeModel(model2);
    const bossRoot=new T.Group();bossRoot.name='MestreMarcialBossRoot';scene.add(bossRoot);bossRoot.visible=false;bossRoot.add(model1,model2);model2.visible=false;
    const modelInfo={1:{m:model1,bones:new Map()},2:{m:model2,bones:new Map()}};
    for(const ph of [1,2])modelInfo[ph].m.traverse(o=>{if(o.isBone)modelInfo[ph].bones.set(o.name,o)});

    // Animations: all Mixamo body tracks are kept, but Hips POSITION is locked to bind pose.
    // This fixes the old floating bug. World movement belongs to bossRoot only.
    function makeClipForPhase(src,ph){
      const bones=modelInfo[ph].bones,hips=bones.get('mixamorigHips');
      const bind=hips?hips.position.clone():new T.Vector3();
      const tracks=[];
      for(const tr0 of src.tracks){
        const bn=tr0.name.split('.')[0];if(!bones.has(bn))continue;
        const tr=tr0.clone();
        if(/mixamorigHips\.position$/.test(tr.name)){
          for(let i=0;i<tr.values.length;i+=3){tr.values[i]=bind.x;tr.values[i+1]=bind.y;tr.values[i+2]=bind.z;}
        }
        tracks.push(tr);
      }
      return new T.AnimationClip(src.name,src.duration,tracks,src.blendMode);
    }
    const sourceClips={};
    for(const [name,j] of Object.entries(animData.raw)){const c=T.AnimationClip.parse(j);c.name=name;sourceClips[name]=c}
    const comboUpperSrc=T.AnimationClip.parse(animData.comboUpper);comboUpperSrc.name='Combo Uppercut';
    const comboFrontSrc=T.AnimationClip.parse(animData.comboFront);comboFrontSrc.name='Front Twist Flip';
    sourceClips['Combo Uppercut']=comboUpperSrc;sourceClips['Front Twist Flip']=comboFrontSrc;
    if(walkSrc)sourceClips['Walking']=walkSrc;
    function makeIdle(src){
      const tracks=src.tracks.map(t=>{const n=t.getValueSize(),v=[];for(let k=0;k<n;k++)v.push(t.values[k]);for(let k=0;k<n;k++)v.push(t.values[k]);return new t.constructor(t.name,[0,1],v)});
      return new T.AnimationClip('Combat Idle',1,tracks);
    }
    sourceClips['Combat Idle']=makeIdle(sourceClips['Cross Punch']);
    const clips={1:{},2:{}};
    for(const ph of [1,2])for(const [n,c] of Object.entries(sourceClips))clips[ph][n]=makeClipForPhase(c,ph);
    const mixers={1:new T.AnimationMixer(model1),2:new T.AnimationMixer(model2)};
    let phase=1,mixer=mixers[1],currentAction=null,idleAction=null,walkAction=null,isWalking=false;
    function setModelPhase(ph){
      mixers[1].stopAllAction();mixers[2].stopAllAction();phase=ph;model1.visible=ph===1;model2.visible=ph===2;mixer=mixers[ph];
      idleAction=mixer.clipAction(clips[ph]['Combat Idle']);idleAction.reset().setLoop(T.LoopRepeat,Infinity).play();currentAction=idleAction;
      walkAction=clips[ph]['Walking']?mixer.clipAction(clips[ph]['Walking']):null;
      if(walkAction){walkAction.enabled=true;walkAction.clampWhenFinished=false;walkAction.setLoop(T.LoopRepeat,Infinity);}
      isWalking=false;bindLimbBones();updateHud();
    }
    function crossFade(a,d=.10){if(currentAction&&currentAction!==a)currentAction.fadeOut(d);a.reset().fadeIn(d).play();currentAction=a}
    function playOne(name,speed=1,loop=false){const c=clips[phase][name];if(!c)return null;isWalking=false;const a=mixer.clipAction(c);a.enabled=true;a.timeScale=speed;a.clampWhenFinished=!loop;a.setLoop(loop?T.LoopRepeat:T.LoopOnce,loop?Infinity:1);crossFade(a,.10);return{action:a,duration:c.duration/Math.max(.05,speed),clip:c}}
    function playIdle(){if(!idleAction)return;isWalking=false;idleAction.enabled=true;idleAction.setLoop(T.LoopRepeat,Infinity);crossFade(idleAction,.14)}
    function playWalk(){if(!walkAction||isWalking)return;if(currentAction===walkAction){isWalking=true;return}isWalking=true;walkAction.enabled=true;walkAction.timeScale=1;walkAction.setLoop(T.LoopRepeat,Infinity);crossFade(walkAction,.16)}

    // ---------- HUD ----------
    const hud=document.createElement('div');hud.id='martialBossHud';hud.style.cssText='position:fixed;z-index:38;left:50%;top:66px;transform:translateX(-50%);width:min(520px,66vw);font:700 12px system-ui;color:#fff;text-align:center;pointer-events:none;display:none;text-shadow:0 2px 3px #000';hud.innerHTML='<div id="martialTitle" style="letter-spacing:.13em;margin-bottom:5px">MESTRE MARCIAL</div><div style="height:12px;border:1px solid #d6b879;border-radius:8px;background:#130d0b;overflow:hidden"><div id="martialHpFill" style="height:100%;width:100%;background:linear-gradient(90deg,#8d1313,#ed3e31)"></div></div><div id="martialHpText" style="margin-top:2px">650 / 650</div>';document.body.appendChild(hud);
    const title=hud.querySelector('#martialTitle'),hpFill=hud.querySelector('#martialHpFill'),hpText=hud.querySelector('#martialHpText');
    let hp=CFG.maxHp,alive=false,state='HIDDEN',transitioning=false,dead=false,spawnedOnce=false;
    function updateHud(){hud.style.display=alive&&bossRoot.visible?'block':'none';hpFill.style.width=`${clamp(hp/CFG.maxHp*100,0,100)}%`;hpText.textContent=`${Math.ceil(hp)} / ${CFG.maxHp}`;title.textContent=phase===1?'MESTRE MARCIAL — FASE 1':'MESTRE MARCIAL — FASE 2 • 4 ELEMENTOS'}

    // ---------- VFX fire / water / earth / leaf ----------
    const fxRoot=new T.Group();scene.add(fxRoot);const particlePool=[],rockPool=[];
    const glowTex=(()=>{const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,'rgba(255,255,255,1)');g.addColorStop(.25,'rgba(255,255,255,.8)');g.addColorStop(1,'rgba(255,255,255,0)');x.fillStyle=g;x.fillRect(0,0,64,64);return new T.CanvasTexture(c)})();
    const EC={fire:0xff5522,water:0x3a9cff,earth:0x9a724a,leaf:0x68bf42};
    const elementDefs=[['fire',0xe85a20],['water',0x2a8ad8],['earth',0x9a7a48],['leaf',0x6ca84a]];
    for(let i=0;i<300;i++){const mat=new T.SpriteMaterial({map:glowTex,color:0xffffff,transparent:true,depthWrite:false,blending:T.AdditiveBlending});const s=new T.Sprite(mat);s.visible=false;fxRoot.add(s);particlePool.push({s,v:new T.Vector3(),life:0,max:1,el:'fire'})}
    for(let i=0;i<55;i++){const m=new T.Mesh(new T.DodecahedronGeometry(.07,0),new T.MeshStandardMaterial({color:0x745842,roughness:1}));m.visible=false;m.castShadow=true;fxRoot.add(m);rockPool.push({m,v:new T.Vector3(),life:0})}
    let pidx=0;
    function puff(el,pos,vel,life=.45,size=.15){const p=particlePool[pidx++%particlePool.length];p.el=el;p.s.position.copy(pos);p.v.copy(vel);p.life=p.max=life;p.s.scale.setScalar(size);p.s.material.color.setHex(EC[el]||0xffffff);p.s.material.blending=el==='leaf'?T.NormalBlending:T.AdditiveBlending;p.s.visible=true}
    function rock(pos,vel){const r=rockPool.find(x=>x.life<=0);if(!r)return;r.life=.8+Math.random()*.8;r.m.position.copy(pos);r.v.copy(vel);r.m.scale.setScalar(.6+Math.random()*1.4);r.m.visible=true}
    function burst(el,pos,n=18,pow=2){for(let i=0;i<n;i++){const v=new T.Vector3(Math.random()-.5,Math.random()*.7+.1,Math.random()-.5).normalize().multiplyScalar(pow*(.4+Math.random()));if(el==='earth')rock(pos,v);else puff(el,pos,v,.35+Math.random()*.45,el==='leaf'?.10:.16)}}
    function ring(pos,color,maxR=2.4,dur=.55){const m=new T.Mesh(new T.RingGeometry(.88,1,48),new T.MeshBasicMaterial({color,transparent:true,opacity:.8,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}));m.rotation.x=-Math.PI/2;m.position.copy(pos);m.scale.setScalar(.08);scene.add(m);rings.push({m,t:0,dur,maxR})}
    const rings=[];
    let limbBones={};
    function bindLimbBones(){const b=modelInfo[phase].bones;limbBones={leftHand:b.get('mixamorigLeftHand'),rightHand:b.get('mixamorigRightHand'),leftFoot:b.get('mixamorigLeftFoot'),rightFoot:b.get('mixamorigRightFoot')}}
    const limbDef={leftHand:'water',rightHand:'fire',leftFoot:'leaf',rightFoot:'earth'};let limbAcc=0;
    function bonePos(k){const b=limbBones[k];return b?b.getWorldPosition(new T.Vector3()):bossRoot.position.clone().add(new T.Vector3(0,1,0))}
    function updateVfx(dt){
      for(const p of particlePool){if(p.life<=0)continue;p.life-=dt;if(p.life<=0){p.s.visible=false;continue}p.s.position.addScaledVector(p.v,dt);p.v.y+=(p.el==='fire'?.9:p.el==='water'?-1.2:p.el==='leaf'?.15:0)*dt;p.s.material.opacity=clamp(p.life/p.max,0,1);p.s.scale.multiplyScalar(1+dt*(p.el==='water'?.25:.9))}
      for(const r of rockPool){if(r.life<=0)continue;r.life-=dt;if(r.life<=0){r.m.visible=false;continue}r.v.y-=5*dt;r.m.position.addScaledVector(r.v,dt);const gy=game.groundY(r.m.position.x,r.m.position.z)+.03;if(r.m.position.y<gy){r.m.position.y=gy;r.v.multiplyScalar(.25)}}
      for(let i=rings.length-1;i>=0;i--){const r=rings[i];r.t+=dt;const u=r.t/r.dur;if(u>=1){scene.remove(r.m);r.m.geometry.dispose();r.m.material.dispose();rings.splice(i,1);continue}r.m.scale.setScalar(.08+r.maxR*smooth(u));r.m.material.opacity=(1-u)*.8}
      if(alive&&phase===2&&!transitioning){limbAcc+=dt;while(limbAcc>.045){limbAcc-=.045;for(const [k,el] of Object.entries(limbDef)){const p=bonePos(k),v=new T.Vector3((Math.random()-.5)*.6,.25+Math.random()*.5,(Math.random()-.5)*.6);if(el==='earth'){if(Math.random()<.28)rock(p,v.clone().multiplyScalar(.8))}else puff(el,p,v,.35+Math.random()*.25,el==='leaf'?.09:.13)}}}
    }
    function hitFx(el,key='rightHand',big=false){const p=bonePos(key);burst(el,p,big?34:20,big?3.2:2.1);const g=p.clone();g.y=game.groundY(g.x,g.z)+.035;ring(g,EC[el]||0xffffff,big?3.6:2,.55)}

    // ---------- Exact ancestral guardians from the user's standalone model ----------
    const ritualGroup=new T.Group();scene.add(ritualGroup);ritualGroup.visible=false;const ritualGuardians=[];
const exactGuardianRig=(()=>{
    const D=Math.PI/180,V=(x,y,z)=>new T.Vector3(x,y,z),R=(a,b)=>a+Math.random()*(b-a);
const mk=(c,r=.7,o={})=>new T.MeshStandardMaterial(Object.assign({color:c,roughness:r,metalness:0},o));
const ell=(p,m,x,y,z,sx,sy,sz)=>{const s=new T.Mesh(new T.SphereGeometry(1,20,14),m);s.position.set(x,y,z);s.scale.set(sx,sy,sz);s.castShadow=true;p.add(s);return s};
const box=(p,m,x,y,z,w,h,d)=>{const s=new T.Mesh(new T.BoxGeometry(w,h,d),m);s.position.set(x,y,z);s.castShadow=true;p.add(s);return s};
function limb(p,m,len,rs,sz=1,y0=0){const n=rs.length-1,pts=rs.map((r,i)=>new T.Vector2(r,-(y0+len*i/n))).reverse();const me=new T.Mesh(new T.LatheGeometry(pts,18),m);me.scale.z=sz;me.castShadow=true;p.add(me);return me}
/* ============ PERSONAGEM (rig completo de ossos + malha anatômica) ============ */

const nz=(x,y,z)=>Math.sin(x*37.1+y*11.3)*Math.cos(z*29.7+x*7.7)*.5+Math.sin(y*53+z*17)*.5;
function fold(m,a){const g=m.geometry,P=g.attributes.position,N=g.attributes.normal;if(!N)return;for(let i=0;i<P.count;i++){const x=P.getX(i),y=P.getY(i),z=P.getZ(i),d=nz(x,y,z)*a;P.setXYZ(i,x+N.getX(i)*d,y+N.getY(i)*d,z+N.getZ(i)*d)}g.computeVertexNormals()}
const cvTex=(f,rep)=>{const c=document.createElement('canvas');c.width=c.height=128;const g=c.getContext('2d'),d=g.createImageData(128,128);for(let i=0;i<d.data.length;i+=4){const v=f((i/4)%128,Math.floor(i/4/128));d.data[i]=d.data[i+1]=d.data[i+2]=v;d.data[i+3]=255}g.putImageData(d,0,0);const t=new T.CanvasTexture(c);t.wrapS=t.wrapT=T.RepeatWrapping;t.repeat.set(rep,rep);return t};
const poreT=(()=>{const N=16,gr=Array.from({length:N*N},()=>Math.random());const f=(x,y)=>{const u=x/128*N,v=y/128*N,i=Math.floor(u),j=Math.floor(v),a=u-i,b=v-j,sa=a*a*(3-2*a),sb=b*b*(3-2*b),g=(p,q)=>gr[((q%N)*N)+(p%N)];return g(i,j)*(1-sa)*(1-sb)+g(i+1,j)*sa*(1-sb)+g(i,j+1)*(1-sa)*sb+g(i+1,j+1)*sa*sb};return cvTex((x,y)=>120+f(x,y)*16,2)})(),weaveT=cvTex((x,y)=>((x%4<2)!==(y%4<2))?200:110,12);
function seg(p,m,a,b,r){const A=V(...a),B=V(...b),d=B.clone().sub(A),L=d.length(),c=new T.Mesh(new T.CylinderGeometry(r,r*.92,L,8),m);c.position.copy(A).add(B).multiplyScalar(.5);c.quaternion.setFromUnitVectors(V(0,1,0),d.normalize());c.castShadow=true;p.add(c);const s=new T.Mesh(new T.SphereGeometry(r*1.02,8,6),m);s.position.copy(B);s.castShadow=true;p.add(s)}
function fistHand(ha,skin,tape,k){
 ell(ha,skin,0,-.05,0,.04,.052,.026);ell(ha,skin,0,-.015,0,.032,.03,.026);
 for(let i=0;i<4;i++){const x=(i-1.5)*.02,y=-.1,r=.0105-(i==3?.001:0),L=i==1||i==2?1.08:1;
  ell(ha,skin,x,y,.012,.0115,.0115,.0115);
  seg(ha,skin,[x,y,.012],[x,y-.003,-.016*L],r);seg(ha,skin,[x,y-.003,-.016*L],[x,y+.02*L-.003,-.026],r*.93);seg(ha,skin,[x,y+.02*L-.003,-.026],[x,y+.036-.003,-.02],r*.85)}
 const t=k*-1;seg(ha,skin,[t*.032,-.058,-.004],[t*.036,-.086,-.02],.0125);seg(ha,skin,[t*.036,-.086,-.02],[t*.014,-.092,-.034],.0115);seg(ha,skin,[t*.014,-.092,-.034],[t*-.008,-.086,-.034],.0105);
 for(const y of[-.025,-.045,-.065]){const w=new T.Mesh(new T.TorusGeometry(.039,.0045,6,18),tape);w.rotation.x=Math.PI/2;w.scale.set(1,.72,1);w.position.y=y;w.castShadow=true;ha.add(w)}}
function footBuild(ft,skin,k){
 ell(ft,skin,0,-.052,-.03,.036,.04,.05);ell(ft,skin,0,-.036,.04,.034,.026,.07);ell(ft,skin,0,-.064,.085,.04,.02,.08);ell(ft,skin,k*-.004,-.058,.135,.043,.024,.035);
 ell(ft,skin,k*.036,-.01,-.005,.012,.016,.014);ell(ft,skin,k*-.034,-.018,-.005,.012,.016,.014);ell(ft,skin,0,.01,-.03,.016,.04,.013);
 const Ls=[.036,.03,.028,.024,.02],Rs=[.0115,.0088,.008,.0072,.0065];
 for(let i=0;i<5;i++){const x=k*(-.026+i*.0175),z=.158-i*.004,L=Ls[i],r=Rs[i];seg(ft,skin,[x,-.066,z],[x,-.063,z+L*.55],r);seg(ft,skin,[x,-.063,z+L*.55],[x,-.066,z+L],r*.85)}}
function head(hd,skin,dark,o){
 const g=new T.SphereGeometry(1,56,40),P=g.attributes.position,sm=(a,b,v)=>{v=Math.min(1,Math.max(0,(v-a)/(b-a)));return v*v*(3-2*v)};
 for(let i=0;i<P.count;i++){let x=P.getX(i),y=P.getY(i),z=P.getZ(i);const jaw=sm(.15,-.9,y);x*=1-.34*jaw;z*=1-.1*jaw;
  if(y<-.5&&z>0)z+=.12*sm(-.5,-.95,y);
  const G=(cx,cy,cz,r,a)=>a*Math.exp(-((x-cx)**2+(y-cy)**2+(z-cz)**2)/(r*r));
  if(z>0){z+=G(0,.3,.9,.4,.06)+G(.55,-.1,.7,.3,.05)+G(-.55,-.1,.7,.3,.05)-G(.36,.2,.93,.14,.05)-G(-.36,.2,.93,.14,.05)}
  P.setXYZ(i,x,y,z)}
 g.computeVertexNormals();const hm=new T.Mesh(g,skin);hm.scale.set(.088,.12,.103);hm.position.set(0,.1,.01);hm.castShadow=true;hd.add(hm);
 const white=mk(0xe8e4dc,.3),iris=mk(0x3a2414,.25),pup=mk(0x050505,.2),lip=mk(0x9a5f52,.5),brow=mk(0x1a120d,.9);
 for(const k of[-1,1]){const x=k*.036;ell(hd,white,x,.12,.099,.0118,.0097,.0105);ell(hd,iris,x,.12,.1075,.0066,.0066,.0035);ell(hd,pup,x,.12,.1095,.003,.003,.002);
  ell(hd,skin,x,.1295,.1015,.0135,.0045,.0115);ell(hd,skin,x,.1105,.1015,.0125,.0038,.0108);
  const b=box(hd,brow,x,.1445,.103,.04,.0075,.01);b.rotation.z=k*.1;b.rotation.y=-k*.3;
  ell(hd,skin,k*.09,.092,-.003,.0095,.027,.019);
  ell(hd,skin,k*.0125,.068,.105,.0072,.0088,.0085);ell(hd,dark,k*.006,.0615,.1115,.0026,.0018,.0026)}
 ell(hd,skin,0,.092,.103,.0085,.03,.0105);ell(hd,skin,0,.067,.1135,.0108,.0098,.0118);
 ell(hd,lip,0,.0355,.093,.02,.0052,.0075);ell(hd,lip,0,.0235,.092,.0175,.0068,.0075);box(hd,dark,0,.029,.0975,.036,.0012,.003);
 const base=mk(o.hair,.9),hs=new T.Mesh(new T.SphereGeometry(1,24,14,0,6.283,0,1.62),base);hs.scale.set(.093,.124,.107);hs.position.set(0,.1,.004);hd.add(hs);
 const n=360,im=new T.InstancedMesh(new T.SphereGeometry(1,8,6),mk(0xffffff,.78),n),M=new T.Matrix4(),Q=new T.Quaternion(),E=new T.Euler(),bc=new T.Color(o.hair),grey=[];
 for(let i=0,c=0;c<n&&i<4000;i++){const u=Math.random()*6.283,v=Math.acos(1-Math.random()*1.02),d=V(Math.sin(v)*Math.cos(u),Math.cos(v),Math.sin(v)*Math.sin(u));
  if(d.y<.15||(d.z>.5&&d.y<.62))continue;const side=sm(.5,.15,d.y),r=(.013+Math.random()*.008)*(1-.45*side)*(d.y>.8?1.15:1);
  M.compose(V(.088*1.04*d.x,.1+.12*1.04*d.y,.01+.103*1.04*d.z),Q.setFromEuler(E.set(R(0,3),R(0,3),R(0,3))),V(r,r*.8,r*1.1));im.setMatrixAt(c,M);
  im.setColorAt(c,bc.clone().multiplyScalar(.7+Math.random()*.7));grey.push(Math.random()<.3||d.z>.1&&d.y<.7&&Math.abs(d.x)>.6);c++}
 im.castShadow=true;hd.add(im);
 const hp=n_=>{const gc=new T.Color(0xb4b2ae);for(let i=0;i<grey.length;i++){const c=bc.clone().multiplyScalar(.7+((i*37)%10)/14);im.setColorAt(i,n_==2&&grey[i]?c.clone().lerp(gc,.6):c)}im.instanceColor.needsUpdate=true;base.color.set(n_==2?0x5a5754:o.hair)};
 return{hp,iris}}
function human(o){
 const root=new T.Group(),B={},S={},hh=.97;
 const skin=mk(o.skin,.6),gi=mk(o.gi,.92,{side:T.DoubleSide,bumpMap:weaveT,bumpScale:1.2}),gi2=mk(o.gi2||0xd8d3c4,.95,{side:T.DoubleSide}),tape=mk(0xe9e5da,.9),belt=mk(o.belt,.6),dark=mk(0x120e0c,.6),hair=mk(o.hair,.8);
 const glow=new T.MeshBasicMaterial({color:0xff7a20,transparent:true,opacity:.0});
 const bone=(n,par,x,y,z)=>{const b=new T.Bone();b.name=n;b.position.set(x,y,z);par.add(b);B[n]=b;return b};
 const hips=bone('hips',root,0,hh,0),sp=bone('sp',hips,0,.1,0),ch=bone('ch',sp,0,.2,0),nk=bone('nk',ch,0,.3,0),hd=bone('hd',nk,0,.08,0);
 // tronco
 ell(hips,skin,0,0,0,.17,.12,.12);
 const giTop=[];const gg=(m)=>{giTop.push(m);return m};
 gg(ell(sp,gi,0,.02,0,.205,.2,.14));gg(ell(ch,gi,0,.06,0,.215,.27,.15));
 const hem=new T.Mesh(new T.CylinderGeometry(.2,.225,.17,22,1,true),gi);hem.position.set(0,-.19,0);hem.scale.z=.78;hips.add(hem);gg(hem);
 for(const k of[-1,1]){const l=gg(box(ch,gi2,k*.045,.1,.147,.05,.4,.015));l.rotation.z=k*.3}
 const mus=new T.Group();ch.add(mus);
 ell(ch,skin,0,.06,0,.185,.25,.115);ell(ch,skin,0,.2,-.005,.2,.1,.11);ell(sp,skin,0,.0,0,.16,.17,.105);ell(ch,skin,0,.1,-.07,.17,.2,.07);
 for(const k of[-1,1]){ell(mus,skin,k*.085,.17,.085,.095,.075,.055);ell(mus,skin,k*.17,.08,-.02,.07,.16,.075);ell(mus,skin,k*.08,.3,-.02,.1,.05,.07);for(let i=0;i<3;i++)ell(sp,skin,k*.04,-.04+i*.075,.11,.042,.036,.03).visible=true}
 ell(mus,skin,0,.12,.07,.17,.2,.1);
 sp.children.slice(-6).forEach(m=>{mus.add(m)});
 limb(nk,skin,.12,[.056,.058,.06,.058,.062],1,-.1);
 const HD=head(hd,skin,dark,o);
 // braços e pernas
 for(const k of[-1,1]){const s=k>0?'L':'R';
  const cl=bone('cl'+s,ch,k*.06,.27,0),ua=bone('ua'+s,cl,k*.14,0,0),fa=bone('fa'+s,ua,0,-.3,0),ha=bone('ha'+s,fa,0,-.27,0);
  const th=bone('th'+s,hips,k*.1,0,0),sh=bone('sh'+s,th,0,-.45,0),ft=bone('ft'+s,sh,0,-.43,0);
  ell(ua,skin,0,-.01,0,.07,.08,.065);limb(ua,skin,.3,[.056,.06,.052,.045,.042],.95);ell(fa,skin,0,0,0,.043,.043,.043);
  limb(fa,skin,.27,[.044,.047,.042,.034,.03],.9);
  gg(limb(ua,gi,.3,[.092,.098,.104,.108,.11],.95));gg(limb(fa,gi,.12,[.108,.108,.1,.092]));
  limb(fa,tape,.15,[.036,.039,.038,.034],.9,.12);
  // glow rings
  for(const[b,y]of[[fa,.1],[sh,.3]]){const t=new T.Mesh(new T.TorusGeometry(.05,.008,8,20),glow);t.rotation.x=Math.PI/2;t.position.y=-y;b.add(t);(o.glow=o.glow||[]).push(t)}
  fistHand(ha,skin,tape,k);
  S['fist'+s]=new T.Object3D();S['fist'+s].position.set(0,-.1,.04);ha.add(S['fist'+s]);S['hand'+s]=ha;
  // perna
  ell(th,skin,0,-.02,0,.1,.1,.1);limb(th,skin,.45,[.098,.095,.078,.063,.056],1);ell(sh,skin,0,0,0,.055,.055,.06);
  limb(sh,skin,.43,[.058,.067,.054,.04,.036],1);
  limb(th,gi,.45,[.133,.138,.13,.125,.123],1);limb(sh,gi,.38,[.123,.128,.12,.11,.098],1);
  footBuild(ft,skin,k);
  S['foot'+s]=new T.Object3D();S['foot'+s].position.set(0,-.06,.15);ft.add(S['foot'+s]);
 }
 // faixa
 const bt=new T.Mesh(new T.CylinderGeometry(.2,.2,.07,24),belt);bt.scale.z=.72;bt.position.y=.0;hips.add(bt);
 box(hips,belt,0,0,.15,.07,.07,.04);const tails=[];for(const k of[-1,1]){const t=box(hips,belt,k*.04,-.17,.17,.045,.34,.012);t.geometry.translate(0,-.0,0);t.rotation.z=k*.12;tails.push(t)}
 S.chest=new T.Object3D();S.chest.position.set(0,.15,.14);ch.add(S.chest);
 S.back=new T.Object3D();S.back.position.set(0,.15,-.14);ch.add(S.back);
 giTop.forEach(m=>fold(m,.007));
 return{hairPhase:HD.hp,iris:HD.iris,root,B,S,hh,gi:giTop,mus,belt,hair,glow:o.glow,tails,skin,gim:[gi]}
}
/* ============ POSES / ANIMAÇÕES (keyframes + eventos) ============ */
const Z=[0,0,0];
const DEF={hp:Z,hr:Z,sp:Z,ch:Z,nk:Z,hd:Z,cL:Z,cR:Z,aL:Z,aR:Z,eL:Z,eR:Z,wL:Z,wR:Z,ftL:[.12,.08,0],ftR:[-.12,.08,0],fpL:Z,fpR:Z,kp:Z,fw:[0,0,0],r:[0,0,0,0]};
const G={hp:[0,-.1,0],hr:[0,-15,0],sp:[6,-8,0],ch:[4,0,0],hd:[-8,8,0],aL:[-38,0,10],eL:[-128,0,0],aR:[-48,0,-10],eR:[-132,0,0],ftL:[.17,.08,.34],ftR:[-.14,.08,-.26],fpL:[0,8,0],fpR:[0,-35,0],fw:[1,0,0]};
const C={}; // clips
const clip=(name,keys,ev=[],loop=false)=>C[name]={keys,ev,loop};
clip('idle',[[0,G],[1,{hp:[0,-.115,0],sp:[8,-8,0],aL:[-40,0,10]}],[2,{}]],[],true);
clip('jab',[[0,G],[.07,{sp:[6,6,0],hr:[0,-4,0],aL:[-25,0,8],eL:[-135,0,0]}],[.15,{sp:[8,-30,0],hr:[0,-28,0],aL:[-89,0,3],eL:[-4,0,0],r:[0,0,.2,0]}],[.24,{}],[.42,G]],[[.15,'hit','fistL',1]]);
clip('cross',[[0,G],[.08,{sp:[6,-14,0],hr:[0,-25,0],aR:[-30,0,-8],eR:[-135,0,0]}],[.17,{sp:[8,36,0],hr:[0,32,0],aR:[-90,0,-3],eR:[-4,0,0],ftR:[-.14,.1,-.05],fpR:[-20,-35,0],r:[0,0,.25,0]}],[.28,{}],[.5,G]],[[.17,'hit','fistR',1]]);
clip('heavy',[[0,G],[.3,{hp:[0,-.22,-.1],hr:[0,-48,0],sp:[10,-42,0],aR:[22,0,-14],eR:[-100,0,0],aL:[-50,0,16],r:[0,0,-.1,0]}],[.46,{hp:[0,-.2,.05],hr:[0,42,0],sp:[16,42,0],aR:[-92,0,-4],eR:[-3,0,0],ftR:[-.14,.1,.1],fpR:[-25,-35,0],r:[0,0,.5,0]}],[.62,{}],[.95,{r:[0,0,.5,0]}],[1.1,G]],[[.46,'knockback','fistR',2]]);
clip('uppercut',[[0,G],[.14,{hp:[0,-.3,0],sp:[14,-14,0],hr:[0,-30,0],aR:[8,0,-12],eR:[-70,0,0]}],[.3,{hp:[0,-.05,.1],sp:[-8,28,0],hr:[0,28,0],aR:[-62,0,-4],eR:[-132,0,0],r:[0,0,.3,0],ftR:[-.14,.12,-.1],fpR:[-25,-35,0]}],[.42,{}],[.8,G]],[[.3,'launch','fistR',2]]);
clip('kickR',[[0,G],[.16,{hp:[0,-.12,.08],hr:[0,-20,0],sp:[-6,-5,0],ftR:[-.2,.75,.25],fpR:[20,-35,0],kp:[0,30,0],aL:[-60,0,20],eL:[-100,0,0],aR:[-30,0,-30],r:[0,0,.1,0]}],[.28,{hr:[0,34,0],sp:[-8,20,0],ftR:[.05,1.15,1.0],fpR:[-30,10,0],kp:[0,-25,0],r:[0,0,.3,0]}],[.4,{}],[.62,{ftR:[-.2,.7,.3],fpR:[0,-35,0],hr:[0,-15,0],sp:[6,-8,0],r:[0,0,.3,0]}],[.9,G]],[[.28,'knockback','footR',2]]);
clip('spin',[[0,G],[.16,{hp:[0,-.2,0],sp:[6,-40,0],hr:[0,-60,0],r:[0,0,0,-120],ftR:[-.14,.12,-.1],fw:[0,0,0],ftL:[.12,.08,0],fpR:[0,0,0]}],[.4,{hp:[0,-.05,0],sp:[-4,-30,0],hr:[0,-30,0],r:[0,0,.12,-320],ftR:[-.05,1.12,.95],fpR:[-30,0,0],kp:[0,0,0],aL:[-70,0,40],eL:[-20,0,0],aR:[-70,0,-40],eR:[-20,0,0]}],[.55,{r:[0,0,.12,-360],ftR:[-.14,.5,.3]}],[.8,{r:[0,0,.12,-360]}],[1.0,{r:[0,0,0,-360]}]],[[.4,'knockback','footR',2]]);
clip('fly',[[0,G],[.2,{hp:[0,-.3,-.1],sp:[10,0,0],r:[0,0,.1,0],aL:[-40,0,10]}],[.5,{hp:[0,.2,0],hr:[-55,0,0],sp:[0,0,0],ch:[0,0,0],hd:[10,0,0],aL:[-30,0,40],eL:[-60,0,0],aR:[-30,0,-40],eR:[-60,0,0],ftL:[.12,1.0,.95],ftR:[-.12,.55,.12],fpL:[-40,0,0],fw:[0,0,0],kp:[0,0,0],r:[0,1.0,1.2,0]}],[.7,{r:[0,1.0,1.7,0]}],[1.0,{r:[0,.0,2.5,0],hr:[0,0,0],ftL:[.17,.08,.34],ftR:[-.14,.08,-.26],fw:[0,0,0],aL:[-38,0,10],eL:[-128,0,0],aR:[-48,0,-10],eR:[-132,0,0],hp:[0,-.3,0]}],[1.3,{hp:[0,-.1,0]}]],[[.5,'aerialKick','footL',2]]);
clip('parry',[[0,G],[.1,{sp:[6,15,0],hr:[0,-8,0],aL:[-70,0,-30],eL:[-100,0,0],aR:[-30,0,-20]}],[.2,{sp:[6,-22,0],aL:[-60,0,38],eL:[-70,0,0]}],[.5,G]],[[.12,'parry','fistL',1]]);
clip('dodge',[[0,G],[.14,{hp:[0,-.2,-.1],sp:[-16,-8,0],hd:[10,8,0],fw:[0,0,0],ftL:[.17,.2,.2],ftR:[-.14,.12,-.4],r:[0,0,-.8,0]}],[.3,{r:[0,.05,-1.0,0],ftL:[.17,.08,.34],ftR:[-.14,.08,-.26]}],[.55,{r:[0,0,-1.0,0],fw:[0,0,0],hp:[0,-.12,0],sp:[6,-8,0],hd:[-8,8,0]}]],[[.14,'dodge','chest',0]]);
clip('special',[ // uppercut -> salto atrás do alvo -> chute descendente -> ground slam
 [0,G],[.14,{hp:[0,-.3,0],sp:[14,-14,0],hr:[0,-30,0],aR:[8,0,-12],eR:[-70,0,0]}],
 [.3,{hp:[0,-.05,.1],sp:[-8,28,0],hr:[0,28,0],aR:[-62,0,-4],eR:[-132,0,0],r:[0,0,.3,0],ftR:[-.14,.12,-.1],fpR:[-25,-35,0]}],
 [.46,{hp:[0,-.2,0],sp:[10,0,0],hr:[0,0,0],aR:[-30,0,-20],eR:[-100,0,0],aL:[-30,0,20],eL:[-100,0,0],ftL:[.12,.25,.3],ftR:[-.12,.4,.1],fw:[0,0,0],r:[0,.35,.5,0]}],
 [.7,{hp:[0,0,0],hr:[-35,0,0],sp:[-10,0,0],aL:[-120,0,30],eL:[-40,0,0],aR:[-120,0,-30],eR:[-40,0,0],ftL:[.12,.5,.1],ftR:[-.12,.4,0],r:[0,1.9,1.4,-100]}],
 [.88,{hr:[-110,0,0],sp:[0,0,0],aL:[-60,0,30],aR:[-60,0,-30],ftL:[.1,.9,.1],ftR:[0,1.9,.1],fpR:[-60,0,0],r:[0,2.3,1.9,-180]}],
 [.97,{hr:[-95,0,0],ftR:[0,1.4,.55],ftL:[.12,.4,0],kp:[0,0,0],r:[0,2.1,2.0,-180]}],
 [1.15,{hr:[-5,0,0],ftR:[-.1,.08,.1],ftL:[.12,.5,.3],r:[0,0,2.1,-180]}],[1.3,{hp:[0,-.25,0],ftL:[.17,.08,.34],ftR:[-.14,.08,-.26]}],[1.7,{hp:[0,-.1,0],hr:[0,-15,0],sp:[6,-8,0],aL:[-38,0,10],eL:[-128,0,0],aR:[-48,0,-10],eR:[-132,0,0]}]],
 [[.3,'launch','fistR',2],[.55,'jumpBehind','chest',0],[.97,'aerialKick','footR',3],[1.06,'groundSlam','footR',3]]);
clip('recuo',[[0,G],[.15,{hp:[0,-.25,0],r:[0,0,-.4,0],fw:[0,0,0],ftL:[.17,.35,.1],ftR:[-.14,.2,-.5]}],[.55,{hp:[0,.15,0],r:[0,1.2,-3,0],ftL:[.12,.6,-.2],ftR:[-.12,.5,-.3],hr:[-12,0,0]}],[1.0,{hp:[0,-.3,0],r:[0,0,-5.2,0],ftL:[.17,.08,.1],ftR:[-.14,.08,-.4],hr:[0,0,0]}],[1.3,{hp:[0,-.12,0],ftL:[.2,.08,.2],ftR:[-.2,.08,-.2],fw:[0,0,0]}]],[[.55,'retreat','chest',0]]);
clip('carga',[[0,{hp:[0,-.1,0],ftL:[.2,.08,.1],ftR:[-.2,.08,-.1],fw:[1,0,0],aL:[-10,0,25],eL:[-90,0,0],aR:[-10,0,-25],eR:[-90,0,0],sp:[0,0,0]}],[.5,{hp:[0,-.2,0],aL:[-20,0,75],eL:[-30,0,0],aR:[-20,0,-75],eR:[-30,0,0],ch:[-8,0,0],hd:[-12,0,0]}],[.8,{hp:[0,-.12,0],aL:[-110,0,40],eL:[-20,0,0],aR:[-110,0,-40],eR:[-20,0,0],ch:[0,0,0],hd:[-5,0,0]}],[1.4,{hp:[0,-.2,0],aL:[-175,0,25],eL:[-5,0,0],aR:[-175,0,-25],eR:[-5,0,0],ch:[-14,0,0],hd:[-18,0,0]}],[2,{hp:[0,-.12,0],aL:[-140,0,70],eR:[-10,0,0],aR:[-140,0,-70],ch:[-6,0,0]}]],[]);
// compila (cada key herda o anterior)
for(const c of Object.values(C)){let acc=Object.assign({},DEF);c.k=c.keys.map(([t,p])=>{acc=Object.assign({},acc,p);return[t,acc]});c.dur=c.k[c.k.length-1][0]}
const sm=u=>u*u*(3-2*u),lerpA=(a,b,u)=>a.map((v,i)=>v+(b[i]-v)*u);
function sample(c,t){const k=c.k;if(t>=c.dur)return k[k.length-1][1];let i=0;while(k[i+1][0]<=t)i++;const u=sm((t-k[i][0])/(k[i+1][0]-k[i][0])),a=k[i][1],b=k[i+1][1],o={};for(const n in a)o[n]=lerpA(a[n],b[n],u);return o}
/* ============ APLICA POSE (FK corpo/braços, IK 2 ossos nas pernas = pés sem deslizar) ============ */
const rot=(b,a)=>b.rotation.set(a[0]*D,a[1]*D,a[2]*D,'YXZ');
const _v=V(0,0,0),_q=new T.Quaternion(),_q2=new T.Quaternion(),DN=V(0,-1,0);
function applyPose(h,p,S0){
 const B=h.B,rt=h.root;
 rt.position.copy(S0.pos).add(V(p.r[0],p.r[1],p.r[2]).applyAxisAngle(V(0,1,0),S0.yaw));rt.rotation.y=S0.yaw+p.r[3]*D;
 B.hips.position.set(p.hp[0],h.hh+p.hp[1],p.hp[2]);rot(B.hips,p.hr);
 ['sp','ch','nk','hd'].forEach(n=>rot(B[n],p[n]));
 for(const s of['L','R']){rot(B['cl'+s],p['c'+s]);rot(B['ua'+s],p['a'+s]);rot(B['fa'+s],p['e'+s]);rot(B['ha'+s],p['w'+s])}
 rt.updateMatrixWorld(true);
 const fw=p.fw[0];
 for(const s of['L','R']){const th=B['th'+s],sh=B['sh'+s],ft=B['ft'+s],f=p['ft'+s];
  const tr=V(f[0],f[1],f[2]).applyAxisAngle(V(0,1,0),rt.rotation.y).add(rt.position);
  const ts=V(f[0],f[1],f[2]).applyAxisAngle(V(0,1,0),S0.yaw).add(S0.pos);
  const tg=tr.lerp(ts,fw),H=th.getWorldPosition(V(0,0,0)),l1=.45,l2=.43;
  const d=tg.clone().sub(H),L=Math.min(d.length(),(l1+l2)*.999),dir=d.normalize();
  const a=(l1*l1-l2*l2+L*L)/(2*L),hgt=Math.sqrt(Math.max(l1*l1-a*a,0));
  const yaw=rt.rotation.y+p.kp[s=='L'?0:1]*D*(s=='L'?1:1);
  let pole=V(Math.sin(yaw),0,Math.cos(yaw));pole.sub(dir.clone().multiplyScalar(pole.dot(dir))).normalize();
  const K=H.clone().add(dir.clone().multiplyScalar(a)).add(pole.multiplyScalar(hgt)),A=H.clone().add(dir.multiplyScalar(L));
  const pq=th.parent.getWorldQuaternion(_q);_q.copy(pq);
  const qd=new T.Quaternion().setFromUnitVectors(DN,K.clone().sub(H).normalize());
  th.quaternion.copy(_q.clone().invert().multiply(qd));th.updateMatrixWorld(true);
  const q2=new T.Quaternion().setFromUnitVectors(DN,A.clone().sub(K).normalize());
  sh.quaternion.copy(qd.clone().invert().multiply(q2));sh.updateMatrixWorld(true);
  const fq=new T.Quaternion().setFromEuler(new T.Euler(p['fp'+s][0]*D,rt.rotation.y+p['fp'+s][1]*D,p['fp'+s][2]*D,'YXZ'));
  ft.quaternion.copy(q2.clone().invert().multiply(fq));
 }
 rt.updateMatrixWorld(true);
}

    function makeGuardian(i){
      const elIndex=i%4,el=elementDefs[elIndex][0],c=elementDefs[elIndex][1];
      const g=human({skin:[0x7a5238,0x8a6040,0x6e4630,0x946a4a][elIndex],gi:0x3a3f22,belt:0x24301c,hair:0x0c0a08});
      g.gi.forEach(m=>m.visible=false);g.mus.visible=true;
      const rm=new T.MeshBasicMaterial({color:c});const root=g.root;
      // coroa de folhas — exatamente a construção do arquivo de referência
      for(let k=0;k<5;k++){
        const l=new T.Mesh(new T.ConeGeometry(.045,.42,6),mk(0x2f6a30,.9));
        l.position.set(Math.sin(k*1.26-2.5)*.1,.24,Math.cos(k*1.26-2.5)*.02);
        l.rotation.z=(k-2)*.28;g.B.hd.add(l);
      }
      // manto de casca
      const man=new T.Mesh(new T.ConeGeometry(.3,.5,10,1,true),mk(0x4b3b27,1,{side:T.DoubleSide}));
      man.position.set(0,.12,-.02);man.scale.z=.7;g.B.ch.add(man);
      // três runas no peito
      for(let k=0;k<3;k++){
        const r=new T.Mesh(new T.TorusGeometry(.12+k*.01,.008,6,20),rm);
        r.position.set(0,.05+k*.07,.1);r.rotation.x=Math.PI/2;g.B.ch.add(r);
      }
      // vestimenta ancestral
      const sk=new T.Mesh(new T.ConeGeometry(.2,.65,12,1,true),mk(0x2e4a26,1,{side:T.DoubleSide}));
      sk.position.y=-.2;sk.scale.z=.8;g.B.hips.add(sk);
      g.el=el;g.ang=i/8*Math.PI*2;g.r=16;g.S0={pos:V(0,0,0),yaw:0};
      root.scale.setScalar(.95+.05*(i%3));root.visible=false;
      ritualGroup.add(root);ritualGuardians.push(g);return g;
    }
    function guardPose(g,t,mode){
      const up=mode>=1;
      const p=Object.assign({},DEF,{hp:[0,-.14+Math.sin(t*2+g.ang)*.02,0],aL:up?[-165,0,22]:[-15,0,10],aR:up?[-165,0,-22]:[-15,0,-10],eL:[-8,0,0],eR:[-8,0,0],ch:[up?-12:0,0,0],hd:[up?-14:0,0,0],fw:[0,0,0]});
      const w=mode==0?Math.sin(t*7+g.ang)*.2:0,sw=Math.sin(t*7+g.ang);
      p.ftL=[.12,.08+Math.max(0,sw)*.12*(mode==0),w];
      p.ftR=[-.12,.08+Math.max(0,-sw)*.12*(mode==0),-w];
      if(mode==0){p.aL=[-20+sw*25,0,8];p.aR=[-20-sw*25,0,-8]}
      applyPose(g,p,g.S0);
    }
    return {makeGuardian,guardPose,V};
  })();
  
    for(let i=0;i<8;i++){const g=exactGuardianRig.makeGuardian(i);g.el=['fire','water','earth','leaf'][i%4]}
    let ritualState=null;
    const flash=document.createElement('div');flash.style.cssText='position:fixed;inset:0;background:#fff;opacity:0;pointer-events:none;z-index:65;transition:opacity .12s';document.body.appendChild(flash);

    // ---------- Combat ----------
    const A1=[
      ['Hook','Hook',.44,12,null,'leftHand'],['Cross','Cross Punch',.46,14,null,'rightHand'],['Uppercut','Uppercut',.48,18,null,'rightHand'],
      ['Chute forte','Roundhouse Kick',.52,21,null,'rightFoot'],['Armada','Armada',.56,22,null,'leftFoot'],['Meia lua','Meia Lua De Compasso Back',.58,23,null,'rightFoot'],['Combo cotovelo','Punch To Elbow Combo',.47,24,null,'rightHand']
    ];
    const A2=[
      ['Soco de fogo','Cross Punch',.46,19,'fire','rightHand'],['Uppercut de terra','Uppercut',.48,23,'earth','rightHand'],['Chute explosivo','Roundhouse Kick',.52,26,'fire','rightFoot'],
      ['Giro de folhas','Armada',.56,25,'leaf','leftFoot'],['Meia lua de água','Meia Lua De Compasso Back',.58,27,'water','leftFoot'],['Martelo sísmico','Martelo Do Chau Sem Mao',.63,30,'earth','rightHand'],['Combo elemental','Punch To Elbow Combo',.45,31,'fire','rightHand']
    ];
    let attack=null,attackCd=0,comboCd=4,lastSwing=null,lastHammer=null;
    function facePlayer(){const dx=player.x-bossRoot.position.x,dz=player.z-bossRoot.position.z;bossRoot.rotation.y=Math.atan2(dx,dz)}
    function playerDist(){return Math.hypot(player.x-bossRoot.position.x,player.z-bossRoot.position.z)}
    function playerInRange(r=CFG.attackRange){return playerDist()<=r}
    function damagePlayer(amount,label){window.gameZombie?.hurtPlayer?.(amount,label,'mestre-marcial')}
    function startAttack(def){
      if(!alive||dead||transitioning||attack||comboMotion)return false;facePlayer();
      const [label,clip,hitFrac,dmg,fx,key]=def,p=playOne(clip,1,false);if(!p)return false;
      state='ATTACK';attack={label,elapsed:0,duration:p.duration,hitAt:p.duration*hitFrac,hit:false,damage:dmg,fx,key};attackCd=.65+Math.random()*.55;return true;
    }
    function updateAttack(dt){if(!attack)return;facePlayer();attack.elapsed+=dt;if(!attack.hit&&attack.elapsed>=attack.hitAt){attack.hit=true;if(playerInRange(3.15)){damagePlayer(attack.damage,attack.label);if(attack.fx)hitFx(attack.fx,attack.key,true)}}if(attack.elapsed>=attack.duration+.05){attack=null;state='CHASE';playIdle()}}

    // ---------- Aerial combo: Uppercut -> chase upward -> Front Twist -> boss descends on player ----------
    let victimYOffset=0,comboMotion=null;
    let avatarHookInstalled=false;
    function installVictimVisualHook(){
      if(avatarHookInstalled)return;avatarHookInstalled=true;const prev=window.__updateAnimatedAvatar;
      window.__updateAnimatedAvatar=(...args)=>{prev?.(...args);if(victimYOffset<=.001)return;const tfp=game.trueFirstPerson;if(!tfp?.visibleRoot)return;tfp.visibleRoot.position.y+=victimYOffset;tfp.visibleRoot.updateMatrixWorld(true);if(tfp.eyeSocket){const ep=tfp.eyeSocket.getWorldPosition(new T.Vector3());camera.position.copy(ep);camera.updateMatrixWorld(true)}};
    }
    installVictimVisualHook();
    function startAerialCombo(){
      if(!alive||dead||transitioning||attack||comboMotion||comboCd>0||playerDist()>3.05)return false;facePlayer();state='COMBO';comboCd=9+Math.random()*4;
      const up=playOne('Combo Uppercut',1,false);if(!up)return false;comboMotion={stage:'upper',t:0,upDur:up.duration,frontDur:clips[phase]['Front Twist Flip'].duration,hit:false,capture:false,impact:false,ground:game.groundY(bossRoot.position.x,bossRoot.position.z),startXZ:new T.Vector2(bossRoot.position.x,bossRoot.position.z)};return true;
    }
    function updateCombo(dt){const c=comboMotion;if(!c)return;c.t+=dt;facePlayer();
      if(c.stage==='upper'){
        if(!c.hit&&c.t>=c.upDur*.43){c.hit=true;if(playerInRange(3.2)){damagePlayer(18,'Uppercut do Mestre Marcial');victimYOffset=.01;if(phase===2)hitFx('earth','rightHand',true)}}
        if(c.hit){const u=clamp((c.t-c.upDur*.43)/(c.upDur*.57),0,1);victimYOffset=3.2*Math.sin(u*Math.PI*.55)}
        if(c.t>=c.upDur*.72){c.stage='front';c.t=0;playOne('Front Twist Flip',1,false)}
      }else{
        const u=clamp(c.t/c.frontDur,0,1);const targetY=Math.max(victimYOffset+.65,2.4);
        let yOff;
        if(u<.46){const q=smooth(u/.46);yOff=targetY*q;victimYOffset=Math.max(victimYOffset,2.6+1.1*Math.sin(q*Math.PI*.55))}
        else {if(!c.capture){c.capture=true;damagePlayer(8,'Captura aérea do Mestre Marcial')}const q=smooth((u-.46)/.40);yOff=targetY*(1-q);victimYOffset=Math.max(0,yOff-.35)}
        // Track player horizontally so the flip actually ends on top of the player.
        const h=smooth(clamp(u/.68,0,1));bossRoot.position.x+=(player.x-bossRoot.position.x)*Math.min(1,dt*(4+5*h));bossRoot.position.z+=(player.z-bossRoot.position.z)*Math.min(1,dt*(4+5*h));
        bossRoot.position.y=game.groundY(bossRoot.position.x,bossRoot.position.z)+Math.max(0,yOff);
        if(!c.impact&&u>=.86){c.impact=true;victimYOffset=0;damagePlayer(34+(phase===2?8:0),'Queda do Front Twist');const p=new T.Vector3(player.x,game.groundY(player.x,player.z)+.05,player.z);ring(p,phase===2?0xff8a35:0xfff0c0,4.2,.72);if(phase===2){for(const el of ['fire','water','earth','leaf'])burst(el,p.clone().add(new T.Vector3(0,.4,0)),18,3.2)}}
        if(u>=1){victimYOffset=0;bossRoot.position.y=game.groundY(bossRoot.position.x,bossRoot.position.z);comboMotion=null;state='CHASE';playIdle()}
      }
    }

    // ---------- Ritual / phase change ----------
    async function startRitual(){
      if(transitioning||dead||phase!==1)return;transitioning=true;state='TRANSITION';attack=null;comboMotion=null;victimYOffset=0;playIdle();ritualGroup.visible=true;ritualGuardians.forEach((g,i)=>{g.r=16;g.ang=i/8*Math.PI*2;g.root.visible=false});ritualState={mode:'wave',t:0};
      for(const el of ['fire','water','earth','leaf']){const p=bossRoot.position.clone().add(new T.Vector3(0,1,0));burst(el,p,36,3.2);ring(new T.Vector3(p.x,game.groundY(p.x,p.z)+.04,p.z),EC[el],5.5,.9);await sleep(520)}
      ritualGuardians.forEach(g=>g.root.visible=true);ritualState={mode:'approach',t:0};await sleep(3200);ritualState.mode='circle';ritualState.t=0;await sleep(4200);ritualState.mode='converge';ritualState.t=0;await sleep(2400);
      flash.style.opacity='1';await sleep(260);setModelPhase(2);await sleep(180);flash.style.opacity='0';ritualGroup.visible=false;ritualGuardians.forEach(g=>g.root.visible=false);ritualState=null;transitioning=false;state='CHASE';playIdle();updateHud();
    }
    function updateRitual(dt){if(!ritualState)return;ritualState.t+=dt;const mode=ritualState.mode,c=bossRoot.position;ritualGuardians.forEach((g,i)=>{if(mode==='approach'){g.r=Math.max(5.2,g.r-dt*3.45);g.ang+=dt*.15}else if(mode==='circle'){g.ang+=dt*.92}else if(mode==='converge'){g.ang+=dt*1.35;g.r=Math.max(2.75,g.r-dt*.9)}const x=c.x+Math.cos(g.ang)*g.r,z=c.z+Math.sin(g.ang)*g.r;g.S0.pos.set(x,game.groundY(x,z),z);g.S0.yaw=Math.atan2(c.x-x,c.z-z);exactGuardianRig.guardPose(g,ritualState.t,mode==='approach'?0:1);if(mode!=='approach'&&Math.random()<dt*7){const hands=[g.S.fistL.getWorldPosition(new T.Vector3()),g.S.fistR.getWorldPosition(new T.Vector3())];for(const h of hands){const v=c.clone().add(new T.Vector3(0,1.1,0)).sub(h).normalize().multiplyScalar(2.8);if(g.el==='earth')rock(h,v);else puff(g.el,h,v,.65,.11)}}})}

    let postureBrokenUntil=0;
    function postureBreak(ms=3000){
      if(!alive||dead||transitioning)return false;
      postureBrokenUntil=Math.max(postureBrokenUntil,performance.now()+Math.max(300,Number(ms)||3000));
      attack=null;comboMotion=null;victimYOffset=0;state='POSTURE_BROKEN';playIdle();
      return true;
    }
    function hurt(amount,source='player'){
      if(!alive||dead||transitioning)return false;
      const mult=performance.now()<postureBrokenUntil?(window.gameParry?.config?.damageMultiplier??1.5):1;
      hp=Math.max(0,hp-Math.max(0,Number(amount)||0)*mult);updateHud();
      if(hp<=0){die();return true}if(phase===1&&hp<=CFG.maxHp*CFG.phase2At)startRitual();return true;
    }
    function die(){if(dead)return;dead=true;alive=false;state='DEATH';attack=null;comboMotion=null;victimYOffset=0;ritualGroup.visible=false;transitioning=false;const p=playOne('Knocked Out',1,false);updateHud();setTimeout(()=>{bossRoot.visible=false;hud.style.display='none';state='DEAD';window.gameProgression?.dropXP?.(CFG.xpReward,bossRoot.position.clone(),'Mestre Marcial')},Math.max(2800,(p?.duration||2.5)*1000))}

    // Weapon hits from the real PC player.
    function facingBoss(range=3.6,deg=82){if(!alive||!bossRoot.visible)return false;const dx=bossRoot.position.x-player.x,dz=bossRoot.position.z-player.z,d=Math.hypot(dx,dz);if(d>range)return false;const dir=new T.Vector3();camera.getWorldDirection(dir);dir.y=0;dir.normalize();return (dir.x*dx+dir.z*dz)/Math.max(.001,d)>=Math.cos(deg*Math.PI/180)}
    window.addEventListener('game:axe-impact',ev=>{const sw=ev.detail?.swingId??performance.now();if(sw===lastSwing||window.gameRightHand?.current!=='axe'||!facingBoss(3.6,84))return;lastSwing=sw;hurt(window.gameProgression?.modifyAxeDamage?.(34)??34,'axe')});
    window.addEventListener('game:hammer-impact',ev=>{const sw=ev.detail?.swingId??performance.now();if(sw===lastHammer)return;let hit=false;const p=ev.detail?.position;if(p&&Number.isFinite(p.x)){const bp=bossRoot.position;hit=Math.hypot(p.x-bp.x,p.z-bp.z)<1.8&&Math.abs(p.y-(bp.y+1.05))<2.0}else hit=facingBoss(3.9,86);if(!hit)return;lastHammer=sw;hurt(54,'hammer')});

    function findSpawn(){const dir=new T.Vector3();camera.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<.001)dir.set(0,0,1);dir.normalize();for(const d of [10,12,8,14])for(const s of [0,2,-2,4,-4]){const right=new T.Vector3(dir.z,0,-dir.x),x=player.x+dir.x*d+right.x*s,z=player.z+dir.z*d+right.z*s;if(!game.collides?.(x,z))return{x,z,y:game.groundY(x,z)}}return{x:player.x+dir.x*10,z:player.z+dir.z*10,y:game.groundY(player.x+dir.x*10,player.z+dir.z*10)}}
    function spawnNow(){const p=findSpawn();hp=CFG.maxHp;alive=true;dead=false;transitioning=false;attack=null;comboMotion=null;victimYOffset=0;phase=1;bossRoot.position.set(p.x,p.y,p.z);bossRoot.visible=true;ritualGroup.visible=false;setModelPhase(1);facePlayer();state='CHASE';attackCd=1.0;comboCd=4;spawnedOnce=true;updateHud();return true}
    function reset(){alive=false;dead=false;hp=CFG.maxHp;state='HIDDEN';bossRoot.visible=false;ritualGroup.visible=false;ritualState=null;victimYOffset=0;hud.style.display='none';return true}

    // ---------- AI / root grounding ----------
    const clock=new T.Clock();
    function updateAI(dt){
      if(!alive||dead||!bossRoot.visible)return;attackCd-=dt;comboCd-=dt;
      if(performance.now()<postureBrokenUntil){state='POSTURE_BROKEN';if(isWalking)playIdle();bossRoot.position.y=game.groundY(bossRoot.position.x,bossRoot.position.z);return}
      if(state==='POSTURE_BROKEN')state='CHASE';
      if(!comboMotion){bossRoot.position.y=game.groundY(bossRoot.position.x,bossRoot.position.z)}
      if(transitioning)return;
      if(comboMotion){updateCombo(dt);return}
      if(attack){updateAttack(dt);return}
      const d=playerDist();
      if(d>CFG.aggroRange){state='IDLE';if(isWalking)playIdle();return}
      facePlayer();
      if(d>CFG.attackRange*.92){
        state='CHASE';playWalk();
        const dx=player.x-bossRoot.position.x,dz=player.z-bossRoot.position.z,L=Math.max(.001,Math.hypot(dx,dz)),step=Math.min(CFG.moveSpeed*dt,Math.max(0,d-2.15));
        const nx=bossRoot.position.x+dx/L*step,nz=bossRoot.position.z+dz/L*step;
        if(!game.collides?.(nx,nz)){bossRoot.position.x=nx;bossRoot.position.z=nz}
        return
      }
      if(isWalking)playIdle();state='IDLE';
      if(attackCd<=0){if(comboCd<=0&&Math.random()<.24){if(startAerialCombo())return}const list=phase===1?A1:A2;startAttack(list[Math.floor(Math.random()*list.length)])}
    }
    function loop(){requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;const dt=Math.min(.045,clock.getDelta());mixers[1].update(phase===1?dt:0);mixers[2].update(phase===2?dt:0);updateAI(dt);updateRitual(dt);updateVfx(dt)}
    requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

    // Fire powers can discover/damage this boss like the other enemy systems.
    const api={
      version:'V168E-PC',root:bossRoot,get state(){return state},get hp(){return hp},get maxHp(){return CFG.maxHp},get phase(){return phase},get active(){return alive&&bossRoot.visible&&!dead},
      spawnNow,spawn:spawnNow,reset,damage:hurt,forcePhase2(){if(phase===1&&!transitioning){hp=Math.min(hp,CFG.maxHp*.5);startRitual();return true}return false},
      damageRadius(x,z,radius,baseDamage,label='Dano em área',hitSet=null){if(!alive||dead||!bossRoot.visible)return 0;const set=hitSet||new Set();if(set.has(api))return 0;const d=Math.hypot(bossRoot.position.x-x,bossRoot.position.z-z);if(d>radius+CFG.bodyRadius)return 0;set.add(api);const fall=Math.max(.55,1-.4*d/Math.max(.001,radius));hurt(Math.max(0,baseDamage)*fall,label);return 1},
      position(){return bossRoot.position.clone()},forceCombo:startAerialCombo,postureBreak,
      get postureBroken(){return performance.now()<postureBrokenUntil}
    };
    window.gameMartialBoss=api;
    window.gameEnemyOverheadUI?.registerExternal?.('v168:mestre-marcial',{root:bossRoot,type:'zombie',name:'Mestre Marcial',fallbackHeight:2.35,headGap:.28,getHp:()=>hp,getMaxHp:()=>CFG.maxHp,isAlive:()=>alive&&bossRoot.visible&&!dead});
    console.info('[V168E] Mestre Marcial integrado + suporte a postura quebrada.');
  }catch(err){console.error('[V168D] Mestre Marcial:',err);const s=document.getElementById('status');if(s)s.textContent+=' • Mestre Marcial indisponível: '+String(err?.message||err)}
})();
