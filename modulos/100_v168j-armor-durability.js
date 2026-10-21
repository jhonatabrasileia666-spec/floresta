
(async()=>{
  if(window.__V168J_ARMOR_DURABILITY__)return;
  window.__V168J_ARMOR_DURABILITY__=true;
  const wait=ms=>new Promise(r=>setTimeout(r,ms));
  for(let i=0;i<1200;i++){
    if(window.gamePrimitive&&window.gameInventory&&document.getElementById('zombieHud'))break;
    await wait(20);
  }
  const primitive=window.gamePrimitive,inv=window.gameInventory,hud=document.getElementById('zombieHud');
  if(!primitive||!inv||!hud)return;

  const MAX=100;
  let durability=MAX;
  let breaking=false;
  const row=document.createElement('div');
  row.id='armorDurabilityHud';
  row.innerHTML=`<div class="armor-head"><span>ARMADURA</span><span id="armorDurabilityText" class="armor-value">100 / 100</span></div><div id="armorDurabilityTrack"><div id="armorDurabilityBar"></div></div>`;
  const progress=document.getElementById('progressHud');
  if(progress&&progress.parentNode===hud)progress.insertAdjacentElement('afterend',row);
  else hud.appendChild(row);
  const text=document.getElementById('armorDurabilityText');
  const bar=document.getElementById('armorDurabilityBar');

  function armorCount(){return inv.items.find(i=>i.id==='armor')?.quantity||0}
  function update(){
    const equipped=!!primitive.armorEquipped;
    row.classList.toggle('visible',equipped);
    const value=Math.max(0,Math.min(MAX,durability));
    if(text)text.textContent=`${Math.ceil(value)} / ${MAX}`;
    if(bar)bar.style.width=`${value}%`;
    row.classList.toggle('low',value>0&&value<=50);
    row.classList.toggle('critical',value>0&&value<=25);
  }

  const baseEquip=primitive.equipArmor.bind(primitive);
  primitive.equipArmor=function(){
    const was=!!primitive.armorEquipped;
    if(!was&&armorCount()>0&&durability<=0)durability=MAX;
    const ok=baseEquip();
    update();
    return ok;
  };

  function breakArmor(){
    if(breaking||!primitive.armorEquipped)return;
    breaking=true;
    durability=0;
    update();
    setTimeout(()=>{
      if(primitive.armorEquipped)baseEquip();
      inv.removeItem?.('armor',1);
      update();
      const status=document.getElementById('status');
      if(status)status.textContent='Sua armadura primitiva quebrou';
      window.dispatchEvent(new CustomEvent('game:armor-broken'));
      breaking=false;
    },80);
  }

  function damageArmor(amount){
    if(!primitive.armorEquipped||breaking)return false;
    const wear=Math.max(1,Number(amount)||0);
    durability=Math.max(0,durability-wear);
    update();
    window.dispatchEvent(new CustomEvent('game:armor-damaged',{detail:{damage:wear,durability,maxDurability:MAX}}));
    if(durability<=0)breakArmor();
    return true;
  }

  window.addEventListener('game:player-damaged',e=>{
    const amount=Math.max(0,Number(e.detail?.damage)||0);
    if(amount>0)damageArmor(amount);
  });

  Object.defineProperties(primitive,{
    armorDurability:{get:()=>durability},
    armorMaxDurability:{get:()=>MAX}
  });
  primitive.damageArmor=damageArmor;
  primitive.repairArmor=()=>{if(armorCount()>0){durability=MAX;update();return true}return false};
  primitive.breakArmor=breakArmor;
  window.gameArmorDurability={
    version:'V168K-PC',
    get value(){return durability},
    get max(){return MAX},
    get equipped(){return !!primitive.armorEquipped},
    damage:damageArmor,
    repair:primitive.repairArmor,
    break:breakArmor,
    update
  };
  update();
  setInterval(update,500);
})();
