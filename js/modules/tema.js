"use strict";

/* Tema claro/escuro. Sem escolha salva, vale a preferência do sistema
   (prefers-color-scheme); o botão do rodapé guarda a escolha no localStorage. */
(function (Semear) {
  const CHAVE = "semear:tema";
  const raiz = document.documentElement;
  const sistemaEscuro = window.matchMedia("(prefers-color-scheme: dark)");

  function lerSalvo() {
    try { return localStorage.getItem(CHAVE); } catch (e) { return null; }
  }

  function temaAtual() {
    return raiz.dataset.tema || (sistemaEscuro.matches ? "escuro" : "claro");
  }

  function aplicar(tema) {
    raiz.dataset.tema = tema;
    const botao = document.getElementById("alternar-tema");
    if (botao) {
      botao.setAttribute("aria-pressed", String(tema === "escuro"));
      botao.textContent = tema === "escuro" ? "Usar tema claro" : "Usar tema escuro";
    }
    /* O gráfico lê as cores do CSS: redesenha para acompanhar o tema */
    if (Semear.grafico && document.getElementById("grafico-tipos")) {
      Semear.grafico.desenhar(Semear.storage.ler("cadastros", []));
    }
  }

  /* Aplica a escolha salva antes de desenhar a tela, evitando o "piscar" */
  const salvo = lerSalvo();
  if (salvo === "claro" || salvo === "escuro") raiz.dataset.tema = salvo;

  Semear.tema = {
    iniciar() {
      const botao = document.getElementById("alternar-tema");
      if (!botao) return;
      aplicar(temaAtual());
      botao.addEventListener("click", function () {
        const novo = temaAtual() === "escuro" ? "claro" : "escuro";
        aplicar(novo);
        try { localStorage.setItem(CHAVE, novo); } catch (e) { /* sem armazenamento: vale só nesta visita */ }
      });
    }
  };
})((window.Semear = window.Semear || {}));
