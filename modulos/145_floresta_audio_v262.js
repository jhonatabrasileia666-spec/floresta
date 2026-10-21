/* FLORESTA V262 - reprodutor de trilhas restauradas: menu, mundo e chefes.
 * Audio HTML5 sob gesto real, sem modificar motores ou arquivos de som anteriores. */
(()=>{'use strict';
 if(window.FlorestaAudioV262)return;
 const dir='assets/audio/';
 const tracks={
  menu:'01_Menu_Carregamento/Floresta_Tema_Principal.ogg',
  day:['02_Mundo/Musicas/01_Primeira_Luz.ogg','02_Mundo/Musicas/02_Sob_as_Copas.ogg','02_Mundo/Musicas/03_Caminhos_de_Musgo.ogg'],
  dusk:['02_Mundo/Musicas/04_Os_Ultimos_Raios.ogg'],
  night:['02_Mundo/Musicas/05_A_Floresta_Observa.ogg','02_Mundo/Musicas/06_Sussurros_da_Madrugada.ogg','02_Mundo/Musicas/07_Algo_Entre_as_Arvores.ogg'],
  giantIntro:'03_Bosses/Gigante/01_Entrada_Neblina.ogg',
  giant:'03_Bosses/Gigante/02_Batalha_Gigante_LOOP.ogg',
  ignisIntro:'03_Bosses/Ignis/Fase_1/01_Entrada_Ignis.ogg',
  ignis:'03_Bosses/Ignis/Fase_1/02_Batalha_Ignis_Fase_1_LOOP.ogg',
  ignisTransition:'03_Bosses/Ignis/Fase_2/01_Transformacao_Ignis.ogg'
 };
 let unlocked=false,enabled=true,volume=.58,active=null,fading=null,stage='',requested='',ended=false;
 let playlist={day:0,dusk:0,night:0},bossLast='',bossIntroFinished=false,phaseLast=0;
 try{enabled=localStorage.getItem('floresta.audio.enabled')!=='0';const raw=localStorage.getItem('floresta.audio.volume');if(raw!==null&&raw!==''){const v=Number(raw);if(Number.isFinite(v)&&v>=0&&v<=1)volume=v;}}catch{}
 const timeOfDay=()=>{const h=Number(window.gameReview?.dayNight?.hour);return Number.isFinite(h)?h:12};
 const playing=()=>!!(window.gameFront172?.started&&window.gameFront172?.shell?.hidden&&!window.gameFront172?.paused&&!document.hidden);
 const menuVisible=()=>!window.gameFront172?.started||!window.gameFront172?.shell?.hidden;
 const F=()=>window.gameFront172;
 const groupOf=h=>h>=19||h<5.8?'night':h>=17?'dusk':'day';
 function detectBoss(){
   if(window.gameSpiderCave?.active)return null;
   const i=window.gameIgnis;
   if(i?.root?.visible&&['COMBAT','TRANSITION','AGGRO'].includes(i.state)&&Number(i.hp)>0)return {key:'ignis',phase:Number(i.phase)||1,transition:i.state==='TRANSITION'};
   const g=window.gameGiantBoss;
   if(g?.root?.visible&&g.scheduled&&g.state!=='HIDDEN'&&g.state!=='DEAD'&&Number(g.hp)>0)return {key:'giant',phase:1};
   return null;
 }
 function nextTrack(group){const all=tracks[group],idx=playlist[group]++%all.length;return all[idx]}
 function resolve(){
   if(menuVisible())return {id:tracks.menu,tag:'menu',level:.48,loop:true};
   if(!playing()||window.gameSpiderCave?.active)return null;
   const boss=detectBoss();
   if(boss){
     if(bossLast!==boss.key){bossLast=boss.key;bossIntroFinished=false;phaseLast=1;}
     if(boss.key==='giant'){
       if(!bossIntroFinished)return {id:tracks.giantIntro,tag:'giant-intro',level:.69,loop:false};
       return {id:tracks.giant,tag:'giant',level:.62,loop:true};
     }
     if(boss.transition||boss.phase>1){
       if(phaseLast<2){phaseLast=2;bossIntroFinished=false;}
       if(!bossIntroFinished)return {id:tracks.ignisTransition,tag:'ignis-transition',level:.68,loop:false};
     }else if(!bossIntroFinished)return {id:tracks.ignisIntro,tag:'ignis-intro',level:.65,loop:false};
     return {id:tracks.ignis,tag:'ignis',level:.63,loop:true};
   }
   bossLast='';bossIntroFinished=false;phaseLast=0;
   const group=groupOf(timeOfDay());
   if(active?.tag===group&&!ended)return {id:active.id,tag:group,level:.32,loop:false};
   return {id:nextTrack(group),tag:group,level:.32,loop:false};
 }
 function stop(a){if(!a)return;try{a.node.pause();a.node.removeAttribute('src');a.node.load()}catch{}}
 function start(item){
   const node=document.createElement('audio');node.preload='auto';node.playsInline=true;node.loop=item.loop;
   node.src=dir+item.id;node.volume=0;node.dataset.florestaTrack=item.tag;
   const holder={node,id:item.id,tag:item.tag,level:item.level,gain:0,pending:true,failed:false,missing:false};
   node.addEventListener('ended',()=>{if(active!==holder)return;ended=true;
     if(item.tag==='giant-intro'||item.tag==='ignis-intro'||item.tag==='ignis-transition')bossIntroFinished=true;
     schedule();});
   node.addEventListener('error',()=>{holder.failed=true;holder.missing=true;console.warn('[FLORESTA ÁUDIO] Arquivo não reproduzido:',node.src,node.error?.code);});
   const result=node.play();
   if(result?.then)result.then(()=>{holder.pending=false;}).catch(e=>{holder.pending=false;holder.failed=true;console.warn('[FLORESTA ÁUDIO] Reproduzir bloqueado:',e?.name||e);});
   return holder;
 }
 function desiredLevel(a){return Math.min(1,Math.max(0,a.level*volume*1.6));}
 function schedule(){
   if(!unlocked||!enabled||document.hidden){if(active){fading=active;active=null;}return;}
   const item=resolve();
   if(!item){if(active){if(fading)stop(fading);fading=active;active=null;}return;}
   if(active&&active.id===item.id&&active.tag===item.tag&&!ended){active.level=item.level;
     return;}
   if(active){if(fading)stop(fading);fading=active;active=null;}
   ended=false;active=start(item);
 }
 function fadeTick(){
   schedule();
   if(active){active.gain+=(desiredLevel(active)-active.gain)*.24;active.node.volume=Math.min(1,Math.max(0,active.gain));}
   if(fading){fading.gain*=.76;fading.node.volume=Math.min(1,Math.max(0,fading.gain));if(fading.gain<.007){stop(fading);fading=null;}}
 }
 function unlockFromGesture(){
   unlocked=true;
   if(active?.failed&&!active.missing){active.node.play()?.then?.(()=>{active.failed=false;}).catch(()=>{});}
   // Every subsystem hears this even when bootstrap intercepts menu events.
   window.dispatchEvent(new Event('floresta:audio-unlock'));
   schedule();
 }
 const api=window.FlorestaAudioV262={version:'V262',unlockFromGesture,
   get status(){return {unlocked,enabled,volume,current:active?.id||null,playing:!!active&&!active.node.paused,htmlAudio:active?.node?.error?.code||null}},
   setEnabled(v){enabled=!!v;try{localStorage.setItem('floresta.audio.enabled',enabled?'1':'0')}catch{};if(!enabled){stop(active);stop(fading);active=fading=null;}else schedule();},
   setVolume(v){volume=Math.max(0,Math.min(1,Number(v)||0));try{localStorage.setItem('floresta.audio.volume',String(volume))}catch{};},
   testMenu(){return unlockFromGesture()},
 };
 // Re-try playback on every real interaction, even after tab restore or autoplay denial.
 window.addEventListener('pointerdown',e=>{if(e.isTrusted)unlockFromGesture()},{passive:true});
 window.addEventListener('touchstart',e=>{if(e.isTrusted)unlockFromGesture()},{passive:true});
 window.addEventListener('keydown',e=>{if(e.isTrusted)unlockFromGesture()},{passive:true});
 window.addEventListener('floresta:started',schedule);
 window.addEventListener('visibilitychange',()=>{if(!document.hidden&&unlocked)schedule();});
 window.addEventListener('pagehide',()=>{stop(active);stop(fading);active=fading=null});
 setInterval(fadeTick,140);
})();
