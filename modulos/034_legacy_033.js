
(()=>{
  window.gamePerformance={
    version:"V45",
    zombieMax:10,
    hordeAnimationLOD:true,
    barrelUpdateHz:30
  };

  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)return;
    // Avoid a giant first-frame delta after switching back to the game.
    window.dispatchEvent(new CustomEvent("game:resume-performance"));
  });
})();
