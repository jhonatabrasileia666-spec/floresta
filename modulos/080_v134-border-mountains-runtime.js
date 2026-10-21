
(async()=>{
  if(window.__V136_BORDER_RUNTIME__)return;window.__V136_BORDER_RUNTIME__=true;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1700;i++){
    if(window.gameReview?.scene&&window.gameReview?.player&&window.__THREE_MODULE&&window.gameInventory&&window.gameHammer&&window.__V134_BORDER_MASK__)break;
    await wait(20);
  }
  const game=window.gameReview,T=window.__THREE_MODULE,inv=window.gameInventory;
  if(!game?.scene||!game?.player||!T||!inv)return;
  const scene=game.scene,player=game.player,mobile=!!window.__FOREST_MOBILE_BUILD__;

  // V134 starts from the V127 world, but the old central mountain runtime is removed at build time.
  // Defensive cleanup in case the page was hot-reloaded from an older build.
  for(const nm of ['V121_IronMountains','V122_IronMountains_Integrated','V128_IronMountains_ArtPass','V129_IronMountains_ArtPass','V130_IronMountains_ArtPass','V131_Clean_Iron_Mountains','V132_MountainPaths','V133_BorderIronMountains']){
    scene.getObjectByName(nm)?.removeFromParent?.();
  }
  ['v122MountainName','v122OreHint','v128MountainName','v128OreHint'].forEach(id=>document.getElementById(id)?.remove());

  const root=new T.Group();root.name='V136_BorderMountains';scene.add(root);
  const skinG=new T.Group(),detailG=new T.Group(),routeG=new T.Group(),bridgeG=new T.Group(),oreG=new T.Group(),mistG=new T.Group(),mineG=new T.Group();
  root.add(skinG,detailG,routeG,bridgeG,oreG,mistG,mineG);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const mask=(x,z)=>window.__V134_BORDER_MASK__(x,z);
  const routeMask=(x,z)=>window.__V134_ROUTE_MASK__(x,z);
  const base=(x,z)=>window.__V134_BASE_GROUND__(x,z);
  const extra=(x,z)=>window.__V134_BORDER_EXTRA__(x,z);
  const ground=(x,z)=>game.groundY(x,z);
  function slope(x,z){const e=.45;return Math.hypot(ground(x+e,z)-ground(x-e,z),ground(x,z+e)-ground(x,z-e))/(e*2)}
  function seeded(seed){let a=seed>>>0;return()=>{a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296}}
  const rnd=seeded(134105),rr=(a,b)=>a+(b-a)*rnd();

  // ---------- BORDER SKIN --------------------------------------------------
  // Same 128x128 grid as the game's own terrain. This keeps the overlay exactly
  // on the world surface: no floating sheets, no vertical brown wall at the seam.
  const N=128,size=180,verts=[],cols=[],indices=[];
  const c=new T.Color(),rock=new T.Color(0x686963),rockHi=new T.Color(0x7c7b73),moss=new T.Color(0x4d5940),dirt=new T.Color(0x70593f),dark=new T.Color(0x4f514d);
  for(let iz=0;iz<=N;iz++){
    const z=-90+size*iz/N;
    for(let ix=0;ix<=N;ix++){
      const x=-90+size*ix/N,y=ground(x,z)+.018,e=mask(x,z),r=routeMask(x,z),sl=slope(x,z);
      verts.push(x,y,z);
      if(e<.01)c.setHex(0x243021);
      else if(r>.42)c.copy(dirt).lerp(rock,.12);
      else if(sl>.90||e>.72)c.copy(rockHi).lerp(dark,clamp((sl-.9)/1.2,0,.45));
      else if(sl>.48)c.copy(rock).lerp(moss,.16);
      else c.copy(moss).lerp(rock,.34);
      const v=clamp(.93+.055*Math.sin(x*.19+z*.13)+.035*Math.cos(x*.47-z*.31),.84,1.06);c.multiplyScalar(v);
      cols.push(c.r,c.g,c.b);
    }
  }
  for(let iz=0;iz<N;iz++)for(let ix=0;ix<N;ix++){
    const cx=-90+size*(ix+.5)/N,cz=-90+size*(iz+.5)/N;
    if(mask(cx,cz)<.005)continue;
    const a=iz*(N+1)+ix,b=a+1,d=(iz+1)*(N+1)+ix,e=d+1;
    indices.push(a,d,b,b,d,e);
  }
  const skinGeo=new T.BufferGeometry();skinGeo.setAttribute('position',new T.Float32BufferAttribute(verts,3));skinGeo.setAttribute('color',new T.Float32BufferAttribute(cols,3));skinGeo.setIndex(indices);skinGeo.computeVertexNormals();
  const skinMat=new T.MeshStandardMaterial({vertexColors:true,roughness:.98,metalness:.015,polygonOffset:true,polygonOffsetFactor:-1,polygonOffsetUnits:-1});
  const skin=new T.Mesh(skinGeo,skinMat);skin.name='V134_BorderMountainSkin';skin.receiveShadow=true;skin.castShadow=false;skinG.add(skin);

  // ---------- ROUTES -------------------------------------------------------
  const corridors=[]; // gameplay-readable routes used by collision gate
  function sideWorld(side,s,along){
    const d=62+s*26;
    if(side==='W')return{x:-d,z:along};
    if(side==='E')return{x:d,z:along};
    if(side==='N')return{x:along,z:d};
    return{x:along,z:-d};
  }
  function routeCenter(side,s){
    if(side==='W')return -28+Math.sin(s*6.0)*8.5;
    if(side==='N')return -38+Math.sin(s*5.3+.4)*8.0;
    if(side==='S')return -15+Math.sin(s*6.6+1.0)*8.0;
    return 12+(s<.36?-8:(s<.65?1:9)); // east / harder line
  }
  function makeRoutePoints(side,start=.03,end=.88,count=22){
    const pts=[];
    for(let i=0;i<=count;i++){
      const s=lerp(start,end,i/count),along=routeCenter(side,s),w=sideWorld(side,s,along);
      pts.push({x:w.x,z:w.z,y:ground(w.x,w.z)+.035,s});
    }
    return pts;
  }
  function addCorridor(points,r){for(let i=0;i<points.length-1;i++){const a=points[i],b=points[i+1],len=Math.hypot(b.x-a.x,b.z-a.z),n=Math.max(1,Math.ceil(len/.9));for(let k=0;k<=n;k++){const t=k/n;corridors.push({x:lerp(a.x,b.x,t),z:lerp(a.z,b.z,t),r})}}}
  function nearCorridor(x,z){for(const p of corridors){const dx=x-p.x,dz=z-p.z;if(dx*dx+dz*dz<=p.r*p.r)return true}return false}
  function makeRibbon(points,width,mat){
    const pos=[],idx=[];
    for(let i=0;i<points.length;i++){
      const p=points[i],a=points[Math.max(0,i-1)],b=points[Math.min(points.length-1,i+1)],dx=b.x-a.x,dz=b.z-a.z,L=Math.hypot(dx,dz)||1,nx=-dz/L,nz=dx/L,w=width*(.92+.08*Math.sin(i*.75));
      pos.push(p.x+nx*w*.5,p.y,p.z+nz*w*.5,p.x-nx*w*.5,p.y,p.z-nz*w*.5);
      if(i<points.length-1){const j=i*2;idx.push(j,j+2,j+1,j+1,j+2,j+3)}
    }
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();
    const m=new T.Mesh(g,mat);m.receiveShadow=true;m.castShadow=false;routeG.add(m);return m;
  }
  const trailMat=new T.MeshStandardMaterial({color:0x6b563d,roughness:1,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2});
  const stoneMat=new T.MeshStandardMaterial({color:0x6a6962,roughness:.98,flatShading:true});
  const woodMat=new T.MeshStandardMaterial({color:0x5d4026,roughness:.98});
  const routeDefs=[
    {side:'W',name:'Trilha Oeste',width:3.6,kind:'easy'},
    {side:'N',name:'Escadaria Norte',width:3.0,kind:'trail'},
    {side:'S',name:'Subida Sul',width:2.85,kind:'mixed'},
    {side:'E',name:'Escalada Leste',width:2.15,kind:'hard'}
  ];
  const routeTops={};
  for(const def of routeDefs){
    const pts=makeRoutePoints(def.side,.035,.88,def.kind==='hard'?26:22);addCorridor(pts,def.width*.62);makeRibbon(pts,def.width,trailMat);
    // Low, ground-hugging markers: readable without creating floating stairs.
    for(let i=2;i<pts.length-2;i+=(def.kind==='hard'?2:3)){
      const p=pts[i],prev=pts[i-1],next=pts[i+1],yaw=Math.atan2(next.x-prev.x,next.z-prev.z),mesh=new T.Mesh(new T.BoxGeometry(def.width*.72,.11,.52),def.kind==='mixed'&&i>pts.length*.58?woodMat:stoneMat);
      mesh.position.set(p.x,p.y-.035,p.z);mesh.rotation.y=yaw;mesh.castShadow=!mobile;mesh.receiveShadow=true;routeG.add(mesh);
    }
    const top=pts[pts.length-1];routeTops[def.side]={x:top.x,z:top.z,y:ground(top.x,top.z)+.10};
  }

  // ---------- HIGH PLATEAUS / PARKOUR -------------------------------------
  const platforms=[];let supportNow=false,supportLast=false,leftSupport=false;
  function inside(p,x,z){const dx=x-p.x,dz=z-p.z,c=Math.cos(p.yaw||0),s=Math.sin(p.yaw||0);return Math.abs(c*dx-s*dz)<=p.hx&&Math.abs(s*dx+c*dz)<=p.hz}
  function addPlatform(x,z,top,hx,hz,yaw=0,kind='stone',draw=true){
    const p={x,z,top,hx,hz,yaw,kind};platforms.push(p);
    if(draw){const h=kind==='wood'?.14:.22,m=new T.Mesh(new T.BoxGeometry(hx*2,h,hz*2),kind==='wood'?woodMat:stoneMat);m.position.set(x,top-h/2,z);m.rotation.y=yaw;m.castShadow=!mobile;m.receiveShadow=true;routeG.add(m)}
    return p;
  }
  function addTopPad(side,rx=2.5,rz=1.9){
    const p=routeTops[side],top=ground(p.x,p.z)+.12;addPlatform(p.x,p.z,top,rx,rz,0,'stone',true);corridors.push({x:p.x,z:p.z,r:Math.max(rx,rz)+.6});p.y=top;return p;
  }
  const topW=addTopPad('W',2.7,2.1),topN=addTopPad('N',2.5,2.0),topS=addTopPad('S',2.6,2.0),topE=addTopPad('E',2.25,1.8);


  // ---------- MINE ENTRANCE ----------------------------------------------
  const mineRockMat=new T.MeshStandardMaterial({color:0x69675e,roughness:1,flatShading:true});
  const mineDarkMat=new T.MeshStandardMaterial({color:0x0f0c0a,roughness:1});
  const mineBeamMat=new T.MeshStandardMaterial({color:0x5b3c24,roughness:.98});
  const mineMetalMat=new T.MeshStandardMaterial({color:0x45433f,roughness:.8,metalness:.15});
  function addMineEntrance(side='W',s=.42,offset=1.1){
    const along=routeCenter(side,s)+offset;
    const pos=sideWorld(side,s,along);
    const yaw=side==='W'?Math.PI/2:side==='E'?-Math.PI/2:side==='N'?Math.PI:0;
    const baseY=ground(pos.x,pos.z)+.08;

    // Approach pad / readable place to stand.
    addPlatform(pos.x,pos.z,baseY,2.35,1.65,yaw,'wood',true);
    corridors.push({x:pos.x,z:pos.z,r:3.0});

    const g=new T.Group();
    g.position.set(pos.x,baseY-.02,pos.z);
    g.rotation.y=yaw;
    mineG.add(g);

    const cut=new T.Mesh(new T.BoxGeometry(3.5,3.8,5.8),mineDarkMat);
    cut.position.set(0,1.62,-1.7);
    cut.castShadow=!1;
    cut.receiveShadow=true;
    g.add(cut);

    const backDark=new T.Mesh(new T.BoxGeometry(2.6,2.8,2.8),mineDarkMat);
    backDark.position.set(0,1.35,-3.75);
    backDark.receiveShadow=true;
    g.add(backDark);

    const archGeo=new T.CylinderGeometry(1.7,1.7,.72,7,1,false,0,Math.PI);
    const arch=new T.Mesh(archGeo,mineRockMat);
    arch.rotation.z=Math.PI/2;
    arch.position.set(0,2.55,.28);
    arch.castShadow=!mobile;
    arch.receiveShadow=true;
    g.add(arch);

    const sideL=new T.Mesh(new T.BoxGeometry(.72,2.6,1.1),mineRockMat);
    const sideR=sideL.clone();
    sideL.position.set(-1.82,1.25,.18);
    sideR.position.set( 1.82,1.25,.18);
    sideL.castShadow=sideR.castShadow=!mobile;
    sideL.receiveShadow=sideR.receiveShadow=true;
    g.add(sideL,sideR);

    const topCap=new T.Mesh(new T.BoxGeometry(4.1,.45,1.12),mineRockMat);
    topCap.position.set(0,3.35,.22);
    topCap.castShadow=!mobile;
    topCap.receiveShadow=true;
    g.add(topCap);

    // Timber supports.
    for(const sx of [-1.18,1.18]){
      const post=new T.Mesh(new T.BoxGeometry(.25,2.85,.25),mineBeamMat);
      post.position.set(sx,1.38,.62);
      post.castShadow=!mobile;
      post.receiveShadow=true;
      g.add(post);
    }
    const beam=new T.Mesh(new T.BoxGeometry(2.9,.24,.28),mineBeamMat);
    beam.position.set(0,2.72,.62);
    beam.castShadow=!mobile;
    beam.receiveShadow=true;
    g.add(beam);

    const porch=new T.Mesh(new T.BoxGeometry(3.7,.18,2.6),mineBeamMat);
    porch.position.set(0,.07,1.0);
    porch.castShadow=!mobile;
    porch.receiveShadow=true;
    g.add(porch);

    for(const sx of [-1.32,1.32]){
      const rail=new T.Mesh(new T.BoxGeometry(.14,.75,.14),mineBeamMat);
      rail.position.set(sx,.42,1.8);
      rail.castShadow=!mobile;
      rail.receiveShadow=true;
      g.add(rail);
    }
    const step1=new T.Mesh(new T.BoxGeometry(2.85,.12,.58),mineBeamMat);
    const step2=new T.Mesh(new T.BoxGeometry(3.15,.12,.62),mineBeamMat);
    step1.position.set(0,.02,2.2);
    step2.position.set(0,-.06,2.74);
    step1.receiveShadow=step2.receiveShadow=true;
    g.add(step1,step2);

    // A couple of mine tracks disappearing into the dark.
    for(const sx of [-.42,.42]){
      const rail=new T.Mesh(new T.BoxGeometry(.08,.07,4.2),mineMetalMat);
      rail.position.set(sx,.06,-.65);
      rail.receiveShadow=true;
      g.add(rail);
    }
    for(let i=0;i<8;i++){
      const sleeper=new T.Mesh(new T.BoxGeometry(1.1,.05,.12),mineBeamMat);
      sleeper.position.set(0,.02,1.45-i*.58);
      sleeper.receiveShadow=true;
      g.add(sleeper);
    }

    // Lanterns / warm readability.
    const lanternMat=new T.MeshStandardMaterial({color:0xd49743,emissive:0xc57c24,emissiveIntensity:1.0,roughness:.55,metalness:.05});
    for(const sx of [-1.02,1.02]){
      const hook=new T.Mesh(new T.BoxGeometry(.05,.35,.05),mineMetalMat);
      hook.position.set(sx,2.32,.76);
      g.add(hook);
      const lamp=new T.Mesh(new T.BoxGeometry(.16,.22,.16),lanternMat);
      lamp.position.set(sx,2.03,.78);
      lamp.castShadow=!1;
      g.add(lamp);
      const light=new T.PointLight(0xffb55f,mobile?0.55:0.9,mobile?4.8:6.2,2.0);
      light.position.set(sx,2.0,.78);
      g.add(light);
    }

    // Blend the mine with some side rocks and sparse vegetation.
    for(let i=0;i<7;i++){
      const rock=new T.Mesh(new T.DodecahedronGeometry(.45+.12*(i%3),0),mineRockMat);
      rock.position.set(-2.2+((i*0.73)%4.4),.18+(i%2)*.06,.9+((i*0.41)%1.2));
      rock.rotation.set(i*.33,i*.71,i*.21);
      rock.castShadow=!mobile;
      rock.receiveShadow=true;
      g.add(rock);
    }
    for(let i=0;i<5;i++){
      const shrub=new T.Mesh(new T.ConeGeometry(.28+i*.01,.5+((i%2)*.08),5),new T.MeshStandardMaterial({color:i%2?0x3e4f2f:0x50653b,roughness:1,flatShading:true}));
      shrub.position.set(-2.5+i*1.25,.24,1.8+(i%2)*.24);
      shrub.castShadow=!mobile;
      shrub.receiveShadow=true;
      g.add(shrub);
    }
    return {x:pos.x,z:pos.z,y:baseY};
  }
  const mineEntrance=addMineEntrance('W',.42,1.1);

  // Physical stepping pads so every authored ascent is actually climbable.
  const climbSupportDefs=[
    {side:'W',start:.05,end:.88,count:20,hx:1.55,hz:.72,kind:'stone',lift:.14,jump:1},
    {side:'N',start:.05,end:.88,count:21,hx:1.42,hz:.70,kind:'stone',lift:.14,jump:1},
    {side:'S',start:.05,end:.88,count:20,hx:1.38,hz:.70,kind:'stone',lift:.14,jump:1},
    {side:'E',start:.08,end:.86,count:18,hx:1.10,hz:.62,kind:'stone',lift:.16,jump:1}
  ];
  for(const cfg of climbSupportDefs){
    const pts=makeRoutePoints(cfg.side,cfg.start,cfg.end,cfg.count);
    for(let i=1;i<pts.length-1;i+=cfg.jump){
      const p=pts[i],prev=pts[Math.max(0,i-1)],next=pts[Math.min(pts.length-1,i+1)],yaw=Math.atan2(next.x-prev.x,next.z-prev.z),top=ground(p.x,p.z)+cfg.lift;
      addPlatform(p.x,p.z,top,cfg.hx,cfg.hz,yaw,cfg.kind,true);
      corridors.push({x:p.x,z:p.z,r:Math.max(cfg.hx,cfg.hz)+.7});
    }
  }

  // East is the hard route: the terrain line is narrow, with readable stone jumps near the summit.
  const eastPts=makeRoutePoints('E',.56,.91,9);addCorridor(eastPts,1.05);
  for(let i=0;i<eastPts.length;i++){
    const p=eastPts[i],lift=i*.22,top=ground(p.x,p.z)+.16+lift;
    addPlatform(p.x,p.z,top,.78,.68,(i%2)*.18,'stone',true);
  }

  // ---------- NORTH BRIDGE -------------------------------------------------
  // A real missing-plank bridge over a lowered notch in the north ridge.
  const bridgeA=sideWorld('N',.86,-31),bridgeB=sideWorld('N',.86,-6);
  bridgeA.y=ground(bridgeA.x,bridgeA.z)+.22;bridgeB.y=ground(bridgeB.x,bridgeB.z)+.22;
  addPlatform(bridgeA.x,bridgeA.z,bridgeA.y,2.0,1.5,0,'stone',true);addPlatform(bridgeB.x,bridgeB.z,bridgeB.y,2.0,1.5,0,'stone',true);
  corridors.push({x:bridgeA.x,z:bridgeA.z,r:2.4},{x:bridgeB.x,z:bridgeB.z,r:2.4});
  // Connect the northern climb to the bridge entrance across the high ridge.
  const ridgeLink=[topN,{x:(topN.x+bridgeA.x)/2,z:(topN.z+bridgeA.z)/2,y:ground((topN.x+bridgeA.x)/2,(topN.z+bridgeA.z)/2)+.035},bridgeA];
  addCorridor(ridgeLink,1.45);makeRibbon(ridgeLink,2.25,trailMat);
  const bridge={};
  {
    const ax=bridgeA.x,az=bridgeA.z,bx=bridgeB.x,bz=bridgeB.z,dx=bx-ax,dz=bz-az,len=Math.hypot(dx,dz),ux=dx/len,uz=dz/len,nx=-uz,nz=ux,count=Math.max(14,Math.floor(len/.78)),yaw=Math.atan2(ux,uz),gap=Math.floor(count*.50),slots=[];
    const im=new T.InstancedMesh(new T.BoxGeometry(1,.13,.30),woodMat,count);im.castShadow=!mobile;im.receiveShadow=true;bridgeG.add(im);
    for(let i=0;i<count;i++){
      const u=(i+.5)/count,x=ax+dx*u,z=az+dz*u,miss=i===gap||i===gap+1,y=lerp(bridgeA.y,bridgeB.y,u)-1.15*4*u*(1-u);slots.push({u,x,z,y,miss});
      if(!miss)addPlatform(x,z,y+.07,.58,.35,yaw,'wood',false);
      corridors.push({x,z,r:1.1});
    }
    Object.assign(bridge,{ax,az,bx,bz,dx,dz,len,ux,uz,nx,nz,count,yaw,gap,slots,im,pres:0});
  }
  function updateBridge(t,dt){
    const br=bridge,px=player.x-br.ax,pz=player.z-br.az,along=(px*br.ux+pz*br.uz)/br.len,side=Math.abs(px*br.nx+pz*br.nz);br.pres+=((along>0&&along<1&&side<1.7?1:0)-br.pres)*Math.min(1,dt*3);const sway=.08*br.pres;
    for(let i=0;i<br.count;i++){
      const s=br.slots[i],u=s.u,y=lerp(bridgeA.y,bridgeB.y,u)-1.15*4*u*(1-u)+sway*Math.sin(t*2.0-i*.35)*Math.sin(Math.PI*u);s.y=y;
      const M=new T.Matrix4(),Q=new T.Quaternion(),P=new T.Vector3(s.x,y,s.z),S=new T.Vector3(s.miss?0:1.45,s.miss?0:.13,s.miss?0:.27);Q.setFromEuler(new T.Euler(0,br.yaw,sway*.07*Math.sin(t*1.7+i*.21),'YXZ'));M.compose(P,Q,S);br.im.setMatrixAt(i,M);
    }
    br.im.instanceMatrix.needsUpdate=true;
  }

  // ---------- BOULDERS -----------------------------------------------------
  function rgeo(seed){const g=new T.DodecahedronGeometry(1,1),p=g.attributes.position;for(let i=0;i<p.count;i++){const f=1+.08*Math.sin(i*1.17+seed)+.05*Math.cos(i*.63+seed*1.9);p.setXYZ(i,p.getX(i)*f,p.getY(i)*(.84+.12*Math.sin(i*.47+seed)),p.getZ(i)*(1+.06*Math.cos(i*.71+seed)))}g.computeVertexNormals();return g}
  const bGeo=[rgeo(.9),rgeo(2.6)],bMat=[new T.MeshStandardMaterial({color:0x62625d,roughness:1,flatShading:true}),new T.MeshStandardMaterial({color:0x535651,roughness:1,flatShading:true})];
  let made=0;
  for(let tries=0;tries<900&&made<(mobile?34:60);tries++){
    const side=['N','S','E','W'][Math.floor(rnd()*4)],s=.18+rnd()*.75,along=-72+rnd()*144,w=side==='N'?{x:along,z:62+s*26}:side==='S'?{x:along,z:-(62+s*26)}:side==='E'?{x:62+s*26,z:along}:{x:-(62+s*26),z:along};
    if(mask(w.x,w.z)<.08||nearCorridor(w.x,w.z))continue;const sc=.6+rnd()*1.25,m=new T.Mesh(bGeo[made%2],bMat[made%2]);m.position.set(w.x,ground(w.x,w.z)-sc*.36,w.z);m.scale.set(sc*(.85+rnd()*.5),sc*(.55+rnd()*.35),sc*(.8+rnd()*.35));m.rotation.set((rnd()-.5)*.4,rnd()*Math.PI*2,(rnd()-.5)*.35);m.castShadow=!mobile;m.receiveShadow=true;detailG.add(m);made++;
  }

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

  // ---------- NAVIGATION ---------------------------------------------------
  function heightAt(x,z,bY,cY,grounded,vy){supportLast=supportNow;supportNow=false;leftSupport=false;let best=bY;for(const p of platforms){if(!inside(p,x,z))continue;const top=p.kind==='wood'&&bridge.slots?(()=>{let nearest=null,bd=99;for(const s of bridge.slots){const d=Math.hypot(s.x-p.x,s.z-p.z);if(d<bd){bd=d;nearest=s}}return nearest?.y+.07??p.top})():p.top;const step=top<=cY+.70&&top>=cY-1.05,land=!grounded&&vy<=.9&&cY>=top-.20&&cY-top<2.5,on=Math.abs(cY-top)<.42;if((step||land||on)&&top>best){best=top;supportNow=true}}
    if(supportLast&&!supportNow&&cY-bY>.55)leftSupport=true;return best}
  function blockMove(ox,oz,nx,nz,cY,grounded){
    // V190: o laboratorio criativo esta fora dos limites naturais da floresta.
    if(window.gameTestMode?.active)return false;
    if(Math.max(Math.abs(nx),Math.abs(nz))>88.4)return true;
    const ne=extra(nx,nz),oe=extra(ox,oz);if(ne<1.0)return false;
    if(nearCorridor(nx,nz))return false;
    // You can always retreat downhill/inward, but cannot walk straight up a cliff face.
    if(ne<=oe+.045)return false;
    return true;
  }
  window.gameBorderMountains={version:'V136B',root,platforms,corridors,nodes,heightAt,blockMove,consumeLeftSupport(){const v=leftSupport;leftSupport=false;return v},nearRoute:nearCorridor};

  // Clear old colliders from the authored routes, so a random base rock cannot make a valid path impossible.
  if(Array.isArray(game.colliders))for(let i=game.colliders.length-1;i>=0;i--){const q=game.colliders[i];if(Number.isFinite(q?.x)&&Number.isFinite(q?.z)&&nearCorridor(q.x,q.z))game.colliders.splice(i,1)}

  // ---------- UI / ATMOSPHERE ---------------------------------------------
  const label=document.createElement('div');label.id='v135BorderLabel';label.style.cssText='position:fixed;left:50%;top:78px;transform:translateX(-50%);z-index:22;padding:7px 11px;border-radius:999px;background:rgba(14,16,15,.68);border:1px solid rgba(230,230,220,.18);color:#eee;font:700 10px system-ui;letter-spacing:.11em;pointer-events:none;opacity:0;transition:opacity .2s';label.textContent='MONTANHAS DA BORDA • FERRO NAS ALTURAS';document.body.appendChild(label);
  const fogSprites=[];const cv=document.createElement('canvas');cv.width=cv.height=64;const ctx=cv.getContext('2d'),gr=ctx.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'rgba(220,225,225,.20)');gr.addColorStop(1,'rgba(220,225,225,0)');ctx.fillStyle=gr;ctx.fillRect(0,0,64,64);const tex=new T.CanvasTexture(cv);
  for(let i=0;i<(mobile?8:14);i++){const side=['N','S','E','W'][i%4],s=.70+rnd()*.22,along=-60+rnd()*120,w=side==='N'?{x:along,z:62+s*26}:side==='S'?{x:along,z:-(62+s*26)}:side==='E'?{x:62+s*26,z:along}:{x:-(62+s*26),z:along},sp=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:.16}));sp.position.set(w.x,ground(w.x,w.z)+2+rnd()*4,w.z);const sc=8+rnd()*10;sp.scale.set(sc,sc*.5,1);mistG.add(sp);fogSprites.push(sp)}

  let last=performance.now(),t=0,ui=0;(function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;t+=dt;root.visible=!window.gameTestMode?.active;if(root.visible)updateBridge(t,dt);ui-=dt;if(ui<=0){ui=.15;const e=mask(player.x,player.z);label.style.opacity=e>.025?'1':'0'}})(last);
  window.gameIronMountains={version:'V216',nodes,strikePickaxe(){if(window.gameRightHand?.current!=='pickaxe'||window.gameCraft?.active||window.gameInventory?.isOpen)return false;const n=oreTarget();return n?hit(n):false},get aliveNodes(){return nodes.filter(n=>n.alive).length},get iron(){return Number(inv.items.find(i=>i.id==='iron_ore')?.quantity)||0}};
  console.info('[V136B] montanhas como borda natural integradas no groundY',{ore:nodes.length,mobile});
})();
