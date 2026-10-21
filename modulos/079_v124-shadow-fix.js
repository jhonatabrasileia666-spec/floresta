
(async()=>{
  if(window.__V124_SHADOW_FIX__)return;
  window.__V124_SHADOW_FIX__=true;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<900;i++){
    if(window.gameReview?.scene&&window.__THREE_MODULE)break;
    await sleep(20);
  }
  const scene=window.gameReview?.scene;
  if(!scene)return;

  function fixCaster(o){
    if(!o?.isMesh&&!o?.isInstancedMesh)return;
    const n=(o.name||'').toLowerCase();
    if(
      n.includes('canop')||
      n.includes('crown')||
      n.includes('foliage')||
      n.includes('leafshell')||
      n.includes('v120')&&n.includes('leaf')
    ){
      o.castShadow=false;
    }
  }

  scene.traverse(fixCaster);

  // New trees can be rebuilt when cutting/falling. Keep only the trunk/stump shadow there too.
  const originalAdd=scene.add.bind(scene);
  scene.add=(...objs)=>{
    const r=originalAdd(...objs);
    for(const obj of objs)obj?.traverse?.(fixCaster);
    return r;
  };

  window.gameShadowFixV124={version:'V124B'};
  console.info('[V124B] sombras estabilizadas • sem blobs de copa • shadow map preso ao texel');
})();
