
import React from "react";

interface ProgressStepsProps {
  currentStep: number;
  totalSteps: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ currentStep, totalSteps }) => {
  const progressPercentage = (currentStep / totalSteps) * 100;
  
  return (
    <div className="w-full max-w-md mx-auto mb-6">
      <div className="relative">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-cwcp-blue h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {Array.from({ length: totalSteps }, (_, index) => (
            <div
              key={index}
              className={`w-3 h-3 rounded-full transition-colors duration-200 ${
                index < currentStep 
                  ? 'bg-cwcp-blue' 
                  : index === currentStep - 1 
                  ? 'bg-cwcp-blue' 
                  : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProgressSteps;
