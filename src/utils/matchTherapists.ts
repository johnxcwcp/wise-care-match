
import { QuizAnswers, Therapist } from "@/types";

interface TherapistMatch {
  therapist: Therapist;
  score: number;
}

export const matchTherapists = (therapists: Therapist[], answers: QuizAnswers): Therapist[] => {
  if (therapists.length === 0) {
    return [];
  }

  // First, filter therapists based on hard requirements
  const filteredTherapists = therapists.filter(therapist => {
    // Gender filter - if specific genders are selected (not "No Preference"), therapist must match
    if (answers.gender.length > 0 && !answers.gender.includes("No Preference")) {
      if (!answers.gender.includes(therapist.gender)) {
        return false; // Exclude therapists that don't match gender preference
      }
    }

    // You can add other hard filters here if needed
    return true;
  });

  // If no therapists pass the filters, return empty array or fallback
  if (filteredTherapists.length === 0) {
    console.log('No therapists match the selected criteria');
    return [];
  }

  const matches: TherapistMatch[] = [];

  for (const therapist of filteredTherapists) {
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

    // Gender matching - since we already filtered, give full score (15%)
    score += 15;

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
  
  // Return all filtered therapists, sorted by score
  return sortedMatches.map(match => match.therapist);
};
