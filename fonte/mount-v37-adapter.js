

/* FLORESTA — LABORATORIO CRIATIVO V174 / MONTARIA ARANHA · V10 PRIMEIRA PESSOA / PERNAS SENTADAS + APENAS TOCHA NAS MAOS
   Usa camera, avatar, controles, inventario e arena originais do jogo. */
(async()=>{
 'use strict';
 if(window.__FLORESTA_SPIDER_MOUNT_V10)return;
 window.__FLORESTA_SPIDER_MOUNT_V10=true; // V21 patch body-follow
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 const $=id=>document.getElementById(id);
 const notify=msg=>{const n=$('mountToastV3');if(!n)return;n.textContent=msg;n.classList.add('show');clearTimeout(notify.timer);notify.timer=setTimeout(()=>n.classList.remove('show'),2000)};
 const T=window.__THREE_MODULE,FBXLoader=window.__FBX_MODULE?.FBXLoader;
 if(!T||!FBXLoader){console.error('Aranha: módulos originais 3D indisponíveis.');return}
 let game=null;
 for(let t=0;t<1300;t++){
   if(window.gameReview?.scene&&window.gameReview?.trueFirstPerson?.visibleRoot&&window.gameTestMode?.enter&&window.gameFront172?.play){game=window.gameReview;break}
   await sleep(20);
 }
 if(!game){notify('Criativo V174 não ficou pronto.');console.error('Aranha: aguardou engine V174 e Criativo sem sucesso');return}
 const zone={get active(){return !!(window.gameTestMode?.active||window.gameSpiderCave?.rewardUnlocked||window.gameSpiderCave?.preparingMount||window.gameHackMode?.enabled||mounted||objects.length>0&&window.gameFront172?.started)}};
 const canPlay=()=>!!zone.active&&window.gameFront172?.started&&!window.gameFront172?.paused;
 let baseModel=null,clips={},objects=[],serial=0,mounted=null,lastPos={x:0,z:0},lastT=performance.now(),attackCooldown=0,actionLock=0,attackTargetDone=false,hideHealth=false;
 let mountHeight=1.41,orientationOffset=0,animationScale=1,setupError='';
 // V26: salto exclusivo da aranha MONTADA. A simulacao roda somente no
 // mesmo frame do avatar, aranha e camera (evita o tremor corrigido na V25).
 const mountJump={height:0,velocity:0,grounded:true};
 const MOUNT_JUMP_IMPULSE=6.9,MOUNT_JUMP_GRAVITY=17.8;
 function resetMountJump(){mountJump.height=0;mountJump.velocity=0;mountJump.grounded=true;}
 function jumpMounted(){
   if(!canPlay()||!mounted||mounted.dead||!mountJump.grounded)return false;
   mountJump.grounded=false;mountJump.velocity=MOUNT_JUMP_IMPULSE;mountJump.height=.001;
   notify('Aranha pulou!');return true;
 }
 function stepMountJump(dt){
   if(!mounted||mountJump.grounded)return;
   const step=clamp(Number(dt)||0,0,.055);
   const next=mountJump.height+mountJump.velocity*step-.5*MOUNT_JUMP_GRAVITY*step*step;
   mountJump.velocity-=MOUNT_JUMP_GRAVITY*step;
   if(next<=0){resetMountJump();return;}
   mountJump.height=next;
 }

 let avatarOriginalRotationOrder='XYZ';
 // Distância do assento em relação ao centro da aranha: sentido da parte traseira.
 const SEAT_REAR_OFFSET=1.98; // recuo ampliado junto com o comprimento do corpo
 const SEAT_SCALE_Y=0.32; // compensação da superfície mais alta, além do ajuste do painel (1,41)
 let seatMixer=null,seatActions=[],seatClips=[],seatIndex=0,seatCameraThird=false,seatLoadError='',seatLoading=false; let boundSeatBones=0,poseBindings=[],seatTime=0;
 const seatNames=['Male Sitting Pose','Male Sitting Pose (1)','Male Sitting Pose (2)','Sitting','Sitting Idle'];
 // V32: escalada 2 padrão, começando na frente, atrás ou nos lados reais da aranha.
 // A tradução dos ossos reutiliza o rig da primeira pessoa do jogo.
 let climbClips=[],climbBindings=[],climbIndex=1,climbLoadError='',climbReady=false;
 const climbLabels=['ESCALADA 1 · Climbing.fbx','ESCALADA 2 · Climbing (1).fbx'];
 const climbState={active:false,spider:null,elapsed:0,duration:0,index:0,
   start:null,approachBase:null,edge:null,crest:null,end:null,side:null,
   initialYaw:0,initialPitch:0,heading:0,finalYaw:0,
   startingCameraQuaternion:null,eyeToCameraQuaternion:null};
 const climbScratchQ=new T.Quaternion(),climbEye=new T.Vector3();
 // V30: os dois FBX de escalada determinam diretamente o olhar em primeira pessoa.
 // A calibragem inicial preserva o eixo frontal nativo da câmera do Floresta.
 const climbEyeQ=new T.Quaternion(),climbMouseHeadQ=new T.Quaternion();
 const climbForward=new T.Vector3(),climbForwardAxis=new T.Vector3(0,0,-1);
 // Só permite subir depois de realmente se aproximar do corpo da aranha.
 // Na V31 era possível iniciar a escalada a 6,2 unidades do centro.
 // Distância da superfície do corpo (NÃO do centro). Traseira é mais longa.
 const CLIMB_SURFACE_REACH=.92;
 // V34 — colisores medidos no FBX ORIGINAL V27, apos a escala aplicada.
 // O mesh Skin/Bone_Tail fica no Z NEGATIVO: cauda de -3.76 a -1.33.
 // A V33 tinha posto a cauda em +2.51: bloqueava o lado oposto e deixava
 // o jogador atravessar o abdomen por tras. Cada elipse engloba TODA a malha
 // correspondente (mais a folga do capsule do jogador e da camera nos olhos).
 const SPIDER_BODY_SHAPES=[
   {x:0,z:-.45,rx:.90,rz:1.06},  // torax real: x +-0.72; z -1.33..+0.40
   {x:0,z:-2.55,rx:1.08,rz:1.50} // abdomen real: x +-0.90; z -3.76..-1.33
 ];
 const PLAYER_SOLID_RADIUS=.34;
 const SPIDER_BODY_MARGIN=.16;
 const LEG_THICKNESS=.19;
 const collisionScratchWorld=new T.Vector3();
 const collisionLast={x:0,z:0,valid:false};
 // XZ do mundo para o referencial do pivot da aranha.
 function spiderLocalXZ(spider,x,z){
   const yaw=spider.pivot.rotation.y+(spider.root?.rotation.y||0),dx=x-spider.pivot.position.x,dz=z-spider.pivot.position.z;
   return {x:Math.cos(yaw)*dx-Math.sin(yaw)*dz,
           z:Math.sin(yaw)*dx+Math.cos(yaw)*dz};
 }
 function spiderWorldXZ(spider,x,z){
   const yaw=spider.pivot.rotation.y+(spider.root?.rotation.y||0);
   return {x:spider.pivot.position.x+Math.cos(yaw)*x+Math.sin(yaw)*z,
           z:spider.pivot.position.z-Math.sin(yaw)*x+Math.cos(yaw)*z};
 }
 // Distância assinada aproximada ao CONTORNO do corpo, diferente do raio
 // do pivô. Dá ~1m de aproximação tanto pela frente quanto por trás.
 function spiderBodySurface(spider,x,z){
   const p=spiderLocalXZ(spider,x,z);
   let best=null;
   for(const s of SPIDER_BODY_SHAPES){
     const dx=p.x-s.x,dz=p.z-s.z;
     const radial=Math.sqrt((dx/s.rx)**2+(dz/s.rz)**2);
     // Protege eixo central sem divisões por zero.
     const r=Math.max(.00001,radial);
     const cx=s.x+dx/r,cz=s.z+dz/r;
     const dist=Math.hypot(dx-(cx-s.x),dz-(cz-s.z))*(radial<1?-1:1);
     if(!best||dist<best.distance){
       let nx=dx/(s.rx*s.rx),nz=dz/(s.rz*s.rz);
       const n=Math.hypot(nx,nz)||1;nx/=n;nz/=n;
       best={distance:dist,shape:s,boundary:{x:cx,z:cz},normal:{x:nx,z:nz},local:p};
     }
   }
   return best;
 }
 function climbReach(spider,x=game.player.x,z=game.player.z){
   return spiderBodySurface(spider,x,z).distance;
 }
 function makeSpiderLegBones(spider){
   const dict=new Map();
   spider.root.traverse(obj=>{if(obj.isBone)dict.set(obj.name,obj)});
   spider.collisionLegs=[];spider.collisionSegments=[];
   for(const side of ['L','R'])for(let n=1;n<=4;n++){
     const code=String(n).padStart(2,'0');
     const prefix='Bone_Leg_'+code+'_';
     const thigh=dict.get(prefix+'Thigh_'+side),calf=dict.get(prefix+'Calf_'+side),toe=dict.get(prefix+'Toe_'+side);
     if(thigh&&calf&&toe)spider.collisionLegs.push([thigh,calf,toe]);
   }
 }
 function refreshSpiderLegCollision(spider){
   const result=spider.collisionSegments||[];
   result.length=0;
   if(!spider.collisionLegs?.length)return;
   for(const chain of spider.collisionLegs){
     const a=chain[0].getWorldPosition(new T.Vector3());
     const b=chain[1].getWorldPosition(new T.Vector3());
     const c=chain[2].getWorldPosition(new T.Vector3());
     result.push({a,b,r:LEG_THICKNESS+PLAYER_SOLID_RADIUS+.04});
     result.push({a:b,b:c,r:LEG_THICKNESS+PLAYER_SOLID_RADIUS});
     result.push({a:c,b:c.clone().addScaledVector(c.clone().sub(b),.29),r:LEG_THICKNESS*.75+PLAYER_SOLID_RADIUS});
   }
   spider.collisionSegments=result;
 }
 function pushOutSolidSpider(spider,point){
   function separateBody(){
     const p=spiderLocalXZ(spider,point.x,point.z);
     for(let tries=0;tries<6;tries++){
       let moved=false;
       for(const s of SPIDER_BODY_SHAPES){
         let dx=p.x-s.x,dz=p.z-s.z;
         const rx=s.rx+PLAYER_SOLID_RADIUS+SPIDER_BODY_MARGIN;
         const rz=s.rz+PLAYER_SOLID_RADIUS+SPIDER_BODY_MARGIN;
         const q=(dx/rx)**2+(dz/rz)**2;
         if(q>=1)continue;
         if(q<1e-9){dx=0;dz=(s.z < -1)?-1:1;}
         const k=1/Math.sqrt((dx/rx)**2+(dz/rz)**2);
         p.x=s.x+dx*k*1.002;p.z=s.z+dz*k*1.002;moved=true;
       }
       if(!moved)break;
     }
     const w=spiderWorldXZ(spider,p.x,p.z);
     point.x=w.x;point.z=w.z;
   }
   function separateLegs(){
     if(!spider.collisionSegments?.length)refreshSpiderLegCollision(spider);
     const pushSegment=(a,b,r)=>{
       const dx=b.x-a.x,dz=b.z-a.z,len2=dx*dx+dz*dz;
       const t=len2>1e-8?Math.max(0,Math.min(1,((point.x-a.x)*dx+(point.z-a.z)*dz)/len2)):0;
       const px=a.x+dx*t,pz=a.z+dz*t;
       let nx=point.x-px,nz=point.z-pz,dist=Math.hypot(nx,nz);
       if(dist>=r)return;
       if(dist<1e-7){
         nx=-dz;nz=dx;
         const perp=Math.hypot(nx,nz)||1;
         point.x+=nx/perp*(r+.003);point.z+=nz/perp*(r+.003);return;
       }
       const amt=(r-dist+.003)/dist;
       point.x+=nx*amt;point.z+=nz*amt;
     };
     for(const seg of spider.collisionSegments)pushSegment(seg.a,seg.b,seg.r);
   }
   for(let i=0;i<9;i++){
     const beforeX=point.x,beforeZ=point.z;
     separateBody();separateLegs();
     if(Math.hypot(point.x-beforeX,point.z-beforeZ)<.00001)break;
   }
   separateBody(); // guarda final: impossível terminar dentro do abdômen
   return point;
 }
 function resolveSpiderCollisions(groundedY){
   if(!zone.active||mounted||climbState.active){collisionLast.valid=false;return;}
   const p=game.player,old=collisionLast;
   let x=p.x,z=p.z;
   const travel=old.valid?Math.hypot(x-old.x,z-old.z):0;
   // Sweep anti-tunneling: corrige também movimento rápido entre frames.
   const substeps=(old.valid&&travel<8)?Math.min(40,Math.max(1,Math.ceil(travel/.16))):1;
   const usePrevious=old.valid&&travel<8;
   let test={x:usePrevious?old.x:x,z:usePrevious?old.z:z};
   const sx=test.x,sz=test.z;
   // Cache animado construído uma única vez por frame para 120 FPS.
   const candidates=[];
   for(const spider of objects){
     if(spider.dead||spider===mounted)continue;
     const d=Math.min(Math.hypot(x-spider.pivot.position.x,z-spider.pivot.position.z),
       Math.hypot(sx-spider.pivot.position.x,sz-spider.pivot.position.z));
     if(d>7.4||groundedY>spider.pivot.position.y+3.9)continue;
     spider.root.updateMatrixWorld(true);
     refreshSpiderLegCollision(spider);
     candidates.push(spider);
   }
   for(let step=1;step<=substeps;step++){
     if(usePrevious){
       test.x+=(x-sx)/substeps;
       test.z+=(z-sz)/substeps;
     }
     for(const spider of candidates){
       const d=Math.hypot(test.x-spider.pivot.position.x,test.z-spider.pivot.position.z);
       if(d<=6.2)pushOutSolidSpider(spider,test);
     }
   }
   // Guarda final POS-SWEEP: a ultima posicao aprovada nao pode ficar
   // dentro de nenhum corpo. Impede penetracao na traseira mesmo se uma
   // perna em movimento empurrar a capsula contra o abdomen.
   for(const spider of candidates){
     const d=Math.hypot(test.x-spider.pivot.position.x,test.z-spider.pivot.position.z);
     if(d<6.2)pushOutSolidSpider(spider,test);
   }
   p.x=test.x;p.z=test.z;
   old.x=p.x;old.z=p.z;old.valid=true;
 }

 const climbBoneKey=name=>String(name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'');
 function climbProgress(){return clamp(climbState.duration?climbState.elapsed/climbState.duration:1,0,1)}
 function climbSmooth(t){t=clamp(t,0,1);return t*t*(3-2*t)}
 function refreshClimbUI(){
   document.querySelectorAll('[data-climb-v29]').forEach(b=>{
     const i=Number(b.dataset.climbV29);
     b.classList.toggle('active',i===climbIndex);
     b.disabled=!climbReady;
   });
   const text=$('climbStatusV29');
   if(text)text.textContent=climbLoadError?'Erro: '+climbLoadError:
     !climbReady?'Carregando animações originais...':
     climbState.active?'Subindo · '+climbLabels[climbState.index]+' · '+Math.round(climbProgress()*100)+'%':
     'Selecionada: '+climbLabels[climbIndex]+' · aproxime-se do corpo e pressione E/M';
 }
 async function loadClimbingAnimations(){
   try{
     const b64=window.__MOUNT_CLIMB_CLIPS_GZ64;
     if(!b64)throw Error('Dados das animações de escalada não incorporados.');
     const raw=Uint8Array.from(atob(b64),b=>b.charCodeAt(0));
     let buf;
     if(typeof DecompressionStream!=='undefined'){
       buf=await new Response(new Blob([raw]).stream().pipeThrough(new DecompressionStream('gzip'))).text();
     }else if(window.__FFLATE_GUNZIP_SYNC){
       buf=new TextDecoder().decode(window.__FFLATE_GUNZIP_SYNC(raw));
     }else throw Error('Este navegador não suporta descompactar os arquivos das poses.');
     const data=JSON.parse(buf),model=game.trueFirstPerson?.model;
     if(!model||data.length!==2)throw Error('Clips de escalada ou rig indisponíveis.');
     const bones=new Map();
     model.traverse(o=>{if(o.isBone){const key=climbBoneKey(o.name);if(key&&!bones.has(key))bones.set(key,o)}});
     climbClips=data.map((d,i)=>{
       const c=T.AnimationClip.parse(d.clips[0]);
       if(c.tracks.length<45||c.duration<.15)throw Error('Escalada '+(i+1)+' inválida.');
       return c;
     });
     climbBindings=climbClips.map((clip,i)=>clip.tracks.map(track=>{
       const cut=track.name.lastIndexOf('.');
       if(cut<0||!track.name.endsWith('.quaternion'))return null;
       const bone=bones.get(climbBoneKey(track.name.slice(0,cut)));
       if(!bone)return null;
       return {bone,interpolant:track.createInterpolant(new Float32Array(4))};
     }).filter(Boolean));
     if(climbBindings.some(a=>a.length<45))throw Error('Rig da escalada incompatível com o personagem.');
     climbReady=true;
     console.info('V29: duas escaladas Mixamo carregadas no personagem:',climbClips.map((c,i)=>({seconds:c.duration,bones:climbBindings[i].length})));
   }catch(err){climbLoadError=err.message||String(err);console.error('[FLORESTA escalada]',err)}
   refreshClimbUI();
 }
 function stopClimb(){
   climbState.active=false;climbState.spider=null;climbState.start=null;
   climbState.approachBase=null;climbState.edge=null;climbState.crest=null;climbState.end=null;climbState.side=null;
   climbState.elapsed=0;climbState.duration=0;
   climbState.startingCameraQuaternion=null;climbState.eyeToCameraQuaternion=null;
 }
 // A escalada deve começar na posição do jogador, sem teletransporte.
 // O lado é medido em relação ao eixo VISUAL da aranha, não ao olhar do jogador.
 function approachDirection(spider){
   const dx=game.player.x-spider.pivot.position.x,dz=game.player.z-spider.pivot.position.z;
   const length=Math.hypot(dx,dz);
   const heading=normYaw(spider.pivot.rotation.y+(spider.root?.rotation.y||0)-Math.PI);
   const rx=length>.001?dx/length:Math.sin(heading);
   const rz=length>.001?dz/length:Math.cos(heading);
   const forward=(-rx*Math.sin(heading)-rz*Math.cos(heading));
   const right=(rx*Math.cos(heading)-rz*Math.sin(heading));
   let side;
   if(Math.abs(right)>Math.abs(forward))side=right>0?'lado direito':'lado esquerdo';
   else side=forward>0?'frente':'trás';
   return {rx,rz,distance:length,side,heading};
 }
 function beginClimb(spider,index=climbIndex){
   if(!canPlay()||!spider||spider.dead||!climbReady)return false;
   if(mounted||climbState.active)return false;
   if(!climbClips[index]||!climbBindings[index]?.length)return false;
   const approach=approachDirection(spider);
   if(climbReach(spider)>CLIMB_SURFACE_REACH){
     notify('Chegue a menos de um metro da superfície do corpo da aranha para subir.');return false;
   }
   resetMountedIdle();resetRiderArmLock();resetMountJump();collisionLast.valid=false;
   stowNonTorch();
   climbState.active=true;climbState.spider=spider;climbState.index=index;
   climbState.elapsed=0;climbState.duration=climbClips[index].duration;
   climbState.start=new T.Vector3(game.player.x,game.groundY(game.player.x,game.player.z),game.player.z);
   // Conservar o lado inicial para o botão de repetir, e evitar variação
   // de orientação caso o jogador olhe para trás durante a subida.
   spider.lastClimbStart=climbState.start.clone();
   climbState.side=approach.side;
   climbState.initialYaw=game.player.yaw;
   climbState.initialPitch=game.player.pitch;
   climbState.startingCameraQuaternion=new T.Quaternion().setFromEuler(
     new T.Euler(game.player.pitch,game.player.yaw,0,'YXZ'));
   climbState.eyeToCameraQuaternion=null;
   // O personagem encara a região da aranha onde está agarrando e, só
   // quando alcança o topo, gira para sentar no mesmo sentido da montaria.
   climbState.heading=Math.atan2(approach.rx,approach.rz);
   climbState.finalYaw=approach.heading;
   mountYaw=approach.heading;targetMountYaw=mountYaw;mountHeadYaw=0;
   // Importante: não girar a aranha ao começar a subir. Isso impedia
   // diferenciar frente, traseira, esquerda e direita na V31.
   climbState.end=new T.Vector3(spider.pivot.position.x+Math.sin(mountYaw)*SEAT_REAR_OFFSET,
     spider.pivot.position.y+mountHeight+SEAT_SCALE_Y,
     spider.pivot.position.z+Math.cos(mountYaw)*SEAT_REAR_OFFSET);
   // Inicia FORA do volume: a primeira etapa nunca atravessa o abdômen.
   // Especialmente atrás, a superfície real vai até ~3,85m do centro.
   const localStart=spiderLocalXZ(spider,climbState.start.x,climbState.start.z);
   const surface=spiderBodySurface(spider,climbState.start.x,climbState.start.z);
   const radial=Math.hypot(localStart.x,localStart.z)||1;
   const ux=localStart.x/radial,uz=localStart.z/radial;
   const boundaryRadius=Math.hypot(surface.boundary.x,surface.boundary.z);
   const contactDist=boundaryRadius+PLAYER_SOLID_RADIUS+.06; // pés/torso fora da superfície
   const edgeDist=Math.max(.9,boundaryRadius+PLAYER_SOLID_RADIUS-.025); // sobe ANTES de avançar
   const isBack=approach.side==='trás'||surface.shape.z < -1;
   const crestDist=isBack?2.18:1.15;
   const peakHeight=isBack?3.34:2.72;
   const contact=spiderWorldXZ(spider,ux*contactDist,uz*contactDist);
   const edge=spiderWorldXZ(spider,ux*edgeDist,uz*edgeDist);
   const crest=spiderWorldXZ(spider,ux*crestDist,uz*crestDist);
   climbState.approachBase=new T.Vector3(contact.x,climbState.start.y+.10,contact.z);
   climbState.edge=new T.Vector3(edge.x,spider.pivot.position.y+peakHeight,edge.z);
   climbState.crest=new T.Vector3(crest.x,spider.pivot.position.y+peakHeight+.04,crest.z);
   game.player.speed=0;game.keys.clear?.();
   if(game.stick){game.stick.x=0;game.stick.y=0}
   refresh();refreshClimbUI();
   notify('Escalada 2 · subindo pela '+approach.side+'!');
   return true;
 }
 function finishClimb(){
   if(!climbState.active)return;
   const spider=climbState.spider;
   stopClimb();
   if(!spider||spider.dead)return;
   // O olhar inicial coincide com a orientação do assento no fim da escalada.
   game.player.yaw=climbState.finalYaw||mountYaw;
   // Montaria estável da V28/V31 preservada depois de sentar.
   activateMountedSpider(spider);
   notify('Subida concluída · sentado na aranha!');
   refreshClimbUI();
 }
 function climbReplay(index=1){
   index=1;climbIndex=1;refreshClimbUI();
   if(!climbReady){notify('Escalada ainda carregando.');return}
   if(!canPlay()){notify('Entre no Criativo primeiro.');return}
   const spider=climbState.spider||mounted||nearest();
   if(!spider){notify('Chegue perto do corpo da aranha para testar.');return}
   // Repetir a escalada montado: voltar ao MESMO lado onde ela começou.
   const replayStart=spider.lastClimbStart?.clone();
   const wasMounted=mounted===spider;
   if(mounted)dismount(true);
   if(climbState.active){
     if(climbState.start){game.player.x=climbState.start.x;game.player.z=climbState.start.z;}
     stopClimb();
   }else if(wasMounted&&replayStart){
     game.player.x=replayStart.x;game.player.z=replayStart.z;
   }
   beginClimb(spider,index);
 }
 function applyClimbingAvatar(elapsed,dt,groundedY,onGround,fallSpeed,nativeUpdate){
   const s=climbState,spider=s.spider;
   if(!s.active||!spider)return nativeUpdate(elapsed,false,dt,groundedY,onGround,fallSpeed);
   const step=clamp(Number(dt)||0,0,.055);
   nativeUpdate(elapsed,false,0,groundedY,onGround,fallSpeed);
   const tfp=game.trueFirstPerson;
   if(!tfp?.visibleRoot)return;
   s.elapsed=Math.min(s.duration,s.elapsed+step);
   const t=climbProgress(),clip=climbClips[s.index],time=Math.min(Math.max(0,clip.duration-.00001),s.elapsed);
   // V33: primeiro chega até a superfície do corpo, depois sobe a borda,
   // passa POR CIMA do abdômen e só então senta. Nunca corta por dentro.
   let from,to,u;
   if(t<.13){from=s.start;to=s.approachBase;u=climbSmooth(t/.13);}
   else if(t<.54){from=s.approachBase;to=s.edge;u=climbSmooth((t-.13)/.41);}
   else if(t<.76){from=s.edge;to=s.crest;u=climbSmooth((t-.54)/.22);}
   else {from=s.crest;to=s.end;u=climbSmooth((t-.76)/.24);}
   tfp.visibleRoot.position.copy(from).lerp(to,u);
   tfp.visibleRoot.position.y+=Math.sin(Math.PI*t)*.025;
   // Na escalada olha para a região da aranha onde está agarrando;
   // ao chegar ao topo gira para o sentido em que ficará sentado.
   let bodyYaw=normYaw(s.initialYaw+normYaw(s.heading-s.initialYaw)*climbSmooth(t/.20));
   if(t>.74)bodyYaw=normYaw(bodyYaw+normYaw(s.finalYaw-bodyYaw)*climbSmooth((t-.74)/.26));
   tfp.visibleRoot.rotation.set(0,bodyYaw,0,'YXZ');
   for(const binding of climbBindings[s.index]){
     const v=binding.interpolant.evaluate(time);
     climbScratchQ.set(v[0],v[1],v[2],v[3]).normalize();
     binding.bone.quaternion.copy(climbScratchQ);
   }
   // Cabeça REAL segue o olhar pelo mouse, com limites anatômicos; a animação
   // continua sendo a base, incluindo movimentos do pescoço e da coluna.
   const lookYaw=clamp(Math.atan2(Math.sin(game.player.yaw-s.initialYaw),
     Math.cos(game.player.yaw-s.initialYaw)),-Math.PI*50/180,Math.PI*50/180);
   const lookPitch=clamp(game.player.pitch-s.initialPitch,-.70,.70);
   const head=tfp.bones?.head;
   if(head){
     climbMouseHeadQ.setFromEuler(new T.Euler(lookPitch*.70,lookYaw*.70,0,'YXZ'));
     head.quaternion.multiply(climbMouseHeadQ).normalize();
   }
   tfp.visibleRoot.updateMatrixWorld(true);
   followEquippedTorch();
   const eyes=tfp.eyeSocket;
   if(eyes){
     // Uma pose FBX pode começar com o eixo local dos olhos diferente da
     // câmera anterior. Calibrar UMA VEZ evita um giro repentino no início.
     eyes.getWorldQuaternion(climbEyeQ);
     if(!s.eyeToCameraQuaternion){
       s.eyeToCameraQuaternion=climbEyeQ.clone().invert().multiply(
         s.startingCameraQuaternion||game.camera.quaternion).normalize();
     }
     // A orientação completa, inclusive olhar para cima/baixo e inclinação,
     // deriva do osso da cabeça — não mais da rotação solta do mouse.
     game.camera.quaternion.copy(climbEyeQ).multiply(s.eyeToCameraQuaternion);
     eyes.getWorldPosition(climbEye);
     // Mantém os olhos à frente da superfície do rosto, evitando enxergar
     // por dentro do pescoço. Offset horizontal acompanha a direção da cabeça.
     climbForward.copy(climbForwardAxis).applyQuaternion(game.camera.quaternion);
     climbForward.y=0;
     if(climbForward.lengthSq()<.0001){
       climbForward.set(-Math.sin(game.player.yaw),0,-Math.cos(game.player.yaw));
     }else climbForward.normalize();
     climbEye.addScaledVector(climbForward,.31);
     climbEye.y+=.075;
     game.camera.position.copy(climbEye);
     game.camera.updateMatrixWorld(true);
     if(tfp.state)tfp.state.eyeError=game.camera.position.distanceTo(climbEye);
   }
   if(t>=1)finishClimb();
   else if(Math.floor(s.elapsed*5)!==Math.floor((s.elapsed-step)*5))refreshClimbUI();
 }

 const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
 // Direção da montaria e rotação limitada do pescoço; nunca permitir cabeça girar 180º.
 const normYaw=x=>Math.atan2(Math.sin(x),Math.cos(x));
 const MAX_HEAD_YAW=Math.PI*50/180, TURN_RATE=4.9;
 const nativeKeyHas=game.keys.has.bind(game.keys);
 const rawDown=code=>nativeKeyHas(code);
 const keyDown=(a,b)=>rawDown(a)||(b?rawDown(b):false);
 // MONTARIA V13: A/D = deslocamento lateral original; mouse = direção da aranha.
 // Não substituímos as teclas por W nem giramos a câmera com A/D.
 let mountYaw=game.player.yaw, targetMountYaw=mountYaw;
 let mountHeadYaw=0, appliedPoseBones=0;
 // V20: sem máscaras 2D nem alterações na malha da aranha.
 // Fechamento real do pescoço do avatar e acompanhamento do assento
 // pela deformação original do FBX durante o ataque.
 const torsoScratchA=new T.Vector3(),torsoScratchB=new T.Vector3(),torsoScratchC=new T.Vector3(),torsoScratchD=new T.Vector3();
 const torsoAxis=new T.Vector3(0,1,0),torsoRotation=new T.Quaternion();
 const torsoFollow={bone:null,anchor:null,origin:null,active:false,
                   dx:0,dy:0,dz:0,lean:0};
 let neckSeal=null;
 function riderNeck(){ const tfp=game.trueFirstPerson; return tfp?.bones?.neck||null; }
 function createNeckSeal(){}
 function placeNeckSeal(){}
 // V23: o assento fica fisicamente preso a um PONTO REAL do dorso.
 // Um único update (animação da aranha -> assento -> avatar -> câmera)
 // elimina o descompasso que provocava tremores em versões anteriores.
 const seatSampleWorld=new T.Vector3(),seatSampleLocal=new T.Vector3(),seatRest=new T.Vector3();
 const seatRestQuat=new T.Quaternion(),seatCurrentQuat=new T.Quaternion();
 const seatPivotQuat=new T.Quaternion(),seatDeltaQuat=new T.Quaternion();
 const seatAxisY=new T.Vector3(0,1,0),seatTiltUp=new T.Vector3();
 const followScratch=new T.Vector3();
 function stopSeatFollow(){
   if(torsoFollow.marker)torsoFollow.marker.removeFromParent();
   Object.assign(torsoFollow,{bone:null,marker:null,origin:null,restQuat:null,active:false,
                              dx:0,dy:0,dz:0,lean:0,tiltX:0,tiltZ:0});
 }
 function startSeatFollow(spider){
   stopSeatFollow();
   if(!spider)return;
   let bone=null;
   spider.root.traverse(obj=>{
     if(!bone&&obj.isBone&&/bone[ _-]*tail|abdomen/i.test(obj.name))bone=obj;
   });
   if(!bone)return;
   // A pose de referência é a posição ATUAL, em cima do dorso da aranha.
   // Na pose anterior seguíamos só a origem do osso, e não a superfície
   // onde o jogador efetivamente está sentado.
   spider.pivot.updateMatrixWorld(true);
   const initialWorld=spider.pivot.localToWorld(new T.Vector3(0,mountHeight+SEAT_SCALE_Y,-SEAT_REAR_OFFSET));
   const anchor=new T.Object3D();
   anchor.name='V23_Seat_Contact_Point';
   anchor.position.copy(bone.worldToLocal(initialWorld.clone()));
   bone.add(anchor);
   spider.pivot.updateMatrixWorld(true);
   anchor.getWorldPosition(seatSampleWorld);
   spider.pivot.worldToLocal(seatSampleWorld);
   seatRest.copy(seatSampleWorld);
   bone.getWorldQuaternion(seatCurrentQuat);
   spider.pivot.getWorldQuaternion(seatPivotQuat);
   seatRestQuat.copy(seatPivotQuat).invert().multiply(seatCurrentQuat).normalize();
   Object.assign(torsoFollow,{bone,marker:anchor,origin:seatRest.clone(),
     restQuat:seatRestQuat.clone(),active:true,dx:0,dy:0,dz:0,lean:0,tiltX:0,tiltZ:0});
 }
 function updateSeatFollow(dt){
   const sf=torsoFollow;
   if(!mounted||!sf.active||!sf.marker)return sf;
   // Esta função roda imediatamente APÓS o mixer da aranha, no MESMO
   // frame de desenho. Isso evita seguir um quadro antigo do FBX.
   mounted.pivot.updateMatrixWorld(true);
   sf.marker.getWorldPosition(seatSampleWorld);
   mounted.pivot.worldToLocal(seatSampleWorld);
   seatSampleLocal.subVectors(seatSampleWorld,sf.origin);
   const step=clamp(dt||1/60,.001,.055);
   // V25: O idle do FBX mexe continuamente no Bone_Tail mesmo com o
   // jogador imóvel. Na V24 isso passava por todo o torso, braço e tocha.
   // Em repouso o assento permanece firme. Ataque recebe 100% do movimento
   // aprovado na V23; locomoção recebe um acompanhamento leve e contínuo.
   const attacking=mounted.playing==='attack'&&mounted.animationTimer>0;
   const locomoting=mounted.playing==='walk';
   const followAmount=attacking ? 1 : (locomoting ? 0.32 : 0);
   const k=1-Math.exp(-step*(attacking?19:locomoting?12:16));
   const px=clamp(seatSampleLocal.x,-.80,.80)*followAmount;
   const py=clamp(seatSampleLocal.y,-.16,1.55)*followAmount;
   const pz=clamp(seatSampleLocal.z,-1.10,1.10)*followAmount;
   sf.dx+=(px-sf.dx)*k;
   sf.dy+=(py-sf.dy)*k;
   sf.dz+=(pz-sf.dz)*k;
   sf.bone.getWorldQuaternion(seatCurrentQuat);
   mounted.pivot.getWorldQuaternion(seatPivotQuat);
   seatCurrentQuat.premultiply(seatPivotQuat.invert()).normalize();
   seatDeltaQuat.copy(seatCurrentQuat).multiply(sf.restQuat.clone().invert()).normalize();
   seatTiltUp.copy(seatAxisY).applyQuaternion(seatDeltaQuat);
   const pitch=clamp(Math.atan2(-seatTiltUp.z,Math.max(.3,seatTiltUp.y)),-.38,.38)*followAmount;
   const roll=clamp(Math.atan2(seatTiltUp.x,Math.max(.3,seatTiltUp.y)),-.24,.24)*followAmount;
   sf.tiltX+=(pitch-sf.tiltX)*k;
   sf.tiltZ+=(roll-sf.tiltZ)*k;
   // Sem microoscilação eterna em repouso (ruído do mixer FBX).
   if(followAmount===0){
     for(const key of ['dx','dy','dz','tiltX','tiltZ']){
       if(Math.abs(sf[key])<.0005)sf[key]=0;
     }
   }
   sf.lean=sf.tiltX;
   return sf;
 }

 const forwardHeld=()=>keyDown('KeyW','ArrowUp');
 const reverseHeld=()=>keyDown('KeyS','ArrowDown');
 function driveMount(dt){
   if(!mounted)return;
   // O movimento A/D volta ao motor NATIVO (strafe).
   // A orientação da montaria depende apenas do mouse/touch que muda player.yaw.
   const lookDelta=normYaw(game.player.yaw-mountYaw);
   const deadzone=Math.PI*8/180;
   if(Math.abs(lookDelta)>deadzone){
     targetMountYaw=normYaw(game.player.yaw-Math.sign(lookDelta)*deadzone);
   }else{
     targetMountYaw=mountYaw;
   }
   const step=clamp(normYaw(targetMountYaw-mountYaw),-TURN_RATE*dt,TURN_RATE*dt);
   mountYaw=normYaw(mountYaw+step);
   mountHeadYaw=clamp(normYaw(game.player.yaw-mountYaw),-MAX_HEAD_YAW,MAX_HEAD_YAW);
   game.player.yaw=normYaw(mountYaw+mountHeadYaw);
   game.player.pitch=clamp(game.player.pitch,-1.21,1.38);
   game.player.bodyYaw=mountYaw;
   mounted.pivot.rotation.y=normYaw(mountYaw+Math.PI);
 }
 const seatLabels=['POSE 1 · Male Sitting','POSE 2 · Male Sitting (1)','POSE 3 · Male Sitting (2)','POSE 4 · Sitting','POSE 5 · Sitting Idle'];
 function mountPoseInfo(){const s=$('seatStatusV4');if(!s)return;s.textContent=seatLoadError?'Erro: '+seatLoadError:seatClips.length?'POSE '+(seatIndex+1)+' · '+seatNames[seatIndex]+' · '+boundSeatBones+' canais disponíveis' + (mounted?' · pernas: '+appliedPoseBones:''):'Lendo animações Mixamo...';}
 async function ungzipSeatFile(){
  const raw=atob(window.__MOUNT_SEAT_CLIPS_GZ64||'');if(!raw)throw new Error('Dados das poses não incorporados');
  const bytes=Uint8Array.from(raw,x=>x.charCodeAt(0));
  if(typeof DecompressionStream!=='undefined'){
    const ds=new DecompressionStream('gzip');return JSON.parse(await new Response(new Blob([bytes]).stream().pipeThrough(ds)).text());
  }
  if(window.__FFLATE_GUNZIP_SYNC){return JSON.parse(new TextDecoder().decode(window.__FFLATE_GUNZIP_SYNC(bytes)))}
  throw new Error('Navegador não suporta descompactação gzip');
 }
 async function prepareSeatAnimations(){
  if(seatLoading)return;seatLoading=true;
  try{
    const data=await ungzipSeatFile();const tfp=game.trueFirstPerson;
    if(!tfp?.model||!tfp?.visibleRoot)throw new Error('Personagem V174 indisponível');
    if(!Array.isArray(data)||data.length!==5)throw new Error('Pacote de poses inválido');
    // O personagem real do V174 pode usar 'mixamorig:Hips' enquanto os FBX
    // enviados usam 'mixamorigHips'. Sem retarget, os cliques mudam o painel,
    // mas os ossos continuam na animação de andar do jogo.
    const keyOf=name=>String(name||'').toLowerCase().replace(/mixamorig[:_]?/g,'').replace(/[^a-z0-9]/g,'');
    const realBones=new Map();
    tfp.model.traverse(obj=>{if(obj.isBone){const key=keyOf(obj.name);if(key&&!realBones.has(key))realBones.set(key,obj)}});
    if(realBones.size<45)throw new Error('Rig original incompleto: '+realBones.size+' ossos.');
    seatMixer=new T.AnimationMixer(tfp.model);
    const counts=[];
    seatClips=data.map((json,i)=>{
      const source=T.AnimationClip.parse(json);
      const mapped=[];
      for(const track of source.tracks){
        const dot=track.name.lastIndexOf('.');if(dot<0)continue;
        const bone=realBones.get(keyOf(track.name.slice(0,dot)));
        if(!bone)continue;
        const t=track.clone();t.name=bone.name+track.name.slice(dot);
        mapped.push(t);
      }
      counts.push(mapped.length);
      if(mapped.length<40)throw new Error('Pose '+(i+1)+': só '+mapped.length+' / '+source.tracks.length+' canais associados.');
      return new T.AnimationClip('MONTARIA_POSE_'+(i+1),Math.max(.034,source.duration),mapped);
    });
    boundSeatBones=Math.min(...counts);
    // Mascaramento por região: as animações de sentar controlam SÓ a bacia e as pernas.
    // Os ombros, braços, mãos e dedos ficam sob controle da rotina ORIGINAL
    // __updateAnimatedAvatar (incluindo a tocha da mão esquerda).
    const lowerBody=/^(hips|leftupleg|leftleg|leftfoot|lefttoebase|rightupleg|rightleg|rightfoot|righttoebase)$/;
    poseBindings=seatClips.map(clip=>clip.tracks.map(track=>{
      const key=keyOf(track.name.slice(0,track.name.lastIndexOf('.')));
      const bone=realBones.get(key);
      return bone&&lowerBody.test(key)?{bone,key,interpolant:track.createInterpolant(new Float32Array(4))}:null;
    }).filter(Boolean));

    console.info('[Floresta V5] Poses vinculadas ao personagem V174',counts);
    seatActions=seatClips.map((clip,i)=>{
      const action=seatMixer.clipAction(clip,tfp.model);
      action.enabled=true;action.clampWhenFinished=true;
      action.setLoop(T.LoopRepeat,Infinity);
      return action;
    });
    for(const b of document.querySelectorAll('[data-seat-v4]'))b.disabled=false;
    chooseSeatPose(seatIndex,true);
  }catch(err){seatLoadError=err.message||String(err);console.error('[Floresta poses]',err)}
  mountPoseInfo();
 }
 function chooseSeatPose(index,silent=false){
  if(!Number.isInteger(index)||index<0||index>4)return;
  seatIndex=index;seatTime=0;
  document.querySelectorAll('[data-seat-v4]').forEach(b=>b.classList.toggle('active',Number(b.dataset.seatV4)===index));
  mountPoseInfo();if(!silent)notify(seatLabels[index]+' · animação exclusiva de montaria');
 }
 // Aplica diretamente as rotações originais FBX, sem misturar com caminhada,
 // rolamento, ataque ou IK das ferramentas do personagem a pé.
 const tmpPoseQ=new T.Quaternion(),lookPoseQ=new T.Quaternion();
 function applyMountedPose(dt){
   const tfp=game.trueFirstPerson,clip=seatClips[seatIndex],bindings=poseBindings[seatIndex];
   if(!tfp||!clip||!bindings?.length)return false;
   const duration=Math.max(.034,clip.duration);
   seatTime+=clamp(dt||0,0,.055);
   const time=seatIndex===3?Math.min(duration-.0002,seatTime):seatIndex<=2?0:seatTime%duration;
   for(const item of bindings){
     const raw=item.interpolant.evaluate(time);
     tmpPoseQ.set(raw[0],raw[1],raw[2],raw[3]).normalize();
     item.bone.quaternion.copy(tmpPoseQ);
   }
   appliedPoseBones=bindings.length;
   // O corpo superior mantém o controle natural do Floresta, sem a pose FBX
   // forçar os braços à frente do rosto. Cabeça e pescoço seguem o olhar limitado.
   const bones=tfp.bones;
   // A inclinação da montaria é aplicada à raiz do avatar, não apenas à
   // coluna: quadril, pernas, braços e tocha movem-se como um único cavaleiro.
   if(bones?.neck){lookPoseQ.setFromEuler(new T.Euler(clamp(game.player.pitch,-.9,.95)*.13,mountHeadYaw*.27,0,'XYZ'));bones.neck.quaternion.multiply(lookPoseQ)}
   if(bones?.head){lookPoseQ.setFromEuler(new T.Euler(clamp(game.player.pitch,-.9,.95)*.23,mountHeadYaw*.42,0,'XYZ'));bones.head.quaternion.multiply(lookPoseQ)}
   return true;
 }
 const leftHandWorld=new T.Vector3(),torchOffset=new T.Vector3(0,.039,0),torchYaw=new T.Quaternion(),yAxis=new T.Vector3(0,1,0);
 function followEquippedTorch(){
   // Reaplica o vínculo da tocha DEPOIS de deslocar o personagem para o assento.
   // A rotina normal de equipamento continua decidindo se a tocha está equipada.
   const torch=game.torchRoot,socket=game.trueFirstPerson?.socket;
   if(!torch||!socket||typeof game.isEquipped!=='function')return;
   const equipped=!!game.isEquipped();
   torch.visible=equipped;
   if(!equipped)return;
   socket.getWorldPosition(leftHandWorld);
   torchYaw.setFromAxisAngle(yAxis,game.player.bodyYaw);
   torch.position.copy(leftHandWorld).sub(torchOffset.clone().applyQuaternion(torchYaw));
   torch.quaternion.copy(torchYaw);
 }

 // Primeira pessoa original: o corpo sentando aparece ao olhar para baixo.
 // Não mover a câmera para trás, nem ocultar o corpo para mostrar a montaria.
 function setSeatCamera(){seatCameraThird=false;}

 const style=document.createElement('style');style.id='nativeMountStylesV3';style.textContent=`
 #nativeMountV3{position:fixed;z-index:180;left:16px;top:160px;width:min(272px,calc(100vw - 32px));padding:12px;border:1px solid #b9a179a6;border-radius:10px;color:#f7e3c2;background:#101514dc;box-shadow:0 12px 30px #0008;font:500 12px/1.45 system-ui;display:none}
 #nativeMountV3.show{display:block}#nativeMountV3 header{font-weight:800;letter-spacing:.1em;color:#ead0a5;font-size:12px;margin-bottom:5px}
 #nativeMountV3 p{margin:4px 0 7px;font-size:11px;color:#dbd0be}
 #nativeMountV3 .mountButtons{display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:6px}
 #nativeMountV3 button,#mountTouchV3 button{background:#2f352f;border:1px solid #b5a16f;color:#fff0d8;border-radius:6px;padding:9px 7px;min-height:36px;font-weight:750;cursor:pointer}
 #nativeMountV3 button:active,#mountTouchV3 button:active{background:#72603e}
 #nativeMountV3 .tiny{font-size:10px;opacity:.85}
 #mountTouchV3{display:none;position:fixed;right:10px;bottom:185px;z-index:182;gap:7px;flex-direction:column}
 #mountTouchV3 button{min-width:66px;min-height:53px;font-size:12px;background:#151912dc}
 #mountToastV3{position:fixed;z-index:190;left:50%;bottom:22%;transform:translateX(-50%);background:#141a16e8;border:1px solid #a88a55;color:#f8e3b9;padding:9px 14px;font:700 12px system-ui;border-radius:8px;opacity:0;pointer-events:none;transition:opacity .16s;max-width:90vw;text-align:center}
 #mountToastV3.show{opacity:1}
 .mountLabelV3{position:fixed;z-index:160;pointer-events:none;color:#f1d9ae;text-align:center;font:700 12px system-ui;text-shadow:0 2px 5px black}
 @media(pointer:coarse){#nativeMountV3{display:none!important}#nativeMountV3 header{font-size:10px}#nativeMountV3 p,#nativeMountV3 .tiny{display:none}#nativeMountV3 button{font-size:11px;padding:8px 4px}#mountTouchV3{display:flex}}
 body:not(.v112-test-mode) #nativeMountV3,body:not(.v112-test-mode) #mountTouchV3{display:none!important}
 #nativeClimbTestV29{margin:10px 0 12px;padding-top:12px;border-top:1px solid #a9946a70}
 #nativeClimbTestV29 h4{font:800 10px/1.3 system-ui;letter-spacing:.9px;color:#edc889;margin:0 0 8px}
 #nativeClimbTestV29 .seatGridV4{display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #nativeClimbTestV29 button.active{background:#66502e;border-color:#ffd38e;box-shadow:inset 0 0 0 1px #b99356}
 #nativeClimbTestV29 button:disabled{opacity:.5}
 #climbStatusV29{font-size:10px;margin:8px 0 3px;color:#decba5;line-height:1.5}
 #nativeSeatTestV4{margin-top:11px;padding-top:9px;border-top:1px solid #a9946a70}
 #nativeSeatTestV4 h4{font:800 10px/1.3 system-ui;letter-spacing:1px;color:#edc889;margin:0 0 8px}
 #nativeSeatTestV4 .seatGridV4{display:grid;grid-template-columns:1fr 1fr;gap:5px}
 #nativeSeatTestV4 .seatGridV4 button{min-height:39px;font:650 10px/1.3 system-ui;padding:5px;background:#273029;color:#eee0c7;text-align:center}
 #nativeSeatTestV4 .seatGridV4 button.active{background:#66502e;border-color:#ffd38e;color:#fff4d9;box-shadow:inset 0 0 0 1px #b99356}
 #nativeSeatTestV4 p.seatStatusV4{font-size:10px;margin:7px 0;color:#decba5;min-height:14px}
 #nativeSeatTestV4 .seatRangeV4{display:flex;align-items:center;flex-wrap:wrap;gap:5px;font-size:10px;letter-spacing:.2px}
 #nativeSeatTestV4 .seatRangeV4 input{flex:1;min-width:100px;accent-color:#e3c18c}
 #nativeSeatTestV4 .seatCameraV4{width:100%;margin:7px 0 0}
 body.spider-torch-only-v10 #u173Hotbar [data-item]:not([data-item="torch"]){opacity:.34;filter:grayscale(1);pointer-events:none}
 body.spider-torch-only-v10 #u173Hotbar [data-item="torch"]{outline:1px solid #e4bf78;outline-offset:2px}
 #nativeMountV3{max-height:calc(100dvh - 173px);overflow-y:auto;scrollbar-width:thin}
 @media(pointer:coarse){#mountTouchJumpV26{background:#4b3524;border-color:#e7bd79}#mountTouchV3 button{min-width:65px;min-height:43px}#nativeMountV3.show.seat-mobile-open{display:block!important;z-index:205!important;left:10px;top:90px;max-height:calc(100dvh - 110px);width:min(310px,calc(100vw - 20px))}#nativeMountV3.show.seat-mobile-open .tiny{display:block}#nativeMountV3.show.seat-mobile-open header{font-size:12px}#nativeMountV3.show.seat-mobile-open p,#nativeMountV3.show.seat-mobile-open .tiny{display:block}#mountTouchV3{bottom:130px}}

 #spiderCargoV35{margin-top:11px;padding-top:10px;border-top:1px solid #9f875c88}
 #spiderCargoV35 h4{font:800 10px system-ui;color:#f0cd97;letter-spacing:1px;margin:0 0 7px}
 #spiderCargoV35 .cargoGridV35{display:grid;grid-template-columns:1fr 1fr;gap:6px}
 #spiderCargoV35 button{padding:9px 5px;font:700 10px/1.3 system-ui;min-height:38px}
 #spiderCargoV35 p{font:10px/1.5 system-ui;color:#dac9a8;margin:7px 0}
 #cargoStatusV35{font-weight:600;color:#ffe0ab!important}
 @media(pointer:coarse){#mountTouchCargoV35{background:#58422c;border-color:#e7bd79}}
 `;document.head.appendChild(style);
 const panel=document.createElement('section');panel.id='nativeMountV3';panel.innerHTML=`<header>MONTARIA · ARANHA-GIGANTE · POSES</header><p id="mountStateV3">Aproxime-se da aranha e pressione E ou M.</p><div class="mountButtons"><button id="mountSpawnV3">+ ARANHA</button><button id="mountToggleV3">MONTAR · E</button><button id="mountAttackV3">ATACAR</button><button id="mountJumpV26">PULAR · ESPAÇO</button><button id="mountRotateV3">INVERTER ↻</button></div><div class="tiny">Criativo V174 · 1ª pessoa · E/M montar/descer · F6 alternar pose. Montado: W avança, S dá ré, A/D andam de lado, ESPAÇO pula; só o mouse vira a aranha. A cabeça mantém limite de 50°.</div><section id="nativeClimbTestV29"><h4>SUBIR NA ARANHA · ESCALADA 2 DEFINITIVA</h4><div class="seatGridV4"><button type="button" data-climb-v29="1" disabled>REPETIR ESCALADA 2</button></div><p id="climbStatusV29">Preparando a escalada escolhida...</p><p style="font-size:10px">Suba pela frente, por trás ou pelos lados. É preciso estar perto da superfície do corpo; a aranha bloqueia a passagem. Use o botão acima para repetir.</p></section><section id="nativeSeatTestV4"><h4>PERNAS SENTADAS · TESTE 1–5</h4><div class="seatGridV4" id="seatButtonsV4"></div><p class="seatStatusV4" id="seatStatusV4">Preparando 5 animações reais do personagem...</p><label class="seatRangeV4">Altura do assento <strong id="seatHeightTextV4">1,41</strong><input id="seatHeightV4" type="range" min="0.60" max="2.30" step="0.03" value="1.41"></label><p class="seatCameraV4" style="color:#ead2a9;font-size:10px;margin-top:9px">1ª PESSOA · montado: somente TOCHA (atalho 6); outros itens liberados ao descer.</p></section><section id="spiderCargoV35"><h4>MADEIRA ORIGINAL DO FLORESTA · TRANSPORTE</h4><div class="cargoGridV35"><button type="button" id="cargoSpawnLogsV35">+ TRONCO</button><button type="button" id="cargoSpawnPlanksV35">+ TÁBUAS</button><button type="button" id="cargoSpawnBlockV35">+ BLOCO</button><button type="button" id="cargoPickupV35">PEGAR / LARGAR · J</button><button type="button" id="cargoLoadV35">COLOCAR NA ARANHA · U</button><button type="button" id="cargoUnloadV35">RETIRAR CARGA · K</button></div><p id="cargoStatusV35">Preparando madeira...</p><p>Pegue troncos com Q e tábuas com G. Na traseira da aranha, U ou COLOCAR NA ARANHA transfere uma peça real por vez. K ou RETIRAR CARGA devolve a peça ao ombro. Até 15 tábuas ou 6 troncos, 15 peças no total. U coloca uma peça de cada vez. K retira para o ombro quando houver espaço; caso contrário, descarrega no chão. A carga acompanha caminhada, pulo e ataque.</p></section>`;document.body.appendChild(panel);
 const touch=document.createElement('div');touch.id='mountTouchV3';touch.innerHTML='<button id="mountTouchToggleV3">MONTAR</button><button id="mountTouchJumpV26">PULAR</button><button id="mountTouchAttackV3">ATAQUE</button><button id="mountTouchPoseV4">POSES</button><button id="mountTouchSpawnV3">+ ARANHA</button><button id="mountTouchCargoV35">CARGA</button>';document.body.appendChild(touch);
 const toast=document.createElement('div');toast.id='mountToastV3';document.body.appendChild(toast);
 $('seatButtonsV4').innerHTML=seatLabels.map((label,i)=>`<button type="button" data-seat-v4="${i}" disabled>${label}</button>`).join('');
 $('seatButtonsV4').addEventListener('click',ev=>{const b=ev.target.closest('[data-seat-v4]');if(b)chooseSeatPose(Number(b.dataset.seatV4))});
 $('nativeClimbTestV29').addEventListener('click',ev=>{const btn=ev.target.closest('[data-climb-v29]');if(btn)climbReplay(Number(btn.dataset.climbV29))});
 $('seatHeightV4').addEventListener('input',ev=>{mountHeight=clamp(Number(ev.target.value)||1.41,.60,2.30);$('seatHeightTextV4').textContent=mountHeight.toFixed(2).replace('.',',');if(mounted)startSeatFollow(mounted);});

 $('mountTouchPoseV4').onclick=()=>{panel.classList.toggle('seat-mobile-open');};
 $('mountTouchCargoV35').onclick=()=>{panel.classList.toggle('seat-mobile-open');$('spiderCargoV35').scrollIntoView({block:'nearest',behavior:'smooth'});};
 $('cargoSpawnLogsV35').onclick=()=>spawnCargo('log');
 $('cargoSpawnPlanksV35').onclick=()=>{spawnCargo('plank');spawnCargo('plank')};
 $('cargoSpawnBlockV35').onclick=()=>spawnCargo('block');
 $('cargoPickupV35').onclick=pickCargo;
 $('cargoLoadV35').onclick=loadCargo;
 $('cargoUnloadV35').onclick=unloadCargo;
 setSeatCamera();mountPoseInfo();
 prepareSeatAnimations();loadClimbingAnimations();
 const dataUri='data:image/png;base64,'+window.__CREATIVE_SPIDER_TEXTURE_V3;
 try{
   const file=window.__CREATIVE_SPIDER_MODEL_V3;
   if(!file)throw Error('Modelo 3D não incorporado');
   const buffer=Uint8Array.from(atob(file),x=>x.charCodeAt(0)).buffer;
   const manager=new T.LoadingManager();manager.setURLModifier(url=>/recluse|spider|png|jpg|jpeg/i.test(url)?dataUri:url);
   const source=new FBXLoader(manager).parse(buffer,'');
   const bounds=new T.Box3().setFromObject(source);const dims=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());
   if(dims.length()<0.0001)throw Error('FBX sem geometria');
   // V27: +~25% altura, largura e comprimento da aranha inteira.
   const sx=9.70/Math.max(.01,dims.x), sy=3.45/Math.max(.01,dims.y), sz=8.65/Math.max(.01,dims.z);
   mountHeight=1.41; // altura inicial do assento fixada sobre o dorso; regulável no painel
   baseModel=new T.Group();baseModel.scale.set(sx,sy,sz);source.position.sub(new T.Vector3(center.x,bounds.min.y,center.z));baseModel.add(source);
   const texture=new T.TextureLoader().load(dataUri);texture.colorSpace=T.SRGBColorSpace;texture.flipY=true;
   source.traverse(mesh=>{if(!mesh.isMesh)return;mesh.castShadow=true;mesh.receiveShadow=true;mesh.frustumCulled=false;const mats=Array.isArray(mesh.material)?mesh.material:[mesh.material];for(const mat of mats){if(!mat)continue;mat.map=texture;mat.color?.setRGB?.(1,1,1);mat.roughness=.94;mat.metalness=0;mat.side=T.DoubleSide;mat.needsUpdate=true}});
   for(const clip of source.animations||[]){const n=clip.name.toLowerCase(),kind=n.includes('attack')?'attack':n.includes('gothit')||n.includes('got_hit')||n.includes('hit')?'hit':n.includes('death')?'death':n.includes('walk')?'walk':n.includes('idle')?'idle':null;if(kind)clips[kind]=clip}
   if(!clips.walk||!clips.idle||!clips.attack)throw Error('FBX sem animações obrigatórias');
 }catch(e){setupError=e.message;notify('Erro no modelo da aranha: '+setupError);console.error(e);return}
 function meshIndex(root,index){let i=0,found;root.traverse(n=>{if(n.isSkinnedMesh){if(i===index)found=n;i++}});return found}
 function animatedClone(){
   const root=baseModel.clone(true),orig=[],copies=[];
   baseModel.traverse(x=>{if(x.isBone)orig.push(x)});root.traverse(x=>{if(x.isBone)copies.push(x)});
   if(orig.length===copies.length){const bones=new Map(orig.map((b,i)=>[b,copies[i]]));let n=0;baseModel.traverse(src=>{if(!src.isSkinnedMesh)return;const clone=meshIndex(root,n++);if(clone?.isSkinnedMesh&&src.skeleton){clone.bind(new T.Skeleton(src.skeleton.bones.map(b=>bones.get(b)||b),src.skeleton.boneInverses.map(m=>m.clone())),src.bindMatrix.clone())}})}
   return root;
 }
 function animate(spider,key){if(spider.dead&&key!=='death')return;const next=spider.actions[key];if(!next)return;if(spider.playing===key&&next.isRunning())return;const prev=spider.actions[spider.playing];next.reset().setEffectiveWeight(1).setEffectiveTimeScale(animationScale);if(prev&&prev!==next){next.play();prev.crossFadeTo(next,.18,true)}else next.play();spider.playing=key}
 // V18 — camera segura SEM alterar a aranha: nenhuma parte invisivel, material
 // modificado ou osso congelado. A camera dos olhos se eleva somente se o
 // abdomen animado ocupar o volume onde estao os olhos durante o golpe.
 // A malha FBX e o mixer permanecem integralmente originais em TODOS os ataques.
 let riderViewLift=0,lastRiderViewTime=performance.now();
 let riderTailSamples=[];
 const safeVertex=new T.Vector3();
 function findRiderTailVertices(spider){
   riderTailSamples=[];
   if(!spider)return;
   spider.root.traverse(mesh=>{
     if(!mesh.isSkinnedMesh||!mesh.skeleton||!mesh.geometry)return;
     if(typeof mesh.getVertexPosition!=='function')return;
     const g=mesh.geometry,skinI=g.getAttribute('skinIndex'),skinW=g.getAttribute('skinWeight');
     if(!skinI||!skinW)return;
     const tailIds=new Set();
     mesh.skeleton.bones.forEach((b,i)=>{
       if(/bone[ _-]*tail|abdomen/i.test(b.name))tailIds.add(i);
     });
     if(!tailIds.size)return;
     const indices=[];
     for(let i=0;i<skinI.count;i++){
       let tailWeight=0;
       for(let j=0;j<4;j++)if(tailIds.has(Math.round(skinI.getComponent(i,j))))tailWeight+=skinW.getComponent(i,j);
       if(tailWeight>.23)indices.push(i);
     }
     if(indices.length)riderTailSamples.push({mesh,indices});
   });
   console.info('[Floresta V18] Amostras da parte traseira da aranha:',riderTailSamples.map(x=>x.indices.length));
 }
 function targetRiderEyeLift(eyes){
   if(!mounted||mounted.playing!=='attack'||mounted.animationTimer<=0||!riderTailSamples.length)return 0;
   // Recalcula os vertices com a deformacao real das animacoes do esqueleto,
   // mas NUNCA grava valores no FBX. Apenas le suas posicoes no mundo.
   mounted.root.updateMatrixWorld(true);
   let top=-Infinity;
   for(const sample of riderTailSamples){
     const {mesh,indices}=sample;
     for(const i of indices){
       mesh.getVertexPosition(i,safeVertex);
       mesh.localToWorld(safeVertex);
       if(safeVertex.y>top)top=safeVertex.y;
     }
   }
   if(!Number.isFinite(top))return 0;
   // Se o abdomen erguer acima dos olhos, levantar o ponto de vista a um
   // lugar seguro (acima do abdomen), sem cortar a geometria ou mudar a pose.
   return clamp(top+.42-eyes.y,0,8.0);
 }
 function updateRiderCameraPosition(eyes){
   const now=performance.now();
   const dt=clamp((now-lastRiderViewTime)/1000,.001,.06);lastRiderViewTime=now;
   const needed=targetRiderEyeLift(eyes);
   // V23: altura filtrada no mesmo clock do corpo. Evita saltos abruptos
   // quando a deformação do FBX faz o limite do abdômen oscilar entre frames.
   const rate=needed>riderViewLift?16:8;
   const target=riderViewLift+(needed-riderViewLift)*(1-Math.exp(-dt*rate));
   // Limite de velocidade vertical: o corpo já segue o ataque, portanto
   // nenhum deslocamento visual extra deve ocorrer em um único frame.
   riderViewLift+=clamp(target-riderViewLift,-3.5*dt,5.0*dt);
   if(riderViewLift<.006)riderViewLift=0;
   game.camera.position.copy(eyes);
   game.camera.position.y+=riderViewLift;
 }


 // V35 — CARGA FISICA DA ARANHA. Codigo isolado dentro do modulo de montaria,
 // usando o mesmo THREE, a mesma cena e o mesmo update do avatar. Nenhum
 // colisor, controle ou animacao aprovados da V34 sao substituidos.
 const cargoState={items:[],held:null,serial:0,starterSpawned:false,animTime:0,unloadedBoards:0,unloadedLogs:0};
 // 15 tabuas por aranha; seis troncos no maximo, para evitar excesso de volume.
 const CARGO_MAX_SLOTS=15,CARGO_MAX_PLANKS=15,CARGO_MAX_LOGS=6;
 const cargoWoodBark=new T.MeshStandardMaterial({color:0x654327,roughness:.97});
 const cargoWoodGrain=new T.MeshStandardMaterial({color:0x92633b,roughness:.89});
 const cargoWoodEnds=new T.MeshStandardMaterial({color:0xc89a61,roughness:.94});
 const cargoWoodDark=new T.MeshStandardMaterial({color:0x48311e,roughness:.96});
 const cargoStrapMaterial=new T.MeshStandardMaterial({color:0x64513a,roughness:1});
 const cargoTempWorld=new T.Vector3(),cargoTempLocal=new T.Vector3();
 const cargoTempQ=new T.Quaternion(),cargoTempPivotQ=new T.Quaternion();
 const cargoYAxis=new T.Vector3(0,1,0);
 // O rack e reorganizado depois de cada carregamento e retirada.
 // Tabuas ficam em 3 fileiras horizontais × 5 camadas; os troncos em duas fileiras.
 const cargoSlotLocations=[];
 // V36: nada de tronco ou tabua inventados aqui. A malha, a geometria e
 // os materiais sao os do SISTEMA NATIVO do Floresta (lenhador / serraria).
 function nativeWoodReady(){
   return typeof window.gameLumber?.createCargoLog==='function'&&
          typeof window.gamePlankCarry?.createCargoPlank==='function';
 }
 function newCargoMesh(kind){
   const root=new T.Group();root.name='V36_Madeira_Original_'+kind;
   if(kind==='log'){
     const log=window.gameLumber?.createCargoLog?.();
     if(!log)return null;
     // O log nativo usa cilindro vertical; a mesma malha fica horizontal no chao.
     log.position.set(0,0,0);
     log.rotation.set(Math.PI/2,0,0);
     root.add(log);root.userData.nativeLog=log;
   }else if(kind==='plank'){
     const plank=window.gamePlankCarry?.createCargoPlank?.(3.05);
     if(!plank)return null;
     plank.position.set(0,0,0);plank.rotation.set(0,0,0);
     root.add(plank);root.userData.nativePlank=plank;
   }else if(kind==='block'){
     // O bloco opcional da V35 nao faz parte dos sistemas de tronco e tabua.
     const block=new T.Mesh(new T.BoxGeometry(.65,.48,.72),
       [cargoWoodBark,cargoWoodBark,cargoWoodGrain,cargoWoodGrain,cargoWoodEnds,cargoWoodEnds]);
     block.castShadow=true;block.receiveShadow=true;root.add(block);
   }else return null;
   root.userData.spiderCargo=kind;
   return root;
 }
 function cargoGroundHeight(item,x,z){
   return game.groundY(x,z)+(item.kind==='log'?(item.root.userData.nativeLog?.userData.radius||.235):item.kind==='plank'?.078:.245);
 }
 function spawnCargo(kind='log',where){
   if(!zone.active){notify('Entre no Criativo ou ative o Modo Hack para gerar madeira.');return null}
   if(cargoState.items.length>=45){notify('Limite de 45 pecas no laboratorio.');return null}
   if(!['log','plank','block'].includes(kind))return null;
   if(kind!=='block'&&!nativeWoodReady()){notify('Aguarde carregar os troncos e tabuas originais do Floresta.');return null;}
   const yaw=game.player.yaw,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
   const n=cargoState.serial++;
   const x=where?.x ?? game.player.x +fx*2.4+rx*((n%3)-1)*.86;
   const z=where?.z ?? game.player.z +fz*2.4+rz*((n%3)-1)*.86;
   const root=newCargoMesh(kind);
   if(!root)return null;
   const item={id:n+1,kind,root,state:'ground',spider:null,slot:-1,transition:null};
   root.position.set(x,cargoGroundHeight(item,x,z),z);
   root.rotation.y=yaw;
   game.scene.add(root);cargoState.items.push(item);
   updateCargoUI();return item;
 }
 function spawnStarterCargo(){
   if(cargoState.starterSpawned||!window.gameTestMode?.active||!nativeWoodReady())return;
   cargoState.starterSpawned=true;
   // Perto do jogador, mas fora do caminho de spawn da aranha.
   const yaw=game.player.yaw,rx=Math.cos(yaw),rz=-Math.sin(yaw),bx=Math.sin(yaw),bz=Math.cos(yaw);
   const x=game.player.x+rx*3.0+bx*.3,z=game.player.z+rz*3.0+bz*.3;
   for(let i=0;i<2;i++)spawnCargo('log',{x:x+bx*i*.85,z:z+bz*i*.85});
   for(let i=0;i<4;i++)spawnCargo('plank',{x:x+rx*1.25+bx*(i%2)*.8,z:z+rz*1.25+bz*(i%2)*.8});
   spawnCargo('block',{x:x-rx*.9,z:z-rz*.9});
   notify('Criativo: troncos, tabuas e blocos no chao. J pega e U carrega na aranha.');
 }
 function cargoNearbyItem(){
   const p=game.player;let best=null,bestD=2.4;
   for(const item of cargoState.items){
     if(item.state!=='ground')continue;
     const d=Math.hypot(item.root.position.x-p.x,item.root.position.z-p.z);
     if(d<bestD){bestD=d;best=item;}
   }
   return best;
 }
 function releaseCargoHeld(){
   const item=cargoState.held;if(!item)return false;
   item.root.updateWorldMatrix(true,false);
   game.scene.attach(item.root);
   const yaw=game.player.yaw;
   const x=game.player.x-Math.sin(yaw)*1.05+Math.cos(yaw)*.75;
   const z=game.player.z-Math.cos(yaw)*1.05-Math.sin(yaw)*.75;
   item.state='dropping';item.spider=null;item.slot=-1;
   item.transition={type:'drop',elapsed:0,duration:.45,from:item.root.position.clone(),
     to:new T.Vector3(x,cargoGroundHeight(item,x,z),z)};
   cargoState.held=null;updateCargoUI();return true;
 }
 function pickCargo(){
   if(!canPlay()||climbState.active)return false;
   if(mounted){notify('Desca da aranha para carregar madeira.');return false}
   if(cargoState.held){releaseCargoHeld();notify('Madeira colocada no chao.');return true}
   if(window.gameLumber?.carrying||window.gamePlankCarry?.count>0){
     notify('Madeira original no ombro: use U atras da aranha para carregar.');return false;
   }
   const item=cargoNearbyItem();
   if(!item){notify('Para madeira original: Q pega tronco, G pega tabuas e U carrega na aranha.');return false}
   if(item.nativeOrigin==='log'){
     const mesh=item.root.userData.nativeLog;
     if(!window.gameLumber?.acceptCargoLog?.(mesh,item.sourceTree)){
       notify('Libere as tabuas e o ombro antes de pegar o tronco.');return false;
     }
     item.root.removeFromParent?.();
     cargoState.items.splice(cargoState.items.indexOf(item),1);
     notify('Tronco retirado do chao e devolvido ao ombro.');
     updateCargoUI();return true;
   }
   item.state='held';item.transition=null;cargoState.held=item;
   notify(item.kind==='log'?'Tronco no ombro · U coloca na aranha':item.kind==='plank'?'Tabua no ombro · U coloca na aranha':'Bloco no braco · U coloca na aranha');
   updateCargoUI();return true;
 }
 function cargoSpiderNearby(){
   let chosen=null,best=2.30;
   for(const spider of objects){
     if(spider.dead)continue;
     const d=spiderBodySurface(spider,game.player.x,game.player.z).distance;
     if(d<best){chosen=spider;best=d;}
   }
   return chosen;
 }
 function createCargoRack(spider){
   if(spider.cargoRack)return spider.cargoRack;
   const rack=new T.Group();rack.name='V35_CargoRack_OnAbdomen';
   rack.position.set(0,2.78,-3.16);spider.pivot.add(rack);
   // Dois apoios baixos, discretos, com cintas sobre a carga.
   for(const x of [-.38,.38]){
     const rail=new T.Mesh(new T.BoxGeometry(2.26,.065,.075),cargoWoodDark);
     rail.position.set(0,-.22,x*1.35);rail.castShadow=true;rack.add(rail);
   }
   const straps=[];
   for(const x of [-.52,.52]){
     const belt=new T.Mesh(new T.BoxGeometry(.055,.035,1.58),cargoStrapMaterial);
     belt.position.set(x,.25,0);belt.visible=false;rack.add(belt);straps.push(belt);
   }
   const boneList=[];spider.root.traverse(node=>{if(node.isBone&&/bone[ _-]*tail|abdomen/i.test(node.name))boneList.push(node)});
   const bone=boneList[0]||null;
   let marker=null,rest=null,restQ=null;
   if(bone){
     spider.pivot.updateMatrixWorld(true);
     marker=new T.Object3D();marker.position.copy(bone.worldToLocal(
       spider.pivot.localToWorld(new T.Vector3(0,2.78,-3.16))));bone.add(marker);
     spider.pivot.updateMatrixWorld(true);
     rest=spider.pivot.worldToLocal(marker.getWorldPosition(new T.Vector3()));
     restQ=bone.getWorldQuaternion(new T.Quaternion());
   }
   spider.cargoRack={group:rack,items:[],straps,bone,marker,rest,restQ,shift:new T.Vector3(),tilt:0};
   rack.visible=false;
   return spider.cargoRack;
 }
 function rearrangeCargo(spider){
   const rack=spider?.cargoRack;if(!rack)return;
   const logs=rack.items.filter(item=>item.kind==='log');
   const planks=rack.items.filter(item=>item.kind!=='log');
   const logLayers=Math.ceil(logs.length/2);
   const q=new T.Quaternion().setFromEuler(new T.Euler(0,Math.PI/2,0));
   let top=0;
   const put=(item,pos,thickness)=>{
     item.slot=rack.items.indexOf(item);
     if(item.transition?.type==='load'){
       item.transition.to.copy(pos);item.transition.toQ.copy(q);
     }else{
       item.root.position.copy(pos);item.root.quaternion.copy(q);
     }
     top=Math.max(top,pos.y+thickness/2);
   };
   logs.forEach((item,i)=>{
     // Distancia de 0,62m: cilindros de ate 0,62m de diametro.
     put(item,new T.Vector3(0,.29+Math.floor(i/2)*.62,i%2?.59:-.59),.60);
   });
   planks.forEach((item,i)=>{
     const layer=Math.floor(i/3),lane=i%3;
     put(item,new T.Vector3(0,logLayers*.62+.075+layer*.151,(lane-1)*.57),.14);
   });
   rack.group.visible=rack.items.length>0;
   for(const belt of rack.straps){
     belt.visible=rack.items.length>0;
     belt.position.y=Math.max(.25,top+.045);
   }
 }
 function updateRackStraps(spider){rearrangeCargo(spider)}
 // Posicao de descarga para fora do corpo da aranha e em pilhas de ate 5 tabuas.
 function cargoDropPosition(spider,kind){
   const p=game.player,dx=p.x-spider.pivot.position.x,dz=p.z-spider.pivot.position.z;
   const d=Math.hypot(dx,dz)||1,fx=dx/d,fz=dz/d;
   const count=kind==='plank'?cargoState.unloadedBoards++:cargoState.unloadedLogs++;
   const band=Math.floor(count/(kind==='plank'?5:1));
   const lateral=((band%3)-1)*1.40;
   const dist=1.65+Math.floor(band/3)*1.2;
   return {x:p.x+fx*dist-fz*lateral,z:p.z+fz*dist+fx*lateral};
 }

 // V200: cargo uses real native logs and planks already carried by the player.
 function loadCargo(){
   if(!canPlay()||climbState.active)return false;
   if(mounted){notify('Desca da aranha antes de prender a madeira.');return false}
   const spider=cargoSpiderNearby();
   if(!spider){notify('Aproxime-se da traseira da aranha.');return false}
   const local=spiderLocalXZ(spider,game.player.x,game.player.z);
   if(local.z>-.45){notify('Chegue pela traseira ou lateral traseira da aranha.');return false}
   const rack=createCargoRack(spider);
   if(rack.items.length>=CARGO_MAX_SLOTS){notify('Carga cheia: 15 pecas por aranha.');return false}
   let item=cargoState.held;
   const kind=item?.kind || (window.gameLumber?.carrying?'log':window.gamePlankCarry?.count>0?'plank':null);
   if(kind==='log'&&rack.items.filter(i=>i.kind==='log').length>=CARGO_MAX_LOGS){notify('Limite de 6 troncos por aranha.');return false}
   if(kind==='plank'&&rack.items.filter(i=>i.kind==='plank').length>=CARGO_MAX_PLANKS){notify('Limite de 15 tabuas por aranha.');return false}
   if(!item){
     const lumber=window.gameLumber,planks=window.gamePlankCarry;
     if(lumber?.carrying){
       const rel=lumber.releaseCarriedLog?.();
       if(!rel?.mesh){notify('Falha ao transferir o tronco do ombro.');return false}
       window.gameLogPlacement?.cancel?.();
       const root=new T.Group();root.name='V200_Tronco_Original';
       game.scene.add(root);
       root.position.set(game.player.x,game.groundY(game.player.x,game.player.z)+1.1,game.player.z);
       rel.mesh.position.set(0,0,0);rel.mesh.rotation.set(Math.PI/2,0,0);
       root.add(rel.mesh);root.userData.nativeLog=rel.mesh;
       item={id:++cargoState.serial,kind:'log',root,state:'held',spider:null,slot:-1,
         transition:null,nativeOrigin:'log',sourceTree:rel.tree};
     }else if(planks?.count>0){
       const root=newCargoMesh('plank');
       if(!root){notify('Malha de tabua nao esta disponivel.');return false}
       if(!planks.consumeOne?.()){notify('Falha ao retirar uma tabua.');return false}
       root.name='V200_Tabua_Original';
       root.position.set(game.player.x,game.groundY(game.player.x,game.player.z)+1.1,game.player.z);
       game.scene.add(root);
       item={id:++cargoState.serial,kind:'plank',root,state:'held',spider:null,slot:-1,
         transition:null,nativeOrigin:'plank'};
     }else{
       notify('Primeiro carregue um tronco com Q ou tabuas com G; depois use U.');
       return false;
     }
     cargoState.items.push(item);
   }
   item.root.updateWorldMatrix(true,false);rack.group.attach(item.root);
   item.state='loading';item.spider=spider;item.slot=rack.items.length;
   const q=new T.Quaternion().setFromEuler(new T.Euler(0,Math.PI/2,0));
   item.transition={type:'load',elapsed:0,duration:.8,from:item.root.position.clone(),
     fromQ:item.root.quaternion.clone(),to:new T.Vector3(),toQ:q};
   rack.items.push(item);cargoState.held=null;
   updateRackStraps(spider);updateCargoUI();
   const boardCount=rack.items.filter(i=>i.kind==='plank').length;
   notify('Carga: '+boardCount+'/15 tabuas, '+(rack.items.length-boardCount)+'/6 troncos.');
   return true;
 }
 function unloadCargo(){
   if(!canPlay()||climbState.active)return false;
   if(mounted){notify('Desca da aranha para retirar a madeira.');return false}
   const spider=cargoSpiderNearby();
   if(!spider?.cargoRack?.items.length){notify('Aproxime-se da aranha com carga (traseira ou lateral).');return false}
   const rack=spider.cargoRack;
   const item=rack.items[rack.items.length-1];
   const isNative=item.nativeOrigin==='log'||item.nativeOrigin==='plank';
   let action='ground',point=null;
   if(item.nativeOrigin==='log'){
     const mesh=item.root.userData.nativeLog;
     if(window.gameLumber?.acceptCargoLog?.(mesh,item.sourceTree)){
       action='shoulder';
     }else{
       // O ombro ocupado nao bloqueia a retirada. O tronco inteiro vai ao chao.
       point=cargoDropPosition(spider,'log');
       if(!mesh){notify('O tronco desta carga nao esta disponivel.');return false}
       game.scene.attach(item.root);
       item.root.rotation.set(0,game.player.yaw,0);
       item.root.position.set(point.x,game.groundY(point.x,point.z)+(mesh.userData?.radius||.26),point.z);
       mesh.userData.spiderUnloaded=true;
       window.gameLumber?.registerPlacedLog?.(mesh,item.sourceTree);
       action='ground_log';
     }
   }else if(item.nativeOrigin==='plank'){
     if(window.gamePlankCarry?.acceptCargoPlank?.()){
       action='shoulder';
     }else{
       point=cargoDropPosition(spider,'plank');
       const len=item.root.userData.nativePlank?.userData?.length||3.05;
       const ok=window.gamePlankCarry?.storeCargoPlank?.(point.x,point.z,game.player.yaw,len);
       if(!ok){notify('Falha ao formar pilha no chao; carga preservada.');return false}
       action='ground_plank';
     }
   }else{
     // Itens de laboratorio sao descarregados como antes e podem ser pegos com J.
     point=cargoDropPosition(spider,item.kind);
     item.root.updateWorldMatrix(true,false);game.scene.attach(item.root);
     item.state='dropping';item.spider=null;item.slot=-1;
     item.transition={type:'drop',elapsed:0,duration:.45,from:item.root.position.clone(),
       to:new T.Vector3(point.x,cargoGroundHeight(item,point.x,point.z),point.z)};
     action='test_ground';
   }
   rack.items.pop();
   if(action==='shoulder'||action==='ground_plank'){
     item.transition=null;item.root.removeFromParent?.();
     const idx=cargoState.items.indexOf(item);if(idx>=0)cargoState.items.splice(idx,1);
   }else if(action==='ground_log'){
     item.state='ground';item.transition=null;item.spider=null;item.slot=-1;
   }
   updateRackStraps(spider);updateCargoUI();
   if(action==='shoulder')notify(item.kind==='log'?'Tronco devolvido ao ombro.':'Tabua devolvida a pilha do ombro.');
   else if(action==='ground_plank')notify('Tabua colocada em pilha no chao. Pegue com G.');
   else if(action==='ground_log')notify('Tronco descarregado no chao. Pegue com J.');
   else notify('Madeira de teste colocada no chao. Pegue com J.');
   return true;
 }
 function updateCargoUI(){
   const held=cargoState.held;
   const list=document.getElementById('cargoStatusV35');
   if(list){
     const loaded=cargoState.items.filter(x=>x.spider&&['loading','loaded'].includes(x.state));
     const carried=held?.kind==='log'||window.gameLumber?.carrying?'tronco':
       (window.gamePlankCarry?.count>0?window.gamePlankCarry.count+' tabuas':held?.kind||'nada');
     const planks=loaded.filter(i=>i.kind==='plank').length,logs=loaded.filter(i=>i.kind==='log').length;
     list.textContent=`No chao: ${cargoState.items.filter(x=>x.state==='ground').length} · Ombro: ${carried} · Aranha: ${planks}/15 tabuas, ${logs}/6 troncos (total ${loaded.length}/15)`;
   }
 }
 function updateCargoRack(spider,dt){
   const rack=spider.cargoRack;if(!rack||!rack.items.length)return;
   // O suporte acompanha a posicao do PIVOT no pulo e na caminhada. No ataque
   // acompanha a elevação REAL do abdomen, sem microtremor do idle.
   let tx=0,ty=0,tz=0,tPitch=0;
   if(rack.marker&&rack.rest){
     spider.pivot.updateMatrixWorld(true);
     const curr=rack.marker.getWorldPosition(cargoTempWorld);
     spider.pivot.worldToLocal(curr);
     cargoTempLocal.subVectors(curr,rack.rest);
     const fighting=spider.playing==='attack'&&spider.animationTimer>0;
     if(fighting){
       tx=clamp(cargoTempLocal.x,-.40,.40);
       ty=clamp(cargoTempLocal.y,-.20,1.20);
       tz=clamp(cargoTempLocal.z,-.70,.70);
       rack.bone.getWorldQuaternion(cargoTempQ);
       spider.pivot.getWorldQuaternion(cargoTempPivotQ);
       cargoTempQ.premultiply(cargoTempPivotQ.invert());
       const upright=cargoYAxis.clone().applyQuaternion(cargoTempQ);
       tPitch=clamp(Math.atan2(-upright.z,Math.max(.35,upright.y)),-.25,.25);
     }
   }
   const k=1-Math.exp(-Math.min(dt||.016,.05)*18);
   rack.shift.x+=(tx-rack.shift.x)*k;
   rack.shift.y+=(ty-rack.shift.y)*k;
   rack.shift.z+=(tz-rack.shift.z)*k;
   rack.tilt+=(tPitch-rack.tilt)*k;
   for(const a of ['x','y','z'])if(Math.abs(rack.shift[a])<.0004)rack.shift[a]=0;
   if(Math.abs(rack.tilt)<.0004)rack.tilt=0;
   rack.group.position.set(rack.shift.x,2.78+rack.shift.y,-3.16+rack.shift.z);
   rack.group.rotation.x=rack.tilt;
 }
 function updateCargoFrame(dt){
   const step=clamp(dt||.016,.001,.055);
   if(!zone.active)return;
   if(!panel.classList.contains('show'))panel.classList.add('show');
   for(const spider of objects)updateCargoRack(spider,step);
   const held=cargoState.held;
   if(held){
     // Posicao visivel junto ao ombro ESQUERDO do personagem (nao obstrui
     // completamente os olhos), sem trocar as animacoes nativas das maos.
     const p=game.player,yaw=p.bodyYaw??p.yaw;
     const bx=Math.sin(yaw),bz=Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
     const tx=p.x-rx*.71+bx*.20,tz=p.z-rz*.71+bz*.20;
     const destY=game.groundY(p.x,p.z)+1.29;
     const alpha=1-Math.exp(-step*19);
     held.root.position.lerp(new T.Vector3(tx,destY,tz),alpha);
     held.root.rotation.y+=(yaw-held.root.rotation.y)*alpha;
   }
   for(const item of cargoState.items){
     const a=item.transition;if(!a)continue;
     a.elapsed=Math.min(a.duration,a.elapsed+step);
     const u=a.elapsed/a.duration,e=u*u*(3-2*u);
     item.root.position.copy(a.from).lerp(a.to,e);
     if(a.type==='load'){
       item.root.position.y+=Math.sin(Math.PI*u)*.77;
       item.root.quaternion.slerpQuaternions(a.fromQ,a.toQ||new T.Quaternion(),e);
     }else item.root.position.y+=Math.sin(Math.PI*u)*.28;
     if(u>=1){
       item.state=a.type==='load'?'loaded':'ground';
       item.root.position.copy(a.to);
       if(a.type==='load')item.root.quaternion.copy(a.toQ||new T.Quaternion());
       item.transition=null;
       updateCargoUI();
     }
   }
 }

 // V50: copia EXCLUSIVAMENTE VISUAL da aranha original. Nao a registra
 // como montaria, nao cria colisores da montaria e nao altera as animacoes V37.
 function createSmallOriginalSpiderVisual(){
   return {model:animatedClone(),animations:Object.values(clips)};
 }
 function spawnSpider(){
   if(!(window.gameTestMode?.active||window.gameSpiderCave?.preparingMount||window.gameHackMode?.enabled)){notify('Liberte a montaria no ninho da Rainha ou ative o Modo Hack.');return null}
   if(objects.length>=10){notify('Máximo: dez aranhas por laboratório.');return null}
   const player=game.player,dirX=-Math.sin(player.yaw),dirZ=-Math.cos(player.yaw);
   const root=animatedClone(),pivot=new T.Group();pivot.position.set(player.x+dirX*(window.gameHackMode?.enabled?3.6:5.45),game.groundY(player.x,player.z),player.z+dirZ*(window.gameHackMode?.enabled?3.6:5.45));root.rotation.y=orientationOffset;pivot.add(root);game.scene.add(pivot);
   const mixer=new T.AnimationMixer(root.children[0]);const actions={};
   for(const [key,clip] of Object.entries(clips)){const a=mixer.clipAction(clip);a.clampWhenFinished=true;a.setLoop(['attack','hit','death'].includes(key)?T.LoopOnce:T.LoopRepeat,Infinity);actions[key]=a}
   const spider={id:++serial,pivot,root,mixer,actions,playing:null,hp:100,dead:false,attackTimer:0,attackDone:false,animationTimer:0};makeSpiderLegBones(spider);objects.push(spider);animate(spider,'idle');if(!cargoState.starterSpawned)spawnStarterCargo();notify('Aranha-gigante gerada. E ou M para montar.');return spider;
 }
 function nearest(within=CLIMB_SURFACE_REACH){
   let best=null,dist=within;
   for(const spider of objects){
     if(spider.dead)continue;
     const d=climbReach(spider);
     if(d<=dist){dist=d;best=spider;}
   }
   return best;
 }
 // Montado: os objetos que não têm animação de mão compatível ficam guardados.
 function stowNonTorch(){
   window.gameRightHand?.unequip?.();
   window.gameShield?.unequip?.();
   window.gameBranchHands?.unequip?.();
   window.gameShieldCraft?.unequipChip?.();
 }
 function restrictMountEquipment(){
   // Também protege uso de inventário, crafting e chamadas diretas de equipamentos.
   for(const [name,methods] of [
     ['gameRightHand',['equip']],['gameShield',['equip']],
     ['gameBranchHands',['equip','toggle','left','right']],
     ['gameShieldCraft',['equipChip']],
     ['gameQuickHands',['equip','cycleRight','cycleLeft','equipBranchLeft']],
     ['gamePrimitive',['equipArmor']]
   ]){
     const api=window[name];if(!api)continue;
     for(const method of methods){
       const original=api[method];if(typeof original!=='function'||original.__mountTorchOnlyV10)continue;
       const guarded=function(...args){
         if(mounted && !(name==='gameQuickHands' && method==='equip' && args[0]==='torch')){notify('Enquanto estiver montado, só é possível equipar a tocha.');return false;}
         return original.apply(this,args);
       };
       guarded.__mountTorchOnlyV10=true;api[method]=guarded;
     }
   }
 }
 function syncMountInventory(){
   // Exibe os outros atalhos bloqueados, sem alterar os itens do inventário.
   document.body.classList.toggle('spider-torch-only-v10',!!mounted);
   window.gameInventory?.refresh?.();
   window.gameUI173?.sync?.();
 }
 function refresh(){panel.classList.toggle('show',!!window.gameTestMode?.active);const is=!!mounted,climbing=climbState.active;
 $('mountStateV3').textContent=climbing?'SUBINDO · '+climbLabels[climbState.index]:is?'MONTADO · apenas TOCHA (6) · demais itens guardados':'Aproxime-se da aranha e pressione E ou M';
 $('mountToggleV3').textContent=climbing?'SUBINDO...':is?'DESCER · E':'SUBIR E MONTAR · E';$('mountTouchToggleV3').textContent=climbing?'SUBINDO':is?'DESCER':'SUBIR';
 }
 function dismount(silent=false){if(!mounted)return false;collisionLast.valid=false;if(!silent&&!mountJump.grounded){notify('Espere aterrissar para descer.');return false;}resetMountJump();resetMountedIdle();resetRiderArmLock();const old=mounted;mounted=null;riderViewLift=0;riderTailSamples=[];stopSeatFollow();if(neckSeal)neckSeal.shell.visible=false;seatMixer?.stopAllAction();seatTime=0;old.attackTimer=0;old.animationTimer=0;animate(old,'idle');
  // Desmontar restaura a orientacao normal do jogador: sem inclinacao residual.
  if(game.trueFirstPerson?.visibleRoot){game.trueFirstPerson.visibleRoot.rotation.set(0,game.player.bodyYaw||0,0,avatarOriginalRotationOrder);}
  const yaw=game.player.yaw;game.player.x=old.pivot.position.x+Math.cos(yaw)*5.15;game.player.z=old.pivot.position.z-Math.sin(yaw)*5.15;game.player.speed=4.5;if(window.gameSpiderCave?.active){for(let i=0;i<16;i++){const a=yaw+i*Math.PI/8,x=old.pivot.position.x+Math.cos(a)*5.15,z=old.pivot.position.z+Math.sin(a)*5.15;if(!window.gameSpiderCave.blocked(x,z,.4)){game.teleport186(x,z,yaw);break;}}}
  refresh();syncMountInventory();if(!silent)notify('Você desceu da aranha. Outros equipamentos liberados.');return true}
 function activateMountedSpider(mob){
   avatarOriginalRotationOrder=game.trueFirstPerson?.visibleRoot?.rotation.order||'XYZ';
   resetMountJump();resetMountedIdle();resetRiderArmLock();
   collisionLast.valid=false;stowNonTorch();mounted=mob;restrictMountEquipment();mob.attackTimer=0;mob.animationTimer=0;
   lastPos={x:game.player.x,z:game.player.z};chooseSeatPose(seatIndex,true);
   riderViewLift=0;lastRiderViewTime=performance.now();findRiderTailVertices(mob);stopSeatFollow();
   mountYaw=normYaw(mountYaw);targetMountYaw=mountYaw;mountHeadYaw=0;
   mob.pivot.rotation.y=normYaw(mountYaw+Math.PI);
   game.player.x=mob.pivot.position.x;game.player.z=mob.pivot.position.z;game.player.bodyYaw=mountYaw;
   lastPos.x=game.player.x;lastPos.z=game.player.z;
   animate(mob,'idle');mob.mixer.update(0);startSeatFollow(mob);
   game.keys.delete('KeyC');game.keys.delete('ControlLeft');game.keys.delete('ControlRight');
   refresh();syncMountInventory();
 }
 function toggleMount(){
   if(!canPlay()||climbState.active)return;
   if(mounted){dismount();return}
   if(cargoState.held){notify('Coloque a madeira no chao ou sobre a aranha antes de montar.');return}
   const mob=nearest();
   if(!mob){notify('Aproxime-se de uma aranha para escalar e montar.');return}
   if(climbReady){beginClimb(mob,1);return}
   if(climbLoadError)notify('Escaladas indisponíveis: '+climbLoadError);
   else notify('Carregando a Escalada 2...');
 }

 function hitSpider(target,value){target.hp=Math.max(0,target.hp-value);if(target.hp<=0){target.dead=true;animate(target,'death')}else{animate(target,'hit');target.animationTimer=.55}}
 function hitSweep(){
   const me=mounted;if(!me||me.dead)return;if(window.gameSpiderCave?.active){window.gameSpiderCave.damageRadius(me.pivot.position.x,me.pivot.position.z,5.5,45,'Montaria');}const heading=me.pivot.rotation.y,fx=Math.sin(heading),fz=Math.cos(heading),x=me.pivot.position.x,z=me.pivot.position.z;
   let closest=null,dmin=Infinity;
   for(const other of objects){if(other===me||other.dead)continue;const dx=other.pivot.position.x-x,dz=other.pivot.position.z-z,d=Math.hypot(dx,dz),front=(dx*fx+dz*fz)/Math.max(.001,d);if(d<5.55&&front>.2&&d<dmin){closest=other;dmin=d}}
   if(closest){hitSpider(closest,45);notify(`Ataque da aranha acertou alvo! Vida: ${closest.hp}%`)}
 }
 function attack(){if(!canPlay()||!mounted||attackCooldown>0||mounted.dead)return false;
   attackCooldown=.75;mounted.attackTimer=.29;mounted.attackDone=false;mounted.animationTimer=.72;
   animate(mounted,'attack');notify('Ataque da montaria!');return true;
 }
 // V23: controla SOMENTE a aranha montada no mesmo frame do avatar.
 function updateMountedSpiderSynchronous(dt,groundedY){
   if(!mounted)return;
   const step=clamp(dt||0,0,.055);
   stepMountJump(step);
   const player=game.player;
   mounted.pivot.position.set(player.x,game.groundY(player.x,player.z)+mountJump.height,player.z);
   mounted.pivot.rotation.y=normYaw(mountYaw+Math.PI);
   const moved=Math.hypot(player.x-lastPos.x,player.z-lastPos.z)>.008;
   if(mounted.attackTimer>0){
     mounted.attackTimer-=step;
     if(mounted.attackTimer<=0&&!mounted.attackDone){mounted.attackDone=true;hitSweep()}
   }
   if(mounted.animationTimer>0){
     mounted.animationTimer-=step;
     if(mounted.animationTimer<=0)animate(mounted,moved?'walk':'idle');
   }else animate(mounted,moved?'walk':'idle');
   const walking=mounted.actions.walk;
   if(walking&&mounted.playing==='walk'){
     const backwards=reverseHeld()&&!forwardHeld();
     if(backwards&&walking.getEffectiveTimeScale()>=0&&walking.time<.025)
       walking.time=walking.getClip().duration;
     walking.setEffectiveTimeScale(backwards?-animationScale:animationScale);
   }
   mounted.mixer.update(step);
   mounted.pivot.updateMatrixWorld(true);
   lastPos.x=player.x;lastPos.z=player.z;
 }

 // V24 — repouso do cavaleiro estável. O mixer nativo da caminhada/idle
 // estava avançando mesmo com a aranha parada. Isso animava continuamente os
 // ombros e a mão segurando a tocha, criando o tremor visto no vídeo.
 // Após uma breve transição (inclui equipar/guardar a tocha), pausamos somente
 // o relógio do avatar nativo. O FBX da aranha, a pose das pernas e o vínculo
 // do corpo ao dorso seguem atualizando normalmente em TODOS os quadros.
 const mountedIdle={stillFor:0,locked:false,clock:0,torch:null};
 function resetMountedIdle(){mountedIdle.stillFor=0;mountedIdle.locked=false;mountedIdle.torch=null;}
 function nativeMountedIdleFrame(elapsed,dt,groundedY,onGround,fallSpeed,nativeUpdate){
   const step=clamp(Number(dt)||0,0,.055);
   const k=game.keys;
   const moving=!!(k?.has('KeyW')||k?.has('KeyA')||k?.has('KeyS')||k?.has('KeyD')||
     k?.has('ArrowUp')||k?.has('ArrowLeft')||k?.has('ArrowDown')||k?.has('ArrowRight')||
     Math.hypot(Number(game.stick?.x||0),Number(game.stick?.y||0))>.055);
   const torch=!!game.isEquipped?.();
   if(moving||mountedIdle.torch!==torch){
     mountedIdle.stillFor=0;
     mountedIdle.locked=false;
     mountedIdle.torch=torch;
   }else if(!mountedIdle.locked){
     mountedIdle.stillFor+=step;
     if(mountedIdle.stillFor>=.46){mountedIdle.locked=true;mountedIdle.clock=elapsed;}
   }
   // DT=0 congela APENAS o idle nativo. A animação da aranha e o corpo
   // continuam sincronizados em updateMountedSpiderSynchronous/updateSeatFollow.
   // O tempo também é fixado: o código original usa senos de elapsed para
   // animar a cabeça, que por sua vez altera a perspectiva da mão.
   nativeUpdate(mountedIdle.locked?mountedIdle.clock:elapsed,
                false,mountedIdle.locked?0:dt,groundedY,onGround,fallSpeed);
 }

 // V25: pose estável das mãos do cavaleiro. Não congela a aranha,
 // não toca no FBX da montaria e não interfere no acompanhamento do golpe.
 // O rig nativo pode recalcular IK/repouso em cada quadro mesmo com DT=0.
 // Uma vez terminada a transição da tocha, seguramos as rotações locais dos
 // braços/antebraços/punhos. Assim eles permanecem fixos RELATIVOS ao tronco
 // que continua seguindo normalmente a aranha no ataque.
 const riderArmLock={pose:null,seconds:0,torch:null};
 function resetRiderArmLock(){riderArmLock.pose=null;riderArmLock.seconds=0;riderArmLock.torch=null;}
 function stabilizeRiderArms(dt){
   const tfp=game.trueFirstPerson;
   if(!mounted||!tfp?.bones)return;
   const torch=!!game.isEquipped?.();
   if(riderArmLock.torch!==torch){
     riderArmLock.pose=null;riderArmLock.seconds=0;riderArmLock.torch=torch;
   }
   const limbs=['lArm','lFore','lHand','rArm','rFore','rHand'];
   if(!riderArmLock.pose){
     riderArmLock.seconds+=clamp(dt||0,0,.055);
     // Deixa o controlador original posicionar os braços após montar e
     // após equipar/guardar a tocha, antes de capturar o repouso.
     if(riderArmLock.seconds>=.60){
       riderArmLock.pose=limbs.map(k=>({bone:tfp.bones[k],quaternion:tfp.bones[k]?.quaternion?.clone()})).filter(x=>x.bone&&x.quaternion);
     }
     return;
   }
   for(const {bone,quaternion}of riderArmLock.pose)bone.quaternion.copy(quaternion);
 }

 // Camadas de animação: a pé usa 100% da lógica V174; montado a pose FBX
 // controla quadril e pernas, enquanto a atualização NATIVA preserva as mãos.
 // O controlador de movimento do jogador ainda não aplica caminhada montado.
 if(typeof window.__prepareAnimatedAvatar==='function'){
   const nativePrepare=window.__prepareAnimatedAvatar;
   window.__prepareAnimatedAvatar=(dt,moving)=>{
     if(climbState.active){game.player.speed=0;game.keys.clear?.();if(game.stick){game.stick.x=0;game.stick.y=0}nativePrepare(0,false);game.player.speed=0;return;}
    if(!mounted)return nativePrepare(dt,moving);
     driveMount(Math.min(.055,Math.max(.001,dt||0)));
     const running=rawDown('ShiftLeft')||rawDown('ShiftRight');
     game.player.speed=running?10.0:6.5;
     if(game.trueFirstPerson?.state){game.trueFirstPerson.state.run=running;game.trueFirstPerson.state.mode='Montado · '+seatNames[seatIndex];}
   };
 }
 if(typeof window.__updateAnimatedAvatar==='function'){
   const nativeUpdate=window.__updateAnimatedAvatar;
   window.__updateAnimatedAvatar=(elapsed,moving,dt,groundedY,onGround,fallSpeed)=>{
     if(climbState.active){collisionLast.valid=false;return applyClimbingAvatar(elapsed,dt,groundedY,onGround,fallSpeed,nativeUpdate);}
     if(!mounted){
       resolveSpiderCollisions(groundedY);
       const result=nativeUpdate(elapsed,moving,dt,groundedY,onGround,fallSpeed);
       updateCargoFrame(dt);
       return result;
     }
     collisionLast.valid=false;
     // Primeiro executa a animação NATIVA em modo parado: restaura os braços,
     // as mãos, o fechamento dos dedos e a posição de segurar a tocha.
     // Não liga a caminhada, pois "moving" é explicitamente false.
     nativeMountedIdleFrame(elapsed,dt,groundedY,onGround,fallSpeed,nativeUpdate);
     const tfp=game.trueFirstPerson;
     if(!tfp?.visibleRoot)return;
     // A animação do FBX precisa ser atualizada ANTES da pose do cavaleiro
     // neste mesmo frame. Não é mais atualizada no RAF separado do laboratório.
     updateMountedSpiderSynchronous(dt,groundedY);
     updateCargoFrame(dt);
     // Em seguida, posiciona a bacia/pernas sobre o dorso ANIMADO.
     const mountMotion=updateSeatFollow(dt);
     // A raiz do avatar fica PRESA ao dorso da aranha na altura 1,41 (ou a altura
     // escolhida no slider) e acompanha a animação do corpo/abdômen da montaria.
     tfp.visibleRoot.position.set(
       game.player.x + Math.sin(mountYaw)*SEAT_REAR_OFFSET,
       groundedY+mountHeight+SEAT_SCALE_Y+mountJump.height,
       game.player.z + Math.cos(mountYaw)*SEAT_REAR_OFFSET
     );
     // A raiz completa do jogador fica presa à aranha. O corpo todo acompanha
     // a elevação e a inclinação do abdômen, inclusive durante o ataque.
     tfp.visibleRoot.rotation.order='YXZ';
     tfp.visibleRoot.rotation.set(mountMotion.tiltX,mountYaw,mountMotion.tiltZ,'YXZ');
     torsoScratchB.set(mountMotion.dx,mountMotion.dy,mountMotion.dz).applyAxisAngle(torsoAxis,mountYaw+Math.PI);
     tfp.visibleRoot.position.add(torsoScratchB);
     applyMountedPose(dt);
     stabilizeRiderArms(dt);
     tfp.visibleRoot.updateMatrixWorld(true);
     followEquippedTorch();
     const eyes=tfp.eyeSocket?.getWorldPosition(new T.Vector3());
     if(eyes){
       // Ponto óptico levemente à frente do rosto: evita enxergar a cavidade
       // aberta do pescoço/cabeça, sem esconder a cabeça, pernas ou aranha.
       // A câmera continua rigidamente ligada ao personagem montado.
       const yaw=game.player.yaw;
       eyes.x-=Math.sin(yaw)*.31;
       eyes.z-=Math.cos(yaw)*.31;
       eyes.y+=.075;
       updateRiderCameraPosition(eyes);
       game.camera.rotation.set(game.player.pitch,game.player.yaw,0,'YXZ');
       game.camera.updateMatrixWorld(true);
       
     }
     if($('seatStatusV4')&&Math.floor(performance.now()/600)%2===0)mountPoseInfo();
   };
 }
 function controlsBlocked(){return !!(window.gameInventory?.isOpen||document.querySelector('#directorOverlay.open')||document.body.classList.contains('crafting-active')||document.querySelector('#h171Drawer.open'))}
 window.addEventListener('keydown',e=>{
   if(!canPlay()||e.repeat||controlsBlocked())return;
   if(climbState.active){
     if(['KeyW','KeyA','KeyS','KeyD','Space','KeyE','KeyM','KeyQ','ShiftLeft','ControlLeft','ControlRight','ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation()}
     return;
   }
   if(mounted&&e.code==='Space'){
     e.preventDefault();e.stopImmediatePropagation();jumpMounted();return;
   }
   if(mounted&&['KeyQ','KeyC','ControlLeft','ControlRight'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();return}
   if(e.code==='KeyJ'){e.preventDefault();e.stopImmediatePropagation();pickCargo();return}
   if(e.code==='KeyU'){e.preventDefault();e.stopImmediatePropagation();loadCargo();return}
   if(e.code==='KeyK'){e.preventDefault();e.stopImmediatePropagation();unloadCargo();return}
   if(e.code==='F6'){e.preventDefault();e.stopImmediatePropagation();chooseSeatPose((seatIndex+1)%5);return}
   if(e.code==='KeyP'){e.preventDefault();e.stopImmediatePropagation();spawnSpider()}
   if(e.code==='KeyM'||(e.code==='KeyE'&&(mounted||nearest()))){e.preventDefault();e.stopImmediatePropagation();toggleMount()}
 },true);
 function interceptMountedClick(e){if(!canPlay()||(!mounted&&!climbState.active)||controlsBlocked())return;if(e.button!=null&&e.button!==0)return;if(e.target?.closest?.('button, input, #nativeMountV3, #mountTouchV3,#nativeSeatTestV4,#testHudV112,#hud171'))return;
   // keep the existing player from attacking when the mount attacks.
   if(e.type==='mousedown'||e.type==='pointerdown'){e.stopImmediatePropagation();e.preventDefault();if(e.type==='mousedown'&&!climbState.active)attack()}
 }
 window.addEventListener('mousedown',interceptMountedClick,true);
 document.addEventListener('mousedown',interceptMountedClick,true);
 $('mountSpawnV3').onclick=spawnSpider;$('mountToggleV3').onclick=toggleMount;$('mountAttackV3').onclick=attack;$('mountJumpV26').onclick=jumpMounted;
 $('mountRotateV3').onclick=()=>{orientationOffset=orientationOffset?0:Math.PI;for(const spider of objects)spider.root.rotation.y=orientationOffset;notify('Frente do FBX invertida.')};
 $('mountTouchToggleV3').onclick=toggleMount;$('mountTouchJumpV26').onclick=jumpMounted;$('mountTouchAttackV3').onclick=attack;$('mountTouchSpawnV3').onclick=spawnSpider;
 function loop(time){requestAnimationFrame(loop);if(!zone.active)return;
   if(!cargoState.starterSpawned)spawnStarterCargo();
   const dt=Math.min(.055,Math.max(0,(time-lastT)/1000));lastT=time;
   if(attackCooldown>0)attackCooldown-=dt;
   const p=game.player;
   for(const spider of objects){
     if(spider===mounted)continue; // sincronizado pelo avatar, sem double-update.
     spider.mixer.update(dt);
     if(spider.animationTimer>0){
       spider.animationTimer-=dt;
       if(spider.animationTimer<=0&&!spider.dead)animate(spider,'idle');
     }
   }
   if(mounted?.dead){dismount(true);notify('Sua montaria foi derrotada.');return}
   if(!mounted){lastPos.x=p.x;lastPos.z=p.z;}
 }
 requestAnimationFrame(loop);
 document.addEventListener('floresta:started',()=>{if(!zone.active)return;panel.classList.add('show');refresh();if(!objects.length)setTimeout(()=>{if(zone.active)spawnSpider()},300);});
 window.addEventListener('floresta:started',()=>{if(!zone.active)return;panel.classList.add('show');refresh();if(!objects.length)setTimeout(()=>{if(zone.active)spawnSpider()},300);});
 // Caso criativo tenha iniciado antes deste módulo estar pronto.
 if(zone.active){panel.classList.add('show');if(!objects.length)spawnSpider()}
 window.gameSpiderCargo={spawn:spawnCargo,pickup:pickCargo,drop:releaseCargoHeld,load:loadCargo,unload:unloadCargo,get items(){return cargoState.items},get held(){return cargoState.held},get loaded(){return cargoState.items.filter(x=>x.spider&&['loading','loaded'].includes(x.state)).length},get maxPlanks(){return CARGO_MAX_PLANKS},version:'V201 Carga 15 Tabuas Retirada Corrigida'};
 window.gameCreativeSpiderMount={spawn:spawnSpider,createSmallOriginalSpiderVisual,mount:toggleMount,attack,jump:jumpMounted,dismount,climbTest:climbReplay,setClimbMode:(index)=>{climbIndex=1;refreshClimbUI()},get climbMode(){return climbIndex},get climbing(){return climbState.active},get climbingReady(){return climbReady},get jumping(){return !mountJump.grounded},get jumpHeight(){return mountJump.height},equipmentNotice:()=>notify('Enquanto estiver montado, só é possível equipar a tocha.'),setPose:chooseSeatPose,setSeatHeight:(v)=>{$('seatHeightV4').value=clamp(Number(v)||1.41,.6,2.3);$('seatHeightV4').dispatchEvent(new Event('input'))},get pose(){return seatIndex},get poses(){return seatNames},get mounted(){return mounted},get spiders(){return objects},get climbSurfaceReach(){return CLIMB_SURFACE_REACH},get collisionRadius(){return PLAYER_SOLID_RADIUS},get collisionBodyShapes(){return SPIDER_BODY_SHAPES.map(s=>({...s}))},get height(){return mountHeight},version:'Native V174 Spider V37 Crosswise Rear Cargo'};
 // As APIs usadas pelo inventário e pelos atalhos são protegidas só quando montado.
 restrictMountEquipment();
 console.info('FLORESTA Creative V37: carga de troncos e tábuas atravessada na traseira da aranha, mais baixa e sem apontar para a cabeça.');
})();

