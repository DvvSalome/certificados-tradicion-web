const { execSync } = require('child_process');
const fs = require('fs');
const env = fs.readFileSync('.env.local', 'utf-8').split('\n').filter(l => l.trim() && !l.startsWith('#') && !l.startsWith('APP_BASE_URL') && !l.startsWith('DATABASE_URL'));
env.forEach(l => {
  const parts = l.split('=');
  const k = parts[0];
  const v = parts.slice(1).join('=');
  if (k && v.length) {
    console.log(`Adding ${k.trim()}`);
    try {
      execSync(`npx vercel env rm ${k.trim()} production -y`, { stdio: 'ignore' });
    } catch(e) {}
    require('child_process').execFileSync('npx.cmd', ['vercel', 'env', 'add', k.trim(), 'production', '--value', v.trim()], { stdio: 'inherit' });
  }
});
