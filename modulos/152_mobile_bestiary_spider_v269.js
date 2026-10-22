/* FLORESTA V269 - Bestiario e companheira: desenho novo, regras nativas. */
(()=>{'use strict';
const v276Platform=new URLSearchParams(location.search).get('platform');
 if((v276Platform==='pc'||(v276Platform!=='mobile'&&window.__CAVE_PLATFORM!=='mobile'))||window.FlorestaMobile269Creatures)return;
const d=document,$=id=>d.getElementById(id),root=d.documentElement;
root.classList.add('v269-mobile');
const creatureArt={
 skeleton:'<svg viewBox="0 0 270 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Esqueleto armado"><rect width="270" height="340" fill="#171d19"/><path d="M0 310L60 254l70 23 55-41 85 40v64H0Z" fill="#232a22"/><g fill="#b0a998" stroke="#484a42" stroke-width="4"><path d="M111 45l18-19 34 5 15 23-9 42-42 4-19-25Z"/><path d="M117 93l51-2-4 20-40 4Z"/><path d="M123 120l39 0 10 68-20 9-37-17Z"/><path d="M117 194l14 7-21 81-15-5ZM150 199l16-4 19 83-17 4Z"/><path d="M119 132L84 149l-14 54 15 6 13-40 29-20ZM160 135l25 15 23 45-16 9-21-36-22-11Z"/></g><g stroke="#d7cab0" stroke-width="6" fill="none"><path d="M117 145Q138 130 166 146M117 155Q139 142 169 157M121 167Q140 155 165 168"/><path d="M137 118v73"/></g><path d="M119 55l18-7 5 12-7 10-13-4Zm31-8 16 7-3 13-17 0Z" fill="#252821"/><path d="M141 69l-7 13 17 0Z" fill="#30322b"/><path d="M122 86l7 7 27-2 8-7" stroke="#3e4037" stroke-width="5" fill="none"/><path d="M84 190l-7-15-8 10-22-110-6 2L62 193l-12 24 11 3 11-19 12 1Z" fill="#8c8b7d"/><path d="M182 165l24-18 38 18v69l-27 32-38-32Z" fill="#44382a" stroke="#8a7660" stroke-width="7"/><path d="M185 178h55M205 155l4 97" stroke="#a08e6a" stroke-width="6"/></svg>',
 wolf:'<svg viewBox="0 0 270 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Lobisomem na neblina"><rect width="270" height="340" fill="#1a2020"/><circle cx="210" cy="65" r="43" fill="#a54a40" opacity=".42"/><path d="M83 130l-15-72 45 35 37-7 39-36 1 76 24 31-10 42 21 75-22 10-35-67-10 47-8 55h-23l-5-75-19-26-28 70-22-12 19-85-13-43Z" fill="#292d2a" stroke="#585b4f" stroke-width="6"/><path d="M93 127l30-21 50 4 18 32-15 20-53-7Z" fill="#4a4037"/><path d="M111 130l14 3-9 12-13-4Zm44-1 15 4-6 11-15-4Z" fill="#d75c4b"/><path d="M120 163l13 25 9-26 9 18 8-18" fill="#e6d3ab"/><path d="M20 290L65 245l23 20 24-19 34 28 21-12 45 24 58-21v75H0Z" fill="#1b2320"/></svg>',
 unknown:'<svg viewBox="0 0 270 340" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Criatura desconhecida"><rect width="270" height="340" fill="#171b1a"/><path d="M65 297l14-180 32-41 53 0 29 41 16 180Z" fill="#0d100e"/><circle cx="135" cy="147" r="67" fill="#202420"/><text x="135" y="189" text-anchor="middle" font-family="Georgia,serif" font-size="133" font-weight="700" fill="#b2ada1">?</text></svg>'
};
const known=[
{id:'skeleton',title:'Esqueleto',sub:'Guerreiro das sombras',behavior:'Avança em grupo e usa espada e escudo para atacar e defender.',where:'Encontrado durante a noite.'},
{id:'wolf',title:'Lobisomem',sub:'Predador da lua vermelha',behavior:'Persegue a presa na neblina e pode assumir uma forma monstruosa.',where:'Aparece em noites imprevisíveis.'},
{id:'necromancer',title:'Necromante',sub:'Feiticeiro dos mortos',behavior:'Mantém distância, invoca magia e tenta ressuscitar mortos-vivos.',where:'Encontrado durante o avanço pela floresta.'},
{id:'centaur-skeleton',title:'Centauro Esqueleto',sub:'Guerreiro da necrópole',behavior:'Avança velozmente e ataca no corpo a corpo.',where:'Criatura perigosa da floresta.'},
{id:'centaur-fire',title:'Centauro de Fogo',sub:'Lançador de caveiras flamejantes',behavior:'Ataca à distância e pode lançar projéteis de fogo.',where:'Uma das ameaças sobrenaturais.'},
{id:'unknown',title:'Desconhecido',sub:'Registro não identificado',behavior:'Uma presença ainda não catalogada na floresta.',where:'Explore o mundo para encontrar novas ameaças.'}
];
const esc=s=>String(s||'').replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]));
let bestiary=null,spiderSvg='',page='bestiary',selected='unknown',spiderDone=false;
const hasFound=id=>!!window.gameBestiaryDiscoveryV273?.has?.(id);
function setupBst(){
 const p=$('directorPanel');if(!p)return;
 if(!bestiary){
  bestiary=d.createElement('section');bestiary.id='v269Bestiary';
  bestiary.innerHTML='<nav class="v269-bst-tabs"><button type="button" data-bst-page="bestiary">Bestiário</button><button type="button" data-bst-page="companions">Companheiros</button></nav><div class="v269-bst-body"><nav id="v269CreatureList" aria-label="Lista de criaturas"></nav><div id="v269CreatureArt" class="v269-bst-art"></div><section class="v269-bst-info"><h2 id="v269CreatureTitle"></h2><p id="v269CreatureSubtitle"></p><h3>Comportamento</h3><p id="v269CreatureBehavior"></p><p id="v269CreatureWhere"></p><button id="v269OpenSpider" type="button" hidden>ABRIR ARANHA</button></section></div>';
  bestiary.addEventListener('click',e=>{
   const tab=e.target.closest('[data-bst-page]');
   if(tab){page=tab.dataset.bstPage;selected=page==='companions'?(hasFound('spider')?'spider':'unknown'):(known.find(x=>x.id!=='unknown'&&hasFound(x.id))?.id||'unknown');renderBestiary();return;}
   const b=e.target.closest('[data-bst-creature]');
   if(b){const id=b.dataset.bstCreature;if(id!=='unknown'&&!hasFound(id))return;selected=id;renderBestiary();return;}
   if(e.target.closest('#v269OpenSpider')){$('directorClose')?.click();$('v207SpiderOpen')?.click();}
  });
  p.append(bestiary);
 }
 let tools=$('v269DirectorTools');
 if(!tools){tools=d.createElement('details');tools.id='v269DirectorTools';tools.innerHTML='<summary>Ferramentas de invocação · Criativo</summary>';p.append(tools);}
 for(const ch of [...p.children]){
  if(ch===bestiary||ch===tools||ch.classList.contains('director-head')||ch.classList.contains('u173-tabs'))continue;
  tools.append(ch);
 }
 const title=p.querySelector('.director-head h2');if(title&&title.dataset.v269Title!=='1'){title.textContent='CRIATURAS';title.dataset.v269Title='1';}
 if(!spiderSvg)spiderSvg=$('v207SpiderPanel')?.querySelector('.v207-spider-portrait svg')?.outerHTML||
 '<svg viewBox="0 0 240 340" xmlns="http://www.w3.org/2000/svg"><ellipse cx="120" cy="160" rx="73" ry="65" fill="#3d362e"/><circle cx="120" cy="95" r="37" fill="#433b30"/><path d="M67 131L17 56 3 82M67 167 15 165 4 235M77 188 35 247 53 317M173 131 224 56 236 82M173 167 225 165 236 235M163 188 205 247 187 317" stroke="#40382d" stroke-width="15" fill="none"/></svg>';
 if(!bestiary.dataset.v269Rendered){renderBestiary();bestiary.dataset.v269Rendered='1';}
}
function renderBestiary(){
 if(!bestiary?.isConnected)return;
 bestiary.querySelectorAll('[data-bst-page]').forEach(b=>b.classList.toggle('selected',b.dataset.bstPage===page));
 const unknown={id:'unknown',title:'Desconhecido'};
 const entries=page==='companions'?(hasFound('spider')?[{id:'spider',title:'Aranha'}]:[unknown]):[...known.filter(x=>x.id!=='unknown'&&hasFound(x.id)),unknown];
 if(selected!=='unknown'&&!entries.some(x=>x.id===selected))selected=entries[0]?.id||'unknown';
 $('v269CreatureList').innerHTML=entries.map(c=>'<button type="button" data-bst-creature="'+c.id+'" class="'+(selected===c.id?'selected':'')+'"><span class="v269-bst-thumb">'+(c.id==='spider'?spiderSvg:creatureArt[c.id]||creatureArt.unknown)+'</span><span>'+esc(c.title)+'</span></button>').join('');
 const found=known.find(x=>x.id===selected)||known.find(x=>x.id==='unknown');
 const entity=page==='companions'&&selected==='spider'?{title:'Aranha',sub:'Companheira e transporte',behavior:'Permite montar e transportar materiais. As ações usam os controles reais da montaria.',where:'Abra o painel para chamar, montar ou carregar a aranha.'}:selected==='unknown'?{title:'Desconhecido',sub:'Registro ainda não descoberto',behavior:'Encontre a criatura no mundo para revelar suas características e seu modelo 3D.',where:'Explore a floresta. Novas descobertas ficam salvas nesta partida.'}:found;
 $('v269CreatureTitle').textContent=entity.title.toUpperCase();
 $('v269CreatureSubtitle').textContent=entity.sub;
 $('v269CreatureBehavior').textContent=entity.behavior;
 $('v269CreatureWhere').textContent=entity.where;
 $('v269CreatureArt').innerHTML=selected==='spider'?spiderSvg:creatureArt[selected]||creatureArt.unknown;
 window.FlorestaBestiary3D?.select?.(selected==='unknown'?'unknown':selected);
 $('v269OpenSpider').hidden=page!=='companions'||!hasFound('spider');
}
function setupSpider(){
 const p=$('v207SpiderPanel');if(!p||spiderDone)return;
 if(!spiderSvg)spiderSvg=p.querySelector('.v207-spider-portrait svg')?.outerHTML||'';
 p.innerHTML='<header class="v269-spider-head"><h2>ARANHA</h2><div><output id="v269SpiderHp">SEM ARANHA</output><div class="v269-spider-life"><i id="v269SpiderHpFill"></i></div></div><button type="button" data-close-spider aria-label="Fechar aranha">×</button></header><div class="v269-spider-layout"><div class="v269-spider-preview">'+spiderSvg+'</div><div class="v269-spider-right"><div class="v269-spider-buttons"><button type="button" data-spider="mount">MONTAR</button><button type="button" data-spider="spawn">CHAMAR</button><button type="button" data-spider="load">GUARDAR CARGA</button><button type="button" data-spider="unload">RETIRAR CARGA</button></div><div class="v269-spider-cargo"><h3>Carga <strong id="v207CargoCount">0 / 15</strong></h3><div><span>▰</span><span>Troncos</span><output id="v269Logs">0</output></div><div><span>▱</span><span>Tábuas</span><output id="v269Planks">0</output></div></div></div></div>';
 spiderDone=true;
}
function updateSpider(){
 if(!spiderDone)return;
 const spider=(window.gameCreativeSpiderMount?.spiders||[]).find(x=>!x.dead);
 const hp=spider?Math.max(0,Number(spider.hp)||0):0;
 $('v269SpiderHp').textContent=spider?Math.round(hp)+' / 100':'SEM ARANHA';
 $('v269SpiderHpFill').style.width=(spider?Math.min(100,hp):0)+'%';
 const stored=(window.gameSpiderCargo?.items||[]).filter(x=>x.spider&&['loading','loaded'].includes(x.state));
 $('v207CargoCount').textContent=stored.length+' / 15';
 $('v269Logs').textContent=stored.filter(x=>x.kind==='log').length;
 $('v269Planks').textContent=stored.filter(x=>x.kind==='plank').length;
}
function sync(){
 try{
  setupBst();setupSpider();
  if($('directorOverlay')?.classList.contains('open')){
   const creative=!!window.gameTestMode?.active||!!window.gameHackMode?.state?.active||!!window.gameHackMode?.active;
   $('v269DirectorTools').hidden=!creative;
  }
  if($('v207SpiderPanel')?.classList.contains('open'))updateSpider();
 }catch(e){if(sync.last!==String(e)){sync.last=String(e);console.warn('[FLORESTA V269] Bestiário:',e)}}
}
sync();const clock=setInterval(sync,420);
window.addEventListener('pagehide',()=>clearInterval(clock),{once:true});
window.addEventListener('floresta:bestiary-updated',()=>{if(bestiary?.isConnected)renderBestiary()});
window.FlorestaMobile269Creatures={version:'V273',sync,get selected(){return selected==='unknown'?'unknown':selected},get page(){return page}};
})();
