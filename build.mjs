/* Build de produção: gera a pasta dist/ pronta para publicar.
   - JS: junta os módulos na ordem do index.html e minifica (esbuild)
   - CSS: junta reset + style e minifica (esbuild)
   - HTML: remove espaços e comentários (html-minifier-terser)
   - SVG: otimiza as imagens (svgo) */
import { transform } from "esbuild";
import { minify as minificarHtml } from "html-minifier-terser";
import { optimize } from "svgo";
import { readFileSync, writeFileSync, mkdirSync, rmSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
rmSync(DIST, { recursive: true, force: true });
mkdirSync(join(DIST, "assets"), { recursive: true });
mkdirSync(join(DIST, "imagens"), { recursive: true });

let html = readFileSync("html/index.html", "utf8");

/* 1) JavaScript: a ordem dos <script> locais do HTML é a ordem do pacote */
const scriptsLocais = [...html.matchAll(/<script src="\.\.\/(js\/[^"]+)"><\/script>/g)].map((m) => m[1]);
let codigo = scriptsLocais.map((arq) => readFileSync(arq, "utf8")).join("\n;\n");
codigo = codigo.replace('"../imagens/"', '"imagens/"'); /* index.html passa a ficar na raiz de dist/ */
const js = await transform(codigo, { minify: true, target: "es2020", legalComments: "none" });
writeFileSync(join(DIST, "assets/app.min.js"), js.code);

/* 2) CSS */
const css = ["css/reset.css", "css/style.css"].map((a) => readFileSync(a, "utf8")).join("\n");
const cssMin = await transform(css, { loader: "css", minify: true });
writeFileSync(join(DIST, "assets/estilo.min.css"), cssMin.code);

/* 3) HTML: troca os vários <link> e <script> por um arquivo de cada */
html = html
  .replace(/\s*<link rel="stylesheet" href="\.\.\/css\/[^"]+">/g, "")
  .replace("</head>", '  <link rel="stylesheet" href="assets/estilo.min.css">\n</head>')
  .replace(/\s*<script src="\.\.\/js\/[^"]+"><\/script>/g, "")
  .replace("</body>", '  <script src="assets/app.min.js"></script>\n</body>');
const htmlMin = await minificarHtml(html, {
  collapseWhitespace: true, removeComments: true, conservativeCollapse: false,
  removeRedundantAttributes: true, minifyCSS: false, minifyJS: false
});
writeFileSync(join(DIST, "index.html"), htmlMin);

/* 4) Imagens SVG */
for (const arq of readdirSync("imagens")) {
  const origem = readFileSync(join("imagens", arq), "utf8");
  const otimizado = optimize(origem, { multipass: true, plugins: ["preset-default"] });
  /* mantém role/aria-label (acessibilidade): o preset não os remove */
  writeFileSync(join(DIST, "imagens", arq), otimizado.data);
}

/* Relatório de tamanhos */
const tam = (c) => statSync(c).size;
const antes = {
  js: scriptsLocais.reduce((s, a) => s + tam(a), 0),
  css: tam("css/reset.css") + tam("css/style.css"),
  html: tam("html/index.html"),
  svg: readdirSync("imagens").reduce((s, a) => s + tam(join("imagens", a)), 0)
};
const depois = {
  js: tam(join(DIST, "assets/app.min.js")),
  css: tam(join(DIST, "assets/estilo.min.css")),
  html: tam(join(DIST, "index.html")),
  svg: readdirSync(join(DIST, "imagens")).reduce((s, a) => s + tam(join(DIST, "imagens", a)), 0)
};
for (const k of Object.keys(antes)) {
  console.log(k.padEnd(5), String(antes[k]).padStart(6), "->", String(depois[k]).padStart(6), "bytes", `(-${(100 - (depois[k] / antes[k]) * 100).toFixed(1)}%)`);
}
const totalA = Object.values(antes).reduce((a, b) => a + b, 0);
const totalD = Object.values(depois).reduce((a, b) => a + b, 0);
console.log("TOTAL", totalA, "->", totalD, `(-${(100 - (totalD / totalA) * 100).toFixed(1)}%)`);
