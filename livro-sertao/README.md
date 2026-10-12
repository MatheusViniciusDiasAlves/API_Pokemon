# A Turma dos Heróis no Sertão — livro infantil em PDF

**A Festa Encantada dos Sabores e dos Sons** · uma história interativa em cordel para a turma do P5.

📕 PDF pronto: [`out/A_Turma_dos_Herois_no_Sertao.pdf`](out/A_Turma_dos_Herois_no_Sertao.pdf) (20 páginas, A4 deitado)

- Ilustrações no estilo de xilogravura de cordel, desenhadas traço a traço em código
  (sem gerador de imagem por IA): sol com rosto, mandacaru, palma, casinha de taipa,
  bandeirinhas, toalha de chita, sanfoneiro com chapéu de couro, sanfona, zabumba,
  triângulo, pandeiro, bolo de fubá, goiabada, pipoca e paçoca.
- Texto da história completo, com os momentos de **Interação** destacados para a professora.
- Última página: **cartões da missão** para recortar e esconder pela sala.

## Gerar de novo

Precisa de Node 18+ e do Playwright com Chromium.

```bash
node build.mjs              # gera out/A_Turma_dos_Herois_no_Sertao.pdf
node build.mjs --preview    # prévias rápidas em out/preview/
```

- `paginas.mjs` — texto e composição de cada página
- `lib/` — desenhos (paisagem, personagens, comidas e instrumentos) e o filtro de xilogravura
- `fonts/` — Rye, Sancreek e IM Fell DW Pica (licença SIL Open Font License)
