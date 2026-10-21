/* FLORESTA V257 — varredura de espada; apenas dano validado na animação.
   Mantém os FBX, câmera POV, parry e demais armas. */
(()=>{'use strict';if(window.gameCombatV257)return;
 const CFG={range:3.4,arcCos:.26,hitstopMs:43,baseSwordDamage:39};
 const T=()=>window.__THREE_MODULE,G=()=>window.gameReview;
 let context=null,confirmed=0,missed=0,blocked=0,lastHit=null;
 const vec=(x=0,y=0,z=0)=>new (T().Vector3)(x,y,z);
 function capsuleDistance(a,b,p){const d=b.clone().sub(a),q=d.lengthSq();if(q<1e-6)return a.distanceTo(p);return p.distanceTo(a.clone().addScaledVector(d,Math.max(0,Math.min(1,p.clone().sub(a).dot(d)/q))));}
 function sound(kind){try{const Audio=window.AudioContext||window.webkitAudioContext;if(!Audio)return;const ctx=context||(context=new Audio());if(ctx.state==='suspended'){ctx.resume().catch(()=>{});return;}const t=ctx.currentTime,o=ctx.createOscillator(),g=ctx.createGain(),f=ctx.createBiquadFilter();const n=kind==='armor'?500:kind==='bone'?230:95,length=kind==='armor'?.10:.065;o.type=kind==='armor'?'triangle':'sawtooth';f.type='lowpass';f.frequency.value=kind==='armor'?2400:700;o.frequency.setValueAtTime(n,t);o.frequency.exponentialRampToValueAtTime(n*.4,t+length);g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.052,t+.004);g.gain.exponentialRampToValueAtTime(.0001,t+length);o.connect(f);f.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+length+.005);o.onended=()=>{o.disconnect();f.disconnect();g.disconnect()}}catch(e){}}
 function blade(){const g=G();if(!g?.camera||!g?.player||!T())return null;const f=vec(0,0,-1);g.camera.getWorldDirection(f);f.y=0;if(f.lengthSq()<1e-6)return null;f.normalize();const right=vec(-f.z,0,f.x),p=g.player,ground=Number(g.groundY?.(p.x,p.z))||0,origin=vec(p.x,ground,p.z);const height=Math.max(.85,Math.min(2.15,g.camera.position.y-ground-.27));let lateral=0,vertical=0;const h=window.gameRightHand?.object;
  if(h?.getWorldPosition){try{h.updateWorldMatrix(true,false);const hand=h.getWorldPosition(vec());if(hand.distanceTo(origin)<3.7){const rel=hand.sub(origin);lateral=Math.max(-.52,Math.min(.52,rel.dot(right)));vertical=Math.max(-.35,Math.min(.35,rel.y-height))}}catch(e){}}
  const base=origin.clone().add(vec(0,height,0));return {origin,f,from:base.clone().addScaledVector(f,.60).addScaledVector(right,lateral*.52),tip:base.clone().addScaledVector(f,2.75).addScaledVector(right,lateral).add(vec(0,vertical*.55-.19,0))};}
 function clearSight(point,origin,targetRadius=.65){const g=G(),dx=point.x-origin.x,dz=point.z-origin.z,len=Math.hypot(dx,dz);if(len<1.25)return true;const cave=window.gameSpiderCave?.active?window.gameSpiderCave:null,fn=cave?.blocked?((x,z)=>cave.blocked(x,z,.12)):(typeof g?.collides==='function'?(x,z)=>g.collides(x,z):null);if(!fn)return true;try{for(let n=.65;n<len-Math.max(.65,targetRadius+.10);n+=.30)if(fn(origin.x+dx*n/len,origin.z+dz*n/len))return false;}catch(e){}return true;}
 function add(out,entries,kind,id){if(!Array.isArray(entries))return;for(const e of entries){if(!e?.root?.position||typeof e.hit!=='function')continue;out.push({position:e.root.position,radius:Number(e.radius)||.65,height:e.height===0?0:Number(e.height)||1.1,hit:e.hit,kind,id});}}
 function targets(){const out=[];if(window.gameSpiderCave?.active){add(out,window.gameSpiderCave.targets?.(),'bone','cave');return out;}
  add(out,window.gameZombie?.combatTargets?.(),'flesh','zombies');add(out,window.gameSpecialCreatures?.combatTargets?.(),'flesh','special');add(out,window.gameUndeadForces?.combatTargets?.(),'bone','undead');
  const martial=window.gameMartialBoss;if(martial?.active&&martial.root?.visible)out.push({position:martial.root.position,height:1.35,radius:1.05,kind:'armor',id:'mestre',hit:d=>martial.damage?.(d,'sword')});
  const trolloc=window.gameTrolloc;if(trolloc?.active&&trolloc.root?.visible)out.push({position:trolloc.root.position,height:1.65,radius:1.2,kind:'armor',id:'trolloc',hit:d=>trolloc.damage?.(d,'sword')});
  const wolf=window.gameWerewolf;if(wolf?.root?.visible&&wolf.form==='werewolf'&&!['DORMANT','DEATH','DEAD'].includes(wolf.state))out.push({position:wolf.root.position,height:1.65,radius:1.05,kind:'flesh',id:'lobisomem',hit:d=>wolf.damageSword?.(d)});
  const giant=window.gameGiantBoss;if(giant?.scheduled&&giant.root?.visible)add(out,giant.swordTargets?.(),'flesh','giant');return out;}
 function probeSword(s){if(s?.hit||!G()?.player)return false;const B=blade();if(!B)return false;const {from,tip,origin,f}=B;let chosen=null,at=null,score=Infinity;
  for(const target of targets()){const p=target.position;if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))continue;const distance=Math.hypot(p.x-origin.x,p.z-origin.z),radius=target.radius;if(distance>CFG.range+radius||distance<.15)continue;
   const facing=((p.x-origin.x)*f.x+(p.z-origin.z)*f.z)/Math.max(.001,distance);if(facing<CFG.arcCos)continue;
   const center=vec(p.x,(p.y||0)+target.height,p.z),d=Math.min(capsuleDistance(from,tip,center),s.previousBlade?.tip?capsuleDistance(s.previousBlade.tip,tip,center):Infinity);
   if(d>radius+.40)continue;if(!clearSight(p,origin,radius)){blocked++;continue;}if(d+distance*.025<score){score=d+distance*.025;chosen=target;at=center;}}
  s.previousBlade={tip:tip.clone()};if(!chosen)return false;
  const damage=window.gameProgression?.modifySwordDamage?.(CFG.baseSwordDamage)??CFG.baseSwordDamage;
  let ok=false;try{ok=chosen.hit(damage,{weapon:'sword',swingId:s.swingId})!==false;}catch(err){console.warn('[V257] falha no alvo',err);return false;}if(!ok)return false;
  confirmed++;lastHit={target:chosen.id,damage,swingId:s.swingId,at:performance.now()};s.freezeMs=CFG.hitstopMs;sound(chosen.kind);
  dispatchEvent(new CustomEvent('game:combat-hit-confirmed',{detail:{weapon:'sword',swingId:s.swingId,target:chosen.id,damage,targetType:chosen.kind,position:{x:at.x,y:at.y,z:at.z}}}));return true;}
 window.gameCombatV257={version:'V257',config:CFG,probeSword,get stats(){return {confirmed,missed,blocked,lastHit}},miss(){missed++}};
 console.info('[FLORESTA V257] acertos exclusivos de espada preparados');
})();
