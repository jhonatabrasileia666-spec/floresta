
/* V248: câmera nos olhos e quadril estabilizado sem deslocamento horizontal forçado. */
(()=>{
'use strict';
const DATA=window.__FLORESTA_PUSH_FRAMES_FIXED__;
const status=window.gameCartPushAnimations={version:'V240-rear-contact-IK',ready:false,phase:'waiting',matches:0,appliedFrames:0,start:0,push:0,stop:0,error:null};
const norm=n=>String(n||'').replace(/^.*[|:]/,'').replace(/^mixamorig/i,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
const smooth=x=>{x=clamp(x,0,1);return x*x*(3-2*x)};
let T,rig,skeleton,clips,bindings,hips,phase='idle',elapsed=0,engagedLast=false,transition=null,lastOutput=null,heldTime=0;
let eyeBefore,eyeAfter,previousX,previousZ,lastHipY,releasedCart=null;
const hidden=new Map();
function restoreObjects(){for(const [o,v] of hidden)o.visible=v;hidden.clear()}
function hide(o){if(o&&!hidden.has(o)){hidden.set(o,o.visible);o.visible=false}}
function initialize(g){
 T=window.__THREE_MODULE;rig=g?.trueFirstPerson;
 if(!T?.Quaternion||!rig?.model||!rig.fullMesh?.skeleton)return false;
 skeleton=rig.fullMesh.skeleton;
 // O FBX também contém Beta_Joints: ossos de visualização com os MESMOS nomes.
 // Nunca resolver por model.traverse + Map.set: isso seleciona o esqueleto errado.
 const byName=new Map();for(const b of skeleton.bones)if(!byName.has(norm(b.name)))byName.set(norm(b.name),b);
 clips={};for(const key of DATA.order){
  const c=DATA.clips[key],bytes=Uint8Array.from(atob(c.packed),s=>s.charCodeAt(0));
  const dv=new DataView(bytes.buffer),data=new Int16Array(bytes.length/2);
  for(let i=0;i<data.length;i++)data[i]=dv.getInt16(i*2,true);
  clips[key]={...c,data};
 }
 bindings=DATA.clips.push.names.map(name=>({name,bone:byName.get(name)})).filter(x=>x.bone&&!/^(head|headtop|headtopend|neck)$/.test(x.name));
 if(bindings.length<40)throw Error('Esqueleto visível incompatível: '+bindings.length+' canais.');
 for(const b of bindings){b.q=new T.Quaternion();b.native=new T.Quaternion();b.index={};for(const key of DATA.order)b.index[key]=clips[key].names.indexOf(b.name)}
 hips=byName.get('hips');eyeBefore=new T.Vector3();eyeAfter=new T.Vector3();
 status.matches=bindings.length;status.ready=true;status.phase=phase;
 previousX=g.player.x;previousZ=g.player.z;
 return true;
}
function capture(){return bindings.map(b=>b.bone.quaternion.clone())}
function setPhase(next){
 transition=lastOutput?{q:lastOutput.map(q=>q.clone()),hipY:lastHipY??hips.position.y}:null;
 if(next==='stop')stopContactWeight=lastContactWeight;
 phase=next;elapsed=0;status.phase=next;
 if(next==='start')status.start++;if(next==='push')status.push++;if(next==='stop')status.stop++;
}
function busy(){return !!(window.gameInventory?.isOpen||window.gameCraft?.active||window.gameConstruction?.active||document.body.classList.contains('editor-open')||document.body.classList.contains('forge-open')||document.body.classList.contains('construction-open')||document.body.classList.contains('skills-open')||window.gameHackMode?.state?.open)}
function sample(key,t){
 const c=clips[key],f=clamp(t*DATA.fps,0,c.frames-1),a=Math.floor(f),b=Math.min(a+1,c.frames-1),u=f-a,n=c.names.length;
 for(const target of bindings){const i=target.index[key];if(i<0){target.q.copy(target.native);continue}const ai=(a*n+i)*4,bi=(b*n+i)*4;
  target.q.set(c.data[ai]/32767,c.data[ai+1]/32767,c.data[ai+2]/32767,c.data[ai+3]/32767).normalize();
  tempQ.set(c.data[bi]/32767,c.data[bi+1]/32767,c.data[bi+2]/32767,c.data[bi+3]/32767).normalize();target.q.slerp(tempQ,u);
 }
 return c.hipY[a]+(c.hipY[b]-c.hipY[a])*u;
}
let tempQ;
// Pontos na face EXTERNA da borda traseira; os dedos alcançam a madeira.
// Barra REAL do modelo: topo y=1.41, face de tras z=-1.04 (coordenadas do carrinho).
// Punhos um pouco acima e fora da madeira; os dedos apoiam sobre a borda, sem atravessar.
const rearGrip={left:{x:.34,y:1.435,z:-1.115},right:{x:-.34,y:1.435,z:-1.115}};
let contactRig=null,contactArms=null,contactScratch=null,lastContactWeight=0,stopContactWeight=0;
function setupContact(){
 if(contactRig===skeleton)return;
 const map=new Map();for(const b of skeleton.bones)if(!map.has(norm(b.name)))map.set(norm(b.name),b);
 contactArms=['left','right'].map(side=>({side,upper:map.get(side+'arm'),lower:map.get(side+'forearm'),hand:map.get(side+'hand')}));
 contactScratch=Array.from({length:9},()=>new T.Vector3());contactRig=skeleton;
}
function aimJoint(bone,child,goal){
 const [a,b,,,,,,,]=contactScratch;
 bone.getWorldPosition(a);child.getWorldPosition(b);b.sub(a).normalize();
 const direction=goal.clone().sub(a).normalize();
 const world=bone.getWorldQuaternion(new T.Quaternion());
 world.premultiply(new T.Quaternion().setFromUnitVectors(b,direction));
 const parent=bone.parent.getWorldQuaternion(new T.Quaternion()).invert();
 bone.quaternion.copy(parent.multiply(world)).normalize();bone.updateWorldMatrix(true,true);
}
function applyRearContact(g,t){
 const entry=window.gameTransport?.active?.kind==='cart'?window.gameTransport.active:releasedCart;
 if(!entry?.site?.root)return;
 setupContact();const root=entry.site.root;root.updateWorldMatrix(true,false);
 const grip=phase==='start'?smooth((t/clips.start.duration-.35)/.45):phase==='stop'?stopContactWeight*(1-smooth(t/.65)):1;
 lastContactWeight=grip;
 let maxError=0;
 for(const arm of contactArms){
  if(!arm.upper||!arm.lower||!arm.hand)continue;
  const [a,b,c,dir,pole,goal,elbow,anchor,local]=contactScratch;
  rig.model.updateMatrixWorld(true);
  arm.upper.getWorldPosition(a);arm.lower.getWorldPosition(b);arm.hand.getWorldPosition(c);
  const savedHand=arm.hand.getWorldQuaternion(new T.Quaternion());
  const cfg=rearGrip[arm.side];anchor.set(cfg.x,cfg.y,cfg.z);root.localToWorld(anchor);
  goal.copy(c).lerp(anchor,grip);
  // Até na aproximação/soltura, o punho fica fora da face traseira.
  local.copy(goal);root.worldToLocal(local);local.z=Math.min(local.z,cfg.z);root.localToWorld(local);goal.copy(local);
  const upperLength=a.distanceTo(b),lowerLength=b.distanceTo(c);
  dir.copy(goal).sub(a);const reach=dir.length();if(reach<1e-5)continue;dir.multiplyScalar(1/reach);
  const distance=clamp(reach,Math.abs(upperLength-lowerLength)+.0001,upperLength+lowerLength-.0001);
  pole.copy(b).sub(a).addScaledVector(dir,-pole.dot(dir));
  if(pole.lengthSq()<1e-8)pole.set(arm.side==='left'?-1:1,-.3,0).addScaledVector(dir,-pole.dot(dir));
  pole.normalize();
  const along=(upperLength*upperLength-lowerLength*lowerLength+distance*distance)/(2*distance);
  const perpendicular=Math.sqrt(Math.max(0,upperLength*upperLength-along*along));
  elbow.copy(a).addScaledVector(dir,along).addScaledVector(pole,perpendicular);
  // aimJoint reutiliza somente a/b; preserva os alvos em vetores separados.
  aimJoint(arm.upper,arm.lower,elbow);
  aimJoint(arm.lower,arm.hand,goal);
  const parentWorld=arm.hand.parent.getWorldQuaternion(new T.Quaternion()).invert();
  arm.hand.quaternion.copy(parentWorld.multiply(savedHand)).normalize();arm.hand.updateWorldMatrix(true,true);
  if(grip>.999)maxError=Math.max(maxError,arm.hand.getWorldPosition(c).distanceTo(anchor));
 }
 status.handContactError=maxError;status.handContact=grip>.999?'rear-rim':'transition';
}

function render(time,moving,dt){
 if(status.error)return;
 try{
 const g=window.gameReview;
 if(!status.ready||rig!==g?.trueFirstPerson||skeleton!==g?.trueFirstPerson?.fullMesh?.skeleton){if(!initialize(g))return;tempQ=new T.Quaternion();lastOutput=null;transition=null}
 const engaged=window.gameTransport?.active?.kind==='cart';
 if(engaged)releasedCart=window.gameTransport.active;
 // V250: ao empurrar o carrinho, permite abaixar um pouco mais o olhar para ver a mão
 // para manter o enquadramento limpo e impedir que a câmera desça além
 // da borda traseira aprovada pelo usuário.
 if(engaged&&g?.player)g.player.pitch=Math.max(g.player.pitch,-0.44);
 const step=busy()?0:clamp(Number(dt)||0,0,.05);
 const distance=Math.hypot(g.player.x-previousX,g.player.z-previousZ);previousX=g.player.x;previousZ=g.player.z;
 const walking=engaged&&!busy()&&(!!moving||distance>Math.max(.0001,step*.06));
 if(engaged&&!engagedLast)setPhase('start');else if(!engaged&&engagedLast&&phase!=='idle')setPhase('stop');engagedLast=engaged;
 if(phase==='idle'){restoreObjects();lastOutput=null;return}
 if(phase==='push'&&!walking){heldTime=elapsed%clips.push.duration;setPhase('hold')}
 else if(phase==='hold'&&walking){setPhase('push');elapsed=heldTime}
 for(const b of bindings)b.native.copy(b.bone.quaternion);
 rig.model.updateMatrixWorld(true);rig.eyeSocket?.getWorldPosition(eyeBefore);
 let key=phase==='stop'?'stop':phase==='start'?'start':'push';
 let t=phase==='hold'?heldTime:phase==='push'?elapsed%clips.push.duration:Math.min(elapsed,clips[key].duration);
 let weight=phase==='start'?smooth(elapsed/.18):phase==='stop'?smooth((clips.stop.duration-elapsed)/.28):1;
 const nativeHipY=hips.position.y,hipY=sample(key,t),blend=smooth(elapsed/.16);
 for(let i=0;i<bindings.length;i++){
  const b=bindings[i];if(transition)b.q.slerpQuaternions(transition.q[i],b.q,blend);
  b.bone.quaternion.copy(b.native).slerp(b.q,weight);
 }
 // V249: mantém a translação do quadril do FBX apenas como microvariação.
 // Nos 3 clips a raiz varia dezenas de unidades Mixamo (centímetros),
 // deslocando toda a cabeça para cima/baixo durante a caminhada e fazendo
 // a visão entrar na madeira. Ossos, braços, mãos e passos continuam animados.
 const hipTarget=transition?transition.hipY+(hipY-transition.hipY)*blend:hipY;
 const hipSafe=clamp(hipTarget-nativeHipY,-3.2,3.2);
 hips.position.y=nativeHipY+hipSafe*weight;
 rig.model.updateMatrixWorld(true);
 applyRearContact(g,t);
 rig.model.updateMatrixWorld(true);
 if(rig.eyeSocket&&g.camera){
  rig.eyeSocket.getWorldPosition(eyeAfter);
  // V248: a visão volta a acompanhar os olhos de verdade (como na V246).
  // A V247 retirou esta ligação e deixou a cabeça/corpo separados da câmera.
  const eyeDelta=eyeAfter.sub(eyeBefore);
  if(engaged){
   // Filtra somente deslocamentos anormais em um único frame do FBX.
   eyeDelta.x=clamp(eyeDelta.x,-.18,.18);
   eyeDelta.y=clamp(eyeDelta.y,-.12,.15);
   eyeDelta.z=clamp(eyeDelta.z,-.18,.18);
  }
  g.camera.position.add(eyeDelta);
  // Elevação estável acima da barra, sem alterar o contato físico das mãos.
  const contactLift=phase==='start'?smooth(Math.max(0,(elapsed-.12)/.22))*.24:phase==='stop'?stopContactWeight*(1-smooth(elapsed/.42))*.24:.24;
  if(contactLift>0){
   const forward=new T.Vector3(-Math.sin(g.player.yaw||0),0,-Math.cos(g.player.yaw||0));
   g.camera.position.y+=contactLift;
   g.camera.position.addScaledVector(forward,.045*contactLift/.24);
  }
  // Correção somente VERTICAL quando há carrinho engatado: nunca move a câmera
  // até outro lado da carroceria ou para baixo do carrinho (bug da V247).
  const cart=engaged?window.gameTransport.active:null;
  if(cart?.site?.root){
   const rimY=cart.site.root.position.y+1.41;
   const safeY=Math.max(eyeBefore.y+.06,rimY+.24);
   if(g.camera.position.y<safeY)g.camera.position.y=safeY;
   // Cabeça no mesmo X/Z do personagem, mesmo com grandes poses de caminhada.
   const dx=g.camera.position.x-g.player.x,dz=g.camera.position.z-g.player.z;
   const radial=Math.hypot(dx,dz);
   if(radial>.32){const m=.32/radial;g.camera.position.x=g.player.x+dx*m;g.camera.position.z=g.player.z+dz*m;}
  }
  g.camera.updateMatrixWorld(true);
 }
 skeleton.update();lastOutput=capture();lastHipY=hips.position.y;status.appliedFrames++;status.clip=key;status.time=t;
 hide(g.torchRoot);hide(window.gameRightHand?.object);
 elapsed+=step;
 if(phase==='start'&&elapsed>=clips.start.duration){heldTime=0;setPhase(engaged?(walking?'push':'hold'):'stop')}
 else if(phase==='stop'&&elapsed>=clips.stop.duration){phase='idle';status.phase='idle';transition=null;lastOutput=null;restoreObjects()}
 }catch(e){restoreObjects();status.error=String(e?.stack||e);console.error('[Carrinho FBX]',e)}
}
// AD chama este ponto depois de TODAS as rotinas do avatar e antes de renderizar.
window.__FLORESTA_CART_PUSH_RENDER=render;
// Restaura a visibilidade antes da lógica nativa decidir os equipamentos do frame.
const install=()=>{
 const native=window.__updateAnimatedAvatar;if(typeof native!=='function')return false;
 if(native.__cartRestore)return true;
 const wrapped=function(...args){restoreObjects();return native.apply(this,args)};wrapped.__cartRestore=true;window.__updateAnimatedAvatar=wrapped;return true;
};
if(!install()){const timer=setInterval(()=>{if(install())clearInterval(timer)},100)}
})();
