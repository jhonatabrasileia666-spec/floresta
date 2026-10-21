/* FLORESTA V207 — camada visual MOBILE que usa os controladores reais da V206.
   Nao altera a engine, nao altera a versao PC, nao copia inventario. */
(()=>{'use strict';
 if(window.__CAVE_PLATFORM!=='mobile'||window.__FLORESTA_UI_V207__)return;
 window.__FLORESTA_UI_V207__=true;
 document.documentElement.classList.add('v207-mobile');
 const d=document, $=id=>d.getElementById(id);
 const mk=(tag,id,cls,markup,parent=d.body)=>{const el=d.createElement(tag);el.id=id;el.className=cls||'';el.innerHTML=markup;parent.appendChild(el);return el};
 const set=(el,attr,v)=>el?.setAttribute(attr,String(v));
 const itemNames={pillars:'Pilares de fogo',fireball:'Bola de fogo',stream:'Rajada de fogo'};
 const symbols={pillars:'♨',fireball:'☄',stream:'🔥'};
 const icons={
   spider:`<svg viewBox="0 0 180 115" xmlns="http://www.w3.org/2000/svg"><g fill="#573f2b" stroke="#bd8558" stroke-width="3" stroke-linejoin="round"><path d="M56 63 23 46 6 73M56 66 27 80 11 107M58 43 25 21 5 12M124 63 157 46 174 73M124 66 153 80 169 107M122 43 155 21 175 12" fill="none" stroke-width="10" stroke-linecap="round"/><ellipse cx="92" cy="62" rx="44" ry="32"/><ellipse cx="94" cy="34" rx="25" ry="23"/><path d="M60 54 78 49l25 14-29 10z" fill="#99643e"/></g><g fill="#ec5d24"><circle cx="81" cy="30" r="5"/><circle cx="104" cy="30" r="5"/></g></svg>`,
   floor:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><g stroke="#42240f" stroke-width="2"><path d="M8 69 95 25 153 51 64 97Z" fill="#9b6339"/><path d="M15 64 71 94M32 56 88 86M49 48 106 77M66 39 122 68M83 31 140 60" stroke="#dfac70" stroke-width="7"/><path d="M8 69 64 97 153 51M64 97v8l89-47v-7" fill="none" stroke="#4e321f" stroke-width="5"/></g></svg>`,
   wall:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><g stroke="#402315" stroke-width="3"><path d="M22 98V26L95 8l44 25v65l-46 11Z" fill="#92592e"/><path d="M22 36 95 20l44 25M22 52l73-17 44 25M22 68l73-17 44 25M22 84l73-17 44 25M94 10v97" fill="none" stroke="#d49b54" stroke-width="5"/></g></svg>`,
   roof:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><path d="M9 83 76 14l74 67-54-4-24-33-23 35Z" fill="#79492e" stroke="#c69257" stroke-width="6"/><path d="M15 87 79 20M31 92 87 29M49 96 100 39M69 98l43-49" stroke="#d7a365" stroke-width="6"/><path d="M9 83 49 80 72 44l24 33 54 4" fill="none" stroke="#402515" stroke-width="5"/></svg>`,
   stairs:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><g fill="#895833" stroke="#d9a269" stroke-width="4"><path d="M8 96h50V78h21V59h22V41h21V22h29v75Z"/><path d="M8 94h51M58 76h22M78 57h24M100 39h23M122 20h30" stroke="#482817"/></g></svg>`,
   pillar:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><path d="M69 95V15l18-9 15 10v80l-16 10Z" fill="#a2703e" stroke="#57371d" stroke-width="4"/><path d="M69 30 86 20l16 9M69 50 86 39l16 10M69 71 86 60l16 10M69 91 86 79l16 10" fill="none" stroke="#d8a76e" stroke-width="3"/></svg>`,
   stone:`<svg viewBox="0 0 160 110" xmlns="http://www.w3.org/2000/svg"><path d="m24 75 35-45 60-7 24 37-23 32H48Z" fill="#898680" stroke="#4b473d" stroke-width="5"/><path d="m24 75 59-9 36-43M83 66l37 26" fill="none" stroke="#c7bcb0" stroke-width="5"/></svg>`
 };
 const noticeEl=mk('div','v207Notice','','');let noticeTimer=0;
 function notice(txt){noticeEl.textContent=txt;noticeEl.classList.add('show');clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>noticeEl.classList.remove('show'),2300)}
 const top=$('v206TopBar');
 if(top){
  const bag=$('v206Bag'), build=$('v206Build'), menu=$('v206Menu');
  if(bag)bag.querySelector('span').textContent='Mochila';
  if(build)build.querySelector('span').textContent='Construir';
  if(menu){menu.title='Pausar jogo';menu.setAttribute('aria-label','Pausar jogo');menu.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.7"><path d="M8 5v14M16 5v14"/></svg><span>Menu</span>';
   menu.addEventListener('click',ev=>{ev.preventDefault();ev.stopImmediatePropagation();
     if(window.gameFront172?.open)window.gameFront172.open();
     else window.gameHud171?.open?.();
   },true);
  }
 }
 // Bind to the REAL roll controller (the game already owns its pointer handler).
 const roll=$('rollBtn');if(roll){roll.textContent='Esquivar';roll.title='Esquivar / rolar';roll.setAttribute('aria-label','Esquivar')}
 const attack=$('mobileAttackBtn');if(attack){attack.textContent='Atacar';attack.title='Atacar'}
 const jump=$('jumpBtn');if(jump){jump.textContent='Pular';jump.title='Pular'}
 const run=$('mobileRunBtn');if(run)run.setAttribute('aria-label','Correr');
 const crouch=$('mobileCrouchBtn');if(crouch)crouch.setAttribute('aria-label','Agachar');
 // Equip/attack powers without opening a full tab (main fire button stays on HUD).
 let selectedPower='fireball';
 const powerButton=mk('button','v207PowerCast','',`🔥`);powerButton.type='button';powerButton.title='Usar poder';powerButton.setAttribute('aria-label','Usar poder');
 const powerPicker=mk('button','v207PowerSelect','','⌄');powerPicker.type='button';powerPicker.title='Escolher poder';powerPicker.setAttribute('aria-label','Escolher poder');
 const powerName=mk('span','v207PowerName','',itemNames[selectedPower]);
 const powerPanel=mk('section','v207PowersPanel','',`<div class="v207-panel-head"><strong>⚡ Poderes</strong><button data-close-power aria-label="Fechar poderes">×</button></div><div class="v207-power-cards">
  ${Object.keys(itemNames).map(id=>`<button class="v207-power-card" type="button" data-select-power="${id}"><span class="spell">${symbols[id]}</span><span>${itemNames[id]}</span></button>`).join('')}
  </div><button class="v207-panel-primary" type="button" data-equip-power>⚡ Selecionar poder</button>`);
 function syncPowers(){
  powerName.textContent=itemNames[selectedPower];powerButton.textContent=symbols[selectedPower];powerButton.title='Usar '+itemNames[selectedPower];
  powerPanel.querySelectorAll('[data-select-power]').forEach(x=>x.classList.toggle('active',x.dataset.selectPower===selectedPower));
 }
 function togglePowers(val){const b=typeof val==='boolean'?val:!powerPanel.classList.contains('open');powerPanel.classList.toggle('open',b);spiderPanel.classList.remove('open');set(powerPicker,'aria-expanded',b);if(b)syncPowers()}
 function triggerNativePower(){
  const btn=d.querySelector(`#hud171 .h171-powers button[data-power="${selectedPower}"]`);
  if(!btn){notice('Poderes ainda não carregaram.');return false}
  btn.click();return true;
 }
 powerButton.addEventListener('click',()=>{if(!d.body.classList.contains('v206-modal'))triggerNativePower()});
 powerPicker.addEventListener('click',()=>togglePowers());
 powerPanel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
  if(b.matches('[data-close-power]')){togglePowers(false);return}
  if(b.dataset.selectPower){selectedPower=b.dataset.selectPower;syncPowers();return}
  if(b.hasAttribute('data-equip-power')){togglePowers(false);notice(itemNames[selectedPower]+' selecionado. Toque no ícone para usar.');return}
 });
 syncPowers();
 // Companion panel – calls the real V37 mount and its V201 cargo actions.
 const spiderOpen=mk('button','v207SpiderOpen','','🕷');spiderOpen.type='button';spiderOpen.title='Abrir controles da aranha';spiderOpen.setAttribute('aria-label','Aranha e carga');
 const spiderPanel=mk('section','v207SpiderPanel','',`<div class="v207-panel-head"><strong>🕷 Aranha</strong><button data-close-spider aria-label="Fechar aranha">×</button></div>
  <div class="v207-spider-layout"><div class="v207-spider-portrait">${icons.spider}<strong>Companheira</strong></div>
    <div class="v207-spider-controls">
     <button type="button" data-spider="mount">Montar / Descer</button>
     <button type="button" data-spider="load">Guardar carga</button>
     <button type="button" data-spider="unload">Retirar carga</button>
     <button type="button" data-spider="spawn">Chamar</button>
    </div></div>
    <div class="v207-spider-capacity"><span>🪵 Carga transportada</span><strong id="v207CargoCount">0 / 15 peças</strong></div>`);
 spiderOpen.addEventListener('click',()=>{spiderPanel.classList.toggle('open');powerPanel.classList.remove('open')});
 spiderPanel.addEventListener('click',e=>{
  const b=e.target.closest('button');if(!b)return;
  if(b.hasAttribute('data-close-spider')){spiderPanel.classList.remove('open');return}
  const cargo=window.gameSpiderCargo,mount=window.gameCreativeSpiderMount;
  const action={mount:()=>mount?.mount?.(),load:()=>cargo?.load?.(),unload:()=>cargo?.unload?.(),spawn:()=>mount?.spawn?.()}[b.dataset.spider];
  if(!action)return;
  try{const r=action();if(r===false||r==null)notice('Aproxime-se da aranha e confira a madeira.')}catch(err){console.warn('[V207] Aranha:',err);notice('Ação indisponível neste momento')}
 });
 function syncSpider(){
  const cargo=window.gameSpiderCargo,mount=window.gameCreativeSpiderMount;
  const loaded=Math.max(0,Number(cargo?.loaded)||0);
  const cap=15;
  $('v207CargoCount').textContent=loaded+' / '+cap+' peças';
  const mountBtn=spiderPanel.querySelector('[data-spider="mount"]');if(mountBtn)mountBtn.textContent=mount?.mounted?'Descer da aranha':'Montar / Descer';
 }
 // Construction: select card first, show a large structural preview and real inventory cost.
 const overlay=$('constructionOverlay');
 let selectedDef=null,selectedCard=null,commit=false,grid=null,preview=null;
 function currentResources(def){if(!def)return '';
  const count={};for(const s of def.slots||[])count[s.kind]=(count[s.kind]||0)+1;
  const inventory=window.gameInventory?.items||[];
  const all={rock:'Pedra',branch:'Galho',vine:'Cipó',log:'Tronco',plank:'Tábua'};
  return Object.entries(count).map(([kind,total])=>{
   let have=0;if(kind==='log')have=window.gameLumber?.carrying?1:0;
   else if(kind==='plank')have=window.gamePlankCarry?.count||0;
   else have=inventory.find(x=>x.id===kind)?.quantity||0;
   return `${all[kind]||kind}: ${window.gameTestMode?.active?'∞':have} / ${total}`;
  }).join('  ·  ');
 }
 const artFor=def=>{
  const id=def?.id||'floor_log';
  const kind=/wall|window|door|fence|half/.test(id)?'wall':/stair/.test(id)?'stairs':/roof/.test(id)?'roof':/pillar|column/.test(id)?'pillar':/stone/.test(id)?'stone':'floor';
  return icons[kind];
 };
 function initBuild(){
  if(!overlay||d.getElementById('v207BuildBody'))return;
  const panel=overlay.querySelector('.construction-panel'),cards=panel?.querySelector('.construction-grid');
  if(!cards)return;
  grid=cards;
  const body=mk('div','v207BuildBody','',`<section id="v207BuildDetails"><h3 id="v207BuildTitle">Escolha uma estrutura</h3>
    <div id="v207BuildArt">${icons.floor}</div><div id="v207BuildDesc">Selecione uma peça para verificar o encaixe e os materiais necessários.</div>
    <div id="v207BuildCost"></div><button id="v207PlaceButton" type="button" disabled>Posicionar</button></section>`,panel);
  body.prepend(grid);
  // Building needs a separate two-column layout; preserve the native grid buttons and handlers.
  preview=$('v207BuildDetails');
  function choose(card){if(!card)return;
   selectedCard=card;const index=[...grid.querySelectorAll('.construction-card')].indexOf(card);
   const cat=panel.querySelector('.construction-tab.active')?.dataset.cat||'floor';
   const def=Object.values(window.gameConstruction?.definitions||{}).filter(x=>x.category===cat)[index];
   if(!def)return;
   selectedDef=def;grid.querySelectorAll('.construction-card').forEach(b=>b.classList.toggle('v207-selected',b===card));
   $('v207BuildTitle').textContent=def.name;
   $('v207BuildArt').innerHTML=artFor(def);
   $('v207BuildDesc').textContent=def.desc||'Construção modular';
   $('v207BuildCost').textContent=currentResources(def);
   $('v207PlaceButton').disabled=false;
  }
  // Capture: native selection would close the panel; use first tap for preview, large button to confirm.
  grid.addEventListener('click',e=>{
   if(commit)return;
   const card=e.target.closest('.construction-card');if(!card)return;
   e.stopImmediatePropagation();e.preventDefault();choose(card);
  },true);
  $('v207PlaceButton').addEventListener('click',()=>{
   if(!selectedCard||!selectedDef)return;
   commit=true;
   try{window.gameConstruction?.select?.(selectedDef.id)}finally{commit=false}
  });
  // Observe card rendering after category switches, to attach SVG previews dynamically.
  const observer=new MutationObserver(()=>{
    if(!grid?.isConnected)return;
    const cards=[...grid.querySelectorAll('.construction-card')];
    const category=panel.querySelector('.construction-tab.active')?.dataset.cat||'floor';
    const definitions=Object.values(window.gameConstruction?.definitions||{}).filter(x=>x.category===category);
    cards.forEach((button,i)=>{
      if(!button.querySelector('.v207-mini-art')){
       const element=d.createElement('span');element.className='v207-mini-art';element.innerHTML=artFor(definitions[i]);
       button.prepend(element);
      }
    });
    if(selectedCard&&!selectedCard.isConnected){selectedCard=null;selectedDef=null;$('v207BuildTitle').textContent='Escolha uma estrutura';$('v207BuildArt').innerHTML=icons.floor;$('v207BuildDesc').textContent='Selecione a peça para ver materiais e encaixes.';$('v207BuildCost').textContent='';$('v207PlaceButton').disabled=true}
  });
  observer.observe(grid,{childList:true});
  queueMicrotask(()=>{const buttons=[...grid.querySelectorAll('.construction-card')];const defs=Object.values(window.gameConstruction?.definitions||{}).filter(x=>x.category==='floor');buttons.forEach((b,i)=>{if(!b.querySelector('.v207-mini-art')){const a=d.createElement('span');a.className='v207-mini-art';a.innerHTML=artFor(defs[i]);b.prepend(a)}})});
 }
 // Visual-only inventory enhancements. All inventory actions still use native gameInventory methods.
 function inventoryDetails(){
  const panel=d.querySelector('#inventoryOverlay .inventory-panel');if(!panel||$('v207InventoryAdded'))return;
  panel.id=panel.id||'v207InventoryPanel';
  const footer=panel.querySelector('.inventory-footer-row');if(footer)footer.querySelector('span:last-child').textContent='Toque em um item para selecionar';
  const marker=d.createElement('span');marker.id='v207InventoryAdded';marker.hidden=true;panel.appendChild(marker);
 }
 function sync(){
  initBuild();inventoryDetails();syncSpider();
  if(selectedDef&&overlay?.classList.contains('open'))$('v207BuildCost').textContent=currentResources(selectedDef);
  if(d.body.classList.contains('v206-modal')){powerPanel.classList.remove('open');spiderPanel.classList.remove('open')}
  // Overlay action labels remain controlled by the game's original contextual logic.
  const active=d.querySelector('#florestaFront:not([hidden])')&&!d.body.classList.contains('f172-front-ended');
  for(const el of [powerButton,powerPicker,spiderOpen])el.style.visibility=active?'hidden':'';
 }
 d.addEventListener('pointerdown',e=>{
  if(!powerPanel.contains(e.target)&&e.target!==powerButton&&e.target!==powerPicker)powerPanel.classList.remove('open');
  if(!spiderPanel.contains(e.target)&&e.target!==spiderOpen)spiderPanel.classList.remove('open');
 },{passive:true});
 d.addEventListener('keydown',e=>{if(e.key==='Escape'){powerPanel.classList.remove('open');spiderPanel.classList.remove('open')}});
 sync();const loop=setInterval(sync,450);window.addEventListener('pagehide',()=>clearInterval(loop),{once:true});
 console.info('[Floresta V207] UI bronze/madeira Mobile conectada aos controles nativos; PC preservado.');
})();
