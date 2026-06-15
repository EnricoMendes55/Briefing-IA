import { NextResponse } from "next/server";
import { geminiAvailable, geminiGenerate } from "@/lib/ai/gemini";

/**
 * Geração de texto via Gemini. Recebe um prompt livre + contexto e devolve
 * texto pronto pra colar no formulário.
 *
 * Body esperado: { prompt: string, contexto?: Record<string, unknown> }
 * Resposta:      { texto: string, provider: "gemini" | "stub" }
 */
export async function POST(request: Request) {
  try {
    const { prompt, contexto } = await request.json();
    const tipo = (contexto?.tipo as string | undefined) || "geral";

    if (!prompt || prompt.trim().length < 5) {
      return NextResponse.json(
        { error: "Prompt curto demais. Detalhe um pouco mais o que você quer." },
        { status: 400 }
      );
    }

    if (!geminiAvailable()) {
      return NextResponse.json({
        texto: stubFallback(tipo, prompt, contexto),
        provider: "stub",
      });
    }

    const { systemPrompt, userPrompt } = montarPrompt(tipo, prompt, contexto);

    const texto = await geminiGenerate({
      prompt: userPrompt,
      systemPrompt,
      temperature: 0.8,
      maxOutputTokens: 800,
    });

    return NextResponse.json({ texto, provider: "gemini" });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Erro interno.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

// ----------------------------------------------------------------------------
// Prompts por tipo
// ----------------------------------------------------------------------------
function montarPrompt(
  tipo: string,
  prompt: string,
  contexto?: Record<string, unknown>
): { systemPrompt: string; userPrompt: string } {
  if (tipo === "historia") {
    const imobiliaria =
      (contexto?.imobiliaria as string | undefined)?.trim() ||
      "a imobiliária";
    const objetivo = (contexto?.objetivo as string | undefined) || "";
    const clienteIdeal = (contexto?.clienteIdeal as string | undefined) || "";

    const systemPrompt = `Você é um copywriter especialista em sites de imobiliárias brasileiras.
Sua tarefa é escrever o texto "Quem Somos" / "Sobre Nós" da página inicial.

Regras:
- Português brasileiro, formal-acolhedor.
- 1 a 2 parágrafos, no total entre 350 e 600 caracteres.
- Tom profissional, transmita confiança e proximidade.
- Evite clichês ("realizando sonhos", "transformando vidas").
- Evite menções a datas específicas ou fatos que você não saiba.
- Não use emojis.
- Não use markdown — texto corrido.
- Não adicione título ("Quem Somos", "Sobre Nós") no início.
- Responda APENAS o texto final, sem introduções tipo "Aqui está:" ou aspas.`;

    const userPrompt = `Imobiliária: ${imobiliaria}
${objetivo ? `Objetivo do site: ${objetivo}\n` : ""}${clienteIdeal ? `Cliente ideal: ${clienteIdeal}\n` : ""}
O cliente descreveu assim a história/proposta da imobiliária:
"""
${prompt}
"""

Escreva o texto "Sobre Nós" pronto pra colar no site.`;

    return { systemPrompt, userPrompt };
  }

  // Genérico — útil pra outros usos futuros (descrição de blocos, banners, etc).
  const systemPrompt = `Você escreve textos curtos e claros em português brasileiro para sites de imobiliárias. Sem markdown, sem emojis, sem introduções tipo "Aqui está:". Responda só o texto final.`;
  return { systemPrompt, userPrompt: prompt };
}

// ----------------------------------------------------------------------------
// Fallback quando não há chave
// ----------------------------------------------------------------------------
function stubFallback(
  tipo: string,
  prompt: string,
  contexto?: Record<string, unknown>
): string {
  const nome =
    (contexto?.imobiliaria as string | undefined)?.trim() ||
    "Nossa imobiliária";
  if (tipo === "historia") {
    return (
      `${nome} nasceu com o propósito de oferecer uma experiência imobiliária diferenciada, ` +
      `unindo conhecimento de mercado, atendimento próximo e curadoria cuidadosa de imóveis.\n\n` +
      `[Stub — GEMINI_API_KEY não configurada. Prompt: "${prompt}"]`
    );
  }
  return `[stub] ${prompt}`;
}
