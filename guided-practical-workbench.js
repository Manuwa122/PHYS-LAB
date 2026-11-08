/**
 * Shared guided apparatus workbench for the 42 practical entries other than #03.
 * This is a repeatable simulator workflow, NOT a real-instrument digital twin.
 * Each experiment uses its own editable variable definitions and theoretical result.
 */
export function mountGuidedWorkbench(host,{experiment,parameters,getValues,setValues,calculate,guide}){
 let stage=0,observations=[],readingIndex=0,busy=false,seed=experiment.id.split("").reduce((a,c)=>a+c.charCodeAt(0),7);
 const lab=document.createElement("section");lab.className="guidedbench";
 const stages=["Inspect apparatus","Prepare & calibrate","Adjust and measure","Analyse results","Review / Viva"];
 const btn=(label,className)=>{const b=document.createElement("button");b.type="button";b.className=className||"gb-btn";b.textContent=label;return b};
 const title=document.createElement("div");title.className="gb-header";
 title.innerHTML='<span class="gb-eyebrow">PHYS·LAB / GUIDED INSTRUMENT STATION</span><h3></h3><p></p>';
 title.querySelector("h3").textContent=experiment.title;
 title.querySelector("p").textContent="Follow the practical sequence, configure the apparatus, collect simulated observations and interpret the prediction.";
 lab.append(title);
 const progress=document.createElement("div");progress.className="gb-progress";
 const main=document.createElement("div");main.className="gb-main";
 const body=document.createElement("div");body.className="gb-body";
 const side=document.createElement("div");side.className="gb-side";
 main.append(body,side);lab.append(progress,main);
 const footer=document.createElement("div");footer.className="gb-footer";
 const prev=btn("← Previous"),next=btn("Next step →","gb-next");
 const reset=btn("Reset session");
 footer.append(prev,reset,next);lab.append(footer);
 const warning=document.createElement("p");warning.className="gb-warning";
 warning.textContent="All apparatus interactions and readings here are schematic/idealized. They are not real measurements or a replacement for supervised NIE practical work.";
 lab.append(warning);host.append(lab);
 const samples=[];
 function fmt(n){if(!Number.isFinite(n))return "n/a";return Math.abs(n)>1e5?Number(n).toExponential(3):Number(n.toPrecision(5)).toString()}
 const modelResult=()=>{try{return calculate(getValues())}catch{return null}};
 const record=(manual=false)=>{
   const y=modelResult(),values=getValues();
   if(!y||!Number.isFinite(y[1])){status.textContent="Choose valid parameter values first.";return}
   // Deterministic small perturbations show why repeated observations matter.
   // Clear simulated label so readings cannot be mistaken for hardware data.
   const relative=1+0.007*Math.sin((readingIndex+1)*2.279+seed);
   const predicted=y[1],simulated=manual?predicted:predicted*relative;
   observations.push({trial:++readingIndex,input:values[0],predicted,simulated,unit:y[2],settings:values.slice()});
   status.textContent="Trial "+readingIndex+" recorded (SIMULATED). Theoretical "+fmt(predicted)+" "+y[2]+", virtual reading "+fmt(simulated)+" "+y[2];
   redrawRecords();
 };
 const status=document.createElement("p");status.className="gb-status";status.setAttribute("aria-live","polite");
 function updateStage(){progress.replaceChildren(...stages.map((name,i)=>{
   const b=btn((i+1)+". "+name,"gb-step"+(i===stage?" current":i<stage?" complete":""));
   b.onclick=()=>{stage=i;updateStage()};return b
 }));
 prev.disabled=stage===0;next.disabled=stage===stages.length-1;body.replaceChildren();side.replaceChildren();
 side.append(buildSidebar());
 if(stage===0)inspect();
 else if(stage===1)calibrate();
 else if(stage===2)measure();
 else if(stage===3)analyse();
 else review();
 }
 function sectionTitle(t,sub){const div=document.createElement("div");div.className="gb-sectiontitle";const h=document.createElement("h4");h.textContent=t;const p=document.createElement("p");p.textContent=sub;div.append(h,p);return div}
 function buildSidebar(){
   const wrap=document.createElement("div");wrap.className="gb-sidecard";
   const h=document.createElement("strong");h.textContent="LIVE SETTINGS";wrap.append(h);
   parameters.forEach((item,i)=>{const row=document.createElement("div");row.className="gb-live-row";
    const name=document.createElement("span");name.textContent=item[0];
    const val=document.createElement("b");val.textContent=fmt(getValues()[i]);row.append(name,val);wrap.append(row)});
   const reading=document.createElement("div");reading.className="gb-predicted";const r=modelResult();
   reading.textContent=r?"Theory: "+fmt(r[1])+" "+r[2]:"No valid theoretical result";
   wrap.append(reading);
   return wrap;
 }
 function inspect(){body.append(sectionTitle("01 · Know the equipment","Review all required apparatus before starting the experiment."));
 const checklist=document.createElement("div");checklist.className="gb-checks";
 for(const thing of guide.equipment||[]){const label=document.createElement("label");const check=document.createElement("input");check.type="checkbox";label.append(check,document.createTextNode(thing));checklist.append(label)}body.append(checklist);
 const p=document.createElement("p");p.className="gb-info";p.textContent="Aim: "+guide.aim;body.append(p);
 const toggle=btn("Mark apparatus inspected ✓");toggle.onclick=()=>{checklist.querySelectorAll("input").forEach(x=>x.checked=true);status.textContent="Equipment checklist complete."};body.append(toggle);body.append(status)
 }
 function calibrate(){body.append(sectionTitle("02 · Prepare and calibrate","Confirm scale units, starting settings and safe apparatus conditions."));
 const form=document.createElement("div");form.className="gb-settings";
 const values=getValues();
 parameters.forEach((item,i)=>{
   const label=document.createElement("label");const span=document.createElement("span");span.textContent=item[0];
   const input=document.createElement("input");input.type="number";input.min=item[2];input.max=item[3];input.step=item[4];input.value=values[i];input.setAttribute("aria-label",item[0]);
   input.onchange=()=>{const next=getValues().slice();next[i]=Math.min(item[3],Math.max(item[2],Number(input.value)));input.value=next[i];setValues(next);updateStage()};
   label.append(span,input);form.append(label);
 });body.append(form);
 const tips=document.createElement("div");tips.className="gb-info";tips.textContent="Check zero correction, instrument least count and independent/dependent variables as applicable. Apparatus controls above change predicted outputs; exact calibration differs by experiment.";body.append(tips);
 const resetSettings=btn("Return to recommended starting settings");resetSettings.onclick=()=>{setValues(parameters.map(x=>x[1]));updateStage()};body.append(resetSettings);body.append(status)
 }
 function measure(){body.append(sectionTitle("03 · Operate the apparatus","Change an experimental variable, read the model and record repeated virtual trials."));
 const values=getValues();
 for(let i=0;i<Math.min(parameters.length,4);i++){
   const p=parameters[i];const group=document.createElement("div");group.className="gb-measure-row";
   const name=document.createElement("span");name.textContent=p[0];group.append(name);
   const down=btn("−","gb-adjust"),up=btn("+","gb-adjust");
   const value=document.createElement("b");value.textContent=fmt(values[i]);
   const step=Number(p[4])||.1;
   const change=delta=>{let vals=getValues().slice();vals[i]=Number(Math.min(p[3],Math.max(p[2],vals[i]+delta)).toFixed(6));setValues(vals);value.textContent=fmt(vals[i]);side.replaceChildren(buildSidebar())};
   down.onclick=()=>change(-step);up.onclick=()=>change(step);
   group.append(down,value,up);body.append(group)
 }
 const actions=document.createElement("div");actions.className="gb-record-actions";
 const take=btn("● Take simulated reading","gb-action"),ideal=btn("Record theoretical value");
 take.onclick=()=>record(false);ideal.onclick=()=>record(true);actions.append(take,ideal);body.append(actions,status);
 const table=document.createElement("div");table.className="gb-records";table.id="guidedReadings";
 body.append(table);redrawRecords()
 }
 function redrawRecords(){
  const out=lab.querySelector("#guidedReadings");if(!out)return;
  out.replaceChildren();const table=document.createElement("table");
  const header=document.createElement("tr");
  ["Trial","1st variable","Prediction","Simulated"].forEach(x=>{const th=document.createElement("th");th.textContent=x;header.append(th)});table.append(header);
  for(const pt of observations){const tr=document.createElement("tr");for(const key of ["trial","input","predicted","simulated"]){const td=document.createElement("td");td.textContent=fmt(pt[key]);tr.append(td)}table.append(tr)}out.append(table)
 }
 function plot(canvas){
 const ctx=canvas.getContext("2d"),w=canvas.width,h=canvas.height;ctx.fillStyle="#0d1a2c";ctx.fillRect(0,0,w,h);
 ctx.strokeStyle="#2c4562";for(let x=45;x<w-25;x+=55){ctx.beginPath();ctx.moveTo(x,22);ctx.lineTo(x,h-43);ctx.stroke()}
 for(let y=23;y<h-42;y+=45){ctx.beginPath();ctx.moveTo(45,y);ctx.lineTo(w-20,y);ctx.stroke()}
 ctx.fillStyle="#bed1e9";ctx.font="12px Arial";
 if(!observations.length){ctx.fillText("Capture a trial in step 3 to view the graph.",65,80);return}
 const xs=observations.map(o=>o.input),ys=observations.map(o=>o.simulated),minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
 const X=x=>55+(x-minX)/(maxX-minX||1)*(w-90),Y=y=>h-50-(y-minY)/(maxY-minY||1)*(h-85);
 const data=observations.slice().sort((a,b)=>a.input-b.input);ctx.strokeStyle="#b29aff";ctx.lineWidth=3;ctx.beginPath();
 data.forEach((p,i)=>{if(i)ctx.lineTo(X(p.input),Y(p.simulated));else ctx.moveTo(X(p.input),Y(p.simulated))});ctx.stroke();
 for(const p of observations){ctx.fillStyle="#6ae2bc";ctx.beginPath();ctx.arc(X(p.input),Y(p.simulated),5,0,Math.PI*2);ctx.fill()}
 ctx.fillStyle="#c6d5ee";ctx.fillText(parameters[0][0],w/2-35,h-12);ctx.fillText("Virtual observation",55,18)
 }
 function analyse(){body.append(sectionTitle("04 · Graph and calculate","Plot captured readings and compare a simple mean with the calculated model."));
 const canvas=document.createElement("canvas");canvas.width=680;canvas.height=300;canvas.className="gb-plot";body.append(canvas);plot(canvas);
 const info=document.createElement("div");info.className="gb-info";
 if(observations.length){const mean=observations.reduce((s,o)=>s+o.simulated,0)/observations.length;info.textContent="Simulated reading mean: "+fmt(mean)+" "+(observations[0].unit||"")+". Number of virtual trials: "+observations.length+"."}
 else info.textContent="Return to Measure and capture simulated trials to calculate an average.";body.append(info);
 const graph=document.createElement("div");graph.className="gb-info";graph.textContent="Relevant graph recommended in the practical guide: "+guide.graph+". The plotted graph here uses the first input parameter against simulated output and may not be the official exam graph.";body.append(graph);
 const exportBtn=btn("Export virtual readings (CSV)");exportBtn.onclick=()=>{
  const rows=[["Practical",experiment.id+" "+experiment.title],["SIMULATED DATA — NOT REAL MEASUREMENTS"],["Trial",parameters[0][0],"Prediction","Simulated reading","Unit"],...observations.map(r=>[r.trial,r.input,r.predicted,r.simulated,r.unit])];
  const csv=rows.map(row=>row.map(v=>'"'+String(v).replaceAll('"','""')+'"').join(",")).join("\r\n");
  const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const url=URL.createObjectURL(blob),a=document.createElement("a");a.href=url;a.download="phys-lab-"+experiment.id+"-virtual.csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)
 };body.append(exportBtn)
 }
 function review(){body.append(sectionTitle("05 · Evaluate understanding","Use the lab handbook to confirm conclusions, safety and viva answers."));
 const list=document.createElement("ol");list.className="gb-review";for(const question of guide.questions||[]){const li=document.createElement("li");const h=document.createElement("div");h.textContent=question;const txt=document.createElement("textarea");txt.placeholder="Write your explanation…";txt.rows=2;li.append(h,txt);list.append(li)}body.append(list);
 const note=document.createElement("div");note.className="gb-info";note.textContent="Precautions: "+(guide.precautions||[]).join(" • ");body.append(note)
 }
 prev.onclick=()=>{stage=Math.max(0,stage-1);updateStage()};
 next.onclick=()=>{stage=Math.min(stages.length-1,stage+1);updateStage()};
 reset.onclick=()=>{if(!confirm("Clear this virtual experiment session?"))return;stage=0;observations=[];readingIndex=0;status.textContent="Session cleared.";updateStage()};
 updateStage();
 return {refresh(){if(stage===1||stage===2)side.replaceChildren(buildSidebar())},dispose(){lab.remove()}};
}
