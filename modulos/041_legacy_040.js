

(()=>{
  const $=id=>document.getElementById(id);
  const overlay=$("directorOverlay");
  const msg=$("directorMessage");

  function dn(){return window.gameReview?.dayNight}

  function night(){
    const h=Number(dn()?.hour)||0;
    return h>=19||h<5.8;
  }

  function fallbackPlan(day){
    if(day<=1)return {eye:0,orc:0,nocturne:0};
    if(day===2)return {eye:1,orc:1,nocturne:0};
    if(day===3)return {eye:1,orc:1,nocturne:1};
    if(day===4)return {eye:2,orc:1,nocturne:1};
    if(day===5)return {eye:2,orc:2,nocturne:1};
    if(day<=7)return {eye:2,orc:2,nocturne:2};
    if(day<=9)return {eye:3,orc:3,nocturne:2};
    return {eye:3,orc:3,nocturne:3};
  }

  function say(text,ok=true){
    if(!msg)return;
    msg.textContent=text;
    msg.style.color=ok?"#9ec4a6":"#e8a291";
  }

  function refresh(){
    const day=Math.max(1,Number(dn()?.day)||1);
    const hour=Number(dn()?.hour)||0;
    const hh=String(Math.floor(hour)).padStart(2,"0");
    const mm=String(Math.floor((hour%1)*60)).padStart(2,"0");

    $("directorNow").textContent=
      `Dia ${day} • ${hh}:${mm} • ${night()?"Noite":"Dia"}`;

    if(document.activeElement!==$("directorDayInput")){
      $("directorDayInput").value=String(day);
    }

    const plan=
      window.gameSpecialCreatures?.tonightPlan||
      fallbackPlan(day);

    $("directorEyePlan").textContent=String(plan.eye||0);
    $("directorOrcPlan").textContent=String(plan.orc||0);
    $("directorNoctPlan").textContent=String(plan.nocturne||0);
    $("directorZombiePlan").textContent=String(
      window.gameZombie?.plannedWaveSize ??
      Math.min(18,4+Math.max(0,day-1)*2)
    );
  }

  function open(){
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    try{document.exitPointerLock?.()}catch{}
    window.gameMobile?.releaseMovement?.();
    refresh();
  }

  function close(){
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
  }

  function toggle(){
    overlay.classList.contains("open")?close():open();
  }

  function spawn(type,count=1){
    count=Math.max(1,Math.min(10,Math.floor(Number(count)||1)));
    let n=0;

    if(type==="zombie"){
      n=window.gameZombie?.spawnManual?.(count)||0;
    }else if(["eye","orc","nocturne"].includes(type)){
      n=window.gameSpecialCreatures?.spawn?.(type,count)||0;
    }else if(type==="werewolf"){
      n=window.gameWerewolf?.spawnNow?.()?1:0;
    }else if(type==="ignis"){
      // Debug/diretor: ignora a regra da Noite 5, mas mantém apenas uma instância do boss.
      n=window.gameIgnis?.spawnNow?.()?1:0;
    }else if(type==="giant"){
      // Debug/diretor: ignora a regra da Noite 10 e a dependência do Ignis.
      n=window.gameGiantBoss?.spawnNow?.()?1:0;
    }else if(type==="martial"){
      n=window.gameMartialBoss?.spawnNow?.()?1:0;
    }else if(type==="barrel"){
      n=window.gameBarrelLumberjack?.spawnNow?.()?1:0;
    }else if(["skeleton-warrior","centaur-fire","centaur-skeleton","necromancer"].includes(type)){
      n=window.gameUndeadForces?.spawn?.(type,count)||0;
    }

    say(
      n
        ?`${n} criatura${n===1?"":"s"} spawnada${n===1?"":"s"} agora.`
        :"Não foi possível spawnar agora.",
      !!n
    );

    refresh();
    return n;
  }

  $("directorBtn")?.addEventListener("click",toggle);
  $("directorClose")?.addEventListener("click",close);
  overlay?.addEventListener("click",e=>{
    if(e.target===overlay)close();
  });

  $("directorSpawn")?.addEventListener("click",()=>{
    spawn(
      $("directorCreature")?.value||"zombie",
      $("directorQuantity")?.value||1
    );
  });

  $("directorWerewolfNight")?.addEventListener("click",()=>{
    const n=window.gameWerewolf?.forceNight?.();
    say(n?`Noite ${n} do Lobisomem forçada.`:"Lobisomem ainda não está pronto.",!!n);
    refresh();
  });

  document.querySelectorAll("#directorOverlay [data-spawn]").forEach(btn=>{
    btn.addEventListener("click",()=>{
      spawn(btn.dataset.spawn,1);
    });
  });

  $("directorSetDay")?.addEventListener("click",()=>{
    const d=dn()?.setDay?.($("directorDayInput")?.value||1);
    say(`Dia definido como ${d||1}.`);
    refresh();
  });

  $("directorPrevDay")?.addEventListener("click",()=>{
    dn()?.setDay?.(
      Math.max(1,(Number(dn()?.day)||1)-1)
    );
    refresh();
  });

  $("directorNextDay")?.addEventListener("click",()=>{
    dn()?.setDay?.(
      (Number(dn()?.day)||1)+1
    );
    refresh();
  });

  window.addEventListener("keydown",e=>{
    if(e.code==="F8"&&!e.repeat){
      e.preventDefault();
      toggle();
    }else if(
      e.code==="Escape"&&
      overlay?.classList.contains("open")
    ){
      close();
    }
  });

  window.addEventListener("game:day-changed",refresh);
  setInterval(refresh,500);

  window.gameDirector={
    version:"V93B",
    open,close,toggle,spawn,
    spawnZombie:(n=1)=>spawn("zombie",n),
    spawnEye:(n=1)=>spawn("eye",n),
    spawnOrc:(n=1)=>spawn("orc",n),
    spawnNocturne:(n=1)=>spawn("nocturne",n),
    spawnWerewolf:()=>spawn("werewolf",1),
    forceWerewolfNight:()=>window.gameWerewolf?.forceNight?.(),
    spawnIgnis:()=>spawn("ignis",1),
    spawnGiant:()=>spawn("giant",1),
    spawnMartial:()=>spawn("martial",1),
    spawnBarrel:()=>spawn("barrel",1),
    spawnSkeletonWarrior:(n=1)=>spawn("skeleton-warrior",n),
    spawnFireCentaur:(n=1)=>spawn("centaur-fire",n),
    spawnSkeletonCentaur:(n=1)=>spawn("centaur-skeleton",n),
    spawnNecromancer:(n=1)=>spawn("necromancer",n),
    setDay:d=>dn()?.setDay?.(d)
  };
})();

