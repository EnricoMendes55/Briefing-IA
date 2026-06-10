// ============================================================================
// Helpers de validação e formatação dos campos do briefing.
// ============================================================================

// ---------- Redes sociais ----------
export interface RedeSocialConfig {
  id: string;
  label: string;
  /** Domínios aceitos para a URL desta rede. */
  domains: string[];
  placeholder: string;
}

export const REDES_SOCIAIS: RedeSocialConfig[] = [
  { id: "instagram", label: "Instagram", domains: ["instagram.com"], placeholder: "https://instagram.com/suaimobiliaria" },
  { id: "facebook", label: "Facebook", domains: ["facebook.com", "fb.com"], placeholder: "https://facebook.com/suaimobiliaria" },
  { id: "linkedin", label: "LinkedIn", domains: ["linkedin.com"], placeholder: "https://linkedin.com/company/suaimobiliaria" },
  { id: "youtube", label: "YouTube", domains: ["youtube.com", "youtu.be"], placeholder: "https://youtube.com/@suaimobiliaria" },
  { id: "tiktok", label: "TikTok", domains: ["tiktok.com"], placeholder: "https://tiktok.com/@suaimobiliaria" },
  { id: "x", label: "X (Twitter)", domains: ["x.com", "twitter.com"], placeholder: "https://x.com/suaimobiliaria" },
];

export function redeConfig(id: string): RedeSocialConfig | undefined {
  return REDES_SOCIAIS.find((r) => r.id === id);
}

/** Valida se a URL pertence ao domínio da rede social selecionada. */
export function validateSocialUrl(redeId: string, url: string): boolean {
  const rede = redeConfig(redeId);
  if (!rede || !url.trim()) return false;
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    const host = u.hostname.toLowerCase().replace(/^www\./, "");
    return rede.domains.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

// ---------- Telefone (BR) ----------
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length <= 2) return d;
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export function isValidPhone(value: string): boolean {
  const d = value.replace(/\D/g, "");
  return d.length === 10 || d.length === 11;
}

// ---------- E-mail ----------
export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

// ---------- CEP / Endereço (ViaCEP — gratuito, sem API key) ----------
export function maskCep(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 5) return d;
  return `${d.slice(0, 5)}-${d.slice(5)}`;
}

export interface ViaCepResult {
  logradouro: string;
  bairro: string;
  localidade: string;
  uf: string;
}

export async function lookupCep(cep: string): Promise<ViaCepResult | null> {
  const d = cep.replace(/\D/g, "");
  if (d.length !== 8) return null;
  try {
    const res = await fetch(`https://viacep.com.br/ws/${d}/json/`);
    const data = await res.json();
    if (data.erro) return null;
    return {
      logradouro: data.logradouro || "",
      bairro: data.bairro || "",
      localidade: data.localidade || "",
      uf: data.uf || "",
    };
  } catch {
    return null;
  }
}

// ---------- URL genérica ----------
export function isValidUrl(value: string): boolean {
  if (!value.trim()) return false;
  try {
    const u = new URL(value.startsWith("http") ? value : `https://${value}`);
    return !!u.hostname && u.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Monta a URL de embed de mapa do Google (sem necessidade de API key). */
export function mapEmbedUrl(query: string): string {
  return `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`;
}
