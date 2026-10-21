
(function(){
  const T=window.__THREE_MODULE;
  const Z=window.ZOMBIES;
  if(!T||!Z?.Asset||!Z?.clipsGzip){
    console.error('[V100] Runtime exato dos zumbis não foi carregado.');
    return;
  }

  const VARIANTS=['female','heavy','thin','twisted'];
  const STATE_TO_CLIP={
    hidden:'Idle', idle:'Idle', walk:'Walk', attack:'Attack', hit:'Hit',
    crawl:'Crawl', standup:'StandUp', dead:'Death'
  };
  let ready=false,loading=null,last=performance.now();

  async function ensureClips(){
    if(ready&&Z.clips)return true;
    if(loading)return loading;
    loading=(async()=>{
      try{
        if(!Z.clips){
          const bin=Uint8Array.from(atob(Z.clipsGzip),c=>c.charCodeAt(0));
          const stream=new Blob([bin]).stream().pipeThrough(new DecompressionStream('gzip'));
          Z.clips=JSON.parse(await new Response(stream).text());
        }
        ready=!!Z.clips;
        console.info('[V100 ZUMBIS] visuais do arquivo enviado carregados',Object.keys(Z.clips||{}));
        return ready;
      }catch(err){
        console.error('[V100 ZUMBIS] falha ao carregar animações',err);
        return false;
      }
    })();
    return loading;
  }

  function variantFor(z){
    return VARIANTS[Math.abs((Number(z?.id)||1)-1)%VARIANTS.length];
  }

  function hideOldVisual(z){
    if(!z)return;
    try{
      if(z.model)z.model.visible=false;
      for(const m of z.meshes||[])if(m)m.visible=false;
      if(z._v99Visual){
        try{z._v99Visual.dispose?.();}catch(_){}
        z._v99Visual=null;
      }
    }catch(_){}
  }

  function attach(z){
    if(!z||z._v100Visual||!z.root)return false;
    hideOldVisual(z);
    const id=variantFor(z);
    let asset;
    try{asset=Z.create(id);}catch(err){
      console.error('[V100 ZUMBIS] falha criando',id,err);
      return false;
    }
    asset.autoRootMotion=false;
    asset.suppressAutoReturn=true;
    asset.group.name=`ZombieV100_${id}_${z.id||'x'}`;
    asset.group.position.set(0,0,0);
    // O asset enviado foi modelado olhando para o eixo oposto ao forward da IA.
    // A IA do jogo usa +Z como frente; giramos APENAS o visual em 180 graus,
    // sem alterar perseguição, colisão, hitbox, alcance ou direção dos golpes.
    asset.group.rotation.set(0,Math.PI,0);
    asset.group.scale.setScalar(1);
    asset.group.traverse(o=>{
      if(o.isMesh){
        o.visible=true;
        o.castShadow=true;
        o.receiveShadow=true;
        // V104: engine-native frustum culling only; animation cadence remains every render frame.
        o.frustumCulled=true;
      }
    });
    z.root.add(asset.group);
    z._v100Visual=asset;
    z._v100Variant=id;
    z._v100State='';
    z._v100AnimAccum=0;
    z._v100DeathPlayed=false;
    return true;
  }

  function desired(z){
    if(z?.alive)return STATE_TO_CLIP[z.state]||'Idle';
    if(z?.state==='dead'||Number(z?.hp)<=0)return'Death';
    return'Idle';
  }

  function sync(z){
    const a=z?._v100Visual;if(!a)return;
    const clip=desired(z);
    if(clip==='Death'){
      if(!z._v100DeathPlayed){
        a.play('Death',.08);
        z._v100DeathPlayed=true;
        z._v100State='Death';
      }
      return;
    }
    if(clip!==z._v100State){
      a.play(clip,.10);
      z._v100State=clip;
      z._v100DeathPlayed=false;
    }
  }

  async function start(){
    if(!await ensureClips())return;
    function tick(now){
      const dt=Math.min(.05,Math.max(0,(now-last)/1000));last=now;
      const list=window.gameZombie?.zombies||[];
      for(const z of list){
        // Important: the old FBX mannequin must NEVER come back on respawn.
        hideOldVisual(z);
        if((z.alive||z.root?.visible)&&!z._v100Visual)attach(z);
        const a=z._v100Visual;if(!a)continue;
        a.group.visible=!!z.root?.visible;
        sync(z);
        if(!z.root?.visible)continue;
        // V103: não reduzir, pular ou reamostrar animações.
        // O asset original é atualizado em TODO frame renderizado, inclusive em 120/144 Hz.
        a.update(dt);
      }
      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }
  start();
  window.gameZombieVisualV100={version:'V168F-ATTACK-RECOVERY',variants:VARIANTS,get ready(){return ready}};
})();
