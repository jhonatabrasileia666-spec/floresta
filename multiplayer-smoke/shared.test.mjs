import assert from 'node:assert/strict';
import vm from 'node:vm';
import {readFileSync} from 'node:fs';
const source=readFileSync(new URL('../modulos/160_floresta_duo_shared.js',import.meta.url),'utf8');
const copy=x=>JSON.parse(JSON.stringify(x));
const site=(id,x=0)=>({netId:id,id:'wall',x,y:0,z:0,yaw:0,count:1,level:0,hp:100,open:false,storage:[],text:''});
let time=10000;
function client(host,initial){
 let records=copy(initial),backup=null,tick,receive;
 const out=[];
 const net={connected:true,isHost:host,room:'ROOM',clientId:host?'host':'guest',peerId:host?'guest':'host',send(type,payload){out.push({type,payload:copy(payload),peerId:this.clientId});},onNetwork(fn){receive=fn;return()=>{};}};
 const construction={snapshot:()=>({sites:copy(records)}),sharedBegin(guest){if(guest){backup=copy(records);records=[];}},sharedEnd(){if(backup){records=backup;backup=null;}},sharedValid:a=>Array.isArray(a)&&a.length<=650&&a.every(r=>r.netId&&Number.isFinite(r.x)),sharedApply(a){records=copy(a);return true;},save(){}};
 const w={FlorestaOnline:net,gameConstruction:construction};
 vm.runInNewContext(source,{window:w,document:{getElementById(){return null;}},setInterval(fn){tick=fn;},addEventListener(){},Date:{now:()=>time},console});
 return {net,out,w,tick(){time+=300;tick();},receive(m){receive(m);},get records(){return records;},set records(a){records=copy(a);}};
}
const h=client(true,[site('a')]),g=client(false,[site('solo',77)]);
h.tick();g.tick();
function deliver(from,to){for(const m of from.out.splice(0))to.receive(m);}
deliver(g,h);deliver(h,g);
assert.deepEqual(g.records,h.records,'late join replaces guest world with host world');
g.records[0].open=true;g.tick();deliver(g,h);deliver(h,g);
assert.equal(h.records[0].open,true,'guest can edit host door');
assert.deepEqual(g.records,h.records);
g.records.push(site('b',4));g.tick();const retry=copy(g.out[0]);g.out.length=0;
time+=2000;g.tick();deliver(g,h);h.out.length=0; // lost ACK
h.receive(retry);deliver(h,g);
assert.equal(h.records.length,2,'retries do not duplicate construction');
assert.equal(g.w.FlorestaDuoShared.diagnostic().pending,null,'retry recovers lost ACK');
// Independent edits merge even when the host changes before the guest packet arrives.
g.records[1].text='guest';g.tick();h.records[0].text='host';h.tick();deliver(g,h);deliver(h,g);
assert.equal(h.records[0].text,'host');assert.equal(h.records[1].text,'guest');
assert.deepEqual(g.records,h.records);
// Same-object conflict keeps the authoritative value and reports rejection.
g.records[0].text='stale';g.tick();h.records[0].text='winner';h.tick();deliver(g,h);deliver(h,g);
assert.equal(g.records[0].text,'winner');
// Mutation made while another edit is awaiting confirmation survives rebase.
g.records[1].text='first';g.tick();g.records[1].text='second';deliver(g,h);deliver(h,g);g.tick();deliver(g,h);deliver(h,g);
assert.equal(h.records[1].text,'second');assert.deepEqual(g.records,h.records);
// Deletions are authoritative and heartbeat repairs a dropped snapshot.
h.records=[];h.tick();h.out.length=0;time+=4000;h.tick();deliver(h,g);
assert.equal(g.records.length,0);
g.net.connected=false;g.tick();assert.equal(g.records[0].netId,'solo','leaving restores guest solo world');
console.log('Shared world: join, edit, retry, ACK loss, concurrent merge/conflict, pending edit, deletion, heartbeat and solo restoration OK');
