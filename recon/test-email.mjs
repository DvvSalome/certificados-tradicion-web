import tls from 'tls';
const USER = 'certificados@certitradicion.com', PASS = process.env.EP_PASS;

function imapTest(host, port) {
  return new Promise((resolve) => {
    const s = tls.connect(port, host, { servername: host });
    let buf = '', step = 0;
    s.setEncoding('utf8');
    s.setTimeout(15000, () => { resolve({ ok: false, err: 'timeout' }); s.destroy(); });
    s.on('error', (e) => resolve({ ok: false, err: e.message }));
    s.on('data', (d) => {
      buf += d;
      if (step === 0 && /\* OK/.test(buf)) { step = 1; buf = ''; s.write(`a LOGIN "${USER}" "${PASS}"\r\n`); }
      else if (step === 1 && /a (OK|NO|BAD)/.test(buf)) { const ok = /a OK/.test(buf); resolve({ ok, raw: buf.trim().slice(0, 140) }); try { s.write('z LOGOUT\r\n'); } catch {} s.end(); }
    });
  });
}
function smtpTest(host, port) {
  return new Promise((resolve) => {
    const s = tls.connect(port, host, { servername: host });
    let buf = '', step = 0;
    s.setEncoding('utf8');
    s.setTimeout(15000, () => { resolve({ ok: false, err: 'timeout' }); s.destroy(); });
    s.on('error', (e) => resolve({ ok: false, err: e.message }));
    const lastLine = () => buf.trim().split('\n').pop().trim();
    s.on('data', (d) => {
      buf += d;
      if (step === 0 && /^220/.test(buf)) { step = 1; buf = ''; s.write('EHLO certitradicion.com\r\n'); }
      else if (step === 1 && /^250 /m.test(buf)) { step = 2; buf = ''; s.write('AUTH LOGIN\r\n'); }
      else if (step === 2 && /^334/.test(lastLine())) { step = 3; buf = ''; s.write(Buffer.from(USER).toString('base64') + '\r\n'); }
      else if (step === 3 && /^334/.test(lastLine())) { step = 4; buf = ''; s.write(Buffer.from(PASS).toString('base64') + '\r\n'); }
      else if (step === 4 && /^(235|535|530|5\d\d)/.test(lastLine())) { const ok = /^235/.test(lastLine()); resolve({ ok, raw: lastLine().slice(0, 120) }); try { s.write('QUIT\r\n'); } catch {} s.end(); }
    });
  });
}
console.log('IMAP imap.hostinger.com:993 ->', JSON.stringify(await imapTest('imap.hostinger.com', 993)));
console.log('SMTP smtp.hostinger.com:465 ->', JSON.stringify(await smtpTest('smtp.hostinger.com', 465)));
