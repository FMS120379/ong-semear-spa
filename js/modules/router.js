"use strict";

/* Roteador SPA: usa o hash da URL (#/projetos) para trocar a tela
   dentro de #app, sem recarregar a página. */
(function (Semear) {
  const TITULO_BASE = "ONG Semear";

  const rotas = {
    "": { titulo: "Início", renderizar: () => Semear.templates.home() },
    projetos: { titulo: "Projetos sociais", renderizar: () => Semear.templates.projetos(Semear.dados.projetos) },
    cadastros: {
      titulo: "Cadastros salvos",
      renderizar: () => Semear.templates.salvos(Semear.storage.ler("cadastros", [])),
      aoCarregar: () => Semear.cadastros.iniciar()
    },
    cadastro: {
      titulo: "Cadastro",
      renderizar: () => Semear.templates.cadastro(),
      aoCarregar: () => Semear.formulario.iniciar()
    }
  };

  function lerRota() {
    const partes = location.hash.replace(/^#\/?/, "").split("/");
    return { nome: partes[0] || "", parametro: partes[1] };
  }

  function marcarMenu(nome) {
    document.querySelectorAll("[data-rota]").forEach(function (link) {
      if (link.dataset.rota === nome) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  }

  function mostrar() {
    const app = document.getElementById("app");
    const { nome, parametro } = lerRota();
    const rota = rotas[nome];

    app.innerHTML = rota ? rota.renderizar() : Semear.templates.naoEncontrada();
    document.title = (rota ? rota.titulo : "Página não encontrada") + " | " + TITULO_BASE;
    marcarMenu(rota ? nome : null);
    if (rota && rota.aoCarregar) rota.aoCarregar();

    const alvo = parametro && document.getElementById("proj-" + parametro);
    if (alvo) {
      alvo.scrollIntoView();
    } else {
      window.scrollTo(0, 0);
    }
    /* Leva o foco ao conteúdo para leitores de tela perceberem a troca de tela */
    document.getElementById("conteudo").focus({ preventScroll: true });
  }

  Semear.router = {
    atualizar: mostrar,
    iniciar() {
      window.addEventListener("hashchange", mostrar);
      mostrar();
    }
  };
})((window.Semear = window.Semear || {}));
