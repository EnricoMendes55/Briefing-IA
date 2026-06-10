import type { AIImageProvider, GenerateLayoutInput } from "./index";

export const stubProvider: AIImageProvider = {
  name: "stub",
  async generateLayout(input: GenerateLayoutInput) {
    await new Promise((r) => setTimeout(r, 3000));

    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1800" viewBox="0 0 1200 1800">
  <rect width="1200" height="1800" fill="#f8f9fa"/>

  <!-- Topo -->
  <rect y="0" width="1200" height="120" fill="${input.colors.primary}"/>
  <text x="600" y="70" text-anchor="middle" fill="white" font-size="28" font-family="Arial">
    TOPO — ${input.referenceImages.find(r => r.category === "topo")?.filename || "N/A"}
  </text>

  <!-- Banner -->
  <rect y="120" width="1200" height="500" fill="${input.colors.secondary}"/>
  <text x="600" y="390" text-anchor="middle" fill="white" font-size="32" font-family="Arial">
    BANNER / HERO
  </text>
  <text x="600" y="430" text-anchor="middle" fill="white" font-size="18" font-family="Arial">
    ${input.referenceImages.find(r => r.category === "banner")?.filename || "N/A"}
  </text>

  <!-- Cards -->
  <rect y="620" width="1200" height="600" fill="#ffffff"/>
  <text x="600" y="660" text-anchor="middle" fill="${input.colors.primary}" font-size="24" font-family="Arial">
    IMÓVEIS EM DESTAQUE
  </text>
  ${[0, 1, 2].map(i => `
    <rect x="${60 + i * 380}" y="690" width="340" height="480" rx="12" fill="#f0f0f0" stroke="${input.colors.tertiary}" stroke-width="2"/>
    <rect x="${60 + i * 380}" y="690" width="340" height="220" rx="12" fill="#ddd"/>
    <text x="${230 + i * 380}" y="960" text-anchor="middle" fill="#333" font-size="16" font-family="Arial">Imóvel ${i + 1}</text>
    <text x="${230 + i * 380}" y="990" text-anchor="middle" fill="${input.colors.primary}" font-size="20" font-family="Arial" font-weight="bold">R$ 450.000</text>
  `).join("")}

  <!-- Rodapé -->
  <rect y="1620" width="1200" height="180" fill="${input.colors.primary}"/>
  <text x="600" y="1700" text-anchor="middle" fill="white" font-size="20" font-family="Arial">
    RODAPÉ — ${input.referenceImages.find(r => r.category === "rodape")?.filename || "N/A"}
  </text>
  <text x="600" y="1730" text-anchor="middle" fill="rgba(255,255,255,0.7)" font-size="14" font-family="Arial">
    Layout gerado por IA (stub) • Cores: ${input.colors.primary} / ${input.colors.secondary} / ${input.colors.tertiary}
  </text>
</svg>`;

    const fs = await import("fs");
    const path = await import("path");
    const dir = path.join(process.cwd(), "public", "uploads", "generated");
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filename = `layout-${Date.now()}.svg`;
    fs.writeFileSync(path.join(dir, filename), svgContent, "utf-8");

    return {
      imagePath: `/uploads/generated/${filename}`,
      provider: "stub",
    };
  },
};
