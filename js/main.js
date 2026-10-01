"use strict";

/* Ponto de entrada: inicia os módulos quando a página termina de carregar. */
document.addEventListener("DOMContentLoaded", function () {
  Semear.tema.iniciar();
  Semear.menu.iniciar();
  Semear.router.iniciar();
});
