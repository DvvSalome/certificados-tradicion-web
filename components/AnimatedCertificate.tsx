'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/* Animación "Estudio de certificado" — port del diseño Claude Design
   "Estudio Certificado.dc.html" a un componente autocontenido (sin runtime externo).
   5 escenas en un escenario de 1280x720 escalado al ancho del contenedor:
   1. Certificado entra   2. Análisis IA (lupa + zoom de cámara)   3. Chips de resultado
   4. Semáforo de riesgo   5. Cierre (banner + sello + logo). Loop con pausa al final. */

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const MOTION = {
  enter: (p: number) => 1 - Math.pow(1 - clamp01(p), 3),
  draw: (p: number) => { p = clamp01(p); return p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2; },
  pop: (p: number) => { p = clamp01(p); const c = 1.70158, c3 = c + 1; return 1 + c3 * Math.pow(p - 1, 3) + c * Math.pow(p - 1, 2); },
};

const PURPLE = '#7B5878', INK = '#332A38', GREEN = '#1F9D55';
const DOC = { x: 405, y: 44, w: 470, h: 632 };
const SECS = [{ y: 112, h: 52 }, { y: 234, h: 70 }, { y: 346, h: 56 }, { y: 422, h: 56 }];
const CHIPY = [160, 291, 396, 472];
const CHIPX = [236, 206, 242, 214];
const SEM = { x: 915, y: 140, w: 280, h: 440 };
const Z4 = [0, 0, 0, 0], U4 = [1, 1, 1, 1];

// Resultado "verde" del estudio (el diseño trae amarillo/rojo pero el hero siempre vende el caso feliz).
const R = {
  color: GREEN, soft: '#E7F6EC', ok: true, luz: 2,
  banner: 'Sin gravámenes vigentes', stamp: 'VÁLIDO',
  chips: [['Folio localizado', 1], ['Propietarios verificados', 1], ['Hipotecas: ninguna', 1], ['Embargos: ninguno', 1]] as [string, number][],
};

// Duraciones por escena (segundos) + pausa en el frame final antes de reiniciar el loop.
const DURS = [3, 5, 4, 5, 4];
const TOTAL = DURS.reduce((a, b) => a + b, 0);
const HOLD = 3;

const Bar = ({ x, y, w, h = 5, c = '#DDD7DE' }: { x: number; y: number; w: number; h?: number; c?: string }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, height: h, background: c, borderRadius: 2 }} />);
const Tx = ({ x, y, w, s = 7, b = 600, c = '#5A4F5C', a = 'left', children }: { x: number; y: number; w: number; s?: number; b?: number; c?: string; a?: CSSProperties['textAlign']; children: ReactNode }) => (
  <div style={{ position: 'absolute', left: x, top: y, width: w, fontSize: s, fontWeight: b, color: c, textAlign: a, lineHeight: 1.35 }}>{children}</div>);
const Chk = ({ size, bg, ok = true }: { size: number; bg: string; ok?: boolean }) => (
  <div style={{ width: size, height: size, borderRadius: '50%', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 'none' }}>
    {ok
      ? <svg width={size * 0.55} height={size * 0.55} viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.2 4.2L19 7" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round" /></svg>
      : <span style={{ color: '#fff', fontWeight: 900, fontSize: size * 0.6, lineHeight: 1 }}>!</span>}
  </div>);
const DocIcon = () => (
  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M6.5 3h8l4 4v14h-12z" /><path d="M14.5 3v4h4" /><path d="M9.5 10h6M9.5 13h6M9.5 16h3" /><path d="M21 9l-5.5 8.5" strokeWidth="2.3" />
  </svg>);

function DocSheet({ glow, dots }: { glow: number[]; dots: number[] }) {
  return (
    <div style={{ position: 'absolute', left: DOC.x, top: DOC.y, width: DOC.w, height: DOC.h, background: '#fff', borderRadius: 10, boxShadow: '0 24px 60px rgba(58,38,60,.18), 0 4px 14px rgba(58,38,60,.10)' }}>
      <Tx x={24} y={10} w={DOC.w - 48} s={6} b={400} c="#9A8F9C" a="center">La validez de este documento podrá verificarse en la página certificados.supernotariado.gov.co</Tx>
      <div style={{ position: 'absolute', left: 24, top: 26, width: 66, height: 42, border: '2.5px solid #3B6BB0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#3B6BB0', fontWeight: 900, fontSize: 15, letterSpacing: 1 }}>SNR</div>
      <Tx x={100} y={26} w={DOC.w - 124} s={8.5} b={800} c={INK} a="center">OFICINA DE REGISTRO DE INSTRUMENTOS PÚBLICOS</Tx>
      <Tx x={100} y={39} w={DOC.w - 124} s={11} b={900} c={INK} a="center">CERTIFICADO DE TRADICIÓN</Tx>
      <Tx x={100} y={55} w={DOC.w - 124} s={8.5} b={700} c={INK} a="center">MATRÍCULA INMOBILIARIA</Tx>
      <Tx x={24} y={78} w={300} s={7} b={700}>Certificado generado con el Pin No: 000000000000000</Tx>
      <Tx x={330} y={78} w={116} s={7} b={700} a="right">Nro Matrícula: 06N-000000</Tx>
      <Tx x={24} y={90} w={200} s={7}>Página 1&nbsp;&nbsp;TURNO: 2026-000000</Tx>
      <Tx x={246} y={90} w={200} s={7} a="right">Impreso el 26 de junio de 2026 a las 08:00:00 AM</Tx>
      <div style={{ position: 'absolute', left: 24, top: 105, width: DOC.w - 48, height: 1, background: '#E5DFE5' }} />
      <Tx x={30} y={118} w={DOC.w - 60} s={7.5} b={800} c={INK} a="center">&quot;ESTE CERTIFICADO REFLEJA LA SITUACIÓN JURÍDICA DEL INMUEBLE HASTA LA FECHA Y HORA DE SU EXPEDICIÓN&quot;</Tx>
      <Bar x={24} y={146} w={340} /><Bar x={24} y={155} w={280} />
      <Tx x={24} y={176} w={DOC.w - 48} s={6.5} c="#6E6270">CÍRCULO REGISTRAL: 06N — ZONA DE MUESTRA&nbsp;&nbsp;DEPTO: MUESTRA&nbsp;&nbsp;MUNICIPIO: MUESTRA&nbsp;&nbsp;VEREDA: MUESTRA</Tx>
      <Tx x={24} y={188} w={DOC.w - 48} s={6.5} c="#6E6270">FECHA APERTURA: 01-01-2000&nbsp;&nbsp;RADICACIÓN: 2000-00000&nbsp;&nbsp;CON DOCUMENTO Nro: 00-00-0000</Tx>
      <Bar x={24} y={202} w={410} /><Bar x={24} y={211} w={392} /><Bar x={24} y={220} w={300} />
      <Tx x={24} y={240} w={300} s={8} b={800} c={INK}>PROPIETARIOS Y ANOTACIONES</Tx>
      <Bar x={24} y={256} w={400} /><Bar x={24} y={265} w={410} /><Bar x={24} y={274} w={360} /><Bar x={24} y={283} w={396} /><Bar x={24} y={292} w={240} />
      <Bar x={24} y={318} w={410} /><Bar x={24} y={327} w={350} />
      <Tx x={24} y={352} w={300} s={8} b={800} c={INK}>HIPOTECAS Y GRAVÁMENES</Tx>
      <Bar x={24} y={368} w={380} /><Bar x={24} y={377} w={410} /><Bar x={24} y={386} w={300} />
      <Tx x={24} y={428} w={340} s={8} b={800} c={INK}>MEDIDAS CAUTELARES — EMBARGOS</Tx>
      <Bar x={24} y={444} w={400} /><Bar x={24} y={453} w={370} /><Bar x={24} y={462} w={310} />
      <Tx x={24} y={494} w={300} s={8} b={800} c={INK}>ÁREA Y COEFICIENTE</Tx>
      <Tx x={24} y={508} w={DOC.w - 48} s={6.5} c="#6E6270">ÁREA — HECTÁREAS: 0&nbsp;&nbsp;METROS CUADRADOS: 00.00&nbsp;&nbsp;CENTÍMETROS CUADRADOS: 0</Tx>
      <Bar x={24} y={522} w={410} /><Bar x={24} y={531} w={330} /><Bar x={24} y={540} w={386} /><Bar x={24} y={549} w={280} />
      <Bar x={24} y={566} w={410} /><Bar x={24} y={575} w={300} />
      <Tx x={24} y={606} w={DOC.w - 48} s={6} b={400} c="#9A8F9C" a="center">Documento de muestra — los datos del propietario se reservan por privacidad · Anotación Nº 001 — COMPRAVENTA</Tx>
      <div style={{ position: 'absolute', left: 0, top: 180, width: DOC.w, textAlign: 'center', transform: 'rotate(-26deg)', fontSize: 46, fontWeight: 900, letterSpacing: 6, color: 'rgba(123,88,120,0.07)', lineHeight: 1.15, pointerEvents: 'none' }}>CERTIFICADO<br />DE MUESTRA</div>
      {SECS.map((s, i) => {
        const g = glow[i]; if (g <= 0.01) return null;
        const col = R.chips[i][1] ? GREEN : R.color;
        return <div key={'g' + i} style={{ position: 'absolute', left: 16, top: s.y - 6, width: DOC.w - 32, height: s.h + 12, borderRadius: 8, background: col + '1f', border: `1.5px solid ${col}66`, opacity: g }} />;
      })}
      {SECS.map((s, i) => {
        const d = dots[i]; if (d <= 0.01) return null;
        const col = R.chips[i][1] ? GREEN : R.color;
        return <div key={'d' + i} style={{ position: 'absolute', left: 26, top: s.y + s.h / 2 - 6, width: 12, height: 12, borderRadius: '50%', background: col, transform: `scale(${d})`, boxShadow: `0 0 0 ${3 * Math.min(1, d)}px ${col}33` }} />;
      })}
    </div>);
}

function Chips({ vals }: { vals: number[] }) {
  return <>{R.chips.map((c, i) => {
    const v = vals[i]; if (v <= 0.01) return null;
    const col = c[1] ? GREEN : R.color;
    return (
      <div key={i} style={{ position: 'absolute', left: CHIPX[i], top: CHIPY[i], height: 44, display: 'flex', alignItems: 'center', gap: 9, padding: '0 18px 0 8px', background: '#fff', borderRadius: 24, boxShadow: '0 10px 26px rgba(58,38,60,.16)', transform: `scale(${Math.max(v, 0.001)})`, transformOrigin: 'left center', opacity: Math.min(1, v * 1.4) }}>
        <Chk size={28} bg={col} ok={!!c[1]} />
        <span style={{ fontSize: 15, fontWeight: 800, color: INK, whiteSpace: 'nowrap' }}>{c[0]}</span>
      </div>);
  })}</>;
}

function Lupa({ x, y, a }: { x: number; y: number; a: number }) {
  if (a <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: x - 46, top: y - 46, width: 92, height: 92, opacity: a }}>
      <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', border: '6px solid #5C4359', background: 'radial-gradient(circle at 32% 28%, rgba(255,255,255,.5), rgba(255,255,255,.06) 60%)', boxShadow: '0 14px 30px rgba(58,38,60,.28), inset 0 0 0 2px rgba(255,255,255,.5)' }} />
      <div style={{ position: 'absolute', left: 76, top: 76, width: 34, height: 11, borderRadius: 6, background: '#5C4359', transform: 'rotate(45deg)', transformOrigin: '4px 5px' }} />
    </div>);
}

const LIGHTS = [{ c: '#D64545', l: 'Riesgo alto' }, { c: '#C98A10', l: 'Riesgo medio' }, { c: GREEN, l: 'Riesgo bajo' }];
function Semaforo({ tx, a, active, labelA }: { tx: number; a: number; active: number; labelA: number }) {
  return (
    <div style={{ position: 'absolute', left: SEM.x, top: SEM.y, width: SEM.w, height: SEM.h, transform: `translateX(${tx}px)`, opacity: a, background: '#fff', borderRadius: 22, boxShadow: '0 24px 60px rgba(58,38,60,.16)', padding: '20px 0 0', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 14 }}>
      <div style={{ fontSize: 12, fontWeight: 900, letterSpacing: 2.5, color: PURPLE }}>SEMÁFORO DE RIESGO</div>
      {LIGHTS.map((L, i) => {
        const on = i === active;
        return (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
            <div style={{ width: 62, height: 62, borderRadius: '50%', background: on ? L.c : '#EDE8ED', border: on ? 'none' : '2px solid #E2DBE2', boxShadow: on ? `0 0 0 8px ${L.c}22, 0 0 30px ${L.c}66` : 'inset 0 2px 6px rgba(58,38,60,.08)' }} />
            <div style={{ fontSize: 13, fontWeight: 800, color: on ? L.c : '#B4A8B4' }}>{L.l}</div>
          </div>);
      })}
      <div style={{ height: 34, padding: '0 20px', borderRadius: 17, background: R.soft, color: R.color, fontSize: 14, fontWeight: 900, display: 'flex', alignItems: 'center', opacity: labelA }}>Resultado del estudio</div>
    </div>);
}

function Banner({ p }: { p: number }) {
  if (p <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: DOC.x + DOC.w / 2 - 210, top: DOC.y + DOC.h - 100, width: 360, height: 54, borderRadius: 27, background: R.soft, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, transform: `scale(${p})`, opacity: Math.min(1, p * 1.3), boxShadow: '0 12px 28px rgba(58,38,60,.14)' }}>
      <Chk size={30} bg={R.color} ok={R.ok} />
      <span style={{ fontSize: 17, fontWeight: 900, color: R.color }}>{R.banner}</span>
    </div>);
}

function Stamp({ p }: { p: number }) {
  if (p <= 0.01) return null;
  const rot = -12 - (1 - Math.min(1, p)) * 30;
  return (
    <div style={{ position: 'absolute', left: DOC.x + DOC.w - 158, top: DOC.y + DOC.h - 250, width: 120, height: 120, borderRadius: '50%', border: `3px solid ${R.color}`, boxShadow: `inset 0 0 0 6px #fff, inset 0 0 0 8px ${R.color}55, 0 10px 24px rgba(58,38,60,.18)`, background: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 5, transform: `rotate(${rot}deg) scale(${Math.max(p, 0.001)})`, opacity: Math.min(1, p * 1.2) }}>
      <Chk size={32} bg={R.color} ok={R.ok} />
      <span style={{ fontSize: 11.5, fontWeight: 900, letterSpacing: 1.4, color: R.color, textAlign: 'center', lineHeight: 1.15 }}>{R.stamp}</span>
    </div>);
}

function Logo({ p }: { p: number }) {
  if (p <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: SEM.x, top: SEM.y + SEM.h + 18, width: SEM.w, height: 58, borderRadius: 14, background: PURPLE, display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px', boxSizing: 'border-box', transform: `scale(${Math.max(p, 0.001)})`, opacity: Math.min(1, p * 1.3), boxShadow: '0 14px 30px rgba(90,58,88,.35)' }}>
      <DocIcon />
      <div>
        <div style={{ color: '#fff', fontWeight: 900, fontSize: 19, lineHeight: 1.1 }}>Certitradición</div>
        <div style={{ color: '#D9C7D6', fontWeight: 700, fontSize: 8, letterSpacing: 3 }}>ESTUDIO DE TÍTULOS</div>
      </div>
    </div>);
}

function Pill({ a, t }: { a: number; t: number }) {
  if (a <= 0.01) return null;
  return (
    <div style={{ position: 'absolute', left: 530, top: 16, width: 220, height: 44, borderRadius: 22, background: PURPLE, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, opacity: a, boxShadow: '0 12px 26px rgba(90,58,88,.3)' }}>
      <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#7FE3A8', opacity: 0.45 + 0.55 * (0.5 + 0.5 * Math.sin(t * 7)) }} />
      <span style={{ color: '#fff', fontWeight: 800, fontSize: 15 }}>Analizando con IA…</span>
    </div>);
}

type CamT = { s?: number; fx?: number; fy?: number };
function Cam({ s = 1, fx = 640, fy = 360, children }: CamT & { children: ReactNode }) {
  return <div style={{ position: 'absolute', inset: 0, transformOrigin: '0 0', transform: `translate(${640 - fx * s}px,${360 - fy * s}px) scale(${s})` }}>{children}</div>;
}

type CompT = { shift?: number; glow?: number[]; dots?: number[]; chips?: number[]; banner?: number; stamp?: number; semTx?: number; semA?: number; active?: number; semLabel?: number; logo?: number; lupa?: { x: number; y: number; a: number } | null; cam?: CamT; docA?: number; docY?: number };
function Comp({ shift = 0, glow = Z4, dots = Z4, chips = Z4, banner = 0, stamp = 0, semTx = 440, semA = 0, active = -1, semLabel = 0, logo = 0, lupa = null, cam = {}, docA = 1, docY = 0 }: CompT) {
  return (
    <Cam {...cam}>
      <div style={{ position: 'absolute', inset: 0, transform: `translate(${shift}px,${docY}px)`, opacity: docA }}>
        <DocSheet glow={glow} dots={dots} />
        <Chips vals={chips} />
        <Banner p={banner} />
        <Stamp p={stamp} />
        {lupa && <Lupa {...lupa} />}
      </div>
      {semA > 0.01 && <Semaforo tx={semTx} a={semA} active={active} labelA={semLabel} />}
      <Logo p={logo} />
    </Cam>);
}

// Escenas: cada una recibe su progreso p [0..1] y su tiempo local en segundos.
function Scene({ idx, p, lt }: { idx: number; p: number; lt: number }) {
  if (idx === 0) {
    const a = MOTION.enter(p / 0.35);
    const s = 1 + 0.045 * Math.sin(Math.PI * clamp01((p - 0.35) / 0.65));
    return <Comp docA={a} docY={(1 - a) * 46} cam={{ s }} />;
  }
  if (idx === 1) {
    const q = clamp01((p - 0.12) / 0.72), seg = q * 3.6;
    const centers = SECS.map((s) => DOC.y + s.y + s.h / 2);
    const lseg = Math.min(3, seg), i0 = Math.min(2, Math.floor(lseg));
    const ly = centers[i0] + (centers[i0 + 1] - centers[i0]) * (lseg - i0);
    const lx = DOC.x + 210 + 26 * Math.sin(seg * 2.2);
    const lupaA = MOTION.enter((p - 0.04) / 0.08) * (1 - clamp01((p - 0.86) / 0.09));
    const glow = SECS.map((_, i) => Math.max(0, 1 - Math.abs(lseg - i) * 1.6) * lupaA);
    const dots = SECS.map((_, i) => MOTION.pop(Math.min(1, Math.max(0, seg - i - 0.15) / 0.35)));
    const camK = MOTION.draw((p - 0.06) / 0.16) * (1 - MOTION.draw((p - 0.8) / 0.16));
    const cam = { s: 1 + 0.4 * camK, fx: 640 + (lx - 640) * camK, fy: 360 + (ly - 360) * camK };
    const pillA = MOTION.enter((p - 0.06) / 0.08) * (1 - clamp01((p - 0.85) / 0.08));
    return <>
      <Comp glow={glow} dots={dots} lupa={{ x: lx, y: ly, a: lupaA }} cam={cam} />
      <Pill a={pillA} t={lt} />
    </>;
  }
  if (idx === 2) {
    const chips = [0, 1, 2, 3].map((i) => MOTION.pop((p - 0.08 - i * 0.19) / 0.2));
    const s = 1 + 0.012 * Math.sin(Math.PI * p);
    return <Comp dots={U4} chips={chips} cam={{ s }} />;
  }
  if (idx === 3) {
    const shift = -150 * MOTION.draw(p / 0.22);
    const semK = MOTION.draw((p - 0.05) / 0.22);
    const lp = clamp01((p - 0.32) / 0.62);
    const active = lp <= 0 ? -1 : lp < 0.22 ? 0 : lp < 0.44 ? 1 : lp < 0.66 ? 2 : R.luz;
    return <Comp shift={shift} dots={U4} chips={U4} semTx={(1 - semK) * 440} semA={semK} active={active} semLabel={clamp01((lp - 0.72) / 0.18)} />;
  }
  return <Comp shift={-150} dots={U4} chips={U4} semTx={0} semA={1} active={R.luz} semLabel={1}
    banner={MOTION.pop((p - 0.05) / 0.18)} stamp={MOTION.pop((p - 0.3) / 0.2)} logo={MOTION.pop((p - 0.55) / 0.18)} />;
}

export default function AnimatedCertificate() {
  const ref = useRef<HTMLDivElement | null>(null);
  const [w, setW] = useState(0);
  const [time, setTime] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver((e) => setW(e[0].contentRect.width));
    ro.observe(el);

    // Accesibilidad: con reduced-motion se muestra el frame final estático (todo resuelto).
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setTime(TOTAL);
      return () => ro.disconnect();
    }

    // Reloj del loop; se pausa fuera de viewport (rAF a 60fps no es gratis en móvil).
    let raf = 0;
    let start = 0;
    const loop = (now: number) => {
      if (!start) start = now;
      setTime(Math.min(((now - start) / 1000) % (TOTAL + HOLD), TOTAL));
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([entry]) => {
      cancelAnimationFrame(raf);
      if (entry.isIntersecting) {
        start = 0; // al volver a entrar, el ciclo arranca de cero (más simple que pausar el reloj)
        raf = requestAnimationFrame(loop);
      }
    });
    io.observe(el);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  // Escena activa según el reloj global.
  let idx = 0, acc = 0;
  while (idx < DURS.length - 1 && time >= acc + DURS[idx]) acc += DURS[idx++];
  const local = time - acc;
  const p = Math.min(1, local / DURS[idx]);

  return (
    <div ref={ref} style={{ width: '100%', aspectRatio: '16 / 9', position: 'relative', overflow: 'hidden' }} aria-hidden="true">
      {w > 0 && (
        <div style={{ position: 'absolute', left: 0, top: 0, width: 1280, height: 720, transform: `scale(${w / 1280})`, transformOrigin: '0 0' }}>
          <Scene idx={idx} p={p} lt={local} />
        </div>
      )}
    </div>
  );
}
