"use strict";

/* Menu hambúrguer: abre e fecha a lista de links no mobile. */
(function (Semear) {
  Semear.menu = {
    iniciar() {
      document.documentElement.classList.add("js");

      const botao = document.querySelector(".menu-toggle");
      const lista = document.getElementById("menu-principal");
      const desktop = window.matchMedia("(min-width: 768px)");
      if (!botao || !lista) return;

      function definir(aberto) {
        lista.classList.toggle("aberto", aberto);
        botao.setAttribute("aria-expanded", String(aberto));
        botao.setAttribute("aria-label", aberto ? "Fechar menu" : "Abrir menu");
      }

      botao.addEventListener("click", function () {
        definir(!lista.classList.contains("aberto"));
      });
      /* Navegar para outra tela fecha o menu */
      lista.addEventListener("click", function (evento) {
        if (evento.target.closest("a")) definir(false);
      });
      document.addEventListener("keydown", function (evento) {
        if (evento.key === "Escape" && lista.classList.contains("aberto")) {
          definir(false);
          botao.focus();
        }
      });
      desktop.addEventListener("change", function (evento) {
        if (evento.matches) definir(false);
      });
    }
  };
})((window.Semear = window.Semear || {}));
