/* FLORESTA: identificacao publica da compilacao. Gerado a partir de versao-manifest.json. */
(()=>{'use strict';
const build=Object.freeze({"name":"FLORESTA","version":"V266","number":266,"date":"2026-10-21","edition":"Interfaces completas para celular","base":"V265","saveSchema":2,"platforms":["PC","Mobile"],"manifest":"versao-manifest.json"});
Object.defineProperty(window,'FlorestaBuild',{value:build,enumerable:true,configurable:false,writable:false});
const mobile=new URLSearchParams(location.search).get('platform')==='mobile'||!new URLSearchParams(location.search).has('platform')&&matchMedia('(pointer:coarse)').matches;
if(mobile)document.documentElement.classList.add('v266-mobile');
const apply=()=>{
 if(mobile&&!document.getElementById('florestaMobile266Loader')){const el=document.createElement('script');el.id='florestaMobile266Loader';el.src='modulos/148_mobile_interfaces_v266.js?v=266';document.body.append(el);}

 document.documentElement.dataset.florestaVersion=build.version;
 document.title='FLORESTA '+build.version+' — '+(mobile?'Mobile':'PC');
 const tag=document.querySelector('meta[name="floresta-version"]');if(tag)tag.content=build.version;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
