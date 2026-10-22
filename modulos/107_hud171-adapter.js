/* HUD V171 — presentation adapter. Original game controllers and DOM controls remain intact. */
(()=>{
 const $=id=>document.getElementById(id),S=paths=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
 const icons={bag:S('<path d="M10 10V7a6 6 0 0112 0v3M7 10h18l2 18H5zM11 17h10v8H11zM10 10v5m12-5v5"/>'),craft:S('<path d="M7 28l14-20M17 5l5-3 8 6-5 5zM5 5l7 7m-8 7l7-7"/>'),gear:S('<circle cx="16" cy="16" r="5"/><path d="M13 3h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z" transform="translate(0 -2) scale(.94)"/>'),axe:S('<path d="M9 29l12-25M17 8l5-5 8 5-4 8-11-3"/>'),torch:S('<path d="M12 29l4-16m-4-3c-4-5 7-6 4-10 10 8 7 11 2 14M13 14l7 2"/>'),shield:S('<path d="M6 5l10-3 10 3v11c0 7-10 14-10 14S6 23 6 16z"/>'),pillars:S('<path d="M4 28h24M7 26V14l3-6 3 6v12M18 26V9l3-7 3 7v17"/>'),fireball:S('<path d="M9 25c-10-12 11-10 8-24 16 18 14 25 2 28-9 1-10-8-4-12"/>'),stream:S('<path d="M3 24c20 0 8-14 24-14M5 16c18 0 7-12 20-12M8 29c14-1 8-12 21-12"/>'),camera:S('<path d="M3 10h7l3-5h7l3 5h6v17H3z"/><circle cx="16" cy="18" r="6"/>'),sigil:S('<path d="M16 30V2M16 24L4 13m12 6L27 8M16 12L9 5m7 20l11-7"/>')};
 const uiArt=window.florestaV183Art?.ui||{},artIcon=k=>uiArt[k]?`<img class="f183-ui-icon" src="${uiArt[k]}" alt="" draggable="false" aria-hidden="true">`:null;
 icons.bag=artIcon('bag')||icons.bag;icons.craft=artIcon('craft')||icons.craft;icons.gear=artIcon('settings')||icons.gear;
 icons.pillars=artIcon('powers')||icons.pillars;icons.fireball=artIcon('powers')||icons.fireball;icons.stream=artIcon('powers')||icons.stream;
 const root=document.createElement('div');root.id='hud171';root.innerHTML=`<div class="h171-sigil">${icons.sigil}</div><div class="h171-compass"><div class="h171-scale">│　·　│　·　│　·　<span id="h171Heading">N</span>　·　│　·　│　·　│</div></div><nav class="h171-tools"><button data-native="inventoryBtn" title="Inventário (I)">${icons.bag}<small>I</small></button><button data-native="craftBtn" title="Fabricação (R)">${icons.craft}<small>R</small></button><button id="h171Menu" title="Todas as ações e opções">${icons.gear}<small>MENU</small></button></nav><div class="h171-hands"><button id="h171Right" title="Equipamentos da mão direita">${icons.axe}<span id="h171RightName">Mão direita</span></button><button id="h171Left" title="Equipamentos da mão esquerda">${icons.torch}<span id="h171LeftName">Mão esquerda</span></button></div><div class="h171-powers"><button data-power="pillars" title="Pilares de fogo">${icons.pillars}</button><button data-power="fireball" title="Bola de fogo">${icons.fireball}</button><button data-power="stream" title="Rajada de fogo">${icons.stream}</button><span id="h171PowerName">Habilidades · H</span></div><button id="h171Camera" title="Alternar primeira e terceira pessoa">${icons.camera}</button>`;
 document.body.append(root);
 const drawer=document.createElement('aside');drawer.id='h171Drawer';drawer.hidden=true;drawer.setAttribute('aria-label','Ações e opções do jogo');drawer.innerHTML='<header><span>AÇÕES & OPÇÕES</span><button id="h171Close" aria-label="Fechar ações">×</button></header><div id="h171Shortcuts"></div><section id="h171Native"></section><section id="h171Details"></section>';
 document.body.append(drawer);
 const adopted=new Set(),nativeIds=['equipBtn','inventoryBtn','craftBtn','skillTreeBtn','directorBtn','constructionBtn','graphicsToggleV146','dayNightSpeed','cameraToggleBtn','cameraViewBtn','viewToggleBtn','cameraModeBtn'];
 const open=()=>{drawer.hidden=false;document.exitPointerLock?.();};
 const close=()=>{drawer.hidden=true;};
 $('h171Menu').onclick=()=>drawer.hidden?open():close();$('h171Close').onclick=close;
 root.querySelectorAll('[data-native]').forEach(b=>b.onclick=()=>{close();$(b.dataset.native)?.click();});
 $('h171Right').onclick=$('h171Left').onclick=open;
 // Keyboard shortcuts use the original binding, including its equip validation.
 const keys=[['Digit1','Machado'],['Digit2','Martelo'],['Digit3','Pedra'],['Digit4','Graveto'],['Digit5','Lasca'],['Digit6','Tocha'],['Digit7','Escudo']];
 for(const [code,label] of keys){const b=document.createElement('button');b.textContent=`${code.slice(-1)} · ${label}`;b.onclick=()=>{close();window.dispatchEvent(new KeyboardEvent('keydown',{code,key:code.slice(-1),bubbles:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code,key:code.slice(-1),bubbles:true}));};$('h171Shortcuts').append(b);}
 function cameraButton(){return [...document.querySelectorAll('button')].find(b=>!b.closest('#hud171,#h171Drawer')&&/primeira.*terceira|terceira.*primeira|câmera.*F4|câmera.*pessoa|1ª.*3ª|1P.*3P/i.test(b.textContent+' '+b.title))||nativeIds.map($).find(b=>b&&/camera|view/i.test(b.id));}
 $('h171Camera').onclick=()=>{const b=cameraButton()||[...$('h171Native').querySelectorAll('button')].find(b=>/câmera|pessoa/i.test(b.textContent));if(b)b.click();else{window.dispatchEvent(new KeyboardEvent('keydown',{code:'F4',key:'F4',bubbles:true}));window.dispatchEvent(new KeyboardEvent('keyup',{code:'F4',key:'F4',bubbles:true}));}};
 root.querySelectorAll('[data-power]').forEach(b=>b.onclick=()=>{if(window.gameTestMode?.active){window.gameTestMode.setPower(b.dataset.power);document.querySelector(`#testHudV112 [data-test-power="${b.dataset.power}"]`)?.click();}else if(window.gameIgnisLegacy?.choice===b.dataset.power)window.gameIgnisLegacy.cast();else $('skillTreeBtn')?.click();});
 drawer.addEventListener('click',e=>{const b=e.target.closest('button');if(b&&['inventoryBtn','craftBtn','skillTreeBtn','directorBtn','constructionBtn'].includes(b.id))close();});
 window.addEventListener('keydown',e=>{if(e.code!=='Escape')return;if(!drawer.hidden){e.preventDefault();close();}else if(!document.querySelector('#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#directorOverlay.open'))open();},true);
 function adopt(el,destination){if(!el||adopted.has(el)||el.closest('#h171Drawer'))return;adopted.add(el);destination.append(el);el.dataset.hud171Adopted='true';}
 function sync(){
   // All original utility buttons keep their identity and event listeners.
   for(const id of nativeIds)adopt($(id),$('h171Native'));
   if(window.__CAVE_PLATFORM!=='mobile'&&$('hud171-style').dataset.platform==='PC')for(const id of ['jumpBtn','rollBtn'])adopt($(id),$('h171Native'));
   const camButton=cameraButton();if(camButton)adopt(camButton,$('h171Native'));
   for(const id of ['timeTestPanel','graphicsPanelV146','testHudV112','hint','status','lumberStatus','resourceStatus','pickupStatus','zombieHudState','playerXpText','skillPointsHud','quickHandsHud','quickHandsHelp'])adopt($(id),$('h171Details'));
   // Catch extra/future utility controls without moving touch or contextual actions.
   for(const b of [...document.querySelectorAll('body > button,#hud > button')]){
    if(adopted.has(b)||b.closest('#hud171,#h171Drawer')||/mobile|jump|pickup|roll|crouch|run|log|lumber|constructionAction|constructionCancel|plank|board|place|confirm|cancel/i.test(b.id))continue;
    if(window.__CAVE_PLATFORM==='mobile'&&/^(v206|v207|v266|v267|forge222Entry|alq189Button|alq194Collect)/.test(b.id))continue;
    const rect=b.getBoundingClientRect();if(rect.width&&rect.top<innerHeight*.62)adopt(b,$('h171Native'));
   }
   const g=window.gameReview,yaw=g?.player?.yaw||0,deg=((yaw*180/Math.PI)%360+360)%360;const dirs=['N','NO','O','SO','S','SE','L','NE'];$('h171Heading').textContent=dirs[Math.round(deg/45)%8];
   const right=window.gameRightHand?.current;const item=window.gameInventory?.items?.find(i=>i.id===right);$('h171RightName').textContent=item?.name||(right?'Equipamento':'Mão livre');
   const left=document.querySelector('.qh-group[data-hand="left"] .qh-slot.active .qh-name');$('h171LeftName').textContent=left?.textContent||(g?.isEquipped?.()?'Tocha acesa':'Mão esquerda');
   const choice=window.gameTestMode?.active?window.gameTestMode.power:window.gameIgnisLegacy?.choice;root.querySelectorAll('[data-power]').forEach(b=>{b.classList.toggle('chosen',b.dataset.power===choice);b.classList.toggle('locked',!window.gameTestMode?.active&&choice!==b.dataset.power);});
   const old=$('ignisPowerHudV111');$('h171PowerName').textContent=old?.classList.contains('show')?old.textContent.trim().replace(/\s+/g,' '):(window.gameTestMode?.active?`${{pillars:'Pilares',fireball:'Bola de fogo',stream:'Rajada'}[choice]} · Nv. ${gameTestMode.ignisRank}`:'Habilidades · H');
   // Context prompts and operation overlays remain native, live and interactive.
   document.body.classList.toggle('h171-modal',!!document.querySelector('#inventoryOverlay.open,#craftOverlay.open,#skillTreeOverlay.open,#directorOverlay.open'));
 }
 sync();const timer=setInterval(sync,200);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
 window.gameHud171={version:'V171',open,close,get controls(){return [...adopted].map(e=>e.id)},sync};
})();
