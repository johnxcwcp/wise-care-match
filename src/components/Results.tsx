import React from "react";
import { Button } from "@/components/ui/button";
import { Therapist, QuizAnswers } from "@/types";
import TherapistCard from "./TherapistCard";
import { RefreshCw } from "lucide-react";

interface ResultsProps {
  matchedTherapists: Therapist[];
  answers: QuizAnswers;
  onRestartQuiz: () => void;
}

const Results: React.FC<ResultsProps> = ({ matchedTherapists, answers, onRestartQuiz }) => {
  // Simple matching logic for now - in a real app this would be more sophisticated
  const bestMatches = matchedTherapists.filter(therapist => {
    // Check if therapist matches all specified criteria
    const matchesSpecialties = answers.specialties.length === 0 || 
      answers.specialties.some(specialty => therapist.specialties.includes(specialty));
    
    const matchesGender = answers.gender.length === 0 || 
      answers.gender.includes(therapist.gender);
    
    const matchesModalities = answers.modalities.length === 0 || 
      answers.modalities.some(modality => therapist.modalities.includes(modality));
    
    const matchesAvailability = answers.availability.length === 0 || 
      answers.availability.some(availability => therapist.availability.includes(availability));
    
    const matchesSessionType = answers.sessionType === "No Preference" || 
      therapist.sessionType.includes(answers.sessionType);

    return matchesSpecialties && matchesGender && matchesModalities && 
           matchesAvailability && matchesSessionType;
  });

  const otherMatches = matchedTherapists.filter(therapist => 
    !bestMatches.includes(therapist)
  );

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 animate-fade-in">
      <div className="mb-8">
        <h2 className="text-3xl font-medium text-cwcp-blue mb-4">Your Therapist Recommendations</h2>
        <div className="flex flex-wrap gap-3">
          <Button 
            onClick={onRestartQuiz}
            variant="outline"
            className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50 hover:text-cwcp-blue"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Best Matches Section */}
      {bestMatches.length > 0 ? (
        <div className="mb-12">
          <h3 className="text-2xl font-medium text-cwcp-blue mb-4">Best Matches</h3>
          <p className="text-cwcp-darkgray mb-6">
            These clinicians match all of your specified criteria.
          </p>
          <div className="space-y-6">
            {bestMatches.map(therapist => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-12">
          <div className="text-center p-8 bg-white rounded-lg border border-cwcp-gray">
            <h3 className="text-xl font-medium text-cwcp-blue mb-3">No Perfect Matches Found</h3>
            <p className="text-cwcp-darkgray mb-4">
              None of our clinicians match your selected criteria. Please contact us for further support. 
              Here are some clinicians that meet some of your criteria.
            </p>
          </div>
        </div>
      )}

      {/* Other Matches Section */}
      {otherMatches.length > 0 && (
        <div>
          <h3 className="text-2xl font-medium text-cwcp-blue mb-4">
            Other Clinicians You May Be Interested In
          </h3>
          <p className="text-cwcp-darkgray mb-6">
            The clinicians below may still be a good fit for you but don't necessarily align with 
            all of your input for "Gender", "Modalities", and "Virtual or in-person" preferences.
          </p>
          <div className="space-y-6">
            {otherMatches.map(therapist => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      )}

      {bestMatches.length === 0 && otherMatches.length === 0 && (
        <div className="text-center p-12 bg-white rounded-lg border border-cwcp-gray">
          <h3 className="text-xl font-medium text-cwcp-blue mb-3">No Therapists Found</h3>
          <p className="text-cwcp-darkgray mb-6">
            We couldn't find any therapists at this time. Please contact us directly for assistance.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
