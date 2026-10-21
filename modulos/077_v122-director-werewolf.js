
(async()=>{
  const wait=ms=>new Promise(r=>setTimeout(r,ms));for(let i=0;i<1400;i++){if(window.gameDirector&&window.gameWerewolf)break;await wait(20)}
  const d=window.gameDirector,w=window.gameWerewolf;if(!d||!w)return;
  const spawnBase=d.spawn.bind(d);
  d.spawn=(type,count=1)=>type==='werewolf'?(w.spawnNow?.()?1:0):spawnBase(type,count);
  d.spawnWerewolf=()=>d.spawn('werewolf',1);d.forceWerewolfNight=()=>w.forceNight?.();
})();
