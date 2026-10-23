/* FLORESTA V281 | Consolidação das interfaces para toque.
   Alterações apenas no mobile: não altera saves, lógica do mundo nem controles PC. */
(()=>{'use strict';
 const params=new URLSearchParams(location.search);
 if(params.get('platform')==='pc'||(params.get('platform')!=='mobile'&&window.__CAVE_PLATFORM!=='mobile')||window.FlorestaMobile281)return;
 const d=document,root=d.documentElement,$=id=>d.getElementById(id);
 root.classList.add('v281-mobile');
 const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-foundation-v281.css?v=281';css.id='v281MobileCSS';d.head.append(css);
 const state={modal:false,work:false,screen:'front',lastViewport:'',lastDialog:false};
 const selectors=[
  '#inventoryOverlay.open','#craftOverlay.open','#skillTreeOverlay.open','#constructionOverlay.open',
  '#directorOverlay.open','#florestaHackOverlay.open','#constructionManager.open',
  '#h171Drawer:not([hidden])','#v267Utilities:not([hidden])','#v206MountPanel.open',
  '#v207PowersPanel.open','#v207SpiderPanel.open','#forge224Guide:not([hidden])',
  '#alq195Book.open','#fe210-root.fe-visible','#dragonLabV51',
  '#v268EditPanel:not([hidden])','#v267PotionSheet:not([hidden])',
  '#potion219Picker:not([hidden])','#cave186Loading.show'
 ].join(',');
 const visible=e=>!!(e&&!e.hidden&&e.getClientRects().length&&getComputedStyle(e).visibility!=='hidden'&&getComputedStyle(e).display!=='none');
 function viewport(){
  const vv=window.visualViewport,w=Math.max(1,Math.round(vv?.width||innerWidth)),h=Math.max(1,Math.round(vv?.height||innerHeight));
  const key=w+':'+h;if(key===state.lastViewport)return;
  state.lastViewport=key;root.style.setProperty('--v281-width',w+'px');root.style.setProperty('--v281-height',h+'px');
  root.classList.toggle('v281-short',h<410);
  root.classList.toggle('v281-portrait',h>w);
 }
 function resetMotion(){
  const game=window.gameReview;
  game?.keys?.clear?.();if(game?.stick){game.stick.x=0;game.stick.y=0;}
  window.FlorestaMobile268?.stopRun?.();
  window.gameShield?.setBlocking?.(false);
 }
 function isMenu(){return [...d.querySelectorAll(selectors)].some(visible);}
 function isWorking(){return !!(window.gameForgeV230?.active||window.gameCraft?.active||d.body.classList.contains('crafting-active')||$('alq189Panel')?.classList.contains('open'));}
 function playing(){const front=window.gameFront172;return !!(front?.started&&front.shell?.hidden&&!front.paused&&!visible($('florestaFront')));}
 function ensureControls(){
  const more=$('v267More');if(more){more.title='Ações e configurações';more.setAttribute('aria-label','Ações e configurações');}
  const hot=$('u173Hotbar');if(hot){
   hot.setAttribute('aria-label','Equipamentos: arraste para percorrer os itens');
   for(const b of hot.querySelectorAll('.u173-slot'))if(!b.dataset.v281Aria){b.dataset.v281Aria='1';b.removeAttribute('title');}
  }
  const mount=$('v206MountPanel');if(mount&&!mount.dataset.v281Ready){
   mount.dataset.v281Ready='1';mount.setAttribute('aria-label','Montaria e carga');
   const head=mount.querySelector('strong');if(head)head.textContent='MONTARIA · CARGA';
   for(const b of mount.querySelectorAll('[data-mount]')){
    const labels={toggle:'Montar ou descer',load:'Colocar carga',unload:'Retirar carga',pickup:'Pegar madeira',spawn:'Chamar aranha',close:'Fechar painel'};
    b.setAttribute('aria-label',labels[b.dataset.mount]||b.textContent.trim());
    b.title=labels[b.dataset.mount]||'';
   }
  }
  const settings=$('v206SettingGroup');if(settings&&!$('v281ResetInput')){
   const b=d.createElement('button');b.id='v281ResetInput';b.type='button';b.textContent='Destravar comandos';
   b.title='Libera corrida, direção e escudo se o toque ficar preso';
   b.addEventListener('click',()=>{resetMotion();b.textContent='Comandos liberados';setTimeout(()=>{if(b.isConnected)b.textContent='Destravar comandos';},1500)});
   settings.append(b);
  }
  const act=$('v206ActionBtn');if(act)act.setAttribute('aria-label',act.querySelector('span')?.textContent||'Interagir');
  const rotate=$('v206RotateBtn');if(rotate)rotate.setAttribute('aria-label','Girar peça de construção');
 }
 function sync(){
  viewport();ensureControls();
  const open=!root.classList.contains('v268-editing')&&isMenu(),work=isWorking(),run=playing();
  state.modal=open;state.work=work;state.screen=open?'menu':work?'work':run?'play':'front';
  root.classList.toggle('v281-modal-active',open);
  root.classList.toggle('v281-work-active',work&&!open);
  root.classList.toggle('v281-game-active',run&&!open&&!work);
  if((open&&!state.lastDialog)||(!run&&state.screen==='front'&&!state.lastDialog))resetMotion();
  state.lastDialog=open;
  root.classList.toggle('v281-mounted',!!window.gameCreativeSpiderMount?.mounted);
  root.classList.toggle('v281-mount-open',visible($('v206MountPanel'))&&$('v206MountPanel')?.classList.contains('open'));
 }
 // Não interceptar cliques de painéis: eles chamam os controladores originais.
 d.addEventListener('pointerdown',e=>{if(e.target?.closest?.(selectors)&&!state.modal)resetMotion();},{capture:true,passive:true});
 addEventListener('blur',resetMotion);d.addEventListener('visibilitychange',()=>{if(d.hidden)resetMotion()});
 addEventListener('pagehide',resetMotion,{once:true});
 addEventListener('resize',viewport);addEventListener('orientationchange',viewport);
 window.visualViewport?.addEventListener('resize',viewport);
 const clock=setInterval(sync,320);addEventListener('pagehide',()=>clearInterval(clock),{once:true});
 sync();window.FlorestaMobile281={version:'V281',sync,resetMotion,diagnostic:()=>({screen:state.screen,modal:state.modal,work:state.work,mounted:root.classList.contains('v281-mounted'),viewport:state.lastViewport})};
})();