

(async () => {
  const craftBtn = document.getElementById("craftBtn");
  const overlay = document.getElementById("craftOverlay");
  const closeBtn = document.getElementById("craftClose");
  const startBtn = document.getElementById("craftAxeBtn");
  const costBranch = document.getElementById("costBranch");
  const costRock = document.getElementById("costRock");
  const stage = document.getElementById("craftStage");
  const stageTitle = document.getElementById("craftStageTitle");
  const stageHint = document.getElementById("craftStageHint");
  const bar = document.getElementById("craftProgressBar");

  if (!craftBtn || !overlay || !startBtn) return;

  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const lerp = (a,b,t) => a+(b-a)*t;
  const smooth = t => {
    t=clamp(t,0,1);
    return t*t*(3-2*t);
  };

  let THREE;
  try {
    THREE = await window.__LOCAL_IMPORT(window.FLORESTA_MODULES.three);
  } catch (err) {
    console.error("Craft/Three:",err);
    return;
  }

  async function waitGame() {
    for (let i=0;i<900;i++) {
      const g=window.gameReview;
      if (
        g?.scene && g?.camera && g?.player && g?.keys &&
        g?.trueFirstPerson?.bones?.lHand &&
        g?.trueFirstPerson?.bones?.rHand &&
        window.gameInventory
      ) return g;
      await sleep(20);
    }
    throw new Error("Corpo/inventário ainda não estão disponíveis.");
  }

  const game = await waitGame();
  const tfp = game.trueFirstPerson;
  const bones = tfp.bones;

  let panelOpen=false;
  let crafting=false;let craftRecipe="axe",reserved=[],reservedLog=null,savedPosition=null;
  let craftStart=0;
  let craftRoot=null;
  let branch=null;
  let prongL=null;
  let prongR=null;
  let headStone=null;
  let heldStone=null;
  let strikerShard=null;
  let sharpEdge=null;
  let sparkGroup=null;
  let impactIndex=-1;
  let torchWasVisible=true;
  let savedPitch=game.player.pitch;
  let savedYaw=game.player.yaw;
  let originalUpdate=window.__updateAnimatedAvatar;

  // ---------- Inventory ----------
  function count(id) {
    return window.gameInventory.items.find(i=>i.id===id)?.quantity || 0;
  }

  function updateRecipe() {
    workshop?.updateMenu?.();
    const branches=count("branch"), rocks=count("rock");
    const okB=branches>=1, okR=rocks>=1;

    costBranch?.classList.toggle("ok",okB);
    costBranch?.classList.toggle("missing",!okB);
    costRock?.classList.toggle("ok",okR);
    costRock?.classList.toggle("missing",!okR);

    const bs=costBranch?.querySelector("span");
    const rs=costRock?.querySelector("span");
    if(bs)bs.textContent=`${branches}/1`;
    if(rs)rs.textContent=`${rocks}/1`;

    startBtn.disabled=!(okB&&okR)||crafting;
    startBtn.textContent=okB&&okR ? "Fabricar machado" : "Faltam materiais";
  }

  function releaseMovement() {
    game.keys?.clear?.();
    if(game.stick){game.stick.x=0;game.stick.y=0;}
    for(const code of [
      "KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
      "ShiftLeft","ShiftRight","ControlLeft","ControlRight","KeyC","Space"
    ]) {
      window.dispatchEvent(new KeyboardEvent("keyup",{code,bubbles:true}));
    }
  }

  function openPanel() {
    if(crafting || window.gameInventory?.isOpen) return;
    panelOpen=true;
    releaseMovement();
    updateRecipe();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    craftBtn.textContent="Fechar craft (R)";
    setTimeout(()=>startBtn.focus(),0);
  }
  function closePanel() {
    if(!panelOpen || crafting)return;
    panelOpen=false;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
    craftBtn.textContent="Craft (R)";
  }
  function togglePanel(){panelOpen?closePanel():openPanel();}

  // ---------- 3D helpers ----------
  function cylBetween(a,b,r,mat,radial=8) {
    const d=b.clone().sub(a);
    const len=d.length();
    const mesh=new THREE.Mesh(new THREE.CylinderGeometry(r,r*.84,len,radial,2),mat);
    mesh.position.copy(a).add(b).multiplyScalar(.5);
    mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
    mesh.castShadow=true;
    return mesh;
  }

  function makeRock(scale=.10, color=0x767971) {
    const m=new THREE.Mesh(
      new THREE.DodecahedronGeometry(1,1),
      new THREE.MeshStandardMaterial({color,roughness:1,metalness:0,flatShading:true})
    );
    m.scale.set(scale*1.25,scale*.78,scale*.62);
    m.castShadow=true;
    return m;
  }

  function makeAxeModel() {
    const root=new THREE.Group();
    const wood=new THREE.MeshStandardMaterial({color:0x80502e,roughness:1,flatShading:true});
    const stone=new THREE.MeshStandardMaterial({color:0x747971,roughness:1,flatShading:true});
    const edge=new THREE.MeshStandardMaterial({color:0xb7bcb4,roughness:.82,flatShading:true});

    const handle=cylBetween(
      new THREE.Vector3(0,-.30,0),
      new THREE.Vector3(0,.30,0),
      .025,wood,9
    );
    root.add(handle);

    const head=new THREE.Mesh(new THREE.DodecahedronGeometry(.11,1),stone);
    head.position.set(.015,.255,0);
    head.scale.set(1.38,.62,.42);
    head.rotation.z=-.18;
    root.add(head);

    const blade=new THREE.Mesh(new THREE.BoxGeometry(.09,.012,.045),edge);
    blade.position.set(.105,.265,0);
    blade.rotation.z=-.18;
    root.add(blade);

    const bind=new THREE.Mesh(
      new THREE.TorusGeometry(.033,.006,5,10),
      new THREE.MeshStandardMaterial({color:0x4b3424,roughness:1})
    );
    bind.position.set(0,.215,0);
    bind.rotation.x=Math.PI/2;
    root.add(bind);

    root.traverse(o=>{if(o.isMesh)o.castShadow=true;});
    return root;
  }

  function buildCraftObjects() {
    craftRoot=new THREE.Group();
    craftRoot.name="VisibleCraftSequence";
    game.scene.add(craftRoot);

    const wood=new THREE.MeshStandardMaterial({color:0x855431,roughness:1,flatShading:true});
    const splitWood=new THREE.MeshStandardMaterial({color:0xa16a42,roughness:1,flatShading:true});

    const lower=cylBetween(
      new THREE.Vector3(0,-.34,0),
      new THREE.Vector3(0,.16,0),
      .027,wood,9
    );
    branch=new THREE.Group();
    branch.add(lower);

    const prongGeo=new THREE.CylinderGeometry(.022,.026,.23,8,2);
    prongL=new THREE.Mesh(prongGeo,splitWood);
    prongR=new THREE.Mesh(prongGeo.clone(),splitWood);
    prongL.position.set(0,.265,0);
    prongR.position.set(0,.265,0);
    prongL.castShadow=prongR.castShadow=true;
    branch.add(prongL,prongR);
    craftRoot.add(branch);

    heldStone=makeRock(.095,0x747870);
    heldStone.rotation.set(.4,.2,.5);
    craftRoot.add(heldStone);

    headStone=makeRock(.115,0x70756e);
    headStone.scale.multiply(new THREE.Vector3(1.20,.78,.60));
    headStone.visible=false;
    craftRoot.add(headStone);

    sharpEdge=new THREE.Mesh(
      new THREE.BoxGeometry(.11,.012,.05),
      new THREE.MeshStandardMaterial({color:0xb9beb6,roughness:.85})
    );
    sharpEdge.visible=false;
    craftRoot.add(sharpEdge);

    strikerShard=makeRock(.064,0x858980);
    strikerShard.visible=false;
    craftRoot.add(strikerShard);

    sparkGroup=new THREE.Group();
    craftRoot.add(sparkGroup);
  }

  function setSplit(amount) {
    amount=clamp(amount,0,1);
    const angle=.02+amount*.58;
    prongL.rotation.z= angle;
    prongR.rotation.z=-angle;
    prongL.position.x=-Math.sin(angle)*.045;
    prongR.position.x= Math.sin(angle)*.045;
  }

  function localToWorld(v) {
    return craftRoot.localToWorld(v.clone());
  }

  function aimBoneAt(bone,child,target,strength=1) {
    if(!bone||!child)return;
    bone.updateWorldMatrix(true,true);
    child.updateWorldMatrix(true,true);

    const bp=new THREE.Vector3(),cp=new THREE.Vector3();
    const worldQ=new THREE.Quaternion(),parentQ=new THREE.Quaternion();
    bone.getWorldPosition(bp);
    child.getWorldPosition(cp);
    bone.getWorldQuaternion(worldQ);

    const current=cp.sub(bp).normalize();
    const desired=target.clone().sub(bp).normalize();
    if(current.lengthSq()<.5||desired.lengthSq()<.5)return;

    const delta=new THREE.Quaternion().setFromUnitVectors(current,desired);
    const desiredWorld=delta.multiply(worldQ.clone());
    if(bone.parent)bone.parent.getWorldQuaternion(parentQ);else parentQ.identity();
    const desiredLocal=parentQ.invert().multiply(desiredWorld);
    bone.quaternion.slerp(desiredLocal,strength);
  }

  function armIK(side,target) {
    const arm=side==="left"?bones.lArm:bones.rArm;
    const fore=side==="left"?bones.lFore:bones.rFore;
    const hand=side==="left"?bones.lHand:bones.rHand;
    if(!arm||!fore||!hand)return;
    for(let i=0;i<3;i++){
      aimBoneAt(arm,fore,target,.86);
      aimBoneAt(fore,hand,target,.95);
      tfp.visibleRoot?.updateMatrixWorld?.(true);
    }
  }

  function handWorld(bone) {
    const p=new THREE.Vector3();
    bone?.getWorldPosition(p);
    return p;
  }

  // ---------- Right hand item system: REAL GRIP ----------
  // The axe is no longer positioned by a loose offset from the wrist.
  // Its handle is fitted through the palm every frame and the actual
  // Mixamo finger bones curl around that handle.

  function localBone(root, names) {
    const wanted=(Array.isArray(names)?names:[names]).map(n=>
      String(n).toLowerCase().replace(/mixamorig[:_]?/g,"").replace(/[^a-z0-9]/g,"")
    );
    let found=null;
    root?.traverse?.(o=>{
      if(found || !o.isBone)return;
      const n=String(o.name||"").toLowerCase()
        .replace(/mixamorig[:_]?/g,"")
        .replace(/[^a-z0-9]/g,"");
      if(wanted.includes(n))found=o;
    });
    return found;
  }

  function fingerChain(root, prefix) {
    return [
      localBone(root,`${prefix}1`),
      localBone(root,`${prefix}2`),
      localBone(root,`${prefix}3`)
    ].filter(Boolean);
  }

  const gripBones={
    index:fingerChain(tfp.visibleRoot,"RightHandIndex"),
    middle:fingerChain(tfp.visibleRoot,"RightHandMiddle"),
    ring:fingerChain(tfp.visibleRoot,"RightHandRing"),
    pinky:fingerChain(tfp.visibleRoot,"RightHandPinky"),
    thumb:fingerChain(tfp.visibleRoot,"RightHandThumb")
  };

  const shadowBones={
    rArm:localBone(tfp.shadowRoot,"RightArm"),
    rFore:localBone(tfp.shadowRoot,"RightForeArm"),
    rHand:localBone(tfp.shadowRoot,"RightHand")
  };

  const gripBase=new Map();
  for(const chain of Object.values(gripBones)){
    for(const b of chain){
      if(b && !gripBase.has(b))gripBase.set(b,b.quaternion.clone());
    }
  }

  const heldAxe=makeAxeModel();
  heldAxe.name="RightHandHeldAxe";
  heldAxe.visible=false;
  heldAxe.scale.setScalar(.82);
  game.scene.add(heldAxe);

  // V40: real stone held by the same physical right hand.
  // It is the same visual language as the collectible stones, not a FPS overlay.
  const heldRock=makeRock(.105,0x777b73);
  heldRock.name="RightHandHeldRock";
  heldRock.visible=false;
  heldRock.castShadow=true;
  heldRock.receiveShadow=true;
  game.scene.add(heldRock);

  const rightHandState={current:null};

  const _v0=new THREE.Vector3(),_v1=new THREE.Vector3(),_v2=new THREE.Vector3();
  const _palmCenter=new THREE.Vector3(),_across=new THREE.Vector3(),_forwardHand=new THREE.Vector3();
  const _xAxis=new THREE.Vector3(),_yAxis=new THREE.Vector3(),_zAxis=new THREE.Vector3();
  const _bodyForward=new THREE.Vector3(),_tmpQuat=new THREE.Quaternion(),_tmpMat=new THREE.Matrix4();

  function boneWorld(b){
    const p=new THREE.Vector3();
    b?.getWorldPosition(p);
    return p;
  }

  function restoreGripPose(){
    for(const [bone,q] of gripBase){
      bone.quaternion.copy(q);
    }
  }

  // Finds the actual flexion axis of each Mixamo finger automatically.
  // It tests X/Y/Z and both signs, choosing the rotation that moves the
  // fingertip closest to the palm. This avoids assuming one exporter axis.
  function detectFingerCurl(chain,palmTarget){
    if(!chain?.length)return {axis:new THREE.Vector3(0,0,1),sign:1};

    const testBone=chain[0];
    const tip=chain[chain.length-1];
    const baseQ=testBone.quaternion.clone();

    let bestAxis=new THREE.Vector3(0,0,1);
    let bestSign=1;
    let best=Infinity;

    const axes=[
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(0,0,1)
    ];

    for(const axis of axes){
      for(const sign of [-1,1]){
        testBone.quaternion.copy(baseQ).multiply(
          new THREE.Quaternion().setFromAxisAngle(axis,.48*sign)
        );
        tfp.visibleRoot.updateMatrixWorld(true);
        const d=boneWorld(tip).distanceToSquared(palmTarget);
        if(d<best){
          best=d;
          bestAxis=axis.clone();
          bestSign=sign;
        }
      }
    }

    testBone.quaternion.copy(baseQ);
    tfp.visibleRoot.updateMatrixWorld(true);
    return {axis:bestAxis,sign:bestSign};
  }

  let gripSolver=null;

  function palmReference(){
    tfp.visibleRoot.updateMatrixWorld(true);

    const wrist=boneWorld(bones.rHand);
    const i=gripBones.index[0]?boneWorld(gripBones.index[0]):wrist.clone();
    const m=gripBones.middle[0]?boneWorld(gripBones.middle[0]):wrist.clone();
    const r=gripBones.ring[0]?boneWorld(gripBones.ring[0]):m.clone();
    const p=gripBones.pinky[0]?boneWorld(gripBones.pinky[0]):wrist.clone();

    const center=wrist.clone()
      .add(i).add(m).add(r).add(p)
      .multiplyScalar(1/5);

    return {wrist,index:i,middle:m,ring:r,pinky:p,center};
  }

  function initGripSolver(){
    if(gripSolver)return gripSolver;

    restoreGripPose();
    const palm=palmReference();

    gripSolver={
      index:detectFingerCurl(gripBones.index,palm.center),
      middle:detectFingerCurl(gripBones.middle,palm.center),
      ring:detectFingerCurl(gripBones.ring,palm.center),
      pinky:detectFingerCurl(gripBones.pinky,palm.center),
      thumb:detectFingerCurl(gripBones.thumb,palm.center)
    };

    restoreGripPose();
    return gripSolver;
  }

  function applyFingerCurl(chain,solver,amounts){
    if(!chain?.length || !solver)return;

    for(let i=0;i<chain.length;i++){
      const b=chain[i];
      const base=gripBase.get(b);
      if(!b||!base)continue;

      const amount=amounts[Math.min(i,amounts.length-1)];
      b.quaternion.copy(base).multiply(
        new THREE.Quaternion().setFromAxisAngle(
          solver.axis,
          solver.sign*amount
        )
      );
    }
  }

  function applyRealGrip(){
    const s=initGripSolver();

    // Four fingers close firmly around the handle.
    applyFingerCurl(gripBones.index,s.index,[.78,.92,.72]);
    applyFingerCurl(gripBones.middle,s.middle,[.88,1.02,.78]);
    applyFingerCurl(gripBones.ring,s.ring,[.92,1.05,.82]);
    applyFingerCurl(gripBones.pinky,s.pinky,[.86,.98,.78]);

    // Thumb crosses the index finger instead of simply curling underneath.
    applyFingerCurl(gripBones.thumb,s.thumb,[.54,.66,.48]);

    tfp.visibleRoot.updateMatrixWorld(true);
  }

  function shadowArmIK(target){
    const arm=shadowBones.rArm,fore=shadowBones.rFore,hand=shadowBones.rHand;
    if(!arm||!fore||!hand)return;

    for(let i=0;i<3;i++){
      aimBoneAt(arm,fore,target,.84);
      aimBoneAt(fore,hand,target,.94);
      tfp.shadowRoot?.updateMatrixWorld?.(true);
    }
  }

  function positionAxeThroughPalm(){
    const palm=palmReference();

    // Shaft direction follows the width of the fist (pinky -> index),
    // so the wooden handle physically passes through the closed hand.
    _yAxis.copy(palm.index).sub(palm.pinky).normalize();

    // Blade points broadly forward relative to the character, projected
    // perpendicular to the handle.
    const yaw=game.player.bodyYaw ?? game.player.yaw;
    _bodyForward.set(-Math.sin(yaw),0,-Math.cos(yaw));
    _xAxis.copy(_bodyForward)
      .addScaledVector(_yAxis,-_bodyForward.dot(_yAxis));

    if(_xAxis.lengthSq()<.01){
      _xAxis.copy(palm.middle).sub(palm.wrist);
    }
    _xAxis.normalize();

    _zAxis.crossVectors(_xAxis,_yAxis).normalize();
    _xAxis.crossVectors(_yAxis,_zAxis).normalize();

    _tmpMat.makeBasis(_xAxis,_yAxis,_zAxis);
    heldAxe.quaternion.setFromRotationMatrix(_tmpMat);

    // The hand grips the lower-middle part of the handle.
    const gripLocal=new THREE.Vector3(0,-.105,0)
      .multiplyScalar(heldAxe.scale.x)
      .applyQuaternion(heldAxe.quaternion);

    // Slight palm-depth correction prevents the handle looking pasted
    // to the outside of the fingers.
    const depth=_zAxis.clone().multiplyScalar(-.010);
    heldAxe.position.copy(palm.center).add(depth).sub(gripLocal);
  }

  function applyRockGrip(){
    const s=initGripSolver();

    // Closed-hand grip around a rounded stone.
    applyFingerCurl(gripBones.index,s.index,[.92,1.05,.80]);
    applyFingerCurl(gripBones.middle,s.middle,[1.00,1.10,.84]);
    applyFingerCurl(gripBones.ring,s.ring,[1.02,1.12,.86]);
    applyFingerCurl(gripBones.pinky,s.pinky,[.96,1.06,.84]);
    applyFingerCurl(gripBones.thumb,s.thumb,[.72,.82,.62]);

    tfp.visibleRoot.updateMatrixWorld(true);
  }

  function positionRockInPalm(){
    const palm=palmReference();

    const wrist=palm.wrist;
    const middle=palm.middle;

    // Palm-forward direction from wrist toward middle-finger base.
    _forwardHand.copy(middle).sub(wrist);
    if(_forwardHand.lengthSq()<.0001){
      _forwardHand.set(0,0,-1);
    }
    _forwardHand.normalize();

    // Palm width from pinky to index.
    _across.copy(palm.index).sub(palm.pinky);
    if(_across.lengthSq()<.0001){
      _across.set(1,0,0);
    }
    _across.normalize();

    // Palm normal; determines which side the stone sits against.
    _zAxis.crossVectors(_across,_forwardHand);
    if(_zAxis.lengthSq()<.0001){
      _zAxis.set(0,1,0);
    }
    _zAxis.normalize();

    // Keep the stone centered inside the fist/palm, with only a tiny outward
    // offset so it remains visible between the fingers.
    heldRock.position.copy(palm.center)
      .addScaledVector(_forwardHand,.018)
      .addScaledVector(_zAxis,-.010);

    bones.rHand.getWorldQuaternion(_tmpQuat);
    heldRock.quaternion.copy(_tmpQuat).multiply(
      new THREE.Quaternion().setFromEuler(
        new THREE.Euler(.20,.32,-.18,"XYZ")
      )
    );
  }

  function updateRightHandItem() {
    if(crafting){
      workshop?.updateHeld?.(null,0);
      heldAxe.visible=false;
      heldRock.visible=false;
      return;
    }

    const current=rightHandState.current;
    if(current==="spear"||current==="pickaxe"){
      heldAxe.visible=false;heldRock.visible=false;
      workshop.updateHeld(current,.016);
      return;
    }
    workshop.updateHeld(null,.016);

    if(current!=="axe" && current!=="rock"){
      heldAxe.visible=false;
      heldRock.visible=false;
      restoreGripPose();
      return;
    }

    // Existing right-arm carry pose. Attack/hit/shield full-body animations
    // remain authoritative. When a shield FBX is driving the body, this
    // routine may still attach the held item/fingers to the animated hand,
    // but it MUST NOT re-aim RightShoulder/RightArm/RightForeArm/RightHand.
    if(
      !window.gameAttack?.active &&
      !window.gamePlayerHit?.active &&
      !window.__shieldFullBodyPose
    ){
      const target=tfp.visibleRoot.localToWorld(
        current==="rock"
          ? new THREE.Vector3(.255,1.035,-.185)
          : new THREE.Vector3(.285,1.055,-.205)
      );
      armIK("right",target);
      shadowArmIK(target);
    }

    tfp.visibleRoot.updateMatrixWorld(true);
    tfp.shadowRoot?.updateMatrixWorld?.(true);

    if(current==="rock"){
      heldAxe.visible=false;
      heldRock.visible=true;
      applyRockGrip();
      positionRockInPalm();
    }else{
      heldRock.visible=false;
      heldAxe.visible=true;
      applyRealGrip();
      positionAxeThroughPalm();
    }
  }

  function updateHeldAxe() {
    // Compatibility name kept for the attack/carry systems.
    updateRightHandItem();
  }

  const workshop=window.PrimitiveWorkshop.create(THREE,{game,tfp,bones,armIK,localBone,detectFingerCurl,makeAxeModel,applyRealGrip,palmReference,positionAxeThroughPalm,heldAxe,startCraft,isCrafting:()=>crafting});
  window.gameRightHand={
    get current(){return rightHandState.current;},
    get object(){
      if(rightHandState.current==="axe")return heldAxe;
      if(rightHandState.current==="rock")return heldRock;
      return workshop.held[rightHandState.current]||null;
    },
    equip(id){
      if(!["axe","rock","spear","pickaxe"].includes(id)||workshop.attackActive||crafting)return false;
      if((id==="spear"||id==="pickaxe")&&count(id)<1&&(id!=="spear"||!window.gameInventory?.items?.some(i=>i.id==="forged_silver_spear"&&i.quantity>0)))return false;

      if(id==="rock"){
        const qty=window.gameInventory?.items?.find?.(i=>i.id==="rock")?.quantity||0;
        if(qty<1)return false;
      }

      rightHandState.current=id;
      heldAxe.visible=id==="axe";
      heldRock.visible=id==="rock";
      initGripSolver();
      updateRightHandItem();
      window.gameInventory?.refresh?.();

      const status=document.getElementById("status");
      if(status){
        status.textContent=id==="rock"
          ?"Pedra na mão direita"
          :id==="pickaxe"?"Picareta de pedra equipada"
          :id==="spear"
            ?"Lança longa equipada nas mãos"
            :"Machado equipado na mão direita";
      }
      return true;
    },
    unequip(){
      if(workshop.attackActive||crafting)return false;
      rightHandState.current=null;
      heldAxe.visible=false;
      heldRock.visible=false;
      restoreGripPose();
      tfp.visibleRoot.updateMatrixWorld(true);
      window.gameInventory?.refresh?.();
    },
    toggle(id="axe"){
      if(rightHandState.current===id)this.unequip();
      else this.equip(id);
    },
    sync(){
      updateRightHandItem();
    }
  };

  // ---------- craft animation ----------
  const HIT_TIMES=[1.15,1.95,2.75,4.75,5.35,5.95,6.55];
  const fired=new Set();

  function playHit(strength=.8) {
    try{
      const AC=window.AudioContext||window.webkitAudioContext;
      if(!AC)return;
      const ctx=playHit.ctx||(playHit.ctx=new AC());
      const osc=ctx.createOscillator();
      const gain=ctx.createGain();
      osc.type="triangle";
      osc.frequency.setValueAtTime(165+Math.random()*45,ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(70,ctx.currentTime+.07);
      gain.gain.setValueAtTime(.001,ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(.09*strength,ctx.currentTime+.004);
      gain.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.085);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime+.09);
    }catch{}
  }

  function spawnChips(localImpact) {
    if(!sparkGroup)return;
    const mat=new THREE.MeshBasicMaterial({color:0xc8a477});
    for(let i=0;i<6;i++){
      const chip=new THREE.Mesh(new THREE.TetrahedronGeometry(.009+Math.random()*.007),mat.clone());
      chip.position.copy(localImpact);
      chip.userData.v=new THREE.Vector3(
        (Math.random()-.5)*.22,
        .08+Math.random()*.15,
        (Math.random()-.5)*.18
      );
      chip.userData.life=.45+Math.random()*.2;
      sparkGroup.add(chip);
    }
  }

  function updateChips(dt) {
    if(!sparkGroup)return;
    for(let i=sparkGroup.children.length-1;i>=0;i--){
      const c=sparkGroup.children[i];
      c.userData.life-=dt;
      c.userData.v.y-=.45*dt;
      c.position.addScaledVector(c.userData.v,dt);
      c.scale.multiplyScalar(.96);
      if(c.userData.life<=0){
        c.geometry?.dispose?.();
        c.material?.dispose?.();
        sparkGroup.remove(c);
      }
    }
  }

  function strikePosition(t,start,end,rest,impact) {
    const u=clamp((t-start)/(end-start),0,1);
    // cock back -> fast impact -> recover
    let k;
    if(u<.55)k=smooth(u/.55);
    else k=1-smooth((u-.55)/.45);
    return rest.clone().lerp(impact,k);
  }

  function craftPose(elapsed,dt) {
    if(!craftRoot)return;

    releaseMovement();
    if(savedPosition){game.player.x=savedPosition.x;game.player.z=savedPosition.z;}

    // Hold the view steady and angle the eyes down to the work.
    game.player.yaw=savedYaw;
    game.player.pitch=lerp(game.player.pitch,-.48,1-Math.exp(-8*dt));

    const fy=game.camera.position.y-1.55;
    const yaw=game.player.yaw;
    const forward=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
    const right=new THREE.Vector3(Math.cos(yaw),0,-Math.sin(yaw));
    const base=new THREE.Vector3(game.player.x,fy+.92,game.player.z)
      .addScaledVector(forward,.60);

    craftRoot.position.copy(base);
    craftRoot.rotation.set(0,yaw,0);
    craftRoot.updateMatrixWorld(true);

    if(craftRecipe==="pickaxe"){craftRoot.position.addScaledVector(forward,.25);craftRoot.scale.setScalar(.78);craftRoot.updateMatrixWorld(true);}

    if(craftRecipe!=="axe"){
      workshop.pose(craftRecipe,elapsed,dt,craftRoot);
      bar.style.width=`${Math.round(clamp(elapsed/workshop.recipes[craftRecipe].duration,0,1)*100)}%`;
      return;
    }

    branch.position.set(-.08,-.03,0);
    branch.rotation.set(.08,0,-.18);

    // Left hand grips the branch during the whole construction.
    const leftTarget=localToWorld(new THREE.Vector3(-.10,-.17,.02));
    armIK("left",leftTarget);

    if(elapsed<3.35){
      stageTitle.textContent="Entalhando o galho";
      stageHint.textContent="A pedra abre lentamente uma forquilha em V.";

      const hits=[
        [0.72,1.34],[1.52,2.14],[2.32,2.94]
      ];
      const rest=new THREE.Vector3(.28,.31,.18);
      const impact=new THREE.Vector3(.035,.20,.025);
      let p=rest.clone();
      for(const [a,b] of hits){
        if(elapsed>=a&&elapsed<=b)p=strikePosition(elapsed,a,b,rest,impact);
      }
      heldStone.visible=true;
      heldStone.position.copy(p);
      heldStone.rotation.x+=dt*2.3;
      heldStone.rotation.z+=dt*1.6;
      armIK("right",localToWorld(p));

      setSplit(clamp((elapsed-.85)/2.1,0,1));
    }else if(elapsed<4.20){
      stageTitle.textContent="Encaixando a pedra";
      stageHint.textContent="A cabeça de pedra entra no V aberto no galho.";
      setSplit(1);

      const u=smooth((elapsed-3.35)/.85);
      const from=new THREE.Vector3(.25,.29,.14);
      const to=new THREE.Vector3(.015,.255,0);
      const p=from.clone().lerp(to,u);
      heldStone.visible=true;
      heldStone.position.copy(p);
      armIK("right",localToWorld(p));

      if(u>.72){
        headStone.visible=true;
        headStone.position.set(.015,.255,0);
        headStone.rotation.set(.15,.28,-.18);
        headStone.scale.set(.145,.070,.055);
      }
    }else if(elapsed<7.10){
      stageTitle.textContent="Afiando a pedra";
      stageHint.textContent="Um lascado de pedra funciona como percussor para formar a lâmina.";
      setSplit(1);
      heldStone.visible=false;
      headStone.visible=true;
      headStone.position.set(.015,.255,0);
      headStone.rotation.set(.15,.28,-.18);

      strikerShard.visible=true;
      const cycles=[
        [4.30,4.95],[4.90,5.55],[5.50,6.15],[6.10,6.75]
      ];
      const rest=new THREE.Vector3(.30,.34,.17);
      const impact=new THREE.Vector3(.10,.28,.025);
      let p=rest.clone();
      for(const [a,b] of cycles){
        if(elapsed>=a&&elapsed<=b)p=strikePosition(elapsed,a,b,rest,impact);
      }
      strikerShard.position.copy(p);
      strikerShard.rotation.x+=dt*3.4;
      strikerShard.rotation.y+=dt*1.8;
      armIK("right",localToWorld(p));

      const sharp=clamp((elapsed-4.25)/2.5,0,1);
      headStone.scale.set(
        lerp(.145,.178,sharp),
        lerp(.070,.052,sharp),
        lerp(.055,.036,sharp)
      );
      sharpEdge.visible=sharp>.42;
      sharpEdge.position.set(.115,.258,.002);
      sharpEdge.rotation.z=-.18;
      sharpEdge.scale.x=clamp((sharp-.42)/.58,0,1);
    }else{
      stageTitle.textContent="Machado pronto";
      stageHint.textContent="A mão direita assume a ferramenta.";
      setSplit(1);
      strikerShard.visible=false;
      heldStone.visible=false;
      headStone.visible=true;
      sharpEdge.visible=true;

      // Right hand moves from the work stone to the new handle.
      const rightTarget=localToWorld(new THREE.Vector3(.06,-.18,.02));
      armIK("right",rightTarget);

      const reveal=clamp((elapsed-7.10)/1.05,0,1);
      branch.rotation.z=lerp(-.18,.08,smooth(reveal));
    }

    tfp.visibleRoot.updateMatrixWorld(true);

    // Impacts / chips.
    for(let i=0;i<HIT_TIMES.length;i++){
      if(elapsed>=HIT_TIMES[i]&&!fired.has(i)){
        fired.add(i);
        playHit(i<3?.8:.62);
        spawnChips(i<3?new THREE.Vector3(.035,.20,.025):new THREE.Vector3(.105,.265,.02));
      }
    }
    updateChips(dt);

    bar.style.width=`${Math.round(clamp(elapsed/8.25,0,1)*100)}%`;
  }

  function finishCraft() {
    if(!crafting)return;

    if(craftRecipe==="axe"){
      window.gameInventory.addItem({id:"axe",name:"Machado de pedra",type:"Ferramenta",quantity:1,weight:1.1,description:"Machado artesanal: galho bifurcado e pedra afiada."});
    }else if(craftRecipe==="timber"){
      window.gameInventory.addItem({...workshop.items.slat,quantity:6});
      window.gameInventory.addItem({...workshop.items.shaft,quantity:1});
      if(reservedLog){reservedLog.picked=true;reservedLog.fallingRoot.visible=false;reservedLog.workshopReserved=false;}
    }else{
      window.gameInventory.addItem({...workshop.items[craftRecipe],quantity:1});
    }
    reserved=[];reservedLog=null;
    rightHandState.current=["axe","spear","pickaxe"].includes(craftRecipe)?craftRecipe:null;
    if(craftRecipe==="armor"&&!workshop.armorEquipped)workshop.equipArmor();
    initGripSolver();

    crafting=false;
    document.body.classList.remove("crafting-active","v211-pickaxe-craft");
    stage.classList.remove("visible");
    stage.setAttribute("aria-hidden","true");
    craftBtn.disabled=false;

    game.player.pitch=savedPitch;

    if(craftRoot){
      game.scene.remove(craftRoot);
      craftRoot.traverse(o=>{
        if(o.isMesh){
          o.geometry?.dispose?.();
          if(craftRecipe==="axe"||!Object.values(workshop.materials).includes(o.material))o.material?.dispose?.();
        }
      });
      craftRoot=null;
    }

    if(game.torchRoot)game.torchRoot.visible=torchWasVisible;
    heldRock.visible=false;
    heldAxe.visible=craftRecipe==="axe";
    updateRightHandItem();
    window.gameInventory.refresh?.();
    updateRecipe();

    const status=document.getElementById("status");
    if(status)status.textContent=craftRecipe==="timber"?"Madeira preparada • 6 talas e 1 haste longa":(workshop.items[craftRecipe]?.name||"Machado de pedra")+" concluído";
  }

  function startCraft(id="axe") {
    if(typeof id!=="string")id="axe";
    if(crafting||workshop.attackActive||window.gameAttack?.active||!workshop.canStart(id))return false;
    window.gameRightHand?.unequip?.();
    craftRecipe=id;savedPosition={x:game.player.x,z:game.player.z};
    reserved=Object.entries(workshop.recipes[id].cost).map(([key,n])=>({...window.gameInventory.items.find(i=>i.id===key),quantity:n}));
    reservedLog=id==="timber"?workshop.nearbyLog():null;
    if(reservedLog)reservedLog.workshopReserved=true;
    for(const item of reserved)window.gameInventory.removeItem(item.id,item.quantity);

    closePanel();
    crafting=true;
    savedPitch=game.player.pitch;
    savedYaw=game.player.yaw;
    craftStart=performance.now()/1000;
    impactIndex=-1;
    fired.clear();

    torchWasVisible=game.torchRoot?.visible!==false;
    if(game.torchRoot)game.torchRoot.visible=false;

    rightHandState.current=null;
    heldAxe.visible=false;
    heldRock.visible=false;
    restoreGripPose();

    if(craftRecipe==="axe")buildCraftObjects();else {craftRoot=workshop.makeProps(craftRecipe);game.scene.add(craftRoot);}

    document.body.classList.toggle("v211-pickaxe-craft",craftRecipe==="pickaxe");
    document.body.classList.add("crafting-active");
    stage.classList.add("visible");
    stage.setAttribute("aria-hidden","false");
    bar.style.width="0%";
    craftBtn.disabled=true;
    releaseMovement();

    const status=document.getElementById("status");
    if(status)status.textContent="Fabricando manualmente…";return true;
  }

  function cancelCraft(){
    if(!crafting)return false;
    if(craftRoot){game.scene.remove(craftRoot);craftRoot.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.();if(craftRecipe==="axe"||!Object.values(workshop.materials).includes(o.material))o.material?.dispose?.();}});craftRoot=null;}
    crafting=false;for(const item of reserved)window.gameInventory.addItem(item);reserved=[];
    if(reservedLog)reservedLog.workshopReserved=false;reservedLog=null;
    document.body.classList.remove("crafting-active","v211-pickaxe-craft");stage.classList.remove("visible");stage.setAttribute("aria-hidden","true");craftBtn.disabled=false;game.player.pitch=savedPitch;
    if(game.torchRoot)game.torchRoot.visible=torchWasVisible;updateRecipe();window.gameInventory.refresh?.();return true;
  }

  // Run after the actual true-first-person controller, immediately before rendering.
  window.__updateAnimatedAvatar=(...args)=>{
    originalUpdate?.(...args);
    const dt=Math.min(.05,Math.max(0,args[2]||0));

    if(crafting){
      if(game.torchRoot)game.torchRoot.visible=false;
      const elapsed=performance.now()/1000-craftStart;
      craftPose(elapsed,dt);
      if(window.gameZombie&&window.gameZombie.playerHp<=0)cancelCraft();else if(elapsed>=workshop.recipes[craftRecipe].duration)finishCraft();
    }else{
      updateHeldAxe();
    }
  };

  // ---------- controls ----------
  craftBtn.addEventListener("click",togglePanel);
  closeBtn?.addEventListener("click",closePanel);
  startBtn.addEventListener("click",startCraft);
  overlay.addEventListener("pointerdown",e=>{if(e.target===overlay)closePanel();});

  window.addEventListener("keydown",e=>{
    if(e.code==="KeyR"&&!e.repeat){
      // Ferraria e construcoes recebem R primeiro: nao abrir o craft nestes modos.
      if(window.gameForgeV222?.active||window.gameConstruction?.active||window.gameFurnace?.active||document.body.classList.contains('construction-open')||document.body.classList.contains('forge-v222-active'))return;
      e.preventDefault();
      e.stopImmediatePropagation();
      if(!crafting)togglePanel();
      return;
    }
    if(panelOpen&&e.code==="Escape"){
      e.preventDefault();
      e.stopImmediatePropagation();
      closePanel();
      return;
    }

    if(panelOpen||crafting){
      const blocked=[
        "KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
        "ShiftLeft","ShiftRight","ControlLeft","ControlRight","KeyC",
        "Space","KeyE","KeyF","KeyI","KeyQ","KeyN"
      ];
      if(blocked.includes(e.code)){
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  },true);

  // Prevent mouse-look while the hands are visibly crafting.
  document.getElementById("c")?.addEventListener("pointermove",e=>{
    if(crafting){
      if(e.code==="Escape"){e.preventDefault();e.stopImmediatePropagation();cancelCraft();return;}
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  },true);

  window.gameCraft={
    get active(){return crafting;},
    get recipe(){return craftRecipe;},
    get root(){return craftRoot;},
    get elapsed(){return crafting?performance.now()/1000-craftStart:0;},
    start:startCraft,
    cancel:cancelCraft,
    open:openPanel,
    close:closePanel,
    startAxe:startCraft,
    refresh:updateRecipe
  };

  updateRecipe();
})().catch(err=>{
  console.error("Craft visual:",err);
  const status=document.getElementById("status");
  if(status)status.textContent+=" • craft indisponível: "+String(err?.message||err);
});

