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
 const base=window.gameRightHand;
 const notice=msg=>{const s=document.getElementById('status');if(s)s.textContent=msg;};
 function blocked(allowInventory=false){return !!(using||alq.state.busy||window.gameCraft?.active||window.gameRoll?.active||window.gamePlayerHit?.active||window.gameLumber?.carrying||window.gameCreativeSpiderMount?.mounted||document.body.classList.contains('v206-mounted')||window.gameZombie?.playerHp<=0||(!allowInventory&&inv.isOpen)||document.querySelector('#craftOverlay.open,#constructionOverlay.open,#directorOverlay.open,#skillTreeOverlay.open,#florestaFront:not([hidden]),#florestaHackOverlay.open')||document.querySelector('#alq189Panel.open,#alqPanel.open,#alchemyPanel.open'))}
 function store(){try{localStorage.setItem('floresta-potion-slot-v219',selected)}catch{}}
 function hide(){for(const o of Object.values(models))o.visible=false;document.body.classList.remove('potion219-equipped')}
 function unequip(){equipped=null;hide();inv.refresh?.();sync();return true}
 function equip(id){
  if(!isPotion(id)||!count(id)||blocked(true))return false;
  if(base.current&&base.unequip?.()===false)return false;
  selected=id;equipped=id;store();model(id).visible=true;document.body.classList.add('potion219-equipped');inv.refresh?.();sync();notice(defs[id.slice(11)].name+' equipada • Y ou Usar');return true;
 }
 window.gameRightHand={
  get current(){return equipped||base.current},get object(){return equipped?model(equipped):base.object},
  equip(id){if(using&&!(selected.endsWith('_fogo')&&id==='axe'))return false;if(isPotion(id))return equip(id);if(equipped)unequip();return base.equip?.(id)},
  unequip(){if(using)return false;return equipped?unequip():base.unequip?.()},
  toggle(id='axe'){return this.current===id?this.unequip():this.equip(id)},
  sync(){if(equipped){if(!count(equipped)&&!using)unequip();else updatePose();return;}return base.sync?.()}
 };
 async function useSelected(){
  if(blocked()||!count(selected))return false;
  if(equipped!==selected&&!equip(selected))return false;
  const id=selected,key=id.slice(11);using=true;hide();sync();
  try{
   const result=await alq.use(key);
   if(result===false)return false;
   return true;
  }catch(e){console.error('[Poções V219]',e);notice('Não foi possível usar a poção.');return false;}
  finally{
   using=false;
   if(key!=='fogo'&&count(id)){equipped=id;model(id).visible=true;}
   else if(equipped===id)unequip();
   sync();inv.refresh?.();
  }
 }
 const hot=document.getElementById('u173Hotbar'),slots=hot.querySelector('.u173-slots');
 const dock=document.createElement('div');dock.id='potion219Dock';slots.before(dock);dock.append(slots);
 const area=document.createElement('div');area.id='potion219Slot';area.innerHTML='<button id="potion219Equip" type="button" aria-label="Equipar poção"><kbd>0</kbd><img alt="" draggable="false"><small></small><span>Poção</span></button><button id="potion219Select" type="button" aria-label="Escolher poção" aria-expanded="false">⌄</button><button id="potion219Use" type="button">Usar <kbd>Y</kbd></button>';dock.append(area);
 const picker=document.createElement('div');picker.id='potion219Picker';picker.hidden=true;picker.setAttribute('role','group');picker.setAttribute('aria-label','Escolher poção');hot.append(picker);
 for(const key of keys){const id='alq_potion_'+key,b=document.createElement('button');b.type='button';b.dataset.potion=id;b.innerHTML='<img alt="" draggable="false"><span></span><small></small>';b.querySelector('img').src=window.florestaV183Art?.items?.[id]||'';b.querySelector('span').textContent=defs[key].name;b.onclick=()=>{if(blocked())return;selected=id;store();if(equipped)equip(id);picker.hidden=true;sync()};picker.append(b)}
 const equipButton=area.querySelector('#potion219Equip'),selectButton=area.querySelector('#potion219Select'),useButton=area.querySelector('#potion219Use');
 equipButton.onclick=()=>{if(blocked())return;if(equipped===selected)unequip();else equip(selected)};
 useButton.onclick=()=>useSelected();selectButton.onclick=()=>{if(blocked())return;picker.hidden=!picker.hidden;sync()};
 function sync(){
  if(!count(selected)&&!using){const first=keys.map(k=>'alq_potion_'+k).find(id=>count(id)>0);if(first)selected=first;}
  if(equipped&&!count(equipped)&&!using)unequip();
  const qty=count(selected),def=defs[selected.slice(11)],sprite=window.florestaV183Art?.items?.[selected]||'';
  const img=equipButton.querySelector('img');if(img.src!==sprite)img.src=sprite;
  equipButton.querySelector('small').textContent=qty?String(qty):'0';equipButton.querySelector('span').textContent=def.name;
  equipButton.disabled=!qty||using;equipButton.classList.toggle('active',equipped===selected);equipButton.setAttribute('aria-pressed',String(equipped===selected));equipButton.title=(equipped===selected?'Guardar ':'Equipar ')+def.name+' • 0';
  useButton.disabled=!qty||using;useButton.innerHTML=(using?'Usando…':selected.endsWith('_fogo')?'Aplicar óleo':'Usar')+' <kbd>Y</kbd>';
  selectButton.disabled=using;selectButton.setAttribute('aria-expanded',String(!picker.hidden));
  for(const b of picker.children){const q=count(b.dataset.potion);b.disabled=!q||using;b.classList.toggle('selected',b.dataset.potion===selected);b.querySelector('small').textContent='×'+q;}
  document.body.classList.toggle('potion219-equipped',!!equipped&&!using);document.documentElement.style.setProperty('--potion219-art','url("'+sprite+'")');
 }
 const forward=new T.Vector3(),right=new T.Vector3(),target=new T.Vector3(),offset=new T.Vector3(),rotation=new T.Quaternion(),euler=new T.Euler();
 function updatePose(){
  if(!equipped||using||alq.state.busy||window.gameCraft?.active){for(const o of Object.values(models))o.visible=false;return;}
  if(!count(equipped)){unequip();return;}
  const o=model(equipped),yaw=g.player.yaw,pitch=g.player.pitch;
  forward.set(-Math.sin(yaw)*Math.cos(pitch),Math.sin(pitch),-Math.cos(yaw)*Math.cos(pitch));right.set(Math.cos(yaw),0,-Math.sin(yaw));
  target.copy(g.camera.position).addScaledVector(forward,.46).addScaledVector(right,.23);target.y-=.24;
  rig.armIK('right',target);rig.applyGrip();g.trueFirstPerson?.visibleRoot?.updateMatrixWorld(true);
  const palm=rig.palmReference().center;euler.set(.10,yaw,-.08,'YXZ');rotation.setFromEuler(euler);o.quaternion.copy(rotation);offset.copy(o.userData.grip).applyQuaternion(rotation);o.position.copy(palm).sub(offset);o.visible=true;o.updateMatrixWorld(true);
 }
 const render=g.renderer.render;g.renderer.render=function(scene,camera,...args){if(camera===g.camera)updatePose();return render.call(this,scene,camera,...args)};
 function bindAttack(){const a=window.gameAttack;if(!a?.attack||a.attack.__potion219)return;const old=a.attack;a.attack=function(...args){return equipped?useSelected():old.apply(this,args)};a.attack.__potion219=true}
 window.addEventListener('keydown',e=>{if(e.repeat||e.altKey||e.ctrlKey||e.metaKey||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;if(e.code!=='Digit0'&&e.code!=='KeyY')return;if(blocked())return;e.preventDefault();e.stopImmediatePropagation();if(e.code==='KeyY')useSelected();else if(e.shiftKey){const available=keys.map(k=>'alq_potion_'+k).filter(id=>count(id));if(available.length){selected=available[(available.indexOf(selected)+1)%available.length];store();if(equipped)equip(selected);sync()}}else if(equipped===selected)unequip();else equip(selected)},true);
 window.addEventListener('pointerdown',e=>{if(equipped&&e.target===document.getElementById('c')&&e.pointerType==='mouse'&&e.button===0&&document.pointerLockElement===e.target&&!blocked()){e.preventDefault();e.stopImmediatePropagation();useSelected();return;}if(!hot.contains(e.target)){picker.hidden=true;selectButton.setAttribute('aria-expanded','false')}},true);
 window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!picker.hidden){picker.hidden=true;sync()}},true);
 const timer=setInterval(()=>{bindAttack();sync()},180);window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});bindAttack();sync();
 window.gamePotionSlot219={version:'V219',get selected(){return selected},get equipped(){return equipped},get using(){return using},get model(){return equipped?model(equipped):null},equip,unequip,use:useSelected,select(id){if(!isPotion(id)||!count(id)||using)return false;selected=id;store();if(equipped)equip(id);sync();return true},sync,updatePose,models};
 inv.refresh?.();
})();
