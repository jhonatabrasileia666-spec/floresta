
window.addEventListener('keydown',function(e){
 if(e.repeat||e.ctrlKey||e.altKey||e.metaKey)return;
 if(e.code!=='KeyZ'&&String(e.key||'').toLowerCase()!=='z')return;
 if(e.target?.isContentEditable||/INPUT|TEXTAREA|SELECT/.test(e.target?.tagName||''))return;
 if(!window.gameHackMode)return;
 e.preventDefault();e.stopImmediatePropagation();window.gameHackMode.toggle();
},true);
