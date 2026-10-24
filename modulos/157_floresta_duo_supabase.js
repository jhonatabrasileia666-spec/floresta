/* FLORESTA Duo v1: dois jogadores via Supabase Realtime, sem servidor Render.
   MVP sincroniza avatares remotos, não sincroniza IA, loot ou construções. */
(()=>{'use strict';
if(window.FlorestaOnline)return;
const $=id=>document.getElementById(id),Q=new URLSearchParams(location.search);
const get=k=>{try{return localStorage.getItem(k)||''}catch{return ''}};
const put=(k,v)=>{try{localStorage.setItem(k,v)}catch{}};
const safe=s=>String(s||'').replace(/[&<>"']/g,'');
const alphabet='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
const roomCode=()=>{const bytes=crypto.getRandomValues(new Uint8Array(9));return [...bytes].map(x=>alphabet[x%alphabet.length]).join('')};
const id=crypto.randomUUID(),state={url:Q.get('sburl')||get('fo-url'),key:Q.get('sbkey')||get('fo-key'),name:get('fo-name')||'Viajante',room:Q.get('room')||'',client:null,channel:null,connected:false,connecting:false,peers:new Map(),status:''};
let attempt=0,mounted=false,lastSent=0;
const playing=()=>!!(window.gameFront172?.started&&window.gameFront172?.shell?.hidden);
function status(s){state.status=s;if($('foStatus'))$('foStatus').textContent=s}
function display(){
 const count=$('foCount');if(count)count.textContent=String(state.connected?state.peers.size+1:0);
 const room=$('foRoomLabel');if(room)room.textContent=state.room;
 const hud=$('foHUD');if(hud){hud.hidden=!state.connected;hud.textContent='ONLINE '+(state.peers.size+1)+'/2 · '+state.room;}
 for(const x of ['foCreate','foJoin'])if($(x))$(x).disabled=state.connecting||state.connected;
 for(const x of ['foLeave','foInvite'])if($(x))$(x).disabled=!state.connected;
}
function removePeer(p){
 const root=p?.root;if(!root)return;
 root.parent?.remove(root);
 root.traverse(o=>{o.geometry?.dispose?.();o.material?.map?.dispose?.();o.material?.dispose?.()});
 p.root=null;
}
function syncPeers(){
 if(!state.connected||!state.channel)return;
 const peers=Object.values(state.channel.presenceState()||{}).flat().filter(p=>p.id!==id&&p.id);
 const keep=new Set(peers.slice(0,1).map(p=>p.id));
 for(const [pid,p] of state.peers)if(!keep.has(pid)){removePeer(p);state.peers.delete(pid)}
 for(const p of peers.slice(0,1))if(!state.peers.has(p.id))state.peers.set(p.id,{id:p.id,name:safe(p.name).slice(0,20),target:null,root:null});
 display();
}
function avatar(p){
 const T=window.__THREE_MODULE,g=window.gameReview;
 if(p.root||!T?.Group||!g?.scene)return;
 const r=new T.Group();r.name='Floresta_Amigo_'+p.id;
 const cloth=new T.MeshStandardMaterial({color:0x455447,roughness:1,flatShading:true});
 const face=new T.MeshStandardMaterial({color:0xc09a79,roughness:1,flatShading:true});
 const piece=(geometry,material,x,y,z)=>{
  const m=new T.Mesh(geometry,material);m.position.set(x,y,z);m.castShadow=true;r.add(m);
 };
 piece(new T.CylinderGeometry(.2,.32,.78,7),cloth,0,1.06,0);
 piece(new T.SphereGeometry(.16,8,6),face,0,1.62,0);
 piece(new T.ConeGeometry(.24,.32,7),cloth,0,1.82,0);
 for(const side of [-1,1]){
  piece(new T.CylinderGeometry(.1,.12,.62,6),cloth,.36*side,1.07,0);
  piece(new T.CylinderGeometry(.11,.13,.62,6),cloth,.17*side,.36,0);
 }
 const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;
 const ctx=canvas.getContext('2d');ctx.fillStyle='#0b160ddf';ctx.fillRect(2,4,252,48);
 ctx.strokeStyle='#9b845d';ctx.strokeRect(2,4,252,48);ctx.fillStyle='#f1dfbf';
 ctx.textAlign='center';ctx.font='bold 20px system-ui';ctx.fillText(p.name,128,35);
 const tex=new T.CanvasTexture(canvas),label=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
 label.position.y=2.2;label.scale.set(1.6,.4,1);r.add(label);
 g.scene.add(r);p.root=r;
}
function leave(){
 attempt++;state.connected=false;state.connecting=false;
 const client=state.client,channel=state.channel;state.client=null;state.channel=null;
 if(client&&channel)client.removeChannel(channel).catch(()=>{});
 for(const p of state.peers.values())removePeer(p);
 state.peers.clear();display();
}
async function connect(create){
 if(state.connected||state.connecting)return;
 const url=($('foUrl')?.value||'').trim().replace(/\/$/,'');
 const key=($('foKey')?.value||'').trim(),name=safe(($('foName')?.value||'').trim()).slice(0,22)||'Viajante';
 const code=($('foCode')?.value||'').trim().toUpperCase();
 if(!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url))return status('Use a URL HTTPS de seu projeto Supabase.');
 if(!(/^sb_publishable_[a-z0-9_-]+$/i.test(key)||(/^eyJ[a-z0-9_-]+\.[a-z0-9_-]+\.[a-z0-9_-]+$/i.test(key)&&key.length>100)))return status('Use somente a chave publishable (pública). Nunca a service_role.');
 if(!create&&!/^[A-HJ-NP-Z2-9]{9}$/.test(code))return status('Digite o código de 9 caracteres do seu amigo.');
 state.url=url;state.key=key;state.name=name;state.room=create?roomCode():code;
 put('fo-url',url);put('fo-key',key);put('fo-name',name);
 state.connecting=true;display();status('Conectando ao Supabase Realtime…');
 const ticket=++attempt;
 try{
  const sdk=await import('https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.75.0/+esm');
  if(ticket!==attempt)return;
  const client=sdk.createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false,detectSessionInUrl:false}});
  const channel=client.channel('floresta-duo-'+state.room,{config:{private:false,broadcast:{self:false},presence:{key:id}}});
  state.client=client;state.channel=channel;
  let started=false;
  const timeout=setTimeout(()=>{if(ticket===attempt&&!state.connected){leave();status('A conexão expirou. Confira o Supabase.')}},15000);
  channel.on('broadcast',{event:'position'},({payload})=>{
   if(!state.connected||!payload||payload.id===id)return;
   const p=state.peers.get(payload.id),v=payload.pos;
   if(p&&v&&[v.x,v.y,v.z,v.yaw].every(Number.isFinite)&&Math.abs(v.x)<10000&&Math.abs(v.z)<10000)p.target=v;
  });
  channel.on('presence',{event:'sync'},async()=>{
   if(ticket!==attempt)return;
   if(!started){
    started=true;
    const others=Object.values(channel.presenceState()).flat().filter(p=>p.id&&p.id!==id);
    if((create&&others.length)||(!create&&others.length!==1)){
     clearTimeout(timeout);leave();status(create?'Código ocupado. Crie outra sala.':others.length?'Sala cheia. Apenas dois jogadores.':'Sala inexistente ou anfitrião desconectado.');return;
    }
    const response=await channel.track({id,name,connected_at:Date.now()});
    if(ticket!==attempt)return;
    if(response!=='ok'){clearTimeout(timeout);leave();status('Erro registrando o jogador.');return;}
    clearTimeout(timeout);state.connected=true;state.connecting=false;
    status('Conectado! Sala '+state.room);
    if(window.gameFront172?.ready&&!playing())window.gameFront172.play('survival');
   }
   syncPeers();
  });
  channel.subscribe((st,err)=>{
   if(ticket!==attempt)return;
   if(st==='CHANNEL_ERROR'||st==='TIMED_OUT'){clearTimeout(timeout);leave();status('Falha no canal: '+(err?.message||st));}
   if(st==='CLOSED'&&state.connected){leave();status('Conexão encerrada.');}
  });
 }catch(err){if(ticket===attempt){leave();status('Não foi possível conectar: '+err.message);}}
}
function open(){
 const F=window.gameFront172;if(!F?.ready)return;
 F.showPanel('Cooperativo · 2 jogadores',
 '<div id="foForm" style="max-width:480px;margin:auto;color:#e5ddc7;font:14px/1.5 system-ui">'+
 '<p>Você e um amigo no mesmo jogo. Sem Render, com um projeto Supabase Free separado.</p>'+
 '<label>URL DO PROJETO SUPABASE</label><input id="foUrl" type="url" placeholder="https://seuprojeto.supabase.co">'+
 '<label>CHAVE PUBLISHABLE PÚBLICA</label><input id="foKey" placeholder="sb_publishable_...">'+
 '<small>Nunca coloque a chave secret/service_role. O projeto deve ser dedicado ao FLORESTA.</small>'+
 '<label>SEU NOME</label><input id="foName" maxlength="22">'+
 '<label>CÓDIGO DA SALA</label><input id="foCode" maxlength="9" placeholder="9 CARACTERES">'+
 '<div class="foActions"><button id="foCreate">CRIAR SALA</button><button id="foJoin">ENTRAR</button></div>'+
 '<p>Sala <strong id="foRoomLabel"></strong> · <span id="foCount">0</span>/2 jogadores</p>'+
 '<div class="foActions"><button id="foInvite">COPIAR CONVITE</button><button id="foLeave">SAIR</button></div>'+
 '<p id="foStatus" role="status"></p>'+
 '<small>Protótipo: posição e presença online. Inimigos, dano, coleta e construções ainda não são compartilhados.</small></div>');
 $('foUrl').value=state.url;$('foKey').value=state.key;$('foName').value=state.name;$('foCode').value=state.room;
 $('foCreate').onclick=()=>connect(true);$('foJoin').onclick=()=>connect(false);
 $('foLeave').onclick=()=>{leave();status('Saiu da sala. Modo solo preservado.')};
 $('foInvite').onclick=async()=>{
  const u=new URL('index.html',location.href);
  u.searchParams.set('room',state.room);u.searchParams.set('sburl',state.url);u.searchParams.set('sbkey',state.key);
  try{await navigator.clipboard.writeText(u.href);status('Convite copiado!')}catch{status('Copie o código '+state.room)}
 };
 status(state.status);display();
}
function mount(){
 if(mounted||!window.gameFront172?.ready)return;
 const actions=window.gameFront172.shell?.querySelector('#f172Actions');if(!actions)return;
 const css=document.createElement('style');css.textContent=
 '#foForm label{display:block;color:#dac18b;font:700 12px system-ui;margin:12px 0 5px}'+
 '#foForm input{box-sizing:border-box;width:100%;padding:10px;background:#101810;color:#fff;border:1px solid #8d805c;border-radius:5px}'+
 '#foForm button{padding:10px;background:#28372c;border:1px solid #ab8e56;color:#f4e4bf;border-radius:5px;min-height:44px}'+
 '#foForm .foActions{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:12px 0}'+
 '#foForm button:disabled{opacity:.45}'+
 '#foHUD{position:fixed;top:max(8px,env(safe-area-inset-top));right:8px;z-index:4000;background:#132016ed;color:#f3deb5;border:1px solid #a68a54;padding:7px;border-radius:4px;font:700 11px system-ui}'+
 '#foHUD[hidden]{display:none!important}';
 document.head.append(css);
 const btn=document.createElement('button');btn.type='button';btn.dataset.action='duo';
 btn.textContent='COOPERATIVO · 2 JOGADORES';
 (actions.querySelector('[data-action="new"]')||actions.lastElementChild).after(btn);
 btn.onclick=open;
 const hud=document.createElement('button');hud.id='foHUD';hud.hidden=true;hud.onclick=()=>{window.gameFront172?.open?.();setTimeout(open,100)};
 document.body.append(hud);mounted=true;display();
}
function tick(){
 if(state.connected&&state.channel&&playing()){
  const g=window.gameReview,p=g?.player,t=performance.now();
  if(g?.scene&&p&&t-lastSent>=250){
   const y=g.groundY?.(p.x,p.z);
   const pos={x:p.x,y:Number.isFinite(y)?y:Number(p.y)||0,z:p.z,yaw:p.yaw||0};
   if([pos.x,pos.y,pos.z,pos.yaw].every(Number.isFinite)){
    state.channel.send({type:'broadcast',event:'position',payload:{id,pos}});lastSent=t;
   }
  }
 }
 for(const p of state.peers.values()){
  if(!p.root)avatar(p);
  if(!p.root||!p.target)continue;
  const v=p.target;
  if(!p.placed){p.root.position.set(v.x,v.y,v.z);p.root.rotation.y=v.yaw;p.placed=true;}
  else{
   p.root.position.x+=(v.x-p.root.position.x)*.18;
   p.root.position.y+=(v.y-p.root.position.y)*.18;
   p.root.position.z+=(v.z-p.root.position.z)*.18;
   p.root.rotation.y+=Math.atan2(Math.sin(v.yaw-p.root.rotation.y),Math.cos(v.yaw-p.root.rotation.y))*.18;
  }
 }
 requestAnimationFrame(tick);
}
window.addEventListener('floresta:ready',mount);
const timer=setInterval(mount,400);
window.addEventListener('pagehide',()=>{clearInterval(timer);leave()},{once:true});
requestAnimationFrame(tick);
window.FlorestaOnline={open,leave,get connected(){return state.connected},
 get room(){return state.room},diagnostic:()=>({connected:state.connected,players:state.peers.size+1,room:state.room})};
})();
