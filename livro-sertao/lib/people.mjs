// A Turma dos Heróis (quatro crianças com capa) e o Sanfoneiro.
import { C, SKIN, rnd, jit, f, uid, rad, spline, poly, brush, cut, shape, blobPts, blob, limb, circle, starShape } from './draw.mjs';

const TAU = Math.PI * 2;

export const TURMA = {
  maria: { skin: SKIN[1], hair: 'trancas', cape: C.red, outfit: 'dress', cloth: C.yellow, pattern: 'dots', emblem: C.red },
  ze: { skin: SKIN[0], hair: 'chapeu', cape: C.blue, outfit: 'shorts', cloth: C.green, shorts: C.brown, pattern: 'stripes', emblem: C.yellow },
  biu: { skin: SKIN[3], hair: 'cachos', cape: C.green, outfit: 'shorts', cloth: C.red, shorts: C.blue, pattern: 'buttons', emblem: C.yellow },
  ana: { skin: SKIN[2], hair: 'puffs', cape: C.yellow, outfit: 'dress', cloth: C.blue, pattern: 'flowers', emblem: C.yellow },
};

// Poses: pontos do lado direito (+x). Lado esquerdo espelha se não for dado.
const HIP_HAND = { e: [50, -90], h: [26, -70] };
const DOWN = { e: [32, -86], h: [36, -60] };
const mir = (A) => ({ e: [-A.e[0], A.e[1]], h: [-A.h[0], A.h[1]] });
const STAND = { k: [14, -34], f: [18, -4] };
export const POSES = {
  hero: { R: HIP_HAND, legs: { R: { k: [17, -34], f: [24, -4] } } },
  up: { R: { e: [44, -142], h: [52, -176] }, legs: { R: { k: [20, -34], f: [28, -6] } } },
  wave: { R: { e: [46, -140], h: [58, -172] }, L: mir(DOWN) },
  walk: { R: { e: [36, -88], h: [44, -62] }, L: { e: [-34, -90], h: [-48, -68] }, legs: { R: { k: [16, -40], f: [26, -14] }, L: { k: [-12, -34], f: [-14, -3] } } },
  sniff: { R: { e: [42, -92], h: [10, -100] }, tilt: -7 },
  crouch: { dy: 36, R: { e: [48, -64], h: [36, -42] }, legs: { R: { k: [34, -42], f: [24, -4] } } },
  listen: { R: { e: [60, -124], h: [46, -160] }, L: { e: [-50, -90], h: [-26, -70] }, tilt: 8 },
  point: { R: { e: [56, -118], h: [90, -126] }, L: { e: [-50, -90], h: [-26, -70] } },
  dance: { R: { e: [48, -134], h: [42, -168] }, L: { e: [-50, -104], h: [-72, -88] }, legs: { R: { k: [24, -36], f: [40, -16] }, L: { k: [-12, -34], f: [-14, -3] } }, tilt: -6 },
  dance2: { L: { e: [-48, -134], h: [-42, -168] }, R: { e: [50, -104], h: [72, -88] }, legs: { L: { k: [-24, -36], f: [-40, -16] }, R: { k: [12, -34], f: [14, -3] } }, tilt: 6 },
  search: { R: { e: [50, -138], h: [20, -184] }, L: { e: [-50, -90], h: [-26, -70] }, tilt: 5 },
  think: { R: { e: [42, -100], h: [12, -124] }, L: { e: [-50, -90], h: [-26, -70] }, tilt: 6 },
  hold: { R: { e: [44, -96], h: [64, -80] } },
  clap: { R: { e: [44, -108], h: [6, -128] } },
  carry: { R: { e: [42, -96], h: [24, -112] } },
  jump: { R: { e: [44, -142], h: [52, -176] }, legs: { R: { k: [24, -40], f: [22, -12] } } },
  pat: { R: { e: [42, -88], h: [27, -56] }, legs: { R: { k: [17, -34], f: [24, -4] } } },
};

function sideOf(pose, side) {
  const R = pose.R || HIP_HAND;
  if (side === 1) return R;
  if (pose.L) return pose.L;
  return { e: [-R.e[0], R.e[1]], h: [-R.h[0], R.h[1]] };
}
function legOf(pose, side) {
  const R = (pose.legs && pose.legs.R) || STAND;
  if (side === 1) return R;
  if (pose.legs && pose.legs.L) return pose.legs.L;
  return { k: [-R.k[0], R.k[1]], f: [-R.f[0], R.f[1]] };
}

// ---------- rosto ----------
export function face(cx, cy, r, kind = 'smile', o = {}) {
  const k = r / 40;
  const X = (v) => cx + v * k,
    Y = (v) => cy + v * k;
  let s = '';
  const eye = (sx) => {
    const ex = X(sx * 14),
      ey = Y(-2);
    if (kind === 'happy' || kind === 'sing') return brush([[ex - 7 * k, ey + 2 * k], [ex, ey - 5 * k], [ex + 7 * k, ey + 2 * k]], 4 * k, C.ink, { t0: 0.25, t1: 0.25 });
    if (kind === 'sniff' || kind === 'blow') return brush([[ex - 7 * k, ey - 1 * k], [ex, ey + 4 * k], [ex + 7 * k, ey - 1 * k]], 4 * k, C.ink, { t0: 0.25, t1: 0.25 });
    const big = kind === 'wow' ? 1.35 : 1;
    const look = o.look || [0, 0];
    return (
      `<ellipse cx="${f(ex)}" cy="${f(ey)}" rx="${f(6 * k * big)}" ry="${f(7 * k * big)}" fill="${C.white}" stroke="${C.ink}" stroke-width="${f(2.2 * k)}"/>` +
      circle(ex + look[0] * k, ey + look[1] * k + 1 * k, 4.2 * k * big) +
      circle(ex + look[0] * k + 1.3 * k, ey + look[1] * k - 0.6 * k, 1.3 * k, C.white)
    );
  };
  s += eye(-1) + eye(1);
  // sobrancelhas
  for (const sx of [-1, 1]) {
    const up = kind === 'wow' || kind === 'think' ? -4 : 0;
    s += brush([[X(sx * 21), Y(-14 + up)], [X(sx * 14), Y(-17 + up)], [X(sx * 7), Y(-15 + up)]], 3.4 * k, C.ink, { t0: 0.3, t1: 0.3 });
  }
  // bochechas
  const ch = kind === 'blow' ? 9 : 6.5;
  for (const sx of [-1, 1]) s += circle(X(sx * 25), Y(12), ch * k, C.red).replace('/>', ' opacity="0.7"/>');
  // nariz
  s += brush([[X(-1), Y(2)], [X(3), Y(8)], [X(-2), Y(10)]], 3 * k, C.ink, { t0: 0.2, t1: 0.3 });
  // boca
  if (kind === 'smile' || kind === 'sniff') {
    s += brush([[X(-12), Y(16)], [X(0), Y(23)], [X(12), Y(16)]], 4 * k, C.ink, { t0: 0.25, t1: 0.25 });
  } else if (kind === 'open' || kind === 'happy' || kind === 'sing') {
    s += `<path d="M${f(X(-12))} ${f(Y(15))}Q${f(X(0))} ${f(Y(18))} ${f(X(12))} ${f(Y(15))}Q${f(X(10))} ${f(Y(32))} ${f(X(0))} ${f(Y(32))}Q${f(X(-10))} ${f(Y(32))} ${f(X(-12))} ${f(Y(15))}Z" fill="${C.ink}"/>`;
    s += `<ellipse cx="${f(X(0))}" cy="${f(Y(27))}" rx="${f(6 * k)}" ry="${f(3.5 * k)}" fill="${C.red}"/>`;
  } else if (kind === 'o' || kind === 'wow' || kind === 'blow') {
    const rr = kind === 'blow' ? 4.5 : 6;
    s += `<ellipse cx="${f(X(kind === 'blow' ? 3 : 0))}" cy="${f(Y(22))}" rx="${f(rr * k)}" ry="${f((rr + 2) * k)}" fill="${C.ink}"/>`;
  } else if (kind === 'think') {
    s += brush([[X(-8), Y(21)], [X(9), Y(18)]], 4 * k, C.ink, { t0: 0.3, t1: 0.3 });
  }
  return s;
}

// ---------- cabelos ----------
function hairCap(cx, cy, r, part = true) {
  const pts = [];
  for (const a of [168, 195, 225, 255, 285, 315, 345, 372]) pts.push([cx + Math.cos(rad(a)) * r * 1.1, cy + Math.sin(rad(a)) * r * 1.1]);
  const hl = part
    ? [[r * 1.02, -0.1 * r], [0.78 * r, -0.5 * r], [0.35 * r, -0.66 * r], [0, -0.55 * r], [-0.35 * r, -0.66 * r], [-0.78 * r, -0.5 * r], [-r * 1.02, -0.1 * r]]
    : [[r * 1.02, -0.1 * r], [0.75 * r, -0.52 * r], [0.3 * r, -0.62 * r], [-0.3 * r, -0.62 * r], [-0.75 * r, -0.52 * r], [-r * 1.02, -0.1 * r]];
  for (const [x, y] of hl) pts.push([cx + x, cy + y]);
  let s = shape(pts, C.ink, { w: 3 });
  for (let i = 0; i < 6; i++) {
    const a = rad(205 + i * 24);
    s += cut(cx + Math.cos(a) * r * 0.85, cy + Math.sin(a) * r * 0.85, cx + Math.cos(a + 0.25) * r * 1.0, cy + Math.sin(a + 0.25) * r * 1.0, 3, C.paper);
  }
  return s;
}

function braid(x0, y0, x1, y1, ribbon) {
  let s = '';
  const n = 4;
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const x = x0 + (x1 - x0) * t,
      y = y0 + (y1 - y0) * t;
    s += blob(x, y, 9, 11, C.ink, { w: 2, n: 10 });
    s += cut(x - 5, y - 4, x + 4, y + 5, 2.4, C.paper);
  }
  const bx = x1,
    by = y1 + 12;
  s += shape([[bx, by], [bx - 14, by - 9], [bx - 13, by + 9]], ribbon, { w: 3, k: 0 });
  s += shape([[bx, by], [bx + 14, by - 9], [bx + 13, by + 9]], ribbon, { w: 3, k: 0 });
  s += circle(bx, by, 4.5, C.ink);
  for (const d of [-5, 0, 5]) s += brush([[bx, by + 4], [bx + d, by + 18]], 4, C.ink, { t0: 0, t1: 0.7 });
  return s;
}

function curlyMass(cx, cy, r, n = 16, a0 = 0, a1 = 360) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    const rr = r * (i % 2 ? 0.9 : 1.04) * (1 + rnd(-0.03, 0.03));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

function curls(cx, cy, r, n) {
  let s = '';
  for (let i = 0; i < n; i++) {
    const a = rnd(0, TAU),
      d = rnd(0.2, 0.8) * r;
    const x = cx + Math.cos(a) * d,
      y = cy + Math.sin(a) * d;
    const b = rnd(0, TAU);
    s += cut(x - Math.cos(b) * 5, y - Math.sin(b) * 5, x + Math.cos(b) * 5, y + Math.sin(b) * 5, 2.6, C.paper, 0.35);
  }
  return s;
}

export function leatherHat(cx, cy, r, o = {}) {
  // chapéu de couro com a aba da frente virada pra cima em meia-lua;
  // (cx, cy, r) = centro e raio da cabeça
  const P = (x, y) => [cx + x * r, cy + y * r];
  const outer = [P(-1.86, -0.26), P(-1.5, -0.72), P(-1.12, -1.28), P(-0.58, -1.64), P(0, -1.74), P(0.58, -1.64), P(1.12, -1.28), P(1.5, -0.72), P(1.86, -0.26)];
  const inner = [P(1.45, -0.4), P(1.0, -0.52), P(0.5, -0.64), P(0, -0.68), P(-0.5, -0.64), P(-1.0, -0.52), P(-1.45, -0.4)];
  let s = shape(outer.concat(inner), o.color || C.brown, { w: 5 });
  // costura
  const st = [P(-1.5, -0.46), P(-1.2, -0.9), P(-0.9, -1.25), P(-0.45, -1.48), P(0, -1.55), P(0.45, -1.48), P(0.9, -1.25), P(1.2, -0.9), P(1.5, -0.46)];
  for (let i = 0; i < st.length - 1; i++) {
    const [x1, y1] = st[i],
      [x2, y2] = st[i + 1];
    s += cut(x1 + (x2 - x1) * 0.2, y1 + (y2 - y1) * 0.2, x1 + (x2 - x1) * 0.75, y1 + (y2 - y1) * 0.75, r * 0.06, C.brownL);
  }
  s += starShape(cx, cy - r * 1.17, r * 0.24, C.yellow, { w: 2.6 });
  for (const sx of [-1, 1]) {
    s += starShape(cx + sx * r * 0.74, cy - r * 1.0, r * 0.14, C.yellow, { w: 2 });
    s += circle(cx + sx * r * 1.12, cy - r * 0.7, r * 0.06, C.paper);
    s += circle(cx + sx * r * 0.38, cy - r * 0.98, r * 0.05, C.paper);
  }
  return s;
}

export function head(cx, cy, r, who, kind = 'smile', o = {}) {
  const k = TURMA[who] || who;
  let s = '';
  // atrás da cabeça
  if (k.hair === 'puffs') {
    for (const sx of [-1, 1]) {
      s += shape(curlyMass(cx + sx * r * 0.82, cy - r * 0.9, r * 0.5, 12), C.ink, { w: 2 });
      s += curls(cx + sx * r * 0.82, cy - r * 0.9, r * 0.45, 4);
    }
  }
  if (k.hair === 'cachos') {
    s += shape(curlyMass(cx, cy - r * 0.22, r * 1.17, 22, 160, 380), C.ink, { w: 2 });
    s += curls(cx, cy - r * 0.6, r * 0.7, 9);
  }
  // orelhas
  for (const sx of [-1, 1]) s += blob(cx + sx * r * 0.98, cy + r * 0.05, r * 0.2, r * 0.24, k.skin, { w: 3.5, n: 10 });
  s += shape(blobPts(cx, cy, r, r * 1.02, 18, 0.02), k.skin, { w: 5 });
  if (k.hair === 'trancas') {
    s += hairCap(cx, cy, r, true);
    s += braid(cx - r * 1.02, cy + r * 0.05, cx - r * 1.2, cy + r * 1.2, C.red);
    s += braid(cx + r * 1.02, cy + r * 0.05, cx + r * 1.2, cy + r * 1.2, C.red);
  } else if (k.hair === 'puffs') {
    s += hairCap(cx, cy, r, false);
    const fx = cx + r * 0.95,
      fy = cy - r * 1.05;
    for (let i = 0; i < 5; i++) {
      const a = rad(i * 72);
      s += blob(fx + Math.cos(a) * r * 0.16, fy + Math.sin(a) * r * 0.16, r * 0.13, r * 0.13, C.pink, { w: 2.5, n: 8 });
    }
    s += circle(fx, fy, r * 0.09, C.yellow);
  } else if (k.hair === 'cachos') {
    const pts = [];
    for (const a of [172, 200, 230, 260, 290, 320, 350, 368]) pts.push([cx + Math.cos(rad(a)) * r * 1.02, cy + Math.sin(rad(a)) * r * 1.02]);
    for (const [x, y] of [[0.98, -0.2], [0.6, -0.55], [0, -0.62], [-0.6, -0.55], [-0.98, -0.2]]) pts.push([cx + x * r, cy + y * r]);
    s += shape(pts, C.ink, { w: 2 });
    s += curls(cx, cy - r * 0.75, r * 0.3, 4);
  } else if (k.hair === 'chapeu') {
    const pts = [];
    for (const a of [172, 200, 240, 300, 340, 368]) pts.push([cx + Math.cos(rad(a)) * r * 1.03, cy + Math.sin(rad(a)) * r * 1.03]);
    for (const [x, y] of [[0.98, -0.15], [0.62, -0.5], [0.15, -0.58], [-0.2, -0.48], [-0.62, -0.52], [-0.98, -0.15]]) pts.push([cx + x * r, cy + y * r]);
    s += shape(pts, C.ink, { w: 2 });
    s += leatherHat(cx, cy, r * 0.95);
  }
  s += face(cx, cy + r * 0.05, r, kind, o);
  return s;
}

// ---------- criança herói ----------
export function kid(x, y, s, who, o = {}) {
  const k = TURMA[who];
  const pose = typeof o.pose === 'object' ? o.pose : POSES[o.pose || 'hero'];
  const dy = pose.dy || 0;
  const flip = o.flip ? -1 : 1;
  const wind = o.wind ?? 0.35;
  let out = '';
  const U = (px, py) => [px, py + dy];

  // capa
  const cw = wind;
  const bl = [-50 + cw * 34, -24 - Math.max(0, -cw) * 34 + dy * 0.6];
  const br = [50 + cw * 34, -24 - Math.max(0, cw) * 34 + dy * 0.6];
  const capePts = [
    U(-24, -118),
    [-40 + cw * 10, -80 + dy],
    bl,
    [bl[0] + (br[0] - bl[0]) * 0.25, bl[1] + (br[1] - bl[1]) * 0.25 - 10],
    [bl[0] + (br[0] - bl[0]) * 0.5, bl[1] + (br[1] - bl[1]) * 0.5 + 2],
    [bl[0] + (br[0] - bl[0]) * 0.75, bl[1] + (br[1] - bl[1]) * 0.75 - 10],
    br,
    [40 + cw * 10, -80 + dy],
    U(24, -118),
  ];
  out += shape(capePts, k.cape, { w: 5 });
  out += brush([[-34 + cw * 8, -96 + dy], [-38 + cw * 20, -60 + dy * 0.8], [bl[0] + 14, bl[1] - 8]], 4, C.ink, { t0: 0.4, t1: 0.3 });
  out += brush([[34 + cw * 8, -96 + dy], [38 + cw * 20, -60 + dy * 0.8], [br[0] - 14, br[1] - 8]], 4, C.ink, { t0: 0.4, t1: 0.3 });

  // pernas
  for (const sd of [-1, 1]) {
    const L = legOf(pose, sd);
    const hip = U(sd * 11, -64);
    out += limb([hip, L.k, L.f], 15, k.skin, 4.5);
    const fx = L.f[0] + sd * 5,
      fy = L.f[1] + 2;
    out += `<ellipse cx="${f(fx)}" cy="${f(fy)}" rx="13" ry="7" fill="${C.ink}" transform="rotate(${sd * 6} ${f(fx)} ${f(fy)})"/>`;
    out += cut(fx - 7, fy - 2, fx + 6, fy - 3, 2.4, C.brownL);
  }

  // roupa
  let bodyPts;
  if (k.outfit === 'dress') {
    bodyPts = [U(-27, -108), U(-19, -119), U(0, -121), U(19, -119), U(27, -108), U(24, -84), U(44, -38), U(22, -33), U(0, -36), U(-22, -33), U(-44, -38), U(-24, -84)];
  } else {
    const sh = [U(-26, -72), U(26, -72), U(28, -44), U(4, -44), U(0, -52), U(-4, -44), U(-28, -44)];
    out += shape(sh, k.shorts, { w: 4.5, k: 0.6 });
    bodyPts = [U(-27, -108), U(-19, -119), U(0, -121), U(19, -119), U(27, -108), U(25, -88), U(24, -64), U(0, -62), U(-24, -64), U(-25, -88)];
  }
  const bodyD = spline(bodyPts, true);
  out += shape(bodyPts, k.cloth, { w: 5 });
  const cid = uid('cl');
  let pat = '';
  if (k.pattern === 'dots') for (let yy = -110; yy < -30; yy += 13) for (let xx = -44 + (yy % 2 ? 0 : 6); xx < 46; xx += 13) pat += circle(xx + rnd(-1, 1), yy + dy + rnd(-1, 1), 2.6, C.white);
  if (k.pattern === 'stripes') for (let yy = -112; yy < -60; yy += 10) pat += cut(-30, yy + dy, 30, yy + dy + rnd(-1, 1), 3.4, C.ink, 0.01);
  if (k.pattern === 'flowers')
    for (let yy = -104; yy < -34; yy += 19)
      for (let xx = -40 + ((yy / 19) % 2 ? 0 : 9); xx < 44; xx += 19) {
        for (let p = 0; p < 5; p++) pat += circle(xx + Math.cos(rad(p * 72)) * 3.8, yy + dy + Math.sin(rad(p * 72)) * 3.8, 2.4, C.white);
        pat += circle(xx, yy + dy, 1.8, C.yellow);
      }
  if (k.pattern === 'buttons') for (let yy = -104; yy < -66; yy += 11) pat += circle(0, yy + dy, 2.4, C.white);
  out += `<clipPath id="${cid}"><path d="${bodyD}"/></clipPath><g clip-path="url(#${cid})">${pat}</g>`;
  out += `<path d="${spline(bodyPts, true)}" fill="none" stroke="${C.ink}" stroke-width="4.5"/>`;
  // golinha da capa
  for (const sd of [-1, 1]) out += shape([U(sd * 8, -120), U(sd * 26, -128), U(sd * 24, -112)], k.cape, { w: 3.5, k: 0 });
  if (!o.noEmblem) out += starShape(0, -98 + dy, 10, k.emblem, { w: 3 });

  // pescoço e cabeça
  out += `<rect x="-8" y="${f(-126 + dy)}" width="16" height="12" fill="${k.skin}" stroke="${C.ink}" stroke-width="3"/>`;
  const tilt = (pose.tilt || 0) + (o.tilt || 0);
  out += `<g transform="rotate(${tilt} 0 ${f(-120 + dy)})">${head(0, -160 + dy, 40, who, o.face || pose.face || 'smile', { look: o.look })}</g>`;

  if (o.prop) out += o.prop;
  // braços
  for (const sd of [-1, 1]) {
    const A = sideOf(o.arms ? { ...pose, ...o.arms } : pose, sd);
    const sh = U(sd * 24, -112);
    const e = [A.e[0], A.e[1] + dy],
      h = [A.h[0], A.h[1] + dy];
    out += limb([sh, e, h], 12.5, k.skin, 4.5);
    const sl = [sh[0] + (e[0] - sh[0]) * 0.55, sh[1] + (e[1] - sh[1]) * 0.55];
    out += limb([[sh[0] - sd * 2, sh[1] - 2], sl], 17, k.cloth, 4);
    out += blob(h[0], h[1], 8.5, 8.5, k.skin, { w: 3.6, n: 10 });
  }
  if (o.propFront) out += o.propFront;
  const T = `translate(${f(x)} ${f(y)}) scale(${f(s * flip)} ${f(s)})${o.rot ? ` rotate(${o.rot})` : ''}`;
  return `<g transform="${T}">${out}</g>`;
}

// ---------- sanfoneiro ----------
export function sanfoneiro(x, y, s, o = {}) {
  const pose = o.pose || 'play';
  const skin = SKIN[1];
  let out = '';
  // pernas (calça)
  for (const sd of [-1, 1]) {
    out += limb([[sd * 17, -138], [sd * 20, -72], [sd * 23, -10]], 25, C.blue, 5);
    for (let i = 0; i < 3; i++) out += cut(sd * (16 + i * 2), -126 + i * 30, sd * (20 + i * 2), -104 + i * 30, 2.5, C.ink);
    const fx = sd * 30,
      fy = -2;
    out += `<ellipse cx="${fx}" cy="${fy}" rx="20" ry="9" fill="${C.ink}"/>`;
    out += cut(fx - 12, fy - 3, fx + 10, fy - 4, 3, C.brownL);
  }
  // camisa + gibão
  const torso = [[-42, -200], [-30, -212], [0, -215], [30, -212], [42, -200], [40, -170], [36, -132], [0, -128], [-36, -132], [-40, -170]];
  out += shape(torso, C.white, { w: 5 });
  for (const sd of [-1, 1]) {
    const vest = [[sd * 14, -212], [sd * 32, -212], [sd * 43, -198], [sd * 41, -168], [sd * 38, -130], [sd * 14, -128], [sd * 10, -170]];
    out += shape(vest, C.brown, { w: 5 });
    for (let i = 0; i < 6; i++) out += circle(sd * 18, -200 + i * 13, 2.3, C.yellow);
    for (let i = 0; i < 4; i++) out += cut(sd * 26, -186 + i * 14, sd * 36, -182 + i * 14, 2.5, C.brownL);
  }
  // cinto
  out += `<rect x="-38" y="-142" width="76" height="10" fill="${C.ink}"/>`;
  out += `<rect x="-7" y="-144" width="14" height="14" fill="${C.ochre}" stroke="${C.ink}" stroke-width="3"/>`;
  // lenço
  out += shape([[-18, -214], [18, -214], [4, -186], [0, -180], [-4, -186]], C.red, { w: 4, k: 0.4 });
  for (const d of [-6, 0, 6]) out += circle(d, -205 + Math.abs(d) * 0.3, 1.8, C.white);
  // cabeça
  out += `<rect x="-11" y="-226" width="22" height="16" fill="${skin}" stroke="${C.ink}" stroke-width="3.5"/>`;
  const hx = 0,
    hy = -262,
    r = 40;
  let hd = '';
  for (const sd of [-1, 1]) hd += blob(hx + sd * r * 0.98, hy + 4, 8, 10, skin, { w: 3.5, n: 10 });
  hd += shape(blobPts(hx, hy, r, r * 1.08, 18, 0.02), skin, { w: 5 });
  // cabelo (costeletas)
  for (const sd of [-1, 1]) hd += shape([[sd * 40, hy - 4], [sd * 41, hy - 28], [sd * 30, hy - 36], [sd * 34, hy - 10]], C.ink, { w: 2 });
  const mood = o.face || (pose === 'announce' ? 'wow' : 'happy');
  hd += face(hx, hy + 2, r, mood === 'happy' ? 'happy' : mood, { look: o.look });
  // bigode por cima da boca
  hd += brush([[hx - 26, hy + 18], [hx - 14, hy + 10], [hx, hy + 13]], 9, C.ink, { t0: 0.7, t1: 0.1 });
  hd += brush([[hx, hy + 13], [hx + 14, hy + 10], [hx + 26, hy + 18]], 9, C.ink, { t0: 0.1, t1: 0.7 });
  hd += leatherHat(hx, hy, r);
  const tilt = o.tilt ?? (pose === 'play' ? -6 : 0);
  out += `<g transform="rotate(${tilt} 0 -222)">${hd}</g>`;

  // sanfona e braços
  if (pose === 'play') {
    out += sanfonaLocal(0, -168, 150, 0.9);
    out += limb([[-38, -204], [-72, -176], [-82, -158]], 16, C.white, 5);
    out += limb([[38, -204], [80, -170], [64, -150]], 16, C.white, 5);
    out += blob(-82, -156, 11, 12, skin, { w: 4 });
    out += blob(62, -150, 12, 11, skin, { w: 4 });
    for (const [mx, my] of [[-104, -196], [100, -150]]) out += brush([[mx, my - 16], [mx + (mx > 0 ? 8 : -8), my], [mx, my + 16]], 4, C.ink, { t0: 0.3, t1: 0.3 });
  } else {
    out += sanfonaLocal(0, -160, 120, 0.25);
    if (pose === 'announce') {
      out += limb([[38, -204], [70, -238], [74, -276]], 16, C.white, 5);
      out += blob(74, -280, 11, 12, skin, { w: 4 });
      out += brush([[74, -288], [76, -306]], 7, skin, { t0: 0, t1: 0 });
      out += `<path d="M73 -290 L72 -308" stroke="${C.ink}" stroke-width="2"/>`;
      out += limb([[-38, -204], [-58, -168], [-54, -152]], 16, C.white, 5);
      out += blob(-54, -150, 11, 11, skin, { w: 4 });
    } else {
      // braços abertos (sorrindo)
      out += limb([[38, -204], [74, -196], [104, -224]], 16, C.white, 5);
      out += blob(106, -228, 11, 12, skin, { w: 4 });
      out += limb([[-38, -204], [-74, -196], [-104, -224]], 16, C.white, 5);
      out += blob(-106, -228, 11, 12, skin, { w: 4 });
    }
  }
  return `<g transform="translate(${f(x)} ${f(y)}) scale(${f(s * (o.flip ? -1 : 1))} ${f(s)})">${out}</g>`;
}

// sanfona desenhada em coordenadas locais (usada também em outras cenas)
export function sanfonaLocal(cx, cy, w, open = 0.6) {
  const h = w * 0.62;
  const lb = w * 0.25,
    rb = w * 0.3;
  const bw = w - lb - rb;
  const x0 = cx - w / 2;
  let s = '';
  // fole
  const fx0 = x0 + lb,
    fx1 = fx0 + bw;
  s += shape([[fx0, cy - h * 0.46], [fx1, cy - h * 0.46], [fx1, cy + h * 0.46], [fx0, cy + h * 0.46]], C.white, { w: 4, k: 0 });
  const n = Math.max(4, Math.round(5 + open * 5));
  for (let i = 0; i <= n; i++) {
    const xx = fx0 + (bw * i) / n;
    s += brush([[xx, cy - h * 0.46], [xx + (i % 2 ? 3 : -3), cy], [xx, cy + h * 0.46]], i % 2 ? 3 : 5, C.ink, { t0: 0, t1: 0, k: 0 });
  }
  for (const yy of [cy - h * 0.46, cy + h * 0.46]) for (let i = 0; i < n; i++) s += `<path d="M${f(fx0 + (bw * i) / n)} ${f(yy)}l${f(bw / n / 2)} ${yy < cy ? 7 : -7}l${f(bw / n / 2)} ${yy < cy ? -7 : 7}" fill="${C.ink}"/>`;
  // caixa esquerda (baixos)
  s += shape([[x0, cy - h / 2], [x0 + lb, cy - h / 2], [x0 + lb, cy + h / 2], [x0, cy + h / 2]], C.red, { w: 5, k: 0 });
  for (let i = 0; i < 3; i++) for (let j = 0; j < 5; j++) s += `<circle cx="${f(x0 + lb * (0.25 + i * 0.25))}" cy="${f(cy - h * 0.34 + j * h * 0.17)}" r="${f(w * 0.016)}" fill="${C.white}" stroke="${C.ink}" stroke-width="1.8"/>`;
  // caixa direita (teclado)
  const rx0 = fx1;
  s += shape([[rx0, cy - h / 2], [rx0 + rb, cy - h / 2], [rx0 + rb, cy + h / 2], [rx0, cy + h / 2]], C.red, { w: 5, k: 0 });
  const kx = rx0 + rb * 0.55,
    kw = rb * 0.38;
  s += `<rect x="${f(kx)}" y="${f(cy - h * 0.44)}" width="${f(kw)}" height="${f(h * 0.88)}" fill="${C.white}" stroke="${C.ink}" stroke-width="3"/>`;
  const nk = 9;
  for (let i = 1; i < nk; i++) s += `<path d="M${f(kx)} ${f(cy - h * 0.44 + (h * 0.88 * i) / nk)}h${f(kw)}" stroke="${C.ink}" stroke-width="1.8"/>`;
  for (const i of [1, 2, 4, 5, 6, 8]) s += `<rect x="${f(kx)}" y="${f(cy - h * 0.44 + (h * 0.88 * i) / nk - 2.5)}" width="${f(kw * 0.55)}" height="5" fill="${C.ink}"/>`;
  s += starShape(rx0 + rb * 0.27, cy, rb * 0.18, C.yellow, { w: 2.5 });
  s += `<path d="M${f(rx0 + rb * 0.1)} ${f(cy - h * 0.38)}h${f(rb * 0.34)}M${f(rx0 + rb * 0.1)} ${f(cy + h * 0.38)}h${f(rb * 0.34)}" stroke="${C.ink}" stroke-width="3"/>`;
  return s;
}
