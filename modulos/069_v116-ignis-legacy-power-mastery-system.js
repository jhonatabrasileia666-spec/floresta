
(async()=>{
  if(window.__V116_IGNIS_LEGACY_POWER)return;
  window.__V116_IGNIS_LEGACY_POWER=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  async function waitGame(){
    for(let i=0;i<1200;i++){
      const g=window.gameReview,b=window.gameIgnis,T=window.__THREE_MODULE;
      if(g?.scene&&g?.camera&&g?.player&&g?.groundY&&g?.trueFirstPerson?.bones&&b?.deathCore&&T&&window.gameZombie&&window.gameProgression)return {g,b,T};
      await sleep(20);
    }
    throw new Error('V116: jogo/Ignis/progressao nao ficaram prontos.');
  }

  const {g:game,b:ignis,T}=await waitGame();
  const scene=game.scene,camera=game.camera,player=game.player,tfp=game.trueFirstPerson,renderer=game.renderer;
  const legacyMobile=!!window.__FOREST_MOBILE_BUILD__||matchMedia('(pointer:coarse)').matches;
  const canvas=document.getElementById('c'),status=document.getElementById('status'),core=ignis.deathCore;
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>t*t*(3-2*t);
  const smoothSeg=(x,a,b)=>smooth(clamp((x-a)/(b-a||1),0,1));
  const tmpA=new T.Vector3(),tmpB=new T.Vector3(),tmpC=new T.Vector3();
  const tmpQ=new T.Quaternion();
  const UP=new T.Vector3(0,1,0);
  const STORE='floresta-ignis-legacy-v116';
  const PROG_STORE='floresta-progression-v52';
  const names={fireball:'Bola de Fogo',pillars:'Pilares de Fogo',stream:'Rajada de Fogo'};
  const shortNames={fireball:'Bola de Fogo',pillars:'Pilares',stream:'Rajada'};
  const baseCooldown={fireball:5,pillars:6,stream:7};

  function loadState(){
    try{
      const s=JSON.parse(localStorage.getItem(STORE)||'{}');
      const c=['fireball','pillars','stream'].includes(s.choice)?s.choice:null;
      return {picked:!!s.picked&&!!c,choice:c,rank:c?clamp(Math.floor(Number(s.rank)||1),1,5):0};
    }catch{return {picked:false,choice:null,rank:0}}
  }
  const saved=loadState();
  let picked=saved.picked,choice=saved.choice,rank=saved.rank,menuOpen=false,last=performance.now(),cooldownUntil=0,castAnim=null,pillarVariant=0;
  function saveState(){try{localStorage.setItem(STORE,JSON.stringify({picked,choice,rank}))}catch{}}

  const prompt=document.createElement('div');
  prompt.id='ignisCorePromptV111';
  prompt.innerHTML='<b>E</b> &nbsp; ABSORVER NÚCLEO DE IGNIS';
  document.body.appendChild(prompt);

  const overlay=document.createElement('div');
  overlay.id='ignisLegacyOverlayV111';
  overlay.innerHTML=`<div id="ignisLegacyPanelV111" role="dialog" aria-modal="true" aria-labelledby="ignisLegacyTitleV111">
    <h2 id="ignisLegacyTitleV111">LEGADO DE IGNIS</h2>
    <p>Escolha uma tecnica. Ela nasce no poder da Fase 1 e passa a ter uma arvore propria dentro de Habilidades. No nivel 5, a tecnica desperta para a versao de IGNIS Fase 2.</p>
    <div id="ignisLegacyChoicesV111">
      <button type="button" class="ignisLegacyChoiceV111" data-power="fireball"><strong>Bola de Fogo</strong><span>A mesma esfera de Ignis: explode no impacto e deixa fogo queimando o chao, causando dano continuo.</span><small>Fase 1 → esfera grande, fogo prolongado e divisao da Fase 2</small></button>
      <button type="button" class="ignisLegacyChoiceV111" data-power="pillars"><strong>Pilares de Fogo</strong><span>As mesmas marcas e colunas de Ignis. A arvore aumenta quantidade, raio, altura e acelera a erupcao.</span><small>Fase 1 → padroes multiplos da Fase 2</small></button>
      <button type="button" class="ignisLegacyChoiceV111" data-power="stream"><strong>Rajada de Fogo</strong><span>Canaliza a rajada de Ignis com aviso, varredura e dano continuo na linha de fogo.</span><small>Fragmento inicial → alcance e potencia completos da Fase 2</small></button>
    </div>
  </div>`;
  document.body.appendChild(overlay);

  const hud=document.createElement('div');
  hud.id='ignisPowerHudV111';
  hud.innerHTML='<span class="key">X</span><span class="name">Poder de Ignis</span><span class="cd">Disponivel</span>';
  document.body.appendChild(hud);
  const hudName=hud.querySelector('.name'),hudCd=hud.querySelector('.cd');

  const toast=document.createElement('div');toast.id='ignisLegacyMasteryToastV116';document.body.appendChild(toast);let toastTimer=0;
  function showToast(text){toast.textContent=text;toast.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('show'),1500)}
  function announce(msg){if(status)status.textContent=msg}
  function relock(){if(!canvas||!matchMedia('(pointer:fine)').matches)return;try{canvas.requestPointerLock?.({unadjustedMovement:true})?.catch?.(()=>canvas.requestPointerLock?.())}catch{try{canvas.requestPointerLock?.()}catch{}}}

  function additive(color,opacity=.9){return new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,toneMapped:false})}
  const GEO={
    sphere:new T.SphereGeometry(1,14,10),
    disc:new T.CircleGeometry(1,28).rotateX(-Math.PI/2),
    column:new T.CylinderGeometry(1,1,1,12,1,true).translate(0,.5,0),
    ring:new T.RingGeometry(.90,1,42).rotateX(-Math.PI/2),
    stream:new T.CircleGeometry(1,26,-Math.PI/2-.31,.62).rotateX(-Math.PI/2)
  };
  const MAT={orb:additive(0xff4a08,.78),core:additive(0xfff0a0,.95),expl:additive(0xff8a30,.80),ground:additive(0xff4a10,.55),warn:additive(0xff3a10,.45),column:additive(0xff7a20,.88),stream:additive(0xff3a10,.22),spark:additive(0xff9a38,.82)};
  const projectiles=[],pillars=[],groundFires=[],explosions=[],streams=[],particles=[];
  const streamHitSetScratch=new Set();
  const PARTICLE_CAP=legacyMobile?140:240;
  const particleMesh=new T.InstancedMesh(GEO.sphere,MAT.spark,PARTICLE_CAP);
  particleMesh.name='IgnisLegacy_ParticlePool';
  particleMesh.instanceMatrix.setUsage(T.DynamicDrawUsage);
  particleMesh.count=0;
  particleMesh.frustumCulled=false;
  scene.add(particleMesh);
  const particleMatrix=new T.Matrix4(),particleScale=new T.Vector3(),particleQuat=new T.Quaternion();

  function groundY(x,z){return game.groundY(x,z)}
  function playerOrigin(out=tmpA){return out.set(player.x,groundY(player.x,player.z)+1.42,player.z)}
  function handOrigin(out=tmpA){const h=tfp?.bones?.rHand;if(h){h.getWorldPosition(out);return out}return playerOrigin(out)}
  function aimDir(out=tmpB){camera.getWorldDirection(out);return out.normalize()}
  function aimAngle(){const d=aimDir(tmpC);return Math.atan2(d.x,d.z)}
  function angleDiff(a,b){return ((a-b+Math.PI)%(Math.PI*2)+Math.PI*2)%(Math.PI*2)-Math.PI}

  const enemyRootScratch=[];
  function enemyPositions(){if(window.gameSpiderCave?.active)return window.gameSpiderCave.creatures.filter(e=>!e.dead).map(e=>e.pivot);
    const arr=enemyRootScratch;arr.length=0;
    for(const z of window.gameZombie?.zombies||[])if(z?.alive&&z.root?.visible)arr.push(z.root);
    for(const e of window.gameSpecialCreatures?.all||[])if(e?.alive&&e.root?.visible&&e?.dead!==true)arr.push(e.root);
    for(const e of window.gameUndeadForces?.all||[]){const root=e?.g||e?.root;if(e?.alive!==false&&!e?.dead&&root?.visible)arr.push(root)}
    const w=window.gameWerewolf;
    if(w?.root?.visible&&w.form==='werewolf'&&w.state!=='DEATH'&&w.state!=='DEAD'&&w.state!=='DORMANT')arr.push(w.root);
    const mm=window.gameMartialBoss;
    if(mm?.active&&mm.root?.visible)arr.push(mm.root);
    return arr;
  }
  function damageRadius(x,z,r,d,label,hitSet){
    let hits=0;
    hits+=window.gameZombie?.damageRadius?.(x,z,r,d,label,hitSet)||0;
    hits+=window.gameSpecialCreatures?.damageRadius?.(x,z,r,d,label,hitSet)||0;
    hits+=window.gameUndeadForces?.damageRadius?.(x,z,r,d,label,hitSet)||0;
    hits+=window.gameWerewolf?.damageRadius?.(x,z,r,d,label,hitSet)||0;
    hits+=window.gameMartialBoss?.damageRadius?.(x,z,r,d,label,hitSet)||0;
    if(hits>0)window.dispatchEvent(new CustomEvent('game:ignis-power-hit',{detail:{label,hits,damage:d,x,z,radius:r}}));
    return hits;
  }
  function segmentEnemyHit(a,b,r=.8){
    for(const root of enemyPositions()){
      const p=root.position,abx=b.x-a.x,abz=b.z-a.z,ab2=abx*abx+abz*abz||1e-6;
      const t=clamp(((p.x-a.x)*abx+(p.z-a.z)*abz)/ab2,0,1),x=a.x+abx*t,z=a.z+abz*t,y=a.y+(b.y-a.y)*t;
      if(Math.hypot(p.x-x,p.z-z)<=r&&Math.abs((p.y||0)+1-y)<2.4)return true;
    }
    return false;
  }

  function emitParticle(pos,vel,scale=.08,life=.45){
    if(particles.length>=PARTICLE_CAP)return;
    particles.push({p:pos.clone(),v:vel.clone(),scale,age:0,life});
  }
  function burst(pos,count=24,power=5,scale=.08){
    for(let i=0;i<Math.min(40,count);i++){
      const v=new T.Vector3(Math.random()-.5,Math.random()*.85,Math.random()-.5).normalize().multiplyScalar(1+Math.random()*power);
      emitParticle(pos,v,scale*(.55+Math.random()*.75),.30+Math.random()*.42);
    }
  }
  function updateParticles(dt){
    let write=0;
    for(let i=0;i<particles.length;i++){
      const p=particles[i];p.age+=dt;
      if(p.age>=p.life)continue;
      p.p.addScaledVector(p.v,dt);p.v.y-=2.4*dt;
      const fade=Math.max(.08,1-p.age/p.life),s=p.scale*fade;
      particleScale.set(s,s,s);particleMatrix.compose(p.p,particleQuat,particleScale);
      particleMesh.setMatrixAt(write,particleMatrix);
      particles[write++]=p;
    }
    particles.length=write;
    particleMesh.count=write;
    if(write>0)particleMesh.instanceMatrix.needsUpdate=true;
  }

  function rankT(r=rank){return clamp((r-1)/4,0,1)}
  function fireCfg(r=rank){const t=rankT(r);return {speed:lerp(12,19,t),orbRadius:lerp(.55,.80,t),explosionRadius:lerp(3.2,4.6,t),damage:lerp(18,27,t),groundDuration:lerp(6,8,t),groundDamage:7,life:4,cooldown:5,big:r>=5,split:r>=5}}
  function pillarCfg(r=rank){const t=rankT(r);return {count:Math.round(lerp(7,9,t)),spacing:lerp(2.4,2.1,t),radius:lerp(1.1,1.5,t),height:lerp(4.5,6,t),telegraph:lerp(.90,.65,t),stagger:lerp(.12,.07,t),damage:22*lerp(1,1.4,t),cooldown:6,phase2:r>=5}}
  function streamCfg(r=rank){const t=rankT(r);return {telegraph:lerp(1.10,.90,t),duration:lerp(1.10,1.70,t),length:lerp(10,15,t),angleWidth:lerp(.18,.30,t),damagePerTick:lerp(4.5,7.8,t),tick:lerp(.38,.32,t),cooldown:7,phase2:r>=5}}
  function effectiveRank(power){return window.gameTestMode?.active?clamp(Math.floor(Number(window.gameTestMode?.ignisRank)||5),1,5):(power===choice?Math.max(1,rank):1)}

  const MAT_ORB_GLOW=additive(0xff5a12,.20);
  function makeOrb(radius=.55){
    const root=new T.Group();
    const glow=new T.Mesh(GEO.sphere,MAT_ORB_GLOW),outer=new T.Mesh(GEO.sphere,MAT.orb),inner=new T.Mesh(GEO.sphere,MAT.core);
    glow.scale.setScalar(radius*1.55);outer.scale.setScalar(radius);inner.scale.setScalar(radius*.52);
    root.add(glow,outer,inner);scene.add(root);return root;
  }
  function cleanupRoot(root){if(!root)return;root.traverse(o=>{if(o.material&&o.material!==MAT.orb&&o.material!==MAT.core&&o.material!==MAT_ORB_GLOW)o.material.dispose?.()});root.removeFromParent()}
  function addGroundFire(pos,cfg){
    const m=new T.Mesh(GEO.disc,MAT.ground.clone());const r=cfg.explosionRadius*.85;m.position.set(pos.x,groundY(pos.x,pos.z)+.035,pos.z);m.scale.setScalar(r);scene.add(m);groundFires.push({mesh:m,x:pos.x,z:pos.z,radius:r,t:0,duration:cfg.groundDuration,tick:0,damage:cfg.groundDamage});
  }
  function launchFireball(from,dir,cfg,opts={}){
    const radius=opts.orbRadius??cfg.orbRadius,root=makeOrb(radius);root.position.copy(from);projectiles.push({root,dir:dir.clone().normalize(),prev:from.clone(),age:0,speed:opts.speed??cfg.speed,life:opts.life??cfg.life,orbRadius:radius,explosionRadius:opts.explosionRadius??cfg.explosionRadius,damage:opts.damage??cfg.damage,groundDuration:opts.groundDuration??cfg.groundDuration,groundDamage:opts.groundDamage??cfg.groundDamage,big:!!opts.big,split:!!opts.split});
  }
  function explodeFireball(q,pos){
    const e=new T.Mesh(GEO.sphere,MAT.expl.clone());e.position.copy(pos);e.scale.setScalar(.01);scene.add(e);explosions.push({mesh:e,t:0,radius:q.explosionRadius});
    const hits=damageRadius(pos.x,pos.z,q.explosionRadius,q.damage,'Bola de Fogo do jogador');if(hits>0)announce(`Bola de Fogo atingiu ${hits} inimigo${hits>1?'s':''}`);burst(pos,q.big?38:26,8,q.big?.11:.085);
    addGroundFire(pos,q);
    if(q.split){
      for(let k=0;k<3;k++){const a=Math.random()*Math.PI*2,d=new T.Vector3(Math.sin(a),.45,Math.cos(a)).normalize();const f=fireCfg(1);launchFireball(new T.Vector3(pos.x,groundY(pos.x,pos.z)+.9,pos.z),d,f,{speed:10,orbRadius:.48,explosionRadius:3.2,damage:18,groundDuration:6,groundDamage:7,big:false,split:false})}
    }
  }
  function spawnMainFireball(r){const cfg=fireCfg(r),from=handOrigin(new T.Vector3()),dir=aimDir(new T.Vector3());launchFireball(from,dir,cfg,{big:cfg.big,split:cfg.big&&Math.random()<.50});announce(`Bola de Fogo • nivel ${r}${r>=5?' • FASE 2':''}`)}
  function spawnPhase2SideFireballs(){
    const from=handOrigin(new T.Vector3()),base=aimDir(new T.Vector3());for(const off of[-.25,.25]){const d=base.clone().applyAxisAngle(UP,off),f=fireCfg(1);launchFireball(from,d,f,{speed:17,orbRadius:.60,explosionRadius:3.2,damage:18,groundDuration:6,groundDamage:7,big:false,split:false})}
  }

  function addPillar(x,z,delay,cfg){const disc=new T.Mesh(GEO.disc,MAT.warn.clone());disc.position.set(x,groundY(x,z)+.035,z);disc.scale.setScalar(cfg.radius*.60);scene.add(disc);pillars.push({x,z,t:-delay,cfg,disc,column:null,hit:false})}
  function pillarLine(x,z,angle,count,spacing,stagger,cfg,delay=0){for(let i=0;i<count;i++)addPillar(x+Math.sin(angle)*spacing*(i+1),z+Math.cos(angle)*spacing*(i+1),delay+i*stagger,cfg)}
  function spawnPillars(r){
    const cfg=pillarCfg(r),angle=aimAngle(),x=player.x,z=player.z,variant=cfg.phase2?(pillarVariant++%4):0;
    if(variant===0)pillarLine(x,z,angle,cfg.count,cfg.spacing,cfg.stagger,cfg);
    else if(variant===1){for(const off of[-.38,0,.38])pillarLine(x,z,angle+off,Math.round(cfg.count*.8),cfg.spacing,cfg.stagger,cfg)}
    else if(variant===2){pillarLine(x,z,angle,cfg.count,cfg.spacing,cfg.stagger,cfg,0);pillarLine(x,z,angle+.20,cfg.count,cfg.spacing,cfg.stagger,cfg,.35);pillarLine(x,z,angle-.20,cfg.count,cfg.spacing,cfg.stagger,cfg,.70)}
    else{const cx=x+Math.sin(angle)*8,cz=z+Math.cos(angle)*8;for(let i=0;i<14;i++){const a=i/14*Math.PI*2;addPillar(cx+Math.sin(a)*5.5,cz+Math.cos(a)*5.5,i*.09,cfg)}for(let i=0;i<8;i++){const a=i/8*Math.PI*2;addPillar(cx+Math.sin(a)*2.6,cz+Math.cos(a)*2.6,1+i*.08,{...cfg,radius:cfg.radius*.90})}}
    announce(`Pilares de Fogo • nivel ${r}${r>=5?' • FASE 2':''}`);
  }

  function spawnStream(r){
    const cfg=streamCfg(r),mesh=new T.Mesh(GEO.stream,MAT.stream.clone()),angle=aimAngle();scene.add(mesh);streams.push({mesh,t:0,angle,sweep:Math.random()<.5?-1:1,tick:0,cfg});announce(`Rajada de Fogo • nivel ${r}${r>=5?' • FASE 2':''}`);
  }

  function updateFireballs(dt){
    for(let i=projectiles.length-1;i>=0;i--){const q=projectiles[i];q.age+=dt;q.prev.copy(q.root.position);q.root.position.addScaledVector(q.dir,q.speed*dt);q.root.rotation.y+=dt*4;const pulse=1+.12*Math.sin(q.age*30);q.root.scale.setScalar(pulse);if(Math.random()<dt*(legacyMobile?10:16))emitParticle(q.root.position,new T.Vector3(-q.dir.x*.8+(Math.random()-.5),Math.random(),-q.dir.z*.8+(Math.random()-.5)),q.orbRadius*.10,.28);
      const p=q.root.position,hit=q.age>=q.life||segmentEnemyHit(q.prev,p,q.orbRadius+.35)||game.collides?.(p.x,p.z)||p.y<=groundY(p.x,p.z)+q.orbRadius*.50;
      if(hit){const ep=p.clone();ep.y=Math.max(groundY(ep.x,ep.z)+.18,ep.y);explodeFireball(q,ep);cleanupRoot(q.root);projectiles.splice(i,1)}}
  }
  function updateExplosions(dt){for(let i=explosions.length-1;i>=0;i--){const q=explosions[i];q.t+=dt;const k=q.t/.45;q.mesh.scale.setScalar(q.radius*smooth(Math.min(1,k)));q.mesh.material.opacity=.80*(1-k);if(k>=1){q.mesh.material.dispose();q.mesh.removeFromParent();explosions.splice(i,1)}}}
  function updateGroundFires(dt){
    for(let i=groundFires.length-1;i>=0;i--){const q=groundFires[i];q.t+=dt;const fade=1-smoothSeg(q.t,q.duration-1,q.duration);q.mesh.scale.setScalar(q.radius*1.05);q.mesh.material.opacity=.58*fade;q.tick-=dt;if(Math.random()<dt*(legacyMobile?4:6))emitParticle(new T.Vector3(q.x+(Math.random()-.5)*q.radius,q.mesh.position.y+.05,q.z+(Math.random()-.5)*q.radius),new T.Vector3((Math.random()-.5)*.3,.5+Math.random()*1.2,(Math.random()-.5)*.3),.05,.45);
      if(fade>.2&&q.tick<=0){q.tick=.55;damageRadius(q.x,q.z,q.radius,q.damage,'Fogo no Chao de Ignis')}
      if(q.t>=q.duration){q.mesh.material.dispose();q.mesh.removeFromParent();groundFires.splice(i,1)}}
  }
  function updatePillars(dt){
    for(let i=pillars.length-1;i>=0;i--){const q=pillars[i];q.t+=dt;if(q.t<0)continue;const cfg=q.cfg,gy=groundY(q.x,q.z);
      if(q.t<cfg.telegraph){const k=q.t/cfg.telegraph;q.disc.scale.setScalar(cfg.radius*(.60+.50*k));q.disc.material.opacity=.22+.48*k*(.82+.18*Math.sin(q.t*30));if(Math.random()<dt*(legacyMobile?3:5))emitParticle(new T.Vector3(q.x+(Math.random()-.5)*cfg.radius,gy+.04,q.z+(Math.random()-.5)*cfg.radius),new T.Vector3(0,.7+Math.random(),0),.05,.35);continue}
      const active=q.t-cfg.telegraph;if(!q.column){q.column=new T.Mesh(GEO.column,MAT.column.clone());q.column.position.set(q.x,gy,q.z);scene.add(q.column);const hits=damageRadius(q.x,q.z,cfg.radius,cfg.damage,'Pilar de Fogo do jogador');if(hits>0)window.dispatchEvent(new CustomEvent('game:ignis-pillar-hit',{detail:{hits}}));burst(new T.Vector3(q.x,gy+.25,q.z),10,5,.08)}
      const rise=smoothSeg(active,0,.12),fade=1-smoothSeg(active,.40,.77);q.column.scale.set(cfg.radius*(1+.15*Math.sin(active*30)),cfg.height*rise*(.4+.6*fade),cfg.radius*(1+.15*Math.cos(active*30)));q.column.material.opacity=.88*fade;q.disc.scale.setScalar(cfg.radius*1.30);q.disc.material.opacity=.65*fade;
      if(active>=.77){q.disc.material.dispose();q.disc.removeFromParent();q.column.material.dispose();q.column.removeFromParent();pillars.splice(i,1)}}
  }
  function updateStreams(dt){
    for(let i=streams.length-1;i>=0;i--){const s=streams[i],cfg=s.cfg;s.t+=dt;const tele=s.t<cfg.telegraph;if(tele&&s.t<.5){const desired=aimAngle();s.angle+=angleDiff(desired,s.angle)*dt*3}const angle=s.angle+(tele?0:s.sweep*(s.t-cfg.telegraph-cfg.duration/2)*.28),gy=groundY(player.x,player.z);s.mesh.position.set(player.x,gy+.055,player.z);s.mesh.rotation.y=angle;s.mesh.scale.set(cfg.length,1,cfg.length);s.mesh.material.opacity=tele?.12+.30*(s.t/cfg.telegraph):.11;
      if(!tele){const hand=handOrigin(tmpA),streamRate=legacyMobile?26:42,count=Math.min(4,Math.floor(streamRate*dt)+(Math.random()<streamRate*dt%1?1:0));for(let n=0;n<count;n++){const a=angle+(Math.random()-.5)*.60,sp=9+Math.random()*8;emitParticle(hand,new T.Vector3(Math.sin(a)*sp,(Math.random()-.35)*2,Math.cos(a)*sp),.065,.34)}s.tick-=dt;if(s.tick<=0){s.tick=cfg.tick;const hitSet=streamHitSetScratch;hitSet.clear();const samples=Math.max(4,Math.ceil(cfg.length/3));for(let si=1;si<=samples;si++){const step=cfg.length*si/samples,x=player.x+Math.sin(angle)*step,z=player.z+Math.cos(angle)*step,r=.72+(step/cfg.length)*1.48;damageRadius(x,z,r,cfg.damagePerTick,'Rajada de Fogo do jogador',hitSet)}}}
      if(s.t>cfg.telegraph+cfg.duration){s.mesh.material.dispose();s.mesh.removeFromParent();streams.splice(i,1)}}
  }

  function castDuration(power,r){if(power==='pillars')return r>=5?1.5:2.2;if(power==='fireball')return r>=5?1.2:1.9;return 2.9}
  function startCast(power,r){castAnim={power,rank:r,t:0,duration:castDuration(power,r),main:false,side:false};if(power==='stream'){spawnStream(r);castAnim.main=true}}
  function updateCast(dt){
    if(!castAnim)return;castAnim.t+=dt;
    if(castAnim.power==='pillars'&&!castAnim.main&&castAnim.t>=.45){castAnim.main=true;spawnPillars(castAnim.rank)}
    if(castAnim.power==='fireball'&&!castAnim.main&&castAnim.t>=.62){castAnim.main=true;spawnMainFireball(castAnim.rank)}
    if(castAnim.power==='fireball'&&castAnim.rank>=5&&!castAnim.side&&castAnim.t>=.80){castAnim.side=true;spawnPhase2SideFireballs()}
    if(castAnim.t>=castAnim.duration){castAnim=null;window.__ignisLegacyCasting=false;window.gameRightHand?.sync?.()}
  }

  function addRot(b,x=0,y=0,z=0,w=1){if(!b||w<=0)return;b.rotation.x+=x*w;b.rotation.y+=y*w;b.rotation.z+=z*w}
  function applyCastPose(){
    if(!castAnim||window.gamePlayerHit?.active)return;const B=tfp.bones,u=clamp(castAnim.t/castAnim.duration,0,1),power=castAnim.power,r=castAnim.rank;window.__ignisLegacyCasting=true;
    const held=window.gameRightHand?.object;if(held)held.visible=false;
    if(window.gameMagicCastingFBX?.apply?.(castAnim,tfp)){
      tfp.visibleRoot?.updateMatrixWorld?.(true);
      tfp.shadowRoot?.updateMatrixWorld?.(true);
      return;
    }
    if(power==='pillars'){
      const up=smoothSeg(u,0,.35),slam=smoothSeg(u,.35,.52),armX=lerp(lerp(0,-2.65,up),-.90,slam);addRot(B.rArm,armX,0,0,1);addRot(B.rFore,-.20,0,0,1);if(r>=5){addRot(B.lArm,armX,0,0,1);addRot(B.lFore,-.20,0,0,1)}addRot(B.spine2,lerp(-.18*up,.35,slam),0,0,.75);
    }else if(power==='fireball'){
      const load=smoothSeg(u,0,.42),throwK=smoothSeg(u,.54,.70);addRot(B.lArm,-1.0*load);addRot(B.lFore,-1.3*load);addRot(B.rArm,lerp(-1.0*load,-1.9,throwK));addRot(B.rFore,lerp(-1.3*load,-.10,throwK));addRot(B.spine2,.25*throwK);
    }else{
      const up=smoothSeg(u,0,.20);addRot(B.lArm,-1.50*up,0,-.12*up);addRot(B.rArm,-1.50*up,0,.12*up);addRot(B.lFore,-.10*up);addRot(B.rFore,-.10*up);addRot(B.spine2,.22*up);addRot(B.head,.15*up);
    }
    tfp.visibleRoot?.updateMatrixWorld?.(true);
  }
  const prevAvatarUpdate=window.__updateAnimatedAvatar;
  window.__updateAnimatedAvatar=(...args)=>{const out=prevAvatarUpdate?.(...args);applyCastPose();return out};

  function blockedForCast(){return !!(window.gameCraft?.active||window.gameHammerCraft?.active||window.gameRoll?.active||window.gamePlayerHit?.active||window.gameLumber?.carrying||window.gameLogPlacement?.active||window.gameShield?.blocking)}
  function castPower(power,ignoreCooldown=false){
    if(!['fireball','pillars','stream'].includes(power)||menuOpen||castAnim||blockedForCast())return false;
    const now=performance.now(),r=effectiveRank(power);if(!ignoreCooldown&&now<cooldownUntil)return false;startCast(power,r);if(!ignoreCooldown)cooldownUntil=now+baseCooldown[power]*1000;return true;
  }
  function castChosen(){return choice?castPower(choice,false):false}

  function nearCore(){if(picked||!core?.visible)return false;return Math.hypot(player.x-core.position.x,player.z-core.position.z)<=2.35}
  function pickupCore(){if(!nearCore())return false;picked=true;core.visible=false;prompt.classList.remove('show');menuOpen=true;overlay.classList.add('show');try{document.exitPointerLock?.()}catch{}announce('Nucleo de Ignis absorvido • escolha um poder');window.dispatchEvent(new CustomEvent('game:ignis-core-picked'));return true}

  function choose(power){
    if(choice||!['fireball','pillars','stream'].includes(power))return false;choice=power;rank=1;picked=true;menuOpen=false;saveState();overlay.classList.remove('show');hud.classList.add('show');renderLegacyTree();updateHud(true);announce(`Legado obtido: ${names[power]} • nivel 1 • abra Habilidades para evoluir`);showToast(`${names[power]} • NIVEL 1`);relock();window.dispatchEvent(new CustomEvent('game:ignis-power-chosen',{detail:{power,name:names[power],rank}}));return true
  }
  overlay.querySelectorAll('[data-power]').forEach(btn=>btn.addEventListener('click',()=>choose(btn.dataset.power)));

  function powerDescription(power,r){
    if(power==='fireball'){const c=fireCfg(r);return r>=5?`FASE 2 • esfera ${c.orbRadius.toFixed(2)} • explosao ${c.explosionRadius.toFixed(1)} • fogo ${c.groundDuration.toFixed(0)}s • pode dividir em 3`:`Explosao ${c.explosionRadius.toFixed(1)} • fogo no chao ${c.groundDuration.toFixed(1)}s • velocidade ${c.speed.toFixed(1)}`}
    if(power==='pillars'){const c=pillarCfg(r);return r>=5?`FASE 2 • ${c.count} pilares • raio ${c.radius.toFixed(1)} • 4 padroes de ataque`:`${c.count} pilares • raio ${c.radius.toFixed(1)} • altura ${c.height.toFixed(1)} • aviso ${c.telegraph.toFixed(2)}s`}
    const c=streamCfg(r);return r>=5?`FASE 2 • alcance ${c.length.toFixed(0)} • varredura completa • dano ${c.damagePerTick.toFixed(1)}/pulso`:`Alcance ${c.length.toFixed(1)} • duracao ${c.duration.toFixed(1)}s • dano ${c.damagePerTick.toFixed(1)}/pulso`;
  }
  let branch=null,nodes=null,effect=null,titlePower=null,phaseTag=null;
  function ensureLegacyTree(){
    if(branch)return;const grid=document.querySelector('.skill-tree-grid');if(!grid)return;
    branch=document.createElement('section');branch.className='skill-branch';branch.id='ignisLegacySkillBranchV116';branch.style.display='none';branch.innerHTML=`<div class="skill-branch-title"><span class="skill-icon">🔥</span><div><strong>Legado de Ignis <span id="ignisLegacyPhaseTagV116" class="ignis-phase-tag">FASE 1</span></strong><small id="ignisLegacyTreePowerV116">Derrote Ignis e absorva o nucleo.</small></div></div><div class="skill-nodes" id="ignisLegacyNodesV116"></div><div class="skill-effect" id="ignisLegacyEffectV116"></div>`;grid.appendChild(branch);nodes=branch.querySelector('#ignisLegacyNodesV116');effect=branch.querySelector('#ignisLegacyEffectV116');titlePower=branch.querySelector('#ignisLegacyTreePowerV116');phaseTag=branch.querySelector('#ignisLegacyPhaseTagV116');
    branch.addEventListener('click',e=>{const b=e.target.closest?.('[data-ignis-rank]');if(!b)return;e.preventDefault();e.stopPropagation();upgradeLegacy(Number(b.dataset.ignisRank))},true);
  }
  function persistProgression(){try{const st=window.gameProgression?.state;if(st)localStorage.setItem(PROG_STORE,JSON.stringify(st))}catch{}}
  function upgradeLegacy(target){
    if(!choice||target!==rank+1||rank>=5)return false;const prog=window.gameProgression;if(!prog?.state||prog.state.skillPoints<1){showToast('Sem pontos de habilidade');return false}prog.state.skillPoints--;rank++;saveState();persistProgression();prog.refresh?.();renderLegacyTree();showToast(`${names[choice]} • NIVEL ${rank}${rank>=5?' • FASE 2':''}`);announce(rank>=5?`${names[choice]} despertou • PODER DE IGNIS FASE 2`:`${names[choice]} evoluiu para nivel ${rank}`);window.dispatchEvent(new CustomEvent('game:ignis-power-upgraded',{detail:{power:choice,rank,phase:rank>=5?2:1}}));return true
  }
  function renderLegacyTree(){
    ensureLegacyTree();if(!branch)return;branch.style.display=choice?'block':'none';if(!choice)return;titlePower.textContent=`${names[choice]} • nivel ${rank}/5`;phaseTag.textContent=rank>=5?'FASE 2':'FASE 1';phaseTag.classList.toggle('p2',rank>=5);nodes.innerHTML='';const points=window.gameProgression?.state?.skillPoints||0;
    for(let i=1;i<=5;i++){const b=document.createElement('button');b.type='button';b.className='skill-node';b.textContent=i;b.dataset.ignisRank=i;if(i<=rank)b.classList.add('unlocked');else if(i===rank+1&&points>0)b.classList.add('available');else b.classList.add('locked');if(i===5)b.classList.add('phase2');b.title=i<=rank?`${names[choice]} nivel ${i} desbloqueado`:i===rank+1?`Gastar 1 ponto • nivel ${i}`:`Desbloqueie o nivel ${i-1} primeiro`;nodes.appendChild(b)}effect.innerHTML=`<span class="ignis-rank-name">${rank>=5?'IGNIS FASE 2':`Nivel ${rank}`}</span> • ${powerDescription(choice,rank)}`;updateHud(true)
  }
  ensureLegacyTree();
  const observer=new MutationObserver(()=>renderLegacyTree());const pointBig=document.getElementById('skillPointBig');if(pointBig)observer.observe(pointBig,{childList:true,subtree:true,characterData:true});

  window.addEventListener('keydown',e=>{
    if(e.code==='KeyE'&&!e.repeat&&nearCore()){e.preventDefault();e.stopImmediatePropagation();pickupCore();return}
    if(e.code==='KeyX'&&!e.repeat&&choice&&!menuOpen){if(castChosen()){e.preventDefault();e.stopImmediatePropagation()}}
  },true);

  function updateHud(force=false){
    const near=nearCore();prompt.classList.toggle('show',near&&!menuOpen);if(picked&&core?.visible)core.visible=false;
    if(choice){hud.classList.add('show');hudName.textContent=`${shortNames[choice]} • Nv ${rank}${rank>=5?' • FASE 2':''}`;const rem=Math.max(0,(cooldownUntil-performance.now())/1000);hudCd.textContent=castAnim?'Conjurando…':rem>0?`Recarga ${rem.toFixed(1)} s`:`Disponivel • X para usar`}
  }

  function loop(now){requestAnimationFrame(loop);const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;updateCast(dt);updateHud();updateFireballs(dt);updateExplosions(dt);updateGroundFires(dt);updatePillars(dt);updateStreams(dt);updateParticles(dt)}
  requestAnimationFrame(loop);

  if(choice){picked=true;hud.classList.add('show');renderLegacyTree();updateHud(true)}

  function prewarmIgnisLegacyVfx(){
    try{
      if(!renderer?.compile)return;
      const s=new T.Scene(),c=camera.clone();
      const reps=[
        new T.Mesh(GEO.sphere,MAT.orb),
        new T.Mesh(GEO.sphere,MAT.core),
        new T.Mesh(GEO.sphere,MAT_ORB_GLOW),
        new T.Mesh(GEO.sphere,MAT.expl),
        new T.Mesh(GEO.disc,MAT.ground),
        new T.Mesh(GEO.disc,MAT.warn),
        new T.Mesh(GEO.column,MAT.column),
        new T.Mesh(GEO.stream,MAT.stream)
      ];
      for(const m of reps)s.add(m);
      renderer.compile(s,c);
    }catch{}
  }
  if('requestIdleCallback' in window)requestIdleCallback(prewarmIgnisLegacyVfx,{timeout:1600});else setTimeout(prewarmIgnisLegacyVfx,700);

  window.gameIgnisLegacy={
    version:'V126B-MASTERY-LIGHT-HITCH-FIX',
    get coreAvailable(){return !!core?.visible&&!picked},get picked(){return picked},get choice(){return choice},get rank(){return rank},get phase(){return rank>=5?2:1},get menuOpen(){return menuOpen},get active(){return !!castAnim},
    powers:{fireball:{phase1:fireCfg(1),phase2:fireCfg(5)},pillars:{phase1:pillarCfg(1),phase2:pillarCfg(5)},stream:{level1:streamCfg(1),phase2:streamCfg(5)}},
    pickup:pickupCore,cast:castChosen,upgrade:()=>upgradeLegacy(rank+1),
    castPower(power,options={}){return castPower(power,!!options.ignoreCooldown)},
    choose(power){return choose(power)},
    reset(){picked=false;choice=null;rank=0;menuOpen=false;cooldownUntil=0;castAnim=null;try{localStorage.removeItem(STORE)}catch{}hud.classList.remove('show');renderLegacyTree();return true},
    refresh:renderLegacyTree
  };
})();
