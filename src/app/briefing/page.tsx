"use client";

import { useState } from "react";
import { WizardProvider } from "@/components/wizard/wizard-context";
import { WizardShell } from "@/components/wizard/wizard-shell";
import { ModeChoice, type BriefingMode } from "@/components/mode-choice";
import { AutoUrlPrompt } from "@/components/auto-url-prompt";

type Stage = "choice" | "auto-url" | "wizard";

export default function BriefingPage() {
  const [stage, setStage] = useState<Stage>("choice");
  const [mode, setMode] = useState<BriefingMode>("manual");
  const [siteAtual, setSiteAtual] = useState<string>("");

  function handleChoose(m: BriefingMode) {
    setMode(m);
    setStage(m === "automatico" ? "auto-url" : "wizard");
  }

  if (stage === "choice") {
    return <ModeChoice onChoose={handleChoose} />;
  }

  if (stage === "auto-url") {
    return (
      <AutoUrlPrompt
        onBack={() => setStage("choice")}
        onSubmit={(url) => {
          setSiteAtual(url);
          // TODO: chamar /api/scrape com a URL e usar o resultado como initialData.
          setStage("wizard");
        }}
      />
    );
  }

  return (
    <WizardProvider
      initialData={{
        modoPreenchimento: mode,
        siteAtual: siteAtual || undefined,
      }}
    >
      <WizardShell />
    </WizardProvider>
  );
}
