
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";

interface Step5Props {
  selectedAvailability: string[];
  setSelectedAvailability: (value: string[]) => void;
  question: QuizQuestion;
}

const Step5Availability: React.FC<Step5Props> = ({ selectedAvailability, setSelectedAvailability, question }) => {
  const handleToggle = (value: string) => {
    if (selectedAvailability.includes(value)) {
      setSelectedAvailability(selectedAvailability.filter(item => item !== value));
    } else {
      setSelectedAvailability([...selectedAvailability, value]);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
      <div className="space-y-4">
        {question.options.map((option) => (
          <div key={option.id} className={`option-card ${selectedAvailability.includes(option.value) ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <Checkbox 
                id={`availability-${option.id}`} 
                checked={selectedAvailability.includes(option.value)}
                onCheckedChange={() => handleToggle(option.value)}
              />
              <Label htmlFor={`availability-${option.id}`} className="cursor-pointer font-normal">{option.label}</Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step5Availability;
