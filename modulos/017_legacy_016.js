

(() => {
  const overlay = document.getElementById("inventoryOverlay");
  const panel = overlay?.querySelector(".inventory-panel");
  const grid = document.getElementById("inventoryGrid");
  const closeBtn = document.getElementById("inventoryClose");
  const openBtn = document.getElementById("inventoryBtn");
  const equipAction = document.getElementById("inventoryEquip");

  // V64 — branch/graveto can be held in either real hand.
  const branchHandActions = document.createElement("div");
  branchHandActions.id = "inventoryBranchHands";
  branchHandActions.style.cssText =
    "display:none;grid-template-columns:1fr 1fr;gap:8px;margin-top:8px";

  const branchLeftBtn = document.createElement("button");
  branchLeftBtn.type = "button";
  branchLeftBtn.className = "inventory-primary";
  branchLeftBtn.textContent = "Mão esquerda";

  const branchRightBtn = document.createElement("button");
  branchRightBtn.type = "button";
  branchRightBtn.className = "inventory-primary";
  branchRightBtn.textContent = "Mão direita";

  const branchStoreBtn = document.createElement("button");
  branchStoreBtn.type = "button";
  branchStoreBtn.className = "inventory-primary";
  branchStoreBtn.textContent = "Guardar graveto";
  branchStoreBtn.style.gridColumn = "1 / -1";

  branchHandActions.append(
    branchLeftBtn,
    branchRightBtn,
    branchStoreBtn
  );

  equipAction?.insertAdjacentElement(
    "afterend",
    branchHandActions
  );

  const capacity = document.getElementById("inventoryCapacity");
  const weightEl = document.getElementById("inventoryWeight");

  if (!overlay || !grid || !openBtn) return;

  let slots = 20;
  let opened = false;
  let selectedId = "torch";

  const items = [
    {
      id: "torch",
      name: "Tocha",
      type: "Ferramenta",
      quantity: 1,
      weight: 1.2,
      description: "Fonte de luz portátil. Pode ser equipada ou guardada sem sair do inventário."
    }
  ];

  const torchSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M46 42h8v48h-8z" fill="currentColor" opacity=".72"/>
      <path d="M39 36h22v17H39z" fill="#6c3f21"/>
      <path d="M50 7c12 12 10 24 0 31-10-8-12-20 0-31Z" fill="#ffb02e"/>
      <path d="M50 14c6 7 5 14 0 19-5-5-6-12 0-19Z" fill="#fff1a8"/>
    </svg>`;

  const rockSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M17 66 29 35 55 20 79 34 88 63 70 82 35 84Z"
        fill="#777a72"/>
      <path d="M29 35 55 20 63 49 42 60Z" fill="#9a9d94"/>
      <path d="M42 60 63 49 88 63 70 82 35 84Z" fill="#5e625b"/>
    </svg>`;

  const branchSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M16 78 81 21" stroke="#8b572f" stroke-width="11" stroke-linecap="round"/>
      <path d="M46 53 36 29" stroke="#8b572f" stroke-width="7" stroke-linecap="round"/>
      <path d="M63 39 84 47" stroke="#8b572f" stroke-width="7" stroke-linecap="round"/>
      <path d="M23 72 18 57" stroke="#6b3f24" stroke-width="5" stroke-linecap="round"/>
    </svg>`;

  const vineSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M28 70c-17-17-7-43 15-46 22-3 37 16 27 33-9 15-30 15-37 2-5-10 3-20 13-18 9 1 13 10 9 17"
        fill="none" stroke="#58723b" stroke-width="8" stroke-linecap="round"/>
      <path d="M24 73c14 10 34 8 47-2" fill="none" stroke="#354b2a" stroke-width="5" stroke-linecap="round"/>
      <path d="M66 30c9-8 16-7 20-1-7 1-12 5-16 11Z" fill="#738e4b"/>
      <path d="M28 55c-9-7-16-5-19 2 7 0 12 3 17 9Z" fill="#657f43"/>
    </svg>`;

  const hammerSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M47 31h8v61h-8z" fill="#986238"/>
      <path d="M24 21 45 12 71 18 80 34 67 48 38 46 20 34Z" fill="#73736e"/>
      <path d="M24 27c15 1 35 2 51 8" fill="none" stroke="#54341f" stroke-width="4"/>
      <path d="M27 34c15 1 30 2 43 8" fill="none" stroke="#6b4328" stroke-width="4"/>
      <path d="M44 48c6 3 13 3 18 0" fill="none" stroke="#54341f" stroke-width="4"/>
      <path d="M45 66c7 2 11 2 16 0M45 73c7 2 11 2 16 0M45 80c7 2 11 2 16 0" fill="none" stroke="#654027" stroke-width="3"/>
    </svg>`;

  const axeSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M45 24h9v67h-9z" fill="#85502f"/>
      <path d="M50 18 78 25 67 46 45 42Z" fill="#7d827b"/>
      <path d="M76 25 86 30 68 49 65 43Z" fill="#bec3b9"/>
      <path d="M42 43 59 44" stroke="#5d3c24" stroke-width="5"/>
    </svg>`;

  const woodChipSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M17 62 54 18 68 25 46 68Z" fill="#c99763"/>
      <path d="M40 79 70 33 82 42 60 84Z" fill="#ae7647"/>
      <path d="M23 66 46 39" stroke="#7a4d2b" stroke-width="4" stroke-linecap="round"/>
      <path d="M48 76 68 48" stroke="#76502f" stroke-width="4" stroke-linecap="round"/>
    </svg>`;

  const woodShieldSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M50 10 82 23 77 61 50 89 23 61 18 23Z"
        fill="#a96d38" stroke="#6f4324" stroke-width="5"/>
      <path d="M30 24v42M42 18v57M55 16v61M68 22v45"
        stroke="#d5a06a" stroke-width="5" opacity=".7"/>
      <path d="M24 43h52" stroke="#5d3820" stroke-width="7"/>
      <circle cx="50" cy="43" r="7" fill="#7d5a38"/>
    </svg>`;

  const spearSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M47 36h6v60h-6z" fill="#9d7147"/>
      <path d="M50 3L39 36 50 46 60 35z" fill="#959a91"/>
      <path d="M45 42h11m-11 5h11m-11 5h11m-11 20h11m-11 5h11" stroke="#59432b" stroke-width="4"/>
    </svg>`;

  const armorSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M25 17l15 7h20l15-7 18 16-17 14-6-12 3 49-23 10-23-10 3-49-6 12L7 33z" fill="#62523d"/>
      <path d="M38 28l-5 53m17-52v56m12-57l5 53M26 44h48M27 68h47" stroke="#ae996a" stroke-width="4"/>
    </svg>`;

  const slatSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M19 12l20-4 5 80-21 7zm32 4l19-9 13 79-22 8z" fill="#987347"/>
    </svg>`;

  const shaftSvg = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <path d="M20 91L79 8" stroke="#9a7448" stroke-width="10" stroke-linecap="round"/>
    </svg>`;

  function iconFor(id) {
    const sprite217=window.florestaV183Art?.items?.[id];
    if(sprite217)return `<img class="f183-item-art" src="${sprite217}" alt="" draggable="false">`;
    if (id?.startsWith("alq_potion_")) return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M41 10h18v22l8 11v38c0 7-34 7-34 0V43l8-11z" fill="#a5cfcb" stroke="#d1e8de" stroke-width="4"/><path d="M36 57h28v22H36z" fill="#b4496d"/><rect x="39" y="8" width="22" height="10" rx="2" fill="#886d49"/></svg>`;
    if (id?.startsWith("alq_herba_")||id?.startsWith("alq_dried_")||id?.startsWith("alq_powder_")) return `<svg viewBox="0 0 100 100" aria-hidden="true"><path d="M48 90Q52 45 61 19" stroke="#887b42" fill="none" stroke-width="8"/><path d="M52 48Q18 22 14 47Q20 78 52 64M56 53Q84 19 90 39Q90 67 56 70" fill="#76915b"/></svg>`;
    const f183=window.florestaV183Art?.items?.[id];
    if(f183)return `<img class="f183-item-art" src="${f183}" alt="" draggable="false">`;
    if (id === "torch") return torchSvg;
    if (id === "rock") return rockSvg;
    if (id === "branch") return branchSvg;
    if (id === "vine") return vineSvg;
    if (id === "axe") return axeSvg;
    if (id === "hammer") return hammerSvg;
    if (id === "spear") return spearSvg;
    if (id === "armor") return armorSvg;
    if (id === "slat") return slatSvg;
    if (id === "shaft") return shaftSvg;
    if (id === "wood_chip") return woodChipSvg;
    if (id === "wood_shield") return woodShieldSvg;
    return "";
  }

  function game() {
    return window.gameReview || null;
  }

  function totalWeight() {
    return items.reduce((sum, item) => sum + item.weight * item.quantity, 0);
  }

  function torchEquipped() {
    const g = game();
    try {
      return typeof g?.isEquipped === "function" ? !!g.isEquipped() : true;
    } catch {
      return true;
    }
  }

  function updateDetails() {
    const item = items.find(i => i.id === selectedId) || items[0];

    document.getElementById("inventoryType").textContent = item?.type || "Vazio";
    document.getElementById("inventoryQty").textContent = item ? `x${item.quantity}` : "";
    document.getElementById("inventoryItemName").textContent = item?.name || "Slot vazio";
    document.getElementById("inventoryDescription").textContent =
      item?.description || "Este espaço está vazio.";
    document.getElementById("inventoryItemWeight").textContent =
      item ? `${item.weight.toFixed(1).replace(".", ",")} kg` : "—";

    const preview = document.getElementById("inventoryPreview");
    if (preview) preview.innerHTML = item ? iconFor(item.id) : "";

    if (equipAction) {
      const isBranch = item?.id === "branch";

      equipAction.style.display =
        isBranch ? "none" : "";

      branchHandActions.style.display =
        isBranch ? "grid" : "none";

      if (isBranch) {
        const side =
          window.gameBranchHands?.side || null;

        const ready =
          !!window.gameBranchHands &&
          item.quantity > 0;

        branchLeftBtn.disabled = !ready;
        branchRightBtn.disabled = !ready;
        branchStoreBtn.disabled = !side;

        branchLeftBtn.textContent =
          side === "left"
            ? "✓ Mão esquerda"
            : "Mão esquerda";

        branchRightBtn.textContent =
          side === "right"
            ? "✓ Mão direita"
            : "Mão direita";

        branchStoreBtn.textContent =
          side
            ? "Guardar graveto"
            : "Graveto guardado";
      } else if (item?.id === "torch") {
        equipAction.disabled = false;
        equipAction.textContent = torchEquipped() ? "Guardar tocha" : "Equipar tocha";
      } else if (item?.id === "axe") {
        equipAction.disabled = !window.gameRightHand;
        equipAction.textContent =
          window.gameRightHand?.current === "axe" ? "Guardar machado" : "Equipar na mão direita";
      } else if (item?.id === "rock") {
        equipAction.disabled = !window.gameRightHand;
        equipAction.textContent =
          window.gameRightHand?.current === "rock" ? "Guardar pedra" : "Pegar pedra na mão direita";
      } else if (item?.id === "hammer") {
        equipAction.disabled = !window.gameRightHand;
        equipAction.textContent =
          window.gameRightHand?.current === "hammer" ? "Guardar martelo" : "Equipar martelo na mão direita";
      } else if (item?.id === "pickaxe") {
        equipAction.disabled=!!window.gameCraft?.active;equipAction.textContent=window.gameRightHand?.current==="pickaxe"?"Guardar picareta":"Equipar picareta";
      } else if (item?.id === "spear") {
        equipAction.disabled = !window.gameRightHand || !!window.gameCraft?.active;
        equipAction.textContent =
          window.gameRightHand?.current === "spear" ? "Guardar lança" : "Equipar lança nas mãos";
      } else if (item?.id === "armor") {
        equipAction.disabled = !window.gamePrimitive || !!window.gameCraft?.active;
        equipAction.textContent =
          window.gamePrimitive?.armorEquipped ? "Guardar armadura" : "Vestir armadura";
      } else if (item?.id === "wood_chip") {
        equipAction.disabled =
          item.quantity < 1 ||
          !window.gameShieldCraft;

        equipAction.textContent =
          window.gameRightHand?.current === "wood_chip"
            ? "Guardar lasca"
            : "Pegar lasca na mão direita";
      } else if (item?.id?.startsWith("alq_potion_")) {
        equipAction.disabled = !window.gamePotionSlot219 || item.quantity < 1;
        equipAction.textContent = window.gamePotionSlot220?.equipped===item.id ? "Guardar frasco" : "Equipar na mão esquerda";
      } else if (["forged_shadow_axe","forged_silver_sword","forged_silver_spear","forged_silver_shield","forged_shadow_halberd","forged_silver_longsword"].includes(item?.id)) {
        const equip=window.gameForgedEquipmentV230;
        equipAction.disabled=!equip||item.quantity<1;
        equipAction.textContent=equip?.isEquipped(item.id)?"Guardar equipamento":item.id.includes('shield')?"Equipar na mão esquerda":"Equipar na mão direita";
      } else if (item?.id === "wood_shield") {
        equipAction.disabled =
          !window.gameShield;

        equipAction.textContent =
          window.gameShield?.equipped
            ? "Guardar escudo"
            : "Equipar escudo na mão esquerda";
      } else {
        equipAction.disabled = true;
        equipAction.textContent = "Sem ação";
      }
    }

    capacity.textContent = `${items.length} / ${slots}`;
    weightEl.textContent =
      `Peso ${totalWeight().toFixed(1).replace(".", ",")} / 25 kg`;
  }

  function render() {
    grid.innerHTML = "";

    for (let i = 0; i < slots; i++) {
      const item = items[i];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "inventory-slot" + (!item ? " empty" : "") +
        (item?.id === selectedId ? " selected" : "");
      btn.setAttribute("role", "gridcell");
      btn.setAttribute("aria-label", item ? `${item.name}, quantidade ${item.quantity}` : "Slot vazio");

      if (item) {
        btn.innerHTML = `
          <span class="inventory-item-icon">${iconFor(item.id)}</span>
          <span class="inventory-item-qty">${item.quantity}</span>
          <span class="inventory-item-name">${item.name}</span>`;
        btn.addEventListener("click", () => {
          selectedId = item.id;
          render();
          updateDetails();
        });
      } else {
        btn.disabled = true;
      }

      grid.appendChild(btn);
    }

    updateDetails();
  }

  function releaseMovement() {
    const g = game();
    if (g?.keys?.clear) g.keys.clear();
    if (g?.stick) {
      if ("x" in g.stick) g.stick.x = 0;
      if ("y" in g.stick) g.stick.y = 0;
    }

    for (const code of [
      "KeyW","KeyA","KeyS","KeyD",
      "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
      "ShiftLeft","ShiftRight","ControlLeft","ControlRight","KeyC","Space"
    ]) {
      window.dispatchEvent(new KeyboardEvent("keyup", {code, bubbles:true}));
    }
  }

  function openInventory() {
    if (opened) return;
    opened = true;
    releaseMovement();
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("inventory-open");
    openBtn.setAttribute("aria-pressed", "true");
    openBtn.textContent = "Fechar inventário (I)";
    render();
    setTimeout(() => closeBtn?.focus(), 0);
  }

  function closeInventory() {
    if (!opened) return;
    opened = false;
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("inventory-open");
    openBtn.setAttribute("aria-pressed", "false");
    openBtn.textContent = "Inventário (I)";
    openBtn.focus();
  }

  function toggleInventory() {
    opened ? closeInventory() : openInventory();
  }

  // Capture phase: when the inventory is open, gameplay keyboard input does not
  // reach the movement/controller listeners underneath it.
  window.addEventListener("keydown", e => {
    if (e.code === "KeyI" && !e.repeat) {
      e.preventDefault();
      e.stopImmediatePropagation();
      toggleInventory();
      return;
    }

    if (opened && e.code === "Escape") {
      e.preventDefault();
      e.stopImmediatePropagation();
      closeInventory();
      return;
    }

    if (opened) {
      const blocked = [
        "KeyW","KeyA","KeyS","KeyD",
        "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
        "ShiftLeft","ShiftRight","ControlLeft","ControlRight",
        "KeyC","Space","KeyE","KeyF","KeyN","KeyQ","KeyR"
      ];
      if (blocked.includes(e.code)) {
        e.preventDefault();
        e.stopImmediatePropagation();
      }
    }
  }, true);

  window.addEventListener("keyup", e => {
    if (!opened) return;
    const blocked = [
      "KeyW","KeyA","KeyS","KeyD",
      "ArrowUp","ArrowDown","ArrowLeft","ArrowRight",
      "ShiftLeft","ShiftRight","ControlLeft","ControlRight",
      "KeyC","Space","KeyE","KeyF","KeyN","KeyQ","KeyR"
    ];
    if (blocked.includes(e.code)) {
      e.preventDefault();
      e.stopImmediatePropagation();
    }
  }, true);

  openBtn.addEventListener("click", toggleInventory);
  closeBtn?.addEventListener("click", closeInventory);

  overlay.addEventListener("pointerdown", e => {
    if (e.target === overlay) closeInventory();
  });

  panel?.addEventListener("pointerdown", e => e.stopPropagation());

  equipAction?.addEventListener("click", () => {
    const item = items.find(i => i.id === selectedId);
    if (item?.id?.startsWith("alq_potion_") && window.gameHerbalAlchemy) {
      window.gameInventory?.close?.();
      window.gamePotionSlot220?.equipped===item.id ? window.gamePotionSlot220.unequip() : window.gamePotionSlot220?.equip(item.id);
    } else if (item?.id === "torch") {
      const gameEquipButton = document.getElementById("equipBtn");
      if (gameEquipButton) gameEquipButton.click();
    } else if (item?.id === "axe" && window.gameRightHand) {
      if (window.gameRightHand.current === "axe") window.gameRightHand.unequip();
      else window.gameRightHand.equip("axe");
    } else if (item?.id === "rock" && window.gameRightHand) {
      if (window.gameRightHand.current === "rock") window.gameRightHand.unequip();
      else window.gameRightHand.equip("rock");
    } else if (item?.id === "hammer" && window.gameRightHand) {
      if (window.gameRightHand.current === "hammer") window.gameRightHand.unequip();
      else window.gameRightHand.equip("hammer");
    } else if (item?.id === "pickaxe" && window.gameRightHand) {
      window.gameRightHand.toggle("pickaxe");
    } else if (item?.id === "spear" && window.gameRightHand) {
      if (window.gameRightHand.current === "spear") window.gameRightHand.unequip();
      else window.gameRightHand.equip("spear");
    } else if (item?.id === "armor") {
      window.gamePrimitive?.equipArmor?.();
    } else if (item?.id === "wood_chip" && window.gameShieldCraft) {
      if (window.gameRightHand?.current === "wood_chip") {
        window.gameShieldCraft.unequipChip?.();
      } else {
        window.gameShieldCraft.equipChip?.();
      }
    } else if (["forged_shadow_axe","forged_silver_sword","forged_silver_spear","forged_silver_shield","forged_shadow_halberd","forged_silver_longsword"].includes(item?.id)) {
      window.gameForgedEquipmentV230?.toggle(item.id);
    } else if (item?.id === "wood_shield" && window.gameShield) {
      if (window.gameShield.equipped) window.gameShield.unequip?.();
      else window.gameShield.equip?.();
    }
    updateDetails();
  });

  branchLeftBtn.addEventListener("click", () => {
    window.gameBranchHands?.toggle?.("left");
    updateDetails();
    render();
  });

  branchRightBtn.addEventListener("click", () => {
    window.gameBranchHands?.toggle?.("right");
    updateDetails();
    render();
  });

  branchStoreBtn.addEventListener("click", () => {
    window.gameBranchHands?.unequip?.();
    updateDetails();
    render();
  });

  // Public API for the next step: pickups, crafting, chests, etc.
  window.gameInventory = {
    get isOpen() { return opened; },
    get items() { return items.map(i => ({...i})); },
    get capacity() { return slots; },
    open: openInventory,
    close: closeInventory,
    toggle: toggleInventory,
    refresh: render,
    setCapacity(n) { slots = Math.max(20,Math.min(120,Math.floor(Number(n)||20))); render(); return slots; },
    addItem(item) {
      if (!item?.id || !item?.name) return false;
      const current = items.find(i => i.id === item.id);
      if (current) {
        current.quantity += Math.max(1, Number(item.quantity) || 1);
      } else {
        if (items.length >= slots) return false;
        items.push({
          id: String(item.id),
          name: String(item.name),
          type: String(item.type || "Item"),
          quantity: Math.max(1, Number(item.quantity) || 1),
          weight: Math.max(0, Number(item.weight) || 0),
          description: String(item.description || "")
        });
      }
      render();
      return true;
    },
    removeItem(id, quantity=1) {
      const index = items.findIndex(i => i.id === id);
      if (index < 0) return false;
      items[index].quantity -= Math.max(1, Number(quantity) || 1);
      if (items[index].quantity <= 0) {
        if (
          (id === "rock" || id === "hammer" || id === "spear" || id === "pickaxe") &&
          window.gameRightHand?.current === id
        ) {
          window.gameRightHand.unequip();
        }

        if (
          id === "branch" &&
          window.gameBranchHands?.side
        ) {
          window.gameBranchHands.unequip();
        }

        if (
          id === "wood_chip" &&
          window.gameRightHand?.current === "wood_chip"
        ) {
          window.gameShieldCraft?.unequipChip?.();
        }

        if (
          id === "wood_shield" &&
          window.gameShield?.equipped
        ) {
          window.gameShield.unequip?.();
        }

        items.splice(index,1);
        selectedId = items[0]?.id || null;
      }
      render();
      return true;
    }
  };

  render();
})();

