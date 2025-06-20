
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Pencil, Save, X } from "lucide-react";

interface ServiceCard {
  id: string;
  service_value: string;
  service_title: string;
  service_description: string;
  illustration_url: string | null;
  display_order: number;
}

const ServiceCardsManager: React.FC = () => {
  const [editingCard, setEditingCard] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<ServiceCard>>({});
  const queryClient = useQueryClient();

  const { data: serviceCards = [], isLoading } = useQuery({
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
    mutationFn: async (serviceCard: ServiceCard) => {
      const { error } = await supabase
        .from('service_cards')
        .update({
          service_title: serviceCard.service_title,
          service_description: serviceCard.service_description,
          illustration_url: serviceCard.illustration_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', serviceCard.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['serviceCards'] });
      toast.success('Service card updated successfully');
      setEditingCard(null);
      setEditForm({});
    },
    onError: (error) => {
      console.error('Error updating service card:', error);
      toast.error('Error updating service card');
    }
  });

  const handleEdit = (card: ServiceCard) => {
    setEditingCard(card.id);
    setEditForm(card);
  };

  const handleSave = () => {
    if (editingCard && editForm.id) {
      updateServiceCardMutation.mutate(editForm as ServiceCard);
    }
  };

  const handleCancel = () => {
    setEditingCard(null);
    setEditForm({});
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-medium text-cwcp-blue">Service Cards</h2>
      
      <div className="grid gap-6">
        {serviceCards.map((card) => (
          <Card key={card.id}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{card.service_value}</CardTitle>
                <div className="flex gap-2">
                  {editingCard === card.id ? (
                    <>
                      <Button
                        onClick={handleSave}
                        disabled={updateServiceCardMutation.isPending}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                      >
                        <Save className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleEdit(card)}
                      variant="outline"
                      size="sm"
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {editingCard === card.id ? (
                <>
                  <div>
                    <Label htmlFor={`title-${card.id}`}>Service Title</Label>
                    <Input
                      id={`title-${card.id}`}
                      value={editForm.service_title || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service_title: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`description-${card.id}`}>Service Description</Label>
                    <Textarea
                      id={`description-${card.id}`}
                      value={editForm.service_description || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, service_description: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label htmlFor={`illustration-${card.id}`}>Illustration URL (16:9 aspect ratio recommended)</Label>
                    <Input
                      id={`illustration-${card.id}`}
                      value={editForm.illustration_url || ''}
                      onChange={(e) => setEditForm(prev => ({ ...prev, illustration_url: e.target.value }))}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <strong>Title:</strong> {card.service_title}
                  </div>
                  <div>
                    <strong>Description:</strong> {card.service_description}
                  </div>
                  <div>
                    <strong>Illustration URL:</strong> {card.illustration_url || 'Not set'}
                  </div>
                  {card.illustration_url && (
                    <div>
                      <strong>Preview:</strong>
                      <div className="mt-2 w-32 aspect-video bg-gray-100 rounded overflow-hidden">
                        <img
                          src={card.illustration_url}
                          alt={card.service_title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ServiceCardsManager;
