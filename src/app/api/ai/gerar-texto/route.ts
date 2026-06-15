import { NextResponse } from "next/server";

/**
 * Geração de texto via IA. Por enquanto stub — vai usar Gemini API quando
 * GEMINI_API_KEY estiver configurado em .env.local / Vercel env.
 *
 * Espera no body:
 *   { tipo: "historia" | "descricao" | ..., prompt: string, contexto?: any }
 * Retorna:
 *   { texto: string }
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

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      // Stub: simula geração — gera texto baseado no prompt + contexto.
      await new Promise((r) => setTimeout(r, 1200));
      const stub = stubGerarTexto(tipo, prompt, contexto);
      return NextResponse.json({ texto: stub, provider: "stub" });
    }

    // Quando GEMINI_API_KEY estiver presente, troca o stub pela chamada real ao Gemini.
    // TODO: implementar quando a chave chegar.
    const stub = stubGerarTexto(tipo, prompt, contexto);
    return NextResponse.json({ texto: stub, provider: "stub" });
  } catch {
    return NextResponse.json({ error: "Erro interno." }, { status: 500 });
  }
}

function stubGerarTexto(
  tipo: string,
  prompt: string,
  contexto?: Record<string, unknown>
): string {
  const nome =
    (contexto?.imobiliaria as string | undefined)?.trim() || "Nossa imobiliária";
  if (tipo === "historia") {
    return (
      `${nome} nasceu com o propósito de oferecer uma experiência imobiliária diferenciada, ` +
      `unindo conhecimento de mercado, atendimento próximo e curadoria cuidadosa de imóveis. ` +
      `Mais do que vender ou alugar, acreditamos que cada negociação representa um passo importante na vida das pessoas, ` +
      `seja para realizar o sonho do imóvel próprio, expandir o portfólio de investimentos ou ` +
      `encontrar o espaço perfeito para o próximo capítulo. ` +
      `Conte conosco para uma jornada transparente, ágil e construída sob medida para o que você procura. ` +
      `\n\n[Texto gerado pelo stub — IA real entra quando a GEMINI_API_KEY for configurada. Prompt recebido: "${prompt}"]`
    );
  }
  return `[stub] ${prompt}`;
}
