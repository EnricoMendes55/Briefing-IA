// ============================================================================
// >>> CLIENTES PREMIUM — ALIMENTE AQUI <<<
// ----------------------------------------------------------------------------
// Cada entrada vira um logo no carrossel exibido em TODAS as telas do formulário.
//
// Para adicionar um cliente:
//   1. Coloque o logo em: public/clientes-premium/<arquivo>
//      (PNG ou SVG, preferencialmente com fundo transparente, altura ~60px)
//   2. Adicione uma entrada abaixo com o nome, URL do site do cliente e o
//      caminho do logo (a partir de /).
//
// Enquanto a lista estiver vazia, o carrossel não aparece.
// ============================================================================

export interface ClientePremium {
  nome: string;
  /** URL do site do cliente — abre em nova aba quando o logo é clicado. */
  url: string;
  /** Caminho público do logo, ex.: "/clientes-premium/imobille.png" */
  logo: string;
}

export const CLIENTES_PREMIUM: ClientePremium[] = [
  // Exemplos (descomente e ajuste, ou substitua):
  // {
  //   nome: "Imobille Negócios",
  //   url: "https://www.imobillenegocios.com.br/",
  //   logo: "/clientes-premium/imobille.png",
  // },
  // {
  //   nome: "Outro Cliente",
  //   url: "https://...",
  //   logo: "/clientes-premium/outro.svg",
  // },
];
