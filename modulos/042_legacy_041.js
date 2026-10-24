
(async()=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};

  for(let i=0;i<900;i++){
    if(
      window.gameReview?.scene&&
      window.gameReview?.trueFirstPerson?.bones?.rHand&&
      window.gameInventory&&
      window.gameRightHand&&
      window.gameCraft
    )break;
    await sleep(20);
  }

  const game=window.gameReview;
  if(!game?.scene||!window.gameRightHand)return;

  const THREE=window.__THREE_MODULE||await window.__LOCAL_IMPORT(window.FLORESTA_MODULES.three);
  const tfp=game.trueFirstPerson;
  const bones=tfp.bones;
  const status=document.getElementById('status');
  const stage=document.getElementById('craftStage');
  const stageTitle=document.getElementById('craftStageTitle');
  const stageHint=document.getElementById('craftStageHint');
  const progress=document.getElementById('craftProgressBar');
  const hammerBtn=document.getElementById('craftHammerBtn');
  const hint=document.getElementById('attackHint');
  const canvas=document.getElementById('c');

  const baseRightHand=window.gameRightHand;
  const baseCraft=window.gameCraft;

  const ropeDark=new THREE.MeshStandardMaterial({color:0x4d2d1b,roughness:1,metalness:0});
  const ropeMid=new THREE.MeshStandardMaterial({color:0x6c4328,roughness:1,metalness:0});
  const ropeLite=new THREE.MeshStandardMaterial({color:0x845735,roughness:.98,metalness:0});
  const woodMat=new THREE.MeshStandardMaterial({color:0x9b673d,roughness:1,flatShading:true});
  const stoneMat=new THREE.MeshStandardMaterial({color:0x74736d,roughness:1,flatShading:true});

  function irregularStone(scale=1){
    const g=new THREE.DodecahedronGeometry(.12,1);
    const p=g.attributes.position;
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),z=p.getZ(i);
      const n=1+.08*Math.sin(i*2.73)+.045*Math.cos(i*5.17);
      p.setXYZ(i,x*n,y*n,z*n);
    }
    g.computeVertexNormals();
    const m=new THREE.Mesh(g,stoneMat.clone());
    m.scale.set(.98*scale,.70*scale,.78*scale);
    m.castShadow=true;
    return m;
  }

  function ropeLoop(center,rx,rz,tiltZ=0,phase=0,mat=ropeMid){
    const pts=[];
    const rot=new THREE.Euler(.04,0,tiltZ,'XYZ');
    for(let i=0;i<=42;i++){
      const a=phase+(i/42)*Math.PI*2;
      const v=new THREE.Vector3(
        Math.cos(a)*rx,
        0,
        Math.sin(a)*rz
      );
      v.applyEuler(rot);
      v.add(center);
      v.y+=Math.sin(a*2.1+phase)*.004;
      pts.push(v);
    }
    const curve=new THREE.CatmullRomCurve3(pts,false,'centripetal');
    const geo=new THREE.TubeGeometry(curve,42,.0062,6,false);
    const mesh=new THREE.Mesh(geo,mat);
    mesh.castShadow=true;
    mesh.userData.fullIndexCount=geo.index?.count||0;
    return mesh;
  }

  function handleLoop(y,r=.041,tilt=.05,phase=0,mat=ropeDark){
    return ropeLoop(new THREE.Vector3(0,y,0),r,r*.92,tilt,phase,mat);
  }

  function makeLashingGroup(){
    const g=new THREE.Group();
    g.name='HammerCordLashing';
    const pieces=[];

    // HEAD: several THIN independent cords, like the reference photo.
    const headYs=[.342,.354,.366,.378,.390];
    headYs.forEach((y,i)=>{
      const m=ropeLoop(
        new THREE.Vector3(0,y,0),
        .132-i*.002,
        .077+i*.001,
        (i%2?-.18:.18)+(i-2)*.025,
        i*.36,
        i%3===0?ropeDark:i%3===1?ropeMid:ropeLite
      );
      g.add(m);pieces.push(m);
    });

    // CROSSING LINES over the stone, not a flat ribbon.
    [-.42,.42].forEach((tilt,k)=>{
      for(let i=0;i<2;i++){
        const m=ropeLoop(
          new THREE.Vector3(0,.360+i*.010,0),
          .128,
          .080,
          tilt,
          .35+i*.55,
          k?ropeMid:ropeDark
        );
        g.add(m);pieces.push(m);
      }
    });

    // NECK: cord locking stone to handle.
    [.268,.252,.236,.220].forEach((y,i)=>{
      const m=handleLoop(y,.043+i*.001,(i%2?.10:-.10),i*.3,i%2?ropeLite:ropeDark);
      g.add(m);pieces.push(m);
    });

    // LOWER HANDLE: same fine cord visual as photo.
    [-.225,-.205,-.185,-.165,-.145,-.125].forEach((y,i)=>{
      const m=handleLoop(y,.0395,(i%2?.09:-.09),i*.28,i%3===0?ropeDark:ropeMid);
      g.add(m);pieces.push(m);
    });

    g.userData.pieces=pieces;
    return g;
  }

  function setLashingProgress(group,value){
    const pieces=group?.userData?.pieces||[];
    const scaled=clamp(value,0,1)*pieces.length;
    pieces.forEach((m,i)=>{
      const local=clamp(scaled-i,0,1);
      const count=m.userData.fullIndexCount||m.geometry.index?.count||0;
      m.visible=local>.001;
      m.geometry.setDrawRange(0,Math.floor(count*local));
    });
  }

  function makeHammerModel(){
    if(window.makeMeshyStoneHammerV211)return window.makeMeshyStoneHammerV211(THREE);
    const root=new THREE.Group();
    root.name='PrimitiveHammer';

    const handle=new THREE.Mesh(
      new THREE.CylinderGeometry(.032,.039,.82,12,8),
      woodMat.clone()
    );
    handle.position.y=-.035;
    handle.castShadow=true;
    root.add(handle);

    // Slight natural bend/wooden boss near the top.
    const boss=new THREE.Mesh(
      new THREE.CylinderGeometry(.048,.036,.20,10,4),
      woodMat.clone()
    );
    boss.position.set(0,.285,0);
    boss.rotation.z=.10;
    boss.castShadow=true;
    root.add(boss);

    const stoneA=irregularStone(1.16);
    stoneA.position.set(-.055,.365,.004);
    stoneA.rotation.set(.16,.20,-.10);
    root.add(stoneA);

    const stoneB=irregularStone(.86);
    stoneB.position.set(.060,.370,-.005);
    stoneB.rotation.set(-.06,-.28,.18);
    root.add(stoneB);

    const lash=makeLashingGroup();
    root.add(lash);
    setLashingProgress(lash,1);

    root.userData.lashing=lash;
    return root;
  }

  // ---------- REAL EXISTING HAND GRIP ----------
  function localBone(root,names){
    const wanted=(Array.isArray(names)?names:[names]).map(n=>String(n).toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,''));
    let found=null;
    root?.traverse?.(o=>{
      if(found||!o.isBone)return;
      const n=String(o.name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'');
      if(wanted.includes(n))found=o;
    });
    return found;
  }
  const chains={
    index:['RightHandIndex1','RightHandIndex2','RightHandIndex3'],
    middle:['RightHandMiddle1','RightHandMiddle2','RightHandMiddle3'],
    ring:['RightHandRing1','RightHandRing2','RightHandRing3'],
    pinky:['RightHandPinky1','RightHandPinky2','RightHandPinky3'],
    thumb:['RightHandThumb1','RightHandThumb2','RightHandThumb3']
  };

  const leftChains={
    index:['LeftHandIndex1','LeftHandIndex2','LeftHandIndex3'],
    middle:['LeftHandMiddle1','LeftHandMiddle2','LeftHandMiddle3'],
    ring:['LeftHandRing1','LeftHandRing2','LeftHandRing3'],
    pinky:['LeftHandPinky1','LeftHandPinky2','LeftHandPinky3'],
    thumb:['LeftHandThumb1','LeftHandThumb2','LeftHandThumb3']
  };

  for(const k of Object.keys(chains)){
    chains[k]=chains[k]
      .map(n=>localBone(tfp.visibleRoot,n))
      .filter(Boolean);
  }

  for(const k of Object.keys(leftChains)){
    leftChains[k]=leftChains[k]
      .map(n=>localBone(tfp.visibleRoot,n))
      .filter(Boolean);
  }

  const gripBase=new Map();

  [
    ...Object.values(chains).flat(),
    ...Object.values(leftChains).flat()
  ].forEach(b=>{
    if(b&&!gripBase.has(b)){
      gripBase.set(
        b,
        b.quaternion.clone()
      );
    }
  });

  function restoreHammerGrip(){
    for(const [b,q] of gripBase){
      b.quaternion.copy(q);
    }
  }

  function curl(chain,amounts,sign=-1){
    if(!chain.length)return;

    chain.forEach((b,i)=>{
      const q=gripBase.get(b);
      if(!q)return;

      b.quaternion
        .copy(q)
        .multiply(
          new THREE.Quaternion()
            .setFromAxisAngle(
              new THREE.Vector3(0,0,1),
              sign*
              amounts[
                Math.min(
                  i,
                  amounts.length-1
                )
              ]
            )
        );
    });
  }

  function applyHammerGrip(twoHands=false){
    curl(chains.index,[.68,.86,.70],-1);
    curl(chains.middle,[.80,.96,.76],-1);
    curl(chains.ring,[.84,1.00,.80],-1);
    curl(chains.pinky,[.80,.94,.76],-1);
    curl(chains.thumb,[.45,.58,.44],-1);

    if(twoHands){
      // Mirrored left-hand grip around the same handle.
      curl(leftChains.index,[.64,.82,.68],1);
      curl(leftChains.middle,[.78,.94,.76],1);
      curl(leftChains.ring,[.82,.98,.78],1);
      curl(leftChains.pinky,[.78,.92,.74],1);
      curl(leftChains.thumb,[.42,.56,.42],1);
    }else{
      for(const chain of Object.values(leftChains)){
        for(const b of chain){
          const q=gripBase.get(b);
          if(q)b.quaternion.copy(q);
        }
      }
    }

    tfp.visibleRoot.updateMatrixWorld(true);
  }

  // Share the native game factory without touching the observer's inventory.
  (window.FlorestaEquipmentModels ||= {}).hammer=()=>makeHammerModel();
  const heldHammer=makeHammerModel();
  heldHammer.visible=false;
  heldHammer.scale.setScalar(.78);
  game.scene.add(heldHammer);

  const tmpMat=new THREE.Matrix4(), qTmp=new THREE.Quaternion();
  const pW=new THREE.Vector3(),pI=new THREE.Vector3(),pM=new THREE.Vector3(),pP=new THREE.Vector3();
  const axisX=new THREE.Vector3(),axisY=new THREE.Vector3(),axisZ=new THREE.Vector3(),bodyForward=new THREE.Vector3();

  function boneWorld(b,out=new THREE.Vector3()){b?.getWorldPosition(out);return out}
  function positionHammerInPalm(extraRot=null){
    tfp.visibleRoot.updateMatrixWorld(true);
    boneWorld(bones.rHand,pW);
    boneWorld(chains.index[0]||bones.rHand,pI);
    boneWorld(chains.middle[0]||bones.rHand,pM);
    boneWorld(chains.pinky[0]||bones.rHand,pP);
    const center=pW.clone().add(pI).add(pM).add(pP).multiplyScalar(.25);
    axisY.copy(pI).sub(pP); if(axisY.lengthSq()<.0001)axisY.set(1,0,0); axisY.normalize();
    const yaw=game.player.bodyYaw??game.player.yaw;
    bodyForward.set(-Math.sin(yaw),0,-Math.cos(yaw));
    axisX.copy(bodyForward).addScaledVector(axisY,-bodyForward.dot(axisY));
    if(axisX.lengthSq()<.01)axisX.copy(pM).sub(pW);
    axisX.normalize();
    axisZ.crossVectors(axisX,axisY).normalize();
    axisX.crossVectors(axisY,axisZ).normalize();
    tmpMat.makeBasis(axisX,axisY,axisZ);
    heldHammer.quaternion.setFromRotationMatrix(tmpMat);
    if(extraRot)heldHammer.quaternion.multiply(extraRot);
    const gripLocal=new THREE.Vector3(0,-.205,0).multiplyScalar(heldHammer.scale.x).applyQuaternion(heldHammer.quaternion);
    heldHammer.position.copy(center).addScaledVector(axisZ,-.008).sub(gripLocal);
  }

  function aimBoneAt(bone,child,target,strength=1){
    if(!bone||!child)return;
    bone.updateWorldMatrix(true,true); child.updateWorldMatrix(true,true);
    const bp=new THREE.Vector3(),cp=new THREE.Vector3(),worldQ=new THREE.Quaternion(),parentQ=new THREE.Quaternion();
    bone.getWorldPosition(bp); child.getWorldPosition(cp); bone.getWorldQuaternion(worldQ);
    const current=cp.sub(bp).normalize(), desired=target.clone().sub(bp).normalize();
    if(current.lengthSq()<.5||desired.lengthSq()<.5)return;
    const delta=new THREE.Quaternion().setFromUnitVectors(current,desired);
    const desiredWorld=delta.multiply(worldQ.clone());
    if(bone.parent)bone.parent.getWorldQuaternion(parentQ);else parentQ.identity();
    const desiredLocal=parentQ.invert().multiply(desiredWorld);
    bone.quaternion.slerp(desiredLocal,strength);
  }
  function armIK(side,target){
    const arm=side==='left'?bones.lArm:bones.rArm;
    const fore=side==='left'?bones.lFore:bones.rFore;
    const hand=side==='left'?bones.lHand:bones.rHand;

    if(!arm||!fore||!hand)return;

    for(let i=0;i<3;i++){
      aimBoneAt(arm,fore,target,.86);
      aimBoneAt(fore,hand,target,.95);
      tfp.visibleRoot.updateMatrixWorld(true);
    }
  }

  const twoHandRight=new THREE.Vector3();
  const twoHandLeft=new THREE.Vector3();
  const twoHandAxis=new THREE.Vector3();
  const hammerUp=new THREE.Vector3(0,1,0);
  const hammerGripLocal=new THREE.Vector3(0,-.205,0);

  function positionHammerTwoHanded(){
    tfp.visibleRoot.updateMatrixWorld(true);

    bones.rHand?.getWorldPosition(twoHandRight);
    bones.lHand?.getWorldPosition(twoHandLeft);

    twoHandAxis
      .copy(twoHandLeft)
      .sub(twoHandRight);

    if(twoHandAxis.lengthSq()<.0001){
      positionHammerInPalm();
      return;
    }

    twoHandAxis.normalize();

    // Local hammer Y axis runs along the wooden handle.
    heldHammer.quaternion
      .setFromUnitVectors(
        hammerUp,
        twoHandAxis
      );

    // Pin the normal right-hand grip point to the actual right palm.
    const offset=
      hammerGripLocal
        .clone()
        .multiplyScalar(
          heldHammer.scale.x
        )
        .applyQuaternion(
          heldHammer.quaternion
        );

    heldHammer.position
      .copy(twoHandRight)
      .sub(offset);

    heldHammer.visible=true;
  }

  function bodyLean(pitch=0,yaw=0){
    // Applied after the normal avatar animation each frame, so it does not
    // replace walking/standing animation — it only layers the hammer force.
    const qPitch=
      new THREE.Quaternion()
        .setFromAxisAngle(
          new THREE.Vector3(1,0,0),
          pitch
        );

    const qYaw=
      new THREE.Quaternion()
        .setFromAxisAngle(
          new THREE.Vector3(0,1,0),
          yaw
        );

    if(bones.spine1){
      bones.spine1.quaternion
        .multiply(
          new THREE.Quaternion()
            .identity()
            .slerp(qPitch,.32)
        )
        .multiply(
          new THREE.Quaternion()
            .identity()
            .slerp(qYaw,.28)
        );
    }

    if(bones.spine2){
      bones.spine2.quaternion
        .multiply(
          new THREE.Quaternion()
            .identity()
            .slerp(qPitch,.62)
        )
        .multiply(
          new THREE.Quaternion()
            .identity()
            .slerp(qYaw,.54)
        );
    }

    tfp.visibleRoot.updateMatrixWorld(true);
  }

  function hammerHeadWorld(){
    const p=
      heldHammer.localToWorld(
        new THREE.Vector3(
          0,
          .365,
          0
        )
      );

    return p;
  }

  let hammerEquipped=false;
  let hammerCrafting=false;
  let craftStart=0;
  let savedYaw=0,savedPitch=0,torchWasVisible=true;
  let craftRoot=null, craftHandle=null, craftStone=null, craftLash=null;
  let action={
    type:null,
    start:0,
    duration:0,
    impact:false,
    swingId:0
  };
  let hammerSwingSerial=0;

  function count(id){return window.gameInventory.items.find(i=>i.id===id)?.quantity||0}
  function hasHammer(){return count('hammer')>0}

  function updateHammerRecipe(){
    const b=count('branch'),r=count('rock'),v=count('vine');
    const map=[['costHammerBranch',b],['costHammerRock',r],['costHammerVine',v]];
    map.forEach(([id,n])=>{
      const el=document.getElementById(id); if(!el)return;
      el.classList.toggle('ok',n>=1);el.classList.toggle('missing',n<1);
      const s=el.querySelector('span');if(s)s.textContent=`${n}/1`;
    });
    if(hammerBtn){hammerBtn.disabled=hammerCrafting||b<1||r<1||v<1;hammerBtn.textContent=b&&r&&v?'Fabricar martelo':'Faltam materiais'}
  }

  function releaseMovement(){
    game.keys?.clear?.(); if(game.stick){game.stick.x=0;game.stick.y=0}
    for(const code of ['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','ControlLeft','ControlRight','KeyC','Space']){
      window.dispatchEvent(new KeyboardEvent('keyup',{code,bubbles:true}));
    }
  }

  // Extend, do not replace the existing axe/rock internals.
  window.gameRightHand={
    get current(){return hammerEquipped?'hammer':baseRightHand.current},
    get object(){return hammerEquipped?heldHammer:baseRightHand.object},
    equip(id){
      if(id==='hammer'){
        if(!hasHammer())return false;
        baseRightHand.unequip(); hammerEquipped=true; heldHammer.visible=true; applyHammerGrip(); positionHammerInPalm();
        window.gameInventory.refresh?.(); if(status)status.textContent='Martelo de pedra equipado na mão direita'; return true;
      }
      hammerEquipped=false;heldHammer.visible=false;restoreHammerGrip();return baseRightHand.equip(id);
    },
    unequip(){
      if(hammerEquipped){hammerEquipped=false;heldHammer.visible=false;restoreHammerGrip();window.gameInventory.refresh?.();return true}
      return baseRightHand.unequip();
    },
    toggle(id='axe'){if(this.current===id)return this.unequip();return this.equip(id)},
    sync(){
      if(hammerEquipped){baseRightHand.sync?.();applyHammerGrip();positionHammerInPalm();return}
      return baseRightHand.sync?.();
    }
  };

  function buildHammerCraftObjects(){
    craftRoot=new THREE.Group();craftRoot.name='HammerCraftSequence';game.scene.add(craftRoot);
    craftHandle=new THREE.Mesh(new THREE.CylinderGeometry(.032,.039,.82,12,8),woodMat.clone());
    craftHandle.position.y=-.035;craftHandle.castShadow=true;craftRoot.add(craftHandle);
    craftStone=irregularStone(1.14);craftStone.position.set(.30,.25,.15);craftStone.rotation.set(.35,.1,.45);craftRoot.add(craftStone);
    craftLash=makeLashingGroup();craftRoot.add(craftLash);setLashingProgress(craftLash,0);
  }
  function localToWorld(v){return craftRoot.localToWorld(v.clone())}

  function hammerCraftPose(elapsed,dt){
    if(!craftRoot)return;
    releaseMovement();
    game.player.yaw=savedYaw;
    game.player.pitch=lerp(game.player.pitch,-.46,1-Math.exp(-8*dt));
    const yaw=game.player.yaw;
    const f=new THREE.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
    const base=new THREE.Vector3(game.player.x,game.camera.position.y-.63,game.player.z).addScaledVector(f,.62);
    craftRoot.position.copy(base);craftRoot.rotation.set(0,yaw,0);craftRoot.updateMatrixWorld(true);

    const leftTarget=localToWorld(new THREE.Vector3(-.055,-.17,.015));
    armIK('left',leftTarget);

    if(elapsed<1.2){
      stageTitle.textContent='Posicionando o galho';stageHint.textContent='O cabo é segurado pelo próprio braço do personagem.';
      craftStone.visible=false;setLashingProgress(craftLash,0);
      armIK('right',localToWorld(new THREE.Vector3(.25,.18,.18)));
    }else if(elapsed<2.8){
      stageTitle.textContent='Encaixando a pedra';stageHint.textContent='A cabeça de pedra é pressionada contra o topo do cabo.';
      craftStone.visible=true;
      const u=smooth((elapsed-1.2)/1.6);
      craftStone.position.lerpVectors(new THREE.Vector3(.30,.25,.15),new THREE.Vector3(0,.365,0),u);
      craftStone.rotation.set(lerp(.35,.10,u),lerp(.1,.2,u),lerp(.45,-.08,u));
      armIK('right',localToWorld(craftStone.position.clone().add(new THREE.Vector3(.07,-.02,.04))));
    }else if(elapsed<3.65){
      stageTitle.textContent='Pegando o cipó';stageHint.textContent='O cipó será usado como várias cordas finas, não como uma fita.';
      craftStone.position.set(0,.365,0);craftStone.rotation.set(.10,.2,-.08);
      armIK('right',localToWorld(new THREE.Vector3(.28,.02,.20)));
    }else if(elapsed<8.75){
      stageTitle.textContent='Amarrando a cabeça do martelo';stageHint.textContent='Voltas finas de cipó cruzam a pedra e apertam o cabo.';
      craftStone.position.set(0,.365,0);craftStone.rotation.set(.10,.2,-.08);
      const u=clamp((elapsed-3.65)/5.10,0,1);setLashingProgress(craftLash,u);
      const a=u*Math.PI*2*7.5;
      const target=new THREE.Vector3(.15*Math.cos(a),.33+.055*Math.sin(a*.55),.10*Math.sin(a));
      armIK('right',localToWorld(target));
    }else if(elapsed<9.75){
      stageTitle.textContent='Apertando o cipó';stageHint.textContent='A amarração é puxada para travar pedra e cabo.';
      setLashingProgress(craftLash,1);
      const u=smooth((elapsed-8.75));
      armIK('right',localToWorld(new THREE.Vector3(.15+.15*u,.27-.05*u,.08)));
    }else{
      stageTitle.textContent='Martelo pronto';stageHint.textContent='A mão direita assume o martelo.';
      setLashingProgress(craftLash,1);
      armIK('right',localToWorld(new THREE.Vector3(.04,-.18,.02)));
    }
    progress.style.width=`${Math.round(clamp(elapsed/10.8,0,1)*100)}%`;
  }

  function finishHammerCraft(){
    if(!hammerCrafting)return;
    window.gameInventory.removeItem('branch',1);window.gameInventory.removeItem('rock',1);window.gameInventory.removeItem('vine',1);
    window.gameInventory.addItem({id:'hammer',name:'Martelo de pedra',type:'Ferramenta pesada',quantity:1,weight:1.8,description:'Pedra assentada em cabo de madeira e travada com cipó. Impacto de 52; ataque lento.'});
    hammerCrafting=false;document.body.classList.remove('crafting-active');stage.classList.remove('visible');stage.setAttribute('aria-hidden','true');
    game.player.pitch=savedPitch;if(game.torchRoot)game.torchRoot.visible=torchWasVisible;
    if(craftRoot){game.scene.remove(craftRoot);craftRoot.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.()}});craftRoot=null}
    window.gameRightHand.equip('hammer');window.gameInventory.refresh?.();updateHammerRecipe();
    if(status)status.textContent='Martelo de pedra fabricado • equipado';
  }

  function startHammerCraft(){
    if(hammerCrafting||baseCraft.active||count('branch')<1||count('rock')<1||count('vine')<1)return false;
    baseCraft.close?.();window.gameRightHand.unequip();
    hammerCrafting=true;craftStart=performance.now()/1000;savedYaw=game.player.yaw;savedPitch=game.player.pitch;
    torchWasVisible=game.torchRoot?.visible!==false;if(game.torchRoot)game.torchRoot.visible=false;
    buildHammerCraftObjects();document.body.classList.add('crafting-active');stage.classList.add('visible');stage.setAttribute('aria-hidden','false');progress.style.width='0%';releaseMovement();
    if(status)status.textContent='Fabricando martelo primitivo…';return true;
  }

  // Axe craft can replace the equipped hammer cleanly.
  document.getElementById('craftAxeBtn')?.addEventListener('pointerdown',()=>{if(hammerEquipped)window.gameRightHand.unequip()},{capture:true});
  hammerBtn?.addEventListener('click',startHammerCraft);

  // Wrap craft public API so every gameplay blocker sees hammer crafting too.
  window.gameCraft={
    get active(){return !!(baseCraft.active||hammerCrafting)},
    start:(...a)=>baseCraft.start?.(...a),cancel:(...a)=>baseCraft.cancel?.(...a),
    get recipe(){return baseCraft.recipe},get root(){return baseCraft.root},get elapsed(){return baseCraft.elapsed},
    open:(...a)=>baseCraft.open?.(...a),close:(...a)=>baseCraft.close?.(...a),startAxe:(...a)=>baseCraft.startAxe?.(...a),
    startHammer:startHammerCraft,refresh(){baseCraft.refresh?.();updateHammerRecipe()}
  };

  function actionBlocked(){return !!(window.gameInventory?.isOpen||window.gameCraft?.active||document.body.classList.contains('crafting-active'))}
  function beginHammerAction(type){
    if(
      !hammerEquipped||
      hammerCrafting||
      action.type||
      actionBlocked()
    )return false;

    if(type==='swing'){
      releaseMovement();

      // V63: the actual skeleton motion comes from the already-proven
      // full-body downward melee FBX. This avoids the broken/dislocated
      // two-arm procedural IK seen in the V62 recording.
      return !!window.gameAttack
        ?.hammerAttack?.();
    }

    action={
      type,
      start:performance.now()/1000,
      duration:2.35,
      impact:false,
      swingId:0
    };

    return true;
  }

  function hammerActionPose(now){
    if(!action.type)return false;

    const t=
      now-action.start;

    const u=
      clamp(
        t/action.duration,
        0,1
      );

    // Only the V61 inspection pose remains procedural.
    // The actual hammer strike is handled by the full-body FBX attack system.
    const a=
      Math.sin(
        u*Math.PI
      );

    const target=
      tfp.visibleRoot
        .localToWorld(
          new THREE.Vector3(
            .24-a*.14,
            1.06+a*.19,
            -.205-a*.23
          )
        );

    const twist=
      new THREE.Quaternion()
        .setFromEuler(
          new THREE.Euler(
            .25*a,
            .8*
            Math.sin(
              u*Math.PI*2
            ),
            -.18*a
          )
        );

    armIK(
      'right',
      target
    );

    applyHammerGrip(false);

    positionHammerInPalm(
      twist
    );

    if(t>=action.duration){
      action={
        type:null,
        start:0,
        duration:0,
        impact:false,
        swingId:0
      };

      restoreHammerGrip();

      if(status){
        status.textContent=
          'Martelo pronto';
      }
    }

    return true;
  }
  const previousUpdate=window.__updateAnimatedAvatar;
  window.__updateAnimatedAvatar=(...args)=>{
    previousUpdate?.(...args);
    const dt=Math.min(.05,Math.max(0,args[2]||0));
    if(hammerCrafting){
      heldHammer.visible=false;if(game.torchRoot)game.torchRoot.visible=false;
      const elapsed=performance.now()/1000-craftStart;hammerCraftPose(elapsed,dt);if(elapsed>=10.8)finishHammerCraft();return;
    }
    if(!hammerEquipped){
      heldHammer.visible=false;
      restoreHammerGrip();
      return;
    }

    heldHammer.visible=true;

    // During the V63 hammer attack the previous update has already evaluated
    // the full-body FBX. Do NOT solve arm IK again here; that was what broke
    // the elbows/shoulders in V62. Just attach the existing V61 hammer to the
    // animated right palm.
    if(
      window.gameAttack?.active &&
      window.gameAttack?.weapon==="hammer"
    ){
      applyHammerGrip(false);
      positionHammerInPalm();
      return;
    }

    if(
      !hammerActionPose(
        performance.now()/1000
      )
    ){
      const target=
        tfp.visibleRoot
          .localToWorld(
            new THREE.Vector3(
              .285,
              1.055,
              -.205
            )
          );

      armIK(
        'right',
        target
      );

      applyHammerGrip(false);
      positionHammerInPalm();
    }
  };

  // Route the existing desktop/mobile attack control to the hammer when needed.
  for(let i=0;i<300&&!window.gameAttack;i++)await sleep(20);
  if(window.gameAttack){
    const axeAttack=
      window.gameAttack
        .attack
        .bind(window.gameAttack);

    window.gameAttack.attack=()=>{
      return window.gameRightHand?.current==='hammer'
        ? window.gameAttack.hammerAttack?.()
        : axeAttack();
    };
  }

  canvas?.addEventListener('pointerdown',e=>{
    if(e.pointerType!=='mouse'||e.button!==0)return;
    if(document.pointerLockElement!==canvas)return;
    if(window.gameRightHand?.current==='hammer'){
      window.gameAttack?.hammerAttack?.();
    }
  },true);

  window.addEventListener('keydown',e=>{
    if(hammerCrafting){
      const blocked=['KeyW','KeyA','KeyS','KeyD','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','ShiftLeft','ShiftRight','ControlLeft','ControlRight','Space','KeyI','KeyQ','KeyR'];
      if(blocked.includes(e.code)){e.preventDefault();e.stopImmediatePropagation()}
      return;
    }
    if(e.code==='KeyV'&&!e.repeat&&window.gameRightHand?.current==='hammer'){
      e.preventDefault();beginHammerAction('inspect');
    }
  },true);

  setInterval(()=>{
    updateHammerRecipe();
    if(hint&&window.gameRightHand?.current==='hammer'){
      hint.style.opacity=actionBlocked()?'0':'1';
      hint.textContent='Clique para golpear • V inspeciona o martelo';
    }
  },180);

  window.gameHammer={
    version:'V63',
    model:heldHammer,
    get equipped(){return hammerEquipped},
    get crafting(){return hammerCrafting},
    get action(){
      return window.gameAttack?.active &&
             window.gameAttack?.weapon==="hammer"
        ? "swing"
        : action.type;
    },
    craft:startHammerCraft,
    attack:()=>window.gameAttack?.hammerAttack?.(),
    inspect:()=>beginHammerAction('inspect'),
    headWorld:()=>hammerHeadWorld(),
    source:'Martelo Primitivo V61 + ataque full-body estável V63',
    lashing:'thin-tube-cords',
    animation:{
      source:'Standing Melee Attack Downward.fbx',
      mode:'full-body-existing-character',
      hands:'natural-FBX',
      event:'game:hammer-impact'
    }
  };
  updateHammerRecipe();
})();
