/* FLORESTA V259 — Jornada inicial. Missões reativas, sem cheats, pausa ou controle do relógio. */
(()=>{'use strict';
 const STORAGE='floresta-onboarding-v259';
 const FRESH='floresta-v259-new-journey';
 const NARRATIVE=[
  'Você desperta entre raízes úmidas. Não se lembra de ter entrado nesta floresta. Ao longe, uma árvore estala sem vento.',
  'Há galhos quebrados e pedras no chão. Você não está equipado para enfrentar o que vive aqui.',
  'Um machado improvisado pode ser a diferença entre construir um abrigo e ficar exposto.',
  'O sol está descendo. É hora de preparar uma defesa, mesmo que imperfeita.',
  'A floresta não está vazia. Escute. Não faça barulho desnecessário.',
  'Você sobreviveu à primeira noite. Entre raízes próximas há uma pedra marcada. Alguém esteve aqui antes.',
  'Marcas de ferro. Os vestígios apontam para as montanhas. Sua jornada está só começando.'
 ];
 const DEFAULT=()=>({version:1,active:true,completed:false,hidden:false,walked:0,nightSeen:false,dawnSeen:false,clueFound:false,flags:{branch:false,rock:false,axe:false,build:false,torch:false},step:0});
 const safeGet=()=>{try{return localStorage.getItem(STORAGE)}catch{return null}};
 const safeWrite=data=>{try{localStorage.setItem(STORAGE,JSON.stringify(data))}catch(e){console.warn('[V259] Jornal não pôde ser salvo:',e)}};
 function read(){try{const raw=safeGet();if(!raw)return null;const value=JSON.parse(raw);if(value?.version!==1||!value.flags||typeof value.flags!=='object')return null;return {...DEFAULT(),...value,flags:{...DEFAULT().flags,...value.flags}}}catch{return null}}
 const $=id=>document.getElementById(id), alive=()=>!!window.gameFront172?.started&&!window.gameTestMode?.active&&document.getElementById('florestaFront')?.hidden!==false;
 const css=`
 #f259Wake{position:fixed;inset:0;z-index:226;pointer-events:none;background:#020604;animation:f259WakeFade 4.3s ease-out forwards}
 @keyframes f259WakeFade{0%{opacity:1}12%{opacity:.97}45%{opacity:.72}82%{opacity:.16}100%{opacity:0}}
 #f259Journey{position:fixed;z-index:227;top:116px;left:15px;width:min(300px,calc(100vw - 32px));box-sizing:border-box;border:1px solid #9b825c90;background:linear-gradient(110deg,#07100ce8,#131912ea);color:#f0e7cf;box-shadow:0 9px 30px #0008;font-family:Georgia,serif;padding:12px 12px 11px;pointer-events:auto;transition:opacity .2s}
 #f259Journey[hidden],#f259Story[hidden],#f259ClueHint[hidden]{display:none!important}
 #f259Journey .kicker{font-size:9px;letter-spacing:2px;color:#c3ab7a;font-family:system-ui,sans-serif;font-weight:800}
 #f259Journey h3{font-size:17px;line-height:1.25;margin:5px 0 6px;font-weight:600;color:#fff4d8}
 #f259Journey p{font-family:system-ui,sans-serif;line-height:1.4;font-size:12px;margin:5px 0;color:#e0dacb}
 #f259Journey small{display:block;font-family:system-ui,sans-serif;font-size:11px;line-height:1.4;color:#c8c6b8}
 #f259Journey .hdr{display:flex;align-items:center;justify-content:space-between;gap:10px}
 #f259Journey button,#f259Return{background:#243129e8;border:1px solid #9c855e8c;color:#eee3c9;font-family:system-ui,sans-serif;font-size:11px;border-radius:3px;cursor:pointer;min-height:27px;padding:4px 8px}
 #f259Journey .line{height:1px;background:#b49c6640;margin:9px 0}
 #f259Journey .checks{font:11px system-ui,sans-serif;color:#cccbba}
 #f259Story{position:fixed;z-index:228;bottom:19%;left:50%;transform:translateX(-50%);max-width:min(520px,calc(100vw - 24px));padding:15px 21px;background:linear-gradient(90deg,#07100ae8,#141b16ed,#07100ae8);border-top:1px solid #ad946977;border-bottom:1px solid #ad946977;text-align:center;font:16px/1.5 Georgia,serif;color:#f3e8cc;text-shadow:0 1px 4px #000;pointer-events:none;box-shadow:0 6px 24px #0008}
 #f259Return{position:fixed;top:112px;left:14px;z-index:227;pointer-events:auto}
 #f259ClueHint{font:11px system-ui,sans-serif;color:#f1dca7;margin-top:6px}
 @media(max-width:740px){#f259Journey{top:calc(179px + env(safe-area-inset-top,0px));left:8px;width:min(230px,calc(100vw - 24px));padding:8px}#f259Journey h3{font-size:13px}#f259Journey p{font-size:10px}#f259Journey small{font-size:10px}#f259Journey .kicker{font-size:8px}#f259Story{bottom:24%;font-size:13px;padding:9px 13px}#f259Return{top:calc(180px + env(safe-area-inset-top,0px));left:8px}}
 @media(max-height:430px){#f259Journey{top:67px;max-height:57vh;overflow:auto}#f259Return{top:67px}#f259Story{bottom:12%}}
 body.f172-front #f259Journey,body.f172-front #f259Story,body.f172-front #f259Return,body.f172-front #f259ClueHint{display:none!important}
 `;
 const style=document.createElement('style');style.id='f259-journey-style';style.textContent=css;document.head.appendChild(style);
 const board=document.createElement('section');board.id='f259Journey';board.hidden=true;board.setAttribute('aria-label','Jornada inicial');board.innerHTML=`<div class="hdr"><span class="kicker">FLORESTA · PRIMEIRA JORNADA</span><button type="button" id="f259Hide" aria-label="Ocultar orientações">Ocultar</button></div><h3 id="f259Title"></h3><p id="f259Desc"></p><div class="line"></div><small id="f259Tasks"></small><div id="f259ClueHint" hidden></div>`;
 const returnBtn=document.createElement('button');returnBtn.id='f259Return';returnBtn.type='button';returnBtn.textContent='Jornada ▸';returnBtn.hidden=true;
 const story=document.createElement('div');story.id='f259Story';story.hidden=true;story.setAttribute('role','status');story.setAttribute('aria-live','polite');
 document.body.append(board,returnBtn,story);
 const captions=[
  ['Despertar','Ande pela floresta e observe o ambiente.','Use os controles de movimento e procure galhos e pedras pelo chão.'],
  ['Primeiros recursos','Colete um galho e uma pedra.','Aproxime-se dos materiais no chão e use a coleta normal do jogo.'],
  ['Primeira ferramenta','Monte um machado de pedra.','Abra a fabricação e monte o machado com 1 galho e 1 pedra.'],
  ['Prepare seu abrigo','Posicione uma proteção e prepare a tocha.','Use Construção para começar uma parede ou outra peça. A proteção e a luz ajudam à noite.'],
  ['A primeira noite','Sobreviva até o amanhecer.','Procure abrigo, defenda-se e observe o comportamento das criaturas.'],
  ['Depois da noite','Investigue a pedra marcada perto de você.','Uma pequena marca antiga apareceu nas proximidades. Aproximar-se dela revelará a próxima pista.'],
  ['A jornada continua','Explore as montanhas quando estiver preparado.','Lá existem minérios e novas ameaças. A jornada inicial foi concluída.']
 ];
 let state=null,started=false,sessionStart=0,lastPosition=null,clue=null,clueRoot=null,storyTimeout=null,lastPersist=0,oldStep=-1,shownDusk=false;
 function showStory(msg,ms=8500){if(!started||state?.hidden||!alive())return;story.textContent=msg;story.hidden=false;clearTimeout(storyTimeout);storyTimeout=setTimeout(()=>story.hidden=true,ms)}
 function save(force=false){if(!state)return;const now=Date.now();if(force||now-lastPersist>=9000){lastPersist=now;safeWrite(state)}}
 function panel(){
  if(!started||!state||!alive()||!state.active){board.hidden=true;returnBtn.hidden=true;story.hidden=true;return}
  board.hidden=state.hidden;returnBtn.hidden=!state.hidden;
  const s=state.step,title=captions[s]||captions[6];$('f259Title').textContent=title[0];$('f259Desc').textContent=title[1];
  let sub=title[2];
  if(s===0)sub=`${Math.min(100,Math.floor(state.walked/6*100))}% · ${title[2]}`;
  if(s===1)sub=`${state.flags.branch?'✓':'○'} Galho  ·  ${state.flags.rock?'✓':'○'} Pedra\n${title[2]}`;
  if(s===3)sub=`${state.flags.build?'✓':'○'} Começar uma construção  ·  ${state.flags.torch?'✓':'○'} Equipar a tocha\n${title[2]}`;
  $('f259Tasks').textContent=sub;
  $('f259Tasks').style.whiteSpace='pre-line';
  $('f259ClueHint').hidden=s!==5;
  if(s===5)$('f259ClueHint').textContent='Siga a marca discreta de pedra no terreno.';
 }
 function newStep(step){if(!state||state.step===step)return;state.step=step;if(step===6){state.completed=true;state.clueFound=true;removeClue()}save(true);panel();if(step!==oldStep){oldStep=step;showStory(NARRATIVE[step]||NARRATIVE[6],step===6?10500:7500)}}
 function ground(x,z){try{const val=window.gameReview?.groundY?.(x,z);if(Number.isFinite(val))return val}catch{}return 0}
 function spawnClue(){
  if(!started||state?.step!==5||clueRoot)return;
  const T=window.__THREE_MODULE,g=window.gameReview;
  if(!T?.Group||!g?.scene||!g?.player)return;
  let x=g.player.x+8*Math.sin(g.player.yaw+.35),z=g.player.z+8*Math.cos(g.player.yaw+.35);const y=ground(x,z);
  if(!Number.isFinite(x)||!Number.isFinite(z)||!Number.isFinite(y))return;
  const group=new T.Group();group.name='V259_Marca_Antiga_NaoColisao';group.position.set(x,y+.08,z);
  const stone=new T.Mesh(new T.DodecahedronGeometry(.55,0),new T.MeshStandardMaterial({color:0x555e57,roughness:1,flatShading:true}));stone.scale.set(1.18,.9,.74);stone.position.y=.33;
  const symbolMat=new T.MeshBasicMaterial({color:0xc6a278,transparent:true,opacity:.67,depthWrite:false});
  const bars=[[-.16,.38,.12],[.06,.44,-.27],[.17,.33,.13]];
  bars.forEach(([bx,by,rz])=>{const bar=new T.Mesh(new T.BoxGeometry(.065,.39,.04),symbolMat);bar.position.set(bx,by,.41);bar.rotation.z=rz;group.add(bar)});
  group.add(stone);g.scene.add(group);clueRoot=group;clue={x,z,created:Date.now(),materials:[stone.material,symbolMat],geo:stone.geometry};
 }
 function removeClue(){if(!clueRoot)return;clueRoot.parent?.remove(clueRoot);clueRoot.traverse(o=>{o.geometry?.dispose?.();if(o.material&&!Array.isArray(o.material))o.material.dispose?.()});clueRoot=null;clue=null}
 function update(){
  if(!started||!state||!state.active)return;
  if(!alive()){board.hidden=true;returnBtn.hidden=true;story.hidden=true;return}
  const g=window.gameReview,inv=window.gameInventory,dn=g?.dayNight;if(!g?.player||!inv||!dn)return;
  const now=performance.now(),pt={x:g.player.x,z:g.player.z};
  if(lastPosition){const dist=Math.hypot(pt.x-lastPosition.x,pt.z-lastPosition.z);if(dist<5&&dist>.015&&state.walked<6.5)state.walked+=dist}
  lastPosition=pt;
  const count=id=>Number(inv.items.find(it=>it.id===id)?.quantity)||0;
  const f=state.flags;
  if(count('branch')>0)f.branch=true;
  if(count('rock')>0)f.rock=true;
  if(count('axe')>0||g?.rightHand?.current==='axe'||window.gameRightHand?.current==='axe')f.axe=true;
  if(g.isEquipped?.()||g.torchRoot?.visible===true)f.torch=true;
  const sites=window.gameConstruction?.sites;
  if(Array.isArray(sites)&&sites.some(s=>Number(s.count)>0||s.complete))f.build=true;
  const day=Number(dn.day)||1,hour=Number(dn.hour)||12;
  if(!state.nightSeen&&day===1&&(hour>=19||hour<5.8)){state.nightSeen=true;newStep(4)}
  if(!shownDusk&&day===1&&hour>=17&&hour<19&&!state.nightSeen){shownDusk=true;showStory('A luz está morrendo. Prepare o que puder antes de escurecer.',7000)}
  if(!state.dawnSeen&&(day>=2||state.nightSeen&&hour>=6&&hour<15)){state.dawnSeen=true;newStep(5)}
  if(state.step<4&&!state.nightSeen){
   if(state.step===0&&state.walked>=6)newStep(1);
   if(state.step===1&&f.branch&&f.rock)newStep(2);
   if(state.step===2&&f.axe)newStep(3);
   if(state.step===3&&f.build&&f.torch){/* preparado: não antecipa a primeira noite */}
   if(state.step<3&&f.axe)newStep(3);
  }
  if(state.step===5){
   spawnClue();
   if(clue&&Math.hypot(pt.x-clue.x,pt.z-clue.z)<2.1)newStep(6);
  }
  // Não persiste a cada frame. Progresso de viagem também é salvo no JSON exportado.
  save();panel();
 }
 $('f259Hide').addEventListener('click',()=>{state.hidden=true;save(true);panel();story.hidden=true});
 returnBtn.addEventListener('click',()=>{state.hidden=false;save(true);panel();showStory(NARRATIVE[Math.min(6,state.step)],4000)});
 function activate(){
  if(started||window.gameTestMode?.active)return;
  const isNew=sessionStorage.getItem(FRESH)==='1';if(isNew)sessionStorage.removeItem(FRESH);
  let saved=read();
  if(!saved&&!isNew){return} // Saves da V258 não entram automaticamente num tutorial antigo.
  state=isNew?DEFAULT():saved;started=true;sessionStart=performance.now();lastPosition=null;
  if(isNew){save(true);const wake=document.createElement('div');wake.id='f259Wake';wake.setAttribute('aria-hidden','true');document.body.appendChild(wake);setTimeout(()=>wake.remove?.(),4500);showStory(NARRATIVE[0],11000)}
  panel();window.dispatchEvent(new CustomEvent('floresta:journey-ready',{detail:{newGame:isNew}}));
 }
 window.addEventListener('floresta:started',e=>{if(e.detail?.mode==='survival')activate();else{board.hidden=true;returnBtn.hidden=true;removeClue()} });
 // Em trocas de slot a página recarrega: não mistura progresso de partidas diferentes.
 let interval=setInterval(update,600);
 window.addEventListener('pagehide',()=>{if(!window.__FLORESTA_STORAGE_SWAP_V255)save(true);clearInterval(interval);clearTimeout(storyTimeout);removeClue()}, {once:true});
 window.gameFirstJourneyV259={get state(){return state?JSON.parse(JSON.stringify(state)):null},start:()=>{if(window.gameFront172?.started){state=DEFAULT();started=true;save(true);showStory(NARRATIVE[0]);panel();return true}return false},toggle:()=>{if(!state)return;state.hidden=!state.hidden;save(true);panel()}};
})();
