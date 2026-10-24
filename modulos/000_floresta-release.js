/* FLORESTA: identificacao publica da compilacao. Gerado a partir de versao-manifest.json. */
(()=>{'use strict';
const build=Object.freeze({"name":"FLORESTA","version":"V281","number":281,"date":"2026-10-23","edition":"Portal independente e botão de entrada testável","base":"V265","saveSchema":2,"platforms":["PC","Mobile"],"manifest":"versao-manifest.json"});
Object.defineProperty(window,'FlorestaBuild',{value:build,enumerable:true,configurable:false,writable:false});
const params=new URLSearchParams(location.search),platform=params.get('platform'),ua=navigator.userAgent||'';
const mobile=platform==='mobile'||platform!=='pc'&&(/Android|iPad|iPhone|iPod|Mobile/i.test(ua)||matchMedia('(pointer:coarse)').matches||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1));
// Explicit mobile URLs take priority over legacy Jogo.html device detection.
if(platform==='mobile'){try{window.__CAVE_PLATFORM='mobile'}catch(e){console.warn('[V276] Legacy platform flag is read-only; mobile modules use URL fallback.',e)}}
if(platform==='pc'){try{window.__CAVE_PLATFORM='pc'}catch{}}
if(mobile)document.documentElement.classList.add('v266-mobile');
const apply=()=>{
 // Lobby online carregado separadamente: nunca bloqueia o modo solo.
 if(!document.getElementById('florestaOnlineMVP1Loader')){
  const online=document.createElement('script');online.id='florestaOnlineMVP1Loader';
  online.src='modulos/157_floresta_duo_supabase.js?v=duo-3';
  online.onload=()=>{
   const bridge=document.createElement('script');
   bridge.src='modulos/158_floresta_duo_world.js?v=duo-3';bridge.id='florestaDuoWorldLoader';
   bridge.onerror=()=>console.warn('[DUO] Ponte de mundo não carregou; conexão de jogadores continua.');
   document.body.append(bridge);
  };
  online.onerror=()=>console.warn('[FLORESTA ONLINE] Módulo não disponível; modo solo preservado.');
  const remoteAvatar=document.createElement('script');
  remoteAvatar.id='florestaDuoNativeAvatar159Loader';
  remoteAvatar.src='modulos/159_floresta_duo_native_avatar.js?v=duo-3';
  remoteAvatar.onload=()=>document.body.append(online);
  remoteAvatar.onerror=()=>{console.warn('[DUO] Rig remoto indisponível; fallback temporário.');document.body.append(online);};
  document.body.append(remoteAvatar);
 }
 // Portal independente dos inimigos e do HUD: deve ser carregado em PC e mobile.
 if(!document.getElementById('florestaCavePortal281Loader')){
  const p=document.createElement('script');p.id='florestaCavePortal281Loader';
  p.src='modulos/155_cave_portal_guarantee_v281.js?v=281';
  p.onerror=()=>console.error('[FLORESTA] Arquivo do portal V281 indisponível');
  document.body.append(p);
 }

 if(mobile&&!document.getElementById('florestaMobile266Loader')){const el=document.createElement('script');el.id='florestaMobile266Loader';el.src='modulos/148_mobile_interfaces_v266.js?v=281';el.onload=()=>{const r=document.createElement('script');r.src='modulos/149_mobile_rpg_v267.js?v=281';r.onload=()=>{const n=document.createElement('script');n.src='modulos/150_mobile_gestures_v268.js?v=281';n.onload=()=>{const inv=document.createElement('script');inv.src='modulos/151_mobile_inventory_v269.js?v=281';inv.onload=()=>{const a=document.createElement('script');a.src='modulos/151_mobile_craft_skills_v269.js?v=281';a.onload=()=>{const discovery=document.createElement('script');discovery.src='modulos/154_bestiary_discovery_v273.js?v=281';discovery.onload=()=>{const b=document.createElement('script');b.src='modulos/152_mobile_bestiary_spider_v269.js?v=281';b.onload=()=>{const viewer=document.createElement('script');viewer.src='modulos/153_mobile_bestiary_3d_v272.js?v=281';document.body.append(viewer)};document.body.append(b)};document.body.append(discovery)};document.body.append(a)};document.body.append(inv)};document.body.append(n)};document.body.append(r)};document.body.append(el);}

 document.documentElement.dataset.florestaVersion=build.version;
 document.title='FLORESTA '+build.version+' — '+(mobile?'Mobile':'PC');
 const tag=document.querySelector('meta[name="floresta-version"]');if(tag)tag.content=build.version;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();

/* Mobile V281: camada de adaptação carregada sem bloquear o portal da caverna. */
(()=>{'use strict';const q=new URLSearchParams(location.search).get('platform');const mobile=q==='mobile'||q!=='pc'&&(/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent||'')||matchMedia('(pointer:coarse)').matches);if(!mobile)return;
const load=()=>{if(document.getElementById('florestaMobile281Loader'))return;const s=document.createElement('script');s.id='florestaMobile281Loader';s.src='modulos/155_mobile_foundation_v281.js?v=281';s.onerror=()=>console.warn('[Floresta V281] Camada mobile não carregada');document.body.append(s)};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',load,{once:true});else load();})();
