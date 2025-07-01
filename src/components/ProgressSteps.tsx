
import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="flex justify-center items-center gap-2 mb-8">
      {Array.from({ length: totalSteps }, (_, index) => (
        <div
          key={index}
          className={`w-8 h-2 rounded-full transition-colors duration-300 ${
            index < currentStep 
              ? 'bg-cwcp-blue' 
              : 'bg-gray-200'
          }`}
        />
      ))}
    </div>
  );
};

export default ProgressSteps;
