
/* V168S — iluminação geométrica real + sombras + volumetria baseada no mapa de sombras do sol.
   NÃO cria planos, sprites nem um segundo renderizador. A composição acontece ANTES do PSX.
   Dois perfis (Reimagined/Unbound) no mesmo PSX V149B, independente do seletor F8. */
(function(){
  'use strict';
  if(window.__V168S_PHYSICAL_LIGHTING__)return;
  window.__V168S_PHYSICAL_LIGHTING__=true;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const presets={
    reimagined:{label:'REIMAGINED',volume:0.34,steps:10,shadow:0.86,sun:2.15,ambient:.75,exposure:1.0,fog:.012},
    unbound:{label:'UNBOUND',volume:0.79,steps:16,shadow:1,sun:2.50,ambient:.67,exposure:1.0,fog:.015}
  };
  let style='unbound'; // Perfil aprovado; respeita seleção salva do jogador.
  try{const saved=localStorage.getItem('floresta_luz_real_v168s');if(presets[saved])style=saved;}catch{}
  let T,game,scene,renderer,camera,sun,hemi,canopies,materialsReady=false,frame=0;
  let lastHour=NaN,uiReady=false,firstLogged=false;
  let rigLights=[];
  let solarScratch=null,daylightWhite=null,duskGold=null,fogDay=null,fogDusk=null;
  let cachedGroundX=NaN,cachedGroundZ=NaN,cachedGroundY=0;
  const shadowMatrixSafe=()=>sun?.shadow?.matrix;
  const shadowTextureSafe=()=>sun?.shadow?.map?.texture;
  const worldPos=()=>game?.player;
  const occlusionMaterial=(src)=>src?.material?.isMeshStandardMaterial;
  function findLights(){
    sun=null;hemi=null;
    // A luz principal é a direcional que já projeta sombra, não luzes de preenchimento.
    scene.traverse(o=>{
      if(!sun&&o.isDirectionalLight&&o.castShadow&&!/^V112_Test_/.test(o.name||''))sun=o;
      if(!hemi&&o.isHemisphereLight&&!/^V112_Test_/.test(o.name||''))hemi=o;
    });
    if(!sun)scene.traverse(o=>{if(!sun&&o.isDirectionalLight&&!/^V112_Test_/.test(o.name||''))sun=o;});
  }
  function fixShadows(){
    if(!scene||!T||!sun)return;
    renderer.shadowMap.enabled=true;
    // O PCF deixa as bordas menos serrilhadas; a sombra vem da própria geometria 3D.
    if(T.PCFSoftShadowMap!=null)renderer.shadowMap.type=T.PCFSoftShadowMap;
    if(T.SRGBColorSpace!=null)renderer.outputColorSpace=T.SRGBColorSpace;
    sun.castShadow=true;
    sun.shadow.mapSize.set(2048,2048);
    const span=60;
    Object.assign(sun.shadow.camera,{left:-span/2,right:span/2,top:span/2,bottom:-span/2,near:1,far:180});
    sun.shadow.camera.updateProjectionMatrix();
    sun.shadow.bias=-.00012;
    sun.shadow.normalBias=.022;
    sun.shadow.radius=2;
    if('intensity' in sun.shadow)sun.shadow.intensity=.93;
    // As folhas usam alphaTest e podem produzir sombras vazadas, não blobs inteiros de copas.
    canopies=scene.getObjectByName('Forest_Lumber_Canopies');
    if(canopies){
      canopies.castShadow=true;
      canopies.receiveShadow=true;
      const mat=canopies.material;
      if(mat&&mat.alphaTest<.25)mat.alphaTest=.36;
      if(mat&&T.DoubleSide!==undefined)mat.shadowSide=T.DoubleSide;
      if(mat)mat.needsUpdate=true;
      materialsReady=true;
    }
    const floor=scene.getObjectByName('Forest_Soil_And_Trail');
    if(floor)floor.receiveShadow=true;
    scene.getObjectByName('Forest_Lumber_Trunks')?.traverse?.(o=>{if(o.isMesh)o.castShadow=true;});
    // Desativa o truque antigo de partículas seguindo a câmera.
    if(window.gameForestLighting?.beams){for(const b of window.gameForestLighting.beams)b.visible=false;}
    const rig=scene.getObjectByName('V119_ForestLighting');
    rigLights=[];
    if(rig){rig.traverse(o=>{if(o.isDirectionalLight){o.intensity=.06;rigLights.push(o)}else if(o.isHemisphereLight){o.intensity=.03;rigLights.push(o)}});}
  }
  function getDay(hour){return clamp(Math.sin((hour-6)*Math.PI/12)*3,0,1);}
  function beforeWorldRender(){
    if(!game||!renderer||!scene||!sun||!hemi)return;
    if(!canopies&&++frame%80===0)fixShadows();
    if(window.gameTestMode?.active||window.gameSpiderCave?.active)return;
    const hour=Number(game.dayNight?.hour??12),day=getDay(hour),twilight=clamp(1-Math.abs(hour-6.5)/1.5,0,1)+clamp(1-Math.abs(hour-17.5)/1.5,0,1);
    const p=presets[style], player=worldPos();if(!p||!player)return;
    const phase=(hour-6)*Math.PI/12;
    const solar=solarScratch.set(Math.cos(phase),Math.max(.16,Math.abs(Math.sin(phase))),Math.sin(phase*.66)).normalize();
    const texel=60/2048;
    const px=Math.round(player.x/texel)*texel,pz=Math.round(player.z/texel)*texel;
    if(px!==cachedGroundX||pz!==cachedGroundZ){
      cachedGroundX=px;cachedGroundZ=pz;
      cachedGroundY=game.groundY?.(px,pz)??0;
    }
    const sy=cachedGroundY;
    sun.position.set(px+solar.x*83,sy+solar.y*83+3,pz+solar.z*83);
    sun.target.position.set(px,sy+2,pz);
    sun.target.updateMatrixWorld(true);
    sun.updateMatrixWorld(true);
    const dusk=clamp(twilight,0,1);
    if(day>.01){sun.color.copy(daylightWhite).lerp(duskGold,dusk*.55);sun.intensity=p.sun*(.70+.30*day);}
    else{sun.color.set(0x91b3df);sun.intensity=.17;}
    hemi.intensity=(.16+day*p.ambient);
    hemi.color.set(day>.08?0xd4e8f3:0x627da6);
    hemi.groundColor.set(day>.08?0x454f34:0x17202c);
    renderer.toneMappingExposure=p.exposure;
    if(scene.fog && scene.fog.isFogExp2){
      scene.fog.density=p.fog + (1-day)*.009;
      if(day>.1)scene.fog.color.copy(fogDay).lerp(fogDusk,dusk*.35);
      else scene.fog.color.set(0x1c293b);
    }
    // Evita que as luzes auxiliares do V119 deixem a noite branca.
    for(let i=0;i<rigLights.length;i++){const light=rigLights[i];if(light.isDirectionalLight)light.intensity=day*.045;else if(light.isHemisphereLight)light.intensity=.025;}
    if(!firstLogged){firstLogged=true;console.info('[Floresta luz real] sombras projetadas pelas copas + volumetria de sombra, PSX mantido, perfil:',style);}
  }
  function afterScenePass(mat,cam){
    if(!mat?.uniforms||!cam||!T)return;
    const u=mat.uniforms,p=presets[style];if(!p)return;
    const hour=Number(game?.dayNight?.hour??12),day=getDay(hour);
    const ready=!!(sun&&sun.shadow?.map?.texture&&sun.shadow.matrix && !window.gameTestMode?.active&&!window.gameSpiderCave?.active);
    if(u.uPhysicalVolume)u.uPhysicalVolume.value=ready?day*p.volume:0;
    if(u.uVolumeSteps)u.uVolumeSteps.value=p.steps;
    if(!ready)return;
    u.uSunShadowMap.value=shadowTextureSafe();
    u.uShadowWorldMatrix.value.copy(shadowMatrixSafe());
    u.uCameraInverseProjection.value.copy(cam.projectionMatrixInverse);
    u.uCameraWorldMatrix.value.copy(cam.matrixWorld);
    u.uCameraWorldPos.value.setFromMatrixPosition(cam.matrixWorld);
    u.uLightWorldDir.value.copy(sun.position).sub(sun.target.position).normalize();
    u.uSunScatterColor.value.set(style==='unbound'?0xffdfb2:0xffe8cd);
    u.uShadowBias.value=sun.shadow.bias??-.00012;
  }
  function setStyle(next){
    if(!presets[next])return;
    style=next;
    // Selecionar um perfil de iluminação não desliga o visual PSX: eles são combinados.
    if(window.gameGraphics?.mode!=='retro')window.gameGraphics?.setMode?.('retro');
    try{localStorage.setItem('floresta_luz_real_v168s',style)}catch{}
    if(scene&&sun)fixShadows();
    updateUI();
  }
  function updateUI(){
    const b=document.getElementById('lightingStyleV168S');
    if(b)b.textContent='ILUMINAÇÃO: '+presets[style].label;
    document.querySelectorAll('[data-real-light]').forEach(el=>el.classList.toggle('active',el.dataset.realLight===style));
  }
  function buildUI(){
    if(uiReady)return;
    const panel=document.getElementById('graphicsPanelV146');
    if(!panel)return;
    uiReady=true;
    const el=document.createElement('div');
    el.id='lightingControlsV168S';
    el.innerHTML=`<div style="font-size:12px;font-weight:800;margin:14px 0 7px">ILUMINAÇÃO REAL + PSX</div>
      <div class="modes"><button class="mode" type="button" data-real-light="reimagined">REIMAGINED</button><button class="mode" type="button" data-real-light="unbound">UNBOUND</button></div>
      <small>Sombras reais das folhas e troncos, luz volumétrica baseada no shadow map do sol. O filtro PSX continua ligado ao selecionar RETRO PSX.</small>`;
    panel.appendChild(el);
    el.querySelectorAll('button').forEach(btn=>btn.addEventListener('click',e=>{e.preventDefault();e.stopPropagation();setStyle(btn.dataset.realLight);panel.classList.remove('open');}));
    updateUI();
  }
  const api={version:'V168S-Physical-Shadows-Volumetric-1',active:true,get style(){return style;},setStyle,beforeWorldRender,afterScenePass,debug(){return {style,shadowMap:!!shadowTextureSafe(),foliageShadows:!!canopies?.castShadow,psx:window.gameGraphics?.mode,volume:presets[style].volume,steps:presets[style].steps}}};
  window.gameAdvancedLighting=api;
  let tries=0;
  function init(){
    game=window.gameReview;T=window.__THREE_MODULE;
    if(!game?.renderer||!game?.scene||!game?.camera||!T||!window.gameGraphics||!window.gameForestV100?.ready){if(++tries<1200)setTimeout(init,30);return;}
    renderer=game.renderer;scene=game.scene;camera=game.camera;
    solarScratch=new T.Vector3();daylightWhite=new T.Color(0xffffff);duskGold=new T.Color(0xffbb75);fogDay=new T.Color(0x87999c);fogDusk=new T.Color(0x9a8d79);
    findLights();if(!sun||!hemi){console.warn('[Floresta luz real] sem luz principal');return;}
    fixShadows();buildUI();
    console.info('[Floresta luz real] iniciada; F9 troca perfis; F8 continua ligando/desligando PSX.');
  }
  init();
})();

