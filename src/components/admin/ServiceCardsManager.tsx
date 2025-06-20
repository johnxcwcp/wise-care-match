
import React, { useState } from "react";
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

  const { data: serviceCards, isLoading } = useQuery({
    queryKey: ['serviceCards'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('service_cards')
        .select('*')
        .order('display_order');
      
      if (error) throw error;
      return data;
    }
  });

  const updateServiceCardMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: any }) => {
      const { error } = await supabase
        .from('service_cards')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCards'] });
      toast.success('Service card updated successfully');
    },
    onError: (error) => {
      console.error('Error updating service card:', error);
      toast.error('Error updating service card');
    }
  });

  const handleUpdate = (id: string, field: string, value: string) => {
    updateServiceCardMutation.mutate({ 
      id, 
      updates: { [field]: value } 
    });
  };

  if (isLoading) {
    return <div>Loading...</div>;
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
  const [title, setTitle] = useState(card.service_title);
  const [description, setDescription] = useState(card.service_description);
  const [illustrationUrl, setIllustrationUrl] = useState(card.illustration_url || '');

  const handleSaveTitle = () => {
    onUpdate(card.id, 'service_title', title);
  };

  const handleSaveDescription = () => {
    onUpdate(card.id, 'service_description', description);
  };

  const handleSaveIllustration = () => {
    onUpdate(card.id, 'illustration_url', illustrationUrl);
  };

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
          disabled={isUpdating}
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
          disabled={isUpdating}
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
          disabled={isUpdating}
          className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white mt-2"
          size="sm"
        >
          {isUpdating ? 'Saving...' : 'Save Illustration'}
        </Button>
      </div>
      
      {illustrationUrl && (
        <div className="mt-4">
          <Label>Preview:</Label>
          <div className="mt-2 aspect-video w-48 border rounded overflow-hidden">
            <img 
              src={illustrationUrl} 
              alt="Service illustration preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceCardsManager;
