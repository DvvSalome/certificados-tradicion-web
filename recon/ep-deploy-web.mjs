const BASE = 'http://localhost:3010', EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;

async function main() {
  const r = await fetch(BASE+'/api/trpc/auth.login', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({json:{email:EMAIL,password:PASS}})}); 
  const token = (await r.json()).json.token; 
  
  console.log('Deploying certificados_web...');
  const res = await fetch(BASE+'/api/trpc/services.app.deployService', {
    method:'POST',
    headers:{'content-type':'application/json',authorization:'Bearer '+token},
    body:JSON.stringify({json:{projectName:'certificados',serviceName:'web'}})
  });
  console.log(await res.text());
}

main().catch(console.error);
