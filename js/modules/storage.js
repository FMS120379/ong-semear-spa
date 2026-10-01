"use strict";

/* Armazenamento local: grava e recupera dados no localStorage.
   Os valores são convertidos para texto com JSON.stringify ao gravar
   e de volta para objeto/array com JSON.parse ao ler. */
(function (Semear) {
  const PREFIXO = "semear:";

  Semear.storage = {
    ler(chave, padrao = []) {
      try {
        const bruto = localStorage.getItem(PREFIXO + chave);
        return bruto === null ? padrao : JSON.parse(bruto);
      } catch (erro) {
        return padrao; /* dado corrompido ou armazenamento bloqueado */
      }
    },
    gravar(chave, valor) {
      try {
        localStorage.setItem(PREFIXO + chave, JSON.stringify(valor));
        return true;
      } catch (erro) {
        return false; /* cota cheia ou modo privado */
      }
    },
    adicionar(chave, item) {
      const lista = this.ler(chave, []);
      lista.push(item);
      return this.gravar(chave, lista);
    },
    remover(chave) {
      try {
        localStorage.removeItem(PREFIXO + chave);
      } catch (erro) { /* sem ação */ }
    }
  };
})((window.Semear = window.Semear || {}));
