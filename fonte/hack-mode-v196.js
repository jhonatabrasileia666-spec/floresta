/* FLORESTA V196 — MODO HACK OPCIONAL
   Integra diretamente o inventário, as receitas V195, a montaria V37
   e os modelos reais de troncos/tábuas. Desligado por padrão. */
(()=>{'use strict';
if(window.gameHackMode)return;
const $=id=>document.getElementById(id);
const mobile=window.__CAVE_PLATFORM==='mobile'||matchMedia('(pointer:coarse)').matches;
const state={enabled:false,infinite:false,open:false,ready:false};
const RESOURCE=[
 ['rock','Pedra','Recurso',.6],['branch','Galho','Recurso',.3],['vine','Cipó','Fibra natural',.18],
 ['wood_chip','Lasca de madeira','Material de fogo',.05],['slat','Ripa de madeira','Material de construção',.35],
 ['shaft','Cabo de madeira','Material de construção',.45],['iron_ore','Minério de ferro','Material',.45]];
const GEAR=[
 ['torch','Tocha','Ferramenta',1.2],['axe','Machado de pedra','Ferramenta',1.1],
 ['hammer','Martelo primitivo','Ferramenta',1.35],['spear','Lança','Arma',1.25],
 ['wood_shield','Escudo de madeira','Equipamento',2.2],['armor','Armadura primitiva','Equipamento',3.1]];
function item([id,name,type,weight],quantity,description){return {id,name,type,weight,quantity,description:description||'Item original do Floresta liberado pelo Modo Hack.'};}
const style=document.createElement('style');style.id='floresta-v196-hack-style';style.textContent=`
#florestaHackBtn{position:fixed;top:96px;left:16px;z-index:1750;display:none;border:1px solid #bda36e;border-radius:9px;padding:10px 13px;color:#f0deac;background:linear-gradient(130deg,#201d17,#0a0d0b);font:700 12px Georgia,serif;letter-spacing:1.1px;box-shadow:0 5px 20px #0009;cursor:pointer}
#florestaHackBtn.on{border-color:#e6bb60;box-shadow:0 0 16px #d39b4244;}
#florestaHackOverlay{display:none;position:fixed;inset:0;z-index:2400;background:#000a;backdrop-filter:blur(5px);align-items:center;justify-content:center;padding:12px;font-family:Georgia,'Times New Roman',serif;color:#e9ddbc}
#florestaHackOverlay.open{display:flex;pointer-events:auto;cursor:auto!important} #florestaHackOverlay.open *{cursor:auto!important} #florestaHackOverlay.open button{cursor:pointer!important}
#florestaHackPanel{width:min(700px,100%);max-height:calc(100dvh - 24px);overflow:auto;scrollbar-color:#99815a #171712;background:linear-gradient(160deg,#26241d 0%,#151712 65%,#11130f 100%);border:1px solid #8f7851;border-radius:16px;box-shadow:0 25px 65px #000c;padding:18px}
#florestaHackPanel h2{margin:0;color:#e7c781;font:700 24px Georgia,serif}#florestaHackPanel h3{color:#d8b978;font:700 15px Georgia,serif;margin:8px 0}
#florestaHackPanel p{line-height:1.45;color:#c7c3b2;font-size:13px;margin:8px 0 13px}
#florestaHackPanel .hdr{display:flex;justify-content:space-between;align-items:center;gap:10px;border-bottom:1px solid #8f785155;padding-bottom:11px}
#florestaHackPanel .close{min-width:40px;min-height:40px}
#florestaHackPanel button{border:1px solid #8c7956;background:#32372b;color:#f0e3c8;border-radius:8px;padding:11px 12px;font:700 13px Georgia,serif;cursor:pointer;min-height:40px}
#florestaHackPanel button:hover,#florestaHackPanel button:focus-visible{background:#62563c}
#florestaHackPanel button:disabled{opacity:.45;cursor:not-allowed}
#florestaHackPanel button.major{background:#786032;color:#fff5ce;border-color:#d1b478}
#florestaHackPanel button.off{background:#4f2d2a;border-color:#ad6560}
#florestaHackPanel .hackgrid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px}
#florestaHackPanel section{border-top:1px solid #a48d5544;padding:11px 0 3px}
#florestaHackPanel .hint{font:12px/1.45 system-ui,sans-serif;color:#c2b9a1;margin:8px 0}
#florestaHackPanel .status{border:1px solid #8f785166;background:#191a14;border-radius:8px;padding:10px;font:13px/1.45 system-ui,sans-serif;color:#d8caa5;margin-top:8px;min-height:38px}
#florestaHackPanel .badge{font:700 12px system-ui,sans-serif;color:#d3a766}
@media(pointer:coarse){#florestaHackBtn{left:auto;right:10px;top:96px;padding:10px}#florestaHackPanel{padding:12px}#florestaHackPanel .hackgrid{grid-template-columns:1fr 1fr}#florestaHackPanel button{font-size:12px;min-height:46px}body.hack-v196-spider #mountTouchV3{display:flex!important;bottom:110px;right:8px}body.hack-v196-spider #mountTouchSpawnV3{display:none!important}}
@media(max-width:390px){#florestaHackPanel .hackgrid{grid-template-columns:1fr}}
body.hack-v196-open #florestaHackBtn{display:none!important}
`;document.head.appendChild(style);
const toggle=document.createElement('button');toggle.id='florestaHackBtn';toggle.type='button';toggle.textContent='HACK · Z';toggle.title='Abrir ou fechar Modo Hack (Z)';document.body.appendChild(toggle);
const overlay=document.createElement('div');overlay.id='florestaHackOverlay';overlay.setAttribute('role','dialog');overlay.setAttribute('aria-modal','true');overlay.setAttribute('aria-label','Modo Hack Floresta');
overlay.innerHTML=`<div id="florestaHackPanel">
 <header class="hdr"><div><div class="badge">FLORESTA · MODO OPCIONAL</div><h2>Modo Hack</h2></div><button type="button" class="close" data-act="close" aria-label="Fechar menu">✕</button></header>
 <p>Use todos os recursos e a aranha original V37 sem mudar de mapa. O Hack começa desligado para preservar a Sobrevivência.</p>
 <div class="hackgrid"><button type="button" id="hackEnable" class="major" data-act="toggle">ATIVAR MODO HACK</button><button type="button" id="hackInfinite" data-act="infinite">Materiais infinitos: NÃO</button></div>
 <section><h3>Inventário e alquimia</h3><div class="hackgrid"><button type="button" data-act="all">RECEBER TODOS OS ITENS</button><button type="button" data-act="resources">Repor materiais ×99</button><button type="button" data-act="gear">Todas as ferramentas</button><button type="button" data-act="alchemy">Ervas, pós e poções</button></div><div class="hint">Itens vão para o inventário real do Floresta. O livro de alquimia reconhece as nove espécies. Os materiais físicos de construção continuam sendo colocados peça a peça. O pacote de materiais agora inclui minério de ferro.</div></section>
 <section><h3>Montaria e madeira</h3><div class="hackgrid"><button type="button" data-act="spider">CHAMAR ARANHA V37</button><button type="button" data-act="mount">Montar / descer</button><button type="button" data-act="logs">Gerar 3 troncos</button><button type="button" data-act="planks">Gerar 5 tábuas</button></div><div class="hint">A aranha usa o modelo, a escalada, as animações, os ataques e os controles originais. Aproxime-se dela e use E/M (PC) ou MONTAR (Mobile). Ela fica no mundo depois de desligar o Hack.</div></section>
 <section><h3>Jogador</h3><div class="hackgrid"><button type="button" data-act="heal">Recuperar vida</button><button type="button" data-act="inventory">Abrir inventário</button></div></section>
 <div id="florestaHackStatus" class="status" role="status" aria-live="polite">Desligado. Inicie a partida para usar.</div>
 </div>`;document.body.appendChild(overlay);
const stat=$('florestaHackStatus');
function notify(s){stat.textContent=s;const hud=$('status');if(hud&&state.enabled)hud.textContent=s;}
function gameReady(){return !!(window.gameReview?.player&&window.gameInventory&&(window.gameFront172?.started||window.gameTestMode?.active))}
function close(){
 state.open=false;overlay.classList.remove('open');document.body.classList.remove('hack-v196-open');window.gameReview?.keys?.clear?.();
 const locked=state.oldPointer;state.oldPointer=null;
 if(locked?.isConnected && gameReady())try{const p=locked.requestPointerLock?.();p?.catch?.(()=>{});}catch(e){}
}
function open(){
 if(state.open)return true;
 window.gameInventory?.close?.();window.gameHud171?.close?.();
 state.oldPointer=document.pointerLockElement || null;
 try{if(document.pointerLockElement)document.exitPointerLock?.();}catch(e){}
 state.open=true;overlay.classList.add('open');document.body.classList.add('hack-v196-open');
 window.gameReview?.keys?.clear?.();
 updateUI();
 if(!gameReady())notify('Menu carregado. Para liberar itens, entre na Sobrevivência ou no Criativo e ative o Hack.');
 return true;
}
function setEnabled(on){if(on&&!gameReady()){notify('Inicie a partida primeiro.');return false;}state.enabled=!!on;if(!on)state.infinite=false;updateUI();notify(on?'Modo Hack ativado. Escolha os itens ou chame a montaria.':'Modo Hack desligado. Consumo normal restaurado; os itens recebidos permanecem.');return true;}
function setInfinite(on){if(on&&!state.enabled){notify('Ative o Modo Hack primeiro.');return false;}state.infinite=!!on;updateUI();notify(on?'Materiais infinitos ativados: nenhum item do inventário será consumido.':'Materiais infinitos desligados: itens voltam a ser consumidos normalmente.');return true;}
function addOrRefill(meta,target){const inv=window.gameInventory;if(!inv)return false;const old=inv.items.find(i=>i.id===meta.id)?.quantity||0;return old>=target||inv.addItem({...meta,quantity:target-old});}
function growInventory(){window.gameInventory?.setCapacity?.(80);}
function grantResources(){if(!state.enabled){notify('Ative o Hack antes de receber itens.');return false;}growInventory();let count=0;for(const x of RESOURCE)if(addOrRefill(item(x,99),99))count++;notify(`${count}/${RESOURCE.length} materiais disponíveis no inventário (até 99 de cada).`);return count===RESOURCE.length;}
function grantGear(){if(!state.enabled){notify('Ative o Hack antes de receber equipamentos.');return false;}growInventory();let count=0;for(const x of GEAR)if(addOrRefill(item(x,1),1))count++;notify(`${count}/${GEAR.length} ferramentas e equipamentos liberados. Equipe pelo inventário.`);return count===GEAR.length;}
function grantAlchemy(){if(!state.enabled){notify('Ative o Hack antes de receber ervas.');return false;}growInventory();const alq=window.gameHerbalAlchemy;if(!alq?.herbs||!alq?.recipes){notify('O sistema de alquimia ainda está carregando.');return false;}let n=0;for(const herb of alq.herbs){const base=herb.name;alq.discovered.add(herb.id);const list=[
 {id:'alq_herba_'+herb.id,name:base+' (fresca)',type:'Erva',quantity:30,weight:.05,description:'Pode ser pendurada no varal independente.'},
 {id:'alq_dried_'+herb.id,name:base+' (seca)',type:'Erva seca',quantity:30,weight:.025,description:'Coloque no pilão para triturar.'},
 {id:'alq_powder_'+herb.id,name:'Pó de '+base,type:'Pó de alquimia',quantity:30,weight:.03,description:'Misture na bancada de alquimia.'}
 ];for(const m of list){if(addOrRefill(m,30))n++;}
 }for(const r of alq.recipes){if(addOrRefill({id:'alq_potion_'+r.id,name:'Frasco de '+r.name,type:'Frasco de alquimia',quantity:12,weight:.18,description:'Frasco pronto para uso. '+r.desc},12))n++;}
 try{alq.save?.()}catch(e){console.warn('Hack: falha salvando herbário',e)}
 for(const h of alq.herbs){alq.state.fresh[h.id]=window.gameInventory.items.find(i=>i.id==='alq_herba_'+h.id)?.quantity||0;alq.state.dry[h.id]=window.gameInventory.items.find(i=>i.id==='alq_dried_'+h.id)?.quantity||0;alq.state.powder[h.id]=window.gameInventory.items.find(i=>i.id==='alq_powder_'+h.id)?.quantity||0;}
 for(const r of alq.recipes)alq.state.bottles[r.id]=window.gameInventory.items.find(i=>i.id==='alq_potion_'+r.id)?.quantity||0;
 notify(`${n} grupos de itens de alquimia concedidos; ${alq.herbs.length} espécies descobertas, ${alq.recipes.length} receitas desbloqueadas.`);return true;}
function grantAll(){if(!state.enabled)setEnabled(true);growInventory();grantResources();grantGear();const ok=grantAlchemy();notify(ok?'Todos os itens liberados: ferramentas, materiais, nove plantas (fresca/seca/pó) e cinco poções.':'Materiais e ferramentas liberados; tente Ervas, pós e poções após carregar a alquimia.');return true;}
function mountApi(){return window.gameCreativeSpiderMount;}
function summon(){if(!state.enabled){notify('Ative o Modo Hack para chamar uma montaria.');return null;}const api=mountApi();if(!api?.spawn){notify('O modelo da aranha ainda está carregando. Aguarde a montaria ficar pronta e toque em CHAMAR ARANHA novamente.');return null;}try{const spider=api.spawn();if(spider){notify('Aranha V37 criada à sua frente. Aproxime-se do corpo e pressione E ou M para escalar e montar.');return spider;}notify('Não foi possível gerar a aranha agora (limite ou carregamento).');return null;}catch(e){console.error(e);notify('Falha ao chamar aranha: '+e.message);return null;}}
function ride(){const api=mountApi();if(!api?.mount){notify('Sistema de montaria ainda não disponível.');return false;}if(!api.mounted&&!api.spiders?.length){notify('Primeiro use Chamar Aranha V37.');return false;}if(api.mounted){api.dismount?.();notify('Desmontando.');return true;}
 const g=window.gameReview,p=g?.player;if(!p)return false;let closest=null,dist=Infinity;for(const sp of api.spiders||[]){if(sp.dead)continue;const d=Math.hypot(sp.pivot.position.x-p.x,sp.pivot.position.z-p.z);if(d<dist){dist=d;closest=sp;}}
 if(!closest){notify('Não há aranhas disponíveis.');return false;}
 if(dist>4.1){notify('Aproxime-se da aranha para escalar. Ela está a '+dist.toFixed(1)+' metros.');return false;}
 api.mount();notify(api.climbing?'Escalada iniciada.':'Comando de montaria enviado. Aproxime-se do corpo da aranha e aguarde a animação de escalada carregar.');return true;}
function wood(kind,n){if(!state.enabled){notify('Ative o Modo Hack para gerar madeira.');return false;}if(!window.gameSpiderCargo?.spawn){notify('O sistema de madeira da aranha ainda está carregando.');return false;}let done=0;for(let i=0;i<n;i++){if(window.gameSpiderCargo.spawn(kind))done++;}notify(done?`${done} ${kind==='log'?'troncos':'tábuas'} originais gerados no chão à sua frente.`:'Madeira indisponível: aguarde os modelos originais carregarem.');return done>0;}
function heal(){if(!state.enabled){notify('Ative o Hack para recuperar vida.');return false;}window.gameZombie?.healPlayer?.(99999);notify('Vida recuperada pelo sistema original.');return true;}
function updateUI(){toggle.classList.toggle('on',state.enabled);toggle.textContent=state.enabled?'HACK ON · Z':'HACK · Z';$('hackEnable').textContent=state.enabled?'DESLIGAR MODO HACK':'ATIVAR MODO HACK';$('hackEnable').classList.toggle('off',state.enabled);$('hackInfinite').textContent='Materiais infinitos: '+(state.infinite?'SIM':'NÃO');$('hackInfinite').classList.toggle('major',state.infinite);}
overlay.addEventListener('click',e=>{if(e.target===overlay)close();});
$('florestaHackPanel').addEventListener('click',e=>{const btn=e.target.closest('button[data-act]');if(!btn)return;switch(btn.dataset.act){
case 'close':close();break;case 'toggle':setEnabled(!state.enabled);break;case 'infinite':setInfinite(!state.infinite);break;case 'resources':grantResources();break;case 'gear':grantGear();break;case 'alchemy':grantAlchemy();break;case 'all':grantAll();break;
case 'spider':summon();break;case 'mount':ride();break;case 'logs':wood('log',3);break;case 'planks':wood('plank',5);break;case 'heal':heal();break;
case 'inventory':close();window.gameInventory?.open?.();break;
}});
toggle.addEventListener('click',()=>state.open?close():open());
window.addEventListener('keydown',e=>{if(!state.open)return;if(e.code==='Escape'){e.preventDefault();e.stopImmediatePropagation();close();return;}if(['KeyW','KeyA','KeyS','KeyD','Space','KeyE','KeyF','KeyL','KeyM','KeyR','KeyI','KeyP','KeyJ','KeyU','KeyK'].includes(e.code)){e.preventDefault();e.stopImmediatePropagation();}},true);
const orig=[];
function attachInventory(){const inv=window.gameInventory;if(!inv||state.ready)return;state.ready=true;const remove=inv.removeItem.bind(inv);
inv.removeItem=function(id,qty=1){if(!state.enabled||!state.infinite)return remove(id,qty);const current=inv.items.find(x=>x.id===id);if(!current)return false;return true;};
orig.push(remove);
}
const heartbeat=setInterval(()=>{
 const playing=gameReady();toggle.style.display='block';
 if(playing)attachInventory();
 // Keep Android/iOS mount controls visible when a summoned spider exists in survival.
 const spider=mountApi();document.body.classList.toggle('hack-v196-spider',playing&&mobile&&!window.gameTestMode?.active&&!!(spider?.mounted||spider?.spiders?.some(s=>!s.dead)));
 if(state.open)window.gameReview?.keys?.clear?.();
},600);
window.addEventListener('pagehide',()=>clearInterval(heartbeat),{once:true});
window.gameHackMode={version:'V196.2',state,get enabled(){return state.enabled},get infinite(){return state.infinite},open,close,toggle:()=>state.open?close():open(),setEnabled,setInfinite,grantAll,grantResources,grantGear,grantAlchemy,summon,ride,spawnWood:wood};
updateUI();console.info('[FLORESTA] V196.2 Hack integrado no HTML (Z e botão), com minério de ferro nos materiais.');
})();
