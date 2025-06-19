
import { Therapist, QuizAnswers } from "@/types";

export interface MatchResult {
  bestMatches: Therapist[];
  otherMatches: Therapist[];
}

export const matchTherapists = (therapists: Therapist[], answers: QuizAnswers): MatchResult => {
  console.log("Matching therapists with answers:", answers);
  
  const bestMatches: Therapist[] = [];
  const otherMatches: Therapist[] = [];

  therapists.forEach(therapist => {
    let score = 0;
    let maxScore = 0;
    let isExactMatch = true;

    // Check specialties (required match)
    if (answers.specialties.length > 0) {
      maxScore += 1;
      const hasSpecialty = answers.specialties.some(specialty => 
        therapist.specialties.includes(specialty)
      );
      if (hasSpecialty) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    // Check gender (if specified)
    if (answers.gender.length > 0) {
      maxScore += 1;
      const hasGender = answers.gender.includes(therapist.gender);
      if (hasGender) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    // Check modalities (if specified)
    if (answers.modalities.length > 0) {
      maxScore += 1;
      const hasModality = answers.modalities.some(modality => 
        therapist.modalities.includes(modality)
      );
      if (hasModality) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    // Check availability (required match)
    if (answers.availability.length > 0) {
      maxScore += 1;
      const hasAvailability = answers.availability.some(availability => 
        therapist.availability.includes(availability)
      );
      if (hasAvailability) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    // Check session type (if not "No Preference")
    if (answers.sessionType !== "No Preference") {
      maxScore += 1;
      const hasSessionType = therapist.sessionType.includes(answers.sessionType);
      if (hasSessionType) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    // Check client type
    if (answers.clientType) {
      maxScore += 1;
      const hasClientType = therapist.clientTypes.includes(answers.clientType);
      if (hasClientType) {
        score += 1;
      } else {
        isExactMatch = false;
      }
    }

    console.log(`Therapist ${therapist.name}: score ${score}/${maxScore}, exact match: ${isExactMatch}`);

    // If exact match on all criteria, add to best matches
    if (isExactMatch && maxScore > 0) {
      bestMatches.push(therapist);
    } else if (score > 0) {
      // If partial match, add to other matches
      otherMatches.push(therapist);
    }
  });

  console.log(`Found ${bestMatches.length} best matches and ${otherMatches.length} other matches`);

  return {
    bestMatches,
    otherMatches
  };
};
