/* Slot exclusivo de poções: equipar sem consumir; usar pelos controles nativos. */
(async()=>{'use strict';
 const wait=ms=>new Promise(r=>setTimeout(r,ms));
 for(let i=0;i<1800;i++){if(window.gameHerbalAlchemy&&window.gamePrimitive?.handRig&&window.gameRightHand&&document.getElementById('u173Hotbar'))break;await wait(30);}
 const alq=window.gameHerbalAlchemy,g=window.gameReview,T=window.__THREE_MODULE,rig=window.gamePrimitive?.handRig,inv=window.gameInventory;
 if(!alq||!g||!T||!rig||!inv)return;
 const defs=window.PotionModels219.defs,keys=Object.keys(defs),isPotion=id=>typeof id==='string'&&id.startsWith('alq_potion_')&&!!defs[id.slice(11)];
 const count=id=>inv.items.find(i=>i.id===id)?.quantity||0;
 let selected='alq_potion_cura';try{const saved=localStorage.getItem('floresta-potion-slot-v219');if(isPotion(saved))selected=saved}catch{}
 let equipped=null,using=false;const models={};
 function model(id){if(!models[id]){models[id]=window.PotionModels219.make(T,id.slice(11));models[id].visible=false;g.scene.add(models[id]);}return models[id]}

 const notice=msg=>{const s=document.getElementById('status');if(s)s.textContent=msg;};
 function blocked(allowInventory=false){return !!(using||alq.state.busy||window.gameCraft?.active||window.gameRoll?.active||window.gamePlayerHit?.active||window.gameLumber?.carrying||document.body.classList.contains('v206-mounted')||window.gameZombie?.playerHp<=0||(!allowInventory&&inv.isOpen)||document.querySelector('#craftOverlay.open,#constructionOverlay.open,#directorOverlay.open,#skillTreeOverlay.open,#florestaFront:not([hidden]),#florestaHackOverlay.open,#alq189Panel.open'))}
 function store(){try{localStorage.setItem('floresta-potion-slot-v219',selected)}catch{}}
 function hide(){for(const o of Object.values(models))o.visible=false;document.body.classList.remove('potion219-equipped')}
 function unequip(){if(using)return false;equipped=null;hide();restoreFingers();inv.refresh?.();sync();return true}
 function freeLeft(){
  if(window.gameShield?.equipped)window.gameShield.unequip?.();
  if(window.gameBranchHands?.side==='left')window.gameBranchHands.unequip?.();
  if(g.isEquipped?.())document.getElementById('equipBtn')?.click();
 }
 function equip(id){
  if(!isPotion(id)||!count(id)||blocked(true))return false;
  freeLeft();hide();selected=id;equipped=id;store();model(id).visible=true;document.body.classList.add('potion219-equipped');inv.refresh?.();sync();updatePose();notice(defs[id.slice(11)].name+' • mão esquerda • scroll troca • Y usa');return true;
 }
 function toggle(){if(blocked())return false;return equipped?unequip():equip(selected)}
 function cycle(dir){
  if(blocked())return false;
  const available=keys.map(k=>'alq_potion_'+k).filter(id=>count(id)>0);if(!available.length)return false;
  const i=available.indexOf(selected);return select(available[(i+(dir>0?1:-1)+available.length)%available.length]);
 }
 function select(id){if(!isPotion(id)||!count(id)||blocked(true))return false;if(equipped)return equip(id);selected=id;store();sync();return true}
 async function useSelected(){
  if(blocked()||!count(selected))return false;
  if(equipped!==selected&&!equip(selected))return false;
  const id=selected,key=id.slice(11);using=true;sync();
  try{
   const result=await alq.use(key);
   if(result===false)return false;
   return true;
  }catch(e){console.error('[Poções V219]',e);notice('Não foi possível usar a poção.');return false;}
  finally{
   using=false;
   if(count(id)){equipped=id;model(id).visible=true;}
   else if(equipped===id){const next=keys.map(k=>'alq_potion_'+k).find(k=>count(k)>0);if(next){selected=next;equipped=next;store();hide();model(next).visible=true;}else unequip();}
   sync();inv.refresh?.();
  }
 }
 const hot=document.getElementById('u173Hotbar'),slots=hot.querySelector('.u173-slots');
 const dock=document.createElement('div');dock.id='potion219Dock';slots.before(dock);dock.append(slots);
 const area=document.createElement('div');area.id='potion219Slot';area.innerHTML='<button id="potion219Equip" type="button" aria-label="Equipar poção na mão esquerda"><kbd>P</kbd><img alt="" draggable="false"><small></small><span>Poção</span></button><button id="potion219Select" type="button" aria-label="Escolher poção" aria-expanded="false">⌄</button><button id="potion219Use" type="button">Usar <kbd>Y</kbd></button>';dock.append(area);
 const picker=document.createElement('div');picker.id='potion219Picker';picker.hidden=true;picker.setAttribute('role','group');picker.setAttribute('aria-label','Escolher poção');hot.append(picker);
 for(const key of keys){const id='alq_potion_'+key,b=document.createElement('button');b.type='button';b.dataset.potion=id;b.innerHTML='<img alt="" draggable="false"><span></span><small></small>';b.querySelector('img').src=window.florestaV183Art?.items?.[id]||'';b.querySelector('span').textContent=defs[key].name;b.onclick=()=>{if(select(id)){picker.hidden=true;sync()}};picker.append(b)}
 const equipButton=area.querySelector('#potion219Equip'),selectButton=area.querySelector('#potion219Select'),useButton=area.querySelector('#potion219Use');
 equipButton.onclick=toggle;
 useButton.onclick=()=>useSelected();selectButton.onclick=()=>{if(blocked())return;picker.hidden=!picker.hidden;sync()};
 function sync(){
  if(!count(selected)&&!using){const first=keys.map(k=>'alq_potion_'+k).find(id=>count(id)>0);if(first)selected=first;}
  if(equipped&&!count(equipped)&&!using)unequip();
  const qty=count(selected),def=defs[selected.slice(11)],sprite=window.florestaV183Art?.items?.[selected]||'';
  const img=equipButton.querySelector('img');if(img.src!==sprite)img.src=sprite;
  equipButton.querySelector('small').textContent=qty?String(qty):'0';equipButton.querySelector('span').textContent=def.name;
  equipButton.disabled=!qty||using;equipButton.classList.toggle('active',equipped===selected);equipButton.setAttribute('aria-pressed',String(equipped===selected));equipButton.title=(equipped===selected?'Guardar ':'Equipar ')+def.name+' • P · mão esquerda · scroll troca';
  useButton.disabled=!qty||using;useButton.innerHTML=(using?'Usando…':selected.endsWith('_fogo')?'Aplicar óleo':'Usar')+' <kbd>Y</kbd>';
  selectButton.disabled=using;selectButton.setAttribute('aria-expanded',String(!picker.hidden));
  for(const b of picker.children){const q=count(b.dataset.potion);b.disabled=!q||using;b.classList.toggle('selected',b.dataset.potion===selected);b.querySelector('small').textContent='×'+q;}
  document.body.classList.toggle('potion219-equipped',!!equipped&&!using);document.documentElement.style.setProperty('--potion219-art','url("'+sprite+'")');
 }
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
 const forward=new T.Vector3(),right=new T.Vector3(),up=new T.Vector3(),target=new T.Vector3();
 const smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
 let drinking=null;
 // Drinking.fbx (Mixamo) imported as real skeletal keyframes; the first-person
 // IK only adapts hand placement to the character/camera already in the game.
 const realDrink=window.FlorestaDrinkingFBX227;
 const realBones={};
 if(realDrink?.tracks){root.traverse(b=>{if(!b.isBone)return;const name=b.name.replace(/^mixamorig[:_]?/i,'').replace(/[^a-z0-9]/gi,'');for(const key of Object.keys(realDrink.tracks))if(name.toLowerCase()===key.toLowerCase())realBones[key]=b;});}
 const realQ0=new T.Quaternion(),realQ1=new T.Quaternion(),realDelta=new T.Quaternion(),realWeighted=new T.Quaternion(),realEuler=new T.Euler();
 const realIdentity=new T.Quaternion();
 function realDrinkSample(u){
  if(!realDrink?.tracks)return null;
  const portion=Math.max(0,Math.min(1,(u-.20)/.80));
  const f=portion*(realDrink.frames-1),i=Math.floor(f),j=Math.min(realDrink.frames-1,i+1),t=f-i;
  const vec=realDrink.leftHand[i],next=realDrink.leftHand[j],origin=realDrink.leftHand[0];
  const sourceY=vec[1]+(next[1]-vec[1])*t-origin[1];
  const lift=smooth(sourceY/43);
  const wrist=realDrink.tracks.LeftHand;
  realQ0.fromArray(wrist[i]);realQ1.fromArray(wrist[j]);realDelta.copy(realQ0).slerp(realQ1,t);
  const wristTilt=Math.max(0,realEuler.setFromQuaternion(realDelta,'XYZ').y);
  return {i,j,t,lift,wristTilt};
 }
 function applyRealDrinkPose(sample,u){
  const into=smooth((u-.19)/.06)*(1-smooth((u-.965)/.035));
  for(const [key,track] of Object.entries(realDrink.tracks)){
   const bone=realBones[key];if(!bone)continue;
   const weight=(key==='Head'||key==='Neck'?.20:key.startsWith('Spine')?.28:key.startsWith('Right')?.48:.83)*into;
   if(weight<=0)continue;
   realQ0.fromArray(track[sample.i]);realQ1.fromArray(track[sample.j]);
   realDelta.copy(realQ0).slerp(realQ1,sample.t);
   realWeighted.slerpQuaternions(realIdentity,realDelta,weight);
   bone.quaternion.multiply(realWeighted).normalize();
  }
  root.updateMatrixWorld(true);
 }
 function fitRealDrinkBottle(o,palmTarget,q){
  // Preserve the animated wrist and fingers. Only re-target arm reach, keeping
  // the source FBX wrist rotation and real hand geometry attached to the flask.
  restoreFingers();
  for(let n=0;n<2;n++){
   root.updateMatrixWorld(true);
   const wrist=bones.lHand.getWorldPosition(new T.Vector3()),offset=palmCenter().sub(wrist);
   rig.armIK('left',palmTarget.clone().sub(offset));
  }
  grip();o.quaternion.copy(q);
  const center=palmCenter().addScaledVector(right,.012);
  o.position.copy(center).sub(o.userData.grip.clone().multiply(o.scale).applyQuaternion(q));
  o.visible=true;o.updateMatrixWorld(true);
 }
 const neckLocal=new T.Vector3(0,.133,0),worldY=new T.Vector3(0,1,0);
 const stream=new T.Mesh(new T.CylinderGeometry(.004,.006,1,7),new T.MeshPhysicalMaterial({color:0xffaf38,roughness:.18,transparent:true,opacity:.8,depthWrite:false}));
 stream.name='V226_Oleo_Fio_Continuo';stream.visible=false;g.scene.add(stream);
 const drops=Array.from({length:8},()=>{const m=new T.Mesh(new T.SphereGeometry(.006,6,5),stream.material);m.visible=false;g.scene.add(m);return m});
 const looseCork=new T.Mesh(new T.CylinderGeometry(.024,.022,.035,16),new T.MeshStandardMaterial({color:0xa67a49,roughness:1}));looseCork.visible=false;g.scene.add(looseCork);
 function localPoint(x,y,z){return g.camera.getWorldPosition(new T.Vector3()).addScaledVector(right,x).addScaledVector(up,y).addScaledVector(forward,z)}
 function bottleRotation(tilt){
  const axis=up.clone().multiplyScalar(Math.cos(tilt)).addScaledVector(forward,-Math.sin(tilt)).normalize();
  const z=new T.Vector3().crossVectors(right,axis).normalize();const x=new T.Vector3().crossVectors(axis,z).normalize();
  return new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,axis,z));
 }
 // Match the actual knuckle spread to the bottle axis. Finger curl is applied
 // afterwards; the imported hand and its original skin weights remain intact.
 function orientLeft(q){
  const hand=bones.lHand,i=chains.Index[0],p=chains.Pinky[0],m=chains.Middle[0];if(!hand||!i||!p||!m)return;
  root.updateMatrixWorld(true);
  const across=i.getWorldPosition(new T.Vector3()).sub(p.getWorldPosition(new T.Vector3())).normalize();
  const along=m.getWorldPosition(new T.Vector3()).sub(hand.getWorldPosition(new T.Vector3()));along.addScaledVector(across,-along.dot(across)).normalize();
  const normal=new T.Vector3().crossVectors(across,along).normalize();
  const desiredAcross=worldY.clone().applyQuaternion(q),desiredAlong=forward.clone().addScaledVector(desiredAcross,-forward.dot(desiredAcross));
  if(desiredAlong.lengthSq()<.01)desiredAlong.copy(up).addScaledVector(desiredAcross,-up.dot(desiredAcross));desiredAlong.normalize();
  const desiredNormal=new T.Vector3().crossVectors(desiredAcross,desiredAlong).normalize();
  const a=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(across,along,normal));
  const b=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(desiredAcross,desiredAlong,desiredNormal));
  const world=hand.getWorldQuaternion(new T.Quaternion());
  const parent=hand.parent.getWorldQuaternion(new T.Quaternion()).invert();
  hand.quaternion.copy(parent.multiply(b.multiply(a.invert())).multiply(world));root.updateMatrixWorld(true);
 }
 function fitBottle(o,palmTarget,q){
  // IK operates on the wrist, so compensate for the real palm offset twice.
  restoreFingers();
  for(let n=0;n<2;n++){
   const wrist=bones.lHand.getWorldPosition(new T.Vector3()),palm=palmCenter();
   rig.armIK('left',palmTarget.clone().sub(palm.sub(wrist)));orientLeft(q);
  }
  grip();o.quaternion.copy(q);
  const center=palmCenter().addScaledVector(right,.012);
  o.position.copy(center).sub(o.userData.grip.clone().multiply(o.scale).applyQuaternion(q));o.visible=true;o.updateMatrixWorld(true);
 }
 function presentAxe(){
  const tool=window.gameRightHand;if(tool.current!=='axe')tool.equip('axe');const axe=tool.object;if(!axe)return null;
  rig.armIK('right',localPoint(.20,-.48,.55));rig.applyGrip?.();root.updateMatrixWorld(true);
  const palm=rig.palmReference();
  const axis=up.clone().multiplyScalar(.9).addScaledVector(right,-.33).normalize();
  const x=right.clone().addScaledVector(axis,-right.dot(axis)).normalize();const z=new T.Vector3().crossVectors(x,axis).normalize();
  axe.quaternion.setFromRotationMatrix(new T.Matrix4().makeBasis(x,axis,z));
  axe.position.copy(palm.center).sub(new T.Vector3(0,-.105,0).multiply(axe.scale).applyQuaternion(axe.quaternion));axe.visible=true;axe.updateMatrixWorld(true);
  return axe.localToWorld(new T.Vector3(.015,.255,0));
 }
 function flow(o,end,u){
  const start=o.localToWorld(neckLocal.clone());const distance=start.distanceTo(end);
  stream.visible=true;stream.position.copy(start).add(end).multiplyScalar(.5);stream.scale.set(1,distance,1);stream.quaternion.setFromUnitVectors(worldY,end.clone().sub(start).normalize());
  drops.forEach((d,i)=>{const t=(u*6+i/8)%1;d.visible=true;d.position.copy(start).lerp(end,t);d.position.addScaledVector(right,Math.sin(i*2.4)*.009*t);d.scale.set(.65,1.5,.65)});
 }
 function updatePose(){
  if(!equipped||(!using&&(alq.state.busy||window.gameCraft?.active||window.gameRoll?.active||window.gamePlayerHit?.active))){for(const o of Object.values(models))o.visible=false;return;}
  if(!count(equipped)&&!using){sync();return;}
  const o=model(equipped),cq=g.camera.getWorldQuaternion(new T.Quaternion());
  forward.set(0,0,-1).applyQuaternion(cq);right.set(1,0,0).applyQuaternion(cq);up.set(0,1,0).applyQuaternion(cq);
  stream.visible=false;drops.forEach(d=>d.visible=false);looseCork.visible=false;
  const idle=localPoint(-.24,-.27,.47);let palm=idle,q=bottleRotation(-.10);
  if(drinking){
   const a=drinking,u=Math.min(1,Math.max(0,(performance.now()-a.start)/a.duration));a.progress=u;
   const ready=smooth(u/.13),returning=smooth((u-.84)/.16);
   palm=idle.clone().lerp(localPoint(-.15,-.20,.43),ready*(1-returning));
   const realDrinking=a.mode==='drink'&&!!realDrink?.tracks;
   const openPhase=realDrinking?u*(.34/.20):u;
   if(u<(realDrinking?.20:.34)){
    fitBottle(o,palm,q);
    const cork=o.localToWorld(new T.Vector3(0,.15,0));
    const reach=smooth(openPhase/.12),pull=smooth((openPhase-.16)/.12);
    const capTarget=localPoint(.24,-.34,.42).lerp(cork,reach).addScaledVector(up,pull*.105).addScaledVector(right,pull*.10);
    const wrist=bones.rHand.getWorldPosition(new T.Vector3()),palmOffset=rig.palmReference().center.clone().sub(wrist);
    rig.armIK('right',capTarget.clone().sub(palmOffset));rig.applyGrip?.();root.updateMatrixWorld(true);
    o.userData.cork.visible=openPhase<.17;
    if(openPhase>=.17){looseCork.visible=true;looseCork.position.copy(rig.palmReference().center);looseCork.quaternion.copy(q);looseCork.rotateY(pull*1.3);}
   }else{
    o.userData.cork.visible=false;
    if(a.mode==='oil'){
     const blade=presentAxe();
     const pour=smooth((u-.36)/.13)*(1-smooth((u-.76)/.09));
     // The bottle mouth remains over the actual transformed blade.
     const axis=up.clone().multiplyScalar(Math.cos(pour*2.08)).addScaledVector(right,Math.sin(pour*2.08)).normalize();
     const z=forward.clone().negate(),x=new T.Vector3().crossVectors(axis,z).normalize();z.crossVectors(x,axis).normalize();
     const tiltQ=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(x,axis,z));q.slerp(tiltQ,1-returning);
     if(blade){const mouth=blade.clone().addScaledVector(up,.14);const desired=mouth.sub(new T.Vector3(0,.133,0).sub(o.userData.grip).multiply(o.scale).applyQuaternion(q));palm.lerp(desired,(1-returning)*smooth((u-.32)/.13));}
     fitBottle(o,palm,q);
     if(blade&&u>.49&&u<.77)flow(o,blade,u);
    }else if(realDrinking){
     const src=realDrinkSample(u);
     applyRealDrinkPose(src,u);
     // Follow the FBX hand's sampled rise, not a synthetic raise/lower wave.
     // Scale the original mocap to the first-person eye-level framing.
     const lift=src.lift;
     palm=localPoint(-.24+.18*lift,-.27+.17*lift,.47-.32*lift);
     q=bottleRotation(-.10+Math.min(2.12,src.wristTilt*2.85));
     fitRealDrinkBottle(o,palm,q);
    }else{
     const lift=smooth((u-.33)/.18)*(1-smooth((u-.77)/.09));
     q=bottleRotation(-.10+lift*2.08);
     // Position from the lip, rather than moving an unattached flask toward the face.
     const mouth=localPoint(-.025,-.105,.135);
     const drinkPalm=mouth.sub(new T.Vector3(0,.133,0).sub(o.userData.grip).multiply(o.scale).applyQuaternion(q));
     palm.lerp(drinkPalm,lift);fitBottle(o,palm,q);
     rig.armIK('right',localPoint(.27,-.47,.40));
    }
   }
   if(u>=(realDrinking?.56:.49)){const drained=smooth((u-(realDrinking?.56:.49))/(realDrinking?.20:.27));o.userData.fill.scale.y=1-drained*.96;o.userData.fill.position.y=-.087*(1-o.userData.fill.scale.y);o.userData.liquidSurface.visible=false;}
  }else{fitBottle(o,palm,q);o.userData.cork.visible=true;}
 }
 async function animateUse(mode='drink'){
  if(drinking||!equipped)return false;
  const o=model(equipped),tool=window.gameRightHand,savedTool=tool.current;
  const saved=[];for(const b of [bones.lArm,bones.lFore,bones.lHand,bones.rArm,bones.rFore,bones.rHand])if(b)saved.push([b,b.quaternion.clone()]);
  const busy=alq.state.busy;alq.state.busy=true;
  tool.unequip?.();
  drinking={mode,start:performance.now(),duration:mode==='oil'?3400:(realDrink?.tracks?3850:3000),progress:0};
  try{
   await new Promise((resolve,reject)=>{function frame(){try{updatePose();if(drinking.progress>=1)resolve();else requestAnimationFrame(frame)}catch(e){reject(e)}}requestAnimationFrame(frame)});
   return true;
  }finally{
   drinking=null;alq.state.busy=busy;stream.visible=false;drops.forEach(d=>d.visible=false);looseCork.visible=false;
   o.userData.cork.visible=true;o.userData.liquidSurface.visible=true;o.userData.fill.scale.y=1;o.userData.fill.position.y=0;
   for(const [b,q]of saved)b.quaternion.copy(q);restoreFingers();
   if(mode==='oil')tool.equip?.('axe');else if(savedTool)tool.equip?.(savedTool);else tool.unequip?.();
  }
 }
 const animateDrink=()=>animateUse('drink');

 window.addEventListener('pointerdown',e=>{if(using&&!hot.contains(e.target)){e.preventDefault();e.stopImmediatePropagation()}},true);
 window.addEventListener('keydown',e=>{if(using&&['KeyQ','KeyE','KeyR','KeyP','KeyY','Digit1','Digit2','Digit3','Digit4','Digit5','Digit6','Digit7','Digit8','Digit9'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation()}},true);
 const render=g.renderer.render;g.renderer.render=function(scene,camera,...args){if(camera===g.camera)updatePose();return render.call(this,scene,camera,...args)};
 window.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||e.shiftKey||e.target?.closest?.('input,textarea,select,[contenteditable="true"]'))return;if(e.code!=='KeyP'&&e.code!=='KeyY')return;e.preventDefault();e.stopImmediatePropagation();if(blocked())return;if(e.code==='KeyP')toggle();else useSelected()},true);
 let wheelAt=-Infinity;
 window.addEventListener('wheel',e=>{
  if((!equipped&&!hot.contains(e.target))||e.shiftKey||e.ctrlKey||e.altKey||e.metaKey||blocked()||e.target?.closest?.('#potion219Picker'))return;
  if(Math.abs(e.deltaY)<1)return;e.preventDefault();e.stopImmediatePropagation();
  if(performance.now()-wheelAt<140)return;wheelAt=performance.now();cycle(e.deltaY);
 },{capture:true,passive:false});
 window.addEventListener('pointerdown',e=>{if(!hot.contains(e.target)){picker.hidden=true;selectButton.setAttribute('aria-expanded','false')}},true);
 let touchStart=null;
 area.addEventListener('touchstart',e=>{touchStart=e.touches[0]?.clientX},{passive:true});
 area.addEventListener('touchend',e=>{const dx=(e.changedTouches[0]?.clientX||0)-touchStart;if(touchStart!=null&&Math.abs(dx)>25){e.preventDefault();cycle(dx<0?1:-1)}touchStart=null},{passive:false});
 for(const [api,method,left] of [[window.gameShield,'equip',()=>true],[window.gameBranchHands,'equip',side=>side==='left'],[window.gameBranchHands,'toggle',side=>side==='left'],[window.gameBranchHands,'left',()=>true]]){
  if(!api?.[method])continue;const old=api[method];api[method]=function(...args){if(left(...args)&&equipped){if(using)return false;unequip()}return old.apply(this,args)};
 }
 document.getElementById('equipBtn')?.addEventListener('click',e=>{if(!equipped)return;if(using){e.stopImmediatePropagation();e.preventDefault();return}unequip()},true);
 window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!picker.hidden){picker.hidden=true;sync()}},true);
 const timer=setInterval(()=>{if(equipped&&!using&&(g.isEquipped?.()||window.gameShield?.equipped||window.gameBranchHands?.side==='left'||window.gameLumber?.carrying||document.body.classList.contains('v206-mounted')))unequip();sync()},180);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});sync();
 window.gamePotionSlot220=window.gamePotionSlot219={version:'V227',get selected(){return selected},get equipped(){return equipped},get using(){return using},get hand(){return 'left'},get model(){return equipped?model(equipped):null},equip,unequip,toggle,use:useSelected,select,cycle,sync,updatePose,animateDrink,animateUse,get animation(){return drinking?{mode:drinking.mode,progress:drinking.progress}:null},models};
 inv.refresh?.();
})();
