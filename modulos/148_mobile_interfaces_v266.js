/* FLORESTA — mobile presentation and touch access. Native controllers own all game state. */
(()=>{'use strict';
 if(window.__CAVE_PLATFORM!=='mobile'||window.FlorestaMobile266)return;
 const d=document,root=d.documentElement,$=id=>d.getElementById(id);
 function onActivate(button,fn){let touchAt=-Infinity;button.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;e.preventDefault();touchAt=Date.now();fn()});button.addEventListener('click',()=>{if(Date.now()-touchAt>500)fn()});}
 root.classList.add('v266-mobile');
 const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-v266.css?v=266';d.head.append(css);
 const svg=path=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${path}</svg>`;
 const icons={
  attack:svg('<path d="m8 28 14-24M17 7l7-3 5 8-5 6-10-5"/>'),
  roll:svg('<circle cx="20" cy="9" r="3"/><path d="m17 13-7 4 6 4 4-5 5 4M16 21l-6 5M8 8a12 12 0 0 0-3 16m-2-4 2 4 4-2"/>'),
  jump:svg('<circle cx="17" cy="6" r="3"/><path d="m16 11-3 9-6 6m6-6 9 1 4 6M15 13l-7 3m8-3 9-4"/>'),
  run:svg('<circle cx="20" cy="6" r="3"/><path d="m18 11-5 9-8 6m8-6 8 2-1 6M16 14l-6-3-4 5m12-4 5 4 5-1"/>'),
  crouch:svg('<circle cx="18" cy="9" r="3"/><path d="m17 14-6 5 11 2 3 6M13 20l-5 7m8-11 9 1"/>'),
  shield:svg('<path d="m6 6 10-3 10 3v11c0 6-10 12-10 12S6 23 6 17V6Z"/><path d="M16 5v21"/>'),
  power:svg('<path d="m16 3 10 13-10 13L6 16 16 3Zm0 8 4 5-4 5-4-5 4-5Z"/>'),
  book:svg('<path d="M16 7C12 3 7 3 3 5v23c5-2 9-1 13 2 4-3 8-4 13-2V5c-4-2-9-2-13 2Zm0 0v23M7 10h5M7 15h5m8-5h5m-5 5h5"/>'),
  dragon:svg('<path d="M16 16 4 5l2 14 7-2-5 10 11-7 6 6 3-16-9 6 2-12-5 7Z"/>'),
  spider:svg('<ellipse cx="16" cy="19" rx="5" ry="7"/><circle cx="16" cy="10" r="3"/><path d="m11 13-6-6-3 3m9 7-8-2-2 3m10 3-7 3v5m17-16 6-6 3 3m-9 7 8-2 2 3m-10 3 7 3v5"/>'),
  hand:svg('<path d="M9 17V7a2 2 0 0 1 4 0v8-10a2 2 0 0 1 4 0v10-8a2 2 0 0 1 4 0v8-5a2 2 0 0 1 4 0v10c0 7-4 10-10 10-5 0-7-4-11-10-2-3 1-5 3-3l3 4"/>')
 };
 const touch=d.createElement('div');touch.id='v266TouchRoot';d.body.append(touch);
 function skin(id,icon,label){const e=$(id);if(!e||e.dataset.skin266)return;e.innerHTML=icons[icon]+`<span>${label}</span>`;e.setAttribute('aria-label',label);e.dataset.skin266='true';}
 function makeButton(id,icon,label,parent=touch){const b=d.createElement('button');b.id=id;b.type='button';parent.append(b);skin(id,icon,label);return b;}
 const defend=makeButton('v266Defend','shield','Defender');
 const dragonButton=makeButton('v266DragonOpen','dragon','Dragões');let dragonOpen=false;
 onActivate(dragonButton,()=>{dragonOpen=true;root.dataset.mobileDragon='open';sync()});
 let defensePointer=null;
 function releaseDefense(){if(defensePointer===null)return;defensePointer=null;window.gameShield?.setBlocking?.(false);defend.classList.remove('active');}
 defend.addEventListener('pointerdown',e=>{
  if(root.dataset.mobileScreen!=='play'||defend.disabled)return;
  e.preventDefault();e.stopPropagation();defensePointer=e.pointerId;defend.setPointerCapture?.(e.pointerId);
  window.gameShield?.setBlocking?.(true);defend.classList.add('active');
 });
 for(const name of ['pointerup','pointercancel','lostpointercapture'])defend.addEventListener(name,releaseDefense);
 window.addEventListener('blur',releaseDefense);d.addEventListener('visibilitychange',()=>{if(d.hidden)releaseDefense()});
 // The V171 adapter originally marks the unified build as PC and adopts dodge/jump into its hidden drawer.
 function restoreNativeTouch(){
  const style=$('hud171-style');if(style)style.dataset.platform='Mobile';
  for(const id of ['jumpBtn','rollBtn']){const e=$(id);if(e&&e.parentElement!==touch)touch.append(e);}
  skin('rollBtn','roll','Rolar');skin('jumpBtn','jump','Pular');skin('mobileAttackBtn','attack','Atacar');
  skin('mobileRunBtn','run','Correr');skin('mobileCrouchBtn','crouch','Agachar');skin('v206ActionBtn','hand','Pegar');
  skin('v207SpiderOpen','spider','Montaria');
  skin('alqBook','book','Livro de receitas');
  skin('v206MountedAttack','attack','Atacar');skin('v206MountedJump','jump','Pular');
 }
 const modalSelector='#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#constructionOverlay.open,#constructionManager.open,#directorOverlay.open,#florestaHackOverlay.open,#h171Drawer:not([hidden]),#forge224Guide:not([hidden]),#alq195Book.open,#v207PowersPanel.open,#v207SpiderPanel.open,#fe210-root.fe-visible,#dragonLabV51';
 function visible(e){return !!e&&!e.hidden&&e.getClientRects().length>0&&getComputedStyle(e).visibility!=='hidden';}
 function screen(){
  if(visible($('florestaFront')))return 'front';
  if([...d.querySelectorAll(modalSelector)].some(visible))return 'menu';
  if(window.gameForgeV230?.active||$('alq189Panel')?.classList.contains('open'))return 'work';
  if(window.gameCraft?.active||d.body.classList.contains('crafting-active'))return 'craft';
  if(window.gameConstruction?.active||d.body.classList.contains('v206-building')||visible($('alchemyBuildAction')))return 'place';
  return 'play';
 }
 // Isolate touches on panels from camera/attack listeners without cancelling native panel scrolling.
 const panelSelector='.inventory-panel,.craft-panel,.construction-panel,#constructionManager .cm-panel,#skillTreePanel,#directorPanel,#florestaHackPanel,#h171Drawer,#f172Panel,#alq189Panel,#alq195Book,#forge222Panel,#forge224Guide,#v207PowersPanel,#v207SpiderPanel,#fe210-root,#potion219Picker,#f259Journey,#dragonLabV51';
 const bound=new WeakSet();
 function decoratePanels(){
  for(const panel of d.querySelectorAll(panelSelector)){
   if(bound.has(panel))continue;bound.add(panel);panel.classList.add('v266-panel');
   for(const event of ['pointerdown','pointerup','pointermove','touchstart','touchmove','touchend','wheel'])panel.addEventListener(event,e=>e.stopPropagation(),{passive:true});
  }
  // Legacy recipes and catalog tools are appended asynchronously as siblings.
  // Give each screen one bounded scrolling body while keeping its header and tabs reachable.
  const craft=d.querySelector('#craftOverlay .craft-panel');
  if(craft){let scroll=$('v266CraftScroll');if(!scroll){scroll=d.createElement('div');scroll.id='v266CraftScroll';craft.querySelector('.craft-footer')?.before(scroll);if(!scroll.isConnected)craft.append(scroll);}
   for(const e of craft.querySelectorAll(':scope > .craft-content,:scope > .workshop-recipes'))scroll.append(e);
  }
  const construction=d.querySelector('#constructionOverlay .construction-panel');
  if(construction){let scroll=$('v266ConstructionScroll');if(!scroll){scroll=d.createElement('div');scroll.id='v266ConstructionScroll';construction.append(scroll);}
   for(const e of construction.querySelectorAll(':scope > .construction-tools,:scope > .construction-grid,:scope > #v207BuildBody'))scroll.append(e);
   const levels=$('constructionLevels');if(levels&&levels.parentElement===construction)construction.append(levels);
  }
  const editor=$('v256Editor');
  if(editor&&!$('v266BarToggle')){
   const b=d.createElement('button');b.id='v266BarToggle';b.type='button';b.textContent='Organizar barra rápida';b.setAttribute('aria-expanded','false');b.setAttribute('aria-controls','v256Editor');editor.before(b);editor.hidden=true;
   onActivate(b,()=>{editor.hidden=!editor.hidden;b.setAttribute('aria-expanded',String(!editor.hidden));b.textContent=editor.hidden?'Organizar barra rápida':'Concluir organização';});
  }
  const dragons=$('dragonLabV51');if(dragons&&!$('v266DragonClose')){const close=d.createElement('button');close.id='v266DragonClose';close.type='button';close.textContent='Fechar dragões';dragons.prepend(close);dragons.setAttribute('role','dialog');dragons.setAttribute('aria-label','Dragões no criativo');onActivate(close,()=>{dragonOpen=false;root.dataset.mobileDragon='closed';sync()});}
  const settings=$('v206SettingGroup');if(settings&&!$('v266Fullscreen')){for(const [id,target,label]of [['v266Fullscreen','mobileFullscreenBtn','Tela cheia / paisagem'],['v266Quality','mobileQualityBtn','Alternar qualidade']]){const b=d.createElement('button');b.id=id;b.type='button';b.textContent=label;settings.append(b);onActivate(b,()=>$(target)?.click());}}
  for(const e of d.querySelectorAll('.inventory-slot'))e.draggable=false; // tap item, then slot; native HTML drag steals scrolling on touch
 }
 const replacements={
  craftTitle:'Fabricação',forge222Close:'Sair da ferraria',forge224GuideClose:'Fechar',alq195Exit:'Sair da bancada',
  alchemyBuildAction:'Colocar peça',constructionAction:'Colocar peça',v206RotateBtn:'Girar peça',
  'mobileLookHint':'',potion219Use:'Usar'
 };
 function labels(){
  for(const [id,label]of Object.entries(replacements)){const e=$(id);if(e&&e.textContent!==label)e.textContent=label;}
  const action=$('v206ActionBtn')?.querySelector('span');if(action){const txt=window.gameSpiderCargo?.held||window.gameLumber?.carrying||window.gamePlankCarry?.count>0?'Soltar':'Pegar';if(action.textContent!==txt)action.textContent=txt;}
  const power=$('v207PowerCast');if(power&&!power.querySelector('svg'))power.innerHTML=icons.power+'<span>Poder</span>';
  for(const id of ['forge222Entry','alq189Button','alq194Collect']){const e=$(id);if(e){const txt=e.textContent.replace(/\s*[·•]\s*(?:O|L|F)\b/g,'').replace(/\s*\(O\)/g,'');if(e.textContent!==txt)e.textContent=txt;}}
  for(const e of d.querySelectorAll('#forge222Work button')){const t=e.textContent.replace(/\s*·\s*(?:CLIQUE|R)\b/g,'');if(t!==e.textContent)e.textContent=t;}
  const footer=d.querySelector('.inventory-footer-row span:last-child');if(footer)footer.textContent='Toque para selecionar';
  const craftFooter=d.querySelector('.craft-footer');if(craftFooter)craftFooter.textContent='Escolha uma receita. A fabricação acontece com as mãos no mundo.';
  for(const e of d.querySelectorAll('#forge224GuideInfo kbd')){const text=d.createElement('span');text.textContent='o botão Ferraria';e.replaceWith(text);}
  for(const id of ['alq189Context','alchemyBuildHud']){const e=$(id);if(e){const t=e.textContent.replace(/\b[ELF]\s*[·•]\s*/g,'').replace(/Construção \(B\)/g,'Construir');if(t!==e.textContent)e.textContent=t;}}
 }
 function workTools(){
  for(const [id,label]of [['forge222Panel','Ocultar receitas'],['alq189Panel','Ver bancada']]){
   const p=$(id);if(!p||p.querySelector('[data-work-toggle]'))continue;
   const b=d.createElement('button');b.type='button';b.dataset.workToggle='';b.className='v266-work-toggle';b.textContent=label;b.setAttribute('aria-expanded','true');p.append(b);
   onActivate(b,()=>{const collapsed=p.classList.toggle('v266-work-collapsed');b.setAttribute('aria-expanded',String(!collapsed));b.textContent=collapsed?'Mostrar controles':label;});
  }
 }
 let lastScreen='';
 function sync(){
  restoreNativeTouch();decoratePanels();workTools();labels();
  dragonButton.hidden=!window.gameTestMode?.active||!$('dragonLabV51');
  if(dragonButton.hidden){dragonOpen=false;root.dataset.mobileDragon='closed';}
  const next=screen();
  if(next!==lastScreen){root.dataset.mobileScreen=next;lastScreen=next;if(next!=='play'){
   releaseDefense();window.gameReview?.keys?.clear?.();const stick=window.gameReview?.stick;if(stick)stick.x=stick.y=0;
  }}
  const shield=!!window.gameShield?.equipped;defend.disabled=!shield;defend.setAttribute('aria-label',shield?'Segurar para defender':'Equipe um escudo para defender');
  const roll=$('rollBtn');if(roll)roll.classList.toggle('active',!!window.gameRoll?.active);
 }
 sync();const timer=setInterval(sync,240);
 window.addEventListener('pagehide',()=>{clearInterval(timer);releaseDefense()},{once:true});
 window.FlorestaMobile266={version:'V266',sync,screen};
})();
