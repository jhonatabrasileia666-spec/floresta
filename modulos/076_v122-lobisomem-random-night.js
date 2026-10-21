
(async()=>{
  if(window.__V122_WEREWOLF_RANDOM_NIGHT__)return;window.__V122_WEREWOLF_RANDOM_NIGHT__=true;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1600;i++){
    if(window.gameWerewolf&&window.gameReview?.dayNight&&window.gameDirector)break;
    await wait(20);
  }
  const wolf=window.gameWerewolf,dn=window.gameReview?.dayNight;
  if(!wolf||!dn)return;

  // Uma única noite aleatória por partida. Evita as noites dos bosses programados.
  const candidates=[3,4,6,7,8,9];
  const randomNight=candidates[Math.floor(Math.random()*candidates.length)];
  let triggered=false,lastKey=null;
  const nightIndex=()=>{const d=Math.max(1,Math.floor(Number(dn.day)||1)),h=Number(dn.hour)||0;return h<5.8?Math.max(1,d-1):d};
  const isNight=()=>{const h=Number(dn.hour)||0;return h>=19||h<5.8};
  const bossBusy=()=>!!(window.gameIgnis?.root?.visible&&window.gameIgnis?.state!=='DEAD')||!!(window.gameGiantBoss?.root?.visible&&window.gameGiantBoss?.state!=='DEAD')||!!window.gameMartialBoss?.active;

  function canStart(){return !triggered&&!window.gameTestMode?.active&&!bossBusy()&&isNight()&&nightIndex()===randomNight&&wolf.state==='DORMANT'}
  function startRandomNight(){
    if(!canStart())return false;
    triggered=true;lastKey=randomNight;
    return !!wolf.start?.();
  }
  function forceNight(){
    // 21:00 keeps the requested night index equal to the selected survival day.
    dn.setDay?.(randomNight);dn.setHour?.(21);dn.pause?.();
    triggered=true;lastKey=randomNight;
    if(wolf.state!=='DORMANT')wolf.reset?.();
    setTimeout(()=>wolf.start?.(),80);
    const st=document.getElementById('status');if(st)st.textContent=`NOITE ${randomNight} • noite do Lobisomem forçada`;
    return randomNight;
  }
  function reroll(){
    // API kept deterministic for the current run; the next full reload rolls again.
    return randomNight;
  }

  let last=performance.now();
  function loop(now){
    requestAnimationFrame(loop);
    if(now-last<250)return;last=now;
    startRandomNight();
  }
  requestAnimationFrame(loop);

  Object.defineProperties(wolf,{
    randomNight:{get:()=>randomNight,configurable:true},
    randomNightTriggered:{get:()=>triggered,configurable:true}
  });
  wolf.forceNight=forceNight;wolf.rerollNight=reroll;
  window.gameWerewolfSchedule={version:'V122B',randomNight,forceNight,startRandomNight,get triggered(){return triggered},get currentNight(){return nightIndex()}};
  console.info('[V122B] Lobisomem: noite aleatória',randomNight);
})();
