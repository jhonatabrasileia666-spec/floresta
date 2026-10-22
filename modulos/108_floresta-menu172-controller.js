/* Floresta V255: perfil + mundo no mesmo save (compatibilidade V172). */
(()=>{
 const F=window.gameFront172,$=id=>document.getElementById(id),shell=F.shell,KEY='floresta-character-v172',PENDING='floresta-character-pending-v172';
 const systems=[['Motor 3D',()=>!!window.__THREE_MODULE],['Cena e câmera',()=>!!window.gameReview?.renderer],['Inventário',()=>!!window.gameInventory],['Ciclo de dia e noite',()=>!!window.gameReview?.dayNight],['Inimigos',()=>!!window.gameZombie],['Progressão',()=>!!window.gameProgression],['Sobrevivência e criativo',()=>!!window.gameTestMode],['Ferramentas e armas',()=>!!window.gameRightHand],['Craft e equipamento',()=>!!window.gamePrimitive],['Visual Retro PSX',()=>!!window.gameGraphics],['Floresta',()=>!!window.gameForestV100?.ready],['Corpo e animações',()=>!!window.gameReview?.trueFirstPerson],['Cogumelos animados',()=>!!window.gameMushroomMonster?.ready],['Plantas e materiais',()=>!!window.gameV170Flora?.state?.ready]];
 let panel=null,lastFocus=null,initialDayPaused=false,bootAt=Date.now(),storageError='',loadQueued=null;
 // V255: o arquivo exportado e o slot salvo passam a conter o mundo inteiro.
 // Estes são os armazenamentos de gameplay; preferências gráficas/touch permanecem globais.
 const WORLD_KEYS=Object.freeze({construction:'floresta.construction.v222.world',alchemy:'Floresta_V195_Alquimia_Progress',cave:'floresta-cave-v186',potion:'floresta-potion-slot-v219',onboarding:'floresta-onboarding-v259',bestiary:'floresta-bestiary-found-v273'});
 const ACTIVE_KEYS=[...Object.values(WORLD_KEYS),'floresta-progression-v52','floresta-ignis-legacy-v116','floresta-survival-day-v56','floresta-world-id-v255'];
 const BACKUP='floresta-save-backup-v255', ACTIVE_BACKUP='floresta-world-recovery-v255';
 const parse=(raw,fallback)=>{try{return raw===null?fallback:JSON.parse(raw)}catch{return fallback}};
 function ensureWorldId(){let id=localStorage.getItem('floresta-world-id-v255');if(!id){id=(globalThis.crypto?.randomUUID?.()||'world-'+Date.now().toString(36)+'-'+Math.random().toString(36).slice(2));localStorage.setItem('floresta-world-id-v255',id)}return id;}
 function getWorldSnapshot(){
  // Força o salvamento dos sistemas em memória, antes de capturar as chaves.
  window.gameConstruction?.flush?.();window.gameConstruction?.save?.();window.gameHerbalAlchemy?.save?.();
  const a=parse(localStorage.getItem(WORLD_KEYS.alchemy),{}),c=parse(localStorage.getItem(WORLD_KEYS.cave),{});
  return {schema:1,worldId:ensureWorldId(),construction:window.gameConstruction?.snapshot?.()||parse(localStorage.getItem(WORLD_KEYS.construction),{schema:1,sites:[]}),alchemy:{discovered:Array.isArray(a?.discovered)?a.discovered:[],effects:{wardUntil:Number(a?.effects?.wardUntil)||0,sightUntil:Number(a?.effects?.sightUntil)||0},benches:Array.isArray(a?.benches)?a.benches:[],racks:Array.isArray(a?.racks)?a.racks:[]},cave:{queenDead:!!c?.queenDead,reward:!!c?.reward},potionSlot:localStorage.getItem(WORLD_KEYS.potion),journey:parse(localStorage.getItem(WORLD_KEYS.onboarding),null),bestiary:parse(localStorage.getItem(WORLD_KEYS.bestiary),[])};
 }
 function validateWorld(world){
  if(!world||world.schema!==1||typeof world.worldId!=='string'||world.worldId.length>100||!world.worldId)throw Error('Identificação do mundo inválida.');
  const build=world.construction;
  if(!build||build.schema!==1||!Array.isArray(build.sites)||build.sites.length>3000)throw Error('Construções inválidas no arquivo.');
  for(const r of build.sites){if(!r||typeof r.id!=='string'||r.id.length>90||!['x','y','z','yaw'].every(k=>Number.isFinite(r[k])&&Math.abs(r[k])<100000)||!Number.isInteger(r.count)||r.count<0||r.count>500)throw Error('Peça de construção inválida.');}
  const a=world.alchemy;
  if(!a||!Array.isArray(a.discovered)||a.discovered.length>300||!a.discovered.every(x=>typeof x==='string'&&x.length<120)||!Array.isArray(a.benches)||a.benches.length>500||!Array.isArray(a.racks)||a.racks.length>500)throw Error('Dados de alquimia inválidos.');
  for(const r of [...a.benches,...a.racks]){if(!r||!['x','y','z','yaw'].every(k=>Number.isFinite(r[k])&&Math.abs(r[k])<100000)||!Number.isFinite(r.count)||r.count<0||r.count>50)throw Error('Bancada ou varal inválido.');}
  if(!world.cave||typeof world.cave.queenDead!=='boolean'||typeof world.cave.reward!=='boolean')throw Error('Dados da caverna inválidos.');
  if(world.potionSlot!==null&&(typeof world.potionSlot!=='string'||world.potionSlot.length>120))throw Error('Poção selecionada inválida.');
  if(world.journey!=null&&(typeof world.journey!=='object'||world.journey.version!==1||!Number.isInteger(world.journey.step)||world.journey.step<0||world.journey.step>6||JSON.stringify(world.journey).length>4096))throw Error('Jornada inicial inválida.');
  if(world.bestiary!==undefined&&(!Array.isArray(world.bestiary)||world.bestiary.length>80||!world.bestiary.every(x=>typeof x==='string'&&x.length<72)))throw Error('Descobertas do bestiário inválidas.');
  return world;
 }
 function transaction(steps){
  // localStorage não tem transações. Guarda valores anteriores e desfaz em caso de QuotaExceeded/erro.
  const before=new Map();
  try{for(const [key,value] of steps){if(!before.has(key))before.set(key,localStorage.getItem(key));if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value);}return true;}
  catch(err){for(const [key,value] of [...before].reverse()){try{if(value===null)localStorage.removeItem(key);else localStorage.setItem(key,value)}catch(e){console.error('[SAVE V255] rollback incompleto',key,e)}}throw err;}
 }
 function activeSnapshot(){
  const values={};let has=false;
  for(const key of ACTIVE_KEYS){const v=localStorage.getItem(key);if(v!==null){has=true;values[key]=v;}}
  return has?JSON.stringify({schema:1,savedAt:new Date().toISOString(),values}):null;
 }
 function backupActive(){
  // Backup do mundo atual; nunca limpa o arquivo de perfil salvo.
  const data=activeSnapshot();if(data!==null)localStorage.setItem(ACTIVE_BACKUP,data);
 }
 function saveUnified(p){
  validate(p);const previous=localStorage.getItem(KEY),steps=[];
  if(previous!==null)steps.push([BACKUP,previous]);
  steps.push([KEY,JSON.stringify(p)]);transaction(steps);
  return true;
 }
 function stageProfile(p){
  validate(p);
  const world=p.version===2?p.world:null;
  const steps=[];
  const recovery=activeSnapshot();if(recovery!==null)steps.push([ACTIVE_BACKUP,recovery]);
  const current=localStorage.getItem(KEY);
  if(current!==null)steps.push([BACKUP,current]);
  // Um perfil V1 não possui dados do mundo. Limpar as chaves evita misturar outro save.
  for(const key of Object.values(WORLD_KEYS)){
   let value=null;
   if(world){
    if(key===WORLD_KEYS.construction)value=JSON.stringify(world.construction);
    else if(key===WORLD_KEYS.alchemy)value=JSON.stringify(world.alchemy);
    else if(key===WORLD_KEYS.cave)value=JSON.stringify(world.cave);
    else if(key===WORLD_KEYS.potion)value=world.potionSlot;
    else if(key===WORLD_KEYS.onboarding)value=world.journey==null?null:JSON.stringify(world.journey);
    else if(key===WORLD_KEYS.bestiary)value=JSON.stringify(world.bestiary||[]);
   }
   steps.push([key,value]);
  }
  steps.push(['floresta-world-id-v255',world?.worldId||null],['floresta-progression-v52',JSON.stringify(p.progress)],['floresta-ignis-legacy-v116',JSON.stringify(p.legacy)],['floresta-survival-day-v56',String(p.day)],[KEY,JSON.stringify(p)],[PENDING,JSON.stringify(p)]);
  transaction(steps);
  window.__FLORESTA_STORAGE_SWAP_V255=true; // impedir saves antigos no beforeunload/pagehide
 }
 function resetWorldForNewGame(){
  backupActive();
  transaction(ACTIVE_KEYS.map(key=>[key,null]).concat([[PENDING,null]]));
  window.__FLORESTA_STORAGE_SWAP_V255=true;
 }
 const read=key=>{try{return JSON.parse(localStorage.getItem(key)||'null')}catch{return null}};
 const write=(key,v)=>{try{localStorage.setItem(key,JSON.stringify(v));return true}catch{storageError='O navegador não permitiu salvar este perfil. Use Exportar para guardar um arquivo.';return false}};
 function message(text){$('f172Message').textContent=text;}
 function updateContinue(){shell.querySelector('[data-action=continue]').disabled=!F.started&&!read(KEY);}
 function hidePanel(){panel=null;$('f172Panel').hidden=true;$('f172Exited').hidden=true;document.body.classList.remove('f172-settings');window.gameHud171?.close();shell.dataset.view='menu';lastFocus?.focus();}
 function showPanel(title,html){lastFocus=document.activeElement;panel=title;shell.dataset.view='panel';$('f172PanelTitle').textContent=title;$('f172PanelBody').innerHTML=html;$('f172Panel').hidden=false;$('f172Back').focus();}
 function clearInput(){const g=window.gameReview;g?.keys?.clear();if(g?.stick)g.stick.x=g.stick.y=0;window.gamePrimitive?.cancelSpear?.();}
 function openMenu(){if(!F.ready)return;clearInput();F.pause();shell.dataset.view='menu';shell.hidden=false;document.body.classList.add('f172-front');hidePanel();updateContinue();message(F.started?'Partida pausada.':'');shell.querySelector(F.started?'[data-action=continue]':'[data-action=new]').focus();}
 function play(mode='survival'){
  if(!F.ready)return false;
  hidePanel();clearInput();document.querySelectorAll('#mobileStartOverlay,#rotatePhoneNotice').forEach(e=>{if(e.id==='mobileStartOverlay')e.remove();});
  // These are the existing game entry handlers, including creative inventory and arena.
  if(!F.started){const c=$('c'),request=c?.requestPointerLock,automatic=navigator.userActivation&&!navigator.userActivation.isActive;try{if(automatic&&request)c.requestPointerLock=()=>Promise.resolve();if(mode==='creative')$('modeTestV112').click();else $('modeSurvivalV112').click();}finally{if(automatic&&request)c.requestPointerLock=request;}}
  F.started=true;F.resume();shell.hidden=true;document.body.classList.remove('f172-front','f172-settings');window.gameHud171?.close();updateContinue();
  if(matchMedia('(pointer:fine)').matches&&navigator.userActivation?.isActive){try{$('c')?.requestPointerLock?.()?.catch?.(()=>{});}catch{}}
  window.dispatchEvent(new CustomEvent('floresta:started',{detail:{mode}}));return true;
 }
 function profile(){
  if(!F.started||window.gameTestMode?.active||document.body.classList.contains('crafting-active'))return null;
  const g=window.gameReview;return {format:'floresta-character',version:2,world:getWorldSnapshot(),savedAt:new Date().toISOString(),player:window.gameSpiderCave?.active?(window.gameSpiderCave.state.returnTo||{x:-15,z:-59,yaw:0,pitch:0}):{x:g.player.x,z:g.player.z,yaw:g.player.yaw,pitch:g.player.pitch},items:gameInventory.items,progress:JSON.parse(JSON.stringify(gameProgression.state)),legacy:{picked:!!gameIgnisLegacy.picked,choice:gameIgnisLegacy.choice,rank:gameIgnisLegacy.rank},day:g.dayNight.day,hour:g.dayNight.hour,difficulty:window.gameDifficulty?.mode||'normal',appearance:window.gameCharacterV263?.get?.()||null,equipment:{right:window.gameRightHand?.current||null,torch:!!g.isEquipped?.(),armor:!!window.gamePrimitive?.armorEquipped,shield:!!window.gameShield?.equipped,forgedRight:window.gameForgedEquipmentV230?.right||null,forgedShield:window.gameForgedEquipmentV230?.left||null}};
 }
 function validate(p){
  if(!p||p.format!=='floresta-character'||![1,2].includes(p.version)||!Array.isArray(p.items)||p.items.length>100)throw Error('Arquivo de perfil incompatível.');
  for(const k of ['x','z','yaw','pitch'])if(!Number.isFinite(p.player?.[k])||Math.abs(p.player[k])>2000)throw Error('Posição inválida no perfil.');
  if(!Number.isFinite(p.day)||p.day<1||p.day>99999||!Number.isFinite(p.hour)||p.hour<0||p.hour>=24)throw Error('Dia ou horário inválido.');
  for(const i of p.items)if(typeof i.id!=='string'||typeof i.name!=='string'||/[<>]/.test(i.name+i.description)||!Number.isFinite(i.quantity)||i.quantity<1||i.quantity>100000)throw Error('Inventário inválido.');
  const st=p.progress;if(!st||!Number.isFinite(st.level)||st.level<1||st.level>10000||!Number.isFinite(st.xp)||st.xp<0||!Number.isFinite(st.skillPoints)||st.skillPoints<0||!st.skills)throw Error('Progressão inválida.');
  for(const k of ['strength','vitality','resistance','hunter'])if(!Number.isInteger(st.skills[k])||st.skills[k]<0||st.skills[k]>5)throw Error('Habilidades inválidas.');
  if(p.appearance!=null){if(!['raspado','curto','medio','longo'].includes(p.appearance.style)||!/^#[0-9a-fA-F]{6}$/.test(p.appearance.color)||!Number.isFinite(p.appearance.size)||p.appearance.size<.8||p.appearance.size>1.2)throw Error('Aparência inválida no perfil.');}
  if(p.legacy?.choice&&!['pillars','fireball','stream'].includes(p.legacy.choice))throw Error('Poder inválido.');if(p.version===2)validateWorld(p.world);return p;
 }
 function loadProfile(p){
  try{stageProfile(p);location.reload();}catch(e){$('f172ProfileStatus').textContent='Não foi possível carregar sem alterar o mundo atual: '+e.message;}
 }
 function restoreProfile(p){
  validate(p);const inv=gameInventory;for(const i of inv.items)inv.removeItem(i.id,i.quantity);for(const i of p.items)inv.addItem(i);
  if(p.appearance)window.gameCharacterV263?.apply?.(p.appearance);
  if(p.difficulty)window.gameDifficulty?.set(p.difficulty);
  Object.assign(gameProgression.state,p.progress);gameProgression.refresh();Object.assign(gameReview.player,p.player);gameReview.player.bodyYaw=p.player.yaw;gameReview.dayNight.setDay(p.day);gameReview.dayNight.setHour(p.hour);
  if(p.equipment?.right)window.gameRightHand?.equip?.(p.equipment.right);
  if(p.equipment?.torch!==!!gameReview.isEquipped?.())$('equipBtn')?.click();if(p.equipment?.armor&&!gamePrimitive.armorEquipped)gamePrimitive.equipArmor();if(p.equipment?.shield&&!gameShield.equipped)gameShield.equip?.();if(p.equipment?.forgedRight)window.gameForgedEquipmentV230?.equip(p.equipment.forgedRight);if(p.equipment?.forgedShield)window.gameForgedEquipmentV230?.equip(p.equipment.forgedShield);
  inv.refresh();
 }
 function profilePanel(){
  const saved=read(KEY);
  showPanel('Salvar / carregar jogo',`<p id="f172ProfileInfo"></p><button id="f172LoadSlot">Carregar jogo salvo</button><button id="f172Migrate" hidden>Migrar perfil antigo + mundo local</button><button id="f172SaveSlot">Salvar jogo completo</button><button id="f172Export">Exportar jogo (.json)</button><button id="f172Import">Importar jogo (.json)</button><button id="f172RestoreBackup">Recuperar save anterior</button><input id="f172ProfileFile" type="file" accept=".json,application/json" hidden><p id="f172ProfileStatus" role="status"></p><p class="f172-warning">O save V255 inclui personagem, inventário, construções, alquimia e estado da caverna. Arquivos V172 antigos ainda podem ser importados, mas não incluem construções.</p>`);
  $('f172ProfileInfo').textContent=saved?`Save de ${new Date(saved.savedAt).toLocaleString('pt-BR')} · Dia ${saved.day} · ${saved.version===2?'Mundo completo':'Perfil antigo (sem mundo)'}`:'Nenhum save de personagem encontrado neste navegador.';
  $('f172LoadSlot').disabled=!saved;$('f172SaveSlot').disabled=!profile();$('f172Export').disabled=!profile()&&!saved;
  $('f172RestoreBackup').disabled=!read(BACKUP);
  const build=parse(localStorage.getItem(WORLD_KEYS.construction),{}),alch=parse(localStorage.getItem(WORLD_KEYS.alchemy),{}),cave=parse(localStorage.getItem(WORLD_KEYS.cave),{});
  const hasOldWorld=!!(build?.sites?.length||alch?.discovered?.length||alch?.benches?.length||alch?.racks?.length||cave?.queenDead||cave?.reward);
  $('f172Migrate').hidden=!(saved?.version===1&&hasOldWorld);
  $('f172Migrate').onclick=()=>{try{if(!confirm('Juntar o perfil antigo às construções e à alquimia que estão neste navegador? Faça isso apenas se pertencem à mesma partida.'))return;const migrated={...saved,version:2,world:getWorldSnapshot(),savedAt:new Date().toISOString()};loadProfile(validate(migrated));}catch(e){$('f172ProfileStatus').textContent=e.message;}};
  $('f172LoadSlot').onclick=()=>{if(saved?.version===1&&hasOldWorld&&!confirm('Este perfil antigo NÃO inclui construções e alquimia. Carregar apenas o personagem reiniciará o mundo ativo. Deseja mesmo continuar?'))return;loadProfile(saved);};
  $('f172SaveSlot').onclick=()=>{try{const p=profile();if(!p)throw Error('Inicie uma partida de sobrevivência.');saveUnified(p);$('f172ProfileStatus').textContent='Jogo salvo: personagem e mundo juntos.';updateContinue();$('f172LoadSlot').disabled=false;$('f172LoadSlot').onclick=()=>loadProfile(p);$('f172ProfileInfo').textContent=`Save de ${new Date(p.savedAt).toLocaleString('pt-BR')} · Dia ${p.day} · Mundo completo`;$('f172RestoreBackup').disabled=!read(BACKUP);}catch(e){$('f172ProfileStatus').textContent='Falha ao salvar: '+e.message;}};
  $('f172Export').onclick=()=>{try{const p=profile()||saved;if(!p)throw Error('Nenhum jogo para exportar.');validate(p);const url=URL.createObjectURL(new Blob([JSON.stringify(p,null,2)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=p.version===2?'Floresta_Save_Completo.json':'Floresta_Perfil_Legado.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}catch(e){$('f172ProfileStatus').textContent=e.message;}};
  $('f172Import').onclick=()=>$('f172ProfileFile').click();$('f172ProfileFile').onchange=async e=>{const f=e.target.files[0];if(!f)return;try{if(f.size>12e6)throw Error('O arquivo é grande demais para um save.');const p=validate(JSON.parse(await f.text()));if(p.version===1&&!confirm('Perfil antigo não contém construções ou alquimia. Ao carregar, o mundo ativo será limpo (os dados atuais ficarão na cópia de recuperação). Continuar?'))return;loadProfile(p);}catch(err){$('f172ProfileStatus').textContent=err.message;}e.target.value='';};
  $('f172RestoreBackup').onclick=()=>{try{const p=validate(read(BACKUP));if(!confirm('Recuperar o save anterior? O save atual ficará disponível como cópia de segurança.'))return;loadProfile(p);}catch(e){$('f172ProfileStatus').textContent='Backup inválido: '+e.message;}};
 }

 const DIFF_PICKER=`<div id="f182DifficultyPicker" style="padding:12px 0 16px;color:#e7ddcb"><div style="font-weight:800;letter-spacing:.08em;margin-bottom:9px">INTELIGÊNCIA DOS MONSTROS</div><div style="display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px">${[['easy','Fácil','Reações lentas'],['normal','Normal','Comportamento padrão'],['hard','Hard','Prevê e contra-ataca'],['hardcore','Hardcore','Estratégia e pressão máxima']].map(([id,name,desc])=>`<button type="button" data-v182-mode="${id}" style="display:flex;flex-direction:column;gap:4px;align-items:flex-start;padding:10px;border:1px solid #85725a;border-radius:6px;background:#201d1a;color:#f2e9db;cursor:pointer;text-align:left"><strong>${name}</strong><small style="opacity:.75">${desc}</small></button>`).join('')}</div><p style="font-size:12px;opacity:.78;margin:9px 0 0">Muda as decisões dos inimigos. Não ativa morte permanente.</p></div>`;
 function bindDifficultyPicker(){
  const current=window.gameDifficulty?.mode||'normal';
  document.querySelectorAll('[data-v182-mode]').forEach(b=>{
   const active=b.dataset.v182Mode===current;
   b.style.borderColor=active?'#e5b55e':'#776655';b.style.boxShadow=active?'inset 0 0 0 1px #e5b55e':'none';
   b.setAttribute('aria-pressed',String(active));
   b.onclick=()=>{window.gameDifficulty?.set(b.dataset.v182Mode);bindDifficultyPicker();
    const info=document.getElementById('f182DifficultyInfo');if(info)info.textContent='Dificuldade selecionada: '+window.gameDifficulty.preset.label;
   };
  });
 }

 function startFreshSurvival(){
  try{resetWorldForNewGame();sessionStorage.setItem('floresta-v259-new-journey','1');sessionStorage.setItem('floresta-new-v172','survival');location.reload();}
  catch(e){message('Não foi possível preparar um mundo novo com segurança: '+e.message);console.error('[SAVE V255] Novo jogo bloqueado',e);}
 }
 function newGame(){
  if(F.started){showPanel('Nova partida','<p>Uma nova partida começa com construções, alquimia, chefes e progressão zerados. O jogo salvo no slot continua disponível para carregar. Salve primeiro se quiser guardar a partida atual.</p><button id="f172ConfirmNew">Iniciar nova partida</button>');$('f172ConfirmNew').onclick=startFreshSurvival;return;}
  showPanel('Escolha o modo',DIFF_PICKER+'<button class="mode-card" id="f172Survival"><strong>Sobrevivência</strong>Floresta, crafting manual, progressão e noites perigosas.</button><button class="mode-card" id="f172Creative"><strong>Teste / Criativo</strong>Arena branca, materiais infinitos, poderes e spawn livre.</button>');bindDifficultyPicker();$('f172Survival').onclick=startFreshSurvival;$('f172Creative').onclick=()=>play('creative');
 }

 shell.querySelectorAll('[data-action]').forEach(b=>b.onclick=()=>{
  if(b.disabled)return;
  switch(b.dataset.action){
   case 'continue':if(F.started)play(window.gameTestMode?.active?'creative':'survival');else profilePanel();break;
   case 'new':newGame();break;
   case 'load':profilePanel();break;
   case 'settings':document.body.classList.add('f172-settings');window.gameHud171.open();$('h171Close').focus();break;
   case 'credits':showPanel('Créditos','<p><strong>FLORESTA</strong></p><p>Um jogo independente de sobrevivência e fantasia.</p><p>Direção visual dos menus baseada nas referências fornecidas para o projeto.</p><p>Esta versão preserva os modelos, animações, áudio e sistemas da base do jogo. Os créditos e avisos de licença incluídos nos arquivos originais continuam preservados.</p>');break;
   case 'exit':F.pause();shell.dataset.view='exit';$('f172Exited').hidden=false;$('f172Return').focus();break;
  }
 });
 $('f172Back').onclick=()=>{if(F.ready){hidePanel();if(F.started&&shell.dataset.view==='menu')message('Partida pausada.');}};$('f172Return').onclick=hidePanel;$('f172Retry').onclick=()=>location.reload();
 // Menu-only keyboard navigation never dispatches gameplay actions.
 F.handleKey=e=>{
  if(document.body.classList.contains('f172-settings'))return;
  const buttons=[...shell.querySelectorAll('button')].filter(b=>!b.disabled&&b.offsetParent!==null);const i=buttons.indexOf(document.activeElement);
  if(e.code==='ArrowDown'||e.code==='ArrowUp'){e.preventDefault();buttons[(i+(e.code==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}
  if(e.code==='Tab'&&buttons.length){if(e.shiftKey&&document.activeElement===buttons[0]){e.preventDefault();buttons.at(-1).focus();}else if(!e.shiftKey&&document.activeElement===buttons.at(-1)){e.preventDefault();buttons[0].focus();}}
 };
 document.body.classList.add('f172-front');
 let lastProgress=0;const timer=setInterval(()=>{
  const count=systems.filter(([,check])=>{try{return check()}catch{return false}}).length,percent=Math.round(count/systems.length*100);lastProgress=Math.max(lastProgress,percent);
  $('f172Fill').style.width=lastProgress+'%';$('f172Percent').textContent=lastProgress+'%';shell.querySelector('[role=progressbar]').setAttribute('aria-valuenow',lastProgress);$('f172Stage').textContent=systems.find(([,check])=>!check())?.[0]||'Floresta pronta';
  if(!F.ready&&count===systems.length){
   F.ready=true;clearInterval(timer);clearInput();F.pause();shell.dataset.view='menu';updateContinue();shell.querySelector('[data-action=new]').focus();
   const b=document.createElement('button');b.id='f172MenuBtn';b.textContent='Menu principal';b.onclick=openMenu;$('h171Native')?.prepend(b);
   // Open difficulty panel from main menu, including an already-running game.
   const db=document.createElement('button');db.id='f182MenuDifficulty';db.innerHTML='<span style="font-size:18px;line-height:1">⚔</span>Dificuldade dos monstros';
   db.onclick=()=>{showPanel('Inteligência dos monstros',DIFF_PICKER+'<p id="f182DifficultyInfo" aria-live="polite"></p>');bindDifficultyPicker();};
   shell.querySelector('[data-action=settings]')?.after(db);
   // Existing native utility controls remain available inside the real options panel.
   $('h171Close')?.addEventListener('click',()=>document.body.classList.remove('f172-settings'));
   if(sessionStorage.getItem('floresta-new-v172')){sessionStorage.removeItem('floresta-new-v172');gameProgression.reset();gameIgnisLegacy.reset();gameReview.dayNight.resetDay();gameReview.dayNight.setHour(12);gameZombie.healPlayer(99999);play('survival');}
   const p=read(PENDING);if(p){localStorage.removeItem(PENDING);try{restoreProfile(p);play('survival');}catch(e){message(e.message);}}
   window.dispatchEvent(new CustomEvent('floresta:ready'));
  }
  if(!F.ready&&Date.now()-bootAt>90000){$('f172Stage').textContent='Preparação em andamento';$('f172Tip').textContent='Ainda aguardando: '+systems.filter(([,check])=>!check()).map(([s])=>s).join(', ');$('f172Retry').hidden=false;}
 },180);
 // Escape still opens the existing HUD options during play. Menu principal is in that panel.
 F.showPanel=showPanel;F.open=openMenu;F.play=play;F.saveProfile=()=>{try{const p=profile();return !!p&&saveUnified(p)}catch(e){console.warn('[SAVE V255] Salvamento falhou',e);return false}};F.getProfile=profile;F.validateProfile=validate;F.validateWorld=validateWorld;F.getWorldSnapshot=getWorldSnapshot;F.version=window.FlorestaBuild?.version||'V258';
 window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
})();
