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
function lookupModel(id,side){
 if(!id)return null;
 if(id.startsWith('forged_')){
  const existing=window.gameForgedEquipmentV230?.models;
  const candidate=(side==='left'?existing?.left:existing?.right);
  if(candidate&&window.gameForgedEquipmentV230?.equipped?.[side]===id)return candidate;
  try{return window.gameForgeV230?.makeEquipmentModel?.(id)||null;}catch{return null;}
 }
 if(id==='wood_shield')return window.gameShield?.object||null;
 if(id==='torch')return window.gameQuickHands?.object||window.gameReview?.torchObject||null;
 if(window.gameRightHand?.current===id)return window.gameRightHand?.object||null;
 return null;
}
function fallbackItem(T,id,side){
 const r=new T.Group();r.name='FlorestaRemoteItem_'+id;
 const wood=new T.MeshStandardMaterial({color:0x65472e,roughness:.96,flatShading:true});
 const iron=new T.MeshStandardMaterial({color:0x909b91,metalness:.35,roughness:.54,flatShading:true});
 const fire=new T.MeshStandardMaterial({color:0xffb756,emissive:0xff7a15,emissiveIntensity:1.8});
 const part=(geom,mat,x,y,z)=>{const m=new T.Mesh(geom,mat);m.position.set(x,y,z);r.add(m);return m;};
 if(side==='left'){
  const board=part(new T.BoxGeometry(.48,.7,.09),id.includes('silver')?iron:wood,0,0,0);
  part(new T.SphereGeometry(.06,8,6),iron,0,0,.06);return r;
 }
 if(id==='torch'){
  part(new T.CylinderGeometry(.045,.055,.45,8),wood,0,-.03,0);
  part(new T.ConeGeometry(.11,.3,8),fire,0,.31,0);return r;
 }
 if(id==='rock'){part(new T.DodecahedronGeometry(.16,0),iron,0,.14,0);return r;}
 if(id==='branch'){part(new T.CylinderGeometry(.018,.03,.6,6),wood,0,.18,0);return r;}
 const long=id.includes('spear')||id.includes('lança')||id==='spear';
 const blade=id.includes('sword')||id.includes('espada');
 part(new T.CylinderGeometry(.035,.04,long?1.45:.54,7),wood,0,long?.48:.12,0);
 if(blade)part(new T.BoxGeometry(.065,.67,.045),iron,0,.64,0);
 else if(long)part(new T.ConeGeometry(.10,.26,7),iron,0,1.31,0);
 else if(id.includes('hammer'))part(new T.BoxGeometry(.35,.16,.16),iron,0,.43,0);
 else part(new T.BoxGeometry(.34,.33,.085),iron,.11,.42,0);
 return r;
}
function makeEquipment(peer,side,id){
 const T=three();
 if(!T?.Group||!peer.root)return;
 const old=peer.gear.get(side);
 if(old?.id===id)return;
 if(old){old.root.removeFromParent();peer.gear.delete(side);}
 if(!id)return;
 let model=lookupModel(id,side);
 let visual;
 try{visual=model?.clone?.(true)||null;}catch(e){visual=null;}
 const fall=!visual;
 if(!visual)visual=fallbackItem(T,id,side);
 const socket=new T.Group();socket.name='Floresta_Duo_'+side+'_'+id;
 socket.add(visual);
 if(!fall){
  // Meshy and POV meshes use different units. Normalize from their actual geometry,
  // rather than letting an FBX centimetre-sized object cover the other player.
  const bounds=new T.Box3().setFromObject(visual),size=new T.Vector3(),center=new T.Vector3();
  bounds.getSize(size);bounds.getCenter(center);
  const max=Math.max(size.x,size.y,size.z);
  if(Number.isFinite(max)&&max>0.00001){
   const desired=side==='left'?.69:id.includes('spear')?1.35:.77;
   const k=Math.min(50,Math.max(.0001,desired/max));
   visual.scale.multiplyScalar(k);visual.position.sub(center.multiplyScalar(k));
  }
 }
 socket.visible=true;peer.root.add(socket);
 peer.gear.set(side,{id,root:socket,visual,isFallback:fall});
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
  if(side==='left')gear.root.rotateX(-.3);
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
 makeEquipment(peer,'left',String(equipment.left||'').slice(0,52));
 // Torch and carried logs are represented as separate hand/shoulder items.
 if(equipment.torch&&!equipment.left)makeEquipment(peer,'left','torch');
 if(!equipment.torch&&peer.gear.get('left')?.id==='torch')makeEquipment(peer,'left','');
 snapEquipment(peer);
}
function probe(){
 const t=sourceRig();
 return {ready:!!t,model:t?.root?.name||null,bones:t?.tfp?.fullMesh?.skeleton?.bones?.length||0};
}
window.FlorestaDuoAvatar={version:'NativeRig-1',capture,create,pose,dispose,probe};
})();