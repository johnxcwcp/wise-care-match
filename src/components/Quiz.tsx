
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizHeader from "./QuizHeader";
import Step1Specialties from "./quiz/Step1Specialties";
import Step2Gender from "./quiz/Step2Gender";
import Step3Modalities from "./quiz/Step3Modalities";
import Step4Language from "./quiz/Step4Language";
import Step5Availability from "./quiz/Step5Availability";
import Step6SessionType from "./quiz/Step6SessionType";
import Step7AgeRange from "./quiz/Step7AgeRange";
import { QuizAnswers, QuizQuestion } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";

interface QuizProps {
  onComplete: (answers: QuizAnswers) => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = questions.length;
  
  // State for answers
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [gender, setGender] = useState<string>("No Preference");
  const [modalities, setModalities] = useState<string[]>([]);
  const [language, setLanguage] = useState<string>("English");
  const [availability, setAvailability] = useState<string>("Weekdays");
  const [sessionType, setSessionType] = useState<string>("No Preference");
  const [ageRange, setAgeRange] = useState<string>("Adults (18-65)");

  // Initialize default options from the first question for each type
  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach(question => {
        if (question.options.length > 0) {
          if (question.fieldName === 'gender' && question.type === 'single') {
            setGender(question.options.find(o => o.value === 'No Preference')?.value || question.options[0].value);
          } else if (question.fieldName === 'language' && question.type === 'single') {
            setLanguage(question.options.find(o => o.value === 'English')?.value || question.options[0].value);
          } else if (question.fieldName === 'availability' && question.type === 'single') {
            setAvailability(question.options.find(o => o.value === 'Weekdays')?.value || question.options[0].value);
          } else if (question.fieldName === 'sessionType' && question.type === 'single') {
            setSessionType(question.options.find(o => o.value === 'No Preference')?.value || question.options[0].value);
          } else if (question.fieldName === 'clientType' && question.type === 'single') {
            setAgeRange(question.options.find(o => o.value === 'Adults (18-65)')?.value || question.options[0].value);
          }
        }
      });
    }
  }, [questions]);

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
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return false;
    
    if (currentQuestion.type === 'multiple') {
      if (currentQuestion.fieldName === 'specialties') {
        return specialties.length === 0;
      } else if (currentQuestion.fieldName === 'modalities') {
        return modalities.length === 0;
      }
    }
    return false;
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return null;

    switch (currentQuestion.fieldName) {
      case 'specialties':
        return (
          <Step1Specialties 
            selectedSpecialties={specialties} 
            setSelectedSpecialties={setSpecialties}
            question={currentQuestion}
          />
        );
      case 'gender':
        return (
          <Step2Gender 
            selectedGender={gender} 
            setSelectedGender={setGender}
            question={currentQuestion}
          />
        );
      case 'modalities':
        return (
          <Step3Modalities 
            selectedModalities={modalities} 
            setSelectedModalities={setModalities}
            question={currentQuestion}
          />
        );
      case 'language':
        return (
          <Step4Language 
            selectedLanguage={language} 
            setSelectedLanguage={setLanguage}
            question={currentQuestion}
          />
        );
      case 'availability':
        return (
          <Step5Availability 
            selectedAvailability={availability} 
            setSelectedAvailability={setAvailability}
            question={currentQuestion}
          />
        );
      case 'sessionType':
        return (
          <Step6SessionType 
            selectedSessionType={sessionType} 
            setSelectedSessionType={setSessionType}
            question={currentQuestion}
          />
        );
      case 'clientType':
        return (
          <Step7AgeRange 
            selectedAgeRange={ageRange} 
            setSelectedAgeRange={setAgeRange}
            question={currentQuestion}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-cwcp-gray">
        {renderQuestion()}
        
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
