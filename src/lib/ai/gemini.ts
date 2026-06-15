// Cliente leve do Google Gemini via REST (sem SDK pra manter as deps pequenas).
// Documentação: https://ai.google.dev/api/generate-content

const DEFAULT_MODEL = "gemini-2.5-flash";

interface GeminiGenerateOptions {
  prompt: string;
  /** Instrução de sistema (papel/persona/regras gerais). */
  systemPrompt?: string;
  /** Modelo Gemini. Padrão: gemini-2.5-flash (free tier rápido). */
  model?: string;
  /** 0–2, default 0.7. Mais baixo = mais determinístico. */
  temperature?: number;
  /** Limite de tokens da resposta. Default 1024. */
  maxOutputTokens?: number;
}

/**
 * Gera texto via Gemini. Retorna o texto puro ou lança erro descritivo.
 * Lê a chave de process.env.GEMINI_API_KEY.
 */
export async function geminiGenerate(
  opts: GeminiGenerateOptions
): Promise<string> {
  const key = process.env.GEMINI_API_KEY;
  if (!key) {
    throw new Error("GEMINI_API_KEY não configurada");
  }
  const model = opts.model || DEFAULT_MODEL;
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${key}`;

  const body: Record<string, unknown> = {
    contents: [{ role: "user", parts: [{ text: opts.prompt }] }],
    generationConfig: {
      temperature: opts.temperature ?? 0.7,
      maxOutputTokens: opts.maxOutputTokens ?? 1024,
    },
  };

  if (opts.systemPrompt) {
    body.systemInstruction = { parts: [{ text: opts.systemPrompt }] };
  }

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini HTTP ${res.status}: ${txt.slice(0, 400)}`);
  }

  const data = (await res.json()) as {
    candidates?: {
      content?: { parts?: { text?: string }[] };
      finishReason?: string;
    }[];
  };

  const texto = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!texto) {
    throw new Error("Gemini não retornou texto (resposta vazia).");
  }
  return texto.trim();
}

/** True quando a chave Gemini está disponível no ambiente. */
export function geminiAvailable(): boolean {
  return !!process.env.GEMINI_API_KEY;
}
