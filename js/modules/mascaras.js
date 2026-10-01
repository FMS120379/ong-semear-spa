"use strict";

/* Máscaras de entrada: formatam CPF, telefone e CEP enquanto a pessoa digita. */
(function (Semear) {
  function digitos(valor) {
    return valor.replace(/\D/g, "");
  }

  const mascaras = {
    cpf(valor) {
      return digitos(valor).slice(0, 11)
        .replace(/^(\d{3})(\d)/, "$1.$2")
        .replace(/^(\d{3})\.(\d{3})(\d)/, "$1.$2.$3")
        .replace(/\.(\d{3})(\d)/, ".$1-$2");
    },
    telefone(valor) {
      const d = digitos(valor).slice(0, 11);
      if (d.length <= 2) return d ? "(" + d : "";
      if (d.length <= 6) return "(" + d.slice(0, 2) + ") " + d.slice(2);
      if (d.length <= 10) return "(" + d.slice(0, 2) + ") " + d.slice(2, 6) + "-" + d.slice(6);
      return "(" + d.slice(0, 2) + ") " + d.slice(2, 7) + "-" + d.slice(7);
    },
    cep(valor) {
      return digitos(valor).slice(0, 8).replace(/^(\d{5})(\d)/, "$1-$2");
    },
    aplicar(idCampo, funcao) {
      const campo = document.getElementById(idCampo);
      if (!campo) return;
      campo.addEventListener("input", function () {
        campo.value = funcao(campo.value);
      });
    }
  };

  Semear.mascaras = mascaras;
})((window.Semear = window.Semear || {}));
