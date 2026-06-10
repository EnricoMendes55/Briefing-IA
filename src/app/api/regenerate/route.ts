import { NextResponse } from "next/server";
import { getBriefing, updateBriefing } from "@/lib/briefing-store";
import { getProvider } from "@/lib/ai";

const MAX_REGENERATIONS = 2;

export async function POST(request: Request) {
  try {
    const { briefingId } = await request.json();
    const briefing = getBriefing(briefingId);

    if (!briefing) {
      return NextResponse.json(
        { error: "Briefing não encontrado" },
        { status: 404 }
      );
    }

    if (briefing.regeneracoes >= MAX_REGENERATIONS) {
      return NextResponse.json(
        { error: "Limite de regerações atingido (máximo 2)" },
        { status: 429 }
      );
    }

    const data = briefing.data as Record<string, string>;
    const provider = getProvider();

    const modelos: Record<string, string> =
      (data.modelos as unknown as Record<string, string>) || {};
    const result = await provider.generateLayout({
      referenceImages: Object.entries(modelos).map(([category, filename]) => ({
        category,
        filename,
      })),
      logoPath: data.logoFile || "",
      colors: {
        primary: data.corPrimaria || "#1a365d",
        secondary: data.corSecundaria || "#e53e3e",
        tertiary: data.corTerciaria || "#edf2f7",
      },
      briefingSummary: `Imobiliária: ${data.imobiliaria || "N/A"}. Sensação: ${data.sensacaoDesign || "N/A"}.`,
    });

    updateBriefing(briefingId, {
      generatedImagePath: result.imagePath,
      iaProvider: result.provider,
      regeneracoes: briefing.regeneracoes + 1,
      status: "gerado",
    });

    return NextResponse.json({
      imagePath: result.imagePath,
      provider: result.provider,
      regeneracoesRestantes: MAX_REGENERATIONS - briefing.regeneracoes - 1,
    });
  } catch (error) {
    console.error("Regeneration failed:", error);
    return NextResponse.json(
      { error: "Erro ao regenerar imagem" },
      { status: 500 }
    );
  }
}
