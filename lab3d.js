import * as THREE from "three";
import {OrbitControls} from "three/addons/controls/OrbitControls.js";
import {buildDistinctApparatus} from "./lab-unique-scenes.js";
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
 // Atmospheric school laboratory environment: workbench, tiled wall, shelves,
 // labelled glassware and soft overhead fluorescent lighting.
 const wallMaterial=mat(0x24344b,.05,.9),woodMaterial=mat(0x735443,.2,.7);
 const backWall=new THREE.Mesh(new THREE.PlaneGeometry(24,12),wallMaterial);
 backWall.position.set(0,4,-7);scene.add(backWall);
 const backsplash=new THREE.Mesh(new THREE.BoxGeometry(11,1.9,.1),mat(0x35516a,.15,.55));
 backsplash.position.set(0,1.15,-3.34);scene.add(backsplash);
 for(let i=0;i<4;i++){
  const shelf=new THREE.Mesh(new THREE.BoxGeometry(3.5,.12,.55),woodMaterial);
  shelf.position.set(-3.8+(i%2)*7.6,2.7+Math.floor(i/2)*1.65,-5.7);
  scene.add(shelf);
  for(let k=0;k<3;k++){
   const flask=new THREE.Mesh(new THREE.CylinderGeometry(.08,.22,.45,12),mat([0x3b8eab,0x6b8e90,0x925cba][k],.1,.25,{transparent:true,opacity:.6}));
   flask.position.set(shelf.position.x-.75+k*.6,shelf.position.y+.26,-5.7);scene.add(flask);
  }
 }
 const framedBoard=new THREE.Mesh(new THREE.BoxGeometry(3.8,1.9,.08),mat(0x1d3644,.02,.86));
 framedBoard.position.set(0,3.5,-6.7);scene.add(framedBoard);
 const fluorescent=new THREE.Mesh(new THREE.BoxGeometry(5,.09,.22),new THREE.MeshBasicMaterial({color:0xcbdfff}));
 fluorescent.position.set(0,6.2,-3);scene.add(fluorescent);
 const softFill=new THREE.PointLight(0xc2dcff,24,13);softFill.position.set(0,6,-3);scene.add(softFill);

 let objects=new THREE.Group();let moving=[];scene.add(objects);
 // Drag-and-place training props are actual 3D objects, not arbitrary scene geometry.
 let dragEnabled=true,dragItem=null,dragOffset=new THREE.Vector3(),selectedPointer=null;
 let interactionListener=()=>{};
 const pickables=[],raycaster=new THREE.Raycaster(),pointer=new THREE.Vector2();
 const benchPlane=new THREE.Plane(new THREE.Vector3(0,1,0),-.62);
 const hitPoint=new THREE.Vector3();
 const addPickable=(obj,name,home,target,threshold=.65)=>{
   const info={obj,name,home:new THREE.Vector3(...home),target:new THREE.Vector3(...target),threshold};
   obj.position.copy(info.home);obj.userData.dragItem=info;pickables.push(info);return obj;
 };
 const handleSelection=(event)=>{const r=renderer.domElement.getBoundingClientRect();pointer.set(((event.clientX-r.left)/r.width)*2-1,-((event.clientY-r.top)/r.height)*2+1);raycaster.setFromCamera(pointer,camera)};
 const onDown=event=>{
   if(!dragEnabled||event.button>0||!pickables.length)return;
   handleSelection(event);
   const hits=raycaster.intersectObjects(pickables.map(item=>item.obj),true);
   if(!hits.length)return;
   let obj=hits[0].object;
   while(obj&&!obj.userData.dragItem)obj=obj.parent;
   if(!obj?.userData.dragItem)return;
   dragItem=obj.userData.dragItem;selectedPointer=event.pointerId;
   const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-dragItem.obj.position.y);
   if(raycaster.ray.intersectPlane(plane,hitPoint))dragOffset.copy(dragItem.obj.position).sub(hitPoint);
   else dragOffset.set(0,0,0);
   controls.enabled=false;renderer.domElement.setPointerCapture?.(event.pointerId);
   renderer.domElement.style.cursor="grabbing";
   event.preventDefault();
   interactionListener({type:"selected",name:dragItem.name});
 };
 const onMove=event=>{
   if(!dragItem||selectedPointer!==event.pointerId)return;
   handleSelection(event);
   const plane=new THREE.Plane(new THREE.Vector3(0,1,0),-dragItem.home.y);
   if(raycaster.ray.intersectPlane(plane,hitPoint)){
     const pos=hitPoint.clone().add(dragOffset);
     dragItem.obj.position.x=Math.max(-3.5,Math.min(3.5,pos.x));
     dragItem.obj.position.z=Math.max(-2.35,Math.min(2.35,pos.z));
     dragItem.obj.position.y=dragItem.home.y;
   }
   event.preventDefault();
 };
 const finishDrag=event=>{
   if(!dragItem||selectedPointer!==event.pointerId)return;
   const item=dragItem;
   const distance=item.obj.position.distanceTo(item.target);
   const placed=distance<=item.threshold;
   if(placed)item.obj.position.copy(item.target);
   controls.enabled=true;renderer.domElement.style.cursor="grab";
   try{if(renderer.domElement.hasPointerCapture?.(event.pointerId))renderer.domElement.releasePointerCapture(event.pointerId)}catch{}
   selectedPointer=null;dragItem=null;
   interactionListener({type:placed?"placed":"released",name:item.name,placed,remaining:pickables.filter(it=>it.obj.position.distanceTo(it.target)>it.threshold).length});
 };
 renderer.domElement.addEventListener("pointerdown",onDown,true);
 renderer.domElement.addEventListener("pointermove",onMove);
 renderer.domElement.addEventListener("pointerup",finishDrag);
 renderer.domElement.addEventListener("pointercancel",finishDrag);
 renderer.domElement.style.cursor="grab";

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

 function detailedSonometer(v){
  const wood=mat(0x986a3d,.08,.71),bridgeMat=mat(0xd1e0e7,.83,.24);
  box(6,.28,1.35,0,.58,0,wood);
  box(5.8,.07,1.13,0,.76,0,mat(0xc49b6a,.08,.56));
  for(let i=0;i<50;i++){box(.012,.012,i%5===0?.25:.12,-2.85+i*.114,.806,-.43,dark)}
  for(let z of [-.2,.26]){
   rod([-2.72,1.05,z],[2.72,1.05,z],.012,metal);
   box(.14,.42,.38,-1.6,1,z,bridgeMat);
   box(.14,.42,.38,1.6,1,z,bridgeMat);
  }
  const x=Math.max(-1.6,Math.min(1.6,-1.6+(v[0]||.6)*2.7));
  box(.17,.45,.88,x,1,0,bridgeMat);
  rod([2.8,1.08,.1],[2.8,.27,.1],.025,gold);
  cyl(.28,.28,.43,2.8,.35,.1,gold);
  // Resonant tuning fork with suspended prongs.
  box(.12,1.1,.14,-2.05,2,.1,bridgeMat);
  box(.12,1.1,.14,-1.65,2,.1,bridgeMat);
  box(.54,.12,.14,-1.85,1.5,.1,bridgeMat);
  rod([-1.85,1.48,.1],[-1.85,.95,.1],.05,bridgeMat);
  label("SONOMETER - METAL WIRE",0,2.9,0);
  label("VIBRATING LENGTH L",0,.2,.4);
 }
 function detailedPrism(v){
   const glassPrism=mat(0x8bd7f4,.15,.1,{transparent:true,opacity:.5,depthWrite:false,side:THREE.DoubleSide});
   box(5.6,.17,3.3,0,.42,0,mat(0x3b4e65,.4,.37));
   let prism=add(new THREE.CylinderGeometry(1.12,1.12,1.65,3),glassPrism,0,1.43,0);
   prism.rotation.y=.47;
   // Measured ray path and rotatable protractor markings.
   cyl(1.7,1.7,.04,0,.54,0,mat(0xf0f4f9,.16,.48));
   for(let i=0;i<36;i++){let a=i*Math.PI/18;const x=Math.cos(a)*1.55,z=Math.sin(a)*1.55;box(.045,.018,.12,x,.57,z,dark).rotation.y=a}
   const incidence=(v[0]||60)*Math.PI/180;
   rod([-2.55,1.46,.45],[-.8,1.46,.12],.033,red);
   rod([-.8,1.46,.12],[.7,1.46,-.28],.033,gold);
   rod([.7,1.46,-.28],[2.4,1.5,Math.sin(incidence)*.7],.033,green);
   for(let i=0;i<3;i++)sphere(.045,-2+i*.3,1.46,.38-i*.04,red);
   label("GLASS PRISM / LIGHT RAYS",0,3,0);
 }
 function detailedCircuit(v){
   const plastic=mat(0x25364e,.2,.6),copper=mat(0xcb7d3b,.8,.22);
   box(5,.15,3,0,.4,0,plastic);
   for(let i=0;i<10;i++){for(let z of [-.7,.7])cyl(.045,.045,.04,-2.2+i*.5,.5,z,metal)}
   for(let x of [-1.75,-1.05]){cyl(.24,.24,.76,x,.9,-.5,dark);cyl(.24,.24,.08,x,1.31,-.5,copper);cyl(.09,.09,.07,x,1.38,-.5,metal)}
   box(1.1,.7,.55,1.4,.88,-.55,mat(0x465874,.3,.4));
   cyl(.28,.28,.03,1.4,.97,-.25,white).rotation.x=Math.PI/2;
   for(let i=0;i<7;i++)cyl(.015,.015,.055,1.23+i*.055,1.02,-.23,dark).rotation.x=Math.PI/2;
   cyl(.14,.14,.6,.15,.86,.45,gold).rotation.z=Math.PI/2;
   for(let i=0;i<4;i++)tor(.16,.025,-.05+i*.11,.86,.45,i%2?red:purple).rotation.y=Math.PI/2;
   const lines=[[[-1.75,1.4,-.5],[-1.75,1.4,.9]],[[-1.75,1.4,.9],[.25,1.4,.9]],[[.25,1.4,.9],[1.4,1.25,.85]],[[1.4,1.25,.85],[1.4,1.17,-.55]],[[1.2,.8,-.55],[-1.05,.8,-.55]]];
   for(let i=0;i<lines.length;i++)rod(lines[i][0],lines[i][1],.026,i%2?green:red);
   label("LOW VOLTAGE EXPERIMENT",0,2.5,0);
   label("CELL / RESISTOR / METER",0,.2,1.2);
 }

 function spherometerInstrument(v){
  const [a=30,h=.6,pitch=.5,divisions=50]=v;
  const brass=mat(0xd8a84f,.87,.23),goldLight=mat(0xf4cd81,.76,.22);
  const iron=mat(0x353c46,.78,.3),chrome=mat(0xd8e2ee,.92,.16);
  const ink=mat(0x262c36,.18,.8),clear=mat(0x85c4dd,.1,.12,{transparent:true,opacity:.38,depthWrite:false});
  const mode=scene.userData.surfaceMode||"convex";
  const legOffset=Math.max(.5,Math.min(1.0,a/34));
  const points=[];
  // Polished black three-arm frame and pointed steel support legs
  const hub=new THREE.Vector3(0,1.37,0);
  for(let i=0;i<3;i++){
    const angle=i*2*Math.PI/3+.55;
    const x=Math.cos(angle)*legOffset,z=Math.sin(angle)*legOffset;
    points.push([x,z]);
    rod([0,1.37,0],[x,1.37,z],.17,iron);
    rod([x,1.34,z],[x,.63,z],.065,chrome);
    const tip=add(new THREE.ConeGeometry(.084,.22,16),chrome,x,.55,z);tip.rotation.z=Math.PI;
    cyl(.125,.125,.1,x,1.32,z,brass);
  }
  // Optically flat glass below the legs
  const plate=cyl(2.1,2.1,.065,0,.425,0,clear);
  const rim=tor(2.08,.018,0,.467,0,chrome);rim.rotation.x=Math.PI/2;
  // Curved test specimen and slide, separate visibly colored material.
  if(mode==="slide"){
    box(1.38,.12,1.3,0,.53,0,clear);
    box(1.36,.018,1.28,0,.60,0,mat(0xa7e8ef,.05,.1,{transparent:true,opacity:.4}));
  }else if(mode==="convex"||mode==="concave"){
    const shape=new THREE.SphereGeometry(1.33,48,18,0,Math.PI*2,mode==="convex"?0:Math.PI/2,Math.PI/2);
    const test=add(shape,mat(0x72b8d5,.11,.13,{transparent:true,opacity:.33,side:THREE.DoubleSide,depthWrite:false}),0,mode==="convex"?-0.38:1.63,0);
    test.scale.y=mode==="convex"?.12:-.12;
  }
  // Precision spindle with thread markings; driven by contact displacement
  const rise=Math.max(-.45,Math.min(.52,h/2));
  rod([0,.63+rise,0],[0,2.54+rise,0],.088,chrome);
  const lowerTip=add(new THREE.ConeGeometry(.1,.2,20),chrome,0,.58+rise,0);lowerTip.rotation.z=Math.PI;
  for(let j=0;j<22;j++){
    let ring=tor(.098,.012,0,1.2+j*.049+rise,0,iron);ring.rotation.x=Math.PI/2;
  }
  // Engraved brass graduated circular scale
  cyl(.92,.92,.09,0,2.30+rise,0,brass);
  const disc=tor(.91,.018,0,2.36+rise,0,goldLight);disc.rotation.x=Math.PI/2;
  for(let j=0;j<50;j++){
    const angle=j*2*Math.PI/50;
    const r=j%5===0?.68:.78;
    rod([Math.cos(angle)*r,2.36+rise,Math.sin(angle)*r],[Math.cos(angle)*.86,2.36+rise,Math.sin(angle)*.86],j%5===0?.011:.006,ink);
  }
  cyl(.22,.22,.42,0,2.65+rise,0,brass);
  for(let j=0;j<24;j++){
    const angle=j*2*Math.PI/24;rod([.223*Math.cos(angle),2.44+rise,.223*Math.sin(angle)],[.223*Math.cos(angle),2.85+rise,.223*Math.sin(angle)],.012,iron);
  }
  // Vertical pitch scale with divisions on one support arm
  box(.18,1.2,.07,1.28,1.69,0,brass);
  for(let j=0;j<21;j++)box(j%5===0?.11:.055,.008,.08,1.28,1.15+j*.054,.045,ink);
  rod([1.14,2.31+rise,0],[.98,2.31+rise,0],.017,ink);
  label("SPHEROMETER  ·  BRASS + STEEL",0,3.55,0);
  label("CENTRAL MICROMETER SCREW",1.68,2.7,.15);
  label(mode==="flat"?"FLAT REFERENCE":mode==="slide"?"MICROSCOPE SLIDE":mode==="concave"?"CONCAVE SURFACE":"CONVEX SURFACE",0,.28,2.2);
 }

 function travellingMicroscope(v){
   const steel=mat(0xd2dce7,.86,.2),black=mat(0x202935,.28,.45);
   const optic=mat(0x6db8cc,.18,.12,{transparent:true,opacity:.55}),knob=mat(0xd29f52,.75,.28);
   const navy=mat(0x263e55,.45,.44);
   box(4.4,.3,2.75,0,.35,0,navy);
   for(let x of [-1.65,1.65]){rod([x,.45,-.8],[x,.45,1],.1,steel)}
   // Stable vertical graduated column, microscope carriage and lateral rack.
   rod([-.85,.48,-.7],[-.85,3.7,-.7],.14,steel);
   const vertical=Math.max(1.4,Math.min(3,1.25+(v[0]||21)*.028));
   box(.75,.44,.77,-.85,vertical,-.7,black);
   box(2.8,.16,.28,.45,vertical,-.7,steel);
   for(let j=0;j<23;j++){
    const y=.72+j*.125;box(.22,.012,.035,-.85,y,-.51,j%5===0?black:steel)
   }
   let horizontal=Math.max(-.2,Math.min(1.2,(v[1]||4)*.06));
   let tube=cyl(.38,.38,1.6,.6+horizontal,vertical,-.7,black);
   tube.rotation.z=Math.PI/2;
   let objective=cyl(.29,.29,.42,1.53+horizontal,vertical,-.7,steel);objective.rotation.z=Math.PI/2;
   let eyepiece=cyl(.43,.43,.42,-.38+horizontal,vertical,-.7,steel);eyepiece.rotation.z=Math.PI/2;
   let eyeglass=cyl(.34,.34,.018,-.64+horizontal,vertical,-.7,optic);eyeglass.rotation.z=Math.PI/2;
   for(let i=0;i<2;i++)cyl(.18,.18,.15,-.7,vertical+.32+i*.32,-.15,knob).rotation.x=Math.PI/2;
   box(1.8,.14,1.6,.8,.63,.05,steel);
   box(1.48,.09,1.22,.8,.73,.05,optic);
   // specimen with visible crosshair focusing reference
   line2();
   function line2(){rod([.5,.79,.05],[1.15,.79,.05],.009,knob);rod([.82,.79,-.24],[.82,.79,.34],.009,knob)}
   label("TRAVELLING MICROSCOPE",0,4.08,0);
   label("VERTICAL VERNIER SCALE",-1.4,3.35,0);
   label("FOCUS / HORIZONTAL CARRIAGE",1.1,2.55,0);
 }

 function makeInteractiveEquipment(p,v){
   // Moveable real geometry representing each practical's accessory or test sample.
   // The user must drag it from the storage tray to the marked work zone.
   const station=mat(0x274b49,.3,.6),border=mat(0x71f1cb,.2,.4,{transparent:true,opacity:.7});
   const home=[-2.45,.68,1.63],target=[1.45,.68,.65];
   box(1.8,.04,1.3,home[0],.51,home[2],mat(0x45566d,.5,.36));
   box(1.8,.04,1.3,target[0],.51,target[2],station);
   const ring=tor(.48,.023,target[0],.56,target[2],border);ring.rotation.x=Math.PI/2;
   const block=new THREE.Group();objects.add(block);
   const style=p.model;
   let name="Test specimen";
   if(["lens","concave","prism","critical","angles","refractive"].includes(style)){
      name=style==="lens"||style==="concave"?"Optical lens":"Glass prism";
      if(style==="lens"||style==="concave"){const glassDisc=add(new THREE.SphereGeometry(.45,24,16),glass,0,.25,0,block);glassDisc.scale.x=.2}
      else{let prism=add(new THREE.CylinderGeometry(.42,.42,.55,3),glass,0,.25,0,block);prism.rotation.y=.4}
   }else if(["cell","temperature","potentiometer","internal","diode","transistor","gates"].includes(style)){
      name="Circuit component";
      add(new THREE.BoxGeometry(.76,.29,.36),dark,0,.15,0,block);
      for(let i=-1;i<=1;i++)rod([i*.25,.15,-.3],[i*.25,.15,.3],.018,metal,block);
   }else if(["sonometer","resonance","wave","spring","pendulum"].includes(style)){
      name=style==="resonance"?"Tuning fork":"Calibration weight";
      if(style==="resonance"){
       rod([-.18,.06,0],[-.18,.66,0],.038,metal,block);
       rod([.18,.06,0],[.18,.66,0],.038,metal,block);
       rod([0,.05,0],[0,-.07,0],.06,metal,block);
      }else{
       add(new THREE.CylinderGeometry(.34,.34,.35,20),gold,0,.2,0,block);
       add(new THREE.TorusGeometry(.16,.03,9,24),metal,0,.41,0,block).rotation.x=Math.PI/2;
      }
   }else if(["calorimetry","fusion","vapor","cooling","humidity","gas","charles","pressure","conductivity"].includes(style)){
      name="Thermal sample vessel";
      add(new THREE.CylinderGeometry(.34,.28,.6,24),glass,0,.31,0,block);
      add(new THREE.CylinderGeometry(.28,.26,.2,24),water,0,.15,0,block);
   }else if(["vernier","micrometer","spherometer"].includes(style)||p.id==="04"){
      name=p.id==="04"?"Microscope glass slide":style==="spherometer"?"Glass specimen":"Metal test piece";
      add(new THREE.BoxGeometry(.8,.12,.5),style==="spherometer"||p.id==="04"?glass:metal,0,.11,0,block);
   }else{
      name="Experiment test mass";
      add(new THREE.CylinderGeometry(.34,.34,.38,20),gold,0,.22,0,block);
   }
   const bbox=new THREE.Box3().setFromObject(block);
   // Invisible stable hit target covers complex thin equipment while retaining raycasting.
   const hitMesh=new THREE.Mesh(new THREE.BoxGeometry(1.05,.75,.85),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
   hitMesh.position.set(0,.3,0);block.add(hitMesh);
   addPickable(block,name,home,target,.65);
   label("PICK UP & PLACE",home[0],1.35,home[2]);
   label("WORK ZONE",target[0],1.3,target[2]);
   // Second draggable instrument part: these are separately positionable and
   // have their own highlighted assembly station.
   const home2=[-2.5,.69,-1.6],target2=[2.45,.69,-1.4];
   box(1.5,.04,1.13,home2[0],.51,home2[2],mat(0x4b5568,.5,.38));
   box(1.5,.04,1.13,target2[0],.51,target2[2],station);
   const secondZone=tor(.37,.022,target2[0],.56,target2[2],border);secondZone.rotation.x=Math.PI/2;
   const accessory=new THREE.Group();objects.add(accessory);
   let secondName="Calibration ruler";
   if(p.id==="04"){
      secondName="Microscope focusing knob";
      add(new THREE.CylinderGeometry(.28,.28,.22,24),dark,0,.24,0,accessory).rotation.z=Math.PI/2;
      for(let i=0;i<14;i++){let angle=2*Math.PI*i/14;rod([0,.24+.27*Math.sin(angle),.27*Math.cos(angle)],[.2,.24+.27*Math.sin(angle),.27*Math.cos(angle)],.011,metal,accessory)}
   }else if(["cell","temperature","potentiometer","internal","diode","transistor","gates"].includes(style)){
      secondName="Connecting lead";
      rod([-.35,.18,-.18],[.35,.18,.18],.048,red,accessory);
      sphere(.105,-.4,.18,-.2,metal,accessory);
      sphere(.105,.4,.18,.2,metal,accessory);
   }else if(["lens","concave","prism","critical","angles","refractive"].includes(style)){
      secondName="Light source";
      add(new THREE.BoxGeometry(.59,.3,.45),dark,0,.2,0,accessory);
      sphere(.12,.34,.2,0,gold,accessory);
   }else if(["sonometer","resonance","spring","pendulum"].includes(style)){
      secondName="Metre scale";
      add(new THREE.BoxGeometry(.98,.06,.22),metal,0,.16,0,accessory);
      for(let i=0;i<10;i++)add(new THREE.BoxGeometry(.012,.009,i%5===0?.2:.11),dark,-.45+i*.1,.2,0,accessory);
   }else if(["gas","charles","pressure","cooling","fusion","vapor","calorimetry","humidity","conductivity"].includes(style)){
      secondName="Thermometer";
      rod([0,.12,0],[0,.84,0],.035,metal,accessory);
      sphere(.09,0,.12,0,red,accessory);
   }else{
      secondName="Measuring scale";
      add(new THREE.BoxGeometry(.95,.07,.25),metal,0,.15,0,accessory);
      for(let i=0;i<9;i++)add(new THREE.BoxGeometry(.012,.009,.15),dark,-.42+i*.1,.2,0,accessory);
   }
   const targetMesh=new THREE.Mesh(new THREE.BoxGeometry(.98,.85,.72),new THREE.MeshBasicMaterial({transparent:true,opacity:0,depthWrite:false}));
   targetMesh.position.y=.28;accessory.add(targetMesh);
   addPickable(accessory,secondName,home2,target2,.63);
   label("2ND TOOL",home2[0],1.34,home2[2]);
   label("ASSEMBLY ZONE",target2[0],1.34,target2[2]);
 }
 function apparatus(p,v){
 moving=[];const n=p.id;
 const style=p.model;
 // every scene uses an apparatus-dependent 3D configuration
 if(buildDistinctApparatus(scene,p,v,objects))return;
 if(p.id==="04"){travellingMicroscope(v);return}
 if(style==="spherometer"){spherometerInstrument(v);return}
 if(style==="vernier"){realisticVernier(v);return}
 if(style==="micrometer"){realisticMicrometer(v);return}
 if(style==="pendulum"){realisticPendulum(v);return}
 if(style==="sonometer"){detailedSonometer(v);return}
 if(style==="prism"||style==="critical"||style==="angles"){detailedPrism(v);return}
 if(style==="cell"||style==="temperature"||style==="potentiometer"||style==="internal"){detailedCircuit(v);return}
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
 let initialized=false;
 function update(p,values){const positions=pickables.map(item=>({name:item.name,position:item.obj.position.clone()}));for(const child of [...objects.children]){objects.remove(child);child.traverse?.(o=>{o.geometry?.dispose();if(o.material?.map?.isCanvasTexture)o.material.map.dispose();if(o.material?.isSpriteMaterial)o.material.dispose()})}pickables.length=0;apparatus(p,values);makeInteractiveEquipment(p,values);for(const item of pickables){const previous=positions.find(x=>x.name===item.name);if(previous)item.obj.position.copy(previous.position)}if(!initialized){camera.position.set(7,5.5,8);controls.target.set(0,1.35,0);initialized=true}controls.update()}
 let active=true,frame=0,last=0;
 function render(ms){if(!active)return;const dt=Math.min(.05,(ms-last)/1000||0);last=ms;frame+=dt;for(const f of moving)f(frame);const w=host.clientWidth,h=host.clientHeight;if(w&&h&&(renderer.domElement.width!==Math.round(w*renderer.getPixelRatio())||renderer.domElement.height!==Math.round(h*renderer.getPixelRatio()))){renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()}controls.update();renderer.render(scene,camera);requestAnimationFrame(render)}
 requestAnimationFrame(render);
 function resetCamera(){camera.position.set(7,5.5,8);controls.target.set(0,1.35,0);controls.update()}
 function setSurfaceMode(mode){scene.userData.surfaceMode=mode}
 function setCameraView(preset){
  const pos={front:[0,3,9],side:[9,3,0],top:[.1,10,.1],iso:[7,5.5,8]}[preset]||[7,5.5,8];
  camera.position.set(...pos);controls.target.set(0,1.35,0);controls.update();
 }
 function setDragEnabled(value){dragEnabled=!!value;renderer.domElement.style.cursor=dragEnabled?"grab":"auto"}
 function resetEquipment(){for(const item of pickables)item.obj.position.copy(item.home);interactionListener({type:"reset",remaining:pickables.length})}
 function setInteractionListener(fn){interactionListener=typeof fn==="function"?fn:()=>{};return()=>{interactionListener=()=>{}}}
 function dispose(){active=false;controls.dispose();renderer.domElement.removeEventListener("pointerdown",onDown,true);renderer.domElement.removeEventListener("pointermove",onMove);renderer.domElement.removeEventListener("pointerup",finishDrag);renderer.domElement.removeEventListener("pointercancel",finishDrag);objects.traverse(o=>{o.geometry?.dispose();if(o.material?.isSpriteMaterial){o.material.map?.dispose();o.material.dispose()}});renderer.dispose();renderer.domElement.remove()}
 return {update,resetCamera,setCameraView,setSurfaceMode,setDragEnabled,resetEquipment,setInteractionListener,dispose};
}
