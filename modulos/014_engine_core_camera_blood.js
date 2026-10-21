
(async()=>{
try{
var JD=0,xr=1,VD=2;var Or=1,Gi=2,Me=3,re=0,HP=1,ZP=2,Se=0,Et=1,un=2,Lr=3,Ir=4,qD=5,et=100,KD=101,_D=102,$D=103,A9=104,P9=200,e9=201,t9=202,n9=203,wi=204,ji=205,s9=206,i9=207,v9=208,r9=209,o9=210,D9=211,z9=212,c9=213,a9=214,Ci=0,Fi=1,Ni=2,lt=3,Xi=4,Zi=5,Ri=6,Wi=7,kr=0,g9=1,T9=2,Ue=0,B9=1,f9=2,w9=3,Si=4,j9=5,E9=6,l9=7,lr="attached",h9="detached",Hr=300,yt=301,xt=302,Ui=303,Ji=304,Ys=306,tt=1e3,Be=1001,on=1002,MP=1003,Vi=1004;var Ot=1005;var IP=1006,mn=1007;var ze=1008;var ce=1009,Gr=1010,Cr=1011,Mn=1012,qi=1013,rt=1014,Ae=1015,Qn=1016,Ki=1017,_i=1018,dn=1020,Fr=35902,Nr=35899,Xr=1021,Zr=1022,qP=1023,Dn=1026,bn=1027,$i=1028,Av=1029,Rr=1030,Pv=1031;var ev=1033,ps=33776,ys=33777,xs=33778,Os=33779,tv=35840,nv=35841,sv=35842,iv=35843,vv=36196,rv=37492,ov=37496,Dv=37808,zv=37809,cv=37810,av=37811,gv=37812,Tv=37813,Bv=37814,fv=37815,wv=37816,jv=37817,Ev=37818,lv=37819,hv=37820,uv=37821,mv=36492,Mv=36494,Qv=36495,dv=36283,bv=36284,Yv=36285,pv=36286;var ht=2300,ut=2301,fi=2302,hr=2400,ur=2401,mr=2402,u9=2500;var Wr=0,Ls=1,Yn=2,m9=3200,M9=3201;var Sr=0,Q9=1,Je="",cP="srgb",QP="srgb-linear",As="linear",qA="srgb";var jt=7680;var Mr=519,d9=512,b9=513,Y9=514,Ur=515,p9=516,y9=517,x9=518,O9=519,Ei=35044;var Jr="300 es",ie=2e3,Ps=2001;var Ne=class{addEventListener(A,P){this._listeners===void 0&&(this._listeners={});let e=this._listeners;e[A]===void 0&&(e[A]=[]),e[A].indexOf(P)===-1&&e[A].push(P)}hasEventListener(A,P){let e=this._listeners;return e===void 0?!1:e[A]!==void 0&&e[A].indexOf(P)!==-1}removeEventListener(A,P){let e=this._listeners;if(e===void 0)return;let t=e[A];if(t!==void 0){let s=t.indexOf(P);s!==-1&&t.splice(s,1)}}dispatchEvent(A){let P=this._listeners;if(P===void 0)return;let e=P[A.type];if(e!==void 0){A.target=this;let t=e.slice(0);for(let s=0,i=t.length;s<i;s++)t[s].call(this,A);A.target=null}}},bP=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],DD=1234567,_n=Math.PI/180,mt=180/Math.PI;function ve(){let n=Math.random()*4294967295|0,A=Math.random()*4294967295|0,P=Math.random()*4294967295|0,e=Math.random()*4294967295|0;return(bP[n&255]+bP[n>>8&255]+bP[n>>16&255]+bP[n>>24&255]+"-"+bP[A&255]+bP[A>>8&255]+"-"+bP[A>>16&15|64]+bP[A>>24&255]+"-"+bP[P&63|128]+bP[P>>8&255]+"-"+bP[P>>16&255]+bP[P>>24&255]+bP[e&255]+bP[e>>8&255]+bP[e>>16&255]+bP[e>>24&255]).toLowerCase()}function FA(n,A,P){return Math.max(A,Math.min(P,n))}function Vr(n,A){return(n%A+A)%A}function N8(n,A,P,e,t){return e+(n-A)*(t-e)/(P-A)}function X8(n,A,P){return n!==A?(P-n)/(A-n):0}function $n(n,A,P){return(1-P)*n+P*A}function Z8(n,A,P,e){return $n(n,A,1-Math.exp(-P*e))}function R8(n,A=1){return A-Math.abs(Vr(n,A*2)-A)}function W8(n,A,P){return n<=A?0:n>=P?1:(n=(n-A)/(P-A),n*n*(3-2*n))}function S8(n,A,P){return n<=A?0:n>=P?1:(n=(n-A)/(P-A),n*n*n*(n*(n*6-15)+10))}function U8(n,A){return n+Math.floor(Math.random()*(A-n+1))}function J8(n,A){return n+Math.random()*(A-n)}function V8(n){return n*(.5-Math.random())}function q8(n){n!==void 0&&(DD=n);let A=DD+=1831565813;return A=Math.imul(A^A>>>15,A|1),A^=A+Math.imul(A^A>>>7,A|61),((A^A>>>14)>>>0)/4294967296}function K8(n){return n*_n}function _8(n){return n*mt}function $8(n){return(n&n-1)===0&&n!==0}function Az(n){return Math.pow(2,Math.ceil(Math.log(n)/Math.LN2))}function Pz(n){return Math.pow(2,Math.floor(Math.log(n)/Math.LN2))}function ez(n,A,P,e,t){let s=Math.cos,i=Math.sin,v=s(P/2),o=i(P/2),r=s((A+e)/2),D=i((A+e)/2),z=s((A-e)/2),c=i((A-e)/2),g=s((e-A)/2),B=i((e-A)/2);switch(t){case"XYX":n.set(v*D,o*z,o*c,v*r);break;case"YZY":n.set(o*c,v*D,o*z,v*r);break;case"ZXZ":n.set(o*z,o*c,v*D,v*r);break;case"XZX":n.set(v*D,o*B,o*g,v*r);break;case"YXY":n.set(o*g,v*D,o*B,v*r);break;case"ZYZ":n.set(o*B,o*g,v*D,v*r);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+t)}}function se(n,A){switch(A.constructor){case Float32Array:return n;case Uint32Array:return n/4294967295;case Uint16Array:return n/65535;case Uint8Array:return n/255;case Int32Array:return Math.max(n/2147483647,-1);case Int16Array:return Math.max(n/32767,-1);case Int8Array:return Math.max(n/127,-1);default:throw new Error("Invalid component type.")}}function VA(n,A){switch(A.constructor){case Float32Array:return n;case Uint32Array:return Math.round(n*4294967295);case Uint16Array:return Math.round(n*65535);case Uint8Array:return Math.round(n*255);case Int32Array:return Math.round(n*2147483647);case Int16Array:return Math.round(n*32767);case Int8Array:return Math.round(n*127);default:throw new Error("Invalid component type.")}}var qr={DEG2RAD:_n,RAD2DEG:mt,generateUUID:ve,clamp:FA,euclideanModulo:Vr,mapLinear:N8,inverseLerp:X8,lerp:$n,damp:Z8,pingpong:R8,smoothstep:W8,smootherstep:S8,randInt:U8,randFloat:J8,randFloatSpread:V8,seededRandom:q8,degToRad:K8,radToDeg:_8,isPowerOfTwo:$8,ceilPowerOfTwo:Az,floorPowerOfTwo:Pz,setQuaternionFromProperEuler:ez,normalize:VA,denormalize:se},bA=class n{constructor(A=0,P=0){n.prototype.isVector2=!0,this.x=A,this.y=P}get width(){return this.x}set width(A){this.x=A}get height(){return this.y}set height(A){this.y=A}set(A,P){return this.x=A,this.y=P,this}setScalar(A){return this.x=A,this.y=A,this}setX(A){return this.x=A,this}setY(A){return this.y=A,this}setComponent(A,P){switch(A){case 0:this.x=P;break;case 1:this.y=P;break;default:throw new Error("index is out of range: "+A)}return this}getComponent(A){switch(A){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+A)}}clone(){return new this.constructor(this.x,this.y)}copy(A){return this.x=A.x,this.y=A.y,this}add(A){return this.x+=A.x,this.y+=A.y,this}addScalar(A){return this.x+=A,this.y+=A,this}addVectors(A,P){return this.x=A.x+P.x,this.y=A.y+P.y,this}addScaledVector(A,P){return this.x+=A.x*P,this.y+=A.y*P,this}sub(A){return this.x-=A.x,this.y-=A.y,this}subScalar(A){return this.x-=A,this.y-=A,this}subVectors(A,P){return this.x=A.x-P.x,this.y=A.y-P.y,this}multiply(A){return this.x*=A.x,this.y*=A.y,this}multiplyScalar(A){return this.x*=A,this.y*=A,this}divide(A){return this.x/=A.x,this.y/=A.y,this}divideScalar(A){return this.multiplyScalar(1/A)}applyMatrix3(A){let P=this.x,e=this.y,t=A.elements;return this.x=t[0]*P+t[3]*e+t[6],this.y=t[1]*P+t[4]*e+t[7],this}min(A){return this.x=Math.min(this.x,A.x),this.y=Math.min(this.y,A.y),this}max(A){return this.x=Math.max(this.x,A.x),this.y=Math.max(this.y,A.y),this}clamp(A,P){return this.x=FA(this.x,A.x,P.x),this.y=FA(this.y,A.y,P.y),this}clampScalar(A,P){return this.x=FA(this.x,A,P),this.y=FA(this.y,A,P),this}clampLength(A,P){let e=this.length();return this.divideScalar(e||1).multiplyScalar(FA(e,A,P))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(A){return this.x*A.x+this.y*A.y}cross(A){return this.x*A.y-this.y*A.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(A){let P=Math.sqrt(this.lengthSq()*A.lengthSq());if(P===0)return Math.PI/2;let e=this.dot(A)/P;return Math.acos(FA(e,-1,1))}distanceTo(A){return Math.sqrt(this.distanceToSquared(A))}distanceToSquared(A){let P=this.x-A.x,e=this.y-A.y;return P*P+e*e}manhattanDistanceTo(A){return Math.abs(this.x-A.x)+Math.abs(this.y-A.y)}setLength(A){return this.normalize().multiplyScalar(A)}lerp(A,P){return this.x+=(A.x-this.x)*P,this.y+=(A.y-this.y)*P,this}lerpVectors(A,P,e){return this.x=A.x+(P.x-A.x)*e,this.y=A.y+(P.y-A.y)*e,this}equals(A){return A.x===this.x&&A.y===this.y}fromArray(A,P=0){return this.x=A[P],this.y=A[P+1],this}toArray(A=[],P=0){return A[P]=this.x,A[P+1]=this.y,A}fromBufferAttribute(A,P){return this.x=A.getX(P),this.y=A.getY(P),this}rotateAround(A,P){let e=Math.cos(P),t=Math.sin(P),s=this.x-A.x,i=this.y-A.y;return this.x=s*e-i*t+A.x,this.y=s*t+i*e+A.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},CP=class{constructor(A=0,P=0,e=0,t=1){this.isQuaternion=!0,this._x=A,this._y=P,this._z=e,this._w=t}static slerpFlat(A,P,e,t,s,i,v){let o=e[t+0],r=e[t+1],D=e[t+2],z=e[t+3],c=s[i+0],g=s[i+1],B=s[i+2],f=s[i+3];if(v===0){A[P+0]=o,A[P+1]=r,A[P+2]=D,A[P+3]=z;return}if(v===1){A[P+0]=c,A[P+1]=g,A[P+2]=B,A[P+3]=f;return}if(z!==f||o!==c||r!==g||D!==B){let T=1-v,a=o*c+r*g+D*B+z*f,m=a>=0?1:-1,u=1-a*a;if(u>Number.EPSILON){let d=Math.sqrt(u),Q=Math.atan2(d,a*m);T=Math.sin(T*Q)/d,v=Math.sin(v*Q)/d}let j=v*m;if(o=o*T+c*j,r=r*T+g*j,D=D*T+B*j,z=z*T+f*j,T===1-v){let d=1/Math.sqrt(o*o+r*r+D*D+z*z);o*=d,r*=d,D*=d,z*=d}}A[P]=o,A[P+1]=r,A[P+2]=D,A[P+3]=z}static multiplyQuaternionsFlat(A,P,e,t,s,i){let v=e[t],o=e[t+1],r=e[t+2],D=e[t+3],z=s[i],c=s[i+1],g=s[i+2],B=s[i+3];return A[P]=v*B+D*z+o*g-r*c,A[P+1]=o*B+D*c+r*z-v*g,A[P+2]=r*B+D*g+v*c-o*z,A[P+3]=D*B-v*z-o*c-r*g,A}get x(){return this._x}set x(A){this._x=A,this._onChangeCallback()}get y(){return this._y}set y(A){this._y=A,this._onChangeCallback()}get z(){return this._z}set z(A){this._z=A,this._onChangeCallback()}get w(){return this._w}set w(A){this._w=A,this._onChangeCallback()}set(A,P,e,t){return this._x=A,this._y=P,this._z=e,this._w=t,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(A){return this._x=A.x,this._y=A.y,this._z=A.z,this._w=A.w,this._onChangeCallback(),this}setFromEuler(A,P=!0){let e=A._x,t=A._y,s=A._z,i=A._order,v=Math.cos,o=Math.sin,r=v(e/2),D=v(t/2),z=v(s/2),c=o(e/2),g=o(t/2),B=o(s/2);switch(i){case"XYZ":this._x=c*D*z+r*g*B,this._y=r*g*z-c*D*B,this._z=r*D*B+c*g*z,this._w=r*D*z-c*g*B;break;case"YXZ":this._x=c*D*z+r*g*B,this._y=r*g*z-c*D*B,this._z=r*D*B-c*g*z,this._w=r*D*z+c*g*B;break;case"ZXY":this._x=c*D*z-r*g*B,this._y=r*g*z+c*D*B,this._z=r*D*B+c*g*z,this._w=r*D*z-c*g*B;break;case"ZYX":this._x=c*D*z-r*g*B,this._y=r*g*z+c*D*B,this._z=r*D*B-c*g*z,this._w=r*D*z+c*g*B;break;case"YZX":this._x=c*D*z+r*g*B,this._y=r*g*z+c*D*B,this._z=r*D*B-c*g*z,this._w=r*D*z-c*g*B;break;case"XZY":this._x=c*D*z-r*g*B,this._y=r*g*z-c*D*B,this._z=r*D*B+c*g*z,this._w=r*D*z+c*g*B;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+i)}return P===!0&&this._onChangeCallback(),this}setFromAxisAngle(A,P){let e=P/2,t=Math.sin(e);return this._x=A.x*t,this._y=A.y*t,this._z=A.z*t,this._w=Math.cos(e),this._onChangeCallback(),this}setFromRotationMatrix(A){let P=A.elements,e=P[0],t=P[4],s=P[8],i=P[1],v=P[5],o=P[9],r=P[2],D=P[6],z=P[10],c=e+v+z;if(c>0){let g=.5/Math.sqrt(c+1);this._w=.25/g,this._x=(D-o)*g,this._y=(s-r)*g,this._z=(i-t)*g}else if(e>v&&e>z){let g=2*Math.sqrt(1+e-v-z);this._w=(D-o)/g,this._x=.25*g,this._y=(t+i)/g,this._z=(s+r)/g}else if(v>z){let g=2*Math.sqrt(1+v-e-z);this._w=(s-r)/g,this._x=(t+i)/g,this._y=.25*g,this._z=(o+D)/g}else{let g=2*Math.sqrt(1+z-e-v);this._w=(i-t)/g,this._x=(s+r)/g,this._y=(o+D)/g,this._z=.25*g}return this._onChangeCallback(),this}setFromUnitVectors(A,P){let e=A.dot(P)+1;return e<1e-8?(e=0,Math.abs(A.x)>Math.abs(A.z)?(this._x=-A.y,this._y=A.x,this._z=0,this._w=e):(this._x=0,this._y=-A.z,this._z=A.y,this._w=e)):(this._x=A.y*P.z-A.z*P.y,this._y=A.z*P.x-A.x*P.z,this._z=A.x*P.y-A.y*P.x,this._w=e),this.normalize()}angleTo(A){return 2*Math.acos(Math.abs(FA(this.dot(A),-1,1)))}rotateTowards(A,P){let e=this.angleTo(A);if(e===0)return this;let t=Math.min(1,P/e);return this.slerp(A,t),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(A){return this._x*A._x+this._y*A._y+this._z*A._z+this._w*A._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let A=this.length();return A===0?(this._x=0,this._y=0,this._z=0,this._w=1):(A=1/A,this._x=this._x*A,this._y=this._y*A,this._z=this._z*A,this._w=this._w*A),this._onChangeCallback(),this}multiply(A){return this.multiplyQuaternions(this,A)}premultiply(A){return this.multiplyQuaternions(A,this)}multiplyQuaternions(A,P){let e=A._x,t=A._y,s=A._z,i=A._w,v=P._x,o=P._y,r=P._z,D=P._w;return this._x=e*D+i*v+t*r-s*o,this._y=t*D+i*o+s*v-e*r,this._z=s*D+i*r+e*o-t*v,this._w=i*D-e*v-t*o-s*r,this._onChangeCallback(),this}slerp(A,P){if(P===0)return this;if(P===1)return this.copy(A);let e=this._x,t=this._y,s=this._z,i=this._w,v=i*A._w+e*A._x+t*A._y+s*A._z;if(v<0?(this._w=-A._w,this._x=-A._x,this._y=-A._y,this._z=-A._z,v=-v):this.copy(A),v>=1)return this._w=i,this._x=e,this._y=t,this._z=s,this;let o=1-v*v;if(o<=Number.EPSILON){let g=1-P;return this._w=g*i+P*this._w,this._x=g*e+P*this._x,this._y=g*t+P*this._y,this._z=g*s+P*this._z,this.normalize(),this}let r=Math.sqrt(o),D=Math.atan2(r,v),z=Math.sin((1-P)*D)/r,c=Math.sin(P*D)/r;return this._w=i*z+this._w*c,this._x=e*z+this._x*c,this._y=t*z+this._y*c,this._z=s*z+this._z*c,this._onChangeCallback(),this}slerpQuaternions(A,P,e){return this.copy(A).slerp(P,e)}random(){let A=2*Math.PI*Math.random(),P=2*Math.PI*Math.random(),e=Math.random(),t=Math.sqrt(1-e),s=Math.sqrt(e);return this.set(t*Math.sin(A),t*Math.cos(A),s*Math.sin(P),s*Math.cos(P))}equals(A){return A._x===this._x&&A._y===this._y&&A._z===this._z&&A._w===this._w}fromArray(A,P=0){return this._x=A[P],this._y=A[P+1],this._z=A[P+2],this._w=A[P+3],this._onChangeCallback(),this}toArray(A=[],P=0){return A[P]=this._x,A[P+1]=this._y,A[P+2]=this._z,A[P+3]=this._w,A}fromBufferAttribute(A,P){return this._x=A.getX(P),this._y=A.getY(P),this._z=A.getZ(P),this._w=A.getW(P),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(A){return this._onChangeCallback=A,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},y=class n{constructor(A=0,P=0,e=0){n.prototype.isVector3=!0,this.x=A,this.y=P,this.z=e}set(A,P,e){return e===void 0&&(e=this.z),this.x=A,this.y=P,this.z=e,this}setScalar(A){return this.x=A,this.y=A,this.z=A,this}setX(A){return this.x=A,this}setY(A){return this.y=A,this}setZ(A){return this.z=A,this}setComponent(A,P){switch(A){case 0:this.x=P;break;case 1:this.y=P;break;case 2:this.z=P;break;default:throw new Error("index is out of range: "+A)}return this}getComponent(A){switch(A){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+A)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(A){return this.x=A.x,this.y=A.y,this.z=A.z,this}add(A){return this.x+=A.x,this.y+=A.y,this.z+=A.z,this}addScalar(A){return this.x+=A,this.y+=A,this.z+=A,this}addVectors(A,P){return this.x=A.x+P.x,this.y=A.y+P.y,this.z=A.z+P.z,this}addScaledVector(A,P){return this.x+=A.x*P,this.y+=A.y*P,this.z+=A.z*P,this}sub(A){return this.x-=A.x,this.y-=A.y,this.z-=A.z,this}subScalar(A){return this.x-=A,this.y-=A,this.z-=A,this}subVectors(A,P){return this.x=A.x-P.x,this.y=A.y-P.y,this.z=A.z-P.z,this}multiply(A){return this.x*=A.x,this.y*=A.y,this.z*=A.z,this}multiplyScalar(A){return this.x*=A,this.y*=A,this.z*=A,this}multiplyVectors(A,P){return this.x=A.x*P.x,this.y=A.y*P.y,this.z=A.z*P.z,this}applyEuler(A){return this.applyQuaternion(zD.setFromEuler(A))}applyAxisAngle(A,P){return this.applyQuaternion(zD.setFromAxisAngle(A,P))}applyMatrix3(A){let P=this.x,e=this.y,t=this.z,s=A.elements;return this.x=s[0]*P+s[3]*e+s[6]*t,this.y=s[1]*P+s[4]*e+s[7]*t,this.z=s[2]*P+s[5]*e+s[8]*t,this}applyNormalMatrix(A){return this.applyMatrix3(A).normalize()}applyMatrix4(A){let P=this.x,e=this.y,t=this.z,s=A.elements,i=1/(s[3]*P+s[7]*e+s[11]*t+s[15]);return this.x=(s[0]*P+s[4]*e+s[8]*t+s[12])*i,this.y=(s[1]*P+s[5]*e+s[9]*t+s[13])*i,this.z=(s[2]*P+s[6]*e+s[10]*t+s[14])*i,this}applyQuaternion(A){let P=this.x,e=this.y,t=this.z,s=A.x,i=A.y,v=A.z,o=A.w,r=2*(i*t-v*e),D=2*(v*P-s*t),z=2*(s*e-i*P);return this.x=P+o*r+i*z-v*D,this.y=e+o*D+v*r-s*z,this.z=t+o*z+s*D-i*r,this}project(A){return this.applyMatrix4(A.matrixWorldInverse).applyMatrix4(A.projectionMatrix)}unproject(A){return this.applyMatrix4(A.projectionMatrixInverse).applyMatrix4(A.matrixWorld)}transformDirection(A){let P=this.x,e=this.y,t=this.z,s=A.elements;return this.x=s[0]*P+s[4]*e+s[8]*t,this.y=s[1]*P+s[5]*e+s[9]*t,this.z=s[2]*P+s[6]*e+s[10]*t,this.normalize()}divide(A){return this.x/=A.x,this.y/=A.y,this.z/=A.z,this}divideScalar(A){return this.multiplyScalar(1/A)}min(A){return this.x=Math.min(this.x,A.x),this.y=Math.min(this.y,A.y),this.z=Math.min(this.z,A.z),this}max(A){return this.x=Math.max(this.x,A.x),this.y=Math.max(this.y,A.y),this.z=Math.max(this.z,A.z),this}clamp(A,P){return this.x=FA(this.x,A.x,P.x),this.y=FA(this.y,A.y,P.y),this.z=FA(this.z,A.z,P.z),this}clampScalar(A,P){return this.x=FA(this.x,A,P),this.y=FA(this.y,A,P),this.z=FA(this.z,A,P),this}clampLength(A,P){let e=this.length();return this.divideScalar(e||1).multiplyScalar(FA(e,A,P))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(A){return this.x*A.x+this.y*A.y+this.z*A.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(A){return this.normalize().multiplyScalar(A)}lerp(A,P){return this.x+=(A.x-this.x)*P,this.y+=(A.y-this.y)*P,this.z+=(A.z-this.z)*P,this}lerpVectors(A,P,e){return this.x=A.x+(P.x-A.x)*e,this.y=A.y+(P.y-A.y)*e,this.z=A.z+(P.z-A.z)*e,this}cross(A){return this.crossVectors(this,A)}crossVectors(A,P){let e=A.x,t=A.y,s=A.z,i=P.x,v=P.y,o=P.z;return this.x=t*o-s*v,this.y=s*i-e*o,this.z=e*v-t*i,this}projectOnVector(A){let P=A.lengthSq();if(P===0)return this.set(0,0,0);let e=A.dot(this)/P;return this.copy(A).multiplyScalar(e)}projectOnPlane(A){return Uv.copy(this).projectOnVector(A),this.sub(Uv)}reflect(A){return this.sub(Uv.copy(A).multiplyScalar(2*this.dot(A)))}angleTo(A){let P=Math.sqrt(this.lengthSq()*A.lengthSq());if(P===0)return Math.PI/2;let e=this.dot(A)/P;return Math.acos(FA(e,-1,1))}distanceTo(A){return Math.sqrt(this.distanceToSquared(A))}distanceToSquared(A){let P=this.x-A.x,e=this.y-A.y,t=this.z-A.z;return P*P+e*e+t*t}manhattanDistanceTo(A){return Math.abs(this.x-A.x)+Math.abs(this.y-A.y)+Math.abs(this.z-A.z)}setFromSpherical(A){return this.setFromSphericalCoords(A.radius,A.phi,A.theta)}setFromSphericalCoords(A,P,e){let t=Math.sin(P)*A;return this.x=t*Math.sin(e),this.y=Math.cos(P)*A,this.z=t*Math.cos(e),this}setFromCylindrical(A){return this.setFromCylindricalCoords(A.radius,A.theta,A.y)}setFromCylindricalCoords(A,P,e){return this.x=A*Math.sin(P),this.y=e,this.z=A*Math.cos(P),this}setFromMatrixPosition(A){let P=A.elements;return this.x=P[12],this.y=P[13],this.z=P[14],this}setFromMatrixScale(A){let P=this.setFromMatrixColumn(A,0).length(),e=this.setFromMatrixColumn(A,1).length(),t=this.setFromMatrixColumn(A,2).length();return this.x=P,this.y=e,this.z=t,this}setFromMatrixColumn(A,P){return this.fromArray(A.elements,P*4)}setFromMatrix3Column(A,P){return this.fromArray(A.elements,P*3)}setFromEuler(A){return this.x=A._x,this.y=A._y,this.z=A._z,this}setFromColor(A){return this.x=A.r,this.y=A.g,this.z=A.b,this}equals(A){return A.x===this.x&&A.y===this.y&&A.z===this.z}fromArray(A,P=0){return this.x=A[P],this.y=A[P+1],this.z=A[P+2],this}toArray(A=[],P=0){return A[P]=this.x,A[P+1]=this.y,A[P+2]=this.z,A}fromBufferAttribute(A,P){return this.x=A.getX(P),this.y=A.getY(P),this.z=A.getZ(P),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let A=Math.random()*Math.PI*2,P=Math.random()*2-1,e=Math.sqrt(1-P*P);return this.x=e*Math.cos(A),this.y=P,this.z=e*Math.sin(A),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Uv=new y,zD=new CP,IA=class n{constructor(A,P,e,t,s,i,v,o,r){n.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],A!==void 0&&this.set(A,P,e,t,s,i,v,o,r)}set(A,P,e,t,s,i,v,o,r){let D=this.elements;return D[0]=A,D[1]=t,D[2]=v,D[3]=P,D[4]=s,D[5]=o,D[6]=e,D[7]=i,D[8]=r,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(A){let P=this.elements,e=A.elements;return P[0]=e[0],P[1]=e[1],P[2]=e[2],P[3]=e[3],P[4]=e[4],P[5]=e[5],P[6]=e[6],P[7]=e[7],P[8]=e[8],this}extractBasis(A,P,e){return A.setFromMatrix3Column(this,0),P.setFromMatrix3Column(this,1),e.setFromMatrix3Column(this,2),this}setFromMatrix4(A){let P=A.elements;return this.set(P[0],P[4],P[8],P[1],P[5],P[9],P[2],P[6],P[10]),this}multiply(A){return this.multiplyMatrices(this,A)}premultiply(A){return this.multiplyMatrices(A,this)}multiplyMatrices(A,P){let e=A.elements,t=P.elements,s=this.elements,i=e[0],v=e[3],o=e[6],r=e[1],D=e[4],z=e[7],c=e[2],g=e[5],B=e[8],f=t[0],T=t[3],a=t[6],m=t[1],u=t[4],j=t[7],d=t[2],Q=t[5],Y=t[8];return s[0]=i*f+v*m+o*d,s[3]=i*T+v*u+o*Q,s[6]=i*a+v*j+o*Y,s[1]=r*f+D*m+z*d,s[4]=r*T+D*u+z*Q,s[7]=r*a+D*j+z*Y,s[2]=c*f+g*m+B*d,s[5]=c*T+g*u+B*Q,s[8]=c*a+g*j+B*Y,this}multiplyScalar(A){let P=this.elements;return P[0]*=A,P[3]*=A,P[6]*=A,P[1]*=A,P[4]*=A,P[7]*=A,P[2]*=A,P[5]*=A,P[8]*=A,this}determinant(){let A=this.elements,P=A[0],e=A[1],t=A[2],s=A[3],i=A[4],v=A[5],o=A[6],r=A[7],D=A[8];return P*i*D-P*v*r-e*s*D+e*v*o+t*s*r-t*i*o}invert(){let A=this.elements,P=A[0],e=A[1],t=A[2],s=A[3],i=A[4],v=A[5],o=A[6],r=A[7],D=A[8],z=D*i-v*r,c=v*o-D*s,g=r*s-i*o,B=P*z+e*c+t*g;if(B===0)return this.set(0,0,0,0,0,0,0,0,0);let f=1/B;return A[0]=z*f,A[1]=(t*r-D*e)*f,A[2]=(v*e-t*i)*f,A[3]=c*f,A[4]=(D*P-t*o)*f,A[5]=(t*s-v*P)*f,A[6]=g*f,A[7]=(e*o-r*P)*f,A[8]=(i*P-e*s)*f,this}transpose(){let A,P=this.elements;return A=P[1],P[1]=P[3],P[3]=A,A=P[2],P[2]=P[6],P[6]=A,A=P[5],P[5]=P[7],P[7]=A,this}getNormalMatrix(A){return this.setFromMatrix4(A).invert().transpose()}transposeIntoArray(A){let P=this.elements;return A[0]=P[0],A[1]=P[3],A[2]=P[6],A[3]=P[1],A[4]=P[4],A[5]=P[7],A[6]=P[2],A[7]=P[5],A[8]=P[8],this}setUvTransform(A,P,e,t,s,i,v){let o=Math.cos(s),r=Math.sin(s);return this.set(e*o,e*r,-e*(o*i+r*v)+i+A,-t*r,t*o,-t*(-r*i+o*v)+v+P,0,0,1),this}scale(A,P){return this.premultiply(Jv.makeScale(A,P)),this}rotate(A){return this.premultiply(Jv.makeRotation(-A)),this}translate(A,P){return this.premultiply(Jv.makeTranslation(A,P)),this}makeTranslation(A,P){return A.isVector2?this.set(1,0,A.x,0,1,A.y,0,0,1):this.set(1,0,A,0,1,P,0,0,1),this}makeRotation(A){let P=Math.cos(A),e=Math.sin(A);return this.set(P,-e,0,e,P,0,0,0,1),this}makeScale(A,P){return this.set(A,0,0,0,P,0,0,0,1),this}equals(A){let P=this.elements,e=A.elements;for(let t=0;t<9;t++)if(P[t]!==e[t])return!1;return!0}fromArray(A,P=0){for(let e=0;e<9;e++)this.elements[e]=A[e+P];return this}toArray(A=[],P=0){let e=this.elements;return A[P]=e[0],A[P+1]=e[1],A[P+2]=e[2],A[P+3]=e[3],A[P+4]=e[4],A[P+5]=e[5],A[P+6]=e[6],A[P+7]=e[7],A[P+8]=e[8],A}clone(){return new this.constructor().fromArray(this.elements)}},Jv=new IA;function Kr(n){for(let A=n.length-1;A>=0;--A)if(n[A]>=65535)return!0;return!1}function zn(n){return document.createElementNS("http://www.w3.org/1999/xhtml",n)}function L9(){let n=zn("canvas");return n.style.display="block",n}var cD={};function cn(n){n in cD||(cD[n]=!0,console.warn(n))}function I9(n,A,P){return new Promise(function(e,t){function s(){switch(n.clientWaitSync(A,n.SYNC_FLUSH_COMMANDS_BIT,0)){case n.WAIT_FAILED:t();break;case n.TIMEOUT_EXPIRED:setTimeout(s,P);break;default:e()}}setTimeout(s,P)})}var aD=new IA().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),gD=new IA().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function tz(){let n={enabled:!0,workingColorSpace:QP,spaces:{},convert:function(t,s,i){return this.enabled===!1||s===i||!s||!i||(this.spaces[s].transfer===qA&&(t.r=Fe(t.r),t.g=Fe(t.g),t.b=Fe(t.b)),this.spaces[s].primaries!==this.spaces[i].primaries&&(t.applyMatrix3(this.spaces[s].toXYZ),t.applyMatrix3(this.spaces[i].fromXYZ)),this.spaces[i].transfer===qA&&(t.r=rn(t.r),t.g=rn(t.g),t.b=rn(t.b))),t},workingToColorSpace:function(t,s){return this.convert(t,this.workingColorSpace,s)},colorSpaceToWorking:function(t,s){return this.convert(t,s,this.workingColorSpace)},getPrimaries:function(t){return this.spaces[t].primaries},getTransfer:function(t){return t===Je?As:this.spaces[t].transfer},getToneMappingMode:function(t){return this.spaces[t].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(t,s=this.workingColorSpace){return t.fromArray(this.spaces[s].luminanceCoefficients)},define:function(t){Object.assign(this.spaces,t)},_getMatrix:function(t,s,i){return t.copy(this.spaces[s].toXYZ).multiply(this.spaces[i].fromXYZ)},_getDrawingBufferColorSpace:function(t){return this.spaces[t].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(t=this.workingColorSpace){return this.spaces[t].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(t,s){return cn("THREE.ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),n.workingToColorSpace(t,s)},toWorkingColorSpace:function(t,s){return cn("THREE.ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),n.colorSpaceToWorking(t,s)}},A=[.64,.33,.3,.6,.15,.06],P=[.2126,.7152,.0722],e=[.3127,.329];return n.define({[QP]:{primaries:A,whitePoint:e,transfer:As,toXYZ:aD,fromXYZ:gD,luminanceCoefficients:P,workingColorSpaceConfig:{unpackColorSpace:cP},outputColorSpaceConfig:{drawingBufferColorSpace:cP}},[cP]:{primaries:A,whitePoint:e,transfer:qA,toXYZ:aD,fromXYZ:gD,luminanceCoefficients:P,outputColorSpaceConfig:{drawingBufferColorSpace:cP}}}),n}var ZA=tz();function Fe(n){return n<.04045?n*.0773993808:Math.pow(n*.9478672986+.0521327014,2.4)}function rn(n){return n<.0031308?n*12.92:1.055*Math.pow(n,.41666)-.055}var Zt,li=class{static getDataURL(A,P="image/png"){if(/^data:/i.test(A.src)||typeof HTMLCanvasElement>"u")return A.src;let e;if(A instanceof HTMLCanvasElement)e=A;else{Zt===void 0&&(Zt=zn("canvas")),Zt.width=A.width,Zt.height=A.height;let t=Zt.getContext("2d");A instanceof ImageData?t.putImageData(A,0,0):t.drawImage(A,0,0,A.width,A.height),e=Zt}return e.toDataURL(P)}static sRGBToLinear(A){if(typeof HTMLImageElement<"u"&&A instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&A instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&A instanceof ImageBitmap){let P=zn("canvas");P.width=A.width,P.height=A.height;let e=P.getContext("2d");e.drawImage(A,0,0,A.width,A.height);let t=e.getImageData(0,0,A.width,A.height),s=t.data;for(let i=0;i<s.length;i++)s[i]=Fe(s[i]/255)*255;return e.putImageData(t,0,0),P}else if(A.data){let P=A.data.slice(0);for(let e=0;e<P.length;e++)P instanceof Uint8Array||P instanceof Uint8ClampedArray?P[e]=Math.floor(Fe(P[e]/255)*255):P[e]=Fe(P[e]);return{data:P,width:A.width,height:A.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),A}},nz=0,an=class{constructor(A=null){this.isSource=!0,Object.defineProperty(this,"id",{value:nz++}),this.uuid=ve(),this.data=A,this.dataReady=!0,this.version=0}getSize(A){let P=this.data;return typeof HTMLVideoElement<"u"&&P instanceof HTMLVideoElement?A.set(P.videoWidth,P.videoHeight,0):P instanceof VideoFrame?A.set(P.displayHeight,P.displayWidth,0):P!==null?A.set(P.width,P.height,P.depth||0):A.set(0,0,0),A}set needsUpdate(A){A===!0&&this.version++}toJSON(A){let P=A===void 0||typeof A=="string";if(!P&&A.images[this.uuid]!==void 0)return A.images[this.uuid];let e={uuid:this.uuid,url:""},t=this.data;if(t!==null){let s;if(Array.isArray(t)){s=[];for(let i=0,v=t.length;i<v;i++)t[i].isDataTexture?s.push(Vv(t[i].image)):s.push(Vv(t[i]))}else s=Vv(t);e.url=s}return P||(A.images[this.uuid]=e),e}};function Vv(n){return typeof HTMLImageElement<"u"&&n instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&n instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&n instanceof ImageBitmap?li.getDataURL(n):n.data?{data:Array.from(n.data),width:n.width,height:n.height,type:n.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var sz=0,qv=new y,jP=class n extends Ne{constructor(A=n.DEFAULT_IMAGE,P=n.DEFAULT_MAPPING,e=Be,t=Be,s=IP,i=ze,v=qP,o=ce,r=n.DEFAULT_ANISOTROPY,D=Je){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:sz++}),this.uuid=ve(),this.name="",this.source=new an(A),this.mipmaps=[],this.mapping=P,this.channel=0,this.wrapS=e,this.wrapT=t,this.magFilter=s,this.minFilter=i,this.anisotropy=r,this.format=v,this.internalFormat=null,this.type=o,this.offset=new bA(0,0),this.repeat=new bA(1,1),this.center=new bA(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new IA,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=D,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(A&&A.depth&&A.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(qv).x}get height(){return this.source.getSize(qv).y}get depth(){return this.source.getSize(qv).z}get image(){return this.source.data}set image(A=null){this.source.data=A}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(A,P){this.updateRanges.push({start:A,count:P})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(A){return this.name=A.name,this.source=A.source,this.mipmaps=A.mipmaps.slice(0),this.mapping=A.mapping,this.channel=A.channel,this.wrapS=A.wrapS,this.wrapT=A.wrapT,this.magFilter=A.magFilter,this.minFilter=A.minFilter,this.anisotropy=A.anisotropy,this.format=A.format,this.internalFormat=A.internalFormat,this.type=A.type,this.offset.copy(A.offset),this.repeat.copy(A.repeat),this.center.copy(A.center),this.rotation=A.rotation,this.matrixAutoUpdate=A.matrixAutoUpdate,this.matrix.copy(A.matrix),this.generateMipmaps=A.generateMipmaps,this.premultiplyAlpha=A.premultiplyAlpha,this.flipY=A.flipY,this.unpackAlignment=A.unpackAlignment,this.colorSpace=A.colorSpace,this.renderTarget=A.renderTarget,this.isRenderTargetTexture=A.isRenderTargetTexture,this.isArrayTexture=A.isArrayTexture,this.userData=JSON.parse(JSON.stringify(A.userData)),this.needsUpdate=!0,this}setValues(A){for(let P in A){let e=A[P];if(e===void 0){console.warn(`THREE.Texture.setValues(): parameter '${P}' has value of undefined.`);continue}let t=this[P];if(t===void 0){console.warn(`THREE.Texture.setValues(): property '${P}' does not exist.`);continue}t&&e&&t.isVector2&&e.isVector2||t&&e&&t.isVector3&&e.isVector3||t&&e&&t.isMatrix3&&e.isMatrix3?t.copy(e):this[P]=e}}toJSON(A){let P=A===void 0||typeof A=="string";if(!P&&A.textures[this.uuid]!==void 0)return A.textures[this.uuid];let e={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(A).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(e.userData=this.userData),P||(A.textures[this.uuid]=e),e}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(A){if(this.mapping!==Hr)return A;if(A.applyMatrix3(this.matrix),A.x<0||A.x>1)switch(this.wrapS){case tt:A.x=A.x-Math.floor(A.x);break;case Be:A.x=A.x<0?0:1;break;case on:Math.abs(Math.floor(A.x)%2)===1?A.x=Math.ceil(A.x)-A.x:A.x=A.x-Math.floor(A.x);break}if(A.y<0||A.y>1)switch(this.wrapT){case tt:A.y=A.y-Math.floor(A.y);break;case Be:A.y=A.y<0?0:1;break;case on:Math.abs(Math.floor(A.y)%2)===1?A.y=Math.ceil(A.y)-A.y:A.y=A.y-Math.floor(A.y);break}return this.flipY&&(A.y=1-A.y),A}set needsUpdate(A){A===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(A){A===!0&&this.pmremVersion++}};jP.DEFAULT_IMAGE=null;jP.DEFAULT_MAPPING=Hr;jP.DEFAULT_ANISOTROPY=1;var SA=class n{constructor(A=0,P=0,e=0,t=1){n.prototype.isVector4=!0,this.x=A,this.y=P,this.z=e,this.w=t}get width(){return this.z}set width(A){this.z=A}get height(){return this.w}set height(A){this.w=A}set(A,P,e,t){return this.x=A,this.y=P,this.z=e,this.w=t,this}setScalar(A){return this.x=A,this.y=A,this.z=A,this.w=A,this}setX(A){return this.x=A,this}setY(A){return this.y=A,this}setZ(A){return this.z=A,this}setW(A){return this.w=A,this}setComponent(A,P){switch(A){case 0:this.x=P;break;case 1:this.y=P;break;case 2:this.z=P;break;case 3:this.w=P;break;default:throw new Error("index is out of range: "+A)}return this}getComponent(A){switch(A){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+A)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(A){return this.x=A.x,this.y=A.y,this.z=A.z,this.w=A.w!==void 0?A.w:1,this}add(A){return this.x+=A.x,this.y+=A.y,this.z+=A.z,this.w+=A.w,this}addScalar(A){return this.x+=A,this.y+=A,this.z+=A,this.w+=A,this}addVectors(A,P){return this.x=A.x+P.x,this.y=A.y+P.y,this.z=A.z+P.z,this.w=A.w+P.w,this}addScaledVector(A,P){return this.x+=A.x*P,this.y+=A.y*P,this.z+=A.z*P,this.w+=A.w*P,this}sub(A){return this.x-=A.x,this.y-=A.y,this.z-=A.z,this.w-=A.w,this}subScalar(A){return this.x-=A,this.y-=A,this.z-=A,this.w-=A,this}subVectors(A,P){return this.x=A.x-P.x,this.y=A.y-P.y,this.z=A.z-P.z,this.w=A.w-P.w,this}multiply(A){return this.x*=A.x,this.y*=A.y,this.z*=A.z,this.w*=A.w,this}multiplyScalar(A){return this.x*=A,this.y*=A,this.z*=A,this.w*=A,this}applyMatrix4(A){let P=this.x,e=this.y,t=this.z,s=this.w,i=A.elements;return this.x=i[0]*P+i[4]*e+i[8]*t+i[12]*s,this.y=i[1]*P+i[5]*e+i[9]*t+i[13]*s,this.z=i[2]*P+i[6]*e+i[10]*t+i[14]*s,this.w=i[3]*P+i[7]*e+i[11]*t+i[15]*s,this}divide(A){return this.x/=A.x,this.y/=A.y,this.z/=A.z,this.w/=A.w,this}divideScalar(A){return this.multiplyScalar(1/A)}setAxisAngleFromQuaternion(A){this.w=2*Math.acos(A.w);let P=Math.sqrt(1-A.w*A.w);return P<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=A.x/P,this.y=A.y/P,this.z=A.z/P),this}setAxisAngleFromRotationMatrix(A){let P,e,t,s,o=A.elements,r=o[0],D=o[4],z=o[8],c=o[1],g=o[5],B=o[9],f=o[2],T=o[6],a=o[10];if(Math.abs(D-c)<.01&&Math.abs(z-f)<.01&&Math.abs(B-T)<.01){if(Math.abs(D+c)<.1&&Math.abs(z+f)<.1&&Math.abs(B+T)<.1&&Math.abs(r+g+a-3)<.1)return this.set(1,0,0,0),this;P=Math.PI;let u=(r+1)/2,j=(g+1)/2,d=(a+1)/2,Q=(D+c)/4,Y=(z+f)/4,x=(B+T)/4;return u>j&&u>d?u<.01?(e=0,t=.707106781,s=.707106781):(e=Math.sqrt(u),t=Q/e,s=Y/e):j>d?j<.01?(e=.707106781,t=0,s=.707106781):(t=Math.sqrt(j),e=Q/t,s=x/t):d<.01?(e=.707106781,t=.707106781,s=0):(s=Math.sqrt(d),e=Y/s,t=x/s),this.set(e,t,s,P),this}let m=Math.sqrt((T-B)*(T-B)+(z-f)*(z-f)+(c-D)*(c-D));return Math.abs(m)<.001&&(m=1),this.x=(T-B)/m,this.y=(z-f)/m,this.z=(c-D)/m,this.w=Math.acos((r+g+a-1)/2),this}setFromMatrixPosition(A){let P=A.elements;return this.x=P[12],this.y=P[13],this.z=P[14],this.w=P[15],this}min(A){return this.x=Math.min(this.x,A.x),this.y=Math.min(this.y,A.y),this.z=Math.min(this.z,A.z),this.w=Math.min(this.w,A.w),this}max(A){return this.x=Math.max(this.x,A.x),this.y=Math.max(this.y,A.y),this.z=Math.max(this.z,A.z),this.w=Math.max(this.w,A.w),this}clamp(A,P){return this.x=FA(this.x,A.x,P.x),this.y=FA(this.y,A.y,P.y),this.z=FA(this.z,A.z,P.z),this.w=FA(this.w,A.w,P.w),this}clampScalar(A,P){return this.x=FA(this.x,A,P),this.y=FA(this.y,A,P),this.z=FA(this.z,A,P),this.w=FA(this.w,A,P),this}clampLength(A,P){let e=this.length();return this.divideScalar(e||1).multiplyScalar(FA(e,A,P))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(A){return this.x*A.x+this.y*A.y+this.z*A.z+this.w*A.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(A){return this.normalize().multiplyScalar(A)}lerp(A,P){return this.x+=(A.x-this.x)*P,this.y+=(A.y-this.y)*P,this.z+=(A.z-this.z)*P,this.w+=(A.w-this.w)*P,this}lerpVectors(A,P,e){return this.x=A.x+(P.x-A.x)*e,this.y=A.y+(P.y-A.y)*e,this.z=A.z+(P.z-A.z)*e,this.w=A.w+(P.w-A.w)*e,this}equals(A){return A.x===this.x&&A.y===this.y&&A.z===this.z&&A.w===this.w}fromArray(A,P=0){return this.x=A[P],this.y=A[P+1],this.z=A[P+2],this.w=A[P+3],this}toArray(A=[],P=0){return A[P]=this.x,A[P+1]=this.y,A[P+2]=this.z,A[P+3]=this.w,A}fromBufferAttribute(A,P){return this.x=A.getX(P),this.y=A.getY(P),this.z=A.getZ(P),this.w=A.getW(P),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},hi=class extends Ne{constructor(A=1,P=1,e={}){super(),e=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:IP,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},e),this.isRenderTarget=!0,this.width=A,this.height=P,this.depth=e.depth,this.scissor=new SA(0,0,A,P),this.scissorTest=!1,this.viewport=new SA(0,0,A,P);let t={width:A,height:P,depth:e.depth},s=new jP(t);this.textures=[];let i=e.count;for(let v=0;v<i;v++)this.textures[v]=s.clone(),this.textures[v].isRenderTargetTexture=!0,this.textures[v].renderTarget=this;this._setTextureOptions(e),this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=e.depthTexture,this.samples=e.samples,this.multiview=e.multiview}_setTextureOptions(A={}){let P={minFilter:IP,generateMipmaps:!1,flipY:!1,internalFormat:null};A.mapping!==void 0&&(P.mapping=A.mapping),A.wrapS!==void 0&&(P.wrapS=A.wrapS),A.wrapT!==void 0&&(P.wrapT=A.wrapT),A.wrapR!==void 0&&(P.wrapR=A.wrapR),A.magFilter!==void 0&&(P.magFilter=A.magFilter),A.minFilter!==void 0&&(P.minFilter=A.minFilter),A.format!==void 0&&(P.format=A.format),A.type!==void 0&&(P.type=A.type),A.anisotropy!==void 0&&(P.anisotropy=A.anisotropy),A.colorSpace!==void 0&&(P.colorSpace=A.colorSpace),A.flipY!==void 0&&(P.flipY=A.flipY),A.generateMipmaps!==void 0&&(P.generateMipmaps=A.generateMipmaps),A.internalFormat!==void 0&&(P.internalFormat=A.internalFormat);for(let e=0;e<this.textures.length;e++)this.textures[e].setValues(P)}get texture(){return this.textures[0]}set texture(A){this.textures[0]=A}set depthTexture(A){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),A!==null&&(A.renderTarget=this),this._depthTexture=A}get depthTexture(){return this._depthTexture}setSize(A,P,e=1){if(this.width!==A||this.height!==P||this.depth!==e){this.width=A,this.height=P,this.depth=e;for(let t=0,s=this.textures.length;t<s;t++)this.textures[t].image.width=A,this.textures[t].image.height=P,this.textures[t].image.depth=e,this.textures[t].isArrayTexture=this.textures[t].image.depth>1;this.dispose()}this.viewport.set(0,0,A,P),this.scissor.set(0,0,A,P)}clone(){return new this.constructor().copy(this)}copy(A){this.width=A.width,this.height=A.height,this.depth=A.depth,this.scissor.copy(A.scissor),this.scissorTest=A.scissorTest,this.viewport.copy(A.viewport),this.textures.length=0;for(let P=0,e=A.textures.length;P<e;P++){this.textures[P]=A.textures[P].clone(),this.textures[P].isRenderTargetTexture=!0,this.textures[P].renderTarget=this;let t=Object.assign({},A.textures[P].image);this.textures[P].source=new an(t)}return this.depthBuffer=A.depthBuffer,this.stencilBuffer=A.stencilBuffer,this.resolveDepthBuffer=A.resolveDepthBuffer,this.resolveStencilBuffer=A.resolveStencilBuffer,A.depthTexture!==null&&(this.depthTexture=A.depthTexture.clone()),this.samples=A.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},we=class extends hi{constructor(A=1,P=1,e={}){super(A,P,e),this.isWebGLRenderTarget=!0}},es=class extends jP{constructor(A=null,P=1,e=1,t=1){super(null),this.isDataArrayTexture=!0,this.image={data:A,width:P,height:e,depth:t},this.magFilter=MP,this.minFilter=MP,this.wrapR=Be,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(A){this.layerUpdates.add(A)}clearLayerUpdates(){this.layerUpdates.clear()}};var ui=class extends jP{constructor(A=null,P=1,e=1,t=1){super(null),this.isData3DTexture=!0,this.image={data:A,width:P,height:e,depth:t},this.magFilter=MP,this.minFilter=MP,this.wrapR=Be,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var JP=class{constructor(A=new y(1/0,1/0,1/0),P=new y(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=A,this.max=P}set(A,P){return this.min.copy(A),this.max.copy(P),this}setFromArray(A){this.makeEmpty();for(let P=0,e=A.length;P<e;P+=3)this.expandByPoint(ee.fromArray(A,P));return this}setFromBufferAttribute(A){this.makeEmpty();for(let P=0,e=A.count;P<e;P++)this.expandByPoint(ee.fromBufferAttribute(A,P));return this}setFromPoints(A){this.makeEmpty();for(let P=0,e=A.length;P<e;P++)this.expandByPoint(A[P]);return this}setFromCenterAndSize(A,P){let e=ee.copy(P).multiplyScalar(.5);return this.min.copy(A).sub(e),this.max.copy(A).add(e),this}setFromObject(A,P=!1){return this.makeEmpty(),this.expandByObject(A,P)}clone(){return new this.constructor().copy(this)}copy(A){return this.min.copy(A.min),this.max.copy(A.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(A){return this.isEmpty()?A.set(0,0,0):A.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(A){return this.isEmpty()?A.set(0,0,0):A.subVectors(this.max,this.min)}expandByPoint(A){return this.min.min(A),this.max.max(A),this}expandByVector(A){return this.min.sub(A),this.max.add(A),this}expandByScalar(A){return this.min.addScalar(-A),this.max.addScalar(A),this}expandByObject(A,P=!1){A.updateWorldMatrix(!1,!1);let e=A.geometry;if(e!==void 0){let s=e.getAttribute("position");if(P===!0&&s!==void 0&&A.isInstancedMesh!==!0)for(let i=0,v=s.count;i<v;i++)A.isMesh===!0?A.getVertexPosition(i,ee):ee.fromBufferAttribute(s,i),ee.applyMatrix4(A.matrixWorld),this.expandByPoint(ee);else A.boundingBox!==void 0?(A.boundingBox===null&&A.computeBoundingBox(),Rs.copy(A.boundingBox)):(e.boundingBox===null&&e.computeBoundingBox(),Rs.copy(e.boundingBox)),Rs.applyMatrix4(A.matrixWorld),this.union(Rs)}let t=A.children;for(let s=0,i=t.length;s<i;s++)this.expandByObject(t[s],P);return this}containsPoint(A){return A.x>=this.min.x&&A.x<=this.max.x&&A.y>=this.min.y&&A.y<=this.max.y&&A.z>=this.min.z&&A.z<=this.max.z}containsBox(A){return this.min.x<=A.min.x&&A.max.x<=this.max.x&&this.min.y<=A.min.y&&A.max.y<=this.max.y&&this.min.z<=A.min.z&&A.max.z<=this.max.z}getParameter(A,P){return P.set((A.x-this.min.x)/(this.max.x-this.min.x),(A.y-this.min.y)/(this.max.y-this.min.y),(A.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(A){return A.max.x>=this.min.x&&A.min.x<=this.max.x&&A.max.y>=this.min.y&&A.min.y<=this.max.y&&A.max.z>=this.min.z&&A.min.z<=this.max.z}intersectsSphere(A){return this.clampPoint(A.center,ee),ee.distanceToSquared(A.center)<=A.radius*A.radius}intersectsPlane(A){let P,e;return A.normal.x>0?(P=A.normal.x*this.min.x,e=A.normal.x*this.max.x):(P=A.normal.x*this.max.x,e=A.normal.x*this.min.x),A.normal.y>0?(P+=A.normal.y*this.min.y,e+=A.normal.y*this.max.y):(P+=A.normal.y*this.max.y,e+=A.normal.y*this.min.y),A.normal.z>0?(P+=A.normal.z*this.min.z,e+=A.normal.z*this.max.z):(P+=A.normal.z*this.max.z,e+=A.normal.z*this.min.z),P<=-A.constant&&e>=-A.constant}intersectsTriangle(A){if(this.isEmpty())return!1;this.getCenter(Nn),Ws.subVectors(this.max,Nn),Rt.subVectors(A.a,Nn),Wt.subVectors(A.b,Nn),St.subVectors(A.c,Nn),qe.subVectors(Wt,Rt),Ke.subVectors(St,Wt),Tt.subVectors(Rt,St);let P=[0,-qe.z,qe.y,0,-Ke.z,Ke.y,0,-Tt.z,Tt.y,qe.z,0,-qe.x,Ke.z,0,-Ke.x,Tt.z,0,-Tt.x,-qe.y,qe.x,0,-Ke.y,Ke.x,0,-Tt.y,Tt.x,0];return!Kv(P,Rt,Wt,St,Ws)||(P=[1,0,0,0,1,0,0,0,1],!Kv(P,Rt,Wt,St,Ws))?!1:(Ss.crossVectors(qe,Ke),P=[Ss.x,Ss.y,Ss.z],Kv(P,Rt,Wt,St,Ws))}clampPoint(A,P){return P.copy(A).clamp(this.min,this.max)}distanceToPoint(A){return this.clampPoint(A,ee).distanceTo(A)}getBoundingSphere(A){return this.isEmpty()?A.makeEmpty():(this.getCenter(A.center),A.radius=this.getSize(ee).length()*.5),A}intersect(A){return this.min.max(A.min),this.max.min(A.max),this.isEmpty()&&this.makeEmpty(),this}union(A){return this.min.min(A.min),this.max.max(A.max),this}applyMatrix4(A){return this.isEmpty()?this:(Oe[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(A),Oe[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(A),Oe[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(A),Oe[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(A),Oe[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(A),Oe[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(A),Oe[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(A),Oe[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(A),this.setFromPoints(Oe),this)}translate(A){return this.min.add(A),this.max.add(A),this}equals(A){return A.min.equals(this.min)&&A.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(A){return this.min.fromArray(A.min),this.max.fromArray(A.max),this}},Oe=[new y,new y,new y,new y,new y,new y,new y,new y],ee=new y,Rs=new JP,Rt=new y,Wt=new y,St=new y,qe=new y,Ke=new y,Tt=new y,Nn=new y,Ws=new y,Ss=new y,Bt=new y;function Kv(n,A,P,e,t){for(let s=0,i=n.length-3;s<=i;s+=3){Bt.fromArray(n,s);let v=t.x*Math.abs(Bt.x)+t.y*Math.abs(Bt.y)+t.z*Math.abs(Bt.z),o=A.dot(Bt),r=P.dot(Bt),D=e.dot(Bt);if(Math.max(-Math.max(o,r,D),Math.min(o,r,D))>v)return!1}return!0}var iz=new JP,Xn=new y,_v=new y,FP=class{constructor(A=new y,P=-1){this.isSphere=!0,this.center=A,this.radius=P}set(A,P){return this.center.copy(A),this.radius=P,this}setFromPoints(A,P){let e=this.center;P!==void 0?e.copy(P):iz.setFromPoints(A).getCenter(e);let t=0;for(let s=0,i=A.length;s<i;s++)t=Math.max(t,e.distanceToSquared(A[s]));return this.radius=Math.sqrt(t),this}copy(A){return this.center.copy(A.center),this.radius=A.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(A){return A.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(A){return A.distanceTo(this.center)-this.radius}intersectsSphere(A){let P=this.radius+A.radius;return A.center.distanceToSquared(this.center)<=P*P}intersectsBox(A){return A.intersectsSphere(this)}intersectsPlane(A){return Math.abs(A.distanceToPoint(this.center))<=this.radius}clampPoint(A,P){let e=this.center.distanceToSquared(A);return P.copy(A),e>this.radius*this.radius&&(P.sub(this.center).normalize(),P.multiplyScalar(this.radius).add(this.center)),P}getBoundingBox(A){return this.isEmpty()?(A.makeEmpty(),A):(A.set(this.center,this.center),A.expandByScalar(this.radius),A)}applyMatrix4(A){return this.center.applyMatrix4(A),this.radius=this.radius*A.getMaxScaleOnAxis(),this}translate(A){return this.center.add(A),this}expandByPoint(A){if(this.isEmpty())return this.center.copy(A),this.radius=0,this;Xn.subVectors(A,this.center);let P=Xn.lengthSq();if(P>this.radius*this.radius){let e=Math.sqrt(P),t=(e-this.radius)*.5;this.center.addScaledVector(Xn,t/e),this.radius+=t}return this}union(A){return A.isEmpty()?this:this.isEmpty()?(this.copy(A),this):(this.center.equals(A.center)===!0?this.radius=Math.max(this.radius,A.radius):(_v.subVectors(A.center,this.center).setLength(A.radius),this.expandByPoint(Xn.copy(A.center).add(_v)),this.expandByPoint(Xn.copy(A.center).sub(_v))),this)}equals(A){return A.center.equals(this.center)&&A.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(A){return this.radius=A.radius,this.center.fromArray(A.center),this}},Le=new y,$v=new y,Us=new y,_e=new y,Ar=new y,Js=new y,Pr=new y,Mt=class{constructor(A=new y,P=new y(0,0,-1)){this.origin=A,this.direction=P}set(A,P){return this.origin.copy(A),this.direction.copy(P),this}copy(A){return this.origin.copy(A.origin),this.direction.copy(A.direction),this}at(A,P){return P.copy(this.origin).addScaledVector(this.direction,A)}lookAt(A){return this.direction.copy(A).sub(this.origin).normalize(),this}recast(A){return this.origin.copy(this.at(A,Le)),this}closestPointToPoint(A,P){P.subVectors(A,this.origin);let e=P.dot(this.direction);return e<0?P.copy(this.origin):P.copy(this.origin).addScaledVector(this.direction,e)}distanceToPoint(A){return Math.sqrt(this.distanceSqToPoint(A))}distanceSqToPoint(A){let P=Le.subVectors(A,this.origin).dot(this.direction);return P<0?this.origin.distanceToSquared(A):(Le.copy(this.origin).addScaledVector(this.direction,P),Le.distanceToSquared(A))}distanceSqToSegment(A,P,e,t){$v.copy(A).add(P).multiplyScalar(.5),Us.copy(P).sub(A).normalize(),_e.copy(this.origin).sub($v);let s=A.distanceTo(P)*.5,i=-this.direction.dot(Us),v=_e.dot(this.direction),o=-_e.dot(Us),r=_e.lengthSq(),D=Math.abs(1-i*i),z,c,g,B;if(D>0)if(z=i*o-v,c=i*v-o,B=s*D,z>=0)if(c>=-B)if(c<=B){let f=1/D;z*=f,c*=f,g=z*(z+i*c+2*v)+c*(i*z+c+2*o)+r}else c=s,z=Math.max(0,-(i*c+v)),g=-z*z+c*(c+2*o)+r;else c=-s,z=Math.max(0,-(i*c+v)),g=-z*z+c*(c+2*o)+r;else c<=-B?(z=Math.max(0,-(-i*s+v)),c=z>0?-s:Math.min(Math.max(-s,-o),s),g=-z*z+c*(c+2*o)+r):c<=B?(z=0,c=Math.min(Math.max(-s,-o),s),g=c*(c+2*o)+r):(z=Math.max(0,-(i*s+v)),c=z>0?s:Math.min(Math.max(-s,-o),s),g=-z*z+c*(c+2*o)+r);else c=i>0?-s:s,z=Math.max(0,-(i*c+v)),g=-z*z+c*(c+2*o)+r;return e&&e.copy(this.origin).addScaledVector(this.direction,z),t&&t.copy($v).addScaledVector(Us,c),g}intersectSphere(A,P){Le.subVectors(A.center,this.origin);let e=Le.dot(this.direction),t=Le.dot(Le)-e*e,s=A.radius*A.radius;if(t>s)return null;let i=Math.sqrt(s-t),v=e-i,o=e+i;return o<0?null:v<0?this.at(o,P):this.at(v,P)}intersectsSphere(A){return A.radius<0?!1:this.distanceSqToPoint(A.center)<=A.radius*A.radius}distanceToPlane(A){let P=A.normal.dot(this.direction);if(P===0)return A.distanceToPoint(this.origin)===0?0:null;let e=-(this.origin.dot(A.normal)+A.constant)/P;return e>=0?e:null}intersectPlane(A,P){let e=this.distanceToPlane(A);return e===null?null:this.at(e,P)}intersectsPlane(A){let P=A.distanceToPoint(this.origin);return P===0||A.normal.dot(this.direction)*P<0}intersectBox(A,P){let e,t,s,i,v,o,r=1/this.direction.x,D=1/this.direction.y,z=1/this.direction.z,c=this.origin;return r>=0?(e=(A.min.x-c.x)*r,t=(A.max.x-c.x)*r):(e=(A.max.x-c.x)*r,t=(A.min.x-c.x)*r),D>=0?(s=(A.min.y-c.y)*D,i=(A.max.y-c.y)*D):(s=(A.max.y-c.y)*D,i=(A.min.y-c.y)*D),e>i||s>t||((s>e||isNaN(e))&&(e=s),(i<t||isNaN(t))&&(t=i),z>=0?(v=(A.min.z-c.z)*z,o=(A.max.z-c.z)*z):(v=(A.max.z-c.z)*z,o=(A.min.z-c.z)*z),e>o||v>t)||((v>e||e!==e)&&(e=v),(o<t||t!==t)&&(t=o),t<0)?null:this.at(e>=0?e:t,P)}intersectsBox(A){return this.intersectBox(A,Le)!==null}intersectTriangle(A,P,e,t,s){Ar.subVectors(P,A),Js.subVectors(e,A),Pr.crossVectors(Ar,Js);let i=this.direction.dot(Pr),v;if(i>0){if(t)return null;v=1}else if(i<0)v=-1,i=-i;else return null;_e.subVectors(this.origin,A);let o=v*this.direction.dot(Js.crossVectors(_e,Js));if(o<0)return null;let r=v*this.direction.dot(Ar.cross(_e));if(r<0||o+r>i)return null;let D=-v*_e.dot(Pr);return D<0?null:this.at(D/i,s)}applyMatrix4(A){return this.origin.applyMatrix4(A),this.direction.transformDirection(A),this}equals(A){return A.origin.equals(this.origin)&&A.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},yA=class n{constructor(A,P,e,t,s,i,v,o,r,D,z,c,g,B,f,T){n.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],A!==void 0&&this.set(A,P,e,t,s,i,v,o,r,D,z,c,g,B,f,T)}set(A,P,e,t,s,i,v,o,r,D,z,c,g,B,f,T){let a=this.elements;return a[0]=A,a[4]=P,a[8]=e,a[12]=t,a[1]=s,a[5]=i,a[9]=v,a[13]=o,a[2]=r,a[6]=D,a[10]=z,a[14]=c,a[3]=g,a[7]=B,a[11]=f,a[15]=T,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new n().fromArray(this.elements)}copy(A){let P=this.elements,e=A.elements;return P[0]=e[0],P[1]=e[1],P[2]=e[2],P[3]=e[3],P[4]=e[4],P[5]=e[5],P[6]=e[6],P[7]=e[7],P[8]=e[8],P[9]=e[9],P[10]=e[10],P[11]=e[11],P[12]=e[12],P[13]=e[13],P[14]=e[14],P[15]=e[15],this}copyPosition(A){let P=this.elements,e=A.elements;return P[12]=e[12],P[13]=e[13],P[14]=e[14],this}setFromMatrix3(A){let P=A.elements;return this.set(P[0],P[3],P[6],0,P[1],P[4],P[7],0,P[2],P[5],P[8],0,0,0,0,1),this}extractBasis(A,P,e){return A.setFromMatrixColumn(this,0),P.setFromMatrixColumn(this,1),e.setFromMatrixColumn(this,2),this}makeBasis(A,P,e){return this.set(A.x,P.x,e.x,0,A.y,P.y,e.y,0,A.z,P.z,e.z,0,0,0,0,1),this}extractRotation(A){let P=this.elements,e=A.elements,t=1/Ut.setFromMatrixColumn(A,0).length(),s=1/Ut.setFromMatrixColumn(A,1).length(),i=1/Ut.setFromMatrixColumn(A,2).length();return P[0]=e[0]*t,P[1]=e[1]*t,P[2]=e[2]*t,P[3]=0,P[4]=e[4]*s,P[5]=e[5]*s,P[6]=e[6]*s,P[7]=0,P[8]=e[8]*i,P[9]=e[9]*i,P[10]=e[10]*i,P[11]=0,P[12]=0,P[13]=0,P[14]=0,P[15]=1,this}makeRotationFromEuler(A){let P=this.elements,e=A.x,t=A.y,s=A.z,i=Math.cos(e),v=Math.sin(e),o=Math.cos(t),r=Math.sin(t),D=Math.cos(s),z=Math.sin(s);if(A.order==="XYZ"){let c=i*D,g=i*z,B=v*D,f=v*z;P[0]=o*D,P[4]=-o*z,P[8]=r,P[1]=g+B*r,P[5]=c-f*r,P[9]=-v*o,P[2]=f-c*r,P[6]=B+g*r,P[10]=i*o}else if(A.order==="YXZ"){let c=o*D,g=o*z,B=r*D,f=r*z;P[0]=c+f*v,P[4]=B*v-g,P[8]=i*r,P[1]=i*z,P[5]=i*D,P[9]=-v,P[2]=g*v-B,P[6]=f+c*v,P[10]=i*o}else if(A.order==="ZXY"){let c=o*D,g=o*z,B=r*D,f=r*z;P[0]=c-f*v,P[4]=-i*z,P[8]=B+g*v,P[1]=g+B*v,P[5]=i*D,P[9]=f-c*v,P[2]=-i*r,P[6]=v,P[10]=i*o}else if(A.order==="ZYX"){let c=i*D,g=i*z,B=v*D,f=v*z;P[0]=o*D,P[4]=B*r-g,P[8]=c*r+f,P[1]=o*z,P[5]=f*r+c,P[9]=g*r-B,P[2]=-r,P[6]=v*o,P[10]=i*o}else if(A.order==="YZX"){let c=i*o,g=i*r,B=v*o,f=v*r;P[0]=o*D,P[4]=f-c*z,P[8]=B*z+g,P[1]=z,P[5]=i*D,P[9]=-v*D,P[2]=-r*D,P[6]=g*z+B,P[10]=c-f*z}else if(A.order==="XZY"){let c=i*o,g=i*r,B=v*o,f=v*r;P[0]=o*D,P[4]=-z,P[8]=r*D,P[1]=c*z+f,P[5]=i*D,P[9]=g*z-B,P[2]=B*z-g,P[6]=v*D,P[10]=f*z+c}return P[3]=0,P[7]=0,P[11]=0,P[12]=0,P[13]=0,P[14]=0,P[15]=1,this}makeRotationFromQuaternion(A){return this.compose(vz,A,rz)}lookAt(A,P,e){let t=this.elements;return SP.subVectors(A,P),SP.lengthSq()===0&&(SP.z=1),SP.normalize(),$e.crossVectors(e,SP),$e.lengthSq()===0&&(Math.abs(e.z)===1?SP.x+=1e-4:SP.z+=1e-4,SP.normalize(),$e.crossVectors(e,SP)),$e.normalize(),Vs.crossVectors(SP,$e),t[0]=$e.x,t[4]=Vs.x,t[8]=SP.x,t[1]=$e.y,t[5]=Vs.y,t[9]=SP.y,t[2]=$e.z,t[6]=Vs.z,t[10]=SP.z,this}multiply(A){return this.multiplyMatrices(this,A)}premultiply(A){return this.multiplyMatrices(A,this)}multiplyMatrices(A,P){let e=A.elements,t=P.elements,s=this.elements,i=e[0],v=e[4],o=e[8],r=e[12],D=e[1],z=e[5],c=e[9],g=e[13],B=e[2],f=e[6],T=e[10],a=e[14],m=e[3],u=e[7],j=e[11],d=e[15],Q=t[0],Y=t[4],x=t[8],h=t[12],l=t[1],p=t[5],k=t[9],F=t[13],Z=t[2],S=t[6],R=t[10],PA=t[14],N=t[3],sA=t[7],oA=t[11],hA=t[15];return s[0]=i*Q+v*l+o*Z+r*N,s[4]=i*Y+v*p+o*S+r*sA,s[8]=i*x+v*k+o*R+r*oA,s[12]=i*h+v*F+o*PA+r*hA,s[1]=D*Q+z*l+c*Z+g*N,s[5]=D*Y+z*p+c*S+g*sA,s[9]=D*x+z*k+c*R+g*oA,s[13]=D*h+z*F+c*PA+g*hA,s[2]=B*Q+f*l+T*Z+a*N,s[6]=B*Y+f*p+T*S+a*sA,s[10]=B*x+f*k+T*R+a*oA,s[14]=B*h+f*F+T*PA+a*hA,s[3]=m*Q+u*l+j*Z+d*N,s[7]=m*Y+u*p+j*S+d*sA,s[11]=m*x+u*k+j*R+d*oA,s[15]=m*h+u*F+j*PA+d*hA,this}multiplyScalar(A){let P=this.elements;return P[0]*=A,P[4]*=A,P[8]*=A,P[12]*=A,P[1]*=A,P[5]*=A,P[9]*=A,P[13]*=A,P[2]*=A,P[6]*=A,P[10]*=A,P[14]*=A,P[3]*=A,P[7]*=A,P[11]*=A,P[15]*=A,this}determinant(){let A=this.elements,P=A[0],e=A[4],t=A[8],s=A[12],i=A[1],v=A[5],o=A[9],r=A[13],D=A[2],z=A[6],c=A[10],g=A[14],B=A[3],f=A[7],T=A[11],a=A[15];return B*(+s*o*z-t*r*z-s*v*c+e*r*c+t*v*g-e*o*g)+f*(+P*o*g-P*r*c+s*i*c-t*i*g+t*r*D-s*o*D)+T*(+P*r*z-P*v*g-s*i*z+e*i*g+s*v*D-e*r*D)+a*(-t*v*D-P*o*z+P*v*c+t*i*z-e*i*c+e*o*D)}transpose(){let A=this.elements,P;return P=A[1],A[1]=A[4],A[4]=P,P=A[2],A[2]=A[8],A[8]=P,P=A[6],A[6]=A[9],A[9]=P,P=A[3],A[3]=A[12],A[12]=P,P=A[7],A[7]=A[13],A[13]=P,P=A[11],A[11]=A[14],A[14]=P,this}setPosition(A,P,e){let t=this.elements;return A.isVector3?(t[12]=A.x,t[13]=A.y,t[14]=A.z):(t[12]=A,t[13]=P,t[14]=e),this}invert(){let A=this.elements,P=A[0],e=A[1],t=A[2],s=A[3],i=A[4],v=A[5],o=A[6],r=A[7],D=A[8],z=A[9],c=A[10],g=A[11],B=A[12],f=A[13],T=A[14],a=A[15],m=z*T*r-f*c*r+f*o*g-v*T*g-z*o*a+v*c*a,u=B*c*r-D*T*r-B*o*g+i*T*g+D*o*a-i*c*a,j=D*f*r-B*z*r+B*v*g-i*f*g-D*v*a+i*z*a,d=B*z*o-D*f*o-B*v*c+i*f*c+D*v*T-i*z*T,Q=P*m+e*u+t*j+s*d;if(Q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let Y=1/Q;return A[0]=m*Y,A[1]=(f*c*s-z*T*s-f*t*g+e*T*g+z*t*a-e*c*a)*Y,A[2]=(v*T*s-f*o*s+f*t*r-e*T*r-v*t*a+e*o*a)*Y,A[3]=(z*o*s-v*c*s-z*t*r+e*c*r+v*t*g-e*o*g)*Y,A[4]=u*Y,A[5]=(D*T*s-B*c*s+B*t*g-P*T*g-D*t*a+P*c*a)*Y,A[6]=(B*o*s-i*T*s-B*t*r+P*T*r+i*t*a-P*o*a)*Y,A[7]=(i*c*s-D*o*s+D*t*r-P*c*r-i*t*g+P*o*g)*Y,A[8]=j*Y,A[9]=(B*z*s-D*f*s-B*e*g+P*f*g+D*e*a-P*z*a)*Y,A[10]=(i*f*s-B*v*s+B*e*r-P*f*r-i*e*a+P*v*a)*Y,A[11]=(D*v*s-i*z*s-D*e*r+P*z*r+i*e*g-P*v*g)*Y,A[12]=d*Y,A[13]=(D*f*t-B*z*t+B*e*c-P*f*c-D*e*T+P*z*T)*Y,A[14]=(B*v*t-i*f*t-B*e*o+P*f*o+i*e*T-P*v*T)*Y,A[15]=(i*z*t-D*v*t+D*e*o-P*z*o-i*e*c+P*v*c)*Y,this}scale(A){let P=this.elements,e=A.x,t=A.y,s=A.z;return P[0]*=e,P[4]*=t,P[8]*=s,P[1]*=e,P[5]*=t,P[9]*=s,P[2]*=e,P[6]*=t,P[10]*=s,P[3]*=e,P[7]*=t,P[11]*=s,this}getMaxScaleOnAxis(){let A=this.elements,P=A[0]*A[0]+A[1]*A[1]+A[2]*A[2],e=A[4]*A[4]+A[5]*A[5]+A[6]*A[6],t=A[8]*A[8]+A[9]*A[9]+A[10]*A[10];return Math.sqrt(Math.max(P,e,t))}makeTranslation(A,P,e){return A.isVector3?this.set(1,0,0,A.x,0,1,0,A.y,0,0,1,A.z,0,0,0,1):this.set(1,0,0,A,0,1,0,P,0,0,1,e,0,0,0,1),this}makeRotationX(A){let P=Math.cos(A),e=Math.sin(A);return this.set(1,0,0,0,0,P,-e,0,0,e,P,0,0,0,0,1),this}makeRotationY(A){let P=Math.cos(A),e=Math.sin(A);return this.set(P,0,e,0,0,1,0,0,-e,0,P,0,0,0,0,1),this}makeRotationZ(A){let P=Math.cos(A),e=Math.sin(A);return this.set(P,-e,0,0,e,P,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(A,P){let e=Math.cos(P),t=Math.sin(P),s=1-e,i=A.x,v=A.y,o=A.z,r=s*i,D=s*v;return this.set(r*i+e,r*v-t*o,r*o+t*v,0,r*v+t*o,D*v+e,D*o-t*i,0,r*o-t*v,D*o+t*i,s*o*o+e,0,0,0,0,1),this}makeScale(A,P,e){return this.set(A,0,0,0,0,P,0,0,0,0,e,0,0,0,0,1),this}makeShear(A,P,e,t,s,i){return this.set(1,e,s,0,A,1,i,0,P,t,1,0,0,0,0,1),this}compose(A,P,e){let t=this.elements,s=P._x,i=P._y,v=P._z,o=P._w,r=s+s,D=i+i,z=v+v,c=s*r,g=s*D,B=s*z,f=i*D,T=i*z,a=v*z,m=o*r,u=o*D,j=o*z,d=e.x,Q=e.y,Y=e.z;return t[0]=(1-(f+a))*d,t[1]=(g+j)*d,t[2]=(B-u)*d,t[3]=0,t[4]=(g-j)*Q,t[5]=(1-(c+a))*Q,t[6]=(T+m)*Q,t[7]=0,t[8]=(B+u)*Y,t[9]=(T-m)*Y,t[10]=(1-(c+f))*Y,t[11]=0,t[12]=A.x,t[13]=A.y,t[14]=A.z,t[15]=1,this}decompose(A,P,e){let t=this.elements,s=Ut.set(t[0],t[1],t[2]).length(),i=Ut.set(t[4],t[5],t[6]).length(),v=Ut.set(t[8],t[9],t[10]).length();this.determinant()<0&&(s=-s),A.x=t[12],A.y=t[13],A.z=t[14],te.copy(this);let r=1/s,D=1/i,z=1/v;return te.elements[0]*=r,te.elements[1]*=r,te.elements[2]*=r,te.elements[4]*=D,te.elements[5]*=D,te.elements[6]*=D,te.elements[8]*=z,te.elements[9]*=z,te.elements[10]*=z,P.setFromRotationMatrix(te),e.x=s,e.y=i,e.z=v,this}makePerspective(A,P,e,t,s,i,v=ie,o=!1){let r=this.elements,D=2*s/(P-A),z=2*s/(e-t),c=(P+A)/(P-A),g=(e+t)/(e-t),B,f;if(o)B=s/(i-s),f=i*s/(i-s);else if(v===ie)B=-(i+s)/(i-s),f=-2*i*s/(i-s);else if(v===Ps)B=-i/(i-s),f=-i*s/(i-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+v);return r[0]=D,r[4]=0,r[8]=c,r[12]=0,r[1]=0,r[5]=z,r[9]=g,r[13]=0,r[2]=0,r[6]=0,r[10]=B,r[14]=f,r[3]=0,r[7]=0,r[11]=-1,r[15]=0,this}makeOrthographic(A,P,e,t,s,i,v=ie,o=!1){let r=this.elements,D=2/(P-A),z=2/(e-t),c=-(P+A)/(P-A),g=-(e+t)/(e-t),B,f;if(o)B=1/(i-s),f=i/(i-s);else if(v===ie)B=-2/(i-s),f=-(i+s)/(i-s);else if(v===Ps)B=-1/(i-s),f=-s/(i-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+v);return r[0]=D,r[4]=0,r[8]=0,r[12]=c,r[1]=0,r[5]=z,r[9]=0,r[13]=g,r[2]=0,r[6]=0,r[10]=B,r[14]=f,r[3]=0,r[7]=0,r[11]=0,r[15]=1,this}equals(A){let P=this.elements,e=A.elements;for(let t=0;t<16;t++)if(P[t]!==e[t])return!1;return!0}fromArray(A,P=0){for(let e=0;e<16;e++)this.elements[e]=A[e+P];return this}toArray(A=[],P=0){let e=this.elements;return A[P]=e[0],A[P+1]=e[1],A[P+2]=e[2],A[P+3]=e[3],A[P+4]=e[4],A[P+5]=e[5],A[P+6]=e[6],A[P+7]=e[7],A[P+8]=e[8],A[P+9]=e[9],A[P+10]=e[10],A[P+11]=e[11],A[P+12]=e[12],A[P+13]=e[13],A[P+14]=e[14],A[P+15]=e[15],A}},Ut=new y,te=new yA,vz=new y(0,0,0),rz=new y(1,1,1),$e=new y,Vs=new y,SP=new y,TD=new yA,BD=new CP,oe=class n{constructor(A=0,P=0,e=0,t=n.DEFAULT_ORDER){this.isEuler=!0,this._x=A,this._y=P,this._z=e,this._order=t}get x(){return this._x}set x(A){this._x=A,this._onChangeCallback()}get y(){return this._y}set y(A){this._y=A,this._onChangeCallback()}get z(){return this._z}set z(A){this._z=A,this._onChangeCallback()}get order(){return this._order}set order(A){this._order=A,this._onChangeCallback()}set(A,P,e,t=this._order){return this._x=A,this._y=P,this._z=e,this._order=t,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(A){return this._x=A._x,this._y=A._y,this._z=A._z,this._order=A._order,this._onChangeCallback(),this}setFromRotationMatrix(A,P=this._order,e=!0){let t=A.elements,s=t[0],i=t[4],v=t[8],o=t[1],r=t[5],D=t[9],z=t[2],c=t[6],g=t[10];switch(P){case"XYZ":this._y=Math.asin(FA(v,-1,1)),Math.abs(v)<.9999999?(this._x=Math.atan2(-D,g),this._z=Math.atan2(-i,s)):(this._x=Math.atan2(c,r),this._z=0);break;case"YXZ":this._x=Math.asin(-FA(D,-1,1)),Math.abs(D)<.9999999?(this._y=Math.atan2(v,g),this._z=Math.atan2(o,r)):(this._y=Math.atan2(-z,s),this._z=0);break;case"ZXY":this._x=Math.asin(FA(c,-1,1)),Math.abs(c)<.9999999?(this._y=Math.atan2(-z,g),this._z=Math.atan2(-i,r)):(this._y=0,this._z=Math.atan2(o,s));break;case"ZYX":this._y=Math.asin(-FA(z,-1,1)),Math.abs(z)<.9999999?(this._x=Math.atan2(c,g),this._z=Math.atan2(o,s)):(this._x=0,this._z=Math.atan2(-i,r));break;case"YZX":this._z=Math.asin(FA(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-D,r),this._y=Math.atan2(-z,s)):(this._x=0,this._y=Math.atan2(v,g));break;case"XZY":this._z=Math.asin(-FA(i,-1,1)),Math.abs(i)<.9999999?(this._x=Math.atan2(c,r),this._y=Math.atan2(v,s)):(this._x=Math.atan2(-D,g),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+P)}return this._order=P,e===!0&&this._onChangeCallback(),this}setFromQuaternion(A,P,e){return TD.makeRotationFromQuaternion(A),this.setFromRotationMatrix(TD,P,e)}setFromVector3(A,P=this._order){return this.set(A.x,A.y,A.z,P)}reorder(A){return BD.setFromEuler(this),this.setFromQuaternion(BD,A)}equals(A){return A._x===this._x&&A._y===this._y&&A._z===this._z&&A._order===this._order}fromArray(A){return this._x=A[0],this._y=A[1],this._z=A[2],A[3]!==void 0&&(this._order=A[3]),this._onChangeCallback(),this}toArray(A=[],P=0){return A[P]=this._x,A[P+1]=this._y,A[P+2]=this._z,A[P+3]=this._order,A}_onChange(A){return this._onChangeCallback=A,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oe.DEFAULT_ORDER="XYZ";var ts=class{constructor(){this.mask=1}set(A){this.mask=(1<<A|0)>>>0}enable(A){this.mask|=1<<A|0}enableAll(){this.mask=-1}toggle(A){this.mask^=1<<A|0}disable(A){this.mask&=~(1<<A|0)}disableAll(){this.mask=0}test(A){return(this.mask&A.mask)!==0}isEnabled(A){return(this.mask&(1<<A|0))!==0}},oz=0,fD=new y,Jt=new CP,Ie=new yA,qs=new y,Zn=new y,Dz=new y,zz=new CP,wD=new y(1,0,0),jD=new y(0,1,0),ED=new y(0,0,1),lD={type:"added"},cz={type:"removed"},Vt={type:"childadded",child:null},er={type:"childremoved",child:null},nP=class n extends Ne{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:oz++}),this.uuid=ve(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=n.DEFAULT_UP.clone();let A=new y,P=new oe,e=new CP,t=new y(1,1,1);function s(){e.setFromEuler(P,!1)}function i(){P.setFromQuaternion(e,void 0,!1)}P._onChange(s),e._onChange(i),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:A},rotation:{configurable:!0,enumerable:!0,value:P},quaternion:{configurable:!0,enumerable:!0,value:e},scale:{configurable:!0,enumerable:!0,value:t},modelViewMatrix:{value:new yA},normalMatrix:{value:new IA}}),this.matrix=new yA,this.matrixWorld=new yA,this.matrixAutoUpdate=n.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=n.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ts,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(A){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(A),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(A){return this.quaternion.premultiply(A),this}setRotationFromAxisAngle(A,P){this.quaternion.setFromAxisAngle(A,P)}setRotationFromEuler(A){this.quaternion.setFromEuler(A,!0)}setRotationFromMatrix(A){this.quaternion.setFromRotationMatrix(A)}setRotationFromQuaternion(A){this.quaternion.copy(A)}rotateOnAxis(A,P){return Jt.setFromAxisAngle(A,P),this.quaternion.multiply(Jt),this}rotateOnWorldAxis(A,P){return Jt.setFromAxisAngle(A,P),this.quaternion.premultiply(Jt),this}rotateX(A){return this.rotateOnAxis(wD,A)}rotateY(A){return this.rotateOnAxis(jD,A)}rotateZ(A){return this.rotateOnAxis(ED,A)}translateOnAxis(A,P){return fD.copy(A).applyQuaternion(this.quaternion),this.position.add(fD.multiplyScalar(P)),this}translateX(A){return this.translateOnAxis(wD,A)}translateY(A){return this.translateOnAxis(jD,A)}translateZ(A){return this.translateOnAxis(ED,A)}localToWorld(A){return this.updateWorldMatrix(!0,!1),A.applyMatrix4(this.matrixWorld)}worldToLocal(A){return this.updateWorldMatrix(!0,!1),A.applyMatrix4(Ie.copy(this.matrixWorld).invert())}lookAt(A,P,e){A.isVector3?qs.copy(A):qs.set(A,P,e);let t=this.parent;this.updateWorldMatrix(!0,!1),Zn.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ie.lookAt(Zn,qs,this.up):Ie.lookAt(qs,Zn,this.up),this.quaternion.setFromRotationMatrix(Ie),t&&(Ie.extractRotation(t.matrixWorld),Jt.setFromRotationMatrix(Ie),this.quaternion.premultiply(Jt.invert()))}add(A){if(arguments.length>1){for(let P=0;P<arguments.length;P++)this.add(arguments[P]);return this}return A===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",A),this):(A&&A.isObject3D?(A.removeFromParent(),A.parent=this,this.children.push(A),A.dispatchEvent(lD),Vt.child=A,this.dispatchEvent(Vt),Vt.child=null):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",A),this)}remove(A){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.remove(arguments[e]);return this}let P=this.children.indexOf(A);return P!==-1&&(A.parent=null,this.children.splice(P,1),A.dispatchEvent(cz),er.child=A,this.dispatchEvent(er),er.child=null),this}removeFromParent(){let A=this.parent;return A!==null&&A.remove(this),this}clear(){return this.remove(...this.children)}attach(A){return this.updateWorldMatrix(!0,!1),Ie.copy(this.matrixWorld).invert(),A.parent!==null&&(A.parent.updateWorldMatrix(!0,!1),Ie.multiply(A.parent.matrixWorld)),A.applyMatrix4(Ie),A.removeFromParent(),A.parent=this,this.children.push(A),A.updateWorldMatrix(!1,!0),A.dispatchEvent(lD),Vt.child=A,this.dispatchEvent(Vt),Vt.child=null,this}getObjectById(A){return this.getObjectByProperty("id",A)}getObjectByName(A){return this.getObjectByProperty("name",A)}getObjectByProperty(A,P){if(this[A]===P)return this;for(let e=0,t=this.children.length;e<t;e++){let i=this.children[e].getObjectByProperty(A,P);if(i!==void 0)return i}}getObjectsByProperty(A,P,e=[]){this[A]===P&&e.push(this);let t=this.children;for(let s=0,i=t.length;s<i;s++)t[s].getObjectsByProperty(A,P,e);return e}getWorldPosition(A){return this.updateWorldMatrix(!0,!1),A.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(A){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zn,A,Dz),A}getWorldScale(A){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Zn,zz,A),A}getWorldDirection(A){this.updateWorldMatrix(!0,!1);let P=this.matrixWorld.elements;return A.set(P[8],P[9],P[10]).normalize()}raycast(){}traverse(A){A(this);let P=this.children;for(let e=0,t=P.length;e<t;e++)P[e].traverse(A)}traverseVisible(A){if(this.visible===!1)return;A(this);let P=this.children;for(let e=0,t=P.length;e<t;e++)P[e].traverseVisible(A)}traverseAncestors(A){let P=this.parent;P!==null&&(A(P),P.traverseAncestors(A))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(A){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||A)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,A=!0);let P=this.children;for(let e=0,t=P.length;e<t;e++)P[e].updateMatrixWorld(A)}updateWorldMatrix(A,P){let e=this.parent;if(A===!0&&e!==null&&e.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),P===!0){let t=this.children;for(let s=0,i=t.length;s<i;s++)t[s].updateWorldMatrix(!1,!0)}}toJSON(A){let P=A===void 0||typeof A=="string",e={};P&&(A={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},e.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});let t={};t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),this.castShadow===!0&&(t.castShadow=!0),this.receiveShadow===!0&&(t.receiveShadow=!0),this.visible===!1&&(t.visible=!1),this.frustumCulled===!1&&(t.frustumCulled=!1),this.renderOrder!==0&&(t.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(t.userData=this.userData),t.layers=this.layers.mask,t.matrix=this.matrix.toArray(),t.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(t.matrixAutoUpdate=!1),this.isInstancedMesh&&(t.type="InstancedMesh",t.count=this.count,t.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(t.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(t.type="BatchedMesh",t.perObjectFrustumCulled=this.perObjectFrustumCulled,t.sortObjects=this.sortObjects,t.drawRanges=this._drawRanges,t.reservedRanges=this._reservedRanges,t.geometryInfo=this._geometryInfo.map(v=>({...v,boundingBox:v.boundingBox?v.boundingBox.toJSON():void 0,boundingSphere:v.boundingSphere?v.boundingSphere.toJSON():void 0})),t.instanceInfo=this._instanceInfo.map(v=>({...v})),t.availableInstanceIds=this._availableInstanceIds.slice(),t.availableGeometryIds=this._availableGeometryIds.slice(),t.nextIndexStart=this._nextIndexStart,t.nextVertexStart=this._nextVertexStart,t.geometryCount=this._geometryCount,t.maxInstanceCount=this._maxInstanceCount,t.maxVertexCount=this._maxVertexCount,t.maxIndexCount=this._maxIndexCount,t.geometryInitialized=this._geometryInitialized,t.matricesTexture=this._matricesTexture.toJSON(A),t.indirectTexture=this._indirectTexture.toJSON(A),this._colorsTexture!==null&&(t.colorsTexture=this._colorsTexture.toJSON(A)),this.boundingSphere!==null&&(t.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(t.boundingBox=this.boundingBox.toJSON()));function s(v,o){return v[o.uuid]===void 0&&(v[o.uuid]=o.toJSON(A)),o.uuid}if(this.isScene)this.background&&(this.background.isColor?t.background=this.background.toJSON():this.background.isTexture&&(t.background=this.background.toJSON(A).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(t.environment=this.environment.toJSON(A).uuid);else if(this.isMesh||this.isLine||this.isPoints){t.geometry=s(A.geometries,this.geometry);let v=this.geometry.parameters;if(v!==void 0&&v.shapes!==void 0){let o=v.shapes;if(Array.isArray(o))for(let r=0,D=o.length;r<D;r++){let z=o[r];s(A.shapes,z)}else s(A.shapes,o)}}if(this.isSkinnedMesh&&(t.bindMode=this.bindMode,t.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(A.skeletons,this.skeleton),t.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let v=[];for(let o=0,r=this.material.length;o<r;o++)v.push(s(A.materials,this.material[o]));t.material=v}else t.material=s(A.materials,this.material);if(this.children.length>0){t.children=[];for(let v=0;v<this.children.length;v++)t.children.push(this.children[v].toJSON(A).object)}if(this.animations.length>0){t.animations=[];for(let v=0;v<this.animations.length;v++){let o=this.animations[v];t.animations.push(s(A.animations,o))}}if(P){let v=i(A.geometries),o=i(A.materials),r=i(A.textures),D=i(A.images),z=i(A.shapes),c=i(A.skeletons),g=i(A.animations),B=i(A.nodes);v.length>0&&(e.geometries=v),o.length>0&&(e.materials=o),r.length>0&&(e.textures=r),D.length>0&&(e.images=D),z.length>0&&(e.shapes=z),c.length>0&&(e.skeletons=c),g.length>0&&(e.animations=g),B.length>0&&(e.nodes=B)}return e.object=t,e;function i(v){let o=[];for(let r in v){let D=v[r];delete D.metadata,o.push(D)}return o}}clone(A){return new this.constructor().copy(this,A)}copy(A,P=!0){if(this.name=A.name,this.up.copy(A.up),this.position.copy(A.position),this.rotation.order=A.rotation.order,this.quaternion.copy(A.quaternion),this.scale.copy(A.scale),this.matrix.copy(A.matrix),this.matrixWorld.copy(A.matrixWorld),this.matrixAutoUpdate=A.matrixAutoUpdate,this.matrixWorldAutoUpdate=A.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=A.matrixWorldNeedsUpdate,this.layers.mask=A.layers.mask,this.visible=A.visible,this.castShadow=A.castShadow,this.receiveShadow=A.receiveShadow,this.frustumCulled=A.frustumCulled,this.renderOrder=A.renderOrder,this.animations=A.animations.slice(),this.userData=JSON.parse(JSON.stringify(A.userData)),P===!0)for(let e=0;e<A.children.length;e++){let t=A.children[e];this.add(t.clone())}return this}};nP.DEFAULT_UP=new y(0,1,0);nP.DEFAULT_MATRIX_AUTO_UPDATE=!0;nP.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var ne=new y,ke=new y,tr=new y,He=new y,qt=new y,Kt=new y,hD=new y,nr=new y,sr=new y,ir=new y,vr=new SA,rr=new SA,or=new SA,Ce=class n{constructor(A=new y,P=new y,e=new y){this.a=A,this.b=P,this.c=e}static getNormal(A,P,e,t){t.subVectors(e,P),ne.subVectors(A,P),t.cross(ne);let s=t.lengthSq();return s>0?t.multiplyScalar(1/Math.sqrt(s)):t.set(0,0,0)}static getBarycoord(A,P,e,t,s){ne.subVectors(t,P),ke.subVectors(e,P),tr.subVectors(A,P);let i=ne.dot(ne),v=ne.dot(ke),o=ne.dot(tr),r=ke.dot(ke),D=ke.dot(tr),z=i*r-v*v;if(z===0)return s.set(0,0,0),null;let c=1/z,g=(r*o-v*D)*c,B=(i*D-v*o)*c;return s.set(1-g-B,B,g)}static containsPoint(A,P,e,t){return this.getBarycoord(A,P,e,t,He)===null?!1:He.x>=0&&He.y>=0&&He.x+He.y<=1}static getInterpolation(A,P,e,t,s,i,v,o){return this.getBarycoord(A,P,e,t,He)===null?(o.x=0,o.y=0,"z"in o&&(o.z=0),"w"in o&&(o.w=0),null):(o.setScalar(0),o.addScaledVector(s,He.x),o.addScaledVector(i,He.y),o.addScaledVector(v,He.z),o)}static getInterpolatedAttribute(A,P,e,t,s,i){return vr.setScalar(0),rr.setScalar(0),or.setScalar(0),vr.fromBufferAttribute(A,P),rr.fromBufferAttribute(A,e),or.fromBufferAttribute(A,t),i.setScalar(0),i.addScaledVector(vr,s.x),i.addScaledVector(rr,s.y),i.addScaledVector(or,s.z),i}static isFrontFacing(A,P,e,t){return ne.subVectors(e,P),ke.subVectors(A,P),ne.cross(ke).dot(t)<0}set(A,P,e){return this.a.copy(A),this.b.copy(P),this.c.copy(e),this}setFromPointsAndIndices(A,P,e,t){return this.a.copy(A[P]),this.b.copy(A[e]),this.c.copy(A[t]),this}setFromAttributeAndIndices(A,P,e,t){return this.a.fromBufferAttribute(A,P),this.b.fromBufferAttribute(A,e),this.c.fromBufferAttribute(A,t),this}clone(){return new this.constructor().copy(this)}copy(A){return this.a.copy(A.a),this.b.copy(A.b),this.c.copy(A.c),this}getArea(){return ne.subVectors(this.c,this.b),ke.subVectors(this.a,this.b),ne.cross(ke).length()*.5}getMidpoint(A){return A.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(A){return n.getNormal(this.a,this.b,this.c,A)}getPlane(A){return A.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(A,P){return n.getBarycoord(A,this.a,this.b,this.c,P)}getInterpolation(A,P,e,t,s){return n.getInterpolation(A,this.a,this.b,this.c,P,e,t,s)}containsPoint(A){return n.containsPoint(A,this.a,this.b,this.c)}isFrontFacing(A){return n.isFrontFacing(this.a,this.b,this.c,A)}intersectsBox(A){return A.intersectsTriangle(this)}closestPointToPoint(A,P){let e=this.a,t=this.b,s=this.c,i,v;qt.subVectors(t,e),Kt.subVectors(s,e),nr.subVectors(A,e);let o=qt.dot(nr),r=Kt.dot(nr);if(o<=0&&r<=0)return P.copy(e);sr.subVectors(A,t);let D=qt.dot(sr),z=Kt.dot(sr);if(D>=0&&z<=D)return P.copy(t);let c=o*z-D*r;if(c<=0&&o>=0&&D<=0)return i=o/(o-D),P.copy(e).addScaledVector(qt,i);ir.subVectors(A,s);let g=qt.dot(ir),B=Kt.dot(ir);if(B>=0&&g<=B)return P.copy(s);let f=g*r-o*B;if(f<=0&&r>=0&&B<=0)return v=r/(r-B),P.copy(e).addScaledVector(Kt,v);let T=D*B-g*z;if(T<=0&&z-D>=0&&g-B>=0)return hD.subVectors(s,t),v=(z-D)/(z-D+(g-B)),P.copy(t).addScaledVector(hD,v);let a=1/(T+f+c);return i=f*a,v=c*a,P.copy(e).addScaledVector(qt,i).addScaledVector(Kt,v)}equals(A){return A.a.equals(this.a)&&A.b.equals(this.b)&&A.c.equals(this.c)}},k9={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},At={h:0,s:0,l:0},Ks={h:0,s:0,l:0};function Dr(n,A,P){return P<0&&(P+=1),P>1&&(P-=1),P<1/6?n+(A-n)*6*P:P<1/2?A:P<2/3?n+(A-n)*6*(2/3-P):n}var mA=class{constructor(A,P,e){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(A,P,e)}set(A,P,e){if(P===void 0&&e===void 0){let t=A;t&&t.isColor?this.copy(t):typeof t=="number"?this.setHex(t):typeof t=="string"&&this.setStyle(t)}else this.setRGB(A,P,e);return this}setScalar(A){return this.r=A,this.g=A,this.b=A,this}setHex(A,P=cP){return A=Math.floor(A),this.r=(A>>16&255)/255,this.g=(A>>8&255)/255,this.b=(A&255)/255,ZA.colorSpaceToWorking(this,P),this}setRGB(A,P,e,t=ZA.workingColorSpace){return this.r=A,this.g=P,this.b=e,ZA.colorSpaceToWorking(this,t),this}setHSL(A,P,e,t=ZA.workingColorSpace){if(A=Vr(A,1),P=FA(P,0,1),e=FA(e,0,1),P===0)this.r=this.g=this.b=e;else{let s=e<=.5?e*(1+P):e+P-e*P,i=2*e-s;this.r=Dr(i,s,A+1/3),this.g=Dr(i,s,A),this.b=Dr(i,s,A-1/3)}return ZA.colorSpaceToWorking(this,t),this}setStyle(A,P=cP){function e(s){s!==void 0&&parseFloat(s)<1&&console.warn("THREE.Color: Alpha component of "+A+" will be ignored.")}let t;if(t=/^(\w+)\(([^\)]*)\)/.exec(A)){let s,i=t[1],v=t[2];switch(i){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(v))return e(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,P);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(v))return e(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,P);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(v))return e(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,P);break;default:console.warn("THREE.Color: Unknown color model "+A)}}else if(t=/^\#([A-Fa-f\d]+)$/.exec(A)){let s=t[1],i=s.length;if(i===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,P);if(i===6)return this.setHex(parseInt(s,16),P);console.warn("THREE.Color: Invalid hex color "+A)}else if(A&&A.length>0)return this.setColorName(A,P);return this}setColorName(A,P=cP){let e=k9[A.toLowerCase()];return e!==void 0?this.setHex(e,P):console.warn("THREE.Color: Unknown color "+A),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(A){return this.r=A.r,this.g=A.g,this.b=A.b,this}copySRGBToLinear(A){return this.r=Fe(A.r),this.g=Fe(A.g),this.b=Fe(A.b),this}copyLinearToSRGB(A){return this.r=rn(A.r),this.g=rn(A.g),this.b=rn(A.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(A=cP){return ZA.workingToColorSpace(YP.copy(this),A),Math.round(FA(YP.r*255,0,255))*65536+Math.round(FA(YP.g*255,0,255))*256+Math.round(FA(YP.b*255,0,255))}getHexString(A=cP){return("000000"+this.getHex(A).toString(16)).slice(-6)}getHSL(A,P=ZA.workingColorSpace){ZA.workingToColorSpace(YP.copy(this),P);let e=YP.r,t=YP.g,s=YP.b,i=Math.max(e,t,s),v=Math.min(e,t,s),o,r,D=(v+i)/2;if(v===i)o=0,r=0;else{let z=i-v;switch(r=D<=.5?z/(i+v):z/(2-i-v),i){case e:o=(t-s)/z+(t<s?6:0);break;case t:o=(s-e)/z+2;break;case s:o=(e-t)/z+4;break}o/=6}return A.h=o,A.s=r,A.l=D,A}getRGB(A,P=ZA.workingColorSpace){return ZA.workingToColorSpace(YP.copy(this),P),A.r=YP.r,A.g=YP.g,A.b=YP.b,A}getStyle(A=cP){ZA.workingToColorSpace(YP.copy(this),A);let P=YP.r,e=YP.g,t=YP.b;return A!==cP?`color(${A} ${P.toFixed(3)} ${e.toFixed(3)} ${t.toFixed(3)})`:`rgb(${Math.round(P*255)},${Math.round(e*255)},${Math.round(t*255)})`}offsetHSL(A,P,e){return this.getHSL(At),this.setHSL(At.h+A,At.s+P,At.l+e)}add(A){return this.r+=A.r,this.g+=A.g,this.b+=A.b,this}addColors(A,P){return this.r=A.r+P.r,this.g=A.g+P.g,this.b=A.b+P.b,this}addScalar(A){return this.r+=A,this.g+=A,this.b+=A,this}sub(A){return this.r=Math.max(0,this.r-A.r),this.g=Math.max(0,this.g-A.g),this.b=Math.max(0,this.b-A.b),this}multiply(A){return this.r*=A.r,this.g*=A.g,this.b*=A.b,this}multiplyScalar(A){return this.r*=A,this.g*=A,this.b*=A,this}lerp(A,P){return this.r+=(A.r-this.r)*P,this.g+=(A.g-this.g)*P,this.b+=(A.b-this.b)*P,this}lerpColors(A,P,e){return this.r=A.r+(P.r-A.r)*e,this.g=A.g+(P.g-A.g)*e,this.b=A.b+(P.b-A.b)*e,this}lerpHSL(A,P){this.getHSL(At),A.getHSL(Ks);let e=$n(At.h,Ks.h,P),t=$n(At.s,Ks.s,P),s=$n(At.l,Ks.l,P);return this.setHSL(e,t,s),this}setFromVector3(A){return this.r=A.x,this.g=A.y,this.b=A.z,this}applyMatrix3(A){let P=this.r,e=this.g,t=this.b,s=A.elements;return this.r=s[0]*P+s[3]*e+s[6]*t,this.g=s[1]*P+s[4]*e+s[7]*t,this.b=s[2]*P+s[5]*e+s[8]*t,this}equals(A){return A.r===this.r&&A.g===this.g&&A.b===this.b}fromArray(A,P=0){return this.r=A[P],this.g=A[P+1],this.b=A[P+2],this}toArray(A=[],P=0){return A[P]=this.r,A[P+1]=this.g,A[P+2]=this.b,A}fromBufferAttribute(A,P){return this.r=A.getX(P),this.g=A.getY(P),this.b=A.getZ(P),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},YP=new mA;mA.NAMES=k9;var az=0,kP=class extends Ne{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:az++}),this.uuid=ve(),this.name="",this.type="Material",this.blending=Et,this.side=re,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=wi,this.blendDst=ji,this.blendEquation=et,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new mA(0,0,0),this.blendAlpha=0,this.depthFunc=lt,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Mr,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=jt,this.stencilZFail=jt,this.stencilZPass=jt,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(A){this._alphaTest>0!=A>0&&this.version++,this._alphaTest=A}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(A){if(A!==void 0)for(let P in A){let e=A[P];if(e===void 0){console.warn(`THREE.Material: parameter '${P}' has value of undefined.`);continue}let t=this[P];if(t===void 0){console.warn(`THREE.Material: '${P}' is not a property of THREE.${this.type}.`);continue}t&&t.isColor?t.set(e):t&&t.isVector3&&e&&e.isVector3?t.copy(e):this[P]=e}}toJSON(A){let P=A===void 0||typeof A=="string";P&&(A={textures:{},images:{}});let e={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),this.color&&this.color.isColor&&(e.color=this.color.getHex()),this.roughness!==void 0&&(e.roughness=this.roughness),this.metalness!==void 0&&(e.metalness=this.metalness),this.sheen!==void 0&&(e.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(e.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(e.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(e.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(e.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(e.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(e.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(e.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(e.shininess=this.shininess),this.clearcoat!==void 0&&(e.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(e.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(e.clearcoatMap=this.clearcoatMap.toJSON(A).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(e.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(A).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(e.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(A).uuid,e.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(e.sheenColorMap=this.sheenColorMap.toJSON(A).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(e.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(A).uuid),this.dispersion!==void 0&&(e.dispersion=this.dispersion),this.iridescence!==void 0&&(e.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(e.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(e.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(e.iridescenceMap=this.iridescenceMap.toJSON(A).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(e.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(A).uuid),this.anisotropy!==void 0&&(e.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(e.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(e.anisotropyMap=this.anisotropyMap.toJSON(A).uuid),this.map&&this.map.isTexture&&(e.map=this.map.toJSON(A).uuid),this.matcap&&this.matcap.isTexture&&(e.matcap=this.matcap.toJSON(A).uuid),this.alphaMap&&this.alphaMap.isTexture&&(e.alphaMap=this.alphaMap.toJSON(A).uuid),this.lightMap&&this.lightMap.isTexture&&(e.lightMap=this.lightMap.toJSON(A).uuid,e.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(e.aoMap=this.aoMap.toJSON(A).uuid,e.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(e.bumpMap=this.bumpMap.toJSON(A).uuid,e.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(e.normalMap=this.normalMap.toJSON(A).uuid,e.normalMapType=this.normalMapType,e.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(e.displacementMap=this.displacementMap.toJSON(A).uuid,e.displacementScale=this.displacementScale,e.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(e.roughnessMap=this.roughnessMap.toJSON(A).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(e.metalnessMap=this.metalnessMap.toJSON(A).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(e.emissiveMap=this.emissiveMap.toJSON(A).uuid),this.specularMap&&this.specularMap.isTexture&&(e.specularMap=this.specularMap.toJSON(A).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(e.specularIntensityMap=this.specularIntensityMap.toJSON(A).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(e.specularColorMap=this.specularColorMap.toJSON(A).uuid),this.envMap&&this.envMap.isTexture&&(e.envMap=this.envMap.toJSON(A).uuid,this.combine!==void 0&&(e.combine=this.combine)),this.envMapRotation!==void 0&&(e.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(e.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(e.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(e.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(e.gradientMap=this.gradientMap.toJSON(A).uuid),this.transmission!==void 0&&(e.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(e.transmissionMap=this.transmissionMap.toJSON(A).uuid),this.thickness!==void 0&&(e.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(e.thicknessMap=this.thicknessMap.toJSON(A).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(e.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(e.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(e.size=this.size),this.shadowSide!==null&&(e.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(e.sizeAttenuation=this.sizeAttenuation),this.blending!==Et&&(e.blending=this.blending),this.side!==re&&(e.side=this.side),this.vertexColors===!0&&(e.vertexColors=!0),this.opacity<1&&(e.opacity=this.opacity),this.transparent===!0&&(e.transparent=!0),this.blendSrc!==wi&&(e.blendSrc=this.blendSrc),this.blendDst!==ji&&(e.blendDst=this.blendDst),this.blendEquation!==et&&(e.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(e.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(e.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(e.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(e.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(e.blendAlpha=this.blendAlpha),this.depthFunc!==lt&&(e.depthFunc=this.depthFunc),this.depthTest===!1&&(e.depthTest=this.depthTest),this.depthWrite===!1&&(e.depthWrite=this.depthWrite),this.colorWrite===!1&&(e.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(e.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Mr&&(e.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(e.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(e.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==jt&&(e.stencilFail=this.stencilFail),this.stencilZFail!==jt&&(e.stencilZFail=this.stencilZFail),this.stencilZPass!==jt&&(e.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(e.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(e.rotation=this.rotation),this.polygonOffset===!0&&(e.polygonOffset=!0),this.polygonOffsetFactor!==0&&(e.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(e.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(e.linewidth=this.linewidth),this.dashSize!==void 0&&(e.dashSize=this.dashSize),this.gapSize!==void 0&&(e.gapSize=this.gapSize),this.scale!==void 0&&(e.scale=this.scale),this.dithering===!0&&(e.dithering=!0),this.alphaTest>0&&(e.alphaTest=this.alphaTest),this.alphaHash===!0&&(e.alphaHash=!0),this.alphaToCoverage===!0&&(e.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(e.premultipliedAlpha=!0),this.forceSinglePass===!0&&(e.forceSinglePass=!0),this.wireframe===!0&&(e.wireframe=!0),this.wireframeLinewidth>1&&(e.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(e.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(e.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(e.flatShading=!0),this.visible===!1&&(e.visible=!1),this.toneMapped===!1&&(e.toneMapped=!1),this.fog===!1&&(e.fog=!1),Object.keys(this.userData).length>0&&(e.userData=this.userData);function t(s){let i=[];for(let v in s){let o=s[v];delete o.metadata,i.push(o)}return i}if(P){let s=t(A.textures),i=t(A.images);s.length>0&&(e.textures=s),i.length>0&&(e.images=i)}return e}clone(){return new this.constructor().copy(this)}copy(A){this.name=A.name,this.blending=A.blending,this.side=A.side,this.vertexColors=A.vertexColors,this.opacity=A.opacity,this.transparent=A.transparent,this.blendSrc=A.blendSrc,this.blendDst=A.blendDst,this.blendEquation=A.blendEquation,this.blendSrcAlpha=A.blendSrcAlpha,this.blendDstAlpha=A.blendDstAlpha,this.blendEquationAlpha=A.blendEquationAlpha,this.blendColor.copy(A.blendColor),this.blendAlpha=A.blendAlpha,this.depthFunc=A.depthFunc,this.depthTest=A.depthTest,this.depthWrite=A.depthWrite,this.stencilWriteMask=A.stencilWriteMask,this.stencilFunc=A.stencilFunc,this.stencilRef=A.stencilRef,this.stencilFuncMask=A.stencilFuncMask,this.stencilFail=A.stencilFail,this.stencilZFail=A.stencilZFail,this.stencilZPass=A.stencilZPass,this.stencilWrite=A.stencilWrite;let P=A.clippingPlanes,e=null;if(P!==null){let t=P.length;e=new Array(t);for(let s=0;s!==t;++s)e[s]=P[s].clone()}return this.clippingPlanes=e,this.clipIntersection=A.clipIntersection,this.clipShadows=A.clipShadows,this.shadowSide=A.shadowSide,this.colorWrite=A.colorWrite,this.precision=A.precision,this.polygonOffset=A.polygonOffset,this.polygonOffsetFactor=A.polygonOffsetFactor,this.polygonOffsetUnits=A.polygonOffsetUnits,this.dithering=A.dithering,this.alphaTest=A.alphaTest,this.alphaHash=A.alphaHash,this.alphaToCoverage=A.alphaToCoverage,this.premultipliedAlpha=A.premultipliedAlpha,this.forceSinglePass=A.forceSinglePass,this.visible=A.visible,this.toneMapped=A.toneMapped,this.userData=JSON.parse(JSON.stringify(A.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(A){A===!0&&this.version++}},De=class extends kP{constructor(A){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new mA(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oe,this.combine=kr,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(A)}copy(A){return super.copy(A),this.color.copy(A.color),this.map=A.map,this.lightMap=A.lightMap,this.lightMapIntensity=A.lightMapIntensity,this.aoMap=A.aoMap,this.aoMapIntensity=A.aoMapIntensity,this.specularMap=A.specularMap,this.alphaMap=A.alphaMap,this.envMap=A.envMap,this.envMapRotation.copy(A.envMapRotation),this.combine=A.combine,this.reflectivity=A.reflectivity,this.refractionRatio=A.refractionRatio,this.wireframe=A.wireframe,this.wireframeLinewidth=A.wireframeLinewidth,this.wireframeLinecap=A.wireframeLinecap,this.wireframeLinejoin=A.wireframeLinejoin,this.fog=A.fog,this}};var TP=new y,_s=new bA,gz=0,fP=class{constructor(A,P,e=!1){if(Array.isArray(A))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:gz++}),this.name="",this.array=A,this.itemSize=P,this.count=A!==void 0?A.length/P:0,this.normalized=e,this.usage=Ei,this.updateRanges=[],this.gpuType=Ae,this.version=0}onUploadCallback(){}set needsUpdate(A){A===!0&&this.version++}setUsage(A){return this.usage=A,this}addUpdateRange(A,P){this.updateRanges.push({start:A,count:P})}clearUpdateRanges(){this.updateRanges.length=0}copy(A){return this.name=A.name,this.array=new A.array.constructor(A.array),this.itemSize=A.itemSize,this.count=A.count,this.normalized=A.normalized,this.usage=A.usage,this.gpuType=A.gpuType,this}copyAt(A,P,e){A*=this.itemSize,e*=P.itemSize;for(let t=0,s=this.itemSize;t<s;t++)this.array[A+t]=P.array[e+t];return this}copyArray(A){return this.array.set(A),this}applyMatrix3(A){if(this.itemSize===2)for(let P=0,e=this.count;P<e;P++)_s.fromBufferAttribute(this,P),_s.applyMatrix3(A),this.setXY(P,_s.x,_s.y);else if(this.itemSize===3)for(let P=0,e=this.count;P<e;P++)TP.fromBufferAttribute(this,P),TP.applyMatrix3(A),this.setXYZ(P,TP.x,TP.y,TP.z);return this}applyMatrix4(A){for(let P=0,e=this.count;P<e;P++)TP.fromBufferAttribute(this,P),TP.applyMatrix4(A),this.setXYZ(P,TP.x,TP.y,TP.z);return this}applyNormalMatrix(A){for(let P=0,e=this.count;P<e;P++)TP.fromBufferAttribute(this,P),TP.applyNormalMatrix(A),this.setXYZ(P,TP.x,TP.y,TP.z);return this}transformDirection(A){for(let P=0,e=this.count;P<e;P++)TP.fromBufferAttribute(this,P),TP.transformDirection(A),this.setXYZ(P,TP.x,TP.y,TP.z);return this}set(A,P=0){return this.array.set(A,P),this}getComponent(A,P){let e=this.array[A*this.itemSize+P];return this.normalized&&(e=se(e,this.array)),e}setComponent(A,P,e){return this.normalized&&(e=VA(e,this.array)),this.array[A*this.itemSize+P]=e,this}getX(A){let P=this.array[A*this.itemSize];return this.normalized&&(P=se(P,this.array)),P}setX(A,P){return this.normalized&&(P=VA(P,this.array)),this.array[A*this.itemSize]=P,this}getY(A){let P=this.array[A*this.itemSize+1];return this.normalized&&(P=se(P,this.array)),P}setY(A,P){return this.normalized&&(P=VA(P,this.array)),this.array[A*this.itemSize+1]=P,this}getZ(A){let P=this.array[A*this.itemSize+2];return this.normalized&&(P=se(P,this.array)),P}setZ(A,P){return this.normalized&&(P=VA(P,this.array)),this.array[A*this.itemSize+2]=P,this}getW(A){let P=this.array[A*this.itemSize+3];return this.normalized&&(P=se(P,this.array)),P}setW(A,P){return this.normalized&&(P=VA(P,this.array)),this.array[A*this.itemSize+3]=P,this}setXY(A,P,e){return A*=this.itemSize,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array)),this.array[A+0]=P,this.array[A+1]=e,this}setXYZ(A,P,e,t){return A*=this.itemSize,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array),t=VA(t,this.array)),this.array[A+0]=P,this.array[A+1]=e,this.array[A+2]=t,this}setXYZW(A,P,e,t,s){return A*=this.itemSize,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array),t=VA(t,this.array),s=VA(s,this.array)),this.array[A+0]=P,this.array[A+1]=e,this.array[A+2]=t,this.array[A+3]=s,this}onUpload(A){return this.onUploadCallback=A,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let A={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(A.name=this.name),this.usage!==Ei&&(A.usage=this.usage),A}};var ns=class extends fP{constructor(A,P,e){super(new Uint16Array(A),P,e)}};var ss=class extends fP{constructor(A,P,e){super(new Uint32Array(A),P,e)}};var wP=class extends fP{constructor(A,P,e){super(new Float32Array(A),P,e)}},Tz=0,$P=new yA,zr=new nP,_t=new y,UP=new JP,Rn=new JP,uP=new y,pP=class n extends Ne{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Tz++}),this.uuid=ve(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(A){return Array.isArray(A)?this.index=new(Kr(A)?ss:ns)(A,1):this.index=A,this}setIndirect(A){return this.indirect=A,this}getIndirect(){return this.indirect}getAttribute(A){return this.attributes[A]}setAttribute(A,P){return this.attributes[A]=P,this}deleteAttribute(A){return delete this.attributes[A],this}hasAttribute(A){return this.attributes[A]!==void 0}addGroup(A,P,e=0){this.groups.push({start:A,count:P,materialIndex:e})}clearGroups(){this.groups=[]}setDrawRange(A,P){this.drawRange.start=A,this.drawRange.count=P}applyMatrix4(A){let P=this.attributes.position;P!==void 0&&(P.applyMatrix4(A),P.needsUpdate=!0);let e=this.attributes.normal;if(e!==void 0){let s=new IA().getNormalMatrix(A);e.applyNormalMatrix(s),e.needsUpdate=!0}let t=this.attributes.tangent;return t!==void 0&&(t.transformDirection(A),t.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(A){return $P.makeRotationFromQuaternion(A),this.applyMatrix4($P),this}rotateX(A){return $P.makeRotationX(A),this.applyMatrix4($P),this}rotateY(A){return $P.makeRotationY(A),this.applyMatrix4($P),this}rotateZ(A){return $P.makeRotationZ(A),this.applyMatrix4($P),this}translate(A,P,e){return $P.makeTranslation(A,P,e),this.applyMatrix4($P),this}scale(A,P,e){return $P.makeScale(A,P,e),this.applyMatrix4($P),this}lookAt(A){return zr.lookAt(A),zr.updateMatrix(),this.applyMatrix4(zr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(_t).negate(),this.translate(_t.x,_t.y,_t.z),this}setFromPoints(A){let P=this.getAttribute("position");if(P===void 0){let e=[];for(let t=0,s=A.length;t<s;t++){let i=A[t];e.push(i.x,i.y,i.z||0)}this.setAttribute("position",new wP(e,3))}else{let e=Math.min(A.length,P.count);for(let t=0;t<e;t++){let s=A[t];P.setXYZ(t,s.x,s.y,s.z||0)}A.length>P.count&&console.warn("THREE.BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),P.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new JP);let A=this.attributes.position,P=this.morphAttributes.position;if(A&&A.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new y(-1/0,-1/0,-1/0),new y(1/0,1/0,1/0));return}if(A!==void 0){if(this.boundingBox.setFromBufferAttribute(A),P)for(let e=0,t=P.length;e<t;e++){let s=P[e];UP.setFromBufferAttribute(s),this.morphTargetsRelative?(uP.addVectors(this.boundingBox.min,UP.min),this.boundingBox.expandByPoint(uP),uP.addVectors(this.boundingBox.max,UP.max),this.boundingBox.expandByPoint(uP)):(this.boundingBox.expandByPoint(UP.min),this.boundingBox.expandByPoint(UP.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new FP);let A=this.attributes.position,P=this.morphAttributes.position;if(A&&A.isGLBufferAttribute){console.error("THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new y,1/0);return}if(A){let e=this.boundingSphere.center;if(UP.setFromBufferAttribute(A),P)for(let s=0,i=P.length;s<i;s++){let v=P[s];Rn.setFromBufferAttribute(v),this.morphTargetsRelative?(uP.addVectors(UP.min,Rn.min),UP.expandByPoint(uP),uP.addVectors(UP.max,Rn.max),UP.expandByPoint(uP)):(UP.expandByPoint(Rn.min),UP.expandByPoint(Rn.max))}UP.getCenter(e);let t=0;for(let s=0,i=A.count;s<i;s++)uP.fromBufferAttribute(A,s),t=Math.max(t,e.distanceToSquared(uP));if(P)for(let s=0,i=P.length;s<i;s++){let v=P[s],o=this.morphTargetsRelative;for(let r=0,D=v.count;r<D;r++)uP.fromBufferAttribute(v,r),o&&(_t.fromBufferAttribute(A,r),uP.add(_t)),t=Math.max(t,e.distanceToSquared(uP))}this.boundingSphere.radius=Math.sqrt(t),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let A=this.index,P=this.attributes;if(A===null||P.position===void 0||P.normal===void 0||P.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let e=P.position,t=P.normal,s=P.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new fP(new Float32Array(4*e.count),4));let i=this.getAttribute("tangent"),v=[],o=[];for(let x=0;x<e.count;x++)v[x]=new y,o[x]=new y;let r=new y,D=new y,z=new y,c=new bA,g=new bA,B=new bA,f=new y,T=new y;function a(x,h,l){r.fromBufferAttribute(e,x),D.fromBufferAttribute(e,h),z.fromBufferAttribute(e,l),c.fromBufferAttribute(s,x),g.fromBufferAttribute(s,h),B.fromBufferAttribute(s,l),D.sub(r),z.sub(r),g.sub(c),B.sub(c);let p=1/(g.x*B.y-B.x*g.y);isFinite(p)&&(f.copy(D).multiplyScalar(B.y).addScaledVector(z,-g.y).multiplyScalar(p),T.copy(z).multiplyScalar(g.x).addScaledVector(D,-B.x).multiplyScalar(p),v[x].add(f),v[h].add(f),v[l].add(f),o[x].add(T),o[h].add(T),o[l].add(T))}let m=this.groups;m.length===0&&(m=[{start:0,count:A.count}]);for(let x=0,h=m.length;x<h;++x){let l=m[x],p=l.start,k=l.count;for(let F=p,Z=p+k;F<Z;F+=3)a(A.getX(F+0),A.getX(F+1),A.getX(F+2))}let u=new y,j=new y,d=new y,Q=new y;function Y(x){d.fromBufferAttribute(t,x),Q.copy(d);let h=v[x];u.copy(h),u.sub(d.multiplyScalar(d.dot(h))).normalize(),j.crossVectors(Q,h);let p=j.dot(o[x])<0?-1:1;i.setXYZW(x,u.x,u.y,u.z,p)}for(let x=0,h=m.length;x<h;++x){let l=m[x],p=l.start,k=l.count;for(let F=p,Z=p+k;F<Z;F+=3)Y(A.getX(F+0)),Y(A.getX(F+1)),Y(A.getX(F+2))}}computeVertexNormals(){let A=this.index,P=this.getAttribute("position");if(P!==void 0){let e=this.getAttribute("normal");if(e===void 0)e=new fP(new Float32Array(P.count*3),3),this.setAttribute("normal",e);else for(let c=0,g=e.count;c<g;c++)e.setXYZ(c,0,0,0);let t=new y,s=new y,i=new y,v=new y,o=new y,r=new y,D=new y,z=new y;if(A)for(let c=0,g=A.count;c<g;c+=3){let B=A.getX(c+0),f=A.getX(c+1),T=A.getX(c+2);t.fromBufferAttribute(P,B),s.fromBufferAttribute(P,f),i.fromBufferAttribute(P,T),D.subVectors(i,s),z.subVectors(t,s),D.cross(z),v.fromBufferAttribute(e,B),o.fromBufferAttribute(e,f),r.fromBufferAttribute(e,T),v.add(D),o.add(D),r.add(D),e.setXYZ(B,v.x,v.y,v.z),e.setXYZ(f,o.x,o.y,o.z),e.setXYZ(T,r.x,r.y,r.z)}else for(let c=0,g=P.count;c<g;c+=3)t.fromBufferAttribute(P,c+0),s.fromBufferAttribute(P,c+1),i.fromBufferAttribute(P,c+2),D.subVectors(i,s),z.subVectors(t,s),D.cross(z),e.setXYZ(c+0,D.x,D.y,D.z),e.setXYZ(c+1,D.x,D.y,D.z),e.setXYZ(c+2,D.x,D.y,D.z);this.normalizeNormals(),e.needsUpdate=!0}}normalizeNormals(){let A=this.attributes.normal;for(let P=0,e=A.count;P<e;P++)uP.fromBufferAttribute(A,P),uP.normalize(),A.setXYZ(P,uP.x,uP.y,uP.z)}toNonIndexed(){function A(v,o){let r=v.array,D=v.itemSize,z=v.normalized,c=new r.constructor(o.length*D),g=0,B=0;for(let f=0,T=o.length;f<T;f++){v.isInterleavedBufferAttribute?g=o[f]*v.data.stride+v.offset:g=o[f]*D;for(let a=0;a<D;a++)c[B++]=r[g++]}return new fP(c,D,z)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let P=new n,e=this.index.array,t=this.attributes;for(let v in t){let o=t[v],r=A(o,e);P.setAttribute(v,r)}let s=this.morphAttributes;for(let v in s){let o=[],r=s[v];for(let D=0,z=r.length;D<z;D++){let c=r[D],g=A(c,e);o.push(g)}P.morphAttributes[v]=o}P.morphTargetsRelative=this.morphTargetsRelative;let i=this.groups;for(let v=0,o=i.length;v<o;v++){let r=i[v];P.addGroup(r.start,r.count,r.materialIndex)}return P}toJSON(){let A={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(A.uuid=this.uuid,A.type=this.type,this.name!==""&&(A.name=this.name),Object.keys(this.userData).length>0&&(A.userData=this.userData),this.parameters!==void 0){let o=this.parameters;for(let r in o)o[r]!==void 0&&(A[r]=o[r]);return A}A.data={attributes:{}};let P=this.index;P!==null&&(A.data.index={type:P.array.constructor.name,array:Array.prototype.slice.call(P.array)});let e=this.attributes;for(let o in e){let r=e[o];A.data.attributes[o]=r.toJSON(A.data)}let t={},s=!1;for(let o in this.morphAttributes){let r=this.morphAttributes[o],D=[];for(let z=0,c=r.length;z<c;z++){let g=r[z];D.push(g.toJSON(A.data))}D.length>0&&(t[o]=D,s=!0)}s&&(A.data.morphAttributes=t,A.data.morphTargetsRelative=this.morphTargetsRelative);let i=this.groups;i.length>0&&(A.data.groups=JSON.parse(JSON.stringify(i)));let v=this.boundingSphere;return v!==null&&(A.data.boundingSphere=v.toJSON()),A}clone(){return new this.constructor().copy(this)}copy(A){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let P={};this.name=A.name;let e=A.index;e!==null&&this.setIndex(e.clone());let t=A.attributes;for(let r in t){let D=t[r];this.setAttribute(r,D.clone(P))}let s=A.morphAttributes;for(let r in s){let D=[],z=s[r];for(let c=0,g=z.length;c<g;c++)D.push(z[c].clone(P));this.morphAttributes[r]=D}this.morphTargetsRelative=A.morphTargetsRelative;let i=A.groups;for(let r=0,D=i.length;r<D;r++){let z=i[r];this.addGroup(z.start,z.count,z.materialIndex)}let v=A.boundingBox;v!==null&&(this.boundingBox=v.clone());let o=A.boundingSphere;return o!==null&&(this.boundingSphere=o.clone()),this.drawRange.start=A.drawRange.start,this.drawRange.count=A.drawRange.count,this.userData=A.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},uD=new yA,ft=new Mt,$s=new FP,mD=new y,Ai=new y,Pi=new y,ei=new y,cr=new y,ti=new y,MD=new y,ni=new y,eP=class extends nP{constructor(A=new pP,P=new De){super(),this.isMesh=!0,this.type="Mesh",this.geometry=A,this.material=P,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(A,P){return super.copy(A,P),A.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=A.morphTargetInfluences.slice()),A.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},A.morphTargetDictionary)),this.material=Array.isArray(A.material)?A.material.slice():A.material,this.geometry=A.geometry,this}updateMorphTargets(){let P=this.geometry.morphAttributes,e=Object.keys(P);if(e.length>0){let t=P[e[0]];if(t!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,i=t.length;s<i;s++){let v=t[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[v]=s}}}}getVertexPosition(A,P){let e=this.geometry,t=e.attributes.position,s=e.morphAttributes.position,i=e.morphTargetsRelative;P.fromBufferAttribute(t,A);let v=this.morphTargetInfluences;if(s&&v){ti.set(0,0,0);for(let o=0,r=s.length;o<r;o++){let D=v[o],z=s[o];D!==0&&(cr.fromBufferAttribute(z,A),i?ti.addScaledVector(cr,D):ti.addScaledVector(cr.sub(P),D))}P.add(ti)}return P}raycast(A,P){let e=this.geometry,t=this.material,s=this.matrixWorld;t!==void 0&&(e.boundingSphere===null&&e.computeBoundingSphere(),$s.copy(e.boundingSphere),$s.applyMatrix4(s),ft.copy(A.ray).recast(A.near),!($s.containsPoint(ft.origin)===!1&&(ft.intersectSphere($s,mD)===null||ft.origin.distanceToSquared(mD)>(A.far-A.near)**2))&&(uD.copy(s).invert(),ft.copy(A.ray).applyMatrix4(uD),!(e.boundingBox!==null&&ft.intersectsBox(e.boundingBox)===!1)&&this._computeIntersections(A,P,ft)))}_computeIntersections(A,P,e){let t,s=this.geometry,i=this.material,v=s.index,o=s.attributes.position,r=s.attributes.uv,D=s.attributes.uv1,z=s.attributes.normal,c=s.groups,g=s.drawRange;if(v!==null)if(Array.isArray(i))for(let B=0,f=c.length;B<f;B++){let T=c[B],a=i[T.materialIndex],m=Math.max(T.start,g.start),u=Math.min(v.count,Math.min(T.start+T.count,g.start+g.count));for(let j=m,d=u;j<d;j+=3){let Q=v.getX(j),Y=v.getX(j+1),x=v.getX(j+2);t=si(this,a,A,e,r,D,z,Q,Y,x),t&&(t.faceIndex=Math.floor(j/3),t.face.materialIndex=T.materialIndex,P.push(t))}}else{let B=Math.max(0,g.start),f=Math.min(v.count,g.start+g.count);for(let T=B,a=f;T<a;T+=3){let m=v.getX(T),u=v.getX(T+1),j=v.getX(T+2);t=si(this,i,A,e,r,D,z,m,u,j),t&&(t.faceIndex=Math.floor(T/3),P.push(t))}}else if(o!==void 0)if(Array.isArray(i))for(let B=0,f=c.length;B<f;B++){let T=c[B],a=i[T.materialIndex],m=Math.max(T.start,g.start),u=Math.min(o.count,Math.min(T.start+T.count,g.start+g.count));for(let j=m,d=u;j<d;j+=3){let Q=j,Y=j+1,x=j+2;t=si(this,a,A,e,r,D,z,Q,Y,x),t&&(t.faceIndex=Math.floor(j/3),t.face.materialIndex=T.materialIndex,P.push(t))}}else{let B=Math.max(0,g.start),f=Math.min(o.count,g.start+g.count);for(let T=B,a=f;T<a;T+=3){let m=T,u=T+1,j=T+2;t=si(this,i,A,e,r,D,z,m,u,j),t&&(t.faceIndex=Math.floor(T/3),P.push(t))}}}};function Bz(n,A,P,e,t,s,i,v){let o;if(A.side===HP?o=e.intersectTriangle(i,s,t,!0,v):o=e.intersectTriangle(t,s,i,A.side===re,v),o===null)return null;ni.copy(v),ni.applyMatrix4(n.matrixWorld);let r=P.ray.origin.distanceTo(ni);return r<P.near||r>P.far?null:{distance:r,point:ni.clone(),object:n}}function si(n,A,P,e,t,s,i,v,o,r){n.getVertexPosition(v,Ai),n.getVertexPosition(o,Pi),n.getVertexPosition(r,ei);let D=Bz(n,A,P,e,Ai,Pi,ei,MD);if(D){let z=new y;Ce.getBarycoord(MD,Ai,Pi,ei,z),t&&(D.uv=Ce.getInterpolatedAttribute(t,v,o,r,z,new bA)),s&&(D.uv1=Ce.getInterpolatedAttribute(s,v,o,r,z,new bA)),i&&(D.normal=Ce.getInterpolatedAttribute(i,v,o,r,z,new y),D.normal.dot(e.direction)>0&&D.normal.multiplyScalar(-1));let c={a:v,b:o,c:r,normal:new y,materialIndex:0};Ce.getNormal(Ai,Pi,ei,c.normal),D.face=c,D.barycoord=z}return D}var gn=class n extends pP{constructor(A=1,P=1,e=1,t=1,s=1,i=1){super(),this.type="BoxGeometry",this.parameters={width:A,height:P,depth:e,widthSegments:t,heightSegments:s,depthSegments:i};let v=this;t=Math.floor(t),s=Math.floor(s),i=Math.floor(i);let o=[],r=[],D=[],z=[],c=0,g=0;B("z","y","x",-1,-1,e,P,A,i,s,0),B("z","y","x",1,-1,e,P,-A,i,s,1),B("x","z","y",1,1,A,e,P,t,i,2),B("x","z","y",1,-1,A,e,-P,t,i,3),B("x","y","z",1,-1,A,P,e,t,s,4),B("x","y","z",-1,-1,A,P,-e,t,s,5),this.setIndex(o),this.setAttribute("position",new wP(r,3)),this.setAttribute("normal",new wP(D,3)),this.setAttribute("uv",new wP(z,2));function B(f,T,a,m,u,j,d,Q,Y,x,h){let l=j/Y,p=d/x,k=j/2,F=d/2,Z=Q/2,S=Y+1,R=x+1,PA=0,N=0,sA=new y;for(let oA=0;oA<R;oA++){let hA=oA*p-F;for(let CA=0;CA<S;CA++){let AP=CA*l-k;sA[f]=AP*m,sA[T]=hA*u,sA[a]=Z,r.push(sA.x,sA.y,sA.z),sA[f]=0,sA[T]=0,sA[a]=Q>0?1:-1,D.push(sA.x,sA.y,sA.z),z.push(CA/Y),z.push(1-oA/x),PA+=1}}for(let oA=0;oA<x;oA++)for(let hA=0;hA<Y;hA++){let CA=c+hA+S*oA,AP=c+hA+S*(oA+1),sP=c+(hA+1)+S*(oA+1),UA=c+(hA+1)+S*oA;o.push(CA,AP,UA),o.push(AP,sP,UA),N+=6}v.addGroup(g,N,h),g+=N,c+=PA}}copy(A){return super.copy(A),this.parameters=Object.assign({},A.parameters),this}static fromJSON(A){return new n(A.width,A.height,A.depth,A.widthSegments,A.heightSegments,A.depthSegments)}};function Lt(n){let A={};for(let P in n){A[P]={};for(let e in n[P]){let t=n[P][e];t&&(t.isColor||t.isMatrix3||t.isMatrix4||t.isVector2||t.isVector3||t.isVector4||t.isTexture||t.isQuaternion)?t.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),A[P][e]=null):A[P][e]=t.clone():Array.isArray(t)?A[P][e]=t.slice():A[P][e]=t}}return A}function xP(n){let A={};for(let P=0;P<n.length;P++){let e=Lt(n[P]);for(let t in e)A[t]=e[t]}return A}function fz(n){let A=[];for(let P=0;P<n.length;P++)A.push(n[P].clone());return A}function _r(n){let A=n.getRenderTarget();return A===null?n.outputColorSpace:A.isXRRenderTarget===!0?A.texture.colorSpace:ZA.workingColorSpace}var H9={clone:Lt,merge:xP},wz=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,jz=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,VP=class extends kP{constructor(A){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=wz,this.fragmentShader=jz,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,A!==void 0&&this.setValues(A)}copy(A){return super.copy(A),this.fragmentShader=A.fragmentShader,this.vertexShader=A.vertexShader,this.uniforms=Lt(A.uniforms),this.uniformsGroups=fz(A.uniformsGroups),this.defines=Object.assign({},A.defines),this.wireframe=A.wireframe,this.wireframeLinewidth=A.wireframeLinewidth,this.fog=A.fog,this.lights=A.lights,this.clipping=A.clipping,this.extensions=Object.assign({},A.extensions),this.glslVersion=A.glslVersion,this}toJSON(A){let P=super.toJSON(A);P.glslVersion=this.glslVersion,P.uniforms={};for(let t in this.uniforms){let i=this.uniforms[t].value;i&&i.isTexture?P.uniforms[t]={type:"t",value:i.toJSON(A).uuid}:i&&i.isColor?P.uniforms[t]={type:"c",value:i.getHex()}:i&&i.isVector2?P.uniforms[t]={type:"v2",value:i.toArray()}:i&&i.isVector3?P.uniforms[t]={type:"v3",value:i.toArray()}:i&&i.isVector4?P.uniforms[t]={type:"v4",value:i.toArray()}:i&&i.isMatrix3?P.uniforms[t]={type:"m3",value:i.toArray()}:i&&i.isMatrix4?P.uniforms[t]={type:"m4",value:i.toArray()}:P.uniforms[t]={value:i}}Object.keys(this.defines).length>0&&(P.defines=this.defines),P.vertexShader=this.vertexShader,P.fragmentShader=this.fragmentShader,P.lights=this.lights,P.clipping=this.clipping;let e={};for(let t in this.extensions)this.extensions[t]===!0&&(e[t]=!0);return Object.keys(e).length>0&&(P.extensions=e),P}},is=class extends nP{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new yA,this.projectionMatrix=new yA,this.projectionMatrixInverse=new yA,this.coordinateSystem=ie,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(A,P){return super.copy(A,P),this.matrixWorldInverse.copy(A.matrixWorldInverse),this.projectionMatrix.copy(A.projectionMatrix),this.projectionMatrixInverse.copy(A.projectionMatrixInverse),this.coordinateSystem=A.coordinateSystem,this}getWorldDirection(A){return super.getWorldDirection(A).negate()}updateMatrixWorld(A){super.updateMatrixWorld(A),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(A,P){super.updateWorldMatrix(A,P),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Pt=new y,QD=new bA,dD=new bA,BP=class extends is{constructor(A=50,P=1,e=.1,t=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=A,this.zoom=1,this.near=e,this.far=t,this.focus=10,this.aspect=P,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(A,P){return super.copy(A,P),this.fov=A.fov,this.zoom=A.zoom,this.near=A.near,this.far=A.far,this.focus=A.focus,this.aspect=A.aspect,this.view=A.view===null?null:Object.assign({},A.view),this.filmGauge=A.filmGauge,this.filmOffset=A.filmOffset,this}setFocalLength(A){let P=.5*this.getFilmHeight()/A;this.fov=mt*2*Math.atan(P),this.updateProjectionMatrix()}getFocalLength(){let A=Math.tan(_n*.5*this.fov);return .5*this.getFilmHeight()/A}getEffectiveFOV(){return mt*2*Math.atan(Math.tan(_n*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(A,P,e){Pt.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),P.set(Pt.x,Pt.y).multiplyScalar(-A/Pt.z),Pt.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Pt.x,Pt.y).multiplyScalar(-A/Pt.z)}getViewSize(A,P){return this.getViewBounds(A,QD,dD),P.subVectors(dD,QD)}setViewOffset(A,P,e,t,s,i){this.aspect=A/P,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=A,this.view.fullHeight=P,this.view.offsetX=e,this.view.offsetY=t,this.view.width=s,this.view.height=i,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let A=this.near,P=A*Math.tan(_n*.5*this.fov)/this.zoom,e=2*P,t=this.aspect*e,s=-.5*t,i=this.view;if(this.view!==null&&this.view.enabled){let o=i.fullWidth,r=i.fullHeight;s+=i.offsetX*t/o,P-=i.offsetY*e/r,t*=i.width/o,e*=i.height/r}let v=this.filmOffset;v!==0&&(s+=A*v/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+t,P,P-e,A,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(A){let P=super.toJSON(A);return P.object.fov=this.fov,P.object.zoom=this.zoom,P.object.near=this.near,P.object.far=this.far,P.object.focus=this.focus,P.object.aspect=this.aspect,this.view!==null&&(P.object.view=Object.assign({},this.view)),P.object.filmGauge=this.filmGauge,P.object.filmOffset=this.filmOffset,P}},$t=-90,An=1,mi=class extends nP{constructor(A,P,e){super(),this.type="CubeCamera",this.renderTarget=e,this.coordinateSystem=null,this.activeMipmapLevel=0;let t=new BP($t,An,A,P);t.layers=this.layers,this.add(t);let s=new BP($t,An,A,P);s.layers=this.layers,this.add(s);let i=new BP($t,An,A,P);i.layers=this.layers,this.add(i);let v=new BP($t,An,A,P);v.layers=this.layers,this.add(v);let o=new BP($t,An,A,P);o.layers=this.layers,this.add(o);let r=new BP($t,An,A,P);r.layers=this.layers,this.add(r)}updateCoordinateSystem(){let A=this.coordinateSystem,P=this.children.concat(),[e,t,s,i,v,o]=P;for(let r of P)this.remove(r);if(A===ie)e.up.set(0,1,0),e.lookAt(1,0,0),t.up.set(0,1,0),t.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),i.up.set(0,0,1),i.lookAt(0,-1,0),v.up.set(0,1,0),v.lookAt(0,0,1),o.up.set(0,1,0),o.lookAt(0,0,-1);else if(A===Ps)e.up.set(0,-1,0),e.lookAt(-1,0,0),t.up.set(0,-1,0),t.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),i.up.set(0,0,-1),i.lookAt(0,-1,0),v.up.set(0,-1,0),v.lookAt(0,0,1),o.up.set(0,-1,0),o.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+A);for(let r of P)this.add(r),r.updateMatrixWorld()}update(A,P){this.parent===null&&this.updateMatrixWorld();let{renderTarget:e,activeMipmapLevel:t}=this;this.coordinateSystem!==A.coordinateSystem&&(this.coordinateSystem=A.coordinateSystem,this.updateCoordinateSystem());let[s,i,v,o,r,D]=this.children,z=A.getRenderTarget(),c=A.getActiveCubeFace(),g=A.getActiveMipmapLevel(),B=A.xr.enabled;A.xr.enabled=!1;let f=e.texture.generateMipmaps;e.texture.generateMipmaps=!1,A.setRenderTarget(e,0,t),A.render(P,s),A.setRenderTarget(e,1,t),A.render(P,i),A.setRenderTarget(e,2,t),A.render(P,v),A.setRenderTarget(e,3,t),A.render(P,o),A.setRenderTarget(e,4,t),A.render(P,r),e.texture.generateMipmaps=f,A.setRenderTarget(e,5,t),A.render(P,D),A.setRenderTarget(z,c,g),A.xr.enabled=B,e.texture.needsPMREMUpdate=!0}},vs=class extends jP{constructor(A=[],P=yt,e,t,s,i,v,o,r,D){super(A,P,e,t,s,i,v,o,r,D),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(A){this.image=A}},Mi=class extends we{constructor(A=1,P={}){super(A,A,P),this.isWebGLCubeRenderTarget=!0;let e={width:A,height:A,depth:1},t=[e,e,e,e,e,e];this.texture=new vs(t),this._setTextureOptions(P),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(A,P){this.texture.type=P.type,this.texture.colorSpace=P.colorSpace,this.texture.generateMipmaps=P.generateMipmaps,this.texture.minFilter=P.minFilter,this.texture.magFilter=P.magFilter;let e={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},t=new gn(5,5,5),s=new VP({name:"CubemapFromEquirect",uniforms:Lt(e.uniforms),vertexShader:e.vertexShader,fragmentShader:e.fragmentShader,side:HP,blending:Se});s.uniforms.tEquirect.value=P;let i=new eP(t,s),v=P.minFilter;return P.minFilter===ze&&(P.minFilter=IP),new mi(1,10,this).update(A,i),P.minFilter=v,i.geometry.dispose(),i.material.dispose(),this}clear(A,P=!0,e=!0,t=!0){let s=A.getRenderTarget();for(let i=0;i<6;i++)A.setRenderTarget(this,i),A.clear(P,e,t);A.setRenderTarget(s)}},mP=class extends nP{constructor(){super(),this.isGroup=!0,this.type="Group"}},Ez={type:"move"},Tn=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new mP,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new mP,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new y,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new y),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new mP,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new y,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new y),this._grip}dispatchEvent(A){return this._targetRay!==null&&this._targetRay.dispatchEvent(A),this._grip!==null&&this._grip.dispatchEvent(A),this._hand!==null&&this._hand.dispatchEvent(A),this}connect(A){if(A&&A.hand){let P=this._hand;if(P)for(let e of A.hand.values())this._getHandJoint(P,e)}return this.dispatchEvent({type:"connected",data:A}),this}disconnect(A){return this.dispatchEvent({type:"disconnected",data:A}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(A,P,e){let t=null,s=null,i=null,v=this._targetRay,o=this._grip,r=this._hand;if(A&&P.session.visibilityState!=="visible-blurred"){if(r&&A.hand){i=!0;for(let f of A.hand.values()){let T=P.getJointPose(f,e),a=this._getHandJoint(r,f);T!==null&&(a.matrix.fromArray(T.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,a.jointRadius=T.radius),a.visible=T!==null}let D=r.joints["index-finger-tip"],z=r.joints["thumb-tip"],c=D.position.distanceTo(z.position),g=.02,B=.005;r.inputState.pinching&&c>g+B?(r.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:A.handedness,target:this})):!r.inputState.pinching&&c<=g-B&&(r.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:A.handedness,target:this}))}else o!==null&&A.gripSpace&&(s=P.getPose(A.gripSpace,e),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1));v!==null&&(t=P.getPose(A.targetRaySpace,e),t===null&&s!==null&&(t=s),t!==null&&(v.matrix.fromArray(t.transform.matrix),v.matrix.decompose(v.position,v.rotation,v.scale),v.matrixWorldNeedsUpdate=!0,t.linearVelocity?(v.hasLinearVelocity=!0,v.linearVelocity.copy(t.linearVelocity)):v.hasLinearVelocity=!1,t.angularVelocity?(v.hasAngularVelocity=!0,v.angularVelocity.copy(t.angularVelocity)):v.hasAngularVelocity=!1,this.dispatchEvent(Ez)))}return v!==null&&(v.visible=t!==null),o!==null&&(o.visible=s!==null),r!==null&&(r.visible=i!==null),this}_getHandJoint(A,P){if(A.joints[P.jointName]===void 0){let e=new mP;e.matrixAutoUpdate=!1,e.visible=!1,A.joints[P.jointName]=e,A.add(e)}return A.joints[P.jointName]}},rs=class n{constructor(A,P=25e-5){this.isFogExp2=!0,this.name="",this.color=new mA(A),this.density=P}clone(){return new n(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var os=class extends nP{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new oe,this.environmentIntensity=1,this.environmentRotation=new oe,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(A,P){return super.copy(A,P),A.background!==null&&(this.background=A.background.clone()),A.environment!==null&&(this.environment=A.environment.clone()),A.fog!==null&&(this.fog=A.fog.clone()),this.backgroundBlurriness=A.backgroundBlurriness,this.backgroundIntensity=A.backgroundIntensity,this.backgroundRotation.copy(A.backgroundRotation),this.environmentIntensity=A.environmentIntensity,this.environmentRotation.copy(A.environmentRotation),A.overrideMaterial!==null&&(this.overrideMaterial=A.overrideMaterial.clone()),this.matrixAutoUpdate=A.matrixAutoUpdate,this}toJSON(A){let P=super.toJSON(A);return this.fog!==null&&(P.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(P.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(P.object.backgroundIntensity=this.backgroundIntensity),P.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(P.object.environmentIntensity=this.environmentIntensity),P.object.environmentRotation=this.environmentRotation.toArray(),P}},Qt=class{constructor(A,P){this.isInterleavedBuffer=!0,this.array=A,this.stride=P,this.count=A!==void 0?A.length/P:0,this.usage=Ei,this.updateRanges=[],this.version=0,this.uuid=ve()}onUploadCallback(){}set needsUpdate(A){A===!0&&this.version++}setUsage(A){return this.usage=A,this}addUpdateRange(A,P){this.updateRanges.push({start:A,count:P})}clearUpdateRanges(){this.updateRanges.length=0}copy(A){return this.array=new A.array.constructor(A.array),this.count=A.count,this.stride=A.stride,this.usage=A.usage,this}copyAt(A,P,e){A*=this.stride,e*=P.stride;for(let t=0,s=this.stride;t<s;t++)this.array[A+t]=P.array[e+t];return this}set(A,P=0){return this.array.set(A,P),this}clone(A){A.arrayBuffers===void 0&&(A.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ve()),A.arrayBuffers[this.array.buffer._uuid]===void 0&&(A.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let P=new this.array.constructor(A.arrayBuffers[this.array.buffer._uuid]),e=new this.constructor(P,this.stride);return e.setUsage(this.usage),e}onUpload(A){return this.onUploadCallback=A,this}toJSON(A){return A.arrayBuffers===void 0&&(A.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ve()),A.arrayBuffers[this.array.buffer._uuid]===void 0&&(A.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},LP=new y,nt=class n{constructor(A,P,e,t=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=A,this.itemSize=P,this.offset=e,this.normalized=t}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(A){this.data.needsUpdate=A}applyMatrix4(A){for(let P=0,e=this.data.count;P<e;P++)LP.fromBufferAttribute(this,P),LP.applyMatrix4(A),this.setXYZ(P,LP.x,LP.y,LP.z);return this}applyNormalMatrix(A){for(let P=0,e=this.count;P<e;P++)LP.fromBufferAttribute(this,P),LP.applyNormalMatrix(A),this.setXYZ(P,LP.x,LP.y,LP.z);return this}transformDirection(A){for(let P=0,e=this.count;P<e;P++)LP.fromBufferAttribute(this,P),LP.transformDirection(A),this.setXYZ(P,LP.x,LP.y,LP.z);return this}getComponent(A,P){let e=this.array[A*this.data.stride+this.offset+P];return this.normalized&&(e=se(e,this.array)),e}setComponent(A,P,e){return this.normalized&&(e=VA(e,this.array)),this.data.array[A*this.data.stride+this.offset+P]=e,this}setX(A,P){return this.normalized&&(P=VA(P,this.array)),this.data.array[A*this.data.stride+this.offset]=P,this}setY(A,P){return this.normalized&&(P=VA(P,this.array)),this.data.array[A*this.data.stride+this.offset+1]=P,this}setZ(A,P){return this.normalized&&(P=VA(P,this.array)),this.data.array[A*this.data.stride+this.offset+2]=P,this}setW(A,P){return this.normalized&&(P=VA(P,this.array)),this.data.array[A*this.data.stride+this.offset+3]=P,this}getX(A){let P=this.data.array[A*this.data.stride+this.offset];return this.normalized&&(P=se(P,this.array)),P}getY(A){let P=this.data.array[A*this.data.stride+this.offset+1];return this.normalized&&(P=se(P,this.array)),P}getZ(A){let P=this.data.array[A*this.data.stride+this.offset+2];return this.normalized&&(P=se(P,this.array)),P}getW(A){let P=this.data.array[A*this.data.stride+this.offset+3];return this.normalized&&(P=se(P,this.array)),P}setXY(A,P,e){return A=A*this.data.stride+this.offset,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array)),this.data.array[A+0]=P,this.data.array[A+1]=e,this}setXYZ(A,P,e,t){return A=A*this.data.stride+this.offset,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array),t=VA(t,this.array)),this.data.array[A+0]=P,this.data.array[A+1]=e,this.data.array[A+2]=t,this}setXYZW(A,P,e,t,s){return A=A*this.data.stride+this.offset,this.normalized&&(P=VA(P,this.array),e=VA(e,this.array),t=VA(t,this.array),s=VA(s,this.array)),this.data.array[A+0]=P,this.data.array[A+1]=e,this.data.array[A+2]=t,this.data.array[A+3]=s,this}clone(A){if(A===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let P=[];for(let e=0;e<this.count;e++){let t=e*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)P.push(this.data.array[t+s])}return new fP(new this.array.constructor(P),this.itemSize,this.normalized)}else return A.interleavedBuffers===void 0&&(A.interleavedBuffers={}),A.interleavedBuffers[this.data.uuid]===void 0&&(A.interleavedBuffers[this.data.uuid]=this.data.clone(A)),new n(A.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(A){if(A===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let P=[];for(let e=0;e<this.count;e++){let t=e*this.data.stride+this.offset;for(let s=0;s<this.itemSize;s++)P.push(this.data.array[t+s])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:P,normalized:this.normalized}}else return A.interleavedBuffers===void 0&&(A.interleavedBuffers={}),A.interleavedBuffers[this.data.uuid]===void 0&&(A.interleavedBuffers[this.data.uuid]=this.data.toJSON(A)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}},Bn=class extends kP{constructor(A){super(),this.isSpriteMaterial=!0,this.type="SpriteMaterial",this.color=new mA(16777215),this.map=null,this.alphaMap=null,this.rotation=0,this.sizeAttenuation=!0,this.transparent=!0,this.fog=!0,this.setValues(A)}copy(A){return super.copy(A),this.color.copy(A.color),this.map=A.map,this.alphaMap=A.alphaMap,this.rotation=A.rotation,this.sizeAttenuation=A.sizeAttenuation,this.fog=A.fog,this}},Pn,Wn=new y,en=new y,tn=new y,nn=new bA,Sn=new bA,G9=new yA,ii=new y,Un=new y,vi=new y,bD=new bA,ar=new bA,YD=new bA,Ds=class extends nP{constructor(A=new Bn){if(super(),this.isSprite=!0,this.type="Sprite",Pn===void 0){Pn=new pP;let P=new Float32Array([-.5,-.5,0,0,0,.5,-.5,0,1,0,.5,.5,0,1,1,-.5,.5,0,0,1]),e=new Qt(P,5);Pn.setIndex([0,1,2,0,2,3]),Pn.setAttribute("position",new nt(e,3,0,!1)),Pn.setAttribute("uv",new nt(e,2,3,!1))}this.geometry=Pn,this.material=A,this.center=new bA(.5,.5),this.count=1}raycast(A,P){A.camera===null&&console.error('THREE.Sprite: "Raycaster.camera" needs to be set in order to raycast against sprites.'),en.setFromMatrixScale(this.matrixWorld),G9.copy(A.camera.matrixWorld),this.modelViewMatrix.multiplyMatrices(A.camera.matrixWorldInverse,this.matrixWorld),tn.setFromMatrixPosition(this.modelViewMatrix),A.camera.isPerspectiveCamera&&this.material.sizeAttenuation===!1&&en.multiplyScalar(-tn.z);let e=this.material.rotation,t,s;e!==0&&(s=Math.cos(e),t=Math.sin(e));let i=this.center;ri(ii.set(-.5,-.5,0),tn,i,en,t,s),ri(Un.set(.5,-.5,0),tn,i,en,t,s),ri(vi.set(.5,.5,0),tn,i,en,t,s),bD.set(0,0),ar.set(1,0),YD.set(1,1);let v=A.ray.intersectTriangle(ii,Un,vi,!1,Wn);if(v===null&&(ri(Un.set(-.5,.5,0),tn,i,en,t,s),ar.set(0,1),v=A.ray.intersectTriangle(ii,vi,Un,!1,Wn),v===null))return;let o=A.ray.origin.distanceTo(Wn);o<A.near||o>A.far||P.push({distance:o,point:Wn.clone(),uv:Ce.getInterpolation(Wn,ii,Un,vi,bD,ar,YD,new bA),face:null,object:this})}copy(A,P){return super.copy(A,P),A.center!==void 0&&this.center.copy(A.center),this.material=A.material,this}};function ri(n,A,P,e,t,s){nn.subVectors(n,P).addScalar(.5).multiply(e),t!==void 0?(Sn.x=s*nn.x-t*nn.y,Sn.y=t*nn.x+s*nn.y):Sn.copy(nn),n.copy(A),n.x+=Sn.x,n.y+=Sn.y,n.applyMatrix4(G9)}var pD=new y,yD=new SA,xD=new SA,lz=new y,OD=new yA,oi=new y,gr=new FP,LD=new yA,Tr=new Mt,zs=class extends eP{constructor(A,P){super(A,P),this.isSkinnedMesh=!0,this.type="SkinnedMesh",this.bindMode=lr,this.bindMatrix=new yA,this.bindMatrixInverse=new yA,this.boundingBox=null,this.boundingSphere=null}computeBoundingBox(){let A=this.geometry;this.boundingBox===null&&(this.boundingBox=new JP),this.boundingBox.makeEmpty();let P=A.getAttribute("position");for(let e=0;e<P.count;e++)this.getVertexPosition(e,oi),this.boundingBox.expandByPoint(oi)}computeBoundingSphere(){let A=this.geometry;this.boundingSphere===null&&(this.boundingSphere=new FP),this.boundingSphere.makeEmpty();let P=A.getAttribute("position");for(let e=0;e<P.count;e++)this.getVertexPosition(e,oi),this.boundingSphere.expandByPoint(oi)}copy(A,P){return super.copy(A,P),this.bindMode=A.bindMode,this.bindMatrix.copy(A.bindMatrix),this.bindMatrixInverse.copy(A.bindMatrixInverse),this.skeleton=A.skeleton,A.boundingBox!==null&&(this.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(this.boundingSphere=A.boundingSphere.clone()),this}raycast(A,P){let e=this.material,t=this.matrixWorld;e!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),gr.copy(this.boundingSphere),gr.applyMatrix4(t),A.ray.intersectsSphere(gr)!==!1&&(LD.copy(t).invert(),Tr.copy(A.ray).applyMatrix4(LD),!(this.boundingBox!==null&&Tr.intersectsBox(this.boundingBox)===!1)&&this._computeIntersections(A,P,Tr)))}getVertexPosition(A,P){return super.getVertexPosition(A,P),this.applyBoneTransform(A,P),P}bind(A,P){this.skeleton=A,P===void 0&&(this.updateMatrixWorld(!0),this.skeleton.calculateInverses(),P=this.matrixWorld),this.bindMatrix.copy(P),this.bindMatrixInverse.copy(P).invert()}pose(){this.skeleton.pose()}normalizeSkinWeights(){let A=new SA,P=this.geometry.attributes.skinWeight;for(let e=0,t=P.count;e<t;e++){A.fromBufferAttribute(P,e);let s=1/A.manhattanLength();s!==1/0?A.multiplyScalar(s):A.set(1,0,0,0),P.setXYZW(e,A.x,A.y,A.z,A.w)}}updateMatrixWorld(A){super.updateMatrixWorld(A),this.bindMode===lr?this.bindMatrixInverse.copy(this.matrixWorld).invert():this.bindMode===h9?this.bindMatrixInverse.copy(this.bindMatrix).invert():console.warn("THREE.SkinnedMesh: Unrecognized bindMode: "+this.bindMode)}applyBoneTransform(A,P){let e=this.skeleton,t=this.geometry;yD.fromBufferAttribute(t.attributes.skinIndex,A),xD.fromBufferAttribute(t.attributes.skinWeight,A),pD.copy(P).applyMatrix4(this.bindMatrix),P.set(0,0,0);for(let s=0;s<4;s++){let i=xD.getComponent(s);if(i!==0){let v=yD.getComponent(s);OD.multiplyMatrices(e.bones[v].matrixWorld,e.boneInverses[v]),P.addScaledVector(lz.copy(pD).applyMatrix4(OD),i)}}return P.applyMatrix4(this.bindMatrixInverse)}},fn=class extends nP{constructor(){super(),this.isBone=!0,this.type="Bone"}},cs=class extends jP{constructor(A=null,P=1,e=1,t,s,i,v,o,r=MP,D=MP,z,c){super(null,i,v,o,r,D,t,s,z,c),this.isDataTexture=!0,this.image={data:A,width:P,height:e},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}},ID=new yA,hz=new yA,as=class n{constructor(A=[],P=[]){this.uuid=ve(),this.bones=A.slice(0),this.boneInverses=P,this.boneMatrices=null,this.boneTexture=null,this.init()}init(){let A=this.bones,P=this.boneInverses;if(this.boneMatrices=new Float32Array(A.length*16),P.length===0)this.calculateInverses();else if(A.length!==P.length){console.warn("THREE.Skeleton: Number of inverse bone matrices does not match amount of bones."),this.boneInverses=[];for(let e=0,t=this.bones.length;e<t;e++)this.boneInverses.push(new yA)}}calculateInverses(){this.boneInverses.length=0;for(let A=0,P=this.bones.length;A<P;A++){let e=new yA;this.bones[A]&&e.copy(this.bones[A].matrixWorld).invert(),this.boneInverses.push(e)}}pose(){for(let A=0,P=this.bones.length;A<P;A++){let e=this.bones[A];e&&e.matrixWorld.copy(this.boneInverses[A]).invert()}for(let A=0,P=this.bones.length;A<P;A++){let e=this.bones[A];e&&(e.parent&&e.parent.isBone?(e.matrix.copy(e.parent.matrixWorld).invert(),e.matrix.multiply(e.matrixWorld)):e.matrix.copy(e.matrixWorld),e.matrix.decompose(e.position,e.quaternion,e.scale))}}update(){let A=this.bones,P=this.boneInverses,e=this.boneMatrices,t=this.boneTexture;for(let s=0,i=A.length;s<i;s++){let v=A[s]?A[s].matrixWorld:hz;ID.multiplyMatrices(v,P[s]),ID.toArray(e,s*16)}t!==null&&(t.needsUpdate=!0)}clone(){return new n(this.bones,this.boneInverses)}computeBoneTexture(){let A=Math.sqrt(this.bones.length*4);A=Math.ceil(A/4)*4,A=Math.max(A,4);let P=new Float32Array(A*A*4);P.set(this.boneMatrices);let e=new cs(P,A,A,qP,Ae);return e.needsUpdate=!0,this.boneMatrices=P,this.boneTexture=e,this}getBoneByName(A){for(let P=0,e=this.bones.length;P<e;P++){let t=this.bones[P];if(t.name===A)return t}}dispose(){this.boneTexture!==null&&(this.boneTexture.dispose(),this.boneTexture=null)}fromJSON(A,P){this.uuid=A.uuid;for(let e=0,t=A.bones.length;e<t;e++){let s=A.bones[e],i=P[s];i===void 0&&(console.warn("THREE.Skeleton: No bone found with UUID:",s),i=new fn),this.bones.push(i),this.boneInverses.push(new yA().fromArray(A.boneInverses[e]))}return this.init(),this}toJSON(){let A={metadata:{version:4.7,type:"Skeleton",generator:"Skeleton.toJSON"},bones:[],boneInverses:[]};A.uuid=this.uuid;let P=this.bones,e=this.boneInverses;for(let t=0,s=P.length;t<s;t++){let i=P[t];A.bones.push(i.uuid);let v=e[t];A.boneInverses.push(v.toArray())}return A}},st=class extends fP{constructor(A,P,e,t=1){super(A,P,e),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=t}copy(A){return super.copy(A),this.meshPerAttribute=A.meshPerAttribute,this}toJSON(){let A=super.toJSON();return A.meshPerAttribute=this.meshPerAttribute,A.isInstancedBufferAttribute=!0,A}},sn=new yA,kD=new yA,Di=[],HD=new JP,uz=new yA,Jn=new eP,Vn=new FP,it=class extends eP{constructor(A,P,e){super(A,P),this.isInstancedMesh=!0,this.instanceMatrix=new st(new Float32Array(e*16),16),this.instanceColor=null,this.morphTexture=null,this.count=e,this.boundingBox=null,this.boundingSphere=null;for(let t=0;t<e;t++)this.setMatrixAt(t,uz)}computeBoundingBox(){let A=this.geometry,P=this.count;this.boundingBox===null&&(this.boundingBox=new JP),A.boundingBox===null&&A.computeBoundingBox(),this.boundingBox.makeEmpty();for(let e=0;e<P;e++)this.getMatrixAt(e,sn),HD.copy(A.boundingBox).applyMatrix4(sn),this.boundingBox.union(HD)}computeBoundingSphere(){let A=this.geometry,P=this.count;this.boundingSphere===null&&(this.boundingSphere=new FP),A.boundingSphere===null&&A.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let e=0;e<P;e++)this.getMatrixAt(e,sn),Vn.copy(A.boundingSphere).applyMatrix4(sn),this.boundingSphere.union(Vn)}copy(A,P){return super.copy(A,P),this.instanceMatrix.copy(A.instanceMatrix),A.morphTexture!==null&&(this.morphTexture=A.morphTexture.clone()),A.instanceColor!==null&&(this.instanceColor=A.instanceColor.clone()),this.count=A.count,A.boundingBox!==null&&(this.boundingBox=A.boundingBox.clone()),A.boundingSphere!==null&&(this.boundingSphere=A.boundingSphere.clone()),this}getColorAt(A,P){P.fromArray(this.instanceColor.array,A*3)}getMatrixAt(A,P){P.fromArray(this.instanceMatrix.array,A*16)}getMorphAt(A,P){let e=P.morphTargetInfluences,t=this.morphTexture.source.data.data,s=e.length+1,i=A*s+1;for(let v=0;v<e.length;v++)e[v]=t[i+v]}raycast(A,P){let e=this.matrixWorld,t=this.count;if(Jn.geometry=this.geometry,Jn.material=this.material,Jn.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Vn.copy(this.boundingSphere),Vn.applyMatrix4(e),A.ray.intersectsSphere(Vn)!==!1))for(let s=0;s<t;s++){this.getMatrixAt(s,sn),kD.multiplyMatrices(e,sn),Jn.matrixWorld=kD,Jn.raycast(A,Di);for(let i=0,v=Di.length;i<v;i++){let o=Di[i];o.instanceId=s,o.object=this,P.push(o)}Di.length=0}}setColorAt(A,P){this.instanceColor===null&&(this.instanceColor=new st(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),P.toArray(this.instanceColor.array,A*3)}setMatrixAt(A,P){P.toArray(this.instanceMatrix.array,A*16)}setMorphAt(A,P){let e=P.morphTargetInfluences,t=e.length+1;this.morphTexture===null&&(this.morphTexture=new cs(new Float32Array(t*this.count),t,this.count,$i,Ae));let s=this.morphTexture.source.data.data,i=0;for(let r=0;r<e.length;r++)i+=e[r];let v=this.geometry.morphTargetsRelative?1:1-i,o=t*A;s[o]=v,s.set(e,o+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}},Br=new y,mz=new y,Mz=new IA,Te=class{constructor(A=new y(1,0,0),P=0){this.isPlane=!0,this.normal=A,this.constant=P}set(A,P){return this.normal.copy(A),this.constant=P,this}setComponents(A,P,e,t){return this.normal.set(A,P,e),this.constant=t,this}setFromNormalAndCoplanarPoint(A,P){return this.normal.copy(A),this.constant=-P.dot(this.normal),this}setFromCoplanarPoints(A,P,e){let t=Br.subVectors(e,P).cross(mz.subVectors(A,P)).normalize();return this.setFromNormalAndCoplanarPoint(t,A),this}copy(A){return this.normal.copy(A.normal),this.constant=A.constant,this}normalize(){let A=1/this.normal.length();return this.normal.multiplyScalar(A),this.constant*=A,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(A){return this.normal.dot(A)+this.constant}distanceToSphere(A){return this.distanceToPoint(A.center)-A.radius}projectPoint(A,P){return P.copy(A).addScaledVector(this.normal,-this.distanceToPoint(A))}intersectLine(A,P){let e=A.delta(Br),t=this.normal.dot(e);if(t===0)return this.distanceToPoint(A.start)===0?P.copy(A.start):null;let s=-(A.start.dot(this.normal)+this.constant)/t;return s<0||s>1?null:P.copy(A.start).addScaledVector(e,s)}intersectsLine(A){let P=this.distanceToPoint(A.start),e=this.distanceToPoint(A.end);return P<0&&e>0||e<0&&P>0}intersectsBox(A){return A.intersectsPlane(this)}intersectsSphere(A){return A.intersectsPlane(this)}coplanarPoint(A){return A.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(A,P){let e=P||Mz.getNormalMatrix(A),t=this.coplanarPoint(Br).applyMatrix4(A),s=this.normal.applyMatrix3(e).normalize();return this.constant=-t.dot(s),this}translate(A){return this.constant-=A.dot(this.normal),this}equals(A){return A.normal.equals(this.normal)&&A.constant===this.constant}clone(){return new this.constructor().copy(this)}},wt=new FP,Qz=new bA(.5,.5),zi=new y,wn=class{constructor(A=new Te,P=new Te,e=new Te,t=new Te,s=new Te,i=new Te){this.planes=[A,P,e,t,s,i]}set(A,P,e,t,s,i){let v=this.planes;return v[0].copy(A),v[1].copy(P),v[2].copy(e),v[3].copy(t),v[4].copy(s),v[5].copy(i),this}copy(A){let P=this.planes;for(let e=0;e<6;e++)P[e].copy(A.planes[e]);return this}setFromProjectionMatrix(A,P=ie,e=!1){let t=this.planes,s=A.elements,i=s[0],v=s[1],o=s[2],r=s[3],D=s[4],z=s[5],c=s[6],g=s[7],B=s[8],f=s[9],T=s[10],a=s[11],m=s[12],u=s[13],j=s[14],d=s[15];if(t[0].setComponents(r-i,g-D,a-B,d-m).normalize(),t[1].setComponents(r+i,g+D,a+B,d+m).normalize(),t[2].setComponents(r+v,g+z,a+f,d+u).normalize(),t[3].setComponents(r-v,g-z,a-f,d-u).normalize(),e)t[4].setComponents(o,c,T,j).normalize(),t[5].setComponents(r-o,g-c,a-T,d-j).normalize();else if(t[4].setComponents(r-o,g-c,a-T,d-j).normalize(),P===ie)t[5].setComponents(r+o,g+c,a+T,d+j).normalize();else if(P===Ps)t[5].setComponents(o,c,T,j).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+P);return this}intersectsObject(A){if(A.boundingSphere!==void 0)A.boundingSphere===null&&A.computeBoundingSphere(),wt.copy(A.boundingSphere).applyMatrix4(A.matrixWorld);else{let P=A.geometry;P.boundingSphere===null&&P.computeBoundingSphere(),wt.copy(P.boundingSphere).applyMatrix4(A.matrixWorld)}return this.intersectsSphere(wt)}intersectsSprite(A){wt.center.set(0,0,0);let P=Qz.distanceTo(A.center);return wt.radius=.7071067811865476+P,wt.applyMatrix4(A.matrixWorld),this.intersectsSphere(wt)}intersectsSphere(A){let P=this.planes,e=A.center,t=-A.radius;for(let s=0;s<6;s++)if(P[s].distanceToPoint(e)<t)return!1;return!0}intersectsBox(A){let P=this.planes;for(let e=0;e<6;e++){let t=P[e];if(zi.x=t.normal.x>0?A.max.x:A.min.x,zi.y=t.normal.y>0?A.max.y:A.min.y,zi.z=t.normal.z>0?A.max.z:A.min.z,t.distanceToPoint(zi)<0)return!1}return!0}containsPoint(A){let P=this.planes;for(let e=0;e<6;e++)if(P[e].distanceToPoint(A)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};var jn=class extends kP{constructor(A){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new mA(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(A)}copy(A){return super.copy(A),this.color.copy(A.color),this.map=A.map,this.linewidth=A.linewidth,this.linecap=A.linecap,this.linejoin=A.linejoin,this.fog=A.fog,this}},Qi=new y,di=new y,GD=new yA,qn=new Mt,ci=new FP,fr=new y,CD=new y,dt=class extends nP{constructor(A=new pP,P=new jn){super(),this.isLine=!0,this.type="Line",this.geometry=A,this.material=P,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(A,P){return super.copy(A,P),this.material=Array.isArray(A.material)?A.material.slice():A.material,this.geometry=A.geometry,this}computeLineDistances(){let A=this.geometry;if(A.index===null){let P=A.attributes.position,e=[0];for(let t=1,s=P.count;t<s;t++)Qi.fromBufferAttribute(P,t-1),di.fromBufferAttribute(P,t),e[t]=e[t-1],e[t]+=Qi.distanceTo(di);A.setAttribute("lineDistance",new wP(e,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(A,P){let e=this.geometry,t=this.matrixWorld,s=A.params.Line.threshold,i=e.drawRange;if(e.boundingSphere===null&&e.computeBoundingSphere(),ci.copy(e.boundingSphere),ci.applyMatrix4(t),ci.radius+=s,A.ray.intersectsSphere(ci)===!1)return;GD.copy(t).invert(),qn.copy(A.ray).applyMatrix4(GD);let v=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=v*v,r=this.isLineSegments?2:1,D=e.index,c=e.attributes.position;if(D!==null){let g=Math.max(0,i.start),B=Math.min(D.count,i.start+i.count);for(let f=g,T=B-1;f<T;f+=r){let a=D.getX(f),m=D.getX(f+1),u=ai(this,A,qn,o,a,m,f);u&&P.push(u)}if(this.isLineLoop){let f=D.getX(B-1),T=D.getX(g),a=ai(this,A,qn,o,f,T,B-1);a&&P.push(a)}}else{let g=Math.max(0,i.start),B=Math.min(c.count,i.start+i.count);for(let f=g,T=B-1;f<T;f+=r){let a=ai(this,A,qn,o,f,f+1,f);a&&P.push(a)}if(this.isLineLoop){let f=ai(this,A,qn,o,B-1,g,B-1);f&&P.push(f)}}}updateMorphTargets(){let P=this.geometry.morphAttributes,e=Object.keys(P);if(e.length>0){let t=P[e[0]];if(t!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,i=t.length;s<i;s++){let v=t[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[v]=s}}}}};function ai(n,A,P,e,t,s,i){let v=n.geometry.attributes.position;if(Qi.fromBufferAttribute(v,t),di.fromBufferAttribute(v,s),P.distanceSqToSegment(Qi,di,fr,CD)>e)return;fr.applyMatrix4(n.matrixWorld);let r=A.ray.origin.distanceTo(fr);if(!(r<A.near||r>A.far))return{distance:r,point:CD.clone().applyMatrix4(n.matrixWorld),index:i,face:null,faceIndex:null,barycoord:null,object:n}}var FD=new y,ND=new y,gs=class extends dt{constructor(A,P){super(A,P),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let A=this.geometry;if(A.index===null){let P=A.attributes.position,e=[];for(let t=0,s=P.count;t<s;t+=2)FD.fromBufferAttribute(P,t),ND.fromBufferAttribute(P,t+1),e[t]=t===0?0:e[t-1],e[t+1]=e[t]+FD.distanceTo(ND);A.setAttribute("lineDistance",new wP(e,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}},Ts=class extends dt{constructor(A,P){super(A,P),this.isLineLoop=!0,this.type="LineLoop"}},En=class extends kP{constructor(A){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new mA(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(A)}copy(A){return super.copy(A),this.color.copy(A.color),this.map=A.map,this.alphaMap=A.alphaMap,this.size=A.size,this.sizeAttenuation=A.sizeAttenuation,this.fog=A.fog,this}},XD=new yA,Qr=new Mt,gi=new FP,Ti=new y,Bs=class extends nP{constructor(A=new pP,P=new En){super(),this.isPoints=!0,this.type="Points",this.geometry=A,this.material=P,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(A,P){return super.copy(A,P),this.material=Array.isArray(A.material)?A.material.slice():A.material,this.geometry=A.geometry,this}raycast(A,P){let e=this.geometry,t=this.matrixWorld,s=A.params.Points.threshold,i=e.drawRange;if(e.boundingSphere===null&&e.computeBoundingSphere(),gi.copy(e.boundingSphere),gi.applyMatrix4(t),gi.radius+=s,A.ray.intersectsSphere(gi)===!1)return;XD.copy(t).invert(),Qr.copy(A.ray).applyMatrix4(XD);let v=s/((this.scale.x+this.scale.y+this.scale.z)/3),o=v*v,r=e.index,z=e.attributes.position;if(r!==null){let c=Math.max(0,i.start),g=Math.min(r.count,i.start+i.count);for(let B=c,f=g;B<f;B++){let T=r.getX(B);Ti.fromBufferAttribute(z,T),ZD(Ti,T,o,t,A,P,this)}}else{let c=Math.max(0,i.start),g=Math.min(z.count,i.start+i.count);for(let B=c,f=g;B<f;B++)Ti.fromBufferAttribute(z,B),ZD(Ti,B,o,t,A,P,this)}}updateMorphTargets(){let P=this.geometry.morphAttributes,e=Object.keys(P);if(e.length>0){let t=P[e[0]];if(t!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,i=t.length;s<i;s++){let v=t[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[v]=s}}}}};function ZD(n,A,P,e,t,s,i){let v=Qr.distanceSqToPoint(n);if(v<P){let o=new y;Qr.closestPointToPoint(n,o),o.applyMatrix4(e);let r=t.ray.origin.distanceTo(o);if(r<t.near||r>t.far)return;s.push({distance:r,distanceToRay:Math.sqrt(v),point:o,index:A,face:null,faceIndex:null,barycoord:null,object:i})}}var fs=class extends jP{constructor(A,P,e,t,s,i,v,o,r){super(A,P,e,t,s,i,v,o,r),this.isCanvasTexture=!0,this.needsUpdate=!0}},ws=class extends jP{constructor(A,P,e=rt,t,s,i,v=MP,o=MP,r,D=Dn,z=1){if(D!==Dn&&D!==bn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");let c={width:A,height:P,depth:z};super(c,t,s,i,v,o,D,e,r),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(A){return super.copy(A),this.source=new an(Object.assign({},A.image)),this.compareFunction=A.compareFunction,this}toJSON(A){let P=super.toJSON(A);return this.compareFunction!==null&&(P.compareFunction=this.compareFunction),P}},js=class extends jP{constructor(A=null){super(),this.sourceTexture=A,this.isExternalTexture=!0}copy(A){return super.copy(A),this.sourceTexture=A.sourceTexture,this}};var je=class n extends pP{constructor(A=1,P=1,e=1,t=32,s=1,i=!1,v=0,o=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:A,radiusBottom:P,height:e,radialSegments:t,heightSegments:s,openEnded:i,thetaStart:v,thetaLength:o};let r=this;t=Math.floor(t),s=Math.floor(s);let D=[],z=[],c=[],g=[],B=0,f=[],T=e/2,a=0;m(),i===!1&&(A>0&&u(!0),P>0&&u(!1)),this.setIndex(D),this.setAttribute("position",new wP(z,3)),this.setAttribute("normal",new wP(c,3)),this.setAttribute("uv",new wP(g,2));function m(){let j=new y,d=new y,Q=0,Y=(P-A)/e;for(let x=0;x<=s;x++){let h=[],l=x/s,p=l*(P-A)+A;for(let k=0;k<=t;k++){let F=k/t,Z=F*o+v,S=Math.sin(Z),R=Math.cos(Z);d.x=p*S,d.y=-l*e+T,d.z=p*R,z.push(d.x,d.y,d.z),j.set(S,Y,R).normalize(),c.push(j.x,j.y,j.z),g.push(F,1-l),h.push(B++)}f.push(h)}for(let x=0;x<t;x++)for(let h=0;h<s;h++){let l=f[h][x],p=f[h+1][x],k=f[h+1][x+1],F=f[h][x+1];(A>0||h!==0)&&(D.push(l,p,F),Q+=3),(P>0||h!==s-1)&&(D.push(p,k,F),Q+=3)}r.addGroup(a,Q,0),a+=Q}function u(j){let d=B,Q=new bA,Y=new y,x=0,h=j===!0?A:P,l=j===!0?1:-1;for(let k=1;k<=t;k++)z.push(0,T*l,0),c.push(0,l,0),g.push(.5,.5),B++;let p=B;for(let k=0;k<=t;k++){let Z=k/t*o+v,S=Math.cos(Z),R=Math.sin(Z);Y.x=h*R,Y.y=T*l,Y.z=h*S,z.push(Y.x,Y.y,Y.z),c.push(0,l,0),Q.x=S*.5+.5,Q.y=R*.5*l+.5,g.push(Q.x,Q.y),B++}for(let k=0;k<t;k++){let F=d+k,Z=p+k;j===!0?D.push(Z,Z+1,F):D.push(Z+1,Z,F),x+=3}r.addGroup(a,x,j===!0?1:2),a+=x}}copy(A){return super.copy(A),this.parameters=Object.assign({},A.parameters),this}static fromJSON(A){return new n(A.radiusTop,A.radiusBottom,A.height,A.radialSegments,A.heightSegments,A.openEnded,A.thetaStart,A.thetaLength)}},Es=class n extends je{constructor(A=1,P=1,e=32,t=1,s=!1,i=0,v=Math.PI*2){super(0,A,P,e,t,s,i,v),this.type="ConeGeometry",this.parameters={radius:A,height:P,radialSegments:e,heightSegments:t,openEnded:s,thetaStart:i,thetaLength:v}}static fromJSON(A){return new n(A.radius,A.height,A.radialSegments,A.heightSegments,A.openEnded,A.thetaStart,A.thetaLength)}},bi=class n extends pP{constructor(A=[],P=[],e=1,t=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:A,indices:P,radius:e,detail:t};let s=[],i=[];v(t),r(e),D(),this.setAttribute("position",new wP(s,3)),this.setAttribute("normal",new wP(s.slice(),3)),this.setAttribute("uv",new wP(i,2)),t===0?this.computeVertexNormals():this.normalizeNormals();function v(m){let u=new y,j=new y,d=new y;for(let Q=0;Q<P.length;Q+=3)g(P[Q+0],u),g(P[Q+1],j),g(P[Q+2],d),o(u,j,d,m)}function o(m,u,j,d){let Q=d+1,Y=[];for(let x=0;x<=Q;x++){Y[x]=[];let h=m.clone().lerp(j,x/Q),l=u.clone().lerp(j,x/Q),p=Q-x;for(let k=0;k<=p;k++)k===0&&x===Q?Y[x][k]=h:Y[x][k]=h.clone().lerp(l,k/p)}for(let x=0;x<Q;x++)for(let h=0;h<2*(Q-x)-1;h++){let l=Math.floor(h/2);h%2===0?(c(Y[x][l+1]),c(Y[x+1][l]),c(Y[x][l])):(c(Y[x][l+1]),c(Y[x+1][l+1]),c(Y[x+1][l]))}}function r(m){let u=new y;for(let j=0;j<s.length;j+=3)u.x=s[j+0],u.y=s[j+1],u.z=s[j+2],u.normalize().multiplyScalar(m),s[j+0]=u.x,s[j+1]=u.y,s[j+2]=u.z}function D(){let m=new y;for(let u=0;u<s.length;u+=3){m.x=s[u+0],m.y=s[u+1],m.z=s[u+2];let j=T(m)/2/Math.PI+.5,d=a(m)/Math.PI+.5;i.push(j,1-d)}B(),z()}function z(){for(let m=0;m<i.length;m+=6){let u=i[m+0],j=i[m+2],d=i[m+4],Q=Math.max(u,j,d),Y=Math.min(u,j,d);Q>.9&&Y<.1&&(u<.2&&(i[m+0]+=1),j<.2&&(i[m+2]+=1),d<.2&&(i[m+4]+=1))}}function c(m){s.push(m.x,m.y,m.z)}function g(m,u){let j=m*3;u.x=A[j+0],u.y=A[j+1],u.z=A[j+2]}function B(){let m=new y,u=new y,j=new y,d=new y,Q=new bA,Y=new bA,x=new bA;for(let h=0,l=0;h<s.length;h+=9,l+=6){m.set(s[h+0],s[h+1],s[h+2]),u.set(s[h+3],s[h+4],s[h+5]),j.set(s[h+6],s[h+7],s[h+8]),Q.set(i[l+0],i[l+1]),Y.set(i[l+2],i[l+3]),x.set(i[l+4],i[l+5]),d.copy(m).add(u).add(j).divideScalar(3);let p=T(d);f(Q,l+0,m,p),f(Y,l+2,u,p),f(x,l+4,j,p)}}function f(m,u,j,d){d<0&&m.x===1&&(i[u]=m.x-1),j.x===0&&j.z===0&&(i[u]=d/2/Math.PI+.5)}function T(m){return Math.atan2(m.z,-m.x)}function a(m){return Math.atan2(-m.y,Math.sqrt(m.x*m.x+m.z*m.z))}}copy(A){return super.copy(A),this.parameters=Object.assign({},A.parameters),this}static fromJSON(A){return new n(A.vertices,A.indices,A.radius,A.details)}},ln=class n extends bi{constructor(A=1,P=0){let e=(1+Math.sqrt(5))/2,t=1/e,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-t,-e,0,-t,e,0,t,-e,0,t,e,-t,-e,0,-t,e,0,t,-e,0,t,e,0,-e,0,-t,e,0,-t,-e,0,t,e,0,t],i=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,i,A,P),this.type="DodecahedronGeometry",this.parameters={radius:A,detail:P}}static fromJSON(A){return new n(A.radius,A.detail)}};var vt=class n extends pP{constructor(A=1,P=1,e=1,t=1){super(),this.type="PlaneGeometry",this.parameters={width:A,height:P,widthSegments:e,heightSegments:t};let s=A/2,i=P/2,v=Math.floor(e),o=Math.floor(t),r=v+1,D=o+1,z=A/v,c=P/o,g=[],B=[],f=[],T=[];for(let a=0;a<D;a++){let m=a*c-i;for(let u=0;u<r;u++){let j=u*z-s;B.push(j,-m,0),f.push(0,0,1),T.push(u/v),T.push(1-a/o)}}for(let a=0;a<o;a++)for(let m=0;m<v;m++){let u=m+r*a,j=m+r*(a+1),d=m+1+r*(a+1),Q=m+1+r*a;g.push(u,j,Q),g.push(j,d,Q)}this.setIndex(g),this.setAttribute("position",new wP(B,3)),this.setAttribute("normal",new wP(f,3)),this.setAttribute("uv",new wP(T,2))}copy(A){return super.copy(A),this.parameters=Object.assign({},A.parameters),this}static fromJSON(A){return new n(A.width,A.height,A.widthSegments,A.heightSegments)}};var yP=class extends kP{constructor(A){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new mA(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new mA(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Sr,this.normalScale=new bA(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new oe,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(A)}copy(A){return super.copy(A),this.defines={STANDARD:""},this.color.copy(A.color),this.roughness=A.roughness,this.metalness=A.metalness,this.map=A.map,this.lightMap=A.lightMap,this.lightMapIntensity=A.lightMapIntensity,this.aoMap=A.aoMap,this.aoMapIntensity=A.aoMapIntensity,this.emissive.copy(A.emissive),this.emissiveMap=A.emissiveMap,this.emissiveIntensity=A.emissiveIntensity,this.bumpMap=A.bumpMap,this.bumpScale=A.bumpScale,this.normalMap=A.normalMap,this.normalMapType=A.normalMapType,this.normalScale.copy(A.normalScale),this.displacementMap=A.displacementMap,this.displacementScale=A.displacementScale,this.displacementBias=A.displacementBias,this.roughnessMap=A.roughnessMap,this.metalnessMap=A.metalnessMap,this.alphaMap=A.alphaMap,this.envMap=A.envMap,this.envMapRotation.copy(A.envMapRotation),this.envMapIntensity=A.envMapIntensity,this.wireframe=A.wireframe,this.wireframeLinewidth=A.wireframeLinewidth,this.wireframeLinecap=A.wireframeLinecap,this.wireframeLinejoin=A.wireframeLinejoin,this.flatShading=A.flatShading,this.fog=A.fog,this}},NP=class extends yP{constructor(A){super(),this.isMeshPhysicalMaterial=!0,this.defines={STANDARD:"",PHYSICAL:""},this.type="MeshPhysicalMaterial",this.anisotropyRotation=0,this.anisotropyMap=null,this.clearcoatMap=null,this.clearcoatRoughness=0,this.clearcoatRoughnessMap=null,this.clearcoatNormalScale=new bA(1,1),this.clearcoatNormalMap=null,this.ior=1.5,Object.defineProperty(this,"reflectivity",{get:function(){return FA(2.5*(this.ior-1)/(this.ior+1),0,1)},set:function(P){this.ior=(1+.4*P)/(1-.4*P)}}),this.iridescenceMap=null,this.iridescenceIOR=1.3,this.iridescenceThicknessRange=[100,400],this.iridescenceThicknessMap=null,this.sheenColor=new mA(0),this.sheenColorMap=null,this.sheenRoughness=1,this.sheenRoughnessMap=null,this.transmissionMap=null,this.thickness=0,this.thicknessMap=null,this.attenuationDistance=1/0,this.attenuationColor=new mA(1,1,1),this.specularIntensity=1,this.specularIntensityMap=null,this.specularColor=new mA(1,1,1),this.specularColorMap=null,this._anisotropy=0,this._clearcoat=0,this._dispersion=0,this._iridescence=0,this._sheen=0,this._transmission=0,this.setValues(A)}get anisotropy(){return this._anisotropy}set anisotropy(A){this._anisotropy>0!=A>0&&this.version++,this._anisotropy=A}get clearcoat(){return this._clearcoat}set clearcoat(A){this._clearcoat>0!=A>0&&this.version++,this._clearcoat=A}get iridescence(){return this._iridescence}set iridescence(A){this._iridescence>0!=A>0&&this.version++,this._iridescence=A}get dispersion(){return this._dispersion}set dispersion(A){this._dispersion>0!=A>0&&this.version++,this._dispersion=A}get sheen(){return this._sheen}set sheen(A){this._sheen>0!=A>0&&this.version++,this._sheen=A}get transmission(){return this._transmission}set transmission(A){this._transmission>0!=A>0&&this.version++,this._transmission=A}copy(A){return super.copy(A),this.defines={STANDARD:"",PHYSICAL:""},this.anisotropy=A.anisotropy,this.anisotropyRotation=A.anisotropyRotation,this.anisotropyMap=A.anisotropyMap,this.clearcoat=A.clearcoat,this.clearcoatMap=A.clearcoatMap,this.clearcoatRoughness=A.clearcoatRoughness,this.clearcoatRoughnessMap=A.clearcoatRoughnessMap,this.clearcoatNormalMap=A.clearcoatNormalMap,this.clearcoatNormalScale.copy(A.clearcoatNormalScale),this.dispersion=A.dispersion,this.ior=A.ior,this.iridescence=A.iridescence,this.iridescenceMap=A.iridescenceMap,this.iridescenceIOR=A.iridescenceIOR,this.iridescenceThicknessRange=[...A.iridescenceThicknessRange],this.iridescenceThicknessMap=A.iridescenceThicknessMap,this.sheen=A.sheen,this.sheenColor.copy(A.sheenColor),this.sheenColorMap=A.sheenColorMap,this.sheenRoughness=A.sheenRoughness,this.sheenRoughnessMap=A.sheenRoughnessMap,this.transmission=A.transmission,this.transmissionMap=A.transmissionMap,this.thickness=A.thickness,this.thicknessMap=A.thicknessMap,this.attenuationDistance=A.attenuationDistance,this.attenuationColor.copy(A.attenuationColor),this.specularIntensity=A.specularIntensity,this.specularIntensityMap=A.specularIntensityMap,this.specularColor.copy(A.specularColor),this.specularColorMap=A.specularColorMap,this}};var Yi=class extends kP{constructor(A){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=m9,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(A)}copy(A){return super.copy(A),this.depthPacking=A.depthPacking,this.map=A.map,this.alphaMap=A.alphaMap,this.displacementMap=A.displacementMap,this.displacementScale=A.displacementScale,this.displacementBias=A.displacementBias,this.wireframe=A.wireframe,this.wireframeLinewidth=A.wireframeLinewidth,this}},pi=class extends kP{constructor(A){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(A)}copy(A){return super.copy(A),this.map=A.map,this.alphaMap=A.alphaMap,this.displacementMap=A.displacementMap,this.displacementScale=A.displacementScale,this.displacementBias=A.displacementBias,this}};function Bi(n,A){return!n||n.constructor===A?n:typeof A.BYTES_PER_ELEMENT=="number"?new A(n):Array.prototype.slice.call(n)}function dz(n){return ArrayBuffer.isView(n)&&!(n instanceof DataView)}function bz(n){function A(t,s){return n[t]-n[s]}let P=n.length,e=new Array(P);for(let t=0;t!==P;++t)e[t]=t;return e.sort(A),e}function RD(n,A,P){let e=n.length,t=new n.constructor(e);for(let s=0,i=0;i!==e;++s){let v=P[s]*A;for(let o=0;o!==A;++o)t[i++]=n[v+o]}return t}function C9(n,A,P,e){let t=1,s=n[0];for(;s!==void 0&&s[e]===void 0;)s=n[t++];if(s===void 0)return;let i=s[e];if(i!==void 0)if(Array.isArray(i))do i=s[e],i!==void 0&&(A.push(s.time),P.push(...i)),s=n[t++];while(s!==void 0);else if(i.toArray!==void 0)do i=s[e],i!==void 0&&(A.push(s.time),i.toArray(P,P.length)),s=n[t++];while(s!==void 0);else do i=s[e],i!==void 0&&(A.push(s.time),P.push(i)),s=n[t++];while(s!==void 0)}var Xe=class{constructor(A,P,e,t){this.parameterPositions=A,this._cachedIndex=0,this.resultBuffer=t!==void 0?t:new P.constructor(e),this.sampleValues=P,this.valueSize=e,this.settings=null,this.DefaultSettings_={}}evaluate(A){let P=this.parameterPositions,e=this._cachedIndex,t=P[e],s=P[e-1];e:{A:{let i;P:{t:if(!(A<t)){for(let v=e+2;;){if(t===void 0){if(A<s)break t;return e=P.length,this._cachedIndex=e,this.copySampleValue_(e-1)}if(e===v)break;if(s=t,t=P[++e],A<t)break A}i=P.length;break P}if(!(A>=s)){let v=P[1];A<v&&(e=2,s=v);for(let o=e-2;;){if(s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(e===o)break;if(t=s,s=P[--e-1],A>=s)break A}i=e,e=0;break P}break e}for(;e<i;){let v=e+i>>>1;A<P[v]?i=v:e=v+1}if(t=P[e],s=P[e-1],s===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(t===void 0)return e=P.length,this._cachedIndex=e,this.copySampleValue_(e-1)}this._cachedIndex=e,this.intervalChanged_(e,s,t)}return this.interpolate_(e,s,A,t)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(A){let P=this.resultBuffer,e=this.sampleValues,t=this.valueSize,s=A*t;for(let i=0;i!==t;++i)P[i]=e[s+i];return P}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},yi=class extends Xe{constructor(A,P,e,t){super(A,P,e,t),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:hr,endingEnd:hr}}intervalChanged_(A,P,e){let t=this.parameterPositions,s=A-2,i=A+1,v=t[s],o=t[i];if(v===void 0)switch(this.getSettings_().endingStart){case ur:s=A,v=2*P-e;break;case mr:s=t.length-2,v=P+t[s]-t[s+1];break;default:s=A,v=e}if(o===void 0)switch(this.getSettings_().endingEnd){case ur:i=A,o=2*e-P;break;case mr:i=1,o=e+t[1]-t[0];break;default:i=A-1,o=P}let r=(e-P)*.5,D=this.valueSize;this._weightPrev=r/(P-v),this._weightNext=r/(o-e),this._offsetPrev=s*D,this._offsetNext=i*D}interpolate_(A,P,e,t){let s=this.resultBuffer,i=this.sampleValues,v=this.valueSize,o=A*v,r=o-v,D=this._offsetPrev,z=this._offsetNext,c=this._weightPrev,g=this._weightNext,B=(e-P)/(t-P),f=B*B,T=f*B,a=-c*T+2*c*f-c*B,m=(1+c)*T+(-1.5-2*c)*f+(-.5+c)*B+1,u=(-1-g)*T+(1.5+g)*f+.5*B,j=g*T-g*f;for(let d=0;d!==v;++d)s[d]=a*i[D+d]+m*i[r+d]+u*i[o+d]+j*i[z+d];return s}},xi=class extends Xe{constructor(A,P,e,t){super(A,P,e,t)}interpolate_(A,P,e,t){let s=this.resultBuffer,i=this.sampleValues,v=this.valueSize,o=A*v,r=o-v,D=(e-P)/(t-P),z=1-D;for(let c=0;c!==v;++c)s[c]=i[r+c]*z+i[o+c]*D;return s}},Oi=class extends Xe{constructor(A,P,e,t){super(A,P,e,t)}interpolate_(A){return this.copySampleValue_(A-1)}},XP=class{constructor(A,P,e,t){if(A===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(P===void 0||P.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+A);this.name=A,this.times=Bi(P,this.TimeBufferType),this.values=Bi(e,this.ValueBufferType),this.setInterpolation(t||this.DefaultInterpolation)}static toJSON(A){let P=A.constructor,e;if(P.toJSON!==this.toJSON)e=P.toJSON(A);else{e={name:A.name,times:Bi(A.times,Array),values:Bi(A.values,Array)};let t=A.getInterpolation();t!==A.DefaultInterpolation&&(e.interpolation=t)}return e.type=A.ValueTypeName,e}InterpolantFactoryMethodDiscrete(A){return new Oi(this.times,this.values,this.getValueSize(),A)}InterpolantFactoryMethodLinear(A){return new xi(this.times,this.values,this.getValueSize(),A)}InterpolantFactoryMethodSmooth(A){return new yi(this.times,this.values,this.getValueSize(),A)}setInterpolation(A){let P;switch(A){case ht:P=this.InterpolantFactoryMethodDiscrete;break;case ut:P=this.InterpolantFactoryMethodLinear;break;case fi:P=this.InterpolantFactoryMethodSmooth;break}if(P===void 0){let e="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(A!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(e);return console.warn("THREE.KeyframeTrack:",e),this}return this.createInterpolant=P,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return ht;case this.InterpolantFactoryMethodLinear:return ut;case this.InterpolantFactoryMethodSmooth:return fi}}getValueSize(){return this.values.length/this.times.length}shift(A){if(A!==0){let P=this.times;for(let e=0,t=P.length;e!==t;++e)P[e]+=A}return this}scale(A){if(A!==1){let P=this.times;for(let e=0,t=P.length;e!==t;++e)P[e]*=A}return this}trim(A,P){let e=this.times,t=e.length,s=0,i=t-1;for(;s!==t&&e[s]<A;)++s;for(;i!==-1&&e[i]>P;)--i;if(++i,s!==0||i!==t){s>=i&&(i=Math.max(i,1),s=i-1);let v=this.getValueSize();this.times=e.slice(s,i),this.values=this.values.slice(s*v,i*v)}return this}validate(){let A=!0,P=this.getValueSize();P-Math.floor(P)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),A=!1);let e=this.times,t=this.values,s=e.length;s===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),A=!1);let i=null;for(let v=0;v!==s;v++){let o=e[v];if(typeof o=="number"&&isNaN(o)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,v,o),A=!1;break}if(i!==null&&i>o){console.error("THREE.KeyframeTrack: Out of order keys.",this,v,o,i),A=!1;break}i=o}if(t!==void 0&&dz(t))for(let v=0,o=t.length;v!==o;++v){let r=t[v];if(isNaN(r)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,v,r),A=!1;break}}return A}optimize(){let A=this.times.slice(),P=this.values.slice(),e=this.getValueSize(),t=this.getInterpolation()===fi,s=A.length-1,i=1;for(let v=1;v<s;++v){let o=!1,r=A[v],D=A[v+1];if(r!==D&&(v!==1||r!==A[0]))if(t)o=!0;else{let z=v*e,c=z-e,g=z+e;for(let B=0;B!==e;++B){let f=P[z+B];if(f!==P[c+B]||f!==P[g+B]){o=!0;break}}}if(o){if(v!==i){A[i]=A[v];let z=v*e,c=i*e;for(let g=0;g!==e;++g)P[c+g]=P[z+g]}++i}}if(s>0){A[i]=A[s];for(let v=s*e,o=i*e,r=0;r!==e;++r)P[o+r]=P[v+r];++i}return i!==A.length?(this.times=A.slice(0,i),this.values=P.slice(0,i*e)):(this.times=A,this.values=P),this}clone(){let A=this.times.slice(),P=this.values.slice(),e=this.constructor,t=new e(this.name,A,P);return t.createInterpolant=this.createInterpolant,t}};XP.prototype.ValueTypeName="";XP.prototype.TimeBufferType=Float32Array;XP.prototype.ValueBufferType=Float32Array;XP.prototype.DefaultInterpolation=ut;var Ze=class extends XP{constructor(A,P,e){super(A,P,e)}};Ze.prototype.ValueTypeName="bool";Ze.prototype.ValueBufferType=Array;Ze.prototype.DefaultInterpolation=ht;Ze.prototype.InterpolantFactoryMethodLinear=void 0;Ze.prototype.InterpolantFactoryMethodSmooth=void 0;var ls=class extends XP{constructor(A,P,e,t){super(A,P,e,t)}};ls.prototype.ValueTypeName="color";var Ee=class extends XP{constructor(A,P,e,t){super(A,P,e,t)}};Ee.prototype.ValueTypeName="number";var Li=class extends Xe{constructor(A,P,e,t){super(A,P,e,t)}interpolate_(A,P,e,t){let s=this.resultBuffer,i=this.sampleValues,v=this.valueSize,o=(e-P)/(t-P),r=A*v;for(let D=r+v;r!==D;r+=4)CP.slerpFlat(s,0,i,r-v,i,r,o);return s}},le=class extends XP{constructor(A,P,e,t){super(A,P,e,t)}InterpolantFactoryMethodLinear(A){return new Li(this.times,this.values,this.getValueSize(),A)}};le.prototype.ValueTypeName="quaternion";le.prototype.InterpolantFactoryMethodSmooth=void 0;var Re=class extends XP{constructor(A,P,e){super(A,P,e)}};Re.prototype.ValueTypeName="string";Re.prototype.ValueBufferType=Array;Re.prototype.DefaultInterpolation=ht;Re.prototype.InterpolantFactoryMethodLinear=void 0;Re.prototype.InterpolantFactoryMethodSmooth=void 0;var he=class extends XP{constructor(A,P,e,t){super(A,P,e,t)}};he.prototype.ValueTypeName="vector";var hs=class{constructor(A="",P=-1,e=[],t=u9){this.name=A,this.tracks=e,this.duration=P,this.blendMode=t,this.uuid=ve(),this.userData={},this.duration<0&&this.resetDuration()}static parse(A){let P=[],e=A.tracks,t=1/(A.fps||1);for(let i=0,v=e.length;i!==v;++i)P.push(pz(e[i]).scale(t));let s=new this(A.name,A.duration,P,A.blendMode);return s.uuid=A.uuid,s.userData=JSON.parse(A.userData||"{}"),s}static toJSON(A){let P=[],e=A.tracks,t={name:A.name,duration:A.duration,tracks:P,uuid:A.uuid,blendMode:A.blendMode,userData:JSON.stringify(A.userData)};for(let s=0,i=e.length;s!==i;++s)P.push(XP.toJSON(e[s]));return t}static CreateFromMorphTargetSequence(A,P,e,t){let s=P.length,i=[];for(let v=0;v<s;v++){let o=[],r=[];o.push((v+s-1)%s,v,(v+1)%s),r.push(0,1,0);let D=bz(o);o=RD(o,1,D),r=RD(r,1,D),!t&&o[0]===0&&(o.push(s),r.push(r[0])),i.push(new Ee(".morphTargetInfluences["+P[v].name+"]",o,r).scale(1/e))}return new this(A,-1,i)}static findByName(A,P){let e=A;if(!Array.isArray(A)){let t=A;e=t.geometry&&t.geometry.animations||t.animations}for(let t=0;t<e.length;t++)if(e[t].name===P)return e[t];return null}static CreateClipsFromMorphTargetSequences(A,P,e){let t={},s=/^([\w-]*?)([\d]+)$/;for(let v=0,o=A.length;v<o;v++){let r=A[v],D=r.name.match(s);if(D&&D.length>1){let z=D[1],c=t[z];c||(t[z]=c=[]),c.push(r)}}let i=[];for(let v in t)i.push(this.CreateFromMorphTargetSequence(v,t[v],P,e));return i}static parseAnimation(A,P){if(console.warn("THREE.AnimationClip: parseAnimation() is deprecated and will be removed with r185"),!A)return console.error("THREE.AnimationClip: No animation in JSONLoader data."),null;let e=function(z,c,g,B,f){if(g.length!==0){let T=[],a=[];C9(g,T,a,B),T.length!==0&&f.push(new z(c,T,a))}},t=[],s=A.name||"default",i=A.fps||30,v=A.blendMode,o=A.length||-1,r=A.hierarchy||[];for(let z=0;z<r.length;z++){let c=r[z].keys;if(!(!c||c.length===0))if(c[0].morphTargets){let g={},B;for(B=0;B<c.length;B++)if(c[B].morphTargets)for(let f=0;f<c[B].morphTargets.length;f++)g[c[B].morphTargets[f]]=-1;for(let f in g){let T=[],a=[];for(let m=0;m!==c[B].morphTargets.length;++m){let u=c[B];T.push(u.time),a.push(u.morphTarget===f?1:0)}t.push(new Ee(".morphTargetInfluence["+f+"]",T,a))}o=g.length*i}else{let g=".bones["+P[z].name+"]";e(he,g+".position",c,"pos",t),e(le,g+".quaternion",c,"rot",t),e(he,g+".scale",c,"scl",t)}}return t.length===0?null:new this(s,o,t,v)}resetDuration(){let A=this.tracks,P=0;for(let e=0,t=A.length;e!==t;++e){let s=this.tracks[e];P=Math.max(P,s.times[s.times.length-1])}return this.duration=P,this}trim(){for(let A=0;A<this.tracks.length;A++)this.tracks[A].trim(0,this.duration);return this}validate(){let A=!0;for(let P=0;P<this.tracks.length;P++)A=A&&this.tracks[P].validate();return A}optimize(){for(let A=0;A<this.tracks.length;A++)this.tracks[A].optimize();return this}clone(){let A=[];for(let e=0;e<this.tracks.length;e++)A.push(this.tracks[e].clone());let P=new this.constructor(this.name,this.duration,A,this.blendMode);return P.userData=JSON.parse(JSON.stringify(this.userData)),P}toJSON(){return this.constructor.toJSON(this)}};function Yz(n){switch(n.toLowerCase()){case"scalar":case"double":case"float":case"number":case"integer":return Ee;case"vector":case"vector2":case"vector3":case"vector4":return he;case"color":return ls;case"quaternion":return le;case"bool":case"boolean":return Ze;case"string":return Re}throw new Error("THREE.KeyframeTrack: Unsupported typeName: "+n)}function pz(n){if(n.type===void 0)throw new Error("THREE.KeyframeTrack: track type undefined, can not parse");let A=Yz(n.type);if(n.times===void 0){let P=[],e=[];C9(n.keys,P,e,"value"),n.times=P,n.values=e}return A.parse!==void 0?A.parse(n):new A(n.name,n.times,n.values,n.interpolation)}var fe={enabled:!1,files:{},add:function(n,A){this.enabled!==!1&&(this.files[n]=A)},get:function(n){if(this.enabled!==!1)return this.files[n]},remove:function(n){delete this.files[n]},clear:function(){this.files={}}},Ii=class{constructor(A,P,e){let t=this,s=!1,i=0,v=0,o,r=[];this.onStart=void 0,this.onLoad=A,this.onProgress=P,this.onError=e,this.abortController=new AbortController,this.itemStart=function(D){v++,s===!1&&t.onStart!==void 0&&t.onStart(D,i,v),s=!0},this.itemEnd=function(D){i++,t.onProgress!==void 0&&t.onProgress(D,i,v),i===v&&(s=!1,t.onLoad!==void 0&&t.onLoad())},this.itemError=function(D){t.onError!==void 0&&t.onError(D)},this.resolveURL=function(D){return o?o(D):D},this.setURLModifier=function(D){return o=D,this},this.addHandler=function(D,z){return r.push(D,z),this},this.removeHandler=function(D){let z=r.indexOf(D);return z!==-1&&r.splice(z,2),this},this.getHandler=function(D){for(let z=0,c=r.length;z<c;z+=2){let g=r[z],B=r[z+1];if(g.global&&(g.lastIndex=0),g.test(D))return B}return null},this.abort=function(){return this.abortController.abort(),this.abortController=new AbortController,this}}},F9=new Ii,ue=class{constructor(A){this.manager=A!==void 0?A:F9,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(A,P){let e=this;return new Promise(function(t,s){e.load(A,t,P,s)})}parse(){}setCrossOrigin(A){return this.crossOrigin=A,this}setWithCredentials(A){return this.withCredentials=A,this}setPath(A){return this.path=A,this}setResourcePath(A){return this.resourcePath=A,this}setRequestHeader(A){return this.requestHeader=A,this}abort(){return this}};ue.DEFAULT_MATERIAL_NAME="__DEFAULT";var Ge={},dr=class extends Error{constructor(A,P){super(A),this.response=P}},hn=class extends ue{constructor(A){super(A),this.mimeType="",this.responseType="",this._abortController=new AbortController}load(A,P,e,t){A===void 0&&(A=""),this.path!==void 0&&(A=this.path+A),A=this.manager.resolveURL(A);let s=fe.get(`file:${A}`);if(s!==void 0)return this.manager.itemStart(A),setTimeout(()=>{P&&P(s),this.manager.itemEnd(A)},0),s;if(Ge[A]!==void 0){Ge[A].push({onLoad:P,onProgress:e,onError:t});return}Ge[A]=[],Ge[A].push({onLoad:P,onProgress:e,onError:t});let i=new Request(A,{headers:new Headers(this.requestHeader),credentials:this.withCredentials?"include":"same-origin",signal:typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal}),v=this.mimeType,o=this.responseType;fetch(i).then(r=>{if(r.status===200||r.status===0){if(r.status===0&&console.warn("THREE.FileLoader: HTTP Status 0 received."),typeof ReadableStream>"u"||r.body===void 0||r.body.getReader===void 0)return r;let D=Ge[A],z=r.body.getReader(),c=r.headers.get("X-File-Size")||r.headers.get("Content-Length"),g=c?parseInt(c):0,B=g!==0,f=0,T=new ReadableStream({start(a){m();function m(){z.read().then(({done:u,value:j})=>{if(u)a.close();else{f+=j.byteLength;let d=new ProgressEvent("progress",{lengthComputable:B,loaded:f,total:g});for(let Q=0,Y=D.length;Q<Y;Q++){let x=D[Q];x.onProgress&&x.onProgress(d)}a.enqueue(j),m()}},u=>{a.error(u)})}}});return new Response(T)}else throw new dr(`fetch for "${r.url}" responded with ${r.status}: ${r.statusText}`,r)}).then(r=>{switch(o){case"arraybuffer":return r.arrayBuffer();case"blob":return r.blob();case"document":return r.text().then(D=>new DOMParser().parseFromString(D,v));case"json":return r.json();default:if(v==="")return r.text();{let z=/charset="?([^;"\s]*)"?/i.exec(v),c=z&&z[1]?z[1].toLowerCase():void 0,g=new TextDecoder(c);return r.arrayBuffer().then(B=>g.decode(B))}}}).then(r=>{fe.add(`file:${A}`,r);let D=Ge[A];delete Ge[A];for(let z=0,c=D.length;z<c;z++){let g=D[z];g.onLoad&&g.onLoad(r)}}).catch(r=>{let D=Ge[A];if(D===void 0)throw this.manager.itemError(A),r;delete Ge[A];for(let z=0,c=D.length;z<c;z++){let g=D[z];g.onError&&g.onError(r)}this.manager.itemError(A)}).finally(()=>{this.manager.itemEnd(A)}),this.manager.itemStart(A)}setResponseType(A){return this.responseType=A,this}setMimeType(A){return this.mimeType=A,this}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var vn=new WeakMap,ki=class extends ue{constructor(A){super(A)}load(A,P,e,t){this.path!==void 0&&(A=this.path+A),A=this.manager.resolveURL(A);let s=this,i=fe.get(`image:${A}`);if(i!==void 0){if(i.complete===!0)s.manager.itemStart(A),setTimeout(function(){P&&P(i),s.manager.itemEnd(A)},0);else{let z=vn.get(i);z===void 0&&(z=[],vn.set(i,z)),z.push({onLoad:P,onError:t})}return i}let v=zn("img");function o(){D(),P&&P(this);let z=vn.get(this)||[];for(let c=0;c<z.length;c++){let g=z[c];g.onLoad&&g.onLoad(this)}vn.delete(this),s.manager.itemEnd(A)}function r(z){D(),t&&t(z),fe.remove(`image:${A}`);let c=vn.get(this)||[];for(let g=0;g<c.length;g++){let B=c[g];B.onError&&B.onError(z)}vn.delete(this),s.manager.itemError(A),s.manager.itemEnd(A)}function D(){v.removeEventListener("load",o,!1),v.removeEventListener("error",r,!1)}return v.addEventListener("load",o,!1),v.addEventListener("error",r,!1),A.slice(0,5)!=="data:"&&this.crossOrigin!==void 0&&(v.crossOrigin=this.crossOrigin),fe.add(`image:${A}`,v),s.manager.itemStart(A),v.src=A,v}};var us=class extends ue{constructor(A){super(A)}load(A,P,e,t){let s=new jP,i=new ki(this.manager);return i.setCrossOrigin(this.crossOrigin),i.setPath(this.path),i.load(A,function(v){s.image=v,s.needsUpdate=!0,P!==void 0&&P(s)},e,t),s}},bt=class extends nP{constructor(A,P=1){super(),this.isLight=!0,this.type="Light",this.color=new mA(A),this.intensity=P}dispose(){}copy(A,P){return super.copy(A,P),this.color.copy(A.color),this.intensity=A.intensity,this}toJSON(A){let P=super.toJSON(A);return P.object.color=this.color.getHex(),P.object.intensity=this.intensity,this.groundColor!==void 0&&(P.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(P.object.distance=this.distance),this.angle!==void 0&&(P.object.angle=this.angle),this.decay!==void 0&&(P.object.decay=this.decay),this.penumbra!==void 0&&(P.object.penumbra=this.penumbra),this.shadow!==void 0&&(P.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(P.object.target=this.target.uuid),P}},ms=class extends bt{constructor(A,P,e){super(A,e),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(nP.DEFAULT_UP),this.updateMatrix(),this.groundColor=new mA(P)}copy(A,P){return super.copy(A,P),this.groundColor.copy(A.groundColor),this}},wr=new yA,WD=new y,SD=new y,Ms=class{constructor(A){this.camera=A,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new bA(512,512),this.mapType=ce,this.map=null,this.mapPass=null,this.matrix=new yA,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wn,this._frameExtents=new bA(1,1),this._viewportCount=1,this._viewports=[new SA(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(A){let P=this.camera,e=this.matrix;WD.setFromMatrixPosition(A.matrixWorld),P.position.copy(WD),SD.setFromMatrixPosition(A.target.matrixWorld),P.lookAt(SD),P.updateMatrixWorld(),wr.multiplyMatrices(P.projectionMatrix,P.matrixWorldInverse),this._frustum.setFromProjectionMatrix(wr,P.coordinateSystem,P.reversedDepth),P.reversedDepth?e.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):e.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),e.multiply(wr)}getViewport(A){return this._viewports[A]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(A){return this.camera=A.camera.clone(),this.intensity=A.intensity,this.bias=A.bias,this.radius=A.radius,this.autoUpdate=A.autoUpdate,this.needsUpdate=A.needsUpdate,this.normalBias=A.normalBias,this.blurSamples=A.blurSamples,this.mapSize.copy(A.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let A={};return this.intensity!==1&&(A.intensity=this.intensity),this.bias!==0&&(A.bias=this.bias),this.normalBias!==0&&(A.normalBias=this.normalBias),this.radius!==1&&(A.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(A.mapSize=this.mapSize.toArray()),A.camera=this.camera.toJSON(!1).object,delete A.camera.matrix,A}},br=class extends Ms{constructor(){super(new BP(50,1,.5,500)),this.isSpotLightShadow=!0,this.focus=1,this.aspect=1}updateMatrices(A){let P=this.camera,e=mt*2*A.angle*this.focus,t=this.mapSize.width/this.mapSize.height*this.aspect,s=A.distance||P.far;(e!==P.fov||t!==P.aspect||s!==P.far)&&(P.fov=e,P.aspect=t,P.far=s,P.updateProjectionMatrix()),super.updateMatrices(A)}copy(A){return super.copy(A),this.focus=A.focus,this}},Qs=class extends bt{constructor(A,P,e=0,t=Math.PI/3,s=0,i=2){super(A,P),this.isSpotLight=!0,this.type="SpotLight",this.position.copy(nP.DEFAULT_UP),this.updateMatrix(),this.target=new nP,this.distance=e,this.angle=t,this.penumbra=s,this.decay=i,this.map=null,this.shadow=new br}get power(){return this.intensity*Math.PI}set power(A){this.intensity=A/Math.PI}dispose(){this.shadow.dispose()}copy(A,P){return super.copy(A,P),this.distance=A.distance,this.angle=A.angle,this.penumbra=A.penumbra,this.decay=A.decay,this.target=A.target.clone(),this.shadow=A.shadow.clone(),this}},UD=new yA,Kn=new y,jr=new y,Yr=class extends Ms{constructor(){super(new BP(90,1,.5,500)),this.isPointLightShadow=!0,this._frameExtents=new bA(4,2),this._viewportCount=6,this._viewports=[new SA(2,1,1,1),new SA(0,1,1,1),new SA(3,1,1,1),new SA(1,1,1,1),new SA(3,0,1,1),new SA(1,0,1,1)],this._cubeDirections=[new y(1,0,0),new y(-1,0,0),new y(0,0,1),new y(0,0,-1),new y(0,1,0),new y(0,-1,0)],this._cubeUps=[new y(0,1,0),new y(0,1,0),new y(0,1,0),new y(0,1,0),new y(0,0,1),new y(0,0,-1)]}updateMatrices(A,P=0){let e=this.camera,t=this.matrix,s=A.distance||e.far;s!==e.far&&(e.far=s,e.updateProjectionMatrix()),Kn.setFromMatrixPosition(A.matrixWorld),e.position.copy(Kn),jr.copy(e.position),jr.add(this._cubeDirections[P]),e.up.copy(this._cubeUps[P]),e.lookAt(jr),e.updateMatrixWorld(),t.makeTranslation(-Kn.x,-Kn.y,-Kn.z),UD.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(UD,e.coordinateSystem,e.reversedDepth)}},me=class extends bt{constructor(A,P,e=0,t=2){super(A,P),this.isPointLight=!0,this.type="PointLight",this.distance=e,this.decay=t,this.shadow=new Yr}get power(){return this.intensity*4*Math.PI}set power(A){this.intensity=A/(4*Math.PI)}dispose(){this.shadow.dispose()}copy(A,P){return super.copy(A,P),this.distance=A.distance,this.decay=A.decay,this.shadow=A.shadow.clone(),this}},Yt=class extends is{constructor(A=-1,P=1,e=1,t=-1,s=.1,i=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=A,this.right=P,this.top=e,this.bottom=t,this.near=s,this.far=i,this.updateProjectionMatrix()}copy(A,P){return super.copy(A,P),this.left=A.left,this.right=A.right,this.top=A.top,this.bottom=A.bottom,this.near=A.near,this.far=A.far,this.zoom=A.zoom,this.view=A.view===null?null:Object.assign({},A.view),this}setViewOffset(A,P,e,t,s,i){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=A,this.view.fullHeight=P,this.view.offsetX=e,this.view.offsetY=t,this.view.width=s,this.view.height=i,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let A=(this.right-this.left)/(2*this.zoom),P=(this.top-this.bottom)/(2*this.zoom),e=(this.right+this.left)/2,t=(this.top+this.bottom)/2,s=e-A,i=e+A,v=t+P,o=t-P;if(this.view!==null&&this.view.enabled){let r=(this.right-this.left)/this.view.fullWidth/this.zoom,D=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=r*this.view.offsetX,i=s+r*this.view.width,v-=D*this.view.offsetY,o=v-D*this.view.height}this.projectionMatrix.makeOrthographic(s,i,v,o,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(A){let P=super.toJSON(A);return P.object.zoom=this.zoom,P.object.left=this.left,P.object.right=this.right,P.object.top=this.top,P.object.bottom=this.bottom,P.object.near=this.near,P.object.far=this.far,this.view!==null&&(P.object.view=Object.assign({},this.view)),P}},pr=class extends Ms{constructor(){super(new Yt(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},pt=class extends bt{constructor(A,P){super(A,P),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(nP.DEFAULT_UP),this.updateMatrix(),this.target=new nP,this.shadow=new pr}dispose(){this.shadow.dispose()}copy(A){return super.copy(A),this.target=A.target.clone(),this.shadow=A.shadow.clone(),this}};var We=class{static extractUrlBase(A){let P=A.lastIndexOf("/");return P===-1?"./":A.slice(0,P+1)}static resolveURL(A,P){return typeof A!="string"||A===""?"":(/^https?:\/\//i.test(P)&&/^\//.test(A)&&(P=P.replace(/(^https?:\/\/[^\/]+).*/i,"$1")),/^(https?:)?\/\//i.test(A)||/^data:.*,.*$/i.test(A)||/^blob:.*$/i.test(A)?A:P+A)}};var Er=new WeakMap,ds=class extends ue{constructor(A){super(A),this.isImageBitmapLoader=!0,typeof createImageBitmap>"u"&&console.warn("THREE.ImageBitmapLoader: createImageBitmap() not supported."),typeof fetch>"u"&&console.warn("THREE.ImageBitmapLoader: fetch() not supported."),this.options={premultiplyAlpha:"none"},this._abortController=new AbortController}setOptions(A){return this.options=A,this}load(A,P,e,t){A===void 0&&(A=""),this.path!==void 0&&(A=this.path+A),A=this.manager.resolveURL(A);let s=this,i=fe.get(`image-bitmap:${A}`);if(i!==void 0){if(s.manager.itemStart(A),i.then){i.then(r=>{if(Er.has(i)===!0)t&&t(Er.get(i)),s.manager.itemError(A),s.manager.itemEnd(A);else return P&&P(r),s.manager.itemEnd(A),r});return}return setTimeout(function(){P&&P(i),s.manager.itemEnd(A)},0),i}let v={};v.credentials=this.crossOrigin==="anonymous"?"same-origin":"include",v.headers=this.requestHeader,v.signal=typeof AbortSignal.any=="function"?AbortSignal.any([this._abortController.signal,this.manager.abortController.signal]):this._abortController.signal;let o=fetch(A,v).then(function(r){return r.blob()}).then(function(r){return createImageBitmap(r,Object.assign(s.options,{colorSpaceConversion:"none"}))}).then(function(r){return fe.add(`image-bitmap:${A}`,r),P&&P(r),s.manager.itemEnd(A),r}).catch(function(r){t&&t(r),Er.set(o,r),fe.remove(`image-bitmap:${A}`),s.manager.itemError(A),s.manager.itemEnd(A)});fe.add(`image-bitmap:${A}`,o),s.manager.itemStart(A)}abort(){return this._abortController.abort(),this._abortController=new AbortController,this}};var Hi=class extends BP{constructor(A=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=A}},bs=class{constructor(A=!0){this.autoStart=A,this.startTime=0,this.oldTime=0,this.elapsedTime=0,this.running=!1}start(){this.startTime=performance.now(),this.oldTime=this.startTime,this.elapsedTime=0,this.running=!0}stop(){this.getElapsedTime(),this.running=!1,this.autoStart=!1}getElapsedTime(){return this.getDelta(),this.elapsedTime}getDelta(){let A=0;if(this.autoStart&&!this.running)return this.start(),0;if(this.running){let P=performance.now();A=(P-this.oldTime)/1e3,this.oldTime=P,this.elapsedTime+=A}return A}};var $r="\\[\\]\\.:\\/",yz=new RegExp("["+$r+"]","g"),Ao="[^"+$r+"]",xz="[^"+$r.replace("\\.","")+"]",Oz=/((?:WC+[\/:])*)/.source.replace("WC",Ao),Lz=/(WCOD+)?/.source.replace("WCOD",xz),Iz=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ao),kz=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ao),Hz=new RegExp("^"+Oz+Lz+Iz+kz+"$"),Gz=["material","materials","bones","map"],yr=class{constructor(A,P,e){let t=e||$A.parseTrackName(P);this._targetGroup=A,this._bindings=A.subscribe_(P,t)}getValue(A,P){this.bind();let e=this._targetGroup.nCachedObjects_,t=this._bindings[e];t!==void 0&&t.getValue(A,P)}setValue(A,P){let e=this._bindings;for(let t=this._targetGroup.nCachedObjects_,s=e.length;t!==s;++t)e[t].setValue(A,P)}bind(){let A=this._bindings;for(let P=this._targetGroup.nCachedObjects_,e=A.length;P!==e;++P)A[P].bind()}unbind(){let A=this._bindings;for(let P=this._targetGroup.nCachedObjects_,e=A.length;P!==e;++P)A[P].unbind()}},$A=class n{constructor(A,P,e){this.path=P,this.parsedPath=e||n.parseTrackName(P),this.node=n.findNode(A,this.parsedPath.nodeName),this.rootNode=A,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(A,P,e){return A&&A.isAnimationObjectGroup?new n.Composite(A,P,e):new n(A,P,e)}static sanitizeNodeName(A){return A.replace(/\s/g,"_").replace(yz,"")}static parseTrackName(A){let P=Hz.exec(A);if(P===null)throw new Error("PropertyBinding: Cannot parse trackName: "+A);let e={nodeName:P[2],objectName:P[3],objectIndex:P[4],propertyName:P[5],propertyIndex:P[6]},t=e.nodeName&&e.nodeName.lastIndexOf(".");if(t!==void 0&&t!==-1){let s=e.nodeName.substring(t+1);Gz.indexOf(s)!==-1&&(e.nodeName=e.nodeName.substring(0,t),e.objectName=s)}if(e.propertyName===null||e.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+A);return e}static findNode(A,P){if(P===void 0||P===""||P==="."||P===-1||P===A.name||P===A.uuid)return A;if(A.skeleton){let e=A.skeleton.getBoneByName(P);if(e!==void 0)return e}if(A.children){let e=function(s){for(let i=0;i<s.length;i++){let v=s[i];if(v.name===P||v.uuid===P)return v;let o=e(v.children);if(o)return o}return null},t=e(A.children);if(t)return t}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(A,P){A[P]=this.targetObject[this.propertyName]}_getValue_array(A,P){let e=this.resolvedProperty;for(let t=0,s=e.length;t!==s;++t)A[P++]=e[t]}_getValue_arrayElement(A,P){A[P]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(A,P){this.resolvedProperty.toArray(A,P)}_setValue_direct(A,P){this.targetObject[this.propertyName]=A[P]}_setValue_direct_setNeedsUpdate(A,P){this.targetObject[this.propertyName]=A[P],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(A,P){this.targetObject[this.propertyName]=A[P],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(A,P){let e=this.resolvedProperty;for(let t=0,s=e.length;t!==s;++t)e[t]=A[P++]}_setValue_array_setNeedsUpdate(A,P){let e=this.resolvedProperty;for(let t=0,s=e.length;t!==s;++t)e[t]=A[P++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(A,P){let e=this.resolvedProperty;for(let t=0,s=e.length;t!==s;++t)e[t]=A[P++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(A,P){this.resolvedProperty[this.propertyIndex]=A[P]}_setValue_arrayElement_setNeedsUpdate(A,P){this.resolvedProperty[this.propertyIndex]=A[P],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(A,P){this.resolvedProperty[this.propertyIndex]=A[P],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(A,P){this.resolvedProperty.fromArray(A,P)}_setValue_fromArray_setNeedsUpdate(A,P){this.resolvedProperty.fromArray(A,P),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(A,P){this.resolvedProperty.fromArray(A,P),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(A,P){this.bind(),this.getValue(A,P)}_setValue_unbound(A,P){this.bind(),this.setValue(A,P)}bind(){let A=this.node,P=this.parsedPath,e=P.objectName,t=P.propertyName,s=P.propertyIndex;if(A||(A=n.findNode(this.rootNode,P.nodeName),this.node=A),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!A){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(e){let r=P.objectIndex;switch(e){case"materials":if(!A.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!A.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}A=A.material.materials;break;case"bones":if(!A.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}A=A.skeleton.bones;for(let D=0;D<A.length;D++)if(A[D].name===r){r=D;break}break;case"map":if("map"in A){A=A.map;break}if(!A.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!A.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}A=A.material.map;break;default:if(A[e]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}A=A[e]}if(r!==void 0){if(A[r]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,A);return}A=A[r]}}let i=A[t];if(i===void 0){let r=P.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+r+"."+t+" but it wasn't found.",A);return}let v=this.Versioning.None;this.targetObject=A,A.isMaterial===!0?v=this.Versioning.NeedsUpdate:A.isObject3D===!0&&(v=this.Versioning.MatrixWorldNeedsUpdate);let o=this.BindingType.Direct;if(s!==void 0){if(t==="morphTargetInfluences"){if(!A.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!A.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}A.morphTargetDictionary[s]!==void 0&&(s=A.morphTargetDictionary[s])}o=this.BindingType.ArrayElement,this.resolvedProperty=i,this.propertyIndex=s}else i.fromArray!==void 0&&i.toArray!==void 0?(o=this.BindingType.HasFromToArray,this.resolvedProperty=i):Array.isArray(i)?(o=this.BindingType.EntireArray,this.resolvedProperty=i):this.propertyName=t;this.getValue=this.GetterByBindingType[o],this.setValue=this.SetterByBindingTypeAndVersioning[o][v]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};$A.Composite=yr;$A.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};$A.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};$A.prototype.GetterByBindingType=[$A.prototype._getValue_direct,$A.prototype._getValue_array,$A.prototype._getValue_arrayElement,$A.prototype._getValue_toArray];$A.prototype.SetterByBindingTypeAndVersioning=[[$A.prototype._setValue_direct,$A.prototype._setValue_direct_setNeedsUpdate,$A.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[$A.prototype._setValue_array,$A.prototype._setValue_array_setNeedsUpdate,$A.prototype._setValue_array_setMatrixWorldNeedsUpdate],[$A.prototype._setValue_arrayElement,$A.prototype._setValue_arrayElement_setNeedsUpdate,$A.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[$A.prototype._setValue_fromArray,$A.prototype._setValue_fromArray_setNeedsUpdate,$A.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var kB=new Float32Array(1);function Po(n,A,P,e){let t=Cz(e);switch(P){case Xr:return n*A;case $i:return n*A/t.components*t.byteLength;case Av:return n*A/t.components*t.byteLength;case Rr:return n*A*2/t.components*t.byteLength;case Pv:return n*A*2/t.components*t.byteLength;case Zr:return n*A*3/t.components*t.byteLength;case qP:return n*A*4/t.components*t.byteLength;case ev:return n*A*4/t.components*t.byteLength;case ps:case ys:return Math.floor((n+3)/4)*Math.floor((A+3)/4)*8;case xs:case Os:return Math.floor((n+3)/4)*Math.floor((A+3)/4)*16;case nv:case iv:return Math.max(n,16)*Math.max(A,8)/4;case tv:case sv:return Math.max(n,8)*Math.max(A,8)/2;case vv:case rv:return Math.floor((n+3)/4)*Math.floor((A+3)/4)*8;case ov:return Math.floor((n+3)/4)*Math.floor((A+3)/4)*16;case Dv:return Math.floor((n+3)/4)*Math.floor((A+3)/4)*16;case zv:return Math.floor((n+4)/5)*Math.floor((A+3)/4)*16;case cv:return Math.floor((n+4)/5)*Math.floor((A+4)/5)*16;case av:return Math.floor((n+5)/6)*Math.floor((A+4)/5)*16;case gv:return Math.floor((n+5)/6)*Math.floor((A+5)/6)*16;case Tv:return Math.floor((n+7)/8)*Math.floor((A+4)/5)*16;case Bv:return Math.floor((n+7)/8)*Math.floor((A+5)/6)*16;case fv:return Math.floor((n+7)/8)*Math.floor((A+7)/8)*16;case wv:return Math.floor((n+9)/10)*Math.floor((A+4)/5)*16;case jv:return Math.floor((n+9)/10)*Math.floor((A+5)/6)*16;case Ev:return Math.floor((n+9)/10)*Math.floor((A+7)/8)*16;case lv:return Math.floor((n+9)/10)*Math.floor((A+9)/10)*16;case hv:return Math.floor((n+11)/12)*Math.floor((A+9)/10)*16;case uv:return Math.floor((n+11)/12)*Math.floor((A+11)/12)*16;case mv:case Mv:case Qv:return Math.ceil(n/4)*Math.ceil(A/4)*16;case dv:case bv:return Math.ceil(n/4)*Math.ceil(A/4)*8;case Yv:case pv:return Math.ceil(n/4)*Math.ceil(A/4)*16}throw new Error(`Unable to determine texture byte length for ${P} format.`)}function Cz(n){switch(n){case ce:case Gr:return{byteLength:1,components:1};case Mn:case Cr:case Qn:return{byteLength:2,components:1};case Ki:case _i:return{byteLength:2,components:4};case rt:case qi:case Ae:return{byteLength:4,components:1};case Fr:case Nr:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${n}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"180"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="180");function D8(){let n=null,A=!1,P=null,e=null;function t(s,i){P(s,i),e=n.requestAnimationFrame(t)}return{start:function(){A!==!0&&P!==null&&(e=n.requestAnimationFrame(t),A=!0)},stop:function(){n.cancelAnimationFrame(e),A=!1},setAnimationLoop:function(s){P=s},setContext:function(s){n=s}}}function Nz(n){let A=new WeakMap;function P(v,o){let r=v.array,D=v.usage,z=r.byteLength,c=n.createBuffer();n.bindBuffer(o,c),n.bufferData(o,r,D),v.onUploadCallback();let g;if(r instanceof Float32Array)g=n.FLOAT;else if(typeof Float16Array<"u"&&r instanceof Float16Array)g=n.HALF_FLOAT;else if(r instanceof Uint16Array)v.isFloat16BufferAttribute?g=n.HALF_FLOAT:g=n.UNSIGNED_SHORT;else if(r instanceof Int16Array)g=n.SHORT;else if(r instanceof Uint32Array)g=n.UNSIGNED_INT;else if(r instanceof Int32Array)g=n.INT;else if(r instanceof Int8Array)g=n.BYTE;else if(r instanceof Uint8Array)g=n.UNSIGNED_BYTE;else if(r instanceof Uint8ClampedArray)g=n.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+r);return{buffer:c,type:g,bytesPerElement:r.BYTES_PER_ELEMENT,version:v.version,size:z}}function e(v,o,r){let D=o.array,z=o.updateRanges;if(n.bindBuffer(r,v),z.length===0)n.bufferSubData(r,0,D);else{z.sort((g,B)=>g.start-B.start);let c=0;for(let g=1;g<z.length;g++){let B=z[c],f=z[g];f.start<=B.start+B.count+1?B.count=Math.max(B.count,f.start+f.count-B.start):(++c,z[c]=f)}z.length=c+1;for(let g=0,B=z.length;g<B;g++){let f=z[g];n.bufferSubData(r,f.start*D.BYTES_PER_ELEMENT,D,f.start,f.count)}o.clearUpdateRanges()}o.onUploadCallback()}function t(v){return v.isInterleavedBufferAttribute&&(v=v.data),A.get(v)}function s(v){v.isInterleavedBufferAttribute&&(v=v.data);let o=A.get(v);o&&(n.deleteBuffer(o.buffer),A.delete(v))}function i(v,o){if(v.isInterleavedBufferAttribute&&(v=v.data),v.isGLBufferAttribute){let D=A.get(v);(!D||D.version<v.version)&&A.set(v,{buffer:v.buffer,type:v.type,bytesPerElement:v.elementSize,version:v.version});return}let r=A.get(v);if(r===void 0)A.set(v,P(v,o));else if(r.version<v.version){if(r.size!==v.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");e(r.buffer,v,o),r.version=v.version}}return{get:t,remove:s,update:i}}var Xz=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Zz=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Rz=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Wz=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Sz=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Uz=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Jz=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Vz=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,qz=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Kz=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,_z=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,$z=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Ac=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,Pc=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,ec=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,tc=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,nc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,sc=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,ic=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,vc=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,rc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,oc=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Dc=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,zc=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,cc=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,ac=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,gc=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Tc=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Bc=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,fc=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,wc="gl_FragColor = linearToOutputTexel( gl_FragColor );",jc=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Ec=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,lc=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,hc=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,uc=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,mc=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Mc=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Qc=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,dc=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,bc=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yc=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,pc=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yc=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,xc=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Oc=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Lc=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Ic=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,kc=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Hc=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Gc=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cc=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Fc=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Nc=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Xc=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,Zc=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Rc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Wc=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Sc=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Uc=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Jc=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Vc=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,qc=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Kc=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_c=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,$c=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Aa=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Pa=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,ea=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ta=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,na=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,sa=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,ia=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,va=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,ra=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,oa=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Da=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,za=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,ca=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,aa=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,ga=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ta=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ba=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,fa=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,wa=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,ja=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Ea=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,la=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,ha=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ua=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,ma=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Ma=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Qa=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,da=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,ba=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ya=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,pa=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,ya=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,xa=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Oa=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,La=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ia=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,ka=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,Ha=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ga=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Ca=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Fa=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Na=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Xa=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Za=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ra=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Wa=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Sa=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Ua=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Ja=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Va=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,qa=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,Ka=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_a=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,$a=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Ag=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Pg=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,eg=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tg=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ng=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,sg=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,ig=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,vg=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,rg=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,og=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Dg=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,zg=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,cg=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ag=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,gg=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tg=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Bg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fg=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wg=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,jg=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Eg=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,GA={alphahash_fragment:Xz,alphahash_pars_fragment:Zz,alphamap_fragment:Rz,alphamap_pars_fragment:Wz,alphatest_fragment:Sz,alphatest_pars_fragment:Uz,aomap_fragment:Jz,aomap_pars_fragment:Vz,batching_pars_vertex:qz,batching_vertex:Kz,begin_vertex:_z,beginnormal_vertex:$z,bsdfs:Ac,iridescence_fragment:Pc,bumpmap_pars_fragment:ec,clipping_planes_fragment:tc,clipping_planes_pars_fragment:nc,clipping_planes_pars_vertex:sc,clipping_planes_vertex:ic,color_fragment:vc,color_pars_fragment:rc,color_pars_vertex:oc,color_vertex:Dc,common:zc,cube_uv_reflection_fragment:cc,defaultnormal_vertex:ac,displacementmap_pars_vertex:gc,displacementmap_vertex:Tc,emissivemap_fragment:Bc,emissivemap_pars_fragment:fc,colorspace_fragment:wc,colorspace_pars_fragment:jc,envmap_fragment:Ec,envmap_common_pars_fragment:lc,envmap_pars_fragment:hc,envmap_pars_vertex:uc,envmap_physical_pars_fragment:Lc,envmap_vertex:mc,fog_vertex:Mc,fog_pars_vertex:Qc,fog_fragment:dc,fog_pars_fragment:bc,gradientmap_pars_fragment:Yc,lightmap_pars_fragment:pc,lights_lambert_fragment:yc,lights_lambert_pars_fragment:xc,lights_pars_begin:Oc,lights_toon_fragment:Ic,lights_toon_pars_fragment:kc,lights_phong_fragment:Hc,lights_phong_pars_fragment:Gc,lights_physical_fragment:Cc,lights_physical_pars_fragment:Fc,lights_fragment_begin:Nc,lights_fragment_maps:Xc,lights_fragment_end:Zc,logdepthbuf_fragment:Rc,logdepthbuf_pars_fragment:Wc,logdepthbuf_pars_vertex:Sc,logdepthbuf_vertex:Uc,map_fragment:Jc,map_pars_fragment:Vc,map_particle_fragment:qc,map_particle_pars_fragment:Kc,metalnessmap_fragment:_c,metalnessmap_pars_fragment:$c,morphinstance_vertex:Aa,morphcolor_vertex:Pa,morphnormal_vertex:ea,morphtarget_pars_vertex:ta,morphtarget_vertex:na,normal_fragment_begin:sa,normal_fragment_maps:ia,normal_pars_fragment:va,normal_pars_vertex:ra,normal_vertex:oa,normalmap_pars_fragment:Da,clearcoat_normal_fragment_begin:za,clearcoat_normal_fragment_maps:ca,clearcoat_pars_fragment:aa,iridescence_pars_fragment:ga,opaque_fragment:Ta,packing:Ba,premultiplied_alpha_fragment:fa,project_vertex:wa,dithering_fragment:ja,dithering_pars_fragment:Ea,roughnessmap_fragment:la,roughnessmap_pars_fragment:ha,shadowmap_pars_fragment:ua,shadowmap_pars_vertex:ma,shadowmap_vertex:Ma,shadowmask_pars_fragment:Qa,skinbase_vertex:da,skinning_pars_vertex:ba,skinning_vertex:Ya,skinnormal_vertex:pa,specularmap_fragment:ya,specularmap_pars_fragment:xa,tonemapping_fragment:Oa,tonemapping_pars_fragment:La,transmission_fragment:Ia,transmission_pars_fragment:ka,uv_pars_fragment:Ha,uv_pars_vertex:Ga,uv_vertex:Ca,worldpos_vertex:Fa,background_vert:Na,background_frag:Xa,backgroundCube_vert:Za,backgroundCube_frag:Ra,cube_vert:Wa,cube_frag:Sa,depth_vert:Ua,depth_frag:Ja,distanceRGBA_vert:Va,distanceRGBA_frag:qa,equirect_vert:Ka,equirect_frag:_a,linedashed_vert:$a,linedashed_frag:Ag,meshbasic_vert:Pg,meshbasic_frag:eg,meshlambert_vert:tg,meshlambert_frag:ng,meshmatcap_vert:sg,meshmatcap_frag:ig,meshnormal_vert:vg,meshnormal_frag:rg,meshphong_vert:og,meshphong_frag:Dg,meshphysical_vert:zg,meshphysical_frag:cg,meshtoon_vert:ag,meshtoon_frag:gg,points_vert:Tg,points_frag:Bg,shadow_vert:fg,shadow_frag:wg,sprite_vert:jg,sprite_frag:Eg},nA={common:{diffuse:{value:new mA(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new IA},alphaMap:{value:null},alphaMapTransform:{value:new IA},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new IA}},envmap:{envMap:{value:null},envMapRotation:{value:new IA},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new IA}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new IA}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new IA},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new IA},normalScale:{value:new bA(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new IA},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new IA}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new IA}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new IA}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new mA(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new mA(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new IA},alphaTest:{value:0},uvTransform:{value:new IA}},sprite:{diffuse:{value:new mA(16777215)},opacity:{value:1},center:{value:new bA(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new IA},alphaMap:{value:null},alphaMapTransform:{value:new IA},alphaTest:{value:0}}},Qe={basic:{uniforms:xP([nA.common,nA.specularmap,nA.envmap,nA.aomap,nA.lightmap,nA.fog]),vertexShader:GA.meshbasic_vert,fragmentShader:GA.meshbasic_frag},lambert:{uniforms:xP([nA.common,nA.specularmap,nA.envmap,nA.aomap,nA.lightmap,nA.emissivemap,nA.bumpmap,nA.normalmap,nA.displacementmap,nA.fog,nA.lights,{emissive:{value:new mA(0)}}]),vertexShader:GA.meshlambert_vert,fragmentShader:GA.meshlambert_frag},phong:{uniforms:xP([nA.common,nA.specularmap,nA.envmap,nA.aomap,nA.lightmap,nA.emissivemap,nA.bumpmap,nA.normalmap,nA.displacementmap,nA.fog,nA.lights,{emissive:{value:new mA(0)},specular:{value:new mA(1118481)},shininess:{value:30}}]),vertexShader:GA.meshphong_vert,fragmentShader:GA.meshphong_frag},standard:{uniforms:xP([nA.common,nA.envmap,nA.aomap,nA.lightmap,nA.emissivemap,nA.bumpmap,nA.normalmap,nA.displacementmap,nA.roughnessmap,nA.metalnessmap,nA.fog,nA.lights,{emissive:{value:new mA(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:GA.meshphysical_vert,fragmentShader:GA.meshphysical_frag},toon:{uniforms:xP([nA.common,nA.aomap,nA.lightmap,nA.emissivemap,nA.bumpmap,nA.normalmap,nA.displacementmap,nA.gradientmap,nA.fog,nA.lights,{emissive:{value:new mA(0)}}]),vertexShader:GA.meshtoon_vert,fragmentShader:GA.meshtoon_frag},matcap:{uniforms:xP([nA.common,nA.bumpmap,nA.normalmap,nA.displacementmap,nA.fog,{matcap:{value:null}}]),vertexShader:GA.meshmatcap_vert,fragmentShader:GA.meshmatcap_frag},points:{uniforms:xP([nA.points,nA.fog]),vertexShader:GA.points_vert,fragmentShader:GA.points_frag},dashed:{uniforms:xP([nA.common,nA.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:GA.linedashed_vert,fragmentShader:GA.linedashed_frag},depth:{uniforms:xP([nA.common,nA.displacementmap]),vertexShader:GA.depth_vert,fragmentShader:GA.depth_frag},normal:{uniforms:xP([nA.common,nA.bumpmap,nA.normalmap,nA.displacementmap,{opacity:{value:1}}]),vertexShader:GA.meshnormal_vert,fragmentShader:GA.meshnormal_frag},sprite:{uniforms:xP([nA.sprite,nA.fog]),vertexShader:GA.sprite_vert,fragmentShader:GA.sprite_frag},background:{uniforms:{uvTransform:{value:new IA},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:GA.background_vert,fragmentShader:GA.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new IA}},vertexShader:GA.backgroundCube_vert,fragmentShader:GA.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:GA.cube_vert,fragmentShader:GA.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:GA.equirect_vert,fragmentShader:GA.equirect_frag},distanceRGBA:{uniforms:xP([nA.common,nA.displacementmap,{referencePosition:{value:new y},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:GA.distanceRGBA_vert,fragmentShader:GA.distanceRGBA_frag},shadow:{uniforms:xP([nA.lights,nA.fog,{color:{value:new mA(0)},opacity:{value:1}}]),vertexShader:GA.shadow_vert,fragmentShader:GA.shadow_frag}};Qe.physical={uniforms:xP([Qe.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new IA},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new IA},clearcoatNormalScale:{value:new bA(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new IA},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new IA},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new IA},sheen:{value:0},sheenColor:{value:new mA(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new IA},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new IA},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new IA},transmissionSamplerSize:{value:new bA},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new IA},attenuationDistance:{value:0},attenuationColor:{value:new mA(0)},specularColor:{value:new mA(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new IA},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new IA},anisotropyVector:{value:new bA},anisotropyMap:{value:null},anisotropyMapTransform:{value:new IA}}]),vertexShader:GA.meshphysical_vert,fragmentShader:GA.meshphysical_frag};var yv={r:0,b:0,g:0},It=new oe,lg=new yA;function hg(n,A,P,e,t,s,i){let v=new mA(0),o=s===!0?0:1,r,D,z=null,c=0,g=null;function B(u){let j=u.isScene===!0?u.background:null;return j&&j.isTexture&&(j=(u.backgroundBlurriness>0?P:A).get(j)),j}function f(u){let j=!1,d=B(u);d===null?a(v,o):d&&d.isColor&&(a(d,1),j=!0);let Q=n.xr.getEnvironmentBlendMode();Q==="additive"?e.buffers.color.setClear(0,0,0,1,i):Q==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,i),(n.autoClear||j)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),n.clear(n.autoClearColor,n.autoClearDepth,n.autoClearStencil))}function T(u,j){let d=B(j);d&&(d.isCubeTexture||d.mapping===Ys)?(D===void 0&&(D=new eP(new gn(1,1,1),new VP({name:"BackgroundCubeMaterial",uniforms:Lt(Qe.backgroundCube.uniforms),vertexShader:Qe.backgroundCube.vertexShader,fragmentShader:Qe.backgroundCube.fragmentShader,side:HP,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),D.geometry.deleteAttribute("normal"),D.geometry.deleteAttribute("uv"),D.onBeforeRender=function(Q,Y,x){this.matrixWorld.copyPosition(x.matrixWorld)},Object.defineProperty(D.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),t.update(D)),It.copy(j.backgroundRotation),It.x*=-1,It.y*=-1,It.z*=-1,d.isCubeTexture&&d.isRenderTargetTexture===!1&&(It.y*=-1,It.z*=-1),D.material.uniforms.envMap.value=d,D.material.uniforms.flipEnvMap.value=d.isCubeTexture&&d.isRenderTargetTexture===!1?-1:1,D.material.uniforms.backgroundBlurriness.value=j.backgroundBlurriness,D.material.uniforms.backgroundIntensity.value=j.backgroundIntensity,D.material.uniforms.backgroundRotation.value.setFromMatrix4(lg.makeRotationFromEuler(It)),D.material.toneMapped=ZA.getTransfer(d.colorSpace)!==qA,(z!==d||c!==d.version||g!==n.toneMapping)&&(D.material.needsUpdate=!0,z=d,c=d.version,g=n.toneMapping),D.layers.enableAll(),u.unshift(D,D.geometry,D.material,0,0,null)):d&&d.isTexture&&(r===void 0&&(r=new eP(new vt(2,2),new VP({name:"BackgroundMaterial",uniforms:Lt(Qe.background.uniforms),vertexShader:Qe.background.vertexShader,fragmentShader:Qe.background.fragmentShader,side:re,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),r.geometry.deleteAttribute("normal"),Object.defineProperty(r.material,"map",{get:function(){return this.uniforms.t2D.value}}),t.update(r)),r.material.uniforms.t2D.value=d,r.material.uniforms.backgroundIntensity.value=j.backgroundIntensity,r.material.toneMapped=ZA.getTransfer(d.colorSpace)!==qA,d.matrixAutoUpdate===!0&&d.updateMatrix(),r.material.uniforms.uvTransform.value.copy(d.matrix),(z!==d||c!==d.version||g!==n.toneMapping)&&(r.material.needsUpdate=!0,z=d,c=d.version,g=n.toneMapping),r.layers.enableAll(),u.unshift(r,r.geometry,r.material,0,0,null))}function a(u,j){u.getRGB(yv,_r(n)),e.buffers.color.setClear(yv.r,yv.g,yv.b,j,i)}function m(){D!==void 0&&(D.geometry.dispose(),D.material.dispose(),D=void 0),r!==void 0&&(r.geometry.dispose(),r.material.dispose(),r=void 0)}return{getClearColor:function(){return v},setClearColor:function(u,j=1){v.set(u),o=j,a(v,o)},getClearAlpha:function(){return o},setClearAlpha:function(u){o=u,a(v,o)},render:f,addToRenderList:T,dispose:m}}function ug(n,A){let P=n.getParameter(n.MAX_VERTEX_ATTRIBS),e={},t=c(null),s=t,i=!1;function v(l,p,k,F,Z){let S=!1,R=z(F,k,p);s!==R&&(s=R,r(s.object)),S=g(l,F,k,Z),S&&B(l,F,k,Z),Z!==null&&A.update(Z,n.ELEMENT_ARRAY_BUFFER),(S||i)&&(i=!1,j(l,p,k,F),Z!==null&&n.bindBuffer(n.ELEMENT_ARRAY_BUFFER,A.get(Z).buffer))}function o(){return n.createVertexArray()}function r(l){return n.bindVertexArray(l)}function D(l){return n.deleteVertexArray(l)}function z(l,p,k){let F=k.wireframe===!0,Z=e[l.id];Z===void 0&&(Z={},e[l.id]=Z);let S=Z[p.id];S===void 0&&(S={},Z[p.id]=S);let R=S[F];return R===void 0&&(R=c(o()),S[F]=R),R}function c(l){let p=[],k=[],F=[];for(let Z=0;Z<P;Z++)p[Z]=0,k[Z]=0,F[Z]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:p,enabledAttributes:k,attributeDivisors:F,object:l,attributes:{},index:null}}function g(l,p,k,F){let Z=s.attributes,S=p.attributes,R=0,PA=k.getAttributes();for(let N in PA)if(PA[N].location>=0){let oA=Z[N],hA=S[N];if(hA===void 0&&(N==="instanceMatrix"&&l.instanceMatrix&&(hA=l.instanceMatrix),N==="instanceColor"&&l.instanceColor&&(hA=l.instanceColor)),oA===void 0||oA.attribute!==hA||hA&&oA.data!==hA.data)return!0;R++}return s.attributesNum!==R||s.index!==F}function B(l,p,k,F){let Z={},S=p.attributes,R=0,PA=k.getAttributes();for(let N in PA)if(PA[N].location>=0){let oA=S[N];oA===void 0&&(N==="instanceMatrix"&&l.instanceMatrix&&(oA=l.instanceMatrix),N==="instanceColor"&&l.instanceColor&&(oA=l.instanceColor));let hA={};hA.attribute=oA,oA&&oA.data&&(hA.data=oA.data),Z[N]=hA,R++}s.attributes=Z,s.attributesNum=R,s.index=F}function f(){let l=s.newAttributes;for(let p=0,k=l.length;p<k;p++)l[p]=0}function T(l){a(l,0)}function a(l,p){let k=s.newAttributes,F=s.enabledAttributes,Z=s.attributeDivisors;k[l]=1,F[l]===0&&(n.enableVertexAttribArray(l),F[l]=1),Z[l]!==p&&(n.vertexAttribDivisor(l,p),Z[l]=p)}function m(){let l=s.newAttributes,p=s.enabledAttributes;for(let k=0,F=p.length;k<F;k++)p[k]!==l[k]&&(n.disableVertexAttribArray(k),p[k]=0)}function u(l,p,k,F,Z,S,R){R===!0?n.vertexAttribIPointer(l,p,k,Z,S):n.vertexAttribPointer(l,p,k,F,Z,S)}function j(l,p,k,F){f();let Z=F.attributes,S=k.getAttributes(),R=p.defaultAttributeValues;for(let PA in S){let N=S[PA];if(N.location>=0){let sA=Z[PA];if(sA===void 0&&(PA==="instanceMatrix"&&l.instanceMatrix&&(sA=l.instanceMatrix),PA==="instanceColor"&&l.instanceColor&&(sA=l.instanceColor)),sA!==void 0){let oA=sA.normalized,hA=sA.itemSize,CA=A.get(sA);if(CA===void 0)continue;let AP=CA.buffer,sP=CA.type,UA=CA.bytesPerElement,U=sP===n.INT||sP===n.UNSIGNED_INT||sA.gpuType===qi;if(sA.isInterleavedBufferAttribute){let q=sA.data,cA=q.stride,xA=sA.offset;if(q.isInstancedInterleavedBuffer){for(let lA=0;lA<N.locationSize;lA++)a(N.location+lA,q.meshPerAttribute);l.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=q.meshPerAttribute*q.count)}else for(let lA=0;lA<N.locationSize;lA++)T(N.location+lA);n.bindBuffer(n.ARRAY_BUFFER,AP);for(let lA=0;lA<N.locationSize;lA++)u(N.location+lA,hA/N.locationSize,sP,oA,cA*UA,(xA+hA/N.locationSize*lA)*UA,U)}else{if(sA.isInstancedBufferAttribute){for(let q=0;q<N.locationSize;q++)a(N.location+q,sA.meshPerAttribute);l.isInstancedMesh!==!0&&F._maxInstanceCount===void 0&&(F._maxInstanceCount=sA.meshPerAttribute*sA.count)}else for(let q=0;q<N.locationSize;q++)T(N.location+q);n.bindBuffer(n.ARRAY_BUFFER,AP);for(let q=0;q<N.locationSize;q++)u(N.location+q,hA/N.locationSize,sP,oA,hA*UA,hA/N.locationSize*q*UA,U)}}else if(R!==void 0){let oA=R[PA];if(oA!==void 0)switch(oA.length){case 2:n.vertexAttrib2fv(N.location,oA);break;case 3:n.vertexAttrib3fv(N.location,oA);break;case 4:n.vertexAttrib4fv(N.location,oA);break;default:n.vertexAttrib1fv(N.location,oA)}}}}m()}function d(){x();for(let l in e){let p=e[l];for(let k in p){let F=p[k];for(let Z in F)D(F[Z].object),delete F[Z];delete p[k]}delete e[l]}}function Q(l){if(e[l.id]===void 0)return;let p=e[l.id];for(let k in p){let F=p[k];for(let Z in F)D(F[Z].object),delete F[Z];delete p[k]}delete e[l.id]}function Y(l){for(let p in e){let k=e[p];if(k[l.id]===void 0)continue;let F=k[l.id];for(let Z in F)D(F[Z].object),delete F[Z];delete k[l.id]}}function x(){h(),i=!0,s!==t&&(s=t,r(s.object))}function h(){t.geometry=null,t.program=null,t.wireframe=!1}return{setup:v,reset:x,resetDefaultState:h,dispose:d,releaseStatesOfGeometry:Q,releaseStatesOfProgram:Y,initAttributes:f,enableAttribute:T,disableUnusedAttributes:m}}function mg(n,A,P){let e;function t(r){e=r}function s(r,D){n.drawArrays(e,r,D),P.update(D,e,1)}function i(r,D,z){z!==0&&(n.drawArraysInstanced(e,r,D,z),P.update(D,e,z))}function v(r,D,z){if(z===0)return;A.get("WEBGL_multi_draw").multiDrawArraysWEBGL(e,r,0,D,0,z);let g=0;for(let B=0;B<z;B++)g+=D[B];P.update(g,e,1)}function o(r,D,z,c){if(z===0)return;let g=A.get("WEBGL_multi_draw");if(g===null)for(let B=0;B<r.length;B++)i(r[B],D[B],c[B]);else{g.multiDrawArraysInstancedWEBGL(e,r,0,D,0,c,0,z);let B=0;for(let f=0;f<z;f++)B+=D[f]*c[f];P.update(B,e,1)}}this.setMode=t,this.render=s,this.renderInstances=i,this.renderMultiDraw=v,this.renderMultiDrawInstances=o}function Mg(n,A,P,e){let t;function s(){if(t!==void 0)return t;if(A.has("EXT_texture_filter_anisotropic")===!0){let Y=A.get("EXT_texture_filter_anisotropic");t=n.getParameter(Y.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else t=0;return t}function i(Y){return!(Y!==qP&&e.convert(Y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_FORMAT))}function v(Y){let x=Y===Qn&&(A.has("EXT_color_buffer_half_float")||A.has("EXT_color_buffer_float"));return!(Y!==ce&&e.convert(Y)!==n.getParameter(n.IMPLEMENTATION_COLOR_READ_TYPE)&&Y!==Ae&&!x)}function o(Y){if(Y==="highp"){if(n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.HIGH_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.HIGH_FLOAT).precision>0)return"highp";Y="mediump"}return Y==="mediump"&&n.getShaderPrecisionFormat(n.VERTEX_SHADER,n.MEDIUM_FLOAT).precision>0&&n.getShaderPrecisionFormat(n.FRAGMENT_SHADER,n.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let r=P.precision!==void 0?P.precision:"highp",D=o(r);D!==r&&(console.warn("THREE.WebGLRenderer:",r,"not supported, using",D,"instead."),r=D);let z=P.logarithmicDepthBuffer===!0,c=P.reversedDepthBuffer===!0&&A.has("EXT_clip_control"),g=n.getParameter(n.MAX_TEXTURE_IMAGE_UNITS),B=n.getParameter(n.MAX_VERTEX_TEXTURE_IMAGE_UNITS),f=n.getParameter(n.MAX_TEXTURE_SIZE),T=n.getParameter(n.MAX_CUBE_MAP_TEXTURE_SIZE),a=n.getParameter(n.MAX_VERTEX_ATTRIBS),m=n.getParameter(n.MAX_VERTEX_UNIFORM_VECTORS),u=n.getParameter(n.MAX_VARYING_VECTORS),j=n.getParameter(n.MAX_FRAGMENT_UNIFORM_VECTORS),d=B>0,Q=n.getParameter(n.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:o,textureFormatReadable:i,textureTypeReadable:v,precision:r,logarithmicDepthBuffer:z,reversedDepthBuffer:c,maxTextures:g,maxVertexTextures:B,maxTextureSize:f,maxCubemapSize:T,maxAttributes:a,maxVertexUniforms:m,maxVaryings:u,maxFragmentUniforms:j,vertexTextures:d,maxSamples:Q}}function Qg(n){let A=this,P=null,e=0,t=!1,s=!1,i=new Te,v=new IA,o={value:null,needsUpdate:!1};this.uniform=o,this.numPlanes=0,this.numIntersection=0,this.init=function(z,c){let g=z.length!==0||c||e!==0||t;return t=c,e=z.length,g},this.beginShadows=function(){s=!0,D(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(z,c){P=D(z,c,0)},this.setState=function(z,c,g){let B=z.clippingPlanes,f=z.clipIntersection,T=z.clipShadows,a=n.get(z);if(!t||B===null||B.length===0||s&&!T)s?D(null):r();else{let m=s?0:e,u=m*4,j=a.clippingState||null;o.value=j,j=D(B,c,u,g);for(let d=0;d!==u;++d)j[d]=P[d];a.clippingState=j,this.numIntersection=f?this.numPlanes:0,this.numPlanes+=m}};function r(){o.value!==P&&(o.value=P,o.needsUpdate=e>0),A.numPlanes=e,A.numIntersection=0}function D(z,c,g,B){let f=z!==null?z.length:0,T=null;if(f!==0){if(T=o.value,B!==!0||T===null){let a=g+f*4,m=c.matrixWorldInverse;v.getNormalMatrix(m),(T===null||T.length<a)&&(T=new Float32Array(a));for(let u=0,j=g;u!==f;++u,j+=4)i.copy(z[u]).applyMatrix4(m,v),i.normal.toArray(T,j),T[j+3]=i.constant}o.value=T,o.needsUpdate=!0}return A.numPlanes=f,A.numIntersection=0,T}}function dg(n){let A=new WeakMap;function P(i,v){return v===Ui?i.mapping=yt:v===Ji&&(i.mapping=xt),i}function e(i){if(i&&i.isTexture){let v=i.mapping;if(v===Ui||v===Ji)if(A.has(i)){let o=A.get(i).texture;return P(o,i.mapping)}else{let o=i.image;if(o&&o.height>0){let r=new Mi(o.height);return r.fromEquirectangularTexture(n,i),A.set(i,r),i.addEventListener("dispose",t),P(r.texture,i.mapping)}else return null}}return i}function t(i){let v=i.target;v.removeEventListener("dispose",t);let o=A.get(v);o!==void 0&&(A.delete(v),o.dispose())}function s(){A=new WeakMap}return{get:e,dispose:s}}var yn=4,N9=[.125,.215,.35,.446,.526,.582],Gt=20,eo=new Yt,X9=new mA,to=null,no=0,so=0,io=!1,Ht=(1+Math.sqrt(5))/2,pn=1/Ht,Z9=[new y(-Ht,pn,0),new y(Ht,pn,0),new y(-pn,0,Ht),new y(pn,0,Ht),new y(0,Ht,-pn),new y(0,Ht,pn),new y(-1,1,-1),new y(1,1,-1),new y(-1,1,1),new y(1,1,1)],bg=new y,Lv=class{constructor(A){this._renderer=A,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(A,P=0,e=.1,t=100,s={}){let{size:i=256,position:v=bg}=s;to=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(i);let o=this._allocateTargets();return o.depthBuffer=!0,this._sceneToCubeUV(A,e,t,o,v),P>0&&this._blur(o,0,0,P),this._applyPMREM(o),this._cleanup(o),o}fromEquirectangular(A,P=null){return this._fromTexture(A,P)}fromCubemap(A,P=null){return this._fromTexture(A,P)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=S9(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=W9(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(A){this._lodMax=Math.floor(Math.log2(A)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let A=0;A<this._lodPlanes.length;A++)this._lodPlanes[A].dispose()}_cleanup(A){this._renderer.setRenderTarget(to,no,so),this._renderer.xr.enabled=io,A.scissorTest=!1,xv(A,0,0,A.width,A.height)}_fromTexture(A,P){A.mapping===yt||A.mapping===xt?this._setSize(A.image.length===0?16:A.image[0].width||A.image[0].image.width):this._setSize(A.image.width/4),to=this._renderer.getRenderTarget(),no=this._renderer.getActiveCubeFace(),so=this._renderer.getActiveMipmapLevel(),io=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;let e=P||this._allocateTargets();return this._textureToCubeUV(A,e),this._applyPMREM(e),this._cleanup(e),e}_allocateTargets(){let A=3*Math.max(this._cubeSize,112),P=4*this._cubeSize,e={magFilter:IP,minFilter:IP,generateMipmaps:!1,type:Qn,format:qP,colorSpace:QP,depthBuffer:!1},t=R9(A,P,e);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==A||this._pingPongRenderTarget.height!==P){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=R9(A,P,e);let{_lodMax:s}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=Yg(s)),this._blurMaterial=pg(s,A,P)}return t}_compileMaterial(A){let P=new eP(this._lodPlanes[0],A);this._renderer.compile(P,eo)}_sceneToCubeUV(A,P,e,t,s){let o=new BP(90,1,P,e),r=[1,-1,1,1,1,1],D=[1,1,1,-1,-1,-1],z=this._renderer,c=z.autoClear,g=z.toneMapping;z.getClearColor(X9),z.toneMapping=Ue,z.autoClear=!1,z.state.buffers.depth.getReversed()&&(z.setRenderTarget(t),z.clearDepth(),z.setRenderTarget(null));let f=new De({name:"PMREM.Background",side:HP,depthWrite:!1,depthTest:!1}),T=new eP(new gn,f),a=!1,m=A.background;m?m.isColor&&(f.color.copy(m),A.background=null,a=!0):(f.color.copy(X9),a=!0);for(let u=0;u<6;u++){let j=u%3;j===0?(o.up.set(0,r[u],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x+D[u],s.y,s.z)):j===1?(o.up.set(0,0,r[u]),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y+D[u],s.z)):(o.up.set(0,r[u],0),o.position.set(s.x,s.y,s.z),o.lookAt(s.x,s.y,s.z+D[u]));let d=this._cubeSize;xv(t,j*d,u>2?d:0,d,d),z.setRenderTarget(t),a&&z.render(T,o),z.render(A,o)}T.geometry.dispose(),T.material.dispose(),z.toneMapping=g,z.autoClear=c,A.background=m}_textureToCubeUV(A,P){let e=this._renderer,t=A.mapping===yt||A.mapping===xt;t?(this._cubemapMaterial===null&&(this._cubemapMaterial=S9()),this._cubemapMaterial.uniforms.flipEnvMap.value=A.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=W9());let s=t?this._cubemapMaterial:this._equirectMaterial,i=new eP(this._lodPlanes[0],s),v=s.uniforms;v.envMap.value=A;let o=this._cubeSize;xv(P,0,0,3*o,2*o),e.setRenderTarget(P),e.render(i,eo)}_applyPMREM(A){let P=this._renderer,e=P.autoClear;P.autoClear=!1;let t=this._lodPlanes.length;for(let s=1;s<t;s++){let i=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),v=Z9[(t-s-1)%Z9.length];this._blur(A,s-1,s,i,v)}P.autoClear=e}_blur(A,P,e,t,s){let i=this._pingPongRenderTarget;this._halfBlur(A,i,P,e,t,"latitudinal",s),this._halfBlur(i,A,e,e,t,"longitudinal",s)}_halfBlur(A,P,e,t,s,i,v){let o=this._renderer,r=this._blurMaterial;i!=="latitudinal"&&i!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let D=3,z=new eP(this._lodPlanes[t],r),c=r.uniforms,g=this._sizeLods[e]-1,B=isFinite(s)?Math.PI/(2*g):2*Math.PI/(2*Gt-1),f=s/B,T=isFinite(s)?1+Math.floor(D*f):Gt;T>Gt&&console.warn(`sigmaRadians, ${s}, is too large and will clip, as it requested ${T} samples when the maximum is set to ${Gt}`);let a=[],m=0;for(let Y=0;Y<Gt;++Y){let x=Y/f,h=Math.exp(-x*x/2);a.push(h),Y===0?m+=h:Y<T&&(m+=2*h)}for(let Y=0;Y<a.length;Y++)a[Y]=a[Y]/m;c.envMap.value=A.texture,c.samples.value=T,c.weights.value=a,c.latitudinal.value=i==="latitudinal",v&&(c.poleAxis.value=v);let{_lodMax:u}=this;c.dTheta.value=B,c.mipInt.value=u-e;let j=this._sizeLods[t],d=3*j*(t>u-yn?t-u+yn:0),Q=4*(this._cubeSize-j);xv(P,d,Q,3*j,2*j),o.setRenderTarget(P),o.render(z,eo)}};function Yg(n){let A=[],P=[],e=[],t=n,s=n-yn+1+N9.length;for(let i=0;i<s;i++){let v=Math.pow(2,t);P.push(v);let o=1/v;i>n-yn?o=N9[i-n+yn-1]:i===0&&(o=0),e.push(o);let r=1/(v-2),D=-r,z=1+r,c=[D,D,z,D,z,z,D,D,z,z,D,z],g=6,B=6,f=3,T=2,a=1,m=new Float32Array(f*B*g),u=new Float32Array(T*B*g),j=new Float32Array(a*B*g);for(let Q=0;Q<g;Q++){let Y=Q%3*2/3-1,x=Q>2?0:-1,h=[Y,x,0,Y+2/3,x,0,Y+2/3,x+1,0,Y,x,0,Y+2/3,x+1,0,Y,x+1,0];m.set(h,f*B*Q),u.set(c,T*B*Q);let l=[Q,Q,Q,Q,Q,Q];j.set(l,a*B*Q)}let d=new pP;d.setAttribute("position",new fP(m,f)),d.setAttribute("uv",new fP(u,T)),d.setAttribute("faceIndex",new fP(j,a)),A.push(d),t>yn&&t--}return{lodPlanes:A,sizeLods:P,sigmas:e}}function R9(n,A,P){let e=new we(n,A,P);return e.texture.mapping=Ys,e.texture.name="PMREM.cubeUv",e.scissorTest=!0,e}function xv(n,A,P,e,t){n.viewport.set(A,P,e,t),n.scissor.set(A,P,e,t)}function pg(n,A,P){let e=new Float32Array(Gt),t=new y(0,1,0);return new VP({name:"SphericalGaussianBlur",defines:{n:Gt,CUBEUV_TEXEL_WIDTH:1/A,CUBEUV_TEXEL_HEIGHT:1/P,CUBEUV_MAX_MIP:`${n}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:e},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:t}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Se,depthTest:!1,depthWrite:!1})}function W9(){return new VP({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Se,depthTest:!1,depthWrite:!1})}function S9(){return new VP({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Bo(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Se,depthTest:!1,depthWrite:!1})}function Bo(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function yg(n){let A=new WeakMap,P=null;function e(v){if(v&&v.isTexture){let o=v.mapping,r=o===Ui||o===Ji,D=o===yt||o===xt;if(r||D){let z=A.get(v),c=z!==void 0?z.texture.pmremVersion:0;if(v.isRenderTargetTexture&&v.pmremVersion!==c)return P===null&&(P=new Lv(n)),z=r?P.fromEquirectangular(v,z):P.fromCubemap(v,z),z.texture.pmremVersion=v.pmremVersion,A.set(v,z),z.texture;if(z!==void 0)return z.texture;{let g=v.image;return r&&g&&g.height>0||D&&g&&t(g)?(P===null&&(P=new Lv(n)),z=r?P.fromEquirectangular(v):P.fromCubemap(v),z.texture.pmremVersion=v.pmremVersion,A.set(v,z),v.addEventListener("dispose",s),z.texture):null}}}return v}function t(v){let o=0,r=6;for(let D=0;D<r;D++)v[D]!==void 0&&o++;return o===r}function s(v){let o=v.target;o.removeEventListener("dispose",s);let r=A.get(o);r!==void 0&&(A.delete(o),r.dispose())}function i(){A=new WeakMap,P!==null&&(P.dispose(),P=null)}return{get:e,dispose:i}}function xg(n){let A={};function P(e){if(A[e]!==void 0)return A[e];let t;switch(e){case"WEBGL_depth_texture":t=n.getExtension("WEBGL_depth_texture")||n.getExtension("MOZ_WEBGL_depth_texture")||n.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":t=n.getExtension("EXT_texture_filter_anisotropic")||n.getExtension("MOZ_EXT_texture_filter_anisotropic")||n.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":t=n.getExtension("WEBGL_compressed_texture_s3tc")||n.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":t=n.getExtension("WEBGL_compressed_texture_pvrtc")||n.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:t=n.getExtension(e)}return A[e]=t,t}return{has:function(e){return P(e)!==null},init:function(){P("EXT_color_buffer_float"),P("WEBGL_clip_cull_distance"),P("OES_texture_float_linear"),P("EXT_color_buffer_half_float"),P("WEBGL_multisampled_render_to_texture"),P("WEBGL_render_shared_exponent")},get:function(e){let t=P(e);return t===null&&cn("THREE.WebGLRenderer: "+e+" extension not supported."),t}}}function Og(n,A,P,e){let t={},s=new WeakMap;function i(z){let c=z.target;c.index!==null&&A.remove(c.index);for(let B in c.attributes)A.remove(c.attributes[B]);c.removeEventListener("dispose",i),delete t[c.id];let g=s.get(c);g&&(A.remove(g),s.delete(c)),e.releaseStatesOfGeometry(c),c.isInstancedBufferGeometry===!0&&delete c._maxInstanceCount,P.memory.geometries--}function v(z,c){return t[c.id]===!0||(c.addEventListener("dispose",i),t[c.id]=!0,P.memory.geometries++),c}function o(z){let c=z.attributes;for(let g in c)A.update(c[g],n.ARRAY_BUFFER)}function r(z){let c=[],g=z.index,B=z.attributes.position,f=0;if(g!==null){let m=g.array;f=g.version;for(let u=0,j=m.length;u<j;u+=3){let d=m[u+0],Q=m[u+1],Y=m[u+2];c.push(d,Q,Q,Y,Y,d)}}else if(B!==void 0){let m=B.array;f=B.version;for(let u=0,j=m.length/3-1;u<j;u+=3){let d=u+0,Q=u+1,Y=u+2;c.push(d,Q,Q,Y,Y,d)}}else return;let T=new(Kr(c)?ss:ns)(c,1);T.version=f;let a=s.get(z);a&&A.remove(a),s.set(z,T)}function D(z){let c=s.get(z);if(c){let g=z.index;g!==null&&c.version<g.version&&r(z)}else r(z);return s.get(z)}return{get:v,update:o,getWireframeAttribute:D}}function Lg(n,A,P){let e;function t(c){e=c}let s,i;function v(c){s=c.type,i=c.bytesPerElement}function o(c,g){n.drawElements(e,g,s,c*i),P.update(g,e,1)}function r(c,g,B){B!==0&&(n.drawElementsInstanced(e,g,s,c*i,B),P.update(g,e,B))}function D(c,g,B){if(B===0)return;A.get("WEBGL_multi_draw").multiDrawElementsWEBGL(e,g,0,s,c,0,B);let T=0;for(let a=0;a<B;a++)T+=g[a];P.update(T,e,1)}function z(c,g,B,f){if(B===0)return;let T=A.get("WEBGL_multi_draw");if(T===null)for(let a=0;a<c.length;a++)r(c[a]/i,g[a],f[a]);else{T.multiDrawElementsInstancedWEBGL(e,g,0,s,c,0,f,0,B);let a=0;for(let m=0;m<B;m++)a+=g[m]*f[m];P.update(a,e,1)}}this.setMode=t,this.setIndex=v,this.render=o,this.renderInstances=r,this.renderMultiDraw=D,this.renderMultiDrawInstances=z}function Ig(n){let A={geometries:0,textures:0},P={frame:0,calls:0,triangles:0,points:0,lines:0};function e(s,i,v){switch(P.calls++,i){case n.TRIANGLES:P.triangles+=v*(s/3);break;case n.LINES:P.lines+=v*(s/2);break;case n.LINE_STRIP:P.lines+=v*(s-1);break;case n.LINE_LOOP:P.lines+=v*s;break;case n.POINTS:P.points+=v*s;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",i);break}}function t(){P.calls=0,P.triangles=0,P.points=0,P.lines=0}return{memory:A,render:P,programs:null,autoReset:!0,reset:t,update:e}}function kg(n,A,P){let e=new WeakMap,t=new SA;function s(i,v,o){let r=i.morphTargetInfluences,D=v.morphAttributes.position||v.morphAttributes.normal||v.morphAttributes.color,z=D!==void 0?D.length:0,c=e.get(v);if(c===void 0||c.count!==z){let h=function(){Y.dispose(),e.delete(v),v.removeEventListener("dispose",h)};c!==void 0&&c.texture.dispose();let g=v.morphAttributes.position!==void 0,B=v.morphAttributes.normal!==void 0,f=v.morphAttributes.color!==void 0,T=v.morphAttributes.position||[],a=v.morphAttributes.normal||[],m=v.morphAttributes.color||[],u=0;g===!0&&(u=1),B===!0&&(u=2),f===!0&&(u=3);let j=v.attributes.position.count*u,d=1;j>A.maxTextureSize&&(d=Math.ceil(j/A.maxTextureSize),j=A.maxTextureSize);let Q=new Float32Array(j*d*4*z),Y=new es(Q,j,d,z);Y.type=Ae,Y.needsUpdate=!0;let x=u*4;for(let l=0;l<z;l++){let p=T[l],k=a[l],F=m[l],Z=j*d*4*l;for(let S=0;S<p.count;S++){let R=S*x;g===!0&&(t.fromBufferAttribute(p,S),Q[Z+R+0]=t.x,Q[Z+R+1]=t.y,Q[Z+R+2]=t.z,Q[Z+R+3]=0),B===!0&&(t.fromBufferAttribute(k,S),Q[Z+R+4]=t.x,Q[Z+R+5]=t.y,Q[Z+R+6]=t.z,Q[Z+R+7]=0),f===!0&&(t.fromBufferAttribute(F,S),Q[Z+R+8]=t.x,Q[Z+R+9]=t.y,Q[Z+R+10]=t.z,Q[Z+R+11]=F.itemSize===4?t.w:1)}}c={count:z,texture:Y,size:new bA(j,d)},e.set(v,c),v.addEventListener("dispose",h)}if(i.isInstancedMesh===!0&&i.morphTexture!==null)o.getUniforms().setValue(n,"morphTexture",i.morphTexture,P);else{let g=0;for(let f=0;f<r.length;f++)g+=r[f];let B=v.morphTargetsRelative?1:1-g;o.getUniforms().setValue(n,"morphTargetBaseInfluence",B),o.getUniforms().setValue(n,"morphTargetInfluences",r)}o.getUniforms().setValue(n,"morphTargetsTexture",c.texture,P),o.getUniforms().setValue(n,"morphTargetsTextureSize",c.size)}return{update:s}}function Hg(n,A,P,e){let t=new WeakMap;function s(o){let r=e.render.frame,D=o.geometry,z=A.get(o,D);if(t.get(z)!==r&&(A.update(z),t.set(z,r)),o.isInstancedMesh&&(o.hasEventListener("dispose",v)===!1&&o.addEventListener("dispose",v),t.get(o)!==r&&(P.update(o.instanceMatrix,n.ARRAY_BUFFER),o.instanceColor!==null&&P.update(o.instanceColor,n.ARRAY_BUFFER),t.set(o,r))),o.isSkinnedMesh){let c=o.skeleton;t.get(c)!==r&&(c.update(),t.set(c,r))}return z}function i(){t=new WeakMap}function v(o){let r=o.target;r.removeEventListener("dispose",v),P.remove(r.instanceMatrix),r.instanceColor!==null&&P.remove(r.instanceColor)}return{update:s,dispose:i}}var z8=new jP,U9=new ws(1,1),c8=new es,a8=new ui,g8=new vs,J9=[],V9=[],q9=new Float32Array(16),K9=new Float32Array(9),_9=new Float32Array(4);function On(n,A,P){let e=n[0];if(e<=0||e>0)return n;let t=A*P,s=J9[t];if(s===void 0&&(s=new Float32Array(t),J9[t]=s),A!==0){e.toArray(s,0);for(let i=1,v=0;i!==A;++i)v+=P,n[i].toArray(s,v)}return s}function EP(n,A){if(n.length!==A.length)return!1;for(let P=0,e=n.length;P<e;P++)if(n[P]!==A[P])return!1;return!0}function lP(n,A){for(let P=0,e=A.length;P<e;P++)n[P]=A[P]}function kv(n,A){let P=V9[A];P===void 0&&(P=new Int32Array(A),V9[A]=P);for(let e=0;e!==A;++e)P[e]=n.allocateTextureUnit();return P}function Gg(n,A){let P=this.cache;P[0]!==A&&(n.uniform1f(this.addr,A),P[0]=A)}function Cg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y)&&(n.uniform2f(this.addr,A.x,A.y),P[0]=A.x,P[1]=A.y);else{if(EP(P,A))return;n.uniform2fv(this.addr,A),lP(P,A)}}function Fg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z)&&(n.uniform3f(this.addr,A.x,A.y,A.z),P[0]=A.x,P[1]=A.y,P[2]=A.z);else if(A.r!==void 0)(P[0]!==A.r||P[1]!==A.g||P[2]!==A.b)&&(n.uniform3f(this.addr,A.r,A.g,A.b),P[0]=A.r,P[1]=A.g,P[2]=A.b);else{if(EP(P,A))return;n.uniform3fv(this.addr,A),lP(P,A)}}function Ng(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z||P[3]!==A.w)&&(n.uniform4f(this.addr,A.x,A.y,A.z,A.w),P[0]=A.x,P[1]=A.y,P[2]=A.z,P[3]=A.w);else{if(EP(P,A))return;n.uniform4fv(this.addr,A),lP(P,A)}}function Xg(n,A){let P=this.cache,e=A.elements;if(e===void 0){if(EP(P,A))return;n.uniformMatrix2fv(this.addr,!1,A),lP(P,A)}else{if(EP(P,e))return;_9.set(e),n.uniformMatrix2fv(this.addr,!1,_9),lP(P,e)}}function Zg(n,A){let P=this.cache,e=A.elements;if(e===void 0){if(EP(P,A))return;n.uniformMatrix3fv(this.addr,!1,A),lP(P,A)}else{if(EP(P,e))return;K9.set(e),n.uniformMatrix3fv(this.addr,!1,K9),lP(P,e)}}function Rg(n,A){let P=this.cache,e=A.elements;if(e===void 0){if(EP(P,A))return;n.uniformMatrix4fv(this.addr,!1,A),lP(P,A)}else{if(EP(P,e))return;q9.set(e),n.uniformMatrix4fv(this.addr,!1,q9),lP(P,e)}}function Wg(n,A){let P=this.cache;P[0]!==A&&(n.uniform1i(this.addr,A),P[0]=A)}function Sg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y)&&(n.uniform2i(this.addr,A.x,A.y),P[0]=A.x,P[1]=A.y);else{if(EP(P,A))return;n.uniform2iv(this.addr,A),lP(P,A)}}function Ug(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z)&&(n.uniform3i(this.addr,A.x,A.y,A.z),P[0]=A.x,P[1]=A.y,P[2]=A.z);else{if(EP(P,A))return;n.uniform3iv(this.addr,A),lP(P,A)}}function Jg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z||P[3]!==A.w)&&(n.uniform4i(this.addr,A.x,A.y,A.z,A.w),P[0]=A.x,P[1]=A.y,P[2]=A.z,P[3]=A.w);else{if(EP(P,A))return;n.uniform4iv(this.addr,A),lP(P,A)}}function Vg(n,A){let P=this.cache;P[0]!==A&&(n.uniform1ui(this.addr,A),P[0]=A)}function qg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y)&&(n.uniform2ui(this.addr,A.x,A.y),P[0]=A.x,P[1]=A.y);else{if(EP(P,A))return;n.uniform2uiv(this.addr,A),lP(P,A)}}function Kg(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z)&&(n.uniform3ui(this.addr,A.x,A.y,A.z),P[0]=A.x,P[1]=A.y,P[2]=A.z);else{if(EP(P,A))return;n.uniform3uiv(this.addr,A),lP(P,A)}}function _g(n,A){let P=this.cache;if(A.x!==void 0)(P[0]!==A.x||P[1]!==A.y||P[2]!==A.z||P[3]!==A.w)&&(n.uniform4ui(this.addr,A.x,A.y,A.z,A.w),P[0]=A.x,P[1]=A.y,P[2]=A.z,P[3]=A.w);else{if(EP(P,A))return;n.uniform4uiv(this.addr,A),lP(P,A)}}function $g(n,A,P){let e=this.cache,t=P.allocateTextureUnit();e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t);let s;this.type===n.SAMPLER_2D_SHADOW?(U9.compareFunction=Ur,s=U9):s=z8,P.setTexture2D(A||s,t)}function AT(n,A,P){let e=this.cache,t=P.allocateTextureUnit();e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t),P.setTexture3D(A||a8,t)}function PT(n,A,P){let e=this.cache,t=P.allocateTextureUnit();e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t),P.setTextureCube(A||g8,t)}function eT(n,A,P){let e=this.cache,t=P.allocateTextureUnit();e[0]!==t&&(n.uniform1i(this.addr,t),e[0]=t),P.setTexture2DArray(A||c8,t)}function tT(n){switch(n){case 5126:return Gg;case 35664:return Cg;case 35665:return Fg;case 35666:return Ng;case 35674:return Xg;case 35675:return Zg;case 35676:return Rg;case 5124:case 35670:return Wg;case 35667:case 35671:return Sg;case 35668:case 35672:return Ug;case 35669:case 35673:return Jg;case 5125:return Vg;case 36294:return qg;case 36295:return Kg;case 36296:return _g;case 35678:case 36198:case 36298:case 36306:case 35682:return $g;case 35679:case 36299:case 36307:return AT;case 35680:case 36300:case 36308:case 36293:return PT;case 36289:case 36303:case 36311:case 36292:return eT}}function nT(n,A){n.uniform1fv(this.addr,A)}function sT(n,A){let P=On(A,this.size,2);n.uniform2fv(this.addr,P)}function iT(n,A){let P=On(A,this.size,3);n.uniform3fv(this.addr,P)}function vT(n,A){let P=On(A,this.size,4);n.uniform4fv(this.addr,P)}function rT(n,A){let P=On(A,this.size,4);n.uniformMatrix2fv(this.addr,!1,P)}function oT(n,A){let P=On(A,this.size,9);n.uniformMatrix3fv(this.addr,!1,P)}function DT(n,A){let P=On(A,this.size,16);n.uniformMatrix4fv(this.addr,!1,P)}function zT(n,A){n.uniform1iv(this.addr,A)}function cT(n,A){n.uniform2iv(this.addr,A)}function aT(n,A){n.uniform3iv(this.addr,A)}function gT(n,A){n.uniform4iv(this.addr,A)}function TT(n,A){n.uniform1uiv(this.addr,A)}function BT(n,A){n.uniform2uiv(this.addr,A)}function fT(n,A){n.uniform3uiv(this.addr,A)}function wT(n,A){n.uniform4uiv(this.addr,A)}function jT(n,A,P){let e=this.cache,t=A.length,s=kv(P,t);EP(e,s)||(n.uniform1iv(this.addr,s),lP(e,s));for(let i=0;i!==t;++i)P.setTexture2D(A[i]||z8,s[i])}function ET(n,A,P){let e=this.cache,t=A.length,s=kv(P,t);EP(e,s)||(n.uniform1iv(this.addr,s),lP(e,s));for(let i=0;i!==t;++i)P.setTexture3D(A[i]||a8,s[i])}function lT(n,A,P){let e=this.cache,t=A.length,s=kv(P,t);EP(e,s)||(n.uniform1iv(this.addr,s),lP(e,s));for(let i=0;i!==t;++i)P.setTextureCube(A[i]||g8,s[i])}function hT(n,A,P){let e=this.cache,t=A.length,s=kv(P,t);EP(e,s)||(n.uniform1iv(this.addr,s),lP(e,s));for(let i=0;i!==t;++i)P.setTexture2DArray(A[i]||c8,s[i])}function uT(n){switch(n){case 5126:return nT;case 35664:return sT;case 35665:return iT;case 35666:return vT;case 35674:return rT;case 35675:return oT;case 35676:return DT;case 5124:case 35670:return zT;case 35667:case 35671:return cT;case 35668:case 35672:return aT;case 35669:case 35673:return gT;case 5125:return TT;case 36294:return BT;case 36295:return fT;case 36296:return wT;case 35678:case 36198:case 36298:case 36306:case 35682:return jT;case 35679:case 36299:case 36307:return ET;case 35680:case 36300:case 36308:case 36293:return lT;case 36289:case 36303:case 36311:case 36292:return hT}}var ro=class{constructor(A,P,e){this.id=A,this.addr=e,this.cache=[],this.type=P.type,this.setValue=tT(P.type)}},oo=class{constructor(A,P,e){this.id=A,this.addr=e,this.cache=[],this.type=P.type,this.size=P.size,this.setValue=uT(P.type)}},Do=class{constructor(A){this.id=A,this.seq=[],this.map={}}setValue(A,P,e){let t=this.seq;for(let s=0,i=t.length;s!==i;++s){let v=t[s];v.setValue(A,P[v.id],e)}}},vo=/(\w+)(\])?(\[|\.)?/g;function $9(n,A){n.seq.push(A),n.map[A.id]=A}function mT(n,A,P){let e=n.name,t=e.length;for(vo.lastIndex=0;;){let s=vo.exec(e),i=vo.lastIndex,v=s[1],o=s[2]==="]",r=s[3];if(o&&(v=v|0),r===void 0||r==="["&&i+2===t){$9(P,r===void 0?new ro(v,n,A):new oo(v,n,A));break}else{let z=P.map[v];z===void 0&&(z=new Do(v),$9(P,z)),P=z}}}var xn=class{constructor(A,P){this.seq=[],this.map={};let e=A.getProgramParameter(P,A.ACTIVE_UNIFORMS);for(let t=0;t<e;++t){let s=A.getActiveUniform(P,t),i=A.getUniformLocation(P,s.name);mT(s,i,this)}}setValue(A,P,e,t){let s=this.map[P];s!==void 0&&s.setValue(A,e,t)}setOptional(A,P,e){let t=P[e];t!==void 0&&this.setValue(A,e,t)}static upload(A,P,e,t){for(let s=0,i=P.length;s!==i;++s){let v=P[s],o=e[v.id];o.needsUpdate!==!1&&v.setValue(A,o.value,t)}}static seqWithValue(A,P){let e=[];for(let t=0,s=A.length;t!==s;++t){let i=A[t];i.id in P&&e.push(i)}return e}};function A8(n,A,P){let e=n.createShader(A);return n.shaderSource(e,P),n.compileShader(e),e}var MT=37297,QT=0;function dT(n,A){let P=n.split(`
`),e=[],t=Math.max(A-6,0),s=Math.min(A+6,P.length);for(let i=t;i<s;i++){let v=i+1;e.push(`${v===A?">":" "} ${v}: ${P[i]}`)}return e.join(`
`)}var P8=new IA;function bT(n){ZA._getMatrix(P8,ZA.workingColorSpace,n);let A=`mat3( ${P8.elements.map(P=>P.toFixed(4))} )`;switch(ZA.getTransfer(n)){case As:return[A,"LinearTransferOETF"];case qA:return[A,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space: ",n),[A,"LinearTransferOETF"]}}function e8(n,A,P){let e=n.getShaderParameter(A,n.COMPILE_STATUS),s=(n.getShaderInfoLog(A)||"").trim();if(e&&s==="")return"";let i=/ERROR: 0:(\d+)/.exec(s);if(i){let v=parseInt(i[1]);return P.toUpperCase()+`

`+s+`

`+dT(n.getShaderSource(A),v)}else return s}function YT(n,A){let P=bT(A);return[`vec4 ${n}( vec4 value ) {`,`	return ${P[1]}( vec4( value.rgb * ${P[0]}, value.a ) );`,"}"].join(`
`)}function pT(n,A){let P;switch(A){case B9:P="Linear";break;case f9:P="Reinhard";break;case w9:P="Cineon";break;case Si:P="ACESFilmic";break;case E9:P="AgX";break;case l9:P="Neutral";break;case j9:P="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",A),P="Linear"}return"vec3 "+n+"( vec3 color ) { return "+P+"ToneMapping( color ); }"}var Ov=new y;function yT(){ZA.getLuminanceCoefficients(Ov);let n=Ov.x.toFixed(4),A=Ov.y.toFixed(4),P=Ov.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${n}, ${A}, ${P} );`,"	return dot( weights, rgb );","}"].join(`
`)}function xT(n){return[n.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",n.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(Is).join(`
`)}function OT(n){let A=[];for(let P in n){let e=n[P];e!==!1&&A.push("#define "+P+" "+e)}return A.join(`
`)}function LT(n,A){let P={},e=n.getProgramParameter(A,n.ACTIVE_ATTRIBUTES);for(let t=0;t<e;t++){let s=n.getActiveAttrib(A,t),i=s.name,v=1;s.type===n.FLOAT_MAT2&&(v=2),s.type===n.FLOAT_MAT3&&(v=3),s.type===n.FLOAT_MAT4&&(v=4),P[i]={type:s.type,location:n.getAttribLocation(A,i),locationSize:v}}return P}function Is(n){return n!==""}function t8(n,A){let P=A.numSpotLightShadows+A.numSpotLightMaps-A.numSpotLightShadowsWithMaps;return n.replace(/NUM_DIR_LIGHTS/g,A.numDirLights).replace(/NUM_SPOT_LIGHTS/g,A.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,A.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,P).replace(/NUM_RECT_AREA_LIGHTS/g,A.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,A.numPointLights).replace(/NUM_HEMI_LIGHTS/g,A.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,A.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,A.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,A.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,A.numPointLightShadows)}function n8(n,A){return n.replace(/NUM_CLIPPING_PLANES/g,A.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,A.numClippingPlanes-A.numClipIntersection)}var IT=/^[ \t]*#include +<([\w\d./]+)>/gm;function zo(n){return n.replace(IT,HT)}var kT=new Map;function HT(n,A){let P=GA[A];if(P===void 0){let e=kT.get(A);if(e!==void 0)P=GA[e],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',A,e);else throw new Error("Can not resolve #include <"+A+">")}return zo(P)}var GT=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function s8(n){return n.replace(GT,CT)}function CT(n,A,P,e){let t="";for(let s=parseInt(A);s<parseInt(P);s++)t+=e.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return t}function i8(n){let A=`precision ${n.precision} float;
	precision ${n.precision} int;
	precision ${n.precision} sampler2D;
	precision ${n.precision} samplerCube;
	precision ${n.precision} sampler3D;
	precision ${n.precision} sampler2DArray;
	precision ${n.precision} sampler2DShadow;
	precision ${n.precision} samplerCubeShadow;
	precision ${n.precision} sampler2DArrayShadow;
	precision ${n.precision} isampler2D;
	precision ${n.precision} isampler3D;
	precision ${n.precision} isamplerCube;
	precision ${n.precision} isampler2DArray;
	precision ${n.precision} usampler2D;
	precision ${n.precision} usampler3D;
	precision ${n.precision} usamplerCube;
	precision ${n.precision} usampler2DArray;
	`;return n.precision==="highp"?A+=`
#define HIGH_PRECISION`:n.precision==="mediump"?A+=`
#define MEDIUM_PRECISION`:n.precision==="lowp"&&(A+=`
#define LOW_PRECISION`),A}function FT(n){let A="SHADOWMAP_TYPE_BASIC";return n.shadowMapType===Or?A="SHADOWMAP_TYPE_PCF":n.shadowMapType===Gi?A="SHADOWMAP_TYPE_PCF_SOFT":n.shadowMapType===Me&&(A="SHADOWMAP_TYPE_VSM"),A}function NT(n){let A="ENVMAP_TYPE_CUBE";if(n.envMap)switch(n.envMapMode){case yt:case xt:A="ENVMAP_TYPE_CUBE";break;case Ys:A="ENVMAP_TYPE_CUBE_UV";break}return A}function XT(n){let A="ENVMAP_MODE_REFLECTION";return n.envMap&&n.envMapMode===xt&&(A="ENVMAP_MODE_REFRACTION"),A}function ZT(n){let A="ENVMAP_BLENDING_NONE";if(n.envMap)switch(n.combine){case kr:A="ENVMAP_BLENDING_MULTIPLY";break;case g9:A="ENVMAP_BLENDING_MIX";break;case T9:A="ENVMAP_BLENDING_ADD";break}return A}function RT(n){let A=n.envMapCubeUVHeight;if(A===null)return null;let P=Math.log2(A)-2,e=1/A;return{texelWidth:1/(3*Math.max(Math.pow(2,P),112)),texelHeight:e,maxMip:P}}function WT(n,A,P,e){let t=n.getContext(),s=P.defines,i=P.vertexShader,v=P.fragmentShader,o=FT(P),r=NT(P),D=XT(P),z=ZT(P),c=RT(P),g=xT(P),B=OT(s),f=t.createProgram(),T,a,m=P.glslVersion?"#version "+P.glslVersion+`
`:"";P.isRawShaderMaterial?(T=["#define SHADER_TYPE "+P.shaderType,"#define SHADER_NAME "+P.shaderName,B].filter(Is).join(`
`),T.length>0&&(T+=`
`),a=["#define SHADER_TYPE "+P.shaderType,"#define SHADER_NAME "+P.shaderName,B].filter(Is).join(`
`),a.length>0&&(a+=`
`)):(T=[i8(P),"#define SHADER_TYPE "+P.shaderType,"#define SHADER_NAME "+P.shaderName,B,P.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",P.batching?"#define USE_BATCHING":"",P.batchingColor?"#define USE_BATCHING_COLOR":"",P.instancing?"#define USE_INSTANCING":"",P.instancingColor?"#define USE_INSTANCING_COLOR":"",P.instancingMorph?"#define USE_INSTANCING_MORPH":"",P.useFog&&P.fog?"#define USE_FOG":"",P.useFog&&P.fogExp2?"#define FOG_EXP2":"",P.map?"#define USE_MAP":"",P.envMap?"#define USE_ENVMAP":"",P.envMap?"#define "+D:"",P.lightMap?"#define USE_LIGHTMAP":"",P.aoMap?"#define USE_AOMAP":"",P.bumpMap?"#define USE_BUMPMAP":"",P.normalMap?"#define USE_NORMALMAP":"",P.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",P.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",P.displacementMap?"#define USE_DISPLACEMENTMAP":"",P.emissiveMap?"#define USE_EMISSIVEMAP":"",P.anisotropy?"#define USE_ANISOTROPY":"",P.anisotropyMap?"#define USE_ANISOTROPYMAP":"",P.clearcoatMap?"#define USE_CLEARCOATMAP":"",P.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",P.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",P.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",P.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",P.specularMap?"#define USE_SPECULARMAP":"",P.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",P.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",P.roughnessMap?"#define USE_ROUGHNESSMAP":"",P.metalnessMap?"#define USE_METALNESSMAP":"",P.alphaMap?"#define USE_ALPHAMAP":"",P.alphaHash?"#define USE_ALPHAHASH":"",P.transmission?"#define USE_TRANSMISSION":"",P.transmissionMap?"#define USE_TRANSMISSIONMAP":"",P.thicknessMap?"#define USE_THICKNESSMAP":"",P.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",P.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",P.mapUv?"#define MAP_UV "+P.mapUv:"",P.alphaMapUv?"#define ALPHAMAP_UV "+P.alphaMapUv:"",P.lightMapUv?"#define LIGHTMAP_UV "+P.lightMapUv:"",P.aoMapUv?"#define AOMAP_UV "+P.aoMapUv:"",P.emissiveMapUv?"#define EMISSIVEMAP_UV "+P.emissiveMapUv:"",P.bumpMapUv?"#define BUMPMAP_UV "+P.bumpMapUv:"",P.normalMapUv?"#define NORMALMAP_UV "+P.normalMapUv:"",P.displacementMapUv?"#define DISPLACEMENTMAP_UV "+P.displacementMapUv:"",P.metalnessMapUv?"#define METALNESSMAP_UV "+P.metalnessMapUv:"",P.roughnessMapUv?"#define ROUGHNESSMAP_UV "+P.roughnessMapUv:"",P.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+P.anisotropyMapUv:"",P.clearcoatMapUv?"#define CLEARCOATMAP_UV "+P.clearcoatMapUv:"",P.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+P.clearcoatNormalMapUv:"",P.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+P.clearcoatRoughnessMapUv:"",P.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+P.iridescenceMapUv:"",P.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+P.iridescenceThicknessMapUv:"",P.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+P.sheenColorMapUv:"",P.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+P.sheenRoughnessMapUv:"",P.specularMapUv?"#define SPECULARMAP_UV "+P.specularMapUv:"",P.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+P.specularColorMapUv:"",P.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+P.specularIntensityMapUv:"",P.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+P.transmissionMapUv:"",P.thicknessMapUv?"#define THICKNESSMAP_UV "+P.thicknessMapUv:"",P.vertexTangents&&P.flatShading===!1?"#define USE_TANGENT":"",P.vertexColors?"#define USE_COLOR":"",P.vertexAlphas?"#define USE_COLOR_ALPHA":"",P.vertexUv1s?"#define USE_UV1":"",P.vertexUv2s?"#define USE_UV2":"",P.vertexUv3s?"#define USE_UV3":"",P.pointsUvs?"#define USE_POINTS_UV":"",P.flatShading?"#define FLAT_SHADED":"",P.skinning?"#define USE_SKINNING":"",P.morphTargets?"#define USE_MORPHTARGETS":"",P.morphNormals&&P.flatShading===!1?"#define USE_MORPHNORMALS":"",P.morphColors?"#define USE_MORPHCOLORS":"",P.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+P.morphTextureStride:"",P.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+P.morphTargetsCount:"",P.doubleSided?"#define DOUBLE_SIDED":"",P.flipSided?"#define FLIP_SIDED":"",P.shadowMapEnabled?"#define USE_SHADOWMAP":"",P.shadowMapEnabled?"#define "+o:"",P.sizeAttenuation?"#define USE_SIZEATTENUATION":"",P.numLightProbes>0?"#define USE_LIGHT_PROBES":"",P.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",P.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Is).join(`
`),a=[i8(P),"#define SHADER_TYPE "+P.shaderType,"#define SHADER_NAME "+P.shaderName,B,P.useFog&&P.fog?"#define USE_FOG":"",P.useFog&&P.fogExp2?"#define FOG_EXP2":"",P.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",P.map?"#define USE_MAP":"",P.matcap?"#define USE_MATCAP":"",P.envMap?"#define USE_ENVMAP":"",P.envMap?"#define "+r:"",P.envMap?"#define "+D:"",P.envMap?"#define "+z:"",c?"#define CUBEUV_TEXEL_WIDTH "+c.texelWidth:"",c?"#define CUBEUV_TEXEL_HEIGHT "+c.texelHeight:"",c?"#define CUBEUV_MAX_MIP "+c.maxMip+".0":"",P.lightMap?"#define USE_LIGHTMAP":"",P.aoMap?"#define USE_AOMAP":"",P.bumpMap?"#define USE_BUMPMAP":"",P.normalMap?"#define USE_NORMALMAP":"",P.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",P.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",P.emissiveMap?"#define USE_EMISSIVEMAP":"",P.anisotropy?"#define USE_ANISOTROPY":"",P.anisotropyMap?"#define USE_ANISOTROPYMAP":"",P.clearcoat?"#define USE_CLEARCOAT":"",P.clearcoatMap?"#define USE_CLEARCOATMAP":"",P.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",P.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",P.dispersion?"#define USE_DISPERSION":"",P.iridescence?"#define USE_IRIDESCENCE":"",P.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",P.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",P.specularMap?"#define USE_SPECULARMAP":"",P.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",P.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",P.roughnessMap?"#define USE_ROUGHNESSMAP":"",P.metalnessMap?"#define USE_METALNESSMAP":"",P.alphaMap?"#define USE_ALPHAMAP":"",P.alphaTest?"#define USE_ALPHATEST":"",P.alphaHash?"#define USE_ALPHAHASH":"",P.sheen?"#define USE_SHEEN":"",P.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",P.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",P.transmission?"#define USE_TRANSMISSION":"",P.transmissionMap?"#define USE_TRANSMISSIONMAP":"",P.thicknessMap?"#define USE_THICKNESSMAP":"",P.vertexTangents&&P.flatShading===!1?"#define USE_TANGENT":"",P.vertexColors||P.instancingColor||P.batchingColor?"#define USE_COLOR":"",P.vertexAlphas?"#define USE_COLOR_ALPHA":"",P.vertexUv1s?"#define USE_UV1":"",P.vertexUv2s?"#define USE_UV2":"",P.vertexUv3s?"#define USE_UV3":"",P.pointsUvs?"#define USE_POINTS_UV":"",P.gradientMap?"#define USE_GRADIENTMAP":"",P.flatShading?"#define FLAT_SHADED":"",P.doubleSided?"#define DOUBLE_SIDED":"",P.flipSided?"#define FLIP_SIDED":"",P.shadowMapEnabled?"#define USE_SHADOWMAP":"",P.shadowMapEnabled?"#define "+o:"",P.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",P.numLightProbes>0?"#define USE_LIGHT_PROBES":"",P.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",P.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",P.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",P.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",P.toneMapping!==Ue?"#define TONE_MAPPING":"",P.toneMapping!==Ue?GA.tonemapping_pars_fragment:"",P.toneMapping!==Ue?pT("toneMapping",P.toneMapping):"",P.dithering?"#define DITHERING":"",P.opaque?"#define OPAQUE":"",GA.colorspace_pars_fragment,YT("linearToOutputTexel",P.outputColorSpace),yT(),P.useDepthPacking?"#define DEPTH_PACKING "+P.depthPacking:"",`
`].filter(Is).join(`
`)),i=zo(i),i=t8(i,P),i=n8(i,P),v=zo(v),v=t8(v,P),v=n8(v,P),i=s8(i),v=s8(v),P.isRawShaderMaterial!==!0&&(m=`#version 300 es
`,T=[g,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+T,a=["#define varying in",P.glslVersion===Jr?"":"layout(location = 0) out highp vec4 pc_fragColor;",P.glslVersion===Jr?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+a);let u=m+T+i,j=m+a+v,d=A8(t,t.VERTEX_SHADER,u),Q=A8(t,t.FRAGMENT_SHADER,j);t.attachShader(f,d),t.attachShader(f,Q),P.index0AttributeName!==void 0?t.bindAttribLocation(f,0,P.index0AttributeName):P.morphTargets===!0&&t.bindAttribLocation(f,0,"position"),t.linkProgram(f);function Y(p){if(n.debug.checkShaderErrors){let k=t.getProgramInfoLog(f)||"",F=t.getShaderInfoLog(d)||"",Z=t.getShaderInfoLog(Q)||"",S=k.trim(),R=F.trim(),PA=Z.trim(),N=!0,sA=!0;if(t.getProgramParameter(f,t.LINK_STATUS)===!1)if(N=!1,typeof n.debug.onShaderError=="function")n.debug.onShaderError(t,f,d,Q);else{let oA=e8(t,d,"vertex"),hA=e8(t,Q,"fragment");console.error("THREE.WebGLProgram: Shader Error "+t.getError()+" - VALIDATE_STATUS "+t.getProgramParameter(f,t.VALIDATE_STATUS)+`

Material Name: `+p.name+`
Material Type: `+p.type+`

Program Info Log: `+S+`
`+oA+`
`+hA)}else S!==""?console.warn("THREE.WebGLProgram: Program Info Log:",S):(R===""||PA==="")&&(sA=!1);sA&&(p.diagnostics={runnable:N,programLog:S,vertexShader:{log:R,prefix:T},fragmentShader:{log:PA,prefix:a}})}t.deleteShader(d),t.deleteShader(Q),x=new xn(t,f),h=LT(t,f)}let x;this.getUniforms=function(){return x===void 0&&Y(this),x};let h;this.getAttributes=function(){return h===void 0&&Y(this),h};let l=P.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return l===!1&&(l=t.getProgramParameter(f,MT)),l},this.destroy=function(){e.releaseStatesOfProgram(this),t.deleteProgram(f),this.program=void 0},this.type=P.shaderType,this.name=P.shaderName,this.id=QT++,this.cacheKey=A,this.usedTimes=1,this.program=f,this.vertexShader=d,this.fragmentShader=Q,this}var ST=0,co=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(A){let P=A.vertexShader,e=A.fragmentShader,t=this._getShaderStage(P),s=this._getShaderStage(e),i=this._getShaderCacheForMaterial(A);return i.has(t)===!1&&(i.add(t),t.usedTimes++),i.has(s)===!1&&(i.add(s),s.usedTimes++),this}remove(A){let P=this.materialCache.get(A);for(let e of P)e.usedTimes--,e.usedTimes===0&&this.shaderCache.delete(e.code);return this.materialCache.delete(A),this}getVertexShaderID(A){return this._getShaderStage(A.vertexShader).id}getFragmentShaderID(A){return this._getShaderStage(A.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(A){let P=this.materialCache,e=P.get(A);return e===void 0&&(e=new Set,P.set(A,e)),e}_getShaderStage(A){let P=this.shaderCache,e=P.get(A);return e===void 0&&(e=new ao(A),P.set(A,e)),e}},ao=class{constructor(A){this.id=ST++,this.code=A,this.usedTimes=0}};function UT(n,A,P,e,t,s,i){let v=new ts,o=new co,r=new Set,D=[],z=t.logarithmicDepthBuffer,c=t.vertexTextures,g=t.precision,B={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function f(h){return r.add(h),h===0?"uv":`uv${h}`}function T(h,l,p,k,F){let Z=k.fog,S=F.geometry,R=h.isMeshStandardMaterial?k.environment:null,PA=(h.isMeshStandardMaterial?P:A).get(h.envMap||R),N=PA&&PA.mapping===Ys?PA.image.height:null,sA=B[h.type];h.precision!==null&&(g=t.getMaxPrecision(h.precision),g!==h.precision&&console.warn("THREE.WebGLProgram.getParameters:",h.precision,"not supported, using",g,"instead."));let oA=S.morphAttributes.position||S.morphAttributes.normal||S.morphAttributes.color,hA=oA!==void 0?oA.length:0,CA=0;S.morphAttributes.position!==void 0&&(CA=1),S.morphAttributes.normal!==void 0&&(CA=2),S.morphAttributes.color!==void 0&&(CA=3);let AP,sP,UA,U;if(sA){let JA=Qe[sA];AP=JA.vertexShader,sP=JA.fragmentShader}else AP=h.vertexShader,sP=h.fragmentShader,o.update(h),UA=o.getVertexShaderID(h),U=o.getFragmentShaderID(h);let q=n.getRenderTarget(),cA=n.state.buffers.depth.getReversed(),xA=F.isInstancedMesh===!0,lA=F.isBatchedMesh===!0,RA=!!h.map,dP=!!h.matcap,b=!!PA,iP=!!h.aoMap,LA=!!h.lightMap,YA=!!h.bumpMap,TA=!!h.normalMap,vP=!!h.displacementMap,BA=!!h.emissiveMap,HA=!!h.metalnessMap,hP=!!h.roughnessMap,gP=h.anisotropy>0,M=h.clearcoat>0,w=h.dispersion>0,H=h.iridescence>0,W=h.sheen>0,V=h.transmission>0,X=gP&&!!h.anisotropyMap,EA=M&&!!h.clearcoatMap,eA=M&&!!h.clearcoatNormalMap,fA=M&&!!h.clearcoatRoughnessMap,wA=H&&!!h.iridescenceMap,$=H&&!!h.iridescenceThicknessMap,rA=W&&!!h.sheenColorMap,dA=W&&!!h.sheenRoughnessMap,jA=!!h.specularMap,iA=!!h.specularColorMap,kA=!!h.specularIntensityMap,O=V&&!!h.transmissionMap,AA=V&&!!h.thicknessMap,tA=!!h.gradientMap,zA=!!h.alphaMap,K=h.alphaTest>0,J=!!h.alphaHash,gA=!!h.extensions,OA=Ue;h.toneMapped&&(q===null||q.isXRRenderTarget===!0)&&(OA=n.toneMapping);let PP={shaderID:sA,shaderType:h.type,shaderName:h.name,vertexShader:AP,fragmentShader:sP,defines:h.defines,customVertexShaderID:UA,customFragmentShaderID:U,isRawShaderMaterial:h.isRawShaderMaterial===!0,glslVersion:h.glslVersion,precision:g,batching:lA,batchingColor:lA&&F._colorsTexture!==null,instancing:xA,instancingColor:xA&&F.instanceColor!==null,instancingMorph:xA&&F.morphTexture!==null,supportsVertexTextures:c,outputColorSpace:q===null?n.outputColorSpace:q.isXRRenderTarget===!0?q.texture.colorSpace:QP,alphaToCoverage:!!h.alphaToCoverage,map:RA,matcap:dP,envMap:b,envMapMode:b&&PA.mapping,envMapCubeUVHeight:N,aoMap:iP,lightMap:LA,bumpMap:YA,normalMap:TA,displacementMap:c&&vP,emissiveMap:BA,normalMapObjectSpace:TA&&h.normalMapType===Q9,normalMapTangentSpace:TA&&h.normalMapType===Sr,metalnessMap:HA,roughnessMap:hP,anisotropy:gP,anisotropyMap:X,clearcoat:M,clearcoatMap:EA,clearcoatNormalMap:eA,clearcoatRoughnessMap:fA,dispersion:w,iridescence:H,iridescenceMap:wA,iridescenceThicknessMap:$,sheen:W,sheenColorMap:rA,sheenRoughnessMap:dA,specularMap:jA,specularColorMap:iA,specularIntensityMap:kA,transmission:V,transmissionMap:O,thicknessMap:AA,gradientMap:tA,opaque:h.transparent===!1&&h.blending===Et&&h.alphaToCoverage===!1,alphaMap:zA,alphaTest:K,alphaHash:J,combine:h.combine,mapUv:RA&&f(h.map.channel),aoMapUv:iP&&f(h.aoMap.channel),lightMapUv:LA&&f(h.lightMap.channel),bumpMapUv:YA&&f(h.bumpMap.channel),normalMapUv:TA&&f(h.normalMap.channel),displacementMapUv:vP&&f(h.displacementMap.channel),emissiveMapUv:BA&&f(h.emissiveMap.channel),metalnessMapUv:HA&&f(h.metalnessMap.channel),roughnessMapUv:hP&&f(h.roughnessMap.channel),anisotropyMapUv:X&&f(h.anisotropyMap.channel),clearcoatMapUv:EA&&f(h.clearcoatMap.channel),clearcoatNormalMapUv:eA&&f(h.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:fA&&f(h.clearcoatRoughnessMap.channel),iridescenceMapUv:wA&&f(h.iridescenceMap.channel),iridescenceThicknessMapUv:$&&f(h.iridescenceThicknessMap.channel),sheenColorMapUv:rA&&f(h.sheenColorMap.channel),sheenRoughnessMapUv:dA&&f(h.sheenRoughnessMap.channel),specularMapUv:jA&&f(h.specularMap.channel),specularColorMapUv:iA&&f(h.specularColorMap.channel),specularIntensityMapUv:kA&&f(h.specularIntensityMap.channel),transmissionMapUv:O&&f(h.transmissionMap.channel),thicknessMapUv:AA&&f(h.thicknessMap.channel),alphaMapUv:zA&&f(h.alphaMap.channel),vertexTangents:!!S.attributes.tangent&&(TA||gP),vertexColors:h.vertexColors,vertexAlphas:h.vertexColors===!0&&!!S.attributes.color&&S.attributes.color.itemSize===4,pointsUvs:F.isPoints===!0&&!!S.attributes.uv&&(RA||zA),fog:!!Z,useFog:h.fog===!0,fogExp2:!!Z&&Z.isFogExp2,flatShading:h.flatShading===!0&&h.wireframe===!1,sizeAttenuation:h.sizeAttenuation===!0,logarithmicDepthBuffer:z,reversedDepthBuffer:cA,skinning:F.isSkinnedMesh===!0,morphTargets:S.morphAttributes.position!==void 0,morphNormals:S.morphAttributes.normal!==void 0,morphColors:S.morphAttributes.color!==void 0,morphTargetsCount:hA,morphTextureStride:CA,numDirLights:l.directional.length,numPointLights:l.point.length,numSpotLights:l.spot.length,numSpotLightMaps:l.spotLightMap.length,numRectAreaLights:l.rectArea.length,numHemiLights:l.hemi.length,numDirLightShadows:l.directionalShadowMap.length,numPointLightShadows:l.pointShadowMap.length,numSpotLightShadows:l.spotShadowMap.length,numSpotLightShadowsWithMaps:l.numSpotLightShadowsWithMaps,numLightProbes:l.numLightProbes,numClippingPlanes:i.numPlanes,numClipIntersection:i.numIntersection,dithering:h.dithering,shadowMapEnabled:n.shadowMap.enabled&&p.length>0,shadowMapType:n.shadowMap.type,toneMapping:OA,decodeVideoTexture:RA&&h.map.isVideoTexture===!0&&ZA.getTransfer(h.map.colorSpace)===qA,decodeVideoTextureEmissive:BA&&h.emissiveMap.isVideoTexture===!0&&ZA.getTransfer(h.emissiveMap.colorSpace)===qA,premultipliedAlpha:h.premultipliedAlpha,doubleSided:h.side===ZP,flipSided:h.side===HP,useDepthPacking:h.depthPacking>=0,depthPacking:h.depthPacking||0,index0AttributeName:h.index0AttributeName,extensionClipCullDistance:gA&&h.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(gA&&h.extensions.multiDraw===!0||lA)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:h.customProgramCacheKey()};return PP.vertexUv1s=r.has(1),PP.vertexUv2s=r.has(2),PP.vertexUv3s=r.has(3),r.clear(),PP}function a(h){let l=[];if(h.shaderID?l.push(h.shaderID):(l.push(h.customVertexShaderID),l.push(h.customFragmentShaderID)),h.defines!==void 0)for(let p in h.defines)l.push(p),l.push(h.defines[p]);return h.isRawShaderMaterial===!1&&(m(l,h),u(l,h),l.push(n.outputColorSpace)),l.push(h.customProgramCacheKey),l.join()}function m(h,l){h.push(l.precision),h.push(l.outputColorSpace),h.push(l.envMapMode),h.push(l.envMapCubeUVHeight),h.push(l.mapUv),h.push(l.alphaMapUv),h.push(l.lightMapUv),h.push(l.aoMapUv),h.push(l.bumpMapUv),h.push(l.normalMapUv),h.push(l.displacementMapUv),h.push(l.emissiveMapUv),h.push(l.metalnessMapUv),h.push(l.roughnessMapUv),h.push(l.anisotropyMapUv),h.push(l.clearcoatMapUv),h.push(l.clearcoatNormalMapUv),h.push(l.clearcoatRoughnessMapUv),h.push(l.iridescenceMapUv),h.push(l.iridescenceThicknessMapUv),h.push(l.sheenColorMapUv),h.push(l.sheenRoughnessMapUv),h.push(l.specularMapUv),h.push(l.specularColorMapUv),h.push(l.specularIntensityMapUv),h.push(l.transmissionMapUv),h.push(l.thicknessMapUv),h.push(l.combine),h.push(l.fogExp2),h.push(l.sizeAttenuation),h.push(l.morphTargetsCount),h.push(l.morphAttributeCount),h.push(l.numDirLights),h.push(l.numPointLights),h.push(l.numSpotLights),h.push(l.numSpotLightMaps),h.push(l.numHemiLights),h.push(l.numRectAreaLights),h.push(l.numDirLightShadows),h.push(l.numPointLightShadows),h.push(l.numSpotLightShadows),h.push(l.numSpotLightShadowsWithMaps),h.push(l.numLightProbes),h.push(l.shadowMapType),h.push(l.toneMapping),h.push(l.numClippingPlanes),h.push(l.numClipIntersection),h.push(l.depthPacking)}function u(h,l){v.disableAll(),l.supportsVertexTextures&&v.enable(0),l.instancing&&v.enable(1),l.instancingColor&&v.enable(2),l.instancingMorph&&v.enable(3),l.matcap&&v.enable(4),l.envMap&&v.enable(5),l.normalMapObjectSpace&&v.enable(6),l.normalMapTangentSpace&&v.enable(7),l.clearcoat&&v.enable(8),l.iridescence&&v.enable(9),l.alphaTest&&v.enable(10),l.vertexColors&&v.enable(11),l.vertexAlphas&&v.enable(12),l.vertexUv1s&&v.enable(13),l.vertexUv2s&&v.enable(14),l.vertexUv3s&&v.enable(15),l.vertexTangents&&v.enable(16),l.anisotropy&&v.enable(17),l.alphaHash&&v.enable(18),l.batching&&v.enable(19),l.dispersion&&v.enable(20),l.batchingColor&&v.enable(21),l.gradientMap&&v.enable(22),h.push(v.mask),v.disableAll(),l.fog&&v.enable(0),l.useFog&&v.enable(1),l.flatShading&&v.enable(2),l.logarithmicDepthBuffer&&v.enable(3),l.reversedDepthBuffer&&v.enable(4),l.skinning&&v.enable(5),l.morphTargets&&v.enable(6),l.morphNormals&&v.enable(7),l.morphColors&&v.enable(8),l.premultipliedAlpha&&v.enable(9),l.shadowMapEnabled&&v.enable(10),l.doubleSided&&v.enable(11),l.flipSided&&v.enable(12),l.useDepthPacking&&v.enable(13),l.dithering&&v.enable(14),l.transmission&&v.enable(15),l.sheen&&v.enable(16),l.opaque&&v.enable(17),l.pointsUvs&&v.enable(18),l.decodeVideoTexture&&v.enable(19),l.decodeVideoTextureEmissive&&v.enable(20),l.alphaToCoverage&&v.enable(21),h.push(v.mask)}function j(h){let l=B[h.type],p;if(l){let k=Qe[l];p=H9.clone(k.uniforms)}else p=h.uniforms;return p}function d(h,l){let p;for(let k=0,F=D.length;k<F;k++){let Z=D[k];if(Z.cacheKey===l){p=Z,++p.usedTimes;break}}return p===void 0&&(p=new WT(n,l,h,s),D.push(p)),p}function Q(h){if(--h.usedTimes===0){let l=D.indexOf(h);D[l]=D[D.length-1],D.pop(),h.destroy()}}function Y(h){o.remove(h)}function x(){o.dispose()}return{getParameters:T,getProgramCacheKey:a,getUniforms:j,acquireProgram:d,releaseProgram:Q,releaseShaderCache:Y,programs:D,dispose:x}}function JT(){let n=new WeakMap;function A(i){return n.has(i)}function P(i){let v=n.get(i);return v===void 0&&(v={},n.set(i,v)),v}function e(i){n.delete(i)}function t(i,v,o){n.get(i)[v]=o}function s(){n=new WeakMap}return{has:A,get:P,remove:e,update:t,dispose:s}}function VT(n,A){return n.groupOrder!==A.groupOrder?n.groupOrder-A.groupOrder:n.renderOrder!==A.renderOrder?n.renderOrder-A.renderOrder:n.material.id!==A.material.id?n.material.id-A.material.id:n.z!==A.z?n.z-A.z:n.id-A.id}function v8(n,A){return n.groupOrder!==A.groupOrder?n.groupOrder-A.groupOrder:n.renderOrder!==A.renderOrder?n.renderOrder-A.renderOrder:n.z!==A.z?A.z-n.z:n.id-A.id}function r8(){let n=[],A=0,P=[],e=[],t=[];function s(){A=0,P.length=0,e.length=0,t.length=0}function i(z,c,g,B,f,T){let a=n[A];return a===void 0?(a={id:z.id,object:z,geometry:c,material:g,groupOrder:B,renderOrder:z.renderOrder,z:f,group:T},n[A]=a):(a.id=z.id,a.object=z,a.geometry=c,a.material=g,a.groupOrder=B,a.renderOrder=z.renderOrder,a.z=f,a.group=T),A++,a}function v(z,c,g,B,f,T){let a=i(z,c,g,B,f,T);g.transmission>0?e.push(a):g.transparent===!0?t.push(a):P.push(a)}function o(z,c,g,B,f,T){let a=i(z,c,g,B,f,T);g.transmission>0?e.unshift(a):g.transparent===!0?t.unshift(a):P.unshift(a)}function r(z,c){P.length>1&&P.sort(z||VT),e.length>1&&e.sort(c||v8),t.length>1&&t.sort(c||v8)}function D(){for(let z=A,c=n.length;z<c;z++){let g=n[z];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:P,transmissive:e,transparent:t,init:s,push:v,unshift:o,finish:D,sort:r}}function qT(){let n=new WeakMap;function A(e,t){let s=n.get(e),i;return s===void 0?(i=new r8,n.set(e,[i])):t>=s.length?(i=new r8,s.push(i)):i=s[t],i}function P(){n=new WeakMap}return{get:A,dispose:P}}function KT(){let n={};return{get:function(A){if(n[A.id]!==void 0)return n[A.id];let P;switch(A.type){case"DirectionalLight":P={direction:new y,color:new mA};break;case"SpotLight":P={position:new y,direction:new y,color:new mA,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":P={position:new y,color:new mA,distance:0,decay:0};break;case"HemisphereLight":P={direction:new y,skyColor:new mA,groundColor:new mA};break;case"RectAreaLight":P={color:new mA,position:new y,halfWidth:new y,halfHeight:new y};break}return n[A.id]=P,P}}}function _T(){let n={};return{get:function(A){if(n[A.id]!==void 0)return n[A.id];let P;switch(A.type){case"DirectionalLight":P={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bA};break;case"SpotLight":P={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bA};break;case"PointLight":P={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new bA,shadowCameraNear:1,shadowCameraFar:1e3};break}return n[A.id]=P,P}}}var $T=0;function AB(n,A){return(A.castShadow?2:0)-(n.castShadow?2:0)+(A.map?1:0)-(n.map?1:0)}function PB(n){let A=new KT,P=_T(),e={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let r=0;r<9;r++)e.probe.push(new y);let t=new y,s=new yA,i=new yA;function v(r){let D=0,z=0,c=0;for(let h=0;h<9;h++)e.probe[h].set(0,0,0);let g=0,B=0,f=0,T=0,a=0,m=0,u=0,j=0,d=0,Q=0,Y=0;r.sort(AB);for(let h=0,l=r.length;h<l;h++){let p=r[h],k=p.color,F=p.intensity,Z=p.distance,S=p.shadow&&p.shadow.map?p.shadow.map.texture:null;if(p.isAmbientLight)D+=k.r*F,z+=k.g*F,c+=k.b*F;else if(p.isLightProbe){for(let R=0;R<9;R++)e.probe[R].addScaledVector(p.sh.coefficients[R],F);Y++}else if(p.isDirectionalLight){let R=A.get(p);if(R.color.copy(p.color).multiplyScalar(p.intensity),p.castShadow){let PA=p.shadow,N=P.get(p);N.shadowIntensity=PA.intensity,N.shadowBias=PA.bias,N.shadowNormalBias=PA.normalBias,N.shadowRadius=PA.radius,N.shadowMapSize=PA.mapSize,e.directionalShadow[g]=N,e.directionalShadowMap[g]=S,e.directionalShadowMatrix[g]=p.shadow.matrix,m++}e.directional[g]=R,g++}else if(p.isSpotLight){let R=A.get(p);R.position.setFromMatrixPosition(p.matrixWorld),R.color.copy(k).multiplyScalar(F),R.distance=Z,R.coneCos=Math.cos(p.angle),R.penumbraCos=Math.cos(p.angle*(1-p.penumbra)),R.decay=p.decay,e.spot[f]=R;let PA=p.shadow;if(p.map&&(e.spotLightMap[d]=p.map,d++,PA.updateMatrices(p),p.castShadow&&Q++),e.spotLightMatrix[f]=PA.matrix,p.castShadow){let N=P.get(p);N.shadowIntensity=PA.intensity,N.shadowBias=PA.bias,N.shadowNormalBias=PA.normalBias,N.shadowRadius=PA.radius,N.shadowMapSize=PA.mapSize,e.spotShadow[f]=N,e.spotShadowMap[f]=S,j++}f++}else if(p.isRectAreaLight){let R=A.get(p);R.color.copy(k).multiplyScalar(F),R.halfWidth.set(p.width*.5,0,0),R.halfHeight.set(0,p.height*.5,0),e.rectArea[T]=R,T++}else if(p.isPointLight){let R=A.get(p);if(R.color.copy(p.color).multiplyScalar(p.intensity),R.distance=p.distance,R.decay=p.decay,p.castShadow){let PA=p.shadow,N=P.get(p);N.shadowIntensity=PA.intensity,N.shadowBias=PA.bias,N.shadowNormalBias=PA.normalBias,N.shadowRadius=PA.radius,N.shadowMapSize=PA.mapSize,N.shadowCameraNear=PA.camera.near,N.shadowCameraFar=PA.camera.far,e.pointShadow[B]=N,e.pointShadowMap[B]=S,e.pointShadowMatrix[B]=p.shadow.matrix,u++}e.point[B]=R,B++}else if(p.isHemisphereLight){let R=A.get(p);R.skyColor.copy(p.color).multiplyScalar(F),R.groundColor.copy(p.groundColor).multiplyScalar(F),e.hemi[a]=R,a++}}T>0&&(n.has("OES_texture_float_linear")===!0?(e.rectAreaLTC1=nA.LTC_FLOAT_1,e.rectAreaLTC2=nA.LTC_FLOAT_2):(e.rectAreaLTC1=nA.LTC_HALF_1,e.rectAreaLTC2=nA.LTC_HALF_2)),e.ambient[0]=D,e.ambient[1]=z,e.ambient[2]=c;let x=e.hash;(x.directionalLength!==g||x.pointLength!==B||x.spotLength!==f||x.rectAreaLength!==T||x.hemiLength!==a||x.numDirectionalShadows!==m||x.numPointShadows!==u||x.numSpotShadows!==j||x.numSpotMaps!==d||x.numLightProbes!==Y)&&(e.directional.length=g,e.spot.length=f,e.rectArea.length=T,e.point.length=B,e.hemi.length=a,e.directionalShadow.length=m,e.directionalShadowMap.length=m,e.pointShadow.length=u,e.pointShadowMap.length=u,e.spotShadow.length=j,e.spotShadowMap.length=j,e.directionalShadowMatrix.length=m,e.pointShadowMatrix.length=u,e.spotLightMatrix.length=j+d-Q,e.spotLightMap.length=d,e.numSpotLightShadowsWithMaps=Q,e.numLightProbes=Y,x.directionalLength=g,x.pointLength=B,x.spotLength=f,x.rectAreaLength=T,x.hemiLength=a,x.numDirectionalShadows=m,x.numPointShadows=u,x.numSpotShadows=j,x.numSpotMaps=d,x.numLightProbes=Y,e.version=$T++)}function o(r,D){let z=0,c=0,g=0,B=0,f=0,T=D.matrixWorldInverse;for(let a=0,m=r.length;a<m;a++){let u=r[a];if(u.isDirectionalLight){let j=e.directional[z];j.direction.setFromMatrixPosition(u.matrixWorld),t.setFromMatrixPosition(u.target.matrixWorld),j.direction.sub(t),j.direction.transformDirection(T),z++}else if(u.isSpotLight){let j=e.spot[g];j.position.setFromMatrixPosition(u.matrixWorld),j.position.applyMatrix4(T),j.direction.setFromMatrixPosition(u.matrixWorld),t.setFromMatrixPosition(u.target.matrixWorld),j.direction.sub(t),j.direction.transformDirection(T),g++}else if(u.isRectAreaLight){let j=e.rectArea[B];j.position.setFromMatrixPosition(u.matrixWorld),j.position.applyMatrix4(T),i.identity(),s.copy(u.matrixWorld),s.premultiply(T),i.extractRotation(s),j.halfWidth.set(u.width*.5,0,0),j.halfHeight.set(0,u.height*.5,0),j.halfWidth.applyMatrix4(i),j.halfHeight.applyMatrix4(i),B++}else if(u.isPointLight){let j=e.point[c];j.position.setFromMatrixPosition(u.matrixWorld),j.position.applyMatrix4(T),c++}else if(u.isHemisphereLight){let j=e.hemi[f];j.direction.setFromMatrixPosition(u.matrixWorld),j.direction.transformDirection(T),f++}}}return{setup:v,setupView:o,state:e}}function o8(n){let A=new PB(n),P=[],e=[];function t(D){r.camera=D,P.length=0,e.length=0}function s(D){P.push(D)}function i(D){e.push(D)}function v(){A.setup(P)}function o(D){A.setupView(P,D)}let r={lightsArray:P,shadowsArray:e,camera:null,lights:A,transmissionRenderTarget:{}};return{init:t,state:r,setupLights:v,setupLightsView:o,pushLight:s,pushShadow:i}}function eB(n){let A=new WeakMap;function P(t,s=0){let i=A.get(t),v;return i===void 0?(v=new o8(n),A.set(t,[v])):s>=i.length?(v=new o8(n),i.push(v)):v=i[s],v}function e(){A=new WeakMap}return{get:P,dispose:e}}var tB=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,nB=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function sB(n,A,P){let e=new wn,t=new bA,s=new bA,i=new SA,v=new Yi({depthPacking:M9}),o=new pi,r={},D=P.maxTextureSize,z={[re]:HP,[HP]:re,[ZP]:ZP},c=new VP({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new bA},radius:{value:4}},vertexShader:tB,fragmentShader:nB}),g=c.clone();g.defines.HORIZONTAL_PASS=1;let B=new pP;B.setAttribute("position",new fP(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let f=new eP(B,c),T=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Or;let a=this.type;this.render=function(Q,Y,x){if(T.enabled===!1||T.autoUpdate===!1&&T.needsUpdate===!1||Q.length===0)return;let h=n.getRenderTarget(),l=n.getActiveCubeFace(),p=n.getActiveMipmapLevel(),k=n.state;k.setBlending(Se),k.buffers.depth.getReversed()===!0?k.buffers.color.setClear(0,0,0,0):k.buffers.color.setClear(1,1,1,1),k.buffers.depth.setTest(!0),k.setScissorTest(!1);let F=a!==Me&&this.type===Me,Z=a===Me&&this.type!==Me;for(let S=0,R=Q.length;S<R;S++){let PA=Q[S],N=PA.shadow;if(N===void 0){console.warn("THREE.WebGLShadowMap:",PA,"has no shadow.");continue}if(N.autoUpdate===!1&&N.needsUpdate===!1)continue;t.copy(N.mapSize);let sA=N.getFrameExtents();if(t.multiply(sA),s.copy(N.mapSize),(t.x>D||t.y>D)&&(t.x>D&&(s.x=Math.floor(D/sA.x),t.x=s.x*sA.x,N.mapSize.x=s.x),t.y>D&&(s.y=Math.floor(D/sA.y),t.y=s.y*sA.y,N.mapSize.y=s.y)),N.map===null||F===!0||Z===!0){let hA=this.type!==Me?{minFilter:MP,magFilter:MP}:{};N.map!==null&&N.map.dispose(),N.map=new we(t.x,t.y,hA),N.map.texture.name=PA.name+".shadowMap",N.camera.updateProjectionMatrix()}n.setRenderTarget(N.map),n.clear();let oA=N.getViewportCount();for(let hA=0;hA<oA;hA++){let CA=N.getViewport(hA);i.set(s.x*CA.x,s.y*CA.y,s.x*CA.z,s.y*CA.w),k.viewport(i),N.updateMatrices(PA,hA),e=N.getFrustum(),j(Y,x,N.camera,PA,this.type)}N.isPointLightShadow!==!0&&this.type===Me&&m(N,x),N.needsUpdate=!1}a=this.type,T.needsUpdate=!1,n.setRenderTarget(h,l,p)};function m(Q,Y){let x=A.update(f);c.defines.VSM_SAMPLES!==Q.blurSamples&&(c.defines.VSM_SAMPLES=Q.blurSamples,g.defines.VSM_SAMPLES=Q.blurSamples,c.needsUpdate=!0,g.needsUpdate=!0),Q.mapPass===null&&(Q.mapPass=new we(t.x,t.y)),c.uniforms.shadow_pass.value=Q.map.texture,c.uniforms.resolution.value=Q.mapSize,c.uniforms.radius.value=Q.radius,n.setRenderTarget(Q.mapPass),n.clear(),n.renderBufferDirect(Y,null,x,c,f,null),g.uniforms.shadow_pass.value=Q.mapPass.texture,g.uniforms.resolution.value=Q.mapSize,g.uniforms.radius.value=Q.radius,n.setRenderTarget(Q.map),n.clear(),n.renderBufferDirect(Y,null,x,g,f,null)}function u(Q,Y,x,h){let l=null,p=x.isPointLight===!0?Q.customDistanceMaterial:Q.customDepthMaterial;if(p!==void 0)l=p;else if(l=x.isPointLight===!0?o:v,n.localClippingEnabled&&Y.clipShadows===!0&&Array.isArray(Y.clippingPlanes)&&Y.clippingPlanes.length!==0||Y.displacementMap&&Y.displacementScale!==0||Y.alphaMap&&Y.alphaTest>0||Y.map&&Y.alphaTest>0||Y.alphaToCoverage===!0){let k=l.uuid,F=Y.uuid,Z=r[k];Z===void 0&&(Z={},r[k]=Z);let S=Z[F];S===void 0&&(S=l.clone(),Z[F]=S,Y.addEventListener("dispose",d)),l=S}if(l.visible=Y.visible,l.wireframe=Y.wireframe,h===Me?l.side=Y.shadowSide!==null?Y.shadowSide:Y.side:l.side=Y.shadowSide!==null?Y.shadowSide:z[Y.side],l.alphaMap=Y.alphaMap,l.alphaTest=Y.alphaToCoverage===!0?.5:Y.alphaTest,l.map=Y.map,l.clipShadows=Y.clipShadows,l.clippingPlanes=Y.clippingPlanes,l.clipIntersection=Y.clipIntersection,l.displacementMap=Y.displacementMap,l.displacementScale=Y.displacementScale,l.displacementBias=Y.displacementBias,l.wireframeLinewidth=Y.wireframeLinewidth,l.linewidth=Y.linewidth,x.isPointLight===!0&&l.isMeshDistanceMaterial===!0){let k=n.properties.get(l);k.light=x}return l}function j(Q,Y,x,h,l){if(Q.visible===!1)return;if(Q.layers.test(Y.layers)&&(Q.isMesh||Q.isLine||Q.isPoints)&&(Q.castShadow||Q.receiveShadow&&l===Me)&&(!Q.frustumCulled||e.intersectsObject(Q))){Q.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse,Q.matrixWorld);let F=A.update(Q),Z=Q.material;if(Array.isArray(Z)){let S=F.groups;for(let R=0,PA=S.length;R<PA;R++){let N=S[R],sA=Z[N.materialIndex];if(sA&&sA.visible){let oA=u(Q,sA,h,l);Q.onBeforeShadow(n,Q,Y,x,F,oA,N),n.renderBufferDirect(x,null,F,oA,Q,N),Q.onAfterShadow(n,Q,Y,x,F,oA,N)}}}else if(Z.visible){let S=u(Q,Z,h,l);Q.onBeforeShadow(n,Q,Y,x,F,S,null),n.renderBufferDirect(x,null,F,S,Q,null),Q.onAfterShadow(n,Q,Y,x,F,S,null)}}let k=Q.children;for(let F=0,Z=k.length;F<Z;F++)j(k[F],Y,x,h,l)}function d(Q){Q.target.removeEventListener("dispose",d);for(let x in r){let h=r[x],l=Q.target.uuid;l in h&&(h[l].dispose(),delete h[l])}}}var iB={[Ci]:Fi,[Ni]:Ri,[Xi]:Wi,[lt]:Zi,[Fi]:Ci,[Ri]:Ni,[Wi]:Xi,[Zi]:lt};function vB(n,A){function P(){let O=!1,AA=new SA,tA=null,zA=new SA(0,0,0,0);return{setMask:function(K){tA!==K&&!O&&(n.colorMask(K,K,K,K),tA=K)},setLocked:function(K){O=K},setClear:function(K,J,gA,OA,PP){PP===!0&&(K*=OA,J*=OA,gA*=OA),AA.set(K,J,gA,OA),zA.equals(AA)===!1&&(n.clearColor(K,J,gA,OA),zA.copy(AA))},reset:function(){O=!1,tA=null,zA.set(-1,0,0,0)}}}function e(){let O=!1,AA=!1,tA=null,zA=null,K=null;return{setReversed:function(J){if(AA!==J){let gA=A.get("EXT_clip_control");J?gA.clipControlEXT(gA.LOWER_LEFT_EXT,gA.ZERO_TO_ONE_EXT):gA.clipControlEXT(gA.LOWER_LEFT_EXT,gA.NEGATIVE_ONE_TO_ONE_EXT),AA=J;let OA=K;K=null,this.setClear(OA)}},getReversed:function(){return AA},setTest:function(J){J?q(n.DEPTH_TEST):cA(n.DEPTH_TEST)},setMask:function(J){tA!==J&&!O&&(n.depthMask(J),tA=J)},setFunc:function(J){if(AA&&(J=iB[J]),zA!==J){switch(J){case Ci:n.depthFunc(n.NEVER);break;case Fi:n.depthFunc(n.ALWAYS);break;case Ni:n.depthFunc(n.LESS);break;case lt:n.depthFunc(n.LEQUAL);break;case Xi:n.depthFunc(n.EQUAL);break;case Zi:n.depthFunc(n.GEQUAL);break;case Ri:n.depthFunc(n.GREATER);break;case Wi:n.depthFunc(n.NOTEQUAL);break;default:n.depthFunc(n.LEQUAL)}zA=J}},setLocked:function(J){O=J},setClear:function(J){K!==J&&(AA&&(J=1-J),n.clearDepth(J),K=J)},reset:function(){O=!1,tA=null,zA=null,K=null,AA=!1}}}function t(){let O=!1,AA=null,tA=null,zA=null,K=null,J=null,gA=null,OA=null,PP=null;return{setTest:function(JA){O||(JA?q(n.STENCIL_TEST):cA(n.STENCIL_TEST))},setMask:function(JA){AA!==JA&&!O&&(n.stencilMask(JA),AA=JA)},setFunc:function(JA,xe,ge){(tA!==JA||zA!==xe||K!==ge)&&(n.stencilFunc(JA,xe,ge),tA=JA,zA=xe,K=ge)},setOp:function(JA,xe,ge){(J!==JA||gA!==xe||OA!==ge)&&(n.stencilOp(JA,xe,ge),J=JA,gA=xe,OA=ge)},setLocked:function(JA){O=JA},setClear:function(JA){PP!==JA&&(n.clearStencil(JA),PP=JA)},reset:function(){O=!1,AA=null,tA=null,zA=null,K=null,J=null,gA=null,OA=null,PP=null}}}let s=new P,i=new e,v=new t,o=new WeakMap,r=new WeakMap,D={},z={},c=new WeakMap,g=[],B=null,f=!1,T=null,a=null,m=null,u=null,j=null,d=null,Q=null,Y=new mA(0,0,0),x=0,h=!1,l=null,p=null,k=null,F=null,Z=null,S=n.getParameter(n.MAX_COMBINED_TEXTURE_IMAGE_UNITS),R=!1,PA=0,N=n.getParameter(n.VERSION);N.indexOf("WebGL")!==-1?(PA=parseFloat(/^WebGL (\d)/.exec(N)[1]),R=PA>=1):N.indexOf("OpenGL ES")!==-1&&(PA=parseFloat(/^OpenGL ES (\d)/.exec(N)[1]),R=PA>=2);let sA=null,oA={},hA=n.getParameter(n.SCISSOR_BOX),CA=n.getParameter(n.VIEWPORT),AP=new SA().fromArray(hA),sP=new SA().fromArray(CA);function UA(O,AA,tA,zA){let K=new Uint8Array(4),J=n.createTexture();n.bindTexture(O,J),n.texParameteri(O,n.TEXTURE_MIN_FILTER,n.NEAREST),n.texParameteri(O,n.TEXTURE_MAG_FILTER,n.NEAREST);for(let gA=0;gA<tA;gA++)O===n.TEXTURE_3D||O===n.TEXTURE_2D_ARRAY?n.texImage3D(AA,0,n.RGBA,1,1,zA,0,n.RGBA,n.UNSIGNED_BYTE,K):n.texImage2D(AA+gA,0,n.RGBA,1,1,0,n.RGBA,n.UNSIGNED_BYTE,K);return J}let U={};U[n.TEXTURE_2D]=UA(n.TEXTURE_2D,n.TEXTURE_2D,1),U[n.TEXTURE_CUBE_MAP]=UA(n.TEXTURE_CUBE_MAP,n.TEXTURE_CUBE_MAP_POSITIVE_X,6),U[n.TEXTURE_2D_ARRAY]=UA(n.TEXTURE_2D_ARRAY,n.TEXTURE_2D_ARRAY,1,1),U[n.TEXTURE_3D]=UA(n.TEXTURE_3D,n.TEXTURE_3D,1,1),s.setClear(0,0,0,1),i.setClear(1),v.setClear(0),q(n.DEPTH_TEST),i.setFunc(lt),YA(!1),TA(xr),q(n.CULL_FACE),iP(Se);function q(O){D[O]!==!0&&(n.enable(O),D[O]=!0)}function cA(O){D[O]!==!1&&(n.disable(O),D[O]=!1)}function xA(O,AA){return z[O]!==AA?(n.bindFramebuffer(O,AA),z[O]=AA,O===n.DRAW_FRAMEBUFFER&&(z[n.FRAMEBUFFER]=AA),O===n.FRAMEBUFFER&&(z[n.DRAW_FRAMEBUFFER]=AA),!0):!1}function lA(O,AA){let tA=g,zA=!1;if(O){tA=c.get(AA),tA===void 0&&(tA=[],c.set(AA,tA));let K=O.textures;if(tA.length!==K.length||tA[0]!==n.COLOR_ATTACHMENT0){for(let J=0,gA=K.length;J<gA;J++)tA[J]=n.COLOR_ATTACHMENT0+J;tA.length=K.length,zA=!0}}else tA[0]!==n.BACK&&(tA[0]=n.BACK,zA=!0);zA&&n.drawBuffers(tA)}function RA(O){return B!==O?(n.useProgram(O),B=O,!0):!1}let dP={[et]:n.FUNC_ADD,[KD]:n.FUNC_SUBTRACT,[_D]:n.FUNC_REVERSE_SUBTRACT};dP[$D]=n.MIN,dP[A9]=n.MAX;let b={[P9]:n.ZERO,[e9]:n.ONE,[t9]:n.SRC_COLOR,[wi]:n.SRC_ALPHA,[o9]:n.SRC_ALPHA_SATURATE,[v9]:n.DST_COLOR,[s9]:n.DST_ALPHA,[n9]:n.ONE_MINUS_SRC_COLOR,[ji]:n.ONE_MINUS_SRC_ALPHA,[r9]:n.ONE_MINUS_DST_COLOR,[i9]:n.ONE_MINUS_DST_ALPHA,[D9]:n.CONSTANT_COLOR,[z9]:n.ONE_MINUS_CONSTANT_COLOR,[c9]:n.CONSTANT_ALPHA,[a9]:n.ONE_MINUS_CONSTANT_ALPHA};function iP(O,AA,tA,zA,K,J,gA,OA,PP,JA){if(O===Se){f===!0&&(cA(n.BLEND),f=!1);return}if(f===!1&&(q(n.BLEND),f=!0),O!==qD){if(O!==T||JA!==h){if((a!==et||j!==et)&&(n.blendEquation(n.FUNC_ADD),a=et,j=et),JA)switch(O){case Et:n.blendFuncSeparate(n.ONE,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case un:n.blendFunc(n.ONE,n.ONE);break;case Lr:n.blendFuncSeparate(n.ZERO,n.ONE_MINUS_SRC_COLOR,n.ZERO,n.ONE);break;case Ir:n.blendFuncSeparate(n.DST_COLOR,n.ONE_MINUS_SRC_ALPHA,n.ZERO,n.ONE);break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}else switch(O){case Et:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE_MINUS_SRC_ALPHA,n.ONE,n.ONE_MINUS_SRC_ALPHA);break;case un:n.blendFuncSeparate(n.SRC_ALPHA,n.ONE,n.ONE,n.ONE);break;case Lr:console.error("THREE.WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ir:console.error("THREE.WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:console.error("THREE.WebGLState: Invalid blending: ",O);break}m=null,u=null,d=null,Q=null,Y.set(0,0,0),x=0,T=O,h=JA}return}K=K||AA,J=J||tA,gA=gA||zA,(AA!==a||K!==j)&&(n.blendEquationSeparate(dP[AA],dP[K]),a=AA,j=K),(tA!==m||zA!==u||J!==d||gA!==Q)&&(n.blendFuncSeparate(b[tA],b[zA],b[J],b[gA]),m=tA,u=zA,d=J,Q=gA),(OA.equals(Y)===!1||PP!==x)&&(n.blendColor(OA.r,OA.g,OA.b,PP),Y.copy(OA),x=PP),T=O,h=!1}function LA(O,AA){O.side===ZP?cA(n.CULL_FACE):q(n.CULL_FACE);let tA=O.side===HP;AA&&(tA=!tA),YA(tA),O.blending===Et&&O.transparent===!1?iP(Se):iP(O.blending,O.blendEquation,O.blendSrc,O.blendDst,O.blendEquationAlpha,O.blendSrcAlpha,O.blendDstAlpha,O.blendColor,O.blendAlpha,O.premultipliedAlpha),i.setFunc(O.depthFunc),i.setTest(O.depthTest),i.setMask(O.depthWrite),s.setMask(O.colorWrite);let zA=O.stencilWrite;v.setTest(zA),zA&&(v.setMask(O.stencilWriteMask),v.setFunc(O.stencilFunc,O.stencilRef,O.stencilFuncMask),v.setOp(O.stencilFail,O.stencilZFail,O.stencilZPass)),BA(O.polygonOffset,O.polygonOffsetFactor,O.polygonOffsetUnits),O.alphaToCoverage===!0?q(n.SAMPLE_ALPHA_TO_COVERAGE):cA(n.SAMPLE_ALPHA_TO_COVERAGE)}function YA(O){l!==O&&(O?n.frontFace(n.CW):n.frontFace(n.CCW),l=O)}function TA(O){O!==JD?(q(n.CULL_FACE),O!==p&&(O===xr?n.cullFace(n.BACK):O===VD?n.cullFace(n.FRONT):n.cullFace(n.FRONT_AND_BACK))):cA(n.CULL_FACE),p=O}function vP(O){O!==k&&(R&&n.lineWidth(O),k=O)}function BA(O,AA,tA){O?(q(n.POLYGON_OFFSET_FILL),(F!==AA||Z!==tA)&&(n.polygonOffset(AA,tA),F=AA,Z=tA)):cA(n.POLYGON_OFFSET_FILL)}function HA(O){O?q(n.SCISSOR_TEST):cA(n.SCISSOR_TEST)}function hP(O){O===void 0&&(O=n.TEXTURE0+S-1),sA!==O&&(n.activeTexture(O),sA=O)}function gP(O,AA,tA){tA===void 0&&(sA===null?tA=n.TEXTURE0+S-1:tA=sA);let zA=oA[tA];zA===void 0&&(zA={type:void 0,texture:void 0},oA[tA]=zA),(zA.type!==O||zA.texture!==AA)&&(sA!==tA&&(n.activeTexture(tA),sA=tA),n.bindTexture(O,AA||U[O]),zA.type=O,zA.texture=AA)}function M(){let O=oA[sA];O!==void 0&&O.type!==void 0&&(n.bindTexture(O.type,null),O.type=void 0,O.texture=void 0)}function w(){try{n.compressedTexImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function H(){try{n.compressedTexImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function W(){try{n.texSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function V(){try{n.texSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function X(){try{n.compressedTexSubImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function EA(){try{n.compressedTexSubImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function eA(){try{n.texStorage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function fA(){try{n.texStorage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function wA(){try{n.texImage2D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function $(){try{n.texImage3D(...arguments)}catch(O){console.error("THREE.WebGLState:",O)}}function rA(O){AP.equals(O)===!1&&(n.scissor(O.x,O.y,O.z,O.w),AP.copy(O))}function dA(O){sP.equals(O)===!1&&(n.viewport(O.x,O.y,O.z,O.w),sP.copy(O))}function jA(O,AA){let tA=r.get(AA);tA===void 0&&(tA=new WeakMap,r.set(AA,tA));let zA=tA.get(O);zA===void 0&&(zA=n.getUniformBlockIndex(AA,O.name),tA.set(O,zA))}function iA(O,AA){let zA=r.get(AA).get(O);o.get(AA)!==zA&&(n.uniformBlockBinding(AA,zA,O.__bindingPointIndex),o.set(AA,zA))}function kA(){n.disable(n.BLEND),n.disable(n.CULL_FACE),n.disable(n.DEPTH_TEST),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SCISSOR_TEST),n.disable(n.STENCIL_TEST),n.disable(n.SAMPLE_ALPHA_TO_COVERAGE),n.blendEquation(n.FUNC_ADD),n.blendFunc(n.ONE,n.ZERO),n.blendFuncSeparate(n.ONE,n.ZERO,n.ONE,n.ZERO),n.blendColor(0,0,0,0),n.colorMask(!0,!0,!0,!0),n.clearColor(0,0,0,0),n.depthMask(!0),n.depthFunc(n.LESS),i.setReversed(!1),n.clearDepth(1),n.stencilMask(4294967295),n.stencilFunc(n.ALWAYS,0,4294967295),n.stencilOp(n.KEEP,n.KEEP,n.KEEP),n.clearStencil(0),n.cullFace(n.BACK),n.frontFace(n.CCW),n.polygonOffset(0,0),n.activeTexture(n.TEXTURE0),n.bindFramebuffer(n.FRAMEBUFFER,null),n.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),n.bindFramebuffer(n.READ_FRAMEBUFFER,null),n.useProgram(null),n.lineWidth(1),n.scissor(0,0,n.canvas.width,n.canvas.height),n.viewport(0,0,n.canvas.width,n.canvas.height),D={},sA=null,oA={},z={},c=new WeakMap,g=[],B=null,f=!1,T=null,a=null,m=null,u=null,j=null,d=null,Q=null,Y=new mA(0,0,0),x=0,h=!1,l=null,p=null,k=null,F=null,Z=null,AP.set(0,0,n.canvas.width,n.canvas.height),sP.set(0,0,n.canvas.width,n.canvas.height),s.reset(),i.reset(),v.reset()}return{buffers:{color:s,depth:i,stencil:v},enable:q,disable:cA,bindFramebuffer:xA,drawBuffers:lA,useProgram:RA,setBlending:iP,setMaterial:LA,setFlipSided:YA,setCullFace:TA,setLineWidth:vP,setPolygonOffset:BA,setScissorTest:HA,activeTexture:hP,bindTexture:gP,unbindTexture:M,compressedTexImage2D:w,compressedTexImage3D:H,texImage2D:wA,texImage3D:$,updateUBOMapping:jA,uniformBlockBinding:iA,texStorage2D:eA,texStorage3D:fA,texSubImage2D:W,texSubImage3D:V,compressedTexSubImage2D:X,compressedTexSubImage3D:EA,scissor:rA,viewport:dA,reset:kA}}function rB(n,A,P,e,t,s,i){let v=A.has("WEBGL_multisampled_render_to_texture")?A.get("WEBGL_multisampled_render_to_texture"):null,o=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),r=new bA,D=new WeakMap,z,c=new WeakMap,g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function B(M,w){return g?new OffscreenCanvas(M,w):zn("canvas")}function f(M,w,H){let W=1,V=gP(M);if((V.width>H||V.height>H)&&(W=H/Math.max(V.width,V.height)),W<1)if(typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&M instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&M instanceof ImageBitmap||typeof VideoFrame<"u"&&M instanceof VideoFrame){let X=Math.floor(W*V.width),EA=Math.floor(W*V.height);z===void 0&&(z=B(X,EA));let eA=w?B(X,EA):z;return eA.width=X,eA.height=EA,eA.getContext("2d").drawImage(M,0,0,X,EA),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+V.width+"x"+V.height+") to ("+X+"x"+EA+")."),eA}else return"data"in M&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+V.width+"x"+V.height+")."),M;return M}function T(M){return M.generateMipmaps}function a(M){n.generateMipmap(M)}function m(M){return M.isWebGLCubeRenderTarget?n.TEXTURE_CUBE_MAP:M.isWebGL3DRenderTarget?n.TEXTURE_3D:M.isWebGLArrayRenderTarget||M.isCompressedArrayTexture?n.TEXTURE_2D_ARRAY:n.TEXTURE_2D}function u(M,w,H,W,V=!1){if(M!==null){if(n[M]!==void 0)return n[M];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+M+"'")}let X=w;if(w===n.RED&&(H===n.FLOAT&&(X=n.R32F),H===n.HALF_FLOAT&&(X=n.R16F),H===n.UNSIGNED_BYTE&&(X=n.R8)),w===n.RED_INTEGER&&(H===n.UNSIGNED_BYTE&&(X=n.R8UI),H===n.UNSIGNED_SHORT&&(X=n.R16UI),H===n.UNSIGNED_INT&&(X=n.R32UI),H===n.BYTE&&(X=n.R8I),H===n.SHORT&&(X=n.R16I),H===n.INT&&(X=n.R32I)),w===n.RG&&(H===n.FLOAT&&(X=n.RG32F),H===n.HALF_FLOAT&&(X=n.RG16F),H===n.UNSIGNED_BYTE&&(X=n.RG8)),w===n.RG_INTEGER&&(H===n.UNSIGNED_BYTE&&(X=n.RG8UI),H===n.UNSIGNED_SHORT&&(X=n.RG16UI),H===n.UNSIGNED_INT&&(X=n.RG32UI),H===n.BYTE&&(X=n.RG8I),H===n.SHORT&&(X=n.RG16I),H===n.INT&&(X=n.RG32I)),w===n.RGB_INTEGER&&(H===n.UNSIGNED_BYTE&&(X=n.RGB8UI),H===n.UNSIGNED_SHORT&&(X=n.RGB16UI),H===n.UNSIGNED_INT&&(X=n.RGB32UI),H===n.BYTE&&(X=n.RGB8I),H===n.SHORT&&(X=n.RGB16I),H===n.INT&&(X=n.RGB32I)),w===n.RGBA_INTEGER&&(H===n.UNSIGNED_BYTE&&(X=n.RGBA8UI),H===n.UNSIGNED_SHORT&&(X=n.RGBA16UI),H===n.UNSIGNED_INT&&(X=n.RGBA32UI),H===n.BYTE&&(X=n.RGBA8I),H===n.SHORT&&(X=n.RGBA16I),H===n.INT&&(X=n.RGBA32I)),w===n.RGB&&(H===n.UNSIGNED_INT_5_9_9_9_REV&&(X=n.RGB9_E5),H===n.UNSIGNED_INT_10F_11F_11F_REV&&(X=n.R11F_G11F_B10F)),w===n.RGBA){let EA=V?As:ZA.getTransfer(W);H===n.FLOAT&&(X=n.RGBA32F),H===n.HALF_FLOAT&&(X=n.RGBA16F),H===n.UNSIGNED_BYTE&&(X=EA===qA?n.SRGB8_ALPHA8:n.RGBA8),H===n.UNSIGNED_SHORT_4_4_4_4&&(X=n.RGBA4),H===n.UNSIGNED_SHORT_5_5_5_1&&(X=n.RGB5_A1)}return(X===n.R16F||X===n.R32F||X===n.RG16F||X===n.RG32F||X===n.RGBA16F||X===n.RGBA32F)&&A.get("EXT_color_buffer_float"),X}function j(M,w){let H;return M?w===null||w===rt||w===dn?H=n.DEPTH24_STENCIL8:w===Ae?H=n.DEPTH32F_STENCIL8:w===Mn&&(H=n.DEPTH24_STENCIL8,console.warn("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):w===null||w===rt||w===dn?H=n.DEPTH_COMPONENT24:w===Ae?H=n.DEPTH_COMPONENT32F:w===Mn&&(H=n.DEPTH_COMPONENT16),H}function d(M,w){return T(M)===!0||M.isFramebufferTexture&&M.minFilter!==MP&&M.minFilter!==IP?Math.log2(Math.max(w.width,w.height))+1:M.mipmaps!==void 0&&M.mipmaps.length>0?M.mipmaps.length:M.isCompressedTexture&&Array.isArray(M.image)?w.mipmaps.length:1}function Q(M){let w=M.target;w.removeEventListener("dispose",Q),x(w),w.isVideoTexture&&D.delete(w)}function Y(M){let w=M.target;w.removeEventListener("dispose",Y),l(w)}function x(M){let w=e.get(M);if(w.__webglInit===void 0)return;let H=M.source,W=c.get(H);if(W){let V=W[w.__cacheKey];V.usedTimes--,V.usedTimes===0&&h(M),Object.keys(W).length===0&&c.delete(H)}e.remove(M)}function h(M){let w=e.get(M);n.deleteTexture(w.__webglTexture);let H=M.source,W=c.get(H);delete W[w.__cacheKey],i.memory.textures--}function l(M){let w=e.get(M);if(M.depthTexture&&(M.depthTexture.dispose(),e.remove(M.depthTexture)),M.isWebGLCubeRenderTarget)for(let W=0;W<6;W++){if(Array.isArray(w.__webglFramebuffer[W]))for(let V=0;V<w.__webglFramebuffer[W].length;V++)n.deleteFramebuffer(w.__webglFramebuffer[W][V]);else n.deleteFramebuffer(w.__webglFramebuffer[W]);w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer[W])}else{if(Array.isArray(w.__webglFramebuffer))for(let W=0;W<w.__webglFramebuffer.length;W++)n.deleteFramebuffer(w.__webglFramebuffer[W]);else n.deleteFramebuffer(w.__webglFramebuffer);if(w.__webglDepthbuffer&&n.deleteRenderbuffer(w.__webglDepthbuffer),w.__webglMultisampledFramebuffer&&n.deleteFramebuffer(w.__webglMultisampledFramebuffer),w.__webglColorRenderbuffer)for(let W=0;W<w.__webglColorRenderbuffer.length;W++)w.__webglColorRenderbuffer[W]&&n.deleteRenderbuffer(w.__webglColorRenderbuffer[W]);w.__webglDepthRenderbuffer&&n.deleteRenderbuffer(w.__webglDepthRenderbuffer)}let H=M.textures;for(let W=0,V=H.length;W<V;W++){let X=e.get(H[W]);X.__webglTexture&&(n.deleteTexture(X.__webglTexture),i.memory.textures--),e.remove(H[W])}e.remove(M)}let p=0;function k(){p=0}function F(){let M=p;return M>=t.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+M+" texture units while this GPU supports only "+t.maxTextures),p+=1,M}function Z(M){let w=[];return w.push(M.wrapS),w.push(M.wrapT),w.push(M.wrapR||0),w.push(M.magFilter),w.push(M.minFilter),w.push(M.anisotropy),w.push(M.internalFormat),w.push(M.format),w.push(M.type),w.push(M.generateMipmaps),w.push(M.premultiplyAlpha),w.push(M.flipY),w.push(M.unpackAlignment),w.push(M.colorSpace),w.join()}function S(M,w){let H=e.get(M);if(M.isVideoTexture&&HA(M),M.isRenderTargetTexture===!1&&M.isExternalTexture!==!0&&M.version>0&&H.__version!==M.version){let W=M.image;if(W===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(W.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{U(H,M,w);return}}else M.isExternalTexture&&(H.__webglTexture=M.sourceTexture?M.sourceTexture:null);P.bindTexture(n.TEXTURE_2D,H.__webglTexture,n.TEXTURE0+w)}function R(M,w){let H=e.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&H.__version!==M.version){U(H,M,w);return}P.bindTexture(n.TEXTURE_2D_ARRAY,H.__webglTexture,n.TEXTURE0+w)}function PA(M,w){let H=e.get(M);if(M.isRenderTargetTexture===!1&&M.version>0&&H.__version!==M.version){U(H,M,w);return}P.bindTexture(n.TEXTURE_3D,H.__webglTexture,n.TEXTURE0+w)}function N(M,w){let H=e.get(M);if(M.version>0&&H.__version!==M.version){q(H,M,w);return}P.bindTexture(n.TEXTURE_CUBE_MAP,H.__webglTexture,n.TEXTURE0+w)}let sA={[tt]:n.REPEAT,[Be]:n.CLAMP_TO_EDGE,[on]:n.MIRRORED_REPEAT},oA={[MP]:n.NEAREST,[Vi]:n.NEAREST_MIPMAP_NEAREST,[Ot]:n.NEAREST_MIPMAP_LINEAR,[IP]:n.LINEAR,[mn]:n.LINEAR_MIPMAP_NEAREST,[ze]:n.LINEAR_MIPMAP_LINEAR},hA={[d9]:n.NEVER,[O9]:n.ALWAYS,[b9]:n.LESS,[Ur]:n.LEQUAL,[Y9]:n.EQUAL,[x9]:n.GEQUAL,[p9]:n.GREATER,[y9]:n.NOTEQUAL};function CA(M,w){if(w.type===Ae&&A.has("OES_texture_float_linear")===!1&&(w.magFilter===IP||w.magFilter===mn||w.magFilter===Ot||w.magFilter===ze||w.minFilter===IP||w.minFilter===mn||w.minFilter===Ot||w.minFilter===ze)&&console.warn("THREE.WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),n.texParameteri(M,n.TEXTURE_WRAP_S,sA[w.wrapS]),n.texParameteri(M,n.TEXTURE_WRAP_T,sA[w.wrapT]),(M===n.TEXTURE_3D||M===n.TEXTURE_2D_ARRAY)&&n.texParameteri(M,n.TEXTURE_WRAP_R,sA[w.wrapR]),n.texParameteri(M,n.TEXTURE_MAG_FILTER,oA[w.magFilter]),n.texParameteri(M,n.TEXTURE_MIN_FILTER,oA[w.minFilter]),w.compareFunction&&(n.texParameteri(M,n.TEXTURE_COMPARE_MODE,n.COMPARE_REF_TO_TEXTURE),n.texParameteri(M,n.TEXTURE_COMPARE_FUNC,hA[w.compareFunction])),A.has("EXT_texture_filter_anisotropic")===!0){if(w.magFilter===MP||w.minFilter!==Ot&&w.minFilter!==ze||w.type===Ae&&A.has("OES_texture_float_linear")===!1)return;if(w.anisotropy>1||e.get(w).__currentAnisotropy){let H=A.get("EXT_texture_filter_anisotropic");n.texParameterf(M,H.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(w.anisotropy,t.getMaxAnisotropy())),e.get(w).__currentAnisotropy=w.anisotropy}}}function AP(M,w){let H=!1;M.__webglInit===void 0&&(M.__webglInit=!0,w.addEventListener("dispose",Q));let W=w.source,V=c.get(W);V===void 0&&(V={},c.set(W,V));let X=Z(w);if(X!==M.__cacheKey){V[X]===void 0&&(V[X]={texture:n.createTexture(),usedTimes:0},i.memory.textures++,H=!0),V[X].usedTimes++;let EA=V[M.__cacheKey];EA!==void 0&&(V[M.__cacheKey].usedTimes--,EA.usedTimes===0&&h(w)),M.__cacheKey=X,M.__webglTexture=V[X].texture}return H}function sP(M,w,H){return Math.floor(Math.floor(M/H)/w)}function UA(M,w,H,W){let X=M.updateRanges;if(X.length===0)P.texSubImage2D(n.TEXTURE_2D,0,0,0,w.width,w.height,H,W,w.data);else{X.sort(($,rA)=>$.start-rA.start);let EA=0;for(let $=1;$<X.length;$++){let rA=X[EA],dA=X[$],jA=rA.start+rA.count,iA=sP(dA.start,w.width,4),kA=sP(rA.start,w.width,4);dA.start<=jA+1&&iA===kA&&sP(dA.start+dA.count-1,w.width,4)===iA?rA.count=Math.max(rA.count,dA.start+dA.count-rA.start):(++EA,X[EA]=dA)}X.length=EA+1;let eA=n.getParameter(n.UNPACK_ROW_LENGTH),fA=n.getParameter(n.UNPACK_SKIP_PIXELS),wA=n.getParameter(n.UNPACK_SKIP_ROWS);n.pixelStorei(n.UNPACK_ROW_LENGTH,w.width);for(let $=0,rA=X.length;$<rA;$++){let dA=X[$],jA=Math.floor(dA.start/4),iA=Math.ceil(dA.count/4),kA=jA%w.width,O=Math.floor(jA/w.width),AA=iA,tA=1;n.pixelStorei(n.UNPACK_SKIP_PIXELS,kA),n.pixelStorei(n.UNPACK_SKIP_ROWS,O),P.texSubImage2D(n.TEXTURE_2D,0,kA,O,AA,tA,H,W,w.data)}M.clearUpdateRanges(),n.pixelStorei(n.UNPACK_ROW_LENGTH,eA),n.pixelStorei(n.UNPACK_SKIP_PIXELS,fA),n.pixelStorei(n.UNPACK_SKIP_ROWS,wA)}}function U(M,w,H){let W=n.TEXTURE_2D;(w.isDataArrayTexture||w.isCompressedArrayTexture)&&(W=n.TEXTURE_2D_ARRAY),w.isData3DTexture&&(W=n.TEXTURE_3D);let V=AP(M,w),X=w.source;P.bindTexture(W,M.__webglTexture,n.TEXTURE0+H);let EA=e.get(X);if(X.version!==EA.__version||V===!0){P.activeTexture(n.TEXTURE0+H);let eA=ZA.getPrimaries(ZA.workingColorSpace),fA=w.colorSpace===Je?null:ZA.getPrimaries(w.colorSpace),wA=w.colorSpace===Je||eA===fA?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,wA);let $=f(w.image,!1,t.maxTextureSize);$=hP(w,$);let rA=s.convert(w.format,w.colorSpace),dA=s.convert(w.type),jA=u(w.internalFormat,rA,dA,w.colorSpace,w.isVideoTexture);CA(W,w);let iA,kA=w.mipmaps,O=w.isVideoTexture!==!0,AA=EA.__version===void 0||V===!0,tA=X.dataReady,zA=d(w,$);if(w.isDepthTexture)jA=j(w.format===bn,w.type),AA&&(O?P.texStorage2D(n.TEXTURE_2D,1,jA,$.width,$.height):P.texImage2D(n.TEXTURE_2D,0,jA,$.width,$.height,0,rA,dA,null));else if(w.isDataTexture)if(kA.length>0){O&&AA&&P.texStorage2D(n.TEXTURE_2D,zA,jA,kA[0].width,kA[0].height);for(let K=0,J=kA.length;K<J;K++)iA=kA[K],O?tA&&P.texSubImage2D(n.TEXTURE_2D,K,0,0,iA.width,iA.height,rA,dA,iA.data):P.texImage2D(n.TEXTURE_2D,K,jA,iA.width,iA.height,0,rA,dA,iA.data);w.generateMipmaps=!1}else O?(AA&&P.texStorage2D(n.TEXTURE_2D,zA,jA,$.width,$.height),tA&&UA(w,$,rA,dA)):P.texImage2D(n.TEXTURE_2D,0,jA,$.width,$.height,0,rA,dA,$.data);else if(w.isCompressedTexture)if(w.isCompressedArrayTexture){O&&AA&&P.texStorage3D(n.TEXTURE_2D_ARRAY,zA,jA,kA[0].width,kA[0].height,$.depth);for(let K=0,J=kA.length;K<J;K++)if(iA=kA[K],w.format!==qP)if(rA!==null)if(O){if(tA)if(w.layerUpdates.size>0){let gA=Po(iA.width,iA.height,w.format,w.type);for(let OA of w.layerUpdates){let PP=iA.data.subarray(OA*gA/iA.data.BYTES_PER_ELEMENT,(OA+1)*gA/iA.data.BYTES_PER_ELEMENT);P.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,OA,iA.width,iA.height,1,rA,PP)}w.clearLayerUpdates()}else P.compressedTexSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,iA.width,iA.height,$.depth,rA,iA.data)}else P.compressedTexImage3D(n.TEXTURE_2D_ARRAY,K,jA,iA.width,iA.height,$.depth,0,iA.data,0,0);else console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else O?tA&&P.texSubImage3D(n.TEXTURE_2D_ARRAY,K,0,0,0,iA.width,iA.height,$.depth,rA,dA,iA.data):P.texImage3D(n.TEXTURE_2D_ARRAY,K,jA,iA.width,iA.height,$.depth,0,rA,dA,iA.data)}else{O&&AA&&P.texStorage2D(n.TEXTURE_2D,zA,jA,kA[0].width,kA[0].height);for(let K=0,J=kA.length;K<J;K++)iA=kA[K],w.format!==qP?rA!==null?O?tA&&P.compressedTexSubImage2D(n.TEXTURE_2D,K,0,0,iA.width,iA.height,rA,iA.data):P.compressedTexImage2D(n.TEXTURE_2D,K,jA,iA.width,iA.height,0,iA.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):O?tA&&P.texSubImage2D(n.TEXTURE_2D,K,0,0,iA.width,iA.height,rA,dA,iA.data):P.texImage2D(n.TEXTURE_2D,K,jA,iA.width,iA.height,0,rA,dA,iA.data)}else if(w.isDataArrayTexture)if(O){if(AA&&P.texStorage3D(n.TEXTURE_2D_ARRAY,zA,jA,$.width,$.height,$.depth),tA)if(w.layerUpdates.size>0){let K=Po($.width,$.height,w.format,w.type);for(let J of w.layerUpdates){let gA=$.data.subarray(J*K/$.data.BYTES_PER_ELEMENT,(J+1)*K/$.data.BYTES_PER_ELEMENT);P.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,J,$.width,$.height,1,rA,dA,gA)}w.clearLayerUpdates()}else P.texSubImage3D(n.TEXTURE_2D_ARRAY,0,0,0,0,$.width,$.height,$.depth,rA,dA,$.data)}else P.texImage3D(n.TEXTURE_2D_ARRAY,0,jA,$.width,$.height,$.depth,0,rA,dA,$.data);else if(w.isData3DTexture)O?(AA&&P.texStorage3D(n.TEXTURE_3D,zA,jA,$.width,$.height,$.depth),tA&&P.texSubImage3D(n.TEXTURE_3D,0,0,0,0,$.width,$.height,$.depth,rA,dA,$.data)):P.texImage3D(n.TEXTURE_3D,0,jA,$.width,$.height,$.depth,0,rA,dA,$.data);else if(w.isFramebufferTexture){if(AA)if(O)P.texStorage2D(n.TEXTURE_2D,zA,jA,$.width,$.height);else{let K=$.width,J=$.height;for(let gA=0;gA<zA;gA++)P.texImage2D(n.TEXTURE_2D,gA,jA,K,J,0,rA,dA,null),K>>=1,J>>=1}}else if(kA.length>0){if(O&&AA){let K=gP(kA[0]);P.texStorage2D(n.TEXTURE_2D,zA,jA,K.width,K.height)}for(let K=0,J=kA.length;K<J;K++)iA=kA[K],O?tA&&P.texSubImage2D(n.TEXTURE_2D,K,0,0,rA,dA,iA):P.texImage2D(n.TEXTURE_2D,K,jA,rA,dA,iA);w.generateMipmaps=!1}else if(O){if(AA){let K=gP($);P.texStorage2D(n.TEXTURE_2D,zA,jA,K.width,K.height)}tA&&P.texSubImage2D(n.TEXTURE_2D,0,0,0,rA,dA,$)}else P.texImage2D(n.TEXTURE_2D,0,jA,rA,dA,$);T(w)&&a(W),EA.__version=X.version,w.onUpdate&&w.onUpdate(w)}M.__version=w.version}function q(M,w,H){if(w.image.length!==6)return;let W=AP(M,w),V=w.source;P.bindTexture(n.TEXTURE_CUBE_MAP,M.__webglTexture,n.TEXTURE0+H);let X=e.get(V);if(V.version!==X.__version||W===!0){P.activeTexture(n.TEXTURE0+H);let EA=ZA.getPrimaries(ZA.workingColorSpace),eA=w.colorSpace===Je?null:ZA.getPrimaries(w.colorSpace),fA=w.colorSpace===Je||EA===eA?n.NONE:n.BROWSER_DEFAULT_WEBGL;n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,w.flipY),n.pixelStorei(n.UNPACK_PREMULTIPLY_ALPHA_WEBGL,w.premultiplyAlpha),n.pixelStorei(n.UNPACK_ALIGNMENT,w.unpackAlignment),n.pixelStorei(n.UNPACK_COLORSPACE_CONVERSION_WEBGL,fA);let wA=w.isCompressedTexture||w.image[0].isCompressedTexture,$=w.image[0]&&w.image[0].isDataTexture,rA=[];for(let J=0;J<6;J++)!wA&&!$?rA[J]=f(w.image[J],!0,t.maxCubemapSize):rA[J]=$?w.image[J].image:w.image[J],rA[J]=hP(w,rA[J]);let dA=rA[0],jA=s.convert(w.format,w.colorSpace),iA=s.convert(w.type),kA=u(w.internalFormat,jA,iA,w.colorSpace),O=w.isVideoTexture!==!0,AA=X.__version===void 0||W===!0,tA=V.dataReady,zA=d(w,dA);CA(n.TEXTURE_CUBE_MAP,w);let K;if(wA){O&&AA&&P.texStorage2D(n.TEXTURE_CUBE_MAP,zA,kA,dA.width,dA.height);for(let J=0;J<6;J++){K=rA[J].mipmaps;for(let gA=0;gA<K.length;gA++){let OA=K[gA];w.format!==qP?jA!==null?O?tA&&P.compressedTexSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA,0,0,OA.width,OA.height,jA,OA.data):P.compressedTexImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA,kA,OA.width,OA.height,0,OA.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):O?tA&&P.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA,0,0,OA.width,OA.height,jA,iA,OA.data):P.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA,kA,OA.width,OA.height,0,jA,iA,OA.data)}}}else{if(K=w.mipmaps,O&&AA){K.length>0&&zA++;let J=gP(rA[0]);P.texStorage2D(n.TEXTURE_CUBE_MAP,zA,kA,J.width,J.height)}for(let J=0;J<6;J++)if($){O?tA&&P.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,rA[J].width,rA[J].height,jA,iA,rA[J].data):P.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,kA,rA[J].width,rA[J].height,0,jA,iA,rA[J].data);for(let gA=0;gA<K.length;gA++){let PP=K[gA].image[J].image;O?tA&&P.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA+1,0,0,PP.width,PP.height,jA,iA,PP.data):P.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA+1,kA,PP.width,PP.height,0,jA,iA,PP.data)}}else{O?tA&&P.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,0,0,jA,iA,rA[J]):P.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,0,kA,jA,iA,rA[J]);for(let gA=0;gA<K.length;gA++){let OA=K[gA];O?tA&&P.texSubImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA+1,0,0,jA,iA,OA.image[J]):P.texImage2D(n.TEXTURE_CUBE_MAP_POSITIVE_X+J,gA+1,kA,jA,iA,OA.image[J])}}}T(w)&&a(n.TEXTURE_CUBE_MAP),X.__version=V.version,w.onUpdate&&w.onUpdate(w)}M.__version=w.version}function cA(M,w,H,W,V,X){let EA=s.convert(H.format,H.colorSpace),eA=s.convert(H.type),fA=u(H.internalFormat,EA,eA,H.colorSpace),wA=e.get(w),$=e.get(H);if($.__renderTarget=w,!wA.__hasExternalTextures){let rA=Math.max(1,w.width>>X),dA=Math.max(1,w.height>>X);V===n.TEXTURE_3D||V===n.TEXTURE_2D_ARRAY?P.texImage3D(V,X,fA,rA,dA,w.depth,0,EA,eA,null):P.texImage2D(V,X,fA,rA,dA,0,EA,eA,null)}P.bindFramebuffer(n.FRAMEBUFFER,M),BA(w)?v.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,W,V,$.__webglTexture,0,vP(w)):(V===n.TEXTURE_2D||V>=n.TEXTURE_CUBE_MAP_POSITIVE_X&&V<=n.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&n.framebufferTexture2D(n.FRAMEBUFFER,W,V,$.__webglTexture,X),P.bindFramebuffer(n.FRAMEBUFFER,null)}function xA(M,w,H){if(n.bindRenderbuffer(n.RENDERBUFFER,M),w.depthBuffer){let W=w.depthTexture,V=W&&W.isDepthTexture?W.type:null,X=j(w.stencilBuffer,V),EA=w.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,eA=vP(w);BA(w)?v.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,eA,X,w.width,w.height):H?n.renderbufferStorageMultisample(n.RENDERBUFFER,eA,X,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,X,w.width,w.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,EA,n.RENDERBUFFER,M)}else{let W=w.textures;for(let V=0;V<W.length;V++){let X=W[V],EA=s.convert(X.format,X.colorSpace),eA=s.convert(X.type),fA=u(X.internalFormat,EA,eA,X.colorSpace),wA=vP(w);H&&BA(w)===!1?n.renderbufferStorageMultisample(n.RENDERBUFFER,wA,fA,w.width,w.height):BA(w)?v.renderbufferStorageMultisampleEXT(n.RENDERBUFFER,wA,fA,w.width,w.height):n.renderbufferStorage(n.RENDERBUFFER,fA,w.width,w.height)}}n.bindRenderbuffer(n.RENDERBUFFER,null)}function lA(M,w){if(w&&w.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(P.bindFramebuffer(n.FRAMEBUFFER,M),!(w.depthTexture&&w.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");let W=e.get(w.depthTexture);W.__renderTarget=w,(!W.__webglTexture||w.depthTexture.image.width!==w.width||w.depthTexture.image.height!==w.height)&&(w.depthTexture.image.width=w.width,w.depthTexture.image.height=w.height,w.depthTexture.needsUpdate=!0),S(w.depthTexture,0);let V=W.__webglTexture,X=vP(w);if(w.depthTexture.format===Dn)BA(w)?v.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,V,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_ATTACHMENT,n.TEXTURE_2D,V,0);else if(w.depthTexture.format===bn)BA(w)?v.framebufferTexture2DMultisampleEXT(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,V,0,X):n.framebufferTexture2D(n.FRAMEBUFFER,n.DEPTH_STENCIL_ATTACHMENT,n.TEXTURE_2D,V,0);else throw new Error("Unknown depthTexture format")}function RA(M){let w=e.get(M),H=M.isWebGLCubeRenderTarget===!0;if(w.__boundDepthTexture!==M.depthTexture){let W=M.depthTexture;if(w.__depthDisposeCallback&&w.__depthDisposeCallback(),W){let V=()=>{delete w.__boundDepthTexture,delete w.__depthDisposeCallback,W.removeEventListener("dispose",V)};W.addEventListener("dispose",V),w.__depthDisposeCallback=V}w.__boundDepthTexture=W}if(M.depthTexture&&!w.__autoAllocateDepthBuffer){if(H)throw new Error("target.depthTexture not supported in Cube render targets");let W=M.texture.mipmaps;W&&W.length>0?lA(w.__webglFramebuffer[0],M):lA(w.__webglFramebuffer,M)}else if(H){w.__webglDepthbuffer=[];for(let W=0;W<6;W++)if(P.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[W]),w.__webglDepthbuffer[W]===void 0)w.__webglDepthbuffer[W]=n.createRenderbuffer(),xA(w.__webglDepthbuffer[W],M,!1);else{let V=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer[W];n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,V,n.RENDERBUFFER,X)}}else{let W=M.texture.mipmaps;if(W&&W.length>0?P.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer[0]):P.bindFramebuffer(n.FRAMEBUFFER,w.__webglFramebuffer),w.__webglDepthbuffer===void 0)w.__webglDepthbuffer=n.createRenderbuffer(),xA(w.__webglDepthbuffer,M,!1);else{let V=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,X=w.__webglDepthbuffer;n.bindRenderbuffer(n.RENDERBUFFER,X),n.framebufferRenderbuffer(n.FRAMEBUFFER,V,n.RENDERBUFFER,X)}}P.bindFramebuffer(n.FRAMEBUFFER,null)}function dP(M,w,H){let W=e.get(M);w!==void 0&&cA(W.__webglFramebuffer,M,M.texture,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,0),H!==void 0&&RA(M)}function b(M){let w=M.texture,H=e.get(M),W=e.get(w);M.addEventListener("dispose",Y);let V=M.textures,X=M.isWebGLCubeRenderTarget===!0,EA=V.length>1;if(EA||(W.__webglTexture===void 0&&(W.__webglTexture=n.createTexture()),W.__version=w.version,i.memory.textures++),X){H.__webglFramebuffer=[];for(let eA=0;eA<6;eA++)if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer[eA]=[];for(let fA=0;fA<w.mipmaps.length;fA++)H.__webglFramebuffer[eA][fA]=n.createFramebuffer()}else H.__webglFramebuffer[eA]=n.createFramebuffer()}else{if(w.mipmaps&&w.mipmaps.length>0){H.__webglFramebuffer=[];for(let eA=0;eA<w.mipmaps.length;eA++)H.__webglFramebuffer[eA]=n.createFramebuffer()}else H.__webglFramebuffer=n.createFramebuffer();if(EA)for(let eA=0,fA=V.length;eA<fA;eA++){let wA=e.get(V[eA]);wA.__webglTexture===void 0&&(wA.__webglTexture=n.createTexture(),i.memory.textures++)}if(M.samples>0&&BA(M)===!1){H.__webglMultisampledFramebuffer=n.createFramebuffer(),H.__webglColorRenderbuffer=[],P.bindFramebuffer(n.FRAMEBUFFER,H.__webglMultisampledFramebuffer);for(let eA=0;eA<V.length;eA++){let fA=V[eA];H.__webglColorRenderbuffer[eA]=n.createRenderbuffer(),n.bindRenderbuffer(n.RENDERBUFFER,H.__webglColorRenderbuffer[eA]);let wA=s.convert(fA.format,fA.colorSpace),$=s.convert(fA.type),rA=u(fA.internalFormat,wA,$,fA.colorSpace,M.isXRRenderTarget===!0),dA=vP(M);n.renderbufferStorageMultisample(n.RENDERBUFFER,dA,rA,M.width,M.height),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+eA,n.RENDERBUFFER,H.__webglColorRenderbuffer[eA])}n.bindRenderbuffer(n.RENDERBUFFER,null),M.depthBuffer&&(H.__webglDepthRenderbuffer=n.createRenderbuffer(),xA(H.__webglDepthRenderbuffer,M,!0)),P.bindFramebuffer(n.FRAMEBUFFER,null)}}if(X){P.bindTexture(n.TEXTURE_CUBE_MAP,W.__webglTexture),CA(n.TEXTURE_CUBE_MAP,w);for(let eA=0;eA<6;eA++)if(w.mipmaps&&w.mipmaps.length>0)for(let fA=0;fA<w.mipmaps.length;fA++)cA(H.__webglFramebuffer[eA][fA],M,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+eA,fA);else cA(H.__webglFramebuffer[eA],M,w,n.COLOR_ATTACHMENT0,n.TEXTURE_CUBE_MAP_POSITIVE_X+eA,0);T(w)&&a(n.TEXTURE_CUBE_MAP),P.unbindTexture()}else if(EA){for(let eA=0,fA=V.length;eA<fA;eA++){let wA=V[eA],$=e.get(wA),rA=n.TEXTURE_2D;(M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(rA=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),P.bindTexture(rA,$.__webglTexture),CA(rA,wA),cA(H.__webglFramebuffer,M,wA,n.COLOR_ATTACHMENT0+eA,rA,0),T(wA)&&a(rA)}P.unbindTexture()}else{let eA=n.TEXTURE_2D;if((M.isWebGL3DRenderTarget||M.isWebGLArrayRenderTarget)&&(eA=M.isWebGL3DRenderTarget?n.TEXTURE_3D:n.TEXTURE_2D_ARRAY),P.bindTexture(eA,W.__webglTexture),CA(eA,w),w.mipmaps&&w.mipmaps.length>0)for(let fA=0;fA<w.mipmaps.length;fA++)cA(H.__webglFramebuffer[fA],M,w,n.COLOR_ATTACHMENT0,eA,fA);else cA(H.__webglFramebuffer,M,w,n.COLOR_ATTACHMENT0,eA,0);T(w)&&a(eA),P.unbindTexture()}M.depthBuffer&&RA(M)}function iP(M){let w=M.textures;for(let H=0,W=w.length;H<W;H++){let V=w[H];if(T(V)){let X=m(M),EA=e.get(V).__webglTexture;P.bindTexture(X,EA),a(X),P.unbindTexture()}}}let LA=[],YA=[];function TA(M){if(M.samples>0){if(BA(M)===!1){let w=M.textures,H=M.width,W=M.height,V=n.COLOR_BUFFER_BIT,X=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT,EA=e.get(M),eA=w.length>1;if(eA)for(let wA=0;wA<w.length;wA++)P.bindFramebuffer(n.FRAMEBUFFER,EA.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wA,n.RENDERBUFFER,null),P.bindFramebuffer(n.FRAMEBUFFER,EA.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wA,n.TEXTURE_2D,null,0);P.bindFramebuffer(n.READ_FRAMEBUFFER,EA.__webglMultisampledFramebuffer);let fA=M.texture.mipmaps;fA&&fA.length>0?P.bindFramebuffer(n.DRAW_FRAMEBUFFER,EA.__webglFramebuffer[0]):P.bindFramebuffer(n.DRAW_FRAMEBUFFER,EA.__webglFramebuffer);for(let wA=0;wA<w.length;wA++){if(M.resolveDepthBuffer&&(M.depthBuffer&&(V|=n.DEPTH_BUFFER_BIT),M.stencilBuffer&&M.resolveStencilBuffer&&(V|=n.STENCIL_BUFFER_BIT)),eA){n.framebufferRenderbuffer(n.READ_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.RENDERBUFFER,EA.__webglColorRenderbuffer[wA]);let $=e.get(w[wA]).__webglTexture;n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,$,0)}n.blitFramebuffer(0,0,H,W,0,0,H,W,V,n.NEAREST),o===!0&&(LA.length=0,YA.length=0,LA.push(n.COLOR_ATTACHMENT0+wA),M.depthBuffer&&M.resolveDepthBuffer===!1&&(LA.push(X),YA.push(X),n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,YA)),n.invalidateFramebuffer(n.READ_FRAMEBUFFER,LA))}if(P.bindFramebuffer(n.READ_FRAMEBUFFER,null),P.bindFramebuffer(n.DRAW_FRAMEBUFFER,null),eA)for(let wA=0;wA<w.length;wA++){P.bindFramebuffer(n.FRAMEBUFFER,EA.__webglMultisampledFramebuffer),n.framebufferRenderbuffer(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0+wA,n.RENDERBUFFER,EA.__webglColorRenderbuffer[wA]);let $=e.get(w[wA]).__webglTexture;P.bindFramebuffer(n.FRAMEBUFFER,EA.__webglFramebuffer),n.framebufferTexture2D(n.DRAW_FRAMEBUFFER,n.COLOR_ATTACHMENT0+wA,n.TEXTURE_2D,$,0)}P.bindFramebuffer(n.DRAW_FRAMEBUFFER,EA.__webglMultisampledFramebuffer)}else if(M.depthBuffer&&M.resolveDepthBuffer===!1&&o){let w=M.stencilBuffer?n.DEPTH_STENCIL_ATTACHMENT:n.DEPTH_ATTACHMENT;n.invalidateFramebuffer(n.DRAW_FRAMEBUFFER,[w])}}}function vP(M){return Math.min(t.maxSamples,M.samples)}function BA(M){let w=e.get(M);return M.samples>0&&A.has("WEBGL_multisampled_render_to_texture")===!0&&w.__useRenderToTexture!==!1}function HA(M){let w=i.render.frame;D.get(M)!==w&&(D.set(M,w),M.update())}function hP(M,w){let H=M.colorSpace,W=M.format,V=M.type;return M.isCompressedTexture===!0||M.isVideoTexture===!0||H!==QP&&H!==Je&&(ZA.getTransfer(H)===qA?(W!==qP||V!==ce)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",H)),w}function gP(M){return typeof HTMLImageElement<"u"&&M instanceof HTMLImageElement?(r.width=M.naturalWidth||M.width,r.height=M.naturalHeight||M.height):typeof VideoFrame<"u"&&M instanceof VideoFrame?(r.width=M.displayWidth,r.height=M.displayHeight):(r.width=M.width,r.height=M.height),r}this.allocateTextureUnit=F,this.resetTextureUnits=k,this.setTexture2D=S,this.setTexture2DArray=R,this.setTexture3D=PA,this.setTextureCube=N,this.rebindTextures=dP,this.setupRenderTarget=b,this.updateRenderTargetMipmap=iP,this.updateMultisampleRenderTarget=TA,this.setupDepthRenderbuffer=RA,this.setupFrameBufferTexture=cA,this.useMultisampledRTT=BA}function oB(n,A){function P(e,t=Je){let s,i=ZA.getTransfer(t);if(e===ce)return n.UNSIGNED_BYTE;if(e===Ki)return n.UNSIGNED_SHORT_4_4_4_4;if(e===_i)return n.UNSIGNED_SHORT_5_5_5_1;if(e===Fr)return n.UNSIGNED_INT_5_9_9_9_REV;if(e===Nr)return n.UNSIGNED_INT_10F_11F_11F_REV;if(e===Gr)return n.BYTE;if(e===Cr)return n.SHORT;if(e===Mn)return n.UNSIGNED_SHORT;if(e===qi)return n.INT;if(e===rt)return n.UNSIGNED_INT;if(e===Ae)return n.FLOAT;if(e===Qn)return n.HALF_FLOAT;if(e===Xr)return n.ALPHA;if(e===Zr)return n.RGB;if(e===qP)return n.RGBA;if(e===Dn)return n.DEPTH_COMPONENT;if(e===bn)return n.DEPTH_STENCIL;if(e===$i)return n.RED;if(e===Av)return n.RED_INTEGER;if(e===Rr)return n.RG;if(e===Pv)return n.RG_INTEGER;if(e===ev)return n.RGBA_INTEGER;if(e===ps||e===ys||e===xs||e===Os)if(i===qA)if(s=A.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(e===ps)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(e===ys)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(e===xs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(e===Os)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=A.get("WEBGL_compressed_texture_s3tc"),s!==null){if(e===ps)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(e===ys)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(e===xs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(e===Os)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(e===tv||e===nv||e===sv||e===iv)if(s=A.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(e===tv)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(e===nv)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(e===sv)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(e===iv)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(e===vv||e===rv||e===ov)if(s=A.get("WEBGL_compressed_texture_etc"),s!==null){if(e===vv||e===rv)return i===qA?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(e===ov)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(e===Dv||e===zv||e===cv||e===av||e===gv||e===Tv||e===Bv||e===fv||e===wv||e===jv||e===Ev||e===lv||e===hv||e===uv)if(s=A.get("WEBGL_compressed_texture_astc"),s!==null){if(e===Dv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(e===zv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(e===cv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(e===av)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(e===gv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(e===Tv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(e===Bv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(e===fv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(e===wv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(e===jv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(e===Ev)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(e===lv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(e===hv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(e===uv)return i===qA?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(e===mv||e===Mv||e===Qv)if(s=A.get("EXT_texture_compression_bptc"),s!==null){if(e===mv)return i===qA?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(e===Mv)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(e===Qv)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(e===dv||e===bv||e===Yv||e===pv)if(s=A.get("EXT_texture_compression_rgtc"),s!==null){if(e===dv)return s.COMPRESSED_RED_RGTC1_EXT;if(e===bv)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(e===Yv)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(e===pv)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return e===dn?n.UNSIGNED_INT_24_8:n[e]!==void 0?n[e]:null}return{convert:P}}var DB=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,zB=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,go=class{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(A,P){if(this.texture===null){let e=new js(A.texture);(A.depthNear!==P.depthNear||A.depthFar!==P.depthFar)&&(this.depthNear=A.depthNear,this.depthFar=A.depthFar),this.texture=e}}getMesh(A){if(this.texture!==null&&this.mesh===null){let P=A.cameras[0].viewport,e=new VP({vertexShader:DB,fragmentShader:zB,uniforms:{depthColor:{value:this.texture},depthWidth:{value:P.z},depthHeight:{value:P.w}}});this.mesh=new eP(new vt(20,20),e)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}},To=class extends Ne{constructor(A,P){super();let e=this,t=null,s=1,i=null,v="local-floor",o=1,r=null,D=null,z=null,c=null,g=null,B=null,f=typeof XRWebGLBinding<"u",T=new go,a={},m=P.getContextAttributes(),u=null,j=null,d=[],Q=[],Y=new bA,x=null,h=new BP;h.viewport=new SA;let l=new BP;l.viewport=new SA;let p=[h,l],k=new Hi,F=null,Z=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(U){let q=d[U];return q===void 0&&(q=new Tn,d[U]=q),q.getTargetRaySpace()},this.getControllerGrip=function(U){let q=d[U];return q===void 0&&(q=new Tn,d[U]=q),q.getGripSpace()},this.getHand=function(U){let q=d[U];return q===void 0&&(q=new Tn,d[U]=q),q.getHandSpace()};function S(U){let q=Q.indexOf(U.inputSource);if(q===-1)return;let cA=d[q];cA!==void 0&&(cA.update(U.inputSource,U.frame,r||i),cA.dispatchEvent({type:U.type,data:U.inputSource}))}function R(){t.removeEventListener("select",S),t.removeEventListener("selectstart",S),t.removeEventListener("selectend",S),t.removeEventListener("squeeze",S),t.removeEventListener("squeezestart",S),t.removeEventListener("squeezeend",S),t.removeEventListener("end",R),t.removeEventListener("inputsourceschange",PA);for(let U=0;U<d.length;U++){let q=Q[U];q!==null&&(Q[U]=null,d[U].disconnect(q))}F=null,Z=null,T.reset();for(let U in a)delete a[U];A.setRenderTarget(u),g=null,c=null,z=null,t=null,j=null,UA.stop(),e.isPresenting=!1,A.setPixelRatio(x),A.setSize(Y.width,Y.height,!1),e.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(U){s=U,e.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(U){v=U,e.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return r||i},this.setReferenceSpace=function(U){r=U},this.getBaseLayer=function(){return c!==null?c:g},this.getBinding=function(){return z===null&&f&&(z=new XRWebGLBinding(t,P)),z},this.getFrame=function(){return B},this.getSession=function(){return t},this.setSession=async function(U){if(t=U,t!==null){if(u=A.getRenderTarget(),t.addEventListener("select",S),t.addEventListener("selectstart",S),t.addEventListener("selectend",S),t.addEventListener("squeeze",S),t.addEventListener("squeezestart",S),t.addEventListener("squeezeend",S),t.addEventListener("end",R),t.addEventListener("inputsourceschange",PA),m.xrCompatible!==!0&&await P.makeXRCompatible(),x=A.getPixelRatio(),A.getSize(Y),f&&"createProjectionLayer"in XRWebGLBinding.prototype){let cA=null,xA=null,lA=null;m.depth&&(lA=m.stencil?P.DEPTH24_STENCIL8:P.DEPTH_COMPONENT24,cA=m.stencil?bn:Dn,xA=m.stencil?dn:rt);let RA={colorFormat:P.RGBA8,depthFormat:lA,scaleFactor:s};z=this.getBinding(),c=z.createProjectionLayer(RA),t.updateRenderState({layers:[c]}),A.setPixelRatio(1),A.setSize(c.textureWidth,c.textureHeight,!1),j=new we(c.textureWidth,c.textureHeight,{format:qP,type:ce,depthTexture:new ws(c.textureWidth,c.textureHeight,xA,void 0,void 0,void 0,void 0,void 0,void 0,cA),stencilBuffer:m.stencil,colorSpace:A.outputColorSpace,samples:m.antialias?4:0,resolveDepthBuffer:c.ignoreDepthValues===!1,resolveStencilBuffer:c.ignoreDepthValues===!1})}else{let cA={antialias:m.antialias,alpha:!0,depth:m.depth,stencil:m.stencil,framebufferScaleFactor:s};g=new XRWebGLLayer(t,P,cA),t.updateRenderState({baseLayer:g}),A.setPixelRatio(1),A.setSize(g.framebufferWidth,g.framebufferHeight,!1),j=new we(g.framebufferWidth,g.framebufferHeight,{format:qP,type:ce,colorSpace:A.outputColorSpace,stencilBuffer:m.stencil,resolveDepthBuffer:g.ignoreDepthValues===!1,resolveStencilBuffer:g.ignoreDepthValues===!1})}j.isXRRenderTarget=!0,this.setFoveation(o),r=null,i=await t.requestReferenceSpace(v),UA.setContext(t),UA.start(),e.isPresenting=!0,e.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(t!==null)return t.environmentBlendMode},this.getDepthTexture=function(){return T.getDepthTexture()};function PA(U){for(let q=0;q<U.removed.length;q++){let cA=U.removed[q],xA=Q.indexOf(cA);xA>=0&&(Q[xA]=null,d[xA].disconnect(cA))}for(let q=0;q<U.added.length;q++){let cA=U.added[q],xA=Q.indexOf(cA);if(xA===-1){for(let RA=0;RA<d.length;RA++)if(RA>=Q.length){Q.push(cA),xA=RA;break}else if(Q[RA]===null){Q[RA]=cA,xA=RA;break}if(xA===-1)break}let lA=d[xA];lA&&lA.connect(cA)}}let N=new y,sA=new y;function oA(U,q,cA){N.setFromMatrixPosition(q.matrixWorld),sA.setFromMatrixPosition(cA.matrixWorld);let xA=N.distanceTo(sA),lA=q.projectionMatrix.elements,RA=cA.projectionMatrix.elements,dP=lA[14]/(lA[10]-1),b=lA[14]/(lA[10]+1),iP=(lA[9]+1)/lA[5],LA=(lA[9]-1)/lA[5],YA=(lA[8]-1)/lA[0],TA=(RA[8]+1)/RA[0],vP=dP*YA,BA=dP*TA,HA=xA/(-YA+TA),hP=HA*-YA;if(q.matrixWorld.decompose(U.position,U.quaternion,U.scale),U.translateX(hP),U.translateZ(HA),U.matrixWorld.compose(U.position,U.quaternion,U.scale),U.matrixWorldInverse.copy(U.matrixWorld).invert(),lA[10]===-1)U.projectionMatrix.copy(q.projectionMatrix),U.projectionMatrixInverse.copy(q.projectionMatrixInverse);else{let gP=dP+HA,M=b+HA,w=vP-hP,H=BA+(xA-hP),W=iP*b/M*gP,V=LA*b/M*gP;U.projectionMatrix.makePerspective(w,H,W,V,gP,M),U.projectionMatrixInverse.copy(U.projectionMatrix).invert()}}function hA(U,q){q===null?U.matrixWorld.copy(U.matrix):U.matrixWorld.multiplyMatrices(q.matrixWorld,U.matrix),U.matrixWorldInverse.copy(U.matrixWorld).invert()}this.updateCamera=function(U){if(t===null)return;let q=U.near,cA=U.far;T.texture!==null&&(T.depthNear>0&&(q=T.depthNear),T.depthFar>0&&(cA=T.depthFar)),k.near=l.near=h.near=q,k.far=l.far=h.far=cA,(F!==k.near||Z!==k.far)&&(t.updateRenderState({depthNear:k.near,depthFar:k.far}),F=k.near,Z=k.far),k.layers.mask=U.layers.mask|6,h.layers.mask=k.layers.mask&3,l.layers.mask=k.layers.mask&5;let xA=U.parent,lA=k.cameras;hA(k,xA);for(let RA=0;RA<lA.length;RA++)hA(lA[RA],xA);lA.length===2?oA(k,h,l):k.projectionMatrix.copy(h.projectionMatrix),CA(U,k,xA)};function CA(U,q,cA){cA===null?U.matrix.copy(q.matrixWorld):(U.matrix.copy(cA.matrixWorld),U.matrix.invert(),U.matrix.multiply(q.matrixWorld)),U.matrix.decompose(U.position,U.quaternion,U.scale),U.updateMatrixWorld(!0),U.projectionMatrix.copy(q.projectionMatrix),U.projectionMatrixInverse.copy(q.projectionMatrixInverse),U.isPerspectiveCamera&&(U.fov=mt*2*Math.atan(1/U.projectionMatrix.elements[5]),U.zoom=1)}this.getCamera=function(){return k},this.getFoveation=function(){if(!(c===null&&g===null))return o},this.setFoveation=function(U){o=U,c!==null&&(c.fixedFoveation=U),g!==null&&g.fixedFoveation!==void 0&&(g.fixedFoveation=U)},this.hasDepthSensing=function(){return T.texture!==null},this.getDepthSensingMesh=function(){return T.getMesh(k)},this.getCameraTexture=function(U){return a[U]};let AP=null;function sP(U,q){if(D=q.getViewerPose(r||i),B=q,D!==null){let cA=D.views;g!==null&&(A.setRenderTargetFramebuffer(j,g.framebuffer),A.setRenderTarget(j));let xA=!1;cA.length!==k.cameras.length&&(k.cameras.length=0,xA=!0);for(let b=0;b<cA.length;b++){let iP=cA[b],LA=null;if(g!==null)LA=g.getViewport(iP);else{let TA=z.getViewSubImage(c,iP);LA=TA.viewport,b===0&&(A.setRenderTargetTextures(j,TA.colorTexture,TA.depthStencilTexture),A.setRenderTarget(j))}let YA=p[b];YA===void 0&&(YA=new BP,YA.layers.enable(b),YA.viewport=new SA,p[b]=YA),YA.matrix.fromArray(iP.transform.matrix),YA.matrix.decompose(YA.position,YA.quaternion,YA.scale),YA.projectionMatrix.fromArray(iP.projectionMatrix),YA.projectionMatrixInverse.copy(YA.projectionMatrix).invert(),YA.viewport.set(LA.x,LA.y,LA.width,LA.height),b===0&&(k.matrix.copy(YA.matrix),k.matrix.decompose(k.position,k.quaternion,k.scale)),xA===!0&&k.cameras.push(YA)}let lA=t.enabledFeatures;if(lA&&lA.includes("depth-sensing")&&t.depthUsage=="gpu-optimized"&&f){z=e.getBinding();let b=z.getDepthInformation(cA[0]);b&&b.isValid&&b.texture&&T.init(b,t.renderState)}if(lA&&lA.includes("camera-access")&&f){A.state.unbindTexture(),z=e.getBinding();for(let b=0;b<cA.length;b++){let iP=cA[b].camera;if(iP){let LA=a[iP];LA||(LA=new js,a[iP]=LA);let YA=z.getCameraImage(iP);LA.sourceTexture=YA}}}}for(let cA=0;cA<d.length;cA++){let xA=Q[cA],lA=d[cA];xA!==null&&lA!==void 0&&lA.update(xA,q,r||i)}AP&&AP(U,q),q.detectedPlanes&&e.dispatchEvent({type:"planesdetected",data:q}),B=null}let UA=new D8;UA.setAnimationLoop(sP),this.setAnimationLoop=function(U){AP=U},this.dispose=function(){}}},kt=new oe,cB=new yA;function aB(n,A){function P(T,a){T.matrixAutoUpdate===!0&&T.updateMatrix(),a.value.copy(T.matrix)}function e(T,a){a.color.getRGB(T.fogColor.value,_r(n)),a.isFog?(T.fogNear.value=a.near,T.fogFar.value=a.far):a.isFogExp2&&(T.fogDensity.value=a.density)}function t(T,a,m,u,j){a.isMeshBasicMaterial||a.isMeshLambertMaterial?s(T,a):a.isMeshToonMaterial?(s(T,a),z(T,a)):a.isMeshPhongMaterial?(s(T,a),D(T,a)):a.isMeshStandardMaterial?(s(T,a),c(T,a),a.isMeshPhysicalMaterial&&g(T,a,j)):a.isMeshMatcapMaterial?(s(T,a),B(T,a)):a.isMeshDepthMaterial?s(T,a):a.isMeshDistanceMaterial?(s(T,a),f(T,a)):a.isMeshNormalMaterial?s(T,a):a.isLineBasicMaterial?(i(T,a),a.isLineDashedMaterial&&v(T,a)):a.isPointsMaterial?o(T,a,m,u):a.isSpriteMaterial?r(T,a):a.isShadowMaterial?(T.color.value.copy(a.color),T.opacity.value=a.opacity):a.isShaderMaterial&&(a.uniformsNeedUpdate=!1)}function s(T,a){T.opacity.value=a.opacity,a.color&&T.diffuse.value.copy(a.color),a.emissive&&T.emissive.value.copy(a.emissive).multiplyScalar(a.emissiveIntensity),a.map&&(T.map.value=a.map,P(a.map,T.mapTransform)),a.alphaMap&&(T.alphaMap.value=a.alphaMap,P(a.alphaMap,T.alphaMapTransform)),a.bumpMap&&(T.bumpMap.value=a.bumpMap,P(a.bumpMap,T.bumpMapTransform),T.bumpScale.value=a.bumpScale,a.side===HP&&(T.bumpScale.value*=-1)),a.normalMap&&(T.normalMap.value=a.normalMap,P(a.normalMap,T.normalMapTransform),T.normalScale.value.copy(a.normalScale),a.side===HP&&T.normalScale.value.negate()),a.displacementMap&&(T.displacementMap.value=a.displacementMap,P(a.displacementMap,T.displacementMapTransform),T.displacementScale.value=a.displacementScale,T.displacementBias.value=a.displacementBias),a.emissiveMap&&(T.emissiveMap.value=a.emissiveMap,P(a.emissiveMap,T.emissiveMapTransform)),a.specularMap&&(T.specularMap.value=a.specularMap,P(a.specularMap,T.specularMapTransform)),a.alphaTest>0&&(T.alphaTest.value=a.alphaTest);let m=A.get(a),u=m.envMap,j=m.envMapRotation;u&&(T.envMap.value=u,kt.copy(j),kt.x*=-1,kt.y*=-1,kt.z*=-1,u.isCubeTexture&&u.isRenderTargetTexture===!1&&(kt.y*=-1,kt.z*=-1),T.envMapRotation.value.setFromMatrix4(cB.makeRotationFromEuler(kt)),T.flipEnvMap.value=u.isCubeTexture&&u.isRenderTargetTexture===!1?-1:1,T.reflectivity.value=a.reflectivity,T.ior.value=a.ior,T.refractionRatio.value=a.refractionRatio),a.lightMap&&(T.lightMap.value=a.lightMap,T.lightMapIntensity.value=a.lightMapIntensity,P(a.lightMap,T.lightMapTransform)),a.aoMap&&(T.aoMap.value=a.aoMap,T.aoMapIntensity.value=a.aoMapIntensity,P(a.aoMap,T.aoMapTransform))}function i(T,a){T.diffuse.value.copy(a.color),T.opacity.value=a.opacity,a.map&&(T.map.value=a.map,P(a.map,T.mapTransform))}function v(T,a){T.dashSize.value=a.dashSize,T.totalSize.value=a.dashSize+a.gapSize,T.scale.value=a.scale}function o(T,a,m,u){T.diffuse.value.copy(a.color),T.opacity.value=a.opacity,T.size.value=a.size*m,T.scale.value=u*.5,a.map&&(T.map.value=a.map,P(a.map,T.uvTransform)),a.alphaMap&&(T.alphaMap.value=a.alphaMap,P(a.alphaMap,T.alphaMapTransform)),a.alphaTest>0&&(T.alphaTest.value=a.alphaTest)}function r(T,a){T.diffuse.value.copy(a.color),T.opacity.value=a.opacity,T.rotation.value=a.rotation,a.map&&(T.map.value=a.map,P(a.map,T.mapTransform)),a.alphaMap&&(T.alphaMap.value=a.alphaMap,P(a.alphaMap,T.alphaMapTransform)),a.alphaTest>0&&(T.alphaTest.value=a.alphaTest)}function D(T,a){T.specular.value.copy(a.specular),T.shininess.value=Math.max(a.shininess,1e-4)}function z(T,a){a.gradientMap&&(T.gradientMap.value=a.gradientMap)}function c(T,a){T.metalness.value=a.metalness,a.metalnessMap&&(T.metalnessMap.value=a.metalnessMap,P(a.metalnessMap,T.metalnessMapTransform)),T.roughness.value=a.roughness,a.roughnessMap&&(T.roughnessMap.value=a.roughnessMap,P(a.roughnessMap,T.roughnessMapTransform)),a.envMap&&(T.envMapIntensity.value=a.envMapIntensity)}function g(T,a,m){T.ior.value=a.ior,a.sheen>0&&(T.sheenColor.value.copy(a.sheenColor).multiplyScalar(a.sheen),T.sheenRoughness.value=a.sheenRoughness,a.sheenColorMap&&(T.sheenColorMap.value=a.sheenColorMap,P(a.sheenColorMap,T.sheenColorMapTransform)),a.sheenRoughnessMap&&(T.sheenRoughnessMap.value=a.sheenRoughnessMap,P(a.sheenRoughnessMap,T.sheenRoughnessMapTransform))),a.clearcoat>0&&(T.clearcoat.value=a.clearcoat,T.clearcoatRoughness.value=a.clearcoatRoughness,a.clearcoatMap&&(T.clearcoatMap.value=a.clearcoatMap,P(a.clearcoatMap,T.clearcoatMapTransform)),a.clearcoatRoughnessMap&&(T.clearcoatRoughnessMap.value=a.clearcoatRoughnessMap,P(a.clearcoatRoughnessMap,T.clearcoatRoughnessMapTransform)),a.clearcoatNormalMap&&(T.clearcoatNormalMap.value=a.clearcoatNormalMap,P(a.clearcoatNormalMap,T.clearcoatNormalMapTransform),T.clearcoatNormalScale.value.copy(a.clearcoatNormalScale),a.side===HP&&T.clearcoatNormalScale.value.negate())),a.dispersion>0&&(T.dispersion.value=a.dispersion),a.iridescence>0&&(T.iridescence.value=a.iridescence,T.iridescenceIOR.value=a.iridescenceIOR,T.iridescenceThicknessMinimum.value=a.iridescenceThicknessRange[0],T.iridescenceThicknessMaximum.value=a.iridescenceThicknessRange[1],a.iridescenceMap&&(T.iridescenceMap.value=a.iridescenceMap,P(a.iridescenceMap,T.iridescenceMapTransform)),a.iridescenceThicknessMap&&(T.iridescenceThicknessMap.value=a.iridescenceThicknessMap,P(a.iridescenceThicknessMap,T.iridescenceThicknessMapTransform))),a.transmission>0&&(T.transmission.value=a.transmission,T.transmissionSamplerMap.value=m.texture,T.transmissionSamplerSize.value.set(m.width,m.height),a.transmissionMap&&(T.transmissionMap.value=a.transmissionMap,P(a.transmissionMap,T.transmissionMapTransform)),T.thickness.value=a.thickness,a.thicknessMap&&(T.thicknessMap.value=a.thicknessMap,P(a.thicknessMap,T.thicknessMapTransform)),T.attenuationDistance.value=a.attenuationDistance,T.attenuationColor.value.copy(a.attenuationColor)),a.anisotropy>0&&(T.anisotropyVector.value.set(a.anisotropy*Math.cos(a.anisotropyRotation),a.anisotropy*Math.sin(a.anisotropyRotation)),a.anisotropyMap&&(T.anisotropyMap.value=a.anisotropyMap,P(a.anisotropyMap,T.anisotropyMapTransform))),T.specularIntensity.value=a.specularIntensity,T.specularColor.value.copy(a.specularColor),a.specularColorMap&&(T.specularColorMap.value=a.specularColorMap,P(a.specularColorMap,T.specularColorMapTransform)),a.specularIntensityMap&&(T.specularIntensityMap.value=a.specularIntensityMap,P(a.specularIntensityMap,T.specularIntensityMapTransform))}function B(T,a){a.matcap&&(T.matcap.value=a.matcap)}function f(T,a){let m=A.get(a).light;T.referencePosition.value.setFromMatrixPosition(m.matrixWorld),T.nearDistance.value=m.shadow.camera.near,T.farDistance.value=m.shadow.camera.far}return{refreshFogUniforms:e,refreshMaterialUniforms:t}}function gB(n,A,P,e){let t={},s={},i=[],v=n.getParameter(n.MAX_UNIFORM_BUFFER_BINDINGS);function o(m,u){let j=u.program;e.uniformBlockBinding(m,j)}function r(m,u){let j=t[m.id];j===void 0&&(B(m),j=D(m),t[m.id]=j,m.addEventListener("dispose",T));let d=u.program;e.updateUBOMapping(m,d);let Q=A.render.frame;s[m.id]!==Q&&(c(m),s[m.id]=Q)}function D(m){let u=z();m.__bindingPointIndex=u;let j=n.createBuffer(),d=m.__size,Q=m.usage;return n.bindBuffer(n.UNIFORM_BUFFER,j),n.bufferData(n.UNIFORM_BUFFER,d,Q),n.bindBuffer(n.UNIFORM_BUFFER,null),n.bindBufferBase(n.UNIFORM_BUFFER,u,j),j}function z(){for(let m=0;m<v;m++)if(i.indexOf(m)===-1)return i.push(m),m;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function c(m){let u=t[m.id],j=m.uniforms,d=m.__cache;n.bindBuffer(n.UNIFORM_BUFFER,u);for(let Q=0,Y=j.length;Q<Y;Q++){let x=Array.isArray(j[Q])?j[Q]:[j[Q]];for(let h=0,l=x.length;h<l;h++){let p=x[h];if(g(p,Q,h,d)===!0){let k=p.__offset,F=Array.isArray(p.value)?p.value:[p.value],Z=0;for(let S=0;S<F.length;S++){let R=F[S],PA=f(R);typeof R=="number"||typeof R=="boolean"?(p.__data[0]=R,n.bufferSubData(n.UNIFORM_BUFFER,k+Z,p.__data)):R.isMatrix3?(p.__data[0]=R.elements[0],p.__data[1]=R.elements[1],p.__data[2]=R.elements[2],p.__data[3]=0,p.__data[4]=R.elements[3],p.__data[5]=R.elements[4],p.__data[6]=R.elements[5],p.__data[7]=0,p.__data[8]=R.elements[6],p.__data[9]=R.elements[7],p.__data[10]=R.elements[8],p.__data[11]=0):(R.toArray(p.__data,Z),Z+=PA.storage/Float32Array.BYTES_PER_ELEMENT)}n.bufferSubData(n.UNIFORM_BUFFER,k,p.__data)}}}n.bindBuffer(n.UNIFORM_BUFFER,null)}function g(m,u,j,d){let Q=m.value,Y=u+"_"+j;if(d[Y]===void 0)return typeof Q=="number"||typeof Q=="boolean"?d[Y]=Q:d[Y]=Q.clone(),!0;{let x=d[Y];if(typeof Q=="number"||typeof Q=="boolean"){if(x!==Q)return d[Y]=Q,!0}else if(x.equals(Q)===!1)return x.copy(Q),!0}return!1}function B(m){let u=m.uniforms,j=0,d=16;for(let Y=0,x=u.length;Y<x;Y++){let h=Array.isArray(u[Y])?u[Y]:[u[Y]];for(let l=0,p=h.length;l<p;l++){let k=h[l],F=Array.isArray(k.value)?k.value:[k.value];for(let Z=0,S=F.length;Z<S;Z++){let R=F[Z],PA=f(R),N=j%d,sA=N%PA.boundary,oA=N+sA;j+=sA,oA!==0&&d-oA<PA.storage&&(j+=d-oA),k.__data=new Float32Array(PA.storage/Float32Array.BYTES_PER_ELEMENT),k.__offset=j,j+=PA.storage}}}let Q=j%d;return Q>0&&(j+=d-Q),m.__size=j,m.__cache={},this}function f(m){let u={boundary:0,storage:0};return typeof m=="number"||typeof m=="boolean"?(u.boundary=4,u.storage=4):m.isVector2?(u.boundary=8,u.storage=8):m.isVector3||m.isColor?(u.boundary=16,u.storage=12):m.isVector4?(u.boundary=16,u.storage=16):m.isMatrix3?(u.boundary=48,u.storage=48):m.isMatrix4?(u.boundary=64,u.storage=64):m.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",m),u}function T(m){let u=m.target;u.removeEventListener("dispose",T);let j=i.indexOf(u.__bindingPointIndex);i.splice(j,1),n.deleteBuffer(t[u.id]),delete t[u.id],delete s[u.id]}function a(){for(let m in t)n.deleteBuffer(t[m]);i=[],t={},s={}}return{bind:o,update:r,dispose:a}}var Iv=class{constructor(A={}){let{canvas:P=L9(),context:e=null,depth:t=!0,stencil:s=!1,alpha:i=!1,antialias:v=!1,premultipliedAlpha:o=!0,preserveDrawingBuffer:r=!1,powerPreference:D="default",failIfMajorPerformanceCaveat:z=!1,reversedDepthBuffer:c=!1}=A;this.isWebGLRenderer=!0;let g;if(e!==null){if(typeof WebGLRenderingContext<"u"&&e instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=e.getContextAttributes().alpha}else g=i;let B=new Uint32Array(4),f=new Int32Array(4),T=null,a=null,m=[],u=[];this.domElement=P,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=Ue,this.toneMappingExposure=1,this.transmissionResolutionScale=1;let j=this,d=!1;this._outputColorSpace=cP;let Q=0,Y=0,x=null,h=-1,l=null,p=new SA,k=new SA,F=null,Z=new mA(0),S=0,R=P.width,PA=P.height,N=1,sA=null,oA=null,hA=new SA(0,0,R,PA),CA=new SA(0,0,R,PA),AP=!1,sP=new wn,UA=!1,U=!1,q=new yA,cA=new y,xA=new SA,lA={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0},RA=!1;function dP(){return x===null?N:1}let b=e;function iP(E,L){return P.getContext(E,L)}try{let E={alpha:!0,depth:t,stencil:s,antialias:v,premultipliedAlpha:o,preserveDrawingBuffer:r,powerPreference:D,failIfMajorPerformanceCaveat:z};if("setAttribute"in P&&P.setAttribute("data-engine",`three.js r${"180"}`),P.addEventListener("webglcontextlost",tA,!1),P.addEventListener("webglcontextrestored",zA,!1),P.addEventListener("webglcontextcreationerror",K,!1),b===null){let L="webgl2";if(b=iP(L,E),b===null)throw iP(L)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(E){throw console.error("THREE.WebGLRenderer: "+E.message),E}let LA,YA,TA,vP,BA,HA,hP,gP,M,w,H,W,V,X,EA,eA,fA,wA,$,rA,dA,jA,iA,kA;function O(){LA=new xg(b),LA.init(),jA=new oB(b,LA),YA=new Mg(b,LA,A,jA),TA=new vB(b,LA),YA.reversedDepthBuffer&&c&&TA.buffers.depth.setReversed(!0),vP=new Ig(b),BA=new JT,HA=new rB(b,LA,TA,BA,YA,jA,vP),hP=new dg(j),gP=new yg(j),M=new Nz(b),iA=new ug(b,M),w=new Og(b,M,vP,iA),H=new Hg(b,w,M,vP),$=new kg(b,YA,HA),eA=new Qg(BA),W=new UT(j,hP,gP,LA,YA,iA,eA),V=new aB(j,BA),X=new qT,EA=new eB(LA),wA=new hg(j,hP,gP,TA,H,g,o),fA=new sB(j,H,YA),kA=new gB(b,vP,YA,TA),rA=new mg(b,LA,vP),dA=new Lg(b,LA,vP),vP.programs=W.programs,j.capabilities=YA,j.extensions=LA,j.properties=BA,j.renderLists=X,j.shadowMap=fA,j.state=TA,j.info=vP}O();let AA=new To(j,b);this.xr=AA,this.getContext=function(){return b},this.getContextAttributes=function(){return b.getContextAttributes()},this.forceContextLoss=function(){let E=LA.get("WEBGL_lose_context");E&&E.loseContext()},this.forceContextRestore=function(){let E=LA.get("WEBGL_lose_context");E&&E.restoreContext()},this.getPixelRatio=function(){return N},this.setPixelRatio=function(E){E!==void 0&&(N=E,this.setSize(R,PA,!1))},this.getSize=function(E){return E.set(R,PA)},this.setSize=function(E,L,G=!0){if(AA.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}R=E,PA=L,P.width=Math.floor(E*N),P.height=Math.floor(L*N),G===!0&&(P.style.width=E+"px",P.style.height=L+"px"),this.setViewport(0,0,E,L)},this.getDrawingBufferSize=function(E){return E.set(R*N,PA*N).floor()},this.setDrawingBufferSize=function(E,L,G){R=E,PA=L,N=G,P.width=Math.floor(E*G),P.height=Math.floor(L*G),this.setViewport(0,0,E,L)},this.getCurrentViewport=function(E){return E.copy(p)},this.getViewport=function(E){return E.copy(hA)},this.setViewport=function(E,L,G,C){E.isVector4?hA.set(E.x,E.y,E.z,E.w):hA.set(E,L,G,C),TA.viewport(p.copy(hA).multiplyScalar(N).round())},this.getScissor=function(E){return E.copy(CA)},this.setScissor=function(E,L,G,C){E.isVector4?CA.set(E.x,E.y,E.z,E.w):CA.set(E,L,G,C),TA.scissor(k.copy(CA).multiplyScalar(N).round())},this.getScissorTest=function(){return AP},this.setScissorTest=function(E){TA.setScissorTest(AP=E)},this.setOpaqueSort=function(E){sA=E},this.setTransparentSort=function(E){oA=E},this.getClearColor=function(E){return E.copy(wA.getClearColor())},this.setClearColor=function(){wA.setClearColor(...arguments)},this.getClearAlpha=function(){return wA.getClearAlpha()},this.setClearAlpha=function(){wA.setClearAlpha(...arguments)},this.clear=function(E=!0,L=!0,G=!0){let C=0;if(E){let I=!1;if(x!==null){let _=x.texture.format;I=_===ev||_===Pv||_===Av}if(I){let _=x.texture.type,vA=_===ce||_===rt||_===Mn||_===dn||_===Ki||_===_i,aA=wA.getClearColor(),DA=wA.getClearAlpha(),QA=aA.r,pA=aA.g,uA=aA.b;vA?(B[0]=QA,B[1]=pA,B[2]=uA,B[3]=DA,b.clearBufferuiv(b.COLOR,0,B)):(f[0]=QA,f[1]=pA,f[2]=uA,f[3]=DA,b.clearBufferiv(b.COLOR,0,f))}else C|=b.COLOR_BUFFER_BIT}L&&(C|=b.DEPTH_BUFFER_BIT),G&&(C|=b.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),b.clear(C)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){P.removeEventListener("webglcontextlost",tA,!1),P.removeEventListener("webglcontextrestored",zA,!1),P.removeEventListener("webglcontextcreationerror",K,!1),wA.dispose(),X.dispose(),EA.dispose(),BA.dispose(),hP.dispose(),gP.dispose(),H.dispose(),iA.dispose(),kA.dispose(),W.dispose(),AA.dispose(),AA.removeEventListener("sessionstart",ge),AA.removeEventListener("sessionend",nD),at.stop()};function tA(E){E.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),d=!0}function zA(){console.log("THREE.WebGLRenderer: Context Restored."),d=!1;let E=vP.autoReset,L=fA.enabled,G=fA.autoUpdate,C=fA.needsUpdate,I=fA.type;O(),vP.autoReset=E,fA.enabled=L,fA.autoUpdate=G,fA.needsUpdate=C,fA.type=I}function K(E){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",E.statusMessage)}function J(E){let L=E.target;L.removeEventListener("dispose",J),gA(L)}function gA(E){OA(E),BA.remove(E)}function OA(E){let L=BA.get(E).programs;L!==void 0&&(L.forEach(function(G){W.releaseProgram(G)}),E.isShaderMaterial&&W.releaseShaderCache(E))}this.renderBufferDirect=function(E,L,G,C,I,_){L===null&&(L=lA);let vA=I.isMesh&&I.matrixWorld.determinant()<0,aA=I8(E,L,G,C,I);TA.setMaterial(C,vA);let DA=G.index,QA=1;if(C.wireframe===!0){if(DA=w.getWireframeAttribute(G),DA===void 0)return;QA=2}let pA=G.drawRange,uA=G.attributes.position,XA=pA.start*QA,KA=(pA.start+pA.count)*QA;_!==null&&(XA=Math.max(XA,_.start*QA),KA=Math.min(KA,(_.start+_.count)*QA)),DA!==null?(XA=Math.max(XA,0),KA=Math.min(KA,DA.count)):uA!=null&&(XA=Math.max(XA,0),KA=Math.min(KA,uA.count));let zP=KA-XA;if(zP<0||zP===1/0)return;iA.setup(I,C,aA,G,DA);let tP,_A=rA;if(DA!==null&&(tP=M.get(DA),_A=dA,_A.setIndex(tP)),I.isMesh)C.wireframe===!0?(TA.setLineWidth(C.wireframeLinewidth*dP()),_A.setMode(b.LINES)):_A.setMode(b.TRIANGLES);else if(I.isLine){let MA=C.linewidth;MA===void 0&&(MA=1),TA.setLineWidth(MA*dP()),I.isLineSegments?_A.setMode(b.LINES):I.isLineLoop?_A.setMode(b.LINE_LOOP):_A.setMode(b.LINE_STRIP)}else I.isPoints?_A.setMode(b.POINTS):I.isSprite&&_A.setMode(b.TRIANGLES);if(I.isBatchedMesh)if(I._multiDrawInstances!==null)cn("THREE.WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),_A.renderMultiDrawInstances(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount,I._multiDrawInstances);else if(LA.get("WEBGL_multi_draw"))_A.renderMultiDraw(I._multiDrawStarts,I._multiDrawCounts,I._multiDrawCount);else{let MA=I._multiDrawStarts,rP=I._multiDrawCounts,WA=I._multiDrawCount,RP=DA?M.get(DA).bytesPerElement:1,Xt=BA.get(C).currentProgram.getUniforms();for(let WP=0;WP<WA;WP++)Xt.setValue(b,"_gl_DrawID",WP),_A.render(MA[WP]/RP,rP[WP])}else if(I.isInstancedMesh)_A.renderInstances(XA,zP,I.count);else if(G.isInstancedBufferGeometry){let MA=G._maxInstanceCount!==void 0?G._maxInstanceCount:1/0,rP=Math.min(G.instanceCount,MA);_A.renderInstances(XA,zP,rP)}else _A.render(XA,zP)};function PP(E,L,G){E.transparent===!0&&E.side===ZP&&E.forceSinglePass===!1?(E.side=HP,E.needsUpdate=!0,Zs(E,L,G),E.side=re,E.needsUpdate=!0,Zs(E,L,G),E.side=ZP):Zs(E,L,G)}this.compile=function(E,L,G=null){G===null&&(G=E),a=EA.get(G),a.init(L),u.push(a),G.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(a.pushLight(I),I.castShadow&&a.pushShadow(I))}),E!==G&&E.traverseVisible(function(I){I.isLight&&I.layers.test(L.layers)&&(a.pushLight(I),I.castShadow&&a.pushShadow(I))}),a.setupLights();let C=new Set;return E.traverse(function(I){if(!(I.isMesh||I.isPoints||I.isLine||I.isSprite))return;let _=I.material;if(_)if(Array.isArray(_))for(let vA=0;vA<_.length;vA++){let aA=_[vA];PP(aA,G,I),C.add(aA)}else PP(_,G,I),C.add(_)}),a=u.pop(),C},this.compileAsync=function(E,L,G=null){let C=this.compile(E,L,G);return new Promise(I=>{function _(){if(C.forEach(function(vA){BA.get(vA).currentProgram.isReady()&&C.delete(vA)}),C.size===0){I(E);return}setTimeout(_,10)}LA.get("KHR_parallel_shader_compile")!==null?_():setTimeout(_,10)})};let JA=null;function xe(E){JA&&JA(E)}function ge(){at.stop()}function nD(){at.start()}let at=new D8;at.setAnimationLoop(xe),typeof self<"u"&&at.setContext(self),this.setAnimationLoop=function(E){JA=E,AA.setAnimationLoop(E),E===null?at.stop():at.start()},AA.addEventListener("sessionstart",ge),AA.addEventListener("sessionend",nD),this.render=function(E,L){if(L!==void 0&&L.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(d===!0)return;if(E.matrixWorldAutoUpdate===!0&&E.updateMatrixWorld(),L.parent===null&&L.matrixWorldAutoUpdate===!0&&L.updateMatrixWorld(),AA.enabled===!0&&AA.isPresenting===!0&&(AA.cameraAutoUpdate===!0&&AA.updateCamera(L),L=AA.getCamera()),E.isScene===!0&&E.onBeforeRender(j,E,L,x),a=EA.get(E,u.length),a.init(L),u.push(a),q.multiplyMatrices(L.projectionMatrix,L.matrixWorldInverse),sP.setFromProjectionMatrix(q,ie,L.reversedDepth),U=this.localClippingEnabled,UA=eA.init(this.clippingPlanes,U),T=X.get(E,m.length),T.init(),m.push(T),AA.enabled===!0&&AA.isPresenting===!0){let _=j.xr.getDepthSensingMesh();_!==null&&Wv(_,L,-1/0,j.sortObjects)}Wv(E,L,0,j.sortObjects),T.finish(),j.sortObjects===!0&&T.sort(sA,oA),RA=AA.enabled===!1||AA.isPresenting===!1||AA.hasDepthSensing()===!1,RA&&wA.addToRenderList(T,E),this.info.render.frame++,UA===!0&&eA.beginShadows();let G=a.state.shadowsArray;fA.render(G,E,L),UA===!0&&eA.endShadows(),this.info.autoReset===!0&&this.info.reset();let C=T.opaque,I=T.transmissive;if(a.setupLights(),L.isArrayCamera){let _=L.cameras;if(I.length>0)for(let vA=0,aA=_.length;vA<aA;vA++){let DA=_[vA];iD(C,I,E,DA)}RA&&wA.render(E);for(let vA=0,aA=_.length;vA<aA;vA++){let DA=_[vA];sD(T,E,DA,DA.viewport)}}else I.length>0&&iD(C,I,E,L),RA&&wA.render(E),sD(T,E,L);x!==null&&Y===0&&(HA.updateMultisampleRenderTarget(x),HA.updateRenderTargetMipmap(x)),E.isScene===!0&&E.onAfterRender(j,E,L),iA.resetDefaultState(),h=-1,l=null,u.pop(),u.length>0?(a=u[u.length-1],UA===!0&&eA.setGlobalState(j.clippingPlanes,a.state.camera)):a=null,m.pop(),m.length>0?T=m[m.length-1]:T=null};function Wv(E,L,G,C){if(E.visible===!1)return;if(E.layers.test(L.layers)){if(E.isGroup)G=E.renderOrder;else if(E.isLOD)E.autoUpdate===!0&&E.update(L);else if(E.isLight)a.pushLight(E),E.castShadow&&a.pushShadow(E);else if(E.isSprite){if(!E.frustumCulled||sP.intersectsSprite(E)){C&&xA.setFromMatrixPosition(E.matrixWorld).applyMatrix4(q);let vA=H.update(E),aA=E.material;aA.visible&&T.push(E,vA,aA,G,xA.z,null)}}else if((E.isMesh||E.isLine||E.isPoints)&&(!E.frustumCulled||sP.intersectsObject(E))){let vA=H.update(E),aA=E.material;if(C&&(E.boundingSphere!==void 0?(E.boundingSphere===null&&E.computeBoundingSphere(),xA.copy(E.boundingSphere.center)):(vA.boundingSphere===null&&vA.computeBoundingSphere(),xA.copy(vA.boundingSphere.center)),xA.applyMatrix4(E.matrixWorld).applyMatrix4(q)),Array.isArray(aA)){let DA=vA.groups;for(let QA=0,pA=DA.length;QA<pA;QA++){let uA=DA[QA],XA=aA[uA.materialIndex];XA&&XA.visible&&T.push(E,vA,XA,G,xA.z,uA)}}else aA.visible&&T.push(E,vA,aA,G,xA.z,null)}}let _=E.children;for(let vA=0,aA=_.length;vA<aA;vA++)Wv(_[vA],L,G,C)}function sD(E,L,G,C){let I=E.opaque,_=E.transmissive,vA=E.transparent;a.setupLightsView(G),UA===!0&&eA.setGlobalState(j.clippingPlanes,G),C&&TA.viewport(p.copy(C)),I.length>0&&Xs(I,L,G),_.length>0&&Xs(_,L,G),vA.length>0&&Xs(vA,L,G),TA.buffers.depth.setTest(!0),TA.buffers.depth.setMask(!0),TA.buffers.color.setMask(!0),TA.setPolygonOffset(!1)}function iD(E,L,G,C){if((G.isScene===!0?G.overrideMaterial:null)!==null)return;a.state.transmissionRenderTarget[C.id]===void 0&&(a.state.transmissionRenderTarget[C.id]=new we(1,1,{generateMipmaps:!0,type:LA.has("EXT_color_buffer_half_float")||LA.has("EXT_color_buffer_float")?Qn:ce,minFilter:ze,samples:4,stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:ZA.workingColorSpace}));let _=a.state.transmissionRenderTarget[C.id],vA=C.viewport||p;_.setSize(vA.z*j.transmissionResolutionScale,vA.w*j.transmissionResolutionScale);let aA=j.getRenderTarget(),DA=j.getActiveCubeFace(),QA=j.getActiveMipmapLevel();j.setRenderTarget(_),j.getClearColor(Z),S=j.getClearAlpha(),S<1&&j.setClearColor(16777215,.5),j.clear(),RA&&wA.render(G);let pA=j.toneMapping;j.toneMapping=Ue;let uA=C.viewport;if(C.viewport!==void 0&&(C.viewport=void 0),a.setupLightsView(C),UA===!0&&eA.setGlobalState(j.clippingPlanes,C),Xs(E,G,C),HA.updateMultisampleRenderTarget(_),HA.updateRenderTargetMipmap(_),LA.has("WEBGL_multisampled_render_to_texture")===!1){let XA=!1;for(let KA=0,zP=L.length;KA<zP;KA++){let tP=L[KA],_A=tP.object,MA=tP.geometry,rP=tP.material,WA=tP.group;if(rP.side===ZP&&_A.layers.test(C.layers)){let RP=rP.side;rP.side=HP,rP.needsUpdate=!0,vD(_A,G,C,MA,rP,WA),rP.side=RP,rP.needsUpdate=!0,XA=!0}}XA===!0&&(HA.updateMultisampleRenderTarget(_),HA.updateRenderTargetMipmap(_))}j.setRenderTarget(aA,DA,QA),j.setClearColor(Z,S),uA!==void 0&&(C.viewport=uA),j.toneMapping=pA}function Xs(E,L,G){let C=L.isScene===!0?L.overrideMaterial:null;for(let I=0,_=E.length;I<_;I++){let vA=E[I],aA=vA.object,DA=vA.geometry,QA=vA.group,pA=vA.material;pA.allowOverride===!0&&C!==null&&(pA=C),aA.layers.test(G.layers)&&vD(aA,L,G,DA,pA,QA)}}function vD(E,L,G,C,I,_){E.onBeforeRender(j,L,G,C,I,_),E.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse,E.matrixWorld),E.normalMatrix.getNormalMatrix(E.modelViewMatrix),I.onBeforeRender(j,L,G,C,E,_),I.transparent===!0&&I.side===ZP&&I.forceSinglePass===!1?(I.side=HP,I.needsUpdate=!0,j.renderBufferDirect(G,L,C,I,E,_),I.side=re,I.needsUpdate=!0,j.renderBufferDirect(G,L,C,I,E,_),I.side=ZP):j.renderBufferDirect(G,L,C,I,E,_),E.onAfterRender(j,L,G,C,I,_)}function Zs(E,L,G){L.isScene!==!0&&(L=lA);let C=BA.get(E),I=a.state.lights,_=a.state.shadowsArray,vA=I.state.version,aA=W.getParameters(E,I.state,_,L,G),DA=W.getProgramCacheKey(aA),QA=C.programs;C.environment=E.isMeshStandardMaterial?L.environment:null,C.fog=L.fog,C.envMap=(E.isMeshStandardMaterial?gP:hP).get(E.envMap||C.environment),C.envMapRotation=C.environment!==null&&E.envMap===null?L.environmentRotation:E.envMapRotation,QA===void 0&&(E.addEventListener("dispose",J),QA=new Map,C.programs=QA);let pA=QA.get(DA);if(pA!==void 0){if(C.currentProgram===pA&&C.lightsStateVersion===vA)return oD(E,aA),pA}else aA.uniforms=W.getUniforms(E),E.onBeforeCompile(aA,j),pA=W.acquireProgram(aA,DA),QA.set(DA,pA),C.uniforms=aA.uniforms;let uA=C.uniforms;return(!E.isShaderMaterial&&!E.isRawShaderMaterial||E.clipping===!0)&&(uA.clippingPlanes=eA.uniform),oD(E,aA),C.needsLights=H8(E),C.lightsStateVersion=vA,C.needsLights&&(uA.ambientLightColor.value=I.state.ambient,uA.lightProbe.value=I.state.probe,uA.directionalLights.value=I.state.directional,uA.directionalLightShadows.value=I.state.directionalShadow,uA.spotLights.value=I.state.spot,uA.spotLightShadows.value=I.state.spotShadow,uA.rectAreaLights.value=I.state.rectArea,uA.ltc_1.value=I.state.rectAreaLTC1,uA.ltc_2.value=I.state.rectAreaLTC2,uA.pointLights.value=I.state.point,uA.pointLightShadows.value=I.state.pointShadow,uA.hemisphereLights.value=I.state.hemi,uA.directionalShadowMap.value=I.state.directionalShadowMap,uA.directionalShadowMatrix.value=I.state.directionalShadowMatrix,uA.spotShadowMap.value=I.state.spotShadowMap,uA.spotLightMatrix.value=I.state.spotLightMatrix,uA.spotLightMap.value=I.state.spotLightMap,uA.pointShadowMap.value=I.state.pointShadowMap,uA.pointShadowMatrix.value=I.state.pointShadowMatrix),C.currentProgram=pA,C.uniformsList=null,pA}function rD(E){if(E.uniformsList===null){let L=E.currentProgram.getUniforms();E.uniformsList=xn.seqWithValue(L.seq,E.uniforms)}return E.uniformsList}function oD(E,L){let G=BA.get(E);G.outputColorSpace=L.outputColorSpace,G.batching=L.batching,G.batchingColor=L.batchingColor,G.instancing=L.instancing,G.instancingColor=L.instancingColor,G.instancingMorph=L.instancingMorph,G.skinning=L.skinning,G.morphTargets=L.morphTargets,G.morphNormals=L.morphNormals,G.morphColors=L.morphColors,G.morphTargetsCount=L.morphTargetsCount,G.numClippingPlanes=L.numClippingPlanes,G.numIntersection=L.numClipIntersection,G.vertexAlphas=L.vertexAlphas,G.vertexTangents=L.vertexTangents,G.toneMapping=L.toneMapping}function I8(E,L,G,C,I){L.isScene!==!0&&(L=lA),HA.resetTextureUnits();let _=L.fog,vA=C.isMeshStandardMaterial?L.environment:null,aA=x===null?j.outputColorSpace:x.isXRRenderTarget===!0?x.texture.colorSpace:QP,DA=(C.isMeshStandardMaterial?gP:hP).get(C.envMap||vA),QA=C.vertexColors===!0&&!!G.attributes.color&&G.attributes.color.itemSize===4,pA=!!G.attributes.tangent&&(!!C.normalMap||C.anisotropy>0),uA=!!G.morphAttributes.position,XA=!!G.morphAttributes.normal,KA=!!G.morphAttributes.color,zP=Ue;C.toneMapped&&(x===null||x.isXRRenderTarget===!0)&&(zP=j.toneMapping);let tP=G.morphAttributes.position||G.morphAttributes.normal||G.morphAttributes.color,_A=tP!==void 0?tP.length:0,MA=BA.get(C),rP=a.state.lights;if(UA===!0&&(U===!0||E!==l)){let OP=E===l&&C.id===h;eA.setState(C,E,OP)}let WA=!1;C.version===MA.__version?(MA.needsLights&&MA.lightsStateVersion!==rP.state.version||MA.outputColorSpace!==aA||I.isBatchedMesh&&MA.batching===!1||!I.isBatchedMesh&&MA.batching===!0||I.isBatchedMesh&&MA.batchingColor===!0&&I.colorTexture===null||I.isBatchedMesh&&MA.batchingColor===!1&&I.colorTexture!==null||I.isInstancedMesh&&MA.instancing===!1||!I.isInstancedMesh&&MA.instancing===!0||I.isSkinnedMesh&&MA.skinning===!1||!I.isSkinnedMesh&&MA.skinning===!0||I.isInstancedMesh&&MA.instancingColor===!0&&I.instanceColor===null||I.isInstancedMesh&&MA.instancingColor===!1&&I.instanceColor!==null||I.isInstancedMesh&&MA.instancingMorph===!0&&I.morphTexture===null||I.isInstancedMesh&&MA.instancingMorph===!1&&I.morphTexture!==null||MA.envMap!==DA||C.fog===!0&&MA.fog!==_||MA.numClippingPlanes!==void 0&&(MA.numClippingPlanes!==eA.numPlanes||MA.numIntersection!==eA.numIntersection)||MA.vertexAlphas!==QA||MA.vertexTangents!==pA||MA.morphTargets!==uA||MA.morphNormals!==XA||MA.morphColors!==KA||MA.toneMapping!==zP||MA.morphTargetsCount!==_A)&&(WA=!0):(WA=!0,MA.__version=C.version);let RP=MA.currentProgram;WA===!0&&(RP=Zs(C,L,I));let Xt=!1,WP=!1,Fn=!1,oP=RP.getUniforms(),KP=MA.uniforms;if(TA.useProgram(RP.program)&&(Xt=!0,WP=!0,Fn=!0),C.id!==h&&(h=C.id,WP=!0),Xt||l!==E){TA.buffers.depth.getReversed()&&E.reversedDepth!==!0&&(E._reversedDepth=!0,E.updateProjectionMatrix()),oP.setValue(b,"projectionMatrix",E.projectionMatrix),oP.setValue(b,"viewMatrix",E.matrixWorldInverse);let GP=oP.map.cameraPosition;GP!==void 0&&GP.setValue(b,cA.setFromMatrixPosition(E.matrixWorld)),YA.logarithmicDepthBuffer&&oP.setValue(b,"logDepthBufFC",2/(Math.log(E.far+1)/Math.LN2)),(C.isMeshPhongMaterial||C.isMeshToonMaterial||C.isMeshLambertMaterial||C.isMeshBasicMaterial||C.isMeshStandardMaterial||C.isShaderMaterial)&&oP.setValue(b,"isOrthographic",E.isOrthographicCamera===!0),l!==E&&(l=E,WP=!0,Fn=!0)}if(I.isSkinnedMesh){oP.setOptional(b,I,"bindMatrix"),oP.setOptional(b,I,"bindMatrixInverse");let OP=I.skeleton;OP&&(OP.boneTexture===null&&OP.computeBoneTexture(),oP.setValue(b,"boneTexture",OP.boneTexture,HA))}I.isBatchedMesh&&(oP.setOptional(b,I,"batchingTexture"),oP.setValue(b,"batchingTexture",I._matricesTexture,HA),oP.setOptional(b,I,"batchingIdTexture"),oP.setValue(b,"batchingIdTexture",I._indirectTexture,HA),oP.setOptional(b,I,"batchingColorTexture"),I._colorsTexture!==null&&oP.setValue(b,"batchingColorTexture",I._colorsTexture,HA));let _P=G.morphAttributes;if((_P.position!==void 0||_P.normal!==void 0||_P.color!==void 0)&&$.update(I,G,RP),(WP||MA.receiveShadow!==I.receiveShadow)&&(MA.receiveShadow=I.receiveShadow,oP.setValue(b,"receiveShadow",I.receiveShadow)),C.isMeshGouraudMaterial&&C.envMap!==null&&(KP.envMap.value=DA,KP.flipEnvMap.value=DA.isCubeTexture&&DA.isRenderTargetTexture===!1?-1:1),C.isMeshStandardMaterial&&C.envMap===null&&L.environment!==null&&(KP.envMapIntensity.value=L.environmentIntensity),WP&&(oP.setValue(b,"toneMappingExposure",j.toneMappingExposure),MA.needsLights&&k8(KP,Fn),_&&C.fog===!0&&V.refreshFogUniforms(KP,_),V.refreshMaterialUniforms(KP,C,N,PA,a.state.transmissionRenderTarget[E.id]),xn.upload(b,rD(MA),KP,HA)),C.isShaderMaterial&&C.uniformsNeedUpdate===!0&&(xn.upload(b,rD(MA),KP,HA),C.uniformsNeedUpdate=!1),C.isSpriteMaterial&&oP.setValue(b,"center",I.center),oP.setValue(b,"modelViewMatrix",I.modelViewMatrix),oP.setValue(b,"normalMatrix",I.normalMatrix),oP.setValue(b,"modelMatrix",I.matrixWorld),C.isShaderMaterial||C.isRawShaderMaterial){let OP=C.uniformsGroups;for(let GP=0,Sv=OP.length;GP<Sv;GP++){let gt=OP[GP];kA.update(gt,RP),kA.bind(gt,RP)}}return RP}function k8(E,L){E.ambientLightColor.needsUpdate=L,E.lightProbe.needsUpdate=L,E.directionalLights.needsUpdate=L,E.directionalLightShadows.needsUpdate=L,E.pointLights.needsUpdate=L,E.pointLightShadows.needsUpdate=L,E.spotLights.needsUpdate=L,E.spotLightShadows.needsUpdate=L,E.rectAreaLights.needsUpdate=L,E.hemisphereLights.needsUpdate=L}function H8(E){return E.isMeshLambertMaterial||E.isMeshToonMaterial||E.isMeshPhongMaterial||E.isMeshStandardMaterial||E.isShadowMaterial||E.isShaderMaterial&&E.lights===!0}this.getActiveCubeFace=function(){return Q},this.getActiveMipmapLevel=function(){return Y},this.getRenderTarget=function(){return x},this.setRenderTargetTextures=function(E,L,G){let C=BA.get(E);C.__autoAllocateDepthBuffer=E.resolveDepthBuffer===!1,C.__autoAllocateDepthBuffer===!1&&(C.__useRenderToTexture=!1),BA.get(E.texture).__webglTexture=L,BA.get(E.depthTexture).__webglTexture=C.__autoAllocateDepthBuffer?void 0:G,C.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(E,L){let G=BA.get(E);G.__webglFramebuffer=L,G.__useDefaultFramebuffer=L===void 0};let G8=b.createFramebuffer();this.setRenderTarget=function(E,L=0,G=0){x=E,Q=L,Y=G;let C=!0,I=null,_=!1,vA=!1;if(E){let DA=BA.get(E);if(DA.__useDefaultFramebuffer!==void 0)TA.bindFramebuffer(b.FRAMEBUFFER,null),C=!1;else if(DA.__webglFramebuffer===void 0)HA.setupRenderTarget(E);else if(DA.__hasExternalTextures)HA.rebindTextures(E,BA.get(E.texture).__webglTexture,BA.get(E.depthTexture).__webglTexture);else if(E.depthBuffer){let uA=E.depthTexture;if(DA.__boundDepthTexture!==uA){if(uA!==null&&BA.has(uA)&&(E.width!==uA.image.width||E.height!==uA.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");HA.setupDepthRenderbuffer(E)}}let QA=E.texture;(QA.isData3DTexture||QA.isDataArrayTexture||QA.isCompressedArrayTexture)&&(vA=!0);let pA=BA.get(E).__webglFramebuffer;E.isWebGLCubeRenderTarget?(Array.isArray(pA[L])?I=pA[L][G]:I=pA[L],_=!0):E.samples>0&&HA.useMultisampledRTT(E)===!1?I=BA.get(E).__webglMultisampledFramebuffer:Array.isArray(pA)?I=pA[G]:I=pA,p.copy(E.viewport),k.copy(E.scissor),F=E.scissorTest}else p.copy(hA).multiplyScalar(N).floor(),k.copy(CA).multiplyScalar(N).floor(),F=AP;if(G!==0&&(I=G8),TA.bindFramebuffer(b.FRAMEBUFFER,I)&&C&&TA.drawBuffers(E,I),TA.viewport(p),TA.scissor(k),TA.setScissorTest(F),_){let DA=BA.get(E.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_CUBE_MAP_POSITIVE_X+L,DA.__webglTexture,G)}else if(vA){let DA=L;for(let QA=0;QA<E.textures.length;QA++){let pA=BA.get(E.textures[QA]);b.framebufferTextureLayer(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0+QA,pA.__webglTexture,G,DA)}}else if(E!==null&&G!==0){let DA=BA.get(E.texture);b.framebufferTexture2D(b.FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,DA.__webglTexture,G)}h=-1},this.readRenderTargetPixels=function(E,L,G,C,I,_,vA,aA=0){if(!(E&&E.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let DA=BA.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&vA!==void 0&&(DA=DA[vA]),DA){TA.bindFramebuffer(b.FRAMEBUFFER,DA);try{let QA=E.textures[aA],pA=QA.format,uA=QA.type;if(!YA.textureFormatReadable(pA)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!YA.textureTypeReadable(uA)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}L>=0&&L<=E.width-C&&G>=0&&G<=E.height-I&&(E.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+aA),b.readPixels(L,G,C,I,jA.convert(pA),jA.convert(uA),_))}finally{let QA=x!==null?BA.get(x).__webglFramebuffer:null;TA.bindFramebuffer(b.FRAMEBUFFER,QA)}}},this.readRenderTargetPixelsAsync=async function(E,L,G,C,I,_,vA,aA=0){if(!(E&&E.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let DA=BA.get(E).__webglFramebuffer;if(E.isWebGLCubeRenderTarget&&vA!==void 0&&(DA=DA[vA]),DA)if(L>=0&&L<=E.width-C&&G>=0&&G<=E.height-I){TA.bindFramebuffer(b.FRAMEBUFFER,DA);let QA=E.textures[aA],pA=QA.format,uA=QA.type;if(!YA.textureFormatReadable(pA))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!YA.textureTypeReadable(uA))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");let XA=b.createBuffer();b.bindBuffer(b.PIXEL_PACK_BUFFER,XA),b.bufferData(b.PIXEL_PACK_BUFFER,_.byteLength,b.STREAM_READ),E.textures.length>1&&b.readBuffer(b.COLOR_ATTACHMENT0+aA),b.readPixels(L,G,C,I,jA.convert(pA),jA.convert(uA),0);let KA=x!==null?BA.get(x).__webglFramebuffer:null;TA.bindFramebuffer(b.FRAMEBUFFER,KA);let zP=b.fenceSync(b.SYNC_GPU_COMMANDS_COMPLETE,0);return b.flush(),await I9(b,zP,4),b.bindBuffer(b.PIXEL_PACK_BUFFER,XA),b.getBufferSubData(b.PIXEL_PACK_BUFFER,0,_),b.deleteBuffer(XA),b.deleteSync(zP),_}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(E,L=null,G=0){let C=Math.pow(2,-G),I=Math.floor(E.image.width*C),_=Math.floor(E.image.height*C),vA=L!==null?L.x:0,aA=L!==null?L.y:0;HA.setTexture2D(E,0),b.copyTexSubImage2D(b.TEXTURE_2D,G,0,0,vA,aA,I,_),TA.unbindTexture()};let C8=b.createFramebuffer(),F8=b.createFramebuffer();this.copyTextureToTexture=function(E,L,G=null,C=null,I=0,_=null){_===null&&(I!==0?(cn("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),_=I,I=0):_=0);let vA,aA,DA,QA,pA,uA,XA,KA,zP,tP=E.isCompressedTexture?E.mipmaps[_]:E.image;if(G!==null)vA=G.max.x-G.min.x,aA=G.max.y-G.min.y,DA=G.isBox3?G.max.z-G.min.z:1,QA=G.min.x,pA=G.min.y,uA=G.isBox3?G.min.z:0;else{let _P=Math.pow(2,-I);vA=Math.floor(tP.width*_P),aA=Math.floor(tP.height*_P),E.isDataArrayTexture?DA=tP.depth:E.isData3DTexture?DA=Math.floor(tP.depth*_P):DA=1,QA=0,pA=0,uA=0}C!==null?(XA=C.x,KA=C.y,zP=C.z):(XA=0,KA=0,zP=0);let _A=jA.convert(L.format),MA=jA.convert(L.type),rP;L.isData3DTexture?(HA.setTexture3D(L,0),rP=b.TEXTURE_3D):L.isDataArrayTexture||L.isCompressedArrayTexture?(HA.setTexture2DArray(L,0),rP=b.TEXTURE_2D_ARRAY):(HA.setTexture2D(L,0),rP=b.TEXTURE_2D),b.pixelStorei(b.UNPACK_FLIP_Y_WEBGL,L.flipY),b.pixelStorei(b.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),b.pixelStorei(b.UNPACK_ALIGNMENT,L.unpackAlignment);let WA=b.getParameter(b.UNPACK_ROW_LENGTH),RP=b.getParameter(b.UNPACK_IMAGE_HEIGHT),Xt=b.getParameter(b.UNPACK_SKIP_PIXELS),WP=b.getParameter(b.UNPACK_SKIP_ROWS),Fn=b.getParameter(b.UNPACK_SKIP_IMAGES);b.pixelStorei(b.UNPACK_ROW_LENGTH,tP.width),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,tP.height),b.pixelStorei(b.UNPACK_SKIP_PIXELS,QA),b.pixelStorei(b.UNPACK_SKIP_ROWS,pA),b.pixelStorei(b.UNPACK_SKIP_IMAGES,uA);let oP=E.isDataArrayTexture||E.isData3DTexture,KP=L.isDataArrayTexture||L.isData3DTexture;if(E.isDepthTexture){let _P=BA.get(E),OP=BA.get(L),GP=BA.get(_P.__renderTarget),Sv=BA.get(OP.__renderTarget);TA.bindFramebuffer(b.READ_FRAMEBUFFER,GP.__webglFramebuffer),TA.bindFramebuffer(b.DRAW_FRAMEBUFFER,Sv.__webglFramebuffer);for(let gt=0;gt<DA;gt++)oP&&(b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,BA.get(E).__webglTexture,I,uA+gt),b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,BA.get(L).__webglTexture,_,zP+gt)),b.blitFramebuffer(QA,pA,vA,aA,XA,KA,vA,aA,b.DEPTH_BUFFER_BIT,b.NEAREST);TA.bindFramebuffer(b.READ_FRAMEBUFFER,null),TA.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else if(I!==0||E.isRenderTargetTexture||BA.has(E)){let _P=BA.get(E),OP=BA.get(L);TA.bindFramebuffer(b.READ_FRAMEBUFFER,C8),TA.bindFramebuffer(b.DRAW_FRAMEBUFFER,F8);for(let GP=0;GP<DA;GP++)oP?b.framebufferTextureLayer(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,_P.__webglTexture,I,uA+GP):b.framebufferTexture2D(b.READ_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,_P.__webglTexture,I),KP?b.framebufferTextureLayer(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,OP.__webglTexture,_,zP+GP):b.framebufferTexture2D(b.DRAW_FRAMEBUFFER,b.COLOR_ATTACHMENT0,b.TEXTURE_2D,OP.__webglTexture,_),I!==0?b.blitFramebuffer(QA,pA,vA,aA,XA,KA,vA,aA,b.COLOR_BUFFER_BIT,b.NEAREST):KP?b.copyTexSubImage3D(rP,_,XA,KA,zP+GP,QA,pA,vA,aA):b.copyTexSubImage2D(rP,_,XA,KA,QA,pA,vA,aA);TA.bindFramebuffer(b.READ_FRAMEBUFFER,null),TA.bindFramebuffer(b.DRAW_FRAMEBUFFER,null)}else KP?E.isDataTexture||E.isData3DTexture?b.texSubImage3D(rP,_,XA,KA,zP,vA,aA,DA,_A,MA,tP.data):L.isCompressedArrayTexture?b.compressedTexSubImage3D(rP,_,XA,KA,zP,vA,aA,DA,_A,tP.data):b.texSubImage3D(rP,_,XA,KA,zP,vA,aA,DA,_A,MA,tP):E.isDataTexture?b.texSubImage2D(b.TEXTURE_2D,_,XA,KA,vA,aA,_A,MA,tP.data):E.isCompressedTexture?b.compressedTexSubImage2D(b.TEXTURE_2D,_,XA,KA,tP.width,tP.height,_A,tP.data):b.texSubImage2D(b.TEXTURE_2D,_,XA,KA,vA,aA,_A,MA,tP);b.pixelStorei(b.UNPACK_ROW_LENGTH,WA),b.pixelStorei(b.UNPACK_IMAGE_HEIGHT,RP),b.pixelStorei(b.UNPACK_SKIP_PIXELS,Xt),b.pixelStorei(b.UNPACK_SKIP_ROWS,WP),b.pixelStorei(b.UNPACK_SKIP_IMAGES,Fn),_===0&&L.generateMipmaps&&b.generateMipmap(rP),TA.unbindTexture()},this.initRenderTarget=function(E){BA.get(E).__webglFramebuffer===void 0&&HA.setupRenderTarget(E)},this.initTexture=function(E){E.isCubeTexture?HA.setTextureCube(E,0):E.isData3DTexture?HA.setTexture3D(E,0):E.isDataArrayTexture||E.isCompressedArrayTexture?HA.setTexture2DArray(E,0):HA.setTexture2D(E,0),TA.unbindTexture()},this.resetState=function(){Q=0,Y=0,x=null,TA.reset(),iA.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return ie}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(A){this._outputColorSpace=A;let P=this.getContext();P.drawingBufferColorSpace=ZA._getDrawingBufferColorSpace(A),P.unpackColorSpace=ZA._getUnpackColorSpace()}};function fo(n,A){if(A===Wr)return console.warn("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Geometry already defined as triangles."),n;if(A===Yn||A===Ls){let P=n.getIndex();if(P===null){let i=[],v=n.getAttribute("position");if(v!==void 0){for(let o=0;o<v.count;o++)i.push(o);n.setIndex(i),P=n.getIndex()}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Undefined position attribute. Processing not possible."),n}let e=P.count-2,t=[];if(A===Yn)for(let i=1;i<=e;i++)t.push(P.getX(0)),t.push(P.getX(i)),t.push(P.getX(i+1));else for(let i=0;i<e;i++)i%2===0?(t.push(P.getX(i)),t.push(P.getX(i+1)),t.push(P.getX(i+2))):(t.push(P.getX(i+2)),t.push(P.getX(i+1)),t.push(P.getX(i)));t.length/3!==e&&console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unable to generate correct amount of triangles.");let s=n.clone();return s.setIndex(t),s.clearGroups(),s}else return console.error("THREE.BufferGeometryUtils.toTrianglesDrawMode(): Unknown draw mode:",A),n}var Hv=class extends ue{constructor(A){super(A),this.dracoLoader=null,this.ktx2Loader=null,this.meshoptDecoder=null,this.pluginCallbacks=[],this.register(function(P){return new mo(P)}),this.register(function(P){return new Mo(P)}),this.register(function(P){return new Io(P)}),this.register(function(P){return new ko(P)}),this.register(function(P){return new Ho(P)}),this.register(function(P){return new bo(P)}),this.register(function(P){return new Yo(P)}),this.register(function(P){return new po(P)}),this.register(function(P){return new yo(P)}),this.register(function(P){return new uo(P)}),this.register(function(P){return new xo(P)}),this.register(function(P){return new Qo(P)}),this.register(function(P){return new Lo(P)}),this.register(function(P){return new Oo(P)}),this.register(function(P){return new lo(P)}),this.register(function(P){return new Go(P)}),this.register(function(P){return new Co(P)})}load(A,P,e,t){let s=this,i;if(this.resourcePath!=="")i=this.resourcePath;else if(this.path!==""){let r=We.extractUrlBase(A);i=We.resolveURL(r,this.path)}else i=We.extractUrlBase(A);this.manager.itemStart(A);let v=function(r){t?t(r):console.error(r),s.manager.itemError(A),s.manager.itemEnd(A)},o=new hn(this.manager);o.setPath(this.path),o.setResponseType("arraybuffer"),o.setRequestHeader(this.requestHeader),o.setWithCredentials(this.withCredentials),o.load(A,function(r){try{s.parse(r,i,function(D){P(D),s.manager.itemEnd(A)},v)}catch(D){v(D)}},e,v)}setDRACOLoader(A){return this.dracoLoader=A,this}setKTX2Loader(A){return this.ktx2Loader=A,this}setMeshoptDecoder(A){return this.meshoptDecoder=A,this}register(A){return this.pluginCallbacks.indexOf(A)===-1&&this.pluginCallbacks.push(A),this}unregister(A){return this.pluginCallbacks.indexOf(A)!==-1&&this.pluginCallbacks.splice(this.pluginCallbacks.indexOf(A),1),this}parse(A,P,e,t){let s,i={},v={},o=new TextDecoder;if(typeof A=="string")s=JSON.parse(A);else if(A instanceof ArrayBuffer)if(o.decode(new Uint8Array(A,0,4))===j8){try{i[NA.KHR_BINARY_GLTF]=new Fo(A)}catch(z){t&&t(z);return}s=JSON.parse(i[NA.KHR_BINARY_GLTF].content)}else s=JSON.parse(o.decode(A));else s=A;if(s.asset===void 0||s.asset.version[0]<2){t&&t(new Error("THREE.GLTFLoader: Unsupported asset. glTF versions >=2.0 are supported."));return}let r=new Uo(s,{path:P||this.resourcePath||"",crossOrigin:this.crossOrigin,requestHeader:this.requestHeader,manager:this.manager,ktx2Loader:this.ktx2Loader,meshoptDecoder:this.meshoptDecoder});r.fileLoader.setRequestHeader(this.requestHeader);for(let D=0;D<this.pluginCallbacks.length;D++){let z=this.pluginCallbacks[D](r);z.name||console.error("THREE.GLTFLoader: Invalid plugin found: missing name"),v[z.name]=z,i[z.name]=!0}if(s.extensionsUsed)for(let D=0;D<s.extensionsUsed.length;++D){let z=s.extensionsUsed[D],c=s.extensionsRequired||[];switch(z){case NA.KHR_MATERIALS_UNLIT:i[z]=new ho;break;case NA.KHR_DRACO_MESH_COMPRESSION:i[z]=new No(s,this.dracoLoader);break;case NA.KHR_TEXTURE_TRANSFORM:i[z]=new Xo;break;case NA.KHR_MESH_QUANTIZATION:i[z]=new Zo;break;default:c.indexOf(z)>=0&&v[z]===void 0&&console.warn('THREE.GLTFLoader: Unknown extension "'+z+'".')}}r.setExtensions(i),r.setPlugins(v),r.parse(e,t)}parseAsync(A,P){let e=this;return new Promise(function(t,s){e.parse(A,P,t,s)})}};function BB(){let n={};return{get:function(A){return n[A]},add:function(A,P){n[A]=P},remove:function(A){delete n[A]},removeAll:function(){n={}}}}var NA={KHR_BINARY_GLTF:"KHR_binary_glTF",KHR_DRACO_MESH_COMPRESSION:"KHR_draco_mesh_compression",KHR_LIGHTS_PUNCTUAL:"KHR_lights_punctual",KHR_MATERIALS_CLEARCOAT:"KHR_materials_clearcoat",KHR_MATERIALS_DISPERSION:"KHR_materials_dispersion",KHR_MATERIALS_IOR:"KHR_materials_ior",KHR_MATERIALS_SHEEN:"KHR_materials_sheen",KHR_MATERIALS_SPECULAR:"KHR_materials_specular",KHR_MATERIALS_TRANSMISSION:"KHR_materials_transmission",KHR_MATERIALS_IRIDESCENCE:"KHR_materials_iridescence",KHR_MATERIALS_ANISOTROPY:"KHR_materials_anisotropy",KHR_MATERIALS_UNLIT:"KHR_materials_unlit",KHR_MATERIALS_VOLUME:"KHR_materials_volume",KHR_TEXTURE_BASISU:"KHR_texture_basisu",KHR_TEXTURE_TRANSFORM:"KHR_texture_transform",KHR_MESH_QUANTIZATION:"KHR_mesh_quantization",KHR_MATERIALS_EMISSIVE_STRENGTH:"KHR_materials_emissive_strength",EXT_MATERIALS_BUMP:"EXT_materials_bump",EXT_TEXTURE_WEBP:"EXT_texture_webp",EXT_TEXTURE_AVIF:"EXT_texture_avif",EXT_MESHOPT_COMPRESSION:"EXT_meshopt_compression",EXT_MESH_GPU_INSTANCING:"EXT_mesh_gpu_instancing"},lo=class{constructor(A){this.parser=A,this.name=NA.KHR_LIGHTS_PUNCTUAL,this.cache={refs:{},uses:{}}}_markDefs(){let A=this.parser,P=this.parser.json.nodes||[];for(let e=0,t=P.length;e<t;e++){let s=P[e];s.extensions&&s.extensions[this.name]&&s.extensions[this.name].light!==void 0&&A._addNodeRef(this.cache,s.extensions[this.name].light)}}_loadLight(A){let P=this.parser,e="light:"+A,t=P.cache.get(e);if(t)return t;let s=P.json,o=((s.extensions&&s.extensions[this.name]||{}).lights||[])[A],r,D=new mA(16777215);o.color!==void 0&&D.setRGB(o.color[0],o.color[1],o.color[2],QP);let z=o.range!==void 0?o.range:0;switch(o.type){case"directional":r=new pt(D),r.target.position.set(0,0,-1),r.add(r.target);break;case"point":r=new me(D),r.distance=z;break;case"spot":r=new Qs(D),r.distance=z,o.spot=o.spot||{},o.spot.innerConeAngle=o.spot.innerConeAngle!==void 0?o.spot.innerConeAngle:0,o.spot.outerConeAngle=o.spot.outerConeAngle!==void 0?o.spot.outerConeAngle:Math.PI/4,r.angle=o.spot.outerConeAngle,r.penumbra=1-o.spot.innerConeAngle/o.spot.outerConeAngle,r.target.position.set(0,0,-1),r.add(r.target);break;default:throw new Error("THREE.GLTFLoader: Unexpected light type: "+o.type)}return r.position.set(0,0,0),de(r,o),o.intensity!==void 0&&(r.intensity=o.intensity),r.name=P.createUniqueName(o.name||"light_"+A),t=Promise.resolve(r),P.cache.add(e,t),t}getDependency(A,P){if(A==="light")return this._loadLight(P)}createNodeAttachment(A){let P=this,e=this.parser,s=e.json.nodes[A],v=(s.extensions&&s.extensions[this.name]||{}).light;return v===void 0?null:this._loadLight(v).then(function(o){return e._getNodeRef(P.cache,v,o)})}},ho=class{constructor(){this.name=NA.KHR_MATERIALS_UNLIT}getMaterialType(){return De}extendParams(A,P,e){let t=[];A.color=new mA(1,1,1),A.opacity=1;let s=P.pbrMetallicRoughness;if(s){if(Array.isArray(s.baseColorFactor)){let i=s.baseColorFactor;A.color.setRGB(i[0],i[1],i[2],QP),A.opacity=i[3]}s.baseColorTexture!==void 0&&t.push(e.assignTexture(A,"map",s.baseColorTexture,cP))}return Promise.all(t)}},uo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_EMISSIVE_STRENGTH}extendMaterialParams(A,P){let t=this.parser.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=t.extensions[this.name].emissiveStrength;return s!==void 0&&(P.emissiveIntensity=s),Promise.resolve()}},mo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_CLEARCOAT}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];if(i.clearcoatFactor!==void 0&&(P.clearcoat=i.clearcoatFactor),i.clearcoatTexture!==void 0&&s.push(e.assignTexture(P,"clearcoatMap",i.clearcoatTexture)),i.clearcoatRoughnessFactor!==void 0&&(P.clearcoatRoughness=i.clearcoatRoughnessFactor),i.clearcoatRoughnessTexture!==void 0&&s.push(e.assignTexture(P,"clearcoatRoughnessMap",i.clearcoatRoughnessTexture)),i.clearcoatNormalTexture!==void 0&&(s.push(e.assignTexture(P,"clearcoatNormalMap",i.clearcoatNormalTexture)),i.clearcoatNormalTexture.scale!==void 0)){let v=i.clearcoatNormalTexture.scale;P.clearcoatNormalScale=new bA(v,v)}return Promise.all(s)}},Mo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_DISPERSION}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let t=this.parser.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=t.extensions[this.name];return P.dispersion=s.dispersion!==void 0?s.dispersion:0,Promise.resolve()}},Qo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_IRIDESCENCE}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];return i.iridescenceFactor!==void 0&&(P.iridescence=i.iridescenceFactor),i.iridescenceTexture!==void 0&&s.push(e.assignTexture(P,"iridescenceMap",i.iridescenceTexture)),i.iridescenceIor!==void 0&&(P.iridescenceIOR=i.iridescenceIor),P.iridescenceThicknessRange===void 0&&(P.iridescenceThicknessRange=[100,400]),i.iridescenceThicknessMinimum!==void 0&&(P.iridescenceThicknessRange[0]=i.iridescenceThicknessMinimum),i.iridescenceThicknessMaximum!==void 0&&(P.iridescenceThicknessRange[1]=i.iridescenceThicknessMaximum),i.iridescenceThicknessTexture!==void 0&&s.push(e.assignTexture(P,"iridescenceThicknessMap",i.iridescenceThicknessTexture)),Promise.all(s)}},bo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_SHEEN}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[];P.sheenColor=new mA(0,0,0),P.sheenRoughness=0,P.sheen=1;let i=t.extensions[this.name];if(i.sheenColorFactor!==void 0){let v=i.sheenColorFactor;P.sheenColor.setRGB(v[0],v[1],v[2],QP)}return i.sheenRoughnessFactor!==void 0&&(P.sheenRoughness=i.sheenRoughnessFactor),i.sheenColorTexture!==void 0&&s.push(e.assignTexture(P,"sheenColorMap",i.sheenColorTexture,cP)),i.sheenRoughnessTexture!==void 0&&s.push(e.assignTexture(P,"sheenRoughnessMap",i.sheenRoughnessTexture)),Promise.all(s)}},Yo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_TRANSMISSION}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];return i.transmissionFactor!==void 0&&(P.transmission=i.transmissionFactor),i.transmissionTexture!==void 0&&s.push(e.assignTexture(P,"transmissionMap",i.transmissionTexture)),Promise.all(s)}},po=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_VOLUME}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];P.thickness=i.thicknessFactor!==void 0?i.thicknessFactor:0,i.thicknessTexture!==void 0&&s.push(e.assignTexture(P,"thicknessMap",i.thicknessTexture)),P.attenuationDistance=i.attenuationDistance||1/0;let v=i.attenuationColor||[1,1,1];return P.attenuationColor=new mA().setRGB(v[0],v[1],v[2],QP),Promise.all(s)}},yo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_IOR}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let t=this.parser.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=t.extensions[this.name];return P.ior=s.ior!==void 0?s.ior:1.5,Promise.resolve()}},xo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_SPECULAR}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];P.specularIntensity=i.specularFactor!==void 0?i.specularFactor:1,i.specularTexture!==void 0&&s.push(e.assignTexture(P,"specularIntensityMap",i.specularTexture));let v=i.specularColorFactor||[1,1,1];return P.specularColor=new mA().setRGB(v[0],v[1],v[2],QP),i.specularColorTexture!==void 0&&s.push(e.assignTexture(P,"specularColorMap",i.specularColorTexture,cP)),Promise.all(s)}},Oo=class{constructor(A){this.parser=A,this.name=NA.EXT_MATERIALS_BUMP}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];return P.bumpScale=i.bumpFactor!==void 0?i.bumpFactor:1,i.bumpTexture!==void 0&&s.push(e.assignTexture(P,"bumpMap",i.bumpTexture)),Promise.all(s)}},Lo=class{constructor(A){this.parser=A,this.name=NA.KHR_MATERIALS_ANISOTROPY}getMaterialType(A){let e=this.parser.json.materials[A];return!e.extensions||!e.extensions[this.name]?null:NP}extendMaterialParams(A,P){let e=this.parser,t=e.json.materials[A];if(!t.extensions||!t.extensions[this.name])return Promise.resolve();let s=[],i=t.extensions[this.name];return i.anisotropyStrength!==void 0&&(P.anisotropy=i.anisotropyStrength),i.anisotropyRotation!==void 0&&(P.anisotropyRotation=i.anisotropyRotation),i.anisotropyTexture!==void 0&&s.push(e.assignTexture(P,"anisotropyMap",i.anisotropyTexture)),Promise.all(s)}},Io=class{constructor(A){this.parser=A,this.name=NA.KHR_TEXTURE_BASISU}loadTexture(A){let P=this.parser,e=P.json,t=e.textures[A];if(!t.extensions||!t.extensions[this.name])return null;let s=t.extensions[this.name],i=P.options.ktx2Loader;if(!i){if(e.extensionsRequired&&e.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setKTX2Loader must be called before loading KTX2 textures");return null}return P.loadTextureImage(A,s.source,i)}},ko=class{constructor(A){this.parser=A,this.name=NA.EXT_TEXTURE_WEBP}loadTexture(A){let P=this.name,e=this.parser,t=e.json,s=t.textures[A];if(!s.extensions||!s.extensions[P])return null;let i=s.extensions[P],v=t.images[i.source],o=e.textureLoader;if(v.uri){let r=e.options.manager.getHandler(v.uri);r!==null&&(o=r)}return e.loadTextureImage(A,i.source,o)}},Ho=class{constructor(A){this.parser=A,this.name=NA.EXT_TEXTURE_AVIF}loadTexture(A){let P=this.name,e=this.parser,t=e.json,s=t.textures[A];if(!s.extensions||!s.extensions[P])return null;let i=s.extensions[P],v=t.images[i.source],o=e.textureLoader;if(v.uri){let r=e.options.manager.getHandler(v.uri);r!==null&&(o=r)}return e.loadTextureImage(A,i.source,o)}},Go=class{constructor(A){this.name=NA.EXT_MESHOPT_COMPRESSION,this.parser=A}loadBufferView(A){let P=this.parser.json,e=P.bufferViews[A];if(e.extensions&&e.extensions[this.name]){let t=e.extensions[this.name],s=this.parser.getDependency("buffer",t.buffer),i=this.parser.options.meshoptDecoder;if(!i||!i.supported){if(P.extensionsRequired&&P.extensionsRequired.indexOf(this.name)>=0)throw new Error("THREE.GLTFLoader: setMeshoptDecoder must be called before loading compressed files");return null}return s.then(function(v){let o=t.byteOffset||0,r=t.byteLength||0,D=t.count,z=t.byteStride,c=new Uint8Array(v,o,r);return i.decodeGltfBufferAsync?i.decodeGltfBufferAsync(D,z,c,t.mode,t.filter).then(function(g){return g.buffer}):i.ready.then(function(){let g=new ArrayBuffer(D*z);return i.decodeGltfBuffer(new Uint8Array(g),D,z,c,t.mode,t.filter),g})})}else return null}},Co=class{constructor(A){this.name=NA.EXT_MESH_GPU_INSTANCING,this.parser=A}createNodeMesh(A){let P=this.parser.json,e=P.nodes[A];if(!e.extensions||!e.extensions[this.name]||e.mesh===void 0)return null;let t=P.meshes[e.mesh];for(let r of t.primitives)if(r.mode!==Pe.TRIANGLES&&r.mode!==Pe.TRIANGLE_STRIP&&r.mode!==Pe.TRIANGLE_FAN&&r.mode!==void 0)return null;let i=e.extensions[this.name].attributes,v=[],o={};for(let r in i)v.push(this.parser.getDependency("accessor",i[r]).then(D=>(o[r]=D,o[r])));return v.length<1?null:(v.push(this.parser.createNodeMesh(A)),Promise.all(v).then(r=>{let D=r.pop(),z=D.isGroup?D.children:[D],c=r[0].count,g=[];for(let B of z){let f=new yA,T=new y,a=new CP,m=new y(1,1,1),u=new it(B.geometry,B.material,c);for(let j=0;j<c;j++)o.TRANSLATION&&T.fromBufferAttribute(o.TRANSLATION,j),o.ROTATION&&a.fromBufferAttribute(o.ROTATION,j),o.SCALE&&m.fromBufferAttribute(o.SCALE,j),u.setMatrixAt(j,f.compose(T,a,m));for(let j in o)if(j==="_COLOR_0"){let d=o[j];u.instanceColor=new st(d.array,d.itemSize,d.normalized)}else j!=="TRANSLATION"&&j!=="ROTATION"&&j!=="SCALE"&&B.geometry.setAttribute(j,o[j]);nP.prototype.copy.call(u,B),this.parser.assignFinalMaterial(u),g.push(u)}return D.isGroup?(D.clear(),D.add(...g),D):g[0]}))}},j8="glTF",ks=12,T8={JSON:1313821514,BIN:5130562},Fo=class{constructor(A){this.name=NA.KHR_BINARY_GLTF,this.content=null,this.body=null;let P=new DataView(A,0,ks),e=new TextDecoder;if(this.header={magic:e.decode(new Uint8Array(A.slice(0,4))),version:P.getUint32(4,!0),length:P.getUint32(8,!0)},this.header.magic!==j8)throw new Error("THREE.GLTFLoader: Unsupported glTF-Binary header.");if(this.header.version<2)throw new Error("THREE.GLTFLoader: Legacy binary file detected.");let t=this.header.length-ks,s=new DataView(A,ks),i=0;for(;i<t;){let v=s.getUint32(i,!0);i+=4;let o=s.getUint32(i,!0);if(i+=4,o===T8.JSON){let r=new Uint8Array(A,ks+i,v);this.content=e.decode(r)}else if(o===T8.BIN){let r=ks+i;this.body=A.slice(r,r+v)}i+=v}if(this.content===null)throw new Error("THREE.GLTFLoader: JSON content not found.")}},No=class{constructor(A,P){if(!P)throw new Error("THREE.GLTFLoader: No DRACOLoader instance provided.");this.name=NA.KHR_DRACO_MESH_COMPRESSION,this.json=A,this.dracoLoader=P,this.dracoLoader.preload()}decodePrimitive(A,P){let e=this.json,t=this.dracoLoader,s=A.extensions[this.name].bufferView,i=A.extensions[this.name].attributes,v={},o={},r={};for(let D in i){let z=Wo[D]||D.toLowerCase();v[z]=i[D]}for(let D in A.attributes){let z=Wo[D]||D.toLowerCase();if(i[D]!==void 0){let c=e.accessors[A.attributes[D]],g=Ln[c.componentType];r[z]=g.name,o[z]=c.normalized===!0}}return P.getDependency("bufferView",s).then(function(D){return new Promise(function(z,c){t.decodeDracoFile(D,function(g){for(let B in g.attributes){let f=g.attributes[B],T=o[B];T!==void 0&&(f.normalized=T)}z(g)},v,r,QP,c)})})}},Xo=class{constructor(){this.name=NA.KHR_TEXTURE_TRANSFORM}extendTexture(A,P){return(P.texCoord===void 0||P.texCoord===A.channel)&&P.offset===void 0&&P.rotation===void 0&&P.scale===void 0||(A=A.clone(),P.texCoord!==void 0&&(A.channel=P.texCoord),P.offset!==void 0&&A.offset.fromArray(P.offset),P.rotation!==void 0&&(A.rotation=P.rotation),P.scale!==void 0&&A.repeat.fromArray(P.scale),A.needsUpdate=!0),A}},Zo=class{constructor(){this.name=NA.KHR_MESH_QUANTIZATION}},Gv=class extends Xe{constructor(A,P,e,t){super(A,P,e,t)}copySampleValue_(A){let P=this.resultBuffer,e=this.sampleValues,t=this.valueSize,s=A*t*3+t;for(let i=0;i!==t;i++)P[i]=e[s+i];return P}interpolate_(A,P,e,t){let s=this.resultBuffer,i=this.sampleValues,v=this.valueSize,o=v*2,r=v*3,D=t-P,z=(e-P)/D,c=z*z,g=c*z,B=A*r,f=B-r,T=-2*g+3*c,a=g-c,m=1-T,u=a-c+z;for(let j=0;j!==v;j++){let d=i[f+j+v],Q=i[f+j+o]*D,Y=i[B+j+v],x=i[B+j]*D;s[j]=m*d+u*Q+T*Y+a*x}return s}},fB=new CP,Ro=class extends Gv{interpolate_(A,P,e,t){let s=super.interpolate_(A,P,e,t);return fB.fromArray(s).normalize().toArray(s),s}},Pe={FLOAT:5126,FLOAT_MAT3:35675,FLOAT_MAT4:35676,FLOAT_VEC2:35664,FLOAT_VEC3:35665,FLOAT_VEC4:35666,LINEAR:9729,REPEAT:10497,SAMPLER_2D:35678,POINTS:0,LINES:1,LINE_LOOP:2,LINE_STRIP:3,TRIANGLES:4,TRIANGLE_STRIP:5,TRIANGLE_FAN:6,UNSIGNED_BYTE:5121,UNSIGNED_SHORT:5123},Ln={5120:Int8Array,5121:Uint8Array,5122:Int16Array,5123:Uint16Array,5125:Uint32Array,5126:Float32Array},B8={9728:MP,9729:IP,9984:Vi,9985:mn,9986:Ot,9987:ze},f8={33071:Be,33648:on,10497:tt},wo={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT2:4,MAT3:9,MAT4:16},Wo={POSITION:"position",NORMAL:"normal",TANGENT:"tangent",TEXCOORD_0:"uv",TEXCOORD_1:"uv1",TEXCOORD_2:"uv2",TEXCOORD_3:"uv3",COLOR_0:"color",WEIGHTS_0:"skinWeight",JOINTS_0:"skinIndex"},ot={scale:"scale",translation:"position",rotation:"quaternion",weights:"morphTargetInfluences"},wB={CUBICSPLINE:void 0,LINEAR:ut,STEP:ht},jo={OPAQUE:"OPAQUE",MASK:"MASK",BLEND:"BLEND"};function jB(n){return n.DefaultMaterial===void 0&&(n.DefaultMaterial=new yP({color:16777215,emissive:0,metalness:1,roughness:1,transparent:!1,depthTest:!0,side:re})),n.DefaultMaterial}function Ct(n,A,P){for(let e in P.extensions)n[e]===void 0&&(A.userData.gltfExtensions=A.userData.gltfExtensions||{},A.userData.gltfExtensions[e]=P.extensions[e])}function de(n,A){A.extras!==void 0&&(typeof A.extras=="object"?Object.assign(n.userData,A.extras):console.warn("THREE.GLTFLoader: Ignoring primitive type .extras, "+A.extras))}function EB(n,A,P){let e=!1,t=!1,s=!1;for(let r=0,D=A.length;r<D;r++){let z=A[r];if(z.POSITION!==void 0&&(e=!0),z.NORMAL!==void 0&&(t=!0),z.COLOR_0!==void 0&&(s=!0),e&&t&&s)break}if(!e&&!t&&!s)return Promise.resolve(n);let i=[],v=[],o=[];for(let r=0,D=A.length;r<D;r++){let z=A[r];if(e){let c=z.POSITION!==void 0?P.getDependency("accessor",z.POSITION):n.attributes.position;i.push(c)}if(t){let c=z.NORMAL!==void 0?P.getDependency("accessor",z.NORMAL):n.attributes.normal;v.push(c)}if(s){let c=z.COLOR_0!==void 0?P.getDependency("accessor",z.COLOR_0):n.attributes.color;o.push(c)}}return Promise.all([Promise.all(i),Promise.all(v),Promise.all(o)]).then(function(r){let D=r[0],z=r[1],c=r[2];return e&&(n.morphAttributes.position=D),t&&(n.morphAttributes.normal=z),s&&(n.morphAttributes.color=c),n.morphTargetsRelative=!0,n})}function lB(n,A){if(n.updateMorphTargets(),A.weights!==void 0)for(let P=0,e=A.weights.length;P<e;P++)n.morphTargetInfluences[P]=A.weights[P];if(A.extras&&Array.isArray(A.extras.targetNames)){let P=A.extras.targetNames;if(n.morphTargetInfluences.length===P.length){n.morphTargetDictionary={};for(let e=0,t=P.length;e<t;e++)n.morphTargetDictionary[P[e]]=e}else console.warn("THREE.GLTFLoader: Invalid extras.targetNames length. Ignoring names.")}}function hB(n){let A,P=n.extensions&&n.extensions[NA.KHR_DRACO_MESH_COMPRESSION];if(P?A="draco:"+P.bufferView+":"+P.indices+":"+Eo(P.attributes):A=n.indices+":"+Eo(n.attributes)+":"+n.mode,n.targets!==void 0)for(let e=0,t=n.targets.length;e<t;e++)A+=":"+Eo(n.targets[e]);return A}function Eo(n){let A="",P=Object.keys(n).sort();for(let e=0,t=P.length;e<t;e++)A+=P[e]+":"+n[P[e]]+";";return A}function So(n){switch(n){case Int8Array:return 1/127;case Uint8Array:return 1/255;case Int16Array:return 1/32767;case Uint16Array:return 1/65535;default:throw new Error("THREE.GLTFLoader: Unsupported normalized accessor component type.")}}function uB(n){return n.search(/\.jpe?g($|\?)/i)>0||n.search(/^data\:image\/jpeg/)===0?"image/jpeg":n.search(/\.webp($|\?)/i)>0||n.search(/^data\:image\/webp/)===0?"image/webp":n.search(/\.ktx2($|\?)/i)>0||n.search(/^data\:image\/ktx2/)===0?"image/ktx2":"image/png"}var mB=new yA,Uo=class{constructor(A={},P={}){this.json=A,this.extensions={},this.plugins={},this.options=P,this.cache=new BB,this.associations=new Map,this.primitiveCache={},this.nodeCache={},this.meshCache={refs:{},uses:{}},this.cameraCache={refs:{},uses:{}},this.lightCache={refs:{},uses:{}},this.sourceCache={},this.textureCache={},this.nodeNamesUsed={};let e=!1,t=-1,s=!1,i=-1;if(typeof navigator<"u"){let v=navigator.userAgent;e=/^((?!chrome|android).)*safari/i.test(v)===!0;let o=v.match(/Version\/(\d+)/);t=e&&o?parseInt(o[1],10):-1,s=v.indexOf("Firefox")>-1,i=s?v.match(/Firefox\/([0-9]+)\./)[1]:-1}typeof createImageBitmap>"u"||e&&t<17||s&&i<98?this.textureLoader=new us(this.options.manager):this.textureLoader=new ds(this.options.manager),this.textureLoader.setCrossOrigin(this.options.crossOrigin),this.textureLoader.setRequestHeader(this.options.requestHeader),this.fileLoader=new hn(this.options.manager),this.fileLoader.setResponseType("arraybuffer"),this.options.crossOrigin==="use-credentials"&&this.fileLoader.setWithCredentials(!0)}setExtensions(A){this.extensions=A}setPlugins(A){this.plugins=A}parse(A,P){let e=this,t=this.json,s=this.extensions;this.cache.removeAll(),this.nodeCache={},this._invokeAll(function(i){return i._markDefs&&i._markDefs()}),Promise.all(this._invokeAll(function(i){return i.beforeRoot&&i.beforeRoot()})).then(function(){return Promise.all([e.getDependencies("scene"),e.getDependencies("animation"),e.getDependencies("camera")])}).then(function(i){let v={scene:i[0][t.scene||0],scenes:i[0],animations:i[1],cameras:i[2],asset:t.asset,parser:e,userData:{}};return Ct(s,v,t),de(v,t),Promise.all(e._invokeAll(function(o){return o.afterRoot&&o.afterRoot(v)})).then(function(){for(let o of v.scenes)o.updateMatrixWorld();A(v)})}).catch(P)}_markDefs(){let A=this.json.nodes||[],P=this.json.skins||[],e=this.json.meshes||[];for(let t=0,s=P.length;t<s;t++){let i=P[t].joints;for(let v=0,o=i.length;v<o;v++)A[i[v]].isBone=!0}for(let t=0,s=A.length;t<s;t++){let i=A[t];i.mesh!==void 0&&(this._addNodeRef(this.meshCache,i.mesh),i.skin!==void 0&&(e[i.mesh].isSkinnedMesh=!0)),i.camera!==void 0&&this._addNodeRef(this.cameraCache,i.camera)}}_addNodeRef(A,P){P!==void 0&&(A.refs[P]===void 0&&(A.refs[P]=A.uses[P]=0),A.refs[P]++)}_getNodeRef(A,P,e){if(A.refs[P]<=1)return e;let t=e.clone(),s=(i,v)=>{let o=this.associations.get(i);o!=null&&this.associations.set(v,o);for(let[r,D]of i.children.entries())s(D,v.children[r])};return s(e,t),t.name+="_instance_"+A.uses[P]++,t}_invokeOne(A){let P=Object.values(this.plugins);P.push(this);for(let e=0;e<P.length;e++){let t=A(P[e]);if(t)return t}return null}_invokeAll(A){let P=Object.values(this.plugins);P.unshift(this);let e=[];for(let t=0;t<P.length;t++){let s=A(P[t]);s&&e.push(s)}return e}getDependency(A,P){let e=A+":"+P,t=this.cache.get(e);if(!t){switch(A){case"scene":t=this.loadScene(P);break;case"node":t=this._invokeOne(function(s){return s.loadNode&&s.loadNode(P)});break;case"mesh":t=this._invokeOne(function(s){return s.loadMesh&&s.loadMesh(P)});break;case"accessor":t=this.loadAccessor(P);break;case"bufferView":t=this._invokeOne(function(s){return s.loadBufferView&&s.loadBufferView(P)});break;case"buffer":t=this.loadBuffer(P);break;case"material":t=this._invokeOne(function(s){return s.loadMaterial&&s.loadMaterial(P)});break;case"texture":t=this._invokeOne(function(s){return s.loadTexture&&s.loadTexture(P)});break;case"skin":t=this.loadSkin(P);break;case"animation":t=this._invokeOne(function(s){return s.loadAnimation&&s.loadAnimation(P)});break;case"camera":t=this.loadCamera(P);break;default:if(t=this._invokeOne(function(s){return s!=this&&s.getDependency&&s.getDependency(A,P)}),!t)throw new Error("Unknown type: "+A);break}this.cache.add(e,t)}return t}getDependencies(A){let P=this.cache.get(A);if(!P){let e=this,t=this.json[A+(A==="mesh"?"es":"s")]||[];P=Promise.all(t.map(function(s,i){return e.getDependency(A,i)})),this.cache.add(A,P)}return P}loadBuffer(A){let P=this.json.buffers[A],e=this.fileLoader;if(P.type&&P.type!=="arraybuffer")throw new Error("THREE.GLTFLoader: "+P.type+" buffer type is not supported.");if(P.uri===void 0&&A===0)return Promise.resolve(this.extensions[NA.KHR_BINARY_GLTF].body);let t=this.options;return new Promise(function(s,i){e.load(We.resolveURL(P.uri,t.path),s,void 0,function(){i(new Error('THREE.GLTFLoader: Failed to load buffer "'+P.uri+'".'))})})}loadBufferView(A){let P=this.json.bufferViews[A];return this.getDependency("buffer",P.buffer).then(function(e){let t=P.byteLength||0,s=P.byteOffset||0;return e.slice(s,s+t)})}loadAccessor(A){let P=this,e=this.json,t=this.json.accessors[A];if(t.bufferView===void 0&&t.sparse===void 0){let i=wo[t.type],v=Ln[t.componentType],o=t.normalized===!0,r=new v(t.count*i);return Promise.resolve(new fP(r,i,o))}let s=[];return t.bufferView!==void 0?s.push(this.getDependency("bufferView",t.bufferView)):s.push(null),t.sparse!==void 0&&(s.push(this.getDependency("bufferView",t.sparse.indices.bufferView)),s.push(this.getDependency("bufferView",t.sparse.values.bufferView))),Promise.all(s).then(function(i){let v=i[0],o=wo[t.type],r=Ln[t.componentType],D=r.BYTES_PER_ELEMENT,z=D*o,c=t.byteOffset||0,g=t.bufferView!==void 0?e.bufferViews[t.bufferView].byteStride:void 0,B=t.normalized===!0,f,T;if(g&&g!==z){let a=Math.floor(c/g),m="InterleavedBuffer:"+t.bufferView+":"+t.componentType+":"+a+":"+t.count,u=P.cache.get(m);u||(f=new r(v,a*g,t.count*g/D),u=new Qt(f,g/D),P.cache.add(m,u)),T=new nt(u,o,c%g/D,B)}else v===null?f=new r(t.count*o):f=new r(v,c,t.count*o),T=new fP(f,o,B);if(t.sparse!==void 0){let a=wo.SCALAR,m=Ln[t.sparse.indices.componentType],u=t.sparse.indices.byteOffset||0,j=t.sparse.values.byteOffset||0,d=new m(i[1],u,t.sparse.count*a),Q=new r(i[2],j,t.sparse.count*o);v!==null&&(T=new fP(T.array.slice(),T.itemSize,T.normalized)),T.normalized=!1;for(let Y=0,x=d.length;Y<x;Y++){let h=d[Y];if(T.setX(h,Q[Y*o]),o>=2&&T.setY(h,Q[Y*o+1]),o>=3&&T.setZ(h,Q[Y*o+2]),o>=4&&T.setW(h,Q[Y*o+3]),o>=5)throw new Error("THREE.GLTFLoader: Unsupported itemSize in sparse BufferAttribute.")}T.normalized=B}return T})}loadTexture(A){let P=this.json,e=this.options,s=P.textures[A].source,i=P.images[s],v=this.textureLoader;if(i.uri){let o=e.manager.getHandler(i.uri);o!==null&&(v=o)}return this.loadTextureImage(A,s,v)}loadTextureImage(A,P,e){let t=this,s=this.json,i=s.textures[A],v=s.images[P],o=(v.uri||v.bufferView)+":"+i.sampler;if(this.textureCache[o])return this.textureCache[o];let r=this.loadImageSource(P,e).then(function(D){D.flipY=!1,D.name=i.name||v.name||"",D.name===""&&typeof v.uri=="string"&&v.uri.startsWith("data:image/")===!1&&(D.name=v.uri);let c=(s.samplers||{})[i.sampler]||{};return D.magFilter=B8[c.magFilter]||IP,D.minFilter=B8[c.minFilter]||ze,D.wrapS=f8[c.wrapS]||tt,D.wrapT=f8[c.wrapT]||tt,D.generateMipmaps=!D.isCompressedTexture&&D.minFilter!==MP&&D.minFilter!==IP,t.associations.set(D,{textures:A}),D}).catch(function(){return null});return this.textureCache[o]=r,r}loadImageSource(A,P){let e=this,t=this.json,s=this.options;if(this.sourceCache[A]!==void 0)return this.sourceCache[A].then(z=>z.clone());let i=t.images[A],v=self.URL||self.webkitURL,o=i.uri||"",r=!1;if(i.bufferView!==void 0)o=e.getDependency("bufferView",i.bufferView).then(function(z){r=!0;let c=new Blob([z],{type:i.mimeType});return o=v.createObjectURL(c),o});else if(i.uri===void 0)throw new Error("THREE.GLTFLoader: Image "+A+" is missing URI and bufferView");let D=Promise.resolve(o).then(function(z){return new Promise(function(c,g){let B=c;P.isImageBitmapLoader===!0&&(B=function(f){let T=new jP(f);T.needsUpdate=!0,c(T)}),P.load(We.resolveURL(z,s.path),B,void 0,g)})}).then(function(z){return r===!0&&v.revokeObjectURL(o),de(z,i),z.userData.mimeType=i.mimeType||uB(i.uri),z}).catch(function(z){throw console.error("THREE.GLTFLoader: Couldn't load texture",o),z});return this.sourceCache[A]=D,D}assignTexture(A,P,e,t){let s=this;return this.getDependency("texture",e.index).then(function(i){if(!i)return null;if(e.texCoord!==void 0&&e.texCoord>0&&(i=i.clone(),i.channel=e.texCoord),s.extensions[NA.KHR_TEXTURE_TRANSFORM]){let v=e.extensions!==void 0?e.extensions[NA.KHR_TEXTURE_TRANSFORM]:void 0;if(v){let o=s.associations.get(i);i=s.extensions[NA.KHR_TEXTURE_TRANSFORM].extendTexture(i,v),s.associations.set(i,o)}}return t!==void 0&&(i.colorSpace=t),A[P]=i,i})}assignFinalMaterial(A){let P=A.geometry,e=A.material,t=P.attributes.tangent===void 0,s=P.attributes.color!==void 0,i=P.attributes.normal===void 0;if(A.isPoints){let v="PointsMaterial:"+e.uuid,o=this.cache.get(v);o||(o=new En,kP.prototype.copy.call(o,e),o.color.copy(e.color),o.map=e.map,o.sizeAttenuation=!1,this.cache.add(v,o)),e=o}else if(A.isLine){let v="LineBasicMaterial:"+e.uuid,o=this.cache.get(v);o||(o=new jn,kP.prototype.copy.call(o,e),o.color.copy(e.color),o.map=e.map,this.cache.add(v,o)),e=o}if(t||s||i){let v="ClonedMaterial:"+e.uuid+":";t&&(v+="derivative-tangents:"),s&&(v+="vertex-colors:"),i&&(v+="flat-shading:");let o=this.cache.get(v);o||(o=e.clone(),s&&(o.vertexColors=!0),i&&(o.flatShading=!0),t&&(o.normalScale&&(o.normalScale.y*=-1),o.clearcoatNormalScale&&(o.clearcoatNormalScale.y*=-1)),this.cache.add(v,o),this.associations.set(o,this.associations.get(e))),e=o}A.material=e}getMaterialType(){return yP}loadMaterial(A){let P=this,e=this.json,t=this.extensions,s=e.materials[A],i,v={},o=s.extensions||{},r=[];if(o[NA.KHR_MATERIALS_UNLIT]){let z=t[NA.KHR_MATERIALS_UNLIT];i=z.getMaterialType(),r.push(z.extendParams(v,s,P))}else{let z=s.pbrMetallicRoughness||{};if(v.color=new mA(1,1,1),v.opacity=1,Array.isArray(z.baseColorFactor)){let c=z.baseColorFactor;v.color.setRGB(c[0],c[1],c[2],QP),v.opacity=c[3]}z.baseColorTexture!==void 0&&r.push(P.assignTexture(v,"map",z.baseColorTexture,cP)),v.metalness=z.metallicFactor!==void 0?z.metallicFactor:1,v.roughness=z.roughnessFactor!==void 0?z.roughnessFactor:1,z.metallicRoughnessTexture!==void 0&&(r.push(P.assignTexture(v,"metalnessMap",z.metallicRoughnessTexture)),r.push(P.assignTexture(v,"roughnessMap",z.metallicRoughnessTexture))),i=this._invokeOne(function(c){return c.getMaterialType&&c.getMaterialType(A)}),r.push(Promise.all(this._invokeAll(function(c){return c.extendMaterialParams&&c.extendMaterialParams(A,v)})))}s.doubleSided===!0&&(v.side=ZP);let D=s.alphaMode||jo.OPAQUE;if(D===jo.BLEND?(v.transparent=!0,v.depthWrite=!1):(v.transparent=!1,D===jo.MASK&&(v.alphaTest=s.alphaCutoff!==void 0?s.alphaCutoff:.5)),s.normalTexture!==void 0&&i!==De&&(r.push(P.assignTexture(v,"normalMap",s.normalTexture)),v.normalScale=new bA(1,1),s.normalTexture.scale!==void 0)){let z=s.normalTexture.scale;v.normalScale.set(z,z)}if(s.occlusionTexture!==void 0&&i!==De&&(r.push(P.assignTexture(v,"aoMap",s.occlusionTexture)),s.occlusionTexture.strength!==void 0&&(v.aoMapIntensity=s.occlusionTexture.strength)),s.emissiveFactor!==void 0&&i!==De){let z=s.emissiveFactor;v.emissive=new mA().setRGB(z[0],z[1],z[2],QP)}return s.emissiveTexture!==void 0&&i!==De&&r.push(P.assignTexture(v,"emissiveMap",s.emissiveTexture,cP)),Promise.all(r).then(function(){let z=new i(v);return s.name&&(z.name=s.name),de(z,s),P.associations.set(z,{materials:A}),s.extensions&&Ct(t,z,s),z})}createUniqueName(A){let P=$A.sanitizeNodeName(A||"");return P in this.nodeNamesUsed?P+"_"+ ++this.nodeNamesUsed[P]:(this.nodeNamesUsed[P]=0,P)}loadGeometries(A){let P=this,e=this.extensions,t=this.primitiveCache;function s(v){return e[NA.KHR_DRACO_MESH_COMPRESSION].decodePrimitive(v,P).then(function(o){return w8(o,v,P)})}let i=[];for(let v=0,o=A.length;v<o;v++){let r=A[v],D=hB(r),z=t[D];if(z)i.push(z.promise);else{let c;r.extensions&&r.extensions[NA.KHR_DRACO_MESH_COMPRESSION]?c=s(r):c=w8(new pP,r,P),t[D]={primitive:r,promise:c},i.push(c)}}return Promise.all(i)}loadMesh(A){let P=this,e=this.json,t=this.extensions,s=e.meshes[A],i=s.primitives,v=[];for(let o=0,r=i.length;o<r;o++){let D=i[o].material===void 0?jB(this.cache):this.getDependency("material",i[o].material);v.push(D)}return v.push(P.loadGeometries(i)),Promise.all(v).then(function(o){let r=o.slice(0,o.length-1),D=o[o.length-1],z=[];for(let g=0,B=D.length;g<B;g++){let f=D[g],T=i[g],a,m=r[g];if(T.mode===Pe.TRIANGLES||T.mode===Pe.TRIANGLE_STRIP||T.mode===Pe.TRIANGLE_FAN||T.mode===void 0)a=s.isSkinnedMesh===!0?new zs(f,m):new eP(f,m),a.isSkinnedMesh===!0&&a.normalizeSkinWeights(),T.mode===Pe.TRIANGLE_STRIP?a.geometry=fo(a.geometry,Ls):T.mode===Pe.TRIANGLE_FAN&&(a.geometry=fo(a.geometry,Yn));else if(T.mode===Pe.LINES)a=new gs(f,m);else if(T.mode===Pe.LINE_STRIP)a=new dt(f,m);else if(T.mode===Pe.LINE_LOOP)a=new Ts(f,m);else if(T.mode===Pe.POINTS)a=new Bs(f,m);else throw new Error("THREE.GLTFLoader: Primitive mode unsupported: "+T.mode);Object.keys(a.geometry.morphAttributes).length>0&&lB(a,s),a.name=P.createUniqueName(s.name||"mesh_"+A),de(a,s),T.extensions&&Ct(t,a,T),P.assignFinalMaterial(a),z.push(a)}for(let g=0,B=z.length;g<B;g++)P.associations.set(z[g],{meshes:A,primitives:g});if(z.length===1)return s.extensions&&Ct(t,z[0],s),z[0];let c=new mP;s.extensions&&Ct(t,c,s),P.associations.set(c,{meshes:A});for(let g=0,B=z.length;g<B;g++)c.add(z[g]);return c})}loadCamera(A){let P,e=this.json.cameras[A],t=e[e.type];if(!t){console.warn("THREE.GLTFLoader: Missing camera parameters.");return}return e.type==="perspective"?P=new BP(qr.radToDeg(t.yfov),t.aspectRatio||1,t.znear||1,t.zfar||2e6):e.type==="orthographic"&&(P=new Yt(-t.xmag,t.xmag,t.ymag,-t.ymag,t.znear,t.zfar)),e.name&&(P.name=this.createUniqueName(e.name)),de(P,e),Promise.resolve(P)}loadSkin(A){let P=this.json.skins[A],e=[];for(let t=0,s=P.joints.length;t<s;t++)e.push(this._loadNodeShallow(P.joints[t]));return P.inverseBindMatrices!==void 0?e.push(this.getDependency("accessor",P.inverseBindMatrices)):e.push(null),Promise.all(e).then(function(t){let s=t.pop(),i=t,v=[],o=[];for(let r=0,D=i.length;r<D;r++){let z=i[r];if(z){v.push(z);let c=new yA;s!==null&&c.fromArray(s.array,r*16),o.push(c)}else console.warn('THREE.GLTFLoader: Joint "%s" could not be found.',P.joints[r])}return new as(v,o)})}loadAnimation(A){let P=this.json,e=this,t=P.animations[A],s=t.name?t.name:"animation_"+A,i=[],v=[],o=[],r=[],D=[];for(let z=0,c=t.channels.length;z<c;z++){let g=t.channels[z],B=t.samplers[g.sampler],f=g.target,T=f.node,a=t.parameters!==void 0?t.parameters[B.input]:B.input,m=t.parameters!==void 0?t.parameters[B.output]:B.output;f.node!==void 0&&(i.push(this.getDependency("node",T)),v.push(this.getDependency("accessor",a)),o.push(this.getDependency("accessor",m)),r.push(B),D.push(f))}return Promise.all([Promise.all(i),Promise.all(v),Promise.all(o),Promise.all(r),Promise.all(D)]).then(function(z){let c=z[0],g=z[1],B=z[2],f=z[3],T=z[4],a=[];for(let u=0,j=c.length;u<j;u++){let d=c[u],Q=g[u],Y=B[u],x=f[u],h=T[u];if(d===void 0)continue;d.updateMatrix&&d.updateMatrix();let l=e._createAnimationTracks(d,Q,Y,x,h);if(l)for(let p=0;p<l.length;p++)a.push(l[p])}let m=new hs(s,void 0,a);return de(m,t),m})}createNodeMesh(A){let P=this.json,e=this,t=P.nodes[A];return t.mesh===void 0?null:e.getDependency("mesh",t.mesh).then(function(s){let i=e._getNodeRef(e.meshCache,t.mesh,s);return t.weights!==void 0&&i.traverse(function(v){if(v.isMesh)for(let o=0,r=t.weights.length;o<r;o++)v.morphTargetInfluences[o]=t.weights[o]}),i})}loadNode(A){let P=this.json,e=this,t=P.nodes[A],s=e._loadNodeShallow(A),i=[],v=t.children||[];for(let r=0,D=v.length;r<D;r++)i.push(e.getDependency("node",v[r]));let o=t.skin===void 0?Promise.resolve(null):e.getDependency("skin",t.skin);return Promise.all([s,Promise.all(i),o]).then(function(r){let D=r[0],z=r[1],c=r[2];c!==null&&D.traverse(function(g){g.isSkinnedMesh&&g.bind(c,mB)});for(let g=0,B=z.length;g<B;g++)D.add(z[g]);return D})}_loadNodeShallow(A){let P=this.json,e=this.extensions,t=this;if(this.nodeCache[A]!==void 0)return this.nodeCache[A];let s=P.nodes[A],i=s.name?t.createUniqueName(s.name):"",v=[],o=t._invokeOne(function(r){return r.createNodeMesh&&r.createNodeMesh(A)});return o&&v.push(o),s.camera!==void 0&&v.push(t.getDependency("camera",s.camera).then(function(r){return t._getNodeRef(t.cameraCache,s.camera,r)})),t._invokeAll(function(r){return r.createNodeAttachment&&r.createNodeAttachment(A)}).forEach(function(r){v.push(r)}),this.nodeCache[A]=Promise.all(v).then(function(r){let D;if(s.isBone===!0?D=new fn:r.length>1?D=new mP:r.length===1?D=r[0]:D=new nP,D!==r[0])for(let z=0,c=r.length;z<c;z++)D.add(r[z]);if(s.name&&(D.userData.name=s.name,D.name=i),de(D,s),s.extensions&&Ct(e,D,s),s.matrix!==void 0){let z=new yA;z.fromArray(s.matrix),D.applyMatrix4(z)}else s.translation!==void 0&&D.position.fromArray(s.translation),s.rotation!==void 0&&D.quaternion.fromArray(s.rotation),s.scale!==void 0&&D.scale.fromArray(s.scale);if(!t.associations.has(D))t.associations.set(D,{});else if(s.mesh!==void 0&&t.meshCache.refs[s.mesh]>1){let z=t.associations.get(D);t.associations.set(D,{...z})}return t.associations.get(D).nodes=A,D}),this.nodeCache[A]}loadScene(A){let P=this.extensions,e=this.json.scenes[A],t=this,s=new mP;e.name&&(s.name=t.createUniqueName(e.name)),de(s,e),e.extensions&&Ct(P,s,e);let i=e.nodes||[],v=[];for(let o=0,r=i.length;o<r;o++)v.push(t.getDependency("node",i[o]));return Promise.all(v).then(function(o){for(let D=0,z=o.length;D<z;D++)s.add(o[D]);let r=D=>{let z=new Map;for(let[c,g]of t.associations)(c instanceof kP||c instanceof jP)&&z.set(c,g);return D.traverse(c=>{let g=t.associations.get(c);g!=null&&z.set(c,g)}),z};return t.associations=r(s),s})}_createAnimationTracks(A,P,e,t,s){let i=[],v=A.name?A.name:A.uuid,o=[];ot[s.path]===ot.weights?A.traverse(function(c){c.morphTargetInfluences&&o.push(c.name?c.name:c.uuid)}):o.push(v);let r;switch(ot[s.path]){case ot.weights:r=Ee;break;case ot.rotation:r=le;break;case ot.translation:case ot.scale:r=he;break;default:e.itemSize===1?r=Ee:r=he;break}let D=t.interpolation!==void 0?wB[t.interpolation]:ut,z=this._getArrayFromAccessor(e);for(let c=0,g=o.length;c<g;c++){let B=new r(o[c]+"."+ot[s.path],P.array,z,D);t.interpolation==="CUBICSPLINE"&&this._createCubicSplineTrackInterpolant(B),i.push(B)}return i}_getArrayFromAccessor(A){let P=A.array;if(A.normalized){let e=So(P.constructor),t=new Float32Array(P.length);for(let s=0,i=P.length;s<i;s++)t[s]=P[s]*e;P=t}return P}_createCubicSplineTrackInterpolant(A){A.createInterpolant=function(e){let t=this instanceof le?Ro:Gv;return new t(this.times,this.values,this.getValueSize()/3,e)},A.createInterpolant.isInterpolantFactoryMethodGLTFCubicSpline=!0}};function MB(n,A,P){let e=A.attributes,t=new JP;if(e.POSITION!==void 0){let v=P.json.accessors[e.POSITION],o=v.min,r=v.max;if(o!==void 0&&r!==void 0){if(t.set(new y(o[0],o[1],o[2]),new y(r[0],r[1],r[2])),v.normalized){let D=So(Ln[v.componentType]);t.min.multiplyScalar(D),t.max.multiplyScalar(D)}}else{console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.");return}}else return;let s=A.targets;if(s!==void 0){let v=new y,o=new y;for(let r=0,D=s.length;r<D;r++){let z=s[r];if(z.POSITION!==void 0){let c=P.json.accessors[z.POSITION],g=c.min,B=c.max;if(g!==void 0&&B!==void 0){if(o.setX(Math.max(Math.abs(g[0]),Math.abs(B[0]))),o.setY(Math.max(Math.abs(g[1]),Math.abs(B[1]))),o.setZ(Math.max(Math.abs(g[2]),Math.abs(B[2]))),c.normalized){let f=So(Ln[c.componentType]);o.multiplyScalar(f)}v.max(o)}else console.warn("THREE.GLTFLoader: Missing min/max properties for accessor POSITION.")}}t.expandByVector(v)}n.boundingBox=t;let i=new FP;t.getCenter(i.center),i.radius=t.min.distanceTo(t.max)/2,n.boundingSphere=i}function w8(n,A,P){let e=A.attributes,t=[];function s(i,v){return P.getDependency("accessor",i).then(function(o){n.setAttribute(v,o)})}for(let i in e){let v=Wo[i]||i.toLowerCase();v in n.attributes||t.push(s(e[i],v))}if(A.indices!==void 0&&!n.index){let i=P.getDependency("accessor",A.indices).then(function(v){n.setIndex(v)});t.push(i)}return ZA.workingColorSpace!==QP&&"COLOR_0"in e&&console.warn(`THREE.GLTFLoader: Converting vertex colors from "srgb-linear" to "${ZA.workingColorSpace}" not supported.`),de(n,A),MB(n,A,P),Promise.all(t).then(function(){return A.targets!==void 0?EB(n,A.targets,P):n})}var In=document.querySelector("#c"),ct=document.querySelector("#loading"),Fv=document.querySelector("#status"),Ko=document.querySelector("#torchBtn"),kn=document.querySelector("#stick"),m8=document.querySelector("#knob");window.addEventListener("error",n=>{console.error(n.error||n.message),ct&&(ct.style.display="grid",ct.innerHTML="<div><strong>Erro no jogo 3D</strong><small>"+String(n.message||"Erro desconhecido")+"</small></div>")});window.addEventListener("unhandledrejection",n=>{console.error(n.reason),ct&&(ct.style.display="grid",ct.innerHTML="<div><strong>Erro ao carregar recurso 3D</strong><small>"+String(n.reason?.message||n.reason||"Erro desconhecido")+"</small></div>")});var Ve=new Iv({canvas:In,antialias:!0,powerPreference:"high-performance"});Ve.setPixelRatio(Math.min(devicePixelRatio||1,1.5));Ve.outputColorSpace=cP;Ve.toneMapping=Si;Ve.toneMappingExposure=1.08;Ve.shadowMap.enabled=!0;Ve.shadowMap.type=Gi;var ye=new os;ye.background=new mA(132099);ye.fog=new rs(462857,.034);var pe=new BP(70,1,.03,220);pe.rotation.order="YXZ";ye.add(pe);ye.add(new ms(1978405,131842,.18));var M8=new pt(7704736,.34);M8.position.set(-18,30,10);ye.add(M8);var Ns=new mP;ye.add(Ns);var aP={x:0,z:7,yaw:0,bodyYaw:0,pitch:-.035,speed:4.2,radius:.42},be=new Set,Hn={x:0,y:0},Zv=[],Q8=(n,A,P)=>Math.max(A,Math.min(P,n)),V134Base=(n,A)=>.28*Math.sin(n*.075)+.21*Math.cos(A*.095)+.08*Math.sin((n+A)*.16)+.035*Math.sin(n*1.3+A*.6)*Math.cos(A*1.7),V134Sm=(a,b,x)=>{let t=Q8((x-a)/(b-a),0,1);return t*t*(3-2*t)},V134EdgeMask=(n,A)=>Q8((Math.max(Math.abs(n),Math.abs(A))-62)/26,0,1),V134RouteMask=(n,A)=>{let an=Math.abs(n),az=Math.abs(A),s=V134EdgeMask(n,A);if(s<=0)return 0;let along,c,w,k=0,d;if(an>=az){along=A;if(n<0){c=-28+Math.sin(s*6)*8.5;w=5.8;k=1}else{c=12+(s<.36?-8:s<.65?1:9);w=3.2;k=.82}}else{along=n;if(A>0){c=-38+Math.sin(s*5.3+.4)*8;w=5.1;k=1}else{c=-15+Math.sin(s*6.6+1)*8;w=4.7;k=.96}}d=Math.abs(along-c);return k*(1-Q8((d-w)/2.6,0,1))},V134BorderExtra=(n,A)=>{let s=V134EdgeMask(n,A);if(s<=0)return 0;let an=Math.abs(n),az=Math.abs(A),along=an>=az?A:n,h=30*(.12*V134Sm(.02,.16,s)+.22*V134Sm(.16,.32,s)+.25*V134Sm(.34,.52,s)+.23*V134Sm(.55,.74,s)+.18*V134Sm(.76,.95,s));h*=.93+.055*Math.sin(along*.085+1.2)+.035*Math.sin(along*.19+s*6.0);let corner=5*V134Sm(.72,1,an/89)*V134Sm(.72,1,az/89),r=V134RouteMask(n,A);if(r>0){let ramp=19.5*V134Sm(.02,.985,s),b=.96*r;h=h*(1-b)+ramp*b}if(A>0&&az>=an){let notch=11*Math.exp(-Math.pow((n+18)/7.5,2))*V134Sm(.54,.92,s);h=Math.max(0,h-notch)}return Math.max(0,h+corner)},V134TreeBlock=(n,A)=>V134EdgeMask(n,A)>.085,Gn=(n,A)=>window.gameSpiderCave?.active?window.gameSpiderCave.heightAt(n,A):(n>9600&&n<10400&&A>9600&&A<10400?0:V134Base(n,A)+V134BorderExtra(n,A)),Hs=Gn(aP.x,aP.z),Nv=0,Cs=!0,E8=16,QB=5.8;window.__V134_BASE_GROUND__=V134Base;window.__V134_BORDER_MASK__=V134EdgeMask;window.__V134_ROUTE_MASK__=V134RouteMask;window.__V134_BORDER_EXTRA__=V134BorderExtra;function d8(){Cs&&(Cs=!1,Nv=QB)}document.querySelector("#jumpBtn").addEventListener("click",d8);function l8(n,A){if(window.gameSpiderCave?.active)return window.gameSpiderCave.blocked(n,A,aP.radius);for(let P of Zv){let e=n-P.x,t=A-P.z,s=aP.radius+P.r;if(e*e+t*t<s*s)return!0}return!1}function dB(n=731991){let A=n>>>0;return()=>(A=A*1664525+1013904223>>>0)/4294967296}var DP=dB();function bB(){let n=new vt(180,180,128,128),A=n.attributes.position;for(let t=0;t<A.count;t++){let s=A.getX(t),i=A.getY(t);A.setZ(t,Gn(s,-i))}n.computeVertexNormals();let P=new yP({color:1581080,roughness:1}),e=new eP(n,P);e.rotation.x=-Math.PI/2,e.receiveShadow=!0,Ns.add(e)}function YB(){let n=new yP({color:4204314,roughness:1,flatShading:!0}),A=new yP({color:728338,roughness:1,flatShading:!0}),P=new yP({color:3159600,roughness:1,flatShading:!0}),e=new je(.28,.44,13.6,12,10),t=new Es(1.7,3.3,9),s=220,i=new it(e,n,s),v=new it(t,A,s*3);i.castShadow=!0,i.receiveShadow=!0,v.castShadow=!0;let o=new yA,r=new CP,D=new y,z=new y;for(let c=0;c<s;c++){let g,B;do g=(DP()-.5)*150,B=(DP()-.5)*150;while(g*g+(B-5)*(B-5)<46||V134TreeBlock(g,B));let f=.7+DP()*.8,T=Gn(g,B);r.setFromAxisAngle(new y(0,1,0),DP()*Math.PI*2),D.set(g,T+6.8*f,B),z.set(f,f,f),o.compose(D,r,z),i.setMatrixAt(c,o);for(let a=0;a<3;a++){let m=f*(1-a*.1)*(1+DP()*.12);D.set(g+(DP()-.5)*.35*f,T+(10.3+a*1.25)*f,B+(DP()-.5)*.35*f),z.set(m,m,m),o.compose(D,r,z),v.setMatrixAt(c*3+a,o)}Zv.push({x:g,z:B,r:.35*f})}Ns.add(i,v);for(let c=0;c<60;c++){let g=(DP()-.5)*125,B=(DP()-.5)*125,f=.25+DP()*.8,T=new eP(new ln(1,1),P);T.scale.set(f,f*(.42+DP()*.35),f),T.position.set(g,Gn(g,B)+f*.3,B),T.rotation.set(DP()*2,DP()*3,DP()*2),T.castShadow=!0,T.receiveShadow=!0,Ns.add(T),f>.65&&Zv.push({x:g,z:B,r:f*.55})}}var b8=[];function pB(n){let A=new VP({transparent:!0,depthWrite:!1,side:ZP,blending:un,uniforms:{time:{value:0},seed:{value:n},wind:{value:0}},vertexShader:`
      varying vec2 vUv;
      uniform float time,seed,wind;
      void main(){
        vUv=uv;
        vec3 p=position;
        float y=uv.y;
        p.x+=sin(time*5.1+y*9.0+seed)*.05*y;
        p.x+=sin(time*9.0+y*17.0+seed*2.0)*.018*y;
        p.x+=wind*y*y;
        gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);
      }`,fragmentShader:`
      varying vec2 vUv;
      uniform float time,seed;
      float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
      float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1.,0.)),f.x),mix(h(i+vec2(0.,1.)),h(i+vec2(1.,1.)),f.x),f.y);}
      void main(){
        float y=vUv.y;
        float q=n(vec2(vUv.x*5.+seed,vUv.y*7.-time*2.7));
        float x=abs(vUv.x-.5-sin(y*8.+time*4.5+seed)*.065*y);
        float w=mix(.33,.022,pow(y,.72))*(.86+q*.28);
        float body=1.-smoothstep(w,w+.048,x);
        float a=body*smoothstep(0.,.055,y)*(1.-smoothstep(.87,1.,y));
        float core=1.-smoothstep(w*.23,w*.5,x);
        vec3 c=mix(vec3(1.,.055,.002),vec3(1.,.29,.014),1.-y*.55);
        c=mix(c,vec3(1.,.78,.13),core*.82);
        c=mix(c,vec3(1.,.99,.78),core*core*(1.-y));
        gl_FragColor=vec4(c,a);
      }`});return b8.push(A),A}function yB(){let n=document.createElement("canvas");n.width=n.height=128;let A=n.getContext("2d"),P=A.createRadialGradient(64,64,0,64,64,64);P.addColorStop(0,"rgba(255,248,190,.95)"),P.addColorStop(.15,"rgba(255,170,60,.72)"),P.addColorStop(.45,"rgba(255,70,10,.25)"),P.addColorStop(1,"rgba(255,40,0,0)"),A.fillStyle=P,A.fillRect(0,0,128,128);let e=new fs(n);return e.colorSpace=cP,e}function Y8(n,A,P,e,t=.48,s=1.25,i=7){let v=new mP;n.add(v);for(let r=0;r<i;r++){let D=new eP(new vt(t*(.9+DP()*.2),s*(.9+DP()*.25)),pB(r*1.73+DP()));D.position.set(A+(DP()-.5)*.025,P+(DP()-.5)*.025,e+(DP()-.5)*.025),D.rotation.y=r*Math.PI/i,v.add(D)}let o=new Ds(new Bn({map:yB(),transparent:!0,blending:un,depthWrite:!1}));return o.position.set(A,P-.08,e),o.scale.set(1.8,2.2,1),v.add(o),v}function xB(){let n=new mP,A=-2.7,P=1.25,e=Gn(A,P),t=new yP({color:3684916,roughness:1,flatShading:!0}),s=new yP({color:4926747,roughness:1,flatShading:!0});for(let o=0;o<11;o++){let r=o/11*Math.PI*2,D=new eP(new ln(.28,1),t);D.position.set(Math.cos(r)*.78,.16,Math.sin(r)*.78),D.scale.y=.63,D.rotation.set(DP()*2,DP()*3,DP()*2),n.add(D)}for(let o=0;o<6;o++){let r=new eP(new je(.1,.14,1.48,9),s);r.position.y=.24,r.rotation.z=Math.PI/2,r.rotation.y=o*Math.PI/6,n.add(r)}Y8(n,0,.9,0,.62,1.45,12),n.position.set(A,e,P),Ns.add(n),Zv.push({x:A,z:P,r:.9});let i=new me(16734995,33,40,1.05);i.position.set(A,e+1.15,P),i.castShadow=!0,i.shadow.mapSize.set(512,512),ye.add(i);let v=new me(16761202,10,23,1.35);return v.position.set(A,e+.55,P),ye.add(v),{light:i,fill:v}}bB();YB();var h8=xB(),Nt=new mP;pe.add(Nt);var Dt=null;var ae=null,_o=null,zt=null,Fs=null;var Ft=!0,Ye=!0,$o=document.querySelector("#equipBtn");function tD(){Nt.visible=Ye,ae&&(ae.visible=Ye),_o&&(_o.visible=Ye&&Ft),zt&&(zt.visible=Ye&&Ft),Fs&&(Fs.visible=Ye&&Ft),Ko.disabled=!Ye,Ko.textContent=Ft?"Apagar tocha":"Acender tocha",$o.textContent=Ye?"Guardar tocha (E)":"Equipar tocha (E)",$o.setAttribute("aria-pressed",String(Ye))}function p8(){Ye=!Ye,tD()}$o.addEventListener("click",p8);function OB(){ae=new mP;let n=new yP({color:5977375,roughness:1,flatShading:!0}),A=new yP({color:2101771,roughness:1,flatShading:!0}),P=new eP(new je(.035,.047,.85,10,4),n);P.position.y=.34,P.castShadow=!0,ae.add(P);let e=new eP(new je(.051,.054,.32,10),A);e.position.y=.06,ae.add(e);let t=new eP(new je(.085,.065,.24,10),A);return t.position.y=.8,ae.add(t),_o=Y8(ae,0,1.16,0,.35,.9,7),zt=new me(16741407,24,34,1.08),zt.position.set(0,1,0),zt.castShadow=!0,zt.shadow.mapSize.set(512,512),ae.add(zt),Fs=new me(16761210,5.5,10,1.45),Fs.position.set(0,.35,.15),ae.add(Fs),ae}function LB(){let n=OB();n.position.set(-.62,-.52,-1.07),n.rotation.set(0,0,.018),Nt.add(n)}async function IB(){LB();window.gameReview={teleport186(x,z,yaw=0){aP.x=x;aP.z=z;aP.yaw=yaw;aP.bodyYaw=yaw;aP.pitch=0;Hs=Gn(x,z);Nv=0;Cs=true;},get physics186(){return {height:Hs,velocity:Nv,grounded:Cs}},scene:ye,camera:pe,renderer:Ve,armsRoot:null,viewmodel:Nt,torchRoot:ae,player:aP,groundY:Gn,colliders:Zv,collides:l8,keys:be,stick:Hn,isEquipped:()=>Ye,isTorchLit:()=>Ft,clock:u8,tick:AD};}var u8=new bs,Gs=0,Xv=0,Jo=0,Vo=0,qo=0,Cv=0;function y8(){let n=innerWidth,A=innerHeight;Ve.setSize(n,A,!1),pe.aspect=n/A,pe.updateProjectionMatrix()}addEventListener("resize",y8);y8();function AD(){requestAnimationFrame(AD);let n=Math.min(u8.getDelta(),.035),A=u8.elapsedTime,P=Hn.x,e=Hn.y;(be.has("KeyW")||be.has("ArrowUp"))&&(e-=1),(be.has("KeyS")||be.has("ArrowDown"))&&(e+=1),(be.has("KeyA")||be.has("ArrowLeft"))&&(P-=1),(be.has("KeyD")||be.has("ArrowRight"))&&(P+=1);let t=Math.hypot(P,e);t>1&&(P/=t,e/=t);let s=Math.hypot(P,e)>.05;window.gameRoll?.active&&(P=0,e=0,s=!1);window.__prepareAnimatedAvatar?.(n,s);let v134ox=aP.x,v134oz=aP.z;if(s){let B=Math.sin(aP.bodyYaw??aP.yaw),f=Math.cos(aP.bodyYaw??aP.yaw),T=(P*f+e*B)*aP.speed*n,a=(e*f-P*B)*aP.speed*n;l8(aP.x+T,aP.z)||(aP.x+=T),l8(aP.x,aP.z+a)||(aP.z+=a)}let v134nav=window.gameSpiderCave?.active?null:window.gameBorderMountains;if(v134nav?.blockMove?.(v134ox,v134oz,aP.x,aP.z,Hs,Cs)){aP.x=v134ox;aP.z=v134oz}let v134g=Gn(aP.x,aP.z),i=v134nav?.heightAt?.(aP.x,aP.z,v134g,Hs,Cs,Nv)??v134g;if(Cs&&window.gameSpiderCave?.active&&Hs-i>.8){Cs=!1;Nv=0;}if(Cs&&v134nav?.consumeLeftSupport?.()){Cs=!1;Nv=0;i=v134g}Cs?Hs=i:(Hs+=Nv*n-.5*E8*n*n,Nv-=E8*n,Hs<=i&&(Hs=i,Nv=0,Cs=!0));let v=Cs?s?Math.sin(A*8.15)*.025:Math.sin(A*1.4)*.0035:0;window.__updateAnimatedAvatar||(pe.position.set(aP.x,Hs+1.68+v,aP.z),pe.rotation.y=aP.yaw,pe.rotation.x=aP.pitch),Gs*=Math.exp(-n*8.5),Xv*=Math.exp(-n*8.5);let o=(s?Math.sin(A*4.075)*.014:0)-Gs*75e-5,r=(s?-Math.abs(Math.sin(A*8.15))*.014:Math.sin(A*1.4)*.004)+Xv*65e-5,D=(s?Math.sin(A*8.15)*.008:0)-Xv*42e-5,z=(s?Math.sin(A*4.075)*.009:0)-Gs*42e-5,c=1-Math.exp(-n*10);Jo+=(o-Jo)*c,Vo+=(r-Vo)*c,qo+=(D-qo)*c,Cv+=(z-Cv)*c,Nt.position.set(Jo,Vo,0),Nt.rotation.set(qo,Cv,s?Math.sin(A*4.075)*.008:0);let g=Q8(Math.hypot(P,e)*.08+Math.abs(Gs)*4e-4,-.11,.11);b8.forEach((B,f)=>{B.uniforms.time.value=A+f*.025,B.uniforms.wind.value=g*Math.sin(f+1.1)}),ae&&Ft&&(zt.intensity=23+Math.sin(A*12.5)*2.1+Math.sin(A*28)*.8,ae.rotation.z=Math.sin(A*4.2)*.012-Cv*.5),h8.light.intensity=31+Math.sin(A*8.1)*3.4+Math.sin(A*18.5)*1.4,h8.fill.intensity=10.4+Math.sin(A*10)*.8,window.__updateAnimatedAvatar?.(A,s,n,Hs,Cs,Nv);try{window.__FLORESTA_CART_PUSH_RENDER?.(A,s,n,Hs,Cs,Nv)}catch(_cartRenderError){if(!window.__cartV253ErrorLogged){window.__cartV253ErrorLogged=true;console.error('[V253 Carrinho] Erro ao aplicar animações:',_cartRenderError)}}try{try{window.gameBlood226?.beforeRender?.()}catch(_bloodError){if(!window.__blood226Error){window.__blood226Error=true;console.warn("V226: efeitos de sangue desativados apos erro",_bloodError)}window.gameBlood226?.setQuality?.("desligado")}window.gameCamera225?.beforeRender?.(ye,pe);Ve.render(ye,pe)}finally{window.gameCamera225?.afterRender?.()}}function x8(){Ye&&(Ft=!Ft,tD())}Ko.addEventListener("click",x8);addEventListener("keydown",n=>{if(n.code==="Space"){n.repeat||d8(),n.preventDefault();return}if(n.code==="KeyE"){n.repeat||p8(),n.preventDefault();return}if(n.code==="KeyF"){n.repeat||x8(),n.preventDefault();return}["KeyW","KeyA","KeyS","KeyD","ArrowUp","ArrowDown","ArrowLeft","ArrowRight","ShiftLeft","ShiftRight","ControlLeft","ControlRight","KeyC"].includes(n.code)&&(be.add(n.code),n.preventDefault())});addEventListener("keyup",n=>be.delete(n.code));var Cn=null,PD=0,eD=0;In.addEventListener("pointerdown",n=>{n.pointerType==="mouse"&&n.button!==0||n.clientX<160&&n.clientY>innerHeight-160&&matchMedia("(pointer:coarse)").matches||(Cn=n.pointerId,PD=n.clientX,eD=n.clientY,In.setPointerCapture?.(n.pointerId))});In.addEventListener("pointermove",n=>{if(n.pointerId!==Cn)return;let A=n.clientX-PD,P=n.clientY-eD;PD=n.clientX,eD=n.clientY,aP.yaw-=A*.004,aP.pitch=Q8(aP.pitch-P*.0035,-Math.PI*88/180,Math.PI*78/180),Gs+=A,Xv+=P});In.addEventListener("pointerup",n=>{n.pointerId===Cn&&(Cn=null)});In.addEventListener("pointercancel",n=>{n.pointerId===Cn&&(Cn=null)});var Rv=null;function O8(n){let A=kn.getBoundingClientRect(),P=A.left+A.width/2,e=A.top+A.height/2,t=n.clientX-P,s=n.clientY-e,i=A.width*.32,v=Math.hypot(t,s)||1,o=Math.min(1,i/v),r=t*o,D=s*o;m8.style.transform=`translate(${r}px,${D}px)`,Hn.x=r/i,Hn.y=D/i}kn.addEventListener("pointerdown",n=>{Rv=n.pointerId,kn.setPointerCapture?.(n.pointerId),O8(n),n.stopPropagation()});kn.addEventListener("pointermove",n=>{n.pointerId===Rv&&O8(n)});function L8(n){n.pointerId===Rv&&(Rv=null,Hn.x=Hn.y=0,m8.style.transform="translate(0,0)")}kn.addEventListener("pointerup",L8);kn.addEventListener("pointercancel",L8);window.__FOREST_GLTF_LOADER=Hv;try{await IB(),tD(),Fv.textContent=Fv.textContent+" \u2022 cena pronta",ct.remove(),AD()}catch(n){console.error(n),ct.innerHTML="<div><strong>Falha ao carregar a malha 3D.</strong><small>"+String(n?.message||n)+"</small></div>",Fv.textContent="A floresta est\xE1 pronta, mas o GLB externo n\xE3o carregou.",AD()}
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2025 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/

addEventListener("blur",()=>{be.clear();Hn.x=Hn.y=0;});
}catch(err){
  console.error("V48 classic boot:",err);
  const s=document.getElementById("status");
  if(s)s.textContent="ERRO V48: "+String(err?.message||err);
}
})();
