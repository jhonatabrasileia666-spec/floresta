

(async()=>{
  if(window.__V78_LOG_SHAVING)return;
  window.__V78_LOG_SHAVING=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));

  for(let i=0;i<1000;i++){
    if(
      window.gameReview?.scene &&
      window.gameReview?.camera &&
      window.gameReview?.player &&
      window.gameLumber?.placedLogs &&
      window.gameCollectibles &&
      window.gameInventory
    )break;

    await sleep(20);
  }

  const game=window.gameReview;
  const THREE=window.__THREE_MODULE;

  if(
    !game?.scene ||
    !THREE ||
    !window.gameLumber
  )return;

  const scene=game.scene;
  const camera=game.camera;
  const player=game.player;
  const status=document.getElementById("status");

  const CFG={
    range:2.85,
    fallbackHalfAngleDeg:56,
    maxHarvestPerLog:16,
    resourceEveryHits:1,
    visibleScarsPerLog:8,
    visualChipsPerHit:11
  };

  const raycaster=
    new THREE.Raycaster();

  const camPos=
    new THREE.Vector3();

  const camDir=
    new THREE.Vector3();

  const hitLocal=
    new THREE.Vector3();

  const hitWorld=
    new THREE.Vector3();

  const qTemp=
    new THREE.Quaternion();

  const up=
    new THREE.Vector3(
      0,1,0
    );

  const localNormal=
    new THREE.Vector3();

  const worldNormal=
    new THREE.Vector3();

  const hitPointGround=
    new THREE.Vector3();

  // Shared chip geometry/material: visual splinters are pooled and do not
  // allocate new geometry/material on every axe impact.
  const flyingChipGeometry=
    new THREE.BoxGeometry(
      .038,
      .016,
      .18
    );

  const flyingChipMaterial=
    new THREE.MeshStandardMaterial({
      color:0xc69058,
      roughness:1,
      metalness:0,
      flatShading:true
    });

  const scarGeometry=
    new THREE.BoxGeometry(
      .16,
      .23,
      .018
    );

  const scarMaterial=
    new THREE.MeshStandardMaterial({
      color:0xd1a06d,
      roughness:.95,
      metalness:0,
      flatShading:true
    });

  const darkScarMaterial=
    new THREE.MeshStandardMaterial({
      color:0xaa7445,
      roughness:1,
      metalness:0,
      flatShading:true
    });

  const chipPool=[];
  const activeChips=[];

  for(let i=0;i<72;i++){
    const mesh=
      new THREE.Mesh(
        flyingChipGeometry,
        flyingChipMaterial
      );

    mesh.visible=false;
    mesh.castShadow=false;
    mesh.receiveShadow=false;

    scene.add(mesh);
    chipPool.push(mesh);
  }

  function placedLogRoot(obj){
    let cur=obj;

    while(cur){
      if(
        cur.userData
          ?.placedLog
      ){
        return cur;
      }

      cur=cur.parent;
    }

    return null;
  }

  function validPlacedLog(mesh){
    return !!(
      mesh &&
      mesh.parent &&
      mesh.visible!==false &&
      mesh.userData?.placedLog
    );
  }

  function logSegmentWorld(mesh){
    const len=
      Math.max(
        .4,
        Number(
          mesh.userData.length
        )||3
      );

    mesh.updateWorldMatrix?.(
      true,
      false
    );

    const a=
      new THREE.Vector3(
        0,
        -len*.5,
        0
      )
      .applyMatrix4(
        mesh.matrixWorld
      );

    const b=
      new THREE.Vector3(
        0,
        len*.5,
        0
      )
      .applyMatrix4(
        mesh.matrixWorld
      );

    return {a,b,len};
  }

  function closestPointSegment(
    p,a,b,
    out
  ){
    const ab=
      b.clone()
       .sub(a);

    const ab2=
      ab.lengthSq();

    let t=0;

    if(ab2>.000001){
      t=
        clamp(
          p.clone()
           .sub(a)
           .dot(ab)/
          ab2,
          0,1
        );
    }

    out.copy(a)
       .addScaledVector(
         ab,
         t
       );

    return t;
  }

  function findTarget(){
    camera.getWorldPosition(
      camPos
    );

    camera.getWorldDirection(
      camDir
    );

    raycaster.set(
      camPos,
      camDir
    );

    raycaster.near=0;
    raycaster.far=CFG.range;

    const logs=
      window.gameLumber
        ?.placedLogs
        ?.filter(
          validPlacedLog
        )||
      [];

    if(!logs.length)return null;

    const hits=
      raycaster.intersectObjects(
        logs,
        true
      );

    for(const h of hits){
      const root=
        placedLogRoot(
          h.object
        );

      if(
        !validPlacedLog(
          root
        )
      )continue;

      return {
        mesh:root,
        point:h.point.clone(),
        distance:h.distance,
        direct:true
      };
    }

    // Forgiving fallback for first-person axe swings near the edge of a log.
    const forward2=
      new THREE.Vector2(
        camDir.x,
        camDir.z
      );

    if(
      forward2.lengthSq()<.001
    ){
      forward2.set(
        -Math.sin(
          player.yaw||0
        ),
        -Math.cos(
          player.yaw||0
        )
      );
    }

    forward2.normalize();

    const playerPos=
      new THREE.Vector3(
        player.x,
        game.groundY(
          player.x,
          player.z
        )+
        .95,
        player.z
      );

    let best=null;
    let bestScore=Infinity;

    for(const mesh of logs){
      const seg=
        logSegmentWorld(
          mesh
        );

      closestPointSegment(
        playerPos,
        seg.a,
        seg.b,
        hitWorld
      );

      const dx=
        hitWorld.x-
        player.x;

      const dz=
        hitWorld.z-
        player.z;

      const horizontal=
        Math.hypot(
          dx,dz
        );

      if(
        horizontal>
        CFG.range
      )continue;

      const dot=
        (
          forward2.x*dx+
          forward2.y*dz
        )/
        Math.max(
          .001,
          horizontal
        );

      if(
        dot<
        Math.cos(
          CFG.fallbackHalfAngleDeg*
          Math.PI/
          180
        )
      )continue;

      const vertical=
        Math.abs(
          hitWorld.y-
          (
            game.groundY(
              player.x,
              player.z
            )+
            .85
          )
        );

      const score=
        horizontal+
        vertical*.16-
        dot*.35;

      if(score<bestScore){
        bestScore=score;

        best={
          mesh,
          point:hitWorld.clone(),
          distance:horizontal,
          direct:false
        };
      }
    }

    return best;
  }

  function scarAt(
    mesh,
    worldPoint,
    hitIndex
  ){
    mesh.updateWorldMatrix?.(
      true,
      false
    );

    hitLocal.copy(
      worldPoint
    );

    mesh.worldToLocal(
      hitLocal
    );

    const rad=
      Math.max(
        .08,
        Number(
          mesh.userData.radius
        )||.22
      );

    // Construction logs use local Y as their cylinder axis.
    localNormal.set(
      hitLocal.x,
      0,
      hitLocal.z
    );

    if(
      localNormal.lengthSq()<.0001
    ){
      localNormal.set(
        0,0,1
      );
    }

    localNormal.normalize();

    // Place the visual scar on the outer surface.
    const y=
      clamp(
        hitLocal.y+
        (
          (
            hitIndex%3
          )-
          1
        )*
        .035,
        -(
          Number(
            mesh.userData.length
          )||3
        )*.46,
        (
          Number(
            mesh.userData.length
          )||3
        )*.46
      );

    const scar=
      new THREE.Mesh(
        scarGeometry,
        hitIndex%3===0
          ?darkScarMaterial
          :scarMaterial
      );

    scar.name=
      "PlacedLog_ShavedScar";

    scar.castShadow=false;
    scar.receiveShadow=true;

    scar.position.set(
      localNormal.x*
      (
        rad+.007
      ),
      y,
      localNormal.z*
      (
        rad+.007
      )
    );

    // scarGeometry's thin axis is local Z.
    scar.rotation.y=
      Math.atan2(
        localNormal.x,
        localNormal.z
      );

    scar.rotation.z=
      (
        (
          hitIndex%5
        )-
        2
      )*
      .055;

    scar.scale.set(
      .80+
      Math.random()*.45,
      .75+
      Math.random()*.45,
      1
    );

    mesh.add(scar);

    mesh.userData.shavingScars=
      mesh.userData.shavingScars||
      [];

    mesh.userData
      .shavingScars
      .push(
        scar
      );

    // Keep visual detail capped so walls made of many logs remain cheap.
    while(
      mesh.userData
        .shavingScars
        .length>
      CFG.visibleScarsPerLog
    ){
      const old=
        mesh.userData
          .shavingScars
          .shift();

      old?.removeFromParent?.();
    }
  }

  function acquireChip(){
    return chipPool.pop()||null;
  }

  function releaseChip(mesh){
    if(!mesh)return;

    mesh.visible=false;
    mesh.scale.set(
      1,1,1
    );

    chipPool.push(mesh);
  }

  function spawnFlyingChips(
    mesh,
    worldPoint,
    count
  ){
    mesh.updateWorldMatrix?.(
      true,
      false
    );

    hitLocal.copy(
      worldPoint
    );

    mesh.worldToLocal(
      hitLocal
    );

    localNormal.set(
      hitLocal.x,
      0,
      hitLocal.z
    );

    if(
      localNormal.lengthSq()<.0001
    ){
      localNormal.set(
        0,0,1
      );
    }

    localNormal.normalize();

    worldNormal
      .copy(
        localNormal
      )
      .transformDirection(
        mesh.matrixWorld
      )
      .normalize();

    const actual=
      Math.min(
        count,
        chipPool.length
      );

    for(let i=0;i<actual;i++){
      const c=
        acquireChip();

      if(!c)break;

      c.visible=true;
      c.position.copy(
        worldPoint
      );

      c.position.x+=
        (
          Math.random()-.5
        )*.10;

      c.position.y+=
        (
          Math.random()-.5
        )*.08;

      c.position.z+=
        (
          Math.random()-.5
        )*.10;

      c.rotation.set(
        Math.random()*Math.PI,
        Math.random()*Math.PI,
        Math.random()*Math.PI
      );

      c.scale.set(
        .65+
        Math.random()*.85,
        .50+
        Math.random()*.55,
        .65+
        Math.random()*.90
      );

      c.userData.velocity=
        worldNormal.clone()
          .multiplyScalar(
            .8+
            Math.random()*1.25
          )
          .add(
            new THREE.Vector3(
              (
                Math.random()-.5
              )*.85,
              .75+
              Math.random()*1.15,
              (
                Math.random()-.5
              )*.85
            )
          );

      c.userData.life=
        .65+
        Math.random()*.55;

      activeChips.push(
        c
      );
    }
  }

  function dropWoodChip(
    mesh,
    worldPoint
  ){
    const ground=
      game.groundY(
        worldPoint.x,
        worldPoint.z
      );

    hitPointGround.set(
      worldPoint.x+
      (
        Math.random()-.5
      )*.45,

      ground,

      worldPoint.z+
      (
        Math.random()-.5
      )*.45
    );

    window.gameCollectibles
      ?.spawnItem?.(
        {
          id:"wood_chip",
          name:"Lasca de madeira",
          type:"Material de fogo",
          quantity:1,
          weight:.05,
          description:
            "Lasca fina retirada de um tronco com o machado. " +
            "Pega fogo rapidamente e serve como isca para iniciar fogo."
        },
        hitPointGround.x,
        hitPointGround.z
      );

    window.dispatchEvent(
      new CustomEvent(
        "game:wood-chip-harvested",
        {
          detail:{
            mesh,
            x:hitPointGround.x,
            y:hitPointGround.y,
            z:hitPointGround.z,
            total:
              mesh.userData
                .woodChipsHarvested||
              0
          }
        }
      )
    );
  }

  function consumeAxeImpact(event){
    if(
      window.gameRightHand
        ?.current!=="axe"
    )return false;

    if(
      window.gameLumber
        ?.carrying
    )return false;

    if(
      window.gameLogPlacement
        ?.placing
    )return false;

    const target=
      findTarget();

    if(!target)return false;

    const mesh=
      target.mesh;

    mesh.userData.shavingHits=
      (
        mesh.userData
          .shavingHits||
        0
      )+
      1;

    const hit=
      mesh.userData
        .shavingHits;

    scarAt(
      mesh,
      target.point,
      hit
    );

    spawnFlyingChips(
      mesh,
      target.point,
      CFG.visualChipsPerHit
    );

    const harvested=
      mesh.userData
        .woodChipsHarvested||
      0;

    const canHarvest=
      harvested<
      CFG.maxHarvestPerLog;

    if(
      canHarvest &&
      hit%
      CFG.resourceEveryHits===
      0
    ){
      mesh.userData
        .woodChipsHarvested=
          harvested+1;

      dropWoodChip(
        mesh,
        target.point
      );

      if(status){
        status.textContent=
          `Lasca retirada do tronco • ${mesh.userData.woodChipsHarvested}/${CFG.maxHarvestPerLog} • Q para pegar`;
      }
    }else if(status){
      status.textContent=
        canHarvest
          ?"Você desbastou a madeira"
          :"Esse tronco já foi bastante desbastado";
    }

    // Tiny readable hit feedback on the log itself.
    const originalScale=
      mesh.scale.clone();

    mesh.scale.multiplyScalar(
      .992
    );

    setTimeout(()=>{
      if(mesh?.parent){
        mesh.scale.copy(
          originalScale
        );
      }
    },55);

    return true;
  }

  // Use the game's existing avatar/update chain rather than creating another
  // requestAnimationFrame loop.
  const previousUpdate=
    window.__updateAnimatedAvatar;

  window.__updateAnimatedAvatar=
    function(...args){
      previousUpdate?.apply(
        this,
        args
      );

      const dt=
        Math.min(
          .05,
          Math.max(
            0,
            Number(args[2])||0
          )
        );

      for(
        let i=
          activeChips.length-1;
        i>=0;
        i--
      ){
        const c=
          activeChips[i];

        c.userData.life-=dt;

        c.userData
          .velocity
          .y-=
            3.4*
            dt;

        c.position
          .addScaledVector(
            c.userData.velocity,
            dt
          );

        c.rotation.x+=
          dt*7;

        c.rotation.y+=
          dt*4;

        c.rotation.z+=
          dt*6;

        if(
          c.userData.life<=0
        ){
          activeChips.splice(
            i,1
          );

          releaseChip(c);
        }
      }
    };

  window.gameLogShaving={
    version:"V78B",
    config:CFG,

    consumeAxeImpact,

    findTarget,

    get activeVisualChips(){
      return activeChips.length;
    },

    get totalPlacedLogs(){
      return window.gameLumber
        ?.placedLogs
        ?.length||
        0;
    },

    getLogState(mesh){
      if(!mesh)return null;

      return {
        hits:
          mesh.userData
            .shavingHits||
          0,

        harvested:
          mesh.userData
            .woodChipsHarvested||
          0,

        remaining:
          Math.max(
            0,
            CFG.maxHarvestPerLog-
            (
              mesh.userData
                .woodChipsHarvested||
              0
            )
          )
      };
    }
  };

  if(status){
    status.textContent=
      "V78 • troncos colocados podem ser desbastados com o machado";
  }
})().catch(err=>{
  console.error(
    "V78 lascas de madeira:",
    err
  );

  const status=
    document.getElementById(
      "status"
    );

  if(status){
    status.textContent=
      "Falha no sistema de lascas: "+
      String(
        err?.message||err
      );
  }
});

