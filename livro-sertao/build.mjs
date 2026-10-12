// Gera o livro em PDF.
//   node build.mjs              -> out/A_Turma_dos_Herois_no_Sertao.pdf
//   node build.mjs --preview    -> out/preview/pNN.png (rápido, para conferir)
//   node build.mjs --preview --only=3,4
// As ilustrações (com o filtro de xilogravura) são rasterizadas em alta
// resolução; o texto continua vetorial e selecionável no PDF.
import { writeFileSync, mkdirSync, rmSync, existsSync } from 'node:fs';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { CSS, DEFS } from './lib/page.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  ({ chromium } = await import('/opt/node22/lib/node_modules/playwright/index.mjs'));
}

const args = process.argv.slice(2);
const opt = (k) => args.find((a) => a.startsWith(`--${k}=`))?.split('=')[1];
const preview = args.includes('--preview');
const only = opt('only')?.split(',').map(Number);
const mod = opt('pages') || './paginas.mjs';
const DPI = Number(opt('dpi') || 220);
const OUT = path.join(here, 'out');
const TMP = path.join(OUT, 'tmp');
mkdirSync(TMP, { recursive: true });

const { PAGES } = await import(pathToFileURL(path.join(here, mod)).href);
const fontDir = pathToFileURL(path.join(here, 'fonts')).href;

const PAPER = `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
<filter id="p" x="0" y="0" width="100%" height="100%" color-interpolation-filters="sRGB">
  <feTurbulence type="fractalNoise" baseFrequency="0.75" numOctaves="3" stitchTiles="stitch" seed="3" result="fine"/>
  <feColorMatrix in="fine" type="matrix" values="0 0 0 0 0.36  0 0 0 0 0.24  0 0 0 0 0.12  1.2 0 0 0 -0.56" result="a"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.005" numOctaves="4" stitchTiles="stitch" seed="11" result="big"/>
  <feColorMatrix in="big" type="matrix" values="0 0 0 0 0.55  0 0 0 0 0.38  0 0 0 0 0.16  0.4 0 0 0 -0.17" result="b"/>
  <feTurbulence type="fractalNoise" baseFrequency="0.5" numOctaves="2" stitchTiles="stitch" seed="5" result="lt"/>
  <feColorMatrix in="lt" type="matrix" values="0 0 0 0 1  0 0 0 0 0.98  0 0 0 0 0.92  2.6 0 0 0 -1.5" result="c"/>
  <feMerge><feMergeNode in="b"/><feMergeNode in="a"/><feMergeNode in="c"/></feMerge>
</filter>
<rect width="1000" height="1000" fill="#f2e3c2"/>
<rect width="1000" height="1000" filter="url(#p)"/>
</svg>`;

function html(pages, bodyCls, paperUrl, bgs) {
  const body = pages
    .map((p, i) => (bgs ? p.replace('<section class="page', `<section data-bg class="page`).replace(/(<section[^>]*>)/, `$1<img class="bgimg" src="${bgs[i]}">`) : p))
    .join('\n');
  return `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>A Turma dos Heróis no Sertão</title>
<style>${CSS(fontDir)} :root{--paper:url(${paperUrl})}</style></head>
<body class="${bodyCls}">${DEFS}${body}</body></html>`;
}

const browser = await chromium.launch();
try {
  // textura de papel
  const tp = await browser.newPage({ viewport: { width: 1000, height: 1000 } });
  await tp.setContent(`<html><body style="margin:0">${PAPER}</body></html>`);
  const paperPng = path.join(TMP, 'papel.png');
  await tp.screenshot({ path: paperPng });
  await tp.close();
  const paperUrl = pathToFileURL(paperPng).href;

  const all = PAGES.map((fn, i) => fn(i + 1));
  const idx = only ? only.map((n) => n - 1) : all.map((_, i) => i);
  const pages = idx.map((i) => all[i]);

  if (preview) {
    const dir = path.join(OUT, 'preview');
    mkdirSync(dir, { recursive: true });
    const file = path.join(TMP, 'preview.html');
    writeFileSync(file, html(pages, '', paperUrl));
    const pg = await browser.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: Number(opt('scale') || 1) });
    await pg.goto(pathToFileURL(file).href);
    await pg.evaluate(() => document.fonts.ready);
    const secs = await pg.locator('section.page').all();
    for (let k = 0; k < secs.length; k++) {
      const n = String(idx[k] + 1).padStart(2, '0');
      await secs[k].screenshot({ path: path.join(dir, `p${n}.png`) });
    }
    console.log(`prévia: ${secs.length} página(s) em ${dir}`);
  } else {
    // 1ª passada: fundo + ilustrações (sem texto) em alta resolução
    const file1 = path.join(TMP, 'fundo.html');
    writeFileSync(file1, html(pages, 'bgonly', paperUrl));
    const pg = await browser.newPage({ viewport: { width: 1123, height: 794 }, deviceScaleFactor: DPI / 96 });
    await pg.goto(pathToFileURL(file1).href);
    await pg.evaluate(() => document.fonts.ready);
    const secs = await pg.locator('section.page').all();
    const bgs = [];
    for (let k = 0; k < secs.length; k++) {
      const p = path.join(TMP, `fundo-${String(k + 1).padStart(2, '0')}.jpg`);
      await secs[k].screenshot({ path: p, type: 'jpeg', quality: Number(opt('q') || 80) });
      bgs.push(pathToFileURL(p).href);
    }
    await pg.close();
    // 2ª passada: imagem de fundo + texto vetorial -> PDF
    const file2 = path.join(TMP, 'livro.html');
    writeFileSync(file2, html(pages, 'textonly', paperUrl, bgs));
    const pp = await browser.newPage();
    await pp.goto(pathToFileURL(file2).href);
    await pp.evaluate(() => document.fonts.ready);
    const pdf = path.join(OUT, opt('out') || 'A_Turma_dos_Herois_no_Sertao.pdf');
    await pp.pdf({ path: pdf, width: '297mm', height: '210mm', printBackground: true, preferCSSPageSize: true });
    console.log(`PDF: ${pdf}`);
  }
} finally {
  await browser.close();
}
