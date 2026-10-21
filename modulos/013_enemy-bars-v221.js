/* UI nativa V221: moldura temática, preenchimento de vida real, sem retratos. */
window.EnemyBars221=(()=>{
 const themes=[
  {id:'zombie',rx:/zumbi/i,name:'Zumbi',color:'#789b50',light:'#bbca7a',dark:'#263322',motif:'vine'},
  {id:'eye',rx:/olho/i,name:'Olho Voador',color:'#b84e78',light:'#f5a6ba',dark:'#3a182d',motif:'eye'},
  {id:'orc',rx:/orc/i,name:'Orc Arqueiro',color:'#7f8b44',light:'#c3b676',dark:'#29301c',motif:'arrow'},
  {id:'mushroom',rx:/cogumelo/i,name:'Cogumelo Hostil',color:'#bd7935',light:'#f6c36d',dark:'#38251e',motif:'spore'},
  {id:'barrel',rx:/barril|lenhador/i,name:'Lenhador de Barril',color:'#a46f3d',light:'#e1b576',dark:'#33251b',motif:'wood'},
  {id:'skeleton',rx:/esqueleto guerreiro/i,name:'Esqueleto Guerreiro',color:'#a59c79',light:'#ede1b5',dark:'#32312c',motif:'bone'},
  {id:'centaur',rx:/centauro/i,name:'Centauro Esqueleto',color:'#968e76',light:'#dbd4ae',dark:'#2e2e28',motif:'bone'},
  {id:'fire-centaur',rx:/centauro.*fogo|fogo.*centauro/i,name:'Centauro Esqueleto de Fogo',color:'#be5428',light:'#ffc46b',dark:'#40231b',motif:'fire'},
  {id:'necromancer',rx:/necromante/i,name:'Necromante',color:'#5d9e8b',light:'#a8e2b5',dark:'#1c302d',motif:'rune'},
  {id:'nocturne',rx:/nocturne|noturno/i,name:'Nocturne',color:'#7960b0',light:'#c4a4ec',dark:'#261e38',motif:'wing'},
  {id:'werewolf',rx:/lobisomem/i,name:'Lobisomem',color:'#9c4652',light:'#db9b9b',dark:'#321f26',motif:'fang'},
  {id:'demon',rx:/trolloc|dem[oô]nio/i,name:'Demônio Trolloc',color:'#a73d32',light:'#ed9364',dark:'#3c1c1d',motif:'horn'},
  {id:'ignis',rx:/ignis/i,name:'Ignis, O Intocado',color:'#d85d26',light:'#ffd185',dark:'#45251c',motif:'fire'},
  {id:'giant',rx:/gigante/i,name:'Gigante da Névoa',color:'#7c969b',light:'#c3d4cd',dark:'#293339',motif:'stone'},
  {id:'martial',rx:/mestre marcial|lutador/i,name:'Mestre Marcial',color:'#ae8144',light:'#f0d395',dark:'#392c25',motif:'rune'}
 ];
 function theme(name){const n=String(name||'');return themes.find(t=>t.id==='fire-centaur'&&t.rx.test(n))||themes.find(t=>t.rx.test(n))||themes[0]}
 function polygon(c,points,fill,stroke){c.beginPath();points.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.closePath();if(fill){c.fillStyle=fill;c.fill()}if(stroke){c.strokeStyle=stroke;c.stroke()}}
 function emblem(c,t,x,y,s=1){
  c.save();c.translate(x,y);c.scale(s,s);c.lineWidth=2;c.strokeStyle=t.light;c.fillStyle=t.dark;
  const line=pts=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));c.stroke()};
  switch(t.motif){
   case 'eye':c.beginPath();c.ellipse(0,0,13,7,0,0,Math.PI*2);c.fill();c.stroke();c.fillStyle=t.light;c.beginPath();c.ellipse(0,0,3,5,0,0,Math.PI*2);c.fill();break;
   case 'bone':line([[-8,-11],[8,11]]);line([[8,-11],[-8,11]]);for(const [a,b]of [[-9,-12],[9,12],[9,-12],[-9,12]]){c.beginPath();c.arc(a,b,3,0,7);c.fill();c.stroke()}break;
   case 'fire':polygon(c,[[0,-18],[-5,-4],[-10,-8],[-12,6],[-5,14],[6,13],[12,4],[6,-10],[4,1]],t.dark,t.light);line([[0,11],[-3,4],[2,-2],[5,6]]);break;
   case 'stone':polygon(c,[[-12,-10],[1,-16],[12,-6],[11,10],[-3,16],[-13,6]],t.dark,t.light);line([[-2,-14],[2,-4],[-4,2],[4,7],[1,14]]);break;
   case 'fang':case 'horn':line([[-13,-14],[-9,3],[-3,12],[0,4],[3,12],[9,3],[13,-14]]);line([[-8,-7],[-4,2]]);line([[8,-7],[4,2]]);break;
   case 'wing':line([[-1,13],[-4,0],[-15,-11],[-10,-2],[-14,4],[-6,7],[0,15],[6,7],[14,4],[10,-2],[15,-11],[4,0],[1,13]]);break;
   case 'arrow':line([[0,15],[0,-14],[-7,-6],[0,-14],[7,-6]]);line([[-6,5],[0,10],[6,5]]);break;
   case 'spore':c.beginPath();c.arc(0,0,13,Math.PI,Math.PI*2);c.lineTo(-13,0);c.fill();c.stroke();line([[-3,1],[-3,13],[3,13],[3,1]]);break;
   case 'wood':polygon(c,[[-10,-13],[10,-13],[12,11],[-11,13]],t.dark,t.light);line([[-5,-10],[-3,9]]);line([[4,-10],[2,10]]);line([[-11,-4],[11,-4]]);break;
   case 'vine':line([[-5,14],[1,5],[-2,-5],[5,-14]]);polygon(c,[[0,3],[-11,0],[-9,-7]],t.color);polygon(c,[[0,-3],[11,-8],[10,1]],t.color);break;
   default:polygon(c,[[0,-15],[9,0],[0,15],[-9,0]],t.dark,t.light);line([[-9,0],[9,0]]);line([[0,-7],[0,7]]);
  }c.restore();
 }
 function draw(canvas,name,hp,maxHp,compact=false){
  const c=canvas.getContext('2d'),t=theme(name),max=Math.max(1,Number(maxHp)||1),value=Math.max(0,Math.min(max,Number(hp)||0)),ratio=value/max;
  c.clearRect(0,0,canvas.width,canvas.height);c.save();c.scale(canvas.width/640,canvas.height/128);
  c.textAlign='center';c.textBaseline='middle';c.font='600 '+(compact?34:23)+'px Georgia,serif';c.shadowColor='#000';c.shadowBlur=4;c.fillStyle='#f0e8d6';c.fillText(String(name||t.name),320,23,540);c.shadowBlur=0;
  c.lineWidth=2;polygon(c,[[31,48],[45,42],[595,42],[609,48],[609,82],[595,88],[45,88],[31,82]],'#0d1110ed',t.color);
  c.strokeStyle=t.light;c.globalAlpha=.45;c.beginPath();c.moveTo(48,46);c.lineTo(592,46);c.stroke();c.globalAlpha=1;
  const x=46,y=53,w=548,h=24;c.fillStyle='#080b0a';c.fillRect(x,y,w,h);
  if(ratio>0){const grad=c.createLinearGradient(x,0,x+w,0);grad.addColorStop(0,t.color);grad.addColorStop(1,t.light);c.fillStyle=grad;c.fillRect(x,y,w*ratio,h);c.fillStyle='#fff3';c.fillRect(x,y,w*ratio,3);c.fillStyle='#0003';c.fillRect(x,y+h-4,w*ratio,4)}
  c.fillStyle='#090c0d66';for(let i=1;i<4;i++)c.fillRect(x+w*i/4-1,y,2,h);
  c.strokeStyle='#ffffff1a';c.lineWidth=1;c.strokeRect(x-.5,y-.5,w+1,h+1);
  emblem(c,t,19,65,.85);emblem(c,t,621,65,.85);
  c.fillStyle='#e0dccf';c.font='500 '+(compact?24:17)+'px system-ui,sans-serif';c.fillText(Math.ceil(value)+' / '+Math.ceil(max),320,108);
  c.restore();return {theme:t,ratio,hp:value,maxHp:max,track:{x:46/640,y:53/128,width:548/640,height:24/128}};
 }
 return {version:'V221',themes,theme,draw,emblem};
})();
