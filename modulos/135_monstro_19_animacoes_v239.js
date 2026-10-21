/* FLORESTA V246 — golpes centralizados e combos variados preservando FBX animado com UV exatamente igual ao GLB e sem textura invertida.
   Os dois modelos têm malha idêntica (18.606 vértices; 20.276 triângulos e mesmos UVs).
   Aplicar o material PBR do GLB ao SkinnedMesh FBX elimina retarget incompatível.
   Frente = +Z: yaw de perseguição NÃO deve incluir PI. */
(async function(){
 'use strict';
 if(window.__FLORESTA_MONSTRO_V239__)return;
 window.__FLORESTA_MONSTRO_V239__=true;
 const sleep=ms=>new Promise(resolve=>setTimeout(resolve,ms));
 const state={ready:false,modelLoaded:false,animationsLoaded:0,error:null,spawned:0,pending:0,uiReady:false,loading:true,source:'',phase:'iniciando',lastSpawnError:null};
 window.gameNewMonster={state,get active(){return enemies.filter(e=>e.alive);},spawn:(n=1)=>requestSpawn(n),damageRadius:(x,z,r,d)=>damageRadius(x,z,r,d)};
 let game,T,sourceModel,visualTemplate,sourceClips=[],bonesFBX=[],srcRest=new Map(),targetRest=new Map(),rigMapping=[];
 const enemies=[];const MAX_PC=3,MAX_MOBILE=2,HP=230,DIST=3.0;
 // Director controls are registered SYNCHRONOUSLY before any GLB/FBX request.
 // The old version registered only after full asset loading, leaving spawn missing.
 function showStatus(message,error=false){
  state.lastMessage=message;
  const el=document.getElementById('directorMonsterStatus239')||document.getElementById('directorMessage');
  if(el){el.textContent=message;el.style.color=error?'#ffb2a3':'#c6e0c1';}
 }
 function requestSpawn(n=1){
  const count=Math.max(1,Math.min(3,Math.trunc(Number(n)||1)));
  if(state.error){showStatus('Monstro indisponível: '+String(state.error).slice(0,190),true);return 0;}
  if(!state.ready){state.pending=Math.min(3,state.pending+count);showStatus('Carregando modelo e animações... Spawn solicitado ('+state.pending+').');return 0;}
  try{
   // Testa criação REAL do objeto 3D e sua inserção na cena antes de confirmar.
   const made=spawn(count,true);
   if(made)showStatus(made+' Monstro Lutador criado na cena! Feche o Diretor para ver (aprox. 6 m à frente).');
   else showStatus('Nenhum monstro criado: limite de inimigos simultâneos atingido.',true);
   return made;
  }catch(err){
   state.lastSpawnError=String(err?.stack||err);console.error('[V241] Falha real ao spawnar:',err);
   showStatus('FALHA NO SPAWN: '+String(err?.message||err).slice(0,200),true);
   return 0;
  }
 }
 function wireDirector(){
  const select=document.getElementById('directorCreature');
  if(select&&!select.querySelector('option[value="lutador-v239"]')){
   const op=document.createElement('option');op.value='lutador-v239';op.textContent='Monstro Lutador (19 animações)';select.appendChild(op);
  }
  const quick=document.querySelector('#directorPanel .director-quick');
  if(quick&&!document.getElementById('directorSpawnLutador239')){
   const button=document.createElement('button');button.id='directorSpawnLutador239';button.type='button';button.textContent='+1 Monstro Lutador';quick.appendChild(button);
  }
  const button=document.getElementById('directorSpawnLutador239');
  if(button&&!button.__wiredMonstro240){button.__wiredMonstro240=true;button.addEventListener('click',event=>{event.preventDefault();event.stopImmediatePropagation();requestSpawn(1);});}
  const general=document.getElementById('directorSpawn');
  if(general&&!general.__wiredMonstro240){general.__wiredMonstro240=true;
   general.addEventListener('click',event=>{
    if(document.getElementById('directorCreature')?.value!=='lutador-v239')return;
    event.preventDefault();event.stopImmediatePropagation();
    requestSpawn(document.getElementById('directorQuantity')?.value||1);
   },true);
  }
  if(window.gameDirector)window.gameDirector.spawnLutador=(n=1)=>requestSpawn(n);
  state.uiReady=!!button&&!!select;
 }
 wireDirector();
 window.addEventListener('DOMContentLoaded',wireDirector,{once:true});

  const mobile=()=>window.__CAVE_PLATFORM==='mobile'||!!window.__FOREST_MOBILE_BUILD__||location.search.includes('platform=mobile');
  let telegraphMaterial=null;
  function makeTelegraph(){
   if(!telegraphMaterial){const c=document.createElement('canvas');c.width=c.height=96;const ctx=c.getContext('2d');
    ctx.fillStyle='rgba(66,28,6,.82)';ctx.beginPath();ctx.arc(48,48,37,0,Math.PI*2);ctx.fill();
    ctx.strokeStyle='#ffd28a';ctx.lineWidth=5;ctx.stroke();ctx.font='bold 65px sans-serif';ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillStyle='#fff0c8';ctx.fillText('!',48,50);
    telegraphMaterial=new T.SpriteMaterial({map:new T.CanvasTexture(c),transparent:true,depthTest:true,depthWrite:false});}
   const spr=new T.Sprite(telegraphMaterial);spr.position.set(0,3.52,0);spr.scale.set(.58,.58,1);spr.visible=false;return spr;
  }
 const vec=()=>new T.Vector3(),quat=()=>new T.Quaternion();
 const byName=(list,name)=>list.find(b=>b.name.toLowerCase().replace(/[^a-z0-9]/g,'').replace(/^mixamorig/,'')===name.toLowerCase())||null;
 const boneId=(list,num)=>list.find(b=>b.name===`Bone_${String(num).padStart(3,'0')}`)||null;
 const tmpV=()=>new T.Vector3();
 async function waitDependencies(){for(let i=0;i<1200;i++){
   if(window.gameReview?.scene&&window.gameReview?.player&&window.__THREE_MODULE&&window.__FBX_MODULE?.FBXLoader&&window.__FOREST_GLTF_LOADER)break;
   await sleep(35);
  }
  game=window.gameReview;T=window.__THREE_MODULE;
  if(!game?.scene||!game?.groundY||!T||!window.__FOREST_GLTF_LOADER||!window.__FBX_MODULE?.FBXLoader)throw Error('Motor 3D / carregadores indisponíveis');
 }
 const embeddedScripts={glb:'assets/monstro-v239/lutador-glb-offline-v241.js',fbx:'assets/monstro-v239/lutador-fbx-offline-v241.js'};
 function loadLocalScript(src){return new Promise((resolve,reject)=>{
  const tag=document.createElement('script');tag.src=src;tag.onload=()=>resolve();
  tag.onerror=()=>reject(Error('Não foi possível abrir '+src+'. Extraia o ZIP inteiro, mantendo a pasta assets.'));
  document.head.appendChild(tag);
 });}
 function decodeBase64Parts(parts,kind){
  if(!Array.isArray(parts)||!parts.length)throw Error('Asset '+kind+' offline não encontrado');
  const total=parts.reduce((sum,p)=>sum+3*(p.length/4)-(p.endsWith('==')?2:p.endsWith('=')?1:0),0);
  const output=new Uint8Array(total);let offset=0;
  for(const encoded of parts){const chunk=atob(encoded);
   for(let i=0;i<chunk.length;i++)output[offset++]=chunk.charCodeAt(i);
  }
  return output.buffer;
 }
 async function fetchBuffer(url,kind){
  if(location.protocol!=='file:'){
   try{
    const response=await fetch(url,{cache:'force-cache'});
    if(!response.ok)throw Error('HTTP '+response.status);
    state.source='arquivos HTTP';return await response.arrayBuffer();
   }catch(err){console.warn('[V241] Download falhou, tentando arquivo local incluído no ZIP:',url,err);}
  }
  state.phase='lendo arquivo offline '+kind;
  showStatus('Carregando '+kind.toUpperCase()+' local (modo offline)...');
  const prop='__FLORESTA_LUTADOR_V241_'+kind.toUpperCase();
  if(!window[prop])await loadLocalScript(embeddedScripts[kind]);
  const data=decodeBase64Parts(window[prop],kind);
  // Libera os ~30 MB de texto codificado assim que o modelo é convertido.
  delete window[prop];state.source='arquivos locais integrados';return data;
 }
 function allBones(obj){const out=[];obj.traverse(n=>{if(n.isBone)out.push(n);});return out;}
 async function loadAssets(){
  const dir='assets/monstro-v239/';
  const [glbBin,fbxBin]=await Promise.all([fetchBuffer(dir+'Monstro_Texturizado.glb','glb'),fetchBuffer(dir+'Personagem_19_Animacoes_Integradas.fbx','fbx')]);
  const glb=await new Promise((resolve,reject)=>new window.__FOREST_GLTF_LOADER().parse(glbBin,'',resolve,reject));
  visualTemplate=glb.scene;
  if(!visualTemplate)throw Error('GLB sem cena 3D');
  state.modelLoaded=true;
  try {sourceModel=new window.__FBX_MODULE.FBXLoader().parse(fbxBin,dir);
   if(!sourceModel)throw Error('FBX vazio');
   sourceClips=(sourceModel.animations||[]).filter(c=>c?.duration>0);
  }catch(err){
   console.warn('[V241] FBX não abriu, mantendo monstro GLB visível sem animação:',err);
   state.animationWarning=String(err?.message||err);sourceModel=new T.Group();sourceClips=[];
  }
  // V243: remove o deslocamento de raiz que era somado ao movimento da IA.
  // Reorienta os takes Mixamo em +Z sem alterar a geometria ou os 34 ossos da skin.
  // As rotações locais dos demais ossos e a altura do quadril são preservadas.
  function normalizeForGame(clips){
   let adjusted=0;
   for(const clip of clips){
    const hips=clip.tracks.find(t=>/mixamorigHips\.quaternion$/i.test(t.name));
    const motion=clip.tracks.find(t=>/mixamorigHips\.position$/i.test(t.name));
    if(hips&&hips.values.length>=4){
     const vals=hips.values;
     const first=new T.Quaternion(vals[0],vals[1],vals[2],vals[3]);
     const forward=new T.Vector3(0,0,1).applyQuaternion(first);
     const yaw=Math.atan2(forward.x,forward.z);
     const zeroYaw=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-yaw);
     for(let i=0;i<vals.length;i+=4){
      const q=new T.Quaternion(vals[i],vals[i+1],vals[i+2],vals[i+3]);
      q.premultiply(zeroYaw).normalize();
      // Correção adicional apenas para a corrida curva: a IA percorre linha reta.
      if(clip.name==='Run_Arc_Left'){
       const f=new T.Vector3(0,0,1).applyQuaternion(q);
       const a=Math.atan2(f.x,f.z),limit=.20;
       if(Math.abs(a)>limit){
        const corr=new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),-(a-Math.sign(a)*limit));
        q.premultiply(corr).normalize();
       }
      }
      vals[i]=q.x; vals[i+1]=q.y; vals[i+2]=q.z; vals[i+3]=q.w;
     }
     adjusted++;
    }
    if(motion&&motion.values.length>=3){
     const v=motion.values,x0=v[0],z0=v[2];
     for(let i=0;i<v.length;i+=3){
      // Apenas a oscilação curta da pose; passos reais são aplicados pela IA.
      v[i]=x0+Math.max(-.18,Math.min(.18,(v[i]-x0)*.16));
      v[i+2]=z0+Math.max(-.18,Math.min(.18,(v[i+2]-z0)*.16));
     }
    }
   }
   state.clipsNormalized=adjusted;
   console.info('[Floresta V243] 19 clipes Mixamo: frente estabilizada, deslocamento raiz removido',adjusted);
  }
  normalizeForGame(sourceClips);
  // V246: os takes de soco original Mixamo giram o quadril ate ~64 graus
  // durante o golpe. Isso aponta o tronco/punhos para o lado, embora a IA
  // mantenha o grupo principal voltado ao jogador.
  // Neutraliza apenas 82% do giro horizontal LOCAL DO QUADRIL nos ataques.
  // Os ombros, bracos, pernas, oscilacao vertical, skin, materiais e UV ficam
  // intactos; preserva ~18% da rotacao para o soco continuar expressivo.
  function centerAttackHips(clips){
   let fixed=0,maxBefore=0,maxAfter=0;
   const forward=new T.Vector3(0,0,1),up=new T.Vector3(0,1,0);
   const localQ=new T.Quaternion(),yawCorrection=new T.Quaternion();
   const tempForward=new T.Vector3();
   for(const clip of clips){
    if(!/^(?:Boxing(?:_[0-8])?|Headbutt)$/i.test(clip.name))continue;
    const track=clip.tracks.find(t=>/mixamorigHips\.quaternion$/i.test(t.name));
    if(!track)continue;
    const v=track.values,retain=clip.name==='Headbutt'?.27:.18;
    for(let i=0;i<v.length;i+=4){
     localQ.set(v[i],v[i+1],v[i+2],v[i+3]).normalize();
     tempForward.copy(forward).applyQuaternion(localQ);
     const currentYaw=Math.atan2(tempForward.x,tempForward.z);
     maxBefore=Math.max(maxBefore,Math.abs(currentYaw));
     yawCorrection.setFromAxisAngle(up,-currentYaw*(1-retain));
     localQ.premultiply(yawCorrection).normalize();
     v[i]=localQ.x;v[i+1]=localQ.y;v[i+2]=localQ.z;v[i+3]=localQ.w;
     tempForward.copy(forward).applyQuaternion(localQ);
     maxAfter=Math.max(maxAfter,Math.abs(Math.atan2(tempForward.x,tempForward.z)));
    }
    fixed++;
   }
   state.strikesCentered=fixed;
   state.maxYawBeforeDeg=+(maxBefore*180/Math.PI).toFixed(1);
   state.maxYawAfterDeg=+(maxAfter*180/Math.PI).toFixed(1);
   console.info('[Floresta V246] Ataques dirigidos ao centro:',fixed,
      'clipes | yaw max:',state.maxYawBeforeDeg,'=>',state.maxYawAfterDeg,'graus');
  }
  centerAttackHips(sourceClips);
  state.animationsLoaded=sourceClips.length;
  bonesFBX=allBones(sourceModel);
  const glbMeshes=[],fbxMeshes=[];
  visualTemplate.traverse(n=>{if(n.isMesh||n.isSkinnedMesh)glbMeshes.push(n);});
  sourceModel.traverse(n=>{if(n.isSkinnedMesh)fbxMeshes.push(n);});
  if(!fbxMeshes.length)throw Error('Arquivo FBX não contém malha animada com skinning.');
  if(!glbMeshes.length)throw Error('GLB sem malha com material/colorido.');
  // Este par de arquivos utiliza a mesma geometria e UVs. Não copiamos ossos,
  // transformações nem pesos do GLB: apenas material, texturas e UV se necessário.
  const glbMesh=glbMeshes.find(n=>n.material?.map)||glbMeshes[0];
  const fbxMesh=fbxMeshes[0];
  const visGeom=glbMesh.geometry;
  const srcGeom=fbxMesh.geometry;
  if(!srcGeom?.attributes?.skinIndex||!srcGeom?.attributes?.skinWeight)
    throw Error('Malha FBX sem pesos de skinning: impossível animar corretamente.');
  const srcUV=srcGeom?.getAttribute?.('uv');
  if(!srcUV)throw Error('Malha FBX sem UV para a textura colorida original.');
  if(!glbMesh.material?.map)throw Error('GLB sem mapa de textura colorido.');
  // V244: bug CONFIRMADO, não estimativa. O FBXLoader fornece V do FBX
  // invertido em relação ao atributo TEXCOORD_0 do GLB: GLB.v = 1 - FBX.v.
  // Aplicar o material GLTF (map.flipY=false) sem corrigir o UV colocava cores
  // da armadura no rosto/corpo e deixava a pele do orc preta/multicolorida.
  // Malha e skin continuam FBX originais; alteramos apenas a orientação do UV.
  for(const fbx of fbxMeshes){
   const geom=fbx.geometry;
   const attr=geom?.getAttribute?.('uv');
   if(!attr)continue;
   if(!geom.userData.__v244UVAlignedToGLB){
    for(let i=0;i<attr.count;i++)attr.setY(i,1-attr.getY(i));
    attr.needsUpdate=true;
    geom.userData.__v244UVAlignedToGLB=true;
   }
  }
  state.uvCorrected=true;state.textureCheck='FBX v invertido para coincidir com GLB TEXCOORD_0';
  const bounds=new T.Box3().setFromObject(sourceModel),dims=bounds.getSize(vec());
  const height=Math.max(.1,dims.y),scale=Math.min(10,2.85/height);
  state.geometryHeight=dims.y;
  state.rigPairs=bonesFBX.length;
  state.scale=scale;
  state.meshOffset=[-(bounds.min.x+bounds.max.x)*.5*scale,-bounds.min.y*scale,-(bounds.min.z+bounds.max.z)*.5*scale];
  state.skinMode='FBX original + textura GLB';
  state.textureMode='UV do FBX alinhado ao TEXCOORD_0 do GLB';
  state.materialSource=glbMesh.material;
  state.skinnedMeshCount=fbxMeshes.length;
  state.fbxVertexCount=srcGeom.getAttribute('position')?.count||0;
  state.glbVertexCount=visGeom?.getAttribute('position')?.count||0;
  // Mantém UV original do FBX. Como os dois assets foram derivados da mesma malha,
  // os UVs coincidem inclusive nas costuras, sem reprojeção borrada.
  console.info('[Floresta V242] Skin FBX direto / textura original GLB / clipes:',sourceClips.length,
               '/ ossos:',bonesFBX.length,'/ verts FBX:',state.fbxVertexCount);
 }
 function cloneSkinned(o){return window.__SKELETON_MODULE?.clone?.(o)||o.clone(true);}
 function createRig(){
  const enemy=new T.Group();enemy.name='Monstro_V244_Mixamo_UV_Corrigido';
  // O personagem visível é o PRÓPRIO FBX com seus ossos, pesos e ações originais.
  // Antes, uma marionete invisível movia um segundo esqueleto incompatível.
  const model=cloneSkinned(sourceModel);
  let count=0;
  model.traverse(o=>{
   if(!o.isSkinnedMesh)return;
   count++;
   // Visual GLB apenas como material. Malha e skin continuam sendo 100% FBX.
   const mat=Array.isArray(state.materialSource)
      ?state.materialSource.map(m=>m.clone())
      :state.materialSource.clone();
   const each=Array.isArray(mat)?mat:[mat];
   for(const m of each){
    if(m.map){m.map.flipY=false; if(T.SRGBColorSpace)m.map.colorSpace=T.SRGBColorSpace;}
    // V243: a textura original é extremamente escura e sumia na iluminação PSX.
    // Emissão suave da MESMA textura (não textura inventada, não substitui o shader).
    if(m.map&&'emissive' in m){
     m.emissive.set(0xffffff);
     m.emissiveMap=m.map;
     m.emissiveIntensity=.18;
    }
    m.side=T.DoubleSide;
    m.needsUpdate=true;
   }
   o.material=mat;o.visible=true;
   o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;
  });
  if(!count)throw Error('Clone FBX não possui malha skinned.');
  model.scale.setScalar(state.scale);
  model.position.fromArray(state.meshOffset);
  enemy.add(model);
  const mixer=new T.AnimationMixer(model),actions={};
  for(const clip of sourceClips)actions[clip.name]=mixer.clipAction(clip);
  return {enemy,model,puppet:model,mixer,actions,pairs:[]};
 }
 function transferPose(e){/* V242: desnecessário. AnimationMixer anima o esqueleto visível. */}
 function getAction(e,name){return e.actions[name]||e.actions[name.replaceAll('_',' ')]||null;}
 function play(e,name,repeat=true,blend=.18){
  const action=getAction(e,name)||getAction(e,'Idle');
  if(!action)return 0;
  if(e.activeAction===action&&action.isRunning())return action.getClip().duration;
  if(e.activeAction)e.activeAction.fadeOut(blend);
  action.enabled=true;action.reset().setEffectiveWeight(1).setEffectiveTimeScale(1);
  action.setLoop(repeat?T.LoopRepeat:T.LoopOnce,repeat?Infinity:1);
  action.clampWhenFinished=!repeat;action.fadeIn(blend).play();
  e.activeAction=action; e.animName=name;
  return action.getClip().duration||1;
 }
 // V245: golpes organizados em famílias e fila embaralhada, evitando repetição.
 // Boxing_7 é praticamente a mesma animação de Boxing; não conta como golpe novo.
 // A aparência (GLB+UV V244), o rig FBX e os 19 clipes ficam INTACTOS.
 const punchFamilies={
  Boxing:0, Boxing_2:0, Boxing_6:0, Boxing_8:0,
  Boxing_1:1, Boxing_3:1, Boxing_4:1,
  Boxing_5:2
 };
 const punchNames=Object.keys(punchFamilies);
 function pickPunch(e,previousFamily){
  const candidates=punchNames.filter(name=>!!getAction(e,name));
  if(!candidates.length)return 'Boxing';
  if(!e.punchBag||!e.punchBag.length)e.punchBag=candidates.slice();
  // Evita os últimos 3 movimentos e alterna grupos visuais quando possível.
  let choices=e.punchBag.filter(name=>!e.recentPunches.includes(name));
  if(!choices.length)choices=e.punchBag.slice();
  const alternates=choices.filter(name=>punchFamilies[name]!==previousFamily);
  if(alternates.length)choices=alternates;
  const chosen=choices[Math.floor(Math.random()*choices.length)];
  e.punchBag.splice(e.punchBag.indexOf(chosen),1);
  e.recentPunches.push(chosen);
  if(e.recentPunches.length>3)e.recentPunches.shift();
  return chosen;
 }
 function planCombo(e,d){
  // 20% um golpe, 43% dois, 31% três e 6% quatro golpes.
  // Combos longos são raros para dar tempo de reação ao jogador.
  const r=Math.random(),count=r<.20?1:r<.63?2:r<.94?3:4;
  const queue=[];
  let previous=e.lastPunchFamily;
  for(let i=0;i<count;i++){
   // Cabeçada apenas na finalização e sem repetir em combos consecutivos.
   if(i===count-1&&count>1&&d<2.8&&e.combosSinceHeadbutt>=2&&Math.random()<.26&&getAction(e,'Headbutt')){
    queue.push('Headbutt');e.combosSinceHeadbutt=0;break;
   }
   const name=pickPunch(e,previous);
   queue.push(name);previous=punchFamilies[name];
  }
  if(!queue.includes('Headbutt'))e.combosSinceHeadbutt++;
  e.lastPunchFamily=previous;
  return queue;
 }
 function startComboStrike(e,name,now){
  e.attackKind=name;
  e.attackAt=now;
  e.attackDone=false;
  const rawDuration=play(e,name,false,.11)||1.7;
  // Aceleração moderada mantém o golpe legível e melhora o ritmo dos combos.
  const rate=name==='Headbutt'?1.05:1.12+Math.random()*.12;
  const action=getAction(e,name);
  if(action)action.setEffectiveTimeScale(rate);
  e.attackDuration=rawDuration/rate;
  e.lastStrike=name;
  e.totalStrikes++;
 }
 function endCombo(e,now){
  e.attackAt=0;e.attackDuration=0;e.comboQueue.length=0;
  e.nextAttack=now+650+Math.random()*480;
  if(Math.random()<.5){e.retreatUntil=now+550+Math.random()*550;e.side*=-1;}
  play(e,'Fighting_Idle',true,.14);
 }
 function ground(x,z){const y=game.groundY(x,z);return Number.isFinite(y)?y:0;}
 function createEnemy(at=null,manual=false){
  if(!state.ready||enemies.filter(e=>e.alive).length>=(mobile()?MAX_MOBILE:MAX_PC))return null;
  const rig=createRig();
  if(!rig?.enemy||!rig.model)throw Error('Falha na montagem do rig 3D.');
  const p=game.player,theta=Math.random()*Math.PI*2,dist=manual?6.5:22+Math.random()*13;
  // Manual = toward player's horizontal look direction, not a random hidden spawn.
  const forward=vec();if(manual)game.camera.getWorldDirection(forward);
  const len=Math.hypot(forward.x,forward.z);if(manual&&len<.0001){forward.set(Math.sin(p.yaw||0),0,-Math.cos(p.yaw||0));}
  const dirLen=Math.max(.0001,Math.hypot(forward.x,forward.z));
  const x=at?.x??(manual?p.x+forward.x/dirLen*dist:p.x+Math.sin(theta)*dist),z=at?.z??(manual?p.z+forward.z/dirLen*dist:p.z+Math.cos(theta)*dist);
  rig.enemy.position.set(x,ground(x,z),z);
  game.scene.add(rig.enemy);
  if(rig.enemy.parent!==game.scene)throw Error('Falha ao adicionar monstro à cena Three.js.');
  // Indicação de posição, útil para ver onde o monstro apareceu e distinguir erro de visão.
  try{
   const canvas=document.createElement('canvas');canvas.width=512;canvas.height=96;
   const cx=canvas.getContext('2d');cx.fillStyle='rgba(19,17,15,0.82)';cx.fillRect(0,0,512,96);
   cx.strokeStyle='#eb9950';cx.lineWidth=5;cx.strokeRect(3,3,506,90);
   cx.fillStyle='#fff2d9';cx.font='bold 35px sans-serif';cx.textAlign='center';cx.fillText('MONSTRO LUTADOR',256,60);
   const tex=new T.CanvasTexture(canvas);const mat=new T.SpriteMaterial({map:tex,transparent:true,depthTest:false});
   const label=new T.Sprite(mat);label.position.y=3.7;label.scale.set(3.3,.62,1);label.renderOrder=950;
   rig.enemy.add(label);rig.spawnLabel=label;
   setTimeout(()=>{if(label.parent)label.removeFromParent();tex.dispose();mat.dispose();},12500);
  }catch(err){console.warn('[V241] Rótulo auxiliar indisponível',err);}
  const id=++state.spawned;
  const e={...rig,id,root:rig.enemy,hp:HP,maxHp:HP,alive:true,dying:false,manual,
    activeAction:null,animName:'',attackAt:0,attackDuration:0,attackDone:false,nextAttack:0,hitUntil:0,
    punchBag:[],recentPunches:[],lastPunchFamily:-1,comboQueue:[],combosSinceHeadbutt:2,totalStrikes:0,lastStrike:'',
    createdAt:performance.now(),deadAt:0,poise:0,lastSwordAt:0,step:0,speed:2.15+Math.random()*.4,hudKey:'v239-monstro-'+id, nextSpecial:performance.now()+3500+Math.random()*3000,specialUntil:0,retreatUntil:0,feintUntil:0,feintCooldown:0,counterUntil:0,side:Math.random()<.5?-1:1,flankUntil:0,lastMoveAt:performance.now(),lastMoveX:x,lastMoveZ:z};
  play(e,'Idle');
   e.telegraph=makeTelegraph();e.root.add(e.telegraph);
   enemies.push(e);
  window.gameEnemyOverheadUI?.registerExternal?.(e.hudKey,{root:e.root,type:'orc',name:'Monstro Lutador',fallbackHeight:2.9,headGap:.25,getHp:()=>e.hp,getMaxHp:()=>e.maxHp,isAlive:()=>e.alive&&!e.dying});
  return e;
 }
 function spawn(n=1,manual=false){let spawned=0;for(let i=0;i<Math.min(3,Math.max(1,Number(n)||1));i++)if(createEnemy(null,manual))spawned++;return spawned;}
 function faceAndRange(e){const diff=vec().set(e.root.position.x-game.player.x,0,e.root.position.z-game.player.z),range=diff.length();
  if(range>3.7)return false;
  const forward=vec();game.camera.getWorldDirection(forward);forward.y=0;forward.normalize();
  return range<.65||forward.dot(diff.normalize())>.45;
 }
 function damageEnemy(e,amount,source='Arma'){
  if(!e||!e.alive||e.dying||amount<=0)return false;
  const now=performance.now();if(now-(e.lastHit||0)<105)return false;e.lastHit=now;
  // Um golpe recebido interrompe o combo, para não causar dano durante a reação.
  e.attackAt=0;e.comboQueue.length=0;e.nextAttack=now+600;
  // Um adversário atingido pode tentar responder após recuperar a postura.
  if(e.hp>e.maxHp*.25&&Math.random()<.30)e.counterUntil=now+1500;
  if(source==='Espada'){if(now-e.lastSwordAt>3200)e.poise=0;e.lastSwordAt=now;e.poise=(e.poise||0)+1;}
  const broke=source==='Espada'&&e.poise>=3;if(broke)e.poise=0;
  e.hp=Math.max(0,e.hp-amount);
  if(!e.hp){e.dying=true;e.deadAt=now;play(e,'Receive_Uppercut_To_The_Face',false,.11);e.root.userData.defeated=true;
   window.gameProgression?.addXP?.(135);}
  else{e.hitUntil=now+(broke?850:390);if(broke){e.nextAttack=now+1150;window.dispatchEvent(new CustomEvent('game:posture-broken',{detail:{enemy:'Monstro Lutador',source:'Espada'}}));}play(e,broke?'Receive_Uppercut_To_The_Face':(Math.random()<.5?'Receive_Punch_To_The_Face':'Receive_Uppercut_To_The_Face'),false,.07);}
  return true;
 }
 function damageNearest(d){let best=null,dist=Infinity;for(const e of enemies){if(!e.alive||e.dying||!faceAndRange(e))continue;
   const x=e.root.position.x-game.player.x,z=e.root.position.z-game.player.z,dd=Math.hypot(x,z);if(dd<dist){dist=dd;best=e;}}
  if(best)return damageEnemy(best,d);return false;
 }
 function damageRadius(x,z,r,d){let n=0;for(const e of enemies){if(e.alive&&!e.dying&&Math.hypot(e.root.position.x-x,e.root.position.z-z)<=r&&damageEnemy(e,d,'Area'))n++;}return n;}
 function registerCombat(){const api=window.gameSpecialCreatures;
  if(!api?.combatTargets||api.__V239_LUTADOR_TARGETS__)return;
  const old=api.combatTargets.bind(api);
  api.combatTargets=()=>[...(old()||[]),...enemies.filter(e=>e.alive&&!e.dying).map(e=>({root:e.root,radius:.85,height:1.5,hit:(d,meta)=>damageEnemy(e,d,meta?.weapon==='sword'?'Espada':'Lança')}))];
  api.__V239_LUTADOR_TARGETS__=true;
 }
 let lastNight=0,lastAuto=0,lastDay=0;
 function autoSpawn(now){
  if(!state.ready||window.gameTestMode?.active||window.gameFront172?.shell?.hidden===false)return;
  const day=Number(game.dayNight?.day)||1,hour=Number(game.dayNight?.hour)||12;
  const night=hour>=19||hour<5.5;
  if(!night||day<2){lastNight=0;return;}
  if(lastNight!==day){lastNight=day;lastAuto=now+25000;}
  if(now<lastAuto||enemies.some(e=>e.alive&&!e.dying&&!e.manual))return;
  lastAuto=now+85000;
  if(Math.random()<.58)createEnemy();
 }
 function handleDirector(){wireDirector();}
  function clearEnemy(e){if(e.telegraph)e.telegraph.visible=false;e.alive=false;window.gameEnemyOverheadUI?.removeExternal?.(e.hudKey);e.root.removeFromParent();e.mixer.stopAllAction();}
  function attackLineClear(e){
   const p=game.player,dx=p.x-e.root.position.x,dz=p.z-e.root.position.z,len=Math.hypot(dx,dz);
   if(len>DIST||window.gameRoll?.active)return false;
   if(typeof game.collides!=='function')return true;
   try{for(let t=.55;t<len-.45;t+=.43)if(game.collides(e.root.position.x+dx*t/len,e.root.position.z+dz*t/len))return false;}catch(err){}
   return true;
  }
  function update(e,now,dt){
  if(!e.alive)return;
  const p=game.player,d=Math.hypot(p.x-e.root.position.x,p.z-e.root.position.z);
  const ai=window.FlorestaAI;
  if(e.dying){e.mixer.update(dt);transferPose(e);if(now-e.deadAt>350){e.root.rotation.z=Math.min(1.28,e.root.rotation.z+dt*1.05);}if(now-e.deadAt>2700)clearEnemy(e);return;}
  if(d>120){clearEnemy(e);return;}
  const menu=window.gameFront172?.shell?.hidden===false||document.getElementById('directorOverlay')?.classList.contains('open');
  if(menu){e.mixer.update(dt*.12);transferPose(e);return;}
  const angle=Math.atan2(p.x-e.root.position.x,p.z-e.root.position.z);
  // A frente deste Orc é +Z. Somar PI fazia ele golpear com as costas.
  e.root.rotation.y=angle;
  if(now<e.specialUntil){
   e.mixer.update(dt);transferPose(e);return;
  }
   if(e.telegraph)e.telegraph.visible=!!e.attackAt&&now>=e.attackAt&&now<e.attackAt+e.attackDuration*425&&d<10&&now>=e.hitUntil;
   if(e.attackAt){
    const elapsed=now-e.attackAt;
   if(!e.attackDone&&elapsed>e.attackDuration*460){e.attackDone=true;
     if(attackLineClear(e)&&window.gameZombie?.hurtPlayer)window.gameZombie.hurtPlayer(e.attackKind==='Headbutt'?22:13,'Monstro Lutador','lutador-v239');
   }
   if(elapsed>=e.attackDuration*1000){
    if(e.comboQueue.length&&d<DIST+.35&&now>=e.hitUntil){
     const next=e.comboQueue.shift();startComboStrike(e,next,now);
    }else endCombo(e,now);
   }
  }else if(now<e.hitUntil){ /* manter reação de golpe */ }
  // V258: falso avanço/ginga e recuo reais; não machuca o jogador durante a finta.
  else if(e.feintUntil>now){
   play(e,'Fighting_Idle',true,.08);
   if(d>2.15)ai?.walk(e.root,p.x-e.root.position.x,p.z-e.root.position.z,e.speed*.38,dt);
  }
  else if(e.retreatUntil>now&&d<5.0){
   const rx=e.root.position.x-p.x,rz=e.root.position.z-p.z;
   ai?.walk(e.root,rx+(-rz)*e.side*.48,rz+rx*e.side*.48,e.speed*.92,dt);
   play(e,'Orc_Walk',true,.13);
  }
  else if(d<DIST+.65&&now>e.feintCooldown&&Math.random()<dt*.26&&getAction(e,'Pivot')){
   const dur=play(e,'Pivot',false,.12);
   e.feintUntil=now+Math.min(750,Math.max(320,dur*450));
   e.feintCooldown=now+4400+Math.random()*2700;
   e.nextAttack=Math.max(e.nextAttack,e.feintUntil+120);
  }
  else if(d>3.0&&d<13&&now>e.nextSpecial){
   const animation=d<6?'Dodging':(Math.random()<.5?'Pivot':'Pivot_Reverse');
   const dur=play(e,animation,false,.09);
   e.specialUntil=now+(animation==='Dodging'?880:1200);
   const action=getAction(e,animation);
   if(action)action.setEffectiveTimeScale(Math.max(1.0,dur*1000/(e.specialUntil-now)));
   e.nextSpecial=now+7500+Math.random()*6500;
  }
  else if(d<DIST&&now>e.nextAttack){
   // Esquiva/ginga ocasional à curta distância, sem disparar a cada golpe.
   if(now>e.nextSpecial&&(Math.random()<.22||(now<e.counterUntil&&ai?.recentAttack(1500)))&&getAction(e,'Dodging')){
    const dur=play(e,'Dodging',false,.12);
    e.specialUntil=now+900;
    getAction(e,'Dodging').setEffectiveTimeScale(Math.max(1.0,dur/.9));
    e.nextSpecial=now+(now<e.counterUntil?3800:7200)+Math.random()*3400;
    e.counterUntil=0;e.nextAttack=now+870;
   }else{
    const queue=planCombo(e,d);
    e.comboQueue=queue.slice(1);
    startComboStrike(e,queue[0],now);
   }
  }else if(d<32&&d>2.2){
   const speed=d>11?e.speed*1.65:e.speed;
   // Aproxima pela lateral de vez em quando e tenta desviar das árvores.
   if(!e.flankUntil||now>e.flankUntil){e.flankUntil=now+1400+Math.random()*1200;e.side*=-1;}
   const side=d<11?.38:0,ux=p.x-e.root.position.x,uz=p.z-e.root.position.z;
   const mx=ux-uz*side*e.side,mz=uz+ux*side*e.side;
   if(ai)ai.walk(e.root,mx,mz,speed,dt);
   else{const len=Math.max(.01,Math.hypot(mx,mz));const nx=e.root.position.x+mx/len*speed*dt,nz=e.root.position.z+mz/len*speed*dt;if(!game.collides?.(nx,nz)){e.root.position.x=nx;e.root.position.z=nz;}}
   e.root.position.y=ground(e.root.position.x,e.root.position.z);
   play(e,d>11?'Run_Arc_Left':'Orc_Walk',true,.14);
  }else play(e,d<4?'Fighting_Idle':'Idle',true,.15);
  e.mixer.update(dt);transferPose(e);
 }
 try{
  state.phase='aguardando motor 3D';showStatus('Monstro Lutador: aguardando motor 3D...');
  await waitDependencies();state.phase='lendo GLB e FBX';await loadAssets();state.ready=true;state.loading=false;state.phase='pronto';
  showStatus('Monstro Lutador V246 pronto: '+state.animationsLoaded+' animações no rig FBX, textura original GLB. Clique para invocar.');
  if(state.pending){const n=state.pending;state.pending=0;requestSpawn(n);}
  window.addEventListener('game:axe-impact',()=>damageNearest(window.gameProgression?.modifyAxeDamage?.(34)||34));
  window.addEventListener('game:hammer-impact',()=>damageNearest(50));
   // V257: espada acerta via combatTargets().hit() apenas depois da colisão da lâmina.
  window.addEventListener('game:pickaxe-impact',()=>damageNearest(30));
  let last=performance.now(),aux=0;
  function tick(now){requestAnimationFrame(tick);let dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
   if(now>aux){aux=now+800;registerCombat();handleDirector();autoSpawn(now);}
   for(let i=enemies.length-1;i>=0;i--){const e=enemies[i];if(!e.alive){enemies.splice(i,1);continue;}
    try{update(e,now,dt)}catch(err){
     if(!e.reportedUpdateError){e.reportedUpdateError=true;console.error('[V241] Erro IA/animação do Monstro Lutador:',err);
      showStatus('Monstro criado, mas erro na animação/IA: '+String(err?.message||err).slice(0,130),true);}
    }
   }
  }
  requestAnimationFrame(tick);handleDirector();console.info('[V246] Golpes centralizados; combos V245 e visual V244 preservados',state);
 }catch(err){state.loading=false;state.phase='erro';state.error=String(err.message||err);showStatus('Erro ao carregar Monstro Lutador: '+state.error,true);console.error('[V240] Falha ao instalar Monstro Lutador:',err);}
})();
