
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";

interface Step4Props {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
  question: QuizQuestion;
}

const Step4Language: React.FC<Step4Props> = ({ selectedLanguage, setSelectedLanguage, question }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
      <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-4">
        {question.options.map((option) => (
          <div key={option.id} className={`option-card ${selectedLanguage === option.value ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`language-${option.id}`} value={option.value} />
              <Label htmlFor={`language-${option.id}`} className="cursor-pointer font-normal">{option.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step4Language;
