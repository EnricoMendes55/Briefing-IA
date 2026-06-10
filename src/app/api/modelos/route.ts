import { NextResponse } from "next/server";
import { modelosDoElemento, modeloPath } from "@/lib/models-config";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const elemento = searchParams.get("category");

  if (!elemento) {
    return NextResponse.json({ error: "Missing category" }, { status: 400 });
  }

  const models = modelosDoElemento(elemento).map((m) => ({
    name: m.id,
    label: m.label,
    plano: m.plano,
    path: modeloPath(elemento, m.id),
  }));

  return NextResponse.json({ models });
}
