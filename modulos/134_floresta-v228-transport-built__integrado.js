/* FLORESTA V230 — transporte construível corrigido + pivô estável, PC / Mobile.
   Corrige: carrinho empurrado pela frente, sumiço do modelo ao engatar e carga flutuando. */
(async function(){
 'use strict';
 if(window.__FLORESTA_TRANSPORT_V230__) return;
 window.__FLORESTA_TRANSPORT_V230__=true;
 const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 for(let n=0;n<2000;n++){
   if(window.gameConstruction?.definitions&&window.gameReview?.scene&&window.gameLumber&&window.gamePlankCarry&&window.__THREE_MODULE)break;
   await sleep(30);
 }
 const GC=window.gameConstruction,G=window.gameReview,T=window.__THREE_MODULE;
 const lumber=window.gameLumber,planks=window.gamePlankCarry;
 if(!GC||!G?.scene||!T||!lumber||!planks){console.warn('[V230 Transporte] Motor incompleto');return;}
 const player=G.player,mobile=window.__CAVE_PLATFORM==='mobile'||matchMedia('(pointer:coarse)').matches;
 const MAX={cart:27,wagon:15}, WEIGHT={log:3,plank:1};
 const keys={cart:'transport_pull_cart',wagon:'transport_wood_wagon'};
 // cart = carrinho menor (4 rodas) para empurrar pela frente
 // wagon = carroça maior (2 rodas/varais) para puxar
 const specs={
   cart:{name:'Carrinho de carga',kind:'cart',length:2.09,width:1.29,high:1.41,deck:.57,dist:1.55,mode:'push'},
   wagon:{name:'Carroça de madeira',kind:'wagon',length:3.85,width:2.66,high:1.49,deck:.80,dist:1.72,mode:'pull'}
 };
 const visualModel={cart:'wagon',wagon:'cart'},visualScale={cart:.57,wagon:1.35};
 const modelPose={cart:{x:0,y:0.01,z:0,ry:Math.PI},wagon:{x:0,y:0.01,z:0,ry:0}};
 const quatX=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,0,1),new T.Vector3(1,0,0));
 const quatLog=new T.Quaternion().setFromUnitVectors(new T.Vector3(0,1,0),new T.Vector3(0,0,1));
 const qI=new T.Quaternion();
 const makeSlot=(kind,x,y,z,len,q=qI,radius)=>({kind,pos:new T.Vector3(x,y,z),quat:q.clone(),len,...(radius?{radius}:{})});
 const sCart=[
   makeSlot('log',-.40,.29,0,1.98,quatLog,.14),makeSlot('log',.40,.29,0,1.98,quatLog,.14),
   ...[-.58,-.19,.19,.58].map(z=>makeSlot('plank',0,.60,z,1.20,quatX)),
   makeSlot('plank',0,.75,-.78,1.20,quatX),
   makeSlot('vine',-.40,.75,.42,1.46,quatLog),makeSlot('vine',.40,.75,.42,1.46,quatLog)
 ];
 const sWagon=[
   ...[-.75,0,.75].map(x=>makeSlot('log',x,.57,0,3.23,quatLog,.23)),
   ...[-1.27,-.94,-.62,-.30,.02,.34,.66,.98,1.30].map(z=>makeSlot('plank',0,1.04,z,2.05,quatX)),
   makeSlot('vine',-.91,1.28,0,3.26,quatLog),makeSlot('vine',.91,1.28,0,3.26,quatLog)
 ];
 function register(kind,slots,desc){const cfg=specs[kind];GC.definitions[keys[kind]]={id:keys[kind],vehicleType:kind,
   category:'vehicle',name:cfg.name,resource:slots[0].kind,total:slots.length,desc,
   foot:[cfg.width,cfg.length],height:cfg.high,slots};}
 register('cart',sCart,'2 troncos + 5 tábuas + 2 cipós para construir • carrega até 9 troncos ou 18 tábuas, conforme espaço e peso');
 register('wagon',sWagon,'3 troncos + 9 tábuas + 2 cipós • montagem física • carga até 15 tábuas ou 5 troncos');
 // V278: transport catalog must survive mobile/PC asynchronous panel rebuilds.
 // Previously this tab was registered only once and might never appear if the
 // construction screen was inserted after this module initialized.
 const transportStatus=(message)=>{const e=document.getElementById('status');if(e)e.textContent=message;};
 function beginConstruction(kind){
   const definition=GC.definitions[keys[kind]];
   if(!definition){transportStatus('Receita do transporte não foi carregada.');return false;}
   if(typeof GC.select!=='function'){transportStatus('Sistema de construção indisponível.');return false;}
   try{
     if(typeof GC.setLevel==='function')GC.setLevel(0);
     const ok=GC.select(definition.id);
     if(ok===false){transportStatus('Não foi possível selecionar '+definition.name+'.');return false;}
     transportStatus(definition.name+': coloque a estrutura no chão e adicione os materiais um por um.');
     return true;
   }catch(error){
     console.error('[V278] Início da construção do transporte:',error);
     transportStatus('Falha ao iniciar '+definition.name+': '+(error?.message||error));
     return false;
   }
 }
 function renderTransportCards(grid){
   grid.replaceChildren();
   for(const kind of ['cart','wagon']){
     const definition=GC.definitions[keys[kind]];
     if(!definition)continue;
     const card=document.createElement('button');
     card.type='button';card.className='construction-card';card.dataset.transportKind=kind;
     const detail=kind==='cart'?'Carrinho menor para empurrar carga':'Carroça grande para cargas pesadas';
     card.innerHTML='<strong>'+definition.name+'</strong><span>'+detail+' · capacidade '+MAX[kind]+' unidades</span><span>'+definition.desc+'</span><span class="resource">Montar colocando os recursos um por um</span>';
     let touched=0;
     card.addEventListener('pointerup',event=>{
       if(event.pointerType!=='touch')return;
       event.preventDefault();event.stopPropagation();touched=Date.now();
       beginConstruction(kind);
     });
     card.addEventListener('click',event=>{
       event.stopPropagation();
       if(Date.now()-touched<650)return;
       beginConstruction(kind);
     });
     grid.append(card);
   }
 }
 function ensureTransportTab(){
   const overlay=document.getElementById('constructionOverlay');
   const tabs=overlay?.querySelector('.construction-tabs');
   const grid=overlay?.querySelector('.construction-grid');
   if(!tabs||!grid)return false;
   let tab=tabs.querySelector('[data-cat="vehicle"]');
   if(!tab){
     tab=document.createElement('button');
     tab.type='button';tab.className='construction-tab';tab.dataset.cat='vehicle';tab.textContent='Transporte';
     tabs.appendChild(tab);
   }
   if(!tab.dataset.v278Bound){
     tab.dataset.v278Bound='1';
     let touched=0;
     const show=()=>{
       tabs.querySelectorAll('.construction-tab').forEach(b=>b.classList.toggle('active',b===tab));
       renderTransportCards(grid);
     };
     tab.addEventListener('pointerup',event=>{
       if(event.pointerType!=='touch')return;
       event.preventDefault();event.stopPropagation();touched=Date.now();
       show();
     });
     tab.addEventListener('click',event=>{
       event.stopPropagation();
       if(Date.now()-touched<650)return;
       show();
     });
   }
   // Other categories can replace the recipe grid. Restore ours on return.
   if(tab.classList.contains('active')&&!grid.querySelector('[data-transport-kind]'))renderTransportCards(grid);
   return true;
 }
 ensureTransportTab();
 const transportTabsCss=document.createElement('style');
 transportTabsCss.id='transport-v278-tabs';
 transportTabsCss.textContent='#constructionOverlay .construction-tabs{overflow-x:auto!important;overscroll-behavior-x:contain;touch-action:pan-x;scrollbar-width:thin}#constructionOverlay .construction-tabs [data-cat="vehicle"]{flex:0 0 auto;min-width:95px}#constructionOverlay .construction-card[data-transport-kind]{touch-action:manipulation;min-height:74px}';
 document.head.append(transportTabsCss);
 const tabWatch=setInterval(ensureTransportTab,750);
 window.addEventListener('pagehide',()=>clearInterval(tabWatch),{once:true});
 const payload=window.__FLORESTA_V228_CART_ASSETS||{};
 const registry={cart:null,wagon:null},siteMap=new Map();
 async function ungzip64(encoded){
   const binary=atob(encoded);const data=new Uint8Array(binary.length);
   for(let i=0;i<binary.length;i++)data[i]=binary.charCodeAt(i);
   if(typeof DecompressionStream!=='undefined')return await new Response(new Blob([data]).stream().pipeThrough(new DecompressionStream('gzip'))).arrayBuffer();
   if(typeof window.__FFLATE_GUNZIP_SYNC==='function'){const out=window.__FFLATE_GUNZIP_SYNC(data);return out.buffer.slice(out.byteOffset,out.byteOffset+out.byteLength);}
   throw Error('O navegador não suporta descompactação gzip e não tem fallback.');
 }
 async function getModel(kind){
   if(registry[kind])return registry[kind];
   const a=payload[visualModel[kind]];if(!a?.geometry||!a?.texture)throw Error('Faltam os dados do modelo '+kind);
   const bytes=await ungzip64(a.geometry),dv=new DataView(bytes);
   if(dv.getUint32(0,true)!==0x31484556)throw Error('Modelo inválido');
   const n=dv.getUint32(4,true),i=dv.getUint32(8,true),sz=12;
   if(n>500000||i>1800000||sz+n*20+i*4!==bytes.byteLength)throw Error('Tamanho do modelo inválido');
   const xyz=new Float32Array(bytes.slice(sz,sz+n*12));
   const uv=new Float32Array(bytes.slice(sz+n*12,sz+n*20));
   const inds=new Uint32Array(bytes.slice(sz+n*20));
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.BufferAttribute(xyz,3));
   geo.setAttribute('uv',new T.BufferAttribute(uv,2));geo.setIndex(new T.BufferAttribute(inds,1));geo.computeVertexNormals();
   geo.computeBoundingBox();geo.computeBoundingSphere();
   const box=geo.boundingBox;
   const cx=(box.min.x+box.max.x)/2, cz=(box.min.z+box.max.z)/2;
   geo.translate(-cx,-box.min.y,-cz); // assenta no chão e centraliza para não sumir ao girar/mover
   geo.computeBoundingBox();geo.computeBoundingSphere();
   const tex=await new Promise((resolve,reject)=>new T.TextureLoader().load('data:image/webp;base64,'+a.texture,resolve,undefined,reject));
   tex.flipY=true; if('colorSpace' in tex)tex.colorSpace=T.SRGBColorSpace; else if('encoding' in tex)tex.encoding=T.sRGBEncoding;
   tex.anisotropy=Math.min(4,G.renderer?.capabilities?.getMaxAnisotropy?.()||2);
   const material=new T.MeshStandardMaterial({map:tex,color:0xffffff,metalness:0,roughness:.93,side:T.DoubleSide});
   return registry[kind]={geometry:geo,material};
 }
 function ensureEntryRoots(entry){
   if(entry.visualRoot?.parent===entry.site.root && entry.cargoRoot?.parent===entry.site.root)return;
   entry.visualRoot?.removeFromParent?.();entry.cargoRoot?.removeFromParent?.();
   entry.visualRoot=new T.Group(); entry.visualRoot.name='V230_VisualRoot';
   entry.cargoRoot=new T.Group(); entry.cargoRoot.name='V230_CargoRoot';
   entry.visualRoot.position.set(0,0,0); entry.cargoRoot.position.set(0,0,0);
   entry.site.root.add(entry.visualRoot); entry.site.root.add(entry.cargoRoot);
 }
 function showOriginal(site){
   if(!site?.complete||!site.def.vehicleType)return;
   const type=site.def.vehicleType;
   if(siteMap.has(site))return;
   const entry={site,kind:type,cargo:[],used:0,model:null,ready:false,distance:specs[type].dist,visualRoot:null,cargoRoot:null};
   siteMap.set(site,entry); ensureEntryRoots(entry);
   getModel(type).then(asset=>{
     if(!site.root.parent)return;
     ensureEntryRoots(entry);
     const obj=new T.Mesh(asset.geometry,asset.material);
     obj.name='V230_'+type+'_MeshyTexturizado';obj.castShadow=!mobile;obj.receiveShadow=true;obj.frustumCulled=false;
     const scale=visualScale[type];obj.scale.setScalar(scale);
     const pose=modelPose[type]||modelPose.cart;
     obj.position.set(pose.x,pose.y,pose.z); obj.rotation.set(0,pose.ry||0,0);
     entry.visualRoot.clear(); entry.visualRoot.add(obj); entry.model=obj; entry.ready=true;
     // Esconde apenas as peças da obra física; pivôs e carga ficam independentes.
     for(const part of site.parts||[])part.visible=false;
     site.ghost?.removeFromParent?.();site.ghost=null;
     site.physicsBoxes=null;site.collisionVolumes=null;
     announce(`${specs[type].name} concluído. Aproxime-se para interagir.`);
   }).catch(e=>{
     console.warn('[V230] Modelo não carregou; mantendo a obra física.',e);
     for(const part of site.parts||[])part.visible=true;
     announce('O transporte foi montado, mas a textura 3D não carregou: '+e.message);
   });
 }
 function announce(message){const s=document.getElementById('status');if(s)s.textContent=message;}
 window.addEventListener('game:construction-complete',e=>{
   if(!String(e.detail?.id||'').startsWith('transport_'))return;
   const site=GC.sites.find(s=>s.def.id===e.detail.id&&s.complete&&!siteMap.has(s));
   if(site)showOriginal(site);
 });
 function areMenusOpen(){return !!(window.gameInventory?.isOpen||window.gameCraft?.active||
   window.gameHackMode?.state?.open||document.body.classList.contains('construction-open')||
   document.body.classList.contains('skills-open')||document.body.classList.contains('forge-open')||
   document.body.classList.contains('editor-open')||GC.active||window.gameCreativeSpiderMount?.mounted);}
 function distTo(e){return Math.hypot(player.x-e.site.root.position.x,player.z-e.site.root.position.z);} 
 function nearest(){let best=null,d=3.15;for(const e of siteMap.values()){const x=distTo(e);if(x<d){best=e;d=x;}}return best;}
 let active=null,last=performance.now(),nextUI=0,near=null,lastSiteCount=0;
 const panel=document.createElement('div');panel.id='florestaTransportV230';panel.innerHTML=`
   <div class="transport-head"><strong id="v230Title">Transporte</strong><span id="v230Load">0/0</span></div>
   <div class="transport-help" id="v230Help">Aproxime-se e interaja</div>
   <div class="transport-actions"><button type="button" data-act="move">Usar · T</button><button type="button" data-act="load">Carregar</button><button type="button" data-act="unload">Descarregar</button></div>`;
 const st=document.createElement('style');st.id='florestaTransportV230Styles';st.textContent=`
 #florestaTransportV230{position:fixed;left:14px;bottom:125px;width:min(345px,46vw);z-index:77;display:none;
  background:linear-gradient(155deg,#191b14ef,#2b2015ed);border:1px solid #aa875a;border-radius:11px;
  color:#e8d7b8;font:12px/1.35 system-ui,sans-serif;padding:10px 12px;box-shadow:0 5px 20px #0009;pointer-events:auto}
 #florestaTransportV230 .transport-head{display:flex;justify-content:space-between;gap:10px;color:#f2c88c}
 #florestaTransportV230 .transport-head strong{font-size:13px}
 #florestaTransportV230 .transport-help{font-size:11px;margin:6px 0 8px;color:#d1c1a7}
 #florestaTransportV230 .transport-actions{display:flex;gap:5px}
 #florestaTransportV230 button{flex:1;min-height:37px;padding:5px;border:1px solid #9f8052;border-radius:6px;color:#eed8b1;background:#4e3b29;font-weight:700;cursor:pointer}
 #florestaTransportV230 button:disabled{opacity:.45;cursor:default}
 @media(pointer:coarse),(max-width:700px){#florestaTransportV230{width:auto;left:12px;right:12px;bottom:116px;z-index:98;font-size:11px;padding:8px 10px}
 #florestaTransportV230 .transport-help{font-size:10px;margin:4px 0}#florestaTransportV230 button{min-height:42px;font-size:11px}}
 `;document.head.appendChild(st);document.body.appendChild(panel);
 const title=panel.querySelector('#v230Title'),loadLabel=panel.querySelector('#v230Load'),help=panel.querySelector('#v230Help');
 const btnMove=panel.querySelector('[data-act="move"]'),btnLoad=panel.querySelector('[data-act="load"]'),btnUnload=panel.querySelector('[data-act="unload"]');
 function units(e){return e.cargo.reduce((n,c)=>n+WEIGHT[c.kind],0);} 
 function free(e){return MAX[e.kind]-units(e);} 
 function interactionLabel(e){return e.kind==='cart'?'empurrar':'puxar';}
 // V246: carga puxada para a frente para eliminar o atravessamento na parte traseira do carrinho.
 // Troncos: 3 colunas x 3 camadas (9). Tábuas: 3 colunas x 6 camadas (18).
 // Cargas mistas ocupam as mesmas camadas: nenhuma peça atravessa outra.
 function cargoLayout(e,extra){
   if(e.kind!=='cart')return null;
   const kinds=e.cargo.map(c=>c.kind);if(extra)kinds.push(extra);
   const positions=Array(kinds.length);
   let floor=specs.cart.deck+.012;
   for(const kind of ['log','plank']){
     const indices=[];for(let i=0;i<kinds.length;i++)if(kinds[i]===kind)indices.push(i);
     const layerHeight=kind==='log'?.242:.112;
     const gap=.004;
     const spread=kind==='log'?.218:.248;
     for(let row=0;row<indices.length;row+=3){
       if(floor+layerHeight>specs.cart.high-.012+1e-6)return null;
       const count=Math.min(3,indices.length-row);
       for(let col=0;col<count;col++){
         const idx=indices[row+col];
         positions[idx]={x:(col-(count-1)/2)*spread,y:floor+layerHeight/2,z:kind==='log'?0.08:0.05};
       }
       floor+=layerHeight+gap;
     }
   }
   return positions;
 }
 function canFit(e,kind){return free(e)>=WEIGHT[kind]&&(e.kind!=='cart'||!!cargoLayout(e,kind));}
 function arrangeCargo(e){
   if(e.kind!=='cart')return;
   const positions=cargoLayout(e);
   if(!positions)return;
   for(let i=0;i<e.cargo.length;i++){
     const cargo=e.cargo[i],mesh=cargo.mesh,pos=positions[i];
     if(!mesh||!pos)continue;
     mesh.position.set(pos.x,pos.y,pos.z);
     mesh.rotation.set(cargo.kind==='log'?Math.PI/2:0,0,0);
   }
 }
 // Alterar a velocidade efetiva do motor, não apenas a velocidade do carrinho.
 // A configuração de marcha nativa é restaurada assim que o jogador solta o carrinho.
 const locomotionCfg=G.trueFirstPerson?.config||null;
 const normalSpeeds=locomotionCfg?{
   walkSpeed:Number(locomotionCfg.walkSpeed)||3,
   runSpeed:Number(locomotionCfg.runSpeed)||5.6,
   crouchSpeed:Number(locomotionCfg.crouchSpeed)||1.4
 }:null;
 let currentMoveFactor=1;
 function targetSpeedFactor(e){
   if(!e||e.kind!=='cart')return 1;
   const weightRatio=Math.max(0,Math.min(1,units(e)/MAX.cart));
   const occupied=e.cargo.reduce((n,c)=>n+(c.kind==='log'?1/9:1/18),0);
   const loadRatio=Math.max(weightRatio,Math.min(1,occupied));
   return Math.max(.46,1-.54*Math.pow(loadRatio,1.12));
 }
 function updatePushSpeed(dt){
   if(!locomotionCfg||!normalSpeeds)return;
   const target=targetSpeedFactor(active);
   if(!active)currentMoveFactor=1;
   else currentMoveFactor+=(target-currentMoveFactor)*Math.min(1,dt*9);
   if(Math.abs(target-currentMoveFactor)<.001)currentMoveFactor=target;
   for(const key of ['walkSpeed','runSpeed','crouchSpeed']){
     locomotionCfg[key]=normalSpeeds[key]*currentMoveFactor;
   }
 }
 function cargoText(e){
   if(e.kind!=='cart')return `Carga ${units(e)}/${MAX[e.kind]}`;
   const logs=e.cargo.filter(c=>c.kind==='log').length;
   const boards=e.cargo.length-logs;
   return `${logs} tronco${logs===1?'':'s'} · ${boards} tábua${boards===1?'':'s'} · Peso ${units(e)}/${MAX.cart}`;
 }
 function toggleMove(){
   const e=active||near||nearest();if(!e){announce('Aproxime-se de um transporte construído.');return false;}
   if(active){active=null;updatePushSpeed(1);announce('Transporte solto.');return true;}
   if(distTo(e)>3.3)return false;
   active=e; e.driverX=player.x; e.driverZ=player.z;
   if(e.kind==='cart'){player.bodyYaw=player.yaw;}
   announce(`${specs[e.kind].name}: ande para ${interactionLabel(e)}. T para soltar, Shift+T para carregar, Alt+T para descarregar.`);return true;
 }
 function nearbyGroundLog(){
   const logs=lumber.placedLogs||[];let winner=null,best=2.8;
   for(const mesh of logs){
     if(!mesh?.parent||mesh.userData?.constructionPart)continue;
     const p=mesh.getWorldPosition(new T.Vector3()),d=Math.hypot(player.x-p.x,player.z-p.z);
     if(d<best){best=d;winner=mesh;}
   }
   return winner;
 }
 function addCargo(){
   const e=active||near||nearest();if(!e||distTo(e)>3.5){announce('Chegue mais perto do transporte para carregar.');return false;}
   if(!canFit(e,'log')&&!canFit(e,'plank')){announce('Carrinho cheio até a borda ou no limite de peso. Descarregue primeiro.');return false;}
   ensureEntryRoots(e);
   const cheat=!!window.gameTestMode?.active||!!(window.gameHackMode?.enabled&&window.gameHackMode?.infinite);
   let kind=null,mesh=null,tree=null;
   if(lumber.carrying&&canFit(e,'log')){
     const v=lumber.releaseCarriedLog?.();
     if(v?.mesh){kind='log';mesh=v.mesh;tree=v.tree;window.gameLogPlacement?.cancel?.();}
   }
   if(!mesh&&!lumber.carrying&&canFit(e,'plank')){
     if(planks.count<=0&&planks.hasNearby?.())planks.pickupNearestStack?.();
     if(planks.count>0){
       const m=planks.createCargoPlank?.(e.kind==='cart'?1.65:2.35);
       if(m&&planks.consumeOne?.()){kind='plank';mesh=m;}else m?.geometry?.dispose?.();
     }
   }
   if(!mesh&&canFit(e,'log')&&!lumber.carrying){
     const log=nearbyGroundLog();
     if(log){
       const list=lumber.placedLogs||[],i=list.indexOf(log); if(i>=0)list.splice(i,1);
       tree=lumber.trees?.find?.(x=>x.index===log.userData?.sourceTreeIndex)||lumber.trees?.[0]||null;
       kind='log';mesh=log;mesh.userData.placedLog=false;
     }else if(!planks.count&&lumber.canPickupLog?.()&&lumber.pickupNearest?.()){
       const v=lumber.releaseCarriedLog?.();
       if(v?.mesh){kind='log';mesh=v.mesh;tree=v.tree;window.gameLogPlacement?.cancel?.();}
     }
   }
   if(!mesh&&cheat&&(canFit(e,'log')||canFit(e,'plank'))){
     kind=canFit(e,'log')?'log':'plank';
     mesh=kind==='log'?lumber.createCargoLog?.():planks.createCargoPlank?.(e.kind==='cart'?1.65:2.35);
     tree=lumber.trees?.[0]||null;
     if(!mesh&&kind==='log'&&canFit(e,'plank')){kind='plank';mesh=planks.createCargoPlank?.(2.0);}
   }
   if(!kind||!mesh){announce(lumber.carrying&&!canFit(e,'log')?'Carrinho sem espaço para outro tronco. Descarregue a carga ou leve tábuas.':(!canFit(e,'log')&&!canFit(e,'plank')?'Carrinho cheio até o topo.':'Sem madeira ao alcance. Pegue um tronco (Q) ou aproxime-se de uma pilha de tábuas.'));return false;}
   e.cargoRoot.attach(mesh); mesh.visible=true; mesh.userData.constructionPart=false;
   mesh.frustumCulled=false;
   mesh.rotation.set(kind==='log'?Math.PI/2:0,0,0);
   if(kind==='log'){
     const rawLength=Number(mesh.userData?.length||mesh.geometry?.parameters?.height||3.15);
     const rawRadius=Number(mesh.userData?.radius||mesh.geometry?.parameters?.radiusBottom||.22);
     const targetLen=e.kind==='cart'?1.14:3.12;
     const targetRadius=e.kind==='cart'?.116:.22;
     mesh.scale.set(targetRadius/Math.max(.08,rawRadius),targetLen/Math.max(.8,rawLength),targetRadius/Math.max(.08,rawRadius));
   }else mesh.scale.set(e.kind==='cart'?.46:1,e.kind==='cart'?.78:1,.82);
   const boardIndex=e.cargo.filter(c=>c.kind==='plank').length;
   const logIndex=e.cargo.filter(c=>c.kind==='log').length;
   const columns=e.kind==='cart'?2:3;
   if(e.kind!=='cart'){
     if(kind==='log')mesh.position.set((logIndex%columns-(columns-1)/2)*.52,specs[e.kind].deck+.13+Math.floor(logIndex/columns)*.25,-.02);
     else mesh.position.set((boardIndex%columns-(columns-1)/2)*.57,specs[e.kind].deck+.13+Math.floor(boardIndex/columns)*.16,0);
   }
   mesh.castShadow=!mobile;mesh.receiveShadow=true;
   e.cargo.push({kind,mesh,tree});
   arrangeCargo(e);
   announce(`${specs[e.kind].name}: ${cargoText(e)}.`);
   return true;
 }
 function removeCargo(){
   const e=active||near||nearest();if(!e||!e.cargo.length){announce('Não há carga para descarregar.');return false;}
   if(distTo(e)>3.5){announce('Aproxime-se do transporte.');return false;}
   const c=e.cargo[e.cargo.length-1];
   if(c.kind==='plank'){
     if(!planks.acceptCargoPlank?.()){
       const p=e.site.root.position;
       if(!planks.storeCargoPlank?.(p.x+1.3,p.z+1.3,e.site.root.rotation.y,c.mesh.userData?.length||2.3)){
         announce('Sem espaço no chão para devolver a tábua.');return false;
       }
     }
     c.mesh.removeFromParent();
   }else{
     c.mesh.scale.set(1,1,1);
     if(!lumber.acceptCargoLog?.(c.mesh,c.tree||lumber.trees?.[0])){
       if(!lumber.registerPlacedLog){announce('Não foi possível devolver o tronco.');return false;}
       const x=e.site.root.position.x+1.6,z=e.site.root.position.z+1.6;
       G.scene.attach(c.mesh);c.mesh.rotation.set(Math.PI/2,e.site.root.rotation.y,0);
       c.mesh.position.set(x,(G.groundY?.(x,z)||0)+Number(c.mesh.userData?.radius||.23),z);
       c.mesh.userData.placedLog=true;
       lumber.registerPlacedLog(c.mesh,c.tree||lumber.trees?.[0]);
     }
   }
   e.cargo.pop();arrangeCargo(e);announce(`${specs[e.kind].name}: ${cargoText(e)} restante.`);return true;
 }
 btnMove.onclick=toggleMove;btnLoad.onclick=addCargo;btnUnload.onclick=removeCargo;
 addEventListener('keydown',ev=>{
   if(ev.repeat||ev.ctrlKey||ev.metaKey||/INPUT|TEXTAREA|SELECT/.test(ev.target?.tagName||'')||areMenusOpen())return;
   if(ev.code!=='KeyT'||!(active||nearest()))return;
   ev.preventDefault();ev.stopImmediatePropagation();
   if(ev.altKey)removeCargo();else if(ev.shiftKey)addCargo();else toggleMove();
 },true);
 function blockCart(x,z,e){
   if(!Number.isFinite(x)||!Number.isFinite(z))return true;
   const r=e.kind==='cart'?.8:1.05;
   for(const c of G.colliders||[]){if(!Number.isFinite(c?.x)||!Number.isFinite(c?.z))continue; if(Math.hypot(c.x-x,c.z-z)<r+(c.r||.35))return true;}
   for(const other of siteMap.values())if(other!==e&&Math.hypot(other.site.root.position.x-x,other.site.root.position.z-z)<r+1.10)return true;
   const alt=G.groundY?.(x,z);return !Number.isFinite(alt);
 }
 function move(dt){
   if(!active)return; if(areMenusOpen())return;
   const e=active,site=e.site,cfg=specs[e.kind],yaw=player.yaw||0;
   // Como numa montaria: orientação do corpo acompanha a câmera enquanto empurra.
   if(e.kind==='cart') player.bodyYaw=yaw;
   // O movimento W equivale ao vetor -sin(yaw), -cos(yaw) neste motor.
   // Empurrar fica na frente real, sem mover a carroca para o lado errado.
   const sign=cfg.mode==='push'?-1:1;
   const dx=Math.sin(yaw)*cfg.dist*sign,dz=Math.cos(yaw)*cfg.dist*sign;
   const desiredX=player.x+dx,desiredZ=player.z+dz;
   const followRate=e.kind==='cart'?7.2:5.7;
   const newX=e.kind==='cart'?desiredX:site.root.position.x+(desiredX-site.root.position.x)*Math.min(1,dt*followRate);
   const newZ=e.kind==='cart'?desiredZ:site.root.position.z+(desiredZ-site.root.position.z)*Math.min(1,dt*followRate);
   if(!blockCart(newX,newZ,e)){
     const previous=site.root.position.clone();
     site.root.position.x=newX;site.root.position.z=newZ;
     const ground=G.groundY?.(newX,newZ); site.root.position.y=Number.isFinite(ground)?ground+.01:site.root.position.y;
     const facing=cfg.mode==='push'?yaw+Math.PI:yaw;
     const delta=Math.atan2(Math.sin(facing-site.root.rotation.y),Math.cos(facing-site.root.rotation.y));
     const turnRate=e.kind==='cart'?8.5:4.5;
     site.root.rotation.y+=delta*(e.kind==='cart'?1:Math.min(1,dt*turnRate));
     if(e.model){e.model.rotation.z=Math.sin(performance.now()*.006)*Math.min(.016,previous.distanceTo(site.root.position)*.05); e.model.visible=true;}
     site.physicsBoxes=null;
     e.driverX=player.x;e.driverZ=player.z;
   }else if(e.kind==='cart'&&Number.isFinite(e.driverX)&&Number.isFinite(e.driverZ)){
     player.x=e.driverX;player.z=e.driverZ;
   }
   if(distTo(e)>cfg.dist+2.35){active=null;announce('O engate se soltou: afaste-se menos do transporte.');}
 }
 function updateUI(now){
   if(now<nextUI)return; nextUI=now+130;
   const busy=areMenusOpen(); near=active||nearest(); panel.style.display=near&&!busy?'block':'none';
   if(!near||busy)return;
   const n=near;
   title.textContent=specs[n.kind].name; loadLabel.textContent=cargoText(n);
   const verb=interactionLabel(n);
   help.textContent=active===n&&n.kind==='cart'?`ENGATADO • ritmo ${Math.round(targetSpeedFactor(n)*100)}% · T solta · Shift+T carrega · Alt+T descarrega`:active===n?`ENGATADO • T solta · Shift+T carrega · Alt+T descarrega`:`T ${verb} · Shift+T carregar · Alt+T descarregar · Y mantém a poção`;
   btnMove.textContent=active===n?'Soltar · T':`${verb[0].toUpperCase()+verb.slice(1)} · T`;
   btnLoad.disabled=!canFit(n,'log')&&!canFit(n,'plank'); btnUnload.disabled=n.cargo.length===0;
 }
 function loop(now){requestAnimationFrame(loop); const dt=Math.min(.06,Math.max(0,(now-last)/1000));last=now;
   if(GC.sites.length!==lastSiteCount){lastSiteCount=GC.sites.length;for(const site of GC.sites)if(site.complete&&site.def?.vehicleType)showOriginal(site);} updatePushSpeed(dt);move(dt);updateUI(now);
 }
 requestAnimationFrame(loop);
 window.gameTransport={version:'V243',vehicles:siteMap,get active(){return active},get nearby(){return near},get capacities(){return MAX},get speedFactor(){return targetSpeedFactor(active)},load:addCargo,unload:removeCargo,toggleMove,
    get count(){return siteMap.size}};
 console.info('[V243] Carrinho: carga física até a borda, troncos e tábuas misturados, velocidade por peso.');
})().catch(e=>console.error('[V230] Transporte:',e));
