

/* FLORESTA V170 — Novas plantas dos pacotes enviados pelo usuário (offline) */
(async function(){
'use strict';
if(window.__V170_BIOMES__)return;window.__V170_BIOMES__=true;
const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
for(let i=0;i<400;i++){
 if(window.gameNewBiomes?.root&&window.__FOREST_GLTF_LOADER&&window.__FBX_MODULE?.FBXLoader&&window.__THREE_MODULE&&window.gameReview?.scene)break;
 await sleep(50);
}
const T=window.__THREE_MODULE,game=window.gameReview,pack=window.__V170_ASSETS__||{};
if(!T||!game?.scene||!window.gameNewBiomes?.root){console.error('[V170] Não foi possível acessar a floresta V169');return;}
const mobile=!!window.__FOREST_MOBILE_BUILD__,world=window.gameNewBiomes.root;
const group=new T.Group();group.name='V170_Plants_Original_Assets';world.add(group);
const state={ready:false,biomes:{},errors:[],preservedOriginalForest:true,daytimeMushrooms:true};
const seed=n=>{n=(n^61)^(n>>>16);n=Math.imul(n,9);n=n^(n>>>4);n=Math.imul(n,0x27d4eb2d);return ((n^(n>>>15))>>>0)/4294967296;};
const ground=(x,z)=>Number(game.groundY(x,z))||0;
const border=(x,z)=>window.__V134_BORDER_MASK__?.(x,z)||0;
const pathway=(x,z)=>window.gameForestV100?.grassFactor?.(x,z)??1;
const decode=key=>Uint8Array.from(atob(pack[key]),c=>c.charCodeAt(0));
const textureCache=new Map();
const tex=key=>{if(textureCache.has(key))return textureCache.get(key);
 const t=new T.Texture();t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.ClampToEdgeWrapping;t.anisotropy=Math.min(4,game.renderer.capabilities.getMaxAnisotropy());
 const im=new Image();im.onload=()=>{t.image=im;t.needsUpdate=true;};im.onerror=()=>state.errors.push('textura '+key);im.src='data:image/webp;base64,'+pack[key];textureCache.set(key,t);return t;
};
const scratch=new T.Object3D();
// Distribuição em clareiras e faixas úmidas, fora de trilhas e montanhas.
function eligible(x,z,minPath=.28){return Math.hypot(x,z)>11&&border(x,z)<.09&&pathway(x,z)>minPath&&Number.isFinite(ground(x,z));}
function placement(kind,count,minR,maxR,geometry,material,desiredHeight,opts={}){
 geometry.computeBoundingBox();const bb=geometry.boundingBox;
 const h=Math.max(.005,bb.max.y-bb.min.y),scale=desiredHeight/h;
 const inst=new T.InstancedMesh(geometry,material,count);inst.name='V170_'+kind;inst.castShadow=false;inst.receiveShadow=true;inst.frustumCulled=false;
 let used=0;
 for(let i=0;i<count;i++){
   const s=(i+1)*8317+kind.length*6259;const r=minR+(maxR-minR)*seed(s+1),a=seed(s+2)*Math.PI*2;
   const x=r*Math.cos(a)+Math.sin(i*4.55)*7,z=r*Math.sin(a)+Math.cos(i*5.15)*6;
   const visible=eligible(x,z,opts.minPath||.28)&&(!opts.lowerGround||ground(x,z)<Math.max(3.8,(ground(x+4,z)+ground(x-4,z)+ground(x,z+4)+ground(x,z-4))/4+1.4));
   const sz=visible?scale*(.7+seed(s+4)*.6):.000001;
   scratch.position.set(x,ground(x,z)+.012,z);scratch.rotation.set(0,seed(s+5)*Math.PI*2,0);scratch.scale.setScalar(sz);scratch.updateMatrix();inst.setMatrixAt(i,scratch.matrix);
   if(visible)used++;
 }
 inst.instanceMatrix.needsUpdate=true;inst.computeBoundingSphere?.();group.add(inst);state.biomes[kind]=used;
 return inst;
}
async function useGLB(key,name,count,height,rmin=20,rmax=120,options={}){
 try{
  const bin=decode(key),loader=new window.__FOREST_GLTF_LOADER();
  const parsed=await new Promise((resolve,reject)=>loader.parse(bin.buffer,'',resolve,reject));
  parsed.scene.updateMatrixWorld(true);
  const meshes=[];parsed.scene.traverse(o=>{if(o.isMesh&&o.geometry?.attributes?.position)meshes.push(o);});
  if(!meshes.length)throw new Error('GLB sem geometria');
  for(let j=0;j<Math.min(3,meshes.length);j++){
   const m=meshes[j],geo=m.geometry.clone();geo.applyMatrix4(m.matrixWorld);geo.computeBoundingBox();
   const bb=geo.boundingBox;geo.translate(-(bb.max.x+bb.min.x)/2,-bb.min.y,-(bb.max.z+bb.min.z)/2);
   const mat=(Array.isArray(m.material)?m.material[0]:m.material).clone();mat.side=T.DoubleSide;
   mat.roughness=Math.max(.75,mat.roughness??1);mat.metalness=0;
   placement(name+(j?'_'+j:''),count,rmin,rmax,geo,mat,height,options);
  }
 }catch(e){state.errors.push(name+': '+e.message);console.error('[V170]',name,e);}
}
async function useFBX(key,name,count,height,materialKeys,opts={}){
 try{
  const data=decode(key),loaded=new window.__FBX_MODULE.FBXLoader().parse(data.buffer,'');
  loaded.updateMatrixWorld(true);
  const box=new T.Box3().setFromObject(loaded),size=new T.Vector3();box.getSize(size);
  if(!Number.isFinite(size.y)||size.y<.001)throw new Error('altura de FBX inválida');
  const center=new T.Vector3();box.getCenter(center);
  const unit=new T.Group();unit.name=name+'_modelo_original';
  // Centraliza o modelo por um pivô externo para evitar deslocamentos quando for redimensionado.
  const aligned=new T.Group();aligned.scale.setScalar(height/size.y);aligned.position.set(-center.x*height/size.y,-box.min.y*height/size.y,-center.z*height/size.y);
  loaded.traverse(o=>{if(!o.isMesh)return;
   const old=Array.isArray(o.material)?o.material[0]:o.material;
   const orig=(old?.name||'').toLowerCase();const isAlt=/default|petal|leaf|folha/i.test(orig);
   const albedo=materialKeys.length>1&&isAlt?materialKeys[1]:materialKeys[0];
   const map=tex(albedo);
   const mat=new T.MeshStandardMaterial({map,side:T.DoubleSide,roughness:1,metalness:0,alphaTest:opts.alphaTest??.12});
   if(opts.glow){mat.emissive=new T.Color(0x265180);mat.emissiveMap=map;mat.emissiveIntensity=.7;}
   if(opts.alphaMask && isAlt){mat.alphaMap=tex(opts.alphaMask);mat.alphaTest=.4;}
   o.material=mat;o.castShadow=false;o.receiveShadow=true;o.frustumCulled=false;
  });
  aligned.add(loaded);unit.add(aligned);
  let placed=0;
  for(let i=0;i<count;i++){
    const h=i*9187+name.length*731,c=seed(h+2)*6.283185,r=(opts.minR??26)+((opts.maxR??115)-(opts.minR??26))*seed(h+3);
    const x=Math.cos(c)*r+Math.cos(i)*5,z=Math.sin(c)*r+Math.sin(i)*5;
    if(!eligible(x,z,.35))continue;
    const inst=unit.clone(true);inst.position.set(x,ground(x,z)+.02,z);inst.rotation.y=seed(h+4)*6.283185;
    inst.scale.setScalar(.75+.4*seed(h+5));group.add(inst);placed++;
  }
  state.biomes[name]=placed;
 }catch(e){state.errors.push(name+': '+e.message);console.error('[V170]',name,e);}
}
// Cartões de planta com atlas PBR REAL do pacote .blend (modelo .blend não carrega no navegador).
// Reconstruímos arbustos, flores e samambaias leves a partir de seus mapas originais.
const bouquet=new T.BufferGeometry();
{
 const p=[],uv=[];
 for(let k=0;k<3;k++){
  const a=k*Math.PI/3,c=Math.cos(a)*.5,s=Math.sin(a)*.5;
  const v=[[-c,0,-s],[c,0,s],[c,1,s],[-c,0,-s],[c,1,s],[-c,1,-s]];
  const u=[[0,0],[1,0],[1,1],[0,0],[1,1],[0,1]];
  for(let i=0;i<6;i++){p.push(...v[i]);uv.push(...u[i]);}
 }
 bouquet.setAttribute('position',new T.Float32BufferAttribute(p,3));bouquet.setAttribute('uv',new T.Float32BufferAttribute(uv,2));bouquet.computeVertexNormals();
}
const bloomTypes=[
 ['flor_vermelha','bloom_red',.55],['flor_violeta','bloom_purple',.56],
 ['flor_azul','bloom_blue',.52],['hibisco','bloom_hibiscus',.9],
 ['samambaia_rasteira','bloom_fern',.74],['folhagem_mista','bloom_brush',.84]
];
const blooms=[];let bloomZoneX=Infinity,bloomZoneZ=Infinity;
for(let i=0;i<bloomTypes.length;i++){
 const [name,key,height]=bloomTypes[i];const count=mobile?45:99;
 const mat=new T.MeshStandardMaterial({map:tex(key),transparent:false,alphaTest:.16,side:T.DoubleSide,roughness:1,metalness:0,depthWrite:true});
 const obj=new T.InstancedMesh(bouquet,mat,count);obj.name='V170_PBR_'+name;obj.frustumCulled=false;obj.castShadow=false;obj.receiveShadow=true;
 group.add(obj);blooms.push({obj,count,key,height,name,i});state.biomes[name]=count;
}
function updateBloom(force=false){const p=game.player;if(!p)return;
 const zoneX=Math.floor(p.x/24),zoneZ=Math.floor(p.z/24);
 if(!force&&zoneX===bloomZoneX&&zoneZ===bloomZoneZ)return;
 bloomZoneX=zoneX;bloomZoneZ=zoneZ;
 for(const b of blooms){
  for(let i=0;i<b.count;i++){
   const cell=i%9,dx=cell%3-1,dz=Math.floor(cell/3)-1;
   const s=((zoneX+dx+2048)*73856093)^((zoneZ+dz+2048)*19349663)^(b.i*83492791)^((i+19)*1274126177);
   const x=(zoneX+dx)*24+seed(s+3)*24,z=(zoneZ+dz)*24+seed(s+8)*24;
   const valid=eligible(x,z,.35)&&seed(s+31)>.25;
   const width=valid?b.height*(.46+seed(s+10)*.55):.000001;
   scratch.position.set(x,ground(x,z)+.018,z);scratch.rotation.set(0,seed(s+17)*Math.PI*2,0);
   scratch.scale.set(width,b.height*(.66+seed(s+13)*.65)*(valid?1:.000001),width);scratch.updateMatrix();b.obj.setMatrixAt(i,scratch.matrix);
  }
  b.obj.instanceMatrix.needsUpdate=true;b.obj.computeBoundingSphere?.();
 }
}
updateBloom(true);
let lastZone=performance.now();
function bloomTick(t){requestAnimationFrame(bloomTick);if(t-lastZone<650)return;lastZone=t;updateBloom();}
requestAnimationFrame(bloomTick);
await Promise.all([
 useGLB('alien_glb','planta_alienigena',mobile?3:7,1.6,26,119),
 useGLB('marine_glb','planta_marinha',mobile?5:11,1.5,23,107,{lowerGround:true,minPath:.38}),
 useFBX('glow_fbx','cogumelo_luminoso',mobile?5:11,.7,['glow_albedo'],{glow:true,alphaTest:.15}),
 useFBX('crimson_fbx','taças_vermelhas',mobile?3:8,1.25,['crimson_pbr','crimson_default'],{alphaMask:'crimson_alpha',alphaTest:.1})
]);
state.ready=true;window.gameV170Flora={version:'V170',state,refresh:()=>updateBloom(true),root:group};
console.info('[V170] Plantas adicionadas',JSON.stringify(state));
})();


