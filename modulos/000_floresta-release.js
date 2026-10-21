/* FLORESTA: identificacao publica da compilacao. Gerado a partir de versao-manifest.json. */
(()=>{'use strict';
const build=Object.freeze({"name":"FLORESTA","version":"V265","number":265,"date":"2026-10-21","edition":"Escudos V256E e barra rápida integrados à V264","base":"V264","saveSchema":2,"platforms":["PC","Mobile"],"manifest":"versao-manifest.json"});
Object.defineProperty(window,'FlorestaBuild',{value:build,enumerable:true,configurable:false,writable:false});
const apply=()=>{
 document.documentElement.dataset.florestaVersion=build.version;
 const mobile=new URLSearchParams(location.search).get('platform')==='mobile';
 document.title='FLORESTA '+build.version+' — '+(mobile?'Mobile':'PC');
 const tag=document.querySelector('meta[name="floresta-version"]');if(tag)tag.content=build.version;
};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply,{once:true});else apply();
})();
