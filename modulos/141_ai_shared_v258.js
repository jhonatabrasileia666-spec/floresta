/* FLORESTA V258 — utilitários de IA: obstáculos, locomoção e percepção.
   Sem alterações no rig, materiais, controles, câmera ou saves. */
(()=>{
 'use strict';
 if(window.FlorestaAI?.version==='V258')return;
 const H=Math.hypot, PI=Math.PI;
 const state={version:'V258',lastNoise:null,lastLight:null,recentAttacks:[],playerVelocity:{x:0,z:0},lastPosition:null,stuck:new WeakMap()};
 const now=()=>performance.now();
 function nav(){return window.gameReview;}
 function clear(a,b,margin=.4){
  const g=nav();if(!g||typeof g.collides!=='function'||!a||!b)return true;
  const dx=b.x-a.x,dz=b.z-a.z,d=H(dx,dz);
  if(!Number.isFinite(d)||d<.2)return true;
  try{for(let t=Math.max(.35,margin);t<d-margin;t+=.36){
    if(g.collides(a.x+dx*t/d,a.z+dz*t/d))return false;
   }}catch(err){return false;}
  return true;
 }
 function walk(root,dx,dz,speed,dt){
  const g=nav();if(!root||!g||typeof g.groundY!=='function')return false;
  const n=H(dx,dz);if(!Number.isFinite(n)||n<.001||!Number.isFinite(speed))return false;
  const ux=dx/n,uz=dz/n,step=Math.max(0,Math.min(speed*Math.max(0,dt),.42));
  const y=root.position.y,can=(x,z)=>{
    if(g.collides?.(x,z))return false;
    const gy=g.groundY(x,z);
    return Number.isFinite(gy)&&Math.abs(gy-y)<=1.85;
  };
  function attempt(vx,vz){
   const nx=root.position.x+vx*step,nz=root.position.z+vz*step;
   if(can(nx,nz)){root.position.x=nx;root.position.z=nz;return true;}
   // Deslize pelos eixos, sem atravessar quinas de paredes.
   if(can(nx,root.position.z)){root.position.x=nx;return true;}
   if(can(root.position.x,nz)){root.position.z=nz;return true;}
   return false;
  }
  if(!step)return false;
  const entry=state.stuck.get(root)||{side:Math.random()<.5?1:-1,at:0};
  let ok=attempt(ux,uz);
  if(!ok){
   const side=entry.side;
   for(const angle of [side*.55,-side*.55,side*1.15,-side*1.15]){
    if(attempt(ux*Math.cos(angle)-uz*Math.sin(angle),uz*Math.cos(angle)+ux*Math.sin(angle))){ok=true;break;}
   }
  }
  if(!ok&&now()-entry.at>1300){entry.side*=-1;entry.at=now();}
  if(ok){const gy=g.groundY(root.position.x,root.position.z);if(Number.isFinite(gy))root.position.y=gy;}
  state.stuck.set(root,entry);return ok;
 }
 function noise(x,z,radius=20,kind='movimento'){
  if(Number.isFinite(x)&&Number.isFinite(z))state.lastNoise={x,z,radius,kind,at:now()};
 }
 // Luz é uma percepção visual independente de barulho, e não revela o jogador através de paredes.
 function light(x,z,radius=25,kind='tocha'){
  if(Number.isFinite(x)&&Number.isFinite(z))state.lastLight={x,z,radius,kind,at:now()};
 }
 function seeLight(from,range=30,age=1300){
  const l=state.lastLight;if(!l||now()-l.at>age||!from)return null;
  if(H(from.x-l.x,from.z-l.z)>Math.min(range,l.radius))return null;
  if(!clear(from,l,.3))return null;
  return {x:l.x,z:l.z,kind:l.kind};
 }
 function heard(x,z,range=30,age=4300){
  const n=state.lastNoise;if(!n||now()-n.at>age||H(x-n.x,z-n.z)>Math.min(range,n.radius))return null;
  return {x:n.x,z:n.z,kind:n.kind};
 }
 function playerLead(seconds=.35){const p=nav()?.player;if(!p)return null;
  return {x:p.x+state.playerVelocity.x*seconds,z:p.z+state.playerVelocity.z*seconds};
 }
 function recentAttack(age=1800){return state.recentAttacks.some(t=>now()-t<age);}
 function flagAttack(){state.recentAttacks.push(now());if(state.recentAttacks.length>6)state.recentAttacks.shift();const p=nav()?.player;if(p)noise(p.x,p.z,21,'arma');}
 ['game:axe-impact','game:hammer-impact','game:pickaxe-impact','game:combat-hit-confirmed'].forEach(e=>addEventListener(e,flagAttack));
 let lastTime=now();
 function sample(t){requestAnimationFrame(sample);
  const p=nav()?.player;if(!p)return;
  const dt=Math.min(.14,Math.max(.001,(t-lastTime)/1000));lastTime=t;
  const old=state.lastPosition;
  if(old){let vx=(p.x-old.x)/dt,vz=(p.z-old.z)/dt;
   if(H(vx,vz)<18){state.playerVelocity.x=state.playerVelocity.x*.7+vx*.3;state.playerVelocity.z=state.playerVelocity.z*.7+vz*.3;
    if(H(vx,vz)>3.5&&t-(state.lastNoise?.at||0)>1100)noise(p.x,p.z,Math.min(19,10+H(vx,vz)*1.1),'passos');
   }
  }
  state.lastPosition={x:p.x,z:p.z};
 }
 requestAnimationFrame(sample);
 window.FlorestaAI={version:'V258',clear,walk,noise,heard,light,seeLight,playerLead,recentAttack,diagnostic:()=>({version:'V258',lastNoise:state.lastNoise,lastLight:state.lastLight,recentAttacks:state.recentAttacks.length})};
})();
