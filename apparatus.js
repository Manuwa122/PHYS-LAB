/**
 * Apparatus-focused, animated Canvas illustrations for A/L practicals.
 * Schematic teaching animations; not calibrated instrument digital twins.
 * Every numerical experiment is keyed by its instrument/model and experiment id.
 */
const TAU=Math.PI*2;
export function paintApparatus(canvas,experiment,values,seconds){
 const rect=canvas.getBoundingClientRect(),cssW=rect.width,cssH=rect.height;
 if(cssW<1||cssH<1)return;
 const dpr=Math.min(devicePixelRatio||1,2);
 canvas.width=Math.round(cssW*dpr);canvas.height=Math.round(cssH*dpr);
 const c=canvas.getContext("2d");
 c.setTransform(canvas.width/600,0,0,canvas.height/320,0,0);
 const w=600,h=320,v=values||[],p=experiment.model,id=experiment.id;
 const A="#ac92ff",B="#67d7f0",Y="#ffba75",G="#6ae8bd",WHITE="#e5edff",M="#94a5cb";
 const t=seconds||0;
 const line=(x,y,X,Y,color=WHITE,size=2)=>{c.beginPath();c.moveTo(x,y);c.lineTo(X,Y);c.strokeStyle=color;c.lineWidth=size;c.stroke()};
 const poly=(pts,col,fill=false,size=2)=>{c.beginPath();pts.forEach(([x,y],i)=>i?c.lineTo(x,y):c.moveTo(x,y));if(fill){c.closePath();c.fillStyle=col;c.fill()}else{c.strokeStyle=col;c.lineWidth=size;c.stroke()}};
 const rectfill=(x,y,ww,hh,col)=>{c.fillStyle=col;c.fillRect(x,y,ww,hh)};
 const dot=(x,y,r,col)=>{c.fillStyle=col;c.beginPath();c.arc(x,y,r,0,TAU);c.fill()};
 const ellipse=(x,y,rx,ry,col,fill=false)=>{c.beginPath();c.ellipse(x,y,rx,ry,0,0,TAU);if(fill){c.fillStyle=col;c.fill()}else{c.strokeStyle=col;c.lineWidth=2;c.stroke()}};
 const text=(txt,x,y,color=WHITE,size=13)=>{c.fillStyle=color;c.font=`${size}px Inter,Arial,sans-serif`;c.fillText(String(txt),x,y)};
 const arrow=(x,y,X,Y,col=A)=>{line(x,y,X,Y,col,3);const a=Math.atan2(Y-y,X-x);poly([[X-10*Math.cos(a-.5),Y-10*Math.sin(a-.5)],[X,Y],[X-10*Math.cos(a+.5),Y-10*Math.sin(a+.5)]],col,false,3)};
 const graph=(fn,x=320,y=70,ww=225,hh=178)=>{line(x,y,x,y+hh,M,1);line(x,y+hh,x+ww,y+hh,M,1);c.beginPath();for(let i=0;i<=ww;i++){const yy=fn(i/ww);const px=x+i,py=y+hh-(Number.isFinite(yy)?Math.max(0,Math.min(1,yy)):0)*hh;if(!i)c.moveTo(px,py);else c.lineTo(px,py)}c.strokeStyle=A;c.lineWidth=3;c.stroke();text("MEASUREMENT",x,y-12,M,10)};
 const ruler=(x,y,length=270,step=10)=>{rectfill(x,y,length,22,"#9facc6");for(let i=0;i<=length;i+=step){line(x+i,y,x+i,y+(i%(step*5)===0?15:8),"#1a2440",1)}};
 const bottle=(x,y,level=.7)=>{rectfill(x,y,140,140,"#61799b33");line(x,y,x,y+140,M,4);line(x+140,y,x+140,y+140,M,4);line(x,y+140,x+140,y+140,M,4);rectfill(x+5,y+140-125*level,130,125*level,"#3ebdd766");line(x+5,y+140-125*level,x+135,y+140-125*level,B,2)};
 const weight=(x,y,m=1)=>{line(x,y-35,x,y-4,M);rectfill(x-20,y-4,40,44,Y);text(m+" kg",x-14,y+22,"#16213b",10)};
 const bulb=(x,y,on=false)=>{line(x-22,y,x-22,y+28,M);line(x+22,y,x+22,y+28,M);dot(x,y,21,on?Y:"#64738b");text("☼",x-9,y+7,on?"#453207":WHITE,24)};
 const battery=(x,y)=>{line(x,y-35,x,y+35,M);line(x+14,y-20,x+14,y+20,M,4);text("+",x-15,y-38,G);text("−",x+12,y+45,Y)};
 const switcher=(x,y)=>{line(x-40,y,x-14,y,M);dot(x-14,y,4,M);line(x-14,y,x+22,y-15,G);dot(x+30,y,4,M);line(x+30,y,x+44,y,M)};
 const coil=(x,y,n=12)=>{c.beginPath();for(let i=0;i<=n*20;i++){const xx=x+i/n*3.5,yy=y+17*Math.sin(i/3);i===0?c.moveTo(xx,yy):c.lineTo(xx,yy)}c.strokeStyle=Y;c.lineWidth=3;c.stroke()};
 const init=()=>{let g=c.createLinearGradient(0,0,600,320);g.addColorStop(0,"#111f38");g.addColorStop(1,"#12142d");rectfill(0,0,600,320,g);for(let x=12;x<600;x+=30)line(x,0,x,320,"#27365744",1);for(let y=10;y<320;y+=30)line(0,y,600,y,"#27365744",1);text("PHYS·LAB  /  APPARATUS SIMULATION",20,25,M,11);text("#"+id,545,25,A,12)};
 init();
 const fit=(x,a,b)=>Math.max(a,Math.min(b,x));
 switch(p){
 case "vernier":{
 ruler(70,110,440,10);rectfill(130,137,190,37,"#7256ce");rectfill(130,137,52,80,"#836bcf");rectfill(310,137,27,80,"#836bcf");
 let q=v[0]||20,slide=fit(190+q*2.2,185,455);rectfill(slide,135,36,85,"#d2c2ff");line(slide,110,slide,240,Y,2);text("Moving jaw",slide-30,258,Y);text("Coinciding division: "+(v[1]||0),40,290,G);arrow(225,75,slide,110,Y);break}
 case "micrometer":{
 rectfill(80,98,100,125,"#8999b8");rectfill(100,116,200,20,"#101a2f");rectfill(100,196,200,24,"#101a2f");rectfill(135,135,22,60,WHITE);rectfill(280,139,135,38,M);rectfill(415,120,65,74,A);rectfill(480,136,55,45,"#9d8bd7");for(let i=0;i<14;i++)line(415+i*7,120,415+i*7,140,"#283253",1);arrow(535,90,485,125,Y);text("Thimble rotates →",374,83,Y);text("Pitch & circular scale",205,255,M);break}
 case "spherometer":{
 ellipse(280,223,170,46,"#6285a9",true);poly([[150,226],[278,140],[405,227]],M);[155,278,401].forEach(x=>line(x,215,x,260,Y,5));line(280,92,280,241,A,7);rectfill(260,89,40,20,Y);ellipse(280,110,56,17,A);text("Central screw",335,96,G);text("Sagitta h",338,169,Y);arrow(334,170,282,225);break}
 case "forces":case "moments":{
 line(40,257,555,257,M,5);if(p==="forces"){let a=v[2]*Math.PI/180,x=280,y=195;ellipse(x,y,22,22,Y,true);arrow(x,y,x+(v[0]||5)*10,y,G);arrow(x,y,x+Math.cos(a)*(v[1]||8)*10,y-Math.sin(a)*(v[1]||8)*10,Y);text("F₁",x+80,y-11,G);text("F₂",x-110,y-85,Y);text("Force board",50,110,M)}else{line(80,135,530,135,A,12);poly([[295,143],[268,247],[322,247]],M,true);let x1=295-(v[1]||30)*3,x2=295+(v[2]||20)*3;weight(x1,172,v[0]);weight(x2,172,"?");text("Pivot",305,270,Y)}break}
 case "utube":{
 const l=fit((v[0]||12)*7,20,155),r=fit((v[1]||15)*7,20,155);line(177,85,177,253,M,10);line(313,85,313,253,M,10);line(177,253,313,253,M,10);rectfill(182,253-l,30,l,"#5ed3ecaa");rectfill(279,253-r,29,r,"#ad90ffaa");rectfill(205,224,75,32,"#7e85ddaa");text("h₁",145,250-l,Y);text("h₂",319,250-r,Y);text("U-tube fluid columns",365,135,M);break}
 case "density":{
 bottle(72,105,.75);let z=190+Math.sin(t*1.4)*7;rectfill(130,z-48,25,56,Y);line(142,z-48,142,z-67,G,3);text("Floating test tube",250,128,G);arrow(286,145,153,z,Y);text("Buoyancy = weight",270,185,M);break}
 case "pendulum":{
 let L=fit((v[0]||1)*113,75,185),angle=0.28*Math.cos(t*2*Math.PI/Math.max(.5,(v[1]||2)));line(160,70,440,70,M,7);line(300,70,300+L*Math.sin(angle),70+L*Math.cos(angle),A,3);dot(300,70,7,WHITE);dot(300+L*Math.sin(angle),70+L*Math.cos(angle),18,Y);text("Fixed pivot",318,61,M);line(300,70,300,275,"#5f6a8944",1);text("L",330,165,G);text("T = 2π√(L/g)",30,289,G);break}
 case "spring":{
 line(150,70,450,70,M,7);let L=145+40*Math.sin(t*3),x=300;c.beginPath();c.moveTo(x,70);for(let i=0;i<=24;i++){c.lineTo(x+(i%2?18:-18),70+i*L/24)}c.strokeStyle=A;c.lineWidth=3;c.stroke();rectfill(268,70+L,64,55,Y);text("Oscillating load",370,160,G);text("k = "+v[1]+" N/m",30,288,M);break}
 case "sonometer":{
 line(60,190,540,190,M,9);line(90,167,500,167,Y,2);poly([[120,190],[105,205],[135,205]],A,true);poly([[460,190],[445,205],[475,205]],A,true);line(500,167,500,235,M,3);weight(500,250,"F");let n=30;for(let i=0;i<n;i++)dot(120+i*11,167+Math.sin(i*.5+t*5)*6,2,B);text("Sonometer wire",240,130,G);text("Bridges",115,228,M);break}
 case "resonance":{
 rectfill(250,72,90,206,"#abc5db22");rectfill(255,130+25*Math.sin(t),80,140-25*Math.sin(t),"#52bde18c");line(250,60,250,280,M,4);line(340,60,340,280,M,4);for(let i=0;i<5;i++)ellipse(295,110+i*18,30+14*Math.sin(t*3+i),6,B);
 poly([[280,56],[280,38],[292,38]],Y,false,5);text("Tuning fork",365,83,Y);text("Air column",367,160,G);text("Water level",367,265,B);break}
 case "refractive":{
 bottle(90,101,.65);line(160,100,160,240,"#cde3ef",2);dot(160,212,9,Y);dot(160,169,7,A);text("Real depth",280,201,Y);text("Apparent depth",280,155,A);line(174,210,265,201,Y);line(174,169,265,155,A);break}
 case "prism":case "critical":case "angles":{
 poly([[290,75],[176,257],[405,257]],"#617bff33",true);poly([[290,75],[176,257],[405,257]],A,false,3);arrow(42,175,215,175,Y);line(215,175,340,227,G,4);arrow(340,227,530,p==="critical"?114:170,G);text(p==="angles"?"Spectrometer / reflected rays":p==="critical"?"Critical angle / TIR":"Prism ray deviation",48,290,WHITE);dot(215,175,5,Y);break}
 case "lens":{
 line(20,175,570,175,M,1);ellipse(300,175,19,112,"#83c8ed55",true);ellipse(300,175,19,112,B,false);line(130,175,130,86,Y,6);line(470,175,470,236,G,6);line(130,86,300,86,Y);line(300,86,470,236,Y);line(130,86,470,236,A);text("Object",85,76,Y);text("Image",475,248,G);break}
 case "gas":case "charles":case "pressure":{
 rectfill(130,80,135,177,"#8da9ca24");line(130,80,130,265,M,5);line(265,80,265,265,M,5);line(130,265,265,265,M,5);let piston=145+(p==="gas"?(v[2]||35):p==="charles"?(v[2]||360)/4:80)*.21;line(130,piston,265,piston,Y,9);for(let i=0;i<18;i++){let xx=145+(i*37+t*14*(i%2?1:-1)+1800)%106,yy=piston+10+(i*57+t*19)%Math.max(20,250-piston);dot(xx,yy,3,B)}text("Moving piston",286,124,Y);arrow(302,133,250,piston);text(p==="gas"?"Boyle law · P∝1/V":p==="charles"?"Charles law · V∝T":"Pressure law · P∝T",290,257,G);break}
 case "calorimetry":{
 bottle(110,94,.65);rectfill(170,80,35,130,"#b5c4da");dot(183,215,18,Y);line(183,118,183,213,Y,4);text("Metal sample",275,135,Y);arrow(275,149,192,209);text("Temperature → equilibrium",275,224,G);text("Thermometer",270,175,M);break}
 case "conductivity":{
 rectfill(50,152,300,23,Y);for(let i=0;i<7;i++)line(75+i*40,145,75+i*40,184,"#ffcf91",3);bottle(385,103,.55);line(350,165,390,165,M,8);line(350,180,390,180,M,8);text("Metal conductor",80,118,Y);text("Cooling water",405,260,B);for(let i=0;i<4;i++)arrow(75+i*56,207,108+i*56,207,"#fc966c");break}
 case "cell":case "potentiometer":case "internal":case "temperature":{
 poly([[105,99],[495,99],[495,244],[105,244],[105,99]],M,false,3);battery(190,99);switcher(300,99);rectfill(370,87,80,24,"#a08bfa");text("R",408,83,WHITE);if(p==="potentiometer"||p==="internal"){ruler(135,221,330,10);arrow(250+(v[0]||5),175,250+(v[0]||5),219,Y);text("Sliding contact",300,166,Y)}else{line(317,145,317,237,Y,5);ellipse(317,189,32,32,B);text("V",311,196,WHITE);text("Cell / external resistance",235,288,G)}break}
 case "diode":{
 poly([[95,112],[505,112],[505,245],[95,245],[95,112]],M,false,3);battery(156,112);poly([[285,190],[350,218],[285,245]],A,false,4);line(352,190,352,248,A,5);arrow(363,219,450,219,Y);text("Forward bias",235,79,G);text("Diode",275,281,WHITE);text("Adjust V to change I",50,298,M);break}
 case "transistor":{
 poly([[280,85],[280,235]],A,false,5);line(190,155,280,155,B,4);line(280,115,390,75,Y,4);line(280,198,390,251,Y,4);arrow(306,210,349,237,G);text("B",165,150,B);text("C",402,81,Y);text("E",402,253,G);text("Common emitter",235,288,WHITE);break}
 case "gates":{
 const typ=["AND","OR","NAND","NOR","XOR"][v[2]||0];rectfill(190,105,210,105,"#38376c");line(115,130,190,130,Y,4);line(115,183,190,183,B,4);line(400,156,500,156,G,4);text(typ,248,169,WHITE,30);text("A = "+v[0],70,122,Y);text("B = "+v[1],70,205,B);const a=v[0]||0,b=v[1]||0;text("OUT = "+[a&b,a|b,1-(a&b),1-(a|b),a^b][v[2]||0],447,137,G);break}
 case "young":{
 line(300,70,300,222,A,5);line(175,70,425,70,M,7);weight(300,251,"F");line(343,90,343,220,G,1);text("Extension ΔL",365,175,G);text("Wire",265,146,Y);break}
 case "viscosity":{
 bottle(165,75,.5);line(300,169,515,169,M,6);for(let i=0;i<15;i++)dot(320+(i*14+t*12)%183,168+(i%3-1)*3,2,B);arrow(347,140,480,140,G);text("Capillary / volume flow",255,100,G);text("Flow collection",320,238,M);break}
 case "tension":{
 bottle(85,128,.7);line(145,270,145,72,M,4);line(167,270,167,72,M,4);rectfill(149,95,14,175,"#76dcec");text("Capillary rise h",230,103,G);line(162,101,223,101,G);text("Meniscus",235,133,B);break}
 // seven additional apparatus-specific guided visualizations
 case "cooling":{
 bottle(70,95,.7);line(145,60,145,203,Y,4);dot(145,200,13,Y);graph(x=>Math.exp(-3*x),308,83,238,165);text("Cooling curve",307,280,G);break}
 case "fusion":{
 bottle(84,94,.65);rectfill(122,130,50,42,"#c7eff5");rectfill(138,116,42,39,"#dcfaff");text("Ice + water",240,134,B);arrow(240,148,177,166);graph(x=>1-Math.exp(-3*x),335,93,202,145);break}
 case "vapor":{
 bottle(115,119,.67);for(let i=0;i<8;i++)ellipse(135+i*15,150-((i*31+t*22)%80),5,8,"#a9e7fa");rectfill(139,258,97,10,Y);text("Steam heating",268,123,Y);arrow(285,139,198,153);text("Heat transfer",288,199,G);break}
 case "humidity":{
 rectfill(120,104,166,142,"#889bb04b");ellipse(203,110,73,15,M);line(204,72,204,198,Y,4);dot(204,200,15,Y);for(let i=0;i<4;i++){dot(316+i*45,116+Math.sin(t*2+i)*12,5,B)}text("Dew point",326,210,G);text("Cooling surface",320,243,M);break}
 case "concave":{
 line(20,175,575,175,M);ellipse(300,175,14,102,B,false);line(135,175,135,105,Y,4);poly([[135,105],[300,105],[465,145]],Y,false,2);poly([[135,105],[300,175],[450,245]],A,false,2);text("Diverging virtual image",323,87,G);break}
 case "slide":{
 bottle(88,130,.55);rectfill(135,104,10,130,M);rectfill(143,182,150,10,"#d5e5f6");arrow(200,176,200,115,Y);text("Capillary force",265,109,G);text("Slide immersion",310,215,B);break}
 case "jaeger":{
 bottle(95,103,.68);line(165,60,165,222,M,6);for(let i=0;i<5;i++)dot(165+Math.sin(i+t)*4,220-i*22-(t*15%15),5+i%2*3,B);ellipse(310,156,72,63,"#879dd3",true);text("Pressure sensor",256,160,WHITE);line(165,60,310,93,Y,3);text("Bubble threshold",370,258,G);break}
 default:{
 // Instrument-specific uncertainty: no false generic curve.
 ellipse(298,164,105,72,A);dot(298+80*Math.cos(t),164+50*Math.sin(t),12,Y);text("Conceptual visual aid",214,278,M);
 }
 }
 rectfill(0,305,600,15,"#0b1224");text("SCHEMATIC EDUCATIONAL MODEL · NOT REAL APPARATUS DATA",12,316,"#8799b6",9);
}
