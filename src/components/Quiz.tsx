
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import QuizHeader from "./QuizHeader";
import Step0Services from "./quiz/Step0Services";
import StepLocation from "./quiz/StepLocation";
import { withLocationQuestion } from "@/lib/clinicLocations";
import { trackEvent } from "@/lib/analytics";
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
  const [storedQuestions] = useLocalStorage<QuizQuestion[]>("quizQuestions", defaultQuestions);
  const [currentStep, setCurrentStep] = useState(1);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  
  // State for answers
  const [location, setLocation] = useState<string>("");
  const [services, setServices] = useState<string[]>([]);
  const [specialties, setSpecialties] = useState<string[]>([]);
  const [gender, setGender] = useState<string[]>([]);
  const [modalities, setModalities] = useState<string[]>([]);
  const [availability, setAvailability] = useState<string[]>([]);
  const [sessionType, setSessionType] = useState<string>("No Preference");
  const [ageRange, setAgeRange] = useState<string>("Adults (18-65)");
  const questions = React.useMemo(() => withLocationQuestion(storedQuestions).filter(
    question => location !== "Online" || question.fieldName !== "sessionType"
  ), [storedQuestions, location]);
  const totalSteps = questions.length;

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

  const scrollToTitleIfNeeded = () => {
    if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goTo = (step: number, dir: "forward" | "back") => {
    setDirection(dir);
    setIsTransitioning(true);
    if (dir === "forward") scrollToTitleIfNeeded();
    setTimeout(() => {
      setCurrentStep(step);
      setIsTransitioning(false);
    }, 160);
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      goTo(currentStep + 1, "forward");
    } else {
      trackEvent("quiz_location_selected", { location });
      trackEvent("quiz_modality_selected", { modality: sessionType });
      const answers: QuizAnswers = {
        location,
        services,
        specialties,
        gender,
        modalities,
        availability,
        sessionType: location === "Online" ? "Virtually" : sessionType,
        clientType: ageRange,
      };
      onComplete(answers);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) goTo(currentStep - 1, "back");
  };

  const isNextDisabled = () => {
    const currentQuestion = questions[currentStep - 1];
    if (!currentQuestion) return false;
    
    if (currentQuestion.fieldName === 'location') {
      return !location;
    }
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
      case 'location':
        return (
          <StepLocation selectedLocation={location} setSelectedLocation={setLocation} question={currentQuestion} />
        );
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
    <div className="max-w-3xl mx-auto px-0 sm:px-4 py-4 quiz-container">
      <QuizHeader currentStep={currentStep} totalSteps={totalSteps} />
      
      <div className="bg-card border border-border/70 p-5 sm:p-8 rounded-2xl shadow-elegant overflow-hidden">
        {/* Navigation buttons, top right */}
        <div className="flex justify-end gap-2 mb-4">
          <Button
            onClick={prevStep}
            disabled={currentStep === 1 || isTransitioning}
            variant="outline"
            size="sm"
            className="border-cwcp-blue/25 text-cwcp-blue hover:text-cwcp-blue hover:bg-secondary rounded-full px-4"
          >
            <ArrowLeft className="mr-1.5 h-4 w-4" />
            Previous
          </Button>
          <Button
            onClick={nextStep}
            disabled={isNextDisabled() || isTransitioning}
            size="sm"
            className="bg-cwcp-blue hover:bg-cwcp-lightblue text-primary-foreground rounded-full px-4"
          >
            {currentStep === totalSteps ? (
              "Find Therapists"
            ) : (
              <>
                Next
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </>
            )}
          </Button>
        </div>

        {/* Question content */}
        <div
          key={currentStep}
          className={`quiz-slide ${
            isTransitioning
              ? direction === "forward" ? "quiz-slide-out-left" : "quiz-slide-out-right"
              : direction === "forward" ? "quiz-slide-in-right" : "quiz-slide-in-left"
          }`}
        >
          {renderQuestion()}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
