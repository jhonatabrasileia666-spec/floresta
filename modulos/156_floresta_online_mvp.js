/* FLORESTA V281 — protótipo online: salas, movimento e avatares remotos.
   Não altera salvamentos, itens, monstros, construção, câmera ou combate local. */
(()=>{'use strict';
 if(window.FlorestaOnline)return;
 const STORE='floresta-online-endpoint-v1';
 const $=id=>document.getElementById(id);
 const params=new URLSearchParams(location.search);
 const safeGet=k=>{try{return localStorage.getItem(k)||''}catch{return ''}};
 let endpoint=params.get('server')||safeGet(STORE),socket=null,room='',me='',host='',peers=new Map();
 let connecting=false,joined=false,players=1,notice='',onlineButton=null,uiPanel=null,lastPoint=null;
 const svg='<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"><circle cx="16" cy="16" r="12"/><path d="M4 16h24M16 4c-8 7-8 17 0 24M16 4c8 7 8 17 0 24"/></svg>';
 const label=(value,n=22)=>String(value||'Viajante').trim().slice(0,n);
 const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 const ready=()=>!!(window.gameFront172?.ready&&window.gameFront172?.showPanel);
 const playing=()=>!!(window.gameFront172?.started&&window.gameFront172?.shell?.hidden);
 const writeUrl=v=>{endpoint=v;try{localStorage.setItem(STORE,v)}catch{}};
 const validServer=v=>/^wss:\/\/[a-z0-9.-]+(?::\d+)?(?:\/[^?#]*)?$/i.test(v)||/^ws:\/\/(?:localhost|127\.0\.0\.1)(?::\d+)?(?:\/[^?#]*)?$/i.test(v);
 function style(){
  if($('florestaOnlineStyle'))return;
  const s=document.createElement('style');s.id='florestaOnlineStyle';s.textContent=`
 #florestaFront #f172Actions [data-action="online"]{border-left:3px solid #81967f!important;color:#dce8d1!important}
 #f172PanelBody .fo-form{max-width:480px;margin:auto;color:#e0ddce;font:14px/1.5 system-ui}
 .fo-form label{display:block;color:#d6be85;font:700 12px/1.4 system-ui;letter-spacing:.04em;margin:14px 0 5px}
 .fo-form input{box-sizing:border-box;width:100%;background:#0a110e;color:#faf0d7;border:1px solid #756b51;border-radius:5px;padding:12px;font:15px system-ui;min-height:46px}
 .fo-form .fo-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:16px 0}
 .fo-form button{padding:12px 10px;background:#28362b;color:#fae5b9;border:1px solid #937e54;border-radius:5px;font:700 14px system-ui;min-height:46px;cursor:pointer}
 .fo-form button:disabled{opacity:.45;cursor:wait}
 .fo-form p{margin:10px 0}
 .fo-form small{color:#bcb4a4}
 .fo-status{min-height:20px;color:#e4cb93;overflow-wrap:anywhere}
 #florestaOnlineHUD{position:fixed;z-index:3600;top:max(8px,env(safe-area-inset-top));right:max(8px,env(safe-area-inset-right));display:flex;align-items:center;gap:7px;max-width:75vw;padding:5px 9px;background:#121b16e8;border:1px solid #8b7f5a;border-radius:5px;color:#ece1bd;font:700 11px system-ui;pointer-events:auto}
 #florestaOnlineHUD[hidden]{display:none!important}
 #florestaOnlineHUD button{background:transparent;border:0;border-left:1px solid #6b684e;color:inherit;padding:5px 4px 5px 9px;font:700 11px system-ui;cursor:pointer}
 #florestaOnlineHUD .fo-led{display:inline-block;width:7px;height:7px;border-radius:50%;background:#91b78c}
 @media(max-width:650px){#florestaOnlineHUD{font-size:10px;top:max(6px,env(safe-area-inset-top));right:max(6px,env(safe-area-inset-right));max-width:59vw;padding:4px 6px}.fo-form .fo-actions{grid-template-columns:1fr}}
 `;document.head.append(s);
 }
 function hub(){
  let el=$('florestaOnlineHUD');
  if(!el){el=document.createElement('div');el.id='florestaOnlineHUD';el.hidden=true;
   el.innerHTML='<span class="fo-led"></span><span id="foHUDText"></span><button type="button" id="foHUDMenu">SALA</button>';
   document.body.append(el);
   $('foHUDMenu').onclick=()=>{window.gameFront172?.open?.();setTimeout(openPanel,100)};
  }
  el.hidden=!joined;
  if(joined)$('foHUDText').textContent=room+' · '+players+'/4';
 }
 function setStatus(msg){notice=msg;const el=$('foStatus');if(el)el.textContent=msg;}
 function refreshPanel(){
  const status=$('foStatus');if(status)status.textContent=notice;
  const tag=$('foConnected');if(tag)tag.hidden=!joined;
  const b=$('foLeave');if(b)b.hidden=!joined;
  const c=$('foCreate');if(c)c.disabled=connecting||joined;
  const j=$('foJoin');if(j)j.disabled=connecting||joined;
  const code=$('foRoomCode');if(code)code.textContent=room||'';
  const count=$('foCount');if(count)count.textContent=String(players);
 }
 function openPanel(){
  const F=window.gameFront172;if(!F?.ready)return;
  style();
  F.showPanel('Multiplayer · Online',`<div class="fo-form">
   <p>Sobreviva com até <strong>4 jogadores</strong> em uma sala privada por código. PC e celular entram na mesma sala.</p>
   <label for="foServer">ENDEREÇO DO SERVIDOR ONLINE (WSS)</label>
   <input id="foServer" type="url" placeholder="wss://seu-servidor.onrender.com/ws" autocomplete="url" value="${escape(endpoint)}">
   <small>Configure o endereço do servidor uma vez. O GitHub Pages não hospeda conexões WebSocket.</small>
   <label for="foName">NOME DO PERSONAGEM</label>
   <input id="foName" maxlength="22" value="${escape(label(safeGet('floresta-online-name-v1')||'Viajante'))}">
   <label for="foRoom">CÓDIGO DA SALA</label>
   <input id="foRoom" maxlength="6" autocapitalize="characters" placeholder="ABC234" value="${escape(params.get('room')||room)}">
   <div class="fo-actions"><button id="foCreate">CRIAR SALA</button><button id="foJoin">ENTRAR NA SALA</button></div>
   <p id="foConnected" ${joined?'':'hidden'}>Sala <strong id="foRoomCode">${escape(room)}</strong> · <span id="foCount">${players}</span> de 4 viajantes</p>
   <div class="fo-actions"><button id="foCopy" type="button">COPIAR CONVITE</button><button id="foLeave" type="button" ${joined?'':'hidden'}>SAIR DA SALA</button></div>
   <p id="foStatus" class="fo-status" role="status">${escape(notice)}</p>
   <small>Protótipo: sincroniza presença, posição, direção e equipamento visual. Inventários, inimigos, construções e dano ainda são locais.</small>
  </div>`);
  $('foCreate').onclick=()=>connect(true);
  $('foJoin').onclick=()=>connect(false);
  $('foLeave').onclick=leave;
  $('foCopy').onclick=async()=>{
   if(!room){setStatus('Entre numa sala antes de copiar o convite.');return;}
   const url=new URL('index.html',location.href);
   url.searchParams.set('room',room);url.searchParams.set('server',endpoint);
   try{await navigator.clipboard.writeText(url.toString());setStatus('Convite copiado: '+room);}
   catch{setStatus('Código: '+room+' · Servidor: '+endpoint);}
  };
  refreshPanel();
 }
 function makeAvatar(peer){
  const T=window.__THREE_MODULE,G=window.gameReview;
  if(!T?.Group||!G?.scene||peer.root)return;
  const root=new T.Group();root.name='FlorestaOnline_'+peer.id;
  const flesh=new T.MeshStandardMaterial({color:0xa98e70,roughness:1,flatShading:true});
  const armor=new T.MeshStandardMaterial({color:0x3a463e,roughness:1,flatShading:true});
  const cloak=new T.MeshStandardMaterial({color:0x232e27,roughness:1,flatShading:true,side:T.DoubleSide});
  const iron=new T.MeshStandardMaterial({color:0x89958e,metalness:.4,roughness:.7,flatShading:true});
  const shape=(geometry,material,x,y,z,rx=0)=>{const mesh=new T.Mesh(geometry,material);mesh.position.set(x,y,z);mesh.rotation.x=rx;mesh.castShadow=true;root.add(mesh);return mesh};
  shape(new T.CylinderGeometry(.24,.33,.78,7),armor,0,1.06,0);
  shape(new T.ConeGeometry(.34,.95,7),cloak,0,1.13,.17,Math.PI);
  shape(new T.SphereGeometry(.175,8,6),flesh,0,1.65,-.01);
  shape(new T.ConeGeometry(.23,.3,7),cloak,0,1.84,0);
  for(const side of [-1,1]){
   shape(new T.CylinderGeometry(.1,.12,.69,6),armor,side*.39,1.08,0);
   shape(new T.CylinderGeometry(.12,.13,.66,6),armor,side*.17,.37,0);
  }
  peer.weaponMesh=shape(new T.BoxGeometry(.045,.75,.05),iron,.50,.98,-.15);
  const canvas=document.createElement('canvas');canvas.width=256;canvas.height=64;
  const ctx=canvas.getContext('2d');
  ctx.fillStyle='rgba(5,13,9,.72)';ctx.fillRect(4,6,248,46);
  ctx.strokeStyle='#887852';ctx.strokeRect(4,6,248,46);
  ctx.fillStyle='#f5dfb5';ctx.font='bold 22px system-ui';ctx.textAlign='center';
  ctx.fillText(peer.name.slice(0,18),128,37);
  const tex=new T.CanvasTexture(canvas),labelSprite=new T.Sprite(new T.SpriteMaterial({map:tex,transparent:true,depthWrite:false}));
  labelSprite.scale.set(1.65,.42,1);labelSprite.position.y=2.22;root.add(labelSprite);
  G.scene.add(root);peer.root=root;peer.materials=[flesh,armor,cloak,iron];peer.labelTexture=tex;
 }
 function disposePeer(peer){
  if(!peer?.root)return;
  peer.root.parent?.remove(peer.root);
  peer.root.traverse(x=>{if(x.geometry)x.geometry.dispose?.();if(x.material?.map)x.material.map.dispose?.();x.material?.dispose?.();});
  peer.root=null;
 }
 function clearPeers(){for(const p of peers.values())disposePeer(p);peers.clear();}
 function addPeer(item){
  if(!item?.id||item.id===me)return;
  let p=peers.get(item.id);
  if(!p){p={id:item.id,name:label(item.name),look:item.look,state:null,root:null,weaponMesh:null};peers.set(item.id,p);}
  if(item.state)p.state=item.state;
  if(window.gameReview?.scene)makeAvatar(p);
 }
 function dispatch(data){
  if(data.type==='error'){setStatus(data.message||'Falha no servidor.');connecting=false;refreshPanel();return;}
  if(data.type==='welcome'){
   me=data.id;room=data.room;host=data.hostId;joined=true;connecting=false;players=data.players.length+1;
   clearPeers();data.players.forEach(addPeer);
   setStatus('Conectado à sala '+room+'.');hub();refreshPanel();
   if(window.gameFront172?.ready&&!playing())window.gameFront172.play('survival');
   return;
  }
  if(data.type==='peer-joined'){addPeer(data.player);players=peers.size+1;hub();refreshPanel();return;}
  if(data.type==='peer-left'){const p=peers.get(data.id);disposePeer(p);peers.delete(data.id);players=peers.size+1;hub();refreshPanel();return;}
  if(data.type==='peer-state'){const p=peers.get(data.id);if(p)p.state=data.state;return;}
  if(data.type==='host-changed'){host=data.hostId;return;}
 }
 function leave(){
  joined=false;connecting=false;room='';me='';players=1;
  if(socket){try{socket.send(JSON.stringify({type:'leave'}));socket.close(1000,'Saindo');}catch{}socket=null;}
  clearPeers();setStatus('Você saiu da sala. O mundo solo não foi alterado.');hub();refreshPanel();
 }
 function connect(create){
  if(connecting||joined)return;
  const url=$('foServer')?.value.trim(),name=label($('foName')?.value),code=$('foRoom')?.value.trim().toUpperCase();
  if(!validServer(url)){setStatus('Digite um servidor WSS válido. Use WS apenas no localhost.');return;}
  if(!create&&!/^[A-HJ-NP-Z2-9]{6}$/.test(code)){setStatus('O código precisa ter 6 letras/números.');return;}
  writeUrl(url);try{localStorage.setItem('floresta-online-name-v1',name)}catch{}
  connecting=true;refreshPanel();setStatus('Conectando ao servidor…');
  let ws;try{ws=new WebSocket(url);}catch(e){connecting=false;setStatus('Falha abrindo conexão: '+e.message);refreshPanel();return;}
  socket=ws;
  const timeout=setTimeout(()=>{if(ws.readyState!==WebSocket.OPEN)ws.close();},15000);
  ws.onopen=()=>{clearTimeout(timeout);
   ws.send(JSON.stringify({type:create?'create':'join',code,name,look:window.gameCharacterV263?.get?.()}));
   setStatus('Aguardando confirmação da sala…');
  };
  ws.onmessage=e=>{if(socket!==ws)return;try{dispatch(JSON.parse(e.data));}catch{}};
  ws.onerror=()=>{if(socket===ws)setStatus('Servidor indisponível ou conexão bloqueada.');};
  ws.onclose=()=>{clearTimeout(timeout);if(socket!==ws)return;
   socket=null;joined=false;connecting=false;room='';me='';players=1;clearPeers();hub();
   setStatus('Conexão encerrada. Confira se o servidor está funcionando.');refreshPanel();
  };
 }
 function update(){
  if(joined&&socket?.readyState===WebSocket.OPEN&&playing()){
   const g=window.gameReview,p=g?.player,now=performance.now();
   if(g?.scene&&p&&(!lastPoint||now-lastPoint.at>=100)){
    const ground=g.groundY?.(p.x,p.z);
    const s={x:p.x,y:Number.isFinite(ground)?ground:p.y||0,z:p.z,yaw:p.yaw||0,
     walking:lastPoint?Math.hypot(p.x-lastPoint.x,p.z-lastPoint.z)>.025:false,
     weapon:window.gameRightHand?.current||'',torch:!!g.isEquipped?.()};
    if([s.x,s.y,s.z,s.yaw].every(Number.isFinite)){
     socket.send(JSON.stringify({type:'state',state:s}));
     lastPoint={at:now,x:p.x,z:p.z};
    }
   }
  }
  const g=window.gameReview;
  for(const peer of peers.values()){
   if(!peer.root&&g?.scene)makeAvatar(peer);
   if(!peer.root||!peer.state)continue;
   if(g?.scene&&peer.root.parent!==g.scene)g.scene.add(peer.root);
   const s=peer.state;
   const blend=.16;
   peer.root.position.x+=(s.x-peer.root.position.x)*blend;
   peer.root.position.z+=(s.z-peer.root.position.z)*blend;
   peer.root.position.y+=(s.y-peer.root.position.y)*blend;
   const delta=Math.atan2(Math.sin(s.yaw-peer.root.rotation.y),Math.cos(s.yaw-peer.root.rotation.y));
   peer.root.rotation.y+=delta*blend;
   const walking=s.walking?Math.sin(performance.now()*.012)*.06:0;
   peer.root.children.forEach(mesh=>{if(mesh.geometry?.type==='CylinderGeometry'&&Math.abs(mesh.position.x)>.09&&mesh.position.y<.8)mesh.rotation.x=walking;});
   if(peer.weaponMesh)peer.weaponMesh.visible=!!s.weapon;
  }
  requestAnimationFrame(update);
 }
 function mount(){
  if(!ready())return;
  style();hub();
  const actions=window.gameFront172.shell?.querySelector('#f172Actions');if(!actions)return;
  let b=actions.querySelector('[data-action="online"]');
  if(!b){
   b=document.createElement('button');b.type='button';b.dataset.action='online';
   b.innerHTML='<span>'+svg+'</span>Multiplayer · Online';
   (actions.querySelector('[data-action="new"]')||actions.lastElementChild).after(b);
  }
  b.onclick=openPanel;
  onlineButton=b;
 }
 window.addEventListener('pagehide',()=>{socket?.close();clearPeers()},{once:true});
 const poll=setInterval(()=>{if(ready()&&!onlineButton)mount();},350);
 window.addEventListener('floresta:ready',mount);
 window.addEventListener('floresta:started',()=>{lastPoint=null;});
 requestAnimationFrame(update);
 window.FlorestaOnline={version:'MVP-1',open:openPanel,leave,get connected(){return joined},get room(){return room},
  get players(){return players},diagnostic:()=>({connected:joined,connecting,room,players,endpoint})};
})();
