
/* FLORESTA V176 — cogumelos com emboscada + pacotes de ambiente (sem rede)
   Complementa a V168S; nunca altera iluminação, árvores físicas, combate já existente.
*/
(async()=>{
'use strict';
if(window.__V169_NATURE_PACKS__)return;
window.__V169_NATURE_PACKS__=true;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
for(let i=0;i<1400;i++){
 if(window.gameReview?.scene&&window.gameReview?.renderer&&window.gameReview?.groundY&&window.gameReview?.player&&window.gameForestV100?.ready&&window.__THREE_MODULE&&window.__FBX_MODULE?.FBXLoader)break;
 await sleep(30);
}
const game=window.gameReview,T=window.__THREE_MODULE,assets=window.__V169_ASSETS__||{};
if(!game?.scene||!T||!game?.groundY){console.error('[V169] cena indisponível');return;}
const {scene,renderer,player}=game,mobile=!!window.__FOREST_MOBILE_BUILD__;
const root=new T.Group();root.name='V169_Vegetacao_Assets_Originais';scene.add(root);
const props=new T.Group();props.name='V169_Plantas_Tropicais_3D';root.add(props);
const mushroomsRoot=new T.Group();mushroomsRoot.name='V169_Cogumelos_3D';root.add(mushroomsRoot);
const grassRoot=new T.Group();grassRoot.name='V169_Gramados_Digitalizados';root.add(grassRoot);
const monstersRoot=new T.Group();monstersRoot.name='V169_Monstros_Cogumelo_Animados';scene.add(monstersRoot);
const status={grass:0,tropical:0,mushrooms:0,monster:'carregando',errors:[]};
const rseed=n=>{n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return ((n^(n>>>15))>>>0)/4294967296};
const rand=(a,b,c=0)=>a+(b-a)*rseed(c|0);
const clamp=(a,b,c)=>Math.max(b,Math.min(c,a));
const border=(x,z)=>(window.__V134_BORDER_MASK__?.(x,z)||0);
const trail=(x,z)=>window.gameForestV100?.grassFactor?.(x,z)??1;
const gy=(x,z)=>Number(game.groundY(x,z))||0;
async function bytes(b64,gzip=false){const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));if(!gzip)return raw;
 if(typeof DecompressionStream!=='undefined'){
 const ds=new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'));
 return new Uint8Array(await new Response(ds).arrayBuffer());
 }
 if(window.__FFLATE_GUNZIP_SYNC)return window.__FFLATE_GUNZIP_SYNC(raw);
 throw new Error('Descompressor offline gzip indisponível');}
async function untext(key){return new TextDecoder().decode(await bytes(assets[key],true));}
function imageTexture(key){const texture=new T.Texture();texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.ClampToEdgeWrapping;texture.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 const im=new Image();im.onload=()=>{texture.image=im;texture.needsUpdate=true;};im.onerror=()=>{status.errors.push('textura:'+key)};im.src='data:image/webp;base64,'+assets[key];return texture;}
const tmp=new T.Object3D();
// --- Vegetação fotogramétrica: malha de cartões cruzados e InstancedMesh, sem física no caminho ---
function cards(){const verts=[],uvs=[];for(let k=0;k<3;k++){
 const a=k*Math.PI/3,c=Math.cos(a)*.5,s=Math.sin(a)*.5;
 const v=[[-c,0,-s],[c,0,s],[c,1,s],[-c,0,-s],[c,1,s],[-c,1,-s]];
 for(let i=0;i<6;i++){verts.push(...v[i]);uvs.push(...[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]][i]);}
 }const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(verts,3));g.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));g.computeVertexNormals();return g;}
const cardGeo=cards();
const photos=[
 ['grass_clump',1.6,.38,1.1],['grass_reed',1.0,.70,1.4],['ground_cover',1.3,.55,.95],
 ['clover',1.05,.34,.80],['dandelion',.55,.43,.95],['purple_flower',.42,.52,1.05],['leaf_plant',.55,.45,.95]
];
const grassAssets=photos.map(([key,weight,w,h])=>({key,weight,w,h,map:imageTexture(key)}));
function grassMaterial(rec){return new T.MeshStandardMaterial({map:rec.map,transparent:false,alphaTest:.27,side:T.DoubleSide,roughness:1,metalness:0,depthWrite:true,color:0xffffff});}
const photoMats=grassAssets.map(grassMaterial),chunkSize=18,chunkRadius=mobile?1:2;
const clumpPerChunk=mobile?31:58;
const chunks=[];
function getChunk(ix,iz){let c=chunks.find(p=>p.ix===ix&&p.iz===iz);if(c)return c;
 c={ix,iz,group:new T.Group(),meshes:[],records:[]};grassRoot.add(c.group);chunks.push(c);
 for(let kind=0;kind<grassAssets.length;kind++){
  const cnt=kind<2?clumpPerChunk:kind===2?Math.floor(clumpPerChunk*.33):kind<4?Math.floor(clumpPerChunk*.15):Math.floor(clumpPerChunk*.05);
  if(!cnt)continue;
  const mesh=new T.InstancedMesh(cardGeo,photoMats[kind],cnt);mesh.name='V169_'+grassAssets[kind].key;mesh.castShadow=false;mesh.receiveShadow=true;mesh.frustumCulled=true;
  mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);c.group.add(mesh);c.meshes.push({mesh,kind,cnt,records:[]});
 }
 return c;
}
function fillChunk(c,ix,iz){c.ix=ix;c.iz=iz;c.group.position.set(0,0,0);c.group.userData.chunkX=ix;c.group.userData.chunkZ=iz;
 for(const {mesh,kind,cnt,records} of c.meshes){records.length=0;const prop=grassAssets[kind];
  for(let i=0;i<cnt;i++){
   const hash=((ix+1500)*73856093)^((iz+1500)*19349663)^((kind+7)*83492791)^((i+17)*9011);
   const x=ix*chunkSize+(rseed(hash+4)-.5)*chunkSize,z=iz*chunkSize+(rseed(hash+11)-.5)*chunkSize;
   const d=Math.hypot(x,z),f=trail(x,z),avoid=d<5.7||f<.30||border(x,z)>.10||rseed(hash+13)>f;
   let h=prop.h*(.64+rseed(hash+8)*.81),w=prop.w*(.55+rseed(hash+12)*.84);
   if(avoid)h=w=.00001;
   tmp.position.set(x,gy(x,z)+.018,z);tmp.rotation.set(0,rseed(hash+30)*6.283185,0);tmp.scale.set(w,h,w);tmp.updateMatrix();mesh.setMatrixAt(i,tmp.matrix);
   records.push({x,z,i,hash,dead:false,w,h,rotation:tmp.rotation.y});
  }
  mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere?.();
 }
}
let lastCX=Infinity,lastCZ=Infinity,lastBurn=-1,lastBurnKey='';
function updateGrass(force=false){const cx=Math.floor(player.x/chunkSize),cz=Math.floor(player.z/chunkSize);
 if(!force&&cx===lastCX&&cz===lastCZ)return;
 lastCX=cx;lastCZ=cz;
 // pool com reciclagem das 25 regiões; a distribuição é determinística
 const targets=[];for(let dx=-chunkRadius;dx<=chunkRadius;dx++)for(let dz=-chunkRadius;dz<=chunkRadius;dz++)targets.push([cx+dx,cz+dz]);
 const desired=new Set(targets.map(a=>a.join(',')));
 const free=chunks.filter(c=>!desired.has(c.ix+','+c.iz));
 for(const [ix,iz] of targets){if(chunks.some(c=>c.ix===ix&&c.iz===iz))continue;
  const c=free.pop()||getChunk(99999+chunks.length,99999+chunks.length);fillChunk(c,ix,iz);
 }
 status.grass=chunks.reduce((n,c)=>n+c.meshes.reduce((s,m)=>s+m.cnt,0),0);
}
function burnt(){const areas=window.gameGrassModel?.burnedAreas||[];const k=areas.length+':'+areas.slice(-2).map(a=>[a.x,a.z,a.radius,a.intensity].join(',')).join('|');if(k===lastBurnKey)return;
 lastBurnKey=k;for(const ch of chunks)for(const r of ch.meshes){let dirty=false;for(const p of r.records){if(p.dead)continue;
  if(areas.some(a=>Math.hypot(p.x-a.x,p.z-a.z)<(a.radius||a.r||0))){p.dead=true;tmp.position.set(p.x,gy(p.x,p.z),p.z);tmp.scale.setScalar(.00001);tmp.updateMatrix();r.mesh.setMatrixAt(p.i,tmp.matrix);dirty=true;}
 }if(dirty)r.mesh.instanceMatrix.needsUpdate=true;}
}
updateGrass(true);
// --- Modelos tropicais REAIS do pacote OBJ, renderizados em zonas em vez de substituir a floresta ---
function parseOBJ(txt){const vv=[],tt=[],nn=[],positions=[],uv=[],norm=[];
 const lines=txt.split(/\r?\n/);
 for(const line of lines){const parts=line.trim().split(/\s+/);const op=parts[0];
 if(op==='v')vv.push([+parts[1],+parts[2],+parts[3]]);
 else if(op==='vt')tt.push([+parts[1],+parts[2]]);
 else if(op==='vn')nn.push([+parts[1],+parts[2],+parts[3]]);
 else if(op==='f'){
  const face=parts.slice(1).map(p=>p.split('/').map(Number));
  for(let j=1;j<face.length-1;j++)for(const v of [face[0],face[j],face[j+1]]){
   const xyz=vv[v[0]-1]||[0,0,0];positions.push(...xyz);
   const t=tt[v[1]-1]||[0,0];uv.push(...t);
   const n=nn[v[2]-1]||[0,1,0];norm.push(...n);
  }
 }
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));
 if(nn.length)geometry.setAttribute('normal',new T.Float32BufferAttribute(norm,3));else geometry.computeVertexNormals();
 geometry.computeBoundingBox();const b=geometry.boundingBox;geometry.translate(-(b.min.x+b.max.x)*.5,-b.min.y,-(b.min.z+b.max.z)*.5);
 return geometry;
}
const tropicalTypes=[
 ['banana01',3,5],['banana02',3,6],['palm01',1,8],['palm02',1,9],['palm03',1,9],['palm04',1,7],
 ['fern01',12,2.4],['fern02',12,2.2],['bush01',12,2],['monstera01',8,2.5],['monstera02',7,2.5],['tropical_grass01',15,1.1],['tropical_grass02',12,1.4]
];
async function installTropical(){try{
 const mat=new T.MeshStandardMaterial({map:imageTexture('tropical_atlas'),alphaTest:.36,side:T.DoubleSide,roughness:1,metalness:0});
 const geometries={};for(const [kind] of tropicalTypes){if(!assets['obj_'+kind])continue;geometries[kind]=parseOBJ(await untext('obj_'+kind));}
 let placed=0,seed=30641;
 for(let [kind,count,maxHeight] of tropicalTypes){const geo=geometries[kind];if(!geo)continue;
  const box=geo.boundingBox;const h=Math.max(.001,box.max.y-box.min.y),scale=maxHeight/h;
  const inst=new T.InstancedMesh(geo,mat,mobile?Math.max(1,Math.floor(count*.62)):count);
  inst.name='V169_asset_'+kind;inst.castShadow=kind.includes('palm')||kind.includes('banana');inst.receiveShadow=true;inst.frustumCulled=false;
  const cnt=inst.count;for(let i=0;i<cnt;i++){
   // Palmeirais e plantas de sub-bosque aparecem em grupos naturais, em áreas delimitadas.
   const theta=rseed(++seed)*Math.PI*2;
   const region=kind.includes('palm')||kind.includes('banana');
   const radius=region?48+rseed(++seed)*90:15+rseed(++seed)*92;
   const x=Math.cos(theta)*radius+Math.sin(i+seed)*13;
   const z=Math.sin(theta)*radius+Math.cos(i+seed)*13;
   const v=scale*(.77+rseed(++seed)*.52);let vscale=v;
   if(border(x,z)>.15||Math.hypot(x,z)<10||(region&&trail(x,z)<.3))vscale=.000001;
   tmp.position.set(x,gy(x,z),z);tmp.rotation.set(0,rseed(++seed)*Math.PI*2,0);tmp.scale.setScalar(vscale);tmp.updateMatrix();inst.setMatrixAt(i,tmp.matrix);
   if(vscale>.01)placed++;
  }inst.instanceMatrix.needsUpdate=true;props.add(inst);
 }
 status.tropical=placed;
 console.info('[V169] modelos tropicais reais:',placed);
 }catch(e){status.errors.push('tropicais: '+e.message);console.error('[V169] tropical',e);}}
// --- FBX original dos cogumelos: separa meshes reais de sua coleção ---
async function installMushrooms(){try{
 const packed=await bytes(assets['mushrooms_fbx'],true);
 const source=new window.__FBX_MODULE.FBXLoader().parse(packed.buffer,'');
 source.updateMatrixWorld(true);
 const meshes=[];source.traverse(o=>{if(o.isMesh&&!o.isSkinnedMesh&&o.geometry?.attributes?.position?.count>50)meshes.push(o)});
 meshes.sort((a,b)=>a.geometry.attributes.position.count-b.geometry.attributes.position.count);
 const types=[];
 for(const mesh of meshes){if(types.length>=16)break;
  const geo=mesh.geometry.clone();geo.applyMatrix4(mesh.matrixWorld);
  geo.computeBoundingBox();const box=geo.boundingBox,siz=new T.Vector3();box.getSize(siz);
  if(siz.y<.01||siz.y>200||siz.x>200||geo.attributes.position.count>180000)continue;
  geo.translate(-(box.min.x+box.max.x)*.5,-box.min.y,-(box.min.z+box.max.z)*.5);
  const mname=((mesh.material?.name||'')+' '+(mesh.name||'')).toLowerCase();const tex=mname.includes('small')?'mushroom_small':mname.includes('shroms_2')?'mushroom_2':'mushroom_base';
  types.push({geo,tex,height:siz.y,name:mesh.name||'Mushroom'});
 }
 if(!types.length)throw new Error('Nenhuma malha utilizável no FBX');
 const mats={mushroom_small:new T.MeshStandardMaterial({map:imageTexture('mushroom_small'),side:T.DoubleSide,roughness:.88}),mushroom_2:new T.MeshStandardMaterial({map:imageTexture('mushroom_2'),side:T.DoubleSide,roughness:.88}),mushroom_base:new T.MeshStandardMaterial({map:imageTexture('mushroom_base'),side:T.DoubleSide,roughness:.88})};
 let placed=0;
 for(let k=0;k<types.length;k++){
  const rec=types[k],verts=rec.geo.attributes.position.count,number=verts>100000?0:verts>30000?(mobile?1:2):verts>9000?(mobile?2:5):(mobile?4:8);if(!number)continue;const group=new T.InstancedMesh(rec.geo,mats[rec.tex],number);group.name='V169_cogumelo_original_'+k;group.castShadow=false;group.receiveShadow=true;group.frustumCulled=false;
  for(let i=0;i<number;i++){
   const hash=k*7451+i*9277+63879;const radius=15+rseed(hash+1)*98,theta=rseed(hash+2)*6.28318;
   const x=radius*Math.cos(theta),z=radius*Math.sin(theta);
   // A coleção FBX vem com escala variável; equalização por altura, preservando formas originais.
   const desired=(.25+rseed(hash+3)*.62)*(k%7===0?1.8:1),scale=desired/Math.max(.05,rec.height);
   const visible=Math.hypot(x,z)>8&&border(x,z)<.12&&trail(x,z)>.25;
   tmp.position.set(x,gy(x,z)+.015,z);tmp.rotation.set(0,rseed(hash+4)*6.28318,0);tmp.scale.setScalar(visible?scale:.000001);tmp.updateMatrix();group.setMatrixAt(i,tmp.matrix);
   if(visible)placed++;
  }
  group.instanceMatrix.needsUpdate=true;mushroomsRoot.add(group);
 }
 status.mushrooms=placed;console.info('[V169] cogumelos FBX originais',placed,'malhas',types.length);
 }catch(e){status.errors.push('cogumelos: '+e.message);console.error('[V169] mushrooms',e);}}
// --- Inimigo animado autêntico GLB (idle / hop / attack01 / hit / die) ---
// V176: emboscada de cogumelos. Posições fixas no mundo e IA com estados.
const enemies=[];let model=null,clips=[],counter=0,lastAmbientSpawn=0;
const MUSHROOM_AI={wake:9,lose:26,leash:32,returnSpeed:1.48,spawnCell:31};
const defeatedAmbientAnchors=new Set();
function nocturnal(){const h=game.dayNight?.hour;return Number.isFinite(h)?h>=18||h<6:!!window.gameZombie?.active;}
function nearestFacingEnemy(){const direction=new T.Vector3();game.camera.getWorldDirection(direction);direction.y=0;direction.normalize();
 let nearest=null,dist=Infinity;for(const e of enemies){if(!e.alive||e.dying)continue;const x=e.root.position.x-player.x,z=e.root.position.z-player.z,d=Math.hypot(x,z);if(d>3.7||d>=dist)continue;
 if((direction.x*x+direction.z*z)/Math.max(.001,d)<Math.cos(Math.PI*.48))continue;dist=d;nearest=e;}return nearest;}
function play(e,name,fade=.14,loop=true){const act=e.actions[name];if(!act)return 0;
 if(e.playing!==act){e.playing?.fadeOut(fade);act.enabled=true;act.reset().setEffectiveTimeScale(1).setEffectiveWeight(1);
 act.setLoop(loop?T.LoopRepeat:T.LoopOnce,loop?Infinity:1);act.clampWhenFinished=!loop;act.fadeIn(fade).play();e.playing=act;}
 return act.getClip().duration||.8;
}
function hpHit(e,amount){if(!e.alive||e.dying)return false;e.hp-=amount;
 if(e.hp<=0){e.hp=0;e.dying=true;if(e.ambient&&e.anchorId)defeatedAmbientAnchors.add(e.anchorId);play(e,'die',.07,false);e.deadAt=performance.now();}
 else{e.aggro=true;e.returning=false;play(e,'hit',.05,false);e.hitUntil=performance.now()+600;}return true;}
function createEnemy(position=null,options={}){if(!model||enemies.filter(e=>e.alive).length>=(mobile?5:8))return false;
 const obj=(window.__SKELETON_MODULE?.clone?.(model)||model.clone(true)),rootEnemy=new T.Group();rootEnemy.name='V169_Monstro_Cogumelo';
 const offset=obj.userData.modelOffset||{x:0,y:0,z:0};obj.position.set(offset.x,offset.y,offset.z);
 rootEnemy.add(obj);monstersRoot.add(rootEnemy);
 const angle=rseed(7641+(counter++))*6.28318,radius=position?0:16+rseed(counter*771)*12;
 const x=position?.x??player.x+Math.cos(angle)*radius,z=position?.z??player.z+Math.sin(angle)*radius;
 rootEnemy.position.set(x,gy(x,z),z);
 const mixer=new T.AnimationMixer(obj),actions={};clips.forEach(clip=>{actions[clip.name]=mixer.clipAction(clip);});
 const e={root:rootEnemy,mixer,actions,playing:null,hp:95,maxHp:95,alive:true,dying:false,deadAt:0,hitUntil:0,attackAt:0,nextAttack:performance.now()+2000,velocity:0,facingOffset:Math.PI,ambient:!!options.ambient,anchorId:options.anchorId||null,homeX:x,homeZ:z,aggro:false,returning:false,hudKey:'v169:mushroom:'+counter};
 play(e,'idle',0,true);enemies.push(e);window.gameEnemyOverheadUI?.registerExternal?.(e.hudKey,{root:rootEnemy,type:'zombie',name:'Cogumelo Hostil',fallbackHeight:1.8,headGap:.3,getHp:()=>e.hp,getMaxHp:()=>e.maxHp,isAlive:()=>e.alive&&!e.dying});
 return true;
}
function damageNearest(amount){const e=nearestFacingEnemy();if(!e)return false;return hpHit(e,amount);}
window.addEventListener('game:axe-impact',()=>damageNearest(window.gameProgression?.modifyAxeDamage?.(34)??34));
window.addEventListener('game:hammer-impact',()=>damageNearest(52));
// A lança usa a lista compartilhada de alvos do combate principal.
function registerSpearTarget(){const api=window.gameSpecialCreatures;if(!api?.combatTargets||api.__V169_MUSHROOM_TARGETS__)return;const original=api.combatTargets.bind(api);
 api.combatTargets=function(){return [...(original()||[]),...enemies.filter(e=>e.alive&&!e.dying).map(e=>({root:e.root,radius:.60,height:1.0,hit(d){hpHit(e,d)}}))];};api.__V169_MUSHROOM_TARGETS__=true;}

// Inimigos fixos em pontos determinísticos do mapa; aparecem de dia e de noite.
// Só são instanciados à distância para impedir que surjam diante dos olhos do jogador.
function populateAmbientMushrooms(now){
 if(!model||!Number.isFinite(player.x)||!Number.isFinite(player.z)||window.gameTestMode?.active)return;
 const maxDistance=mobile?69:82;
 for(const e of enemies){
  if(e.alive&&e.ambient&&!e.dying&&Math.hypot(player.x-e.root.position.x,player.z-e.root.position.z)>maxDistance){
   e.alive=false;e.root.removeFromParent();e.mixer.stopAllAction();
  }
 }
 const capacity=mobile?3:6,totalLimit=mobile?5:8;
 const totalAlive=enemies.filter(e=>e.alive&&!e.dying).length;
 const ambientAlive=enemies.filter(e=>e.alive&&!e.dying&&e.ambient).length;
 if(ambientAlive>=capacity||totalAlive>=totalLimit||now-lastAmbientSpawn<(mobile?2600:1500))return;
 const cell=MUSHROOM_AI.spawnCell,cx=Math.floor(player.x/cell),cz=Math.floor(player.z/cell),candidates=[];
 for(let ix=cx-3;ix<=cx+3;ix++)for(let iz=cz-3;iz<=cz+3;iz++){
  const hash=Math.imul(ix,73856093)^Math.imul(iz,19349663)^0x169c0;
  if(rseed(hash+21)>.74)continue; // alguns pontos vazios: não povoar toda a floresta
  const x=(ix+.16+.68*rseed(hash+31))*cell,z=(iz+.16+.68*rseed(hash+47))*cell;
  const d=Math.hypot(x-player.x,z-player.z),anchorId=ix+':'+iz;
  if(d<22||d>maxDistance-8||defeatedAmbientAnchors.has(anchorId))continue;
  if(border(x,z)>.09||trail(x,z)<.38||Math.hypot(x,z)<12)continue;
  if(Math.abs(gy(x,z)-gy(x+1,z))>1.7||Math.abs(gy(x,z)-gy(x,z+1))>1.7)continue;
  if(enemies.some(e=>e.alive&&(e.anchorId===anchorId||Math.hypot(x-e.root.position.x,z-e.root.position.z)<12)))continue;
  // A escolha independe da posição do jogador: o mesmo ponto volta a ter o mesmo cogumelo.
  candidates.push({x,z,anchorId,rank:Math.abs(d-35)+rseed(hash+99)*10});
 }
 if(!candidates.length)return;
 candidates.sort((a,b)=>a.rank-b.rank);
 const chosen=candidates[0];
 if(createEnemy({x:chosen.x,z:chosen.z},{ambient:true,anchorId:chosen.anchorId}))lastAmbientSpawn=now;
}
let last=performance.now(),lastUpdate=0;
function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(now-last)/1000||0));last=now;
 if(now-lastUpdate>950){lastUpdate=now;registerSpearTarget();root.visible=!window.gameTestMode?.active;updateGrass();burnt();
   populateAmbientMushrooms(now);
 }
 for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(!e.alive){window.gameEnemyOverheadUI?.removeExternal?.(e.hudKey);enemies.splice(i,1);continue;}
 const near=Math.hypot(player.x-e.root.position.x,player.z-e.root.position.z);
 if(e.dying){e.mixer.update(dt);if(now-e.deadAt>1450){e.alive=false;e.root.removeFromParent();}continue;}
 // Alternância sem telepatia: dor/ataque acordam; sem jogador por perto, fica imóvel.
 const homeDistance=Math.hypot(e.root.position.x-e.homeX,e.root.position.z-e.homeZ);
 if(e.aggro&&(near>MUSHROOM_AI.lose||homeDistance>MUSHROOM_AI.leash)){
  e.aggro=false;e.returning=true;e.attackAt=0;
 }
 if(!e.aggro&&homeDistance<MUSHROOM_AI.leash&&near<MUSHROOM_AI.wake&&!window.gameTestMode?.active){
  e.aggro=true;e.returning=false;
 }
 if(now<e.hitUntil){e.mixer.update(dt);continue;}
 if(e.aggro){
  const yaw=Math.atan2(player.x-e.root.position.x,player.z-e.root.position.z);
  e.root.rotation.y=yaw+(e.facingOffset||0);
  if(e.attackAt){
   e.mixer.update(dt);
   if(now-e.attackAt>e.attackDuration*550&&!e.dealt){e.dealt=true;if(near<2.0)window.gameZombie?.hurtPlayer?.(12,'Cogumelo Hostil','mushroom');}
   if(now-e.attackAt>e.attackDuration*1000){e.attackAt=0;play(e,'idle',.08,true);e.nextAttack=now+1900+rseed((i+now)|0)*1400;}
   continue;
  }
  if(near<1.85&&now>e.nextAttack){e.attackDuration=play(e,'attack01',.08,false)||1.1;e.attackAt=now;e.dealt=false;continue;}
  if(near>1.55&&!window.gameTestMode?.active){
   play(e,'hop',.10,true);const speed=1.38;
   const x=e.root.position.x+Math.sin(yaw)*speed*dt,z=e.root.position.z+Math.cos(yaw)*speed*dt;
   if(border(x,z)<.3)e.root.position.set(x,gy(x,z),z);
  }else play(e,'idle',.10,true);
  e.mixer.update(dt);continue;
 }
 if(e.returning){
  const dx=e.homeX-e.root.position.x,dz=e.homeZ-e.root.position.z,distance=Math.hypot(dx,dz);
  if(distance<.32){e.root.position.set(e.homeX,gy(e.homeX,e.homeZ),e.homeZ);e.returning=false;play(e,'idle',.15,true);}
  else{
   const yaw=Math.atan2(dx,dz);e.root.rotation.y=yaw+(e.facingOffset||0);
   play(e,'hop',.12,true);
   const step=Math.min(distance,MUSHROOM_AI.returnSpeed*dt);
   const x=e.root.position.x+dx/distance*step,z=e.root.position.z+dz/distance*step;
   if(border(x,z)<.3)e.root.position.set(x,gy(x,z),z);
  }
 }else play(e,'idle',.15,true);
 e.mixer.update(dt);
 }
}
async function installMonster(){try{
 for(let i=0;i<700&&!window.__FOREST_GLTF_LOADER;i++)await sleep(50);
 if(!window.__FOREST_GLTF_LOADER)throw new Error('Leitor de GLB não exposto');
 const raw=await bytes(assets['monster_glb'],false);
 const result=await new Promise((resolve,reject)=>new window.__FOREST_GLTF_LOADER().parse(raw.buffer,'',resolve,reject));
 clips=result.animations;model=result.scene;
 const b=new T.Box3().setFromObject(model);const sz=new T.Vector3();b.getSize(sz);
 if(sz.y<.001)throw new Error('modelo sem altura válida');
 const factor=1.55/sz.y;model.scale.multiplyScalar(factor);model.updateMatrixWorld(true);
 const b2=new T.Box3().setFromObject(model);const cen=new T.Vector3();b2.getCenter(cen);
 model.userData.modelOffset={x:-cen.x,y:-b2.min.y,z:-cen.z};
 model.traverse(o=>{if(o.isMesh||o.isSkinnedMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
 status.monster='pronto';
 window.gameMushroomMonster={ready:true,get enemies(){return enemies;},spawn:createEnemy,hit:damageNearest,forceSpawn:()=>createEnemy({x:player.x+4,z:player.z+4}),clips:clips.map(c=>c.name)};
  // Integração por botão de spawn independente do despacho original de monstros.
 const quick=document.querySelector('#directorPanel .director-quick');if(quick&&!quick.querySelector('[data-v169-mushroom]')){
 const btn=document.createElement('button');btn.type='button';btn.textContent='+1 Cogumelo Hostil';btn.dataset.v169Mushroom='1';btn.addEventListener('click',()=>createEnemy());quick.appendChild(btn);}
 console.info('[V169] monstro cogumelo GLB animado',clips.map(c=>c.name));
 }catch(e){status.monster='erro: '+e.message;status.errors.push('monstro: '+e.message);console.error('[V169] monstro',e);
 window.gameMushroomMonster={ready:false,error:e.message};}}
window.gameNewBiomes={version:'V170-PC-DAYTIME-MUSHROOMS',root,stats:status,update:updateGrass,reset:()=>updateGrass(true),get monster(){return window.gameMushroomMonster;}};
requestAnimationFrame(loop);
await Promise.all([installTropical(),installMushrooms(),installMonster()]);
console.info('[V169] resumo:',status);
})();

