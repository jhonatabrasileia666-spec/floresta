/* FLORESTA DUO — ponte do mundo (fase experimental).
   Host compartilha dia, estado de construções, pontos de interação e acertos.
   Não substituir simulador local de IA, inventário ou física antes de portas de integração.
*/
(()=>{'use strict';if(window.FlorestaDuoWorld)return;
const N=()=>window.FlorestaOnline,G=()=>window.gameReview,T=()=>window.__THREE_MODULE;
const clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
const num=(n,limit=3000)=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<limit;
const safe=s=>String(s||'').replace(/[<>\x00-\x1f]/g,'').slice(0,110);
const MAP=new Map(),MAX_SITES=650,MAX_MESHES=1500;
let connected=false,room='',lastWorldHash='',lastWorldTime=0,lastTime=0,lastSummary=0,lastImpact=0,lastEnemies=0;
let unsub=null,statusEl=null,lastRemoteWorld=null,lastRemoteTime=null,friendItems=[],frames=0,remoteEnemyList=[];
const takenPickups=new Set(),pendingPickups=new Map();
let sent={world:0,clock:0,hit:0,chat:0},received={world:0,clock:0,hit:0,chat:0};
const createStatus=()=>{
 if(statusEl)return statusEl;
 const box=document.createElement('div');box.id='florestaDuoWorldIndicator';
 box.setAttribute('role','status');box.setAttribute('aria-live','polite');
 box.style.cssText='position:fixed;bottom:max(8px,env(safe-area-inset-bottom));left:50%;transform:translateX(-50%);z-index:3250;pointer-events:none;max-width:80vw;white-space:pre-wrap;text-align:center;border:1px solid #897b55;border-radius:5px;padding:6px 10px;background:#101b14ea;color:#f0dec4;font:11px/1.4 system-ui;opacity:0;transition:opacity .3s';
 document.body.append(box);statusEl=box;return box;
};
let noteHide=null;
function note(message){const el=createStatus();el.textContent=safe(message);el.style.opacity='1';clearTimeout(noteHide);noteHide=setTimeout(()=>{el.style.opacity='0';},2600)}
function send(type,payload){const n=N();if(!n?.connected||!n.peerId)return;void n.send(type,payload);}
// The native construction engine owns materials, geometry, snapping and collision.
function clearWorld(){
 const own=N()?.peerId;
 if(own)window.gameConstruction?.clearRemote?.(own);
 for(const owner of remoteOwners)window.gameConstruction?.clearRemote?.(owner);
 remoteOwners.clear();MAP.clear();
}
const remoteOwners=new Set();
function applyWorld(world){
 const owner=N()?.peerId||'remote';
 if(!Array.isArray(world?.construction?.sites)||!window.gameConstruction?.applyRemote)return;
 remoteOwners.add(owner);
 window.gameConstruction.applyRemote(owner,world.construction.sites);
 // Count is only diagnostic. Remote geometry is inside native sites[].
 const n=window.gameConstruction.sites?.filter?.(s=>s.duoOwner===owner).length||0;
 MAP.clear();for(let i=0;i<n;i++)MAP.set(i,true);
}
function snapshot(){
 const f=window.gameFront172,g=G();if(!f?.getWorldSnapshot||!g?.dayNight)return null;
 let raw;
 try{raw=f.getWorldSnapshot();}catch(e){return null}
 if(!raw||!Array.isArray(raw.construction?.sites))return null;
 const siteList=raw.construction.sites.slice(0,MAX_SITES).filter(a=>a&&['x','y','z','yaw'].every(k=>num(a[k]))&&Number.isInteger(a.count)&&a.count>=0)
  .map(a=>({id:String(a.id).slice(0,90),x:a.x,y:a.y,z:a.z,yaw:a.yaw,count:a.count,
    level:Number.isInteger(a.level)?a.level:0,edgeX:a.edgeX,edgeZ:a.edgeZ,
    wallSign:a.wallSign,wallAttached:!!a.wallAttached,stairShape:a.stairShape||undefined,
    hp:Number.isFinite(a.hp)?a.hp:100,open:!!a.open,
    text:typeof a.text==='string'?a.text.slice(0,80):'',
    paid:Array.isArray(a.paid)?a.paid.slice(0,60).map(Boolean):[],
    storage:Array.isArray(a.storage)?a.storage.slice(0,40):[]}));
 return {schema:1,construction:{sites:siteList},cave:{queenDead:!!raw.cave?.queenDead},clock:{day:g.dayNight.day,hour:g.dayNight.hour},at:Date.now()};
}
function distribute(force=false){
 const world=snapshot();if(!world)return;
 const h=JSON.stringify({sites:world.construction.sites,cave:world.cave});
 if(force||h!==lastWorldHash){lastWorldHash=h;
  const asText=JSON.stringify(world);if(asText.length<80000){send('world-snapshot',world);sent.world++;}
 }
}
function updateClock(data){
 if(N()?.isHost||!data||!num(data.day,100000)||!num(data.hour,24.1)||data.day<1||data.hour<0||data.hour>=24)return;
 const clock=G()?.dayNight;if(!clock)return;
 try{
  if(Math.abs(Number(clock.day)-data.day)>0)clock.setDay?.(data.day);
  if(Math.abs(Number(clock.hour)-data.hour)>.15)clock.setHour?.(data.hour);
 }catch(e){}
 received.clock++;
}
function enemyState(){
 const z=window.gameZombie?.zombies;if(!Array.isArray(z))return[];
 return z.slice(0,90).filter(e=>{
  const p=e?.root?.position;
  return e?.id!=null&&p&&num(p.x)&&num(p.y)&&num(p.z);
 }).map(e=>({id:String(e.id).slice(0,42),x:e.root.position.x,y:e.root.position.y,z:e.root.position.z,
  yaw:Number(e.root.rotation?.y)||0,alive:e.alive!==false,state:String(e.state||'').slice(0,26)}));
}
function pullEnemyPositions(){
 if(N()?.isHost||!remoteEnemyList.length)return;
 const z=window.gameZombie?.zombies;if(!Array.isArray(z))return;
 const byId=new Map(z.map(e=>[String(e.id),e]));
 for(const r of remoteEnemyList){
  const live=byId.get(r.id),root=live?.root;
  if(!root?.position)continue;
  const d=Math.hypot(root.position.x-r.x,root.position.z-r.z);
  if(d>32||!Number.isFinite(d))continue;
  const blend=d>5?.35:.16;
  root.position.x+=(r.x-root.position.x)*blend;
  root.position.z+=(r.z-root.position.z)*blend;
  root.position.y+=(r.y-root.position.y)*blend;
  if(root.rotation&&Number.isFinite(r.yaw)){
   root.rotation.y+=Math.atan2(Math.sin(r.yaw-root.rotation.y),Math.cos(r.yaw-root.rotation.y))*.19;
  }
 }
}
function enemyTargets(){
 const out=[];
 const add=entries=>{
  if(!Array.isArray(entries))return;
  for(const o of entries)if(o?.root?.position&&typeof o.hit==='function')out.push(o);
 };
 add(window.gameZombie?.combatTargets?.());
 add(window.gameSpecialCreatures?.combatTargets?.());
 add(window.gameUndeadForces?.combatTargets?.());
 if(window.gameSpiderCave?.active)add(window.gameSpiderCave?.targets?.());
 return out;
}
function hostDamage(request,peerId){
 const n=N();if(!n?.connected||!n.isHost||peerId!==n.peerId||!request||request.weapon!=='sword')return;
 if(!num(request.x)||!num(request.z)||!num(request.y,2000))return;
 const p=n.peerPosition;if(!p||!num(p.x)||!num(p.z))return;
 if((p.zone==='cave')!==!!window.gameSpiderCave?.active)return;
 if(Math.hypot(p.x-request.x,p.z-request.z)>4.7)return;
 const now=performance.now();if(now-lastImpact<260)return;lastImpact=now;
 const targets=enemyTargets();let chosen=null,d=3;
 for(const item of targets){
  const pos=item.root.position;
  const dist=Math.hypot(pos.x-request.x,pos.z-request.z);
  if(dist<d&&Math.hypot(pos.x-p.x,pos.z-p.z)<4.5){d=dist;chosen=item;}
 }
 if(!chosen)return;
 try{if(chosen.hit(32,{weapon:'sword',source:'duo-peer'})!==false){
  send('impact',{x:request.x,z:request.z,weapon:'sword'});sent.hit++;
 }}catch(err){console.warn('[Duo] dano remoto não aceito',err);}
}
function validPickupKey(key){return typeof key==='string'&&key.length<120&&/^[a-z_]+:-?\d+:-?\d+$/.test(key);}
function requestPickup(key,itemId){
 const n=N();if(!n?.connected||n.isHost||!n.peerId||!validPickupKey(key))return false;
 const t=pendingPickups.get(key);
 if(t&&Date.now()-t<4000)return true;
 pendingPickups.set(key,Date.now());
 send('pickup-request',{key,itemId:String(itemId||'').slice(0,32)});
 return true;
}
function localPickup(e){
 const n=N(),key=e.detail?.key;
 if(!n?.connected||!n.isHost||!validPickupKey(key))return;
 if(takenPickups.size<1500)takenPickups.add(key);
 send('pickup-claimed',{key});
}
function hostPickup(m){
 const n=N(),api=window.gameCollectibles,req=m.payload;
 if(!n?.connected||!n.isHost||m.peerId!==n.peerId||!validPickupKey(req?.key))return;
 const root=api?.getByNetworkKey?.(req.key),peer=n.peerPosition;
 if(!root||takenPickups.has(req.key)||!peer||!Number.isFinite(peer.x)||!Number.isFinite(peer.z)){
  send('pickup-denied',{key:req.key,to:m.peerId});return;
 }
 // Server-authority-for-this-room: only allow picking up near the claimed resource.
 if(Math.hypot(root.position.x-peer.x,root.position.z-peer.z)>3.6||
    req.itemId!==root.userData?.collectible?.id){
  send('pickup-denied',{key:req.key,to:m.peerId});return;
 }
 const item=api.consumeByNetworkKey(req.key,false);
 if(!item){send('pickup-denied',{key:req.key,to:m.peerId});return;}
 if(takenPickups.size<1500)takenPickups.add(req.key);
 send('pickup-awarded',{key:req.key,to:m.peerId,item:{
  id:item.id,name:item.name,type:item.type,quantity:item.quantity,weight:item.weight,description:item.description
 }});
}
function syncTakenPickups(){
 const n=N();if(n?.connected&&n.isHost&&n.peerId&&takenPickups.size){
  send('pickup-snapshot',{keys:[...takenPickups].slice(-1400)});
 }
}
function onMessage(m){
 if(!N()?.connected)return;
 if(m.type==='presence'){
  if(m.payload?.count===2){setTimeout(()=>distribute(true),850);setTimeout(syncTakenPickups,1200);}
  return;
 }
 if(m.peerId!==N()?.peerId)return;
 switch(m.type){
 case 'pickup-request':
  hostPickup(m);break;
 case 'pickup-denied':
  if(!N().isHost&&m.payload?.to===N().clientId&&validPickupKey(m.payload?.key)){
   pendingPickups.delete(m.payload.key);note('Recurso já coletado ou fora do alcance.');
  }break;
 case 'pickup-claimed':
  if(!N().isHost&&validPickupKey(m.payload?.key)){
   window.gameCollectibles?.consumeByNetworkKey?.(m.payload.key,false);
   takenPickups.add(m.payload.key);pendingPickups.delete(m.payload.key);
  }break;
 case 'pickup-awarded':
  if(!N().isHost&&m.payload?.to===N().clientId&&validPickupKey(m.payload?.key)){
   const key=m.payload.key;
   // Do not award unsolicited packets that were never requested by this client.
   if(!pendingPickups.has(key))break;
   pendingPickups.delete(key);takenPickups.add(key);
   window.gameCollectibles?.consumeByNetworkKey?.(key,false);
   const i=m.payload.item;
   if(i&&['rock','branch','vine','wood_chip','wood_shield'].includes(i.id)&&
     Number.isInteger(i.quantity)&&i.quantity>=1&&i.quantity<=20){
     const added=window.gameInventory?.addItem?.(i);
     note(added?`Coletado: ${i.name}`:'Inventário cheio: recurso não recebido.');
   }
  }break;
 case 'pickup-snapshot':
  if(!N().isHost&&Array.isArray(m.payload?.keys)){
   for(const key of m.payload.keys.slice(0,1500))if(validPickupKey(key)){
    takenPickups.add(key);window.gameCollectibles?.consumeByNetworkKey?.(key,false);
   }
  }break;
 case 'clock':
  updateClock(m.payload);break;
 case 'world-snapshot':
  if(m.payload?.schema!==1||!Array.isArray(m.payload?.construction?.sites)||m.payload.construction.sites.length>MAX_SITES)return;
  lastRemoteWorld=m.payload;received.world++;if(!N().isHost)updateClock(m.payload.clock);applyWorld(m.payload);break;
 case 'enemy-snapshot':
  if(N().isHost||!Array.isArray(m.payload?.enemies)||m.payload.enemies.length>90)return;
  remoteEnemyList=m.payload.enemies.filter(e=>typeof e?.id==='string'&&e.id.length<43&&
   [e.x,e.y,e.z,e.yaw].every(x=>num(x))&&typeof e.alive==='boolean');
  break;
 case 'hit-request':
  hostDamage(m.payload,m.peerId);break;
 case 'impact':
  if(!N().isHost&&m.payload?.weapon==='sword')received.hit++;break;
 case 'chat':
  if(typeof m.payload?.message==='string'){received.chat++;note('Amigo: '+m.payload.message.slice(0,110));}break;
 }
}
function chat(message){
 const msg=safe(message).trim();if(!msg||!N()?.connected)return false;
 send('chat',{message:msg});sent.chat++;note('Você: '+msg);return true;
}
function onSword(e){
 const n=N(),info=e.detail;if(!n?.connected||n.isHost||!info||info.weapon!=='sword'||!info.position)return;
 const p=info.position;
 if(!num(p.x)||!num(p.z)||!num(p.y,2000))return;
 send('hit-request',{weapon:'sword',x:p.x,y:p.y,z:p.z});
}
function makeChatButton(){
 if(document.getElementById('foDuoChat'))return;
 const parent=document.getElementById('foHUD')?.parentNode||document.body;
 const btn=document.createElement('button');btn.id='foDuoChat';btn.type='button';
 btn.textContent='CHAT';btn.setAttribute('aria-label','Abrir mensagem para seu amigo');
 btn.style.cssText='position:fixed;right:max(8px,env(safe-area-inset-right));top:max(47px,env(safe-area-inset-top) + 40px);z-index:3601;background:#142318ee;color:#eddfbd;border:1px solid #9b895d;padding:7px;border-radius:4px;font:700 10px system-ui;display:none';
 btn.onclick=()=>{
  const message=prompt('Mensagem para seu amigo (até 110 caracteres):','');
  if(message)chat(message);
 };
 parent.appendChild(btn);return btn;
}
function frame(ts){
 const n=N(),active=!!n?.connected;
 if(!active&&connected){connected=false;room='';clearWorld();lastWorldHash='';lastRemoteWorld=null;remoteEnemyList=[];takenPickups.clear();pendingPickups.clear();}
 if(active&&(!connected||room!==n.room)){const switched=connected&&room!==n.room;connected=true;room=n.room;lastWorldHash='';if(switched){clearWorld();lastRemoteWorld=null;remoteEnemyList=[];}note('Duo conectado: '+(n.isHost?'anfitrião':'convidado'));}
 const cb=document.getElementById('foDuoChat')||makeChatButton();
 if(cb)cb.style.display=active&&n.playerCount>1?'block':'none';
 if(active&&n.playerCount>1&&window.gameFront172?.started){
  if(ts-lastWorldTime>3500){distribute();lastWorldTime=ts;}
  if(n.isHost){
   if(ts-lastEnemies>1100){
    const enemies=enemyState();if(enemies.length)send('enemy-snapshot',{enemies});
    lastEnemies=ts;
   }
   if(ts-lastTime>2300){
    const d=G()?.dayNight;
    if(d&&num(d.day,100000)&&num(d.hour,24.1)){send('clock',{day:d.day,hour:d.hour});sent.clock++;}
    lastTime=ts;
   }
  }else{
   pullEnemyPositions();
   if(lastRemoteWorld&&++frames%240===0)applyWorld(lastRemoteWorld);
  }
 }
 requestAnimationFrame(frame);
}
const ready=setInterval(()=>{
 const n=N();
 if(n?.onNetwork){unsub=n.onNetwork(onMessage);clearInterval(ready);}
},300);
addEventListener('game:combat-hit-confirmed',onSword);
addEventListener('game:duo-local-pickup',localPickup);
addEventListener('pagehide',()=>{clearInterval(ready);unsub?.();clearWorld()},{once:true});
requestAnimationFrame(frame);
window.FlorestaDuoWorld={version:'1.1-collectibles',chat,requestPickup,refresh:()=>distribute(true),
 get guestVisualSites(){return MAP.size},
 diagnostic:()=>({connected:!!N()?.connected,isHost:!!N()?.isHost,remoteSites:MAP.size,sent,received,sharedWorld:!!lastRemoteWorld})};
})();