"use client";

export type BriefingMode = "manual" | "automatico";

interface ModeChoiceProps {
  onChoose: (mode: BriefingMode) => void;
}

export function ModeChoice({ onChoose }: ModeChoiceProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="mx-auto w-full max-w-4xl space-y-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-4 py-1.5 text-sm font-semibold text-primary">
            Apresenta.me · Briefing de layout
          </span>
          <h1 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Como você quer começar?
          </h1>
          <p className="mt-2 text-muted-foreground">
            Escolha o jeito de preencher o briefing. Dá pra mudar depois.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <ChoiceCard
            icon={
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931z" />
              </svg>
            }
            title="Preenchimento manual"
            description="Você responde cada etapa com calma, preenchendo tudo do zero. Indicado quando você quer controle total das respostas."
            badge="~10 min"
            cta="Preencher manualmente"
            onClick={() => onChoose("manual")}
          />
          <ChoiceCard
            icon={
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
              </svg>
            }
            title="Preenchimento automatizado"
            description="A gente analisa o site atual da sua imobiliária e pré-preenche os campos. Você só revisa, ajusta o que quiser e segue."
            badge="~3 min"
            cta="Analisar meu site atual"
            highlight
            onClick={() => onChoose("automatico")}
          />
        </div>
      </div>
    </div>
  );
}

function ChoiceCard({
  icon,
  title,
  description,
  badge,
  cta,
  highlight,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge: string;
  cta: string;
  highlight?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex flex-col items-start gap-4 rounded-3xl border-2 bg-card p-7 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg ${
        highlight
          ? "border-primary/40 ring-1 ring-primary/20 hover:border-primary"
          : "border-border hover:border-primary/40"
      }`}
    >
      <span className={`flex h-12 w-12 items-center justify-center rounded-2xl ${highlight ? "bg-primary text-primary-foreground" : "bg-secondary text-primary"}`}>
        {icon}
      </span>

      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold">{title}</h2>
          <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${highlight ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
            {badge}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <span
        className={`mt-2 inline-flex h-11 items-center gap-1 rounded-xl px-5 text-sm font-medium ${
          highlight
            ? "bg-primary text-primary-foreground"
            : "border border-border bg-background"
        }`}
      >
        {cta}
        <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </button>
  );
}
