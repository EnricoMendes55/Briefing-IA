"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useWizard } from "../wizard-context";
import { StepNavigation } from "../step-navigation";
import type { RedeSocialItem, EnderecoData } from "@/lib/briefing-schema";
import {
  REDES_SOCIAIS,
  redeConfig,
  validateSocialUrl,
  maskPhone,
  isValidPhone,
  isValidEmail,
  maskCep,
  lookupCep,
  mapEmbedUrl,
} from "@/lib/form-helpers";

// ----------------------------------------------------------------------------
// Redes sociais estruturadas
// ----------------------------------------------------------------------------
function RedesSociaisInput() {
  const { formData, updateFormData } = useWizard();
  const sem = !!formData.semRedesSociais;
  const lista: RedeSocialItem[] = Array.isArray(formData.redesSociais)
    ? formData.redesSociais
    : [];

  function update(lista: RedeSocialItem[]) {
    updateFormData({ redesSociais: lista });
  }

  function add() {
    update([...lista, { rede: "instagram", url: "" }]);
  }

  function remove(i: number) {
    update(lista.filter((_, idx) => idx !== i));
  }

  function change(i: number, patch: Partial<RedeSocialItem>) {
    update(lista.map((item, idx) => (idx === i ? { ...item, ...patch } : item)));
  }

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Redes sociais *</Label>

      {!sem && (
        <div className="space-y-3">
          {lista.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Adicione ao menos uma rede social (ou marque a opção abaixo).
            </p>
          )}

          {lista.map((item, i) => {
            const cfg = redeConfig(item.rede);
            const invalid = item.url.trim() !== "" && !validateSocialUrl(item.rede, item.url);
            return (
              <div key={i} className="flex flex-col gap-2 sm:flex-row sm:items-start">
                <select
                  value={item.rede}
                  onChange={(e) => change(i, { rede: e.target.value })}
                  className="h-12 rounded-xl border border-input bg-card px-3 text-sm shadow-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/40 sm:w-44"
                >
                  {REDES_SOCIAIS.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.label}
                    </option>
                  ))}
                </select>
                <div className="flex-1">
                  <Input
                    value={item.url}
                    placeholder={cfg?.placeholder}
                    onChange={(e) => change(i, { url: e.target.value })}
                    aria-invalid={invalid}
                  />
                  {invalid && (
                    <p className="mt-1 text-xs text-destructive">
                      A URL precisa ser do {cfg?.label} (ex.: {cfg?.placeholder}).
                    </p>
                  )}
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(i)}
                  aria-label="Remover"
                  className="text-muted-foreground hover:text-destructive"
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </Button>
              </div>
            );
          })}

          <Button type="button" variant="outline" size="sm" onClick={add}>
            + Adicionar rede social
          </Button>
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2 pt-1">
        <Checkbox
          checked={sem}
          onCheckedChange={(v) => updateFormData({ semRedesSociais: !!v })}
        />
        <span className="text-sm">Não possuímos redes sociais</span>
      </label>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Endereço com CEP (ViaCEP) + mapa
// ----------------------------------------------------------------------------
const emptyEndereco: EnderecoData = {
  cep: "",
  logradouro: "",
  numero: "",
  complemento: "",
  bairro: "",
  cidade: "",
  uf: "",
};

function EnderecoInput() {
  const { formData, updateFormData } = useWizard();
  const sem = !!formData.semEndereco;
  const end: EnderecoData = formData.endereco || emptyEndereco;
  const [buscando, setBuscando] = useState(false);

  function set(patch: Partial<EnderecoData>) {
    updateFormData({ endereco: { ...end, ...patch } });
  }

  async function onCepBlur() {
    if (end.cep.replace(/\D/g, "").length !== 8) return;
    setBuscando(true);
    const res = await lookupCep(end.cep);
    setBuscando(false);
    if (res) {
      set({
        logradouro: res.logradouro || end.logradouro,
        bairro: res.bairro || end.bairro,
        cidade: res.localidade || end.cidade,
        uf: res.uf || end.uf,
      });
    }
  }

  const mapQuery =
    end.logradouro && end.cidade
      ? `${end.logradouro}, ${end.numero} - ${end.bairro}, ${end.cidade} - ${end.uf}`
      : "";

  return (
    <div className="space-y-3">
      <Label className="text-base font-semibold">Endereço da imobiliária *</Label>

      {!sem && (
        <div className="space-y-3">
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">CEP</Label>
              <Input
                value={end.cep}
                placeholder="00000-000"
                onChange={(e) => set({ cep: maskCep(e.target.value) })}
                onBlur={onCepBlur}
                inputMode="numeric"
              />
              {buscando && (
                <p className="text-xs text-muted-foreground">Buscando endereço…</p>
              )}
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Logradouro</Label>
              <Input
                value={end.logradouro}
                placeholder="Rua / Avenida"
                onChange={(e) => set({ logradouro: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Número</Label>
              <Input
                value={end.numero}
                placeholder="123"
                onChange={(e) => set({ numero: e.target.value })}
              />
            </div>
            <div className="space-y-1.5 sm:col-span-2">
              <Label className="text-xs text-muted-foreground">Complemento</Label>
              <Input
                value={end.complemento || ""}
                placeholder="Sala, andar (opcional)"
                onChange={(e) => set({ complemento: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Bairro</Label>
              <Input
                value={end.bairro}
                onChange={(e) => set({ bairro: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Cidade</Label>
              <Input
                value={end.cidade}
                onChange={(e) => set({ cidade: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">UF</Label>
              <Input
                value={end.uf}
                maxLength={2}
                onChange={(e) => set({ uf: e.target.value.toUpperCase() })}
              />
            </div>
          </div>

          {mapQuery && (
            <div className="overflow-hidden rounded-xl border border-border">
              <iframe
                title="Mapa do endereço"
                src={mapEmbedUrl(mapQuery)}
                className="h-56 w-full"
                loading="lazy"
              />
            </div>
          )}
        </div>
      )}

      <label className="flex cursor-pointer items-center gap-2 pt-1">
        <Checkbox
          checked={sem}
          onCheckedChange={(v) => updateFormData({ semEndereco: !!v })}
        />
        <span className="text-sm">Não possuímos endereço</span>
      </label>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Etapa 1
// ----------------------------------------------------------------------------
export function Step1Identificacao() {
  const { formData, updateFormData } = useWizard();

  function validate(): boolean {
    if (!formData.codigoImobiliaria?.trim())
      return fail("Informe o código da imobiliária.");
    if (!formData.nomeResponsavel || formData.nomeResponsavel.trim().length < 2)
      return fail("Informe o nome do responsável.");
    if (!formData.email || !isValidEmail(formData.email))
      return fail("Informe um e-mail válido.");
    if (!formData.telefone || !isValidPhone(formData.telefone))
      return fail("Informe um telefone válido com DDD.");
    if (!formData.imobiliaria || formData.imobiliaria.trim().length < 2)
      return fail("Informe o nome da imobiliária.");

    if (!formData.semRedesSociais) {
      const lista: RedeSocialItem[] = Array.isArray(formData.redesSociais)
        ? formData.redesSociais
        : [];
      if (lista.length === 0)
        return fail("Adicione ao menos uma rede social ou marque 'Não possuímos'.");
      for (const item of lista) {
        if (!validateSocialUrl(item.rede, item.url))
          return fail(`Verifique a URL do ${redeConfig(item.rede)?.label}.`);
      }
    }

    if (!formData.semEndereco) {
      const e = formData.endereco;
      if (!e || !e.logradouro || !e.numero || !e.cidade || !e.uf)
        return fail("Preencha o endereço ou marque 'Não possuímos endereço'.");
    }

    return true;
  }

  function fail(msg: string): boolean {
    alert(msg);
    return false;
  }

  return (
    <div className="space-y-6">
      <p className="text-muted-foreground">
        Preencha os dados de contato e da imobiliária.
      </p>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="codigoImobiliaria">Código da imobiliária *</Label>
          <Input
            id="codigoImobiliaria"
            placeholder="Ex.: IMOB-2026-001"
            value={formData.codigoImobiliaria || ""}
            onChange={(e) => updateFormData({ codigoImobiliaria: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="nomeResponsavel">Nome do responsável *</Label>
          <Input
            id="nomeResponsavel"
            placeholder="Quem está preenchendo o briefing"
            value={formData.nomeResponsavel || ""}
            onChange={(e) => updateFormData({ nomeResponsavel: e.target.value })}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            inputMode="email"
            placeholder="contato@imobiliaria.com.br"
            value={formData.email || ""}
            onChange={(e) => updateFormData({ email: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="telefone">Telefone *</Label>
          <Input
            id="telefone"
            type="tel"
            inputMode="tel"
            placeholder="(11) 99999-9999"
            value={formData.telefone || ""}
            onChange={(e) => updateFormData({ telefone: maskPhone(e.target.value) })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="imobiliaria">Nome da imobiliária *</Label>
        <Input
          id="imobiliaria"
          placeholder="Imobiliária Exemplo"
          value={formData.imobiliaria || ""}
          onChange={(e) => updateFormData({ imobiliaria: e.target.value })}
        />
      </div>

      <RedesSociaisInput />

      <EnderecoInput />

      <StepNavigation onNext={validate} showBack={false} />
    </div>
  );
}
