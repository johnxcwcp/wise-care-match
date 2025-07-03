import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";
interface Step3Props {
  selectedModalities: string[];
  setSelectedModalities: (values: string[]) => void;
  question: QuizQuestion;
}
const Step3Modalities: React.FC<Step3Props> = ({
  selectedModalities,
  setSelectedModalities,
  question
}) => {
  const toggleModality = (modality: string) => {
    if (selectedModalities.includes(modality)) {
      setSelectedModalities(selectedModalities.filter(item => item !== modality));
    } else {
      setSelectedModalities([...selectedModalities, modality]);
    }
  };
  return <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">{question.title}</h2>
      {question.description && <div className="mb-6 text-cwcp-darkgray">
          <p className="mb-2">{question.description}</p>
          <p className="font-light text-zinc-400">
            Want to find out more about therapy modalities?{" "}
            <a href="https://cwcp.ca/therapy-types/" target="_blank" rel="noopener noreferrer" className="text-cwcp-blue hover:text-cwcp-lightblue underline">
              Click here
            </a>{" "}
            for an in-depth look at the different types.
          </p>
        </div>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {question.options.map(option => <div key={option.id} className={`option-card ${selectedModalities.includes(option.value) ? 'selected' : ''}`} onClick={() => toggleModality(option.value)}>
            <div className="flex items-start gap-3">
              <Checkbox id={`modality-${option.id}`} checked={selectedModalities.includes(option.value)} onCheckedChange={() => toggleModality(option.value)} />
              <Label htmlFor={`modality-${option.id}`} className="cursor-pointer font-normal">
                {option.label}
              </Label>
            </div>
          </div>)}
      </div>
    </div>;
};
export default Step3Modalities;