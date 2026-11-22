import type { AboutContent } from "../types";

export const mockAboutContent = {
  hero: {
    eyebrow: "// SOBRE O CAFÉ DEBUG",
    heading: "Café Debug é um podcast dedicado ao universo da ciência e tecnologia.",
    description:
      "Desde sua fundação em 2017, o programa tem se destacado por trazer especialistas do setor para discutir uma ampla variedade de tópicos, incluindo desenvolvimento de software, ferramentas tecnológicas, conceitos avançados de arquitetura de software, trajetórias profissionais na tecnologia e na ciência, e muito mais. Junte-se a nós para explorar as últimas tendências e inovações que moldam nosso mundo. Apresentado e criado por Jéssica Nathany.",
    metrics: [
      { value: "200+", label: "episódios publicados" },
      { value: "9 anos", label: "compartilhando conhecimento sobre ciência e tecnologia" }
    ]
  },
  mission: {
    eyebrow: "// PROPÓSITO",
    title: "Por que existimos",
    paragraphs: [
      "Acreditamos que crescer na carreira de tecnologia não deveria depender de sorte ou de estar no lugar certo. Nossa missão é democratizar o conhecimento e as conversas honestas que normalmente só acontecem entre quem já está dentro.",
      "Cada episódio é uma porta aberta: para a pessoa iniciante que quer entender o mercado, para a sênior que busca novas perspectivas, e para toda a comunidade que aprende junto."
    ],
    values: [
      {
        id: "real-conversations",
        icon: "mic",
        title: "temas técnicos e não técnicos",
        description: "Trazemos temas técnicos e não técnicos de forma acessível para todos."
      },
      {
        id: "community-first",
        icon: "users",
        title: "Pense cientificamente",
        description: "Abordamos temas científicos com base em pesquisas, dados e evidências, incentivando a curiosidade e o pensamento crítico."
      },
      {
        id: "open-access",
        icon: "heart",
        title: "Comunidade",
        description: "A comunidade do Café Debug é acolhedora, colaborativa e aberta a todos que desejam aprender e compartilhar conhecimento."
      },
      {
        id: "career-without-hype",
        icon: "compass",
        title: "Carreira",
        description: "Divulgação de vagas e oportunidades para a comunidade de tecnologia."
      }
    ]
  },
  journey: {
    eyebrow: "// A JORNADA",
    title: "Uma ideia que surgiu na comunidade técnica",
    milestones: [
      {
        id: "2017",
        year: "2017",
        title: "O primeiro episódio",
        description: "O primeiro episódio lançado ao público foi uma entrevista com José Carlos Macoratti, uma das maiores referências em tecnologia .NET no Brasil. A partir daí, muitas referências técnicas participaram de outros episódios."
      },
      {
        id: "2021",
        year: "2021",
        title: "A comunidade nasce",
        description: "Criamos o servidor no Discord para responder aos ouvintes. Em três meses, 1.000 pessoas já trocavam vagas e dúvidas."
      },
      {
        id: "2022",
        year: "2022",
        title: "Mais de 100 episódios publicados",
        description: "Novos episódios em formato de série abordando assuntos relacionados à ciência e à pesquisa, além de empreendedorismo e tecnologia. Também publicamos programas gravados em inglês para o público internacional."
      },
      {
        id: "2026",
        year: "2026",
        title: "Café Debug 2.0",
        description: "Nova plataforma, com o intuito de expandir a comunidade, divulgar projetos e oferecer mais recursos para os membros."
      }
    ]
  }
} as const satisfies AboutContent;
