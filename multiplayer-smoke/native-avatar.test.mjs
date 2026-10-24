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
// Native object registry: use exactly the meshes created by the solo equipment renderer.
const nativeTorch=new THREE.Group();nativeTorch.name='PlayerTorchOriginal';
const nativeShaft=new THREE.Mesh(new THREE.CylinderGeometry(.04,.05,.55,7),new THREE.MeshStandardMaterial({color:0x564127}));
nativeShaft.name='TorchHandle';nativeTorch.add(nativeShaft);
const nativeFire=new THREE.Mesh(new THREE.ConeGeometry(.08,.20,7),new THREE.MeshStandardMaterial({color:0xffbb39}));
nativeFire.name='TorchFlame';nativeFire.position.y=.34;nativeTorch.add(nativeFire);
gameReview.torchObject=nativeTorch;
api.pose(peer,{pose:newPose,look:{style:'longo',color:'#674229',size:1},
 equipment:{right:'axe',left:'',torch:false}});
assert.ok(Math.abs(peer.bones.get('hips').quaternion.y-bones[0].quaternion.y)<.01,'replicar animação sem deslocar rig');
assert.ok(peer.hair?.parent,'replicar penteado original');
const axe=peer.gear.get('right');
assert.equal(axe.native,true,'machado vem do próprio equipamento do jogo');
assert.equal(axe.visual.children[0].geometry,rightHand.children[0].geometry,'usar malha real, não substituta');
api.pose(peer,{pose:newPose,equipment:{right:'axe',left:'',torch:true}});
const torch=peer.gear.get('left');
assert.ok(torch.native&&!torch.pending,'tocha deve ser clonada do modelo real');
assert.equal(torch.visual.children[0].geometry,nativeShaft.geometry);
assert.equal(torch.visual.children[1].geometry,nativeFire.geometry);
assert.equal(torch.visual.children.length,2,'não criar nova chama nem outro visual');
const torchSocket=torch.root;
api.pose(peer,{pose:newPose,equipment:{right:'axe',left:'',torch:true}});
assert.equal(peer.gear.get('left').root,torchSocket,'não reconstruir a tocha a cada frame');
// A missing item must NOT be replaced by an invented sword/spear model.
api.pose(peer,{pose:newPose,equipment:{right:'spear',left:'',torch:false}});
assert.equal(peer.gear.get('right').pending,true,'quando faltar original, não fabricar outra aparência');
assert.equal(peer.gear.get('right').root,null);
assert.equal(peer.gear.has('left'),false,'tocha desaparece quando guardada');
const spearGeometry=new THREE.ConeGeometry(.1,1.1,8);
const nativeSpear=new THREE.Group();nativeSpear.name='RealSpearOriginal';
nativeSpear.add(new THREE.Mesh(spearGeometry,new THREE.MeshStandardMaterial()));
globals.window.gameRightHand.current='spear';
globals.window.gameRightHand.object=nativeSpear;
api.pose(peer,{pose:newPose,equipment:{right:'spear',left:'',torch:false}});
const spear=peer.gear.get('right');
assert.ok(spear.native&&!spear.pending,'substituir pendência pelo objeto original quando disponível');
assert.equal(spear.visual.children[0].geometry,spearGeometry,'não criar geometria de lança nova');
const forgeMesh=new THREE.BoxGeometry(.16,.67,.08);
const forged=new THREE.Group();forged.visible=false;
const forgedBlade=new THREE.Mesh(forgeMesh,new THREE.MeshStandardMaterial());forgedBlade.visible=false;
forged.add(forgedBlade);
globals.window.gameForgeV230={makeEquipmentModel:id=>id==='forged_silver_sword'?forged:null};
api.pose(peer,{pose:newPose,equipment:{right:'forged_silver_sword',left:'',torch:false}});
assert.ok(peer.gear.get('right').native);
assert.equal(peer.gear.get('right').visual.children[0].geometry,forgeMesh,'clonar espada forjada nativa');
assert.equal(forged.visible,false,'não alterar arma original');
const nativeShield=new THREE.Group();
const shieldPlate=new THREE.Mesh(new THREE.BoxGeometry(.5,.7,.08),new THREE.MeshStandardMaterial());
nativeShield.add(shieldPlate);
globals.window.gameShield={object:nativeShield};
api.pose(peer,{pose:newPose,equipment:{right:'forged_silver_sword',left:'wood_shield',torch:false}});
assert.equal(peer.gear.get('left').visual.children[0].geometry,shieldPlate.geometry);
assert.equal(api.diagnostic().sources.includes('torch'),true);
// Prime idle game-native templates without rendering any replacement shapes.
const realHammer=new THREE.Group();
const realHammerGeometry=new THREE.BoxGeometry(.2,.25,.18);
realHammer.add(new THREE.Mesh(realHammerGeometry,new THREE.MeshStandardMaterial()));
const hand=globals.window.gameRightHand;
hand.current='axe';hand.object=rightHand;
hand.equip=function(id){
 if(!['axe','hammer'].includes(id))return false;
 this.current=id;this.object=id==='hammer'?realHammer:rightHand;return true;
};
hand.unequip=function(){this.current=null;return true};
globals.window.gameInventory={isOpen:false,items:[{id:'axe',quantity:1},{id:'hammer',quantity:1}]};
gameReview.player={x:0,z:0};
globals.window.FlorestaOnline={connected:true};
globals.performance={now:()=>10000};
const initial=hand.current;
api.primeNativeEquipment();
assert.equal(hand.current,initial,'priming deve restaurar o item equipado local');
assert.ok(api.diagnostic().sources.includes('hammer'),'capturar martelo original sem construir geometria inventada');
api.pose(peer,{pose:newPose,equipment:{right:'hammer',left:'',torch:false}});
assert.equal(peer.gear.get('right').visual.children[0].geometry,realHammerGeometry,
 'martelo remoto usa a malha REAL capturada pelo sistema original');
assert.equal(api.dispose(peer),true);
assert.equal(peer.root,null);
assert.equal(mesh.geometry.isBufferGeometry,true,'descarregar avatar remoto não pode destruir corpo original');
console.log('AVATAR NATIVO: clone Mixamo independente, pose, cabelo, arma e limpeza OK.');
