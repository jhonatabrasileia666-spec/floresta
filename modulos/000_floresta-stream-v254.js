/* FLORESTA V254 - Stream de recursos: grupos sob demanda, arquivo externo, cache nativo.
   Nao altera camera, controles ou scripts do motor. */
(()=>{'use strict';
const groups={
 dragon:['modulos/120_floresta-mountain-climb-clips-v66.js','modulos/121_floresta-dragons-v52.js','modulos/122_floresta-mountain-dragon-mount-v57.js'],
 trolloc:['modulos/111_v175-trolloc-model-animations.js','modulos/112_v175-trolloc-night-event.js'],
 martial:['modulos/098_v168-mestre-marcial-integrado.js'],
 lutador:['modulos/135_monstro_19_animacoes_v239.js?v='+(window.FlorestaBuild?.number||261)]
};
const urls={cave:'assets/stream/cave186-spiders.json',dragon:'assets/stream/dragons-v51.json'};
const pending=new Map(),ready=new Set(),stats={requested:[],finished:[],errors:[]};
const node=(id)=>document.getElementById(id);
function note(message,error=false){
 let e=node('florestaStreamMessage');
 if(!e){e=document.createElement('div');e.id='florestaStreamMessage';e.setAttribute('aria-live','polite');e.style.cssText='position:fixed;top:8px;left:50%;transform:translateX(-50%);z-index:80000;pointer-events:none;background:#14211bed;color:#e9dfc6;border:1px solid #9a805a;border-radius:8px;padding:7px 12px;font:12px system-ui;max-width:85vw;display:none;';document.body.appendChild(e);}
 e.textContent=message;e.style.display='block';e.style.borderColor=error?'#bc534a':'#9a805a';
 clearTimeout(note.timer);note.timer=setTimeout(()=>{e.style.display='none'},error?7500:1600);
}
async function data(id){
 if(!urls[id])throw Error('Pacote desconhecido: '+id);
 const key='data:'+id;
 if(pending.has(key))return pending.get(key);
 const promise=(async()=>{
  stats.requested.push(urls[id]);
  const r=await fetch(urls[id],{cache:'force-cache'});
  if(!r.ok)throw Error('HTTP '+r.status+' em '+urls[id]);
  const txt=await r.text();
  if(id==='dragon'){
   const el=node('floresta-dragon-assets-v51');if(!el)throw Error('Contêiner de dados dos dragões ausente');
   el.textContent=txt;stats.finished.push(urls[id]);return true;
  }
  const result=JSON.parse(txt);stats.finished.push(urls[id]);return result;
 })();pending.set(key,promise);
 try{const result=await promise;if(id==='cave')pending.delete(key);return result}catch(e){pending.delete(key);stats.errors.push(String(e));throw e;}
}
function script(url){return new Promise((resolve,reject)=>{
 const element=document.createElement('script');element.src=url;element.async=false;
 element.onload=()=>{stats.finished.push(url);resolve()};
 element.onerror=()=>reject(Error('Falha carregando '+url));
 (document.head||document.body).appendChild(element);
 stats.requested.push(url);
});}
async function load(id){
 if(ready.has(id))return true;
 if(pending.has(id))return pending.get(id);
 if(!groups[id])throw Error('Grupo de recursos desconhecido: '+id);
 const work=(async()=>{
  note('Carregando '+({dragon:'dragões',trolloc:'Trolloc',martial:'Mestre Marcial',lutador:'Monstro Lutador'}[id]||id)+'...');
  if(id==='dragon')await data('dragon');
  for(const url of groups[id])await script(url);
  ready.add(id);
  note('Recursos disponíveis: '+id);
  return true;
 })();pending.set(id,work);
 try{return await work}catch(e){pending.delete(id);stats.errors.push(String(e));note('Falha nos recursos '+id+': '+e.message,true);console.error('[FLORESTA STREAM]',id,e);throw e;}
}
function message(text){const e=node('directorMessage');if(e)e.textContent=text;else note(text);}
function preloadNight(){
 const dn=window.gameReview?.dayNight, day=Number(dn?.day)||1,hour=Number.isFinite(Number(dn?.hour))?Number(dn.hour):12;
 if(day>=2&&(hour>=12||hour<6)&&!ready.has('lutador'))load('lutador').catch(()=>{});
 if(day>=6&&!ready.has('trolloc'))load('trolloc').catch(()=>{});
}
let currentCreative=false;
function poll(){
 const creative=!!window.gameTestMode?.active;
 if(creative&&!currentCreative)load('dragon').catch(()=>{});
 currentCreative=creative;
 preloadNight();
 const select=node('directorCreature');
 if(select&&!Array.from(select.options).some(e=>e.value==='lutador-v239')){
  const opt=new Option('Monstro Lutador','lutador-v239');select.add(opt);
 }
}
// O Diretor ja possui listeners sincronizados. Bloquear apenas os spawns que precisam aguardar streaming.
async function handleDirector(event){
 const button=event.target?.closest?.('#directorSpawn,[data-spawn],#directorSpawnLutador239,[data-demon-trolloc]');
 if(!button)return;
 const kind=button.id==='directorSpawnLutador239'?'lutador-v239':button.dataset.demonTrolloc?'demon':(button.dataset.spawn||node('directorCreature')?.value);
 const group=kind==='lutador-v239'?'lutador':kind==='demon'?'trolloc':kind==='martial'?'martial':null;
 if(!group||ready.has(group))return;
 event.preventDefault();event.stopImmediatePropagation();
 message('Carregando '+kind+' antes de invocar...');
 try{
  await load(group);
  // O modulo acabado de carregar pode continuar carregando seus modelos assincronamente.
  const obj=group==='martial'?'gameMartialBoss':group==='trolloc'?'gameDemonBoss':'gameNewMonster';
  for(let i=0;i<400&&!window[obj];i++)await new Promise(r=>setTimeout(r,150));
  const api=window[obj];const n=Math.max(1,Math.min(10,Number(node('directorQuantity')?.value)||1));
  if(api){const ok=api.spawnNow?.()??api.spawn?.(n);message(ok===false?'A criatura ja esta ativa.': 'Invocacao iniciada: '+kind);}
  else throw Error('Modulo iniciou, mas API de spawn ainda indisponivel');
 }catch(e){message('Erro de carregamento: '+e.message)}
}
document.addEventListener('click',handleDirector,true);
window.FlorestaStream={load,data,note,ready,stats,version:window.FlorestaBuild?.version||'V258',get loading(){return Array.from(pending.keys())}};
// Programacao por eventos, sem depender da pagina de menu ou de F1-F12.
setInterval(poll,1200);window.addEventListener('game:day-changed',preloadNight);
})();