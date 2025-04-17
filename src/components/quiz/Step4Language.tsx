
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface Step4Props {
  selectedLanguage: string;
  setSelectedLanguage: (value: string) => void;
}

const languageOptions = ["English", "Italian", "Arabic"];

const Step4Language: React.FC<Step4Props> = ({ selectedLanguage, setSelectedLanguage }) => {
  return (
    <div className="animate-fade-in">
      <h2 className="text-2xl font-medium text-cwcp-blue mb-6">What is your preferred language?</h2>
      <RadioGroup value={selectedLanguage} onValueChange={setSelectedLanguage} className="space-y-4">
        {languageOptions.map((language) => (
          <div key={language} className={`option-card ${selectedLanguage === language ? 'selected' : ''}`}>
            <div className="flex items-center gap-3">
              <RadioGroupItem id={`language-${language}`} value={language} />
              <Label htmlFor={`language-${language}`} className="cursor-pointer font-normal">{language}</Label>
            </div>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default Step4Language;
