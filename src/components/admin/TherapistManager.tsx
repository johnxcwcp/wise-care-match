import React, { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Therapist } from "@/types";
import { toast } from "sonner";
import { Trash2, Edit, Plus, Download, Upload } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface TherapistManagerProps {
  therapists: Therapist[];
  setTherapists: (therapists: Therapist[]) => void;
}

const TherapistManager: React.FC<TherapistManagerProps> = () => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingTherapist, setEditingTherapist] = useState<Therapist | null>(null);
  const [newTherapist, setNewTherapist] = useState<Therapist>({
    id: '',
    name: '',
    pronouns: '',
    designation: '',
    bio: '',
    photo: '',
    availability: [],
    modalities: [],
    specialties: [],
    gender: '',
    languages: [],
    sessionType: [],
    clientTypes: [],
    bookingLink: ''
  });

  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch therapists
  const { data: therapists = [], isLoading } = useQuery({
    queryKey: ['therapists'],
    queryFn: async () => {
      const { data: therapistsData, error: therapistsError } = await supabase
        .from('therapists')
        .select(`
          *,
          therapist_availability(availability),
          therapist_modalities(modality),
          therapist_specialties(specialty),
          therapist_languages(language),
          therapist_session_types(session_type),
          therapist_client_types(client_type)
        `);

      if (therapistsError) {
        toast.error('Error fetching therapists');
        throw therapistsError;
      }

      return therapistsData.map(therapist => ({
        id: therapist.id,
        name: therapist.name,
        pronouns: therapist.pronouns || '',
        designation: therapist.designation || '',
        bio: therapist.bio || '',
        photo: therapist.photo || '',
        gender: therapist.gender || '',
        bookingLink: therapist.booking_link || '',
        availability: therapist.therapist_availability?.map(a => a.availability) || [],
        modalities: therapist.therapist_modalities?.map(m => m.modality) || [],
        specialties: therapist.therapist_specialties?.map(s => s.specialty) || [],
        languages: therapist.therapist_languages?.map(l => l.language) || [],
        sessionType: therapist.therapist_session_types?.map(st => st.session_type) || [],
        clientTypes: therapist.therapist_client_types?.map(ct => ct.client_type) || []
      }));
    }
  });

  // Add therapist mutation
  const addTherapistMutation = useMutation({
    mutationFn: async (therapist: Therapist) => {
      // Insert main therapist record
      const { data: therapistData, error: therapistError } = await supabase
        .from('therapists')
        .insert({
          name: therapist.name,
          pronouns: therapist.pronouns,
          designation: therapist.designation,
          bio: therapist.bio,
          photo: therapist.photo,
          gender: therapist.gender,
          booking_link: therapist.bookingLink
        })
        .select()
        .single();

      if (therapistError) throw therapistError;

      // Insert related records
      const relatedPromises = [
        ...therapist.availability.map(item => 
          supabase.from('therapist_availability').insert({ therapist_id: therapistData.id, availability: item })
        ),
        ...therapist.modalities.map(item => 
          supabase.from('therapist_modalities').insert({ therapist_id: therapistData.id, modality: item })
        ),
        ...therapist.specialties.map(item => 
          supabase.from('therapist_specialties').insert({ therapist_id: therapistData.id, specialty: item })
        ),
        ...therapist.languages.map(item => 
          supabase.from('therapist_languages').insert({ therapist_id: therapistData.id, language: item })
        ),
        ...therapist.sessionType.map(item => 
          supabase.from('therapist_session_types').insert({ therapist_id: therapistData.id, session_type: item })
        ),
        ...therapist.clientTypes.map(item => 
          supabase.from('therapist_client_types').insert({ therapist_id: therapistData.id, client_type: item })
        )
      ];

      await Promise.all(relatedPromises);
      return therapistData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      toast.success('Therapist added successfully');
      setIsAddDialogOpen(false);
      setNewTherapist({
        id: '',
        name: '',
        pronouns: '',
        designation: '',
        bio: '',
        photo: '',
        availability: [],
        modalities: [],
        specialties: [],
        gender: '',
        languages: [],
        sessionType: [],
        clientTypes: [],
        bookingLink: ''
      });
    },
    onError: (error) => {
      console.error('Error adding therapist:', error);
      toast.error('Error adding therapist');
    }
  });

  // Update therapist mutation
  const updateTherapistMutation = useMutation({
    mutationFn: async (therapist: Therapist) => {
      // Update main therapist record
      const { error: therapistError } = await supabase
        .from('therapists')
        .update({
          name: therapist.name,
          pronouns: therapist.pronouns,
          designation: therapist.designation,
          bio: therapist.bio,
          photo: therapist.photo,
          gender: therapist.gender,
          booking_link: therapist.bookingLink
        })
        .eq('id', therapist.id);

      if (therapistError) throw therapistError;

      // Delete existing related records
      const deletePromises = [
        supabase.from('therapist_availability').delete().eq('therapist_id', therapist.id),
        supabase.from('therapist_modalities').delete().eq('therapist_id', therapist.id),
        supabase.from('therapist_specialties').delete().eq('therapist_id', therapist.id),
        supabase.from('therapist_languages').delete().eq('therapist_id', therapist.id),
        supabase.from('therapist_session_types').delete().eq('therapist_id', therapist.id),
        supabase.from('therapist_client_types').delete().eq('therapist_id', therapist.id)
      ];

      await Promise.all(deletePromises);

      // Insert new related records
      const insertPromises = [
        ...therapist.availability.map(item => 
          supabase.from('therapist_availability').insert({ therapist_id: therapist.id, availability: item })
        ),
        ...therapist.modalities.map(item => 
          supabase.from('therapist_modalities').insert({ therapist_id: therapist.id, modality: item })
        ),
        ...therapist.specialties.map(item => 
          supabase.from('therapist_specialties').insert({ therapist_id: therapist.id, specialty: item })
        ),
        ...therapist.languages.map(item => 
          supabase.from('therapist_languages').insert({ therapist_id: therapist.id, language: item })
        ),
        ...therapist.sessionType.map(item => 
          supabase.from('therapist_session_types').insert({ therapist_id: therapist.id, session_type: item })
        ),
        ...therapist.clientTypes.map(item => 
          supabase.from('therapist_client_types').insert({ therapist_id: therapist.id, client_type: item })
        )
      ];

      await Promise.all(insertPromises);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      toast.success('Therapist updated successfully');
      setIsEditDialogOpen(false);
      setEditingTherapist(null);
    },
    onError: (error) => {
      console.error('Error updating therapist:', error);
      toast.error('Error updating therapist');
    }
  });

  // Delete therapist mutation
  const deleteTherapistMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('therapists')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['therapists'] });
      toast.success('Therapist deleted successfully');
    },
    onError: (error) => {
      console.error('Error deleting therapist:', error);
      toast.error('Error deleting therapist');
    }
  });

  const handleAddTherapist = () => {
    addTherapistMutation.mutate(newTherapist);
  };

  const handleEditTherapist = () => {
    if (!editingTherapist) return;
    updateTherapistMutation.mutate(editingTherapist);
  };

  const handleDeleteTherapist = (id: string) => {
    deleteTherapistMutation.mutate(id);
  };

  const handleEditClick = (therapist: Therapist) => {
    setEditingTherapist({...therapist});
    setIsEditDialogOpen(true);
  };

  const toggleArrayItem = (array: string[], item: string): string[] => {
    return array.includes(item) 
      ? array.filter(i => i !== item)
      : [...array, item];
  };

  const exportTherapists = () => {
    const dataStr = JSON.stringify(therapists, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'therapists.json';
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const importTherapists = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const importedTherapists = JSON.parse(content) as Therapist[];
        // setTherapists(importedTherapists); // This line is removed
        queryClient.setQueryData(['therapists'], importedTherapists); // Update React Query cache directly
        toast.success(`Successfully imported ${importedTherapists.length} therapists`);
      } catch (error) {
        toast.error("Error importing therapists. Please check file format.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    // Reset input so the same file can be imported again if needed
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  // List of options
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

  const TherapistForm = ({ 
    therapist, 
    setTherapist, 
    onSubmit, 
    submitText = "Add Therapist" 
  }: {
    therapist: Therapist,
    setTherapist: React.Dispatch<React.SetStateAction<Therapist>>,
    onSubmit: () => void,
    submitText?: string
  }) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="name">Name</Label>
        <Input 
          id="name" 
          value={therapist.name} 
          onChange={(e) => setTherapist({...therapist, name: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="pronouns">Pronouns</Label>
        <Input 
          id="pronouns" 
          value={therapist.pronouns} 
          onChange={(e) => setTherapist({...therapist, pronouns: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="designation">Designation</Label>
        <Input 
          id="designation" 
          value={therapist.designation} 
          onChange={(e) => setTherapist({...therapist, designation: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="photo">Photo URL</Label>
        <Input 
          id="photo" 
          value={therapist.photo} 
          onChange={(e) => setTherapist({...therapist, photo: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="bio">Bio</Label>
        <Textarea 
          id="bio" 
          value={therapist.bio} 
          onChange={(e) => setTherapist({...therapist, bio: e.target.value})} 
          required 
        />
      </div>
      
      <div>
        <Label htmlFor="bookingLink">Booking Link</Label>
        <Input 
          id="bookingLink" 
          value={therapist.bookingLink} 
          onChange={(e) => setTherapist({...therapist, bookingLink: e.target.value})} 
          required 
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-cwcp-blue">Therapists ({therapists.length})</h2>
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={importTherapists}
            accept=".json"
            className="hidden"
          />
          <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
            <Upload className="w-4 h-4 mr-2" /> Import
          </Button>
          <Button variant="outline" onClick={exportTherapists}>
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" /> Add Therapist
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Add New Therapist</DialogTitle>
              </DialogHeader>
              <TherapistForm 
                therapist={newTherapist} 
                setTherapist={setNewTherapist as any}
                onSubmit={handleAddTherapist}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {therapists.length === 0 ? (
        <div className="bg-white p-6 rounded-lg text-center">
          <p className="text-cwcp-darkgray">No therapists added yet. Add your first therapist to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {therapists.map(therapist => (
            <div 
              key={therapist.id} 
              className="bg-white p-4 rounded-lg shadow-sm border border-cwcp-gray flex items-start gap-4"
            >
              <Avatar className="w-16 h-16">
                <AvatarImage src={therapist.photo} alt={therapist.name} />
                <AvatarFallback>
                  {therapist.name.split(" ").map(n => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex justify-between">
                  <h3 className="text-xl font-medium text-cwcp-blue">{therapist.name}</h3>
                  <div className="space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditClick(therapist)}
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteTherapist(therapist.id)}
                    >
                      <Trash2 className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-cwcp-darkgray">
                  {therapist.pronouns} · {therapist.designation} · {therapist.gender}
                </div>
                <p className="text-sm my-2 line-clamp-2">{therapist.bio}</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {therapist.specialties.slice(0, 3).map(specialty => (
                    <Badge key={specialty} variant="outline">{specialty}</Badge>
                  ))}
                  {therapist.specialties.length > 3 && (
                    <Badge variant="outline">+{therapist.specialties.length - 3} more</Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Therapist</DialogTitle>
          </DialogHeader>
          {editingTherapist && (
            <TherapistForm 
              therapist={editingTherapist} 
              setTherapist={setEditingTherapist as any}
              onSubmit={handleEditTherapist}
              submitText="Save Changes"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TherapistManager;
