
(async()=>{
  // V181: Noite do Trolloc com atmosfera real, sem esfera 2D sobre o HUD.
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1200;i++){
    if(window.gameReview?.scene&&window.gameReview?.dayNight&&window.gameDemonBoss&&window.__THREE_MODULE)break;
    await wait(20);
  }
  const game=window.gameReview, dn=game?.dayNight, demon=window.gameDemonBoss, T=window.__THREE_MODULE;
  if(!game?.scene||!dn||!demon||!T)return;
  if(window.__FLORESTA_V181_TROLLOC_NIGHT__)return;
  window.__FLORESTA_V181_TROLLOC_NIGHT__=true;

  // Trolloc é inimigo de evento, não chefão: NUNCA usar barra gigante na HUD.
  const topHud=document.getElementById('demonTrollocHud');
  if(topHud){topHud.style.display='none';topHud.style.visibility='hidden';topHud.style.pointerEvents='none';}
  document.getElementById('trollocBloodMoon')?.remove();
  const style=document.createElement('style');
  style.id='trollocV181AtmosphereStyle';
  style.textContent=`
    #demonTrollocHud,#trollocBloodMoon{display:none!important;visibility:hidden!important;pointer-events:none!important}
    @keyframes trollocMistDrift{0%,100%{transform:translate3d(-3%,0,0);opacity:.28}50%{transform:translate3d(3%,-2%,0);opacity:.52}}
    @keyframes trollocFearBreath{0%,100%{filter:brightness(.94)}50%{filter:brightness(1.03)}}
    #trollocNightOverlay{overflow:hidden;will-change:opacity}
    body.trolloc-blood-night #trollocNightOverlay{animation:trollocFearBreath 13s ease-in-out infinite}
    #trollocNightOverlay::before{content:'';position:absolute;inset:48% -16% -15%;background:radial-gradient(ellipse at 26% 86%,rgba(115,17,21,.22),transparent 62%),radial-gradient(ellipse at 76% 74%,rgba(80,12,22,.23),transparent 66%);filter:blur(23px);animation:trollocMistDrift 19s ease-in-out infinite;opacity:.4}
    #trollocNightOverlay::after{content:'';position:absolute;inset:0;background:radial-gradient(ellipse at 50% 47%,transparent 32%,rgba(4,0,8,.14) 78%,rgba(0,0,0,.29) 100%);opacity:.85}
    @media (prefers-reduced-motion:reduce){body.trolloc-blood-night #trollocNightOverlay,#trollocNightOverlay::before{animation:none!important}}
  `;
  document.head.appendChild(style);

  const scene=game.scene;
  const overlay=document.getElementById('trollocNightOverlay')||document.createElement('div');
  overlay.id='trollocNightOverlay';
  overlay.style.cssText='position:fixed;inset:0;z-index:18;pointer-events:none;opacity:0;transition:opacity 2.2s ease;background:linear-gradient(to bottom,rgba(60,3,14,.35) 0%,rgba(66,7,13,.16) 32%,rgba(20,1,7,.07) 67%,rgba(5,0,8,.25) 100%),radial-gradient(ellipse at 48% 5%,rgba(147,16,31,.23),transparent 70%)';
  if(!overlay.parentNode)document.body.appendChild(overlay);

  let sun=null,hemi=null;
  scene.traverse(o=>{if(!sun&&o.isDirectionalLight&&o.castShadow)sun=o;if(!hemi&&o.isHemisphereLight)hemi=o;});
  let original=null,applied=false,nightForced=false,lastAutoDay=-1,forceExpiry=0;
  const fearFog=new T.Color(0x23050e);
  const fearSun=new T.Color(0x9e2e36);
  const fearSky=new T.Color(0x35101d);
  const fearGround=new T.Color(0x120208);
  function snapshot(){
    const fog=scene.fog;
    return {
      sunI:sun?.intensity??0,sunC:sun?.color?.clone?.(),
      hemiI:hemi?.intensity??0,hemiSky:hemi?.color?.clone?.(),hemiGround:hemi?.groundColor?.clone?.(),
      fogRef:fog||null,fogColor:fog?.color?.clone?.(),fogNear:fog?.near,fogFar:fog?.far,fogDensity:fog?.density,
      backgroundRef:scene.background,backgroundColor:scene.background?.isColor?scene.background.clone():null
    };
  }
  function setBloodNight(on){
    if(!on){
      if(!applied)return;
      overlay.style.opacity='0';document.body.classList.remove('trolloc-blood-night');
      if(original){
        if(scene.fog===original.fogRef && scene.fog){
          if(original.fogColor)scene.fog.color.copy(original.fogColor);
          if(original.fogNear!==undefined)scene.fog.near=original.fogNear;
          if(original.fogFar!==undefined)scene.fog.far=original.fogFar;
          if(original.fogDensity!==undefined)scene.fog.density=original.fogDensity;
        }
        if(sun&&original.sunC){sun.intensity=original.sunI;sun.color.copy(original.sunC);}
        if(hemi&&original.hemiSky){hemi.intensity=original.hemiI;hemi.color.copy(original.hemiSky);if(original.hemiGround)hemi.groundColor.copy(original.hemiGround);}
        if(original.backgroundColor&&scene.background===original.backgroundRef){scene.background.copy(original.backgroundColor);}
      }
      applied=false;original=null;
      return;
    }
    if(!applied){original=snapshot();applied=true;}
    overlay.style.opacity='1';document.body.classList.add('trolloc-blood-night');
    if(scene.fog?.color&&original.fogColor){
      scene.fog.color.copy(original.fogColor).lerp(fearFog,.88);
      if(scene.fog.isFogExp2&&Number.isFinite(original.fogDensity)){
        scene.fog.density=Math.min(.034,Math.max(.009,original.fogDensity*1.28));
      }else if(scene.fog.isFog && Number.isFinite(original.fogFar)){
        scene.fog.near=Math.max(6,Math.min(24,(original.fogNear??10)*.8));
        scene.fog.far=Math.max(96,Math.min(original.fogFar,155));
      }
    }
    if(sun&&original.sunC){sun.intensity=Math.max(.12,original.sunI*.32);sun.color.copy(original.sunC).lerp(fearSun,.78);}
    if(hemi&&original.hemiSky){hemi.intensity=Math.max(.12,original.hemiI*.52);hemi.color.copy(original.hemiSky).lerp(fearSky,.83);if(original.hemiGround)hemi.groundColor.copy(original.hemiGround).lerp(fearGround,.75);}
    if(original.backgroundColor&&scene.background===original.backgroundRef){scene.background.copy(original.backgroundColor).lerp(fearFog,.66);}
  }
  function syncNight(){
    const summoning=!!demon.spawning;
    if(nightForced&&!summoning&&performance.now()>forceExpiry)nightForced=false;
    setBloodNight(summoning||nightForced);
  }
  setInterval(syncNight,250);
  function forceNight(){
    dn.setHour?.(23.15);
    nightForced=true;forceExpiry=performance.now()+25000;
    setBloodNight(true);
    if(!demon.spawning)demon.spawnNow?.();
    return true;
  }
  demon.forceNight=forceNight;
  demon.spawnFar=()=>demon.spawnNow?.();
  function patchDirector(){
    const sel=document.getElementById('directorCreature');
    const opt=sel?.querySelector('option[value="demon"]');
    if(opt)opt.textContent='Demônio Trolloc — Evento';
    const quick=document.querySelector('#directorOverlay .director-quick');
    if(quick&&!document.getElementById('directorTrollocNightBtn')){
      const b=document.createElement('button');b.id='directorTrollocNightBtn';b.type='button';
      b.textContent='Forçar Noite do Trolloc';
      b.addEventListener('click',()=>{forceNight();const m=document.getElementById('directorMessage');if(m)m.textContent='Noite do Trolloc forçada.';});
      quick.appendChild(b);
    }
    if(window.gameDirector){window.gameDirector.forceDemonNight=forceNight;window.gameDirector.spawnDemon=()=>demon.spawnNow?.()?1:0;}
  }
  patchDirector();setInterval(patchDirector,1000);
  setInterval(()=>{
    const day=Math.max(1,Number(dn.day)||1),hour=Number(dn.hour)||0;
    if(day%7===0&&hour>=20.2&&hour<20.5&&lastAutoDay!==day&&!demon.active){
      lastAutoDay=day;forceNight();
      const m=document.getElementById('directorMessage');if(m)m.textContent='A Noite do Trolloc começou.';
    }
  },700);
  // Usado nos testes e para identificar a versão em execução.
  window.gameTrollocNightV181={get active(){return applied;},forceNight,syncNight};
})();

