
(async()=>{
  if(window.__florestaV65ForestAlive) return;
  window.__florestaV65ForestAlive = true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const smoothstep=(a,b,x)=>{
    const t=clamp((x-a)/Math.max(1e-6,b-a),0,1);
    return t*t*(3-2*t);
  };
  const lerp=(a,b,t)=>a+(b-a)*t;
  const hash=n=>{
    const x=Math.sin(n*127.1+311.7)*43758.5453123;
    return x-Math.floor(x);
  };
  const signedHash=n=>hash(n)*2-1;

  async function importFirst(urls){
    let last;
    for(const u of urls){
      try{return await window.__LOCAL_IMPORT(u)}catch(err){last=err;}
    }
    if(window.__THREE_MODULE) return window.__THREE_MODULE;
    throw last || new Error('Three.js indisponível');
  }

  async function waitGame(){
    for(let i=0;i<1200;i++){
      const g=window.gameReview;
      if(g?.scene && g?.player && g?.renderer && g?.groundY) return g;
      await sleep(20);
    }
    throw new Error('Jogo indisponível para V65');
  }

  const THREE = window.__THREE_MODULE || await importFirst([
    window.FLORESTA_MODULES?.three,
    window.FLORESTA_MODULES?.three
  ].filter(Boolean));

  const game = await waitGame();
  const scene = game.scene;
  const player = game.player;
  const renderer = game.renderer;

  const envGroup = new THREE.Group();
  envGroup.name = 'V65_FlorestaViva';
  scene.add(envGroup);

  const instanced=[];
  scene.traverse(o=>{ if(o?.isInstancedMesh) instanced.push(o); });
  const trunkMesh = instanced.find(o=>o.count===220 && (o.geometry?.parameters?.height||0)>6);
  const foliageMesh = instanced.find(o=>o.count===660);

  const barkMaterial = trunkMesh
    ? (Array.isArray(trunkMesh.material) ? trunkMesh.material[0].clone() : trunkMesh.material.clone())
    : new THREE.MeshStandardMaterial({color:0x6a4c2f,roughness:1,flatShading:true});
  barkMaterial.roughness = .98;
  barkMaterial.flatShading = true;

  const pineDark = new THREE.MeshStandardMaterial({color:0x2f4b2a, roughness:1, metalness:0, flatShading:true});
  const pineMid  = new THREE.MeshStandardMaterial({color:0x48683a, roughness:1, metalness:0, flatShading:true});
  const pineWarm = new THREE.MeshStandardMaterial({color:0x5f7f46, roughness:1, metalness:0, flatShading:true});
  const bushDark = new THREE.MeshStandardMaterial({color:0x49613b, roughness:1, metalness:0, flatShading:true});
  const grassMat = new THREE.MeshStandardMaterial({color:0x718c4f, roughness:1, metalness:0, flatShading:true, side:THREE.DoubleSide});
  const rockMat  = new THREE.MeshStandardMaterial({color:0x62615f, roughness:1, metalness:0, flatShading:true});

  const unitTrunkGeo = new THREE.CylinderGeometry(.58,1,1,8,1,false);
  const coneGeoA = new THREE.ConeGeometry(1,1,7,1,false);
  const coneGeoB = new THREE.ConeGeometry(1,1,6,1,false);
  const branchGeo = new THREE.CylinderGeometry(.05,.08,1,5,1,false);
  const bushGeo = new THREE.IcosahedronGeometry(1,0);
  const grassGeo = new THREE.ConeGeometry(1,1,5,1,false);
  const rockGeo = new THREE.DodecahedronGeometry(1,0);

  const tempMat = new THREE.Matrix4();
  const tempWorld = new THREE.Matrix4();
  const tp = new THREE.Vector3();
  const tq = new THREE.Quaternion();
  const ts = new THREE.Vector3();
  const existing=[];

  function collectOriginalTrees(){
    if(!trunkMesh) return;
    const h = trunkMesh.geometry?.parameters?.height || 8.2;
    for(let i=0;i<trunkMesh.count;i++){
      trunkMesh.getMatrixAt(i,tempMat);
      tempWorld.multiplyMatrices(trunkMesh.matrixWorld,tempMat);
      tempWorld.decompose(tp,tq,ts);
      const base = new THREE.Vector3(0,-h/2,0).applyMatrix4(tempWorld);
      existing.push({x:base.x,z:base.z,r:Math.max(1.2,Math.max(ts.x,ts.z)*.9)});
    }
  }
  collectOriginalTrees();

  const addedSpots=[];
  const anchorX = player.x;
  const anchorZ = player.z;

  function freeSpot(x,z,minDist=2.8){
    if(Math.hypot(x-anchorX,z-anchorZ)<7.2) return false;
    for(const e of existing){
      if(Math.hypot(x-e.x,z-e.z) < minDist + e.r) return false;
    }
    for(const e of addedSpots){
      if(Math.hypot(x-e.x,z-e.z) < minDist + e.r) return false;
    }
    return true;
  }

  function makePine(seed,small=false){
    const g = new THREE.Group();
    const h = small ? lerp(3.8,6.3,hash(seed+2)) : lerp(7.8,15.5,hash(seed+2));
    const trunkR = small ? lerp(.08,.14,hash(seed+3)) : lerp(.14,.32,hash(seed+3));

    const trunk = new THREE.Mesh(unitTrunkGeo,barkMaterial.clone());
    trunk.scale.set(trunkR,h,trunkR);
    trunk.position.y = h*.5;
    trunk.castShadow = true;
    trunk.receiveShadow = true;
    g.add(trunk);

    const crownStart = h * (small ? .34 : .38);
    const layers = small ? 2+Math.floor(hash(seed+6)*2) : 3+Math.floor(hash(seed+6)*3);
    const crownHeight = h * (small ? .62 : .66);
    for(let i=0;i<layers;i++){
      const t = i/Math.max(1,layers-1);
      const mat = (i%3===0 ? pineDark : i%3===1 ? pineMid : pineWarm).clone();
      mat.color.offsetHSL(signedHash(seed+i*13)*.01,signedHash(seed+i*7)*.03,signedHash(seed+i*5)*.03);
      const cone = new THREE.Mesh(i%2===0?coneGeoA:coneGeoB,mat);
      const layerHeight = crownHeight * lerp(.34,.2,t);
      const layerRadius = (small ? 1.2 : 1.7) * h * lerp(.22,.1,t);
      cone.scale.set(layerRadius,layerHeight,layerRadius);
      cone.position.y = crownStart + t*crownHeight*.52 + layerHeight*.48;
      cone.rotation.y = hash(seed+i*17) * Math.PI * 2;
      cone.castShadow = true;
      cone.receiveShadow = true;
      g.add(cone);
    }

    const branchCount = small ? 1+Math.floor(hash(seed+11)*2) : 3+Math.floor(hash(seed+11)*4);
    for(let i=0;i<branchCount;i++){
      const branch = new THREE.Mesh(branchGeo,barkMaterial.clone());
      const by = h * lerp(.32,.76,hash(seed+i*21));
      const len = lerp(.5,1.15,hash(seed+i*31)) * (small ? .75 : 1.0);
      branch.scale.set(.85,len,.85);
      const angle = hash(seed+i*41) * Math.PI * 2;
      branch.position.set(Math.cos(angle)*trunkR*.7, by, Math.sin(angle)*trunkR*.7);
      branch.rotation.z = Math.PI/2.9 + signedHash(seed+i*15)*.25;
      branch.rotation.y = angle;
      branch.castShadow = true;
      branch.receiveShadow = true;
      g.add(branch);
    }

    g.userData.radius = small ? 1.1 : 2.2;
    return g;
  }

  function makeBush(seed){
    const g = new THREE.Group();
    const lumps = 3 + Math.floor(hash(seed)*3);
    for(let i=0;i<lumps;i++){
      const lump = new THREE.Mesh(bushGeo, i%2===0 ? bushDark.clone() : pineMid.clone());
      const s = lerp(.35,.85,hash(seed+i*7));
      lump.scale.set(s,s*lerp(.8,1.25,hash(seed+i*11)),s);
      lump.position.set(signedHash(seed+i*13)*.6, s*.65, signedHash(seed+i*17)*.6);
      lump.castShadow = true;
      lump.receiveShadow = true;
      g.add(lump);
    }
    return g;
  }

  function makeGrassPatch(seed){
    const g = new THREE.Group();
    const blades = 4 + Math.floor(hash(seed)*4);
    for(let i=0;i<blades;i++){
      const blade = new THREE.Mesh(grassGeo, grassMat.clone());
      const sx = lerp(.07,.18,hash(seed+i*5));
      const sy = lerp(.28,.7,hash(seed+i*8));
      blade.scale.set(sx,sy,sx);
      blade.position.set(signedHash(seed+i*15)*.48, sy*.48, signedHash(seed+i*19)*.48);
      blade.rotation.y = hash(seed+i*23) * Math.PI * 2;
      blade.castShadow = false;
      blade.receiveShadow = true;
      g.add(blade);
    }
    return g;
  }

  function makeRock(seed){
    const r = new THREE.Mesh(rockGeo, rockMat.clone());
    const s = lerp(.22,.75,hash(seed+3));
    r.scale.set(s, s*lerp(.7,1.15,hash(seed+4)), s*lerp(.85,1.2,hash(seed+5)));
    r.rotation.set(hash(seed+7)*.4, hash(seed+8)*Math.PI*2, hash(seed+9)*.4);
    r.castShadow = true;
    r.receiveShadow = true;
    return r;
  }

  function scatterForest(){
    let createdTall=0, createdSmall=0;
    for(let i=0;i<80 && createdTall<46;i++){
      const ang = hash(i+10) * Math.PI * 2;
      const dist = lerp(10,58,hash(i+20));
      const x = anchorX + Math.cos(ang) * dist + signedHash(i+30)*4.5;
      const z = anchorZ + Math.sin(ang) * dist + signedHash(i+40)*4.5;
      if(!freeSpot(x,z,3.7)) continue;
      const tree = makePine(i,false);
      const y = game.groundY(x,z);
      tree.position.set(x,y,z);
      tree.rotation.y = hash(i+50) * Math.PI * 2;
      envGroup.add(tree);
      addedSpots.push({x,z,r:2.2});
      createdTall++;
    }

    for(let i=0;i<70 && createdSmall<28;i++){
      const ang = hash(i+110) * Math.PI * 2;
      const dist = lerp(8,42,hash(i+120));
      const x = anchorX + Math.cos(ang) * dist + signedHash(i+130)*3.2;
      const z = anchorZ + Math.sin(ang) * dist + signedHash(i+140)*3.2;
      if(!freeSpot(x,z,2.1)) continue;
      const tree = makePine(i+1000,true);
      const y = game.groundY(x,z);
      tree.position.set(x,y,z);
      tree.rotation.y = hash(i+150) * Math.PI * 2;
      envGroup.add(tree);
      addedSpots.push({x,z,r:1.2});
      createdSmall++;
    }

    let decor=0;
    for(let i=0;i<120 && decor<56;i++){
      const ang = hash(i+210) * Math.PI * 2;
      const dist = lerp(6,44,hash(i+220));
      const x = anchorX + Math.cos(ang) * dist + signedHash(i+230)*4.1;
      const z = anchorZ + Math.sin(ang) * dist + signedHash(i+240)*4.1;
      if(!freeSpot(x,z,1.15)) continue;
      const y = game.groundY(x,z);
      let obj;
      const pick = hash(i+250);
      if(pick<.35) obj = makeBush(i+3000);
      else if(pick<.75) obj = makeBush(i+4000);
      else obj = makeRock(i+5000);
      obj.position.set(x,y,z);
      obj.rotation.y = hash(i+260) * Math.PI * 2;
      envGroup.add(obj);
      addedSpots.push({x,z,r:1.05});
      decor++;
    }
  }
  /* V100 supplies forest geometry; keep original audio and ambience. */

  // Luz / atmosfera extra de floresta.
  const forestHemi = new THREE.HemisphereLight(0xcfe7b5,0x334126,.18);
  envGroup.add(forestHemi);
  const canopyFill = new THREE.DirectionalLight(0xffe8bb,.28);
  canopyFill.castShadow = false;
  envGroup.add(canopyFill);
  const coolFill = new THREE.DirectionalLight(0x8fb3d7,.12);
  coolFill.castShadow = false;
  envGroup.add(coolFill);

  const originalFog = scene.fog ? {
    density: scene.fog.density ?? 0.012,
    color: scene.fog.color?.clone?.() || new THREE.Color(0xa0b7c5)
  } : null;

  // Som ambiente procedural.
  const ambience = {
    ctx:null, started:false, master:null,
    windGain:null, rustleGain:null, birdsGain:null, cricketsGain:null,
    birdTimer:null, cricketTimer:null,
    dayMix:1, nightMix:0
  };

  function makeNoiseBuffer(ctx,seconds=2){
    const length = Math.max(1,Math.floor(ctx.sampleRate*seconds));
    const buf = ctx.createBuffer(1,length,ctx.sampleRate);
    const data = buf.getChannelData(0);
    for(let i=0;i<length;i++){
      data[i] = (Math.random()*2-1) * (0.65 + 0.35*Math.sin(i/length*Math.PI*6));
    }
    return buf;
  }

  function createNoiseLoop(ctx,opts={}){
    const src = ctx.createBufferSource();
    src.buffer = makeNoiseBuffer(ctx, opts.seconds || 2.2);
    src.loop = true;

    let node = src;
    if(opts.filterType){
      const filter = ctx.createBiquadFilter();
      filter.type = opts.filterType;
      filter.frequency.value = opts.frequency || 800;
      filter.Q.value = opts.Q || .0001;
      node.connect(filter);
      node = filter;
    }

    const gain = ctx.createGain();
    gain.gain.value = 0.0001;
    node.connect(gain).connect(ambience.master);
    src.start();
    return {src,gain};
  }

  function chirpBird(){
    if(!ambience.ctx || !ambience.started || ambience.dayMix<.16 || document.visibilityState==='hidden') return;
    const ctx = ambience.ctx;
    const base = ctx.currentTime + .02;
    const phrases = 2 + Math.floor(Math.random()*3);
    for(let i=0;i<phrases;i++){
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
      const st = base + i*(.045 + Math.random()*.035);
      const f1 = 1400 + Math.random()*1700;
      const f2 = f1*(0.72 + Math.random()*.22);
      osc.type = i%2===0 ? 'triangle' : 'sine';
      osc.frequency.setValueAtTime(f1,st);
      osc.frequency.exponentialRampToValueAtTime(f2,st+.055);
      gain.gain.setValueAtTime(0.0001,st);
      gain.gain.exponentialRampToValueAtTime(.012 + ambience.dayMix*.022, st+.008);
      gain.gain.exponentialRampToValueAtTime(0.0001, st+.07);
      if(pan){
        pan.pan.value = Math.random()*1.4 - .7;
        osc.connect(gain).connect(pan).connect(ambience.birdsGain);
      }else{
        osc.connect(gain).connect(ambience.birdsGain);
      }
      osc.start(st);
      osc.stop(st+.09);
    }
  }

  function chirpCricket(){
    if(!ambience.ctx || !ambience.started || ambience.nightMix<.14 || document.visibilityState==='hidden') return;
    const ctx = ambience.ctx;
    const base = ctx.currentTime + .02;
    const pulses = 6 + Math.floor(Math.random()*8);
    const freq = 3800 + Math.random()*1400;
    const pan = ctx.createStereoPanner ? ctx.createStereoPanner() : null;
    const gainBus = ctx.createGain();
    gainBus.gain.value = .7;
    if(pan){
      pan.pan.value = Math.random()*1.2 - .6;
      gainBus.connect(pan).connect(ambience.cricketsGain);
    }else gainBus.connect(ambience.cricketsGain);

    for(let i=0;i<pulses;i++){
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const st = base + i*.018;
      osc.type = 'square';
      osc.frequency.setValueAtTime(freq*(.98+Math.random()*.04), st);
      gain.gain.setValueAtTime(0.0001,st);
      gain.gain.exponentialRampToValueAtTime(.0035 + ambience.nightMix*.008, st+.003);
      gain.gain.exponentialRampToValueAtTime(0.0001, st+.014);
      osc.connect(gain).connect(gainBus);
      osc.start(st);
      osc.stop(st+.016);
    }
  }

  function scheduleBirds(){
    clearTimeout(ambience.birdTimer);
    const next = 1400 + Math.random()*3200;
    ambience.birdTimer = setTimeout(()=>{ chirpBird(); scheduleBirds(); }, next);
  }

  function scheduleCrickets(){
    clearTimeout(ambience.cricketTimer);
    const next = 700 + Math.random()*1600;
    ambience.cricketTimer = setTimeout(()=>{ chirpCricket(); scheduleCrickets(); }, next);
  }

  function startAmbience(){
    if(ambience.started) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    if(!AC) return;
    try{
      const ctx = new AC();
      ambience.ctx = ctx;
      ambience.master = ctx.createGain();
      ambience.master.gain.value = .34;
      ambience.master.connect(ctx.destination);

      ambience.windGain = ctx.createGain(); ambience.windGain.gain.value = .0001; ambience.windGain.connect(ambience.master);
      ambience.rustleGain = ctx.createGain(); ambience.rustleGain.gain.value = .0001; ambience.rustleGain.connect(ambience.master);
      ambience.birdsGain = ctx.createGain(); ambience.birdsGain.gain.value = .0001; ambience.birdsGain.connect(ambience.master);
      ambience.cricketsGain = ctx.createGain(); ambience.cricketsGain.gain.value = .0001; ambience.cricketsGain.connect(ambience.master);

      const wind = createNoiseLoop(ctx,{seconds:3.2,filterType:'lowpass',frequency:650});
      wind.gain.disconnect(); wind.gain.connect(ambience.windGain);
      const rustle = createNoiseLoop(ctx,{seconds:2.1,filterType:'bandpass',frequency:1450,Q:.55});
      rustle.gain.disconnect(); rustle.gain.connect(ambience.rustleGain);

      const lfo = ctx.createOscillator();
      const lfoGain = ctx.createGain();
      lfo.type = 'sine';
      lfo.frequency.value = .065;
      lfoGain.gain.value = .5;
      lfo.connect(lfoGain);
      lfoGain.connect(ambience.windGain.gain);
      lfo.start();

      const rustleLfo = ctx.createOscillator();
      const rustleAmt = ctx.createGain();
      rustleLfo.type = 'triangle';
      rustleLfo.frequency.value = .19;
      rustleAmt.gain.value = .03;
      rustleLfo.connect(rustleAmt).connect(ambience.rustleGain.gain);
      rustleLfo.start();

      scheduleBirds();
      scheduleCrickets();
      ambience.started = true;
      ctx.resume?.().catch(()=>{});
    }catch(err){
      console.warn('Áudio ambiente indisponível', err);
    }
  }

  // V262: o menu intercepta o primeiro clique; iniciar o ambiente depois de entrar no mundo.
  // O evento de inicio ocorre no clique real, permitindo resume() em PC e Mobile.
  function resumeForestAmbience(){
    if(!window.gameFront172?.started)return;
    startAmbience();
    if(ambience.ctx?.state==='suspended')ambience.ctx.resume().catch(()=>{});
  }
  window.addEventListener('floresta:started',resumeForestAmbience);
  window.addEventListener('floresta:audio-unlock',resumeForestAmbience);
  // A floresta silencia no menu, na caverna e em abas inativas.
  setInterval(()=>{if(!ambience.ctx)return;const active=window.gameFront172?.started && !window.gameFront172?.paused && window.gameFront172?.shell?.hidden && !window.gameSpiderCave?.active && !document.hidden;
    ambience.master.gain.setTargetAtTime(active?.34:0,ambience.ctx.currentTime,.25);},400);
  ['pointerdown','touchstart','keydown'].forEach(ev=>{
    window.addEventListener(ev, resumeForestAmbience,{capture:true,passive:true});
  });

  function updateForestLife(now){
    const hour = game.dayNight?.hour ?? 12;
    const daylight = smoothstep(5.6,7.5,hour) * (1-smoothstep(17.2,19.3,hour));
    const twilight = Math.max(0, 1 - Math.abs(hour-12)/7.5);
    const night = 1 - daylight;

    forestHemi.intensity = lerp(.09,.28,daylight);
    forestHemi.color.set(daylight>0.5 ? 0xcfe7b5 : 0x8ea6b7);
    if(forestHemi.groundColor) forestHemi.groundColor.set(daylight>0.5 ? 0x334126 : 0x1f231d);

    canopyFill.intensity = lerp(.08,.36,daylight);
    canopyFill.color.set(daylight>.35 ? 0xffe8bb : 0x7893bc);
    canopyFill.position.set(player.x + 14, (game.groundY(player.x,player.z)||0) + 24 + daylight*12, player.z + 8);

    coolFill.intensity = lerp(.04,.16,1-daylight*.7);
    coolFill.position.set(player.x - 10, (game.groundY(player.x,player.z)||0) + 18, player.z - 12);

    if(scene.fog && originalFog){
      scene.fog.density = originalFog.density * lerp(1.16,.88,daylight);
      const fogCol = originalFog.color.clone();
      fogCol.lerp(new THREE.Color(daylight>.45 ? 0x9fb48b : 0x6e8390), .18 + twilight*.08);
      scene.fog.color.copy(fogCol);
    }

    renderer.toneMappingExposure = (renderer.toneMappingExposure||1) * .985 + (daylight>.2 ? 1.02 : .88) * .015;

    if(ambience.started && ambience.ctx){
      ambience.dayMix = daylight;
      ambience.nightMix = night;
      const t = ambience.ctx.currentTime;
      ambience.windGain.gain.setTargetAtTime(.015 + .018*daylight + .012*(.5+.5*Math.sin(now*.00021)), t, 1.2);
      ambience.rustleGain.gain.setTargetAtTime(.006 + .016*daylight + .006*twilight, t, .9);
      ambience.birdsGain.gain.setTargetAtTime(.0001 + .05*daylight, t, .7);
      ambience.cricketsGain.gain.setTargetAtTime(.0001 + .045*night, t, .7);
      if(ambience.ctx.state==='suspended' && document.visibilityState==='visible') ambience.ctx.resume?.().catch(()=>{});
    }

    // Leve balanço de alguns elementos para deixar a floresta mais viva.
    const sway = Math.sin(now*.0006)*.02;
    envGroup.children.forEach((obj,idx)=>{
      if(obj.userData.radius && obj.children.length>2){
        obj.rotation.z = Math.sin(now*.00055 + idx*.7) * .008;
        obj.rotation.x = Math.cos(now*.00038 + idx*.41) * .004;
      }
    });
  }

  function lifeLoop(now){
    updateForestLife(now||performance.now());
    requestAnimationFrame(lifeLoop);
  }
  requestAnimationFrame(lifeLoop);

  document.addEventListener('visibilitychange',()=>{
    if(ambience.ctx){
      if(document.visibilityState==='hidden') ambience.master.gain.setTargetAtTime(.0001, ambience.ctx.currentTime, .4);
      else ambience.master.gain.setTargetAtTime(.34, ambience.ctx.currentTime, .7);
    }
  });

  const status = document.getElementById('status');
  if(status){
    status.textContent = 'V65: floresta mais viva carregada • árvores variadas, atmosfera e som ambiente';
  }
})();
