
/* FLORESTA V222 | Forja física, vista POV, inventário nativo. Requer motor inicializado. */
(()=>{'use strict';
const VERSION='V230';
const RECIPES=[
 {id:'iron_handle',name:'Cabo de ferro',bar:1,hits:12,info:'Empunhadura para as ferramentas forjadas.',kind:'handle'},
 {id:'iron_axe_head',name:'Lâmina de machado',bar:1,hits:12,info:'Lâmina do machado crescente sombrio.',kind:'axe'},
 {id:'iron_sword_blade',name:'Lâmina de espada',bar:1,hits:12,info:'Lâmina da espada longa prateada.',kind:'sword'},
 {id:'iron_spear_tip',name:'Ponta de lança',bar:1,hits:12,info:'Ponta metálica da lança.',kind:'spear'},
 {id:'iron_plate',name:'Placa de ferro',bar:1,hits:12,info:'Placa que compõe o escudo.',kind:'plate'}
];
const ASSEMBLIES=[
 {id:'forged_shadow_axe',name:'Machado crescente sombrio',need:{iron_handle:1,iron_axe_head:1,vine:1},info:'Cabo + lâmina curva + cipó.',asset:'shadow_halberd',hand:'right',base:'axe'},
 {id:'forged_silver_sword',name:'Espada longa prateada',need:{iron_handle:1,iron_sword_blade:1,vine:1},info:'Cabo + lâmina de espada + cipó.',asset:'silver_longsword',hand:'right',base:'axe'},
 {id:'forged_silver_spear',name:'Lança prateada',need:{iron_handle:1,iron_spear_tip:1,vine:1},info:'Cabo + ponta de lança + cipó.',asset:'silver_spear',hand:'right',base:'spear'},
 {id:'forged_silver_shield',name:'Escudo prateado',need:{iron_handle:1,iron_plate:1,vine:1},info:'Placa + empunhadura + cipó.',asset:'silver_shield',hand:'left',base:'wood_shield'}
];
const LEGACY_FORGED={forged_shadow_halberd:'forged_shadow_axe',forged_silver_longsword:'forged_silver_sword'};
const META={iron_bar_hot:{name:'Barra de ferro quente',type:'Metal forjado',weight:.9,description:'Ferro da fornalha. Pode ser modelado na bigorna.'},iron_bar_cold:{name:'Barra de ferro fria',type:'Metal',weight:.9,description:'Reaqueça numa fornalha acesa para forjar.'}};
for(const r of RECIPES)META[r.id]={name:r.name,type:r.asset?(r.id.includes('shield')?'Escudo forjado':'Arma forjada'):'Peça de ferraria',weight:r.asset?(r.id.includes('shield')?3.5:2.4):1,description:r.info};
for(const r of ASSEMBLIES)META[r.id]={name:r.name,type:r.hand==='left'?'Escudo forjado':'Arma forjada',weight:2.1,description:r.info+' Equipável após a montagem.'};
const pause=ms=>new Promise(res=>setTimeout(res,ms));
async function start(){
 for(let i=0;i<2400;i++){
  if(window.__THREE_MODULE&&window.gameReview?.scene&&window.gameReview?.renderer&&window.gameReview?.player&&window.gameInventory&&window.gameFurnace?.furnaces)break;
  await pause(25);
 }
 const T=window.__THREE_MODULE,g=window.gameReview,inv=window.gameInventory,furnace=window.gameFurnace;
 if(!T||!g?.scene||!inv||!furnace){console.warn('[FORJA V222] Dependências não iniciadas');return;}
 const scene=g.scene,player=g.player;
 const icons=window.florestaV183Art?.items;
 if(icons){for(const id of Object.keys(META))icons[id]='assets/'+(ASSEMBLIES.some(r=>r.id===id)?'ferraria-v228/':'ferraria-v222/')+id+'.png';icons.forged_shadow_halberd=icons.forged_shadow_axe;icons.forged_silver_longsword=icons.forged_silver_sword;}
 const el=id=>document.getElementById(id);
 const bar=id=>inv.items.find(i=>i.id===id)?.quantity||0;
 const add=(id,n=1)=>inv.addItem({id,...META[id],quantity:n});
 const consume=(id,n=1)=>bar(id)>=n&&inv.removeItem(id,n);
 const has=(need)=>Object.entries(need).every(([id,n])=>bar(id)>=n);
 const canReceive=(id)=>bar(id)>0||inv.items.length<inv.capacity;
 const activeGame=()=>!!(window.gameFront172?.started||window.gameTestMode?.active)&&window.gameFront172?.paused!==true;
 const dist=o=>Math.hypot(player.x-o.root.position.x,player.z-o.root.position.z);
 const otherModal=()=>inv.isOpen||window.gameCraft?.active||document.body.classList.contains('crafting-active')||document.getElementById('alq189Panel')?.classList.contains('open')||!activeGame();
 const completedFurnaces=()=>furnace.furnaces.filter(f=>f?.root&&f.count>=16);
 const allFurnaces=()=>furnace.furnaces.filter(f=>f?.root);
 const stations=[];let active=false,kind='',station=null,chosen=RECIPES[0].id,tab='forge',cam=null,dirty=true,notice='',hammerVelocity=0,hitFlash=0,smeltFx=0,audio=null,last=performance.now(),lastUi=0;
 const mount=document.createElement('button');mount.id='forge222Entry';mount.type='button';mount.textContent='FERRARIA · O';mount.setAttribute('aria-label','Abrir a ferraria ou orientações para construir a fornalha');document.body.append(mount);
 const panel=document.createElement('section');panel.id='forge222Panel';panel.setAttribute('aria-label','Ferraria em primeira pessoa');panel.innerHTML='<header class="forge-top"><strong id="forge222Title">Ferraria POV</strong><button id="forge222Close">Sair · ESC</button></header><div class="forge-side" id="forge222Side"></div><div class="forge-work" id="forge222Work"></div><span class="forge-flash" id="forge222Flash">CLANG!</span>';document.body.append(panel);
 const guide=document.createElement('section');guide.id='forge224Guide';guide.hidden=true;guide.innerHTML='<article><header><strong>FERRARIA · COMO USAR</strong><button type="button" id="forge224GuideClose">Fechar · ESC</button></header><div id="forge224GuideInfo"></div></article>';document.body.append(guide);let guideOpen=false;
 function notify(s){notice=s;dirty=true;const status=el('status');if(status)status.textContent=s;}
 function sound(freq=380){try{audio=audio||new (window.AudioContext||window.webkitAudioContext)();if(audio.state==='suspended')audio.resume();const t=audio.currentTime,o=audio.createOscillator(),gain=audio.createGain();o.type='triangle';o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(freq*.36,t+.12);gain.gain.setValueAtTime(.06,t);gain.gain.exponentialRampToValueAtTime(.001,t+.16);o.connect(gain);gain.connect(audio.destination);o.start(t);o.stop(t+.17);}catch{}}
 function mesh(parent,geometry,material,x=0,y=0,z=0){const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;parent.add(m);return m;}
 const MAT={metal:new T.MeshStandardMaterial({color:0x747b7b,metalness:.85,roughness:.32}),hot:new T.MeshStandardMaterial({color:0xfa8135,metalness:.72,roughness:.36,emissive:0xde3100,emissiveIntensity:.65}),dark:new T.MeshStandardMaterial({color:0x282b2b,metalness:.8,roughness:.45}),wood:new T.MeshStandardMaterial({color:0x563522,roughness:.95}),stone:new T.MeshStandardMaterial({color:0x545753,roughness:.92}),skin:new T.MeshStandardMaterial({color:0x967454,roughness:.95}),coal:new T.MeshBasicMaterial({color:0xf38b38}),spark:new T.MeshBasicMaterial({color:0xffcb65})};
 // The anvil is a real 3D station placed in the original level.
 function createAnvilAt(x,z,yaw){const root=new T.Group();root.name='Bigorna_Ferraria_V222';root.position.set(x,g.groundY(x,z),z);root.rotation.y=yaw;scene.add(root);
  for(const xx of [-.25,.25])mesh(root,new T.BoxGeometry(.19,.59,.28),MAT.wood,xx,.31,0);
  mesh(root,new T.BoxGeometry(.65,.12,.48),MAT.wood,0,.59,0);
  mesh(root,new T.BoxGeometry(.20,.34,.17),MAT.dark,0,.78,0);
  mesh(root,new T.BoxGeometry(.66,.19,.38),MAT.metal,0,.97,0);
  const horn=mesh(root,new T.ConeGeometry(.15,.45,7),MAT.metal,.51,.99,0);horn.rotation.z=-Math.PI/2;
  const rear=mesh(root,new T.BoxGeometry(.18,.18,.35),MAT.metal,-.40,.97,0);
  const rest=new T.Group();rest.position.set(0,1.083,0);root.add(rest);
  const highlight=new T.PointLight(0xe3a16b,.5,2.2);highlight.position.set(0,1.4,.1);root.add(highlight);
  const hand=new T.Group();
  const sparkGroup=new T.Group();sparkGroup.visible=false;root.add(sparkGroup);
  for(let i=0;i<16;i++){const p=mesh(sparkGroup,new T.SphereGeometry(.013,5,5),MAT.spark,0,1.16,0);p.userData.a=i*2.399;p.userData.speed=.2+(i%5)*.10;}
  const a={root,rest,hand,sparkGroup,highlight,work:null,assembly:null,assembling:null,display:null,povRig:null};stations.push(a);return a;
 }
 function ensureAnvilPovRig(a){
  if(!a)return null;
  if(a.povRig)return a.povRig;
  const tfp=g.trueFirstPerson;
  if(!tfp?.model||!tfp?.fullMesh?.isSkinnedMesh)return null;
  try{
   const original=tfp.model,source=tfp.fullMesh,sourceNodes=[],copyNodes=[];
   original.traverse(n=>sourceNodes.push(n));
   const clone=original.clone(true);clone.traverse(n=>copyNodes.push(n));
   const lookup=new Map(sourceNodes.map((o,i)=>[o.uuid,copyNodes[i]]));
   const part=lookup.get(source.uuid);if(!part?.isSkinnedMesh)return null;
   const sourceBones=source.skeleton.bones;
   const armRoots=[tfp.bones?.rArm,tfp.bones?.lArm].filter(Boolean);
   if(armRoots.length!==2)throw Error('Bones dos braços indisponíveis');
   const allowed=new Set();for(const bone of armRoots){bone.traverse(child=>{if(child.isBone)allowed.add(child.uuid);});}
   const boneIndices=new Set(sourceBones.map((b,i)=>allowed.has(b.uuid)?i:-1).filter(n=>n>=0));
   const geo=source.geometry.clone(),si=geo.getAttribute('skinIndex'),sw=geo.getAttribute('skinWeight');
   if(!si||!sw)throw Error('Pesos de pele indisponíveis');
   const kept=new Uint8Array(geo.getAttribute('position').count);
   for(let i=0;i<kept.length;i++){let weight=0;for(let j=0;j<4;j++)if(boneIndices.has(si.getComponent(i,j)))weight+=sw.getComponent(i,j);if(weight>.38)kept[i]=1;}
   const index=geo.getIndex();const indices=index?index.array:Array.from({length:kept.length},(_,i)=>i);const filtered=[];
   for(let i=0;i<indices.length;i+=3){const i0=indices[i],i1=indices[i+1],i2=indices[i+2];if(kept[i0]+kept[i1]+kept[i2]>=2)filtered.push(i0,i1,i2);}
   if(filtered.length<30)throw Error('Nenhuma malha de braços identificada');
   geo.setIndex(filtered);geo.computeBoundingSphere();part.geometry=geo;
   const cloneBones=sourceBones.map(b=>lookup.get(b.uuid));
   if(cloneBones.some(b=>!b))throw Error('Rig não pôde ser clonado');
   part.bind(new T.Skeleton(cloneBones,source.skeleton.boneInverses.map(v=>v.clone())),source.bindMatrix.clone());
   for(const n of copyNodes){if(n.isMesh)n.visible=(n===part);}
   part.visible=true;part.frustumCulled=false;part.castShadow=false;part.receiveShadow=false;
   const rig=new T.Group();rig.visible=false;scene.add(rig);rig.add(clone);
   const hammerAnchor=lookup.get(tfp.bones.rHand?.uuid);
   if(hammerAnchor){const tool=new T.Group();hammerAnchor.add(tool);tool.position.set(.06,.04,.08);tool.rotation.set(-.7,.15,.25);const handle=mesh(tool,new T.CylinderGeometry(.022,.028,.38,12),MAT.wood,0,.18,0);mesh(tool,new T.BoxGeometry(.18,.115,.115),MAT.dark,0,.38,0);}
   a.povRig=rig;a.povClone=clone;a.povBoneLinks=sourceBones.map((b,i)=>({src:b,dst:cloneBones[i]}));
   a.povRightArm=lookup.get(tfp.bones.rArm?.uuid);a.povRightFore=lookup.get(tfp.bones.rFore?.uuid);
   a.povRightHand=hammerAnchor;a.povLeftArm=lookup.get(tfp.bones.lArm?.uuid);
   console.info('[FORJA V227] Braços reais do personagem clonados para POV, triângulos:',filtered.length/3);
   return rig;
  }catch(err){console.warn('[FORJA V227] Modelo do personagem indisponível para POV:',err);return null;}
 }

 function floorOK(x,z){const h=g.groundY(x,z);if(!Number.isFinite(h))return false;const hs=[g.groundY(x+.45,z),g.groundY(x-.45,z),g.groundY(x,z+.45),g.groundY(x,z-.45)];if(hs.some(n=>!Number.isFinite(n))||Math.max(...hs)-Math.min(...hs)>.22)return false;
  if(completedFurnaces().some(f=>Math.hypot(x-f.root.position.x,z-f.root.position.z)<1.65))return false;
  if(stations.some(a=>Math.hypot(x-a.root.position.x,z-a.root.position.z)<1.55))return false;
  if((g.colliders||[]).some(c=>Number.isFinite(c.x)&&Math.hypot(x-c.x,z-c.z)<(c.r||c.radius||.5)+.6))return false;
  if((g.worldObstacles||[]).some(o=>Math.hypot(x-o.x,z-o.z)<(o.r||.4)+.65))return false;
  return true;
 }
 function getSpot(f){const p=f.root.position;for(let k=0;k<16;k++){const a=(k+1)*Math.PI/8+f.root.rotation.y;for(const d of [2.35,2.9,3.5]){const x=p.x+Math.cos(a)*d,z=p.z+Math.sin(a)*d;if(floorOK(x,z))return {x,z,yaw:a-Math.PI/2};}}return null;}
 function buildAnvil(){if(!station||kind!=='furnace')return;
  const need={iron_bar_hot:2,rock:4};if(!has(need)){notify('Bigorna: precisa de 2 barras quentes e 4 pedras.');return;}
  const spot=getSpot(station);if(!spot){notify('Não há chão livre próximo para a bigorna. Procure outra fornalha.');return;}
  if(!consume('iron_bar_hot',2))return;
  if(!consume('rock',4)){add('iron_bar_hot',2);return;}
  try{const a=createAnvilAt(spot.x,spot.z,spot.yaw);notify('Bigorna construída perto da fornalha. Aproxime-se e aperte O.');exit();if(dist(a)<3.2)enter('anvil',a);}catch(e){add('iron_bar_hot',2);inv.addItem({id:'rock',name:'Pedra',type:'Material',quantity:4});console.error(e);notify('Não foi possível construir a bigorna.');}
 }
 const forgeItem=(id,n)=>({id,...META[id],quantity:n});
 function canSmelt(f){return f?.count===16&&(f.state==='burning'||f.state==='lit')&&f.heat>.42&&f.fuel>0;}
 function addFuel(){if(kind!=='furnace'||!station)return;const f=station;
  if(f.fuel>=275){notify('A fornalha já está cheia de combustível.');return;}
  if(!consume('branch',1)){notify('Não há galhos na mochila.');return;}
  f.fuel=Math.min(280,f.fuel+35);
  if(f.state!=='burning'&&f.state!=='lit'){f.state='loaded_with_fuel';f.heat=0;}
  notify('Galho inserido fisicamente na fornalha · +35 s de combustível.');
 }
 function track(f){if(!f._forge222)f._forge222={time:0,progress:0,output:0,working:false,ore:0,animOut:0,animIn:0,visual:null,placeAnim:0,takeAnim:0};return f._forge222;}
 function ensureFurnaceVisual(f){const s=track(f);if(s.visual||!f?.root)return s.visual;const group=new T.Group();group.position.set(0,.86,1.08);f.root.add(group);
  const tray=mesh(group,new T.BoxGeometry(.78,.10,.54),MAT.dark,0,-.06,0);
  const ore1=mesh(group,new T.DodecahedronGeometry(.135,0),MAT.stone,-.20,.12,.06);
  const ore2=mesh(group,new T.DodecahedronGeometry(.118,0),MAT.stone,.18,.14,-.04);
  const hotBar=mesh(group,new T.BoxGeometry(.56,.10,.16),MAT.hot,0,.09,0);
  const glow=new T.PointLight(0xff7b32,0,2.1);glow.position.set(0,.20,.08);group.add(glow);
  for(const m of [tray,ore1,ore2,hotBar])m.renderOrder=22;
  s.visual={group,tray,ore1,ore2,hotBar,glow};return s.visual;
 }
 function ensureSmeltPov(){
  if(ensureSmeltPov.rig)return ensureSmeltPov.rig;
  const rig=new T.Group();scene.add(rig);rig.visible=false;
  const oreMaterial=new T.MeshBasicMaterial({color:0x8b6d4f,depthTest:false,depthWrite:false});
  const barMaterial=new T.MeshBasicMaterial({color:0xff8d32,depthTest:false,depthWrite:false});
  const ore=new T.Group();rig.add(ore);
  const one=mesh(ore,new T.DodecahedronGeometry(.13,1),oreMaterial,-.13,0,0);
  const two=mesh(ore,new T.DodecahedronGeometry(.11,1),oreMaterial,.13,.03,0);
  const hot=mesh(rig,new T.BoxGeometry(.47,.09,.14),barMaterial,0,0,0);
  for(const m of [one,two,hot])m.renderOrder=999;
  ensureSmeltPov.rig={rig,ore,hot};return ensureSmeltPov.rig;
 }
 function drawSmeltPov(dt){
  const view=ensureSmeltPov(),{rig,ore,hot}=view;
  if(!(active&&kind==='furnace'&&station&&cam)){rig.visible=false;return;}
  const s=track(station);rig.visible=true;
  rig.position.copy(cam.position);rig.quaternion.copy(cam.quaternion);
  const entering=s.working||s.placeAnim>0;
  ore.visible=entering;
  if(entering){const t=s.working?Math.min(1,(10-s.progress)/10):1;
    const enter=Math.min(1,Math.max(0,(1.35-(s.placeAnim||0))/1.35));
    const smooth=enter*enter*(3-2*enter);
    ore.position.set(.86*(1-smooth),-.28+.17*smooth,-.76-.53*smooth);
    ore.scale.setScalar(Math.max(.08,(1-s.progress/10)*.98));
    ore.rotation.y+=dt*1.2;
  }
  const available=s.output>0 || s.takeAnim>0;
  hot.visible=available;
  if(available){const taking=s.takeAnim>0,ext=taking?1-Math.min(1,s.takeAnim/1.5):0;
    const smooth=ext*ext*(3-2*ext);
    hot.position.set(taking?.75*smooth:0,-.15-.21*smooth,-1.28+.65*smooth);
    hot.rotation.z=.08+smooth*.24;hot.scale.setScalar(taking?1+.18*smooth:1);
  }
 }
 function updateFurnaceVisual(f,dt=0){const s=track(f),v=ensureFurnaceVisual(f);if(!v)return;
  const progress=s.working?Math.max(0,Math.min(1,s.progress/10)):0;
  if(s.working){s.animIn=Math.min(1,(s.animIn||0)+dt*1.8);} else {s.animIn=Math.max(0,(s.animIn||0)-dt*2.4);}
  if((s.output||0)>0||s.animOut>0){s.animOut=Math.min(1,(s.animOut||0)+dt*2);} else {s.animOut=Math.max(0,(s.animOut||0)-dt*2.8);}
  const inMix=s.animIn;
  v.ore1.visible=v.ore2.visible=inMix>0.01;
  v.ore1.position.set(-.34+.30*inMix,.12-.04*progress,.12-.18*progress);
  v.ore2.position.set(.32-.28*inMix,.14-.05*progress,.02-.16*progress);
  const oreScale=1-Math.min(.88,progress*1.08);
  v.ore1.scale.setScalar(Math.max(.12,oreScale));
  v.ore2.scale.setScalar(Math.max(.10,oreScale));
  const out=s.output>0?1:s.animOut;
  v.hotBar.visible=out>0.01;
  const slide=(s.output>0?1:Math.max(0,s.animOut));
  v.hotBar.position.set(0,.09,.08+.48*slide);
  v.hotBar.rotation.x=(slide-.5)*.10;
  v.hotBar.scale.set(1.0,1.02+progress*.18,1.0);
  const heatGlow=Math.max(progress,(s.output>0?1:0))*1.25;
  v.glow.intensity=heatGlow;
  if(f.state==='burning'||f.state==='lit'){v.tray.material=MAT.dark;} else {v.tray.material=MAT.stone;}
 }
 function startSmelt(){const f=station;if(!f||kind!=='furnace')return;const s=track(f);
  if(s.working){notify('Já existe metal fundindo nesta fornalha.');return;}
  if(f.count<16){notify('Complete a fornalha antes de fundir. Faltam '+(16-f.count)+' pedras.');return;}
  if(!canSmelt(f)){notify('Acenda a fornalha e mantenha combustível antes de fundir.');return;}
  if(bar('iron_ore')<2){notify('São necessários 2 minérios de ferro por barra.');return;}
  if(s.output>=3){notify('Retire as barras prontas antes de colocar mais minério.');return;}
  if(!consume('iron_ore',2))return;s.ore=2;s.progress=0;s.working=true;s.animIn=0;s.placeAnim=1.35;notify('Dois minérios entraram na boca da fornalha. Fundição iniciada.');
 }
 function takeBars(){if(kind!=='furnace')return;const s=track(station);if(!s.output){notify('Ainda não há barras prontas.');return;}
  const n=s.output;if(!canReceive('iron_bar_hot')){notify('Mochila cheia. Barras preservadas na fornalha.');return;}
  if(add('iron_bar_hot',n)){s.output=0;s.animOut=1;s.takeAnim=1.5;notify(`Barra quente retirada da fornalha: ${n} unidade(s).`);}else notify('Mochila cheia. Barras preservadas.');
 }
 function reheat(){if(kind!=='furnace')return;if(!canSmelt(station)){notify('Aqueça a fornalha antes de reaquecer a barra.');return;}
  if(!bar('iron_bar_cold')){notify('Nenhuma barra fria na mochila.');return;}if(!canReceive('iron_bar_hot')){notify('Sem espaço para a barra quente.');return;}
  if(consume('iron_bar_cold',1)){const s=track(station);s.animIn=0;if(add('iron_bar_hot')){s.animOut=1;notify('A barra fria entrou na fornalha e saiu reaquecida.');}else{add('iron_bar_cold');notify('Sem espaço para a barra quente.');}}
 }
 // Os quatro modelos MesHy do usuário são embutidos diretamente no HTML, sem depender de fetch/file://.
 const packedModels=(()=>{try{return JSON.parse(document.getElementById('forge228MeshPack')?.textContent||'{}');}catch(e){console.error('[FERRARIA V228] Pacote de modelos:',e);return {};}})();
 const modelCache=new Map();
 function fromB64(b64){const raw=atob(b64),out=new Uint8Array(raw.length);for(let i=0;i<raw.length;i++)out[i]=raw.charCodeAt(i);return out;}
 function realMesh(asset){
  if(modelCache.has(asset))return modelCache.get(asset);
  const data=packedModels[asset];if(!data)return null;
  try{
   const geom=new T.BufferGeometry();
   const typed=(s,cls)=>{const u=fromB64(s);return new cls(u.buffer)};
   geom.setAttribute('position',new T.BufferAttribute(typed(data.position,Float32Array),3));
   geom.setAttribute('normal',new T.BufferAttribute(typed(data.normal,Float32Array),3));
   geom.setAttribute('uv',new T.BufferAttribute(typed(data.uv,Float32Array),2));
   geom.setIndex(new T.BufferAttribute(typed(data.index,Uint32Array),1));
   geom.computeBoundingSphere();
   const map=new T.TextureLoader().load('data:image/jpeg;base64,'+data.texture);
   map.colorSpace=T.SRGBColorSpace||map.colorSpace;
   map.flipY=true;
   const normal=new T.MeshStandardMaterial({map,roughness:.52,metalness:.38,side:T.DoubleSide});
   const glow=new T.MeshStandardMaterial({map,roughness:.62,metalness:.25,side:T.DoubleSide,color:0xffa36b,emissive:0xd94312,emissiveIntensity:.22});
   const entry={geom,normal,glow};modelCache.set(asset,entry);return entry;
  }catch(e){console.error('[FERRARIA V228] Falha ao montar modelo',asset,e);return null;}
 }
 function forgedModel(recipe,stage){
  const model=realMesh(recipe.asset);if(!model)return null;
  const root=new T.Group();const m=new T.Mesh(model.geom,stage===4?model.normal:model.glow);
  m.castShadow=true;m.receiveShadow=true;
  m.rotation.x=-Math.PI/2;
  const scale=recipe.asset==='silver_shield'?.34:.36;
  m.scale.setScalar(scale);
  root.add(m);return root;
 }
 // V231: exact grips measured on the original Meshy models.
 const EQUIPMENT_GRIPS_V231={
  shadow_halberd:{scale:.52,grip:[.01696,-.64,-.00045],rotation:[0,Math.PI,0],socket:[0,-.105,0]},
  silver_longsword:{scale:.60,grip:[-.00045,.67,-.00025],rotation:[0,-Math.PI/4,Math.PI],socket:[0,-.105,0]},
  silver_spear:{scale:1.155,grip:[-.00027,.949785-1.82/1.155,-.00108],rotation:[0,0,0],socket:[0,-.35,0]},
  silver_shield:{scale:.40,grip:[.235,-.10,-.155],rotation:[0,Math.PI,0],socket:[0,0,.077/1.02]}
 };
 function makeEquipmentModel(id){
  const canonical=LEGACY_FORGED[id]||id,r=ASSEMBLIES.find(x=>x.id===canonical);if(!r)return null;
  const source=realMesh(r.asset),profile=EQUIPMENT_GRIPS_V231[r.asset];if(!source||!profile)return null;
  const root=new T.Group();root.name='Equipamento_V231_'+canonical;
  const m=new T.Mesh(source.geom,source.normal);m.name='Malha_original_'+r.asset;
  m.castShadow=true;m.receiveShadow=true;
  m.scale.setScalar(profile.scale);m.rotation.set(...profile.rotation,'YXZ');
  m.position.fromArray(profile.grip).multiplyScalar(profile.scale).applyQuaternion(m.quaternion).negate();
  root.add(m);
  root.userData.forgedGripV231={asset:r.asset,sourceGrip:profile.grip.slice(),socket:profile.socket.slice(),scale:profile.scale};
  return root;
 }
 function pieceGeometry(recipe,stage){if(recipe.asset&&stage>=3){const model=forgedModel(recipe,stage);if(model)return model;}const step=Math.min(1,Math.max(0,stage/4));const root=new T.Group();const mat=MAT.hot;const box=(w,h,d,x=0,y=0,z=0)=>mesh(root,new T.BoxGeometry(w,h,d),mat,x,y,z);
  if(stage===0){box(.22,.15,.42);return root;}
  const k=recipe.kind;
  if(k==='handle'){box(.16-step*.055,.12-step*.02,.42+step*.65);box(.23,.11,.16,0,0,-(.25+step*.31));}
  else if(k==='axe'){box(.19,.20,.32,0,0,-.08);box(.32+step*.45,.11,.24+step*.17,-.1-step*.18,0,.02);box(.15,.13,.20,.09,0,-.06);}
  else if(k==='hammer'){box(.22+step*.55,.14+step*.1,.27,0,0,0);box(.18,.13,.14,0,.0,.0);}
  else if(k==='spear'){box(.14-step*.045,.09,.41+step*.32,0,0,.10);const point=mesh(root,new T.ConeGeometry(.075+step*.035,.19+step*.30,4),mat,0,0,-.20-step*.34);point.rotation.x=-Math.PI/2;}
  else if(k==='plate'){box(.23+step*.45,.13-step*.075,.32+step*.34);}
  else if(k==='pickaxe'){box(.44+step*.30,.12,.14,0,0,0);box(.14,.16,.24+step*.22,.19+step*.10,0,0);box(.14,.16,.24+step*.22,-.19-step*.10,0,0);}
  else if(k==='sword'){box(.11+step*.03,.08,.46+step*.42,0,0,.03);const tip=mesh(root,new T.ConeGeometry(.06+step*.018,.16+step*.18,4),mat,0,0,-.26-step*.34);tip.rotation.x=-Math.PI/2;box(.23,.06,.06,0,0,.18);}
  return root;
 }
 function displayPiece(a){if(!a)return;a.display?.removeFromParent();a.display=null;const w=a.work;if(!w)return;const r=RECIPES.find(x=>x.id===w.id);if(!r)return;const stage=Math.min(4,Math.floor(w.hits/3));const shape=pieceGeometry(r,stage);a.rest.add(shape);shape.position.y=.08;a.display=shape;}
 function chooseItem(id){chosen=id;notice='';dirty=true;}
 function startForging(){if(kind!=='anvil')return;const a=station;if(a.work||a.assembling){notify('Termine o trabalho atual antes de começar outra peça.');return;}
  const r=RECIPES.find(x=>x.id===chosen);if(!r)return;
  if(!has({iron_bar_hot:r.bar})){notify('Precisa de 1 barra de ferro quente. Funda minério na fornalha.');return;}
  if(!consume('iron_bar_hot',r.bar))return;a.work={id:r.id,hits:0,turned:false,temperature:100,last:performance.now(),done:false};displayPiece(a);notify(`${r.name} colocado na bigorna. Clique ou toque para martelar.`);}
 function rotatePiece(){if(kind!=='anvil'||!station.work||station.work.done)return;const w=station.work;if(w.hits<6){notify('Martele pelo menos 6 vezes antes de virar a peça.');return;}
  if(w.turned){notify('A peça já foi virada. Continue martelando.');return;}w.turned=true;if(station.display)station.display.rotation.y=Math.PI;notify('Peça virada com a tenaz. Agora termine o outro lado.');}
 function refundWork(){const a=station;if(!a?.work||a.work.done)return;const w=a.work;if(!canReceive('iron_bar_cold')){notify('Mochila cheia: abra espaço para devolver a barra.');return;}
  const count=RECIPES.find(r=>r.id===w.id)?.bar||1;if(add('iron_bar_cold',count)){a.work=null;a.display?.removeFromParent();a.display=null;notify(count+' barra(s) frias devolvidas. Pode reaquecer na fornalha.');}}
 function sparks(){hitFlash=1;station.sparkGroup.visible=true;panel.querySelector('.forge-flash').classList.remove('hit');void el('forge222Flash').offsetWidth;el('forge222Flash').classList.add('hit');}
 function hammer(){if(kind!=='anvil'||!station?.work)return;const a=station,w=a.work;
  if(w.done){notify('Peça pronta. Primeiro recolha o resultado.');return;}
  if(w.temperature<22){notify('Metal esfriou. Recolha a barra e reaqueça na fornalha.');return;}
  if(w.hits>=6&&!w.turned){notify('Vire a peça antes de martelar o outro lado.');return;}
  const now=performance.now();if(now-(w.lastHit||0)<200)return;w.lastHit=now;w.hits++;w.temperature=Math.max(0,w.temperature-1.2);hammerVelocity=1;sparks();sound(540-(w.hits%3)*60);
  const nextStep=w.hits%3===0;if(nextStep)displayPiece(a);
  if(w.hits>=12){w.done=true;displayPiece(a);notify('Peça forjada! Recolha na bigorna.');}
  else notify(w.hits===6?'Metade concluída. Agora vire a peça.':`Golpe ${w.hits}/12 · ${nextStep?'metal moldado em nova etapa':'metal sendo moldado'}`);
 }
 function collect(){if(kind!=='anvil'||!station?.work?.done)return;const id=station.work.id;if(!canReceive(id)){notify('Mochila cheia. Peça preservada na bigorna.');return;}
  if(add(id)){station.work=null;station.display?.removeFromParent();station.display=null;notify('Peça pronta guardada: '+META[id].name);}}
 function showAssembly(a){
  a.assembly?.removeFromParent();a.assembly=null;
  if(!a.assembling)return;
  const job=a.assembling,r=ASSEMBLIES.find(x=>x.id===job.id),group=new T.Group();a.rest.add(group);a.assembly=group;
  const stage=job.step;
  const kind=r.id.includes('axe')?'axe':r.id.includes('spear')?'spear':r.id.includes('hammer')?'hammer':r.id.includes('pickaxe')?'pickaxe':r.id.includes('sword')?'sword':'handle';
  const blade=pieceGeometry({kind},4);group.add(blade);
  if(stage===0){blade.position.set(-.31,.09,-.12);}else{blade.position.set(0,.14,-.25);}
  const shaft=mesh(group,new T.CylinderGeometry(.035,.047,.87,12),r.id.includes('shaft')||r.id.includes('axe')||r.id.includes('hammer')?MAT.metal:MAT.wood,stage===0?.36:0,.08,.23);
  shaft.rotation.x=Math.PI/2;
  if(stage>=2){for(let n=0;n<5;n++){const ring=mesh(group,new T.TorusGeometry(.046,.009,6,16),MAT.wood,0,.15,-.01+n*.032);ring.rotation.x=Math.PI/2;}}
  if(stage>=3){group.clear();const final=forgedModel(r,4);if(final){final.position.y=.1;group.add(final);}group.position.y=.05;}
 }
 function assembly(id){
  if(kind!=='anvil')return;const a=station,r=ASSEMBLIES.find(x=>x.id===id);
  if(!r||a.work||a.assembling){notify('Termine o trabalho atual na bigorna.');return;}
  if(!has(r.need)){notify('Materiais insuficientes para '+r.name+'.');return;}
  if(!canReceive(r.id)){notify('Mochila cheia.');return;}
  const removed=[];
  for(const [material,n] of Object.entries(r.need)){
   if(consume(material,n))removed.push([material,n]);
   else{for(const [k,c] of removed)inv.addItem({id:k,...(META[k]||{name:({branch:'Galho',vine:'Cipó'}[k]||k),type:'Material'}),quantity:c});notify('Montagem cancelada: faltam materiais.');return;}
  }
  a.assembling={id,step:0,need:r.need};showAssembly(a);
  notify('Peças sobre a bigorna. Encaixe o cabo e prenda os componentes.');
 }
 function nextAssembly(){if(kind!=='anvil'||!station?.assembling)return;
  const a=station,job=a.assembling;
  if(job.step>=2&&!canReceive(job.id)){notify('Mochila cheia. Abra espaço antes de terminar a montagem.');return;}
  job.step++;showAssembly(a);sound(330+job.step*60);
  if(job.step===1)notify('O encaixe foi alinhado. Agora fixe as peças.');
  else if(job.step===2)notify('Cabo encaixado. Prenda o conjunto com as amarrações.');
  else if(job.step>=3){if(add(job.id)){const name=META[job.id].name;a.assembling=null;setTimeout(()=>{if(a.assembly){a.assembly.removeFromParent();a.assembly=null;}},850);notify(name+' montado e adicionado à mochila.');}else {job.step=2;showAssembly(a);notify('Mochila cheia. Resultado preservado.');}}
 }
 function cancelAssembly(){if(kind!=='anvil'||!station?.assembling)return;const a=station,job=a.assembling;
  // Never discard reserved components if there is no space to return them.
  const absent=Object.keys(job.need).filter(k=>!bar(k));
  if(inv.items.length+absent.length>inv.capacity){notify('Abra espaço na mochila antes de recuperar os componentes.');return;}
  for(const [k,n] of Object.entries(job.need))inv.addItem({id:k,...(META[k]||{name:({branch:'Galho',vine:'Cipó'}[k]||k),type:'Material'}),quantity:n});
  a.assembling=null;a.assembly?.removeFromParent();a.assembly=null;notify('Montagem cancelada; materiais devolvidos.');
 }
 // A separate first-person render camera; movement, combat and pointer-lock are disabled in station mode.
 const renderer=g.renderer;
 const priorRender=renderer.render.bind(renderer);
 renderer.render=function(s,c,...args){if(active&&cam&&s===scene&&c===g.camera){cam.aspect=(renderer.domElement?.clientWidth||innerWidth)/Math.max(1,renderer.domElement?.clientHeight||innerHeight);cam.updateProjectionMatrix();return priorRender(s,cam,...args);}return priorRender(s,c,...args);};
 function updatePovRig(){
  for(const a of stations)if(a.povRig)a.povRig.visible=false;
  if(!(active&&kind==='anvil'&&station&&cam))return;
  const a=station,rig=ensureAnvilPovRig(a);if(!rig)return;
  rig.visible=true;const pos=cam.localToWorld(new T.Vector3(0,-1.72,-.95));
  rig.position.copy(pos);rig.quaternion.copy(cam.quaternion);
  for(const {src,dst} of a.povBoneLinks||[]){dst.position.copy(src.position);dst.quaternion.copy(src.quaternion);dst.scale.copy(src.scale);}
  const swing=hammerVelocity||0;
  if(a.povRightArm)a.povRightArm.quaternion.multiply(new T.Quaternion().setFromEuler(new T.Euler(-.22-swing*.75,-.15,-.28)));
  if(a.povRightFore)a.povRightFore.quaternion.multiply(new T.Quaternion().setFromEuler(-.20+swing*.85,0,0));
  if(a.povLeftArm)a.povLeftArm.quaternion.multiply(new T.Quaternion().setFromEuler(-.32,-.1,.28));
  rig.updateMatrixWorld(true);
 }

 function cameraPos(){if(!active||!station)return;
  if(!cam)cam=new T.PerspectiveCamera(58,innerWidth/Math.max(1,innerHeight),.03,700);
  const root=station.root;root.updateMatrixWorld(true);
  const pos=kind==='anvil'?new T.Vector3(0,1.94,1.71):new T.Vector3(0,1.78,2.55);
  const aim=kind==='anvil'?new T.Vector3(0,1.02,0):new T.Vector3(0,.92,.86);
  cam.position.copy(root.localToWorld(pos));cam.lookAt(root.localToWorld(aim));cam.updateMatrixWorld(true);
  updatePovRig();
 }
 function nearest(){let best=null;let bd=3.7;for(const f of allFurnaces()){const d=dist(f);if(d<bd){best={type:'furnace',target:f};bd=d;}}for(const a of stations){const d=dist(a);if(d<bd){best={type:'anvil',target:a};bd=d;}}return best;}
 function openGuide(){if(active||guideOpen||otherModal())return false;
  const fs=allFurnaces(),closest=fs.map(f=>({f,d:dist(f)})).sort((a,b)=>a.d-b.d)[0];
  let message='';
  if(!fs.length)message='<p><strong>Você ainda não construiu uma fornalha.</strong> Use o sistema normal de construção: posicione 16 pedras e conclua a estrutura.</p>';
  else if(closest.f.count<16)message='<p><strong>Fornalha incompleta:</strong> '+closest.f.count+'/16 pedras. Faltam '+(16-closest.f.count)+' pedras. Vá até ela e continue a construção com F.</p>';
  else message='<p><strong>Fornalha pronta!</strong> A mais próxima está a '+closest.d.toFixed(1)+' metros. Aproxime-se dela e use <kbd>O</kbd> para abrir o modo POV.</p>';
  el('forge224GuideInfo').innerHTML=message+'<ol><li>Construa uma fornalha completa (16 pedras).</li><li>Abra a ferraria perto dela com <kbd>O</kbd> ou botão FERRARIA.</li><li>Coloque galhos, equipe a tocha e acenda. Depois funda 2 minérios para fazer 1 barra.</li><li>Retire 2 barras e reúna 4 pedras para construir a bigorna.</li><li>Aproxime-se da bigorna, use <kbd>O</kbd>, escolha um molde e martele em POV. Depois monte a peça em machado, picareta, espada ou outra ferramenta.</li></ol><p class="forge-note">Se estiver longe de uma estação, a tela de instruções aparece no lugar da câmera de trabalho. Nenhum item é consumido por abrir o guia.</p>';
  guide.hidden=false;guideOpen=true;document.exitPointerLock?.();g.keys?.clear?.();document.body.classList.add('forge-v224-guide');return true;
 }
 function closeGuide(){if(!guideOpen)return;guideOpen=false;guide.hidden=true;document.body.classList.remove('forge-v224-guide');g.keys?.clear?.();}
 function tryOpen(){if(active||guideOpen||otherModal())return false;const n=nearest();return n?enter(n.type,n.target):openGuide();}
 function enter(type,obj){if(!obj||otherModal()||active)return false;if(dist(obj)>3.8)return false;
  active=true;kind=type;station=obj;notice='';dirty=true;tab='forge';document.exitPointerLock?.();g.keys?.clear?.();document.body.classList.add('forge-v222-active','crafting-active');panel.classList.add('open');mount.classList.remove('show');if(type==='anvil')ensureAnvilPovRig(obj);cameraPos();render();return true;
 }
 function exit(){if(!active)return;for(const a of stations){if(a.povRig)a.povRig.visible=false;}active=false;kind='';station=null;panel.classList.remove('open');document.body.classList.remove('forge-v222-active','crafting-active');g.keys?.clear?.();dirty=true;notice='';}
 mount.onclick=tryOpen;el('forge222Close').onclick=exit;el('forge224GuideClose').onclick=closeGuide;guide.addEventListener('pointerdown',e=>e.stopPropagation());guide.addEventListener('click',e=>e.stopPropagation());
 function sideHTML(){if(!station)return '';if(kind==='furnace'){
  const f=station,s=track(f),hot=bar('iron_bar_hot'),cold=bar('iron_bar_cold');
  const description=f.state==='burning'?'ACESa':f.state==='lit'?'ACENDENDO':'APAGADA';
  return `${f.count<16?`<p class="forge-warning"><b>Fornalha incompleta: ${f.count}/16 pedras</b> · faltam ${16-f.count}. Saia do POV e complete a construção no mundo com pedras e F.</p>`:''}<h3>Fundição de ferro</h3><div class="forge-stats"><div class="forge-stat">Fornalha<b>${description}</b></div><div class="forge-stat">Combustível<b>${Math.round(f.fuel)} s</b></div><div class="forge-stat">Minério na mochila<b>${bar('iron_ore')}</b></div><div class="forge-stat">Barras prontas<b>${s.output}</b></div></div><p>Coloque galhos direto da mochila. Ao fundir, o minério entra visualmente na boca da fornalha; ao retirar, a barra quente sai para fora.</p><div class="forge-row"><button data-act="fuel" ${f.count<16?'disabled':''}>+ Galho da mochila</button><button data-act="ignite" ${f.count<16?'disabled':''}>Acender (tocha)</button></div><button class="primary forge-recipe" data-act="smelt" ${f.count<16?'disabled':''}>Fundir 2 minérios → 1 barra quente <small>10 segundos com a fornalha acesa. O fogo da estrutura é o real.</small></button><div class="forge-progress"><div style="width:${Math.round(s.progress/10*100)}%"></div></div><div class="forge-row"><button data-act="take" ${!s.output?'disabled':''}>Retirar barras (${s.output})</button><button data-act="reheat" ${!cold?'disabled':''}>Reaquecer (${cold})</button></div><h3>Construir bigorna</h3><p>4 pedras + 2 barras quentes. Será colocada fisicamente em chão livre próximo.</p><div class="forge-row"><button data-act="anvil" ${!(hot>=2&&bar('rock')>=4)?'disabled':''}>Construir bigorna</button></div><div class="forge-footer">Fundição em andamento: ${s.working?(canSmelt(f)?'aquecendo':'pausada por falta de fogo'):'nenhuma'} · Barras aguardam retirada mesmo com mochila cheia.</div>`;
 }
 const a=station,w=a.work;
 if(tab==='assembly')return `<h3>Montar ferramentas</h3><div class="forge-tabs"><button data-tab="forge">Forjar</button><button class="active" data-tab="assembly">Montar</button></div><p>Monte o machado, espada, lança e escudo peça por peça. Primeiro forje cada componente, depois encaixe, fixe e amarre com cipó.</p>${a.assembling?`<p><b>${META[a.assembling.id].name}</b> · etapa ${a.assembling.step+1}/3. Continue usando os controles de montagem.</p>`:ASSEMBLIES.map(r=>`<button class="forge-recipe" data-assemble="${r.id}" ${a.work||a.assembling||!has(r.need)||!canReceive(r.id)?'disabled':''}>${r.name}<small>${Object.entries(r.need).map(([id,n])=>n+'× '+(META[id]?.name||({branch:'Galho',vine:'Cipó'}[id]||id))).join(' · ')} · ${has(r.need)?'Pronto':'Faltam materiais'}</small></button>`).join('')}<div class="forge-footer">Monte os quatro equipamentos 3D originais. Conclua a montagem e use Equipar no inventário.</div>`;
 return `<h3>Bigorna em primeira pessoa</h3><div class="forge-tabs"><button class="active" data-tab="forge">Forjar</button><button data-tab="assembly">Montar</button></div><div class="forge-stats"><div class="forge-stat">Barras quentes<b>${bar('iron_bar_hot')}</b></div><div class="forge-stat">Barras frias<b>${bar('iron_bar_cold')}</b></div><div class="forge-stat">Golpes<b>${w?.hits||0}/12</b></div><div class="forge-stat">Temperatura<b>${w?Math.round(w.temperature)+'%':'—'}</b></div></div>${a.assembling?`<p>Montagem em andamento: <b>${META[a.assembling.id]?.name}</b>. Abra a aba Montar e continue encaixando as peças.</p>`:w?`<p><b>${META[w.id]?.name}</b> na bigorna. ${w.done?'Peça concluída':w.hits>=6&&!w.turned?'Vire a peça para martelar o outro lado.':'Martele para moldar o metal em quatro etapas visuais.'}</p><div class="forge-progress"><div style="width:${w.hits/12*100}%"></div></div>`:`<p>Selecione o molde da peça desejada. A barra quente vai para a bigorna e você a transforma na base da ferramenta batendo em POV.</p>${RECIPES.map(r=>`<button class="forge-recipe ${chosen===r.id?'selected':''}" data-recipe="${r.id}">${r.asset?`<img class="forge228-icon" src="assets/ferraria-v228/${r.id}.png" alt="" loading="lazy">`:''}${r.name}<small>${r.bar} barra${r.bar>1?'s':''} quente${r.bar>1?'s':''} · ${r.info}</small></button>`).join('')}`}<div class="forge-footer">Forje cabo, lâmina, ponta ou placa separadamente. Recolha as peças, monte o equipamento e depois equipe pelo inventário.</div>`;
 }
 function workHTML(){if(!station)return '';const w=kind==='anvil'?station.work:null;
 if(kind==='furnace')return `<div class="notice">${notice||(station.count<16?'Termine a construção da fornalha: '+station.count+'/16 pedras':'Visão POV da boca da fornalha com minério e barra quente visíveis')}</div><button data-act="smelt" ${!canSmelt(station)||bar('iron_ore')<2||track(station).working?'disabled':''}>Colocar minério e fundir</button><button data-act="take" ${!track(station).output?'disabled':''}>Puxar barra quente</button>`;
 return station.assembling?`<div class="notice">${notice||'Montagem visível em etapas'}</div><button class="primary" data-act="assembly-next">${['Alinhar componentes','Encaixar e fixar cabo','Amarrar e concluir'][station.assembling.step]||'Finalizar'}</button><button data-act="assembly-cancel">Devolver peças</button>`:`<div class="notice">${notice||(w?'Martelo na mão · metal na bigorna':'Escolha a peça para começar')}</div>${!w?`<button class="primary" data-act="start" ${bar('iron_bar_hot')<(RECIPES.find(r=>r.id===chosen)?.bar||1)?'disabled':''}>Colocar barras quentes na bigorna</button>`:w.done?`<button class="primary" data-act="collect">Recolher peça pronta</button>`:`<button class="primary" data-act="hit" ${w.temperature<22||w.hits>=6&&!w.turned?'disabled':''}>MARTELAR · CLIQUE</button><button data-act="rotate" ${w.hits<6||w.turned?'disabled':''}>Virar peça · R</button><button data-act="refund">Recolher barra fria</button>`}`;
 }
 function render(){if(!active||!station)return;el('forge222Title').textContent=kind==='furnace'?'Fornalha · Fundição POV':'Bigorna · Forja POV';el('forge222Side').innerHTML=sideHTML();el('forge222Work').innerHTML=workHTML();dirty=false;}
 function uiAction(action,id){switch(action){case 'fuel':addFuel();break;case 'ignite':{const success=furnace.ignite(station);notify(success?'A chama está pegando. Aguarde o fogo aquecer.':'Para acender, aproxime-se, coloque galhos e equipe a tocha acesa.');break;}case 'smelt':startSmelt();break;case 'take':takeBars();break;case 'reheat':reheat();break;case 'anvil':buildAnvil();break;case 'start':startForging();break;case 'hit':hammer();break;case 'rotate':rotatePiece();break;case 'refund':refundWork();break;case 'collect':collect();break;case 'assembly-next':nextAssembly();break;case 'assembly-cancel':cancelAssembly();break;}dirty=true;}
 panel.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;e.stopPropagation();if(b.dataset.recipe)chooseItem(b.dataset.recipe);else if(b.dataset.tab){tab=b.dataset.tab;dirty=true;}else if(b.dataset.assemble)assembly(b.dataset.assemble);else if(b.dataset.act)uiAction(b.dataset.act);if(dirty)render();});
 // Capture before native movement/input listeners. No F1–F12 keys are used.
 window.addEventListener('keydown',e=>{
  if(guideOpen){if(e.code==='Escape'||e.code==='KeyO'){e.preventDefault();e.stopImmediatePropagation();closeGuide();return;}if(!['Tab'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();}return;}
  if(active){if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();exit();return;}
   if(e.code==='KeyR'&&kind==='anvil'){e.preventDefault();e.stopImmediatePropagation();rotatePiece();render();return;}
   if(e.code==='Space'&&kind==='anvil'&&(station.work||station.assembling)){e.preventDefault();e.stopImmediatePropagation();station.assembling?nextAssembly():hammer();render();return;}
   if(!['Tab'].includes(e.code)&&!e.target?.closest?.('input,textarea,select')){e.preventDefault();e.stopImmediatePropagation();g.keys?.clear?.();}return;
  }
  if(e.code==='KeyO'&&!e.repeat&&!e.altKey&&!e.ctrlKey&&!e.metaKey&&!otherModal()&&!(e.target?.closest?.('input,textarea,select'))){e.preventDefault();e.stopImmediatePropagation();tryOpen();}
 },true);
 renderer.domElement?.addEventListener('pointerdown',e=>{if(active&&kind==='anvil'&&e.button===0&&e.target===renderer.domElement){e.preventDefault();e.stopImmediatePropagation();station.assembling?nextAssembly():hammer();render();}},true);
 for(const evt of ['pointerdown','pointerup','click','wheel','touchstart','touchend'])panel.addEventListener(evt,e=>e.stopPropagation());
 function tick(now){requestAnimationFrame(tick);const dt=Math.min(.075,Math.max(0,(now-last)/1000));last=now;
  for(const f of completedFurnaces()){const s=track(f);s.placeAnim=Math.max(0,(s.placeAnim||0)-dt);s.takeAnim=Math.max(0,(s.takeAnim||0)-dt);if(s.working&&canSmelt(f)){s.progress+=dt;if(s.progress>=10){s.working=false;s.progress=0;s.output++;s.ore=0;s.animOut=0;notify('Barra de ferro quente pronta na fornalha!');}}updateFurnaceVisual(f,dt);}
  if(active&&kind==='anvil'&&station?.work){const w=station.work;if(!w.done){w.temperature=Math.max(0,w.temperature-dt*.25);}
   const a=station;a.hand.rotation.x=-hammerVelocity*.7;a.hand.rotation.z=-hammerVelocity*.10;hammerVelocity=Math.max(0,hammerVelocity-dt*8);if(a.sparkGroup.visible){hitFlash=Math.max(0,hitFlash-dt*7);for(const p of a.sparkGroup.children){const angle=p.userData.a;p.position.set(Math.cos(angle)*(.10+(.2*(1-hitFlash))),1.1+(1-hitFlash)*.12,Math.sin(angle)*(.12+(1-hitFlash)*.2));p.scale.setScalar(Math.max(.01,hitFlash));}if(hitFlash===0)a.sparkGroup.visible=false;}}
  if(active){g.keys?.clear?.();if(station)cameraPos();updatePovRig();drawSmeltPov(dt);if(now-lastUi>400||dirty){lastUi=now;render();}}
  else if(now-lastUi>340){drawSmeltPov(dt);lastUi=now;const available=!guideOpen&&!otherModal();const n=available?nearest():null;mount.classList.toggle('show',available);mount.textContent=n?.type==='anvil'?'FORJAR NA BIGORNA · O':n?.type==='furnace'?(n.target.count>=16?'ABRIR FORNALHA · O':'COMPLETAR FORNALHA · O'):'FERRARIA · COMO USAR (O)';}
 }
 window.gameForgeV230={version:VERSION,makeEquipmentModel,recipes:RECIPES,assemblies:ASSEMBLIES,stations,forgeInfo:META,get active(){return active},get guideOpen(){return guideOpen},get currentStation(){return station},nearest,selectRecipe:chooseItem,open:tryOpen,close:()=>{exit();closeGuide();},smelt:startSmelt,buildAnvil,forge:startForging,hammer,turn:rotatePiece,take:takeBars,collect,assemble:assembly};
 window.gameForgeV228=window.gameForgeV230;window.gameForgeV227=window.gameForgeV230;window.gameForgeV225=window.gameForgeV230;window.gameForgeV222=window.gameForgeV230;
 console.info('[FLORESTA] Forja POV V230: quatro equipamentos Meshy montados peça por peça e equipáveis');requestAnimationFrame(tick);
}
start().catch(e=>{console.error('[FORJA V227] Falha na inicialização:',e);const status=document.getElementById('status');if(status)status.textContent='Ferraria não carregou: '+String(e?.message||e);});
})();

