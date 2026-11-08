import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
/** True interactive WebGL 3D teaching scenes. Parametric equipment approximations, not scanned instrument replicas. */
export function mountLab3D(host){
 const scene=new THREE.Scene();scene.background=new THREE.Color("#0b1427");
 const camera=new THREE.PerspectiveCamera(38,1,.1,100);camera.position.set(7,5.5,8);
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:false,powerPreference:"high-performance"});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.shadowMap.enabled=!/iPhone|iPad|Android/i.test(navigator.userAgent);renderer.outputColorSpace=THREE.SRGBColorSpace;
 renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.45;
 host.append(renderer.domElement);renderer.domElement.style.cssText="display:block;width:100%;height:100%;touch-action:none";
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=3;controls.maxDistance=20;controls.maxPolarAngle=Math.PI*.49;controls.target.set(0,1,0);
 scene.add(new THREE.HemisphereLight(0xc6d7ff,0x233043,2));
 const key=new THREE.DirectionalLight(0xffffff,3);key.position.set(5,10,5);key.castShadow=true;key.shadow.mapSize.set(1024,1024);key.shadow.camera.left=-8;key.shadow.camera.right=8;key.shadow.camera.top=8;key.shadow.camera.bottom=-8;scene.add(key);
 const rim=new THREE.PointLight(0x8669ff,90,15);rim.position.set(-4,5,-3);scene.add(rim);
 const mat=(color,metalness=.15,roughness=.45,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
 const metal=mat(0xcbd5de,.88,.18),dark=mat(0x1f2937,.5,.35),gold=mat(0xdd9a45,.6,.24),glass=mat(0x7ccfed,.05,.07,{transparent:true,opacity:.3,depthWrite:false,side:THREE.DoubleSide}),water=mat(0x35b4e8,.2,.12,{transparent:true,opacity:.7}),purple=mat(0x946fea,.5,.3),green=mat(0x4de5af,.3,.25),red=mat(0xf9757b,.35,.27),white=mat(0xf4f4ff,.1,.43);
 const bench=new THREE.Group();scene.add(bench);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),mat(0x0c1425));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
 const table=new THREE.Mesh(new THREE.BoxGeometry(9,.18,6),mat(0x283c5a,.2,.62));table.position.y=.09;table.receiveShadow=true;scene.add(table);
 const grid=new THREE.GridHelper(10,20,0x405473,0x26344e);grid.position.y=.193;scene.add(grid);
 let objects=new THREE.Group();let moving=[];scene.add(objects);
 const add=(geo,m,x=0,y=0,z=0,parent=objects)=>{const o=new THREE.Mesh(geo,m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o};
 const box=(w,h,d,x,y,z,m=metal,parent=objects)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z,parent);
 const sphere=(r,x,y,z,m=gold,parent=objects)=>add(new THREE.SphereGeometry(r,24,16),m,x,y,z,parent);
 const cyl=(r1,r2,h,x,y,z,m=metal,parent=objects)=>add(new THREE.CylinderGeometry(r1,r2,h,32),m,x,y,z,parent);
 const tor=(r,tube,x,y,z,m=purple,parent=objects)=>add(new THREE.TorusGeometry(r,tube,12,48),m,x,y,z,parent);
 const rod=(a,b,r,m=metal,parent=objects)=>{let start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),dir=end.clone().sub(start);let o=add(new THREE.CylinderGeometry(r,r,dir.length(),12),m,...start.clone().add(end).multiplyScalar(.5).toArray(),parent);o.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return o};
 const label=(s,x,y,z)=>{const canvas=document.createElement("canvas");canvas.width=512;canvas.height=96;const ctx=canvas.getContext("2d");ctx.fillStyle="#ffffff";ctx.font="bold 40px Arial";ctx.fillText(s.slice(0,25),8,58);const texture=new THREE.CanvasTexture(canvas);const sprite=new THREE.Sprite(new THREE.SpriteMaterial({map:texture,transparent:true,depthTest:false}));sprite.position.set(x,y,z);sprite.scale.set(2.8,.55,1);objects.add(sprite)};
 const fork=(x=0,z=0)=>{box(.13,.75,.14,x,1.3,z,metal);box(.13,.75,.14,x+.42,1.3,z,metal);box(.54,.13,.14,x+.2,.93,z,metal);rod([x+.2,.9,z],[x+.2,.48,z],.07,metal)};
 const basin=(x=0,z=0)=>{cyl(.9,.9,.08,x,.35,z,metal);cyl(.8,.8,.5,x,.65,z,glass);cyl(.75,.75,.24,x,.51,z,water)};
 const battery=(x=0,z=0)=>{cyl(.22,.22,.55,x,.58,z,dark);cyl(.22,.22,.06,x,.87,z,gold);cyl(.1,.1,.08,x,.93,z,metal)};
 const meter=(x=0,z=0,m="V")=>{box(.95,.7,.25,x,.6,z,dark);cyl(.3,.3,.02,x,.65,z+.14,white).rotation.x=Math.PI/2;label(m,x,.68,z+.25)};
 const resistor=(x=0,z=0)=>{box(1,.22,.3,x,.7,z,gold);for(let i=-2;i<=2;i++)box(.04,.24,.31,x+i*.13,.7,z,i%2?red:purple)};
 const wire=(points,color=red)=>{for(let i=1;i<points.length;i++)rod(points[i-1],points[i],.027,color)};
 const circuit=()=>{battery(-2,-.8);battery(-2,0);meter(1.4,-.9,"V");resistor(1.1,1);wire([[-2,.95,-.8],[-2,1.02,1],[.6,1.02,1]],red);wire([[1.6,.7,1],[2,.7,1],[2,.66,-.9]],purple);wire([[.9,.6,-.9],[-2,.6,-.9]],green)};
 const ruler=()=>{box(5,.12,.44,0,.5,0,metal);for(let i=0;i<=40;i++){box(.015,.014,i%5===0?.35:.17,-2.4+i*.12,.572,0,dark)}};
 const opticalRail=()=>{box(5,.17,.35,0,.38,0,dark);for(let x=-2.4;x<2.5;x+=.25)box(.015,.015,.35,x,.48,0,metal)};

 function realisticVernier(v){
   const silver=mat(0xd8dfe7,.9,.18),ink=mat(0x202b3c,.4,.7),accent=mat(0x0a9b94,.55,.3);
   box(5.7,.14,.5,0,.78,0,silver);
   for(let i=0;i<=55;i++){let x=-2.73+i*.1;box(.012,.018,i%10===0?.42:i%5===0?.3:.19,x,.865,0,ink)}
   box(.34,1.28,.56,-2.55,1.47,0,silver);box(.2,.5,.4,-2.55,2.28,0,silver);
   const x=Math.min(1.66,-1.95+(v[0]||21)*.094);
   box(1.17,.28,.83,x,.81,0,silver);
   box(.33,1.28,.56,x+.46,1.47,0,silver);box(.2,.5,.4,x+.46,2.28,0,silver);
   box(.8,.12,.9,x,.65,0,accent);
   for(let i=0;i<11;i++)box(.012,.022,i%5===0?.67:.36,x-.39+i*.078,.97,0,ink);
   cyl(.17,.17,.12,x,.98,.51,dark).rotation.x=Math.PI/2;
   label("STAINLESS STEEL VERNIER",-1.5,3.12,.1);
   label("MAIN SCALE / VERNIER",.3,.25,1);
 }
 function realisticMicrometer(v){
   const silver=mat(0xd9e2ed,.84,.21),blue=mat(0x117d9b,.55,.28),black=mat(0x1d2634,.36,.43);
   const pts=[[[-1.75,.85,0],[-1.75,2.8,0]],[[-1.75,2.8,0],[-.9,3.04,0]],[[-.9,3.04,0],[-.1,2.8,0]],[[-1.75,.85,0],[-.9,.6,0]],[[-.9,.6,0],[-.1,.84,0]]];
   pts.forEach(([a,b])=>rod(a,b,.19,blue));
   rod([-.24,1.85,0],[.1,1.85,0],.16,silver);
   let gap=Math.max(.2,1-(v[0]||4.5)*.025);
   rod([gap,1.85,0],[1.5,1.85,0],.16,silver);
   let sleeve=cyl(.37,.37,1.2,1.65,1.85,0,silver);sleeve.rotation.z=Math.PI/2;
   let thimble=cyl(.49,.49,1.1,2.71,1.85,0,black);thimble.rotation.z=Math.PI/2;
   for(let i=0;i<32;i++){let a=2*Math.PI*i/32;rod([2.2,1.85+.49*Math.cos(a),.49*Math.sin(a)],[3.18,1.85+.49*Math.cos(a),.49*Math.sin(a)],.011,silver)}
   for(let i=0;i<11;i++)box(.014,.07,.24,1.1+i*.09,2.2,0,black);
   cyl(.42,.42,.17,3.4,1.85,0,silver).rotation.z=Math.PI/2;
   label("MICROMETER / RATCHET",-.9,3.55,0);
 }
 function realisticPendulum(v){
   const support=mat(0xbcc9d8,.78,.22),heavy=mat(0x324760,.46,.35),bobmat=mat(0xd59b4b,.78,.19);
   box(3,.23,2.4,0,.33,0,heavy);
   for(let x of [-1.1,1.1])rod([x,.45,-.8],[x,3.18,-.8],.076,support);
   rod([-1.22,3.18,-.8],[1.22,3.18,-.8],.08,support);
   box(.42,.28,.35,0,3.11,-.8,dark);
   let L=Math.max(.6,Math.min(2.35,(v[0]||1)*1.4)),period=Math.max(.5,v[1]||2);
   let ball=sphere(.23,0,3.03-L,-.8,bobmat);
   let string=rod([0,3.04,-.8],ball.position.toArray(),.014,white);
   moving.push(time=>{
      let angle=Math.sin(time*Math.PI*2/period)*.18;
      ball.position.set(L*Math.sin(angle),3.04-L*Math.cos(angle),-.8);
      const start=new THREE.Vector3(0,3.04,-.8),d=ball.position.clone().sub(start);
      string.position.copy(start).add(ball.position).multiplyScalar(.5);
      string.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.clone().normalize());
      string.scale.y=d.length()/L;
   });
   box(.08,2.6,.12,-1.42,1.82,.2,support);
   for(let i=0;i<24;i++)box(i%5===0?.16:.07,.009,.14,-1.37, .6+i*.105,.2,dark);
   label("SIMPLE PENDULUM",0,3.65,0);
 }
 function apparatus(p,v){
 moving=[];const n=p.id;
 const style=p.model;
 // every scene uses an apparatus-dependent 3D configuration
 if(style==="vernier"){realisticVernier(v);return}
 if(style==="micrometer"){realisticMicrometer(v);return}
 if(style==="pendulum"){realisticPendulum(v);return}
 if(["vernier","micrometer","spherometer"].includes(style)){
 ruler();if(style==="vernier"){box(.21,.95,.5,-1.45,.94,0,purple);box(.23,.95,.5,1.05+(v[0]||10)/80,.94,0,gold);box(1.3,.25,.5,-.7,.58,0,metal);label("Vernier scale",-.6,1.8,0)}
 if(style==="micrometer"){tor(1,.12,-1,1.25,0,metal).rotation.y=Math.PI/2;rod([-.3,1.2,0],[2,1.2,0],.21,metal);cyl(.42,.42,1.1,1.4,1.2,0,purple).rotation.z=Math.PI/2;label("Screw gauge",0,2.25,0)}
 if(style==="spherometer"){for(let i=0;i<3;i++){let a=i*2*Math.PI/3;rod([Math.cos(a),.32,Math.sin(a)],[Math.cos(a),1.1,Math.sin(a)],.08,metal)}cyl(.8,.8,.1,0,1,0,metal);cyl(.2,.2,1.6,0,1.45,0,purple);label("Spherometer",0,2.7,0)}
 }else if(["forces","moments","young","spring","pendulum"].includes(style)){
 box(4,.18,2.2,0,.48,0,metal);
 rod([-1.6,.55,-.75],[-1.6,3,-.75],.07,metal);rod([1.6,.55,-.75],[1.6,3,-.75],.07,metal);rod([-1.7,3,-.75],[1.7,3,-.75],.07,metal);
 if(style==="pendulum"){let ball=sphere(.27,0,1.25,0,gold);let string=rod([0,3,-.75],[0,1.25,0],.023,white);moving.push(t=>{let a=Math.sin(t*1.75)*.36;ball.position.set(Math.sin(a)*1.25,1.47+Math.cos(a)*-.22,.15);objects.remove(string);string.geometry.dispose();string=rod([0,3,-.75],ball.position.toArray(),.02,white)})}
 if(style==="spring"){for(let i=0;i<15;i++){let a=i*2*Math.PI/6;rod([.35*Math.sin(a),2.9-i*.09,0+.35*Math.cos(a)],[.35*Math.sin(a+1),2.8-i*.09,.35*Math.cos(a+1)],.035,purple)}box(.65,.5,.65,0,1,0,gold);label("Spring & load",.3,3.4,0)}
 if(style==="young"){rod([0,3,0],[0,.95,0],.025,gold);box(.7,.5,.65,0,.75,0,purple);label("Steel wire",.6,2.2,0)}
 if(style==="moments"){rod([-2,2,0],[2,2,0],.12,gold);box(.6,.6,.6,-1.1,1.15,0,purple);box(.5,.5,.5,1.25,1.15,0,gold);rod([-1.1,1.9,0],[-1.1,1.5,0],.04,metal);rod([1.25,1.9,0],[1.25,1.5,0],.04,metal);label("Principle of moments",0,3.5,0)}
 if(style==="forces"){const ring=tor(.22,.055,0,1.8,0,gold);rod([-2,2,0],[0,1.8,0],.035,green);rod([2,2,0],[0,1.8,0],.035,purple);sphere(.3,-2,1.2,0,gold);sphere(.3,2,1.2,0,purple);label("Force equilibrium",0,3.5,0)}
 }else if(["utube","density","tension","viscosity","slide","jaeger"].includes(style)){
 basin(0,0);
 if(style==="utube"){for(let x of [-.65,.65]){cyl(.16,.16,2,x,1.6,0,glass)}tor(.65,.15,0,.7,0,water).rotation.x=Math.PI;for(let x of [-.65,.65])cyl(.13,.13,.45+(v[0]||12)/35,x,.65,0,water);label("U-tube manometer",0,3,0)}
 else if(style==="density"){cyl(.19,.19,1.5,0,1.65,0,glass);cyl(.17,.17,.6,0,1,0,gold);label("Floating test tube",0,2.85,0)}
 else if(style==="viscosity"){rod([-2,2,0],[2,2,0],.075,glass);basin(1.8,0);for(let i=0;i<8;i++){const d=sphere(.07,-1.8+i*.42,2,0,water);moving.push(t=>{d.position.x=-1.8+((i*.42+t*.6)%3.7)})}label("Poiseuille capillary",0,2.85,0)}
 else if(style==="tension"){cyl(.09,.09,2.4,.1,1.6,0,glass);cyl(.065,.065,1.8,.1,1.3,0,water);label("Capillary rise",0,3,0)}
 else if(style==="slide"){box(1.6,.1,1,0,1.15,0,glass);rod([0,2.8,0],[0,1.15,0],.035,metal);label("Surface tension slide",0,3.15,0)}
 else{rod([0,3,0],[0,.6,0],.09,glass);sphere(.22,0,.8,0,water);label(style==="jaeger"?"Jaeger's bubbles":"Density displacement",0,3.1,0)}
 }else if(["sonometer","resonance"].includes(style)){
 if(style==="sonometer"){box(5,.35,1.2,0,.5,0,mat(0x7e5940));for(let z of [-.35,.35])rod([-2.4,.95,z],[2.4,.95,z],.015,gold);box(.22,.8,1,0,.89,0,metal);fork(-1.5,-.8);label("Sonometer & tuning fork",0,2.3,0)}
 else{cyl(.6,.6,2.6,0,1.75,0,glass);cyl(.53,.53,.7+(v[1]||.15),0,.83,0,water);fork(-1.1,0);label("Resonance air column",0,3.4,0)}
 }else if(["lens","concave","prism","critical","angles","refractive"].includes(style)){
 opticalRail();
 if(style==="lens"||style==="concave"){const lens=sphere(1,0,1.5,0,glass);lens.scale.set(style==="concave"?.12:.22,1,1);rod([0,.4,0],[0,1,0],.07,metal);rod([-1.8,.4,0],[-1.8,1.85,0],.06,gold);rod([1.8,.4,0],[1.8,1.85,0],.06,green);label(style==="lens"?"Convex lens rays":"Concave lens rays",0,2.9,0)}
 else if(style==="prism"||style==="critical"||style==="angles"){let shape=new THREE.CylinderGeometry(1,1,1.2,3);let pr=add(shape,glass,0,1.4,0);pr.rotation.y=Math.PI/6;rod([-2,1.45,0],[-.5,1.45,0],.026,red);rod([.5,1.45,0],[2,1.7,.4],.026,green);label("Glass prism / rays",0,2.9,0)}
 else{cyl(1.15,1.15,.55,0,.87,0,glass);cyl(1.1,1.1,.27,0,.82,0,water);rod([0,.5,0],[0,1.7,0],.03,metal);label("Refractive index",0,2.7,0)}
 }else if(["gas","charles","pressure","cooling","fusion","vapor","calorimetry","humidity","conductivity"].includes(style)){
 if(["gas","charles","pressure"].includes(style)){cyl(.7,.7,2,0,1.5,0,glass);const piston=cyl(.75,.75,.15,0,2.35,0,metal);rod([0,2.4,0],[0,3.3,0],.07,metal);for(let i=0;i<15;i++){let d=sphere(.055,Math.sin(i*7)*.5,.7+(i%6)*.21,Math.cos(i*4)*.5,water);moving.push(t=>{d.position.y=.6+(i*.21+t*(.4+(v[2]||2)/1000))%1.45})}label("Gas cylinder & piston",0,3.5,0)}
 else if(style==="conductivity"){rod([-2,1.2,0],[2,1.2,0],.26,gold);basin(1.8,.3);label("Searle's apparatus",0,2.65,0)}
 else{basin(0,0);rod([.48,.7,0],[.48,2.75,0],.04,metal);sphere(.12,.48,.8,0,red);if(style==="fusion")for(let i=0;i<4;i++)box(.3,.3,.3,-.35+i*.18,1.04,.1,white);if(style==="vapor")for(let i=0;i<10;i++){let d=sphere(.055,Math.sin(i*5)*.5,1.15+(i*.13),Math.cos(i*3)*.5,water);moving.push(t=>{d.position.y=1+(i*.13+t*.55)%1.5})}label(style==="cooling"?"Cooling curve":style==="humidity"?"Dew point":style==="fusion"?"Melting ice":style==="vapor"?"Steam calorimetry":"Mixture calorimetry",0,2.95,0)}
 }else if(["cell","temperature","potentiometer","internal","diode","transistor","gates"].includes(style)){
 circuit();
 if(style==="potentiometer"||style==="internal"){box(4,.16,.55,0,.38,1.4,metal);for(let i=0;i<25;i++)box(.012,.024,.32,-1.9+i*.16,.47,1.4,dark);rod([0,.6,.7],[0,.5,1.4],.04,gold);label("Potentiometer",0,2,0)}
 else if(style==="diode"){cyl(.24,.24,.7,0,1.15,0,dark).rotation.z=Math.PI/2;tor(.26,.025,0,1.15,0,red).rotation.y=Math.PI/2;label("Forward bias diode",0,2.2,0)}
 else if(style==="transistor"){cyl(.37,.37,.65,0,1,0,dark);for(let x of [-.2,0,.2])rod([x,.5,0],[x,.18,.5],.04,metal);label("B · C · E transistor",0,2.25,0)}
 else if(style==="gates"){box(2.5,.65,1.2,0,.82,0,purple);for(let x of [-.6,0,.6]){sphere(.14,x,1.2,.5,(v[2]||0)%2?red:green)}label("Digital logic gates",0,2.15,0)}
 else label(style==="temperature"?"Copper wire & bridge":"EMF and resistance",0,2.25,0);
 }else{box(3,.5,2,0,.65,0,metal);label(p.title,0,2.25,0)}
 }
 function update(p,values){for(const child of [...objects.children]){objects.remove(child);child.traverse?.(o=>{o.geometry?.dispose();if(o.material?.map?.isCanvasTexture)o.material.map.dispose();if(o.material?.isSpriteMaterial)o.material.dispose()})}apparatus(p,values);camera.position.set(7,5.5,8);controls.target.set(0,1.35,0);controls.update()}
 let active=true,frame=0,last=0;
 function render(ms){if(!active)return;const dt=Math.min(.05,(ms-last)/1000||0);last=ms;frame+=dt;for(const f of moving)f(frame);const w=host.clientWidth,h=host.clientHeight;if(w&&h&&(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio()))){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}controls.update();renderer.render(scene,camera);requestAnimationFrame(render)}
 requestAnimationFrame(render);
 function resetCamera(){camera.position.set(7,5.5,8);controls.target.set(0,1.35,0);controls.update()}
 function dispose(){active=false;controls.dispose();objects.traverse(o=>{o.geometry?.dispose();if(o.material?.isSpriteMaterial){o.material.map?.dispose();o.material.dispose()}});renderer.dispose();renderer.domElement.remove()}
 return {update,resetCamera,dispose};
}
