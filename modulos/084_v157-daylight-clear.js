
(()=>{
  if(window.__V157_DAYLIGHT_CLEAR__) return;
  window.__V157_DAYLIGHT_CLEAR__ = true;

  const clamp = (v,a,b)=>Math.max(a,Math.min(b,v));
  const wait = ms => new Promise(r=>setTimeout(r,ms));

  (async()=>{
    for(let i=0;i<1500;i++){
      if(window.gameReview?.scene && window.gameReview?.renderer) break;
      await wait(20);
    }

    const g = window.gameReview;
    if(!g?.scene || !g?.renderer) return;

    const scene = g.scene;
    const renderer = g.renderer;
    let sun = null, hemi = null;

    function refreshLights(){
      sun = null; hemi = null;
      scene.traverse(o=>{
        if(!sun && o.isDirectionalLight && !/^V112_Test_/.test(o.name||'')) sun = o;
        if(!hemi && o.isHemisphereLight && !/^V112_Test_/.test(o.name||'')) hemi = o;
      });
    }
    refreshLights();

    const baseExposure = Number(renderer.toneMappingExposure || 1);
    const baseFogDensity = scene.fog ? Number(scene.fog.density || 0.012) : null;
    const baseSunIntensity = sun ? Number(sun.intensity || 1) : 1;
    const baseHemiIntensity = hemi ? Number(hemi.intensity || 0.35) : 0.35;

    function apply(){
      if(window.gameAdvancedLighting?.active){requestAnimationFrame(apply);return;}
      if(!sun || !hemi) refreshLights();

      const hour = Number(g.dayNight?.hour ?? 12);
      const day = clamp(Math.sin((hour - 6) * Math.PI / 12) * 3, 0, 1);

      if(day > 0.01){
        renderer.toneMappingExposure = Math.max(baseExposure, 1.95 + 0.65 * day);

        if(scene.fog){
          scene.fog.density = Math.max(0.0025, (baseFogDensity ?? 0.012) * (0.46 - 0.16 * day));
          scene.fog.color.setRGB(
            0.68 + 0.10 * day,
            0.74 + 0.10 * day,
            0.80 + 0.10 * day
          );
          if(scene.background?.isColor) scene.background.copy(scene.fog.color);
        }

        if(sun){
          sun.intensity = Math.max(baseSunIntensity, 2.35 + 0.95 * day);
          if(sun.color?.setHex) sun.color.setHex(0xffffff);
        }

        if(hemi){
          hemi.intensity = Math.max(baseHemiIntensity, 0.48 + 0.92 * day);
          if(hemi.color?.setHex) hemi.color.setHex(0xf3f8ff);
          if(hemi.groundColor?.setHex) hemi.groundColor.setHex(0x5f694f);
        }
      }

      requestAnimationFrame(apply);
    }

    requestAnimationFrame(apply);
  })();
})();
