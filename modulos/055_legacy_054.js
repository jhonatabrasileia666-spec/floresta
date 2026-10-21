

(function(Z,T){
const noise=`float hash(vec3 p){return fract(sin(dot(p,vec3(127.1,311.7,74.7)))*43758.5453);}float n3(vec3 p){vec3 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(mix(hash(i),hash(i+vec3(1,0,0)),f.x),mix(hash(i+vec3(0,1,0)),hash(i+vec3(1,1,0)),f.x),f.y),mix(mix(hash(i+vec3(0,0,1)),hash(i+vec3(1,0,1)),f.x),mix(hash(i+vec3(0,1,1)),hash(i+vec3(1,1,1)),f.x),f.y),f.z);}`;
Z.Materials=class{
 constructor(p){this.all=[];const make=(color,r=.7,metal=0)=>{const m=new T.MeshStandardMaterial({color,roughness:r,metalness:metal});this.all.push(m);return m;};
 this.skin=make(p.skin,.66);this.cloth=make(p.cloth,.68);this.coat=make(p.coat||p.cloth,.73);this.pants=make(p.pants||0x272b25,.76);this.hair=make(0x101011,.72);this.mouth=make(0x160c0b,.86);this.gum=make(0x46322b,.69);this.teeth=make(0x908773,.72);this.eye=make(0x788274,.68);this.pupil=make(0x687165,.8);this.shoe=make(0x191c1c,.71);this.button=make(0x6e6c5e,.48,.15);
 for(const [m,kind] of [[this.skin,0],[this.cloth,1],[this.coat,1],[this.pants,1],[this.hair,2]]){
 m.customProgramCacheKey=()=>'zombie-'+kind+'-'+(m.userData.spaceScale||1);m.onBeforeCompile=s=>{s.vertexShader='varying vec3 vTissue;varying vec2 vFabric;\n'+s.vertexShader;s.vertexShader=s.vertexShader.replace('#include <begin_vertex>',`#include <begin_vertex>\nvTissue=position*${Number(m.userData.spaceScale||1).toFixed(8)};vFabric=uv;`);s.fragmentShader='varying vec3 vTissue;varying vec2 vFabric;\n'+noise+'\n'+s.fragmentShader;
 s.fragmentShader=s.fragmentShader.replace('#include <color_fragment>',`#include <color_fragment>
 float mottled=.52*n3(vTissue*17.)+.28*n3(vTissue*45.)+.20*n3(vTissue*115.);float fine=n3(vTissue*145.);float wet=smoothstep(.42,.78,n3(vTissue*32.+7.));
 ${kind===0?`float faceY=(vTissue.y-${Number((p.hipY||0)+(p.torso||0)+.035+(p.neck||0)).toFixed(6)})/${Number(p.head||.25).toFixed(6)};float eyeShadow=exp(-pow((abs(vTissue.x)-${Number((p.headW||.085)*.49).toFixed(6)})/.026,2.)-pow((faceY-.595)/.090,2.));float cheekHollow=exp(-pow((abs(vTissue.x)-.059)/.019,2.)-pow((faceY-.38)/.13,2.));float frontMask=smoothstep(.02,.07,vTissue.z);diffuseColor.rgb*=1.-frontMask*(eyeShadow*.74+cheekHollow*.32);diffuseColor.rgb=mix(diffuseColor.rgb,diffuseColor.rgb*vec3(.72,.80,.78),.4);float necrosis=smoothstep(.49,.68,(n3(vTissue*23.+4.)*.5+n3(vTissue*87.)*.3+n3(vTissue*197.)*.2));float veins=pow(1.-abs(n3(vTissue*75.)-.5)*2.,18.);diffuseColor.rgb=mix(diffuseColor.rgb*mix(.36,.88,mottled),vec3(.053,.035,.029),necrosis*.91);diffuseColor.rgb*=.86+fine*.2;diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.07,.047,.045),veins*.17);`:kind===1?`float fray=.88+.06*sin(vFabric.x*39.)+.03*sin(vFabric.x*109.);if(vFabric.y>fray&&n3(vec3(vFabric*35.,3.))>.39)discard;float hole=n3(vTissue*68.+3.);if(hole>.83&&vFabric.y>.6)discard;diffuseColor.rgb*=.60+.65*mottled;diffuseColor.rgb*=.86+.14*sin(vFabric.x*510.)*sin(vFabric.y*600.);diffuseColor.rgb=mix(diffuseColor.rgb,vec3(.065,.048,.030),smoothstep(.53,.73,n3(vTissue*21.)*.6+n3(vTissue*90.)*.4)*.4);`:`diffuseColor.rgb*=.45+.55*fine;diffuseColor.rgb*=.65+.35*sin(vFabric.x*150.);`}
 `);s.fragmentShader=s.fragmentShader.replace('#include <normal_fragment_maps>',`#include <normal_fragment_maps>\nfloat grain=n3(vTissue*240.)*.003+n3(vTissue*80.)*.005;vec3 gx=dFdx(vTissue),gy=dFdy(vTissue);vec3 surf=normalize(cross(gx,gy));normal=normalize(normal+vec3(dFdx(grain),dFdy(grain),0.)*9.);`);s.fragmentShader=s.fragmentShader.replace('#include <roughnessmap_fragment>',`#include <roughnessmap_fragment>\nroughnessFactor=clamp(roughnessFactor-wet*${kind===0?'.31':kind===1?'.12':'.16'},.27,.95);`);
 };}
 }
 dispose(){this.all.forEach(m=>m.dispose());}
};
})(ZOMBIES,window.__THREE_MODULE);


