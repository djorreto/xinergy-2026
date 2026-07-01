export const brand = {
  name: "Xinergy",
  tagline: "Executamos eficiências com impacto real.",
  claim: "#Fitness for business",
  strongPhrase: {
    emphasis: "Compartilhamos riscos",
    body: "medimos e somos seus parceiros na implementação e execução.",
  },
  pitchLine:
    "Compartilhamos riscos, medimos e somos seus parceiros na implementação e execução.",
  promise:
    "Implementamos e executamos eficiências que aparecem em economias, EBITDA e caixa. Compartilhamos riscos, medimos e somos seus parceiros na implementação e execução.",
  heroSubline:
    "Execução · Strategic Sourcing · BPO · Cash management · Procuretech",
  cta: "Vamos conversar",
  email: "contacto@xinergy.cl",
  careersEmail: "seleccion@xinergy.cl",
  address:
    "Av. Andrés Bello 2457, piso 16, Of. 1603, Providencia, Santiago, Chile",
  phone: "+56 2 1234 5678",
  linkedin: "https://cl.linkedin.com/company/xinergy-latam",
  mondayFormUrl:
    "https://forms.monday.com/forms/embed/f9158027a499677bf868b39393bd5019?r=use1",
} as const;

/** Destinatários do diagnóstico de economia (calculadora). */
export const leadNotifyEmails = [
  "diego.jorreto@xinergy.cl",
  "roberto.uauy@xinergy.cl",
  "contacto@xinergy.cl",
] as const;

/** Por quê / O quê / Como — marco de mensagem */
export const messaging = {
  why: {
    title: "Por quê",
    intro: "Entendemos sua operação antes de mover a agulha.",
    points: [
      "Assessment e diagnóstico do cliente.",
      "Melhoria de processos e fluxos operacionais.",
      "Cultura e capacidades da equipe interna.",
      "Priorização com impacto em EBITDA e caixa.",
      "Equipe e cultura prontas para sustentar a mudança.",
    ],
  },
  what: {
    title: "O que fazemos",
    intro:
      "Transformamos operação e suprimentos de ponta a ponta — design, implementação e execução em campo, com impacto em economia, EBITDA e caixa.",
    points: [
      "Eficiências por meio de abastecimento estratégico.",
      "BPO de áreas de compras e gestão de contratos.",
      "Soluções de cash management e supply chain finance.",
      "Tecnologia, Procuretech e habilitação digital.",
      "Economias, melhoria de EBITDA e liberação de caixa.",
    ],
  },
  how: {
    title: "Como fazemos",
    intro: "Do planejamento à execução com impacto real.",
    points: [
      "VRO para acompanhamento de implementação e captura de valor.",
      "Change management e gestão da mudança.",
      "Implementação em campo e capacitações.",
      "Sourcing coach e transferência para a equipe interna.",
      "Compartilhamos riscos — incentivos alinhados a resultados.",
    ],
  },
} as const;

/** Linhas de execução — o que fazemos */
export const capabilities = [
  {
    title: "Eficiências & Otimização de processos",
    description:
      "Assessment, melhoria de processos e cultura operacional com foco em impacto mensurável.",
    href: "/servicios/eficiencias-optimizacion",
  },
  {
    title: "Transformação de Suprimentos",
    description:
      "Redesenho do modelo de suprimentos: governança, operating model e habilitação da área.",
    href: "/servicios/transformacion-abastecimiento",
  },
  {
    title: "Strategic Sourcing",
    description:
      "Execução de projetos de sourcing e negociação com impacto em P&L, EBITDA e caixa.",
    href: "/servicios/abastecimiento-estrategico",
  },
  {
    title: "Business process outsourcing (BPO) / Terceirização de Compras",
    description:
      "Operamos compras e contratos com SLAs, rastreabilidade e melhoria contínua.",
    href: "/servicios/bpo-abastecimiento",
  },
  {
    title: "Digitalização, Automação & Agentização",
    description:
      "Procuretech, automação e agentes que aceleram a operação e a adoção.",
    href: "/servicios/cadena-suministro-digital",
  },
  {
    title: "Implementação de Eficiências",
    description:
      "Value Realization Office (VRO), change management e implementação em campo até capturar valor em P&L e caixa.",
    href: "/servicios/implementacion-eficiencias",
  },
  {
    title: "Working Capital Solutions",
    description:
      "Diagnóstico quantitativo, design de programa DPO/AP, SCF multibanco e negociação de contratos — com parceiros Calculum e Monkey.",
    href: "/servicios/working-capital-solutions",
  },
] as const;

/** Presença em 6 países */
export const presenceCountries = [
  "Chile",
  "Brasil",
  "Peru",
  "Colômbia",
  "México",
  "Estados Unidos",
] as const;

/** Escritórios próprios */
export const officeCountries = [
  "Chile",
  "Brasil",
  "México",
  "Colômbia",
] as const;

export const presenceLabel = presenceCountries.join(" · ");
export const officesLabel = officeCountries.join(" · ");

/** @deprecated use presenceLabel — alias for compat */
export const regions = presenceCountries;
export const regionsLabel = presenceLabel;

export const problemSection = {
  title: "Quando o gasto não aparece, a eficiência se perde.",
  intro:
    "Muitas empresas compram sem uma visão clara do gasto total. Isso pressiona a margem e deixa a equipe de compras apagando incêndios.",
  stats: [
    { value: "4–8%", label: "de eficiência típica no primeiro ano, conforme o setor." },
    { value: "100%", label: "do nosso modelo ligado a economias reais." },
  ],
  opportunity: "A oportunidade: melhorar o negócio sem tirar caixa do seu bolso.",
} as const;

/** Copy simplificado para a home (menos densidade, linguagem clara) */
export const home = {
  capabilities: {
    title: "O que fazemos",
    headline: "Executamos e implementamos eficiências.",
    intro: "Em projetos, operação e tecnologia — com impacto em P&L, EBITDA e caixa.",
  },
  framework: {
    title: "Como geramos impacto",
    headline: "Por quê, o quê e como fazemos.",
    intro:
      "Compartilhamos riscos, medimos e somos seus parceiros na implementação e execução.",
  },
  services: {
    title: "Seis linhas de execução",
    intro: "Escolha uma ou combine conforme o seu momento.",
  },
  industries: {
    title: "Setores onde entregamos",
    intro: "Presença em 6 países, com escritórios no Chile, Brasil, México e Colômbia.",
  },
  cases: {
    label: "Casos de sucesso",
    title: "Resultados que falam.",
    intro:
      "Desafio, abordagem e resultados verificáveis em varejo, seguros, automotivo e mais.",
  },
  cta: {
    eyebrow: "Próximo passo",
    title: "Quando conversamos?",
    intro: "Estime oportunidades em minutos. Compartilhamos riscos desde o primeiro passo.",
  },
  chartBand: {
    title: "Como são os resultados com a Xinergy?",
  },
} as const;

export const processSteps = [
  {
    step: "01",
    title: "Assessment",
    description:
      "Diagnóstico de maturidade, processos e cultura — com priorização de impacto em EBIT e capital de giro.",
  },
  {
    step: "02",
    title: "Design",
    description:
      "Estratégia operacional, governança e roadmap de execução alinhados ao negócio.",
  },
  {
    step: "03",
    title: "Execução",
    description:
      "Sourcing, BPO, cash management, tecnologia e implementação conforme a operação exige.",
  },
  {
    step: "04",
    title: "VRO & tracking",
    description:
      "Acompanhamento de implementação, change management e captura de valor até o fechamento em P&L.",
  },
  {
    step: "05",
    title: "Escala",
    description:
      "Playbooks replicáveis, sourcing coach e capacidades internas para a próxima onda.",
  },
] as const;

export type FAQ = { q: string; a: string };

export const faqs: FAQ[] = [
  {
    q: "O que significa «cash neutral»?",
    a: "Compartilhamos riscos: o programa é financiado pela economia gerada. Você não desembolsa honorários líquidos — nosso modelo está ligado a eficiências verificáveis em P&L.",
  },
  {
    q: "Em quais setores vocês atuam?",
    a: "Varejo, seguros e financeiro, automotivo, energia e recursos, saúde e manufatura — com presença em 6 países e escritórios no Chile, Brasil, México e Colômbia.",
  },
  {
    q: "Vocês só assessoram ou também executam?",
    a: "Executamos e implementamos de ponta a ponta — somos seus parceiros na execução: assessment, design, sourcing, BPO, cash management, plataformas (GEP, SAP Ariba, Jaggaer) e VRO para captura de valor.",
  },
  {
    q: "Quanto tempo leva para ver resultados?",
    a: "Depende do spend e da maturidade. O diagnóstico leva dias; as primeiras alavancas de economia costumam ser ativadas em semanas com quick wins priorizados.",
  },
  {
    q: "O que preciso para a calculadora de eficiências?",
    a: "Setor, gasto com fornecedores e cinco perguntas de maturidade. Informe seu e-mail para ver o intervalo de eficiência potencial em ~2 minutos.",
  },
  {
    q: "Como vocês medem o sucesso?",
    a: "Economias auditáveis em P&L, KPIs de ciclo de compra, adoção digital e, quando aplicável, métricas ESG na cadeia de suprimentos.",
  },
];

export const homeFaqs: FAQ[] = [
  {
    q: "O que significa «sem risco de caixa»?",
    a: "Compartilhamos riscos: a economia que geramos financia o trabalho. Você não desembolsa honorários líquidos pelo programa.",
  },
  {
    q: "Vocês só assessoram ou também executam?",
    a: "Somos seus parceiros na execução: assessment, sourcing, BPO, tecnologia e VRO até o impacto aparecer nos seus números.",
  },
  {
    q: "Em quais países vocês atuam?",
    a: "Presença em 6 países da região, com escritórios no Chile, Brasil, México e Colômbia.",
  },
  {
    q: "Como começo?",
    a: "Com a calculadora de eficiências: algumas perguntas sobre seu gasto e maturidade, e uma estimativa de oportunidade em minutos.",
  },
];

export const heroStats = [
  {
    value: "3B+",
    label: "Gasto sob gestão em programas recentes.",
    detail: "Spend direto e indireto em sourcing, BPO e transformação de suprimentos na América Latina.",
  },
  {
    value: "15+",
    label: "Anos gerando eficiências para clientes.",
    detail: "Trajetória regional executando eficiências com impacto verificável em P&L e caixa.",
  },
  {
    value: "6",
    label: `Países com presença · escritórios em ${officesLabel}.`,
    detail: `Operação em ${presenceLabel} com equipes locais e projetos multi-país.`,
  },
  {
    value: "50+",
    label: "Mais de 50 clientes.",
    detail: "Empresas líderes em varejo, mineração, seguros, financeiro, energia e manufatura.",
  },
  {
    value: "120+",
    label: "Pessoas na organização.",
    detail: "Consultores, especialistas de sourcing e equipes BPO dedicadas a capturar valor em campo.",
  },
] as const;

export const stats = [
  ...heroStats,
  { value: "100%", label: "Modelo alinhado a economias reais." },
] as const;

export const differentiators = [
  {
    title: "Impacto real",
    description: "Economias, EBITDA e caixa — medidos e auditáveis em P&L.",
  },
  {
    title: "Compartilhamos riscos",
    description: "Compartilhamos riscos com você — o programa se alinha a eficiências verificáveis em P&L.",
  },
  {
    title: "Somos seus parceiros na execução",
    description: "Medimos, implementamos e executamos em campo com você até capturar valor.",
  },
  {
    title: "Carbono neutro",
    description: "Operação certificada com critério ambiental em cada projeto.",
  },
] as const;

export const pillars = [
  {
    id: "efficiency",
    title: "Eficiências & Otimização",
    subtitle: "Processos e cultura",
    description:
      "Assessment, melhoria de processos e preparação operacional com impacto mensurável.",
    href: "/servicios/eficiencias-optimizacion",
    services: [
      "Assessment do cliente",
      "Otimização de processos",
      "Cultura e capacidades",
      "Quick wins priorizados",
    ],
  },
  {
    id: "transformation",
    title: "Transformação de Suprimentos",
    subtitle: "Modelo e governança",
    description:
      "Redesenhamos como a área de suprimentos opera: governança, modelo operacional e roadmap.",
    href: "/servicios/transformacion-abastecimiento",
    services: [
      "Maturidade e governança",
      "Operating model",
      "Roadmap de transformação",
      "Habilitação da área",
    ],
  },
  {
    id: "sourcing",
    title: "Strategic Sourcing",
    subtitle: "Economia em P&L e caixa",
    description:
      "Executamos sourcing e negociação com tracking até o fechamento financeiro.",
    href: "/servicios/abastecimiento-estrategico",
    services: [
      "Opportunity assessment",
      "Negociação e RFP",
      "Categorias críticas",
      "Savings assurance",
    ],
  },
  {
    id: "bpo",
    title: "BPO / Terceirização de Compras",
    subtitle: "Operação terceirizada",
    description:
      "Operamos compras e contratos com SLAs, controle e melhoria contínua.",
    href: "/servicios/bpo-abastecimiento",
    services: [
      "Purchasing BPO",
      "Contracts management",
      "Cash & PAY programs",
      "Working Capital Solutions",
      "Risk & providers",
    ],
  },
  {
    id: "digital",
    title: "Digitalização & Agentização",
    subtitle: "Procuretech em ação",
    description:
      "Implementamos tecnologia, automação e agentes que a equipe adota.",
    href: "/servicios/cadena-suministro-digital",
    services: [
      "Procuretech",
      "Automação RPA",
      "Agentização",
      "Integração ERP",
    ],
  },
  {
    id: "implementation",
    title: "Implementação de Eficiências",
    subtitle: "VRO & execução em campo",
    description:
      "Levamos as iniciativas do plano a resultados mensuráveis com VRO, change management e equipes em campo.",
    href: "/servicios/implementacion-eficiencias",
    services: [
      "Value Realization Office (VRO)",
      "Change management",
      "Implementação em campo",
      "Savings assurance",
    ],
  },
] as const;

export const services = [
  {
    slug: "eficiencias-optimizacion",
    title: "Eficiências & Otimização de processos",
    pillar: "Diagnóstico & Processos",
    headline: "Mais margem desde o primeiro trimestre",
    intro:
      "Encontramos onde se perde valor na sua operação, priorizamos as oportunidades de maior impacto e as convertemos em resultados mensuráveis em P&L — sem esperar uma transformação de fundo.",
    outcomes: [
      "Mapa claro de oportunidades por categoria e processo",
      "Quick wins com responsáveis, prazos e economia estimada",
      "Compras mais ágeis, com menos fricção e retrabalho",
      "Equipes focadas em resultados, não só em atividade",
    ],
    approach: [
      "Diagnóstico de gasto, maturidade e processos críticos",
      "Design de alavancas e plano de captura por ondas",
      "Otimização de processos e regras operacionais",
      "Acompanhamento até ver impacto nos seus números",
    ],
  },
  {
    slug: "transformacion-abastecimiento",
    title: "Transformação de Suprimentos",
    pillar: "Transformação",
    headline: "Uma área de compras preparada para competir",
    intro:
      "Redesenhamos governança, modelo operacional e roadmap de compras alinhados à direção — com foco em EBIT, agilidade, resiliência e ESG.",
    outcomes: [
      "Papéis claros entre negócio e compras, com comitês que funcionam",
      "Organização e modelo operacional orientados a categorias estratégicas",
      "Roadmap com marcos, investimento e benefícios esperados",
      "Tecnologia e parceiros definidos para escalar o novo modelo",
    ],
    approach: [
      "Avaliação de maturidade e comparação com referências de mercado",
      "Design de estratégia, governança e modelo operacional",
      "Plano de transformação por etapas com gestão da mudança",
      "Implementação tecnológica com parceiros certificados",
    ],
  },
  {
    slug: "abastecimiento-estrategico",
    title: "Abastecimento Estratégico",
    pillar: "Cost & Value",
    headline: "Economias que chegam ao P&L — e se sustentam",
    intro:
      "Identificamos oportunidades em gasto direto e indireto, negociamos com o mercado e acompanhamos até que a economia se reflita nos seus resultados.",
    outcomes: [
      "Redução de custos com impacto verificável em EBIT",
      "Melhores fornecedores e contratos mais competitivos",
      "Visibilidade de gasto por categoria e unidade de negócio",
      "Categorias críticas e programas de eficiência sob controle",
    ],
    approach: [
      "Spend analytics e opportunity assessment",
      "Estratégia de categoria e design de RFP",
      "Negociação e e-auctions quando aplicável",
      "Implementation tracking e savings assurance",
    ],
    ss: {
      assessment: {
        eyebrow: "Por onde começamos",
        title: "Priorizamos onde há mais valor a capturar",
        intro:
          "Analisamos seu gasto, identificamos as categorias com maior potencial e montamos um plano claro para converter oportunidades em economias reais em seu P&L.",
        phases: [
          {
            title: "Entendemos onde está o gasto",
            bullets: [
              "Organizamos e classificamos seu histórico de compras por categoria",
              "Cruzamos OPEX e CAPEX, e revisamos contratos-chave quando necessário",
              "Priorizamos categorias por potencial de economia e facilidade de execução",
            ],
          },
          {
            title: "Definimos o que abordar primeiro",
            bullets: [
              "Selecionamos categorias conforme impacto, maturidade e tamanho do gasto",
              "Validamos com usuários e compras conforme criticidade e vencimentos",
              "Acordamos o que lideramos e o que sua equipe interna lidera",
            ],
          },
          {
            title: "Abrimos as alavancas de economia",
            bullets: [
              "Identificamos oportunidades na oferta e na demanda",
              "Priorizamos quick wins por impacto e velocidade de captura",
              "Classificamos iniciativas por esforço e retorno esperado",
            ],
          },
          {
            title: "Planejamos a captura",
            bullets: [
              "Cronograma por ondas conforme oportunidades e criticidade do serviço",
              "Priorização por vencimentos contratuais e janelas de negociação",
              "Projeção de economias com marcos que você pode auditar",
            ],
          },
        ],
      },
      model: {
        title: "Sourcing estratégico, executado com agilidade",
        intro:
          "Convertemos iniciativas em eficiências reais que impactam seu resultado. Metodologia comprovada, da linha base até a captura no balanço.",
        laneLabels: {
          demand: "Gestão de demanda",
          offer: "Gestão de oferta",
          savings: "Captura de economias",
        },
        steps: [
          { num: "1", title: "Diagnóstico da situação atual", lane: "demand" },
          { num: "2", title: "Análise técnica e de mercado", lane: "demand" },
          { num: "3", title: "Estratégia de categoria", lane: "demand" },
          { num: "4", title: "Licitação e saída ao mercado", lane: "offer" },
          { num: "5", title: "Avaliação de propostas e fechamento", lane: "offer" },
          { num: "6", title: "Negociação final e contratos", lane: "offer" },
          { num: "7", title: "Implementação do novo modelo", lane: "savings" },
          { num: "8", title: "Monitoramento e controle", lane: "savings" },
        ],
        benefits: [
          "Mais competição entre fornecedores e melhor base de suprimentos",
          "Soluções de demanda que vão além da economia de preço",
          "Negociações digitais com economias médias de ~15% na região",
        ],
      },
      capture: {
        title: "Três velocidades para capturar valor",
        intro:
          "Combinamos resultados rápidos com eficiências de longo prazo, adaptando a abordagem à urgência e ao potencial de cada categoria.",
        tracks: [
          {
            id: "quick-impact",
            name: "Quick Impact",
            tagline: "Resultados em semanas",
            focus:
              "Fornecedores de alto volume que cruzam várias categorias.",
            bullets: [
              "Negociação ágil apoiada em volume e dados de mercado",
              "Descontos imediatos ou retroativos quando o contexto permite",
              "Benchmarks regionais que sustentam cada captura",
            ],
            duration: "1–2 meses para começar a capturar",
            savings: "5% – 10% de economia média",
          },
          {
            id: "rapid-savings",
            name: "Rapid Savings",
            tagline: "Quick wins por categoria",
            focus:
              "Categorias com oportunidade clara e execução rápida.",
            bullets: [
              "Preços de referência atualizados para negociar de posição forte",
              "Condições flexíveis que permitem ajustar o serviço depois",
              "Negociação direta, novos fornecedores ou ajustes operacionais rápidos",
            ],
            duration: "2–3 meses para começar a capturar",
            savings: "8% – 15% de economia média",
          },
          {
            id: "strategic-sourcing",
            name: "Strategic Sourcing",
            tagline: "Economia que perdura",
            focus:
              "Redesenho do serviço alinhado ao que o negócio precisa hoje.",
            bullets: [
              "Questionamos o modelo atual e otimizamos demanda e estrutura",
              "Trabalho conjunto com usuários e integração de melhores práticas",
              "Licitações competitivas que renovam fornecedores e dão resiliência",
            ],
            duration: "4–6 meses para começar a capturar",
            savings: "15% – 25% de economia média + melhor qualidade",
          },
        ],
      },
      methodology: {
        title: "Como executamos o sourcing estratégico",
        intro:
          "Oito passos com entregáveis concretos em cada fase, do diagnóstico inicial ao acompanhamento da economia nos seus resultados.",
        steps: [
          {
            num: "1",
            title: "Diagnóstico da situação atual",
            description:
              "Entendemos como o serviço opera hoje: níveis, penalidades, KPIs e custo total (preço, quantidade e qualidade).",
            deliverables: ["Linha base", "Lista de categorias", "Iniciativas"],
          },
          {
            num: "2",
            title: "Análise técnica e de mercado",
            description:
              "Dimensionamos oportunidades, validamos viabilidade e lemos tendências de mercado.",
            deliverables: [],
          },
          {
            num: "3",
            title: "Estratégia de categoria",
            description:
              "Definimos a melhor rota de negociação e abastecimento, alinhada ao que o negócio precisa.",
            deliverables: ["Estratégia de categoria"],
          },
          {
            num: "4",
            title: "Licitação e saída ao mercado",
            description:
              "Identificamos fornecedores, preparamos o edital, definimos cotações e publicamos o processo.",
            deliverables: ["Edital de licitação"],
          },
          {
            num: "5",
            title: "Avaliação de propostas",
            description:
              "Recebemos ofertas, avaliamos no técnico, econômico e financeiro, e definimos a estratégia de fechamento.",
            deliverables: ["Fornecedores pré-selecionados", "Estratégia de fechamento"],
          },
          {
            num: "6",
            title: "Negociação final e contratos",
            description:
              "Fechamos a negociação, formalizamos a economia, adjudicamos e assinamos contratos.",
            deliverables: ["Resultados preliminares", "Contratos assinados"],
          },
          {
            num: "7",
            title: "Implementação",
            description:
              "Colocamos o novo serviço em operação e apoiamos a equipe na transição.",
            deliverables: ["Plano de implementação"],
          },
          {
            num: "8",
            title: "Monitoramento e controle",
            description:
              "Acompanhamos a captura de economias e corrigimos desvios antes que se perca valor.",
            deliverables: ["Análise de lacunas"],
          },
        ],
      },
      successPillars: {
        title: "Três fatores que fazem a diferença",
        pillars: [
          {
            title: "Compromisso da direção",
            description:
              "Quando a alta gerência participa, as decisões saem mais rápido e o impacto chega aos resultados.",
          },
          {
            title: "Gestão da mudança",
            description:
              "Alinhamos a equipe interna desde o início para que os novos modelos sejam adotados e sustentados.",
          },
          {
            title: "Economia que se vê no P&L",
            description:
              "Não paramos no plano: acompanhamos até que a economia se reflita nos seus números.",
          },
        ],
      },
      tools: {
        title: "Tecnologia que dá visibilidade e controle",
        intro:
          "Plataformas digitais para acompanhar cada categoria, cada negociação e cada economia — com rastreabilidade de ponta a ponta.",
        categories: [
          {
            title: "Gestão do projeto",
            bullets: [
              "Status, pendências e responsáveis por categoria",
              "Cronogramas, economias projetadas e respaldo de entregáveis",
              "Dashboards consolidados e acompanhamento de implementação",
            ],
          },
          {
            title: "Processos com fornecedores",
            bullets: [
              "Informação clara e comparável para toda a equipe",
              "Avaliações técnicas com visibilidade para quem decide",
              "Fechamentos eletrônicos: leilão reverso, sobre fechado e mais",
            ],
          },
        ],
      },
    },
  },
  {
    slug: "gestion-riesgo-proveedores",
    title: "Gestão de Risco de Fornecedores",
    pillar: "Managed Services",
    headline: "Fornecedores sob controle, operação sem surpresas",
    intro:
      "Identificamos, medimos e reduzimos riscos financeiros, operacionais, reputacionais e ESG na sua base de fornecedores — antes que impactem o negócio.",
    outcomes: [
      "Mapa de risco claro por fornecedor e categoria",
      "Protocolos de monitoramento e planos de contingência",
      "Maior continuidade operacional diante de disrupções",
      "Rastreabilidade pronta para auditoria e compliance",
    ],
    approach: [
      "Avaliação e segmentação de risco",
      "Due diligence e scoring de fornecedores",
      "Planos de mitigação e diversificação",
      "Relatórios executivos e governança contínua",
    ],
  },
  {
    slug: "bpo-abastecimiento",
    title: "BPO de Suprimentos",
    pillar: "Managed Services",
    headline: "Sua operação de compras, funcionando perfeitamente",
    intro:
      "Assumimos a operação transacional e de contratos para que sua equipe se concentre no estratégico e em gerar valor ao negócio.",
    outcomes: [
      "Operação mais eficiente e transparente",
      "SLAs mensuráveis em todo o ciclo de compra",
      "Menor custo fixo da área",
      "Escala sem aumentar headcount",
    ],
    approach: [
      "Design de modelo BPO e transição",
      "Operação purchasing & contracts",
      "Reporting e melhoria contínua",
      "Integração com ERP e e-procurement",
    ],
    bpo: {
      vision: {
        eyebrow: "BPO — Managed Services",
        title: "Mais que operar compras",
        intro:
          "Combinamos talento, tecnologia e dados para que sua área de compras gere mais valor com menos fricção — não apenas mais pessoas.",
        pillars: [
          {
            num: "1",
            title: "Talento especializado",
            description:
              "Equipes expertas em sourcing, escaláveis conforme sua operação e unidades de negócio.",
          },
          {
            num: "2",
            title: "Analítica e inteligência artificial",
            description:
              "Convertemos dados de gasto em oportunidades de economia, consolidação e melhoria do canal de compra.",
          },
          {
            num: "3",
            title: "Contratos e continuidade",
            description:
              "Monitoramos cumprimento contratual e desempenho de fornecedores para que não escape valor.",
          },
          {
            num: "4",
            title: "Melhoria contínua",
            description:
              "Otimizamos a operação de forma proativa, com dados e melhores práticas de mercado.",
          },
          {
            num: "5",
            title: "Compromisso ESG",
            description:
              "Acompanhamos programas de fornecedores em diversidade, liderança feminina, comunidades e pegada de carbono.",
          },
        ],
        valueEnablersTitle: "O que acelera o valor",
        valueEnablers: [
          "Especialistas por categoria quando necessário",
          "Cumprimento de SLAs acordados",
          "Melhores práticas da indústria",
        ],
        automationEnablersTitle: "O que automatiza a operação",
        automationEnablers: [
          "Ferramentas e templates de gestão de contratos",
          "Catálogos e marketplace",
          "Tecnologia de compras integrada ao serviço",
        ],
      },
      operatingModel: {
        title: "Um modelo para cada tipo de gasto",
        intro:
          "Estratégia, tecnologia e equipes especializadas para cada segmento — do gasto estratégico ao tail spend.",
        layers: [
          {
            title: "Gasto estratégico — onde está o maior valor",
            items: [
              "Gestão de categorias e sourcing estratégico",
              "Análise de custos e gestão de categorias-chave",
              "Administração de convênios e contratos",
              "Captura de valor e transformação",
            ],
          },
          {
            title: "Gasto tático e spot — velocidade e controle",
            items: [
              "Gestão de categorias táticas e tail spend",
              "Compras por catálogo e compras guiadas",
              "Mesa de ajuda e suporte de sistemas",
              "Compliance, desempenho e risco de fornecedores",
            ],
          },
          {
            title: "Torre de controle — visibilidade total",
            items: [
              "Inteligência de fornecedores, analytics e acompanhamento de projetos",
              "Gestão de contratos e inteligência de mercado",
              "Governança corporativa e melhoria de processos",
              "Automação e integração com ERP",
            ],
          },
          {
            title: "Tecnologia incluída no serviço",
            items: [
              "Workbench de categorias, catálogos e compras guiadas",
              "Sourcing simplificado e assistentes com IA",
              "Portal de compradores integrado com SAP e seus sistemas",
              "Visibilidade de ponta a ponta para quem decide",
            ],
          },
        ],
        technologyNote:
          "Plataformas de classe mundial como serviço: tecnologia de ponta sem que você precise investir em licenças nem sistemas próprios.",
      },
      spendSegments: {
        title: "Cada real de gasto, bem gerenciado",
        intro:
          "Liberamos sua equipe estratégica para focar em criar valor, enquanto a operação tática corre com agilidade e controle.",
        segments: [
          {
            id: "strategic",
            name: "Gasto estratégico",
            spendShare: "~80% do gasto total",
            txShare: "~10% transações",
            focus: "Onde negociamos condições que movem o P&L.",
            bullets: [
              "Revisão de especificações e custo total do serviço",
              "Gestão de demanda com visão externa e especializada",
              "Negociação de condições excepcionais com fornecedores",
              "Implementamos a mudança, não apenas recomendamos",
            ],
          },
          {
            id: "tactical",
            name: "Gasto tático",
            spendShare: "~15% do gasto total",
            txShare: "~30% transações",
            focus: "Operação eficiente de compras do dia a dia.",
            bullets: [
              "Gestão de solicitações alinhada às suas políticas",
              "Menos passos e aprovações mais simples",
              "Visibilidade total com operação terceirizada",
              "Canal de compra otimizado",
            ],
          },
          {
            id: "tail",
            name: "Tail spend",
            spendShare: "~5% do gasto total",
            txShare: "~60% transações",
            focus: "Agilidade e controle em compras de baixo valor.",
            bullets: [
              "Compras guiadas que simplificam o processo",
              "Automação e compliance via catálogos",
              "Adesão a preços e convênios já negociados",
              "Gestão proativa de convênios e categorias relevantes",
            ],
          },
        ],
      },
      operationModels: {
        title: "O modelo que se adapta à sua necessidade",
        intro:
          "Quatro formas de trabalhar juntos. Escolhemos a que melhor se encaixa com sua urgência, complexidade e objetivos de negócio.",
        models: [
          {
            id: "staff-augmentation",
            name: "Staff Augmentation",
            tagline: "Reforço imediato",
            bullets: [
              "Profissionais com o perfil exato que você precisa",
              "Cobertura de vagas, adequação técnica e ferramentas digitais",
              "Gestão legal, normativa e trabalhista incluída",
              "Ideal para continuidade operacional ou reforço pontual",
            ],
            economics: "Tarifa mensal por recurso, com supervisão da sua equipe.",
          },
          {
            id: "bpo",
            name: "BPO",
            tagline: "Operação completa",
            bullets: [
              "Externalizamos pessoas, processos e resultados",
              "Torres de controle e modelos digitais para mais visibilidade",
              "Recrutamento, capacitação e gestão a nosso cargo",
              "Impacto em 24–36 meses: economias e operação sustentável",
            ],
            economics: "Tarifa mensal clara, ligada a volume e resultados.",
          },
          {
            id: "digital-bpo",
            name: "Digital BPO",
            tagline: "Tecnologia incluída",
            bullets: [
              "Pessoas, processos e plataforma em um único serviço",
              "Procuretech, torres de controle e analytics sem investimento inicial",
              "Processos padronizados com visibilidade em tempo real",
              "Operação multi-país em uma plataforma integrada",
            ],
            economics: "Tarifa mensal + fee por uso, ligado a eficiências obtidas.",
          },
          {
            id: "managed-services",
            name: "Managed Services integral",
            tagline: "Resultados de ponta a ponta",
            bullets: [
              "Eficiência e transparência desde o primeiro dia",
              "Liberamos sua equipe para o estratégico",
              "Integração com ERP, e-procurement e analytics",
              "Track record em mineração e extractivas: +100 FTE em operações de longo prazo",
            ],
            economics: "Modelo recorrente alinhado a SLAs, volume e captura de valor.",
          },
        ],
      },
      measurement: {
        title: "Resultados que se medem e se veem",
        intro:
          "Acompanhamos a satisfação de usuários, a qualidade da operação e a percepção de valor — com indicadores claros e relatórios acionáveis.",
        bullets: [
          "Pesquisas de satisfação por usuários, operações e serviços",
          "Cobertura e qualificação por segmento de gasto",
          "Dashboards com visibilidade do fluxo operacional completo",
          "Acompanhamento oportuno de compras e ordens de compra",
        ],
      },
      platform: {
        title: "Controle total do ciclo de compra",
        intro:
          "Acompanhamos cada iniciativa de ponta a ponta: tickets, rastreabilidade, avanços e compliance — com visibilidade permanente para sua equipe.",
        capabilities: [
          "Tickets com histórico de interações por iniciativa",
          "Controle de PO, aprovações e notificações automatizadas",
          "Cronogramas e dashboards de resultados por ordem de compra",
          "Resumo executivo para ativar melhorias do serviço",
        ],
        flexibilityNote:
          "Operamos com nossa plataforma própria ou nos adaptamos à sua, integrando aos seus processos e políticas sem fricção.",
      },
    },
  },
  {
    slug: "pay-scf",
    title: "PAY e Supply Chain Finance",
    pillar: "Managed Services",
    headline: "Mais caixa na cadeia, melhores relações com fornecedores",
    intro:
      "Desenhamos programas de financiamento e otimização de capital de giro que beneficiam sua empresa e sua base de fornecedores.",
    outcomes: [
      "Extensão de prazos de pagamento onde faz sentido comercial",
      "Melhor DPO e conversão de caixa",
      "Programas SCF com fornecedores estratégicos",
      "Acordos win-win com sua cadeia de suprimentos",
    ],
    approach: [
      "Diagnóstico de capital de giro",
      "Design do programa PAY/SCF",
      "Negociação com bancos e fornecedores",
      "Implementação e acompanhamento",
    ],
  },
  {
    slug: "working-capital-solutions",
    title: "Working Capital Solutions",
    pillar: "Cash & Liquidez",
    headline: "Mais caixa, com diagnóstico antes do banco",
    intro:
      "Programa integral em quatro pilares: diagnóstico quantitativo, design do programa de capital de giro, financiamento de cadeia com os melhores parceiros e renegociação de contratos. Sem conflito de interesse.",
    outcomes: [
      "Diagnóstico de DPO, gasto e oportunidade de caixa antes de estruturar financiamento",
      "Priorização de fornecedores por impacto em fluxo de caixa",
      "Programas SCF multibanco: confirming, pronto pagamento e portal de fornecedores",
      "Seus KPIs — DPO, EBITDA e FCF — não os do banco",
    ],
    approach: [
      "Diagnóstico e segmentação com plataforma Calculum",
      "Design de programa DPO, contas a pagar e tesouraria",
      "Implementação SCF com Monkey e banca multibanco",
      "Auditoria e renegociação de contratos e custo total",
    ],
    wcs: {
      platform: {
        eyebrow: "Plataforma em ação",
        title: "Do diagnóstico à execução — em uma única visão",
        intro:
          "Dashboard executivo, segmentação de fornecedores, cascata de fluxo de caixa e ficha por contraparte. Cifras ilustrativas; cada cliente parte da sua realidade.",
        tourHintAuto: "Tour automático · clique em um passo para pausar",
        tourHintLocked: "Lâmina selecionada. Clique em outra para explorar.",
      },
      platformSteps: [
        {
          id: "dashboard",
          title: "Dashboard executivo",
          subtitle: "DPO, oportunidade, caixa potencial e gasto analisado",
        },
        {
          id: "segmentation",
          title: "Segmentação de fornecedores",
          subtitle: "Priorização por impacto e viabilidade",
        },
        {
          id: "waterfall",
          title: "Cascata de fluxo de caixa",
          subtitle: "Extensão de prazos e caixa potencial por estratégia",
        },
        {
          id: "supplier",
          title: "Ficha de fornecedor",
          subtitle: "Benchmark, scoring e estratégia por contraparte",
        },
      ],
      pillarsTitle: "Quatro pilares, um único programa",
      pillarsIntro:
        "Cada pilar tem responsável, entregáveis e parceiros especializados. Coordenamos o programa de ponta a ponta.",
      pillars: [
        {
          num: "01",
          title: "Diagnóstico",
          partner: "Calculum",
          bullets: [
            "Analytics de gasto e benchmarks de DPO por indústria",
            "Segmentação e scoring de fornecedores",
            "Linha base para apresentar ao comitê executivo",
          ],
        },
        {
          num: "02",
          title: "Design do programa",
          bullets: [
            "Políticas de DPO e contas a pagar",
            "Tesouraria, projeção de caixa e automação",
            "Plano de captura em 8–12 semanas",
          ],
        },
        {
          num: "03",
          title: "Financiamento de cadeia",
          partner: "Monkey",
          bullets: [
            "Confirming multibanco e pronto pagamento",
            "Portal de fornecedores e onboarding",
            "Acordos win-win sem depender de um único banco",
          ],
        },
        {
          num: "04",
          title: "Contratos e custo total",
          bullets: [
            "Auditoria de contratos e condições comerciais",
            "Renegociação de prazo, preço e volume",
            "Alinhamento entre jurídico, compras e finanças",
          ],
        },
      ],
      differentiatorsTitle: "O que nos diferencia",
      differentiators: [
        {
          title: "Diagnóstico primeiro",
          description:
            "Partimos com dados e segmentação — não com um produto financeiro empacotado.",
        },
        {
          title: "8–12 semanas",
          description:
            "Programa delimitado com marcos claros, do diagnóstico à implementação.",
        },
        {
          title: "Seus KPIs, não os do banco",
          description:
            "Medimos DPO, EBITDA e fluxo de caixa do seu negócio — não apenas volume colocado.",
        },
        {
          title: "Sem conflito de interesse",
          description:
            "Independentes em banca e tecnologia; escolhemos a melhor combinação para o seu caso.",
        },
        {
          title: "Os melhores parceiros",
          description:
            "Calculum para analytics, Monkey para SCF, GEP e outros conforme seu stack.",
        },
        {
          title: "Execução, não slides",
          description:
            "Implementamos, negociamos e acompanhamos até ver impacto em caixa.",
        },
      ],
      partnersTitle: "Parceiros do programa",
      partnerNames: ["Calculum", "Monkey", "GEP"],
    },
  },
  {
    slug: "cadena-suministro-digital",
    title: "Cadeia de Suprimentos Digital",
    pillar: "Digital Procurement",
    headline: "Tecnologia que se adota — e que gera resultados",
    intro:
      "Como parceiros da Ariba, GEP e Jaggaer, levamos a digitalização de ponta a ponta: seleção, implementação, adoção e resultados mensuráveis.",
    outcomes: [
      "Visibilidade total do gasto e dos contratos",
      "Ciclos de compra mais curtos",
      "Compliance e rastreabilidade de ponta a ponta",
      "ROI mensurável em adoção e economia",
    ],
    approach: [
      "Business case e seleção de plataforma",
      "Implementação e configuração",
      "Capacitação e gestão da mudança",
      "Suporte pós go-live e otimização",
    ],
  },
  {
    slug: "automatizacion",
    title: "Automação",
    pillar: "Digital Procurement",
    headline: "Menos tarefas manuais. Mais capacidade para o estratégico.",
    intro:
      "Automatizamos fluxos repetitivos, aprovações e dados mestres para que sua equipe foque em análise e negociação.",
    outcomes: [
      "Menos trabalho manual em processos repetitivos",
      "Dados mestres mais limpos e confiáveis",
      "Tempos de ciclo previsíveis",
      "Base pronta para analytics e inteligência artificial",
    ],
    approach: [
      "Mapeamento de processos e quick wins",
      "Automação e workflows digitais",
      "Integração com ERP e P2P",
      "Medição de produtividade",
    ],
  },
  {
    slug: "implementacion-eficiencias",
    title: "Implementação de Eficiências",
    pillar: "Execução",
    headline: "Do plano ao impacto real",
    intro:
      "Acompanhamos a implementação de iniciativas de eficiência com equipes em campo e acompanhamento rigoroso até fechar valor em P&L e caixa.",
    outcomes: [
      "Acompanhamento com Value Realization Office (VRO)",
      "Adoção sustentada na equipe",
      "Economias verificáveis nos seus resultados",
      "Transferência de capacidades para a equipe interna",
    ],
    approach: [
      "Plano de implementação e quick wins priorizados",
      "VRO e savings assurance",
      "Capacitações e implementação em campo",
      "Reporting executivo até fechamento financeiro",
    ],
  },
] as const;

export const industries = [
  {
    slug: "retail",
    title: "Varejo & Consumo",
    headline: "Procurement que protege margem em um varejo sob pressão",
    challenges: [
      "Pressão de novos entrantes e marketplaces",
      "Inflação em custos diretos e indiretos",
      "Complexidade por omnicanalidade e velocidade de sortimento",
    ],
    howWeHelp: [
      "Otimização de gasto indireto (TI, marketing, logística)",
      "Private label e negociação com marcas",
      "Resiliência de supply em categorias críticas",
    ],
    metric: "Caso conglomerado de varejo: compras multi-negócio > USD 19B em vendas",
  },
  {
    slug: "seguros",
    title: "Seguros & Financeiro",
    headline: "Suprimentos integrais para instituições reguladas",
    challenges: [
      "Gasto indireto fragmentado por unidade de negócio",
      "Exigência de compliance e rastreabilidade",
      "Pressão em custos operacionais e tecnologia",
    ],
    howWeHelp: [
      "Modelo integral de gestão de compras",
      "Governança e reporting para diretoria",
      "Digitalização de P2P e contratos",
    ],
    metric: "Companhia latino-americana de seguros — modelo integral implantado",
  },
  {
    slug: "automotriz",
    title: "Automotivo",
    headline: "Economias rápidas sem frear o desenvolvimento da área de compras",
    challenges: [
      "Necessidade de savings em curto prazo",
      "Maturidade desigual da área de procurement",
      "Categorias técnicas com alto impacto no produto",
    ],
    howWeHelp: [
      "Programas de economia acelerada",
      "Build de capability interno em paralelo",
      "Sourcing em componentes e serviços críticos",
    ],
    metric: "Varejista automotivo — eficiências e desenvolvimento da área em paralelo",
  },
  {
    slug: "energia",
    title: "Energia & Recursos",
    headline: "CAPEX, OPEX e fornecedores em ambientes voláteis",
    challenges: [
      "Volatilidade de preços e supply disruption",
      "Projetos CAPEX sob pressão de prazo e custo",
      "Requisitos ESG na cadeia",
    ],
    howWeHelp: [
      "Gestão de categorias diretas e serviços",
      "Risk & resilience em fornecedores críticos",
      "Programas de descarbonização no supply",
    ],
    metric: "Experiência regional em categorias de alto spend",
  },
] as const;

export const cases = [
  {
    slug: "minera-chile-bpo",
    title: "Importante mineradora chilena",
    industry: "Mineração",
    service: "BPO / Terceirização de Compras",
    challenge:
      "Operação de suprimentos de alta complexidade em ambiente de mineração: alto volume transacional, múltiplas frentes e categorias críticas, com pressão para escalar capacidade sem aumentar headcount interno nem perder controle.",
    approach:
      "Implantação de modelo BPO com equipe Xinergy dedicada de mais de 35 profissionais: operação de compras e contratos, SLAs por processo, reporting executivo, integração com sistemas do cliente e melhoria contínua em campo.",
    results: [
      "Equipe operacional de 35+ pessoas em operação contínua",
      "Rastreabilidade e controle de gasto em categorias de alto impacto",
      "SLAs mensuráveis no ciclo de compra e gestão de contratos",
      "Capacidade escalável para picos de demanda operacional",
    ],
    highlight: "35+",
    highlightLabel: "pessoas na equipe BPO.",
  },
  {
    slug: "retail-conglomerado-latam",
    title: "Conglomerado de varejo latino-americano",
    industry: "Varejo",
    service: "Abastecimento Estratégico",
    challenge:
      "Empresa líder com vendas superiores a USD 19B e compras em cinco unidades de negócio sem visibilidade consolidada nem alavancas comuns de economia.",
    approach:
      "Diagnóstico de gasto, design de governança transversal, programas de sourcing por categoria e tracking de savings com responsáveis por negócio.",
    results: [
      "Visibilidade unificada de gasto multi-BU",
      "Pipeline de economias priorizado por impacto em EBIT",
      "Modelo de governança replicável entre divisões",
    ],
    highlight: "USD 19B+",
    highlightLabel: "escala de vendas do cliente.",
  },
  {
    slug: "seguros-latam",
    title: "Seguradora latino-americana",
    industry: "Seguros",
    service: "Procurement Transformation",
    challenge:
      "Gestão de compras fragmentada; necessidade de um modelo integral de suprimentos com compliance e eficiência.",
    approach:
      "Design de operating model, políticas, categorias, tecnologia P2P e equipe híbrida Xinergy-cliente.",
    results: [
      "Modelo integral de suprimentos implementado",
      "Maior controle de gasto indireto",
      "Capacidade interna desenvolvida no processo",
    ],
    highlight: "Integral",
    highlightLabel: "transformação end-to-end.",
  },
  {
    slug: "retail-software-factory",
    title: "Varejista — Software Factory",
    industry: "Varejo",
    service: "Abastecimento Estratégico",
    challenge:
      "Gasto crítico em desenvolvimento anual (>1,2M horas) sem padrão de fornecedor nem alavancas de negociação estruturadas.",
    approach:
      "Segmentação de fornecedores, benchmark de rates, RFP e renegociação de marco com SLAs de produtividade.",
    results: [
      "Redução material do custo unitário de desenvolvimento",
      "Contratos com métricas de entrega",
      "Base de fornecedores racionalizada",
    ],
    highlight: "1.2M+",
    highlightLabel: "horas sob gestão anual.",
  },
  {
    slug: "automotriz-savings",
    title: "Varejista automotivo",
    industry: "Automotivo",
    service: "Cost-Reduction",
    challenge:
      "Necessidade urgente de economias e eficiências enquanto se constrói a área de compras.",
    approach:
      "Programa dual: quick wins de savings em categorias de impacto + roadmap de capability.",
    results: [
      "Economias em janela acelerada",
      "Área de compras estruturada em paralelo",
      "Governança e reporting para gerência",
    ],
    highlight: "Dual",
    highlightLabel: "savings + capability build.",
  },
  {
    slug: "energia-recursos",
    title: "Empresa de energia e recursos",
    industry: "Energia & Recursos",
    service: "Abastecimento Estratégico",
    challenge:
      "Volatilidade de preços, disrupção na cadeia de suprimentos e projetos CAPEX sob pressão de prazo, custo e conformidade ESG.",
    approach:
      "Gestão de categorias diretas e serviços críticos, mapeamento de risco em fornecedores e programas de eficiência com foco em resiliência operacional.",
    results: [
      "Maior visibilidade de spend em categorias CAPEX e OPEX",
      "Mitigação de risco em fornecedores críticos",
      "Programas de eficiência alinhados à descarbonização",
    ],
    highlight: "CAPEX",
    highlightLabel: "e OPEX sob gestão.",
  },
] as const;

export const insights = [
  {
    slug: "alianza-gep-latam",
    type: "Aliança",
    title:
      "Xinergy e GEP firmam aliança estratégica para software de compras e supply chain na LATAM",
    date: "Abr 2023",
    excerpt:
      "GEP SOFTWARE™ disponível na América Latina: redução de custos, digitalização de processos e menor time to market para empresas da região.",
    tag: "Parceiros",
    icon: "partnership",
    body: [
      "Santiago, Chile — Xinergy, subsidiária da Matrix Consulting, anunciou uma aliança estratégica com a GEP®, líder em estratégia, software e serviços administrados de aquisição e cadeia de suprimentos para empresas Fortune 500 e Global 2000.",
      "A aliança combina o conhecimento do mercado latino-americano da Xinergy com a tecnologia e inovação da GEP, unindo necessidades locais com capacidades globais para reduzir custos, digitalizar processos e melhorar o time to market.",
      "A Xinergy venderá e implementará as plataformas da GEP — compras digitais, gestão de contratos, licitações, risco de fornecedores e gestão de gastos — para que as empresas sejam mais ágeis, resilientes e competitivas diante de inflação, pressão de custos e volatilidade industrial.",
      "«Esta aliança une as capacidades globais da GEP com a presença local e o profundo conhecimento de mercado da Xinergy e da Matrix Consulting. Nos permitirá oferecer uma proposta única, adaptada às necessidades locais, que impulsionará a redução de custos e a digitalização de compras na região», afirmou Roberto Uauy, Sócio Fundador e Gerente Geral da Xinergy.",
      "Ken Legge, vice-presidente de Alianças da GEP, destacou que a Xinergy trará inovação tecnológica, localização e experiência no setor, especialmente na LATAM, onde presença local e suporte linguístico são fundamentais.",
      "Para saber mais sobre as vantagens desta aliança, escreva para contacto@xinergy.cl.",
    ],
  },
  {
    slug: "innovacion-gep-procurement",
    type: "Aliança",
    title:
      "Inovação e tecnologia para novas soluções em procurement e gestão do gasto",
    date: "2023",
    excerpt:
      "Aliança com a GEP Worldwide® que catalisa redução de custos, digitalização e incorporação de metaverso e IA na proposta de valor.",
    tag: "Tecnologia",
    icon: "technology",
    body: [
      "Recentemente selamos uma nova aliança dentro do nosso ecossistema com a GEP Worldwide®, companhia líder mundial de estratégia, software e serviços administrados de aquisição e cadeia de suprimentos para empresas Fortune 500, com sede em New York, USA.",
      "Esta aliança catalisa a experiência da GEP, sua tecnologia de ponta e constante inovação, com o profundo conhecimento que temos das necessidades da região para gerar as melhores soluções em redução de custos, digitalização de processos e melhorias do time to market.",
      "Também estamos incorporando as capacidades habilitadas pelo metaverso e pela inteligência artificial (IA) para potencializar a proposta de valor para nossos clientes.",
      "Saiba mais sobre isso e nosso metaverso na reportagem publicada no Diario Financiero.",
    ],
    externalUrl: "https://xinergy.cl/potenciando-la-innovacion-y-tecnologia-para-generar-nuevas-soluciones-en-procurement-y-la-gestion-eficaz-del-gasto/",
  },
  {
    slug: "carbono-neutral",
    type: "ESG",
    title: "Somos Carbono Neutro",
    date: "2023",
    excerpt:
      "Certificação internacional CarbonNeutral Protocol: emissões líquidas zero e liderança na luta contra as mudanças climáticas.",
    tag: "Sustentabilidade",
    icon: "carbon-neutral",
    body: [
      "Depois de reduzir nossas emissões a líquido zero, recebemos a certificação internacional que comprova o compromisso e a liderança que temos na luta contra as mudanças climáticas.",
      "Este ano recebemos a certificação internacional CarbonNeutral Protocol, o que significa que cada emissão de gás de efeito estufa gerada pela Xinergy é compensada por meio de um programa que garante que uma quantidade equivalente é reduzida da atmosfera mediante um projeto de energias limpas.",
      "«Nosso compromisso com a sustentabilidade é absoluto. Potencializar as estratégias de sustentabilidade dos nossos clientes, permeando as políticas e práticas de ESG em seus processos de suprimentos e supply chain, não se consegue se não formos parte do mesmo modelo. Queremos dar o exemplo para potencializar as eficiências sustentáveis em todos os nossos clientes», comenta Roberto Aron Uauy Zirinsky, CEO da Xinergy.",
      "Para compensar as emissões de carbono da Xinergy durante 2021, escolhemos o projeto Wind Power Portfolio, um parque eólico de 33 MW localizado na Região do Biobío que gera energia limpa para abastecer 55 mil lares e prevenir 36 mil toneladas de CO₂ anualmente.",
      "Na Xinergy estamos comprometidos em contribuir na luta contra as mudanças climáticas. Esta certificação nos coloca na vanguarda em sustentabilidade, como a primeira consultoria de eficiências e procurement a alcançar este importante marco.",
    ],
  },
  {
    slug: "partners-proveedores-carbono-neutral",
    type: "ESG",
    title: "Parceiros e fornecedores Carbono Neutro",
    date: "2023",
    excerpt:
      "A certificação CarbonNeutral impulsiona nos nossos clientes um enfoque de sustentabilidade e práticas ESG em suprimentos e supply chain.",
    tag: "Sustentabilidade",
    icon: "supply-chain",
    body: [
      "Diante da evidência dos riscos das mudanças climáticas, múltiplas empresas em diversos setores a nível global comprometeram-se voluntariamente a metas de descarbonização nos últimos anos.",
      "Nesse contexto, contamos com a certificação CarbonNeutral, compromisso que nos permite impulsionar com força nos nossos clientes um enfoque de sustentabilidade e práticas de ESG em seus processos de suprimentos e supply chain.",
      "Exigimos o mesmo padrão em programas de eficiência sustentável: a cadeia externa faz parte do impacto real que medimos e executamos com você.",
    ],
    externalUrl:
      "https://xinergy.cl/la-importancia-de-contar-con-partners-y-proveedores-carbono-neutral/",
  },
  {
    slug: "teletrabajo-energias-renovables",
    type: "ESG",
    title: "Trabalho remoto e energias renováveis",
    date: "2023",
    excerpt:
      "Plano estratégico de trabalho remoto, compensação de emissões de colaboradores e projeto eólico no Biobío para energia limpa.",
    tag: "Sustentabilidade",
    icon: "renewables",
    body: [
      "Entre as ações que a Xinergy implementou, estabelecemos um plano estratégico para aproveitar os benefícios do trabalho remoto, limitando viagens e deslocamentos apenas ao necessário.",
      "«Ao mesmo tempo, decidimos compensar as emissões diretas dos nossos colaboradores em seus lares», explica Roberto Uauy, CEO da empresa.",
      "Em paralelo, para compensar com projetos de impacto no Chile e em energias renováveis, optamos pelo Wind Power Portfolio, um parque eólico de 33 MW localizado na Região do Biobío, que gera energia limpa para abastecer 55 mil lares e prevenir 36 mil toneladas de CO₂ anualmente.",
      "«Diminuir a pegada de carbono não é uma ação de curto prazo, é um compromisso que, uma vez instalado na organização, não pode ser substituído e tem que ter a máxima prioridade para seu cumprimento, conectando isso com o propósito da companhia».",
    ],
    externalUrl:
      "https://xinergy.cl/xinergy-va-por-el-teletrabajo-y-las-energias-renovables/",
  },
] as const;

export const cultureValues = [
  {
    title: "Alto desempenho",
    summary:
      "Máximo padrão, impacto end to end e relações de longo prazo baseadas em confiança.",
  },
  {
    title: "Alta vitalidade",
    summary:
      "Pensamos grande, inovamos e desafiamos o status quo — fora da zona de conforto.",
  },
  {
    title: "Alto humanismo",
    summary:
      "Os sucessos e os fracassos são do time. Bem-estar, desenvolvimento e ideias valorizadas por mérito.",
  },
] as const;

export const teamMembers = [
  {
    name: "Roberto Uauy",
    role: "Sócio",
    image: "/team/people/roberto.jpg",
    objectPosition: "center center",
  },
  {
    name: "Gonzalo de la Barra",
    role: "Sócio",
    image: "/team/people/gonzalo-de-la-barra.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Diego Jorreto",
    role: "Gerente Comercial",
    image: "/team/people/diego-jorreto.jpg",
    objectPosition: "center 28%",
  },
  {
    name: "Sandra",
    role: "Diretora Comercial",
    image: "/team/people/sandra.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Esteban Vallejos",
    role: "Country Manager · México",
    image: "/team/people/esteban-vallejos.jpg",
    objectPosition: "center 22%",
  },
  {
    name: "Marcelo Moreno",
    role: "Country Manager · Colômbia",
    image: "/team/people/marcelo-moreno.jpg",
    objectPosition: "center 24%",
  },
  {
    name: "Celso Alberti",
    role: "Sócio · Diretor Brasil",
    image: "/team/people/celso-alberti.jpg",
    objectPosition: "center 24%",
  },
  {
    name: "Christophe Le Flech",
    role: "VP Consulting",
    image: "/team/people/christophe-le-flech.jpg",
    objectPosition: "center 26%",
  },
  {
    name: "Pablo Valencia",
    role: "VP Strategic Sourcing",
    image: "/team/people/pablo-valencia.jpg",
  },
  {
    name: "Gonzalo Aguirrebeña",
    role: "Gerente · Compliance e Legal",
    image: "/team/people/gonzalo-aguirre.jpg",
    objectPosition: "center 20%",
  },
  {
    name: "Karin Schuster",
    role: "HR Business Partner",
    image: "/team/people/karin-schuster.jpg",
  },
  {
    name: "Pedro Pablo Maurel",
    role: "Gerente · BPO & Managed Services",
    image: "/team/people/pedro-pablo-maurel.jpg",
    objectPosition: "center 24%",
  },
] as const;

export const teamOffsite = {
  eyebrow: "A equipe",
  title: "Chegamos juntos à meta",
  location: "Torres del Paine · 2024",
  quote:
    "Os desafios mais exigentes são conquistados em equipe — na montanha e no negócio.",
  body:
    "Em 2024 nos reunimos no sul do Chile, em Torres del Paine. OneX VPs, diretores, advisors, fundadores e sócios caminharam até a meta com o mesmo espírito com o qual somos seus parceiros na execução: nos preparamos, nos esforçamos e chegamos juntos ao destino.",
  image: "/team/equipo-torres-paine-2024.png",
  imageAlt: "Equipe Xinergy em Torres del Paine, 2024 — OneX VPs, diretores, advisors, fundadores e sócios",
  imageSecondary: "/team/equipo-grupo-2024.png",
  imageSecondaryAlt:
    "Equipe Xinergy reunida — profissionais de toda a região em nossos escritórios",
} as const;

export const careersPage = {
  title: "Trabalhe conosco",
  eyebrow: "Carreiras",
  lead: "Na Xinergy estamos sempre em busca do melhor talento.",
  socialIntro:
    "Confira nossas redes sociais ou LinkedIn para conhecer a cultura da equipe e as oportunidades abertas.",
  linkedInLabel: "LinkedIn da Xinergy",
  emailIntro: "Você também pode deixar seus dados e CV em",
  emailOutro:
    "e nossa equipe de RH entrará em contato com você sobre qualquer oportunidade.",
  cultureTitle: "Como trabalhamos",
  cultureLink: "Conheça mais sobre nós →",
} as const;

export const nosotrosPage = {
  metaTitle: "Sobre nós",
  eyebrow: "Sobre nós",
  aboutBody1:
    "Executamos e implementamos eficiências em processos, abastecimento e operação — com impacto em economia, EBITDA e caixa. Não ficamos na apresentação: assessment, sourcing, BPO, cash management e Procuretech conforme cada desafio exige.",
  aboutBody2: `Presença em 6 países (${presenceLabel}), com escritórios em ${officesLabel}. Medimos, implementamos e executamos com você — com VRO, change management e tecnologia certificada.`,
  carbonNeutralBody:
    "Certificação internacional CarbonNeutral Protocol: emissões líquidas zero em nossa operação e em programas de eficiência sustentável.",
  teamEyebrow: "Equipe",
  teamTitle: "Liderança da Xinergy",
  teamLead:
    "Sócios, VPs e líderes regionais — parte da equipe que executa e acompanha nossos clientes na América Latina.",
} as const;

export const nav = [
  { label: "Sobre nós", href: "/nosotros" },
  { label: "Casos", href: "/casos" },
  { label: "Insights", href: "/insights" },
  { label: "Trabalhe conosco", href: "/trabaja-con-nosotros" },
] as const;

export const servicesPage = {
  metaTitle: "Serviços",
  metaDescription:
    "Seis linhas de execução: eficiências, transformação, sourcing, BPO, digitalização e implementação com VRO.",
  eyebrow: "Serviços",
  title: "Executamos eficiências",
  description: "Seis linhas de execução. Impacto mensurável em P&L, EBITDA e caixa.",
  viewPrimary: "Ver serviço principal →",
  allLinesTitle: "Todas as linhas de serviço",
} as const;

export const industriesPage = {
  metaTitle: "Indústrias",
  metaDescription:
    "Eficiências por indústria na América Latina — retail, seguros, automotivo, energia e mais.",
  eyebrow: "Indústrias",
  title: "Cada indústria tem suas próprias alavancas de eficiência",
  description:
    "Falamos a língua do seu setor — com casos, métricas e equipes que conhecem suas categorias críticas.",
  explore: "Explorar →",
  sectorLabel: "Indústria",
  challengesTitle: "Desafios do setor",
  howWeHelpTitle: "Como ajudamos",
} as const;

export const casesPage = {
  metaTitle: "Casos de sucesso",
  metaDescription: "Eficiências e resultados verificáveis para empresas líderes na LATAM.",
  eyebrow: "Casos de sucesso",
  title: "Resultados que falam",
  description:
    "Desafio, abordagem e resultados — sem apresentações vazias. Peça mais detalhes sobre qualquer caso.",
} as const;

export const insightsPage = {
  metaTitle: "Insights",
  metaDescription:
    "Pesquisa, parcerias e perspectivas sobre eficiência e abastecimento na LATAM.",
  eyebrow: "Insights",
  title: "Perspectivas que abrem portas",
  description:
    "Relatórios, parcerias e análises que posicionam a Xinergy como referência regional — não apenas mais um blog.",
} as const;

export const contactContexts = {
  casos: {
    eyebrow: "Casos de sucesso",
    title: "Preencha o formulário para conhecer mais dos nossos casos de sucesso",
    description: "Compartilhamos detalhes de casos similares ao seu. Respondemos em 24 horas úteis.",
  },
  diagnostico: {
    eyebrow: "Diagnóstico",
    title: "Agende seu diagnóstico",
    description:
      "Conte-nos sobre sua operação e aprofundamos as eficiências que você viu no cálculo.",
  },
  insights: {
    eyebrow: "Insights",
    title: "Quer aprofundar neste tema?",
    description:
      "Escreva para nós e respondemos com mais contexto sobre eficiências e abastecimento na LATAM.",
  },
  default: {
    eyebrow: "Contato",
    title: "Primeira conversa estratégica",
    description: "Sem compromisso. Respondemos em 24 horas úteis.",
  },
} as const;
