"use client";

import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { ModelPicker } from "@/components/model-picker";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { derivarElementos } from "@/lib/elementos";
import type { Plano } from "@/lib/briefing-schema";

export function Step6Modelos() {
  const { formData, updateFormData } = useWizard();
  const elementos = derivarElementos(formData);
  const modelos: Record<string, string> = formData.modelos || {};
  const userPlan: Plano = formData.plano || "premium";
  const semBusca = !!formData.semBusca;
  const rodapeCustom = formData.rodapeCustom || {};
  const usarRodapeCustom = !!formData.usarRodapeCustom;

  function setModelo(id: string, filename: string) {
    updateFormData({ modelos: { ...modelos, [id]: filename } });
  }

  function avisarBloqueio() {
    alert(
      "Este modelo faz parte do plano Premium. Seu plano atual (Padrão) não inclui esta opção — fale com o financeiro para fazer upgrade."
    );
  }

  function validate(): boolean {
    // Exige seleção apenas dos elementos essenciais que possuem modelos.
    if (!modelos["topo"]) return fail("Escolha um modelo de topo.");
    if (!modelos["banner"]) return fail("Escolha um modelo de banner.");
    if (!modelos["card"]) return fail("Escolha um modelo de card de imóvel.");
    if (!usarRodapeCustom && !modelos["rodape"])
      return fail("Escolha um modelo de rodapé (ou crie um personalizado no Premium).");
    return true;
  }

  function fail(msg: string): boolean {
    alert(msg);
    return false;
  }

  return (
    <div className="space-y-10">
      <p className="text-muted-foreground">
        Escolha o estilo visual de cada elemento do site. A lista abaixo é montada
        a partir do conteúdo que você configurou nas etapas anteriores.
      </p>

      {elementos.map((el) => {
        // Busca: opcional (cliente pode não usar)
        if (el.id === "busca") {
          return (
            <div key={el.id} className="space-y-3">
              <label className="flex cursor-pointer items-center gap-2">
                <Checkbox
                  checked={semBusca}
                  onCheckedChange={(c) => updateFormData({ semBusca: !!c })}
                />
                <span className="text-sm font-medium">Não usar barra de busca</span>
              </label>
              {!semBusca && (
                <ModelPicker
                  category="busca"
                  title="Busca de imóveis"
                  value={modelos["busca"] || ""}
                  onChange={(f) => setModelo("busca", f)}
                  userPlan={userPlan}
                  onBlockedSelect={avisarBloqueio}
                />
              )}
            </div>
          );
        }

        // Rodapé: opção de personalizado 100% no Premium
        if (el.id === "rodape") {
          return (
            <div key={el.id} className="space-y-4">
              <ModelPicker
                category="rodape"
                title="Rodapé"
                value={usarRodapeCustom ? "" : modelos["rodape"] || ""}
                onChange={(f) => setModelo("rodape", f)}
                userPlan={userPlan}
                onBlockedSelect={avisarBloqueio}
              />

              {userPlan === "premium" ? (
                <div className="rounded-xl border border-amber-300 bg-amber-50/60 p-4">
                  <label className="flex cursor-pointer items-center gap-2">
                    <Checkbox
                      checked={usarRodapeCustom}
                      onCheckedChange={(c) => updateFormData({ usarRodapeCustom: !!c })}
                    />
                    <span className="text-sm font-medium">
                      Quero um rodapé 100% personalizado (Premium)
                    </span>
                  </label>
                  {usarRodapeCustom && (
                    <div className="mt-3 space-y-3">
                      <div className="space-y-1.5">
                        <Label className="text-sm">Imagem de referência do rodapé</Label>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) =>
                            updateFormData({
                              rodapeCustom: { ...rodapeCustom, imagem: e.target.files?.[0]?.name || "" },
                            })
                          }
                          className="cursor-pointer"
                        />
                        {rodapeCustom.imagem && (
                          <p className="text-xs text-muted-foreground">{rodapeCustom.imagem}</p>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Como você quer esse rodapé?</Label>
                        <Textarea
                          rows={3}
                          placeholder="Descreva o rodapé personalizado..."
                          value={rodapeCustom.descricao || ""}
                          onChange={(e) =>
                            updateFormData({
                              rodapeCustom: { ...rodapeCustom, descricao: e.target.value },
                            })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-sm">Link de referência (opcional)</Label>
                        <Input
                          placeholder="https://..."
                          value={rodapeCustom.link || ""}
                          onChange={(e) =>
                            updateFormData({
                              rodapeCustom: { ...rodapeCustom, link: e.target.value },
                            })
                          }
                        />
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-amber-300 bg-amber-50/40 p-3 text-sm text-amber-800">
                  🔒 Rodapé 100% personalizado está disponível apenas no plano Premium.
                </div>
              )}

              <p className="text-xs text-muted-foreground">
                O rodapé sempre exibe o copyright e não pode ser removido.
              </p>
            </div>
          );
        }

        // Demais elementos
        return (
          <ModelPicker
            key={el.id}
            category={el.id}
            title={el.label}
            value={modelos[el.id] || ""}
            onChange={(f) => setModelo(el.id, f)}
            userPlan={userPlan}
            onBlockedSelect={avisarBloqueio}
          />
        );
      })}

      <StepNavigation onNext={validate} />
    </div>
  );
}
