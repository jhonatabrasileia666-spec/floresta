/* FLORESTA V281 — JS network-first; large media cache-first. Never cache HTML.
   Important on iOS: an old PWA may keep a V264 script URL even after code changes. */
const CACHE='floresta-v281-native-equipment-work-4';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{
 for(const key of await caches.keys())if(key.startsWith('floresta-v')&&key!==CACHE)await caches.delete(key);
 await self.clients.claim();
})()));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url),path=url.pathname;
 const gameCode=/\/(modulos|assets)\//.test(path)&&/\.(js|json|gz|png|jpg|jpeg|webp|glb|fbx|ogg|mp3|wav)$/i.test(path);
 if(!gameCode)return; // HTML, manifest, CSS: browser obtains the newest copy.
 const isScript=/\.js$/i.test(path);
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE);
  // Scripts: always request current GitHub file, bypass browser HTTP cache.
  if(isScript){
   try{
    const fresh=await fetch(req,{cache:'no-store'});
    if(fresh.ok){cache.put(req,fresh.clone()).catch(()=>{});return fresh;}
    const fallback=await cache.match(req);return fallback||fresh;
   }catch(err){const fallback=await cache.match(req);if(fallback)return fallback;throw err;}
  }
  // Large 3D assets stay cache-first to avoid repeated mobile downloads.
  const hit=await cache.match(req);if(hit)return hit;
  const response=await fetch(req);
  if(response.ok){
   const len=Number(response.headers.get('content-length'))||0;
   if(len<=32*1024*1024&&!/dragons-v51\.json|monstro-v239/i.test(path))cache.put(req,response.clone()).catch(()=>{});
  }
  return response;
 })());
});