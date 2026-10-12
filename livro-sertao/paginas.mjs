// As páginas do livro: texto da história + ilustração de cada página.
import { C, rnd, f, rad, brush, cut, circle, carved, blob, shape, starShape, limb } from './lib/draw.mjs';
import { page, ill, at } from './lib/page.mjs';
import * as S from './lib/scenery.mjs';
import * as T from './lib/things.mjs';
import { kid, sanfoneiro, POSES, TURMA } from './lib/people.mjs';

// ---------- ajudantes de texto ----------
const txt = (x, y, w, html, extra = '') => `<div class="abs txt" style="left:${x}mm;top:${y}mm;width:${w}mm;${extra}">${html}</div>`;
const col = (x, y, w, h, html, extra = '') =>
  `<div class="abs txt" style="left:${x}mm;top:${y}mm;width:${w}mm;height:${h}mm;display:flex;flex-direction:column;justify-content:center;${extra}">${html}</div>`;
const verse = (lines, cls = '') => `<div class="verse ${cls}">${lines.map((l) => `<span class="l">${l}</span>`).join('')}</div>`;
const box = (html, tag = 'Interação') => `<div class="box"><div class="tag">${tag}</div>${html}</div>`;
const h2 = (ico, t) => `<h2>${ico ? `<span class="ico">${ico}</span>` : ''}${t}</h2>`;

// ícones das seções (vinhetas sem moldura)
const icon = (draw, mm = 13, seed = 3) => ill(mm, mm, draw, { frame: false, seed, style: 'display:block' });
const ICO = {
  sol: () => icon((W, H) => S.sun(W / 2, H / 2, W * 0.24, { rays: 14 })),
  bolo: () => icon((W, H) => T.bolo(W / 2, H * 0.8, W * 0.3, { steam: false })),
  nota: () => icon((W, H) => S.note(W * 0.3, H * 0.78, 0.95, { double: true })),
  estrela: () => icon((W, H) => starShape(W / 2, H / 2, W * 0.42, C.yellow, { w: 4 }) + circle(W / 2, H / 2, 4, C.red)),
  cacto: () => icon((W, H) => S.mandacaru(W / 2, H * 0.98, H * 0.78, { w: 9, flower: false, arms: [{ side: -1, y: 0.4, dx: 2.0, top: 0.75 }, { side: 1, y: 0.52, dx: 1.9, top: 0.9 }] })),
};

// fundo padrão de sertão
function sertao(W, H, o = {}) {
  const { horizon = H * 0.62, peaks = [60, 100, 70, 120, 80], groundColor = C.earth, dark = 0.75 } = o;
  let s = '';
  if (o.hills !== false) s += S.hills(0, W, horizon, peaks, { color: o.hillColor });
  const g = S.ground(0, W, horizon, H, { dark, color: groundColor, top: o.top, tufts: o.tufts, stones: o.stones });
  s += g.svg;
  return { svg: s, yAt: g.yAt };
}

const notes = (list) => list.map(([x, y, s, d, r]) => S.note(x, y, s, { double: d, rot: r || 0 })).join('');

// =====================================================================
// 1. CAPA
function capa() {
  const art = ill(
    252,
    130,
    (W, H) => {
      let s = '';
      s += S.cloud(470, 92, 150) + S.cloud(720, 70, 110);
      s += S.flyingBird(600, 130, 1.1) + S.flyingBird(640, 155, 0.8);
      s += S.sun(140, 128, 62);
      const bg = sertao(W, H, { horizon: 330, peaks: [50, 90, 60, 100, 70], dark: 0.8 });
      s += bg.svg;
      const hs = S.house(40, 372, 190);
      s += hs.svg;
      s += S.flags([20, 26], [W - 20, 30], 64, 16, { fw: 26, fh: 30 });
      s += S.palma(745, 420, 0.62);
      s += S.mandacaru(870, 452, 270, { arms: [{ side: -1, y: 0.4, dx: 1.5, top: 0.72 }, { side: 1, y: 0.56, dx: 1.25, top: 0.84 }] });
      s += S.bird(870 - 46 * 1.5 + 2, 452 - 270 * 0.72 - 14, 0.95, { flip: true }) + S.note(760, 140, 0.8) + S.note(718, 110, 0.7, { double: true });
      const ks = [
        ['ze', 318, 462],
        ['maria', 432, 470],
        ['ana', 546, 470],
        ['biu', 660, 462],
      ];
      for (const [w, x, y] of ks) s += kid(x, y, 1.05, w, { pose: 'hero', wind: 0.55, face: w === 'biu' ? 'open' : 'smile' });
      return s;
    },
    { seed: 11 },
  );
  return page(
    txt(13, 13.5, 271, `<h1 class="titulo">A Turma dos Heróis no Sertão</h1><div class="sub">A Festa Encantada dos Sabores e dos Sons</div>`, 'text-align:center') +
      at(22.5, 43.5, art) +
      txt(13, 178, 271, `<div class="cap-rodape">Uma história interativa em cordel para a turma do P5</div>`, 'text-align:center'),
    { cls: 'capa' },
  );
}

// 2. ERA UMA VEZ
function eraUmaVez(n) {
  const art = ill(
    271,
    140,
    (W, H) => {
      let s = '';
      s += S.cloud(300, 96, 170) + S.cloud(560, 66, 120);
      s += S.sun(880, 140, 78);
      s += S.flyingBird(660, 120, 1.2) + S.flyingBird(708, 150, 0.85) + S.flyingBird(620, 160, 0.7);
      const bg = sertao(W, H, { horizon: 350, peaks: [70, 120, 80, 140, 90, 110], dark: 0.8 });
      s += bg.svg;
      s += S.mandacaru(420, 410, 150, { arms: [{ side: -1, y: 0.45, dx: 1.5, top: 0.8 }, { side: 1, y: 0.5, dx: 1.4, top: 0.85 }] });
      s += S.mandacaru(150, 500, 320, {});
      s += S.palma(290, 500, 0.7) + S.palma(760, 480, 0.6);
      s += S.mandacaru(990, 510, 270, { arms: [{ side: -1, y: 0.5, dx: 1.4, top: 0.86 }, { side: 1, y: 0.38, dx: 1.5, top: 0.7, fruit: true }] });
      // vento fazendo as folhas dançarem
      s += S.wind(400, 168, 260, { amp: 16, curl: 28, w: 9 });
      for (const [x, y, a, c] of [[470, 140, -30, C.greenL], [560, 222, 40, C.green], [700, 150, 160, C.ochre], [380, 232, 20, C.greenL], [640, 250, -60, C.green], [760, 210, 80, C.greenL], [300, 180, 120, C.ochre]]) s += S.leaf(x, y, 34, a, c);
      return s;
    },
    { seed: 21 },
  );
  return page(
    at(13, 13, art) +
      txt(
        18,
        161,
        261,
        `<p class="lead capitular" style="font-size:20pt"><span class="cap">E</span>ra uma vez, no sertão brasileiro, um lugar cheio de histórias, cores e encantos. Lá, o sol brilhava forte, os mandacarus enfeitavam a paisagem e o vento soprava fazendo as folhas dançarem.</p>`,
      ),
    { num: n },
  );
}

// 3. A TURMA CHEGA (pose de herói)
function aTurma(n) {
  const art = ill(
    144,
    184,
    (W, H) => {
      let s = '';
      // raios de sol atrás dos heróis
      const cx = W / 2,
        cy = 440;
      for (let i = 0; i < 26; i++) {
        const a = rad(180 + (i + 0.5) * (180 / 26));
        const a1 = a - 0.05,
          a2 = a + 0.05;
        if (i % 2 === 0) s += `<path d="M${cx} ${cy}L${f(cx + Math.cos(a1) * 700)} ${f(cy + Math.sin(a1) * 700)}L${f(cx + Math.cos(a2) * 700)} ${f(cy + Math.sin(a2) * 700)}Z" fill="${C.yellow}" opacity="0.8"/>`;
        else s += cut(cx + Math.cos(a) * 200, cy + Math.sin(a) * 200, cx + Math.cos(a) * 520, cy + Math.sin(a) * 520, 6, C.ink);
      }
      s += S.sun(cx, cy - 10, 105, { rays: 0, mood: 'wink' });
      s += S.cloud(110, 110, 120) + S.cloud(470, 84, 100);
      const top = [[-40, 640], [60, 600], [180, 560], [300, 548], [420, 560], [540, 600], [640, 640]];
      const g = S.ground(0, W, 548, H, { top, dark: 0.55, stones: false });
      s += g.svg;
      s += S.mandacaru(40, 700, 150, { w: 26, flower: false, arms: [{ side: 1, y: 0.5, dx: 1.6, top: 0.85 }] });
      s += S.palma(548, 690, 0.5);
      const ks = [
        ['biu', 98, 604, 0.98],
        ['ana', 230, 580, 1.0],
        ['maria', 362, 578, 1.0],
        ['ze', 494, 600, 0.98],
      ];
      for (const [w, x, y, sc] of ks) s += kid(x, y, sc, w, { pose: 'hero', wind: 0.7, face: w === 'maria' ? 'open' : w === 'ze' ? 'happy' : 'smile' });
      return s;
    },
    { seed: 31 },
  );
  return page(
    at(13, 13, art) +
      col(
        165,
        12,
        117,
        186,
        `<p class="lead">E sabem quem estava chegando por lá?</p>
         <div class="grito grande">A Turma dos Heróis!</div>
         ${box(`<p>Crianças, vocês conseguem fazer pose de heróis? Coloquem as mãos na cintura, estufem o peito e digam bem alto:</p>
         <div class="grito">— Somos heróis, com coragem e união! Vamos conhecer os encantos do sertão!</div>`)}
         <p class="lead" style="margin-top:3mm">Muito bem! Nossa aventura vai começar!</p>`,
      ),
    { num: n },
  );
}

// 4. A CHEGADA AO SERTÃO
function chegada(n) {
  const art = ill(
    140,
    184,
    (W, H) => {
      let s = '';
      s += S.sun(470, 120, 52, { mood: 'happy' });
      const bg = sertao(W, H, { horizon: 380, peaks: [60, 90, 70], dark: 0.86, tufts: true });
      s += bg.svg;
      // estradinha
      const road = [[150, H + 20], [230, 650], [360, 560], [300, 470], [340, 400], [366, 380]];
      const rL = road.map(([x, y]) => [x - Math.max(6, (y - 370) * 0.2), y]);
      const rR = road.map(([x, y]) => [x + Math.max(6, (y - 370) * 0.2), y]).reverse();
      s += shape(rL.concat(rR), '#ecd3a0', { w: 4, k: 0.8 });
      s += S.mandacaru(490, 560, 230, { arms: [{ side: -1, y: 0.5, dx: 1.5, top: 0.86 }, { side: 1, y: 0.4, dx: 1.2, top: 0.7 }] });
      s += S.palma(70, 520, 0.55);
      // vento: Fuuu
      s += S.wind(40, 206, 300, { amp: 18, curl: 30, w: 9 }) + S.wind(150, 284, 230, { lines: 2, curl: 20 });
      s += carved(222, 160, 'Fuuu!', 78, { rot: -6, fill: C.ink });
      for (const [x, y, a, c] of [[400, 230, 30, C.greenL], [470, 280, -40, C.green], [90, 300, 70, C.ochre]]) s += S.leaf(x, y, 30, a, c);
      // turma caminhando
      s += kid(352, 448, 0.5, 'ana', { pose: 'walk', wind: 0.9 });
      s += kid(296, 530, 0.66, 'biu', { pose: 'walk', wind: 0.9, flip: true });
      s += kid(368, 610, 0.84, 'ze', { pose: 'walk', wind: 0.9 });
      s += kid(210, 718, 1.04, 'maria', { pose: 'walk', wind: 0.9, face: 'blow' });
      return s;
    },
    { seed: 41 },
  );
  return page(
    col(
      15,
      12,
      127,
      186,
      `${h2(ICO.sol(), 'A chegada ao sertão')}
       ${verse(['Era uma manhã ensolarada,', 'O céu estava tão bonito!', 'A Turma dos Heróis caminhava,', 'Com seu espírito aventureiro e aflito.'], 'mt')}
       <p>De repente, o vento soprou: <span class="som">Fuuu, fuuu, fuuu!</span></p>
       ${box(`<p>Vamos todos fazer o som do vento? Soprem bem devagarinho!</p>`)}`,
    ) + at(144, 13, art),
    { num: n },
  );
}

// 5. NO CAMINHO
function noCaminho(n) {
  const art = ill(
    271,
    126,
    (W, H) => {
      let s = '';
      s += S.cloud(470, 70, 120);
      const bg = sertao(W, H, { horizon: 340, peaks: [60, 90, 70, 100, 60], dark: 0.82 });
      s += bg.svg;
      // mandacaru com passarinho cantador
      s += S.mandacaru(140, 440, 290, { arms: [{ side: -1, y: 0.42, dx: 1.5, top: 0.72 }, { side: 1, y: 0.56, dx: 1.35, top: 0.86 }] });
      const bx = 140 + 49 * 1.35,
        by = 440 - 290 * 0.86 - 14;
      s += S.bird(bx - 4, by, 1.0);
      s += notes([[bx + 70, by - 70, 0.75, false, 10], [bx + 110, by - 104, 0.7, true, -8]]);
      // casinha com bandeirinhas
      const hs = S.house(730, 396, 280);
      s += hs.svg;
      s += S.flags(hs.peak, [W - 10, 70], 40, 6, { fw: 26, fh: 30 });
      s += S.flags([700, 110], hs.peak, 30, 4, { fw: 26, fh: 30 });
      // bolo na janela e o cheirinho
      s += T.bolo(hs.win[0], hs.win[1] - 2, 30, { steam: false, plate: true });
      s += '<!--kids-->';
      const trail = (x1, y1, w, ph) => {
        const x0 = hs.win[0] - 50,
          y0 = hs.win[1] - 28;
        const pts = [];
        for (let i = 0; i <= 18; i++) {
          const t = i / 18;
          pts.push([x0 + (x1 - x0) * t, y0 + (y1 - y0) * t - Math.sin(t * Math.PI) * 40 + Math.sin(t * 16 + ph) * 9 * Math.sin(t * Math.PI)]);
        }
        return limb(pts, w, C.yellow, 3.5, { t0: 0.2, t1: 0.3, wob: 0.1 });
      };
      s += trail(385, 296, 11, 0) + trail(500, 290, 9, 2) + trail(612, 252, 9, 4);
      // turma sentindo o cheiro
      const kids = kid(330, 470, 0.92, 'ze', { pose: 'sniff', face: 'sniff', wind: 0.2 }) + kid(452, 476, 0.94, 'maria', { pose: 'sniff', face: 'sniff', wind: 0.2 }) + kid(574, 468, 0.92, 'biu', { pose: 'point', face: 'open', wind: 0.2 });
      s = s.replace('<!--kids-->', kids);
      return s;
    },
    { seed: 51 },
  );
  return page(
    at(13, 13, art) +
      txt(
        18,
        144,
        262,
        `<p>No caminho, encontraram um mandacaru verdinho, um passarinho cantador e uma casinha enfeitada com bandeirinhas.</p>
         <p>Mas, ao se aproximarem, sentiram um cheiro delicioso!</p>
         <p><span class="fala">— Hum… que cheiro é esse?</span> — perguntou um dos heróis.</p>
         <p>Era <b>bolo de fubá</b>, saindo quentinho do forno!</p>`,
      ),
    { num: n },
  );
}

// 6. CHEIRINHO DE BOLO (interação)
function cheirinho(n) {
  const art = ill(
    132,
    184,
    (W, H) => {
      let s = '';
      // parede da casa
      s += `<rect x="0" y="0" width="${W}" height="${H}" fill="${C.white}"/>`;
      for (const [x, y] of [[40, 520], [400, 500], [460, 92], [30, 250]]) for (let k = 0; k < 2; k++) s += `<rect x="${f(x + k * 12)}" y="${f(y + k * 11)}" width="24" height="9" fill="${C.earth}" stroke="${C.ink}" stroke-width="2.5"/>`;
      // janela
      const wx = 110,
        wy = 200,
        ww = 310,
        wh = 230;
      s += shape([[wx, wy], [wx + ww, wy], [wx + ww, wy + wh], [wx, wy + wh]], C.ink, { w: 6, k: 0 });
      s += shape([[wx, wy], [wx - 95, wy + 14], [wx - 95, wy + wh - 6], [wx, wy + wh]], C.blue, { w: 5, k: 0 });
      s += shape([[wx + ww, wy], [wx + ww + 95, wy + 14], [wx + ww + 95, wy + wh - 6], [wx + ww, wy + wh]], C.blue, { w: 5, k: 0 });
      for (const sx of [wx - 64, wx - 32, wx + ww + 32, wx + ww + 64]) s += cut(sx, wy + 30, sx, wy + wh - 24, 3, C.ink);
      s += `<rect x="${wx - 24}" y="${wy + wh - 4}" width="${ww + 48}" height="22" fill="${C.brown}" stroke="${C.ink}" stroke-width="5"/>`;
      s += S.flags([0, 60], [W, 50], 40, 7, { fw: 30, fh: 34 });
      // bolo
      s += T.bolo(wx + ww / 2, wy + wh - 6, 105, { steam: false });
      s += S.smell(wx + ww / 2, wy + 64, 120, { n: 3, gap: 50, w: 9, col: C.paper });
      s += carved(W / 2 + 10, 168, 'Hummm!', 70, { rot: -4, fill: C.red, stroke: C.ink, sw: 5 });
      // crianças fungando
      s += `<rect x="0" y="${H - 150}" width="${W}" height="150" fill="${C.ochre}"/>` + brush([[0, H - 150], [W, H - 152]], 6, C.ink, { t0: 0, t1: 0 });
      s += kid(160, H + 60, 1.3, 'ana', { pose: 'sniff', face: 'sniff', wind: -0.2 });
      s += kid(390, H + 70, 1.3, 'biu', { pose: 'sniff', face: 'sniff', wind: 0.2 });
      return s;
    },
    { seed: 61 },
  );
  return page(
    col(
      18,
      12,
      124,
      186,
      `${box(`<p>Quem aqui já comeu bolo de fubá?</p>
       <p>Vamos fingir que estamos sentindo esse cheirinho gostoso? Puxem o ar pelo nariz e digam:</p>
       <div class="grito grande">— Hummm, que delícia!</div>`)}`,
    ) + at(152, 13, art),
    { num: n },
  );
}

// 7. O BANQUETE DOS HERÓIS
function banquete(n) {
  const art = ill(
    271,
    106,
    (W, H) => {
      let s = '';
      s += S.flags([10, 20], [W / 2, 34], 50, 9, { fw: 26, fh: 30 }) + S.flags([W / 2, 34], [W - 10, 18], 50, 9, { fw: 26, fh: 30 });
      const bg = sertao(W, H, { horizon: 270, hills: false, dark: 0.85, stones: false });
      s += bg.svg;
      const m = T.mesa(250, 250, 590, { h: 108, depth: 34 });
      s += m.svg;
      s += T.bolo(345, m.topY + 12, 58);
      s += T.goiabada(500, m.topY + 10, 96);
      s += T.pipoca(650, m.topY + 18, 0.62, { flying: 7 });
      s += T.pacoca(775, m.topY + 12, 0.7);
      s += kid(100, 400, 0.92, 'maria', { pose: 'up', face: 'happy', wind: -0.3 });
      s += kid(196, 410, 0.88, 'ze', { pose: 'wave', face: 'open', wind: -0.3 });
      s += kid(890, 410, 0.88, 'ana', { pose: 'clap', face: 'happy', wind: 0.3 });
      s += kid(986, 400, 0.92, 'biu', { pose: 'up', face: 'open', wind: 0.3 });
      return s;
    },
    { seed: 71 },
  );
  return page(
    txt(17, 12, 262, h2(ICO.bolo(), 'O banquete dos heróis')) +
      txt(28, 30, 120, verse(['Na mesa havia um bolo amarelinho,', 'Feito com carinho e amor.', 'Ao lado, doce de goiabada,', 'Vermelhinho, cheio de sabor!'])) +
      txt(152, 30, 130, verse(['Tinha pipoca pulando na panela:', '<span class="som">Pop, pop, pop!</span> Que alegria!', 'E paçoca para completar', 'Aquela grande iguaria!'])) +
      at(13, 79, art),
    { num: n },
  );
}


// ---------- crianças tocando instrumentos ----------
function kidZabumba(x, y, sc, who, o = {}) {
  const pose = { R: { e: [50, -126], h: [58, -150] }, L: { e: [-52, -94], h: [-46, -70] }, legs: POSES.hero.legs };
  const prop = T.zabumba(0, -62, 44, { maceta: false });
  const front = limb([[58, -150], [24, -100]], 6, C.brownL, 3) + blob(22, -97, 8, 8, C.white, { w: 3 });
  return kid(x, y, sc, who, { ...o, pose, prop, propFront: front, noEmblem: true });
}
function kidTriangulo(x, y, sc, who, o = {}) {
  const size = 56;
  const pose = { L: { e: [-50, -130], h: [-44, -158] }, R: { e: [46, -100], h: [12, -110] }, legs: POSES.hero.legs };
  const tri = T.triangulo(-44, -158 + size * 0.93, size, { batedor: false, sparkle: false });
  const striker = brush([[16, -108], [-30, -116]], 10, C.ink, { t0: 0, t1: 0 }) + brush([[16, -108], [-30, -116]], 4.5, '#c9c4b4', { t0: 0, t1: 0 });
  return kid(x, y, sc, who, { ...o, pose, propFront: tri + striker, noEmblem: true });
}
function kidPandeiro(x, y, sc, who, o = {}) {
  const pose = { L: { e: [-48, -100], h: [-48, -116] }, R: { e: [44, -98], h: [-14, -114] }, legs: POSES.hero.legs };
  return kid(x, y, sc, who, { ...o, pose, propFront: T.pandeiro(-60, -118, 32) + blob(-14, -114, 8.5, 8.5, TURMA_SKIN(who), { w: 3.6 }), noEmblem: true });
}
const TURMA_SKIN = (w) => TURMA[w].skin;

// 8. PIPOCA (interação)
function pipocaPula(n) {
  const art = ill(
    142,
    184,
    (W, H) => {
      let s = '';
      const bg = sertao(W, H, { horizon: 570, hills: false, dark: 0.75, stones: false });
      s += bg.svg;
      s += S.burst(118, 116, 84, C.yellow, 13) + carved(118, 132, 'POP!', 40, { fill: C.red, rot: -8 });
      s += S.burst(440, 112, 72, C.orange, 12) + carved(440, 126, 'POP!', 34, { fill: C.ink, rot: 6 });
      s += S.burst(472, 318, 50, C.yellow, 11) + carved(472, 328, 'POP!', 22, { fill: C.red, rot: -4 });
      s += T.pipoca(292, 652, 1.2, { flying: 15, spread: 1.1 });
      s += kid(100, 702, 0.98, 'biu', { pose: 'crouch', face: 'smile', wind: -0.2 });
      s += kid(462, 566, 0.9, 'maria', { pose: 'jump', face: 'happy', wind: -0.7 }) + S.motion(462, 586, 34, 90, 3, 16, 5);
      s += kid(190, 436, 0.74, 'ze', { pose: 'jump', face: 'open', wind: 0.6 }) + S.motion(190, 452, 28, 90, 3, 13, 4);
      return s;
    },
    { seed: 81 },
  );
  return page(
    col(
      18,
      12,
      118,
      186,
      box(`<p>Vamos fazer a pipoca estourar?</p>
       <p>Agachem-se bem pequenininhos… a panela está esquentando!</p>
       <p>Um, dois, três… começou a estourar!</p>
       <div class="grito grande">Pop! Pop! Pop! Pop!</div>
       <p>Agora vamos crescer e pular como pipocas!</p>`).replace('class="box"', 'class="box big"'),
    ) + at(142, 13, art),
    { num: n },
  );
}

// 9. A FESTA SEM MÚSICA
function semMusica(n) {
  const art = ill(
    150,
    184,
    (W, H) => {
      let s = '';
      s += S.cloud(150, 110, 130) + S.flyingBird(400, 120, 1);
      const bg = sertao(W, H, { horizon: 440, peaks: [60, 110, 150, 90], dark: 0.85 });
      s += bg.svg;
      // lá longe: o sanfoneiro pequenininho na serra e as notas subindo
      s += sanfoneiro(470, 318, 0.25, { pose: 'play' });
      s += notes([[440, 250, 0.7, false, -10], [500, 210, 0.8, true, 8], [540, 160, 0.75, false, 14], [460, 140, 0.6, false, -6], [575, 255, 0.6, true, 0]]);
      s += S.mandacaru(40, 520, 170, { w: 26, arms: [{ side: 1, y: 0.5, dx: 1.6, top: 0.85 }] });
      s += kid(118, 584, 0.62, 'ana', { pose: 'think', face: 'think', look: [3, -3] });
      s += kid(506, 640, 0.74, 'biu', { pose: 'listen', face: 'wow', look: [2, -3] });
      s += kid(380, 680, 0.86, 'ze', { pose: 'point', face: 'wow', look: [3, -2] });
      s += kid(190, 806, 1.55, 'maria', { pose: 'listen', face: 'think', look: [4, -2], wind: 0.3 });
      return s;
    },
    { seed: 91 },
  );
  return page(
    at(13, 13, art) +
      col(
        170,
        12,
        112,
        186,
        `<p class="lead">A Turma dos Heróis estava tão animada que quase se esqueceu de uma coisa muito importante: a festa ainda não tinha música!</p>
         <p class="lead"><span class="fala">— Como vamos fazer uma festa sem dançar?</span> — perguntou Maria.</p>
         <p class="lead">Foi então que, lá longe, ouviram um som diferente…</p>`,
      ),
    { num: n },
  );
}

// 10. OS INSTRUMENTOS MÁGICOS
function instrumentos(n) {
  const glow = (W, H, cx, cy, colr) => {
    let s = `<circle cx="${cx}" cy="${cy}" r="${W * 0.36}" fill="${colr}" opacity="0.55"/>`;
    for (let i = 0; i < 20; i++) {
      const a = (i / 20) * Math.PI * 2 + rnd(-0.05, 0.05);
      s += cut(cx + Math.cos(a) * W * 0.38, cy + Math.sin(a) * W * 0.38, cx + Math.cos(a) * W * 0.5, cy + Math.sin(a) * W * 0.5, 4.5, C.ink);
    }
    return s;
  };
  const card = (draw, seed) => ill(64, 84, draw, { seed, t: 12 });
  const arts = [
    card((W, H) => glow(W, H, 128, 140, C.yellow) + T.sanfona(128, 142, 150, 0.85) + notes([[40, 84, 0.65, false, -10], [186, 70, 0.7, true, 8], [60, 290, 0.6, true, 6], [196, 300, 0.6, false, 12]]), 101),
    card((W, H) => glow(W, H, 128, 134, C.blueL) + T.zabumba(128, 140, 60) + carved(128, 292, 'TUM TUM TÁ!', 28, { fill: C.red, stroke: C.ink, sw: 2.5 }), 102),
    card((W, H) => glow(W, H, 128, 134, C.greenL) + T.triangulo(122, 144, 104) + carved(128, 292, 'TIM TIM TIM!', 28, { fill: C.red, stroke: C.ink, sw: 2.5 }), 103),
    card((W, H) => glow(W, H, 128, 134, C.pink) + T.pandeiro(128, 134, 60) + S.motion(44, 134, 30, 90, 3, 12) + S.motion(212, 134, 30, 90, 3, 12) + carved(128, 292, 'PLIM PLIM!', 30, { fill: C.red, stroke: C.ink, sw: 2.5 }), 104),
  ];
  const caps = [
    `Primeiro chegou a <b>sanfona</b>, tocando uma melodia alegre.`,
    `Depois veio a <b>zabumba</b>, marcando o ritmo:<br><span class="fala">— Tum, tum, tá!<br>Tum, tum, tá!</span>`,
    `Logo apareceu o <b>triângulo</b>:<br><span class="fala">— Tim, tim, tim!</span>`,
    `E o <b>pandeiro</b> entrou na brincadeira:<br><span class="fala">— Plim, plim, plim!</span>`,
  ];
  let body = txt(17, 12, 262, `${h2(ICO.nota(), 'Os instrumentos mágicos do sertão')}<p style="margin-top:3mm"><span class="som" style="font-size:18pt">Triiiiim, triiiiim! Tum, tum, tá!</span>&nbsp; Era o som dos instrumentos tradicionais do Nordeste!</p>`);
  arts.forEach((a, i) => {
    const x = 13 + i * 69;
    body += at(x, 50, a) + txt(x + 1, 138, 62, `<p class="cap">${caps[i]}</p>`);
  });
  return page(body, { num: n });
}

// 11. A ORQUESTRA DO SERTÃO (interação)
function orquestra(n) {
  const vin = (draw, seed) => ill(72, 34, draw, { frame: false, seed, style: 'display:block' });
  const rows = [
    [vin((W, H) => T.sanfona(70, 68, 118, 0.8) + kid(212, 134, 0.57, 'maria', { pose: 'dance', face: 'happy', tilt: 8 }), 111), `Quando eu disser <b>sanfona</b>, vocês balançam o corpo como se estivessem dançando.`],
    [vin((W, H) => T.zabumba(70, 74, 46, { maceta: true }) + kid(212, 134, 0.57, 'biu', { pose: 'pat', face: 'open' }) + S.motion(170, 100, 14, 90, 2, 8, 3) + S.motion(254, 100, 14, 90, 2, 8, 3), 112), `Quando eu disser <b>zabumba</b>, batam as mãos nas pernas: <span class="som">tum, tum, tá!</span>`],
    [vin((W, H) => T.triangulo(70, 78, 84, { sparkle: false }) + kid(212, 134, 0.57, 'ana', { pose: 'clap', face: 'happy' }) + S.sparkle(194, 34, 10) + S.sparkle(234, 28, 8) + S.sparkle(214, 12, 6), 113), `Quando eu disser <b>triângulo</b>, batam palmas bem delicadinhas: <span class="som">tim, tim, tim!</span>`],
    [vin((W, H) => T.pandeiro(70, 70, 48) + kid(212, 134, 0.57, 'ze', { pose: 'up', face: 'open' }) + S.motion(166, 32, 16, 90, 2, 8, 3) + S.motion(258, 32, 16, 90, 2, 8, 3), 114), `Quando eu disser <b>pandeiro</b>, balancem as mãos no ar!`],
  ];
  const list = `<ul class="acts">${rows.map(([v, t]) => `<li><span class="vin">${v}</span><span>${t}</span></li>`).join('')}</ul>`;
  return page(
    col(
      20,
      14,
      257,
      182,
      `<div class="box" style="padding-top:8mm"><div class="tag">Interação</div>
        <div class="grito grande" style="margin-bottom:4mm">Crianças, vamos formar uma orquestra do sertão?</div>
        ${list}
        <div class="grito grande center" style="margin-top:2mm">Preparados?</div></div>`,
    ),
    { num: n },
  );
}

// 12. A SANFONA COMEÇOU A TOCAR
function tocando(n) {
  const art = ill(
    271,
    128,
    (W, H) => {
      let s = '';
      s += S.sun(92, 96, 46);
      s += S.flags([150, 26], [W / 2 + 40, 44], 56, 10, { fw: 26, fh: 30 }) + S.flags([W / 2 + 40, 44], [W - 12, 24], 52, 9, { fw: 26, fh: 30 });
      const bg = sertao(W, H, { horizon: 350, peaks: [50, 80, 60, 90, 60], dark: 0.86 });
      s += bg.svg;
      s += S.mandacaru(1030, 420, 200, { w: 32, flower: true, arms: [{ side: -1, y: 0.45, dx: 1.5, top: 0.8 }] });
      s += notes([[300, 200, 0.8, false, -8], [420, 170, 0.9, true, 6], [700, 180, 0.85, false, 10], [800, 220, 0.7, true, -6], [250, 270, 0.6, false, 0], [930, 230, 0.7, false, 12]]);
      s += kid(160, 488, 0.92, 'maria', { pose: 'dance', face: 'happy', wind: -0.6 });
      s += kidZabumba(340, 490, 0.9, 'ze', { face: 'open', wind: -0.3 });
      s += sanfoneiro(545, 492, 0.98, { pose: 'play' });
      s += kidPandeiro(750, 490, 0.9, 'ana', { face: 'happy', wind: 0.3 });
      s += kidTriangulo(905, 488, 0.9, 'biu', { face: 'sing', wind: 0.4 });
      return s;
    },
    { seed: 121 },
  );
  return page(at(13, 13, art) + txt(13, 146, 271, verse(['A sanfona começou a tocar,', 'A zabumba veio acompanhar,', 'O triângulo fez <span class="som">tim, tim, tim</span>,', 'E ninguém queria mais parar!'], 'centro')), { num: n });
}

// 13. A MISSÃO
function missao(n) {
  const art = ill(
    136,
    184,
    (W, H) => {
      let s = '';
      const bg = sertao(W, H, { horizon: 560, peaks: [40, 70, 50], dark: 0.8 });
      s += bg.svg;
      s += S.wind(20, 150, 430, { amp: 26, curl: 50, w: 12, lines: 3, gap: 34 });
      s += `<g transform="rotate(24 380 270)">${T.bolo(380, 300, 46, { steam: false })}</g>`;
      s += `<g transform="rotate(-22 140 300)">${T.goiabada(140, 320, 64)}</g>`;
      s += `<g transform="rotate(16 440 440)">${T.pacocaPiece(440, 450, 1.1)}</g>` + `<g transform="rotate(-30 290 390)">${T.pacocaPiece(290, 400, 0.95)}</g>`;
      for (const [x, y, r] of [[240, 250, 14], [290, 200, 12], [490, 240, 13], [500, 340, 11], [90, 420, 12], [360, 470, 10], [190, 470, 11], [450, 180, 10]]) s += T.popcorn(x, y, r);
      s += S.motion(500, 180, 34, 200, 3, 14, 4) + S.motion(70, 230, 34, 160, 3, 14, 4);
      s += kid(380, 714, 0.76, 'maria', { pose: 'search', face: 'wow', look: [1, -3] });
      s += kid(480, 704, 0.7, 'biu', { pose: 'up', face: 'wow', look: [-1, -3] });
      s += sanfoneiro(160, 752, 0.96, { pose: 'announce', face: 'wow' });
      return s;
    },
    { seed: 131 },
  );
  return page(
    col(
      17,
      12,
      127,
      186,
      `${h2(ICO.estrela(), 'A missão da Turma dos Heróis')}
       <p class="lead" style="margin-top:3mm">Mas, de repente, a música parou!</p>
       <p>O sanfoneiro olhou para um lado, olhou para o outro e anunciou:</p>
       <p class="fala lead">— Temos uma missão! O vento espalhou os ingredientes da nossa festa, e precisamos organizar tudo para continuar!</p>
       <p>A Turma dos Heróis precisava de ajuda. E quem poderia ajudar?</p>
       <div class="grito grande">Vocês, crianças!</div>`,
    ) + at(148, 13, art),
    { num: n },
  );
}

// 14. PROCURANDO OS INGREDIENTES
function procura(n) {
  const art = ill(
    150,
    184,
    (W, H) => {
      let s = '';
      s += S.sun(92, 92, 44, { mood: 'wink' }) + S.cloud(420, 96, 130);
      const bg = sertao(W, H, { horizon: 400, peaks: [60, 90, 70], dark: 0.88 });
      s += bg.svg;
      // mandacaru com ninho (pipoca no ninho) e paçoca escondida no pé
      s += T.pacoca(520, 630, 0.55, { plate: false });
      s += S.mandacaru(470, 650, 380, { arms: [{ side: -1, y: 0.42, dx: 1.6, top: 0.74 }, { side: 1, y: 0.58, dx: 1.25, top: 0.86 }] });
      const nx = 470 - 65 * 1.6,
        ny = 650 - 380 * 0.74 - 18;
      s += blob(nx, ny + 6, 44, 16, C.brown, { w: 4 });
      for (let i = 0; i < 7; i++) s += cut(nx - 40 + i * 12, ny + rnd(-2, 10), nx - 30 + i * 12, ny + rnd(6, 18), 3, C.ink, 0.2);
      for (const [dx, dy] of [[-22, -6], [0, -14], [20, -6], [-8, -24], [12, -26]]) s += T.popcorn(nx + dx, ny + dy, 11);
      s += S.bird(nx + 70, ny + 8, 0.7, { flip: true });
      // bolo atrás da pedra
      s += T.bolo(196, 470, 40, { plate: false });
      s += blob(200, 504, 84, 50, C.gray, { w: 6, n: 16, j: 0.08 }) + cut(150, 476, 220, 464, 6, C.white) + cut(160, 512, 250, 508, 4, C.ink);
      // goiabada debaixo da palma
      s += T.goiabada(350, 628, 54);
      s += S.palma(312, 640, 0.95);
      // Ana com a lupa
      const lupa = T.lupa(84, -146, 24, 120);
      s += kid(96, 780, 0.86, 'ana', { pose: { R: { e: [50, -104], h: [72, -126] }, L: { e: [-50, -90], h: [-26, -70] } }, face: 'smile', look: [3, -1], propFront: lupa });
      return s;
    },
    { seed: 141 },
  );
  const it = (ico, html) => `<div class="item">${ico}<div>${html}</div></div>`;
  const mini = (draw, seed) => ill(17, 17, draw, { frame: false, seed, style: 'display:block' });
  return page(
    at(13, 13, art) +
      col(
        169,
        12,
        114,
        186,
        `${it(mini((W, H) => T.bolo(34, 54, 22, { steam: false }), 1), `<p>Primeiro, vamos encontrar o <b>bolo de fubá</b>! Onde será que ele está?</p><p class="prof">Deixe as crianças procurarem um desenho ou objeto escondido na sala.</p>`)}
         ${it(mini((W, H) => T.goiabada(36, 50, 38), 2), `<p>Muito bem! Agora precisamos encontrar a <b>goiabada</b>!</p><p class="prof">As crianças procuram o próximo elemento.</p>`)}
         ${it(mini((W, H) => T.popcorn(22, 30, 12) + T.popcorn(44, 24, 13) + T.popcorn(34, 48, 12), 3), `<p>E a <b>pipoca</b>? Vamos procurar!</p>`)}
         ${it(mini((W, H) => T.pacoca(34, 56, 0.36, { plate: false }), 4), `<p>E a <b>paçoca</b>? Será que está escondida perto do mandacaru?</p>`)}`,
      ),
    { num: n },
  );
}

// 15. VOCÊS CONSEGUIRAM!
function conseguiram(n) {
  const art = ill(
    271,
    122,
    (W, H) => {
      let s = '';
      s += S.flags([12, 22], [W - 12, 30], 56, 18, { fw: 24, fh: 28 });
      s += S.sun(150, 120, 40);
      const bg = sertao(W, H, { horizon: 340, peaks: [40, 60, 50, 70], dark: 0.86 });
      s += bg.svg;
      const ks = ['ze', 'maria', 'biu', 'ana'];
      ks.forEach((w, i) => (s += kid(96 + i * 104, 456, 0.82, w, { pose: 'hold', face: i % 2 ? 'happy' : 'open', wind: 0.2 })));
      const m = T.mesa(500, 344, 330, { h: 92, depth: 26, legs: 40 });
      s += m.svg;
      s += T.bolo(552, m.topY + 8, 36);
      s += T.goiabada(642, m.topY + 6, 58);
      s += T.pipoca(722, m.topY + 10, 0.42, { flying: 4, lid: false });
      s += T.pacoca(790, m.topY + 6, 0.42);
      s += sanfoneiro(970, 466, 0.95, { pose: 'smile', face: 'happy' });
      for (const [x, y, r] of [[470, 150, 12], [880, 130, 10], [430, 240, 8], [1040, 220, 9]]) s += S.sparkle(x, y, r);
      return s;
    },
    { seed: 151 },
  );
  return page(
    at(13, 13, art) +
      txt(
        18,
        141,
        262,
        `<p>Com a ajuda de todos, os ingredientes foram encontrados e a mesa ficou completa novamente. O sanfoneiro sorriu e disse:</p>
         <div class="mensagem"><span class="fala">— Vocês conseguiram!</span> Um verdadeiro herói não precisa ter superpoderes. Ele pode <b>ajudar</b>, <b>cooperar</b>, <b>ouvir os amigos</b> e <b>aprender coisas novas</b>!</div>`,
      ),
    { num: n },
  );
}

// 16. O GRANDE FINAL
function grandeFinal(n) {
  const art = ill(
    271,
    114,
    (W, H) => {
      let s = '';
      s += S.flags([12, 20], [W * 0.5, 70], 30, 10, { fw: 24, fh: 28 }) + S.flags([W * 0.5, 70], [W - 12, 20], 30, 10, { fw: 24, fh: 28 });
      s += S.flags([12, 110], [W - 12, 112], 70, 20, { fw: 22, fh: 26 });
      const bg = sertao(W, H, { horizon: 330, hills: false, dark: 0.86 });
      s += bg.svg;
      s += S.mandacaru(40, 380, 200, { w: 30, arms: [{ side: 1, y: 0.5, dx: 1.5, top: 0.85 }] });
      s += S.mandacaru(1050, 390, 210, { w: 30, arms: [{ side: -1, y: 0.45, dx: 1.5, top: 0.8 }] });
      s += notes([[420, 200, 0.75, false, -8], [640, 190, 0.8, true, 10], [520, 150, 0.6, false, 0]]);
      for (const [x, y, r] of [[300, 180, 12], [760, 170, 13], [240, 260, 10], [850, 250, 11], [580, 240, 9]]) s += T.popcorn(x, y, r);
      s += kid(170, 440, 0.88, 'maria', { pose: 'dance', face: 'happy', wind: -0.5 });
      s += kid(310, 446, 0.86, 'ze', { pose: 'dance2', face: 'sing', wind: -0.5 });
      s += sanfoneiro(540, 448, 0.9, { pose: 'play' });
      s += kid(770, 446, 0.86, 'ana', { pose: 'dance', face: 'sing', wind: 0.5 });
      s += kid(910, 440, 0.88, 'biu', { pose: 'dance2', face: 'happy', wind: 0.5 });
      return s;
    },
    { seed: 161 },
  );
  return page(
    at(13, 13, art) +
      txt(17, 131, 262, h2(ICO.cacto(), 'O grande final: Viva o sertão!')) +
      txt(30, 147, 120, verse(['A festa recomeçou,', 'A sanfona voltou a tocar,', 'A zabumba fez <span class="som">tum, tum, tá</span>,', 'E todos começaram a dançar!'])) +
      txt(156, 147, 126, verse(['A pipoca fez <span class="som">pop, pop, pop</span>,', 'O triângulo fez <span class="som">tim, tim, tim</span>,', 'A Turma dos Heróis cantou', 'E a alegria não teve fim!'])),
    { num: n },
  );
}

// 17. VAMOS REPETIR JUNTOS
function repetir(n) {
  const pares = [
    ['No sertão tem alegria…', 'Tem festa todo dia!'],
    ['Tem sanfona e zabumba…', 'Tem música que retumba!'],
    ['Tem bolo e goiabada…', 'Tem pipoca espalhada!'],
    ['Tem paçoca para comer…', 'E muitas histórias para conhecer!'],
    ['E quando a turma se une…', 'Todo herói se reúne!'],
  ];
  const rows = pares.map(([a, b]) => `<div class="par"><div class="eu">— ${a}</div><div class="cri"><span class="quem">Crianças:</span> ${b}</div></div>`).join('');
  const art = ill(
    80,
    184,
    (W, H) => {
      let s = '';
      s += S.flags([10, 30], [W - 10, 22], 34, 6, { fw: 24, fh: 28 });
      s += S.sun(160, 150, 46);
      s += notes([[50, 300, 0.85, false, -10], [236, 270, 0.9, true, 8], [140, 250, 0.65, false, 0], [270, 380, 0.6, false, 10]]);
      const bg = sertao(W, H, { horizon: 520, hills: false, dark: 0.7, stones: false });
      s += bg.svg;
      s += kid(160, 520, 0.8, 'ana', { pose: 'wave', face: 'sing', wind: 0.2 });
      s += kid(86, 720, 1.05, 'biu', { pose: 'up', face: 'sing', wind: -0.3 });
      s += kid(238, 712, 1.05, 'maria', { pose: 'clap', face: 'sing', wind: 0.3 });
      return s;
    },
    { seed: 171 },
  );
  return page(
    col(
      17,
      12,
      180,
      186,
      `<p class="lead">Agora, vamos repetir juntos este cordel:</p>
       <div class="grito">Eu digo um verso, vocês completam!</div>
       <div class="pares">${rows}</div>`,
    ) + at(204, 13, art),
    { num: n },
  );
}

// 18. VIVA!
function viva(n) {
  const art = ill(
    146,
    184,
    (W, H) => {
      let s = '';
      s += S.sun(W / 2, 300, 92, { mood: 'happy' });
      s += S.flags([10, 30], [W - 10, 34], 40, 8, { fw: 26, fh: 30 });
      s += carved(W / 2, 182, 'VIVA!', 120, { fill: C.red, stroke: C.ink, sw: 8, rot: -3 });
      const bg = sertao(W, H, { horizon: 540, hills: false, dark: 0.7, stones: false });
      s += bg.svg;
      for (let i = 0; i < 26; i++) {
        const x = rnd(30, W - 30),
          y = rnd(80, 520);
        if (Math.hypot(x - W / 2, y - 300) < 170) continue;
        s += i % 3 ? `<rect x="${f(x)}" y="${f(y)}" width="10" height="16" fill="${[C.red, C.blue, C.green, C.yellow, C.pink][i % 5]}" stroke="${C.ink}" stroke-width="2.5" transform="rotate(${f(rnd(-50, 50))} ${f(x)} ${f(y)})"/>` : S.sparkle(x, y, 10);
      }
      s += kid(96, 640, 0.86, 'ana', { pose: 'jump', face: 'happy', wind: -0.6 }) + S.motion(96, 656, 26, 90, 3, 12, 4);
      s += kid(230, 704, 0.92, 'maria', { pose: 'up', face: 'open', wind: -0.3 });
      s += kid(366, 704, 0.92, 'ze', { pose: 'up', face: 'happy', wind: 0.3 });
      s += kid(500, 640, 0.86, 'biu', { pose: 'jump', face: 'open', wind: 0.6 }) + S.motion(500, 656, 26, 90, 3, 12, 4);
      return s;
    },
    { seed: 181 },
  );
  return page(
    at(13, 13, art) +
      col(
        167,
        12,
        116,
        186,
        `<p>E assim a Turma dos Heróis descobriu que o sertão é cheio de sabores, sons, histórias e tradições que merecem ser conhecidos e valorizados.</p>
         <p>E nossa aventura termina com uma grande celebração:</p>
         <div class="grito vivas">— Viva a Turma dos Heróis!<br>— Viva o sertão brasileiro!<br>— Viva a cultura popular!</div>
         <div class="eita">Eita, que festa arretada!</div>`,
      ),
    { num: n },
  );
}

// 19. FIM
function fim() {
  const art = ill(
    236,
    132,
    (W, H) => {
      let s = '';
      s += S.sun(W / 2, 104, 48, { mood: 'wink' });
      s += S.flags([12, 26], [W / 2 - 110, 40], 30, 6, { fw: 24, fh: 28 }) + S.flags([W / 2 + 110, 40], [W - 12, 26], 30, 6, { fw: 24, fh: 28 });
      const bg = sertao(W, H, { horizon: 400, peaks: [50, 80, 60, 80], dark: 0.8 });
      s += bg.svg;
      s += S.mandacaru(130, 480, 330, {});
      s += S.mandacaru(814, 480, 330, { arms: [{ side: -1, y: 0.5, dx: 1.4, top: 0.85, fruit: true }, { side: 1, y: 0.4, dx: 1.5, top: 0.75 }] });
      s += carved(W / 2, 368, 'Fim', 180, { fill: C.ink, stroke: C.paper, sw: 6 });
      s += T.sanfona(W / 2 - 80, 450, 96, 0.7) + T.pandeiro(W / 2 + 70, 440, 34) + T.popcorn(W / 2 + 140, 470, 14) + T.popcorn(W / 2 - 170, 470, 13);
      return s;
    },
    { seed: 191 },
  );
  return page(
    at(30.5, 22, art) +
      txt(13, 162, 271, `<div class="cap-rodape">A Turma dos Heróis no Sertão</div><div class="sub" style="font-size:16pt">A Festa Encantada dos Sabores e dos Sons</div>`, 'text-align:center'),
    {},
  );
}

// 20. CARTÕES DA MISSÃO (para recortar)
function cartoes() {
  const card = (draw, seed) => ill(54, 110, draw, { seed, t: 10 });
  const glow = (W, cy, colr) => `<circle cx="${W / 2}" cy="${cy}" r="${W * 0.4}" fill="${colr}" opacity="0.5"/>` + S.sparkle(40, 60, 13) + S.sparkle(176, 80, 10) + S.sparkle(60, 380, 9) + S.sparkle(170, 370, 12);
  const items = [
    ['Bolo de fubá', card((W, H) => glow(W, 226, C.yellow) + T.bolo(108, 276, 66), 201)],
    ['Goiabada', card((W, H) => glow(W, 226, C.pink) + T.goiabada(110, 266, 104), 202)],
    ['Pipoca', card((W, H) => glow(W, 226, C.blueL) + T.pipoca(108, 306, 0.9, { flying: 7, lid: false, spread: 0.8 }), 203)],
    ['Paçoca', card((W, H) => glow(W, 226, C.greenL) + T.pacoca(108, 286, 0.95), 204)],
  ];
  let body = txt(17, 13, 262, `<h2>Cartões da missão</h2><p class="prof" style="font-size:14pt;margin-top:2mm">Material de apoio: recorte os cartões na linha tracejada e esconda-os pela sala antes de ler a página da missão.</p>`);
  items.forEach(([nome, a], i) => {
    const x = 16 + i * 67.5;
    body += `<div class="abs cartao txt" style="left:${x}mm;top:44mm"></div>` + at(x + 4, 48, a) + txt(x, 163, 62, `<div class="nome-cartao">${nome}</div>`, 'text-align:center');
  });
  return page(body, {});
}

export const PAGES = [capa, eraUmaVez, aTurma, chegada, noCaminho, cheirinho, banquete, pipocaPula, semMusica, instrumentos, orquestra, tocando, missao, procura, conseguiram, grandeFinal, repetir, viva, fim, cartoes];
