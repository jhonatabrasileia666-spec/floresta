  // ---------- FERRO V216: modelo enviado + impacto exclusivo da picareta ----------
  const nodes=[];let oreSeed=21637;
  const oreRandom=()=>{oreSeed=(Math.imul(oreSeed,1664525)+1013904223)>>>0;return oreSeed/4294967296};
  function makeNode(type,x,z){
    const cfg=type==='rich'?{hits:8,drop:[7,12],s:1.12}:type==='medium'?{hits:5,drop:[3,5],s:.9}:{hits:3,drop:[1,2],s:.7};
    const g=window.makeIronCrystalV216(T);g.name='Minerio_de_ferro_Meshy';
    g.position.set(x,ground(x,z)-.035,z);g.scale.setScalar(cfg.s);g.rotation.y=oreRandom()*Math.PI*2;oreG.add(g);
    const collider={x,z,r:.57*cfg.s,kind:'iron-v216'};game.colliders?.push(collider);
    const n={type,g,ve:[],hits:0,max:cfg.hits,drop:cfg.drop,alive:true,x,z,collider,scale:cfg.s,lastHit:-Infinity};
    g.traverse(o=>o.userData.ironNode=n);nodes.push(n);return n;
  }
  // Map-wide deposits, avoiding paths, steep slopes, initial spawn and existing obstacles.
  for(let i=0;i<600&&nodes.length<44;i++){
    const x=-64+oreRandom()*128,z=-64+oreRandom()*128;
    if(Math.hypot(x-player.x,z-player.z)<7||nearCorridor(x,z)||nodes.some(n=>Math.hypot(n.x-x,n.z-z)<9))continue;
    const h=ground(x,z),ys=[ground(x-.7,z),ground(x+.7,z),ground(x,z-.7),ground(x,z+.7)];
    if(!Number.isFinite(h)||Math.max(...ys)-Math.min(...ys)>.65)continue;
    if(game.colliders?.some(c=>Number.isFinite(c.x)&&Number.isFinite(c.z)&&Math.hypot(c.x-x,c.z-z)<(c.r||c.radius||.4)+1))continue;
    makeNode(oreRandom()>.8?'rich':oreRandom()>.4?'medium':'small',x,z);
  }
  for(const p of [topW,topN,topS,topE,bridgeB]){
    const x=p.x+1.5,z=p.z+1.4;
    if(!nodes.some(n=>Math.hypot(n.x-x,n.z-z)<3))makeNode('rich',x,z);
  }
  const oreRay=new T.Raycaster(),oreScreen=new T.Vector2(0,0);let lastOreSwing=-Infinity;
  function oreTarget(range=2.6){
    if(window.gameTestMode?.active||!oreG.visible||!root.visible)return null;
    game.camera.updateMatrixWorld(true);oreG.updateWorldMatrix(true,true);oreRay.setFromCamera(oreScreen,game.camera);oreRay.far=range;
    // Raycast only the closest-distance LOD mesh, avoiding duplicate intersections.
    const meshes=[];for(const n of nodes)if(n.alive&&Math.hypot(n.x-player.x,n.z-player.z)<range+2){const mesh=n.g.levels[0].object;meshes.push(mesh);}
    const hit=oreRay.intersectObjects(meshes,false)[0];return hit?.object.userData.ironNode||null;
  }
  function hit(n){
    if(window.gameRightHand?.current!=='pickaxe'||!n?.alive)return false;
    const now=performance.now();if(now-lastOreSwing<550)return true;
    lastOreSwing=now;
    const status=document.getElementById('status');
    if(!inv.items.some(i=>i.id==='iron_ore')&&inv.items.length>=inv.capacity){if(status)status.textContent='Mochila cheia: abra espaço para receber o ferro.';return true;}
    const next=n.hits+1;
    if(next>=n.max){
      const quantity=n.drop[0]+Math.floor(oreRandom()*(n.drop[1]-n.drop[0]+1));
      const added=inv.addItem({id:'iron_ore',name:'Minério de ferro',type:'Material',quantity,weight:.45,description:'Ferro bruto extraído com picareta dos depósitos espalhados pela floresta.'});
      if(added===false){if(status)status.textContent='Não foi possível guardar o ferro. Depósito preservado.';return true;}
      n.hits=next;n.alive=false;n.g.removeFromParent();
      const ci=game.colliders?.indexOf(n.collider);if(ci>=0)game.colliders.splice(ci,1);
      inv.refresh?.();if(status)status.textContent=`+${quantity} minério de ferro • guardado na mochila`;
      window.dispatchEvent(new CustomEvent('game:iron-collected',{detail:{quantity,x:n.x,z:n.z}}));return true;
    }
    n.hits=next;n.g.scale.setScalar(n.scale*.97);setTimeout(()=>{if(n.alive)n.g.scale.setScalar(n.scale)},90);
    if(status)status.textContent=`Minério de ferro • ${n.hits}/${n.max} golpes de picareta`;
    return true;
  }
  const oreHint=document.createElement('div');oreHint.id='ironV216Hint';oreHint.style.cssText='position:fixed;left:50%;top:108px;transform:translateX(-50%);z-index:25;padding:7px 12px;background:#101b19e8;border:1px solid #9ba9a0;border-radius:6px;color:#ecebdc;font:12px system-ui;pointer-events:none;display:none;max-width:75vw;text-align:center';document.body.appendChild(oreHint);
  const oreHintTimer=setInterval(()=>{
    if(window.gameCraft?.active||window.gameInventory?.isOpen||document.querySelector('#florestaFront:not([hidden])')){oreHint.style.display='none';return;}
    const n=oreTarget(3.2);oreHint.style.display=n?'block':'none';
    if(n)oreHint.textContent=window.gameRightHand?.current==='pickaxe'?`Minério de ferro · ${n.max-n.hits} golpes restantes · Atacar`:'Minério de ferro · precisa de picareta';
  },180);
  window.addEventListener('pagehide',()=>clearInterval(oreHintTimer),{once:true});
  window.gameIronMountains={version:'V216',nodes,strikePickaxe(){if(window.gameRightHand?.current!=='pickaxe'||window.gameCraft?.active||window.gameInventory?.isOpen)return false;const n=oreTarget();return n?hit(n):false},get aliveNodes(){return nodes.filter(n=>n.alive).length},get iron(){return Number(inv.items.find(i=>i.id==='iron_ore')?.quantity)||0}};
