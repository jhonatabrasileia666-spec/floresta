

(async()=>{
  if(window.__IGNIS_V73_INSTALLED)return;
  window.__IGNIS_V73_INSTALLED=true;

  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const lerp=(a,b,t)=>a+(b-a)*t;
  const smooth=t=>{
    t=clamp(t,0,1);
    return t*t*(3-2*t);
  };
  const angleDiff=(a,b)=>{
    let d=a-b;
    while(d>Math.PI)d-=Math.PI*2;
    while(d<-Math.PI)d+=Math.PI*2;
    return d;
  };

  async function waitGame(){
    for(let i=0;i<1200;i++){
      const g=window.gameReview;

      if(
        g?.scene &&
        g?.camera &&
        g?.renderer &&
        g?.player &&
        g?.groundY &&
        g?.trueFirstPerson?.visibleRoot &&
        typeof window.__updateAnimatedAvatar==="function"
      ){
        return g;
      }

      await sleep(20);
    }

    throw new Error(
      "O jogo real / rig do jogador não ficou disponível."
    );
  }

  const game=await waitGame();
  const THREE=window.__THREE_MODULE;

  if(!THREE){
    throw new Error(
      "Three.js real do jogo não está disponível."
    );
  }

  // ------------------------------------------------------------
  // First safe integration only.
  // No attacks, no boss damage, no transition and no death yet.
  // ------------------------------------------------------------
  const CFG=Object.assign({
    spawnX:-16,
    spawnZ:-8,
    spawnYaw:0,

    // V91: Ignis is the FIRST boss. He does not exist in the world at game
    // start; the encounter becomes available only on the fifth night.
    spawnNight:5,

    // Boss size is derived from the REAL player height.
    heightMultiplier:1.33,

    // Small intentional hover in world units.
    hoverHeight:.08,
    hoverBob:.025,

    // Future combat configuration is already centralized.
    hp:1200,
    // V90: Ignis should notice the player from a meaningful distance and
    // actually hunt instead of waiting almost on top of the spawn.
    activationRadius:30,
    facingRadius:38,

    // V90: modest speed increase; movement is now used as pursuit, not just
    // a rare fallback between attacks.
    movementSpeed:1.15,

    // Phase 1 visual intensity only.
    fireIntensity:1,

    // Physical collider from the approved debug model.
    colliderBaseRadius:.50,
    colliderBaseHeight:2.60,

    debugHitboxes:false
  },window.FLORESTA_IGNIS_CONFIG||{});
  CFG.spawnNight=5;

  const STATES=Object.freeze({
    DORMANT:"DORMANT",
    IDLE:"IDLE",
    AGGRO:"AGGRO",
    COMBAT:"COMBAT",
    TRANSITION:"TRANSITION",
    DEAD:"DEAD"
  });

  const scene=game.scene;
  const player=game.player;

  // ------------------------------------------------------------
  // Measure the real player in world-space.
  // ------------------------------------------------------------
  function measurePlayerHeight(){
    const candidates=[
      game.trueFirstPerson?.fullMesh,
      game.trueFirstPerson?.visibleRoot
    ].filter(Boolean);

    let best=0;

    for(const obj of candidates){
      try{
        obj.updateWorldMatrix?.(true,true);

        const box=
          new THREE.Box3()
            .setFromObject(
              obj,
              true
            );

        if(box.isEmpty())continue;

        const size=
          new THREE.Vector3();

        box.getSize(size);

        if(
          Number.isFinite(size.y) &&
          size.y>.8 &&
          size.y<3.5
        ){
          best=Math.max(
            best,
            size.y
          );
        }
      }catch{}
    }

    // Current game also places the eyes at ~1.68 world units and
    // normalizes humanoid enemies to ~1.76, so this is a safe fallback.
    return best || 1.76;
  }

  const playerHeight=
    measurePlayerHeight();

  // ------------------------------------------------------------
  // IGNIS model / rig extracted from the debug source.
  // Uses the REAL game's THREE instance and REAL scene.
  // ------------------------------------------------------------
  const bossRoot=
    new THREE.Group();

  bossRoot.name=
    "IGNIS_O_INTOCADO";

  scene.add(bossRoot);

  // V91: never render the boss on the opening days. The night scheduler below
  // is the only normal gameplay path that reveals him.
  bossRoot.visible=false;

  const magmaMaterial=
    new THREE.ShaderMaterial({
      uniforms:{
        uT:{value:0},
        uHeat:{value:.30},
        uDis:{value:0},
        uFl:{value:0}
      },

      extensions:{
        derivatives:true
      },

      vertexShader:`
        varying vec3 vP,vW;

        void main(){
          vP=position;

          vec4 w=
            modelMatrix*
            vec4(
              position,
              1.0
            );

          vW=w.xyz;

          gl_Position=
            projectionMatrix*
            viewMatrix*
            w;
        }
      `,

      fragmentShader:`
        uniform float uT,uHeat,uDis,uFl;
        varying vec3 vP,vW;

        float h(vec3 p){
          return fract(
            sin(
              dot(
                p,
                vec3(
                  127.1,
                  311.7,
                  74.7
                )
              )
            )*
            43758.5
          );
        }

        float n(vec3 p){
          vec3 i=floor(p);
          vec3 f=fract(p);

          f=
            f*f*
            (
              3.0-
              2.0*f
            );

          return mix(
            mix(
              mix(
                h(i),
                h(
                  i+
                  vec3(
                    1,0,0
                  )
                ),
                f.x
              ),
              mix(
                h(
                  i+
                  vec3(
                    0,1,0
                  )
                ),
                h(
                  i+
                  vec3(
                    1,1,0
                  )
                ),
                f.x
              ),
              f.y
            ),
            mix(
              mix(
                h(
                  i+
                  vec3(
                    0,0,1
                  )
                ),
                h(
                  i+
                  vec3(
                    1,0,1
                  )
                ),
                f.x
              ),
              mix(
                h(
                  i+
                  vec3(
                    0,1,1
                  )
                ),
                h(
                  i+
                  vec3(
                    1,1,1
                  )
                ),
                f.x
              ),
              f.y
            ),
            f.z
          );
        }

        void main(){
          float d=
            n(
              vP*7.0+
              3.0
            );

          if(d<uDis)discard;

          vec3 fn=
            normalize(
              cross(
                dFdx(vW),
                dFdy(vW)
              )
            );

          if(
            dot(
              fn,
              cameraPosition-vW
            )<0.0
          ){
            fn=-fn;
          }

          vec3 p=
            vP*5.0;

          float a=
            (
              n(p)+
              .5*n(p*2.1)+
              .25*n(
                p*4.3+
                uT*.25
              )
            )/
            1.75;

          float w=
            .03+
            .27*
            pow(
              uHeat,
              1.5
            );

          float c=
            1.0-
            smoothstep(
              w*.5,
              w,
              abs(
                a-.5
              )
            );

          c*=
            .82+
            .18*
            sin(
              uT*3.0+
              a*20.0
            );

          vec3 mg=
            mix(
              vec3(
                .75,.1,0.
              ),
              vec3(
                1.,.55,.05
              ),
              c
            );

          mg=
            mix(
              mg,
              vec3(
                1.,.95,.6
              ),
              smoothstep(
                .5,
                1.,
                uHeat
              )*
              c
            );

          mg*=
            1.2+
            2.2*uHeat;

          vec3 L=
            normalize(
              vec3(
                -.4,.8,.5
              )
            );

          float tint=
            .8+
            .4*
            h(
              floor(
                vP*9.
              )
            );

          vec3 rock=
            vec3(
              .1,.07,.06
            )*
            tint*
            (
              .3+
              .95*
              max(
                dot(
                  fn,L
                ),
                0.
              )
            );

          float fr=
            pow(
              1.-
              abs(
                dot(
                  normalize(
                    cameraPosition-vW
                  ),
                  fn
                )
              ),
              2.5
            );

          vec3 col=
            mix(
              rock,
              mg,
              c
            )+
            vec3(
              1.,.3,.05
            )*
            fr*
            uHeat*
            1.1+
            uFl*
            vec3(
              1.,.6,.3
            );

          if(
            d<
            uDis+.05
          ){
            col=
              vec3(
                3.,
                1.6,
                .4
              );
          }

          gl_FragColor=
            vec4(
              col/
              (
                1.+
                col*.12
              ),
              1.
            );
        }
      `
    });

  function wob(x,y,z){
    return (
      Math.sin(
        x*9+
        y*5
      )*
      Math.cos(
        z*7+
        y*3
      )+
      .5*
      Math.sin(
        x*21+
        z*17
      )
    );
  }

  function displace(
    geometry,
    amount
  ){
    const p=
      geometry
        .attributes
        .position;

    for(
      let i=0;
      i<p.count;
      i++
    ){
      const x=p.getX(i);
      const y=p.getY(i);
      const z=p.getZ(i);

      const f=
        1+
        amount*
        wob(
          x*3,
          y*3,
          z*3
        );

      p.setXYZ(
        i,
        x*f,
        y*
        (
          1+
          amount*.4*
          wob(
            z*2,
            x*2,
            y
          )
        ),
        z*f
      );
    }

    p.needsUpdate=true;
    geometry.computeVertexNormals();
    geometry.computeBoundingBox();
    geometry.computeBoundingSphere();

    return geometry;
  }

  const GEO={
    sph:
      displace(
        new THREE.SphereGeometry(
          1,8,6
        ),
        .1
      ),

    cyl:
      displace(
        new THREE.CylinderGeometry(
          1,.8,1,7,2
        ),
        .08
      ),

    box:
      new THREE.BoxGeometry(
        1,1,1
      ),

    cone:
      new THREE.ConeGeometry(
        1,1,5
      ),

    dod:
      displace(
        new THREE.DodecahedronGeometry(
          1
        ),
        .18
      )
  };

  const solidMeshes=[];

  function mesh(
    geometry,
    parent,
    x,y,z,
    sx=1,
    sy=sx,
    sz=sx,
    rx=0,
    ry=0,
    rz=0
  ){
    const m=
      new THREE.Mesh(
        geometry,
        magmaMaterial
      );

    m.position.set(
      x,y,z
    );

    m.scale.set(
      sx,sy,sz
    );

    m.rotation.set(
      rx,ry,rz
    );

    m.castShadow=true;
    m.receiveShadow=true;

    parent.add(m);
    solidMeshes.push(m);

    return m;
  }

  function bone(
    name,
    parent,
    x,y,z
  ){
    const b=
      new THREE.Bone();

    b.name=name;
    b.position.set(
      x,y,z
    );

    parent.add(b);
    return b;
  }

  const B={};
  const X={};

  const rigRoot=
    bone(
      "Ignis_Root",
      bossRoot,
      0,0,0
    );

  const hips=
    bone(
      "Pelvis",
      rigRoot,
      0,1.12,0
    );

  B.hips=hips;

  mesh(
    GEO.sph,
    hips,
    0,0,0,
    .26,.16,.2
  );

  mesh(
    GEO.box,
    hips,
    0,-.1,.12,
    .2,.14,.04,
    .2
  );

  for(const s of[-1,1]){
    mesh(
      GEO.box,
      hips,
      s*.2,0,.04,
      .06,.14,.16,
      0,0,
      s*.35
    );
  }

  B.spine=
    bone(
      "Spine_01",
      hips,
      0,.1,0
    );

  mesh(
    GEO.cyl,
    B.spine,
    0,.14,0,
    .2,.28,.16
  );

  for(const s of[-1,1]){
    for(let r=0;r<3;r++){
      mesh(
        GEO.box,
        B.spine,
        s*.05,
        .03+r*.085,
        .15,
        .075,.06,.04
      );
    }
  }

  X.s2=
    bone(
      "Spine_02",
      B.spine,
      0,.2,0
    );

  mesh(
    GEO.cyl,
    X.s2,
    0,.1,0,
    .3,.24,.2
  );

  B.chest=
    bone(
      "Chest",
      X.s2,
      0,.2,0
    );

  mesh(
    GEO.sph,
    B.chest,
    0,.2,0,
    .37,.28,.24
  );

  for(const s of[-1,1]){
    mesh(
      GEO.sph,
      B.chest,
      s*.16,.22,.17,
      .17,.12,.1
    );

    mesh(
      GEO.box,
      B.chest,
      s*.17,.46,-.02,
      .14,.05,.12,
      0,0,
      -s*.4
    );

    mesh(
      GEO.cone,
      B.chest,
      s*.12,.32,-.25,
      .05,.3,.05,
      -.9,0,
      s*.25
    );

    mesh(
      GEO.cone,
      B.chest,
      s*.2,.22,-.24,
      .04,.22,.04,
      -1.1,0,
      s*.6
    );
  }

  B.neck=
    bone(
      "Neck",
      B.chest,
      0,.5,0
    );

  mesh(
    GEO.cyl,
    B.neck,
    0,.07,0,
    .09,.18,.09
  );

  B.head=
    bone(
      "Head",
      B.neck,
      0,.13,0
    );

  mesh(
    GEO.sph,
    B.head,
    0,.13,0,
    .115,.15,.125
  );

  mesh(
    GEO.box,
    B.head,
    0,.19,.105,
    .14,.025,.04
  );

  mesh(
    GEO.box,
    B.head,
    0,.12,.125,
    .028,.07,.03
  );

  for(const s of[-1,1]){
    mesh(
      GEO.box,
      B.head,
      s*.118,.12,0,
      .02,.06,.04
    );
  }

  X.jaw=
    bone(
      "Jaw",
      B.head,
      0,.04,.03
    );

  mesh(
    GEO.box,
    X.jaw,
    0,-.02,.055,
    .1,.045,.09
  );

  for(let i=0;i<7;i++){
    const a=
      (i-3)/3;

    mesh(
      GEO.cone,
      B.head,
      a*.09,
      .25,
      -.03-
      Math.abs(a)*.03,
      .032,
      .2+
      .05*
      (
        1-
        Math.abs(a)
      ),
      .032,
      -.5-
      .15*
      Math.abs(a),
      0,
      -a*.55
    );
  }

  const eyeMaterial=
    new THREE.MeshBasicMaterial({
      color:0xffc060,
      toneMapped:false
    });

  const eyeMeshes=[];

  for(const s of[-1,1]){
    const e=
      new THREE.Mesh(
        GEO.box,
        eyeMaterial
      );

    e.scale.set(
      .05,.014,.01
    );

    e.position.set(
      s*.052,
      .155,
      .113
    );

    e.rotation.z=
      -s*.28;

    B.head.add(e);
    eyeMeshes.push(e);
  }

  function makeHand(
    forearm,
    sign,
    side
  ){
    const h=
      bone(
        "Hand_"+side,
        forearm,
        0,-.3,0
      );

    mesh(
      GEO.box,
      h,
      0,-.055,0,
      .09,.1,.035
    );

    mesh(
      GEO.box,
      h,
      0,-.005,0,
      .07,.04,.04
    );

    const fingers=[];
    const thumbs=[];

    const defs=[
      ["Index",.034,.046],
      ["Middle",.011,.052],
      ["Ring",-.012,.047],
      ["Pinky",-.034,.037]
    ];

    for(const [
      name,
      x,
      length
    ] of defs){
      let parent=
        bone(
          `Finger_${name}_${side}_01`,
          h,
          sign*x,
          -.105,
          0
        );

      const chain=[
        parent
      ];

      for(let k=0;k<3;k++){
        const len=
          length*
          (
            1-
            .2*k
          );

        const width=
          .02-
          .003*k;

        mesh(
          GEO.box,
          parent,
          0,
          -len/2,
          0,
          width,
          len,
          width
        );

        if(k<2){
          parent=
            bone(
              `Finger_${name}_${side}_0${k+2}`,
              parent,
              0,-len,0
            );

          chain.push(
            parent
          );
        }
      }

      fingers.push(
        chain
      );
    }

    let thumb=
      bone(
        `Finger_Thumb_${side}_01`,
        h,
        sign*.05,
        -.04,
        .012
      );

    thumb.rotation.z=
      sign*.75;

    thumbs.push(
      thumb
    );

    mesh(
      GEO.box,
      thumb,
      0,-.024,0,
      .024,.05,.024
    );

    thumb=
      bone(
        `Finger_Thumb_${side}_02`,
        thumb,
        0,-.05,0
      );

    thumbs.push(
      thumb
    );

    mesh(
      GEO.box,
      thumb,
      0,-.018,0,
      .02,.04,.02
    );

    h.curl=amount=>{
      for(const chain of fingers){
        for(
          let k=0;
          k<chain.length;
          k++
        ){
          chain[k].rotation.x=
            -amount*
            (
              k
                ?1.35
                :1.2
            );
        }
      }

      for(
        let k=0;
        k<thumbs.length;
        k++
      ){
        thumbs[k].rotation.x=
          -amount*
          .55*
          (
            k+.8
          );
      }
    };

    const socket=
      new THREE.Object3D();

    socket.name=
      "Socket_Hand_"+side;

    socket.position.set(
      0,-.12,.03
    );

    h.add(socket);

    return h;
  }

  for(const [side,sign] of[
    ["L",-1],
    ["R",1]
  ]){
    const clavicle=
      bone(
        "Clavicle_"+side,
        B.chest,
        sign*.2,
        .45,
        0
      );

    mesh(
      GEO.dod,
      clavicle,
      sign*.14,
      .04,
      0,
      .17,.14,.16
    );

    mesh(
      GEO.cone,
      clavicle,
      sign*.2,
      .15,
      -.02,
      .05,.2,.05,
      0,0,
      -sign*.7
    );

    mesh(
      GEO.cone,
      clavicle,
      sign*.14,
      .17,
      -.06,
      .04,.16,.04,
      -.4,0,
      -sign*.3
    );

    const upperArm=
      bone(
        "UpperArm_"+side,
        clavicle,
        sign*.23,
        -.03,
        0
      );

    B["ua"+side]=
      upperArm;

    mesh(
      GEO.sph,
      upperArm,
      0,0,0,
      .115,.11,.11
    );

    mesh(
      GEO.cyl,
      upperArm,
      0,-.17,0,
      .1,.34,.1
    );

    mesh(
      GEO.sph,
      upperArm,
      0,-.12,.04,
      .085,.13,.07
    );

    mesh(
      GEO.sph,
      upperArm,
      0,-.14,-.04,
      .075,.12,.06
    );

    const forearm=
      bone(
        "Forearm_"+side,
        upperArm,
        0,-.34,0
      );

    B["fa"+side]=
      forearm;

    mesh(
      GEO.sph,
      forearm,
      0,0,0,
      .08
    );

    mesh(
      GEO.cyl,
      forearm,
      0,-.15,0,
      .085,.3,.085
    );

    mesh(
      GEO.box,
      forearm,
      0,-.1,.015,
      .15,.14,.13
    );

    mesh(
      GEO.box,
      forearm,
      0,-.21,0,
      .11,.04,.11
    );

    B["ha"+side]=
      makeHand(
        forearm,
        sign,
        side
      );

    const thigh=
      bone(
        "Thigh_"+side,
        hips,
        sign*.15,
        -.05,
        0
      );

    B["th"+side]=
      thigh;

    mesh(
      GEO.cyl,
      thigh,
      0,-.24,0,
      .14,.5,.14
    );

    mesh(
      GEO.sph,
      thigh,
      0,-.17,.04,
      .11,.2,.1
    );

    mesh(
      GEO.sph,
      thigh,
      0,-.5,.03,
      .095
    );

    const calf=
      bone(
        "Calf_"+side,
        thigh,
        0,-.5,0
      );

    B["sh"+side]=
      calf;

    mesh(
      GEO.cyl,
      calf,
      0,-.25,0,
      .095,.5,.095
    );

    mesh(
      GEO.sph,
      calf,
      0,-.15,-.04,
      .08,.16,.075
    );

    mesh(
      GEO.box,
      calf,
      0,-.22,.075,
      .1,.22,.04
    );

    const foot=
      bone(
        "Foot_"+side,
        calf,
        0,-.5,0
      );

    B["foot"+side]=
      foot;

    mesh(
      GEO.box,
      foot,
      0,-.03,.05,
      .1,.06,.16
    );

    const toe=
      bone(
        "Toe_"+side,
        foot,
        0,-.05,.13
      );

    mesh(
      GEO.box,
      toe,
      0,0,.04,
      .1,.04,.09
    );
  }

  const sockets={};

  for(const [
    name,
    parent,
    x,y,z
  ] of[
    [
      "Socket_Chest_Core",
      B.chest,
      0,.25,.2
    ],
    [
      "Socket_Back_Flame",
      B.chest,
      0,.35,-.25
    ],
    [
      "Socket_Head_Fire",
      B.head,
      0,.3,-.03
    ]
  ]){
    const socket=
      new THREE.Object3D();

    socket.name=name;
    socket.position.set(
      x,y,z
    );

    parent.add(socket);
    sockets[name]=socket;
  }

  // ------------------------------------------------------------
  // Normalize against the REAL player.
  // Hitboxes are added after this measurement so they cannot contaminate it.
  // ------------------------------------------------------------
  bossRoot.updateMatrixWorld(true);

  const nativeBox=
    new THREE.Box3();

  for(const m of solidMeshes){
    m.updateWorldMatrix?.(
      true,
      false
    );

    const box=
      new THREE.Box3()
        .setFromObject(
          m,
          true
        );

    nativeBox.union(
      box
    );
  }

  for(const e of eyeMeshes){
    e.updateWorldMatrix?.(
      true,
      false
    );

    nativeBox.union(
      new THREE.Box3()
        .setFromObject(
          e,
          true
        )
    );
  }

  const nativeSize=
    new THREE.Vector3();

  nativeBox.getSize(
    nativeSize
  );

  const nativeHeight=
    Math.max(
      .001,
      nativeSize.y
    );

  let targetHeight=
    playerHeight*
    CFG.heightMultiplier;

  let worldScale=
    targetHeight/
    nativeHeight;

  bossRoot.scale.setScalar(
    worldScale
  );

  // ------------------------------------------------------------
  // Hitboxes/collider from the debug boss, attached to the same bones.
  // ------------------------------------------------------------
  const hitboxes=[];

  const hitboxMaterial=
    new THREE.MeshBasicMaterial({
      color:0x00ff66,
      wireframe:true,
      depthTest:false,
      transparent:true,
      opacity:.75
    });

  const attackHitboxMaterial=
    new THREE.MeshBasicMaterial({
      color:0xff3355,
      wireframe:true,
      depthTest:false,
      transparent:true,
      opacity:.75
    });

  function hitbox(
    name,
    geometry,
    parent,
    x,y,z,
    attack=false
  ){
    const m=
      new THREE.Mesh(
        geometry,
        attack
          ?attackHitboxMaterial
          :hitboxMaterial
      );

    m.name=name;
    m.position.set(
      x,y,z
    );

    m.visible=
      !!CFG.debugHitboxes;

    m.renderOrder=999;
    parent.add(m);

    hitboxes.push(m);

    return m;
  }

  hitbox(
    "Hitbox_Head",
    new THREE.SphereGeometry(
      .2,8,6
    ),
    B.head,
    0,.13,0
  );

  hitbox(
    "Hitbox_Torso",
    new THREE.BoxGeometry(
      .8,.95,.5
    ),
    X.s2,
    0,.2,0
  );

  for(const side of[
    "L","R"
  ]){
    hitbox(
      "Hitbox_Arm_"+side,
      new THREE.BoxGeometry(
        .2,.7,.2
      ),
      B["ua"+side],
      0,-.3,0
    );

    hitbox(
      "Hitbox_Leg_"+side,
      new THREE.BoxGeometry(
        .24,1,.24
      ),
      B["th"+side],
      0,-.5,0
    );

    hitbox(
      "Hitbox_Hand_"+side,
      new THREE.SphereGeometry(
        .14,8,6
      ),
      B["ha"+side],
      0,-.1,0,
      true
    );
  }

  const mainCollider=
    hitbox(
      "Collider_Main",
      new THREE.CylinderGeometry(
        .5,.5,2.6,10
      ),
      rigRoot,
      0,1.3,0
    );

  // ------------------------------------------------------------
  // Phase-1 body fire: one pooled Points draw call.
  // No second renderer and no second requestAnimationFrame.
  // ------------------------------------------------------------
  const FIRE_MAX=2400;

  const firePos=
    new Float32Array(
      FIRE_MAX*3
    );

  const fireVel=
    new Float32Array(
      FIRE_MAX*3
    );

  const fireSize=
    new Float32Array(
      FIRE_MAX
    );

  const fireColor=
    new Float32Array(
      FIRE_MAX*4
    );

  const fireAge=
    new Float32Array(
      FIRE_MAX
    );

  const fireLife=
    new Float32Array(
      FIRE_MAX
    );

  const fireS0=
    new Float32Array(
      FIRE_MAX
    );

  const fireS1=
    new Float32Array(
      FIRE_MAX
    );

  let fireHead=0;

  const fireGeometry=
    new THREE.BufferGeometry();

  fireGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      firePos,
      3
    )
  );

  fireGeometry.setAttribute(
    "aS",
    new THREE.BufferAttribute(
      fireSize,
      1
    )
  );

  fireGeometry.setAttribute(
    "aC",
    new THREE.BufferAttribute(
      fireColor,
      4
    )
  );

  const fireMaterial=
    new THREE.ShaderMaterial({
      uniforms:{
        uK:{value:600}
      },

      transparent:true,
      depthWrite:false,
      blending:
        THREE.AdditiveBlending,

      vertexShader:`
        attribute float aS;
        attribute vec4 aC;
        varying vec4 vC;
        uniform float uK;

        void main(){
          vC=aC;

          vec4 m=
            modelViewMatrix*
            vec4(
              position,
              1.
            );

          gl_PointSize=
            aS*
            uK/
            -m.z;

          gl_Position=
            projectionMatrix*
            m;
        }
      `,

      fragmentShader:`
        varying vec4 vC;

        void main(){
          float d=
            length(
              gl_PointCoord-.5
            )*
            2.;

          if(d>1.)discard;

          gl_FragColor=
            vec4(
              vC.rgb*1.3,
              pow(
                1.-d,
                1.6
              )*
              vC.a
            );
        }
      `
    });

  const firePoints=
    new THREE.Points(
      fireGeometry,
      fireMaterial
    );

  firePoints.name=
    "Ignis_Body_Fire";

  firePoints.frustumCulled=false;

  scene.add(
    firePoints
  );

  function updatePointScale(){
    const size=
      new THREE.Vector2();

    game.renderer
      .getDrawingBufferSize(
        size
      );

    fireMaterial.uniforms.uK.value=
      size.y/
      (
        2*
        Math.tan(
          game.camera.fov*
          Math.PI/
          360
        )
      );
  }

  updatePointScale();

  window.addEventListener(
    "resize",
    updatePointScale,
    {
      passive:true
    }
  );

  function emitFire(
    x,y,z,
    vx,vy,vz,
    startSize,
    endSize,
    life
  ){
    fireHead=
      (
        fireHead+1
      )%
      FIRE_MAX;

    const i=fireHead;

    firePos[i*3]=x;
    firePos[i*3+1]=y;
    firePos[i*3+2]=z;

    fireVel[i*3]=vx;
    fireVel[i*3+1]=vy;
    fireVel[i*3+2]=vz;

    fireS0[i]=startSize;
    fireS1[i]=endSize;

    fireLife[i]=life;
    fireAge[i]=0;

    // Controlled phase-1 palette: yellow/orange -> deep red.
    fireColor[i*4]=
      1;

    fireColor[i*4+1]=
      .68+
      Math.random()*.18;

    fireColor[i*4+2]=
      .10+
      Math.random()*.09;

    fireColor[i*4+3]=
      1;
  }

  function updateFireParticles(dt){
    for(
      let i=0;
      i<FIRE_MAX;
      i++
    ){
      const life=
        fireLife[i];

      if(life<=0){
        fireSize[i]=0;
        continue;
      }

      fireAge[i]+=dt;

      const t=
        fireAge[i]/
        life;

      if(t>=1){
        fireLife[i]=0;
        fireSize[i]=0;
        continue;
      }

      fireVel[i*3+1]+=
        .35*dt;

      const drag=
        Math.max(
          0,
          1-
          .75*dt
        );

      fireVel[i*3]*=drag;
      fireVel[i*3+2]*=drag;

      firePos[i*3]+=
        fireVel[i*3]*
        dt;

      firePos[i*3+1]+=
        fireVel[i*3+1]*
        dt;

      firePos[i*3+2]+=
        fireVel[i*3+2]*
        dt;

      fireSize[i]=
        lerp(
          fireS0[i],
          fireS1[i],
          t
        );

      fireColor[i*4+3]=
        Math.pow(
          1-t,
          1.25
        )*
        Math.min(
          1,
          t*12
        );
    }

    fireGeometry
      .attributes
      .position
      .needsUpdate=true;

    fireGeometry
      .attributes
      .aS
      .needsUpdate=true;

    fireGeometry
      .attributes
      .aC
      .needsUpdate=true;
  }

  const tempWorld=
    new THREE.Vector3();

  const emitters=[
    {
      bone:B.chest,
      x:.42,y:.45,z:0,
      rate:14,
      size:.25
    },
    {
      bone:B.chest,
      x:-.42,y:.45,z:0,
      rate:14,
      size:.25
    },
    {
      bone:B.head,
      x:0,y:.32,z:-.02,
      rate:45,
      size:.30
    },
    {
      bone:B.uaL,
      x:0,y:-.2,z:0,
      rate:6,
      size:.22
    },
    {
      bone:B.uaR,
      x:0,y:-.2,z:0,
      rate:6,
      size:.22
    },
    {
      bone:B.faL,
      x:0,y:-.15,z:0,
      rate:5,
      size:.20
    },
    {
      bone:B.faR,
      x:0,y:-.15,z:0,
      rate:5,
      size:.20
    },
    {
      bone:B.chest,
      x:0,y:.3,z:-.25,
      rate:12,
      size:.45
    }
  ];

  let particleCarry=0;
  let movementFireCarry=0;

  function emitMovementFire(dt,distance){
    if(
      bossPhase<=1 ||
      bossMoveSpeed<=.5 ||
      state===STATES.DEAD
    )return;

    let lod=1;
    if(distance>42)lod=.20;
    else if(distance>28)lod=.55;

    movementFireCarry+=80*dt*lod;

    let count=Math.min(8,Math.floor(movementFireCarry));
    movementFireCarry-=count;

    const movingBones=[B.shL,B.shR];

    while(count-->0){
      const bone=movingBones[count%2];
      bone.getWorldPosition(tempWorld);

      emitFire(
        tempWorld.x+randomRange(-.08,.08),
        game.groundY(tempWorld.x,tempWorld.z)+.10,
        tempWorld.z+randomRange(-.08,.08),
        randomRange(-.4,.4)-lastMoveDx*.7,
        randomRange(.1,1.0),
        randomRange(-.4,.4)-lastMoveDz*.7,
        .55*worldScale,
        .10,
        .90
      );
    }
  }

  function emitBodyFire(
    dt,
    distance
  ){
    let lod=1;

    if(distance>46){
      lod=0;
    }else if(distance>32){
      lod=.22;
    }else if(distance>22){
      lod=.52;
    }

    if(lod<=0)return;

    const fireScale=
      worldScale*
      CFG.fireIntensity;

    for(const e of emitters){
      const phaseFireBoost=
        bossPhase>1
          ? 2.15
          : 1;

      particleCarry+=
        e.rate*
        dt*
        lod*
        .8*
        CFG.fireIntensity*
        phaseFireBoost;

      let count=
        Math.floor(
          particleCarry
        );

      particleCarry-=count;

      count=Math.min(
        count,
        5
      );

      while(count-->0){
        tempWorld.set(
          e.x+
          (
            Math.random()-.5
          )*.12,
          e.y,
          e.z+
          (
            Math.random()-.5
          )*.12
        );

        e.bone.localToWorld(
          tempWorld
        );

        emitFire(
          tempWorld.x,
          tempWorld.y,
          tempWorld.z,

          (
            Math.random()-.5
          )*
          .35*
          worldScale,

          (
            .8+
            Math.random()*1.7
          )*
          worldScale,

          (
            Math.random()-.5
          )*
          .35*
          worldScale,

          e.size*
          fireScale*
          (
            .86+
            Math.random()*.24
          ),

          .035*
          worldScale,

          (
            .45+
            Math.random()*.55
          )
        );
      }
    }
  }

  // Local light belongs to Ignis only; it does not replace the game's lighting.
  const bossLight=
    new THREE.PointLight(
      0xff6a1a,
      0,
      targetHeight*5.5,
      1.5
    );

  bossLight.name=
    "Ignis_Local_Fire_Light";

  bossLight.position.set(
    0,
    nativeHeight*.64,
    0
  );

  bossRoot.add(
    bossLight
  );

  // ------------------------------------------------------------
  // Phase 1 idle pose, extracted/adapted from the debug boss.
  // ------------------------------------------------------------
  const BASE1={
    chest:[
      -.08,0,0
    ],
    head:[
      -.15,0,0
    ],
    uaL:[
      .05,0,-.16
    ],
    faL:[
      -.15,0,0
    ],
    uaR:[
      0,0,.3
    ],
    faR:[
      -.45,0,0
    ],
    thL:[
      .06,0,-.03
    ],
    thR:[
      .04,0,.04
    ],
    shL:[
      .12,0,0
    ],
    shR:[
      .14,0,0
    ]
  };

  const BASE2={
    chest:[.20,0,0],
    head:[.28,0,0],
    uaL:[-.20,0,-.65],
    faL:[-.90,0,0],
    uaR:[-.20,0,.65],
    faR:[-.90,0,0],
    thL:[.10,0,-.20],
    thR:[.10,0,.20],
    shL:[.30,0,0],
    shR:[.30,0,0],
    spine:[.10,0,0]
  };

  const animBones=[
    "spine",
    "chest",
    "head",
    "uaL","faL",
    "uaR","faR",
    "thL","thR",
    "shL","shR"
  ];

  let lookYaw=0;
  let gestureLeft=
    2+
    Math.random()*3;

  let gestureTime=0;

  function seg01(v,a,b){
    return clamp(
      (v-a)/
      Math.max(.0001,b-a),
      0,1
    );
  }

  function smoothSeg(v,a,b){
    return smooth(
      seg01(v,a,b)
    );
  }

  function applyBossPose(
    dt,
    elapsed,
    targetHeadYaw
  ){
    gestureLeft-=dt;

    if(
      gestureLeft<=0 &&
      gestureTime<=0 &&
      state!==STATES.COMBAT
    ){
      gestureTime=1.6;
      gestureLeft=
        5+
        Math.random()*4;
    }

    gestureTime=
      Math.max(
        0,
        gestureTime-dt
      );

    const targets={};

    for(const name of animBones){
      const a=
        BASE1[name]||
        [0,0,0];

      const b=
        BASE2[name]||
        [0,0,0];

      targets[name]=[
        lerp(a[0],b[0],phaseBlend),
        lerp(a[1],b[1],phaseBlend),
        lerp(a[2],b[2],phaseBlend)
      ];
    }

    targets.chest[0]+=
      Math.sin(
        elapsed*
        (
          bossPhase>1
            ?4.1
            :1.1
        )
      )*
      (
        bossPhase>1
          ?.04
          :.025
      );

    lookYaw+=
      (
        targetHeadYaw-
        lookYaw
      )*
      Math.min(
        1,
        dt*
        (
          bossPhase>1
            ?6
            :3
        )
      );

    targets.head[1]+=
      lookYaw*.60;

    const u=
      actionDuration>0
        ?clamp(
            actionTime/
            actionDuration,
            0,1
          )
        :0;

    const wind=
      smoothSeg(
        u,
        0,.18
      )*
      (
        1-
        smoothSeg(
          u,.86,1
        )
      );

    if(action==="ATK_PILLARS"){
      const up=
        smoothSeg(
          u,0,.35
        );

      const slam=
        smoothSeg(
          u,.35,.52
        );

      const armX=
        lerp(
          lerp(
            0,
            -2.65,
            up
          ),
          -.90,
          slam
        );

      targets.uaR[0]=
        armX;

      targets.faR[0]=
        -.20;

      if(bossPhase>1){
        targets.uaL[0]=
          armX;

        targets.faL[0]=
          -.20;
      }

      targets.chest[0]+=
        lerp(
          -.18*up,
          .35,
          slam
        )*
        wind;
    }
    else if(action==="ATK_FIREBALL"){
      const load=
        smoothSeg(
          u,0,.42
        );

      const throwK=
        smoothSeg(
          u,.54,.70
        );

      targets.uaL[0]=
        -1.0*load;

      targets.faL[0]=
        -1.3*load;

      targets.uaR[0]=
        lerp(
          -1.0*load,
          -1.9,
          throwK
        );

      targets.faR[0]=
        lerp(
          -1.3*load,
          -.10,
          throwK
        );

      targets.chest[0]+=
        .25*throwK;
    }
    else if(action==="ATK_STREAM"){
      const up=
        smoothSeg(
          u,0,.20
        );

      targets.uaL[0]=
        -1.50*up;

      targets.uaR[0]=
        -1.50*up;

      targets.uaL[2]=
        -.12;

      targets.uaR[2]=
        .12;

      targets.faL[0]=
        -.10;

      targets.faR[0]=
        -.10;

      targets.chest[0]+=
        .22*up;

      targets.head[0]+=
        .15*up;
    }
    else if(action==="ATK_SOLAR"){
      const gather=
        smoothSeg(
          u,0,.25
        );

      const charge=
        smoothSeg(
          u,.45,.70
        );

      const release=
        smoothSeg(
          u,.72,.78
        );

      const z=
        lerp(
          lerp(
            2.5*gather,
            .30,
            charge
          ),
          1.70,
          release
        );

      const x=
        lerp(
          lerp(
            -.20*gather,
            -1.40,
            charge
          ),
          -.20,
          release
        );

      const f=
        lerp(
          lerp(
            0,
            -1.70,
            charge
          ),
          0,
          release
        );

      targets.uaL=[
        x,
        0,
        -z
      ];

      targets.uaR=[
        x,
        0,
        z
      ];

      targets.faL=[
        f,0,0
      ];

      targets.faR=[
        f,0,0
      ];

      targets.head[0]+=
        lerp(
          -.50*gather,
          .30,
          charge
        );

      targets.chest[0]+=
        lerp(
          -.30*gather,
          .30,
          charge
        );
    }
    else if(action==="HEATWAVE"){
      const pull=
        smoothSeg(
          u,0,.28
        );

      const release=
        smoothSeg(
          u,.28,.36
        );

      const z=
        lerp(
          .30*pull,
          1.70,
          release
        );

      targets.uaL=[
        lerp(
          -1.0*pull,
          -.20,
          release
        ),
        0,
        -z
      ];

      targets.uaR=[
        lerp(
          -1.0*pull,
          -.20,
          release
        ),
        0,
        z
      ];

      targets.faL=[
        lerp(
          -2.20*pull,
          0,
          release
        ),
        0,0
      ];

      targets.faR=[
        lerp(
          -2.20*pull,
          0,
          release
        ),
        0,0
      ];

      targets.chest[0]+=
        lerp(
          .30*pull,
          -.20,
          release
        );
    }
    else if(state===STATES.TRANSITION){
      const s=actionTime;

      const look=
        smoothSeg(
          s,0,.9
        )*
        (
          1-
          smoothSeg(
            s,3,3.8
          )
        );

      const awaken=
        smoothSeg(
          s,3.6,6
        );

      const blast=
        smoothSeg(
          s,6.1,6.3
        );

      targets.head[0]+=
        .60*look;

      targets.uaR[0]+=
        -1.10*look;

      targets.uaR[2]+=
        .20*look;

      targets.faR[0]+=
        -1.50*look;

      targets.chest[0]+=
        .28*
        awaken*
        (
          1-blast
        );

      targets.uaL[2]+=
        -.80*
        awaken;

      targets.faL[0]+=
        -.80*
        awaken;

      if(blast>0){
        targets.uaR=[
          -.20,
          0,
          2
        ];

        targets.uaL=[
          -.20,
          0,
          -2
        ];

        targets.faR=[
          0,0,0
        ];

        targets.faL=[
          0,0,0
        ];

        targets.chest[0]=
          -.25;

        targets.head[0]=
          -.50;
      }
    }
    else if(state===STATES.DEAD){
      const k=
        smoothSeg(
          actionTime,
          .8,
          4.2
        );

      targets.thL=[
        -1.40*k,
        0,
        -.10
      ];

      targets.thR=[
        -1.40*k,
        0,
        .10
      ];

      targets.shL=[
        1.70*k,
        0,0
      ];

      targets.shR=[
        1.70*k,
        0,0
      ];

      targets.head[0]+=
        .70*k;

      targets.chest[0]+=
        .35*k;

      targets.uaL=[
        .30,0,-.30
      ];

      targets.uaR=[
        .30,0,.30
      ];

      targets.faL=[
        -.40,0,0
      ];

      targets.faR=[
        -.40,0,0
      ];
    }
    else if(action==="HIT_REACTION"){
      const hit=
        Math.sin(
          Math.PI*u
        );

      targets.chest[0]+=
        -.35*hit;

      targets.head[0]+=
        -.40*hit;

      targets.uaL[0]+=
        .40*hit;

      targets.uaL[2]+=
        -.50*hit;

      targets.uaR[0]+=
        .40*hit;

      targets.uaR[2]+=
        .50*hit;
    }
    else{
      if(gestureTime>0){
        const gu=
          clamp(
            1-
            gestureTime/1.6,
            0,1
          );

        const g=
          smooth(
            Math.sin(
              Math.PI*gu
            )
          );

        targets.head[2]+=
          .28*g;

        targets.uaR[0]+=
          -.30*g;

        targets.uaR[2]+=
          .15*g;

        targets.faR[0]+=
          -.60*g;
      }
    }

    targets.chest[0]-=
      bossFlinch*.30;

    targets.head[0]-=
      bossFlinch*.35;

    // Debug reference: T.spine[0] += b.speed * .02.
    targets.spine[0]+=
      bossMoveSpeed*.02;

    // Debug Phase 2 movement has a subtle high-frequency body vibration.
    if(
      bossPhase>1 &&
      state!==STATES.TRANSITION &&
      state!==STATES.DEAD
    ){
      targets.chest[2]+=
        Math.sin(elapsed*23+5)*.012;

      targets.head[2]+=
        Math.sin(elapsed*23+4)*.012;
    }

    for(const name of animBones){
      const boneObj=
        B[name];

      if(!boneObj)continue;

      const t=
        targets[name];

      const k=
        Math.min(
          1,
          dt*
          (
            bossPhase>1
              ?14
              :7
          )
        );

      boneObj.rotation.x+=
        (
          t[0]-
          boneObj.rotation.x
        )*
        k;

      boneObj.rotation.y+=
        (
          t[1]-
          boneObj.rotation.y
        )*
        k;

      boneObj.rotation.z+=
        (
          t[2]-
          boneObj.rotation.z
        )*
        k;
    }

    X.s2.rotation.x=
      B.chest.rotation.x*.5;

    X.s2.rotation.y=
      B.chest.rotation.y*.5;

    X.s2.rotation.z=
      B.chest.rotation.z*.5;

    let curlL=
      bossPhase>1
        ?1
        :.15;

    let curlR=
      bossPhase>1
        ?1
        :.12;

    if(action==="ATK_STREAM"){
      curlL=0;
      curlR=0;
    }else if(action==="ATK_FIREBALL"){
      curlL=.50;
      curlR=
        u>.62
          ?0
          :.50;
    }else if(action==="ATK_SOLAR"){
      curlL=1;
      curlR=1;
    }

    B.haL.curl(curlL);
    B.haR.curl(curlR);

    const jawTarget=
      (
        action.startsWith("ATK_") ||
        state===STATES.DEAD
      )
        ?.28
        :0;

    X.jaw.rotation.x+=
      (
        jawTarget-
        X.jaw.rotation.x
      )*
      Math.min(
        1,
        dt*8
      );

    // Exact visual float character from the approved debug boss.
    let floatTarget=
      bossPhase>1
        ?.34
        :.18;

    if(action==="ATK_SOLAR"){
      const su=
        actionDuration>0
          ?clamp(actionTime/actionDuration,0,1)
          :0;

      floatTarget+=
        lerp(0,.90,smoothSeg(su,.10,.50));
    }

    bossFloat+=
      (floatTarget-bossFloat)*
      Math.min(1,dt*5);

    B.hips.position.y=
      1.12+
      bossFloat+
      Math.sin(elapsed*1.7)*.025;
  }

  // ------------------------------------------------------------
  // Real-game boss gameplay: HP, aggro, phases, attacks and death.
  // No demo player/camera/renderer/map is used.
  // ------------------------------------------------------------

  // ------------------------------------------------------------
  let initialYaw=
    Number(
      CFG.spawnYaw
    )||0;

  let state=
    STATES.DORMANT;

  let insideActivationRadius=false;

  // V91 — FIRST BOSS SCHEDULE
  // The normal survival night used by the rest of the game is 19:00 -> 05:48.
  // Ignis is hidden on Nights 1–4 and is released on Night 5. Once released,
  // the encounter stays active until he is defeated instead of disappearing at
  // sunrise mid-fight.
  let scheduledEncounterSpawned=false;
  let scheduledEncounterAnnounced=false;

  function currentSurvivalDay(){
    return Math.max(
      1,
      Math.floor(
        Number(game.dayNight?.day)||1
      )
    );
  }

  function isSurvivalNight(){
    const h=
      Number(game.dayNight?.hour)||0;

    return h>=19 || h<5.8;
  }

   function currentSurvivalNight(){const d=currentSurvivalDay(),h=Number(game.dayNight?.hour)||0;return h<5.8?Math.max(1,d-1):d;}

  function scheduledEncounterReady(){
    return (
      !bossDead &&
      state!==STATES.DEAD &&
      currentSurvivalNight()===5 && isSurvivalNight()
    );
  }

  function startScheduledEncounter(force=false){
    if(
      bossDead ||
      state===STATES.DEAD
    )return false;

    if(
      !force &&
      !scheduledEncounterReady()
    )return false;

    if(
      scheduledEncounterSpawned &&
      bossRoot.visible
    )return false;

    scheduledEncounterSpawned=true;
    bossRoot.visible=true;
    insideActivationRadius=false;
    lostTargetTimer=0;
    bossMoveSpeed=0;

    setSpawn(
      CFG.spawnX,
      CFG.spawnZ,
      CFG.spawnYaw
    );

    state=STATES.DORMANT;
    setAction(
      "IDLE",
      1.15
    );

    if(!scheduledEncounterAnnounced){
      scheduledEncounterAnnounced=true;

      const status=
        document.getElementById(
          "status"
        );

      if(status){
        status.textContent=
          `NOITE ${currentSurvivalNight()} • IGNIS, O INTOCADO surgiu`;
      }

      window.dispatchEvent(
        new CustomEvent(
          "game:boss-spawned",
          {
            detail:{
              id:"ignis",
              name:"IGNIS, O INTOCADO",
              day:currentSurvivalDay(),
         survivalNight:currentSurvivalNight(),
              scheduled:!force
            }
          }
        )
      );
    }

    return true;
  }

  let elapsed=0;

  let hp=
    Math.max(
      1,
      Number(CFG.hp)||1200
    );

  let maxHp=hp;
  let bossPhase=1;
  let phaseBlend=0;
  let bossHeat=.30;
  let bossFlash=0;
  let bossFlinch=0;
  let bossFloat=.18;
  let bossDead=false;
  let deathRewarded=false;

  let action="IDLE";
  let actionTime=0;
  let actionDuration=1.5;
  let actionEvents=[];
  let lastAttack="";
  let attackVariant=0;
  let closeTimer=0;
  let heatTimer=0;
  let specialPowerTimer=0;
  let lostTargetTimer=0;

  // V77 mirrors the movement state from the approved debug boss.
  let moveVariant=0;
  let bossMoveSpeed=0;
  let lastMoveDx=0;
  let lastMoveDz=0;

  let lastPlayerDamageAt=0;

  const cooldowns={
    pillars:0,
    fireball:0,
    stream:0,
    solar:0,
    heat:0
  };

  CFG.phase2At=
    Number(
      CFG.phase2At
    )||.50;

  CFG.cooldownMultiplier=
    Number(
      CFG.cooldownMultiplier
    )||1;

  CFG.rangeMultiplier=
    Number(
      CFG.rangeMultiplier
    )||1;

  CFG.xpReward=
    Number(
      CFG.xpReward
    )||650;

  CFG.damage=Object.assign({
    pillar:22,
    ball:18,
    fire:7,
    stream:26,
    heat:16,
    solar:55,
    transitionBlast:14
  },CFG.damage||{});

  const combatScale=
    playerHeight/
    1.76;

  // ------------------------------------------------------------
  // Boss HUD.
  // ------------------------------------------------------------
  const bossUiStyle=
    document.createElement(
      "style"
    );

  bossUiStyle.id=
    "ignisBossStyleV74";

  bossUiStyle.textContent=`
    #ignisBossHudV74{
      position:fixed;
      left:50%;
      top:max(12px,env(safe-area-inset-top));
      transform:translateX(-50%);
      width:min(620px,76vw);
      z-index:64;
      pointer-events:none;
      opacity:0;
      transition:opacity .22s ease;
      color:#ffe7cb;
      text-align:center;
      font-family:system-ui,sans-serif;
      text-shadow:0 2px 8px #000;
    }
    #ignisBossHudV74.show{opacity:1}
    #ignisBossHudV74 .ignis-name{
      font-size:clamp(13px,1.55vw,20px);
      font-weight:900;
      letter-spacing:.13em;
    }
    #ignisBossHudV74 .ignis-meta{
      margin-top:2px;
      font-size:11px;
      color:#ffbb72;
    }
    #ignisBossHudV74 .ignis-track{
      height:13px;
      margin-top:6px;
      background:rgba(7,3,2,.78);
      border:1px solid rgba(255,124,38,.60);
      border-radius:999px;
      padding:2px;
      box-shadow:
        0 0 18px rgba(255,69,10,.23),
        inset 0 0 10px #000;
    }
    #ignisBossHudV74 .ignis-fill{
      height:100%;
      width:100%;
      border-radius:999px;
      background:
        linear-gradient(
          90deg,
          #8f1606,
          #ff3f0b 46%,
          #ffb12d
        );
      box-shadow:
        0 0 12px rgba(255,70,10,.72);
      transition:width .12s linear;
    }
    #ignisWarningV74{
      position:fixed;
      left:50%;
      top:31%;
      transform:translate(-50%,-50%);
      z-index:65;
      pointer-events:none;
      color:#ff6a20;
      font:900 clamp(25px,5vw,56px)/1 system-ui,sans-serif;
      text-shadow:
        0 0 12px #ff6a20,
        0 3px 10px #000;
      opacity:0;
      transition:opacity .12s linear;
    }
    #ignisWarningV74.show{opacity:1}
  `;

  document.head.append(
    bossUiStyle
  );

  const bossHud=
    document.createElement(
      "div"
    );

  bossHud.id=
    "ignisBossHudV74";

  bossHud.innerHTML=`
    <div class="ignis-name">IGNIS, O INTOCADO</div>
    <div class="ignis-meta" id="ignisMetaV74">FASE 1</div>
    <div class="ignis-track">
      <div class="ignis-fill" id="ignisFillV74"></div>
    </div>
  `;

  document.body.append(
    bossHud
  );

  const bossFill=
    bossHud.querySelector(
      "#ignisFillV74"
    );

  const bossMeta=
    bossHud.querySelector(
      "#ignisMetaV74"
    );

  const warning=
    document.createElement(
      "div"
    );

  warning.id=
    "ignisWarningV74";

  document.body.append(
    warning
  );

  // V75 — cinematic atmosphere from the approved debug reference.
  const solarAtmosphereStyle=
    document.createElement(
      "style"
    );

  solarAtmosphereStyle.id=
    "ignisSolarAtmosphereStyleV75";

  solarAtmosphereStyle.textContent=`
    #ignisSolarDimV75,
    #ignisSolarFlashV75{
      position:fixed;
      inset:0;
      pointer-events:none;
      opacity:0;
      transition:opacity .06s linear;
    }

    #ignisSolarDimV75{
      z-index:24;
      --sx:50%;
      --sy:48%;
      background:
        radial-gradient(
          circle at var(--sx) var(--sy),
          rgba(20,0,0,.10) 0%,
          rgba(0,0,0,.22) 24%,
          rgba(0,0,0,.66) 67%,
          rgba(0,0,0,.82) 100%
        );
    }

    #ignisSolarFlashV75{
      z-index:25;
      background:
        radial-gradient(
          circle at var(--sx,50%) var(--sy,48%),
          rgba(255,255,225,1) 0%,
          rgba(255,205,90,.98) 21%,
          rgba(255,95,15,.82) 52%,
          rgba(255,35,0,.22) 78%,
          rgba(255,0,0,0) 100%
        );
      mix-blend-mode:screen;
    }
  `;

  document.head.append(
    solarAtmosphereStyle
  );

  const solarDimOverlay=
    document.createElement(
      "div"
    );

  solarDimOverlay.id=
    "ignisSolarDimV75";

  document.body.append(
    solarDimOverlay
  );

  const solarFlashOverlay=
    document.createElement(
      "div"
    );

  solarFlashOverlay.id=
    "ignisSolarFlashV75";

  document.body.append(
    solarFlashOverlay
  );

  let solarBaseExposure=null;
  let solarFlashAmount=0;

  function updateSolarScreenOrigin(){
    if(!bossRoot.visible)return;

    tmpC.copy(
      bossRoot.position
    );

    tmpC.y+=
      targetHeight*.60;

    tmpC.project(
      game.camera
    );

    const x=
      clamp(
        (
          tmpC.x*.5+
          .5
        )*100,
        0,100
      );

    const y=
      clamp(
        (
          -.5*tmpC.y+
          .5
        )*100,
        0,100
      );

    for(const el of[
      solarDimOverlay,
      solarFlashOverlay
    ]){
      el.style.setProperty(
        "--sx",
        `${x}%`
      );

      el.style.setProperty(
        "--sy",
        `${y}%`
      );
    }
  }

  function setSolarDarkness(k){
    k=
      clamp(
        k,
        0,1
      );

    solarDimOverlay.style.opacity=
      String(
        .86*k
      );

    if(
      solarBaseExposure==null
    ){
      solarBaseExposure=
        Number(
          game.renderer
            .toneMappingExposure
        )||1;
    }

    game.renderer
      .toneMappingExposure=
        lerp(
          solarBaseExposure,
          solarBaseExposure*.30,
          k
        );
  }

  function setSolarFlash(k){
    solarFlashAmount=
      clamp(
        k,
        0,1
      );

    solarFlashOverlay.style.opacity=
      String(
        solarFlashAmount
      );
  }

  function resetSolarAtmosphere(){
    solarDimOverlay.style.opacity="0";
    solarFlashOverlay.style.opacity="0";
    solarFlashAmount=0;

    if(
      solarBaseExposure!=null
    ){
      game.renderer
        .toneMappingExposure=
          solarBaseExposure;

      solarBaseExposure=null;
    }
  }

  let lastHudAt=0;
  let warningText="";

  function setWarning(text=""){
    warningText=
      String(text||"");

    warning.textContent=
      warningText;

    warning.classList.toggle(
      "show",
      !!warningText
    );
  }

  function updateBossHud(
    now=performance.now(),
    force=false
  ){
    if(
      !force &&
      now-lastHudAt<100
    )return;

    lastHudAt=now;

    const visible=
      (
        state===STATES.AGGRO ||
        state===STATES.COMBAT ||
        state===STATES.TRANSITION ||
        state===STATES.DEAD
      ) &&
      (
        !bossDead ||
        actionTime<5.5
      );

    bossHud.classList.toggle(
      "show",
      visible
    );

    bossFill.style.width=
      `${Math.max(
        0,
        hp/maxHp*100
      )}%`;

    bossFill.style.background=
      bossPhase>1
        ?"linear-gradient(90deg,#b50f03,#ff4d00 35%,#ffd05b)"
        :"linear-gradient(90deg,#7f1305,#e93a0b 55%,#ff8b25)";

    bossMeta.textContent=
      `FASE ${bossPhase} • ${
        state===STATES.TRANSITION
          ?"DESPERTANDO"
          :state===STATES.DEAD
            ?"DERROTADO"
            :action.replaceAll("_"," ")
      }`;
  }

  // ------------------------------------------------------------
  // Small boss-only audio cues.
  // ------------------------------------------------------------
  let bossAudioCtx=null;

  function bossSfx(
    frequency=70,
    duration=.25,
    volume=.06
  ){
    try{
      const AC=
        window.AudioContext||
        window.webkitAudioContext;

      if(!AC)return;

      bossAudioCtx=
        bossAudioCtx||
        new AC();

      const ctx=bossAudioCtx;
      ctx.resume?.().catch(()=>{});

      const osc=
        ctx.createOscillator();

      const gain=
        ctx.createGain();

      osc.type=
        frequency<100
          ?"sawtooth"
          :"triangle";

      const t=
        ctx.currentTime;

      osc.frequency.setValueAtTime(
        frequency*1.8,
        t
      );

      osc.frequency.exponentialRampToValueAtTime(
        Math.max(
          20,
          frequency*.5
        ),
        t+duration
      );

      gain.gain.setValueAtTime(
        volume,
        t
      );

      gain.gain.exponentialRampToValueAtTime(
        .001,
        t+duration
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(
        t+duration
      );
    }catch{}
  }

  // ------------------------------------------------------------
  // World collision / LOS against the REAL forest and placed logs.
  // ------------------------------------------------------------
  function segmentPointDistanceXZ(
    px,pz,
    ax,az,
    bx,bz
  ){
    const abx=bx-ax;
    const abz=bz-az;
    const ab2=
      abx*abx+
      abz*abz;

    let t=0;

    if(ab2>.000001){
      t=
        clamp(
          (
            (px-ax)*abx+
            (pz-az)*abz
          )/
          ab2,
          0,1
        );
    }

    const cx=
      ax+
      abx*t;

    const cz=
      az+
      abz*t;

    return Math.hypot(
      px-cx,
      pz-cz
    );
  }

  function getLogSegment(mesh){
    if(
      !mesh?.parent ||
      mesh.visible===false
    )return null;

    const len=
      Math.max(
        .4,
        Number(
          mesh.userData.length
        )||3
      );

    const rad=
      Math.max(
        .10,
        Number(
          mesh.userData.radius
        )||.22
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

    return {
      a,b,rad
    };
  }

  function treeList(){
    return (
      window.gameLumber?.trees||
      []
    );
  }

  function logList(){
    return (
      window.gameLumber?.placedLogs||
      []
    );
  }

  function pointBlockedByWorld(
    x,z,
    radius=.2
  ){
    for(const tree of treeList()){
      if(
        tree.picked ||
        tree.fallen
      )continue;

      const p=
        tree.base||
        tree.center;

      if(!p)continue;

      const tr=
        Math.max(
          .18,
          Number(
            tree.radiusBottom
          )||.42
        );

      if(
        Math.hypot(
          x-p.x,
          z-p.z
        )<
        tr+radius
      ){
        return true;
      }
    }

    for(const mesh of logList()){
      const seg=
        getLogSegment(mesh);

      if(!seg)continue;

      if(
        segmentPointDistanceXZ(
          x,z,
          seg.a.x,
          seg.a.z,
          seg.b.x,
          seg.b.z
        )<
        seg.rad+radius
      ){
        return true;
      }
    }

    return false;
  }

  // ------------------------------------------------------------
  // V75 — real forest reaction.
  // Replicates the spring-like tree response from the debug scene, but uses
  // the REAL forest instanced trees instead of importing debug trees.
  // ------------------------------------------------------------
  const forestInstanced=[];

  scene.traverse(o=>{
    if(o?.isInstancedMesh){
      forestInstanced.push(o);
    }
  });

  const forestTrunkMesh=
    forestInstanced.find(
      o=>
        o.count===220 &&
        (
          o.geometry
            ?.parameters
            ?.height||
          0
        )>6
    )||null;

  const forestFoliageMesh=
    forestInstanced.find(
      o=>
        o.count===660
    )||null;

  const foliageOriginalMatrices=[];

  if(forestFoliageMesh){
    const mm=
      new THREE.Matrix4();

    for(
      let i=0;
      i<forestFoliageMesh.count;
      i++
    ){
      forestFoliageMesh
        .getMatrixAt(
          i,
          mm
        );

      foliageOriginalMatrices.push(
        mm.clone()
      );
    }
  }

  const treeSprings=
    new Map();

  const treeTempInv=
    new THREE.Matrix4();

  const treeTempWorld=
    new THREE.Matrix4();

  const treeTempBent=
    new THREE.Matrix4();

  const treeTempLocal=
    new THREE.Matrix4();

  const treeTempT1=
    new THREE.Matrix4();

  const treeTempT2=
    new THREE.Matrix4();

  const treeTempRot=
    new THREE.Matrix4();

  const treeTempEuler=
    new THREE.Euler();

  function setBentInstance(
    mesh,
    index,
    originalLocal,
    base,
    rx,
    rz
  ){
    if(
      !mesh ||
      !originalLocal
    )return;

    mesh.updateWorldMatrix?.(
      true,
      false
    );

    treeTempInv
      .copy(
        mesh.matrixWorld
      )
      .invert();

    treeTempWorld
      .multiplyMatrices(
        mesh.matrixWorld,
        originalLocal
      );

    treeTempEuler.set(
      rx,
      0,
      rz,
      "XYZ"
    );

    treeTempRot
      .makeRotationFromEuler(
        treeTempEuler
      );

    treeTempT1
      .makeTranslation(
        base.x,
        base.y,
        base.z
      );

    treeTempT2
      .makeTranslation(
        -base.x,
        -base.y,
        -base.z
      );

    treeTempBent
      .copy(
        treeTempT1
      )
      .multiply(
        treeTempRot
      )
      .multiply(
        treeTempT2
      )
      .multiply(
        treeTempWorld
      );

    treeTempLocal
      .multiplyMatrices(
        treeTempInv,
        treeTempBent
      );

    mesh.setMatrixAt(
      index,
      treeTempLocal
    );
  }

  // One draw call for leaf/debris response.
  const LEAF_MAX=900;

  const leafPos=
    new Float32Array(
      LEAF_MAX*3
    );

  const leafVel=
    new Float32Array(
      LEAF_MAX*3
    );

  const leafSize=
    new Float32Array(
      LEAF_MAX
    );

  const leafColor=
    new Float32Array(
      LEAF_MAX*4
    );

  const leafAge=
    new Float32Array(
      LEAF_MAX
    );

  const leafLife=
    new Float32Array(
      LEAF_MAX
    );

  let leafHead=0;

  const leafGeometry=
    new THREE.BufferGeometry();

  leafGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(
      leafPos,
      3
    )
  );

  leafGeometry.setAttribute(
    "aS",
    new THREE.BufferAttribute(
      leafSize,
      1
    )
  );

  leafGeometry.setAttribute(
    "aC",
    new THREE.BufferAttribute(
      leafColor,
      4
    )
  );

  const leafMaterial=
    new THREE.ShaderMaterial({
      uniforms:{
        uK:{
          value:
            fireMaterial
              .uniforms
              .uK
              .value
        }
      },

      transparent:true,
      depthWrite:false,

      vertexShader:`
        attribute float aS;
        attribute vec4 aC;
        varying vec4 vC;
        uniform float uK;

        void main(){
          vC=aC;

          vec4 m=
            modelViewMatrix*
            vec4(
              position,
              1.
            );

          gl_PointSize=
            aS*
            uK/
            -m.z;

          gl_Position=
            projectionMatrix*
            m;
        }
      `,

      fragmentShader:`
        varying vec4 vC;

        void main(){
          vec2 p=
            gl_PointCoord-.5;

          float d=
            length(
              vec2(
                p.x*.72,
                p.y*1.7
              )
            )*
            2.;

          if(d>1.)discard;

          gl_FragColor=
            vec4(
              vC.rgb,
              vC.a*
              (
                1.-d
              )
            );
        }
      `
    });

  const leafPoints=
    new THREE.Points(
      leafGeometry,
      leafMaterial
    );

  leafPoints.name=
    "Ignis_Forest_Debris";

  leafPoints.frustumCulled=false;
  scene.add(leafPoints);

  function emitLeaf(
    x,y,z,
    vx,vy,vz,
    size,
    life,
    warm=false
  ){
    leafHead=
      (
        leafHead+1
      )%
      LEAF_MAX;

    const i=leafHead;

    leafPos[i*3]=x;
    leafPos[i*3+1]=y;
    leafPos[i*3+2]=z;

    leafVel[i*3]=vx;
    leafVel[i*3+1]=vy;
    leafVel[i*3+2]=vz;

    leafSize[i]=size;
    leafLife[i]=life;
    leafAge[i]=0;

    if(warm){
      leafColor[i*4]=.44;
      leafColor[i*4+1]=.22;
      leafColor[i*4+2]=.07;
    }else{
      leafColor[i*4]=.22;
      leafColor[i*4+1]=.42;
      leafColor[i*4+2]=.12;
    }

    leafColor[i*4+3]=1;
  }

  function emitTreeLeaves(
    tree,
    nx,
    nz,
    force,
    warm=false
  ){
    if(!tree?.top)return;

    const count=
      Math.min(
        14,
        Math.ceil(
          force*7
        )
      );

    for(let i=0;i<count;i++){
      emitLeaf(
        tree.top.x+
        randomRange(
          -.65,.65
        ),

        tree.top.y+
        randomRange(
          -.50,.45
        ),

        tree.top.z+
        randomRange(
          -.65,.65
        ),

        nx*
        force*
        randomRange(
          1.2,3.5
        )+
        randomRange(
          -.8,.8
        ),

        randomRange(
          .2,2.1
        ),

        nz*
        force*
        randomRange(
          1.2,3.5
        )+
        randomRange(
          -.8,.8
        ),

        randomRange(
          .08,.16
        ),

        randomRange(
          .9,2.2
        ),

        warm
      );
    }
  }

  function updateLeafDebris(dt){
    leafMaterial
      .uniforms
      .uK
      .value=
        fireMaterial
          .uniforms
          .uK
          .value;

    for(
      let i=0;
      i<LEAF_MAX;
      i++
    ){
      const life=
        leafLife[i];

      if(life<=0){
        leafSize[i]=0;
        continue;
      }

      leafAge[i]+=dt;

      const t=
        leafAge[i]/
        life;

      if(t>=1){
        leafLife[i]=0;
        leafSize[i]=0;
        continue;
      }

      leafVel[i*3+1]-=
        2.3*
        dt;

      const drag=
        Math.max(
          0,
          1-
          1.2*dt
        );

      leafVel[i*3]*=drag;
      leafVel[i*3+2]*=drag;

      leafPos[i*3]+=
        leafVel[i*3]*
        dt;

      leafPos[i*3+1]+=
        leafVel[i*3+1]*
        dt;

      leafPos[i*3+2]+=
        leafVel[i*3+2]*
        dt;

      leafColor[i*4+3]=
        Math.pow(
          1-t,
          1.1
        );
    }

    leafGeometry
      .attributes
      .position
      .needsUpdate=true;

    leafGeometry
      .attributes
      .aS
      .needsUpdate=true;

    leafGeometry
      .attributes
      .aC
      .needsUpdate=true;
  }

  function impulseTree(
    tree,
    nx,
    nz,
    force,
    warm=false
  ){
    if(
      !tree ||
      tree.converted ||
      tree.falling ||
      tree.fallen ||
      tree.picked
    )return;

    let spring=
      treeSprings.get(
        tree.index
      );

    if(!spring){
      spring={
        ax:0,
        az:0,
        vx:0,
        vz:0
      };

      treeSprings.set(
        tree.index,
        spring
      );
    }

    // Same spring character as the approved debug implementation.
    spring.vx+=
      nz*
      force*
      2.2;

    spring.vz-=
      nx*
      force*
      2.2;

    spring.vx=
      clamp(
        spring.vx,
        -3.4,
        3.4
      );

    spring.vz=
      clamp(
        spring.vz,
        -3.4,
        3.4
      );

    if(force>.25){
      emitTreeLeaves(
        tree,
        nx,
        nz,
        force,
        warm
      );
    }
  }

  function impulseForest(
    x,z,
    radius,
    strength,
    warm=false
  ){
    for(const tree of treeList()){
      if(
        tree.converted ||
        tree.falling ||
        tree.fallen ||
        tree.picked
      )continue;

      const p=
        tree.base||
        tree.center;

      if(!p)continue;

      const dx=
        p.x-x;

      const dz=
        p.z-z;

      const d=
        Math.hypot(
          dx,dz
        );

      if(
        d<=.001 ||
        d>radius
      )continue;

      const f=
        (
          1-
          d/radius
        )*
        strength;

      impulseTree(
        tree,
        dx/d,
        dz/d,
        f,
        warm
      );
    }
  }

  function reactForestToWave(
    wave,
    warm=false
  ){
    if(!wave.treeHits){
      wave.treeHits=
        new Set();
    }

    const band=
      1.35*
      combatScale;

    for(const tree of treeList()){
      if(
        wave.treeHits.has(
          tree.index
        ) ||
        tree.converted ||
        tree.falling ||
        tree.fallen ||
        tree.picked
      ){
        continue;
      }

      const p=
        tree.base||
        tree.center;

      if(!p)continue;

      const dx=
        p.x-wave.x;

      const dz=
        p.z-wave.z;

      const d=
        Math.hypot(
          dx,dz
        );

      if(
        Math.abs(
          d-wave.radius
        )>
        band
      ){
        continue;
      }

      wave.treeHits.add(
        tree.index
      );

      const falloff=
        clamp(
          1-
          d/
          Math.max(
            1,
            wave.max
          ),
          .10,
          1
        );

      const force=
        (
          wave.treeStrength||
          .85
        )*
        falloff;

      impulseTree(
        tree,
        dx/
        Math.max(
          .001,d
        ),
        dz/
        Math.max(
          .001,d
        ),
        force,
        warm
      );
    }
  }

  function updateForestReaction(dt){
    if(
      !forestTrunkMesh ||
      !forestFoliageMesh
    ){
      updateLeafDebris(dt);
      return;
    }

    let changed=false;

    for(
      const [
        treeIndex,
        spring
      ] of
      [...treeSprings.entries()]
    ){
      const tree=
        treeList()[treeIndex];

      if(!tree){
        treeSprings.delete(
          treeIndex
        );
        continue;
      }

      if(
        tree.converted ||
        tree.falling ||
        tree.fallen ||
        tree.picked
      ){
        // The lumber system now owns those instance matrices.
        treeSprings.delete(
          treeIndex
        );
        continue;
      }

      spring.vx+=
        (
          -9*
          spring.ax-
          1.6*
          spring.vx
        )*
        dt;

      spring.vz+=
        (
          -9*
          spring.az-
          1.6*
          spring.vz
        )*
        dt;

      spring.ax+=
        spring.vx*
        dt;

      spring.az+=
        spring.vz*
        dt;

      spring.ax=
        clamp(
          spring.ax,
          -.72,.72
        );

      spring.az=
        clamp(
          spring.az,
          -.72,.72
        );

      const settled=
        Math.abs(
          spring.ax
        )<.0015 &&
        Math.abs(
          spring.az
        )<.0015 &&
        Math.abs(
          spring.vx
        )<.008 &&
        Math.abs(
          spring.vz
        )<.008;

      if(settled){
        forestTrunkMesh
          .setMatrixAt(
            tree.index,
            tree.originalMatrix
          );

        for(let k=0;k<3;k++){
          const fi=
            tree.index*3+k;

          const fm=
            foliageOriginalMatrices[
              fi
            ];

          if(fm){
            forestFoliageMesh
              .setMatrixAt(
                fi,
                fm
              );
          }
        }

        treeSprings.delete(
          treeIndex
        );

        changed=true;
        continue;
      }

      setBentInstance(
        forestTrunkMesh,
        tree.index,
        tree.originalMatrix,
        tree.base,
        spring.ax,
        spring.az
      );

      for(let k=0;k<3;k++){
        const fi=
          tree.index*3+k;

        const fm=
          foliageOriginalMatrices[
            fi
          ];

        if(fm){
          setBentInstance(
            forestFoliageMesh,
            fi,
            fm,
            tree.base,
            spring.ax,
            spring.az
          );
        }
      }

      changed=true;
    }

    if(changed){
      forestTrunkMesh
        .instanceMatrix
        .needsUpdate=true;

      forestFoliageMesh
        .instanceMatrix
        .needsUpdate=true;
    }

    updateLeafDebris(dt);
  }

  function lineOfSight(
    ax,az,
    bx,bz
  ){
    for(const tree of treeList()){
      if(
        tree.picked ||
        tree.fallen
      )continue;

      const p=
        tree.base||
        tree.center;

      if(!p)continue;

      const tr=
        Math.max(
          .18,
          Number(
            tree.radiusBottom
          )||.42
        );

      if(
        segmentPointDistanceXZ(
          p.x,p.z,
          ax,az,
          bx,bz
        )<
        tr+.16
      ){
        return false;
      }
    }

    for(const mesh of logList()){
      const seg=
        getLogSegment(mesh);

      if(!seg)continue;

      const d1=
        segmentPointDistanceXZ(
          seg.a.x,
          seg.a.z,
          ax,az,
          bx,bz
        );

      const d2=
        segmentPointDistanceXZ(
          seg.b.x,
          seg.b.z,
          ax,az,
          bx,bz
        );

      if(
        Math.min(
          d1,d2
        )<
        seg.rad+.14
      ){
        return false;
      }
    }

    return true;
  }

  // ------------------------------------------------------------
  // Boss-only reusable effect pools.
  // ------------------------------------------------------------
  class BossPool{
    constructor(make,count){
      this.free=[];
      this.all=[];

      for(
        let i=0;
        i<count;
        i++
      ){
        const obj=make();
        obj.visible=false;
        scene.add(obj);
        this.all.push(obj);
        this.free.push(obj);
      }
    }

    get(){
      const obj=
        this.free.pop();

      if(obj){
        obj.visible=true;
      }

      return obj||null;
    }

    release(obj){
      if(
        !obj ||
        !obj.visible
      )return;

      obj.visible=false;
      this.free.push(obj);
    }

    releaseAll(){
      for(const obj of this.all){
        this.release(obj);
      }
    }
  }

  function additiveMaterial(
    color,
    opacity=.9
  ){
    return new THREE.MeshBasicMaterial({
      color,
      transparent:true,
      opacity,
      depthWrite:false,
      side:THREE.DoubleSide,
      blending:
        THREE.AdditiveBlending,
      toneMapped:false
    });
  }

  const groundDiscGeometry=
    new THREE.CircleGeometry(
      1,28
    )
    .rotateX(
      -Math.PI/2
    );

  const fireColumnGeometry=
    new THREE.CylinderGeometry(
      1,1,1,12,1,true
    )
    .translate(
      0,.5,0
    );

  const fireSphereGeometry=
    new THREE.SphereGeometry(
      1,14,10
    );

  const ringGeometry=
    new THREE.RingGeometry(
      .90,1,42
    )
    .rotateX(
      -Math.PI/2
    );

  const streamGeometry=
    new THREE.CircleGeometry(
      1,26,
      -Math.PI/2-.31,
      .62
    )
    .rotateX(
      -Math.PI/2
    );

  const telegraphPool=
    new BossPool(
      ()=>new THREE.Mesh(
        groundDiscGeometry,
        additiveMaterial(
          0xff3a10,
          .45
        )
      ),
      52
    );

  const columnPool=
    new BossPool(
      ()=>new THREE.Mesh(
        fireColumnGeometry,
        additiveMaterial(
          0xff7a20,
          .88
        )
      ),
      42
    );

  const orbPool=
    new BossPool(
      ()=>{
        const g=
          new THREE.Group();

        const outer=
          new THREE.Mesh(
            fireSphereGeometry,
            additiveMaterial(
              0xff4a08,
              .78
            )
          );

        const core=
          new THREE.Mesh(
            fireSphereGeometry,
            additiveMaterial(
              0xfff0a0,
              .95
            )
          );

        core.scale.setScalar(
          .52
        );

        g.add(
          outer,
          core
        );

        return g;
      },
      14
    );

  const explosionPool=
    new BossPool(
      ()=>new THREE.Mesh(
        fireSphereGeometry,
        additiveMaterial(
          0xff8a30,
          .80
        )
      ),
      8
    );

  const groundFirePool=
    new BossPool(
      ()=>new THREE.Mesh(
        groundDiscGeometry,
        additiveMaterial(
          0xff4a10,
          .55
        )
      ),
      14
    );

  const ringPool=
    new BossPool(
      ()=>new THREE.Mesh(
        ringGeometry,
        additiveMaterial(
          0xffb060,
          .88
        )
      ),
      5
    );

  const streamPool=
    new BossPool(
      ()=>new THREE.Mesh(
        streamGeometry,
        additiveMaterial(
          0xff3a10,
          .22
        )
      ),
      2
    );

  const livePillars=[];
  const liveOrbs=[];
  const liveExplosions=[];
  const liveGroundFire=[];
  const liveRings=[];

  let liveStream=null;
  let liveSolar=null;

  const flashLight=
    new THREE.PointLight(
      0xffaa55,
      0,
      52,
      1.3
    );

  flashLight.name=
    "Ignis_Attack_Flash";

  scene.add(
    flashLight
  );

  const deathCore=
    new THREE.Mesh(
      new THREE.IcosahedronGeometry(
        .35,1
      ),
      new THREE.MeshBasicMaterial({
        color:0xff7020,
        toneMapped:false
      })
    );

  deathCore.name=
    "Ignis_Death_Core";

  deathCore.visible=false;
  scene.add(
    deathCore
  );

  function randomRange(a,b){
    return a+
      Math.random()*
      (
        b-a
      );
  }

  function burst(
    position,
    count=12,
    speed=5,
    size=.38
  ){
    const n=
      Math.min(
        count,
        70
      );

    for(let i=0;i<n;i++){
      let dx=
        Math.random()-.5;

      let dy=
        Math.random()*.9;

      let dz=
        Math.random()-.5;

      const len=
        Math.hypot(
          dx,dy,dz
        )||1;

      dx/=len;
      dy/=len;
      dz/=len;

      const sp=
        speed*
        randomRange(
          .3,1
        );

      emitFire(
        position.x,
        position.y,
        position.z,

        dx*sp,
        dy*sp,
        dz*sp,

        size*
        randomRange(
          .8,1.25
        ),

        .03,

        randomRange(
          .55,1.05
        )
      );
    }
  }

  function playerWorldHeight(){
    return game.groundY(
      player.x,
      player.z
    );
  }

  function playerChest(
    out=new THREE.Vector3()
  ){
    return out.set(
      player.x,
      playerWorldHeight()+
      playerHeight*.58,
      player.z
    );
  }

  function damageRealPlayer(
    amount,
    source,
    sourceId
  ){
    const now=
      performance.now();

    // Boss attack-specific micro guard prevents an attack from calling the
    // game health API several times in the same render frame.
    if(
      now-lastPlayerDamageAt<
      90
    )return false;

    lastPlayerDamageAt=now;

    const ok=
      window.gameZombie
        ?.hurtPlayer?.(
          amount,
          source,
          sourceId
        );

    return !!ok;
  }

  function emitGroundSparks(
    x,z,
    radius,
    count
  ){
    const ground=
      game.groundY(
        x,z
      );

    for(
      let i=0;
      i<count;
      i++
    ){
      const a=
        Math.random()*
        Math.PI*2;

      const d=
        Math.sqrt(
          Math.random()
        )*
        radius;

      emitFire(
        x+
        Math.cos(a)*d,
        ground+.06,
        z+
        Math.sin(a)*d,

        randomRange(
          -.35,.35
        ),
        randomRange(
          .7,2.4
        ),
        randomRange(
          -.35,.35
        ),

        .22,
        .03,
        randomRange(
          .4,.9
        )
      );
    }
  }

  function setAction(
    next,
    duration,
    events=[]
  ){
    action=
      next;

    actionTime=0;
    actionDuration=
      Math.max(
        .01,
        duration
      );

    actionEvents=
      events.map(
        e=>({
          at:e.at,
          fn:e.fn,
          done:false
        })
      );
  }

  function clearBossEffects(){
    for(const q of livePillars){
      telegraphPool.release(q.disc);
      columnPool.release(q.column);
    }

    livePillars.length=0;

    for(const q of liveOrbs){
      orbPool.release(q.mesh);
    }

    liveOrbs.length=0;

    for(const q of liveExplosions){
      explosionPool.release(q.mesh);
    }

    liveExplosions.length=0;

    for(const q of liveGroundFire){
      groundFirePool.release(q.mesh);
    }

    liveGroundFire.length=0;

    for(const q of liveRings){
      ringPool.release(q.mesh);
    }

    liveRings.length=0;

    if(liveStream?.mesh){
      streamPool.release(
        liveStream.mesh
      );
    }

    liveStream=null;

    if(liveSolar?.disc){
      telegraphPool.release(
        liveSolar.disc
      );
    }

    if(liveSolar?.sphere){
      explosionPool.release(
        liveSolar.sphere
      );
    }

    liveSolar=null;

    solarChargeMesh.visible=false;
    resetSolarAtmosphere();

    setWarning("");
  }

  // ------------------------------------------------------------
  // Fire pillars.
  // ------------------------------------------------------------
  function addPillar(
    x,z,
    delay,
    radius,
    height,
    telegraph
  ){
    livePillars.push({
      x,z,
      t:-delay,
      radius,
      height,
      telegraph,
      active:.52,
      hit:false,
      disc:null,
      column:null
    });
  }

  function pillarLine(
    x,z,
    angle,
    count,
    spacing,
    stagger,
    radius,
    height,
    delay=0
  ){
    for(
      let i=0;
      i<count;
      i++
    ){
      addPillar(
        x+
        Math.sin(angle)*
        spacing*
        (
          i+1
        ),

        z+
        Math.cos(angle)*
        spacing*
        (
          i+1
        ),

        delay+
        i*stagger,

        radius,
        height,

        bossPhase>1
          ?.65
          :.90
      );
    }
  }

  function castPillars(){
    const angle=
      Math.atan2(
        player.x-
        bossRoot.position.x,
        player.z-
        bossRoot.position.z
      );

    const variant=
      bossPhase>1
        ?attackVariant++%4
        :attackVariant++%3;

    const spacing=
      (
        bossPhase>1
          ?2.1
          :2.4
      )*
      combatScale*
      CFG.rangeMultiplier;

    const radius=
      (
        bossPhase>1
          ?1.5
          :1.1
      )*
      combatScale;

    const height=
      (
        bossPhase>1
          ?6
          :4.5
      )*
      combatScale;

    const stagger=
      bossPhase>1
        ?.07
        :.12;

    const count=
      Math.max(
        4,
        Math.round(
          (
            bossPhase>1
              ?9
              :7
          )*
          CFG.rangeMultiplier
        )
      );

    if(variant===0){
      pillarLine(
        bossRoot.position.x,
        bossRoot.position.z,
        angle,
        count,
        spacing,
        stagger,
        radius,
        height
      );
    }
    else if(variant===1){
      for(const off of[
        -.38,0,.38
      ]){
        pillarLine(
          bossRoot.position.x,
          bossRoot.position.z,
          angle+off,
          Math.round(
            count*.8
          ),
          spacing,
          stagger,
          radius,
          height
        );
      }
    }
    else if(variant===2){
      pillarLine(
        bossRoot.position.x,
        bossRoot.position.z,
        angle,
        count,
        spacing,
        stagger,
        radius,
        height,
        0
      );

      pillarLine(
        bossRoot.position.x,
        bossRoot.position.z,
        angle+.20,
        count,
        spacing,
        stagger,
        radius,
        height,
        .35
      );

      pillarLine(
        bossRoot.position.x,
        bossRoot.position.z,
        angle-.20,
        count,
        spacing,
        stagger,
        radius,
        height,
        .70
      );
    }
    else{
      const px=player.x;
      const pz=player.z;

      for(let i=0;i<14;i++){
        const a=
          i/14*
          Math.PI*2;

        addPillar(
          px+
          Math.sin(a)*
          5.5*
          combatScale,

          pz+
          Math.cos(a)*
          5.5*
          combatScale,

          i*.09,
          radius,
          height,
          .85
        );
      }

      for(let i=0;i<8;i++){
        const a=
          i/8*
          Math.PI*2;

        addPillar(
          px+
          Math.sin(a)*
          2.6*
          combatScale,

          pz+
          Math.cos(a)*
          2.6*
          combatScale,

          1+
          i*.08,

          radius*.90,
          height,
          .80
        );
      }
    }

    bossSfx(
      60,.5,.075
    );
  }

  function updatePillars(dt){
    for(
      let i=
        livePillars.length-1;
      i>=0;
      i--
    ){
      const q=
        livePillars[i];

      q.t+=dt;

      if(q.t<0)continue;

      const ground=
        game.groundY(
          q.x,q.z
        );

      if(!q.disc){
        q.disc=
          telegraphPool.get();

        if(!q.disc){
          livePillars.splice(
            i,1
          );
          continue;
        }

        q.disc.position.set(
          q.x,
          ground+.035,
          q.z
        );
      }

      if(q.t<q.telegraph){
        const k=
          q.t/
          q.telegraph;

        q.disc.scale.setScalar(
          q.radius*
          (
            .60+
            .50*k
          )
        );

        q.disc.material.opacity=
          .22+
          .48*k*
          (
            .82+
            .18*
            Math.sin(
              q.t*30
            )
          );

        if(Math.random()<dt*12){
          emitGroundSparks(
            q.x,
            q.z,
            q.radius,
            1
          );
        }

        continue;
      }

      const activeTime=
        q.t-
        q.telegraph;

      if(!q.column){
        q.column=
          columnPool.get();

        if(!q.column){
          telegraphPool.release(
            q.disc
          );

          livePillars.splice(
            i,1
          );
          continue;
        }

        q.column.position.set(
          q.x,
          ground,
          q.z
        );

        bossSfx(
          72,.22,.05
        );

        burst(
          new THREE.Vector3(
            q.x,
            ground+.25,
            q.z
          ),
          10,
          5,
          .32
        );
      }

      const rise=
        smoothSeg(
          activeTime,
          0,.12
        );

      const fade=
        1-
        smoothSeg(
          activeTime,
          q.active-.12,
          q.active+.25
        );

      q.column.scale.set(
        q.radius*
        (
          1+
          .15*
          Math.sin(
            activeTime*30
          )
        ),

        q.height*
        rise*
        (
          .4+
          .6*fade
        ),

        q.radius*
        (
          1+
          .15*
          Math.cos(
            activeTime*30
          )
        )
      );

      q.column.material.opacity=
        .88*fade;

      q.disc.scale.setScalar(
        q.radius*1.30
      );

      q.disc.material.opacity=
        .65*fade;

      const particleN=
        Math.min(
          8,
          Math.floor(
            44*
            dt
          )+
          (
            Math.random()<
            44*dt%1
              ?1
              :0
          )
        );

      for(let k=0;k<particleN;k++){
        emitFire(
          q.x+
          randomRange(
            -q.radius*.75,
            q.radius*.75
          ),

          ground+
          randomRange(
            .1,
            q.height*
            Math.max(
              .15,
              rise
            )
          ),

          q.z+
          randomRange(
            -q.radius*.75,
            q.radius*.75
          ),

          randomRange(
            -.5,.5
          ),
          randomRange(
            1,4
          ),
          randomRange(
            -.5,.5
          ),

          .48,
          .08,
          .55
        );
      }

      if(
        !q.hit &&
        activeTime>.05 &&
        activeTime<q.active
      ){
        const d=
          Math.hypot(
            player.x-q.x,
            player.z-q.z
          );

        if(
          d<
          q.radius+.35*
          combatScale
        ){
          q.hit=true;

          damageRealPlayer(
            CFG.damage.pillar*
            (
              bossPhase>1
                ?1.4
                :1
            ),
            "IGNIS • Coluna de Fogo",
            "ignis-pillar"
          );
        }
      }

      if(
        activeTime>=
        q.active+.25
      ){
        telegraphPool.release(
          q.disc
        );

        columnPool.release(
          q.column
        );

        livePillars.splice(
          i,1
        );
      }
    }
  }

  // ------------------------------------------------------------
  // Fireballs + explosion + ground fire.
  // ------------------------------------------------------------
  const tmpA=
    new THREE.Vector3();

  const tmpB=
    new THREE.Vector3();

  const tmpC=
    new THREE.Vector3();

  function launchOrb(
    from,
    direction,
    speed,
    radius,
    big=false,
    split=false
  ){
    const mesh=
      orbPool.get();

    if(!mesh)return;

    mesh.position.copy(
      from
    );

    mesh.scale.setScalar(
      radius
    );

    liveOrbs.push({
      mesh,
      velocity:
        direction
          .clone()
          .normalize()
          .multiplyScalar(
            speed
          ),
      radius,
      life:4,
      big,
      split,
      prev:from.clone()
    });
  }

  function fireballWorldHit(q){
    const p=
      q.mesh.position;

    if(
      p.y<=
      game.groundY(
        p.x,p.z
      )+
      q.radius*.50
    ){
      return true;
    }

    if(
      pointBlockedByWorld(
        p.x,
        p.z,
        q.radius*.72
      )
    ){
      return true;
    }

    return false;
  }

  function fireballHitsPlayer(
    from,
    to,
    radius
  ){
    const px=player.x;
    const pz=player.z;

    const abx=
      to.x-from.x;

    const abz=
      to.z-from.z;

    const ab2=
      abx*abx+
      abz*abz;

    let t=0;

    if(ab2>.000001){
      t=
        clamp(
          (
            (px-from.x)*abx+
            (pz-from.z)*abz
          )/
          ab2,
          0,1
        );
    }

    const x=
      from.x+
      abx*t;

    const z=
      from.z+
      abz*t;

    const horizontal=
      Math.hypot(
        px-x,
        pz-z
      );

    if(
      horizontal>
      radius+.52
    ){
      return false;
    }

    const y=
      from.y+
      (
        to.y-from.y
      )*
      t;

    const gy=
      playerWorldHeight();

    return (
      y>=gy-.2 &&
      y<=gy+playerHeight
    );
  }

  function explodeFireball(
    position,
    radius,
    big,
    split
  ){
    const mesh=
      explosionPool.get();

    if(mesh){
      mesh.position.copy(
        position
      );

      mesh.scale.setScalar(
        .01
      );

      liveExplosions.push({
        mesh,
        t:0,
        radius
      });
    }

    burst(
      position,
      big
        ?38
        :26,
      8,
      big
        ?.66
        :.50
    );

    bossSfx(
      55,.40,.08
    );

    flashLight.position.copy(
      position
    );

    flashLight.intensity=
      Math.max(
        flashLight.intensity,
        big
          ?13
          :8
      );

    const d=
      Math.hypot(
        player.x-position.x,
        player.z-position.z
      );

    if(d<radius){
      damageRealPlayer(
        CFG.damage.ball*
        (
          big
            ?1.5
            :1
        ),
        "IGNIS • Bola de Fogo",
        "ignis-fireball"
      );
    }

    const ground=
      groundFirePool.get();

    if(ground){
      const gy=
        game.groundY(
          position.x,
          position.z
        );

      ground.position.set(
        position.x,
        gy+.035,
        position.z
      );

      liveGroundFire.push({
        mesh:ground,
        x:position.x,
        z:position.z,
        radius:
          radius*.85,
        t:0,
        duration:
          (
            big
              ?8
              :6
          ),
        tick:0
      });
    }

    if(split){
      for(let k=0;k<3;k++){
        const a=
          Math.random()*
          Math.PI*2;

        tmpA.set(
          Math.sin(a),
          .45,
          Math.cos(a)
        )
        .normalize();

        launchOrb(
          new THREE.Vector3(
            position.x,
            game.groundY(
              position.x,
              position.z
            )+
            .9,
            position.z
          ),
          tmpA,
          10*
          combatScale,
          .48*
          combatScale,
          false,
          false
        );
      }
    }
  }

  function updateOrbs(dt){
    for(
      let i=
        liveOrbs.length-1;
      i>=0;
      i--
    ){
      const q=
        liveOrbs[i];

      q.life-=dt;

      q.prev.copy(
        q.mesh.position
      );

      q.mesh.position.addScaledVector(
        q.velocity,
        dt
      );

      q.mesh.rotation.y+=
        dt*4;

      const pulse=
        q.radius*
        (
          1+
          .12*
          Math.sin(
            q.life*30
          )
        );

      q.mesh.scale.setScalar(
        pulse
      );

      if(Math.random()<dt*34){
        emitFire(
          q.mesh.position.x+
          randomRange(
            -.18,.18
          ),
          q.mesh.position.y+
          randomRange(
            -.18,.18
          ),
          q.mesh.position.z+
          randomRange(
            -.18,.18
          ),

          -q.velocity.x*.08+
          randomRange(
            -.8,.8
          ),

          randomRange(
            0,1.4
          ),

          -q.velocity.z*.08+
          randomRange(
            -.8,.8
          ),

          q.radius*.75,
          .04,
          .45
        );
      }

      let hit=
        q.life<=0 ||
        fireballWorldHit(q) ||
        fireballHitsPlayer(
          q.prev,
          q.mesh.position,
          q.radius
        );

      if(hit){
        const p=
          q.mesh.position.clone();

        p.y=
          Math.max(
            game.groundY(
              p.x,p.z
            )+.18,
            p.y
          );

        explodeFireball(
          p,
          q.big
            ?4.6*
             combatScale
            :3.2*
             combatScale,
          q.big,
          q.split
        );

        orbPool.release(
          q.mesh
        );

        liveOrbs.splice(
          i,1
        );
      }
    }
  }

  function updateExplosions(dt){
    for(
      let i=
        liveExplosions.length-1;
      i>=0;
      i--
    ){
      const q=
        liveExplosions[i];

      q.t+=dt;

      const k=
        q.t/.45;

      q.mesh.scale.setScalar(
        q.radius*
        smooth(
          Math.min(
            1,
            k
          )
        )
      );

      for(const child of q.mesh.children||[]){
        child.material.opacity=
          .9*
          (
            1-k
          );
      }

      if(q.mesh.material){
        q.mesh.material.opacity=
          .9*
          (
            1-k
          );
      }

      if(k>=1){
        explosionPool.release(
          q.mesh
        );

        liveExplosions.splice(
          i,1
        );
      }
    }
  }

  function updateGroundFire(dt){
    for(
      let i=
        liveGroundFire.length-1;
      i>=0;
      i--
    ){
      const q=
        liveGroundFire[i];

      q.t+=dt;

      const fade=
        1-
        smoothSeg(
          q.t,
          q.duration-1,
          q.duration
        );

      q.mesh.scale.setScalar(
        q.radius*1.05
      );

      q.mesh.material.opacity=
        .58*fade;

      if(Math.random()<dt*16){
        emitGroundSparks(
          q.x,
          q.z,
          q.radius,
          1
        );
      }

      q.tick-=dt;

      if(
        fade>.2 &&
        q.tick<=0 &&
        Math.hypot(
          player.x-q.x,
          player.z-q.z
        )<
        q.radius
      ){
        q.tick=.55;

        damageRealPlayer(
          CFG.damage.fire,
          "IGNIS • Fogo no Chão",
          "ignis-ground-fire"
        );
      }

      if(q.t>=q.duration){
        groundFirePool.release(
          q.mesh
        );

        liveGroundFire.splice(
          i,1
        );
      }
    }
  }

  // ------------------------------------------------------------
  // Heat wave.
  // ------------------------------------------------------------
  function damageIgnisWaveMonsters(q){
    if(!q||!(q.damage>0))return 0;
    const thickness=1.12*combatScale;
    const source=q.solar?"IGNIS • Onda Solar":"IGNIS • Onda de Calor";
    q.monsterHits=q.monsterHits||new Set();
    let hits=0;
    hits+=window.gameZombie?.damageRing?.(q.x,q.z,q.radius,thickness,q.damage,q.max,source,q.monsterHits)||0;
    hits+=window.gameSpecialCreatures?.damageRing?.(q.x,q.z,q.radius,thickness,q.damage,q.max,source,q.monsterHits)||0;
    hits+=window.gameUndeadForces?.damageRing?.(q.x,q.z,q.radius,thickness,q.damage,q.max,source,q.monsterHits)||0;
    return hits;
  }

  function damageIgnisSolarMonsters(radius,baseDamage){
    const hitSet=new Set();
    const x=bossRoot.position.x,z=bossRoot.position.z;
    let hits=0;
    hits+=window.gameZombie?.damageRadius?.(x,z,radius,baseDamage,"IGNIS • Explosão Solar",hitSet)||0;
    hits+=window.gameSpecialCreatures?.damageRadius?.(x,z,radius,baseDamage,"IGNIS • Explosão Solar",hitSet)||0;
    hits+=window.gameUndeadForces?.damageRadius?.(x,z,radius,baseDamage,"IGNIS • Explosão Solar",hitSet)||0;
    return hits;
  }

  function castHeatWave(
    damage=
      CFG.damage.heat,
    options={}
  ){
    const mesh=
      ringPool.get();

    if(!mesh)return;

    const mesh2=
      ringPool.get();

    const ground=
      game.groundY(
        bossRoot.position.x,
        bossRoot.position.z
      );

    mesh.position.set(
      bossRoot.position.x,
      ground+.10,
      bossRoot.position.z
    );

    if(mesh2){
      mesh2.position.copy(
        mesh.position
      );

      mesh2.material.color.setHex(
        options.solar
          ?0xfff0a8
          :0xff6a18
      );
    }

    liveRings.push({
      mesh,
      mesh2,
      x:bossRoot.position.x,
      z:bossRoot.position.z,
      radius:1,
      hit:false,

      speed:
        options.speed||
        (
          16*
          combatScale*
          CFG.rangeMultiplier
        ),

      max:
        options.max||
        (
          28*
          combatScale*
          CFG.rangeMultiplier
        ),

      damage,

      treeStrength:
        options.treeStrength||
        (
          options.solar
            ?2.15
            :.95
        ),

      solar:
        !!options.solar,

      treeHits:
        new Set(),

      monsterHits:
        new Set()
    });

    bossSfx(
      options.solar
        ?36
        :45,
      .70,
      options.solar
        ?.11
        :.09
    );

    flashLight.position.set(
      bossRoot.position.x,
      ground+1.5,
      bossRoot.position.z
    );

    flashLight.intensity=
      Math.max(
        flashLight.intensity,
        options.solar
          ?18
          :9
      );
  }

  function updateHeatWaves(dt){
    for(
      let i=
        liveRings.length-1;
      i>=0;
      i--
    ){
      const q=
        liveRings[i];

      q.radius+=
        q.speed*
        dt;

      q.mesh.scale.setScalar(
        q.radius
      );

      q.mesh.scale.y=1;

      q.mesh.material.opacity=
        Math.max(
          0,
          1-
          q.radius/q.max
        )*
        (
          q.solar
            ?.92
            :.8
        );

      if(q.mesh2){
        q.mesh2.scale.setScalar(
          q.radius*
          1.035
        );

        q.mesh2.scale.y=1;

        q.mesh2.material.opacity=
          Math.max(
            0,
            1-
            q.radius/q.max
          )*
          (
            q.solar
              ?.65
              :.34
          );
      }

      reactForestToWave(
        q,
        q.solar
      );

      const particles=
        Math.min(
          10,
          Math.floor(
            85*dt
          )+
          (
            Math.random()<
            85*dt%1
              ?1
              :0
          )
        );

      const ground=
        game.groundY(
          q.x,q.z
        );

      for(let k=0;k<particles;k++){
        const a=
          Math.random()*
          Math.PI*2;

        emitFire(
          q.x+
          Math.cos(a)*
          q.radius,
          ground+.18,
          q.z+
          Math.sin(a)*
          q.radius,

          Math.cos(a)*3,
          randomRange(
            .3,2
          ),
          Math.sin(a)*3,

          .42,
          .08,
          .70
        );
      }

      const d=
        Math.hypot(
          player.x-q.x,
          player.z-q.z
        );

      if(
        !q.hit &&
        Math.abs(
          d-q.radius
        )<
        1.10*
        combatScale
      ){
        q.hit=true;

        damageRealPlayer(
          q.damage*
          (
            1-
            .5*
            d/q.max
          ),
          "IGNIS • Onda de Calor",
          "ignis-heat-wave"
        );
      }

      // A mesma frente de calor agora acerta outros monstros ao cruzar por eles.
      // Cada alvo só pode receber este pulso uma vez por onda.
      damageIgnisWaveMonsters(q);

      if(q.radius>q.max){
        ringPool.release(
          q.mesh
        );

        if(q.mesh2){
          ringPool.release(
            q.mesh2
          );
        }

        liveRings.splice(
          i,1
        );
      }
    }
  }

  // ------------------------------------------------------------
  // Fire stream.
  // ------------------------------------------------------------
  function startFireStream(){
    const mesh=
      streamPool.get();

    if(!mesh)return;

    const angle=
      Math.atan2(
        player.x-
        bossRoot.position.x,
        player.z-
        bossRoot.position.z
      );

    liveStream={
      t:0,
      angle,
      sweep:
        Math.random()<.5
          ?-1
          :1,
      telegraph:.90,
      duration:1.70,
      length:
        15*
        combatScale*
        CFG.rangeMultiplier,
      tick:0,
      mesh
    };
  }

  function updateFireStream(dt){
    const s=liveStream;
    if(!s)return;

    s.t+=dt;

    const telegraphing=
      s.t<
      s.telegraph;

    if(
      telegraphing &&
      s.t<.5
    ){
      const desired=
        Math.atan2(
          player.x-
          bossRoot.position.x,
          player.z-
          bossRoot.position.z
        );

      s.angle+=
        angleDiff(
          desired,
          s.angle
        )*
        dt*
        3;
    }

    const angle=
      s.angle+
      (
        telegraphing
          ?0
          :s.sweep*
           (
             s.t-
             s.telegraph-
             s.duration/2
           )*
           .28
      );

    const ground=
      game.groundY(
        bossRoot.position.x,
        bossRoot.position.z
      );

    s.mesh.position.set(
      bossRoot.position.x,
      ground+.055,
      bossRoot.position.z
    );

    s.mesh.rotation.y=
      angle;

    s.mesh.scale.set(
      s.length,
      1,
      s.length
    );

    s.mesh.material.opacity=
      telegraphing
        ?.12+
         .30*
         (
           s.t/
           s.telegraph
         )
        :.11;

    if(!telegraphing){
      const handPos=
        B.haR.getWorldPosition(
          tmpA
        );

      const particleCount=
        Math.min(
          12,
          Math.floor(
            150*dt
          )+
          (
            Math.random()<
            150*dt%1
              ?1
              :0
          )
        );

      for(
        let i=0;
        i<particleCount;
        i++
      ){
        const spread=
          randomRange(
            -.30,.30
          );

        const a=
          angle+
          spread;

        const speed=
          randomRange(
            13,20
          )*
          combatScale;

        emitFire(
          handPos.x,
          handPos.y,
          handPos.z,

          Math.sin(a)*
          speed,

          randomRange(
            -1,2.5
          ),

          Math.cos(a)*
          speed,

          .68*
          combatScale,
          .10,
          randomRange(
            .45,.82
          )
        );
      }

      const dx=
        player.x-
        bossRoot.position.x;

      const dz=
        player.z-
        bossRoot.position.z;

      const d=
        Math.hypot(
          dx,dz
        );

      const playerAngle=
        Math.atan2(
          dx,dz
        );

      const visible=
        lineOfSight(
          bossRoot.position.x,
          bossRoot.position.z,
          player.x,
          player.z
        );

      if(
        d<s.length &&
        Math.abs(
          angleDiff(
            playerAngle,
            angle
          )
        )<
        .30 &&
        d>1 &&
        visible
      ){
        s.tick-=dt;

        if(s.tick<=0){
          s.tick=.32;

          damageRealPlayer(
            CFG.damage.stream*.30,
            "IGNIS • Rajada de Fogo",
            "ignis-fire-stream"
          );
        }
      }
    }

    if(
      s.t>
      s.telegraph+
      s.duration
    ){
      streamPool.release(
        s.mesh
      );

      liveStream=null;
    }
  }

  // ------------------------------------------------------------
  // Solar explosion.
  // ------------------------------------------------------------
  const solarChargeMesh=
    new THREE.Mesh(
      fireSphereGeometry,
      additiveMaterial(
        0xffe89a,
        .9
      )
    );

  solarChargeMesh.name=
    "Ignis_Solar_Charge";

  solarChargeMesh.visible=false;
  scene.add(
    solarChargeMesh
  );

  function startSolar(){
    const disc=
      telegraphPool.get();

    if(!disc)return;

    disc.material.color.setHex(
      0xff2000
    );

    solarBaseExposure=
      Number(
        game.renderer
          .toneMappingExposure
      )||1;

    updateSolarScreenOrigin();
    setSolarDarkness(0);
    setSolarFlash(0);

    solarChargeMesh.visible=true;
    solarChargeMesh.scale.setScalar(
      .08
    );

    liveSolar={
      t:0,
      telegraph:2.8,
      radius:
        15*
        combatScale*
        CFG.rangeMultiplier,
      boom:false,
      disc,
      sphere:null,
      afterRing:false
    };

    setWarning(
      "SAIA!"
    );

    bossSfx(
      40,2,.055
    );
  }

  function updateSolar(dt){
    const s=liveSolar;

    if(!s)return;

    s.t+=dt;

    updateSolarScreenOrigin();

    const ground=
      game.groundY(
        bossRoot.position.x,
        bossRoot.position.z
      );

    if(s.t<s.telegraph){
      const k=
        s.t/
        s.telegraph;

      // This is the missing dimK behavior from the debug scene:
      // the whole forest becomes silhouette-like before the detonation.
      const darkK=
        smooth(
          Math.min(
            1,
            k*2
          )
        );

      setSolarDarkness(
        darkK
      );

      setSolarFlash(0);

      s.disc.position.set(
        bossRoot.position.x,
        ground+.045,
        bossRoot.position.z
      );

      s.disc.scale.setScalar(
        s.radius*
        smooth(
          Math.min(
            1,
            k*1.6
          )
        )
      );

      s.disc.material.opacity=
        .25+
        .55*k*
        (
          .70+
          .30*
          Math.sin(
            s.t*20
          )
        );

      const chest=
        B.chest.getWorldPosition(
          tmpA
        );

      solarChargeMesh.position.copy(
        chest
      );

      const pulse=
        1+
        .12*
        Math.sin(
          s.t*18
        );

      solarChargeMesh.scale.setScalar(
        (
          .18+
          1.55*
          smooth(k)
        )*
        combatScale*
        pulse
      );

      solarChargeMesh.material.opacity=
        .24+
        .70*k;

      const particles=
        Math.min(
          18,
          Math.floor(
            150*dt
          )+
          (
            Math.random()<
            150*dt%1
              ?1
              :0
          )
        );

      // Inward energy particles exactly like the reference:
      // particles are born around Ignis and collapse toward his chest.
      for(let i=0;i<particles;i++){
        const a=
          Math.random()*
          Math.PI*2;

        const d=
          randomRange(
            5,9
          )*
          combatScale;

        const y=
          ground+
          randomRange(
            .3,3
          )*
          combatScale;

        emitFire(
          chest.x+
          Math.cos(a)*d,
          y,
          chest.z+
          Math.sin(a)*d,

          -Math.cos(a)*
          d*
          1.60,

          (
            chest.y-y
          )*
          1.35,

          -Math.sin(a)*
          d*
          1.60,

          .44,
          .045,
          .62
        );
      }

      bossLight.intensity=
        Math.max(
          bossLight.intensity,
          3+
          k*18
        );

      return;
    }

    if(!s.boom){
      s.boom=true;
      setWarning("");

      // Darkness breaks instantly into the white/orange blast.
      setSolarDarkness(0);
      setSolarFlash(1);

      solarChargeMesh.visible=false;

      if(
        solarBaseExposure!=null
      ){
        game.renderer
          .toneMappingExposure=
            solarBaseExposure*
            1.18;
      }

      s.sphere=
        explosionPool.get();

      if(s.sphere){
        s.sphere.position.set(
          bossRoot.position.x,
          ground+
          targetHeight*.56,
          bossRoot.position.z
        );

        s.sphere.scale.setScalar(
          .02
        );
      }

      flashLight.position.set(
        bossRoot.position.x,
        ground+
        targetHeight*.7,
        bossRoot.position.z
      );

      flashLight.intensity=44;

      bossSfx(
        35,1.2,.12
      );

      // Missing environment impulse from the debug scene.
      impulseForest(
        bossRoot.position.x,
        bossRoot.position.z,
        s.radius*1.50,
        2.40,
        true
      );

      // V76 — the part of the forest floor hit by the Solar Explosion is
      // permanently scorched for this play session. The grass system itself
      // removes/shrinks the affected instances and leaves blackened soil.
      window.gameGrassModel
        ?.burnArea?.(
          bossRoot.position.x,
          bossRoot.position.z,
          s.radius*.94,
          1
        );

      // A visible shock front continues through the forest after the flash.
      if(!s.afterRing){
        s.afterRing=true;

        castHeatWave(
          0,
          {
            solar:true,
            speed:
              23*
              combatScale,
            max:
              s.radius*1.65,
            treeStrength:1.75
          }
        );
      }

      const d=
        Math.hypot(
          player.x-
          bossRoot.position.x,

          player.z-
          bossRoot.position.z
        );

      if(d<s.radius){
        damageRealPlayer(
          CFG.damage.solar*
          (
            1-
            .40*
            d/s.radius
          ),
          "IGNIS • Explosão Solar",
          "ignis-solar"
        );
      }

      // Friendly fire intencional do boss: a explosão solar atinge criaturas
      // hostis próximas, mas NÃO ignora a mecânica especial do Gigante da Névoa.
      damageIgnisSolarMonsters(
        s.radius,
        CFG.damage.solar
      );

      burst(
        B.chest.getWorldPosition(
          tmpA
        ),
        120,
        18,
        1.05
      );
    }
    else{
      const t=
        (
          s.t-
          s.telegraph
        )/
        .90;

      // Strong white flash -> orange dome -> glowing embers.
      setSolarFlash(
        1-
        smooth(
          Math.min(
            1,
            t*1.25
          )
        )
      );

      if(s.sphere){
        s.sphere.scale.setScalar(
          s.radius*
          1.08*
          smooth(
            Math.min(
              1,
              t*2
            )
          )
        );

        s.sphere.material.opacity=
          .90*
          (
            1-
            smooth(
              Math.min(
                1,t
              )
            )
          );
      }

      s.disc.material.opacity=
        .72*
        (
          1-
          Math.min(
            1,t
          )
        );

      const outward=
        Math.min(
          26,
          Math.floor(
            230*dt
          )+
          (
            Math.random()<
            230*dt%1
              ?1
              :0
          )
        );

      for(let i=0;i<outward;i++){
        const a=
          Math.random()*
          Math.PI*2;

        const speed=
          randomRange(
            8,18
          )*
          combatScale;

        emitFire(
          bossRoot.position.x,
          ground+
          randomRange(
            .2,2
          )*
          combatScale,
          bossRoot.position.z,

          Math.cos(a)*
          speed,

          randomRange(
            0,3
          ),

          Math.sin(a)*
          speed,

          .82,
          .10,
          .90
        );
      }

      if(t>=1){
        if(s.sphere){
          explosionPool.release(
            s.sphere
          );
        }

        telegraphPool.release(
          s.disc
        );

        liveSolar=null;
        solarChargeMesh.visible=false;
        resetSolarAtmosphere();
      }
    }
  }

  // ------------------------------------------------------------
  // Transition / phase 2 / death.
  // ------------------------------------------------------------
  function transitionBlast(){
    const ground=
      game.groundY(
        bossRoot.position.x,
        bossRoot.position.z
      );

    flashLight.position.set(
      bossRoot.position.x,
      ground+
      targetHeight*.72,
      bossRoot.position.z
    );

    flashLight.intensity=42;

    bossSfx(
      35,1.3,.11
    );

    burst(
      new THREE.Vector3(
        bossRoot.position.x,
        ground+
        targetHeight*.62,
        bossRoot.position.z
      ),
      120,
      18,
      1.0
    );

    window.gameGrassModel
      ?.burnArea?.(
        bossRoot.position.x,
        bossRoot.position.z,
        7.5*
        combatScale,
        .82
      );

    const d=
      Math.hypot(
        player.x-
        bossRoot.position.x,

        player.z-
        bossRoot.position.z
      );

    if(
      d<
      18*
      combatScale
    ){
      damageRealPlayer(
        CFG.damage.transitionBlast,
        "IGNIS • Despertar da Fase 2",
        "ignis-phase2-blast"
      );
    }

    castHeatWave(
      CFG.damage.heat
    );
  }

  function startTransition(){
    if(
      state===STATES.TRANSITION ||
      state===STATES.DEAD
    )return;

    clearBossEffects();

    state=
      STATES.TRANSITION;

    bossPhase=1;
    phaseBlend=0;

    setAction(
      "TRANSITION",
      8,
      [
        {
          at:6.1/8,
          fn:()=>{
            bossPhase=2;
            transitionBlast();
          }
        }
      ]
    );

    setWarning(
      "IGNIS ESTÁ DESPERTANDO"
    );

    updateBossHud(
      performance.now(),
      true
    );
  }

  function startDeath(){
    if(
      state===STATES.DEAD
    )return;

    clearBossEffects();

    state=
      STATES.DEAD;

    bossDead=true;
    hp=0;

    setAction(
      "DEATH",
      7
    );

    setWarning("");

    bossSfx(
      42,1.1,.10
    );

    updateBossHud(
      performance.now(),
      true
    );
  }

  function updateTransition(dt){
    const s=
      actionTime;

    if(s<1){
      bossHeat=
        lerp(
          .30,.06,s
        );
    }
    else if(s<3.3){
      bossHeat=.06;
    }
    else if(s<6.1){
      bossHeat=
        lerp(
          .06,1.5,
          smoothSeg(
            s,3.3,6.1
          )
        );

      const count=
        Math.min(
          9,
          Math.floor(
            (
              35+
              30*
              (
                s-3.3
              )
            )*
            dt
          )
        );

      for(let i=0;i<count;i++){
        const a=
          Math.random()*
          Math.PI*2;

        const d=
          randomRange(
            1,5
          )*
          combatScale;

        const ground=
          game.groundY(
            bossRoot.position.x,
            bossRoot.position.z
          );

        emitFire(
          bossRoot.position.x+
          Math.cos(a)*d,

          ground+.1,

          bossRoot.position.z+
          Math.sin(a)*d,

          0,
          randomRange(
            1,3
          ),
          0,

          .62,
          .05,
          .85
        );
      }
    }
    else{
      phaseBlend+=
        (
          1-
          phaseBlend
        )*
        Math.min(
          1,
          dt*2.5
        );

      bossHeat=
        lerp(
          1.5,
          1,
          smoothSeg(
            s,6.1,7.5
          )
        );

      setWarning("");
    }

    if(actionTime>=7.8){
      bossPhase=2;
      phaseBlend=1;
      state=STATES.COMBAT;
      setAction(
        "IDLE",
        .9
      );
      heatTimer=0;
      closeTimer=0;
      updateBossHud(
        performance.now(),
        true
      );
    }
  }

  function updateDeath(dt){
    const s=
      actionTime;

    bossHeat=
      1.1+
      Math.sin(
        s*14
      )*
      .4*
      (
        1-
        smoothSeg(
          s,0,4
        )
      );

    if(s>1.2){
      const dissolve=
        smoothSeg(
          s,1.2,5
        );

      magmaMaterial
        .uniforms
        .uDis
        .value=
          dissolve;

      const count=
        Math.min(
          10,
          Math.floor(
            (
              30+
              110*dissolve
            )*
            dt
          )
        );

      const crackBones=[
        B.hips,
        B.spine,
        B.chest,
        B.head,
        B.uaL,B.uaR,
        B.faL,B.faR,
        B.thL,B.thR,
        B.shL,B.shR
      ];

      for(let i=0;i<count;i++){
        const source=
          crackBones[
            (
              Math.random()*
              crackBones.length
            )|0
          ];

        source.getWorldPosition(
          tmpA
        );

        emitFire(
          tmpA.x+
          randomRange(
            -.2,.2
          ),
          tmpA.y,
          tmpA.z+
          randomRange(
            -.2,.2
          ),

          randomRange(
            -1.5,1.5
          ),
          randomRange(
            1,4
          ),
          randomRange(
            -1.5,1.5
          ),

          .35,
          .03,
          randomRange(
            1,2.2
          )
        );
      }
    }

    if(
      s>5.1 &&
      bossRoot.visible
    ){
      const ground=
        game.groundY(
          bossRoot.position.x,
          bossRoot.position.z
        );

      bossRoot.visible=false;

      burst(
        new THREE.Vector3(
          bossRoot.position.x,
          ground+
          targetHeight*.60,
          bossRoot.position.z
        ),
        150,
        14,
        1.0
      );

      flashLight.position.set(
        bossRoot.position.x,
        ground+1.2,
        bossRoot.position.z
      );

      flashLight.intensity=30;

      deathCore.position.set(
        bossRoot.position.x,
        ground+.30,
        bossRoot.position.z
      );

      deathCore.visible=true;

      if(!deathRewarded){
        deathRewarded=true;

        window.gameProgression
          ?.dropXP?.(
            CFG.xpReward,
            deathCore.position,
            "IGNIS, O INTOCADO"
          );

        window.dispatchEvent(
          new CustomEvent(
            "game:boss-defeated",
            {
              detail:{
                id:"ignis",
                name:"IGNIS, O INTOCADO",
                xp:CFG.xpReward
              }
            }
          )
        );
      }
    }

    if(deathCore.visible){
      deathCore.rotation.y+=
        dt;

      deathCore.scale.setScalar(
        1+
        .15*
        Math.sin(
          elapsed*3
        )
      );

      if(Math.random()<dt*6){
        emitFire(
          deathCore.position.x+
          randomRange(
            -.12,.12
          ),
          deathCore.position.y+
          .15,
          deathCore.position.z+
          randomRange(
            -.12,.12
          ),

          randomRange(
            -.25,.25
          ),
          randomRange(
            .3,1
          ),
          randomRange(
            -.25,.25
          ),

          .20,.03,1.4
        );
      }
    }
  }

  // ------------------------------------------------------------
  // Boss attacks / AI.
  // ------------------------------------------------------------
  function bossDistance(){
    return Math.hypot(
      player.x-
      bossRoot.position.x,
      player.z-
      bossRoot.position.z
    );
  }

  // V90 pursuit ranges. The old debug AI tried to hold 10u/7u and therefore
  // behaved like a stationary turret. Ignis now closes the gap, then circles
  // and attacks from a threatening distance.
  function bossPreferredDistance(){
    return (bossPhase>1?5.2:6.8)*combatScale;
  }

  function bossNeedsChase(extra=0){
    return bossDistance()>
      bossPreferredDistance()+
      (1.15+extra)*combatScale;
  }

  function rightHandWorld(){
    return B.haR.getWorldPosition(
      new THREE.Vector3()
    );
  }

  function castFireball(){
    const hand=
      rightHandWorld();

    const target=
      playerChest(
        tmpA
      );

    const direction=
      target
        .clone()
        .sub(
          hand
        )
        .normalize();

    launchOrb(
      hand,
      direction,

      (
        bossPhase>1
          ?19
          :12
      )*
      combatScale,

      (
        bossPhase>1
          ?.80
          :.55
      )*
      combatScale,

      bossPhase>1,
      bossPhase>1 &&
      Math.random()<.50
    );

    bossSfx(
      120,.30,.055
    );
  }

  function castPhase2SideFireballs(){
    const hand=
      rightHandWorld();

    const target=
      playerChest(
        tmpA
      );

    const base=
      target
        .clone()
        .sub(
          hand
        )
        .normalize();

    for(const off of[
      -.25,.25
    ]){
      const d=
        base.clone();

      d.applyAxisAngle(
        new THREE.Vector3(
          0,1,0
        ),
        off
      );

      launchOrb(
        hand,
        d,
        17*
        combatScale,
        .60*
        combatScale,
        false,
        false
      );
    }
  }

  function startAttack(name){
    const phase2=
      bossPhase>1;

    const baseCooldowns={
      pillars:6,
      fireball:5,
      stream:7,
      // V75: these two signature Phase-2 powers should actually be seen.
      solar:11,
      heat:6.5
    };

    cooldowns[name]=
      baseCooldowns[name]*
      CFG.cooldownMultiplier;

    lastAttack=
      name;

    if(name==="pillars"){
      setAction(
        "ATK_PILLARS",
        phase2
          ?1.5
          :2.2,
        [
          {
            at:.45,
            fn:castPillars
          }
        ]
      );
    }
    else if(name==="fireball"){
      const events=[
        {
          at:.30,
          fn:()=>{
            bossFlash=.35;
          }
        },
        {
          at:.62,
          fn:castFireball
        }
      ];

      if(phase2){
        events.push({
          at:.80,
          fn:castPhase2SideFireballs
        });
      }

      setAction(
        "ATK_FIREBALL",
        phase2
          ?1.2
          :1.9,
        events
      );
    }
    else if(name==="stream"){
      setAction(
        "ATK_STREAM",
        2.9,
        [
          {
            at:.01,
            fn:startFireStream
          }
        ]
      );
    }
    else if(name==="solar"){
      specialPowerTimer=0;

      setAction(
        "ATK_SOLAR",
        3.8,
        [
          {
            at:.01,
            fn:startSolar
          }
        ]
      );
    }
    else if(name==="heat"){
      heatTimer=0;
      specialPowerTimer=0;

      setAction(
        "HEATWAVE",
        2.3,
        [
          {
            at:.30,
            fn:()=>castHeatWave()
          }
        ]
      );
    }
  }

  function weightedAttackPick(){
    const d=
      bossDistance();

    // V90: pursuit has priority while the player is outside the boss's pressure
    // range. This prevents the old loop of standing still and chaining ranged
    // attacks from the same spot.
    if(
      d>
      bossPreferredDistance()+
      1.25*combatScale
    ){
      setAction(
        "MOVE",
        bossPhase>1
          ?randomRange(.75,1.15)
          :randomRange(1.05,1.55)
      );
      return;
    }

    const visible=
      lineOfSight(
        bossRoot.position.x,
        bossRoot.position.z,
        player.x,
        player.z
      );

    // O boss deve buscar um ângulo antes de conjurar através de árvores/paredes.
    // Mantém os ataques originais e as fases, sem alterar as animações.
    if(!visible){setAction("MOVE",randomRange(.85,1.4));return;}

    const options=[];

    function can(name){
      return (
        cooldowns[name]<=0 &&
        lastAttack!==name
      );
    }

    if(can("pillars")){
      options.push([
        "pillars",
        d>3
          ?1.4
          :.7
      ]);
    }

    if(can("fireball")){
      options.push([
        "fireball",
        (
          d>5
            ?1.6
            :.5
        )*
        (
          visible
            ?1
            :.4
        )
      ]);
    }

    if(
      bossPhase>1 &&
      can("stream") &&
      d<
      17*
      combatScale
    ){
      options.push([
        "stream",
        1.5*
        (
          visible
            ?1
            :.5
        )
      ]);
    }

    if(
      bossPhase>1 &&
      can("solar")
    ){
      options.push([
        "solar",
        (
          hp<
          maxHp*.30
            ?5.0
            :2.5
        )*
        (
          d<
          16*
          combatScale
            ?1.45
            :.85
        )
      ]);
    }

    if(
      bossPhase>1 &&
      can("heat") &&
      d<
      10*
      combatScale
    ){
      options.push([
        "heat",
        3.8
      ]);
    }

    if(!options.length){
      setAction(
        "MOVE",
        randomRange(
          .8,1.5
        )
      );
      return;
    }

    let total=0;

    for(const o of options){
      total+=o[1];
    }

    let r=
      Math.random()*
      total;

    for(const [
      name,
      weight
    ] of options){
      r-=weight;

      if(r<=0){
        startAttack(
          name
        );
        return;
      }
    }

    startAttack(
      options[0][0]
    );
  }

  function canBossMoveTo(
    x,z
  ){
    // Real forest bounds; only the movement behavior comes from debug.
    if(
      x<-150 ||
      x>150 ||
      z<-150 ||
      z>150
    ){
      return false;
    }

    return !pointBlockedByWorld(
      x,z,
      CFG.colliderBaseRadius*
      worldScale*.72
    );
  }

  function moveBoss(
    dt
  ){
    const dx=
      player.x-
      bossRoot.position.x;

    const dz=
      player.z-
      bossRoot.position.z;

    const d=
      Math.hypot(dx,dz)||1;

    const want=
      Math.atan2(dx,dz);

    const target=
      bossPreferredDistance();

    // Chase hard when far away, back off only if nearly touching the player,
    // otherwise circle while maintaining pressure.
    const dir=
      d>target+.75*combatScale
        ?1
        :d<target*.58
          ?-.45
          :0;

    const speed=
      (bossPhase>1?6.2:3.0)*
      combatScale*
      CFG.movementSpeed;

    const side=
      moveVariant%2
        ?1
        :-1;

    let mx=
      Math.sin(want)*dir;

    let mz=
      Math.cos(want)*dir;

    // Near the player Ignis circles instead of freezing. During long pursuit a
    // small lateral bias helps him steer around trees without looking robotic.
    const strafe=
      bossPhase>1
        ?(dir===0?.72:.24)
        :(dir===0?.34:.12);

    mx+=
      Math.cos(want)*strafe*side;

    mz-=
      Math.sin(want)*strafe*side;

    let len=
      Math.hypot(mx,mz);

    if(len<.001){
      mx=Math.sin(want);
      mz=Math.cos(want);
      len=1;
    }

    mx/=len;
    mz/=len;

    const step=
      speed*dt;

    // Simple local steering: try the desired path first, then bend around forest
    // obstacles on the preferred side and finally the opposite side. This avoids
    // the old behavior where one tree could leave the boss standing forever.
    const offsets=[
      0,
      .28*side,-.28*side,
      .55*side,-.55*side,
      .85*side,-.85*side,
      1.15*side,-1.15*side
    ];

    let moved=false;
    let usedX=0;
    let usedZ=0;

    for(const a of offsets){
      const c=Math.cos(a);
      const s=Math.sin(a);

      const vx=
        mx*c+
        mz*s;

      const vz=
        -mx*s+
        mz*c;

      const tx=
        bossRoot.position.x+
        vx*step;

      const tz=
        bossRoot.position.z+
        vz*step;

      if(canBossMoveTo(tx,tz)){
        bossRoot.position.x=tx;
        bossRoot.position.z=tz;
        usedX=vx;
        usedZ=vz;
        moved=true;
        break;
      }
    }

    if(!moved){
      // Dense clusters can reject a full frame step. Retry with a shorter step
      // before giving up, which lets the boss slide around trunks instead of
      // becoming permanently pinned.
      const shortStep=step*.38;

      for(const a of offsets){
        const c=Math.cos(a);
        const s=Math.sin(a);

        const vx=mx*c+mz*s;
        const vz=-mx*s+mz*c;

        const tx=
          bossRoot.position.x+
          vx*shortStep;

        const tz=
          bossRoot.position.z+
          vz*shortStep;

        if(canBossMoveTo(tx,tz)){
          bossRoot.position.x=tx;
          bossRoot.position.z=tz;
          usedX=vx;
          usedZ=vz;
          moved=true;
          break;
        }
      }
    }

    const visualSpeed=
      moved
        ?speed*.7
        :0;

    bossMoveSpeed+=
      (visualSpeed-bossMoveSpeed)*
      Math.min(1,dt*5);

    if(moved){
      lastMoveDx=usedX;
      lastMoveDz=usedZ;
    }else{
      lastMoveDx=0;
      lastMoveDz=0;
      // Change steering side quickly when genuinely blocked.
      moveVariant++;
    }

    if(
      bossPhase>1 &&
      Math.random()<dt*2.5
    ){
      moveVariant++;
    }
  }

  function enterAggro(){
    if(
      state===STATES.DEAD ||
      state===STATES.TRANSITION
    )return;

    state=
      STATES.AGGRO;

    setAction(
      "AGGRO",
      1.15
    );

    bossSfx(
      58,.65,.07
    );

    const status=
      document.getElementById(
        "status"
      );

    if(status){
      status.textContent=
        "IGNIS, O INTOCADO percebeu você";
    }

    updateBossHud(
      performance.now(),
      true
    );
  }

  function updateCombatAI(dt){
    for(const k in cooldowns){
      cooldowns[k]-=dt;
    }

    actionTime+=dt;

    for(const e of actionEvents){
      if(
        !e.done &&
        actionTime>=
        e.at*
        actionDuration
      ){
        e.done=true;
        e.fn();
      }
    }

    const d=
      bossDistance();

    if(
      bossPhase>1 &&
      (
        action==="IDLE" ||
        action==="MOVE" ||
        action==="RECOVERY"
      )
    ){
      heatTimer+=dt;
      specialPowerTimer+=dt;

      closeTimer=
        d<
        4.6*
        combatScale
          ?closeTimer+dt
          :0;

      // Guarantee the cinematic signature attacks appear regularly instead
      // of being lost forever to random weighted choices.
      if(
        cooldowns.solar<=0 &&
        specialPowerTimer>8.5 &&
        lineOfSight(bossRoot.position.x,bossRoot.position.z,player.x,player.z) &&
        d<
        20*
        combatScale
      ){
        startAttack(
          "solar"
        );
        return;
      }

      if(
        cooldowns.heat<=0 &&
        (
          heatTimer>8 ||
          closeTimer>.9 ||
          specialPowerTimer>5.5
        ) &&
        lineOfSight(bossRoot.position.x,bossRoot.position.z,player.x,player.z)
      ){
        closeTimer=0;
        startAttack(
          "heat"
        );
        return;
      }
    }

    if(action==="IDLE"){
      if(bossNeedsChase(.10)){
        setAction(
          "MOVE",
          bossPhase>1
            ?randomRange(.75,1.10)
            :randomRange(1.00,1.45)
        );
        return;
      }

      if(
        actionTime>=
        actionDuration
      ){
        weightedAttackPick();
      }
    }
    else if(action==="MOVE"){
      moveBoss(dt);

      if(
        bossPhase>1 &&
        Math.random()<
        dt*4
      ){
        moveSide*=-1;
      }

      if(
        actionTime>=
        actionDuration
      ){
        weightedAttackPick();
      }
    }
    else if(
      action.startsWith(
        "ATK_"
      ) ||
      action==="HEATWAVE"
    ){
      if(
        actionTime>=
        actionDuration
      ){
        setAction(
          "RECOVERY",
          bossPhase>1
            ?.55
            :1.5
        );
      }
    }
    else if(action==="RECOVERY"){
      if(
        actionTime>=
        actionDuration
      ){
        if(bossNeedsChase()){
          setAction(
            "MOVE",
            bossPhase>1
              ?randomRange(.70,1.05)
              :randomRange(.95,1.35)
          );
        }else{
          setAction(
            "IDLE",
            bossPhase>1
              ?randomRange(.20,.55)
              :randomRange(.55,1.15)
          );
        }
      }
    }
    else if(action==="HIT_REACTION"){
      if(
        actionTime>=
        actionDuration
      ){
        setAction(
          "IDLE",
          .8
        );
      }
    }

    if(
      bossPhase===1 &&
      hp>0 &&
      hp<=
      maxHp*
      CFG.phase2At
    ){
      startTransition();
    }
  }

  // ------------------------------------------------------------
  // Boss receives damage from the REAL player weapons.
  // ------------------------------------------------------------
  function attackFacingBoss(
    range,
    halfAngleDeg=70
  ){
    const dx=
      bossRoot.position.x-
      player.x;

    const dz=
      bossRoot.position.z-
      player.z;

    const d=
      Math.hypot(
        dx,dz
      );

    if(d>range)return false;

    const fx=
      -Math.sin(
        player.yaw
      );

    const fz=
      -Math.cos(
        player.yaw
      );

    const dot=
      (
        fx*dx+
        fz*dz
      )/
      Math.max(
        .001,
        d
      );

    return dot>=
      Math.cos(
        halfAngleDeg*
        Math.PI/
        180
      );
  }

  function bossHitPoint(){
    return B.chest.getWorldPosition(
      new THREE.Vector3()
    );
  }

  function hurtBoss(
    amount,
    point=bossHitPoint(),
    source="player"
  ){
    if(
      state===STATES.TRANSITION ||
      state===STATES.DEAD ||
      hp<=0
    ){
      return false;
    }

    const dmg=
      Math.max(
        0,
        Number(amount)||0
      );

    if(!dmg)return false;

    if(
      state===STATES.DORMANT ||
      state===STATES.IDLE
    ){
      enterAggro();
    }

    hp=
      Math.max(
        0,
        hp-dmg
      );

    bossFlash=1;

    const phaseHealthFraction=
      bossPhase===1
        ?(
            hp-
            maxHp*
            CFG.phase2At
          )/
          (
            maxHp*
            (
              1-
              CFG.phase2At
            )
          )
        :hp/
         (
           maxHp*
           CFG.phase2At
         );

    const reactionScale=
      bossPhase===1
        ?lerp(
            1,.12,
            clamp(
              phaseHealthFraction,
              0,1
            )
          )
        :1;

    bossFlinch=
      Math.min(
        1,
        bossFlinch+
        dmg/
        60*
        reactionScale
      );

    burst(
      point,
      Math.ceil(
        5*
        reactionScale+
        2
      ),
      4,
      .12
    );

    bossSfx(
      180,.06,.035
    );

    window.dispatchEvent(
      new CustomEvent(
        "game:boss-damaged",
        {
          detail:{
            id:"ignis",
            source,
            damage:dmg,
            hp,
            maxHp,
            phase:bossPhase
          }
        }
      )
    );

    if(hp<=0){
      startDeath();
      return true;
    }

    if(
      action==="IDLE" ||
      action==="MOVE" ||
      action==="RECOVERY"
    ){
      if(
        dmg>=60 ||
        (
          bossPhase===1 &&
          hp<
          maxHp*.78 &&
          Math.random()<.35
        )
      ){
        setAction(
          "HIT_REACTION",
          .70
        );
      }
    }

    if(
      bossPhase===1 &&
      hp<=
      maxHp*
      CFG.phase2At
    ){
      startTransition();
    }

    updateBossHud(
      performance.now(),
      true
    );

    return true;
  }

  let lastAxeSwing=null;

  window.addEventListener(
    "game:axe-impact",
    ev=>{
      if(
        window.gameRightHand
          ?.current!=="axe"
      )return;

      if(
        state===STATES.DEAD ||
        state===STATES.TRANSITION
      )return;

      const swing=
        ev.detail?.swingId ??
        performance.now();

      if(
        swing===
        lastAxeSwing
      )return;

      const range=
        2.55+
        CFG.colliderBaseRadius*
        worldScale;

      if(
        !attackFacingBoss(
          range,
          72
        )
      )return;

      lastAxeSwing=swing;

      const damage=
        window.gameProgression
          ?.modifyAxeDamage?.(
            34
          )??34;

      hurtBoss(
        damage,
        bossHitPoint(),
        "axe"
      );
    }
  );

  let lastHammerSwing=null;

  window.addEventListener(
    "game:hammer-impact",
    ev=>{
      if(
        state===STATES.DEAD ||
        state===STATES.TRANSITION
      )return;

      const swing=
        ev.detail?.swingId ??
        performance.now();

      if(
        swing===
        lastHammerSwing
      )return;

      let hit=false;

      const p=
        ev.detail?.position;

      if(
        p &&
        Number.isFinite(
          p.x
        )
      ){
        const chest=
          bossHitPoint();

        hit=
          Math.hypot(
            p.x-chest.x,
            p.z-chest.z
          )<
          1.15+
          CFG.colliderBaseRadius*
          worldScale &&
          Math.abs(
            p.y-chest.y
          )<
          targetHeight*.62;
      }else{
        hit=
          attackFacingBoss(
            2.35+
            CFG.colliderBaseRadius*
            worldScale,
            68
          );
      }

      if(!hit)return;

      lastHammerSwing=swing;

      hurtBoss(
        42,
        p
          ?new THREE.Vector3(
              p.x,p.y,p.z
            )
          :bossHitPoint(),
        "hammer"
      );
    }
  );

  // ------------------------------------------------------------
  // Spawn / scale / ground.
  // ------------------------------------------------------------
  function setWorldScaleFromMultiplier(
    multiplier
  ){
    CFG.heightMultiplier=
      clamp(
        Number(multiplier)||1.33,
        .9,
        2.0
      );

    targetHeight=
      playerHeight*
      CFG.heightMultiplier;

    worldScale=
      targetHeight/
      nativeHeight;

    bossRoot.scale.setScalar(
      worldScale
    );

    bossLight.distance=
      targetHeight*
      5.5;

    return worldScale;
  }

  function findOpenSpawn(
    x,z
  ){
    const radius=
      CFG.colliderBaseRadius*
      worldScale+
      .30;

    if(
      !pointBlockedByWorld(
        x,z,radius
      )
    ){
      return {
        x,z
      };
    }

    for(
      let ring=1;
      ring<=7;
      ring++
    ){
      const r=
        ring*1.25;

      for(
        let i=0;
        i<12;
        i++
      ){
        const a=
          i/12*
          Math.PI*2;

        const tx=
          x+
          Math.cos(a)*r;

        const tz=
          z+
          Math.sin(a)*r;

        if(
          !pointBlockedByWorld(
            tx,tz,radius
          )
        ){
          return {
            x:tx,
            z:tz
          };
        }
      }
    }

    return {
      x,z
    };
  }

  function setSpawn(
    x,
    z,
    yaw=initialYaw
  ){
    CFG.spawnX=
      Number(x)||0;

    CFG.spawnZ=
      Number(z)||0;

    initialYaw=
      Number(yaw)||0;

    const p=
      findOpenSpawn(
        CFG.spawnX,
        CFG.spawnZ
      );

    bossRoot.position.x=
      p.x;

    bossRoot.position.z=
      p.z;

    bossRoot.rotation.y=
      initialYaw;

    bossRoot.position.y=
      game.groundY(
        p.x,p.z
      )+
      CFG.hoverHeight;

    return bossRoot.position;
  }

  setSpawn(
    CFG.spawnX,
    CFG.spawnZ,
    CFG.spawnYaw
  );

  // Position may be prepared in advance, but Nights 1–4 must not render,
  // collide, emit fire, show a boss bar, or run boss AI.
  bossRoot.visible=false;

  // ------------------------------------------------------------
  // Player / boss body collision. Existing player controller remains owner.
  // ------------------------------------------------------------
  function resolvePlayerBossCollision(){
    if(
      !bossRoot.visible ||
      state===STATES.DEAD
    )return;

    let dx=
      player.x-
      bossRoot.position.x;

    let dz=
      player.z-
      bossRoot.position.z;

    let d=
      Math.hypot(
        dx,dz
      );

    const bossRadius=
      CFG.colliderBaseRadius*
      worldScale;

    const playerRadius=
      Number(
        player.radius
      )||.42;

    const minDist=
      bossRadius+
      playerRadius;

    if(d>=minDist)return;

    if(d<.0001){
      dx=Math.sin(
        bossRoot.rotation.y
      );

      dz=Math.cos(
        bossRoot.rotation.y
      );

      d=1;
    }

    const tx=
      bossRoot.position.x+
      dx/d*
      minDist;

    const tz=
      bossRoot.position.z+
      dz/d*
      minDist;

    if(
      !pointBlockedByWorld(
        tx,tz,
        playerRadius*.65
      )
    ){
      player.x=tx;
      player.z=tz;
    }
  }

  function updateIgnis(
    dt,
    gameTime
  ){
    dt=
      Math.min(
        .05,
        Math.max(
          0,
          Number(dt)||0
        )
      );

    elapsed+=dt;

    // V91: no opening spawn. Until Night 5, Ignis is completely absent from
    // gameplay: no model, collision, AI, fire particles, attacks or boss HUD.
    if(!scheduledEncounterSpawned){
      bossRoot.visible=false;
      insideActivationRadius=false;

      if(!startScheduledEncounter(false)){
        bossHud.classList.remove("show");
        setWarning("");
        return;
      }
    }

    const dx=
      player.x-
      bossRoot.position.x;

    const dz=
      player.z-
      bossRoot.position.z;

    const distance=
      Math.hypot(
        dx,dz
      );

    insideActivationRadius=
      distance<=
      CFG.activationRadius;

    if(
      !bossDead &&
      state!==STATES.TRANSITION &&
      state!==STATES.DEAD
    ){
      if(
        state===STATES.DORMANT &&
        distance<=
        CFG.facingRadius
      ){
        state=
          STATES.IDLE;
      }

      if(
        state===STATES.IDLE &&
        distance>
        CFG.facingRadius*
        1.12
      ){
        state=
          STATES.DORMANT;
      }

      if(
        (
          state===STATES.DORMANT ||
          state===STATES.IDLE
        ) &&
        insideActivationRadius
      ){
        enterAggro();
      }

      if(
        state===STATES.AGGRO
      ){
        actionTime+=dt;

        if(
          actionTime>=
          actionDuration
        ){
          state=
            STATES.COMBAT;

          // V90: once aggro completes, start hunting immediately.
          setAction(
            "MOVE",
            bossPhase>1
              ?1.0
              :1.35
          );
        }
      }
      else if(
        state===STATES.COMBAT
      ){
        if(
          distance>
          CFG.activationRadius*
          2.6
        ){
          lostTargetTimer+=dt;

          if(lostTargetTimer>6){
            state=STATES.IDLE;
            clearBossEffects();
            setAction(
              "IDLE",
              1.5
            );
            lostTargetTimer=0;
          }
        }else{
          lostTargetTimer=0;
        }

        if(
          state===STATES.COMBAT
        ){
          updateCombatAI(
            dt
          );
        }
      }
    }

    if(
      state===STATES.TRANSITION
    ){
      actionTime+=dt;

      for(const e of actionEvents){
        if(
          !e.done &&
          actionTime>=
          e.at*
          actionDuration
        ){
          e.done=true;
          e.fn();
        }
      }

      updateTransition(
        dt
      );
    }
    else if(
      state===STATES.DEAD
    ){
      actionTime+=dt;
      updateDeath(dt);
    }
    else if(
      state===STATES.DORMANT ||
      state===STATES.IDLE
    ){
      actionTime+=dt;
    }

    // Smooth body orientation.
    const desiredYaw=
      distance<=
      CFG.facingRadius ||
      state===STATES.AGGRO ||
      state===STATES.COMBAT
        ?Math.atan2(
            dx,dz
          )
        :initialYaw;

    const attackLocked=
      action==="ATK_SOLAR" ||
      action==="HEATWAVE";

    const maxTurnRate=
      (
        bossPhase>1
          ?4
          :1.30
      )*
      CFG.movementSpeed;

    const turnRate=
      (
        action.startsWith(
          "ATK_"
        )
          ?.50
          :1
      )*
      maxTurnRate;

    if(
      state!==STATES.DEAD &&
      state!==STATES.TRANSITION &&
      !attackLocked
    ){
      bossRoot.rotation.y+=
        clamp(
          angleDiff(
            desiredYaw,
            bossRoot.rotation.y
          ),
          -turnRate*dt,
          turnRate*dt
        );
    }

    const headRelative=
      clamp(
        angleDiff(
          Math.atan2(
            dx,dz
          ),
          bossRoot.rotation.y
        ),
        -.80,
        .80
      );

    bossFlinch=
      Math.max(
        0,
        bossFlinch-
        dt*2.2
      );

    bossFlash=
      Math.max(
        0,
        bossFlash-
        dt*4
      );

    if(
      bossPhase>1 &&
      state!==STATES.TRANSITION
    ){
      phaseBlend+=
        (
          1-
          phaseBlend
        )*
        Math.min(
          1,
          dt*2.5
        );
    }

    applyBossPose(
      dt,
      gameTime ??
      elapsed,
      headRelative
    );

    // Real terrain + intentional hover.
    const ground=
      game.groundY(
        bossRoot.position.x,
        bossRoot.position.z
      );

    const bob=
      Math.sin(
        elapsed*
        (
          bossPhase>1
            ?2.5
            :1.7
        )
      )*
      (
        bossPhase>1
          ?CFG.hoverBob*1.5
          :CFG.hoverBob
      );

    bossRoot.position.y=
      ground+
      CFG.hoverHeight+
      bob;

    magmaMaterial
      .uniforms
      .uT
      .value=
        gameTime ??
        elapsed;

    if(
      state!==STATES.TRANSITION &&
      state!==STATES.DEAD
    ){
      const targetHeat=
        bossPhase>1
          ?1
          :(
              state===STATES.COMBAT ||
              state===STATES.AGGRO
                ?.42
                :.30
            );

      bossHeat+=
        (
          targetHeat-
          bossHeat
        )*
        Math.min(
          1,
          dt*2
        );
    }

    magmaMaterial
      .uniforms
      .uHeat
      .value=
        bossHeat*
        (
          1+
          .10*
          Math.sin(
            elapsed*
            (
              bossPhase>1
                ?9
                :2
            )
          )
        );

    magmaMaterial
      .uniforms
      .uFl
      .value=
        bossFlash*.70;

    eyeMaterial.color.setRGB(
      1,
      bossPhase>1
        ?.97
        :.75,
      bossPhase>1
        ?.85
        :.40
    );

    bossLight.intensity+=
      (
        (
          bossDead
            ?0
            :1.5+
             bossHeat*4
        )-
        bossLight.intensity
      )*
      Math.min(
        1,
        dt*4
      );

    bossLight.position.y=
      nativeHeight*.64;

    flashLight.intensity=
      Math.max(
        0,
        flashLight.intensity-
        dt*40
      );

    if(
      liveSolar ||
      solarFlashAmount>0
    ){
      updateSolarScreenOrigin();
    }

    // Real power updates.
    updatePillars(dt);
    updateOrbs(dt);
    updateExplosions(dt);
    updateGroundFire(dt);
    updateHeatWaves(dt);
    updateFireStream(dt);
    updateSolar(dt);
    updateForestReaction(dt);

    emitBodyFire(
      dt,
      distance
    );

    emitMovementFire(
      dt,
      distance
    );

    updateFireParticles(
      dt
    );

    if(
      bossRoot.visible
    ){
      bossRoot.updateMatrixWorld(
        true
      );
    }

    updateBossHud();
  }

  const previousAvatarUpdate=
    window.__updateAnimatedAvatar;

  window.__updateAnimatedAvatar=
    function(...args){
      const dt=
        Number(
          args[2]
        )||0;

      // Player has already moved in the real controller before this function
      // is called, so resolve Ignis collision before camera/body placement.
      resolvePlayerBossCollision();

      previousAvatarUpdate
        ?.apply(
          this,
          args
        );

      updateIgnis(
        dt,
        Number(args[0])||elapsed
      );
    };

  // First frame.
  bossRoot.updateMatrixWorld(true);

  window.gameIgnis={
    version:"V91B",
    source:
      "Boss de Fogo — Cena de Debug.html",

    STATES,

    root:bossRoot,
    deathCore,
    rigRoot,
    bones:B,
    extraBones:X,
    sockets,
    hitboxes,
    collider:mainCollider,
    fire:firePoints,

    config:CFG,

    get state(){
      return state;
    },

    get action(){
      return action;
    },

    get phase(){
      return bossPhase;
    },

    get hp(){
      return hp;
    },

    get maxHp(){
      return maxHp;
    },

    get combatEnabled(){
      return true;
    },

    get attacksEnabled(){
      return true;
    },

    get movement(){
      return {
        source:"approved-debug-AI.update",
        phase1Speed:3.0*combatScale*CFG.movementSpeed,
        phase2Speed:6.2*combatScale*CFG.movementSpeed,
        phase1TargetDistance:6.8*combatScale,
        phase2TargetDistance:5.2*combatScale,
        activationRadius:CFG.activationRadius,
        pursuit:true,
        obstacleSteering:true,
        strafeFactor:.7,
        visualSpeed:bossMoveSpeed,
        variant:moveVariant
      };
    },

    setMovementSpeed(value){
      CFG.movementSpeed=
        clamp(Number(value)||1,.25,2.5);

      return CFG.movementSpeed;
    },

    get cinematicEffects(){
      return {
        solarDarkening:true,
        solarFlash:true,
        forestReaction:true,
        leafDebris:true,
        heatWaveForestImpulse:true,
        solarBurnsGrass:true,
        transitionBurnsGrass:true,
        solarCooldown:11,
        heatCooldown:6.5
      };
    },

    get insideActivationRadius(){
      return insideActivationRadius;
    },

    get spawnNight(){
      return Math.max(
        1,
        Math.floor(Number(CFG.spawnNight)||5)
      );
    },

    get scheduledEncounterSpawned(){
      return scheduledEncounterSpawned;
    },

    get schedule(){
      return {
        day:currentSurvivalDay(),
        night:isSurvivalNight(),
        spawnNight:Math.max(1,Math.floor(Number(CFG.spawnNight)||5)),
        ready:scheduledEncounterReady(),
        spawned:scheduledEncounterSpawned
      };
    },

    // Debug-only API. Normal gameplay never calls this before Night 5.
    spawnNow(){
      return startScheduledEncounter(true);
    },

    get playerHeight(){
      return playerHeight;
    },

    get nativeHeight(){
      return nativeHeight;
    },

    get targetHeight(){
      return targetHeight;
    },

    get scale(){
      return worldScale;
    },

    get colliderRadius(){
      return CFG.colliderBaseRadius*
        worldScale;
    },

    get colliderHeight(){
      return CFG.colliderBaseHeight*
        worldScale;
    },

    setSpawn,

    setHeightMultiplier(
      value
    ){
      const result=
        setWorldScaleFromMultiplier(
          value
        );

      bossRoot.updateMatrixWorld(
        true
      );

      return result;
    },

    setActivationRadius(
      value
    ){
      CFG.activationRadius=
        Math.max(
          1,
          Number(value)||
          CFG.activationRadius
        );

      return CFG.activationRadius;
    },

    showHitboxes(
      visible=true
    ){
      for(const h of hitboxes){
        h.visible=
          !!visible;
      }

      return !!visible;
    },

    damage(
      amount,
      source="debug"
    ){
      return hurtBoss(
        amount,
        bossHitPoint(),
        source
      );
    },

    forceAttack(name){
      const map={
        pillar:"pillars",
        pillars:"pillars",
        coluna:"pillars",
        fireball:"fireball",
        bola:"fireball",
        stream:"stream",
        rajada:"stream",
        heat:"heat",
        onda:"heat",
        solar:"solar"
      };

      const key=
        map[
          String(name||"")
            .toLowerCase()
        ];

      if(!key)return false;

      if(
        state!==STATES.COMBAT
      ){
        state=STATES.COMBAT;
      }

      cooldowns[key]=0;
      startAttack(key);
      return true;
    },

    forcePhase2(){
      if(
        state===STATES.DEAD
      )return false;

      hp=
        Math.min(
          hp,
          maxHp*
          CFG.phase2At
        );

      startTransition();
      return true;
    },

    reset(){
      clearBossEffects();

      hp=maxHp;
      bossPhase=1;
      phaseBlend=0;
      bossHeat=.30;
      bossFlash=0;
      bossFlinch=0;
      bossFloat=.18;
      bossMoveSpeed=0;
      moveVariant=0;
      lastMoveDx=0;
      lastMoveDz=0;
      bossDead=false;
      deathRewarded=false;

      magmaMaterial
        .uniforms
        .uDis
        .value=0;

      scheduledEncounterSpawned=false;
      scheduledEncounterAnnounced=false;
      bossRoot.visible=false;
      deathCore.visible=false;

      for(const k in cooldowns){
        cooldowns[k]=0;
      }

      lastAttack="";
      closeTimer=0;
      heatTimer=0;
      specialPowerTimer=0;
      lostTargetTimer=0;

      state=STATES.DORMANT;

      setAction(
        "IDLE",
        1.5
      );

      setSpawn(
        CFG.spawnX,
        CFG.spawnZ,
        CFG.spawnYaw
      );

      setWarning("");

      // If reset is used while Night 5 (or a later night) is already active,
      // restart the boss encounter. Otherwise keep him absent until the schedule.
      startScheduledEncounter(false);

      updateBossHud(
        performance.now(),
        true
      );

      return true;
    },

    measure(){
      return {
        playerHeight,
        nativeHeight,
        targetHeight,
        scale:worldScale,
        colliderRadius:
          CFG.colliderBaseRadius*
          worldScale,
        colliderHeight:
          CFG.colliderBaseHeight*
          worldScale,
        hp,
        maxHp,
        phase:bossPhase,
        state,
        action,
        spawn:{
          x:bossRoot.position.x,
          y:bossRoot.position.y,
          z:bossRoot.position.z,
          yaw:bossRoot.rotation.y
        }
      };
    }
  };

  // Do not reveal the boss name/status at game start. The first visible
  // announcement happens only when the scheduled Night-5 encounter begins.
  console.info(
    "[V91B IGNIS • BOSS NOITE 5]",
    {
      ...window.gameIgnis.measure(),
      schedule:window.gameIgnis.schedule
    }
  );
})().catch(err=>{
  console.error(
    "V91B IGNIS:",
    err
  );

  const status=
    document.getElementById(
      "status"
    );

  if(status){
    status.textContent=
      "Falha ao integrar IGNIS: "+
      String(
        err?.message||err
      );
  }
});

