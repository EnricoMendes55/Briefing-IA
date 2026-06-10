import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { createBriefing, updateBriefing } from "@/lib/briefing-store";
import { getProvider } from "@/lib/ai";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const id = uuidv4();

    createBriefing(id, body);

    const provider = getProvider();
    const modelos: Record<string, string> = body.modelos || {};
    const referenceImages = Object.entries(modelos).map(([category, filename]) => ({
      category,
      filename: filename as string,
    }));

    try {
      const result = await provider.generateLayout({
        referenceImages,
        logoPath: body.logoFile || "",
        colors: {
          primary: body.corPrimaria || "#1a365d",
          secondary: body.corSecundaria || "#e53e3e",
          tertiary: body.corTerciaria || "#edf2f7",
        },
        briefingSummary: `Imobiliária: ${body.imobiliaria || "N/A"}. Sensação: ${body.sensacaoDesign || "N/A"}.`,
      });

      updateBriefing(id, {
        generatedImagePath: result.imagePath,
        iaProvider: result.provider,
        status: "gerado",
      });

      return NextResponse.json({
        id,
        imagePath: result.imagePath,
        provider: result.provider,
      });
    } catch (aiError) {
      updateBriefing(id, { status: "erro" });
      console.error("AI generation failed:", aiError);
      return NextResponse.json({
        id,
        imagePath: null,
        error: "Geração de imagem falhou. Tente regenerar.",
      });
    }
  } catch (error) {
    console.error("Briefing creation failed:", error);
    return NextResponse.json(
      { error: "Erro ao processar briefing" },
      { status: 500 }
    );
  }
}
