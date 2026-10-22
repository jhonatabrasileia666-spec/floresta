/* FLORESTA V269 SW - cache somente o que foi requisitado */
const CACHE='floresta-v269-inventario-1';
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('floresta-v')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{
 const req=event.request;
 if(req.method!=='GET'||new URL(req.url).origin!==self.location.origin)return;
 const url=new URL(req.url),path=url.pathname;
 const gameCode=/\/(modulos|assets)\//.test(path)&&/\.(js|json|gz|png|jpg|glb|fbx|ogg|mp3|wav)$/.test(path);
 if(!gameCode)return; // HTML segue a rede: nao esconder novas versoes.
 event.respondWith((async()=>{
  const cache=await caches.open(CACHE),hit=await cache.match(req);if(hit)return hit;
  const response=await fetch(req);
  if(response.ok){
   const len=Number(response.headers.get('content-length'))||0;
   // Em celulares, evitar persistir assets gigantes quando a cota de disco e curta.
   if(len<=32*1024*1024&&!/dragons-v51\.json|monstro-v239/i.test(path))cache.put(req,response.clone()).catch(()=>{});
  }
  return response;
 })());
});