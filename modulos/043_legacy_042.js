

(async()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));

  for(let i=0;i<900;i++){
    if(
      window.gameReview?.scene &&
      window.gameReview?.trueFirstPerson?.bones?.lHand &&
      window.gameReview?.trueFirstPerson?.bones?.rHand &&
      window.gameInventory &&
      window.gameRightHand
    )break;

    await sleep(20);
  }

  const game=window.gameReview;

  if(
    !game?.scene ||
    !game?.trueFirstPerson ||
    !window.gameRightHand
  )return;

  const THREE=
    window.__THREE_MODULE ||
    await window.__LOCAL_IMPORT(
      window.FLORESTA_MODULES.three
    );

  const tfp=game.trueFirstPerson;
  const bones=tfp.bones;
  const status=document.getElementById("status");
  const equipTorchBtn=document.getElementById("equipBtn");

  const wrappedRightHand=window.gameRightHand;

  let side=null; // "left" | "right" | null
  let switchingTorch=false;

  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  function localBone(root,names){
    const wanted=
      (Array.isArray(names)?names:[names])
        .map(n=>
          String(n)
            .toLowerCase()
            .replace(/mixamorig[:_]?/g,"")
            .replace(/[^a-z0-9]/g,"")
        );

    let found=null;

    root?.traverse?.(o=>{
      if(found||!o.isBone)return;

      const n=
        String(o.name||"")
          .toLowerCase()
          .replace(/mixamorig[:_]?/g,"")
          .replace(/[^a-z0-9]/g,"");

      if(wanted.includes(n)){
        found=o;
      }
    });

    return found;
  }

  function fingerChains(prefix){
    const handPrefix=
      prefix==="left"
        ? "LeftHand"
        : "RightHand";

    return {
      index:[
        `${handPrefix}Index1`,
        `${handPrefix}Index2`,
        `${handPrefix}Index3`
      ],
      middle:[
        `${handPrefix}Middle1`,
        `${handPrefix}Middle2`,
        `${handPrefix}Middle3`
      ],
      ring:[
        `${handPrefix}Ring1`,
        `${handPrefix}Ring2`,
        `${handPrefix}Ring3`
      ],
      pinky:[
        `${handPrefix}Pinky1`,
        `${handPrefix}Pinky2`,
        `${handPrefix}Pinky3`
      ],
      thumb:[
        `${handPrefix}Thumb1`,
        `${handPrefix}Thumb2`,
        `${handPrefix}Thumb3`
      ]
    };
  }

  const handData={};

  for(const handSide of["left","right"]){
    const names=fingerChains(handSide);

    const chains={};

    for(const [key,list] of Object.entries(names)){
      chains[key]=
        list
          .map(n=>
            localBone(
              tfp.visibleRoot,
              n
            )
          )
          .filter(Boolean);
    }

    handData[handSide]={
      hand:
        handSide==="left"
          ? bones.lHand
          : bones.rHand,
      arm:
        handSide==="left"
          ? bones.lArm
          : bones.rArm,
      fore:
        handSide==="left"
          ? bones.lFore
          : bones.rFore,
      chains,
      bases:new Map(),
      solver:null
    };

    for(const chain of Object.values(chains)){
      for(const b of chain){
        if(b){
          handData[handSide]
            .bases
            .set(
              b,
              b.quaternion.clone()
            );
        }
      }
    }
  }

  function makeBranchModel(){
    const root=new THREE.Group();
    root.name="HeldBranch_V64";

    const bark=
      new THREE.MeshStandardMaterial({
        color:0x855431,
        roughness:1,
        metalness:0,
        flatShading:true
      });

    const broken=
      new THREE.MeshStandardMaterial({
        color:0xc09368,
        roughness:1,
        metalness:0,
        flatShading:true
      });

    function cylinderBetween(
      a,b,r,mat
    ){
      const d=
        b.clone().sub(a);

      const len=d.length();

      const mesh=
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            r,
            r*.80,
            len,
            8,
            2
          ),
          mat
        );

      mesh.position
        .copy(a)
        .add(b)
        .multiplyScalar(.5);

      mesh.quaternion
        .setFromUnitVectors(
          new THREE.Vector3(0,1,0),
          d.clone().normalize()
        );

      mesh.castShadow=true;
      return mesh;
    }

    // Straight enough to read as the same forest graveto, with a couple twigs.
    const a=new THREE.Vector3(0,-.38,0);
    const b=new THREE.Vector3(.015,.44,.015);

    root.add(
      cylinderBetween(
        a,b,.031,bark
      )
    );

    root.add(
      cylinderBetween(
        new THREE.Vector3(
          .006,.12,.008
        ),
        new THREE.Vector3(
          .20,.30,.085
        ),
        .016,
        bark
      )
    );

    root.add(
      cylinderBetween(
        new THREE.Vector3(
          .003,.27,.010
        ),
        new THREE.Vector3(
          -.16,.40,-.045
        ),
        .013,
        bark
      )
    );

    for(const p of[
      new THREE.Vector3(0,-.388,0),
      new THREE.Vector3(.015,.448,.015)
    ]){
      const cap=
        new THREE.Mesh(
          new THREE.CylinderGeometry(
            .025,.025,.014,8
          ),
          broken
        );

      cap.position.copy(p);
      root.add(cap);
    }

    root.traverse(o=>{
      if(o.isMesh){
        o.castShadow=true;
        o.receiveShadow=true;
      }
    });

    root.visible=false;
    root.scale.setScalar(.95);
    game.scene.add(root);

    return root;
  }

  const heldBranch=makeBranchModel();

  const tmp0=new THREE.Vector3();
  const tmp1=new THREE.Vector3();
  const tmp2=new THREE.Vector3();
  const tmp3=new THREE.Vector3();
  const palmCenter=new THREE.Vector3();
  const forward=new THREE.Vector3();
  const rightVec=new THREE.Vector3();
  const upVec=new THREE.Vector3(0,1,0);
  const xAxis=new THREE.Vector3();
  const yAxis=new THREE.Vector3();
  const zAxis=new THREE.Vector3();
  const tmpMat=new THREE.Matrix4();

  function boneWorld(
    b,
    out=new THREE.Vector3()
  ){
    b?.getWorldPosition(out);
    return out;
  }

  function restoreFingerPose(handSide){
    const d=handData[handSide];

    for(const [bone,q] of d.bases){
      bone.quaternion.copy(q);
    }
  }

  function palmReference(handSide){
    const d=handData[handSide];
    const c=d.chains;

    tfp.visibleRoot.updateMatrixWorld(true);

    const wrist=
      boneWorld(
        d.hand,
        tmp0
      ).clone();

    const index=
      boneWorld(
        c.index[0]||d.hand,
        tmp1
      ).clone();

    const middle=
      boneWorld(
        c.middle[0]||d.hand,
        tmp2
      ).clone();

    const pinky=
      boneWorld(
        c.pinky[0]||d.hand,
        tmp3
      ).clone();

    palmCenter
      .copy(wrist)
      .add(index)
      .add(middle)
      .add(pinky)
      .multiplyScalar(.25);

    return {
      wrist,
      index,
      middle,
      pinky,
      center:palmCenter.clone()
    };
  }

  function detectFingerCurl(
    handSide,
    key
  ){
    const d=handData[handSide];
    const chain=d.chains[key];

    if(!chain?.length){
      return {
        axis:new THREE.Vector3(0,0,1),
        sign:
          handSide==="left"
            ? -1
            : 1
      };
    }

    const palm=
      palmReference(handSide);

    const testBone=chain[0];
    const tip=
      chain[
        chain.length-1
      ];

    const base=
      d.bases.get(testBone)
        ?.clone();

    if(!base){
      return {
        axis:new THREE.Vector3(0,0,1),
        sign:1
      };
    }

    let best=Infinity;
    let bestAxis=
      new THREE.Vector3(0,0,1);

    let bestSign=1;

    const axes=[
      new THREE.Vector3(1,0,0),
      new THREE.Vector3(0,1,0),
      new THREE.Vector3(0,0,1)
    ];

    for(const axis of axes){
      for(const sign of[-1,1]){
        testBone.quaternion
          .copy(base)
          .multiply(
            new THREE.Quaternion()
              .setFromAxisAngle(
                axis,
                .48*sign
              )
          );

        tfp.visibleRoot
          .updateMatrixWorld(true);

        const d2=
          boneWorld(
            tip,
            new THREE.Vector3()
          )
          .distanceToSquared(
            palm.center
          );

        if(d2<best){
          best=d2;
          bestAxis=axis.clone();
          bestSign=sign;
        }
      }
    }

    testBone.quaternion.copy(base);
    tfp.visibleRoot.updateMatrixWorld(true);

    return {
      axis:bestAxis,
      sign:bestSign
    };
  }

  function ensureSolver(handSide){
    const d=handData[handSide];

    if(d.solver)return d.solver;

    restoreFingerPose(handSide);

    d.solver={};

    for(const key of[
      "index",
      "middle",
      "ring",
      "pinky",
      "thumb"
    ]){
      d.solver[key]=
        detectFingerCurl(
          handSide,
          key
        );
    }

    restoreFingerPose(handSide);
    return d.solver;
  }

  function curl(
    handSide,
    key,
    amounts
  ){
    const d=handData[handSide];
    const chain=d.chains[key];
    const solver=
      ensureSolver(handSide)[key];

    if(!chain?.length||!solver)return;

    for(let i=0;i<chain.length;i++){
      const b=chain[i];
      const base=d.bases.get(b);

      if(!base)continue;

      b.quaternion
        .copy(base)
        .multiply(
          new THREE.Quaternion()
            .setFromAxisAngle(
              solver.axis,
              solver.sign*
              amounts[
                Math.min(
                  i,
                  amounts.length-1
                )
              ]
            )
        );
    }
  }

  function applyBranchGrip(handSide){
    curl(
      handSide,
      "index",
      [.67,.83,.68]
    );

    curl(
      handSide,
      "middle",
      [.78,.94,.75]
    );

    curl(
      handSide,
      "ring",
      [.80,.97,.77]
    );

    curl(
      handSide,
      "pinky",
      [.76,.91,.74]
    );

    curl(
      handSide,
      "thumb",
      [.46,.58,.45]
    );

    tfp.visibleRoot
      .updateMatrixWorld(true);
  }

  function aimBoneAt(
    bone,
    child,
    target,
    strength=1
  ){
    if(!bone||!child)return;

    bone.updateWorldMatrix(true,true);
    child.updateWorldMatrix(true,true);

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
      target
        .clone()
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
      bone.parent
        .getWorldQuaternion(
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

    bone.quaternion
      .slerp(
        desiredLocal,
        strength
      );
  }

  function armIK(
    handSide,
    target
  ){
    const d=handData[handSide];

    if(
      !d.arm||
      !d.fore||
      !d.hand
    )return;

    for(let i=0;i<3;i++){
      aimBoneAt(
        d.arm,
        d.fore,
        target,
        .82
      );

      aimBoneAt(
        d.fore,
        d.hand,
        target,
        .94
      );

      tfp.visibleRoot
        .updateMatrixWorld(true);
    }
  }

  function branchCarryTarget(handSide){
    const x=
      handSide==="left"
        ? -.275
        : .275;

    return tfp.visibleRoot
      .localToWorld(
        new THREE.Vector3(
          x,
          1.045,
          -.205
        )
      );
  }

  function positionBranchInPalm(handSide){
    const palm=
      palmReference(handSide);

    const yaw=
      game.player.bodyYaw ??
      game.player.yaw;

    forward.set(
      -Math.sin(yaw),
      0,
      -Math.cos(yaw)
    );

    rightVec.set(
      Math.cos(yaw),
      0,
      -Math.sin(yaw)
    );

    // Stick points mostly upward with a natural forward/outward tilt.
    yAxis
      .copy(upVec)
      .multiplyScalar(.91)
      .addScaledVector(
        forward,
        .31
      )
      .addScaledVector(
        rightVec,
        handSide==="left"
          ? -.08
          : .08
      )
      .normalize();

    xAxis
      .copy(rightVec)
      .addScaledVector(
        yAxis,
        -rightVec.dot(yAxis)
      );

    if(xAxis.lengthSq()<.001){
      xAxis.set(1,0,0);
    }

    xAxis.normalize();

    zAxis
      .crossVectors(
        xAxis,
        yAxis
      )
      .normalize();

    xAxis
      .crossVectors(
        yAxis,
        zAxis
      )
      .normalize();

    tmpMat.makeBasis(
      xAxis,
      yAxis,
      zAxis
    );

    heldBranch.quaternion
      .setFromRotationMatrix(
        tmpMat
      );

    // The hand grips the lower-middle section of the branch.
    const gripLocal=
      new THREE.Vector3(
        0,
        -.16,
        0
      )
      .multiplyScalar(
        heldBranch.scale.x
      )
      .applyQuaternion(
        heldBranch.quaternion
      );

    heldBranch.position
      .copy(
        palm.center
      )
      .sub(
        gripLocal
      );

    heldBranch.visible=true;
  }

  function branchQty(){
    return (
      window.gameInventory
        ?.items
        ?.find?.(
          i=>i.id==="branch"
        )
        ?.quantity
      || 0
    );
  }

  function torchEquipped(){
    try{
      return !!game.isEquipped?.();
    }catch{
      return false;
    }
  }

  function storeTorchForLeftBranch(){
    if(!torchEquipped())return;

    switchingTorch=true;

    try{
      equipTorchBtn?.click();
    }finally{
      switchingTorch=false;
    }
  }

  function equipBranch(handSide){
    if(
      handSide!=="left" &&
      handSide!=="right"
    )return false;

    if(branchQty()<1)return false;

    // Same graveto switches hands instead of duplicating.
    side=null;
    heldBranch.visible=false;

    restoreFingerPose("left");
    restoreFingerPose("right");

    if(handSide==="right"){
      // Right hand must be free of axe/rock/hammer.
      wrappedRightHand.unequip?.();
    }else{
      // Torch owns the left hand, so storing it is automatic.
      storeTorchForLeftBranch();
    }

    side=handSide;

    ensureSolver(handSide);
    applyBranchGrip(handSide);
    positionBranchInPalm(handSide);

    window.gameInventory?.refresh?.();

    if(status){
      status.textContent=
        handSide==="left"
          ? "Graveto equipado na mão esquerda"
          : "Graveto equipado na mão direita";
    }

    return true;
  }

  function unequipBranch(){
    if(!side)return false;

    const oldSide=side;

    side=null;
    heldBranch.visible=false;

    restoreFingerPose(oldSide);

    tfp.visibleRoot
      .updateMatrixWorld(true);

    window.gameInventory?.refresh?.();

    if(status){
      status.textContent=
        "Graveto guardado";
    }

    return true;
  }

  function toggleBranch(handSide){
    if(side===handSide){
      return unequipBranch();
    }

    return equipBranch(handSide);
  }

  // Wrap current right-hand API without changing axe/rock/hammer internals.
  window.gameRightHand={
    get current(){
      return side==="right"
        ? "branch"
        : wrappedRightHand.current;
    },

    get object(){
      return side==="right"
        ? heldBranch
        : wrappedRightHand.object;
    },

    equip(id){
      if(id==="branch"){
        return equipBranch("right");
      }

      if(side==="right"){
        unequipBranch();
      }

      return wrappedRightHand.equip?.(id);
    },

    unequip(){
      if(side==="right"){
        return unequipBranch();
      }

      return wrappedRightHand.unequip?.();
    },

    toggle(id="axe"){
      if(id==="branch"){
        return toggleBranch("right");
      }

      if(this.current===id){
        return this.unequip();
      }

      return this.equip(id);
    },

    sync(){
      wrappedRightHand.sync?.();

      if(side==="right"){
        applyBranchGrip("right");
        positionBranchInPalm("right");
      }
    }
  };

  // If the player presses E / clicks Equip Torch while a graveto is in the
  // left hand, free the hand before the torch is equipped.
  equipTorchBtn?.addEventListener(
    "click",
    ()=>{
      if(
        side==="left" &&
        !switchingTorch
      ){
        unequipBranch();
      }
    },
    true
  );

  function blockedByOtherSystem(){
    return !!(
      window.gameCraft?.active ||
      document.body
        .classList
        .contains(
          "crafting-active"
        ) ||
      window.gameLumber?.carrying
    );
  }

  const previousUpdate=
    window.__updateAnimatedAvatar;

  window.__updateAnimatedAvatar=(...args)=>{
    previousUpdate?.(...args);

    if(!side){
      heldBranch.visible=false;
      return;
    }

    if(branchQty()<1){
      unequipBranch();
      return;
    }

    if(blockedByOtherSystem()){
      heldBranch.visible=false;
      return;
    }

    heldBranch.visible=true;

    const attackActive=
      !!window.gameAttack?.active;

    const hitActive=
      !!window.gamePlayerHit?.active;

    // Full-body attack/damage animations are allowed to own the arm.
    // In that case the graveto simply follows the animated hand.
    if(
      !attackActive &&
      !hitActive
    ){
      armIK(
        side,
        branchCarryTarget(side)
      );
    }

    applyBranchGrip(side);
    positionBranchInPalm(side);
  };

  window.gameBranchHands={
    version:"V64",

    get side(){
      return side;
    },

    get equipped(){
      return !!side;
    },

    get object(){
      return heldBranch;
    },

    equip:equipBranch,
    unequip:unequipBranch,
    toggle:toggleBranch,

    left(){
      return equipBranch("left");
    },

    right(){
      return equipBranch("right");
    }
  };

  window.gameInventory?.refresh?.();

  if(status){
    status.textContent=
      "Graveto pronto • escolha mão esquerda ou direita no inventário";
  }
})().catch(err=>{
  console.error(
    "V64 Graveto nas mãos:",
    err
  );

  const status=
    document.getElementById(
      "status"
    );

  if(status){
    status.textContent=
      "Falha ao equipar graveto: "+
      String(
        err?.message||err
      );
  }
});

