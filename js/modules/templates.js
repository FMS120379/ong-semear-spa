"use strict";

/* Templates dinâmicos: cada função recebe dados e devolve HTML.
   Os componentes (cartão, badge, campo) são reaproveitados nas telas. */
(function (Semear) {
  const IMAGENS = "../imagens/";

  /* Dados digitados pelo usuário nunca entram como HTML: os caracteres especiais são escapados. */
  function escapar(texto) {
    return String(texto).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  }

  const TIPOS = { doador: "Doador(a)", voluntario: "Voluntário(a)" };

  function badge(b) {
    return `<li><span class="badge badge-${b.tipo}">${b.texto}</span></li>`;
  }

  function cartaoSimples(item, classes) {
    return `
      <article class="card ${classes}">
        <h3>${item.titulo}</h3>
        <p>${item.texto}</p>
      </article>`;
  }

  function cartaoProjeto(p) {
    return `
      <article class="project grid-12" aria-labelledby="proj-${p.id}">
        <figure class="col-md-4">
          <img src="${IMAGENS}${p.imagem}" alt="${p.alt}" width="320" height="200">
          <figcaption>${p.legenda}</figcaption>
        </figure>
        <div class="col-md-8">
          <h3 id="proj-${p.id}">${p.titulo}</h3>
          <ul class="badges" aria-label="Situação do projeto">${p.badges.map(badge).join("")}</ul>
          <p>${p.descricao}</p>
          <ul>
            <li><strong>Público:</strong> ${p.publico}</li>
            <li><strong>Horário:</strong> ${p.horario}</li>
            <li><strong>Precisamos de:</strong> ${p.necessidades}</li>
          </ul>
        </div>
      </article>`;
  }

  /* Campo de formulário reutilizável: rótulo, input e mensagem de erro. */
  function campo(c) {
    const atributos = c.atributos || "";
    const erro = c.erro ? `<span class="msg-erro" id="${c.id}-erro">${c.erro}</span>` : "";
    const descrito = c.erro ? ` aria-describedby="${c.id}-erro"` : "";
    return `
      <p>
        <label for="${c.id}">${c.rotulo}${c.obrigatorio ? " *" : ""}</label>
        <input type="${c.tipo}" id="${c.id}" name="${c.id}"${c.obrigatorio ? " required" : ""}${descrito} ${atributos}>
        ${erro}
      </p>`;
  }

  Semear.templates = {
    home() {
      const d = Semear.dados;
      return `
        <section class="hero" aria-labelledby="titulo-hero">
          <div class="container">
            <h1 id="titulo-hero">Semeando oportunidades, colhendo dignidade</h1>
            <p class="lead">Há 12 anos combatemos a insegurança alimentar e ampliamos o acesso à educação em comunidades de São Paulo.</p>
            <p><a class="btn" href="#/cadastro">Quero participar</a></p>
          </div>
        </section>

        <section class="container section" aria-labelledby="titulo-sobre">
          <h2 id="titulo-sobre">Quem somos</h2>
          <p>A ONG Semear é uma organização sem fins lucrativos que une voluntários e doadores para levar alimento, reforço escolar e formação profissional a quem mais precisa.</p>
          <img src="${IMAGENS}equipe-voluntarios.svg" alt="Voluntários da ONG Semear preparando refeições na cozinha solidária" width="600" height="400">
          <div class="grid-12">${d.missao.map((i) => cartaoSimples(i, "col-sm-6 col-lg-4")).join("")}</div>
        </section>

        <section class="section section-alt" aria-labelledby="titulo-servicos">
          <div class="container">
            <h2 id="titulo-servicos">Nossos serviços sociais</h2>
            <div class="grid-12">${d.servicos.map((i) => cartaoSimples(i, "col-sm-6 col-lg-4")).join("")}</div>
            <p><a class="btn btn-outline" href="#/projetos">Conheça todos os projetos</a></p>
          </div>
        </section>

        <section class="container section" aria-labelledby="titulo-numeros">
          <h2 id="titulo-numeros">Nosso impacto em números</h2>
          <dl class="stats grid-12">
            ${d.numeros.map((n) => `<div class="col-sm-4"><dt>${n.rotulo}</dt><dd>${n.valor}</dd></div>`).join("")}
          </dl>
        </section>`;
    },

    projetos(lista) {
      return `
        <section class="hero hero-small" aria-labelledby="titulo-projetos">
          <div class="container">
            <h1 id="titulo-projetos">Projetos sociais</h1>
            <p class="lead">Iniciativas que transformam a vida de famílias e comunidades. Todas contam com o apoio de doadores e voluntários.</p>
          </div>
        </section>

        <div class="container grid-12">
          <section class="section col-lg-8" aria-labelledby="titulo-lista">
            <h2 id="titulo-lista">Iniciativas solidárias</h2>
            ${lista.map(cartaoProjeto).join("")}
          </section>
          <aside class="aside col-lg-4" aria-labelledby="titulo-aside">
            <h2 id="titulo-aside">Como ajudar</h2>
            <p>Você pode contribuir com doações financeiras, alimentos ou com o seu tempo como voluntário(a).</p>
            <p><a class="btn" href="#/cadastro">Fazer meu cadastro</a></p>
          </aside>
        </div>`;
    },

    cadastro() {
      const estados = Semear.dados.estados.map((uf) => `<option value="${uf}">${uf}</option>`).join("");
      return `
        <section class="hero hero-small" aria-labelledby="titulo-cadastro">
          <div class="container">
            <h1 id="titulo-cadastro">Cadastro de doadores e voluntários</h1>
            <p class="lead">Preencha o formulário para fazer parte da ONG Semear. Campos com asterisco (*) são obrigatórios.</p>
          </div>
        </section>

        <div class="container section">
          <p class="alerta alerta-info" role="note">Seus dados são usados apenas para o contato da ONG Semear e não são compartilhados.</p>

          <form id="form-cadastro" action="#" method="post">
            <fieldset>
              <legend>Dados pessoais</legend>
              ${campo({ id: "nome", rotulo: "Nome completo", tipo: "text", obrigatorio: true, atributos: 'minlength="3" autocomplete="name"', erro: "Informe nome e sobrenome." })}
              ${campo({ id: "email", rotulo: "E-mail", tipo: "email", obrigatorio: true, atributos: 'autocomplete="email"', erro: "Informe um e-mail válido, como nome@exemplo.com." })}
              ${campo({ id: "telefone", rotulo: "Telefone", tipo: "tel", obrigatorio: true, atributos: 'maxlength="15" placeholder="(00) 00000-0000" pattern="\\(\\d{2}\\) \\d{4,5}-\\d{4}" title="Formato: (00) 00000-0000" autocomplete="tel"', erro: "Use o formato (00) 00000-0000." })}
              ${campo({ id: "cpf", rotulo: "CPF", tipo: "text", obrigatorio: true, atributos: 'inputmode="numeric" maxlength="14" placeholder="000.000.000-00" pattern="\\d{3}\\.\\d{3}\\.\\d{3}-\\d{2}" title="Formato: 000.000.000-00"', erro: "Use o formato 000.000.000-00." })}
              ${campo({ id: "nascimento", rotulo: "Data de nascimento", tipo: "date", obrigatorio: true, erro: "Informe uma data de nascimento válida." })}
            </fieldset>

            <fieldset>
              <legend>Endereço</legend>
              ${campo({ id: "cep", rotulo: "CEP", tipo: "text", obrigatorio: true, atributos: 'inputmode="numeric" maxlength="9" placeholder="00000-000" pattern="\\d{5}-\\d{3}" title="Formato: 00000-000" autocomplete="postal-code"', erro: "Use o formato 00000-000." })}
              ${campo({ id: "rua", rotulo: "Rua", tipo: "text", obrigatorio: true, atributos: 'autocomplete="address-line1"' })}
              ${campo({ id: "numero", rotulo: "Número", tipo: "text", obrigatorio: true, atributos: 'maxlength="10"' })}
              ${campo({ id: "cidade", rotulo: "Cidade", tipo: "text", obrigatorio: true, atributos: 'autocomplete="address-level2"' })}
              <p>
                <label for="estado">Estado *</label>
                <select id="estado" name="estado" required autocomplete="address-level1">
                  <option value="">Selecione</option>
                  ${estados}
                </select>
              </p>
            </fieldset>

            <fieldset>
              <legend>Como deseja participar</legend>
              <fieldset class="inner-fieldset">
                <legend>Tipo de cadastro *</legend>
                <p>
                  <input type="radio" id="tipo-doador" name="tipo" value="doador" required>
                  <label for="tipo-doador">Doador(a)</label>
                </p>
                <p>
                  <input type="radio" id="tipo-voluntario" name="tipo" value="voluntario">
                  <label for="tipo-voluntario">Voluntário(a)</label>
                </p>
              </fieldset>
              <p>
                <label for="mensagem">Mensagem (opcional)</label>
                <textarea id="mensagem" name="mensagem" rows="4" maxlength="500"></textarea>
              </p>
            </fieldset>

            <p><button type="submit" class="btn">Enviar cadastro</button></p>
          </form>
        </div>`;
    },

    salvos(lista) {
      const itens = lista.map(function (c) {
        const quando = new Date(c.enviadoEm);
        return `
          <li class="card col-sm-6 col-lg-4">
            <h3>${escapar(c.nome)}</h3>
            <p><span class="badge badge-info">${TIPOS[c.tipo] || "Cadastro"}</span></p>
            <p>${escapar(c.cidade)}/${escapar(c.estado)}</p>
            <p><small>Enviado em <time datetime="${quando.toISOString()}">${quando.toLocaleString("pt-BR")}</time></small></p>
          </li>`;
      }).join("");

      return `
        <section class="hero hero-small" aria-labelledby="titulo-salvos">
          <div class="container">
            <h1 id="titulo-salvos">Cadastros salvos</h1>
            <p class="lead">Cadastros guardados neste navegador (localStorage).</p>
          </div>
        </section>

        <div class="container section">
          ${lista.length === 0
            ? '<p class="alerta alerta-info" role="note">Nenhum cadastro salvo neste navegador ainda.</p>'
            : `<section aria-labelledby="titulo-grafico">
                 <h2 id="titulo-grafico">Perfil dos cadastros</h2>
                 <div class="grafico"><canvas id="grafico-tipos" role="img" aria-label="Gráfico de rosca com a quantidade de doadores e de voluntários cadastrados"></canvas></div>
                 <p id="grafico-resumo"></p>
               </section>
               <h2>Cadastros</h2>
               <ul class="grid-12">${itens}</ul>
               <p><button type="button" class="btn btn-outline" id="limpar-cadastros">Apagar cadastros salvos</button></p>`}
        </div>`;
    },

    naoEncontrada() {
      return `
        <section class="container section" aria-labelledby="titulo-404">
          <h1 id="titulo-404">Página não encontrada</h1>
          <p>O endereço que você acessou não existe nesta plataforma.</p>
          <p><a class="btn" href="#/">Voltar ao início</a></p>
        </section>`;
    }
  };
})((window.Semear = window.Semear || {}));
