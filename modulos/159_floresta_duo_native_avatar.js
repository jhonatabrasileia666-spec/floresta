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
 cloned.rotation.set(0,0,0);
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
 for(const g of peer.gear?.values()||[])g.root?.removeFromParent();
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
function lookupModel(id,side){
 if(!id)return null;
 const forged=id.startsWith('forged_');
 if(forged){
  try{
   const current=window.gameForgedEquipmentV230;
   const model=side==='left'?current?.models?.left:current?.models?.right;
   if(current?.equipped?.[side]===id&&model)return model;
   return window.gameForgeV230?.makeEquipmentModel?.(id)||null;
  }catch(e){console.warn('[DUO] Modelo forjado não disponível:',id,e);return null;}
 }
 if(id==='torch'){
  const g=window.gameReview,torch=window.gameTorch;
  return torch?.model||torch?.object||g?.torchObject||g?.torch?.model||g?.torch?.object||null;
 }
 if(id==='wood_shield')return window.gameShield?.object||null;
 // Only clone local primitive if its ID actually matches; otherwise it would
 // show your equipped axe on the remote character's spear, for example.
 if(window.gameRightHand?.current===id)return window.gameRightHand?.object||null;
 return null;
}
function buildPrimitiveEquipment(T,id,side){
 const r=new T.Group();r.name='FlorestaRemoteModel_'+id;
 const wood=new T.MeshStandardMaterial({color:0x63472e,roughness:.95,flatShading:true});
 const woodLight=new T.MeshStandardMaterial({color:0x8d6943,roughness:.9,flatShading:true});
 const steel=new T.MeshStandardMaterial({color:0xadb6b1,metalness:.55,roughness:.42,flatShading:true});
 const darkSteel=new T.MeshStandardMaterial({color:0x586661,metalness:.38,roughness:.58,flatShading:true});
 const fire=new T.MeshStandardMaterial({color:0xffbd55,emissive:0xff8121,emissiveIntensity:1.7,transparent:true,opacity:.95,depthWrite:false});
 const coal=new T.MeshStandardMaterial({color:0x322c25,roughness:1,flatShading:true});
 const add=(geo,mat,x=0,y=0,z=0)=>{
  const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;r.add(m);return m;
 };
 const rod=(height,radius,mat,y=0)=>add(new T.CylinderGeometry(radius*.81,radius,height,9),mat,0,y,0);
 const shield=id.includes('shield')||id==='wood_shield';
 if(id==='torch'){
  // A torch is NEVER a left-hand shield. Handle, charred head and fire use 3D volumes.
  rod(.52,.042,wood,-.045);rod(.11,.078,coal,.24);
  for(let i=0;i<3;i++){
   const flame=add(new T.ConeGeometry(.083-i*.013,.24+i*.065,8),fire,
    (i-1)*.036,.39+i*.039,(i%2?-.025:.02));
   flame.rotation.z=(i-1)*.15;
  }
  const ember=add(new T.SphereGeometry(.052,9,7),fire,0,.33,0);
  ember.userData.duoFlame=true;return r;
 }
 if(shield){
  // Real-volume curved shield with planks/straps and a visible iron rim.
  const silver=id.includes('silver'),board=silver?steel:wood;
  for(let i=-2;i<=2;i++){
   const strip=add(new T.BoxGeometry(.135,.69-.055*Math.abs(i),.061),board,i*.119,-.02,Math.abs(i)*.014);
   strip.rotation.z=-i*.028;
  }
  for(const y of [-.30,.26])add(new T.BoxGeometry(.63,.045,.087),silver?darkSteel:woodLight,0,y,.09);
  add(new T.SphereGeometry(.085,10,8),silver?darkSteel:steel,0,0,.14);
  const strap=add(new T.BoxGeometry(.27,.12,.035),woodLight,0,-.05,-.075);
  strap.rotation.z=.12;
  r.rotation.z=.03;
  return r;
 }
 if(id==='rock'){
  add(new T.DodecahedronGeometry(.18,1),darkSteel,0,.09,0);
  return r;
 }
 if(id==='branch'||id==='wood_chip'){
  const s=id==='wood_chip'?.34:.73;
  rod(s,.028,wood,s*.22);
  add(new T.ConeGeometry(.045,.12,6),woodLight,.05,s*.41,0).rotation.z=-.65;
  return r;
 }
 const spear=id.includes('spear')||id.includes('lanca')||id.includes('lança');
 const sword=id.includes('sword')||id.includes('espada')||id.includes('longsword');
 const hammer=id.includes('hammer')||id.includes('martelo');
 const pickaxe=id.includes('pickaxe')||id.includes('picareta');
 const axe=id.includes('axe')||id.includes('machado');
 if(spear){
  rod(1.48,.034,wood,.54);
  add(new T.ConeGeometry(.104,.32,7),steel,0,1.43,0);
  add(new T.CylinderGeometry(.073,.055,.1,8),darkSteel,0,1.21,0);
 }else if(sword){
  rod(.34,.033,wood,-.12);
  add(new T.BoxGeometry(.27,.045,.07),darkSteel,0,.08,0);
  const blade=add(new T.BoxGeometry(.077,.72,.038),steel,0,.47,0);
  add(new T.ConeGeometry(.054,.17,4),steel,0,.91,0).rotation.y=Math.PI/4;
 }else{
  rod(hammer?.71:pickaxe?.9:.78,.039,wood,.08);
  if(hammer){
   add(new T.BoxGeometry(.38,.18,.18),steel,0,.49,0);
   add(new T.BoxGeometry(.35,.037,.22),darkSteel,0,.39,0);
  }else if(pickaxe){
   add(new T.BoxGeometry(.48,.082,.075),darkSteel,0,.6,0);
   for(const sign of [-1,1]){
    add(new T.ConeGeometry(.067,.3,6),steel,sign*.34,.6,0).rotation.z=-sign*Math.PI/2;
   }
  }else if(axe||!id){
   const blade=add(new T.BoxGeometry(.29,.36,.065),steel,.115,.43,0);
   add(new T.ConeGeometry(.16,.25,4),steel,.24,.47,0).rotation.z=-Math.PI/2;
   add(new T.BoxGeometry(.045,.31,.074),darkSteel,-.018,.43,0);
  }else{
   // Unknown tool: do not misrepresent it as a shield.
   add(new T.BoxGeometry(.23,.29,.085),steel,.12,.42,0);
  }
 }
 return r;
}
function visibleClone(source){
 let visual=null;
 try{visual=source?.clone?.(true)||null;}catch(e){return null;}
 if(!visual)return null;
 // Many game source meshes are hidden when unequipped; cloning preserves
 // visible=false. A remote item needs its own visibility independent of the owner.
 visual.traverse?.(o=>{
  o.visible=true;
  if(o.isMesh){o.frustumCulled=false;o.castShadow=true;}
 });
 return visual;
}
const EQUIPMENT_HEIGHT={torch:.72,wood_shield:.72,axe:.80,hammer:.79,pickaxe:1.03,spear:1.67,branch:.78,rock:.36,wood_chip:.40};
function makeEquipment(peer,side,id){
 const T=three();if(!T?.Group||!peer.root||!peer.gear)return;
 const old=peer.gear.get(side);
 if(old?.id===id)return;
 if(old){old.root.removeFromParent();old.root.traverse?.(o=>{if(o.userData?.duoOwnedGeometry)o.geometry?.dispose?.();});peer.gear.delete(side);}
 if(!id)return;
 const source=lookupModel(id,side);
 let visual=visibleClone(source);
 const fromNative=!!visual;
 if(!visual)visual=buildPrimitiveEquipment(T,id,side);
 const socket=new T.Group();socket.name='Floresta_Duo_'+side+'_'+id;
 socket.add(visual);
 if(fromNative){
  // Native equipment can be in a first-person camera coordinate system or be
  // hidden under other transforms. Convert its actual bounds to hand-sized metres.
  visual.updateMatrixWorld(true);
  const bounds=new T.Box3().setFromObject(visual),size=new T.Vector3(),center=new T.Vector3();
  bounds.getSize(size);bounds.getCenter(center);
  const max=Math.max(size.x,size.y,size.z),wanted=EQUIPMENT_HEIGHT[id]||
   (id.includes('shield')?.72:id.includes('spear')?1.67:id.includes('sword')?.98:.80);
  if(Number.isFinite(max)&&max>1e-7){
   const k=Math.max(1e-5,Math.min(100,wanted/max));
   visual.scale.multiplyScalar(k);visual.position.sub(center.multiplyScalar(k));
  }
 }else{
  visual.traverse(o=>{if(o.isMesh)o.userData.duoOwnedGeometry=true;});
 }
 socket.visible=true;peer.root.add(socket);
 peer.gear.set(side,{id,root:socket,visual,fromNative,isFallback:!fromNative});
}
const V3=()=>new (three().Vector3)();
function snapEquipment(peer){
 if(!peer.gear||!peer.root)return;
 const T=three(),q=new T.Quaternion(),rootQ=new T.Quaternion(),p=new T.Vector3();
 peer.root.updateWorldMatrix(true,true);
 peer.root.getWorldQuaternion(rootQ);rootQ.invert();
 for(const [side,gear] of peer.gear){
  const bone=peer.bones.get(side==='left'?'lefthand':'righthand');
  if(!bone){gear.root.visible=false;continue;}
  bone.getWorldPosition(p);bone.getWorldQuaternion(q);
  gear.root.position.copy(peer.root.worldToLocal(p));
  gear.root.quaternion.copy(rootQ).multiply(q);
  if(side==='left'&&gear.id.includes('shield')){
   // Keep the shield across the forearm, not in front of the palm.
   const fore=peer.bones.get('leftforearm');
   if(fore){
    const elbow=new T.Vector3();fore.getWorldPosition(elbow);
    const delta=elbow.sub(p).multiplyScalar(.38);
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
 const equipment=v.equipment||{};
 makeEquipment(peer,'right',String(equipment.right||'').slice(0,52));
 // Resolve torch and shield to one stable left-hand slot. Never recreate the torch every animation frame.
 const left=equipment.left||(equipment.torch?'torch':'');
 makeEquipment(peer,'left',String(left).slice(0,52));
 snapEquipment(peer);
}
function probe(){
 const t=sourceRig();
 return {ready:!!t,model:t?.root?.name||null,bones:t?.tfp?.fullMesh?.skeleton?.bones?.length||0};
}
window.FlorestaDuoAvatar={version:'NativeRig-1',capture,create,pose,dispose,probe};
})();