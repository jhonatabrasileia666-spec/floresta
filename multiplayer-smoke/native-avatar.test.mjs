import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import vm from 'node:vm';
import * as THREE from 'three';

const path=new URL('../modulos/159_floresta_duo_native_avatar.js',import.meta.url);
const source=readFileSync(path,'utf8');

const rig=new THREE.Group();rig.name='NativeMixamoSource';
const names=[
 'mixamorig:Hips','mixamorig:Spine','mixamorig:Spine1','mixamorig:Spine2',
 'mixamorig:Neck','mixamorig:Head','mixamorig:HeadTop',
 'mixamorig:LeftShoulder','mixamorig:LeftArm','mixamorig:LeftForeArm','mixamorig:LeftHand',
 'mixamorig:RightShoulder','mixamorig:RightArm','mixamorig:RightForeArm','mixamorig:RightHand',
 'mixamorig:LeftUpLeg','mixamorig:LeftLeg','mixamorig:LeftFoot',
 'mixamorig:RightUpLeg','mixamorig:RightLeg','mixamorig:RightFoot'
];
const bones=names.map(name=>{const b=new THREE.Bone();b.name=name;return b;});
for(let i=1;i<bones.length;i++)bones[i-1].add(bones[i]);
const mesh=new THREE.SkinnedMesh(new THREE.BoxGeometry(1,1,1),new THREE.MeshStandardMaterial());
mesh.name='FullBodyMixamo';mesh.add(bones[0]);
const skeleton=new THREE.Skeleton(bones);mesh.bind(skeleton);
rig.add(mesh);
const scene=new THREE.Group();
const ctx={fillStyle:'',strokeStyle:'',font:'',textAlign:'',fillRect(){},strokeRect(){},fillText(){}};
const document={createElement(type){
 if(type==='canvas')return {width:256,height:64,getContext(){return ctx}};
 throw Error('Invalid element '+type);
}};
const rightHand=new THREE.Group();
rightHand.add(new THREE.Mesh(new THREE.ConeGeometry(.1,.7,8),new THREE.MeshStandardMaterial()));
const gameReview={trueFirstPerson:{model:rig,visibleRoot:rig,fullMesh:mesh,localMesh:null},scene};
const character={get:()=>({style:'longo',color:'#674229',size:1}),
 makeRemoteHair(head,look){const hair=new THREE.Group();hair.name='Hair_'+look.style;head.add(hair);return hair;}};
const globals={window:{gameReview,__THREE_MODULE:THREE,gameCharacterV263:character,gameRightHand:{current:'axe',object:rightHand}},document,console,Math,Map,Set,Array,String,Number,Boolean};
vm.createContext(globals);
vm.runInContext(source,globals);
const api=globals.window.FlorestaDuoAvatar;
assert.equal(api.probe().ready,true);
const captured=api.capture();
assert.ok(captured.length>=12,'pose real enviada pelo rig Mixamo');
const peer={id:'friend',name:'Amigo',look:null};
assert.equal(api.create(peer,THREE,gameReview),true,'construir clone real sem placeholder');
assert.ok(peer.nativeAvatar);
assert.notEqual(peer.full,mesh);
assert.notEqual(peer.full.skeleton.bones[0],mesh.skeleton.bones[0],'clone não pode compartilhar ossos do próprio personagem');
assert.equal(peer.full.geometry,mesh.geometry,'malhas texturizadas reutilizadas em memória');
assert.equal(peer.root.parent,scene);
bones[0].quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0),.65);
const newPose=api.capture();
api.pose(peer,{pose:newPose,look:{style:'longo',color:'#674229',size:1},
 equipment:{right:'axe',left:'',torch:false}});
assert.ok(Math.abs(peer.bones.get('hips').quaternion.y-bones[0].quaternion.y)<.01,
 'replicar animação sem deslocar o rig local');
assert.ok(peer.hair?.parent,'replicar penteado original');
assert.ok(peer.gear.has('right'),'arma aparece na mão direita');
assert.ok(peer.gear.get('right').visual);
api.pose(peer,{pose:newPose,equipment:{right:'axe',left:'',torch:true}});
const torchSocket=peer.gear.get('left').root;
api.pose(peer,{pose:newPose,equipment:{right:'axe',left:'',torch:true}});
assert.equal(peer.gear.get('left').root,torchSocket,'tocha não deve ser reconstruída em cada frame');
assert.equal(api.dispose(peer),true);
assert.equal(peer.root,null);
assert.equal(mesh.geometry.isBufferGeometry,true,'descarregar avatar remoto não pode destruir corpo original');
console.log('AVATAR NATIVO: clone Mixamo independente, pose, cabelo, arma e limpeza OK.');
