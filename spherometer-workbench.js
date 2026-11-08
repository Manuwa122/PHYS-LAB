/** Guided virtual spherometer experiment, with idealized micrometer readings.
 * Never represents physically sensed contact or a certified apparatus.
 */
export function attachSpherometerWorkbench(parent,{getValues,setValues,setSurface,capture}){
 const card=document.createElement("section");card.className="precision-lab";
 card.innerHTML=`<div class="precision-title"><div><span class="precision-kicker">PRACTICAL 03 · INTERACTIVE INSTRUMENT</span><h3>Precision Spherometer Workbench</h3><p>Calibrate, select a surface, turn the screw, obtain virtual readings and calculate thickness or curvature.</p></div><span class="precision-live">SIMULATED</span></div>
 <div class="precision-options" role="group" aria-label="Choose specimen"><button data-surface="flat" class="selected">Flat reference</button><button data-surface="slide">Microscope slide</button><button data-surface="convex">Convex glass</button><button data-surface="concave">Concave glass</button></div>
 <div class="precision-grid">
 <label>Micrometer pitch (mm/turn)<select id="pitch"><option value="0.5">0.50 mm</option><option value="1">1.00 mm</option></select></label>
 <label>Circular scale divisions<select id="divisions"><option value="50">50 divisions</option><option value="100">100 divisions</option></select></label>
 <label>Simulated zero error (mm)<input type="number" id="zero" min="-0.1" max="0.1" step=".01" value="0"></label>
 <label>Reference reading (mm)<input type="number" id="reference" min="-1" max="1" step=".01" value="0"></label>
 </div>
 <div class="precision-screw"><div><strong>Rotate central screw</strong><small>Each click = one circular division</small></div><div class="precision-buttons"><button id="screwdown">− 1 div</button><button id="screwup">+ 1 div</button><button id="contact">Touch surface</button></div></div>
 <div class="precision-readouts"><div><span>Least count</span><strong id="least">0.010 mm</strong></div><div><span>Vertical scale</span><strong id="mainread">0.00 mm</strong></div><div><span>Circular scale</span><strong id="circularread">0</strong></div><div><span>Corrected reading</span><strong id="corrected">0.00 mm</strong></div></div>
 <p id="contactstatus" class="precision-message" aria-live="polite"></p>
 <div class="precision-result"><div><small>Derived quantity</small><strong id="value">—</strong></div><div><small>Analysis</small><span id="analysis"></span></div></div>
 <div class="precision-actions"><button id="record" class="primary">Record simulated observation</button><button id="reset" class="ghost">Reset calibration</button></div>
 <div class="precision-steps"><b>Experimental sequence</b><ol><li>Place instrument on a plane glass reference and find zero reading.</li><li>Insert microscope slide or choose convex/concave glass and turn the screw to just touch.</li><li>Read the vertical scale and circular graduations; apply the zero correction.</li><li>For a slide, compare with flat reference. For a curved surface, measure leg spacing and calculate the radius.</li><li>Repeat observations and report measurement uncertainty.</li></ol></div>
 <p class="precision-disclaimer">Virtual educational model: contact and readings are generated from inputs. Zero error and screw divisions are simulated; verify the actual procedure against the NIE handbook.</p>`;
 parent.append(card);
 const $=name=>card.querySelector("#"+name);
 let surface="flat",position=0,zero=0,reference=0,pitch=.5,divisions=50;
 const targets={flat:0,slide:.72,convex:.6,concave:-.6};
 function sync(){
  const lc=pitch/divisions;
  const raw=reference+position+zero,corrected=raw-zero;
  const turns=Math.floor(Math.abs(raw)/pitch);
  const circular=Math.round(((raw%pitch)+pitch)%pitch/lc)%divisions;
  $("least").textContent=lc.toFixed(3)+" mm";
  $("mainread").textContent=(Math.trunc(raw/pitch)*pitch).toFixed(2)+" mm";
  $("circularread").textContent=String(circular)+"/"+divisions;
  $("corrected").textContent=corrected.toFixed(3)+" mm";
  const h=Math.abs(position),a=getValues()[0];
  let result,analysis;
  if(surface==="flat"){result="Reference surface";analysis="Set the reference reading before inserting a specimen."}
  else if(surface==="slide"){result=h.toFixed(3)+" mm thickness";analysis="Thickness = |corrected slide reading − flat reference|."}
  else if(h>.00000001){const R=a*a/(6*h)+h/2;result=(R/10).toFixed(3)+" cm";analysis="R = a²/(6h) + h/2; "+(surface==="concave"?"concave surface":"convex surface")+"; a = "+a.toFixed(1)+" mm."}
  else{result="Turn the screw";analysis="Nonzero sagitta h is required to calculate curvature."}
  $("value").textContent=result;$("analysis").textContent=analysis;
  const target=targets[surface],error=Math.abs(position-target);
  $("contactstatus").textContent=error<=lc/2+.000001?"✓ Idealized contact reached":position>target?"Screw is beyond the idealized contact point":"Screw is above the idealized contact point";
  const v=getValues();setValues([v[0],h,pitch,divisions],surface);
 }
 function setMode(mode){
  surface=mode;
  card.querySelectorAll("[data-surface]").forEach(x=>x.classList.toggle("selected",x.dataset.surface===mode));
  setSurface(mode);
  position=0;sync();
 }
 for(const b of card.querySelectorAll("[data-surface]"))b.onclick=()=>setMode(b.dataset.surface);
 $("pitch").onchange=()=>{pitch=Number($("pitch").value);sync()};
 $("divisions").onchange=()=>{divisions=Number($("divisions").value);sync()};
 $("zero").oninput=()=>{zero=Number($("zero").value)||0;sync()};
 $("reference").oninput=()=>{reference=Number($("reference").value)||0;sync()};
 $("screwup").onclick=()=>{position=Math.min(3,Number((position+pitch/divisions).toFixed(5)));sync()};
 $("screwdown").onclick=()=>{position=Math.max(-3,Number((position-pitch/divisions).toFixed(5)));sync()};
 $("contact").onclick=()=>{position=targets[surface];sync()};
 $("record").onclick=()=>capture({surface,reading:reference+position+zero,corrected:reference+position,zero,displacement:position,leastCount:pitch/divisions,legSpacing:getValues()[0]});
 $("reset").onclick=()=>{position=0;zero=0;reference=0;pitch=.5;divisions=50;$("pitch").value=".5";$("divisions").value="50";$("zero").value="0";$("reference").value="0";setMode("flat")};
 const initial=getValues();position=surface==="flat"?0:initial[1];sync();
 return {onExternalValues(){sync()},dispose(){}};
}
