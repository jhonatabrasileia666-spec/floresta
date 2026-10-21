/* FLORESTA V256 — Barra configurável e scroll somente durante a partida.
   Slots independentes do inventário, persistidos no navegador. Não duplica itens.
   O escudo de prata usa a ancoragem do escudo de madeira em equipment_230.js. */
(()=>{'use strict';
 if(window.gameHotbarV256)return;
 const $=id=>document.getElementById(id);
 const hot=$('u173Hotbar'),hotSlots=hot?.querySelector('.u173-slots');
 const grid=$('inventoryGrid'),inventory=$('inventoryOverlay'),panel=inventory?.querySelector('.inventory-panel');
 if(!hotSlots||!grid||!panel)return;
 const KEY='floresta-hotbar-v256',DEFAULT=['axe','hammer','rock','branch','wood_chip','torch','wood_shield','spear','pickaxe'];
 const BLOCK_SELECTOR='#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#constructionOverlay.open,#directorOverlay.open,#h171Drawer:not([hidden]),#florestaFront:not([hidden]),#florestaHackOverlay.open,#alq189Panel.open,#forge222Panel.open,#potion219Picker:not([hidden]),[role="dialog"]:not([hidden]),.v206-modal,#mobileStartOverlay:not([style*="display: none"])';
 const FORM_SELECTOR='input,select,textarea,[contenteditable="true"],[role="textbox"]';
 const SKIN={'forged_shadow_axe':'Machado sombrio','forged_shadow_halberd':'Machado sombrio','forged_silver_sword':'Espada prateada','forged_silver_longsword':'Espada prateada','forged_silver_spear':'Lança prateada','forged_silver_shield':'Escudo prateado','wood_shield':'Escudo de madeira','wood_chip':'Lasca','axe':'Machado','rock':'Pedra','hammer':'Martelo','branch':'Galho','spear':'Lança','pickaxe':'Picareta','torch':'Tocha','armor':'Armadura'};
 const fileIcons={forged_shadow_axe:'forged_shadow_axe',forged_shadow_halberd:'forged_shadow_axe',forged_silver_sword:'forged_silver_sword',forged_silver_longsword:'forged_silver_sword',forged_silver_spear:'forged_silver_spear',forged_silver_shield:'forged_silver_shield'};
 const paths={forged_shadow_axe:'assets/ferraria-v228/forged_shadow_axe.png',forged_silver_sword:'assets/ferraria-v228/forged_silver_sword.png',forged_silver_spear:'assets/ferraria-v228/forged_silver_spear.png',forged_silver_shield:'assets/ferraria-v228/forged_silver_shield.png'};
 const init=()=>{try{const obj=JSON.parse(localStorage.getItem(KEY)||'null');if(Array.isArray(obj)&&obj.length===9)return obj.map(x=>typeof x==='string'&&x.length<80?x:null);}catch{}return DEFAULT.slice();};
 let slots=init(),selected=0,inventoryChoice=null,lastWheel=0,editActive=0;
 function owned(id){if(!id)return 0;if(id==='torch')return 1;return Number(window.gameInventory?.items?.find(it=>it.id===id)?.quantity)||0;}
 function label(id){return SKIN[id]||window.gameInventory?.items?.find(it=>it.id===id)?.name||id||'Vazio';}
 function art(id){return window.florestaV183Art?.items?.[id]||paths[fileIcons[id]]||'';}
 function save(){try{localStorage.setItem(KEY,JSON.stringify(slots));}catch{}}
 function status(txt){const el=$('status');if(el)el.textContent=txt;}
 function inMenu(){
  if(window.gameInventory?.isOpen||window.gameCraft?.active||window.gameForgeV230?.active||window.gameLumber?.carrying||window.gameRoll?.active||window.gamePlayerHit?.active)return true;
  if(document.body.classList.contains('crafting-active')||document.body.classList.contains('f172-settings')||document.body.classList.contains('u173-modal')||document.body.classList.contains('h171-modal')||document.body.classList.contains('v206-modal')||document.body.classList.contains('mobile-ui-paused'))return true;
  if(window.gameFront172?.shell?.hidden===false)return true;
  const drawer=$('h171Drawer');if(drawer&&!drawer.hidden)return true;
  for(const node of document.querySelectorAll(BLOCK_SELECTOR)){
   if(node.id==='mobileStartOverlay'){
    if(node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden')return true;
   }else if(node.getClientRects().length&&getComputedStyle(node).visibility!=='hidden')return true;
  }
  return false;
 }
 function wheelBlocked(e){
  if(inMenu()||e.ctrlKey||e.metaKey||e.altKey||e.target?.closest?.(FORM_SELECTOR))return true;
  const target=e.target;
  if(target instanceof Element){
   if(target.closest('#u173Hotbar,#hud171,#h171Drawer,#potion219Picker,.inventory-panel,.craft-panel,.construction-panel,.settings-panel,.ui-panel,[role="dialog"],[role="menu"],[role="listbox"],button,[data-no-hotbar]'))return true;
   for(let el=target;el&&el!==document.body;el=el.parentElement){
    const styles=getComputedStyle(el),overflow=styles.overflowY;
    if(el.scrollHeight>el.clientHeight+4&&/auto|scroll/.test(overflow))return true;
   }
  }
  return false;
 }
 function equipItem(id){
  if(!owned(id)){status(label(id)+' não está no inventário.');return false;}
  const forged=window.gameForgedEquipmentV230;
  if(id.startsWith('forged_')){
   if(!forged){status('Forja ainda carregando.');return false;}
   return forged.isEquipped?.(id)||!!forged.equip?.(id);
  }
  if(['axe','hammer','rock','branch','wood_chip','spear','pickaxe'].includes(id)){
   if(window.gameRightHand?.current===id&&!forged?.right)return true;
   return !!window.gameRightHand?.equip?.(id);
  }
  if(id==='wood_shield'){
   if(forged?.left&&window.gameShield?.equipped)window.gameShield.unequip?.();
   return !!(window.gameShield?.equipped||window.gameShield?.equip?.());
  }
  if(id==='torch'){
   if(window.gameReview?.isEquipped?.())return true;
   return !!window.gameQuickHands?.equip?.('torch');
  }
  if(id==='armor'){
   if(window.gamePrimitive?.armorEquipped)return true;
   return !!window.gamePrimitive?.equipArmor?.();
  }
  // Storage/ingredients are allowed in Minecraft-like slots, but are not weapons.
  status(label(id)+' selecionado na barra (item de inventário).');return true;
 }
 function choose(index){
  if(inMenu()||index<0||index>=9)return false;
  selected=index;const id=slots[index];
  if(!id){status('Espaço vazio. Abra a mochila para escolher um item.');sync();return false;}
  const result=equipItem(id);sync();return result;
 }
 function setSlot(index,id){
  if(index<0||index>=9)return false;
  if(id!==null&&(!id||!owned(id))){status('Escolha um item que esteja na mochila.');return false;}
  // Swaps duplicates rather than consuming/copying inventory stacks.
  if(id){const previous=slots.indexOf(id);if(previous!==-1&&previous!==index)slots[previous]=slots[index]||null;}
  slots[index]=id;editActive=index;save();sync();return true;
 }
 function cycle(dir){
  const start=selected;for(let i=1;i<=9;i++){
   const idx=(start+dir*i+90)%9;if(slots[idx]&&owned(slots[idx]))return choose(idx);
  }
  return false;
 }
 const css=document.createElement('style');css.id='hotbar-v256-style';css.textContent=`
 #u173Hotbar .u173-slots .u173-slot{position:relative;cursor:pointer}
 #u173Hotbar .u173-slot.v256-empty{opacity:.47}
 #u173Hotbar .u173-slot.v256-selected{border-color:#efc782!important;box-shadow:0 0 10px #f2bf6978!important}
 #v256Editor{margin:8px 16px 10px;padding:10px 12px;background:rgba(12,24,19,.94);border:1px solid #8b956b;border-radius:12px;color:#f3efdc;flex-shrink:0}
 #v256Editor .v256-caption{font:600 12px system-ui;margin:0 0 7px;display:flex;justify-content:space-between;gap:12px}
 #v256Editor .v256-caption small{font-weight:400;opacity:.8}
 #v256Editor .v256-slots{display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:4px}
 #v256Editor .v256-editor-slot{min-width:0;height:53px;display:flex;align-items:center;justify-content:center;flex-direction:column;gap:2px;position:relative;background:#203326;color:#ebefda;border:1px solid #68705c;border-radius:6px;padding:3px;cursor:pointer;font:10px system-ui}
 #v256Editor .v256-editor-slot[aria-selected="true"]{border-color:#ffce7b;background:#424529}
 #v256Editor .v256-editor-slot img{height:30px;max-width:85%;object-fit:contain}
 #v256Editor .v256-editor-slot kbd{position:absolute;left:3px;top:2px;font:9px system-ui;opacity:.8}
 #v256Editor .v256-actions{display:flex;gap:8px;align-items:center;margin-top:7px;justify-content:space-between;flex-wrap:wrap}
 #v256Editor .v256-actions button{border:1px solid #b6ad7b;background:#2b382b;color:#fff1cb;padding:5px 9px;border-radius:5px;font:11px system-ui}
 #v256Editor .v256-selected-label{font-size:11px;opacity:.85}
 #inventoryGrid .inventory-slot[draggable="true"]{cursor:grab}
 @media(max-width:900px){#v256Editor{margin:4px 7px;padding:6px 7px}#v256Editor .v256-caption{font-size:10px}#v256Editor .v256-editor-slot{height:38px;padding:1px}#v256Editor .v256-editor-slot img{height:24px}#v256Editor .v256-actions{margin-top:4px}}
 `;document.head.append(css);
 const editor=document.createElement('section');editor.id='v256Editor';editor.setAttribute('aria-label','Organizar itens da barra rápida');
 editor.innerHTML='<div class="v256-caption"><span>ORGANIZAR BARRA RÁPIDA</span><small>Arraste um item ou toque nele e depois no espaço desejado</small></div><div class="v256-slots"></div><div class="v256-actions"><span class="v256-selected-label">Escolha um item da mochila</span><button type="button" data-action="clear">Limpar espaço</button><button type="button" data-action="add">Colocar item</button></div>';
 const header=panel.querySelector('.inventory-header');if(header)header.after(editor);else panel.prepend(editor);
 const editorSlots=editor.querySelector('.v256-slots');
 const iconMarkup=(id)=>{const src=art(id);const img=document.createElement('img');img.alt='';img.draggable=false;if(src)img.src=src;else img.style.display='none';return img;};
 for(let i=0;i<9;i++){
  const btn=document.createElement('button');btn.type='button';btn.className='v256-editor-slot';btn.dataset.slot=String(i);btn.setAttribute('aria-selected','false');btn.append(Object.assign(document.createElement('kbd'),{textContent:String(i+1)}),iconMarkup(null));
  editorSlots.append(btn);
 }
 // The native 173 hotbar remains shared by PC and Mobile, including the potion dock.
 hotSlots.replaceChildren(...slots.map((_,i)=>{
  const b=document.createElement('button');b.type='button';b.className='u173-slot';b.dataset.slot=String(i);
  b.append(Object.assign(document.createElement('kbd'),{textContent:String(i+1)}),Object.assign(document.createElement('small')),
   Object.assign(document.createElement('img'),{className:'f183-item-art',alt:'',draggable:false}),Object.assign(document.createElement('span')));
  return b;
 }));
 hotSlots.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b)return;e.preventDefault();e.stopImmediatePropagation();choose(Number(b.dataset.slot));},true);
 hotSlots.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('text/x-floresta-item'))e.preventDefault()});
 hotSlots.addEventListener('drop',e=>{const target=e.target.closest('[data-slot]');if(!target)return;e.preventDefault();setSlot(Number(target.dataset.slot),e.dataTransfer.getData('text/x-floresta-item'))});
 function invId(target){const btn=target?.closest?.('.inventory-slot');if(!btn)return null;const i=Array.from(grid.children).indexOf(btn);return window.gameInventory?.items?.[i]?.id||null;}
 // The inventory is rebuilt every time items change, so annotate new buttons.
 function annotate(){for(const [i,b] of Array.from(grid.children).entries()){const item=window.gameInventory?.items?.[i];if(item?.id){b.draggable=true;b.dataset.v256Item=item.id;}else b.draggable=false;}}
 const mo=new MutationObserver(annotate);mo.observe(grid,{childList:true});annotate();
 // The native item listener rebuilds the grid. Mobile must capture the choice
 // before the clicked node is detached; desktop keeps its existing timing.
 grid.addEventListener('click',e=>{const id=invId(e.target);if(!id)return;inventoryChoice=id;sync();},window.__CAVE_PLATFORM==='mobile');
 grid.addEventListener('dragstart',e=>{const id=invId(e.target);if(!id)return;inventoryChoice=id;e.dataTransfer.setData('text/x-floresta-item',id);e.dataTransfer.effectAllowed='copyMove';sync();});
 editorSlots.addEventListener('click',e=>{const b=e.target.closest('[data-slot]');if(!b)return;const i=Number(b.dataset.slot);editActive=i;
  if(inventoryChoice)setSlot(i,inventoryChoice);else sync();
 });
 editorSlots.addEventListener('dragover',e=>{if(e.dataTransfer?.types.includes('text/x-floresta-item'))e.preventDefault();});
 editorSlots.addEventListener('drop',e=>{const b=e.target.closest('[data-slot]');if(!b)return;e.preventDefault();setSlot(Number(b.dataset.slot),e.dataTransfer.getData('text/x-floresta-item'));});
 editor.querySelector('[data-action="clear"]').onclick=()=>setSlot(editActive,null);
 editor.querySelector('[data-action="add"]').onclick=()=>inventoryChoice?setSlot(editActive,inventoryChoice):status('Toque primeiro num item da mochila.');
 window.addEventListener('keydown',e=>{
  if(e.repeat||e.ctrlKey||e.altKey||e.metaKey||e.target?.closest?.(FORM_SELECTOR)||inMenu())return;
  if(!/^Digit[1-9]$/.test(e.code))return;
  e.preventDefault();e.stopImmediatePropagation();choose(Number(e.code.slice(-1))-1);
 },true);
 window.addEventListener('wheel',e=>{
  if(wheelBlocked(e)||window.gamePotionSlot220?.equipped||Math.abs(e.deltaY)<1)return;
  // Shift retains the previous left-hand selection behavior when desired.
  if(e.shiftKey)return;
  const now=performance.now();e.preventDefault();e.stopImmediatePropagation();
  if(now-lastWheel<115)return;lastWheel=now;cycle(e.deltaY>0?1:-1);
 },{capture:true,passive:false});
 function sync(){
  const anyModal=!!document.querySelector('#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#constructionOverlay.open,#directorOverlay.open');
  document.body.classList.toggle('u173-modal',anyModal);
  if(window.gameFront172?.shell)hot.hidden=!window.gameFront172.shell.hidden;
  const list=Array.from(hotSlots.children),eds=Array.from(editorSlots.children);
  slots.forEach((id,i)=>{
   const qty=owned(id),name=label(id),b=list[i],ed=eds[i];if(!b||!ed)return;
   b.dataset.item=id||'';b.disabled=false;b.classList.toggle('v256-empty',!id||!qty);b.classList.toggle('v256-selected',selected===i);
   b.setAttribute('aria-pressed',String(selected===i));b.setAttribute('aria-label',i+1+' '+name+(qty?` (${qty})`:''));b.title=(i+1)+' · '+name;
   const img=b.querySelector('img'),src=art(id);if(src){if(img.getAttribute('src')!==src)img.setAttribute('src',src);img.style.display='';}else{img.removeAttribute('src');img.style.display='none';}
   b.querySelector('span').textContent=id?name:'';b.querySelector('small').textContent=id?(qty?String(qty):'—'):'';
   ed.setAttribute('aria-selected',String(editActive===i));ed.title=(i+1)+' · '+name;ed.setAttribute('aria-label','Espaço '+(i+1)+': '+name);
   const thumb=ed.querySelector('img');if(src){if(thumb.getAttribute('src')!==src)thumb.setAttribute('src',src);thumb.style.display='';}else{thumb.removeAttribute('src');thumb.style.display='none';}
  });
  editor.querySelector('.v256-selected-label').textContent='Item escolhido: '+(inventoryChoice?label(inventoryChoice):'toque num item')+' · espaço '+(editActive+1);
  const shortcuts=$('h171Shortcuts')?.querySelectorAll('button');
  if(shortcuts?.length>=7)for(let i=0;i<7;i++)shortcuts[i].textContent=(i+1)+' · '+label(slots[i]);
 }
 window.gameHotbarV256={version:'V256',get slots(){return slots.slice();},get selected(){return selected;},get inMenu(){return inMenu();},wheelBlocked,choose,setSlot,sync};
 const pulse=setInterval(sync,350);window.addEventListener('pagehide',()=>{clearInterval(pulse);mo.disconnect()},{once:true});
 sync();console.info('[FLORESTA V256] Barra editável PC/Mobile, scroll restrito à partida.');
})();
