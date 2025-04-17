
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";

interface Step7Props {
  selectedAgeRange: string;
  setSelectedAgeRange: (value: string) => void;
  question: QuizQuestion;
}

const Step7AgeRange: React.FC<Step7Props> = ({ selectedAgeRange, setSelectedAgeRange, question }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
      <RadioGroup value={selectedAgeRange} onValueChange={setSelectedAgeRange} className="space-y-4">
        {question.options.map((option) => (
          <div key={option.id} className={`option-card ${selectedAgeRange === option.value ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`age-range-${option.id}`} value={option.value} />
              <Label htmlFor={`age-range-${option.id}`} className="cursor-pointer font-normal">{option.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step7AgeRange;
