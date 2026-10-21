
(()=>{
  const isiOS=!!window.__IOS_DEVICE;
  if(!isiOS)return;

  const mark=(msg)=>{
    const el=document.getElementById("resourceStatus");
    if(el)el.textContent=msg;
  };

  mark("iPhone: JavaScript local iniciado");

  let ticks=0;
  const timer=setInterval(()=>{
    ticks++;

    if(window.gameReview?.scene && window.gameReview?.renderer){
      clearInterval(timer);
      mark("iPhone: floresta pronta");
      return;
    }

    if(ticks===40){
      mark("iPhone: carregando motor 3D…");
    }

    if(ticks>=160){
      clearInterval(timer);
      mark("iPhone: motor 3D demorou demais");
      const fatal=document.createElement("div");
      fatal.id="v48LoadHelp";
      fatal.style.cssText=
        "position:fixed;z-index:99998;left:12px;right:12px;bottom:12px;" +
        "padding:12px;border-radius:12px;background:#1b1304ee;color:#fff;" +
        "font:12px/1.4 system-ui;border:1px solid #d8a84f";
      fatal.textContent=
        "O visualizador do app Arquivos limitou o WebGL. " +
        "Use Compartilhar → Abrir no Safari, ou adicione o arquivo à Tela de Início por um navegador compatível.";
      document.body.appendChild(fatal);
    }
  },100);
})();
