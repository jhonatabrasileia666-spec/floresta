/* FLORESTA V267: RPG HUD for touch. Presentation only; native controllers own state. */
(()=>{'use strict';
 if(window.__CAVE_PLATFORM!=='mobile'||window.FlorestaMobile267)return;
 const d=document,$=id=>d.getElementById(id),root=d.documentElement;
 root.classList.add('v267-mobile');
 const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-rpg-v267.css?v=267';d.head.append(css);
 const svg=p=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
 const art={fireball:svg('<path d="M18 3c4 10-8 9-3 16-5-1-4-6-4-6-9 9-4 16 5 16 10 0 15-10 2-26Z"/><path d="M18 20c-7 5-2 10 2 6"/>'),pillars:svg('<path d="M16 3v26M5 12l11-6 11 6M5 21l11-7 11 7M8 28l8-6 8 6"/>'),stream:svg('<path d="M3 9h17l8 7-8 7H3m3-9h12m-12 4h12"/>'),book:svg('<path d="M16 7C11 3 6 4 3 5v23c5-2 9-1 13 2 4-3 8-4 13-2V5c-4-2-9-2-13 2Zm0 0v23"/>'),more:svg('<path d="m16 3 12 13-12 13L4 16 16 3Z"/><circle cx="16" cy="16" r="3"/>')};
 const hud=d.createElement('section');hud.id='v267Vitals';hud.setAttribute('aria-label','Atributos do personagem');
 hud.innerHTML='<button id="v267Level" type="button" aria-label="Abrir habilidades"><span id="v267LevelNumber">1</span><small>NÍVEL</small></button><div class="v267-bars"><div class="v267-stat hp"><span>VIDA</span><i><b></b></i><small></small></div><div class="v267-stat xp"><span>EXP</span><i><b></b></i><small></small></div><div class="v267-stat armor" hidden><span>ARM</span><i><b></b></i><small></small></div></div>';
 d.body.append(hud);
 function activate(b,fn){let at=-Infinity;b.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;e.preventDefault();at=Date.now();fn()});b.addEventListener('click',()=>{if(Date.now()-at>500)fn()})}
 const openSkills=()=>{window.gameHud171?.close?.();$('skillTreeBtn')?.click()};activate($('v267Level'),openSkills);
 const utilities=d.createElement('aside');utilities.id='v267Utilities';utilities.hidden=true;utilities.setAttribute('aria-label','Acessos do aventureiro');utilities.innerHTML='<header><strong>AVENTUREIRO</strong><button type="button" aria-label="Fechar acessos">×</button></header>';d.body.append(utilities);
 let more=null;function closeUtilities(){utilities.hidden=true;more?.setAttribute('aria-expanded','false')}
 activate(utilities.querySelector('header button'),closeUtilities);
 for(const [target,label]of [['skillTreeBtn','Personagem e habilidades'],['constructionBtn','Construção'],['v207PowerSelect','Escolher poder'],['forge222Entry','Guia da ferraria'],['v207SpiderOpen','Montaria e carga'],['v266DragonOpen','Dragões do criativo']]){
  const b=d.createElement('button');b.type='button';b.dataset.target=target;b.textContent=label;utilities.append(b);activate(b,()=>{closeUtilities();$(target)?.click();window.FlorestaMobile266?.sync()});
 }
 for(const ev of ['pointerdown','pointermove','pointerup','touchstart','touchmove','touchend','wheel'])utilities.addEventListener(ev,e=>e.stopPropagation(),{passive:true});
 const arts=d.createElement('div');arts.id='v267Arts';arts.setAttribute('aria-label','Artes de Ignis');
 for(const [power,name]of [['fireball','Bola de fogo'],['pillars','Pilares de fogo']]){const b=d.createElement('button');b.type='button';b.dataset.power=power;b.innerHTML=art[power];b.setAttribute('aria-label',name);arts.append(b);activate(b,()=>{if(root.dataset.mobileScreen==='play'&&!b.disabled)d.querySelector(`#hud171 [data-power="${power}"]`)?.click()})}
 let workDetails=null,questButton=null,selectedStructure=null,selectedCard=null;
 function attach(){
  const top=$('v206TopBar');if(top&&!more){more=d.createElement('button');more.id='v267More';more.type='button';more.innerHTML=art.book;more.setAttribute('aria-label','Personagem, poderes e montarias');more.setAttribute('aria-expanded','false');more.setAttribute('aria-controls','v267Utilities');top.insertBefore(more,top.lastElementChild);activate(more,()=>{utilities.hidden=!utilities.hidden;more.setAttribute('aria-expanded',String(!utilities.hidden));if(!utilities.hidden){window.gameReview?.keys?.clear?.();const s=window.gameReview?.stick;if(s)s.x=s.y=0}})}
  const dock=$('potion219Dock'),slot=$('potion219Slot');if(dock&&slot&&arts.parentElement!==dock)dock.insertBefore(arts,slot);
  const use=$('potion219Use'),picker=$('potion219Picker'),equip=$('potion219Equip');
  if(use&&picker&&equip){let sheet=$('v267PotionSheet');if(!sheet){sheet=d.createElement('section');sheet.id='v267PotionSheet';sheet.setAttribute('aria-label','Poções e mão esquerda');$('u173Hotbar').append(sheet);for(const ev of ['pointerdown','pointermove','pointerup','touchstart','touchmove','touchend'])sheet.addEventListener(ev,e=>e.stopPropagation(),{passive:true});}if(picker.parentElement!==sheet)sheet.append(picker,equip,use);sheet.hidden=picker.hidden;}

  const select=$('potion219Select');if(select&&!select.dataset.rpg267){select.dataset.rpg267='1';select.innerHTML=svg('<path d="M12 3h8v4h-8zM13 7v6l-7 11c-2 5 4 6 10 6s12-1 10-6l-7-11V7M9 21h14"/>');}
  // Secondary project tools remain reachable without occupying the initial catalogue viewport.
  const panel=d.querySelector('#constructionOverlay .construction-panel');if(panel){
   const tabs=panel.querySelector('.u173-tabs'),close=panel.querySelector('.construction-close');if(tabs&&close&&close.parentElement!==tabs)tabs.append(close);
   const grid=panel.querySelector('.construction-grid');if(grid&&!$('v207BuildBody')){const body=d.createElement('div');body.id='v207BuildBody';body.innerHTML='<section id="v207BuildDetails"><h3 id="v207BuildTitle">Escolha uma estrutura</h3><div id="v207BuildArt"></div><div id="v207BuildDesc">Toque em uma peça para ver materiais e encaixes.</div><div id="v207BuildCost"></div><button id="v207PlaceButton" type="button" disabled>Posicionar</button></section>';($('v266ConstructionScroll')||panel).append(body);body.prepend(grid);}

   if(!workDetails){workDetails=d.createElement('details');workDetails.id='v267Projects';workDetails.innerHTML='<summary>Projetos e busca</summary>';const sc=$('v266ConstructionScroll')||panel;sc.prepend(workDetails)}
   const sc=$('v266ConstructionScroll');if(sc&&workDetails.parentElement!==sc)sc.prepend(workDetails);
   for(const tool of panel.querySelectorAll('.construction-tools'))if(tool.parentElement!==workDetails)workDetails.append(tool);
  }
  const quest=$('f259Journey');if(quest&&!questButton){questButton=d.createElement('button');questButton.id='v267Quest';questButton.type='button';questButton.setAttribute('aria-expanded','false');questButton.setAttribute('aria-controls','f259Journey');d.body.append(questButton);activate(questButton,()=>{if($('f259Journey')?.hidden)$('f259Return')?.click();const open=root.classList.toggle('v267-quest-open');questButton.setAttribute('aria-expanded',String(open))})}
 }
 function stat(cls,value,max,label){const row=hud.querySelector('.'+cls);row.querySelector('b').style.width=`${Math.max(0,Math.min(100,100*value/Math.max(1,max)))}%`;row.querySelector('small').textContent=label;}
 function sync(){
  attach();if(selectedCard&&!selectedCard.isConnected){selectedCard=null;selectedStructure=null;if($('v207PlaceButton'))$('v207PlaceButton').disabled=true;}const screen=root.dataset.mobileScreen,play=screen==='play';if(!play)closeUtilities();
  const prog=window.gameProgression,s=prog?.state,hp=Number(window.gameZombie?.playerHp??0),max=Number(window.gameZombie?.maxPlayerHp??prog?.getMaxHealth?.()??100);
  stat('hp',hp,max,`${Math.ceil(hp)} / ${max}`);const need=prog?.xpRequired?.()||100;stat('xp',s?.xp||0,need,`${Math.floor(s?.xp||0)} / ${need}`);
  $('v267LevelNumber').textContent=s?.level||1;const xpPct=(s?.xp||0)/need;hud.style.setProperty('--xp-angle',`${Math.min(1,xpPct)*360}deg`);$('v267Level').classList.toggle('has-points',(s?.skillPoints||0)>0);$('v267Level').setAttribute('aria-label',`Nível ${s?.level||1}. ${s?.skillPoints||0} pontos. Abrir habilidades`);
  const primitive=window.gamePrimitive;hud.querySelector('.armor').hidden=!primitive?.armorEquipped;if(primitive?.armorEquipped)stat('armor',primitive.armorDurability||0,primitive.armorMaxDurability||100,`${Math.ceil(primitive.armorDurability||0)} / ${primitive.armorMaxDurability||100}`);
  const creative=!!window.gameTestMode?.active,choice=window.gameIgnisLegacy?.choice;
  const visiblePowers=choice==='stream'?['stream','fireball']:['fireball','pillars'];
  for(const [i,b]of [...arts.children].entries()){if(b.dataset.power!==visiblePowers[i]){b.dataset.power=visiblePowers[i];b.innerHTML=art[b.dataset.power];b.setAttribute('aria-label',b.dataset.power==='stream'?'Rajada de fogo':'Bola de fogo');}b.disabled=!creative&&choice!==b.dataset.power;b.classList.toggle('unlocked',!b.disabled);b.title=b.disabled?'Derrote Ignis para despertar esta arte':b.getAttribute('aria-label');}
  const power=$('v207PowerCast');if(power){if(!power.dataset.native267){power.dataset.native267='1';power.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();if(root.dataset.mobileScreen!=='play'||power.disabled)return;const id=window.gameTestMode?.active?window.gameTestMode.power:window.gameIgnisLegacy?.choice;if(id)d.querySelector(`#hud171 [data-power="${id}"]`)?.click()},true);}
const id=creative?window.gameTestMode?.power:choice;const key=id||'fireball';if(power.dataset.rpgPower!==key||!power.querySelector('svg')){power.innerHTML=(art[key]||art.fireball)+'<span>Poder</span>';power.dataset.rpgPower=key;}power.disabled=!creative&&!choice;power.classList.toggle('v267-locked',power.disabled);}
  const shield=$('v266Defend');if(shield)shield.hidden=!window.gameShield?.equipped;
  const equip=$('potion219Equip'),select=$('potion219Select');root.classList.toggle('v267-has-potion',!!equip&&!equip.disabled);
  if(select&&equip){const img=equip.querySelector('img'),qty=equip.querySelector('small')?.textContent||'0';const key=(img?.getAttribute('src')||'')+qty;if(select.dataset.potionArt!==key){select.dataset.potionArt=key;select.replaceChildren();if(img&&qty!=='0'){select.append(img.cloneNode());const n=d.createElement('small');n.textContent=qty;select.append(n);}else select.innerHTML=svg('<path d="M12 3h8v4h-8zM13 7v6l-7 11c-2 5 4 6 10 6s12-1 10-6l-7-11V7M9 21h14"/>');}}

  for(const b of utilities.querySelectorAll('[data-target]')){const t=$(b.dataset.target);b.hidden=!t||(b.dataset.target==='v266DragonOpen'&&!creative);}
  if(questButton){const q=$('f259Journey'),title=q?.querySelector('h3');questButton.hidden=!q||!play||!!window.gameTestMode?.active||!title?.textContent;questButton.textContent=(title?.textContent||'Jornada')+'  ›';}
 }
 // Use blueprint IDs rather than category indexes, including filtered search results.
 d.addEventListener('click',e=>{
  const card=e.target.closest('#constructionOverlay .construction-card'),place=e.target.closest('#v207PlaceButton');
  if(!card&&!place)return;e.preventDefault();e.stopImmediatePropagation();if(e.isTrusted&&Date.now()-(touchTimes.get(card||place)||0)<650)return;
  if(place){if(selectedStructure)window.gameConstruction?.select?.(selectedStructure.id);return;}
  const id=card.dataset.blueprint,def=window.gameConstruction?.definitions?.[id];if(!def)return;
  selectedStructure=def;selectedCard=card;
  d.querySelectorAll('.construction-card').forEach(c=>c.classList.toggle('v207-selected',c===card));
  $('v207BuildTitle').textContent=def.name;$('v207BuildDesc').textContent=def.desc||'Construção modular';$('v207BuildArt').replaceChildren();const preview=d.createElement('img');preview.src=def.preview;preview.alt=def.name;$('v207BuildArt').append(preview);
  const resources={};for(const slot of def.slots||[])resources[slot.kind]=(resources[slot.kind]||0)+1;const names={log:'Troncos',plank:'Tábuas',rock:'Pedras',branch:'Galhos',vine:'Cipós'};$('v207BuildCost').textContent='Materiais: '+Object.entries(resources).map(([key,n])=>`${n} ${names[key]||key}`).join(' · ');$('v207PlaceButton').disabled=false;
 },true);
 // Click-only legacy buttons need an explicit touch activation: camera handlers cancel compatibility clicks.
 const clickOnly='#v206Bag,#v206Build,#v206Menu,#v206ActionBtn,#v207PowerCast,#potion219Select,#potion219Equip,#potion219Use,#potion219Picker [data-potion],.u173-tabs button,.construction-tab,.construction-card,#v207PlaceButton,.construction-close,#skillTreeClose,#inventoryClose,#craftClose';
 const touchTimes=new WeakMap();
 d.addEventListener('pointerdown',e=>{const b=e.target.closest(clickOnly);if(b&&e.pointerType==='touch')b.dataset.touchStart267=String(e.clientX)+','+String(e.clientY)},true);
 d.addEventListener('pointerup',e=>{const b=e.target.closest(clickOnly);if(!b||e.pointerType!=='touch'||b.disabled)return;const start=b.dataset.touchStart267?.split(',').map(Number);delete b.dataset.touchStart267;if(!start||Math.hypot(e.clientX-start[0],e.clientY-start[1])>12)return;e.preventDefault();touchTimes.set(b,Date.now());b.click()},true);
 d.addEventListener('click',e=>{const b=e.target.closest(clickOnly);if(b&&e.isTrusted&&Date.now()-(touchTimes.get(b)||0)<650){e.preventDefault();e.stopImmediatePropagation()}},true);
 // Outside touches close the compact menu without swallowing the underlying game action.
 d.addEventListener('pointerdown',e=>{if(!utilities.hidden&&!e.target.closest('#v267Utilities,#v267More'))closeUtilities()},true);
 sync();const timer=setInterval(sync,180);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});window.FlorestaMobile267={version:'V267',sync};
})();
