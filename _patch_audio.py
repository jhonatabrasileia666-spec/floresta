from pathlib import Path
import json,base64,subprocess,hashlib,re
root=Path('/mnt/data/floresta_v262_audio_fix')
modules=root/'modulos'
p=modules/'116_floresta-audio-v177-assets.js'
s=p.read_text()
data=json.loads(json.loads(s.split('textContent=',1)[1].strip().rstrip(';')))
folder=root/'assets'/'audio'; folder.mkdir(exist_ok=True,parents=True)
urls={};valid=[]
for key,b64 in data.items():
 target=folder/key
 target.parent.mkdir(exist_ok=True,parents=True)
 target.write_bytes(base64.b64decode(b64,validate=True))
 subprocess.run(['ffprobe','-v','error','-show_entries','format=duration,format_name','-of','default=noprint_wrappers=1',str(target)],check=True,stdout=subprocess.DEVNULL)
 urls[key]='assets/audio/'+key
 valid.append((key,target.stat().st_size))
# Manifest original audio bank now paths; no script owns base64 blobs anymore.
p.write_text('/* FLORESTA V262: trilhas restauradas como OGG externos. Nomes originais preservados. */\n'+
             'document.getElementById("floresta-audio-v177-assets").textContent='+json.dumps(json.dumps(urls,ensure_ascii=False,separators=(',',':')),ensure_ascii=False)+';\n',encoding='utf-8')
# Hooks on the original menu capture (events don't reach bubble listeners)
boot=modules/'004_floresta-menu172-bootstrap.js'
s=boot.read_text()
old="for(const type of ['keydown','keyup','pointerdown','pointerup','pointermove','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','wheel'])window.addEventListener(type,e=>{\n  if(shell.hidden)return;"
new="for(const type of ['keydown','keyup','pointerdown','pointerup','pointermove','mousedown','mouseup','mousemove','touchstart','touchmove','touchend','wheel'])window.addEventListener(type,e=>{\n  // V262: desbloqueio síncrono na interação original, ANTES do bloqueio do menu.\n  if(e.isTrusted && (type==='pointerdown'||type==='keydown'||type==='touchstart'))window.FlorestaAudioV262?.unlockFromGesture?.();\n  if(shell.hidden)return;"
assert old in s;s=s.replace(old,new);boot.write_text(s)
# Old forest procedural ambience had consumed once listener behind menu capture before gameplay.
living=modules/'044_v65-floresta-viva.js';s=living.read_text()
needle="  ['pointerdown','touchstart','keydown'].forEach(ev=>{\n    window.addEventListener(ev, ()=>startAmbience(), {passive:true, once:true});\n  });"
replacement="""  // V262: o menu intercepta o primeiro clique; iniciar o ambiente depois de entrar no mundo.
  // O evento de inicio ocorre no clique real, permitindo resume() em PC e Mobile.
  function resumeForestAmbience(){
    if(!window.gameFront172?.started)return;
    startAmbience();
    if(ambience.ctx?.state==='suspended')ambience.ctx.resume().catch(()=>{});
  }
  window.addEventListener('floresta:started',resumeForestAmbience);
  window.addEventListener('floresta:audio-unlock',resumeForestAmbience);
  ['pointerdown','touchstart','keydown'].forEach(ev=>{
    window.addEventListener(ev, resumeForestAmbience,{capture:true,passive:true});
  });"""
assert needle in s;s=s.replace(needle,replacement);living.write_text(s)
# V261 ambience initialize after the gameplay start event (not only pointerdown)
atm=modules/'144_floresta_atmosfera_v261.js';s=atm.read_text()
s=s.replace("window.addEventListener('pointerdown',unlock,{passive:true});\n window.addEventListener('keydown',unlock,{passive:true});",
 "window.addEventListener('pointerdown',unlock,{passive:true});\n window.addEventListener('touchstart',unlock,{passive:true});\n window.addEventListener('keydown',unlock,{passive:true});\n window.addEventListener('floresta:started',unlock);\n window.addEventListener('floresta:audio-unlock',unlock);")
s=s.replace("const pan=ctx.createPanner();pan.panningModel='equalpower'", "const pan=ctx.createPanner();pan.panningModel='equalpower'") if False else s
# Sound is meant to be audible from a reasonable radius, without being overwhelming.
s=s.replace('pan.refDistance=7;pan.maxDistance=85;pan.rolloffFactor=.9;', 'pan.refDistance=13;pan.maxDistance=75;pan.rolloffFactor=.65;')
s=s.replace('randomPosition(17,39)', 'randomPosition(11,26)')
s=s.replace("state.nextCue=now+rand(14000,24000)","state.nextCue=now+rand(5000,10000)")
s=s.replace("state.nextCue=now+rand(state.day>=3?19000:29000,state.day>=3?33000:48000)","state.nextCue=now+rand(state.day>=3?14000:20000,state.day>=3?25000:34000)")
s=s.replace("version:'V261',\n  get enabled", "version:'V262-audio',\n  unlock,\n  get enabled")
atm.write_text(s)
# Service worker must cache decoded OGG assets while retaining selective caching.
sw=root/'sw.js';s=sw.read_text().replace("floresta-v261-runtime-1","floresta-v262-audio-1")
s=s.replace('\\.(js|json|gz|png|jpg|glb|fbx)$','\\.(js|json|gz|png|jpg|glb|fbx|ogg|mp3|wav)$')
sw.write_text(s)
# release metadata & bootstrap fallback
rel=modules/'000_floresta-release.js';s=rel.read_text()
s=s.replace('"version":"V261"','"version":"V262"').replace('"number":261','"number":262').replace('"edition":"Atmosfera Reativa"','"edition":"Áudio Restaurado"').replace('"base":"V260"','"base":"V261"')
rel.write_text(s)
boot.write_text(boot.read_text().replace("'V257'","'V262'"))
# Core soundtrack controller, 2 HTMLAudio elements max while cross-fading.
controller=r'''/* FLORESTA V262 - reprodutor de trilhas restauradas: menu, mundo e chefes.
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
 try{enabled=localStorage.getItem('floresta.audio.enabled')!=='0';const v=Number(localStorage.getItem('floresta.audio.volume'));if(Number.isFinite(v)&&v>=0&&v<=1)volume=v;}catch{}
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
   const holder={node,id:item.id,tag:item.tag,level:item.level,gain:0,pending:true,failed:false};
   node.addEventListener('ended',()=>{if(active!==holder)return;ended=true;
     if(item.tag==='giant-intro'||item.tag==='ignis-intro'||item.tag==='ignis-transition')bossIntroFinished=true;
     schedule();});
   node.addEventListener('error',()=>{holder.failed=true;console.warn('[FLORESTA ÁUDIO] Arquivo não reproduzido:',node.src,node.error?.code);});
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
     if(active.failed){const promise=active.node.play();promise?.then?.(()=>{active.failed=false;}).catch(()=>{});}return;}
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
'''
(modules/'145_floresta_audio_v262.js').write_text(controller,encoding='utf-8')
# Audio controller after V261 module loaded. Change 116 version so stale SW cache never used.
html=root/'Jogo.html';s=html.read_text()
s=s.replace('src="modulos/116_floresta-audio-v177-assets.js"','src="modulos/116_floresta-audio-v177-assets.js?v=262"')
end='<script id="floresta-v261-atmosfera" src="modulos/144_floresta_atmosfera_v261.js?v=261"></script>'
assert end in s
s=s.replace(end,end.replace('v=261','v=262')+'\n<script id="floresta-v262-audio" src="modulos/145_floresta_audio_v262.js?v=262"></script>')
s=s.replace('modulos/044_v65-floresta-viva.js"','modulos/044_v65-floresta-viva.js?v=262"').replace('modulos/004_floresta-menu172-bootstrap.js?v=257','modulos/004_floresta-menu172-bootstrap.js?v=262')
# Web manifest title/cache aliases corrected without altering gameplay.
s=s.replace('V261 —','V262 —').replace('content="V261"','content="V262"')
html.write_text(s)
for alias in ['PC.html','Mobile.html','index.html']:
 p=root/alias;s=p.read_text();s=s.replace('V261','V262').replace('v261','v262');p.write_text(s)
# Save user's compatible world/profile schema unchanged.
# New release notes
(root/'LEIA-ME_V262_AUDIO_RESTAURADO.txt').write_text('''FLORESTA V262 — ÁUDIO RESTAURADO (PC + MOBILE)\n\nBase integral: V261 Atmosfera Reativa. Nenhum gameplay ou save modificado.\n\nCorrigido:\n- 13 trilhas originais OGG extraídas em assets/audio (menu, floresta, chefes).\n- Reprodutor real com música do menu, playlists dia/entardecer/noite e chefes.\n- Desbloqueio de áudio no clique do menu (antes do bloqueio de eventos do jogo).\n- Áudio ambiente original V65 inicia ao entrar no jogo; áudio reativo V261 também.\n- Áudio direcional V261 ajustado para ser audível a distâncias úteis.\n- Pausa e retomada ao minimizar, entrar na caverna ou voltar ao menu.\n- Cache PWA V262 inclui arquivos OGG.\n\nIMPORTANTE: publique a PASTA TODA no GitHub Pages, incluindo assets/audio!\nOs navegadores precisam de gesto do jogador para liberar a música: um clique/toque no menu.\nPara diagnóstico no console: FlorestaAudioV262.status e FlorestaAtmosferaV261.status\n''',encoding='utf-8')
print('Extracted',len(valid),'OGG audio files,',sum(x[1] for x in valid),'bytes')
print('New audio JS', (modules/'145_floresta_audio_v262.js').stat().st_size)
