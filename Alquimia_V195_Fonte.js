
(()=>{'use strict';
const VERSION='V195_ALQUIMIA_BANCADA_VARAL_HERBARIO';
if(window.__FLORESTA_ALQUIMIA_189__)return;
window.__FLORESTA_ALQUIMIA_189__=true;
const nap=ms=>new Promise(r=>setTimeout(r,ms));
(async()=>{
for(let i=0;i<1400&&!(window.gameReview?.scene&&window.gameTestMode&&window.__THREE_MODULE&&window.gameInventory&&window.__V170_ASSETS__);i++)await nap(40);
const game=window.gameReview,T=window.__THREE_MODULE,inv=window.gameInventory,pack=window.__V170_ASSETS__;
if(!game?.scene||!T||!pack){console.error('[ALQ193] Dependências da Floresta V188 indisponíveis');return;}
const mobile=window.__CAVE_PLATFORM==='mobile'||matchMedia('(pointer:coarse)').matches;
const PLOT_X=10000,PLOT_Z=10000, sRoot=new T.Group();
sRoot.name='FLORESTA_V193_Alquimia_Modo_Criativo';sRoot.visible=false;game.scene.add(sRoot);
const state={stage:0,firstOpen:false,busy:false, fresh:{},dry:{},powder:{},bottles:{},
              hanging:[],plots:[],active:false,potion:null,fireUntil:0,fireRoot:null};
const herbDefs=[
 {id:'vermelha',name:'Flor escarlate',color:0xd84840,model:'bloom_red',scale:.75,qty:2},
 {id:'violeta',name:'Lavanda violeta',color:0x8a65be,model:'bloom_purple',scale:.72,qty:2},
 {id:'amarela',name:'Flor de brasa',color:0xe6b34d,model:'bloom_hibiscus',scale:.8,qty:2},
 {id:'alien',name:'Planta alienígena',color:0x43aeac,model:'alien_glb',scale:1.45,qty:1},
 {id:'pulmonaria',name:'Pulmonária azul',color:0x8199d5,model:'lungwort_glb',scale:.8,qty:2},
 {id:'tacas',name:'Taças vermelhas',color:0xb84250,model:'crimson_fbx',scale:.98,qty:1},
 {id:'cogumelo',name:'Cogumelo luminoso',color:0x78b9db,model:'glow_fbx',scale:.76,qty:1},
 {id:'marinha',name:'Folha abissal',color:0x448f91,model:'marine_glb',scale:1.0,qty:1},
 {id:'azul',name:'Flor azul',color:0x5a8dda,model:'bloom_blue',scale:.7,qty:2}
];
const recipes=[
 {id:'cura',name:'Cura da floresta',need:['vermelha','violeta'],color:0xbd3f55,desc:'Recupera 40 de vida',effect:'heal40'},
 {id:'cura_maior',name:'Cura profunda',need:['vermelha','pulmonaria'],color:0xe65364,desc:'Recupera 85 de vida',effect:'heal85'},
 {id:'fogo',name:'Óleo de brasa',need:['amarela','alien'],color:0xff8c21,desc:'Machado flamejante por 90s',effect:'fire'},
 {id:'vigor',name:'Essência de vigor',need:['marinha','azul'],color:0x47b5a9,desc:'Restaura 25 de vida',effect:'heal25'},
 {id:'luz',name:'Tônico do luar',need:['cogumelo','tacas'],color:0x9993ef,desc:'Restaura 55 de vida',effect:'heal55'}
];
const stageText=['Assentar 3 pedras da base','Fixar 4 galhos como pernas','Montar o tampo de madeira','Assentar a tigela e o pilão','Bancada concluída'];
const M={wood:new T.MeshStandardMaterial({color:0x6a4029,roughness:.97}),
 darkWood:new T.MeshStandardMaterial({color:0x3e281d,roughness:.95}),
 twig:new T.MeshStandardMaterial({color:0x97714a,roughness:1}),
 stone:new T.MeshStandardMaterial({color:0x8e8c80,roughness:1}),
 clay:new T.MeshStandardMaterial({color:0xb58d6c,roughness:1,side:T.DoubleSide}),
 mortar:new T.MeshStandardMaterial({color:0x92765b,roughness:1,side:T.DoubleSide}),
 vine:new T.MeshStandardMaterial({color:0x4a5934,roughness:1}),
 rope:new T.MeshStandardMaterial({color:0x9b8259,roughness:1}),
 glass:new T.MeshPhysicalMaterial({color:0xb9d2ce,roughness:.11,metalness:0,transparent:true,opacity:.48,depthWrite:false}),
 gold:new T.MeshStandardMaterial({color:0xc7a86a,roughness:.55}),
 soil:new T.MeshStandardMaterial({color:0x4d3930,roughness:1})};
const hex=(v)=>'#'+v.toString(16).padStart(6,'0');
const woodGeo=new T.BoxGeometry(1,1,1);
function put(geo,mat,par,pos=[0,0,0],rotation=[0,0,0]){let o=new T.Mesh(geo,mat);o.position.set(...pos);o.rotation.set(...rotation);o.castShadow=true;o.receiveShadow=true;par.add(o);return o;}
function cube(par,mat,pos,scl){const o=put(woodGeo,mat,par,pos);o.scale.set(...scl);return o;}
function tube(par,mat,pts,r=.032){const c=new T.CatmullRomCurve3(pts.map(p=>new T.Vector3(...p)));return put(new T.TubeGeometry(c,Math.max(7,pts.length*5),r,6,false),mat,par);}
function rod(par,mat,a,b,r1=.055,r2=r1){let A=new T.Vector3(...a),B=new T.Vector3(...b),vec=B.clone().sub(A);let o=put(new T.CylinderGeometry(r1,r2,vec.length(),9),mat,par);o.position.copy(A.add(B).multiplyScalar(.5));o.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),vec.normalize());return o}
function matColor(c){return new T.MeshStandardMaterial({color:c,roughness:.91,side:T.DoubleSide});}
function herbLeaf(par,id,sc=.8,dry=false){
 const d=herbDefs.find(a=>a.id===id)||herbDefs[0];
 const g=new T.Group();par.add(g);const col=new T.Color(d.color);
 if(dry)col.multiplyScalar(.51);const leaf=matColor(col), stem=matColor(dry?0x716845:0x507a46);
 for(let j=0;j<4;j++){let a=j*Math.PI/2+.28;
  rod(g,stem,[0,0,0],[Math.sin(a)*.14,.17+Math.sin(j*2)*.1,Math.cos(a)*.14],.012,.02);
  const pet=put(new T.SphereGeometry(.087,7,5),leaf,g,[Math.sin(a)*.17,.24+Math.sin(j*2)*.1,Math.cos(a)*.17]);pet.scale.set(.62,.33,1.4);pet.rotation.y=a;
 }
 const blossom=put(new T.SphereGeometry(.10,9,7),matColor(dry?col.getHex():d.color),g,[0,.39,0]);blossom.scale.set(1,.44,1);
 for(let k=0;k<5;k++){let a=k*1.256;const pet=put(new T.SphereGeometry(.105,8,6),leaf,g,[Math.sin(a)*.13,.39,Math.cos(a)*.13]);pet.scale.set(.82,.38,.78);}
 g.scale.setScalar(sc);return g;
}
function origin(x,z){return [x-PLOT_X,z-PLOT_Z];}
const baseY=game.groundY(PLOT_X,PLOT_Z+6);
let worldRoot=new T.Group();worldRoot.position.set(PLOT_X,baseY,PLOT_Z+6);sRoot.add(worldRoot);
function worldTerrain(x,z){return game.groundY(PLOT_X+x,PLOT_Z+6+z)-baseY;}
const platform=new T.Group();worldRoot.add(platform);
for(let i=0;i<7;i++){
 const slab=put(new T.BoxGeometry(.58,.13,3.55),M.wood,platform,[(i-3)*.53,.04,0]);
 slab.rotation.y=(i%2?-.009:.008);
}
let pieces=[];
for(let i=0;i<6;i++){pieces.push(new T.Group());pieces[i].visible=false;worldRoot.add(pieces[i]);}
for(let k=0;k<3;k++){let x=(k-1)*.5;put(new T.DodecahedronGeometry(.22,0),M.stone,pieces[0],[x,.17,-.15+(k%2)*.25]);}
for(let x of [-1.25,1.25])for(let z of [-.70,.70]){
 rod(pieces[1],M.wood,[x,.20,z],[x,1.06,z],.083,.09);}
for(let z of [-.72,.72])cube(pieces[2],M.wood,[0,1.07,z],[2.85,.10,.35]);
for(let i=0;i<8;i++)cube(pieces[2],i%3?M.wood:M.darkWood,[(i-3.5)*.36,1.075,0],[.355,.11,1.55]);
const bowlPivot=new T.Group();pieces[3].add(bowlPivot);bowlPivot.position.set(-.58,1.20,.04);
const profile=[[0,0],[.26,0],[.35,.045],[.48,.21],[.50,.245],[.42,.26],[.36,.19],[.27,.105],[0,.093]].map(v=>new T.Vector2(...v));
const mortarMesh=put(new T.LatheGeometry(profile,30),M.mortar,bowlPivot);
put(new T.TorusGeometry(.46,.025,8,32),M.clay,bowlPivot,[0,.245,0],[-Math.PI/2,0,0]);
let mixture =new T.Group();mixture.name="ALQ_MIXTURE";bowlPivot.add(mixture);
put(new T.CylinderGeometry(.355,.32,.018,25),matColor(0x54412c),mixture,[0,.125,0]);
let pestlePivot=new T.Group();pestlePivot.name="ALQ_PESTLE";pestlePivot.position.set(-.57,1.24,.01);pieces[3].add(pestlePivot);
const pestle=rod(pestlePivot,M.wood,[0,.08,0],[.13,.48,.05],.098,.085);
put(new T.SphereGeometry(.13,16,12),M.wood,pestle,[0,-.21,0]); // local ornamental cap
// V195: the drying rack is now a separate building and never part of the workbench.

const bottleDisplay=new T.Group();bottleDisplay.position.set(.68,1.15,-.08);pieces[3].add(bottleDisplay);
function glassBottle(parent,x,y,z,size=.67,col=0x83c1af,fill=.44){
 const g=new T.Group();g.position.set(x,y,z);g.scale.setScalar(size);parent.add(g);
 let body=put(new T.CylinderGeometry(.17,.22,.43,14),M.glass,g,[0,.20,0]);
 put(new T.CylinderGeometry(.07,.085,.20,12),M.glass,g,[0,.49,0]);
 put(new T.CylinderGeometry(.085,.093,.08,11),M.rope,g,[0,.61,0]);
 const drink=put(new T.CylinderGeometry(.14,.185,.23,14),new T.MeshStandardMaterial({color:col,roughness:.28,transparent:true,opacity:.83,emissive:col,emissiveIntensity:.11}),g,[0,.14,0]);
 drink.scale.y=fill;drink.position.y=.043+fill*.12;
 return {g,drink};
}
let vial=glassBottle(bottleDisplay,0,0,0,1.0,0xa1b1a1,.03);vial.drink.name="ALQ_VIAL_LIQUID";
for(let k=0;k<4;k++)glassBottle(pieces[3],.18+k*.28,1.20,.36,.55,[0xe9a950,0xb35780,0x55aaa2,0xb7a263][k],.2);
let rackHangs=new T.Group();worldRoot.add(rackHangs);const dust=new T.Group();worldRoot.add(dust);
const createdPowder=[];
const stationColliders=[];
function addStationCollider(minX,maxX,minZ,maxZ,pad=.22){stationColliders.push({minX,maxX,minZ,maxZ,pad});}
addStationCollider(-1.62,1.62,-.94,.94,.24); // bancada principal
function resolveStationCollision(){
 if(!state.active||!game.player||window.gameCreativeSpiderMount?.mounted)return;
 let px=game.player.x,pz=game.player.z,moved=false;
 for(let step=0;step<3;step++){
  let pushed=false;
  for(const c of stationColliders){
   const minX=PLOT_X+c.minX-c.pad,maxX=PLOT_X+c.maxX+c.pad,minZ=PLOT_Z+6+c.minZ-c.pad,maxZ=PLOT_Z+6+c.maxZ+c.pad;
   if(px>minX&&px<maxX&&pz>minZ&&pz<maxZ){
    const dl=Math.abs(px-minX),dr=Math.abs(maxX-px),db=Math.abs(pz-minZ),df=Math.abs(maxZ-pz);
    const m=Math.min(dl,dr,db,df);
    if(m===dl)px=minX;else if(m===dr)px=maxX;else if(m===db)pz=minZ;else pz=maxZ;
    pushed=true;moved=true;
   }
  }
  if(!pushed)break;
 }
 if(moved){game.player.x=px;game.player.z=pz;}
}
const patchDefs=[
 [-4.3,4.8,'vermelha'],[-2.4,4.6,'violeta'],[2.3,4.6,'amarela'],[4.35,4.7,'alien'],
 [-4.65,-.6,'pulmonaria'],[4.65,-.7,'tacas'],[-3.8,-3.9,'cogumelo'],[3.9,-3.9,'marinha'],[0,5.3,'azul']
];
const modelCache={}, pbrTextureCache={};
function decodeBase64(b64){const data=atob(b64),buf=new Uint8Array(data.length);for(let i=0;i<data.length;i++)buf[i]=data.charCodeAt(i);return buf}
function pbrTexture(key){
 if(pbrTextureCache[key])return pbrTextureCache[key];
 const t=new T.Texture();t.colorSpace=T.SRGBColorSpace;
 const im=new Image();im.onload=()=>{t.image=im;t.needsUpdate=true;};im.src='data:image/webp;base64,'+pack[key];
 pbrTextureCache[key]=t;return t;
}
async function loadAsset(key){
 if(modelCache[key])return modelCache[key];
 try{
   if(key.endsWith('_glb')){
     for(let tries=0;tries<500&&!window.__FOREST_GLTF_LOADER;tries++)await nap(40);
     if(!window.__FOREST_GLTF_LOADER)throw new Error('Carregador GLB indisponível');
     const bytes=key==='lungwort_glb'?decodeBase64(document.getElementById('alq189-lungwort-data').textContent.trim()):decodeBase64(pack[key]);
     const loader=new window.__FOREST_GLTF_LOADER();
     const data=await new Promise((resolve,reject)=>loader.parse(bytes.buffer,'',resolve,reject));
     const obj=data.scene;obj.updateMatrixWorld(true);modelCache[key]=obj;return obj;
   }
   if(key.endsWith('_fbx')){
     for(let tries=0;tries<500&&!window.__FBX_MODULE?.FBXLoader;tries++)await nap(40);
     const bytes=decodeBase64(pack[key]);const obj=new window.__FBX_MODULE.FBXLoader().parse(bytes.buffer,'');
     if(key==='crimson_fbx'||key==='glow_fbx'){
       obj.traverse(o=>{if(!o.isMesh)return;
         const keyTex=key==='crimson_fbx'?'crimson_pbr':'glow_albedo';
         o.material=new T.MeshStandardMaterial({map:pbrTexture(keyTex),side:T.DoubleSide,roughness:1,alphaTest:.14});
       });
     }
     modelCache[key]=obj;return obj;
   }
 }catch(e){console.warn('[ALQ193] Modelo',key,e);}
 return null;
}
function potPlantVisual(id){let g=new T.Group();herbLeaf(g,id,1.0,false);return g;}
async function visualizePlant(p){
 const d=herbDefs.find(h=>h.id===p.id);
 const fallback=herbLeaf(p.model,p.id,.88,false);
 if(d.model.startsWith('bloom_')){
  const mat=new T.MeshStandardMaterial({map:pbrTexture(d.model),side:T.DoubleSide,alphaTest:.12,roughness:1});
  const pl=new T.Group();
  for(let j=0;j<4;j++){
    const mesh=put(new T.PlaneGeometry(.75,1.18),mat,pl,[0,.55,0]);
    mesh.rotation.y=j*Math.PI/4;
  }
  if(d.id==='amarela'){mat.color.setHex(0xfceaa5);}
  p.model.add(pl);pl.scale.setScalar(d.scale);fallback.visible=false;return;
 }
 const source=await loadAsset(d.model);
 if(!source||!p.model)return;
 const inst=source.clone(true);inst.updateMatrixWorld(true);
 let b=new T.Box3().setFromObject(inst),size=new T.Vector3();b.getSize(size);
 if(!Number.isFinite(size.y)||size.y<.0001||size.y>1e8)return;
 const height=d.scale*(d.id==='alien'?1.5:1.0);
 let sc=height/size.y;
 inst.scale.multiplyScalar(sc);
 inst.position.set(-(b.min.x+b.max.x)*.5*sc,-b.min.y*sc,-(b.min.z+b.max.z)*.5*sc);
 inst.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=true;o.frustumCulled=false}});
 p.model.add(inst);fallback.visible=false;
}
for(let i=0;i<patchDefs.length;i++){
 const [x,z,id]=patchDefs[i], y=worldTerrain(x,z);
 const patch=new T.Group();patch.position.set(x,y,z);worldRoot.add(patch);
 put(new T.CylinderGeometry(.68,.76,.055,15),M.soil,patch,[0,.02,0]);
 const ring=put(new T.TorusGeometry(.67,.014,4,30),matColor(herbDefs.find(h=>h.id===id).color),patch,[0,.045,0],[-Math.PI/2,0,0]);
 const model=new T.Group();patch.add(model);
 const p={id,x,z,patch,ring,model,available:true,regrow:0,scope:"creative",worldX:PLOT_X+x,worldZ:PLOT_Z+6+z};
 state.plots.push(p);visualizePlant(p);
}
// Survival integration: a physical workbench is placed as a ghost blueprint and assembled one item at a time.
const creativeSite={root:worldRoot,pieces,mixture,pestlePivot,vial,rackHangs,stage:0,count:0,hanging:state.hanging,creative:true};
let currentSite=creativeSite;
const survivalSites=[];
let placement=false, placementKind='bench', buildGhost=null, buildRotation=0, buildTarget=null, buildReason='',focusedBuildSite=null,focusedRack=null,sitePending=null,siteSerial=0;
const racks=[];let rackSerial=0;const RACK_ITEMS=[{item:'branch',label:'Fincar a estaca esquerda'},{item:'branch',label:'Fincar a estaca direita'},{item:'branch',label:'Fixar a travessa superior'},{item:'vine',label:'Amarrar o cipó de secagem'}];
const PROGRESS_KEY='Floresta_V195_Alquimia_Progress';
let savedProgress={};try{savedProgress=JSON.parse(localStorage.getItem(PROGRESS_KEY)||'{}')||{}}catch{}
const discovered=new Set(Array.isArray(savedProgress.discovered)?savedProgress.discovered:[]);
function saveAlchemy(){try{localStorage.setItem(PROGRESS_KEY,JSON.stringify({discovered:[...discovered],benches:progressRestored?survivalSites.map(s=>({x:s.root.position.x,y:s.root.position.y,z:s.root.position.z,yaw:s.root.rotation.y,count:s.count})):savedProgress.benches||[],racks:progressRestored?racks.filter(r=>!r.creative).map(r=>({x:r.root.position.x,y:r.root.position.y,z:r.root.position.z,yaw:r.root.rotation.y,count:r.count,hanging:r.hanging.map(h=>({id:h.id,startedAt:h.startedAt,duration:h.duration,done:h.done}))})):savedProgress.racks||[]}))}catch(e){console.warn('[ALQ195] Salvamento local indisponível',e)}}
function unlockRecipe(r){return r.need.every(id=>discovered.has(id));}
const BUILD_ITEMS=[
 {stage:0,part:[0],item:'rock',label:'Pedra de fundação 1/3'},
 {stage:0,part:[1],item:'rock',label:'Pedra de fundação 2/3'},
 {stage:0,part:[2],item:'rock',label:'Pedra de fundação 3/3'},
 {stage:1,part:[0],item:'branch',label:'Primeira perna de madeira'},
 {stage:1,part:[1],item:'branch',label:'Segunda perna de madeira'},
 {stage:1,part:[2],item:'branch',label:'Terceira perna de madeira'},
 {stage:1,part:[3],item:'branch',label:'Quarta perna de madeira'},
 {stage:2,part:[0,2,3,4,5],item:'branch',label:'Primeira metade do tampo'},
 {stage:2,part:[1,6,7,8,9],item:'branch',label:'Segunda metade do tampo'},
 {stage:3,part:[0],item:'rock',label:'Assentar a tigela de pedra'},
 {stage:3,part:[1,2,3,4,5,6],item:'branch',label:'Preparar o pilão e os recipientes'}
];
const BUILD_TOTAL={rock:4,branch:7};
const itemNames={rock:'pedra',branch:'galho',vine:'cipó'};

// Standalone drying racks; every post/crossbar/rope is a separate construction step.
function makeRackSite(t,creative=false){
 const root=new T.Group();root.name='Varal_Independente_Alquimia_'+(++rackSerial);
 root.position.set(t.x,t.y,t.z);root.rotation.y=t.yaw||0;game.scene.add(root);
 const parts=[];for(let i=0;i<4;i++){parts.push(new T.Group());root.add(parts[i]);parts[i].visible=false;}
 rod(parts[0],M.wood,[-1.02,.09,0],[-1.02,2.36,0],.080,.100);
 rod(parts[1],M.wood,[1.02,.09,0],[1.02,2.36,0],.080,.100);
 rod(parts[2],M.darkWood,[-1.18,2.29,0],[1.18,2.29,0],.080,.080);
 tube(parts[3],M.vine,[[-1.03,2.07,.03],[-.55,1.99,.03],[0,1.96,.03],[.55,1.99,.03],[1.03,2.07,.03]],.024);
 const hangs=new T.Group();root.add(hangs);
 const r={root,parts,rackHangs:hangs,hanging:[],count:0,built:false,creative};
 if(creative){r.count=4;parts.forEach(g=>g.visible=true);}
 racks.push(r);return r;
}
function rackDistance(r){return Math.hypot(game.player.x-r.root.position.x,game.player.z-r.root.position.z)}
function nearestRack(max=4.5,readyOnly=false){let result=null,best=max;for(const r of racks){if(r.creative!==isCreative()||readyOnly&&!r.built)continue;const d=rackDistance(r);if(d<best){best=d;result=r}}return result;}
function showRackBuilt(r){r.parts.forEach((p,i)=>p.visible=i<r.count);r.built=r.count>=RACK_ITEMS.length;}
const creativeRack=makeRackSite({x:PLOT_X+4,y:game.groundY(PLOT_X+4,PLOT_Z+6),z:PLOT_Z+6,yaw:0},true);creativeRack.count=0;showRackBuilt(creativeRack);creativeRack.root.visible=false;
let activeRack=creativeRack;
function rackWorldBundles(r){return r?.rackHangs;}
function hangBundle(r,h,index){
 const x=-.8+index*.4;
 const group=new T.Group();group.position.set(x,1.98,0);r.rackHangs.add(group);
 tube(group,M.rope,[[0,0,0],[0,-.17,0]],.008);
 const plant=herbLeaf(group,h.id,.88,!!h.done);plant.position.y=-.48;plant.rotation.x=Math.PI;
 // Use the actual imported plant model where it is available, instead of substituting unrelated vegetation.
 const source=state.plots.find(p=>p.id===h.id&&p.model.children.length>1)?.model;
 if(source){const original=source.children.find(child=>child.visible);if(original){plant.visible=false;const copy=original.clone(true);copy.scale.multiplyScalar(.65);copy.rotation.x=Math.PI;copy.position.y=-.49;if(h.done)copy.traverse(o=>{if(o.isMesh&&o.material){o.material=o.material.clone();o.material.color.multiplyScalar(.48);}});group.add(copy);h.realPlant=copy;}}
 h.root=group;h.plant=plant;
}
function redrawRack(r){r.hanging.forEach(h=>{h.root?.removeFromParent();h.root=null;});r.hanging.forEach((h,i)=>hangBundle(r,h,i));}
function rackGhost(){const fake=makeRackSite({x:0,y:0,z:0,yaw:0},true);racks.splice(racks.indexOf(fake),1);fake.root.name='Varal_Previa';fake.root.traverse(o=>{if(o.isMesh){o.material=new T.MeshBasicMaterial({color:0x75edb3,transparent:true,opacity:.30,depthWrite:false});o.castShadow=false;}});fake.root.visible=false;return fake.root;}
function startRackPlacement(){
 if(!activePlay()||state.busy)return;
 if(window.gameLumber?.carrying){toast('Solte a madeira antes de construir.');return;}
 window.gameConstruction?.cancel?.();window.gameFurnace?.cancel?.();window.gameLogPlacement?.cancel?.();
 placement=true;placementKind='rack';buildRotation=0;
 if(buildGhost)buildGhost.visible=false;buildGhost=rackGhost();buildGhost.visible=true;
 document.querySelector('#constructionOverlay .construction-close')?.click();
 toast('Posicione o varal: R gira · F coloca cada material.');
}
async function placeRackPart(){
 if(!activePlay()||sitePending||state.busy)return false;
 let rack=focusedRack;
 if(placement){
  const t=computeBuildTarget();const err=validateBuild(t);if(err){toast(err);return false;}
  rack=makeRackSite(t,isCreative());rack.count=0;rack.built=false;rack.parts.forEach(g=>g.visible=false);
  cancelSurvivalPlacement();focusedRack=rack;
 }
 if(!rack||rack.built||rackDistance(rack)>4.4)return false;
 const entry=RACK_ITEMS[rack.count];if(!entry)return false;
 if(isSurvival()&&invCount(entry.item)<1){toast('Falta '+itemNames[entry.item]+'.');return false;}
 if(isSurvival()&&!inv.removeItem(entry.item,1))return false;
 const part=rack.parts[rack.count],start=part.position.clone();part.visible=true;
 const from=rack.root.worldToLocal(game.camera.position.clone().add(game.camera.getWorldDirection(new T.Vector3()).multiplyScalar(.7)));
 part.position.copy(from);const begin=performance.now();sitePending={rack};
 try{await Promise.all([new Promise(resolve=>{function tick(now){const u=Math.min(1,(now-begin)/630),smooth=u*u*(3-2*u);part.position.lerpVectors(from,start,smooth);part.position.y+=.15*Math.sin(Math.PI*u);if(u<1)requestAnimationFrame(tick);else resolve()}requestAnimationFrame(tick)}),actionAnimation('build',630)])}
 finally{part.position.copy(start);sitePending=null;}
 rack.count++;showRackBuilt(rack);saveAlchemy();
 toast(rack.built?'Varal independente concluído!':entry.label+' · '+rack.count+'/'+RACK_ITEMS.length);
 if(rack.built)window.dispatchEvent(new CustomEvent('game:construction-complete',{detail:{id:'alchemy_drying_rack',name:'Varal de secagem'}}));
 updateBuildHud();return true;
}
function resolveRackCollision(){
 if(!activePlay()||!game.player||window.gameCreativeSpiderMount?.mounted)return;
 for(const r of racks){if(r.creative!==isCreative()||!r.count||rackDistance(r)>3.0)continue;
  const dx=game.player.x-r.root.position.x,dz=game.player.z-r.root.position.z;
  const c=Math.cos(r.root.rotation.y),s=Math.sin(r.root.rotation.y);
  const x=dx*c-dz*s,z=dx*s+dz*c;
  // Narrow collision zones for the two uprights plus top crossing; can walk underneath between the posts.
  for(const rx of [-1.02,1.02])if(Math.abs(x-rx)<.24&&Math.abs(z)<.25){const vx=x-rx,vz=z;const d=Math.hypot(vx,vz)||.001;const nx=rx+vx/d*.27,nz=vz/d*.27;game.player.x=r.root.position.x+nx*c+nz*s;game.player.z=r.root.position.z-nx*s+nz*c;break;}
 }
}
function hangOnRack(r,id){
 syncSurvivalAlchemyInventory();if(!r?.built){toast('Conclua primeiro o varal.');return;}
 if(!id||!state.fresh[id]){toast('Colha uma flor fresca antes.');return;}
 if(r.hanging.length>=5){toast('Varal cheio: retire alguma flor seca.');return;}
 if(isSurvival()&&!inv.removeItem('alq_herba_'+id,1))return;
 if(isCreative())inv.removeItem?.('alq_herba_'+id,1);
 state.fresh[id]--;r.hanging.push({id,startedAt:Date.now(),duration:isCreative()?12000:90000,done:false,root:null});redrawRack(r);saveAlchemy();
 toast('Planta pendurada no varal.');renderPanel();
}
function collectDry(r,index){
 const h=r?.hanging[index];if(!h||!h.done){toast('Esta flor ainda está secando.');return;}
 if(!inv.addItem({id:'alq_dried_'+h.id,name:herbDefs.find(x=>x.id===h.id).name+' (seca)',type:'Erva seca',quantity:1,weight:.025,description:'Planta seca para usar no pilão.'})){toast('Inventário cheio.');return;}
 state.dry[h.id]=(state.dry[h.id]||0)+1;h.root?.removeFromParent();r.hanging.splice(index,1);redrawRack(r);saveAlchemy();toast('Planta seca retirada do varal.');renderPanel();
}

function invCount(id){return inv.items?.find?.(x=>x.id===id)?.quantity||0;}
function syncSurvivalAlchemyInventory(){
 if(!isSurvival())return;
 for(const herb of herbDefs){
  state.fresh[herb.id]=invCount('alq_herba_'+herb.id);
  state.dry[herb.id]=invCount('alq_dried_'+herb.id);
  state.powder[herb.id]=invCount('alq_powder_'+herb.id);
 }
 for(const recipe of recipes)state.bottles[recipe.id]=invCount('alq_potion_'+recipe.id);
}
function isSurvival(){return !isCreative()&&!window.gameSpiderCave?.active&&!!window.gameFront172?.started;}
function activePlay(){return isCreative()||isSurvival();}
function selectSite(site){
 if(!site||currentSite===site)return;
 currentSite.stage=state.stage;currentSite.hanging=state.hanging;
 currentSite=site;
 worldRoot=site.root;pieces=site.pieces;mixture=site.mixture;
 pestlePivot=site.pestlePivot;vial=site.vial;rackHangs=site.rackHangs;
 state.stage=site.stage;state.hanging=site.hanging;
 if(panel.classList.contains('open'))renderPanel();
}
function survivalDistance(site){return Math.hypot(game.player.x-site.root.position.x,game.player.z-site.root.position.z);}
function stationReady(){return currentSite?.creative?state.stage>=4:currentSite?.built;}
function nearestSurvivalSite(maxDistance=5.5,completeOnly=false){
 let best=null,distance=maxDistance;
 for(const site of survivalSites){
  if(completeOnly&&!site.built)continue;
  const d=survivalDistance(site);if(d<distance){best=site;distance=d;}
 }
 return best;
}
function chooseClosestSite(){
 if(isCreative()){selectSite(creativeSite);return creativeSite;}
 const near=nearestSurvivalSite(5.6);
 if(near){selectSite(near);return near;}
 return null;
}
function stationGhost(){
 const root=new T.Group();root.name='Alquimia_Previa_Construir';
 // The finished shape remains a ghost until the first material is placed.
 for(const stage of creativeSite.pieces){
  const clone=stage.clone(true);clone.visible=true;
  clone.traverse(o=>{if(o.isMesh){o.material=new T.MeshBasicMaterial({color:0x6de6b1,transparent:true,opacity:.21,depthWrite:false,side:T.DoubleSide});o.castShadow=false}});
  root.add(clone);
 }
 game.scene.add(root);root.visible=false;return root;
}
function computeBuildTarget(){
 const direction=game.camera.getWorldDirection(new T.Vector3());
 const origin=game.camera.position.clone();
 let x=game.player.x-Math.sin(game.player.yaw)*2.8,z=game.player.z-Math.cos(game.player.yaw)*2.8;
 for(let dist=.7;dist<4.8;dist+=.10){const v=origin.clone().addScaledVector(direction,dist);if(v.y<=game.groundY(v.x,v.z)+.08){x=v.x;z=v.z;break;}}
 const d=Math.hypot(x-game.player.x,z-game.player.z);
 if(d>3.7){x=game.player.x+(x-game.player.x)*3.7/d;z=game.player.z+(z-game.player.z)*3.7/d;}
 return {x,z,y:game.groundY(x,z),yaw:game.player.yaw+buildRotation};
}
function validateBuild(t){
 if(!t||![t.x,t.y,t.z].every(Number.isFinite))return'Terreno inválido';
 const h=[];const c=Math.cos(t.yaw),s=Math.sin(t.yaw);
 for(const lx of (placementKind==='rack'?[-1.12,0,1.12]:[-1.48,0,1.48]))for(const lz of (placementKind==='rack'?[-.25,0,.25]:[-.98,0,.98])){
  const x=t.x+lx*c+lz*s,z=t.z-lx*s+lz*c;h.push(game.groundY(x,z));
 }
 if(h.some(v=>!Number.isFinite(v)))return'Terreno inválido';
 if(Math.max(...h)-Math.min(...h)>.35)return'Terreno inclinado demais para a construção';
 t.y=Math.max(...h);
 if(Math.hypot(game.player.x-t.x,game.player.z-t.z)<1.5)return'Afaste a construção dos seus pés';
 for(const site of survivalSites)if(Math.hypot(site.root.position.x-t.x,site.root.position.z-t.z)<(placementKind==='rack'?2.6:3.4))return'Uma bancada ocupa esse lugar';
 for(const r of racks)if(!r.creative&&Math.hypot(r.root.position.x-t.x,r.root.position.z-t.z)<(placementKind==='rack'?2.6:3.2))return'Um varal ocupa esse lugar';
 for(const f of window.gameFurnace?.furnaces||[])if(Math.hypot(f.root.position.x-t.x,f.root.position.z-t.z)<2.5)return'Uma fornalha ocupa esse local';
 for(const o of window.gameConstruction?.sites||[])if(Math.hypot(o.root.position.x-t.x,o.root.position.z-t.z)<2.6)return'Outra construção ocupa esse local';
 for(const c of game.colliders||[])if(Math.hypot(c.x-t.x,c.z-t.z)<1.30+(c.r||.30))return'Árvore ou pedra no local';
 return '';
}
function makeSurvivalSite(t){
 const root=new T.Group();root.name='Bancada_Alquimia_Sobrevivencia_'+(++siteSerial);
 root.position.set(t.x,t.y,t.z);root.rotation.y=t.yaw;game.scene.add(root);
 const floor=platform.clone(true);root.add(floor);
 const cPieces=creativeSite.pieces.map(src=>{const g=src.clone(true);g.visible=true;root.add(g);g.children.forEach(part=>part.visible=false);return g;});
 const mix=cPieces[3].getObjectByName('ALQ_MIXTURE');
 const pest=cPieces[3].getObjectByName('ALQ_PESTLE');
 const liquid=cPieces[3].getObjectByName('ALQ_VIAL_LIQUID');
 if(!mix||!pest||!liquid)throw new Error('Bancada sem referências da tigela ou do pilão');
 const hangs=new T.Group();root.add(hangs);
 const site={root,pieces:cPieces,mixture:mix,pestlePivot:pest,vial:{drink:liquid},rackHangs:hangs,hanging:[],stage:0,count:0,built:false,creative:false};
 survivalSites.push(site);selectSite(site);return site;
}
function showBuiltItems(site){
 site.pieces.forEach(g=>{g.visible=true;g.children.forEach(part=>part.visible=false)});
 for(let i=0;i<site.count;i++){
  const slot=BUILD_ITEMS[i];for(const n of slot.part)if(site.pieces[slot.stage].children[n])site.pieces[slot.stage].children[n].visible=true;
 }
 site.built=site.count>=BUILD_ITEMS.length;site.stage=site.built?4:0;
 if(currentSite===site)state.stage=site.stage;
}
function startSurvivalPlacement(){
 if(!isSurvival()||state.busy)return;
 if(window.gameLumber?.carrying){toast('Solte o tronco antes de montar a bancada.');return;}
 window.gameConstruction?.cancel?.();window.gameFurnace?.cancel?.();window.gameLogPlacement?.cancel?.();
 placement=true;placementKind='bench';buildRotation=0;
 if(buildGhost)buildGhost.visible=false;buildGhost=stationGhost();buildGhost.visible=true;
 document.querySelector('#constructionOverlay .construction-close')?.click();
 toast('Posicione a bancada: R gira; F ou botão inicia a montagem.');
}
function cancelSurvivalPlacement(){placement=false;if(buildGhost)buildGhost.visible=false;updateBuildHud();}
async function placeSurvivalPart(){
 if(!isSurvival()||sitePending||state.busy)return false;
 if(placementKind==='rack')return placeRackPart();
 let site=focusedBuildSite;
 if(placement){
  buildTarget=computeBuildTarget();buildReason=validateBuild(buildTarget);
  if(buildReason){toast(buildReason);return false;}
  if(invCount('rock')<1){toast('Precisa de uma pedra para iniciar.');return false;}
  site=makeSurvivalSite(buildTarget);cancelSurvivalPlacement();
 }
 if(!site||site.built||survivalDistance(site)>4.2)return false;
 const slot=BUILD_ITEMS[site.count];
 if(!slot)return false;
 if(invCount(slot.item)<1){toast('Falta '+itemNames[slot.item]+' no inventário.');return false;}
 if(!inv.removeItem(slot.item,1))return false;
 selectSite(site);
 focusedBuildSite=site;
 const children=slot.part.map(i=>site.pieces[slot.stage].children[i]).filter(Boolean);
 const starts=children.map(c=>c.position.clone());
 const startWorld=game.camera.position.clone().addScaledVector(game.camera.getWorldDirection(new T.Vector3()),.55);
 const startLocal=site.pieces[slot.stage].worldToLocal(startWorld);
 children.forEach(c=>{c.visible=true;c.position.copy(startLocal)});
 const begun=performance.now(),length=620;
 sitePending={site,slot,children};
 const animate=()=>new Promise(resolve=>{function frame(time){
  const q=Math.min(1,(time-begun)/length),k=q*q*(3-2*q);
  children.forEach((c,i)=>{c.position.lerpVectors(startLocal,starts[i],k);c.position.y+=.15*Math.sin(Math.PI*q)});
  if(q<1)requestAnimationFrame(frame);else resolve();
 }requestAnimationFrame(frame)});
 try{await Promise.all([animate(),actionAnimation('build',length,0x8b6941)]);}
 finally{children.forEach((c,i)=>c.position.copy(starts[i]));sitePending=null;}
 site.count++;showBuiltItems(site);saveAlchemy();
 const finished=site.built;
 toast(finished?'Bancada de alquimia concluída!':slot.label+' · '+site.count+'/'+BUILD_ITEMS.length);
 if(finished){window.dispatchEvent(new CustomEvent('game:construction-complete',{detail:{id:'alchemy_station',name:'Bancada de alquimia'}}));}
 updateBuildHud();return true;
}
const buildStyle=document.createElement('style');buildStyle.textContent=`
#alchemyBuildHud{position:fixed;z-index:75;left:50%;bottom:154px;transform:translateX(-50%);max-width:min(420px,84vw);padding:9px 13px;border-radius:8px;border:1px solid #a58b61;background:#1a1814ea;color:#f0dfbc;font:13px system-ui;display:none;text-align:center;pointer-events:none}
#alchemyBuildAction,#alchemyBuildCancel{position:fixed;z-index:75;bottom:102px;right:16px;padding:10px 15px;color:#f1e7ce;border:1px solid #a58b61;background:#383024ed;border-radius:9px;font:700 13px system-ui;display:none}
#alchemyBuildCancel{bottom:54px}
#alchemyBuildAction:disabled{opacity:.42}
`;document.head.appendChild(buildStyle);
const buildHud=document.createElement('div');buildHud.id='alchemyBuildHud';document.body.appendChild(buildHud);
const buildAction=document.createElement('button');buildAction.id='alchemyBuildAction';buildAction.textContent='Colocar peça · F';document.body.appendChild(buildAction);
const buildCancel=document.createElement('button');buildCancel.id='alchemyBuildCancel';buildCancel.textContent='Cancelar';document.body.appendChild(buildCancel);
buildAction.onclick=placeSurvivalPart;buildCancel.onclick=cancelSurvivalPlacement;
let lastHudSig='';
function updateBuildHud(){
 const site=focusedBuildSite, r=focusedRack;
 const pendingRack=placement&&placementKind==='rack'||!placement&&r&&!r.built&&rackDistance(r)<4.4&&(!site||site.built||rackDistance(r)<=survivalDistance(site));
 const shown=activePlay()&&(placement||pendingRack||site&&!site.built&&survivalDistance(site)<4.2);
 const entry=pendingRack?RACK_ITEMS[placement?0:r.count]:BUILD_ITEMS[placement?0:site?.count];
 const desc=placement?(buildReason||('Prévia do '+(pendingRack?'varal':'bancada')+' · R gira · F inicia a montagem')):(entry?entry.label+' · '+(pendingRack?r.count:site.count)+'/'+(pendingRack?RACK_ITEMS.length:BUILD_ITEMS.length)+' · requer '+itemNames[entry.item]:'');
 const sig=[shown,pendingRack,placement,desc,entry?.item,!!sitePending,invCount(entry?.item)].join('|');
 if(sig===lastHudSig)return;lastHudSig=sig;
 buildHud.style.display=shown?'block':'none';buildAction.style.display=shown?'block':'none';buildCancel.style.display=placement?'block':'none';
 buildHud.textContent=desc;
 buildAction.textContent=sitePending?'Encaixando...':placement?'Colocar 1ª peça · F':'Colocar '+itemNames[entry?.item]+' · F';
 buildAction.disabled=!!sitePending||!!buildReason&&placement||isSurvival()&&invCount(entry?.item)<1;
 buildAction.onclick=pendingRack?placeRackPart:placeSurvivalPart;
}

function addBuildOption(){
 const tabs=document.querySelector('#constructionOverlay .construction-tabs');
 const grid=document.querySelector('#constructionOverlay .construction-grid');
 if(!tabs||!grid||tabs.querySelector('[data-cat="alchemy"]'))return;
 const tab=document.createElement('button');tab.className='construction-tab';tab.dataset.cat='alchemy';tab.textContent='Alquimia';tabs.appendChild(tab);
 tab.addEventListener('click',()=>{
  tabs.querySelectorAll('.construction-tab').forEach(b=>b.classList.toggle('active',b===tab));
  grid.textContent='';
  const card=document.createElement('button');card.type='button';card.className='construction-card';
  card.innerHTML='<strong>Bancada de alquimia</strong><span>Tigela, pilão e frascos · câmera de preparo</span><span class="resource">4 pedras · 7 galhos • montagem peça a peça</span>';
  card.onclick=startSurvivalPlacement;grid.appendChild(card);
  const rackCard=document.createElement('button');rackCard.type='button';rackCard.className='construction-card';
  rackCard.innerHTML='<strong>Varal de secagem</strong><span>Construção independente · 5 espaços para flores</span><span class="resource">3 galhos · 1 cipó • montagem peça a peça</span>';
  rackCard.onclick=startRackPlacement;grid.appendChild(rackCard);
 });
 tabs.querySelectorAll('.construction-tab:not([data-cat="alchemy"])').forEach(b=>b.addEventListener('click',()=>tab.classList.remove('active')));
}
addBuildOption();
const buildMenuRetry=setInterval(()=>{addBuildOption();if(document.querySelector('#constructionOverlay .construction-tabs [data-cat="alchemy"]'))clearInterval(buildMenuRetry);},900);
let survivalHerbRoot=null;
function spawnSurvivalHerbs(){
 if(spawnSurvivalHerbs.done||!isSurvival())return;
 spawnSurvivalHerbs.done=true;
 const center={x:game.player.x,z:game.player.z},root=new T.Group();root.name='Plantas_de_Alquimia_Sobrevivencia';game.scene.add(root);survivalHerbRoot=root;
 let seed=20261012;const rnd=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<36;i++){
  const id=herbDefs[i%herbDefs.length].id;
  const angle=(i+.15*rnd())*2.399963, radius=10+(i%7)*6+rnd()*7;
  const x=center.x+Math.cos(angle)*radius,z=center.z+Math.sin(angle)*radius;
  const y=game.groundY(x,z);
  if(!Number.isFinite(y))continue;
  if(Math.abs(game.groundY(x+1,z)-y)>.6||Math.abs(game.groundY(x,z+1)-y)>.6)continue;
  const patch=new T.Group();patch.position.set(x,y,z);root.add(patch);
  put(new T.CylinderGeometry(.46,.55,.035,12),M.soil,patch,[0,.018,0]);
  const ring=put(new T.TorusGeometry(.50,.012,4,22),matColor(herbDefs.find(h=>h.id===id).color),patch,[0,.04,0],[-Math.PI/2,0,0]);
  const model=new T.Group();patch.add(model);
  const p={id,x,z,worldX:x,worldZ:z,scope:'survival',patch,ring,model,available:true,regrow:0};
  state.plots.push(p);visualizePlant(p);
 }
}
function resolveSurvivalBenchCollision(){
 if(!isSurvival()||!game.player||window.gameCreativeSpiderMount?.mounted)return;
 for(const site of survivalSites){
  if(site.count<1||survivalDistance(site)>3.5)continue;
  const dx=game.player.x-site.root.position.x,dz=game.player.z-site.root.position.z;
  const c=Math.cos(site.root.rotation.y),s=Math.sin(site.root.rotation.y);
  let x=dx*c-dz*s,z=dx*s+dz*c;
  const hx=1.68,hz=1.20;
  if(Math.abs(x)>=hx||Math.abs(z)>=hz)continue;
  if(hx-Math.abs(x)<hz-Math.abs(z))x=(x>=0?1:-1)*hx;
  else z=(z>=0?1:-1)*hz;
  game.player.x=site.root.position.x+x*c+z*s;game.player.z=site.root.position.z-x*s+z*c;
 }
}

let progressRestored=false;
function restoreProgress(){
 if(progressRestored||!isSurvival())return;progressRestored=true;
 try{for(const data of (savedProgress.benches||[])){
  if(![data.x,data.y,data.z,data.yaw].every(Number.isFinite))continue;
  const site=makeSurvivalSite(data);site.count=Math.max(0,Math.min(BUILD_ITEMS.length,Number(data.count)||0));showBuiltItems(site);
 }
 for(const data of(savedProgress.racks||[])){
  if(![data.x,data.y,data.z,data.yaw].every(Number.isFinite))continue;
  const r=makeRackSite(data,false);r.count=Math.max(0,Math.min(4,Number(data.count)||0));showRackBuilt(r);
  r.hanging=(data.hanging||[]).filter(h=>herbDefs.some(x=>x.id===h.id)).slice(0,5).map(h=>({id:h.id,startedAt:Number(h.startedAt)||Date.now(),duration:Number(h.duration)||90000,done:!!h.done,root:null}));redrawRack(r);
 }
 }catch(e){console.warn('[ALQ195] Falha ao recuperar construções',e)}
}

function survivalBuildFrame(){
 if(!activePlay()){if(buildGhost)buildGhost.visible=false;buildHud.style.display='none';buildAction.style.display='none';buildCancel.style.display='none';return;}
 if(placement){buildTarget=computeBuildTarget();buildReason=validateBuild(buildTarget);
  if(buildGhost){buildGhost.visible=true;buildGhost.position.set(buildTarget.x,buildTarget.y,buildTarget.z);buildGhost.rotation.y=buildTarget.yaw;
   buildGhost.traverse(o=>{if(o.isMesh)o.material.color.setHex(buildReason?0xf05d55:0x68df9c)});
  }
 }else if(!sitePending){focusedBuildSite=isSurvival()?nearestSurvivalSite(4.2):null;focusedRack=nearestRack(4.4);}
 resolveSurvivalBenchCollision();resolveRackCollision();updateBuildHud();
}
function survivalKeyHandler(e){
 if(!activePlay()||e.repeat||state.busy)return;
 if(placement||focusedRack&&!focusedRack.built&&rackDistance(focusedRack)<4.4||focusedBuildSite&&!focusedBuildSite.built&&survivalDistance(focusedBuildSite)<4.2){
  if(e.code==='KeyR'&&placement){buildRotation+=Math.PI/4;e.preventDefault();e.stopImmediatePropagation();return;}
  if(e.code==='Escape'&&placement){cancelSurvivalPlacement();e.preventDefault();e.stopImmediatePropagation();return;}
  if(e.code==='KeyF'&&!nearestPlant()&&!inv.isOpen&&!document.body.classList.contains('construction-open')){e.preventDefault();e.stopImmediatePropagation();if(placementKind==='rack'||!placement&&focusedRack&&!focusedRack.built&&(!focusedBuildSite||focusedBuildSite.built||rackDistance(focusedRack)<survivalDistance(focusedBuildSite)))placeRackPart();else placeSurvivalPart();return;}
 }
}
window.addEventListener('keydown',survivalKeyHandler,true);

const css=document.createElement('style');css.id='alq189-style';css.textContent=`
#alq189Button{position:fixed;z-index:2508;right:14px;top:76px;background:#211b14e8;color:#e7cf9b;border:1px solid #a78b60;border-radius:7px;padding:11px 15px;font:700 13px/1.2 Georgia;display:none;cursor:pointer;box-shadow:0 5px 20px #0009}
#alq189Button.show{display:block}
#alq189Context{position:fixed;z-index:2506;bottom:22%;left:50%;transform:translateX(-50%);background:#171b13d9;color:#f0dbb4;border:1px solid #816d50a9;border-radius:5px;padding:8px 15px;font:13px system-ui;pointer-events:none;display:none;text-align:center;max-width:80vw}
#alq189Context.show{display:block}
#alq189Panel{position:fixed;z-index:3500;right:12px;top:126px;width:min(354px,calc(100vw - 24px));max-height:calc(100dvh - 142px);overflow:auto;background:#111710f3;border:1px solid #a58c56;box-shadow:0 12px 45px #000d;color:#ece2cb;padding:15px;border-radius:7px;font:13px/1.4 system-ui;display:none;box-sizing:border-box}
#alq189Panel.open{display:block}
#alq189Panel.work{left:12px;right:auto;top:12px;width:min(380px,38vw);max-height:calc(100dvh - 26px);background:#100d0af2;z-index:3550}
#alq189Panel.rack{top:14vh;left:12px;right:auto;width:min(440px,calc(100vw - 24px));z-index:3550}
#alq189Panel .choices{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:6px;max-height:160px;overflow:auto}
#alq189Panel .choices button{min-height:48px;text-align:left;padding:8px;border-radius:6px}
#alq189Panel .choices button.active{border-color:#eed3a0;background:#655039}
#alq189Panel .alq-tabs{display:flex;gap:4px;margin:6px 0}
#alq189Panel .alq-tabs button{flex:1}
#alq189Panel .alq-tabs button.selected{background:#856b43}
#alq189Panel .status{font-size:12px;color:#cdbd9b}
#alq195Exit{position:fixed;top:12px;right:12px;z-index:2147483640;background:#2c241ae8;border:1px solid #b79b65;border-radius:8px;color:#f4dbad;padding:12px;font:600 13px Georgia;display:none;cursor:pointer}
#alq195Exit.show{display:block}
#alq195Book{position:fixed;inset:5vh 8vw;z-index:2147483644;pointer-events:auto;background:#241810f9;border:4px double #b99c6c;border-radius:14px;box-shadow:0 25px 90px #000;color:#f0deb6;padding:20px;display:none;overflow:auto;font:14px Georgia}
#alq195Book.open{display:block}
#alq195Book h2{color:#e5bf78;font-size:27px;margin:5px 0 14px}
#alq195Book .pages{display:grid;grid-template-columns:1fr 1fr;gap:16px}
#alq195Book .page{padding:15px;border:1px solid #795c40;background:linear-gradient(125deg,#57442b 0%,#31251a 60%,#20170f 100%);min-height:270px}
#alq195Book .entry{background:#150f0ba6;border:1px solid #816540;border-radius:6px;padding:9px;margin:7px 0;display:flex;align-items:center;gap:12px}
#alq195Book .entry img{width:48px;height:50px;object-fit:contain}
#alq195Book button{background:#574227;color:#f0deb6;border:1px solid #b89a65;padding:9px;border-radius:5px;cursor:pointer}
#alq195Book .unknown{opacity:.55;filter:grayscale(1)}
#alq195Book .booknav{display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;margin:10px 0}
#alq195Book button{min-height:42px;touch-action:manipulation}
#alq195Book .entry{flex-wrap:wrap}
#alq195Book .entry button{margin-left:auto}
#alq189Panel .alchemy-callout{border:1px solid #9b855c;background:linear-gradient(125deg,#32261c,#181711);border-radius:7px;padding:10px;margin:8px 0;line-height:1.5}
#alq189Panel .alchemy-callout strong{color:#f4dda2}
#alq189Panel .alchemy-step{padding:6px 0;border-top:1px solid #71573c55}
#alq189Panel .alchemy-step.active{border-left:3px solid #d8b874;padding-left:8px;background:#7d604c1f}
#alq189Panel .alchemy-inventory{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:5px;margin:8px 0}
#alq189Panel .alchemy-inventory button{text-align:left;min-height:58px}
#alq189Panel .alchemy-inventory button.selected{border-color:#efd39d;background:#59432c}
#alq189Panel .alchemy-inventory small{color:#d0c09f;display:block}
#alq189Panel .alchemy-inventory .muted{opacity:.62}
#alq189Panel .alchemy-quickguide{color:#e0cba4;font-size:12px;line-height:1.5}
#alq189Panel .alchemy-progress{border:1px solid #806846;background:#201b17;padding:8px;margin:5px 0}
#alq189Panel .alchemy-progress.ready{border-color:#96ad75}
#alq189Panel .alchemy-progress.missing{border-color:#ad806b}
#alq189Panel .recipe-main{width:100%;text-align:left;font-weight:700;font-size:13px;background:#6b5030}
#alq189Panel .alchemy-actions{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin:8px 0}
#alq189Panel .alchemy-actions button{min-height:43px}
#alq189Panel .alchemy-actions .span2{grid-column:1/-1}
#alq189Panel button{touch-action:manipulation}
#alq195Book .recipeentry{border-left:3px solid #a88c61}
#alq195Book .recipeentry .ingredient{padding:3px 0;color:#e5d4b0}
#alq195Book .recipeentry .lockhint{font-size:12px;color:#c9b48d}
#alq195Book .recipeentry button{min-width:160px}

#alq189Panel h2{font:25px Georgia;margin:0 0 7px;color:#edc583}
#alq189Panel p{margin:7px 0;color:#bfb6a3}
#alq189Panel b{color:#f6d999}
#alq189Panel .alq-row{display:grid;grid-template-columns:1fr auto;align-items:center;gap:8px;margin:7px 0}
#alq189Panel select{width:100%;background:#26291f;color:#f3e4c6;border:1px solid #6c6b58;border-radius:3px;padding:8px 5px;min-width:0}
#alq189Panel button{background:#403023;color:#f4e1c3;border:1px solid #9f8055;border-radius:4px;min-height:35px;padding:6px 9px;cursor:pointer;font:12px system-ui}
#alq189Panel button:disabled{opacity:.4;cursor:not-allowed}
#alq189Panel button:hover:enabled{background:#705031}
#alq189Panel .primary{background:#756037;color:white}
#alq189Panel .stat{background:#263026;padding:8px;margin:7px 0;border-left:3px solid #bba26f}
#alq189Panel .head{display:flex;justify-content:space-between;align-items:start}
#alq189Panel .divider{height:1px;background:#7c6c4c70;margin:10px 0}
#alq189Toast{position:fixed;z-index:3600;left:50%;top:22%;transform:translateX(-50%);pointer-events:none;color:#fff0cb;background:#231d14ec;border:1px solid #bda16b;border-radius:5px;font:14px system-ui;padding:9px 16px;opacity:0;transition:opacity .3s;text-align:center;max-width:80vw}
#alq189Toast.on{opacity:1}
@media(max-width:700px){#alq189Button{top:auto;right:12px;bottom:35%;font-size:12px;padding:10px}#alq189Panel{top:8vh;right:8px;max-height:83dvh;width:min(340px,calc(100vw - 16px))}#alq189Panel.work{left:5px;top:auto;bottom:6px;width:calc(100vw - 10px);max-height:46dvh}#alq189Context{bottom:23%;font-size:12px}#alq195Book{inset:3vh 3vw;padding:10px}#alq195Book .pages{grid-template-columns:1fr}#alq195Book .page{min-height:100px}#alq195Exit{top:4px;right:4px;padding:10px}}
`;
document.head.appendChild(css);
const btn=document.createElement('button');btn.id='alq189Button';btn.textContent='ALQUIMIA  ·  L';document.body.appendChild(btn);
const collectBtn=document.createElement('button');collectBtn.id='alq194Collect';collectBtn.textContent='Colher planta · F';collectBtn.style.cssText='position:fixed;z-index:2507;right:12px;bottom:25%;padding:10px 14px;border-radius:8px;border:1px solid #bca477;background:#2c3228ed;color:#f5e4c7;font:700 13px system-ui;display:none;';document.body.appendChild(collectBtn);collectBtn.onclick=harvestNearest;
const context=document.createElement('div');context.id='alq189Context';document.body.appendChild(context);
const panel=document.createElement('div');panel.id='alq189Panel';document.body.appendChild(panel);
const toastEl=document.createElement('div');toastEl.id='alq189Toast';document.body.appendChild(toastEl);
let toastTimer=0;
function toast(text){toastEl.textContent=text;toastEl.classList.add('on');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toastEl.classList.remove('on'),2300);}

let viewKind='bench', workActive=false, bookPage='herbarium', chosenHerb='',chosenForm='dry',chosenRecipe=recipes[0].id, loadedHerb='', loadedVisual=null;
let workStation=null,workCamera=null,heldItem=null;const displayItems=[];
const exitWork=document.createElement('button');exitWork.id='alq195Exit';exitWork.textContent='Sair da bancada · ESC';document.body.appendChild(exitWork);
const book=document.createElement('div');book.id='alq195Book';book.setAttribute('role','dialog');book.setAttribute('aria-label','Grimório de alquimia');document.body.appendChild(book);
exitWork.onclick=()=>togglePanel(false);
for(const ui of [panel,book]){ui.addEventListener('pointerdown',e=>e.stopPropagation());ui.addEventListener('click',e=>e.stopPropagation());}
const renderer=game.renderer;
if(renderer?.render){
 const originalRender=renderer.render.bind(renderer);
 renderer.render=function(scene,camera,...extraArgs){
  if(workActive&&workCamera&&scene===game.scene&&camera===game.camera){
   workCamera.aspect=(renderer.domElement?.clientWidth||innerWidth)/Math.max(1,renderer.domElement?.clientHeight||innerHeight);
   workCamera.updateProjectionMatrix();return originalRender(scene,workCamera,...extraArgs);
  }
  return originalRender(scene,camera,...extraArgs);
 };
}
function updateWorkCamera(){
 if(!workStation)return;
 if(!workCamera)workCamera=new T.PerspectiveCamera(53,innerWidth/innerHeight,.035,1600);
 const root=workStation.root;root.updateMatrixWorld(true);
 const eye=root.localToWorld(new T.Vector3(0,4.12,1.68));
 const aim=root.localToWorld(new T.Vector3(0,1.11,0));
 workCamera.position.copy(eye);workCamera.lookAt(aim);
 workCamera.updateMatrixWorld(true);
}
function cleanupWorkItems(){for(const it of displayItems){it.removeFromParent();}displayItems.length=0;loadedHerb='';loadedVisual=null;}
function startWorkCamera(){workStation=currentSite;workActive=true;cleanupWorkItems();updateWorkCamera();game.keys?.clear?.();}
function endWorkCamera(){workActive=false;cleanupWorkItems();workStation=null;}
function showHerbOnTable(id,form='dry'){
 if(!workStation||!id)return;
 chosenHerb=id;chosenForm=form;
 const group=new T.Group();const j=displayItems.length;
 group.position.set(-1.10+(j%4)*.66,1.20,.47-Math.floor(j/4)*.64);
 workStation.root.add(group);displayItems.push(group);
 const d=herbDefs.find(d=>d.id===id);if(!d)return;
 if(form==='powder'){
  const mat=matColor(d.color);const pile=put(new T.ConeGeometry(.17,.095,15),mat,group,[0,.055,0]);pile.scale.y=.85;
 }else{
  // Clone the V194 vegetation already loaded in the game. No replacement meshes for the plant species.
  const source=state.plots.find(p=>p.id===id&&p.model.children.some(c=>c.visible))?.model;
  if(source){const original=source.children.find(c=>c.visible);if(original){const model=original.clone(true);model.scale.multiplyScalar(.40);model.position.set(0,0,0);group.add(model);}}
  if(!group.children.length)herbLeaf(group,id,.48,form==='dry');
  if(form==='dry')group.traverse(o=>{if(o.isMesh&&o.material){o.material=o.material.clone();o.material.color.multiplyScalar(.60);}});
 }
 group.userData.herbId=id;group.userData.form=form;
 renderPanel();
 return group;
}
function putHerbInMortar(id){
 if(!id){toast('Escolha uma planta no inventário primeiro.');return;}
 if(!(state.dry[id]>0)){toast('Planta fresca não pode ser triturada. Seque no varal e retire-a primeiro.');return;}
 if(loadedVisual){loadedVisual.removeFromParent();const k=displayItems.indexOf(loadedVisual);if(k>=0)displayItems.splice(k,1);}
 const herb=showHerbOnTable(id,'dry');
 if(!herb)return;
 herb.position.set(-.58,1.40,.035);herb.scale.setScalar(.50);
 loadedVisual=herb;loadedHerb=id;toast('Erva colocada no pilão. Agora pressione TRITURAR.');renderPanel();
}
function refreshRackTimerLabels(){
 if(viewKind!=='rack'||!activeRack)return;
 panel.querySelectorAll('[data-rack-clock]').forEach(el=>{
  const h=activeRack.hanging[+el.dataset.rackClock];
  if(!h)return;
  const v=h.done?'PRONTA PARA RETIRAR':Math.min(100,Math.floor((Date.now()-h.startedAt)/h.duration*100))+'%';
  if(el.textContent!==v)el.textContent=v;
 });
 // Refresh only when a plant becomes dry, never while the user is trying to tap.
 if(activeRack.hanging.some((h,i)=>h.done&&panel.querySelector(`[data-take="${i}"]`)?.disabled))renderPanel();
}
function bookPicture(d){return d.model.startsWith('bloom_')&&pack[d.model]?`<img alt="${d.name}" src="data:image/webp;base64,${pack[d.model]}">`:`<span style="font:22px Georgia;color:${hex(d.color)}">✤</span>`;}
function showBook(page='recipes'){
 if(!panel.classList.contains('open')||viewKind!=='bench'){toast('Abra a bancada para consultar o livro de alquimia.');return;}
 bookPage=page;book.classList.add('open');
 let left='',right='';
 if(page==='herbarium'){
  left=herbDefs.map(d=>discovered.has(d.id)?`<div class="entry">${bookPicture(d)}<div><b>${d.name}</b><div>Espécie conhecida e catalogada.</div></div><button data-examine="${d.id}">Examinar na mesa</button></div>`:`<div class="entry unknown"><span>✥</span><div><b>Espécie desconhecida</b><small>Explore e colete para revelar esta planta.</small></div></div>`).join('');
  right=`<h3>Herbário de campo</h3><p>As plantas só aparecem após serem coletadas no mundo. Você já identificou <b>${discovered.size}/${herbDefs.length}</b> espécies.</p><p>Para obter pós: colher → pendurar em um varal → retirar seca → colocar no pilão → triturar.</p>`;
 }else if(page==='recipes'){
  left=recipes.map(r=>{
   if(!unlockRecipe(r))return `<div class="entry recipeentry unknown"><span>🔒</span><div><b>Fórmula desconhecida</b><div class="lockhint">Ainda falta descobrir uma ou mais plantas. Consulte Pistas ou colete flores pelo mapa.</div></div></div>`;
   return `<div class="entry recipeentry"><span style="font-size:20px;color:${hex(r.color)}">✦</span><div><b>${r.name}</b><div class="ingredient">${r.need.map(id=>herbDefs.find(d=>d.id===id).name).join(' + ')}</div><small>${r.desc}</small><p>${r.need.map(id=>`<span class="ingredient">${herbDefs.find(d=>d.id===id).name}: ${state.powder[id]||0} pó · ${state.dry[id]||0} seca</span>`).join(' • ')}</p></div><button data-selectrecipe="${r.id}">Preparar esta poção</button></div>`;
  }).join('');
  right='<h3>Como preparar</h3><p><b>1.</b> Escolha uma receita revelada e toque em <i>Preparar esta poção</i>.</p><p><b>2.</b> Veja quais flores são necessárias. Se estiverem frescas, primeiro use um varal independente.</p><p><b>3.</b> Na bancada, selecione cada erva seca, coloque no pilão e triture.</p><p><b>4.</b> Com todos os pós prontos, escolha Misturar e engarrafar.</p>';
 }else{
  left=recipes.map(r=>unlockRecipe(r)?`<div class="entry"><div>✧ <b>${r.name}</b> — descoberta.</div></div>`:`<div class="entry"><span>⌁</span><div>Pista: ${r.need.some(id=>discovered.has(id))?r.need.filter(id=>discovered.has(id)).map(id=>herbDefs.find(d=>d.id===id).name).join(' + ')+' + outra planta desconhecida':'Explore ambientes diferentes e descubra novas espécies.'}</div></div>`).join('');
  right='<h3>Diário do alquimista</h3><p>Plantas de cores e origens diferentes podem reagir quando combinadas. Algumas curam ferimentos; outras alteram armas.</p><p>As receitas completas serão reveladas apenas conforme o herbário avançar.</p>';
 }
 book.innerHTML=`<div class="booknav"><h2>Grimório das Ervas</h2><button id="alq195CloseBook" type="button">✕ Fechar livro</button></div><div class="booknav"><button data-bookpage="recipes">Receitas</button><button data-bookpage="herbarium">Herbário</button><button data-bookpage="clues">Pistas</button></div><h3>${page==='recipes'?'Fórmulas e poções':page==='herbarium'?'Plantas descobertas':'Segredos e descobertas'}</h3><div class="pages"><div class="page">${left}</div><div class="page">${right}</div></div>`;
 book.querySelector('#alq195CloseBook').onclick=()=>book.classList.remove('open');
 book.querySelectorAll('[data-bookpage]').forEach(b=>b.onclick=()=>showBook(b.dataset.bookpage));
 book.querySelectorAll('[data-examine]').forEach(b=>b.onclick=()=>{book.classList.remove('open');showHerbOnTable(b.dataset.examine,'fresh')});
 book.querySelectorAll('[data-selectrecipe]').forEach(b=>b.onclick=()=>{
  chosenRecipe=b.dataset.selectrecipe;chosenHerb=recipes.find(r=>r.id===chosenRecipe)?.need?.[0]||'';
  book.classList.remove('open');renderPanel();toast('Receita escolhida. Siga os ingredientes indicados no painel.');
 });
}

function openRack(r){
 if(!r?.built)return;
 book.classList.remove('open');
 activeRack=r;viewKind='rack';endWorkCamera();
 panel.classList.add('open','rack');panel.classList.remove('work');exitWork.classList.remove('show');
 document.exitPointerLock?.();game.keys?.clear?.();renderPanel();
}
// Prevent movement keys and camera rotation while preparing a potion.
window.addEventListener('keydown',e=>{
 if(!panel.classList.contains('open'))return;
 if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();if(book.classList.contains('open'))book.classList.remove('open');else togglePanel(false);return;}
 if(!e.target?.closest?.('input,textarea,select')&&!['Tab'].includes(e.code)){
  if(['KeyW','KeyA','KeyS','KeyD','Space','ShiftLeft','KeyE','KeyF','KeyL','KeyB'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();}
 }
},true);
const raycaster=new T.Raycaster();const pointer=new T.Vector2();
renderer?.domElement?.addEventListener('pointerdown',e=>{
 if(!workActive||!workCamera||!displayItems.length||book.classList.contains('open'))return;
 const rect=renderer.domElement.getBoundingClientRect();pointer.set((e.clientX-rect.left)/rect.width*2-1,-((e.clientY-rect.top)/rect.height*2-1));
 raycaster.setFromCamera(pointer,workCamera);const hits=raycaster.intersectObjects(displayItems,true);
 if(hits.length){let obj=hits[0].object;while(obj&&!obj.userData.herbId)obj=obj.parent;if(obj?.userData.herbId){chosenHerb=obj.userData.herbId;chosenForm=obj.userData.form;renderPanel();}}
},true);

function isCreative(){return !!window.gameTestMode?.active&&!window.gameSpiderCave?.active;}
function nearStation(){
 if(isCreative())return Math.hypot(game.player.x-PLOT_X,game.player.z-(PLOT_Z+6))<9;
 const site=nearestSurvivalSite(5.2,true);
 if(!site)return false;
 selectSite(site);return true;
}
function nearestPlant(){
 let nearest=null,best=2.45;
 for(const p of state.plots){
  if(!p.available||p.scope!==(isCreative()?'creative':'survival'))continue;
  const v=Math.hypot(game.player.x-p.worldX,game.player.z-p.worldZ);
  if(v<best){best=v;nearest=p;}
 }
 return nearest;
}
function togglePanel(show=!panel.classList.contains('open')){
 if(!activePlay())return;
 if(show){
  book.classList.remove('open');
  if(!nearStation()){const r=nearestRack(3.7,true);if(r){openRack(r);return;}toast('Construa a bancada em Construção (B) e aproxime-se dela.');return;}
  viewKind='bench';chooseClosestSite();
  if(!unlockRecipe(recipes.find(r=>r.id===chosenRecipe))){const known=recipes.find(r=>unlockRecipe(r));if(known)chosenRecipe=known.id;}
  startWorkCamera();
  panel.classList.add('open','work');panel.classList.remove('rack');exitWork.classList.add('show');
  document.exitPointerLock?.();game.keys?.clear?.();renderPanel();
 }else{
  endWorkCamera();panel.classList.remove('open','work','rack');book.classList.remove('open');exitWork.classList.remove('show');
  if(!mobile){try{document.getElementById('c')?.requestPointerLock?.()?.catch?.(()=>{});}catch{}}
 }
}
btn.onclick=()=>togglePanel();
function opts(counts){const a=herbDefs.filter(d=>(counts[d.id]||0)>0);return a.length?a.map(d=>`<option value="${d.id}">${d.name} (${counts[d.id]})</option>`).join(''):'<option value="">Sem ingredientes</option>';}
function countTotal(o){return Object.values(o).reduce((a,b)=>a+b,0);}
function renderPanel(){
 if(!panel.classList.contains('open'))return;
 const scrollPosition=panel.scrollTop;
 syncSurvivalAlchemyInventory();
 const unavailable=state.busy?'disabled':'';
 if(viewKind==='rack'){
  const r=activeRack;const freshChoices=herbDefs.filter(d=>state.fresh[d.id]>0).map(d=>`<button data-hang="${d.id}" ${unavailable}>Pendurar ${d.name}<br>×${state.fresh[d.id]}</button>`).join('');
  panel.innerHTML=`<div class="head"><h2>Varal de secagem</h2><button id="alqClose">✕</button></div><div class="alchemy-callout">1 · Colha flores na floresta.<br>2 · Pendure as flores frescas aqui.<br>3 · Após secar, pressione <b>Retirar planta</b>.<br>4 · Leve a planta seca até a bancada e triture.</div><div class="stat">Ocupados: <b>${r.hanging.length}/5</b> · Tempo: ${isCreative()?'12 segundos':'90 segundos'}</div><h3>Flores frescas no inventário</h3><div class="choices">${freshChoices||'<p>Seu inventário não tem flores frescas. Explore o mapa e colete plantas.</p>'}</div><div class="divider"></div><h3>Flores no varal</h3>${r.hanging.map((h,i)=>`<div class="alq-row"><span>${herbDefs.find(d=>d.id===h.id)?.name||'Planta'} · <b data-rack-clock="${i}">${h.done?'PRONTA PARA RETIRAR':Math.min(100,Math.floor((Date.now()-h.startedAt)/h.duration*100))+'%'}</b></span><button data-take="${i}" ${h.done?'':'disabled'}>Retirar planta</button></div>`).join('')||'<p>Varal vazio. Selecione uma flor acima para pendurar.</p>'}<button id="alqContinue" class="primary">Voltar à floresta</button>`;
  panel.querySelector('#alqClose').onclick=()=>togglePanel(false);panel.querySelector('#alqContinue').onclick=()=>togglePanel(false);
  panel.querySelectorAll('[data-hang]').forEach(b=>b.onclick=()=>hangOnRack(r,b.dataset.hang));
  panel.querySelectorAll('[data-take]').forEach(b=>b.onclick=()=>collectDry(r,+b.dataset.take));panel.scrollTop=scrollPosition;return;
 }
 const recipe=recipes.find(r=>r.id===chosenRecipe)||recipes[0];
 const unlocked=unlockRecipe(recipe);
 const ready=unlocked&&recipe.need.every(id=>state.powder[id]>0);
 const options=herbDefs.filter(h=>state.dry[h.id]>0||state.powder[h.id]>0||state.fresh[h.id]>0||discovered.has(h.id));
 const candidate=[...options].sort((a,b)=>Number(recipe.need.includes(b.id))-Number(recipe.need.includes(a.id)));
 const potions=recipes.filter(r=>invCount('alq_potion_'+r.id)>0);
 const ingredientStatuses=recipe.need.map(id=>{
  const d=herbDefs.find(h=>h.id===id),powder=state.powder[id]||0,dry=state.dry[id]||0,fresh=state.fresh[id]||0;
  const msg=powder?'Pó pronto para misturar':dry?'Erva seca: coloque no pilão e triture':fresh?'Flor fresca: primeiro seque no varal':'Você precisa encontrar ou obter esta planta';
  const cls=powder?'ready':'missing';
  return `<div class="alchemy-progress ${cls}"><b>${d.name}</b><br><small>${msg} · Inventário: ${fresh} fresca / ${dry} seca / ${powder} pó</small></div>`;
 }).join('');
 const needsMore=recipe.need.filter(id=>!state.powder[id]);
 const selectedLabel=herbDefs.find(h=>h.id===chosenHerb)?.name||'Nenhuma planta selecionada';
 panel.innerHTML=`
 <div class="head"><h2>Alquimia · Bancada</h2><button id="alqClose">✕</button></div>
 <button class="primary recipe-main" id="alqBook" type="button">📖 ABRIR LIVRO DE RECEITAS</button>
 <p class="alchemy-quickguide">Primeiro escolha uma receita no livro. Depois siga os passos abaixo. As flores são colocadas no pilão antes de triturar.</p>
 <div class="stat">Bancada: <b>${state.stage>=4?'PRONTA':'EM CONSTRUÇÃO'}</b>${isCreative()&&state.stage<4?' · '+creativeSite.count+'/'+BUILD_ITEMS.length+' peças':''}</div>
 ${isCreative()&&state.stage<4?`<button class="primary" id="alqBuild" ${unavailable}>Encaixar próxima peça da bancada</button>`:''}
 <div class="alchemy-callout"><strong>Poção selecionada:</strong> ${unlocked?recipe.name:'Receita ainda bloqueada'}<br><small>${unlocked?recipe.desc:'Colete espécies novas para revelar fórmulas.'}</small><div class="alchemy-actions"><button id="alqChooseRecipe" class="span2">Ver receitas e escolher poção</button></div></div>
 <div class="alchemy-step active"><b>1 · Ingredientes necessários</b>${unlocked?ingredientStatuses:'<p>Abra o livro, veja as pistas e descubra as plantas relacionadas.</p>'}</div>
 <div class="alchemy-step active"><b>2 · Escolha a planta na mochila</b>
 <div class="alchemy-inventory">${candidate.map(h=>`<button data-plant="${h.id}" class="${chosenHerb===h.id?'selected':''} ${recipe.need.includes(h.id)?'':'muted'}" ${unavailable}>${h.name}<small>${state.fresh[h.id]||0} fresca · ${state.dry[h.id]||0} seca · ${state.powder[h.id]||0} pó</small></button>`).join('')||'<p>Nenhuma flor encontrada. Colha uma flor na floresta ou na arena criativa.</p>'}</div>
 <small class="status">Selecionada: <b>${selectedLabel}</b>. ${state.dry[chosenHerb]>0?'Já pode colocar no pilão.':state.fresh[chosenHerb]>0?'Está fresca. Seque no varal antes de triturar.':'Escolha uma planta seca para triturar.'}</small>
 <div class="alchemy-actions"><button id="alqShowFresh" ${!chosenHerb||!state.fresh[chosenHerb]?'disabled':''}>Ver flor na mesa</button><button id="alqPutDry" ${!chosenHerb||!state.dry[chosenHerb]||state.busy?'disabled':''}>Colocar no pilão</button></div>
 <small class="status">No pilão: <b>${herbDefs.find(h=>h.id===loadedHerb)?.name||'vazio'}</b></small></div>
 <div class="alchemy-step active"><b>3 · Triturar erva seca</b><div class="alchemy-actions"><button class="primary span2" id="alqGrind" ${loadedHerb&&state.dry[loadedHerb]>0&&state.stage>=4&&!state.busy?'':'disabled'}>TRITURAR COM PILÃO</button></div><small class="status">Cada erva seca vira 1 pó. Triture todos os ingredientes da receita.</small></div>
 <div class="alchemy-step active"><b>4 · Misturar e engarrafar</b><div class="alchemy-actions"><button class="primary span2" id="alqBrew" ${state.busy||state.stage<4?'disabled':''}>${ready?'MISTURAR E ENCHER FRASCO':'Ver o que falta para preparar'}</button></div><small class="status">${ready?'Todos os pós estão prontos! Pode misturar.':unlocked&&needsMore.length?'Faltam pós: '+needsMore.map(id=>herbDefs.find(h=>h.id===id).name).join(', '):'Abra o grimório para descobrir a fórmula.'}</small></div>
 <div class="divider"></div><b>Poções prontas no inventário</b>
 ${potions.map(r=>`<div class="alq-row"><span>${r.name} ×${invCount('alq_potion_'+r.id)}</span><button data-use="${r.id}">${r.effect==='fire'?'Aplicar óleo':'Beber poção'}</button></div>`).join('')||'<p>Nenhuma poção engarrafada.</p>'}
 <div class="alchemy-actions"><button id="alqClearTable">Limpar mesa</button><button id="alqContinue" class="primary">Sair da bancada</button></div>`;
 panel.querySelector('#alqClose').onclick=()=>togglePanel(false);
 panel.querySelector('#alqContinue').onclick=()=>togglePanel(false);
 panel.querySelector('#alqBuild')&&(panel.querySelector('#alqBuild').onclick=buildNext);
 panel.querySelector('#alqBook').onclick=()=>showBook('recipes');
 panel.querySelector('#alqChooseRecipe').onclick=()=>showBook('recipes');
 panel.querySelector('#alqClearTable').onclick=()=>{cleanupWorkItems();renderPanel();};
 panel.querySelectorAll('[data-plant]').forEach(b=>b.onclick=()=>{chosenHerb=b.dataset.plant;showHerbOnTable(chosenHerb,'fresh');});
 panel.querySelector('#alqShowFresh').onclick=()=>showHerbOnTable(chosenHerb,'fresh');
 panel.querySelector('#alqPutDry').onclick=()=>putHerbInMortar(chosenHerb);
 panel.querySelector('#alqGrind').onclick=()=>grind(loadedHerb);
 panel.querySelector('#alqBrew').onclick=()=>{
  if(!unlockRecipe(recipe)){toast('Esta fórmula está bloqueada. Descubra as flores e consulte o grimório.');return;}
  const missing=recipe.need.filter(id=>(state.powder[id]||0)<1);
  if(missing.length){toast('Antes de misturar, triture: '+missing.map(id=>herbDefs.find(h=>h.id===id).name).join(' e '));return;}
  brew(recipe.id);
 };
 panel.querySelectorAll('[data-use]').forEach(b=>b.onclick=()=>usePotion(b.dataset.use));
 panel.scrollTop=scrollPosition;
}

const tfpRig=game.trueFirstPerson||null;
const rigBones=tfpRig?.bones||{};
function rigReady(){return !!(tfpRig?.visibleRoot&&rigBones.rArm&&rigBones.rFore&&rigBones.rHand);}
function boneSearch(root,names){
 const wanted=(Array.isArray(names)?names:[names]).map(n=>String(n).toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,''));
 let found=null;
 root?.traverse?.(o=>{
  if(found||!o.isBone)return;
  const n=String(o.name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'');
  if(wanted.includes(n))found=o;
 });
 return found;
}
function fingerChain(prefix){
 return [
  boneSearch(tfpRig?.visibleRoot,`${prefix}1`),
  boneSearch(tfpRig?.visibleRoot,`${prefix}2`),
  boneSearch(tfpRig?.visibleRoot,`${prefix}3`)
 ].filter(Boolean);
}
const alqGripBones=rigReady()?{
 index:fingerChain('RightHandIndex'),
 middle:fingerChain('RightHandMiddle'),
 ring:fingerChain('RightHandRing'),
 pinky:fingerChain('RightHandPinky'),
 thumb:fingerChain('RightHandThumb')
}:{index:[],middle:[],ring:[],pinky:[],thumb:[]};
const alqGripBase=new Map();
for(const chain of Object.values(alqGripBones))for(const b of chain)if(b&&!alqGripBase.has(b))alqGripBase.set(b,b.quaternion.clone());
const _alqV1=new T.Vector3(),_alqV2=new T.Vector3(),_alqQ0=new T.Quaternion();
let alqGripSolver=null;
function restoreAlchemyFingers(){for(const [b,q] of alqGripBase)b.quaternion.copy(q);}
function alqPalmReference(){
 tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
 const wrist=new T.Vector3();
 rigBones.rHand?.getWorldPosition(wrist);
 const i=alqGripBones.index[0]?alqGripBones.index[0].getWorldPosition(new T.Vector3()):wrist.clone();
 const m=alqGripBones.middle[0]?alqGripBones.middle[0].getWorldPosition(new T.Vector3()):wrist.clone();
 const r=alqGripBones.ring[0]?alqGripBones.ring[0].getWorldPosition(new T.Vector3()):m.clone();
 const p=alqGripBones.pinky[0]?alqGripBones.pinky[0].getWorldPosition(new T.Vector3()):wrist.clone();
 const center=wrist.clone().add(i).add(m).add(r).add(p).multiplyScalar(.2);
 return {wrist,index:i,middle:m,ring:r,pinky:p,center};
}
function detectFingerCurl(chain,palmTarget){
 if(!chain?.length)return {axis:new T.Vector3(0,0,1),sign:1};
 const testBone=chain[0], tip=chain[chain.length-1], baseQ=testBone.quaternion.clone();
 let bestAxis=new T.Vector3(0,0,1), bestSign=1, best=Infinity;
 const axes=[new T.Vector3(1,0,0),new T.Vector3(0,1,0),new T.Vector3(0,0,1)];
 for(const axis of axes){
  for(const sign of [-1,1]){
   testBone.quaternion.copy(baseQ).multiply(new T.Quaternion().setFromAxisAngle(axis,.48*sign));
   tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
   const d=tip.getWorldPosition(new T.Vector3()).distanceToSquared(palmTarget);
   if(d<best){best=d;bestAxis=axis.clone();bestSign=sign;}
  }
 }
 testBone.quaternion.copy(baseQ);
 tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
 return {axis:bestAxis,sign:bestSign};
}
function ensureAlchemyGripSolver(){
 if(alqGripSolver)return alqGripSolver;
 restoreAlchemyFingers();
 const palm=alqPalmReference();
 alqGripSolver={
  index:detectFingerCurl(alqGripBones.index,palm.center),
  middle:detectFingerCurl(alqGripBones.middle,palm.center),
  ring:detectFingerCurl(alqGripBones.ring,palm.center),
  pinky:detectFingerCurl(alqGripBones.pinky,palm.center),
  thumb:detectFingerCurl(alqGripBones.thumb,palm.center)
 };
 restoreAlchemyFingers();
 return alqGripSolver;
}
function applyFingerCurl(chain,solver,amounts){
 if(!chain?.length||!solver)return;
 for(let i=0;i<chain.length;i++){
  const b=chain[i], base=alqGripBase.get(b);
  if(!b||!base)continue;
  const amount=amounts[Math.min(i,amounts.length-1)];
  b.quaternion.copy(base).multiply(new T.Quaternion().setFromAxisAngle(solver.axis,solver.sign*amount));
 }
}
function applyAlchemyGrip(kind){
 const s=ensureAlchemyGripSolver();
 if(kind==='pestle'){
  applyFingerCurl(alqGripBones.index,s.index,[.84,.98,.74]);
  applyFingerCurl(alqGripBones.middle,s.middle,[.92,1.05,.80]);
  applyFingerCurl(alqGripBones.ring,s.ring,[.96,1.08,.84]);
  applyFingerCurl(alqGripBones.pinky,s.pinky,[.90,1.02,.80]);
  applyFingerCurl(alqGripBones.thumb,s.thumb,[.62,.72,.54]);
 }else{
  applyFingerCurl(alqGripBones.index,s.index,[.74,.88,.66]);
  applyFingerCurl(alqGripBones.middle,s.middle,[.82,.94,.72]);
  applyFingerCurl(alqGripBones.ring,s.ring,[.86,.98,.76]);
  applyFingerCurl(alqGripBones.pinky,s.pinky,[.80,.92,.72]);
  applyFingerCurl(alqGripBones.thumb,s.thumb,[.56,.66,.50]);
 }
 tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
}
function aimBoneAt(bone,child,target,strength=.9){
 if(!bone||!child)return;
 bone.updateWorldMatrix(true,true);
 child.updateWorldMatrix(true,true);
 const bp=new T.Vector3(),cp=new T.Vector3(),worldQ=new T.Quaternion(),parentQ=new T.Quaternion();
 bone.getWorldPosition(bp);
 child.getWorldPosition(cp);
 bone.getWorldQuaternion(worldQ);
 const current=cp.sub(bp).normalize(), desired=target.clone().sub(bp).normalize();
 if(current.lengthSq()<.5||desired.lengthSq()<.5)return;
 const delta=new T.Quaternion().setFromUnitVectors(current,desired), desiredWorld=delta.multiply(worldQ.clone());
 if(bone.parent)bone.parent.getWorldQuaternion(parentQ); else parentQ.identity();
 const desiredLocal=parentQ.invert().multiply(desiredWorld);
 bone.quaternion.slerp(desiredLocal,strength);
}
function alqArmIK(side,target){
 const arm=side==='left'?rigBones.lArm:rigBones.rArm;
 const fore=side==='left'?rigBones.lFore:rigBones.rFore;
 const hand=side==='left'?rigBones.lHand:rigBones.rHand;
 if(!arm||!fore||!hand)return;
 for(let i=0;i<3;i++){
  aimBoneAt(arm,fore,target,.84);
  aimBoneAt(fore,hand,target,.94);
  tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
 }
}
function playerBasis(){
 const yaw=game.player.bodyYaw??game.player.yaw;
 return {
  forward:new T.Vector3(-Math.sin(yaw),0,-Math.cos(yaw)),
  right:new T.Vector3(Math.cos(yaw),0,-Math.sin(yaw)),
  up:new T.Vector3(0,1,0)
 };
}
function createHeldPestle(){
 const g=new T.Group();
 const shaft=put(new T.CylinderGeometry(.050,.078,.52,12),M.wood,g,[0,-.12,0]);
 shaft.castShadow=true; shaft.receiveShadow=true;
 const head=put(new T.SphereGeometry(.088,14,12),M.wood,g,[0,-.39,0]);
 head.castShadow=true; head.receiveShadow=true;
 g.visible=false;
 game.scene.add(g);
 return g;
}
function createHeldBottle(){
 const g=new T.Group();
 put(new T.CylinderGeometry(.045,.055,.18,12),M.glass,g,[0,.02,0]);
 put(new T.CylinderGeometry(.022,.027,.07,10),M.glass,g,[0,.145,0]);
 put(new T.CylinderGeometry(.028,.032,.03,10),M.rope,g,[0,.195,0]);
 const fill=put(new T.CylinderGeometry(.036,.045,.11,12),new T.MeshStandardMaterial({color:0xb35780,roughness:.25,transparent:true,opacity:.85,emissive:0xb35780,emissiveIntensity:.12}),g,[0,-.005,0]);
 g.userData.fill=fill;
 g.visible=false;
 game.scene.add(g);
 return g;
}
const alqHeld={pestle:createHeldPestle(),bottle:createHeldBottle()};
function setHeldBottleColor(color){const fill=alqHeld.bottle.userData.fill;if(fill){fill.material.color.setHex(color);fill.material.emissive.setHex(color);}}
function hideHeldAlchemy(){alqHeld.pestle.visible=false;alqHeld.bottle.visible=false;}
function saveBonePoses(){
 const list=[rigBones.rArm,rigBones.rFore,rigBones.rHand,rigBones.lArm,rigBones.lFore,rigBones.lHand,...Object.values(alqGripBones).flat()];
 const saved=[];
 for(const b of list)if(b)saved.push({b,q:b.quaternion.clone()});
 return saved;
}
function restoreBonePoses(saved){
 saved?.forEach(o=>o.b?.quaternion.copy(o.q));
 tfpRig?.visibleRoot?.updateMatrixWorld?.(true);
 restoreAlchemyFingers();
}
function positionHeldPestle(bowlWorld){
 const palm=alqPalmReference();
 const axis=bowlWorld.clone().sub(palm.center).normalize();
 const quat=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),axis);
 const gripLocal=new T.Vector3(0,.04,0).applyQuaternion(quat);
 alqHeld.pestle.position.copy(palm.center).sub(gripLocal).addScaledVector(axis,.03);
 alqHeld.pestle.quaternion.copy(quat);
 alqHeld.pestle.visible=true;
}
function positionHeldBottle(tiltEuler){
 const palm=alqPalmReference();
 rigBones.rHand.getWorldQuaternion(_alqQ0);
 const basis=playerBasis();
 const normal=_alqV2.copy(palm.index).sub(palm.pinky).cross(_alqV1.copy(palm.middle).sub(palm.wrist)).normalize();
 const quat=_alqQ0.clone().multiply(new T.Quaternion().setFromEuler(tiltEuler));
 const gripLocal=new T.Vector3(0,.07,0).applyQuaternion(quat);
 alqHeld.bottle.position.copy(palm.center).sub(gripLocal).addScaledVector(basis.forward,.035).addScaledVector(normal,-.010);
 alqHeld.bottle.quaternion.copy(quat);
 alqHeld.bottle.visible=true;
}
async function actionAnimation(mode,duration=1900,color=0xb3a267){
 state.busy=true;renderPanel();
 const canRig=rigReady();
 const savedHeld=window.gameRightHand?.current||null;
 const savedPoses=canRig?saveBonePoses():null;
 const origPestleVisible=pestlePivot.visible;
 const dustPuffs=[];
 const bowlWorld=worldRoot.localToWorld(new T.Vector3(-.58,1.40,.03));
 const vialWorld=worldRoot.localToWorld(new T.Vector3(.68,1.42,-.08));
 const eyeWorld=new T.Vector3();
 if(mode==='pound'){
  pestlePivot.visible=false;
  for(let i=0;i<7;i++){
   const puff=put(new T.IcosahedronGeometry(.03+(i%3)*.01,0),matColor(color),mixture,[0,.15,0]);
   puff.material.transparent=true;
   puff.material.opacity=0;
   puff.visible=false;
   puff.userData={a:i*0.9,r:.07+(i%4)*.04};
   dustPuffs.push(puff);
  }
 }
 try{window.gameRightHand?.unequip?.();}catch(e){}
 setHeldBottleColor(color);
 const start=performance.now();
 try{
  await new Promise(resolve=>{
   function hitCurve(f){if(f<.16)return f/.16;if(f<.28)return 1;return Math.max(0,1-(f-.28)/.72);}
   function anim(t){
    const u=Math.min(1,(t-start)/duration), basis=playerBasis();
    if(canRig){
      savedPoses&&savedPoses.forEach(o=>o.b?.quaternion.copy(o.q));
      tfpRig.visibleRoot.updateMatrixWorld(true);
      if(mode==='pound'){
        const hits=6, cyc=Math.min(hits-.0001,u*hits), frac=cyc%1, stroke=hitCurve(frac), lift=1-stroke;
        const swing=Math.sin((cyc+0.08)*Math.PI*2), sway=Math.cos(cyc*Math.PI*2), impact=Math.max(0,1-Math.abs(frac-.20)/.14);
        const rightTarget=bowlWorld.clone().addScaledVector(basis.right,.18+swing*.02).addScaledVector(basis.forward,.11+sway*.01).addScaledVector(basis.up,.34+lift*.24);
        const leftTarget=bowlWorld.clone().addScaledVector(basis.right,-.20).addScaledVector(basis.forward,.05).addScaledVector(basis.up,.14);
        alqArmIK('right',rightTarget);
        if(rigBones.lArm&&rigBones.lFore&&rigBones.lHand)alqArmIK('left',leftTarget);
        applyAlchemyGrip('pestle');
        positionHeldPestle(bowlWorld.clone().addScaledVector(basis.up,.02));
        mixture.rotation.y+=.028;
        mixture.position.y=impact*.01;
        dustPuffs.forEach((p,i)=>{const a=p.userData.a+cyc*1.1,r=p.userData.r+impact*.05;p.visible=impact>.02;p.material.opacity=.05+impact*.27;p.position.set(Math.cos(a)*r,.15+impact*(.05+i*.003),Math.sin(a)*r);p.scale.setScalar(.65+impact*(1.2+(i%3)*.25));});
      }else if(mode==='build'){
        const arc=Math.sin(u*Math.PI);
        const target=(sitePending?.site?.root?.position||sitePending?.rack?.root?.position||bowlWorld).clone().addScaledVector(basis.up,.7);
        target.addScaledVector(basis.right,.17).addScaledVector(basis.forward,.15);
        alqArmIK('right',target.addScaledVector(basis.up,arc*.07));
        applyAlchemyGrip('pestle');
      }else if(mode==='pour'){
        const arc=Math.sin(u*Math.PI);
        const rightTarget=vialWorld.clone().addScaledVector(basis.right,.15-.03*u).addScaledVector(basis.forward,.14-.05*u).addScaledVector(basis.up,.12+arc*.06);
        alqArmIK('right',rightTarget);
        applyAlchemyGrip('bottle');
        positionHeldBottle(new T.Euler(.20+u*.35,.12+u*.08,.18+u*.95,'XYZ'));
      }else if(mode==='drink'){
        tfpRig.eyeSocket?.getWorldPosition?.(eyeWorld);
        const arc=Math.sin(u*Math.PI);
        const mouth=eyeWorld.clone().addScaledVector(basis.right,.13-.03*u).addScaledVector(basis.up,-.28+arc*.06).addScaledVector(basis.forward,.18-.06*u);
        const rightTarget=eyeWorld.clone().addScaledVector(basis.right,.20-.05*u).addScaledVector(basis.up,-.48+arc*.18+.12*u).addScaledVector(basis.forward,.18-.02*u);
        alqArmIK('right',rightTarget);
        applyAlchemyGrip('bottle');
        positionHeldBottle(new T.Euler(.42+u*.55,-.22*u,.16-u*.72,'XYZ'));
        if(alqHeld.bottle.visible){
          const neck=mouth.clone().sub(alqHeld.bottle.position).multiplyScalar(.22);
          alqHeld.bottle.position.add(neck);
        }
      }
      tfpRig.visibleRoot.updateMatrixWorld(true);
    }
    if(u<1)requestAnimationFrame(anim);else resolve();
   }
   requestAnimationFrame(anim);
  });
 }finally{
  pestlePivot.visible=origPestleVisible;
  mixture.position.y=0;
  dustPuffs.forEach(p=>{p.removeFromParent();p.geometry?.dispose?.();p.material?.dispose?.();});
  hideHeldAlchemy();
  restoreBonePoses(savedPoses);
  if(savedHeld){try{window.gameRightHand?.equip?.(savedHeld);}catch(e){}}
  state.busy=false;
  renderPanel();
 }
}
function attachHarvestVisual(d){const s=new T.Group();game.camera.add(s);s.position.set(-.18,-.2,-.48);const herb=herbLeaf(s,d.id,.5);herb.rotation.x=-.3;setTimeout(()=>{s.removeFromParent();},700);}
function harvestNearest(){
 syncSurvivalAlchemyInventory();
 if(!activePlay())return;
 const p=nearestPlant();
 if(!p){toast('Chegue mais perto de uma planta para coletá-la.');return;}
 if(state.busy)return;
 const item={id:'alq_herba_'+p.id,name:herbDefs.find(d=>d.id===p.id).name+' (fresca)',type:'Erva',quantity:1,weight:.05,description:'Ingrediente fresco. Pendure em um varal independente.'};
 if(!inv.addItem(item)){toast('Inventário cheio: libere espaço antes de colher.');return;}
 discovered.add(p.id);saveAlchemy();
 p.available=false;p.regrow=performance.now()+(isCreative()?8500:180000);p.model.visible=false;p.ring.material.color.setHex(0x5b4a3b);
 state.fresh[p.id]=(state.fresh[p.id]||0)+1;
 attachHarvestVisual(herbDefs.find(d=>d.id===p.id));
 toast('Colhida: '+herbDefs.find(d=>d.id===p.id).name);
 renderPanel();
}
async function buildNext(){
 if(!isCreative()||state.busy)return;
 if(!nearStation()){toast('Chegue à bancada para construir.');return;}
 if(creativeSite.count>=BUILD_ITEMS.length)return;
 selectSite(creativeSite);
 const slot=BUILD_ITEMS[creativeSite.count];
 await actionAnimation('build',580);
 creativeSite.count++;showBuiltItems(creativeSite);
 toast(creativeSite.built?'Bancada construída por completo!':slot.label+' · '+creativeSite.count+'/'+BUILD_ITEMS.length);
 renderPanel();
}
function makeBundle(h,index){return activeRack&&hangBundle(activeRack,h,index)}
function redrawBundles(){if(activeRack)redrawRack(activeRack)}
function hang(id){return hangOnRack(activeRack,id)}
async function grind(id){
 syncSurvivalAlchemyInventory();
 if(!id||loadedHerb!==id){toast('Primeiro selecione a erva seca e clique COLOCAR NO PILÃO.');return;}
 if(!id||!(state.dry[id]>0)){toast('Você precisa de uma erva seca.');return;}
 if(state.stage<4||state.busy)return;
 if(!nearStation()){toast('Aproxime-se do pilão.');return;}
 if(isSurvival()&&!inv.removeItem('alq_dried_'+id,1)){toast('Erva seca não encontrada no inventário.');return;}
 if(loadedVisual){loadedVisual.removeFromParent();const k=displayItems.indexOf(loadedVisual);if(k>=0)displayItems.splice(k,1);}loadedVisual=null;loadedHerb='';
 state.dry[id]--;
 mixture.clear();
 let color=herbDefs.find(x=>x.id===id).color;
 for(let k=0;k<13;k++){
  let a=k*5.1,rad=.04+(k%4)*.06;
  put(new T.IcosahedronGeometry(.04+(k%3)*.012,0),matColor(color),mixture,[Math.cos(a)*rad,.135,Math.sin(a)*rad]);
 }
 const powderAnim=put(new T.CylinderGeometry(.30,.29,.026,18),matColor(color),mixture,[0,.13,0]);powderAnim.material.transparent=true;powderAnim.material.opacity=.8;
 await actionAnimation('pound',2450,color);
 mixture.clear();
 put(new T.CylinderGeometry(.33,.29,.03,18),matColor(color),mixture,[0,.14,0]);
 state.powder[id]=(state.powder[id]||0)+1;
 if(isSurvival())inv.addItem({id:'alq_powder_'+id,name:'Pó de '+herbDefs.find(x=>x.id===id).name,type:'Pó de alquimia',quantity:1,weight:.03,description:'Erva triturada para preparar poções.'});
 toast(herbDefs.find(x=>x.id===id).name+' triturada em pó.');
 showHerbOnTable(id,'powder');
 renderPanel();
}
async function brew(id){
 syncSurvivalAlchemyInventory();
 const r=recipes.find(x=>x.id===id);if(!r||state.busy)return;
 if(state.stage<4){toast('Primeiro conclua a bancada.');return;}
 if(!nearStation()){toast('Aproxime-se da bancada para preparar a mistura.');return;}
 if(!unlockRecipe(r)){toast('Receita bloqueada. Descubra primeiro suas espécies.');return;}
 if(!r.need.every(x=>(state.powder[x]||0)>=1)){toast('Faltam os pós secos indicados na receita.');return;}
 if(isSurvival()&&!r.need.every(h=>invCount('alq_powder_'+h)>0)){toast('Pós ausentes do inventário.');return;}
 for(const h of r.need){state.powder[h]--;if(isSurvival())inv.removeItem('alq_powder_'+h,1);}
 const mat=mixture.children.find(c=>c.material);
 mixture.clear();
 put(new T.CylinderGeometry(.33,.3,.03,16),matColor(r.color),mixture,[0,.135,0]);
 await actionAnimation('pour',1600,r.color);
 vial.drink.material.color.setHex(r.color);vial.drink.material.emissive.setHex(r.color);vial.drink.scale.y=.85;vial.drink.position.y=.135;
 const saved=inv.addItem({id:'alq_potion_'+id,name:'Frasco de '+r.name,type:'Frasco de alquimia',quantity:1,weight:.18,description:'Frasco pronto para uso. '+r.desc});
 if(saved)state.bottles[id]=(state.bottles[id]||0)+1;
 else{for(const h of r.need){state.powder[h]++;if(isSurvival())inv.addItem({id:'alq_powder_'+h,name:'Pó de '+herbDefs.find(d=>d.id===h).name,type:'Pó de alquimia',quantity:1,weight:.03});}}
 toast(saved?'Frasco preparado: '+r.name+'. Adicionado ao inventário.':'Inventário cheio: ingredientes devolvidos.');renderPanel();
}
function attachFireToAxe(){
 const tool=window.gameRightHand;
 if(tool?.current!=='axe'){try{tool?.equip('axe')}catch(e){}}
 const axe=window.gameRightHand?.object;
 if(!axe){toast('Poção criada. Equipe o machado para visualizar as chamas.');return;}
 if(state.fireRoot){state.fireRoot.removeFromParent();state.fireRoot=null;}
 const f=new T.Group();axe.add(f);state.fireRoot=f;
 const box=new T.Box3().setFromObject(axe),center=box.getCenter(new T.Vector3());
 const blade=axe.worldToLocal(center.clone());f.position.copy(blade);
 for(let k=0;k<9;k++){
   const a=k*2.399;const mat=new T.MeshBasicMaterial({color:k%2?0xff5c19:0xffd45b,transparent:true,opacity:.68,depthWrite:false});
   const o=put(new T.ConeGeometry(.06+(k%3)*.028,.29+(k%4)*.12,5),mat,f,[Math.sin(a)*.22,Math.cos(a)*.13,Math.cos(a)*.22]);
   o.userData.fire=true;o.userData.index=k;
 }
 const light=new T.PointLight(0xff6a1a,.75,2.6);f.add(light);
}
async function usePotion(id){
 const r=recipes.find(x=>x.id===id);
 if(!r||state.busy||invCount('alq_potion_'+id)<1)return;
 if(!inv.removeItem('alq_potion_'+id,1))return;
 state.bottles[id]=Math.max(0,(state.bottles[id]||0)-1);
 if(r.effect==='fire'){
  if(workActive)togglePanel(false);
  state.fireUntil=performance.now()+90000;attachFireToAxe();toast('Óleo de brasa: machado flamejante por 90 segundos!');
 }else{
  if(workActive)togglePanel(false);
  await actionAnimation('drink',1650,r.color);
  const amount=Number(r.effect.replace('heal',''))||40;
  window.gameZombie?.healPlayer?.(amount);
  toast(r.name+': +'+amount+' de vida (limitado à vida máxima).');
 }
 renderPanel();
}
document.addEventListener('keydown',e=>{
 if(!activePlay()||e.repeat||state.busy)return;
 const editing=e.target instanceof HTMLElement&&e.target.closest('input,select,textarea');
 if(editing)return;
 if(e.code==='KeyL'){e.preventDefault();e.stopImmediatePropagation();togglePanel();return;}
 if(panel.classList.contains('open'))return;
 if(e.code==='KeyF'&&nearestPlant()){
  e.preventDefault();e.stopImmediatePropagation();harvestNearest();return;
 }
 if(e.code==='KeyE'&&!nearestPlant()){
  const rack=nearestRack(3.5,true);const bench=nearStation();
  if(rack&&(!bench||(isCreative()?rackDistance(rack)<2.4:rackDistance(rack)<survivalDistance(currentSite)))){e.preventDefault();e.stopImmediatePropagation();openRack(rack);return;}
  if(bench){e.preventDefault();e.stopImmediatePropagation();togglePanel(true);}
 }
},true);
let lastUpdate=0;
function loop(now){
 requestAnimationFrame(loop);
 const active=activePlay(),creative=isCreative(),survival=isSurvival();sRoot.visible=creative;
 if(survival){restoreProgress();spawnSurvivalHerbs();}
 for(const site of survivalSites)site.root.visible=survival;
 for(const rack of racks)rack.root.visible=active&&rack.creative===creative;
 if(workActive){game.keys?.clear?.();updateWorkCamera();}
 if(survivalHerbRoot)survivalHerbRoot.visible=survival;
 if(creative)selectSite(creativeSite);else if(survival)chooseClosestSite();
 survivalBuildFrame();
 btn.classList.toggle('show',!panel.classList.contains('open')&&(creative||survival&&nearStation()));
 if(active!==state.active){
  state.active=active;
  if(survival)syncSurvivalAlchemyInventory();
  if(creative&&!state.firstOpen){
   state.firstOpen=true;setTimeout(()=>{toast('Nova estação de ervas: abra ALQUIMIA (L).');},1000);
  }
  if(!active){endWorkCamera();panel.classList.remove('open','work','rack');book.classList.remove('open');exitWork.classList.remove('show');context.classList.remove('show');collectBtn.style.display='none';}
 }
 if(!active)return;
 if(creative)resolveStationCollision();
 for(const p of state.plots){
  if(!p.available&&now>=p.regrow){p.available=true;p.model.visible=true;p.ring.material.color.setHex(herbDefs.find(d=>d.id===p.id).color);}
 }
 for(const rack of racks){
  if(rack.creative!==creative)continue;
  let changed=false;
  rack.hanging.forEach((h,i)=>{
   if(!h.done&&Date.now()-h.startedAt>=h.duration){h.done=true;changed=true;}
   if(h.root){h.root.rotation.z=Math.sin(now*.001+i)*.032;h.root.scale.setScalar(h.done? .82:1-Math.min(.18,Math.max(0,Date.now()-h.startedAt)/h.duration*.18));}
  });
  if(changed){redrawRack(rack);saveAlchemy();if(rack===activeRack)toast('Uma planta terminou de secar. Retire-a do varal.');}
 }
 if(state.fireRoot){
  const rem=state.fireUntil-now;
  state.fireRoot.visible=rem>0;
  if(rem<=0){state.fireRoot.removeFromParent();state.fireRoot=null;}
  else state.fireRoot.children.forEach(o=>{if(o.userData.fire){o.scale.y=.72+Math.abs(Math.sin(now*.009+o.userData.index))*.65;o.material.opacity=.52+Math.abs(Math.sin(now*.014+o.userData.index))*.25;}});
 }
 if(now-lastUpdate>480){
  lastUpdate=now;
  const plant=nearestPlant();
  collectBtn.style.display=plant&&!panel.classList.contains('open')?'block':'none';
  const near=nearStation();
  const rack=nearestRack(3.4,true);
  let msg=plant?'F · Coletar '+herbDefs.find(d=>d.id===plant.id).name:rack&&(!near||rackDistance(rack)<3)?'E · Examinar varal de secagem':near?'E · Abrir bancada de alquimia':creative?'L · Alquimia':'';
  context.textContent=msg;context.classList.toggle('show',!!msg&&!panel.classList.contains('open'));
  if(panel.classList.contains('open')&&viewKind==='rack')refreshRackTimerLabels();
 }
}
requestAnimationFrame(loop);
window.gameHerbalAlchemy={version:VERSION,state,herbs:herbDefs,recipes,root:sRoot,survivalSites,racks,discovered,
 harvest:harvestNearest,build:buildNext,beginSurvivalBuild:startSurvivalPlacement,beginRackBuild:startRackPlacement,placeSurvivalPart,placeRackPart,hang,grind,brew,use:usePotion,open:()=>togglePanel(true),openRack,openBook:()=>showBook('herbarium'),save:saveAlchemy};
console.info('[FLORESTA] V195: bancada POV, varais independentes e grimório integrados');
})();
})();
