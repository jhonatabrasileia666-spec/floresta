import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";
import { createClient } from "@supabase/supabase-js";

const js=readFileSync(new URL("../modulos/157_floresta_duo_supabase.js",import.meta.url),"utf8");
const match=js.match(/const DUO_URL=(".*?"),DUO_KEY=(".*?");/);
assert.ok(match,"O cliente do FLORESTA precisa ter configurações Supabase");
const url=JSON.parse(match[1]),key=JSON.parse(match[2]);
assert.match(url,/^https:\/\/[a-z0-9-]+\.supabase\.co$/);
assert.match(key,/^sb_publishable_[A-Za-z0-9_-]+$/);
const connect=()=>createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
const a=connect(),b=connect();
const room="floresta-duo-ci-"+randomUUID();
const channel=(client,id)=>client.channel(room,{config:{private:false,presence:{key:id},broadcast:{self:false}}});
const one=channel(a,"duo-ci-1"),two=channel(b,"duo-ci-2");
function subscribe(chan){
 return new Promise((resolve,reject)=>{
  const timeout=setTimeout(()=>reject(new Error("Supabase Realtime subscribe expirou após 15s")),15000);
  chan.subscribe((status,error)=>{
   if(status==="SUBSCRIBED"){clearTimeout(timeout);resolve();}
   if(["TIMED_OUT","CHANNEL_ERROR","CLOSED"].includes(status)){clearTimeout(timeout);reject(error||new Error(status));}
  });
 });
}
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
let received=null;
two.on("broadcast",{event:"position"},({payload})=>{received=payload});
try{
 await subscribe(one);
 await subscribe(two);
 assert.equal(await one.track({id:"duo-ci-1",name:"Jogador A"}),"ok");
 assert.equal(await two.track({id:"duo-ci-2",name:"Jogador B"}),"ok");
 let matched=false;
 for(let tries=0;tries<35;tries++){
  const count=Object.values(one.presenceState()).flat().length;
  if(count===2){matched=true;break;}
  await sleep(200);
 }
 assert.ok(matched,"Presence não reconheceu os dois jogadores");
 const result=await one.send({type:"broadcast",event:"position",payload:{id:"duo-ci-1",pos:{x:1,y:2,z:3,yaw:0.5}}});
 assert.equal(result,"ok","Broadcast não foi aceito pelo Supabase");
 for(let tries=0;tries<35&&!received;tries++)await sleep(200);
 assert.equal(received?.pos?.x,1,"Segundo jogador não recebeu movimento");
 console.log("SUCESSO: Supabase Realtime aceitou 2 jogadores, Presence e Broadcast.");
}finally{
 await Promise.allSettled([a.removeChannel(one),b.removeChannel(two)]);
}
