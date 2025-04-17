
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step5Props {
  selectedAvailability: string;
  setSelectedAvailability: (value: string) => void;
}

const availabilityOptions = ["Weekdays", "Evenings", "Weekends"];

const Step5Availability: React.FC<Step5Props> = ({ selectedAvailability, setSelectedAvailability }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">What is your availability?</h2>
      <RadioGroup value={selectedAvailability} onValueChange={setSelectedAvailability} className="space-y-4">
        {availabilityOptions.map((availability) => (
          <div key={availability} className={`option-card ${selectedAvailability === availability ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`availability-${availability}`} value={availability} />
              <Label htmlFor={`availability-${availability}`} className="cursor-pointer font-normal">{availability}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step5Availability;
