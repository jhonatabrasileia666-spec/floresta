
(()=>{
  const canvas=document.getElementById("c");
  if(!canvas || !matchMedia("(pointer:fine)").matches) return;

  function isCraftStart(target){
    return !!target?.closest?.("#craftAxeBtn,#craftHammerBtn,.craft-start");
  }

  // Capture phase runs before the recipe button's normal click handler.
  // requestPointerLock therefore still has the browser's trusted user gesture.
  document.addEventListener("click",e=>{
    if(!isCraftStart(e.target)) return;
    if(document.pointerLockElement===canvas) return;
    try{
      const r=canvas.requestPointerLock({unadjustedMovement:true});
      r?.catch?.(()=>{
        try{canvas.requestPointerLock();}catch{}
      });
    }catch{
      try{canvas.requestPointerLock();}catch{}
    }
  },true);

  window.gameCameraContinuity={
    version:"V107B",
    get locked(){return document.pointerLockElement===canvas;}
  };
})();
