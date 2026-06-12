export const brand = {
  name: "Xinergy",
  tagline: "Executamos eficiências com impacto real.",
  claim: "#Fitness for business",
  strongPhrase: {
    emphasis: "Compartilhamos riscos,",
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
    value: "6+",
    label: `Presença em 6 países · escritórios em ${officesLabel}.`,
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
    headline: "Identificamos e capturamos eficiências onde hoje se perde valor",
    intro:
      "Começamos com um assessment rigoroso do gasto e da operação, priorizamos quick wins e melhoramos processos e cultura — com impacto mensurável em P&L antes de uma transformação de fundo.",
    outcomes: [
      "Mapa de eficiências por categoria e processo com baseline auditável",
      "Quick wins priorizados com responsáveis e prazos de captura",
      "Processos de compra mais ágeis, com menos fricção e retrabalho",
      "Capacidades da equipe alinhadas a resultados, não só a atividade",
    ],
    approach: [
      "Assessment de gasto, maturidade e processos críticos",
      "Design de alavancas e plano de captura por ondas",
      "Otimização de processos e regras operacionais",
      "Coaching e habilitação até ver impacto em P&L",
    ],
  },
  {
    slug: "transformacion-abastecimiento",
    title: "Transformação de Suprimentos",
    pillar: "Transformação",
    headline: "O modelo de suprimentos que seu negócio precisa para competir",
    intro:
      "Redesenhamos governança, operating model e roadmap da área de compras — alinhados ao C-suite, com foco em EBIT, agilidade, resiliência e ESG.",
    outcomes: [
      "Governança e comitês com papéis claros entre negócio e procurement",
      "Operating model e organograma alinhados a categorias estratégicas",
      "Roadmap de transformação com marcos, investimento e benefícios",
      "Stack tecnológico e parceiros definidos para escalar o novo modelo",
    ],
    approach: [
      "Avaliação de maturidade e benchmarking vs. referências",
      "Design de estratégia, governança e modelo operacional",
      "Plano de transformação por ondas com change management",
      "Habilitação tecnológica com parceiros certificados",
    ],
  },
  {
    slug: "abastecimiento-estrategico",
    title: "Abastecimento Estratégico",
    pillar: "Cost & Value",
    headline: "Economias que chegam ao P&L — e se sustentam",
    intro:
      "Identificamos oportunidades em gasto direto e indireto, executamos sourcing e negociação, e garantimos o tracking até o fechamento financeiro.",
    outcomes: [
      "Redução de custos com impacto em EBIT verificável",
      "Novos fornecedores e contratos otimizados",
      "Visibilidade de gasto por categoria e unidade de negócio",
      "Programas ZBB e categorias críticas sob controle",
    ],
    approach: [
      "Spend analytics e opportunity assessment",
      "Estratégia de categoria e design de RFP",
      "Negociação e e-auctions quando aplicável",
      "Implementation tracking e savings assurance",
    ],
  },
  {
    slug: "gestion-riesgo-proveedores",
    title: "Gestão de Risco de Fornecedores",
    pillar: "Managed Services",
    headline: "Resiliência na cadeia externa",
    intro:
      "Mapeamos, medimos e mitigamos risco financeiro, operacional, reputacional e ESG na base de fornecedores.",
    outcomes: [
      "Mapa de risco por fornecedor e categoria",
      "Protocolos de monitoramento e contingência",
      "Maior continuidade operacional",
      "Conformidade e rastreabilidade para auditoria",
    ],
    approach: [
      "Risk assessment e segmentação",
      "Due diligence e scoring",
      "Planos de mitigação e diversificação",
      "Governança e reporting executivo",
    ],
  },
  {
    slug: "bpo-abastecimiento",
    title: "BPO de Suprimentos",
    pillar: "Managed Services",
    headline: "Operação de compras terceirizada com padrão de classe mundial",
    intro:
      "Assumimos a operação transacional e de contratos para que sua equipe interna foque em categorias estratégicas e valor ao negócio.",
    outcomes: [
      "Maior eficiência e transparência operacional",
      "SLAs mensuráveis no ciclo de compra",
      "Redução de custo fixo da área",
      "Escalabilidade sem aumentar headcount",
    ],
    approach: [
      "Design de modelo BPO e transição",
      "Operação purchasing & contracts",
      "Reporting e melhoria contínua",
      "Integração com ERP e e-procurement",
    ],
  },
  {
    slug: "pay-scf",
    title: "PAY e Supply Chain Finance",
    pillar: "Managed Services",
    headline: "Liquidez na cadeia sem sacrificar a relação com fornecedores",
    intro:
      "Estruturamos programas de financiamento e otimização de capital de giro na cadeia de suprimentos.",
    outcomes: [
      "Extensão de prazos de pagamento onde é viável",
      "Melhoria de DPO e cash conversion",
      "Programas SCF com fornecedores estratégicos",
      "Win-win comercial com a base de supply",
    ],
    approach: [
      "Diagnóstico de working capital",
      "Design de programa PAY/SCF",
      "Negociação com bancos e fornecedores",
      "Implementação e monitoramento",
    ],
  },
  {
    slug: "cadena-suministro-digital",
    title: "Cadeia de Suprimentos Digital",
    pillar: "Digital Procurement",
    headline: "Plataformas que são implementadas — não que ficam no slide",
    intro:
      "Como parceiros da Ariba, GEP e Jaggaer, levamos a digitalização de ponta a ponta: seleção, implementação, adoção e resultados.",
    outcomes: [
      "Maior visibilidade de gasto e contratos",
      "Ciclos de compra mais curtos",
      "Compliance e rastreabilidade end-to-end",
      "ROI mensurável em adoção e economia",
    ],
    approach: [
      "Business case e seleção de plataforma",
      "Implementação e configuração",
      "Change management e capacitação",
      "Hypercare e otimização pós go-live",
    ],
  },
  {
    slug: "automatizacion",
    title: "Automação",
    pillar: "Digital Procurement",
    headline: "Menos fricção. Mais throughput em procurement.",
    intro:
      "Automatizamos fluxos repetitivos, aprovações e dados mestres para liberar capacidade analítica da equipe.",
    outcomes: [
      "Redução de trabalho manual",
      "Menos erros em dados mestres",
      "Tempos de ciclo mais previsíveis",
      "Base pronta para analytics e IA",
    ],
    approach: [
      "Mapeamento de processos e quick wins",
      "RPA e workflows digitais",
      "Integração com ERP e P2P",
      "Medição de produtividade",
    ],
  },
  {
    slug: "implementacion-eficiencias",
    title: "Implementação de Eficiências",
    pillar: "Execução",
    headline: "Do plano ao impacto real — com VRO e equipes em campo",
    intro:
      "Acompanhamos a implementação de iniciativas de eficiência com VRO, gestão da mudança e equipes que executam junto ao cliente até fechar valor em P&L e caixa.",
    outcomes: [
      "Acompanhamento de implementação com Value Realization Office (VRO)",
      "Change management e adoção sustentada na equipe",
      "Captura de economias verificável em P&L",
      "Transferência de capacidades com sourcing coach",
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

export const teamOffsite = {
  eyebrow: "A equipe",
  title: "Chegamos juntos à base",
  location: "Torres del Paine · Offsite 2024",
  quote:
    "Os desafios mais exigentes são conquistados em equipe — na montanha e no negócio.",
  body:
    "Em 2024 nos reunimos no sul do Chile para um offsite em Torres del Paine. Caminhamos até a base das torres com o mesmo espírito com o qual somos seus parceiros na execução: nos preparamos, nos esforçamos e chegamos juntos ao destino.",
  image: "/team/equipo-torres-paine-2024.png",
  imageAlt: "Equipe Xinergy na base das Torres del Paine, offsite 2024",
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
} as const;

export const nosotrosPage = {
  metaTitle: "Sobre nós",
  eyebrow: "Sobre nós",
  aboutBody1:
    "Executamos e implementamos eficiências em processos, abastecimento e operação — com impacto em economia, EBITDA e caixa. Não ficamos na apresentação: assessment, sourcing, BPO, cash management e Procuretech conforme cada desafio exige.",
  aboutBody2: `Presença em 6 países (${presenceLabel}), com escritórios em ${officesLabel}. Medimos, implementamos e executamos com você — com VRO, change management e tecnologia certificada.`,
  carbonNeutralBody:
    "Certificação internacional que comprova nosso compromisso com emissões líquidas zero em nossa operação e em programas de eficiência sustentável.",
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
