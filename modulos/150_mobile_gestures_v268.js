/* FLORESTA V268 — gestos RPG mobile. Sem substituir motor, saves ou controles PC. */
(()=>{'use strict';
if(window.__CAVE_PLATFORM!=='mobile'||window.FlorestaMobile268)return;
const d=document,root=d.documentElement,$=id=>d.getElementById(id);
root.classList.add('v268-mobile');
const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-gestos-v268.css?v=275';d.head.append(css);
const KEY='floresta-mobile-hud-layout-v268',SPRINT_KEY='floresta-mobile-auto-run-distance-v269';
let sprintDistance=.80;try{const n=Number(localStorage.getItem(SPRINT_KEY));if(n>=.50&&n<=1.20)sprintDistance=n;}catch{}
const targetIds=['stick','mobileAttackBtn','jumpBtn','rollBtn','v266Defend','mobileRunBtn','mobileCrouchBtn','v206ActionBtn','v207PowerCast','u173Hotbar','v206TopBar'];
const remembered=new Map();let layout={};try{const data=JSON.parse(localStorage.getItem(KEY)||'{}');if(data&&typeof data==='object')layout=data;}catch{}
function save(){try{localStorage.setItem(KEY,JSON.stringify(layout));}catch(e){console.warn('[V268] Preferências locais indisponíveis',e)}}
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const play=()=>root.dataset.mobileScreen==='play'&&!window.FlorestaInputV263?.blocked?.();
function applyOne(el,p){if(!el||!p||!Number.isFinite(p.x)||!Number.isFinite(p.y))return;
const s=clamp(Number(p.s)||1,.7,1.55);
const width=el.offsetWidth*s,height=el.offsetHeight*s;
el.style.setProperty('position','fixed','important');
el.style.setProperty('left',Math.round(clamp(p.x,0,1)*Math.max(1,innerWidth-width))+'px','important');
el.style.setProperty('top',Math.round(clamp(p.y,0,1)*Math.max(1,innerHeight-height))+'px','important');
el.style.setProperty('right','auto','important');el.style.setProperty('bottom','auto','important');
el.style.setProperty('transform-origin','top left','important');
el.style.setProperty('transform','scale('+s+')','important');
}
function clearOne(el){if(!el)return;for(const name of ['position','left','top','right','bottom','transform','transform-origin'])el.style.removeProperty(name)}
function layoutSync(){for(const id of targetIds){const el=$(id);if(el&&layout[id]&&!el.dataset.v268Positioned){applyOne(el,layout[id]);el.dataset.v268Positioned='1';}}}
function restorePositions(){for(const id of targetIds){clearOne($(id));$(id)?.removeAttribute('data-v268-positioned')}}
function capturePos(el,rect,scale){const width=el.offsetWidth*scale,height=el.offsetHeight*scale;
return{x:clamp(rect.left/Math.max(1,innerWidth-width),0,1),y:clamp(rect.top/Math.max(1,innerHeight-height),0,1),s:scale};}
let editing=false,chosen=null,drag=null;
const panel=d.createElement('section');panel.id='v268EditPanel';panel.hidden=true;
panel.innerHTML='<strong>PERSONALIZAR HUD</strong><span id="v268EditHelp">Arraste um botão ou a barra de itens para mudar sua posição.</span><div class="v268-edit-actions"><button type="button" data-v268="less" aria-label="Diminuir botão">−</button><button type="button" data-v268="more" aria-label="Aumentar botão">+</button><button type="button" data-v268="reset">Restaurar</button><button type="button" data-v268="save">Salvar e sair</button></div>';
d.body.append(panel);
const sprintSettings=d.createElement('div');sprintSettings.id='v269SprintSettings';
sprintSettings.innerHTML='<label for="v269SprintDistance">Distância para corrida automática <b id="v269SprintValue">80%</b></label><input type="range" id="v269SprintDistance" min="50" max="120" step="5" value="80"><small>Quanto maior, mais longe você arrasta o analógico para ativar a corrida.</small>';
panel.insertBefore(sprintSettings,panel.querySelector('.v268-edit-actions'));
const sprintInput=$('v269SprintDistance'),sprintValue=$('v269SprintValue');
sprintInput.value=String(Math.round(sprintDistance*100));sprintValue.textContent=Math.round(sprintDistance*100)+'%';
sprintInput.addEventListener('input',()=>{sprintDistance=Math.max(.5,Math.min(1.2,Number(sprintInput.value)/100));sprintValue.textContent=Math.round(sprintDistance*100)+'%';try{localStorage.setItem(SPRINT_KEY,String(sprintDistance))}catch{}});
function choose(el){if(chosen)chosen.classList.remove('v268-edit-selected');chosen=el;el?.classList.add('v268-edit-selected');const help=$('v268EditHelp');if(help)help.textContent=el?'Selecionado: '+(el.getAttribute('aria-label')||el.id)+'. Arraste ou ajuste o tamanho.':'Arraste um botão para reposicionar.';}
function editingSet(on){if(editing===on)return;
editing=on;root.classList.toggle('v268-editing',on);panel.hidden=!on;
window.gameHud171?.close?.();window.gameReview?.keys?.clear?.();if(window.gameReview?.stick)window.gameReview.stick.x=window.gameReview.stick.y=0;stopRun();
if(!on){drag=null;choose(null);save();}else{choose(null);layoutSync()}
}
panel.addEventListener('pointerup',e=>{const b=e.target.closest?.('[data-v268]');if(e.pointerType==='touch'&&b){e.preventDefault();b.click()}},false);
panel.addEventListener('click',e=>{
const b=e.target.closest('[data-v268]');if(!b)return;e.preventDefault();e.stopPropagation();
const mode=b.dataset.v268;
if(mode==='save'){editingSet(false);return}
if(mode==='reset'){layout={};sprintDistance=.80;sprintInput.value='80';sprintValue.textContent='80%';try{localStorage.removeItem(KEY);localStorage.removeItem(SPRINT_KEY)}catch{}restorePositions();choose(null);return}
if(!chosen)return;
const r=chosen.getBoundingClientRect(),current=layout[chosen.id]?.s||1;
const scale=clamp(current+(mode==='more'?.1:-.1),.7,1.55);
layout[chosen.id]=capturePos(chosen,r,scale);applyOne(chosen,layout[chosen.id]);chosen.dataset.v268Positioned='1';save();
});
function editPointerDown(e){if(!editing)return;
const el=e.target.closest?.(targetIds.map(x=>'#'+x).join(','));
if(!el){if(e.target.closest?.('#v268EditPanel'))return;return}
e.preventDefault();e.stopImmediatePropagation();choose(el);
const r=el.getBoundingClientRect(),s=layout[el.id]?.s||1;
drag={id:e.pointerId,el,x:e.clientX,y:e.clientY,left:r.left,top:r.top,s};
}
function editPointerMove(e){if(!editing||!drag||drag.id!==e.pointerId)return;e.preventDefault();e.stopImmediatePropagation();
const rect={left:drag.left+e.clientX-drag.x,top:drag.top+e.clientY-drag.y};
layout[drag.el.id]=capturePos(drag.el,rect,drag.s);
applyOne(drag.el,layout[drag.el.id]);drag.el.dataset.v268Positioned='1';
}
function editPointerUp(e){if(!editing||!drag||drag.id!==e.pointerId)return;e.preventDefault();e.stopImmediatePropagation();drag=null;save();}
window.addEventListener('pointerdown',editPointerDown,true);
window.addEventListener('pointermove',editPointerMove,true);
window.addEventListener('pointerup',editPointerUp,true);
window.addEventListener('pointercancel',editPointerUp,true);
for(const type of ['click','touchstart','touchmove','touchend'])window.addEventListener(type,e=>{if(editing&&e.target.closest?.(targetIds.map(x=>'#'+x).join(','))){e.preventDefault();e.stopImmediatePropagation()}},{capture:true,passive:false});
function settings(){for(const host of [$('v206SettingGroup'),$('v267Utilities')]){
if(!host||host.querySelector('[data-v268-entry]'))continue;
const b=d.createElement('button');b.type='button';b.dataset.v268Entry='';b.textContent='Personalizar botões';b.addEventListener('pointerup',e=>{if(e.pointerType==='touch'){e.preventDefault();e.stopPropagation();editingSet(true)}});
b.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();editingSet(true)});host.append(b);
}}
// The V267 overlay moves its original equipment button into a secondary sheet.
// V268 returns the flask to the HUD and uses the native potion engine for drinking.
let potionReady=false;const flaskIcon='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M12 3h8v5h-8zM13 8v5L6 24q-3 6 10 6t10-6L19 13V8"/></svg>';
function potionSync(){
const slot=$('potion219Slot'),equip=$('potion219Equip'),select=$('potion219Select'),picker=$('potion219Picker'),use=$('potion219Use'),sheet=$('v267PotionSheet');
if(!slot||!equip||!select||!picker||!sheet)return;
if(!potionReady){
slot.insertBefore(equip,select);sheet.append(picker);if(use){sheet.append(use);use.hidden=true;}
select.setAttribute('aria-label','Abrir seleção de poções');
select.textContent='⌄';
potionReady=true;
}
sheet.hidden=picker.hidden;slot.classList.toggle('v268-potion-equipped',!!window.gamePotionSlot220?.equipped);
equip.setAttribute('aria-label',window.gamePotionSlot220?.equipped?'Beber poção equipada':'Equipar poção selecionada');
if(select.querySelector('img')||select.querySelector('svg'))select.replaceChildren(d.createTextNode('⌄'));
}
d.addEventListener('click',e=>{
const b=e.target.closest?.('#potion219Equip');if(!b||!potionReady||editing)return;
e.preventDefault();e.stopImmediatePropagation();if(b.disabled||!play())return;
const p=window.gamePotionSlot220;if(!p)return;
if(p.using)return;
if(p.equipped===p.selected){p.use?.();}else p.equip?.(p.selected);
p.sync?.();potionSync();
},true);
// Usar a poção não abre confirmação: primeiro toque equipa, segundo bebe.
let activePointer=null,armed=false,auto=false,thumb=null,guide=null,stickBound=null,stopAt=0;
function runKey(on){const g=window.gameReview;if(!g||(!on&&!runKey.state))return;
const keys=g.keys;if(keys?.add&&keys?.delete){for(const k of ['Shift','shift','ShiftLeft'])on?keys.add(k):keys.delete(k);}
if(on!==runKey.state){runKey.state=on;window.dispatchEvent(new KeyboardEvent(on?'keydown':'keyup',{code:'ShiftLeft',key:'Shift',bubbles:true}));}
}
runKey.state=false;
function stopRun(){auto=false;armed=false;runKey(false);root.classList.remove('v268-auto-run','v268-run-ready');if(activePointer===null){thumb?.style.setProperty('--v268-dx','0px');thumb?.style.setProperty('--v268-dy','0px');}}
function resetStick(){const g=window.gameReview;if(g?.stick){g.stick.x=0;g.stick.y=0;}}
function placeThumb(x,y){if(!thumb||!stickBound)return;const max=(stickBound.clientWidth-(thumb.offsetWidth||46))/2+5;
const length=Math.hypot(x,y)||1,scale=Math.min(1,max/length);
thumb.style.setProperty('--v268-dx',Math.round(x*scale)+'px');
thumb.style.setProperty('--v268-dy',Math.round(y*scale)+'px');
}
function attachStick(){
const el=$('stick');if(!el||el===stickBound)return;
stickBound=el;thumb=d.createElement('span');thumb.id='v268Thumb';thumb.setAttribute('aria-hidden','true');el.append(thumb);
guide=d.createElement('div');guide.id='v268SprintGuide';guide.textContent='CORRER';el.append(guide);
}
function moveStick(e){if(e.pointerId!==activePointer||!stickBound||editing)return;
const rect=stickBound.getBoundingClientRect(),cx=rect.left+rect.width/2,cy=rect.top+rect.height/2;
const dx=e.clientX-cx,dy=e.clientY-cy;
placeThumb(dx,dy);
if(dy < -rect.height*sprintDistance && Math.abs(dx)<rect.width*.37){armed=true;root.classList.add('v268-run-ready');runKey(true);}
else if(!armed)runKey(false);
}
function stickDown(e){if(!stickBound||editing||!play()||!stickBound.contains(e.target)||activePointer!==null)return;
if(auto){stopRun();resetStick()}
activePointer=e.pointerId;armed=false;root.classList.remove('v268-run-ready');moveStick(e);
}
function stickUp(e){if(e.pointerId!==activePointer)return;
activePointer=null;if(armed&&play()&&!editing){auto=true;root.classList.add('v268-auto-run');placeThumb(0,-stickBound.clientHeight*.42);}
else{stopRun();}armed=false;root.classList.remove('v268-run-ready');
}
d.addEventListener('pointerdown',stickDown,true);
window.addEventListener('pointermove',moveStick,{capture:true,passive:true});
window.addEventListener('pointerup',stickUp,true);
window.addEventListener('pointercancel',e=>{if(e.pointerId===activePointer){activePointer=null;stopRun()}},true);
d.addEventListener('visibilitychange',()=>{if(d.hidden){activePointer=null;stopRun();resetStick()}});
window.addEventListener('blur',()=>{activePointer=null;stopRun();resetStick()});
window.addEventListener('resize',()=>{restorePositions();layoutSync()});
let last=0;function tick(time){if(time-last>70){last=time;settings();attachStick();potionSync();layoutSync();
if(auto){if(!play()||editing||window.gameZombie?.playerHp<=0){stopRun();resetStick()}else{const g=window.gameReview;if(g?.stick){g.stick.x=0;g.stick.y=-1;}runKey(true);}}
}
requestAnimationFrame(tick)}
requestAnimationFrame(tick);
window.FlorestaMobile268={version:'V268',enterEdit:()=>editingSet(true),stopRun,get autoRun(){return auto},get editing(){return editing},get sprintDistance(){return sprintDistance},setSprintDistance(value){const n=Number(value);if(!Number.isFinite(n))return false;sprintDistance=clamp(n,.5,1.2);sprintInput.value=String(Math.round(sprintDistance*100));sprintValue.textContent=Math.round(sprintDistance*100)+'%';try{localStorage.setItem(SPRINT_KEY,String(sprintDistance))}catch{}return true}};
})();