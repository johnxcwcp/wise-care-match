import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";
import { CLINIC_LOCATIONS } from "@/lib/clinicLocations";

interface Props {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  question: QuizQuestion;
}

const StepLocation: React.FC<Props> = ({ selectedLocation, setSelectedLocation, question }) => (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-normal text-cwcp-blue mb-2">{question.title}</h2>
    {question.description && <p className="mb-6 text-cwcp-darkgray">{question.description}</p>}
    <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation} className="grid gap-4 sm:grid-cols-3" aria-label={question.title}>
      {CLINIC_LOCATIONS.map((loc) => (
        <Label
          key={loc.value}
          htmlFor={`location-${loc.value}`}
          className={`option-card cursor-pointer flex flex-col gap-2 h-full ${selectedLocation === loc.value ? "selected" : ""}`}
        >
          <span className="flex items-center gap-3">
            <RadioGroupItem id={`location-${loc.value}`} value={loc.value} />
            <span className="font-normal text-base">{loc.label}</span>
          </span>
          <span className="text-sm text-muted-foreground font-normal">{loc.description}</span>
        </Label>
      ))}
    </RadioGroup>
  </div>
);

export default StepLocation;
