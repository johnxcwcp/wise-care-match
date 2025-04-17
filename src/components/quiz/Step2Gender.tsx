
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step2Props {
  selectedGender: string;
  setSelectedGender: (value: string) => void;
}

const genderOptions = ["Man", "Woman", "Non-Binary", "No Preference"];

const Step2Gender: React.FC<Step2Props> = ({ selectedGender, setSelectedGender }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">Do you have a preference for your therapist's gender?</h2>
      <RadioGroup value={selectedGender} onValueChange={setSelectedGender} className="space-y-4">
        {genderOptions.map((gender) => (
          <div key={gender} className={`option-card ${selectedGender === gender ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`gender-${gender}`} value={gender} />
              <Label htmlFor={`gender-${gender}`} className="cursor-pointer font-normal">{gender}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step2Gender;
