/* Floresta V210 — OFICINA. An editor embutido, isolado da lógica de sobrevivência.
 * Usa a cena/câmera oficial da V209; não substitui assets, ações ou controles do jogo.
 */
(() => {
'use strict';
if (window.gameOficinaV210) return;
const VERSION='V210.1';
const STORAGE='floresta-oficina-v210-project';
const $=(s,root=document)=>root.querySelector(s);
const $$=(s,root=document)=>Array.from(root.querySelectorAll(s));
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
const deg=r=>r*180/Math.PI,rad=d=>d*Math.PI/180;
const val=(v,f=0)=>Number.isFinite(+v)?+v:f;
const nice=(x)=>Number(x||0).toFixed(2);
const uid=()=>('obj-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2,8));
let T, g, scene, renderer, originalRender, active=false, cam, selected=null, helper=null;
let root, inspector, hierarchy, toastTimer, cameraKeys=new Set();
let tool='select', snap=.5, useSnap=true, drag=null, hasProject=false, brushType='tree', brushLast=0;
let currentTime=0, duration=4, playing=false, loopAnim=true, lastFrame=performance.now();
let owned=new Map(), changes=new Map(), undo=[], redo=[], imported=new Map(), importedMixers=new Map(), fileReaderInput;
let uiReady=false, refreshAt=0, lastPointer={x:0,y:0};
let raycaster, v2, groundPlane, cameraTarget;
const TOOL_TEXT={select:'Clique num objeto para editar',move:'Arraste o objeto selecionado para movê-lo',rotate:'Arraste para girar',scale:'Arraste para aumentar ou diminuir',paint:'Pinte o cenário clicando ou arrastando o dedo/mouse'};
function notify(message){
 if(!uiReady){console.info('[OFICINA]',message);return;}
 const el=$('.fe-toast',root);el.textContent=message;el.style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.style.display='none',3200);
}
function markChanged(){hasProject=true;const st=$('#fe-save-state',root);if(st)st.textContent='Alterações não salvas';}
function historyAdd(before,after,object=selected){
 if(!object||JSON.stringify(before)===JSON.stringify(after))return;
 const e={undo:()=>restoreState(object,before),redo:()=>restoreState(object,after)};
 undo.push(e);if(undo.length>60)undo.shift();redo.length=0;markChanged();
}
function doUndo(){const step=undo.pop();if(!step)return;step.undo();redo.push(step);renderInspector();refreshHierarchy();notify('Desfeito');}
function doRedo(){const step=redo.pop();if(!step)return;step.redo();undo.push(step);renderInspector();refreshHierarchy();notify('Refeito');}
function saveState(obj){
 if(!obj)return null;
 let mesh=findMaterialMesh(obj),mat=mesh?.material;
 if(Array.isArray(mat))mat=mat[0];
 return {p:obj.position.toArray(),r:obj.rotation.toArray().slice(0,3),s:obj.scale.toArray(),visible:obj.visible,name:obj.name,
  material:mat?{color:mat.color?.getHexString?.()||null,opacity:mat.opacity,wireframe:!!mat.wireframe}:null,
  intensity:obj.isLight?obj.intensity:null,keys:obj.userData.feKeys?JSON.parse(JSON.stringify(obj.userData.feKeys)):null};
}
function restoreState(obj,state){
 if(!obj||!state)return;
 obj.position.fromArray(state.p);obj.rotation.set(...state.r);obj.scale.fromArray(state.s);obj.visible=state.visible;obj.name=state.name;
 const mat=findMaterialMesh(obj)?.material,materials=Array.isArray(mat)?mat:[mat];
 for(const m of materials.filter(Boolean)){
  if(state.material?.color&&m.color)m.color.set('#'+state.material.color);
  if(state.material?.opacity!==undefined&&'opacity' in m){m.opacity=state.material.opacity;m.transparent=m.opacity<.999||m.transparent;}
  if(state.material?.wireframe!==undefined&&'wireframe' in m)m.wireframe=state.material.wireframe;
  m.needsUpdate=true;
 }
 if(obj.isLight&&state.intensity!==null)obj.intensity=state.intensity;
 if(state.keys)obj.userData.feKeys=JSON.parse(JSON.stringify(state.keys));else delete obj.userData.feKeys;
 if(!obj.userData.feOwned)changes.set(objectPath(obj),{hint:obj.userData.feOriginalName??obj.name,state:saveState(obj)});
 if(obj.userData.feOwned)owned.set(obj.userData.feId,obj);
 if(selected===obj)syncHelper();
 markChanged();
}
function objectPath(obj){
 const out=[];let node=obj;
 while(node&&node!==scene){if(!node.parent)return '';out.unshift(node.parent.children.indexOf(node));node=node.parent;}
 return node===scene?out.join('.') : '';
}
function getPath(path){let node=scene;for(const p of String(path).split('.')){if(!/^\d+$/.test(p))return null;node=node.children[+p];if(!node)return null;}return node;}
function nativeChanged(obj){if(!obj?.userData.feOwned){const key=objectPath(obj);if(key)changes.set(key,{hint:obj.userData.feOriginalName??obj.name,state:saveState(obj)});}markChanged();}
function findMaterialMesh(obj){if(obj.isMesh)return obj;let found=null;obj.traverse(n=>{if(!found&&n.isMesh)found=n;});return found;}
function modelDragon(obj){const list=window.gameDragonLab?.dragons||[];return list.find(e=>obj===e.holder||obj===e.root||isAncestor(obj,e.holder)||isAncestor(e.holder,obj))||null;}
function isAncestor(child,ancestor){while(child){if(child===ancestor)return true;child=child.parent;}return false;}
function boxHelperClear(){if(helper){helper.removeFromParent();helper.geometry?.dispose?.();helper.material?.dispose?.();helper=null;}}
function syncHelper(){boxHelperClear();if(!selected||!selected.parent||!selected.visible)return;try{helper=new T.BoxHelper(selected,0xffc178);helper.userData.feHelper=true;scene.add(helper);}catch(err){console.warn('[OFICINA] helper',err);}}
function choose(obj){selected=obj&&obj!==scene?obj:null;syncHelper();renderInspector();refreshHierarchy();}
function placeNearPlayer(dist=7){const p=g.player,yaw=p.yaw||0,x=p.x-Math.sin(yaw)*dist,z=p.z-Math.cos(yaw)*dist;
 const gy=typeof g.groundY==='function'?g.groundY(x,z):0;
 return new T.Vector3(x,Number.isFinite(gy)?gy:0,z);}
function colored(hex=0x79674e,opts={}){return new T.MeshStandardMaterial({color:hex,roughness:.87,flatShading:false,...opts});}
function addMesh(group,mesh,x=0,y=0,z=0){mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;group.add(mesh);return mesh;}
function buildObject(type,data){
 const group=new T.Group();group.userData.feOwned=true;group.userData.feId=data?.id||uid();group.userData.feType=type;group.name=data?.name||({tree:'Árvore editável',rock:'Rocha editável',box:'Bloco',wall:'Parede',floor:'Piso',ball:'Esfera',pillar:'Pilar',light:'Luz quente',camp:'Fogueira',bush:'Arbusto',path:'Solo de terra',model:'Modelo GLB'}[type]||type);
 const trunk=colored(0x675037),leaves=colored(0x355e37),stone=colored(0x787b72),wood=colored(0x967552),fire=colored(0xed8c34,{emissive:0xea5b13,emissiveIntensity:.85});
 if(type==='tree'){
  addMesh(group,new T.Mesh(new T.CylinderGeometry(.27,.45,5.8,10),trunk),0,2.9,0);
  for(let i=0;i<3;i++){const r=2.0-i*.29,h=3.7-i*.2;
   addMesh(group,new T.Mesh(new T.ConeGeometry(r,h,10),leaves),0,4.15+i*1.25,0);}
 }else if(type==='bush'){
  for(let i=0;i<6;i++){const a=i*2.4;const m=addMesh(group,new T.Mesh(new T.SphereGeometry(.68,11,9),leaves),Math.cos(a)*.45,.42+((i%3)*.2),Math.sin(a)*.45);m.scale.set(1,.55,1);}
 }else if(type==='path'){addMesh(group,new T.Mesh(new T.BoxGeometry(4,.07,4),colored(0x554c36)),0,.02,0);
 }else if(type==='rock'){
  const m=addMesh(group,new T.Mesh(new T.DodecahedronGeometry(1.25,1),stone),0,.95,0);m.scale.set(1.45,.75,.95);
 }else if(type==='box'){addMesh(group,new T.Mesh(new T.BoxGeometry(2,2,2),wood),0,1,0);
 }else if(type==='floor'){addMesh(group,new T.Mesh(new T.BoxGeometry(4,.22,4),wood),0,.11,0);
 }else if(type==='wall'){addMesh(group,new T.Mesh(new T.BoxGeometry(4,3,.3),stone),0,1.5,0);
 }else if(type==='pillar'){addMesh(group,new T.Mesh(new T.CylinderGeometry(.45,.45,4,12),stone),0,2,0);
 }else if(type==='ball'){addMesh(group,new T.Mesh(new T.SphereGeometry(1,16,12),stone),0,1,0);
 }else if(type==='camp'){
  for(let i=0;i<5;i++){const a=i*Math.PI*2/5;addMesh(group,new T.Mesh(new T.DodecahedronGeometry(.45,0),stone),Math.cos(a)*.67,.19,Math.sin(a)*.67);}
  for(let i=0;i<3;i++){const a=i*Math.PI*2/3;const m=addMesh(group,new T.Mesh(new T.CylinderGeometry(.12,.18,1.35,8),trunk),Math.cos(a)*.17,.48,Math.sin(a)*.17);m.rotation.z=.9;m.rotation.y=a;}
  addMesh(group,new T.Mesh(new T.ConeGeometry(.42,1.25,8),fire),0,.95,0);
  const l=new T.PointLight(0xff8539,2.5,15);l.position.y=1.15;group.add(l);
 }else if(type==='light'){const l=new T.PointLight(0xffd7a5,3,30);l.name='Luz';l.position.y=2;group.add(l);
  addMesh(group,new T.Mesh(new T.SphereGeometry(.18,12,8),colored(0xffcf74,{emissive:0xffb447,emissiveIntensity:2})),0,2,0);
 }
 return group;
}
function create(type,at){
 const object=buildObject(type);object.position.copy(at||placeNearPlayer());scene.add(object);owned.set(object.userData.feId,object);
 undo.push({undo:()=>{object.removeFromParent();owned.delete(object.userData.feId);if(selected===object)choose(null);},redo:()=>{scene.add(object);owned.set(object.userData.feId,object);choose(object);}});redo.length=0;
 choose(object);markChanged();notify('Criado: '+object.name+'. Clique e arraste para posicionar.');return object;
}
function duplicate(){if(!selected){notify('Escolha um objeto primeiro');return;}
 if(!selected.userData.feOwned){let skinned=false;selected.traverse(o=>{if(o.isSkinnedMesh)skinned=true;});if(skinned){notify('Modelo animado: use o painel Dragões ou importe outro GLB.');return;}}
 const clone=selected.clone(true);clone.userData.feOwned=true;clone.userData.feId=uid();clone.name=(selected.name||'Objeto')+' cópia';clone.userData.feType=selected.userData.feType||'clone';clone.userData.feSource=selected.userData.feSource||null;if(!selected.userData.feOwned)clone.userData.feSourcePath=objectPath(selected);
 if(selected.userData.feKeys)clone.userData.feKeys=JSON.parse(JSON.stringify(selected.userData.feKeys));
 // Evita compartilhar materiais ao mudar a cor em uma cópia.
 clone.traverse(n=>{if(n.isMesh&&n.material)n.material=Array.isArray(n.material)?n.material.map(m=>m.clone()):n.material.clone();});
 clone.position.x+=2;clone.position.z+=2;scene.add(clone);owned.set(clone.userData.feId,clone);
 undo.push({undo:()=>{clone.removeFromParent();owned.delete(clone.userData.feId);choose(null);},redo:()=>{scene.add(clone);owned.set(clone.userData.feId,clone);choose(clone);}});redo.length=0;
 choose(clone);markChanged();notify('Cópia criada');
}
function removeSelected(){if(!selected)return;const target=selected,ownedObject=!!target.userData.feOwned;
 const oldVis=target.visible,oldParent=target.parent,idx=oldParent?.children.indexOf(target)||0;
 if(ownedObject){target.removeFromParent();owned.delete(target.userData.feId);}else{target.visible=false;nativeChanged(target);}
 undo.push({undo:()=>{if(ownedObject){oldParent.add(target);owned.set(target.userData.feId,target);}else{target.visible=oldVis;nativeChanged(target);}choose(target);},redo:()=>{if(ownedObject){target.removeFromParent();owned.delete(target.userData.feId);}else{target.visible=false;nativeChanged(target);}choose(null);}});redo.length=0;
 choose(null);markChanged();notify(ownedObject?'Objeto removido. Ctrl+Z desfaz.':'Objeto original ocultado. Ctrl+Z desfaz.');
}
function worldPosition(obj){return obj?.getWorldPosition(new T.Vector3());}
function paintAt(e){
 if(performance.now()-brushLast<125)return;brushLast=performance.now();
 const hit=sceneHit(e.clientX,e.clientY);const point=hit?.point?.clone?.()||intersectionOnPlane(e.clientX,e.clientY,0)||placeNearPlayer(9);
 if(!point)return;const gy=typeof g.groundY==='function'?g.groundY(point.x,point.z):point.y;point.y=Number.isFinite(gy)?gy:point.y;
 const density=clamp(val($('#fe-brush-density',root)?.value,1),1,5);
 for(let i=0;i<density;i++){const offset=i===0?0:Math.random()*2.3,angle=Math.random()*Math.PI*2;const at=point.clone();at.x=toGrid(point.x+Math.cos(angle)*offset);at.z=toGrid(point.z+Math.sin(angle)*offset);at.y=typeof g.groundY==='function'?g.groundY(at.x,at.z):point.y;create(brushType,at);}
 }
function pickObject(hit){let obj=hit?.object;if(!obj)return null;
 if(obj.userData.feHelper)return null;
 let node=obj;
 while(node&&node!==scene){if(node.userData.feOwned)return node;node=node.parent;}
 // Prioriza o grupo direto da cena em modelos montados (dragões, árvores agrupadas).
 node=obj;let parent=obj.parent;
 while(parent&&parent!==scene){if(parent.parent===scene&&parent.type==='Group'&&parent.children.length<2000)return parent;parent=parent.parent;}
 return node;
}
function rayFromScreen(x,y){
 const canvas=renderer.domElement,rect=canvas.getBoundingClientRect();
 v2.set((x-rect.left)/rect.width*2-1,-(y-rect.top)/rect.height*2+1);cam.updateMatrixWorld(true);raycaster.setFromCamera(v2,cam);raycaster.far=600;
}
function sceneHit(x,y){
 rayFromScreen(x,y);
 let hits=[];
 try{hits=raycaster.intersectObjects(scene.children,true);}catch(err){console.warn('[OFICINA] raycaster',err);}
 return hits.find(h=>h.object.visible&&h.object.material?.visible!==false&&!h.object.userData.feHelper&&h.distance>.05);
}
function intersectionOnPlane(x,y,yPos){rayFromScreen(x,y);groundPlane.constant=-yPos;return raycaster.ray.intersectPlane(groundPlane,new T.Vector3());}
function toGrid(n){return useSnap&&snap>0?Math.round(n/snap)*snap:n;}
function setTool(v){tool=v;$$('[data-fe-tool]',root).forEach(b=>b.classList.toggle('active',b.dataset.feTool===v));$('.fe-tip',root).textContent=TOOL_TEXT[tool]+' · Botão direito: olhar · Roda: zoom · WASD: câmera';}
function mouseDown(e){if(!active||e.target!==renderer.domElement)return;
 if(e.button===2){drag={kind:'camera',startX:e.clientX,startY:e.clientY,yaw:cam.rotation.y,pitch:cam.rotation.x};e.preventDefault();return;}
 if(e.button===1){drag={kind:'pan',startX:e.clientX,startY:e.clientY,origin:cam.position.clone()};e.preventDefault();return;}
 if(e.button!==0)return;
 e.preventDefault();e.stopImmediatePropagation();
 if(tool==='paint'){paintAt(e);drag={kind:'paint'};return;}
 const hit=sceneHit(e.clientX,e.clientY);let obj=hit?pickObject(hit):null;
 if(tool==='select'||!selected||obj!==selected&&obj){choose(obj);if(e.pointerType==='touch'&&!obj)drag={kind:'camera',startX:e.clientX,startY:e.clientY,yaw:cam.rotation.y,pitch:cam.rotation.x};return;}
 if(!selected)return;
 const before=saveState(selected),point=worldPosition(selected);
 drag={kind:tool,obj:selected,startX:e.clientX,startY:e.clientY,before,startObjWorld:point,startObjLocal:selected.position.clone(),yaw:selected.rotation.y,scale:selected.scale.clone(),planeStart:intersectionOnPlane(e.clientX,e.clientY,point.y)};
}
function mouseMove(e){if(!active||!drag)return;
 if(drag.kind==='paint'){paintAt(e);return;}
 const dx=e.clientX-drag.startX,dy=e.clientY-drag.startY;
 if(drag.kind==='camera'){
  cam.rotation.order='YXZ';cam.rotation.y=drag.yaw-dx*.006;cam.rotation.x=clamp(drag.pitch-dy*.006,-1.53,1.53);return;
 }
 if(drag.kind==='pan'){
  const side=new T.Vector3(1,0,0).applyQuaternion(cam.quaternion),up=new T.Vector3(0,1,0).applyQuaternion(cam.quaternion);
  cam.position.copy(drag.origin).addScaledVector(side,-dx*.035).addScaledVector(up,dy*.035);return;
 }
 if(!drag.obj?.parent)return;
 if(drag.kind==='move'){
  const now=intersectionOnPlane(e.clientX,e.clientY,drag.startObjWorld.y);
  if(now&&drag.planeStart){
   const wp=drag.startObjWorld.clone().add(now.sub(drag.planeStart));
   if(drag.obj.parent){drag.obj.parent.updateMatrixWorld(true);drag.obj.parent.worldToLocal(wp);}
   drag.obj.position.set(toGrid(wp.x),toGrid(wp.y),toGrid(wp.z));
  }
 }else if(drag.kind==='rotate'){drag.obj.rotation.y=rad(useSnap?Math.round(deg(drag.yaw+dx*.01)/15)*15:deg(drag.yaw+dx*.01));
 }else if(drag.kind==='scale'){const factor=Math.max(.05,1+dx*.01);drag.obj.scale.copy(drag.scale).multiplyScalar(factor);}
 if(performance.now()-refreshAt>75){refreshAt=performance.now();syncHelper();updateNumberFields();}
}
function mouseUp(){if(!active||!drag)return;if(drag.obj){const after=saveState(drag.obj);historyAdd(drag.before,after,drag.obj);if(!drag.obj.userData.feOwned)nativeChanged(drag.obj);syncHelper();renderInspector();}drag=null;}
function scrollCanvas(e){if(!active||e.target!==renderer.domElement)return;e.preventDefault();const forward=new T.Vector3();cam.getWorldDirection(forward);cam.position.addScaledVector(forward,-Math.sign(e.deltaY)*Math.max(.5,Math.abs(e.deltaY)*.03));}
function cameraUpdate(dt){
 if(!active||!cam)return;const move=new T.Vector3(),forward=new T.Vector3(),side=new T.Vector3();cam.getWorldDirection(forward);forward.y=0;forward.normalize();side.crossVectors(forward,new T.Vector3(0,1,0)).normalize();
 if(cameraKeys.has('KeyW')||cameraKeys.has('ArrowUp'))move.add(forward);
 if(cameraKeys.has('KeyS')||cameraKeys.has('ArrowDown'))move.sub(forward);
 if(cameraKeys.has('KeyA')||cameraKeys.has('ArrowLeft'))move.sub(side);
 if(cameraKeys.has('KeyD')||cameraKeys.has('ArrowRight'))move.add(side);
 if(cameraKeys.has('KeyQ'))move.y-=1;if(cameraKeys.has('KeyE'))move.y+=1;
 if(move.lengthSq()){move.normalize().multiplyScalar(dt*(cameraKeys.has('ShiftLeft')||cameraKeys.has('ShiftRight')?32:11));cam.position.add(move);}
}
function onKeyDown(e){
 if((e.altKey&&e.code==='KeyO')&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();toggle();return;}
 if(!active)return;
 const tag=e.target?.tagName;
 if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}
 if((e.ctrlKey||e.metaKey)&&e.code==='KeyS'){e.preventDefault();e.stopImmediatePropagation();quickSave();return;}
 if(/INPUT|TEXTAREA|SELECT/.test(tag)||e.target?.isContentEditable)return;
 if((e.ctrlKey||e.metaKey)&&e.code==='KeyZ'){e.preventDefault();e.stopImmediatePropagation();e.shiftKey?doRedo():doUndo();return;}
 if((e.ctrlKey||e.metaKey)&&e.code==='KeyY'){e.preventDefault();e.stopImmediatePropagation();doRedo();return;}
 if((e.ctrlKey||e.metaKey)&&e.code==='KeyD'){e.preventDefault();e.stopImmediatePropagation();duplicate();return;}
 if(e.code==='Delete'){e.preventDefault();e.stopImmediatePropagation();removeSelected();return;}
 if(e.code==='Digit1'){setTool('select');}if(e.code==='Digit2'){setTool('move');}if(e.code==='Digit3'){setTool('rotate');}if(e.code==='Digit4'){setTool('scale');}
 cameraKeys.add(e.code);if(/^(Key[WASDQE]|Arrow|Shift)/.test(e.code)||e.code.startsWith('Digit')){e.preventDefault();e.stopImmediatePropagation();}
}
function onKeyUp(e){cameraKeys.delete(e.code);if(active&&/^(Key[WASDQE]|Arrow|Shift)/.test(e.code)){e.preventDefault();e.stopImmediatePropagation();}}
function animationKeys(obj){if(!obj)return [];return obj.userData.feKeys||(obj.userData.feKeys=[]);}
function insertKey(){if(!selected){notify('Selecione um objeto para animar');return;}
 const before=saveState(selected),keys=animationKeys(selected);const at=+currentTime.toFixed(2),state=saveState(selected);
 const index=keys.findIndex(k=>Math.abs(k.t-at)<.05);const entry={t:at,p:state.p,r:state.r,s:state.s};
 if(index>=0)keys[index]=entry;else keys.push(entry);keys.sort((a,b)=>a.t-b.t);
 historyAdd(before,saveState(selected));if(!selected.userData.feOwned)nativeChanged(selected);
 updateTimeline();notify('Quadro salvo em '+at.toFixed(2)+'s');
}
function removeKey(){if(!selected)return;const before=saveState(selected),ks=animationKeys(selected);const i=ks.findIndex(k=>Math.abs(k.t-currentTime)<.08);
 if(i<0){notify('Não há quadro neste momento');return;}ks.splice(i,1);historyAdd(before,saveState(selected));updateTimeline();notify('Quadro excluído');
}
function previewAt(t){
 if(!selected?.userData?.feKeys?.length)return;
 const keys=selected.userData.feKeys;
 if(!keys.length)return;
 const a=keys.findLast(k=>k.t<=t)||keys[0],b=keys.find(k=>k.t>=t)||keys[keys.length-1];
 const ratio=a===b?0:clamp((t-a.t)/Math.max(.001,b.t-a.t),0,1);
 const lerp=(p,q)=>p+(q-p)*ratio;
 selected.position.set(...a.p.map((v,i)=>lerp(v,b.p[i])));selected.rotation.set(...a.r.map((v,i)=>lerp(v,b.r[i])));selected.scale.set(...a.s.map((v,i)=>lerp(v,b.s[i])));
 if(helper&&performance.now()-refreshAt>100){helper.update?.();refreshAt=performance.now();}
}
function samplePreset(preset){if(!selected)return;const before=saveState(selected),initial=saveState(selected);duration=Math.max(duration,4);const keys=[];
 const build=(t,modifier)=>{const k={t,p:initial.p.slice(),r:initial.r.slice(),s:initial.s.slice()};modifier?.(k);keys.push(k);};
 build(0);if(preset==='giro'){build(2,k=>k.r[1]+=Math.PI);build(4,k=>k.r[1]+=Math.PI*2);}
 if(preset==='flutuar'){build(1,k=>k.p[1]+=1.4);build(2);build(3,k=>k.p[1]+=1.4);build(4);}
 if(preset==='balancar'){build(1,k=>k.r[2]+=.2);build(2,k=>k.r[2]-=.2);build(3,k=>k.r[2]+=.2);build(4);}
 selected.userData.feKeys=keys;historyAdd(before,saveState(selected));playing=true;currentTime=0;updateTimeline();renderInspector();notify('Animação criada: '+preset);
}
function updateTimeline(){if(!uiReady)return;const r=$('#fe-timeline-range',root);r.max=duration;r.value=currentTime;$('#fe-timeline-seconds',root).textContent=currentTime.toFixed(2)+'s';
 $('#fe-timeline-play',root).textContent=playing?'Pausar':'Reproduzir';
 const n=$('#fe-timeline-keycount',root);n.textContent=(selected?.userData.feKeys?.length||0)+' quadros';
}
function playbackUpdate(dt){if(!playing||!selected?.userData.feKeys?.length)return;currentTime+=dt;
 if(currentTime>duration){if(loopAnim)currentTime%=duration;else{currentTime=duration;playing=false;}}
 previewAt(currentTime);updateTimeline();}
function playImported(obj,index=0){if(!obj?.userData.feAnimations?.length)return;let e=importedMixers.get(obj.uuid);if(!e){e={mixer:new T.AnimationMixer(obj),action:null,index:0};importedMixers.set(obj.uuid,e);}e.mixer.stopAllAction();e.index=clamp(index,0,obj.userData.feAnimations.length-1);e.action=e.mixer.clipAction(obj.userData.feAnimations[e.index]);e.action.play();playing=false;}
function patchMaterial(obj,prop,value){const mesh=findMaterialMesh(obj);if(!mesh)return;const materials=(Array.isArray(mesh.material)?mesh.material:[mesh.material]).filter(Boolean);
 for(const m of materials){if(prop==='color'&&m.color)m.color.set(value);if(prop==='opacity'&&'opacity' in m){m.opacity=clamp(val(value,1),.01,1);m.transparent=m.opacity<.999||m.transparent;}
 if(prop==='wireframe'&&'wireframe' in m)m.wireframe=!!value;m.needsUpdate=true;}
}
function setNumericField(which,idx,value){if(!selected)return;const v=val(value);
 if(which==='pos')selected.position.setComponent(idx,toGrid(v));if(which==='rot'){const arr=['x','y','z'];selected.rotation[arr[idx]]=rad(v);}
 if(which==='scale')selected.scale.setComponent(idx,Math.max(.001,v));
 syncHelper();if(!selected.userData.feOwned)nativeChanged(selected);
}
function updateNumberFields(){if(!selected||!inspector)return;
 for(const [set,arr] of [['pos',selected.position.toArray()],['rot',[deg(selected.rotation.x),deg(selected.rotation.y),deg(selected.rotation.z)]],['scale',selected.scale.toArray()]]){
  $$(`[data-fe-axis="${set}"]`,inspector).forEach((input,i)=>{if(document.activeElement!==input)input.value=nice(arr[i]);});
 }
}
function labelFields(label,prop,values){return `<div class="fe-fields"><span class="fe-axis">${label}</span><label>X</label><label>Y</label><label>Z</label><span class="fe-axis">${prop==='rot'?'°':' '}</span>${values.map((v,i)=>`<input class="fe-input" type="number" step="0.1" data-fe-axis="${prop}" data-fe-i="${i}" value="${nice(v)}"/>`).join('')}</div>`;}
function renderInspector(){if(!uiReady)return;
 if(!selected){inspector.innerHTML='<div class="fe-info">Selecione um objeto no cenário clicando nele, ou crie algo na coluna da esquerda.</div><div class="fe-subtitle">Como usar</div><div class="fe-mini">1. Clique em Árvore, Rocha ou outro objeto.<br>2. Use Mover, Girar ou Escala.<br>3. Ajuste medidas na direita.<br>4. Salve seu projeto para continuar depois.<br><br>Alt + O abre e fecha a Oficina. A sobrevivência não é substituída.</div>';return;}
 const s=saveState(selected),m=s.material,dragon=modelDragon(selected),keys=animationKeys(selected);
 const isNative=!selected.userData.feOwned,isLight=selected.isLight;
 const groupOption=selected.parent&&selected.parent!==scene?'<button class="fe-btn" data-fe-action="parent">Subir para grupo</button>':'';
 let nativeAnim='';
 const importedClips=selected.userData.feAnimations||[];
 if(importedClips.length){const entry=importedMixers.get(selected.uuid);nativeAnim=`<div class="fe-subtitle">Animações do modelo GLB</div><select class="fe-select" id="fe-model-clips">${importedClips.map((c,i)=>`<option value="${i}" ${i===(entry?.index??0)?'selected':''}>${esc(c.name||'Animação '+(i+1))}</option>`).join('')}</select><div class="fe-row"><button class="fe-btn" data-fe-action="modelPlay">Reproduzir</button><button class="fe-btn" data-fe-action="modelPause">Pausar</button></div><div class="fe-row"><label>Velocidade</label><input class="fe-input" data-fe-field="modelSpeed" type="number" min="0.1" max="4" step="0.1" value="${nice(entry?.action?.timeScale||1)}"/></div>`;}
 if(dragon){nativeAnim=`<div class="fe-subtitle">Animações do dragão</div><div class="fe-mini">Reprodução dos clipes originais do modelo.</div><select class="fe-select" id="fe-dragon-clips">${dragon.clips.map((c,i)=>`<option value="${i}" ${i===dragon.index?'selected':''}>${esc(c.name||'Animação '+i)}</option>`).join('')}</select><div class="fe-row"><button class="fe-btn" data-fe-action="dragonPlay">Reproduzir</button><button class="fe-btn" data-fe-action="dragonPause">Pausar</button></div><div class="fe-row"><label>Velocidade</label><input class="fe-input" data-fe-field="dragonSpeed" type="number" min="0.1" max="4" step="0.1" value="${nice(dragon.action?.timeScale||1)}"/></div>`;}
 const bones=[];let modelRoot=selected;modelRoot.traverse(n=>{if(n.isBone&&bones.length<100)bones.push(n);});
 const boneHtml=bones.length?`<div class="fe-subtitle">Pose do esqueleto</div><div class="fe-mini">Pause a animação antes de ajustar os ossos.</div><select class="fe-select" id="fe-bones"><option value="">Escolher osso (${bones.length})</option>${bones.map((bone,i)=>`<option value="${i}">${esc(bone.name||'Osso '+i)}</option>`).join('')}</select><div class="fe-row"><label>Inclinar osso</label><input class="fe-input" id="fe-bone-rot" type="number" step="5" value="0"/></div>`:'';
 inspector.innerHTML=`
 <div class="fe-subtitle">Objeto ${isNative?'<span class="fe-chip">Jogo original</span>':'<span class="fe-chip">Criado na Oficina</span>'}</div>
 <input class="fe-input" data-fe-field="name" value="${esc(s.name||selected.type)}" aria-label="Nome"/>
 <div class="fe-mini" style="margin:7px 0">${esc(selected.type)} · ${selected.children.length} filhos ${selected.userData.feType?'· '+esc(selected.userData.feType):''}</div>
 <div class="fe-subtitle">Posição</div>${labelFields('m','pos',s.p)}
 <div class="fe-subtitle">Rotação</div>${labelFields('°','rot',s.r.map(deg))}
 <div class="fe-subtitle">Tamanho</div>${labelFields('x','scale',s.s)}
 <div class="fe-row"><label>Visível</label><input type="checkbox" data-fe-field="visible" ${s.visible?'checked':''}/></div>
 ${m?`<div class="fe-subtitle">Material</div><div class="fe-row"><label>Cor</label><input class="fe-color" type="color" data-fe-field="color" value="#${m.color||'888888'}"/></div>
 <div class="fe-row"><label>Transparência</label><input class="fe-input" data-fe-field="opacity" type="number" step="0.05" min="0.05" max="1" value="${nice(m.opacity)}"/></div>
 <div class="fe-row"><label>Malha de arame</label><input type="checkbox" data-fe-field="wireframe" ${m.wireframe?'checked':''}/></div>`:''}
 ${isLight?`<div class="fe-row"><label>Intensidade</label><input class="fe-input" data-fe-field="intensity" type="number" min="0" step=".5" value="${nice(selected.intensity)}"/></div>`:''}
 <div class="fe-subtitle">Editar objeto</div><div class="fe-grid"><button class="fe-btn" data-fe-action="duplicate">Duplicar</button><button class="fe-btn" data-fe-action="focus">Focar</button>${groupOption}<button class="fe-btn fe-danger" data-fe-action="delete">${isNative?'Ocultar':'Excluir'}</button></div>
 ${nativeAnim}${boneHtml}
 <div class="fe-subtitle">Animação simples (quadros)</div><div class="fe-mini">${keys.length} quadros salvos. Modifique posição, rotação ou escala e clique em <b>Adicionar quadro</b>.</div>
 <div class="fe-grid" style="margin-top:7px"><button class="fe-btn" data-fe-preset="flutuar">Flutuar</button><button class="fe-btn" data-fe-preset="giro">Girar</button><button class="fe-btn" data-fe-preset="balancar">Balançar</button></div>
 ${isNative?'<div class="fe-info">Objetos originais podem ser movidos ou ocultados, mas isso não reprograma colisões, inimigos ou salvamentos internos.</div>':''}`;
}
function focusSelection(){if(!selected)return;
 const bounds=new T.Box3().setFromObject(selected),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3()),dist=clamp(size.length()*1.3,4,110);
 cam.position.copy(center).add(new T.Vector3(dist*.8,dist*.55,dist));cam.lookAt(center);
}
function refreshHierarchy(){if(!uiReady)return;
 const search=$('#fe-search',root)?.value?.trim().toLowerCase()||'';
 const items=[];
 for(const obj of owned.values())if(obj.parent&&(!search||obj.name.toLowerCase().includes(search)))items.push(obj);
 let examined=0;const max=search?10000:700;
 scene.traverse(obj=>{
  if(examined++>max||obj===scene||obj.userData.feOwned||obj.userData.feHelper||isInsideOwned(obj))return;
  if(search){if(!String(obj.name||'').toLowerCase().includes(search))return;}
  else if(obj.parent!==scene)return;
  if(obj.isMesh||obj.isGroup||obj.isLight||obj.type==='Object3D')items.push(obj);
 });
 const limit=search?160:110;const unique=[...new Set(items)].slice(0,limit);
 hierarchy.innerHTML=unique.map(o=>`<button class="fe-list-btn ${o===selected?'sel':''}" data-fe-id="${esc(o.uuid)}" title="${esc(o.name||o.type)}">${o.userData.feOwned?'+ ':''}${esc(o.name||o.type)} <small>${o.type}</small></button>`).join('')||'<div class="fe-mini">Nenhum objeto. Experimente outro termo.</div>';
 const n=$('#fe-obj-count',root);if(n)n.textContent=`${unique.length}${items.length>limit?'+':''} objetos`;
}
function isInsideOwned(obj){let p=obj.parent;while(p&&p!==scene){if(p.userData.feOwned)return true;p=p.parent;}return false;}
function project(){
 const outputs=[];
 for(const obj of owned.values()){
  if(!obj.parent)continue;
  const d={id:obj.userData.feId,type:obj.userData.feType,name:obj.name,state:saveState(obj)};
  if(obj.userData.feSource){d.source=obj.userData.feSource;if(imported.has(d.source))d.glb=imported.get(d.source);}
  if(d.type==='clone'&&obj.userData.feSourcePath)d.sourcePath=obj.userData.feSourcePath;
  outputs.push(d);
 }
 return {format:'FLORESTA_OFICINA',version:2,floresta:VERSION,date:new Date().toISOString(),duration,loop:loopAnim,objects:outputs,patches:[...changes.entries()].map(([path,obj])=>({path,hint:obj.hint,state:obj.state}))};
}
function downloadJSON(){
 const data=JSON.stringify(project(),null,2),blob=new Blob([data],{type:'application/json'}),url=URL.createObjectURL(blob),a=document.createElement('a');
 a.href=url;a.download='Floresta_Projeto_Oficina_V210.json';document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);notify('Projeto JSON exportado. Guarde este arquivo!');
}
function quickSave(){try{
 const p=project();for(const o of p.objects)delete o.glb;
 localStorage.setItem(STORAGE,JSON.stringify(p));hasProject=false;$('#fe-save-state',root).textContent='Salvo neste navegador';notify('Projeto salvo no navegador. Use Exportar para ter uma cópia portátil.');
 }catch(err){notify('Sem espaço no armazenamento. Use Exportar JSON.');console.warn(err);}}
function removeOwned(){for(const o of owned.values())o.removeFromParent();owned.clear();choose(null);}
async function loadProject(data){
 if(data?.format!=='FLORESTA_OFICINA'||!Array.isArray(data.objects))throw Error('O arquivo não é um projeto da Oficina Floresta.');
 removeOwned();changes.clear();undo.length=0;redo.length=0;
 duration=clamp(val(data.duration,4),1,90);loopAnim=data.loop!==false;currentTime=0;playing=false;
 let restored=0,skipped=0;
 for(const spec of data.objects){
  try{
   let obj=null;
   if(spec.type==='model'){
    const raw=spec.glb||imported.get(spec.source||'');
    if(raw){obj=await parseGLB(raw);if(spec.source)imported.set(spec.source,raw);}
   }else if(spec.type==='clone'&&spec.sourcePath){const origin=getPath(spec.sourcePath);if(origin)obj=origin.clone(true);}
   else if(['tree','rock','box','wall','floor','ball','pillar','light','camp','bush','path'].includes(spec.type))obj=buildObject(spec.type,spec);
   if(!obj){skipped++;continue;}
   obj.userData.feOwned=true;obj.userData.feId=spec.id||uid();obj.userData.feType=spec.type;
   if(spec.source)obj.userData.feSource=spec.source;
   if(spec.sourcePath)obj.userData.feSourcePath=spec.sourcePath;
   scene.add(obj);owned.set(obj.userData.feId,obj);restoreState(obj,spec.state);restored++;
  }catch(err){console.warn('[OFICINA] failed to restore',spec,err);skipped++;}
 }
 for(const p of (data.patches||[])){
  const obj=getPath(p.path);if(!obj||obj.userData.feOwned){skipped++;continue;}
  if(p.hint&&obj.name!==p.hint){skipped++;continue;}obj.userData.feOriginalName=p.hint;
  restoreState(obj,p.state);changes.set(p.path,{hint:p.hint||obj.name,state:saveState(obj)});restored++;
 }
 undo.length=0;redo.length=0;hasProject=false;$('#fe-save-state',root).textContent='Projeto carregado';refreshHierarchy();renderInspector();updateTimeline();
 notify('Projeto carregado: '+restored+' alterações'+(skipped?' · '+skipped+' itens não restaurados':'')+'.');
}
async function parseGLB(src){
 const ctor=window.__FOREST_GLTF_LOADER||window.__EXTRA_SPIDER_GLTF_LOADER;
 if(!ctor)throw Error('Carregador GLB ainda não disponível.');
 const raw=src.split(',')[1]||src;const bin=atob(raw),buffer=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)buffer[i]=bin.charCodeAt(i);
 const loader=new ctor();
 const gltf=await new Promise((resolve,reject)=>loader.parse(buffer.buffer,'',resolve,reject));
 const gObj=new T.Group();gObj.name='Modelo GLB';gObj.userData.feType='model';gObj.userData.feAnimations=gltf.animations||[];
 gObj.add(gltf.scene);return gObj;
}
async function importGLB(file){
 if(!/\.(glb)$/i.test(file.name)){notify('Use um modelo .glb com texturas embutidas.');return;}
 try{
  notify('Lendo modelo GLB…');const raw=await new Promise((res,rej)=>{const reader=new FileReader();reader.onload=()=>res(reader.result);reader.onerror=rej;reader.readAsDataURL(file);});
  const obj=await parseGLB(raw);obj.userData.feOwned=true;obj.userData.feId=uid();obj.userData.feType='model';obj.userData.feSource=file.name;obj.name=file.name;obj.position.copy(placeNearPlayer());scene.add(obj);
  imported.set(file.name,raw);owned.set(obj.userData.feId,obj);choose(obj);markChanged();notify('Modelo importado. Exporte JSON para manter o GLB junto.');
 }catch(err){console.error('[OFICINA] GLB',err);notify('Não foi possível importar o GLB: '+err.message);}
}
function actions(e){const b=e.target.closest('button');if(!b)return;
 if(b.dataset.feTool){setTool(b.dataset.feTool);return;}
 if(b.dataset.feCreate){create(b.dataset.feCreate);return;}
 if(b.dataset.feBrush){brushType=b.dataset.feBrush;setTool('paint');$$('[data-fe-brush]',root).forEach(el=>el.classList.toggle('active',el.dataset.feBrush===brushType));notify('Pincel de mundo ativo: '+brushType);return;}
 if(b.dataset.fePreset){samplePreset(b.dataset.fePreset);return;}
 const a=b.dataset.feAction;
 if(a==='close')close();if(a==='undo')doUndo();if(a==='redo')doRedo();
 if(a==='save')quickSave();if(a==='export')downloadJSON();if(a==='import'){$('#fe-file',root).accept='.json,application/json';$('#fe-file',root).click();}
 if(a==='glb'){$('#fe-file',root).accept='.glb,model/gltf-binary';$('#fe-file',root).click();}
 if(a==='duplicate')duplicate();if(a==='delete')removeSelected();if(a==='focus')focusSelection();
 if(a==='parent'&&selected?.parent!==scene)choose(selected.parent);
 if(a==='key')insertKey();if(a==='deleteKey')removeKey();
 if(a==='play'){playing=!playing;updateTimeline();}
 if(a==='resetTime'){currentTime=0;playing=false;previewAt(currentTime);updateTimeline();}
 if(a==='dragonPlay'){const dragon=modelDragon(selected);if(dragon)window.gameDragonLab.play(dragon,dragon.index<0?0:dragon.index);}
 if(a==='dragonPause'){const dragon=modelDragon(selected);if(dragon?.action)dragon.action.paused=!dragon.action.paused;}
 if(a==='modelPlay'){if(selected)playImported(selected,importedMixers.get(selected.uuid)?.index||0);}
 if(a==='modelPause'){const e=selected&&importedMixers.get(selected.uuid);if(e?.action)e.action.paused=!e.action.paused;}
 if(a==='mobileSide')root.classList.toggle('fe-inspector-mobile');
}
let editBefore=null;
function fieldsChanged(e,commit){if(!selected)return;
 const input=e.target,prop=input.dataset.feField,axis=input.dataset.feAxis;
 if(!prop&&!axis)return;
 if(!editBefore)editBefore=saveState(selected);
 if(axis)setNumericField(axis,+input.dataset.feI,input.value);
 if(prop==='name'){if(!selected.userData.feOwned&&selected.userData.feOriginalName===undefined)selected.userData.feOriginalName=editBefore?.name??selected.name;selected.name=input.value.slice(0,90);}
 if(prop==='visible')selected.visible=input.checked;
 if(['color','opacity','wireframe'].includes(prop))patchMaterial(selected,prop,prop==='wireframe'?input.checked:input.value);
 if(prop==='intensity'&&selected.isLight)selected.intensity=clamp(val(input.value,1),0,500);
 if(prop==='dragonSpeed'){const dragon=modelDragon(selected);if(dragon?.action)dragon.action.timeScale=clamp(val(input.value,1),.1,4);}
 if(prop==='modelSpeed'){const e=importedMixers.get(selected.uuid);if(e?.action)e.action.timeScale=clamp(val(input.value,1),.1,4);}
 if(commit){historyAdd(editBefore,saveState(selected));if(!selected.userData.feOwned)nativeChanged(selected);editBefore=null;syncHelper();refreshHierarchy();}
}
function fileChanged(e){const file=e.target.files?.[0];if(!file)return;
 if(file.name.toLowerCase().endsWith('.glb'))importGLB(file);
 else{file.text().then(s=>loadProject(JSON.parse(s))).catch(err=>{notify('Erro ao importar: '+err.message);console.error(err);});}
 e.target.value='';
}
function initializeUI(){
 if(uiReady)return;uiReady=true;
 const button=document.createElement('button');button.id='fe210-toggle';button.type='button';button.innerHTML='OFICINA · EDITOR <kbd>Alt+O</kbd>';document.body.appendChild(button);button.addEventListener('click',open);
 root=document.createElement('div');root.id='fe210-root';root.innerHTML=`
 <header class="fe-bar fe-hit"><div class="fe-brand"><b>FLORESTA · OFICINA</b><small>EDITOR VISUAL ${VERSION}</small></div>
 <button class="fe-btn active" data-fe-tool="select">1 · Selecionar</button><button class="fe-btn" data-fe-tool="move">2 · Mover</button><button class="fe-btn" data-fe-tool="rotate">3 · Girar</button><button class="fe-btn" data-fe-tool="scale">4 · Escala</button><div class="fe-divider"></div>
 <button class="fe-btn" data-fe-action="undo" title="Ctrl+Z">Desfazer</button><button class="fe-btn" data-fe-action="redo">Refazer</button><div class="fe-spacer"></div>
 <button class="fe-btn" data-fe-action="save">Salvar</button><button class="fe-btn" data-fe-action="import">Abrir</button><button class="fe-btn fe-primary" data-fe-action="export">Exportar JSON</button><button class="fe-btn" data-fe-action="mobileSide">Painéis</button><button class="fe-btn fe-danger" data-fe-action="close">Sair</button></header>
 <div class="fe-tip">${TOOL_TEXT.select} · Botão direito: olhar · Roda: zoom · WASD: câmera</div>
 <aside class="fe-pane fe-left"><div class="fe-pane-header">CRIAR NO MUNDO</div><div class="fe-scroll">
 <div class="fe-grid"><button class="fe-create" data-fe-create="tree">Árvore</button><button class="fe-create" data-fe-create="rock">Rocha</button><button class="fe-create" data-fe-create="wall">Parede</button><button class="fe-create" data-fe-create="floor">Piso</button><button class="fe-create" data-fe-create="pillar">Pilar</button><button class="fe-create" data-fe-create="box">Bloco</button><button class="fe-create" data-fe-create="ball">Esfera</button><button class="fe-create" data-fe-create="camp">Fogueira</button><button class="fe-create" data-fe-create="light">Luz</button><button class="fe-create" data-fe-create="bush">Arbusto</button><button class="fe-create" data-fe-create="path">Solo de terra</button><button class="fe-create" data-fe-action="glb">Importar GLB</button></div>
 <div class="fe-subtitle">Pintar o mundo com um clique</div><div class="fe-grid"><button class="fe-btn" data-fe-brush="tree">Pintar árvores</button><button class="fe-btn" data-fe-brush="rock">Pintar rochas</button><button class="fe-btn" data-fe-brush="bush">Pintar arbustos</button><button class="fe-btn" data-fe-brush="path">Pintar terra</button></div><div class="fe-row"><label>Por pincelada</label><select id="fe-brush-density" class="fe-select"><option value="1">1 objeto</option><option value="2">2 objetos</option><option value="3">3 objetos</option><option value="5">5 objetos</option></select></div><div class="fe-subtitle">Ferramenta de encaixe</div><div class="fe-row"><label><input id="fe-snap" type="checkbox" checked/> Encaixar</label><select id="fe-snap-size" class="fe-select"><option value="0.1">0,1 m</option><option value="0.5" selected>0,5 m</option><option value="1">1 m</option><option value="2">2 m</option><option value="4">4 m</option></select></div>
 <div class="fe-subtitle">Objetos da cena <small id="fe-obj-count">...</small></div><input class="fe-search" id="fe-search" placeholder="Buscar árvore, dragão, parede..."/><div class="fe-list" id="fe-hierarchy"></div>
 <div class="fe-info fe-mini">Objetos novos são editáveis. Os objetos originais mantêm seus sistemas de jogabilidade.</div></div></aside>
 <aside class="fe-pane fe-right"><div class="fe-pane-header">PROPRIEDADES</div><div class="fe-scroll" id="fe-inspector"></div></aside>
 <section class="fe-timeline fe-hit"><div class="fe-timeline-header"><strong>ANIMAÇÃO</strong><button class="fe-btn" data-fe-action="play" id="fe-timeline-play">Reproduzir</button><button class="fe-btn" data-fe-action="resetTime">Início</button><button class="fe-btn" data-fe-action="key">+ Quadro</button><button class="fe-btn" data-fe-action="deleteKey">Remover quadro</button><span class="fe-spacer"></span><small id="fe-timeline-keycount">0 quadros</small></div><div class="fe-time-row"><input type="range" id="fe-timeline-range" min="0" max="4" step="0.01" value="0"/><span class="fe-time-mark" id="fe-timeline-seconds">0.00s</span><label title="Duração da animação">Duração: <input type="number" id="fe-duration" min="1" max="90" step="1" value="4" style="width:45px;color:#ddd;background:#1e2a22;border:1px solid #59624b;border-radius:5px"></label></div></section>
 <div class="fe-toast"></div><div class="fe-hidden"><input type="file" id="fe-file" accept=".json,.glb"/></div><div class="fe-hidden" id="fe-save-state">Ainda não salvo</div>`;
 document.body.appendChild(root);inspector=$('#fe-inspector',root);hierarchy=$('#fe-hierarchy',root);
 root.addEventListener('click',actions);
 root.addEventListener('input',e=>{if(e.target.closest('#fe-inspector'))fieldsChanged(e,false);});
 root.addEventListener('change',e=>{if(e.target.closest('#fe-inspector'))fieldsChanged(e,true);});
 hierarchy.addEventListener('click',e=>{const b=e.target.closest('[data-fe-id]');if(!b)return;let found=null;scene.traverse(o=>{if(o.uuid===b.dataset.feId)found=o;});choose(found);});
 $('#fe-search',root).addEventListener('input',()=>refreshHierarchy());
 $('#fe-file',root).addEventListener('change',fileChanged);
 $('#fe-snap',root).addEventListener('change',e=>{useSnap=e.target.checked;});
 $('#fe-snap-size',root).addEventListener('change',e=>{snap=val(e.target.value,.5);});
 $('#fe-timeline-range',root).addEventListener('input',e=>{currentTime=val(e.target.value);playing=false;previewAt(currentTime);updateTimeline();updateNumberFields();});
 $('#fe-duration',root).addEventListener('change',e=>{duration=clamp(val(e.target.value,4),1,90);updateTimeline();markChanged();});
 inspector.addEventListener('change',e=>{
  if(e.target.id==='fe-dragon-clips'){const d=modelDragon(selected);if(d)window.gameDragonLab.play(d,+e.target.value);}
  if(e.target.id==='fe-model-clips')playImported(selected,+e.target.value);
  if(e.target.id==='fe-bones'){const bones=[];selected?.traverse(n=>{if(n.isBone&&bones.length<100)bones.push(n);});const bone=bones[+e.target.value];if(bone){$('#fe-bone-rot',inspector).value=nice(deg(bone.rotation.z));}}
  if(e.target.id==='fe-bone-rot'){const boneIndex=+$('#fe-bones',inspector)?.value;const bones=[];selected?.traverse(n=>{if(n.isBone&&bones.length<100)bones.push(n);});if(bones[boneIndex])bones[boneIndex].rotation.z=rad(val(e.target.value));}
 });
 renderInspector();refreshHierarchy();updateTimeline();
}
function hideExternalPanels(){
 // Somente quando o editor estiver aberto. Não desativa os modos do jogo.
 for(const el of document.querySelectorAll('[id$="Overlay"],[id*="modal"],[id*="Modal"]')){
  if(el.closest('#fe210-root'))continue;
  // Nada é removido; as telas originais podem ser reabertas após sair.
 }
}
function open(){
 if(active)return;
 if(!g){notify('O jogo ainda está iniciando');return;}
 initializeUI();if(document.pointerLockElement)document.exitPointerLock?.();
 const gameCam=g.camera;
 cam=gameCam.clone();cam.position.copy(gameCam.getWorldPosition(new T.Vector3()));cam.quaternion.copy(gameCam.getWorldQuaternion(new T.Quaternion()));cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix();
 if(!cam.position.lengthSq()){const p=placeNearPlayer(12);cam.position.copy(p).add(new T.Vector3(0,5,8));cam.lookAt(p);}
 cameraKeys.clear();g.keys?.clear?.();if(g.stick){g.stick.x=0;g.stick.y=0;}active=true;document.body.classList.add('fe210-editing');root.classList.add('fe-visible');
 scene.add(cameraTarget);window.gameOficinaV210.active=true;
 refreshHierarchy();renderInspector();updateTimeline();notify('Oficina aberta. A cena original continua intacta.');
}
function close(){if(!active)return;mouseUp();active=false;playing=false;drag=null;cameraKeys.clear();boxHelperClear();root?.classList.remove('fe-visible');document.body.classList.remove('fe210-editing');cameraTarget?.removeFromParent();window.gameOficinaV210.active=false;}
function toggle(){active?close():open();}
function installEvents(){
 document.addEventListener('contextmenu',e=>{if(active&&e.target===renderer.domElement)e.preventDefault();},true);
 window.addEventListener('keydown',onKeyDown,true);window.addEventListener('keyup',onKeyUp,true);
 window.addEventListener('blur',()=>cameraKeys.clear());
 document.addEventListener('pointerdown',e=>{if(active&&e.target===renderer.domElement){mouseDown(e);e.stopImmediatePropagation();}},true);
 document.addEventListener('pointermove',e=>{if(active&&drag){mouseMove(e);e.stopImmediatePropagation();}},true);
 document.addEventListener('pointerup',e=>{if(active&&drag){mouseUp();e.stopImmediatePropagation();}},true);
 document.addEventListener('wheel',e=>{if(active&&e.target===renderer.domElement){scrollCanvas(e);e.stopImmediatePropagation();}},{passive:false,capture:true});
}
function tick(t){requestAnimationFrame(tick);const dt=clamp((t-lastFrame)/1000,0,.08);lastFrame=t;for(const e of importedMixers.values())e.mixer.update(dt);if(!active)return;g.keys?.clear?.();if(g.stick){g.stick.x=0;g.stick.y=0;}cameraUpdate(dt);playbackUpdate(dt);}
function attach(){
 T=window.__THREE_MODULE||window.THREE;g=window.gameReview;
 if(!T||!g?.scene||!g?.camera||!g?.renderer?.render||!g?.renderer.domElement)return false;
 scene=g.scene;renderer=g.renderer;raycaster=new T.Raycaster();v2=new T.Vector2();groundPlane=new T.Plane(new T.Vector3(0,1,0),0);cameraTarget=new T.Object3D();cameraTarget.userData.feHelper=true;
 originalRender=renderer.render;
 renderer.render=function(renderScene,renderCam,...rest){
  if(active&&renderScene===scene&&cam){return originalRender.call(this,renderScene,cam,...rest);}
  return originalRender.call(this,renderScene,renderCam,...rest);
 };
 installEvents();initializeUI();requestAnimationFrame(tick);
 window.gameOficinaV210={active:false,open,close,toggle,create,choose,export:downloadJSON,save:quickSave,load:loadProject,get selected(){return selected;},get scene(){return scene;},version:VERSION};
 try{const saved=localStorage.getItem(STORAGE);if(saved){notify('Um projeto salvo está disponível: abra a Oficina e use Carregar salvo.'); const loadButton=document.createElement('button');loadButton.className='fe-btn';loadButton.textContent='Carregar salvo';loadButton.id='fe-load-local';loadButton.addEventListener('click',()=>{try{loadProject(JSON.parse(localStorage.getItem(STORAGE)));}catch(err){notify(err.message);}});$('.fe-bar',root).insertBefore(loadButton,$('[data-fe-action="export"]',root));}}
 catch(err){console.warn('[OFICINA] Sem armazenamento local',err);}
 console.info('[Floresta OFICINA] Editor visual '+VERSION+' ativo — Alt+O.');return true;
}
let tries=0;
function wait(){if(attach())return;if(++tries<1200){setTimeout(wait,100);}else console.warn('[Floresta OFICINA] Jogo não ficou pronto após 60 segundos.');}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',wait,{once:true});else wait();
})();
