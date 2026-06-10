"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import { isValidUrl } from "@/lib/form-helpers";

const RECOMENDACOES = [
  { label: "QuintoAndar", url: "https://www.quintoandar.com.br/" },
  { label: "Imobille Negócios", url: "https://www.imobillenegocios.com.br/" },
  { label: "LuxuryEstate", url: "https://www.luxuryestate.com/" },
];

export function Step4Referencias() {
  const { formData, updateFormData } = useWizard();
  const links: string[] = Array.isArray(formData.linksReferencia)
    ? formData.linksReferencia
    : [];
  const usarRecomendacoes = !!formData.usarRecomendacoes;

  function setLinks(v: string[]) {
    updateFormData({ linksReferencia: v });
  }

  function validate(): boolean {
    if (!usarRecomendacoes) {
      const preenchidos = links.filter((l) => l.trim());
      if (preenchidos.length === 0)
        return fail("Adicione ao menos um link de referência ou marque 'Não sei, ver recomendações'.");
      for (const l of preenchidos) {
        if (!isValidUrl(l)) return fail(`O link "${l}" não parece válido.`);
      }
    }
    if (!formData.esteticaSites || formData.esteticaSites.trim().length < 10)
      return fail("Descreva a estética desejada.");
    if (!formData.funcionalidades || formData.funcionalidades.trim().length < 10)
      return fail("Descreva as funcionalidades essenciais.");
    return true;
  }

  function fail(msg: string): boolean {
    alert(msg);
    return false;
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Referências visuais e funcionais que vão guiar o design do seu site.
      </p>

      <div className="space-y-3">
        <Label className="text-base font-semibold">Links de sites de referência *</Label>

        {!usarRecomendacoes && (
          <div className="space-y-2">
            {links.length === 0 && (
              <p className="text-xs text-muted-foreground">Nenhum link adicionado.</p>
            )}
            {links.map((link, i) => {
              const invalid = link.trim() !== "" && !isValidUrl(link);
              return (
                <div key={i}>
                  <div className="flex items-center gap-2">
                    <Input
                      value={link}
                      placeholder="https://site-que-voce-gosta.com.br"
                      onChange={(e) => setLinks(links.map((l, idx) => (idx === i ? e.target.value : l)))}
                      aria-invalid={invalid}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => setLinks(links.filter((_, idx) => idx !== i))}
                      aria-label="Remover"
                      className="text-muted-foreground hover:text-destructive"
                    >
                      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </Button>
                  </div>
                  {invalid && <p className="mt-1 text-xs text-destructive">Link inválido.</p>}
                </div>
              );
            })}
            <Button type="button" variant="outline" size="sm" onClick={() => setLinks([...links, ""])}>
              + Adicionar link
            </Button>
          </div>
        )}

        <label className="flex cursor-pointer items-center gap-2 pt-1">
          <Checkbox
            checked={usarRecomendacoes}
            onCheckedChange={(v) => updateFormData({ usarRecomendacoes: !!v })}
          />
          <span className="text-sm">Não sei indicar — quero ver recomendações</span>
        </label>

        {usarRecomendacoes && (
          <div className="space-y-2 rounded-xl bg-secondary/50 p-4">
            <p className="text-sm font-medium">Dê uma olhada nestes sites de referência:</p>
            <ul className="space-y-1">
              {RECOMENDACOES.map((r) => (
                <li key={r.url}>
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-primary underline underline-offset-2"
                  >
                    {r.label} — {r.url}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="esteticaSites" className="text-base font-semibold">
          Estética dos sites *
        </Label>
        <Textarea
          id="esteticaSites"
          placeholder="Descreva o que você gosta nesses sites de referência..."
          rows={3}
          value={formData.esteticaSites || ""}
          onChange={(e) => updateFormData({ esteticaSites: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-base font-semibold">Imagens/vídeos de referência</Label>
        <Input
          type="file"
          multiple
          accept="image/*,video/*"
          onChange={(e) => {
            const files = e.target.files;
            if (files) updateFormData({ refsFiles: Array.from(files).map((f) => f.name) });
          }}
          className="cursor-pointer"
        />
        {formData.refsFiles && formData.refsFiles.length > 0 && (
          <p className="text-sm text-muted-foreground">
            {formData.refsFiles.length} arquivo(s) selecionado(s)
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="funcionalidades" className="text-base font-semibold">
          Funcionalidades essenciais *
        </Label>
        <Textarea
          id="funcionalidades"
          placeholder="Ex.: Busca por bairro, simulador de financiamento, chat online..."
          rows={3}
          value={formData.funcionalidades || ""}
          onChange={(e) => updateFormData({ funcionalidades: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requisitosAdicionais" className="text-base font-semibold">
          Requisitos adicionais
        </Label>
        <Textarea
          id="requisitosAdicionais"
          placeholder="(opcional) Algo mais que devemos saber?"
          rows={3}
          value={formData.requisitosAdicionais || ""}
          onChange={(e) => updateFormData({ requisitosAdicionais: e.target.value })}
        />
      </div>

      <StepNavigation onNext={validate} />
    </div>
  );
}
