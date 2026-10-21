/* Menu bootstraps before game scripts; gameplay callbacks are held during pause. */
(()=>{
 const nativeRaf=window.requestAnimationFrame.bind(window),nativeCancel=window.cancelAnimationFrame.bind(window),clock=performance.now.bind(performance);
 let paused=false,pauseAt=0,offset=0,sequence=0;const pending=new Map(),gameCallbacks=new WeakSet();
 const now=()=>clock()-offset-(paused?clock()-pauseAt:0);
 try{Object.defineProperty(performance,'now',{configurable:true,value:now});}catch{}

 // Menus cover the entire view. Do not upload/compile an invisible 3D scene.
 const gated=new WeakSet();let suppressed=0;
 function gateRenderer(){const renderer=window.gameReview?.renderer,render=renderer?.render;if(!render||gated.has(render))return;const wrapper=function(...args){if(!window.gameFront172?.shell.hidden){suppressed++;return;}return render.apply(this,args);};gated.add(wrapper);renderer.render=wrapper;}
 window.gameBoot174={get skippedHiddenFrames(){return suppressed},gateRenderer};
 function schedule(id,entry){entry.native=nativeRaf(()=>{if(!pending.has(id))return;if(paused&&entry.game){entry.native=null;return}pending.delete(id);gateRenderer();entry.fn(entry.game?now():clock());});}
 window.requestAnimationFrame=fn=>{if(!paused)gameCallbacks.add(fn);const id=++sequence,entry={fn,native:null,game:gameCallbacks.has(fn)};pending.set(id,entry);if(!paused||!entry.game)schedule(id,entry);return id;};
 window.cancelAnimationFrame=id=>{const e=pending.get(id);if(e?.native!=null)nativeCancel(e.native);pending.delete(id);};
 function pause(){if(paused)return;pauseAt=clock();paused=true;document.exitPointerLock?.();window.gameReview?.keys?.clear?.();const stick=window.gameReview?.stick;if(stick)stick.x=stick.y=0;}
 function resume(){if(!paused)return;offset+=clock()-pauseAt;paused=false;for(const [id,e]of pending)if(e.native==null)schedule(id,e);}
 const icon=p=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
 const icons={continue:icon('<path d="M16 2c3 8-8 9-5 15-4-1-5-3-5-3-5 10 1 16 10 16s17-8 9-19c0 8-4 9-5 7 4-8-1-11-4-16z"/>'),new:icon('<path d="M16 2l-6 8h4l-8 8h6l-9 9h26l-9-9h6l-8-8h4zM16 27v4"/>'),load:icon('<path d="M3 9h10l3 4h13l-4 15H3zM3 13V6h10l3 3h12v4"/>'),settings:icon('<circle cx="16" cy="16" r="5"/><path d="M13 3h6l1 4 4 2 4-1 3 5-3 3v4l3 3-3 5-4-1-4 2-1 4h-6l-1-4-4-2-4 1-3-5 3-3v-4l-3-3 3-5 4 1 4-2z" transform="translate(0 -2) scale(.94)"/>'),credits:icon('<path d="M16 7C12 3 6 3 2 4v24c5-1 10-1 14 3 4-4 9-4 14-3V4c-4-1-10-1-14 3v24M6 9h6m-6 5h6m-6 5h6m8-10h6m-6 5h6m-6 5h6"/>'),exit:icon('<path d="M18 5H4v24h14M14 16h16m-6-6l6 6-6 6"/>')};
 const art=window.florestaV183Art?.ui||{};
 const artIcon=k=>art[k]?`<img class="f183-ui-icon" src="${art[k]}" alt="" aria-hidden="true" draggable="false">`:'';
 icons.new=artIcon('creative');icons.load=artIcon('save');icons.settings=artIcon('settings');icons.credits=artIcon('journal');icons.exit=artIcon('exit');icons.continue=artIcon('map');
 const shell=document.createElement('div');shell.id='florestaFront';shell.dataset.view='loading';shell.innerHTML=`
 <div class="f172-scene"></div><div class="f172-vignette"></div><div class="f172-embers" aria-hidden="true">${Array.from({length:15},(_,i)=>`<i style="--i:${i}"></i>`).join('')}</div>
 <main id="f172Menu" aria-label="Menu principal">
 <div class="f172-logo" role="img" aria-label="Floresta"></div>
 <nav id="f172Actions" aria-label="Opções principais">
 <button data-action="continue" disabled><span>${icons.continue}</span>Continuar</button><button data-action="new"><span>${icons.new}</span>Novo Jogo</button><button data-action="load"><span>${icons.load}</span>Carregar</button><button data-action="settings"><span>${icons.settings}</span>Configurações</button><button data-action="credits"><span>${icons.credits}</span>Créditos</button><button data-action="exit"><span>${icons.exit}</span>Sair</button>
 </nav><p id="f172Message" aria-live="polite"></p><small class="f172-version">FLORESTA · ${window.FlorestaBuild?.version||'V262'}</small></main>
 <section id="f172Loading" role="status" aria-live="polite"><div class="f172-loading-logo" role="img" aria-label="Floresta"></div><div class="f172-progress" role="progressbar" aria-label="Carregamento do jogo" aria-valuemin="0" aria-valuemax="100" aria-valuenow="0"><div id="f172Fill"></div><span id="f172Percent">0%</span></div><p id="f172Stage">Preparando a floresta…</p><small id="f172Tip">Cada noite traz novos perigos.</small><button id="f172Retry" hidden>Recarregar</button></section>
 <section id="f172Panel" role="dialog" aria-modal="true" aria-labelledby="f172PanelTitle" hidden><button id="f172Back" aria-label="Voltar ao menu">← Voltar</button><h2 id="f172PanelTitle"></h2><div id="f172PanelBody"></div></section>
 <section id="f172Exited" hidden><h1>FLORESTA</h1><p>O jogo foi pausado. Você pode fechar esta aba.</p><button id="f172Return">Voltar ao menu</button></section>`;
 document.documentElement.append(shell);
 const api={pause,resume,get paused(){return paused},shell,ready:false,started:false,open:()=>{pause();shell.dataset.view='menu';shell.hidden=false;},nativeRaf,clock};window.gameFront172=api;
 // Original game bindings cannot act through menu dialogs or loading screens.
 for(const type of ['keydown','keyup','pointerdown','pointerup','pointermove','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','wheel'])window.addEventListener(type,e=>{
  // V262: desbloqueio síncrono na interação original, ANTES do bloqueio do menu.
  if(e.isTrusted && (type==='pointerdown'||type==='keydown'||type==='touchstart'))window.FlorestaAudioV262?.unlockFromGesture?.();
  if(shell.hidden)return;
  const ui=e.target?.closest?.('#florestaFront,#h171Drawer');
  if(type==='keydown'&&e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();document.getElementById('f172Back')?.click();return;}
  if(ui){if(type==='keydown')api.handleKey?.(e);if(type==='keydown'||type==='keyup')e.stopImmediatePropagation();return;}
  e.preventDefault();e.stopImmediatePropagation();
 },{capture:true,passive:false});
})();
