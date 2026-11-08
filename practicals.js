import {practicals,NIE_HANDBOOK} from "./practicals-data.js";
import {paintApparatus} from "./apparatus.js";
const $=id=>document.getElementById(id);
const modelSpecs={
vernier:[["Main scale (mm)",21,0,90,1],["Coinciding division",4,0,9,1],["Least count (mm)",0.1,.01,.1,.01]],
micrometer:[["Pitch scale (mm)",4.5,0,25,.5],["Circular division",28,0,49,1],["Least count (mm)",.01,.005,.02,.005]],
spherometer:[["Leg distance (mm)",30,10,60,1],["Sagitta (mm)",.6,.1,3,.1]],
forces:[["Force P (N)",5,1,20,.5],["Force Q (N)",8,1,20,.5],["Angle (degrees)",70,10,170,1]],
moments:[["Load 1 (N)",3,1,15,.5],["Arm 1 (cm)",30,5,80,1],["Arm 2 (cm)",20,5,80,1]],
utube:[["Reference height (cm)",12,2,30,.5],["Other height (cm)",15,2,30,.5],["Reference density (kg/m³)",1000,700,1300,10]],
density:[["Mass (g)",42,10,100,.5],["Displaced volume (cm³)",35,5,80,.5]],
pendulum:[["Length (m)",1,.2,2,.05],["Period (s)",2.01,.5,4,.01]],
spring:[["Mass (kg)",.2,.05,1,.05],["Spring constant (N/m)",20,5,60,1]],
sonometer:[["Vibrating length (m)",.6,.2,1.2,.02],["Tension (N)",50,10,200,5],["Mass per length (kg/m)",.001,.0005,.005,.0001]],
resonance:[["Tuning fork frequency (Hz)",512,256,1024,16],["First resonance (m)",.15,.04,.6,.01],["Second resonance (m)",.48,.1,.95,.01]],
refractive:[["Real depth (cm)",7,2,20,.5],["Apparent depth (cm)",4.7,1,15,.1]],
prism:[["Prism angle A (°)",60,30,80,1],["Minimum deviation D (°)",40,15,70,1]],
critical:[["Critical angle (°)",42,30,75,1]],
angles:[["Reflected ray separation (°)",120,30,170,1]],
lens:[["Object distance (cm)",30,10,100,1],["Image distance (cm)",60,10,100,1]],
gas:[["Initial pressure (kPa)",100,60,140,5],["Initial volume (mL)",50,10,100,5],["Final volume (mL)",35,10,100,5]],
charles:[["Initial volume (mL)",100,20,250,5],["Initial temperature (K)",300,250,400,5],["Final temperature (K)",360,250,500,5]],
pressure:[["Initial pressure (kPa)",100,60,150,5],["Initial temperature (K)",300,250,400,5],["Final temperature (K)",360,250,500,5]],
calorimetry:[["Solid mass (kg)",.15,.05,.5,.01],["Solid specific heat (J/kg K)",460,200,950,10],["Hot solid temperature (°C)",90,45,100,1],["Water mass (kg)",.2,.05,.5,.01],["Water initial temp (°C)",25,15,40,1]],
conductivity:[["Water mass flow (kg/s)",.003,.001,.02,.001],["Water temperature rise (K)",8,1,25,1],["Rod length (m)",.3,.1,.7,.05],["Area (m²)",.0002,.0001,.001,.0001],["Rod temp difference (K)",35,10,90,1]],
cell:[["EMF (V)",1.5,1,3,.1],["Internal resistance (Ω)",.6,.1,3,.1],["Current (A)",.4,.05,2,.05]],
temperature:[["Resistance at 20°C (Ω)",10,1,50,1],["Coefficient (1/K)",.004,.001,.01,.0005],["Final temperature (°C)",70,20,120,5]],
potentiometer:[["Cell 1 balance length (cm)",74,10,95,1],["Cell 2 balance length (cm)",55,10,95,1]],
internal:[["External resistance (Ω)",5,1,20,.5],["Open-circuit balance (cm)",80,20,100,1],["Loaded balance (cm)",65,10,95,1]],
diode:[["Forward voltage (V)",.65,0,1,.01],["Saturation current (nA)",1,.1,10,.1],["Ideality factor",2,1,2,.1]],
transistor:[["Base current (µA)",50,0,200,5],["Current gain β",100,20,200,10]],
gates:[["Input A",1,0,1,1],["Input B",0,0,1,1],["Gate (0 AND, 1 OR, 2 NAND, 3 NOR, 4 XOR)",0,0,4,1]],
young:[["Force (N)",12,2,30,1],["Wire length (m)",2,.5,3,.1],["Wire diameter (mm)",.4,.2,1,.05],["Extension (mm)",1.5,.2,6,.1]],
viscosity:[["Tube radius (mm)",.5,.2,1,.05],["Pressure difference (Pa)",180,50,500,10],["Flow time (s)",60,10,120,5],["Tube length (m)",.5,.1,1,.05],["Collected volume (mL)",12,2,60,1]],
tension:[["Capillary rise (cm)",2,0.5,8,.1],["Capillary radius (mm)",.5,.1,2,.1],["Liquid density (kg/m³)",1000,700,1200,10]]
};
Object.assign(modelSpecs,{
cooling:[["Initial temperature (°C)",80,40,100,1],["Room temperature (°C)",25,10,35,1],["Cooling constant (1/min)",.09,.01,.3,.01],["Elapsed time (min)",10,0,40,1]],
fusion:[["Water mass (kg)",.3,.1,.8,.05],["Starting water temperature (°C)",35,20,60,1],["Final temperature (°C)",10,1,20,1],["Ice mass (kg)",.08,.02,.2,.01]],
vapor:[["Water mass (kg)",.3,.1,.8,.05],["Starting temperature (°C)",25,15,50,1],["Final temperature (°C)",45,30,70,1],["Steam mass (kg)",.015,.005,.04,.005]],
humidity:[["Ambient temperature (°C)",30,15,40,1],["Dew point (°C)",22,5,35,1]],
concave:[["Object distance (cm)",30,15,80,1],["Virtual-image distance (cm)",12,4,35,1]],
slide:[["Force (mN)",12,1,25,.5],["Slide width (cm)",7,2,12,.5]],
jaeger:[["Threshold pressure (Pa)",1650,600,2500,25],["Liquid depth (cm)",12,2,20,1],["Tube radius (mm)",.4,.1,1,.05],["Liquid density (kg/m³)",1000,700,1200,10]]
});
let selected="10",language="en",params=[],values=[],anim=0;
const cats=[...new Set(practicals.map(x=>x.category))];
for(const cat of cats){let opt=document.createElement("option");opt.value=cat;opt.textContent=cat;$("category").append(opt)}
$("modelCount").textContent=practicals.filter(x=>modelSpecs[x.model]).length;
function t(en,si){return language==="si"?si:en}
function translate(){document.querySelectorAll("[data-en]").forEach(el=>el.textContent=el.dataset[language]);$("language").textContent=language==="si"?"English":"සිංහල";drawList();show()}
$("language").onclick=()=>{language=language==="en"?"si":"en";translate()};
function drawList(){const search=$("search").value.toLowerCase(),cat=$("category").value,status=$("status").value;
const items=practicals.filter(x=>(cat==="All"||x.category===cat)&&(status==="all"||(status==="model")===!!modelSpecs[x.model])&&(x.title+" "+x.id+" "+x.category).toLowerCase().includes(search));
$("count").textContent=items.length+" / "+practicals.length;
$("cards").replaceChildren(...items.map(x=>{let b=document.createElement("button");b.className="item"+(selected===x.id?" selected":"");b.innerHTML='<span class="num">'+x.id+'</span><span><strong></strong><small></small></span>';b.querySelector("strong").textContent=x.title;b.querySelector("small").textContent=x.category+" · "+(modelSpecs[x.model]?t("Numerical model","ගණිතමය අනුකරණය"):t("Guided worksheet","වාර්තා පත්‍රය"));b.onclick=()=>{selected=x.id;drawList();show();if(innerWidth<951)$("detail").scrollIntoView({behavior:"smooth"})};return b}))}
["search","category","status"].forEach(id=>$(id).addEventListener(id==="search"?"input":"change",drawList));
function computed(p,v){const pi=Math.PI;const [a,b,c,d,e]=v;switch(p.model){
case "vernier":return ["Measured length",a+b*c,"mm"];
case "micrometer":return ["Measured dimension (uncorrected)",a+b*c,"mm"];
case "spherometer":return ["Radius of curvature",a*a/(6*b)+b/2,"mm"];
case "forces":return ["Resultant force",Math.sqrt(a*a+b*b+2*a*b*Math.cos(c*pi/180)),"N"];
case "moments":return ["Balancing load (ideal)",a*b/c,"N"];
case "utube":return ["Second liquid density",c*a/b,"kg/m³"];
case "density":return ["Density",a/b,"g/cm³"];
case "pendulum":return ["Estimated g",4*pi*pi*a/(b*b),"m/s²"];
case "spring":return ["Period",2*pi*Math.sqrt(a/b),"s"];
case "sonometer":return ["Fundamental frequency",Math.sqrt(b/c)/(2*a),"Hz"];
case "resonance":return ["Sound speed from 2 resonances",2*a*(c-b),"m/s"];
case "refractive":return ["Refractive index",a/b,""];
case "prism":return ["Refractive index",Math.sin((a+b)*pi/360)/Math.sin(a*pi/360),""];
case "critical":return ["Refractive index",1/Math.sin(a*pi/180),""];
case "angles":return ["Prism angle (ideal reflection)",a/2,"°"];
case "lens":return ["Focal length (real image setup)",a*b/(a+b),"cm"];
case "gas":return ["Final pressure",a*b/c,"kPa"];
case "charles":return ["Final volume",a*c/b,"mL"];
case "pressure":return ["Final pressure",a*c/b,"kPa"];
case "calorimetry":return ["Equilibrium temperature (neglect calorimeter)",(a*b*c+d*4200*e)/(a*b+d*4200),"°C"];
case "conductivity":return ["Thermal conductivity",a*4200*b*c/(d*e),"W/(m·K)"];
case "cell":return ["Terminal voltage",a-b*c,"V"];
case "temperature":return ["Resistance at final temperature",a*(1+b*(c-20)),"Ω"];
case "potentiometer":return ["EMF ratio E₁/E₂",a/b,""];
case "internal":return ["Internal resistance",a*(b-c)/c,"Ω"];
case "diode":return ["Idealized diode current (Shockey model)",b*1e-9*(Math.exp(a/(c*.02585))-1)*1000,"mA"];
case "transistor":return ["Collector current (active region)",a*b/1000,"mA"];
case "gates":return ["Logic output",[a&b,a|b,1-(a&b),1-(a|b),a^b][c],"0 or 1"];
case "young":return ["Young's modulus",a*b/(pi*(c/2000)**2*(d/1000)),"Pa"];
case "viscosity":return ["Dynamic viscosity",pi*(a/1000)**4*b*c/(8*d*(e/1e6)),"Pa·s"];
case "tension":return ["Surface tension (cosθ = 1)",(a/100)*c*9.81*(b/1000)/2,"N/m"];
case "cooling":return ["Temperature after t",b+(a-b)*Math.exp(-c*d),"°C"];
case "fusion":return ["Estimated latent heat of fusion",(a*4200*(b-c)-d*4200*c)/d,"J/kg"];
case "vapor":return ["Estimated latent heat of vaporization",(a*4200*(c-b)-d*4200*(100-c))/d,"J/kg"];
case "humidity":return ["Relative humidity (Magnus approx.)",100*Math.exp((17.625*b)/(243.04+b)-(17.625*a)/(243.04+a)),"%"];
case "concave":return ["Focal length (signed)",-(a*b)/(a-b),"cm"];
case "slide":return ["Surface tension (two faces)",(a/1000)/(2*b/100),"N/m"];
case "jaeger":return ["Surface tension (ideal)",((a-d*9.81*b/100)*(c/1000)/2),"N/m"];
default:return null;
}}
function round(n){if(!Number.isFinite(n))return "Invalid inputs";if(Math.abs(n)>1e5||Math.abs(n)<.0001&&n!==0)return n.toExponential(3);return Number(n.toFixed(5)).toString()}
function show(){const p=practicals.find(x=>x.id===selected);if(!p)return;const spec=modelSpecs[p.model];params=spec||[];values=params.map(x=>x[1]);const detail=$("detail");detail.innerHTML="";
const top=document.createElement("div");top.className="detailtop";top.innerHTML='<span class="tag">PRACTICAL #'+p.id+'</span><span class="tag"></span>';top.lastElementChild.textContent=spec?t("ANIMATED APPARATUS","සජීවී උපකරණ අනුකරණය"):t("GUIDED WORKSHEET","අධ්‍යයන වාර්තාව");detail.append(top);
const h=document.createElement("h2");h.className="title";h.textContent=p.title;detail.append(h);
const sub=document.createElement("p");sub.className="muted";sub.textContent=p.category+" • "+t("Based on NIE's numbered list, not a substitute for the official experimental method.","NIE පරීක්ෂණ ලැයිස්තුව ඇසුරින්. නිල ක්‍රමවේදයට ආදේශයක් නොවේ.");detail.append(sub);
const notice=document.createElement("div");notice.className="notice";notice.textContent=spec?t("Animated apparatus and adjustable parameters provide idealized illustrations. They are not real measurements or certified apparatus simulators.","උපකරණ අනුකරණ සහ පාලක අගයන් අධ්‍යයන ආකෘති පමණි; සැබෑ මිනුම් නොවේ."):t("An individual interactive apparatus model is not implemented for this practical yet. Use the worksheet and official NIE method to practice recording observations.","මෙම පරීක්ෂණයට විශේෂ උපකරණ අනුකරණයක් තවම නොමැත. NIE උපදෙස් සහ වාර්තා පත්‍රය භාවිත කරන්න.");detail.append(notice);
if(spec){let lab=document.createElement("section");lab.className="labcard";lab.innerHTML='<div class="labhead"><strong>'+t("Interactive model","ගණිතමය අනුකරණය")+'</strong><span>● '+t("Adjust controls","අගයන් වෙනස් කරන්න")+'</span></div><canvas class="labcanvas" id="labcanvas"></canvas><div class="sliders" id="sliders"></div><div class="out" id="out"></div>';detail.append(lab);
const transport=document.createElement("div");transport.className="simtransport";const toggle=document.createElement("button");toggle.type="button";toggle.textContent="Ⅱ Pause";toggle.onclick=()=>{motion=!motion;toggle.textContent=motion?"Ⅱ Pause":"▶ Play";draw()};const restart=document.createElement("button");restart.type="button";restart.textContent="↺ Restart";restart.onclick=()=>{anim=0;motion=true;show()};transport.append(toggle,restart);lab.append(transport);
spec.forEach((s,i)=>{const label=document.createElement("label");const title=document.createElement("span");title.textContent=s[0];let val=document.createElement("b");val.textContent=s[1];let input=document.createElement("input");input.type="range";input.min=s[2];input.max=s[3];input.step=s[4];input.value=s[1];input.oninput=()=>{values[i]=Number(input.value);val.textContent=values[i];update()};label.append(title,val,input);$("sliders").append(label)});update();
}
const theory=document.createElement("h3");theory.textContent=t("Core relation / theory","මූලික සමීකරණය / න්‍යාය");detail.append(theory);const formula=document.createElement("div");formula.className="formula";formula.textContent=p.formula;detail.append(formula);
const method=document.createElement("h3");method.textContent=t("Guided practical workflow","පරීක්ෂණ ක්‍රියාපටිපාටිය");detail.append(method);let steps=document.createElement("ol");steps.className="steps";[t("Study the NIE handbook for this experiment's apparatus and safety precautions.","අවශ්‍ය උපකරණ සහ ආරක්ෂාව සඳහා NIE අත්පොත බලන්න."),t("Set up the equipment as instructed by your teacher; identify the variables and least counts.","ගුරුවරයාගේ මඟපෙන්වීම යටතේ උපකරණ සවි කර මිනුම් සීමා හඳුනාගන්න."),t("Measure several readings, repeat as needed, and record actual units.","මිනුම් කිහිපයක් නැවත නැවත ලබාගෙන ඒකක සහිතව සටහන් කරන්න."),t("Use the core relation to calculate the requested result; include uncertainty and a conclusion.","සමීකරණයෙන් ප්‍රතිඵල ගණනය කර දෝෂ/අවිනිශ්චිතතාව සහ නිගමනය ලියන්න.")].forEach(x=>{const li=document.createElement("li");li.textContent=x;steps.append(li)});detail.append(steps);
const notes=document.createElement("h3");notes.textContent=t("Observation notebook","නිරීක්ෂණ වාර්තාව");detail.append(notes);
const worksheet=document.createElement("div");worksheet.className="worksheet";worksheet.innerHTML='<table><thead><tr><th>Trial</th><th>Independent variable + unit</th><th>Observed reading + unit</th><th>Remarks</th></tr></thead><tbody id="trials"></tbody></table>';detail.append(worksheet);
for(let i=0;i<5;i++){const tr=document.createElement("tr");const td=document.createElement("td");td.textContent=i+1;tr.append(td);for(let j=0;j<3;j++){const cell=document.createElement("td"),inp=document.createElement("input");inp.placeholder=j===2?"Notes":j===0?"e.g. 0.25 m":"e.g. 2.1 s";inp.setAttribute("aria-label","Trial "+(i+1)+" column "+(j+1));cell.append(inp);tr.append(cell)}$("trials").append(tr)}
const actions=document.createElement("div");actions.className="actions";let save=document.createElement("button");save.textContent=t("Export observations (CSV) ↓","දත්ත CSV ලෙස ලබාගන්න ↓");save.onclick=()=>{let rows=[["Practical",p.id+" "+p.title],["Trial","Independent variable","Observed reading","Remarks"]];[...$("trials").querySelectorAll("tr")].forEach((tr,i)=>rows.push([i+1,...[...tr.querySelectorAll("input")].map(x=>x.value)]));let csv=rows.map(r=>r.map(c=>'"'+String(c).replaceAll('"','""')+'"').join(",")).join("\r\n");let url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));let a=document.createElement("a");a.href=url;a.download="PHYS-LAB-Practical-"+p.id+".csv";a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)};actions.append(save);
let reset=document.createElement("button");reset.className="secondary";reset.textContent=t("Clear worksheet","වාර්තාව මකන්න");reset.onclick=()=>document.querySelectorAll("#trials input").forEach(x=>x.value="");actions.append(reset);
let source=document.createElement("a");source.href=NIE_HANDBOOK;source.target="_blank";source.rel="noopener noreferrer";source.textContent=t("Open official NIE guide ↗","NIE අත්පොත බලන්න ↗");actions.append(source);detail.append(actions);
let safety=document.createElement("p");safety.className="muted";safety.textContent=t("For demonstrations involving heated liquids, electricity, glassware or instruments, follow your teacher's instructions. This virtual model cannot replace practical skills.","උණුසුම් ද්‍රව්‍ය, විදුලිය, වීදුරු උපකරණ සහ මිනුම් උපකරණ භාවිතයේදී ගුරු උපදෙස් අනුගමනය කරන්න.");detail.append(safety);
}
function update(){const p=practicals.find(x=>x.id===selected);const out=computed(p,values);if(out)$("out").textContent=out[0]+": "+round(out[1])+" "+out[2];draw()}
function draw(){const canvas=$("labcanvas");if(!canvas)return;const p=practicals.find(x=>x.id===selected);if(p)paintApparatus(canvas,p,values,anim)}
let motion=true;
function tick(){if(motion)anim+=.025;if($("labcanvas")&&motion)draw();requestAnimationFrame(tick)}requestAnimationFrame(tick);
drawList();show();
