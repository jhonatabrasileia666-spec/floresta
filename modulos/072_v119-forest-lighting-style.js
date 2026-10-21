
(async()=>{
  if(window.__V119_FOREST_LIGHTING__)return;
  window.__V119_FOREST_LIGHTING__=true;

  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1500;i++){
    if(window.gameReview?.scene&&window.gameReview?.renderer&&window.gameReview?.camera&&window.__THREE_MODULE)break;
    await wait(20);
  }

  const game=window.gameReview, T=window.__THREE_MODULE;
  if(!game?.scene||!game?.renderer||!game?.camera||!T)return;
  const scene=game.scene, renderer=game.renderer, camera=game.camera, player=game.player;
  const mobile=!!window.__FOREST_MOBILE_BUILD__;

  if(T.ColorManagement)T.ColorManagement.enabled=true;
  if(T.SRGBColorSpace!==undefined)renderer.outputColorSpace=T.SRGBColorSpace;
  if(T.ACESFilmicToneMapping!==undefined)renderer.toneMapping=T.ACESFilmicToneMapping;
  renderer.shadowMap.enabled=true;
  if(T.PCFSoftShadowMap!==undefined)renderer.shadowMap.type=T.PCFSoftShadowMap;

  let sun=null, hemi=null;
  scene.traverse(o=>{
    if(!sun && o.isDirectionalLight && o.castShadow && !/^V112_Test_/.test(o.name||'')) sun=o;
    if(!hemi && o.isHemisphereLight && !/^V112_Test_/.test(o.name||'')) hemi=o;
  });
  if(!sun){ scene.traverse(o=>{ if(!sun && o.isDirectionalLight && !/^V112_Test_/.test(o.name||'')) sun=o; }); }

  const shadowSpan=mobile?54:62;
  const shadowMapSize=mobile?1536:2048;
  if(sun?.shadow){
    sun.castShadow=true;
    sun.shadow.mapSize.set(shadowMapSize,shadowMapSize);
    sun.shadow.bias=-0.00006;
    sun.shadow.normalBias=0.014;
    sun.shadow.radius=mobile?1.35:1.8;
    if('intensity' in sun.shadow)sun.shadow.intensity=mobile?.62:.66;
    if(sun.shadow.camera){
      const hs=shadowSpan*.5;
      sun.shadow.camera.left=-hs;
      sun.shadow.camera.right=hs;
      sun.shadow.camera.top=hs;
      sun.shadow.camera.bottom=-hs;
      sun.shadow.camera.near=.6;
      sun.shadow.camera.far=145;
      sun.shadow.camera.updateProjectionMatrix?.();
    }
  }

  const rig=new T.Group();
  rig.name='V119_ForestLighting';
  scene.add(rig);

  const warmFill=new T.DirectionalLight(0xffbe76,.24); warmFill.castShadow=false; rig.add(warmFill); rig.add(warmFill.target);
  const coolFill=new T.DirectionalLight(0x9bc6ff,.16); coolFill.castShadow=false; rig.add(coolFill); rig.add(coolFill.target);
  const groundGlow=new T.HemisphereLight(0xbfe3a1,0x2a2317,.10); rig.add(groundGlow);

  const beamCanvas=document.createElement('canvas');
  beamCanvas.width=64; beamCanvas.height=512;
  const bctx=beamCanvas.getContext('2d');
  const grad=bctx.createLinearGradient(0,0,0,512);
  grad.addColorStop(0,'rgba(255,244,210,0.00)');
  grad.addColorStop(0.1,'rgba(255,244,210,0.20)');
  grad.addColorStop(0.48,'rgba(255,236,184,0.95)');
  grad.addColorStop(0.82,'rgba(255,222,150,0.30)');
  grad.addColorStop(1,'rgba(255,220,140,0.00)');
  bctx.fillStyle=grad; bctx.fillRect(0,0,64,512);
  bctx.globalCompositeOperation='destination-in';
  const radial=bctx.createRadialGradient(32,256,14,32,256,31);
  radial.addColorStop(0,'rgba(255,255,255,1)');
  radial.addColorStop(1,'rgba(255,255,255,0)');
  bctx.fillStyle=radial; bctx.fillRect(0,0,64,512);
  const beamTex=new T.CanvasTexture(beamCanvas);
  beamTex.needsUpdate=true;

  const beamCount=0; // sem planos falsos de luz
  const beams=[];
  for(let i=0;i<beamCount;i++){
    const geom=new T.PlaneGeometry(4.5,32,1,1);
    const mat=new T.MeshBasicMaterial({
      map:beamTex, transparent:true, opacity:0, depthWrite:false, depthTest:true,
      blending:T.AdditiveBlending, side:T.DoubleSide, color:new T.Color(0xffefc6)
    });
    const m=new T.Mesh(geom,mat);
    m.renderOrder=3;
    m.frustumCulled=false;
    m.userData.offset=(i/(Math.max(1,beamCount-1))-.5)*1.25;
    rig.add(m);
    beams.push(m);
  }

  const skyStops=[
    [0.0,0x05070b],[4.8,0x0f1320],[5.5,0x362d3d],[6.1,0xba7f50],[6.7,0xf0c97b],
    [8.0,0x9dc8d5],[11.8,0x86bfd2],[15.2,0x7bb7ca],[16.9,0xddb66a],[17.6,0xf09a50],
    [18.2,0x85536e],[19.0,0x21273a],[20.6,0x09101a],[24.0,0x05070b]
  ].map(([h,c])=>[h,new T.Color(c)]);
  const fogStops=[
    [0.0,0x070a10],[5.2,0x161825],[6.0,0x78695b],[6.8,0xa4a78d],[9.0,0x7d8e70],
    [12.0,0x768e63],[15.0,0x718b61],[17.0,0x92714f],[18.0,0x6a4d44],[19.0,0x24273a],[24.0,0x070a10]
  ].map(([h,c])=>[h,new T.Color(c)]);

  const c0=new T.Color(), c1=new T.Color(), tmpSky=new T.Color(), tmpFog=new T.Color();
  const vA=new T.Vector3(), vB=new T.Vector3(), vC=new T.Vector3(), vD=new T.Vector3();
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smooth=(a,b,x)=>{ x=clamp((x-a)/(b-a),0,1); return x*x*(3-2*x); };
  const wrap=h=>((h%24)+24)%24;
  const lerpColor=(out,a,b,t)=>{ c0.setHex(a); c1.setHex(b); out.copy(c0).lerp(c1,clamp(t,0,1)); return out; };
  function sample(stops,h,out){
    h=wrap(h);
    for(let i=0;i<stops.length-1;i++){
      const a=stops[i], b=stops[i+1];
      if(h>=a[0] && h<=b[0]){ out.copy(a[1]).lerp(b[1], (h-a[0])/Math.max(0.0001,b[0]-a[0])); return out; }
    }
    return out.copy(stops[0][1]);
  }

  function findSunDir(hour){
    const phase=((hour-6)/24)*Math.PI*2;
    const y=Math.sin(phase);
    const x=Math.cos(phase);
    const z=Math.sin(phase*0.67);
    return vA.set(x,Math.max(0.08,Math.abs(y)),z).normalize();
  }

  function updateBeams(hour,daylight,twilight,night){
    const sunDir=findSunDir(hour);
    const forward=camera.getWorldDirection(vB).normalize();
    const right=vC.crossVectors(forward, camera.up).normalize();
    const up=vD.copy(camera.up).normalize();
    const base=vA.set(player.x, (game.groundY?.(player.x,player.z)||0)+8.5, player.z).addScaledVector(forward, 12);
    const beamStrength=(0.07 + daylight*0.18 + twilight*0.26) * (1-night);
    const sunFacing=Math.max(0, forward.dot(sunDir.clone().multiplyScalar(-1)));
    const finalStrength=beamStrength*(0.45+0.55*sunFacing);

    beams.forEach((beam,i)=>{
      const t=i/Math.max(1,beams.length-1);
      const spread=(t-.5)*14 + Math.sin(performance.now()*0.00035+i*1.37)*0.8;
      const ahead=8 + t*18;
      const height=11 + t*4;
      beam.position.copy(base)
        .addScaledVector(right, spread)
        .addScaledVector(forward, ahead)
        .addScaledVector(up, height-8);
      const target=beam.position.clone().addScaledVector(sunDir, -18);
      beam.lookAt(target);
      const scaleX=1.1 + t*1.4;
      const scaleY=0.9 + t*1.8;
      beam.scale.set(scaleX, scaleY*(mobile?0.82:1.0), 1);
      beam.material.opacity = finalStrength * (0.65 + 0.35*Math.sin(performance.now()*0.0007+i*0.91)**2);
      beam.visible = finalStrength>0.02 && !window.gameTestMode?.active;
    });
  }

  function apply(){
    if(window.gameAdvancedLighting?.active)return;
    if(window.gameTestMode?.active){
      renderer.toneMappingExposure=1.22;
      beams.forEach(b=>b.visible=false);
      return;
    }

    const hour=game.dayNight?.hour ?? 12;
    const phase=((hour-6)/24)*Math.PI*2;
    const solar=Math.sin(phase);
    const daylight=smooth(-0.03,0.26,solar);
    const night=1-daylight;
    const twilight=(1-smooth(.12,.65,Math.abs(solar)))*Math.max(0.25,daylight+.35);

    if(scene.background?.isColor){
      sample(skyStops,hour,tmpSky);
      scene.background.copy(tmpSky);
    }
    if(scene.fog?.color){
      sample(fogStops,hour,tmpFog);
      scene.fog.color.copy(tmpFog);
      const giantFogActive=!!(window.gameGiantBoss?.root?.visible&&window.gameGiantBoss?.state!=='DEAD');
      const baseFog=(0.010 + 0.012*night + 0.006*twilight) * (mobile?1.05:1.0);
      scene.fog.density=giantFogActive?Math.min(.041,baseFog*(mobile?1.52:1.64)):baseFog;
      if(giantFogActive)scene.fog.color.lerp(new T.Color(0x657477),.34);
    }

    const sunDir=findSunDir(hour);
    const gy=game.groundY?.(player.x,player.z)||0;
    if(sun){
      const texel=shadowSpan/shadowMapSize;
      const sx=Math.round(player.x/texel)*texel;
      const sz=Math.round(player.z/texel)*texel;
      const sy=game.groundY?.(sx,sz)??gy;

      sun.position.set(sx + sunDir.x*68, sy + 18 + sunDir.y*68, sz + sunDir.z*64);
      if(sun.target){
        sun.target.position.set(sx, sy+1.8, sz);
        sun.target.updateMatrixWorld?.();
      }
      sun.updateMatrixWorld?.();

      const golden=Math.max(twilight, smooth(0.18,0.82,1-Math.abs(hour-12)/6));
      const noon=Math.max(0,1-Math.abs(hour-12)/5.5);
      lerpColor(sun.color, 0xfff2d8, 0xffc46d, clamp(golden*0.9 + twilight*0.7,0,1));
      sun.intensity = 0.42 + daylight*1.9 + golden*0.55 + noon*0.25;
    }

    if(hemi){
      hemi.intensity = 0.18 + daylight*0.72 + twilight*0.14;
      lerpColor(hemi.color, 0xcce4c5, 0x8fc4d0, clamp(0.15 + daylight*0.85,0,1));
      if(hemi.groundColor) lerpColor(hemi.groundColor, 0x2b281c, 0x51603a, clamp(daylight*0.9,0,1));
    }

    warmFill.position.set(player.x-24, gy+18, player.z+18);
    warmFill.target.position.set(player.x, gy+1.5, player.z);
    warmFill.intensity = 0.08 + daylight*0.16 + twilight*0.28;
    lerpColor(warmFill.color, 0xffb768, 0xffd698, clamp(daylight*0.5+twilight*0.9,0,1));

    coolFill.position.set(player.x+19, gy+21, player.z-23);
    coolFill.target.position.set(player.x, gy+1.5, player.z);
    coolFill.intensity = 0.06 + daylight*0.09 + night*0.14;
    lerpColor(coolFill.color, 0x8dbaf5, 0xc7e4ff, clamp(daylight*0.6 + night*0.5,0,1));

    groundGlow.intensity = 0.05 + daylight*0.12;
    groundGlow.color.set(daylight>0.4 ? 0xcbe7b2 : 0xa9b28e);
    groundGlow.groundColor.set(daylight>0.4 ? 0x382a17 : 0x111318);

    renderer.toneMappingExposure = 0.98 + daylight*0.18 + twilight*0.14;

    updateBeams(hour,daylight,twilight,night);
  }

  const originalRender=renderer.render.bind(renderer);
  renderer.render=(sc,cam)=>{
    if(sc===scene && cam===camera) apply();
    return originalRender(sc,cam);
  };

  window.gameForestLighting={version:'V119B', apply, beams};
  console.info('[V119B] iluminação estilo floresta realista com raios solares ativa');
})();
