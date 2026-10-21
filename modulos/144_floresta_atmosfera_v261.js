/* FLORESTA V261 — atmosfera reativa.
   Som posicional gerado proceduralmente, sinais reais de barulho/luz e pausas de tensão.
   Não altera cenário, materiais PSX, iluminação, câmera, física ou spawns. */
(()=>{
 'use strict';
 if(window.FlorestaAtmosferaV261)return;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 const rand=(a,b)=>a+Math.random()*(b-a);
 const state={night:false,day:1,active:false,torch:false,enabled:true,cues:0,treeHits:0,treeFalls:0,lastCue:'',silentUntil:0,nextCue:0,quietAt:0,ctx:null,master:null,windGain:null,wind:null,windBuffer:null};
 const settingKey='floresta.atmosfera.v261.enabled';
 try{state.enabled=localStorage.getItem(settingKey)!=='0'}catch{}
 let lastTick=0,started=false;
 function game(){return window.gameReview}
 function playable(){return !!(window.gameFront172?.started&&!window.gameFront172?.paused&&!window.gameSpiderCave?.active&&!window.gameTestMode?.active&&!document.hidden&&!document.body?.classList.contains('f172-front'))}
 function atNight(){const h=Number(game()?.dayNight?.hour);return Number.isFinite(h)&&(h>=19||h<5.8)}
 function loc(){const p=game()?.player;return p&&Number.isFinite(p.x)&&Number.isFinite(p.z)?p:null}
 function torchLit(){const g=game();return !!(g?.isEquipped?.()&&g?.isTorchLit?.());}
 function context(){
  if(!state.enabled||!playable())return null;
  if(state.ctx)return state.ctx;
  const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return null;
  try{
   const ctx=new AC(),master=ctx.createGain();master.gain.value=.52;master.connect(ctx.destination);
   const buffer=ctx.createBuffer(1,Math.floor(ctx.sampleRate*1.35),ctx.sampleRate),samples=buffer.getChannelData(0);
   let prev=0;for(let i=0;i<samples.length;i++){prev=prev*.94+(Math.random()*2-1)*.06;samples[i]=prev*2;}
   const noise=ctx.createBufferSource(),lp=ctx.createBiquadFilter(),gain=ctx.createGain();
   noise.buffer=buffer;noise.loop=true;lp.type='lowpass';lp.frequency.value=390;
   gain.gain.value=0;noise.connect(lp);lp.connect(gain);gain.connect(master);noise.start();
   state.ctx=ctx;state.master=master;state.windGain=gain;state.wind=noise;state.windBuffer=buffer;
   return ctx;
  }catch(e){console.warn('[Atmosfera V261] Áudio indisponível',e);return null;}
 }
 function unlock(){if(!playable()||!state.enabled)return;const ctx=context();if(ctx?.state==='suspended')ctx.resume().catch(()=>{});}
 window.addEventListener('pointerdown',unlock,{passive:true});
 window.addEventListener('touchstart',unlock,{passive:true});
 window.addEventListener('keydown',unlock,{passive:true});
 window.addEventListener('floresta:started',unlock);
 window.addEventListener('floresta:audio-unlock',unlock);
 function listener(){
  const ctx=state.ctx,p=loc(),cam=game()?.camera;if(!ctx||!p)return;
  const l=ctx.listener,t=ctx.currentTime,y=Number.isFinite(cam?.position?.y)?cam.position.y:1.7;
  const yaw=Number(p.yaw)||0,fx=-Math.sin(yaw),fz=-Math.cos(yaw);
  if(l.positionX){l.positionX.setValueAtTime(p.x,t);l.positionY.setValueAtTime(y,t);l.positionZ.setValueAtTime(p.z,t);
   l.forwardX.setValueAtTime(fx,t);l.forwardY.setValueAtTime(0,t);l.forwardZ.setValueAtTime(fz,t);
   l.upX.setValueAtTime(0,t);l.upY.setValueAtTime(1,t);l.upZ.setValueAtTime(0,t);
  }else if(l.setPosition){l.setPosition(p.x,y,p.z);l.setOrientation?.(fx,0,fz,0,1,0);}
 }
 function spatial(x,z){
  const ctx=state.ctx,pan=ctx.createPanner();pan.panningModel='equalpower';pan.distanceModel='inverse';
  pan.refDistance=13;pan.maxDistance=75;pan.rolloffFactor=.65;
  const y=Number(game()?.groundY?.(x,z))||0;
  if(pan.positionX){pan.positionX.value=x;pan.positionY.value=y+1.5;pan.positionZ.value=z;}
  else pan.setPosition(x,y+1.5,z);
  pan.connect(state.master);return pan;
 }
 function cue(kind,x,z,volume=1){
  const ctx=state.ctx;
  if(!ctx||ctx.state!=='running'||!playable()||!state.enabled)return false;
  const p=loc();if(!p||!Number.isFinite(x)||!Number.isFinite(z))return false;
  const d=Math.hypot(x-p.x,z-p.z);if(d>85)return false;
  listener();
  try{
   const pan=spatial(x,z),time=ctx.currentTime;
   function tone(f,end,seconds,amount,type='triangle',start=0){
    const osc=ctx.createOscillator(),gain=ctx.createGain();osc.type=type;
    osc.frequency.setValueAtTime(f,time+start);osc.frequency.exponentialRampToValueAtTime(Math.max(15,end),time+start+seconds);
    gain.gain.setValueAtTime(.0001,time+start);gain.gain.exponentialRampToValueAtTime(Math.max(.0002,amount*volume),time+start+.018);
    gain.gain.exponentialRampToValueAtTime(.0001,time+start+seconds);
    osc.connect(gain);gain.connect(pan);osc.start(time+start);osc.stop(time+start+seconds+.02);
    osc.onended=()=>{osc.disconnect();gain.disconnect();};
   }
   function textured(seconds,amount,cutoff=850,start=0){
    const src=ctx.createBufferSource(),filter=ctx.createBiquadFilter(),gain=ctx.createGain();
    src.buffer=state.windBuffer;filter.type='bandpass';filter.frequency.value=cutoff;filter.Q.value=.6;
    const when=time+start;
    gain.gain.setValueAtTime(.0001,when);gain.gain.linearRampToValueAtTime(amount*volume,when+Math.min(.085,seconds*.25));
    gain.gain.exponentialRampToValueAtTime(.0001,when+seconds);
    src.connect(filter);filter.connect(gain);gain.connect(pan);src.start(when,rand(0,.15));src.stop(when+seconds+.01);
    src.onended=()=>{src.disconnect();filter.disconnect();gain.disconnect()};
   }
   if(kind==='galho'){textured(.28,.11,630);tone(145,67,.19,.075,'triangle');}
   else if(kind==='folhas'){textured(1.08,.095,1250);textured(.52,.053,530,.24);}
   else if(kind==='passos'){tone(74,46,.15,.075,'triangle');textured(.13,.068,190);tone(76,42,.14,.067,'triangle',.43);textured(.11,.055,160,.43);}
   else if(kind==='arvore'){textured(1.1,.16,280);tone(90,30,.75,.105,'sine');}
   else if(kind==='sussurro'){textured(1.25,.07,410);tone(112,91,.78,.028,'sine');}
   else return false;
   // Os nós de áudio temporários são descartados após o último eco.
   setTimeout(()=>{try{pan.disconnect()}catch{}},1700);
   state.lastCue=kind;state.cues++;
   return true;
  }catch(e){console.warn('[Atmosfera V261] Falha no efeito',e);return false;}
 }
 function randomPosition(radiusMin,radiusMax){const p=loc();if(!p)return null;const theta=rand(0,Math.PI*2),r=rand(radiusMin,radiusMax);return {x:p.x+Math.cos(theta)*r,z:p.z+Math.sin(theta)*r};}
 function realFootsteps(){
  const p=loc(),zombies=window.gameZombie?.zombies;if(!p||!Array.isArray(zombies))return null;
  const nearby=zombies.filter(z=>z.alive&&z.root?.visible&&z.root?.position&&Math.hypot(z.root.position.x-p.x,z.root.position.z-p.z)>7&&Math.hypot(z.root.position.x-p.x,z.root.position.z-p.z)<32);
  if(!nearby.length)return null;
  const z=nearby[Math.floor(Math.random()*nearby.length)];return {x:z.root.position.x,z:z.root.position.z};
 }
 function update(){
  const now=performance.now();lastTick=now;
  const enabled=state.enabled,active=enabled&&playable(),n=active&&atNight(),g=game();
  state.active=active;state.night=!!n;state.day=Math.max(1,Number(g?.dayNight?.day)||1);
  state.torch=!!(active&&n&&torchLit());
  if(active&&!started){started=true;state.nextCue=now+rand(5000,10000);state.quietAt=now+rand(75000,125000);}
  if(!active){started=false;state.nextCue=0;}
  if(state.ctx){
   // Quem deixa o jogo ou vai para a caverna não continua ouvindo uma floresta invisível.
   const w=active?(n?(now<state.silentUntil ? .006 : .023):.009):0;
   state.windGain.gain.setTargetAtTime(w,state.ctx.currentTime,.85);
   state.master.gain.setTargetAtTime(enabled?.52:0,state.ctx.currentTime,.23);
   if(active)listener();
  }
  if(!active||!n)return;
  // A luz é visual: manter separada do último ruído, sem acionar artificialmente um "som de tocha".
  if(state.torch)window.FlorestaAI?.light?.(g.player.x,g.player.z,25,'tocha');
  if(now>=state.quietAt){state.silentUntil=now+rand(13000,22000);state.quietAt=now+rand(88000,145000);}
  if(now<state.nextCue)return;
  state.nextCue=now+rand(state.day>=3?14000:20000,state.day>=3?25000:34000);
  if(now<state.silentUntil)return;
  let kind=Math.random()<.46?'folhas':'galho',pos=randomPosition(11,26);
  if(state.day>=3&&Math.random()<.18)kind='sussurro';
  if(Math.random()<.23){const real=realFootsteps();if(real){pos=real;kind='passos';}}
  if(pos)cue(kind,pos.x,pos.z,.8);
 }
 window.addEventListener('game:forest-tree-hit',e=>{
  const d=e.detail||{},p=loc();if(!p)return;
  const x=Number.isFinite(d.x)?d.x:p.x,z=Number.isFinite(d.z)?d.z:p.z;
  state.treeHits++;if(state.active){window.FlorestaAI?.noise?.(x,z,state.night?35:22,'corte-de-arvore');}
 });
 window.addEventListener('game:forest-tree-fallen',e=>{
  const d=e.detail||{},p=loc();if(!p)return;
  const x=Number.isFinite(d.x)?d.x:p.x,z=Number.isFinite(d.z)?d.z:p.z;
  state.treeFalls++;if(state.active){window.FlorestaAI?.noise?.(x,z,state.night?46:28,'queda-de-arvore');cue('arvore',x,z,.7);}
 });
 const interval=setInterval(update,420);
 window.addEventListener('pagehide',()=>{clearInterval(interval);if(state.ctx)state.ctx.close().catch(()=>{});},{once:true});
 window.FlorestaAtmosferaV261={
  version:'V262-audio',
  unlock,
  get enabled(){return state.enabled},setEnabled(value){state.enabled=!!value;try{localStorage.setItem(settingKey,state.enabled?'1':'0')}catch{};if(state.ctx&&!state.enabled)state.master.gain.setTargetAtTime(0,state.ctx.currentTime,.12);},
  get status(){return {night:state.night,day:state.day,active:state.active,torchSignal:state.torch,audioReady:state.ctx?.state==='running',cues:state.cues,treeHits:state.treeHits,treeFalls:state.treeFalls,lastCue:state.lastCue}},
  testSound(kind='galho'){const p=loc();return p?cue(kind,p.x-8,p.z-10):false}
 };
})();
