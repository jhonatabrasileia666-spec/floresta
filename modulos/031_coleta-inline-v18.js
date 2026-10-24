
(async()=>{
try{


const THREE = window.__THREE_MODULE;

const prompt = document.getElementById("pickupPrompt");
const promptText = document.getElementById("pickupPromptText");
const pickupBtn = document.getElementById("pickupBtn");
const resourceStatus = document.getElementById("resourceStatus");

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function waitForGame() {
  for (let i=0;i<900;i++) {
    const g = window.gameReview;
    if (g?.scene && g?.player && g?.groundY && window.gameInventory) return g;
    await sleep(20);
  }
  throw new Error("Jogo/inventário não ficaram disponíveis.");
}

function seeded(seed=948217) {
  let s=seed>>>0;
  return () => ((s=(s*1664525+1013904223)>>>0)/4294967296);
}
const rnd = seeded();

function makeRockMaterial() {
  const colors=[0x777b73,0x8a8c82,0x666b65,0x9a978b];
  return new THREE.MeshStandardMaterial({
    color:colors[Math.floor(rnd()*colors.length)],
    roughness:1,
    metalness:0,
    flatShading:true
  });
}

function makeBranchMaterial() {
  const colors=[0x9a6540,0x845331,0x744529,0xa8734a];
  const m=new THREE.MeshStandardMaterial({
    color:colors[Math.floor(rnd()*colors.length)],
    roughness:1,
    metalness:0,
    flatShading:true,
    emissive:0x120904,
    emissiveIntensity:.12
  });
  return m;
}

function createRock() {
  const root=new THREE.Group();
  root.userData.collectible={
    id:"rock",name:"Pedra",type:"Recurso",quantity:1,weight:.6,
    description:"Pedra encontrada no chão da floresta. Útil para construção, ferramentas e futuras receitas."
  };

  const r=.18+rnd()*.14;
  const mesh=new THREE.Mesh(new THREE.DodecahedronGeometry(r,1),makeRockMaterial());
  mesh.scale.set(.9+rnd()*.48,.58+rnd()*.40,.85+rnd()*.5);
  mesh.rotation.set(rnd()*2.2,rnd()*Math.PI,rnd()*2.2);
  mesh.castShadow=true;mesh.receiveShadow=true;mesh.userData.pickupRoot=root;
  root.add(mesh);

  if(rnd()>.48){
    const chip=new THREE.Mesh(new THREE.DodecahedronGeometry(r*.38,0),makeRockMaterial());
    chip.position.set(r*.62,-r*.1,r*.18);
    chip.rotation.set(rnd()*2,rnd()*2,rnd()*2);
    chip.castShadow=true;chip.receiveShadow=true;chip.userData.pickupRoot=root;
    root.add(chip);
  }
  return root;
}

function cylinderBetween(a,b,r,mat) {
  const d=b.clone().sub(a),len=d.length(),mid=a.clone().add(b).multiplyScalar(.5);
  const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.78,len,8,2),mat);
  mesh.position.copy(mid);
  mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
  mesh.castShadow=true;mesh.receiveShadow=true;
  return mesh;
}

function createBranch() {
  const root=new THREE.Group();
  root.userData.collectible={
    id:"branch",name:"Galho",type:"Recurso",quantity:1,weight:.3,
    description:"Galho seco recolhido da floresta. Pode servir como combustível ou material de construção."
  };

  const mat=makeBranchMaterial();
  const len=.88+rnd()*.48;
  const thickness=.038+rnd()*.018;

  const a=new THREE.Vector3(-len*.5,.018,0);
  const b=new THREE.Vector3(len*.5,.03,(rnd()-.5)*.08);
  const main=cylinderBetween(a,b,thickness,mat);
  main.userData.pickupRoot=root;
  root.add(main);

  const twigs=2+Math.floor(rnd()*3);
  for(let i=0;i<twigs;i++){
    const t=.18+rnd()*.64;
    const x=-len*.5+len*t;
    const base=new THREE.Vector3(x,.03,(rnd()-.5)*.03);
    const side=rnd()>.5?1:-1;
    const end=new THREE.Vector3(
      x+side*(.18+rnd()*.22),
      .08+rnd()*.09,
      (rnd()-.5)*.32
    );
    const twig=cylinderBetween(base,end,thickness*(.42+rnd()*.18),mat);
    twig.userData.pickupRoot=root;
    root.add(twig);
  }

  // Broken pale ends make the branch readable at night without making it glow.
  const endMat=new THREE.MeshStandardMaterial({color:0xc09368,roughness:1,flatShading:true});
  for(const x of [-len*.5,len*.5]){
    const cap=new THREE.Mesh(new THREE.CylinderGeometry(thickness*.78,thickness*.78,.016,8),endMat);
    cap.position.set(x,.025,0);
    cap.rotation.z=Math.PI/2;
    cap.userData.pickupRoot=root;
    root.add(cap);
  }

  root.rotation.y=rnd()*Math.PI*2;
  root.rotation.z=(rnd()-.5)*.07;
  return root;
}

function makeVineMaterial() {
  return new THREE.MeshStandardMaterial({
    color:0x52693a,
    roughness:1,
    metalness:0,
    flatShading:true,
    emissive:0x0b1207,
    emissiveIntensity:.12
  });
}

function createVineBundle(quantity=1) {
  const root=new THREE.Group();

  root.userData.collectible={
    id:"vine",
    name:"Cipó",
    type:"Fibra natural",
    quantity:Math.max(
      1,
      Number(quantity)||1
    ),
    weight:.18,
    description:
      "Cipó resistente retirado de uma árvore. " +
      "Pode servir como fibra, amarração e material para futuras receitas."
  };

  const mat=makeVineMaterial();
  const dark=mat.clone();
  dark.color.setHex(0x34472b);

  for(let i=0;i<3;i++){
    const torus=new THREE.Mesh(
      new THREE.TorusGeometry(
        .20+i*.025,
        .018,
        5,
        18
      ),
      i===1?dark:mat
    );

    torus.rotation.set(
      Math.PI/2+(rnd()-.5)*.16,
      rnd()*Math.PI,
      (rnd()-.5)*.20
    );

    torus.position.set(
      (rnd()-.5)*.07,
      .03+i*.012,
      (rnd()-.5)*.07
    );

    torus.castShadow=true;
    torus.receiveShadow=true;
    torus.userData.pickupRoot=root;
    root.add(torus);
  }

  const loose=cylinderBetween(
    new THREE.Vector3(.12,.03,.02),
    new THREE.Vector3(.38,.055,.14),
    .018,
    mat.clone()
  );

  loose.userData.pickupRoot=root;
  root.add(loose);

  root.rotation.y=rnd()*Math.PI*2;
  return root;
}

function createWoodChipBundle(quantity=1) {
  const root=new THREE.Group();

  root.userData.collectible={
    id:"wood_chip",
    name:"Lasca de madeira",
    type:"Material de fogo",
    quantity:Math.max(
      1,
      Number(quantity)||1
    ),
    weight:.05,
    description:
      "Lasca fina retirada de um tronco com o machado. " +
      "É seca, pega fogo rápido e pode servir como isca para iniciar uma fogueira."
  };

  const pale=
    new THREE.MeshStandardMaterial({
      color:0xc8945f,
      roughness:1,
      metalness:0,
      flatShading:true,
      emissive:0x160b04,
      emissiveIntensity:.08
    });

  const dark=pale.clone();
  dark.color.setHex(0x956036);

  const count=
    Math.max(
      2,
      Math.min(
        5,
        1+
        Math.ceil(
          root.userData.collectible.quantity*.7
        )
      )
    );

  for(let i=0;i<count;i++){
    const len=.22+rnd()*.19;
    const width=.035+rnd()*.035;
    const thick=.012+rnd()*.012;

    const chip=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          width,
          thick,
          len
        ),
        i%3===0
          ?dark
          :pale
      );

    chip.position.set(
      (rnd()-.5)*.22,
      .025+i*.008,
      (rnd()-.5)*.18
    );

    chip.rotation.set(
      (rnd()-.5)*.22,
      rnd()*Math.PI,
      (rnd()-.5)*.70
    );

    chip.castShadow=true;
    chip.receiveShadow=true;
    chip.userData.pickupRoot=root;

    root.add(chip);
  }

  root.rotation.y=
    rnd()*
    Math.PI*2;

  return root;
}


function createWoodShieldPickup() {
  const root=new THREE.Group();

  root.userData.collectible={
    id:"wood_shield",
    name:"Escudo de madeira",
    type:"Defesa",
    quantity:1,
    weight:2.4,
    description:
      "Escudo artesanal modelado com cinco lascas de madeira. " +
      "Equipe na mão esquerda e segure o botão direito para defender."
  };

  const wood=
    new THREE.MeshStandardMaterial({
      color:0xa96f3d,
      roughness:1,
      metalness:0,
      flatShading:true
    });

  const edge=
    wood.clone();

  edge.color.setHex(
    0x74451f
  );

  const lengths=[
    .56,.70,.80,.70,.56
  ];

  for(let i=0;i<5;i++){
    const plank=
      new THREE.Mesh(
        new THREE.BoxGeometry(
          .12,
          lengths[i],
          .035
        ),
        i%2
          ?wood
          :edge
      );

    plank.position.set(
      (i-2)*.115,
      (
        lengths[i]-
        .80
      )*.12,
      0
    );

    plank.rotation.z=
      (i-2)*.025;

    plank.castShadow=true;
    plank.receiveShadow=true;
    plank.userData.pickupRoot=root;

    root.add(plank);
  }

  const brace=
    new THREE.Mesh(
      new THREE.BoxGeometry(
        .62,.075,.05
      ),
      edge
    );

  brace.position.set(
    0,.02,.028
  );

  brace.castShadow=true;
  brace.receiveShadow=true;
  brace.userData.pickupRoot=root;
  root.add(brace);

  const boss=
    new THREE.Mesh(
      new THREE.CylinderGeometry(
        .055,.055,.065,10
      ),
      edge
    );

  boss.rotation.x=
    Math.PI/2;

  boss.position.set(
    0,.02,.065
  );

  boss.userData.pickupRoot=root;
  root.add(boss);

  // The pickup rests on the ground.
  root.rotation.x=
    -Math.PI/2;

  root.rotation.z=
    (rnd()-.5)*.15;

  root.scale.setScalar(.90);

  return root;
}

try {
  const game=await waitForGame();
  const scene=game.scene,player=game.player,groundY=game.groundY;

  const collectRoot=new THREE.Group();
  collectRoot.name="CollectibleForestResources";
  scene.add(collectRoot);

  const collectibles=[];
  const meshes=[];

  function place(root,x,z,yOffset) {
    root.position.set(x,groundY(x,z)+yOffset,z);
    // Stable resource ID on both devices, independent of array order.
    const item=root.userData?.collectible;
    if(item&&!root.userData.duoKey)root.userData.duoKey=[item.id,Math.round(x*100),Math.round(z*100)].join(':');
    root.traverse(o=>{if(o.isMesh)meshes.push(o)});
    collectRoot.add(root);
    collectibles.push(root);
    return root;
  }

  function spawnVine(x,z,quantity=1) {
    const root=
      createVineBundle(quantity);

    place(root,x,z,.075);

    if(resourceStatus){
      resourceStatus.textContent=
        "Cipó caiu da árvore • aproxime-se e pressione Q";
    }

    return root;
  }

  function spawnWoodChip(x,z,quantity=1) {
    const root=
      createWoodChipBundle(quantity);

    place(
      root,
      x,
      z,
      .035
    );

    if(resourceStatus){
      resourceStatus.textContent=
        "Lasca de madeira no chão • aproxime-se e pressione Q";
    }

    return root;
  }

  function spawnWoodShield(x,z) {
    const root=
      createWoodShieldPickup();

    place(
      root,
      x,
      z,
      .045
    );

    if(resourceStatus){
      resourceStatus.textContent=
        "Escudo de madeira pronto • aproxime-se e pressione Q";
    }

    return root;
  }

  window.addEventListener(
    "game:wood-chip-dropped",
    e=>{
      const d=e.detail||{};

      if(
        !Number.isFinite(d.x) ||
        !Number.isFinite(d.z)
      )return;

      spawnWoodChip(
        d.x,
        d.z,
        d.quantity||1
      );
    }
  );

  window.addEventListener(
    "game:vines-dropped",
    e=>{
      const d=e.detail||{};

      if(
        !Number.isFinite(d.x) ||
        !Number.isFinite(d.z)
      ) return;

      spawnVine(
        d.x,
        d.z,
        d.quantity||1
      );
    }
  );

  // Clearly visible test resources around the initial clearing.
  // Camera at yaw 0 looks roughly toward -Z, so several are placed in front.
  const px=player.x,pz=player.z;
  const starters=[
    ["branch", px+.55, pz-1.45],
    ["rock",   px-.55, pz-1.70],
    ["branch", px-1.05,pz-2.05],
    ["rock",   px+1.15,pz-2.20],
    ["branch", px-1.75,pz-3.20],
    ["rock",   px+1.95,pz-3.75],
    ["branch", px+2.65,pz-4.20],
    ["rock",   px-2.80,pz-4.55],
    ["branch", px+.20, pz-5.15],
    ["rock",   px+3.25,pz-5.40]
  ];

  for(const [kind,x,z] of starters){
    place(kind==="rock"?createRock():createBranch(),x,z,kind==="rock"?.13:.085);
  }

  function validScatter(x,z){
    const d=Math.hypot(x-px,z-pz);
    if(d<6 || d>43)return false;
    if(Math.hypot(x+2.7,z-1.25)<2.1)return false;
    return true;
  }

  let rocks=0,branches=0,attempts=0;
  while((rocks<24||branches<32)&&attempts<1800){
    attempts++;
    const ang=rnd()*Math.PI*2,rad=7+rnd()*35;
    const x=px+Math.cos(ang)*rad,z=pz+Math.sin(ang)*rad;
    if(!validScatter(x,z))continue;
    if(branches<32 && (rocks>=24||rnd()<.57)){
      place(createBranch(),x,z,.07+rnd()*.035);branches++;
    }else if(rocks<24){
      place(createRock(),x,z,.11+rnd()*.05);rocks++;
    }
  }

  const worldPos=new THREE.Vector3();
  let candidate=null,lastCandidate=null;

  function validRoot(root){
    return !!root && root.parent===collectRoot && !!root.userData?.collectible;
  }

  // Robust interaction: no precise crosshair hit required.
  // If an item is within arm's reach, Q picks the nearest one.
  function findCandidate(){
    if(window.gameInventory?.isOpen)return null;
    let best=null,bestD=Infinity;
    for(const root of collectibles){
      if(!validRoot(root))continue;
      root.getWorldPosition(worldPos);
      const dx=worldPos.x-player.x,dz=worldPos.z-player.z;
      const horizontal=Math.hypot(dx,dz);
      if(horizontal>3.0)continue;
      const dy=Math.abs(worldPos.y-(groundY(player.x,player.z)+.5));
      const score=horizontal+dy*.12;
      if(score<bestD){bestD=score;best=root;}
    }
    return best;
  }

  function setHighlight(root,on){
    if(!root)return;
    root.traverse(o=>{
      if(!o.isMesh||!o.material?.emissive)return;
      if(!o.userData.baseEmissive){
        o.userData.baseEmissive=o.material.emissive.clone();
        o.userData.baseIntensity=o.material.emissiveIntensity??1;
      }
      if(on){
        const id=root.userData.collectible.id;
        o.material.emissive.setHex(
          id==="branch"    ? 0x4a260c :
          id==="vine"      ? 0x29441d :
          id==="wood_chip" ? 0x5e3218 :
                             0x303326
        );
        o.material.emissiveIntensity=.55;
      }else{
        o.material.emissive.copy(o.userData.baseEmissive);
        o.material.emissiveIntensity=o.userData.baseIntensity;
      }
    });
  }

  function updatePrompt(){
    candidate=findCandidate();
    if(candidate!==lastCandidate){
      setHighlight(lastCandidate,false);
      setHighlight(candidate,true);
      lastCandidate=candidate;
    }
    if(candidate){
      const item=candidate.userData.collectible;
      prompt?.classList.add("visible");
      prompt?.setAttribute("aria-hidden","false");
      if(promptText)promptText.textContent=`Pegar ${item.name}`;
      pickupBtn?.classList.add("ready");
      if(pickupBtn)pickupBtn.textContent=`Pegar ${item.name}`;
    }else{
      prompt?.classList.remove("visible");
      prompt?.setAttribute("aria-hidden","true");
      pickupBtn?.classList.remove("ready");
      if(pickupBtn)pickupBtn.textContent="Pegar";
    }
  }

  function byDuoKey(key){
    if(typeof key!=='string'||key.length>120)return null;
    return collectibles.find(r=>validRoot(r)&&r.userData.duoKey===key)||null;
  }
  function consume(root,credit=true){
    if(!validRoot(root))return null;
    const item={...root.userData.collectible},key=root.userData.duoKey;
    if(credit&&!window.gameInventory.addItem(item)){
      const status=document.getElementById("status");
      if(status)status.textContent="Inventário cheio";
      return null;
    }
    setHighlight(root,false);
    root.traverse(o=>{
      if(!o.isMesh)return;
      const i=meshes.indexOf(o);if(i>=0)meshes.splice(i,1);
      o.geometry?.dispose?.();
      if(root.userData.inventoryDrop269){o.material?.map?.dispose?.();o.material?.dispose?.();}
    });
    const ci=collectibles.indexOf(root);if(ci>=0)collectibles.splice(ci,1);
    collectRoot.remove(root);
    candidate=null;lastCandidate=null;
    if(credit){
      const status=document.getElementById("status");
      if(status)status.textContent=`Coletado: ${item.name} • inventário atualizado`;
    }
    if(resourceStatus)resourceStatus.textContent=`Restam ${collectibles.length} recursos`;
    updatePrompt();
    if(credit&&window.FlorestaOnline?.connected&&window.FlorestaOnline.isHost){
      window.dispatchEvent(new CustomEvent('game:duo-local-pickup',{detail:{key,item}}));
    }
    return item;
  }
  function collect(){
    if(window.gameInventory?.isOpen)return false;
    const root=findCandidate();
    if(!validRoot(root))return false;
    const online=window.FlorestaOnline;
    if(online?.connected&&!online.isHost){
      // Guest NEVER credits itself. Host confirms the resource and awards exactly once.
      const ok=window.FlorestaDuoWorld?.requestPickup?.(root.userData.duoKey,root.userData.collectible.id);
      if(!ok){const s=document.getElementById('status');if(s)s.textContent='Sincronizando coleta com anfitrião...';}
      return !!ok;
    }
    return !!consume(root,true);
  }

  // Capture phase so Q is reliable even with the other game listeners.
  window.addEventListener("keydown",e=>{
    if(e.code!=="KeyQ"||e.repeat||window.gameInventory?.isOpen)return;
    if(window.gameLumber?.canPickupLog?.()) return;
    e.preventDefault();
    e.stopPropagation();
    collect();
  },true);

  pickupBtn?.addEventListener("click",collect);

  let lastScan=0;
  function frame(t){
    requestAnimationFrame(frame);
    if(t-lastScan>60){lastScan=t;updatePrompt();}
  }
  requestAnimationFrame(frame);

  window.gameCollectibles={
    root:collectRoot,
    get remaining(){return collectibles.length},
    get items(){return collectibles.slice()},
    collectNearest:collect,
    findNearest:findCandidate,
    getByNetworkKey:byDuoKey,
    consumeByNetworkKey(key,credit=false){return consume(byDuoKey(key),credit);},
    spawnVine,
    spawnWoodChip,
    spawnWoodShield,
    // Generic dropped inventory stack: same candidate, highlight and collection lifecycle.
    spawnInventoryDrop(item,x,z,sprite=''){
      if(!item?.id||!item?.name||!Number.isFinite(x)||!Number.isFinite(z))return null;
      const root=new THREE.Group();root.userData.collectible={...item,quantity:Math.max(1,Math.floor(Number(item.quantity)||1))};root.userData.inventoryDrop269=true;
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(.22,.13,.18),new THREE.MeshStandardMaterial({color:0x786c49,roughness:1}));
      mesh.position.y=.07;root.add(mesh);
      if(sprite){const texture=new THREE.TextureLoader().load(sprite);texture.minFilter=THREE.NearestFilter;texture.magFilter=THREE.NearestFilter;
       const face=new THREE.Mesh(new THREE.PlaneGeometry(.38,.38),new THREE.MeshBasicMaterial({map:texture,transparent:true,alphaTest:.15,side:THREE.DoubleSide,depthWrite:false}));face.rotation.x=-Math.PI/2;face.position.y=.15;root.add(face);}
      return place(root,x,z,.03);
    },
    spawnItem(item,x,z){
      if(item?.id==="vine"){
        return spawnVine(
          x,
          z,
          item.quantity||1
        );
      }

      if(item?.id==="wood_chip"){
        return spawnWoodChip(
          x,
          z,
          item.quantity||1
        );
      }

      if(item?.id==="wood_shield"){
        return spawnWoodShield(
          x,
          z
        );
      }

      return null;
    }
  };

  const status=document.getElementById("status");
  if(status)status.textContent=`Coleta pronta • ${collectibles.length} recursos • aproxime-se e pressione Q`;
  if(resourceStatus)resourceStatus.textContent=`Recursos no chão: ${collectibles.length} • Q para pegar`;
}catch(err){
  console.error("Sistema de coleta:",err);
  const status=document.getElementById("status");
  if(status)status.textContent+=" • erro na coleta: "+String(err?.message||err);
  if(resourceStatus)resourceStatus.textContent="ERRO NA COLETA: "+String(err?.message||err);
}


}catch(err){
  console.error("V48 classic boot:",err);
  const s=document.getElementById("status");
  if(s)s.textContent="ERRO V48: "+String(err?.message||err);
}
})();
