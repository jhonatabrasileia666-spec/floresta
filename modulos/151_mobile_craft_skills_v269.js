/* FLORESTA V269 - Fabricacao e Habilidades com layout dark RPG. */
(()=>{'use strict';
const v276Platform=new URLSearchParams(location.search).get('platform');
 if((v276Platform==='pc'||(v276Platform!=='mobile'&&window.__CAVE_PLATFORM!=='mobile'))||window.FlorestaMobile269Craft)return;
const d=document,$=id=>d.getElementById(id),root=d.documentElement;
root.classList.add('v269-mobile');
const css=d.createElement('link');css.rel='stylesheet';css.href='fonte/mobile-menus-v269.css?v=275';d.head.append(css);
let craftContent=null,craftLayout=null,chosenRecipe=null,recipeKey='';
const items=()=>window.florestaV183Art?.items||{};
const norm=v=>String(v||'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
function artFor(name){
 const n=norm(name),keys=/machado/.test(n)?['axe']:/martelo/.test(n)?['hammer']:/picareta/.test(n)?['pickaxe']:/tocha/.test(n)?['torch']:/lanca/.test(n)?['spear']:/fornalha/.test(n)?['furnace']:[];
 return keys.map(k=>items()[k]).find(Boolean)||'';
}
function cards(){return craftContent?[...craftContent.querySelectorAll('.recipe-card')]:[]}
function cardName(c){return c?.querySelector('.recipe-copy h3,h3,strong')?.textContent?.trim()||c?.dataset.recipe||'Receita'}
function recipeAction(c){return c?.querySelector('.craft-start,button[data-craft],button[data-recipe],.recipe-action')}
function selectRecipe(c){chosenRecipe=c;recipeKey=cardName(c);renderCraft()}
function initCraft(){
 const p=d.querySelector('#craftOverlay .craft-panel');
 const content=$('v266CraftScroll')?.querySelector('.craft-content')||p?.querySelector('.craft-content');
 if(!p||!content)return;
 if(craftContent!==content){craftContent=content;chosenRecipe=null;recipeKey='';}
 if(!craftLayout){
  craftLayout=d.createElement('section');craftLayout.id='v269CraftLayout';
  craftLayout.innerHTML='<aside id="v269CraftDetails"><h2 id="v269CraftTitle">Fabricação</h2><p id="v269CraftDesc">Escolha uma receita.</p><div class="v269-craft-flex"><div id="v269CraftPreview"></div><section><h3>Ingredientes</h3><div id="v269CraftCosts"></div></section></div><div class="v269-craft-bottom"><p>Fabricação manual no mundo.</p><button type="button" id="v269CraftStart">COMEÇAR</button></div></aside>';
 }
 if(content.parentElement!==craftLayout){content.before(craftLayout);craftLayout.prepend(content);}
 const start=$('v269CraftStart');
 if(start&&!start.dataset.ready){start.dataset.ready='1';start.addEventListener('click',()=>{
  const c=chosenRecipe?.isConnected?chosenRecipe:cards().find(x=>cardName(x)===recipeKey);
  const b=recipeAction(c);if(b&&!b.disabled)b.click();
 });}
 if(!content.dataset.v269Listener){
  content.dataset.v269Listener='1';
  content.addEventListener('click',e=>{
   const card=e.target.closest('.recipe-card');if(!card)return;
   if(e.target.closest('.craft-start,button')){if(e.isTrusted){e.preventDefault();e.stopImmediatePropagation();}selectRecipe(card);return;}
   e.preventDefault();e.stopImmediatePropagation();selectRecipe(card);
  },true);
  content.addEventListener('pointerdown',e=>{const c=e.target.closest('.recipe-card');if(c)c.dataset.v269Touch=e.clientX+','+e.clientY},true);
  content.addEventListener('pointerup',e=>{
   if(e.pointerType!=='touch')return;const c=e.target.closest('.recipe-card');if(!c)return;
   const a=(c.dataset.v269Touch||'').split(',').map(Number);
   if(a.length!==2||Math.hypot(a[0]-e.clientX,a[1]-e.clientY)>13)return;
   selectRecipe(c);
  },true);
 }
}
function renderCraft(){
 if(!craftLayout?.isConnected)return;const list=cards();if(!list.length)return;
 if(!chosenRecipe?.isConnected)chosenRecipe=list.find(x=>cardName(x)===recipeKey)||list[0];
 const c=chosenRecipe,title=cardName(c);list.forEach(x=>x.classList.toggle('v269-recipe-selected',x===c));
 $('v269CraftTitle').textContent=title;
 $('v269CraftDesc').textContent=c.querySelector('.recipe-copy p,.recipe-description,p')?.textContent?.trim()||'Ferramenta fabricada com materiais coletados na floresta.';
 const pic=$('v269CraftPreview'),src=artFor(title),icon=c.querySelector('.recipe-icon');
 if(src){if(pic.dataset.src!==src){const img=d.createElement('img');img.alt=title;img.src=src;pic.replaceChildren(img);pic.dataset.src=src;}}
 else if(icon){pic.replaceChildren(icon.cloneNode(true));pic.dataset.src='';}
 else{pic.textContent=title;pic.dataset.src='';}
 const cost=c.querySelector('.recipe-costs,.recipe-materials,.recipe-ingredients');
 $('v269CraftCosts').replaceChildren(...(cost?[cost.cloneNode(true)]:[d.createTextNode('Materiais conforme a receita original.')]));
 const origin=recipeAction(c),start=$('v269CraftStart');start.disabled=!origin||origin.disabled;start.textContent=origin?.textContent?.trim()?.toUpperCase()?.slice(0,28)||'COMEÇAR';
}
let skillGrid=null,skillLayout=null,selectedSkill=null,skillName='',nativeUpgrade=false;
function rows(){return skillGrid?[...skillGrid.children].filter(e=>e.nodeType===1):[]}
function nameOf(row){return row?.querySelector('h3,h4,strong,.skill-name,.skill-title')?.textContent?.trim()||'Habilidade'}
function nodes(row){return [...(row?.querySelectorAll('.skill-nodes button,button[data-skill],button[data-upgrade]')||[])];}
function initSkills(){
 const p=$('skillTreePanel'),grid=p?.querySelector('.skill-tree-grid');if(!p||!grid)return;
 if(grid!==skillGrid){skillGrid=grid;selectedSkill=null;skillName='';}
 if(!skillLayout){
  skillLayout=d.createElement('section');skillLayout.id='v269SkillLayout';
  skillLayout.innerHTML='<div class="v269-skill-left"><div class="v269-skill-summary"><span id="v269SkillLevel">Nível 1</span><div><b id="v269SkillBar"></b></div><span id="v269SkillXP"></span></div></div><aside id="v269SkillInfo"><strong id="v269SkillPoints">0 pontos</strong><h2 id="v269SkillTitle">HABILIDADES</h2><p id="v269SkillDesc"></p><p id="v269SkillRank"></p><button type="button" id="v269SkillImprove">MELHORAR <small>1 ponto</small></button></aside>';
 }
 if(grid.parentElement!==skillLayout.querySelector('.v269-skill-left')){grid.before(skillLayout);skillLayout.querySelector('.v269-skill-left').append(grid);}
 const b=$('v269SkillImprove');
 if(b&&!b.dataset.ready){b.dataset.ready='1';b.addEventListener('click',()=>{
  const row=selectedSkill?.isConnected?selectedSkill:rows().find(x=>nameOf(x)===skillName);
  if(!row||!Number(window.gameProgression?.state?.skillPoints||0))return;
  const list=nodes(row);
  const next=list.find(x=>!x.disabled&&!x.classList.contains('active')&&!x.classList.contains('unlocked')&&x.getAttribute('aria-pressed')!=='true')||list.find(x=>!x.disabled);
  if(!next)return;
  nativeUpgrade=true;try{next.click();}finally{nativeUpgrade=false;}queueMicrotask(renderSkills);
 });}
 if(!grid.dataset.v269Ready){
  grid.dataset.v269Ready='1';
  grid.addEventListener('click',e=>{
   if(nativeUpgrade)return;
   const row=e.target.closest('.skill-tree-grid > *');if(!row)return;
   e.preventDefault();e.stopImmediatePropagation();selectedSkill=row;skillName=nameOf(row);renderSkills();
  },true);
  grid.addEventListener('pointerup',e=>{
   if(e.pointerType==='touch'&&!nativeUpgrade){const row=e.target.closest('.skill-tree-grid > *');if(row){selectedSkill=row;skillName=nameOf(row);renderSkills();}}
  },true);
 }
}
function renderSkills(){
 if(!skillLayout?.isConnected)return;
 const list=rows();if(!list.length)return;
 if(!selectedSkill?.isConnected)selectedSkill=list.find(x=>nameOf(x)===skillName)||list[0];
 list.forEach(x=>x.classList.toggle('v269-skill-selected',x===selectedSkill));
 const p=window.gameProgression,st=p?.state||{},xp=Number(st.xp)||0,need=Math.max(1,Number(p?.xpRequired?.())||100),points=Number(st.skillPoints)||0;
 $('v269SkillLevel').textContent='Nível '+(st.level||1);
 $('v269SkillXP').textContent=Math.floor(xp)+' / '+Math.floor(need)+' XP';
 $('v269SkillBar').style.width=(100*Math.min(1,Math.max(0,xp/need)))+'%';
 $('v269SkillPoints').textContent=points+' ponto'+(points===1?'':'s')+' disponível'+(points===1?'':'eis');
 $('v269SkillTitle').textContent=nameOf(selectedSkill).toUpperCase();
 $('v269SkillDesc').textContent=selectedSkill.querySelector('.skill-description,p')?.textContent?.trim()||'Escolha onde investir os pontos obtidos ao subir de nível.';
 const bs=nodes(selectedSkill),owned=bs.filter(x=>x.classList.contains('active')||x.classList.contains('unlocked')||x.getAttribute('aria-pressed')==='true').length;
 $('v269SkillRank').textContent=bs.length?'Progressão: '+owned+' / '+bs.length:'Progresso da habilidade';
 $('v269SkillImprove').disabled=points<1||!bs.some(x=>!x.disabled);
}
function tick(){
 try{initCraft();initSkills();if($('craftOverlay')?.classList.contains('open'))renderCraft();if($('skillTreeOverlay')?.classList.contains('open'))renderSkills();}
 catch(e){if(tick.last!==String(e)){tick.last=String(e);console.warn('[FLORESTA V269] Fabricação/habilidades:',e)}}
}
tick();const clock=setInterval(tick,400);
window.addEventListener('pagehide',()=>clearInterval(clock),{once:true});
window.FlorestaMobile269Craft={version:'V269',sync:tick};
})();
