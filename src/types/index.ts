
export interface Therapist {
  id: string;
  name: string;
  photo: string;
  pronouns: string;
  designation: string;
  bio: string;
  availability: string[];
  modalities: string[];
  specialties: string[];
  gender: string;
  languages: string[];
  sessionType: string[];
  clientTypes: string[];
  bookingLink: string;
  customMessage?: string;
  extendedBio?: string;
  introVideoUrl?: string;
}

export interface QuizAnswers {
  specialties: string[];
  gender: string[];
  modalities: string[];
  availability: string[];
  sessionType: string;
  clientType: string;
  services: string[];
}

export interface QuizQuestion {
  id: string;
  title: string;
  description?: string;
  type: 'single' | 'multiple';
  options: QuizQuestionOption[];
  fieldName: keyof QuizAnswers;
}

export interface QuizQuestionOption {
  id: string;
  label: string;
  value: string;
}

export interface SiteSettings {
  id: string;
  settingKey: string;
  settingValue: string | null;
  createdAt: string;
  updatedAt: string;
}
