
(() => {
  const canvas = document.getElementById("c");
  const hint = document.getElementById("mouseLockHint");
  const status = document.getElementById("status");
  if (!canvas) return;

  const sensitivityX = 0.00265;
  const sensitivityY = 0.00235;

  function blocked() {
    return !!(
      window.gameInventory?.isOpen ||
      window.gameCraft?.active ||
      window.gamePlayerHit?.active ||
      document.body.classList.contains("crafting-active")
    );
  }

  function isLocked() {
    return document.pointerLockElement === canvas;
  }

  function updateUI() {
    const desktop = matchMedia("(pointer:fine)").matches;
    if (hint) {
      hint.style.display =
        desktop && !isLocked() && !blocked() ? "block" : "none";
    }

    if (isLocked()) {
      document.body.classList.add("fps-pointer-locked");
      canvas.style.cursor = "none";
    } else {
      document.body.classList.remove("fps-pointer-locked");
      canvas.style.cursor = blocked() ? "default" : "crosshair";
    }
  }

  async function lockMouse() {
    if (blocked() || isLocked()) return;
    try {
      // Raw mouse input when the browser/OS supports it.
      const result = canvas.requestPointerLock({unadjustedMovement:true});
      if (result?.catch) await result;
    } catch {
      try {
        const result = canvas.requestPointerLock();
        if (result?.catch) await result;
      } catch (err) {
        console.warn("Pointer Lock:", err);
        if (status) status.textContent = "Clique novamente na tela para capturar o mouse";
      }
    }
  }

  // Capture the FIRST desktop click before the attack and before the old
  // drag-look listener. The first click only enters FPS mouse mode.
  window.addEventListener("pointerdown", e => {
    if (
      e.target !== canvas ||
      e.pointerType !== "mouse" ||
      e.button !== 0 ||
      blocked() ||
      isLocked()
    ) return;

    e.preventDefault();
    e.stopImmediatePropagation();
    lockMouse();
  }, true);

  // True FPS look: movementX/Y has no screen-edge limitation, so the player
  // can turn 360°, 720° or continuously in either direction.
  document.addEventListener("mousemove", e => {
    if (!isLocked() || blocked()) return;

    const p = window.gameReview?.player;
    if (!p) return;

    p.yaw -= e.movementX * sensitivityX;
    p.pitch = Math.max(
      -Math.PI * 88 / 180,
       Math.min(Math.PI * 78 / 180, p.pitch - e.movementY * sensitivityY)
    );
  }, true);

  // Menus need the real cursor. When they open, release the mouse.
  window.addEventListener("keydown", e => {
    if (
      isLocked() &&
      (e.code === "KeyI" || e.code === "KeyR" || e.code === "Escape")
    ) {
      document.exitPointerLock?.();
    }
  }, true);

  document.addEventListener("pointerlockchange", () => {
    updateUI();

    if (status && matchMedia("(pointer:fine)").matches) {
      if (isLocked()) {
        status.textContent = "Mouse capturado • mova livremente • ESC libera";
      } else if (!blocked()) {
        status.textContent = "Mouse livre • clique na tela para voltar ao controle FPS";
      }
    }
  });

  document.addEventListener("pointerlockerror", () => {
    updateUI();
    if (status) status.textContent = "Não foi possível capturar o mouse • clique novamente";
  });

  // Release Pointer Lock only for REAL menus. Temporary gameplay animations
  // (damage reaction and the hands-on crafting sequence) keep the mouse captured.
  // This prevents the player from having to click the game again after taking
  // damage or after the crafting animation finishes.
  function menuNeedsCursor() {
    return !!(
      window.gameInventory?.isOpen ||
      document.getElementById("craftOverlay")?.classList.contains("open") ||
      document.body.classList.contains("skills-open") ||
      document.getElementById("directorOverlay")?.classList.contains("open")
    );
  }

  setInterval(() => {
    if (isLocked() && menuNeedsCursor()) document.exitPointerLock?.();
    updateUI();
  }, 180);

  // Public API for later settings/sensitivity menu.
  window.gameMouseLook = {
    get locked(){ return isLocked(); },
    lock: lockMouse,
    unlock(){ document.exitPointerLock?.(); },
    sensitivityX,
    sensitivityY
  };

  updateUI();
})();
