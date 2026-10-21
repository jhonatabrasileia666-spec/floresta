
(() => {
  const wait = (ms) => new Promise(r => setTimeout(r, ms));
  (async () => {
    for (let i=0;i<160;i++) {
      const g=window.gameReview;
      if (g?.scene && g?.player && window.gameInventory) {
        const badge=document.getElementById("resourceStatus");
        if (badge && /ERRO NA COLETA/i.test(badge.textContent||"")) {
          badge.textContent="Sistema carregado • aguardando recursos";
        }
        return;
      }
      await wait(50);
    }
    const badge=document.getElementById("resourceStatus");
    if (badge) {
      const missing=[];
      if(!window.gameReview)missing.push("jogo");
      if(!window.gameInventory)missing.push("inventário");
      badge.textContent="Falha de inicialização: "+missing.join(" + ");
    }
  })();
})();
