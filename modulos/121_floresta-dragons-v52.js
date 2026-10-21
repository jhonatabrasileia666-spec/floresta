

/* Criativo V61: Dragon Warrior fully removed. Dragon Skeleton: bind-pose preserving, safety-limited native motion to prevent mesh tearing. Mountain and Tarisland unchanged. */
(async()=>{
'use strict';
if(window.__FLORESTA_DRAGONS_V65)return;
window.__FLORESTA_DRAGONS_V65=true;
const T=window.__THREE_MODULE;
const FBXLoader=window.__FBX_MODULE?.FBXLoader;
const gltfCtor=()=>window.__EXTRA_SPIDER_GLTF_LOADER||window.__FOREST_GLTF_LOADER;
const jsonElem=document.getElementById('floresta-dragon-assets-v51');
if(!T||!FBXLoader||!jsonElem){console.error('[Dragons V51] Missing engine or asset payload');return;}
let assets=null;const assetMap=()=>assets||(assets=JSON.parse(jsonElem.textContent||'{}'));
const names={skeleton:'DRAGÃO ESQUELETO',mountain:'DRAGÃO DA MONTANHA',tarisland:'DRAGÃO TARISLAND'};
const formats={skeleton:'fbx',mountain:'glb',tarisland:'fbx'};
const targetHeight={skeleton:5.8,mountain:7.0,tarisland:36.0};
const compressedCache={};
const resourceCache={};
const busy={};
const live=[];
let selected=null, serial=0, game=null, previous=performance.now();
const wait=ms=>new Promise(r=>setTimeout(r,ms));
const clamp=(a,b,c)=>Math.max(b,Math.min(c,a));
for(let i=0;i<1200;i++){
  if(window.gameReview?.scene&&window.gameReview?.player&&window.gameTestMode?.enter&&gltfCtor()){
    game=window.gameReview;break;
  }
  await wait(25);
}
if(!game){console.error('[Dragons V51] Creative game never initialized');return;}
const style=document.createElement('style');style.textContent=`
 #dragonLabV51{position:fixed;right:13px;top:110px;width:min(278px,calc(100vw - 26px));max-height:calc(100dvh - 160px);overflow:auto;z-index:183;padding:13px;border-radius:11px;background:#14211bee;color:#f3dfb6;border:1px solid #bf955e;box-shadow:0 8px 25px #0008;font:500 11px/1.4 system-ui;display:none}
 #dragonLabV51.show{display:block}
 #dragonLabV51 h3{font-size:13px;margin:0 0 8px;letter-spacing:.08em}
 #dragonLabV51 p{font-size:11px;margin:5px 0 8px}
 #dragonLabV51 button,#dragonLabV51 select{font:700 11px system-ui;color:#fff1d1;background:#29362c;border:1px solid #b49863;border-radius:7px;padding:9px 6px;min-height:36px;cursor:pointer;max-width:100%;}
 #dragonLabV51 button:disabled{opacity:.45;cursor:wait}
 #dragonLabV51 select{width:100%;}
 #dragonLabV51 .dgGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #dragonLabV51 .dgSmall{color:#c4b08c;font-size:10px}
 #dragonLabV51 .dgLine{height:1px;background:#82755980;margin:10px 0}
 #dragonLabV51 .dgStatus{color:#fff3cb;font-size:10px;min-height:20px;overflow-wrap:anywhere}
 #dragonLabV51 .dgCreatures{display:flex;gap:4px;flex-wrap:wrap;margin:5px 0;}
 #dragonLabV51 .dgCreatures button{min-height:26px;font-size:10px;padding:5px}
 #dragonLabV51 .dgCreatures button.active{background:#6f5231}
 @media(pointer:coarse){#dragonLabV51{top:80px;right:8px;bottom:100px;max-height:none;}}
 `;document.head.appendChild(style);
const panel=document.createElement('aside');panel.id='dragonLabV51';panel.innerHTML=`
<h3>CRIATIVO · DRAGÕES</h3>
<p>Dragão Guerreiro removido. Montanha: andar só com os primeiros passos; trotada em loop sem pausas. Voo e Esqueleto preservados.</p>
<div class="dgGrid">
 <button data-dg-spawn="mountain">+ MONTANHA</button>
 <button data-dg-spawn="skeleton">+ ESQUELETO</button>
 <button data-dg-spawn="tarisland">+ TARISLAND</button>
</div>
<p class="dgSmall">Tarisland é um modelo de alta complexidade: no celular pode demorar ao carregar.</p>
<div class="dgLine"></div>
<p><strong>CRIATURA SELECIONADA</strong></p>
<div id="dgCreaturesV51" class="dgCreatures"></div>
<p id="dgSelectedV51" class="dgSmall">Gere um dragão para testar.</p>
<select id="dgClipsV51" aria-label="Animações dos dragões" disabled><option>Nenhuma animação</option></select>
<div class="dgGrid" style="margin-top:6px">
 <button data-dg="prev">ANTERIOR</button><button data-dg="next">PRÓXIMA</button>
 <button data-dg="pause">PAUSAR / VOLTAR</button><button data-dg="reset">REPETIR</button>
 <button data-dg="closer">TRAZER PRA PERTO</button><button data-dg="turn">GIRAR 90°</button>
 <button data-dg="remove">REMOVER UM</button><button data-dg="clear">REMOVER TODOS</button>
</div>
<p id="dgStatusV51" class="dgStatus">Aguardando seleção de um dragão.</p>`;
document.body.appendChild(panel);
const $=id=>document.getElementById(id);
function status(message){$('dgStatusV51').textContent=message;}
async function gunzipAsset(key){
 if(compressedCache[key])return compressedCache[key];
 const s=assetMap()[key];if(!s)throw Error('Arquivo ausente: '+key);
 const raw=atob(s),bytes=new Uint8Array(raw.length);
 for(let i=0;i<raw.length;i++)bytes[i]=raw.charCodeAt(i);
 let ab;
 if(typeof DecompressionStream!=='undefined'){
   const output=new Response(new Blob([bytes]).stream().pipeThrough(new DecompressionStream('gzip')));
   ab=await output.arrayBuffer();
 }else if(typeof window.__FFLATE_GUNZIP_SYNC==='function'){
   const unpack=window.__FFLATE_GUNZIP_SYNC(bytes);
   ab=unpack.buffer.slice(unpack.byteOffset,unpack.byteOffset+unpack.byteLength);
 }else throw Error('Seu navegador não suporta GZIP');
 compressedCache[key]=ab;return ab;
}
async function texture(key){
 const ab=await gunzipAsset(key);
 const bytes=new Uint8Array(ab);
 let binary='';const chunk=32768;
 for(let k=0;k<bytes.length;k+=chunk)binary+=String.fromCharCode(...bytes.subarray(k,k+chunk));
 const uri='data:image/jpeg;base64,'+btoa(binary);
 return new Promise((resolve,reject)=>{new T.TextureLoader().load(uri,t=>{t.colorSpace=key.toLowerCase().includes('normal')?T.NoColorSpace:T.SRGBColorSpace;resolve(t)},undefined,reject)});
}
const texturePairs={};
async function setFbxTextures(obj,id){
 if(id==='skeleton'&&!texturePairs.skeleton){
   const [alb,norm]=await Promise.all([texture('skeletalAlb'),texture('skeletalNormal')]);
   texturePairs.skeleton=[alb,norm];
 }
 if(id==='tarisland'&&!texturePairs.tarisland){
   texturePairs.tarisland=await Promise.all([texture('tarislandBody1'),texture('tarislandBody2'),texture('tarislandNormal1'),texture('tarislandNormal2')]);
 }
 obj.traverse(o=>{
   if(!o.isMesh)return;
   let mats=Array.isArray(o.material)?o.material:[o.material];
   mats.forEach((m,i)=>{
     if(!m)return;
     if(id==='skeleton'){
       m.map=texturePairs.skeleton[0];if(m.normalMap!==undefined)m.normalMap=texturePairs.skeleton[1];
     }else if(id==='tarisland'){
       const is2=/02|body2/i.test(m.name||'')||(mats.length>1&&i%2===1);
       m.map=texturePairs.tarisland[is2?1:0];
       if(m.normalMap!==undefined)m.normalMap=texturePairs.tarisland[is2?3:2];
     }
     if(m.color)m.color.set(0xffffff);
     m.side=T.DoubleSide;
     m.needsUpdate=true;
   });
 });
}
function normalizeClip(c){
 const clip=c.clone();clip.userData={...(c.userData||{})};
 let start=Infinity;
 for(const tr of clip.tracks){if(tr.times.length)start=Math.min(start,tr.times[0]);}
 if(Number.isFinite(start)&&start>0.0001){
   for(const tr of clip.tracks){for(let i=0;i<tr.times.length;i++)tr.times[i]-=start;}
   clip.resetDuration();
 }
 return clip;
}

/* V56: the supplied FBX has a Dragon_Skeletal skinned mesh (72-bone bind pose)
   but many of its 37 playable clips were authored for Dragon_Ancient. Applying
   Ancient absolute bone positions/quaternions to Skeletal pulls vertices apart.
   Keep every Skeletal bind-position and scale unchanged. Rebase the Ancient
   *relative rotations* to each Skeletal native bone rest, with safe amplitude,
   especially for spine/pelvis and cinematic motions. This is a conservative
   salvage of the original keyframe curves, not native one-to-one retargeting. */
function stabilizeSkeletonClip(original,rig){
 if(original.duration<.09||/^(Dragon_Skeletal_Skeleton|Dragon_Skeletal_Patrol_Idle|Dragon_Ancient_Skeleton)$/.test(original.name))return null;
 const clip=original.clone();clip.tracks=[];
 const name=original.name;
 const idle=/Patrol_Idle|_Idle$|Casting_Loop|Attack(Right|Left)_Loop|Dialogue_(Angry|Happy|Sad|Surprised|Suspicious|Relaxed_Idle)/i.test(name);
 const violent=/CutScene|Death_Ground|Neutral_Idle_Exit|Entry_Combat|AggressiveToRelaxed|Attack_Breath/i.test(name);
 const strength=violent?.15:idle?.46:.23;
 for(const track of original.tracks){
   const dot=track.name.lastIndexOf('.');if(dot<0)continue;
   const boneName=track.name.slice(0,dot),property=track.name.slice(dot+1);
   // Position channels (even non-root) distort Skeletal's actual joint distances.
   if(property!=='quaternion')continue;
   const bone=rig.getObjectByName(boneName);
   if(!bone||!bone.isBone||track.values.length<4)continue;
   const output=track.clone();
   const ref=new T.Quaternion().fromArray(track.values,0).normalize();
   const inv=ref.clone().invert(),rest=bone.quaternion.clone();
   const sample=new T.Quaternion(),delta=new T.Quaternion(),identity=new T.Quaternion();
   const weight=/^NPC_(COM|Pelvis|Root)/.test(boneName)?strength*.32:strength;
   for(let k=0;k<output.values.length;k+=4){
      sample.fromArray(track.values,k).normalize();
      delta.copy(inv).multiply(sample);
      const safe=identity.clone().slerp(delta,weight);
      rest.clone().multiply(safe).normalize().toArray(output.values,k);
   }
   clip.tracks.push(output);
 }
 clip.resetDuration();
 return clip;
}

// V65: caminhada só nos primeiros passos; corrida retimada pelas patas, sem trechos de parada.
// A animação 'Elevar o corpo' foi retirada e substituída por batidas de asas.
// V58: o GLB tem um Take 001 (96.767 s). Cada faixa abaixo foi analisada
// pelas rotações de pernas, asas e deslocamento do tronco; não mistura ações.
// Os recortes são gerados diretamente das tracks do GLB, com amostras
// interpoladas EXATAMENTE nas duas extremidades, inclusive quaternions.
// Deslocamento externo da raiz é controlado pela montaria, não pelo take.
const MOUNTAIN_ACTIONS_V58=[
 // Identificações conferidas pelo jogador; a V58 nomeava incorretamente fogo, corrida e pouso.
 {id:'fireGround',title:'Ataque de fogo no chão',from:12.25,to:15.8,loop:false},
 {id:'idle',title:'Parado · descansando (Idle real)',from:69.2,to:77.7,loop:true},
 {id:'walk',title:'Andar · primeiros passos em loop',from:2.667,to:3.683,loop:true},
 {id:'walkLater',title:'Andando · variação',from:80.25,to:86.15,loop:true},
 {id:'runLater',title:'Correndo · variação',from:87.55,to:96.45,loop:true},
 {id:'turn',title:'Ajustar postura',from:9.8,to:11.6,loop:false},
 {id:'run',title:'Correr · trotada sem parada',from:17.467,to:19.133,loop:true},
 {id:'openWings',title:'Abrir asas',from:20.75,to:23.30,loop:false},
 {id:'takeoff',title:'Decolar · bater asas',from:23.45,to:26.55,loop:false},
 {id:'fireAir',title:'Ataque de fogo no ar (anteriormente Bater asas)',from:26.65,to:32.45,loop:false},
 {id:'landing',title:'Pousar (anteriormente Voar rápido)',from:33.00,to:39.10,loop:false},
 {id:'fly',title:'Voo · batida de asas contínua',from:24.8333333,to:25.6333333,loop:true},
 // V60: ações de morte têm cortes EXCLUSIVOS, com intervalo de segurança:
 // nenhuma amostra de descida/pouso/ataque é partilhada com as mortes.
 {id:'descending',title:'Descer voando',from:43.15,to:44.30,loop:false},
 {id:'deathAir',title:'MORRER · no ar (somente morte)',from:44.58,to:46.00,loop:false,category:'death'},
 {id:'deathGround',title:'MORRER · no chão (somente morte)',from:49.67,to:51.14,loop:false,category:'death'},
 {id:'wingGround',title:'Ataque de asas no chão',from:51.46,to:53.8,loop:false},
 {id:'wingThreat',title:'Ataque com asas · agitar',from:54.05,to:59.9,loop:false},
 {id:'wingDisplay',title:'Exibir asas',from:60.7,to:67.4,loop:false}
];
function closeMountainLoopSeam(clip){
  // Os trechos vêm de um take linear. O último quadro pode estar numa pose
  // diferente do primeiro: fecha o ciclo em ~0.28 s para evitar tranco
  // ao passar do último passo de volta ao primeiro.
  if(!clip.userData?.repeat)return;
  // V65: caminhada (2.667-3.683), corrida (17.467-19.133) e voo (24.833-25.633)
  // foram identificadas com pose inicial/final coincidente. NÃO remodelar
  // os últimos 0.28 s: isso criava a desaceleração e o tranco do loop.
  if(['walk','run','fly'].includes(clip.userData.mountainSegment))return;
  const duration=clip.duration;
  const fade=clip.userData.mountainSegment==='idle'?.45:.28;
  const begin=duration-fade;
  const qa=new T.Quaternion(),qb=new T.Quaternion();
  for(const track of clip.tracks){
    const size=track.getValueSize(),times=track.times,vals=track.values;
    if(times.length<3||size<1)continue;
    const start=vals.slice(0,size);
    for(let i=0;i<times.length;i++){
      if(times[i]<begin)continue;
      let alpha=(times[i]-begin)/fade;
      alpha=Math.min(1,Math.max(0,alpha));alpha=alpha*alpha*(3-2*alpha);
      const offset=i*size;
      if(size===4&&track.name.endsWith('.quaternion')){
        qa.set(vals[offset],vals[offset+1],vals[offset+2],vals[offset+3]);
        qb.set(start[0],start[1],start[2],start[3]);
        qa.slerp(qb,alpha).normalize();
        vals[offset]=qa.x;vals[offset+1]=qa.y;vals[offset+2]=qa.z;vals[offset+3]=qa.w;
      }else{
        for(let j=0;j<size;j++)vals[offset+j]=vals[offset+j]*(1-alpha)+start[j]*alpha;
      }
    }
  }
}
// V65: no take original a trotada inclui uma pequena sustentação da pose.
// A reprodução direta dessa pausa, a cada 1,67 s, faz o dragão parecer travar.
// Reparametrizar o tempo pelo MOVIMENTO DAS PATAS (sem trocar poses):
// a parte lenta dura menos, sem descartar quadros ou reiniciar o clip.
function mountainRunGaitTimeWarp(take,start,end){
 const tracks=take.tracks.filter(tr=>/\.quaternion$/.test(tr.name)&&
   /(?:Thigh|Calf|Foot|UpperArm|Forearm)_/i.test(tr.name));
 if(tracks.length<6)return null;
 const probes=tracks.map(t=>t.createInterpolant());
 const N=Math.ceil((end-start)*60),interval=(end-start)/N;
 const frames=new Float64Array(N+1),cum=new Float64Array(N+1);
 let old=probes.map(p=>Array.from(p.evaluate(start)));
 frames[0]=0;
 for(let i=1;i<=N;i++){
   const t=start+i*interval;
   let total=0;
   for(let b=0;b<probes.length;b++){
     const v=probes[b].evaluate(t),o=old[b];
     const dot=Math.min(1,Math.abs(v[0]*o[0]+v[1]*o[1]+v[2]*o[2]+v[3]*o[3]));
     total+=2*Math.acos(dot);
     old[b]=Array.from(v);
   }
   const angularSpeed=total/probes.length/interval;
   // Impede secar o movimento em alguns frames e acelera a sustentação estática.
   const weight=Math.pow(angularSpeed+.12,1.5);
   cum[i]=cum[i-1]+weight;
   frames[i]=i*interval;
 }
 const total=cum[N];
 if(!Number.isFinite(total)||total<.01)return null;
 // Um ciclo original de 1,667s vira ~1,35s, mas nenhum osso muda de pose.
 const duration=1.35;
 return {duration,convert(local){
   const q=Math.max(0,Math.min(N,local/interval)),i=Math.min(N-1,Math.floor(q));
   const a=q-i;
   return duration*(cum[i]*(1-a)+cum[i+1]*a)/total;
 }};
}
function buildMountainClipsV58(take){
 if(!take?.tracks?.length||take.duration<90)throw Error('Take da Montanha inválido');
 const splits=[];
 for(const section of MOUNTAIN_ACTIONS_V58){
   const start=section.from,end=section.to;
   const timeWarp=section.id==='run'?mountainRunGaitTimeWarp(take,start,end):null;
   const tracks=[];
   for(const original of take.tracks){
     // Impede que os movimentos do take teleportem a criatura durante a montaria.
     if(/^(?:root_01\.(?:position|quaternion)|MountainDragon__02\.position)$/i.test(original.name))continue;
     const srcTimes=original.times;
     if(!srcTimes.length)continue;
     const input=[start];
     for(let i=0;i<srcTimes.length;i++){
       const t=srcTimes[i];
       if(t>start+1e-4&&t<end-1e-4)input.push(t);
     }
     input.push(end);
     // O interpolante do Three usa slerp de quatérnios e o mesmo
     // método de interpolação definido originalmente para cada canal.
     const itp=original.createInterpolant();
     const values=[];
     for(const t of input){
       const sampled=itp.evaluate(t);
       for(let j=0;j<sampled.length;j++)values.push(sampled[j]);
     }
     if(values.length<4)continue;
     const times=new Float32Array(input.map(t=>timeWarp?timeWarp.convert(t-start):t-start));
     const output=new Float32Array(values);
     const track=new original.constructor(
       original.name,times,output,original.getInterpolation()
     );
     tracks.push(track);
   }
   if(!tracks.length)throw Error('Segmento sem tracks: '+section.id);
   const name='MD58_'+section.id+'_'+section.title;
   const clip=new T.AnimationClip(name,timeWarp?timeWarp.duration:end-start,tracks);
   clip.userData={mountainSegment:section.id,repeat:section.loop,begin:start,end,exclusiveDeath:section.category==='death'};
   closeMountainLoopSeam(clip);
   splits.push(clip);
 }
 console.info('[Montanha V65] Take 001 separado em',
     splits.length,'clipes verdadeiros, todos com tempo inicial zero.');
 return splits;
}
async function getAsset(id){
 if(resourceCache[id])return resourceCache[id];
 const ab=await gunzipAsset(id);
 let source,animations;
 if(formats[id]==='glb'){
   const Loader=gltfCtor();
   const parsed=await new Promise((yes,no)=>new Loader().parse(ab,'',yes,no));
   source=parsed.scene||parsed.scenes?.[0];animations=parsed.animations||[];
 }else{
   source=new FBXLoader().parse(ab,'');animations=source.animations||[];
   await setFbxTextures(source,id);
 }
 if(!source)throw Error('Modelo 3D vazio');
 source.traverse(o=>{if(o.isMesh){o.castShadow=true;o.receiveShadow=true;o.frustumCulled=false;}});
 // V56: no absolute Ancient translations/scales; Skeletal bind pose preserved.
 if(id==='skeleton'){
   animations=animations.map(clip=>stabilizeSkeletonClip(clip,source)).filter(Boolean);
   if(animations.length<30)throw Error('As animações nativas do esqueleto não carregaram');
 }
 if(id==='mountain'&&animations.length===1){
   animations=buildMountainClipsV58(animations[0]);
 }
 const resource={source,animations:animations.map(normalizeClip)};
 resourceCache[id]=resource;return resource;
}
function getBox(root){root.updateMatrixWorld(true);return new T.Box3().setFromObject(root)}
function choose(e){
 selected=e;
 const container=$('dgCreaturesV51');container.innerHTML='';
 for(const entity of live){
   const b=document.createElement('button');b.textContent=names[entity.id]+' '+entity.number;
   if(entity===selected)b.className='active';
   b.onclick=()=>choose(entity);container.appendChild(b);
 }
 const select=$('dgClipsV51');select.innerHTML='';
 if(!e){select.disabled=true;select.add(new Option('Nenhuma animação'));$('dgSelectedV51').textContent='Gere um dragão para testar.';return;}
 $('dgSelectedV51').textContent=names[e.id]+' · '+e.clips.length+' animação(ões)';
 select.disabled=!e.clips.length;
 if(!e.clips.length)select.add(new Option('Modelo estático (sem clipes)',-1));
 else e.clips.forEach((clip,i)=>select.add(new Option((i+1)+'. '+(clip.name||'Animação'),i)));
 select.value=String(e.index);
}
function play(e,index){
 if(window.gameMountainRide?.mounted===e){status('Montado: as animações são controladas automaticamente pelas ações. Desmonte para testar clipes.');return;}
 if(!e||!e.mixer||!e.clips.length){status('Este modelo não possui animação embutida.');return;}
 const n=e.clips.length,k=(index%n+n)%n;
 const clip=e.clips[k],next=e.mixer.clipAction(clip);
 // V60: nunca misturar MORRER com outro clipe, nem por crossfade nem por ação anterior.
 const death=clip.userData?.exclusiveDeath===true||/death|die|morte|morrer/i.test(clip.name||'');
 if(death)e.mixer.stopAllAction();
 else if(e.action&&e.action!==next)e.action.stop();
 next.reset();next.enabled=true;next.paused=false;next.setEffectiveWeight(1);next.setEffectiveTimeScale(1);
 const oneShot=death||e.clips[k].userData?.repeat===false||/^MD58_(?:turn|openWings|takeoff|landing)_/.test(e.clips[k].name);
 next.setLoop(oneShot?T.LoopOnce:T.LoopRepeat,oneShot?1:Infinity);
 next.clampWhenFinished=oneShot;
 next.play();
 e.action=next;e.index=k;
 if(e===selected)$('dgClipsV51').value=String(k);
 status(names[e.id]+' · '+(k+1)+'/'+n+': '+(e.clips[k].name||'Sem nome'));
}
async function spawn(id){
 if(!window.gameTestMode?.active){status('Entre no Criativo para gerar os dragões.');return;}
 if(busy[id])return;
 if(live.length>=12){status('Limite de 12 dragões; remova algum primeiro.');return;}
 busy[id]=true;
 const button=panel.querySelector(`[data-dg-spawn="${id}"]`);button.disabled=true;
 try{
   status('Carregando '+names[id]+'...');
   const {source,animations}=await getAsset(id);
   const clone=window.__SKELETON_MODULE?.clone;
   const root=clone?clone(source):source.clone(true);
   const holder=new T.Group();holder.name='V51_'+id+'_'+(serial+1);
   const bb=getBox(root),dims=bb.getSize(new T.Vector3());
   let factor=targetHeight[id]/Math.max(0.001,dims.y);
   factor=clamp(factor,.00025,150);
   root.scale.multiplyScalar(factor);
   const resized=getBox(root),center=resized.getCenter(new T.Vector3());
   root.position.sub(new T.Vector3(center.x,resized.min.y,center.z));
   holder.add(root);
   const p=game.player,yaw=p.yaw;
   const fwdX=-Math.sin(yaw),fwdZ=-Math.cos(yaw);
   const rightX=Math.cos(yaw),rightZ=-Math.sin(yaw);
   const num=serial++;
   const range=id==='tarisland'?38:(id==='mountain'?12.5:9.5);
   const offset=((num%3)-1)*7;
   const x=p.x+fwdX*(range+Math.floor(num/3)*7)+rightX*offset;
   const z=p.z+fwdZ*(range+Math.floor(num/3)*7)+rightZ*offset;
   holder.position.set(x,game.groundY(x,z),z);
   holder.rotation.y=yaw;
   game.scene.add(holder);
   // Keep the imported bind matrices and original skin weights UNCHANGED.
   // Normalizing the mesh again at spawn can hide FBX skin-binding issues.
   if(id==='skeleton'){
     root.updateMatrixWorld(true);
     root.traverse(obj=>{if(obj.isSkinnedMesh)obj.frustumCulled=false;});
   }
   const entity={id,number:num+1,root,holder,clips:animations,index:-1,mixer:animations.length?new T.AnimationMixer(root):null,action:null,restPosition:root.position.clone()};
   live.push(entity);choose(entity);
   if(animations.length){
     const idlePattern=id==='skeleton'?/Dragon_Ancient_Patrol_Idle$/i:/idle|stand|walk|parado/i;
     const anim=animations.findIndex(c=>idlePattern.test(c.name));
     play(entity,Math.max(0,anim));
   }else status(names[id]+' gerado como modelo estático — o arquivo enviado não inclui animações.');
 }catch(err){status('Erro ao carregar '+names[id]+': '+(err?.message||String(err)));console.error(err)}
 finally{busy[id]=false;button.disabled=false;}
}
function remove(e){if(!e)return;e.mixer?.stopAllAction();e.holder.removeFromParent();const index=live.indexOf(e);if(index>=0)live.splice(index,1);choose(live.at(-1)||null)}
function clear(){while(live.length)remove(live[live.length-1]);status('Dragões removidos da arena.');}
function reposition(e){
 if(!e)return;
 const p=game.player,yaw=p.yaw;
 const distance=e.id==='tarisland'?29:(targetHeight[e.id]>5?12:8);
 const x=p.x-Math.sin(yaw)*distance,z=p.z-Math.cos(yaw)*distance;
 e.holder.position.set(x,game.groundY(x,z),z);
 e.holder.rotation.y=yaw;
 e.root.position.copy(e.restPosition);
 status('Dragão posicionado à sua frente.');
}
panel.addEventListener('click',ev=>{
 const btn=ev.target.closest('button');if(!btn)return;
 if(btn.dataset.dgSpawn){spawn(btn.dataset.dgSpawn);return;}
 const action=btn.dataset.dg;
 if(action==='clear'){clear();return;}
 if(action==='remove'){remove(selected);return;}
 if(!selected){status('Gere um dragão antes de usar os controles.');return;}
 if(action==='prev')play(selected,selected.index-1);
 if(action==='next')play(selected,selected.index+1);
 if(action==='reset')play(selected,selected.index<0?0:selected.index);
 if(action==='pause'){
   if(selected.action){selected.action.paused=!selected.action.paused;status(selected.action.paused?'Animação pausada.':'Animação retomada.');}
 }
 if(action==='closer')reposition(selected);
 if(action==='turn'){selected.holder.rotation.y+=Math.PI/2;status('Dragão girado 90°.');}
});
$('dgClipsV51').addEventListener('change',ev=>play(selected,Number(ev.target.value)));
function loop(time){
 requestAnimationFrame(loop);
 if(!window.gameTestMode?.active){panel.classList.remove('show');previous=time;return;}
 panel.classList.add('show');
 const dt=clamp((time-previous)/1000,0,.05);previous=time;
 for(const e of live){
   if(e.mixer){
     e.mixer.update(dt);
     // World position remains fixed in the test arena; avoid FBX root-motion drift.
     if(e.root.position.distanceToSquared(e.restPosition)>1e-6)e.root.position.copy(e.restPosition);
   }
 }
}
requestAnimationFrame(loop);
window.gameDragonLab={spawn,remove,clear,play,reposition,get dragons(){return live},version:'V75-Tarisland-Colossal-PC-Mobile'};
})();

