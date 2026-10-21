 function makePickaxe(){
 const root=new T.Group();root.name='Picareta_de_pedra';
 rod(V(0,-.38),V(0,.20),.029,mats.wood,root);
 const fork=new T.Group();root.add(fork);
 for(const x of [-.029,.029])rod(V(x*.55,.14),V(x,.35),.018,mats.wood,fork);
 const head=new T.Group();head.position.y=.275;head.name='Cabeca_encaixada';root.add(head);
 const shape=new T.Shape();shape.moveTo(-.34,-.11);shape.lineTo(-.24,.035);shape.lineTo(-.10,.075);shape.lineTo(.12,.06);shape.lineTo(.32,-.13);shape.lineTo(.21,-.035);shape.lineTo(.06,-.015);shape.lineTo(-.12,-.025);shape.lineTo(-.34,-.11);
 const blade=mesh(new T.ExtrudeGeometry(shape,{depth:.065,bevelEnabled:true,bevelSize:.012,bevelThickness:.009,bevelSegments:1}),mats.stone,V(0,0,-.0325),head);blade.name='Pedra_lascada_duas_pontas';
 const wedge=mesh(new T.ConeGeometry(.018,.095,4),mats.wood,V(0,.34,0),root);wedge.rotation.z=Math.PI;wedge.name='Cunha_de_madeira';
 const lash=new T.Group();lash.name='Amarracao_cruzada';root.add(lash);
 for(const s of [-1,1]){const pts=[];for(let i=0;i<=100;i++){const u=i/100,a=u*10*Math.PI;pts.push(V(Math.cos(a)*.066,.275+Math.sin(a)*.06+s*(u-.5)*.07,Math.sin(a)*.052));}cord(pts,lash,.0045);}
 winding(lash,.155,.215,.037,5);
 const knot=cord([V(-.035,.22,.043),V(.025,.24,.055),V(.035,.20,.047),V(-.02,.20,.052)],lash,.006);
 root.userData={head,fork,wedge,lash,tip:V(.32,.145,0)};return root;
 }
 function pickaxeProps(){
 const root=new T.Group(),model=makePickaxe();root.name='Craft_Picareta_Visual';root.add(model);
 const axe=c.makeAxeModel();axe.scale.setScalar(.60);root.add(axe);
 const hammer=window.makeMeshyStoneHammerV211?window.makeMeshyStoneHammerV211(T):makeHammer();hammer.scale.setScalar(.52);root.add(hammer);
 // Shared imported geometry/materials must survive craft cleanup.
 hammer.traverse(o=>{if(o.isMesh){o.geometry=o.geometry.clone();o.material=o.material.clone();}});
 const chips=[];for(let i=0;i<8;i++){const o=mesh(new T.TetrahedronGeometry(.012),mats.wood,V(),root);chips.push(o)}
 const raw=mesh(new T.BoxGeometry(.055,.17,.055),mats.wood,V(0,.265,0),root);
 root.userData={model,axe,hammer,chips,raw};return root;
 }
 function posePickaxe(t,dt,root){
 const {model,axe,hammer,chips,raw}=root.userData,{head,fork,wedge,lash}=model.userData;
 const info=stageInfo('pickaxe',t),p=info.p,u=smooth(p),i=info.index;
 document.getElementById('craftStageTitle').textContent=(i+1)+'/6 · '+info.title;
 document.getElementById('craftStageHint').textContent=info.hint;
 root.userData.stageIndex=i;let right=V(.20,.35,.10);const impact=Math.pow(Math.max(0,Math.sin(p*Math.PI*6)),6);
 raw.visible=i===0;raw.scale.x=Math.max(.08,1-u);fork.visible=i>0||p>.2;
 head.visible=i>=1;head.position.set(i===1?.25*(1-u):0,.275+(i===1?.14*(1-u):0),i===1?.13*(1-u):0);
 wedge.visible=i>=2;wedge.position.set(0,.34+(i===2?.14*(1-u):0),0);
 const bind=i<4?0:i===4?p:1;
 lash.traverse(o=>{if(o.isMesh){const n=o.geometry.index?.count||o.geometry.attributes.position.count;o.geometry.setDrawRange(0,Math.floor(n*clamp(bind)/3)*3)}});
 axe.visible=i===0;hammer.visible=i===3;
 if(i===0){right=V(.11*(1-impact),.43-.12*impact,.09);axe.position.copy(right).add(V(0,-.10,0));axe.rotation.set(0,0,-.6+impact*.65);}
 if(i===1)right=head.position.clone().add(V(.08,0,.06));
 if(i===2)right=wedge.position.clone().add(V(.02,.025,.04));
 if(i===3){right=V(.10*(1-impact),.49-.15*impact,.06);hammer.position.copy(right).add(V(0,-.12,0));hammer.rotation.z=-.55+.5*impact;}
 if(i===4)right=V(Math.cos(p*Math.PI*10)*.10,.275,Math.sin(p*Math.PI*10)*.075);
 if(i===5){right=V(.035,-.13,.02);model.rotation.z=Math.sin(p*Math.PI*2)*.06;}
 for(let k=0;k<chips.length;k++){const o=chips[k],q=(p*3+k/8)%1;o.visible=i===0&&p>.1;o.position.set(.015+Math.sin(k*2)*q*.17,.28-q*q*.30,Math.cos(k*2)*q*.11);o.scale.setScalar(1-q);}
 root.updateMatrixWorld(true);palmIK('left',root.localToWorld(V(-.025,-.15,.02)));palmIK('right',root.localToWorld(right));leftGrip();c.applyRealGrip();tfp.visibleRoot.updateMatrixWorld(true);
 return info;
 }
