

(()=>{
  const game=window.gameReview;
  if(!game?.renderer)return;

  let frames=0;
  let last=performance.now();
  let fps=60;

  function tick(now){
    requestAnimationFrame(tick);
    frames++;

    if(now-last>=1000){
      fps=
        frames*
        1000/
        Math.max(1,now-last);

      frames=0;
      last=now;
    }
  }

  requestAnimationFrame(tick);

  window.gamePerformance={
    version:"V72",
    get fps(){
      return Math.round(fps);
    },
    get render(){
      const info=game.renderer.info;
      return {
        calls:info.render.calls,
        triangles:info.render.triangles,
        lines:info.render.lines,
        points:info.render.points
      };
    },
    get memory(){
      const info=game.renderer.info;
      return {
        geometries:info.memory.geometries,
        textures:info.memory.textures
      };
    },
    get zombies(){
      return window.gameZombie?.performance||null;
    },
    note:
      "V72 mantém geometria, materiais, grama, resolução e gráficos; otimiza CPU/DOM/collision scheduling."
  };
})();

