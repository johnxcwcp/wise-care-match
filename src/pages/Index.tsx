import React, { useState } from "react";
import Header from "@/components/Header";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";
import { QuizAnswers, Therapist } from "@/types";
import { matchTherapists } from "@/utils/matchTherapists";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { therapists as defaultTherapists } from "@/data/therapists";

const Index: React.FC = () => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [matchedTherapists, setMatchedTherapists] = useState<Therapist[]>([]);
  const [therapists] = useLocalStorage<Therapist[]>("therapists", defaultTherapists);

  const handleQuizComplete = (answers: QuizAnswers) => {
    const matches = matchTherapists(therapists, answers);
    setMatchedTherapists(matches);
    setQuizCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartQuiz = () => {
    setQuizCompleted(false);
    setMatchedTherapists([]);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-cwcp-lightgray">
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-8">
          {!quizCompleted ? (
            <div className="mb-8 text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-medium text-cwcp-blue mb-4">Find Your Perfect Therapist</h1>
              <p className="text-cwcp-darkgray text-lg mb-8">
                Answer a few questions to help us match you with the right therapist for your needs.
              </p>
            </div>
          ) : null}
          
          {quizCompleted ? (
            <Results 
              matchedTherapists={matchedTherapists} 
              onRestartQuiz={handleRestartQuiz}
            />
          ) : (
            <Quiz onComplete={handleQuizComplete} />
          )}
        </div>
      </main>
      
      <footer className="bg-white border-t border-cwcp-gray py-6">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-cwcp-darkgray">
            © 2025 Church Wellesley Counselling and Psychotherapy. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
