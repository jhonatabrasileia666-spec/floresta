/* FLORESTA online — relay de salas para protótipo cooperativo.
   Este servidor NÃO é autoridade de combate, inventário ou mundo. */
import { createServer } from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { WebSocketServer, WebSocket } from 'ws';

const MAX_ROOM=4;
const ALLOWED=(process.env.ALLOWED_ORIGINS||
 'https://jhonatabrasileia666-spec.github.io,http://localhost:8080,http://127.0.0.1:8080')
 .split(',').map(x=>x.trim()).filter(Boolean);
const rooms=new Map();
const clients=new Map();
const send=(ws,message)=>{
 if(ws.readyState===WebSocket.OPEN && ws.bufferedAmount<128000){
  try{ws.send(JSON.stringify(message));}catch{}
 }
};
const error=(ws,message)=>send(ws,{type:'error',message});
const nameOf=s=>typeof s==='string'?s.trim().replace(/[<>\x00-\x1f]/g,'').slice(0,22)||'Viajante':'Viajante';
const codeOf=s=>typeof s==='string'?s.trim().toUpperCase().replace(/[^A-Z2-9]/g,'').slice(0,6):'';
const finite=(n,limit=10000)=>typeof n==='number'&&Number.isFinite(n)&&Math.abs(n)<=limit;
const lookOf=a=>({
 style:['raspado','curto','medio','longo'].includes(a?.style)?a.style:'curto',
 color:/^#[0-9a-fA-F]{6}$/.test(a?.color)?a.color:'#29211c'
});
function createCode(){
 const letters='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
 for(let attempt=0;attempt<24;attempt++){
  const buf=randomBytes(6);
  const code=[...buf].map(n=>letters[n%letters.length]).join('');
  if(!rooms.has(code))return code;
 }
 throw Error('Sem códigos disponíveis.');
}
function broadcast(room,message,except){
 for(const peer of room.members)if(peer!==except)send(peer,message);
}
function list(room){
 return [...room.members].map(ws=>{
  const p=clients.get(ws);
  return {id:p.id,name:p.name,look:p.look,state:p.state};
 });
}
function leave(ws){
 const p=clients.get(ws);
 if(!p?.room)return;
 const room=rooms.get(p.room);
 p.room=null;
 if(!room)return;
 room.members.delete(ws);
 broadcast(room,{type:'peer-left',id:p.id});
 if(!room.members.size){rooms.delete(room.code);return;}
 if(room.host===p.id){
  room.host=clients.get(room.members.values().next().value).id;
  broadcast(room,{type:'host-changed',hostId:room.host});
 }
}
function enter(ws,message,create){
 const p=clients.get(ws);
 if(p.room)return error(ws,'Você já está em uma sala.');
 let room;
 if(create){
  const code=createCode();
  room={code,host:p.id,members:new Set()};
  rooms.set(code,room);
 }else{
  room=rooms.get(codeOf(message.code));
  if(!room)return error(ws,'Sala não encontrada. Confira o código.');
  if(room.members.size>=MAX_ROOM)return error(ws,'Sala cheia (máximo de 4 jogadores).');
 }
 p.name=nameOf(message.name);
 p.look=lookOf(message.look);
 p.room=room.code;
 p.state=null;
 const others=list(room);
 room.members.add(ws);
 send(ws,{type:'welcome',id:p.id,room:room.code,hostId:room.host,maxPlayers:MAX_ROOM,players:others});
 broadcast(room,{type:'peer-joined',player:{id:p.id,name:p.name,look:p.look,state:null}},ws);
}
function receive(ws,raw){
 const p=clients.get(ws);
 if(!p)return;
 if(typeof raw!=='string'||raw.length>2048)return error(ws,'Mensagem inválida ou muito grande.');
 let m;
 try{m=JSON.parse(raw);}catch{return error(ws,'JSON inválido.');}
 if(!m||typeof m!=='object')return;
 if(m.type==='create')return enter(ws,m,true);
 if(m.type==='join')return enter(ws,m,false);
 if(m.type==='leave')return leave(ws);
 if(m.type==='ping')return send(ws,{type:'pong',at:Date.now()});
 if(m.type!=='state'||!p.room)return;
 const room=rooms.get(p.room),s=m.state;
 if(!room||!s||!finite(s.x)||!finite(s.y)||!finite(s.z)||!finite(s.yaw,500))return;
 const now=Date.now();
 if(now-p.lastState<55)return; // ~18 mensagens/s no máximo por jogador
 p.lastState=now;
 p.state={
  x:Math.round(s.x*100)/100,y:Math.round(s.y*100)/100,
  z:Math.round(s.z*100)/100,yaw:Math.round(s.yaw*1000)/1000,
  walking:!!s.walking,weapon:typeof s.weapon==='string'?s.weapon.slice(0,32):'',
  torch:!!s.torch
 };
 broadcast(room,{type:'peer-state',id:p.id,state:p.state},ws);
}
export function makeServer(){
 const http=createServer((req,res)=>{
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Content-Type','application/json; charset=utf-8');
  if(req.url==='/health'||req.url==='/'){res.writeHead(200);res.end(JSON.stringify({ok:true,service:'FLORESTA multiplayer',rooms:rooms.size,players:clients.size}));return;}
  res.writeHead(404);res.end(JSON.stringify({error:'Not found'}));
 });
 const wss=new WebSocketServer({noServer:true,maxPayload:2048,perMessageDeflate:false});
 http.on('upgrade',(req,socket,head)=>{
  const origin=req.headers.origin;
  const pathname=new URL(req.url||'/', 'http://localhost').pathname;
  if(pathname!=='/ws'||(origin&&!ALLOWED.includes(origin))){
   socket.write('HTTP/1.1 403 Forbidden\r\nConnection: close\r\n\r\n');socket.destroy();return;
  }
  wss.handleUpgrade(req,socket,head,ws=>wss.emit('connection',ws));
 });
 wss.on('connection',ws=>{
  const p={id:randomUUID(),name:'Viajante',look:lookOf(),room:null,state:null,lastState:0,alive:true};
  clients.set(ws,p);
  ws.on('pong',()=>{p.alive=true;});
  ws.on('message',(data,isBinary)=>{if(!isBinary)receive(ws,data.toString());});
  ws.on('close',()=>{leave(ws);clients.delete(ws);});
  ws.on('error',()=>{});
 });
 const heartbeat=setInterval(()=>{
  for(const ws of wss.clients){
   const p=clients.get(ws);
   if(!p)continue;
   if(!p.alive){ws.terminate();continue;}
   p.alive=false;ws.ping();
  }
 },25000);
 heartbeat.unref();
 http.on('close',()=>clearInterval(heartbeat));
 return {http,wss};
}
if(process.argv[1]&&new URL(import.meta.url).pathname===process.argv[1]){
 const {http}=makeServer();
 const port=Number(process.env.PORT)||10000;
 http.listen(port,'0.0.0.0',()=>console.log('[FLORESTA ONLINE] /ws na porta '+port));
}
