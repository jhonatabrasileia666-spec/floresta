/* FLORESTA V264 — corretor do criador: cortes VISÍVEIS no menu e cabelo dimensional preso ao mesmo rig. */
(()=>{'use strict';
 const KEY='floresta-character-look-v263'; // Mesma chave: NÃO apagar escolhas antigas.
 const COLORS=['#29211c','#674229','#b79b65','#44382b','#c6b19d','#25262c','#a95a32','#d0c4aa'];
 const STYLES=['raspado','curto','medio','longo'];
 const NAMES={raspado:'Raspado',curto:'Curto',medio:'Médio',longo:'Longo'};
 const COLOR_NAMES={'#29211c':'Preto','#674229':'Castanho','#b79b65':'Loiro','#44382b':'Castanho escuro','#c6b19d':'Prateado','#25262c':'Preto azulado','#a95a32':'Ruivo','#d0c4aa':'Branco'};
 const DEFAULT={style:'curto',color:'#29211c',size:1};
 const sanitize=v=>({style:STYLES.includes(v?.style)?v.style:DEFAULT.style,color:COLORS.includes(v?.color)?v.color:DEFAULT.color,size:Math.max(.8,Math.min(1.2,Number(v?.size)||1))});
 let look={...DEFAULT},rig=null,hair=null,three=null,head=null,headSize=0,lastWarn='';
 try{look=sanitize(JSON.parse(localStorage.getItem(KEY)))}catch{}
 const norm=s=>String(s||'').replace(/^.*[|:]/,'').replace(/^mixamorig/i,'').replace(/[^a-z0-9]/gi,'').toLowerCase();
 function removeHair(){if(!hair)return;hair.parent?.remove(hair);const mats=new Set();hair.traverse(o=>{if(o.isMesh){o.geometry?.dispose();if(o.material)mats.add(o.material);}});for(const m of mats)m.dispose?.();hair=null;head=null;}
 function attach(){
  const current=window.gameReview?.trueFirstPerson;
  three=window.__THREE_MODULE;
  if(!three?.Group||!current?.fullMesh?.skeleton?.bones)return false;
  if(current!==rig){removeHair();rig=current;}
  if(hair?.parent)return true;
  const bones=current.fullMesh.skeleton.bones;
  const b=current.bones?.head||bones.find(x=>norm(x.name)==='head');
  if(!b)return false;
  head=b;
  // O FBX Mixamo usa centímetros e o corpo é escalado no mundo. A V263 usava
  // geometrias de 0.1 *unidade do osso* (quase invisíveis). Converter METROS
  // para as unidades locais efetivas do osso resolve a escala.
  b.updateWorldMatrix?.(true,false);
  const worldScale=new three.Vector3(1,1,1);b.getWorldScale?.(worldScale);
  const sx=Math.abs(worldScale.x)||1,sy=Math.abs(worldScale.y)||sx;
  const r=Math.max(.005,Math.min(999,.105/sx)); // raio visível de ~10,5 cm
  const topBone=current.bones?.headTop||bones.find(x=>norm(x.name)==='headtop');
  const topY=topBone?.parent===b&&Number.isFinite(topBone.position.y)
   ?topBone.position.y : (.158/sy);
  // Proteção para rigs com HeadTop ausente ou de tamanho incorreto.
  const y=Math.max(.07/sy,Math.min(.245/sy,topY)) - r*.54;
  headSize=r;
  const g=new three.Group();g.name='Floresta_Cabelo_Jogador_V264';
  const mat=new three.MeshStandardMaterial({color:look.color,roughness:.94,metalness:0,side:three.DoubleSide});
  const add=(geometry,x=0,dy=0,z=0,rz=0)=>{const m=new three.Mesh(geometry,mat);m.position.set(x,y+dy,z);m.rotation.z=rz;m.castShadow=true;m.frustumCulled=false;g.add(m);return m};
  // Toca e laterais situadas sobre a cabeça, com formatos diferentes por corte.
  if(look.style==='raspado'){
   add(new three.SphereGeometry(r*.985,20,12,0,Math.PI*2,0,Math.PI*.49),0,0,0).scale.set(1,.41,1);
  }else{
   const thick=look.style==='curto'?.58:look.style==='medio'?.75:.87;
   add(new three.SphereGeometry(r*1.09,24,14,0,Math.PI*2,0,Math.PI*.59),0,r*.16,0).scale.set(1,thick,1.05);
   // Franja dá relevo e ajuda a reconhecer o cabelo fora da câmera FPS.
   for(let i=0;i<5;i++){
    const x=(i-2)*r*.36;
    add(new three.SphereGeometry(r*.225,10,8),x,r*.09,-r*.81).scale.set(.91,.56,1);
   }
   if(look.style==='medio'||look.style==='longo'){
    const length=look.style==='longo'?r*2.25:r*1.13;
    for(const sign of [-1,1]){
     add(new three.SphereGeometry(r*.37,12,9),sign*r*.87,-r*.50,0).scale.set(.68,1.05,.88);
     add(new three.CylinderGeometry(r*.32,r*.19,length,12),sign*r*.88,-r*.58-length*.45,.04,sign*.07);
    }
    if(look.style==='longo')add(new three.CylinderGeometry(r*.69,r*.37,r*1.8,14),0,-r*1.22,r*.42);
   }
  }
  g.scale.setScalar(look.size);
  b.add(g);hair=g;
  // Nunca deixar cabelo atravessar a visão dos olhos; inspeção 3ª pessoa mostra.
  hair.visible=!!window.gameThirdPersonTest?.active;
  return true;
 }
 function apply(next){look=sanitize(next);try{localStorage.setItem(KEY,JSON.stringify(look))}catch{}removeHair();attach();window.dispatchEvent(new CustomEvent('floresta:appearance-change',{detail:{...look}}));return {...look};}
 // Reuses the approved V264 hairstyles on cloned remote Mixamo skeletons.
 // Never changes local player appearance or saves while constructing a remote hair mesh.
 function makeRemoteHair(b,raw){
  const T=window.__THREE_MODULE;
  if(!T?.Mesh||!b)return null;
  const style=sanitize(raw);
  b.updateWorldMatrix?.(true,false);
  const scale=new T.Vector3(1,1,1);b.getWorldScale?.(scale);
  const sx=Math.abs(scale.x)||1,sy=Math.abs(scale.y)||sx;
  const r=Math.max(.005,Math.min(999,.105/sx));
  const top=b.children?.find?.(x=>norm(x.name)==='headtop');
  const topY=top&&Number.isFinite(top.position.y)?top.position.y:(.158/sy);
  const y=Math.max(.07/sy,Math.min(.245/sy,topY))-r*.54;
  const g=new T.Group();g.name='Floresta_Cabelo_Jogador_Duo';
  const mat=new T.MeshStandardMaterial({color:style.color,roughness:.94,metalness:0,side:T.DoubleSide});
  const add=(geom,x=0,dy=0,z=0,rz=0)=>{
   const m=new T.Mesh(geom,mat);
   m.position.set(x,y+dy,z);m.rotation.z=rz;m.castShadow=true;m.frustumCulled=false;g.add(m);return m;
  };
  if(style.style==='raspado'){
   add(new T.SphereGeometry(r*.985,20,12,0,Math.PI*2,0,Math.PI*.49)).scale.set(1,.41,1);
  }else{
   const thick=style.style==='curto'?.58:style.style==='medio'?.75:.87;
   add(new T.SphereGeometry(r*1.09,24,14,0,Math.PI*2,0,Math.PI*.59),0,r*.16).scale.set(1,thick,1.05);
   for(let i=0;i<5;i++)add(new T.SphereGeometry(r*.225,10,8),(i-2)*r*.36,r*.09,-r*.81).scale.set(.91,.56,1);
   if(style.style==='medio'||style.style==='longo'){
    const length=style.style==='longo'?r*2.25:r*1.13;
    for(const sign of [-1,1]){
     add(new T.SphereGeometry(r*.37,12,9),sign*r*.87,-r*.50).scale.set(.68,1.05,.88);
     add(new T.CylinderGeometry(r*.32,r*.19,length,12),sign*r*.88,-r*.58-length*.45,.04,sign*.07);
    }
    if(style.style==='longo')add(new T.CylinderGeometry(r*.69,r*.37,r*1.8,14),0,-r*1.22,r*.42);
   }
  }
  g.scale.setScalar(style.size);
  b.add(g);
  return g;
 }
 const api=window.gameCharacterV263={get:()=>({...look}),apply,makeRemoteHair,get ready(){return !!hair?.parent},get diagnostic(){return {rig:!!rig,head:head?.name||null,physicalRadius:.105,localRadius:headSize,visible:!!hair?.visible,error:lastWarn}},styles:STYLES,colors:COLORS,version:'V264'};
 const sync=setInterval(()=>{try{if(!hair?.parent)attach();if(hair)hair.visible=!!window.gameThirdPersonTest?.active;}catch(e){if(lastWarn!==String(e)){lastWarn=String(e);console.warn('[FLORESTA CABELO V264]',e);}}},320);
 window.addEventListener('pagehide',()=>clearInterval(sync),{once:true});
 // Miniaturas são SVG locais, sem depender de modelos/arquivos externos.
 function avatarSVG(style,color,large=false){
  const extras={
   raspado:`<path d="M22 40 Q24 14 47 14 Q70 14 72 40 Q49 31 22 40Z" fill="${color}" opacity=".82"/>`,
   curto:`<path d="M18 44 Q11 17 32 13 Q46 1 67 13 Q82 25 76 46 L69 38 Q49 28 26 38Z" fill="${color}"/><path d="M27 24Q46 13 67 25" stroke="#ffffff" stroke-opacity=".13" stroke-width="3" fill="none"/>`,
   medio:`<path d="M18 29Q22 5 48 8Q73 6 78 33L80 66Q72 72 65 61L67 36Q42 27 27 37L25 66Q15 71 14 60Z" fill="${color}"/>`,
   longo:`<path d="M17 29Q18 3 47 7Q79 4 80 32L86 94Q73 103 64 86L67 36Q45 26 27 37L29 89Q17 103 9 89Z" fill="${color}"/>`
  };
  return `<svg viewBox="0 0 96 110" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Cabelo ${NAMES[style]}" style="width:${large?'130px':'86px'};height:${large?'156px':'104px'};display:block;overflow:visible"><path d="M17 109Q22 90 40 89H55Q77 90 82 109" fill="#454b40"/><rect x="40" y="82" width="16" height="16" rx="6" fill="#b78b6a"/><ellipse cx="47" cy="52" rx="26" ry="37" fill="#c99b79"/><path d="M37 52h5m12 0h5" stroke="#3a2f2a" stroke-width="2" stroke-linecap="round"/><path d="M44 68q4 3 8 0" fill="none" stroke="#895b49" stroke-width="1.5"/>${extras[style]}</svg>`;
 }
 function injectCSS(){if(document.getElementById('f264CreatorCSS'))return;const style=document.createElement('style');style.id='f264CreatorCSS';style.textContent=`
 #f172Menu{overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;scrollbar-width:thin;scrollbar-color:#a48b59 transparent;box-sizing:border-box;}
 #f172Menu .f172-logo{height:clamp(110px,23vh,210px);margin-bottom:1vh;flex-shrink:0}
 #f172Actions button{min-height:clamp(40px,6.15vh,58px);padding:6px 13px;font-size:clamp(16px,1.7vw,26px);gap:14px;flex-shrink:0}
 #f172Actions [data-action="character"]{border-left:3px solid #dfb46c!important;color:#f2d397!important}
 #f172PanelBody .f264-choices{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:9px;margin:9px 0 19px}
 #f172PanelBody button.f264-style{margin:0;padding:7px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:3px;min-width:0;background:#131d17;border:1px solid #796e57;border-radius:9px;color:#e9dcc2;font:12px system-ui;cursor:pointer}
 #f172PanelBody button.f264-style[aria-pressed="true"]{border:2px solid #f4c878;box-shadow:0 0 0 1px #f4c87877,inset 0 0 14px #bc913d24;background:#293125}
 #f172PanelBody button.f264-color{margin:0;border:2px solid #726950;padding:2px;border-radius:100%;width:34px;height:34px;background:transparent;display:inline-grid;place-items:center;cursor:pointer}
 #f172PanelBody button.f264-color[aria-pressed="true"]{border-color:#ffcf74;box-shadow:0 0 0 2px #dfb96a55}
 #f172PanelBody .f264-swatch{border-radius:50%;width:24px;height:24px;border:1px solid #ffffff44}
 #f172PanelBody .f264-preview{display:flex;align-items:center;justify-content:center;gap:22px;background:radial-gradient(ellipse,#344238 0%,#18241c 70%);border:1px solid #8f7b52;border-radius:12px;padding:9px;margin:10px 0}
 #f172PanelBody .f264-label{display:block;color:#f1d59b;font:700 12px system-ui;letter-spacing:.07em;margin:12px 0 5px}
 #f172PanelBody .f264-colors{display:flex;gap:6px;flex-wrap:wrap;margin:8px 0 15px}
 #f172PanelBody #f264Apply{width:100%;font:700 14px system-ui;background:#425039;border:1px solid #d3b26b;border-radius:7px}
 @media(max-width:640px){#f172Menu{top:4vh;height:92vh}#f172Menu .f172-logo{height:clamp(92px,19vh,155px)}#f172Actions button{min-height:clamp(42px,6vh,52px);font-size:clamp(16px,4.6vw,23px)}#f172Panel{padding:14px!important;width:calc(100vw - 22px)!important;max-height:93dvh!important}#f172PanelBody .f264-choices{grid-template-columns:repeat(2,minmax(0,1fr))}#f172PanelBody .f264-preview{gap:8px}}
 @media(max-height:600px){#f172Menu .f172-logo{height:clamp(72px,18vh,115px)}#f172Actions button{min-height:38px!important;font-size:17px!important}}
 `;document.head.appendChild(style);}
 function mount(){
  const F=window.gameFront172;const actions=F?.shell?.querySelector('#f172Actions');if(!actions)return false;
  injectCSS();let btn=actions.querySelector('[data-action="character"]');
  if(!btn){btn=document.createElement('button');btn.type='button';btn.dataset.action='character';btn.innerHTML='<span aria-hidden="true">♙</span>Personagem — cabelos';btn.title='Abrir cortes e cores de cabelo';const anchor=actions.querySelector('[data-action="new"]');(anchor||actions.firstChild)?.after?.(btn);}
  btn.onclick=()=>openEditor();
  return true;
 }
 function openEditor(){
  const F=window.gameFront172;
  if(typeof F?.showPanel!=='function'){console.warn('Menu ainda não está pronto para escolher cabelo');return;}
  const draft=api.get();
  F.showPanel('Criador de personagem',`<div id="f264Creator" style="max-width:510px;margin:auto;color:#efdfbd">
   <p style="font:13px/1.5 system-ui;color:#d7d1bc">Escolha um dos cortes abaixo. A miniatura muda na hora; o corpo animado usa a aparência escolhida.</p>
   <div class="f264-preview"><div id="f264BigPreview"></div><div style="font:12px/1.65 system-ui;min-width:98px"><strong id="f264StyleName" style="font-size:18px;color:#ffdd9d"></strong><div id="f264ColorName"></div><small>Prévia ilustrada</small></div></div>
   <span class="f264-label">ESCOLHA UM CORTE</span><div class="f264-choices" id="f264Styles">${STYLES.map(s=>`<button class="f264-style" data-cut="${s}" aria-label="Selecionar corte ${NAMES[s]}" aria-pressed="false">${avatarSVG(s,draft.color)}<strong>${NAMES[s]}</strong></button>`).join('')}</div>
   <span class="f264-label">COR DO CABELO</span><div class="f264-colors" id="f264Colors">${COLORS.map(c=>`<button class="f264-color" type="button" data-color="${c}" aria-label="${COLOR_NAMES[c]}" title="${COLOR_NAMES[c]}" aria-pressed="false"><span class="f264-swatch" style="background:${c}"></span></button>`).join('')}</div>
   <label for="f264Size" class="f264-label">VOLUME <output id="f264SizeText"></output></label><input id="f264Size" type="range" min="0.8" max="1.2" step="0.05" value="${draft.size}" style="width:100%;accent-color:#e7bd77;touch-action:pan-x;margin:6px 0 14px">
   <button id="f264Apply" type="button">APLICAR AO PERSONAGEM</button><p id="f264Status" role="status" style="font:12px system-ui;color:#cde1b7"></p></div>`);
  const root=document.getElementById('f264Creator');if(!root)return;
  const refresh=()=>{
   root.querySelector('#f264BigPreview').innerHTML=avatarSVG(draft.style,draft.color,true);
   root.querySelector('#f264StyleName').textContent=NAMES[draft.style];
   root.querySelector('#f264ColorName').textContent=COLOR_NAMES[draft.color];
   root.querySelector('#f264SizeText').textContent=Math.round(draft.size*100)+'%';
   root.querySelectorAll('[data-cut]').forEach(b=>{b.setAttribute('aria-pressed',String(b.dataset.cut===draft.style));b.querySelector('svg')?.remove();b.insertAdjacentHTML('afterbegin',avatarSVG(b.dataset.cut,draft.color));});
   root.querySelectorAll('[data-color]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.color===draft.color)));
  };
  root.addEventListener('click',e=>{
   const cut=e.target.closest('[data-cut]'),col=e.target.closest('[data-color]');
   if(cut){draft.style=cut.dataset.cut;refresh();}
   if(col){draft.color=col.dataset.color;refresh();}
  });
  root.querySelector('#f264Size').addEventListener('input',e=>{draft.size=Number(e.target.value);refresh();});
  root.querySelector('#f264Apply').onclick=()=>{api.apply(draft);root.querySelector('#f264Status').textContent='Aparência aplicada e salva. No jogo, use CÂMERA: 3ª PESSOA para ver o cabelo no seu próprio personagem.';};
  refresh();
 }
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount,{once:true});else mount();
 window.FlorestaCreatorV264={open:openEditor,mount};
})();
