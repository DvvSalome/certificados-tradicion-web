// Pool de cuentas SNR con fallback REACTIVO (por bloqueo de login O por saldo agotado) + cooldown diario.
//
// Config (1 sola variable, extensible):
//   SNR_ACCOUNTS="CC22521092:Alex17,CC72237401:Alex17"   ← agregar otra = anexar ",CCxxxx:clave"
// Compat hacia atrás: si SNR_ACCOUNTS no está, usa SNR_USER/SNR_PASS (1 cuenta).
//
// Estrategia: orden FIJO (la 1ª de la lista es la principal). pickAccount() devuelve la primera cuenta
// USABLE = sin cooldown activo Y con saldo suficiente (o saldo desconocido). Reactivo, no rotación: el
// login es el recurso escaso (1 login/cuenta/día), así N cuentas ≈ N× capacidad sin gastar logins de más.
//
// Estado en MEMORIA (se resetea en redeploy): cooldownUntil + saldo conocido por cuenta. Es intencional —
// el cooldown es hasta el otro día y el saldo se re-lee al loguear, así que un reinicio no pierde nada útil.

const COST_CENTS = Number(process.env.SNR_COST_COP || 23000) * 100; // costo de 1 cert al saldo prepago

function parseAccounts() {
  const raw = (process.env.SNR_ACCOUNTS || '').trim();
  if (raw) {
    return raw.split(',').map((s) => {
      const i = s.indexOf(':');                       // split en el PRIMER ':' (la clave podría traer ':')
      return i < 0 ? null : { user: s.slice(0, i).trim(), pass: s.slice(i + 1) };
    }).filter((a) => a && a.user && a.pass);
  }
  if (process.env.SNR_USER && process.env.SNR_PASS) return [{ user: process.env.SNR_USER, pass: process.env.SNR_PASS }];
  return [];
}

// Próxima medianoche hora Colombia (UTC-5, sin DST). El bloqueo del SNR es por día calendario.
function nextMidnightColombiaMs(now = Date.now()) {
  const dayMs = 24 * 3600 * 1000;
  const offset = 5 * 3600 * 1000;                     // Colombia = UTC-5
  const coNow = now - offset;                          // "ahora" en reloj de Colombia
  const nextCoMidnight = Math.floor(coNow / dayMs) * dayMs + dayMs;
  return nextCoMidnight + offset;                      // de vuelta a epoch UTC
}

const accounts = parseAccounts();
const state = new Map(accounts.map((a) => [a.user, { cooldownUntil: 0, saldoCents: null, reason: null, alerted: false }]));

export function hayCuentas() { return accounts.length > 0; }
export function totalCuentas() { return accounts.length; }
export function costoCertCents() { return COST_CENTS; }

function usable(a, now) {
  const st = state.get(a.user);
  if (st.cooldownUntil > now) return false;                                  // bloqueada hoy
  if (st.saldoCents != null && st.saldoCents < COST_CENTS) return false;     // sin saldo para 1 cert
  return true;
}

// Próxima cuenta usable (o null si TODAS están agotadas: bloqueadas o sin saldo).
export function pickAccount(now = Date.now()) {
  return accounts.find((a) => usable(a, now)) || null;
}

// Marca una cuenta bloqueada (login rechazado por el SNR) hasta la próxima medianoche Colombia.
export function marcarBloqueada(user, now = Date.now()) {
  const st = state.get(user); if (st) { st.cooldownUntil = nextMidnightColombiaMs(now); st.reason = 'bloqueada'; }
}
// Marca una cuenta sin saldo (no alcanza para 1 cert). Se "recupera" sola cuando setSaldo la suba.
export function marcarSinSaldo(user) {
  const st = state.get(user); if (st) { st.saldoCents = 0; st.reason = 'sin saldo'; }
}
// Registra el saldo leído de una cuenta (COP en centavos). Si vuelve a tener saldo, limpia el motivo.
export function setSaldo(user, cents) {
  const st = state.get(user); if (st) { st.saldoCents = cents; if (cents >= COST_CENTS) st.reason = null; }
}
// "Forma fácil" de saber el saldo: se lee 1 vez al loguear (setSaldo) y luego se DESCUENTA local por cada
// cert generado, sin re-navegar. Solo se re-lee cuando queda bajo (para corregir el estimado).
export function descontarCert(user) {
  const st = state.get(user); if (st && st.saldoCents != null) st.saldoCents = Math.max(0, st.saldoCents - COST_CENTS);
}
export function saldoCents(user) { const st = state.get(user); return st ? st.saldoCents : null; }
export function saldoConocido(user) { const st = state.get(user); return !!st && st.saldoCents != null; }

// Certificados que alcanza el saldo conocido (o null si no se conoce).
export function certsRestantes(user) { const st = state.get(user); return st && st.saldoCents != null ? Math.floor(st.saldoCents / COST_CENTS) : null; }
// ¿Disparar alerta de saldo bajo? true SOLO la 1ª vez que cae bajo el umbral (se rearma al recuperarse).
export function debeAlertar(user, umbralCerts) {
  const st = state.get(user); if (!st || st.saldoCents == null) return false;
  if (Math.floor(st.saldoCents / COST_CENTS) < umbralCerts) { if (st.alerted) return false; st.alerted = true; return true; }
  st.alerted = false; return false;
}

// Snapshot para el panel/alertas: cada cuenta con disponibilidad, saldo y motivo si no está disponible.
export function estado(now = Date.now()) {
  return accounts.map((a) => {
    const st = state.get(a.user);
    return {
      user: a.user,
      disponible: usable(a, now),
      saldoCents: st.saldoCents,
      cooldownUntil: st.cooldownUntil || null,
      reason: usable(a, now) ? null : st.reason,
    };
  });
}
