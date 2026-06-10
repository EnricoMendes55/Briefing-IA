"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import type { WizardData, Plano } from "@/lib/briefing-schema";
import { TOTAL_STEPS } from "@/lib/briefing-schema";

const STORAGE_KEY = "briefing-wizard-data-v2";
const STORAGE_TTL = 7 * 24 * 60 * 60 * 1000; // 7 days

type PartialBriefing = WizardData;

interface WizardState {
  currentStep: number;
  formData: PartialBriefing;
  isSubmitting: boolean;
}

interface WizardContextValue extends WizardState {
  setStep: (step: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  updateFormData: (data: Partial<PartialBriefing>) => void;
  setIsSubmitting: (v: boolean) => void;
  resetWizard: () => void;
}

const WizardContext = createContext<WizardContextValue | null>(null);

export function useWizard() {
  const ctx = useContext(WizardContext);
  if (!ctx) throw new Error("useWizard must be used within WizardProvider");
  return ctx;
}

function loadFromStorage(): PartialBriefing | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const { data, savedAt } = JSON.parse(raw);
    if (Date.now() - savedAt > STORAGE_TTL) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function saveToStorage(data: PartialBriefing) {
  if (typeof window === "undefined") return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({ data, savedAt: Date.now() })
  );
}

const defaultData: PartialBriefing = {
  corPrimaria: "#3b71a5",
  corSecundaria: "#dde4ec",
  corTerciaria: "#1a2733",
  semRedesSociais: false,
  redesSociais: [],
  semEndereco: false,
};

export function WizardProvider({
  children,
  plano = "premium",
  initialData,
}: {
  children: ReactNode;
  plano?: Plano;
  initialData?: PartialBriefing;
}) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PartialBriefing>({
    ...defaultData,
    plano,
    ...(initialData || {}),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const saved = loadFromStorage();
    if (saved) setFormData((prev) => ({ ...prev, ...saved }));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveToStorage(formData);
  }, [formData, hydrated]);

  const updateFormData = useCallback((data: Partial<PartialBriefing>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const nextStep = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }, []);

  const prevStep = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 1));
  }, []);

  const setStep = useCallback((step: number) => {
    setCurrentStep(Math.max(1, Math.min(step, TOTAL_STEPS)));
  }, []);

  const resetWizard = useCallback(() => {
    setFormData(defaultData);
    setCurrentStep(1);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <WizardContext.Provider
      value={{
        currentStep,
        formData,
        isSubmitting,
        setStep,
        nextStep,
        prevStep,
        updateFormData,
        setIsSubmitting,
        resetWizard,
      }}
    >
      {children}
    </WizardContext.Provider>
  );
}
