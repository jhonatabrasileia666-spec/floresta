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
let connected=false,room='',lastWorldHash='',lastWorldTime=0,lastTime=0,lastSummary=0,lastImpact=0;
let unsub=null,statusEl=null,lastRemoteWorld=null,lastRemoteTime=null,friendItems=[],frames=0;
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
function buildPart(def,slot){
 const tr=T();if(!tr?.Mesh)return null;
 const kind=String(slot.kind||def.resource||'');
 const len=clamp(Number(slot.len)||1.8,.1,15);
 let geo,color;
 if(kind==='log'){const radius=clamp(Number(slot.radius)||.18,.07,.8);
  geo=new tr.CylinderGeometry(radius,radius,len,7);color=0x62503b;
 }else if(kind==='plank'){geo=new tr.BoxGeometry(.31,.13,len);color=0x796047;}
 else if(kind==='rock'){geo=new tr.DodecahedronGeometry(.24,0);color=0x686967;}
 else{geo=new tr.BoxGeometry(.10,.12,Math.min(2.5,len));color=0x74674b;}
 const mat=new tr.MeshStandardMaterial({color,roughness:1,flatShading:true});
 const mesh=new tr.Mesh(geo,mat);mesh.castShadow=true;mesh.receiveShadow=true;
 mesh.position.set(Number(slot.pos?.x)||0,Number(slot.pos?.y)||0,Number(slot.pos?.z)||0);
 if(slot.quat&&['x','y','z','w'].every(k=>num(slot.quat[k],2)))mesh.quaternion.set(slot.quat.x,slot.quat.y,slot.quat.z,slot.quat.w);
 return mesh;
}
function clearWorld(){
 for(const entity of MAP.values()){
  entity.root.parent?.remove(entity.root);
  entity.root.traverse(o=>{o.geometry?.dispose?.();if(o.material)o.material.dispose?.()});
 }
 MAP.clear();
}
function applyWorld(world){
 const T3=T(),g=G(),defs=window.gameConstruction?.definitions;
 if(!T3?.Group||!g?.scene||!defs||!Array.isArray(world?.construction?.sites))return;
 const locations=world.construction.sites.slice(0,MAX_SITES),used=new Set();
 let meshes=0;
 for(const site of locations){
  if(!site||typeof site.id!=='string'||site.id.length>90||!['x','y','z','yaw'].every(k=>num(site[k]))||!Number.isInteger(site.count)||site.count<0||site.count>500)continue;
  const def=defs[site.id];if(!def?.slots)continue;
  const key=site.id+':'+site.x.toFixed(2)+':'+site.y.toFixed(2)+':'+site.z.toFixed(2)+':'+site.yaw.toFixed(2);
  used.add(key);
  const old=MAP.get(key);
  if(old&&old.count===site.count){meshes+=old.parts;continue;}
  if(old){old.root.parent?.remove(old.root);old.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()});MAP.delete(key);}
  const root=new T3.Group();root.name='Floresta_Duo_Construcao_Remota_'+site.id;
  root.position.set(site.x,site.y,site.z);root.rotation.y=site.yaw;
  const count=Math.min(site.count,def.slots.length,180,MAX_MESHES-meshes);
  for(let i=0;i<count;i++){const part=buildPart(def,def.slots[i]);if(part)root.add(part);}
  meshes+=count;if(!count)continue;
  // Réplicas são apenas visuais até a colisão/consumo terem suporte multiplayer nativo.
  root.userData.florestaDuoRemote=true;g.scene.add(root);
  MAP.set(key,{root,count:site.count,parts:count});
  if(meshes>=MAX_MESHES)break;
 }
 for(const [key,v] of [...MAP])if(!used.has(key)){v.root.parent?.remove(v.root);v.root.traverse(o=>{o.geometry?.dispose?.();o.material?.dispose?.()});MAP.delete(key);}
}
function snapshot(){
 const f=window.gameFront172,g=G();if(!f?.getWorldSnapshot||!g?.dayNight)return null;
 let raw;
 try{raw=f.getWorldSnapshot();}catch(e){return null}
 if(!raw||!Array.isArray(raw.construction?.sites))return null;
 const siteList=raw.construction.sites.slice(0,MAX_SITES).filter(a=>a&&['x','y','z','yaw'].every(k=>num(a[k]))&&Number.isInteger(a.count)&&a.count>=0)
  .map(a=>({id:String(a.id).slice(0,90),x:a.x,y:a.y,z:a.z,yaw:a.yaw,count:a.count}));
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
function onMessage(m){
 if(!N()?.connected)return;
 if(m.type==='presence'){
  if(N().isHost&&m.payload?.count===2)setTimeout(()=>distribute(true),850);
  return;
 }
 if(m.peerId!==N()?.peerId)return;
 switch(m.type){
 case 'clock':
  updateClock(m.payload);break;
 case 'world-snapshot':
  if(N().isHost||m.payload?.schema!==1||!Array.isArray(m.payload?.construction?.sites)||m.payload.construction.sites.length>MAX_SITES)return;
  lastRemoteWorld=m.payload;received.world++;updateClock(m.payload.clock);applyWorld(m.payload);break;
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
 if(!active&&connected){connected=false;room='';clearWorld();lastWorldHash='';lastRemoteWorld=null;}
 if(active&&(!connected||room!==n.room)){connected=true;room=n.room;lastWorldHash='';clearWorld();note('Duo conectado: '+(n.isHost?'anfitrião':'convidado'));}
 const cb=document.getElementById('foDuoChat')||makeChatButton();
 if(cb)cb.style.display=active&&n.playerCount>1?'block':'none';
 if(active&&n.playerCount>1&&window.gameFront172?.started){
  if(n.isHost){
   if(ts-lastWorldTime>3500){distribute();lastWorldTime=ts;}
   if(ts-lastTime>2300){
    const d=G()?.dayNight;
    if(d&&num(d.day,100000)&&num(d.hour,24.1)){send('clock',{day:d.day,hour:d.hour});sent.clock++;}
    lastTime=ts;
   }
  }else if(lastRemoteWorld&&++frames%240===0){applyWorld(lastRemoteWorld);}
 }
 requestAnimationFrame(frame);
}
const ready=setInterval(()=>{
 const n=N();
 if(n?.onNetwork){unsub=n.onNetwork(onMessage);clearInterval(ready);}
},300);
addEventListener('game:combat-hit-confirmed',onSword);
addEventListener('pagehide',()=>{clearInterval(ready);unsub?.();clearWorld()},{once:true});
requestAnimationFrame(frame);
window.FlorestaDuoWorld={version:'1.0-test',chat,refresh:()=>distribute(true),
 get guestVisualSites(){return MAP.size},
 diagnostic:()=>({connected:!!N()?.connected,isHost:!!N()?.isHost,remoteSites:MAP.size,sent,received,sharedWorld:!!lastRemoteWorld})};
})();