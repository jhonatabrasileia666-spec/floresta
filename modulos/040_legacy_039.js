

(()=>{
  const T=window.__THREE_MODULE;
  const game=window.gameReview;

  if(!T||!game?.scene||!game?.camera){
    console.warn("V55 overhead UI: Three/game unavailable");
    return;
  }

  const scene=game.scene;
  const camera=game.camera;

  const entries=new Map();
  const tmpWorld=new T.Vector3();
  const tmpCam=new T.Vector3();

  const MAX_DISTANCE=32;

  const THEMES={
    zombie:{
      name:"Zumbi",
      primary:"#6f9d58",
      secondary:"#9fc76b",
      dark:"#26351f",
      glow:"rgba(123,174,93,.32)",
      emblem:"Z"
    },
    eye:{
      name:"Olho Voador",
      primary:"#b74e70",
      secondary:"#e58bab",
      dark:"#421829",
      glow:"rgba(213,84,130,.34)",
      emblem:"◉"
    },
    nocturne:{
      name:"Nocturne",
      primary:"#7356a8",
      secondary:"#b18ad8",
      dark:"#21152f",
      glow:"rgba(127,83,181,.38)",
      emblem:"N"
    },
    orc:{
      name:"Orc Arqueiro",
      primary:"#759447",
      secondary:"#b19f53",
      dark:"#273016",
      glow:"rgba(127,151,69,.34)",
      emblem:"➶"
    },
    barrel:{
      name:"Lenhador de Barril",
      primary:"#9e6837",
      secondary:"#d7a35e",
      dark:"#3a2414",
      glow:"rgba(181,116,57,.34)",
      emblem:"⚙"
    }
  };

  function createCanvas(){
    const canvas=document.createElement("canvas");
    canvas.width=640;
    canvas.height=128;
    return canvas;
  }

  function roundedRect(ctx,x,y,w,h,r){
    r=Math.min(r,w/2,h/2);
    ctx.beginPath();
    ctx.moveTo(x+r,y);
    ctx.arcTo(x+w,y,x+w,y+h,r);
    ctx.arcTo(x+w,y+h,x,y+h,r);
    ctx.arcTo(x,y+h,x,y,r);
    ctx.arcTo(x,y,x+w,y,r);
    ctx.closePath();
  }

  function hexToRgb(hex){
    const clean=hex.replace("#","");
    const value=parseInt(clean,16);
    return {
      r:(value>>16)&255,
      g:(value>>8)&255,
      b:value&255
    };
  }

  function rgba(hex,a){
    const c=hexToRgb(hex);
    return `rgba(${c.r},${c.g},${c.b},${a})`;
  }

  function findHeadAnchor(root,type){
    if(!root)return null;

    const priority=[
      "mixamorigHead",
      "Head",
      "head",
      "HEAD",
      "Bip001 Head",
      "mixamorig:Head",
      "Eye_Body",
      "EyeBody",
      "Body"
    ];

    let exact=null;
    let loose=null;

    root.traverse?.(o=>{
      if(exact)return;

      const n=String(o.name||"");

      if(priority.includes(n)){
        exact=o;
        return;
      }

      if(
        !loose &&
        /(head|cabe[cç]a|skull)/i.test(n)
      ){
        loose=o;
      }
    });

    if(type==="eye")return root;
    return exact||loose||root;
  }


  function drawTexture(entry,hp,maxHp){
    const state=window.EnemyBars221.draw(entry.canvas,entry.name,hp,maxHp,true);
    entry.theme=state.theme;entry.ratio=state.ratio;
    entry.texture.needsUpdate=true;entry.lastHp=hp;entry.lastMax=maxHp;
  }

  function makeEntry(
    key,
    root,
    type,
    name,
    fallbackHeight,
    headGap,
    getHp,
    getMaxHp,
    isAlive
  ){
    const canvas=createCanvas();
    const ctx=canvas.getContext("2d");

    const texture=new T.CanvasTexture(canvas);
    texture.colorSpace=T.SRGBColorSpace;
    texture.minFilter=T.LinearFilter;
    texture.magFilter=T.LinearFilter;
    texture.generateMipmaps=false;

    const material=new T.SpriteMaterial({
      map:texture,
      transparent:true,
      depthTest:false,
      depthWrite:false,
      toneMapped:false
    });

    const sprite=new T.Sprite(material);
    sprite.name=`EnemyHud_${name}`;
    sprite.renderOrder=9999;
    sprite.scale.set(2.5,.5,1);
    sprite.center.set(.5,0);
    sprite.visible=false;
    scene.add(sprite);

    const entry={
      key,
      root,
      type,
      name,
      theme:THEMES[type]||THEMES.zombie,
      anchor:findHeadAnchor(root,type),
      fallbackHeight,
      headGap,
      getHp,
      getMaxHp,
      isAlive,
      canvas,
      ctx,
      texture,
      material,
      sprite,
      lastHp:Number.NaN,
      lastMax:Number.NaN,
      disposed:false
    };

    entries.set(key,entry);

    drawTexture(
      entry,
      Math.max(0,Number(getHp())||0),
      Math.max(1,Number(getMaxHp())||1)
    );

    return entry;
  }

  function removeEntry(key){
    const entry=entries.get(key);
    if(!entry)return;

    entry.sprite.removeFromParent();
    entry.material?.dispose?.();
    entry.texture?.dispose?.();
    entry.disposed=true;
    entries.delete(key);
  }

  function ensureEntry(key,opts){
    const existing=entries.get(key);

    if(
      existing &&
      existing.root===opts.root
    ){
      existing.name=opts.name;
      existing.fallbackHeight=opts.fallbackHeight;
      existing.headGap=opts.headGap;
      existing.getHp=opts.getHp;
      existing.getMaxHp=opts.getMaxHp;
      existing.isAlive=opts.isAlive;

      if(
        !existing.anchor ||
        !existing.anchor.parent
      ){
        existing.anchor=
          findHeadAnchor(existing.root,existing.type);
      }

      return existing;
    }

    if(existing)removeEntry(key);

    return makeEntry(
      key,
      opts.root,
      opts.type,
      opts.name,
      opts.fallbackHeight,
      opts.headGap,
      opts.getHp,
      opts.getMaxHp,
      opts.isAlive
    );
  }

  function registerKnownEnemies(){
    const zombies=
      window.gameZombie?.zombies ||
      [];

    for(const z of zombies){
      if(!z?.root)continue;

      ensureEntry(
        `zombie:${z.id}`,
        {
          root:z.root,
          type:"zombie",
          name:"Zumbi",
          fallbackHeight:2.36,
          headGap:.36,
          getHp:()=>z.hp,
          getMaxHp:()=>z.maxHp||100,
          isAlive:()=>!!z.alive
        }
      );
    }

    const sp=window.gameSpecialCreatures;

    for(const e of sp?.all||[]){
      if(!e?.root)continue;

      if(e.type==="eye"){
        ensureEntry(
          `special:${e.id}`,
          {
            root:e.root,
            type:"eye",
            name:"Olho Voador",
            fallbackHeight:.92,
            headGap:.48,
            getHp:()=>e.hp,
            getMaxHp:()=>e.maxHp,
            isAlive:()=>!!e.alive
          }
        );
      }else if(e.type==="nocturne"){
        ensureEntry(
          `special:${e.id}`,
          {
            root:e.root,
            type:"nocturne",
            name:"Nocturne",
            fallbackHeight:2.55,
            headGap:.38,
            getHp:()=>e.hp,
            getMaxHp:()=>e.maxHp,
            isAlive:()=>!!e.alive
          }
        );
      }else if(e.type==="orc"){
        ensureEntry(
          `special:${e.id}`,
          {
            root:e.root,
            type:"orc",
            name:"Orc Arqueiro",
            fallbackHeight:2.52,
            headGap:.38,
            getHp:()=>e.hp,
            getMaxHp:()=>e.maxHp,
            isAlive:()=>!!e.alive
          }
        );
      }
    }

    const barrel=window.gameBarrelLumberjack;

    if(barrel?.model){
      ensureEntry(
        "special:barrel",
        {
          root:barrel.model,
          type:"barrel",
          name:"Lenhador de Barril",
          fallbackHeight:2.88,
          headGap:.42,
          getHp:()=>barrel.hp,
          getMaxHp:()=>barrel.maxHp||260,
          isAlive:()=>!!barrel.alive
        }
      );
    }
  }

  function getHudWorldPosition(entry){
    // Zombies use a stable root-relative head height.
    // This avoids recursively updating the entire animated skeleton just
    // to move a 2D health-bar sprite.
    if(entry.type==="zombie"||entry.key==="v168p:demon-trolloc"){
      entry.root.updateWorldMatrix?.(
        true,
        false
      );

      entry.root.getWorldPosition(
        tmpWorld
      );

      tmpWorld.y+=
        entry.fallbackHeight;

      return tmpWorld;
    }

    const anchor=entry.anchor;

    if(
      anchor &&
      anchor.parent &&
      typeof anchor.getWorldPosition==="function"
    ){
      anchor.updateWorldMatrix?.(
        true,
        false
      );

      anchor.getWorldPosition(tmpWorld);
      tmpWorld.y+=entry.headGap;
      return tmpWorld;
    }

    entry.root.updateWorldMatrix?.(
      true,
      false
    );

    entry.root.getWorldPosition(tmpWorld);
    tmpWorld.y+=entry.fallbackHeight;
    return tmpWorld;
  }

  let lastRegister=0;
  let lastVisualUpdate=0;

  function update(now){
    requestAnimationFrame(update);

    if(now-lastRegister>700){
      lastRegister=now;
      registerKnownEnemies();
    }

    // 30 Hz is visually smooth for floating HUD labels and cuts matrix/UI
    // bookkeeping roughly in half.
    if(
      now-lastVisualUpdate<
      33
    )return;

    lastVisualUpdate=now;

    camera.getWorldPosition(tmpCam);

    for(const entry of entries.values()){
      if(entry.disposed||!entry.root)continue;

      let alive=false;

      try{
        alive=
          !!entry.isAlive() &&
          entry.root.visible!==false;
      }catch{
        alive=false;
      }

      if(!alive){
        entry.sprite.visible=false;
        continue;
      }

      getHudWorldPosition(entry);

      const dist=tmpWorld.distanceTo(tmpCam);

      if(dist>MAX_DISTANCE){
        entry.sprite.visible=false;
        continue;
      }

      entry.sprite.visible=true;
      entry.sprite.position.copy(tmpWorld);

      const mobile=document.documentElement.classList.contains('v207-mobile');
      const maxPixels=mobile?166:206;
      const width=Math.min(3.4,Math.max(.25,2*dist*Math.tan(T.MathUtils.degToRad(camera.fov/2))*maxPixels/Math.max(320,innerHeight)));
      entry.sprite.scale.set(width,width*.2,1);

      let hp=0;
      let maxHp=1;

      try{
        hp=Math.max(
          0,
          Number(entry.getHp())||0
        );

        maxHp=Math.max(
          1,
          Number(entry.getMaxHp())||1
        );
      }catch{}

      if(
        hp!==entry.lastHp ||
        maxHp!==entry.lastMax
      ){
        drawTexture(
          entry,
          hp,
          maxHp
        );
      }
    }
  }

  window.gameEnemyOverheadUI={
    version:"V221",
    entries,
    themes:THEMES,
    refresh:registerKnownEnemies,
    get count(){return entries.size;},
    hideAll(){
      for(const e of entries.values()){
        e.sprite.visible=false;
      }
    },
    // V104: same in-world health UI can be reused by integrated enemies.
    registerExternal(key,opts){return ensureEntry(key,opts);},
    removeExternal(key){return removeEntry(key);}
  };

  registerKnownEnemies();
  requestAnimationFrame(update);
})();

