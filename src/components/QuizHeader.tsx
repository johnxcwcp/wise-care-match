
import React from "react";
import ProgressSteps from "./ProgressSteps";

interface QuizHeaderProps {
  currentStep: number;
  totalSteps: number;
}

const QuizHeader: React.FC<QuizHeaderProps> = ({ currentStep, totalSteps }) => {
  return (
    <div className="mb-8">
      <ProgressSteps currentStep={currentStep} totalSteps={totalSteps} />
      <div className="text-center">
        <p className="text-cwcp-darkgray">
          Question {currentStep} of {totalSteps}
        </p>
      </div>
    </div>
  );
};

export default QuizHeader;
