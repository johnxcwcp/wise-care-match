
import React from "react";
import { QuizQuestion } from "@/types";
import ClickableOption from "@/components/ui/clickable-option";

interface Step0ServicesProps {
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  question: QuizQuestion;
}

const Step0Services: React.FC<Step0ServicesProps> = ({
  selectedServices,
  setSelectedServices,
  question
}) => {
  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  return (
    <div>
      <h3 className="text-2xl font-medium text-cwcp-blue mb-2">
        {question.title}
      </h3>
      {question.description && (
        <p className="text-cwcp-darkgray mb-6">
          {question.description}
        </p>
      )}
      
      <div className="grid grid-cols-1 gap-3">
        {question.options.map((option) => (
          <ClickableOption
            key={option.id}
            value={option.value}
            isSelected={selectedServices.includes(option.value)}
            onClick={handleServiceToggle}
            type="checkbox"
          >
            {option.label}
          </ClickableOption>
        ))}
      </div>
    </div>
  );
};

export default Step0Services;
