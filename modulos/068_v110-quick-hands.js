
(()=>{
  if(window.gameQuickHands)return;

  const wait=(ms)=>new Promise(r=>setTimeout(r,ms));
  const RIGHT=['axe','hammer','rock','branch','wood_chip'];
  const LEFT=['torch','wood_shield'];
  const LABEL={
    axe:'Machado',hammer:'Martelo',rock:'Pedra',branch:'Graveto',wood_chip:'Lasca',torch:'Tocha',wood_shield:'Escudo'
  };
  const KEYMAP={Digit1:'axe',Digit2:'hammer',Digit3:'rock',Digit4:'branch',Digit5:'wood_chip',Digit6:'torch',Digit7:'wood_shield'};
  const status=()=>document.getElementById('status');

  function qty(id){
    if(id==='torch')return 1;
    try{return Number(window.gameInventory?.items?.find?.(i=>i.id===id)?.quantity)||0}catch{return 0}
  }

  function torchOn(){
    try{return !!window.gameReview?.isEquipped?.()}catch{return false}
  }

  function currentRight(){
    const cur=window.gameRightHand?.current||null;
    return RIGHT.includes(cur)?cur:null;
  }

  function currentLeft(){
    if(window.gameShield?.equipped)return 'wood_shield';
    if(window.gameBranchHands?.side==='left')return 'branch-left';
    if(torchOn())return 'torch';
    return null;
  }

  function blocked(){
    return !!(
      window.gameInventory?.isOpen ||
      window.gameCraft?.active ||
      document.body.classList.contains('crafting-active') ||
      document.querySelector('#directorOverlay.open') ||
      document.querySelector('.skills-overlay.open,.skill-overlay.open')
    );
  }

  function carryingLog(){
    return !!window.gameLumber?.carrying;
  }

  function say(text){
    const el=status();
    if(el)el.textContent=text;
  }

  function available(id){
    if(id==='torch')return true;
    if(id==='wood_shield')return qty(id)>0 && !!window.gameShield;
    return qty(id)>0 && !!window.gameRightHand;
  }

  function setTorch(on){
    const btn=document.getElementById('equipBtn');
    if(!btn)return false;

    if(on){
      if(window.gameShield?.equipped)window.gameShield.unequip?.();
      if(window.gameBranchHands?.side==='left')window.gameBranchHands.unequip?.();
      if(!torchOn())btn.click();
      return torchOn();
    }

    if(torchOn())btn.click();
    return !torchOn();
  }

  function toggleRight(id){
    if(carryingLog()){
      say('Solte o tronco antes de trocar o item da mão direita');
      return false;
    }
    if(!available(id)){
      say(`Você não tem ${LABEL[id]||id} no inventário`);
      return false;
    }
    if(window.gameRightHand?.current===id){
      window.gameRightHand.unequip?.();
      return true;
    }
    return !!window.gameRightHand?.equip?.(id);
  }

  function toggleBranchLeft(){
    if(carryingLog()){
      say('Solte o tronco antes de trocar o item da mão');
      return false;
    }
    if(qty('branch')<1){say('Você não tem graveto no inventário');return false}
    if(window.gameShield?.equipped)window.gameShield.unequip?.();
    if(window.gameBranchHands?.side==='left')return !!window.gameBranchHands.unequip?.();
    return !!window.gameBranchHands?.toggle?.('left');
  }

  function toggleLeft(id){
    if(carryingLog()){
      say('Solte o tronco antes de trocar o item da mão');
      return false;
    }
    if(id==='torch'){
      return setTorch(!torchOn());
    }
    if(id==='wood_shield'){
      if(!available(id)){say('Você ainda não tem um escudo');return false}
      if(window.gameShield?.equipped)return !!window.gameShield.unequip?.();
      return !!window.gameShield?.equip?.();
    }
    return false;
  }

  function equipDirect(id){
    if(RIGHT.includes(id))return toggleRight(id);
    if(LEFT.includes(id))return toggleLeft(id);
    return false;
  }

  function availableList(hand){
    const src=hand==='left'?LEFT:RIGHT;
    return src.filter(available);
  }

  function cycle(hand,dir){
    if(blocked()||carryingLog())return false;
    const list=availableList(hand);
    if(!list.length)return false;
    const cur=hand==='left'?currentLeft():currentRight();
    let idx=list.indexOf(cur);
    if(idx<0)idx=dir>0?-1:0;
    idx=(idx+(dir>0?1:-1)+list.length)%list.length;
    const next=list[idx];

    if(hand==='left'){
      if(next==='torch'){
        if(!torchOn())setTorch(true);
      }else if(next==='wood_shield'){
        if(!window.gameShield?.equipped)window.gameShield?.equip?.();
      }
    }else{
      if(window.gameRightHand?.current!==next)window.gameRightHand?.equip?.(next);
    }
    return true;
  }

  function updateHud(){
    const r=currentRight();
    const l=currentLeft();
    document.querySelectorAll('#quickHandsHud .qh-slot').forEach(el=>{
      const id=el.dataset.qh;
      const active=(id===r)||(id===l);
      const isAvail=available(id);
      el.classList.toggle('active',active);
      el.classList.toggle('unavailable',!isAvail);
      const q=el.querySelector('.qh-qty');
      if(q)q.textContent=id==='torch'?'1':(qty(id)>0?String(qty(id)):'');
    });
  }

  async function boot(){
    for(let i=0;i<500;i++){
      if(window.gameInventory&&window.gameRightHand&&window.gameReview)break;
      await wait(20);
    }

    // Capture phase deliberately claims 1–7 before the old debug day/night
    // shortcuts (1–3), so gameplay hotbar keys do not alter the clock.
    window.addEventListener('keydown',e=>{
      if(e.repeat||blocked())return;
      const id=KEYMAP[e.code];
      if(!id)return;
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();

      if(e.code==='Digit4'&&e.shiftKey)toggleBranchLeft();
      else equipDirect(id);
      updateHud();
    },true);

    window.addEventListener('wheel',e=>{
      if((window.gamePotionSlot220?.equipped||e.target?.closest?.('#u173Hotbar'))&&!e.shiftKey)return;
      if(blocked()||carryingLog())return;
      const dy=Number(e.deltaY)||0;
      if(Math.abs(dy)<1)return;
      const hand=e.shiftKey?'left':'right';
      if(cycle(hand,dy>0?1:-1)){
        e.preventDefault();
        e.stopPropagation();
        updateHud();
      }
    },{capture:true,passive:false});

    // Keep HUD state fresh without adding work to the render loop.
    setInterval(updateHud,120);
    updateHud();

    window.gameQuickHands={
      version:'V110B',
      equip:equipDirect,
      cycleRight:dir=>cycle('right',dir),
      cycleLeft:dir=>cycle('left',dir),
      equipBranchLeft:toggleBranchLeft,
      get right(){return currentRight()},
      get left(){return currentLeft()}
    };
  }

  boot();
})();
