// Paisagem do sertão: sol, nuvens, mandacaru, palma, chão, serra,
// passarinho, casinha, bandeirinhas, vento, cheirinho, notas musicais.
import { C, rnd, jit, f, uid, rad, spline, sample, poly, brush, brushD, cut, shape, blobPts, blob, offsetLine, limb, hatch, circle } from './draw.mjs';

const TAU = Math.PI * 2;

export function spiralPts(cx, cy, r, turns = 1.4, a0 = 0, dir = 1, n = 22) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const a = a0 + dir * t * turns * TAU;
    const rr = r * (1 - t * 0.85);
    pts.push([cx + Math.cos(a) * rr, cy + Math.sin(a) * rr]);
  }
  return pts;
}

// ---------- sol ----------
export function sun(cx, cy, r, o = {}) {
  const { face = true, rays = 18, mood = 'happy' } = o;
  let s = '';
  for (let i = 0; i < rays; i++) {
    const a = (i / rays) * TAU + rnd(-0.03, 0.03) + (o.rot || 0);
    if (i % 2 === 0) {
      const r1 = r * 1.05,
        r2 = r * rnd(1.7, 1.86),
        hw = 0.13;
      const pts = [
        [cx + Math.cos(a - hw) * r1, cy + Math.sin(a - hw) * r1],
        [cx + Math.cos(a) * r2, cy + Math.sin(a) * r2],
        [cx + Math.cos(a + hw) * r1, cy + Math.sin(a + hw) * r1],
      ];
      s += `<path d="${poly(pts)}" fill="${C.yellow}" stroke="${C.ink}" stroke-width="${f(r * 0.055)}" stroke-linejoin="round"/>`;
      s += cut(cx + Math.cos(a) * r * 1.16, cy + Math.sin(a) * r * 1.16, cx + Math.cos(a) * r * 1.52, cy + Math.sin(a) * r * 1.52, r * 0.04, C.ink);
    } else {
      const pts = [];
      for (let k = 0; k <= 5; k++) {
        const rr = r * (1.08 + k * 0.085);
        const off = (k % 2 ? 1 : -1) * 0.055;
        pts.push([cx + Math.cos(a + off) * rr, cy + Math.sin(a + off) * rr]);
      }
      s += brush(pts, r * 0.1, C.ink, { t0: 0.05, t1: 0.55 });
    }
  }
  s += circle(cx, cy, r * 1.07, C.ink);
  s += shape(blobPts(cx, cy, r, r, 20, 0.012), C.yellow, { w: r * 0.05 });
  s += circle(cx + r * 0.12, cy + r * 0.1, r * 0.78, C.ochre).replace('/>', ' opacity="0.45"/>');
  for (let i = 0; i < 30; i++) {
    const a = (i / 30) * TAU + rnd(-0.05, 0.05);
    s += cut(cx + Math.cos(a) * r * 0.8, cy + Math.sin(a) * r * 0.8, cx + Math.cos(a) * r * 0.93, cy + Math.sin(a) * r * 0.93, r * 0.035, C.ink);
  }
  if (face) s += sunFace(cx, cy, r, mood);
  return s;
}

function sunFace(cx, cy, r, mood) {
  let s = '';
  for (const sx of [-1, 1]) {
    const ex = cx + sx * r * 0.32,
      ey = cy - r * 0.1;
    if (mood === 'wink' && sx === 1) {
      s += brush([[ex - r * 0.13, ey], [ex + r * 0.13, ey - r * 0.02]], r * 0.06, C.ink, { t0: 0.3, t1: 0.3 });
    } else {
      s += brush([[ex - r * 0.14, ey + r * 0.03], [ex, ey - r * 0.08], [ex + r * 0.14, ey + r * 0.03]], r * 0.065, C.ink, { t0: 0.25, t1: 0.25 });
      for (const k of [-1, 0, 1]) s += cut(ex + k * r * 0.08, ey - r * 0.09, ex + k * r * 0.12, ey - r * 0.17, r * 0.025, C.ink);
    }
    s += circle(cx + sx * r * 0.52, cy + r * 0.16, r * 0.12, C.red).replace('/>', ' opacity="0.75"/>');
  }
  s += brush([[cx - r * 0.02, cy - r * 0.04], [cx + r * 0.07, cy + r * 0.11], [cx - r * 0.05, cy + r * 0.15]], r * 0.05, C.ink, { t0: 0.3, t1: 0.3 });
  s += `<path d="M${f(cx - r * 0.3)} ${f(cy + r * 0.27)}Q${f(cx)} ${f(cy + r * 0.62)} ${f(cx + r * 0.3)} ${f(cy + r * 0.27)}Q${f(cx)} ${f(cy + r * 0.38)} ${f(cx - r * 0.3)} ${f(cy + r * 0.27)}Z" fill="${C.ink}"/>`;
  s += `<path d="M${f(cx - r * 0.13)} ${f(cy + r * 0.42)}Q${f(cx)} ${f(cy + r * 0.34)} ${f(cx + r * 0.13)} ${f(cy + r * 0.42)}Q${f(cx)} ${f(cy + r * 0.5)} ${f(cx - r * 0.13)} ${f(cy + r * 0.42)}Z" fill="${C.red}"/>`;
  return s;
}

// ---------- nuvem ----------
export function cloud(cx, cy, w, o = {}) {
  const h = w * 0.36;
  const pts = [
    [cx - w * 0.5, cy],
    [cx - w * 0.44, cy - h * 0.42],
    [cx - w * 0.28, cy - h * 0.55],
    [cx - w * 0.16, cy - h * 0.95],
    [cx + w * 0.04, cy - h * 1.02],
    [cx + w * 0.18, cy - h * 0.72],
    [cx + w * 0.34, cy - h * 0.78],
    [cx + w * 0.5, cy - h * 0.22],
    [cx + w * 0.34, cy + h * 0.1],
    [cx - w * 0.12, cy + h * 0.12],
  ].map(([x, y]) => [jit(x, w * 0.012), jit(y, w * 0.012)]);
  let s = shape(pts, o.fill || C.white, { w: w * 0.035 });
  s += brush(spiralPts(cx - w * 0.12, cy - h * 0.48, h * 0.32, 1.15, rad(200), 1), w * 0.028, C.ink, { t0: 0.05, t1: 0.7 });
  s += brush(spiralPts(cx + w * 0.26, cy - h * 0.3, h * 0.22, 1.1, rad(330), -1), w * 0.024, C.ink, { t0: 0.05, t1: 0.7 });
  s += cut(cx - w * 0.35, cy - h * 0.05, cx + w * 0.05, cy - h * 0.02, w * 0.022, C.ink);
  s += cut(cx - w * 0.6, cy + h * 0.32, cx - w * 0.2, cy + h * 0.3, w * 0.02, C.ink);
  s += cut(cx + w * 0.12, cy + h * 0.36, cx + w * 0.55, cy + h * 0.32, w * 0.02, C.ink);
  return s;
}

// ---------- mandacaru ----------
// arms: [{side:-1|1, y: altura saída (0..1), dx, top (0..1)}]
export function mandacaru(x, y, h, o = {}) {
  const w = o.w || h * 0.17;
  const arms = o.arms || [
    { side: -1, y: 0.42, dx: 1.45, top: 0.78 },
    { side: 1, y: 0.55, dx: 1.35, top: 0.92 },
  ];
  const ol = Math.max(4, w * 0.12);
  const col = o.color || C.green;
  let back = '',
    front = '';
  const ribs = (pts, ww) => {
    let r = '';
    for (const k of [-0.27, 0.27]) r += brush(offsetLine(pts, ww * k, 8), ww * 0.07, C.ink, { t0: 0.15, t1: 0.3, wob: 0.2 });
    r += brush(offsetLine(pts, 0, 8), ww * 0.05, C.greenD, { t0: 0.2, t1: 0.3 });
    return r;
  };
  const spines = (pts, ww) => {
    let r = '';
    for (const side of [-1, 1]) {
      const edge = offsetLine(pts, (side * (ww / 2 + ol * 0.6)), 6);
      for (let i = 2; i < edge.length - 2; i += 3) {
        const [ex, ey] = edge[i];
        const [nx, ny] = [edge[i + 1][0] - edge[i - 1][0], edge[i + 1][1] - edge[i - 1][1]];
        const l = Math.hypot(nx, ny) || 1;
        const px = (-ny / l) * side,
          py = (nx / l) * side;
        for (const sp of [-0.5, 0, 0.5]) {
          const a = Math.atan2(py, px) + sp;
          const len = ww * rnd(0.14, 0.22);
          r += cut(ex, ey, ex + Math.cos(a) * len, ey + Math.sin(a) * len, 2.2, C.ink);
        }
      }
    }
    return r;
  };
  for (const a of arms) {
    const ya = y - h * a.y;
    const ax = x + a.side * w * a.dx;
    const aw = w * (a.wf || 0.8);
    const pts = [
      [x, ya + aw * 0.1],
      [x + a.side * w * a.dx * 0.55, ya + aw * 0.05],
      [ax, ya - aw * 0.75],
      [ax + jit(0, 2), y - h * a.top],
    ];
    back += limb(pts, aw, col, ol, { wob: 0.03 }) + ribs(pts.slice(1), aw) + spines(pts.slice(1), aw);
    if (a.fruit) back += mandacaruFruit(ax, y - h * a.top - aw * 0.5, aw * 0.42);
  }
  const trunk = [
    [x, y + 4],
    [jit(x, 2), y - h * 0.5],
    [x, y - h],
  ];
  front += limb(trunk, w, col, ol, { wob: 0.03, t1: 0 }) + ribs(trunk, w) + spines(trunk.slice(0), w);
  if (o.flower !== false) front += mandacaruFlower(x, y - h - w * 0.3, w * 0.55);
  return back + front;
}

export function mandacaruFlower(cx, cy, r) {
  let s = '';
  for (let i = 0; i < 7; i++) {
    const a = rad(-90 + (i - 3) * 28);
    const tip = [cx + Math.cos(a) * r * 1.5, cy + Math.sin(a) * r * 1.5];
    s += shape(
      [
        [cx, cy + r * 0.3],
        [cx + Math.cos(a - 0.35) * r * 0.9, cy + Math.sin(a - 0.35) * r * 0.9],
        tip,
        [cx + Math.cos(a + 0.35) * r * 0.9, cy + Math.sin(a + 0.35) * r * 0.9],
      ],
      C.white,
      { w: 3.2 },
    );
  }
  s += blob(cx, cy + r * 0.25, r * 0.38, r * 0.3, C.yellow, { w: 3 });
  return s;
}

export function mandacaruFruit(cx, cy, r) {
  let s = blob(cx, cy, r * 0.85, r, C.pink, { w: 3.5 });
  for (let i = 0; i < 5; i++) s += cut(cx - r * 0.5 + i * r * 0.25, cy - r * 0.5, cx - r * 0.4 + i * r * 0.22, cy + r * 0.5, 2.4, C.redD);
  return s;
}

// ---------- palma (cacto de raquetes) ----------
export function palma(x, y, s = 1) {
  const pads = [
    [0, -34, 26, 36, 0],
    [-30, -78, 22, 30, -0.45],
    [28, -82, 22, 32, 0.4],
    [-2, -116, 18, 26, 0.05],
  ];
  let out = '';
  for (const [dx, dy, rx, ry, rot] of pads) {
    const cx = x + dx * s,
      cy = y + dy * s;
    out += shape(blobPts(cx, cy, rx * s, ry * s, 14, 0.04, rot), C.greenL, { w: 4.5 * s });
    for (let i = 0; i < 7; i++) {
      const a = rnd(0, TAU),
        rr = rnd(0.15, 0.7);
      const px = cx + Math.cos(a) * rx * s * rr,
        py = cy + Math.sin(a) * ry * s * rr;
      out += cut(px - 3 * s, py - 3 * s, px + 3 * s, py + 3 * s, 2.2 * s, C.ink);
    }
  }
  out += mandacaruFruit(x - 2 * s, y - 146 * s, 9 * s);
  return out;
}

// ---------- tufos, pedras ----------
export function tuft(x, y, h, col = C.ink) {
  let s = '';
  const n = Math.floor(rnd(4, 7));
  for (let i = 0; i < n; i++) {
    const a = rad(-90 + (i - (n - 1) / 2) * rnd(14, 22));
    const l = h * rnd(0.6, 1.05);
    s += brush(
      [
        [x + (i - n / 2) * 2.5, y],
        [x + Math.cos(a) * l * 0.5 + rnd(-3, 3), y + Math.sin(a) * l * 0.55],
        [x + Math.cos(a) * l, y + Math.sin(a) * l],
      ],
      h * 0.11,
      col,
      { t0: 0, t1: 0.9, min: 0.05 },
    );
  }
  return s;
}

export function stone(x, y, r, dark = false) {
  let s = blob(x, y - r * 0.5, r, r * 0.6, dark ? C.ink : C.gray, { w: 4, n: 10, j: 0.12 });
  s += cut(x - r * 0.5, y - r * 0.75, x + r * 0.1, y - r * 0.9, Math.max(2, r * 0.12), dark ? C.paper : C.white);
  return s;
}

// ---------- chão ----------
export function ground(x0, x1, yTop, yBot, o = {}) {
  const { color = C.earth, step = 70, amp = 7, tufts = true, stones = true, dark = 0.72 } = o;
  let top = [];
  if (o.top) top = o.top;
  else for (let x = x0 - 40; x <= x1 + 40; x += step) top.push([x, yTop + rnd(-amp, amp) + (o.slope ? o.slope * (x - x0) : 0)]);
  const sT = sample(top, false, 8);
  let s = `<path d="${spline(top)}L${f(x1 + 40)} ${f(yBot + 20)}L${f(x0 - 40)} ${f(yBot + 20)}Z" fill="${color}"/>`;
  // faixa escura de baixo com goivadas claras
  const yD = yTop + (yBot - yTop) * dark;
  const dk = [];
  const tAt = (x) => {
    let best = top[0];
    for (const p of top) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
    return best[1];
  };
  for (let x = x0 - 40; x <= x1 + 40; x += step * 0.8) dk.push([x, (o.top ? tAt(x) + (yBot - tAt(x)) * dark : yD) + rnd(-10, 10)]);
  const dD = `${spline(dk)}L${f(x1 + 40)} ${f(yBot + 20)}L${f(x0 - 40)} ${f(yBot + 20)}Z`;
  s += `<path d="${dD}" fill="${C.ink}"/>`;
  const dMin = Math.min(...dk.map((p) => p[1])),
    dMax = Math.max(...dk.map((p) => p[1])),
    tMin = Math.min(...top.map((p) => p[1]));
  s += hatch(dD, [x0, dMin - 20, x1, yBot + 20], { angle: rnd(-3, 3), gap: 13, w: 4, len: [18, 60], fill: color });
  // traços na terra
  const dT = `${spline(top)}L${f(x1 + 40)} ${f(dMax + 20)}L${f(x0 - 40)} ${f(dMax + 20)}Z`;
  s += hatch(dT, [x0, tMin, x1, dMax], { angle: rnd(-4, 4), gap: 16, w: 3, len: [10, 34], fill: C.ink, jitter: 5 });
  s += brush(sT, 7, C.ink, { t0: 0, t1: 0, wob: 0.3, per: 4 });
  const yAt = (x) => {
    let best = sT[0];
    for (const p of sT) if (Math.abs(p[0] - x) < Math.abs(best[0] - x)) best = p;
    return best[1];
  };
  if (stones) {
    const n = Math.floor((x1 - x0) / 220);
    for (let i = 0; i < n; i++) {
      const sx = rnd(x0 + 30, x1 - 30);
      s += stone(sx, yAt(sx) + rnd(14, Math.max(20, (yD - yTop) * 0.8)), rnd(7, 15), rnd() < 0.3);
    }
  }
  if (tufts) {
    const n = Math.floor((x1 - x0) / 120);
    for (let i = 0; i < n; i++) {
      const tx = rnd(x0 + 10, x1 - 10);
      s += tuft(tx, yAt(tx) + 2, rnd(16, 30));
    }
  }
  return { svg: s, yAt };
}

// ---------- serra ao fundo ----------
export function hills(x0, x1, yBase, peaks, o = {}) {
  const { color = '#c7b27a', lines = true } = o;
  const top = [[x0 - 40, yBase - peaks[0] * 0.5]];
  const n = peaks.length;
  peaks.forEach((p, i) => top.push([x0 + ((i + 0.5) / n) * (x1 - x0) + rnd(-20, 20), yBase - p]));
  top.push([x1 + 40, yBase - peaks[n - 1] * 0.4]);
  const d = `${spline(top)}L${f(x1 + 40)} ${f(yBase + 30)}L${f(x0 - 40)} ${f(yBase + 30)}Z`;
  let s = `<path d="${d}" fill="${color}"/>`;
  if (lines) {
    const id = uid('hc');
    let ln = '';
    for (let k = 1; k < 9; k++) {
      const off = top.map(([x, y]) => [x, y + k * 11 + rnd(-2, 2)]);
      ln += brush(sample(off, false, 6), 3.2 - k * 0.15, C.ink, { t0: 0.1, t1: 0.1, wob: 0.4, per: 3 });
    }
    s += `<clipPath id="${id}"><path d="${d}"/></clipPath><g clip-path="url(#${id})" opacity="0.8">${ln}</g>`;
  }
  s += brush(sample(top, false, 6), 5, C.ink, { t0: 0.02, t1: 0.02, wob: 0.3, per: 3 });
  return s;
}

// ---------- passarinho (galo-de-campina) ----------
export function bird(x, y, s = 1, o = {}) {
  const { sing = true, flip = false } = o;
  const T = (px, py) => [x + (flip ? -px : px) * s, y + py * s];
  const P = (arr) => arr.map(([a, b]) => T(a, b));
  let out = '';
  // pernas
  out += brush(P([[-3, -14], [-5, 0]]), 3 * s, C.ink, { t0: 0, t1: 0 });
  out += brush(P([[6, -14], [6, 0]]), 3 * s, C.ink, { t0: 0, t1: 0 });
  out += brush(P([[-11, 1], [2, 1]]), 3 * s, C.ink, { t0: 0, t1: 0 });
  out += brush(P([[0, 1], [13, 1]]), 3 * s, C.ink, { t0: 0, t1: 0 });
  // cauda
  for (const k of [-1, 0, 1]) out += shape(P([[-20, -24], [-46, -12 + k * 7], [-50, -6 + k * 8], [-18, -18]]), C.ink, { w: 2 });
  // corpo
  out += shape(P([[-24, -24], [-12, -40], [10, -42], [24, -36], [22, -18], [6, -12], [-14, -14]]), C.white, { w: 4.5 * s });
  out += shape(P([[-10, -16], [8, -14], [20, -20], [21, -30], [8, -26]]), C.gray, { w: 0 });
  // asa
  out += shape(P([[-22, -26], [-6, -40], [12, -36], [4, -26], [-14, -18]]), C.ink, { w: 3 * s });
  for (let i = 0; i < 4; i++) out += cut(...T(-10 + i * 5, -34 + i), ...T(-18 + i * 6, -22 + i * 0.5), 2.2 * s, C.paper);
  // cabeça vermelha com topete
  out += shape(P([[16, -38], [12, -52], [20, -62], [26, -68], [28, -60], [36, -58], [38, -48], [32, -38]]), C.red, { w: 4 * s });
  const eye = T(28, -51);
  out += circle(eye[0], eye[1], 3.2 * s) + circle(eye[0] + 0.8 * s, eye[1] - 1 * s, 1 * s, C.white);
  // bico
  if (sing) {
    out += shape(P([[37, -52], [48, -58], [38, -48]]), C.ochre, { w: 2.5 * s, k: 0 });
    out += shape(P([[37, -48], [47, -42], [36, -45]]), C.ochre, { w: 2.5 * s, k: 0 });
  } else out += shape(P([[37, -52], [47, -49], [37, -46]]), C.ochre, { w: 2.5 * s, k: 0 });
  return out;
}

// passarinho voando (silhueta em V com detalhes)
export function flyingBird(x, y, s = 1) {
  return (
    brush([[x - 22 * s, y - 4 * s], [x - 10 * s, y - 12 * s], [x, y]], 5 * s, C.ink, { t0: 0.8, t1: 0.1 }) +
    brush([[x, y], [x + 10 * s, y - 13 * s], [x + 24 * s, y - 6 * s]], 5 * s, C.ink, { t0: 0.1, t1: 0.8 })
  );
}

// ---------- casinha ----------
export function house(x, y, w, o = {}) {
  const h = w * 0.6,
    rh = w * 0.38;
  const L = x,
    R = x + w,
    T = y - h;
  let s = '';
  // parede
  s += shape([[L, y], [L, T], [R, T], [R, y]], C.white, { w: 6, k: 0 });
  s += `<rect x="${f(L + 3)}" y="${f(y - h * 0.2)}" width="${f(w - 6)}" height="${f(h * 0.2 - 3)}" fill="${o.barra || C.ochre}"/>`;
  s += brush([[L, y - h * 0.2], [R, y - h * 0.2]], 4, C.ink, { t0: 0.02, t1: 0.02, wob: 0.3 });
  // tijolinhos aparecendo
  for (const [bx, by] of [[0.12, 0.3], [0.8, 0.62], [0.6, 0.25]]) {
    for (let i = 0; i < 3; i++) {
      const xx = L + w * bx + (i % 2) * 14,
        yy = T + h * by + i * 10;
      s += `<rect x="${f(xx)}" y="${f(yy)}" width="20" height="8" fill="${C.earth}" stroke="${C.ink}" stroke-width="2.4"/>`;
    }
  }
  // telhado
  const roof = [[L - w * 0.08, T + 4], [x + w / 2, T - rh], [R + w * 0.08, T + 4]];
  const dRoof = poly(roof);
  s += `<path d="${dRoof}" fill="${C.red}"/>`;
  const id = uid('rf');
  let tiles = '';
  for (let r = 0; r < 9; r++) {
    const yy = T - rh + 14 + r * 15;
    for (let xx = L - w * 0.1 + (r % 2) * 9; xx < R + w * 0.1; xx += 18) tiles += `<path d="M${f(xx)} ${f(yy)}q9 11 18 0" fill="none" stroke="${C.ink}" stroke-width="3"/>`;
  }
  s += `<clipPath id="${id}"><path d="${dRoof}"/></clipPath><g clip-path="url(#${id})">${tiles}</g>`;
  s += brush(roof, 8, C.ink, { t0: 0, t1: 0, k: 0, per: 2 });
  // porta
  const dw = w * 0.22,
    dh = h * 0.68,
    dx = L + w * 0.18;
  s += shape([[dx, y], [dx, y - dh], [dx + dw, y - dh], [dx + dw, y]], o.door || C.blue, { w: 5, k: 0 });
  for (let i = 1; i < 3; i++) s += cut(dx + (dw * i) / 3, y - dh + 6, dx + (dw * i) / 3, y - 6, 3, C.ink);
  s += circle(dx + dw * 0.8, y - dh * 0.45, 3.5, C.ochre);
  // janela
  const ww = w * 0.24,
    wh = h * 0.36,
    wx = L + w * 0.6,
    wy = T + h * 0.22;
  s += shape([[wx, wy + wh], [wx, wy], [wx + ww, wy], [wx + ww, wy + wh]], C.ink, { w: 5, k: 0 });
  s += shape([[wx, wy], [wx - ww * 0.42, wy + 6], [wx - ww * 0.42, wy + wh - 4], [wx, wy + wh]], o.door || C.blue, { w: 4, k: 0 });
  s += shape([[wx + ww, wy], [wx + ww * 1.42, wy + 6], [wx + ww * 1.42, wy + wh - 4], [wx + ww, wy + wh]], o.door || C.blue, { w: 4, k: 0 });
  s += `<rect x="${f(wx - 8)}" y="${f(wy + wh)}" width="${f(ww + 16)}" height="7" fill="${C.brown}" stroke="${C.ink}" stroke-width="3"/>`;
  return { svg: s, peak: [x + w / 2, T - rh], win: [wx + ww / 2, wy + wh], door: [dx + dw / 2, y], top: T };
}

// ---------- bandeirinhas ----------
export function flags(p0, p1, sag, n, o = {}) {
  const cols = o.colors || [C.red, C.yellow, C.blue, C.green, C.pink, C.orange];
  const fw = o.fw || 30,
    fh = o.fh || 34;
  const mx = (p0[0] + p1[0]) / 2,
    my = (p0[1] + p1[1]) / 2 + sag;
  const B = (t) => [
    (1 - t) * (1 - t) * p0[0] + 2 * (1 - t) * t * mx + t * t * p1[0],
    (1 - t) * (1 - t) * p0[1] + 2 * (1 - t) * t * my + t * t * p1[1],
  ];
  const line = [];
  for (let i = 0; i <= 24; i++) line.push(B(i / 24));
  let s = brush(line, 3, C.ink, { t0: 0, t1: 0, wob: 0.2, per: 3 });
  const off = Math.floor(rnd(0, cols.length));
  for (let i = 0; i < n; i++) {
    const t = (i + 0.5) / n;
    const [px, py] = B(t);
    const [ax, ay] = B(Math.min(1, t + 0.01));
    const ang = Math.atan2(ay - py, ax - px);
    const c = Math.cos(ang),
      sn = Math.sin(ang);
    const sw = rnd(-0.12, 0.12);
    const a = [px - (c * fw) / 2, py - (sn * fw) / 2];
    const b = [px + (c * fw) / 2, py + (sn * fw) / 2];
    const tip = [px + Math.sin(sw) * fh, py + Math.cos(sw) * fh];
    const col = cols[(i + off) % cols.length];
    s += `<path d="${poly([a, b, tip])}" fill="${col}" stroke="${C.ink}" stroke-width="3" stroke-linejoin="round"/>`;
    s += cut(px - fw * 0.15, py + fh * 0.22, px + fw * 0.15, py + fh * 0.22, 2.4, C.ink);
    if (i % 2) s += circle((a[0] + b[0] + tip[0]) / 3, (a[1] + b[1] + tip[1]) / 3 + 2, 2.6, C.white);
  }
  return s;
}

// ---------- vento ----------
export function wind(x, y, len, o = {}) {
  const { dir = 1, amp = 14, curl = 22, w = 7, lines = 3, gap = 20 } = o;
  let s = '';
  for (let k = 0; k < lines; k++) {
    const yy = y + k * gap,
      ll = len * (k === 0 ? 1 : rnd(0.55, 0.8)),
      xx = x + dir * k * len * 0.12;
    const pts = [];
    for (let i = 0; i <= 6; i++) pts.push([xx + (dir * (ll * i)) / 6, yy + Math.sin(i * 1.1 + k) * amp * (i / 6)]);
    const [ex, ey] = pts[pts.length - 1];
    const cr = curl * (k === 0 ? 1 : 0.6);
    const sp = spiralPts(ex, ey - cr, cr, 1.1, rad(90), -dir, 16).slice(1);
    s += brush(k === 0 ? pts.concat(sp) : pts, w * (k === 0 ? 1 : 0.7), C.ink, { t0: 0.3, t1: 0.35 });
  }
  return s;
}

export function leaf(x, y, l, ang, col = C.greenL) {
  const a = rad(ang),
    c = Math.cos(a),
    s = Math.sin(a);
  const P = (u, v) => [x + u * c - v * s, y + u * s + v * c];
  let out = shape([P(0, 0), P(l * 0.5, -l * 0.28), P(l, 0), P(l * 0.5, l * 0.28)], col, { w: 3.2 });
  out += cut(...P(l * 0.08, 0), ...P(l * 0.9, 0), 2.4, C.ink);
  return out;
}

// ---------- cheirinho ----------
export function smell(x, y, h, o = {}) {
  const { n = 3, gap = 22, col = C.ink, w = 6 } = o;
  let s = '';
  for (let i = 0; i < n; i++) {
    const px = x + (i - (n - 1) / 2) * gap;
    const pts = [];
    for (let k = 0; k <= 5; k++) pts.push([px + Math.sin(k * 1.6 + i) * 8, y - (h * k) / 5 - (i % 2) * 10]);
    s += brush(pts, w, col, { t0: 0.35, t1: 0.25 });
  }
  return s;
}

// ---------- nota musical ----------
export function note(x, y, s = 1, o = {}) {
  const { double = false, col = C.ink, rot = 0 } = o;
  let out = `<g transform="rotate(${f(rot)} ${f(x)} ${f(y)})">`;
  out += `<ellipse cx="${f(x)}" cy="${f(y)}" rx="${f(10 * s)}" ry="${f(7 * s)}" transform="rotate(-25 ${f(x)} ${f(y)})" fill="${col}"/>`;
  out += brush([[x + 8.5 * s, y - 2 * s], [x + 9 * s, y - 42 * s]], 4 * s, col, { t0: 0, t1: 0 });
  if (double) {
    const x2 = x + 28 * s;
    out += `<ellipse cx="${f(x2)}" cy="${f(y + 4 * s)}" rx="${f(10 * s)}" ry="${f(7 * s)}" transform="rotate(-25 ${f(x2)} ${f(y + 4 * s)})" fill="${col}"/>`;
    out += brush([[x2 + 8.5 * s, y + 2 * s], [x2 + 9 * s, y - 38 * s]], 4 * s, col, { t0: 0, t1: 0 });
    out += brush([[x + 8 * s, y - 42 * s], [x2 + 10 * s, y - 38 * s]], 8 * s, col, { t0: 0, t1: 0, k: 0 });
  } else {
    out += brush([[x + 9 * s, y - 42 * s], [x + 20 * s, y - 30 * s], [x + 18 * s, y - 18 * s]], 5 * s, col, { t0: 0, t1: 0.6 });
  }
  return out + '</g>';
}

// ---------- brilhos e estouros ----------
export function sparkle(x, y, r, col = C.ink) {
  const pts = [];
  for (let i = 0; i < 8; i++) {
    const a = rad(i * 45 - 90);
    const rr = i % 2 ? r * 0.22 : r * (i % 4 ? 0.65 : 1);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return `<path d="${poly(pts)}" fill="${col}"/>`;
}

export function burst(x, y, r, fill = C.yellow, n = 12) {
  const pts = [];
  for (let i = 0; i < n * 2; i++) {
    const a = (i / (n * 2)) * TAU + rnd(-0.05, 0.05);
    const rr = i % 2 ? r * rnd(0.55, 0.65) : r * rnd(0.92, 1.08);
    pts.push([x + Math.cos(a) * rr, y + Math.sin(a) * rr]);
  }
  return `<path d="${poly(pts)}" fill="${fill}" stroke="${C.ink}" stroke-width="5" stroke-linejoin="round"/>`;
}

// linhas de movimento
export function motion(x, y, len, ang, n = 3, gap = 12, w = 4) {
  let s = '';
  const a = rad(ang),
    c = Math.cos(a),
    sn = Math.sin(a);
  for (let i = 0; i < n; i++) {
    const o = (i - (n - 1) / 2) * gap;
    const l = len * (i === (n - 1) / 2 ? 1 : 0.7);
    s += cut(x - sn * o, y + c * o, x - sn * o + c * l, y + c * o + sn * l, w, C.ink);
  }
  return s;
}

// ---------- fogueira ----------
export function fogueira(x, y, s = 1) {
  let out = '';
  const fl = (pts, col) => shape(pts.map(([a, b]) => [x + a * s, y + b * s]), col, { w: 4.5 * s });
  out += fl([[-60, -40], [-38, -110], [-18, -70], [0, -150], [20, -78], [38, -118], [58, -40]], C.red);
  out += fl([[-40, -40], [-24, -86], [-8, -60], [4, -116], [18, -64], [32, -90], [42, -40]], C.orange);
  out += fl([[-22, -40], [-10, -70], [2, -56], [10, -84], [24, -40]], C.yellow);
  out += limb([[x - 70 * s, y - 4 * s], [x + 62 * s, y - 34 * s]], 18 * s, C.brown, 4 * s);
  out += limb([[x + 70 * s, y - 4 * s], [x - 62 * s, y - 34 * s]], 18 * s, C.brownL, 4 * s);
  for (let i = 0; i < 6; i++) out += sparkle(x + rnd(-70, 70) * s, y - rnd(150, 200) * s, rnd(5, 9) * s, C.ink);
  return out;
}
