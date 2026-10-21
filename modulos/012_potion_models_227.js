/* Frascos tridimensionais do inventário V219. Unidade: metros. */
window.PotionModels219=(()=>{
 const defs={cura:{name:'Cura da floresta',color:0xbd3f55,width:1},cura_maior:{name:'Cura profunda',color:0xe65364,width:1.07},fogo:{name:'Óleo de brasa',color:0xff8c21,width:1.03},vigor:{name:'Essência de vigor',color:0x47b5a9,width:.98},luz:{name:'Tônico do luar',color:0x9993ef,width:1}};
 let corkTexture;
 function make(T,id='cura'){
  const def=defs[id]||defs.cura,g=new T.Group();g.name='Frasco_'+id+'_V219';
  const V=(x,y)=>new T.Vector2(x,y),profile=[[0,-.093],[.039,-.093],[.061,-.084],[.077,-.061],[.083,-.026],[.081,.010],[.067,.045],[.044,.065],[.026,.078],[.025,.116],[.029,.121],[.029,.131],[.022,.133]].map(a=>V(a[0]*def.width,a[1]));
  const glass=new T.MeshPhysicalMaterial({color:0xd1e2de,roughness:.13,metalness:0,transparent:true,opacity:.29,depthWrite:false,side:T.DoubleSide,clearcoat:1,clearcoatRoughness:.08});
  const mesh=(geo,mat,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=!mat.transparent;m.receiveShadow=true;g.add(m);return m};
  const shell=mesh(new T.LatheGeometry(profile,32),glass);shell.name='Vidro_arredondado';shell.renderOrder=3;
  const liquidMat=new T.MeshPhysicalMaterial({color:def.color,emissive:def.color,emissiveIntensity:.055,roughness:.19,metalness:0,transparent:true,opacity:.91,clearcoat:1});
  const liquidProfile=[[0,-.087],[.038,-.087],[.057,-.078],[.072,-.056],[.077,-.024],[.075,.010],[.070,.027],[0,.027]].map(a=>V(a[0]*def.width,a[1]));
  const fill=mesh(new T.LatheGeometry(liquidProfile,28),liquidMat);fill.name='Liquido_'+id;fill.renderOrder=1;
  const top=mesh(new T.CircleGeometry(.069*def.width,28),liquidMat,0,.027,0);top.rotation.x=-Math.PI/2;top.renderOrder=1;
  if(!corkTexture){const cv=document.createElement('canvas');cv.width=cv.height=64;const cx=cv.getContext('2d');cx.fillStyle='#a67a49';cx.fillRect(0,0,64,64);for(let i=0;i<360;i++){const x=(i*37)%64,y=(i*53)%64;cx.fillStyle=i%2?'#79522f':'#c49b68';cx.fillRect(x,y,1+(i%3),1+(i%2));}corkTexture=new T.CanvasTexture(cv);corkTexture.colorSpace=T.SRGBColorSpace;}
  const cork=mesh(new T.CylinderGeometry(.0275,.025,.041,20),new T.MeshStandardMaterial({map:corkTexture,roughness:1}),0,.150,0);cork.name='Rolha';
  const rope=new T.MeshStandardMaterial({color:0x85613b,roughness:1});
  for(let i=0;i<4;i++){const ring=mesh(new T.TorusGeometry(.031,.0032,5,28),rope,0,.089+i*.008,0);ring.rotation.x=Math.PI/2;}
  const knot=mesh(new T.TorusGeometry(.010,.0034,5,14),rope,.014,.099,.027);knot.rotation.z=.6;
  const strand=(points)=>{const curve=new T.CatmullRomCurve3(points.map(a=>new T.Vector3(...a)));return mesh(new T.TubeGeometry(curve,14,.0028,5,false),rope)};
  strand([[.006,.101,.031],[-.015,.09,.039],[-.026,.064,.047]]);strand([[.015,.099,.031],[.036,.086,.028],[.042,.064,.032]]);
  const shine=new T.MeshBasicMaterial({color:0xffffff,transparent:true,opacity:.14,depthWrite:false});
  const arc=new T.CatmullRomCurve3([new T.Vector3(-.043,-.057,.061),new T.Vector3(-.057,-.015,.055),new T.Vector3(-.044,.035,.050)]);mesh(new T.TubeGeometry(arc,12,.0018,4,false),shine).renderOrder=4;
  g.userData={id,fill,cork,liquidSurface:top,glass:shell,grip:new T.Vector3(0,.048,0),spriteId:'alq_potion_'+id};g.scale.setScalar(.88);return g;
 }
 return {defs,make};
})();
