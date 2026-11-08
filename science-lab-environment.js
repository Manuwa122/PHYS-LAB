import * as THREE from "three";

/**
 * Physics lab architectural environment.
 * Geometry and generated canvas textures are intentionally self-contained.
 * Apparatus remain in the foreground, with the room furniture behind them.
 */
export function createScienceLab(scene, renderer) {
  const root=new THREE.Group(); root.name="Modern physics laboratory";scene.add(root);
  const materials=new Set(),textures=new Set();
  const mat=(color,metalness=0,roughness=.62,extra={})=>{
    const m=new THREE.MeshPhysicalMaterial({color,metalness,roughness,...extra});materials.add(m);return m;
  };
  const white=mat(0xe2eaf0,.05,.46),plaster=mat(0xcddde9,0,.84),trim=mat(0x6a899e,.7,.27);
  const charcoal=mat(0x243347,.45,.41),oak=mat(0x9c744f,.09,.56),brass=mat(0xb38f55,.73,.26);
  const glass=mat(0xa5e6f0,.05,.13,{transparent:true,opacity:.37,side:THREE.DoubleSide,depthWrite:false,clearcoat:.9});
  const water=mat(0x39aee0,.05,.18,{transparent:true,opacity:.7,depthWrite:false,clearcoat:1});
  const ceramic=mat(0xf6f9fb,.04,.34),dark=mat(0x183346,.09,.79),green=mat(0x399c7f,.32,.28);
  const blue=mat(0x388fb2,.34,.28),amber=mat(0xe29e50,.24,.24);
  const transparent=mat(0xb4d7ea,.03,.12,{transparent:true,opacity:.2,depthWrite:false,side:THREE.DoubleSide});
  const simple=(geo,m,pos,parent=root)=>{const o=new THREE.Mesh(geo,m);o.position.set(...pos);o.castShadow=false;o.receiveShadow=true;parent.add(o);return o};
  const box=(w,h,d,x,y,z,m=white,parent=root)=>simple(new THREE.BoxGeometry(w,h,d),m,[x,y,z],parent);
  const tube=(r1,r2,h,x,y,z,m=glass,parent=root)=>simple(new THREE.CylinderGeometry(r1,r2,h,16),m,[x,y,z],parent);
  const sphere=(r,x,y,z,m=glass,parent=root)=>simple(new THREE.SphereGeometry(r,16,12),m,[x,y,z],parent);
  const line=(a,b,r,m=trim,parent=root)=>{
    const A=new THREE.Vector3(...a),B=new THREE.Vector3(...b),d=B.clone().sub(A);
    const obj=simple(new THREE.CylinderGeometry(r,r,d.length(),10),m,A.clone().add(B).multiplyScalar(.5).toArray(),parent);
    obj.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d.normalize());return obj;
  };
  const canvasTexture=(w,h,paint)=>{
    const canvas=document.createElement("canvas");canvas.width=w;canvas.height=h;
    const ctx=canvas.getContext("2d");paint(ctx,w,h);
    const t=new THREE.CanvasTexture(canvas);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=Math.min(4,renderer.capabilities.getMaxAnisotropy());textures.add(t);return t;
  };
  const wallMap=canvasTexture(1024,512,(c,w,h)=>{
    c.fillStyle="#dbe5ea";c.fillRect(0,0,w,h);
    const cols=24,rows=12;
    for(let y=0;y<rows;y++)for(let x=0;x<cols;x++){
      const v=220+((x*13+y*17)%9);
      c.fillStyle="rgb("+Math.min(255,v)+","+Math.min(255,v+10)+","+Math.min(255,v+15)+")";
      c.fillRect(x*w/cols+2,y*h/rows+2,w/cols-4,h/rows-4);
    }
    c.strokeStyle="#aabcc5";c.lineWidth=1;
    for(let i=0;i<=cols;i++){c.beginPath();c.moveTo(i*w/cols,0);c.lineTo(i*w/cols,h);c.stroke()}
    for(let i=0;i<=rows;i++){c.beginPath();c.moveTo(0,i*h/rows);c.lineTo(w,i*h/rows);c.stroke()}
  });
  const floorMap=canvasTexture(512,512,(c,w,h)=>{
    c.fillStyle="#a4b6bf";c.fillRect(0,0,w,h);
    for(let y=0;y<8;y++)for(let x=0;x<8;x++){
      const v=162+(x*7+y*13)%20;c.fillStyle="rgb("+v+","+(v+12)+","+(v+18)+")";
      c.fillRect(x*64+2,y*64+2,60,60);
    }
    c.strokeStyle="#718e9e";c.lineWidth=2;
    for(let i=0;i<=8;i++){c.beginPath();c.moveTo(i*64,0);c.lineTo(i*64,512);c.moveTo(0,i*64);c.lineTo(512,i*64);c.stroke()}
  });
  const woodMap=canvasTexture(1024,256,(c,w,h)=>{
    c.fillStyle="#9b7554";c.fillRect(0,0,w,h);
    for(let i=0;i<120;i++){const y=(i*73+17)%h;c.beginPath();c.lineWidth=(i%3)+.5;c.strokeStyle="rgba(55,29,13,"+(.03+i%7*.007)+")";c.moveTo(0,y);c.bezierCurveTo(220,y+Math.sin(i)*7,650,y+Math.cos(i)*5,w,y);c.stroke()}
  });
  const wall=mat(0xffffff,0,.88,{map:wallMap});
  const tiles=mat(0xffffff,0,.79,{map:floorMap});
  const worktop=mat(0xffffff,.1,.48,{map:woodMap,clearcoat:.16});
  const grey=mat(0x788e9b,.26,.58);
  // Fixed room shell. Do not place any wall in front of the central apparatus.
  box(15,7,.18,0,3.25,-8.7,wall);
  box(.18,7,17,-7.5,3.25,-.25,wall);
  box(.18,7,17,7.5,3.25,-.25,wall);
  box(15,.15,17,0,-.18,-.25,tiles);
  box(15,.14,17,0,6.66,-.25,plaster);
  // Lab baseboard and horizontal metal panel trim.
  box(14.8,.13,.12,0,.26,-8.52,trim);
  box(14.8,.08,.16,0,2.25,-8.52,white);
  box(14.8,.06,.15,0,5.97,-8.52,white);
  // Bright laboratory bench with open central working region.
  box(10.8,.2,6.85,0,.13,0,worktop);
  box(10.8,.06,.1,0,.02,3.38,trim);
  box(10.8,.09,.12,0,.03,-3.38,trim);
  for(const x of [-4.75,4.75])for(const z of [-2.85,2.85])box(.15,.5,.15,x,-.2,z,trim);
  // Back cabinets and drawers with individual pulls.
  for(const x of [-5.95,5.95]){
    box(2.7,1.05,1.15,x,.56,-6.7,charcoal);
    for(let i=0;i<3;i++){
      box(2.45,.24,.025,x,.31+i*.29,-6.105,grey);
      box(.52,.038,.04,x,.31+i*.29,-6.07,trim);
    }
    box(2.8,.12,1.2,x,1.16,-6.7,worktop);
  }
  // Rear glass-door chemical & instruments cabinets, with contrasting compartments.
  for(const x of [-5.9,5.9]){
    box(2.65,3.35,.8,x,3.65,-8.16,charcoal);
    for(const level of [2.65,3.8,4.9])box(2.35,.065,.67,x,level,-7.72,trim);
    box(.045,3.25,.06,x,3.65,-7.69,white);
    for(const direction of [-1,1]){
      box(1.27,3.25,.033,x+direction*.65,3.65,-7.68,transparent);
      box(.042,.56,.07,x+direction*.12,3.55,-7.59,brass);
    }
    for(let i=0;i<7;i++){
      const px=x-1.04+(i%4)*.67,level=2.84+Math.floor(i/4)*1.23;
      const color=[blue,green,amber,water][i%4];
      tube(.11,.16,.47,px,level,-7.95,glass);
      tube(.095,.12,.18,px,level-.12,-7.95,color);
      tube(.075,.075,.12,px,level+.32,-7.95,trim);
    }
  }
  // Brushed steel floating shelves holding a range of recognisable science apparatus.
  for(const level of [2.48,4.65]){
    box(4.0,.09,.57,0,level,-7.16,oak);
    for(const x of [-1.6,1.6])box(.08,.35,.6,x,level-.19,-7.16,trim);
  }
  for(let i=0;i<6;i++){
    const x=-1.6+i*.63;
    if(i%3===0){
      // Erlenmeyer-shaped glass flask and stopper
      tube(.07,.07,.25,x,2.91,-7.13,glass);
      tube(.07,.25,.38,x,2.58,-7.13,glass);
      tube(.19,.2,.11,x,2.47,-7.13,water);
    }else if(i%3===1){
      tube(.19,.17,.55,x,2.78,-7.13,glass);
      tube(.17,.17,.21,x,2.61,-7.13,blue);
      for(let t=0;t<4;t++)line([x+.17,2.58+t*.08,-7.12],[x+.23,2.58+t*.08,-7.12],.004,trim);
    }else{
      sphere(.16,x,2.65,-7.13,glass);tube(.046,.046,.42,x,2.94,-7.13,glass);
    }
  }
  // Eye-catching instructional whiteboard, with genuinely rendered vector/graph markings.
  box(4.8,2.22,.06,0,4.05,-8.47,trim);
  const boardTex=canvasTexture(1024,512,(c,w,h)=>{
    c.fillStyle="#f6fafb";c.fillRect(0,0,w,h);
    c.fillStyle="#275a70";c.font="bold 41px Arial";c.fillText("PHYSICS LABORATORY",38,68);
    c.font="24px Arial";c.fillText("Observe  ·  Measure  ·  Analyse",39,104);
    c.strokeStyle="#abc8d5";c.lineWidth=2;
    for(let i=0;i<7;i++){c.beginPath();c.moveTo(55+i*85,177);c.lineTo(55+i*85,436);c.stroke()}
    for(let i=0;i<6;i++){c.beginPath();c.moveTo(55,178+i*51);c.lineTo(610,178+i*51);c.stroke()}
    c.strokeStyle="#168baa";c.lineWidth=7;c.beginPath();
    for(let i=0;i<=90;i++){const x=56+i*6,y=416-(i*1.72+Math.sin(i*.10)*21);i?c.lineTo(x,y):c.moveTo(x,y)}c.stroke();
    c.fillStyle="#ca7a39";c.font="bold 45px Georgia";c.fillText("F = ma",675,240);c.fillText("V = IR",675,315);c.fillText("T = 2π√(L/g)",655,390);
  });
  const board=mat(0xffffff,0,.84,{map:boardTex});
  box(4.65,2.08,.03,0,4.05,-8.40,board);
  // Safety signage at room edge, outside the apparatus line of sight.
  const posterTex=canvasTexture(256,384,(c)=>{
    c.fillStyle="#f4f9fa";c.fillRect(0,0,256,384);
    c.fillStyle="#218c79";c.fillRect(0,0,256,78);
    c.fillStyle="white";c.font="bold 30px Arial";c.fillText("LAB SAFETY",20,46);
    c.fillStyle="#233c51";c.font="20px Arial";
    ["Wear eye protection","Follow instructions","Use low voltage","Handle glass gently","Keep benches clear"].forEach((s,i)=>c.fillText("✓ "+s,13,116+i*52));
  });
  box(1.48,2.06,.04,-6.92,4.2,-8.40,mat(0xffffff,0,.8,{map:posterTex}));
  // Side window, morning diffuse daylight simulated by emissive panes.
  for(const x of [7.3,-7.3]){
    box(.2,2.6,3.2,x,4.15,1.1,white);
    const windowPanel=mat(0xb2dcec,.05,.18,{emissive:0x6c9fbc,emissiveIntensity:.35});
    box(.04,2.3,2.9,x>0?x-.12:x+.12,4.15,1.1,windowPanel);
    box(.07,.09,2.9,x>0?x-.14:x+.14,4.15,1.1,trim);
    box(.07,2.3,.09,x>0?x-.14:x+.14,4.15,1.1,trim);
  }
  // Utility sink and tap in rear left corner.
  box(1.42,.13,1,-6.0,1.31,-5.36,ceramic);
  box(.9,.07,.66,-6,1.37,-5.37,glass);
  line([-6.37,1.4,-5.5],[-6.37,1.94,-5.5],.04,trim);
  line([-6.37,1.94,-5.5],[-5.94,1.94,-5.5],.04,trim);
  line([-5.94,1.94,-5.5],[-5.94,1.66,-5.5],.04,trim);
  box(1.45,.72,1.02,-6,.86,-5.35,charcoal);
  // High-output shadow-free ceiling lighting and plausible fixtures.
  for(const x of [-4.1,0,4.1]){
    const lum=mat(0xe0efff,0,.5,{emissive:0xb9dcff,emissiveIntensity:1});
    box(2.9,.11,.75,x,6.42,-2.5,white);
    box(2.68,.036,.57,x,6.35,-2.5,lum);
  }
  for(const x of [-3,3]){
    const lamp=new THREE.PointLight(0xe8f6ff,21,13,2);lamp.position.set(x,5.8,1.0);root.add(lamp);
  }
  // Subtle attractive desk props: measurement notebook, writing instrument, laptop graph.
  box(1.13,.045,.83,-4.44,.38,2.56,white);
  for(let i=0;i<9;i++)line([-4.85,.414,2.24+i*.066],[-4.07,.414,2.24+i*.066],.003,trim);
  line([-3.79,.42,2.86],[-3.22,.42,2.42],.023,brass);
  const laptop=new THREE.Group();root.add(laptop);laptop.position.set(3.8,.29,-2.67);laptop.rotation.y=-.17;
  box(1.64,.07,1.08,0,.17,0,trim,laptop);
  const screen=box(1.67,1.0,.065,0,.72,-.55,charcoal,laptop);screen.rotation.x=-.12;
  const screenTex=canvasTexture(512,320,(c,w,h)=>{
    c.fillStyle="#081827";c.fillRect(0,0,w,h);c.fillStyle="#78e9cc";c.font="bold 25px Arial";c.fillText("PHYS·LAB",24,41);
    c.font="16px Arial";c.fillStyle="#c6d9ed";c.fillText("EXPERIMENT MONITOR",24,74);
    c.strokeStyle="#29445f";c.lineWidth=2;
    for(let x=35;x<475;x+=55){c.beginPath();c.moveTo(x,94);c.lineTo(x,280);c.stroke()}
    for(let y=96;y<282;y+=37){c.beginPath();c.moveTo(35,y);c.lineTo(475,y);c.stroke()}
    c.beginPath();c.strokeStyle="#68c9ef";c.lineWidth=5;
    for(let i=0;i<94;i++){const x=38+i*4.55,y=238-1.1*i-Math.sin(i/7)*25;if(!i)c.moveTo(x,y);else c.lineTo(x,y)}c.stroke();
  });
  const displayMat=new THREE.MeshBasicMaterial({map:screenTex,side:THREE.DoubleSide});materials.add(displayMat);
  const display=simple(new THREE.PlaneGeometry(1.53,.9),displayMat,[0,.73,-.503],laptop);display.rotation.x=-.12;
  for(let i=0;i<3;i++)for(let j=0;j<7;j++)box(.18,.007,.13,-.57+j*.19,.21,-.23+i*.17,charcoal,laptop);
  // Distinct emergency and optics corner props.
  box(.45,.72,.25,6.85,2.48,-5.2,green);
  box(.24,.35,.035,6.85,2.49,-5.05,white);
  line([6.85,2.35,-5.02],[6.85,2.64,-5.02],.018,green);
  line([6.7,2.5,-5.02],[7,2.5,-5.02],.018,green);
  return ()=>{
    root.traverse(o=>o.geometry?.dispose());
    for(const m of materials)m.dispose();
    for(const t of textures)t.dispose();
    scene.remove(root);
  };
}
