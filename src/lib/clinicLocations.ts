import { QuizQuestion } from "@/types";

/** Canonical clinic locations. `value` is what is stored on clinician records and quiz answers. */
export const CLINIC_LOCATIONS = [
  { value: "Toronto", label: "Toronto (CWCP)", clinic: "CWCP", description: "Church Wellesley Counselling and Psychotherapy" },
  { value: "Picton", label: "Picton (PECCP)", clinic: "PECCP", description: "Prince Edward County, Ontario" },
  { value: "Yukon", label: "Yukon (YukonCP)", clinic: "YukonCP", description: "Serving clients in the Yukon" },
] as const;

export type ClinicLocation = (typeof CLINIC_LOCATIONS)[number]["value"];

/** Appointment choices are separate from the regional coverage stored on clinicians. */
export const LOCATION_OPTIONS = [
  ...CLINIC_LOCATIONS,
  { value: "Online", label: "Online", clinic: "Online", description: "Meet with your clinician virtually" },
] as const;

export const locationLabel = (value?: string) =>
  LOCATION_OPTIONS.find((l) => l.value === value)?.label ?? value ?? "";

export const LOCATION_QUESTION: QuizQuestion = {
  id: "location",
  title: "Preferred Location",
  description: 'You can schedule in-person appointments with our clinicians based on your location preference. Select "Online" if you prefer to meet with your clinician virtually.',
  type: "single",
  fieldName: "location",
  options: LOCATION_OPTIONS.map((l) => ({ id: `loc-${l.value}`, label: l.label, value: l.value })),
};

/** Editable display content never changes the canonical values used for matching. */
export const getLocationContent = (settings: { setting_key: string; setting_value: string | null }[] = []) => {
  const read = (key: string, fallback: string) =>
    settings.find(setting => setting.setting_key === key)?.setting_value ?? fallback;
  return {
    title: read("location_question_title", LOCATION_QUESTION.title),
    description: read("location_question_description", LOCATION_QUESTION.description ?? ""),
    options: LOCATION_OPTIONS.map(option => {
      const prefix = `location_${option.value.toLowerCase()}`;
      return {
        ...option,
        label: read(`${prefix}_label`, option.label),
        description: read(`${prefix}_description`, option.description),
        logo: read(`clinic_logo_${option.value.toLowerCase()}`, ""),
        logoAlt: read(`${prefix}_logo_alt`, `${option.clinic} logo`),
      };
    }),
  };
};

/** Ensures the location question is always the first step, even for questions cached in the browser. */
export const withLocationQuestion = (questions: QuizQuestion[]): QuizQuestion[] => [
  LOCATION_QUESTION,
  ...questions.filter((q) => q.fieldName !== "location"),
];

/** Maps location columns from a `therapists` row. Missing data stays empty (never assumed). */
export const mapLocationFields = (row: any) => ({
  homeClinic: row.home_clinic || "",
  inPersonLocations: (row.in_person_locations as string[] | null) || [],
  onlineLocations: (row.online_locations as string[] | null) || [],
  locationVerified: !!row.location_verified,
});

export const locationDbFields = (t: {
  homeClinic?: string;
  inPersonLocations?: string[];
  onlineLocations?: string[];
  locationVerified?: boolean;
}) => ({
  home_clinic: t.homeClinic || null,
  in_person_locations: t.inPersonLocations || [],
  online_locations: t.onlineLocations || [],
  location_verified: !!t.locationVerified,
});
