
(()=>{
  const base=window.gamePerformanceV103;
  window.gamePerformanceV104={
    version:'V109B',
    target:120,
    get fps(){return base?.fps??0;},
    get frameMs(){return base?.frameMs??0;},
    graphicsPolicy:'UNCHANGED',
    animationPolicy:'EXACT_EVERY_RENDER_FRAME',
    techniques:[
      'shared geometries/materials',
      'pooled particles/effect rings',
      'native frustum culling',
      'static-world matrix freezing only',
      'idle shader prewarm',
      'no animation throttling',
      'no resolution/quality reduction'
    ]
  };
})();
