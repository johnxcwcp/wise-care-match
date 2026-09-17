
import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  const progress = Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));

  return (
    <div className="max-w-md mx-auto mb-8">
      <div className="relative h-1.5 w-full overflow-hidden rounded-full bg-border/60">
        <div
          className="progress-fill relative h-full rounded-full bg-cwcp-blue transition-[width] duration-500 ease-out"
          style={{ width: `${progress}%` }}
        >
          <span className="progress-sheen pointer-events-none absolute inset-y-0 right-0 w-10 rounded-full bg-gradient-to-r from-transparent via-white/40 to-transparent" />
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
