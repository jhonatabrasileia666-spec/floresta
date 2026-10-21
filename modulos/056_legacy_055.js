

/* Four independently parameterized anatomical meshes, clothed and skinned locally. */
(function(Z,T){const V=(x=0,y=0,z=0)=>new T.Vector3(x,y,z),TAU=Math.PI*2;
function surface(rings,sides=28,open=0,ragged=0){const a=[],uv=[],idx=[];for(let j=0;j<rings.length;j++){const r=rings[j];for(let k=0;k<=sides;k++){const u=k/sides,angle=open+(TAU-2*open)*u,cs=Math.cos(angle),sn=Math.sin(angle);let y=r[0];if(j===0)y+=ragged*(.5+.3*Math.sin(k*2.7)+.2*Math.sin(k*6.1));const fold=1+.018*Math.sin(angle*13+j*.8)+.011*Math.sin(angle*23-j*.6);a.push((r[3]||0)+cs*r[1]*fold,y,(r[4]||0)+sn*r[2]*fold);uv.push(u,1-j/(rings.length-1));if(j<rings.length-1&&k<sides){let q=j*(sides+1)+k;idx.push(q,q+sides+1,q+1,q+1,q+sides+1,q+sides+2);}}}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g;}
function limb(len,r1,r2,bulge=1){return surface([[-len,r2,r2*.86],[-len*.83,r2*1.1,r2],[-len*.43,r1*bulge,r1*.90],[-len*.12,r1,r1*.9],[.015,r1*.8,r1*.82]],20);}
Z.Model=class{
 constructor(p){this.p=p;this.group=new T.Group();this.group.name='Zombie_'+p.id;this.bones={};this.list=[];this.parts=[];this.materials=new Z.Materials(p);this.meshes=[];this.secondary=[];
 const bone=(n,par,x=0,y=0,z=0)=>{const b=new T.Bone();b.name=n;b.position.set(x,y,z);(par||this.group).add(b);this.bones[n]=b;this.list.push(b);return b;};
 const root=bone('Root'),pel=bone('Pelvis',root,0,p.hipY),sp=bone('Spine',pel,0,.15),ch=bone('Chest',sp,0,p.torso-.15),neck=bone('Neck',ch,0,.035),head=bone('Head',neck,0,p.neck),jaw=bone('Jaw',head,0,p.head*.38,0);this.root=root;
 const M=this.materials;
 const torso=surface([[-.12,p.hips,.115],[0,p.hips,.12],[.12,p.waist,.096],[p.torso*.58,p.waist*1.13,.11],[p.torso*.83,p.shoulder*.94,.12],[p.torso,p.shoulder*.94,.109],[p.torso+.035,.060,.055]],36);
 this.add(torso,pel,'cloth',V(),null,(v)=>{const y=v.y;if(y<.15)return ['Pelvis','Spine',Math.max(0,y/.15)];return ['Spine','Chest',Math.min(1,(y-.15)/(p.torso-.15))];});
 this.add(surface([[-.065,.087,.061],[-.035,.057,.048],[.025,.042,.042],[p.neck*.7,.043,.045],[p.neck+.018,.052,.053]],28),neck,'skin');
 this.face(head,jaw,p);
 // Anatomical arms, ragged sleeves and separately articulated hands.
 for(const [side,sign] of [['L',1],['R',-1]]){const asym=p.id==='twisted'?(side==='L'?1.08:.94):1;const clav=bone('Clavicle_'+side,ch,sign*p.shoulder,0),arm=bone('UpperArm_'+side,clav),fore=bone('Forearm_'+side,arm,0,-p.upper*asym),hand=bone('Hand_'+side,fore,0,-p.lower);
 arm.rotation.z=sign*Math.PI/2;
 const radius=p.id==='heavy'?.070:p.id==='thin'?.040:.052;
 this.add(limb(p.upper*asym,radius,radius*.66,1.06),arm,p.id==='female'?'coat':'cloth');this.ell(arm,[0,-.025,0],[radius*1.06,radius*.93,radius*1.02],p.id==='female'?'coat':'cloth');
 this.add(limb(p.lower,.043*(p.id==='heavy'?1.18:1),.025),fore,'skin');
 const sleeve=p.id==='female'?p.lower*.96:p.id==='twisted'?p.lower*.87:p.lower*.88;
 this.add(surface([[-sleeve,.035,.033],[-sleeve*.93,.037,.034],[-.10,radius*.87,radius*.85],[.025,radius*.82,radius*.8]],24,0,.012),fore,p.id==='female'?'coat':'cloth');
 this.add(surface([[-p.palm,.040,.020],[-p.palm*.8,.044,.022],[-.022,.036,.027],[.012,.026,.027]],20),hand,'skin');
 for(const [j,name] of ['Index','Middle','Ring','Pinky'].entries()){let par=hand;const len=p.palm*[.42,.47,.44,.34][j];for(let k=1;k<=3;k++){const b=bone(name+'_'+side+'_'+k,par,k===1?sign*(-.030+j*.019):0,k===1?-p.palm:-len*(k===2?1:.72),k===1?.005:0);this.ell(b,[0,-len*[.48,.35,.28][k-1],0],[.0075-(j===3?.001:0),len*[.57,.43,.36][k-1],.010],'skin',null,10,7);par=b;}}
 let th=bone('Thumb_'+side+'_1',hand,-sign*.035,-.024,.008);th.rotation.z=-sign*.75;this.ell(th,[0,-.020,0],[.014,.028,.014],'skin',null,10,7);for(let k=2;k<=3;k++){th=bone('Thumb_'+side+'_'+k,th,0,-.033,0);this.ell(th,[0,-.014,0],[.011,.021,.012],'skin',null,10,7);}
 const thigh=bone('Thigh_'+side,pel,sign*p.hips*.55,-.015),calf=bone('Calf_'+side,thigh,0,-p.leg),foot=bone('Foot_'+side,calf,0,-p.calf),toe=bone('Toe_'+side,foot,0,-.035,.075);
 const lr=p.id==='heavy'?.090:p.id==='thin'?.061:.076;this.add(limb(p.leg,lr,lr*.65,1.02),thigh,'pants');this.add(limb(p.calf,lr*.74,.033,1.04),calf,'pants');this.ell(calf,[0,.01,.012],[lr*.64,.055,.049],'pants');this.ell(foot,[0,-.025,.041],[.047,.044,.095],'shoe');this.ell(toe,[0,0,.03],[.048,.031,.060],'shoe');
 }
 if(p.id==='female')this.dress(pel,ch,p,bone);else this.shirtDetails(ch,p);
 this.hair(head,p,bone);
 this.group.updateMatrixWorld(true);this.bind();this.rest={};this.list.forEach(b=>this.rest[b.name]={p:b.position.clone(),q:b.quaternion.clone(),worldQ:b.getWorldQuaternion(new T.Quaternion())});
 this.helper=new T.SkeletonHelper(root);this.helper.visible=false;this.group.add(this.helper);
 }
 ell(b,pos,scale,mat='skin',rot=null,seg=18,rows=12){const g=new T.SphereGeometry(1,seg,rows);const a=g.attributes.position;for(let j=0;j<a.count;j++){const x=a.getX(j),y=a.getY(j),z=a.getZ(j),k=1+.017*Math.sin(x*15+y*12)*Math.sin(z*18+y*5);a.setXYZ(j,x*k,y*k,z*k);}g.computeVertexNormals();this.add(g,b,mat,V(...pos),scale,undefined,rot);}
 add(g,b,mat,pos=V(),scale=null,weights=null,rot=null){this.parts.push({g,b,mat,pos,scale:scale?V(...scale):V(1,1,1),weights,rot:rot?new T.Euler(...rot):new T.Euler()});}
 face(head,jaw,p){const h=p.head,w=p.headW,d=p.headD,pts=[],uv=[],ix=[],rows=60,sides=64,mY=h*.251,mX=p.id==='heavy'?.050:p.id==='female'?.037:.036,mH=p.mouth;
 const data=Z.headData;for(let i=0;i<data.position.length;i+=3){let x=data.position[i]*w,y=data.position[i+1]*h,z=data.position[i+2]*d;const lower=Math.max(0,1-y/(h*.48));if(p.id==='female')x*=1-lower*.11;if(p.id==='heavy')x*=1+lower*.12;if(p.id==='thin')x*=1-.08*Math.exp(-(((y-h*.39)/(h*.16))**2));if(p.id==='twisted'){x+=.005*Math.sin(y/h*4);z+=.003*Math.sin(x*60+y*35);}if(z>0){const hollow=Math.exp(-(((Math.abs(x)-w*.65)/(w*.28))**2)-((y-h*.36)/(h*.13))**2);z-=hollow*(p.id==='thin'?.009:.004);}pts.push(x,y,z);}uv.push(...data.uv);
 for(let i=0;i<data.index.length;i+=3){const ids=data.index.slice(i,i+3),x=ids.reduce((s,j)=>s+pts[j*3],0)/3,y=ids.reduce((s,j)=>s+pts[j*3+1],0)/3,z=ids.reduce((s,j)=>s+pts[j*3+2],0)/3;if(z>d*.48&&((x/(mX*.96))**2+((y-mY)/(mH*.88))**2)<1)continue;ix.push(...ids);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pts,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();this.add(g,head,'skin',V(),null,v=>['Head','Jaw',Math.max(0,Math.min(.8,(h*.32-v.y)/.050))]);
 const cavity=new T.SphereGeometry(1,24,18);cavity.scale(mX,mH*1.10,.018);cavity.translate(0,mY,d*.66);this.add(cavity,head,'mouth',V(),null,v=>['Head','Jaw',Math.max(0,Math.min(.8,(mY-v.y)/mH))]);this.ell(head,[0,mY+mH*.69,d*.78],[mX*.93,.004,.006],'gum');this.ell(jaw,[0,mY-mH*.63-h*.38,d*.78],[mX*.88,.004,.006],'gum');
 // Irregular gum line, individual broken teeth and exposed asymmetric cheek wound.
 for(const [side,s] of [['L',1],['R',-1]]){this.ell(head,[s*w*.49,h*.557,d*.71],[.009,.005,.005],'eye');this.ell(head,[s*w*.49+.002,h*.557,d*.763],[.002,.003,.001],'pupil');}
 for(let k=0;k<9;k++){const x=(k-4)*mX*.205,z=d*.82-Math.abs(x)*.08;this.add(new T.BoxGeometry(.006,.010+(k%3)*.002,.005),head,k%4===0?'gum':'teeth',V(x,mY+mH*.69,z),null,null,[0,0,.10*Math.sin(k*4)]);if(k!==2&&k!==6)this.add(new T.BoxGeometry(.006,.009+(k%2)*.002,.005),jaw,'teeth',V(x,mY-mH*.63-h*.38,z),null,null,[0,0,.08*Math.sin(k*3)]);}

 
 const side=p.id==='twisted'?1:-1;this.ell(head,[side*w*.72,h*.41,d*.55],[.019,.028,.006],'gum',[0,side*.3,-.2]);
 for(let j=0;j<5;j++)this.ell(head,[side*w*.68+(j%2)*.005,h*.34+j*.010,d*.58],[.0025,.009,.003],'teeth',[0,0,-.4],8,5);
 }
 shirtDetails(ch,p){const len=p.torso+.10;for(let k=0;k<6;k++)this.ell(ch,[.003,-k*len/6,.130],[.006,.006,.003],'button',null,8,6);for(const s of [-1,1]){const g=new T.PlaneGeometry(.071,.12,2,3);this.add(g,ch,'cloth',V(s*.042,.005,.132),null,null,[-.08,0,s*.22]);}if(p.id==='heavy'){this.ell(ch,[-.09,-.13,.115],[.042,.063,.008],'coat');}}
 dress(pel,ch,p,bone){
 const hem=-p.hipY+.075,rings=[[hem,.235,.19],[hem+.12,.225,.183],[-.52,.198,.158],[-.20,p.hips*.97,.124],[0,p.hips,.124],[.13,p.waist+.006,.099]];
 const bones=[];for(let j=0;j<4;j++){const b=bone('Skirt_'+j,pel);this.secondary.push(b);bones.push(b);}
 this.add(surface(rings,48,0,.038),pel,'cloth',V(),null,v=>{const side=v.x>0?'L':'R';if(v.y>-.25)return ['Pelvis','Thigh_'+side,Math.max(0,-v.y/.25)*.7];return ['Thigh_'+side,'Calf_'+side,Math.min(.88,Math.max(0,(-v.y-.35)/.5))];});
 // Open coat: back arc and two distinct front hanging panels.
 const a=[],uv=[],ix=[],cols=36,rs=[[-p.hipY+.09,.272,.207],[-.65,.25,.19],[-.25,.207,.155],[.10,.158,.13],[p.torso-.02,p.shoulder+.024,.142]];
 for(let j=0;j<rs.length;j++)for(let k=0;k<=cols;k++){const u=k/cols,ang=Math.PI*.72+u*Math.PI*1.57,r=rs[j],y=r[0]+(j===0?.024*Math.sin(k*3.2):0);a.push(Math.cos(ang)*r[1],y,Math.sin(ang)*r[2]);uv.push(u,1-j/(rs.length-1));if(j<rs.length-1&&k<cols){const q=j*(cols+1)+k;ix.push(q,q+cols+1,q+1,q+1,q+cols+1,q+cols+2);}}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(a,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(ix);g.computeVertexNormals();this.add(g,pel,'coat',V(),null,v=>v.y>0?['Spine','Chest',Math.min(1,v.y/p.torso)]:(v.y>-.25?['Pelvis','Thigh_'+(v.x>0?'L':'R'),Math.max(0,-v.y/.25)*.7]:['Thigh_'+(v.x>0?'L':'R'),'Calf_'+(v.x>0?'L':'R'),Math.min(.88,Math.max(0,(-v.y-.35)/.5))]));
 for(let k=0;k<7;k++)this.ell(ch,[.012,-k*.087,.124],[.005,.005,.003],'button',null,8,6);
 }
 hair(head,p,bone){
 const long=p.hair==='long',short=p.hair==='short',count=long?88:short?58:p.hair==='patch'?22:12;
 if(long||short){const cap=new T.SphereGeometry(1,36,16,0,TAU,0,1.2);this.add(cap,head,'hair',V(0,p.head*.64,0),[p.headW*1.04,p.head*.38,p.headD*1.04]);}
 for(let j=0;j<count;j++){let a=j/count*TAU;const front=Math.sin(a)>.60;if(front&&j%14!==0)a+=Math.cos(a)>0?-.62:.62;const back=Math.sin(a)<.15,length=long?(back?.33:.26):short?.14:.062,parent=j%12===0?bone('Hair_'+j,head):head;if(parent!==head)this.secondary.push(parent);
 const points=[V(Math.cos(a)*p.headW*.48,p.head*.95,Math.sin(a)*p.headD*.48),V(Math.cos(a)*p.headW*1.00,p.head*.75,Math.sin(a)*p.headD*.97),V(Math.cos(a)*(p.headW+.006),p.head*.78-length*.6,Math.sin(a)*(p.headD+.009)),V(Math.cos(a)*(p.headW+.015)+.006*Math.sin(j*7),p.head*.78-length,Math.sin(a)*(p.headD+.014))];const curve=new T.CatmullRomCurve3(points),g=new T.TubeGeometry(curve,long?15:10,long?.0033:.0028,5,false);const pa=g.attributes.position;for(let k=0;k<pa.count;k++){const u=Math.floor(k/6)/(long?15:10),center=curve.getPointAt(u),v=V().fromBufferAttribute(pa,k).sub(center).multiplyScalar(1-u*.85).add(center);pa.setXYZ(k,v.x,v.y,v.z);}g.computeVertexNormals();this.add(g,parent,'hair');}
 }
 bind(){const bins={};this.group.updateMatrixWorld(true);const m=new T.Matrix4(),q=new T.Quaternion(),normalM=new T.Matrix3(),v=V(),n=V();for(const p of this.parts){const b=bins[p.mat]||(bins[p.mat]={pos:[],norm:[],uv:[],si:[],sw:[],idx:[]});const off=b.pos.length/3;m.compose(p.pos,q.setFromEuler(p.rot),p.scale);m.premultiply(p.b.matrixWorld);normalM.getNormalMatrix(m);const g=p.g;for(let j=0;j<g.attributes.position.count;j++){v.fromBufferAttribute(g.attributes.position,j);const wt=p.weights?p.weights(v):[p.b.name,p.b.name,0];v.applyMatrix4(m);n.fromBufferAttribute(g.attributes.normal,j).applyMatrix3(normalM).normalize();b.pos.push(...v.toArray());b.norm.push(...n.toArray());b.uv.push(g.attributes.uv.getX(j),g.attributes.uv.getY(j));b.si.push(this.list.indexOf(this.bones[wt[0]]),this.list.indexOf(this.bones[wt[1]]),0,0);const w=T.MathUtils.clamp(wt[2],0,1);b.sw.push(1-w,w,0,0);}for(const i of g.index.array)b.idx.push(off+i);g.dispose();}
 this.skeleton=new T.Skeleton(this.list);for(const [key,b] of Object.entries(bins)){const g=new T.BufferGeometry();for(const [name,key,size] of [['position','pos',3],['normal','norm',3],['uv','uv',2],['skinWeight','sw',4]])g.setAttribute(name,new T.Float32BufferAttribute(b[key],size));g.setAttribute('skinIndex',new T.Uint16BufferAttribute(b.si,4));g.setIndex(b.idx);const material=this.materials[key];material.side=T.DoubleSide;const mesh=new T.SkinnedMesh(g,material);mesh.name=this.p.id+'_'+key;mesh.frustumCulled=false;this.group.add(mesh);mesh.bind(this.skeleton);this.meshes.push(mesh);}this.parts=[];}
 dispose(){this.skeleton.dispose();this.meshes.forEach(m=>m.geometry.dispose());this.helper.geometry.dispose();this.helper.material.dispose();this.materials.dispose();this.group.removeFromParent();}
};Z.surface=surface;Z.compactGeometry=function(g){if(!g.index)return g;const used=[],map=new Map(),indices=[];for(const old of g.index.array){if(!map.has(old)){map.set(old,used.length);used.push(old);}indices.push(map.get(old));}const out=new T.BufferGeometry();for(const [name,a]of Object.entries(g.attributes)){const arr=new a.array.constructor(used.length*a.itemSize);for(let i=0;i<used.length;i++)for(let j=0;j<a.itemSize;j++)arr[i*a.itemSize+j]=a.array[used[i]*a.itemSize+j];out.setAttribute(name,new T.BufferAttribute(arr,a.itemSize,a.normalized));}out.setIndex(indices);g.dispose();return out;};
})(ZOMBIES,window.__THREE_MODULE);


