
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import QuizHeader from "./QuizHeader";
import Step1Specialties from "./quiz/Step1Specialties";
import Step2Gender from "./quiz/Step2Gender";
import Step3Modalities from "./quiz/Step3Modalities";
import Step4Language from "./quiz/Step4Language";
import Step5Availability from "./quiz/Step5Availability";
import Step6SessionType from "./quiz/Step6SessionType";
import Step7AgeRange from "./quiz/Step7AgeRange";
import { QuizAnswers } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 7;
  
  // State for each step
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("No Preference");
  const [modalities, setModalities] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("English");
  const [availability, setAvailability] = useState<string>("Weekdays");
  const [sessionType, setSessionType] = useState<string>("No Preference");
  const [ageRange, setAgeRange] = useState<string>("Adults (18-65)");

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const answers: QuizAnswers = {
        specialties,
        gender,
        modalities,
        language,
        availability,
        sessionType,
        clientType: ageRange,
      };
      onComplete(answers);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const isNextDisabled = () => {
    switch (currentStep) {
      case 1:
        return specialties.length === 0;
      case 3:
        return modalities.length === 0;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-cwcp-gray">
        {currentStep === 1 && (
          <Step1Specialties 
            selectedSpecialties={specialties} 
            setSelectedSpecialties={setSpecialties} 
          />
        )}
        
        {currentStep === 2 && (
          <Step2Gender 
            selectedGender={gender} 
            setSelectedGender={setGender} 
          />
        )}
        
        {currentStep === 3 && (
          <Step3Modalities 
            selectedModalities={modalities} 
            setSelectedModalities={setModalities} 
          />
        )}
        
        {currentStep === 4 && (
          <Step4Language 
            selectedLanguage={language} 
            setSelectedLanguage={setLanguage} 
          />
        )}
        
        {currentStep === 5 && (
          <Step5Availability 
            selectedAvailability={availability} 
            setSelectedAvailability={setAvailability} 
          />
        )}
        
        {currentStep === 6 && (
          <Step6SessionType 
            selectedSessionType={sessionType} 
            setSelectedSessionType={setSessionType} 
          />
        )}
        
        {currentStep === 7 && (
          <Step7AgeRange 
            selectedAgeRange={ageRange} 
            setSelectedAgeRange={setAgeRange} 
          />
        )}
        
        <div className="flex justify-between mt-8">
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            variant="outline"
            className="border-cwcp-blue text-cwcp-blue hover:text-cwcp-blue hover:bg-blue-50"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Previous
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={isNextDisabled()}
            className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
          >
            {currentStep === totalSteps ? "Find Therapists" : "Next"}
            {currentStep !== totalSteps && <ArrowRight className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
