

(async()=>{
  if(window.__V79_SHIELD_CRAFT)return;
  window.__V79_SHIELD_CRAFT=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{
    t=clamp(t,0,1);
    return t*t*(3-2*t);
  };

  for(let i=0;i<1200;i++){
    if(
      window.gameReview?.scene &&
      window.gameReview?.camera &&
      window.gameReview?.player &&
      window.gameReview?.groundY &&
      window.gameReview?.trueFirstPerson?.bones?.rHand &&
      window.gameReview?.trueFirstPerson?.bones?.lHand &&
      window.gameInventory &&
      window.gameRightHand &&
      window.gameCollectibles
    )break;

    await sleep(20);
  }

  const game=window.gameReview;
  const THREE=window.__THREE_MODULE;

  if(
    !game?.scene ||
    !THREE
  )return;

  const scene=game.scene;
  const camera=game.camera;
  const player=game.player;
  const tfp=game.trueFirstPerson;
  const bones=tfp.bones;

  const status=document.getElementById("status");
  const canvas=game.renderer.domElement;
  const equipTorchBtn=document.getElementById("equipBtn");

  const CFG={
    chipsRequired:5,
    cutsRequired:6,
    placementDistance:2.05,
    siteUseRange:3.15,
    chipWidth:.13,
    chipLength:.82,
    chipThickness:.035,
    shieldBlockReduction:.70
  };

  // ----------------------------------------------------------
  // HUD / controls
  // ----------------------------------------------------------
  const uiStyle=document.createElement("style");
  uiStyle.textContent=`
    #shieldChipPlaceBtnV79{
      position:fixed;
      right:18px;
      bottom:118px;
      z-index:45;
      display:none;
      padding:10px 13px;
      border-radius:10px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(35,21,11,.82);
      color:#f3dfc3;
      font:700 12px Inter,system-ui,sans-serif;
      backdrop-filter:blur(8px);
      cursor:pointer;
    }
    #shieldChipPlaceBtnV79.show{display:block}
    #shieldChipPlaceBtnV79.active{
      border-color:#d5a46d;
      box-shadow:0 0 0 1px rgba(213,164,109,.25),0 0 18px rgba(154,96,44,.22);
    }
    #shieldBuildHintV79{
      position:fixed;
      left:50%;
      bottom:82px;
      transform:translateX(-50%);
      z-index:45;
      display:none;
      padding:8px 11px;
      border-radius:9px;
      background:rgba(0,0,0,.60);
      border:1px solid rgba(255,255,255,.15);
      color:#f1e6d5;
      font:700 12px Inter,system-ui,sans-serif;
      pointer-events:none;
      text-align:center;
    }
    #shieldBuildHintV79.show{display:block}
    #shieldBlockBtnV79{
      position:fixed;
      right:18px;
      bottom:168px;
      z-index:45;
      display:none;
      width:72px;
      height:54px;
      border-radius:14px;
      border:1px solid rgba(255,255,255,.18);
      background:rgba(35,25,17,.80);
      color:#fff0d8;
      font:800 12px Inter,system-ui,sans-serif;
      touch-action:none;
      user-select:none;
    }
    #shieldBlockBtnV79.show{display:block}
    #shieldBlockBtnV79.active{
      background:rgba(85,54,28,.92);
      border-color:#d8aa73;
    }
  `;
  document.head.append(uiStyle);

  const placeBtn=document.createElement("button");
  placeBtn.id="shieldChipPlaceBtnV79";
  placeBtn.type="button";
  placeBtn.textContent="Posicionar lasca (G)";
  document.body.append(placeBtn);

  const hint=document.createElement("div");
  hint.id="shieldBuildHintV79";
  document.body.append(hint);

  const blockBtn=document.createElement("button");
  blockBtn.id="shieldBlockBtnV79";
  blockBtn.type="button";
  blockBtn.textContent="DEFENDER";
  document.body.append(blockBtn);

  // ----------------------------------------------------------
  // Materials / geometry
  // ----------------------------------------------------------
  const woodMat=new THREE.MeshStandardMaterial({
    color:0xa96e39,
    roughness:1,
    metalness:0,
    flatShading:true
  });

  const woodLight=woodMat.clone();
  woodLight.color.setHex(0xc7935f);

  const woodDark=woodMat.clone();
  woodDark.color.setHex(0x75451f);

  const ghostMat=new THREE.MeshStandardMaterial({
    color:0x74dda1,
    roughness:.8,
    metalness:0,
    transparent:true,
    opacity:.34,
    depthWrite:false,
    emissive:0x163d28,
    emissiveIntensity:.30
  });

  const chipGeo=new THREE.BoxGeometry(
    CFG.chipWidth,
    CFG.chipThickness,
    CFG.chipLength
  );

  const heldChipGeo=new THREE.BoxGeometry(
    .075,
    .025,
    .36
  );

  const finalPlankLengths=[
    .58,.72,.82,.72,.58
  ];

  function buildShieldModel(materialScale=1){
    const root=new THREE.Group();
    root.name="WoodShield_V79";

    for(let i=0;i<5;i++){
      const len=finalPlankLengths[i];

      const p=new THREE.Mesh(
        new THREE.BoxGeometry(
          .13,
          len,
          .038
        ),
        i%2 ? woodMat : woodLight
      );

      p.position.set(
        (i-2)*.117,
        (len-.82)*.10,
        0
      );

      p.rotation.z=
        (i-2)*.028;

      p.castShadow=true;
      p.receiveShadow=true;
      root.add(p);
    }

    const brace=new THREE.Mesh(
      new THREE.BoxGeometry(
        .62,.08,.055
      ),
      woodDark
    );

    brace.position.set(
      0,.02,.038
    );

    brace.castShadow=true;
    brace.receiveShadow=true;
    root.add(brace);

    const handle=new THREE.Mesh(
      new THREE.BoxGeometry(
        .075,.28,.06
      ),
      woodDark
    );

    handle.position.set(
      0,.00,.075
    );

    handle.castShadow=true;
    root.add(handle);

    const boss=new THREE.Mesh(
      new THREE.CylinderGeometry(
        .055,.055,.07,10
      ),
      woodDark
    );

    boss.rotation.x=Math.PI/2;
    boss.position.set(0,.02,-.028);
    boss.castShadow=true;
    root.add(boss);

    root.scale.setScalar(materialScale);

    return root;
  }

  // ----------------------------------------------------------
  // Right-hand chip equipment.
  // ----------------------------------------------------------
  const wrappedRightHand=window.gameRightHand;
  let chipEquipped=false;

  const heldChip=new THREE.Mesh(
    heldChipGeo,
    woodLight
  );

  heldChip.name="Held_Wood_Chip_V79";
  heldChip.visible=false;
  heldChip.castShadow=true;
  scene.add(heldChip);

  const handPos=new THREE.Vector3();
  const rightVec=new THREE.Vector3();
  const forwardVec=new THREE.Vector3();
  const upVec=new THREE.Vector3(0,1,0);
  const xAxis=new THREE.Vector3();
  const yAxis=new THREE.Vector3();
  const zAxis=new THREE.Vector3();
  const tempMat=new THREE.Matrix4();

  function itemQty(id){
    return (
      window.gameInventory
        ?.items
        ?.find?.(i=>i.id===id)
        ?.quantity
      ||0
    );
  }

  function equipChip(){
    if(itemQty("wood_chip")<1)return false;

    if(window.gameShield?.blocking){
      window.gameShield.setBlocking?.(false);
    }

    wrappedRightHand.unequip?.();

    chipEquipped=true;
    heldChip.visible=true;
    window.gameInventory?.refresh?.();

    if(status){
      status.textContent=
        "Lasca na mão • pressione G para posicionar";
    }

    return true;
  }

  function unequipChip(){
    if(!chipEquipped)return false;

    chipEquipped=false;
    heldChip.visible=false;

    if(positioning){
      cancelPositioning();
    }

    window.gameInventory?.refresh?.();

    if(status){
      status.textContent=
        "Lasca guardada";
    }

    return true;
  }

  window.gameRightHand={
    get current(){
      return chipEquipped
        ?"wood_chip"
        :wrappedRightHand.current;
    },

    get object(){
      return chipEquipped
        ?heldChip
        :wrappedRightHand.object;
    },

    equip(id){
      if(id==="wood_chip"){
        return equipChip();
      }

      if(chipEquipped){
        unequipChip();
      }

      return wrappedRightHand.equip?.(id);
    },

    unequip(){
      if(chipEquipped){
        return unequipChip();
      }

      return wrappedRightHand.unequip?.();
    },

    toggle(id="axe"){
      if(id==="wood_chip"){
        return chipEquipped
          ?unequipChip()
          :equipChip();
      }

      if(chipEquipped){
        unequipChip();
      }

      return wrappedRightHand.toggle?.(id);
    },

    sync(){
      wrappedRightHand.sync?.();
    }
  };

  function positionHeldChip(){
    if(!chipEquipped){
      heldChip.visible=false;
      return;
    }

    bones.rHand.getWorldPosition(
      handPos
    );

    const yaw=
      player.bodyYaw ??
      player.yaw;

    forwardVec.set(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw)
    );

    rightVec.set(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    yAxis.copy(upVec);
    zAxis
      .copy(forwardVec)
      .multiplyScalar(-1)
      .normalize();

    xAxis
      .crossVectors(
        yAxis,
        zAxis
      )
      .normalize();

    tempMat.makeBasis(
      xAxis,
      yAxis,
      zAxis
    );

    heldChip.quaternion
      .setFromRotationMatrix(
        tempMat
      );

    heldChip.rotateX(
      -.26
    );

    heldChip.rotateZ(
      -.10
    );

    heldChip.position
      .copy(handPos)
      .addScaledVector(
        forwardVec,
        .07
      )
      .addScaledVector(
        rightVec,
        .015
      )
      .addScaledVector(
        upVec,
        -.02
      );

    heldChip.visible=true;
  }

  // ----------------------------------------------------------
  // Placement site.
  // ----------------------------------------------------------
  let positioning=false;
  let placementAnimation=false;
  let placementTime=0;
  let placedDuringAnimation=false;
  let preview=null;
  let activeSite=null;
  let siteSerial=0;

  const siteForward=new THREE.Vector3();
  const siteRight=new THREE.Vector3();
  const siteUp=new THREE.Vector3(0,1,0);
  const worldTarget=new THREE.Vector3();

  function createSite(x,z,yaw){
    const root=new THREE.Group();
    root.name=`ShieldCraftSite_${++siteSerial}`;

    root.position.set(
      x,
      game.groundY(x,z)+.026,
      z
    );

    root.rotation.y=yaw;
    scene.add(root);

    return {
      id:siteSerial,
      root,
      x,
      z,
      yaw,
      placed:0,
      cuts:0,
      state:"PLACING",
      planks:[],
      cutMarks:[]
    };
  }

  function siteSlotLocal(index){
    return new THREE.Vector3(
      (index-2)*.145,
      0,
      0
    );
  }

  function createPlacedPlank(index){
    const p=new THREE.Mesh(
      chipGeo,
      index%2
        ?woodMat
        :woodLight
    );

    p.name=`ShieldChip_${index+1}`;
    p.castShadow=true;
    p.receiveShadow=true;

    const local=siteSlotLocal(index);
    p.position.copy(local);

    p.rotation.y=
      (
        index-2
      )*.018;

    activeSite.root.add(p);
    activeSite.planks.push(p);

    return p;
  }

  function ensurePreview(){
    if(preview)return preview;

    preview=new THREE.Mesh(
      chipGeo,
      ghostMat
    );

    preview.name="ShieldChipPreview_V79";
    preview.castShadow=false;
    preview.receiveShadow=false;
    scene.add(preview);

    return preview;
  }

  function removePreview(){
    if(!preview)return;

    scene.remove(preview);
    preview=null;
  }

  function firstPlacementPose(){
    const yaw=player.yaw;

    siteForward.set(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw)
    );

    siteRight.set(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    const x=
      player.x+
      siteForward.x*
      CFG.placementDistance;

    const z=
      player.z+
      siteForward.z*
      CFG.placementDistance;

    return {
      x,
      z,
      yaw
    };
  }

  function updatePreview(){
    if(!positioning)return;

    const g=ensurePreview();

    if(!activeSite){
      const p=firstPlacementPose();

      g.position.set(
        p.x,
        game.groundY(p.x,p.z)+.045,
        p.z
      );

      g.rotation.set(
        0,
        p.yaw,
        0
      );

      return;
    }

    if(
      activeSite.state!=="PLACING" ||
      activeSite.placed>=
      CFG.chipsRequired
    ){
      g.visible=false;
      return;
    }

    g.visible=true;

    const local=
      siteSlotLocal(
        activeSite.placed
      );

    worldTarget
      .copy(local);

    activeSite.root
      .localToWorld(
        worldTarget
      );

    g.position.copy(
      worldTarget
    );

    g.position.y+=.020;

    g.quaternion.copy(
      activeSite.root.quaternion
    );
  }

  function setUi(){
    const chipReady=
      chipEquipped &&
      itemQty("wood_chip")>0 &&
      (
        !activeSite ||
        activeSite.state==="PLACING"
      );

    placeBtn.classList.toggle(
      "show",
      chipReady &&
      !placementAnimation
    );

    placeBtn.classList.toggle(
      "active",
      positioning
    );

    placeBtn.textContent=
      positioning
        ?"Cancelar posicionamento (G)"
        :"Posicionar lasca (G)";

    blockBtn.classList.toggle(
      "show",
      !!window.gameShield?.equipped &&
      matchMedia("(pointer:coarse)").matches
    );

    blockBtn.classList.toggle(
      "active",
      !!window.gameShield?.blocking
    );

    let text="";

    if(
      activeSite?.state==="PLACING"
    ){
      text=
        `Escudo • lascas ${activeSite.placed}/${CFG.chipsRequired}`;

      if(
        positioning &&
        !placementAnimation
      ){
        text+=
          " • clique para colocar";
      }
    }
    else if(
      activeSite?.state==="CUTTING"
    ){
      text=
        window.gameRightHand?.current==="axe"
          ?`Cortar pontas • ${activeSite.cuts}/${CFG.cutsRequired} • bata com o machado`
          :"5/5 lascas colocadas • equipe o machado para modelar o escudo";
    }

    hint.textContent=text;

    hint.classList.toggle(
      "show",
      !!text
    );
  }

  function enterPositioning(){
    if(
      !chipEquipped ||
      itemQty("wood_chip")<1 ||
      placementAnimation
    )return false;

    if(
      activeSite &&
      activeSite.state!=="PLACING"
    )return false;

    positioning=true;
    document.body.classList.add(
      "shield-chip-positioning"
    );

    updatePreview();
    setUi();

    if(status){
      status.textContent=
        activeSite
          ?`Posicione a próxima lasca • ${activeSite.placed}/${CFG.chipsRequired}`
          :"Posicione a primeira lasca do escudo";
    }

    return true;
  }

  function cancelPositioning(){
    positioning=false;
    placementAnimation=false;
    placedDuringAnimation=false;
    removePreview();

    document.body.classList.remove(
      "shield-chip-positioning"
    );

    setUi();

    return true;
  }

  // ----------------------------------------------------------
  // One-arm placement animation.
  // ----------------------------------------------------------
  const leftArm=bones.lArm;
  const rightArm=bones.rArm;
  const rightFore=bones.rFore;
  const rightHand=bones.rHand;

  function aimBoneAt(
    bone,
    child,
    target,
    strength=1
  ){
    if(!bone||!child)return;

    bone.updateWorldMatrix(
      true,true
    );

    child.updateWorldMatrix(
      true,true
    );

    const bp=new THREE.Vector3();
    const cp=new THREE.Vector3();
    const worldQ=new THREE.Quaternion();
    const parentQ=new THREE.Quaternion();

    bone.getWorldPosition(bp);
    child.getWorldPosition(cp);
    bone.getWorldQuaternion(worldQ);

    const current=
      cp.sub(bp).normalize();

    const desired=
      target.clone()
        .sub(bp)
        .normalize();

    if(
      current.lengthSq()<.5 ||
      desired.lengthSq()<.5
    )return;

    const delta=
      new THREE.Quaternion()
        .setFromUnitVectors(
          current,
          desired
        );

    const desiredWorld=
      delta.multiply(
        worldQ.clone()
      );

    if(bone.parent){
      bone.parent.getWorldQuaternion(
        parentQ
      );
    }else{
      parentQ.identity();
    }

    const desiredLocal=
      parentQ
        .invert()
        .multiply(
          desiredWorld
        );

    bone.quaternion.slerp(
      desiredLocal,
      strength
    );
  }

  function rightArmIK(target){
    for(let i=0;i<3;i++){
      aimBoneAt(
        rightArm,
        rightFore,
        target,
        .82
      );

      aimBoneAt(
        rightFore,
        rightHand,
        target,
        .94
      );

      tfp.visibleRoot
        .updateMatrixWorld(true);
    }
  }

  function nextChipWorldPoint(){
    if(!activeSite){
      const p=firstPlacementPose();

      return new THREE.Vector3(
        p.x,
        game.groundY(p.x,p.z)+.08,
        p.z
      );
    }

    const local=
      siteSlotLocal(
        activeSite.placed
      );

    return activeSite.root
      .localToWorld(
        local.clone()
      )
      .add(
        new THREE.Vector3(
          0,.08,0
        )
      );
  }

  function commitChipPlacement(){
    if(placedDuringAnimation)return;

    if(
      itemQty("wood_chip")<1
    ){
      cancelPositioning();
      unequipChip();
      return;
    }

    if(!activeSite){
      const p=firstPlacementPose();

      activeSite=createSite(
        p.x,
        p.z,
        p.yaw
      );
    }

    createPlacedPlank(
      activeSite.placed
    );

    activeSite.placed++;

    window.gameInventory
      ?.removeItem?.(
        "wood_chip",
        1
      );

    placedDuringAnimation=true;

    if(
      activeSite.placed>=
      CFG.chipsRequired
    ){
      activeSite.state="CUTTING";
      positioning=false;
      removePreview();

      // Axe will be required next.
      unequipChip();

      if(status){
        status.textContent=
          "5/5 lascas posicionadas • equipe o machado e corte as pontas";
      }
    }else{
      if(
        itemQty("wood_chip")>0
      ){
        chipEquipped=true;
        heldChip.visible=true;
      }else{
        positioning=false;
        unequipChip();
      }
    }

    setUi();
  }

  function startPlacement(){
    if(
      !positioning ||
      placementAnimation ||
      !chipEquipped ||
      itemQty("wood_chip")<1
    )return false;

    if(
      activeSite &&
      Math.hypot(
        player.x-activeSite.x,
        player.z-activeSite.z
      )>
      CFG.siteUseRange
    ){
      if(status){
        status.textContent=
          "Chegue mais perto do escudo para colocar a próxima lasca";
      }
      return false;
    }

    placementAnimation=true;
    placementTime=0;
    placedDuringAnimation=false;

    if(preview){
      preview.visible=false;
    }

    setUi();
    return true;
  }

  function updatePlacementAnimation(dt){
    if(!placementAnimation)return;

    placementTime+=dt;

    const duration=.82;
    const u=
      clamp(
        placementTime/
        duration,
        0,1
      );

    const down=
      smooth(
        clamp(
          u/.70,
          0,1
        )
      );

    const start=
      tfp.visibleRoot
        .localToWorld(
          new THREE.Vector3(
            .28,
            1.03,
            -.17
          )
        );

    const end=
      nextChipWorldPoint();

    const target=
      start.lerp(
        end,
        down
      );

    target.y+=
      .14*
      Math.sin(
        Math.PI*u
      );

    rightArmIK(
      target
    );

    positionHeldChip();

    if(
      !placedDuringAnimation &&
      u>=.62
    ){
      commitChipPlacement();
    }

    if(u>=1){
      placementAnimation=false;
      placedDuringAnimation=false;

      if(
        positioning &&
        activeSite?.state==="PLACING" &&
        itemQty("wood_chip")>0
      ){
        if(preview){
          preview.visible=true;
        }
        updatePreview();
      }

      setUi();
    }
  }

  // ----------------------------------------------------------
  // Axe shaping: six cuts model the five planks into a shield.
  // ----------------------------------------------------------
  const cutTargets=[
    {plank:0,end:"top"},
    {plank:4,end:"top"},
    {plank:0,end:"bottom"},
    {plank:4,end:"bottom"},
    {plank:1,end:"bottom"},
    {plank:3,end:"bottom"}
  ];

  const splinterGeo=new THREE.BoxGeometry(
    .03,.014,.15
  );

  const splinterMat=woodLight.clone();

  const splinterPool=[];
  const activeSplinters=[];

  for(let i=0;i<48;i++){
    const s=new THREE.Mesh(
      splinterGeo,
      splinterMat
    );

    s.visible=false;
    scene.add(s);
    splinterPool.push(s);
  }

  function spawnCutSplinters(point){
    const count=
      Math.min(
        8,
        splinterPool.length
      );

    for(let i=0;i<count;i++){
      const s=splinterPool.pop();
      s.visible=true;
      s.position.copy(point);

      s.rotation.set(
        Math.random()*Math.PI,
        Math.random()*Math.PI,
        Math.random()*Math.PI
      );

      s.userData.life=
        .55+
        Math.random()*.35;

      s.userData.velocity=
        new THREE.Vector3(
          (
            Math.random()-.5
          )*1.5,
          .6+
          Math.random()*1.2,
          (
            Math.random()-.5
          )*1.5
        );

      activeSplinters.push(s);
    }
  }

  function updateSplinters(dt){
    for(
      let i=
        activeSplinters.length-1;
      i>=0;
      i--
    ){
      const s=activeSplinters[i];

      s.userData.life-=dt;
      s.userData.velocity.y-=3.5*dt;

      s.position.addScaledVector(
        s.userData.velocity,
        dt
      );

      s.rotation.x+=dt*8;
      s.rotation.y+=dt*5;

      if(s.userData.life<=0){
        activeSplinters.splice(i,1);
        s.visible=false;
        splinterPool.push(s);
      }
    }
  }

  function siteInAxeRange(){
    if(
      !activeSite ||
      activeSite.state!=="CUTTING"
    )return false;

    const dx=
      activeSite.x-
      player.x;

    const dz=
      activeSite.z-
      player.z;

    const d=
      Math.hypot(
        dx,dz
      );

    if(
      d>
      CFG.siteUseRange
    )return false;

    const fx=
      -Math.sin(
        player.yaw
      );

    const fz=
      -Math.cos(
        player.yaw
      );

    const dot=
      (
        fx*dx+
        fz*dz
      )/
      Math.max(
        .001,
        d
      );

    return dot>.38;
  }

  function applyCutShape(){
    if(!activeSite)return;

    const progress=
      clamp(
        activeSite.cuts/
        CFG.cutsRequired,
        0,1
      );

    const targetLengths=[
      .58,.72,.82,.72,.58
    ];

    for(
      let i=0;
      i<activeSite.planks.length;
      i++
    ){
      const p=
        activeSite.planks[i];

      const target=
        targetLengths[i];

      const current=
        lerp(
          CFG.chipLength,
          target,
          progress
        );

      p.scale.z=
        current/
        CFG.chipLength;

      p.position.z=
        (
          i===0 ||
          i===4
        )
          ?.035*progress
          :(
              i===1 ||
              i===3
            )
              ?.018*progress
              :0;

      p.rotation.y=
        (
          i-2
        )*
        .035*
        progress;
    }
  }

  function finishShield(){
    if(!activeSite)return;

    const site=activeSite;
    site.state="DONE";

    const x=site.x;
    const z=site.z;

    scene.remove(
      site.root
    );

    window.gameCollectibles
      ?.spawnItem?.(
        {
          id:"wood_shield",
          name:"Escudo de madeira",
          type:"Defesa",
          quantity:1,
          weight:2.4,
          description:
            "Escudo artesanal modelado com cinco lascas de madeira. " +
            "Equipe na mão esquerda e segure o botão direito para defender."
        },
        x,
        z
      );

    activeSite=null;
    positioning=false;
    removePreview();

    if(status){
      status.textContent=
        "Escudo modelado • pressione Q para pegar";
    }

    setUi();
  }

  function consumeAxeImpact(){
    if(
      window.gameRightHand?.current!=="axe"
    )return false;

    if(
      !siteInAxeRange()
    )return false;

    activeSite.cuts=
      Math.min(
        CFG.cutsRequired,
        activeSite.cuts+1
      );

    const step=
      cutTargets[
        activeSite.cuts-1
      ];

    const plank=
      activeSite.planks[
        step?.plank??2
      ];

    const point=new THREE.Vector3();

    plank.getWorldPosition(
      point
    );

    const dir=
      new THREE.Vector3(
        0,0,
        step?.end==="top"
          ?-.28
          :.28
      );

    dir.applyQuaternion(
      activeSite.root.quaternion
    );

    point.add(dir);

    spawnCutSplinters(
      point
    );

    applyCutShape();

    if(status){
      status.textContent=
        activeSite.cuts<
        CFG.cutsRequired
          ?`Modelando escudo • corte ${activeSite.cuts}/${CFG.cutsRequired}`
          :"Último corte • escudo pronto";
    }

    if(
      activeSite.cuts>=
      CFG.cutsRequired
    ){
      setTimeout(
        finishShield,
        130
      );
    }

    setUi();
    return true;
  }

  // ----------------------------------------------------------
  // Shield equipment + blocking.
  // ----------------------------------------------------------
  const heldShield=
    buildShieldModel(
      1.02
    );

  heldShield.name=
    "Held_Wood_Shield_V79";

  heldShield.visible=false;
  scene.add(heldShield);

  let shieldEquipped=false;
  let blocking=false;
  let torchWasEquipped=false;

  const shieldPos=new THREE.Vector3();
  const shieldRight=new THREE.Vector3();
  const shieldForward=new THREE.Vector3();
  const shieldUp=new THREE.Vector3(0,1,0);
  const shieldMat=new THREE.Matrix4();

  function torchEquipped(){
    try{
      return !!game.isEquipped?.();
    }catch{
      return false;
    }
  }

  function stowTorch(){
    if(!torchEquipped())return;

    torchWasEquipped=true;
    equipTorchBtn?.click();
  }

  function equipShield(){
    if(itemQty("wood_shield")<1&&itemQty("forged_silver_shield")<1)return false;

    window.gameBranchHands
      ?.side==="left" &&
      window.gameBranchHands
        ?.unequip?.();

    stowTorch();

    shieldEquipped=true;
    heldShield.visible=true;

    window.gameInventory?.refresh?.();
    setUi();

    if(status){
      status.textContent=
        "Escudo equipado • segure botão direito para defender";
    }

    return true;
  }

  function unequipShield(){
    if(!shieldEquipped)return false;

    blocking=false;
    shieldEquipped=false;
    heldShield.visible=false;

    blockBtn.classList.remove(
      "active"
    );

    if(
      torchWasEquipped &&
      !torchEquipped()
    ){
      equipTorchBtn?.click();
    }

    torchWasEquipped=false;

    window.gameInventory?.refresh?.();
    setUi();

    if(status){
      status.textContent=
        "Escudo guardado";
    }

    return true;
  }

  function setBlocking(value){
    if(!shieldEquipped){
      blocking=false;
      return false;
    }

    blocking=!!value;

    blockBtn.classList.toggle(
      "active",
      blocking
    );

    if(status){
      status.textContent=
        blocking
          ?"Defendendo com o escudo"
          :"Escudo abaixado";
    }

    return blocking;
  }

  function leftArmIK(target){
    const arm=bones.lArm;
    const fore=bones.lFore;
    const hand=bones.lHand;

    for(let i=0;i<3;i++){
      aimBoneAt(
        arm,
        fore,
        target,
        .82
      );

      aimBoneAt(
        fore,
        hand,
        target,
        .94
      );

      tfp.visibleRoot
        .updateMatrixWorld(true);
    }
  }

  function positionShield(){
    if(!shieldEquipped){
      heldShield.visible=false;
      return;
    }

    // V81: the animation module owns the shield transform so the shield
    // follows the actual animated LeftHand instead of bodyYaw.
    if(
      window.gameShieldAnimations
        ?.ownsShieldAttachment
    ){
      heldShield.visible=true;
      return;
    }

    if(
      blocking &&
      !window.gamePlayerHit?.active &&
      !window.gameShieldAnimations?.drivingPose
    ){
      const target=
        tfp.visibleRoot
          .localToWorld(
            new THREE.Vector3(
              -.12,
              1.22,
              -.34
            )
          );

      leftArmIK(
        target
      );
    }

    bones.lHand.getWorldPosition(
      shieldPos
    );

    const yaw=
      player.bodyYaw ??
      player.yaw;

    shieldForward.set(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw)
    );

    shieldRight.set(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    shieldMat.makeBasis(
      shieldRight,
      shieldUp,
      shieldForward
    );

    heldShield.quaternion
      .setFromRotationMatrix(
        shieldMat
      );

    if(blocking){
      heldShield.position
        .copy(shieldPos)
        .addScaledVector(
          shieldForward,
          .20
        )
        .addScaledVector(
          shieldRight,
          .11
        )
        .addScaledVector(
          shieldUp,
          .05
        );

      heldShield.rotation.z+=.04;
    }else{
      heldShield.position
        .copy(shieldPos)
        .addScaledVector(
          shieldForward,
          .045
        )
        .addScaledVector(
          shieldRight,
          -.035
        )
        .addScaledVector(
          shieldUp,
          -.12
        );

      heldShield.rotation.x+=.16;
      heldShield.rotation.z+=.30;
    }

    heldShield.visible=true;
  }

  function reduceIncomingDamage(
    amount,
    sourceLabel,
    sourceId
  ){
    const raw=
      Math.max(
        0,
        Number(amount)||0
      );

    if(
      !shieldEquipped ||
      !blocking ||
      raw<=0
    ){
      return raw;
    }

    const reduced=
      raw*
      (
        1-
        CFG.shieldBlockReduction
      );

    if(status){
      status.textContent=
        `Escudo bloqueou ${Math.round(raw-reduced)} de dano`;
    }

    window.dispatchEvent(
      new CustomEvent(
        "game:shield-blocked",
        {
          detail:{
            blocked:
              raw-reduced,
            received:
              reduced,
            source:
              sourceLabel,
            sourceId
          }
        }
      )
    );

    return reduced;
  }

  // RMB / touch block.
  window.addEventListener(
    "contextmenu",
    e=>{
      if(shieldEquipped){
        e.preventDefault();
      }
    },
    true
  );

  window.addEventListener(
    "pointerdown",
    e=>{
      if(
        shieldEquipped &&
        e.pointerType==="mouse" &&
        e.button===2
      ){
        e.preventDefault();
        setBlocking(true);
      }
    },
    true
  );

  window.addEventListener(
    "pointerup",
    e=>{
      if(
        e.pointerType==="mouse" &&
        e.button===2
      ){
        setBlocking(false);
      }
    },
    true
  );

  window.addEventListener(
    "blur",
    ()=>setBlocking(false)
  );

  blockBtn.addEventListener(
    "pointerdown",
    e=>{
      e.preventDefault();
      setBlocking(true);
    }
  );

  for(const ev of[
    "pointerup",
    "pointercancel",
    "pointerleave"
  ]){
    blockBtn.addEventListener(
      ev,
      ()=>{
        setBlocking(false);
      }
    );
  }

  // ----------------------------------------------------------
  // Placement input.
  // ----------------------------------------------------------
  placeBtn.addEventListener(
    "click",
    ()=>{
      if(positioning){
        cancelPositioning();
      }else{
        enterPositioning();
      }
    }
  );

  window.addEventListener(
    "keydown",
    e=>{
      if(e.repeat)return;

      if(
        e.code==="KeyG" &&
        chipEquipped &&
        !window.gameInventory?.isOpen
      ){
        e.preventDefault();
        e.stopImmediatePropagation();

        if(positioning){
          cancelPositioning();
        }else{
          enterPositioning();
        }
        return;
      }

      if(
        e.code==="Escape" &&
        positioning
      ){
        e.preventDefault();
        cancelPositioning();
      }
    },
    true
  );

  window.addEventListener(
    "pointerdown",
    e=>{
      if(
        !positioning ||
        placementAnimation
      )return;

      if(
        e.pointerType==="mouse" &&
        e.button!==0
      )return;

      if(e.target!==canvas)return;

      e.preventDefault();
      e.stopImmediatePropagation();
      startPlacement();
    },
    true
  );

  // ----------------------------------------------------------
  // Main-loop integration.
  // ----------------------------------------------------------
  const previousUpdate=
    window.__updateAnimatedAvatar;

  window.__updateAnimatedAvatar=
    function(...args){
      previousUpdate?.apply(
        this,
        args
      );

      const dt=
        Math.min(
          .05,
          Math.max(
            0,
            Number(args[2])||0
          )
        );

      updateSplinters(dt);

      if(positioning){
        updatePreview();
      }

      if(placementAnimation){
        updatePlacementAnimation(dt);
      }else{
        positionHeldChip();
      }

      positionShield();
      setUi();
    };

  window.gameShieldCraft={
    version:"V79B",
    config:CFG,

    get site(){
      return activeSite;
    },

    get positioning(){
      return positioning;
    },

    get chipEquipped(){
      return chipEquipped;
    },

    equipChip,
    unequipChip,
    enterPositioning,
    cancelPositioning,
    place:startPlacement,
    consumeAxeImpact,

    resetSite(){
      if(activeSite?.root){
        scene.remove(
          activeSite.root
        );
      }

      activeSite=null;
      cancelPositioning();
      setUi();
    }
  };

  // Native shield and wood chip meshes already exist in this module.
  (window.FlorestaEquipmentModels ||= {}).wood_shield=()=>{
    const c=heldShield.clone(true);c.removeFromParent();return c;
  };
  (window.FlorestaEquipmentModels ||= {}).wood_chip=()=>{
    const c=heldChip.clone(true);c.removeFromParent();return c;
  };

  window.gameShield={
    version:"V79B",

    get equipped(){
      return shieldEquipped;
    },

    get blocking(){
      return blocking;
    },

    get object(){
      return heldShield;
    },

    get bones(){
      return bones;
    },

    get model(){
      return tfp.model;
    },

    equip:equipShield,
    unequip:unequipShield,
    setBlocking,
    reduceIncomingDamage
  };

  window.gameInventory?.refresh?.();
  setUi();

  if(status){
    status.textContent=
      "V79 • 5 lascas podem ser posicionadas e modeladas em um escudo";
  }
})().catch(err=>{
  console.error(
    "V79 escudo de lascas:",
    err
  );

  const status=
    document.getElementById(
      "status"
    );

  if(status){
    status.textContent=
      "Falha no sistema do escudo: "+
      String(
        err?.message||err
      );
  }
});

