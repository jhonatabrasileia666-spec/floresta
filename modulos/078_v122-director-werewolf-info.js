
(()=>{
  function paint(){const e=document.getElementById('directorWerewolfInfo'),w=window.gameWerewolf;if(!e||!w)return;e.textContent=`Lobisomem: noite aleatória desta partida = ${w.randomNight||'…'} • pode ser spawnado manualmente a qualquer hora.`}
  setInterval(paint,500);paint();
})();
