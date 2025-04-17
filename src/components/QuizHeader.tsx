
import React from "react";
import { cn } from "@/lib/utils";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ currentStep, totalSteps, className }) => {
  return (
    <div className={cn("w-full mb-8", className)}>
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-sm font-medium text-cwcp-darkgray">
          Step {currentStep} of {totalSteps}
        </h2>
        <span className="text-sm font-medium text-cwcp-darkgray">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-cwcp-lightgray h-2 rounded-full">
        <div
          className="bg-cwcp-blue h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizHeader;
