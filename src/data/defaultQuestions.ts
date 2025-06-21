
import { QuizQuestion } from "@/types";

export const defaultQuestions: QuizQuestion[] = [
  {
    id: "0",
    title: "Which service are you interested in?",
    type: "single",
    fieldName: "services",
    options: [
      { id: "0-1", label: "Individual Counselling and Psychotherapy", value: "Individual Counselling and Psychotherapy" },
      { id: "0-2", label: "Relationship and Couples Counselling and Psychotherapy", value: "Relationship and Couples Counselling and Psychotherapy" }
    ]
  },
  {
    id: "1",
    title: "What brings you to therapy?",
    description: "Select all that apply to you.",
    type: "multiple",
    fieldName: "specialties",
    options: [
      { id: "1-1", label: "Addiction", value: "Addiction" },
      { id: "1-2", label: "ADHD", value: "ADHD" },
      { id: "1-3", label: "Autism", value: "Autism" },
      { id: "1-4", label: "Anger", value: "Anger" },
      { id: "1-5", label: "Anxiety", value: "Anxiety" },
      { id: "1-6", label: "Coping Skills", value: "Coping Skills" },
      { id: "1-7", label: "Depression", value: "Depression" },
      { id: "1-8", label: "Eating Disorders", value: "Eating Disorders" },
      { id: "1-9", label: "Grief", value: "Grief" },
      { id: "1-10", label: "LGBTQ+ Support", value: "LGBTQ+ Support" },
      { id: "1-11", label: "Life Transitions", value: "Life Transitions" },
      { id: "1-12", label: "Mood Disorders", value: "Mood Disorders" },
      { id: "1-13", label: "Non-Monogamy", value: "Non-Monogamy" },
      { id: "1-14", label: "OCD", value: "OCD" },
      { id: "1-15", label: "Personality Disorders", value: "Personality Disorders" },
      { id: "1-16", label: "Postpartum", value: "Postpartum" },
      { id: "1-17", label: "Psychedelic Integration", value: "Psychedelic Integration" },
      { id: "1-18", label: "PTSD", value: "PTSD" },
      { id: "1-19", label: "Relationship Issues", value: "Relationship Issues" },
      { id: "1-20", label: "Self-Esteem", value: "Self-Esteem" },
      { id: "1-21", label: "Self Harm", value: "Self Harm" },
      { id: "1-22", label: "Sex Therapy", value: "Sex Therapy" },
      { id: "1-23", label: "Spirituality", value: "Spirituality" },
      { id: "1-24", label: "Stress", value: "Stress" },
      { id: "1-25", label: "Suicidal Ideation", value: "Suicidal Ideation" },
      { id: "1-26", label: "Trans & Non-Binary", value: "Trans & Non-Binary" },
      { id: "1-27", label: "Trauma", value: "Trauma" }
    ]
  },
  {
    id: "2",
    title: "Do you have a preference for your therapist's gender?",
    description: "Select all that apply to you.",
    type: "multiple",
    fieldName: "gender",
    options: [
      { id: "2-1", label: "Man", value: "Man" },
      { id: "2-2", label: "Woman", value: "Woman" },
      { id: "2-3", label: "Non-Binary", value: "Non-Binary" },
      { id: "2-4", label: "No Preference", value: "No Preference" }
    ]
  },
  {
    id: "3",
    title: "What therapy modalities interest you?",
    description: "Select all that apply to you, or skip if you're not sure.",
    type: "multiple",
    fieldName: "modalities",
    options: [
      { id: "3-19", label: "Not sure", value: "Not sure" },
      { id: "3-1", label: "Acceptance and Commitment (ACT)", value: "Acceptance and Commitment (ACT)" },
      { id: "3-2", label: "Adlerian", value: "Adlerian" },
      { id: "3-3", label: "Attachment-Based", value: "Attachment-Based" },
      { id: "3-4", label: "Cognitive Behavioural Therapy (CBT)", value: "Cognitive Behavioural Therapy (CBT)" },
      { id: "3-5", label: "Dialectical Behavioural Therapy (DBT)", value: "Dialectical Behavioural Therapy (DBT)" },
      { id: "3-6", label: "Emotion Focused", value: "Emotion Focused" },
      { id: "3-7", label: "Existential", value: "Existential" },
      { id: "3-8", label: "Gestalt", value: "Gestalt" },
      { id: "3-9", label: "Gottman", value: "Gottman" },
      { id: "3-10", label: "Internal Family Systems (IFS)", value: "Internal Family Systems (IFS)" },
      { id: "3-11", label: "Jungian", value: "Jungian" },
      { id: "3-12", label: "Mindfulness", value: "Mindfulness" },
      { id: "3-13", label: "Narrative", value: "Narrative" },
      { id: "3-14", label: "Person-Centred", value: "Person-Centred" },
      { id: "3-15", label: "Psychodynamic", value: "Psychodynamic" },
      { id: "3-16", label: "Psychospiritual Care", value: "Psychospiritual Care" },
      { id: "3-17", label: "Solution-Focused", value: "Solution-Focused" },
      { id: "3-18", label: "Somatic", value: "Somatic" }
    ]
  },
  {
    id: "4",
    title: "What is your availability?",
    type: "single",
    fieldName: "availability",
    options: [
      { id: "4-1", label: "Weekdays", value: "Weekdays" },
      { id: "4-2", label: "Evenings", value: "Evenings" },
      { id: "4-3", label: "Weekends", value: "Weekends" }
    ]
  },
  {
    id: "5",
    title: "Do you prefer to see your therapist in-person or virtually?",
    type: "single",
    fieldName: "sessionType",
    options: [
      { id: "5-1", label: "In-person", value: "In-person" },
      { id: "5-2", label: "Virtually", value: "Virtually" },
      { id: "5-3", label: "No Preference", value: "No Preference" }
    ]
  },
  {
    id: "6",
    title: "What is your age range?",
    type: "single",
    fieldName: "clientType",
    options: [
      { id: "6-1", label: "Adults (18-65)", value: "Adults (18-65)" },
      { id: "6-2", label: "Seniors (65+)", value: "Seniors (65+)" },
      { id: "6-3", label: "Teens (13-18)", value: "Teens (13-18)" },
      { id: "6-4", label: "Pre-Teens (11-13)", value: "Pre-Teens (11-13)" },
      { id: "6-5", label: "Children (6-11)", value: "Children (6-11)" }
    ]
  }
];
