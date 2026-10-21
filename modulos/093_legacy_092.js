
/* FLORESTA V186 — deterministic, explorable subterranean region. All distances in metres. */
window.FlorestaCaveWorld=function(T,{mobile=false}={}){
 const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),clamp=(v,a,b)=>Math.max(a,Math.min(b,v)),smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)},mix=(a,b,t)=>a+(b-a)*t;
 let seed=186071;const rand=()=>((seed=(Math.imul(seed,1664525)+1013904223)>>>0)/4294967296),rr=(a,b)=>mix(a,b,rand());
 const X=1000,L=632,root=new T.Group();root.name='Cave186_World';
 const regions=[{name:'Túneis Esquecidos',a:0,b:72},{name:'O Rio dos Mortos',a:72,b:180},{name:'Floresta de Teias',a:180,b:284},{name:'O Berçário das Aranhas',a:284,b:376},{name:'Ruínas Subterrâneas',a:376,b:477},{name:'O Trono da Rainha',a:477,b:632}];
 const stations=[[0,5,8,0],[25,5.5,9,-2],[62,10,17,-6],[105,24,34,-10],[142,25,36,-11],[172,6.5,14,-14],[210,32,55,-16],[244,33,58,-18],[276,7.5,17,-19],[312,27,34,-20],[348,25,33,-22],[375,8,15,-24],[410,30,45,-24],[443,26,43,-24],[473,8,19,-25],[515,45,72,-26],[553,49,78,-26],[592,34,62,-24],[618,12,19,-21],[632,6,10,-21]];
 function section(s){s=clamp(s,0,L);let i=0;while(i<stations.length-2&&s>stations[i+1][0])i++;const a=stations[i],b=stations[i+1],t=smooth((s-a[0])/(b[0]-a[0]));return {s,c:X+Math.sin(s*.017)*8+Math.sin(s*.04)*2.5,w:mix(a[1],b[1],t),h:mix(a[2],b[2],t),y:mix(a[3],b[3],t)};}
 function noise(x,z){return Math.sin(x*.57+z*.11)*Math.cos(z*.43-x*.13)*.075+Math.sin(x*1.22+z*.72)*.085;}
 function waterZone(s){return (s>55&&s<179)||(s>481&&s<574)}
 function river(s){return Math.sin(s*.066)*3.5+Math.sin(s*.024)*2.2;}
 function baseFloor(x,z){const s=-z,q=section(s),u=x-q.c;let y=q.y+noise(x,z);
  if(waterZone(s)){const edge=smooth((s-55)/10)*smooth((179-s)/10)+smooth((s-481)/10)*smooth((574-s)/10);y-=.68*(1-smooth((Math.abs(u-river(s))-2.6)/3))*edge;}
  if(s>192&&s<262){const t=smooth((s-192)/12)*smooth((262-s)/12),edge=Math.abs(u)/q.w;const gap=smooth((Math.abs(u)-3.6)/2)*(1-smooth((edge-.72)/.15));y-=23*t*gap;y+=5*t*smooth((edge-.82)/.08);}
  if(s>493&&s<615){const d=Math.hypot(u,(s-588)*.9);y+=4.8*(1-smooth((d-5)/16));}
  y+=Math.pow(Math.abs(u)/q.w,6)*1.5;return y;
 }
 const secret={x:section(579).c+38,z:-579,length:37,width:6.4};
 function secretLocal(x,z){return {s:x-secret.x,u:z-secret.z}}
 function inSecret(x,z,margin=0){const p=secretLocal(x,z);return p.s>-2&&p.s<secret.length-margin&&Math.abs(p.u)<(p.s>17?9:5.5)-margin;}
 function heightAt(x,z){if(inSecret(x,z))return -24+noise(x,z)+smooth((x-secret.x-12)/16)*1.8;return baseFloor(x,z)}
 function inBounds(x,z,r=.35){if(inSecret(x,z,r))return true;const s=-z;if(s<1+r||s>L-r)return false;const q=section(s);return Math.abs(x-q.c)<q.w-r-.4;}
 const chunks=[],solids=[],breakables=[],eggs=[],emitters=[],webAnchors=[],resources=new Set(),timed=[];
 const mats={};
 function stoneMaterial(color,roughness=.86){const m=new T.MeshStandardMaterial({color,roughness,metalness:.05,side:T.DoubleSide});m.onBeforeCompile=sh=>{
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 caveP;').replace('#include <begin_vertex>','#include <begin_vertex>\ncaveP=position;\n#ifdef USE_INSTANCING\ncaveP=(instanceMatrix*vec4(position,1.)).xyz;\n#endif\ncaveP=(modelMatrix*vec4(caveP,1.)).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>',`#include <common>
 varying vec3 caveP;
 float ch(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}
 float cn(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(ch(i),ch(i+vec3(1,0,0)),f.x),mix(ch(i+vec3(0,1,0)),ch(i+vec3(1,1,0)),f.x),f.y),mix(mix(ch(i+vec3(0,0,1)),ch(i+vec3(1,0,1)),f.x),mix(ch(i+vec3(0,1,1)),ch(i+vec3(1,1,1)),f.x),f.y),f.z);}
 float cf(vec3 p){return cn(p)*.56+cn(p*2.07)*.27+cn(p*4.17)*.12+cn(p*8.13)*.05;}
 `).replace('#include <color_fragment>',`#include <color_fragment>
 float grain=cf(caveP*1.6);float strata=sin(caveP.y*3.8+cf(caveP*.37)*9.);float seam=pow(1.-abs(sin(grain*18.+caveP.y*.7)),16.);
 diffuseColor.rgb*=mix(.32,1.62,grain)*(.87+.13*strata)*(1.-seam*.23);
 diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.68,.86,.73),smoothstep(.60,.80,cf(caveP*.19))*.5);
 `).replace('#include <normal_fragment_begin>',`#include <normal_fragment_begin>
 vec3 bump=vec3(cf(caveP*5.+vec3(.03,0,0))-cf(caveP*5.-vec3(.03,0,0)),cf(caveP*5.+vec3(0,.03,0))-cf(caveP*5.-vec3(0,.03,0)),cf(caveP*5.+vec3(0,0,.03))-cf(caveP*5.-vec3(0,0,.03)));normal=normalize(normal+(viewMatrix*vec4(bump,0.)).xyz*1.6);`);};resources.add(m);return m;}
 mats.rock=stoneMaterial(0x727b7e);mats.floor=stoneMaterial(0x74736a,.65);mats.ruin=stoneMaterial(0x9c9788);mats.bone=new T.MeshStandardMaterial({color:0xb7ab89,roughness:.95});mats.root=new T.MeshStandardMaterial({color:0x453c30,roughness:1});mats.egg=new T.MeshStandardMaterial({color:0xa69a78,roughness:.71,emissive:0x403421,emissiveIntensity:.12});mats.silk=new T.MeshStandardMaterial({color:0xc8d8d7,roughness:.94,side:T.DoubleSide,transparent:true,opacity:.37,depthWrite:false});mats.silkThread=new T.LineBasicMaterial({color:0xa5b6b8,transparent:true,opacity:.24,depthWrite:false});
 const rockGeo=new T.SphereGeometry(1,14,10),pa=rockGeo.attributes.position;for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i),z=pa.getZ(i),f=1+.16*Math.sin(x*3+y*2+z*2)+.055*Math.sin(x*7-y*5+z*6);pa.setXYZ(i,x*f,y*f,z*f)}rockGeo.computeVertexNormals();
 const matrix=new T.Matrix4(),quat=new T.Quaternion(),scale=new T.Vector3();
 function mesh(geo,mat,parent=root,pos=V(),sc=V(1,1,1)){const o=new T.Mesh(geo,mat);o.position.copy(pos);o.scale.copy(sc);o.receiveShadow=true;o.castShadow=false;parent.add(o);resources.add(geo);return o;}
 function segment(a,b,r,mat,parent=root){const d=b.clone().sub(a),o=mesh(new T.CylinderGeometry(r*.75,r,d.length(),7),mat,parent,a.clone().add(b).multiplyScalar(.5));o.quaternion.setFromUnitVectors(V(0,1),d.normalize());return o;}
 function curveTube(points,r,mat,parent=root){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points),Math.max(10,points.length*4),r,5,false),mat,parent);}
 function solid(x,z,r,y=heightAt(x,z),h=6){solids.push({x,z,r,y,h});}
 function batch(data,geo,mat,parent){if(!data.length)return;const o=new T.InstancedMesh(geo,mat,data.length);data.forEach((v,i)=>{quat.setFromEuler(new T.Euler(v.rx||0,v.ry||0,v.rz||0));matrix.compose(V(v.x,v.y,v.z),quat,V(v.sx,v.sy,v.sz));o.setMatrixAt(i,matrix)});o.receiveShadow=true;o.computeBoundingSphere();parent.add(o);resources.add(geo);return o;}
 function makeGeo(pos,idx,uv){const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);if(uv)g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.computeVertexNormals();resources.add(g);return g;}
 function terrainChunk(a,b){const g=new T.Group();g.name='Cave186_Sector_'+a;root.add(g);const rows=Math.ceil((b-a)/2),cols=36,pos=[],idx=[],uv=[],wall=[],wi=[],wu=[];
  for(let j=0;j<=rows;j++){const s=mix(a,b,j/rows),q=section(s);for(let i=0;i<=cols;i++){const u=mix(-q.w,q.w,i/cols),x=q.c+u;pos.push(x,baseFloor(x,-s),-s);uv.push(x*.23,s*.23);if(i<cols&&j<rows){const k=j*(cols+1)+i;idx.push(k,k+cols+1,k+1,k+1,k+cols+1,k+cols+2);}}
   for(let i=0;i<=cols;i++){const ang=Math.PI*i/cols,side=Math.cos(ang),ripple=(Math.sin(s*.25+i*.7)*1.1+Math.sin(s*.51+i*1.3)*.45)*Math.sin(ang);wall.push(q.c+side*q.w+ripple,q.y+Math.pow(Math.sin(ang),.70)*q.h+ripple*1.4+Math.abs(side)*1.4,-s);wu.push(i*.45,s*.2);
    if(i<cols&&j<rows&&!(s>570&&s<588&&i<5)){const k=j*(cols+1)+i;wi.push(k,k+1,k+cols+1,k+1,k+cols+2,k+cols+1);}
   }
  }
  mesh(makeGeo(pos,idx,uv),mats.floor,g);mesh(makeGeo(wall,wi,wu),mats.rock,g);
  const rocks=[],spikes=[];
  for(let i=0;i<(mobile?36:64);i++){const s=rr(a,b),q=section(s),sign=rand()<.5?-1:1,u=sign*rr(.85,1)*q.w,x=q.c+u,sy=rr(1,Math.min(10,q.h*.22)),sx=rr(1.2,3.8),y=baseFloor(x,-s)+sy*.4;rocks.push({x,y,z:-s,sx,sy,sz:rr(1,3),ry:rr(0,6),rz:rr(-.3,.3)});if(Math.abs(u)<q.w-1.3)solid(x,-s,sx*.64,y-sy,sy*2);
   if(i%3===0){const xx=q.c+rr(-.9,.9)*q.w,yy=q.y+Math.pow(Math.sqrt(Math.max(0,1-((xx-q.c)/q.w)**2)),.7)*q.h;spikes.push({x:xx,y:yy-rr(1,3),z:-s,sx:rr(.25,.9),sy:rr(2,6),sz:rr(.25,1),rz:Math.PI});}
  }
  // Small rubble hugs the banks, leaving the main trail clear.
  for(let i=0;i<(mobile?40:85);i++){const s=rr(a,b),q=section(s),x=q.c+rr(-.92,.92)*q.w;rocks.push({x,y:heightAt(x,-s)+.08,z:-s,sx:rr(.1,.55),sy:rr(.08,.28),sz:rr(.12,.7),ry:rr(0,6)})}
  batch(rocks,rockGeo,mats.rock,g);batch(spikes,new T.ConeGeometry(1,1,7,3),mats.rock,g);chunks.push({a,b,root:g});return g;
 }
 function web(a,b,c,parent,age=.5){const group=new T.Group();parent.add(group);const points=[],tri=[],positions=[];const N=12,M=8;
  for(let j=0;j<=M;j++)for(let i=0;i<=N;i++){const u=i/N,v=j/M,p=a.clone().lerp(b,u).lerp(c,v);p.y-=Math.sin(u*Math.PI)*(1-v)*a.distanceTo(b)*.19;p.x+=Math.sin(j*1.9+i*.73)*.16*Math.sin(u*Math.PI);p.z+=Math.sin(i*1.4+j)*.16*Math.sin(v*Math.PI);positions.push(p.x,p.y,p.z);if(i<N&&j<M){const k=j*(N+1)+i;if(rand()>.08+age*.10)tri.push(k,k+1,k+N+1,k+1,k+N+2,k+N+1);}}
  // Thin irregular radial strands plus layered gauze; these are spatial geometry.
  for(let i=0;i<=N;i++){for(let j=0;j<M;j++){let k=(j*(N+1)+i)*3,h=((j+1)*(N+1)+i)*3;points.push(...positions.slice(k,k+3),...positions.slice(h,h+3));}}
  for(let j=1;j<M;j++)for(let i=0;i<N;i++){let k=(j*(N+1)+i)*3,h=k+3;if(rand()>.11)points.push(...positions.slice(k,k+3),...positions.slice(h,h+3));}
  const lg=new T.BufferGeometry();lg.setAttribute('position',new T.Float32BufferAttribute(points,3));group.add(new T.LineSegments(lg,mats.silkThread));resources.add(lg);
  const veil=mats.silk.clone();veil.opacity=.025+age*.028;resources.add(veil);mesh(makeGeo(positions,tri),veil,group);webAnchors.push(group);return group;
 }
 function addBones(parent,x,y,z,size=1){const g=new T.Group();g.position.set(x,y,z);g.rotation.y=rr(0,6);g.scale.setScalar(size);parent.add(g);mesh(rockGeo,mats.bone,g,V(0,.19,0),V(.2,.24,.2));const dark=new T.MeshBasicMaterial({color:0x171a18});for(const side of [-1,1])mesh(rockGeo,dark,g,V(side*.072,.23,.16),V(.054,.06,.034));resources.add(dark);segment(V(0,.07,-.15),V(0,.07,-.85),.034,mats.bone,g);for(let i=0;i<5;i++){const zz=-.25-i*.10;for(const side of [-1,1])curveTube([V(0,.10,zz),V(side*.19,.19,zz),V(side*.24,.06,zz-.02)],.019,mats.bone,g)}for(const side of[-1,1]){segment(V(side*.08,.065,-.85),V(side*.18,.07,-1.2),.035,mats.bone,g);segment(V(side*.18,.07,-1.2),V(side*.32,.06,-1.5),.03,mats.bone,g)}return g;}
 function ruinPillar(parent,x,z,h,r=.9){let y=heightAt(x,z);for(let i=0;i<Math.ceil(h/2.6);i++){const hh=Math.min(2.6,h-i*2.6),o=mesh(new T.CylinderGeometry(r*.91,r,hh,8),mats.ruin,parent,V(x,y+i*2.6+hh/2,z));o.rotation.y=(i%2)*.035}mesh(new T.BoxGeometry(r*2.7,.6,r*2.7),mats.ruin,parent,V(x,y+.3,z));mesh(new T.BoxGeometry(r*2.4,.7,r*2.4),mats.ruin,parent,V(x,y+h-.3,z));solid(x,z,r*1.1,y,h);return V(x,y+h,z)}
 function arch(parent,x,z,w,h){const y=heightAt(x,z);ruinPillar(parent,x-w/2,z,h*.58,.8);ruinPillar(parent,x+w/2,z,h*.58,.8);for(let i=0;i<11;i++){const a=Math.PI*(i+.5)/11,o=mesh(new T.BoxGeometry(w*.17,w*.16,1.75),mats.ruin,parent,V(x+Math.cos(a)*w*.5,y+h*.56+Math.sin(a)*h*.40,z));o.rotation.z=a-Math.PI/2;}}

 function geologicalColumn(parent,x,z,h,r){const y=heightAt(x,z),pos=[],idx=[];for(let j=0;j<=14;j++){const t=j/14,bulge=1+.38*Math.pow(Math.abs(t-.5)*2,3);for(let i=0;i<=14;i++){const a=i/14*Math.PI*2,rad=r*bulge*(1+.10*Math.sin(a*5+t*19)+.08*Math.sin(a*3-t*13));pos.push(x+Math.cos(a)*rad+Math.sin(t*4)*r*.25,y+t*h,z+Math.sin(a)*rad);if(i<14&&j<14){const k=j*15+i;idx.push(k,k+1,k+15,k+1,k+16,k+15);}}}mesh(makeGeo(pos,idx),mats.rock,parent);solid(x,z,r*1.05,y,h);return V(x,y+h,z);}
 function wornStatue(parent,x,z){const y=heightAt(x,z);mesh(new T.BoxGeometry(2.1,1.2,2),mats.ruin,parent,V(x,y+.6,z));mesh(rockGeo,mats.ruin,parent,V(x,y+2.8,z),V(.8,1.7,.65));mesh(rockGeo,mats.ruin,parent,V(x+.12,y+4.6,z),V(.55,.68,.49));segment(V(x-.65,y+3.8,z),V(x-1.1,y+2.3,z+.1),.2,mats.ruin,parent);mesh(rockGeo,mats.ruin,parent,V(x+1.1,y+.5,z-.8),V(.3,.6,.4));solid(x,z,1.15,y,5.2);}
 function veilMaterial(color,opacity){return new T.ShaderMaterial({uniforms:{time:{value:0},color:{value:new T.Color(color)},opacity:{value:opacity}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float time,opacity;uniform vec3 color;void main(){float a=pow(max(0.,1.-length((v-.5)*2.)),2.);a*=.68+.32*sin(v.x*15.+v.y*8.+time*.2);gl_FragColor=vec4(color,a*opacity);}',transparent:true,depthWrite:false,side:T.DoubleSide});}
 const mistMat=veilMaterial(0x8cabb6,.11);timed.push(mistMat);resources.add(mistMat);
 function shaft(parent,x,z,y,h,width=4){const mat=new T.ShaderMaterial({uniforms:{time:{value:0}},vertexShader:'varying vec2 v;void main(){v=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}',fragmentShader:'varying vec2 v;uniform float time;void main(){float a=sin(v.y*3.14159)*.038*(.8+.2*sin(v.x*40.+time*.1));gl_FragColor=vec4(.48,.64,.72,a);}',transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending});resources.add(mat);timed.push(mat);const o=mesh(new T.ConeGeometry(width,h,24,1,true),mat,parent,V(x,y+h*.5,z));o.rotation.z=.10;emitters.push(V(x,y+h,z));}
 const waterMat=new T.MeshStandardMaterial({color:0x233f46,roughness:.19,metalness:.65,transparent:true,opacity:.84,side:T.DoubleSide});waterMat.onBeforeCompile=sh=>{sh.uniforms.caveTime={value:0};waterMat.userData.shader=sh;sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nuniform float caveTime;varying vec3 wp;').replace('#include <begin_vertex>','#include <begin_vertex>\nwp=position;transformed.y+=sin(position.x*2.+caveTime)*sin(position.z*1.2+caveTime*.7)*.023;');sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nuniform float caveTime;varying vec3 wp;').replace('#include <normal_fragment_begin>','#include <normal_fragment_begin>\nnormal=normalize(normal+vec3(sin(wp.x*3.+caveTime)*.13,0.,cos(wp.z*2.1+caveTime*.8)*.12));');};resources.add(waterMat);
 function waterStrip(a,b,parent){const pos=[],idx=[];for(let j=0;j<=Math.ceil(b-a);j++){const s=Math.min(b,a+j),q=section(s),c=q.c+river(s),y=q.y-.29;for(let i=0;i<2;i++)pos.push(c+(i?1:-1)*(6.2+Math.sin(s*.3)*.3),y,-s);if(j<Math.ceil(b-a)){let k=j*2;idx.push(k,k+2,k+1,k+1,k+2,k+3);}}mesh(makeGeo(pos,idx),waterMat,parent);}
 function waterfall(parent,x,z,top,bottom){const mat=veilMaterial(0x90b7c5,.48);timed.push(mat);resources.add(mat);for(let i=0;i<3;i++){const o=mesh(new T.PlaneGeometry(2.2,top-bottom,1,12),mat,parent,V(x+i*.34,(top+bottom)/2,z+i*.21));o.rotation.y=i*.35;}const mist=mesh(new T.PlaneGeometry(13,5),mistMat,parent,V(x,bottom+1,z));}
 function detailChunk(ch){const {a,b,root:g}=ch;
  if(waterZone((a+b)/2)||waterZone(a+1)||waterZone(b-1)){const aa=Math.max(a,a<180?61:487),bb=Math.min(b,b<180?172:570);if(bb>aa)waterStrip(aa,bb,g)}
  const dark=a<72,queen=a>476,webCount=dark?2:5;
  for(let i=0;i<webCount;i++){const s=rr(a+2,b-1),q=section(s),sgn=rand()>.5?1:-1,x=q.c+sgn*q.w*.81,y=q.y+rr(3,q.h*.58);web(V(x,y,-s),V(q.c-sgn*q.w*.53,y+rr(-3,8),-s-rr(3,9)),V(q.c+sgn*q.w*.5,y+rr(5,14),-s+rr(1,8)),g,.6);}
  for(let i=0;i<(dark?5:3);i++){const s=rr(a,b),q=section(s),u=rr(-.7,.7)*q.w;let y=q.y+q.h*.75;const end=V(q.c+u,y-rr(3,10),-s);curveTube([V(q.c+u,q.y+q.h*.95,-s),end.clone().add(V(.3,1,.1)),end],.025,mats.root,g);if(a>180)mesh(rockGeo,mats.egg,g,end,V(.32,.9,.32));}
  if(a>70){for(let i=0;i<2;i++){const s=rr(a,b),q=section(s),x=q.c+rr(-.6,.6)*q.w;if(heightAt(x,-s)>q.y-2)addBones(g,x,heightAt(x,-s)+.08,-s,rr(.65,1.1))}}
  const s=(a+b)/2,q=section(s);if(a>70&&a<620){const fog=mesh(new T.PlaneGeometry(q.w*1.7,5),mistMat,g,V(q.c,q.y+2,-s));fog.rotation.x=-.2;}
  if([96,192,224,288,384,480,512,544,576].includes(a))shaft(g,q.c+q.w*.35,-s,q.y,q.h,q.w*.19);
  if(a>=288&&a<352||queen){const data=[];for(let i=0;i<(queen?20:72);i++){const ss=rr(a,b),qq=section(ss),side=rand()<.5?-1:1,x=qq.c+side*rr(.61,.86)*qq.w,y=heightAt(x,-ss);data.push({x,y:y+.65,z:-ss,sx:rr(.35,.8),sy:rr(.5,1.1),sz:rr(.35,.75),ry:rr(0,6)});if(i%18===0)eggs.push({x,y,z:-ss,hatched:false,sector:chunks.indexOf(ch)});}batch(data,rockGeo,mats.egg,g);}
  if(a>=384&&a<464||queen){for(const side of[-1,1]){const x=q.c+side*q.w*.65,h=rr(q.h*.24,q.h*.51);const top=ruinPillar(g,x,-s,h,queen?1.5:1.0);web(top,top.clone().add(V(-side*q.w*.6,rr(-4,4),-12)),top.clone().add(V(-side*q.w*.14,-h*.6,8)),g,.6);}}
  if(a>70&&a<600){const c=new T.MeshStandardMaterial({color:0x72928b,emissive:0x326268,emissiveIntensity:.7,roughness:.9});resources.add(c);const arr=[];for(let i=0;i<18;i++){const ss=rr(a,b),qq=section(ss),x=qq.c+(rand()>.5?1:-1)*rr(.74,.93)*qq.w;arr.push({x,y:heightAt(x,-ss)+.13,z:-ss,sx:rr(.1,.26),sy:.10,sz:rr(.1,.24)})}batch(arr,new T.SphereGeometry(1,6,4),c,g);}
 }
 function blocked(x,z,r=.36){if(!inBounds(x,z,r))return true;const y=heightAt(x,z);for(const o of solids){if(Math.abs(z-o.z)>o.r+r)continue;if(Math.hypot(x-o.x,z-o.z)<o.r+r&&y<o.y+o.h-.5)return true;}for(const w of breakables)if(!w.broken&&Math.abs(z-w.z)<.35+r&&Math.abs(x-w.x)<w.width/2+r)return true;return false;}
 function buildSecret(){const g=new T.Group();root.add(g);const pos=[],idx=[],floor=[],fi=[];for(let j=0;j<=22;j++){const s=j/22*secret.length,x=secret.x+s,w=s>17?9:5.5;for(let i=0;i<=20;i++){const a=i/20*Math.PI,z=secret.z+Math.cos(a)*w,y=-24+Math.sin(a)*(s>17?13:7);pos.push(x,y,z);floor.push(x,heightAt(x,secret.z+mix(-w,w,i/20)),secret.z+mix(-w,w,i/20));if(i<20&&j<22){let k=j*21+i;idx.push(k,k+1,k+21,k+1,k+22,k+21);fi.push(k,k+21,k+1,k+1,k+21,k+22);}}}mesh(makeGeo(pos,idx),mats.rock,g);mesh(makeGeo(floor,fi),mats.floor,g);const end=secret.x+secret.length;mesh(new T.PlaneGeometry(18,15),mats.rock,g,V(end,-17,secret.z)).rotation.y=Math.PI/2;for(let i=0;i<5;i++)web(V(secret.x+15+i*3,-21,secret.z-7),V(secret.x+15+i*3,-21,secret.z+7),V(secret.x+15+i*3,-11,secret.z),g,.9);shaft(g,end-10,secret.z,-22,13,3);return g;}
 function makeBreakable(s){const q=section(s),group=new T.Group();root.add(group);const x=q.c,y=q.y,width=Math.min(q.w*1.6,11);web(V(x-width/2,y,-s),V(x+width/2,y,-s),V(x,y+7,-s),group,.9);web(V(x-width/2,y+6,-s-.2),V(x+width/2,y+6,-s-.2),V(x,y,-s-.2),group,.9);const item={x,z:-s,width,root:group,hp:70,broken:false};breakables.push(item);return item;}

 function mergeStatic(parent){parent.updateMatrixWorld(true);const inv=parent.matrixWorld.clone().invert(),groups=new Map();parent.traverse(o=>{if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.material.transparent||!o.geometry.attributes.normal)return;const key=o.material;if(!groups.has(key))groups.set(key,[]);groups.get(key).push(o)});for(const [mat,list]of groups){if(list.length<2)continue;const p=[],n=[],uv=[],idx=[];let offset=0;for(const o of list){const g=o.geometry,m=new T.Matrix4().multiplyMatrices(inv,o.matrixWorld),nm=new T.Matrix3().getNormalMatrix(m),pp=g.attributes.position,nn=g.attributes.normal,uu=g.attributes.uv;for(let i=0;i<pp.count;i++){const v=V().fromBufferAttribute(pp,i).applyMatrix4(m),normal=V().fromBufferAttribute(nn,i).applyMatrix3(nm).normalize();p.push(v.x,v.y,v.z);n.push(normal.x,normal.y,normal.z);uv.push(uu?uu.getX(i):0,uu?uu.getY(i):0);}if(g.index)for(let i=0;i<g.index.count;i++)idx.push(offset+g.index.getX(i));else for(let i=0;i<pp.count;i++)idx.push(offset+i);offset+=pp.count;o.removeFromParent();}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('normal',new T.Float32BufferAttribute(n,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);mesh(g,mat,parent);}}
 async function build(progress=()=>{}){for(let a=0;a<L;a+=32){terrainChunk(a,Math.min(L,a+32));progress(.05+.5*(a/L));await new Promise(r=>setTimeout(r,0));}for(let i=0;i<chunks.length;i++){detailChunk(chunks[i]);progress(.56+.35*i/chunks.length);await new Promise(r=>setTimeout(r,0));}
  for(const s of[397,436,482]){const q=section(s);arch(chunks.find(c=>s>=c.a&&s<c.b).root,q.c,-s,s===482?14:18,s===482?19:16)}
  // Broken colonnades over the gorge frame two climbable bank routes and the central silk causeway.
  for(const s of[201,219,243,257]){const q=section(s);for(const sign of[-1,1]){const top=geologicalColumn(root,q.c+sign*q.w*.66,-s,q.h*.85,rr(1.4,2.5));web(top,top.clone().add(V(-sign*q.w*.8,-8,-15)),top.clone().add(V(-sign*q.w*.2,-17,8)),root,.7);}}
  for(const s of[404,440,490,535]){const q=section(s);wornStatue(root,q.c+q.w*.55,-s);}
  for(const s of[209,230,250]){const q=section(s);for(const sign of[-1,1]){const x=q.c+sign*q.w*.75;ruinPillar(root,x,-s,rr(15,29),1.6);}}
  for(let s=201;s<260;s+=9){const q=section(s);web(V(q.c-3.6,baseFloor(q.c,-s)+.10,-s),V(q.c+3.6,baseFloor(q.c,-s)+.10,-s),V(q.c,baseFloor(q.c,-s-8)+.12,-s-8),root,.9);}
  for(const side of[-1,1]){const pts=[];for(let s=192;s<=262;s+=4){const q=section(s);pts.push(V(q.c+side*3,baseFloor(q.c,-s)+1,-s))}curveTube(pts,.055,mats.silk,root)}
  const q=section(590);for(let i=0;i<14;i++){const ang=i/14*Math.PI*2,x=q.c+Math.cos(ang)*13,z=-590+Math.sin(ang)*10;const top=V(x,heightAt(x,z)+rr(4,10),z);mesh(rockGeo,mats.rock,root,top.clone().add(V(0,-2,0)),V(1.3,4,1.2));web(top,V(q.c+rr(-5,5),heightAt(q.c,-590)+.3,-590+rr(-3,3)),top.clone().add(V(3,2,2)),root,.8)}
  waterfall(root,section(131).c-20,-131,15,-11);waterfall(root,section(550).c+39,-550,12,-26);waterfall(root,section(566).c-37,-566,5,-26);
  makeBreakable(65);makeBreakable(280);const secretRoot=buildSecret();for(const ch of chunks)mergeStatic(ch.root);mergeStatic(secretRoot);progress(1);return root;
 }
 function update(t,camera){if(waterMat.userData.shader)waterMat.userData.shader.uniforms.caveTime.value=t;for(const m of timed)m.uniforms.time.value=t;const s=-camera.position.z;for(const ch of chunks)ch.root.visible=s>ch.a-95&&s<ch.b+95;}
 function routePoint(s,offset=0){const q=section(s);return V(q.c+offset,heightAt(q.c+offset,-s),-s)}
 function dispose(){root.removeFromParent();root.traverse(o=>{if(o.geometry)resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material])if(m)resources.add(m)});for(const r of resources)r.dispose?.();resources.clear();}
 return {root,build,update,dispose,heightAt,blocked,inBounds,section,routePoint,waterZone,river,regions,solids,breakables,eggs,secret,resources,chunks,X,length:L};
};

