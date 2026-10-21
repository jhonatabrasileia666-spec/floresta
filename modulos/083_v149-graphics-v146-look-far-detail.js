
(function(){
  if(window.__V146_GRAPHICS_TOGGLE__) return;
  window.__V146_GRAPHICS_TOGGLE__=true;

  const STORAGE_KEY='floresta_graphics_mode_v146';
  let mode='retro';
  try{ mode=localStorage.getItem(STORAGE_KEY)||'retro'; }catch{}
  if(mode!=='normal'&&mode!=='retro') mode='retro';

  const isMobile=matchMedia('(pointer:coarse)').matches||/Android|iPhone|iPad|iPod|Mobile/i.test(navigator.userAgent);
  let game=null,renderer=null,scene=null,THREE=null,baseRender=null;
  let target=null,postScene=null,postCamera=null,postMesh=null,postMaterial=null;
  let retroActive=false;
  let savedPos=null,savedQuat=null,tmpEuler=null;
  let oldToneMapping=null,oldExposure=1,oldSortObjects=true,oldShadowType=null;
  let oldCanvasFilter='',oldImageRendering='';

  function ensureUI(){
    if(document.getElementById('graphicsToggleV146')) return;
    const style=document.createElement('style');
    style.id='graphicsStyleV146';
    style.textContent=`
      #graphicsToggleV146{position:fixed;right:12px;top:12px;z-index:12020;border:1px solid rgba(255,255,255,.30);background:rgba(7,7,8,.88);color:#f1eee7;padding:10px 12px;border-radius:9px;font:800 11px/1 system-ui,sans-serif;letter-spacing:.05em;box-shadow:0 6px 20px rgba(0,0,0,.35)}
      #graphicsPanelV146{position:fixed;right:12px;top:58px;z-index:12021;width:min(310px,calc(100vw - 24px));padding:13px;border:1px solid rgba(255,255,255,.24);border-radius:12px;background:rgba(7,7,8,.96);color:#eee;box-shadow:0 18px 48px rgba(0,0,0,.6);display:none;font-family:system-ui,sans-serif}
      #graphicsPanelV146.open{display:block}
      #graphicsPanelV146 strong{display:block;font-size:14px;margin-bottom:4px}
      #graphicsPanelV146 p{margin:0 0 11px;color:#bbb;font:11px/1.35 system-ui,sans-serif}
      #graphicsPanelV146 .modes{display:grid;grid-template-columns:1fr 1fr;gap:8px}
      #graphicsPanelV146 .mode{padding:12px 8px;border-radius:9px;border:1px solid rgba(255,255,255,.17);background:#181819;color:#ddd;font:800 11px system-ui,sans-serif}
      #graphicsPanelV146 .mode.active{background:#342b1c;border-color:#e2c37e;color:#ffe6a7;box-shadow:inset 0 0 0 1px rgba(255,223,150,.14)}
      #graphicsPanelV146 small{display:block;margin-top:10px;color:#8d8d8d;font:10px/1.35 system-ui,sans-serif}
      #retroOverlayV146{position:fixed;inset:0;z-index:7;pointer-events:none;display:none;opacity:.78;mix-blend-mode:overlay;background:
        repeating-linear-gradient(0deg,rgba(255,255,255,.028) 0,rgba(255,255,255,.028) 1px,rgba(0,0,0,.04) 1px,rgba(0,0,0,.04) 3px),
        radial-gradient(circle at 50% 48%,rgba(255,255,255,.035),rgba(0,0,0,.18) 78%)}
      @media(pointer:coarse){#graphicsToggleV146{right:9px;top:9px;padding:11px 12px}#graphicsPanelV146{right:9px;top:55px;width:min(330px,calc(100vw - 18px))}}
    `;
    document.head.appendChild(style);
    const overlay=document.createElement('div');overlay.id='retroOverlayV146';document.body.appendChild(overlay);
    const btn=document.createElement('button');btn.type='button';btn.id='graphicsToggleV146';
    const panel=document.createElement('div');panel.id='graphicsPanelV146';
    panel.innerHTML=`<strong>Gráfico</strong><p>Normal mantém exatamente o visual original. Retro PSX aplica o efeito só na imagem final, sem trocar as árvores ou as texturas do mapa.</p><div class="modes"><button class="mode" data-mode="normal">NORMAL</button><button class="mode" data-mode="retro">RETRO PSX</button></div><small>Retro: resolução baixa esticada + pixels duros + cor 15-bit/dithering + leve instabilidade PSX.</small>`;
    document.body.append(btn,panel);
    const swallow=e=>e.stopPropagation();
    ['pointerdown','pointerup','touchstart','touchend'].forEach(ev=>{btn.addEventListener(ev,swallow,{passive:false});panel.addEventListener(ev,swallow,{passive:false})});
    btn.addEventListener('click',e=>{e.stopPropagation();panel.classList.toggle('open')});
    panel.querySelectorAll('[data-mode]').forEach(b=>b.addEventListener('click',e=>{e.stopPropagation();setMode(b.dataset.mode);panel.classList.remove('open')}));
  }

  function updateUI(){
    const btn=document.getElementById('graphicsToggleV146');
    if(btn) btn.textContent=mode==='retro'?'GRÁFICO: RETRO PSX':'GRÁFICO: NORMAL';
    document.querySelectorAll('#graphicsPanelV146 [data-mode]').forEach(b=>b.classList.toggle('active',b.dataset.mode===mode));
    const ov=document.getElementById('retroOverlayV146');if(ov)ov.style.display=mode==='retro'?'block':'none';
  }

  function makePost(){
    if(postMaterial) return;
    postScene=new THREE.Scene();
    postCamera=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
    postMaterial=new THREE.ShaderMaterial({
      depthTest:false,depthWrite:false,transparent:false,
      uniforms:{tDiffuse:{value:null},tDepth:{value:null},uResolution:{value:new THREE.Vector2(320,180)},uFarResolution:{value:new THREE.Vector2(640,360)},uCameraNear:{value:.1},uCameraFar:{value:180.0},uTime:{value:0},uSunShadowMap:{value:null},uShadowWorldMatrix:{value:new THREE.Matrix4()},uCameraInverseProjection:{value:new THREE.Matrix4()},uCameraWorldMatrix:{value:new THREE.Matrix4()},uCameraWorldPos:{value:new THREE.Vector3()},uLightWorldDir:{value:new THREE.Vector3(0,1,0)},uSunScatterColor:{value:new THREE.Color(0xffe8cd)},uPhysicalVolume:{value:0},uVolumeSteps:{value:10},uShadowBias:{value:0}},
      vertexShader:`varying vec2 vUv; void main(){vUv=uv; gl_Position=vec4(position.xy,0.0,1.0);}`,
      fragmentShader:`
        precision highp float;
        uniform sampler2D tDiffuse;
        uniform sampler2D tDepth;
        uniform vec2 uResolution;
        uniform vec2 uFarResolution;
        uniform float uCameraNear;
        uniform float uCameraFar;
        uniform float uTime;
        varying vec2 vUv;
        float bayer4(vec2 p){
          vec2 q=mod(floor(p),4.0);
          float i=q.x+q.y*4.0;
          if(i<0.5)return 0.0;if(i<1.5)return 8.0;if(i<2.5)return 2.0;if(i<3.5)return 10.0;
          if(i<4.5)return 12.0;if(i<5.5)return 4.0;if(i<6.5)return 14.0;if(i<7.5)return 6.0;
          if(i<8.5)return 3.0;if(i<9.5)return 11.0;if(i<10.5)return 1.0;if(i<11.5)return 9.0;
          if(i<12.5)return 15.0;if(i<13.5)return 7.0;if(i<14.5)return 13.0;return 5.0;
        }
        float viewDistance(float depth){
          float viewZ=(uCameraNear*uCameraFar)/((uCameraFar-uCameraNear)*depth-uCameraFar);
          return max(0.0,-viewZ);
        }
        uniform sampler2D uSunShadowMap;
        uniform mat4 uShadowWorldMatrix;
        uniform mat4 uCameraInverseProjection;
        uniform mat4 uCameraWorldMatrix;
        uniform vec3 uCameraWorldPos;
        uniform vec3 uLightWorldDir;
        uniform vec3 uSunScatterColor;
        uniform float uPhysicalVolume;
        uniform float uVolumeSteps;
        uniform float uShadowBias;
        float unpackShadowDepth(vec4 rgba){
          // Exatamente a mesma ordem de empacotamento RGBADepth do Three.js r180.
          return dot(rgba,vec4(255.0/256.0,(255.0/256.0)/256.0,(255.0/256.0)/65536.0,1.0/16777216.0));
        }
        float sunVisibilityProjected(vec4 q){
          vec3 v=q.xyz/max(.0001,q.w);
          if(v.x<=.01||v.x>=.99||v.y<=.01||v.y>=.99||v.z<=0.0||v.z>=1.0)return .0;
          float shadowDepth=unpackShadowDepth(texture2D(uSunShadowMap,v.xy));
          return step(v.z-.0018,shadowDepth);
        }
        vec3 realShaftLighting(vec2 uv,float rawDepth){
          if(uPhysicalVolume<=.001)return vec3(0.0);
          vec4 fp=uCameraInverseProjection*vec4(uv*2.0-1.0,1.0,1.0);
          vec3 ray=normalize((uCameraWorldMatrix*vec4(fp.xyz/max(.001,fp.w),1.0)).xyz-uCameraWorldPos);
          float alignment=dot(ray,normalize(uLightWorldDir));
          // Forward scattering: mais visível olhando na direção do sol.
          float phase=.16+1.65*pow(max(0.0,alignment),5.0);
          float depth=viewDistance(rawDepth);
          float maxDist=min(62.0,depth-.4);
          if(rawDepth>.9998)maxDist=62.0;
          if(maxDist<=2.0)return vec3(0.0);
          float stepDist=(maxDist-1.3)/max(uVolumeSteps,1.0);
          float jitter=fract(sin(dot(floor(uv*uResolution),vec2(14.13,82.71)))*45692.17);
          // Mesmas 16 amostras e MESMOS pontos do shader aprovado.
          // Pré-calcula o início, o passo espacial, a projeção da sombra e as
          // progressões exponenciais para evitar matrizes/exp dentro do loop.
          float t0=1.3+(.22+.55*jitter)*stepDist;
          vec3 rayStep=ray*stepDist;
          vec3 firstWorld=uCameraWorldPos+ray*t0;
          vec4 shadowStart=uShadowWorldMatrix*vec4(firstWorld,1.0);
          vec4 shadowDelta=uShadowWorldMatrix*vec4(rayStep,0.0);
          float heightStart=exp(-(firstWorld.y-2.0)*.055);
          float heightRatio=exp(-rayStep.y*.055);
          float transmission=exp(-t0*.033);
          float transmissionRatio=exp(-stepDist*.033);
          float light=0.0;
          for(int i=0;i<16;i++){
            if(float(i)>=uVolumeSteps)break;
            vec4 shadowPosition=shadowStart+float(i)*shadowDelta;
            float heightFog=.35+.65*min(1.0,heightStart);
            light+=sunVisibilityProjected(shadowPosition)*heightFog*transmission*stepDist;
            heightStart*=heightRatio;
            transmission*=transmissionRatio;
          }
          float scatter=(1.0-exp(-light*.027))*phase*uPhysicalVolume;
          return uSunScatterColor*clamp(scatter,0.0,.6);
        }

        void main(){
          // V149: o visual perto continua EXATAMENTE na grade PSX da V146.
          // Só a longa distância a grade fica mais fina, usando o depth real da cena,
          // para personagens/inimigos não virarem um único quadrado.
          float rawDepth=texture2D(tDepth,vUv).x;
          float dist=viewDistance(rawDepth);
          float farMix=smoothstep(24.0,46.0,dist);
          vec2 grid=mix(uResolution,uFarResolution,farMix);
          vec2 texel=1.0/grid;
          vec2 uv=(floor(vUv*grid)+0.5)*texel;
          vec3 c=texture2D(tDiffuse,uv).rgb;
          // A luz é dispersada no espaço 3D e oclusa pela sombra REAL das copas.
          c+=realShaftLighting(uv,rawDepth);
          c=pow(max(c,0.0),vec3(0.94));
          c=mix(vec3(dot(c,vec3(.299,.587,.114))),c,.82);
          c=(c-.5)*1.13+.5;
          c=c*1.50+vec3(0.12);
          float d=(bayer4(gl_FragCoord.xy)/15.0-.5)/31.0;
          c=clamp(c+d,0.0,1.0);
          c=floor(c*31.0+0.5)/31.0;
          float v=1.0-smoothstep(.48,.78,distance(vUv,vec2(.5)))*.18;
          c*=v;
          gl_FragColor=vec4(c,1.0);
        }`
    });
    postMesh=new THREE.Mesh(new THREE.PlaneGeometry(2,2),postMaterial);
    postMesh.frustumCulled=false;postScene.add(postMesh);
  }

  function retroGridSize(){
    const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    const scale=isMobile?.34:.36; // EXATAMENTE a grade visual da V146
    return {w:Math.max(128,Math.round(w*scale)),h:Math.max(180,Math.round(h*scale))};
  }
  function targetSize(){
    const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    // A cena 3D é rasterizada com mais resolução apenas para preservar cobertura/silhueta ao longe.
    const scale=isMobile?.78:.86;
    return {w:Math.max(isMobile?420:640,Math.round(w*scale)),h:Math.max(isMobile?260:360,Math.round(h*scale))};
  }
  function farGridSize(){
    const w=Math.max(1,innerWidth),h=Math.max(1,innerHeight);
    const scale=isMobile?.62:.70;
    return {w:Math.max(isMobile?360:560,Math.round(w*scale)),h:Math.max(isMobile?220:320,Math.round(h*scale))};
  }
  function resizeTarget(){
    if(!renderer||!THREE)return;
    const s=targetSize(),g=retroGridSize(),fg=farGridSize();
    if(!target){
      target=new THREE.WebGLRenderTarget(s.w,s.h,{minFilter:THREE.NearestFilter,magFilter:THREE.NearestFilter,depthBuffer:true,stencilBuffer:false});
      target.depthTexture=new THREE.DepthTexture(s.w,s.h);
      target.depthTexture.format=THREE.DepthFormat;
      target.depthTexture.type=THREE.UnsignedShortType;
      target.texture.generateMipmaps=false;
      target.texture.name='V149_PSX_V146Look_HighResSource';
    }else target.setSize(s.w,s.h);
    target.texture.minFilter=THREE.NearestFilter;target.texture.magFilter=THREE.NearestFilter;target.texture.generateMipmaps=false;
    if(postMaterial){
      postMaterial.uniforms.tDiffuse.value=target.texture;
      postMaterial.uniforms.tDepth.value=target.depthTexture;
      postMaterial.uniforms.uResolution.value.set(g.w,g.h);
      postMaterial.uniforms.uFarResolution.value.set(fg.w,fg.h);
    }
  }

  function setMode(next){
    if(next!=='normal'&&next!=='retro') return;
    mode=next;retroActive=mode==='retro';
    if(renderer){
      if(retroActive){
        renderer.toneMapping=THREE.NoToneMapping;
        renderer.toneMappingExposure=1.0;
        renderer.sortObjects=oldSortObjects;
        renderer.domElement.style.imageRendering='pixelated';
        renderer.domElement.style.filter='none';
        resizeTarget();
      }else{
        renderer.toneMapping=oldToneMapping;
        renderer.toneMappingExposure=oldExposure;
        renderer.sortObjects=oldSortObjects;
        renderer.shadowMap.type=oldShadowType;
        renderer.domElement.style.imageRendering=oldImageRendering;
        renderer.domElement.style.filter=oldCanvasFilter;
      }
    }
    try{localStorage.setItem(STORAGE_KEY,mode)}catch{}
    updateUI();
    window.dispatchEvent(new CustomEvent('game:graphics-mode',{detail:{mode}}));
  }

  function patchRenderer(){
    if(renderer.__v146PsxPatched)return;
    renderer.__v146PsxPatched=true;
    oldToneMapping=renderer.toneMapping;oldExposure=renderer.toneMappingExposure;oldSortObjects=renderer.sortObjects;oldShadowType=renderer.shadowMap.type;
    oldCanvasFilter=renderer.domElement.style.filter||'';oldImageRendering=renderer.domElement.style.imageRendering||'';
    baseRender=renderer.render.bind(renderer);
    savedPos=new THREE.Vector3();savedQuat=new THREE.Quaternion();tmpEuler=new THREE.Euler();
    makePost();resizeTarget();
    renderer.render=function(sc,cam){
      if(!retroActive||sc===postScene){baseRender(sc,cam);return}
      const previousTarget=renderer.getRenderTarget?.()||null;
      let jittered=false;
      if(cam?.isCamera){
        jittered=true;savedPos.copy(cam.position);savedQuat.copy(cam.quaternion);
        const ps=isMobile?.026:.020,as=isMobile?.0075:.0055;
        cam.position.x=Math.round(cam.position.x/ps)*ps;cam.position.y=Math.round(cam.position.y/ps)*ps;cam.position.z=Math.round(cam.position.z/ps)*ps;
        tmpEuler.setFromQuaternion(cam.quaternion,'YXZ');tmpEuler.x=Math.round(tmpEuler.x/as)*as;tmpEuler.y=Math.round(tmpEuler.y/as)*as;tmpEuler.z=Math.round(tmpEuler.z/as)*as;cam.quaternion.setFromEuler(tmpEuler);
      }
      renderer.setRenderTarget(target);renderer.clear();baseRender(sc,cam);
      if(window.gameAdvancedLighting?.active)window.gameAdvancedLighting.afterScenePass(postMaterial,cam);
      if(jittered){cam.position.copy(savedPos);cam.quaternion.copy(savedQuat)}
      renderer.setRenderTarget(previousTarget);renderer.clear();postMaterial.uniforms.uTime.value=performance.now()/1000;if(cam?.isCamera){postMaterial.uniforms.uCameraNear.value=Math.max(.001,Number(cam.near)||.1);postMaterial.uniforms.uCameraFar.value=Math.max(postMaterial.uniforms.uCameraNear.value+1,Number(cam.far)||180)}baseRender(postScene,postCamera);
    };
    addEventListener('resize',resizeTarget);
  }

  function start(){
    game=window.gameReview;THREE=window.__THREE_MODULE;
    if(!game?.renderer||!game?.scene||!THREE){setTimeout(start,120);return}
    renderer=game.renderer;scene=game.scene;
    ensureUI();patchRenderer();setMode(mode);
    window.gameGraphics={version:'V149B',get mode(){return mode},setMode,toggle(){setMode(mode==='retro'?'normal':'retro')}};
    console.info('[V149B] visual Retro PSX da V146 preservado; somente a grade distante recebe detalhe 3D extra por profundidade');
  }
  start();
})();
