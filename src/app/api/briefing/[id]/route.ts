import { NextResponse } from "next/server";
import { getBriefing } from "@/lib/briefing-store";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const briefing = getBriefing(id);

  if (!briefing) {
    return NextResponse.json({ error: "Não encontrado" }, { status: 404 });
  }

  return NextResponse.json(briefing);
}
