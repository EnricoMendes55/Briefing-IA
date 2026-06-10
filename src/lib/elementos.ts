import { BLOCOS } from "./content-config";
import type { WizardData } from "./briefing-schema";

export interface ElementoAtivo {
  id: string;
  label: string;
  /** topo / rodapé: sempre presente, sem opção de remover. */
  fixo?: boolean;
  /** busca: aparece, mas o cliente pode optar por não usar. */
  opcional?: boolean;
  /** rodapé: oferece opção "100% personalizado" no Premium. */
  rodape?: boolean;
}

/**
 * Deriva os elementos visuais que aparecem na etapa de Modelos, com base no
 * conteúdo que o cliente configurou.
 */
export function derivarElementos(data: WizardData): ElementoAtivo[] {
  const out: ElementoAtivo[] = [
    { id: "topo", label: "Topo / Header", fixo: true },
    { id: "busca", label: "Busca de imóveis", opcional: true },
    { id: "banner", label: "Banner principal (hero)" },
    { id: "card", label: "Card de imóvel" },
  ];

  if ((data.listagens || []).length > 0) {
    out.push({ id: "listagem", label: "Listagem de imóveis" });
  }

  const blocosSel: string[] = data.blocosSel || [];
  for (const id of blocosSel) {
    const b = BLOCOS.find((x) => x.id === id);
    if (!b) continue;
    // Evita colisão com o banner-hero fixo acima.
    const elId = id === "banner" ? "banner-secao" : id;
    out.push({ id: elId, label: b.label });
  }

  out.push({ id: "rodape", label: "Rodapé", fixo: true, rodape: true });
  return out;
}
