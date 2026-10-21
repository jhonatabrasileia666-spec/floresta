
/* FLORESTA V230 — equipamentos forjados, ligados às mãos reais e ao combate nativo. */
(()=>{'use strict';
const SPECS={
 forged_shadow_axe:{name:'Machado crescente sombrio',base:'axe',hand:'right'},
 forged_silver_sword:{name:'Espada longa prateada',base:'axe',hand:'right'},
 forged_silver_spear:{name:'Lança prateada',base:'spear',hand:'right'},
 forged_silver_shield:{name:'Escudo prateado',base:'wood_shield',hand:'left'},
 forged_shadow_halberd:{name:'Machado crescente sombrio',base:'axe',hand:'right'},
 forged_silver_longsword:{name:'Espada longa prateada',base:'axe',hand:'right'}
};
const wait=ms=>new Promise(resolve=>setTimeout(resolve,ms));
async function start(){
 for(let j=0;j<1200;j++){
  if(window.gameForgeV230?.makeEquipmentModel&&window.gameReview?.renderer&&window.gameRightHand?.equip&&window.gameShield?.equip&&window.gameInventory?.items)break;
  await wait(30);
 }
 const forge=window.gameForgeV230,game=window.gameReview,inv=window.gameInventory,hand=window.gameRightHand,shield=window.gameShield,T=window.__THREE_MODULE;
 if(!forge?.makeEquipmentModel||!game?.renderer||!hand||!shield||!inv||!T){console.warn('[FERRARIA V230] Sistema de equipamento aguardando dependências');return;}
 let right=null,left=null,internal=false;
 const rightMeshes=new Map(),leftMeshes=new Map();
 const nativeRightEquip=hand.equip.bind(hand),nativeRightUnequip=hand.unequip.bind(hand),nativeRightToggle=hand.toggle?.bind(hand);
 const nativeShieldEquip=shield.equip.bind(shield),nativeShieldUnequip=shield.unequip.bind(shield);
 const qty=id=>inv.items.find(x=>x.id===id)?.quantity||0;
 const showStatus=message=>{const el=document.getElementById('status');if(el)el.textContent=message;};
 const refresh=()=>{try{inv.refresh?.();window.gameUI173?.sync?.();}catch(e){console.warn('[FERRARIA V230] Atualização visual',e);}};
 function getModel(id){const target=SPECS[id]?.hand==='left'?leftMeshes:rightMeshes;if(target.has(id))return target.get(id);
  const result=forge.makeEquipmentModel(id);if(!result)return null;
  result.visible=false;game.scene.add(result);target.set(id,result);return result;
 }
 function hideModels(){for(const m of rightMeshes.values())m.visible=false;for(const m of leftMeshes.values())m.visible=false;}
 function isEquipped(id){return right===id||left===id;}
 function equip(id){const spec=SPECS[id];if(!spec||!qty(id)){showStatus('Este equipamento precisa estar na mochila.');return false;}
  if(forge.active||window.gameCraft?.active||document.body.classList.contains('crafting-active')){showStatus('Saia da forja ou do craft para equipar.');return false;}
  const model=getModel(id);if(!model){showStatus('A malha 3D ainda não está pronta.');return false;}
  if(spec.hand==='right'){
   internal=true;let ok=false;try{ok=nativeRightEquip(spec.base);}finally{internal=false;}
   if(ok===false){showStatus('Conclua o ataque atual antes de equipar.');return false;}
   right=id;showStatus(spec.name+' equipado na mão direita.');
  }else{
   internal=true;let ok=false;try{ok=shield.equipped?true:nativeShieldEquip();}finally{internal=false;}
   if(ok===false||!shield.equipped){showStatus('Não foi possível equipar o escudo.');return false;}
   left=id;showStatus(spec.name+' equipado na mão esquerda. Segure defender para bloquear.');
  }
  refresh();return true;
 }
 function unequip(id){if(!id||!isEquipped(id))return false;const spec=SPECS[id];
  if(spec.hand==='right'){
   internal=true;let ok=false;try{ok=nativeRightUnequip();}finally{internal=false;}
   if(ok===false)return false;right=null;
  }else{
   internal=true;let ok=false;try{ok=nativeShieldUnequip();}finally{internal=false;}
   if(ok===false)return false;left=null;
  }
  hideModels();showStatus(spec.name+' guardado.');refresh();return true;
 }
 function toggle(id){return isEquipped(id)?unequip(id):equip(id);}
 // Trocar para uma ferramenta comum através do inventário/atalhos libera a malha forjada.
 hand.equip=function(...args){const ok=nativeRightEquip(...args);if(!internal&&ok!==false)right=null;return ok;};
 hand.unequip=function(...args){const ok=nativeRightUnequip(...args);if(!internal&&ok!==false)right=null;return ok;};
 if(nativeRightToggle)hand.toggle=function(...args){const ok=nativeRightToggle(...args);if(!internal&&ok!==false)right=null;return ok;};
 shield.equip=function(...args){const ok=nativeShieldEquip(...args);if(!internal&&ok!==false)left=null;return ok;};
 shield.unequip=function(...args){const ok=nativeShieldUnequip(...args);if(!internal&&ok!==false)left=null;return ok;};
 const renderer=game.renderer,originalRender=renderer.render.bind(renderer);
 const worldP=new T.Vector3(),worldQ=new T.Quaternion(),one=new T.Vector3(1,1,1);
 const worldMatrix=new T.Matrix4(),localMatrix=new T.Matrix4();
 const suppressed=[];
 function restoreProxies(){
  for(const [object,oldVisible] of suppressed)object.visible=oldVisible;
  suppressed.length=0;
 }
 function visibleInTree(object){for(let o=object;o;o=o.parent)if(!o.visible)return false;return true;}
 function follow(mesh,proxy){
  const grip=mesh.userData.forgedGripV231;if(!grip)return false;
  proxy.updateWorldMatrix(true,false);
  worldP.fromArray(grip.socket);proxy.localToWorld(worldP);proxy.getWorldQuaternion(worldQ);
  worldMatrix.compose(worldP,worldQ,one);mesh.parent.updateWorldMatrix(true,false);
  localMatrix.copy(mesh.parent.matrixWorld).invert().multiply(worldMatrix);
  localMatrix.decompose(mesh.position,mesh.quaternion,mesh.scale);
  mesh.visible=true;mesh.updateMatrixWorld(true);return true;
 }
 // V256E: shared anatomical attachment for every shield. X runs elbow -> palm,
 // +Z is the rear of the plate. Both contact points are measured in metres.
 const elbowP=new T.Vector3(),wristP=new T.Vector3(),palmP=new T.Vector3();
 const axisX=new T.Vector3(),axisY=new T.Vector3(),axisZ=new T.Vector3(),sample=new T.Vector3();
 const basis=new T.Matrix4(),proxyQ=new T.Quaternion();
 const attachmentDebug={version:'V256E',mode:'waiting',frames:0,forearmLength:0};
 const fitted=new WeakSet();
 let palmBones=null;
 function getPalmBones(handBone){
  if(palmBones)return palmBones;
  palmBones=[];
  handBone.traverse(b=>{if(/lefthand(index|middle|ring)1$/i.test(b.name.replace(/[^a-z0-9]/gi,'')))palmBones.push(b);});
  return palmBones;
 }
 function fitShield(mesh,isWood){
  if(fitted.has(mesh))return;
  const scale=isWood?.84:1;
  mesh.scale.setScalar(scale);
  // Replace the old central grip with a hand grip and an independent arm strap.
  if(isWood){
   const old=mesh.children.find(o=>o.isMesh&&o.geometry?.parameters?.width===.075);
   if(old){mesh.remove(old);old.geometry.dispose();}
  }
  const support=new T.Group();support.name='V256E_Alca_e_Bracadeira';
  support.scale.setScalar(1/scale);mesh.add(support);
  const leather=new T.MeshStandardMaterial({color:0x493020,roughness:.92,side:T.DoubleSide});
  const addBox=(w,h,d,x,y,z)=>{
   const m=new T.Mesh(new T.BoxGeometry(w,h,d),leather);m.position.set(x,y,z);
   m.castShadow=true;m.receiveShadow=true;support.add(m);return m;
  };
  // The fist closes around a vertical grip, towards the wrist end of the plate.
  addBox(.028,.135,.025,.14,0,.10);
  for(const y of [-.0675,.0675])addBox(.035,.025,.085,.14,y,.060);
  // Open half-loop: the forearm passes between the shield back and this strap.
  const vertices=[],indices=[],n=24;
  for(let i=0;i<=n;i++){
   const t=Math.PI*i/n,y=.073*Math.cos(t),z=.022+.128*Math.sin(t);
   vertices.push(-.13-.023,y,z,-.13+.023,y,z);
   if(i<n){const k=i*2;indices.push(k,k+1,k+2,k+1,k+3,k+2);}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));
  geo.setIndex(indices);geo.computeVertexNormals();
  const strap=new T.Mesh(geo,leather);strap.name='V256E_Tira_Antebraco';support.add(strap);
  for(const y of [-.073,.073])addBox(.052,.025,.018,-.13,y,.025);
  mesh.userData.shieldFitV256E={grip:[.14,0,.10],width:isWood?.52:.518,height:isWood?.69:.684};
  fitted.add(mesh);
 }
 function fitShieldToArm(mesh,proxy,isWood=false){
  const bones=shield.bones||game.trueFirstPerson?.bones;
  const fore=bones?.lFore,handBone=bones?.lHand;
  if(!fore||!handBone)return false;
  fitShield(mesh,isWood);
  game.trueFirstPerson?.visibleRoot?.updateMatrixWorld(true);
  fore.getWorldPosition(elbowP);handBone.getWorldPosition(wristP);
  axisX.subVectors(wristP,elbowP);
  const length=axisX.length();if(!Number.isFinite(length)||length<.06||length>.8)return false;
  axisX.divideScalar(length);
  proxy.updateWorldMatrix(true,false);proxy.getWorldQuaternion(proxyQ);
  axisZ.set(0,0,1).applyQuaternion(proxyQ);
  axisZ.addScaledVector(axisX,-axisZ.dot(axisX));
  if(axisZ.lengthSq()<.001){axisZ.set(0,0,1).applyQuaternion(game.camera.quaternion);axisZ.addScaledVector(axisX,-axisZ.dot(axisX));}
  if(axisZ.lengthSq()<.001)return false;
  axisZ.normalize();axisY.crossVectors(axisZ,axisX).normalize();
  axisZ.crossVectors(axisX,axisY).normalize();
  basis.makeBasis(axisX,axisY,axisZ);worldQ.setFromRotationMatrix(basis);
  // Sample the palm rather than the wrist joint (the old source of floating grips).
  palmP.set(0,0,0);let count=0;
  for(const finger of getPalmBones(handBone)){
   finger.getWorldPosition(sample);palmP.add(sample);count++;
  }
  if(count)palmP.divideScalar(count).lerp(wristP,.28);
  else palmP.copy(wristP).addScaledVector(axisX,.045);
  worldP.copy(palmP).addScaledVector(axisX,-.14).addScaledVector(axisZ,-.10);
  worldMatrix.compose(worldP,worldQ,one);mesh.parent.updateWorldMatrix(true,false);
  localMatrix.copy(mesh.parent.matrixWorld).invert().multiply(worldMatrix);
  localMatrix.decompose(mesh.position,mesh.quaternion,mesh.scale);
  mesh.scale.multiplyScalar(isWood?.84:1);mesh.visible=true;mesh.updateMatrixWorld(true);
  attachmentDebug.mode='palm-grip-and-forearm-strap';attachmentDebug.forearmLength=length;attachmentDebug.frames++;
  return true;
 }
 window.gameShieldFitV256E=attachmentDebug;
 const priorBefore=game.scene.onBeforeRender,priorAfter=game.scene.onAfterRender;
 game.scene.onBeforeRender=function(...args){
  priorBefore?.apply(this,args);restoreProxies();hideModels();
  const canShow=!forge.active&&!window.gameCraft?.active&&
   !document.body.classList.contains('crafting-active')&&document.getElementById('florestaFront')?.hidden!==false;
  if(!canShow)return;
  if(right&&qty(right)>0){const spec=SPECS[right],proxy=hand.object,mesh=getModel(right);
   if(spec&&proxy&&mesh&&hand.current===spec.base&&visibleInTree(proxy)&&follow(mesh,proxy)){
    suppressed.push([proxy,proxy.visible]);proxy.visible=false;
   }
  }else if(right){right=null;}
  if(shield.equipped&&!left&&shield.object&&visibleInTree(shield.object))fitShieldToArm(shield.object,shield.object,true);
  if(left&&qty(left)>0&&shield.equipped){const proxy=shield.object,mesh=getModel(left);
   if(proxy&&mesh&&visibleInTree(proxy)&&fitShieldToArm(mesh,proxy)){
    suppressed.push([proxy,proxy.visible]);proxy.visible=false;
   }
  }else if(left){left=null;}
 };
 game.scene.onAfterRender=function(...args){try{return priorAfter?.apply(this,args);}finally{restoreProxies();}};
 renderer.render=function(...args){try{return originalRender(...args);}finally{restoreProxies();}};
 // Ações de ataque são executadas pela espada/machado e lança NATIVOS: a malha acompanha cada animação.
 window.gameForgedEquipmentV230={version:'V231',get right(){return right;},get left(){return left;},isEquipped,equip,unequip,toggle,
  get equipped(){return {right,left};},get models(){return {right:right&&rightMeshes.get(right),left:left&&leftMeshes.get(left)};}};
 console.info('[FLORESTA] V230 Ferraria: quatro equipamentos Meshy equipáveis com ataque/defesa nativos.');
}
start().catch(e=>console.error('[FERRARIA V230] Inicialização da equipagem',e));
})();

