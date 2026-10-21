
(async()=>{
  if(window.__V139_PLANK_SYSTEM__)return;
  window.__V139_PLANK_SYSTEM__=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1400;i++){
    if(window.gameReview?.scene&&window.gameReview?.player&&window.gameInventory&&window.gameLumber&&window.__THREE_MODULE)break;
    await sleep(20);
  }

  const game=window.gameReview,T=window.__THREE_MODULE,inv=window.gameInventory,lumber=window.gameLumber;
  if(!game?.scene||!game?.player||!lumber||!T)return;
  const scene=game.scene,player=game.player,tfp=game.trueFirstPerson;
  const status=document.getElementById('status');
  const lumberStatus=document.getElementById('lumberStatus');
  const mobile=!!window.__FOREST_MOBILE_BUILD__;
  const MAX_HITS=3,MAX_CARRY=5;
  const activeFx=[],groundPlanks=[];
  let carriedCount=0,lastPickupScan=0,nearPlank=null;

  const plankSideMat=new T.MeshStandardMaterial({color:0x9a6238,roughness:.94,metalness:0,flatShading:true});
  const plankTopMat=new T.MeshStandardMaterial({color:0xc7925e,roughness:.90,metalness:0,flatShading:true});
  const chipMat=new T.MeshStandardMaterial({color:0xb9804c,roughness:1,flatShading:true});
  const tmpClosest=new T.Vector3(),tmpA=new T.Vector3(),tmpB=new T.Vector3(),tmpPos=new T.Vector3(),tmpDir=new T.Vector3();
  const up=new T.Vector3(0,1,0),zAxis=new T.Vector3(0,0,1);

  function clamp(v,a,b){return Math.max(a,Math.min(b,v))}
  function segClosest(px,pz,ax,az,bx,bz,out=tmpClosest){
    const vx=bx-ax,vz=bz-az,wx=px-ax,wz=pz-az,vv=vx*vx+vz*vz;
    const t=vv>.0001?clamp((wx*vx+wz*vz)/vv,0,1):0;
    out.set(ax+vx*t,0,az+vz*t);return t;
  }
  function meshSegment(mesh,a=tmpA,b=tmpB){
    if(!mesh)return null;
    mesh.updateWorldMatrix?.(true,false);
    const len=Math.max(.8,Number(mesh.userData?.length)||3.0);
    a.set(0,-len*.5,0).applyMatrix4(mesh.matrixWorld);
    b.set(0, len*.5,0).applyMatrix4(mesh.matrixWorld);
    return {a:a.clone(),b:b.clone(),len};
  }
  function findPlacedLogTarget(maxDist=2.85){
    if(lumber.carrying||window.gameLogPlacement?.placing||carriedCount>0)return null;
    const yaw=player.bodyYaw??player.yaw,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
    let best=null,bestD=maxDist;
    for(const mesh of lumber.placedLogs||[]){
      if(!mesh?.parent||mesh.userData?.splitComplete)continue;
      const seg=meshSegment(mesh);if(!seg)continue;
      segClosest(player.x,player.z,seg.a.x,seg.a.z,seg.b.x,seg.b.z,tmpClosest);
      const dx=tmpClosest.x-player.x,dz=tmpClosest.z-player.z,d=Math.hypot(dx,dz);
      if(d>.001&&((fx*dx+fz*dz)/d)<Math.cos(T.MathUtils.degToRad(72)))continue;
      if(d<bestD){bestD=d;best={mesh,a:seg.a,b:seg.b,len:seg.len,closest:tmpClosest.clone(),distance:d}}
    }
    return best;
  }

  function splitSound(finalHit=false){
    try{
      const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;
      const ctx=splitSound.ctx||(splitSound.ctx=new AC());
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.type='triangle';o.frequency.setValueAtTime(finalHit?86:124,ctx.currentTime);o.frequency.exponentialRampToValueAtTime(finalHit?32:62,ctx.currentTime+.12);
      g.gain.setValueAtTime(.001,ctx.currentTime);g.gain.exponentialRampToValueAtTime(finalHit?.18:.11,ctx.currentTime+.005);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+.16);
      o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+.17);
    }catch{}
  }
  function dropCollectibleChips(point,count=1){
    if(!window.gameCollectibles?.spawnItem)return 0;
    let spawned=0;
    for(let i=0;i<count;i++){
      const x=point.x+(Math.random()-.5)*.42;
      const z=point.z+(Math.random()-.5)*.42;
      const y=game.groundY(x,z);
      window.gameCollectibles.spawnItem({
        id:'wood_chip',
        name:'Lasca de madeira',
        type:'Material de fogo',
        quantity:1,
        weight:.05,
        description:'Lasca fina retirada de um tronco com o machado. Pega fogo rapidamente e serve como isca para iniciar fogo.'
      },x,z);
      window.dispatchEvent(new CustomEvent('game:wood-chip-harvested',{
        detail:{x,y,z,source:'log_splitter'}
      }));
      spawned++;
    }
    return spawned;
  }
  function spawnChips(point,count=8){
    for(let i=0;i<count;i++){
      const m=new T.Mesh(new T.BoxGeometry(.035+Math.random()*.045,.018+Math.random()*.03,.08+Math.random()*.08),chipMat);
      m.position.copy(point);m.position.y=game.groundY(point.x,point.z)+.30+Math.random()*.2;
      m.rotation.set(Math.random()*3,Math.random()*3,Math.random()*3);m.castShadow=!mobile;
      m.userData.v=new T.Vector3((Math.random()-.5)*1.7,.8+Math.random()*1.1,(Math.random()-.5)*1.7);m.userData.life=.55+Math.random()*.45;
      scene.add(m);activeFx.push(m);
    }
  }

  function makePlankMesh(len=3.0){
    const mesh=new T.Mesh(new T.BoxGeometry(.56,.14,len),[plankSideMat,plankSideMat,plankTopMat,plankTopMat,plankSideMat,plankSideMat]);
    mesh.castShadow=!mobile;mesh.receiveShadow=true;mesh.userData.plank=true;mesh.userData.length=len;return mesh;
  }
  function rebuildGroundStack(stack){
    if(!stack?.root)return;
    while(stack.root.children.length)stack.root.remove(stack.root.children[0]);
    for(let i=0;i<stack.count;i++){
      const m=makePlankMesh(stack.len||3.05);
      m.position.set((i%2?-.018:.018)*Math.ceil(i/2),.08+i*.145,0);
      m.rotation.z=(i%2?-.012:.012);
      stack.root.add(m);
    }
    stack.root.position.y=game.groundY(stack.root.position.x,stack.root.position.z);
    stack.root.userData.plankStack=true;
    stack.root.userData.count=stack.count;
  }
  function spawnGroundPlank(x,z,yaw,len,index=0,stackY=0,count=1){
    const root=new T.Group();
    root.name='V139_GroundPlankStack';
    root.position.set(x,game.groundY(x,z),z);root.rotation.y=yaw;
    scene.add(root);
    const stack={root,len:len||3.05,count:Math.max(1,Math.min(MAX_CARRY,count|0)),yaw};
    groundPlanks.push(stack);rebuildGroundStack(stack);return stack;
  }
  function spawnTwoPlanksFromLog(target){
    tmpDir.copy(target.b).sub(target.a);tmpDir.y=0;
    if(tmpDir.lengthSq()<.001)tmpDir.set(0,0,1);tmpDir.normalize();
    const side=new T.Vector3(-tmpDir.z,0,tmpDir.x),center=new T.Vector3().addVectors(target.a,target.b).multiplyScalar(.5);
    const yaw=Math.atan2(tmpDir.x,tmpDir.z),len=clamp(target.len*.96,2.55,3.65);
    for(const sign of[-1,1]){
      const p=center.clone().addScaledVector(side,sign*.35);
      spawnGroundPlank(p.x,p.z,yaw,len,sign>0?1:0,0,1);
    }
  }
  function removePlacedLog(mesh){
    if(!mesh)return;
    mesh.userData.splitComplete=true;
    const arr=lumber.placedLogs||[],i=arr.indexOf(mesh);if(i>=0)arr.splice(i,1);
    mesh.removeFromParent?.();
  }
  function complete(target){
    spawnTwoPlanksFromLog(target);spawnChips(target.closest,mobile?12:18);const extraChips=dropCollectibleChips(target.closest,mobile?2:3);splitSound(true);removePlacedLog(target.mesh);
    if(status)status.textContent=`Tronco colocado partido • 2 tábuas ficaram no chão • ${extraChips} lasca${extraChips>1?'s':''} soltaram`;
    if(lumberStatus)lumberStatus.textContent='2 tábuas no chão + lascas no chão • Q empilha no chão • G carrega a pilha';
    window.dispatchEvent(new CustomEvent('game:log-split',{detail:{quantity:2,physical:true,woodChips:extraChips}}));
    return true;
  }
  function consumeAxeImpact(event){
    if(window.gameRightHand?.current!=='axe'||lumber.carrying||carriedCount>0||window.gameCraft?.active)return false;
    const target=findPlacedLogTarget();if(!target)return false;
    const mesh=target.mesh,swing=event?.detail?.swingId??performance.now();
    if(mesh.userData.lastSplitSwing===swing)return true;
    mesh.userData.lastSplitSwing=swing;mesh.userData.splitHits=(mesh.userData.splitHits||0)+1;
    const chipsNow=dropCollectibleChips(target.closest,1);
    mesh.userData.splitWoodChips=(mesh.userData.splitWoodChips||0)+chipsNow;
    spawnChips(target.closest,mobile?5:8);splitSound(false);
    if(mesh.userData.splitHits>=MAX_HITS)return complete(target);
    if(status)status.textContent=`Partindo tronco colocado • ${mesh.userData.splitHits}/${MAX_HITS} golpes • ${mesh.userData.splitWoodChips||0} lasca${(mesh.userData.splitWoodChips||0)!==1?'s':''} no chão`;
    if(lumberStatus)lumberStatus.textContent=`Tronco no chão • ${mesh.userData.splitHits}/${MAX_HITS} • solta lascas e gera 2 tábuas físicas`;
    return true;
  }

  function nearestGroundStack(maxDist=2.8){
    let best=null,bd=maxDist;
    for(const s of groundPlanks){
      const r=s.root;if(!r?.parent||s.count<=0)continue;
      const d=Math.hypot(r.position.x-player.x,r.position.z-player.z);
      if(d<bd){bd=d;best=s}
    }
    return best;
  }
  function removeGroundStack(stack){
    if(!stack)return;const i=groundPlanks.indexOf(stack);if(i>=0)groundPlanks.splice(i,1);stack.root?.removeFromParent?.();
  }
  function findGroundStackDonor(base,maxDist=3.15){
    if(!base||base.count>=MAX_CARRY)return null;
    let best=null,bd=maxDist;
    for(const s of groundPlanks){
      if(s===base||!s.root?.parent||s.count<=0)continue;
      const d=Math.hypot(s.root.position.x-base.root.position.x,s.root.position.z-base.root.position.z);
      if(d<bd){bd=d;best=s}
    }
    return best;
  }
  function stackOneOnGround(base=nearestGroundStack(),donor=findGroundStackDonor(base)){
    if(!base||!donor||base.count>=MAX_CARRY||carriedCount>0||lumber.carrying||window.gameLogPlacement?.placing)return false;
    donor.count--;base.count++;
    rebuildGroundStack(base);
    if(donor.count<=0)removeGroundStack(donor);else rebuildGroundStack(donor);
    if(status)status.textContent=`Tábua empilhada no chão • ${base.count}/${MAX_CARRY}`;
    if(lumberStatus)lumberStatus.textContent=`Pilha no chão: ${base.count}/${MAX_CARRY} • Q empilha • G carrega no ombro`;
    return true;
  }

  const carryRoot=new T.Group();carryRoot.name='V139_PlankShoulderStack';carryRoot.visible=false;scene.add(carryRoot);
  function rebuildCarryVisual(){
    while(carryRoot.children.length)carryRoot.remove(carryRoot.children[0]);
    for(let i=0;i<carriedCount;i++){
      const m=makePlankMesh(3.05);m.castShadow=false;m.receiveShadow=false;
      m.position.set((i%2?-.022:.022)*Math.ceil(i/2),i*.145,0);m.rotation.z=(i%2?-.012:.012);carryRoot.add(m);
    }
    carryRoot.visible=carriedCount>0;
  }
  function findBone(root,name){
    if(!root)return null;const norm=x=>String(x||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,''),wanted=norm(name);let found=null;
    root.traverse(o=>{if(!found&&o.isBone&&norm(o.name)===wanted)found=o});return found;
  }
  function aimBoneAt(bone,child,target,strength=.9){
    if(!bone||!child)return;
    bone.updateWorldMatrix?.(true,true);child.updateWorldMatrix?.(true,true);
    const bp=new T.Vector3(),cp=new T.Vector3(),wq=new T.Quaternion(),pq=new T.Quaternion();
    bone.getWorldPosition(bp);child.getWorldPosition(cp);bone.getWorldQuaternion(wq);
    const cur=cp.sub(bp).normalize(),des=target.clone().sub(bp).normalize();
    if(cur.lengthSq()<.4||des.lengthSq()<.4)return;
    const delta=new T.Quaternion().setFromUnitVectors(cur,des);
    const dw=delta.multiply(wq.clone());
    bone.parent?bone.parent.getWorldQuaternion(pq):pq.identity();
    const dl=pq.invert().multiply(dw);
    bone.quaternion.slerp(dl,strength);
  }
  function armIK(arm,fore,hand,target){
    if(!arm||!fore||!hand)return;
    for(let i=0;i<3;i++){
      aimBoneAt(arm,fore,target,.82);
      aimBoneAt(fore,hand,target,.94);
      tfp?.visibleRoot?.updateMatrixWorld?.(true);
    }
  }
  function shadowIK(target){
    if(!shadowArm||!shadowFore||!shadowHand)return;
    for(let i=0;i<3;i++){
      aimBoneAt(shadowArm,shadowFore,target,.82);
      aimBoneAt(shadowFore,shadowHand,target,.94);
      tfp?.shadowRoot?.updateMatrixWorld?.(true);
    }
  }
  // V141: use the SAME shoulder side and support-arm pose as the carried trunk.
  // The trunk system carries on the LEFT shoulder while the RIGHT hand remains free for the axe.
  const shoulder=findBone(tfp?.visibleRoot,'LeftShoulder')||tfp?.bones?.lArm||null;
  const supportArm=tfp?.bones?.lArm||null,supportFore=tfp?.bones?.lFore||null,supportHand=tfp?.bones?.lHand||null;
  const shadowArm=findBone(tfp?.shadowRoot,'LeftArm')||null;
  const shadowFore=findBone(tfp?.shadowRoot,'LeftForeArm')||null;
  const shadowHand=findBone(tfp?.shadowRoot,'LeftHand')||null;
  const carryCenter=new T.Vector3(),carryCamPos=new T.Vector3(),carryClosest=new T.Vector3(),carryOffset=new T.Vector3(),handTarget=new T.Vector3();
  const palm=new T.Vector3(),fingerDir=new T.Vector3(),shoulderPos=new T.Vector3(),elbowPos=new T.Vector3(),wristPos=new T.Vector3(),bendPole=new T.Vector3();
  function updateCarryPose(){
    if(carriedCount<=0){carryRoot.visible=false;return}
    const yaw=player.bodyYaw??player.yaw;
    const forward=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)).normalize();
    const right=new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw)).normalize();
    const axis=forward;
    const q=new T.Quaternion().setFromUnitVectors(zAxis,axis);

    if(shoulder){
      tfp?.visibleRoot?.updateMatrixWorld?.(true);
      shoulder.getWorldPosition(carryCenter);
    }else{
      game.camera.getWorldPosition(carryCenter);
      carryCenter.y-=.28;
    }

    // Same placement logic as holdLogOnShoulder(): outside LEFT shoulder, parallel to movement.
    const halfWidth=.56*.5;
    const stackHeight=.14+Math.max(0,carriedCount-1)*.145;
    carryCenter
      .addScaledVector(right,-(halfWidth*.90+.055))
      .addScaledVector(up,.11+stackHeight*.42);

    // First-person safety: never let a plank cross the camera/near plane.
    game.camera?.getWorldPosition?.(carryCamPos);
    carryOffset.copy(carryCamPos).sub(carryCenter);
    const along=carryOffset.dot(axis);
    carryClosest.copy(carryCenter).addScaledVector(axis,along);
    const cameraClearance=carryCamPos.distanceTo(carryClosest);
    const desiredClearance=.46+Math.min(.10,stackHeight*.18);
    if(cameraClearance<desiredClearance){
      carryCenter.addScaledVector(right,-(desiredClearance-cameraClearance+.08));
    }

    carryRoot.visible=true;
    carryRoot.position.copy(carryCenter);
    carryRoot.quaternion.copy(q);
    carryRoot.updateMatrixWorld(true);

    // Same LEFT-arm support concept used by the log: open palm under the load.
    if(supportArm&&supportFore&&supportHand){
      fingerDir.copy(up).multiplyScalar(.78).addScaledVector(right,-.625).normalize();
      palm.copy(carryCenter)
        .addScaledVector(forward,.30)
        .addScaledVector(right,-(halfWidth*.73+.018))
        .addScaledVector(up,-(.08+stackHeight*.32));
      handTarget.copy(palm).addScaledVector(fingerDir,-.075);

      tfp?.visibleRoot?.updateMatrixWorld?.(true);
      supportArm.getWorldPosition(shoulderPos);
      supportFore.getWorldPosition(elbowPos);
      supportHand.getWorldPosition(wristPos);
      const l1=shoulderPos.distanceTo(elbowPos),l2=elbowPos.distanceTo(wristPos),dir=handTarget.clone().sub(shoulderPos);
      const d=clamp(dir.length(),Math.abs(l1-l2)+.001,l1+l2-.003);dir.normalize();
      bendPole.copy(shoulderPos).addScaledVector(forward,.20).addScaledVector(right,-.24).addScaledVector(up,-.50);
      const bend=bendPole.sub(shoulderPos).addScaledVector(dir,-bendPole.dot(dir)).normalize();
      const alongArm=(l1*l1-l2*l2+d*d)/(2*d),height=Math.sqrt(Math.max(0,l1*l1-alongArm*alongArm));
      aimBoneAt(supportArm,supportFore,shoulderPos.clone().addScaledVector(dir,alongArm).addScaledVector(bend,height),1);
      aimBoneAt(supportFore,supportHand,shoulderPos.clone().addScaledVector(dir,d),1);

      // Open-cup hand, matching the trunk shoulder carry instead of a closed grip.
      for(const bone of tfp?.localMesh?.skeleton?.bones||[]){
        const match=bone.name.match(/LeftHand(Thumb|Index|Middle|Ring|Pinky)([123])$/);
        if(!match)continue;
        const digit=match[1],joint=Number(match[2]);
        bone.quaternion.identity();
        if(digit==='Thumb')bone.rotation.set(.18,0,joint===1?-.30:.12);
        else bone.rotation.set(joint===1?.20:.32,0,0);
      }
      tfp?.visibleRoot?.updateMatrixWorld?.(true);
      shadowIK(handTarget);
    }

    // Keep axe/tool behavior exactly like the trunk carry: right hand remains independent.
    window.gameRightHand?.sync?.();
  }
  function pickupStack(stack=nearestGroundStack()){
    if(!stack||carriedCount>0||lumber.carrying||window.gameLogPlacement?.placing)return false;
    carriedCount=Math.max(1,Math.min(MAX_CARRY,stack.count|0));
    removeGroundStack(stack);rebuildCarryVisual();
    if(status)status.textContent=`Pilha no ombro • ${carriedCount} tábua${carriedCount>1?'s':''}`;
    if(lumberStatus)lumberStatus.textContent=`Carregando ${carriedCount}/${MAX_CARRY} tábuas no ombro • G coloca a pilha no chão`;
    return true;
  }
  function dropStack(){
    if(carriedCount<=0)return false;
    const yaw=player.bodyYaw??player.yaw,forward=new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw));
    const basePos=new T.Vector3(player.x,0,player.z).addScaledVector(forward,1.55),boardYaw=Math.atan2(forward.x,forward.z),n=carriedCount;
    spawnGroundPlank(basePos.x,basePos.z,boardYaw,3.05,0,0,n);
    carriedCount=0;rebuildCarryVisual();
    if(status)status.textContent=`Pilha com ${n} tábua${n>1?'s':''} colocada no chão`;
    if(lumberStatus)lumberStatus.textContent='Pilha no chão • Q adiciona outra tábua • G carrega a pilha';
    return true;
  }

  const prompt=document.createElement('div');
  prompt.id='plankCarryPromptV139';
  prompt.style.cssText='position:fixed;left:50%;bottom:146px;transform:translateX(-50%);z-index:46;padding:8px 12px;border-radius:10px;background:rgba(12,12,12,.80);border:1px solid rgba(255,255,255,.16);color:#fff;font:700 12px system-ui;pointer-events:none;display:none;white-space:nowrap';
  document.body.appendChild(prompt);
  let mobileStackBtn=null,mobileCarryBtn=null;
  if(matchMedia('(pointer:coarse)').matches){
    mobileStackBtn=document.createElement('button');mobileStackBtn.type='button';mobileStackBtn.id='plankStackGroundMobileV139';
    mobileStackBtn.style.cssText='position:fixed;right:18px;bottom:222px;z-index:70;padding:11px 13px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(18,18,18,.86);color:#fff;font:800 11px system-ui;display:none';
    document.body.appendChild(mobileStackBtn);
    mobileCarryBtn=document.createElement('button');mobileCarryBtn.type='button';mobileCarryBtn.id='plankCarryMobileV139';
    mobileCarryBtn.style.cssText='position:fixed;right:18px;bottom:170px;z-index:70;padding:12px 14px;border-radius:12px;border:1px solid rgba(255,255,255,.25);background:rgba(18,18,18,.86);color:#fff;font:800 12px system-ui;display:none';
    document.body.appendChild(mobileCarryBtn);
    mobileStackBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();const base=nearestGroundStack(),donor=findGroundStackDonor(base);if(base&&donor)stackOneOnGround(base,donor)},{passive:false});
    mobileCarryBtn.addEventListener('touchstart',e=>{e.preventDefault();e.stopPropagation();if(carriedCount>0)dropStack();else{const s=nearestGroundStack();if(s)pickupStack(s)}},{passive:false});
  }
  function updatePrompt(){
    nearPlank=nearestGroundStack();
    if(carriedCount>0){
      prompt.style.display='block';prompt.textContent=`Pilha no ombro: ${carriedCount}/${MAX_CARRY} • G — colocar no chão`;
      if(mobileStackBtn)mobileStackBtn.style.display='none';
      if(mobileCarryBtn){mobileCarryBtn.style.display='block';mobileCarryBtn.textContent=`COLOCAR PILHA (${carriedCount})`}
      return;
    }
    if(nearPlank){
      const donor=findGroundStackDonor(nearPlank),canStack=!!donor&&nearPlank.count<MAX_CARRY;
      prompt.style.display='block';
      prompt.textContent=canStack?`Pilha no chão ${nearPlank.count}/${MAX_CARRY} • Q — empilhar tábua • G — carregar pilha`:`Pilha no chão ${nearPlank.count}/${MAX_CARRY} • G — carregar no ombro`;
      if(mobileStackBtn){mobileStackBtn.style.display=canStack?'block':'none';mobileStackBtn.textContent=`EMPILHAR NO CHÃO ${nearPlank.count}/${MAX_CARRY}`}
      if(mobileCarryBtn){mobileCarryBtn.style.display='block';mobileCarryBtn.textContent=`CARREGAR PILHA (${nearPlank.count})`}
    }else{
      prompt.style.display='none';if(mobileStackBtn)mobileStackBtn.style.display='none';if(mobileCarryBtn)mobileCarryBtn.style.display='none';
    }
  }

  addEventListener('keydown',e=>{
    if(e.repeat||window.gameInventory?.isOpen||window.gameCraft?.active)return;
    if(e.code==='KeyQ'&&carriedCount===0){
      const base=nearestGroundStack(),donor=findGroundStackDonor(base);
      if(base&&donor&&base.count<MAX_CARRY){e.preventDefault();e.stopImmediatePropagation();stackOneOnGround(base,donor)}
    }else if(e.code==='KeyG'){
      if(carriedCount>0){e.preventDefault();e.stopImmediatePropagation();dropStack()}
      else{const s=nearestGroundStack();if(s){e.preventDefault();e.stopImmediatePropagation();pickupStack(s)}}
    }
  },true);

  // V141 final avatar hook is installed at the end of the document so this pose runs LAST.

  let last=performance.now();
  function loop(now){
    requestAnimationFrame(loop);const dt=Math.min(.05,(now-last)/1000);last=now;
    if(now-lastPickupScan>90){lastPickupScan=now;updatePrompt()}
    for(let i=activeFx.length-1;i>=0;i--){
      const c=activeFx[i];c.userData.life-=dt;c.userData.v.y-=3.8*dt;c.position.addScaledVector(c.userData.v,dt);c.rotation.x+=dt*6;c.rotation.z+=dt*5;
      const gy=game.groundY(c.position.x,c.position.z)+.02;if(c.position.y<gy){c.position.y=gy;c.userData.v.multiplyScalar(.28)}
      if(c.userData.life<=0){c.removeFromParent?.();activeFx.splice(i,1)}
    }
  }
  requestAnimationFrame(loop);

  window.gameLogSplitter={version:'V139B',consumeAxeImpact,findTarget:findPlacedLogTarget};
  window.gamePlankCarry={
    version:'V141B',get count(){return carriedCount},get max(){return MAX_CARRY},get groundPlanks(){return groundPlanks},
    hasNearby(){return !!nearestGroundStack()},stackNearest(){const b=nearestGroundStack();return stackOneOnGround(b,findGroundStackDonor(b))},
    pickupNearest(){return pickupStack()},pickupNearestStack(){return pickupStack()},drop:dropStack,applyCarryPose:updateCarryPose,
    consumeOne(){if(carriedCount<=0)return false;carriedCount--;rebuildCarryVisual();if(status)status.textContent=carriedCount>0?`Tábua usada na construção • ${carriedCount}/${MAX_CARRY} no ombro`:'Última tábua usada na construção';if(lumberStatus)lumberStatus.textContent=carriedCount>0?`Carregando ${carriedCount}/${MAX_CARRY} tábuas no ombro`:'Sem tábuas no ombro';return true},
    spawn(x,z,yaw=0,len=3.05,count=1){return spawnGroundPlank(x,z,yaw,len,0,0,count)},

    // V200: devolve uma tabua da aranha à pilha física original.
    acceptCargoPlank(){
      if(carriedCount>=MAX_CARRY||lumber.carrying||window.gameLogPlacement?.placing)return false;
      carriedCount++;
      rebuildCarryVisual();
      if(status)status.textContent=`Tabua recuperada da aranha • ${carriedCount}/${MAX_CARRY}`;
      if(lumberStatus)lumberStatus.textContent=`Carregando ${carriedCount}/${MAX_CARRY} tabuas no ombro`;
      return true;
    },
    // V201: o excesso da aranha volta para pilhas nativas de no maximo 5.
    storeCargoPlank(x,z,yaw=0,len=3.05){
      if(!Number.isFinite(x)||!Number.isFinite(z))return false;
      const near=groundPlanks.find(s=>s?.root&&s.count<MAX_CARRY&&Math.hypot(s.root.position.x-x,s.root.position.z-z)<.72);
      if(near){near.count++;rebuildGroundStack(near);return true}
      return !!spawnGroundPlank(x,z,yaw,len,0,0,1);
    },
    // V36: mesma tábua física produzida ao partir um tronco com o machado.
    createCargoPlank(len=3.05){return makePlankMesh(len)}
  };
  console.info('[V142B] partir tronco no chão agora também solta lascas coletáveis durante os golpes e no corte final');
})();
