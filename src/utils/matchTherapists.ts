import { Therapist, QuizAnswers } from "@/types";

export type ServiceMode = "In-person" | "Online";

export interface MatchResult {
  bestMatches: Therapist[];
  otherMatches: Therapist[];
  /** Modes each recommended clinician actually offers at the selected location, keyed by id. */
  modes: Record<string, ServiceMode[]>;
}

const ALL_MODALITIES = [
  "Acceptance and Commitment (ACT)", "Adlerian", "Attachment-Based",
  "Cognitive Behavioural Therapy (CBT)", "Dialectical Behavioural Therapy (DBT)",
  "Emotion Focused", "Existential", "Gestalt", "Gottman",
  "Internal Family Systems (IFS)", "Jungian", "Mindfulness", "Narrative",
  "Person-Centred", "Psychodynamic", "Psychospiritual Care",
  "Solution-Focused", "Somatic",
];

/**
 * Hard eligibility: the modes a clinician is explicitly configured to offer at the
 * selected location, limited to what the user accepts. Empty = not eligible.
 */
export const eligibleModes = (therapist: Therapist, location: string, sessionType: string): ServiceMode[] => {
  if (!location) return [];
  if (location === "Online") {
    return therapist.locationVerified && (therapist.onlineLocations || []).length > 0 ? ["Online"] : [];
  }
  const modes: ServiceMode[] = [];
  const wantsInPerson = sessionType !== "Virtually";
  const wantsOnline = sessionType !== "In-person";
  if (wantsInPerson && (therapist.inPersonLocations || []).includes(location)) modes.push("In-person");
  if (wantsOnline && (therapist.onlineLocations || []).includes(location)) modes.push("Online");
  return modes;
};

export const matchTherapists = (therapists: Therapist[], answers: QuizAnswers): MatchResult => {
  const bestMatches: Therapist[] = [];
  const otherMatches: Therapist[] = [];
  const modes: Record<string, ServiceMode[]> = {};

  const processedModalities =
    answers.modalities.includes("Not sure") || answers.modalities.length === 0 ? ALL_MODALITIES : answers.modalities;
  const processedGender =
    answers.gender.length === 0 || answers.gender.includes("No Preference") ? ["Man", "Woman", "Non-Binary"] : answers.gender;

  therapists.forEach((therapist) => {
    // 1. Mandatory filters: location + modality. Scores never override these.
    const available = eligibleModes(therapist, answers.location, answers.sessionType);
    if (available.length === 0) return;

    // 2. Existing criteria (soft): any miss moves the clinician to "other matches".
    const checks = [
      answers.services.length === 0 || answers.services.some((s) => therapist.services.includes(s)),
      answers.specialties.length === 0 || answers.specialties.some((s) => therapist.specialties.includes(s)),
      processedGender.includes(therapist.gender),
      processedModalities.some((m) => therapist.modalities.includes(m)),
      answers.availability.length === 0 || answers.availability.some((a) => therapist.availability.includes(a)),
      !answers.clientType || therapist.clientTypes.includes(answers.clientType),
    ];
    const score = checks.filter(Boolean).length;

    modes[therapist.id] = available;
    if (score === checks.length) bestMatches.push(therapist);
    else if (score > 0) otherMatches.push(therapist);
  });

  return { bestMatches, otherMatches, modes };
};
