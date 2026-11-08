import * as THREE from "three";

/**
 * PHYS·LAB atmospheric studio props, suitable for mobile WebGL.
 * Procedural materials: no external texture downloads or HDR dependency.
 * These improve presentation but are not photogrammetry or scanned GLB assets.
 */
export function createPremiumLab(scene,renderer){
 const studio=new THREE.Group();studio.name="PHYS-LAB studio environment";scene.add(studio);
 const mat=(color,metalness=.1,roughness=.55,extra={})=>new THREE.MeshStandardMaterial({color,metalness,roughness,...extra});
 const carbon=mat(0x172335,.22,.64),brass=mat(0xc69c55,.67,.29),screenGlass=mat(0x15233a,.1,.18);
 const oak=mat(0x8c684d,.08,.48),sheet=mat(0xe9eff1,.02,.84),ink=mat(0x33465c,.03,.7);
 const accent=mat(0x8ee5dd,.28,.28,{emissive:0x16736b,emissiveIntensity:.2});
 const add=(geo,m,x,y,z,parent=studio)=>{const obj=new THREE.Mesh(geo,m);obj.position.set(x,y,z);obj.castShadow=true;obj.receiveShadow=true;parent.add(obj);return obj};
 const box=(w,h,d,x,y,z,m)=>add(new THREE.BoxGeometry(w,h,d),m,x,y,z);
 const rod=(a,b,r,m)=>{const start=new THREE.Vector3(...a),end=new THREE.Vector3(...b),dir=end.clone().sub(start);const obj=add(new THREE.CylinderGeometry(r,r,dir.length(),12),m,...start.add(end).multiplyScalar(.5).toArray());obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize());return obj};
 // Procedural oak worktop, with low-cost canvas grain.
 const grainCanvas=document.createElement("canvas");grainCanvas.width=512;grainCanvas.height=256;
 const g=grainCanvas.getContext("2d");g.fillStyle="#87684f";g.fillRect(0,0,512,256);
 for(let i=0;i<95;i++){const y=(i*59+13)%256;const alpha=.035+(i%5)*.012;g.strokeStyle="rgba(36,20,15,"+alpha+")";g.lineWidth=1+(i%3);g.beginPath();g.moveTo(0,y);g.bezierCurveTo(120,y+((i%7)-3)*2,350,y+((i%9)-4)*2,512,y);g.stroke()}
 const grain=new THREE.CanvasTexture(grainCanvas);grain.colorSpace=THREE.SRGBColorSpace;grain.wrapS=THREE.RepeatWrapping;grain.wrapT=THREE.RepeatWrapping;grain.repeat.set(1.2,.8);grain.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());
 const worktop=new THREE.MeshStandardMaterial({map:grain,metalness:.04,roughness:.58});
 box(10,.15,6.7,0,.17,0,worktop);
 box(10,.065,.12,0,.11,3.29,brass);
 box(10,.075,.14,0,.11,-3.29,carbon);
 // Backlit slate wall, oak cabinets and amber instrument shelf.
 box(12,5.5,.16,0,3.35,-6.9,mat(0x20314b,.02,.9));
 box(5.2,2.1,.12,0,3.7,-6.7,mat(0x111e2b,.02,.8));
 box(5.25,.045,.16,0,4.75,-6.56,brass);
 box(5.25,.045,.16,0,2.65,-6.56,brass);
 for(let x of [-5.2,5.2]){
   box(2.1,.12,.72,x,2.45,-5.6,oak);
   box(2.1,.12,.72,x,4.15,-5.6,oak);
   for(let k=0;k<3;k++){
     const flask=add(new THREE.CylinderGeometry(.13+.04*k,.19,.48,16),mat([0x398db1,0x57a8a1,0xa084c5][k],.1,.19,{transparent:true,opacity:.6,depthWrite:false}),x-.65+k*.61,2.76,-5.62);
     add(new THREE.CylinderGeometry(.035,.035,.16,12),accent,flask.position.x,3.06,-5.62);
   }
 }
 // Desk notebook & pencil: physical props off the central apparatus workspace.
 const notebook=new THREE.Group();studio.add(notebook);notebook.position.set(-3.9,.42,2.42);
 box(1.1,.045,.79,-3.9,.43,2.42,sheet);
 for(let j=0;j<9;j++)rod([-4.34,.463,2.11+j*.065],[-3.55,.463,2.11+j*.065],.003,ink);
 for(let j=0;j<8;j++)add(new THREE.TorusGeometry(.022,.007,6,14),carbon,-4.42,.473,2.13+j*.085).rotation.x=Math.PI/2;
 rod([-3.2,.46,2.73],[-2.48,.46,2.21],.024,brass);
 // Bench laptop with live-looking graph panel: placed away from movable object targets.
 const computer=new THREE.Group();studio.add(computer);computer.position.set(3.67,.37,-2.1);computer.rotation.y=-.3;
 const laptopBase=add(new THREE.BoxGeometry(1.65,.055,1.15),mat(0x4c586d,.55,.29),0,.13,0,computer);
 const laptopScreen=add(new THREE.BoxGeometry(1.65,1.05,.06),carbon,0,.7,-.54,computer);laptopScreen.rotation.x=-.14;
 const canvas=document.createElement("canvas");canvas.width=512;canvas.height=320;
 const ctx=canvas.getContext("2d");ctx.fillStyle="#0a152b";ctx.fillRect(0,0,512,320);
 ctx.fillStyle="#75e5cf";ctx.font="bold 24px Arial";ctx.fillText("PHYS·LAB",23,39);
 ctx.fillStyle="#afbfdf";ctx.font="15px Arial";ctx.fillText("EXPERIMENT MONITOR",25,66);
 ctx.strokeStyle="#36516b";ctx.lineWidth=2;
 for(let i=0;i<7;i++){ctx.beginPath();ctx.moveTo(35+i*70,92);ctx.lineTo(35+i*70,270);ctx.stroke()}
 for(let i=0;i<5;i++){ctx.beginPath();ctx.moveTo(35,94+i*43);ctx.lineTo(488,94+i*43);ctx.stroke()}
 ctx.beginPath();for(let i=0;i<100;i++){const x=37+i*4.5,y=240-82*Math.sin(i*.047)-30*Math.cos(i*.084);i?ctx.lineTo(x,y):ctx.moveTo(x,y)}
 ctx.strokeStyle="#79cfff";ctx.lineWidth=5;ctx.stroke();
 ctx.fillStyle="#e1a86b";ctx.beginPath();ctx.arc(278,129,8,0,Math.PI*2);ctx.fill();
 const texture=new THREE.CanvasTexture(canvas);texture.colorSpace=THREE.SRGBColorSpace;
 const display=add(new THREE.PlaneGeometry(1.53,.96),new THREE.MeshBasicMaterial({map:texture,side:THREE.DoubleSide}),0,.73,-.505,computer);display.rotation.x=-.14;
 for(let i=0;i<4;i++)for(let j=0;j<8;j++)add(new THREE.BoxGeometry(.145,.006,.11),carbon,-.58+j*.16,.17,-.24+i*.17,computer);
 // Soft studio highlights: shadow costs stay modest on mobile.
 const lamp1=new THREE.PointLight(0x93dfff,15,11);lamp1.position.set(-3.9,5,2);studio.add(lamp1);
 const lamp2=new THREE.PointLight(0xffd4a7,11,10);lamp2.position.set(3.4,4.6,1.2);studio.add(lamp2);
 const strip=add(new THREE.BoxGeometry(4.7,.04,.1),new THREE.MeshBasicMaterial({color:0xa9dbff}),0,5.45,-4.5);
 // Do not block picking in foreground: all studio objects are outside scene's pickables.
 return ()=>{studio.traverse(obj=>{
   obj.geometry?.dispose();
   const materials=Array.isArray(obj.material)?obj.material:[obj.material];
   for(const material of materials){if(material?.map){material.map.dispose()}material?.dispose?.()}
 });scene.remove(studio)}
}
