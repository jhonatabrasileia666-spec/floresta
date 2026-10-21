/* V168S: one press -> one release -> exactly one spear attack. */
(()=>{
 if(window.gameSpearInput)return;
 const canvas=document.getElementById('c'),button=document.getElementById('mobileAttackBtn');
 let owner=null,indicator=null;
 const primitive=()=>window.gamePrimitive;
 const isSpear=()=>window.gameRightHand?.current==='spear';
 function cancel(){primitive()?.cancelSpear?.();owner=null;updateHint();}
 function updateHint(){if(!indicator)return;const p=primitive(),active=p?.charging;indicator.hidden=!active;if(active){indicator.textContent=p.charge>=1?'Solte para estocada forte':'Preparando estocada…';indicator.style.setProperty('--charge',`${Math.round(p.charge*100)}%`);}}
 function press(e){
   if(!isSpear()||e.button!==0||owner!==null)return;
   const mobile=e.target.closest?.('#mobileAttackBtn');
   const desktop=e.target===canvas&&e.pointerType==='mouse'&&document.pointerLockElement===canvas;
   if(!mobile&&!desktop)return;
   // The first click on an unlocked canvas still belongs to pointer lock.
   e.preventDefault();e.stopImmediatePropagation();
   if(primitive()?.beginSpear?.()){owner={id:e.pointerId,mobile:!!mobile,pressedAt:e.timeStamp};if(mobile)try{button.setPointerCapture(e.pointerId)}catch{}updateHint();}
 }
 function release(e){if(!owner||e.pointerId!==owner.id)return;e.preventDefault();e.stopImmediatePropagation();const prev=owner;owner=null;primitive()?.releaseSpear?.(Math.max(0,(e.timeStamp-prev.pressedAt)/1000));if(prev.mobile)try{button.releasePointerCapture(e.pointerId)}catch{}updateHint();}
 window.addEventListener('pointerdown',press,true);
 window.addEventListener('pointerup',release,true);
 window.addEventListener('pointercancel',cancel,true);
 window.addEventListener('blur',cancel);
 document.addEventListener('visibilitychange',()=>{if(document.hidden)cancel()});
 document.addEventListener('pointerlockchange',()=>{if(owner&&!owner.mobile&&document.pointerLockElement!==canvas)cancel()});
 window.addEventListener('keydown',e=>{if(['Escape','KeyI','KeyR','KeyH'].includes(e.code))cancel()},true);
 window.addEventListener('game:player-damaged',cancel);
 const init=()=>{if(!primitive()){setTimeout(init,100);return;}
   indicator=document.createElement('div');indicator.id='spearChargeHint';indicator.hidden=true;indicator.setAttribute('role','status');document.body.append(indicator);
   const style=document.createElement('style');style.textContent='#spearChargeHint{position:fixed;left:50%;bottom:18%;transform:translateX(-50%);padding:9px 14px;border:1px solid #9d8759;border-radius:7px;background:linear-gradient(90deg,#70532a var(--charge),#171a1de8 var(--charge));color:#fff4d5;font:12px system-ui;pointer-events:none;z-index:60}#spearChargeHint[hidden]{display:none}';document.head.append(style);
   setInterval(()=>{if(owner&&!primitive().charging){owner=null;}updateHint();if(button)button.title=isSpear()?'Toque: rápido · segure e solte: forte':'Atacar';},50);
 };
 window.gameSpearInput={version:'V168S',cancel,get pressed(){return owner!==null},threshold:.32};init();
})();
