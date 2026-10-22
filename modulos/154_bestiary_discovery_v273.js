/* FLORESTA V273 — Diario de criaturas: descoberta real por proximidade, save por mundo. */
(()=>{'use strict';
const v276Platform=new URLSearchParams(location.search).get('platform');
 if((v276Platform==='pc'||(v276Platform!=='mobile'&&window.__CAVE_PLATFORM!=='mobile'))||window.gameBestiaryDiscoveryV273)return;
const KEY='floresta-bestiary-found-v273',WORLD='floresta-world-id-v255';
const allowed=new Set(['skeleton','wolf','necromancer','centaur-skeleton','centaur-fire','spider']);
let ids=new Set(),worldId=null,lastTick=0;
const read=()=>{try{const a=JSON.parse(localStorage.getItem(KEY)||'[]');return new Set(Array.isArray(a)?a.filter(id=>allowed.has(id)):[])}catch{return new Set()}};
function loadWorld(){let id=null;try{id=localStorage.getItem(WORLD)}catch{}
 if(id===worldId)return;
 worldId=id;ids=read();
 window.dispatchEvent(new CustomEvent('floresta:bestiary-updated',{detail:{discovered:[...ids]}}));
}
function found(id){return allowed.has(id)&&ids.has(id);}
function reveal(id){
 if(!allowed.has(id)||ids.has(id))return false;
 loadWorld();if(ids.has(id))return false;
 ids.add(id);
 try{localStorage.setItem(KEY,JSON.stringify([...ids]));}catch(e){console.warn('[Bestiário] Não foi possível salvar encontro',e)}
 window.dispatchEvent(new CustomEvent('floresta:bestiary-updated',{detail:{id,discovered:[...ids]}}));
 return true;
}
function closeEnough(x,z,range){
 const p=window.gameReview?.player;
 if(!p||!Number.isFinite(x)||!Number.isFinite(z))return false;
 return Math.hypot(p.x-x,p.z-z)<=range;
}
function visibleEntity(obj,range=13){
 if(!obj||obj.visible===false||obj.parent===null)return false;
 const position=obj.getWorldPosition?.(visibleEntity.tmp)||obj.position;
 return !!position&&closeEnough(position.x,position.z,range);
}
function nearbyCreature(){
 const undead=window.gameUndeadForces;
 for(const e of undead?.trio||[]){
  if(!e||e.dead||e.hp<=0||!visibleEntity(e.g,13))continue;
  if(e.type==='war')reveal('skeleton');
  else if(e.type==='cent')reveal('centaur-skeleton');
  else if(e.type==='fire')reveal('centaur-fire');
 }
 for(const e of undead?.necromancers||[]){
  if(!e||e.dead||e.hp<=0||!visibleEntity(e.g,14))continue;
  reveal('necromancer');
 }
 const wolf=window.gameWerewolf;
 if(wolf?.root?.visible && wolf.state!==wolf.states?.DORMANT && visibleEntity(wolf.root,14))reveal('wolf');
 for(const spider of window.gameCreativeSpiderMount?.spiders||[]){
  if(spider?.dead)continue;
  if(visibleEntity(spider.pivot||spider.root,17))reveal('spider');
 }
}
function tick(){
 try{
  loadWorld();
  const front=window.gameFront172;
  // Nenhuma descoberta a partir de sprites ilustrativos, renderizações de
  // bestiário, pré-visualizações, spawns fora da visão ou no menu.
  if(!front?.started||!front.shell?.hidden||front.paused||document.hidden)return;
  if(!window.gameReview?.player||!window.__THREE_MODULE)return;
  if(!visibleEntity.tmp)visibleEntity.tmp=new window.__THREE_MODULE.Vector3();
  nearbyCreature();
 }catch(e){if(lastTick!==String(e)){lastTick=String(e);console.warn('[Bestiário] Leitura de encontros:',e)}}
}
const clock=setInterval(tick,650);
window.addEventListener('pagehide',()=>clearInterval(clock),{once:true});
window.gameBestiaryDiscoveryV273={version:'V273',has:found,get discovered(){loadWorld();return [...ids]},refresh:loadWorld};
loadWorld();
})();