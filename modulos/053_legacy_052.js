

(function(Z){
Z.profiles={
 original:{id:'original',label:'V53 · Revisado',subtitle:'Modelo original · pele e animações revisadas',height:1.76,skin:0x827c66,cloth:0x272b25,speed:1},
 female:{id:'female',label:'A Enlutada',subtitle:'Mulher central · vestido e cardigan',height:1.90,hipY:1.00,torso:.46,neck:.08,head:.245,shoulder:.185,waist:.126,hips:.178,upper:.30,lower:.29,palm:.085,leg:.47,calf:.45,headW:.081,headD:.09,mouth:.034,jaw:.027,skin:0xaaa48f,cloth:0x211e20,coat:0x3b2c29,pants:0x1c2022,hair:'long',lean:.12,tilt:-.035,speed:.73,attack:'bite'},
 heavy:{id:'heavy',label:'O Voraz',subtitle:'Homem alto · mandíbula exposta',height:1.99,hipY:1.03,torso:.49,neck:.08,head:.255,shoulder:.244,waist:.173,hips:.19,upper:.33,lower:.30,palm:.09,leg:.49,calf:.45,headW:.10,headD:.10,mouth:.031,jaw:.020,skin:0x8b8771,cloth:0x1c2425,coat:0x252c2b,pants:0x232522,hair:'patch',lean:.24,tilt:.03,speed:1.07,attack:'slam'},
 thin:{id:'thin',label:'O Arrastado',subtitle:'Homem do fundo · lento e consumido',height:1.72,hipY:.94,torso:.39,neck:.073,head:.22,shoulder:.162,waist:.109,hips:.135,upper:.30,lower:.285,palm:.076,leg:.435,calf:.415,headW:.072,headD:.080,mouth:.014,jaw:.015,skin:0x8e9178,cloth:0x3c342d,coat:0x3c342d,pants:0x252e30,hair:'sparse',lean:.31,tilt:-.095,speed:.55,attack:'reach'},
 twisted:{id:'twisted',label:'O Desalinhado',subtitle:'Homem da direita · marcha assimétrica',height:1.81,hipY:.97,torso:.43,neck:.085,head:.23,shoulder:.19,waist:.139,hips:.158,upper:.31,lower:.28,palm:.084,leg:.45,calf:.43,headW:.080,headD:.086,mouth:.028,jaw:.021,skin:0x9e9b83,cloth:0x20262a,coat:0x20262a,pants:0x645344,hair:'short',lean:.17,tilt:.19,speed:.87,attack:'hook'}
};
Z.map={Pelvis:'mixamorigHips',Spine:'mixamorigSpine',Chest:'mixamorigSpine2',Neck:'mixamorigNeck',Head:'mixamorigHead'};
for(const [s,word] of [['L','Left'],['R','Right']]){for(const [a,b] of [['Clavicle','Shoulder'],['UpperArm','Arm'],['Forearm','ForeArm'],['Hand','Hand'],['Thigh','UpLeg'],['Calf','Leg'],['Foot','Foot'],['Toe','ToeBase']])Z.map[a+'_'+s]='mixamorig'+word+b;for(const f of ['Thumb','Index','Middle','Ring','Pinky'])for(let j=1;j<=3;j++)Z.map[f+'_'+s+'_'+j]='mixamorig'+word+'Hand'+f+j;}
})(window.ZOMBIES=window.ZOMBIES||{});


