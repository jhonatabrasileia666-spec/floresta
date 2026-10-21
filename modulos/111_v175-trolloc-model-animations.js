

(async()=>{
  if(window.__V168P_DEMON_TROLLOC_REAL__)return;
  window.__V168P_DEMON_TROLLOC_REAL__=true;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{t=clamp(t,0,1);return t*t*(3-2*t)};
  async function waitGame(){
    for(let i=0;i<1800;i++){
      const g=window.gameReview;
      if(g?.scene&&g?.camera&&g?.player&&g?.groundY&&window.__THREE_MODULE&&window.__FBX_MODULE?.FBXLoader&&window.gameZombie)return g;
      await wait(20);
    }
    throw new Error('Jogo/Three/FBXLoader não ficaram prontos.');
  }
  try{
    const game=await waitGame(),T=window.__THREE_MODULE,{FBXLoader}=window.__FBX_MODULE;
    const scene=game.scene,camera=game.camera,player=game.player,renderer=game.renderer;
    const CFG={maxHp:900,height:4.0,walkSpeed:2.15,runSpeed:4.05,aggro:50,attackRange:3.55,jumpMin:4.4,jumpMax:9.5,xp:450};
    const B64={"walk":"assets/stream/trolloc-walk.fbx.gz","run":"assets/stream/trolloc-run.fbx.gz","punch":"assets/stream/trolloc-punch.fbx.gz","swipe":"assets/stream/trolloc-swipe.fbx.gz","jump":"assets/stream/trolloc-jump.fbx.gz","roar":"assets/stream/trolloc-roar.fbx.gz","die":"assets/stream/trolloc-die.fbx.gz"};
    const TROLLOC_TEXTURE_URL='assets/stream/trolloc-texture.png';
    const loader=new FBXLoader();
    async function gunzip64(s){
      const reply=await fetch(s,{cache:'force-cache'});if(!reply.ok)throw new Error('Trolloc recurso '+reply.status+': '+s);const src=new Uint8Array(await reply.arrayBuffer());
      if(src[0]!==31||src[1]!==139)return src; // Servidor pode ter descomprimido .gz via Content-Encoding.
      if(typeof DecompressionStream==='undefined')throw new Error('Este navegador não suporta DecompressionStream.');
      const ds=new DecompressionStream('gzip');
      return new Uint8Array(await new Response(new Blob([src]).stream().pipeThrough(ds)).arrayBuffer());
    }
    async function loadTrollocTexture(){
      return await new Promise((resolve,reject)=>{
        const tex=new T.TextureLoader().load(TROLLOC_TEXTURE_URL,()=>{
          tex.colorSpace=T.SRGBColorSpace;
          tex.flipY=true;
          tex.wrapS=tex.wrapT=T.ClampToEdgeWrapping;
          tex.anisotropy=Math.min(4,renderer?.capabilities?.getMaxAnisotropy?.()||1);
          tex.minFilter=T.LinearMipmapLinearFilter;
          tex.magFilter=T.LinearFilter;
          tex.needsUpdate=true;
          resolve(tex);
        },undefined,reject);
      });
    }
    function applyOriginalTrollocTexture(target,tex){
      target.traverse(o=>{
        if(!o.isMesh)return;
        // The source model is an OBJ with one diffuse texture (map_Kd).
        // Use an unlit textured material so the forest lighting/PSX mode cannot turn it into a black silhouette.
        const makeMat=()=>new T.MeshBasicMaterial({
          map:tex,
          color:0xffffff,
          side:T.DoubleSide,
          transparent:false,
          opacity:1,
          depthTest:true,
          depthWrite:true,
          toneMapped:false
        });
        if(Array.isArray(o.material)) o.material=o.material.map(()=>makeMat());
        else o.material=makeMat();
        o.castShadow=false;
        o.receiveShadow=false;
        o.frustumCulled=true;
        o.material.needsUpdate=true;
      });
    }
    function stripRootMotion(clip,name){
      const tracks=clip.tracks.filter(t=>!(/(?:mixamorig:?Hips|mixamorigHips)\.position$/i.test(t.name))).map(t=>t.clone());
      return new T.AnimationClip(name,clip.duration,tracks,clip.blendMode);
    }
    function idleFrom(clip){
      const tracks=clip.tracks.filter(t=>!(/(?:mixamorig:?Hips|mixamorigHips)\.position$/i.test(t.name))).map(tr=>{
        const s=tr.getValueSize(),v=[];for(let i=0;i<s;i++)v.push(tr.values[i]);for(let i=0;i<s;i++)v.push(tr.values[i]);return new tr.constructor(tr.name,[0,1],v);
      });
      return new T.AnimationClip('Trolloc Idle',1,tracks);
    }
    function disposeParsed(obj){
      obj.traverse(o=>{if(o.isMesh){o.geometry?.dispose?.();const a=Array.isArray(o.material)?o.material:[o.material];for(const m of a){if(!m)continue;for(const k of ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','aoMap','alphaMap'])m[k]?.dispose?.();m.dispose?.();}}});
    }

    // ---- lightweight portal, cracks and hands ----
    const portal=new T.Group();portal.visible=false;scene.add(portal);
    const darkStone=new T.MeshStandardMaterial({color:0x2b2725,roughness:.96,metalness:.04,emissive:0x170604,emissiveIntensity:.2});
    const lavaMat=new T.MeshBasicMaterial({color:0xff5c18,transparent:true,opacity:.95,side:T.DoubleSide});
    const hotMat=new T.MeshBasicMaterial({color:0xffb044,transparent:true,opacity:.82,side:T.DoubleSide});
    const groundMat=new T.MeshStandardMaterial({color:0x181311,roughness:1,emissive:0x240704,emissiveIntensity:.3});
    const ground=new T.Mesh(new T.CylinderGeometry(3.1,3.25,.16,32),groundMat);ground.position.y=.02;ground.receiveShadow=true;portal.add(ground);
    const cracks=[];
    for(let i=0;i<18;i++){
      const a=i/18*Math.PI*2+(i%3)*.08,r=.65+(i%5)*.43,len=.35+(i%4)*.22;
      const m=new T.Mesh(new T.BoxGeometry(.045,.018,len),lavaMat.clone());m.position.set(Math.cos(a)*r,.12,Math.sin(a)*r);m.rotation.y=-a+.25*Math.sin(i*2.1);portal.add(m);cracks.push(m);
    }
    const frame=new T.Group();frame.position.y=1.75;portal.add(frame);
    for(let i=0;i<12;i++){
      const a=i/12*Math.PI*2,stone=new T.Mesh(new T.BoxGeometry(.62,.48,.42),darkStone);stone.position.set(Math.cos(a)*1.62,Math.sin(a)*1.62,0);stone.rotation.z=a+Math.PI/2;stone.rotation.y=.08*Math.sin(i*2.3);stone.castShadow=true;frame.add(stone);
    }
    const ring=new T.Mesh(new T.RingGeometry(1.13,1.39,48),lavaMat);frame.add(ring);
    const inner=new T.Mesh(new T.CircleGeometry(1.12,48),new T.MeshBasicMaterial({color:0x180006,transparent:true,opacity:.9,side:T.DoubleSide}));inner.position.z=-.015;frame.add(inner);
    const swirl1=new T.Mesh(new T.RingGeometry(.38,1.0,48),hotMat);swirl1.position.z=.01;frame.add(swirl1);
    const swirl2=new T.Mesh(new T.RingGeometry(.15,.78,48),new T.MeshBasicMaterial({color:0xff3a10,transparent:true,opacity:.72,side:T.DoubleSide}));swirl2.position.z=.025;frame.add(swirl2);
    const pLight=new T.PointLight(0xff511d,0,10,2);pLight.position.set(0,1.8,.7);portal.add(pLight);
    const hands=[];
    function makeHand(a,r){
      const g=new T.Group();g.position.set(Math.cos(a)*r,.08,Math.sin(a)*r);g.rotation.y=-a+Math.PI/2;
      const palm=new T.Mesh(new T.BoxGeometry(.22,.40,.15),new T.MeshStandardMaterial({color:0x160b0a,roughness:1,emissive:0x35100a,emissiveIntensity:.34}));palm.position.y=.28;g.add(palm);
      for(let i=0;i<4;i++){const f=new T.Mesh(new T.CapsuleGeometry(.025,.20,2,4),new T.MeshBasicMaterial({color:0x39100a}));f.position.set((i-1.5)*.05,.58,.02);f.rotation.z=(i-1.5)*.10;g.add(f)}
      portal.add(g);hands.push(g);
    }
    for(let i=0;i<7;i++)makeHand(i/7*Math.PI*2+.2,2.18+(i%2)*.38);

    // ---- pooled fire trail: no per-patch lights, no allocations while walking ----
    const trail=[];
    for(let i=0;i<16;i++){
      const g=new T.Group();g.visible=false;scene.add(g);
      const disc=new T.Mesh(new T.CircleGeometry(.32,10),new T.MeshBasicMaterial({color:0xff4716,transparent:true,opacity:.0,side:T.DoubleSide}));disc.rotation.x=-Math.PI/2;g.add(disc);
      const flames=[];for(let j=0;j<2;j++){const f=new T.Mesh(new T.ConeGeometry(.055,.38,5),new T.MeshBasicMaterial({color:j?0xffbf55:0xff5a19,transparent:true,opacity:0}));f.position.set((j-.5)*.13,.18,0);g.add(f);flames.push(f)}
      trail.push({g,disc,flames,life:0,max:2.9});
    }
    let trailIndex=0,lastTrailDamage=0;
    function firePatch(x,z,scale=1){const f=trail[trailIndex=(trailIndex+1)%trail.length];f.life=f.max;f.g.visible=true;f.g.position.set(x,game.groundY(x,z)+.025,z);f.g.scale.setScalar(scale);}
    function updateTrail(dt){
      const now=performance.now();
      for(const f of trail){if(f.life<=0)continue;f.life-=dt;const k=clamp(f.life/f.max,0,1);f.disc.material.opacity=.52*k;f.flames.forEach((m,j)=>{m.material.opacity=.92*k;m.scale.y=.75+.35*Math.sin(now*.012+j*2.4);});if(f.life<=0){f.g.visible=false;continue}if(now-lastTrailDamage>650&&Math.hypot(player.x-f.g.position.x,player.z-f.g.position.z)<.72*f.g.scale.x){lastTrailDamage=now;window.gameZombie?.hurtPlayer?.(6,'Rastro infernal','demon-portal-fire')}}
    }

    // ---- atmosphere: cheap overlay + fog tint, like a boss event ----
    const atm=document.createElement('div');atm.id='v168pDemonAtmosphere';atm.style.cssText='position:fixed;inset:0;z-index:8;pointer-events:none;opacity:0;transition:opacity 1s ease;background:radial-gradient(circle at 50% 48%,rgba(255,80,20,.03),rgba(80,4,5,.14) 55%,rgba(0,0,0,.36) 100%)';document.body.appendChild(atm);
    const fogColor=scene.fog?.color?.clone?.()||null;
    let atmosphereOn=false;
    function atmosphere(on){atmosphereOn=!!on;atm.style.opacity=on?'.72':'0';if(scene.fog?.color&&fogColor)scene.fog.color.copy(fogColor).lerp(new T.Color(0x3c0907),on?.68:0);}

    // ---- boss root and HUD ----
    const root=new T.Group();root.visible=false;scene.add(root);
    const modelHolder=new T.Group();root.add(modelHolder);
    const bossLight=new T.PointLight(0xff4c1b,0,6.5,2);bossLight.position.set(0,2.4,.2);root.add(bossLight);
    let hud=document.getElementById('demonTrollocHud');if(!hud){hud=document.createElement('div');hud.id='demonTrollocHud';hud.style.cssText='position:fixed;left:50%;top:54px;transform:translateX(-50%);z-index:96;width:min(460px,48vw);padding:8px 12px;border:1px solid rgba(255,119,60,.35);border-radius:13px;background:rgba(11,6,6,.76);color:#f5e6dc;font:700 12px Inter,system-ui,sans-serif;display:none;pointer-events:none;backdrop-filter:blur(7px)';hud.innerHTML='<div style="display:flex;justify-content:space-between;gap:10px"><span>DEMÔNIO — TROLLOC</span><span id="demonTHp">900 / 900</span></div><div style="height:7px;margin-top:5px;border-radius:99px;background:#ffffff19;overflow:hidden"><div id="demonTBar" style="width:100%;height:100%;background:linear-gradient(90deg,#ff9b3f,#e42816)"></div></div><div id="demonTState" style="margin-top:5px;color:#ffc38c;font-size:10px">Portal sombrio</div>';document.body.appendChild(hud)}
    const hpEl=()=>document.getElementById('demonTHp'),barEl=()=>document.getElementById('demonTBar'),stateEl=()=>document.getElementById('demonTState');

    let model=null,mixer=null,clips={},actions={},currentAction=null,currentName='',assetsReady=false,assetsLoading=null;
    let alive=false,dead=false,hp=CFG.maxHp,state='HIDDEN',attack=null,spawnPos=null,introT=0,portalT=0,portalFade=-1,attackCd=0,jumpCd=0,trailAccum=0,staggerUntil=0,lastSwing=0,lastHammer=0,lastSpear=0;
    function updateHud(){hud.style.display=alive&&root.visible?'block':'none';const p=clamp(hp/CFG.maxHp,0,1);if(hpEl())hpEl().textContent=`${Math.max(0,Math.ceil(hp))} / ${CFG.maxHp}`;if(barEl())barEl().style.width=`${p*100}%`;}
    function setState(s){if(stateEl())stateEl().textContent=s;}
    function normalizeModel(m){m.position.set(0,0,0);m.scale.setScalar(1);m.updateMatrixWorld(true);let b=new T.Box3().setFromObject(m),sz=b.getSize(new T.Vector3());if(sz.y>0){const sc=CFG.height/sz.y;m.scale.setScalar(sc);m.updateMatrixWorld(true);b=new T.Box3().setFromObject(m)}const c=b.getCenter(new T.Vector3());m.position.x-=c.x;m.position.z-=c.z;m.position.y-=b.min.y;m.updateMatrixWorld(true);}
    async function ensureAssets(){
      if(assetsReady)return true;if(assetsLoading)return assetsLoading;
      assetsLoading=(async()=>{
        setState('Carregando o Trolloc real...');
        const wb=await gunzip64(B64.walk),walkObj=loader.parse(wb.buffer,'');
        model=walkObj;model.name='Trolloc_Mixamo_REAL';normalizeModel(model);
        try{
          const originalTexture=await loadTrollocTexture();
          applyOriginalTrollocTexture(model,originalTexture);
        }catch(texErr){
          console.warn('[V168R] Textura original do Trolloc falhou; usando material embutido do FBX.',texErr);
          model.traverse(o=>{if(o.isMesh){o.castShadow=false;o.receiveShadow=false;o.frustumCulled=true;}});
        }
        modelHolder.add(model);
        const walkRaw=walkObj.animations?.[0];if(!walkRaw)throw new Error('Walking FBX sem AnimationClip.');
        clips.walk=stripRootMotion(walkRaw,'Mutant Walking');clips.idle=idleFrom(walkRaw);
        const list=[['run','run','Mutant Run'],['punch','punch','Mutant Punch'],['swipe','swipe','Mutant Swiping'],['jump','jump','Mutant Jump Attack'],['roar','roar','Mutant Roaring'],['die','die','Mutant Dying']];
        for(const [key,src,name] of list){await wait(0);const bytes=await gunzip64(B64[src]),obj=loader.parse(bytes.buffer,'');if(!obj.animations?.[0])throw new Error(name+' sem AnimationClip.');clips[key]=stripRootMotion(obj.animations[0],name);disposeParsed(obj)}
        mixer=new T.AnimationMixer(model);for(const [k,c] of Object.entries(clips))actions[k]=mixer.clipAction(c);assetsReady=true;return true;
      })().catch(e=>{assetsLoading=null;throw e});
      return assetsLoading;
    }
    function play(name,loop=true,speed=1,fade=.12){if(!assetsReady||!actions[name])return null;if(currentName===name&&currentAction?.isRunning?.())return currentAction;const a=actions[name];if(currentAction&&currentAction!==a)currentAction.fadeOut(fade);a.reset();a.enabled=true;a.paused=false;a.timeScale=speed;a.clampWhenFinished=!loop;a.setLoop(loop?T.LoopRepeat:T.LoopOnce,loop?Infinity:1);a.fadeIn(fade).play();currentAction=a;currentName=name;return a;}
    function portalPlace(p){portal.position.set(p.x,p.y,p.z);const yaw=Math.atan2(player.x-p.x,player.z-p.z);portal.rotation.y=yaw;portal.scale.setScalar(.08);portal.visible=true;portalT=0;portalFade=-1;pLight.intensity=0;}
    function startSpawn(){const dir=new T.Vector3();camera.getWorldDirection(dir);dir.y=0;if(dir.lengthSq()<.001)dir.set(0,0,1);dir.normalize();let p=null;for(const d of [34,42,28,50]){const x=player.x+dir.x*d,z=player.z+dir.z*d;if(!game.collides?.(x,z)){p={x,z,y:game.groundY(x,z)};break}}p=p||{x:player.x+dir.x*38,z:player.z+dir.z*38,y:game.groundY(player.x+dir.x*38,player.z+dir.z*38)};alive=true;dead=false;hp=CFG.maxHp;state='LOADING';attack=null;spawnPos=p;root.visible=false;portalPlace(p);atmosphere(true);updateHud();hud.style.display='block';setState('Portal de magia negra aberto');ensureAssets().then(()=>beginEntrance()).catch(e=>{console.error('[V168R demon load]',e);setState('Falha ao carregar Trolloc — portal mantido');root.visible=false;hud.style.display='block';portal.visible=true;});}
    function beginEntrance(){if(!alive||!spawnPos)return;const dx=player.x-spawnPos.x,dz=player.z-spawnPos.z,L=Math.max(.001,Math.hypot(dx,dz)),fx=dx/L,fz=dz/L;root.position.set(spawnPos.x-fx*1.4,spawnPos.y,spawnPos.z-fz*1.4);root.rotation.y=Math.atan2(dx,dz);root.visible=true;introT=0;state='INTRO_WALK';play('walk',true,1);setState('O Trolloc está saindo do portal...');bossLight.intensity=1.5;updateHud();}
    function facePlayer(dt=.016){const dx=player.x-root.position.x,dz=player.z-root.position.z,target=Math.atan2(dx,dz);let dif=((target-root.rotation.y+Math.PI)%(Math.PI*2))-Math.PI;root.rotation.y+=dif*clamp(dt*7.5,0,1);}
    function dist(){return Math.hypot(player.x-root.position.x,player.z-root.position.z)}
    function postureBreak(ms=3000){if(!alive||dead)return false;staggerUntil=performance.now()+ms;attack=null;state='STAGGER';if(currentAction)currentAction.paused=true;setState('POSTURA QUEBRADA');return true;}
    function hurt(amount,label='hit'){if(!alive||dead)return 0;const mult=window.gameParry?.damageMultiplierFor?.('demon-portal')??1;amount=Math.max(0,Number(amount)||0)*mult;hp=Math.max(0,hp-amount);updateHud();bossLight.intensity=2.6;if(hp<=0)die();return amount;}
    function die(){if(dead)return;dead=true;attack=null;state='DEAD';play('die',false,1,.12);setState('TROLLOC DERROTADO');const d=clips.die?.duration||3;setTimeout(()=>{root.visible=false;alive=false;hud.style.display='none';atmosphere(false);portal.visible=true;for(const f of trail){f.life=0;f.g.visible=false}window.gameProgression?.dropXP?.(CFG.xp,root.position.clone(),'Demônio Trolloc')},Math.max(2200,d*1000+220));}
    function startAttack(kind){
      const clipDur=clips[kind]?.duration||1;
      const speed=kind==='jump'?2.05:1;
      // Jump movement is intentionally short/fast; the long tail of the FBX must not make the boss float.
      const dur=kind==='jump'?Math.min(.92,Math.max(.72,clipDur/speed)):clipDur;
      attack={kind,t:0,hit:false,dur,clipDur,speed};state='ATTACK';
      play(kind,false,speed,kind==='jump'?.055:.08);
      setState(kind==='jump'?'ATAQUE COM SALTO':kind==='punch'?'SOCO DO TROLLOC':'GOLPE DE GARRAS');
      if(kind==='jump'){
        attack.sx=root.position.x;attack.sz=root.position.z;attack.sy=game.groundY(root.position.x,root.position.z);
        const dx=player.x-root.position.x,dz=player.z-root.position.z,L=Math.max(.001,Math.hypot(dx,dz));
        const travel=Math.min(7.0,Math.max(2.8,L-.65));
        attack.tx=root.position.x+dx/L*travel;attack.tz=root.position.z+dz/L*travel;
      }
    }
    function hitPlayer(kind){const d=dist();if(kind==='jump'){firePatch(root.position.x,root.position.z,1.65);if(d<4.1)window.gameZombie?.hurtPlayer?.(38,'Trolloc — ataque com salto','demon-portal')}else if(kind==='punch'){if(d<3.75)window.gameZombie?.hurtPlayer?.(28,'Trolloc — soco','demon-portal')}else if(kind==='swipe'){if(d<3.95)window.gameZombie?.hurtPlayer?.(31,'Trolloc — golpe de garras','demon-portal')}}
    function spawnTrail(step){trailAccum+=step;if(trailAccum>.68){trailAccum=0;firePatch(root.position.x,root.position.z,1)}}
    function updatePortal(dt){
      if(!portal.visible)return;
      portalT+=dt;
      const open=smooth(clamp(portalT/1.05,0,1));
      // The portal is permanent after opening. It remains as a landmark in the forest.
      portal.scale.setScalar(.08+.92*open);
      pLight.intensity=1.65*open;
      swirl1.rotation.z+=dt*.82;
      swirl2.rotation.z-=dt*1.02;
      inner.material.opacity=.68+.08*Math.sin(performance.now()*.006);
      // Animate the anguished hands more slowly to reduce per-frame work and visual noise.
      const handPhase=performance.now()*.0024;
      hands.forEach((h,i)=>{h.position.y=.08+.12*Math.sin(handPhase+i);h.rotation.z=.09*Math.sin(handPhase*1.2+i*1.7)});
    }
    function updateAI(dt){
      if(!alive||dead)return;bossLight.intensity=lerp(bossLight.intensity,.75,dt*2.2);
      if(state==='LOADING')return;
      if(performance.now()<staggerUntil){root.position.y=game.groundY(root.position.x,root.position.z);return}else if(state==='STAGGER'){if(currentAction)currentAction.paused=false;state='IDLE';play('idle',true);}
      if(state==='INTRO_WALK'){introT+=dt;const dx=player.x-spawnPos.x,dz=player.z-spawnPos.z,L=Math.max(.001,Math.hypot(dx,dz)),fx=dx/L,fz=dz/L,u=smooth(clamp(introT/2.7,0,1));root.position.x=spawnPos.x+fx*lerp(-1.4,2.1,u);root.position.z=spawnPos.z+fz*lerp(-1.4,2.1,u);root.position.y=game.groundY(root.position.x,root.position.z);if(introT>=2.7){state='INTRO_ROAR';introT=0;play('roar',false);setState('O Trolloc atravessou o portal');}return}
      if(state==='INTRO_ROAR'){introT+=dt;root.position.y=game.groundY(root.position.x,root.position.z);facePlayer(dt);if(introT>=(clips.roar?.duration||2)){state='IDLE';play('idle',true);attackCd=.7;jumpCd=2.4;setState('DEMÔNIO TROLLOC');}return}
      attackCd-=dt;jumpCd-=dt;
      if(attack){
        attack.t+=dt;facePlayer(dt);const u=clamp(attack.t/attack.dur,0,1);
        if(attack.kind==='jump'){
          // Fast takeoff, readable apex, quick landing. Smoothstep avoids snapping without slow floating.
          const s=smooth(u);root.position.x=lerp(attack.sx,attack.tx,s);root.position.z=lerp(attack.sz,attack.tz,s);
          const gy=game.groundY(root.position.x,root.position.z);
          root.position.y=gy+Math.sin(Math.PI*u)*1.35;
        }else root.position.y=game.groundY(root.position.x,root.position.z);
        const hitAt=attack.kind==='jump'?.58:.52;
        if(!attack.hit&&u>=hitAt){attack.hit=true;hitPlayer(attack.kind)}
        if(u>=.98){
          if(attack.kind==='jump'){root.position.y=game.groundY(root.position.x,root.position.z);jumpCd=3.6}
          attack=null;state='IDLE';attackCd=.52;play('idle',true,1,.07);setState('DEMÔNIO TROLLOC');
        }
        return
      }
      root.position.y=game.groundY(root.position.x,root.position.z);const d=dist();if(d>CFG.aggro){state='IDLE';play('idle',true);return}facePlayer(dt);
      if(jumpCd<=0&&d>=CFG.jumpMin&&d<=CFG.jumpMax&&Math.random()<dt*.7){startAttack('jump');return}
      if(d>CFG.attackRange){const run=d>9;state=run?'RUN':'WALK';play(run?'run':'walk',true,run?1.08:1);const sp=run?CFG.runSpeed:CFG.walkSpeed,dx=player.x-root.position.x,dz=player.z-root.position.z,L=Math.max(.001,Math.hypot(dx,dz)),step=Math.min(sp*dt,Math.max(0,d-CFG.attackRange+.25)),nx=root.position.x+dx/L*step,nz=root.position.z+dz/L*step;if(!game.collides?.(nx,nz)){root.position.x=nx;root.position.z=nz;spawnTrail(step)}setState(run?'CORRENDO — RASTRO DE FOGO':'CAMINHANDO — RASTRO DE FOGO');return}
      state='IDLE';play('idle',true);if(attackCd<=0)startAttack(Math.random()<.5?'punch':'swipe');
    }
    const clock=new T.Clock();function loop(){requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;const dt=Math.min(.045,clock.getDelta());mixer?.update(dt);updateAI(dt);updatePortal(dt);updateTrail(dt)}requestAnimationFrame(loop);if(window.gameSpiderCave?.active)return;

    // real weapon damage
    function facing(range=4.8,deg=90){if(!alive||dead||!root.visible)return false;const dx=root.position.x-player.x,dz=root.position.z-player.z,d=Math.hypot(dx,dz);if(d>range)return false;const v=new T.Vector3();camera.getWorldDirection(v);v.y=0;v.normalize();return(v.x*dx+v.z*dz)/Math.max(.001,d)>=Math.cos(deg*Math.PI/180)}
    window.addEventListener('game:axe-impact',e=>{const s=e.detail?.swingId??performance.now();if(s===lastSwing||!facing(4.6,90))return;lastSwing=s;hurt(window.gameProgression?.modifyAxeDamage?.(38)??38,'axe')});
    window.addEventListener('game:hammer-impact',e=>{const s=e.detail?.swingId??performance.now();if(s===lastHammer)return;let ok=false,p=e.detail?.position;if(p&&Number.isFinite(p.x))ok=Math.hypot(p.x-root.position.x,p.z-root.position.z)<2.4;else ok=facing(5,92);if(!ok)return;lastHammer=s;hurt(60,'hammer')});
    if(window.gameAttack&&!window.gameAttack.__v168pDemonSpear){const prev=window.gameAttack.attack.bind(window.gameAttack);window.gameAttack.attack=function(){const spear=window.gameRightHand?.current==='spear';const r=prev();if(spear){const stamp=performance.now();setTimeout(()=>{if(stamp!==lastSpear&&facing(5.2,92)){lastSpear=stamp;hurt(34,'spear')}},120)}return r};window.gameAttack.__v168pDemonSpear=true;}

    // director / debug spawn
    function patchDirector(){const sel=document.getElementById('directorCreature');if(sel&&!sel.querySelector('option[value="demon"]')){const o=document.createElement('option');o.value='demon';o.textContent='Demônio Trolloc — Evento';sel.appendChild(o)}const quick=document.querySelector('#directorOverlay .director-quick');if(quick&&!quick.querySelector('[data-demon-trolloc]')){const b=document.createElement('button');b.type='button';b.dataset.demonTrolloc='1';b.textContent='Forçar Demônio Trolloc';b.addEventListener('click',()=>spawnNow());quick.appendChild(b)}const sb=document.getElementById('directorSpawn');if(sb&&!sb.__v168pDemon){sb.addEventListener('click',e=>{if(document.getElementById('directorCreature')?.value==='demon'){e.preventDefault();e.stopImmediatePropagation();spawnNow();const m=document.getElementById('directorMessage');if(m)m.textContent='Portal do Trolloc invocado.'}},true);sb.__v168pDemon=true}if(window.gameDirector&&!window.gameDirector.spawnDemon){window.gameDirector.spawnDemon=()=>spawnNow()?1:0}}
    setInterval(patchDirector,1000);patchDirector();
    function spawnNow(){if(alive&&!dead)return false;startSpawn();return true}
    function reset(){alive=false;dead=false;attack=null;state='HIDDEN';root.visible=false;portal.visible=false;hud.style.display='none';atmosphere(false);if(currentAction)currentAction.stop();for(const f of trail){f.life=0;f.g.visible=false}return true}
    const api={version:'V168R-PC',root,portal,spawnNow,spawn:spawnNow,reset,damage:hurt,postureBreak,get active(){return alive&&root.visible&&!dead},get spawning(){return alive&&!dead},get hp(){return hp},get maxHp(){return CFG.maxHp},damageRadius(x,z,radius,baseDamage,label='Dano em área',hitSet=null){if(!alive||dead||!root.visible)return 0;const set=hitSet||new Set();if(set.has(api))return 0;const d=Math.hypot(root.position.x-x,root.position.z-z);if(d>radius+1.1)return 0;set.add(api);hurt(Math.max(0,baseDamage)*Math.max(.55,1-.4*d/Math.max(.001,radius)),label);return 1;}};
    window.gameDemonBoss=api;window.gameTrolloc=api;
    window.gameEnemyOverheadUI?.registerExternal?.('v168p:demon-trolloc',{root,type:'nocturne',name:'Demônio Trolloc',fallbackHeight:4.65,headGap:.3,getHp:()=>hp,getMaxHp:()=>CFG.maxHp,isAlive:()=>alive&&root.visible&&!dead});
    console.info('[V168R] Trolloc real: spawn corrigido + textura robusta + salto rápido + portal permanente.');
  }catch(err){console.error('[V168P Demon Trolloc]',err);const s=document.getElementById('status');if(s)s.textContent+=' • Trolloc indisponível: '+String(err?.message||err)}
})();

