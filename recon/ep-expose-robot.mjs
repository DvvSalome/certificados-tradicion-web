const BASE = 'http://localhost:3010', EMAIL = process.env.EP_EMAIL, PASS = process.env.EP_PASS;

async function main() {
  const r = await fetch(BASE+'/api/trpc/auth.login', {method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({json:{email:EMAIL,password:PASS}})}); 
  const token = (await r.json()).json.token; 

  const inspectReq = await fetch(BASE+'/api/trpc/services.app.inspect', {
    method:'POST',
    headers:{'content-type':'application/json',authorization:'Bearer '+token},
    body:JSON.stringify({json:{projectName:'certificados',serviceName:'robot'}})
  });
  
  const service = (await inspectReq.json()).json;
  
  const domains = service.domains || [];
  const newDomain = { host: 'robot.certitradicion.internal', port: 3000 };
  
  if (!domains.find(d => d.host === newDomain.host)) {
    domains.push(newDomain);
    const updateReq = await fetch(BASE+'/api/trpc/services.app.updateDomains', {
      method:'POST',
      headers:{'content-type':'application/json',authorization:'Bearer '+token},
      body:JSON.stringify({json:{projectName:'certificados',serviceName:'robot', domains}})
    });
    console.log('Update domains:', await updateReq.json());
    
    // Deploy to apply Traefik changes
    const deployReq = await fetch(BASE+'/api/trpc/services.app.deployService', {
      method:'POST',
      headers:{'content-type':'application/json',authorization:'Bearer '+token},
      body:JSON.stringify({json:{projectName:'certificados',serviceName:'robot'}})
    });
    console.log('Deploy:', await deployReq.json());
  } else {
    console.log('Domain already exists!');
  }
}

main().catch(console.error);
