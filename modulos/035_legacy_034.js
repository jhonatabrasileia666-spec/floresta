
(()=>{
  const isiOS=!!window.__IOS_DEVICE;
  const isMobile=
    isiOS ||
    matchMedia("(pointer:coarse)").matches ||
    innerWidth<=900;

  if(isiOS)document.body.classList.add("ios-v47");

  if(!isMobile){
    document.getElementById("mobileStartOverlay")?.remove();
    document.getElementById("rotatePhoneNotice")?.remove();
    return;
  }

  document.body.classList.add("mobile-v46");

  const byId=id=>document.getElementById(id);
  const startOverlay=byId("mobileStartOverlay");
  const startBtn=byId("mobileStartBtn");
  const attackBtn=byId("mobileAttackBtn");
  const runBtn=byId("mobileRunBtn");
  const crouchBtn=byId("mobileCrouchBtn");
  const menuBtn=byId("mobileMenuBtn");
  const menu=byId("mobileMenuPanel");
  const qualityBtn=byId("mobileQualityBtn");

  let crouched=false;
  let performanceMode=true;
  let rendererReady=false;

  function dispatchKey(type,code){
    window.dispatchEvent(
      new KeyboardEvent(type,{
        code,
        key:code,
        bubbles:true,
        cancelable:true
      })
    );
  }

  function releaseMovementKeys(){
    for(const code of [
      "KeyW","KeyA","KeyS","KeyD",
      "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
      "ShiftLeft","ShiftRight",
      "ControlLeft","ControlRight","KeyC"
    ]){
      dispatchKey("keyup",code);
    }
    runBtn?.classList.remove("active");
    if(!crouched)crouchBtn?.classList.remove("active");
  }

  async function enterFullscreenLandscape(){
    // iPhone Safari may not expose element fullscreen/orientation lock.
    // Treat them as optional enhancements, never as requirements.
    try{
      const target=document.documentElement;
      const request=
        target.requestFullscreen ||
        target.webkitRequestFullscreen;

      if(
        request &&
        !document.fullscreenElement &&
        !document.webkitFullscreenElement
      ){
        const result=request.call(target,{navigationUI:"hide"});
        if(result?.then)await result;
      }
    }catch{}

    try{
      const result=screen.orientation?.lock?.("landscape");
      if(result?.then)await result;
    }catch{}

    // Safari toolbar minimization fallback.
    try{
      window.scrollTo(0,1);
      setTimeout(()=>window.scrollTo(0,1),120);
    }catch{}
  }

  function setPerformanceMode(on){
    performanceMode=!!on;
    qualityBtn.textContent=
      performanceMode
        ? "Desempenho: ON"
        : "Qualidade: ALTA";

    const g=window.gameReview;
    const renderer=g?.renderer;

    if(renderer){
      rendererReady=true;

      const dpr=window.devicePixelRatio||1;
      renderer.setPixelRatio(
        performanceMode
          ? Math.min(dpr,isiOS?.82:1.0)
          : Math.min(dpr,isiOS?1.15:1.45)
      );

      renderer.setSize(
        innerWidth,
        innerHeight,
        false
      );

      // Keep shadows, but make shadow maps cheaper on phones.
      g.scene?.traverse?.(o=>{
        if(!o?.isLight||!o.shadow?.mapSize)return;

        const size=performanceMode
          ? (isiOS?384:512)
          : (isiOS?768:1024);
        if(
          o.shadow.mapSize.width!==size ||
          o.shadow.mapSize.height!==size
        ){
          o.shadow.mapSize.set(size,size);
          o.shadow.map?.dispose?.();
          o.shadow.map=null;
          o.shadow.needsUpdate=true;
        }
      });
    }
  }

  function syncIOSViewport(){
    if(!isiOS)return;

    const vv=window.visualViewport;
    const h=Math.round(vv?.height||innerHeight);
    const w=Math.round(vv?.width||innerWidth);

    document.documentElement.style.setProperty("--ios-vh",h+"px");
    document.documentElement.style.setProperty("--ios-vw",w+"px");

    const g=window.gameReview;
    if(g?.renderer&&w>0&&h>0){
      g.renderer.setSize(w,h,false);
      if(g.camera){
        g.camera.aspect=w/h;
        g.camera.updateProjectionMatrix?.();
      }
    }
  }

  function waitRenderer(){
    let tries=0;
    const timer=setInterval(()=>{
      tries++;
      if(window.gameReview?.renderer){
        clearInterval(timer);
        setPerformanceMode(true);
      }else if(tries>600){
        clearInterval(timer);
      }
    },50);
  }

  // Dedicated mobile attack button.
  attackBtn?.addEventListener("pointerdown",e=>{
    e.preventDefault();
    e.stopPropagation();

    if(
      document.body.classList.contains("mobile-ui-paused") ||
      document.body.classList.contains("crafting-active")
    )return;

    window.gameAttack?.attack?.();
  },{passive:false});

  // Run = hold.
  function runDown(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    runBtn.classList.add("active");
    dispatchKey("keydown","ShiftLeft");
  }
  function runUp(e){
    e?.preventDefault?.();
    e?.stopPropagation?.();
    runBtn.classList.remove("active");
    dispatchKey("keyup","ShiftLeft");
  }
  runBtn?.addEventListener("pointerdown",runDown,{passive:false});
  runBtn?.addEventListener("pointerup",runUp,{passive:false});
  runBtn?.addEventListener("pointercancel",runUp,{passive:false});
  runBtn?.addEventListener("pointerleave",e=>{
    if(e.buttons===0)runUp(e);
  },{passive:false});

  // Crouch = toggle.
  crouchBtn?.addEventListener("click",e=>{
    e.preventDefault();
    e.stopPropagation();

    crouched=!crouched;
    crouchBtn.classList.toggle("active",crouched);

    dispatchKey(
      crouched?"keydown":"keyup",
      "ControlLeft"
    );
  });

  // Compact mobile menu proxies existing systems instead of duplicating them.
  menuBtn?.addEventListener("click",e=>{
    e.stopPropagation();
    menu?.classList.toggle("open");
  });

  function proxy(proxyId,targetId){
    byId(proxyId)?.addEventListener("click",e=>{
      e.preventDefault();
      e.stopPropagation();
      menu?.classList.remove("open");
      byId(targetId)?.click();
    });
  }

  proxy("mobileInventoryProxy","inventoryBtn");
  proxy("mobileCraftProxy","craftBtn");
  proxy("mobileEquipProxy","equipBtn");
  
  proxy("mobileDayProxy","forceDayBtn");
  proxy("mobileNightProxy","forceNightBtn");

  qualityBtn?.addEventListener("click",e=>{
    e.preventDefault();
    e.stopPropagation();
    setPerformanceMode(!performanceMode);
  });

  byId("mobileFullscreenBtn")?.addEventListener("click",async e=>{
    e.preventDefault();
    e.stopPropagation();
    menu?.classList.remove("open");
    await enterFullscreenLandscape();
  });

  startBtn?.addEventListener("click",async e=>{
    e.preventDefault();
    e.stopPropagation();

    document.body.classList.add("mobile-started");
    startOverlay?.classList.add("hidden");

    await enterFullscreenLandscape();
    syncIOSViewport();
    setPerformanceMode(true);
  });

  // Close menu when touching gameplay.
  document.getElementById("c")?.addEventListener("pointerdown",()=>{
    menu?.classList.remove("open");
  },true);

  // Inventory/Craft overlays: hide game controls while UI is open.
  const inventory=
    document.querySelector(".inventory-overlay");
  const craft=
    document.querySelector(".craft-overlay");

  function syncPausedUi(){
    const paused=
      inventory?.classList.contains("open") ||
      craft?.classList.contains("open") ||
      document.body.classList.contains("crafting-active");

    document.body.classList.toggle(
      "mobile-ui-paused",
      !!paused
    );

    if(paused)releaseMovementKeys();
  }

  const obs=new MutationObserver(syncPausedUi);
  if(inventory)obs.observe(inventory,{attributes:true,attributeFilter:["class"]});
  if(craft)obs.observe(craft,{attributes:true,attributeFilter:["class"]});
  obs.observe(document.body,{attributes:true,attributeFilter:["class"]});

  // Avoid browser gestures/context menus stealing game input.
  document.addEventListener("contextmenu",e=>{
    if(e.target?.closest?.("#game,#mobileControls")){
      e.preventDefault();
    }
  });

  document.addEventListener("gesturestart",e=>e.preventDefault(),{passive:false});
  document.addEventListener("gesturechange",e=>e.preventDefault(),{passive:false});
  document.addEventListener("gestureend",e=>e.preventDefault(),{passive:false});

  window.addEventListener("blur",releaseMovementKeys);
  window.addEventListener("pagehide",releaseMovementKeys);
  document.addEventListener("touchcancel",releaseMovementKeys,{passive:true});
  document.addEventListener("visibilitychange",()=>{
    if(document.hidden)releaseMovementKeys();
  });

  window.addEventListener("resize",()=>{
    syncIOSViewport();
    if(rendererReady)setPerformanceMode(performanceMode);
  });

  window.visualViewport?.addEventListener("resize",()=>{
    syncIOSViewport();
    if(rendererReady)setPerformanceMode(performanceMode);
  });

  window.visualViewport?.addEventListener("scroll",syncIOSViewport);

  syncIOSViewport();
  waitRenderer();

  window.gameMobile={
    active:true,
    isiOS,
    get performanceMode(){return performanceMode;},
    setPerformance:setPerformanceMode,
    fullscreen:enterFullscreenLandscape,
    releaseMovement:releaseMovementKeys
  };
})();
