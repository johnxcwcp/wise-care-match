
import React, { useState } from "react";
import Header from "@/components/Header";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";
import { QuizAnswers, Therapist } from "@/types";
import { matchTherapists } from "@/utils/matchTherapists";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [matchedTherapists, setMatchedTherapists] = useState<Therapist[]>([]);

  const { data: therapists = [] } = useQuery({
    queryKey: ['therapists-public'],
    queryFn: async () => {
      const { data: therapistsData, error: therapistsError } = await supabase
        .from('therapists')
        .select(`
          *,
          therapist_availability(availability),
          therapist_modalities(modality),
          therapist_specialties(specialty),
          therapist_languages(language),
          therapist_session_types(session_type),
          therapist_client_types(client_type)
        `);

      if (therapistsError) {
        toast.error('Error fetching therapists');
        console.error(therapistsError);
        return [];
      }

      return therapistsData.map(therapist => ({
        id: therapist.id,
        name: therapist.name,
        pronouns: therapist.pronouns || '',
        designation: therapist.designation || '',
        bio: therapist.bio || '',
        photo: therapist.photo || '',
        gender: therapist.gender || '',
        bookingLink: therapist.booking_link || '',
        availability: therapist.therapist_availability?.map(a => a.availability) || [],
        modalities: therapist.therapist_modalities?.map(m => m.modality) || [],
        specialties: therapist.therapist_specialties?.map(s => s.specialty) || [],
        languages: therapist.therapist_languages?.map(l => l.language) || [],
        sessionType: therapist.therapist_session_types?.map(st => st.session_type) || [],
        clientTypes: therapist.therapist_client_types?.map(ct => ct.client_type) || []
      }));
    }
  });

  const handleQuizComplete = (answers: QuizAnswers) => {
    console.log('Quiz answers:', answers);
    const matches = matchTherapists(therapists, answers);
    console.log('Matched therapists:', matches);
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
