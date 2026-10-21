
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
  if(left&&qty(left)>0&&shield.equipped){const proxy=shield.object,mesh=getModel(left);
   if(proxy&&mesh&&visibleInTree(proxy)&&follow(mesh,proxy)){
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

