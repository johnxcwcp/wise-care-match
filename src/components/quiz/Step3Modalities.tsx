
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Step3Props {
  selectedModalities: string[];
  setSelectedModalities: (values: string[]) => void;
}

const modalities = [
  "Acceptance and Commitment (ACT)", "Adlerian", "Attachment-Based",
  "Cognitive Behavioural Therapy (CBT)", "Dialectical Behavioural Therapy (DBT)",
  "Emotion Focused", "Existential", "Gestalt", "Gottman",
  "Internal Family Systems (IFS)", "Jungian", "Mindfulness",
  "Narrative", "Person-Centred", "Psychodynamic",
  "Psychospiritual Care", "Solution-Focused", "Somatic"
];

const Step3Modalities: React.FC<Step3Props> = ({ selectedModalities, setSelectedModalities }) => {
  const toggleModality = (modality: string) => {
    if (selectedModalities.includes(modality)) {
      setSelectedModalities(selectedModalities.filter(item => item !== modality));
    } else {
      setSelectedModalities([...selectedModalities, modality]);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">What therapy modalities interest you?</h2>
      <p className="mb-6 text-cwcp-darkgray">Select all that apply to you.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {modalities.map((modality) => (
          <div 
            key={modality}
            className={`option-card ${selectedModalities.includes(modality) ? 'selected' : ''}`}
            onClick={() => toggleModality(modality)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                id={`modality-${modality}`} 
                checked={selectedModalities.includes(modality)} 
                onCheckedChange={() => toggleModality(modality)}
              />
              <Label 
                htmlFor={`modality-${modality}`}
                className="cursor-pointer font-normal"
              >
                {modality}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step3Modalities;
