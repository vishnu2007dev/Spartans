"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
  StepperNav,
  StepperSeparator,
  StepperTrigger,
} from "@/components/reui/stepper";

const steps = [1, 2, 3, 4, 5, 6];

interface OnboardingStepperProps {
  currentStep: number;
  backPath?: string;
  nextPath?: string;
  className?: string;
}

export function OnboardingStepper({ currentStep, backPath, nextPath, className }: OnboardingStepperProps) {
  const router = useRouter();

  const navBtn = (path: string | undefined, icon: React.ReactNode, label: string) =>
    path ? (
      <button
        type="button"
        onClick={() => router.push(path)}
        className="flex items-center justify-center size-8 shrink-0 rounded-lg transition-colors hover:bg-[var(--accent-soft)]"
        style={{ border: "1px solid var(--border)", color: "var(--text-muted)" }}
        aria-label={label}
      >
        {icon}
      </button>
    ) : (
      <div className="size-8 shrink-0" />
    );

  return (
    <div className="flex items-center gap-4 w-full">
      {navBtn(backPath, <ArrowLeft size={15} />, "Go back")}

      <Stepper value={currentStep} className={className ?? "flex-1"}>
        <StepperNav>
          {steps.map((step) => (
            <StepperItem key={step} step={step}>
              <StepperTrigger>
                <StepperIndicator>{step}</StepperIndicator>
              </StepperTrigger>
              {step < steps.length && (
                <StepperSeparator className="group-data-[state=completed]/step:bg-primary" />
              )}
            </StepperItem>
          ))}
        </StepperNav>
      </Stepper>

      {navBtn(nextPath, <ArrowRight size={15} />, "Go forward")}
    </div>
  );
}
