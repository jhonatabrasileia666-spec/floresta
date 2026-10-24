import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';

const source=readFileSync(new URL('../modulos/158_floresta_duo_world.js',import.meta.url),'utf8');
const makeVector=()=>({x:0,y:0,z:0,set(x,y,z){this.x=x;this.y=y;this.z=z;}});
class FakeGroup {
 constructor(){this.children=[];this.position=makeVector();this.rotation={y:0};this.userData={};}
 add(item){this.children.push(item);item.parent=this;}
 remove(item){this.children=this.children.filter(x=>x!==item);item.parent=null;}
 traverse(fn){fn(this);this.children.forEach(x=>x.traverse?x.traverse(fn):fn(x));}
}
class FakeMesh extends FakeGroup {
 constructor(geometry,material){super();this.geometry=geometry;this.material=material;this.quaternion={set(){}};}
}
class Material{dispose(){}}
class Geometry{dispose(){}}
const T={
 Group:FakeGroup,Mesh:FakeMesh,
 MeshStandardMaterial:Material,
 CylinderGeometry:Geometry,BoxGeometry:Geometry,DodecahedronGeometry:Geometry
};
function harness(host){
 const packets=[],scene=new FakeGroup();
 const dayNight={day:3,hour:12,setDay(d){this.day=d;},setHour(h){this.hour=h}};
 const bridge={connected:true,isHost:host,room:'ABCDEFGHJ',peerId:'amigo',clientId:'self',
  playerCount:2,peerPosition:{x:0,z:0},onNetwork(fn){this.receive=fn;return()=>{}},
  send(type,payload){packets.push({type,payload});return Promise.resolve('ok');}
 };
 const display={body:{append(){},appendChild(){}},createElement(){return {style:{},setAttribute(){},append(){},textContent:'',id:''};},getElementById(){return null}};
 let onFrame=null;const intervals=[];
 const listeners={};
 const w={
  FlorestaOnline:bridge,__THREE_MODULE:T,gameReview:{scene,dayNight},
  gameConstruction:{sites:[],definitions:{wall:{resource:'log',slots:[{kind:'log',len:2,pos:{x:0,y:0,z:0},quat:{x:0,y:0,z:0,w:1}}]}},
    applyRemote(owner,records){this.sites=this.sites.filter(s=>s.duoOwner!==owner);
      for(const rec of records)this.sites.push({...rec,duoOwner:owner});return true;},
    clearRemote(owner){this.sites=this.sites.filter(s=>s.duoOwner!==owner);}
   },
  gameCollectibles:{
    remaining:new Map([['rock:100:100',{position:{x:1,z:1},userData:{collectible:{id:'rock',name:'Pedra',quantity:1}}}]]),
    getByNetworkKey(k){return this.remaining.get(k)||null;},
    consumeByNetworkKey(k){const x=this.remaining.get(k);if(!x)return null;this.remaining.delete(k);return {...x.userData.collectible};}
  },
  gameInventory:{items:[],addItem(i){this.items.push(i);return true;}},
  gameFront172:{started:true,getWorldSnapshot(){return {schema:1,construction:{sites:[{id:'wall',x:2,y:0,z:3,yaw:0,count:1}]},cave:{queenDead:false}};}},
  gameZombie:{zombies:[{id:'z-1',root:{position:{x:1,y:0,z:1},rotation:{y:0}},alive:true,state:'idle'}],combatTargets(){return[{root:{position:{x:1,y:0,z:1}},hit(amount){w.hitDamage=amount;return true;}}]}}
 };
 const context={window:w,document:display,performance:{now(){return 1000}},
   requestAnimationFrame(fn){onFrame=fn},setInterval(fn){intervals.push(fn);return 3;},clearInterval(){},
   addEventListener(type,fn){listeners[type]=fn;},setTimeout(){return 0;},clearTimeout(){},
   prompt(){return''},console,Math,Date,JSON,Number,Map,Set,String,Array,Boolean,Error,Promise,
   CustomEvent:class {},};
 vm.createContext(context);vm.runInContext(source,context);intervals.forEach(fn=>fn());
 return{bridge,w,packets,listeners,frame(time){onFrame?.(time);},api:w.FlorestaDuoWorld};
}
const host=harness(true);
host.api.refresh();
const worldPacket=host.packets.find(x=>x.type==='world-snapshot');
assert.ok(worldPacket,'anfitrião deve compartilhar o estado da construção');
assert.equal(worldPacket.payload.construction.sites[0].id,'wall');
host.frame(3000);
assert.ok(host.packets.some(x=>x.type==='clock'),'anfitrião deve compartilhar hora do mundo');
const enemyPacket=host.packets.find(x=>x.type==='enemy-snapshot');
assert.equal(enemyPacket?.payload?.enemies?.[0]?.id,'z-1','host deve anunciar zumbis da cena');
host.bridge.receive({type:'hit-request',peerId:'amigo',payload:{weapon:'sword',x:1,y:0,z:1}});
assert.equal(host.w.hitDamage,32,'anfitrião valida e aplica dano fixo do ataque remoto');
const guest=harness(false);
guest.bridge.receive({type:'world-snapshot',peerId:'amigo',payload:worldPacket.payload});
assert.equal(guest.api.guestVisualSites,1,'convidado deve visualizar obra do anfitrião');
guest.bridge.receive({type:'clock',peerId:'amigo',payload:{day:5,hour:18}});
assert.equal(guest.w.gameReview.dayNight.day,5,'convidado deve acompanhar dia do anfitrião');
assert.equal(guest.w.gameReview.dayNight.hour,18,'convidado deve acompanhar hora');
const zombie=guest.w.gameZombie.zombies[0];zombie.root.position.x=-2;zombie.root.position.z=-2;
guest.bridge.receive({type:'enemy-snapshot',peerId:'amigo',payload:enemyPacket.payload});
guest.frame(4800);
assert.ok(zombie.root.position.x>-2&&zombie.root.position.z>-2,'convidado interpola monstro do host');
guest.bridge.receive({type:'world-snapshot',peerId:'intruso',payload:worldPacket.payload});
assert.equal(guest.api.guestVisualSites,1,'ignora pacotes de outros IDs');
// Collection must be one-time and host-authorized.
host.bridge.receive({type:'pickup-request',peerId:'amigo',payload:{key:'rock:100:100',itemId:'rock'}});
assert.equal(host.w.gameCollectibles.remaining.size,0,'host retirou recurso do mundo');
assert.equal(host.packets.filter(p=>p.type==='pickup-awarded').length,1,'host confirmou a coleta uma vez');
host.bridge.receive({type:'pickup-request',peerId:'amigo',payload:{key:'rock:100:100',itemId:'rock'}});
assert.equal(host.packets.filter(p=>p.type==='pickup-awarded').length,2,'requisição repetida reenvia confirmação perdida');
assert.equal(host.w.gameCollectibles.remaining.size,0,'reenvio não recria recurso');
assert.equal(host.packets.at(-1).type,'pickup-awarded','reenvia concessão idempotente');
assert.equal(guest.api.requestPickup('rock:100:100','rock'),true,'guest solicita host, não se auto concede item');
assert.equal(guest.w.gameInventory.items.length,0,'convidado ainda não recebeu item sem confirmação');
guest.bridge.receive({type:'pickup-awarded',peerId:'amigo',
 payload:{key:'rock:100:100',to:'self',item:{id:'rock',name:'Pedra',quantity:1}}});
assert.equal(guest.w.gameInventory.items.length,1,'convidado recebe pedra apenas após aprovação');
assert.equal(guest.w.gameCollectibles.remaining.size,0,'pedra desaparece da sessão convidada');
guest.bridge.receive({type:'pickup-awarded',peerId:'amigo',
 payload:{key:'rock:100:100',to:'self',item:{id:'rock',name:'Pedra',quantity:1}}});
assert.equal(guest.w.gameInventory.items.length,1,'não duplica por confirmação retransmitida');
console.log('Duo world: construções V224, relógio, dano, zumbis e coleta única OK');
