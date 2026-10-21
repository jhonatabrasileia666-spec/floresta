(()=>{
 const specs=[{id:'ignisBossHudV74',api:'gameIgnis',name:'Ignis, O Intocado',meta:'.ignis-meta'}, {id:'giganteBossHudV92',api:'gameGiantBoss',name:'Gigante da Névoa',meta:'.meta'}];
 const entries=new Map();let lastLayout='';
 function sync(){
  for(const s of specs){const hud=document.getElementById(s.id);if(!hud)continue;let e=entries.get(s.id);
   if(!e){hud.querySelectorAll('.f183-boss-img').forEach(i=>i.remove());hud.classList.remove('f183-boss-graphic');hud.classList.add('health221-boss');
    const meta=hud.querySelector(s.meta);for(const child of [...hud.children])if(child!==meta)child.classList.add('health221-legacy');
    const canvas=document.createElement('canvas');canvas.width=1280;canvas.height=256;canvas.className='health221-boss-art';canvas.setAttribute('role','meter');canvas.setAttribute('aria-label','Vida de '+s.name);hud.prepend(canvas);
    e={...s,hud,canvas,last:''};entries.set(s.id,e);if(meta)meta.classList.add('health221-boss-meta');
   }
   const api=window[s.api],native=hud.querySelector('#demonTHp')?.textContent?.split('/').map(Number);
   const hp=api?.hp??native?.[0]??0,max=api?.maxHp??native?.[1]??1,key=hp+'/'+max;
   if(key!==e.last){const state=EnemyBars221.draw(e.canvas,s.name,hp,max);e.canvas.setAttribute('aria-valuemin','0');e.canvas.setAttribute('aria-valuemax',state.maxHp);e.canvas.setAttribute('aria-valuenow',state.hp);e.canvas.dataset.ratio=state.ratio;e.canvas.dataset.theme=state.theme.id;e.last=key;}
  }
  const active=[...entries.values()].filter(e=>e.id==='demonTrollocHud'?e.hud.style.display!=='none':e.hud.classList.contains('show'));
  const key=active.map(e=>e.id).join(',')+'/'+innerWidth+'/'+innerHeight;
  if(key!==lastLayout){lastLayout=key;let top=Math.max(12,parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--safe-area-inset-top'))||0);for(const e of active){e.hud.classList.toggle('health221-stacked',active.length>1);e.hud.style.setProperty('--health221-top',top+'px');top+=e.hud.getBoundingClientRect().height+9}}
 }
 const timer=setInterval(sync,100);addEventListener('pagehide',()=>clearInterval(timer),{once:true});sync();window.gameBossBars221={entries,sync};
})();
