
/* FLORESTA V73 — Dragão da Montanha: pouso completo com aproximação, toque no solo e retorno ao idle; V72 preservada.
   Escalada 1/2 em POV real do personagem, corpo Mixamo e olhos V37.
   Correções: E/M inicia subida como a aranha, colisão suspensa apenas durante escalada,
   câmera presa ao eyeSocket e transição direta para o assento. Voo/corrida V66 preservados.
   Add-on isolado: nenhuma alteração no modelo/rig dos outros dragões.
   O GLB Mountain contém um Take 001 contínuo de 96.77 segundos;
   usamos 18 clipes individuais; a corrida não inclui preparação ou parada. */
(async()=>{
 'use strict';
 if(window.__FLORESTA_MOUNTAIN_MOUNT_V67)return;
 window.__FLORESTA_MOUNTAIN_MOUNT_V67=true;
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 const T=window.__THREE_MODULE;
 let game=null, lab=null;
 for(let i=0;i<1200;i++){
   game=window.gameReview;lab=window.gameDragonLab;
   if(game?.trueFirstPerson?.visibleRoot&&game?.camera&&lab?.dragons&&window.gameTestMode?.enter&&T?.AnimationMixer)break;
   await sleep(25);
 }
 if(!game?.trueFirstPerson?.visibleRoot||!lab?.dragons||!T){
   console.error('[Mountain V57] Avatar ou laboratório não iniciou');return;
 }
 const zone=window.gameTestMode;
 const front=window.gameFront172;
 const ready=()=>!!zone?.active&&(!front||(!front.paused&&front.started!==false));
 const keyHas=code=>Set.prototype.has.call(game.keys,code);
 const holding={up:false,down:false,forward:false,back:false,left:false,right:false,sprint:false};
 const state={mounted:null,air:false,landing:false,landingFinal:false,landingStarted:0,landingHeight:0,
              airHeight:0,wantHeight:0,faceOffset:0,camThird:true,
              activeClip:'',phaseUntil:0,attackUntil:0,lastT:performance.now(),wasMoving:false,
              smoothedYaw:0,bodyYaw:0,speed:0,eyeLook:0,
              cameraPos:new T.Vector3(),cameraTarget:new T.Vector3(),cameraReady:false,
              spine:null,spineRest:null,spineBob:new T.Vector3(),
              armSeconds:0,armRest:null, saddleLocal:new T.Vector3(),saddleSpineLocal:new T.Vector3(),saddleReady:false,saddleDragon:null, saddleAnchor:null,saddleSource:'',saddleError:'',
              climb:{ready:false,error:'',clips:[],bindings:[],active:false,index:0,elapsed:0,duration:0,dragon:null,start:null,edge:null,crest:null,end:null,yaw:0,away:null,camera:new T.Vector3()}};
 const yawNorm=x=>Math.atan2(Math.sin(x),Math.cos(x));
 const yawSmooth=(a,b,alpha)=>yawNorm(a+yawNorm(b-a)*alpha);
 const riderSeat=new T.Vector3(),seatWorld=new T.Vector3(),spineWorld=new T.Vector3(),spineLocal=new T.Vector3(),headWorld=new T.Vector3(),neckWorld=new T.Vector3();
 const pelvisWorld=new T.Vector3(),saddlePoint=new T.Vector3(),hipsWorld=new T.Vector3(),riderOffset=new T.Vector3();
 const seatVertex=new T.Vector3();
 const bodyReference=new T.Vector3();
 const solids=new Map();
 // V71: o pivô do GLB não equivale à sola do dragão. Ajuste único
 // baseado nos VÉRTICES ANIMADOS das patas, e não na caixa inteira
 // (as pontas das asas podem ficar abaixo das patas durante a animação).
 const footSample=new T.Vector3();
 function alignDragonFeet(e,force=false){
   if(!e||e.id!=='mountain'||e._v71FeetAligned)return;
   if(state.air||state.mounted===e)return;
   const clip=e.action?.getClip?.();
   if(!force&&(!clip||!/^MD58_idle_/i.test(clip.name||'')||(e.action?.time||0)<.04))return;
   e.holder.updateMatrixWorld(true);
   const feet=[];
   e.root.traverse(mesh=>{
     if(!mesh.isSkinnedMesh||!mesh.skeleton||!mesh.geometry||typeof mesh.getVertexPosition!=='function')return;
     const skinI=mesh.geometry.getAttribute('skinIndex');
     const skinW=mesh.geometry.getAttribute('skinWeight');
     if(!skinI||!skinW)return;
     const ids=new Set();
     mesh.skeleton.bones.forEach((bone,i)=>{
       const name=String(bone?.name||'').replace(/\s+/g,'_');
       if(/_[RL]_(?:Foot|Toe\d*)_/i.test(name))ids.add(i);
     });
     if(!ids.size)return;
     mesh.updateWorldMatrix(true,false);
     for(let i=0;i<skinI.count;i++){
       let influence=0;
       for(let j=0;j<4;j++)if(ids.has(Math.round(skinI.getComponent(i,j))))influence+=skinW.getComponent(i,j);
       if(influence<.18)continue;
       mesh.getVertexPosition(i,footSample);
       mesh.localToWorld(footSample);
       if(Number.isFinite(footSample.y))feet.push(footSample.y);
     }
   });
   if(!feet.length){
     // Segurança para variantes de exportação que perderam SkinWeight:
     // a caixa real animada ainda é melhor que o pivô do GLB.
     const box=new T.Box3().setFromObject(e.root,true);
     if(Number.isFinite(box.min.y))feet.push(box.min.y);
   }
   if(!feet.length)return;
   feet.sort((a,b)=>a-b);
   const soleY=feet[Math.min(feet.length-1,Math.floor(feet.length*.01))];
   const floorY=game.groundY(e.holder.position.x,e.holder.position.z);
   const correction=floorY+.018-soleY;
   if(!Number.isFinite(correction)||Math.abs(correction)>30)return;
   if(Math.abs(correction)>.015){
     e.root.position.y+=correction;
     // O laboratório restaura a origem da malha a cada quadro:
     // atualizar também essa referência evita desfazer o encaixe.
     e.restPosition?.copy(e.root.position);
     e.holder.updateMatrixWorld(true);
   }
   e._v71FeetAligned=true;
   e._v71GroundCorrection=correction;
   console.info('[Montanha V71] Sola alinhada ao piso do Criativo:',
       'amostras',feet.length,'correção vertical',correction.toFixed(3));
 }
 const solidBoneSpecs=[
   [/MountainDragon_[\s_]*Pelvis_03/i,1.22],
   [/MountainDragon_[\s_]*Spine_04/i,1.35],
   [/MountainDragon_[\s_]*Spine1_05/i,1.20],
   [/MountainDragon_[\s_]*Neck_06/i,.71],
   [/MountainDragon_[\s_]*Tail_083/i,.75],
   [/MountainDragon_[\s_]*Tail1_084/i,.48],
   [/MountainDragon_[\s_]*R[ _]UpperArm_036/i,.53],
   [/MountainDragon_[\s_]*L[ _]UpperArm_048/i,.53],
   [/MountainDragon_[\s_]*R[ _]Hand_038/i,.44],
   [/MountainDragon_[\s_]*L[ _]Hand_050/i,.44],
   [/MountainDragon_[\s_]*R[ _]Thigh_059/i,.60],
   [/MountainDragon_[\s_]*L[ _]Thigh_071/i,.60],
   [/MountainDragon_[\s_]*R[ _]Foot_062/i,.44],
   [/MountainDragon_[\s_]*L[ _]Foot_074/i,.44]
 ];
 function createDragonSolids(e){
   if(solids.has(e))return solids.get(e);
   const assigned=[];
   for(const [pattern,radius] of solidBoneSpecs){
     const bone=findBone(e.root,pattern);
     if(!bone)continue;
     const collider={x:0,z:0,r:0,_mountainDragon:e,_radius:radius,_bone:bone};
     game.colliders.push(collider);assigned.push(collider);
   }
   // Volume adicional do tronco acompanha o osso central mesmo durante as animações.
   const torso=findBone(e.root,/^MountainDragon_[\s_]*Spine1_05$/i);
   const core={x:e.holder.position.x,z:e.holder.position.z,r:1.15,_radius:1.15,_bone:torso,_mountainDragon:e};
   game.colliders.push(core);assigned.push(core);
   solids.set(e,assigned);
   return assigned;
 }
 function updateDragonSolids(){
   const active=new Set(lab.dragons.filter(e=>e.id==='mountain'));
   for(const [e,arr] of solids){
     if(active.has(e))continue;
     for(const c of arr){const at=game.colliders.indexOf(c);if(at>=0)game.colliders.splice(at,1)}
     solids.delete(e);
   }
   for(const e of active){
     if(!e._v71FeetAligned)alignDragonFeet(e);
     const arr=createDragonSolids(e);
     e.holder.updateMatrixWorld(true);
     const ground=game.groundY(e.holder.position.x,e.holder.position.z);
     // Em voo, ou quando o jogador está montado, não bloquear a própria montaria.
     const enabled=(state.mounted!==e && !(state.climb.active&&state.climb.dragon===e) && e.holder.position.y-ground<1.45);
     for(const c of arr){
       if(!enabled){
         // Raio zero ainda bloqueia o jogador no motor original (soma raio do jogador).
         // Tirar os colisores de alcance ao voar ou ao pilotar o próprio dragão.
         c.r=0;c.x=1e9;c.z=1e9;
       }else{
         c.r=c._radius;
         if(c._bone){c._bone.getWorldPosition(pelvisWorld);c.x=pelvisWorld.x;c.z=pelvisWorld.z;}
         else {c.x=e.holder.position.x;c.z=e.holder.position.z;}
       }
     }
   }
 }
 // Referência real da sela: vértices deformados do TRONCO, não ossos
 // isolados, asas ou a caixa do modelo. A rotação da espinha segue o corpo.
 function createSaddleAnchor(e){
   if(state.saddleAnchor){state.saddleAnchor.removeFromParent();state.saddleAnchor=null;}
   e.holder.updateMatrixWorld(true);
   const spine=findBone(e.root,/^MountainDragon_[\s_]*Spine1_05$/i);
   if(!spine){state.saddleError='Osso central Spine1_05 ausente';state.saddleReady=false;return false;}
   const samples=[];
   e.root.traverse(mesh=>{
     if(!mesh.isSkinnedMesh||!mesh.skeleton||!mesh.geometry||typeof mesh.getVertexPosition!=='function')return;
     const skinIndex=mesh.geometry.getAttribute('skinIndex');
     const skinWeight=mesh.geometry.getAttribute('skinWeight');
     if(!skinIndex||!skinWeight)return;
     const relevant=[];
     for(let i=0;i<mesh.skeleton.bones.length;i++){
       if(/^MountainDragon_[\s_]*Spine1_05$/i.test(mesh.skeleton.bones[i]?.name||''))relevant.push(i);
     }
     if(!relevant.length)return;
     mesh.updateMatrixWorld(true);
     for(let vi=0;vi<skinIndex.count;vi++){
       let influence=0;
       for(let k=0;k<4;k++){
         const boneIndex=Math.round(skinIndex.getComponent(vi,k));
         if(relevant.includes(boneIndex))influence+=skinWeight.getComponent(vi,k);
       }
       if(influence<.40)continue;
       mesh.getVertexPosition(vi,seatVertex);
       mesh.localToWorld(seatVertex);
       if(Number.isFinite(seatVertex.x)&&Number.isFinite(seatVertex.y)&&Number.isFinite(seatVertex.z))
         samples.push(seatVertex.clone());
     }
   });
   if(samples.length<35){
     state.saddleError='Não foi possível localizar o dorso na malha ('+samples.length+' vértices)';
     state.saddleReady=false;console.warn('[Montaria V63]',state.saddleError);return false;
   }
   // A pele superior do tronco: percentil 92, exclusivamente vértices
   // influenciados pelo osso da parte CENTRAL (sem abas das asas).
   samples.sort((a,b)=>a.y-b.y);
   const p92=samples[Math.min(samples.length-1,Math.floor(samples.length*.92))].y;
   const top=samples.filter(v=>v.y>=p92-.18);
   top.sort((a,b)=>a.x-b.x);
   const cx=top[Math.floor(top.length/2)].x;
   top.sort((a,b)=>a.z-b.z);
   const cz=top[Math.floor(top.length/2)].z;
   const actual=new T.Vector3(cx,p92+.055,cz);
   spine.updateWorldMatrix(true,false);
   const marker=new T.Object3D();marker.name='V63_Sela_Na_Coluna_Central';
   marker.position.copy(spine.worldToLocal(actual.clone()));
   spine.add(marker);
   state.saddleAnchor=marker;
   state.saddleLocal.copy(e.holder.worldToLocal(actual.clone()));
   state.saddleSpineLocal.copy(e.holder.worldToLocal(spine.getWorldPosition(new T.Vector3())));
   state.saddleReady=true;state.saddleDragon=e;state.saddleSource='malha do tronco';state.saddleError='';
   console.info('[Montaria V63] Sela na malha animada',samples.length,'vértices; altura=',actual.y.toFixed(2),
     'mundo=',actual.toArray().map(n=>+n.toFixed(2)));
   return true;
 }
 function seatOnDragon(e){
   if(!state.saddleReady||state.saddleDragon!==e||!state.saddleAnchor){
     if(!createSaddleAnchor(e))return false;
   }
   e.holder.updateMatrixWorld(true);
   state.saddleAnchor.getWorldPosition(seatWorld);
   return Number.isFinite(seatWorld.x)&&Number.isFinite(seatWorld.y)&&Number.isFinite(seatWorld.z);
 }
 const rideAnim={bindings:[],clip:null,time:0,ready:false,error:''};
 const sitNames=['Male Sitting Pose','Male Sitting Pose (1)','Male Sitting Pose (2)','Sitting','Sitting Idle'];
 let rideSeatIndex=0;
 function normBone(name){return String(name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'')}
 async function loadRideSeat(){
   try{
     const b64=window.__MOUNT_SEAT_CLIPS_GZ64;
     if(!b64)throw Error('Pacote de assento da aranha V37 ausente');
     const decoded=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
     let plain;
     if(typeof DecompressionStream!=='undefined'){
       plain=await new Response(new Blob([decoded]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
     }else if(window.__FFLATE_GUNZIP_SYNC){
       plain=new TextDecoder().decode(window.__FFLATE_GUNZIP_SYNC(decoded));
     }else throw Error('GZIP indisponível');
     const data=JSON.parse(plain);if(!Array.isArray(data)||data.length!==5)throw Error('Pacote incompleto');
     const rig=new Map();game.trueFirstPerson.model.traverse(o=>{if(o.isBone&&!rig.has(normBone(o.name)))rig.set(normBone(o.name),o)});
     const lower=/^(hips|leftupleg|leftleg|leftfoot|lefttoebase|rightupleg|rightleg|rightfoot|righttoebase)$/;
     rideAnim.poses=data.map(c=>{
       const clip=T.AnimationClip.parse(c);
       return {clip,bindings:clip.tracks.filter(tr=>tr.name.endsWith('.quaternion')).map(tr=>{
         const bone=rig.get(normBone(tr.name.slice(0,tr.name.lastIndexOf('.'))));
         if(!bone||!lower.test(normBone(bone.name)))return null;
         return {bone,interpolant:tr.createInterpolant(new Float32Array(4))};
       }).filter(Boolean)};
     });
     if(rideAnim.poses.some(p=>p.bindings.length<7))throw Error('Rig do assento incompatível');
     rideAnim.ready=true;chooseRideSeat(0);
     console.info('[Montaria V61] Poses sentadas da aranha V37 reutilizadas para o dragão.',rideAnim.poses.map(p=>p.bindings.length));
   }catch(err){rideAnim.error=String(err.message||err);console.warn('[Montaria V61] Pose sentada:',err);}
 }
 function chooseRideSeat(i){
   if(!rideAnim.ready||!rideAnim.poses[i])return;
   rideSeatIndex=i;rideAnim.clip=rideAnim.poses[i].clip;rideAnim.bindings=rideAnim.poses[i].bindings;rideAnim.time=0;
   const label=document.getElementById('mrSeatNameV61');if(label)label.textContent=sitNames[i];
 }
 const rideQ=new T.Quaternion();
 function updateRideSeat(dt){
   if(!rideAnim.ready||!rideAnim.clip)return;
   const sec=Math.min(.05,Math.max(0,dt||0));rideAnim.time+=sec;
   const length=Math.max(.033,rideAnim.clip.duration);
   const t=rideSeatIndex<=2?0:rideSeatIndex===3?Math.min(length-.0002,rideAnim.time):(rideAnim.time%length);
   for(const it of rideAnim.bindings){
     const a=it.interpolant.evaluate(t);rideQ.set(a[0],a[1],a[2],a[3]).normalize();it.bone.quaternion.copy(rideQ);
   }
 }
 function stabilizeRideArms(dt){
   const tfp=game.trueFirstPerson;
   const arr=['lArm','lFore','lHand','rArm','rFore','rHand'];
   if(!state.armRest){
     state.armSeconds+=dt;
     if(state.armSeconds>.48)state.armRest=arr.map(k=>tfp.bones?.[k]).filter(Boolean).map(b=>({b,q:b.quaternion.clone()}));
   }else for(const it of state.armRest)it.b.quaternion.copy(it.q);
 }
 function findBone(root,regex){let found=null;root.traverse(n=>{if(!found&&n.isBone&&regex.test(n.name))found=n});return found;}
 function setupDragonOrientation(e){
   // A frente vem da geometria/esqueleto REAL: direção Coluna -> Cabeça.
   // O GLB usa +X, enquanto a navegação Floresta usa -Z. Não inverter o cavaleiro.
   e.holder.updateMatrixWorld(true);
   const head=findBone(e.root,/MountainDragon_[\s_]*Head_010/i);
   const spine=findBone(e.root,/MountainDragon_[\s_]*Spine_04/i)||findBone(e.root,/MountainDragon_[\s_]*Spine1_05/i);
   if(head&&spine){
     head.getWorldPosition(headWorld);spine.getWorldPosition(neckWorld);
     e.root.worldToLocal(headWorld);e.root.worldToLocal(neckWorld);
     const dx=headWorld.x-neckWorld.x,dz=headWorld.z-neckWorld.z;
     e.rideFacing= Math.hypot(dx,dz)>.0001? yawNorm(Math.PI-Math.atan2(dx,dz)):Math.PI/2;
     state.spine=spine;
   }else{e.rideFacing=Math.PI/2;state.spine=null;}
   e.root.rotation.y=e.rideFacing+state.faceOffset;
   e.holder.updateMatrixWorld(true);
   if(state.spine){state.spine.getWorldPosition(spineWorld);state.spineRest=e.holder.worldToLocal(spineWorld.clone());}
   else state.spineRest=null;
   state.spineBob.set(0,0,0);
 }
 void loadRideSeat();
 const keysHeld=code=>keyHas(code);
 function moveInput(){
   const k=keysHeld;
   const forward=(k('KeyW')||k('ArrowUp')?1:0)-(k('KeyS')||k('ArrowDown')?1:0)
     +(holding.forward?1:0)-(holding.back?1:0)-Number(game.stick?.y||0);
   const lateral=(k('KeyD')||k('ArrowRight')?1:0)-(k('KeyA')||k('ArrowLeft')?1:0)
     +(holding.right?1:0)-(holding.left?1:0)+Number(game.stick?.x||0);
   const len=Math.max(1,Math.hypot(forward,lateral));
   return {f:forward/len,s:lateral/len,amount:Math.min(1,Math.hypot(forward,lateral)),
     run:k('ShiftLeft')||k('ShiftRight')||holding.sprint};
 }
 function isBlocked(){return !!(window.gameInventory?.isOpen||document.body.classList.contains('crafting-active')||
    document.querySelector('#directorOverlay.open,#h171Drawer.open'))}
 // V72: a origem (holder) do GLB não é o corpo visível. Toda entrada,
 // saída e checagem de alcance usa um osso do tronco em coordenadas de MUNDO.
 // O mesmo referencial é usado nas duas direções, inclusive após a descida.
 function dragonBodyWorld(e,out=new T.Vector3()){
   if(!e?.holder)return null;
   let bone=e._v72BodyBone;
   if(!bone||!bone.parent){
     bone=findBone(e.root,/^MountainDragon_[\s_]*Spine1_05$/i)
       ||findBone(e.root,/^MountainDragon_[\s_]*Spine_04$/i)
       ||findBone(e.root,/^MountainDragon_[\s_]*Pelvis_03$/i);
     if(bone)e._v72BodyBone=bone;
   }
   e.holder.updateMatrixWorld(true);
   if(bone){
     bone.getWorldPosition(out);
     if(Number.isFinite(out.x)&&Number.isFinite(out.z))return out;
   }
   return out.copy(e.holder.position);
 }
 function nearest(){
   const p=game.player;
   let best=null,minimum=9.2;
   for(const e of lab.dragons){
     if(e.id!=='mountain')continue;
     const body=dragonBodyWorld(e,bodyReference);
     if(!body)continue;
     // Também permite interagir do quadril do dragão, sem depender do pivô.
     const d=Math.hypot(body.x-p.x,body.z-p.z);
     if(d<minimum){minimum=d;best=e;}
   }
   return best;
 }
 const css=document.createElement('style');css.id='mountainRideStylesV57';css.textContent=`
 #mountainRideV57{border-top:1px solid #ae956b70;margin-top:10px;padding-top:9px}
 #mountainRideV57 strong{font-size:12px;letter-spacing:.07em;color:#ffe6b3}
 #mountainRideV57 p{color:#e7d5b5;font-size:10px;line-height:1.45}
 #mountainRideV57 .mrGrid{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:7px}
 #mountainRideV57 button{min-height:37px}
 #mountainRideV57 button[data-mr="mount"]{grid-column:span 2;background:#65502d}
 #mountainRideV57 .mrBar{height:5px;background:#2b3833;border-radius:5px;overflow:hidden;margin:6px 0}
 #mountainRideV57 .mrFill{height:100%;width:0%;background:linear-gradient(90deg,#d8aa50,#e9cf84);transition:width .13s}
 #mountainRideV57 .mrSmall{font-size:10px}
 #mountainRideTouchV57{display:none;position:fixed;left:10px;bottom:145px;z-index:185;gap:7px;align-items:end;flex-wrap:wrap;max-width:245px}
 #mountainRideTouchV57 button{min-width:66px;min-height:54px;padding:10px 7px;border:1px solid #c7a679;border-radius:9px;background:#14221ce6;color:#ffeac6;font:bold 11px/1.2 system-ui;touch-action:none}
 #mountainRideTouchV57 button:active{background:#785d37}
 @media(pointer:coarse){#mountainRideTouchV57.show{display:flex}}
 `;document.head.appendChild(css);
 const panel=document.querySelector('#dragonLabV51');
 if(!panel)return;
 const section=document.createElement('section');section.id='mountainRideV57';section.innerHTML=`
  <strong>MONTARIA · DRAGÃO DA MONTANHA</strong>
  <p>Chegue perto do dragão e pressione M/E para ESCALAR e montar (igual à aranha). WASD/joystick move, mouse vira, Shift acelera.
  Espaço decola e sobe; Ctrl/C desce; F inicia o pouso controlado; E/M desmonta após tocar o chão.</p>
  <p>Andar/correr em loop contínuo. Assento no dorso e colisão física: o personagem não fica mais flutuando nem atravessa o corpo no chão.</p>
  <div class="mrGrid">
   <button data-mr="mount">ESCALAR E MONTAR · M/E</button>
   <button data-mr="flight">DECOLAR / POUSAR · F</button>
   <button data-mr="camera">CÂMERA 3ª / 1ª</button>
   <button data-mr="invert">CORRIGIR SENTIDO</button>
   <button data-mr="seat">TROCAR POSE SENTADA</button>
   <button data-mr="resetCamera">REAJUSTAR CÂMERA</button>
   <button data-mr="up">SUBIR</button>
   <button data-mr="down">DESCER</button>
   <button data-mr="fire">FOGO · R</button>
   <button data-mr="strike">GOLPE DE ASAS · T (SOLO)</button>
   <button data-mr="climb1">ESCALADA 1 · POV</button>
   <button data-mr="climb2">ESCALADA 2 · POV</button>
   <button data-mr="climbCancel">CANCELAR ESCALADA</button>
  </div>
  <p class="mrSmall">Postura: <span id="mrSeatNameV61">Male Sitting Pose</span></p>
  <p class="mrSmall" id="mrStatusV57">Aproxime-se do Dragão da Montanha.</p>
  <div class="mrBar"><div class="mrFill" id="mrHeightFillV57"></div></div>
  <p class="mrSmall" id="mrHeightTextV57">Altitude: 0 m</p>`;
 panel.appendChild(section);
 const touch=document.createElement('div');touch.id='mountainRideTouchV57';touch.innerHTML=`
 <button data-mrt="mount">MONTAR</button>
 <button data-mrt="flight">VOO</button>
 <button data-mrt="up">SUBIR</button>
 <button data-mrt="down">DESCER</button>
 <button data-mrt="fire">FOGO</button>
 <button data-mrt="strike">GOLPE</button>
 <button data-mrt="climb1">ESCALADA 1</button>
 <button data-mrt="climb2">ESCALADA 2</button>`;
 document.body.appendChild(touch);
 const $=id=>document.getElementById(id);
 function message(m){const el=$('mrStatusV57');if(el)el.textContent=m}
 // Na V59 o laboratório separa 18 clipes nativos e usa a classificação conferida.
 // cada um independente, com chave, nome e duração. A montaria usa os mesmos
 // clipes que aparecem no seletor (não corta outros trechos por aproximação).
 const replay=new Set(['idle','walk','walkLater','run','runLater','fly']);
 function prepareClips(e){
   if(e.rideClips)return e.rideClips;
   const result={};
   for(const clip of e.clips||[]){
     const m=/^MD58_([A-Za-z]+)_/.exec(clip.name);
     if(m)result[m[1]]=clip;
   }
   if(!result.idle||!result.walk||!result.fly||!result.takeoff||!result.landing){
     throw Error('Take da Montanha não foi dividido em ações independentes.');
   }
   e.rideClips=result;
   return result;
 }
 function anim(e,name,force=false){
   if(e?.action?.getClip?.()?.userData?.exclusiveDeath===true)return;
   if(!e?.mixer)return;
   const clips=prepareClips(e);
   if(!clips[name])name=clips.idle?'idle':'fly';
   const clip=clips[name];
   // O mesmo estado NUNCA recebe reset(); o mixer faz o LoopRepeat sozinho.
   // É isso que mantém os passos e as batidas de asas CONTÍNUOS enquanto movemos.
   if(state.activeClip===name && e.action?.getClip?.()===clip)return;
   const next=e.mixer.clipAction(clip),old=e.action;
   if(old===next){state.activeClip=name;return;}
   const loop=replay.has(name);
   next.reset();next.enabled=true;next.paused=false;
   next.setEffectiveWeight(1);next.setEffectiveTimeScale(1);
   next.setLoop(loop?T.LoopRepeat:T.LoopOnce,loop?Infinity:1);
   next.clampWhenFinished=!loop;
   next.play();
   if(old&&old!==next){
     // Transição suave entre duas poses reais, sem refazer o passo atual.
     old.fadeOut(.18);
     next.fadeIn(.18);
   }
   e.action=next;state.activeClip=name;
   if(lab?.dragons.includes(e)){
     const index=e.clips.indexOf(clip);if(index>=0){e.index=index;
       const select=document.getElementById('dgClipsV51');if(select&&select.options.length>index)select.value=String(index);
     }
   }
 }

 function mountDirect(targetDragon=null){
   if(!ready()||isBlocked()||state.climb.active)return false;
   if(state.mounted){return unmount();}
   const e=targetDragon||nearest();
   if(!e||!lab.dragons.includes(e)){message('Chegue mais perto de um Dragão da Montanha.');return false}
   try{prepareClips(e)}catch(err){message('Animações: '+err.message);return false}
   state.mounted=e;state.air=false;state.landing=false;state.landingFinal=false;
   state.airHeight=0;state.wantHeight=0;state.activeClip='';
   state.smoothedYaw=game.player.yaw;state.bodyYaw=game.player.yaw;
   state.speed=0;state.cameraReady=false;state.armRest=null;state.armSeconds=0;
   state.saddleReady=false;state.saddleDragon=null;state.spineBob.set(0,0,0);
   if(state.saddleAnchor){state.saddleAnchor.removeFromParent();state.saddleAnchor=null;}
   state.phaseUntil=0;state.attackUntil=0;
   e.holder.rotation.y=game.player.yaw;
   setupDragonOrientation(e);
   // Calcular o assento COM a pose idle já animada, não com o T-pose.
   anim(e,'idle',true);e.mixer?.update(.016);
   // Antes de fixar a sela, garantir que a criatura esteja apoiada no piso.
   if(!e._v71FeetAligned){
     const wasMounted=state.mounted;state.mounted=null;
     alignDragonFeet(e,true);state.mounted=wasMounted;
   }
   if(!createSaddleAnchor(e)){
     state.mounted=null;state.activeClip='';
     message('Montaria bloqueada: '+state.saddleError);updateControls();return false;
   }
   game.player.x=e.holder.position.x;game.player.z=e.holder.position.z;
   game.player.bodyYaw=game.player.yaw;
   game.trueFirstPerson.state&&(game.trueFirstPerson.state.mode='Montado no Dragão da Montanha');
   // Não cria cópias de malhas, rigs ou materiais.
   window.gameRightHand?.unequip?.();
   window.gameShield?.unequip?.();
   updateDragonSolids();
   message('Montado! WASD anda · Espaço decola · F pousa · M desce.');
   updateControls();
   return true;
 }
 // Igual à aranha V37: M/E sobe pelo corpo, não teleporta direto para a sela.
 function mount(){
   if(!ready()||isBlocked())return false;
   if(state.climb.active)return false;
   if(state.mounted)return unmount();
   return startDragonClimb(state.climb.selectedIndex??1);
 }
 function unmount(){
   const e=state.mounted;if(!e)return false;
   if(state.air||state.landing||state.airHeight>.35){message('Aguarde as patas tocarem o chão para desmontar.');return false;}
   // V72: referência anatômica em coordenadas mundiais, nunca o pivô do GLB.
   e.holder.updateMatrixWorld(true);
   const body=dragonBodyWorld(e,new T.Vector3());
   const hasSeat=seatOnDragon(e);
   const center=(hasSeat&&Math.hypot(seatWorld.x-body.x,seatWorld.z-body.z)<4.5)
     ?seatWorld.clone():body.clone();
   if(!Number.isFinite(center.x)||!Number.isFinite(center.z)){
     message('Posição do dragão indisponível. Tente pousar novamente.');return false;
   }
   const yaw=e.holder.rotation.y;
   const rightX=Math.cos(yaw),rightZ=-Math.sin(yaw);
   const forwardX=-Math.sin(yaw),forwardZ=-Math.cos(yaw);
   // Desativar o estado montado só para testar os colisores reais no chão.
   // Se não existir ponto seguro, mantemos o cavaleiro na montaria.
   state.mounted=null;
   updateDragonSolids();
   let landing=null;
   // Começa ao lado do tronco (≈2 metros), alternando as duas laterais.
   // A expansão pequena evita que o jogador apareça 6-9 m longe do dragão.
   for(const radius of [2.0,2.35,2.7,3.1,3.55,4.0,4.5,5.0,5.5]){
     for(const sign of [1,-1]){
       for(const ahead of [0,.5,-.5,1.0,-1.0]){
         const x=center.x+rightX*radius*sign+forwardX*ahead;
         const z=center.z+rightZ*radius*sign+forwardZ*ahead;
         if(Math.hypot(x-body.x,z-body.z)>7.0)continue;
         if(!game.collides?.(x,z)){
           landing={x,z};break;
         }
       }
       if(landing)break;
     }
     if(landing)break;
   }
   if(!landing){
     state.mounted=e;
     updateDragonSolids();
     message('Não há espaço seguro ao lado do dragão para desmontar.');
     return false;
   }
   state.activeClip='';state.attackUntil=0;
   state.armRest=null;state.speed=0;state.spine=null;state.spineRest=null;
   state.cameraReady=false;state.phaseUntil=0;
   anim(e,'idle',true);
   updateDragonSolids();
   game.player.x=landing.x;
   game.player.z=landing.z;
   const towardX=body.x-landing.x;
   const towardZ=body.z-landing.z;
   const facing=Math.atan2(-towardX,-towardZ);
   game.player.yaw=facing;game.player.bodyYaw=facing;
   game.player.speed=4.5;
   if(game.torchRoot)game.torchRoot.visible=!!game.isEquipped?.();
   const avatar=game.trueFirstPerson?.visibleRoot;
   if(avatar){
     avatar.rotation.set(0,facing,0);
     avatar.position.set(landing.x,game.groundY(landing.x,landing.z),landing.z);
     avatar.updateMatrixWorld(true);
   }
   if(state.saddleAnchor){state.saddleAnchor.removeFromParent();state.saddleAnchor=null;}
   state.saddleReady=false;state.saddleDragon=null;
   updateControls();
   message('Você está ao lado do dragão. M/E para escalar e montar novamente.');
   return true;
 }
 // As duas escaladas já aprovadas na aranha V37, aplicadas ao MESMO rig humano do jogador.
 const climbKey=name=>String(name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'');
 const climbQ=new T.Quaternion(),climbEyeQ=new T.Quaternion(),climbMouseHeadQ=new T.Quaternion();
 const climbEye=new T.Vector3(),climbForward=new T.Vector3(),climbFacingForward=new T.Vector3(0,0,-1);
 const climbTempWorld=new T.Vector3(),climbTempWorldB=new T.Vector3();
 const climbNames=['Escalada 1 · Climbing.fbx','Escalada 2 · Climbing (1).fbx'];
 state.climb.selectedIndex=1;
 function climbEase(x){const t=clamp(x,0,1);return t*t*(3-2*t)}
 async function loadDragonClimbAnimations(){
   const cl=state.climb;
   try{
     const b64=window.__MOUNTAIN_CLIMB_CLIPS_GZ64;
     if(!b64)throw Error('Arquivo com as 2 escaladas não foi incorporado.');
     const raw=Uint8Array.from(atob(b64),c=>c.charCodeAt(0));
     let data;
     if(typeof DecompressionStream!=='undefined')
       data=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
     else if(typeof window.__FFLATE_GUNZIP_SYNC==='function')
       data=new TextDecoder().decode(window.__FFLATE_GUNZIP_SYNC(raw));
     else throw Error('Descompactador GZIP indisponível');
     const parsed=JSON.parse(data);
     if(!Array.isArray(parsed)||parsed.length!==2)throw Error('As duas escaladas não foram encontradas.');
     const boneMap=new Map();
     game.trueFirstPerson.model.traverse(obj=>{
       if(obj.isBone){const id=climbKey(obj.name);if(id&&!boneMap.has(id))boneMap.set(id,obj)}
     });
     cl.clips=parsed.map((obj,i)=>{
       const clip=T.AnimationClip.parse(obj.clips[0]);
       if(clip.tracks.length<45||clip.duration<.25)throw Error('Escalada '+(i+1)+' inválida');
       return clip;
     });
     cl.bindings=cl.clips.map(clip=>clip.tracks.map(track=>{
       if(!track.name.endsWith('.quaternion'))return null;
       const name=track.name.slice(0,track.name.lastIndexOf('.'));
       const bone=boneMap.get(climbKey(name));
       if(!bone)return null;
       return {bone,sample:track.createInterpolant(new Float32Array(4))};
     }).filter(Boolean));
     if(cl.bindings.some(x=>x.length<45))throw Error('O esqueleto do personagem não aceita as escaladas.');
     cl.ready=true;
     console.info('[V66] Escaladas originais carregadas:',cl.clips.map((x,i)=>({name:i+1,seconds:x.duration,bones:cl.bindings[i].length})));
   }catch(e){cl.error=String(e.message||e);console.error('[V66] Escalada:',e)}
 }
 void loadDragonClimbAnimations();
 function cancelDragonClimb(restore=true){
   const cl=state.climb;
   if(!cl.active)return false;
   cl.active=false;
   const begin=cl.start?.clone();
   cl.dragon=null;cl.eyeToCameraQuaternion=null;cl.startingCameraQuaternion=null;
   if(restore&&begin){
     game.player.x=begin.x;game.player.z=begin.z;
     game.trueFirstPerson.visibleRoot.position.copy(begin);
   }
   game.player.speed=4.5;
   state.cameraReady=false;
   updateDragonSolids();
   message('Escalada cancelada. M/E para tentar de novo.');
   return true;
 }
 function approachInfo(e){
   // V72: direção da aproximação calculada pelo TRONCO real do dragão.
   const body=dragonBodyWorld(e,new T.Vector3());
   const dx=game.player.x-body.x,dz=game.player.z-body.z;
   const dist=Math.max(.001,Math.hypot(dx,dz));
   const heading=yawNorm(e.holder.rotation.y);
   const forward=(-dx*Math.sin(heading)-dz*Math.cos(heading))/dist;
   const right=(dx*Math.cos(heading)-dz*Math.sin(heading))/dist;
   const side=Math.abs(right)>Math.abs(forward)
     ?right>0?'lado direito':'lado esquerdo':forward>0?'frente':'trás';
   return {dist,dx:dx/dist,dz:dz/dist,side,heading};
 }
 function startDragonClimb(index=1){
   const cl=state.climb;
   if(!ready()||isBlocked())return false;
   if(state.mounted){message('Desça do dragão para fazer a escalada.');return false}
   if(cl.active){message('A escalada já está em andamento.');return false}
   if(!cl.ready){message(cl.error?'Escalada indisponível: '+cl.error:'Carregando as duas escaladas...');return false}
   index=index===0?0:1;
   cl.selectedIndex=index;
   const e=nearest();
   if(!e){message('Aproxime-se do Dragão da Montanha.');return false}
   const side=approachInfo(e);
   if(side.dist>9.2){message('Chegue mais perto do corpo do dragão para subir.');return false}
   // Fixar sela na geometria real. Uma falha impede a escalada em vez de teleportar.
   if(!seatOnDragon(e)){message('Sela não localizada: '+state.saddleError);return false}
   const tfp=game.trueFirstPerson,p=game.player;
   const ground=game.groundY(p.x,p.z);
   const start=new T.Vector3(p.x,ground,p.z);
   const end=seatWorld.clone().add(new T.Vector3(0,-.86,0));
   const outward=new T.Vector3(start.x-end.x,0,start.z-end.z);
   if(outward.lengthSq()<.01)outward.set(side.dx,0,side.dz);
   outward.normalize();
   const inward=outward.clone().negate();
   // Etapas V37: aproximar por fora -> subir na lateral -> passar por cima -> sentar.
   // O primeiro estágio mantém o personagem fora da malha, sem atravessá-la.
   const distToSeat=Math.hypot(start.x-end.x,start.z-end.z);
   const contactRadius=Math.min(Math.max(1.50,distToSeat*.76),Math.max(1.55,distToSeat-.38));
   const contact=end.clone().addScaledVector(outward,contactRadius);
   contact.y=ground+.05;
   const edge=end.clone().addScaledVector(outward,Math.max(.95,contactRadius*.72));
   edge.y=Math.max(start.y+.70,end.y-.45);
   const crest=end.clone().addScaledVector(outward,.60);
   crest.y=end.y+.26;
   cl.active=true;cl.dragon=e;cl.index=index;cl.elapsed=0;cl.duration=cl.clips[index].duration;
   cl.start=start;cl.contact=contact;cl.edge=edge;cl.crest=crest;cl.end=end;
   cl.away=outward;cl.side=side.side;
   cl.initialYaw=p.yaw;cl.initialPitch=p.pitch;
   cl.heading=Math.atan2(-inward.x,-inward.z);
   cl.finalYaw=side.heading;
   cl.startingCameraQuaternion=new T.Quaternion().setFromEuler(new T.Euler(p.pitch,p.yaw,0,'YXZ'));
   cl.eyeToCameraQuaternion=null;
   cl.startingPosition=start.clone();
   e.lastDragonClimbStart=start.clone();
   // Mesma entrada de montaria da aranha: libera as mãos, trava movimento no chão.
   window.gameRightHand?.unequip?.();window.gameShield?.unequip?.();
   game.keys.clear?.();
   if(game.stick){game.stick.x=0;game.stick.y=0}
   p.speed=0;state.cameraReady=false;
   updateDragonSolids();
   const btn=section.querySelector('[data-mr="mount"]');if(btn)btn.textContent='SUBINDO...';
   message(climbNames[index]+' · '+side.side+' · visão dos olhos · 0%');
   return true;
 }
 function updateDragonClimbAvatar(time,dt,groundY,onGround,fallSpeed,nativeAvatar){
   const cl=state.climb;
   if(!cl.active)return false;
   if(!cl.dragon||!lab.dragons.includes(cl.dragon)||!ready()){
     cancelDragonClimb();return false;
   }
   const step=clamp(Number(dt)||0,0,.055);
   // O animador nativo atualiza o mesmo corpo do jogador. A trilha da escalada
   // substitui as poses, SEM criar outro modelo, braços ou câmera artificial.
   nativeAvatar.call(this,time,false,0,groundY,onGround,fallSpeed);
   const tfp=game.trueFirstPerson,body=tfp.visibleRoot;
   cl.elapsed=Math.min(cl.duration,cl.elapsed+step);
   const t=clamp(cl.elapsed/Math.max(.01,cl.duration),0,1);
   // O corpo acompanha as animações reais do dragão se ele respirar/mover o dorso.
   if(seatOnDragon(cl.dragon)){
     const desiredEnd=seatWorld.clone().add(new T.Vector3(0,-.86,0));
     const delta=desiredEnd.sub(cl.end);
     cl.end.add(delta);
     cl.contact.add(delta);cl.edge.add(delta);cl.crest.add(delta);
   }
   let a,b,u;
   if(t<.13){a=cl.start;b=cl.contact;u=climbEase(t/.13)}
   else if(t<.54){a=cl.contact;b=cl.edge;u=climbEase((t-.13)/.41)}
   else if(t<.76){a=cl.edge;b=cl.crest;u=climbEase((t-.54)/.22)}
   else{a=cl.crest;b=cl.end;u=climbEase((t-.76)/.24)}
   body.position.copy(a).lerp(b,u);
   body.position.y+=Math.sin(Math.PI*t)*.023;
   let facing=yawSmooth(cl.initialYaw,cl.heading,climbEase(t/.20));
   if(t>.74)facing=yawSmooth(facing,cl.finalYaw,climbEase((t-.74)/.26));
   body.rotation.order='YXZ';body.rotation.set(0,facing,0,'YXZ');
   const clip=cl.clips[cl.index];
   const animTime=Math.max(0,Math.min(clip.duration-.0001,cl.elapsed));
   for(const {bone,sample} of cl.bindings[cl.index]){
     const q=sample.evaluate(animTime);
     climbQ.set(q[0],q[1],q[2],q[3]).normalize();bone.quaternion.copy(climbQ);
   }
   // Como na V37, o usuário olha com o mouse, mas cabeça acompanha a pose
   // FBX e permanece anatomicamente limitada.
   const lookYaw=clamp(yawNorm(game.player.yaw-cl.initialYaw),-Math.PI*50/180,Math.PI*50/180);
   const lookPitch=clamp(game.player.pitch-cl.initialPitch,-.70,.70);
   const head=tfp.bones?.head;
   if(head){
     climbMouseHeadQ.setFromEuler(new T.Euler(lookPitch*.70,lookYaw*.70,0,'YXZ'));
     head.quaternion.multiply(climbMouseHeadQ).normalize();
   }
   body.updateMatrixWorld(true);
   const eyes=tfp.eyeSocket;
   if(eyes){
     eyes.getWorldQuaternion(climbEyeQ);
     if(!cl.eyeToCameraQuaternion){
       cl.eyeToCameraQuaternion=climbEyeQ.clone().invert().multiply(
          cl.startingCameraQuaternion||game.camera.quaternion).normalize();
     }
     game.camera.quaternion.copy(climbEyeQ).multiply(cl.eyeToCameraQuaternion).normalize();
     eyes.getWorldPosition(climbEye);
     climbForward.copy(climbFacingForward).applyQuaternion(game.camera.quaternion);
     climbForward.y=0;
     if(climbForward.lengthSq()<.0001)climbForward.set(-Math.sin(facing),0,-Math.cos(facing));
     else climbForward.normalize();
     climbEye.addScaledVector(climbForward,.29);
     climbEye.y+=.075;
     game.camera.position.copy(climbEye);
     game.camera.updateMatrixWorld(true);
     if(tfp.state)tfp.state.eyeError=game.camera.position.distanceTo(climbEye);
   }else{
     game.camera.position.copy(body.position).add(new T.Vector3(0,1.65,0));
     game.camera.rotation.set(game.player.pitch,facing,0,'YXZ');
     game.camera.updateMatrixWorld(true);
   }
   game.player.x=body.position.x;game.player.z=body.position.z;game.player.speed=0;
   if(game.torchRoot)game.torchRoot.visible=false;
   if(t>=1){
     const dragon=cl.dragon,finalYaw=cl.finalYaw,finishedIndex=cl.index;
     cl.active=false;cl.dragon=null;
     cl.eyeToCameraQuaternion=null;cl.startingCameraQuaternion=null;
     game.player.yaw=finalYaw;game.player.bodyYaw=finalYaw;
     // Monta diretamente o MESMO dragão. Não passa pela busca de outro alvo,
     // nem dispara a escalada de novo (que M/E inicia quando desmontado).
     const success=lab.dragons.includes(dragon)&&mountDirect(dragon);
     message(success?climbNames[finishedIndex]+' concluída · sentado no dragão.':
       'Escalada concluída, mas a sela não foi encontrada.');
     state.cameraReady=false;updateControls();
   }else if(Math.floor(cl.elapsed*5)!==Math.floor((cl.elapsed-step)*5)){
     message(climbNames[cl.index]+' · '+cl.side+' · subindo '+Math.round(t*100)+'%');
   }
   return true;
 }

 // Os golpes apenas reproduzem as animações originais; danos e projéteis
 // não são criados aqui. Evita interromper decolagem, pouso e ataque.
 function attackMotion(kind){
   const e=state.mounted;if(!e){message('Monte primeiro para atacar.');return false}
   if(state.landing){message('Aguarde o pouso terminar antes de atacar.');return false}
   const now=performance.now();
   if(state.attackUntil>now||state.phaseUntil>now){message('Aguarde o movimento terminar.');return false}
   // No ar SÓ existe fogo aéreo. A altura não define o tipo de ataque:
   // em decolagem baixa, 1m do chão ainda é voo, não ataque terrestre.
   const airborne=state.air;
   if(airborne&&kind!=='fire'){message('Em voo o dragão ataca apenas com FOGO · R.');return false}
   const name=kind==='fire'?(airborne?'fireAir':'fireGround'):'wingGround';
   const clip=prepareClips(e)[name];
   if(!clip){message('Animação de ataque indisponível.');return false}
   anim(e,name,true);
   state.attackUntil=now+clip.duration*1000;
   // O estado air e a altitude nunca são alterados por um golpe. Ao terminar,
   // a próxima atualização troca de volta para o ciclo fly, não para walk.
   message((kind==='fire'?'Fogo':'Golpe de asas')+(airborne?' no ar':' no chão')+' · animação original.');
   return true;
 }
 function flight(){
   if(!state.mounted){message('Monte no Dragão da Montanha primeiro.');return false}
   if(state.landing){message('Pouso em andamento: aguarde o dragão tocar o solo.');return false;}
   state.attackUntil=0;
   if(state.air){
     // V73: o dragão CONTINUA em estado aéreo até tocar o chão de verdade.
     // Antes, a tecla F desligava o voo na mesma hora e iniciava a animação
     // longe do solo, quebrando a aterrissagem e as interações da montaria.
     state.landing=true;state.landingFinal=false;
     state.landingStarted=performance.now();state.landingHeight=0;
     state.wantHeight=0;state.phaseUntil=0;
     anim(state.mounted,'descending',true);
     message('Descendo para pousar... mantenha a direção e aguarde o contato com o chão.');
   }else{
     state.air=true;state.landing=false;state.landingFinal=false;
     state.wantHeight=Math.max(7,state.airHeight);
     anim(state.mounted,'takeoff',true);
     state.phaseUntil=performance.now()+prepareClips(state.mounted).takeoff.duration*1000;
     message('Decolando! Segure Espaço/SUBIR para ganhar altitude.');
   }
   updateControls();
   return true;
 }
 function toggleCamera(){state.camThird=!state.camThird;state.cameraReady=false;message(state.camThird?'Câmera atrás do dragão.':'Câmera no assento do dragão.')}
 function updateControls(){
   const e=state.mounted;
   // V72 Mobile: o botão de MONTAR continua disponível quando o jogador
   // está perto do dragão, inclusive após desmontar. No PC nada muda.
   const touchNearby=!!e||!!nearest();
   touch.classList.toggle('show',ready()&&touchNearby);
   for(const b of touch.querySelectorAll('button[data-mrt]')){
     const action=b.dataset.mrt;
     b.style.display=(!e&&!['mount','climb1','climb2'].includes(action))?'none':'';
   }
   const btn=section.querySelector('[data-mr="mount"]');
   if(btn)btn.textContent=state.climb.active?'SUBINDO...':e?'DESMONTAR · M/E':'ESCALAR E MONTAR · M/E';
   const tb=touch.querySelector('[data-mrt="mount"]');if(tb)tb.textContent=state.climb.active?'SUBINDO':e?'DESCER':'ESCALAR';
   const fb=section.querySelector('[data-mr="flight"]');   if(fb){fb.textContent=state.landing?'POUSANDO...':state.air?'POUSAR · F':'DECOLAR · F';fb.disabled=state.landing;}
   const ft=touch.querySelector('[data-mrt="flight"]');
   if(ft){ft.textContent=state.landing?'POUSANDO':state.air?'POUSAR':'VOO';ft.disabled=state.landing;}
   // No ar: esconde/desativa o golpe físico. Apenas fogo fica disponível.
   for(const el of [section.querySelector('[data-mr="strike"]'),touch.querySelector('[data-mrt="strike"]')]){
     if(el){el.disabled=!!state.air;el.style.opacity=state.air?'.45':'';el.title=state.air?'No ar: use somente fogo':'';}
   }
 }
 function handleAction(type){
   if(state.climb.active&&type!=='climbCancel')return;
   if(type==='mount')mount();
   if(type==='flight')flight();
   if(type==='camera')toggleCamera();
   if(type==='seat'){chooseRideSeat((rideSeatIndex+1)%5);message('Assento: '+sitNames[rideSeatIndex])}
   if(type==='resetCamera'){state.cameraReady=false;message('Câmera reajustada ao dorso do dragão.')}
   if(type==='fire'||type==='strike')attackMotion(type);
   if(type==='climb1'||type==='climb2')startDragonClimb(type==='climb1'?0:1);
   if(type==='climbCancel')cancelDragonClimb();
   if(type==='invert'){
     state.faceOffset=state.faceOffset?0:Math.PI;
     state.cameraReady=false;message('Sentido do dragão invertido manualmente.');
   }
 }
 section.addEventListener('click',ev=>{
   const b=ev.target.closest('button[data-mr]');
   if(!b)return;
   const action=b.dataset.mr;
   if(['up','down'].includes(action)){
     if(!state.mounted)return;
     if(action==='up'&&!state.landing){if(!state.air)flight();state.wantHeight=Math.min(90,state.wantHeight+3)}
     if(action==='down'&&!state.landing){state.wantHeight=Math.max(.7,state.wantHeight-3)}
   }else handleAction(action);
 });
 touch.addEventListener('pointerdown',ev=>{
   const b=ev.target.closest('button[data-mrt]');if(!b)return;
   ev.preventDefault();
   const act=b.dataset.mrt;
   if(act==='up'||act==='down'){
      if(state.landing)return;
      holding[act]=true;b.setPointerCapture?.(ev.pointerId);
      if(act==='up'&&state.mounted&&!state.air)flight();}
   else handleAction(act);
 });
 const release=()=>{holding.up=false;holding.down=false;};
 touch.addEventListener('pointerup',release);
 touch.addEventListener('pointercancel',release);
 window.addEventListener('blur',release);
 let spaceHeld=false;
 let lastProximityCheck=0;
 window.addEventListener('keydown',event=>{
   if(!ready()||isBlocked())return;
   if(state.climb.active){
     if(event.code==='Escape'){event.preventDefault();cancelDragonClimb();}
     if(['KeyE','KeyM','KeyR','KeyT','Space','KeyF'].includes(event.code)){event.preventDefault();event.stopImmediatePropagation();}
     return;
   }
   if(['KeyE','KeyM'].includes(event.code)){
     if(event.repeat)return;
     if(state.mounted||nearest()){
       event.preventDefault();event.stopImmediatePropagation();mount();
     }
     return;
   }
   if(!state.mounted)return;
   if(event.code==='Space'){
     event.preventDefault();event.stopImmediatePropagation();
     spaceHeld=true;
     if(!state.air&&!event.repeat)flight();
   }
   if(event.code==='KeyF'){
     event.preventDefault();event.stopImmediatePropagation();
     if(!event.repeat)flight();
   }
   if(event.code==='KeyR'||event.code==='KeyT'){
     event.preventDefault();event.stopImmediatePropagation();
     if(!event.repeat)attackMotion(event.code==='KeyR'?'fire':'strike');
   }
   if(['KeyC','ControlLeft','ControlRight'].includes(event.code)){
     event.preventDefault();event.stopImmediatePropagation();holding.down=true;
   }
 },true);
 window.addEventListener('keyup',event=>{
   if(event.code==='Space')spaceHeld=false;
   if(['KeyC','ControlLeft','ControlRight'].includes(event.code))holding.down=false;
 },true);
 // Processa controle no mesmo tick que o movimento original do Floresta.
 // A velocidade é zerada DEPOIS da preparação do avatar para evitar dupla movimentação.
 const nativePrepare=window.__prepareAnimatedAvatar;
 if(typeof nativePrepare!=='function'){message('Controlador de movimento não encontrado.');return}
 window.__prepareAnimatedAvatar=function(dt,moving){
   const e=state.mounted;
   if(state.climb.active){
     nativePrepare.call(this,dt,false);
     game.player.speed=0;
     return;
   }
   if(!e)return nativePrepare.apply(this,arguments);
   const p=game.player,step=clamp(dt||0,0,.05),input=moveInput();
   const look=p.yaw;
   // O dragão vira progressivamente em direção à câmera, e o cavaleiro
   // acompanha a orientação de locomoção; pode olhar até ~50° para o lado.
   const turnError=yawNorm(look-state.bodyYaw),headLimit=.87;
   const desiredYaw=Math.abs(turnError)>headLimit?yawNorm(look-Math.sign(turnError)*headLimit):state.bodyYaw;
   const activeTurn=input.amount>.03||state.air;
   state.bodyYaw=yawSmooth(state.bodyYaw,activeTurn?look:desiredYaw,1-Math.exp(-step*(activeTurn?5.5:2.0)));
   e.holder.rotation.y=state.bodyYaw;
   e.root.rotation.y=e.rideFacing+state.faceOffset;
   p.bodyYaw=state.bodyYaw;
   const targetSpeed=input.amount*(state.air?(input.run?19:12):(input.run?10:6.4))
     *(state.landing?(state.landingFinal ? 0.32 : 0.65):1);
   const response=1-Math.exp(-step*(targetSpeed>Math.abs(state.speed)?7.5:11));
   state.speed+=(targetSpeed-state.speed)*response;
   if(Math.abs(state.speed)<.008)state.speed=0;
   const vx=(-Math.sin(state.bodyYaw)*input.f+Math.cos(state.bodyYaw)*input.s)*state.speed*step;
   const vz=(-Math.cos(state.bodyYaw)*input.f-Math.sin(state.bodyYaw)*input.s)*state.speed*step;
   const nx=e.holder.position.x+vx,nz=e.holder.position.z+vz;
   // Já muito perto do solo, obstáculos não podem ser atravessados.
   const nearTouchdown=state.landing&&state.landingFinal&&state.airHeight<1.5;
   if((state.air&&!nearTouchdown)||!game.collides||!game.collides(nx,nz)){
     e.holder.position.x=nx;e.holder.position.z=nz;
   }
   if(state.landing){
     // Etapa 1: descer voando com velocidade proporcional à altitude.
     // Etapa 2: executar o clipe nativo de pouso DURANTE a aproximação final.
     const now=performance.now(),approach=5.5;
     state.wantHeight=0;
     if(!state.landingFinal){
       if(state.airHeight>approach+.001){
         const descendSpeed=Math.min(20,8+state.airHeight*.11);
         state.airHeight=Math.max(approach,state.airHeight-descendSpeed*step);
         const descendClip=prepareClips(e).descending;
         if(state.activeClip==='descending'&&now-state.landingStarted>(descendClip?.duration||1)*1000){
           anim(e,'fly');
         }
       }
       if(state.airHeight<=approach+.001){
         state.landingFinal=true;
         state.landingHeight=Math.max(0,state.airHeight);
         state.landingStarted=now;
         const duration=prepareClips(e).landing.duration;
         state.phaseUntil=now+duration*1000;
         anim(e,'landing',true);
         message('Pouso final: baixando as patas até o chão...');
       }
     }
     if(state.landingFinal){
       const duration=Math.max(.3,prepareClips(e).landing.duration);
       const t=clamp((now-state.landingStarted)/(duration*1000),0,1);
       const smooth=t*t*(3-2*t);
       state.airHeight=Math.max(0,state.landingHeight*(1-smooth));
       if(t>=1){
         state.airHeight=0;state.air=false;state.landing=false;
         state.landingFinal=false;state.wantHeight=0;state.phaseUntil=0;
         state.speed=0;
         anim(e,'idle');
         message('Pousou! O dragão está no chão. Pressione M/E para desmontar ou F para decolar.');
         updateControls();
       }
     }
   }else if(state.air){
     if(spaceHeld||holding.up)state.wantHeight=Math.min(90,state.wantHeight+8*step);
     if(holding.down)state.wantHeight=Math.max(1,state.wantHeight-8*step);
     state.airHeight+=(state.wantHeight-state.airHeight)*Math.min(1,step*2.0);
   }else{state.airHeight=Math.max(0,state.airHeight-5.5*step);}
   const ground=game.groundY(e.holder.position.x,e.holder.position.z);
   e.holder.position.y=ground+state.airHeight;
   p.x=e.holder.position.x;p.z=e.holder.position.z;
   const now=performance.now();
   const movingNow=input.amount>.07 && state.speed>.30;
   if(state.attackUntil>now){
     // Ataque é único; locomoção só retoma depois que termina.
   }else if(state.landing){
     // Animação de descida/pouso controlada pela altitude e pelo contato.
     // Não retornar para fly ou idle enquanto o dragão ainda está pousando.
   }else if(!state.air){
     const type=movingNow?(input.run?'run':'walk'):'idle';
     anim(e,type);
   }else if(now>=state.phaseUntil){
     // Em voo sempre retoma a batida de asas, MESMO quando o fogo termina
     // próximo do chão: jamais cai para caminhada/parado no ar.
     anim(e,'fly');
   }
   const action=e.action;
   if(action&&['walk','run'].includes(state.activeClip)){
     // Controla a cadência, mas NUNCA volta o contador da animação para zero.
     const nominal=state.activeClip==='run'?10:6.4;
     const cadence=clamp(state.speed/nominal,.68,1.35);
     action.setEffectiveTimeScale(input.f<-.15?-cadence:cadence);
     if(input.f<-.15&&action.time<.001)action.time=Math.max(.01,action.getClip().duration-.03);
   }
   if(action&&state.activeClip==='fly')action.setEffectiveTimeScale(input.run?1.2:1);
   nativePrepare.call(this,dt,false);
   p.speed=0;
   p.bodyYaw=state.bodyYaw;
 };
 // Sincroniza corpo real, olhos e câmera no tick original ANTES de renderizar.
 const nativeAvatar=window.__updateAnimatedAvatar;
 if(typeof nativeAvatar!=='function'){message('Controlador de câmera não encontrado.');return}
 const desiredCamera=new T.Vector3(),lookTarget=new T.Vector3(),cameraEye=new T.Vector3();
 window.__updateAnimatedAvatar=function(time,moving,dt,groundY,onGround,fallSpeed){
   const e=state.mounted;
   if(state.climb.active){
     if(updateDragonClimbAvatar.call(this,time,dt,groundY,onGround,fallSpeed,nativeAvatar))return;
   }
   if(!e)return nativeAvatar.apply(this,arguments);
   const frameDt=clamp(dt||0,0,.05);
   // O avatar nativo prepara braços e cabeça. Em seguida aplicamos a mesma
   // postura MIXAMO aprovada na montaria da aranha V37, só nas pernas/bacia.
   nativeAvatar.call(this,time,false,dt,groundY,true,0);
   const p=game.player,tfp=game.trueFirstPerson;
   if(!seatOnDragon(e)){message('Sela indisponível: '+state.saddleError);return;}
   // A origem do avatar fica nos PÉS quando ele está em pé.
   // A versão anterior colocava os pés na superfície e deixava o quadril
   // cerca de um metro ACIMA do dorso, aparentando levitação.
   tfp.visibleRoot.rotation.order='YXZ';
   tfp.visibleRoot.rotation.set(0,state.bodyYaw,0,'YXZ');
   updateRideSeat(frameDt);
   stabilizeRideArms(frameDt);
   tfp.visibleRoot.updateMatrixWorld(true);
   if(tfp.bones?.hips){
      tfp.bones.hips.getWorldPosition(hipsWorld);
      riderOffset.copy(hipsWorld).sub(tfp.visibleRoot.position);
      // Protege contra valores inválidos de outros controladores do avatar.
      if(!Number.isFinite(riderOffset.length())||riderOffset.length()>3.0)riderOffset.set(0,.86,0);
   }else riderOffset.set(0,.98,0);
   // O quadril, NÃO os pés, é o ponto que encosta na sela natural do dragão.
   tfp.visibleRoot.position.copy(seatWorld).sub(riderOffset);
   tfp.visibleRoot.updateMatrixWorld(true);
   lookTarget.copy(seatWorld).add(new T.Vector3(0,1.0,0));
   if(tfp.eyeSocket){
     tfp.eyeSocket.getWorldPosition(cameraEye);
     // Se outra animação puxar a cabeça para longe, a câmera NÃO segue o erro.
     if(cameraEye.distanceTo(seatWorld)<2.35)lookTarget.lerp(cameraEye,.45);
   }
   if(state.camThird){
     const distance=state.air?10.0:7.7;
     desiredCamera.set(
       lookTarget.x+Math.sin(state.bodyYaw)*distance,
       lookTarget.y+(state.air?3.0:2.3)+Math.sin(p.pitch)*2.0,
       lookTarget.z+Math.cos(state.bodyYaw)*distance
     );
     desiredCamera.y=Math.max(desiredCamera.y,e.holder.position.y+1.6);
     if(!state.cameraReady){state.cameraPos.copy(desiredCamera);state.cameraTarget.copy(lookTarget);state.cameraReady=true;}
     const k=1-Math.exp(-frameDt*9);
     state.cameraPos.lerp(desiredCamera,k);
     state.cameraTarget.lerp(lookTarget,k);
     game.camera.position.copy(state.cameraPos);
     game.camera.lookAt(state.cameraTarget);
   }else{
     cameraEye.copy(lookTarget);
     cameraEye.x-=Math.sin(p.yaw)*.20;
     cameraEye.z-=Math.cos(p.yaw)*.20;
     game.camera.position.copy(cameraEye);
     game.camera.rotation.set(p.pitch,p.yaw,0,'YXZ');
   }
   game.camera.updateMatrixWorld(true);
   if(game.torchRoot)game.torchRoot.visible=false;
 };
 function frame(now){
   requestAnimationFrame(frame);
   // Colisores dinâmicos acompanham TODOS os dragões da montanha em solo.
   updateDragonSolids();
   const e=state.mounted;
   if(!e){
     // Checar proximidade em intervalos curtos para exibir MONTAR no touch.
     if(now-lastProximityCheck>250){lastProximityCheck=now;updateControls();}
     return;
   }
   if(!ready()||!lab.dragons.includes(e)){
     state.mounted=null;state.air=false;state.landing=false;state.landingFinal=false;
     state.airHeight=0;state.activeClip='';
     updateControls();return;
   }
   const b=$('mrHeightFillV57'),label=$('mrHeightTextV57');
   if(b)b.style.width=(Math.min(90,state.airHeight)/90*100)+'%';
      if(label)label.textContent='Altitude: '+state.airHeight.toFixed(1)+' m · '+(state.landing?'pousando':state.air?'voando':'no solo');
   if(!state.landing&&!state.air&&state.airHeight<.1&&state.activeClip==='landing'&&now>=state.phaseUntil&&now>=state.attackUntil)anim(e,moveInput().amount>.1?(moveInput().run?'run':'walk'):'idle');
   if(state.air&&!state.landing&&state.airHeight>4.5&&state.activeClip==='takeoff'&&now>=state.phaseUntil)anim(e,'fly');
 }
 requestAnimationFrame(frame);
 window.gameMountainRide={mount,unmount,flight,updateControls,get mounted(){return state.mounted},get flying(){return state.air&&!state.landing},get landing(){return state.landing},get saddle(){return state.saddleLocal.clone()},get colliderCount(){return Array.from(solids.values()).reduce((n,a)=>n+a.length,0)},get climbing(){return state.climb.active},get climbReady(){return state.climb.ready},startClimb:startDragonClimb,get climbSide(){return state.climb.side},get climbProgress(){return state.climb.active?state.climb.elapsed/Math.max(.01,state.climb.duration):0},get climbCameraMode(){return state.climb.active?'Primeira pessoa · olhos':null},version:'V73 Pouso Completo + V72 Desmontagem e Remontagem'};
 console.info('[Floresta V73] Pouso real sincronizado com altitude e animação, mantendo correções de desmontagem/remontagem V72.');
})();
