

(() => {
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let enabled=false;
  let game=null,tfp=null,THREE=null;
  let installed=false;
  let originalUpdate=null;
  let fullBefore=null,fullAfter=null,localWasVisible=true;
  let indicator=null,toggleButton=null;

  async function waitReady(){
    for(let i=0;i<1200;i++){
      const g=window.gameReview;
      const t=g?.trueFirstPerson;
      if(g?.camera&&g?.player&&t?.visibleRoot&&t?.fullMesh&&t?.localMesh){
        game=g;tfp=t;
        try{THREE=await window.__LOCAL_IMPORT(window.FLORESTA_MODULES.three);}catch{}
        return true;
      }
      await sleep(20);
    }
    return false;
  }

  function makeIndicator(){
    if(indicator)return;
    indicator=document.createElement('div');
    indicator.id='thirdPersonInspectionLabel';
    indicator.style.cssText=[
      'position:fixed','left:50%','bottom:18px','transform:translateX(-50%)',
      'z-index:20040','padding:7px 11px','border-radius:9px',
      'border:1px solid rgba(255,210,125,.38)','background:rgba(0,0,0,.62)',
      'color:#ffe0a0','font:800 11px/1.2 Inter,system-ui,sans-serif',
      'letter-spacing:.04em','pointer-events:none','display:none','text-shadow:0 1px 3px #000'
    ].join(';');
    indicator.textContent='CÂMERA TESTE — 3ª PESSOA';
    document.body.appendChild(indicator);
  }

  function makeToggleButton(){
    if(toggleButton)return;
    toggleButton=document.createElement('button');
    toggleButton.type='button';
    toggleButton.id='thirdPersonInspectionToggle';
    toggleButton.textContent='CÂMERA: 1ª PESSOA';
    toggleButton.title='Alternar câmera de inspeção entre primeira e terceira pessoa';
    toggleButton.style.cssText=[
      'position:fixed','right:16px','top:72px','z-index:20050',
      'min-width:154px','height:40px','padding:0 12px','border-radius:11px',
      'border:1px solid rgba(255,210,125,.42)','background:rgba(7,9,8,.82)',
      'color:#ffe0a0','font:900 10px/1 Inter,system-ui,sans-serif','letter-spacing:.035em',
      'box-shadow:0 8px 24px rgba(0,0,0,.30)','cursor:pointer','pointer-events:auto',
      'user-select:none','touch-action:manipulation'
    ].join(';');
    const stop=e=>{e.stopPropagation()};
    ['pointerdown','pointerup','mousedown','mouseup','touchstart','touchend'].forEach(ev=>toggleButton.addEventListener(ev,stop,{passive:false}));
    toggleButton.addEventListener('click',e=>{
      e.preventDefault();e.stopPropagation();
      toggle();
    });
    document.body.appendChild(toggleButton);
    function syncMenuVisibility(){
      const front=window.gameFront172;
      const playing=front?.started && front?.shell?.hidden;
      toggleButton.style.display=playing?'block':'none';
      if(!playing&&enabled)setEnabled(false);
    }
    setInterval(syncMenuVisibility,300);
    syncMenuVisibility();
  }

  function setFullBodyForThirdPerson(on){
    if(!tfp)return;
    const full=tfp.fullMesh,local=tfp.localMesh;
    if(on){
      if(fullBefore===null){
        fullBefore=full.onBeforeRender;
        fullAfter=full.onAfterRender;
        localWasVisible=local.visible;
      }
      full.visible=true;
      full.onBeforeRender=()=>{};
      full.onAfterRender=()=>{};
      local.visible=false;
      if(game?.viewmodel)game.viewmodel.visible=false;
    }else{
      if(fullBefore!==null){
        full.onBeforeRender=fullBefore;
        full.onAfterRender=fullAfter;
      }
      local.visible=localWasVisible;
      if(game?.viewmodel)game.viewmodel.visible=true;
    }
  }

  function applyThirdPersonCamera(){
    if(!enabled||!game||!tfp||!THREE)return;
    const player=game.player;
    const cam=game.camera;
    const root=tfp.visibleRoot;
    root.updateMatrixWorld(true);

    const ground=Number(game.groundY?.(player.x,player.z));
    const baseY=Number.isFinite(ground)?ground:root.position.y;
    const target=new THREE.Vector3(player.x,baseY+1.18,player.z);

    // Orbit follows the same yaw/pitch used by the FPS camera so mouse look
    // remains useful while this temporary inspection camera is active.
    const yaw=player.yaw||0;
    const pitch=Math.max(-0.72,Math.min(0.58,player.pitch||0));
    const cp=Math.cos(pitch),sp=Math.sin(pitch);
    const forward=new THREE.Vector3(
      -Math.sin(yaw)*cp,
      sp,
      -Math.cos(yaw)*cp
    ).normalize();

    const distance=3.25;
    const desired=target.clone().addScaledVector(forward,-distance);
    desired.y+=.48;

    cam.position.lerp(desired,.42);
    cam.up.set(0,1,0);
    cam.lookAt(target.clone().add(new THREE.Vector3(0,.10,0)));
    cam.updateMatrixWorld(true);
  }

  function setEnabled(on){
    enabled=!!on;
    setFullBodyForThirdPerson(enabled);
    makeIndicator();
    makeToggleButton();
    indicator.style.display=enabled?'block':'none';
    toggleButton.textContent=enabled?'CÂMERA: 3ª PESSOA':'CÂMERA: 1ª PESSOA';
    toggleButton.style.background=enabled?'rgba(66,48,18,.90)':'rgba(7,9,8,.82)';
    toggleButton.style.borderColor=enabled?'rgba(255,222,142,.72)':'rgba(255,210,125,.42)';
    document.body.classList.toggle('third-person-inspection',enabled);
    const cross=document.getElementById('cross');
    if(cross)cross.style.opacity=enabled?'.18':'';
    const status=document.getElementById('status');
    if(status)status.textContent=enabled
      ?'Câmera de teste em 3ª pessoa — use o botão para voltar'
      :'Primeira pessoa restaurada';
  }

  function toggle(){setEnabled(!enabled)}

  async function install(){
    if(installed)return;
    if(!await waitReady())return;
    makeIndicator();
    makeToggleButton();

    // Give the other gameplay modules time to finish wrapping the avatar
    // update, then install this camera as the final visual pass.
    await sleep(1200);
    originalUpdate=window.__updateAnimatedAvatar;
    const wrapped=function(...args){
      const r=originalUpdate?.apply(this,args);
      if(enabled)applyThirdPersonCamera();
      return r;
    };
    wrapped.__thirdPersonInspection=true;
    window.__updateAnimatedAvatar=wrapped;
    installed=true;

    window.gameThirdPersonTest={
      get active(){return enabled},
      toggle,
      enable:()=>setEnabled(true),
      disable:()=>setEnabled(false)
    };
    console.info('[V168M] câmera terceira pessoa de inspeção pronta • botão na tela');
  }

  install();
})();

