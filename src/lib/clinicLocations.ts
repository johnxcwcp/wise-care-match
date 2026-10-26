import { QuizQuestion } from "@/types";

/** Canonical clinic locations. `value` is what is stored on clinician records and quiz answers. */
export const CLINIC_LOCATIONS = [
  { value: "Toronto", label: "Toronto (CWCP)", clinic: "CWCP", description: "Centre for Wellness and Counselling Psychotherapy" },
  { value: "Picton", label: "Picton (PECCP)", clinic: "PECCP", description: "Prince Edward County, Ontario" },
  { value: "Yukon", label: "Yukon (YukonCP)", clinic: "YukonCP", description: "Serving clients in the Yukon" },
] as const;

export type ClinicLocation = (typeof CLINIC_LOCATIONS)[number]["value"];

export const locationLabel = (value?: string) =>
  CLINIC_LOCATIONS.find((l) => l.value === value)?.label ?? value ?? "";

export const LOCATION_QUESTION: QuizQuestion = {
  id: "location",
  title: "Where would you prefer to receive counselling?",
  description: "We'll only show clinicians who are confirmed to serve this location.",
  type: "single",
  fieldName: "location",
  options: CLINIC_LOCATIONS.map((l) => ({ id: `loc-${l.value}`, label: l.label, value: l.value })),
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
