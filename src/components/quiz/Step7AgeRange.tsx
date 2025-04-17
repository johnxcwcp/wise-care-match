
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step7Props {
  selectedAgeRange: string;
  setSelectedAgeRange: (value: string) => void;
}

const ageRangeOptions = [
  "Adults (18-65)",
  "Seniors (65+)",
  "Teens (13-18)",
  "Pre-Teens (11-13)",
  "Children (6-11)",
];

const Step7AgeRange: React.FC<Step7Props> = ({ selectedAgeRange, setSelectedAgeRange }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">What is your age range?</h2>
      <RadioGroup value={selectedAgeRange} onValueChange={setSelectedAgeRange} className="space-y-4">
        {ageRangeOptions.map((ageRange) => (
          <div key={ageRange} className={`option-card ${selectedAgeRange === ageRange ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`age-range-${ageRange}`} value={ageRange} />
              <Label htmlFor={`age-range-${ageRange}`} className="cursor-pointer font-normal">{ageRange}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step7AgeRange;
