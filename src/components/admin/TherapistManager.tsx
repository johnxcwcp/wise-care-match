
import React, { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Therapist } from "@/types";
import { toast } from "sonner";
import { Plus, Download, Upload } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import TherapistForm from "./therapist/TherapistForm";
import TherapistCard from "./therapist/TherapistCard";

const TherapistManager: React.FC = () => {
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
    if (window.confirm('Are you sure you want to delete this therapist?')) {
      deleteTherapistMutation.mutate(id);
    }
  };

  const handleEditClick = (therapist: Therapist) => {
    setEditingTherapist({...therapist});
    setIsEditDialogOpen(true);
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
        importedTherapists.forEach(therapist => {
          addTherapistMutation.mutate(therapist);
        });
        toast.success(`Successfully imported ${importedTherapists.length} therapists`);
      } catch (error) {
        toast.error("Error importing therapists. Please check file format.");
        console.error(error);
      }
    };
    reader.readAsText(file);
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-medium text-cwcp-blue">
          Therapists ({therapists.length})
        </h2>
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
                setTherapist={setNewTherapist}
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
            <TherapistCard 
              key={therapist.id}
              therapist={therapist}
              onEdit={handleEditClick}
              onDelete={handleDeleteTherapist}
            />
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
              setTherapist={setEditingTherapist}
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
