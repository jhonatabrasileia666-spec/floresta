/* FLORESTA: identificacao publica da compilacao. Gerado a partir de versao-manifest.json. */
(()=>{'use strict';
const build=Object.freeze({"name":"FLORESTA","version":"V274","number":274,"date":"2026-10-22","edition":"Correção de inicialização do combate no Safari iPhone","base":"V265","saveSchema":2,"platforms":["PC","Mobile"],"manifest":"versao-manifest.json"});
Object.defineProperty(window,'FlorestaBuild',{value:build,enumerable:true,configurable:false,writable:false});
const mobile=new URLSearchParams(location.search).get('platform')==='mobile'||!new URLSearchParams(location.search).has('platform')&&matchMedia('(pointer:coarse)').matches;
if(mobile)document.documentElement.classList.add('v266-mobile');
const apply=()=>{
 if(mobile&&!document.getElementById('florestaMobile266Loader')){const el=document.createElement('script');el.id='florestaMobile266Loader';el.src='modulos/148_mobile_interfaces_v266.js?v=274';el.onload=()=>{const r=document.createElement('script');r.src='modulos/149_mobile_rpg_v267.js?v=274';r.onload=()=>{const n=document.createElement('script');n.src='modulos/150_mobile_gestures_v268.js?v=274';n.onload=()=>{const inv=document.createElement('script');inv.src='modulos/151_mobile_inventory_v269.js?v=274';inv.onload=()=>{const a=document.createElement('script');a.src='modulos/151_mobile_craft_skills_v269.js?v=274';a.onload=()=>{const discovery=document.createElement('script');discovery.src='modulos/154_bestiary_discovery_v273.js?v=274';discovery.onload=()=>{const b=document.createElement('script');b.src='modulos/152_mobile_bestiary_spider_v269.js?v=274';b.onload=()=>{const viewer=document.createElement('script');viewer.src='modulos/153_mobile_bestiary_3d_v272.js?v=274';document.body.append(viewer)};document.body.append(b)};document.body.append(discovery)};document.body.append(a)};document.body.append(inv)};document.body.append(n)};document.body.append(r)};document.body.append(el);}

 document.documentElement.dataset.florestaVersion=build.version;
 document.title='FLORESTA '+build.version+' — '+(mobile?'Mobile':'PC');
 const tag=document.querySelector('meta[name="floresta-version"]');if(tag)tag.content=build.version;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
