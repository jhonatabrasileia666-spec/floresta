
/* V104B — Undead Trio + Necromante integrados ao gameplay.
   Fonte visual/poses/IA: previews enviados pelo usuário.
   Política de performance: animações em TODO frame; nenhuma redução de gráfico/qualidade. */
(async()=>{
  if(window.__V104_UNDEAD_NECRO)return;
  window.__V104_UNDEAD_NECRO=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function waitGame(){
    for(let i=0;i<1200;i++){
      const g=window.gameReview;
      if(g?.scene&&g?.camera&&g?.renderer&&g?.player&&g?.groundY&&window.__THREE_MODULE&&window.gameZombie)return g;
      await sleep(20);
    }
    throw new Error('V104: jogo não ficou pronto.');
  }

  const game=await waitGame();
  const T=window.__THREE_MODULE;
  const S=game.scene,cam=game.camera,player=game.player;
  const PI=Math.PI;
  const rnd=(a=1)=>Math.random()*a;
  const cl=(x,a,b)=>Math.max(a,Math.min(b,x));
  const V=()=>new T.Vector3();
  const tmpA=V(),tmpB=V(),tmpC=V(),tmpD=V(),tmpE=V();
  let time=0,last=performance.now(),serial=0;

  const status=document.getElementById('status');
  const CFG={
    threshold:15,
    war:{hp:80,speed:1.7,blockMax:1.9,blockCd:3.5,blockChance:.18,blockChanceHit:.6,frontCos:.5,blockReduce:.1,bashPush:2.5},
    fire:{hp:70,speed:2.6,trot:5.5,minR:5,prefR:9,maxR:14,castCd:3.5,burst:3,burstGap:.35,skullSpeed:7.5,skullTurn:1.7,skullLife:5,loseTime:.5,blockCos:.42},
    cent:{hp:100,chase:5.5,reach:2.8,lungeSpeed:9,lungeCd:5},
    nec:{preferredRange:9,minimumRange:5,maximumRange:13,hp:120,speed:2.2,resCast:3,resCooldown:10,reviveHealthPercent:.55,maxResurrections:1,resurrectionRange:14,corpseLife:40,healCast:2.5,healPortion:.5,healThreshold:.6,healCooldown:3,areaCooldown:25,areaRadius:7,areaPortion:.3,projCooldown:2.5,projSpeed:10,projLife:3,groundDelay:1.3,groundRadius:2.2,groundCooldown:6,blastRange:2.6,blastCooldown:6,spellInterruptThreshold:15}
  };

  /* ===== recursos compartilhados: mesmos gráficos, menos memória/GC ===== */
  const G={
    sphere:new T.SphereGeometry(1,14,10),box:new T.BoxGeometry(1,1,1),cone:new T.ConeGeometry(1,1,6),cyl:new T.CylinderGeometry(1,1,1,8),tor:new T.TorusGeometry(1,.14,5,12),rib:new T.TorusGeometry(1,.12,4,14,PI)
  };
  const mat=(c,e=0,r=.8,m=.2)=>new T.MeshStandardMaterial({color:c,emissive:e,roughness:r,metalness:m});
  const M={
    bone:mat(0xb8b093,0,.95,0),boneD:mat(0x8a8269,0,.95,0),boneC:mat(0x6f6755,0,.95,0),iron:mat(0x26272b,0,.5,.7),rust:mat(0x4a2e22,0,.8,.5),cloth:mat(0x19161a,0,1,0),black:mat(0x050505,0,1,0),teeth:mat(0xd8d1b8,0,.9,0),wood:mat(0x2a2119,0,.9,.1),steel:mat(0x5a5d60,0,.45,.8),
    nArmor:mat(0x17161c,0,.55,.6),nBone:mat(0xc9c3ad,0,.9,0),nCloth:mat(0x1b1522,0,1,0),nPurple:mat(0x35264f,0,1,0),nWood:mat(0x1c1612,0,.9,.1),nSteel:mat(0x555a5c,0,.5,.8)
  };
  for(const m of Object.values(M))m.userData.v104Shared=true;
  const mk=(geo,material,parent,x=0,y=0,z=0,a=1,b=1,c=1)=>{const o=new T.Mesh(geo,material);o.position.set(x,y,z);o.scale.set(a,b,c);o.castShadow=true;o.receiveShadow=true;o.frustumCulled=true;parent.add(o);return o};
  const bx=(p,m,w,h,d,x=0,y=0,z=0)=>mk(G.box,m,p,x,y,z,w,h,d);
  const sp=(p,m,a,b,c,x=0,y=0,z=0)=>mk(G.sphere,m,p,x,y,z,a,b,c);
  const cyl=(p,m,r,h,x=0,y=0,z=0)=>mk(G.cyl,m,p,x,y,z,r,h,r);
  const bn=(E,n,p,x=0,y=0,z=0)=>{const g=new T.Group();g.name=n;g.position.set(x,y,z);p.add(g);E.B[n]=g;return g};

  function playerPoint(out=tmpA,y=0){out.set(player.x,game.groundY(player.x,player.z)+y,player.z);return out}
  function distXZPos(a,b){return Math.hypot(a.x-b.x,a.z-b.z)}
  function faceRoot(root,p,dt,r){const t=Math.atan2(p.x-root.position.x,p.z-root.position.z);const d=Math.atan2(Math.sin(t-root.rotation.y),Math.cos(t-root.rotation.y));root.rotation.y+=d*(1-Math.exp(-r*dt))}
  function direction(from,to,out=tmpD){out.set(to.x-from.x,0,to.z-from.z);const l=out.length();if(l>.0001)out.multiplyScalar(1/l);return out}
  function moveRoot(root,dir,speed,dt){
    const dx=dir.x*speed*dt,dz=dir.z*speed*dt;
    const nx=root.position.x+dx,nz=root.position.z+dz;
    // V258: movimentação compartilhada evita ficar preso em paredes e troncos.
    if(!window.FlorestaAI?.walk(root,dir.x,dir.z,speed,dt)){
      if(!game.collides?.(nx,root.position.z))root.position.x=nx;
      if(!game.collides?.(root.position.x,nz))root.position.z=nz;
      root.position.y=game.groundY(root.position.x,root.position.z);
    }
  }
  // V106 — restaura exatamente o gatilho de locomocao do preview Undead Trio.
  // O visual de andar ja existia no rig, mas a integracao anterior nao alimentava
  // E.moving/E.back; por isso as pernas ficavam em pose parada enquanto o root andava.
  function moveTrio(E,dir,speed,dt){
    moveRoot(E.g,dir,speed,dt);
    E.moving=Math.max(E.moving,speed);
    const yaw=E.g.rotation.y;
    E.back=dir.x*Math.sin(yaw)+dir.z*Math.cos(yaw)<-.2;
  }
  function pushPlayer(dir,amount){
    const nx=player.x+dir.x*amount,nz=player.z+dir.z*amount;
    if(!game.collides?.(nx,player.z))player.x=nx;
    if(!game.collides?.(player.x,nz))player.z=nz;
  }
  function damagePlayer(amount,label,id){return window.gameZombie?.hurtPlayer?.(amount,label,id)??false}
  function announce(s){if(status)status.textContent=s}

  /* ===== VFX em pool: sem criar lixo por frame ===== */
  const NP=1400,pp=new Float32Array(NP*3).fill(-9999),pc=new Float32Array(NP*3),pv=new Float32Array(NP*3),pl=new Float32Array(NP);let pI=0,activeParticles=0;
  const pg=new T.BufferGeometry();pg.setAttribute('position',new T.BufferAttribute(pp,3).setUsage(T.DynamicDrawUsage));pg.setAttribute('color',new T.BufferAttribute(pc,3).setUsage(T.DynamicDrawUsage));
  const pts=new T.Points(pg,new T.PointsMaterial({size:.13,vertexColors:true,transparent:true,opacity:.9,blending:T.AdditiveBlending,depthWrite:false}));pts.frustumCulled=true;pts.name='V104_UndeadParticles';S.add(pts);
  const FIRE=[1,.5,.1],EMB=[1,.78,.3],SMK=[.22,.22,.24],SPK=[.9,.9,1],GRN=[.25,.8,.42],DRK=[.07,.2,.12];
  function emit(p,n,s,up,c,spr=0){for(let i=0;i<n;i++){const j=pI++%NP;if(pl[j]<=0)activeParticles++;pp[j*3]=p.x+(rnd()-.5)*spr;pp[j*3+1]=p.y+rnd(.25);pp[j*3+2]=p.z+(rnd()-.5)*spr;pv[j*3]=(rnd()-.5)*s;pv[j*3+1]=rnd()*up;pv[j*3+2]=(rnd()-.5)*s;pl[j]=.5+rnd(.8);pc.set(c,j*3)}}
  const ringPools=new Map(),rings=[];
  function ring(p,r,dur,col=0xff7a1a,w=.12){
    const key=Number(w).toFixed(3);let pool=ringPools.get(key);if(!pool){pool=[];ringPools.set(key,pool)}
    let o=pool.pop();
    if(!o){const mesh=new T.Mesh(new T.RingGeometry(1-w,1,36),new T.MeshBasicMaterial({transparent:true,opacity:.9,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false}));mesh.rotation.x=-PI/2;mesh.frustumCulled=true;S.add(mesh);o={mesh,t:0,dur:1,r:1,pool};}
    o.mesh.material.color.setHex(col);o.mesh.material.opacity=.9;o.mesh.position.set(p.x,game.groundY(p.x,p.z)+.06,p.z);o.mesh.scale.setScalar(.2);o.mesh.visible=true;o.t=0;o.dur=dur;o.r=r;rings.push(o);return o;
  }

  /* ===== visual do trio exatamente baseado no preview ===== */
  function human(E,att,o){const m=o.m,k=o.k||1,al=o.al||1,b=(n,p,x,y,z)=>bn(E,n,p,x,y,z),B=E.B;
    const pel=b('Pelvis',att,...o.pp),spn=b('Spine',pel,0,.1,0),chs=b('Chest',spn,0,.26,0),nek=b('Neck',chs,0,.36,0),hed=b('Head',nek,0,.06,0);
    bx(pel,m,.3*k,.1,.15);for(const s of[-1,1])sp(pel,m,.09*k,.07,.05,s*.12,-.02,0);
    for(let i=0;i<8;i++)sp(i<3?spn:chs,m,.025*k,.022,.025*k,0,i<3?.015+i*.03:-.02+(i-3)*.075,-.04);
    for(let i=0;i<5;i++){const w=(.12+(i==2?.03:i==1||i==3?.02:0)-(i>3?.02:0))*k;mk(G.rib,m,chs,0,.04+i*.07,0,w,.11*k,.3).rotation.x=PI/2}
    bx(chs,m,.035,.3,.02,0,.17,.12*k);sp(hed,m,.12*k,.145*k,.135*k,0,.13,0);
    const jw=b('Jaw',hed,0,.04,.05);bx(jw,m,.09*k,.035,.09,0,-.015,.02);bx(jw,M.teeth,.075,.012,.02,0,.012,.06);bx(hed,M.teeth,.08,.014,.02,0,.045,.1);
    E.eyeM=new T.MeshStandardMaterial({color:0,emissive:o.eye,emissiveIntensity:1});
    for(const s of[-1,1]){sp(hed,M.black,.034,.04,.03,s*.045,.14,.1);mk(G.sphere,E.eyeM,hed,s*.045,.14,.115,.016,.016,.01)}bx(hed,M.black,.02,.035,.02,0,.095,.125);
    const A=o.armor;
    for(const[s,L]of[[1,'L'],[-1,'R']]){
      const c=b('Clavicle_'+L,chs,s*.17,.33,0),ua=b('UpperArm_'+L,c,s*.12,0,0),fa=b('Forearm_'+L,ua,0,-.3*al,0),ha=b('Hand_'+L,fa,0,-.28*al,0);
      bx(c,m,.2,.02,.03,s*.06,0,.03);cyl(ua,m,.022*k,.3*al,0,-.15*al,0);sp(ua,m,.03*k,.03*k,.03*k);cyl(fa,m,.018*k,.28*al,0,-.14*al,0);cyl(fa,m,.012*k,.26*al,.025,-.14*al,0);sp(fa,m,.026*k,.026*k,.026*k);bx(ha,m,.06*k,.08*k,.025*k,0,-.05,0);
      for(let j=0;j<3;j++){const f=b(`Finger_${L}_${j}`,ha,(j-1)*.022*k,-.09*k,0);f.rotation.x=.3;mk(G.cone,m,f,0,-.04*k,0,.01*k,.09*k,.01*k).rotation.x=PI}
      if(A){sp(c,M.iron,.13,.07,.12,s*.1,.03,0);mk(G.cone,M.iron,c,s*.15,.1,0,.03,.14,.03).rotation.z=-s*.6;bx(fa,M.iron,.07,.14,.07,0,-.17,0);bx(ha,M.iron,.065,.07,.04,0,-.03,0);bx(ua,M.rust,.06,.05,.06,0,-.2,0)}
      if(o.legs){const th=b('Thigh_'+L,pel,s*.1,-.05,0),ca=b('Calf_'+L,th,0,-.45,0),ft=b('Foot_'+L,ca,0,-.44,0),to=b('Toe_'+L,ft,0,-.03,.1);cyl(th,m,.03,.45,0,-.225,0);sp(th,m,.04,.04,.04,0,-.45,.01);cyl(ca,m,.025,.44,0,-.22,0);bx(ft,m,.07,.04,.16,0,-.03,.04);bx(to,m,.06,.03,.07,0,0,.03);if(A){bx(ca,M.iron,.1,.36,.1,0,-.22,-.005);sp(th,M.iron,.075,.07,.07,0,-.45,.04);mk(G.cone,M.iron,th,0,-.45,.1,.02,.08,.02).rotation.x=PI/2;bx(ft,M.iron,.1,.05,.2,0,-.03,.05);bx(th,M.rust,.09,.2,.09,0,-.2,0)}}
    }
    if(A){bx(chs,M.iron,.36,.15,.22,0,.27,0);for(const s of[-1,1]){sp(chs,M.iron,.045,.045,.02,s*.09,.2,.12);sp(chs,M.steel,.02,.02,.012,s*.09,.2,.14)}bx(chs,M.iron,.34,.2,.06,0,.2,-.14);bx(pel,M.iron,.36,.07,.2,0,.07,0);sp(pel,M.bone,.04,.045,.03,0,.07,.11);for(const s of[-1,1])bx(pel,M.iron,.1,.24,.03,s*.15,-.16,.05)}
    if(o.rags){for(let i=0;i<7;i++){const a=i/7*PI*2,L=.35+rnd(.5),c=b('Cloth_'+i,pel,Math.sin(a)*.17,-.04,Math.cos(a)*.12);c.rotation.y=a;bx(c,i%2?M.cloth:M.rust,.14,L,.02,0,-L/2,0)}}
    return{pel,chs,hed};
  }
  const fireSkullMats=[0xff6a14,0xff6a14,0xffc050,0xffc050].map(c=>new T.MeshBasicMaterial({color:c,transparent:true,opacity:.7,blending:T.AdditiveBlending,depthWrite:false}));
  function mkFireSkull(s,up){const g=new T.Group(),sk=new T.Group();g.add(sk);const eye=new T.MeshStandardMaterial({color:0,emissive:0xff8a2a,emissiveIntensity:2});sp(sk,M.bone,.12*s,.14*s,.13*s,0,0,0);const jaw=new T.Group();jaw.position.set(0,-.07*s,.04*s);sk.add(jaw);bx(jaw,M.bone,.09*s,.035*s,.09*s,0,-.015*s,.02*s);bx(jaw,M.teeth,.07*s,.015*s,.02*s,0,.01*s,.05*s);bx(sk,M.teeth,.07*s,.014*s,.02*s,0,-.05*s,.12*s);for(const x of[-1,1]){sp(sk,M.black,.034*s,.04*s,.03*s,x*.045*s,.02*s,.1*s);mk(G.sphere,eye,sk,x*.045*s,.02*s,.115*s,.02*s,.02*s,.012*s)}const fl=[];for(let i=0;i<4;i++){const c=mk(G.cone,fireSkullMats[i],g,0,0,0,.11*s*(1-i*.2),.5*s*(1-i*.15),.11*s*(1-i*.2));if(up)c.position.set((i-1.5)*.03*s,.2*s+.12*s*(1-i*.15),0);else{c.rotation.x=-PI/2;c.position.set((i-1.5)*.02*s,0,-.22*s-.1*s*(1-i*.15))}fl.push(c)}return{g,jaw,fl,s}}
  function updateFireSkullVisual(o,boost=0){for(let i=0;i<o.fl.length;i++)o.fl[i].scale.y=o.s*(.45+rnd(.25)+boost*.5)*(1-i*.15)}
  function buildWar(E){const rt=bn(E,'Root',E.g);human(E,rt,{m:M.bone,pp:[0,1,0],legs:1,armor:1,eye:0x8fc4aa,rags:1});const sw=bn(E,'Socket_Sword',E.B.Hand_R,0,-.06,.02);bx(sw,M.steel,.065,.9,.014,0,.58,0);mk(G.cone,M.steel,sw,0,1.07,0,.035,.12,.01);bx(sw,M.rust,.3,.035,.045,0,.1,0);cyl(sw,M.wood,.018,.16,0,0,0);sp(sw,M.steel,.03,.03,.03,0,-.09,0);mk(G.tor,M.steel,sw,0,-.14,0,.035,.035,.035);const sh=bn(E,'Socket_Shield',E.B.Hand_L,0,.08,.1);const d=mk(G.cyl,M.wood,sh,0,0,0,.44,.04,.44);d.rotation.x=PI/2;mk(G.tor,M.iron,sh,0,0,0,.44,.44,.5);for(let i=0;i<8;i++){const g=new T.Group();g.rotation.z=i*PI/4;sh.add(g);bx(g,M.bone,.02,.28,.012,0,.26,.03)}sp(sh,M.bone,.1,.11,.06,0,0,.05);for(const s of[-1,1])sp(sh,M.black,.025,.03,.02,s*.03,.01,.1)}
  function buildCent(E,fire){const m=fire?M.bone:M.boneD,k=fire?1:1.35,rt=bn(E,'Root',E.g),br=bn(E,'Body_Rear',rt,0,1.45,-.55),bf=bn(E,'Body_Front',br,0,0,1.1);E.legs=[];cyl(br,m,.04*k,1.3,0,0,.55).rotation.x=PI/2;for(let i=0;i<8;i++){const f=i/7,w=(.2+.13*Math.sin(f*PI*.9+.2))*k;mk(G.rib,m,br,0,-.03,-.05+i*.17,w,.3*k,.3).rotation.z=PI}bx(br,m,.3*k,.16,.3,0,-.02,-.28);for(const s of[-1,1])sp(br,m,.09*k,.1,.1,s*.15,-.08,-.3);bx(bf,m,.07*k,.32,.2,.15,-.08,0);bx(bf,m,.07*k,.32,.2,-.15,-.08,0);if(!fire)for(let i=0;i<7;i++)mk(G.cone,M.boneC,br,0,.07,-.1+i*.18,.025,.12,.025);else for(let i=0;i<5;i++)mk(G.cone,M.boneC,br,0,.04,.05+i*.2,.015,.07,.015);let tp=br;for(let i=0;i<4;i++){tp=bn(E,'Tail_'+i,tp,0,i?0:.05,i?-.14:-.45);cyl(tp,m,.015,.15,0,0,-.07).rotation.x=PI/2}for(const[s,L]of[[1,'L'],[-1,'R']]){const fu=bn(E,`Leg_F${L}_Upper`,bf,s*.17,-.12,.05),fl=bn(E,`Leg_F${L}_Lower`,fu,0,-.6,0),ff=bn(E,`Leg_F${L}_Hoof`,fl,0,-.58,0);cyl(fu,m,.034*k,.6,0,-.3,0);sp(fu,m,.045*k,.045*k,.045*k,0,-.6,0);cyl(fl,m,.027*k,.58,0,-.29,0);bx(ff,M.boneC,.07*k,.09,.12,0,-.04,.02);E.legs.push({u:fu,l:fl,f:ff,po:L==='L'?0:PI,fr:1});const hu=bn(E,`Leg_H${L}_Thigh`,br,s*.17,-.1,-.4),hl=bn(E,`Leg_H${L}_Shank`,hu,0,-.5,0),hf=bn(E,`Leg_H${L}_Foot`,hl,0,-.52,0);cyl(hu,m,.04*k,.5,0,-.25,0);sp(hu,m,.05*k,.05*k,.05*k,0,-.5,0);cyl(hl,m,.03*k,.52,0,-.26,0);cyl(hf,m,.024*k,.4,0,-.2,0);bx(hf,M.boneC,.07*k,.09,.12,0,-.42,.02);E.legs.push({u:hu,l:hl,f:hf,po:L==='L'?PI:0,fr:0})}human(E,bf,{m,k:fire?1:1.25,al:fire?1.18:1.05,pp:[0,.16,.12],eye:fire?0xff7a1a:0xd23c24,rags:1});if(fire){const fs=bn(E,'Socket_FireSkull',E.B.Hand_L,0,-.12,0),h=mkFireSkull(1.3,true);fs.add(h.g);h.g.position.y=.15;E.held=h;E.light=new T.PointLight(0xff7a2a,1.6,9);E.light.position.y=.45;fs.add(E.light);bn(E,'Socket_Cast',fs,0,.5,0)}else{for(const L of['L','R'])E.B['Hand_'+L].scale.setScalar(1.7);for(const s of[-1,1])mk(G.cone,M.boneC,E.B.Clavicle_L.parent,s*.25,.4,0,.03,.14,.03)}}

  const ar=(s,u,f,z=0,t)=>({['UpperArm_'+s]:[u,0,z],['Forearm_'+s]:[f,0,0],['Hand_'+s]:[t===undefined?0:t-u-f,0,0]});
  const IDLEW={...ar('R',.2,-.5,-.15,.9),...ar('L',.1,-.6,.2,0)};
  const POSES={
    war:{idle:IDLEW,walk:{...IDLEW,Spine:[.05,0,0]},walkS:{...ar('R',.2,-.5,-.15,.9),...ar('L',-.7,-1.2,.25,0),Spine:[.08,0,0]},block:{...ar('R',.1,-1,-.2,1.3),...ar('L',-.8,-1.2,.3,0),Spine:[.08,0,0],Chest:[0,.15,0]},blockHit:{...ar('R',.1,-1,-.2,1.3),...ar('L',-.65,-1.3,.3,0),Spine:[-.12,0,0]},sl1w:{...ar('R',-2.3,-.7,-.3,-.5),...ar('L',-.7,-1.2,.3,0),Chest:[0,-.45,0]},sl1s:{...ar('R',-1,-.2,.25,2.1),...ar('L',-.7,-1.2,.3,0),Chest:[.1,.55,0],Spine:[.15,0,0]},sl1r:{...ar('R',-.5,-.5,0,1.5),...ar('L',-.7,-1.2,.3,0),Chest:[.05,.3,0]},sl2w:{...ar('R',-2.9,-.4,-.1,-.2),...ar('L',-.6,-1.2,.3,0),Spine:[-.2,0,0],Chest:[-.15,0,0]},sl2s:{...ar('R',-.9,-.1,0,2.4),...ar('L',-.6,-1.2,.3,0),Spine:[.35,0,0],Chest:[.25,0,0]},sl2r:{...ar('R',-.3,-.4,-.1,1.8),...ar('L',-.6,-1.2,.3,0),Spine:[.25,0,0]},bashw:{...ar('R',.2,-.5,-.15,.9),...ar('L',-.3,-1.6,.2,0),Chest:[0,-.3,0]},bashs:{...ar('R',.2,-.5,-.15,.9),...ar('L',-1.45,-.3,.1,0),Chest:[.1,.25,0],Spine:[.2,0,0]},bashr:{...ar('R',.2,-.5,-.15,.9),...ar('L',-.8,-1.1,.2,0)},hit:{...IDLEW,Spine:[-.2,0,0],Head:[-.3,0,0]},stagger:{...ar('R',-.4,-.3,-.6,.2),...ar('L',-.5,-.8,.7,0),Spine:[-.4,0,0],Chest:[-.2,0,0],Head:[-.45,0,0]},dead:{...ar('R',0,-.2,-.7,.5),...ar('L',0,-.2,.7,0),Head:[.2,.3,0]}},
    fire:{idle:{...ar('L',.1,-.5,.3),...ar('R',.1,-.4,-.3)},idleM:{...ar('L',-.6,-1.3,.5),...ar('R',.05,-.5,-.35),Head:[.1,0,0]},summon:{...ar('L',-2.7,-.2,.4),...ar('R',-2.7,-.2,-.4),Chest:[-.2,0,0],Head:[-.35,0,0]},castLoop:{...ar('L',-2.4,-.3,.3),...ar('R',-1.2,-.5,-.7),Spine:[-.15,0,0],Head:[-.25,0,0]},release:{...ar('L',-1.3,-.05,.1),...ar('R',.2,-.4,-.4),Spine:[.25,0,0],Chest:[.2,0,0],Head:[.1,0,0]},hit:{...ar('L',-.4,-1,.5),Spine:[-.25,0,0],Head:[-.3,0,0]},stagger:{...ar('L',-.3,-.6,.9),...ar('R',-.4,-.3,-.9),Spine:[-.4,0,0],Chest:[-.2,0,0],Head:[-.45,0,0],Body_Rear:[-.25,0,0]},dead:{...ar('L',0,-.3,.8),...ar('R',0,-.3,-.8),Head:[.3,.3,0]}},
    cent:{idle:{...ar('L',-.2,-.6,.4),...ar('R',-.2,-.6,-.4)},idleA:{...ar('L',-.6,-1.1,.5),...ar('R',-.6,-1.1,-.5),Spine:[.2,0,0],Head:[.1,0,0]},atkRw:{...ar('R',.7,-.4,-1),...ar('L',-.5,-1.1,.5),Chest:[0,-.5,0],Spine:[-.1,0,0]},atkRs:{...ar('R',-1.35,-.2,.1),...ar('L',-.5,-1.1,.5),Chest:[.2,.55,0],Spine:[.2,0,0]},atkLw:{...ar('L',.7,-.4,1),...ar('R',-.5,-1.1,-.5),Chest:[0,.5,0],Spine:[-.1,0,0]},atkLs:{...ar('L',-1.35,-.2,-.1),...ar('R',-.5,-1.1,-.5),Chest:[.2,-.55,0],Spine:[.2,0,0]},lungeW:{...ar('L',.4,-.4,.9),...ar('R',.4,-.4,-.9),Spine:[-.2,0,0],Body_Rear:[-.4,0,0]},lungeS:{...ar('L',-1.6,-.1,.2),...ar('R',-1.6,-.1,-.2),Spine:[.3,0,0],Body_Rear:[.12,0,0]},lungeR:{...ar('L',-.6,-.8,.4),...ar('R',-.6,-.8,-.4),Spine:[.15,0,0]},hit:{...ar('L',-.4,-1,.5),...ar('R',-.4,-1,-.5),Spine:[-.25,0,0],Head:[-.3,0,0]},stagger:{...ar('L',-.3,-.6,.9),...ar('R',-.3,-.6,-.9),Spine:[-.4,0,0],Chest:[-.2,0,0],Head:[-.45,0,0],Body_Rear:[-.3,0,0]},dead:{...ar('L',0,-.3,.8),...ar('R',0,-.3,-.8),Head:[.3,.3,0]}}
  };
  const TRH=['Spine','Chest','Neck','Head','Clavicle_L','UpperArm_L','Forearm_L','Hand_L','Clavicle_R','UpperArm_R','Forearm_R','Hand_R'],ZERO=[0,0,0];

  const trio=[],skulls=[];
  function randomSpawn(radius=16){
    const yaw=player.bodyYaw??player.yaw??0;
    for(let i=0;i<18;i++){const a=yaw+PI+((rnd()-.5)*2.4),r=radius+rnd(7),x=player.x+Math.sin(a)*r,z=player.z+Math.cos(a)*r;if(!game.collides?.(x,z))return{x,z,y:game.groundY(x,z)}}
    return{x:player.x+radius,z:player.z+radius,y:game.groundY(player.x+radius,player.z+radius)};
  }
  function registerHud(E,name,height){window.gameEnemyOverheadUI?.registerExternal?.(`v104:${E.id}`,{root:E.g,type:'zombie',name,fallbackHeight:height,headGap:.3,getHp:()=>E.hp,getMaxHp:()=>E.maxHp,isAlive:()=>E.alive});}
  function makeTrio(type){
    const p=randomSpawn(type==='fire'?18:15),E={id:`${type}-${++serial}`,type,g:new T.Group(),root:null,B:{},hp:0,maxHp:0,state:'IDLE',t:0,dead:false,td:0,cd:{blk:0,cast:0,lunge:0},pose:'idle',moving:0,back:false,amp:0,gp:0,sg:1,bhit:0,strike:0,si:0,ap:0,pt:0,hd:0,fired:0,did:0,blk:false,last:'',lastHit:-9,isUndead:true,isSkeleton:true,legs:[],charge:0,nc:7,manual:true,corpse:{canBeResurrected:type!=='fire',enemyType:type,resurrectionCount:0,maxResurrections:1,t:0}};
    E.root=E.g;E.g.name=`V104_${type}_${serial}`;E.g.position.set(p.x,p.y,p.z);E.g.rotation.y=Math.atan2(player.x-p.x,player.z-p.z);S.add(E.g);if(type==='war')buildWar(E);else buildCent(E,type==='fire');E.maxHp=E.hp=CFG[type].hp;E.g.traverse(o=>{if(o.isMesh)o.frustumCulled=true});trio.push(E);registerHud(E,type==='war'?'Esqueleto Guerreiro':type==='fire'?'Centauro de Fogo':'Centauro Esqueleto',type==='war'?2.35:3.0);announce(`${type==='war'?'Esqueleto Guerreiro':type==='fire'?'Centauro de Fogo':'Centauro Esqueleto'} entrou no mapa`);return E;
  }
  function setState(E,s){E.state=s;E.t=0;E.si=0;E.ap=0;E.pt=0;E.hd=0;E.fired=0;E.did=0}
  function go(E,s,l){if(l)E.last=l;setState(E,s)}
  function toward(E,out=tmpD){return direction(E.g.position,playerPoint(tmpA,0),out)}
  function away(E,out=tmpD){toward(E,out);return out.multiplyScalar(-1)}
  function perpendicular(E,out=tmpD){toward(E,out);const s=rnd()<.5?1:-1;const x=out.x;out.x=-out.z*s;out.z=x*s;return out}
  function hitTrio(E,amount,impact=8,fromPoint=null){if(!E?.alive)return false;amount*=window.gameParry?.damageMultiplierFor?.(E.id)??1;const pp=fromPoint||playerPoint(tmpA,1);if(E.type==='war'&&E.blk){const dx=pp.x-E.g.position.x,dz=pp.z-E.g.position.z,l=Math.hypot(dx,dz)||1;if((dx*Math.sin(E.g.rotation.y)+dz*Math.cos(E.g.rotation.y))/l>CFG.war.frontCos){E.bhit=.3;E.hp-=amount*CFG.war.blockReduce;emit(tmpB.set(E.g.position.x+dx/l*.7,E.g.position.y+1.3,E.g.position.z+dz/l*.7),22,3,2,SPK);if(E.hp<=0)killTrio(E);return true}}
    E.hp-=amount;E.lastHit=time;if(E.hp<=0){killTrio(E);return true}if(impact>=CFG.threshold)setState(E,'STAGGER');else if(!E.strike)setState(E,'HIT_REACTION');return true;
  }
  function killTrio(E){if(E.dead)return;E.dead=true;E.alive=false;E.state='DEATH';E.td=0;E.hp=0;E.blk=false;E.corpse.t=0;E.corpse.canBeResurrected=E.type!=='fire'&&E.corpse.resurrectionCount<E.corpse.maxResurrections;emit(tmpA.set(E.g.position.x,E.g.position.y+1,E.g.position.z),30,3,2,E.type==='fire'?FIRE:SMK,.6);window.gameProgression?.dropXP?.(E.type==='war'?40:E.type==='fire'?55:50,E.g.position,E.type==='war'?'Esqueleto Guerreiro':E.type==='fire'?'Centauro de Fogo':'Centauro Esqueleto');announce(`${E.type==='war'?'Esqueleto Guerreiro':E.type==='fire'?'Centauro de Fogo':'Centauro Esqueleto'} derrotado`)}
  function reviveTrio(E){if(!E?.dead||!E.corpse.canBeResurrected)return false;E.dead=false;E.alive=true;E.hp=E.maxHp*CFG.nec.reviveHealthPercent;E.state='IDLE';E.t=E.td=0;E.B.Root.rotation.set(0,0,0);E.B.Root.position.set(0,0,0);E.corpse.resurrectionCount++;E.corpse.canBeResurrected=E.corpse.resurrectionCount<E.corpse.maxResurrections;E.eyeM.emissiveIntensity=2;emit(tmpA.copy(E.g.position).add(new T.Vector3(0,.5,0)),40,3,4,GRN,.6);ring(E.g.position,2,.7,0x4fd67a);return true}
  function common(E,dt){if(E.__parryBrokenUntil>performance.now()&&E.alive){E.moving=0;E.back=false;E.blk=false;E.pose='stagger';return true}E.t+=dt;E.bhit=Math.max(0,E.bhit-dt);E.strike=Math.max(0,E.strike-dt);for(const k in E.cd)E.cd[k]=Math.max(0,E.cd[k]-dt);E.moving=0;E.back=false;E.blk=false;E.pose=E.type==='fire'?'idleM':E.type==='cent'?'idleA':'idle';if(E.dead){E.td+=dt;E.corpse.t+=dt;if(E.corpse.t>CFG.nec.corpseLife)E.corpse.canBeResurrected=false;return true}if(E.state==='HIT_REACTION'){E.pose='hit';if(E.t>.45)setState(E,'IDLE');return true}if(E.state==='STAGGER'){E.pose='stagger';if(E.t>1.1)setState(E,'IDLE');return true}return false}
  const ST={war1:[{w:.45,s:.2,r:.5,p:['sl1w','sl1s','sl1r'],reach:2.7,d:12}],war2:[{w:.75,s:.2,r:.75,p:['sl2w','sl2s','sl2r'],reach:2.9,d:22}],bash:[{w:.3,s:.2,r:.45,p:['bashw','bashs','bashr'],reach:2.1,d:6,push:1,mv:2.5}],cR:[{w:.3,s:.15,r:.35,p:['atkRw','atkRs','atkRs'],reach:2.9,d:12}],cL:[{w:.3,s:.15,r:.35,p:['atkLw','atkLs','atkLs'],reach:2.9,d:12}],cC:[{w:.3,s:.15,r:.12,p:['atkRw','atkRs','atkRs'],reach:2.9,d:10},{w:.16,s:.15,r:.5,p:['atkLw','atkLs','atkLs'],reach:2.9,d:14}],lunge:[{w:.45,s:.5,r:.55,p:['lungeW','lungeS','lungeR'],reach:2.7,d:20,mv:9}]};
  function attackStep(E,dt,steps){const s=steps[E.si];E.pt+=dt;const target=playerPoint(tmpA,0),d=distXZPos(E.g.position,target);if(E.ap===0){E.pose=s.p[0];faceRoot(E.g,target,dt,6);if(E.pt>=s.w){E.ap=1;E.pt=0;E.hd=0}}else if(E.ap===1){E.pose=s.p[1];E.strike=.1;if(s.mv)moveTrio(E,tmpB.set(Math.sin(E.g.rotation.y),0,Math.cos(E.g.rotation.y)),s.mv===9?CFG.cent.lungeSpeed:s.mv,dt);if(!E.hd&&d<s.reach){const dx=target.x-E.g.position.x,dz=target.z-E.g.position.z;if(dx*Math.sin(E.g.rotation.y)+dz*Math.cos(E.g.rotation.y)>0&&(!window.FlorestaAI||window.FlorestaAI.clear(E.g.position,target,.48))){E.hd=1;damagePlayer(s.d,E.type==='war'?'Esqueleto Guerreiro':'Centauro Esqueleto',E.id);if(s.push)pushPlayer(direction(E.g.position,target,tmpC),CFG.war.bashPush);emit(target,14,3,2,SPK)}}if(E.pt>=s.s){E.ap=2;E.pt=0}}else{E.pose=s.p[2];if(E.pt>=s.r){if(E.si<steps.length-1){E.si++;E.ap=0;E.pt=0}else return true}}return false}
  function decWar(E,d){const C=CFG.war,rc=time-E.lastHit<1.2;
    // O guerreiro protege um necromante próximo; não abandona o mago para perseguir longe.
    const nearbyNec=necros.find(n=>n.alive&&distXZPos(n.g.position,E.g.position)<13);
    if(nearbyNec&&d>5.8&&distXZPos(E.g.position,nearbyNec.g.position)>5){
      E.guardNec=nearbyNec;return go(E,'GUARD_MAGE');
    }
    // Quando dois esqueletos lutam juntos, um tenta entrar pelo flanco.
    if(d>2.7&&d<6&&trio.some(u=>u!==E&&u.type==='war'&&u.alive&&distXZPos(u.g.position,E.g.position)<7)&&rnd()<.48){
      perpendicular(E,E.dirv||(E.dirv=V()));return go(E,'MOVE');
    }
if(d>5){E.wblk=rnd()<.35;return go(E,'APPROACH')}if(d>2.7){if(rnd()<.3){perpendicular(E,E.dirv||(E.dirv=V()));return go(E,'MOVE')}E.wblk=0;return go(E,'APPROACH')}if(E.cd.blk<=0&&rnd()<(rc?C.blockChanceHit:C.blockChance)){E.blkDur=1+rnd(C.blockMax-1);return go(E,'BLOCK')}const o=['ATTACK_1','ATTACK_1','ATTACK_1','ATTACK_2','ATTACK_2'];if(d<2.1)o.push('SHIELD_BASH');const f=o.filter(x=>x!==E.last),c=f[Math.floor(rnd(f.length||o.length))]||o[0];go(E,c,c)}
  function aiWar(E,dt){const C=CFG.war,target=playerPoint(tmpA,0),d=distXZPos(E.g.position,target);if(E.bhit>0)E.pose='blockHit';switch(E.state){case'IDLE':faceRoot(E.g,target,dt,3);if(E.t>.3)decWar(E,d);break;case'GUARD_MAGE':{const n=E.guardNec;if(!n?.alive){setState(E,'IDLE');break}const pos=n.g.position;faceRoot(E.g,target,dt,4);const dd=distXZPos(E.g.position,pos);if(dd>3.3){moveTrio(E,direction(E.g.position,pos,tmpB),C.speed,dt);E.pose='walkS';}else{E.blk=true;E.pose='block';}if(d<3.1||E.t>3.4)setState(E,'IDLE');break}case'MOVE':faceRoot(E.g,target,dt,4);moveTrio(E,E.dirv,C.speed*.8,dt);E.blk=true;E.pose='walkS';if(E.t>1.2)setState(E,'IDLE');break;case'APPROACH':faceRoot(E.g,target,dt,5);moveTrio(E,toward(E,tmpB),C.speed,dt);if(E.wblk){E.blk=true;E.pose='walkS'}else E.pose='walk';if(d<=2.4||E.t>4)setState(E,'IDLE');break;case'BLOCK':faceRoot(E.g,target,dt,4);E.blk=true;E.pose=E.bhit>0?'blockHit':'block';if(d>2.3)moveTrio(E,toward(E,tmpB),.9,dt);if(E.t>E.blkDur){E.cd.blk=C.blockCd;setState(E,d<3?'ATTACK_1':'IDLE')}break;case'ATTACK_1':if(attackStep(E,dt,ST.war1))setState(E,'IDLE');break;case'ATTACK_2':if(attackStep(E,dt,ST.war2))setState(E,'IDLE');break;case'SHIELD_BASH':if(attackStep(E,dt,ST.bash))setState(E,'IDLE');break}}
  function lineBlocked(a,b){const steps=7;for(let i=1;i<steps;i++){const f=i/steps,px=a.x+(b.x-a.x)*f,pz=a.z+(b.z-a.z)*f;if(game.collides?.(px,pz))return true}return false}
  function spawnSkull(E){const h=mkFireSkull(.9,false),g=h.g;E.B.Socket_Cast.getWorldPosition(tmpA);g.position.copy(tmpA);g.scale.setScalar(.3);S.add(g);const v=tmpB.set(Math.sin(E.g.rotation.y),.8,Math.cos(E.g.rotation.y)).normalize().clone();skulls.push({g,jaw:h.jaw,fl:h.fl,s:.9,v,age:0,lock:true,lt:0,bt:0,seed:rnd(6),owner:E});emit(tmpA,16,2,2,FIRE,.3)}
  function destroySkull(i,p,hit){emit(p,50,6,4,FIRE,.4);emit(p,25,4,3,EMB,.4);emit(p,15,2,2,SMK,.5);ring(p,1.6,.45);if(hit)damagePlayer(18,'Caveira de Fogo','fire-skull');S.remove(skulls[i].g);skulls.splice(i,1)}
  function updateSkulls(dt){const C=CFG.fire,target=playerPoint(tmpA,1.1);for(let i=skulls.length-1;i>=0;i--){const s=skulls[i],p=s.g.position;s.age+=dt;s.g.scale.setScalar(Math.min(1,.3+s.age*2));if(s.lock&&s.age>.35){tmpB.subVectors(target,p).normalize();const dot=cl(s.v.dot(tmpB),-1,1),ang=Math.acos(dot),ma=C.skullTurn*dt;if(ang>ma)s.v.lerp(tmpB,ma/Math.max(.0001,ang)).normalize();else s.v.copy(tmpB);if(lineBlocked(p,target))s.lt+=dt;else s.lt=Math.max(0,s.lt-dt*.5);if(s.lt>C.loseTime)s.lock=false;if(ang>1.75)s.bt+=dt;else s.bt=0;if(s.bt>.9)s.lock=false}if(game.collides?.(p.x+s.v.x*C.skullSpeed*dt,p.z+s.v.z*C.skullSpeed*dt)){destroySkull(i,p,false);continue}p.addScaledVector(s.v,C.skullSpeed*dt);s.g.lookAt(p.x+s.v.x,p.y+s.v.y,p.z+s.v.z);s.jaw.rotation.x=.35+Math.sin(time*26+s.seed)*.35;updateFireSkullVisual(s,0);emit(p,1,.5,.6,rnd()<.5?FIRE:EMB,.1);const d=distXZPos(p,target);if(d<.68&&Math.abs(p.y-target.y)<1){if(window.gameShield?.blocking){const yaw=player.bodyYaw??player.yaw??0,fx=Math.sin(yaw),fz=Math.cos(yaw),toSkullX=p.x-player.x,toSkullZ=p.z-player.z,l=Math.hypot(toSkullX,toSkullZ)||1;if((toSkullX/l)*fx+(toSkullZ/l)*fz>C.blockCos){emit(p,30,5,3,SPK);S.remove(s.g);skulls.splice(i,1);continue}}destroySkull(i,p,true);continue}if(p.y<game.groundY(p.x,p.z)+.1||s.age>C.skullLife){destroySkull(i,p,false)}}}
  function decFire(E,d){const C=CFG.fire,target=playerPoint(tmpA,0),los=!lineBlocked(E.g.position,target);if(d<C.minR)return go(E,'RETREAT');if(d>C.maxR)return go(E,'MOVE');if(E.cd.cast<=0&&los){E.nextCast=rnd()<.55?'CAST_SINGLE':'CAST_BURST';return go(E,'CAST_START')}if(rnd()<.6){perpendicular(E,E.dirv||(E.dirv=V()));E.sdur=1.2+rnd(1.2);return go(E,'STRAFE')}if(d<C.prefR-1)return go(E,'KEEP_DISTANCE');if(d>C.prefR+2)return go(E,'MOVE');perpendicular(E,E.dirv||(E.dirv=V()));E.sdur=1;go(E,'STRAFE')}
  function aiFire(E,dt){const C=CFG.fire,target=playerPoint(tmpA,0),d=distXZPos(E.g.position,target);E.boost=0;E.charge=Math.max(0,E.charge-dt*1.5);switch(E.state){case'IDLE':faceRoot(E.g,target,dt,3);if(E.t>.35)decFire(E,d);break;case'MOVE':faceRoot(E.g,target,dt,4);moveTrio(E,toward(E,tmpB),C.trot,dt);if(d<=C.prefR+1||E.t>3)setState(E,'IDLE');break;case'KEEP_DISTANCE':faceRoot(E.g,target,dt,5);moveTrio(E,away(E,tmpB),C.speed,dt);if(d>=C.prefR||E.t>2.5)setState(E,'IDLE');break;case'RETREAT':faceRoot(E.g,target,dt,6);moveTrio(E,away(E,tmpB),C.trot,dt);if(d>=C.prefR*.9||E.t>2.5)setState(E,'IDLE');break;case'STRAFE':faceRoot(E.g,target,dt,5);moveTrio(E,E.dirv,C.speed*1.1,dt);if(E.t>E.sdur)setState(E,'IDLE');break;case'CAST_START':faceRoot(E.g,target,dt,6);E.pose=E.t<.4?'summon':'castLoop';E.charge=Math.min(1,E.t/.9);if(E.t>.9)setState(E,E.nextCast||'CAST_SINGLE');break;case'CAST_SINGLE':faceRoot(E.g,target,dt,8);E.pose=E.t<.35?'castLoop':'release';E.charge=E.t<.35?1:.4;if(!E.did&&E.t>=.35){E.did=1;spawnSkull(E)}if(E.t>.9){E.cd.cast=C.castCd;setState(E,'IDLE')}break;case'CAST_BURST':E.charge=.8;faceRoot(E.g,target,dt,8);E.pose=(E.t-.3)%C.burstGap<.14&&E.t>.3?'release':'castLoop';if(E.fired<C.burst&&E.t>=.3+E.fired*C.burstGap){E.fired++;spawnSkull(E)}if(E.t>.3+C.burst*C.burstGap+.5){E.cd.cast=C.castCd+1.5;setState(E,'IDLE')}break}E.boost=E.charge*1.4}
  function decCent(E,d){if(d>CFG.cent.reach){if(d>4&&d<9&&E.cd.lunge<=0&&rnd()<.5)return go(E,'LUNGE');return go(E,'CHASE')}const o=['ATTACK_RIGHT','ATTACK_LEFT','ATTACK_COMBO','ATTACK_COMBO'].filter(x=>x!==E.last),c=o[Math.floor(rnd(o.length))];go(E,c,c)}
  function aiCent(E,dt){const C=CFG.cent,target=playerPoint(tmpA,0),d=distXZPos(E.g.position,target);switch(E.state){case'IDLE':faceRoot(E.g,target,dt,4);if(E.t>.25)decCent(E,d);break;case'CHASE':faceRoot(E.g,target,dt,8);moveTrio(E,toward(E,tmpB),C.chase,dt);if(d<=C.reach*.9)decCent(E,d);else if(E.t>5)setState(E,'IDLE');break;case'ATTACK_RIGHT':if(attackStep(E,dt,ST.cR))setState(E,'IDLE');break;case'ATTACK_LEFT':if(attackStep(E,dt,ST.cL))setState(E,'IDLE');break;case'ATTACK_COMBO':if(attackStep(E,dt,ST.cC))setState(E,'IDLE');break;case'LUNGE':if(attackStep(E,dt,ST.lunge)){E.cd.lunge=C.lungeCd;setState(E,'IDLE')}break}}
  function animTrio(E,dt){const k=1-Math.exp(-10*dt),P2=POSES[E.type],p=P2[E.dead?'dead':E.pose]||P2.idle,B=E.B,tr=E.type==='war'?TRH:[...TRH,'Body_Rear'];for(const nm of tr){if(!B[nm])continue;const t=p[nm]||ZERO,r=B[nm].rotation,br=nm==='Chest'?Math.sin(time*1.5)*.015:0;r.x+=(t[0]+br-r.x)*k;r.y+=(t[1]-r.y)*k;r.z+=(t[2]-r.z)*k}E.amp+=((E.moving?1:0)-E.amp)*k;E.sg+=((E.back?-1:1)-E.sg)*k;const a=E.amp,sg=E.sg;const jaw=E.B.Jaw;if(jaw){const jo=E.dead?.1:(E.ap===1&&E.state.startsWith('A')||E.state==='LUNGE'||E.state.startsWith('CAST')||E.state==='SHIELD_BASH')?.5:.04;jaw.rotation.x+=(jo+(E.state.startsWith('CAST')?Math.sin(time*18)*.15:0)-jaw.rotation.x)*k}if(E.type==='war'){E.gp+=dt*E.moving*2.8;const w=E.gp;B.Thigh_L.rotation.x=Math.sin(w)*.5*a*sg;B.Thigh_R.rotation.x=-Math.sin(w)*.5*a*sg;B.Calf_L.rotation.x=Math.max(0,Math.sin(w+1.2))*.7*a;B.Calf_R.rotation.x=Math.max(0,-Math.sin(w+1.2))*.7*a;B.Pelvis.position.y=1+Math.abs(Math.sin(w))*.025*a}else{E.gp+=dt*(2+E.moving*1.5)*(E.moving?1:0);const w=E.gp,run=cl(E.moving/4,.4,1.3);for(const L of E.legs){const up=Math.sin(w+L.po)*.4*a*sg*run,bd=Math.max(0,Math.cos(w+L.po))*.9*a*run,x=E.dead?.5:0;if(L.fr){L.u.rotation.x=up+x;L.l.rotation.x=bd+x;L.f.rotation.x=-(up+bd)*.5}else{L.u.rotation.x=-.4-up*.8+x;L.l.rotation.x=.8+bd*.7+x;L.f.rotation.x=-.4-bd*.4}}B.Body_Rear.position.y=1.45+Math.abs(Math.sin(w))*.04*a;for(let i=0;i<4;i++)B['Tail_'+i].rotation.x=Math.sin(time*2+i)*.1+a*.25}for(let i=0;i<E.nc;i++){const c=B['Cloth_'+i];if(c)c.rotation.x=Math.sin(time*1.7+i)*.05+a*.3}if(E.dead){const e=Math.min(1,E.td/1.2)**2;if(E.type==='war'){B.Root.rotation.x=-PI/2*e;B.Root.position.y=.15*e}else{B.Root.rotation.z=PI/2*e;B.Root.position.y=.45*e}E.eyeM.emissiveIntensity=Math.max(0,1-E.td)}else E.eyeM.emissiveIntensity=1;if(E.held){updateFireSkullVisual(E.held,E.boost||0);E.light.intensity=1.2+E.charge*2.5+rnd(.3);E.held.jaw.rotation.x=.2+Math.sin(time*(E.state.startsWith('CAST')?24:5))*.25;if(!E.dead&&rnd()<.5){E.B.Socket_Cast.getWorldPosition(tmpA);emit(tmpA,1,.4,1.3,FIRE,.15)}if(E.dead)E.light.intensity=0}}

  /* ===== Necromante: visual e poses do preview ===== */
  const necros=[];
  function buildNecro(previewOnly=false){
    const p=previewOnly?{x:0,y:0,z:0}:randomSpawn(19),N={id:previewOnly?'necromancer-preview':`necromancer-${++serial}`,type:'necromancer',g:new T.Group(),root:null,B:{},hp:CFG.nec.hp,maxHp:CFG.nec.hp,state:'IDLE',t:0,alive:true,dead:false,td:0,recover:0,tgt:null,did:0,last:'',moving:0,back:false,amp:0,w:0,sg:1,gs:.25,gsC:.25,cd:{res:0,heal:0,area:0,proj:0,ground:0,blast:0},manual:true};N.root=N.g;N.g.name=previewOnly?'V104_Necromancer_Bestiary':`V104_Necromancer_${serial}`;N.g.position.set(p.x,p.y,p.z);N.g.rotation.y=Math.atan2(player.x-p.x,player.z-p.z);if(!previewOnly)S.add(N.g);const B=N.B,b=(n,parent,x=0,y=0,z=0)=>bn(N,n,parent,x,y,z);const root=b('Root',N.g),pel=b('Pelvis',root,0,1,0),spn=b('Spine',pel,0,.12,0),chs=b('Chest',spn,0,.28,0),nek=b('Neck',chs,0,.38,0),hed=b('Head',nek,0,.06,0);N.rootBone=root;N.pel=pel;bx(pel,M.nArmor,.38,.2,.24);bx(spn,M.nBone,.07,.3,.07,0,.08,0);for(let i=0;i<3;i++)bx(spn,M.nBone,.3-i*.03,.025,.05,0,.04+i*.08,.07);bx(chs,M.nArmor,.5,.36,.3,0,.2,0);bx(chs,M.nArmor,.3,.1,.32,0,.05,0);for(let i=0;i<2;i++){const t=mk(G.tor,M.nSteel,chs,0,.2-i*.08,.16,.17,.17,.17);t.rotation.x=.3}for(const x of[-.12,.12])sp(pel,M.nBone,.06,.06,.06,x,-.02,.14);for(let i=0;i<8;i++){const a=i/8*PI*2,L=.5+rnd(.45),q=b('Cloth_'+i,pel,Math.sin(a)*.2,-.08,Math.cos(a)*.15);q.rotation.y=a;bx(q,i%2?M.nPurple:M.nCloth,.17,L,.025,0,-L/2,0)}for(let i=0;i<4;i++){const L=1.45-(i%2)*.3,q=b('Cape_'+i,chs,-.2+i*.133,.33,-.17);bx(q,i%2?M.nPurple:M.nCloth,.15,L,.025,0,-L/2,0)}sp(hed,M.nBone,.125,.15,.14,0,.13,.01);const jaw=b('Jaw',hed,0,.02,.06);bx(jaw,M.nBone,.1,.045,.1);bx(jaw,M.teeth,.09,.015,.02,0,.03,.05);N.eyeM=new T.MeshStandardMaterial({color:0,emissive:0x5fe08a,emissiveIntensity:1});for(const s of[-1,1]){sp(hed,M.black,.035,.04,.03,s*.05,.14,.12);mk(G.sphere,N.eyeM,hed,s*.05,.14,.14,.018,.018,.012)}bx(hed,M.black,.025,.04,.02,0,.08,.145);mk(G.cyl,M.nArmor,hed,0,.255,0,.14,.04,.14);for(let i=0;i<7;i++){const a=i/7*PI*2,h=.1+(i%3)*.05;mk(G.cone,M.nArmor,hed,Math.sin(a)*.14,.275+h/2,Math.cos(a)*.14,.022,h,.022)}sp(nek,M.nCloth,.2,.24,.17,0,.15,-.07);for(const[s,L]of[[1,'L'],[-1,'R']]){const c=b('Clavicle_'+L,chs,s*.2,.32,0),ua=b('UpperArm_'+L,c,s*.2,0,0),fa=b('Forearm_'+L,ua,0,-.34,0),ha=b('Hand_'+L,fa,0,-.32,0);sp(c,M.nArmor,.17,.09,.15,s*.1,.02,0);mk(G.cone,M.nArmor,c,s*.12,.14,0,.04,.16,.04);mk(G.cone,M.nArmor,c,s*.22,.08,0,.03,.12,.03).rotation.z=-s*.9;bx(ua,M.nBone,.07,.34,.07,0,-.17,0);bx(ua,M.nCloth,.1,.12,.1,0,-.05,0);bx(fa,M.nBone,.06,.32,.06,0,-.16,0);bx(fa,M.nArmor,.09,.15,.09,0,-.22,0);bx(ha,M.nArmor,.08,.09,.04,0,-.05,0);for(let k=0;k<3;k++){const f=b(`Finger_${L}_${k}`,ha,(k-1)*.025,-.1,0);f.rotation.z=(k-1)*.35;mk(G.cone,M.nBone,f,0,-.05,0,.012,.1,.012).rotation.x=PI}const th=b('Thigh_'+L,pel,s*.11,-.06,0),ca=b('Calf_'+L,th,0,-.44,0),ft=b('Foot_'+L,ca,0,-.44,0);bx(th,M.nArmor,.13,.44,.13,0,-.22,0);sp(th,M.nBone,.07,.07,.07,0,-.44,.02);bx(ca,M.nArmor,.1,.42,.1,0,-.21,0);bx(ft,M.nArmor,.11,.07,.25,0,-.03,.06)}const sock=b('Socket_Staff',B.Hand_R,0,-.08,.03),staff=new T.Group();sock.add(staff);N.staff=staff;N.staffSocket=sock;mk(G.cyl,M.nWood,staff,0,.15,0,.028,1.9,.028);for(let i=0;i<4;i++)mk(G.tor,M.nSteel,staff,0,-.3+i*.28,0,.04,.04,.04).rotation.x=PI/2;for(let i=0;i<3;i++){const a=i*2.1;mk(G.cone,M.nArmor,staff,Math.sin(a)*.06,1.12,Math.cos(a)*.06,.02,.14,.02).rotation.set(Math.cos(a)*.5,0,-Math.sin(a)*.5)}sp(staff,M.nBone,.1,.115,.11,0,1.24,0);bx(staff,M.nBone,.09,.04,.09,0,1.12,.02);for(const s of[-1,1])mk(G.sphere,N.eyeM,staff,s*.04,1.26,.09,.02,.02,.015);N.castSocket=b('Socket_Staff_Cast',staff,0,1.32,0);N.fMat=new T.MeshBasicMaterial({color:0x4ad07a,transparent:true,opacity:.3,blending:T.AdditiveBlending,depthWrite:false});N.flame=mk(G.sphere,N.fMat,staff,0,1.34,0,.1,.1,.1);N.sLight=new T.PointLight(0x4fe08a,1,7);N.sLight.position.y=1.3;staff.add(N.sLight);N.g.traverse(o=>{if(o.isMesh)o.frustumCulled=true});if(!previewOnly){necros.push(N);registerHud(N,'Necromante',2.75);announce('Necromante entrou no mapa');}return N;
  }
  const rH=(u,f,t)=>[t-u-f,0,0],nArm=(u,f,t,z=-.12)=>({UpperArm_R:[u,0,z],Forearm_R:[f,0,0],Hand_R:rH(u,f,t)});
  const NPOSE={idle:{...nArm(.15,-.7,.05),UpperArm_L:[.05,0,.2],Forearm_L:[-.3,0,0],Head:[.08,0,0]},observe:{...nArm(.15,-.7,.05),UpperArm_L:[.05,0,.2],Forearm_L:[-.3,0,0],Head:[.15,.25,0]},resStart:{...nArm(-.7,-.8,.5),UpperArm_L:[-1.2,0,.2],Forearm_L:[-.3,0,0],Chest:[.1,0,0],Head:[-.1,0,0]},resLoop:{...nArm(-.8,-.9,1.9),UpperArm_L:[-1.5,0,.25],Forearm_L:[-.1,0,0],Hand_L:[-.4,0,0],Spine:[.18,0,0],Chest:[.12,0,0]},resDone:{...nArm(-.4,-.6,2.5),UpperArm_L:[-.3,0,.5],Forearm_L:[-.3,0,0],Spine:[.3,0,0],Chest:[.25,0,0]},healLoop:{...nArm(-.7,-.8,1.2),UpperArm_L:[-1.3,0,.3],Forearm_L:[-.5,0,0],Spine:[.12,0,0]},healEnd:{...nArm(-.1,-.7,.3),UpperArm_L:[-.3,0,.3],Forearm_L:[-.3,0,0]},proj:{...nArm(-.6,-.7,.9),UpperArm_L:[-1.7,0,.1],Forearm_L:[-.6,0,0],Chest:[.08,.3,0]},projFire:{...nArm(-.6,-.7,.9),UpperArm_L:[-1.5,0,.1],Forearm_L:[-.05,0,0],Spine:[.2,0,0],Chest:[.2,0,0]},area:{...nArm(-2.6,-.3,0,-.05),UpperArm_L:[-2.4,0,.5],Forearm_L:[-.3,0,0],Chest:[-.15,0,0],Head:[-.25,0,0]},blast:{...nArm(-.4,-.5,.3,-1.3),UpperArm_L:[-.4,0,1.3],Forearm_L:[-.2,0,0],Chest:[-.12,0,0],Head:[-.2,0,0]},hit:{...nArm(.1,-.5,.1),UpperArm_L:[-.3,0,.6],Spine:[-.2,0,0],Head:[-.3,0,0]},stagger:{...nArm(-.5,-.3,.2,-.6),UpperArm_L:[-.6,0,.9],Forearm_L:[-.2,0,0],Spine:[-.4,0,0],Chest:[-.2,0,0],Head:[-.45,0,0]},dead:{UpperArm_R:[0,0,-.7],Forearm_R:[-.2,0,0],UpperArm_L:[0,0,.7],Forearm_L:[-.2,0,0],Head:[.2,.3,0]}};
  const NTR=['Spine','Chest','Neck','Head','Clavicle_L','UpperArm_L','Forearm_L','Hand_L','Clavicle_R','UpperArm_R','Forearm_R','Hand_R'];
  const zombieCorpses=[];
  function scanZombieCorpses(){const zs=window.gameZombie?.zombies||[],now=performance.now();for(const z of zs){if(z.state==='dead'&&!z._v104Corpse){z._v104Corpse=true;zombieCorpses.push({kind:'zombie',source:z,pos:z.root.position.clone(),created:now,used:false,resurrectionCount:0,maxResurrections:1})}else if(z.alive)z._v104Corpse=false}for(let i=zombieCorpses.length-1;i>=0;i--)if(zombieCorpses[i].used||now-zombieCorpses[i].created>CFG.nec.corpseLife*1000)zombieCorpses.splice(i,1)}
  function reviveZombieCorpse(c){const before=new Set((window.gameZombie?.zombies||[]).filter(z=>z.alive).map(z=>z.id));const n=window.gameZombie?.spawnManual?.(1)||0;if(!n)return false;const z=(window.gameZombie?.zombies||[]).find(z=>z.alive&&!before.has(z.id));if(z){z.root.position.copy(c.pos);z.root.position.y=game.groundY(z.root.position.x,z.root.position.z);c.used=true;c.resurrectionCount++;emit(tmpA.copy(c.pos).add(new T.Vector3(0,.5,0)),40,3,4,GRN,.6);ring(c.pos,2,.7,0x4fd67a);return true}return false}
  function alliedAlive(){const a=[];for(const e of trio)if(e.alive)a.push(e);for(const z of window.gameZombie?.zombies||[])if(z.alive)a.push({kind:'zombie-live',source:z,g:z.root,root:z.root,get hp(){return z.hp},set hp(v){z.hp=v},maxHp:z.maxHp||100,alive:true});return a}
  function corpseCandidates(N){const arr=[];for(const e of trio)if(e.dead&&e.corpse.canBeResurrected&&e.corpse.resurrectionCount<e.corpse.maxResurrections)arr.push({kind:'trio',source:e,pos:e.g.position});for(const c of zombieCorpses)if(!c.used&&c.resurrectionCount<c.maxResurrections)arr.push(c);arr.sort((a,b)=>distXZPos(a.pos,N.g.position)-distXZPos(b.pos,N.g.position));return arr}
  const projectiles=[],telegraphs=[];
  function necStaffPos(N,out=tmpA){return N.castSocket.getWorldPosition(out)}
  function necBeam(N,a,b){if(!N.beam){const geo=new T.BufferGeometry().setFromPoints(Array.from({length:14},()=>new T.Vector3()));N.beam=new T.Line(geo,new T.LineBasicMaterial({color:0x7be0a0,transparent:true,opacity:.9,blending:T.AdditiveBlending}));N.beam.frustumCulled=true;S.add(N.beam)}const ps=N.beam.geometry.attributes.position;for(let i=0;i<14;i++){const f=i/13,s=Math.sin(f*PI);ps.setXYZ(i,a.x+(b.x-a.x)*f+(rnd()-.5)*.3*s,a.y+(b.y-a.y)*f+Math.sin(time*7+f*9)*.18*s,a.z+(b.z-a.z)*f+(rnd()-.5)*.3*s)}ps.needsUpdate=true;N.beam.visible=true;if(rnd()<.7){tmpC.lerpVectors(a,b,rnd());emit(tmpC,1,.4,.4,GRN)}}
  function fireNecProjectile(N){const a=necStaffPos(N,tmpA).clone(),target=playerPoint(tmpB,1);const orb=new T.Group();const core=mk(G.sphere,new T.MeshBasicMaterial({color:0x0b2a18}),orb,0,0,0,.2,.2,.2);mk(G.sphere,new T.MeshBasicMaterial({color:0x3ec878,transparent:true,opacity:.45,blending:T.AdditiveBlending,depthWrite:false}),orb,0,0,0,.36,.36,.36);orb.position.copy(a);S.add(orb);const v=target.clone().sub(a).normalize().multiplyScalar(CFG.nec.projSpeed);projectiles.push({m:orb,v,life:CFG.nec.projLife,owner:N})}
  function groundTelegraph(N){const p=playerPoint(tmpA,0).clone(),g=new T.Group(),mt=new T.MeshBasicMaterial({color:0x2f9f5a,transparent:true,opacity:.7,side:T.DoubleSide,blending:T.AdditiveBlending,depthWrite:false});const a=mk(new T.RingGeometry(.9,1,48),mt,g),b=mk(new T.RingGeometry(.5,.58,5),mt,g);g.rotation.x=-PI/2;g.position.set(p.x,game.groundY(p.x,p.z)+.07,p.z);g.scale.setScalar(CFG.nec.groundRadius);S.add(g);telegraphs.push({g,b,pos:p,t:0,owner:N})}
  function setNec(N,s){N.state=s;N.t=0;N.did=0}
  function goNec(N,s,l){if(l)N.last=l;setNec(N,s)}
  function killNec(N){if(!N.alive)return;N.alive=false;N.dead=true;N.state='DEATH';N.td=0;N.hp=0;N.tgt=null;if(N.beam)N.beam.visible=false;window.gameProgression?.dropXP?.(80,N.g.position,'Necromante');announce('Necromante derrotado')}
  function hitNec(N,dmg,impact=8){if(!N.alive)return false;dmg*=window.gameParry?.damageMultiplierFor?.(N.id)??1;N.hp=Math.max(0,N.hp-dmg);if(N.hp<=0){killNec(N);return true}N.recover=0;if(impact>=CFG.nec.spellInterruptThreshold){if(N.beam)N.beam.visible=false;N.tgt=null;setNec(N,'STAGGER')}else if(!['CAST_RESURRECTION','CAST_HEAL','CAST_AREA_HEAL'].includes(N.state)){setNec(N,'HIT_REACTION')}return true}
  function chooseNecTarget(N){const d=distXZPos(N.g.position,playerPoint(tmpA,0)),al=alliedAlive(),near=d>CFG.nec.minimumRange*.5;const clear=!window.FlorestaAI||window.FlorestaAI.clear(N.g.position,player,.45);if(d<CFG.nec.blastRange&&N.cd.blast<=0)return goNec(N,'DEFENSIVE_BLAST','blast');const cs=corpseCandidates(N).filter(c=>distXZPos(c.pos,N.g.position)<CFG.nec.resurrectionRange*1.6);if(cs.length&&N.cd.res<=0&&near){N.tgt=cs[0];return goNec(N,distXZPos(cs[0].pos,N.g.position)>CFG.nec.resurrectionRange?'MOVE_TO_RESURRECTION_RANGE':'CAST_RESURRECTION','res')}const inj=al.filter(u=>u.hp/u.maxHp<CFG.nec.healThreshold).sort((a,b)=>a.hp/a.maxHp-b.hp/b.maxHp);if(inj.length>1&&N.cd.area<=0&&near){N.tgt=null;return goNec(N,'CAST_AREA_HEAL','area')}if(inj.length&&N.cd.heal<=0&&near){N.tgt=inj[0];return goNec(N,'CAST_HEAL','heal')}if(d<CFG.nec.minimumRange)return goNec(N,'RETREAT');if(!clear){N.flankSide=(N.flankSide||1)*-1;return goNec(N,'FLANK_OBSTACLE');}if(d<=CFG.nec.maximumRange*1.2){const opts=[['proj','CAST_PROJECTILE',N.cd.proj],['ground','CAST_GROUND_SPELL',N.cd.ground]].filter(x=>x[2]<=0),f=opts.filter(x=>x[0]!==N.last),list=f.length?f:opts;if(list.length){const c=list[Math.floor(rnd(list.length))];return goNec(N,c[1],c[0])}}if(d>CFG.nec.maximumRange)return goNec(N,'MOVE');if(d<CFG.nec.preferredRange-1)return goNec(N,'KEEP_DISTANCE');goNec(N,'OBSERVE')}
  function necStep(N,dir,s,dt){moveRoot(N.g,dir,s,dt);N.moving=s;const yaw=N.g.rotation.y;N.back=dir.x*Math.sin(yaw)+dir.z*Math.cos(yaw)<0}
  function updateNecAI(N,dt){if(N.__parryBrokenUntil>performance.now()&&N.alive){N.moving=0;N.gs=.25;N.state='STAGGER';return}N.t+=dt;N.recover=Math.max(0,N.recover-dt);for(const k in N.cd)N.cd[k]=Math.max(0,N.cd[k]-dt);if(!N.alive){N.td+=dt;return}N.moving=0;N.gs=.25;const P=playerPoint(tmpA,0),d=distXZPos(N.g.position,P);switch(N.state){case'IDLE':faceRoot(N.g,P,dt,3);if(!N.recover&&N.t>.25)chooseNecTarget(N);break;case'OBSERVE':faceRoot(N.g,P,dt,4);if(N.t>1.2)setNec(N,'IDLE');break;case'FLANK_OBSTACLE':{faceRoot(N.g,P,dt,4);const dir=direction(N.g.position,P,tmpB),side=N.flankSide||1;const x=dir.x;dir.x=dir.x*.3-dir.z*side;dir.z=dir.z*.3+x*side;necStep(N,dir,CFG.nec.speed*1.1,dt);if(N.t>2.1||(!window.FlorestaAI||window.FlorestaAI.clear(N.g.position,P,.45)))setNec(N,'IDLE');break;}case'STAGGER':if(N.t>1.1)setNec(N,'IDLE');break;case'HIT_REACTION':if(N.t>.45)setNec(N,'IDLE');break;case'MOVE':faceRoot(N.g,P,dt,5);necStep(N,direction(N.g.position,P,tmpB),CFG.nec.speed,dt);if(d<=CFG.nec.preferredRange||N.t>3)setNec(N,'IDLE');break;case'RETREAT':case'KEEP_DISTANCE':faceRoot(N.g,P,dt,6);necStep(N,direction(P,N.g.position,tmpB),CFG.nec.speed*(N.state==='RETREAT'?1.3:.8),dt);if(d>=CFG.nec.preferredRange||N.t>2.5)setNec(N,'IDLE');break;case'MOVE_TO_RESURRECTION_RANGE':{const c=N.tgt;if(!c){setNec(N,'IDLE');break}faceRoot(N.g,c.pos,dt,6);const dd=distXZPos(c.pos,N.g.position);necStep(N,direction(N.g.position,c.pos,tmpB),CFG.nec.speed,dt);if(dd<=CFG.nec.resurrectionRange*.8)setNec(N,'CAST_RESURRECTION');break}case'CAST_RESURRECTION':{const c=N.tgt;if(!c){setNec(N,'IDLE');break}faceRoot(N.g,c.pos,dt,8);const pr=Math.min(1,N.t/CFG.nec.resCast);N.gs=.4+pr*1.4;necStaffPos(N,tmpB);tmpC.copy(c.pos);tmpC.y=game.groundY(c.pos.x,c.pos.z)+.3;necBeam(N,tmpB,tmpC);emit(tmpC,2,.7,1.8,GRN,.8);if(N.t>=CFG.nec.resCast){const ok=c.kind==='trio'?reviveTrio(c.source):reviveZombieCorpse(c);if(N.beam)N.beam.visible=false;N.cd.res=CFG.nec.resCooldown;N.recover=.7;N.rp='resDone';N.tgt=null;setNec(N,'IDLE');if(ok)announce('Necromante ressuscitou um aliado')}break}case'CAST_HEAL':{const a=N.tgt;if(!a||!a.alive){N.tgt=null;setNec(N,'IDLE');break}faceRoot(N.g,a.g.position,dt,8);N.gs=.4+Math.min(1,N.t);necStaffPos(N,tmpB);tmpC.copy(a.g.position);tmpC.y+=1.1;necBeam(N,tmpB,tmpC);a.hp=Math.min(a.maxHp,a.hp+a.maxHp*CFG.nec.healPortion*dt/CFG.nec.healCast);emit(tmpC,1,.4,1.8,GRN,.4);if(N.t>=CFG.nec.healCast||a.hp>=a.maxHp){if(N.beam)N.beam.visible=false;N.cd.heal=CFG.nec.healCooldown;N.recover=.5;N.rp='healEnd';N.tgt=null;setNec(N,'IDLE')}break}case'CAST_AREA_HEAL':N.gs=.5+N.t/1.4*1.3;if(!N.did&&N.t>.5){N.did=1;ring(N.g.position,CFG.nec.areaRadius,.9,0x4fd67a,.06)}if(N.t>1.4){for(const a of alliedAlive())if(distXZPos(a.g.position,N.g.position)<=CFG.nec.areaRadius)a.hp=Math.min(a.maxHp,a.hp+a.maxHp*CFG.nec.areaPortion);N.cd.area=CFG.nec.areaCooldown;N.recover=.6;N.rp='healEnd';setNec(N,'IDLE')}break;case'CAST_PROJECTILE':faceRoot(N.g,P,dt,8);N.gs=.6+N.t;if(N.t>=.9&&!N.did&&window.FlorestaAI&&!window.FlorestaAI.clear(N.g.position,P,.45)){setNec(N,'FLANK_OBSTACLE');break;}if(N.t>=.9&&!N.did){N.did=1;fireNecProjectile(N);N.cd.proj=CFG.nec.projCooldown;N.recover=.5;N.rp='projFire';setNec(N,'IDLE')}break;case'CAST_GROUND_SPELL':faceRoot(N.g,P,dt,8);N.gs=1.2;if(N.t>=.5&&!N.did&&window.FlorestaAI&&!window.FlorestaAI.clear(N.g.position,P,.45)){setNec(N,'FLANK_OBSTACLE');break;}if(N.t>=.5&&!N.did){N.did=1;groundTelegraph(N);N.cd.ground=CFG.nec.groundCooldown;N.recover=.5;N.rp='projFire';setNec(N,'IDLE')}break;case'DEFENSIVE_BLAST':faceRoot(N.g,P,dt,10);N.gs=1.8;if(!N.did&&N.t>.3){N.did=1;N.cd.blast=CFG.nec.blastCooldown;ring(N.g.position,CFG.nec.blastRange+1,.5,0x7fe39a,.15);emit(tmpB.set(N.g.position.x,N.g.position.y+1,N.g.position.z),60,6,2,GRN,.5);if(d<CFG.nec.blastRange+1)pushPlayer(direction(N.g.position,P,tmpC),2.5)}if(N.t>.9)setNec(N,'RETREAT');break}}
  function pickNecPose(N){if(!N.alive)return'dead';if(N.recover>0)return N.rp||'idle';const s=N.state;if(s==='CAST_RESURRECTION')return N.t<.6?'resStart':'resLoop';if(s==='CAST_HEAL')return N.t<.4?'resStart':'healLoop';if(s==='CAST_AREA_HEAL')return'area';if(s==='CAST_PROJECTILE'||s==='CAST_GROUND_SPELL')return'proj';if(s==='DEFENSIVE_BLAST')return'blast';if(s==='STAGGER')return'stagger';if(s==='HIT_REACTION')return'hit';return s==='OBSERVE'?'observe':'idle'}
  function animNec(N,dt){const k=1-Math.exp(-10*dt),p=NPOSE[pickNecPose(N)],B=N.B;for(const nm of NTR){const t=p[nm]||ZERO,r=B[nm].rotation,br=nm==='Chest'?Math.sin(time*1.6)*.02:0;r.x+=(t[0]+br-r.x)*k;r.y+=(t[1]-r.y)*k;r.z+=(t[2]-r.z)*k}N.amp+=((N.moving?1:0)-N.amp)*k;N.sg+=((N.back?-1:1)-N.sg)*k;N.w+=dt*N.moving*2.6;const a=N.amp,w=N.w,sg=N.sg;B.Thigh_L.rotation.x=Math.sin(w)*.55*a*sg;B.Thigh_R.rotation.x=-Math.sin(w)*.55*a*sg;B.Calf_L.rotation.x=Math.max(0,Math.sin(w+1.2))*.8*a;B.Calf_R.rotation.x=Math.max(0,-Math.sin(w+1.2))*.8*a;N.pel.position.y=1+Math.abs(Math.sin(w))*.03*a;for(let i=0;i<8;i++)B['Cloth_'+i].rotation.x=Math.sin(time*1.7+i)*.05+a*.3;for(let i=0;i<4;i++)B['Cape_'+i].rotation.x=.08+Math.sin(time*1.4+i)*.06+a*.35;if(!N.alive){const e=Math.min(1,N.td/1.5)**2;N.rootBone.rotation.x=-PI/2*e;N.rootBone.position.y=.2*e;N.sLight.intensity=Math.max(0,N.sLight.intensity-dt*2)}N.gsC+=(N.gs-N.gsC)*k;const g=N.gsC;N.flame.scale.setScalar(.06+.13*g);N.fMat.opacity=Math.min(.7,.15+.35*g);N.sLight.intensity=N.alive?.3+1.7*g:Math.max(0,N.sLight.intensity-dt*2);N.eyeM.emissiveIntensity=N.alive?.8+g:Math.max(0,N.eyeM.emissiveIntensity-dt*1.5);if(N.alive&&g>.6&&rnd()<.4){necStaffPos(N,tmpA);emit(tmpA,1,.8,1.2,GRN,.1)}}

  /* ===== dano do jogador / integração com ataque existente ===== */
  function facingTarget(root,range,halfDeg=75){const p=playerPoint(tmpA,0),dx=root.position.x-p.x,dz=root.position.z-p.z,d=Math.hypot(dx,dz);if(d>range)return false;const yaw=player.bodyYaw??player.yaw??0,fx=Math.sin(yaw),fz=Math.cos(yaw);return (dx*fx+dz*fz)/Math.max(.001,d)>=Math.cos(halfDeg*PI/180)}
  window.addEventListener('game:axe-impact',ev=>{if(window.gameRightHand?.current!=='axe')return;const swing=ev.detail?.swingId??performance.now(),dmg=window.gameProgression?.modifyAxeDamage?.(34)??34;let best=null,bd=Infinity;for(const E of trio){if(!E.alive||E.lastSwing===swing||!facingTarget(E.g,E.type==='fire'?3:2.75,78))continue;const d=distXZPos(E.g.position,playerPoint(tmpA,0));if(d<bd){bd=d;best=E}}for(const N of necros){if(!N.alive||N.lastSwing===swing||!facingTarget(N.g,2.75,78))continue;const d=distXZPos(N.g.position,playerPoint(tmpA,0));if(d<bd){bd=d;best=N}}if(best){best.lastSwing=swing;if(best.type==='necromancer')hitNec(best,dmg,12);else hitTrio(best,dmg,12)}});

  /* ===== update de projéteis/telegraphs ===== */
  function updateNecProjectiles(dt){const target=playerPoint(tmpA,1);for(let i=projectiles.length-1;i>=0;i--){const p=projectiles[i];const nx=p.m.position.x+p.v.x*dt,nz=p.m.position.z+p.v.z*dt;if(game.collides?.(nx,nz)){S.remove(p.m);projectiles.splice(i,1);continue;}p.m.position.addScaledVector(p.v,dt);p.life-=dt;emit(p.m.position,2,.4,.4,rnd()<.5?GRN:DRK);if(distXZPos(p.m.position,target)<.7&&Math.abs(p.m.position.y-target.y)<1.2){emit(p.m.position,45,5,3,GRN,.3);damagePlayer(16,'Projétil do Necromante',p.owner.id);S.remove(p.m);projectiles.splice(i,1)}else if(p.life<=0||p.m.position.y<game.groundY(p.m.position.x,p.m.position.z)){emit(p.m.position,30,4,2,DRK,.3);S.remove(p.m);projectiles.splice(i,1)}}for(let i=telegraphs.length-1;i>=0;i--){const t=telegraphs[i];t.t+=dt;t.b.rotation.z+=dt*1.5;t.g.children[0].material.opacity=.4+.4*Math.abs(Math.sin(t.t*6));if(t.t>=CFG.nec.groundDelay){emit(t.pos,55,6,4,GRN,CFG.nec.groundRadius);ring(t.pos,CFG.nec.groundRadius*1.2,.5,0x6fe39a,.2);if(distXZPos(playerPoint(tmpA,0),t.pos)<CFG.nec.groundRadius)damagePlayer(22,'Magia de chão do Necromante',t.owner.id);S.remove(t.g);telegraphs.splice(i,1)}}}

  /* ===== otimização segura: só CPU/GPU invisível, nunca amostra animação ===== */
  let corpseScan=0;
  function optimizeStaticSceneOnce(){
    let instanced=0;
    S.traverse(o=>{
      if(!o?.isInstancedMesh)return;
      const name=String(o.name||'').toLowerCase();
      /* Somente mundo estático conhecido. Não toca VFX/bosses/rigs dinâmicos. */
      const staticWorld=(o.count===220||o.count===660||name.includes('grasschunk')||name.includes('grass_chunk')||name.includes('foresttree')||name.includes('forest_tree'));
      if(!staticWorld)return;
      o.frustumCulled=true;
      o.matrixAutoUpdate=false;
      o.updateMatrix?.();
      instanced++;
    });
    /* Compila shaders quando o browser está ocioso para reduzir microtravadas na primeira aparição. */
    const idle=window.requestIdleCallback||((fn)=>setTimeout(()=>fn({timeRemaining:()=>8}),600));
    idle(()=>{try{game.renderer.compileAsync?.(S,cam)?.catch?.(()=>{});}catch{}});
    return instanced;
  }
  const staticInstanced=optimizeStaticSceneOnce();

  function updateParticles(dt){if(activeParticles<=0)return;const fd=Math.pow(.4,dt);let live=0;for(let j=0;j<NP;j++){if(pl[j]>0){pl[j]-=dt;if(pl[j]>0){live++;pp[j*3]+=pv[j*3]*dt;pp[j*3+1]+=pv[j*3+1]*dt;pp[j*3+2]+=pv[j*3+2]*dt;pv[j*3+1]+=.45*dt;pc[j*3]*=fd;pc[j*3+1]*=fd;pc[j*3+2]*=fd}else pp[j*3+1]=-9999}}activeParticles=live;pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true}
  function updateRings(dt){for(let i=rings.length-1;i>=0;i--){const o=rings[i];o.t+=dt;const k=o.t/o.dur;if(k>=1){o.mesh.visible=false;rings.splice(i,1);o.pool.push(o);continue}o.mesh.scale.setScalar(.2+(o.r-.2)*Math.sqrt(k));o.mesh.material.opacity=.9*(1-k)}}

  function tick(now){
    requestAnimationFrame(tick);if(window.gameSpiderCave?.active)return;
    const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;time+=dt;
    corpseScan+=dt;if(corpseScan>=.25){corpseScan=0;scanZombieCorpses()}

    for(const E of trio){
      if(!common(E,dt)){if(E.type==='war')aiWar(E,dt);else if(E.type==='fire')aiFire(E,dt);else aiCent(E,dt)}
      /* ANIMAÇÃO SEMPRE EM TODO FRAME — política explícita V104 */
      animTrio(E,dt);
      if(E.dead&&!E.corpse.canBeResurrected&&E.td>8)E.g.visible=false;
    }
    for(const N of necros){updateNecAI(N,dt);animNec(N,dt);if(N.dead&&N.td>7)N.g.visible=false}
    updateSkulls(dt);updateNecProjectiles(dt);updateParticles(dt);updateRings(dt);
  }
  requestAnimationFrame(tick);if(window.gameSpiderCave?.active)return;

  function spawnIntegrated(type,count=1){
    count=Math.max(1,Math.min(10,Math.floor(Number(count)||1)));
    let n=0;
    for(let i=0;i<count;i++){
      if(type==='skeleton-warrior'){makeTrio('war');n++}
      else if(type==='centaur-fire'){makeTrio('fire');n++}
      else if(type==='centaur-skeleton'){makeTrio('cent');n++}
      else if(type==='necromancer'){buildNecro();n++}
    }
    return n;
  }
  // Bestiário: modelos autênticos independentes, sem IA, colisão, spawn ou dano.
  function previewModel(type){
    const kind=type==='skeleton'?'war':type==='centaur-skeleton'?'cent':type==='centaur-fire'?'fire':type==='necromancer'?'nec':null;
    if(!kind)return null;
    if(kind==='nec')return buildNecro(true).g;
    const E={g:new T.Group(),B:{},legs:[],type:kind};
    if(kind==='war')buildWar(E);else buildCent(E,kind==='fire');
    E.g.name='FlorestaBestiary_'+kind;return E.g;
  }
  window.gameUndeadForces={previewModel,
    version:'V109B',
    source:'Undead Trio – Preview 3D.html + Necromante – Preview 3D.html',
    get all(){return [...trio,...necros]},
     get trio(){return trio},get necromancers(){return necros},get skulls(){return skulls},
     combatTargets(){return [...trio.filter(e=>e.alive&&e.g?.visible).map(e=>({root:e.g,radius:.7,height:1.1,hit:d=>hitTrio(e,d,8)})),
       ...necros.filter(n=>n.alive&&n.g?.visible).map(n=>({root:n.g,radius:.78,height:1.4,hit:d=>hitNec(n,d,8)}))];},
    damageRing(x,z,waveRadius,thickness,baseDamage,maxRadius,sourceLabel="Dano em área",hitSet=null){
      let hits=0;const set=hitSet||new Set();const origin={x,z};
      for(const E of trio){
        if(!E?.alive||!E.g?.visible||set.has(E))continue;
        const d=Math.hypot(E.g.position.x-x,E.g.position.z-z);
        if(Math.abs(d-waveRadius)>thickness)continue;
        set.add(E);const falloff=Math.max(.45,1-.5*d/Math.max(.001,maxRadius||waveRadius||1));
        hitTrio(E,Math.max(0,baseDamage)*falloff,18,origin);hits++;
      }
      for(const N of necros){
        if(!N?.alive||!N.g?.visible||set.has(N))continue;
        const d=Math.hypot(N.g.position.x-x,N.g.position.z-z);
        if(Math.abs(d-waveRadius)>thickness)continue;
        set.add(N);const falloff=Math.max(.45,1-.5*d/Math.max(.001,maxRadius||waveRadius||1));
        hitNec(N,Math.max(0,baseDamage)*falloff,18);hits++;
      }
      return hits;
    },
    damageRadius(x,z,radius,baseDamage,sourceLabel="Dano em área",hitSet=null){
      let hits=0;const set=hitSet||new Set();const origin={x,z};
      for(const E of trio){
        if(!E?.alive||!E.g?.visible||set.has(E))continue;
        const d=Math.hypot(E.g.position.x-x,E.g.position.z-z);
        if(d>radius)continue;
        set.add(E);const falloff=Math.max(.60,1-.40*d/Math.max(.001,radius));
        hitTrio(E,Math.max(0,baseDamage)*falloff,30,origin);hits++;
      }
      for(const N of necros){
        if(!N?.alive||!N.g?.visible||set.has(N))continue;
        const d=Math.hypot(N.g.position.x-x,N.g.position.z-z);
        if(d>radius)continue;
        set.add(N);const falloff=Math.max(.60,1-.40*d/Math.max(.001,radius));
        hitNec(N,Math.max(0,baseDamage)*falloff,30);hits++;
      }
      return hits;
    },
    spawn:spawnIntegrated,
    spawnWarrior:(n=1)=>spawnIntegrated('skeleton-warrior',n),
    spawnFireCentaur:(n=1)=>spawnIntegrated('centaur-fire',n),
    spawnCentaur:(n=1)=>spawnIntegrated('centaur-skeleton',n),
    spawnNecromancer:(n=1)=>spawnIntegrated('necromancer',n),
    performance:{animationPolicy:'EVERY_RENDER_FRAME',graphicsPolicy:'UNCHANGED',sharedGeometry:true,sharedMaterials:true,pooledParticles:true,pooledRings:true,nativeFrustumCulling:true,staticWorldMatrices:true,prewarmShaders:true,instancedStaticObjects:staticInstanced}
  };

  console.info('[V106B] Undead Trio + Necromante — locomocao restaurada',window.gameUndeadForces.performance);
})().catch(err=>{console.error('[V104B Undead/Necro]',err);const s=document.getElementById('status');if(s)s.textContent='Falha ao integrar novos mortos-vivos: '+String(err?.message||err)});

