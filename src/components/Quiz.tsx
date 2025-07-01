
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizHeader from "./QuizHeader";
import Step0Services from "./quiz/Step0Services";
import Step1Specialties from "./quiz/Step1Specialties";
import Step2Gender from "./quiz/Step2Gender";
import Step3Modalities from "./quiz/Step3Modalities";
import Step5Availability from "./quiz/Step5Availability";
import Step6SessionType from "./quiz/Step6SessionType";
import Step7AgeRange from "./quiz/Step7AgeRange";
import { QuizAnswers, QuizQuestion } from "@/types";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { defaultQuestions } from "@/data/defaultQuestions";

interface QuizProps {
  onComplete: (answers: QuizAnswers)  => void;
}

const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [questions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const totalSteps = questions.length;
  
  // State for answers
  const [services, setServices] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<string>("No Preference");
  const [ageRange, setAgeRange] = useState<string>("Adults (18-65)");

  // Initialize default options from the first question for each type
  useEffect(() => {
    if (questions.length > 0) {
      questions.forEach(question => {
        if (question.options.length > 0) {
          if (question.fieldName === 'sessionType' && question.type === 'single') {
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
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    } else {
      const answers: QuizAnswers = {
        services,
        specialties,
        gender,
        modalities,
        availability,
        sessionType,
        clientType: ageRange,
      };
      onComplete(answers);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsTransitioning(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 250);
    }
  };

  const isNextDisabled = () => {
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return false;
    
    if (currentQuestion.fieldName === 'services') {
      return services.length === 0;
    }
    if (currentQuestion.fieldName === 'specialties') {
      return specialties.length === 0;
    }
    if (currentQuestion.fieldName === 'availability') {
      return availability.length === 0;
    }
    // Allow modalities and gender to be empty
    return false;
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return null;

    switch (currentQuestion.fieldName) {
      case 'services':
        return (
          <Step0Services 
            selectedServices={services} 
            setSelectedServices={setServices}
            question={currentQuestion}
          />
        );
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
    <div className="max-w-4xl mx-auto px-6 py-8">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className={`bg-white/95 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/20 transition-all duration-500 ease-out ${
        isTransitioning ? 'opacity-60 scale-98 translate-y-2' : 'opacity-100 scale-100 translate-y-0'
      }`}>
        <div className="min-h-[400px] flex flex-col justify-between">
          <div className="flex-1">
            {renderQuestion()}
          </div>
          
          <div className="flex justify-between items-center mt-12 pt-8 border-t border-slate-100">
            <Button 
              onClick={prevStep} 
              disabled={currentStep === 1 || isTransitioning}
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-600 hover:text-slate-700 hover:bg-slate-50 rounded-full px-8 py-3 font-medium transition-all duration-200"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Previous
            </Button>
            
            <Button 
              onClick={nextStep}
              disabled={isNextDisabled() || isTransitioning}
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full px-8 py-3 font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              {currentStep === totalSteps ? "Find Therapists" : "Next"}
              {currentStep !== totalSteps && <ArrowRight className="ml-2 h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
