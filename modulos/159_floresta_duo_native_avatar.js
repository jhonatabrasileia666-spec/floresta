/* FLORESTA DUO — o avatar remoto reutiliza o próprio rig Mixamo do jogo.
   Ossos recebem poses discretas do outro jogador; não usa boneco low-poly.
   Geometria e materiais do rig pertencem ao jogo e NUNCA são descartados aqui. */
(()=>{'use strict';
if(window.FlorestaDuoAvatar)return;
const JOINTS=new Set(('hips spine spine1 spine2 spine3 neck head headtop leftshoulder leftarm leftforearm lefthand rightshoulder rightarm rightforearm righthand leftupleg leftleg leftfoot lefttoebase rightupleg rightleg rightfoot righttoebase lefttoeend righttoeend leftfootend rightfootend').split(' '));
const norm=name=>String(name||'').replace(/^.*[|:]/,'').replace(/^mixamorig/i,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
const round=n=>Math.round(n*1000)/1000;
const getRig=()=>window.gameReview?.trueFirstPerson;
const three=()=>window.__THREE_MODULE;
function capture(){
 const mesh=getRig()?.fullMesh;
 const bones=mesh?.skeleton?.bones;
 if(!Array.isArray(bones)||!bones.length)return null;
 const out=[];
 for(const bone of bones){
  const key=norm(bone.name);
  if(!JOINTS.has(key))continue;
  const q=bone.quaternion;
  if(!q||![q.x,q.y,q.z,q.w].every(Number.isFinite))continue;
  out.push([key,round(q.x),round(q.y),round(q.z),round(q.w)]);
 }
 return out.length>=12?out:null;
}
function includes(root,child){
 let p=child;while(p){if(p===root)return true;p=p.parent;}return false;
}
function makeSkeletonClone(source){
 const T=three();
 if(!source?.clone||!T?.Skeleton)return null;
 const cloned=source.clone(true),originals=[],copies=[];
 source.traverse(x=>originals.push(x));
 cloned.traverse(x=>copies.push(x));
 if(originals.length!==copies.length)return null;
 const nodes=new Map(originals.map((x,i)=>[x,copies[i]]));
 for(const orig of originals){
  if(!orig.isSkinnedMesh||!orig.skeleton)continue;
  const twin=nodes.get(orig);
  const bones=orig.skeleton.bones.map(b=>nodes.get(b));
  if(bones.some(b=>!b)){
   console.warn('[DUO AVATAR] rig incompleto, não usar ossos do jogador local');
   return null;
  }
  const inv=orig.skeleton.boneInverses.map(m=>m.clone());
  twin.bind(new T.Skeleton(bones,inv),orig.bindMatrix.clone());
  twin.bindMode=orig.bindMode;
  twin.frustumCulled=false;
 }
 return {cloned,nodes};
}
function sourceRig(){
 const tfp=getRig();
 if(!tfp?.fullMesh?.skeleton?.bones?.length)return null;
 if(tfp.model&&includes(tfp.model,tfp.fullMesh))return {root:tfp.model,tfp};
 if(tfp.visibleRoot&&includes(tfp.visibleRoot,tfp.fullMesh))return {root:tfp.visibleRoot,tfp};
 return null;
}
function createHair(peer){
 const api=window.gameCharacterV263;
 const head=peer.bones.get('head');
 if(!api?.makeRemoteHair||!head)return;
 if(peer.hair)peer.hair.removeFromParent();
 // Hair model is generated from the same cutter/colour logic as the main character.
 peer.hair=api.makeRemoteHair(head,peer.look||{style:'curto',color:'#29211c',size:1});
}
function create(peer,T,g){
 if(peer.nativeAvatar||!g?.scene)return false;
 const source=sourceRig();
 if(!source)return false;
 const data=makeSkeletonClone(source.root);
 if(!data)return false;
 const {cloned,nodes}=data;
 const full=nodes.get(source.tfp.fullMesh);
 if(!full){
  console.warn('[DUO AVATAR] malha do corpo não encontrada na cópia');
  return false;
 }
 const local=nodes.get(source.tfp.localMesh);
 // Local first-person mesh and camera callbacks must not hide remote player.
 if(local&&local!==full)local.visible=false;
 full.visible=true;full.onBeforeRender=()=>{};full.onAfterRender=()=>{};
 cloned.visible=true;
 cloned.position.set(0,0,0);
 cloned.rotation.set(0,Math.PI,0); // Mixamo's +Z face vs. FLORESTA camera's -Z forward
 // Keep the original FBX rig scale; the peer root uses world-space metres.
 cloned.traverse(o=>{
  if(o.isSkinnedMesh||o.isMesh){o.onBeforeRender=()=>{};o.onAfterRender=()=>{};o.frustumCulled=false;}
  if(o.name==='Floresta_Cabelo_Jogador_V264')o.visible=false;
 });
 const root=new T.Group();
 root.name='FlorestaDuoNativeRig_'+peer.id;
 root.add(cloned);
 const bones=new Map();
 const clonedFull=full.skeleton?.bones||[];
 for(const b of clonedFull){const key=norm(b.name);if(key&&!bones.has(key))bones.set(key,b);}
 if(bones.size<12)return false;
 // Use independent name-tag texture; never alter the original rig's materials.
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;
 const ctx=canvas.getContext('2d');
 ctx.fillStyle='rgba(7,15,10,.77)';ctx.fillRect(3,5,250,49);
 ctx.strokeStyle='#ab9060';ctx.strokeRect(3,5,250,49);
 ctx.fillStyle='#f1ddb6';ctx.textAlign='center';ctx.font='bold 21px system-ui';
 ctx.fillText(String(peer.name||'Viajante').slice(0,18),128,38);
 const tex=new T.CanvasTexture(canvas);
 const label=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
 label.position.y=2.24;label.scale.set(1.6,.4,1);root.add(label);
 peer.nativeAvatar=true;peer.root=root;peer.full=full;peer.rigBody=cloned;peer.bones=bones;
 peer.nativeLabel=label;peer.hair=null;peer.gear=new Map();peer.firstPose=false;peer.look=null;
 // All existing actual geometry/texture references remain shared, with no re-fetch or T-pose.
 g.scene.add(root);return true;
}
function dispose(peer){
 if(!peer.nativeAvatar)return false;
 for(const g of peer.gear?.values()||[])clearGear(g);
 peer.gear?.clear();
 if(peer.hair){
  const mats=new Set();peer.hair.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.();if(o.material)mats.add(o.material);}});
  for(const m of mats)m.dispose?.();peer.hair.removeFromParent();peer.hair=null;
 }
 peer.nativeLabel?.material?.map?.dispose?.();
 peer.nativeLabel?.material?.dispose?.();
 peer.nativeLabel?.removeFromParent?.();
 peer.root?.removeFromParent?.();
 // Intentionally keep original rig, skeleton material and geometries alive.
 peer.root=null;peer.bones=null;peer.rigBody=null;peer.nativeAvatar=false;
 return true;
}
// The equipment factory must never require the LOCAL player to have the same item equipped.
// Forged meshes have a real asset factory; primitive meshes are cloned when the native
// engine exposes the appropriate template, or reconstructed in 3D without 2D placeholder boards.
/* Native equipment renderer:
 * Never create replacement weapon, torch, shield or flame geometry.
 * Source prototypes are cloned from the SAME equipment that the solo game uses.
 * Missing native assets are left pending rather than rendered as a fake item. */
const nativeTemplates=new Map(),nativeFailure=new Map();
const PRIMABLE=['axe','hammer','pickaxe','spear','rock','branch','wood_chip'];
let primed=false,priming=false,lastPriming=0;
const supportedSource=o=>!!(o&&o.isObject3D&&typeof o.clone==='function');
function visibleMeshCount(source){
 let count=0;
 source?.traverse?.(o=>{if(o.isMesh&&o.geometry?.attributes?.position)count++;});
 return count;
}
function cloneNativeSource(source){
 if(!supportedSource(source)||visibleMeshCount(source)<1)return null;
 let cloned=null;
 try{cloned=source.clone(true);}catch(e){return null;}
 if(!cloned)return null;
 // The original may be invisible because its FIRST PERSON item is unequipped.
 // Only unhide the root and meshes that are actually part of the captured item.
 cloned.visible=true;
 cloned.traverse(o=>{
  o.visible=true;
  if(o.isMesh){o.frustumCulled=false;o.castShadow=true;}
 });
 return cloned;
}
function rememberNative(id,object,reason){
 if(!id||nativeTemplates.has(id)||!supportedSource(object))return false;
 const source=cloneNativeSource(object);
 if(!source)return false;
 nativeTemplates.set(id,source);
 nativeFailure.delete(id);
 return true;
}
function nativeTorchCandidates(){
 const g=window.gameReview,tfp=g?.trueFirstPerson;
 const possible=[];
 const add=(value,tag)=>{
  if(supportedSource(value))possible.push({value,tag});
  else if(value&&typeof value==='object'){
   for(const key of ['model','object','mesh','root','group','visual','torchMesh','torchGroup']){
    if(supportedSource(value[key]))possible.push({value:value[key],tag:tag+'.'+key});
   }
  }
 };
 if(!g)return possible;
 // Trust runtime torch holders and any torch actually attached to the player's rig.
 for(const k of Object.keys(g))if(/torch|tocha/i.test(k))add(g[k],'gameReview.'+k);
 for(const k of ['gameTorch','gameTorchV2','gameFirstPersonTorch'])add(window[k],k);
 const root=tfp?.visibleRoot||tfp?.model;
 root?.traverse?.(o=>{
  if(o!==root&&/(torch|tocha)/i.test(o.name||''))add(o,'playerRig.'+o.name);
 });
 return possible;
}
function captureTorch(){
 if(nativeTemplates.has('torch'))return true;
 for(const candidate of nativeTorchCandidates()){
  const root=candidate.value;
  // Reject unmounted pure flame particles/huge camera billboards: these created
  // the solid giant yellow "torch" bug in the previous implementation.
  let meshes=0,shafts=0,flameOnly=0,brightOnly=0,textured=0;
  root.traverse?.(o=>{
   if(!o.isMesh)return;meshes++;
   const name=String(o.name||'').toLowerCase(),geo=o.geometry?.type||'';
   const mats=Array.isArray(o.material)?o.material:[o.material];
   const particle= /fire|flame|fogo|chama|spark|billboard/i.test(name);
   if(/shaft|handle|grip|cabo|madeira|wood|stick|torchbody/.test(name)||
     (/CylinderGeometry|BoxGeometry/.test(geo)&&!particle))shafts++;
   if(particle)flameOnly++;
   if(mats.some(m=>m?.map||m?.normalMap))textured++;
   if((/ConeGeometry|PlaneGeometry/.test(geo)||
       mats.every(m=>m?.emissiveIntensity>1&&!m?.map))&&!particle)brightOnly++;
  });
  const namedTorch=/(torch|tocha)/i.test(root.name||'');
  // A glowing cone/plane is only the flame FX, not the held torch model.
  const onlyFireEffect=!shafts&&!textured&&(flameOnly+brightOnly>=meshes);
  // Imported meshes may use BufferGeometry: accept recognizable original
  // torch assemblies, but never clone a standalone beam/particle.
  if(!meshes||flameOnly===meshes||onlyFireEffect||
    (!shafts&&!(namedTorch&&(meshes>=2||textured>0))))continue;
  if(rememberNative('torch',root,candidate.tag))return true;
 }
 return false;
}
function cacheCurrentRight(){
 const hand=window.gameRightHand;
 if(hand?.current&&hand.object)rememberNative(hand.current,hand.object,'gameRightHand');
 const forged=window.gameForgedEquipmentV230;
 for(const side of ['left','right']){
  const id=forged?.equipped?.[side],obj=forged?.models?.[side];
  if(id&&obj)rememberNative(id,obj,'forgedEquip');
 }
 const shield=window.gameShield;
 if(shield?.object)rememberNative('wood_shield',shield.object,'nativeShield');
 captureTorch();
}
function maybePrimeNativeEquipment(){
 if(primed||priming||!window.FlorestaOnline?.connected)return;
 const now=performance.now();
 if(now-lastPriming<4000)return;
 lastPriming=now;
 const hand=window.gameRightHand,inv=window.gameInventory,g=window.gameReview;
 if(!hand?.equip||!hand?.unequip||!hand?.object||!inv?.items||!g?.player)return;
 if(inv.isOpen||window.gameCraft?.active||window.gameForgeV230?.active||
   window.gameRoll?.active||window.gameLumber?.carrying||
   window.gameSpiderCave?.transitioning||window.gamePlayerHit?.active)return;
 // Prime original item meshes between render frames without modifying inventory.
 // Skip if a combat animation or the player is actively moving.
 const pose=g.player;
 if(pose?.sprinting||pose?.attacking||pose?.rolling||g?.attackState)return;
 priming=true;
 const before=hand.current||null,initialStatuses=window.document?.getElementById('status');
 const oldStatus=initialStatuses?.textContent;
 try{
  for(const id of PRIMABLE){
   if(nativeTemplates.has(id))continue;
   const qty=inv.items.find(item=>item.id===id)?.quantity||0;
   if(qty<1)continue;
   try{
    if(hand.current!==id&&hand.equip(id)===false)continue;
    if(hand.current===id)rememberNative(id,hand.object,'originalEquip('+id+')');
   }catch(e){nativeFailure.set(id,'equip failure');}
  }
 }finally{
  try{
   if(before&&hand.current!==before)hand.equip(before);
   else if(!before&&hand.current)hand.unequip();
  }catch(err){console.warn('[FLORESTA DUO] restoration of local equip failed',err);}
  if(initialStatuses&&oldStatus!=null)initialStatuses.textContent=oldStatus;
  priming=false;primed=true;
 }
 // If the native torch mesh is lazy-created, ask the ORIGINAL equipment handler
 // to instantiate it and immediately restore the previous state (same JS frame).
 // Never build a separate torch or flame in the multiplayer renderer.
 if(!nativeTemplates.has('torch')&&!g.isEquipped?.()&&!window.gameShield?.equipped&&
    !window.gameBranchHands?.side){
  const button=document.getElementById?.('equipBtn');
  if(button?.click){
   try{button.click();captureTorch();}
   finally{if(g.isEquipped?.())button.click();}
  }
 }
 cacheCurrentRight();
}
function nativeModel(id,side){
 if(!id)return null;
 cacheCurrentRight();
 if(nativeTemplates.has(id))return cloneNativeSource(nativeTemplates.get(id));
 if(id.startsWith('forged_')){
  try{
   const g=window.gameForgeV230?.makeEquipmentModel?.(id);
   if(g){rememberNative(id,g,'originalForgeFactory');return cloneNativeSource(g);}
  }catch(e){nativeFailure.set(id,'original forged model unavailable');}
 }
 if(id==='torch')captureTorch();
 return nativeTemplates.has(id)?cloneNativeSource(nativeTemplates.get(id)):null;
}
function clearGear(gear){
 if(!gear)return;
 gear.root?.removeFromParent?.();
 // Native geometry and materials are shared with the solo game: never dispose.
}
function makeEquipment(peer,side,id){
 const T=three();if(!T?.Group||!peer.root||!peer.gear)return;
 const previous=peer.gear.get(side);
 if(previous?.id===id)return;
 if(previous){clearGear(previous);peer.gear.delete(side);}
 if(!id)return;
 const visual=nativeModel(id,side);
 if(!visual){
  // Retry after native source has been instantiated, without showing a fake.
  peer.gear.set(side,{id,pending:true,root:null});
  return;
 }
 const socket=new T.Group();socket.name='Floresta_Duo_Original_'+side+'_'+id;
 socket.add(visual);
 // The native item can be a first-person object with a camera offset, so
 // normalize its existing geometry (not a substituted primitive) to hand units.
 const bounding=new T.Box3().setFromObject(visual);
 const size=new T.Vector3(),center=new T.Vector3();
 bounding.getSize(size);bounding.getCenter(center);
 const longest=Math.max(size.x,size.y,size.z);
 const meters=({torch:.64,axe:.75,hammer:.75,pickaxe:.85,spear:1.4,rock:.3,
   branch:.62,wood_chip:.37,wood_shield:.64})[id]||
   (id.includes('shield')?.65:id.includes('spear')?1.4:id.includes('sword')?.87:.78);
 if(!Number.isFinite(longest)||longest<1e-6){peer.gear.set(side,{id,pending:true,root:null});return;}
 const scalar=Math.min(25,Math.max(.00001,meters/longest));
 visual.scale.multiplyScalar(scalar);
 visual.position.sub(center.multiplyScalar(scalar));
 socket.visible=true;peer.root.add(socket);
 peer.gear.set(side,{id,pending:false,root:socket,visual,native:true});
}
function refreshPending(peer){
 for(const [side,item] of peer.gear||[]){
  if(!item.pending)continue;
  const m=nativeModel(item.id,side);
  if(!m)continue;
  peer.gear.delete(side);
  makeEquipment(peer,side,item.id);
 }
}
function snapEquipment(peer){
 if(!peer.gear||!peer.root)return;
 const T=three(),q=new T.Quaternion(),rootQ=new T.Quaternion(),p=new T.Vector3();
 peer.root.updateWorldMatrix(true,true);
 peer.root.getWorldQuaternion(rootQ);rootQ.invert();
 for(const [side,gear] of peer.gear){
  if(!gear?.root||gear.pending)continue;
  const bone=peer.bones.get(side==='left'?'lefthand':'righthand');
  if(!bone){gear.root.visible=false;continue;}
  bone.getWorldPosition(p);bone.getWorldQuaternion(q);
  const worldHand=p.clone();
  gear.root.position.copy(peer.root.worldToLocal(p));
  gear.root.quaternion.copy(rootQ).multiply(q);
  if(side==='left'&&gear.id.includes('shield')){
   // Keep the shield across the forearm, not in front of the palm.
   const fore=peer.bones.get('leftforearm');
   if(fore){
    const elbow=new T.Vector3();fore.getWorldPosition(elbow);
    const delta=elbow.sub(worldHand).multiplyScalar(.38);
    gear.root.position.add(delta.applyQuaternion(rootQ));
   }
   gear.root.rotateY(Math.PI*.5);
  }
  if(gear.id==='torch')gear.root.rotateZ(-.08);
 }
}
function pose(peer,v){
 if(!peer.nativeAvatar||!v||!peer.root)return;
 if(Array.isArray(v.pose)){
  for(const a of v.pose){
   if(!Array.isArray(a)||a.length!==5||typeof a[0]!=='string')continue;
   const bone=peer.bones.get(a[0]);if(!bone||!a.slice(1).every(Number.isFinite))continue;
   const q=bone.userData.duoQ||(bone.userData.duoQ=new (three().Quaternion)());
   q.set(a[1],a[2],a[3],a[4]).normalize();
   bone.quaternion.slerp(q,peer.firstPose?.28:1);
  }
  peer.firstPose=true;
 }
 const look=v.look;
 if(look&&(!peer.look||peer.look.style!==look.style||peer.look.color!==look.color||peer.look.size!==look.size)){
  peer.look={style:look.style,color:look.color,size:look.size};
  createHair(peer);
 }
 maybePrimeNativeEquipment();
 const equipment=v.equipment||{};
 makeEquipment(peer,'right',String(equipment.right||'').slice(0,52));
 // Resolve torch and shield to one stable left-hand slot. Never recreate the torch every animation frame.
 const left=equipment.left||(equipment.torch?'torch':'');
 makeEquipment(peer,'left',String(left).slice(0,52));
 refreshPending(peer);
 snapEquipment(peer);
}
function probe(){
 const t=sourceRig();
 return {ready:!!t,model:t?.root?.name||null,bones:t?.tfp?.fullMesh?.skeleton?.bones?.length||0};
}
window.FlorestaDuoAvatar={version:'NativeRig-NativeEquipment-2',capture,create,pose,dispose,probe,
 captureLocalEquipment:cacheCurrentRight, primeNativeEquipment:maybePrimeNativeEquipment,
 diagnostic(){return{sources:[...nativeTemplates.keys()],missing:[...nativeFailure.entries()],primed}}};
})();