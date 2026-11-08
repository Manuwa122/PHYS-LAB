export default async function handler(req,res){
 if(req.method!=="POST")return res.status(405).json({error:"Method not allowed"});
 const q=typeof req.body?.question==="string"?req.body.question.trim():"";
 if(!q||q.length>1200)return res.status(400).json({error:"Enter a physics question (max 1200 characters)."});
 if(!process.env.OPENAI_API_KEY)return res.status(503).json({error:"AI tutor is not configured. Administrator must set OPENAI_API_KEY in Vercel."});
 try{
  const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),16000);
  const response=await fetch("https://api.openai.com/v1/chat/completions",{method:"POST",signal:controller.signal,headers:{"Content-Type":"application/json",Authorization:"Bearer "+process.env.OPENAI_API_KEY},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-4o-mini",temperature:0.3,max_tokens:650,messages:[{role:"system",content:"You are a physics tutor for Sri Lankan A/L students. Respond in Sinhala for Sinhala queries and English for English queries. Explain concepts accurately, show formulas and SI units, and note uncertainty when appropriate."},{role:"user",content:q}]})});clearTimeout(timer);
  if(!response.ok)return res.status(502).json({error:"AI provider error; verify API key, model and quota."});
  const data=await response.json();return res.status(200).json({answer:data.choices?.[0]?.message?.content||"No answer was returned."});
 }catch{return res.status(503).json({error:"AI is temporarily unavailable."});}
}
