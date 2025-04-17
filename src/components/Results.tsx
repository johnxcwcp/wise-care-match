
import React from "react";
import { Button } from "@/components/ui/button";
import { Therapist, QuizAnswers } from "@/types";
import TherapistCard from "./TherapistCard";
import { RefreshCw, Mail } from "lucide-react";

interface ResultsProps {
  matchedTherapists: Therapist[];
  onRestartQuiz: () => void;
}

const Results: React.FC<ResultsProps> = ({ matchedTherapists, onRestartQuiz }) => {
  const handleEmailResults = () => {
    // This would be connected to a backend service in a real implementation
    alert("This feature would email your results. Currently just a placeholder.");
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-medium text-cwcp-blue mb-4">Your Matched Therapists</h2>
        <p className="text-cwcp-darkgray mb-6">
          {matchedTherapists.length > 0 
            ? "Based on your answers, these therapists may be a good fit for you. Review their profiles and book an appointment directly."
            : "We couldn't find a perfect match based on your criteria. Here are some therapists who may still be able to help you."
          }
        </p>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={onRestartQuiz}
            variant="outline"
            className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50 hover:text-cwcp-blue"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
          <Button 
            onClick={handleEmailResults}
            variant="outline"
            className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50 hover:text-cwcp-blue"
          >
            <Mail className="mr-2 h-4 w-4" />
            Email Results
          </Button>
          <Button 
            asChild 
            className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white ml-auto"
          >
            <a href="https://cwcp.ca/contact/" target="_blank" rel="noopener noreferrer">
              Book a Free Consultation
            </a>
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {matchedTherapists.length > 0 ? (
          matchedTherapists.map(therapist => (
            <TherapistCard key={therapist.id} therapist={therapist} />
          ))
        ) : (
          <div className="text-center p-12 bg-white rounded-lg border border-cwcp-gray">
            <h3 className="text-xl font-medium text-cwcp-blue mb-3">No Therapists Found</h3>
            <p className="text-cwcp-darkgray mb-6">
              We couldn't find therapists matching your criteria. Please try adjusting your preferences or contact us directly.
            </p>
            <Button asChild className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white">
              <a href="https://cwcp.ca/contact/" target="_blank" rel="noopener noreferrer">
                Contact CWCP
              </a>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Results;
