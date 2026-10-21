/* FLORESTA V260: temporary alchemy sight effect, applies only during draw (no drift in global fog). */
(()=>{'use strict';
 if(window.__FLORESTA_V260_FOG__)return;window.__FLORESTA_V260_FOG__=true;
 let attempts=0;const install=()=>{
  const game=window.gameReview,renderer=game?.renderer;
  if(!renderer||!game?.scene){if(++attempts<120)setTimeout(install,150);return;}
  const previous=renderer.render.bind(renderer);
  renderer.render=function(scene,camera,...extra){
   const boost=scene===game.scene&&Date.now()<(window.gameHerbalAlchemy?.effects?.sightUntil||0);
   const fog=boost?scene.fog:null;
   if(!fog)return previous(scene,camera,...extra);
   const density=fog.density,far=fog.far;
   try{if(fog.isFogExp2&&Number.isFinite(density))fog.density=Math.max(.001,density*.67);
       else if(fog.isFog&&Number.isFinite(far))fog.far=far*1.25;
       return previous(scene,camera,...extra);
   }finally{if(density!==undefined)fog.density=density;if(far!==undefined)fog.far=far;}
  };
  window.FlorestaCraftV260={version:'V260',get remaining(){const a=window.gameHerbalAlchemy?.effects||{};return{ward:Math.max(0,Math.ceil(((a.wardUntil||0)-Date.now())/1000)),sight:Math.max(0,Math.ceil(((a.sightUntil||0)-Date.now())/1000))};}};
 };install();
})();
