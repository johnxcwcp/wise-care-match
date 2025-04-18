
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { DialogClose, DialogFooter } from "@/components/ui/dialog";
import { Therapist } from "@/types";

interface TherapistFormProps {
  therapist: Therapist;
  setTherapist: React.Dispatch<React.SetStateAction<Therapist>>;
  onSubmit: () => void;
  submitText?: string;
}

const TherapistForm: React.FC<TherapistFormProps> = ({
  therapist,
  setTherapist,
  onSubmit,
  submitText = "Add Therapist"
}) => {
  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  // Options arrays
  const availabilityOptions = ["Weekdays", "Evenings", "Weekends"];
  const modalityOptions = [
    "Acceptance and Commitment (ACT)", "Adlerian", "Attachment-Based",
    "Cognitive Behavioural Therapy (CBT)", "Dialectical Behavioural Therapy (DBT)",
    "Emotion Focused", "Existential", "Gestalt", "Gottman",
    "Internal Family Systems (IFS)", "Jungian", "Mindfulness", "Narrative", 
    "Person-Centred", "Psychodynamic", "Psychospiritual Care", 
    "Solution-Focused", "Somatic"
  ];
  const specialtyOptions = [
    "Addiction", "ADHD", "Aging", "Anger", "Anxiety", "Coping Skills and Strategies",
    "Depression", "Eating Disorders", "Grief", "LGBTQ+ Support", "Life Transitions",
    "Mood Disorders", "Non-Monogamy", "OCD", "Personality Disorders", "Post-Partum",
    "Psychedelic Integration", "PTSD", "Relationship Issues", "Self Esteem", 
    "Self Harm", "Sex Therapy", "Spirituality", "Stress", "Suicidal Ideation", 
    "Trans & Non-Binary", "Trauma"
  ];
  const genderOptions = ["Man", "Woman", "Non-Binary"];
  const languageOptions = ["English", "Italian", "Arabic"];
  const sessionTypeOptions = ["In-person", "Virtually"];
  const clientTypeOptions = ["Adults (18-65)", "Seniors (65+)", "Teens (13-18)", "Pre-Teens (11-13)", "Children (6-11)"];

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          value={therapist.name} 
          onChange={(e) => setTherapist({...therapist, name: e.target.value})} 
        />
      </div>
      
      <div>
        <Label htmlFor="pronouns">Pronouns</Label>
        <Input 
          id="pronouns" 
          value={therapist.pronouns} 
          onChange={(e) => setTherapist({...therapist, pronouns: e.target.value})} 
        />
      </div>
      
      <div>
        <Label htmlFor="designation">Designation</Label>
        <Input 
          id="designation" 
          value={therapist.designation} 
          onChange={(e) => setTherapist({...therapist, designation: e.target.value})} 
        />
      </div>
      
      <div>
        <Label htmlFor="photo">Photo URL</Label>
        <Input 
          id="photo" 
          value={therapist.photo} 
          onChange={(e) => setTherapist({...therapist, photo: e.target.value})} 
        />
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          value={therapist.bio} 
          onChange={(e) => setTherapist({...therapist, bio: e.target.value})} 
        />
      </div>
      
      <div>
        <Label htmlFor="bookingLink">Booking Link</Label>
        <Input 
          id="bookingLink" 
          value={therapist.bookingLink} 
          onChange={(e) => setTherapist({...therapist, bookingLink: e.target.value})} 
        />
      </div>
      
      <div>
        <Label className="mb-2 block">Gender</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {genderOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <input
                type="radio"
                id={`gender-${option}`}
                checked={therapist.gender === option}
                onChange={() => setTherapist({...therapist, gender: option})}
              />
              <Label htmlFor={`gender-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Availability</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {availabilityOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`availability-${option}`}
                checked={therapist.availability.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    availability: toggleArrayItem(therapist.availability, option)
                  })
                }
              />
              <Label htmlFor={`availability-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Languages</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {languageOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`language-${option}`}
                checked={therapist.languages.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    languages: toggleArrayItem(therapist.languages, option)
                  })
                }
              />
              <Label htmlFor={`language-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Session Types</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
          {sessionTypeOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`session-${option}`}
                checked={therapist.sessionType.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    sessionType: toggleArrayItem(therapist.sessionType, option)
                  })
                }
              />
              <Label htmlFor={`session-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Client Types</Label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {clientTypeOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`client-${option}`}
                checked={therapist.clientTypes.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    clientTypes: toggleArrayItem(therapist.clientTypes, option)
                  })
                }
              />
              <Label htmlFor={`client-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Modalities</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {modalityOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`modality-${option}`}
                checked={therapist.modalities.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    modalities: toggleArrayItem(therapist.modalities, option)
                  })
                }
              />
              <Label htmlFor={`modality-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <div>
        <Label className="mb-2 block">Specialties</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
          {specialtyOptions.map(option => (
            <div key={option} className="flex items-center gap-2">
              <Checkbox
                id={`specialty-${option}`}
                checked={therapist.specialties.includes(option)}
                onCheckedChange={() => 
                  setTherapist({
                    ...therapist, 
                    specialties: toggleArrayItem(therapist.specialties, option)
                  })
                }
              />
              <Label htmlFor={`specialty-${option}`}>{option}</Label>
            </div>
          ))}
        </div>
      </div>
      
      <DialogFooter>
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button type="button" onClick={onSubmit}>
          {submitText}
        </Button>
      </DialogFooter>
    </div>
  );
};

export default TherapistForm;
