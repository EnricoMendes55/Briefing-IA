import { z } from "zod";

export const objetivoOptions = [
  "Gerar leads",
  "Reforçar reputação",
  "Exibir imóveis com filtros",
] as const;

export const clienteIdealOptions = [
  "Inquilinos",
  "Investidores",
  "Imóveis comerciais",
  "Casais jovens",
  "Alto poder aquisitivo",
] as const;

export const acaoEsperadaOptions = [
  "Confirmar credibilidade",
  "Solicitar visita",
  "Cadastrar imóvel",
  "Ler conteúdos",
  "Contato",
] as const;

export const finalidadeOptions = [
  "Venda",
  "Locação anual",
  "Locação temporada",
] as const;

export const sensacaoOptions = [
  "Moderno / Minimalista",
  "Tradicional / Clássico",
  "Luxuoso / Sofisticado",
  "Aconchegante / Familiar",
] as const;

export const navegacaoOptions = [
  "Lista imóveis",
  "Início",
  "Sobre",
  "Blog",
  "Contato",
  "Simulador",
  "Solicitar imóvel",
  "Anunciar",
  "Área cliente",
  "Serviços",
  "Trabalhe conosco",
  "Favoritos",
] as const;

export const blocosConteudoOptions = [
  "Destaques",
  "Categorias",
  "Bairros",
  "Depoimentos",
  "Sobre nós",
  "Equipe",
  "Trabalhe conosco",
  "Simulador",
  "Blog",
  "Contato",
  "Instagram",
] as const;

export const tiposImoveisOptions = [
  "Locação",
  "Venda",
  "Apartamentos",
  "Casas",
  "Salas comerciais",
  "Bairros",
  "Construção",
] as const;

export const componentCategories = [
  "topo",
  "banner",
  "card",
  "rodape",
] as const;

export type ComponentCategory = (typeof componentCategories)[number];

// Planos (definidos pelo link de acesso — ver Fase 3)
export type Plano = "padrao" | "premium";

// Estruturas da etapa de Identificação
export interface RedeSocialItem {
  rede: string;
  url: string;
}

export interface EnderecoData {
  cep: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
}

// Tipo flexível dos dados do wizard. Campos conhecidos são tipados; os demais
// (preenchidos dinamicamente nas etapas de conteúdo) são livres durante a
// construção da Fase 2. A validação real acontece em cada etapa.
export type WizardData = {
  plano?: Plano;
  // Identificação
  codigoImobiliaria?: string;
  nomeResponsavel?: string;
  email?: string;
  telefone?: string;
  imobiliaria?: string;
  semRedesSociais?: boolean;
  redesSociais?: RedeSocialItem[];
  semEndereco?: boolean;
  endereco?: EnderecoData;
  // Uploads
  logoFile?: string;
  refsFiles?: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

const hexColorRegex = /^#([0-9A-Fa-f]{6})$/;

const optionWithOther = (options: readonly string[]) =>
  z.object({
    value: z.string().min(1, "Selecione uma opção"),
    other: z.string().optional(),
  });

export const briefingSchema = z.object({
  // Etapa 1 — Identificação
  codigoImobiliaria: z.string().optional(),
  nomeResponsavel: z.string().min(2, "Nome é obrigatório"),
  email: z.string().email("E-mail inválido"),
  telefone: z.string().min(10, "Telefone inválido"),
  cidade: z.string().min(2, "Cidade é obrigatória"),
  imobiliaria: z.string().min(2, "Nome da imobiliária é obrigatório"),
  redesSociais: z.string().min(1, "Informe ao menos uma rede social"),

  // Etapa 2 — Estratégia
  objetivoSite: optionWithOther(objetivoOptions as unknown as string[]),
  clienteIdeal: optionWithOther(clienteIdealOptions as unknown as string[]),
  acaoEsperada: optionWithOther(acaoEsperadaOptions as unknown as string[]),
  finalidadeImoveis: z.string().min(1, "Selecione a finalidade"),
  sensacaoDesign: z.string().min(1, "Selecione a sensação"),
  historia: z.string().min(10, "Conte um pouco da história da imobiliária"),

  // Etapa 3 — Conteúdo
  itensNavegacao: z.array(z.string()).min(1, "Selecione ao menos 1 item"),
  blocosConteudo: z.array(z.string()).min(3, "Selecione ao menos 3 blocos"),
  blocosConteudoOutro: z.string().optional(),
  tiposImoveis: z.array(z.string()).min(1, "Selecione ao menos 1 tipo"),
  tiposImoveisOutro: z.string().optional(),

  // Etapa 4 — Referências
  linksReferencia: z.string().min(1, "Informe ao menos um link"),
  esteticaSites: z.string().min(10, "Descreva a estética desejada"),
  funcionalidades: z.string().min(10, "Descreva as funcionalidades"),
  requisitosAdicionais: z.string().optional(),

  // Etapa 5 — Identidade visual
  corPrimaria: z.string().regex(hexColorRegex, "Formato inválido (#RRGGBB)"),
  corSecundaria: z.string().regex(hexColorRegex, "Formato inválido (#RRGGBB)"),
  corTerciaria: z.string().regex(hexColorRegex, "Formato inválido (#RRGGBB)"),

  // Etapa 6 — Modelos
  modeloTopo: z.string().min(1, "Escolha um modelo de topo"),
  modeloBanner: z.string().min(1, "Escolha um modelo de banner"),
  modeloCard: z.string().min(1, "Escolha um modelo de card"),
  modeloRodape: z.string().min(1, "Escolha um modelo de rodapé"),
});

export type BriefingFormData = z.infer<typeof briefingSchema>;

export const stepSchemas = {
  1: briefingSchema.pick({
    codigoImobiliaria: true,
    nomeResponsavel: true,
    email: true,
    telefone: true,
    cidade: true,
    imobiliaria: true,
    redesSociais: true,
  }),
  2: briefingSchema.pick({
    objetivoSite: true,
    clienteIdeal: true,
    acaoEsperada: true,
    finalidadeImoveis: true,
    sensacaoDesign: true,
    historia: true,
  }),
  3: briefingSchema.pick({
    itensNavegacao: true,
    blocosConteudo: true,
    blocosConteudoOutro: true,
    tiposImoveis: true,
    tiposImoveisOutro: true,
  }),
  4: briefingSchema.pick({
    linksReferencia: true,
    esteticaSites: true,
    funcionalidades: true,
    requisitosAdicionais: true,
  }),
  5: briefingSchema.pick({
    corPrimaria: true,
    corSecundaria: true,
    corTerciaria: true,
  }),
  6: briefingSchema.pick({
    modeloTopo: true,
    modeloBanner: true,
    modeloCard: true,
    modeloRodape: true,
  }),
} as const;

export type StepNumber = keyof typeof stepSchemas;

export const STEP_TITLES: Record<number, string> = {
  1: "Identificação",
  2: "Estratégia",
  3: "Conteúdo do site",
  4: "Imóveis",
  5: "Referências",
  6: "Identidade visual",
  7: "Modelos visuais",
  8: "Revisão",
};

export const TOTAL_STEPS = 8;
