
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ServiceCardsManager: React.FC = () => {
  const queryClient = useQueryClient();

  const { data: serviceCards, isLoading, error } = useQuery({
    queryKey: ['serviceCards'],
    queryFn: async () => {
      console.log('Fetching service cards...');
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('display_order');
      
      if (error) {
        console.error('Error fetching service cards:', error);
        throw error;
      }
      console.log('Fetched service cards:', data);
      return data;
    }
  });

  const updateServiceCardMutation = useMutation({
    mutationFn: async ({ id, field, value }: { id: string; field: string; value: string }) => {
      console.log(`Updating service card ${id}: ${field} = ${value}`);
      
      const { data, error } = await supabase
        .from('service_cards')
        .update({ 
          [field]: value, 
          updated_at: new Date().toISOString() 
        })
        .eq('id', id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating service card:', error);
        throw error;
      }
      
      console.log('Update successful:', data);
      return data;
    },
    onSuccess: (data, variables) => {
      // Update the cache immediately with the new data
      queryClient.setQueryData(['serviceCards'], (oldData: any[]) => {
        if (!oldData) return oldData;
        return oldData.map(card => 
          card.id === variables.id 
            ? { ...card, [variables.field]: variables.value, updated_at: new Date().toISOString() }
            : card
        );
      });
      
      // Also invalidate to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['serviceCards'] });
      toast.success(`${variables.field.replace('_', ' ')} updated successfully`);
    },
    onError: (error, variables) => {
      console.error('Error updating service card:', error);
      toast.error(`Error updating ${variables.field.replace('_', ' ')}: ${error.message}`);
    }
  });

  const handleUpdate = (id: string, field: string, value: string) => {
    console.log('handleUpdate called:', { id, field, value });
    updateServiceCardMutation.mutate({ id, field, value });
  };

  if (isLoading) {
    return <div>Loading service cards...</div>;
  }

  if (error) {
    return <div>Error loading service cards: {error.message}</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-cwcp-blue">Service Cards Management</h2>
      
      <div className="grid gap-6">
        {serviceCards?.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <CardTitle>Service: {card.service_title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ServiceCardForm
                card={card}
                onUpdate={handleUpdate}
                isUpdating={updateServiceCardMutation.isPending}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

interface ServiceCardFormProps {
  card: any;
  onUpdate: (id: string, field: string, value: string) => void;
  isUpdating: boolean;
}

const ServiceCardForm: React.FC<ServiceCardFormProps> = ({ card, onUpdate, isUpdating }) => {
  const [title, setTitle] = useState(card.service_title || '');
  const [description, setDescription] = useState(card.service_description || '');
  const [illustrationUrl, setIllustrationUrl] = useState(card.illustration_url || '');

  // Update local state when card data changes from the server
  useEffect(() => {
    console.log('Card data changed:', card);
    setTitle(card.service_title || '');
    setDescription(card.service_description || '');
    setIllustrationUrl(card.illustration_url || '');
  }, [card.service_title, card.service_description, card.illustration_url, card.updated_at]);

  const handleSaveTitle = () => {
    const trimmedTitle = title.trim();
    if (trimmedTitle && trimmedTitle !== card.service_title) {
      console.log('Saving title:', trimmedTitle);
      onUpdate(card.id, 'service_title', trimmedTitle);
    } else if (!trimmedTitle) {
      toast.error('Title cannot be empty');
    }
  };

  const handleSaveDescription = () => {
    const trimmedDescription = description.trim();
    if (trimmedDescription && trimmedDescription !== card.service_description) {
      console.log('Saving description:', trimmedDescription);
      onUpdate(card.id, 'service_description', trimmedDescription);
    } else if (!trimmedDescription) {
      toast.error('Description cannot be empty');
    }
  };

  const handleSaveIllustration = () => {
    const trimmedUrl = illustrationUrl.trim();
    if (trimmedUrl !== (card.illustration_url || '')) {
      console.log('Saving illustration URL:', trimmedUrl);
      onUpdate(card.id, 'illustration_url', trimmedUrl);
    }
  };

  const isTitleChanged = title.trim() !== card.service_title && title.trim() !== '';
  const isDescriptionChanged = description.trim() !== card.service_description && description.trim() !== '';
  const isIllustrationChanged = illustrationUrl.trim() !== (card.illustration_url || '');

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor={`title-${card.id}`}>Service Title</Label>
        <Input
          id={`title-${card.id}`}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter service title..."
        />
        <Button 
          onClick={handleSaveTitle}
          disabled={isUpdating || !isTitleChanged}
          className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
          size="sm"
        >
          {isUpdating ? 'Saving...' : 'Save Title'}
        </Button>
      </div>
      
      <div>
        <Label htmlFor={`description-${card.id}`}>Service Description</Label>
        <Textarea
          id={`description-${card.id}`}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter service description..."
          className="min-h-[100px]"
        />
        <Button 
          onClick={handleSaveDescription}
          disabled={isUpdating || !isDescriptionChanged}
          className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
          size="sm"
        >
          {isUpdating ? 'Saving...' : 'Save Description'}
        </Button>
      </div>
      
      <div>
        <Label htmlFor={`illustration-${card.id}`}>Illustration URL (16:9 aspect ratio recommended)</Label>
        <Input
          id={`illustration-${card.id}`}
          value={illustrationUrl}
          onChange={(e) => setIllustrationUrl(e.target.value)}
          placeholder="Enter illustration URL..."
        />
        <Button 
          onClick={handleSaveIllustration}
          disabled={isUpdating || !isIllustrationChanged}
          className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
          size="sm"
        >
          {isUpdating ? 'Saving...' : 'Save Illustration'}
        </Button>
      </div>
      
      {illustrationUrl && (
        <div className="mt-4">
          <Label>Preview:</Label>
          <div className="mt-2 aspect-video w-48 border rounded overflow-hidden relative">
            <img 
              src={illustrationUrl} 
              alt="Service illustration preview"
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const errorDiv = target.nextElementSibling as HTMLElement;
                if (errorDiv) {
                  errorDiv.classList.remove('hidden');
                }
              }}
            />
            <div className="hidden absolute inset-0 flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
              Failed to load image
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCardsManager;
