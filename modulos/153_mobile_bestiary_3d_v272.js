/* FLORESTA V272: inspecao 3D dos modelos VERDADEIROS (mobile).
   Modelos independentes do mundo: nada de spawn, dano, IA ou saves extras. */
(()=>{'use strict';
if(window.__CAVE_PLATFORM!=='mobile'||window.FlorestaBestiary3D)return;
const d=document,$=id=>d.getElementById(id),T=window.__THREE_MODULE;
if(!T?.WebGLRenderer||!T?.Scene){console.warn('[Bestiário 3D] Three.js ainda não disponível');return;}
let current='skeleton',status='aguardando',viewer=null,canvas=null,renderer=null,stage=null;
let scene=null,camera=null,pivot=null,model=null,renderId=0,rendering=false,lastFrame=0,zoom=1,angle=0,pitch=.06,baseDistance=4;
let pointers=new Map(),lastPinch=0,lastTry=0;
const valid=new Set(['skeleton','wolf','necromancer','centaur-skeleton','centaur-fire','spider','unknown']);
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const opened=()=>!!$('directorOverlay')?.classList.contains('open')&&!!$('v269Bestiary')?.isConnected;
function message(txt){status=txt;const el=$('v272ViewerStatus');if(el){el.hidden=!txt;el.textContent=txt;}}
function removeModel(){if(pivot)while(pivot.children.length)pivot.remove(pivot.children[0]);model=null;}
function dispose(){
 rendering=false;if(renderId){cancelAnimationFrame(renderId);renderId=0;}
 pointers.clear();lastPinch=0;removeModel();
 if(renderer){try{renderer.dispose();renderer.forceContextLoss?.();}catch(e){console.warn('[Bestiário 3D] Renderização encerrada',e);}renderer=null;}
 scene=null;camera=null;pivot=null;canvas=null;stage=null;viewer=null;
}
function makeViewer(){
 const host=$('v269CreatureArt');if(!host)return false;
 if(viewer?.isConnected&&host.contains(viewer))return true;
 dispose();
 viewer=d.createElement('section');viewer.id='v272Viewer';
 viewer.setAttribute('aria-label','Modelo real em três dimensões, gire com o dedo');
 viewer.innerHTML='<div id="v272RenderStage"></div><p id="v272ViewerStatus" role="status">Preparando modelo 3D…</p><div id="v272ViewerToolbar"><span>ARRASTE PARA GIRAR · PINÇA PARA ZOOM</span><button type="button" data-v272="minus" aria-label="Afastar câmera">−</button><button type="button" data-v272="plus" aria-label="Aproximar câmera">+</button><button type="button" data-v272="reset" aria-label="Centralizar modelo">⟲</button></div>';
 host.replaceChildren(viewer);
 stage=$('v272RenderStage');
 viewer.addEventListener('click',e=>{
  const b=e.target.closest?.('[data-v272]');if(!b)return;
  e.preventDefault();e.stopPropagation();
  const a=b.dataset.v272;if(a==='plus')zoom=clamp(zoom*.80,.4,3.2);
  else if(a==='minus')zoom=clamp(zoom*1.25,.4,3.2);
  else{zoom=1;angle=0;pitch=.06;}
 });
 return true;
}
function initRenderer(){
 if(renderer)return true;
 if(!makeViewer())return false;
 try{
  canvas=d.createElement('canvas');canvas.id='v272ModelCanvas';canvas.setAttribute('aria-label','Arraste para girar a criatura em 3D');
  canvas.style.touchAction='none';
  stage.append(canvas);
  renderer=new T.WebGLRenderer({canvas,alpha:true,antialias:false,powerPreference:'low-power',preserveDrawingBuffer:false});
  renderer.setPixelRatio(Math.min(1.25,Number(window.devicePixelRatio)||1));
  renderer.setClearColor(0x151917,0);
  scene=new T.Scene();
  camera=new T.PerspectiveCamera(37,1,.02,300);
  const hemi=new T.HemisphereLight(0xdce9cf,0x55493b,1.8);scene.add(hemi);
  const key=new T.DirectionalLight(0xffe0b4,2.0);key.position.set(2,5,8);scene.add(key);
  const rim=new T.DirectionalLight(0x728f9e,1.6);rim.position.set(-6,3,-5);scene.add(rim);
  pivot=new T.Group();scene.add(pivot);
  canvas.addEventListener('pointerdown',e=>{
   if(e.pointerType==='mouse'&&e.button!==0)return;
   e.preventDefault();e.stopPropagation();canvas.setPointerCapture?.(e.pointerId);
   pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});
   lastPinch=0;
  },{passive:false});
  canvas.addEventListener('pointermove',e=>{
   const p=pointers.get(e.pointerId);if(!p)return;
   e.preventDefault();e.stopPropagation();
   const dx=e.clientX-p.x,dy=e.clientY-p.y;p.x=e.clientX;p.y=e.clientY;
   if(pointers.size===1){
    angle+=dx*.012;
    pitch=clamp(pitch+dy*.007,-.48,.48);
   }else if(pointers.size>=2){
    const pair=[...pointers.values()].slice(0,2);
    const distance=Math.hypot(pair[0].x-pair[1].x,pair[0].y-pair[1].y);
    if(lastPinch>0&&distance>0)zoom=clamp(zoom*lastPinch/distance,.4,3.2);
    lastPinch=distance;
   }
  },{passive:false});
  const done=e=>{if(!pointers.has(e.pointerId))return;e.preventDefault();e.stopPropagation();pointers.delete(e.pointerId);lastPinch=0;};
  canvas.addEventListener('pointerup',done,{passive:false});
  canvas.addEventListener('pointercancel',done,{passive:false});
  canvas.addEventListener('lostpointercapture',e=>{pointers.delete(e.pointerId);lastPinch=0});
  canvas.addEventListener('wheel',e=>{e.preventDefault();e.stopPropagation();zoom=clamp(zoom*(e.deltaY>0?1.1:.9),.4,3.2)},{passive:false});
  return true;
 }catch(error){message('Não foi possível iniciar a prévia 3D neste aparelho.');console.warn('[Bestiário 3D]',error);return false;}
}
function sourceModel(id){
 if(['skeleton','necromancer','centaur-skeleton','centaur-fire'].includes(id))
  return window.gameUndeadForces?.previewModel?.(id)||null;
 if(id==='wolf'){
  const original=window.gameWerewolf?.root;
  if(!original)return null;
  const copy=original.clone(true);
  copy.position.set(0,0,0);
  copy.rotation.set(0,0,0);
  copy.visible=true;
  return copy;
 }
 if(id==='spider')return window.gameCreativeSpiderMount?.previewModel?.()||null;
 return null;
}
function load(id){
 if(!renderer||!scene||!pivot)return false;
 removeModel();
 if(id==='unknown'){message('Criatura desconhecida. O modelo será mostrado quando estiver identificado.');return false;}
 let copy=null;
 try{copy=sourceModel(id);}catch(error){console.warn('[Bestiário 3D] Modelo',id,error);message('Falha ao preparar o modelo da criatura.');return false;}
 if(!copy){message('Modelo 3D original ainda carregando.');return false;}
 model=copy;model.visible=true;
 model.traverse(o=>{if(o.isMesh||o.isSkinnedMesh)o.frustumCulled=false});
 model.updateMatrixWorld(true);
 const bbox=new T.Box3().setFromObject(model);
 if(bbox.isEmpty()){removeModel();message('O modelo ainda não possui malha 3D carregada.');return false;}
 const size=bbox.getSize(new T.Vector3()),center=bbox.getCenter(new T.Vector3());
 if(!Number.isFinite(size.length())||size.length()<.0001){removeModel();message('Geometria da criatura indisponível.');return false;}
 const holder=new T.Group();holder.position.copy(center).multiplyScalar(-1);holder.add(model);pivot.add(holder);
 const largest=Math.max(size.x,size.y,size.z,.7);
 baseDistance=clamp(largest/(2*Math.tan(camera.fov*Math.PI/360))*1.65,1,175);
 zoom=1;angle=0;pitch=.06;
 message('');status='pronto';return true;
}
function frame(t){
 if(!rendering)return;renderId=requestAnimationFrame(frame);
 if(!opened()){stop();return;}
 if(t-lastFrame<40)return;lastFrame=t;
 if(!renderer||!camera||!model)return;
 const box=stage?.getBoundingClientRect();
 if(!box||box.width<10||box.height<10)return;
 const width=Math.max(60,Math.min(720,Math.round(box.width))),height=Math.max(80,Math.min(650,Math.round(box.height)));
 if(canvas.width!==Math.ceil(width*renderer.getPixelRatio())||canvas.height!==Math.ceil(height*renderer.getPixelRatio())){
  renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();
 }
 pivot.rotation.y=angle;pivot.rotation.x=pitch;
 camera.position.set(0,0,baseDistance*zoom);
 camera.lookAt(0,0,0);
 try{renderer.render(scene,camera)}catch(e){console.warn('[Bestiário 3D] Frame',e);message('Problema ao renderizar a criatura.');stop();}
}
function stop(){rendering=false;if(renderId){cancelAnimationFrame(renderId);renderId=0;}dispose();}
function select(id){
 const value=valid.has(id)?id:'unknown';
 if(current!==value){current=value;lastTry=0;removeModel();}
 if(!opened())return;
 if(!initRenderer())return;
 if(!model&&value!=='unknown')load(value);
 else if(value==='unknown')message('A criatura não possui um modelo 3D identificado.');
 if(!rendering){rendering=true;lastFrame=0;renderId=requestAnimationFrame(frame);}
}
function monitor(){
 if(!opened()){
  if(renderer)stop();
  return;
 }
 const requested=window.FlorestaMobile269Creatures?.selected||current;
 if(!viewer?.isConnected||!renderer||current!==requested)select(requested);
 else if(!model&&current!=='unknown'&&performance.now()-lastTry>1300){lastTry=performance.now();load(current);}
}
const syncTimer=setInterval(monitor,400);
window.addEventListener('pagehide',()=>{clearInterval(syncTimer);stop()},{once:true});
window.FlorestaBestiary3D={version:'V272',select,get selected(){return current},get status(){return status},stop};
monitor();
})();