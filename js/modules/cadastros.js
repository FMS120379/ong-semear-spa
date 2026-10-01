"use strict";

/* Tela "Cadastros salvos": lê a lista do localStorage e permite apagá-la. */
(function (Semear) {
  Semear.cadastros = {
    iniciar() {
      Semear.grafico.desenhar(Semear.storage.ler("cadastros", []));

      const botao = document.getElementById("limpar-cadastros");
      if (!botao) return;
      botao.addEventListener("click", function () {
        Semear.storage.remover("cadastros");
        Semear.feedback.toast("Cadastros apagados deste navegador.");
        Semear.router.atualizar();
      });
    }
  };
})((window.Semear = window.Semear || {}));
