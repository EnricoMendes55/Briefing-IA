"use client";

import { WizardProvider } from "@/components/wizard/wizard-context";
import { WizardShell } from "@/components/wizard/wizard-shell";

export default function BriefingPage() {
  return (
    <WizardProvider>
      <WizardShell />
    </WizardProvider>
  );
}
