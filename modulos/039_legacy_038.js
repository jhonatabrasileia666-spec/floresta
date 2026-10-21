

(()=>{
  const STORAGE_KEY="floresta-progression-v52";

  const defaults={
    level:1,
    xp:0,
    skillPoints:0,
    skills:{
      strength:0,
      vitality:0,
      resistance:0,
      hunter:0
    }
  };

  function load(){
    try{
      const raw=localStorage.getItem(STORAGE_KEY);
      if(!raw)return structuredClone(defaults);

      const saved=JSON.parse(raw);

      return {
        level:Math.max(1,Number(saved.level)||1),
        xp:Math.max(0,Number(saved.xp)||0),
        skillPoints:Math.max(0,Number(saved.skillPoints)||0),
        skills:{
          strength:Math.max(0,Math.min(5,Number(saved.skills?.strength)||0)),
          vitality:Math.max(0,Math.min(5,Number(saved.skills?.vitality)||0)),
          resistance:Math.max(0,Math.min(5,Number(saved.skills?.resistance)||0)),
          hunter:Math.max(0,Math.min(5,Number(saved.skills?.hunter)||0))
        }
      };
    }catch(err){
      console.warn("Progressão: save inválido",err);
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  const state=load();

  const $=id=>document.getElementById(id);
  const overlay=$("skillTreeOverlay");
  const openBtn=$("skillTreeBtn");
  const closeBtn=$("skillTreeClose");
  const mobileBtn=$("mobileSkillsProxy");
  const status=$("status");

  const levelHud=$("playerLevelText");
  const pointsHud=$("skillPointsHud");
  const xpHud=$("playerXpText");
  const xpBar=$("playerXpBar");

  const levelBig=$("skillLevelBig");
  const xpBig=$("skillXpBig");
  const xpFill=$("skillXpFill");
  const pointBig=$("skillPointBig");
  const summary=$("skillSummary");

  const toastLayer=$("xpToastLayer");

  const branchInfo={
    strength:{
      title:"Força",
      perLevel:12,
      desc:l=>`Dano do machado: +${l*12}%`
    },
    vitality:{
      title:"Vida",
      perLevel:20,
      desc:l=>`Vida máxima: ${100+l*20}`
    },
    resistance:{
      title:"Resistência",
      perLevel:7,
      desc:l=>`Redução de dano: ${l*7}%`
    },
    hunter:{
      title:"Caçador",
      perLevel:10,
      desc:l=>`Bônus de XP: +${l*10}%`
    }
  };

  const orbs=[];
  let three=null;
  let orbLoopStarted=false;

  function xpRequired(level=state.level){
    // 100, 175, 250, 325...
    return 100+(Math.max(1,level)-1)*75;
  }

  function save(){
    try{
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(state)
      );
    }catch(err){
      console.warn("Progressão: não foi possível salvar",err);
    }
  }

  function showToast(text){
    if(!toastLayer)return;

    const el=document.createElement("div");
    el.className="xp-toast";
    el.textContent=text;
    toastLayer.appendChild(el);

    setTimeout(()=>el.remove(),1050);
  }

  function renderBranch(key){
    const level=state.skills[key];
    const holder=$(key+"Nodes");
    const effect=$(key+"Effect");

    if(holder){
      holder.innerHTML="";

      for(let i=1;i<=5;i++){
        const b=document.createElement("button");
        b.type="button";
        b.className="skill-node";
        b.textContent=i;
        b.dataset.skill=key;
        b.dataset.rank=i;

        if(i<=level){
          b.classList.add("unlocked");
          b.title=`${branchInfo[key].title} ${i} desbloqueado`;
        }else if(
          i===level+1 &&
          state.skillPoints>0
        ){
          b.classList.add("available");
          b.title=`Gastar 1 ponto em ${branchInfo[key].title}`;
        }else{
          b.classList.add("locked");
          b.title=
            i===level+1
              ? "Você precisa de um ponto de habilidade"
              : `Desbloqueie ${branchInfo[key].title} ${i-1} primeiro`;
        }

        holder.appendChild(b);
      }
    }

    if(effect){
      effect.textContent=branchInfo[key].desc(level);
    }
  }

  function render(){
    const need=xpRequired();
    const pct=Math.max(
      0,
      Math.min(100,(state.xp/need)*100)
    );

    if(levelHud)levelHud.textContent=`NÍVEL ${state.level}`;
    if(pointsHud){
      pointsHud.textContent=
        `${state.skillPoints} ${state.skillPoints===1?"ponto":"pontos"}`;
    }
    if(xpHud)xpHud.textContent=`${state.xp} / ${need} XP`;
    if(xpBar)xpBar.style.width=`${pct}%`;

    if(levelBig)levelBig.textContent=`Nível ${state.level}`;
    if(xpBig)xpBig.textContent=`${state.xp} / ${need} XP`;
    if(xpFill)xpFill.style.width=`${pct}%`;

    if(pointBig){
      pointBig.textContent=
        `${state.skillPoints} ${
          state.skillPoints===1
            ?"ponto de habilidade"
            :"pontos de habilidade"
        }`;
    }

    if(summary){
      summary.textContent=
        `Nível ${state.level} • ${state.skillPoints} ${
          state.skillPoints===1
            ?"ponto disponível"
            :"pontos disponíveis"
        }`;
    }

    for(const key of Object.keys(branchInfo)){
      renderBranch(key);
    }

    window.gameZombie?.refreshPlayerHp?.();
  }

  function openTree(){
    if(!overlay)return;

    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden","false");
    document.body.classList.add("skills-open");

    try{
      document.exitPointerLock?.();
    }catch{}

    window.gameMobile?.releaseMovement?.();
    render();
  }

  function closeTree(){
    if(!overlay)return;

    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden","true");
    document.body.classList.remove("skills-open");
  }

  function toggleTree(){
    if(overlay?.classList.contains("open"))closeTree();
    else openTree();
  }

  function buySkill(key){
    if(!branchInfo[key])return false;

    const old=state.skills[key];

    if(old>=5){
      showToast(`${branchInfo[key].title} já está no máximo`);
      return false;
    }

    if(state.skillPoints<1){
      showToast("Sem pontos de habilidade");
      return false;
    }

    const oldMaxHealth=getMaxHealth();

    state.skillPoints--;
    state.skills[key]++;
    save();

    if(key==="vitality"){
      const newMaxHealth=getMaxHealth();

      // Buying life also grants the newly-added HP immediately.
      window.gameZombie?.healPlayer?.(
        newMaxHealth-oldMaxHealth
      );
    }

    render();

    showToast(
      `${branchInfo[key].title} ${state.skills[key]} desbloqueado`
    );

    if(status){
      status.textContent=
        `${branchInfo[key].title} aumentou para nível ${state.skills[key]}`;
    }

    return true;
  }

  function getMaxHealth(){
    return 100+state.skills.vitality*20;
  }

  function modifyAxeDamage(base){
    const mult=
      1+state.skills.strength*.12;

    return Math.max(
      1,
      Math.round(
        (Number(base)||0)*mult
      )
    );
  }

  function reduceIncomingDamage(base){
    const reduction=
      Math.min(
        .35,
        state.skills.resistance*.07
      );

    return Math.max(
      1,
      Math.round(
        (Number(base)||0)*(1-reduction)*(window.gamePrimitive?.damageMultiplier?.()??1)
      )
    );
  }

  function xpMultiplier(){
    return 1+state.skills.hunter*.10;
  }

  function grantXP(baseAmount,source="Inimigo"){
    const base=Math.max(
      0,
      Math.round(Number(baseAmount)||0)
    );

    if(base<=0)return 0;

    const gained=Math.max(
      1,
      Math.round(base*xpMultiplier())
    );

    state.xp+=gained;

    let levels=0;

    while(state.xp>=xpRequired()){
      state.xp-=xpRequired();
      state.level++;
      state.skillPoints++;
      levels++;
    }

    save();
    render();

    showToast(`+${gained} XP • ${source}`);

    if(levels>0){
      setTimeout(()=>{
        showToast(
          `NÍVEL ${state.level} • +${levels} ${
            levels===1
              ?"ponto de habilidade"
              :"pontos de habilidade"
          }`
        );
      },240);

      // Level-up reward: restore 25% max health.
      window.gameZombie?.healPlayer?.(
        Math.round(getMaxHealth()*.25)
      );

      if(status){
        status.textContent=
          `SUBIU PARA O NÍVEL ${state.level} • abra Habilidades`;
      }
    }

    return gained;
  }

  function ensureThree(){
    if(three)return three;

    three=
      window.__THREE_MODULE ||
      null;

    return three;
  }

  function startOrbLoop(){
    if(orbLoopStarted)return;
    orbLoopStarted=true;

    let last=performance.now();

    const tick=now=>{
      requestAnimationFrame(tick);

      const dt=Math.min(
        .05,
        Math.max(0,(now-last)/1000)
      );
      last=now;

      const g=window.gameReview;

      for(let i=orbs.length-1;i>=0;i--){
        const o=orbs[i];

        o.age+=dt;

        if(!g?.player){
          if(o.age>1.5){
            o.mesh?.removeFromParent?.();
            grantXP(o.amount,o.source);
            orbs.splice(i,1);
          }
          continue;
        }

        const ground=
          g.groundY(
            g.player.x,
            g.player.z
          );

        const target={
          x:g.player.x,
          y:ground+1.0,
          z:g.player.z
        };

        if(o.age<.35){
          o.velocity.y-=3.2*dt;
          o.mesh.position.addScaledVector(
            o.velocity,
            dt
          );
        }else{
          const dx=target.x-o.mesh.position.x;
          const dy=target.y-o.mesh.position.y;
          const dz=target.z-o.mesh.position.z;
          const d=Math.hypot(dx,dy,dz);

          if(d<.42 || o.age>3.2){
            o.mesh.removeFromParent();
            grantXP(o.amount,o.source);
            orbs.splice(i,1);
            continue;
          }

          const speed=
            Math.min(
              10,
              3.3+(o.age-.35)*4.4
            );

          o.mesh.position.x+=dx/d*speed*dt;
          o.mesh.position.y+=dy/d*speed*dt;
          o.mesh.position.z+=dz/d*speed*dt;

          o.mesh.scale.setScalar(
            .86+.14*Math.sin(now*.012)
          );
        }
      }
    };

    requestAnimationFrame(tick);
  }

  function dropXP(amount,position,source="Inimigo"){
    const T=ensureThree();
    const g=window.gameReview;

    // If 3D context isn't available for any reason, never lose the reward.
    if(
      !T ||
      !g?.scene ||
      !position
    ){
      return grantXP(amount,source);
    }

    const geometry=
      new T.IcosahedronGeometry(.105,1);

    const material=
      new T.MeshBasicMaterial({
        color:0xd8b65d,
        transparent:true,
        opacity:.96
      });

    const mesh=
      new T.Mesh(
        geometry,
        material
      );

    mesh.name="XP_Orb";
    mesh.position.copy(position);
    mesh.position.y+=.45;
    mesh.renderOrder=5;

    g.scene.add(mesh);

    // Avoid accumulating too many meshes if a whole horde dies at once.
    if(orbs.length>=24){
      const oldest=orbs.shift();
      oldest.mesh?.removeFromParent?.();
      grantXP(oldest.amount,oldest.source);
    }

    orbs.push({
      mesh,
      amount,
      source,
      age:0,
      velocity:new T.Vector3(
        (Math.random()-.5)*.55,
        .95+Math.random()*.35,
        (Math.random()-.5)*.55
      )
    });

    startOrbLoop();
    return amount;
  }

  // UI events
  openBtn?.addEventListener("click",toggleTree);
  closeBtn?.addEventListener("click",closeTree);
  mobileBtn?.addEventListener("click",()=>{
    document.getElementById("mobileMenuPanel")
      ?.classList.remove("open");
    openTree();
  });

  overlay?.addEventListener("click",e=>{
    const node=e.target.closest?.(".skill-node");

    if(node){
      buySkill(node.dataset.skill);
      return;
    }

    if(e.target===overlay){
      closeTree();
    }
  });

  window.addEventListener("keydown",e=>{
    if(
      e.code==="KeyH" &&
      !e.repeat
    ){
      e.preventDefault();
      toggleTree();
    }

    if(
      e.code==="Escape" &&
      overlay?.classList.contains("open")
    ){
      closeTree();
    }
  });

  window.gameProgression={
    version:"V52",
    state,
    xpRequired,
    getMaxHealth,
    modifyAxeDamage,
    reduceIncomingDamage,
    getXpMultiplier:xpMultiplier,
    grantXP,
    dropXP,
    buySkill,
    open:openTree,
    close:closeTree,
    refresh:render,
    reset(){
      Object.assign(state,{
        level:1,
        xp:0,
        skillPoints:0
      });

      Object.assign(
        state.skills,
        defaults.skills
      );

      save();
      render();
      return state;
    }
  };

  render();
})();

