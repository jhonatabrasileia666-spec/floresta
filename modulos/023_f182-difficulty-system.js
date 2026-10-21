
/* Floresta V182 - difficulty & tactical memory. Offline deterministic decision engine. */
(()=>{
 if(window.gameDifficulty)return;
 const KEY='floresta-difficulty-v182';
 const presets=Object.freeze({
  easy:Object.freeze({id:'easy',label:'Fácil',tier:0,enemyDamage:.75,zombieSpeed:.86,zombieRecovery:1.55,giantSpeed:.85,giantRecovery:1.45,leadSeconds:0,reactTime:1.1}),
  normal:Object.freeze({id:'normal',label:'Normal',tier:1,enemyDamage:1,zombieSpeed:1,zombieRecovery:1,giantSpeed:1,giantRecovery:1,leadSeconds:.1,reactTime:.75}),
  hard:Object.freeze({id:'hard',label:'Hard',tier:2,enemyDamage:1.06,zombieSpeed:1.07,zombieRecovery:.78,giantSpeed:1.08,giantRecovery:.78,leadSeconds:.35,reactTime:.42}),
  hardcore:Object.freeze({id:'hardcore',label:'Hardcore',tier:3,enemyDamage:1.16,zombieSpeed:1.14,zombieRecovery:.63,giantSpeed:1.14,giantRecovery:.67,leadSeconds:.55,reactTime:.30})
 });
 let key='normal';try{const stored=localStorage.getItem(KEY);if(presets[stored])key=stored;}catch{}
 let px=0,pz=0,vx=0,vz=0,last=0,seen=false;
 const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
 function sample(ts){
  const p=window.gameReview?.player;
  if(p&&Number.isFinite(p.x)&&Number.isFinite(p.z)){
   const t=ts/1000;
   if(!seen){px=p.x;pz=p.z;last=t;seen=true;}
   else if(t-last>=.045){const dt=t-last,dx=p.x-px,dz=p.z-pz;
    // Avoid treating respawn/teleport as player movement.
    if(Math.hypot(dx,dz)<10){const mix=clamp(dt*6,.15,.6);vx=vx*(1-mix)+clamp(dx/dt,-14,14)*mix;vz=vz*(1-mix)+clamp(dz/dt,-14,14)*mix;}
    else{vx=0;vz=0;}
    px=p.x;pz=p.z;last=t;
   }
  }
  requestAnimationFrame(sample);
 }
 requestAnimationFrame(sample);
 window.gameDifficulty={
  version:'V182',presets,
  get mode(){return key},get preset(){return presets[key]},
  get playerVelocity(){return {x:vx,z:vz}},
  predict(seconds=0){const p=window.gameReview?.player;const s=clamp(Number(seconds)||0,0,1);
   return {x:(p?.x||0)+vx*s,z:(p?.z||0)+vz*s};},
  set(mode){if(!presets[mode])return false;const before=key;key=mode;try{localStorage.setItem(KEY,key)}catch{}
   if(before!==key)window.dispatchEvent(new CustomEvent('floresta:difficulty-change',{detail:{mode:key,profile:presets[key]}}));return true;}
 };
})();
