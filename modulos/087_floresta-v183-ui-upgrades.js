
(()=>{
 const a=window.florestaV183Art;if(!a)return;
 const IDMAP={inventoryBtn:'bag',craftBtn:'craft',constructionBtn:'construction',skillTreeBtn:'powers',equipBtn:'bag',directorBtn:'map',f172MenuBtn:'pause',f182MenuDifficulty:'settings'};
 const change=()=>{
  for(const [id,k] of Object.entries(IDMAP)){
   const el=document.getElementById(id);
   if(!el||el.dataset.v183Decorated)return;
   el.dataset.v183Decorated='1';const image=document.createElement('img');image.className='f183-menu-inline-icon';image.src=a.ui[k];image.alt='';image.draggable=false;el.prepend(image);
  }
  // Tooling tabs may be created lazily after first opening inventory/crafting.
  for(const b of document.querySelectorAll('.u173-tabs button')){
   if(b.dataset.v183Decorated)continue;
   b.dataset.v183Decorated='1';const label=(b.textContent||'').toLowerCase();let k=label.includes('invent')?'bag':label.includes('fabr')?'craft':label.includes('constr')?'construction':label.includes('habil')?'powers':'map';
   const img=document.createElement('img');img.className='f183-menu-inline-icon';img.src=a.ui[k];img.alt='';b.prepend(img);
  }
 };
 change();const t=setInterval(change,1200);addEventListener('pagehide',()=>clearInterval(t),{once:true});
 window.gameArtV183={version:'V183',get availableBars(){return Object.keys(a.bars)},get availableItems(){return Object.keys(a.items)},refresh:change};
})();
