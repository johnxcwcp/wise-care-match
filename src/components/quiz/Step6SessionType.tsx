
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step6Props {
  selectedSessionType: string;
  setSelectedSessionType: (value: string) => void;
}

const sessionTypeOptions = ["In-person", "Virtually", "No Preference"];

const Step6SessionType: React.FC<Step6Props> = ({ selectedSessionType, setSelectedSessionType }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">Do you prefer to see your therapist in-person or virtually?</h2>
      <RadioGroup value={selectedSessionType} onValueChange={setSelectedSessionType} className="space-y-4">
        {sessionTypeOptions.map((type) => (
          <div key={type} className={`option-card ${selectedSessionType === type ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`session-type-${type}`} value={type} />
              <Label htmlFor={`session-type-${type}`} className="cursor-pointer font-normal">{type}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step6SessionType;
