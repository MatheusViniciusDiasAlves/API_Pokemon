// Estrutura das páginas: filtros de xilogravura, papel, tipografia e
// blocos de texto (versos, interação, falas).
import { C, f, uid, rnd, seed, poly, ringD } from './draw.mjs';

export const PW = 297,
  PH = 210; // A4 deitado (mm)
export const U = 4; // unidades SVG por mm

// filtro que deixa tudo com cara de impressão em matriz de madeira:
// bordas roídas pela goiva + falhas de tinta no papel.
export const DEFS = `<svg width="0" height="0" style="position:absolute">
<filter id="xilo" x="-2%" y="-2%" width="104%" height="104%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.028" numOctaves="3" seed="4" result="n1"/>
  <feDisplacementMap in="SourceGraphic" in2="n1" scale="7" xChannelSelector="R" yChannelSelector="G" result="d"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.11" numOctaves="4" seed="9" result="n2"/>
  <feColorMatrix in="n2" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -18 0 0 0 13.4" result="holes"/>
  <feColorMatrix in="d" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  1.5 2.95 0.55 0 -0.9" result="bright"/>
  <feComposite in="holes" in2="bright" operator="arithmetic" k1="-1" k2="1" k3="1" k4="0" result="mask"/>
  <feComposite in="d" in2="mask" operator="in" result="h"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.009" numOctaves="2" seed="21" result="n3"/>
  <feColorMatrix in="n3" type="matrix" values="0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  -0.7 0 0 0 1.38" result="fade"/>
  <feComposite in="h" in2="fade" operator="in"/>
</filter>
</svg>`;

// moldura de matriz de xilo: borda preta grossa, canto interno irregular
export function frameD(W, H, t) {
  const outer = [];
  const inner = [];
  const edge = (x0, y0, x1, y1, a, arr) => {
    const n = Math.max(3, Math.round(Math.hypot(x1 - x0, y1 - y0) / 60));
    for (let i = 0; i < n; i++) {
      const tt = i / n;
      arr.push([x0 + (x1 - x0) * tt + rnd(-a, a), y0 + (y1 - y0) * tt + rnd(-a, a)]);
    }
  };
  edge(0, 0, W, 0, 1.2, outer);
  edge(W, 0, W, H, 1.2, outer);
  edge(W, H, 0, H, 1.2, outer);
  edge(0, H, 0, 0, 1.2, outer);
  edge(t, t, t, H - t, 3, inner);
  edge(t, H - t, W - t, H - t, 3, inner);
  edge(W - t, H - t, W - t, t, 3, inner);
  edge(W - t, t, t, t, 3, inner);
  return poly(outer) + poly(inner);
}

// Uma ilustração: wmm x hmm, desenhada em unidades (U por mm)
export function ill(wmm, hmm, draw, o = {}) {
  const W = wmm * U,
    H = hmm * U;
  seed(o.seed || 7);
  const { frame = true, t = 14, bg = '' } = o;
  const body = draw(W, H);
  const cid = uid('sc');
  const inner = `${bg ? `<rect x="0" y="0" width="${W}" height="${H}" fill="${bg}"/>` : ''}${body}`;
  const content = frame
    ? `<clipPath id="${cid}"><rect x="${t * 0.6}" y="${t * 0.6}" width="${W - t * 1.2}" height="${H - t * 1.2}"/></clipPath><g clip-path="url(#${cid})">${inner}</g><path d="${frameD(W, H, t)}" fill="${C.ink}" fill-rule="evenodd"/>`
    : inner;
  const style = `width:${wmm}mm;height:${hmm}mm;${o.style || ''}`;
  return `<svg class="ill${o.cls ? ' ' + o.cls : ''}" viewBox="0 0 ${W} ${H}" style="${style}" overflow="visible"><g filter="url(#xilo)">${content}</g></svg>`;
}

// posiciona algo na página em mm
export const at = (x, y, html, extra = '') => `<div class="abs" style="left:${x}mm;top:${y}mm;${extra}">${html}</div>`;

export const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

export function page(inner, o = {}) {
  const num = o.num ? `<div class="num txt">${o.num}</div>` : '';
  return `<section class="page${o.cls ? ' ' + o.cls : ''}">${o.border === false ? '' : '<div class="border"></div>'}${inner}${num}</section>`;
}

export const CSS = (fontDir) => `
@font-face{font-family:Rye;src:url(${fontDir}/rye-latin-400-normal.woff2)}
@font-face{font-family:Sancreek;src:url(${fontDir}/sancreek-latin-400-normal.woff2)}
@font-face{font-family:Fell;src:url(${fontDir}/im-fell-dw-pica-latin-400-normal.woff2)}
@font-face{font-family:Fell;font-style:italic;src:url(${fontDir}/im-fell-dw-pica-latin-400-italic.woff2)}
@page{size:${PW}mm ${PH}mm;margin:0}
*{box-sizing:border-box}
html,body{margin:0;padding:0;background:#777}
.page{width:${PW}mm;height:${PH}mm;position:relative;overflow:hidden;background-color:${C.paper};
  background-image:var(--paper);background-size:90mm 90mm;break-after:page;color:${C.ink};font-family:Fell,serif}
.page::after{content:"";position:absolute;inset:0;pointer-events:none;
  background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 62%,rgba(110,70,20,.16) 100%)}
body.bgonly .txt{visibility:hidden}
body.bgonly .txt .ill{visibility:visible}
body.bgonly .txt .box{visibility:visible}
body.bgonly .txt .box *{visibility:hidden}
body.bgonly .txt .box .ill,body.bgonly .txt .box .ill *{visibility:visible}
body.textonly .box{background:transparent!important;border-color:transparent!important}
body.textonly .page{background:none!important}
body.textonly .page::after,body.textonly .ill,body.textonly .border,body.textonly .deco{visibility:hidden}
.bgimg{position:absolute;inset:0;width:100%;height:100%;display:block}
.abs{position:absolute}
.border{position:absolute;inset:6mm;border:0.7mm solid ${C.ink};outline:0.25mm solid ${C.ink};outline-offset:1.2mm;opacity:.82}
.num{position:absolute;bottom:2.2mm;left:0;right:0;text-align:center;font-family:Rye;font-size:10pt;color:${C.ink}}
.num::before,.num::after{content:"✦";font-family:serif;font-size:8pt;margin:0 2.5mm;color:${C.redD}}
h1,h2,h3{font-family:Rye;font-weight:normal;margin:0;line-height:1.05;color:${C.ink}}
h2{font-size:25pt;letter-spacing:.2pt}
h2 .ico{display:inline-block;vertical-align:middle;margin-right:2mm}
p{margin:0 0 2.6mm 0;font-size:17pt;line-height:1.28;hyphens:none}
.lead{font-size:18.5pt}
.verse{font-size:19pt;line-height:1.36;margin:0 0 3mm 0}
.verse .l{display:block}
.verse .l:nth-child(even){padding-left:9mm}
.fala{color:${C.redD}}
.som{font-family:Rye;color:${C.redD};letter-spacing:.3pt}
.grito{font-family:Rye;font-size:19pt;line-height:1.25;color:${C.redD}}
.small{font-size:13.5pt}
.prof{font-style:italic;font-size:13.5pt;color:#5c4632;margin:0 0 2.6mm 0;padding-left:6mm;position:relative}
.prof::before{content:"✎";position:absolute;left:0;top:0;font-style:normal;color:${C.redD}}
.box{position:relative;border:0.9mm solid ${C.ink};border-radius:2.5mm 1.2mm 3mm 1.5mm;background:rgba(240,198,76,.25);
  padding:6.5mm 6mm 3mm 6mm;margin:5mm 0 2mm 0}
.box .tag{position:absolute;top:-4.6mm;left:5mm;background:${C.red};color:${C.white};font-family:Rye;font-size:12pt;
  padding:1.1mm 3.5mm .7mm 3.5mm;border:0.7mm solid ${C.ink};transform:rotate(-1.5deg)}
.box p{font-size:16.5pt}
.box.big p{font-size:18.5pt;margin-bottom:3.5mm}
.center{text-align:center}
ul.acts{list-style:none;padding:0;margin:0}
h1.titulo{font-size:40pt;letter-spacing:.4pt}
.sub{font-style:italic;font-size:21pt;color:${C.redD};margin-top:1.8mm}
.cap-rodape{font-family:Rye;font-size:15pt}
.capitular .cap{float:left;font-family:Rye;font-size:54pt;line-height:.82;color:${C.red};margin:1.2mm 2.5mm 0 0}
.grito.grande{font-size:24pt;margin:1mm 0 2mm 0}
.verse.mt{margin-top:4mm}
b{font-weight:normal;color:${C.redD}}
p.cap{font-size:14.5pt;line-height:1.24;text-align:center}
.verse.centro{text-align:center;font-size:21pt}
.verse.centro .l:nth-child(even){padding-left:0}
ul.acts .vin{flex:0 0 72mm}
ul.acts li span:last-child{font-size:16.5pt}
.item{display:flex;gap:3.5mm;align-items:flex-start;margin:0 0 3mm 0}
.item svg{flex:0 0 17mm}
.item p{font-size:16pt;margin-bottom:1.2mm}
.item .prof{font-size:13pt}
.mensagem{font-size:19pt;line-height:1.3;margin-top:3mm;padding:3.5mm 6mm;border-left:2mm solid ${C.red};background:rgba(240,198,76,.22)}
.pares{margin-top:4mm}
.par{display:grid;grid-template-columns:1fr 1fr;gap:5mm;padding:3.4mm 0;border-bottom:.45mm dashed rgba(30,25,21,.45);align-items:center}
.par:last-child{border-bottom:none}
.par .eu{font-size:18.5pt}
.par .cri{font-family:Rye;font-size:14.5pt;color:${C.redD};line-height:1.25}
.par .quem{font-family:Fell;font-style:italic;font-size:12pt;color:#5c4632;display:block}
.vivas{font-size:18pt;line-height:1.45;margin:2mm 0 4mm 0}
.eita{font-family:Rye;font-size:24pt;color:${C.red};transform:rotate(-2deg);text-align:center;margin-top:2mm}
.cartao{width:62mm;height:136mm;border:.6mm dashed ${C.ink};border-radius:2mm}
.nome-cartao{font-family:Rye;font-size:17pt}
ul.acts li{display:flex;align-items:center;gap:4mm;margin:0 0 2.4mm 0;font-size:16pt;line-height:1.2}
`;
