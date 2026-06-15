"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useWizard } from "../wizard-context";
import { STEP_TITLES } from "@/lib/briefing-schema";
import { NAV_ITENS, BLOCOS } from "@/lib/content-config";
import { derivarElementos } from "@/lib/elementos";

function Section({
  title,
  children,
  step,
  onEdit,
}: {
  title: string;
  children: React.ReactNode;
  step: number;
  onEdit: (step: number) => void;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">{title}</h3>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)}>
          Editar
        </Button>
      </div>
      <div className="rounded-lg bg-muted/50 p-4 text-sm">{children}</div>
    </div>
  );
}

function Field({ label, value }: { label: string; value?: string | string[] }) {
  if (!value || (Array.isArray(value) && value.length === 0)) return null;
  const display = Array.isArray(value) ? value.join(", ") : value;
  return (
    <div className="flex gap-2">
      <span className="font-medium text-muted-foreground">{label}:</span>
      <span>{display}</span>
    </div>
  );
}

export function Step7Revisao() {
  const { formData, setStep, setIsSubmitting } = useWizard();
  const router = useRouter();

  async function handleSubmit() {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/briefing", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.id) {
        router.push(`/briefing/resultado/${data.id}`);
      } else {
        alert("Erro ao enviar briefing. Tente novamente.");
        setIsSubmitting(false);
      }
    } catch {
      alert("Erro de conexão. Tente novamente.");
      setIsSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Confira tudo antes de enviar. Você pode editar qualquer etapa clicando
        em &quot;Editar&quot;.
      </p>

      <Section title={STEP_TITLES[1]} step={1} onEdit={setStep}>
        <div className="space-y-1">
          <Field label="Cód. imobiliária" value={formData.codigoImobiliaria} />
          <Field label="Responsável" value={formData.nomeResponsavel} />
          <Field label="E-mail" value={formData.email} />
          <Field label="Telefone" value={formData.telefone} />
          <Field label="Imobiliária" value={formData.imobiliaria} />
          <Field
            label="CRECI"
            value={
              formData.creciTipo && formData.creciNumero
                ? `${formData.creciTipo} ${formData.creciNumero}`
                : undefined
            }
          />
          <Field
            label="Redes sociais"
            value={
              formData.semRedesSociais
                ? "Não possui"
                : (formData.redesSociais || [])
                    .map((r) => r.url)
                    .filter(Boolean)
            }
          />
          <Field
            label="Endereço"
            value={
              formData.semEndereco
                ? "Não possui"
                : formData.endereco
                  ? `${formData.endereco.logradouro}, ${formData.endereco.numero} - ${formData.endereco.bairro}, ${formData.endereco.cidade} - ${formData.endereco.uf}`
                  : undefined
            }
          />
        </div>
      </Section>

      <Separator />

      <Section title={STEP_TITLES[2]} step={2} onEdit={setStep}>
        <div className="space-y-1">
          <Field label="Objetivo" value={formData.objetivoSite} />
          <Field label="Cliente ideal" value={formData.clienteIdeal} />
          <Field label="Finalidade" value={formData.finalidadeImoveis} />
          <Field label="História" value={formData.historia} />
        </div>
      </Section>

      <Separator />

      <Section title={STEP_TITLES[3]} step={3} onEdit={setStep}>
        <div className="space-y-1">
          <Field
            label="Navegação"
            value={(formData.navItens || []).map(
              (id: string) => NAV_ITENS.find((n) => n.id === id)?.label || id
            )}
          />
          {formData.navHamburguer && <Field label="Menu hambúrguer" value="Sim" />}
          <Field
            label="Seções"
            value={(formData.blocosSel || []).map(
              (id: string) => BLOCOS.find((b) => b.id === id)?.label || id
            )}
          />
        </div>
      </Section>

      <Separator />

      <Section title={STEP_TITLES[4]} step={4} onEdit={setStep}>
        <div className="space-y-1">
          <Field
            label="Listagens"
            value={`${(formData.listagens || []).length} listagem(ns)`}
          />
          <Field label="Card do imóvel" value={formData.cardInfo as string[]} />
        </div>
      </Section>

      <Separator />

      <Section title={STEP_TITLES[5]} step={5} onEdit={setStep}>
        <div className="space-y-1">
          <Field label="Links referência" value={formData.linksReferencia} />
          <Field label="Estética" value={formData.esteticaSites} />
          <Field label="Funcionalidades" value={formData.funcionalidades} />
          {formData.requisitosAdicionais && (
            <Field label="Requisitos extras" value={formData.requisitosAdicionais} />
          )}
        </div>
      </Section>

      <Separator />

      <Section title={STEP_TITLES[6]} step={6} onEdit={setStep}>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corPrimaria }}
            />
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corSecundaria }}
            />
            <div
              className="h-8 w-8 rounded border"
              style={{ backgroundColor: formData.corTerciaria }}
            />
          </div>
          <span className="font-mono text-xs text-muted-foreground">
            {formData.corPrimaria} / {formData.corSecundaria} /{" "}
            {formData.corTerciaria}
          </span>
        </div>
        {formData.logoFile && <p className="mt-2">Logo: {formData.logoFile}</p>}
      </Section>

      <Separator />

      <Section title={STEP_TITLES[7]} step={7} onEdit={setStep}>
        <div className="flex flex-wrap gap-2">
          {derivarElementos(formData).map((el) => {
            const escolhido = (formData.modelos || {})[el.id];
            if (el.id === "busca" && formData.semBusca) return null;
            if (el.id === "rodape" && formData.usarRodapeCustom)
              return (
                <Badge key={el.id} variant="secondary">
                  Rodapé: personalizado
                </Badge>
              );
            if (!escolhido) return null;
            return (
              <Badge key={el.id} variant="secondary">
                {el.label}: {escolhido}
              </Badge>
            );
          })}
        </div>
      </Section>

      <div className="mt-8 flex justify-between">
        <Button variant="outline" onClick={() => setStep(7)}>
          Voltar
        </Button>
        <Button size="lg" onClick={handleSubmit}>
          Enviar briefing e gerar layout
        </Button>
      </div>
    </div>
  );
}
