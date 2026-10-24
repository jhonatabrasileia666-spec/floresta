/* Shared construction authority. Broadcast is transient: request state on join,
   retry transactions, deduplicate, and periodically repair missed snapshots. */
(()=>{'use strict';
if(window.FlorestaDuoShared)return;
const N=()=>window.FlorestaOnline,C=()=>window.gameConstruction;
const copy=x=>JSON.parse(JSON.stringify(x));
const hash=x=>JSON.stringify(x??null);
const map=a=>new Map(a.map(r=>[r.netId,r]));
let session='',ready=false,revision=0,canonical=[],rendered=[],pending=null,serial=0,lastSend=0;
let queued=new Map(),answers=new Map(),unsub=null;
function send(type,data){void N()?.send(type,{protocol:2,...data});}
function notice(text){const el=document.getElementById('status');if(el)el.textContent=text;}
function capture(){
 if(!ready||N().isHost)return;
 const before=map(rendered),now=C().snapshot().sites,after=map(now);
 for(const id of new Set([...before.keys(),...after.keys()])){
  if(hash(before.get(id))===hash(after.get(id)))continue;
  const old=queued.get(id);
  queued.set(id,{id,base:old?old.base:hash(before.get(id)),value:after.get(id)||null});
 }
 rendered=copy(now);
}
function render(){
 const result=map(canonical);
 for(const op of [...(pending?.ops||[]),...queued.values()]){
  if(op.value)result.set(op.id,op.value);else result.delete(op.id);
 }
 C().sharedApply([...result.values()]);rendered=copy(C().snapshot().sites);
}
function hostCapture(){
 const current=C().snapshot().sites;
 if(hash(current)!==hash(canonical)){canonical=copy(current);revision++;}
}
function broadcast(ack=null,ok=true){
 hostCapture();send('shared-state',{revision,sites:canonical,ack,ok});
}
function begin(){
 const n=N(),c=C();if(!n?.connected||!c?.sharedApply)return false;
 if(session===n.room)return true;
 end();session=n.room;c.sharedBegin(!n.isHost);
 canonical=[];rendered=[];revision=-1;ready=n.isHost;
 if(n.isHost){hostCapture();broadcast();}else send('shared-request',{});
 return true;
}
function end(){
 if(session){C()?.sharedEnd?.();window.gameCollectibles?.networkEnd?.();}
 session='';ready=false;pending=null;queued.clear();answers.clear();canonical=[];rendered=[];lastSend=0;
}
function receive(m){
 if(!begin()||m.peerId!==N().peerId||m.payload?.protocol!==2)return;
 const p=m.payload;
 if(N().isHost){
  if(m.type==='shared-request'){broadcast();return;}
  if(m.type!=='shared-edit'||typeof p.tx!=='string'||p.tx.length>100)return;
  if(answers.has(p.tx)){broadcast(p.tx,answers.get(p.tx));return;}
  hostCapture();const next=map(canonical);
  let ok=Array.isArray(p.ops)&&p.ops.length>0&&p.ops.length<=650;
  const ids=new Set();
  if(ok)for(const op of p.ops){
   if(typeof op?.id!=='string'||ids.has(op.id)||op.base!==hash(next.get(op.id))||
      (op.value!==null&&op.value?.netId!==op.id)){ok=false;break;}
   ids.add(op.id);if(op.value===null)next.delete(op.id);else next.set(op.id,op.value);
  }
  if(ok)ok=C().sharedValid([...next.values()]);
  if(ok){C().sharedApply([...next.values()]);C().save();}
  answers.set(p.tx,ok);if(answers.size>128)answers.delete(answers.keys().next().value);
  broadcast(p.tx,ok);return;
 }
 if(m.type!=='shared-state'||!Number.isInteger(p.revision)||p.revision<revision||!C().sharedValid(p.sites))return;
 capture();
 if(p.ack&&p.ack===pending?.tx){
  if(!p.ok){
   for(const op of pending.ops)queued.delete(op.id);
   notice('A mesma construção mudou no outro aparelho. Estado atualizado; tente a ação novamente.');
  }
  pending=null;
 }
 canonical=copy(p.sites);revision=p.revision;ready=true;render();
}
function tick(){
 const n=N();
 if(!n?.connected){end();return;}
 if(!begin())return;
 if(!unsub)unsub=n.onNetwork(receive);
 const now=Date.now();
 if(n.isHost){
  const prev=revision;hostCapture();
  if(n.peerId&&(prev!==revision||now-lastSend>3000)){broadcast();lastSend=now;}
 }else if(!ready){
  if(now-lastSend>1500){send('shared-request',{});lastSend=now;}
 }else{
  capture();
  if(!pending&&queued.size){pending={tx:n.clientId+':'+(++serial),ops:[...queued.values()]};queued.clear();lastSend=0;}
  if(pending&&now-lastSend>1000){send('shared-edit',pending);lastSend=now;}
 }
}
window.FlorestaDuoShared={version:2,get ready(){return ready;},diagnostic:()=>({ready,revision,pending:pending?.tx||null,queued:queued.size}),receive};
setInterval(tick,250);
addEventListener('pagehide',end);
})();
