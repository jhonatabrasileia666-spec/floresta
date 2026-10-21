
(async()=>{
  const isiOS=/iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform==="MacIntel" && navigator.maxTouchPoints>1);

  const standalone=
    window.matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone===true;

  const install=document.getElementById("v51PwaInstall");
  const state=document.getElementById("v51PwaState");

  // When launched from Home Screen, bypass all intro/gate UI immediately.
  if(standalone){
    document.body.classList.add("mobile-started");
    const intro=document.getElementById("mobileStartOverlay");
    if(intro){
      intro.style.display="none";
      intro.style.pointerEvents="none";
      intro.classList.add("hidden");
    }
  }

  if(location.protocol==="https:" || location.hostname==="localhost"){
    if(state)state.style.display="block";

    try{
      if("serviceWorker" in navigator){
        await navigator.serviceWorker.register("./sw.js",{scope:"./"});
        await navigator.serviceWorker.ready;

        // Cache the current game after the first successful online load.
        if("caches" in window){
          const cache=await caches.open("floresta-v254-runtime-1");
          const cached=await cache.match("./index.html");
          if(!cached){
            const response=await fetch("./index.html",{cache:"no-cache"});
            if(response.ok){
              await cache.put("./index.html",response.clone());
            }
          }
        }
      }

      if(state){
        state.textContent="Aplicativo pronto";
        setTimeout(()=>state.style.display="none",1100);
      }
    }catch(err){
      console.warn("V51 PWA:",err);
      if(state){
        state.textContent="Jogo online pronto";
        setTimeout(()=>state.style.display="none",1400);
      }
    }
  }

  // iOS only allows Add to Home Screen from Safari/HTTPS.
  if(isiOS && !standalone && location.protocol==="https:"){
    setTimeout(()=>{
      if(install)install.style.display="block";
    },1500);
  }

  document.getElementById("v51HideInstall")?.addEventListener("click",()=>{
    if(install)install.style.display="none";
  });

  window.gamePWA={
    version:"V64",
    isiOS,
    standalone,
    secure:location.protocol==="https:"
  };
})();
