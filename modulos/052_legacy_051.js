
(async()=>{
  if(window.__GIGANTE_NEVoa_V94_INSTALLED)return;
  window.__GIGANTE_NEVoa_V94_INSTALLED=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)};
  const wrap=a=>Math.atan2(Math.sin(a),Math.cos(a));

  async function waitGame(){
    for(let i=0;i<1400;i++){
      const g=window.gameReview;
      if(g?.scene&&g?.camera&&g?.renderer&&g?.player&&g?.groundY&&window.__THREE_MODULE&&window.gameZombie?.hurtPlayer&&window.gameLumber?.trees){
        return g;
      }
      await sleep(20);
    }
    throw new Error('Jogo real não ficou disponível para o Gigante da Névoa.');
  }

  const game=await waitGame();
  const THREE=window.__THREE_MODULE;
  const scene=game.scene;
  const player=game.player;
  const status=document.getElementById('status');

  const CFG=Object.assign({
    spawnNight:10,
    spawnDistance:76,
    activationRadius:86,
    disengageRadius:122,
    walkSpeed:2.35,
    limpSpeed:1.45,
    enragedSpeedMultiplier:1.22,
    turnSpeed:1.55,
    bodyRadius:2.25,
    stopRange:6.2,
    hp:420,
    heelMax:100,
    heelPerAxeHit:28,
    headDamageMultiplier:2.15,
    headVulnerableSeconds:8.5,
    // V94B: a longa distância ele usa árvores com muito mais frequência.
    treeCooldown:8.2,
    longRangeTreeCooldown:5.0,
    longRangeTreeDistance:23,
    treeMinDistance:13,
    treeMaxDistance:68,
    meleeCooldown:2.7,
    stuckRetargetSeconds:1.9,
    hardUnstuckSeconds:2.8,
    xpReward:900,
    damage:{
      vertical:48,
      sweep:42,
      smash:54,
      stomp:40,
      tree:62,
      bodyFall:46
    }
  },window.FLORESTA_GIGANTE_CONFIG||{});

  const STATES=Object.freeze({
    HIDDEN:'HIDDEN',
    REVEAL:'REVEAL',
    REVEAL_LOOK:'REVEAL_LOOK',
    IDLE:'IDLE',
    WALK:'WALK',
    LIMP:'LIMP',
    SEARCH_TREE:'SEARCH_TREE',
    GRAB_TREE:'GRAB_TREE',
    UPROOT_TREE:'UPROOT_TREE',
    HOLD_TREE:'HOLD_TREE',
    AIM_TREE:'AIM_TREE',
    THROW_TREE:'THROW_TREE',
    MELEE_VERTICAL:'MELEE_VERTICAL',
    MELEE_SWEEP:'MELEE_SWEEP',
    GROUND_SMASH:'GROUND_SMASH',
    STOMP:'STOMP',
    HEEL_HIT_REACTION:'HEEL_HIT_REACTION',
    HEEL_STAGGER:'HEEL_STAGGER',
    FALLING:'FALLING',
    DOWNED:'DOWNED',
    HEAD_VULNERABLE:'HEAD_VULNERABLE',
    RECOVERING:'RECOVERING',
    GETTING_UP:'GETTING_UP',
    ENRAGED:'ENRAGED',
    DEATH:'DEATH',
    DEAD:'DEAD'
  });

  // ------------------------------------------------------------
  // Modelo / rig — portado do arquivo Gigante da Névoa - Boss Viewer.
  // ------------------------------------------------------------
  const M=(c,r=.9)=>new THREE.MeshStandardMaterial({color:c,roughness:r,flatShading:true,side:THREE.DoubleSide});
  const skin=M(0xaaa196),cloth=M(0x2a2520),bone=M(0xd6cdb8),wood=M(0x4a3b2c),iron=M(0x55595b),dark=M(0x050505);
  const cyl=(a,b,h)=>new THREE.CylinderGeometry(a,b,h,8);
  const bx=(w,h,d)=>new THREE.BoxGeometry(w,h,d);
  const sph=r=>new THREE.SphereGeometry(r,10,8);
  const mesh=(p,g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1)=>{const o=new THREE.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.castShadow=true;o.receiveShadow=true;p.add(o);return o};

  const root=new THREE.Group();
  root.name='GIGANTE_DA_NEVOA';
  root.visible=false;
  scene.add(root);

  // V127B: banco de névoa do Gigante. É um único Points para não pesar no FPS.
  const giantMistCount=(window.__FOREST_MOBILE_BUILD__?26:44);
  const giantMistPositions=new Float32Array(giantMistCount*3);
  const giantMistSeeds=new Float32Array(giantMistCount);
  for(let i=0;i<giantMistCount;i++){
    giantMistPositions[i*3]=0;giantMistPositions[i*3+1]=-999;giantMistPositions[i*3+2]=0;
    giantMistSeeds[i]=Math.random()*1000;
  }
  const giantMistGeo=new THREE.BufferGeometry();
  giantMistGeo.setAttribute('position',new THREE.BufferAttribute(giantMistPositions,3));
  const mistCanvas=document.createElement('canvas');mistCanvas.width=mistCanvas.height=64;
  const mistCtx=mistCanvas.getContext('2d');
  const mistGrad=mistCtx.createRadialGradient(32,32,2,32,32,32);
  mistGrad.addColorStop(0,'rgba(210,220,218,.34)');
  mistGrad.addColorStop(.45,'rgba(190,204,202,.20)');
  mistGrad.addColorStop(1,'rgba(180,195,194,0)');
  mistCtx.fillStyle=mistGrad;mistCtx.fillRect(0,0,64,64);
  const giantMistTex=new THREE.CanvasTexture(mistCanvas);
  const giantMistMat=new THREE.PointsMaterial({
    map:giantMistTex,transparent:true,depthWrite:false,opacity:0,
    size:10,sizeAttenuation:true,color:0xbec8c6,fog:true
  });
  const giantMist=new THREE.Points(giantMistGeo,giantMistMat);
  giantMist.name='GIGANTE_Nevoa_Local';
  giantMist.frustumCulled=false;
  scene.add(giantMist);
  let giantMistClock=0;

  const B={Root:root};
  const nb=(p,n,x,y,z)=>{const o=new THREE.Object3D();o.name=n;o.position.set(x,y,z);p.add(o);B[n]=o;return o};
  nb(root,'Pelvis',0,8,0);nb(B.Pelvis,'Spine_01',0,.6,0);nb(B.Spine_01,'Spine_02',0,1,0);nb(B.Spine_02,'Spine_03',0,1,0);nb(B.Spine_03,'Chest',0,1,0);nb(B.Chest,'Neck',0,1.4,0);nb(B.Neck,'Head',0,.7,0);nb(B.Head,'Jaw',0,-.2,.2);
  mesh(B.Pelvis,bx(3.6,1.6,2.2),skin,0,-.2,0);mesh(B.Spine_01,bx(3.8,2.4,2.5),skin,0,.4,0);mesh(B.Chest,bx(5.4,3.4,2.8),skin,0,-.2,0);mesh(B.Neck,cyl(.8,1,1.4),skin,0,-.3,0);
  const H=B.Head;mesh(H,sph(1),skin,0,.1,0,.95,1.15,1);mesh(H,bx(1.1,.25,.5),skin,0,.45,.8);
  [-1,1].forEach(s=>{mesh(H,sph(.22),dark,s*.38,.25,.85);mesh(H,sph(.06),M(0xdddddd,.3),s*.38,.25,1.0)});
  mesh(H,bx(.3,.6,.3),skin,0,0,.95);mesh(B.Jaw,bx(.9,.4,.8),skin,0,-.2,.5);mesh(B.Jaw,new THREE.ConeGeometry(.6,1.4,5),M(0x8c877f),0,-.9,.5);
  for(let i=0;i<14;i++){const a=1+i/14*4.3;const h=mesh(H,bx(.14,2.8,.06),M(0xcfcac0),Math.sin(a)*.9,-.9,-Math.cos(a)*.9);h.rotation.y=a}
  nb(H,'WeakPoint_Head',0,.1,0);nb(H,'Socket_Head',0,1,0);
  const skull=(p,x,y,z,s=1)=>{const g=new THREE.Group();g.position.set(x,y,z);g.scale.setScalar(s);p.add(g);mesh(g,sph(.35),bone);mesh(g,bx(.3,.2,.25),bone,0,-.3,.1);mesh(g,sph(.1),dark,-.13,.02,.3);mesh(g,sph(.1),dark,.13,.02,.3)};
  for(let i=0;i<7;i++)skull(B.Chest,(i-3)*.7,.9-Math.abs(i-3)*.35,1.5,1.2);
  mesh(B.Spine_01,new THREE.TorusGeometry(2.1,.3,6,12),M(0x3a2c20),0,-.5,0,1,1,.9).rotation.x=Math.PI/2;skull(B.Spine_01,0,-.5,1.7,2);skull(B.Spine_01,-1.6,-.5,1.6,1.3);skull(B.Spine_01,1.6,-.6,1.6,1.1);
  mesh(B.Pelvis,new THREE.CylinderGeometry(2.1,2.9,3.4,10,1,true),cloth,0,-1.9,0);
  for(let i=0;i<9;i++){const a=i/9*Math.PI*2;mesh(B.Pelvis,bx(.5,1.6,.05),cloth,Math.sin(a)*2.7,-3.8,Math.cos(a)*2.4)}
  mesh(B.Chest,bx(6.2,2.6,3.2),cloth,0,-.4,0);

  const fings={R:[],L:[]};
  [['R',-1],['L',1]].forEach(([n,s])=>{
    const cl=nb(B.Chest,'Clavicle_'+n,s*2.5,1.1,0),ua=nb(cl,'UpperArm_'+n,s*.6,0,0),fa=nb(ua,'Forearm_'+n,0,-2.9,0),ha=nb(fa,'Hand_'+n,0,-3,0);
    mesh(cl,sph(1.4),skin,s*.2,0,0);mesh(ua,cyl(1.1,.95,2.9),skin,0,-1.45,0);mesh(fa,cyl(1.25,.9,3),skin,0,-1.5,0);mesh(fa,new THREE.TorusGeometry(1.1,.14,5,10),M(0x3a2c20),0,-2.4,0).rotation.x=Math.PI/2;mesh(ha,bx(1.6,1.7,.9),skin,0,-.8,0);
    for(let i=0;i<5;i++){const f=nb(ha,`Finger${i}_${n}`,i<4?(i-1.5)*.4:-s*.95,i<4?-1.6:-.5,0),t=nb(f,`FingerTip${i}_${n}`,0,-1,0);mesh(f,bx(.34,1,.38),skin,0,-.5,0);mesh(t,bx(.3,.8,.34),skin,0,-.4,0);fings[n].push([f,t,i===4])}
    nb(ha,'Socket_Grab_'+n,0,-1,.5);
    const th=nb(B.Pelvis,'Thigh_'+n,s*1.3,-.3,0),ca=nb(th,'Calf_'+n,0,-3.4,0),an=nb(ca,'Ankle_'+n,0,-3.4,0),ft=nb(an,'Foot_'+n,0,-.2,0),to=nb(ft,'Toe_'+n,0,-.5,1.9);
    mesh(th,cyl(1.15,.95,3.4),skin,0,-1.7,0);mesh(ca,cyl(.95,.8,3.4),skin,0,-1.7,0);mesh(ft,bx(1.5,.7,2.6),skin,0,-.35,.6);mesh(to,bx(1.4,.4,.9),skin,0,.1,.1);
    mesh(ft,bx(.7,.35,.25),M(0x6e5148),0,-.25,-.72);mesh(an,new THREE.TorusGeometry(.8,.12,5,8),M(0x3a2c20),0,.2,0).rotation.x=Math.PI/2;
    nb(ft,'WeakPoint_Heel_'+n,0,-.3,-.55);nb(ft,'Socket_Foot_'+n,0,-.7,0);
  });
  mesh(B.Clavicle_R,sph(1.6),M(0x5a5048),-.2,.3,0,1,.6,1);
  const SW=nb(B.Hand_R,'Socket_Weapon_R',0,-1,.3),club=new THREE.Group();SW.add(club);
  mesh(club,new THREE.CylinderGeometry(.5,1.3,7.6,8),wood,0,-1.8,0);[-4.3,-5,-.2].forEach(y=>mesh(club,new THREE.TorusGeometry(1.1-y*-.02,.14,5,10),iron,0,y,0).rotation.x=Math.PI/2);
  for(let i=0;i<8;i++){const a=i/8*Math.PI*2,m=mesh(club,new THREE.ConeGeometry(.2,.8,5),iron,Math.cos(a)*1.3,-4.4,Math.sin(a)*1.3);m.rotation.set(Math.sin(a)*1.57,0,-Math.cos(a)*1.57)}
  nb(club,'ClubTip',0,-5.6,0);

  // Subtle readable weak-point wraps; not debug hitboxes.
  const heelMarkMat=new THREE.MeshStandardMaterial({color:0x49140d,emissive:0x180300,roughness:.85,transparent:true,opacity:.82});
  for(const side of ['R','L']){
    const mark=mesh(B['Foot_'+side],new THREE.TorusGeometry(.77,.10,6,14),heelMarkMat.clone(),0,-.22,-.42);mark.rotation.x=Math.PI/2;mark.name='GiantHeelMark_'+side;
  }

  // ------------------------------------------------------------
  // Procedural pose/animation set ported from the viewer.
  // ------------------------------------------------------------
  const BN={P:'Pelvis',S1:'Spine_01',S2:'Spine_02',Ch:'Chest',Nk:'Neck',Hd:'Head',Jw:'Jaw',CR:'Clavicle_R',CL:'Clavicle_L',UR:'UpperArm_R',UL:'UpperArm_L',FR:'Forearm_R',FL:'Forearm_L',HR:'Hand_R',HL:'Hand_L',TR:'Thigh_R',TL:'Thigh_L',KR:'Calf_R',KL:'Calf_L',AR:'Ankle_R',AL:'Ankle_L',W:'Socket_Weapon_R'};
  const KEYS=[...Object.keys(BN),'dy','cr','cl'];
  const mkp=(b,o)=>{const r={};KEYS.forEach(k=>r[k]=b?b[k].slice():[0,0,0]);for(const k in o)r[k]=[o[k][0]||0,o[k][1]||0,o[k][2]||0];return r};
  const BASE=mkp(null,{S1:[.1],Hd:[.1],UR:[0,0,-.12],UL:[0,0,.12],FR:[-.15],FL:[-.15],cr:[.5],cl:[.5],W:[-.6]});
  const F=o=>mkp(BASE,o),L=(a,k,b=a,j=k)=>({TL:[-a],KL:[k],AL:[a-k],TR:[-b],KR:[j],AR:[b-j]});
  const cur=mkp(BASE,{});
  const Dn=F({P:[1.25],dy:[-5.8],S1:[.15],Hd:[-.9],UR:[-1.1],UL:[-1.1],FR:[-.2],FL:[-.2],cr:[1],cl:[1],TL:[-1.5],KL:[1.5],AL:[-.1],TR:[0],KR:[1.9],AR:[-.3],W:[.4]});
  const Cr=F({...L(1,1.7),dy:[-2.4],S1:[.7],S2:[.4],Hd:[.3],UR:[-1,0,-.3],UL:[-1,0,.3],FR:[-.5],FL:[-.5],cr:[0],cl:[0]});
  const Up=F({...L(.2,.2),UR:[-2.9],UL:[-2.7],FR:[-.3],FL:[-.3],S1:[-.15],cr:[1.3],cl:[1.3],Hd:[.1]});
  const SQ={
    REVEAL_LOOK:[[1.6,F({Hd:[.55],S1:[.3],dy:[-.4]})],[1.6,F({Hd:[.55,.2],S1:[.3],dy:[-.4]})]],
    HEEL_HIT_REACTION:[[.35,F({Hd:[.1,.7],P:[0,0,.07],dy:[-.2],...L(.1,.1)})],[.9,BASE]],
    HEEL_STAGGER:[[.4,F({dy:[-.9],Hd:[.2,.6],P:[0,.1,.12],...L(.1,.9,.3,.2),UR:[-.6]}),'ROAR'],[1.3,BASE]],
    MELEE_VERTICAL:[[1.5,F({UR:[-3],UL:[-2.6],FR:[-.4],S1:[-.3],Ch:[-.2],dy:[-.4],...L(.3,.3,-.1,.3),cr:[1.3],cl:[1.3],W:[-.3]})],[.4,F({UR:[-.7],UL:[-.8],S1:[.6],Ch:[.2],Hd:[.3],dy:[-1.6],...L(.6,.9,-.2,.2),W:[-1.3]}),'WEAPON_IMPACT'],[1.3,F({UR:[-.7],S1:[.5],dy:[-1.6],...L(.6,.9,-.2,.2),W:[-1.3]})],[1.0,BASE]],
    MELEE_SWEEP:[[1.2,F({Ch:[0,-1.1],P:[0,-.6],UR:[-.2,0,-1.55],FR:[-.2],UL:[-.4],S1:[.1],dy:[-1],...L(.5,.6,-.4,.5),cr:[1.3]})],[.45,F({Ch:[0,.2],P:[0,.1],UR:[-.2,0,-1.55],S1:[.1],dy:[-1.2],...L(.5,.6,-.4,.5),cr:[1.3]}),'SWEEP'],[.55,F({Ch:[0,1.1],P:[0,.6],UR:[-.3,0,-1.4],S1:[.2],dy:[-1.2],...L(.5,.6,-.4,.5),cr:[1.3]})],[.7,F({Ch:[0,1],P:[0,.5],UR:[-.3,0,-1.3]})],[1.0,BASE]],
    GROUND_SMASH:[[.9,F({UR:[-2.4,0,-.4],S1:[-.2],dy:[-.6],...L(.4,.5),cr:[1.3]})],[.38,F({UR:[-.5],S1:[.7],Hd:[.3],dy:[-2],...L(.8,1.1,.1,.3),W:[-1.4]}),'WEAPON_IMPACT'],[.8,F({UR:[-.5],S1:[.7],dy:[-2],...L(.8,1.1,.1,.3),W:[-1.4]})],[1.0,BASE]],
    STOMP:[[1.0,F({...L(.2,.2,1,1.3),AR:[-.3],P:[0,.15,.12],UL:[-.4,0,.5],UR:[0,0,-.6],dy:[-.4],Hd:[.4]})],[.45,F({...L(.2,.2,1,1.3),AR:[-.3],P:[0,.15,.12],dy:[-.4],Hd:[.4]})],[.30,F({...L(.2,.2,.3,.1),dy:[-.9],S1:[.35],Hd:[.3]}),'STOMP'],[.9,BASE]],
    GRAB_TREE:[[1.15,Cr],[.55,F({...L(1,1.7),dy:[-2.4],S1:[.7],S2:[.4],Hd:[.3],UR:[-1,0,-.3],UL:[-1,0,.3],FR:[-.5],FL:[-.5],cr:[1.3],cl:[1.3]}),'TREE_GRAB']],
    UPROOT_TREE:[[.8,F({...L(1,1.7),dy:[-2.2],S1:[.5],UR:[-.7],UL:[-.7],cr:[1.3],cl:[1.3]})],[1.1,F({...L(1,1.7),dy:[-2],S1:[.1],UR:[-.3],UL:[-.3],Hd:[0],cr:[1.3],cl:[1.3]})],[.14,F({...L(.9,1.5),dy:[-1.8],S1:[0],cr:[1.3],cl:[1.3]}),'TREE_CRACK'],[1.0,Up,'TREE_UPROOT']],
    AIM_TREE:[[.75,F({...Up,Hd:[.25]})],[.75,F({...Up,Ch:[0,-.9],P:[0,-.4],UR:[-2.5],S1:[-.3],dy:[-.6],...L(.5,.6,-.4,.5),Hd:[.2]}),'TREE_AIM'],[.5,F({...Up,Ch:[0,-1],P:[0,-.4],UR:[-2.6],S1:[-.35],dy:[-.6],...L(.5,.6,-.4,.5),Hd:[.2]})]],
    THROW_TREE:[[.34,F({Ch:[0,1],P:[0,.4],UR:[-1.1],UL:[-1.1],S1:[.5],dy:[-.8],...L(.5,.7,-.3,.4),cr:[.2]}),'TREE_THROW'],[.9,F({Ch:[0,.8],UR:[-.6],S1:[.4]})],[1.0,BASE]],
    FALLING:[[.7,F({KR:[1.5],TR:[-.2],P:[0,0,.2],dy:[-1.5],UR:[-1],FR:[-.2],S1:[.2],Hd:[.2,.5],TL:[-.6]}),'ROAR'],[.65,F({TL:[-1.4],KL:[1.4],AL:[0],TR:[0],KR:[1.9],dy:[-4.3],S1:[.4],UR:[-1],UL:[-1],Hd:[.3]}),'KNEE_IMPACT'],[.9,Dn,'BODY_FALL']],
    DOWNED:[[.6,Dn]],
    RECOVERING:[[1.05,F({...Dn,Hd:[-.3],UR:[-1.3],UL:[-1.3]}),'STAND_UP'],[1.4,F({P:[.7],dy:[-3.6],UR:[-1.2],UL:[-1.2],TL:[-1.3],KL:[1.4],TR:[-.2],KR:[1.8],S1:[.3],W:[0]})]],
    GETTING_UP:[[1.2,F({P:[.3],dy:[-1.6],UR:[-.5],UL:[-.8],S1:[.4],...L(.9,1.3,.2,.6),W:[-1.4]})],[1.2,BASE]],
    ENRAGED:[[.75,F({Ch:[-.3],S1:[-.3],UR:[-2.5,0,-.6],UL:[-2.5,0,.6],Hd:[-.5],dy:[-.4],...L(.5,.5,.5,.5)}),'ROAR'],[1.1,F({Ch:[-.3],S1:[-.3],UR:[-2.5,0,-.6],UL:[-2.5,0,.6],Hd:[-.5],dy:[-.4],...L(.5,.5,.5,.5)})],[.7,BASE]],
    DEATH:[[1.2,F({...Dn,P:[1],dy:[-4.6],Hd:[-.5],UR:[-1.4],UL:[-1.4]})],[1.0,F({...Dn,P:[1],dy:[-4.6],Hd:[-.5],UR:[-.9],UL:[-1.1],cr:[0]}),'WEAPON_DROP'],[1.3,F({...Dn,P:[1],dy:[-4.5],Hd:[-.2,.4],UR:[-.6],UL:[-.8]})],[2.2,F({P:[1.5],dy:[-6.5],UR:[-.3],UL:[-.3],Hd:[.2],S1:[.1],TL:[-.1],KL:[.2],TR:[0],KR:[.2],cr:[0],cl:[0]}),'BODY_FALL']]
  };
  const dur=s=>s.reduce((a,k)=>a+k[0],0);
  const lp=(a,b,u)=>{const r={};KEYS.forEach(k=>r[k]=a[k].map((v,i)=>v+(b[k][i]-v)*u));return r};
  function seqPose(s,t){let a=BASE;for(const k of s){if(t<=k[0])return lp(a,k[1],ease(t/k[0]));t-=k[0];a=k[1]}return a}

  // ------------------------------------------------------------
  // HUD do boss.
  // ------------------------------------------------------------
  const style=document.createElement('style');
  style.id='giganteBossStyleV92';
  style.textContent=`
    #giganteBossHudV92{position:fixed;left:50%;top:5.5%;transform:translateX(-50%);width:min(680px,82vw);z-index:66;pointer-events:none;opacity:0;transition:opacity .2s;font-family:system-ui,sans-serif;text-align:center;color:#eee;text-shadow:0 2px 5px #000}
    #giganteBossHudV92.show{opacity:1}
    #giganteBossHudV92 .nm{font-weight:900;letter-spacing:.16em;font-size:clamp(13px,2vw,20px)}
    #giganteBossHudV92 .meta{font-size:12px;color:#c9c1b6;margin:4px 0 6px;letter-spacing:.08em}
    #giganteBossHudV92 .track{height:14px;border:1px solid #8a8074;background:#090909dd;padding:2px;border-radius:3px;box-shadow:0 0 18px #0008}
    #giganteBossHudV92 .fill{height:100%;width:100%;background:linear-gradient(90deg,#35100c,#74251b 52%,#b88b5a);transition:width .12s linear;border-radius:2px}
    #giganteWarningV92{position:fixed;left:50%;top:31%;transform:translate(-50%,-50%);z-index:67;pointer-events:none;color:#d7d0c3;font:900 clamp(24px,5vw,54px)/1 system-ui,sans-serif;text-shadow:0 0 15px #000,0 3px 12px #000;opacity:0;transition:opacity .16s;text-align:center;white-space:nowrap}
    #giganteWarningV92.show{opacity:1}
  `;
  document.head.append(style);
  const hud=document.createElement('div');hud.id='giganteBossHudV92';hud.innerHTML='<div class="nm">GIGANTE DA NÉVOA</div><div class="meta" id="giganteMetaV92">QUEBRE OS CALCANHARES</div><div class="track"><div class="fill" id="giganteFillV92"></div></div>';document.body.append(hud);
  const fill=hud.querySelector('#giganteFillV92'),meta=hud.querySelector('#giganteMetaV92');
  const warning=document.createElement('div');warning.id='giganteWarningV92';document.body.append(warning);
  function warn(t,ms=1200){warning.textContent=t||'';warning.classList.toggle('show',!!t);if(t&&ms>0)setTimeout(()=>{if(warning.textContent===t)warning.classList.remove('show')},ms)}

  // ------------------------------------------------------------
  // Partículas simples: poeira / terra / folhas.
  // ------------------------------------------------------------
  const PN=520,pp=new Float32Array(PN*3).fill(-999),pv=new Float32Array(PN*3),plife=new Float32Array(PN),pc=new Float32Array(PN*3);let pIndex=0;
  const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pp,3));pg.setAttribute('color',new THREE.BufferAttribute(pc,3));
  const points=new THREE.Points(pg,new THREE.PointsMaterial({size:.24,vertexColors:true,transparent:true,opacity:.75,depthWrite:false}));points.frustumCulled=false;scene.add(points);
  const DUST=[.55,.52,.47],EARTH=[.27,.18,.11],LEAF=[.18,.28,.17];
  function emit(p,n,s,c){for(let k=0;k<n;k++){const i=pIndex++%PN,a=Math.random()*Math.PI*2,v=Math.random()*s;pp.set([p.x,p.y+.15,p.z],i*3);pv.set([Math.cos(a)*v,Math.random()*s*.8,Math.sin(a)*v],i*3);plife[i]=.8+Math.random()*1.4;pc.set(c,i*3)}}
  function updateParticles(dt){for(let i=0;i<PN;i++)if(plife[i]>0){plife[i]-=dt;pp[i*3]+=pv[i*3]*dt;pp[i*3+1]+=pv[i*3+1]*dt;pp[i*3+2]+=pv[i*3+2]*dt;pv[i*3+1]-=7*dt;pv[i*3]*=.98;pv[i*3+2]*=.98;if(pp[i*3+1]<0){pp[i*3+1]=0;pv[i*3+1]=0}if(plife[i]<=0)pp[i*3+1]=-999}pg.attributes.position.needsUpdate=true;pg.attributes.color.needsUpdate=true}

  // ------------------------------------------------------------
  // Mundo real: árvores / colisão / seleção para arrancar.
  // ------------------------------------------------------------
  const forestInstanced=[];scene.traverse(o=>{if(o?.isInstancedMesh)forestInstanced.push(o)});
  const forestTrunkMesh=forestInstanced.find(o=>o.count===220&&((o.geometry?.parameters?.height)||0)>6)||null;
  const forestFoliageMesh=forestInstanced.find(o=>o.count===660)||null;
  const tempM=new THREE.Matrix4(),tempP=new THREE.Vector3(),tempQ=new THREE.Quaternion(),tempS=new THREE.Vector3();
  function hideInstance(mesh,index){if(!mesh||index<0||index>=mesh.count)return;mesh.getMatrixAt(index,tempM);tempM.decompose(tempP,tempQ,tempS);tempS.setScalar(.00001);tempM.compose(tempP,tempQ,tempS);mesh.setMatrixAt(index,tempM);mesh.instanceMatrix.needsUpdate=true}
  function treeList(){return window.gameLumber?.trees||[]}


  // V164B — navegação local do Gigante sem alterar spawn/estados/ataques.
  // As árvores extras da floresta densa (V120) não fazem parte de gameLumber.trees,
  // então o boss antigo não conseguia enxergá-las para desviar.
  let denseNavTrees=[];
  let denseNavStamp=-Infinity;
  const denseNavP=new THREE.Vector3(),denseNavS=new THREE.Vector3();
  let navSideBias=0,navSideUntil=0;

  function refreshDenseNavTrees(force=false){
    const now=performance.now()/1000;
    if(!force&&now-denseNavStamp<1.0)return denseNavTrees;
    denseNavStamp=now;
    denseNavTrees=[];
    const denseRoot=window.gameDenseForestZones?.group;
    if(!denseRoot)return denseNavTrees;
    denseRoot.updateWorldMatrix?.(true,true);
    for(const grove of denseRoot.children||[]){
      if(!grove?.isGroup||grove.visible===false)continue;
      for(const tree of grove.children||[]){
        if(!tree?.isGroup||tree.visible===false)continue;
        let trunk=null;
        tree.traverse?.(o=>{
          if(trunk||!o?.isMesh)return;
          const gp=o.geometry?.parameters||{};
          if(o.geometry?.type==='CylinderGeometry'&&Number(gp.height||0)>=6)trunk=o;
        });
        if(!trunk)continue; // ignora arbustos/folhagem: só troncos bloqueiam o corpo.
        tree.getWorldPosition(denseNavP);
        tree.getWorldScale(denseNavS);
        const scale=Math.max(Math.abs(denseNavS.x)||1,Math.abs(denseNavS.z)||1);
        denseNavTrees.push({x:denseNavP.x,z:denseNavP.z,r:Math.max(.38,.48*scale)});
      }
    }
    return denseNavTrees;
  }

  function navClearance(x,z,r=CFG.bodyRadius,ignoreTree=null){
    if(game.collides?.(x,z))return -999;
    let min=999;
    for(const t of treeList()){
      if(t===ignoreTree||t?.picked||t?.fallen||t?.falling||t?.converted)continue;
      const p=t.base||t.center;if(!p)continue;
      const tr=Math.max(.18,Number(t.radiusBottom)||.42);
      min=Math.min(min,Math.hypot(x-p.x,z-p.z)-(tr+r));
    }
    for(const t of refreshDenseNavTrees()){
      min=Math.min(min,Math.hypot(x-t.x,z-t.z)-(t.r+r));
    }
    return min;
  }

  function segmentClear(angle,distance,r,ignoreTree){
    const samples=Math.max(2,Math.ceil(distance/1.15));
    let minClear=999;
    for(let i=1;i<=samples;i++){
      const rr=distance*(i/samples);
      const x=root.position.x+Math.sin(angle)*rr;
      const z=root.position.z+Math.cos(angle)*rr;
      const c=navClearance(x,z,r,ignoreTree);
      if(c<0)return {ok:false,clear:c};
      minClear=Math.min(minClear,c);
    }
    return {ok:true,clear:minClear};
  }

  // V94B — matrizes originais das copas para o balanço físico provocado pelos passos.
  const foliageOriginal=[];
  if(forestFoliageMesh){
    const m=new THREE.Matrix4();
    for(let i=0;i<forestFoliageMesh.count;i++){forestFoliageMesh.getMatrixAt(i,m);foliageOriginal[i]=m.clone()}
  }
  const treeSways=new Map();
  const swayInv=new THREE.Matrix4(),swayWorld=new THREE.Matrix4(),swayPivot=new THREE.Matrix4(),swayRot=new THREE.Matrix4(),swayT1=new THREE.Matrix4(),swayT2=new THREE.Matrix4(),swayLocal=new THREE.Matrix4();
  function setSwayMatrix(mesh,index,original,base,axis,angle){
    if(!mesh||!original||index<0||index>=mesh.count)return;
    mesh.updateWorldMatrix(true,false);
    swayWorld.multiplyMatrices(mesh.matrixWorld,original);
    swayT1.makeTranslation(base.x,base.y,base.z);
    swayRot.makeRotationAxis(axis,angle);
    swayT2.makeTranslation(-base.x,-base.y,-base.z);
    swayPivot.copy(swayT1).multiply(swayRot).multiply(swayT2);
    swayWorld.premultiply(swayPivot);
    swayInv.copy(mesh.matrixWorld).invert();
    swayLocal.multiplyMatrices(swayInv,swayWorld);
    mesh.setMatrixAt(index,swayLocal);
  }
  function kickTreeSway(center,radius=20,power=1){
    const now=performance.now()/1000;
    for(const t of treeList()){
      if(!t||t.picked||t.fallen||t.falling||t.converted||!t.originalMatrix)continue;
      const p=t.base||t.center;if(!p)continue;
      const d=Math.hypot(p.x-center.x,p.z-center.z);if(d>radius)continue;
      const fall=1-d/radius,dx=p.x-center.x,dz=p.z-center.z,dl=Math.max(.001,Math.hypot(dx,dz));
      const axis=new THREE.Vector3(dz/dl,0,-dx/dl).normalize();
      const add=clamp((.018+.060*power)*fall,.006,.15);
      const prev=treeSways.get(t.index);
      treeSways.set(t.index,{tree:t,t:0,dur:1.2+power*.7,amp:clamp((prev?.amp||0)*.55+add,.006,.16),axis,phase:(prev?.phase??Math.random()*Math.PI*2),stamp:now});
    }
  }
  function updateTreeSway(dt){
    let trunkDirty=false,foliageDirty=false;
    for(const [idx,s] of treeSways){
      const t=s.tree;
      if(!t||t.picked||t.fallen||t.falling||t.converted){treeSways.delete(idx);continue}
      s.t+=dt;
      const envelope=Math.exp(-s.t*2.15),angle=Math.sin(s.t*10.5+s.phase)*s.amp*envelope;
      setSwayMatrix(forestTrunkMesh,idx,t.originalMatrix,t.base||t.center,s.axis,angle);trunkDirty=true;
      if(forestFoliageMesh){for(let a=0;a<3;a++){const fi=idx*3+a;if(foliageOriginal[fi]){setSwayMatrix(forestFoliageMesh,fi,foliageOriginal[fi],t.base||t.center,s.axis,angle*1.08);foliageDirty=true}}}
      if(s.t>=s.dur||Math.abs(angle)<.0005){
        if(forestTrunkMesh&&t.originalMatrix){forestTrunkMesh.setMatrixAt(idx,t.originalMatrix);trunkDirty=true}
        if(forestFoliageMesh){for(let a=0;a<3;a++){const fi=idx*3+a;if(foliageOriginal[fi]){forestFoliageMesh.setMatrixAt(fi,foliageOriginal[fi]);foliageDirty=true}}}
        treeSways.delete(idx);
      }
    }
    if(trunkDirty&&forestTrunkMesh)forestTrunkMesh.instanceMatrix.needsUpdate=true;
    if(foliageDirty&&forestFoliageMesh)forestFoliageMesh.instanceMatrix.needsUpdate=true;
  }

  // Tremor real da visão: aplicado só no instante do render e restaurado logo depois.
  let giantShake=0;
  const renderer=game.renderer;
  if(renderer&&!renderer.__giganteV94ShakePatched){
    const originalRender=renderer.render.bind(renderer),savePos=new THREE.Vector3(),saveQuat=new THREE.Quaternion(),rightV=new THREE.Vector3(),upV=new THREE.Vector3(),rollQ=new THREE.Quaternion();
    renderer.render=(sc,cam)=>{
      if(giantShake>.006&&cam===game.camera){
        savePos.copy(cam.position);saveQuat.copy(cam.quaternion);
        const a=giantShake,rx=(Math.random()-.5)*.035*a,ry=(Math.random()-.5)*.028*a,rz=(Math.random()-.5)*.006*a;
        rightV.set(1,0,0).applyQuaternion(cam.quaternion);upV.set(0,1,0).applyQuaternion(cam.quaternion);
        cam.position.addScaledVector(rightV,rx).addScaledVector(upV,ry);
        rollQ.setFromAxisAngle(new THREE.Vector3(0,0,1),rz);cam.quaternion.multiply(rollQ);
        originalRender(sc,cam);cam.position.copy(savePos);cam.quaternion.copy(saveQuat);return;
      }
      originalRender(sc,cam);
    };
    renderer.__giganteV94ShakePatched=true;
  }
  function kickShake(power){giantShake=Math.min(3.6,giantShake+Math.max(0,power||0))}
  function updateShake(dt){giantShake*=Math.exp(-dt*7.2);if(giantShake<.004)giantShake=0}

  function candidateTree(){
    let best=null,bestScore=Infinity,now=performance.now()/1000;
    for(const t of treeList()){
      if(!t||t.picked||t.fallen||t.falling||t.converted||(t.__giantAvoidUntil||0)>now)continue;
      const p=t.base||t.center;if(!p)continue;
      const d=Math.hypot(p.x-root.position.x,p.z-root.position.z);if(d<4.5||d>44)continue;
      const pd=Math.hypot(p.x-player.x,p.z-player.z);if(pd<4)continue;
      const score=d+pd*.045;if(score<bestScore){best=t;bestScore=score}
    }
    return best;
  }

  // V166B — camada tática SEGURA. Não altera spawn, animações, velocidades,
  // pathfinding V164, estados-base ou mecânica de dano do boss.
  const SMART_GIANT=Object.freeze({
    treeRangeMin:22,          // longa distância: prioriza árvore
    treeAbortRange:14,       // curta distância: abandona a árvore e luta
    treeMinPlayerDist:15,    // evita buscar árvore praticamente em cima do jogador
    treeMaxBossWalk:38       // alcance tático para achar munição sem cruzar o mapa
  });
  function candidateRangedTree(){
    let best=null,bestScore=Infinity,now=performance.now()/1000;
    const pdx=player.x-root.position.x,pdz=player.z-root.position.z;
    const playerD=Math.max(.001,Math.hypot(pdx,pdz)),pux=pdx/playerD,puz=pdz/playerD;
    for(const t of treeList()){
      if(!t||t.picked||t.fallen||t.falling||t.converted||(t.__giantAvoidUntil||0)>now)continue;
      const p=t.base||t.center;if(!p)continue;
      const gx=p.x-root.position.x,gz=p.z-root.position.z,d=Math.hypot(gx,gz);
      if(d<4.5||d>SMART_GIANT.treeMaxBossWalk)continue;
      const treePlayerD=Math.hypot(p.x-player.x,p.z-player.z);
      if(treePlayerD<SMART_GIANT.treeMinPlayerDist)continue;
      const ux=gx/Math.max(.001,d),uz=gz/Math.max(.001,d);
      const towardPlayer=Math.max(0,ux*pux+uz*puz);
      const closesGap=Math.max(0,playerD-treePlayerD);
      // Prefere árvore lateral/próxima do boss e pune árvores no caminho do jogador.
      const score=d + towardPlayer*9.0 + closesGap*2.4;
      if(score<bestScore){best=t;bestScore=score}
    }
    return best;
  }

  function blocked(x,z,r=CFG.bodyRadius,ignoreTree=null){
    return navClearance(x,z,r,ignoreTree)<0;
  }
  function steerStep(dx,dz,step,ignoreTree=null,clearance=CFG.bodyRadius){
    const d=Math.max(.001,Math.hypot(dx,dz));
    const desired=Math.atan2(dx/d,dz/d);
    const now=performance.now()/1000;
    if(now>navSideUntil)navSideBias=0;

    // Olha vários metros à frente. Isso evita escolher um passo que parece livre
    // agora, mas leva o corpo enorme direto para o próximo tronco.
    const lookAhead=clamp(Math.max(step*8,4.8),4.8,8.5);
    const baseOffsets=[0,.18,-.18,.34,-.34,.52,-.52,.72,-.72,.96,-.96,1.22,-1.22,1.52,-1.52,1.90,-1.90,2.35,-2.35];
    const offsets=navSideBias===0?baseOffsets:baseOffsets.slice().sort((a,b)=>{
      const pa=(Math.sign(a)===navSideBias?-0.12:0),pb=(Math.sign(b)===navSideBias?-0.12:0);
      return (Math.abs(a)+pa)-(Math.abs(b)+pb);
    });

    let best=null,bestScore=Infinity;
    for(const off of offsets){
      const aa=desired+off;
      const immediateX=root.position.x+Math.sin(aa)*step;
      const immediateZ=root.position.z+Math.cos(aa)*step;
      const immediateClear=navClearance(immediateX,immediateZ,clearance,ignoreTree);
      if(immediateClear<0)continue;

      const probe=segmentClear(aa,lookAhead,clearance,ignoreTree);
      if(!probe.ok)continue;

      const futureX=root.position.x+Math.sin(aa)*lookAhead;
      const futureZ=root.position.z+Math.cos(aa)*lookAhead;
      const remaining=Math.hypot((root.position.x+dx)-futureX,(root.position.z+dz)-futureZ);
      const sidePenalty=Math.abs(off)*1.15;
      const biasBonus=(navSideBias&&Math.sign(off)===navSideBias)?.18:0;
      const clearanceBonus=Math.min(2.4,Math.max(0,probe.clear))*.34;
      const score=remaining*.07+sidePenalty-clearanceBonus-biasBonus;
      if(score<bestScore){bestScore=score;best={aa,off}}
    }

    if(best){
      root.position.x+=Math.sin(best.aa)*step;
      root.position.z+=Math.cos(best.aa)*step;
      if(Math.abs(best.off)>.12){navSideBias=Math.sign(best.off);navSideUntil=now+1.15}
      return true;
    }

    // Se a rota inteira estiver bloqueada, tenta um passo lateral curto e consistente
    // antes de cair no anti-stuck antigo. Não teleporta e não altera o estado do boss.
    const side=navSideBias||1;
    for(const sign of [side,-side]){
      const aa=desired+sign*Math.PI*.5;
      const rr=Math.max(step*.75,.05);
      const nx=root.position.x+Math.sin(aa)*rr,nz=root.position.z+Math.cos(aa)*rr;
      if(navClearance(nx,nz,clearance*.92,ignoreTree)>=0){
        root.position.x=nx;root.position.z=nz;navSideBias=sign;navSideUntil=now+1.0;return true;
      }
    }
    return false;
  }
  function emergencyUnstuck(dx,dz,step,ignoreTree,stuckFor){
    const clearance=CFG.bodyRadius*(stuckFor>CFG.hardUnstuckSeconds ? .50 : .70);
    if(steerStep(dx,dz,Math.max(step,.16),ignoreTree,clearance))return true;
    const d=Math.max(.001,Math.hypot(dx,dz)),base=Math.atan2(dx/d,dz/d),radii=stuckFor>CFG.hardUnstuckSeconds?[.28,.48,.72,1.0]:[.20,.34,.52];
    for(const rr of radii){for(let i=0;i<16;i++){const aa=base+(i%2?1:-1)*Math.ceil(i/2)*(Math.PI/8),nx=root.position.x+Math.sin(aa)*rr,nz=root.position.z+Math.cos(aa)*rr;if(!blocked(nx,nz,clearance,ignoreTree)){root.position.x=nx;root.position.z=nz;return true}}}
    return false;
  }

  // ------------------------------------------------------------
  // Árvore arrancada/projétil.
  // ------------------------------------------------------------
  let targetTree=null,heldTree=null,treeFlight=null;
  function makeTreeProxy(t){
    const h=clamp(Number(t?.height)||12,8,17),r=clamp(Number(t?.radiusBottom)||.55,.38,.85);
    const g=new THREE.Group();g.name='Gigante_UprootedTree';
    const trunk=new THREE.Mesh(new THREE.CylinderGeometry(r*.55,r,h,10),wood);trunk.castShadow=true;trunk.receiveShadow=true;g.add(trunk);
    for(let i=0;i<5;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(2.5-i*.32,h*.24,8),M(0x1f2b24));c.position.y=h*.13+i*h*.11;c.castShadow=true;g.add(c)}
    g.userData.h=h;g.userData.r=r;scene.add(g);return g;
  }
  function takeTreeFromForest(){
    if(!targetTree||heldTree)return;
    const p=targetTree.base||targetTree.center;
    heldTree=makeTreeProxy(targetTree);heldTree.position.set(p.x,game.groundY(p.x,p.z)+heldTree.userData.h*.5,p.z);
    hideInstance(forestTrunkMesh,targetTree.index);if(forestFoliageMesh)for(let a=0;a<3;a++)hideInstance(forestFoliageMesh,targetTree.index*3+a);
    targetTree.vineVisual?.removeFromParent?.();targetTree.vineVisual=null;targetTree.picked=true;targetTree.converted=true;targetTree.fallen=true;targetTree.falling=false;
    emit(new THREE.Vector3(p.x,game.groundY(p.x,p.z),p.z),95,8,EARTH);emit(new THREE.Vector3(p.x,game.groundY(p.x,p.z)+2,p.z),55,7,LEAF);
  }
  const tmpA=new THREE.Vector3(),tmpB=new THREE.Vector3(),tmpAxis=new THREE.Vector3(),Y=new THREE.Vector3(0,1,0);
  function updateHeldTree(){
    if(!heldTree)return;
    B.Hand_R.getWorldPosition(tmpA);B.Hand_L.getWorldPosition(tmpB);
    tmpAxis.copy(tmpB).sub(tmpA);if(tmpAxis.lengthSq()<.01)tmpAxis.set(Math.cos(root.rotation.y),.12,-Math.sin(root.rotation.y));tmpAxis.normalize();
    const mid=tmpA.clone().lerp(tmpB,.5);mid.y+=.45;
    heldTree.position.lerp(mid,.46);heldTree.quaternion.slerp(new THREE.Quaternion().setFromUnitVectors(Y,tmpAxis),.35);
  }
  function launchTree(){
    if(!heldTree)return;
    const m=heldTree;heldTree=null;
    const direct=new THREE.Vector3(player.x,game.groundY(player.x,player.z)+1.0,player.z);
    const directD=m.position.distanceTo(direct);
    const flightT=clamp(directD/28,.65,1.55);
    // Prevê para onde o jogador provavelmente estará. Quanto mais longe, maior a antecipação,
    // mas com limite de 8 m para continuar justo e permitir esquiva/mudança de direção.
    const leadT=clamp(flightT*.88,.30,1.18),pred=predictedPlayerXZ(leadT,8);
    const target=new THREE.Vector3(pred.x,game.groundY(pred.x,pred.z)+1.0,pred.z);
    const d=m.position.distanceTo(target),t=clamp(d/28,.65,1.55),v=target.clone().sub(m.position).divideScalar(t);v.y+=.5*15*t;
    const axis=v.clone().normalize();m.quaternion.setFromUnitVectors(Y,axis);
    treeFlight={m,v,axis,roll:4.1,life:0,hit:false,h:m.userData.h||12,predictedX:pred.x,predictedZ:pred.z};
  }
  function segmentPointDistance3(a,b,p){const ab=b.clone().sub(a),den=ab.lengthSq();const t=den>.0001?clamp(p.clone().sub(a).dot(ab)/den,0,1):0;return p.distanceTo(a.clone().addScaledVector(ab,t))}
  function updateTreeFlight(dt){
    const f=treeFlight;if(!f)return;f.life+=dt;
    const from=f.m.position.clone();f.v.y-=15*dt;f.m.position.addScaledVector(f.v,dt);f.m.rotateOnAxis(Y,f.roll*dt);
    const playerPoint=new THREE.Vector3(player.x,game.groundY(player.x,player.z)+1.0,player.z);
    const treeAxis=Y.clone().applyQuaternion(f.m.quaternion).normalize();
    const ta=f.m.position.clone().addScaledVector(treeAxis,-f.h*.5);
    const tb=f.m.position.clone().addScaledVector(treeAxis, f.h*.5);
    const currentTreeDistance=segmentPointDistance3(ta,tb,playerPoint);
    const sweptCenterDistance=segmentPointDistance3(from,f.m.position,playerPoint);
    if(!f.hit&&Math.min(currentTreeDistance,sweptCenterDistance)<2.1){f.hit=true;damagePlayer(CFG.damage.tree,'Gigante da Névoa • Árvore arremessada','gigante-tree')}
    const gy=game.groundY(f.m.position.x,f.m.position.z);
    if(f.m.position.y<=gy+.35||f.life>4){f.m.position.y=gy+.35;emit(new THREE.Vector3(f.m.position.x,gy,f.m.position.z),150,11,EARTH);emit(new THREE.Vector3(f.m.position.x,gy,f.m.position.z),90,10,DUST);setTimeout(()=>f.m.removeFromParent?.(),12000);treeFlight=null}
  }

  // ------------------------------------------------------------
  // Estado / combate.
  // ------------------------------------------------------------
  let state=STATES.HIDDEN,stateT=0,prevStateT=0,scheduled=false,engaged=false,dead=false,ai=true;
  let hp=CFG.hp,heel=0,limp=false,hurtSide='R',enraged=false,headV=false;
  let walkPhase=-.6,walkTarget=null,idleT=0,lastAttack='',lastSwing=null,lastTreeAt=-Infinity,lastMeleeAt=-Infinity,deathRewarded=false;
  let stuckTime=0,lastMoveX=0,lastMoveZ=0;
  let droppedWeapon=false,weaponVel=0;

  // V167B — memória curta do movimento do jogador para previsão de arremesso.
  // Não altera a locomoção do Gigante; só a decisão/mira do ataque com árvore.
  let playerTrackX=player.x,playerTrackZ=player.z,playerVelX=0,playerVelZ=0;
  function updatePlayerMotion(dt){
    if(!(dt>0))return;
    const vx=(player.x-playerTrackX)/dt,vz=(player.z-playerTrackZ)/dt;
    playerTrackX=player.x;playerTrackZ=player.z;
    const cap=7.5,mag=Math.hypot(vx,vz),k=1-Math.exp(-dt*7.0);
    const svx=mag>cap?vx*(cap/mag):vx,svz=mag>cap?vz*(cap/mag):vz;
    playerVelX+=(svx-playerVelX)*k;playerVelZ+=(svz-playerVelZ)*k;
  }
  function predictedPlayerXZ(seconds,maxLead=8){
    const leadX=playerVelX*seconds,leadZ=playerVelZ*seconds,len=Math.hypot(leadX,leadZ);
    const scale=len>maxLead?maxLead/Math.max(.001,len):1;
    return {x:player.x+leadX*scale,z:player.z+leadZ*scale};
  }

  function currentDay(){return Math.max(1,Math.floor(Number(game.dayNight?.day)||1))}
  function isNight(){const h=Number(game.dayNight?.hour)||0;return h>=19||h<5.8}
  function ignisDefeated(){const b=window.gameIgnis;if(!b)return true;return b.state==='DEAD'||Number(b.hp)<=0}
  function scheduleReady(){return !dead&&currentDay()>=Math.max(1,Math.floor(Number(CFG.spawnNight)||10))&&isNight()&&ignisDefeated()}
  function wp(o){return o.getWorldPosition(new THREE.Vector3())}
  function faceTo(x,z,dt,speed=CFG.turnSpeed){let d=Math.atan2(x-root.position.x,z-root.position.z)-root.rotation.y;d=wrap(d);root.rotation.y+=clamp(d,-speed*dt,speed*dt)}
  function distToPlayer(){return Math.hypot(player.x-root.position.x,player.z-root.position.z)}
  function damagePlayer(amount,label,id){return window.gameZombie?.hurtPlayer?.(amount,label,id)??false}


  // V166B — passos do Gigante. Clips curtos derivados EXATAMENTE dos dois áudios
  // enviados pelo usuário; HTMLAudio é usado para ser robusto em file:// e mobile.
  const GIANT_STEP_NEAR_SRC='data:audio/mpeg;base64,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VVVVVVVVVVVVVVVVVVVVVVVV//uSxOwDl3jJBG9vQlNnnx4B7mi4VVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVTPlW+MTdF08qhI7fF84OH80/IYyaC0w9CszV4GVBC1MG0AksyUY5Zs8hc7do0XcxNE5gA3ZAxxcqCi340JAQIKCSqDL8F+lMXAbZcrRI200tEYAWISQXFgoQTD0DVzNRLjFuUPky0xFJqRVMzJ13dmHeZS3R14Fq2bU7LozDT6t2eCB35mp+WxqZoJqbpLd61iwFhI8WD8KgIChICg26BQqMBkSPARIKAWLAVDBiGD/////qUxBTUUzLjEwMFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7ksSTA9Z4sMYPd0CAAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVU=';
  const GIANT_STEP_FAR_SRC='data:audio/mpeg;base64,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3HOYpBj4NsXEcxpk1Lcqy4k9SCjaI3qxKVcggWqu+MiDAYQOItufviRp//twxOsCEHWQ6u2lCYJILxqJthnoiyLqp83KNeKfNlnfKfKfKp42f6mWuatE4u8r/NInCj1JF4kaVFPlO255OLxI3EitmnjUTilo1c0+S1olQPhIcsEkhz/rREhwTNVMQU1FMy4xMDBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVf/7csS+A9QtcKINvMvIAAA0gAAABFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV';
  const giantStepAudio={unlocked:false,near:[],far:[],ni:0,fi:0};
  function makeGiantStepPool(src){
    const out=[];for(let i=0;i<4;i++){const a=new Audio(src);a.preload='auto';a.playsInline=true;out.push(a)}return out;
  }
  giantStepAudio.near=makeGiantStepPool(GIANT_STEP_NEAR_SRC);
  giantStepAudio.far=makeGiantStepPool(GIANT_STEP_FAR_SRC);
  function unlockGiantStepAudio(){
    if(giantStepAudio.unlocked)return;
    giantStepAudio.unlocked=true;
    for(const a of [giantStepAudio.near[0],giantStepAudio.far[0]]){
      try{a.volume=0;a.currentTime=0;const p=a.play();if(p?.then)p.then(()=>{a.pause();a.currentTime=0;a.volume=1}).catch(()=>{a.volume=1})}catch{a.volume=1}
    }
  }
  ['pointerdown','mousedown','touchstart','keydown'].forEach(ev=>window.addEventListener(ev,unlockGiantStepAudio,{capture:true,passive:true}));
  function smoothAudio(a,b,x){const q=clamp((x-a)/Math.max(.001,b-a),0,1);return q*q*(3-2*q)}
  function playGiantStep(power=1){
    const d=distToPlayer();if(d>125)return;
    const nearW=1-smoothAudio(30,58,d);
    const farW=smoothAudio(28,55,d)*(1-smoothAudio(95,125,d));
    const rate=limp?.90:(enraged?1.04:1.0);
    const play=(pool,key,vol)=>{
      if(vol<.015)return;
      const idx=giantStepAudio[key]++%pool.length,a=pool[idx];
      try{a.pause();a.currentTime=0;a.volume=clamp(vol*power,0,1);a.playbackRate=rate;const p=a.play();if(p?.catch)p.catch(()=>{})}catch{}
    };
    play(giantStepAudio.near,'ni',.92*nearW);
    play(giantStepAudio.far,'fi',.88*farW);
  }

  function stateSeq(){return SQ[state]||null}
  function go(n){
    if(dead&&n!==STATES.DEAD)return;
    state=n;stateT=0;prevStateT=0;idleT=0;headV=n===STATES.HEAD_VULNERABLE;
    if(n===STATES.STOMP)warn('CUIDADO: PISÃO!',950);
    else if(n===STATES.GROUND_SMASH)warn('CUIDADO: IMPACTO NO CHÃO!',1100);
    else if(n===STATES.AIM_TREE)warn('O GIGANTE VAI ARREMESSAR!',1300);
    if([STATES.WALK,STATES.LIMP,STATES.REVEAL,STATES.SEARCH_TREE].includes(n)){walkPhase=-.6;stuckTime=0;lastMoveX=root.position.x;lastMoveZ=root.position.z}
    if(n===STATES.SEARCH_TREE){
      const now=performance.now()/1000;
      const valid=t=>!!(t&&!t.picked&&!t.fallen&&!t.falling&&!t.converted&&(t.__giantAvoidUntil||0)<=now);
      // Mantém a árvore que a camada tática acabou de escolher. A V166 descartava essa
      // escolha aqui e pegava outra árvore qualquer, fazendo o boss "esquecer" a decisão.
      if(!valid(targetTree))targetTree=(distToPlayer()>=SMART_GIANT.treeRangeMin?candidateRangedTree():null)||candidateTree();
      if(!targetTree){lastTreeAt=now;return go(STATES.WALK)}
      const p=targetTree.base||targetTree.center;walkTarget={x:p.x,z:p.z,stop:5.2};
    }
    if(n===STATES.REVEAL)walkTarget={x:player.x,z:player.z,stop:27};
    if(n===STATES.WALK||n===STATES.LIMP)walkTarget=null;
    if(n===STATES.GETTING_UP){heel=0;limp=false;headV=false}
    if(n===STATES.DEATH){dead=true;headV=false}
    updateHud(true);
  }

  function restoreClub(){
    try{
      if(club.parent!==SW){club.removeFromParent?.();SW.add(club);club.position.set(0,0,0);club.rotation.set(0,0,0);}
      club.visible=true;droppedWeapon=false;weaponVel=0;
    }catch(_){}
  }
  function removeGiantAfterDeath(){
    root.visible=false;
    hud.classList.remove('show');
    warning.classList.remove('show');
    warning.textContent='';
    if(heldTree){heldTree.removeFromParent?.();heldTree=null;}
    if(treeFlight){treeFlight.m?.removeFromParent?.();treeFlight=null;}
    club.visible=false;
    giantMistMat.opacity=0;
    for(let i=0;i<giantMistCount;i++)giantMistPositions[i*3+1]=-999;
    giantMistGeo.attributes.position.needsUpdate=true;
  }

  function spawn(force=false){
    if(scheduled||dead)return false;if(!force&&!scheduleReady())return false;
    restoreClub();
    scheduled=true;engaged=false;root.visible=true;hp=CFG.hp;heel=0;limp=false;enraged=false;headV=false;dead=false;deathRewarded=false;droppedWeapon=false;
    const yaw=player.yaw||0,fx=-Math.sin(yaw),fz=-Math.cos(yaw),side=(Math.random()-.5)*10;
    root.position.set(player.x+fx*CFG.spawnDistance+fz*side,0,player.z+fz*CFG.spawnDistance-fx*side);root.position.y=game.groundY(root.position.x,root.position.z);root.rotation.y=Math.atan2(player.x-root.position.x,player.z-root.position.z);
    giantMistClock=0;giantMistMat.opacity=.48;
    go(STATES.REVEAL);hud.classList.add('show');warn('ALGO ENORME SE MOVE NA NÉVOA',1800);
    if(status)status.textContent=`Noite ${currentDay()} • o Gigante da Névoa surgiu`;
    window.dispatchEvent(new CustomEvent('game:boss-spawned',{detail:{id:'gigante-nevoa',name:'GIGANTE DA NÉVOA',day:currentDay(),scheduled:!force}}));
    return true;
  }

  function updateHud(force=false){
    if(!scheduled||!root.visible){hud.classList.remove('show');return}
    hud.classList.add('show');fill.style.width=`${clamp(hp/CFG.hp,0,1)*100}%`;
    if(dead)meta.textContent='DERROTADO';
    else if(headV)meta.textContent='CABEÇA VULNERÁVEL • ATAQUE AGORA';
    else if(state===STATES.FALLING||state===STATES.DOWNED||state===STATES.RECOVERING||state===STATES.GETTING_UP)meta.textContent='O GIGANTE CAIU';
    else meta.textContent=`CALCANHARES ${Math.round(heel)}/${CFG.heelMax}${limp?' • MANCANDO':''}${enraged?' • FÚRIA':''}`;
  }

  function walkPose(dt,mul=1){
    const baseSpeed=(limp?CFG.limpSpeed:CFG.walkSpeed)*(enraged?CFG.enragedSpeedMultiplier:1)*mul*(difficulty().giantSpeed||1);
    const gait=1.90*(enraged?1.12:1),oldPhase=walkPhase;walkPhase+=gait*dt;
    const oldBucket=Math.floor(oldPhase/Math.PI),newBucket=Math.floor(walkPhase/Math.PI);
    const s=Math.sin(walkPhase),A=.48,AL=limp&&hurtSide==='L'?A*.52:A,AR=limp&&hurtSide==='R'?A*.52:A,aL=AL*Math.cos(walkPhase),aR=-AR*Math.cos(walkPhase),kL=Math.max(0,-s)*1.0+.08,kR=Math.max(0,s)*1.0+.08;
    const pose=F({TL:[-aL],KL:[kL],AL:[aL-kL],TR:[-aR],KR:[kR],AR:[aR-kR],dy:[-.18*Math.abs(s)],P:[0,-.08*Math.cos(walkPhase),limp?(hurtSide==='R'?.08:-.08)*s:0],Ch:[0,.15*Math.cos(walkPhase)],S1:[.12+.04*Math.abs(s)],UL:[-.75*aR],UR:[-.42*aL,0,-.15],Hd:[.12,-.08*Math.cos(walkPhase)]});
    let tx=player.x,tz=player.z,stop=CFG.stopRange,ignore=null;
    if(state===STATES.REVEAL&&walkTarget){tx=walkTarget.x;tz=walkTarget.z;stop=walkTarget.stop}
    if(state===STATES.SEARCH_TREE){
      if(!targetTree||targetTree.picked||targetTree.fallen||targetTree.falling||targetTree.converted){go(STATES.SEARCH_TREE);return pose}
      const treePos=targetTree.base||targetTree.center;
      const playerBossDist=distToPlayer();
      const treePlayerDist=treePos?Math.hypot(treePos.x-player.x,treePos.z-player.z):999;
      if(playerBossDist<SMART_GIANT.treeAbortRange||treePlayerDist<SMART_GIANT.treeMinPlayerDist){
        targetTree.__giantAvoidUntil=performance.now()/1000+3;targetTree=null;walkTarget=null;go(STATES.IDLE);return pose;
      }
      if(walkTarget){tx=walkTarget.x;tz=walkTarget.z;stop=walkTarget.stop;ignore=targetTree}
    }
    // Use real (delayed) velocity estimates to lead a running player on Hard.
    const brain=difficulty(),smartChase=brain.tier>=2&&(state===STATES.WALK||state===STATES.LIMP);
    if(smartChase&&Math.hypot(tx-root.position.x,tz-root.position.z)>9){
      const p=predictedPlayerXZ(brain.leadSeconds,brain.tier===3?4.0:2.6);tx=p.x;tz=p.z;
    }
    const realTargetX=tx,realTargetZ=tz;
    const smartNav=brain.tier>=2&&(smartChase||state===STATES.SEARCH_TREE);
    const navNow=performance.now()/1000;
    if(smartNav){
      if(tacticalPlan&&(
          navNow-tacticalPlanTime>4.0||
          Math.hypot(tacticalPlanTargetX-realTargetX,tacticalPlanTargetZ-realTargetZ)>10
      ))tacticalPlan=null;
      while(tacticalPlan?.length&&Math.hypot(tacticalPlan[0].x-root.position.x,tacticalPlan[0].z-root.position.z)<2.25)tacticalPlan.shift();
      if(!tacticalPlan?.length)tacticalPlan=null;
      if(stuckTime>.55&&navNow-tacticalPlanTime>1.4){
        tacticalPlanTime=navNow;tacticalPlanTargetX=realTargetX;tacticalPlanTargetZ=realTargetZ;
        tacticalPlan=planGiantDetour(realTargetX,realTargetZ);
      }
      if(tacticalPlan?.length){tx=tacticalPlan[0].x;tz=tacticalPlan[0].z;}
    }else tacticalPlan=null;
    const dx=tx-root.position.x,dz=tz-root.position.z,d=Math.hypot(dx,dz);faceTo(tx,tz,dt,enraged?2.0:CFG.turnSpeed);
    let moved=false;
    const waypointStop=tacticalPlan?.length&&smartNav?1.65:stop;
    if(d>waypointStop){
      const step=Math.min(baseSpeed*dt,Math.max(0,d-waypointStop));
      const bx=root.position.x,bz=root.position.z;
      moved=steerStep(dx,dz,step,ignore);
      const movedDist=Math.hypot(root.position.x-bx,root.position.z-bz);
      if(!moved||movedDist<.0015)stuckTime+=dt;else stuckTime=Math.max(0,stuckTime-dt*2.8);
      if(stuckTime>.42&&!moved)moved=emergencyUnstuck(dx,dz,step,ignore,stuckTime);
      if(moved){lastMoveX=root.position.x;lastMoveZ=root.position.z}
      if(stuckTime>CFG.stuckRetargetSeconds&&state===STATES.SEARCH_TREE&&targetTree){
        targetTree.__giantAvoidUntil=performance.now()/1000+6;targetTree=null;stuckTime=0;go(STATES.SEARCH_TREE);return pose;
      }
      if(stuckTime>CFG.hardUnstuckSeconds&&state!==STATES.SEARCH_TREE){emergencyUnstuck(dx,dz,Math.max(step,.22),ignore,stuckTime+1);stuckTime=.6}
    }else stuckTime=0;
    root.position.y=game.groundY(root.position.x,root.position.z);

    // Cada passada pesada do gigante transmite a pancada ao chão e à floresta.
    if(oldBucket!==newBucket&&state!==STATES.REVEAL){
      const side=(newBucket&1)?'R':'L',right=new THREE.Vector3(Math.cos(root.rotation.y),0,-Math.sin(root.rotation.y)),forward=new THREE.Vector3(Math.sin(root.rotation.y),0,Math.cos(root.rotation.y));
      const p=root.position.clone().addScaledVector(right,side==='R'?-1.25:1.25).addScaledVector(forward,.35);p.y=game.groundY(p.x,p.z);
      emit(p,30,5.5,DUST);kickShake(limp?.20:.32);kickTreeSway(p,limp?14:19,limp?.48:.72);playGiantStep(limp?.86:1);
    }

    const nd=Math.hypot((smartNav?realTargetX:tx)-root.position.x,(smartNav?realTargetZ:tz)-root.position.z);
    if(nd<=stop){
      if(state===STATES.REVEAL)go(STATES.REVEAL_LOOK);
      else if(state===STATES.SEARCH_TREE)go(STATES.GRAB_TREE);
      else go(STATES.IDLE);
    }
    return pose;
  }

  function nearestSeqEvents(seq,from,to){let t=0;for(const k of seq){t+=k[0];if(k[2]&&t>from&&t<=to)event(k[2])}}
  function impactAt(p,r,damage,label,id){window.gameConstruction?.impactAt?.(p.x,p.z,r,damage);const d=Math.hypot(player.x-p.x,player.z-p.z);if(d<=r&&(!window.FlorestaAI||window.FlorestaAI.clear(p,player,.4)))damagePlayer(damage,label,id)}
  function event(n){
    if(n==='ROAR'){warn('ROOOAAAR',650);return}
    if(n==='WEAPON_IMPACT'){const p=wp(B.ClubTip);p.y=game.groundY(p.x,p.z);emit(p,120,11,EARTH);emit(p,70,10,DUST);kickShake(state===STATES.GROUND_SMASH?2.25:1.15);kickTreeSway(p,state===STATES.GROUND_SMASH?30:21,state===STATES.GROUND_SMASH?1.8:1.0);impactAt(p,5.2,state===STATES.GROUND_SMASH?CFG.damage.smash:CFG.damage.vertical,'Gigante da Névoa • Clava','gigante-club');return}
    if(n==='SWEEP'){const f=new THREE.Vector3(Math.sin(root.rotation.y),0,Math.cos(root.rotation.y));const p=root.position.clone().addScaledVector(f,6);p.y=game.groundY(p.x,p.z);emit(p,90,12,DUST);kickShake(.72);kickTreeSway(p,18,.7);impactAt(p,7.4,CFG.damage.sweep,'Gigante da Névoa • Varredura','gigante-sweep');return}
    if(n==='STOMP'){const p=wp(B.Foot_R);p.y=game.groundY(p.x,p.z);emit(p,145,12,EARTH);emit(p,90,9,DUST);kickShake(2.65);kickTreeSway(p,34,2.15);playGiantStep(1.25);impactAt(p,5.0,CFG.damage.stomp,'Gigante da Névoa • Pisão','gigante-stomp');return}
    if(n==='KNEE_IMPACT'){const p=wp(B.Calf_R);p.y=game.groundY(p.x,p.z);emit(p,100,11,DUST);kickShake(1.35);kickTreeSway(p,24,1.25);return}
    if(n==='BODY_FALL'){const p=wp(B.Chest);p.y=game.groundY(p.x,p.z);emit(p,190,15,DUST);kickShake(3.1);kickTreeSway(p,38,2.5);if(state===STATES.DEATH||state===STATES.FALLING)impactAt(p,6.5,CFG.damage.bodyFall,'Gigante da Névoa • Queda','gigante-fall');return}
    if(n==='TREE_GRAB'){takeTreeFromForest();return}
    if(n==='TREE_CRACK'){if(targetTree){const p=targetTree.base||targetTree.center;emit(new THREE.Vector3(p.x,game.groundY(p.x,p.z),p.z),150,10,EARTH);emit(new THREE.Vector3(p.x,game.groundY(p.x,p.z)+2,p.z),70,8,LEAF)}return}
    if(n==='TREE_UPROOT'){takeTreeFromForest();return}
    if(n==='TREE_THROW'){launchTree();return}
    if(n==='WEAPON_DROP'){if(club.parent===SW){const p=wp(club),q=club.getWorldQuaternion(new THREE.Quaternion());SW.remove(club);scene.add(club);club.position.copy(p);club.quaternion.copy(q);droppedWeapon=true;weaponVel=0}return}
  }


  // V182: tactical utility AI. The boss still obeys the original hit boxes,
  // attack animations, cooldowns and collision. No teleporting or wall vision.
  let tacticalLast='';let tacticalPlan=null;let tacticalPlanTime=0;
  let tacticalPlanTargetX=0,tacticalPlanTargetZ=0;
  const difficulty=()=>window.gameDifficulty?.preset||{tier:1,giantSpeed:1,giantRecovery:1,leadSeconds:0};
  function chooseHardAttack(d,now){
    const level=difficulty();
    const dx=player.x-root.position.x,dz=player.z-root.position.z;
    const velocity=Math.hypot(playerVelX,playerVelZ);
    const away=(playerVelX*dx+playerVelZ*dz)/Math.max(.001,d);
    const sideways=Math.abs((playerVelX*dz-playerVelZ*dx)/Math.max(.001,d));
    const options=[];
    const validClose=now-lastMeleeAt>=CFG.meleeCooldown*level.giantRecovery*(enraged?.72:1);
    if(d>CFG.stopRange+1.2)options.push({name:'approach',score:10+Math.min(12,d*.21)+(away>1.5?2:0)});
    if(validClose&&d<7.9){
      options.push({name:'sweep',state:STATES.MELEE_SWEEP,score:12+sideways*1.25+(d>=5?4:0)});
      options.push({name:'vertical',state:STATES.MELEE_VERTICAL,score:13+(velocity<2?5:0)+(d<5?3:0)});
      if(d<6.4)options.push({name:'smash',state:STATES.GROUND_SMASH,score:13+(away>1?4:0)+(velocity>4?3:0)});
      if(d<5.4)options.push({name:'stomp',state:STATES.STOMP,score:13+(sideways>2.3?5:0)+(d<3.4?6:0)});
    }
    const treeReady=d>SMART_GIANT.treeRangeMin&&d<CFG.treeMaxDistance&&
      now-lastTreeAt>=CFG.longRangeTreeCooldown*level.giantRecovery*(d>35?.85:1);
    if(treeReady)options.push({name:'tree',score:21+(d>34?8:0)+(away>2?7:0)});
    if(!options.length)return go(STATES.IDLE);
    // Hysteresis / anti-spam: not the same move again and again.
    for(const opt of options){if(opt.name===tacticalLast)opt.score-=8;
      if(opt.name==='approach'&&d<CFG.stopRange+2)opt.score-=12;}
    options.sort((a,b)=>b.score-a.score);
    let pick=options[0];
    if(pick.name==='tree'){
      const tree=candidateRangedTree()||candidateTree();
      if(tree){targetTree=tree;lastTreeAt=now;lastAttack='tree';tacticalLast='tree';return go(STATES.SEARCH_TREE)}
      pick=options.find(x=>x.name==='approach'||x.state)||{name:'approach'};
    }
    if(pick.state){lastMeleeAt=now;tacticalLast=pick.name;lastAttack=pick.name;return go(pick.state)}
    tacticalLast='approach';return go(limp?STATES.LIMP:STATES.WALK);
  }

  // Short A* detours when the giant repeatedly runs into a tree or a wall.
  // The grid is local (max 21x21), never recomputed every animation frame.
  function planGiantDetour(tx,tz){
    const cell=3.3,lim=10,originX=root.position.x,originZ=root.position.z;
    const map=new Map(),nodes=new Map();const key=(i,j)=>i+','+j;
    const blockedNode=(i,j)=>{
      const k=key(i,j);if(map.has(k))return map.get(k);
      const x=originX+i*cell,z=originZ+j*cell;
      const result=game.collides?.(x,z)||navClearance(x,z,CFG.bodyRadius*.89)<0;
      map.set(k,result);return result;
    };
    const goalI=clamp(Math.round((tx-originX)/cell),-lim,lim),goalJ=clamp(Math.round((tz-originZ)/cell),-lim,lim);
    const open=[{i:0,j:0,g:0,f:Math.hypot(goalI,goalJ),parent:null}],closed=new Set();
    let winner=null,best=Infinity;
    const directions=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
    let iter=0;
    while(open.length&&iter++<190){
      open.sort((a,b)=>a.f-b.f);const n=open.shift(),k=key(n.i,n.j);
      if(closed.has(k))continue;closed.add(k);
      const delta=Math.hypot(goalI-n.i,goalJ-n.j);
      if(delta<best){winner=n;best=delta;}
      if(delta<1)break;
      for(const [di,dj] of directions){const i=n.i+di,j=n.j+dj;if(Math.abs(i)>lim||Math.abs(j)>lim)continue;
        const nk=key(i,j);if(closed.has(nk)||blockedNode(i,j))continue;
        if(di&&dj&&(blockedNode(n.i+di,n.j)||blockedNode(n.i,n.j+dj)))continue;
        const g=n.g+(di&&dj?1.414:1),f=g+Math.hypot(goalI-i,goalJ-j);
        const prev=nodes.get(nk);if(prev&&prev<=g)continue;
        nodes.set(nk,g);open.push({i,j,g,f,parent:n});
      }
    }
    if(!winner||Math.hypot(winner.i,winner.j)<1.2)return null;
    const steps=[];for(let n=winner;n?.parent;n=n.parent){steps.push({x:originX+n.i*cell,z:originZ+n.j*cell});}
    steps.reverse();
    // Keep the turn points, not dozens of tiny waypoints.
    return steps.filter((p,i)=>i%2===0||i===steps.length-1).slice(0,15);
  }

  function chooseAttack(){
    const d=distToPlayer(),now=performance.now()/1000;
    // V258: não iniciar golpe corpo a corpo com uma parede entre os dois.
    if(d<10&&window.FlorestaAI&&!window.FlorestaAI.clear(root.position,player,1.1))return go(limp?STATES.LIMP:STATES.WALK);
    if(difficulty().tier>=2)return chooseHardAttack(d,now);
    // Longe: árvore é a prioridade. Quanto mais distante, menor o tempo para tentar outro arremesso.
    if(d>=SMART_GIANT.treeRangeMin&&d<CFG.treeMaxDistance){
      const farFactor=clamp((d-SMART_GIANT.treeRangeMin)/Math.max(1,CFG.treeMaxDistance-SMART_GIANT.treeRangeMin),0,1);
      const rangedCooldown=CFG.longRangeTreeCooldown*(1-.24*farFactor);
      if(now-lastTreeAt>=rangedCooldown){
        const t=candidateRangedTree()||candidateTree();
        if(t){targetTree=t;lastTreeAt=now;lastAttack='tree';return go(STATES.SEARCH_TREE)}
      }
    }
    // Médio: aproxima usando EXATAMENTE a navegação V164 já aprovada.
    if(d>CFG.stopRange+1.0)return go(limp?STATES.LIMP:STATES.WALK);
    // Perto: somente corpo a corpo.
    if(now-lastMeleeAt<CFG.meleeCooldown*(enraged?.72:1))return go(STATES.IDLE);
    lastMeleeAt=now;
    const pool=[];if(lastAttack!=='vertical')pool.push(STATES.MELEE_VERTICAL);if(lastAttack!=='sweep')pool.push(STATES.MELEE_SWEEP);if(d<5.8&&lastAttack!=='smash')pool.push(STATES.GROUND_SMASH);if(d<5.2&&lastAttack!=='stomp')pool.push(STATES.STOMP);
    const n=pool[Math.floor(Math.random()*pool.length)]||STATES.MELEE_VERTICAL;lastAttack=n===STATES.MELEE_VERTICAL?'vertical':n===STATES.MELEE_SWEEP?'sweep':n===STATES.GROUND_SMASH?'smash':'stomp';go(n)
  }

  function pointFacing(p,range,halfDeg=78){
    const dx=p.x-player.x,dz=p.z-player.z,d=Math.hypot(dx,dz);if(d>range||d<.001)return d<=range;
    const tx=dx/d,tz=dz/d,fx=-Math.sin(player.yaw||0),fz=-Math.cos(player.yaw||0);return fx*tx+fz*tz>=Math.cos(halfDeg*Math.PI/180)
  }
  function heelHit(side){
    if(dead||headV||[STATES.FALLING,STATES.DOWNED,STATES.RECOVERING,STATES.GETTING_UP,STATES.DEATH,STATES.DEAD].includes(state))return;
    heel=clamp(heel+CFG.heelPerAxeHit*(window.gameParry?.damageMultiplierFor?.('giant')??1),0,CFG.heelMax);hurtSide=side;
    emit(wp(B['WeakPoint_Heel_'+side]),28,4,[.35,.08,.05]);
    if(heel>=CFG.heelMax){go(STATES.FALLING);warn('O GIGANTE ESTÁ CAINDO!',1100)}
    else{if(heel>=55)limp=true;go(heel<40?STATES.HEEL_HIT_REACTION:STATES.HEEL_STAGGER)}
    updateHud(true);
  }
  function headHit(damage){
    if(!headV||dead)return;
    const amount=Math.max(1,damage*CFG.headDamageMultiplier*(window.gameParry?.damageMultiplierFor?.('giant')??1));hp=Math.max(0,hp-amount);emit(wp(B.WeakPoint_Head),38,5,[.32,.05,.04]);
    if(status)status.textContent=`Cabeça do Gigante atingida • ${Math.round(hp)}/${CFG.hp} HP`;
    if(hp<=0){go(STATES.DEATH);warn('GIGANTE DA NÉVOA DERROTADO',2200)}
    else if(hp<=CFG.hp*.4&&!enraged){enraged=true;setTimeout(()=>{if(!dead&&state===STATES.IDLE)go(STATES.ENRAGED)},0)}
    updateHud(true);
  }
  window.addEventListener('game:axe-impact',ev=>{
    if(!scheduled||!root.visible||dead||window.gameRightHand?.current!=='axe')return;
    const swing=ev.detail?.swingId??performance.now();if(swing===lastSwing)return;
    const damage=window.gameProgression?.modifyAxeDamage?.(34)??34;
    if(headV){const p=wp(B.WeakPoint_Head);if(pointFacing(p,3.8,86)){lastSwing=swing;headHit(damage);return}}
    const pr=wp(B.WeakPoint_Heel_R),pl=wp(B.WeakPoint_Heel_L);const dr=Math.hypot(pr.x-player.x,pr.z-player.z),dl=Math.hypot(pl.x-player.x,pl.z-player.z);const first=dr<=dl?['R',pr]:['L',pl],second=dr<=dl?['L',pl]:['R',pr];
    for(const [side,p] of [first,second]){if(pointFacing(p,3.15,86)){lastSwing=swing;heelHit(side);return}}
    // Intentional rule: body/weapon hits do not meaningfully damage this boss.
    if(pointFacing(root.position,5.1,72)){lastSwing=swing;if(status)status.textContent='O corpo do Gigante resiste • acerte os calcanhares'}
  });

  function applyPose(tp,dt){
    if(!tp)return;const k=1-Math.exp(-dt*(([STATES.WALK,STATES.LIMP,STATES.REVEAL,STATES.SEARCH_TREE].includes(state))?13:7));KEYS.forEach(n=>cur[n]=cur[n].map((v,i)=>v+(tp[n][i]-v)*k));
    for(const key in BN){const b=B[BN[key]],c=cur[key];b.rotation.set(c[0],c[1],c[2])}
    B.Pelvis.position.y=8+cur.dy[0]+Math.sin(performance.now()/1000*1.3)*.035;B.Chest.scale.y=1+Math.sin(performance.now()/1000*(enraged?4:1.3))*(enraged?.03:.012);
    fings.R.forEach(([f,t,th])=>{f.rotation.x=-cur.cr[0]*(th?.5:1.1);t.rotation.x=-cur.cr[0]*.9});fings.L.forEach(([f,t,th])=>{f.rotation.x=-cur.cl[0]*(th?.5:1.1);t.rotation.x=-cur.cl[0]*.9});
  }

  function updateState(dt){
    if(window.gameParry?.isBroken?.('giant')&&state!==STATES.DEATH&&state!==STATES.DEAD)return;
    stateT+=dt;let tp=null;
    if([STATES.IDLE,STATES.HOLD_TREE,STATES.HEAD_VULNERABLE,STATES.DEAD].includes(state)){
      const t=performance.now()/1000;tp=state===STATES.HOLD_TREE?F({...Up}):state===STATES.HEAD_VULNERABLE?F({...Dn}):state===STATES.DEAD?cur:F({Hd:[.12+Math.sin(t*.4)*.04,Math.sin(t*.25)*.22]});
      if(state===STATES.IDLE){faceTo(player.x,player.z,dt,.8);idleT+=dt;const idleGate=difficulty().tier>=2?difficulty().reactTime:(difficulty().tier===0?1.45:(distToPlayer()>=CFG.longRangeTreeDistance ? .34 : (enraged?.45:.85)));if(ai&&idleT>idleGate)chooseAttack()}
      if(state===STATES.HOLD_TREE)go(STATES.AIM_TREE);
      if(state===STATES.HEAD_VULNERABLE&&stateT>CFG.headVulnerableSeconds)go(STATES.RECOVERING);
    }else if([STATES.WALK,STATES.LIMP,STATES.REVEAL,STATES.SEARCH_TREE].includes(state)){
      tp=walkPose(dt,state===STATES.REVEAL?.82:state===STATES.SEARCH_TREE?.9:1);
    }else{
      const seq=stateSeq();if(seq){tp=seqPose(seq,stateT);nearestSeqEvents(seq,prevStateT,stateT);const total=dur(seq);if(state===STATES.AIM_TREE&&stateT<1.7){const pr=predictedPlayerXZ(.45,4.5);faceTo(pr.x,pr.z,dt,.9);}if(stateT>=total){
        if(state===STATES.REVEAL_LOOK){engaged=true;go(STATES.IDLE)}
        else if(state===STATES.GRAB_TREE)go(STATES.UPROOT_TREE);
        else if(state===STATES.UPROOT_TREE)go(STATES.HOLD_TREE);
        else if(state===STATES.AIM_TREE)go(STATES.THROW_TREE);
        else if(state===STATES.THROW_TREE){targetTree=null;go(STATES.IDLE)}
        else if(state===STATES.FALLING)go(STATES.DOWNED);
        else if(state===STATES.DOWNED)go(STATES.HEAD_VULNERABLE);
        else if(state===STATES.RECOVERING)go(STATES.GETTING_UP);
        else if(state===STATES.GETTING_UP)go(STATES.IDLE);
        else if(state===STATES.DEATH){
          go(STATES.DEAD);
          if(!deathRewarded){
            deathRewarded=true;
            window.gameProgression?.dropXP?.(CFG.xpReward,root.position.clone(),'Gigante da Névoa');
            window.dispatchEvent(new CustomEvent('game:boss-defeated',{detail:{id:'gigante-nevoa',name:'GIGANTE DA NÉVOA',xp:CFG.xpReward}}));
          }
          // A animação de morte terminou: o boss não vira um corpo permanente no mapa.
          removeGiantAfterDeath();
        }
        else if(!dead)go(STATES.IDLE);
      }}
    }
    prevStateT=stateT;applyPose(tp,dt);
  }

  function updateBodyCollision(){
    if(!root.visible||dead)return;let dx=player.x-root.position.x,dz=player.z-root.position.z,d=Math.hypot(dx,dz);const min=CFG.bodyRadius+(Number(player.radius)||.42);if(d>=min)return;if(d<.001){dx=Math.sin(root.rotation.y);dz=Math.cos(root.rotation.y);d=1}const tx=root.position.x+dx/d*min,tz=root.position.z+dz/d*min;if(!game.collides?.(tx,tz)){player.x=tx;player.z=tz}
  }

  let last=performance.now(),acc=0;
  function loop(now){
    requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;const raw=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    if(!scheduled){if(scheduleReady())spawn(false);return}
    updatePlayerMotion(raw);updateParticles(raw);updateTreeFlight(raw);updateTreeSway(raw);updateShake(raw);

    // Névoa acompanha o Gigante e fica mais densa durante a entrada dele.
    if(root.visible&&!dead){
      giantMistClock+=raw;
      const gt=giantMistClock;
      const revealBoost=(state===STATES.REVEAL||state===STATES.REVEAL_LOOK)?1.0:.72;
      giantMistMat.opacity=.42*revealBoost;
      for(let i=0;i<giantMistCount;i++){
        const s=giantMistSeeds[i],a=s*6.2831853+gt*(.025+(i%5)*.004);
        const rr=5+(s%1)*17+(i%7)*1.05;
        const x=root.position.x+Math.cos(a)*rr+Math.sin(gt*.11+s)*2.4;
        const z=root.position.z+Math.sin(a)*rr+Math.cos(gt*.09+s*.7)*2.0;
        const gy=game.groundY(x,z);
        giantMistPositions[i*3]=x;
        giantMistPositions[i*3+1]=gy+1.2+(i%6)*.75+Math.sin(gt*.18+s)*.8;
        giantMistPositions[i*3+2]=z;
      }
      giantMistGeo.attributes.position.needsUpdate=true;
    }else if(giantMistMat.opacity>0){
      giantMistMat.opacity=Math.max(0,giantMistMat.opacity-raw*.45);
    }

    if(!root.visible)return;
    acc+=raw;if(acc<1/45)return;const dt=Math.min(.05,acc);acc=0;
    if(!dead&&engaged&&distToPlayer()>CFG.disengageRadius){go(STATES.WALK)}
    updateState(dt);root.position.y=game.groundY(root.position.x,root.position.z);root.updateMatrixWorld(true);
    if(heldTree&&[STATES.UPROOT_TREE,STATES.HOLD_TREE,STATES.AIM_TREE,STATES.THROW_TREE].includes(state))updateHeldTree();
    if(droppedWeapon&&club.parent===scene){weaponVel-=24*dt;club.position.y+=weaponVel*dt;club.rotation.x+=dt*1.5;const gy=game.groundY(club.position.x,club.position.z);if(club.position.y<gy+.6){club.position.y=gy+.6;droppedWeapon=false}}
    updateBodyCollision();updateHud();
  }
  requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

  window.gameGiantBoss={
    version:'V166B',
    source:'gigante_boss_viewer(1).html',
     root,bones:B,weapon:club,config:CFG,
     swordTargets(){if(!scheduled||!root.visible||dead)return [];
       if(headV){const pos=wp(B.WeakPoint_Head);return [{root:{position:pos},radius:.75,height:0,hit:d=>{headHit(d);return true;}}];}
       return ['R','L'].map(side=>({root:{position:wp(B['WeakPoint_Heel_'+side])},radius:.72,height:0,hit:d=>{heelHit(side);return true;}}));
     },
     get tacticalAI(){return {mode:window.gameDifficulty?.mode||'normal',lastDecision:tacticalLast,pathWaypoints:tacticalPlan?.length||0,stuckSeconds:stuckTime}},
    get state(){return state},get hp(){return hp},get maxHp(){return CFG.hp},get heelStagger(){return heel},get headVulnerable(){return headV},get enraged(){return enraged},get scheduled(){return scheduled},
    get schedule(){return {day:currentDay(),night:isNight(),spawnNight:CFG.spawnNight,ignisDefeated:ignisDefeated(),ready:scheduleReady(),spawned:scheduled}},
    spawnNow(){return spawn(true)},
    forceFall(){if(!scheduled)spawn(true);heel=CFG.heelMax;go(STATES.FALLING);return true},
    forceTree(){if(!scheduled)spawn(true);targetTree=candidateTree();if(!targetTree)return false;go(STATES.SEARCH_TREE);return true},
    setAI(v=true){ai=!!v;return ai},
    reset(){root.visible=false;scheduled=false;engaged=false;dead=false;hp=CFG.hp;heel=0;limp=false;enraged=false;headV=false;targetTree=null;if(heldTree){heldTree.removeFromParent?.();heldTree=null}if(treeFlight){treeFlight.m?.removeFromParent?.();treeFlight=null}restoreClub();giantMistMat.opacity=0;for(let i=0;i<giantMistCount;i++)giantMistPositions[i*3+1]=-999;giantMistGeo.attributes.position.needsUpdate=true;hud.classList.remove('show');go(STATES.HIDDEN);return true}
  };

  console.info('[V167B GIGANTE DA NÉVOA]',window.gameGiantBoss.schedule);
})().catch(err=>{
  console.error('V100B Gigante da Névoa:',err);
  const s=document.getElementById('status');if(s)s.textContent='Falha ao integrar Gigante da Névoa: '+String(err?.message||err);
});

