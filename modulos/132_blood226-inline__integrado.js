
/* FLORESTA V228 — sangue volumétrico + ferimentos aderidos à pele animada.
   Não altera dano, câmera, físicas, animações ou controles. PC e Mobile. */
(()=>{
'use strict';
if(window.gameBlood226)return;
const KEY='floresta-sangue-v226', levels={desligado:0,reduzido:.55,normal:1,intenso:1.45};
let quality='normal';
try { const v=localStorage.getItem(KEY); if(Object.hasOwn(levels,v))quality=v; } catch(_){}
const clamp=(a,l,h)=>Math.min(h,Math.max(l,a));
const mobile=window.__CAVE_PLATFORM==='mobile'||(matchMedia('(pointer:coarse)').matches&&innerWidth<950);
const LIMIT_PARTICLES=mobile?120:210,LIMIT_STAINS=mobile?60:110,LIMIT_WOUNDS=mobile?10:16;
let G=null,T=null,scene=null,ready=false,dropMesh,stainMesh,stainDummy,dropDummy,last=0,lastSample=0;
let woundTex=null,stainTex=null,dropCursor=0,stainCursor=0,hitMemory=null,menu=null;
let particleArr=[],stainArr=[],wounds=[],enemyPresent=new Set(),playerWoundCounter=0;
let playerHpPrev=NaN;
const geometryCache=new WeakMap();
const enemiesSeen=new WeakMap();
const stats={hits:0,playerWounds:0,visibleDecals:0,drops:0,marks:0,tracked:0,frames:0};
const nowS=()=>performance.now()*.001;
function q(){return levels[quality]||0;}
function active(){return ready&&!document.body?.classList.contains('f172-front') &&
 !window.gameFront172?.paused && !window.gameSpiderCave?.active &&
 !window.gameEditor210?.active&&!window.gameWorkshopEditor?.active&&!window.gameWorkshop?.active;}
function texture(w,h,paint){const c=document.createElement('canvas');c.width=w;c.height=h;paint(c.getContext('2d'),w,h);const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.magFilter=T.LinearFilter;t.minFilter=T.LinearMipmapLinearFilter;t.anisotropy=2;return t;}
function createWoundTexture(){return texture(256,256,(x)=>{
 const g=x.createRadialGradient(128,109,6,128,128,102);
 g.addColorStop(0,'rgba(95,0,0,.42)');g.addColorStop(.38,'rgba(109,2,7,.35)');g.addColorStop(.68,'rgba(65,0,0,.13)');g.addColorStop(1,'rgba(60,0,0,0)');
 x.fillStyle=g;x.fillRect(0,0,256,256);
 // Sangue acumulado irregular, com borda escura, não um círculo chapado.
 x.save();x.translate(128,109);x.rotate(-.16);
 const pool=x.createRadialGradient(0,0,4,0,0,69);
 pool.addColorStop(0,'rgba(96,0,0,.93)');pool.addColorStop(.48,'rgba(116,0,6,.79)');pool.addColorStop(.85,'rgba(80,0,0,.34)');pool.addColorStop(1,'rgba(80,0,0,0)');
 x.fillStyle=pool;x.beginPath();x.ellipse(0,0,70,30,0,0,Math.PI*2);x.fill();
 x.strokeStyle='rgba(39,0,2,.95)';x.lineWidth=9;x.lineCap='round';
 x.beginPath();x.moveTo(-44,8);x.bezierCurveTo(-25,-14,-10,17,9,1);x.bezierCurveTo(25,-11,33,10,46,-9);x.stroke();
 x.strokeStyle='rgba(175,15,23,.87)';x.lineWidth=3.2;
 x.beginPath();x.moveTo(-39,10);x.bezierCurveTo(-18,-9,-9,21,10,5);x.bezierCurveTo(26,-5,37,12,43,-6);x.stroke();
 x.restore();
 // Corridas de líquido inseridas na própria pele (UV), não sprites soltos.
 for(const [ox,oy,len,w] of [[108,133,81,7],[145,131,57,5],[128,130,98,4]]){
   let lg=x.createLinearGradient(ox,oy,ox,oy+len);lg.addColorStop(0,'rgba(112,0,4,.82)');lg.addColorStop(.45,'rgba(90,0,3,.53)');lg.addColorStop(1,'rgba(85,0,3,0)');
   x.strokeStyle=lg;x.lineWidth=w;x.lineCap='round';
   x.beginPath();x.moveTo(ox,oy);x.bezierCurveTo(ox+4,oy+len*.26,ox-4,oy+len*.62,ox+1,oy+len);x.stroke();
 }
 // Pequeno reflexo molhado.
 x.strokeStyle='rgba(238,52,63,.42)';x.lineWidth=2.6;x.beginPath();x.moveTo(102,96);x.quadraticCurveTo(126,89,153,99);x.stroke();
});}
function createStainTexture(){return texture(160,160,(x)=>{
 const g=x.createRadialGradient(78,73,1,80,80,69);
 g.addColorStop(0,'rgba(128,2,8,.9)');g.addColorStop(.44,'rgba(104,0,3,.86)');g.addColorStop(.72,'rgba(62,0,3,.51)');g.addColorStop(.92,'rgba(48,0,1,.14)');g.addColorStop(1,'rgba(30,0,0,0)');
 x.fillStyle=g;x.beginPath();x.ellipse(80,80,68,51,.23,0,Math.PI*2);x.fill();
 for(const [cx,cy,r] of [[39,77,11],[58,116,7],[124,63,12],[119,112,8],[93,33,6]]){
  x.fillStyle='rgba(86,0,3,.50)';x.beginPath();x.ellipse(cx,cy,r,r*.7,0,0,Math.PI*2);x.fill();
 }
 const shine=x.createLinearGradient(0,47,0,82);shine.addColorStop(0,'rgba(220,75,76,0)');shine.addColorStop(.5,'rgba(230,86,88,.42)');shine.addColorStop(1,'rgba(245,90,90,0)');
 x.fillStyle=shine;x.beginPath();x.ellipse(72,56,22,5,-.26,0,Math.PI*2);x.fill();
});}
function init(){
 if(ready)return true;
 G=window.gameReview;T=window.__THREE_MODULE;
 if(!G?.scene||!G?.player||!T?.InstancedMesh||!G?.trueFirstPerson?.localMesh)return false;
 try {
  scene=G.scene;
  woundTex=createWoundTexture();stainTex=createStainTexture();
  dropMesh=new T.InstancedMesh(new T.SphereGeometry(1,7,5),new T.MeshStandardMaterial({color:0xffffff,roughness:.23,metalness:.04,emissive:0x2a0103,emissiveIntensity:.32}),LIMIT_PARTICLES);
  dropMesh.name='V228_GotasVolume3D';dropMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);dropMesh.frustumCulled=false;dropMesh.renderOrder=8;
  dropDummy=new T.Object3D();
  for(let i=0;i<LIMIT_PARTICLES;i++){
    particleArr.push({active:false,x:0,y:0,z:0,vx:0,vy:0,vz:0,life:0,r:0,dark:false});
    dropDummy.position.set(0,-9000,0);dropDummy.scale.set(0,0,0);dropDummy.updateMatrix();dropMesh.setMatrixAt(i,dropDummy.matrix);
    dropMesh.setColorAt(i,new T.Color(0x92090c));
  }
  dropMesh.instanceMatrix.needsUpdate=true;dropMesh.instanceColor.needsUpdate=true;scene.add(dropMesh);
  stainMesh=new T.InstancedMesh(new T.PlaneGeometry(1,1),new T.MeshBasicMaterial({map:stainTex,color:0xffffff,transparent:true,alphaTest:.025,opacity:.88,depthTest:true,depthWrite:false,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2}),LIMIT_STAINS);
  stainMesh.name='V228_PocasLiquidas';stainMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);stainMesh.frustumCulled=false;stainMesh.renderOrder=4;
  stainDummy=new T.Object3D();
  for(let i=0;i<LIMIT_STAINS;i++){
   stainArr.push({active:false,born:0,until:0,x:0,y:0,z:0,sx:0,sy:0,rot:0});
   stainDummy.position.set(0,-9000,0);stainDummy.scale.set(0,0,0);stainDummy.updateMatrix();stainMesh.setMatrixAt(i,stainDummy.matrix);
  }
  stainMesh.instanceMatrix.needsUpdate=true;scene.add(stainMesh);
  ready=true;return true;
 }catch(e){console.warn('V228: não iniciou o sangue:',e);return false;}
}
function setQuality(v){if(!Object.hasOwn(levels,v))return false;quality=v;
 try{localStorage.setItem(KEY,v)}catch(_){};if(menu){const el=menu.querySelector('select');if(el)el.value=v;}
 if(!q())reset();return true;}
function hideDrop(i){const p=particleArr[i];p.active=false;dropDummy.position.set(0,-9000,0);dropDummy.scale.set(0,0,0);dropDummy.updateMatrix();dropMesh.setMatrixAt(i,dropDummy.matrix);}
function hideStain(i){stainDummy.position.set(0,-9000,0);stainDummy.scale.set(0,0,0);stainDummy.updateMatrix();stainMesh.setMatrixAt(i,stainDummy.matrix);}
function removeWound(w){if(w.mesh){w.mesh.removeFromParent();w.mesh.geometry.dispose();w.mesh.material.dispose();w.mesh=null;}const i=wounds.indexOf(w);if(i>=0)wounds.splice(i,1);stats.visibleDecals=wounds.length;}
function reset(){if(!ready)return;for(let i=0;i<LIMIT_PARTICLES;i++)hideDrop(i);dropMesh.instanceMatrix.needsUpdate=true;
 for(let i=0;i<LIMIT_STAINS;i++){stainArr[i].active=false;hideStain(i);}stainMesh.instanceMatrix.needsUpdate=true;
 for(const w of [...wounds])removeWound(w);}
function drop(x,y,z,vx=0,vy=0,vz=0,small=.018,dark=false){
 if(!ready||!q()||![x,y,z].every(Number.isFinite))return;
 const i=dropCursor++%LIMIT_PARTICLES,p=particleArr[i];p.active=true;
 p.x=x;p.y=y;p.z=z;p.vx=vx;p.vy=vy;p.vz=vz;p.life=1.5;p.r=clamp(small,.009,.038);p.dark=dark;
 const col=new T.Color(dark?0x37030c:0x990809);col.multiplyScalar(.8+Math.random()*.3);dropMesh.setColorAt(i,col);
 stats.drops++;if(dropMesh.instanceColor)dropMesh.instanceColor.needsUpdate=true;
}
function spray(x,y,z,source,amount,dark=false){
 if(!ready||!q())return;
 let vx=x-(source?.x??x),vz=z-(source?.z??z),len=Math.hypot(vx,vz)||1;
 vx/=len;vz/=len;
 const n=Math.min(mobile?10:15,Math.max(3,Math.round((4+Math.min(8,amount*.15))*q())));
 for(let i=0;i<n;i++){
  const speed=.3+Math.random()*1.25;
  drop(x+(Math.random()-.5)*.08,y+(Math.random()-.5)*.08,z+(Math.random()-.5)*.08,
  vx*speed+(Math.random()-.5)*.65, .15+Math.random()*1.2, vz*speed+(Math.random()-.5)*.65,
  .013+Math.random()*.013,dark);
 }
 stats.hits++;
}
function stain(x,z,mag=.06){
 const ground=Number(G.groundY?.(x,z));if(!Number.isFinite(ground))return;
 const i=stainCursor++%LIMIT_STAINS,m=stainArr[i],now=nowS();
 m.active=true;m.born=now;m.until=now+(mobile?13:22);
 m.x=x;m.y=ground+.016;m.z=z;m.sx=clamp(mag*(.85+Math.random()*.32),.028,.19);m.sy=m.sx*(.70+Math.random()*.24);m.rot=Math.random()*6.283;
 stainDummy.position.set(m.x,m.y,m.z);stainDummy.rotation.set(-Math.PI/2,0,m.rot);stainDummy.scale.set(m.sx,m.sy,1);stainDummy.updateMatrix();
 stainMesh.setMatrixAt(i,stainDummy.matrix);stainMesh.instanceMatrix.needsUpdate=true;stats.marks++;
}
function updateDroplets(dt){
 let changed=false;
 for(let i=0;i<LIMIT_PARTICLES;i++){
  const p=particleArr[i];if(!p.active)continue;
  changed=true;p.life-=dt;
  if(p.life<=0){hideDrop(i);continue;}
  p.vy-=9.81*dt;p.vx*=Math.exp(-1.6*dt);p.vz*=Math.exp(-1.6*dt);
  const y0=p.y;p.x+=p.vx*dt;p.y+=p.vy*dt;p.z+=p.vz*dt;
  const gy=Number(G.groundY?.(p.x,p.z));
  if(Number.isFinite(gy)&&p.y<=gy+.02 && y0>=gy-.06){stain(p.x,p.z,p.r*4);hideDrop(i);continue;}
  if(p.y< -200){hideDrop(i);continue;}
  dropDummy.position.set(p.x,p.y,p.z);dropDummy.rotation.set(0,0,0);
  const elongation=clamp(Math.abs(p.vy)*.15,1,2.2);dropDummy.scale.set(p.r,p.r*elongation,p.r);dropDummy.updateMatrix();dropMesh.setMatrixAt(i,dropDummy.matrix);
 }
 if(changed)dropMesh.instanceMatrix.needsUpdate=true;
 }
function updateStains(now){let changed=false;
 for(let i=0;i<LIMIT_STAINS;i++){
  const m=stainArr[i];if(!m.active)continue;
  const remains=m.until-now;if(remains<=0){m.active=false;hideStain(i);changed=true;continue;}
  if(remains<3){let f=clamp(remains/3,0,1);stainDummy.position.set(m.x,m.y,m.z);stainDummy.rotation.set(-Math.PI/2,0,m.rot);stainDummy.scale.set(m.sx*f,m.sy*f,1);stainDummy.updateMatrix();stainMesh.setMatrixAt(i,stainDummy.matrix);changed=true;}
 }
 if(changed)stainMesh.instanceMatrix.needsUpdate=true;
}
// Build an actual deformed-mesh decal. Each triangle keeps the original body's skin
// weights, so the wound follows the very same skinning as the moving human.
function getCache(surface){
 const g=surface?.geometry; if(!g?.getAttribute('position'))return null;
 const reused=geometryCache.get(g);if(reused)return reused;
 const pos=g.getAttribute('position'),normal=g.getAttribute('normal'),idx=g.getIndex(),weight=g.getAttribute('skinWeight'),skin=g.getAttribute('skinIndex');
 const n=idx?idx.count:pos.count, faces=[];g.computeBoundingBox();
 const sz=g.boundingBox.getSize(new T.Vector3()),height=Math.max(sz.y,0.1);
 for(let j=0;j<n-2;j+=3){
  const a=idx?idx.getX(j):j,b=idx?idx.getX(j+1):j+1,c=idx?idx.getX(j+2):j+2;
  const aa=new T.Vector3().fromBufferAttribute(pos,a),bb=new T.Vector3().fromBufferAttribute(pos,b),cc=new T.Vector3().fromBufferAttribute(pos,c);
  const center=aa.clone().add(bb).add(cc).multiplyScalar(1/3);
  const norm=cc.clone().sub(bb).cross(aa.clone().sub(bb)).normalize();
  if(!Number.isFinite(norm.x)||norm.lengthSq()<.2)continue;
  faces.push({a,b,c,center,norm});
 }
 const obj={surface,faces,pos,normal,idx,weight,skin,height,bbox:g.boundingBox};
 geometryCache.set(g,obj);
 return obj;
}
function meshVertexWorld(mesh,index,out){
 out.fromBufferAttribute(mesh.geometry.getAttribute('position'),index);
 if(mesh.isSkinnedMesh&&typeof mesh.applyBoneTransform==='function')mesh.applyBoneTransform(index,out);
 return mesh.localToWorld(out);
}
function chooseFace(mesh,cache,bone=null,near=null){
 if(!cache?.faces.length)return null;
 mesh.updateWorldMatrix(true,false);
 const candidates=[],isBody=!!bone;
 let boneIndex=-1;
 if(bone&&mesh.skeleton)boneIndex=mesh.skeleton.bones.indexOf(bone);
 if(isBody&&boneIndex<0)return null;
 const cam=G.camera,worldCam=cam.getWorldPosition(new T.Vector3());cam.updateMatrixWorld(true);
 const faceCount=cache.faces.length;
 const step=Math.max(1,Math.floor(faceCount/4500));
 const sk=cache.skin,wt=cache.weight;
 for(let i=0;i<faceCount;i+=step){
  const f=cache.faces[i];
  if(boneIndex>=0){
   let weight=0;
   for(const id of [f.a,f.b,f.c])for(let k=0;k<Math.min(4,sk?.itemSize||0);k++){
    if(sk.getComponent(id,k)===boneIndex)weight+=wt.getComponent(id,k);
   }
   if(weight<1.2)continue;
  }
  if(near){
   const v=new T.Vector3();meshVertexWorld(mesh,f.a,v);
   if(v.distanceToSquared(near)>2.0)continue;
  }
  candidates.push(f);
 }
 if(!candidates.length)return null;
 let best=null,bestScore=-Infinity;
 const ntries=Math.min(isBody?200:90,candidates.length);
 const v1=new T.Vector3(),v2=new T.Vector3(),v3=new T.Vector3();
 for(let k=0;k<ntries;k++){
  const f=candidates[Math.floor(Math.random()*candidates.length)];
  meshVertexWorld(mesh,f.a,v1);meshVertexWorld(mesh,f.b,v2);meshVertexWorld(mesh,f.c,v3);
  const center=v1.clone().add(v2).add(v3).multiplyScalar(1/3);
  const normal=v3.clone().sub(v2).cross(v1.clone().sub(v2)).normalize();
  const toCam=worldCam.clone().sub(center),length=toCam.length();
  if(length<.12 || length>6.0)continue;
  const facing=normal.dot(toCam.normalize());
  const screen=center.clone().project(cam);
  if(isBody&&(Math.abs(screen.x)>1.7||Math.abs(screen.y)>1.7))continue;
  // Prefer front-facing and reasonably close skin areas, not the back side of arms.
  let score=facing*2.2-Math.max(0,length-2)*.35;
  if(near)score-=center.distanceTo(near)*2.2;
  if(isBody){
   score-=Math.max(0,Math.abs(screen.x)-.85)*1.2;
   score-=Math.max(0,Math.abs(screen.y)-.9)*.8;
   // First-person player generally sees the front of the torso only when looking down.
  }
  score+=Math.random()*.25;
  if(facing<-.10)score-=4;
  if(score>bestScore){bestScore=score;best={face:f,center,normal};}
 }
 return best;
}
function createSkinWound(surface,selection,opts={}){
 if(!surface||!selection||!woundTex)return null;
 const cache=getCache(surface);if(!cache?.faces.length)return null;
 const {face,center:worldCenter}=selection;
 const base=face.center,N=face.norm.clone();
 const up=new T.Vector3(0,1,0);let tangent=up.clone().cross(N);
 if(tangent.lengthSq()<.02)tangent=new T.Vector3(1,0,0).cross(N);
 tangent.normalize();let bitangent=N.clone().cross(tangent).normalize();
 // Force downwards direction of the blood trail according to gravity in the bind pose.
 const worldDown=new T.Vector3(0,-1,0).transformDirection(surface.matrixWorld).normalize();
 if(bitangent.dot(worldDown)<0)bitangent.negate();
 tangent=bitangent.clone().cross(N).normalize();
 const rad=cache.height*(opts.enemy?.036:opts.arm?.036:.045);
 const radSq=rad*rad*2.1;
 const p=cache.pos,n=cache.normal,sk=cache.skin,wt=cache.weight;
 const P=[],normals=[],UV=[],SK=[],WT=[];
 const offset=cache.height*.00065;
 let tris=0;
 for(const f of cache.faces){
  const d=f.center.clone().sub(base);
  if(d.lengthSq()>radSq||Math.abs(d.dot(N))>rad*.65||f.norm.dot(N)<.32)continue;
  for(const id of [f.a,f.b,f.c]){
   const v=new T.Vector3().fromBufferAttribute(p,id);
   const vn=n?new T.Vector3().fromBufferAttribute(n,id):f.norm.clone();
   P.push(v.x+vn.x*offset,v.y+vn.y*offset,v.z+vn.z*offset);
   normals.push(vn.x,vn.y,vn.z);
   const delta=v.sub(base);
   // Canvas top = wound cut, bottom = streak (Three UV origin is bottom left).
   UV.push(.5+delta.dot(tangent)/(rad*2),.5-delta.dot(bitangent)/(rad*2));
   if(surface.isSkinnedMesh){for(let t=0;t<4;t++){SK.push(sk?.getComponent(id,t)??0);WT.push(wt?.getComponent(id,t)??(t===0?1:0));}}
  }
  if(++tris>=720)break;
 }
 if(tris<1)return null;
 const geom=new T.BufferGeometry();
 geom.setAttribute('position',new T.Float32BufferAttribute(P,3));
 geom.setAttribute('normal',new T.Float32BufferAttribute(normals,3));
 geom.setAttribute('uv',new T.Float32BufferAttribute(UV,2));
 if(surface.isSkinnedMesh){geom.setAttribute('skinIndex',new T.Uint16BufferAttribute(SK,4));geom.setAttribute('skinWeight',new T.Float32BufferAttribute(WT,4));}
 geom.computeBoundingSphere();
 const mat=new T.MeshBasicMaterial({map:woundTex,color:opts.dark?0xb06d70:0xffffff,transparent:true,opacity:.98,alphaTest:.018,depthTest:true,depthWrite:false,side:T.DoubleSide,polygonOffset:true,polygonOffsetFactor:-3,toneMapped:false});
 const decal=surface.isSkinnedMesh?new T.SkinnedMesh(geom,mat):new T.Mesh(geom,mat);
 decal.name='V228_FeridaAderidaPele';decal.position.copy(surface.position);decal.quaternion.copy(surface.quaternion);decal.scale.copy(surface.scale);
 decal.layers.mask=surface.layers.mask;decal.frustumCulled=false;decal.renderOrder=6;
 if(surface.isSkinnedMesh){decal.bindMode=surface.bindMode;decal.bind(surface.skeleton,surface.bindMatrix);}
 if(!surface.parent){geom.dispose();mat.dispose();return null;}
 surface.parent.add(decal);
 const w={mesh:decal,surface,face:[face.a,face.b,face.c],player:!!opts.player,source:opts.source||null,dark:!!opts.dark,
 born:nowS(),expires:nowS()+(opts.player?3600:10),next:nowS()+.25+Math.random()*.35,lastDrop:0};
 wounds.push(w);stats.visibleDecals=wounds.length;
 return w;
}
function playerSurface(){return G?.trueFirstPerson?.localMesh||null;}
function addPlayerWound(damage){
 const mesh=playerSurface();if(!mesh)return false;
 const bones=G.trueFirstPerson.bones||{};
 const choices=[bones.lFore,bones.rFore,bones.spine2,bones.lArm,bones.rArm,bones.spine1].filter(Boolean);
 const maxPlayer=mobile?4:5;
 const yours=wounds.filter(w=>w.player);
 if(yours.length>=maxPlayer)removeWound(yours[0]);
 const cache=getCache(mesh);if(!cache)return false;
 let sel=null,bone=null;
 for(let i=0;i<choices.length;i++){
  const b=choices[(playerWoundCounter+i)%choices.length];
  const found=chooseFace(mesh,cache,b);
  if(found){sel=found;bone=b;playerWoundCounter+=i+1;break;}
 }
 if(!sel)return false;
 const arm=/arm|fore|hand/i.test(bone?.name||'');
 return !!createSkinWound(mesh,sel,{player:true,arm});
}
function onPlayerDamaged(e){
 const damage=Number(e?.detail?.damage)||0;
 if(damage<=.01||!init()||!q())return;
 addPlayerWound(damage);
 // Respingo de impacto discreto, não uma fonte contínua deslocada do braço.
 const wound=[...wounds].reverse().find(w=>w.player);
 if(wound){const pos=woundPosition(wound);if(pos){spray(pos.x,pos.y,pos.z,{x:G.player.x,y:pos.y,z:G.player.z},Math.min(24,damage*.35),false);}}
 playerHpPrev=Number(e.detail?.playerHp);stats.playerWounds++;
}
function woundPosition(w){
 const mesh=w?.surface;if(!mesh?.parent||!mesh.geometry)return null;
 mesh.updateWorldMatrix(true,false);
 const v=new T.Vector3(),result=new T.Vector3();
 for(let i=0;i<3;i++){meshVertexWorld(mesh,w.face[i],v);result.add(v);}
 return result.multiplyScalar(1/3);
}
function updateWounds(now){
 const hp=Number(window.gameZombie?.playerHp),max=Math.max(1,Number(window.gameZombie?.maxPlayerHp)||100);
 const injured=Number.isFinite(hp)&&hp<max-.05;
 const justHealed=Number.isFinite(hp)&&Number.isFinite(playerHpPrev)&&hp>=max-.05&&playerHpPrev<max-.05;
 playerHpPrev=hp;
 for(const w of [...wounds]){
  if(!w.mesh||!w.surface?.parent||(w.player&&!injured)||(justHealed&&w.player)||(now>=w.expires)||(!w.player&&w.source?.alive===false)){
   removeWound(w);continue;
  }
  if(!w.player&&!enemyPresent.has(w.source)&&now>w.born+3){removeWound(w);continue;}
  if(now<w.next)continue;
  const severity=w.player?clamp((max-hp)/max,.1,1):.55;
  w.next=now+(w.player?(.7+Math.random()*1.1)/(0.65+severity):1.3+Math.random()*2.2)/clamp(q(),.45,1.5);
  const p=woundPosition(w);
  if(!p)continue;
  if(w.player&&Math.random()>.78)continue;
  drop(p.x,p.y-.018,p.z,(Math.random()-.5)*.07,-.07,(Math.random()-.5)*.07,.012+Math.random()*.007,w.dark);
 }
}
function collectTargets(){
 const out=[],seenRoots=new Set();
 const add=(object,root,hp,maxhp,type,valid=true,scale=1)=>{
  if(!object||!root||seenRoots.has(root))return;
  if((!valid||root.visible===false)&&!enemiesSeen.has(object))return;
  const n=Number(hp);if(!Number.isFinite(n))return;
  seenRoots.add(root);out.push({object,root,hp:n,max:Number(maxhp)||100,type:String(type||'').toLowerCase(),scale});
 };
 for(const z of window.gameZombie?.zombies||[])add(z,z.root,z.hp,z.maxHp,'zombie',z.alive);
 for(const e of window.gameSpecialCreatures?.all||[])add(e,e.root,e.hp,e.maxHp,e.type,e.alive);
 for(const e of window.gameUndeadForces?.all||[])add(e,e.g||e.root,e.hp,e.maxHp,e.isSkeleton?'skeleton':e.type||e.kind,e.alive);
 for(const [b,type,size] of [
  [window.gameWerewolf,'werewolf',1.5],[window.gameGiantBoss,'gigante',5],
  [window.gameMartialBoss,'martial',1.4],[window.gameBarrelLumberjack,'barrel',1.3],
  [window.gameDemonBoss,'trolloc',2.5],[window.gameIgnis,'ignis',3.5]
 ])if(b)add(b,b.root||b.model,b.hp,b.maxHp,type,b.active!==false&&b.alive!==false&&b.state!=='DEAD'&&b.state!=='HIDDEN',size);
 return out;
}
function bloodType(type){
 if(/ignis|fire|fogo|skeleton|esqueleto|centaur|caveira|skull|phantom|fantasma|elemental|^war$|^cent$|^fire$/i.test(type))return 'none';
 if(/eye|olho|nocturne|noturno|trolloc|necromancer/i.test(type))return 'dark';
 return 'red';
}
function enemyHit(target,loss){
 const {root,scale,type}=target,blood=bloodType(type);if(blood==='none')return;
 root.updateWorldMatrix(true,false);
 const base=root.getWorldPosition(new T.Vector3()),p=G.player;
 const toward=new T.Vector3(p.x-base.x,0,p.z-base.z).normalize();
 const hit=base.clone().addScaledVector(toward,clamp(scale*.19,.12,.6)).add(new T.Vector3(0,clamp(.75*scale,.5,4.5),0));
 if(hitMemory&&performance.now()-hitMemory.time<200&&hitMemory.position){
  const h=hitMemory.position;if(Math.hypot(h.x-base.x,h.z-base.z)<Math.max(2,scale*1.6))hit.set(h.x,h.y,h.z);
 }
 spray(hit.x,hit.y,hit.z,p,loss,blood==='dark');
 // If the monster has a mesh, pin a real surface wound to it; otherwise spray only.
 if(wounds.filter(w=>w.source===target.object).length<2){
  let mesh=null;
  root.traverse?.(o=>{if(!mesh&&(o.isSkinnedMesh||o.isMesh)&&o.geometry?.getAttribute('position'))mesh=o;});
  if(mesh&&(mesh.geometry.getIndex()?.count||mesh.geometry.getAttribute('position')?.count||0)<85000){const cache=getCache(mesh),sel=chooseFace(mesh,cache,null,hit);
    if(sel)createSkinWound(mesh,sel,{enemy:true,source:target.object,dark:blood==='dark'});
  }
 }
}
function sampleEnemies(now){
 if(now-lastSample<(mobile?.12:.085))return;lastSample=now;
 const targets=collectTargets();enemyPresent.clear();
 for(const target of targets){
  const o=target.object;enemyPresent.add(o);
  const old=enemiesSeen.get(o);
  if(old&&target.hp<old.hp-.01&&now-old.last>.11){enemyHit(target,old.hp-target.hp);old.last=now;}
  if(!old)enemiesSeen.set(o,{hp:target.hp,last:0});
  else{if(target.hp>old.hp)old.last=0;old.hp=target.hp;}
 }
 stats.tracked=targets.length;
}
function beforeRender(){
 if(!ready&&!init())return;
 if(!active()||!q()){last=0;return;}
 const now=nowS(),dt=last?clamp(now-last,.002,.055):.016;last=now;stats.frames++;
 sampleEnemies(now);updateWounds(now);updateDroplets(dt);
 if(stats.frames%4===0)updateStains(now);
}
function attachMenu(){
 if(menu||!document.getElementById('h171Drawer'))return;
 menu=document.createElement('section');menu.id='v226BloodMenu';
 menu.style.cssText='margin:14px 8px;padding:12px 14px;border:1px solid #7b342a77;background:#160f0d85;border-radius:10px;color:#e6c8b8;font:12px/1.5 system-ui;';
 menu.innerHTML='<div style="font:bold 13px Georgia;letter-spacing:1px;margin-bottom:7px;color:#dab39d">SANGUE E FERIMENTOS · V228</div><label style="display:flex;align-items:center;gap:12px;justify-content:space-between">Quantidade de sangue <select aria-label="Quantidade de sangue" style="max-width:140px;background:#221a15;color:#f0d2c4;border:1px solid #735347;padding:6px"><option value="desligado">Desligado</option><option value="reduzido">Reduzido</option><option value="normal">Normal</option><option value="intenso">Intenso</option></select></label><small style="display:block;opacity:.7;margin-top:6px">Feridas coladas à pele animada • gotas em 3D • marcas líquidas no chão.</small>';
 document.getElementById('h171Drawer').appendChild(menu);
 menu.querySelector('select').value=quality;
 menu.querySelector('select').addEventListener('change',e=>setQuality(e.target.value));
}
addEventListener('game:player-damaged',onPlayerDamaged);
for(const name of ['game:axe-impact','game:hammer-impact'])addEventListener(name,e=>{hitMemory={time:performance.now(),position:e.detail?.position||null};});
let tries=0;
const timer=setInterval(()=>{if(init()){attachMenu();clearInterval(timer);}else if(++tries>900)clearInterval(timer);},150);
window.gameBlood226={version:'V228',beforeRender,setQuality,
 get active(){return ready;},get quality(){return quality;},get stats(){return {...stats,wounds:wounds.length}},reset,
 testDamage(amount=12){onPlayerDamaged({detail:{damage:amount,playerHp:Number(window.gameZombie?.playerHp)||65}});}
};
})();

