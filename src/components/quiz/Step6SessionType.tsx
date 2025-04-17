
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";

interface Step6Props {
  selectedSessionType: string;
  setSelectedSessionType: (value: string) => void;
  question: QuizQuestion;
}

const Step6SessionType: React.FC<Step6Props> = ({ selectedSessionType, setSelectedSessionType, question }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
      <RadioGroup value={selectedSessionType} onValueChange={setSelectedSessionType} className="space-y-4">
        {question.options.map((option) => (
          <div key={option.id} className={`option-card ${selectedSessionType === option.value ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`session-type-${option.id}`} value={option.value} />
              <Label htmlFor={`session-type-${option.id}`} className="cursor-pointer font-normal">{option.label}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step6SessionType;
