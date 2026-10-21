
/* FLORESTA V208 — contorno, chamas e cabo conforme referência do usuário.
 * Oito quadros: cabeça com aro e película luminosa sobre o cabo original.
 * Malhas com profundidade herdam integralmente a transformação da arma.
 */
(()=>{
'use strict';
if(window.gameFlameV203)return;
const FPS=11, FIRE_TIME=6500, TICK_MS=650, TICK_DAMAGE=4;
const burning=new Map();
let THREE=null, textures=[], frameIndex=-1, sprite=null, fireGroup=null;
let textureReady=false, started=false, imageErrors=0;
function alchemy(){return window.gameHerbalAlchemy?.state;}
function active(){const s=alchemy();return !!(s && s.fireUntil>performance.now());}
function currentAxe(){return window.gameRightHand?.current==='axe'?window.gameRightHand.object:null;}
function loadTextures(){
  const json=document.getElementById('v203-fire-frames');
  if(!json)throw new Error('Sprites animados originais ausentes');
  const data=JSON.parse(json.textContent);
  if(data.length!==8)throw new Error('São necessários os oito PNGs originais');
  textures=Array(8).fill(null);
  let count=0;
  data.forEach((url,i)=>{
    new THREE.TextureLoader().load(url,tex=>{
      tex.colorSpace=THREE.SRGBColorSpace||tex.colorSpace;
      tex.minFilter=THREE.LinearMipmapLinearFilter;
      tex.magFilter=THREE.LinearFilter;
      tex.generateMipmaps=true;
      textures[i]=tex;
      if(++count===8)textureReady=true;
    },undefined,err=>{imageErrors++;console.warn('[FLORESTA V208] Falha ao carregar quadro',i+1,err);});
  });
}

function removeOldRoot(){
  const state=alchemy();
  if(state?.fireRoot && state.fireRoot!==fireGroup){
    state.fireRoot.removeFromParent();state.fireRoot=null;
  }
}
function attach(){
  const state=alchemy(),axe=currentAxe();
  if(!state||!axe||!textureReady)return false;
  if(fireGroup?.parent===axe){state.fireRoot=fireGroup;fireGroup.visible=true;return true;}
  removeOldRoot();
  if(fireGroup){
    fireGroup.removeFromParent();
    fireGroup.traverse(o=>{if(o.isMesh||o.isPoints){o.geometry.dispose();o.material.dispose();}});
  }
  fireGroup=new THREE.Group();
  fireGroup.name='FLORESTA_V208_Fogo_Envolvendo_Machado_Referencia';
  fireGroup.userData.fireV203=true;
  fireGroup.userData.fireV208=true;
  // Origem da arma: cabeça e cabo possuem eixos próprios.
  const headRoot=new THREE.Group();
  headRoot.position.set(.015,.255,0);headRoot.rotation.z=-.18;
  fireGroup.add(headRoot);
  const planes=[];
  function fireMaterial(opacity,fadeBottom){
    const mat=new THREE.MeshBasicMaterial({map:textures[0],transparent:true,
      opacity,side:THREE.DoubleSide,depthTest:true,depthWrite:false,
      blending:THREE.AdditiveBlending,toneMapped:false,alphaTest:.008});
    mat.onBeforeCompile=shader=>{
      shader.fragmentShader=shader.fragmentShader.replace('#include <map_fragment>',
        '#include <map_fragment>\n'+
        // Remove o miolo escuro desenhado: somente luz/chama sobre a madeira real.
        'diffuseColor.a *= smoothstep(0.035,0.28,max(diffuseColor.g,diffuseColor.r*0.38));\n'+
        (fadeBottom?'diffuseColor.a *= smoothstep(0.0,0.025,vMapUv.y-'+fadeBottom.toFixed(6)+');\n':''));
    };
    mat.customProgramCacheKey=()=> 'v208-fire-only-'+fadeBottom;
    return mat;
  }
  function face(z,angle){
    const width=.34,height=width*340/320;
    const geo=new THREE.PlaneGeometry(width,height);
    const uv=geo.attributes.uv;
    for(let i=0;i<uv.count;i++)uv.setY(i,1-340/620+uv.getY(i)*340/620);
    const mesh=new THREE.Mesh(geo,fireMaterial(.90,1-340/620));
    // Centro do aro (160,267) exatamente sobre o centro da pedra.
    mesh.position.set(0,(267-170)*width/320,z);mesh.rotation.y=angle;
    mesh.name='Cabeca_Aro_Chamas_8Quadros';headRoot.add(mesh);planes.push(mesh);
    return mesh;
  }
  sprite=face(.048,0);face(-.048,Math.PI);
  // Contorno físico fecha o efeito entre as faces e acompanha a lâmina.
  const rim=new THREE.Mesh(new THREE.TorusGeometry(.11,.0045,6,40),
    new THREE.MeshBasicMaterial({color:0xff921b,transparent:true,opacity:.8,
      blending:THREE.AdditiveBlending,depthWrite:false,toneMapped:false}));
  rim.scale.set(1.43,.65,.9);rim.name='Brasa_Contorno_Pedra';headRoot.add(rim);
  // Película de fogo cilíndrica ao redor do cabo EXISTENTE, sem outro cabo.
  const shaftGeo=new THREE.CylinderGeometry(.029,.027,.48,20,10,true);
  const shaftUV=shaftGeo.attributes.uv;
  for(let i=0;i<shaftUV.count;i++){
    const u=shaftUV.getX(i),v=shaftUV.getY(i);
    shaftUV.setXY(i,.5+.17*Math.cos(u*Math.PI*2),1-572/620+v*(572-330)/620);
  }
  const shaft=new THREE.Mesh(shaftGeo,fireMaterial(.84,1-572/620));
  shaft.position.set(0,-.04,0);shaft.name='Fogo_Sobre_Cabo_Original';
  fireGroup.add(shaft);planes.push(shaft);
  const sparksGeo=new THREE.BufferGeometry();
  sparksGeo.setAttribute('position',new THREE.BufferAttribute(new Float32Array(18*3),3));
  const sparks=new THREE.Points(sparksGeo,new THREE.PointsMaterial({color:0xff9b21,
    size:.006,transparent:true,opacity:.85,depthWrite:false,
    blending:THREE.AdditiveBlending,toneMapped:false}));
  sparks.name='Fagulhas_Machado';headRoot.add(sparks);
  fireGroup.userData.planes=planes;fireGroup.userData.sparks=sparks;fireGroup.userData.rim=rim;
  const light=new THREE.PointLight(0xff7926,.39,2.4,2);
  light.position.set(.04,.32,0);fireGroup.add(light);
  fireGroup.userData.light=light;
  axe.add(fireGroup);state.fireRoot=fireGroup;frameIndex=-1;
  return true;
}
function orientSprite(){
  // A hierarquia da arma aplica a pose final durante o render, inclusive
  // quando a animação da mão atualiza depois do callback de fogo.
}

function destroyBurn(entry){if(entry.fx)entry.fx.removeFromParent();}
function addBurn(target){
  if(!target?.root || typeof target.hit!=='function')return;
  const key=target.root.uuid,now=performance.now();
  const old=burning.get(key);
  if(old){old.until=now+FIRE_TIME;old.hit=target.hit;return;}
  const fx=new THREE.Group();fx.name='FLORESTA_V203_Inimigo_Queimando';
  const mat=new THREE.SpriteMaterial({map:textures[0],transparent:true,opacity:.54,
    depthTest:true,depthWrite:false,toneMapped:false});
  const flame=new THREE.Sprite(mat);flame.scale.set(.44,.85,1);
  flame.position.y=.12;fx.add(flame);
  const light=new THREE.PointLight(0xff6a20,.2,2.2,2);fx.add(light);
  fx.position.y=Number.isFinite(target.height)?target.height*.45:.58;
  target.root.add(fx);
  burning.set(key,{root:target.root,fx,flame,light,hit:target.hit,
    until:now+FIRE_TIME,next:now+TICK_MS});
}
function liveTargets(){
  const all=[];
  try{all.push(...(window.gameZombie?.combatTargets?.()||[]));}catch(_){}
  try{all.push(...(window.gameSpecialCreatures?.combatTargets?.()||[]));}catch(_){}
  return all.filter(t=>t?.root && typeof t.hit==='function');
}
function liveEnemies(){
  return [...(window.gameZombie?.zombies||[]),...(window.gameSpecialCreatures?.all||[])]
    .filter(e=>e?.root && e.alive && Number.isFinite(e.hp));
}
function handleAxeImpact(){
  if(!active() || !currentAxe())return;
  const snapshot=liveEnemies().map(e=>({root:e.root,hp:e.hp,enemy:e}));
  queueMicrotask(()=>{
    const targets=liveTargets();
    for(const s of snapshot){
      if(!(s.enemy.hp<s.hp) || !s.enemy.alive)continue;
      const target=targets.find(t=>t.root===s.root);
      if(target)addBurn(target);
    }
  });
}
function update(now){
  const live=active(),axe=currentAxe();
  if(live && axe && textureReady){
    if(attach()){
      const frame=Math.floor(now/(1000/FPS))%8;
      if(frame!==frameIndex){frameIndex=frame;for(const plane of fireGroup.userData.planes)plane.material.map=textures[frame];}
      orientSprite();
      const sparks=fireGroup.userData.sparks.geometry.attributes.position;
      for(let i=0;i<sparks.count;i++){
        const t=(now*.00048+i*.61803398875)%1,angle=i*2.39996;
        sparks.setXYZ(i,Math.cos(angle)*(.10+t*.11),.025+t*.34,
          Math.sin(angle)*(.035+t*.075));
      }
      sparks.needsUpdate=true;
      fireGroup.userData.rim.material.opacity=.65+.2*Math.abs(Math.sin(now*.013));
      fireGroup.userData.light.intensity=.28+.14*Math.abs(Math.sin(now*.013));
    }
  }else if(fireGroup){fireGroup.visible=false;}
  for(const [key,e] of burning){
    if(now>=e.until || !e.root.parent){destroyBurn(e);burning.delete(key);continue;}
    const frame=Math.floor(now/(1000/FPS))%8;
    if(e.frame!==frame){e.frame=frame;e.flame.material.map=textures[frame];}
    e.flame.material.opacity=.34+.12*Math.abs(Math.sin(now*.013));
    e.light.intensity=.11+.16*Math.abs(Math.sin(now*.009));
    if(now>=e.next){
      e.next=now+TICK_MS;
      try{e.hit(TICK_DAMAGE);}catch(err){console.warn('[FLORESTA V203] Queimadura',err);}
    }
  }
  requestAnimationFrame(update);
}
function install(){
  if(started)return true;
  THREE=window.__THREE_MODULE||window.THREE;
  if(!THREE || !window.gameHerbalAlchemy || !window.gameRightHand)return false;
  started=true;
  try{loadTextures();}catch(err){console.error('[FLORESTA V208]',err);imageErrors++;}
  window.addEventListener('game:axe-impact',handleAxeImpact,true);
  requestAnimationFrame(update);
  console.info('[FLORESTA] V208: aro e chamas na cabeça, fogo sobre o cabo original em 3D');
  return true;
}
window.gameFlameV203={get ready(){return textureReady;},get framesLoaded(){return textures.filter(Boolean).length;},
  get errors(){return imageErrors;},get active(){return active();},attach,
  get burningEnemies(){return burning.size;},get sprite(){return sprite;},
  get anchor(){return fireGroup;},get originalSprite(){return !!sprite?.material?.map;}};
let tries=0;
(function wait(){if(install())return;if(++tries<360)setTimeout(wait,350);})();
})();

