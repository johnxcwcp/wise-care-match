
import React, { useState } from "react";
import Header from "@/components/Header";
import Quiz from "@/components/Quiz";
import Results from "@/components/Results";
import CliniciansVideoCarousel from "@/components/CliniciansVideoCarousel";
import SEOHead from "@/components/SEOHead";
import Footer from "@/components/Footer";
import { QuizAnswers, Therapist } from "@/types";
import { matchTherapists, MatchResult } from "@/utils/matchTherapists";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Index: React.FC = () => {
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult>({ bestMatches: [], otherMatches: [] });
  const [quizAnswers, setQuizAnswers] = useState<QuizAnswers | null>(null);

  const { data: therapists = [] } = useQuery({
    queryKey: ['therapists-public'],
    queryFn: async () => {
      const { data: therapistsData, error: therapistsError } = await (supabase as any)
        .from('therapists')
        .select(`
          *,
          therapist_availability(availability),
          therapist_modalities(modality),
          therapist_specialties(specialty),
          therapist_languages(language),
          therapist_session_types(session_type),
          therapist_client_types(client_type),
          therapist_services(service)
        `);

      if (therapistsError) {
        toast.error('Error fetching therapists');
        console.error(therapistsError);
        return [];
      }

      return therapistsData.map((therapist: any) => ({
        id: therapist.id,
        name: therapist.name,
        pronouns: therapist.pronouns || '',
        designation: therapist.designation || '',
        bio: therapist.bio || '',
        photo: therapist.photo || '',
        gender: therapist.gender || '',
        bookingLink: therapist.booking_link || '',
        customMessage: therapist.custom_message || '',
        extendedBio: therapist.extended_bio || '',
        introVideoUrl: therapist.intro_video_url || '',
        availability: therapist.therapist_availability?.map((a: any) => a.availability) || [],
        modalities: therapist.therapist_modalities?.map((m: any) => m.modality) || [],
        specialties: therapist.therapist_specialties?.map((s: any) => s.specialty) || [],
        languages: therapist.therapist_languages?.map((l: any) => l.language) || [],
        sessionType: therapist.therapist_session_types?.map((st: any) => st.session_type) || [],
        clientTypes: therapist.therapist_client_types?.map((ct: any) => ct.client_type) || [],
        services: therapist.therapist_services?.map((s: any) => s.service) || []
      }));
    }
  });

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

  const handleQuizComplete = (answers: QuizAnswers) => {
    console.log('Quiz answers:', answers);
    const matches = matchTherapists(therapists, answers);
    console.log('Matched therapists:', matches);
    setMatchResult(matches);
    setQuizAnswers(answers);
    setQuizCompleted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestartQuiz = () => {
    setQuizCompleted(false);
    setMatchResult({ bestMatches: [], otherMatches: [] });
    setQuizAnswers(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const mainHeading = getSettingValue('main_heading', 'Find Your Perfect Therapist');

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-slate-50 to-blue-50">
      <SEOHead />
      <Header />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-6 py-12">
          {!quizCompleted ? (
            <div className="mb-12 text-center max-w-4xl mx-auto">
              <h1 className="text-5xl font-semibold text-slate-800 mb-6 tracking-tight font-jost">{mainHeading}</h1>
              <p className="text-slate-600 text-xl mb-12 leading-relaxed">
                Answer a few questions to help us match you with the right therapist for your needs.
              </p>
            </div>
          ) : null}
          
          {quizCompleted && quizAnswers ? (
            <Results 
              matchResult={matchResult}
              answers={quizAnswers}
              onRestartQuiz={handleRestartQuiz}
            />
          ) : (
            <Quiz onComplete={handleQuizComplete} />
          )}
        </div>

        {/* Clinicians Video Carousel - only show when quiz is not completed */}
        {!quizCompleted && (
          <div className="bg-white/80 backdrop-blur-sm border-t border-slate-200">
            <CliniciansVideoCarousel therapists={therapists} />
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
