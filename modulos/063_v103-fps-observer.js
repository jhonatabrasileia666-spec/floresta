
(()=>{
  let frames=0,last=performance.now(),fps=0,frameMs=0;
  function tick(now){
    frames++;
    const span=now-last;
    if(span>=1000){fps=frames*1000/span;frameMs=span/Math.max(1,frames);frames=0;last=now;}
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
  window.gamePerformanceV103={version:'V103B',target:120,get fps(){return Math.round(fps)},get frameMs(){return Math.round(frameMs*100)/100},animationPolicy:'EXACT_EVERY_RENDER_FRAME'};
})();
