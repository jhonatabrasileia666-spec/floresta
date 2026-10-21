
window.__FOREST_MOBILE_BUILD__=window.__CAVE_PLATFORM==='mobile';
/* Floresta V113 — local, deterministic, no network or external assets.
 * Existing 220 tree indices are retained for lumber / giant boss interactions.
 * Ground uses the game's height function. Decorative plants do not obstruct travel.
 */
(async function forestEnvironment(){
'use strict';
for(let i=0;!window.gameLumber||!window.gameGrassModel;i++){if(i>2400)return;await new Promise(r=>setTimeout(r,25));}
const mobile=!!window.__FOREST_MOBILE_BUILD__;
const T=window.__THREE_MODULE,g=window.gameReview,scene=g.scene,renderer=g.renderer;
const root=new T.Group();root.name='Forest_V100';scene.add(root);
const owned=new Set(),originals=[],uniforms={time:{value:0}},tmp=new T.Object3D();
let seed=180093,disposed=false;const rand=()=>((seed=Math.imul(seed,1664525)+1013904223>>>0)/4294967296);
const clamp=(v,a=0,b=1)=>Math.max(a,Math.min(b,v));
function own(o){owned.add(o);return o;}
function texture(canvas,srgb=true){const t=own(new T.CanvasTexture(canvas));t.colorSpace=srgb?T.SRGBColorSpace:T.NoColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=Math.min(8,renderer.capabilities.getMaxAnisotropy());return t;}
function canvas(size){const c=document.createElement('canvas');c.width=c.height=size;return c;}
function hash(x,z){const v=Math.sin(x*127.1+z*311.7)*43758.5453;return v-Math.floor(v);}
const trees=window.gameLumber.trees;
let trunks,crowns,ground;scene.traverse(o=>{if(o.isInstancedMesh&&o.count===220&&o.geometry.parameters?.height>6)trunks=o;if(o.isInstancedMesh&&o.count===660)crowns=o;if(o.isMesh&&o.geometry.parameters?.width===180&&o.geometry.parameters?.height===180)ground=o;});
if(!trunks||!crowns||!ground){console.error('[Forest V100] Required original meshes missing');return;}
function replace(mesh,geometry,material){originals.push({mesh,geometry:mesh.geometry,material:mesh.material});if(geometry)mesh.geometry=own(geometry);if(material)mesh.material=own(material);}
// Route through the original collision layout. A small graph search avoids trees
// and rocks rather than drawing a trail straight through a collider.
function createTrail(){
 const obstacles=g.colliders||trees.map(t=>({x:t.base.x,z:t.base.z,r:t.radiusBottom}));
 const points=[{x:0,z:12}];let last=0,velocity=0;
 for(let z=10;z>=-76;z-=1.5){let best=last,bestCost=Infinity;const desired=3*Math.sin(z*.067)+1.5*Math.sin(z*.19);
  for(let x=last-1.1;x<=last+1.11;x+=.11){let cost=.2*(x-desired)**2+3*(x-last-velocity*.7)**2;
   for(const o of obstacles){const d=Math.hypot(x-o.x,z-o.z);if(d<3)cost+=35*Math.max(0,2.0+(o.r||.4)-d)**2;}
   if(cost<bestCost){bestCost=cost;best=x;}}
  velocity=best-last;last=best;points.push({x:last,z});}
 const c=canvas(1024),ctx=c.getContext('2d');ctx.fillStyle='#000';ctx.fillRect(0,0,1024,1024);ctx.lineCap='round';ctx.lineJoin='round';
 const draw=(width,color)=>{ctx.strokeStyle=color;ctx.lineWidth=width/180*1024;ctx.beginPath();points.forEach((p,i)=>{const x=(p.x+90)/180*1024,y=(p.z+90)/180*1024;i?ctx.lineTo(x,y):ctx.moveTo(x,y)});ctx.stroke();};
 for(let i=20;i>=0;i--)draw(1.35+i*.075,`rgb(${Math.round(255*(1-i/24))},${Math.round(255*(1-i/24))},${Math.round(255*(1-i/24))})`);
 const map=texture(c,false);map.flipY=false;map.wrapS=map.wrapT=T.ClampToEdgeWrapping;
 function distance(x,z){let best=1e5;for(let i=1;i<points.length;i++){const a=points[i-1],b=points[i],dx=b.x-a.x,dz=b.z-a.z,u=clamp(((x-a.x)*dx+(z-a.z)*dz)/(dx*dx+dz*dz));best=Math.min(best,Math.hypot(x-a.x-u*dx,z-a.z-u*dz));}return best;}
 return {points,map,distance};
}
const trail=createTrail();
const noiseGLSL=`
float fhash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float fnoise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(fhash(i),fhash(i+vec2(1,0)),f.x),mix(fhash(i+vec2(0,1)),fhash(i+1.),f.x),f.y);}
float ffbm(vec2 p){return fnoise(p)*.55+fnoise(p*2.03)*.27+fnoise(p*4.11)*.13+fnoise(p*8.21)*.05;}
`;
function surface(material,type,wind=0){
 material.onBeforeCompile=s=>{
  s.uniforms.fTime=uniforms.time;s.uniforms.fTrail={value:trail.map};
  s.vertexShader='varying vec3 fWorld;varying vec3 fLocal;uniform float fTime;\n'+s.vertexShader;
  s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>
fLocal=position;
vec4 fp=vec4(transformed,1.);
#ifdef USE_INSTANCING
fp=instanceMatrix*fp;
#endif
fWorld=(modelMatrix*fp).xyz;
${wind?`transformed.x+=sin(fTime*.82+fWorld.x*.37+fWorld.z*.24)*${wind.toFixed(3)}*smoothstep(-.3,1.8,position.y);transformed.z+=cos(fTime*.67+fWorld.z*.31)*${(wind*.43).toFixed(3)}*smoothstep(-.3,1.8,position.y);`:''}`);
  s.fragmentShader='varying vec3 fWorld;varying vec3 fLocal;uniform sampler2D fTrail;\n'+noiseGLSL+s.fragmentShader;
  let code='';
  if(type==='soil')code=`vec2 q=fWorld.xz;float broad=ffbm(q*.38),fine=fnoise(q*19.);float wear=texture2D(fTrail,(q+90.)/180.).r;wear=smoothstep(.22,.78,wear+(fnoise(q*3.1)-.5)*.28);
vec3 earth=mix(vec3(.095,.071,.044),vec3(.25,.18,.108),broad);float moss=smoothstep(.49,.71,ffbm(q*.55+21.));earth=mix(earth,mix(vec3(.046,.067,.020),vec3(.105,.14,.042),fine),moss*.88);
vec3 path=mix(vec3(.115,.082,.051),vec3(.235,.174,.105),broad);diffuseColor.rgb=mix(earth,path,wear)*(.76+fine*.46);float leaf=step(.89,fnoise(q*9.2))*step(.50,fnoise(q*2.));diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.25,.17,.075),leaf*.4);`;
  if(type==='bark')code=`float damp=1.-smoothstep(-6.8,-4.9,fLocal.y);float moss=smoothstep(.42,.68,ffbm(fWorld.xz*8.+fWorld.yy*.62))*damp;diffuseColor.rgb*=.77+ffbm(fWorld.xz*.8)*.45;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.055,.083,.023),moss*.75);`;
  if(type==='rock')code=`float n=ffbm(fWorld.xz*2.+fWorld.yy*.6);diffuseColor.rgb*=.6+n*.65;float moss=smoothstep(.43,.72,n)*smoothstep(.0,.65,fLocal.y);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.078,.11,.027),moss*.85);`;
  if(type==='grass')code=`float trailWear=texture2D(fTrail,(fWorld.xz+90.)/180.).r;if(trailWear>.48+fnoise(fWorld.xz*3.7)*.42)discard;diffuseColor.rgb*=.82+.25*fhash(floor(fWorld.xz*.21));`;
  if(type==='leaf')code=`diffuseColor.rgb*=.74+.35*fhash(floor(fWorld.xz*.21));`;
  s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>','#include <color_fragment>\n'+code);
  if(type==='soil')s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>','#include <roughnessmap_fragment>\nroughnessFactor=mix(.69,.98,ffbm(fWorld.xz*.7));').replace('#include <normal_fragment_maps>','#include <normal_fragment_maps>\nnormal=normalize(normal+vec3((fnoise(fWorld.xz*37.)-.5)*.17,0.,(fnoise(fWorld.zx*31.)-.5)*.17));');
 };
 material.customProgramCacheKey=()=>`forest100-${type}-${wind}`;
 return material;
}
function createGround(){replace(ground,null,surface(new T.MeshStandardMaterial({color:0xffffff,roughness:1}),'soil'));ground.name='Forest_Soil_And_Trail';}
function createBark(){
 const c=canvas(512),ctx=c.getContext('2d'),im=ctx.createImageData(512,512),heights=new Float32Array(512*512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){
  const seam=Math.abs(Math.sin(x*.12+Math.sin(y*.022+x*.009)*1.5));
  const grain=hash(x,y),ridge=Math.pow(seam,.36),fracture=Math.pow(Math.abs(Math.sin(y*.10+x*.16+Math.sin(x*.071)*5)),.18);
  const cellX=(x+Math.sin(y*.027)*5)/13,cellY=(y+Math.sin(x*.061)*13)/29;const ex=Math.abs((cellX-Math.floor(cellX))-.5)*2,ey=Math.abs((cellY-Math.floor(cellY))-.5)*2;const plate=.38+hash(Math.floor(cellX),Math.floor(cellY))*.24;const groove=(ex>.89||ey>.94)?.64:1;const v=(plate+ridge*.12*fracture+grain*.12)*groove;const i=y*512+x;heights[i]=v;im.data.set([v*137,v*136,v*122,255],i*4);
 }
 ctx.putImageData(im,0,0);const n=canvas(512),nc=n.getContext('2d'),ni=nc.createImageData(512,512);
 for(let y=0;y<512;y++)for(let x=0;x<512;x++){const h=heights[y*512+x],dx=h-heights[y*512+(x+1)%512],dy=h-heights[(y+1)%512*512+x],len=Math.hypot(dx*3,dy*3,1);ni.data.set([128+127*dx*3/len,128+127*dy*3/len,128+127/len,255],(y*512+x)*4);}nc.putImageData(ni,0,0);
 const map=texture(c),normalMap=texture(n,false);map.repeat.set(2,7);normalMap.repeat.copy(map.repeat);
 return surface(new T.MeshStandardMaterial({map,normalMap,normalScale:new T.Vector2(.8,.8),color:0xffffff,roughness:.95}),'bark');
}
// An atlas made of individual needles on woody twigs, not solid green polygons.
function createFoliageAtlas(){
 const c=canvas(512),ctx=c.getContext('2d');
 function twig(x,y,len,ang,depth){const ex=x+Math.cos(ang)*len,ey=y+Math.sin(ang)*len;ctx.strokeStyle=depth?'#53503a':'#63503a';ctx.lineWidth=depth?1.7:3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(ex,ey);ctx.stroke();
  for(let t=.12;t<1;t+=.026){const px=x+(ex-x)*t,py=y+(ey-y)*t;for(const s of [-1,1]){const a=ang+s*(.50+rand()*.55),l=(8+rand()*14)*(1-t*.35);ctx.strokeStyle=['#5e7043','#728151','#455c35','#31482a'][Math.floor(rand()*4)];ctx.lineWidth=1.6+rand()*.7;ctx.beginPath();ctx.moveTo(px,py);ctx.lineTo(px+Math.cos(a)*l,py+Math.sin(a)*l);ctx.stroke();}}
  if(!depth)for(let t=.18;t<.96;t+=.12)for(const side of [-1,1])twig(x+(ex-x)*t,y+(ey-y)*t,len*(.30*(1-t)+.11),ang+side*(.48+rand()*.4),1);
 }
 for(let i=0;i<4;i++)twig(255+(i-1.5)*14,475,365+rand()*45,-Math.PI/2+(i-1.5)*.21,0);
 return texture(c);
}
function geometryBuilder(){const p=[],uv=[],idx=[];return {
 quad(a,b,c,d){const n=p.length/3;for(const v of[a,b,c,d])p.push(...v);uv.push(0,0,1,0,1,1,0,1);idx.push(n,n+1,n+2,n,n+2,n+3);},
 tri(a,b,c){const n=p.length/3;p.push(...a,...b,...c);uv.push(0,0,1,0,.5,1);idx.push(n,n+1,n+2);},
 finish(){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(p,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(idx);geo.computeVertexNormals();geo.computeBoundingSphere();return geo;}};}
function createCrownGeometry(){const b=geometryBuilder();for(let i=0;i<(mobile?26:46);i++){
 const a=i*2.39996,y=(i%5)*.51-1.3,len=2.1+rand()*1.9,r=.28+rand()*.32;const dx=Math.cos(a),dz=Math.sin(a),w=.45+rand()*.34;
 const bx=dx*r,bz=dz*r,ex=dx*len,ez=dz*len,ey=y-.25+rand()*.42;
 b.quad([bx-dz*w*.18,y,bz+dx*w*.18],[bx+dz*w*.18,y,bz-dx*w*.18],[ex+dz*w,ey,ez-dx*w],[ex-dz*w,ey,ez+dx*w]);
 // Tilted spray crossing gives volume when looking up from ground level.
 b.quad([bx,y-.10,bz],[bx,y+.12,bz],[ex,ey+.52,ez],[ex,ey-.22,ez]);
 }return b.finish();}
function createBranches(){const b=geometryBuilder();for(let i=0;i<18;i++){
 const a=i*2.3999,y=2.0+(i%7)*.56,dx=Math.cos(a),dz=Math.sin(a),len=1.1+rand()*1.1,r=.026+rand()*.025;
 b.quad([-.10*dz,y,.10*dx],[.10*dz,y,-.10*dx],[dx*len+dz*r,y+.30,dz*len-dx*r],[dx*len-dz*r,y+.30,dz*len+dx*r]);
 b.quad([0,y-.07,0],[0,y+.07,0],[dx*len,y+.33,dz*len],[dx*len,y+.27,dz*len]);
 }const geo=own(b.finish()),mat=own(new T.MeshStandardMaterial({color:0x534a39,roughness:1,side:T.DoubleSide}));const mesh=new T.InstancedMesh(geo,mat,220);mesh.name='Forest_Branches_Attached';mesh.instanceMatrix.setUsage(T.DynamicDrawUsage);mesh.frustumCulled=false;mesh.castShadow=true;root.add(mesh);return mesh;}
let branches;
function createTrees(){
 const bark=createBark();const geo=new T.CylinderGeometry(.28,.44,13.6,12,10);const p=geo.attributes.position;
 for(let i=0;i<p.count;i++){const y=p.getY(i),bottom=1-clamp((y+6.8)/1.0),x=p.getX(i),z=p.getZ(i),a=Math.atan2(z,x),rootFlare=1+bottom*bottom*(.65+.35*Math.sin(a*5));p.setXYZ(i,x*rootFlare+Math.sin((y+6.8)*.31)*.047,y,z*rootFlare+Math.sin((y+6.8)*.52)*.038);}geo.computeVertexNormals();
 replace(trunks,geo,bark);trunks.name='Forest_Lumber_Trunks';
 const leaves=surface(new T.MeshStandardMaterial({map:createFoliageAtlas(),color:0xc5d4ae,emissive:0x26351b,emissiveIntensity:.18,alphaTest:.36,side:T.DoubleSide,roughness:1}),'leaf',.055);
 replace(crowns,createCrownGeometry(),leaves);crowns.name='Forest_Lumber_Canopies';crowns.castShadow=false;crowns.receiveShadow=true;
 branches=createBranches();
 // Existing lumber creates cut stumps/logs from its original cloned material.
 // Copy the new maps to those material clones as well, preserving gameplay metadata.
 const rockGeometry=new T.IcosahedronGeometry(1,2);const rp=rockGeometry.attributes.position;for(let j=0;j<rp.count;j++){const x=rp.getX(j),y=rp.getY(j),z=rp.getZ(j),k=1+.075*Math.sin(x*8+y*5+z*3);rp.setXYZ(j,x*k,y*k,z*k);}rockGeometry.computeVertexNormals();const rockMaterial=surface(new T.MeshStandardMaterial({color:0x8b8f80,roughness:.94}),'rock');
 scene.traverse(o=>{if(o.isMesh&&o!==trunks&&o.material?.isMeshStandardMaterial&&o.parent===trunks.parent&&o.geometry?.type==='DodecahedronGeometry'&&o.geometry.parameters?.radius===1){replace(o,rockGeometry,rockMaterial);}});
}
function fernGeometry(){const b=geometryBuilder();for(let f=0;f<9;f++){const a=f*2.3999,len=.65+rand()*.35,dx=Math.cos(a),dz=Math.sin(a);for(let j=1;j<10;j++){
 const t=j/10,r=len*t,y=.10+Math.sin(t*Math.PI*.85)*.44,l=(1-t)*.22+.018;
 for(const side of[-1,1]){const x=dx*r,z=dz*r,ex=x-dz*l*side+dx*.08,ez=z+dx*l*side+dz*.08;b.quad([x,y,z],[x+dx*.018,y+.013,z+dz*.018],[ex,y+.025,ez],[x-dz*l*.5*side+dx*.012,y-.014,z+dx*l*.5*side+dz*.012]);}
 }}return b.finish();}
function grassGeometry(){const b=geometryBuilder();for(let i=0;i<12;i++){const a=rand()*Math.PI*2,x=(rand()-.5)*.32,z=(rand()-.5)*.32,h=.20+rand()*.39,dx=Math.cos(a),dz=Math.sin(a),w=.009+rand()*.008;b.quad([x-dz*w,0,z+dx*w],[x+dz*w,0,z-dx*w],[x+dx*.08+dz*w*.3,h*.63,z+dz*.08-dx*w*.3],[x+dx*.08-dz*w*.3,h*.63,z+dz*.08+dx*w*.3]);b.tri([x+dx*.08-dz*w*.3,h*.63,z+dz*.08+dx*w*.3],[x+dx*.08+dz*w*.3,h*.63,z+dz*.08-dx*w*.3],[x+dx*.20,h,z+dz*.20]);}return b.finish();}
const plantChunks=[],plantRecords=[];
function createUnderstory(){
 const fern=own(fernGeometry()),grass=own(grassGeometry()),litterB=geometryBuilder();litterB.quad([-.035,0,-.08],[.035,.008,-.07],[.025,.013,.09],[-.022,.001,.065]);const litter=own(litterB.finish());
 const fernMat=own(surface(new T.MeshStandardMaterial({color:0x536e2b,roughness:.92,side:T.DoubleSide}),'leaf',.022)),grassMat=own(surface(new T.MeshStandardMaterial({color:0x75814a,roughness:1,side:T.DoubleSide}),'leaf',.032)),leafMat=own(new T.MeshStandardMaterial({color:0x78603b,roughness:1,side:T.DoubleSide}));
 for(let cx=-4;cx<=4;cx++)for(let cz=-4;cz<=4;cz++){
  const chunk=new T.Group();chunk.name=`Understory_${cx}_${cz}`;chunk.userData.center={x:cx*16,z:cz*16};const sets=[[],[],[]];
  for(let i=0;i<180;i++){const x=cx*16+(rand()-.5)*16,z=cz*16+(rand()-.5)*16,d=trail.distance(x,z),patch=.5+.5*Math.sin(x*.57+Math.sin(z*.4));if(Math.hypot(x,z)<3.8)continue;
   const type=i<12?0:i<95?1:2;if(type!==2&&(d<.9+rand()*.5||rand()>patch*.7+.23))continue;
   const s=type===0?.6+rand()*.9:type===1?.55+rand()*1.1:.6+rand()*1.5;
   sets[type].push({x,z,s,angle:rand()*Math.PI*2});
  }
  [fern,grass,litter].forEach((geo,type)=>{const points=sets[type];if(!points.length)return;const m=new T.InstancedMesh(geo,[fernMat,grassMat,leafMat][type],points.length);m.receiveShadow=true;m.castShadow=false;m.userData.plantType=type;
   points.forEach((v,i)=>{tmp.position.set(v.x,g.groundY(v.x,v.z)+.015,v.z);tmp.rotation.set(0,v.angle,0);tmp.scale.set(v.s,v.s*(.78+rand()*.4),v.s);tmp.updateMatrix();m.setMatrixAt(i,tmp.matrix);m.setColorAt(i,new T.Color().setHSL(type===2?.09:.20+rand()*.035,.22+rand()*.20,.32+rand()*.20));});m.computeBoundingSphere();chunk.add(m);if(type<2)plantRecords.push({mesh:m,points});});root.add(chunk);plantChunks.push(chunk);
 }
 // Fine fallen twigs, lying flush to the terrain, are deliberately non-blocking.
 const twigGeo=own(new T.CylinderGeometry(.012,.028,1,5)),twigMat=own(new T.MeshStandardMaterial({color:0x4b4030,roughness:1}));const twigs=new T.InstancedMesh(twigGeo,twigMat,220);twigs.receiveShadow=true;
 for(let i=0;i<220;i++){const x=(rand()-.5)*110,z=(rand()-.5)*110;tmp.position.set(x,g.groundY(x,z)+.035,z);tmp.rotation.set(Math.PI/2,0,rand()*Math.PI);tmp.scale.setScalar(.35+rand()*.65);tmp.updateMatrix();twigs.setMatrixAt(i,tmp.matrix);}root.add(twigs);
}
function createAtmosphere(){
 const positions=new Float32Array((mobile?48:96)*3);for(let i=0;i<(mobile?48:96);i++){positions[i*3]=(rand()-.5)*26;positions[i*3+1]=rand()*7;positions[i*3+2]=(rand()-.5)*26;}
 const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.BufferAttribute(positions,3));
 const mat=own(new T.ShaderMaterial({transparent:true,depthWrite:false,uniforms:{fTime:uniforms.time,day:{value:1}},vertexShader:`uniform float fTime;varying float fade;void main(){vec3 p=position;p.x+=sin(fTime*.13+p.z)*.7;p.y=mod(p.y+fTime*.028,7.);vec4 v=modelViewMatrix*vec4(p,1.);fade=smoothstep(0.,2.,p.y)*(1.-smoothstep(4.,7.,p.y));gl_Position=projectionMatrix*v;gl_PointSize=clamp(12./-v.z,1.,2.4);}`,fragmentShader:`uniform float day;varying float fade;void main(){float a=1.-smoothstep(.05,.5,length(gl_PointCoord-.5));gl_FragColor=vec4(.88,.83,.66,a*.22*day*fade);}`}));
 const points=new T.Points(geo,mat);points.frustumCulled=false;root.add(points);return points;
}
function createSky(){const mat=own(new T.ShaderMaterial({side:T.BackSide,depthWrite:false,uniforms:{day:{value:1}},vertexShader:'varying float skyY;void main(){skyY=normalize(position).y;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'uniform float day;varying float skyY;void main(){vec3 horizon=mix(vec3(.012,.019,.032),vec3(.27,.325,.35),day);vec3 zenith=mix(vec3(.003,.007,.016),vec3(.13,.235,.32),day);gl_FragColor=vec4(mix(horizon,zenith,smoothstep(0.,.8,skyY)),1.);\n#include <tonemapping_fragment>\n#include <colorspace_fragment>\n}'}));const sky=new T.Mesh(own(new T.SphereGeometry(190,16,10)),mat);sky.frustumCulled=false;sky.renderOrder=-10;root.add(sky);return sky;}
createGround();createTrees();createUnderstory();const pollen=createAtmosphere(),sky=createSky();
const sun=scene.children.find(o=>o.isDirectionalLight),hemi=scene.children.find(o=>o.isHemisphereLight);
const lightState=sun?{castShadow:sun.castShadow,shadow:sun.shadow.mapSize.clone()}:null;
if(sun){sun.castShadow=true;sun.shadow.mapSize.set(mobile?1024:2048,mobile?1024:2048);Object.assign(sun.shadow.camera,{left:-25,right:25,top:25,bottom:-25,near:.5,far:125});sun.shadow.camera.updateProjectionMatrix();sun.shadow.bias=-.0003;sun.shadow.normalBias=.04;sun.shadow.radius=2;}
const envOld=scene.getObjectByName('V65_FlorestaViva');if(envOld)envOld.visible=false;
// Apply matching small gusts to near/far grass, retaining its burn and chunk APIs.
function patchGrass(){window.gameGrassModel.group.traverse(o=>{if(o.isMesh)for(const m of(Array.isArray(o.material)?o.material:[o.material]))if(!m.userData.forest100){m.userData.forest100=true;surface(m,'grass',o.isInstancedMesh&&o.geometry.boundingBox?.max.y>2?.13:.026);m.needsUpdate=true;}});}
const api={version:'V113',ready:true,root,trail:trail.points,foliageMatrices:Array.from({length:660},(_,i)=>{const m=new T.Matrix4();crowns.getMatrixAt(i,m);return m.premultiply(crowns.matrixWorld);}),
 grassFactor(x,z){return clamp((trail.distance(x,z)-.60)/1.2)*(.62+.38*(.5+.5*Math.sin(x*.44+Math.sin(z*.33))));},
 stats(){return {trees:220,canopies:660,understoryChunks:plantChunks.length,visibleChunks:plantChunks.filter(c=>c.visible).length,particles:mobile?48:96,extraLights:0,drawCalls:renderer.info.render.calls,triangles:renderer.info.render.triangles};},
 dispose(){if(disposed)return;disposed=true;if(renderer.render===renderEnvironment)renderer.render=priorRender;root.removeFromParent();for(const o of originals){o.mesh.geometry=o.geometry;o.mesh.material=o.material;}for(const o of owned)o.dispose?.();if(envOld)envOld.visible=true;if(sun){sun.castShadow=lightState.castShadow;sun.shadow.mapSize.copy(lightState.shadow);}if(window.gameForestV100===api)delete window.gameForestV100;}
};window.gameForestV100=api;
window.gameGrassModel.refresh();patchGrass();
let matrixVersion=-1,lastUpdate=-100,lastBurnCount=-1;
const priorRender=renderer.render;
const renderEnvironment=function(s,c){if(s===scene&&!disposed){root.visible=!window.gameTestMode?.active;if(!root.visible)return priorRender.call(this,s,c);const time=performance.now()*.001;uniforms.time.value=time;
 if(trunks.instanceMatrix.version!==matrixVersion){matrixVersion=trunks.instanceMatrix.version;branches.instanceMatrix.array.set(trunks.instanceMatrix.array);branches.instanceMatrix.needsUpdate=true;}
 const hour=g.dayNight?.hour??12,day=clamp(Math.sin((hour-6)*Math.PI/12)*3);sky.position.copy(g.camera.position);sky.material.uniforms.day.value=day;pollen.material.uniforms.day.value=day;pollen.position.set(g.player.x,g.groundY(g.player.x,g.player.z),g.player.z);
 if(scene.fog){scene.fog.density=.0125*day+.025*(1-day);scene.fog.color.setRGB(.030+.24*day,.042+.285*day,.060+.29*day);}if(scene.background?.isColor&&scene.fog)scene.background.copy(scene.fog.color);
 if(hemi){hemi.intensity=.12+.53*day;hemi.groundColor.setHex(0x374132);}
 // Day/night and torch remain responsible for light colors and night visibility.
 if(sun&&day>.1)sun.intensity=1.4*day+.16;
 if(time-lastUpdate>.7){lastUpdate=time;for(const ch of plantChunks)ch.visible=Math.hypot(ch.userData.center.x-g.player.x,ch.userData.center.z-g.player.z)<(mobile?28:40);patchGrass();
 const areas=window.gameGrassModel.burnedAreas||[];const burnKey=areas.length+':'+areas.slice(-1).map(a=>[a.x,a.z,a.radius,a.intensity].join(','));if(burnKey!==lastBurnCount){lastBurnCount=burnKey;for(const rec of plantRecords){let changed=false;rec.points.forEach((p,i)=>{if(!p.burned&&areas.some(a=>Math.hypot(p.x-a.x,p.z-a.z)<(a.radius||a.r||0))){p.burned=true;tmp.scale.setScalar(0);tmp.updateMatrix();rec.mesh.setMatrixAt(i,tmp.matrix);changed=true;}});if(changed)rec.mesh.instanceMatrix.needsUpdate=true;}}
 }
 if(window.gameAdvancedLighting?.active)window.gameAdvancedLighting.beforeWorldRender();
 }return priorRender.call(this,s,c);};
renderer.render=renderEnvironment;
console.info('[Forest V100] Environment ready',api.stats());
})();

