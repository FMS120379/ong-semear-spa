"use strict";

/* Gráfico de cadastros por tipo, desenhado com a biblioteca Chart.js (carregada por CDN).
   Se a biblioteca não carregar (sem internet), a tela continua funcionando com o resumo em texto. */
(function (Semear) {
  let grafico = null;

  function cor(variavel) {
    return getComputedStyle(document.documentElement).getPropertyValue(variavel).trim();
  }

  Semear.grafico = {
    desenhar(lista) {
      const doadores = lista.filter((c) => c.tipo === "doador").length;
      const voluntarios = lista.filter((c) => c.tipo === "voluntario").length;

      /* Resumo em texto: alternativa acessível e plano B sem a biblioteca */
      const resumo = document.getElementById("grafico-resumo");
      if (resumo) resumo.textContent = "Doadores: " + doadores + " · Voluntários: " + voluntarios;

      const canvas = document.getElementById("grafico-tipos");
      if (!canvas) return;

      /* A biblioteca externa pode estar indisponível: esconde o gráfico e mantém o resumo */
      if (typeof window.Chart === "undefined") {
        canvas.hidden = true;
        return;
      }

      if (grafico) grafico.destroy(); /* evita sobrepor gráficos ao refazer a tela */
      grafico = new window.Chart(canvas, {
        type: "doughnut",
        data: {
          labels: ["Doadores", "Voluntários"],
          datasets: [{
            data: [doadores, voluntarios],
            backgroundColor: [cor("--cor-secundaria"), cor("--cor-primaria")],
            borderColor: cor("--cor-branca"),
            borderWidth: 2
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          animation: !window.matchMedia("(prefers-reduced-motion: reduce)").matches,
          plugins: { legend: { position: "bottom", labels: { font: { size: 14 } } } }
        }
      });
    }
  };
})((window.Semear = window.Semear || {}));
