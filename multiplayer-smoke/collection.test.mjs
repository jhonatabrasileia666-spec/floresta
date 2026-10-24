import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
const code=readFileSync(new URL('../modulos/159_floresta_duo_collection.js',import.meta.url),'utf8');
let time=10000;const queue=[];
function player(host){
 const root={userData:{duoId:'branch:0:0:1',collectible:{id:'branch',name:'Galho',quantity:1}},position:{x:0,z:0}};
 const items=[root],inv=[];let tick,receive;
 const n={connected:true,isHost:host,room:'TESTROOM1',clientId:host?'host':'guest',peerId:host?'guest':'host',peerPosition:{x:0,z:0,zone:'forest'},onNetwork(fn){receive=fn;return()=>{};},send(type,payload){queue.push({from:n.clientId,type,payload:structuredClone(payload)});}};
 const w={FlorestaOnline:n,addEventListener(){},gameCollectibles:{get items(){return items.slice()},removeResource(r){const i=items.indexOf(r);if(i<0)return false;items.splice(i,1);return true;}},gameInventory:{items:inv,capacity:20,addItem(item){if(inv.length>=this.capacity)return false;inv.push({...item});return true;}}};
 vm.runInNewContext(code,{window:w,document:{getElementById:()=>({})},setInterval:fn=>(tick=fn),clearInterval(){},Date:{now:()=>time},Map,Set,Math,Number,String});tick();
 return {n,w,root,items,inv,tick,receive:m=>receive(m),api:w.FlorestaDuoCollection};
}
const h=player(true),g=player(false);
function deliver(msg){(msg.from==='host'?g:h).receive({type:msg.type,payload:msg.payload,peerId:msg.from});}
function flush(){let count=0;while(queue.length){assert.ok(count++<100);deliver(queue.shift());}}
flush();assert.equal(g.api.diagnostic().ready,true);
// Guest requests first: host cannot also take the reserved object.
g.api.collect(g.root);const request=queue.shift();deliver(request);deliver(request);
assert.equal(h.api.collect(h.root),false);assert.equal(h.inv.length,0);
const grant=queue.shift();deliver(grant);deliver(grant);flush();
assert.equal(g.inv.length,1);assert.equal(g.items.length,0);assert.equal(h.items.length,0);assert.equal(g.api.diagnostic().pending,false);
deliver(request);flush();assert.equal(g.inv.length,1,'replayed request must not duplicate inventory');
// A late/reordered snapshot cannot restore a collected item.
g.receive({type:'collect-world',peerId:'host',payload:{revision:0,ids:['branch:0:0:1'],taken:[]}});assert.equal(g.items.length,0);
// Separate room: out-of-range claims and foreign senders are rejected.
h.n.room=g.n.room='TESTROOM2';h.tick();g.tick();flush();h.n.peerPosition.x=100;
h.receive({type:'collect-request',peerId:'guest',payload:{id:'missing',request:'bad'}});assert.equal(queue.at(-1).type,'collect-deny');queue.length=0;
g.receive({type:'collect-grant',peerId:'intruder',payload:{id:'x',request:'x',item:{id:'gold',name:'Gold',quantity:99}}});assert.equal(g.inv.length,1);
// Capacity changes between reservation and grant: reject and release reservation.
const h2=player(true),g2=player(false);queue.length=0;
g2.receive({type:'collect-world',peerId:'host',payload:{revision:1,ids:['branch:0:0:1'],taken:[]}});
g2.api.collect(g2.root);const req2=queue.shift();h2.receive({...req2,peerId:'guest'});
g2.w.gameInventory.capacity=0;const grant2=queue.shift();g2.receive({...grant2,peerId:'host'});
const ack2=queue.shift();assert.equal(ack2.payload.accepted,false);h2.receive({...ack2,peerId:'guest'});assert.equal(h2.items.length,1);assert.equal(h2.api.collect(h2.root),true);
console.log('Collection: competing pickups, duplicate/reordered packets, foreign sender, distance and full inventory passed (simulated).');
