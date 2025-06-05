
import { QuizAnswers, Therapist } from "@/types";

interface TherapistMatch {
  therapist: Therapist;
  score: number;
}

export const matchTherapists = (therapists: Therapist[], answers: QuizAnswers): Therapist[] => {
  if (therapists.length === 0) {
    return [];
  }

  const matches: TherapistMatch[] = [];

  for (const therapist of therapists) {
    let score = 0;
    
    // Check specialties - higher weight (35%)
    if (answers.specialties.length > 0) {
      const specialtyMatches = answers.specialties.filter(specialty => 
        therapist.specialties.includes(specialty)
      ).length;
      score += (specialtyMatches / answers.specialties.length) * 35;
    } else {
      // If no specialties selected, give partial score
      score += 15;
    }

    // Check gender - if "No Preference" is selected or empty, give full score (15%)
    if (answers.gender.length === 0 || answers.gender.includes("No Preference")) {
      score += 15;
    } else {
      // Check if therapist's gender matches any selected preference
      if (answers.gender.includes(therapist.gender)) {
        score += 15;
      }
    }

    // Check modalities - moderate weight (20%)
    if (answers.modalities.length === 0 || answers.modalities.includes("Not sure")) {
      // If no modalities selected or "Not sure" selected, give partial score
      score += 10;
    } else {
      const modalityMatches = answers.modalities.filter(modality => 
        therapist.modalities.includes(modality)
      ).length;
      score += (modalityMatches / answers.modalities.length) * 20;
    }

    // Check availability - if matches then points (10%)
    if (answers.availability === "No Preference" || therapist.availability.includes(answers.availability)) {
      score += 10;
    }

    // Check session type - if matches or no preference then points (10%)
    if (answers.sessionType === "No Preference" || 
        therapist.sessionType.includes(answers.sessionType)) {
      score += 10;
    }

    // Check client type - if matches or no preference then points (10%)
    if (answers.clientType === "No Preference" || 
        therapist.clientTypes.includes(answers.clientType)) {
      score += 10;
    }

    matches.push({ therapist, score });
  }

  // Sort by score in descending order
  const sortedMatches = matches.sort((a, b) => b.score - a.score);
  
  // If no therapists have a score above 0, return all therapists to ensure at least one result
  const hasMatchesAboveZero = sortedMatches.some(match => match.score > 0);
  if (!hasMatchesAboveZero) {
    // Return all therapists when no good matches are found
    return therapists;
  }
  
  // Return therapists with scores above 0, or if none exist, return all
  const validMatches = sortedMatches.filter(match => match.score > 0);
  return validMatches.length > 0 
    ? validMatches.map(match => match.therapist)
    : therapists;
};
