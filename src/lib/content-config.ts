// ============================================================================
// Configuração das seções de Conteúdo (navegação, blocos, tipos, card).
// Estrutura orientada a dados: cada bloco declara suas "capacidades" e a UI
// é renderizada genericamente a partir delas.
// ============================================================================

// ---------- Itens de navegação ----------
export interface NavItem {
  id: string;
  label: string;
  /** Início não pede detalhamento. */
  semDetalhe?: boolean;
  /** Nota fixa exibida ao selecionar (ex.: Favoritos). */
  nota?: string;
  /** Tipo de detalhamento especial. */
  especial?: "contato" | "trabalhe";
}

export const NAV_ITENS: NavItem[] = [
  { id: "inicio", label: "Início", semDetalhe: true },
  { id: "imoveis", label: "Imóveis" },
  { id: "sobre", label: "Sobre nós" },
  { id: "blog", label: "Blog" },
  { id: "contato", label: "Contato", especial: "contato" },
  { id: "simular", label: "Simular Financiamento" },
  { id: "solicitar", label: "Solicitar imóvel" },
  { id: "cadastrar", label: "Cadastrar imóvel" },
  { id: "area-cliente", label: "Área do Cliente" },
  { id: "servicos", label: "Serviços" },
  {
    id: "trabalhe",
    label: "Trabalhe conosco",
    especial: "trabalhe",
  },
  {
    id: "favoritos",
    label: "Favoritos",
    nota: "Ao selecionar, o card de imóvel passará a exibir automaticamente o botão de favoritar.",
  },
];

export const NAV_MAX = 5;

// ---------- Blocos / Seções de conteúdo ----------
export interface BlocoTipo {
  id: string;
  label: string;
  /** Pede título (com opção 'critério do designer'). Padrão: true. */
  titulo?: boolean;
  /** Pede subtítulo (opcional, com 'critério do designer'). Padrão: true. */
  subtitulo?: boolean;
  /** Campo de descrição livre do conteúdo da seção. */
  descricao?: string; // texto do label/placeholder; ausente = sem campo
  /** Lista de itens que o cliente deve preencher (ex.: bairros). */
  itemList?: { label: string; placeholder: string };
  /** Mostra configuração de exibição (carrossel + linhas + colunas). */
  layout?: "completo" | "quantidade"; // completo = linhas+colunas; quantidade = só nº itens
  /** Escolha entre opções fixas. */
  choice?: { label: string; options: string[] };
  /** Banner: imagem + texto, ou critério do designer. */
  banner?: boolean;
  /** Campo de link (ex.: tour 360). */
  link?: { label: string; placeholder: string };
  /** Permite múltiplas instâncias (ex.: listagem de imóveis). */
  multiplo?: boolean;
  /** Disclaimer fixo (ex.: Sobre nós usa o texto da história). */
  disclaimer?: string;
  /** Pede conteúdo de CTA (texto do botão / ação). */
  cta?: boolean;
}

export const BLOCOS: BlocoTipo[] = [
  { id: "imoveis-destaque", label: "Imóveis em Destaque", cta: true },
  {
    id: "categorias",
    label: "Categorias de imóveis",
    itemList: { label: "Quais categorias?", placeholder: "Ex.: Apartamento, Casa, Cobertura" },
  },
  {
    id: "bairros",
    label: "Bairros",
    itemList: { label: "Quais bairros?", placeholder: "Ex.: Centro, Jardins, Boa Viagem" },
  },
  {
    id: "depoimentos",
    label: "Depoimentos",
    itemList: { label: "Quais depoimentos?", placeholder: "Cole um depoimento por linha (autor — texto)" },
  },
  {
    id: "sobre-nos",
    label: "Sobre nós",
    titulo: false,
    subtitulo: false,
    disclaimer: "Será usado o texto preenchido na seção 'História da imobiliária' (Etapa 2).",
  },
  { id: "equipe", label: "Equipe", layout: "quantidade" },
  {
    id: "trabalhe-conosco",
    label: "Trabalhe conosco",
    itemList: { label: "Quais campos do formulário?", placeholder: "Ex.: Nome, E-mail, Currículo, Mensagem" },
  },
  {
    id: "simulador",
    label: "Simulador de financiamento",
    choice: {
      label: "Como funciona o simulador?",
      options: [
        "Calcular o valor na hora (na própria página)",
        "Listagem de bancos (clique leva ao site do banco)",
      ],
    },
  },
  { id: "blog", label: "Blog", layout: "completo" },
  {
    id: "contato",
    label: "Contato",
    descricao: "Explique o conteúdo: terá texto, imagens, CTA, formulário? Detalhe.",
  },
  { id: "instagram", label: "Publicações do Instagram", layout: "completo" },
  {
    id: "faq",
    label: "FAQ (perguntas frequentes)",
    descricao: "Descreva o conteúdo / as perguntas e respostas que devem aparecer.",
  },
  { id: "avaliacoes-google", label: "Avaliações do Google" },
  { id: "redes-sociais", label: "Seção de redes sociais" },
  { id: "mapa", label: "Localização no mapa" },
  { id: "indices", label: "Índices Imobiliários" },
  {
    id: "youtube",
    label: "Vídeos do YouTube",
    itemList: { label: "Links dos vídeos", placeholder: "Cole um link do YouTube por linha" },
  },
  {
    id: "banner",
    label: "Banner",
    titulo: false,
    subtitulo: false,
    banner: true,
    descricao: "Descreva o conteúdo / a mensagem do banner",
    cta: true,
  },
  {
    id: "construtoras",
    label: "Lista de construtoras",
    itemList: { label: "Nomes das construtoras", placeholder: "Uma construtora por linha" },
  },
  {
    id: "tour360",
    label: "Tour virtual 360º",
    link: { label: "Link do tour virtual", placeholder: "https://..." },
  },
];

// ---------- Listagens de imóveis ----------
// Finalidade vem da Etapa 2 (Estratégia). Tipo de imóvel é a categoria física.
export const TIPO_IMOVEL_OPCOES = [
  "Apartamentos",
  "Casas",
  "Coberturas",
  "Salas comerciais",
  "Galpões",
  "Terrenos",
  "Sobrados",
  "Chácaras / Sítios",
];

export const ESTAGIO_OPCOES = [
  "Lançamento",
  "Em construção",
  "Pronto para morar",
  "Usado",
];

export const EXIBICAO_OPCOES = [
  "Filtragem por abas",
  "Carrossel",
  "Listagem",
];

// ---------- Informações do card de imóvel ----------
export const CARD_INFO_MAX = 10;

export const CARD_INFO_OPCOES: string[] = [
  "Título do imóvel",
  "Imagem do imóvel",
  "Valor do imóvel",
  "Endereço do imóvel",
  "Descrição",
  "Resumo (quartos, salas, vagas, metragem)",
  "Detalhes (piscina, churrasqueira, frente mar, etc.)",
  "Categoria",
  "Condomínio",
  "Código/ID do imóvel",
  "Finalidade",
  "Estágio",
  "Favoritar",
  "Botão de fotos",
  "Barra de status (faixa 'Exclusivo' etc.)",
  "Botão de ver mais",
  "Botão de compartilhar",
  "Mobília",
  "Data de entrega",
  "Formas de pagamento",
  "Corretor responsável/captador",
  "Botão de WhatsApp",
  "Botões de finalidade",
];
