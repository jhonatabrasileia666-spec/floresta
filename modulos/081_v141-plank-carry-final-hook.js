
(()=>{
  if(window.__V141_PLANK_FINAL_HOOK__)return;window.__V141_PLANK_FINAL_HOOK__=true;
  const previous=window.__updateAnimatedAvatar;
  window.__updateAnimatedAvatar=(...args)=>{
    const out=previous?.(...args);
    if(window.gamePlankCarry?.count>0 && !window.gameLumber?.carrying && !window.gameLogPlacement?.placing){
      window.gamePlankCarry?.applyCarryPose?.();
    }
    return out;
  };
})();
