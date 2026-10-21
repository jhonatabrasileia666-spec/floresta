
(()=>{
  'use strict';
  if(window.gameOptimizationMonitor)return;
  let enabled=false,el=null,handle=0,last=0,count=0,avg=0,low=Infinity;
  const format=v=>Number.isFinite(v)?String(Math.round(v)):'—';
  function create(){
    if(el)return el;
    el=document.createElement('div');el.id='florestaPerfV168S';
    el.style.cssText='position:fixed;left:12px;top:12px;z-index:12030;pointer-events:none;white-space:pre;background:rgba(0,0,0,.79);border:1px solid #686868;border-radius:8px;padding:10px 13px;color:#efefef;font:12px/1.5 ui-monospace,Consolas,monospace;text-shadow:0 1px #000;';
    document.body.appendChild(el);return el;
  }
  function tick(t){
    if(!enabled)return;
    if(!last)last=t;
    count++;
    const elapsed=t-last;
    if(elapsed>=700){
      const fps=count*1000/Math.max(1,elapsed),g=window.gameReview;
      avg=avg?avg*.65+fps*.35:fps;low=Math.min(low,fps);
      const r=g?.renderer?.info?.render;
      const profile=window.gameAdvancedLighting?.style||'?';
      create().textContent=`F10  FPS ${format(fps)}  média ${format(avg)}\nPSX + ${profile.toUpperCase()}\nDraw calls ${format(r?.calls)}   Triângulos ${format(r?.triangles)}\nFPS mínimo observado ${format(low)}`;
      last=t;count=0;
    }
    handle=requestAnimationFrame(tick);
  }
  function toggle(){
    enabled=!enabled;
    if(enabled){create().style.display='block';last=0;count=0;avg=0;low=Infinity;handle=requestAnimationFrame(tick);}
    else{cancelAnimationFrame(handle);if(el)el.style.display='none';}
    return enabled;
  }
  window.gameOptimizationMonitor={version:'V168S-unbound-optimized-1',toggle,get active(){return enabled},get fps(){return avg},get graphics(){return window.gameGraphics?.mode},get lighting(){return window.gameAdvancedLighting?.style},get render(){return window.gameReview?.renderer?.info?.render}};
})();
