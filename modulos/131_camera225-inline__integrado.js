
/* FLORESTA V225 — camera nos olhos + linguagem corporal visível.
   A engine chama beforeRender()/afterRender() DIRETAMENTE no tick principal
   após todas as animações FBX e antes da renderização (PC + Mobile).
   Não cria câmera independente, não altera mira/física/arma/personagem.
*/
(()=>{
 'use strict';
 if(window.gameCamera225)return;
 const KEY='floresta-camera-v225-intensidade';
 const LEVELS={desligado:0,suave:.58,normal:1,intenso:1.4};
 const clamp=(x,a,b)=>Math.max(a,Math.min(b,x));
 const lerp=(x,to,f,dt)=>x+(to-x)*(1-Math.exp(-f*dt));
 const damp=(x,vel,k,drag,dt)=>{
   vel+=(-k*x-drag*vel)*dt;
   x+=vel*dt;
   return [x,vel];
 };
 const bell=(t,start,peak,end)=>t<start||t>end?0:t<peak?(t-start)/(peak-start):(end-t)/(end-peak);
 let intensity='normal';
 try{const saved=localStorage.getItem(KEY);if(Object.hasOwn(LEVELS,saved))intensity=saved;}catch{}
 let game=null, THREE=null, saved=null, overlay=null, panel=null, status=null, frameCount=0;
 let originPos=null,originRot=null,translation=null,angles=null,turnQ=null;
 let lastStatusUpdate=0;
 const s={at:0,px:NaN,pz:NaN,yaw:NaN,phase:0,wasOnGround:true,
   walking:0,running:0,left:0,front:0,turn:0,bobX:0,bobY:0,bobPitch:0,bobRoll:0,lean:0,fov:0,
   pitch:0,pitchV:0,roll:0,rollV:0,yawKick:0,yawV:0,push:0,pushV:0,
   lastAttack:-99,weapon:'axe',attackCount:0,hitTime:-99,lastDamage:-99,damageCount:0,
   veil:0,wasAttack:false,groundDrop:0,lastMode:'parado',lastMove:0};
 function fxAttack(kind){
   const now=performance.now()*.001;
   if(now-s.lastAttack<.16)return;
   s.lastAttack=now;
   s.weapon=kind||'axe';s.attackCount++;
   const heavy=kind==='hammer'?1.25:kind==='pickaxe'?1.12:kind==='spear'?.9:1;
   // Preparação do corpo -> avanço no golpe. A mola não altera a mira persistente.
   s.pitchV-=.72*heavy;
   s.rollV+=(s.attackCount%2?-.28:.28)*heavy;
 }
 function fxHit(kind){
   const now=performance.now()*.001;
   s.hitTime=now;
   if(now-s.lastAttack>.8)fxAttack(kind);
   const heavy=kind==='hammer'?1.35:1;
   s.pitchV+=1.45*heavy;
   s.pushV+=.52*heavy;
   s.rollV+=(s.attackCount%2?-.45:.45)*heavy;
 }
 function fxDamage(ev){
   const dmg=Number(ev?.detail?.damage);
   if(!(dmg>0))return;
   const k=clamp(dmg/20,.48,1.7);
   s.lastDamage=performance.now()*.001;
   s.damageCount++;
   s.pitchV+=2.45*k;
   s.rollV+=(s.damageCount%2?2.05:-2.05)*k;
   s.yawV+=(s.damageCount%2?1.12:-1.12)*k;
   s.pushV-=.34*k;
   s.veil=Math.max(s.veil,clamp(.48*k,.28,.82));
 }
 window.addEventListener('game:player-damaged',fxDamage);
 window.addEventListener('game:axe-impact',()=>fxHit('axe'));
  window.addEventListener('game:combat-hit-confirmed',ev=>{if(ev.detail?.weapon==='sword')fxHit('axe');});
 window.addEventListener('game:hammer-impact',()=>fxHit('hammer'));
 function ensureUI(){
   if(!overlay&&document.body){
     overlay=document.createElement('div');
     overlay.id='camera225-impact';overlay.setAttribute('aria-hidden','true');
     overlay.style.cssText='position:fixed;inset:0;z-index:800;pointer-events:none;opacity:0;will-change:opacity;background:radial-gradient(ellipse at center,transparent 36%,rgba(130,3,11,.07) 54%,rgba(105,5,11,.60) 100%)';
     document.body.appendChild(overlay);
   }
   if(panel)return;
   const drawer=document.getElementById('h171Drawer');if(!drawer)return;
   panel=document.createElement('section');panel.id='camera225-settings';
   panel.style.cssText='margin:14px 4px;padding:12px;border:1px solid #b3935c55;background:#17170f;border-radius:5px;position:relative;z-index:1';
   panel.innerHTML='<div style="font:600 13px system-ui;letter-spacing:.5px;color:#e5ca91;margin-bottom:8px">CÂMERA · SENSAÇÃO DE MOVIMENTO <small style="color:#9acd91">V225</small></div><label for="camera225-strength" style="font:12px system-ui;color:#e0cfa9">Intensidade de corrida, deslocamento e golpes</label><select id="camera225-strength" style="display:block;margin:9px 0;width:100%;font:13px system-ui;background:#171710;color:#e4d6b9;border:1px solid #8c7047;border-radius:5px;padding:9px"><option value="desligado">Desligado</option><option value="suave">Suave</option><option value="normal">Normal</option><option value="intenso">Intenso</option></select><div id="camera225-status" style="font:11px/1.5 system-ui;color:#a8c89d">Aguardando partida…</div><button id="camera225-test" type="button" style="margin:8px 0 3px;padding:8px 12px;cursor:pointer">Testar impacto da câmera</button><p style="font:11px/1.4 system-ui;color:#b8ae98;margin:6px 0 0">A câmera permanece nos olhos do personagem. Este teste não causa dano.</p>';
   drawer.appendChild(panel);status=panel.querySelector('#camera225-status');
   panel.querySelector('select').value=intensity;
   panel.querySelector('select').addEventListener('change',e=>setIntensity(e.target.value));
   panel.querySelector('#camera225-test').addEventListener('click',()=>{
      fxDamage({detail:{damage:18}});
      // Sem efeitos permanentes na vida do jogador; apenas um pulso de câmera.
      if(status)status.textContent='Teste acionado. Feche as configurações para sentir o impacto em partida.';
   });
 }
 function setIntensity(v){
   if(!Object.hasOwn(LEVELS,v))return;
   intensity=v;
   try{localStorage.setItem(KEY,v);}catch{}
   const sel=panel?.querySelector('select');if(sel&&sel.value!==v)sel.value=v;
   if(LEVELS[v]===0&&overlay)overlay.style.opacity='0';
 }
 function isGameplay(){
   if(!game?.camera||!game?.player||!THREE)return false;
   if(!document.body||document.body.classList.contains('f172-front'))return false;
   if(window.gameFront172&&(!window.gameFront172.shell?.hidden||window.gameFront172.paused))return false;
   // Editores e cenas separadas possuem controles próprios de câmera.
   if(window.gameSpiderCave?.active||window.gameEditor210?.active||window.gameWorkshopEditor?.active||window.gameWorkshop?.active)return false;
   return true;
 }
 function track(dt,now){
   const p=game.player,keys=game.keys;
   const x=Number(p.x)||0,z=Number(p.z)||0;
   const dx=x-s.px,dz=z-s.pz;
   const distance=Math.hypot(dx,dz);
   const valid=Number.isFinite(s.px)&&dt>.001&&dt<.10&&distance<1.0;
   const speed=valid?clamp(distance/dt,0,9):0;
   const yaw=Number(p.yaw)||0;
   const forward=valid&&distance>.0001?clamp((-dx*Math.sin(yaw)-dz*Math.cos(yaw))/distance,-1,1):0;
   const strafe=valid&&distance>.0001?clamp((dx*Math.cos(yaw)-dz*Math.sin(yaw))/distance,-1,1):0;
   const grounded=game.physics186?.grounded!==false;
   const rolling=!!window.gameRoll?.active;
   const crouching=keys?.has('ControlLeft')||keys?.has('ControlRight')||keys?.has('KeyC')||(window.trueFirstPerson?.state?.crouch||0)>.5;
   const uiBusy=!!window.gameCraft?.active||!!window.gameHammerCraft?.active||!!window.gameInventory?.isOpen;
   const canMove=grounded&&!rolling&&!crouching&&!uiBusy;
   const move=canMove?clamp((speed-.14)/1.7,0,1):0;
   const config=window.trueFirstPerson?.config||{};
   const runSpeed=Number(config.runSpeed)||4.45,walkSpeed=Number(config.walkSpeed)||2.35;
   const runningInput=!!(keys?.has('ShiftLeft')||keys?.has('ShiftRight'))||Number(p.speed)>(runSpeed+walkSpeed)*.5;
   const run=canMove?move*(runningInput?1:clamp((speed-(walkSpeed+.6))/(runSpeed-walkSpeed+.25),0,1)*.60):0;
   const prevYaw=s.yaw;
   const yawDelta=Number.isFinite(prevYaw)?Math.atan2(Math.sin(yaw-prevYaw),Math.cos(yaw-prevYaw)):0;
   const turn=valid?clamp(yawDelta/Math.max(.008,dt),-3.3,3.3):0;
   s.px=x;s.pz=z;s.yaw=yaw;
   s.lastMove=speed;
   s.walking=lerp(s.walking,move,12,dt);
   s.running=lerp(s.running,run,10,dt);
   s.left=lerp(s.left,strafe*move,10,dt);
   s.front=lerp(s.front,forward*move,9,dt);
   s.turn=lerp(s.turn,turn,8,dt);
   const stride=s.walking*(1-.22*s.running);
   const gaitSpeed=8.5+5*s.running;
   if(valid&&move>.03)s.phase+=dt*gaitSpeed;
   const ph=s.phase;
   // Dupla batida do pé, leve oscilação lateral e rotação do pescoço.
   const bobY=-Math.abs(Math.sin(ph))*(.031*stride+.035*s.running);
   const bobX=Math.sin(ph*.5)*(.017*stride+.019*s.running);
   const bobPitch=(Math.cos(ph*2)*(.009*stride+.014*s.running))+.022*s.running*Math.max(0,s.front);
   const bobRoll=Math.sin(ph)*(.010*stride+.011*s.running);
   s.bobX=lerp(s.bobX,bobX,17,dt);
   s.bobY=lerp(s.bobY,bobY,18,dt);
   s.bobPitch=lerp(s.bobPitch,bobPitch,12,dt);
   s.bobRoll=lerp(s.bobRoll,bobRoll,13,dt);
   s.lean=lerp(s.lean,-s.left*(.028+.027*s.running)-s.turn*.014,10,dt);
   s.fov=lerp(s.fov,s.running*(5.4-.55*Math.abs(s.left)),6.5,dt);
   // Reação da aterrissagem: reação ao contato com o solo, não salto artificial.
   if(!s.wasOnGround&&grounded){s.pitchV+=.60;s.pushV-=.15;}
   s.wasOnGround=grounded;
   const attackNow=!!window.gameAttack?.active||!!window.gamePrimitive?.attackActive&&!window.gamePrimitive?.charging;
   if(attackNow&&!s.wasAttack){
     const kind=window.gameAttack?.active?window.gameAttack.weapon:window.gameRightHand?.current;
     fxAttack(kind);
   }
   s.wasAttack=attackNow;
   [s.pitch,s.pitchV]=damp(s.pitch,s.pitchV,92,17,dt);
   [s.roll,s.rollV]=damp(s.roll,s.rollV,92,17,dt);
   [s.yawKick,s.yawV]=damp(s.yawKick,s.yawV,92,17,dt);
   [s.push,s.pushV]=damp(s.push,s.pushV,94,18,dt);
   s.pitch=clamp(s.pitch,-.16,.16);s.roll=clamp(s.roll,-.16,.16);s.yawKick=clamp(s.yawKick,-.10,.10);
   s.push=clamp(s.push,-.06,.07);
   s.veil*=Math.exp(-dt*6.2);
   const t=now-s.lastAttack;
   const heavy=s.weapon==='hammer'?1.23:s.weapon==='pickaxe'?1.12:s.weapon==='spear'?.86:1;
   // Ataque: recua na preparação e avança junto com a batida.
   const prep=bell(t,0,.13,.25),strike=bell(t,.15,.34,.60),recover=bell(t,.42,.63,.85);
   const strikePitch=(-.034*prep+.093*strike-.016*recover)*heavy;
   const strikeRoll=(s.attackCount%2?-.029:.029)*strike*heavy;
   const strikeForward=.075*strike*heavy;
   const active=rolling?.18:window.gamePlayerHit?.active?.55:1;
   s.lastMode=s.running>.43?'CORRENDO':s.walking>.18?'ANDANDO':'PARADO';
   return {x:s.bobX+s.left*.027,y:s.bobY,depth:-strikeForward+s.push,
      pitch:s.bobPitch+s.pitch+strikePitch,roll:s.bobRoll+s.roll+s.lean+strikeRoll,
      yaw:s.yawKick-s.turn*.005,fov:s.fov,active};
 }
 function beforeRender(scene,camera){
   if(saved||!isGameplay()||scene!==game.scene||camera!==game.camera)return false;
   const now=performance.now()*.001,dt=s.at?clamp(now-s.at,.001,.05):.016;s.at=now;
   ensureUI();
   const fx=track(dt,now),k=LEVELS[intensity];
   if(overlay)overlay.style.opacity=String(clamp(s.veil*k,0,.75));
   frameCount++;
   if(status&&(!panel?.parentElement?.hidden)&&now-lastStatusUpdate>.28){
     status.textContent='V225 ativa · '+s.lastMode+' · '+frameCount+' quadros · '+s.attackCount+' golpes · '+s.damageCount+' impactos';lastStatusUpdate=now;
   }
   if(!k)return false;
   const cam=game.camera;
   originPos.copy(cam.position);originRot.copy(cam.quaternion);
   saved={fov:cam.fov,camera:cam};
   const eff=k*fx.active;
   // Transformações temporárias em coordenadas LOCAIS dos olhos do personagem.
   translation.set(clamp(fx.x*eff,-.085,.085),clamp(fx.y*eff,-.105,.105),clamp(fx.depth*eff,-.105,.085));
   translation.applyQuaternion(originRot);cam.position.add(translation);
   angles.set(clamp(fx.pitch*eff,-.16,.16),clamp(fx.yaw*eff,-.11,.11),clamp(fx.roll*eff,-.15,.15),'YXZ');
   cam.quaternion.multiply(turnQ.setFromEuler(angles));
   const desiredFov=saved.fov+fx.fov*eff;
   if(Math.abs(desiredFov-saved.fov)>.02){cam.fov=desiredFov;cam.updateProjectionMatrix();}
   cam.updateMatrixWorld(true);
   return true;
 }
 function afterRender(){
   if(!saved)return;
   const {camera:cam,fov}=saved;saved=null;
   cam.position.copy(originPos);cam.quaternion.copy(originRot);
   if(cam.fov!==fov){cam.fov=fov;cam.updateProjectionMatrix();}
   cam.updateMatrixWorld(true);
 }
 function bootstrap(){game=window.gameReview||null;THREE=window.__THREE_MODULE||null;ensureUI();
   if(game?.camera&&game?.player&&THREE?.Vector3){if(!originPos){originPos=new THREE.Vector3();originRot=new THREE.Quaternion();translation=new THREE.Vector3();angles=new THREE.Euler(0,0,0,'YXZ');turnQ=new THREE.Quaternion();}return true;}return false;}
 let count=0;
 const handle=setInterval(()=>{if(bootstrap()||++count>=600)clearInterval(handle);},100);
 // Sob chamada direta, sem depender de interceptar .render de outros módulos.
 window.gameCamera225={version:'V225',beforeRender,afterRender,setIntensity,get intensity(){return intensity},
   get installed(){return !!(game?.camera&&THREE?.Vector3)},
   get state(){return {frames:frameCount,mode:s.lastMode,walk:s.walking,run:s.running,strafe:s.left,attacks:s.attackCount,damage:s.damageCount}},
   pulseAttack:fxAttack,pulseImpact:fxHit,pulseDamage:amount=>fxDamage({detail:{damage:amount}})};
})();

