
(async()=>{
if(window.__LOBISOMEM_V118)return;window.__LOBISOMEM_V118=true;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<1400;i++){const g=window.gameReview;if(g?.scene&&g?.camera&&g?.renderer&&g?.player&&g?.groundY&&window.__THREE_MODULE&&window.gameZombie?.hurtPlayer)break;await sleep(20)}
const game=window.gameReview,T=window.__THREE_MODULE;
if(!T||!game?.scene||!game?.player){console.warn('[V118 LOBISOMEM] jogo indisponível');return}
const scene=game.scene,player=game.player,camera=game.camera,renderer=game.renderer,mobile=!!window.__FOREST_MOBILE_BUILD__;
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),ease=u=>{u=clamp(u,0,1);return u*u*(3-2*u)},wrap=a=>Math.atan2(Math.sin(a),Math.cos(a)),lerp=(a,b,u)=>a+(b-a)*u,rnd=(a=1,b)=>b===undefined?Math.random()*a:a+Math.random()*(b-a);
const status=document.getElementById('status');

// ============ CONFIG ============
const CFG=Object.assign({
  spawnNight:3,spawnDelay:14,          // noite mínima e segundos de noite contínua antes do primeiro uivo
  hp:380,xp:700,poiseMax:75,bodyRadius:1.1,size:.95,   // size: escala da forma final (≈3 m em pé, medido com a pose aplicada)
 
  startRadius:68,stareRadius:27,wolfRunSpeed:13,
  walkSpeed:2.3,stalkSpeed:2.7,approachSpeed:3.1,runSpeed:9.6,
  fogPeak:.062,                         // densidade de névoa no pico do encontro
  damage:{slash:18,double:15,lunge:24,leap:30,run:22},
  builtinAudio:true
},window.FLORESTA_LOBISOMEM_CONFIG||{});

const ST=Object.freeze({DORMANT:'DORMANT',DISTANT_HOWL:'DISTANT_HOWL',WOLF_REVEAL:'WOLF_REVEAL',WOLF_RUN_IN_FOREST:'WOLF_RUN_IN_FOREST',WOLF_STOP_AND_STARE:'WOLF_STOP_AND_STARE',
  TRANSFORM_START:'TRANSFORM_START',TRANSFORM_LOOP:'TRANSFORM_LOOP',TRANSFORM_COMPLETE:'TRANSFORM_COMPLETE',
  WEREWOLF_IDLE:'WEREWOLF_IDLE',STALK:'STALK',APPROACH:'APPROACH',RUN:'RUN',CHARGE:'CHARGE',
  ATTACK_SLASH_L:'ATTACK_SLASH_L',ATTACK_SLASH_R:'ATTACK_SLASH_R',ATTACK_DOUBLE:'ATTACK_DOUBLE',ATTACK_LUNGE:'ATTACK_LUNGE',ATTACK_LEAP:'ATTACK_LEAP',
  ROAR:'ROAR',HIT_REACTION:'HIT_REACTION',STAGGER:'STAGGER',DEATH:'DEATH',DEAD:'DEAD'});
const WOLF_PHASE=[ST.DISTANT_HOWL,ST.WOLF_REVEAL,ST.WOLF_RUN_IN_FOREST,ST.WOLF_STOP_AND_STARE,ST.TRANSFORM_START,ST.TRANSFORM_LOOP,ST.TRANSFORM_COMPLETE];
const ATTACKS=[ST.ATTACK_SLASH_L,ST.ATTACK_SLASH_R,ST.ATTACK_DOUBLE,ST.ATTACK_LUNGE,ST.ATTACK_LEAP];

// ============ RIG ÚNICO (lobo <-> lobisomem) ============
const FUR=new T.MeshStandardMaterial({color:0x15110f,roughness:1,flatShading:true}),FUR2=new T.MeshStandardMaterial({color:0x221a16,roughness:1,flatShading:true});
const CLAWM=new T.MeshStandardMaterial({color:0x8d8576,roughness:.45,flatShading:true}),TEETH=new T.MeshStandardMaterial({color:0xc9c2ac,roughness:.5,flatShading:true}),INNER=new T.MeshStandardMaterial({color:0x240808,roughness:.8});
const EYEM=new T.MeshBasicMaterial({color:0xff5a22,toneMapped:false,fog:false});
const sph=new T.SphereGeometry(1,10,8),cone=(r,h,s=5)=>new T.ConeGeometry(r,h,s),cyl=(a,b,h,s=7)=>new T.CylinderGeometry(a,b,h,s);
function M(p,g,m,x=0,y=0,z=0,sx=1,sy=1,sz=1,rx=0,ry=0,rz=0){const o=new T.Mesh(g,m);o.position.set(x,y,z);o.scale.set(sx,sy,sz);o.rotation.set(rx,ry,rz);o.castShadow=true;p.add(o);return o}
function glowTex(c0,c1){const c=document.createElement('canvas');c.width=c.height=64;const x=c.getContext('2d'),g=x.createRadialGradient(32,32,0,32,32,32);g.addColorStop(0,c0);g.addColorStop(.35,c1);g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,64,64);const t=new T.CanvasTexture(c);if(T.SRGBColorSpace!==undefined)t.colorSpace=T.SRGBColorSpace;return t}
const root=new T.Group();root.name='LOBISOMEM';root.visible=false;scene.add(root);
const B={Root:root};
const nb=(p,n,x=0,y=0,z=0)=>{const o=new T.Object3D();o.name=n;o.position.set(x,y,z);p.add(o);B[n]=o;return o};
nb(root,'Pelvis',0,1.45,0);nb(B.Pelvis,'Spine',0,.3);nb(B.Spine,'Chest',0,.4);nb(B.Chest,'Neck',0,.4,.04);nb(B.Neck,'WolfHead',0,.22,.1);
const Hd=B.WolfHead;nb(Hd,'Jaw',0,-.1,.12);nb(Hd,'Socket_Eye_L',.115,.07,.27);nb(Hd,'Socket_Eye_R',-.115,.07,.27);nb(B.Jaw,'Socket_Mouth',0,-.03,.34);
M(B.Pelvis,sph,FUR,0,-.05,0,.36,.3,.28);
const belly=M(B.Spine,sph,FUR,0,.18,0,.34,.34,.3),chestM=M(B.Chest,sph,FUR,0,.1,.02,.52,.5,.38);M(B.Chest,sph,FUR2,0,.28,-.08,.4,.28,.3);M(B.Neck,cyl(.2,.28,.5),FUR,0,.08,.04);
M(Hd,sph,FUR,0,.02,.04,.2,.19,.23);M(Hd,cyl(.055,.11,.4),FUR,0,-.04,.34,1,1,1,Math.PI/2);M(Hd,sph,INNER,0,-.01,.55,.05,.04,.05);
[-1,1].forEach(s=>{M(Hd,cone(.075,.26,4),FUR,s*.11,.22,-.04,1,1,.7,-.25,0,-s*.2);M(Hd,sph,EYEM,s*.115,.07,.27,.032,.026,.03)});
M(B.Jaw,cyl(.04,.085,.34),FUR,0,-.02,.2,1,1,1,Math.PI/2);
for(let i=0;i<6;i++)[-1,1].forEach(s=>{M(Hd,cone(.014,.07,4),TEETH,s*.06,-.1,.28+i*.045,1,1,1,Math.PI);M(B.Jaw,cone(.012,.06,4),TEETH,s*.05,.04,.12+i*.045)});
const spike=cone(.06,.3,4);for(let i=0;i<20;i++)M(B.Chest,spike,FUR2,rnd(-.4,.4),rnd(-.05,.38),rnd(-.36,-.04),1,1,1,-1.9,0,rnd(-.4,.4));
for(let i=0;i<12;i++){const a=i/12*6.28;M(B.Neck,spike,FUR2,Math.sin(a)*.26,rnd(-.1,.25),Math.cos(a)*.22-.04,.9,.9,.9,Math.cos(a)*-.8,0,Math.sin(a)*.8)}
const armM=[],clawG={},legMs=[];
[['L',1],['R',-1]].forEach(([n,s])=>{
  const cl=nb(B.Chest,'Clavicle_'+n,s*.42,.3,0),ua=nb(cl,'UpperArm_'+n,s*.16,0,0),fa=nb(ua,'Forearm_'+n,0,-.75,0),ha=nb(fa,'Hand_'+n,0,-.75,0);
  M(cl,sph,FUR,s*.04,0,0,.24,.22,.24);armM.push(M(ua,cyl(.15,.12,.75),FUR,0,-.375,0),M(fa,cyl(.12,.09,.75),FUR,0,-.375,0));M(fa,sph,FUR2,0,-.55,0,.14,.2,.14);
  M(ha,sph,FUR,0,-.15,.03,.11,.2,.08);const g=new T.Group();g.position.set(0,-.28,.03);ha.add(g);clawG[n]=g;
  for(let i=0;i<4;i++)M(g,cone(.022,.26,4),CLAWM,(i-1.5)*.05,-.12,.04,1,1,1,Math.PI-.35);
  nb(ha,'Socket_Claw_'+n,0,-.4,.1);
  const th=nb(B.Pelvis,'Thigh_'+n,s*.3,-.1,0),ca=nb(th,'Calf_'+n,0,-.72,0),an=nb(ca,'Foot_'+n,0,-.72,0),to=nb(an,'Toe_'+n,0,-.08,.26);
  M(th,sph,FUR,0,-.3,0,.2,.46,.22);M(ca,cyl(.11,.08,.72),FUR,0,-.36,0);M(an,sph,FUR,0,-.04,.1,.1,.06,.2);
  for(let i=0;i<3;i++)M(to,cone(.018,.12,4),CLAWM,(i-1)*.05,0,.05,1,1,1,Math.PI/2+.2);
});
nb(B.Pelvis,'Tail',0,-.05,-.25);nb(B.Tail,'Tail2',0,-.45,0);M(B.Tail,cone(.09,.5,5),FUR,0,-.22,0,1,1,1,.25);M(B.Tail2,cone(.07,.4,5),FUR2,0,-.18,0,1,1,1,.15);
// olhos: brilho sobrenatural (âmbar-vermelho), visíveis através da névoa antes do corpo
const eyeTex=glowTex('rgba(255,170,90,1)','rgba(255,70,20,.55)'),eyeSpr=[B.Socket_Eye_L,B.Socket_Eye_R].map(sk=>{const s=new T.Sprite(new T.SpriteMaterial({map:eyeTex,color:0xff5a22,blending:T.AdditiveBlending,transparent:true,depthWrite:false,fog:false}));sk.add(s);return s});
try{root.visible=true;renderer.compile(root,camera);}catch(e){}root.visible=false;

// ============ POSES / ANIMAÇÕES ============
const KEYS=['dy','sc','fm','br','J','cl','P','S','C','N','H','UR','UL','FR','FL','HR','HL','TR','TL','KR','KL','AR','AL','TA'];
const mk=(b,o)=>{const r={};KEYS.forEach(k=>r[k]=b?b[k].slice():[0,0,0]);for(const k in o){const v=o[k];r[k]=[v[0]||0,v[1]||0,v[2]||0]}return r};
const BASE=mk(null,{sc:[1],fm:[1],dy:[-.02],S:[.22],C:[.12],N:[-.22],H:[.2],UR:[-.12,0,-.14],UL:[-.12,0,.14],FR:[-.38],FL:[-.38],HR:[-.2],HL:[-.2],TR:[-.4],TL:[-.4],KR:[.8],KL:[.8],AR:[-.4],AL:[-.4],cl:[.5],TA:[.3]});
const WOLF=mk(null,{sc:[.54],fm:[0],dy:[-.3],S:[1.25],C:[.05],N:[-.5],H:[-.4],UR:[-1.35,0,-.05],UL:[-1.35,0,.05],FR:[.15],FL:[.15],HR:[-.9],HL:[-.9],TR:[-.75],TL:[-.75],KR:[1.5],KL:[1.5],AR:[-.75],AL:[-.75],cl:[.2],TA:[.4]});
const F=o=>mk(BASE,o),W=o=>mk(WOLF,o);
const SW={UR:'UL',UL:'UR',FR:'FL',FL:'FR',HR:'HL',HL:'HR',TR:'TL',TL:'TR',KR:'KL',KL:'KR',AR:'AL',AL:'AR'};
const mir=p=>{const r=mk(p,{});for(const k in SW)r[k]=p[SW[k]].slice();for(const k of ['P','S','C','N','H','UR','UL'])r[k]=[r[k][0],-r[k][1],-r[k][2]];return r};
const slashR=[[.6,F({UR:[-1.9,0,-.7],UL:[-.2,0,.2],C:[.1,.55],P:[0,.3],S:[.1],H:[.15],J:[.3],dy:[-.15],cl:[1],TR:[-.5],TL:[-.3]})],[.14,F({UR:[-.9,0,.55],UL:[-.4,0,.3],C:[.35,-.8],P:[0,-.3],S:[.5],H:[.3],dy:[-.3],J:[.8],cl:[1]}),'HIT'],[.55,F({UR:[-.7,0,.4],C:[.25,-.5],S:[.45],dy:[-.25]})],[.5,BASE]];
const SQ={
  HOWL:[[1.3,W({S:[.75],N:[-.2],H:[-.9],J:[.2],UR:[-1.2,0,-.05],UL:[-1.2,0,.05],dy:[-.2],br:[.8]})],[2.8,W({S:[.62],N:[-.4],H:[-1.15],J:[.75],UR:[-1.15,0,-.05],UL:[-1.15,0,.05],dy:[-.12],br:[1]})],[.9,WOLF]],
  STARE:[[.5,W({S:[1.3],N:[-.3],H:[-.35],J:[.25],br:[.9]})],[.5,W({S:[1.3],N:[-.3],H:[-.4],J:[.2],br:[.1]})],[.5,W({S:[1.3],N:[-.3],H:[-.35],J:[.25],br:[.9]})],[.5,W({S:[1.3],N:[-.3],H:[-.4],J:[.2],br:[.1]})],[.5,W({S:[1.3],N:[-.3],H:[-.35],J:[.25],br:[.9]})],[.5,W({S:[1.3],N:[-.3],H:[-.4],J:[.2],br:[.1]})],[.5,W({S:[1.3],N:[-.3],H:[-.35],J:[.25],br:[.9]})]],
  TRANSFORM_START:[[.9,W({dy:[-.38],S:[1.35],N:[-.7],H:[-.2],J:[.35],br:[.7],cl:[.6],TA:[.1]})],[.9,W({dy:[-.12],S:[.95],C:[.2],N:[-.6],H:[-.5],UR:[-1,0,-.3],UL:[-1,0,.3],FR:[.4],FL:[.4],HR:[-.3],HL:[-.3],sc:[.7],fm:[.15],J:[.6],br:[.9],cl:[.9]}),'CRACK'],[.6,W({dy:[-.2],S:[.7],C:[.25],N:[-.7],H:[-.6],UR:[-.6,0,-.4],UL:[-.6,0,.4],FR:[-.2],FL:[-.2],HR:[-.2],HL:[-.2],sc:[.78],fm:[.3],J:[.7],br:[1],cl:[1],TR:[-.7],TL:[-.7],KR:[1.2],KL:[1.2]}),'CRACK']],
  TRANSFORM_LOOP:[[.8,F({sc:[.8],fm:[.45],dy:[-.55],S:[.8],C:[.25],N:[-.85],H:[-.7],UR:[-.5,0,-.5],UL:[-.3,0,.6],FR:[-.7],FL:[-.2],HR:[-.4],HL:[.2],TR:[-1.1],TL:[-.6],KR:[1.5],KL:[1],J:[.8],cl:[1],br:[1],P:[.15,.2,.1]}),'CRACK'],[.8,F({sc:[.88],fm:[.65],dy:[-.35],S:[.55],C:[.2],N:[-1],H:[-.6],UR:[-1,0,-.7],UL:[-.9,0,.8],FR:[-.5],FL:[-.5],TR:[-.7],TL:[-.8],KR:[1.2],KL:[1.3],J:[.9],cl:[1],br:[1],P:[-.1,-.2,0]}),'CRACK'],[.9,F({sc:[.95],fm:[.85],dy:[-.15],S:[.4],C:[.2],N:[-.5],H:[-.3],UR:[-.5,0,-.35],UL:[-.5,0,.35],J:[.5],cl:[1],br:[.9]}),'CRACK']],
  TRANSFORM_COMPLETE:[[.7,F({dy:[.05],S:[-.05],C:[-.1],N:[-.6],H:[-.7],UR:[-.7,0,-.9],UL:[-.7,0,.9],FR:[-.4],FL:[-.4],J:[1],br:[1],cl:[1],TR:[-.25],TL:[-.25],KR:[.5],KL:[.5],AR:[-.25],AL:[-.25]}),'ROAR'],[.9,F({dy:[.05],S:[-.05],C:[-.1],N:[-.6],H:[-.7],UR:[-.7,0,-.9],UL:[-.7,0,.9],FR:[-.4],FL:[-.4],J:[1],br:[1],cl:[1]})],[.6,BASE]],
  ATTACK_SLASH_R:slashR,ATTACK_SLASH_L:slashR.map(s=>[s[0],mir(s[1]),s[2]]),
  ATTACK_DOUBLE:[[.65,F({UR:[-2,0,-.6],UL:[-2,0,.6],S:[-.05],C:[-.15],N:[-.3],H:[.1],dy:[-.2],J:[.4],cl:[1]})],[.13,F({UR:[-.8,0,.4],UL:[-1.9,0,.5],S:[.5],C:[.3,-.5],dy:[-.3],J:[.8],cl:[1]}),'HIT'],[.09,F({UR:[-.9,0,.3],UL:[-1.9,0,.5],S:[.5],dy:[-.3],J:[.8],cl:[1]})],[.14,F({UL:[-.8,0,-.4],UR:[-.9,0,.3],S:[.55],C:[.3,.5],dy:[-.3],J:[.8],cl:[1]}),'HIT2'],[.6,F({UR:[-.7],UL:[-.7],S:[.45],dy:[-.25]})],[.5,BASE]],
  ATTACK_LUNGE:[[.55,F({dy:[-.55],S:[.7],C:[.3],N:[-.5],H:[.05],TR:[-1.1],TL:[-1.1],KR:[1.9],KL:[1.9],AR:[-.8],AL:[-.8],UR:[-1,0,-.4],UL:[-1,0,.4],FR:[-.6],FL:[-.6],J:[.4],cl:[1]}),'MOVE_ON'],[.3,F({dy:[-.2],S:[.95],C:[.1],N:[-.7],H:[.2],UR:[-1.7,0,-.35],UL:[-1.7,0,.35],TR:[-.2],TL:[-.2],KR:[.3],KL:[.3],AR:[.6],AL:[.6],J:[.95],cl:[1]}),'HIT'],[.8,F({dy:[-.3],S:[.5],UR:[-.9],UL:[-.9]})],[.5,BASE]],
  ATTACK_LEAP:[[.8,F({dy:[-.7],S:[.85],C:[.3],N:[-.6],H:[.1],TR:[-1.25],TL:[-1.25],KR:[2.1],KL:[2.1],AR:[-.9],AL:[-.9],UR:[-.5,0,-.3],UL:[-.5,0,.3],FR:[-.8],FL:[-.8],J:[.5],cl:[1]}),'JUMP'],[.6,F({dy:[.15],S:[.7],UR:[-2.2,0,-.3],UL:[-2.2,0,.3],TR:[-1.2],TL:[-1.2],KR:[1.6],KL:[1.6],AR:[.4],AL:[.4],J:[1],cl:[1]}),'LAND'],[.5,F({dy:[-.6],S:[.9],UR:[-1],UL:[-1],TR:[-1.1],TL:[-1.1],KR:[2],KL:[2],J:[.5]})],[.7,F({dy:[-.2],S:[.4]})],[.4,BASE]],
  ROAR:[[.55,F({S:[-.1],C:[-.2],N:[-.55],H:[-.65],J:[1.05],UR:[-.6,0,-.7],UL:[-.6,0,.7],dy:[-.1],br:[1],cl:[1]}),'ROAR'],[1,F({S:[-.1],C:[-.2],N:[-.55],H:[-.65],J:[1.05],UR:[-.6,0,-.7],UL:[-.6,0,.7],dy:[-.1],br:[1],cl:[1]})],[.6,BASE]],
  HIT_REACTION:[[.1,F({S:[.5],N:[.1],H:[.2],P:[-.12],dy:[-.15]})],[.35,BASE]],
  STAGGER:[[.25,F({S:[-.2],C:[-.3],N:[.1],H:[.4],dy:[-.3],P:[-.18],UR:[-.3,0,-.9],UL:[-.3,0,.9],TR:[-.8],TL:[-.2],KR:[1.1],KL:[.4],J:[.7]}),'PUSH'],[.7,F({S:[.45],dy:[-.4],UR:[-.5],UL:[-.5],TR:[-.9],TL:[-.9],KR:[1.4],KL:[1.4],J:[.5],H:[.2]})],[.45,BASE]],
  DEATH:[[.5,F({P:[-.3],S:[.1],dy:[-.25],UR:[-.3,0,-.7],UL:[-.3,0,.7],J:[.8],H:[.3]})],[.9,F({P:[-.2],S:[.5],dy:[-.7],TR:[-1.3],TL:[-1.3],KR:[1.7],KL:[1.7],UR:[-.5,0,-.5],UL:[-.5,0,.5],J:[.6],H:[.4]})],[1.1,F({P:[-1.45],S:[.1],dy:[-1.15],TR:[-1.1],TL:[-.8],KR:[1.3],KL:[1.1],UR:[-.4,0,-1],UL:[-.4,0,1],H:[-.4],J:[.3],cl:[0]})]]
};
const STK=F({S:[.55],C:[.2],N:[-.45],H:[.15],UR:[-.35,0,-.3],UL:[-.35,0,.3],FR:[-.5],FL:[-.5],dy:[-.18],TR:[-.55],TL:[-.55],KR:[1.1],KL:[1.1],AR:[-.55],AL:[-.55],cl:[1]});
const RUNP=F({S:[.8],C:[.2],N:[-.55],H:[.1],UR:[-.6,0,-.2],UL:[-.6,0,.2],dy:[-.25],TR:[-.5],TL:[-.5],KR:[.9],KL:[.9],cl:[1]});
const WRUN=W({S:[1.1],N:[-.45],H:[-.4]});
const GAIT={wolfWalk:[WOLF,{leg:.45,knee:.4,arm:.4,bob:.03,sp:.04,pair:1}],wolfRun:[WRUN,{leg:.75,knee:.6,arm:.8,bob:.08,sp:.12,pair:1}],walk:[BASE,{leg:.5,knee:.55,arm:.45,bob:.04,sp:.03}],stalk:[STK,{leg:.4,knee:.5,arm:.25,bob:.03,sp:.03}],run:[RUNP,{leg:.9,knee:1,arm:.9,bob:.1,sp:.08}]};
const cp=p=>mk(p,{});
function gait(name,ph){const [b,a]=GAIT[name],o=cp(b),s=Math.sin(ph),c=Math.cos(ph);
  o.TL[0]-=s*a.leg;o.TR[0]+=(a.pair?-1:1)*s*a.leg;o.KL[0]+=Math.max(0,c)*a.knee;o.KR[0]+=Math.max(0,a.pair?c:-c)*a.knee;
  o.UL[0]+=s*a.arm;o.UR[0]+=(a.pair?1:-1)*s*a.arm;
  o.dy[0]+=Math.abs(c)*a.bob;o.S[0]+=Math.sin(ph*2)*a.sp;o.AL[0]=-(o.TL[0]+o.KL[0]);o.AR[0]=-(o.TR[0]+o.KR[0]);return o}
const cur=cp(WOLF);let spasm=0,poseK=9;
function applyPose(tp,dt){
  const k=1-Math.exp(-dt*poseK);KEYS.forEach(n=>{for(let i=0;i<3;i++)cur[n][i]+=(tp[n][i]-cur[n][i])*k});
  const t=performance.now()/1000,c=cur,fm=clamp(c.fm[0],0,1),st=1+.5*(1-fm),aK=lerp(.95,1,fm);
  const nz=i=>spasm?Math.sin(t*(13+i*3.7)+i*1.7)*Math.sin(t*(7+i)+i)*spasm*.16:0;
  root.scale.setScalar(Math.max(.05,c.sc[0]*lerp(1,CFG.size,fm)));B.Pelvis.position.y=1.45+c.dy[0]+nz(9)*.5;
  B.Spine.position.y=.3*st;B.Chest.position.y=.4*st;belly.scale.y=.34*st;
  for(const n of ['L','R']){B['Forearm_'+n].position.y=-.75*aK;B['Hand_'+n].position.y=-.75*aK;clawG[n].scale.setScalar(.45+.55*fm)}
  armM.forEach((m,i)=>{m.scale.y=aK;m.position.y=-.375*aK});
  const br=clamp(c.br[0]+.25+.2*Math.sin(t*1.7),0,1.2);chestM.scale.set(.52*(1+br*.12),.5*(1+br*.1),.38*(1+br*.16));
  B.Pelvis.rotation.set(c.P[0]+nz(1)*.5,c.P[1]+nz(2)*.5,c.P[2]+nz(3)*.4);B.Spine.rotation.set(c.S[0]+nz(4),c.S[1]+nz(5)*.6,c.S[2]);B.Chest.rotation.set(c.C[0]+nz(6)*.6,c.C[1],c.C[2]);
  B.Neck.rotation.set(c.N[0]+nz(7)*.7,c.N[1]+nz(8)*.6,c.N[2]);Hd.rotation.set(c.H[0]+nz(10)*.6,c.H[1],c.H[2]);B.Jaw.rotation.x=c.J[0];
  const cr=c.cl[0];['L','R'].forEach(n=>{const s=n==='L'?1:-1;B['Clavicle_'+n].rotation.set(0,0,0);B['UpperArm_'+n].rotation.set(c['U'+n][0]+nz(11),c['U'+n][1],c['U'+n][2]+nz(12)*.5);B['Forearm_'+n].rotation.x=c['F'+n][0];B['Hand_'+n].rotation.x=c['H'+n][0];clawG[n].rotation.x=-cr*.5;
    B['Thigh_'+n].rotation.set(c['T'+n][0]+nz(13)*.6,0,0);B['Calf_'+n].rotation.x=c['K'+n][0];B['Foot_'+n].rotation.x=c['A'+n][0]});
  B.Tail.rotation.set(c.TA[0]+Math.sin(t*1.8)*.12,Math.sin(t*1.1)*.3,0);B.Tail2.rotation.x=.3+Math.sin(t*2.1)*.15;
}

// ============ ÁUDIO PROCEDURAL (+ evento 'werewolf:audio' para sons próprios) ============
let AC=null,mg=null,nbuf=null,windG=null,droneG=null;
function ac(){if(AC||!CFG.builtinAudio)return AC;try{AC=new(window.AudioContext||window.webkitAudioContext)();mg=AC.createGain();mg.gain.value=.85;mg.connect(AC.destination);nbuf=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate);const d=nbuf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}catch(e){AC=null}return AC}
['pointerdown','keydown','touchstart'].forEach(e=>addEventListener(e,()=>{ac();if(AC?.state==='suspended')AC.resume()},{passive:true}));
const fwd=new T.Vector3();
function outNode(x,z,g){const a=AC;let p=null;if(a.createStereoPanner){p=a.createStereoPanner();camera.getWorldDirection(fwd);const l=Math.hypot(fwd.x,fwd.z)||1,dx=x-camera.position.x,dz=z-camera.position.z,d=Math.hypot(dx,dz)||1;p.pan.value=clamp((dx*(-fwd.z/l)+dz*(fwd.x/l))/d,-1,1)*.9;g.connect(p);p.connect(mg)}else g.connect(mg)}
const distTo=(x,z)=>Math.hypot(x-player.x,z-player.z),vol=(x,z,n=1)=>clamp(n/(1+distTo(x,z)/28),.06,1);
function noiseSrc(t,dur,type,f,q,gain,x,z,att=.01){const a=AC,s=a.createBufferSource();s.buffer=nbuf;const fl=a.createBiquadFilter();fl.type=type;fl.frequency.value=f;fl.Q.value=q;const g=a.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(gain,t+att);g.gain.exponentialRampToValueAtTime(.0008,t+dur);s.connect(fl);fl.connect(g);outNode(x,z,g);s.start(t,rnd(1));s.stop(t+dur+.05)}
const SFX={
  howl(x,z,dur=5.2){const a=AC,t=a.currentTime,g0=vol(x,z,1.2),o=a.createOscillator(),o2=a.createOscillator(),lfo=a.createOscillator(),lg=a.createGain(),f=a.createBiquadFilter(),G=a.createGain(),g2=a.createGain(),dl=a.createDelay(1),fb=a.createGain();
    o.type='sawtooth';o2.type='triangle';[[0,220],[.2,430],[.5,520],[.78,430],[1,290]].forEach(([u,fr])=>{o.frequency.linearRampToValueAtTime(fr,t+dur*u+.001);o2.frequency.linearRampToValueAtTime(fr*2.01,t+dur*u+.001)});
    lfo.frequency.value=5.2;lg.gain.value=9;lfo.connect(lg);lg.connect(o.frequency);lg.connect(o2.frequency);f.type='lowpass';f.frequency.value=700+1600*g0;f.Q.value=3;g2.gain.value=.3;
    G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(g0*.3,t+dur*.14);G.gain.setValueAtTime(g0*.3,t+dur*.7);G.gain.linearRampToValueAtTime(0,t+dur);
    dl.delayTime.value=.34;fb.gain.value=.42;o.connect(f);o2.connect(g2);g2.connect(f);f.connect(G);G.connect(dl);dl.connect(fb);fb.connect(dl);const dg=a.createGain();dg.gain.value=.5;dl.connect(dg);dg.connect(mg);outNode(x,z,G);
    [o,o2,lfo].forEach(n=>{n.start(t);n.stop(t+dur+1.5)})},
  growl(x,z,dur=1.8,loud=1){const a=AC,t=a.currentTime,o=a.createOscillator(),am=a.createOscillator(),ag=a.createGain(),G=a.createGain(),f=a.createBiquadFilter();o.type='sawtooth';o.frequency.setValueAtTime(48,t);o.frequency.linearRampToValueAtTime(66,t+dur);am.frequency.value=24;ag.gain.value=.5;f.type='lowpass';f.frequency.value=380;
    G.gain.setValueAtTime(0,t);G.gain.linearRampToValueAtTime(.38*vol(x,z,loud),t+.2);G.gain.linearRampToValueAtTime(0,t+dur);am.connect(ag);ag.connect(G.gain);o.connect(f);f.connect(G);outNode(x,z,G);o.start(t);am.start(t);o.stop(t+dur+.1);am.stop(t+dur+.1);noiseSrc(t,dur,'lowpass',500,1,.2*vol(x,z,loud),x,z,.3)},
  roar(x,z){SFX.growl(x,z,2,1.6);const a=AC,t=a.currentTime;noiseSrc(t,1.6,'bandpass',900,.8,.5*vol(x,z,1.6),x,z,.08);SFX.howl(x,z,2.6)},
  crack(x,z){const t=AC.currentTime;for(let i=0;i<7;i++)noiseSrc(t+rnd(.05,.9),.05,'bandpass',rnd(1500,3500),4,.55*vol(x,z,1.4),x,z,.002);noiseSrc(t,.4,'lowpass',160,1,.5*vol(x,z,1.4),x,z,.01)},
  rustle(x,z,n=.3){noiseSrc(AC.currentTime,rnd(.1,.22),'highpass',2600,.7,n*vol(x,z),x,z,.03)},
  twig(x,z){const t=AC.currentTime;noiseSrc(t,.04,'bandpass',1100,5,.45*vol(x,z),x,z,.001);noiseSrc(t+.07,.03,'bandpass',1600,5,.3*vol(x,z),x,z,.001)},
  step(x,z,h){noiseSrc(AC.currentTime,h?.28:.12,'lowpass',h?160:700,1,(h?.8:.25)*vol(x,z,h?1.3:.8),x,z,.004)},
  pant(x,z){noiseSrc(AC.currentTime,.4,'bandpass',1200,1.2,.18*vol(x,z),x,z,.12)},
  swish(x,z){noiseSrc(AC.currentTime,.25,'bandpass',700,.8,.5*vol(x,z,1.3),x,z,.06)},
  hit(x,z){noiseSrc(AC.currentTime,.3,'lowpass',260,1,.7*vol(x,z,1.5),x,z,.004)}
};
function snd(name,x,z,a1,a2){window.dispatchEvent(new CustomEvent('werewolf:audio',{detail:{name,x,z}}));const a=ac();if(!a||!SFX[name])return;try{SFX[name](x,z,a1,a2)}catch(e){}}
function ambience(dt){if(!ac())return;if(!windG){const s=AC.createBufferSource();s.buffer=nbuf;s.loop=true;const f=AC.createBiquadFilter();f.type='bandpass';f.frequency.value=420;f.Q.value=.7;windG=AC.createGain();windG.gain.value=0;s.connect(f);f.connect(windG);windG.connect(mg);s.start();const o=AC.createOscillator();o.frequency.value=41;droneG=AC.createGain();droneG.gain.value=0;o.connect(droneG);droneG.connect(mg);o.start()}
  const t=performance.now()/1000;windG.gain.value=atm*(.05+.1*(.5+.5*Math.sin(t*.35))+.05*Math.sin(t*1.3));droneG.gain.value=atm*.05}

// ============ ATMOSFERA (lua vermelha, névoa, escuridão, contraluz) ============
let atm=0,atmT=0,shake=0,sun=null,hemi=null,rimL=null,bounceL=null;
const cSky=new T.Color(0x14040a),cFog=new T.Color(0x1c0b10),cSun=new T.Color(0xb02226),cRim=new T.Color(0xff3a26),cHemi=new T.Color(0x2b0e18);
let lightTries=0;function findLights(){lightTries++;scene.traverse(o=>{if(!sun&&o.isDirectionalLight&&o.castShadow)sun=o;if(!hemi&&o.isHemisphereLight&&!/^V112_Test_/.test(o.name||''))hemi=o;if(o.name==='V117_Cool_Rim')rimL=o;if(o.name==='V117_Warm_Bounce')bounceL=o})}
findLights();
const moon=new T.Sprite(new T.SpriteMaterial({map:glowTex('rgba(255,190,150,1)','rgba(200,40,28,.8)'),transparent:true,depthWrite:false,fog:false,opacity:0}));moon.scale.setScalar(70);moon.visible=false;scene.add(moon);
const puffTex=glowTex('rgba(120,70,80,.55)','rgba(70,35,45,.28)'),puffs=[];
for(let i=0;i<(mobile?10:22);i++){const s=new T.Sprite(new T.SpriteMaterial({map:puffTex,transparent:true,depthWrite:false,fog:false,opacity:0}));s.scale.setScalar(rnd(11,20));s.visible=false;s.userData.o=rnd(.4,1);scene.add(s);puffs.push(s)}
let moonAz=0;
function atmosphere(dt){
  atm+=(atmT-atm)*(1-Math.exp(-dt*(atmT>atm?.45:.35)));if(atm<.002&&atmT===0)atm=0;
  const on=atm>0.003;moon.visible=on;puffs.forEach(p=>p.visible=on);if(!on)return;
  const far=camera.far||500,d=Math.min(330,far*.85),el=.42;moon.position.set(camera.position.x+Math.sin(moonAz)*Math.cos(el)*d,camera.position.y+Math.sin(el)*d,camera.position.z+Math.cos(moonAz)*Math.cos(el)*d);moon.material.opacity=atm*.95;
  puffs.forEach(p=>{const dx=p.position.x-player.x,dz=p.position.z-player.z;if(!p.userData.i||dx*dx+dz*dz>2600){const a=rnd(6.28),r=rnd(10,46);p.position.set(player.x+Math.sin(a)*r,game.groundY(player.x+Math.sin(a)*r,player.z+Math.cos(a)*r)+rnd(.5,1.7),player.z+Math.cos(a)*r);p.userData.i=1}
    p.position.x+=dt*.5;p.material.opacity=atm*.2*p.userData.o});
}
const prevBefore=scene.onBeforeRender,prevAfter=scene.onAfterRender;let camOff=null;
scene.onBeforeRender=function(){prevBefore?.apply(this,arguments);
  if(atm>.003&&!window.gameTestMode?.active){const a=ease(atm);
    if(scene.background?.isColor)scene.background.lerp(cSky,a*.9);
    if(scene.fog?.color){scene.fog.color.lerp(cFog,a*.85);if(scene.fog.density!==undefined)scene.fog.density=lerp(scene.fog.density,Math.max(scene.fog.density,CFG.fogPeak),a)}
    if((!sun||!hemi||!rimL)&&lightTries<12)findLights();
    if(sun){sun.color.lerp(cSun,a*.8);sun.intensity*=1-.15*a}
    if(hemi){hemi.color.lerp(cHemi,a*.6);hemi.intensity*=1-.42*a}
    if(bounceL)bounceL.intensity*=1-.8*a;
    if(rimL&&root.visible){const dx=root.position.x-player.x,dz=root.position.z-player.z,l=Math.hypot(dx,dz)||1;rimL.position.set(root.position.x+dx/l*18,root.position.y+11,root.position.z+dz/l*18);rimL.target.position.set(root.position.x,root.position.y+1.5,root.position.z);rimL.target.updateMatrixWorld?.();rimL.color.lerp(cRim,a*.7);rimL.intensity=Math.max(rimL.intensity,.6*a)}
    renderer.toneMappingExposure*=1-.1*a}
  if(shake>.004){camOff=[rnd(-1,1)*shake*.09,rnd(-1,1)*shake*.07,rnd(-1,1)*shake*.09];camera.position.x+=camOff[0];camera.position.y+=camOff[1];camera.position.z+=camOff[2];camera.updateMatrixWorld(true)}else camOff=null};
scene.onAfterRender=function(){prevAfter?.apply(this,arguments);if(camOff){camera.position.x-=camOff[0];camera.position.y-=camOff[1];camera.position.z-=camOff[2];camera.updateMatrixWorld(true);camOff=null}};

// ============ ESTADO / COMBATE ============
let state=ST.DORMANT,stT=0,time=0,ts=1,prevSeqT=0,hp=CFG.hp,poise=0,alive=true,ai=true,enraged=false,isWolf=true,eyeAmt=0,eyeT=0,vanishT=2,vanishLeft=0;
let ang=0,rad=CFG.startRadius,targetAng=0,gaitPh=0,yawV=0,mv=0,airborne=false,jumpFrom=null,jumpTo=null,atkCd=0,leapCd=0,roarCd=0,idleT=0,lastSwing=null,nightKey=null,nightTimer=0,sndT=2,stepSide=0,deadT=0,lastGo=0,stalkDir=1,stalkEnd=3,nextAtk=null;
const yawP=()=>player.bodyYaw??player.yaw??0;
const dP=()=>Math.hypot(player.x-root.position.x,player.z-root.position.z);
function setAtm(v){atmT=v}
function go(n){if(!alive&&n!==ST.DEATH&&n!==ST.DEAD&&n!==ST.DORMANT)return;state=n;stT=0;prevSeqT=0;mv=0;idleT=0;lastGo=time;ts=1;
  window.dispatchEvent(new CustomEvent('game:werewolf-state',{detail:{state:n}}));
  if(n===ST.DISTANT_HOWL){alive=true;hp=CFG.hp;poise=0;enraged=false;isWolf=true;root.visible=false;eyeT=0;eyeAmt=0;setAtm(1);const ya=yawP();targetAng=ya+rnd(-.25,.25);const dir=Math.random()<.5?1:-1;ang=targetAng+dir*1.75;moonAz=ang+rnd(-.4,.4);rad=CFG.startRadius;Object.assign(cur,cp(WOLF));place();if(status)status.textContent='…há algo na mata'}
  if(n===ST.DORMANT){root.visible=false;eyeT=0;eyeAmt=0}
  if(n===ST.WOLF_REVEAL){root.visible=true;eyeT=1}
  if(n===ST.WOLF_STOP_AND_STARE){snd('growl',root.position.x,root.position.z,2.4,.8)}
  if(n===ST.TRANSFORM_START||n===ST.TRANSFORM_LOOP||n===ST.TRANSFORM_COMPLETE){poseK=6;spasm=n===ST.TRANSFORM_LOOP?.9:n===ST.TRANSFORM_START?.35:.25}
  if(n===ST.TRANSFORM_COMPLETE){isWolf=false}
  if(n===ST.WEREWOLF_IDLE){isWolf=false;poseK=9;spasm=0}
  if(n===ST.STALK){stalkDir=Math.random()<.5?1:-1;stalkEnd=rnd(2.2,4.2)}
  if(ATTACKS.includes(n)){poseK=16;ts=enraged?1.18:1;atkCd=enraged?.9:1.5;if(n===ST.ATTACK_LEAP)leapCd=enraged?5:7.5;snd('growl',root.position.x,root.position.z,.9,.7)}
  if(n===ST.ROAR){poseK=11;roarCd=14}
  if(n===ST.STAGGER||n===ST.HIT_REACTION){poseK=18}
  if(n===ST.DEATH){poseK=7;alive=false;deadT=0;snd('growl',root.position.x,root.position.z,2.2,1.2)}
}
function place(){root.position.set(player.x+Math.sin(ang)*rad,0,player.z+Math.cos(ang)*rad);root.position.y=game.groundY(root.position.x,root.position.z)}
function tryMove(x,z){if(!game.collides?.(x,z)){root.position.x=x;root.position.z=z;return true}if(!game.collides?.(x,root.position.z)){root.position.x=x;return true}if(!game.collides?.(root.position.x,z)){root.position.z=z;return true}return false}
function turnTo(x,z,dt,sp){const d=wrap(Math.atan2(x-root.position.x,z-root.position.z)-root.rotation.y);root.rotation.y+=clamp(d,-sp*dt,sp*dt)}
function moveToward(x,z,sp,dt,stop=0){const dx=x-root.position.x,dz=z-root.position.z,d=Math.hypot(dx,dz);if(d<=stop)return d;const s=Math.min(sp*dt,d-stop);if(!window.FlorestaAI?.walk(root,dx,dz,sp,Math.min(dt,(d-stop)/Math.max(.01,sp))))tryMove(root.position.x+dx/d*s,root.position.z+dz/d*s);return d}
function push(amount,dirx,dirz){const nx=player.x+dirx*amount,nz=player.z+dirz*amount;if(!game.collides?.(nx,player.z))player.x=nx;if(!game.collides?.(player.x,nz))player.z=nz}
function strike(range,cone,dmg){const dx=player.x-root.position.x,dz=player.z-root.position.z,d=Math.hypot(dx,dz);if(d>range+(Number(player.radius)||.42))return false;
  const fx=Math.sin(root.rotation.y),fz=Math.cos(root.rotation.y);if((dx*fx+dz*fz)/Math.max(.001,d)<Math.cos(cone*Math.PI/180))return false;
  if(window.FlorestaAI&&!window.FlorestaAI.clear(root.position,player,.55))return false;
  const ok=window.gameZombie?.hurtPlayer?.(dmg,'Lobisomem','werewolf')??false;if(ok){push(1.6,dx/(d||1),dz/(d||1));shake=Math.max(shake,.7);snd('hit',player.x,player.z)}return ok}
function seqPose(seq,t,from){let a=from;for(const k of seq){if(t<=k[0])return lerpPose(a,k[1],ease(t/k[0]));t-=k[0];a=k[1]}return a}
function lerpPose(a,b,u){const r={};KEYS.forEach(k=>r[k]=a[k].map((v,i)=>v+(b[k][i]-v)*u));return r}
const seqDur=s=>s.reduce((a,k)=>a+k[0],0);
function seqEvents(seq,t0,t1){let acc=0;for(const k of seq){acc+=k[0];if(k[2]&&t0<acc&&t1>=acc)onEvent(k[2])}}
function onEvent(e){const x=root.position.x,z=root.position.z,D=CFG.damage,run=state===ST.RUN||nextAtk==='run';
  if(e==='HIT'){if(state===ST.ATTACK_LUNGE){mv=0;strike(3.4,70,D.lunge)}else if(state===ST.ATTACK_DOUBLE)strike(3.7,75,D.double);else strike(3.6,70,nextAtk==='run'?D.run:D.slash);snd('swish',x,z)}
  else if(e==='HIT2'){strike(3.7,75,D.double);snd('swish',x,z)}
  else if(e==='MOVE_ON'){mv=1}
  else if(e==='JUMP'){airborne=true;jumpFrom={x,z};const d=clamp(dP()-1.7,2,15);const a=Math.atan2(player.x-x,player.z-z);jumpTo={x:x+Math.sin(a)*d,z:z+Math.cos(a)*d};
    // Jamais teleportar através de uma construção no salto.
    if(window.FlorestaAI){for(let k=d;k>=0;k-=.65){
      const cand={x:x+Math.sin(a)*k,z:z+Math.cos(a)*k};
      if(!game.collides?.(cand.x,cand.z)&&window.FlorestaAI.clear(jumpFrom,cand,.28)){jumpTo=cand;break;}
      if(k<.65)jumpTo={x,z};
    }}
    snd('growl',x,z,.6,1)}
  else if(e==='LAND'){airborne=false;if(jumpTo){root.position.x=jumpTo.x;root.position.z=jumpTo.z}strike(4.2,95,D.leap);shake=Math.max(shake,.9);snd('hit',root.position.x,root.position.z)}
  else if(e==='ROAR'){snd('roar',x,z);shake=Math.max(shake,.8)}
  else if(e==='CRACK'){snd('crack',x,z);shake=Math.max(shake,.45)}
  else if(e==='PUSH'){mv=-1}
}
function pick(a){let s=0;a.forEach(x=>s+=x[1]);let r=Math.random()*s;for(const x of a){r-=x[1];if(r<=0)return x[0]}return a[0][0]}
let lastKnown=null,trackUntil=0,searchUntil=0;
function sensePrey(){
 const brain=window.FlorestaAI,now=performance.now();
 const distance=Math.hypot(root.position.x-player.x,root.position.z-player.z);
 const dark=(()=>{const h=Number(game.dayNight?.hour);return Number.isFinite(h)&&(h>=19||h<5.8)})();
 const torch=!!(game.isEquipped?.()&&game.isTorchLit?.());
 const seen=distance<(dark?(torch?25:12):27)&&(!brain||brain.clear(root.position,player,.4));
 const light=brain?.seeLight(root.position,30,1300);
 const heard=brain?.heard(root.position.x,root.position.z,33,5300);
 if(seen){lastKnown={x:player.x,z:player.z};trackUntil=now+3800;return true;}
 if(light){lastKnown={x:light.x,z:light.z};trackUntil=now+5200;return true;}
 if(heard){lastKnown={x:heard.x,z:heard.z};trackUntil=now+4800;return true;}
 if(now>trackUntil)lastKnown=null;return false;
}
function think(){if(!ai)return go(ST.STALK);const d=dP(),e=enraged?.75:1;nextAtk=null;
 if(!sensePrey()&&d>4.0){searchUntil=performance.now()+2000;return go(ST.STALK);}
 if(window.FlorestaAI&&!window.FlorestaAI.clear(root.position,player,.5)&&d>4.1)return go(ST.STALK);
  if(d<4.4)return go(pick([[Math.random()<.5?ST.ATTACK_SLASH_L:ST.ATTACK_SLASH_R,45],[ST.ATTACK_DOUBLE,32],[ST.ROAR,roarCd<=0?8:0],[ST.ATTACK_LEAP,leapCd<=0?10:0],[ST.STALK,10]]));
  if(d<10)return go(pick([[ST.ATTACK_LUNGE,30],[ST.ATTACK_LEAP,leapCd<=0?25:0],[ST.CHARGE,25],[ST.APPROACH,20],[ST.STALK,12*e]]));
  if(d<22)return go(pick([[ST.ATTACK_LEAP,leapCd<=0?26:0],[ST.CHARGE,36],[ST.STALK,24],[ST.ROAR,roarCd<=0?14:0]]));
  go(ST.RUN)}
function damage(amount,kind){if(!alive||WOLF_PHASE.includes(state)||state===ST.DEATH||state===ST.DEAD)return;
 lastKnown={x:player.x,z:player.z};trackUntil=performance.now()+6500;
  amount*=window.gameParry?.damageMultiplierFor?.('werewolf')??1;
  hp-=amount;poise+=amount;snd('hit',root.position.x,root.position.z);
  if(hp<=0){go(ST.DEATH);window.dispatchEvent(new CustomEvent('game:werewolf-defeated',{detail:{xp:CFG.xp}}));return}
  if(!enraged&&hp<=CFG.hp*.4){enraged=true;if(!airborne&&!ATTACKS.includes(state))go(ST.ROAR);return}
  if(airborne||state===ST.ATTACK_LEAP||state===ST.STAGGER)return;
  const committed=ATTACKS.includes(state)&&stT*ts>.55;if(committed&&poise<CFG.poiseMax)return;
  if(poise>=CFG.poiseMax||kind==='hammer'){poise=0;go(ST.STAGGER)}else go(ST.HIT_REACTION)}
function facingMe(range,half){const p=player,dx=root.position.x-p.x,dz=root.position.z-p.z,d=Math.hypot(dx,dz);if(d>range+CFG.bodyRadius)return false;const y=yawP();return (dx*Math.sin(y)+dz*Math.cos(y))/Math.max(.001,d)>=Math.cos(half*Math.PI/180)}
function onWeapon(ev,kind){if(!root.visible||!alive||isWolf||state===ST.DORMANT||state===ST.DEAD)return;if(kind==='axe'&&window.gameRightHand?.current!=='axe')return;
  const sw=ev.detail?.swingId??performance.now();if(sw===lastSwing)return;if(!facingMe(kind==='axe'?3.4:3.7,82))return;lastSwing=sw;
  damage(kind==='axe'?(window.gameProgression?.modifyAxeDamage?.(34)??34):54,kind)}
window.addEventListener('game:axe-impact',e=>onWeapon(e,'axe'));window.addEventListener('game:hammer-impact',e=>onWeapon(e,'hammer'));
window.gameEnemyOverheadUI?.registerExternal?.('v118:lobisomem',{root,type:'zombie',name:'Lobisomem',fallbackHeight:3.5,headGap:.3,getHp:()=>hp,getMaxHp:()=>CFG.hp,isAlive:()=>alive&&root.visible&&!isWolf&&state!==ST.DEAD});

// ============ LOOP / MÁQUINA DE ESTADOS ============
function bossBusy(){return !!(window.gameGiantBoss?.scheduled&&window.gameGiantBoss?.root?.visible)||!!(window.gameIgnis?.root?.visible&&window.gameIgnis?.state!=='DEAD')||!!window.gameMartialBoss?.active}
function schedule(dt){if(state!==ST.DORMANT||window.gameTestMode?.active||bossBusy())return;const dn=game.dayNight;if(!dn)return;const h=Number(dn.hour)||0,night=h>=20||h<4.8,day=Math.floor(Number(dn.day)||1),key=h<12?day-1:day;
  if(!night||day<CFG.spawnNight||key===nightKey){nightTimer=0;return}nightTimer+=dt;if(nightTimer>=CFG.spawnDelay){nightKey=key;nightTimer=0;start()}}
function nightSounds(dt){if(!AC||atm<.3)return;sndT-=dt;if(sndT>0)return;sndT=rnd(1.6,4.8);const a=rnd(6.28),r=rnd(9,34),x=player.x+Math.sin(a)*r,z=player.z+Math.cos(a)*r;Math.random()<.35?snd('twig',x,z):snd('rustle',x,z,rnd(.15,.4))}
function eyeUpdate(dt){let t=eyeT;if(vanishLeft>0){vanishLeft-=dt;t=0}else if(isWolf&&state===ST.WOLF_RUN_IN_FOREST){vanishT-=dt;if(vanishT<=0){vanishT=rnd(1.4,3);vanishLeft=rnd(.4,.9)}}
  eyeAmt+=(t-eyeAmt)*(1-Math.exp(-dt*(t>eyeAmt?5:14)));const d=dP(),sz=(.2+d*.0065)*(.8+.2*Math.sin(time*7+1.3))*eyeAmt/Math.max(.05,root.scale.x);
  eyeSpr.forEach(s=>{s.visible=eyeAmt>.02&&d<120;s.scale.set(sz,sz,1)});EYEM.color.setRGB(1*eyeAmt+.12,.35*eyeAmt+.04,.12*eyeAmt+.02)}
function update(dt){
  if(window.gameParry?.isBroken?.('werewolf')&&state!==ST.DEATH&&state!==ST.DEAD){root.position.y=game.groundY(root.position.x,root.position.z);root.updateMatrixWorld(true);return}
  stT+=dt;time+=dt;atkCd-=dt;leapCd-=dt;roarCd-=dt;const d=dP(),x=root.position.x,z=root.position.z;let tp=null;
  const seqName=({[ST.DISTANT_HOWL]:'HOWL',[ST.WOLF_STOP_AND_STARE]:'STARE',[ST.TRANSFORM_START]:'TRANSFORM_START',[ST.TRANSFORM_LOOP]:'TRANSFORM_LOOP',[ST.TRANSFORM_COMPLETE]:'TRANSFORM_COMPLETE',[ST.ATTACK_SLASH_L]:'ATTACK_SLASH_L',[ST.ATTACK_SLASH_R]:'ATTACK_SLASH_R',[ST.ATTACK_DOUBLE]:'ATTACK_DOUBLE',[ST.ATTACK_LUNGE]:'ATTACK_LUNGE',[ST.ATTACK_LEAP]:'ATTACK_LEAP',[ST.ROAR]:'ROAR',[ST.HIT_REACTION]:'HIT_REACTION',[ST.STAGGER]:'STAGGER',[ST.DEATH]:'DEATH',[ST.DEAD]:'DEATH'})[state];
  const wolfRun=()=>{gaitPh+=dt*CFG.wolfRunSpeed*.9;if(Math.floor(gaitPh/Math.PI)!==stepSide){stepSide=Math.floor(gaitPh/Math.PI);snd('step',root.position.x,root.position.z,false)}tp=gait('wolfRun',gaitPh)};
  const orbit=(sp,dir)=>{const ox=root.position.x,oz=root.position.z;ang+=dir*(sp/Math.max(8,rad))*dt;const nx=player.x+Math.sin(ang)*rad,nz=player.z+Math.cos(ang)*rad;if(!game.collides?.(nx,nz)){root.position.x=nx;root.position.z=nz}else rad+=1.2*dt*8;const dx=root.position.x-ox,dz=root.position.z-oz;if(Math.hypot(dx,dz)>.0005)root.rotation.y+=wrap(Math.atan2(dx,dz)-root.rotation.y)*Math.min(1,dt*8)};
  switch(state){
  case ST.DISTANT_HOWL:{tp=seqPose(SQ.HOWL,stT,WOLF);if(prevSeqT<.6&&stT>=.6)snd('howl',x,z,5.4);if(stT>3.6)eyeT=.35;if(stT>=6.2){go(ST.WOLF_REVEAL)}break}
  case ST.WOLF_REVEAL:{const dir=Math.sign(wrap(targetAng-ang))||1;rad=lerp(CFG.startRadius,CFG.startRadius-6,ease(stT/3.4));orbit(CFG.wolfRunSpeed,dir);wolfRun();if(stT>=3.4)go(ST.WOLF_RUN_IN_FOREST);break}
  case ST.WOLF_RUN_IN_FOREST:{const u=stT/7.8,dd=wrap(targetAng-ang),k=ease((stT-1)/5)*2.4;ang+=dd*Math.min(1,k*dt);rad=lerp(CFG.startRadius-6,CFG.stareRadius,ease(u))+Math.sin(stT*2.1)*.9;
    orbit(CFG.wolfRunSpeed,Math.sign(dd)||1);wolfRun();if(stT>.8&&Math.random()<dt*.9)snd('rustle',x,z,.35);if((u>=1&&Math.abs(dd)<.14)||stT>12)go(ST.WOLF_STOP_AND_STARE);break}
  case ST.WOLF_STOP_AND_STARE:{tp=seqPose(SQ.STARE,stT%3.5,WOLF);turnTo(player.x,player.z,dt,3);if(Math.floor(stT*2)!==Math.floor((stT-dt)*2)&&stT<2.6)snd('pant',x,z);if(stT>=3.7)go(ST.TRANSFORM_START);break}
  case ST.TRANSFORM_START:case ST.TRANSFORM_LOOP:case ST.TRANSFORM_COMPLETE:{turnTo(player.x,player.z,dt,1.2);if(state===ST.TRANSFORM_LOOP)shake=Math.max(shake,.35);break}
  case ST.WEREWOLF_IDLE:{tp=BASE;turnTo(player.x,player.z,dt,1.6);idleT+=dt;if(Math.floor(time*1.1)!==Math.floor((time-dt)*1.1)&&Math.random()<.5)snd('growl',x,z,1.3,.5);if(idleT>1.3)d>16?go(ST.STALK):think();break}
  case ST.STALK:{const sensed=sensePrey(),mark=!sensed&&lastKnown?lastKnown:player;
    if(!sensed&&!lastKnown){tp=gait('stalk',gaitPh);turnTo(player.x,player.z,dt,.5);if(stT>2.4)go(ST.WEREWOLF_IDLE);break;}
    if(!sensed&&lastKnown){moveToward(mark.x,mark.z,CFG.stalkSpeed*.85,dt,2.2);turnTo(mark.x,mark.z,dt,2);gaitPh+=dt*CFG.stalkSpeed;tp=gait('stalk',gaitPh);if(stT>3.2)think();break;}
    const r0=Math.hypot(root.position.x-player.x,root.position.z-player.z),a0=Math.atan2(root.position.x-player.x,root.position.z-player.z),tr=clamp(r0-.7*dt*CFG.stalkSpeed*.5,8.5,40);ang=a0+stalkDir*(CFG.stalkSpeed/Math.max(6,r0))*dt;const nx=player.x+Math.sin(ang)*tr,nz=player.z+Math.cos(ang)*tr;tryMove(nx,nz);turnTo(player.x,player.z,dt,2.2);
    gaitPh+=dt*CFG.stalkSpeed*1.5;if(Math.floor(gaitPh/Math.PI)!==stepSide){stepSide=Math.floor(gaitPh/Math.PI);snd('step',x,z,true)}tp=gait('stalk',gaitPh);if(stT>stalkEnd)think();break}
  case ST.APPROACH:{if(d>5&&window.FlorestaAI&&!window.FlorestaAI.clear(root.position,player,.4)){go(ST.STALK);break;}moveToward(player.x,player.z,CFG.approachSpeed,dt,4.2);turnTo(player.x,player.z,dt,2.4);gaitPh+=dt*CFG.approachSpeed*1.6;if(Math.floor(gaitPh/Math.PI)!==stepSide){stepSide=Math.floor(gaitPh/Math.PI);snd('step',x,z,true)}tp=gait('walk',gaitPh);if(d<4.6||stT>3.2)think();break}
  case ST.RUN:case ST.CHARGE:{if(d>6&&window.FlorestaAI&&!window.FlorestaAI.clear(root.position,player,.4)){go(ST.STALK);break;}const sp=CFG.runSpeed*(enraged?1.2:1)*(state===ST.CHARGE?1.12:1);moveToward(player.x,player.z,sp,dt,2.6);turnTo(player.x,player.z,dt,4.2);gaitPh+=dt*sp*1.05;if(Math.floor(gaitPh/Math.PI)!==stepSide){stepSide=Math.floor(gaitPh/Math.PI);snd('step',x,z,true);shake=Math.max(shake,.12)}tp=gait('run',gaitPh);
    if(state===ST.RUN&&(d<8||stT>3))think();else if(state===ST.CHARGE&&(d<3.6||stT>1.9)){nextAtk='run';go(Math.random()<.5?ST.ATTACK_SLASH_R:ST.ATTACK_SLASH_L);ts=1.5}break}
  case ST.DEAD:{deadT+=dt;if(deadT>6){root.visible=false;go(ST.DORMANT);window.gameProgression?.dropXP?.(CFG.xp,root.position.clone(),'Lobisomem');setAtm(0)}tp=cur;break}
  }
  if(seqName&&state!==ST.DISTANT_HOWL&&state!==ST.WOLF_STOP_AND_STARE){const seq=SQ[seqName],t=stT*ts,tot=seqDur(seq),from=isWolf&&state!==ST.TRANSFORM_LOOP&&state!==ST.TRANSFORM_COMPLETE?WOLF:BASE;
    tp=state===ST.TRANSFORM_START?seqPose(seq,t,WOLF):seqPose(seq,t,state===ST.TRANSFORM_LOOP?SQ.TRANSFORM_START[2][1]:state===ST.TRANSFORM_COMPLETE?SQ.TRANSFORM_LOOP[2][1]:from);
    seqEvents(seq,prevSeqT,t);
    if(ATTACKS.includes(state)){const wind=state===ST.ATTACK_LEAP?.8:state===ST.ATTACK_LUNGE?.55:.6;if(t<wind&&!airborne)turnTo(player.x,player.z,dt,3);if(mv===1&&state===ST.ATTACK_LUNGE)moveToward(player.x,player.z,19,dt,1.6);
      if(airborne&&jumpTo){const u=clamp((t-.8)/.6,0,1);root.position.x=lerp(jumpFrom.x,jumpTo.x,u);root.position.z=lerp(jumpFrom.z,jumpTo.z,u)}}
    if(state===ST.STAGGER&&mv===-1){const bx=x-player.x,bz=z-player.z,l=Math.hypot(bx,bz)||1;tryMove(x+bx/l*3*dt,z+bz/l*3*dt)}
    prevSeqT=t;
    if(t>=tot){if(state===ST.DEATH)go(ST.DEAD);else if(state===ST.TRANSFORM_START)go(ST.TRANSFORM_LOOP);else if(state===ST.TRANSFORM_LOOP)go(ST.TRANSFORM_COMPLETE);else if(state===ST.TRANSFORM_COMPLETE)go(ST.WEREWOLF_IDLE);else if(state!==ST.DEAD){nextAtk=null;poseK=9;think()}}}
  else if(state===ST.DISTANT_HOWL||state===ST.WOLF_STOP_AND_STARE)prevSeqT=stT;
  if(state===ST.DISTANT_HOWL||state===ST.WOLF_STOP_AND_STARE||state===ST.WEREWOLF_IDLE)poseK=9;
  if(state===ST.WOLF_REVEAL||state===ST.WOLF_RUN_IN_FOREST)poseK=14;
  let yOff=0;if(airborne){const u=clamp((stT*ts-.8)/.6,0,1);yOff=Math.sin(u*Math.PI)*2.4}
  root.position.y=game.groundY(root.position.x,root.position.z)+yOff;
  if(tp)applyPose(tp,dt);spasm*=Math.exp(-dt*(state===ST.TRANSFORM_LOOP?0:1.4));
  // colisão corpo x jogador
  if(root.visible&&alive&&!isWolf){const dx=player.x-root.position.x,dz=player.z-root.position.z,dd=Math.hypot(dx,dz),min=CFG.bodyRadius+(Number(player.radius)||.42);if(dd<min&&dd>.001)push(min-dd,dx/dd,dz/dd)}
  root.updateMatrixWorld(true);eyeUpdate(dt);
}
let previewIv=null;
function start(){clearInterval(previewIv);if(state!==ST.DORMANT)return false;alive=true;go(ST.DISTANT_HOWL);return true}
function spawnWerewolf(dist=13){clearInterval(previewIv);const y=yawP();ang=y;rad=dist;place();root.rotation.y=Math.atan2(player.x-root.position.x,player.z-root.position.z);alive=true;hp=CFG.hp;enraged=false;isWolf=false;root.visible=true;eyeT=1;Object.assign(cur,cp(BASE));setAtm(1);go(ST.WEREWOLF_IDLE)}
let last=performance.now();
function loop(now){requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
  atmosphere(dt);ambience(dt);shake*=Math.exp(-dt*5);nightSounds(dt);schedule(dt);
  if(state!==ST.DORMANT)update(dt);else if(atmT>0&&atm>0)atmT=0;
  if(state===ST.DORMANT&&root.visible)root.visible=false}
requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

 window.gameWerewolf={version:'V125',root,bones:B,config:CFG,states:ST,
  damageSword(amount){if(!root.visible||!alive||isWolf||state===ST.DORMANT||state===ST.DEATH||state===ST.DEAD)return false;damage(amount,'sword');return true;},
  get state(){return state},get hp(){return hp},get maxHp(){return CFG.hp},get form(){return isWolf?'wolf':'werewolf'},get atmosphere(){return atm},
  damageRadius(x,z,radius,baseDamage,sourceLabel='Dano em área',hitSet=null){
    if(!root.visible||!alive||isWolf||state===ST.DORMANT||state===ST.DEATH||state===ST.DEAD)return 0;
    const set=hitSet||new Set();if(set.has(root))return 0;
    const d=Math.hypot(root.position.x-x,root.position.z-z);if(d>radius+CFG.bodyRadius*.35)return 0;
    set.add(root);const falloff=Math.max(.60,1-.40*d/Math.max(.001,radius));damage(Math.max(0,baseDamage)*falloff,'fire');return 1;
  },
  start,spawnNow:spawnWerewolf,
  skipTo(n){if(!ST[n])return false;clearInterval(previewIv);if(state===ST.DORMANT){alive=true;ang=yawP();rad=CFG.stareRadius;place();root.visible=true;setAtm(1)}isWolf=WOLF_PHASE.includes(ST[n])&&n!=='TRANSFORM_COMPLETE';targetAng=yawP();go(ST[n]);root.visible=true;return true},
  preview(form='werewolf'){clearInterval(previewIv);alive=true;ai=false;state=ST.DORMANT;ang=yawP();rad=7;place();root.rotation.y=Math.atan2(player.x-root.position.x,player.z-root.position.z);root.visible=true;isWolf=form==='wolf';Object.assign(cur,cp(isWolf?WOLF:BASE));eyeT=1;setAtm(1);const p=isWolf?WOLF:BASE;previewIv=setInterval(()=>{if(state!==ST.DORMANT||!root.visible)return clearInterval(previewIv);applyPose(p,.016);eyeUpdate(.016)},16);return true},
  setAI(v=true){ai=!!v;return ai},setAtmosphere(v){setAtm(clamp(+v||0,0,1))},
  kill(){if(root.visible&&alive)damage(1e6,'debug')},
  reset(){clearInterval(previewIv);state=ST.DORMANT;alive=true;ai=true;hp=CFG.hp;isWolf=true;root.visible=false;airborne=false;setAtm(0);nightKey=null;nightTimer=0;return true}
};
console.info('[V118 LOBISOMEM] pronto • gameWerewolf.start() / .skipTo("TRANSFORM_START") / .spawnNow() / .preview("wolf"|"werewolf")');
})().catch(err=>{console.error('V118 Lobisomem:',err);const s=document.getElementById('status');if(s)s.textContent='Falha ao integrar Lobisomem: '+String(err?.message||err)});

