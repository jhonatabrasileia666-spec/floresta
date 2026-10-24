/* Host-authoritative ground pickups. No database writes. Reservations survive
   transient peer departure in this page; a reload is NOT a world-save protocol. */
(()=>{'use strict';
if(window.FlorestaDuoCollection)return;
const N=()=>window.FlorestaOnline,C=()=>window.gameCollectibles,I=()=>window.gameInventory;
const rooms=new Map(),applied=new Set();let pending=null,ready=false,lastRoom='',lastSync=0,seq=0,lastRevision=0;
const stats={requests:0,grants:0,duplicates:0,denied:0};
const idOf=r=>r?.userData?.duoId;
const status=t=>{const el=document.getElementById('status');if(el)el.textContent=t;};
const send=(type,payload)=>N()?.send('collect-'+type,payload);
function ledger(){const key=N().room+':'+N().clientId;if(!rooms.has(key))rooms.set(key,{claims:new Map(),revision:0});return rooms.get(key);}
function rootFor(id){return C()?.items.find(r=>idOf(r)===id);}
function hasSpace(item){return I()?.items.some(i=>i.id===item.id)||I()?.items.length<I()?.capacity;}
function publish(){if(!N()?.isHost||!C())return;const l=ledger();send('world',{revision:++l.revision,ids:C().items.map(idOf),taken:[...l.claims].filter(([,v])=>v.done).map(([id])=>id)});}
function collect(root){
 const n=N();if(!n?.connected||!idOf(root))return false;
 if(n.isHost){
  const l=ledger();if(l.claims.has(idOf(root))){status('Este recurso já está reservado.');return false;}
  const item={...root.userData.collectible};if(!I().addItem(item)){status('Inventário cheio');return false;}
  l.claims.set(idOf(root),{done:true,owner:n.clientId});C().removeResource(root);publish();return true;
 }
 if(!ready){status('Aguardando recursos do anfitrião…');return false;}
 if(pending){status('Aguardando confirmação da coleta…');return false;}
 if(!hasSpace(root.userData.collectible)){status('Inventário cheio');return false;}
 pending={id:idOf(root),request:n.clientId+':'+(++seq),at:0};stats.requests++;retry();return true;
}
function retry(){if(!pending||!N()?.connected)return;pending.at=Date.now();send('request',{id:pending.id,request:pending.request});}
function receive({type,payload:p,peerId}){
 const n=N();if(type==='disconnect'){ready=false;return;}
 if(!n?.connected||peerId!==n.peerId||!p||typeof type!=='string')return;
 if(type==='collect-world'&&!n.isHost){
  if(!Number.isSafeInteger(p.revision)||p.revision<=lastRevision||!Array.isArray(p.ids)||p.ids.length>10000||!Array.isArray(p.taken))return;
  lastRevision=p.revision;const ids=new Set(p.ids),taken=new Set(p.taken);
  // Seeded resource positions are stable in the original game. Dynamic spawns
  // absent from the host are unavailable; replicating them is a separate adapter.
  for(const r of C()?.items||[])if(!ids.has(idOf(r))||taken.has(idOf(r)))C().removeResource(r);
  ready=true;return;
 }
 if(!type.startsWith('collect-')||typeof p.id!=='string'||p.id.length>200||typeof p.request!=='string'||p.request.length>100)return;
 if(type==='collect-request'&&n.isHost){
  const l=ledger(),old=l.claims.get(p.id);
  if(old){
   if(old.owner===peerId&&old.request===p.request){stats.duplicates++;send('grant',{...p,item:old.item});}
   else {stats.denied++;send('deny',p);}return;
  }
  const r=rootFor(p.id),pos=n.peerPosition;
  if(!r||!pos||pos.zone==='cave'||window.gameSpiderCave?.active||Math.hypot(pos.x-r.position.x,pos.z-r.position.z)>3.3){stats.denied++;send('deny',p);return;}
  const item={...r.userData.collectible};l.claims.set(p.id,{owner:peerId,request:p.request,item,done:false});
  send('grant',{...p,item});return;
 }
 if(type==='collect-grant'&&!n.isHost){
  const key=n.room+':'+peerId+':'+p.request;
  if(applied.has(key)){stats.duplicates++;send('ack',{id:p.id,request:p.request,accepted:true});return;}
  if(!pending||p.request!==pending.request||p.id!==pending.id||!p.item||typeof p.item.id!=='string'||typeof p.item.name!=='string'||!Number.isSafeInteger(p.item.quantity)||p.item.quantity<1||p.item.quantity>100000)return;
  const accepted=I().addItem(p.item);
  if(accepted){applied.add(key);stats.grants++;const r=rootFor(p.id);if(r)C().removeResource(r);status('Coleta confirmada pelo anfitrião: '+p.item.name);}
  else status('Inventário cheio; recurso continua no mundo.');
  // Retain pending until host confirms the ACK, so lost ACKs are retried.
  pending.accepted=accepted;send('ack',{id:p.id,request:p.request,accepted});return;
 }
 if(type==='collect-ack'&&n.isHost){
  const l=ledger(),claim=l.claims.get(p.id);if(!claim||claim.owner!==peerId||claim.request!==p.request)return;
  if(p.accepted===true){if(!claim.done){const r=rootFor(p.id);if(r)C().removeResource(r);claim.done=true;stats.grants++;}publish();}
  else if(p.accepted===false&&!claim.done)l.claims.delete(p.id);
  send('done',{id:p.id,request:p.request});return;
 }
 if((type==='collect-done'||type==='collect-deny')&&!n.isHost&&pending?.request===p.request){pending=null;if(type==='collect-deny')status('Recurso indisponível ou fora de alcance.');}
}
let unsub=null;
const timer=setInterval(()=>{
 const n=N();if(!unsub&&n?.onNetwork)unsub=n.onNetwork(receive);
 if(!n?.connected){ready=false;return;}
 const key=n.room+':'+(n.isHost?n.clientId:n.peerId);
 if(key!==lastRoom){lastRoom=key;pending=null;ready=false;lastRevision=0;lastSync=0;}
 if(!C()||!I())return;
 if(pending&&Date.now()-pending.at>900){
  if(typeof pending.accepted==='boolean'){pending.at=Date.now();send('ack',{id:pending.id,request:pending.request,accepted:pending.accepted});}
  else retry();
 }
 if(n.isHost&&Date.now()-lastSync>2000){publish();lastSync=Date.now();}
},100);
window.addEventListener('pagehide',()=>{clearInterval(timer);unsub?.();},{once:true});
window.FlorestaDuoCollection={collect,diagnostic:()=>({ready,pending:!!pending,...stats})};
})();
