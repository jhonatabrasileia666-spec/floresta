 const root=g.trueFirstPerson.visibleRoot,bones=g.trueFirstPerson.bones,chains={},rest=new Map(),solvers={};
 for(const name of ['Index','Middle','Ring','Pinky','Thumb']){
  const chain=[];for(let i=1;i<=3;i++){let found;root.traverse(b=>{if(b.isBone&&b.name.toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'')===('LeftHand'+name+i).toLowerCase())found=b});if(found){chain.push(found);rest.set(found,found.quaternion.clone())}}
  chains[name]=chain;
 }
 function restoreFingers(){for(const [b,q]of rest)b.quaternion.copy(q);root.updateMatrixWorld(true)}
 function palmCenter(){root.updateMatrixWorld(true);const p=bones.lHand.getWorldPosition(new T.Vector3());for(const name of ['Index','Middle','Ring','Pinky'])p.add((chains[name][0]||bones.lHand).getWorldPosition(new T.Vector3()));return p.multiplyScalar(.2)}
 function grip(){
  if(!Object.keys(solvers).length){restoreFingers();const palm=palmCenter();for(const [name,c] of Object.entries(chains)){
   if(!c.length)continue;const first=c[0],tip=c[c.length-1],base=rest.get(first);let best=Infinity;
   for(const axis of [new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)])for(const sign of [-1,1]){first.quaternion.copy(base).multiply(new T.Quaternion().setFromAxisAngle(axis,.48*sign));root.updateMatrixWorld(true);const d=tip.getWorldPosition(new T.Vector3()).distanceToSquared(palm);if(d<best){best=d;solvers[name]={axis,sign}}}first.quaternion.copy(base);
  }}
  for(const [name,c]of Object.entries(chains)){const solver=solvers[name];if(!solver)continue;c.forEach((b,i)=>b.quaternion.copy(rest.get(b)).multiply(new T.Quaternion().setFromAxisAngle(solver.axis,solver.sign*(name==='Thumb'?[.54,.66,.48]:[.78,.94,.74])[i])))}root.updateMatrixWorld(true);
 }
 const forward=new T.Vector3(),right=new T.Vector3(),target=new T.Vector3(),offset=new T.Vector3(),rotation=new T.Quaternion(),euler=new T.Euler();
 let drinking=null;
 function updatePose(){
  if(!equipped||(!using&&(alq.state.busy||window.gameCraft?.active||window.gameRoll?.active||window.gamePlayerHit?.active))){for(const o of Object.values(models))o.visible=false;return;}
  if(!count(equipped)&&!using){sync();return;}
  const o=model(equipped),yaw=g.player.yaw,pitch=g.player.pitch;
  forward.set(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));right.set(Math.cos(yaw),0,-Math.sin(yaw));
  const u=drinking?Math.min(1,Math.max(0,(performance.now()-drinking.start)/1650)):0,raise=drinking?Math.sin(Math.PI*u):0;
  target.copy(g.camera.position).addScaledVector(forward,.46-.20*raise).addScaledVector(right,-.23+.10*raise);target.y-=.24-.16*raise;
  rig.armIK('left',target);grip();const palm=palmCenter();
  euler.set(.10+raise*1.45,yaw,.08,'YXZ');rotation.setFromEuler(euler);o.quaternion.copy(rotation);offset.copy(o.userData.grip).applyQuaternion(rotation);o.position.copy(palm).sub(offset);o.visible=true;o.updateMatrixWorld(true);
  if(drinking){o.userData.cork.visible=false;o.userData.liquidSurface.visible=false;o.userData.fill.scale.y=Math.max(.12,1-u*.88)}
 }
 async function animateDrink(){
  const o=model(equipped);alq.state.busy=true;drinking={start:performance.now()};
  try{await new Promise(resolve=>{function frame(){updatePose();if(performance.now()-drinking.start>=1650)resolve();else requestAnimationFrame(frame)}requestAnimationFrame(frame)})}
  finally{drinking=null;alq.state.busy=false;o.userData.cork.visible=true;o.userData.liquidSurface.visible=true;o.userData.fill.scale.y=1;}
 }
