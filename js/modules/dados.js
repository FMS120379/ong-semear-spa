"use strict";

/* Dados do site: o conteúdo fica separado da marcação (templates.js). */
(function (Semear) {
  Semear.dados = {
    missao: [
      { titulo: "Missão", texto: "Garantir alimentação digna e educação de qualidade para famílias em situação de vulnerabilidade." },
      { titulo: "Visão", texto: "Ser referência em transformação social por meio da participação ativa da comunidade." },
      { titulo: "Valores", texto: "Transparência, respeito, solidariedade e compromisso com resultados." }
    ],
    servicos: [
      { titulo: "Cozinha solidária", texto: "Refeições diárias para mais de 300 pessoas." },
      { titulo: "Reforço escolar", texto: "Aulas de apoio para crianças e adolescentes." },
      { titulo: "Capacitação profissional", texto: "Cursos gratuitos para jovens e adultos." }
    ],
    numeros: [
      { rotulo: "Famílias atendidas", valor: "1.200" },
      { rotulo: "Refeições servidas por mês", valor: "9.500" },
      { rotulo: "Voluntários ativos", valor: "180" }
    ],
    projetos: [
      {
        id: "cozinha",
        titulo: "Cozinha solidária",
        descricao: "Oferece almoço gratuito de segunda a sexta para mais de 300 pessoas em situação de vulnerabilidade.",
        imagem: "cozinha-solidaria.svg",
        alt: "Ilustração de uma panela com refeição sendo servida em um prato",
        legenda: "Refeições preparadas todos os dias pela equipe de voluntários.",
        publico: "famílias e pessoas em situação de rua",
        horario: "11h30 às 14h",
        necessidades: "doações de alimentos e voluntários na cozinha",
        badges: [{ tipo: "sucesso", texto: "Em andamento" }, { tipo: "aviso", texto: "Precisa de doações" }]
      },
      {
        id: "reforco",
        titulo: "Reforço escolar",
        descricao: "Acompanhamento pedagógico para crianças e adolescentes, com foco em leitura, escrita e raciocínio lógico.",
        imagem: "reforco-escolar.svg",
        alt: "Ilustração de um livro aberto ao lado de um lápis",
        legenda: "Aulas de apoio em português e matemática.",
        publico: "estudantes de 6 a 16 anos",
        horario: "terças e quintas, das 14h às 17h",
        necessidades: "voluntários com afinidade por ensino",
        badges: [{ tipo: "sucesso", texto: "Em andamento" }, { tipo: "info", texto: "Precisa de voluntários" }]
      },
      {
        id: "capacitacao",
        titulo: "Capacitação profissional",
        descricao: "Cursos gratuitos que preparam jovens e adultos para o mercado de trabalho, com apoio na elaboração de currículo.",
        imagem: "capacitacao.svg",
        alt: "Ilustração de um computador com um certificado na tela",
        legenda: "Cursos de informática básica e empregabilidade.",
        publico: "jovens e adultos a partir de 16 anos",
        horario: "sábados, das 9h às 12h",
        necessidades: "instrutores e doação de computadores",
        badges: [{ tipo: "erro", texto: "Turma lotada" }, { tipo: "info", texto: "Precisa de instrutores" }]
      }
    ],
    estados: ["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"]
  };
})((window.Semear = window.Semear || {}));
