import * as THREE from "three";
/**
 * Unique, visually distinct 3D apparatus compositions for remaining NIE experiments.
 * Visual teaching models only; no claim of physically-calibrated instrument dynamics.
 * Returns false for the detailed apparatus already implemented in lab3d.js.
 */
export function buildDistinctApparatus(scene,p,v,root){
 const id=p.id;
 if(new Set(["01","02","03","04","10","12","17","31"]).has(id))return false;
 const c={
  chrome:0xdce7f0,black:0x18273a,steel:0x8da7b8,wood:0x9a6f45,
  glass:0x86d9eb,water:0x1bafe0,brass:0xf1bd68,teal:0x48e2b9,
  lilac:0xac91f6,coral:0xff837d,blue:0x619df1,ice:0xcaf2fb,
  ceramic:0xe2e8ed,red:0xeb5c58,amber:0xf8ab52};
 const material=(col,metal=.2,rough=.34,extra={})=>new THREE.MeshPhysicalMaterial({color:col,metalness:metal,roughness:rough,clearcoat:metal>.55?.28:.12,clearcoatRoughness:.23,...extra});
 const m={
  steel:material(c.steel,.82,.23),chrome:material(c.chrome,.91,.18),
  black:material(c.black,.32,.44),wood:material(c.wood,.08,.62),
  glass:material(c.glass,.02,.08,{transparent:true,opacity:.33,depthWrite:false,side:THREE.DoubleSide,clearcoat:1,clearcoatRoughness:.07}),
  water:material(c.water,.03,.11,{transparent:true,opacity:.66,clearcoat:1}),
  brass:material(c.brass,.78,.22),teal:material(c.teal,.33,.24),
  lilac:material(c.lilac,.39,.25),red:material(c.coral,.29,.24),
  ceramic:material(c.ceramic,.06,.36),ice:material(c.ice,.04,.15,{transparent:true,opacity:.84,clearcoat:.8})
 };
 const mesh=(geo,mat,x=0,y=0,z=0,group=root)=>{const o=new THREE.Mesh(geo,mat);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;group.add(o);return o};
 const box=(w,h,d,x,y,z,mat=m.steel)=>mesh(new THREE.BoxGeometry(w,h,d),mat,x,y,z);
 const cyl=(r1,r2,h,x,y,z,mat=m.chrome)=>mesh(new THREE.CylinderGeometry(r1,r2,h,32),mat,x,y,z);
 const sphere=(r,x,y,z,mat=m.brass)=>mesh(new THREE.SphereGeometry(r,28,20),mat,x,y,z);
 const tor=(r,t,x,y,z,mat=m.brass)=>mesh(new THREE.TorusGeometry(r,t,9,52),mat,x,y,z);
 const rod=(a,b,r=.035,mat=m.chrome)=>{const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),D=B.clone().sub(A),o=mesh(new THREE.CylinderGeometry(r,r,D.length(),14),mat,...A.add(B).multiplyScalar(.5).toArray());o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),D.normalize());return o};
 const cone=(r,h,x,y,z,mat=m.chrome)=>mesh(new THREE.ConeGeometry(r,h,28),mat,x,y,z);
 const text=(s,x,y,z,color="#e7f7ff",scale=1)=>{
  const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;
  const ctx=canvas.getContext("2d");ctx.clearRect(0,0,512,96);
  ctx.fillStyle=color;ctx.font="700 34px Arial";ctx.fillText(s.slice(0,27),8,53);
  const texture=new THREE.CanvasTexture(canvas);
  const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));
  sprite.position.set(x,y,z);sprite.scale.set(3.5*scale,.63*scale,1);root.add(sprite);return sprite
 };
 const base=(w=5.4,d=3.1,mat=m.wood)=>{box(w,.18,d,0,.38,0,mat);for(const x of [-w/2+.22,w/2-.22])for(const z of [-d/2+.25,d/2-.25])cyl(.035,.035,.12,x,.26,z,m.chrome)};
 const stand=(x=0,z=0,height=3)=>{box(1.5,.14,.8,x,.48,z,m.black);rod([x,.55,z],[x,.55+height,z],.075,m.chrome);box(.8,.18,.38,x,1.2+height*.6,z,m.black)};
 const ruler=(x=0,y=.74,z=0,len=4)=>{box(len,.075,.36,x,y,z,m.chrome);for(let i=0;i<=40;i++){const xx=x-len/2+i*len/40;box(.012,.008,i%5===0?.32:.17,xx,y+.045,z,m.black)}};
 const vessel=(x=0,z=0,level=.5,r=.65,height=1.4)=>{cyl(r,r*.84,height,x,.45+height/2,z,m.glass);cyl(r*.9,r*.85,Math.max(.03,height*level),x,.47+height*level/2,z,m.water);tor(r,.026,x,.45+height,z,m.chrome).rotation.x=Math.PI/2};
 const thermometer=(x=0,z=0,length=1.9)=>{rod([x,.6,z],[x,.6+length,z],.028,m.chrome);sphere(.09,x,.67,z,m.red);for(let i=0;i<12;i++)box(.11,.013,.045,x+.06,.87+i*.11,z,m.red)};
 const string=(a,b)=>rod(a,b,.012,m.ceramic);
 const load=(x,y,z,r=.25)=>{cyl(r,r,.38,x,y,z,m.brass);tor(r*.5,.035,x,y+.26,z,m.chrome).rotation.x=Math.PI/2};
 const glassTube=(x,z,y1=.57,y2=2.9,r=.15)=>{cyl(r,r,y2-y1,x,(y1+y2)/2,z,m.glass);tor(r,.017,x,y2,z,m.chrome).rotation.x=Math.PI/2};
 const lead=(a,b,color=m.red)=>rod(a,b,.027,color);
 const meter=(x,z,type="V")=>{box(.95,.7,.4,x,.8,z,m.black);cyl(.24,.24,.04,x,.87,z+.22,m.ceramic).rotation.x=Math.PI/2;text(type,x,.9,z+.42,"#dcfffd",.35)};
 const power=(x,z)=>{box(.95,.57,.56,x,.72,z,m.black);box(.7,.24,.02,x,.85,z+.29,m.teal);cyl(.085,.085,.08,x-.28,.55,z+.33,m.red);cyl(.085,.085,.08,x+.28,.55,z+.33,m.chrome)};
 const prism=(x=0,y=1.2,z=0)=>{const o=mesh(new THREE.CylinderGeometry(.83,.83,1.45,3),m.glass,x,y,z);o.rotation.y=.47;return o};
 const lightRay=(a,b,color=m.red)=>rod(a,b,.023,color);
 const lens=(x,z,type="convex")=>{const o=sphere(.78,x,1.7,z,m.glass);o.scale.set(type==="convex"?.18:.11,1,.82);rod([x,.55,z],[x,.95,z],.055,m.chrome);return o};
 const resistor=(x,z)=>{cyl(.16,.16,.75,x,1.2,z,m.brass).rotation.z=Math.PI/2;for(let i=0;i<3;i++)tor(.16,.02,x-.2+i*.2,1.2,z,i%2?m.black:m.red).rotation.y=Math.PI/2};
 const battery=(x,z)=>{cyl(.22,.22,.72,x,.85,z,m.black);cyl(.22,.22,.07,x,1.24,z,m.brass);cyl(.08,.08,.08,x,1.29,z,m.chrome)};
 const wires=(a,b)=>{rod(a,b,.035,m.red)};
 const dial=(x,y,z,r=.55)=>{const disc=cyl(r,r,.08,x,y,z,m.chrome);for(let i=0;i<30;i++){const a=2*Math.PI*i/30;rod([x+Math.cos(a)*r*.78,y+.05,z+Math.sin(a)*r*.78],[x+Math.cos(a)*r*.94,y+.05,z+Math.sin(a)*r*.94],.006,m.black)}return disc};
 const dots=(number,fn)=>{for(let i=0;i<number;i++)fn(i)};
 const title=()=>{
  text(p.title.length>28?p.title.slice(0,28):p.title,0,3.95,0,"#f2f8ff",.9);
  text("EXPERIMENT "+id+"  /  PHYS·LAB",0,.19,1.95,"#96f5d9",.6);
 };
 switch(id){
 case "05":base();stand(-2,-.75);stand(2,-.75);tor(.26,.075,0,2,0,m.brass);for(let i=0;i<3;i++){const a=-.2+i*2.1;const ex=1.6*Math.cos(a),ez=1.1*Math.sin(a);string([0,2,0],[ex,2.15,ez]);load(ex,1.43,ez,.21)}text("VECTOR FORCE BOARD",0,3.2,0);break;
 case "06":base();stand(0,-.5);rod([-2.2,2.35,.1],[2.2,2.35,.1],.12,m.brass);cone(.45,.53,0,1.9,.1,m.steel);for(const x of [-1.5,1.15]){string([x,2.28,.1],[x,1.35,.1]);load(x,1.19,.1)}ruler(0,2.47,.1,4.4);text("MOMENT BALANCE",0,3.25,.3);break;
 case "07":base();for(let x of [-.65,.65]){glassTube(x,0,.74,3,.15);cyl(.12,.12,x<0?1.14:1.43,x,1.12,0,x<0?m.teal:m.water)}const bridge=tor(.65,.15,0,.75,0,m.water);bridge.rotation.x=Math.PI;vessel(1.85,.5,.45,.36,.73);text("TWO IMMISCIBLE LIQUIDS",0,3.4,0);break;
 case "08":base();for(const x of [-1.2,1.2]){vessel(x,.4,.55,.46,.76);glassTube(x,.4,.62,3.18,.11);cyl(.085,.085,x<0?1.02:1.31,x,1.12,.4,x<0?m.teal:m.water)}glassTube(0,.4,2.8,3.4,.13);lead([-1.2,3.1,.4],[1.2,3.1,.4],m.chrome);sphere(.25,0,3.05,.4,m.black);text("HARE'S SUCTION APPARATUS",0,3.75,0);break;
 case "09":base();vessel(0,0,.75,.9,1.82);cyl(.16,.16,1.5,.05,1.9,0,m.glass);cyl(.15,.15,.55,.05,1.37,0,m.brass);load(1.6,.85,0,.21);text("WEIGHTED FLOATING TUBE",0,3.45,0);break;
 case "11":base();stand(0,-1,2.7);for(let i=0;i<17;i++){const a=i*Math.PI*.85;rod([.2*Math.cos(a),3.35-i*.087,0+.2*Math.sin(a)],[.2*Math.cos(a+.85*Math.PI),3.26-i*.087,.2*Math.sin(a+.85*Math.PI)],.035,m.chrome)}load(0,1.45,0,.35);ruler(1.25,1.3,0,2);text("HELICAL SPRING / OSCILLATION",0,3.8,0);break;
 case "13":base(6,2.5);box(5.6,.28,1.25,0,.65,0,m.wood);for(let z of [-.35,.3])rod([-2.5,1.02,z],[2.5,1.02,z],.019,m.brass);for(let x of [-1.65,1.4])box(.16,.43,.8,x,1.01,0,m.chrome);ruler(0,.94,.92,5);load(2.4,.6,1,.28);text("VARIABLE BRIDGE / STRING",0,2.7,0);break;
 case "14":base();vessel(0,0,.48,.78,1.5);glassTube(0,0,.58,3.3,.28);for(let i=0;i<5;i++){const r=.17+i*.03;tor(r,.012,0,2.1-i*.23,0,m.teal).rotation.x=Math.PI/2}rod([-1.3,2.15,0],[-1.3,3.3,0],.05,m.chrome);rod([-.95,2.15,0],[-.95,3.3,0],.05,m.chrome);text("SINGLE TUNING FORK",0,3.7,0);break;
 case "15":base();vessel(-.5,0,.52,.69,1.54);glassTube(-.5,0,.6,3.25,.27);for(let j=0;j<3;j++){let x=.85+j*.5;rod([x,1.6,0],[x,2.9-j*.3,0],.055,m.chrome);rod([x+.17,1.6,0],[x+.17,2.9-j*.3,0],.055,m.chrome);tor(.16,.02,x+.08,1.5,0,m.brass)}text("MULTI-FORK RESONANCE",0,3.68,0);break;
 case "16":base();stand(-1.4,-.7);vessel(.65,0,.5,.9,1.3);rod([-1.4,2.7,-.7],[.1,2.7,-.7],.12,m.chrome);cyl(.36,.36,1.35,.1,2.3,-.7,m.black).rotation.z=Math.PI/2;cyl(.25,.25,.24,.83,2.3,-.7,m.chrome).rotation.z=Math.PI/2;box(.75,.1,.6,.65,1.7,0,m.glass);text("APPARENT DEPTH MICROSCOPE",0,3.4,0);break;
 case "18":base();prism();cyl(1.45,1.45,.05,0,.57,0,m.ceramic);dots(36,i=>{const a=i*Math.PI/18;box(.03,.02,.11,Math.cos(a)*1.3,.62,Math.sin(a)*1.3,m.black)});lightRay([-2.5,1.65,.2],[-.7,1.65,.2],m.red);lightRay([-.7,1.65,.2],[.5,1.75,.4],m.brass);lightRay([.5,1.75,.4],[2.4,2.4,.55],m.teal);text("CRITICAL ANGLE / TIR",0,3.4,0);break;
 case "19":base();cyl(1.5,1.5,.12,0,1.15,0,m.chrome);dial(0,1.26,0,1.2);prism(0,1.82,0);for(const x of [-2,2]){rod([x,1.7,0],[x>0?.75:-.75,1.7,0],.14,m.black);cyl(.28,.28,.35,x,1.7,0,m.chrome).rotation.z=Math.PI/2}text("SPECTROMETER / TELESCOPE",0,3.45,0);break;
 case "20":base();cyl(1.32,1.32,.13,0,1.1,0,m.chrome);dial(0,1.2,0,1.15);prism(0,1.65,0);for(const z of [-1.9,1.9]){rod([-2,1.7,z],[-.1,1.7,z/3],.1,m.black)}lightRay([-2.3,1.8,.3],[-.3,1.7,.2],m.red);lightRay([.35,1.7,.2],[2.5,1.55,.7],m.teal);text("MINIMUM DEVIATION SCAN",0,3.45,0);break;
 case "21.1":base();ruler(0,.63,0,5.2);lens(0,0);rod([-2,1.05,0],[-2,2.3,0],.045,m.red);rod([2,1.05,0],[2,2.5,0],.055,m.chrome);lightRay([-2,2.25,0],[0,2.25,0],m.red);lightRay([0,2.25,0],[2,1.65,0],m.teal);text("CONVEX LENS / NO PARALLAX",0,3.4,0);break;
 case "21.2":base();ruler(0,.63,0,5.2);lens(-.5,0,"concave");lens(1.1,0);rod([-2.1,1,0],[-2.1,2.1,0],.045,m.brass);lightRay([-2.2,2.1,0],[-.5,1.92,0],m.red);lightRay([-.5,1.92,0],[1.1,2.18,0],m.red);text("CONCAVE + CONVEX LENSES",0,3.4,0);break;
 case "22":base();stand(-1.5,-.65);glassTube(0,0,.66,3.15,.09);cyl(.07,.07,.5,0,1.9,0,m.brass);ruler(.85,1.3,0,2.6);box(.55,.33,.75,1.75,.7,0,m.black);text("TRAPPED AIR / QUILL TUBE",0,3.65,0);break;
 case "23":base();vessel(0,0,.55,.85,1.6);glassTube(.2,0,.65,3.25,.12);cyl(.095,.095,.45,.2,1.45,0,m.red);thermometer(1.2,0,2);box(1.3,.25,1.1,0,.42,0,m.black);text("CHARLES LAW / WATER BATH",0,3.6,0);break;
 case "24":base();cyl(.57,.57,2.15,0,1.75,0,m.glass);cyl(.55,.55,.16,0,2.69,0,m.brass);rod([0,2.75,0],[0,3.5,0],.06,m.chrome);meter(1.8,0,"P");lead([.6,2.55,0],[1.8,1.05,0],m.teal);thermometer(-1.5,0);text("PRESSURE LAW / GAUGE",0,3.85,0);break;
 case "25":base();vessel(0,0,.68,.83,1.5);cyl(.27,.27,.42,0,1.28,0,m.brass);thermometer(.7,0,2.3);box(1,.3,1,-1.8,.63,0,m.ceramic);text("HEAT CAPACITY / MIXTURES",0,3.65,0);break;
 case "26":base();vessel(-.65,0,.75,.72,1.6);thermometer(-.25,0,2.5);box(1.5,.21,1.1,1.65,.55,0,m.black);cyl(.28,.28,.26,1.65,.82,0,m.red);text("COOLING CURVE / CALORIMETER",0,3.7,0);break;
 case "27":base();vessel(0,0,.65,.83,1.6);for(let i=0;i<5;i++)box(.24,.24,.24,-.4+i*.2,1.34,0,m.ice);thermometer(.88,0,2.1);text("LATENT HEAT / MELTING ICE",0,3.6,0);break;
 case "28":base();vessel(.75,0,.65,.8,1.7);box(1.3,.28,1,-1.65,.6,0,m.black);vessel(-1.65,0,.9,.37,1.15);for(let i=0;i<3;i++){tor(.2+i*.05,.016,-1.65,2.1+i*.26,0,m.ice).rotation.x=Math.PI/2}rod([-1.65,2.2,0],[.75,1.48,0],.06,m.chrome);text("STEAM CONDENSATION",0,3.6,0);break;
 case "29":base();vessel(0,0,.5,.9,1.58);thermometer(.8,0,2.2);box(1,.6,.62,-1.8,.9,0,m.chrome);for(let i=0;i<10;i++)sphere(.03,-1.5+(i%5)*.11,1.3+Math.floor(i/5)*.12,0,m.water);text("DEW POINT / HUMIDITY",0,3.7,0);break;
 case "30":base(6,3.5);rod([-2.5,1.75,0],[2.3,1.75,0],.23,m.brass);vessel(-1.85,.6,.6,.5,.95);vessel(1.85,.6,.6,.5,.95);thermometer(-.4,.16,1.7);thermometer(1.05,.16,1.7);text("SEARLE THERMAL CONDUCTIVITY",0,3.7,0);break;
 case "32":base(6,3);box(5.45,.26,1.4,0,.58,0,m.wood);for(let z of [-.45,.4])rod([-2.5,.95,z],[2.5,.95,z],.025,m.brass);box(.2,.38,.7,1.2,.93,0,m.black);meter(-1.5,1.15,"G");thermometer(2.25,1.15,1.75);text("METRE BRIDGE / COPPER WIRE",0,3.1,0);break;
 case "33":base(6,3);box(5.6,.22,1.3,0,.62,0,m.wood);rod([-2.45,.9,0],[2.45,.9,0],.023,m.brass);for(let x of [-2,-1.1])battery(x,-.8);meter(1.2,-.8,"G");rod([.35,.96,0],[.35,1.45,0],.04,m.chrome);text("DUAL EMF POTENTIOMETER",0,3,0);break;
 case "34":base(6,3);box(5.4,.22,1.2,0,.62,0,m.wood);rod([-2.4,.9,0],[2.4,.9,0],.024,m.brass);battery(-1.8,-.85);resistor(-.2,-.85);meter(1.4,-.8,"G");lead([-1.8,1.22,-.85],[-1.8,1.2,0],m.red);text("INTERNAL RESISTANCE / NULL",0,3.3,0);break;
 case "35":base();power(-1.8,0);box(1.1,.21,.65,.7,.7,0,m.black);cyl(.2,.2,.7,.7,1,0,m.black).rotation.z=Math.PI/2;tor(.2,.03,.9,1,0,m.red).rotation.y=Math.PI/2;meter(1.85,.3,"A");lead([-1.3,.85,0],[.4,1,0],m.red);text("DIODE FORWARD BIAS",0,3,0);break;
 case "36":base();power(-2,0);cyl(.37,.37,.66,.5,1.1,0,m.black);for(let x of [.28,.5,.72])rod([x,.78,0],[x,.43,.38],.035,m.chrome);resistor(-.5,0);meter(1.75,-.55,"A");meter(1.75,.85,"B");text("TRANSISTOR COMMON-EMITTER",0,3.15,0);break;
 case "37":base();box(2.8,.72,1.9,0,.9,0,m.black);for(let i=0;i<6;i++){const x=-1.1+i*.42;sphere(.11,x,1.33,.64,i%2?m.red:m.teal);cyl(.07,.07,.22,x,.55,.98,m.chrome)}power(-2.1,-.9);text("LOGIC TRAINER / TRUTH TABLE",0,2.95,0);break;
 case "38":base();stand(-1.65,-.8,2.9);stand(1.65,-.8,2.9);rod([0,3.25,0],[0,.8,0],.018,m.chrome);load(0,.75,0,.38);ruler(1.45,1.5,.3,2.6);text("YOUNG MODULUS / LONG WIRE",0,3.8,0);break;
 case "39":base(6,3.2);vessel(-2,0,.55,.56,1.15);glassTube(0,0,1.3,2,.075);rod([-1.9,1.55,0],[2.1,1.55,0],.07,m.glass);vessel(2.1,0,.25,.47,.78);text("CAPILLARY FLOW / POISEUILLE",0,3.2,0);break;
 case "40":base();vessel(0,0,.6,.86,1.4);box(1.55,.11,1.1,0,1.75,0,m.glass);string([0,1.75,0],[0,3.3,0]);load(1.65,.65,0,.2);text("SLIDE / WETTING FORCE",0,3.7,0);break;
 case "41":base();vessel(0,0,.63,.78,1.3);glassTube(.2,0,.6,3,.09);cyl(.065,.065,1.77,.2,1.5,0,m.water);glassTube(-.26,0,.6,2.7,.14);text("CAPILLARY RISE / MENISCUS",0,3.6,0);break;
 case "42":base();vessel(-.6,0,.7,.8,1.6);glassTube(-.6,0,.55,3.25,.09);for(let i=0;i<8;i++)sphere(.045+i*.005,-.6+.05*Math.sin(i*2),1.1+i*.18,0,m.water);meter(1.8,0,"P");lead([-.6,3,0],[1.45,1.5,0],m.chrome);text("JAEGER BUBBLE PRESSURE",0,3.6,0);break;
 default:return false
 }
 title();
 return true;
}
