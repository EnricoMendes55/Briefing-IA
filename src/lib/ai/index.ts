export interface GenerateLayoutInput {
  referenceImages: { category: string; filename: string }[];
  logoPath: string;
  colors: { primary: string; secondary: string; tertiary: string };
  briefingSummary: string;
}

export interface GenerateLayoutResult {
  imagePath: string;
  provider: string;
}

export interface AIImageProvider {
  name: string;
  generateLayout(input: GenerateLayoutInput): Promise<GenerateLayoutResult>;
}

export function getProvider(): AIImageProvider {
  const name = process.env.AI_PROVIDER || "stub";
  switch (name) {
    case "gemini":
      throw new Error("Gemini provider not configured yet — use stub for now");
    case "openai":
      throw new Error("OpenAI provider not configured yet — use stub for now");
    default:
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      return require("./stub").stubProvider;
  }
}
