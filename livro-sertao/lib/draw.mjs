// Primitivas de desenho com cara de xilogravura: traços com espessura
// variável, goivadas (cortes), contornos irregulares e aleatoriedade com
// semente (o livro sai sempre igual a cada geração).

export const C = {
  ink: '#1e1915',
  paper: '#f2e3c2',
  white: '#f7eedb',
  red: '#c6432c',
  redD: '#93301f',
  ochre: '#e2a33a',
  yellow: '#f0c64c',
  green: '#6b8a42',
  greenL: '#93ab5c',
  greenD: '#4d6a32',
  blue: '#3d6a96',
  blueL: '#86abc6',
  pink: '#d8708a',
  brown: '#8c5a33',
  brownL: '#b98450',
  earth: '#d29a5a',
  orange: '#dd7834',
  gray: '#a7a191',
  sky: '#cfe0d6',
};

export const SKIN = ['#e7b58c', '#c88d5d', '#9a6440', '#6f4328'];

let _rand = mulberry32(1);
function mulberry32(a) {
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const seed = (s) => {
  _rand = mulberry32(s);
};
export const rnd = (a = 0, b = 1) => a + (b - a) * _rand();
export const jit = (v, a) => v + rnd(-a, a);
export const pick = (arr) => arr[Math.floor(_rand() * arr.length)];
export const f = (n) => String(Math.round(n * 10) / 10);
let _id = 0;
export const uid = (p = 'u') => `${p}${++_id}`;
const TAU = Math.PI * 2;
export const rad = (d) => (d * Math.PI) / 180;

// ---------- curvas ----------

function bezierCtrl(pts, closed, k = 1) {
  const n = pts.length;
  const P = (i) => (closed ? pts[(i + n) % n] : pts[Math.max(0, Math.min(n - 1, i))]);
  const segs = [];
  const count = closed ? n : n - 1;
  for (let i = 0; i < count; i++) {
    const p0 = P(i - 1),
      p1 = P(i),
      p2 = P(i + 1),
      p3 = P(i + 2);
    segs.push([
      p1,
      [p1[0] + ((p2[0] - p0[0]) / 6) * k, p1[1] + ((p2[1] - p0[1]) / 6) * k],
      [p2[0] - ((p3[0] - p1[0]) / 6) * k, p2[1] - ((p3[1] - p1[1]) / 6) * k],
      p2,
    ]);
  }
  return segs;
}

// Curva suave (Catmull-Rom) passando pelos pontos.
export function spline(pts, closed = false, k = 1) {
  if (pts.length < 2) return '';
  const segs = bezierCtrl(pts, closed, k);
  let d = `M${f(pts[0][0])} ${f(pts[0][1])}`;
  for (const [, c1, c2, p2] of segs) d += `C${f(c1[0])} ${f(c1[1])} ${f(c2[0])} ${f(c2[1])} ${f(p2[0])} ${f(p2[1])}`;
  return closed ? d + 'Z' : d;
}

export function sample(pts, closed = false, per = 10, k = 1) {
  if (pts.length < 2) return pts.slice();
  const out = [];
  for (const [p0, c1, c2, p1] of bezierCtrl(pts, closed, k)) {
    for (let i = 0; i < per; i++) {
      const t = i / per,
        u = 1 - t;
      out.push([
        u * u * u * p0[0] + 3 * u * u * t * c1[0] + 3 * u * t * t * c2[0] + t * t * t * p1[0],
        u * u * u * p0[1] + 3 * u * u * t * c1[1] + 3 * u * t * t * c2[1] + t * t * t * p1[1],
      ]);
    }
  }
  if (!closed) out.push(pts[pts.length - 1].slice());
  return out;
}

const poly = (pts, close = true) =>
  pts.map((p, i) => `${i ? 'L' : 'M'}${f(p[0])} ${f(p[1])}`).join('') + (close ? 'Z' : '');
export { poly };

function normals(s, closed) {
  const n = s.length;
  return s.map((p, i) => {
    const a = closed ? s[(i - 1 + n) % n] : s[Math.max(0, i - 1)];
    const b = closed ? s[(i + 1) % n] : s[Math.min(n - 1, i + 1)];
    let tx = b[0] - a[0],
      ty = b[1] - a[1];
    const l = Math.hypot(tx, ty) || 1;
    return [-ty / l, tx / l];
  });
}

function lengths(s) {
  const L = [0];
  for (let i = 1; i < s.length; i++) L.push(L[i - 1] + Math.hypot(s[i][0] - s[i - 1][0], s[i][1] - s[i - 1][1]));
  return L;
}

const ease = (t) => Math.sin((Math.min(1, Math.max(0, t)) * Math.PI) / 2);

// Traço de pincel/goiva: espessura variável ao longo da curva, pontas afinadas.
// t0/t1 = fração do comprimento afinada no início/fim (0 = ponta redonda).
export function brushD(pts, w, o = {}) {
  const { t0 = 0.2, t1 = 0.2, min = 0.12, per = 10, wob = 0.12, k = 1 } = o;
  const s = sample(pts, false, per, k);
  const L = lengths(s);
  const tot = L[L.length - 1] || 1;
  const N = normals(s, false);
  const ph = rnd(0, TAU),
    fr = rnd(1.5, 3.5);
  const left = [],
    right = [],
    ws = [];
  s.forEach((p, i) => {
    const t = L[i] / tot;
    let k = 1;
    if (t0 > 0 && t < t0) k = min + (1 - min) * ease(t / t0);
    if (t1 > 0 && t > 1 - t1) k = Math.min(k, min + (1 - min) * ease((1 - t) / t1));
    k *= 1 + wob * Math.sin(ph + t * fr * TAU);
    const hw = (w * k) / 2;
    ws.push(hw);
    left.push([p[0] + N[i][0] * hw, p[1] + N[i][1] * hw]);
    right.push([p[0] - N[i][0] * hw, p[1] - N[i][1] * hw]);
  });
  let d = poly(left, false);
  const e = ws[ws.length - 1];
  const r0 = right[right.length - 1];
  d += t1 > 0 ? `L${f(r0[0])} ${f(r0[1])}` : `A${f(e)} ${f(e)} 0 0 0 ${f(r0[0])} ${f(r0[1])}`;
  for (let i = right.length - 2; i >= 0; i--) d += `L${f(right[i][0])} ${f(right[i][1])}`;
  const b = ws[0];
  d += t0 > 0 ? 'Z' : `A${f(b)} ${f(b)} 0 0 0 ${f(left[0][0])} ${f(left[0][1])}Z`;
  return d;
}

export const brush = (pts, w, fill = C.ink, o = {}) => `<path d="${brushD(pts, w, o)}" fill="${fill}"/>`;

// Goivada: corte afinado nas duas pontas, com leve curvatura.
export function cut(x1, y1, x2, y2, w, fill = C.paper, bend = 0) {
  const mx = (x1 + x2) / 2,
    my = (y1 + y2) / 2;
  const dx = x2 - x1,
    dy = y2 - y1;
  const l = Math.hypot(dx, dy) || 1;
  const b = bend * l;
  return brush(
    [
      [x1, y1],
      [mx + (-dy / l) * b, my + (dx / l) * b],
      [x2, y2],
    ],
    w,
    fill,
    { t0: 0.45, t1: 0.45, min: 0.05, per: 6, wob: 0.05 },
  );
}

// Contorno com espessura irregular (anel) para formas fechadas.
export function ringD(pts, w, vary = 0.35, per = 8, k = 1) {
  const s = sample(pts, true, per, k);
  const N = normals(s, true);
  const n = s.length;
  const p1 = rnd(0, TAU),
    p2 = rnd(0, TAU);
  const k1 = Math.floor(rnd(2, 5)),
    k2 = Math.floor(rnd(5, 9));
  const out = [],
    inn = [];
  s.forEach((p, i) => {
    const t = i / n;
    const hw = (w / 2) * (1 + vary * (0.6 * Math.sin(p1 + t * k1 * TAU) + 0.4 * Math.sin(p2 + t * k2 * TAU)));
    out.push([p[0] + N[i][0] * hw, p[1] + N[i][1] * hw]);
    inn.push([p[0] - N[i][0] * hw, p[1] - N[i][1] * hw]);
  });
  return poly(out) + poly(inn.reverse());
}

// Forma preenchida com contorno de tinta irregular.
export function shape(pts, fill, o = {}) {
  const { w = 6, vary = 0.35, closed = true, k = 1, extra = '' } = o;
  const d = spline(pts, closed, k);
  let s = fill ? `<path d="${d}" fill="${fill}" ${extra}/>` : '';
  if (w > 0) s += `<path d="${ringD(pts, w, vary, k === 1 ? 8 : 3, k)}" fill="${C.ink}" fill-rule="evenodd"/>`;
  return s;
}

export function blobPts(cx, cy, rx, ry, n = 14, j = 0.06, rot = 0, a0 = 0) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * TAU;
    const r = 1 + rnd(-j, j);
    const x = Math.cos(a) * rx * r,
      y = Math.sin(a) * ry * r;
    const c = Math.cos(rot),
      sn = Math.sin(rot);
    pts.push([cx + x * c - y * sn, cy + x * sn + y * c]);
  }
  return pts;
}

export const blob = (cx, cy, rx, ry, fill, o = {}) =>
  shape(blobPts(cx, cy, rx, ry, o.n || 14, o.j ?? 0.05, o.rot || 0), fill, o);

export function offsetLine(pts, d, per = 10) {
  const s = sample(pts, false, per);
  const N = normals(s, false);
  return s.map((p, i) => [p[0] + N[i][0] * d, p[1] + N[i][1] * d]);
}

// Membro (braço/perna/galho) com contorno: tinta por baixo, cor por cima.
export function limb(pts, w, fill, ol = 5, o = {}) {
  return (
    brush(pts, w + ol * 2, C.ink, { t0: 0, t1: 0, wob: 0.06, ...o }) +
    brush(pts, w, fill, { t0: 0, t1: 0, wob: 0.04, ...o })
  );
}

// Hachura de goivadas recortada por uma forma.
export function hatch(clipD, box, o = {}) {
  const { angle = 0, gap = 12, w = 3, len = [30, 70], fill = C.ink, jitter = 3, bend = 0.04 } = o;
  const id = uid('h');
  const [x0, y0, x1, y1] = box;
  const cx = (x0 + x1) / 2,
    cy = (y0 + y1) / 2;
  const R = Math.hypot(x1 - x0, y1 - y0) / 2 + 10;
  const a = rad(angle),
    ca = Math.cos(a),
    sa = Math.sin(a);
  let s = '';
  for (let v = -R; v < R; v += gap) {
    let u = -R + rnd(0, len[0]);
    while (u < R) {
      const l = rnd(len[0], len[1]);
      const vv = v + rnd(-jitter, jitter);
      const ax = cx + u * ca - vv * sa,
        ay = cy + u * sa + vv * ca;
      const bx = cx + (u + l) * ca - vv * sa,
        by = cy + (u + l) * sa + vv * ca;
      s += cut(ax, ay, bx, by, w * rnd(0.6, 1.2), fill, rnd(-bend, bend));
      u += l + rnd(4, 18);
    }
  }
  return `<clipPath id="${id}"><path d="${clipD}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
}

export const g = (inner, t = '') => `<g${t ? ` transform="${t}"` : ''}>${inner}</g>`;

export function star(cx, cy, r, n = 5, inner = 0.45, rot = -90) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = rad(rot + (i * 180) / n);
    const rr = (i % 2 ? r * inner : r) * (1 + rnd(-0.05, 0.05));
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

export function starShape(cx, cy, r, fill = C.yellow, o = {}) {
  const pts = star(cx, cy, r, o.n || 5, o.inner || 0.46, o.rot ?? -90);
  return `<path d="${poly(pts)}" fill="${fill}" stroke="${C.ink}" stroke-width="${o.w ?? 4}" stroke-linejoin="round"/>`;
}

export function circle(cx, cy, r, fill = C.ink) {
  return `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r)}" fill="${fill}"/>`;
}

// Texto "entalhado" (vai junto com a ilustração e recebe o mesmo filtro).
export function carved(x, y, txt, size, o = {}) {
  const { fill = C.ink, font = 'Rye', anchor = 'middle', rot = 0, stroke = '', sw = 0, ls = 0 } = o;
  return `<text x="${f(x)}" y="${f(y)}" font-family="${font}" font-size="${size}" fill="${fill}" text-anchor="${anchor}"${
    stroke ? ` stroke="${stroke}" stroke-width="${sw}" paint-order="stroke" stroke-linejoin="round"` : ''
  }${ls ? ` letter-spacing="${ls}"` : ''}${rot ? ` transform="rotate(${rot} ${f(x)} ${f(y)})"` : ''}>${txt}</text>`;
}
