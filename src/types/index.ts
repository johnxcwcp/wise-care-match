
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
}

export interface QuizAnswers {
  specialties: string[];
  gender: string;
  modalities: string[];
  language: string;
  availability: string;
  sessionType: string;
  clientType: string;
}
