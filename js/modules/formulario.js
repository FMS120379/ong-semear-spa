"use strict";

/* Formulário de cadastro: máscaras, verificação de consistência em tempo real,
   envio, gravação no localStorage e confirmação. */
(function (Semear) {
  const IDADE_MINIMA = 18;

  /* ---------- Regras de consistência (devolvem "" quando o valor é válido) ---------- */

  function validarCPF(valor) {
    const d = valor.replace(/\D/g, "");
    if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return "CPF inválido: confira os números.";

    function digito(base) {
      let soma = 0;
      for (let i = 0; i < base; i++) soma += Number(d[i]) * (base + 1 - i);
      const resto = (soma * 10) % 11;
      return resto === 10 ? 0 : resto;
    }
    const confere = digito(9) === Number(d[9]) && digito(10) === Number(d[10]);
    return confere ? "" : "CPF inválido: os dígitos verificadores não conferem.";
  }

  function validarNome(valor) {
    const partes = valor.trim().split(/\s+/);
    return partes.length >= 2 && partes.every((p) => p.length >= 2) ? "" : "Informe nome e sobrenome.";
  }

  function validarNascimento(valor) {
    const nascimento = new Date(valor + "T00:00:00");
    const hoje = new Date();
    if (Number.isNaN(nascimento.getTime())) return "Informe uma data de nascimento válida.";
    if (nascimento > hoje) return "A data de nascimento não pode ser no futuro.";
    let idade = hoje.getFullYear() - nascimento.getFullYear();
    const fezAniversario =
      hoje.getMonth() > nascimento.getMonth() ||
      (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() >= nascimento.getDate());
    if (!fezAniversario) idade--;
    if (idade > 120) return "Informe uma data de nascimento válida.";
    return idade >= IDADE_MINIMA ? "" : "É necessário ter " + IDADE_MINIMA + " anos ou mais para se cadastrar.";
  }

  const regras = { nome: validarNome, cpf: validarCPF, nascimento: validarNascimento };

  /* ---------- Verificação e feedback visual ---------- */

  /* Valida um campo, atualiza o texto da mensagem e devolve true se estiver válido.
     O estilo vermelho/verde vem do CSS (:user-invalid e :user-valid). */
  function validarCampo(campo) {
    const aviso = document.getElementById(campo.id + "-erro");
    const padrao = aviso ? (aviso.dataset.padrao = aviso.dataset.padrao || aviso.textContent) : "";
    let mensagem = "";

    campo.setCustomValidity("");
    if (!campo.validity.valid) {
      mensagem = campo.validity.valueMissing ? "Este campo é obrigatório." : padrao || campo.validationMessage;
    } else if (regras[campo.id]) {
      mensagem = regras[campo.id](campo.value);
      if (mensagem) campo.setCustomValidity(mensagem);
    }

    if (aviso) aviso.textContent = mensagem || padrao;
    campo.setAttribute("aria-invalid", mensagem ? "true" : "false");
    return !mensagem;
  }

  /* ---------- Rascunho: o que foi digitado fica guardado até o envio ---------- */

  /* O CPF não entra no rascunho por ser um dado sensível. */
  function salvarRascunho(form) {
    const dados = Object.fromEntries(new FormData(form).entries());
    delete dados.cpf;
    Semear.storage.gravar("rascunho", dados);
  }

  /* Devolve true se havia um rascunho e ele foi colocado de volta nos campos. */
  function restaurarRascunho(form) {
    const rascunho = Semear.storage.ler("rascunho", {});
    let restaurou = false;
    Object.keys(rascunho).forEach(function (nome) {
      const destino = form.elements[nome];
      if (!destino || !rascunho[nome]) return;
      destino.value = rascunho[nome]; /* funciona também para o grupo de radios */
      restaurou = true;
    });
    return restaurou;
  }

  Semear.formulario = {
    iniciar() {
      const form = document.getElementById("form-cadastro");
      if (!form) return;

      Semear.mascaras.aplicar("cpf", Semear.mascaras.cpf);
      Semear.mascaras.aplicar("telefone", Semear.mascaras.telefone);
      Semear.mascaras.aplicar("cep", Semear.mascaras.cep);

      const campos = Array.from(form.elements).filter((c) => c.id && c.type !== "submit");

      /* Restaura o rascunho gravado na visita anterior */
      if (restaurarRascunho(form)) {
        Semear.feedback.toast("Recuperamos o rascunho do seu cadastro.");
      }

      /* Verificação em tempo real (depois da máscara, que foi registrada antes) */
      campos.forEach(function (campo) {
        campo.addEventListener("input", function () { validarCampo(campo); });
        campo.addEventListener("change", function () { validarCampo(campo); });
      });
      form.addEventListener("input", function () { salvarRascunho(form); });
      form.addEventListener("change", function () { salvarRascunho(form); });

      form.addEventListener("submit", function (evento) {
        evento.preventDefault();

        /* Revalida tudo no envio (cobre preenchimento automático do navegador) */
        const invalidos = campos.filter((campo) => !validarCampo(campo));
        if (invalidos.length > 0) {
          form.reportValidity();
          Semear.feedback.toast("Corrija os campos destacados antes de enviar.");
          return;
        }

        const dados = Object.fromEntries(new FormData(form).entries());
        dados.enviadoEm = new Date().toISOString();

        if (!Semear.storage.adicionar("cadastros", dados)) {
          Semear.feedback.toast("Não foi possível salvar os dados neste navegador.");
          return;
        }
        Semear.storage.remover("rascunho");
        document.getElementById("modal-nome").textContent = dados.nome.trim().split(" ")[0];
        Semear.feedback.abrirModal("modal-sucesso");
        form.reset();
        campos.forEach((campo) => campo.removeAttribute("aria-invalid"));
      });
    }
  };

  /* Ao fechar o modal de confirmação, mostra um toast. */
  document.addEventListener("DOMContentLoaded", function () {
    const modal = document.getElementById("modal-sucesso");
    if (modal) {
      modal.addEventListener("close", function () {
        Semear.feedback.toast("Cadastro registrado com sucesso.");
      });
    }
  });
})((window.Semear = window.Semear || {}));
