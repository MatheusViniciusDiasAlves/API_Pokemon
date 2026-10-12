// Comidas da festa, instrumentos e objetos.
import { C, rnd, jit, f, uid, rad, spline, sample, poly, brush, cut, shape, blobPts, blob, limb, hatch, circle, starShape } from './draw.mjs';
import { smell, sparkle } from './scenery.mjs';
import { sanfonaLocal } from './people.mjs';

const TAU = Math.PI * 2;

const arc = (cx, cy, rx, ry, a0, a1, n = 12) => {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const a = rad(a0 + ((a1 - a0) * i) / n);
    pts.push([cx + Math.cos(a) * rx, cy + Math.sin(a) * ry]);
  }
  return pts;
};

// ---------- bolo de fubá (forma de anel) ----------
export function bolo(cx, cy, r, o = {}) {
  let s = '';
  if (o.plate !== false) {
    s += blob(cx, cy, r * 1.45, r * 0.34, C.white, { w: 5, j: 0.01, n: 22 });
    for (let i = 0; i < 18; i++) {
      const a = (i / 18) * TAU;
      const x = cx + Math.cos(a) * r * 1.22,
        y = cy + Math.sin(a) * r * 0.26;
      s += cut(x - 6, y, x + 6, y, 3.4, C.blue);
    }
  }
  const top = cy - r * 0.92,
    bot = cy - r * 0.08;
  const body = [[cx - r, top], ...arc(cx, bot, r * 0.97, r * 0.27, 180, 0, 14).slice(0), [cx + r, top]];
  s += shape(body, C.yellow, { w: 5, k: 0.5 });
  for (const th of [160, 138, 115, 90, 65, 42, 20]) {
    const x = cx + Math.cos(rad(th)) * r * 0.97;
    const y0 = top + Math.sin(rad(th)) * r * 0.29,
      y1 = bot + Math.sin(rad(th)) * r * 0.27;
    s += brush([[x, y0], [x + (x - cx) * 0.02, (y0 + y1) / 2], [x, y1]], r * 0.07, C.ochre, { t0: 0.2, t1: 0.3 });
    s += brush([[x + 3, y0 + 4], [x + 3, y1 - 6]], r * 0.025, C.ink, { t0: 0.3, t1: 0.4 });
  }
  s += blob(cx, top, r, r * 0.29, C.ochre, { w: 5, j: 0.015, n: 20 });
  s += blob(cx, top - 2, r * 0.68, r * 0.18, '#eab24a', { w: 0, j: 0.02 });
  s += blob(cx, top, r * 0.26, r * 0.08, C.ink, { w: 2, j: 0.03 });
  for (let i = 0; i < 9; i++) {
    const a = rnd(0, TAU),
      d = rnd(0.45, 0.85);
    const x = cx + Math.cos(a) * r * d,
      y = top + Math.sin(a) * r * 0.25 * d;
    s += cut(x - 4, y, x + 4, y - 1, 3, C.white);
  }
  if (o.steam !== false) s += smell(cx, top - r * 0.4, r * 0.85, { n: 3, gap: r * 0.42, w: r * 0.07 });
  return s;
}

// ---------- goiabada ----------
export function goiabada(cx, cy, w, o = {}) {
  let s = '';
  // tábua
  const bd = [[cx - w * 0.78, cy], [cx - w * 0.6, cy - w * 0.3], [cx + w * 0.62, cy - w * 0.3], [cx + w * 0.8, cy], [cx + w * 0.8, cy + w * 0.06], [cx - w * 0.78, cy + w * 0.06]];
  s += shape(bd, C.brownL, { w: 5, k: 0.3 });
  s += `<path d="M${f(cx - w * 0.78)} ${f(cy)}L${f(cx + w * 0.8)} ${f(cy)}" stroke="${C.ink}" stroke-width="4"/>`;
  for (let i = 0; i < 4; i++) s += cut(cx - w * 0.6 + i * w * 0.08, cy - w * (0.06 + i * 0.06), cx + w * 0.2 + i * w * 0.1, cy - w * (0.07 + i * 0.06), 2.6, C.brown);
  // bloco
  const x0 = cx - w * 0.42,
    x1 = cx + w * 0.22,
    yb = cy - w * 0.1,
    h = w * 0.34,
    dx = w * 0.16,
    dy = -w * 0.13;
  s += shape([[x0, yb], [x0, yb - h], [x1, yb - h], [x1, yb]], C.red, { w: 5, k: 0 });
  s += shape([[x0, yb - h], [x0 + dx, yb - h + dy], [x1 + dx, yb - h + dy], [x1, yb - h]], '#e0664a', { w: 5, k: 0 });
  s += shape([[x1, yb], [x1, yb - h], [x1 + dx, yb - h + dy], [x1 + dx, yb + dy]], C.redD, { w: 5, k: 0 });
  s += cut(x0 + w * 0.05, yb - h * 0.75, x0 + w * 0.05, yb - h * 0.25, 5, '#ef8a6c');
  s += cut(x0 + w * 0.12, yb - h - 6, x0 + w * 0.3, yb - h - 8, 4, C.white);
  // um pedaço cortado
  const px0 = x1 + dx + w * 0.07,
    px1 = px0 + w * 0.16,
    ph = h * 0.8;
  s += shape([[px0, yb + 4], [px0, yb + 4 - ph], [px1, yb + 4 - ph], [px1, yb + 4]], C.red, { w: 4.5, k: 0 });
  s += shape([[px0, yb + 4 - ph], [px0 + dx * 0.7, yb + 4 - ph + dy * 0.7], [px1 + dx * 0.7, yb + 4 - ph + dy * 0.7], [px1, yb + 4 - ph]], '#e0664a', { w: 4.5, k: 0 });
  s += shape([[px1, yb + 4], [px1, yb + 4 - ph], [px1 + dx * 0.7, yb + 4 - ph + dy * 0.7], [px1 + dx * 0.7, yb + 4 + dy * 0.7]], C.redD, { w: 4.5, k: 0 });
  return s;
}

// ---------- pipoca ----------
export function popcorn(x, y, r) {
  // pipoca = vários carocinhos redondos grudados (contorno de tinta por baixo)
  const lobes = [];
  const n = 5;
  const a0 = rnd(0, TAU);
  lobes.push([x, y, r * 0.55]);
  for (let i = 0; i < n; i++) {
    const a = a0 + (i / n) * TAU + rnd(-0.3, 0.3);
    lobes.push([x + Math.cos(a) * r * 0.5, y + Math.sin(a) * r * 0.5, r * rnd(0.36, 0.5)]);
  }
  const ol = Math.max(2.6, r * 0.16);
  let s = lobes.map(([lx, ly, lr]) => circle(lx, ly, lr + ol)).join('');
  s += lobes.map(([lx, ly, lr]) => circle(lx, ly, lr, C.white)).join('');
  s += blob(x + r * 0.15, y + r * 0.2, r * 0.2, r * 0.15, C.ochre, { w: 0 });
  s += cut(x - r * 0.45, y - r * 0.05, x - r * 0.05, y - r * 0.4, Math.max(2, r * 0.1), C.ink, 0.3);
  s += cut(x + r * 0.25, y - r * 0.35, x + r * 0.5, y - r * 0.1, Math.max(1.8, r * 0.08), C.ink, -0.3);
  return s;
}

export function pipoca(cx, cy, s = 1, o = {}) {
  const { lid = true, flying = 9, spread = 1 } = o;
  let out = '';
  const W = 66 * s,
    H = 70 * s,
    top = cy - H;
  // pipocas lá dentro (montinho)
  for (let i = 0; i < 9; i++) out += popcorn(cx + rnd(-W * 0.75, W * 0.75), top - rnd(0, 18 * s), rnd(10, 14) * s);
  // panela
  const pot = [[cx - W, top], [cx - W * 0.98, cy - H * 0.35], ...arc(cx, cy - H * 0.2, W * 0.95, H * 0.2, 180, 0, 10), [cx + W * 0.98, cy - H * 0.35], [cx + W, top]];
  out += shape(pot, C.ink, { w: 4, k: 0.6 });
  out += blob(cx, top, W * 1.04, 11 * s, '#3a312a', { w: 5 * s, j: 0.01, n: 18 });
  for (let i = 0; i < 4; i++) out += cut(cx - W * 0.75 + i * 6 * s, top + 16 * s, cx - W * 0.7 + i * 6 * s, cy - H * 0.3, 3.4 * s, C.paper);
  out += cut(cx + W * 0.5, top + 20 * s, cx + W * 0.6, cy - H * 0.4, 3 * s, C.paper);
  for (const sd of [-1, 1]) out += brush([[cx + sd * W, top + 12 * s], [cx + sd * (W + 20 * s), top + 16 * s], [cx + sd * (W + 20 * s), top + 30 * s], [cx + sd * W, top + 32 * s]], 7 * s, C.ink, { t0: 0, t1: 0 });
  // tampa voando
  if (lid) {
    const lx = cx + 20 * s,
      ly = top - 70 * s;
    out += `<g transform="rotate(-18 ${f(lx)} ${f(ly)})">${blob(lx, ly, W * 0.98, 13 * s, '#3a312a', { w: 5 * s, j: 0.01 })}${blob(lx, ly - 14 * s, 9 * s, 9 * s, C.brown, { w: 4 * s })}${cut(lx - W * 0.6, ly - 3 * s, lx + W * 0.1, ly - 8 * s, 3 * s, C.paper)}</g>`;
  }
  // pipocas pulando
  for (let i = 0; i < flying; i++) {
    const a = rad(-90 + rnd(-70, 70) * spread);
    const d = rnd(60, 150) * s * spread;
    out += popcorn(cx + Math.cos(a) * d * 1.3, top - 20 * s + Math.sin(a) * d, rnd(10, 15) * s);
  }
  return out;
}

// ---------- paçoca ----------
export function pacocaPiece(x, y, s = 1) {
  const r = 17 * s,
    h = 20 * s;
  let p = shape([[x - r, y - h], ...arc(x, y, r, r * 0.34, 180, 0, 8), [x + r, y - h]], C.brownL, { w: 4, k: 0.5 });
  p += blob(x, y - h, r, r * 0.34, '#d7a76a', { w: 4, n: 14, j: 0.02 });
  for (let i = 0; i < 6; i++) p += circle(x + rnd(-r * 0.75, r * 0.75), y - h + rnd(-r * 0.2, r * 0.2), 1.6 * s, i % 2 ? C.brown : C.white);
  for (let i = 0; i < 4; i++) p += circle(x + rnd(-r * 0.8, r * 0.8), y - h * rnd(0.2, 0.7), 1.5 * s, C.brown);
  return p;
}

export function pacoca(cx, cy, s = 1, o = {}) {
  let out = '';
  if (o.plate !== false) out += blob(cx, cy + 4 * s, 78 * s, 16 * s, C.white, { w: 4.5, n: 18, j: 0.01 });
  for (const dx of [-1, 0, 1]) out += pacocaPiece(cx + dx * 36 * s, cy, s);
  for (const dx of [-0.5, 0.5]) out += pacocaPiece(cx + dx * 36 * s, cy - 24 * s, s);
  out += pacocaPiece(cx, cy - 48 * s, s);
  return out;
}

// ---------- mesa com toalha de chita ----------
export function chitaFlower(x, y, r, col) {
  let s = '';
  for (const a of [rnd(0, 1), rnd(2.5, 3.5)]) {
    s += shape([[x, y], [x + Math.cos(a - 0.4) * r * 1.2, y + Math.sin(a - 0.4) * r * 1.2], [x + Math.cos(a) * r * 1.8, y + Math.sin(a) * r * 1.8], [x + Math.cos(a + 0.4) * r * 1.2, y + Math.sin(a + 0.4) * r * 1.2]], C.green, { w: 3 });
  }
  const a0 = rnd(0, TAU);
  for (let i = 0; i < 6; i++) {
    const a = a0 + (i / 6) * TAU;
    s += blob(x + Math.cos(a) * r * 0.6, y + Math.sin(a) * r * 0.6, r * 0.48, r * 0.48, col, { w: 3, n: 10 });
  }
  s += circle(x, y, r * 0.42, C.ink) + circle(x - r * 0.1, y - r * 0.1, r * 0.13, C.yellow);
  return s;
}

export function chitaFill(d, box, o = {}) {
  const [x0, y0, x1, y1] = box;
  const id = uid('ch');
  const r = o.r || 16;
  let s = `<rect x="${f(x0)}" y="${f(y0)}" width="${f(x1 - x0)}" height="${f(y1 - y0)}" fill="${o.bg || C.red}"/>`;
  const cols = o.cols || [C.yellow, C.white, C.blueL, C.pink];
  let row = 0;
  for (let y = y0 + r * 0.6; y < y1 + r; y += r * 2.6, row++)
    for (let x = x0 + (row % 2 ? r * 1.6 : 0); x < x1 + r; x += r * 3.2) {
      s += chitaFlower(x + rnd(-4, 4), y + rnd(-4, 4), r * rnd(0.85, 1.1), cols[(row + Math.round(x / r)) % cols.length]);
      s += circle(x + r * 1.6, y + r * 1.2, 2.6, C.white);
    }
  return `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})">${s}</g>`;
}

export function mesa(x, y, w, o = {}) {
  const h = o.h || w * 0.3,
    dp = o.depth || 30;
  let s = '';
  // pés
  for (const px of [x + 30, x + w - 30]) s += limb([[px, y + h - 10], [px, y + h + (o.legs || 70)]], 16, C.brown, 4.5);
  // tampo
  const topD = poly([[x, y], [x + dp, y - dp], [x + w - dp, y - dp], [x + w, y]]);
  s += `<path d="${topD}" fill="${C.white}"/>` + chitaFill(topD, [x, y - dp, x + w, y], { r: 11, bg: '#d4583d' });
  s += `<path d="${topD}" fill="none" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
  // toalha caindo
  const cl = [[x - 8, y]];
  const n = Math.max(4, Math.round(w / 70));
  cl.push([x + w + 8, y]);
  cl.push([x + w + 16, y + h]);
  for (let i = n; i >= 0; i--) cl.push([x - 16 + ((w + 32) * i) / n, y + h + (i % 2 ? 12 : 0)]);
  const clD = spline(cl, true, 0.4);
  s += chitaFill(clD, [x - 20, y, x + w + 20, y + h + 16], { r: 17 });
  for (let i = 1; i < n; i++) s += brush([[x + (w * i) / n, y + 8], [x + (w * i) / n + 4, y + h * 0.6], [x + (w * i) / n, y + h]], 4, C.ink, { t0: 0.6, t1: 0.2 });
  s += `<path d="${clD}" fill="none" stroke="${C.ink}" stroke-width="6" stroke-linejoin="round"/>`;
  return { svg: s, topY: y - dp * 0.5 };
}

// ---------- instrumentos ----------
export function sanfona(cx, cy, w, open = 0.7) {
  return sanfonaLocal(cx, cy, w, open);
}

export function zabumba(cx, cy, r, o = {}) {
  const H = r * 1.1,
    ry = r * 0.3;
  const yt = cy - H / 2,
    yb = cy + H / 2;
  let s = '';
  const body = [[cx - r, yt], ...arc(cx, yb, r, ry, 180, 0, 14), [cx + r, yt]];
  s += shape(body, o.color || C.red, { w: 5, k: 0.5 });
  // cordas em zigue-zague
  const n = 7;
  const zz = [];
  for (let i = 0; i <= n * 2; i++) {
    const th = 180 - (180 * i) / (n * 2);
    const x = cx + Math.cos(rad(th)) * r * 0.98;
    const y = i % 2 ? yb + Math.sin(rad(th)) * ry - r * 0.14 : yt + Math.sin(rad(th)) * ry + r * 0.14;
    zz.push([x, y]);
  }
  s += brush(zz, 7, C.ink, { t0: 0, t1: 0, k: 0, per: 2 });
  s += brush(zz, 3, C.white, { t0: 0, t1: 0, k: 0, per: 2 });
  // aros
  s += brush(arc(cx, yb, r * 0.99, ry, 180, 0, 16), r * 0.14, C.ochre, { t0: 0, t1: 0 });
  s += brush(arc(cx, yb + r * 0.07, r * 0.99, ry, 180, 0, 16), 4, C.ink, { t0: 0, t1: 0 });
  s += brush(arc(cx, yb - r * 0.07, r * 0.99, ry, 180, 0, 16), 4, C.ink, { t0: 0, t1: 0 });
  // pele de cima
  s += blob(cx, yt, r, ry, C.ochre, { w: 5, n: 22, j: 0.005 });
  s += blob(cx, yt + 1, r * 0.88, ry * 0.8, C.white, { w: 3, n: 20, j: 0.01 });
  s += starShape(cx, yt + 1, ry * 0.5, C.red, { w: 2.5 }).replace('<path', `<path transform="translate(0 ${f(yt + 1)}) scale(1 0.45) translate(0 ${f(-(yt + 1))})"`);
  // maceta
  if (o.maceta !== false) {
    const mx = cx + r * 0.75,
      my = yt - r * 0.75;
    s += limb([[cx + r * 0.2, yt + ry * 0.2], [mx, my]], 7, C.brownL, 3.5);
    s += blob(mx, my, r * 0.16, r * 0.16, C.white, { w: 4 });
  }
  return s;
}

export function triangulo(cx, cy, size, o = {}) {
  const top = [cx, cy - size * 0.58],
    bl = [cx - size / 2, cy + size * 0.29],
    br = [cx + size / 2, cy + size * 0.29];
  let s = '';
  // cordão
  s += brush([[cx, top[1] - size * 0.35], [cx + 3, top[1] - size * 0.15], top], 4, C.red, { t0: 0, t1: 0 });
  const gap = [bl[0] + size * 0.08, bl[1] - size * 0.14];
  const path = [gap, top, br, [bl[0] + size * 0.14, bl[1]]];
  s += brush(path, size * 0.075 + 9, C.ink, { t0: 0, t1: 0, k: 0, per: 2, wob: 0.02 });
  s += brush(path, size * 0.075, '#c9c4b4', { t0: 0, t1: 0, k: 0, per: 2, wob: 0.02 });
  s += cut(top[0] + size * 0.04, top[1] + size * 0.12, top[0] + size * 0.2, top[1] + size * 0.4, 3, C.white);
  // batedor
  if (o.batedor !== false) {
    const b0 = [cx + size * 0.62, cy - size * 0.32],
      b1 = [cx + size * 0.06, cy + size * 0.06];
    s += brush([b0, b1], 13, C.ink, { t0: 0, t1: 0 }) + brush([b0, b1], 6, '#c9c4b4', { t0: 0, t1: 0 });
  }
  if (o.sparkle !== false) {
    s += sparkle(cx - size * 0.62, cy - size * 0.35, size * 0.12) + sparkle(cx + size * 0.7, cy + size * 0.15, size * 0.1) + sparkle(cx - size * 0.35, cy - size * 0.8, size * 0.07);
  }
  return s;
}

export function pandeiro(cx, cy, r, o = {}) {
  let s = '';
  s += blob(cx, cy, r, r, C.brownL, { w: 5, n: 24, j: 0.005 });
  // platinelas
  for (let i = 0; i < 5; i++) {
    const a = rad(-90 + 36 + i * 72);
    const x = cx + Math.cos(a) * r * 0.9,
      y = cy + Math.sin(a) * r * 0.9;
    s += `<g transform="rotate(${f((a * 180) / Math.PI + 90)} ${f(x)} ${f(y)})"><rect x="${f(x - r * 0.2)}" y="${f(y - r * 0.08)}" width="${f(r * 0.4)}" height="${f(r * 0.16)}" fill="${C.ink}"/>${blob(x - r * 0.07, y, r * 0.1, r * 0.1, C.yellow, { w: 2.5 })}${blob(x + r * 0.07, y, r * 0.1, r * 0.1, C.yellow, { w: 2.5 })}</g>`;
  }
  s += blob(cx, cy, r * 0.76, r * 0.76, C.white, { w: 4.5, n: 22, j: 0.005 });
  // desenho na pele
  for (let i = 0; i < 8; i++) {
    const a = rad(i * 45);
    s += blob(cx + Math.cos(a) * r * 0.36, cy + Math.sin(a) * r * 0.36, r * 0.13, r * 0.13, i % 2 ? C.red : C.green, { w: 2.6, n: 9 });
  }
  s += starShape(cx, cy, r * 0.2, C.yellow, { w: 2.6 });
  return s;
}

// ---------- lupa ----------
export function lupa(cx, cy, r, ang = 40) {
  const a = rad(ang);
  const hx = cx + Math.cos(a) * r,
    hy = cy + Math.sin(a) * r;
  let s = limb([[hx, hy], [cx + Math.cos(a) * r * 2.2, cy + Math.sin(a) * r * 2.2]], r * 0.3, C.brown, 4);
  s += blob(cx, cy, r, r, null, { w: 0 });
  s += `<circle cx="${f(cx)}" cy="${f(cy)}" r="${f(r * 0.86)}" fill="${C.white}" opacity="0.45"/>`;
  s += `<path d="${spline(blobPts(cx, cy, r * 0.93, r * 0.93, 18, 0.01), true)}" fill="none" stroke="${C.ink}" stroke-width="${f(r * 0.2)}"/>`;
  s += cut(cx - r * 0.5, cy - r * 0.2, cx - r * 0.15, cy - r * 0.55, r * 0.1, C.white, -0.2);
  return s;
}
