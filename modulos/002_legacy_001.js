/* V275: platform explicit on mobile entry; Safari desktop-UA in landscape is still iOS touch. */
(()=>{
 const params=new URLSearchParams(location.search),p=params.get('platform'),ua=navigator.userAgent||'';
 const touch=matchMedia('(pointer:coarse)').matches||(/Macintosh/i.test(ua)&&navigator.maxTouchPoints>1);
 window.__CAVE_PLATFORM=p==='pc'?'pc':p==='mobile'||/iPad|iPhone|iPod|Android|Mobile/i.test(ua)||touch?'mobile':'pc';
 document.documentElement.dataset.florestaPlatform=window.__CAVE_PLATFORM;
})();
