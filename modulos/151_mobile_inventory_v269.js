/* FLORESTA V269: native inventory arranged as the approved mobile RPG reference. */
(()=>{'use strict';
 if(window.__CAVE_PLATFORM!=='mobile'||window.FlorestaInventory269)return;
 const d=document,$=id=>d.getElementById(id),root=d.documentElement;
 root.classList.add('v269-mobile','v270-mobile');const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-inventory-v269.css?v=275';d.head.append(css);
 const icon=p=>`<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;
 const icons={all:icon('<rect x="4" y="4" width="9" height="9"/><rect x="19" y="4" width="9" height="9"/><rect x="4" y="19" width="9" height="9"/><rect x="19" y="19" width="9" height="9"/>'),weapons:icon('<path d="m4 28 8-8m-4-4 8 8M12 16 25 3l4 4-13 13M4 3l25 25M3 8l5-5m16 21 4-4"/>'),resources:icon('<path d="m4 13 20-9 5 5-20 9zM4 19l20-9 5 5-20 9zM4 25l20-9 5 5-20 9z"/>'),potions:icon('<path d="M12 3h8v5h-8zM13 8v5L6 24q-3 6 10 6t10-6L19 13V8"/>'),armor:icon('<path d="m10 3 6 4 6-4 8 8-6 6-3-4 2 16H9l2-16-3 4-6-6 8-8Z"/>'),head:icon('<path d="M6 28V17C6 0 26 0 26 17v11L16 22 6 28Z"/><path d="M11 14c0-7 10-7 10 0v7H11v-7Z"/>'),shield:icon('<path d="m5 6 11-3 11 3v11c0 7-11 13-11 13S5 24 5 17V6Z"/>'),hand:icon('<path d="m6 28 17-24M16 7l9-4 5 7-6 7-11-4"/>')};
 let mounted=false,filter='all',drag=null,ghost=null,preview=null,lastLook='',lastPreview='',lastOpen=false,selection=null;
 const grid=$('inventoryGrid'),panel=d.querySelector('#inventoryOverlay .inventory-panel');if(!grid||!panel)return;
 const status=d.createElement('div');status.id='v269Status';status.setAttribute('role','status');
 function notify(t){status.textContent=t;}
 function category(item){if(item.id.startsWith('alq_potion_'))return 'potions';return /^(axe|hammer|spear|pickaxe|wood_shield|armor|wood_chip|torch|forged_)/.test(item.id)?'weapons':'resources'}
 function selected(){const list=window.gameInventory?.items||[],index=[...grid.children].findIndex(b=>b.classList.contains('selected'));return list[index]||list.find(i=>i.id===selection)||null}
 function art(id){return window.florestaV183Art?.items?.[id]||({'forged_shadow_axe':'assets/ferraria-v228/forged_shadow_axe.png','forged_silver_sword':'assets/ferraria-v228/forged_silver_sword.png','forged_silver_spear':'assets/ferraria-v228/forged_silver_spear.png','forged_silver_shield':'assets/ferraria-v228/forged_silver_shield.png'})[id]||''}
 function equipped(){return {right:window.gameForgedEquipmentV230?.right||window.gameRightHand?.current||null,left:window.gameForgedEquipmentV230?.left||(window.gameShield?.equipped?'wood_shield':window.gamePotionSlot220?.equipped||(window.gameReview?.isEquipped?.()?'torch':window.gameBranchHands?.side==='left'?'branch':null)),armor:window.gamePrimitive?.armorEquipped?'armor':null}}
 function selectId(id){const i=window.gameInventory?.items.findIndex(x=>x.id===id);if(i>=0)grid.children[i]?.click()}
 function mount(){
  if(mounted)return;mounted=true;
  const title=$('inventoryTitle'),bag=d.createElement('span');bag.id='v269BagIcon';const src=window.florestaV183Art?.ui?.bag;bag.innerHTML=src?'<img alt="" draggable="false">':icon('<path d="M8 10h16l3 19H5l3-19ZM11 10V7a5 5 0 0 1 10 0v3M10 19h12v7H10z"/>');if(src)bag.firstChild.src=src;title.prepend(bag);
  const actions=panel.querySelector('.inventory-header-actions');
  const equipmentToggle=d.createElement('button');equipmentToggle.id='v270EquipmentToggle';equipmentToggle.type='button';equipmentToggle.innerHTML=icons.armor+'<span>Personagem</span>';equipmentToggle.setAttribute('aria-controls','v269Equipment');equipmentToggle.setAttribute('aria-label','Ver personagem e equipamentos');equipmentToggle.setAttribute('aria-expanded','false');actions.insertBefore(equipmentToggle,$('inventoryClose'));equipmentToggle.addEventListener('click',()=>setEquipment(root.dataset.inventoryEquipment!=='open'));
  const navToggle=d.createElement('button');navToggle.id='v270NavToggle';navToggle.type='button';navToggle.innerHTML='<span>☰</span>';navToggle.setAttribute('aria-label','Abrir outras telas');navToggle.setAttribute('aria-expanded','false');actions.insertBefore(navToggle,$('inventoryClose'));navToggle.addEventListener('click',()=>{const open=root.dataset.inventoryNav!=='open';closePanels();root.dataset.inventoryNav=open?'open':'closed';navToggle.setAttribute('aria-expanded',String(open));});
  const body=panel.querySelector('.inventory-body'),left=panel.querySelector('.inventory-left'),details=panel.querySelector('.inventory-details');
  const equipment=d.createElement('aside');equipment.id='v269Equipment';equipment.innerHTML='<h3>EQUIPAMENTO</h3><div id="v269Avatar"><div id="v269AvatarStage"><span>Preparando personagem…</span></div></div><div id="v269EquipmentStats"><div><span>Vida</span><i><b id="v269LifeFill"></b></i><small id="v269LifeValue"></small></div><div><span>EXP</span><i><b id="v269XpFill"></b></i><small id="v269XpValue"></small></div></div>';
  body.prepend(equipment);const equipmentClose=d.createElement('button');equipmentClose.id='v270EquipmentClose';equipmentClose.type='button';equipmentClose.textContent='×';equipmentClose.setAttribute('aria-label','Fechar personagem');equipment.querySelector('h3').append(equipmentClose);equipmentClose.addEventListener('click',closePanels);
  const shade=d.createElement('button');shade.id='v270Shade';shade.type='button';shade.setAttribute('aria-label','Fechar painel');body.append(shade);shade.addEventListener('click',closePanels);
  const detailsClose=d.createElement('button');detailsClose.id='v270DetailsClose';detailsClose.type='button';detailsClose.textContent='‹ Voltar à mochila';details.prepend(detailsClose);detailsClose.addEventListener('click',closePanels);

  for(const [key,label] of [['head','Cabeça'],['armor','Armadura'],['right','Mão direita'],['left','Mão esquerda']]){const b=d.createElement('button');b.type='button';b.id='v269Gear-'+key;b.className='v269-gear';b.dataset.gear=key;b.setAttribute('aria-label',label);b.innerHTML=icons[key==='right'?'hand':key==='left'?'shield':key];$('v269Avatar').append(b);b.addEventListener('click',()=>{const id=equipped()[key];if(id)selectId(id)});}
  const filters=d.createElement('nav');filters.id='v269Filters';filters.setAttribute('aria-label','Filtrar itens');
  for(const [key,label] of [['all','Todos'],['weapons','Armas'],['resources','Recursos'],['potions','Poções']]){const b=d.createElement('button');b.type='button';b.dataset.filter=key;b.innerHTML=icons[key]+`<span>${label}</span>`;b.setAttribute('aria-pressed',String(key===filter));filters.append(b);b.addEventListener('click',()=>{filter=key;closePanels();applyFilter();notify('');});}left.prepend(filters);const empty=d.createElement('p');empty.id='v270Empty';empty.hidden=true;left.append(empty);
  const weight=$('inventoryWeight');if(weight)panel.querySelector('.inventory-header-actions').prepend(weight);
  const track=d.createElement('span');track.id='v269WeightTrack';track.innerHTML='<i></i>';weight?.after(track);
  const footer=d.createElement('section');footer.id='v269Quick';footer.setAttribute('aria-label','Organizar acesso rápido');footer.innerHTML='<header><strong>ACESSO RÁPIDO</strong><span>Toque no item e depois no espaço</span></header>';
  body.append(footer);const editor=$('v256Editor');if(editor){footer.append(editor);editor.hidden=false;const clear=editor.querySelector('[data-action=clear]');if(clear){clear.textContent='Limpar';clear.setAttribute('aria-label','Limpar espaço selecionado');}}
  const drop=d.createElement('button');drop.id='v269Drop';drop.type='button';drop.textContent='Soltar 1';details.append(drop);drop.addEventListener('click',dropItem);
  const split=d.createElement('button');split.id='v269Split';split.type='button';split.textContent='Dividir';split.disabled=true;split.title='O inventário guarda uma pilha por tipo de item.';details.append(split);
  const durability=d.createElement('div');durability.id='v269Durability';durability.hidden=true;durability.innerHTML='<span>Durabilidade da armadura</span><i><b></b></i><small></small>';$('inventoryEquip').before(durability);
  const description=d.createElement('details');description.id='v269Description';description.innerHTML='<summary>Descrição do item</summary>';description.append($('inventoryDescription'));details.append(description,status);const close=$('inventoryClose');close.setAttribute('aria-label','Fechar inventário');
 }
 function applyFilter(){const items=window.gameInventory?.items||[];for(const [i,b]of [...grid.children].entries()){const item=items[i];b.dataset.item269=item?.id||'';b.dataset.category269=item?category(item):'empty';b.hidden=filter==='all'?(!item&&i>=Math.max(8,Math.ceil(items.length/8)*8)):(!item||category(item)!==filter);b.classList.toggle('v269-filtered',b.hidden);b.draggable=false;}
  for(const b of $('v269Filters')?.children||[]){b.classList.toggle('active',b.dataset.filter===filter);b.setAttribute('aria-pressed',String(b.dataset.filter===filter));}
  root.dataset.inventoryFilter=filter;const visibleItems=items.filter(i=>filter==='all'||category(i)===filter).length;const empty=$('v270Empty');if(empty){empty.hidden=visibleItems>0;empty.textContent=filter==='potions'?'Você ainda não tem poções.':'Nenhum item nesta categoria.';}
 }
 function dropItem(){
  const item=selected(),collect=window.gameCollectibles,g=window.gameReview;if(!item||!collect?.spawnInventoryDrop||!g?.player)return;
  const eq=equipped();if(item.quantity===1&&[eq.right,eq.left,eq.armor].includes(item.id)){
   const forged=window.gameForgedEquipmentV230;if(forged?.isEquipped?.(item.id))forged.unequip(item.id);
   else if(item.id==='armor')window.gamePrimitive?.equipArmor?.();
   else if(item.id==='wood_shield')window.gameShield?.unequip?.();
   else if(item.id.startsWith('alq_potion_'))window.gamePotionSlot220?.unequip?.();
   else if(item.id==='branch')window.gameBranchHands?.unequip?.();
   else if(item.id==='wood_chip')window.gameShieldCraft?.unequipChip?.();
   else window.gameRightHand?.unequip?.();
   const after=equipped();if([after.right,after.left,after.armor].includes(item.id)){notify('Conclua a ação atual antes de soltar o equipamento.');return;}
  }

  const {x,z,yaw=0}=g.player,target={x:x-Math.sin(yaw)*1.6,z:z-Math.cos(yaw)*1.6};
  const dropped=collect.spawnInventoryDrop({...item,quantity:1},target.x,target.z,art(item.id));if(!dropped){notify('Não foi possível soltar este item.');return;}
  if(!window.gameInventory.removeItem(item.id,1)){dropped.removeFromParent();notify('O item já não está na mochila.');return;}
  notify(item.name+' deixado no chão. Feche a mochila para recolher.');sync();
 }
 function update(){
  applyFilter();const item=selected();selection=item?.id||null;
  const weight=(window.gameInventory?.items||[]).reduce((s,i)=>s+(Number(i.weight)||0)*(Number(i.quantity)||0),0);$('v269WeightTrack').firstChild.style.width=Math.min(100,weight/25*100)+'%';
  const eq=equipped();for(const [key,label]of [['head','Cabeça'],['armor','Armadura'],['right','Mão direita'],['left','Mão esquerda']]){const b=$('v269Gear-'+key),id=eq[key]||null;if(b.dataset.id!==String(id)){b.dataset.id=String(id);const src=id&&art(id);b.innerHTML=src?'<img alt="" draggable="false">':icons[key==='right'?'hand':key==='left'?'shield':key];if(src)b.firstChild.src=src;b.classList.toggle('equipped',!!id);b.setAttribute('aria-label',label+': '+(id?window.gameInventory.items.find(i=>i.id===id)?.name||id:'vazio'));b.disabled=!id;}}
  const hp=window.gameZombie?.playerHp||0,max=window.gameZombie?.maxPlayerHp||100,prog=window.gameProgression;
  $('v269LifeFill').style.width=hp/max*100+'%';$('v269LifeValue').textContent=Math.ceil(hp)+' / '+max;
  const xp=prog?.state.xp||0,need=prog?.xpRequired?.()||100;$('v269XpFill').style.width=Math.min(100,xp/need*100)+'%';$('v269XpValue').textContent=xp+' / '+need;
  $('v269Drop').disabled=!item||!window.gameCollectibles?.spawnInventoryDrop||item.id==='torch';
  const dur=$('v269Durability');dur.hidden=!(item?.id==='armor'&&window.gamePrimitive?.armorEquipped);if(!dur.hidden){const n=window.gamePrimitive.armorDurability||0,m=window.gamePrimitive.armorMaxDurability||100;dur.querySelector('b').style.width=n/m*100+'%';dur.querySelector('small').textContent=Math.ceil(n)+' / '+m;}
  const state=JSON.stringify(eq)+'|'+JSON.stringify(window.gameCharacterV263?.get?.());if(state!==lastPreview){lastPreview=state;renderPreview();}
 }
 // Bake a snapshot of the actual skinned avatar into a small independent preview.
 // The gameplay skeleton, camera, meshes and shared textures remain untouched.
 function renderPreview(){
  if(root.dataset.inventoryEquipment!=='open')return;
  const T=window.__THREE_MODULE,tfp=window.gameReview?.trueFirstPerson,stage=$('v269AvatarStage');if(!T||!tfp?.fullMesh)return;
  try{
   if(!preview){const renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});renderer.setPixelRatio(1);renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;stage.replaceChildren(renderer.domElement);renderer.domElement.setAttribute('aria-label','Prévia do personagem real');preview={renderer,materials:[],geometries:[]};}
   for(const m of preview.materials)m.dispose();for(const g of preview.geometries)g.dispose();preview.materials=[];preview.geometries=[];
   tfp.visibleRoot.updateMatrixWorld(true);tfp.fullMesh.skeleton.update();
   const group=new T.Group(),v=new T.Vector3();
   function snapshot(source){
    const geo=source.geometry.clone();preview.geometries.push(geo);geo.setDrawRange(0,Infinity);
    if(source.isSkinnedMesh){const src=source.geometry.getAttribute('position'),positions=new Float32Array(src.count*3);for(let i=0;i<src.count;i++){source.getVertexPosition(i,v);v.applyMatrix4(source.matrixWorld);positions[i*3]=v.x;positions[i*3+1]=v.y;positions[i*3+2]=v.z;}geo.setAttribute('position',new T.BufferAttribute(positions,3));geo.deleteAttribute('skinIndex');geo.deleteAttribute('skinWeight');geo.computeVertexNormals();}
    else geo.applyMatrix4(source.matrixWorld);
    geo.computeBoundingBox();geo.computeBoundingSphere();
    const mats=Array.isArray(source.material)?source.material:[source.material];const copied=mats.map(m=>{const c=new T.MeshStandardMaterial({map:m.map||null,color:m.map?0xffffff:(m.color?.clone?.()||0xa99c7b),vertexColors:!!m.vertexColors,roughness:1,side:T.DoubleSide});preview.materials.push(c);return c});const mesh=new T.Mesh(geo,Array.isArray(source.material)?copied:copied[0]);mesh.frustumCulled=false;group.add(mesh);return mesh;
   }
   const part=snapshot(tfp.fullMesh);
   const eq=equipped(),seen=new Set();const sources=[eq.armor&&window.gamePrimitive?.armor,eq.right&&(window.gameForgedEquipmentV230?.models?.right||window.gameRightHand?.object),eq.left&&(window.gameForgedEquipmentV230?.models?.left||window.gameShield?.equipped&&window.gameShield.object)];
   for(const source of sources){if(!source)continue;source.updateMatrixWorld(true);source.traverse(o=>{if(o.isMesh&&!seen.has(o)){let visible=true;for(let n=o;n&&n!==source;n=n.parent)if(!n.visible)visible=false;if(visible){seen.add(o);snapshot(o)}}});}

   tfp.model.traverse(n=>{if(n.name==='Floresta_Cabelo_Jogador_V264')n.traverse(o=>{if(o.isMesh)snapshot(o)})});
   const box=new T.Box3().setFromObject(part),size=box.getSize(new T.Vector3()),center=box.getCenter(new T.Vector3());
   const wrapper=new T.Group();wrapper.add(group);const scale=1.85/Math.max(.01,size.y);wrapper.scale.setScalar(scale);group.position.copy(center).multiplyScalar(-1);group.position.y+=size.y/2;wrapper.rotation.y=-(tfp.visibleRoot.rotation.y||0)+Math.PI+.12;
   const scene=new T.Scene();scene.add(wrapper,new T.HemisphereLight(0xe5e2d2,0x394132,2));const light=new T.DirectionalLight(0xffe3b5,2.2);light.position.set(2,4,4);scene.add(light);
   const camera=new T.PerspectiveCamera(32,1,.01,50);camera.position.set(0,1.08,4.1);camera.lookAt(0,.96,0);camera.layers.enableAll();
   const rect=stage.getBoundingClientRect(),w=Math.max(80,Math.round(rect.width)),h=Math.max(130,Math.round(rect.height));preview.renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();preview.renderer.render(scene,camera);preview.clone=wrapper;preview.error=null;preview.bounds=size.toArray();
  }catch(e){console.warn('[Inventário V269] Prévia:',e);if(preview)preview.error=String(e);if(!stage.querySelector('canvas'))stage.textContent='Prévia do personagem indisponível.';}
 }

 function closePanels(){root.dataset.inventoryEquipment='closed';root.dataset.inventoryDetail='closed';root.dataset.inventoryNav='closed';$('v270EquipmentToggle')?.setAttribute('aria-expanded','false');$('v270NavToggle')?.setAttribute('aria-expanded','false');$('v269Equipment')?.setAttribute('aria-hidden','true');}
 function setEquipment(open){closePanels();if(open){root.dataset.inventoryEquipment='open';$('v270EquipmentToggle').setAttribute('aria-expanded','true');$('v269Equipment').setAttribute('aria-hidden','false');renderPreview();}}
 d.addEventListener('click',e=>{if(!window.gameInventory?.isOpen)return;if(e.target.closest('#inventoryGrid .inventory-slot:not(.empty)')){root.dataset.inventoryDetail='open';root.dataset.inventoryEquipment='closed';$('v270EquipmentToggle')?.setAttribute('aria-expanded','false');}if(e.target.closest('#inventoryOverlay .u173-tabs button')){root.dataset.inventoryNav='closed';$('v270NavToggle')?.setAttribute('aria-expanded','false');}},true);
 function sync(){mount();const open=window.gameInventory?.isOpen;if(open){if(!lastOpen){closePanels();notify('');lastPreview='';}update();const ed=$('v256Editor');if(ed)ed.hidden=false;}else if(lastOpen){cancelDrag();closePanels();}lastOpen=open;}
 // Pointer activation keeps legacy clicks functional on touch and keeps scroll gestures intact.
 const clickOnly='#v270EquipmentToggle,#v270NavToggle,#v270EquipmentClose,#v270DetailsClose,#v270Shade,#v269Filters button,#v269Equipment button,#v269Drop,#inventoryEquip,#inventoryBranchHands button,#v256Editor button';
 let tap=null,ghostClickUntil=0;
 d.addEventListener('pointerdown',e=>{
  if(root.dataset.inventoryNav==='open'&&!e.target.closest('.u173-tabs,#v270NavToggle')){root.dataset.inventoryNav='closed';$('v270NavToggle')?.setAttribute('aria-expanded','false');}
  if(!window.gameInventory?.isOpen||e.pointerType!=='touch')return;
  const b=e.target.closest('.inventory-slot,'+clickOnly);if(!b||b.disabled)return;tap={b,id:e.pointerId,x:e.clientX,y:e.clientY};
  if(b.matches('.inventory-slot')&&b.dataset.item269){const id=b.dataset.item269;drag={id,pointer:e.pointerId,x:e.clientX,y:e.clientY,active:false,timer:setTimeout(()=>{if(drag){drag.active=true;ghost=d.createElement('div');ghost.id='v269DragGhost';const src=art(id);if(src){const img=d.createElement('img');img.src=src;ghost.append(img)}else ghost.textContent=window.gameInventory.items.find(i=>i.id===id)?.name||'Item';d.body.append(ghost);moveGhost(drag.x,drag.y);}},320)};}
 },true);
 function moveGhost(x,y){if(ghost){ghost.style.left=x+'px';ghost.style.top=y+'px'}}
 function cancelDrag(){if(drag)clearTimeout(drag.timer);drag=null;ghost?.remove();ghost=null;tap=null;}
 d.addEventListener('pointermove',e=>{if(!tap||e.pointerId!==tap.id)return;const distance=Math.hypot(e.clientX-tap.x,e.clientY-tap.y);if(drag?.active){e.preventDefault();moveGhost(e.clientX,e.clientY);drag.x=e.clientX;drag.y=e.clientY;}else if(distance>10)cancelDrag();},{capture:true,passive:false});
 d.addEventListener('pointerup',e=>{
  if(!tap||e.pointerId!==tap.id)return;
  if(drag?.active){e.preventDefault();ghostClickUntil=Date.now()+650;const slot=d.elementFromPoint(e.clientX,e.clientY)?.closest('#v256Editor [data-slot]');if(slot){const ok=window.gameHotbarV256?.setSlot(Number(slot.dataset.slot),drag.id);notify(ok?'Atalho atualizado.':'Não foi possível colocar o item.')}cancelDrag();return;}
  const b=tap.b;e.preventDefault();ghostClickUntil=Date.now()+650;cancelDrag();b.click();sync();
 },true);
 window.addEventListener('touchmove',e=>{if(drag?.active)e.preventDefault();},{capture:true,passive:false});
 d.addEventListener('pointercancel',cancelDrag,true);d.addEventListener('contextmenu',e=>{if(window.gameInventory?.isOpen&&e.target.closest('.inventory-slot'))e.preventDefault()});
 d.addEventListener('click',e=>{if(e.isTrusted&&Date.now()<ghostClickUntil&&e.target.closest('#inventoryOverlay')){e.preventDefault();e.stopImmediatePropagation();}},true);
 const mo=new MutationObserver(()=>{if(window.gameInventory?.isOpen)applyFilter()});mo.observe(grid,{childList:true});
 window.addEventListener('resize',()=>{closePanels();lastPreview='';if(window.gameInventory?.isOpen)renderPreview()});window.addEventListener('floresta:appearance-change',()=>{lastPreview=''});
 mount();const timer=setInterval(sync,240);window.addEventListener('pagehide',()=>{clearInterval(timer);mo.disconnect();cancelDrag();preview?.renderer.dispose();for(const g of preview?.geometries||[])g.dispose();for(const m of preview?.materials||[])m.dispose()},{once:true});
 window.FlorestaInventory269={version:'V271',sync,renderPreview,get filter(){return filter},get preview(){return preview&&{ready:!!preview.clone,error:preview.error}},get selected(){return selected()?.id||null}};
})();
