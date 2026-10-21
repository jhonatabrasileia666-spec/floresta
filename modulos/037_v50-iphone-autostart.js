
(function(){
  function boot(){
    try{
      document.body.classList.add("mobile-started");

      const overlay=document.getElementById("mobileStartOverlay");
      if(overlay){
        overlay.classList.add("hidden");
        overlay.style.display="none";
        overlay.style.pointerEvents="none";
      }

      const state=document.getElementById("v50BootState");
      if(state)state.textContent="Carregando floresta…";

      // Never require fullscreen/orientation to begin play on iPhone.
      // They remain optional through the menu.
      try{ window.scrollTo(0,1); }catch(e){}

      let ticks=0;
      const timer=setInterval(function(){
        ticks++;

        const g=window.gameReview;
        if(g && g.scene && g.renderer && g.camera){
          clearInterval(timer);

          try{
            if(window.gameMobile && typeof window.gameMobile.setPerformance==="function"){
              window.gameMobile.setPerformance(true);
            }
          }catch(e){}

          if(state){
            state.textContent="Jogo pronto";
            state.classList.add("ready");
            setTimeout(function(){
              if(state)state.style.display="none";
            },1600);
          }
          return;
        }

        if(ticks===40 && state){
          state.textContent="Carregando motor 3D…";
        }

        if(ticks===120 && state){
          state.textContent="Ainda carregando…";
        }

        if(ticks>=240){
          clearInterval(timer);
          if(state){
            state.classList.add("error");
            state.textContent=
              "O visualizador do Arquivos não liberou o motor 3D. " +
              "Nesse caso o iPhone precisa abrir a versão publicada como app/PWA.";
          }
        }
      },100);
    }catch(err){
      const state=document.getElementById("v50BootState");
      if(state){
        state.classList.add("error");
        state.textContent="Erro ao iniciar: "+String(err && err.message || err);
      }
    }
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",boot,{once:true});
  }else{
    boot();
  }
})();
