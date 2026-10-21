
(async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1200;i++){if(window.gamePrimitive&&window.gameRightHand&&window.gameAttack&&window.gameInventory)break;await wait(20);}
  const primitive=window.gamePrimitive;if(!primitive)return;
  // Hammer remains owned by the current stable full-body V63 module. Spear uses the V53 physical thrust.
  if(window.gameAttack&&!window.gameAttack.__v168iPrimitiveWrapped){
    const previous=window.gameAttack.attack.bind(window.gameAttack);
    window.gameAttack.attack=()=>window.gameRightHand?.current==='pickaxe'?primitive.attack('pickaxe'):window.gameRightHand?.current==='spear'?primitive.attack('spear'):previous();
    window.gameAttack.__v168iPrimitiveWrapped=true;
  }
  // Keep armor state refreshed in inventory and ensure workshop recipes update when the craft menu opens.
  const refresh=()=>{try{primitive.updateMenu?.();window.gameInventory?.refresh?.();}catch{}};
  document.getElementById('craftBtn')?.addEventListener('click',()=>setTimeout(refresh,0));
  window.gamePrimitiveV168I={version:'V168K-PC',source:'Floresta V53 Oficina',items:['hammer','spear','armor'],materials:['slat','shaft'],refresh};
  refresh();
})();
