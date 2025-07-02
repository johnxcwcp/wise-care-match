
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
  onComplete: (answers: QuizAnswers) => void;
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

  const smoothScrollToTop = () => {
    const quizContainer = document.querySelector('.quiz-container');
    if (quizContainer) {
      quizContainer.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start',
        inline: 'nearest'
      });
    } else {
      window.scrollTo({ 
        top: 0, 
        behavior: 'smooth' 
      });
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setIsTransitioning(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsTransitioning(false);
        smoothScrollToTop();
      }, 200);
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
        smoothScrollToTop();
      }, 200);
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
    <div className="max-w-3xl mx-auto px-4 py-8 quiz-container">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className={`glass-card p-8 rounded-3xl shadow-sophisticated transition-all duration-300 relative ${
        isTransitioning ? 'opacity-70 scale-[0.98]' : 'opacity-100 scale-100 animate-smooth-scroll'
      }`}>
        {/* Navigation buttons in top right corner */}
        <div className="absolute top-6 right-6 flex gap-2">
          <Button 
            onClick={prevStep} 
            disabled={currentStep === 1 || isTransitioning}
            variant="outline"
            size="sm"
            className="border-cwcp-blue/30 text-cwcp-blue hover:text-cwcp-blue hover:bg-blue-50/80 backdrop-blur-sm rounded-full px-3 py-2"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          <Button 
            onClick={nextStep}
            disabled={isNextDisabled() || isTransitioning}
            size="sm"
            className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white rounded-full px-3 py-2 shadow-elegant"
          >
            {currentStep === totalSteps ? "Find" : <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Question content */}
        <div className="pr-24">
          {renderQuestion()}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
