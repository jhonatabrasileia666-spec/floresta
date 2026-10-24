import test from 'node:test';
import assert from 'node:assert/strict';
import { WebSocket } from 'ws';
import { makeServer } from './server.js';

test('criar, entrar, mover, sair da sala e rejeitar códigos inexistentes',async()=>{
 const {http,wss}=makeServer();
 await new Promise(resolve=>http.listen(0,'127.0.0.1',resolve));
 const url='ws://127.0.0.1:'+http.address().port+'/ws';
 const sockets=[];
 const connect=()=>new Promise((resolve,reject)=>{
  const ws=new WebSocket(url);
  sockets.push(ws);ws.once('open',()=>resolve(ws));ws.once('error',reject);
 });
 const next=(ws,type)=>new Promise((resolve,reject)=>{
  const t=setTimeout(()=>{ws.off('message',onMessage);reject(new Error('Timeout '+type));},2500);
  const onMessage=buf=>{
   const msg=JSON.parse(buf.toString());
   if(msg.type===type){clearTimeout(t);ws.off('message',onMessage);resolve(msg);}
  };
  ws.on('message',onMessage);
 });
 try{
  const a=await connect();
  const welcomeA=next(a,'welcome');
  a.send(JSON.stringify({type:'create',name:'Guerreiro'}));
  const host=await welcomeA;
  assert.match(host.room,/^[A-HJ-NP-Z2-9]{6}$/);
  assert.equal(host.players.length,0);
  const b=await connect();
  const joinA=next(a,'peer-joined'),welcomeB=next(b,'welcome');
  b.send(JSON.stringify({type:'join',code:host.room,name:'Ferreiro'}));
  const guest=await welcomeB;
  assert.equal(guest.players[0].name,'Guerreiro');
  assert.equal((await joinA).player.id,guest.id);
  const moving=next(a,'peer-state');
  b.send(JSON.stringify({type:'state',state:{x:12,y:0,z:-7,yaw:1.4,walking:true,weapon:'sword'}}));
  assert.deepEqual((await moving).state,{x:12,y:0,z:-7,yaw:1.4,walking:true,weapon:'sword',torch:false});
  const gone=next(a,'peer-left');
  b.send(JSON.stringify({type:'leave'}));
  assert.equal((await gone).id,guest.id);
  const c=await connect();
  const missing=next(c,'error');
  c.send(JSON.stringify({type:'join',code:'ZZZZZZ',name:'Jogador'}));
  assert.match((await missing).message,/não encontrada/);
 }finally{
  for(const ws of sockets)ws.terminate();
  await new Promise(resolve=>wss.close(()=>http.close(resolve)));
 }
});
