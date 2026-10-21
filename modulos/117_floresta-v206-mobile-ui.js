
/* Floresta V206 -- interface exclusivamente mobile. Todas as ações chamam os controladores originais. */
(()=>{'use strict';
 if(window.__FLORESTA_MOBILE_UI_V206__)return;
 if(window.__CAVE_PLATFORM!=='mobile')return;
 window.__FLORESTA_MOBILE_UI_V206__=true;
 const doc=document;
 const $=id=>doc.getElementById(id);
 const icon=(paths)=>`<svg viewBox="0 0 24 24" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;
 const icons={
 bag:icon('<path d="M5 7h14l1 14H4L5 7Zm4 0V5a3 3 0 0 1 6 0v2"/>'),
 build:icon('<path d="m3 10 9-6 9 6v10H3V10Zm0 4h18M8 14v6m8-6v6"/>'),
 spider:icon('<circle cx="12" cy="12" r="3"/><path d="M9 9 5 6 2 8m13 1 4-3 3 2M9 15l-4 3-3-2m13-1 4 3 3-2M9 12H2m13 0h7"/>'),
 power:icon('<path d="m13 2-8 11h7l-1 9 8-12h-7l1-8Z"/>'),
 menu:icon('<path d="M4 6h16M4 12h16M4 18h16"/>'),
 hand:icon('<path d="M8 13V6a1.4 1.4 0 0 1 2.8 0v5m0-6a1.4 1.4 0 0 1 2.8 0v6m0-5a1.4 1.4 0 0 1 2.8 0v5m0-3a1.4 1.4 0 0 1 2.8 0v7c0 4-3 6-7 6H9c-3 0-4-2-7-7a1.5 1.5 0 0 1 2.5-1.6L8 16"/>'),
 sword:icon('<path d="m3 21 6-6M8 14l2 2M10 13 19 3l2 2-10 9M4 17l3 3"/>'),
 up:icon('<path d="m5 14 7-7 7 7m-7-7v13"/>')
 };
 doc.documentElement.classList.add('v206-mobile');
 const add=(tag,id,cls,html,parent=doc.body)=>{const el=doc.createElement(tag);el.id=id;if(cls)el.className=cls;el.innerHTML=html;parent.appendChild(el);return el};
 const bar=add('nav','v206TopBar','',
  [['v206Bag','Mochila','bag'],['v206Build','Construir','build'],['v206Spider','Aranha','spider'],['v206Powers','Poder','power'],['v206Menu','Menu','menu']]
  .map(([id,label,key])=>`<button id="${id}" type="button" aria-label="${label}" title="${label}">${icons[key]}<span>${label}</span></button>`).join(''));
 const action=add('button','v206ActionBtn','',`${icons.hand}<span>Pegar</span>`);
 action.type='button';action.setAttribute('aria-label','Pegar ou interagir');
 const rotate=add('button','v206RotateBtn','','Girar 90°');rotate.type='button';
 const mountPanel=add('div','v206MountPanel','',`<strong>ARANHA · CARGA</strong>
   <button data-mount="toggle">Montar / Descer</button><button data-mount="load">Colocar carga</button>
   <button data-mount="unload">Retirar carga</button><button data-mount="pickup">Pegar madeira</button>
   <button data-mount="spawn">Chamar aranha</button><button data-mount="close">Fechar</button>`);
 mountPanel.setAttribute('role','dialog');mountPanel.setAttribute('aria-label','Controles da aranha');
 const attack=add('button','v206MountedAttack','',`${icons.sword}Atacar`);attack.type='button';
 const jump=add('button','v206MountedJump','',`${icons.up}Pular`);jump.type='button';
 const hint=add('div','v206Hint','','');
 let hintUntil=0;
 function notice(s){hint.textContent=s;hint.classList.add('show');hintUntil=Date.now()+1900}
 function key(code){window.dispatchEvent(new KeyboardEvent('keydown',{key:code,code,bubbles:true,cancelable:true}));window.dispatchEvent(new KeyboardEvent('keyup',{key:code,code,bubbles:true,cancelable:true}))}
 function bag(){const b=$('inventoryBtn');if(b)b.click();else notice('Inventário ainda não carregado')}
 function build(){const g=window.gameConstruction;if(g?.open)g.open();else $('constructionBtn')?.click()}
 function menu(){const d=window.gameHud171;if(d?.open)d.open();else $('mobileMenuBtn')?.click()}
 function power(){doc.body.classList.toggle('v206-powers-open');mountPanel.classList.remove('open');$('v206Spider')?.setAttribute('aria-expanded','false')}
 function spider(){const v=mountPanel.classList.toggle('open');$('v206Spider').setAttribute('aria-expanded',String(v));doc.body.classList.remove('v206-powers-open')}
 $('v206Bag').addEventListener('click',bag);
 $('v206Build').addEventListener('click',build);
 $('v206Menu').addEventListener('click',menu);
 $('v206Powers').addEventListener('click',power);
 $('v206Spider').addEventListener('click',spider);
 action.addEventListener('click',()=>{
  const g=window.gameLumber,planks=window.gamePlankCarry,sp=window.gameSpiderCargo;
  if(sp?.held){sp.drop();return}
  if(g?.carrying||planks?.count>0){key('KeyG');return}
  // Conserva a interação original Q, inclusive cipós, galhos e peças do chão.
  key('KeyQ');
 });
 rotate.addEventListener('click',()=>key('KeyR'));
 attack.addEventListener('click',()=>window.gameCreativeSpiderMount?.attack?.());
 jump.addEventListener('click',()=>window.gameCreativeSpiderMount?.jump?.());
 mountPanel.addEventListener('click',e=>{
  const name=e.target.closest('[data-mount]')?.dataset.mount;if(!name)return;
  const spiderGame=window.gameCreativeSpiderMount, cargo=window.gameSpiderCargo;
  if(name==='close'){mountPanel.classList.remove('open');$('v206Spider').setAttribute('aria-expanded','false');return}
  if(!spiderGame&&name!=='close'){notice('A montaria ainda está carregando');return}
  const fn={toggle:()=>spiderGame?.mount?.(),load:()=>cargo?.load?.(),unload:()=>cargo?.unload?.(),pickup:()=>cargo?.pickup?.(),spawn:()=>spiderGame?.spawn?.()}[name];
  if(fn){try{const res=fn();if(res===false)notice('Aproxime-se da aranha e confira os materiais')}catch(err){console.warn('[V206] Ação da montaria',err);notice('Não foi possível realizar essa ação')}}
 });
 doc.addEventListener('pointerdown',e=>{
  if(!mountPanel.contains(e.target)&&!$('v206Spider').contains(e.target)){
   mountPanel.classList.remove('open');$('v206Spider').setAttribute('aria-expanded','false');
  }
 },{passive:true});
 function addSettings(){
  const parent=$('h171Drawer');if(!parent||$('v206SettingGroup'))return;
  const area=add('section','v206SettingGroup','',`<strong>CONTROLES DO CELULAR</strong>
   <label for="v206Opacity">Transparência dos botões <span id="v206OpacityText">90%</span></label>
   <input id="v206Opacity" type="range" min="60" max="100" step="5" value="90">`,parent);
  const opacity=$('v206Opacity');
  try{const v=Number(localStorage.getItem('floresta-v206-opacity'));if(v>=60&&v<=100)opacity.value=v;}catch{}
  function changeOpacity(){const v=Number(opacity.value);doc.documentElement.style.setProperty('--v206-glass',`rgba(12,21,18,${v/100})`);$('v206OpacityText').textContent=v+'%';try{localStorage.setItem('floresta-v206-opacity',String(v))}catch{}}
  opacity.addEventListener('input',changeOpacity);changeOpacity();
 }
 let lastModal=false,lastMounted=false,lastBuild=false,lastAction='';
 function sync(){
  const b=doc.body, builder=window.gameConstruction, spiderGame=window.gameCreativeSpiderMount;
  const modal=!!doc.querySelector('#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#directorOverlay.open,#constructionOverlay.open,#florestaHackOverlay.open') || !!($('h171Drawer')&&!$('h171Drawer').hidden);
  if(modal!==lastModal){b.classList.toggle('v206-modal',modal);lastModal=modal}
  const mounted=!!spiderGame?.mounted;if(mounted!==lastMounted){b.classList.toggle('v206-mounted',mounted);lastMounted=mounted}
  const buildActive=!!builder?.active;
  if(buildActive!==lastBuild){b.classList.toggle('v206-building',buildActive);lastBuild=buildActive}
  if(Date.now()>hintUntil&&hint.classList.contains('show'))hint.classList.remove('show');
  if(!buildActive){
   const label=window.gameSpiderCargo?.held?'Soltar':window.gameLumber?.carrying||window.gamePlankCarry?.count>0?'Soltar':'Pegar';
   if(label!==lastAction){lastAction=label;action.querySelector('span').textContent=label;action.setAttribute('aria-label',label)}
  }
  // Não permite clique nos comandos móveis durante a tela inicial / pausa.
  const notPlaying=b.classList.contains('mobile-ui-paused')||!!doc.querySelector('#florestaFront:not([hidden])');
  bar.style.visibility=notPlaying?'hidden':'';
  action.style.visibility=notPlaying?'hidden':'';
  addSettings();
 }
 sync();
 const clock=setInterval(sync,320);window.addEventListener('pagehide',()=>clearInterval(clock),{once:true});
 console.info('[Floresta V206] Interface Mobile isolada do PC, controles nativos preservados.');
})();

