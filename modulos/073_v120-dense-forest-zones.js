
(async()=>{
  if(window.__V120_DENSE_FOREST__) return;
  window.__V120_DENSE_FOREST__=true;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1600;i++){
    if(window.gameReview?.scene && window.__THREE_MODULE && window.gameReview?.renderer && window.gameReview?.player) break;
    await wait(20);
  }
  const game=window.gameReview, T=window.__THREE_MODULE;
  if(!game?.scene || !T || !game?.player) return;
  const scene=game.scene;
  const mobile=!!window.__FOREST_MOBILE_BUILD__;
  const root=new T.Group();
  root.name='V120_DenseForestZones';
  scene.add(root);

  const instanced=[];
  scene.traverse(o=>{ if(o?.isInstancedMesh) instanced.push(o); });
  const sourceTrunks=instanced.find(o=>o.count===220 && (o.geometry?.parameters?.height||0)>6);
  const sourceFoliage=instanced.find(o=>o.count===660);
  if(!sourceTrunks || !sourceFoliage){ console.warn('[V120E_REAL] base não encontrada'); return; }

  const trunkGeo=sourceTrunks.geometry;
  const foliageGeo=sourceFoliage.geometry;
  const trunkHeight=(sourceTrunks.geometry?.parameters?.height)||13.6;
  const trunkHalf=trunkHeight*0.5;
  function cloneForestMaterial(source){ const c=source.clone(); c.onBeforeCompile=source.onBeforeCompile; c.customProgramCacheKey=source.customProgramCacheKey; return c; }
  const trunkBase=Array.isArray(sourceTrunks.material)?sourceTrunks.material[0]:sourceTrunks.material;
  const foliageBase=Array.isArray(sourceFoliage.material)?sourceFoliage.material[0]:sourceFoliage.material;

  const trunkMaterials=[];
  for(const [h,s,l] of [[0.00,0.00,0.00],[0.01,-0.01,-0.04],[-0.01,0.02,-0.02],[0.015,-0.03,0.02]]){
    const m=cloneForestMaterial(trunkBase);
    if(m.color?.offsetHSL) m.color.offsetHSL(h,s,l);
    m.roughness=Math.min(1,(m.roughness??.92)+0.03);
    m.needsUpdate=true;
    trunkMaterials.push(m);
  }
  const foliageMaterials=[];
  for(const [h,s,l,ei] of [[0.00,0.00,0.00,0.95],[0.02,0.03,-0.04,0.92],[-0.02,0.02,-0.06,0.90],[0.04,-0.02,0.03,0.88],[-0.03,0.00,-0.01,0.94],[0.07,-0.05,0.04,0.82]]){
    const m=cloneForestMaterial(foliageBase);
    if(m.color?.offsetHSL) m.color.offsetHSL(h,s,l);
    m.roughness=Math.min(1,(m.roughness??.95)+0.03);
    if('emissiveIntensity' in m) m.emissiveIntensity=Math.max(0,(m.emissiveIntensity??0)*ei);
    m.needsUpdate=true;
    foliageMaterials.push(m);
  }

  function seeded(n){ let x=Math.sin(n*127.1+311.7)*43758.5453123; return x-Math.floor(x); }
  function rand(seed,a=0,b=1){ return a+(b-a)*seeded(seed); }
  function pick(arr,seed){ return arr[Math.floor(rand(seed,0,arr.length-0.0001))]; }
  function chance(seed,p){ return rand(seed,0,1)<p; }
  function chooseFamily(seed){ const r=rand(seed,0,1); if(r<0.19) return 'slender'; if(r<0.41) return 'full'; if(r<0.66) return 'irregular'; if(r<0.82) return 'bent'; if(r<0.93) return 'young'; if(r<1.0) return 'dark'; return 'irregular'; }

  function addLeaf(group,seed,pos,scale,rotFactor=1){
    const leaf=new T.Mesh(foliageGeo,pick(foliageMaterials,seed+17));
    leaf.scale.copy(scale);
    leaf.position.copy(pos);
    leaf.rotation.set(rand(seed+1,-0.10,0.10)*rotFactor, rand(seed+2,0,Math.PI*2), rand(seed+3,-0.12,0.12)*rotFactor);
    leaf.castShadow=false; leaf.receiveShadow=true; group.add(leaf); return leaf;
  }

  function makeTree(seed,family){
    const g=new T.Group();
    const trunk=new T.Mesh(trunkGeo,pick(trunkMaterials,seed+5));
    let sx=1, sy=1, sz=1, leanX=0, leanZ=0;
    switch(family){
      case 'slender': sx=rand(seed+10,0.84,1.04); sy=rand(seed+11,1.04,1.32); sz=rand(seed+12,0.84,1.02); leanX=rand(seed+13,-0.03,0.03); leanZ=rand(seed+14,-0.03,0.03); break;
      case 'full': sx=rand(seed+10,0.95,1.18); sy=rand(seed+11,0.98,1.18); sz=rand(seed+12,0.95,1.18); leanX=rand(seed+13,-0.025,0.025); leanZ=rand(seed+14,-0.025,0.025); break;
      case 'irregular': sx=rand(seed+10,0.92,1.14); sy=rand(seed+11,0.95,1.26); sz=rand(seed+12,0.90,1.16); leanX=rand(seed+13,-0.05,0.05); leanZ=rand(seed+14,-0.05,0.05); break;
      case 'bent': sx=rand(seed+10,0.88,1.06); sy=rand(seed+11,0.96,1.20); sz=rand(seed+12,0.88,1.04); leanX=rand(seed+13,-0.10,0.10); leanZ=rand(seed+14,-0.10,0.10); break;
      case 'young': sx=rand(seed+10,0.58,0.82); sy=rand(seed+11,0.72,0.96); sz=rand(seed+12,0.58,0.82); leanX=rand(seed+13,-0.05,0.05); leanZ=rand(seed+14,-0.05,0.05); break;
      case 'dark': sx=rand(seed+10,0.92,1.12); sy=rand(seed+11,1.00,1.26); sz=rand(seed+12,0.90,1.10); leanX=rand(seed+13,-0.04,0.04); leanZ=rand(seed+14,-0.04,0.04); break;
      default: sx=rand(seed+10,0.9,1.1); sy=rand(seed+11,0.95,1.22); sz=rand(seed+12,0.9,1.1);
    }
    trunk.scale.set(sx,sy,sz); trunk.position.y=trunkHalf*sy; trunk.castShadow=!mobile; trunk.receiveShadow=true; trunk.rotation.z=leanZ; trunk.rotation.x=leanX; g.add(trunk);
    const baseY=trunkHalf*sy*0.70;
    const wide = family==='full' ? 1.16 : family==='young' ? 0.74 : family==='irregular' ? 1.06 : family==='dark' ? 0.98 : 0.92;
    const high = family==='slender' ? 1.06 : family==='young' ? 0.86 : 0.98;
    if(family==='slender'){
      addLeaf(g,seed+100,new T.Vector3(0,baseY+0.0,0), new T.Vector3(0.95*wide,0.95*high,0.95*wide));
      addLeaf(g,seed+110,new T.Vector3(rand(seed+111,-0.08,0.08),baseY+1.55*sy,rand(seed+112,-0.08,0.08)), new T.Vector3(0.82*wide,0.86*high,0.82*wide));
      addLeaf(g,seed+120,new T.Vector3(rand(seed+121,-0.06,0.06),baseY+3.0*sy,rand(seed+122,-0.06,0.06)), new T.Vector3(0.66*wide,0.74*high,0.66*wide));
      if(chance(seed+123,0.65)) addLeaf(g,seed+124,new T.Vector3(0,baseY+4.15*sy,0), new T.Vector3(0.42,0.52,0.42));
    } else if(family==='full'){
      addLeaf(g,seed+130,new T.Vector3(0,baseY-0.10,0), new T.Vector3(1.16*wide,1.00*high,1.10*wide));
      addLeaf(g,seed+140,new T.Vector3(rand(seed+141,-0.12,0.12),baseY+1.45*sy,rand(seed+142,-0.12,0.12)), new T.Vector3(1.00*wide,0.92*high,0.98*wide));
      addLeaf(g,seed+150,new T.Vector3(rand(seed+151,-0.10,0.10),baseY+2.70*sy,rand(seed+152,-0.10,0.10)), new T.Vector3(0.84*wide,0.82*high,0.84*wide));
      if(chance(seed+153,0.72)) addLeaf(g,seed+154,new T.Vector3(0,baseY+3.70*sy,0), new T.Vector3(0.54,0.58,0.54));
      if(chance(seed+155,0.58)) addLeaf(g,seed+156,new T.Vector3(rand(seed+157,-0.55,0.55),baseY+0.95*sy,rand(seed+158,-0.55,0.55)), new T.Vector3(0.50,0.42,0.50),0.8);
    } else if(family==='irregular'){
      addLeaf(g,seed+160,new T.Vector3(rand(seed+161,-0.10,0.10),baseY,rand(seed+162,-0.10,0.10)), new T.Vector3(1.05*wide,0.96*high,0.98*wide));
      addLeaf(g,seed+170,new T.Vector3(rand(seed+171,-0.24,0.24),baseY+1.30*sy,rand(seed+172,-0.24,0.24)), new T.Vector3(0.86*wide,0.84*high,0.92*wide));
      addLeaf(g,seed+180,new T.Vector3(rand(seed+181,-0.22,0.22),baseY+2.55*sy,rand(seed+182,-0.22,0.22)), new T.Vector3(0.78*wide,0.80*high,0.74*wide));
      if(chance(seed+183,0.75)) addLeaf(g,seed+184,new T.Vector3(rand(seed+185,-0.60,0.60),baseY+1.75*sy,rand(seed+186,-0.60,0.60)), new T.Vector3(0.46,0.42,0.50));
      if(chance(seed+187,0.52)) addLeaf(g,seed+188,new T.Vector3(0,baseY+3.85*sy,0), new T.Vector3(0.42,0.50,0.42));
    } else if(family==='bent'){
      addLeaf(g,seed+190,new T.Vector3(rand(seed+191,-0.15,0.15),baseY,rand(seed+192,-0.15,0.15)), new T.Vector3(0.96*wide,0.90*high,0.96*wide));
      addLeaf(g,seed+200,new T.Vector3(rand(seed+201,-0.18,0.18),baseY+1.55*sy,rand(seed+202,-0.18,0.18)), new T.Vector3(0.80*wide,0.82*high,0.84*wide));
      addLeaf(g,seed+210,new T.Vector3(rand(seed+211,-0.12,0.12),baseY+2.90*sy,rand(seed+212,-0.12,0.12)), new T.Vector3(0.62*wide,0.72*high,0.62*wide));
      if(chance(seed+213,0.65)) addLeaf(g,seed+214,new T.Vector3(rand(seed+215,-0.72,0.72),baseY+1.45*sy,rand(seed+216,-0.72,0.72)), new T.Vector3(0.42,0.38,0.42));
    } else if(family==='dark'){
      addLeaf(g,seed+220,new T.Vector3(0,baseY-0.05,0), new T.Vector3(0.96*wide,0.92*high,0.96*wide));
      addLeaf(g,seed+230,new T.Vector3(rand(seed+231,-0.10,0.10),baseY+1.48*sy,rand(seed+232,-0.10,0.10)), new T.Vector3(0.78*wide,0.78*high,0.78*wide));
      addLeaf(g,seed+240,new T.Vector3(0,baseY+2.84*sy,0), new T.Vector3(0.58*wide,0.66*high,0.58*wide));
      if(chance(seed+243,0.35)) addLeaf(g,seed+244,new T.Vector3(rand(seed+245,-0.50,0.50),baseY+1.0*sy,rand(seed+246,-0.50,0.50)), new T.Vector3(0.34,0.30,0.34));
    } else {
      addLeaf(g,seed+250,new T.Vector3(0,baseY-0.08,0), new T.Vector3(0.78*wide,0.78*high,0.78*wide));
      addLeaf(g,seed+260,new T.Vector3(rand(seed+261,-0.08,0.08),baseY+1.18*sy,rand(seed+262,-0.08,0.08)), new T.Vector3(0.54*wide,0.62*high,0.54*wide));
      if(chance(seed+263,0.55)) addLeaf(g,seed+264,new T.Vector3(0,baseY+2.05*sy,0), new T.Vector3(0.34,0.44,0.34));
    }
    if(true){
      const sideCount = family==='full' ? 2 : family==='irregular' ? 2 : family==='young' ? 1 : 1;
      for(let i=0;i<sideCount;i++){
        if(!chance(seed+300+i*10,0.72)) continue;
        const ang=rand(seed+301+i*10,0,Math.PI*2);
        const rad=(family==='young'?0.42:0.62)*Math.max(sx,sz)*rand(seed+302+i*10,0.85,1.18);
        addLeaf(g,seed+303+i*10,new T.Vector3(Math.cos(ang)*rad, baseY+rand(seed+304+i*10,0.5,1.8)*sy, Math.sin(ang)*rad), new T.Vector3(rand(seed+305+i*10,0.28,0.48), rand(seed+306+i*10,0.26,0.44), rand(seed+307+i*10,0.28,0.48)),0.75);
      }
    }
    g.rotation.y=rand(seed+400,0,Math.PI*2);
    return g;
  }

  function makeBush(seed){
    const g=new T.Group();
    const count=3+Math.floor(rand(seed+1,0,2.99));
    for(let i=0;i<count;i++){
      const m=new T.Mesh(foliageGeo,pick(foliageMaterials,seed+10+i));
      const sc=rand(seed+20+i,0.24,0.46);
      m.scale.set(sc,sc*rand(seed+21+i,0.86,1.10),sc);
      m.position.set(rand(seed+30+i,-1.05,1.05), 0.28+rand(seed+40+i,0,0.55), rand(seed+50+i,-1.05,1.05));
      m.rotation.y=rand(seed+60+i,0,Math.PI*2);
      m.castShadow=false; m.receiveShadow=true; g.add(m);
    }
    return g;
  }

  const groveSpecs=[];
  const groveCount=mobile?12:18;
  for(let i=0;i<groveCount;i++){
    const ang=(i/groveCount)*Math.PI*2 + rand(i+1,-0.22,0.22);
    const dist=rand(i+11,42,118);
    groveSpecs.push({x:Math.cos(ang)*dist,z:Math.sin(ang)*dist,radius:rand(i+21,9,18),density:mobile ? Math.floor(rand(i+31,7,13)) : Math.floor(rand(i+31,10,20)),seed:1000+i*37});
  }
  groveSpecs.push({x:-86,z:54,radius:20,density:mobile?12:22,seed:7001},{x:72,z:-78,radius:22,density:mobile?13:24,seed:7002},{x:98,z:38,radius:19,density:mobile?11:19,seed:7003});

  const groves=[];
  function buildGrove(spec){
    const g=new T.Group(); g.position.set(spec.x,0,spec.z); g.userData.radius=spec.radius+10; g.userData.baseX=spec.x; g.userData.baseZ=spec.z;
    const gy=game.groundY?.(spec.x,spec.z) || 0; g.position.y=gy;
    for(let i=0;i<spec.density;i++){
      const a=rand(spec.seed+i*7,0,Math.PI*2), r=Math.sqrt(rand(spec.seed+i*13,0.04,1))*spec.radius, x=Math.cos(a)*r, z=Math.sin(a)*r;
      if(Math.abs(spec.x+x)<18 && Math.abs(spec.z+z)<18) continue;
      const family=chooseFamily(spec.seed+i*19);
      const tree=makeTree(spec.seed+i*23,family);
      tree.position.set(x,(game.groundY?.(spec.x+x,spec.z+z)||gy)-gy,z); tree.rotation.y+=rand(spec.seed+i*29,0,Math.PI*2); g.add(tree);
      if(rand(spec.seed+i*41,0,1)>0.60){
        const sap=makeTree(spec.seed+i*43,'young');
        sap.position.set(x+rand(spec.seed+i*47,-2.2,2.2),(game.groundY?.(spec.x+x+1,spec.z+z+1)||gy)-gy,z+rand(spec.seed+i*53,-2.2,2.2));
        sap.scale.multiplyScalar(rand(spec.seed+i*59,0.56,0.86)); sap.rotation.y+=rand(spec.seed+i*61,0,Math.PI*2); g.add(sap);
      }
      if(rand(spec.seed+i*67,0,1)>0.70){
        const bush=makeBush(spec.seed+i*71);
        bush.position.set(x+rand(spec.seed+i*73,-1.5,1.5),(game.groundY?.(spec.x+x,spec.z+z)||gy)-gy,z+rand(spec.seed+i*79,-1.5,1.5)); g.add(bush);
      }
    }
    root.add(g); groves.push(g);
  }
  groveSpecs.forEach(buildGrove);

  const originalRender=game.renderer.render.bind(game.renderer);
  game.renderer.render=(sc,cam)=>{
    if(sc===scene && cam===game.camera){
      const p=game.player, creative=!!window.gameTestMode?.active; root.visible=!creative;
      if(!creative) for(const g of groves){ const dx=(g.userData.baseX||0)-p.x, dz=(g.userData.baseZ||0)-p.z; const far=dx*dx+dz*dz > (mobile?220*220:280*280); g.visible=!far && !((window.__V134_BORDER_MASK__?.(g.userData.baseX||0,g.userData.baseZ||0)||0)>.04); }
    }
    return originalRender(sc,cam);
  };

  window.gameDenseForestZones={version:'V120E_REAL',group:root,groveCount:groves.length,mobile};
  console.info('[V120E_REAL] floresta mista aplicada', {groves:groves.length, mobile});
})();
