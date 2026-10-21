/* FLORESTA V263 | Contextos compartilhados de entrada, sem bloquear ações legítimas de cada oficina. */
(()=>{'use strict';
 const defs={
  jogo:['WASD / mouse','Mover / olhar'],
  construcao:['B','Construir'],
  posicionando:['R / E','Girar / mudar encaixe'],
  forja:['R','Girar peça na bigorna'],
  alquimia:['Mouse / toque','Manipular ingredientes'],
  inventario:['Clique / toque','Organizar itens'],
  menu:['Clique / toque','Escolher opção'],
  criador:['Escolhas','Aparência do personagem'],
  montaria:['WASD / mouse','Conduzir montaria']
 };
 const overlayIds=['inventoryOverlay','craftOverlay','skillTreeOverlay','constructionOverlay','directorOverlay','alq189Panel','alq195Panel','forgeV222Panel'];
 const hasOpen=id=>{const e=document.getElementById(id);return !!(e&&(e.classList.contains('open')||e.getAttribute('aria-hidden')==='false'&&!e.hidden))};
 const byClass=(...names)=>names.some(c=>document.body.classList.contains(c));
 const visibleDialog=()=>Array.from(document.querySelectorAll('[role="dialog"],.overlay.open')).some(e=>!e.hidden&&e.getClientRects().length>0&&!e.closest('#florestaFront'));
 function context(){
  const f=window.gameFront172;
  if(f&&!f.shell.hidden)return f.shell.dataset.view==='panel'&&document.getElementById('f172PanelTitle')?.textContent==='Personagem'?'criador':'menu';
  if(window.gameHackMode?.state?.open||byClass('editor-open'))return 'menu';
  if(byClass('forge-v222-active','forge-open')||window.gameForgeV222?.active)return 'forja';
  if(byClass('alchemy-open','alchemy-work')||hasOpen('alq189Panel')||hasOpen('alq195Panel'))return 'alquimia';
  if(byClass('construction-open')||hasOpen('constructionOverlay'))return 'construcao';
  if(window.gameConstruction?.active)return 'posicionando';
  if(window.gameInventory?.isOpen||overlayIds.some(hasOpen)||visibleDialog()||window.gameCraft?.active||byClass('crafting-active','u173-modal'))return 'inventario';
  if(window.gameTransport?.active||window.gameSpiderMount?.mounted)return 'montaria';
  return 'jogo';
 }
 const input=e=>!!e.target?.closest?.('input,textarea,select,[contenteditable="true"]');
 const UI=e=>!!e.target?.closest?.('button,a,input,textarea,select,[role="dialog"],[role="menu"],#u173Hotbar,#potion219Picker,#potion219Hotbar,#florestaFront,#h171Drawer,.h171-tools,.u173-tabs,.u173-modal, .construction-panel,.forge-v222-panel');
 const hotkeys=new Set(['Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9','KeyP','KeyY','KeyZ']);
 const gameplayOnly=new Set(['KeyW','KeyA','KeyS','KeyD','ShiftLeft','ShiftRight','Space']);
 const wheelKey='floresta-input-v263';
 let lastContext='';
 window.FlorestaInputV263={context,blocked:()=>!['jogo','montaria'].includes(context()),describe:()=>defs[context()]||defs.jogo,version:'V263'};
 // Teclas de função são reservadas ao navegador, não ao gameplay. Os módulos legados
 // também têm seus atalhos desativados na origem nesta versão.
 addEventListener('keydown',e=>{
  if(/^F(?:[1-9]|1[0-2])$/.test(e.code||'')){e.stopImmediatePropagation();return;}
  if(input(e))return;
  const c=context();
  if(c!=='jogo'&&c!=='montaria'){
   if(hotkeys.has(e.code)){e.preventDefault();e.stopImmediatePropagation();return;}
   // Não bloquear R/F/E/Escape: construção, forja e alquimia têm teclas contextuais próprias.
   if(gameplayOnly.has(e.code)&&!['alquimia','forja','posicionando'].includes(c)){
    e.stopImmediatePropagation();return;
   }
  }
 },true);
 // O scroll sobre qualquer interface deve chegar ao painel, nunca ao equipamento rápido.
 addEventListener('wheel',e=>{
  if(UI(e)||input(e)||!['jogo','montaria'].includes(context())){
    // NÃO cancelar o comportamento nativo de rolagem do painel.
    e.stopImmediatePropagation();
  }
 },{capture:true,passive:true});
 function update(){const c=context();if(c!==lastContext){lastContext=c;document.documentElement.dataset.inputContext=c;
  if(c!=='jogo'&&c!=='montaria'){window.gameReview?.keys?.clear?.();const s=window.gameReview?.stick;if(s)s.x=s.y=0;}
 }
 const e=document.getElementById('florestaInputHint');if(!e)return;
 const f=window.gameFront172,allow=!!f?.started&&f.shell.hidden;
 e.hidden=!allow||c==='menu';
 if(!e.hidden){let parts=defs[c]||defs.jogo;e.textContent=c==='jogo'?'WASD mover · E interagir · I inventário · B construir · Z hack':`${parts[0]} — ${parts[1]} · Esc para voltar`;}
 }
 function mount(){if(document.getElementById('florestaInputHint'))return;const el=document.createElement('div');el.id='florestaInputHint';el.hidden=true;el.setAttribute('aria-live','polite');el.style.cssText='position:fixed;left:50%;bottom:calc(8px + env(safe-area-inset-bottom));transform:translateX(-50%);z-index:1300;max-width:calc(100vw - 24px);padding:5px 10px;background:rgba(8,12,10,.74);color:#e6dfc9;border:1px solid rgba(194,166,106,.3);border-radius:7px;font:600 11px/1.35 system-ui,sans-serif;pointer-events:none;text-align:center;letter-spacing:.025em';document.body.append(el);}
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 const t=setInterval(update,280);window.addEventListener('pagehide',()=>clearInterval(t),{once:true});
})();
