
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";

interface Step1Props {
  selectedSpecialties: string[];
  setSelectedSpecialties: (values: string[]) => void;
  question: QuizQuestion;
}

const Step1Specialties: React.FC<Step1Props> = ({ selectedSpecialties, setSelectedSpecialties, question }) => {
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(item => item !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {question.options.map((option) => (
          <div 
            key={option.id}
            className={`option-card ${selectedSpecialties.includes(option.value) ? 'selected' : ''}`}
            onClick={() => toggleSpecialty(option.value)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                id={`specialty-${option.id}`} 
                checked={selectedSpecialties.includes(option.value)} 
                onCheckedChange={() => toggleSpecialty(option.value)}
              />
              <Label 
                htmlFor={`specialty-${option.id}`}
                className="cursor-pointer font-normal"
              >
                {option.label}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1Specialties;
