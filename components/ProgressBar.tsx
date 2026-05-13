"use client";

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  label?: string;
}

export default function ProgressBar({
  currentStep,
  totalSteps,
  label,
}: ProgressBarProps) {
  const percentage = (currentStep / totalSteps) * 100;

  return (
    <div className="w-full space-y-1.5">
      <div className="flex justify-between items-center text-xs">
        <span className="text-text-secondary">
          Step {currentStep} of {totalSteps}
        </span>
        {label && <span className="text-accent text-xs font-medium">{label}</span>}
      </div>
      <div className="w-full h-1.5 bg-bg-card rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
