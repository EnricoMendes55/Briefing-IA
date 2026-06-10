import type { Plano } from "./briefing-schema";

// ============================================================================
// >>> CONFIGURAÇÃO DOS MODELOS VISUAIS — ALIMENTE AS IMAGENS AQUI <<<
// ----------------------------------------------------------------------------
// A etapa "Modelos visuais" é DINÂMICA: mostra um seletor para cada elemento
// que o cliente ativou no conteúdo. Cada elemento tem uma pasta de imagens.
//
// Para ADICIONAR / TROCAR um modelo de um elemento:
//   1. Coloque a imagem em: public/modelos/<elemento>/<arquivo>
//   2. Adicione/edite a entrada na lista do elemento abaixo (objeto MODELOS).
//   3. Defina "plano":
//        - "padrao"  -> aparece e pode ser selecionado por todos
//        - "premium" -> cliente do plano Padrão VÊ, mas não consegue selecionar
//
// Elementos FIXOS (sempre aparecem): topo, banner, card, rodape.
// Elemento OPCIONAL: busca (cliente pode escolher não usar).
// Elementos de SEÇÃO: criados conforme o cliente seleciona blocos no conteúdo.
//   Os ids são os mesmos dos blocos (ex.: depoimentos, indices, faq, equipe,
//   blog, instagram, avaliacoes-google, construtoras, mapa, categorias,
//   bairros, youtube, simulador, contato, sobre-nos, redes-sociais, tour360,
//   banner-secao) + "listagem". Crie a pasta e adicione as entradas quando tiver
//   as imagens; enquanto não tiver, o seletor mostra "modelos em breve".
//
// Proporção sugerida das imagens: 16:10 (ex.: 1280x800).
// ============================================================================

export type { Plano };

export interface ModeloVisual {
  /** Nome do arquivo dentro de public/modelos/<elemento>/ */
  id: string;
  /** Nome amigável exibido ao cliente */
  label: string;
  /** Disponibilidade por plano */
  plano: Plano;
}

export const MODELOS: Record<string, ModeloVisual[]> = {
  topo: [
    { id: "topo-01.svg", label: "Logo centralizado", plano: "padrao" },
    { id: "topo-02.svg", label: "Logo à esquerda + menu", plano: "padrao" },
    { id: "topo-03.svg", label: "Menu hambúrguer", plano: "padrao" },
    { id: "topo-04.svg", label: "Transparente / overlay", plano: "padrao" },
    { id: "topo-05.svg", label: "Navegação dividida", plano: "padrao" },
  ],
  busca: [
    // Alimente com modelos de barra de busca de imóveis.
  ],
  banner: [
    { id: "banner-01.svg", label: "Imagem full + texto central", plano: "padrao" },
    { id: "banner-02.svg", label: "Split imagem + texto", plano: "padrao" },
    { id: "banner-03.svg", label: "Vídeo com play", plano: "padrao" },
    { id: "banner-04.svg", label: "Busca em destaque", plano: "padrao" },
    { id: "banner-05.svg", label: "Estilo carrossel", plano: "padrao" },
  ],
  card: [
    { id: "card-01.svg", label: "Card vertical", plano: "padrao" },
    { id: "card-02.svg", label: "Card horizontal", plano: "padrao" },
    { id: "card-03.svg", label: "Card minimalista", plano: "padrao" },
    { id: "card-04.svg", label: "Card com selo", plano: "padrao" },
    { id: "card-05.svg", label: "Card com carrossel", plano: "padrao" },
  ],
  rodape: [
    { id: "rodape-01.svg", label: "4 colunas", plano: "padrao" },
    { id: "rodape-02.svg", label: "Central minimalista", plano: "padrao" },
    { id: "rodape-03.svg", label: "Escuro com mapa", plano: "padrao" },
    { id: "rodape-04.svg", label: "Newsletter em destaque", plano: "padrao" },
    { id: "rodape-05.svg", label: "Multi-linha", plano: "padrao" },
    // Premium: adicione modelos extras e use plano: "premium".
    // O rodapé Premium também oferece a opção "100% personalizado" (na etapa).
  ],
};

export function modelosDoElemento(elementoId: string): ModeloVisual[] {
  return MODELOS[elementoId] || [];
}

/** Caminho público da imagem de um modelo. */
export function modeloPath(elementoId: string, id: string): string {
  return `/modelos/${elementoId}/${id}`;
}
