/* FLORESTA V281: portal 3D da caverna carregado separadamente dos inimigos. */
(()=>{'use strict';
if(window.FlorestaCavePortalV281)return;
const X=-15,Z=-59,clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
let portal=null,cta=null,locator=null,notice=null,creating=false,entering=false,lastTap=0,expires=0,status='boot',failure='';
function distance(p){
 if(!p)return Infinity;const q=clamp((Z-p.z)/8.3,0,1);
 return Math.hypot(p.x-X,p.z-(Z-8.3*q));
}
function playing(){const f=window.gameFront172;return !!f?.started&&!f?.paused&&f?.shell?.hidden!==false;}
function message(s,error=false){status=s;if(error)failure=s;console[error?'warn':'info']('[Caverna V281]',s);
 if(notice){notice.textContent=s;notice.hidden=false;expires=performance.now()+(error?22000:4500);}
}
function ui(){
 if(!document.body)return;
 if(!document.getElementById('cave281Style')){
  const st=document.createElement('style');st.id='cave281Style';st.textContent=[
 '#cave281Entry{position:fixed!important;z-index:5005!important;bottom:max(83px,17dvh);left:50%;transform:translateX(-50%);',
 'padding:12px 18px!important;min-height:54px!important;max-width:87vw!important;border:1px solid #a69a79!important;',
 'border-radius:3px!important;background:#17231def!important;color:#f3e3c3!important;',
 'font:700 clamp(12px,2vw,17px)/1.2 Georgia,serif!important;touch-action:manipulation!important;',
 'box-shadow:0 8px 22px #000b!important;display:none;}',
 '#cave281Locator{position:fixed;top:max(55px,env(safe-area-inset-top));left:50%;transform:translateX(-50%);',
 'z-index:3800;background:#111a14db;color:#e4d3ac;border:1px solid #585b4b;padding:6px 12px;',
 'font:600 12px/1.3 Georgia,serif;pointer-events:none;display:none;}',
 '#cave281Notice{position:fixed;left:50%;top:25%;transform:translateX(-50%);z-index:6005;width:min(560px,86vw);',
 'padding:12px 16px;background:#111b16f5;color:#e3dcc6;border:1px solid #a48e6a;',
 'box-shadow:0 5px 25px #000c;font:14px/1.4 system-ui;text-align:center;pointer-events:none;}',
 '#cave281Notice[hidden]{display:none!important}',
 'body.cave281-near:not(.cave186) #cave186Prompt,',
 'body.cave281-near:not(.cave186) #cave186EntryFallbackV279{display:none!important}',
 '@media(orientation:landscape) and (max-height:400px){#cave281Entry{bottom:10px!important;min-height:42px!important;padding:8px!important}',
 '#cave281Locator{top:37px!important;font-size:11px}}'
 ].join('');document.head.append(st);
 }
 if(!cta){
  cta=document.createElement('button');cta.id='cave281Entry';cta.type='button';
  cta.textContent='ENTRAR NA CAVERNA DA RAINHA';
  cta.addEventListener('pointerup',e=>{if(e.pointerType!=='touch')return;e.preventDefault();e.stopPropagation();lastTap=Date.now();void enter();});
  cta.addEventListener('click',e=>{e.stopPropagation();if(Date.now()-lastTap<650)return;void enter();});
  document.body.append(cta);
 }
 if(!locator){locator=document.createElement('div');locator.id='cave281Locator';document.body.append(locator);}
 if(!notice){notice=document.createElement('div');notice.id='cave281Notice';notice.hidden=true;notice.setAttribute('role','status');document.body.append(notice);}
}
function fallback(T,G){
 const root=new T.Group();root.name='Cave186_Entrance';
 const y=G.groundY(X,Z);root.position.set(X,Number.isFinite(y)?y:0,Z-4.5);
 const rock=new T.MeshStandardMaterial({color:0x475047,roughness:1,flatShading:true,side:T.DoubleSide});
 const black=new T.MeshBasicMaterial({color:0x050706,side:T.DoubleSide});
 const gold=new T.MeshBasicMaterial({color:0xa08b5c});
 function mesh(geom,mat,x,y,z,sx=1,sy=1,sz=1){
  const m=new T.Mesh(geom,mat);m.position.set(x,y,z);m.scale.set(sx,sy,sz);root.add(m);
 }
 mesh(new T.PlaneGeometry(8.0,7.9),black,0,3.9,-1.5);
 for(const side of [-1,1]){
  mesh(new T.IcosahedronGeometry(1,0),rock,side*4,3.0,-1.5,1.6,3.2,1.8);
  mesh(new T.IcosahedronGeometry(1,0),rock,side*2.5,7.3,-1.5,2.7,1.5,1.6);
 }
 mesh(new T.IcosahedronGeometry(1,0),rock,0,8.2,-1.5,3.6,1.2,1.6);
 mesh(new T.TorusGeometry(.9,.1,6,25),gold,0,5,1.3);
 const glow=new T.PointLight(0xc0a176,1.1,20);glow.position.set(0,4.2,2);root.add(glow);
 G.scene.add(root);
 return {root,x:X,z:Z,y:root.position.y,front:{x:X,z:Z},portal:{x:X,z:Z-8.3},fallback:true};
}
function ensurePortal(){
 const G=window.gameReview,T=window.__THREE_MODULE;
 if(!G?.scene||!G?.player||typeof G.groundY!=='function'||!T?.Mesh)return false;
 const found=window.__CAVE186_ENTRANCE_V279;
 if(found?.root?.parent===G.scene){if(portal?.fallback&&portal!==found)portal.root.removeFromParent();portal=found;return true;}
 if(portal?.root?.parent===G.scene)return true;
 if(creating)return false;creating=true;
 try{
  if(typeof window.createForestCaveEntrance==='function'){
   try{portal=window.createForestCaveEntrance(T,G);}
   catch(e){console.warn('[Caverna] Entrada original falhou, usando arco seguro:',e);portal=fallback(T,G);}
  }else portal=fallback(T,G);
  window.__CAVE186_ENTRANCE_V279=portal;status='portal-construido';return true;
 }catch(e){failure=String(e?.message||e);console.error('[Caverna] Falha no portal 3D:',e);return false;}
 finally{creating=false;}
}
function script(src){return new Promise((yes,no)=>{const s=document.createElement('script');s.async=false;s.src=src;s.onload=yes;s.onerror=()=>no(Error('Arquivo indisponível: '+src));document.body.append(s);});}
async function controller(){
 if(typeof window.gameSpiderCave?.enter==='function')return window.gameSpiderCave;
 if(!window.FlorestaCaveWorld)await script('modulos/093_legacy_092.js?v=281');
 if(!window.createForestCaveEntrance)await script('modulos/094_legacy_093.js?v=281');
 if(!window.FlorestaStream?.data)await script('modulos/000_floresta-stream-v254.js?v=281');
 if(!window.__CAVE186_BOOT_V279?.loading&&!window.gameSpiderCave?.enter)await script('modulos/096_legacy_095.js?v=281');
 const startedAt=Date.now();
 while(Date.now()-startedAt<37000){
  if(typeof window.gameSpiderCave?.enter==='function')return window.gameSpiderCave;
  if(window.__CAVE186_BOOT_V279?.error)throw Error(window.__CAVE186_BOOT_V279.error);
  await new Promise(resolve=>setTimeout(resolve,200));
 }
 throw Error('Controlador da caverna não respondeu.');
}
async function enter(){
 if(entering)return false;
 const G=window.gameReview;
 if(!playing()){message('Inicie uma partida para acessar a caverna.',true);return false;}
 if(!G?.player||distance(G.player)>12.8){message('Aproxime-se da entrada da caverna.',true);return false;}
 entering=true;cta.disabled=true;cta.textContent='PREPARANDO A ENTRADA...';
 try{
  const c=await controller();cta.textContent='CARREGANDO A CAVERNA...';
  const ok=await c.enter();
  if(ok===false){message('Entrada acionada; o interior não concluiu o carregamento.',true);return false;}
  status='entrada-realizada';return true;
 }catch(e){message('Não foi possível entrar: '+String(e?.message||e),true);return false;}
 finally{entering=false;cta.disabled=false;cta.textContent='ENTRAR NA CAVERNA DA RAINHA';}
}
function tick(){
 ui();
 const ready=ensurePortal(),G=window.gameReview,d=distance(G?.player);
 const show=ready&&playing()&&!window.gameSpiderCave?.active;
 const near=show&&d<=10.8,loc=show&&d<85;
 document.body.classList.toggle('cave281-near',near);
 if(cta)cta.style.display=near?'block':'none';
 if(locator){locator.style.display=loc?'block':'none';if(loc)locator.textContent=near?'CAVERNA DA RAINHA · ENTRADA':'CAVERNA DA RAINHA · '+Math.round(d)+' m';}
 if(notice&&!notice.hidden&&performance.now()>expires)notice.hidden=true;
}
ui();tick();const timer=setInterval(tick,400);
window.addEventListener('pagehide',()=>clearInterval(timer),{once:true});
window.FlorestaCavePortalV281={version:'V281',get status(){return status},get error(){return failure},get portal(){return portal},get distance(){return distance(window.gameReview?.player)},enter,ensure:ensurePortal};
})();