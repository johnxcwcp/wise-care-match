
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface Step1Props {
  selectedSpecialties: string[];
  setSelectedSpecialties: (values: string[]) => void;
}

const specialties = [
  "Addiction", "ADHD", "Aging", "Anger", "Anxiety", "Coping Skills and Strategies",
  "Depression", "Eating Disorders", "Grief", "LGBTQ+ Support", "Life Transitions",
  "Mood Disorders", "Non-Monogamy", "OCD", "Personality Disorders", "Post-Partum",
  "Psychedelic Integration", "PTSD", "Relationship Issues", "Self Esteem", "Self Harm",
  "Sex Therapy", "Spirituality", "Stress", "Suicidal Ideation", "Trans & Non-Binary", "Trauma"
];

const Step1Specialties: React.FC<Step1Props> = ({ selectedSpecialties, setSelectedSpecialties }) => {
  const toggleSpecialty = (specialty: string) => {
    if (selectedSpecialties.includes(specialty)) {
      setSelectedSpecialties(selectedSpecialties.filter(item => item !== specialty));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">What brings you to therapy?</h2>
      <p className="mb-6 text-cwcp-darkgray">Select all that apply to you.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {specialties.map((specialty) => (
          <div 
            key={specialty}
            className={`option-card ${selectedSpecialties.includes(specialty) ? 'selected' : ''}`}
            onClick={() => toggleSpecialty(specialty)}
          >
            <div className="flex items-start gap-3">
              <Checkbox 
                id={`specialty-${specialty}`} 
                checked={selectedSpecialties.includes(specialty)} 
                onCheckedChange={() => toggleSpecialty(specialty)}
              />
              <Label 
                htmlFor={`specialty-${specialty}`}
                className="cursor-pointer font-normal"
              >
                {specialty}
              </Label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Step1Specialties;
