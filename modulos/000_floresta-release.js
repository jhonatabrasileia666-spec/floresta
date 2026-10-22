/* FLORESTA: identificacao publica da compilacao. Gerado a partir de versao-manifest.json. */
(()=>{'use strict';
const build=Object.freeze({"name":"FLORESTA","version":"V276","number":276,"date":"2026-10-22","edition":"HUD touch garantido no Safari iPhone","base":"V265","saveSchema":2,"platforms":["PC","Mobile"],"manifest":"versao-manifest.json"});
Object.defineProperty(window,'FlorestaBuild',{value:build,enumerable:true,configurable:false,writable:false});
const params=new URLSearchParams(location.search),platform=params.get('platform'),ua=navigator.userAgent||'';
const mobile=platform==='mobile'||platform!=='pc'&&(/Android|iPad|iPhone|iPod|Mobile/i.test(ua)||matchMedia('(pointer:coarse)').matches||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1));
// Explicit mobile URLs take priority over legacy Jogo.html device detection.
if(platform==='mobile'){try{window.__CAVE_PLATFORM='mobile'}catch(e){console.warn('[V276] Legacy platform flag is read-only; mobile modules use URL fallback.',e)}}
if(platform==='pc'){try{window.__CAVE_PLATFORM='pc'}catch{}}
if(mobile)document.documentElement.classList.add('v266-mobile');
const apply=()=>{
 if(mobile&&!document.getElementById('florestaMobile266Loader')){const el=document.createElement('script');el.id='florestaMobile266Loader';el.src='modulos/148_mobile_interfaces_v266.js?v=276';el.onload=()=>{const r=document.createElement('script');r.src='modulos/149_mobile_rpg_v267.js?v=276';r.onload=()=>{const n=document.createElement('script');n.src='modulos/150_mobile_gestures_v268.js?v=276';n.onload=()=>{const inv=document.createElement('script');inv.src='modulos/151_mobile_inventory_v269.js?v=276';inv.onload=()=>{const a=document.createElement('script');a.src='modulos/151_mobile_craft_skills_v269.js?v=276';a.onload=()=>{const discovery=document.createElement('script');discovery.src='modulos/154_bestiary_discovery_v273.js?v=276';discovery.onload=()=>{const b=document.createElement('script');b.src='modulos/152_mobile_bestiary_spider_v269.js?v=276';b.onload=()=>{const viewer=document.createElement('script');viewer.src='modulos/153_mobile_bestiary_3d_v272.js?v=276';document.body.append(viewer)};document.body.append(b)};document.body.append(discovery)};document.body.append(a)};document.body.append(inv)};document.body.append(n)};document.body.append(r)};document.body.append(el);}

 document.documentElement.dataset.florestaVersion=build.version;
 document.title='FLORESTA '+build.version+' — '+(mobile?'Mobile':'PC');
 const tag=document.querySelector('meta[name="floresta-version"]');if(tag)tag.content=build.version;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
