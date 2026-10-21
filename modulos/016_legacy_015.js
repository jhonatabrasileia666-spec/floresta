
(() => {
  const cfg = Object.assign({
    enabled: true,
    startHour: 16.75,
    cycleMinutes: 12,
    fastMultiplier: 12,
    sunriseHour: 6,
    sunsetHour: 18,
    showClock: true,
    fogDayDensity: 0.022,
    fogNightDensity: 0.034,
    dayExposure: 1.12,
    nightExposure: 0.88
  }, window.FLORESTA_DAY_NIGHT_CONFIG || {});

  if (!cfg.enabled) return;

  const clamp = (v,a,b) => Math.max(a, Math.min(b,v));
  const smoothstep = (a,b,x) => {
    x = clamp((x-a)/(b-a),0,1);
    return x*x*(3-2*x);
  };
  const wrap24 = h => ((h % 24) + 24) % 24;

  function waitGame() {
    return new Promise((resolve,reject) => {
      let tries = 0;
      const id = setInterval(() => {
        const g = window.gameReview;
        if (g?.scene && g?.renderer && g?.player) {
          clearInterval(id);
          resolve(g);
        } else if (++tries > 800) {
          clearInterval(id);
          reject(new Error("Estado do jogo não apareceu."));
        }
      }, 20);
    });
  }

  function makeClock() {
    if (!cfg.showClock) return null;
    const el = document.createElement("div");
    el.id = "dayNightClock";
    el.style.cssText = [
      "position:fixed",
      "left:50%",
      "top:14px",
      "transform:translateX(-50%)",
      "z-index:12",
      "pointer-events:none",
      "padding:7px 11px",
      "border-radius:9px",
      "border:1px solid rgba(255,255,255,.16)",
      "background:rgba(0,0,0,.42)",
      "backdrop-filter:blur(8px)",
      "color:#fff",
      "font:600 12px/1.2 Inter,system-ui,sans-serif",
      "letter-spacing:.02em",
      "text-shadow:0 1px 2px #000",
      "white-space:nowrap"
    ].join(";");
    document.body.appendChild(el);
    return el;
  }

  function makeSpeedButton() {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "dayNightSpeed";
    btn.textContent = "Tempo x1 (N)";
    btn.style.cssText = [
      "position:fixed",
      "right:18px",
      "top:122px",
      "z-index:13",
      "padding:9px 12px",
      "border-radius:9px",
      "border:1px solid rgba(255,255,255,.18)",
      "background:rgba(0,0,0,.5)",
      "color:#fff",
      "font:600 12px Inter,system-ui,sans-serif",
      "cursor:pointer"
    ].join(";");
    document.body.appendChild(btn);
    return btn;
  }

  function lerpColor(ColorCtor, a, b, t) {
    const ca = new ColorCtor(a);
    const cb = new ColorCtor(b);
    return ca.lerp(cb, clamp(t,0,1));
  }

  function sampleStops(ColorCtor, hour, stops) {
    hour = wrap24(hour);
    for (let i=0;i<stops.length;i++) {
      const a = stops[i];
      const b = stops[(i+1)%stops.length];
      let ah = a[0], bh = b[0];
      let h = hour;
      if (i === stops.length-1) {
        bh += 24;
        if (h < ah) h += 24;
      }
      if (h >= ah && h <= bh) {
        return lerpColor(ColorCtor, a[1], b[1], (h-ah)/(bh-ah));
      }
    }
    return new ColorCtor(stops[0][1]);
  }

  waitGame().then(game => {
    const scene = game.scene;
    const renderer = game.renderer;
    const player = game.player;

    let hemi = null;
    let sun = null;

    scene.traverse(o => {
      if (!hemi && o.isHemisphereLight) hemi = o;
      if (!sun && o.isDirectionalLight) sun = o;
    });

    if (!scene.background || !sun) {
      throw new Error("Céu ou luz direcional não encontrados.");
    }

    const ColorCtor = scene.background.constructor;
    const clockEl = makeClock();
    const speedBtn = makeSpeedButton();

    const forceDayBtn = document.getElementById("forceDayBtn");
    const forceNightBtn = document.getElementById("forceNightBtn");
    const pauseTimeBtn = document.getElementById("pauseTimeBtn");
    const autoTimeBtn = document.getElementById("autoTimeBtn");

    // The existing directional light becomes the sun by day and cool moonlight by night.
    if (sun.target && !sun.target.parent) scene.add(sun.target);

    const skyStops = [
      [0.0,  0x02050b],
      [4.5,  0x07101a],
      [5.5,  0x3d3040],
      [6.35, 0xc26d43],
      [7.5,  0x77a8c5],
      [12.0, 0x8bc7e5],
      [16.5, 0x6fa5c4],
      [18.0, 0xd06b3d],
      [19.0, 0x503044],
      [20.3, 0x0b1320],
      [24.0, 0x02050b]
    ];

    const fogStops = [
      [0.0,  0x05090c],
      [5.0,  0x10151c],
      [6.5,  0x6d5849],
      [9.0,  0x77909a],
      [15.5, 0x708993],
      [18.2, 0x6d4335],
      [20.0, 0x10131a],
      [24.0, 0x05090c]
    ];

    let hour = wrap24(Number(cfg.startHour) || 0);
    let fast = false;
    let paused = false;
    let mode = "auto"; // auto | day | night | paused
    let last = performance.now();

    const DAY_STORAGE_KEY="floresta-survival-day-v56";
    let survivalDay=(()=>{
      try{
        return Math.max(
          1,
          Math.floor(
            Number(localStorage.getItem(DAY_STORAGE_KEY))||1
          )
        );
      }catch{
        return 1;
      }
    })();

    function saveDay(){
      try{
        localStorage.setItem(
          DAY_STORAGE_KEY,
          String(survivalDay)
        );
      }catch{}
    }

    function setSurvivalDay(value,emit=true){
      const next=Math.max(
        1,
        Math.floor(Number(value)||1)
      );

      const changed=next!==survivalDay;
      survivalDay=next;
      saveDay();

      if(changed&&emit){
        window.dispatchEvent(
          new CustomEvent("game:day-changed",{
            detail:{day:survivalDay}
          })
        );
      }

      updateVisuals();
      return survivalDay;
    }

    function advanceSurvivalDay(){
      survivalDay++;
      saveDay();

      window.dispatchEvent(
        new CustomEvent("game:day-changed",{
          detail:{day:survivalDay}
        })
      );

      return survivalDay;
    }

    function crossedHour(from,to,target){
      from=wrap24(from);
      to=wrap24(to);
      target=wrap24(target);

      if(to>=from){
        return target>from&&target<=to;
      }

      return target>from||target<=to;
    }

    function phaseName(h) {
      if (h >= 5.0 && h < 7.2) return "Amanhecendo";
      if (h >= 7.2 && h < 17.0) return "Dia";
      if (h >= 17.0 && h < 19.4) return "Anoitecendo";
      return "Noite";
    }

    function formatTime(h) {
      let hh = Math.floor(wrap24(h));
      let mm = Math.floor((wrap24(h)-hh)*60);
      if (mm >= 60) { hh=(hh+1)%24; mm=0; }
      return String(hh).padStart(2,"0")+":"+String(mm).padStart(2,"0");
    }

    function paintModeButtons() {
      const active = "rgba(198,154,88,.24)";
      const normal = "rgba(255,255,255,.06)";
      if (forceDayBtn) forceDayBtn.style.background = mode==="day" ? active : normal;
      if (forceNightBtn) forceNightBtn.style.background = mode==="night" ? active : normal;
      if (pauseTimeBtn) pauseTimeBtn.style.background = mode==="paused" ? active : normal;
      if (autoTimeBtn) autoTimeBtn.style.background = mode==="auto" ? active : normal;
    }

    function forceDay() {
      hour = 12;
      paused = true;
      mode = "day";
      fast = false;
      if (speedBtn) speedBtn.textContent = "Tempo x1 (N)";
      updateVisuals();
      paintModeButtons();
    }

    function forceNight() {
      hour = 0;
      paused = true;
      mode = "night";
      fast = false;
      if (speedBtn) speedBtn.textContent = "Tempo x1 (N)";
      updateVisuals();
      paintModeButtons();
    }

    function pauseTime() {
      paused = true;
      mode = "paused";
      paintModeButtons();
    }

    function resumeAuto() {
      paused = false;
      mode = "auto";
      paintModeButtons();
    }

    function toggleFast() {
      fast = !fast;
      if (fast) {
        paused = false;
        mode = "auto";
      }
      if (speedBtn) speedBtn.textContent = fast ? `Tempo x${cfg.fastMultiplier} (N)` : "Tempo x1 (N)";
      paintModeButtons();
    }

    if (speedBtn) speedBtn.addEventListener("click", toggleFast);
    forceDayBtn?.addEventListener("click", forceDay);
    forceNightBtn?.addEventListener("click", forceNight);
    pauseTimeBtn?.addEventListener("click", pauseTime);
    autoTimeBtn?.addEventListener("click", resumeAuto);

    addEventListener("keydown", e => {
      if (e.repeat) return;

      if (e.code === "KeyN") {
        toggleFast();
        e.preventDefault();
      } else if (e.code === "Digit1") {
        forceDay();
        e.preventDefault();
      } else if (e.code === "Digit2") {
        forceNight();
        e.preventDefault();
      } else if (e.code === "KeyP" && e.altKey) {
        pauseTime();
        e.preventDefault();
      } else if (e.code === "Digit3") {
        resumeAuto();
        e.preventDefault();
      }
    });

    function updateVisuals() {
      const phase = ((hour - 6) / 24) * Math.PI * 2;
      const rawElevation = Math.sin(phase);
      const day = smoothstep(-0.10, 0.22, rawElevation);
      const twilight = 1 - smoothstep(0.05, 0.45, Math.abs(rawElevation));

      // Sky + fog.
      scene.background.copy(sampleStops(ColorCtor, hour, skyStops));
      if (scene.fog?.color) {
        scene.fog.color.copy(sampleStops(ColorCtor, hour, fogStops));
        scene.fog.density = cfg.fogNightDensity + (cfg.fogDayDensity - cfg.fogNightDensity) * day;
      }

      // Daylight / moonlight. At night the direction is flipped above the horizon.
      let lightPhase = phase;
      let elevation = rawElevation;
      const isNight = rawElevation < 0;
      if (isNight) {
        lightPhase += Math.PI;
        elevation = -rawElevation;
      }

      const horiz = Math.cos(lightPhase);
      const side = Math.sin(lightPhase * 0.57);
      const px = player.x + horiz * 42;
      const py = 8 + Math.max(.08, elevation) * 45;
      const pz = player.z + side * 32;

      sun.position.set(px, py, pz);
      if (sun.target) sun.target.position.set(player.x, game.groundY?.(player.x,player.z) ?? 0, player.z);

      if (isNight) {
        sun.color.setHex(0x7895bd);
        sun.intensity = 0.17 + 0.16 * elevation;
      } else {
        const warm = twilight;
        const dayColor = lerpColor(ColorCtor, 0xffa064, 0xfff4d6, 1-warm);
        sun.color.copy(dayColor);
        sun.intensity = 0.35 + 1.75 * day;
      }

      if (hemi) {
        hemi.intensity = 0.07 + 0.72 * day;
        hemi.color.copy(lerpColor(ColorCtor, 0x6d83a4, 0xcce7ff, day));
        if (hemi.groundColor) hemi.groundColor.copy(lerpColor(ColorCtor, 0x05080b, 0x52614a, day));
      }

      renderer.toneMappingExposure = cfg.nightExposure + (cfg.dayExposure - cfg.nightExposure) * day;

      if (clockEl) {
        const modeLabel =
          mode==="day" ? " • FIXO DIA" :
          mode==="night" ? " • FIXO NOITE" :
          mode==="paused" ? " • PAUSADO" :
          fast ? ` • x${cfg.fastMultiplier}` : "";
        clockEl.textContent =
          `DIA ${survivalDay} • ${formatTime(hour)} • ${phaseName(hour)}${modeLabel}`;
      }
    }

    function loop(now) {
      const dt = Math.min(0.1, Math.max(0, (now-last)/1000));
      last = now;

      const cycleSeconds = Math.max(30, Number(cfg.cycleMinutes || 12) * 60);
      const multiplier = fast ? Math.max(1, Number(cfg.fastMultiplier || 12)) : 1;

      if (!paused) {
        const previousHour=hour;

        hour = wrap24(
          hour +
          (24 / cycleSeconds) *
          dt *
          multiplier
        );

        if(
          crossedHour(
            previousHour,
            hour,
            Number(cfg.sunriseHour)||6
          )
        ){
          advanceSurvivalDay();
        }
      }

      updateVisuals();
      requestAnimationFrame(loop);
    }

    updateVisuals();
    requestAnimationFrame(loop);

    window.gameReview.dayNight = {
      get hour(){ return hour; },
      get day(){ return survivalDay; },
      setDay(d){ return setSurvivalDay(d,true); },
      resetDay(){ return setSurvivalDay(1,true); },
      setHour(h){ hour=wrap24(Number(h)||0); updateVisuals(); },
      get fast(){ return fast; },
      get paused(){ return paused; },
      get mode(){ return mode; },
      toggleFast,
      forceDay,
      forceNight,
      pause: pauseTime,
      resume: resumeAuto
    };

    paintModeButtons();
  }).catch(err => {
    console.error("Ciclo dia/noite:", err);
    const status = document.getElementById("status");
    if (status) status.textContent += " • ciclo dia/noite indisponível";
  });
})();

