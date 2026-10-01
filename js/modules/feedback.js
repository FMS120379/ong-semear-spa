"use strict";

/* Feedback ao usuário: toast (não bloqueia) e modal (<dialog> nativo). */
(function (Semear) {
  let temporizador;

  Semear.feedback = {
    toast(mensagem) {
      const toast = document.getElementById("toast");
      if (!toast) return;
      toast.textContent = mensagem;
      toast.classList.add("visivel");
      clearTimeout(temporizador);
      temporizador = setTimeout(function () {
        toast.classList.remove("visivel");
      }, 4000);
    },
    abrirModal(id) {
      const modal = document.getElementById(id);
      if (modal && typeof modal.showModal === "function") modal.showModal();
    }
  };
})((window.Semear = window.Semear || {}));
