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
 window.gamePotionSlot220=window.gamePotionSlot219={version:'V220',get selected(){return selected},get equipped(){return equipped},get using(){return using},get hand(){return 'left'},get model(){return equipped?model(equipped):null},equip,unequip,toggle,use:useSelected,select,cycle,sync,updatePose,animateDrink,models};
 inv.refresh?.();
})();
