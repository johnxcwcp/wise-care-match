
import { QuizAnswers, Therapist } from "@/types";

interface TherapistMatch {
  therapist: Therapist;
  score: number;
}

export const matchTherapists = (therapists: Therapist[], answers: QuizAnswers): Therapist[] => {
  const matches: TherapistMatch[] = [];

  for (const therapist of therapists) {
    let score = 0;
    
    // Check specialties - higher weight (35%)
    const specialtyMatches = answers.specialties.filter(specialty => 
      therapist.specialties.includes(specialty)
    ).length;
    score += (specialtyMatches / answers.specialties.length) * 35;

    // Check gender - if "No Preference" then full score, otherwise check match (15%)
    if (answers.gender === "No Preference") {
      score += 15;
    } else if (therapist.gender === answers.gender) {
      score += 15;
    }

    // Check modalities - moderate weight (20%)
    const modalityMatches = answers.modalities.filter(modality => 
      therapist.modalities.includes(modality)
    ).length;
    score += (modalityMatches / answers.modalities.length) * 20;

    // Check language - if matches then points (10%)
    if (answers.language === "No Preference" || therapist.languages.includes(answers.language)) {
      score += 10;
    }

    // Check availability - if matches then points (10%)
    if (answers.availability === "No Preference" || therapist.availability.includes(answers.availability)) {
      score += 10;
    }

    // Check session type - if matches or no preference then points (5%)
    if (answers.sessionType === "No Preference" || 
        therapist.sessionType.includes(answers.sessionType)) {
      score += 5;
    }

    // Check client type - if matches or no preference then points (5%)
    if (answers.clientType === "No Preference" || 
        therapist.clientTypes.includes(answers.clientType)) {
      score += 5;
    }

    matches.push({ therapist, score });
  }

  // Sort by score in descending order and return therapists
  return matches.sort((a, b) => b.score - a.score).map(match => match.therapist);
};
