
/* FLORESTA V236 — Arsenal completo do Hack/Criativo, integrado ao HTML, sem JS externo.
   Itens reais (sem armas inventadas). Interface própria para escolher/equipar e
   estoque permanente enquanto Hack ou Criativo estiverem ativos. */
(()=>{'use strict';
 if(window.gameAllItemsV236)return;
 const LIMIT=9999;
 const DEFINITIONS=[
 ['rock','Pedra','Materiais',.6],['branch','Galho','Materiais',.3],['vine','Cipó','Materiais',.18],
 ['wood_chip','Lasca de madeira','Materiais',.05],['slat','Tábua / ripa','Materiais',.35],['shaft','Cabo de madeira','Materiais',.45],
 ['iron_ore','Minério de ferro','Materiais',.45],['iron_bar_hot','Barra de ferro quente','Forja',.9],
 ['iron_bar_cold','Barra de ferro fria','Forja',.9],['iron_handle','Empunhadura de ferro','Forja',.75],
 ['iron_axe_head','Lâmina de machado','Forja',.8],['iron_sword_blade','Lâmina de espada','Forja',.8],
 ['iron_spear_tip','Ponta de lança','Forja',.7],['iron_plate','Placa de ferro','Forja',.95],
 ['torch','Tocha','Ferramentas',1.2],['axe','Machado de pedra','Armas',1.1],
 ['hammer','Martelo de pedra','Ferramentas',1.35],['pickaxe','Picareta de pedra','Ferramentas',1.45],
 ['spear','Lança comum','Armas',1.25],['wood_shield','Escudo de madeira','Armas',2.2],['armor','Armadura primitiva','Equipamentos',3.1],
 ['forged_shadow_axe','Machado crescente sombrio','Armas',2.4],
 ['forged_silver_sword','Espada longa prateada','Armas',2.4],
 ['forged_silver_spear','Lança prateada','Armas',2.4],
 ['forged_silver_shield','Escudo prateado','Armas',3.5]
 ];
 const stock=new Map(DEFINITIONS.map(([id,name,group,weight])=>[id,{id,name,type:group,group,weight,quantity:LIMIT,description:'Disponível sem consumo no Hack e no Criativo.'}]));
 const labels=['Tudo','Armas','Ferramentas','Equipamentos','Forja','Materiais','Alquimia'];
 let survival=null,lastActive=false,lastAlchemyCount=0,originalRemove=null,originalCapacity=null,selected='Tudo',searchTerm='',lastStatus='';
 const unlimited=()=>!!(window.gameHackMode?.enabled||window.gameTestMode?.active);
 const inventory=()=>window.gameInventory;
 const escapeHTML=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function capture(){
  const inv=inventory();if(survival||!inv||unlimited())return;
  survival={items:inv.items.map(x=>({...x})),capacity:inv.capacity};
 }
 function restore(){
  const inv=inventory();if(!survival||!inv||unlimited())return;
  const saved=survival;survival=null;
  if(originalRemove){ // Retirar os itens gratuitos, sem afetar equipamento salvo.
   const wanted=new Map(saved.items.map(it=>[it.id,it]));
   for(const it of inv.items){const target=wanted.get(it.id)?.quantity||0;if(it.quantity>target)originalRemove(it.id,it.quantity-target);}
   inv.setCapacity?.(120);
   for(const it of saved.items){const current=inv.items.find(x=>x.id===it.id)?.quantity||0;if(current<it.quantity)inv.addItem({...it,quantity:it.quantity-current});}
  }
  inv.setCapacity?.(saved.capacity);inv.refresh?.();document.body.classList.remove('floresta-v236-infinite');
  if(panel)panel.hidden=true;
 }
 function injectAlchemy(){
  const alq=window.gameHerbalAlchemy;
  if(!alq?.herbs?.length)return;
  for(const herb of alq.herbs){
   alq.discovered?.add?.(herb.id);
   for(const [prefix,suffix,type,weight] of [['alq_herba_',' (fresca)','Erva',.05],['alq_dried_',' (seca)','Erva seca',.025],['alq_powder_','','Pó',.03]]){
    const id=prefix+herb.id;
    const name=type==='Pó'?'Pó de '+herb.name:herb.name+suffix;
    stock.set(id,{id,name,type,group:'Alquimia',weight,quantity:LIMIT,description:'Ingrediente original da bancada de alquimia.'});
   }
  }
  for(const recipe of alq.recipes||[]){const id='alq_potion_'+recipe.id;stock.set(id,{id,name:'Poção: '+recipe.name,type:'Poção',group:'Alquimia',weight:.18,quantity:LIMIT,description:recipe.desc||'Poção desbloqueada e equipável.'});}
  alq.save?.();
 }
 function syncAlchemy(){
  const a=window.gameHerbalAlchemy;if(!a?.state||!unlimited())return;
  for(const h of a.herbs||[]){for(const [key] of [['fresh'],['dry'],['powder']])if(a.state[key])a.state[key][h.id]=LIMIT;}
  for(const r of a.recipes||[])if(a.state.bottles)a.state.bottles[r.id]=LIMIT;
 }
 function installGuard(){
  const inv=inventory();if(!inv)return false;
  if(inv.__florestaV236Guard)return true;
  originalRemove=inv.removeItem.bind(inv);
  inv.removeItem=function(id,n=1){if(unlimited())return inv.items.some(x=>x.id===id);return originalRemove(id,n);};
  inv.__florestaV236Guard=true;return true;
 }
 function grantAll(silent=false){
  const inv=inventory();if(!inv||!unlimited())return false;
  installGuard();injectAlchemy();inv.setCapacity?.(120);
  let got=0,failed=[];
  for(const it of stock.values()){
   const have=inv.items.find(x=>x.id===it.id)?.quantity||0;
   if(have<it.quantity){
    if(inv.addItem({...it,quantity:it.quantity-have}))got++;
    else failed.push(it.name);
   }
  }
  syncAlchemy();inv.refresh?.();document.body.classList.add('floresta-v236-infinite');
  lastAlchemyCount=Array.from(stock.values()).filter(x=>x.group==='Alquimia').length;
  if(!silent){lastStatus=failed.length?`${failed.length} itens sem vaga: ${failed.join(', ')}`:`${stock.size} tipos de itens liberados · ∞`;
   updateStatus(lastStatus);}
  renderPanel();return failed.length===0;
 }
 function updateStatus(msg){
  const el=document.getElementById('florestaArsenalStatusV236');if(el)el.textContent=msg;
  const hack=document.getElementById('florestaHackStatus');if(hack)hack.textContent=msg;
 }
 function equipped(id){const f=window.gameForgedEquipmentV230;
  if(id.startsWith('forged_'))return !!f?.isEquipped?.(id);
  if(id==='wood_shield')return !!window.gameShield?.equipped;
  if(id.startsWith('alq_potion_'))return window.gamePotionSlot220?.equipped===id;
  if(id==='armor')return !!window.gamePrimitive?.armorEquipped;
  return window.gameRightHand?.current===id;
 }
 function use(id){
  if(!unlimited()){updateStatus('Entre no Criativo ou ative o Hack primeiro.');return false;}
  const item=stock.get(id);if(!item){updateStatus('Item não registrado.');return false;}
  const inv=inventory();if(!inv?.items.some(i=>i.id===id))grantAll(true);
  let ok=false;
  const forge=window.gameForgedEquipmentV230;
  const hand=window.gameRightHand;
  if(id.startsWith('forged_'))ok=!!forge?.toggle?.(id);
  else if(['axe','hammer','pickaxe','spear'].includes(id)){
   ok=!!(equipped(id)?hand?.unequip?.():hand?.equip?.(id));
  }else if(id==='wood_shield')ok=!!(window.gameShield?.equipped?window.gameShield.unequip():window.gameShield?.equip?.());
  else if(id==='armor')ok=!!window.gamePrimitive?.equipArmor?.();
  else if(id==='torch'){
   const b=document.getElementById('equipBtn');if(b){b.click();ok=true;}
  }else if(id.startsWith('alq_potion_')){
   ok=!!(equipped(id)?window.gamePotionSlot220?.unequip?.():window.gamePotionSlot220?.equip?.(id));
  }else{updateStatus(item.name+' disponível no inventário · ∞');return true;}
  updateStatus(ok?(equipped(id)?'Equipado: ':'Guardado: ')+item.name:'Não foi possível equipar '+item.name+'. Aguarde os modelos carregarem.');
  renderPanel();return ok;
 }
 const st=document.createElement('style');st.id='floresta-arsenal-v236-style';st.textContent=`
 #florestaArsenalButtonV236{position:fixed;z-index:1800;top:145px;left:14px;background:#33251b;color:#ffe2a6;border:1px solid #bd9560;border-radius:9px;padding:10px 14px;font:700 12px system-ui;cursor:pointer;box-shadow:0 4px 16px #0008}
 #florestaArsenalV236[hidden],#florestaArsenalButtonV236[hidden]{display:none!important}
 #florestaArsenalV236{position:fixed;inset:0;z-index:30010;background:#000d;display:flex;align-items:center;justify-content:center;padding:12px;font:14px system-ui;color:#eadcc5}
 #florestaArsenalV236 .va-box{background:#171b1a;border:1px solid #87744c;border-radius:14px;width:min(830px,98vw);max-height:90dvh;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 0 70px #000}
 #florestaArsenalV236 header{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 16px;background:#27241e}
 #florestaArsenalV236 header strong{font:700 18px Georgia,serif;color:#eccc8b}
 #florestaArsenalV236 button{cursor:pointer;color:#f8dfba;border:1px solid #766444;border-radius:7px;background:#383124;padding:8px}
 #florestaArsenalV236 .va-controls{padding:10px 14px;border-bottom:1px solid #79664444}
 #florestaArsenalV236 .va-categories{display:flex;flex-wrap:wrap;gap:6px;margin-bottom:8px}
 #florestaArsenalV236 .va-categories button[aria-pressed="true"]{background:#9c7137;color:#fff}
 #florestaArsenalV236 #florestaArsenalSearchV236{background:#0e1111;color:#fff;border:1px solid #87744c;border-radius:8px;padding:10px;width:100%;box-sizing:border-box}
 #florestaArsenalV236 .va-grid{padding:10px;overflow:auto;display:grid;grid-template-columns:repeat(auto-fill,minmax(190px,1fr));gap:8px}
 #florestaArsenalV236 .va-item{border:1px solid #625336;border-radius:9px;background:#242722;padding:10px;display:flex;flex-direction:column;gap:6px;min-height:85px}
 #florestaArsenalV236 .va-item b{color:#f9e0b3}
 #florestaArsenalV236 .va-item small{color:#bbb9a8}
 #florestaArsenalV236 .va-item button{margin-top:auto;background:#71552f}
 #florestaArsenalV236 .va-item .va-equipped{color:#9de59e}
 #florestaArsenalV236 footer{border-top:1px solid #79664444;padding:8px 14px;color:#d0bd97;font-size:12px}
 #florestaHackPanel #florestaHackArmoryBtnV236{background:#8b6329;color:white;border:1px solid #f0c677}
 @media(pointer:coarse){#florestaArsenalButtonV236{left:auto;right:8px;top:148px;padding:8px}#florestaArsenalV236 .va-grid{grid-template-columns:repeat(2,minmax(0,1fr))}}
 `;document.head.appendChild(st);
 const btn=document.createElement('button');btn.type='button';btn.id='florestaArsenalButtonV236';btn.textContent='ARSENAL ∞';btn.hidden=true;document.body.appendChild(btn);
 const panel=document.createElement('div');panel.id='florestaArsenalV236';panel.hidden=true;
 panel.innerHTML=`<div class="va-box" role="dialog" aria-modal="true" aria-label="Arsenal infinito do Floresta"><header><strong>ARSENAL ∞ · FLORESTA V236</strong><button id="florestaArsenalCloseV236">FECHAR ✕</button></header><div class="va-controls"><div class="va-categories"></div><input id="florestaArsenalSearchV236" type="search" placeholder="Buscar espada, machado, poção, minério..." aria-label="Buscar itens do arsenal"></div><div class="va-grid" id="florestaArsenalGridV236"></div><footer id="florestaArsenalStatusV236">Armas, materiais e poções reais do jogo, com estoque ilimitado.</footer></div>`;
 document.body.appendChild(panel);
 const get=id=>document.getElementById(id);
 function openPanel(){if(!unlimited()){updateStatus('Ative o Hack ou entre no Criativo primeiro.');return;}grantAll(true);panel.hidden=false;renderPanel();}
 function closePanel(){panel.hidden=true;}
 btn.addEventListener('click',openPanel);
 get('florestaArsenalCloseV236').addEventListener('click',closePanel);
 panel.addEventListener('pointerdown',e=>{e.stopPropagation();});
 panel.addEventListener('click',e=>{if(e.target===panel)closePanel();const item=e.target.closest?.('button[data-equip]');if(item)use(item.dataset.equip);const tab=e.target.closest?.('button[data-tab]');if(tab){selected=tab.dataset.tab;renderPanel();}});
 get('florestaArsenalSearchV236').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLocaleLowerCase('pt-BR');renderPanel();});
 window.addEventListener('keydown',e=>{if(!panel.hidden&&(e.code==='Escape'||e.code==='KeyZ')){e.preventDefault();e.stopImmediatePropagation();closePanel();}},true);
 function renderPanel(){if(panel.hidden)return;const tabs=panel.querySelector('.va-categories');
  tabs.innerHTML=labels.map(label=>`<button type="button" data-tab="${label}" aria-pressed="${String(selected===label)}">${label}</button>`).join('');
  const ids=Array.from(stock.values()).filter(i=>(selected==='Tudo'||i.group===selected)&&(!searchTerm||(i.name+' '+i.type).toLocaleLowerCase('pt-BR').includes(searchTerm)));
  const equipable=id=>['torch','axe','hammer','pickaxe','spear','wood_shield','armor'].includes(id)||id.startsWith('forged_')||id.startsWith('alq_potion_');
  get('florestaArsenalGridV236').innerHTML=ids.map(i=>`<div class="va-item"><b>${escapeHTML(i.name)}</b><small>${escapeHTML(i.type)} • ∞</small>${equipable(i.id)?`<button data-equip="${escapeHTML(i.id)}">${equipped(i.id)?'✓ EQUIPADO / GUARDAR':'EQUIPAR'}</button>`:'<small>Disponível no inventário</small>'}</div>`).join('')||'<p>Nenhum item com esse filtro.</p>';
 }
 function insertHackButton(){const hack=get('florestaHackPanel');if(!hack||get('florestaHackArmoryBtnV236'))return;
  const b=document.createElement('button');b.id='florestaHackArmoryBtnV236';b.type='button';b.textContent='⚔ ABRIR ARSENAL ∞ (ARMAS E ITENS)';b.addEventListener('click',openPanel);
  const section=hack.querySelector('section');if(section){section.insertBefore(b,section.querySelector('.hackgrid'));}else hack.appendChild(b);
 }
 document.addEventListener('click',e=>{
  const target=e.target.closest?.('button');if(!target)return;
  if((target.dataset.act==='toggle'&&target.closest('#florestaHackPanel')&&!window.gameHackMode?.enabled)||target.id==='modeTestV112')capture();
 },true);
 function tick(){if(!installGuard())return;
  insertHackButton();const isOn=unlimited();document.body.classList.toggle('floresta-v236-infinite',isOn);
  btn.hidden=!isOn;
  if(isOn){
   if(!lastActive&& !survival)capture();
   injectAlchemy();const inv=inventory();
   const incomplete=inv.items.filter(it=>stock.has(it.id)&&it.quantity<LIMIT).length;
   const missing=Array.from(stock.keys()).filter(id=>!inv.items.some(x=>x.id===id)).length;
   const alqN=Array.from(stock.values()).filter(x=>x.group==='Alquimia').length;
   if(missing||incomplete||alqN!==lastAlchemyCount){grantAll(true);lastAlchemyCount=alqN;}
   else syncAlchemy();
  }else if(lastActive){restore();closePanel();}
  lastActive=isOn;
 }
 // Garantir snapshot até nas ativações via API pública, não somente no menu.
 function hook(){const hack=window.gameHackMode;
  if(hack?.setEnabled&&!hack.__v236SetWrapped){const original=hack.setEnabled.bind(hack);hack.setEnabled=on=>{if(on)capture();const ok=original(on);tick();return ok;};hack.__v236SetWrapped=true;}
  const creative=window.gameTestMode;
  if(creative?.enter&&!creative.__v236EnterWrapped){const original=creative.enter.bind(creative);creative.enter=(...args)=>{capture();const result=original(...args);tick();return result;};creative.__v236EnterWrapped=true;}
 }
 const css=document.createElement('style');css.textContent=`body.floresta-v236-infinite #inventoryWeight{display:none!important}body.floresta-v236-infinite #inventoryCapacity::after{content:' · INFINITO';color:#edd087}`;document.head.appendChild(css);
 const api={version:'V236',get unlimited(){return unlimited()},get catalog(){return Array.from(stock.keys())},get count(){return stock.size},grantAll,open:openPanel,equip:use,refresh:tick,debug:()=>({unlimited:unlimited(),count:stock.size,inventory:inventory()?.items.map(i=>i.id)||[],available:Array.from(stock.keys()).filter(id=>inventory()?.items.some(i=>i.id===id))})};
 window.gameAllItemsV236=api;window.gameAllItemsV235=api;
 hook();tick();const pulse=setInterval(()=>{hook();tick();},900);window.addEventListener('pagehide',()=>clearInterval(pulse),{once:true});
 console.info('[FLORESTA V236] Arsenal integrado:',stock.size,'tipos de itens + alquimia.');
})();
