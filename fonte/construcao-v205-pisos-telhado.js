
(async()=>{
  if(window.__V143_CONSTRUCTION_TAB__)return;
  window.__V143_CONSTRUCTION_TAB__=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1600;i++){
    if(window.gameReview?.scene&&window.gameReview?.camera&&window.gameReview?.player&&window.gameLumber&&window.gamePlankCarry&&window.__THREE_MODULE)break;
    await sleep(20);
  }

  const game=window.gameReview,T=window.__THREE_MODULE,lumber=window.gameLumber,planks=window.gamePlankCarry,inv=window.gameInventory;
  if(!game?.scene||!game?.camera||!game?.player||!lumber||!planks||!T)return;
  const scene=game.scene,cam=game.camera,player=game.player,canvas=game.renderer?.domElement||document.getElementById('c');
  const mobile=!!window.__FOREST_MOBILE_BUILD__||matchMedia('(pointer:coarse)').matches;
  const status=document.getElementById('status'),hint=document.getElementById('hint');
  if(hint&&!hint.textContent.includes('B construção'))hint.textContent+=' • B construção';

  const root=new T.Group();root.name='V143_ConstructionSystem';scene.add(root);
  const sites=[],completedFloors=[],completedStairs=[];
  // V203: os colisores das construções agora têm altura; não entram nos colisores 2D globais.
  const GRID=3.2,STOREY=3.1;
  // V198: arestas compartilhadas e dimensões reais de cada peça de madeira.
  const JOIN=.035, WALL_LOG_RADIUS=.255, WALL_LOG_PITCH=.43, FLOOR_LOG_RADIUS=GRID/10+.035;
  const NATIVE_PLANK_WIDTH=.56,NATIVE_PLANK_THICKNESS=.14;
  let buildLevel=0;
  let selected=null,positioning=false,rotation=0,ghost=null,target=null,valid=false,reason='',focused=null,pending=null,last=performance.now(),lastFocusScan=0;
  let supportPrev=false,supportNow=false,leftSupport=false;

  const UP=new T.Vector3(0,1,0),X=new T.Vector3(1,0,0),Z=new T.Vector3(0,0,1),dir=new T.Vector3(),tmp=new T.Vector3(),box=new T.Box3();
  const woodSide=new T.MeshStandardMaterial({color:0x6f4528,roughness:.96,flatShading:true});
  const woodTop=new T.MeshStandardMaterial({color:0xb17a48,roughness:.91,flatShading:true});
  const logMat=new T.MeshStandardMaterial({color:0x5b3c26,roughness:.98,flatShading:true});
  const ghostGood=new T.MeshBasicMaterial({color:0x72dfa0,transparent:true,opacity:.22,depthWrite:false});
  const ghostBad=new T.MeshBasicMaterial({color:0xff5b55,transparent:true,opacity:.22,depthWrite:false});

  function plankMesh(len=3.2){
    const m=new T.Mesh(new T.BoxGeometry(NATIVE_PLANK_WIDTH,NATIVE_PLANK_THICKNESS,len),[woodSide,woodSide,woodTop,woodTop,woodSide,woodSide]);
    m.castShadow=!mobile;m.receiveShadow=true;return m;
  }
  function logGhostMesh(len=3.2,r=.22,mat=ghostGood){
    const m=new T.Mesh(new T.CylinderGeometry(r,r,len,18,1,false),mat);m.castShadow=false;m.receiveShadow=false;return m;
  }
  function plankGhostMesh(len=3.2,mat=ghostGood){const m=new T.Mesh(new T.BoxGeometry(NATIVE_PLANK_WIDTH,NATIVE_PLANK_THICKNESS,len),mat);return m;}

  const qHorizontal=new T.Quaternion().setFromUnitVectors(UP,Z);
  const qVertical=new T.Quaternion();
  const qBoardVertical=new T.Quaternion().setFromEuler(new T.Euler(Math.PI/2,0,0));
  const qAlongX=new T.Quaternion().setFromUnitVectors(UP,X);
  const qPlankX=new T.Quaternion().setFromUnitVectors(Z,X);
  // Orients long dimension horizontally (X), width vertically (Y), thickness to wall depth (Z).
  const qWideX=new T.Quaternion().setFromRotationMatrix(new T.Matrix4().makeBasis(
    new T.Vector3(0,1,0),new T.Vector3(0,0,1),new T.Vector3(1,0,0)));
  const stairLength=Math.hypot(2.6,2.5)+.5;
  const qStringer=new T.Quaternion().setFromUnitVectors(Z,new T.Vector3(0,2.5,2.6).normalize());
  const qRoofSteep=new T.Quaternion().setFromEuler(new T.Euler(-.49,0,0));
  const qRoof=new T.Quaternion().setFromEuler(new T.Euler(-.18,0,0));
  const rockMat=new T.MeshStandardMaterial({color:0x898780,roughness:1,flatShading:true});
  const twigMat=new T.MeshStandardMaterial({color:0x785135,roughness:1});
  const vineMat=new T.MeshStandardMaterial({color:0x526543,roughness:1});
  const DEF={
    floor_log:{id:'floor_log',category:'floor',name:'Chão de tronco',resource:'log',total:5,desc:'5 troncos • um por vez',foot:[GRID,GRID],height:2*FLOOR_LOG_RADIUS,slots:Array.from({length:5},(_,i)=>({kind:'log',pos:new T.Vector3((i-2)*(GRID/5),FLOOR_LOG_RADIUS,0),quat:qHorizontal.clone(),len:GRID+JOIN,radius:FLOOR_LOG_RADIUS}))},
    floor_plank:{id:'floor_plank',category:'floor',name:'Chão de tábua',resource:'plank',total:7,desc:'7 tábuas • uma por vez',foot:[GRID,GRID],height:NATIVE_PLANK_THICKNESS,slots:Array.from({length:7},(_,i)=>({kind:'plank',pos:new T.Vector3((i-3)*(GRID/7),NATIVE_PLANK_THICKNESS/2,0),quat:new T.Quaternion(),len:GRID+JOIN}))},
    pillar_log:{id:'pillar_log',category:'pillar',name:'Pilar de tronco',resource:'log',total:1,desc:'1 tronco vertical',foot:[1.0,1.0],height:STOREY,slots:[{kind:'log',pos:new T.Vector3(0,STOREY/2,0),quat:qVertical.clone(),len:STOREY,radius:WALL_LOG_RADIUS}]},
    pillar_plank:{id:'pillar_plank',category:'pillar',name:'Pilar de tábua',resource:'plank',total:4,desc:'4 tábuas • uma por vez',foot:[.92,.92],height:3.15,slots:[
      {kind:'plank',pos:new T.Vector3(-.18,1.55,-.18),quat:qBoardVertical.clone(),len:3.1},
      {kind:'plank',pos:new T.Vector3(.18,1.55,-.18),quat:qBoardVertical.clone(),len:3.1},
      {kind:'plank',pos:new T.Vector3(-.18,1.55,.18),quat:qBoardVertical.clone(),len:3.1},
      {kind:'plank',pos:new T.Vector3(.18,1.55,.18),quat:qBoardVertical.clone(),len:3.1}
    ]}
  };
  // V197: Peças compatíveis com os recursos da V196, sem criar moeda ou inventário paralelo.
  function slot(kind,x,y,z,len=3.05,q=null){return {kind,pos:new T.Vector3(x,y,z),quat:q?.clone()||new T.Quaternion(),len};}
  const wallLogSlots=Array.from({length:7},(_,i)=>({...slot('log',0,WALL_LOG_RADIUS+i*WALL_LOG_PITCH,0,GRID+JOIN,qAlongX),radius:WALL_LOG_RADIUS}));
  const wallPlankSlots=Array.from({length:7},(_,i)=>slot('plank',(i-3)*(GRID/7),STOREY/2,0,STOREY+.01,qBoardVertical));
  const doorSlots=[-1.33,-.89,.89,1.33].map(x=>slot('plank',x,1.52,0,3.04,qBoardVertical))
    .concat([slot('plank',0,2.85,0,1.58,qPlankX),slot('plank',0,2.99,0,1.58,qPlankX)]);
  // Abertura vazada: 4 tábuas laterais + 2 sob o peitoril + 2 no topo.
  // Sem ripa vertical atravessando o vão e sem preencher com malha invisível.
  const windowSlots=[-1.35,-.91,.91,1.35].map(x=>slot('plank',x,1.55,0,3.1,qBoardVertical))
    .concat([.28,.83,2.38,2.93].map(y=>slot('plank',0,y,0,1.30,qWideX)));
  const windowWideSlots=[-1.35,-.91,.91,1.35].map(x=>slot('plank',x,1.55,0,3.10,qBoardVertical))
    .concat([.28,2.93].map(y=>slot('plank',0,y,0,1.30,qWideX)));

  // 6 degraus realmente planos: 1 tábua em cada piso + 2 vigas inclinadas.
  // Alturas dos topos 0.55, 1.05, 1.55, 2.05, 2.55, 3.05 m.
  const stairSlots=[...Array.from({length:6},(_,i)=>slot('plank',0,.48+i*.50,-1.30+i*.52,1.57,qPlankX)),
    slot('plank',-.72,1.54,0,stairLength,qStringer),
    slot('plank', .72,1.54,0,stairLength,qStringer)];
  const stairWideSlots=[...Array.from({length:6},(_,i)=>[-.80,.80].map(x=>slot('plank',x,.48+i*.50,-1.30+i*.52,1.58,qPlankX))).flat(),
    slot('plank',-1.49,1.54,0,stairLength,qStringer),
    slot('plank', 1.49,1.54,0,stairLength,qStringer)];
  const wattleSlots=Array.from({length:7},(_,i)=>slot('branch',(i-3)*.46,1.49,0,3.0))
    .concat([.50,1.45,2.42].map(y=>slot('vine',0,y,0,3.03,qAlongX)));
  Object.assign(DEF,{
    floor_stone:{id:'floor_stone',category:'floor',name:'Piso de pedra',resource:'rock',total:9,desc:'9 pedras coletadas no inventário',foot:[3.15,3.15],height:.24,
      slots:Array.from({length:9},(_,i)=>slot('rock',(i%3-1)*1.04,.12,(Math.floor(i/3)-1)*1.04,1.0))},
    wall_log:{id:'wall_log',category:'wall',name:'Parede de troncos',resource:'log',total:wallLogSlots.length,desc:'7 troncos inteiros • montados horizontalmente',foot:[GRID,.51],height:2*WALL_LOG_RADIUS+6*WALL_LOG_PITCH,slots:wallLogSlots},
    wall_plank:{id:'wall_plank',category:'wall',name:'Parede de tábuas',resource:'plank',total:wallPlankSlots.length,desc:'7 tábuas do ombro • lado a lado',foot:[GRID,NATIVE_PLANK_THICKNESS],height:STOREY,slots:wallPlankSlots},
    wall_wattle:{id:'wall_wattle',category:'wall',name:'Parede de galhos e cipó',resource:'branch',total:wattleSlots.length,desc:'7 galhos e 3 cipós do inventário',foot:[GRID,.16],height:3.0,slots:wattleSlots},
    wall_door:{id:'wall_door',category:'wall',name:'Parede com porta',resource:'plank',total:doorSlots.length,desc:'6 tábuas • passagem central livre',foot:[GRID,NATIVE_PLANK_THICKNESS],height:3.1,slots:doorSlots},
    wall_window:{id:'wall_window',category:'wall',name:'Parede com janela',resource:'plank',total:windowSlots.length,desc:'8 tábuas • janela com vão livre e peitoril',foot:[GRID,NATIVE_PLANK_THICKNESS],height:3.1,slots:windowSlots},
    wall_window_wide:{id:'wall_window_wide',category:'wall',name:'Janela panorâmica',resource:'plank',total:windowWideSlots.length,desc:'6 tábuas • abertura alta e vazada',foot:[GRID,NATIVE_PLANK_THICKNESS],height:STOREY,slots:windowWideSlots},
    roof_plank:{id:'roof_plank',category:'roof',name:'Telhado de tábuas',resource:'plank',total:7,desc:'7 tábuas • teto levemente inclinado',foot:[3.15,3.15],height:.75,
      slots:Array.from({length:7},(_,i)=>slot('plank',(i-3)*.45,.39,0,3.25,qRoof))},
    stair_plank:{id:'stair_plank',category:'stairs',name:'Escada de tábuas',resource:'plank',total:stairSlots.length,desc:'8 tábuas • 6 degraus planos + apoios laterais',foot:[1.6,3.25],height:STOREY,slots:stairSlots},
    stair_wide:{id:'stair_wide',category:'stairs',name:'Escada larga',resource:'plank',total:stairWideSlots.length,desc:'14 tábuas • largura dupla, 6 degraus',foot:[3.2,3.25],height:STOREY,slots:stairWideSlots}
  });
  // Peças modulares adicionais, inspiradas na flexibilidade de bases de sobrevivência.
  const halfWall=[.27,.82].map(y=>slot('plank',0,y,0,GRID+.035,qWideX));
  const gableWall=[.70,1.15,1.60,2.05,2.50].map((x,i)=>{
    const width=[.65,1.60,2.60,1.60,.65][i];
    return slot('plank',x-1.60,width/2,0,width,qBoardVertical);
  });
  const fenceSlots=[-1.28,-.64,0,.64,1.28].map(x=>slot('branch',x,.75,0,1.50))
    .concat([.48,1.07].map(y=>slot('vine',0,y,0,GRID+.06,qAlongX)));
  Object.assign(DEF,{
    floor_bridge:{id:'floor_bridge',category:'floor',name:'Passarela estreita',resource:'plank',total:4,
      desc:'4 tábuas • corredor de madeira para pontes',foot:[2.05,GRID],height:NATIVE_PLANK_THICKNESS,
      slots:[-.72,-.24,.24,.72].map(x=>slot('plank',x,NATIVE_PLANK_THICKNESS/2,0,GRID+.035))},
    floor_foundation:{id:'floor_foundation',category:'floor',name:'Fundação elevada',resource:'log',total:9,
      desc:'3 troncos e 6 tábuas • base elevada',foot:[GRID,GRID],height:.82,
      slots:[-1.12,0,1.12].map(x=>({...slot('log',x,.33,0,GRID+.035,qHorizontal),radius:.30}))
        .concat(Array.from({length:6},(_,i)=>slot('plank',(i-2.5)*(GRID/6),.75,0,GRID+.055)))},
    wall_half:{id:'wall_half',category:'wall',name:'Meia-parede de tábuas',resource:'plank',total:halfWall.length,
      desc:'2 tábuas • proteção na altura da cintura',foot:[GRID,NATIVE_PLANK_THICKNESS],height:1.15,slots:halfWall},
    wall_gable:{id:'wall_gable',category:'wall',name:'Parede triangular',resource:'plank',total:gableWall.length,
      desc:'5 tábuas • acabamento abaixo do telhado',foot:[GRID,NATIVE_PLANK_THICKNESS],height:2.60,slots:gableWall},
    wall_fence:{id:'wall_fence',category:'wall',name:'Cerca de galhos',resource:'branch',total:fenceSlots.length,
      desc:'5 galhos + 2 cipós • fechamento do terreno',foot:[GRID,.16],height:1.50,slots:fenceSlots},
    roof_steep:{id:'roof_steep',category:'roof',name:'Telhado inclinado',resource:'plank',total:7,
      desc:'7 tábuas • inclinação acentuada e beiral',foot:[GRID,GRID],height:1.90,
      slots:Array.from({length:7},(_,i)=>slot('plank',(i-3)*.46,.96,0,3.65,qRoofSteep))},
    roof_flat:{id:'roof_flat',category:'roof',name:'Cobertura plana',resource:'plank',total:7,
      desc:'7 tábuas • teto reto para base modular',foot:[GRID,GRID],height:.14,
      slots:Array.from({length:7},(_,i)=>slot('plank',(i-3)*(GRID/7),.07,0,GRID+.035))},
    pillar_stone:{id:'pillar_stone',category:'pillar',name:'Coluna de pedra',resource:'rock',total:12,
      desc:'12 pedras • pilar reforçado de 3 metros',foot:[.97,.97],height:3.05,
      slots:Array.from({length:12},(_,i)=>slot('rock',0,.13+i*.25,0,.96))}
  });
  // Identificadores utilizados pelos testes de geometria / caminhada.
  const STAIR_STEP_Z=[-1.30,-.78,-.26,.26,.78,1.30];
  const STAIR_STEP_TOP=[.55,1.05,1.55,2.05,2.55,3.05];

  function pieceMat(kind){return kind==='rock'?rockMat:kind==='branch'?twigMat:vineMat;}
  function pieceMesh(kind,len){
    if(kind==='rock'){const m=new T.Mesh(new T.BoxGeometry(1.08,.22,1.08),rockMat);m.castShadow=!mobile;m.receiveShadow=true;return m;}
    if(kind==='branch'||kind==='vine'){
      const m=new T.Mesh(new T.CylinderGeometry(kind==='vine'?.027:.055,kind==='vine'?.027:.08,len,6),pieceMat(kind));m.castShadow=!mobile;return m;
    }
    return plankMesh(len);
  }
  function ghostPiece(part){
    let m=part.kind==='log'?logGhostMesh(part.len,part.radius||WALL_LOG_RADIUS,ghostGood):part.kind==='plank'?plankGhostMesh(part.len,ghostGood):pieceMesh(part.kind,part.len);
    m.material=ghostGood;m.castShadow=false;m.receiveShadow=false;return m;
  }

  // ---------- UI: real Construction tab -----------------------------------
  const style=document.createElement('style');
  style.textContent=`
  #constructionBtn{pointer-events:auto;position:absolute;right:18px;top:268px;z-index:33;border:1px solid rgba(180,132,75,.48);background:rgba(39,26,14,.91);color:#f2d2a5;border-radius:10px;padding:10px 13px;cursor:pointer;font:700 12px Inter,system-ui,sans-serif;box-shadow:0 7px 22px rgba(0,0,0,.18)}
  #skillTreeBtn{top:318px!important}#timeTestPanel{top:368px!important}
  #constructionOverlay{position:fixed;inset:0;z-index:103;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(0,0,0,.58);backdrop-filter:blur(7px);color:#f5f1e7}
  #constructionOverlay.open{display:flex}.construction-panel{width:min(760px,calc(100vw - 34px));max-height:calc(100vh - 34px);overflow:auto;border:1px solid rgba(255,255,255,.14);border-radius:16px;background:linear-gradient(180deg,rgba(27,25,21,.98),rgba(11,12,11,.98));box-shadow:0 24px 70px rgba(0,0,0,.52)}
  .construction-head{display:flex;align-items:center;justify-content:space-between;padding:18px 20px;border-bottom:1px solid rgba(255,255,255,.10)}.construction-head h2{margin:0;font:800 22px Inter,system-ui}.construction-kicker{font:800 9px Inter,system-ui;letter-spacing:.14em;color:#ba8f5c;margin-bottom:5px}.construction-close{border:1px solid rgba(255,255,255,.14);background:#171717;color:#fff;border-radius:9px;width:38px;height:38px;cursor:pointer}
  .construction-tabs{display:flex;gap:8px;padding:14px 18px 0}.construction-tab{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);color:#ddd;padding:9px 14px;border-radius:9px;cursor:pointer;font-weight:800}.construction-tab.active{border-color:#b78b55;background:rgba(122,82,42,.28);color:#f2d3a5}
  .construction-tabs{flex-wrap:wrap}#constructionLevels{display:flex;gap:8px;align-items:center;justify-content:center;padding:0 16px 12px;color:#e9d2ad;font:700 12px system-ui}#constructionLevels button{background:#473120;color:#ffe9bb;border:1px solid #97714a;border-radius:7px;padding:7px 13px;cursor:pointer}#constructionLevels button:disabled{opacity:.4}#constructionLevels button{pointer-events:auto}
  .construction-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:12px;padding:16px 18px 20px}.construction-card{border:1px solid rgba(255,255,255,.12);background:rgba(255,255,255,.045);border-radius:13px;padding:16px;text-align:left;color:#fff;cursor:pointer}.construction-card:hover{border-color:rgba(194,145,83,.65);background:rgba(112,76,40,.16)}.construction-card strong{display:block;font-size:16px;color:#f0d0a5;margin-bottom:5px}.construction-card span{display:block;font-size:11px;color:#aba69f;line-height:1.5}.construction-card .resource{color:#c9b07d;margin-top:8px;font-weight:700}
  #constructionHUD{position:fixed;left:50%;bottom:138px;transform:translateX(-50%);z-index:72;min-width:min(480px,82vw);padding:11px 15px;border:1px solid rgba(190,145,83,.52);border-radius:11px;background:rgba(15,13,11,.88);color:#fff;text-align:center;font:12px Inter,system-ui;pointer-events:none;display:none}#constructionHUD strong{display:block;color:#f0cf9e;margin-bottom:4px}
  #constructionAction{position:fixed;right:18px;bottom:188px;z-index:73;padding:14px 16px;border:1px solid rgba(190,145,83,.62);border-radius:12px;background:rgba(63,43,23,.94);color:#fff;font:800 12px Inter,system-ui;display:none}#constructionCancel{position:fixed;left:18px;bottom:188px;z-index:73;padding:11px 14px;border:1px solid rgba(255,255,255,.2);border-radius:10px;background:rgba(20,20,20,.9);color:#fff;font-weight:700;display:none}
  @media(pointer:coarse),(max-width:800px){#constructionBtn{position:fixed;right:12px;top:282px;padding:10px 11px;font-size:11px}#constructionOverlay{padding:8px}.construction-panel{width:calc(100vw - 16px);max-height:calc(100dvh - 16px)}.construction-grid{grid-template-columns:1fr}.construction-head{padding:14px}.construction-head h2{font-size:18px}#constructionHUD{bottom:244px;min-width:70vw;font-size:10px}#constructionAction{bottom:186px;right:12px}#constructionCancel{bottom:186px;left:12px}}
  `;
  document.head.appendChild(style);

  const buildBtn=document.createElement('button');buildBtn.id='constructionBtn';buildBtn.type='button';buildBtn.textContent='Construção (B)';document.getElementById('hud')?.appendChild(buildBtn);
  const overlay=document.createElement('div');overlay.id='constructionOverlay';overlay.innerHTML=`<div class="construction-panel"><div class="construction-head"><div><div class="construction-kicker">CONSTRUÇÃO MODULAR • V202</div><h2>Construção</h2></div><button class="construction-close" type="button">✕</button></div><div class="construction-tabs"><button class="construction-tab active" data-cat="floor">Chão</button><button class="construction-tab" data-cat="pillar">Pilar</button><button class="construction-tab" data-cat="wall">Paredes</button><button class="construction-tab" data-cat="roof">Telhado</button><button class="construction-tab" data-cat="stairs">Escada</button></div><div class="construction-grid"></div></div>`;document.body.appendChild(overlay);
  const grid=overlay.querySelector('.construction-grid');
  const levels=document.createElement('div');levels.id='constructionLevels';levels.innerHTML='<button type="button" data-level="down">Andar −</button><span id="constructionLevelValue">Térreo</span><button type="button" data-level="up">Andar +</button><button type="button" data-level="zero">TÉRREO</button>';
  const levelMobile=levels.cloneNode(true);levelMobile.id='constructionMobileLevels';
  overlay.querySelector('.construction-panel').insertBefore(levels,grid);
  const mobileLevelStyle=document.createElement('style');mobileLevelStyle.textContent='#constructionMobileLevels{position:fixed;left:50%;bottom:65px;transform:translateX(-50%);z-index:76;display:none;gap:6px;align-items:center;color:#fff;background:#191510e8;padding:6px;border:1px solid #77522d;border-radius:9px;font:700 11px system-ui}#constructionMobileLevels button{background:#503821;color:#fff;border:1px solid #ad8750;border-radius:6px;padding:9px}';document.head.appendChild(mobileLevelStyle);document.body.appendChild(levelMobile);
  function setLevel(n){buildLevel=Math.min(2,Math.max(0,n));[levels,levelMobile].forEach(el=>{el.querySelector('span').textContent=buildLevel===0?'Térreo':`Andar ${buildLevel+1}`;el.querySelector('[data-level="down"]').disabled=buildLevel===0;el.querySelector('[data-level="up"]').disabled=buildLevel===2;el.querySelector('[data-level="zero"]').disabled=buildLevel===0;});}
  [levels,levelMobile].forEach(el=>{el.querySelector('[data-level="down"]').onclick=()=>setLevel(buildLevel-1);el.querySelector('[data-level="up"]').onclick=()=>setLevel(buildLevel+1);el.querySelector('[data-level="zero"]').onclick=()=>setLevel(0);});setLevel(0);
  const closeBtn=overlay.querySelector('.construction-close');
  const hud=document.createElement('div');hud.id='constructionHUD';document.body.appendChild(hud);
  const action=document.createElement('button');action.id='constructionAction';action.type='button';action.textContent='Colocar peça';document.body.appendChild(action);
  const cancel=document.createElement('button');cancel.id='constructionCancel';cancel.type='button';cancel.textContent='Cancelar';document.body.appendChild(cancel);
  const cycleBtn=document.createElement('button');cycleBtn.id='constructionSnapCycle';cycleBtn.type='button';cycleBtn.textContent='Outro encaixe · E';cycleBtn.style.cssText='position:fixed;right:18px;bottom:248px;z-index:73;padding:9px 12px;border:1px solid #a98b63;border-radius:10px;color:#fff;background:#30251d;display:none;font-weight:700';document.body.appendChild(cycleBtn);cycleBtn.onclick=()=>{snapCycle++};

  function resourceLabel(def){return def.slots.map(s=>s.kind).filter((s,i,a)=>a.indexOf(s)===i).map(k=>({log:'Troncos do ombro',plank:'Tábuas do ombro',rock:'Pedras do inventário',branch:'Galhos do inventário',vine:'Cipós do inventário'})[k]||k).join(' + ');}
  function renderCards(cat='floor'){
    grid.textContent='';
    for(const def of Object.values(DEF).filter(d=>d.category===cat)){
      const b=document.createElement('button');b.type='button';b.className='construction-card';b.innerHTML=`<strong>${def.name}</strong><span>${def.desc}</span><span class="resource">${resourceLabel(def)}</span>`;b.onclick=()=>selectBlueprint(def.id);grid.appendChild(b);
    }
  }
  renderCards();
  overlay.querySelectorAll('.construction-tab').forEach(tab=>tab.onclick=()=>{overlay.querySelectorAll('.construction-tab').forEach(x=>x.classList.toggle('active',x===tab));renderCards(tab.dataset.cat)});
  function openMenu(){if(pending)return;if(!positioning)setLevel(0);overlay.classList.add('open');document.body.classList.add('construction-open');document.exitPointerLock?.();}
  function closeMenu(){overlay.classList.remove('open');document.body.classList.remove('construction-open');}
  buildBtn.onclick=()=>overlay.classList.contains('open')?closeMenu():openMenu();closeBtn.onclick=closeMenu;overlay.addEventListener('pointerdown',e=>{if(e.target===overlay)closeMenu()});

  // ---------- Ghost / blueprint -------------------------------------------
  function clearGhost(){ghost?.removeFromParent?.();ghost=null;}
  function makeGhost(def){
    clearGhost();const g=new T.Group();g.name='Construction_Blueprint';
    for(const s of def.slots){const m=ghostPiece(s);m.position.copy(s.pos);m.quaternion.copy(s.quat);g.add(m)}
    scene.add(g);ghost=g;return g;
  }
  function recolorGhost(ok){if(!ghost)return;ghost.traverse(o=>{if(o.isMesh)o.material=ok?ghostGood:ghostBad})}
  function selectBlueprint(id){
    const def=DEF[id];if(!def)return;selected=def;positioning=true;rotation=0;snapCycle=0;focused=null;closeMenu();window.gameFurnace?.cancel?.();window.gameLogPlacement?.cancel?.();makeGhost(def);updateButtons();
    if(status)status.textContent=`${def.name} selecionado • posicione a estrutura • R gira • F/clique inicia`;
  }
  function cancelPlacement(){positioning=false;selected=null;clearGhost();snapMarker.visible=false;snapCycle=0;setLevel(0);updateButtons();}

  // Alinhamento modular: pisos nas células, paredes nas bordas e pilares nos cantos.
  function wallThickness(def){
    if(def?.id==='wall_log')return 2*WALL_LOG_RADIUS;
    if(def?.id==='wall_wattle')return .16;
    return NATIVE_PLANK_THICKNESS;
  }
  // Liga uma parede à aresta do piso real (não apenas ao centro da grade).
  // A face EXTERNA da parede termina exatamente onde termina o piso.
  function adjacentFloor(edgeX,edgeZ,yaw,level){
    const nx=Math.sin(yaw),nz=Math.cos(yaw),tx=Math.cos(yaw),tz=-Math.sin(yaw);
    let closest=null,best=Infinity;
    for(const floor of completedFloors){
      if(floor.level!==level)continue;
      const dx=floor.root.position.x-edgeX,dz=floor.root.position.z-edgeZ;
      const along=dx*tx+dz*tz,depth=dx*nx+dz*nz;
      if(Math.abs(along)>.45||Math.abs(Math.abs(depth)-GRID/2)>.48)continue;
      const score=Math.abs(along)+Math.abs(Math.abs(depth)-GRID/2);
      if(score<best){closest=floor;best=score;}
    }
    return closest;
  }
  // V204: pontos de encaixe derivados de peças existentes (Valheim/Grounded).
  // Um piso define arestas/cantos e COTA; vizinhos herdam a mesma altura.
  // Nenhuma malha de prévia é considerada uma peça construída.
  function candidatesForSnap(px,pz,userYaw){
    if(!selected||!sites.length)return [];
    const list=[],kind=selected.category,halfWall=wallThickness(selected)*.5;
    const pose=(x,z,y,yaw,source,extra={})=>{
      if(![x,z,y,yaw].every(Number.isFinite))return;
      const distance=Math.hypot(px-x,pz-z);
      const maxDist=kind==='wall'?1.76:kind==='pillar'?1.72:kind==='stairs'?2.0:kind==='roof'?2.75:2.30;
      if(distance>maxDist)return;
      // Objetos já ocupados não devem atrair a prévia e ocultar encaixes livres.
      const t={x,z,y,yaw,level:buildLevel,snapY:y,snapSource:source,
        edgeX:extra.edgeX??x,edgeZ:extra.edgeZ??z,wallSign:extra.wallSign||0,
        floorSite:extra.floorSite||null,roofSupport:extra.roofSupport||null};
      const key=occupiedKey(t,selected);
      if(sites.some(s=>s.key===key))return;
      const angle=Math.abs(Math.atan2(Math.sin(yaw-userYaw),Math.cos(yaw-userYaw)));
      list.push({t,score:distance+.08*angle});
    };
    for(const site of sites){
      if(site.count<1)continue;
      const category=site.def.category,sy=site.root.position.y,
        fx=site.root.position.x,fz=site.root.position.z,a=site.root.rotation.y;
      const ux=Math.cos(a),uz=-Math.sin(a),nx=Math.sin(a),nz=Math.cos(a);
      const top=sy+site.def.height;
      if(category==='floor'&&site.level===buildLevel){
        if(kind==='floor'){
          // O topo dos pisos vizinhos fica NA MESMA ALTURA mesmo em solo irregular.
          const base=top-selected.height;
          for(const sign of [-1,1]){
            pose(fx+sign*GRID*ux,fz+sign*GRID*uz,base,a,site);
            pose(fx+sign*GRID*nx,fz+sign*GRID*nz,base,a,site);
          }
        }else if(kind==='wall'){
          for(const sign of [-1,1]){
            const ex=fx+nx*GRID*.5*sign,ez=fz+nz*GRID*.5*sign;
            const wa=a+(sign<0?Math.PI:0),vx=Math.sin(wa),vz=Math.cos(wa);
            pose(ex-vx*halfWall,ez-vz*halfWall,top-.012,wa,site,{edgeX:ex,edgeZ:ez,wallSign:-1,floorSite:site});
            const ex2=fx+ux*GRID*.5*sign,ez2=fz+uz*GRID*.5*sign;
            const wa2=a+(sign>0?Math.PI/2:-Math.PI/2),wx=Math.sin(wa2),wz=Math.cos(wa2);
            pose(ex2-wx*halfWall,ez2-wz*halfWall,top-.012,wa2,site,{edgeX:ex2,edgeZ:ez2,wallSign:-1,floorSite:site});
          }
        }else if(kind==='pillar'){
          for(const ix of [-1,1])for(const iz of [-1,1])
            pose(fx+ix*ux*GRID*.5+iz*nx*GRID*.5,fz+ix*uz*GRID*.5+iz*nz*GRID*.5,top-.012,userYaw,site);
        }else if(kind==='stairs'){
          pose(fx,fz,top-.012,userYaw,site,{floorSite:site});
        }else if(kind==='roof'){
          pose(fx,fz,top+STOREY,userYaw,site,{floorSite:site});
        }
      }
      if(category==='wall'&&site.level===buildLevel&&kind==='wall'){
        const ex=site.edgeX??fx,ez=site.edgeZ??fz,sign=site.wallSign||0;
        for(const dir of [-1,1]){
          const tx=ex+ux*dir*GRID,tz=ez+uz*dir*GRID;
          const off=sign*halfWall;
          pose(tx+nx*off,tz+nz*off,sy,a,site,{edgeX:tx,edgeZ:tz,wallSign:sign});
        }
        // Cantos: outro painel começa exatamente na extremidade do anterior.
        for(const end of [-1,1])for(const turn of [-1,1]){
          const x0=ex+ux*end*GRID*.5,z0=ez+uz*end*GRID*.5;
          const wa=a+turn*Math.PI/2,rx=Math.cos(wa),rz=-Math.sin(wa),wx=Math.sin(wa),wz=Math.cos(wa);
          const tx=x0+rx*GRID*.5,tz=z0+rz*GRID*.5;
          pose(tx+wx*sign*halfWall,tz+wz*sign*halfWall,sy,wa,site,{edgeX:tx,edgeZ:tz,wallSign:sign});
        }
      }
      if(category==='wall'&&site.level===buildLevel-1&&kind==='floor'){
        // Uma parede inferior pode apoiar o piso no andar superior.
        const targetY=sy+STOREY-selected.height;
        for(const side of [-1,1])
          pose(fx+nx*side*GRID*.5,fz+nz*side*GRID*.5,targetY,userYaw,site);
      }
      // V205: telhados conectam-se ao TOPO REAL de paredes e pilares.
      // A cota inclui a fundação elevada em que o apoio foi construído.
      if(kind==='roof'&&site.complete&&(site.level===buildLevel||site.level===buildLevel-1)&&(category==='wall'||category==='pillar')){
        if(category==='wall'){
          for(const side of[-1,1]){
            pose(fx+side*nx*GRID*.5,fz+side*nz*GRID*.5,top,userYaw,site,{roofSupport:site});
          }
        }else{
          // Um pilar pertence ao canto de quatro células de cobertura.
          for(const ix of[-1,1])for(const iz of[-1,1]){
            pose(fx+ix*GRID*.5,fz+iz*GRID*.5,top,userYaw,site,{roofSupport:site});
          }
        }
      }
      if(category==='roof'&&kind==='roof'&&site.level===buildLevel){
        for(const sign of [-1,1]){
          pose(fx+sign*GRID*ux,fz+sign*GRID*uz,sy,a,site);
          pose(fx+sign*GRID*nx,fz+sign*GRID*nz,sy,a,site);
        }
      }
    }
    list.sort((a,b)=>a.score-b.score);
    return list;
  }
  function chooseSnap(x,z,yaw){
    const options=candidatesForSnap(x,z,yaw);
    if(!options.length)return null;
    // Ciclar entre junções próximas ajuda a escolher a aresta correta.
    const nearest=options[0].score;
    const near=options.filter(c=>c.score<=nearest+.46);
    return near[(snapCycle%near.length+near.length)%near.length]?.t||null;
  }
  let snapCycle=0;
  const snapMarker=new T.Mesh(new T.SphereGeometry(.095,10,8),new T.MeshBasicMaterial({color:0xffca6a,depthTest:false}));
  snapMarker.renderOrder=500;snapMarker.visible=false;scene.add(snapMarker);

  function computeTarget(){
    cam.getWorldDirection(dir);let x=player.x-Math.sin(player.yaw)*3,z=player.z-Math.cos(player.yaw)*3;
    for(let d=.8;d<=5;d+=.1){tmp.copy(cam.position).addScaledVector(dir,d);if(tmp.y<=game.groundY(tmp.x,tmp.z)+.05){x=tmp.x;z=tmp.z;break}}
    const reach=Math.hypot(x-player.x,z-player.z);if(reach>3.8){x=player.x+(x-player.x)*3.8/reach;z=player.z+(z-player.z)*3.8/reach}
    const yaw=Math.round((player.yaw+rotation)/(Math.PI/2))*(Math.PI/2);
    const rawX=x,rawZ=z;
    const round=v=>Math.round(v/GRID)*GRID,edge=v=>Math.round((v-GRID/2)/GRID)*GRID+GRID/2;
    if(selected?.category==='wall'){
      const acrossZ=Math.abs(Math.cos(yaw))>.5;
      x=acrossZ?round(x):edge(x);z=acrossZ?edge(z):round(z);
    }else if(selected?.category==='pillar'){
      x=edge(x);z=edge(z);
    }else{x=round(x);z=round(z)}
    // PRIORIDADE: encaixar no ponto de conexão real, sem arredondar o cursor primeiro.
    // Também testa a grade para manter retrocompatibilidade com peças antigas.
    const snapped=chooseSnap(rawX,rawZ,yaw)||chooseSnap(x,z,yaw);
    if(snapped)return snapped;
    // Canonical edge is used as the site key, independent of the wall material.
    const edgeX=x,edgeZ=z;
    let floorSite=null,wallSign=0;
    if(selected?.category==='wall'){
      const nx=Math.sin(yaw),nz=Math.cos(yaw);
      floorSite=adjacentFloor(edgeX,edgeZ,yaw,buildLevel);
      let side=floorSite?(floorSite.root.position.x-edgeX)*nx+(floorSite.root.position.z-edgeZ)*nz
                        :(player.x-edgeX)*nx+(player.z-edgeZ)*nz;
      wallSign=side>=0?1:-1;
      const inward=wallThickness(selected)/2;
      x+=nx*wallSign*inward;z+=nz*wallSign*inward;
    }
    if(selected?.category==='stairs'){
      floorSite=completedFloors.find(f=>f.level===buildLevel&&pointInsideRect(x,z,siteBounds(f),.12))||null;
    }
    const ground=game.groundY(x,z);
    const y=ground+buildLevel*STOREY+(selected?.category==='roof'?STOREY:0);
    return{x,y,z,yaw,level:buildLevel,edgeX,edgeZ,floorSite,wallSign};
  }
  function siteBounds(site){const d=site.def;return{x:site.root.position.x,z:site.root.position.z,hx:d.foot[0]*.5,hz:d.foot[1]*.5,yaw:site.root.rotation.y}}
  function pointInsideRect(px,pz,b,pad=0){const dx=px-b.x,dz=pz-b.z,c=Math.cos(b.yaw),s=Math.sin(b.yaw),lx=dx*c-dz*s,lz=dx*s+dz*c;return Math.abs(lx)<=b.hx+pad&&Math.abs(lz)<=b.hz+pad}
  function occupiedKey(t,def){
    const f=v=>Math.round(v*100)/100;
    return [def.category==='wall'?'wall':def.category,f(def.category==='wall'?(t.edgeX??t.x):t.x),f(def.category==='wall'?(t.edgeZ??t.z):t.z),def.category==='roof'?t.level+1:t.level].join(':');
  }
  function validateTarget(t,def){
    if(!t||![t.x,t.y,t.z].every(Number.isFinite))return'Terreno inválido';
    // Altura baseada no mesmo terreno das estruturas vizinhas; mantém a referência de mundo real.
    const h=[];const halfX=Math.min(def.foot[0]/2,1.5),halfZ=Math.min(def.foot[1]/2,1.5);
    for(const dx of[-halfX,0,halfX])for(const dz of[-halfZ,0,halfZ]){
      const wx=t.x+dx*Math.cos(t.yaw)+dz*Math.sin(t.yaw),wz=t.z-dx*Math.sin(t.yaw)+dz*Math.cos(t.yaw);
      h.push(game.groundY(wx,wz));
    }
    if(!h.every(Number.isFinite)||(!Number.isFinite(t.snapY)&&!t.floorSite&&Math.max(...h)-Math.min(...h)>.58))return'Terreno inclinado: escolha outra posição';
    // Em terreno acidentado, utiliza a cota mais alta para evitar peças enterradas.
    t.y=Number.isFinite(t.snapY)?t.snapY:(t.floorSite?(t.floorSite.root.position.y+t.floorSite.def.height-.012):(Math.max(...h)+.01+t.level*STOREY+(def.category==='roof'?STOREY:0)));
    if(t.level===0&&def.category!=='roof'&&Math.hypot(t.x-player.x,t.z-player.z)<1.05)return'Afaste a peça dos seus pés';
    const key=occupiedKey(t,def);
    for(const site of sites){if(site.key===key)return'Já existe uma estrutura nessa posição';}
    // Para o piso superior exigimos sustentação inferior concluída.
    if(t.level>0&&def.category==='floor'){
      const supports=sites.some(s=>s.complete&&(s.def.category==='pillar'||s.def.category==='wall')&&Math.abs(s.root.position.y-(t.y-STOREY))<.85&&Math.hypot(s.root.position.x-t.x,s.root.position.z-t.z)<2.7);
      if(!supports)return'Construa primeiro uma parede ou um pilar no andar inferior';
    }
    if(def.category==='roof'){
      const compatible=sites.filter(s=>s.complete&&(s.level===t.level||s.level===t.level-1)&&
        (s.def.category==='wall'||s.def.category==='pillar')&&
        Math.hypot(s.root.position.x-t.x,s.root.position.z-t.z)<(s.def.category==='pillar'?2.54:2.3));
      // Supports can be on a foundation elevated by .82m or on stepped terrain.
      // The preview must use the support's actual world-space top, not ground+STOREY.
      if(compatible.length){
        const sorted=compatible.slice().sort((a,b)=>
          Math.hypot(a.root.position.x-t.x,a.root.position.z-t.z)-
          Math.hypot(b.root.position.x-t.x,b.root.position.z-t.z));
        const anchor=t.roofSupport&&compatible.includes(t.roofSupport)?t.roofSupport:sorted[0];
        const height=anchor.root.position.y+anchor.def.height;
        const same=compatible.filter(s=>Math.abs(s.root.position.y+s.def.height-height)<=.22);
        if(same.length===0)return'Pilares ou paredes com alturas diferentes';
        t.y=height;
        t.snapY=height;
      }else{
        // A cobertura pode ser ampliada lateralmente a partir de outra cobertura concluída.
        const neighbor=sites.find(s=>s.complete&&s.level===t.level&&s.def.category==='roof'&&
          Math.hypot(s.root.position.x-t.x,s.root.position.z-t.z)<=GRID+.18);
        if(neighbor){t.y=neighbor.root.position.y;t.snapY=t.y;}
        else return'Telhado precisa de parede ou pilar concluído embaixo';
      }
    }
    if(t.level===0&&def.category!=='roof'){
      const minDist=def.category==='wall'?.34:def.category==='pillar'?.5:.68;
      for(const o of game.colliders||[]){if(o.construction)continue;if(Math.hypot(o.x-t.x,o.z-t.z)<minDist+(o.r||.35))return'Árvore ou rocha atrapalha a construção';}
      for(const f of window.gameFurnace?.furnaces||[]){if(Math.hypot(f.root.position.x-t.x,f.root.position.z-t.z)<1.1)return'Fornalha ocupa esse local';}
    }
    return'';
  }

  // ---------- Sites + physical one-by-one placement -----------------------
  function makeSite(def,t){const r=new T.Group();r.name='Construção_'+def.id;r.position.set(t.x,t.y,t.z);r.rotation.y=t.yaw;root.add(r);const site={def,root:r,count:0,complete:false,parts:[],ghost:null,key:occupiedKey(t,def),level:t.level||0,edgeX:t.edgeX,edgeZ:t.edgeZ,wallSign:t.wallSign||0,wallAttached:!!t.floorSite,snapSource:t.snapSource||null};sites.push(site);makeSiteGhost(site);return site}
  function makeSiteGhost(site){const g=new T.Group();g.name='Construction_RemainingPreview';site.root.add(g);site.def.slots.forEach((s,i)=>{if(i<site.count)return;const m=ghostPiece(s);m.position.copy(s.pos);m.quaternion.copy(s.quat);m.material=ghostGood;g.add(m)});site.ghost=g}
  function rebuildSiteGhost(site){site.ghost?.removeFromParent?.();site.ghost=null;if(!site.complete)makeSiteGhost(site)}
  function isCreative(){return !!window.gameTestMode?.active;}
  // Materiais infinitos do modo Hack Z também funcionam no craft FÍSICO.
  // Consulta dinâmica: desligar o Hack restaura o consumo sem alterar a obra.
  function freeBuildMaterials(){return isCreative()||!!(window.gameHackMode?.enabled&&window.gameHackMode?.infinite);}
  function resourceFor(site){return site.def.slots[site.count]?.kind||site.def.resource;}
  function resourceReady(def,index=0){const kind=def.slots[index]?.kind||def.resource;if(freeBuildMaterials())return true;
    if(kind==='log')return !!lumber.carrying;
    if(kind==='plank')return planks.count>0;
    return (inv?.items?.find?.(x=>x.id===kind)?.quantity||0)>0;
  }
  function resourceHint(def,index=0){const kind=def.slots[index]?.kind||def.resource;
    return {log:'Carregue um tronco real no ombro',plank:'Carregue uma pilha de tábuas no ombro',rock:'Recolha uma pedra no inventário',branch:'Recolha um galho no inventário',vine:'Recolha um cipó no inventário'}[kind]||'Falta material';
  }
  function targetTransform(site,slot,mesh){
    const p=slot.pos.clone(),q=slot.quat.clone();
    const wp=site.root.localToWorld(p.clone());
    const wq=site.root.getWorldQuaternion(new T.Quaternion()).multiply(q);
    return{wp,wq,localPos:p,localQuat:q};
  }
  // Usa a MALHA NATIVA consumida do ombro, corrigindo somente a escala na obra.
  // Assim diferentes árvores não abrem frestas entre troncos empilhados.
  function sizeConstructionLog(mesh,slot){
    const rawRadius=Number(mesh.userData?.radius||mesh.geometry?.parameters?.radiusBottom||.22);
    const rawLength=Number(mesh.userData?.length||mesh.geometry?.parameters?.height||3.15);
    const wantedRadius=Number(slot.radius)||WALL_LOG_RADIUS;
    if(!(rawRadius>0&&rawLength>0))return;
    mesh.scale.set(wantedRadius/rawRadius,slot.len/rawLength,wantedRadius/rawRadius);
    mesh.userData.constructionSized=true;
    mesh.userData.constructionLength=slot.len;
    mesh.userData.constructionRadius=wantedRadius;
  }
  function consumeResource(site){
    const sl=site.def.slots[site.count],kind=sl.kind;
    if(kind==='log'){
      const rel=freeBuildMaterials()?{mesh:lumber.createCargoLog?.()}:lumber.releaseCarriedLog?.();
      if(!rel?.mesh)return null;
      if(!freeBuildMaterials())window.gameLogPlacement?.cancel?.();
      rel.mesh.userData.constructionPart=true;rel.mesh.userData.placedLog=false;sizeConstructionLog(rel.mesh,sl);
      return{mesh:rel.mesh,source:rel};
    }
    let mesh;
    if(kind==='plank'){
      if(!freeBuildMaterials()&&!planks.consumeOne?.())return null;
      mesh=planks.createCargoPlank?.(sl.len)||plankMesh(sl.len);
      // Tábua original do lenhador: geometria gerada diretamente no comprimento pedido.
    }else{
      if(!freeBuildMaterials()&&!inv?.removeItem?.(kind,1))return null;
      mesh=pieceMesh(kind,sl.len);
    }
    scene.add(mesh);
    const start=cam.position.clone().addScaledVector(cam.getWorldDirection(new T.Vector3()),.72);
    mesh.position.copy(start);
    return{mesh,source:null};
  }
  function placeNext(site){
    if(!site||site.complete||pending)return false;if(!resourceReady(site.def,site.count)){if(status)status.textContent=resourceHint(site.def,site.count);return false}
    const slot=site.def.slots[site.count],got=consumeResource(site);if(!got)return false;const mesh=got.mesh,tx=targetTransform(site,slot,mesh);
    const startPos=mesh.getWorldPosition(new T.Vector3()),startQ=mesh.getWorldQuaternion(new T.Quaternion());scene.attach(mesh);mesh.position.copy(startPos);mesh.quaternion.copy(startQ);
    pending={site,mesh,slot,index:site.count,startPos,startQ,endPos:tx.wp,endQ:tx.wq,localPos:tx.localPos,localQuat:tx.localQuat,time:0};focused=site;
    if(status)status.textContent=`${site.def.name} • colocando peça ${site.count+1}/${site.def.total}`;return true;
  }
  function finalizePiece(p){
    const site=p.site;site.root.attach(p.mesh);p.mesh.position.copy(p.localPos);p.mesh.quaternion.copy(p.localQuat);p.mesh.castShadow=!mobile;p.mesh.receiveShadow=true;site.parts.push(p.mesh);site.count++;pending=null;site.physicsBoxes=null;
    if(site.count>=site.def.total){site.complete=true;site.ghost?.removeFromParent?.();site.ghost=null;onComplete(site);if(status)status.textContent=`${site.def.name} concluído`}
    else{rebuildSiteGhost(site);if(status)status.textContent=`${site.def.name} • ${site.count}/${site.def.total} • ${resourceHint(site.def,site.count)}`}
  }
  // Também conecta paredes que foram colocadas ANTES de construir o piso.
  function reconnectWallsToFloor(){
    for(const s of sites){
      if(s.def.category!=='wall'||s.wallAttached||s.edgeX===undefined)continue;
      const yaw=s.root.rotation.y;
      const floor=adjacentFloor(s.edgeX,s.edgeZ,yaw,s.level);
      if(!floor)continue;
      const nx=Math.sin(yaw),nz=Math.cos(yaw);
      const delta=(floor.root.position.x-s.edgeX)*nx+(floor.root.position.z-s.edgeZ)*nz;
      const sign=delta>=0?1:-1,half=wallThickness(s.def)/2;
      s.root.position.set(s.edgeX+nx*sign*half,floor.root.position.y+floor.def.height-.012,s.edgeZ+nz*sign*half);
      s.wallSign=sign;s.wallAttached=true;s.physicsBoxes=null;
      if(pending?.site===s){const tx=targetTransform(s,pending.slot,pending.mesh);pending.endPos.copy(tx.wp);pending.endQ.copy(tx.wq);}
    }
  }
  function onComplete(site){
    if(site.def.category==='floor'){completedFloors.push(site);reconnectWallsToFloor();refreshStairOpenings();}
    else if(site.def.category==='stairs'){completedStairs.push(site);refreshStairOpenings();}
    site.physicsBoxes=null; // estrutura completa usa volumes específicos, incluindo portas/janelas vazadas.
    window.dispatchEvent(new CustomEvent('game:construction-complete',{detail:{id:site.def.id,name:site.def.name}}));
  }

  function findFocused(){cam.getWorldDirection(dir);let best=null,score=-1;for(const site of sites){if(site.complete||site.count>=site.def.total)continue;const d=Math.hypot(site.root.position.x-player.x,site.root.position.z-player.z);if(d>4.4)continue;tmp.copy(site.root.position);tmp.y+=.8;tmp.sub(cam.position).normalize();const dot=dir.dot(tmp);if(dot>.64&&dot>score){score=dot;best=site}}return best}
  function interact(){
    if(pending)return false;
    if(positioning&&selected){target=computeTarget();reason=validateTarget(target,selected);valid=!reason;if(reason){if(status)status.textContent=reason;return false}if(!resourceReady(selected)){if(status)status.textContent=resourceHint(selected);return false}const site=makeSite(selected,target);positioning=false;clearGhost();selected=null;focused=site;return placeNext(site)}
    if(focused&&!focused.complete)return placeNext(focused);return false;
  }

  // Uma escada precisa de abertura verdadeira no piso superior quando
  // ambas foram colocadas na mesma célula. A V202 deixava o piso inteiro
  // por cima da escada, mantendo suporte invisível e impedindo a descida.
  function openingAt(floor,x,z,margin=.0){
    if(!floor.openings?.length)return false;
    const dx=x-floor.root.position.x,dz=z-floor.root.position.z;
    const c=Math.cos(floor.root.rotation.y),sn=Math.sin(floor.root.rotation.y);
    const lx=c*dx-sn*dz,lz=sn*dx+c*dz;
    return floor.openings.some(a=>lx>a.x0+margin&&lx<a.x1-margin&&lz>a.z0+margin&&lz<a.z1-margin);
  }
  function refreshStairOpenings(){
    for(const floor of completedFloors){
      // Restore floor first; regenerate cuts only for actual matching stairs.
      for(const mesh of floor.cutMeshes||[])mesh.removeFromParent?.();
      floor.cutMeshes=[];floor.openings=[];
      floor.parts?.forEach(m=>m.visible=true);
      for(const stair of completedStairs){
        const dy=floor.root.position.y-stair.root.position.y;
        if(Math.abs(dy-STOREY)>.68)continue;
        if(Math.hypot(floor.root.position.x-stair.root.position.x,floor.root.position.z-stair.root.position.z)>1.45)continue;
        const corners=[];
        for(const xx of [-stair.def.foot[0]/2-.10,stair.def.foot[0]/2+.10])
          for(const zz of [-1.60,1.60]){
            const world=stair.root.localToWorld(new T.Vector3(xx,0,zz));
            corners.push(floor.root.worldToLocal(world));
          }
        const xs=corners.map(v=>v.x),zs=corners.map(v=>v.z);
        const hole={x0:Math.max(-GRID/2,Math.min(...xs)),x1:Math.min(GRID/2,Math.max(...xs)),
          z0:Math.max(-GRID/2,Math.min(...zs)),z1:Math.min(GRID/2,Math.max(...zs))};
        if(hole.x1-hole.x0<.7||hole.z1-hole.z0<.7)continue;
        floor.openings.push(hole);
      }
      if(!floor.openings.length||!floor.parts?.length)continue;
      const d=floor.def;
      if(d.id==='floor_plank'||d.id==='floor_bridge'||d.id==='floor_log'){
        floor.parts.forEach((part,i)=>{
          const slot=d.slots[i];if(!slot)return;
          const x=slot.pos.x,w=d.id==='floor_log'?2*(slot.radius||FLOOR_LOG_RADIUS):NATIVE_PLANK_WIDTH;
          const holes=floor.openings.filter(o=>x+w/2>o.x0&&x-w/2<o.x1);
          if(!holes.length)return;
          part.visible=false;
          const segments=[[-GRID/2,GRID/2]];
          for(const hole of holes){
            for(let j=segments.length-1;j>=0;j--){
              const [a,b]=segments[j];if(hole.z1<=a||hole.z0>=b)continue;
              segments.splice(j,1,...([[a,Math.min(b,hole.z0)],[Math.max(a,hole.z1),b]].filter(([v0,v1])=>v1-v0>.16)));
            }
          }
          for(const [a,b] of segments){
            let m;
            if(d.id==='floor_log'){
              const radius=slot.radius||FLOOR_LOG_RADIUS;
              m=new T.Mesh(new T.CylinderGeometry(radius,radius,b-a,18),part.material);
            }else m=new T.Mesh(new T.BoxGeometry(NATIVE_PLANK_WIDTH,NATIVE_PLANK_THICKNESS,b-a),part.material);
            m.position.set(slot.pos.x,slot.pos.y,(a+b)/2);
            m.quaternion.copy(slot.quat);
            m.castShadow=!mobile;m.receiveShadow=true;floor.root.add(m);floor.cutMeshes.push(m);
          }
        });
      }else{
        // Pedra/fundação: mantém as peças inteiras que não ocupam a abertura.
        floor.parts.forEach((part,i)=>{
          const sl=d.slots[i];if(!sl)return;
          if(floor.openings.some(o=>sl.pos.x>o.x0-.17&&sl.pos.x<o.x1+.17&&sl.pos.z>o.z0-.17&&sl.pos.z<o.z1+.17))part.visible=false;
        });
      }
    }
  }

  // ---------- V203: altura de apoio e colisões 3D das construções ------------
  // O controlador original utiliza os pés do jogador como heightAt.currentY.
  // Cada volume é verificado no nível vertical correspondente; as paredes dos
  // andares de cima NÃO bloqueiam a passagem pelo térreo.
  let nav=window.gameBorderMountains;
  const PLAYER_RADIUS=Math.max(.33,Math.min(.47,Number(player.radius)||.40));
  const PLAYER_HEIGHT=1.68;
  function rect(x0,x1,y0,y1,z0,z1){return{x0,x1,y0,y1,z0,z1};}
  function siteVolumes(site){
    const d=site.def,h=d.height,hw=d.foot[0]/2,dep=(d.category==='wall'?wallThickness(d):d.foot[1])/2;
    const whole=()=>[rect(-hw,hw,0,h,-dep,dep)];
    if(d.category==='wall'){
      const side=rect(-hw,-.71,0,h,-dep,dep),sideR=rect(.71,hw,0,h,-dep,dep);
      if(d.id==='wall_door')return[side,sideR,rect(-.71,.71,2.73,3.1,-dep,dep)];
      if(d.id==='wall_window'||d.id==='wall_window_wide'){
        const sill=d.id==='wall_window_wide'?.48:1.0;
        return[side,sideR,rect(-.71,.71,0,sill,-dep,dep),rect(-.71,.71,2.31,3.12,-dep,dep)];
      }
      if(d.id==='wall_gable')return[rect(-hw,hw,0,1.55,-dep,dep),rect(-.95,.95,1.55,2.6,-dep,dep)];
      return whole();
    }
    if(d.category==='pillar')return[rect(-hw,hw,0,h,-hw,hw)];
    if(d.category==='floor')return[rect(-hw,hw,0,h,-d.foot[1]/2,d.foot[1]/2)];
    if(d.category==='roof')return[rect(-hw,hw,0,Math.max(h,.16),-d.foot[1]/2,d.foot[1]/2)];
    if(d.category==='stairs'){
      // As vigas laterais são sólidas. O centro é livre e os degraus servem
      // como apoio vertical, não como paredes invisíveis.
      const x=d.id==='stair_wide'?1.49:.72;
      return[rect(-x-.065,-x+.065,.18,3.1,-1.6,1.6),rect(x-.065,x+.065,.18,3.1,-1.6,1.6)];
    }
    return [];
  }
  function collide2D(px,pz,site,box,radius){
    const dx=px-site.root.position.x,dz=pz-site.root.position.z;
    const c=Math.cos(site.root.rotation.y),sn=Math.sin(site.root.rotation.y);
    const lx=c*dx-sn*dz,lz=sn*dx+c*dz;
    const cx=Math.max(box.x0,Math.min(box.x1,lx)),cz=Math.max(box.z0,Math.min(box.z1,lz));
    return (lx-cx)**2+(lz-cz)**2<radius*radius;
  }
  function solidAt(px,pz,feet){
    // Montado: o corpo/colisão da aranha continua sob controle do módulo V37.
    if(window.gameCreativeSpiderMount?.mounted||window.gameSpiderCave?.active)return false;
    for(const site of sites){
      if(site.count===0)continue;
      if(Math.hypot(px-site.root.position.x,pz-site.root.position.z)>5.5)continue;
      const b=siteBounds(site);
      if(!pointInsideRect(px,pz,b,PLAYER_RADIUS+.35))continue;
      if(site.complete&&site.def.category==='floor'&&openingAt(site,px,pz,.04))continue;
      const volumes=site.complete?(site.collisionVolumes||(site.collisionVolumes=siteVolumes(site))):partialVolumes(site);
      for(const v of volumes){
        const y0=site.root.position.y+v.y0,y1=site.root.position.y+v.y1;
        if(feet+PLAYER_HEIGHT-.07<=y0||feet+.08>=y1)continue;
        // Degraus e pisos baixos podem ser vencidos sem colisão lateral.
        if(site.def.category==='floor'&&y1<=feet+.42)continue;
        if(collide2D(px,pz,site,v,PLAYER_RADIUS))return true;
      }
    }
    return false;
  }
  function partialVolumes(site){
    // Caixas locais dos elementos JÁ construídos, não dos fantasmas azuis.
    // Usa bounding boxes reais das malhas; uma janela incompleta não ganha
    // uma parede invisível ocupando o vão.
    if(site.physicsBoxes&&site.physicsBoxesCount===site.count)return site.physicsBoxes;
    const result=[];site.root.updateWorldMatrix(true,true);
    const inverted=site.root.matrixWorld.clone().invert();
    for(const part of site.parts){
      const b=new T.Box3().setFromObject(part);
      if(b.isEmpty())continue;
      b.applyMatrix4(inverted);
      result.push(rect(b.min.x,b.max.x,b.min.y,b.max.y,b.min.z,b.max.z));
    }
    site.physicsBoxes=result;site.physicsBoxesCount=site.count;return result;
  }
  function resolveCollision(oldX,oldZ,x,z,feet){
    // Subpassos e separação dos eixos: permite deslizar ao lado de paredes,
    // sem atravessar uma parede fina por movimento rápido.
    let px=oldX,pz=oldZ;
    // Se começar parcialmente dentro de uma construção, nunca libera passagem
    // irrestrita: afasta o capsule do volume pelo menor lado disponível.
    if(solidAt(px,pz,feet)){
      for(let attempt=0;attempt<5&&solidAt(px,pz,feet);attempt++){
        let best=null,bestDist=Infinity;
        for(const site of sites){
          if(!site.count||Math.hypot(px-site.root.position.x,pz-site.root.position.z)>5)continue;
          const volumes=site.complete?(site.collisionVolumes||(site.collisionVolumes=siteVolumes(site))):partialVolumes(site);
          const a=site.root.rotation.y,c=Math.cos(a),sn=Math.sin(a),dx=px-site.root.position.x,dz=pz-site.root.position.z;
          const lx=c*dx-sn*dz,lz=sn*dx+c*dz;
          for(const v of volumes){
            if(feet+PLAYER_HEIGHT-.07<=site.root.position.y+v.y0||feet+.08>=site.root.position.y+v.y1)continue;
            const pad=PLAYER_RADIUS+.015;
            const possibilities=[{n:v.x0-pad-lx,axis:'x'},{n:v.x1+pad-lx,axis:'x'},
              {n:v.z0-pad-lz,axis:'z'},{n:v.z1+pad-lz,axis:'z'}];
            if(!(lx>v.x0-pad&&lx<v.x1+pad&&lz>v.z0-pad&&lz<v.z1+pad))continue;
            for(const t of possibilities){
              if(Math.abs(t.n)<bestDist){bestDist=Math.abs(t.n);best={x:t.axis==='x'?c*t.n:sn*t.n,z:t.axis==='x'?-sn*t.n:c*t.n}}
            }
          }
        }
        if(!best)break;
        px+=best.x;pz+=best.z;
      }
    }
    const count=Math.max(1,Math.ceil(Math.hypot(x-oldX,z-oldZ)/.12));
    const sx=(x-oldX)/count,sz=(z-oldZ)/count;
    for(let i=0;i<count;i++){
      // Avança a partir do último ponto VALIDADO, não do destino absoluto.
      // Isso impede ultrapassar uma parede fina após alguns subpassos barrados.
      if(!solidAt(px+sx,pz,feet))px+=sx;
      if(!solidAt(px,pz+sz,feet))pz+=sz;
    }
    return{x:px,z:pz};
  }
  // V205: até pisos INACABADOS têm apoio físico sobre os troncos/tábuas
  // realmente instalados. O antigo heightAt ignorava todas as peças até o
  // último recurso ser colocado, deixando a câmera entrar na madeira.
  function partialFloorTop(site,wx,wz){
    const dx=wx-site.root.position.x,dz=wz-site.root.position.z;
    const a=site.root.rotation.y,c=Math.cos(a),sn=Math.sin(a);
    const lx=c*dx-sn*dz,lz=sn*dx+c*dz;
    let top=-Infinity;
    for(let i=0;i<site.count;i++){
      const sl=site.def.slots[i];if(!sl)continue;
      const sx=lx-sl.pos.x,sz=lz-sl.pos.z;
      if(sl.kind==='log'){
        const r=sl.radius||FLOOR_LOG_RADIUS;
        if(Math.abs(sx)<r-.01&&Math.abs(sz)<sl.len*.5-.02)
          top=Math.max(top,site.root.position.y+sl.pos.y+r);
      }else if(sl.kind==='plank'){
        if(Math.abs(sx)<NATIVE_PLANK_WIDTH/2-.012&&Math.abs(sz)<sl.len*.5-.02)
          top=Math.max(top,site.root.position.y+sl.pos.y+NATIVE_PLANK_THICKNESS/2);
      }else if(sl.kind==='rock'){
        if(Math.abs(sx)<.54&&Math.abs(sz)<.54)
          top=Math.max(top,site.root.position.y+sl.pos.y+.11);
      }
    }
    return top;
  }
  function installConstructionPhysics(){
    nav=window.gameBorderMountains;
    if(!nav?.heightAt||nav.__constructionWrapped)return false;
    nav.__constructionWrapped=true;
    const oldHeight=nav.heightAt.bind(nav),oldConsume=nav.consumeLeftSupport?.bind(nav);
    const oldBlock=nav.blockMove?.bind(nav);
    nav.blockMove=(ox,oz,nx,nz,feet,grounded)=>{
      if(oldBlock?.(ox,oz,nx,nz,feet,grounded))return true;
      if(!sites.length||window.gameSpiderCave?.active)return false;
      const p=resolveCollision(ox,oz,nx,nz,feet);
      player.x=p.x;player.z=p.z;
      return false;
    };
    nav.heightAt=(x,z,baseY,currentY,grounded,vy)=>{
      const base=oldHeight(x,z,baseY,currentY,grounded,vy);
      supportPrev=supportNow;supportNow=false;leftSupport=false;
      let best=base;
      function accept(top){
        // Não escolhe um piso que está acima da cabeça / atravessando o corpo.
        const diff=currentY-top;
        // Pisos elevados não são degraus: só sobe automaticamente até 0,42 m.
        // Caso contrário, o jogador precisa da escada. Proíbe captura por baixo.
        const step=grounded&&diff>=-.42&&diff<=.62;
        const stay=grounded&&Math.abs(diff)<.19;
        const land=!grounded&&vy<=.2&&diff>=-.06&&diff<1.55;
        if((step||stay||land)&&top>best+.015){best=top;supportNow=true}
      }
      for(const site of sites){
        if(site.def.category!=='floor'||site.complete||site.count<1)continue;
        const top=partialFloorTop(site,x,z);
        if(Number.isFinite(top))accept(top);
      }
      for(const site of completedFloors){
        const b=siteBounds(site);
        if(!pointInsideRect(x,z,b,-.11)||openingAt(site,x,z,.12))continue;
        accept(site.root.position.y+site.def.height);
      }
      for(const site of sites){
        if(!site.complete||site.def.id!=='roof_flat')continue;
        if(pointInsideRect(x,z,siteBounds(site),-.09))accept(site.root.position.y+site.def.height);
      }
      for(const site of completedStairs){
        for(let i=0;i<STAIR_STEP_Z.length;i++){
          const wp=site.root.localToWorld(new T.Vector3(0,0,STAIR_STEP_Z[i]));
          const b={x:wp.x,z:wp.z,hx:site.def.foot[0]/2-.07,hz:.27,yaw:site.root.rotation.y};
          if(!pointInsideRect(x,z,b))continue;
          accept(site.root.position.y+STAIR_STEP_TOP[i]);
        }
      }
      // Ao sair da borda do piso superior, o personagem passa a CAIR.
      if(supportPrev&&!supportNow&&currentY-base>.5)leftSupport=true;
      return best;
    };
    nav.consumeLeftSupport=()=>{const v=leftSupport;leftSupport=false;return v||(oldConsume?oldConsume():false)};
    return true;
  }
  installConstructionPhysics();

  // ---------- Input + frame ------------------------------------------------
  function busy(){return !!(window.gameInventory?.isOpen||window.gameCraft?.active||document.body.classList.contains('skills-open')||document.body.classList.contains('hack-v196-open')||overlay.classList.contains('open'))}
  function updateButtons(){const show=positioning||!!focused&&!focused.complete;hud.style.display=show?'block':'none';action.style.display=show?'block':'none';cancel.style.display=positioning?'block':'none';cycleBtn.style.display=positioning?'block':'none';levelMobile.style.display=positioning&&mobile?'flex':'none'}
  function updateHUD(){
    if(positioning&&selected){hud.innerHTML=`<strong>Posicionando ${selected.name}</strong>${reason||`${selected.desc} • Piso ${buildLevel+1} • R girar • Q sobe • Shift+Q desce • Home térreo • E outro encaixe • F coloca a peça`}`;action.textContent=resourceReady(selected)?'Colocar primeira peça':resourceHint(selected);action.disabled=!!reason||!!pending}
    else if(focused&&!focused.complete){hud.innerHTML=`<strong>${focused.def.name} • ${focused.count}/${focused.def.total}</strong>${resourceReady(focused.def,focused.count)?'Coloque a próxima peça • F ou clique':resourceHint(focused.def,focused.count)}`;action.textContent=resourceReady(focused.def,focused.count)?'Colocar próxima peça':resourceHint(focused.def,focused.count);action.disabled=!!pending}
    updateButtons();
  }
  action.onclick=interact;cancel.onclick=cancelPlacement;
  addEventListener('keydown',e=>{
    if(e.repeat||window.gameHackMode?.state?.open)return;
    if(e.code==='KeyB'){e.preventDefault();e.stopImmediatePropagation();if(positioning)cancelPlacement();overlay.classList.contains('open')?closeMenu():openMenu();return}
    if(e.code==='Escape'){if(overlay.classList.contains('open')){closeMenu();return}if(positioning){e.preventDefault();cancelPlacement();return}}
    if(positioning&&(e.code==='KeyQ'||e.code==='PageUp'||e.code==='PageDown'||e.code==='Home')){e.preventDefault();e.stopImmediatePropagation();if(e.code==='Home')setLevel(0);else setLevel(buildLevel+((e.code==='PageUp'||(e.code==='KeyQ'&&!e.shiftKey))?1:-1));return}
    if(e.code==='KeyR'&&positioning){e.preventDefault();e.stopImmediatePropagation();rotation+=Math.PI/2;snapCycle=0;return}
    if(e.code==='KeyE'&&positioning){e.preventDefault();e.stopImmediatePropagation();snapCycle++;return}
    if(e.code==='KeyF'&&(positioning||focused&&!focused.complete)){e.preventDefault();e.stopImmediatePropagation();interact();return}
  },true);
  addEventListener('pointerdown',e=>{if(e.target!==canvas||e.button>0||busy()||pending)return;if(positioning||focused&&!focused.complete){e.preventDefault();e.stopImmediatePropagation();interact()}},true);

  function frame(now){
    requestAnimationFrame(frame);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
    if(!window.gameBorderMountains?.__constructionWrapped)installConstructionPhysics();
    if(!busy()){
      if(positioning&&selected){target=computeTarget();reason=validateTarget(target,selected);valid=!reason;if(ghost){ghost.visible=true;ghost.position.set(target.x,target.y,target.z);ghost.rotation.y=target.yaw;recolorGhost(valid)}snapMarker.visible=!!target.snapSource;snapMarker.position.set(target.edgeX??target.x,target.y+.13,target.edgeZ??target.z);snapMarker.material.color.setHex(valid?0x54f49d:0xff6354)}
      else if(now-lastFocusScan>90){focused=findFocused();lastFocusScan=now}
    }
    if(pending){pending.time+=dt;const t=Math.min(1,pending.time/.52),k=t*t*(3-2*t);pending.mesh.position.lerpVectors(pending.startPos,pending.endPos,k);pending.mesh.position.y+=Math.sin(t*Math.PI)*.16;pending.mesh.quaternion.slerpQuaternions(pending.startQ,pending.endQ,k);if(t>=1)finalizePiece(pending)}
    updateHUD();
  }
  requestAnimationFrame(frame);

  // DUO: rebuild remote works using the SAME material, slot geometry and physics as local builds.
  // Remote site records remain in the normal sites[] / completedFloors[] / completedStairs[]
  // so the native blockMove / heightAt and snap solver see both players' work.
  function duoSiteKey(s){return [s.id,...['x','y','z','yaw'].map(k=>Number(s[k]).toFixed(3))].join(':');}
  function duoSnapshot(){
    return {schema:1,sites:sites.filter(s=>!s.duoRemote&&s.count>0).map(s=>({
      id:s.def.id,x:s.root.position.x,y:s.root.position.y,z:s.root.position.z,yaw:s.root.rotation.y,
      count:s.count,level:s.level,edgeX:s.edgeX,edgeZ:s.edgeZ,wallSign:s.wallSign,
      wallAttached:!!s.wallAttached
    }))};
  }
  function duoForget(site){
    const i=sites.indexOf(site);if(i>=0)sites.splice(i,1);
    for(const list of [completedFloors,completedStairs]){const x=list.indexOf(site);if(x>=0)list.splice(x,1);}
    site.root.removeFromParent();
    // Never dispose shared native materials (woodTop / rockMat etc.).
    site.root.traverse(o=>{if(o.isMesh)o.geometry?.dispose?.();});
  }
  function duoApply(owner,records){
    if(typeof owner!=='string'||!owner||owner.length>90||!Array.isArray(records)||records.length>650)return false;
    const desired=new Map();
    for(const raw of records){
      if(!raw||!DEF[raw.id]||!['x','y','z','yaw'].every(k=>Number.isFinite(raw[k])&&Math.abs(raw[k])<3000))continue;
      const def=DEF[raw.id],count=raw.count;
      if(!Number.isInteger(count)||count<1||count>def.slots.length)continue;
      const key=duoSiteKey(raw);
      desired.set(key,{...raw,count});
    }
    let changed=false;
    for(const site of [...sites]){
      if(site.duoOwner!==owner)continue;
      const key=duoSiteKey({id:site.def.id,x:site.root.position.x,y:site.root.position.y,z:site.root.position.z,yaw:site.root.rotation.y});
      if(!desired.has(key)||desired.get(key).count!==site.count){duoForget(site);changed=true;}
    }
    for(const [key,raw] of desired){
      if(sites.some(s=>s.duoOwner===owner&&duoSiteKey({id:s.def.id,x:s.root.position.x,y:s.root.position.y,z:s.root.position.z,yaw:s.root.rotation.y})===key&&s.count===raw.count))continue;
      // Do not duplicate a structure if the same location already belongs to a local site.
      const existing=sites.find(s=>!s.duoRemote&&duoSiteKey({id:s.def.id,x:s.root.position.x,y:s.root.position.y,z:s.root.position.z,yaw:s.root.rotation.y})===key);
      if(existing)continue;
      const def=DEF[raw.id];
      const t={x:raw.x,y:raw.y,z:raw.z,yaw:raw.yaw,
        level:Number.isInteger(raw.level)?Math.max(0,Math.min(2,raw.level)):0,
        edgeX:Number.isFinite(raw.edgeX)?raw.edgeX:undefined,
        edgeZ:Number.isFinite(raw.edgeZ)?raw.edgeZ:undefined,
        wallSign:raw.wallSign||0};
      const site=makeSite(def,t);site.duoRemote=true;site.duoOwner=owner;
      site.wallAttached=!!raw.wallAttached;
      site.ghost?.removeFromParent?.();site.ghost=null;
      for(let i=0;i<raw.count;i++){
        const sl=def.slots[i];let piece;
        if(sl.kind==='log'){
          // Native cargo generator preserves the original tree material and geometry.
          piece=lumber.createCargoLog?.()||logGhostMesh(sl.len,sl.radius||WALL_LOG_RADIUS,logMat);
          sizeConstructionLog(piece,sl);
        }else piece=pieceMesh(sl.kind,sl.len);
        if(!piece)continue;
        site.root.add(piece);piece.position.copy(sl.pos);piece.quaternion.copy(sl.quat);
        piece.castShadow=!mobile;piece.receiveShadow=true;site.parts.push(piece);
      }
      site.count=site.parts.length;site.physicsBoxes=null;
      if(site.count===def.slots.length){site.complete=true;onComplete(site);}
      else rebuildSiteGhost(site);
      changed=true;
    }
    if(changed){reconnectWallsToFloor();refreshStairOpenings();}
    return changed;
  }
  function duoClear(owner){
    if(typeof owner!=='string'||!owner)return;
    for(const site of [...sites])if(site.duoOwner===owner)duoForget(site);
    refreshStairOpenings();
  }
  window.gameConstruction={version:'V205_Fundacao_Cobertura_Snap_Real_HackZ',definitions:DEF,sites,completedFloors,completedStairs,snapshot:duoSnapshot,applyRemote:duoApply,clearRemote:duoClear,get level(){return buildLevel},setLevel,goGround:()=>setLevel(0),collisionAt:(x,z,feet)=>solidAt(x,z,feet),get active(){return positioning},get selected(){return selected?.id||null},open:openMenu,close:closeMenu,select:selectBlueprint,cancel:cancelPlacement,interact};
  console.info('[V205] Construção: fundações/pisos sem fendas, encaixe no topo real de pilares/paredes, piso elevado sólido, PC/Mobile');
})();

