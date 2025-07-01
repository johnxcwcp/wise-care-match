
import React from "react";
import { Button } from "@/components/ui/button";
import { Therapist, QuizAnswers } from "@/types";
import TherapistCard from "./TherapistCard";
import { RefreshCw } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { MatchResult } from "@/utils/matchTherapists";

interface ResultsProps {
  matchResult: MatchResult;
  answers: QuizAnswers;
  onRestartQuiz: () => void;
}

const Results: React.FC<ResultsProps> = ({ matchResult, answers, onRestartQuiz }) => {
  const { bestMatches, otherMatches } = matchResult;

  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const getSettingValue = (key: string, defaultValue: string) => {
    return siteSettings?.find(setting => setting.setting_key === key)?.setting_value || defaultValue;
  };

  const noMatchesMessage = getSettingValue(
    'no_matches_message',
    'No Perfect Matches Found. None of our clinicians match your selected criteria. Please contact us for further support. Here are some clinicians that meet some of your criteria.'
  );

  const otherMatchesMessage = getSettingValue(
    'other_matches_message',
    'Other Clinicians You May Be Interested In: The clinicians below may still be a good fit for you but don\'t necessarily align with all of your input for "Gender", "Modalities", and "Virtual or in-person" preferences.'
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-12 animate-fade-in">
      <div className="mb-12">
        <h2 className="text-4xl font-light text-slate-800 mb-6 tracking-tight">Your Therapist Recommendations</h2>
        <div className="flex flex-wrap gap-4">
          <Button 
            onClick={onRestartQuiz}
            variant="outline"
            size="lg"
            className="border-slate-300 text-slate-600 hover:bg-slate-50 hover:text-slate-700 rounded-full px-6 py-3 font-medium transition-all duration-200"
          >
            <RefreshCw className="mr-2 h-5 w-5" />
            Start Over
          </Button>
        </div>
      </div>

      {/* Best Matches Section */}
      {bestMatches.length > 0 ? (
        <div className="mb-16">
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <h3 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">Best Matches</h3>
            <p className="text-slate-600 text-lg mb-4 leading-relaxed">
              These clinicians match all of your specified criteria.
            </p>
            <p className="text-slate-500 text-base leading-relaxed">
              You may also choose any therapist outside of the suggestion shown here.
            </p>
          </div>
          <div className="space-y-8">
            {bestMatches.map(therapist => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      ) : (
        <div className="mb-16">
          <div className="text-center p-12 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">
            <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">No Perfect Matches Found</h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {noMatchesMessage}
            </p>
          </div>
        </div>
      )}

      {/* Other Matches Section */}
      {otherMatches.length > 0 && (
        <div>
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20 p-8 mb-8">
            <h3 className="text-3xl font-light text-slate-800 mb-4 tracking-tight">
              Other Clinicians You May Be Interested In
            </h3>
            <p className="text-slate-600 text-lg leading-relaxed">
              {otherMatchesMessage}
            </p>
          </div>
          <div className="space-y-8">
            {otherMatches.map(therapist => (
              <TherapistCard key={therapist.id} therapist={therapist} />
            ))}
          </div>
        </div>
      )}

      {bestMatches.length === 0 && otherMatches.length === 0 && (
        <div className="text-center p-16 bg-white/95 backdrop-blur-xl rounded-3xl shadow-xl border border-white/20">
          <h3 className="text-2xl font-light text-slate-800 mb-4 tracking-tight">No Therapists Found</h3>
          <p className="text-slate-600 text-lg mb-8 leading-relaxed">
            We couldn't find any therapists at this time. Please contact us directly for assistance.
          </p>
        </div>
      )}
    </div>
  );
};

export default Results;
