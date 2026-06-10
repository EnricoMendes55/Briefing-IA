"use client";

import { Button } from "@/components/ui/button";
import { useWizard } from "./wizard-context";

interface StepNavigationProps {
  onNext?: () => boolean | void;
  showBack?: boolean;
  nextLabel?: string;
}

export function StepNavigation({
  onNext,
  showBack = true,
  nextLabel = "Próximo",
}: StepNavigationProps) {
  const { prevStep, nextStep, currentStep } = useWizard();

  function handleNext() {
    if (onNext) {
      const result = onNext();
      if (result === false) return;
    }
    nextStep();
  }

  return (
    <div className="mt-10 flex justify-between border-t border-border pt-6">
      {showBack && currentStep > 1 ? (
        <Button type="button" variant="outline" size="lg" onClick={prevStep}>
          Voltar
        </Button>
      ) : (
        <div />
      )}
      <Button type="button" size="lg" onClick={handleNext}>
        {nextLabel}
      </Button>
    </div>
  );
}
