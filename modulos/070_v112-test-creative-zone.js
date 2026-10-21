
(async()=>{
  if(window.__V112_TEST_ZONE)return;window.__V112_TEST_ZONE=true;
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const mode=document.getElementById('gameModeSelectV112'),surv=document.getElementById('modeSurvivalV112'),test=document.getElementById('modeTestV112'),modeStatus=document.getElementById('modeStatusV112');
  const hud=document.getElementById('testHudV112'),hint=document.getElementById('testPowerHintV112'),god=document.getElementById('testGodV112');
  const rankDown=document.getElementById('testIgnisRankDownV118'),rankUp=document.getElementById('testIgnisRankUpV118'),rankValue=document.getElementById('testIgnisRankValueV118'),rankPhase=document.getElementById('testIgnisRankPhaseV118');
  const canvas=document.getElementById('c');
  try{document.exitPointerLock?.()}catch{}
  document.body.classList.add('v112-mode-select');

  for(let i=0;i<1200;i++){
    if(window.gameReview?.scene&&window.gameReview?.player&&window.gameInventory&&window.gameIgnisLegacy?.castPower&&window.gameZombie&&window.__THREE_MODULE)break;
    await sleep(20);
  }
  const game=window.gameReview,inv=window.gameInventory,T=window.__THREE_MODULE;
  if(!game?.scene||!inv||!T){modeStatus.textContent='Falha ao preparar o modo de teste.';return}

  const TEST_X=10000,TEST_Z=10000,SIZE=420;
  let active=false,invulnerable=true,power='fireball',ignisRank=5,floor=null,testLightA=null,testLightB=null,originalRemove=null,originalIgnisSpawn=null;
  const saved={x:game.player.x,z:game.player.z,yaw:game.player.yaw,pitch:game.player.pitch,hour:game.dayNight?.hour??12,mode:game.dayNight?.mode??'auto'};
  const powerNames={fireball:'Bola de Fogo',pillars:'Pilares de Fogo',stream:'Rajada de Fogo'};

  window.gameTestMode={
    get active(){return active},
    get invulnerable(){return invulnerable},
    get power(){return power},
    get ignisRank(){return ignisRank},
    setPower:setPower,
    setIgnisRank:setIgnisRank,
    enter:enterTest,
    version:'V118B'
  };

  function pointerLock(){
    if(!canvas||!matchMedia('(pointer:fine)').matches)return;
    try{const p=canvas.requestPointerLock?.({unadjustedMovement:true});p?.catch?.(()=>canvas.requestPointerLock?.());}catch{try{canvas.requestPointerLock?.()}catch{}}
  }
  function closeMode(){mode.classList.add('hidden');mode.setAttribute('aria-hidden','true');document.body.classList.remove('v112-mode-select')}
  function addOrFill(item,target){
    const now=inv.items.find(i=>i.id===item.id)?.quantity||0;
    if(now<target)inv.addItem({...item,quantity:target-now});
  }
  function grantCreativeInventory(){
    const resources=[
      {id:'rock',name:'Pedra',type:'Recurso',weight:.6,description:'Pedra para ferramentas, construção e fornalha.'},
      {id:'branch',name:'Galho',type:'Recurso',weight:.3,description:'Galho para crafting, combustível e construção.'},
      {id:'vine',name:'Cipó',type:'Fibra natural',weight:.18,description:'Fibra e amarração para receitas.'},
      {id:'wood_chip',name:'Lasca de madeira',type:'Material de fogo',weight:.05,description:'Lasca seca para fogo e crafting.'},
    ];
    for(const it of resources)addOrFill(it,99);
    const tools=[
      {id:'axe',name:'Machado de pedra',type:'Ferramenta',weight:1.1,description:'Machado artesanal pronto para teste.'},
      {id:'hammer',name:'Martelo primitivo',type:'Ferramenta',weight:1.35,description:'Martelo de pedra pronto para teste.'},
      {id:'wood_shield',name:'Escudo de madeira',type:'Equipamento',weight:2.2,description:'Escudo pronto para teste.'}
    ];
    for(const it of tools)addOrFill(it,1);
    addOrFill({id:'torch',name:'Tocha',type:'Ferramenta',weight:1.2,description:'Fonte de luz portátil.'},1);
    inv.refresh?.();
  }
  function makeFloor(){
    if(floor)return;
    const geo=new T.PlaneGeometry(SIZE,SIZE,48,48);geo.rotateX(-Math.PI/2);
    const p=geo.attributes.position;
    for(let i=0;i<p.count;i++){
      const wx=TEST_X+p.getX(i),wz=TEST_Z+p.getZ(i);
      p.setY(i,game.groundY(wx,wz));
    }
    p.needsUpdate=true;geo.computeVertexNormals();
    const mat=new T.MeshStandardMaterial({color:0xffffff,roughness:.96,metalness:0});
    floor=new T.Mesh(geo,mat);floor.name='V112_Test_White_Floor';floor.position.set(TEST_X,0,TEST_Z);floor.receiveShadow=true;game.scene.add(floor);
    testLightA=new T.HemisphereLight(0xffffff,0xdedede,1.15);testLightA.name='V112_Test_Hemi';game.scene.add(testLightA);
    testLightB=new T.DirectionalLight(0xffffff,1.15);testLightB.name='V112_Test_Key';testLightB.position.set(TEST_X+24,32,TEST_Z+18);testLightB.target.position.set(TEST_X,0,TEST_Z);game.scene.add(testLightB);game.scene.add(testLightB.target);
  }
  function wrapInfiniteItems(){
    if(originalRemove)return;
    originalRemove=inv.removeItem.bind(inv);
    inv.removeItem=(id,quantity=1)=>active?true:originalRemove(id,quantity);
  }
  function wrapIgnisSpawn(){
    const ig=window.gameIgnis;if(!ig?.spawnNow||originalIgnisSpawn)return;
    originalIgnisSpawn=ig.spawnNow.bind(ig);
    ig.spawnNow=(...args)=>{
      const ok=originalIgnisSpawn(...args);
      if(active&&ok&&ig.root){
        const yaw=game.player.yaw||0,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
        ig.root.position.set(game.player.x+fx*18,game.groundY(game.player.x+fx*18,game.player.z+fz*18),game.player.z+fz*18);
        ig.root.rotation.y=Math.atan2(game.player.x-ig.root.position.x,game.player.z-ig.root.position.z);
      }
      return ok;
    };
  }
  function refreshRankUI(){
    if(rankValue)rankValue.textContent=String(ignisRank);
    if(rankPhase){rankPhase.textContent=ignisRank>=5?'FASE 2':'FASE 1';rankPhase.classList.toggle('p2',ignisRank>=5)}
    if(hint)hint.textContent=`X • ${powerNames[power]} • NÍVEL ${ignisRank}${ignisRank>=5?' • FASE 2':''}`;
  }
  function setIgnisRank(value){
    const next=Math.max(1,Math.min(5,Math.floor(Number(value)||1)));
    ignisRank=next;
    refreshRankUI();
    const st=document.getElementById('status');
    if(active&&st)st.textContent=`MODO TESTE • ${powerNames[power]} • nível ${ignisRank}${ignisRank>=5?' • FASE 2':''}`;
    return ignisRank;
  }
  function setPower(p){
    if(!['fireball','pillars','stream'].includes(p))return false;power=p;
    hud.querySelectorAll('[data-test-power]').forEach(b=>b.classList.toggle('on',b.dataset.testPower===p));
    refreshRankUI();return true;
  }
  function castPower(){
    if(!active)return false;
    const ok=window.gameIgnisLegacy?.castPower?.(power,{ignoreCooldown:true});
    if(ok)pointerLock();return !!ok;
  }
  function enterTest(){
    if(active)return;
    active=true;invulnerable=!!god.checked;closeMode();document.body.classList.add('v112-test-mode');
    makeFloor();grantCreativeInventory();wrapInfiniteItems();wrapIgnisSpawn();
    game.dayNight?.forceDay?.();game.dayNight?.pause?.();
    if(typeof game.teleport186==='function')game.teleport186(TEST_X,TEST_Z+12,0);
    else{game.player.x=TEST_X;game.player.z=TEST_Z+12;game.player.yaw=0;game.player.bodyYaw=0;}
    game.player.pitch=-.03;
    game.keys?.clear?.();if(game.stick){game.stick.x=0;game.stick.y=0}
    hud.classList.add('show');hud.setAttribute('aria-hidden','false');hint.classList.add('show');refreshRankUI();
    document.getElementById('resourceStatus')?.style.setProperty('display','none','important');
    const st=document.getElementById('status');if(st)st.textContent='MODO TESTE • arena branca • inventário infinito • F8 spawns • X poder';
    pointerLock();
  }

  surv.disabled=false;test.disabled=false;modeStatus.textContent='Pronto.';
  surv.addEventListener('click',()=>{active=false;closeMode();pointerLock()});
  test.addEventListener('click',enterTest);
  god.addEventListener('change',()=>{invulnerable=god.checked;if(invulnerable)window.gameZombie?.healPlayer?.(99999)});
  document.getElementById('testInvV112')?.addEventListener('click',()=>inv.toggle?.());
  document.getElementById('testCraftV112')?.addEventListener('click',()=>document.getElementById('craftBtn')?.click());
  document.getElementById('testSpawnV112')?.addEventListener('click',()=>document.getElementById('directorBtn')?.click());
  hud.querySelectorAll('[data-test-power]').forEach(b=>b.addEventListener('click',()=>{setPower(b.dataset.testPower);pointerLock()}));
  rankDown?.addEventListener('click',()=>{setIgnisRank(ignisRank-1);pointerLock()});
  rankUp?.addEventListener('click',()=>{setIgnisRank(ignisRank+1);pointerLock()});
  refreshRankUI();

  window.addEventListener('keydown',e=>{
    if(!active)return;
    if((e.code==='BracketLeft'||e.code==='BracketRight')&&!e.repeat&&!window.gameInventory?.isOpen&&!document.querySelector('#directorOverlay.open')){
      setIgnisRank(ignisRank+(e.code==='BracketRight'?1:-1));e.preventDefault();e.stopImmediatePropagation();return;
    }
    if(e.code==='KeyX'&&!e.repeat&&!window.gameInventory?.isOpen&&!document.querySelector('#directorOverlay.open')&&!document.body.classList.contains('crafting-active')){
      if(castPower()){e.preventDefault();e.stopImmediatePropagation()}
    }
  },true);

  let lastHeal=0;
  function loop(now){
    requestAnimationFrame(loop);if(!active)return;
    // Caverna e entrada ficam apenas na sobrevivencia, nunca no criativo.
    const caveEntrance=game.scene.getObjectByName('Cave186_Entrance');
    if(caveEntrance)caveEntrance.visible=false;
    // Keep the laboratory visually isolated from the survival sky/map.
    if(!game.scene.background?.isColor)game.scene.background=new T.Color(0xffffff);else game.scene.background.setHex(0xffffff);
    game.scene.fog=null;
    if(testLightB){testLightB.position.set(game.player.x+24,32,game.player.z+18);testLightB.target.position.set(game.player.x,game.groundY(game.player.x,game.player.z),game.player.z)}
    if(invulnerable&&now-lastHeal>250){lastHeal=now;window.gameZombie?.healPlayer?.(99999)}
  }
  requestAnimationFrame(loop);
})();
