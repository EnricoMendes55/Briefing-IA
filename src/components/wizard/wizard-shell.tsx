"use client";

import { useWizard } from "./wizard-context";
import { STEP_TITLES, TOTAL_STEPS } from "@/lib/briefing-schema";

import { Step1Identificacao } from "./steps/step1-identificacao";
import { Step2Estrategia } from "./steps/step2-estrategia";
import { Step3Conteudo } from "./steps/step3-conteudo";
import { StepImoveis } from "./steps/step-imoveis";
import { Step4Referencias } from "./steps/step4-referencias";
import { Step5Identidade } from "./steps/step5-identidade";
import { Step6Modelos } from "./steps/step6-modelos";
import { Step7Revisao } from "./steps/step7-revisao";

// Mapa etapa -> componente. Os nomes de arquivo são legados; a ordem segue aqui.
const steps: Record<number, React.ComponentType> = {
  1: Step1Identificacao,
  2: Step2Estrategia,
  3: Step3Conteudo, // navegação + seções de conteúdo
  4: StepImoveis, // tipos de imóveis + informações do card
  5: Step4Referencias,
  6: Step5Identidade,
  7: Step6Modelos,
  8: Step7Revisao,
};

const stepDescriptions: Record<number, string> = {
  1: "Dados de contato e da imobiliária",
  2: "Objetivos e público-alvo",
  3: "Navegação e seções do site",
  4: "Tipos de imóveis e card",
  5: "Sites e materiais de referência",
  6: "Logo e cores da marca",
  7: "Escolha dos modelos visuais",
  8: "Confira e envie",
};

export function WizardShell() {
  const { currentStep, setStep } = useWizard();
  const StepComponent = steps[currentStep];

  return (
    <div className="flex flex-1 flex-col lg:flex-row">
      {/* Sidebar de etapas */}
      <aside className="bg-gradient-to-b from-[#3B71A5] via-[#3a6da0] to-[#2c5680] px-6 py-7 text-primary-foreground shadow-xl lg:w-96 lg:shrink-0 lg:px-9 lg:py-12">
        <div className="lg:sticky lg:top-12">
          <p className="text-sm font-medium uppercase tracking-wide text-primary-foreground/70">
            Briefing de Layout
          </p>
          <h1 className="mt-1 text-2xl font-bold">Apresenta.me</h1>

          <ol className="mt-10 hidden space-y-2 lg:block">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => {
              const step = i + 1;
              const isActive = step === currentStep;
              const isDone = step < currentStep;
              return (
                <li key={step}>
                  <button
                    type="button"
                    onClick={() => setStep(step)}
                    className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-left transition-all ${
                      isActive
                        ? "bg-primary-foreground/20 shadow-lg ring-1 ring-primary-foreground/30"
                        : "hover:bg-primary-foreground/10"
                    }`}
                  >
                    <span
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-semibold ${
                        isActive
                          ? "bg-primary-foreground text-primary"
                          : isDone
                            ? "bg-primary-foreground/30 text-primary-foreground"
                            : "border border-primary-foreground/30"
                      }`}
                    >
                      {isDone ? (
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={3}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      ) : (
                        step
                      )}
                    </span>
                    <span>
                      <span className="block text-sm font-medium leading-tight">
                        {STEP_TITLES[step]}
                      </span>
                      <span className="block text-xs text-primary-foreground/60">
                        {stepDescriptions[step]}
                      </span>
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>

          {/* Progresso mobile */}
          <div className="mt-4 flex gap-1.5 lg:hidden">
            {Array.from({ length: TOTAL_STEPS }, (_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full ${
                  i + 1 <= currentStep
                    ? "bg-primary-foreground"
                    : "bg-primary-foreground/25"
                }`}
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Conteúdo da etapa */}
      <main className="flex-1 overflow-y-auto px-4 py-6 sm:px-8 lg:px-12 lg:py-10">
        <div className="mx-auto max-w-3xl">
          <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-xl shadow-primary/5">
            <div className="border-b border-border bg-secondary/60 px-6 py-6 sm:px-10 sm:py-8">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary">
                Etapa {currentStep} de {TOTAL_STEPS}
              </p>
              <h2 className="mt-1 text-3xl font-bold tracking-tight text-secondary-foreground">
                {STEP_TITLES[currentStep]}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {stepDescriptions[currentStep]}
              </p>
            </div>
            <div className="px-6 py-7 sm:px-10 sm:py-9">
              <StepComponent />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
