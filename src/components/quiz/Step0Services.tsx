
import React from "react";
import { QuizQuestion } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";

interface Step0ServicesProps {
  selectedServices: string[];
  setSelectedServices: (services: string[]) => void;
  question: QuizQuestion;
}

const Step0Services: React.FC<Step0ServicesProps> = ({
  selectedServices,
  setSelectedServices,
  question
}) => {
  const { data: serviceCards = [] } = useQuery({
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

  const handleServiceToggle = (service: string) => {
    // Single select - replace the current selection
    setSelectedServices([service]);
  };

  return (
    <div>
      <h3 className="text-2xl font-medium text-cwcp-blue mb-2">
        {question.title}
      </h3>
      {question.description && (
        <p className="text-cwcp-darkgray mb-6">
          {question.description}
        </p>
      )}
      
      {/* Desktop version - grid layout */}
      <div className="hidden md:grid md:grid-cols-2 gap-6">
        {serviceCards.map((serviceCard) => (
          <Card 
            key={serviceCard.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-floating border-2 rounded-2xl glass-card backdrop-blur-sm ${
              selectedServices.includes(serviceCard.service_value) 
                ? 'border-cwcp-blue bg-blue-50/80 shadow-elegant' 
                : 'border-cwcp-gray/50 hover:border-cwcp-blue/60 hover:bg-white/90'
            }`}
            onClick={() => handleServiceToggle(serviceCard.service_value)}
          >
            <CardContent className="p-0">
              {/* Illustration section with 16:9 aspect ratio */}
              <div className="w-full aspect-video bg-gradient-to-br from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-t-2xl overflow-hidden">
                {serviceCard.illustration_url ? (
                  <img 
                    src={serviceCard.illustration_url} 
                    alt={serviceCard.service_title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cwcp-lightgray/80 to-gray-200/60 backdrop-blur-sm">
                    <div className="text-cwcp-darkgray text-sm">No image</div>
                  </div>
                )}
              </div>
              
              {/* Content section */}
              <div className="p-6 glass-light rounded-b-2xl">
                <h4 className="text-lg font-medium text-cwcp-blue mb-2">
                  {serviceCard.service_title}
                </h4>
                <p className="text-sm text-cwcp-darkgray leading-relaxed">
                  {serviceCard.service_description}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mobile version - simplified list layout */}
      <div className="md:hidden space-y-3">
        {serviceCards.map((serviceCard) => (
          <Card 
            key={serviceCard.id}
            className={`cursor-pointer transition-all duration-300 border-2 rounded-2xl glass-card backdrop-blur-sm ${
              selectedServices.includes(serviceCard.service_value) 
                ? 'border-cwcp-blue bg-blue-50/80 shadow-elegant' 
                : 'border-cwcp-gray/50 hover:border-cwcp-blue/60 hover:bg-white/90'
            }`}
            onClick={() => handleServiceToggle(serviceCard.service_value)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-3">
                {/* Small thumbnail */}
                <div className="w-16 h-12 bg-gradient-to-br from-gray-100/80 to-gray-200/60 backdrop-blur-sm rounded-lg overflow-hidden flex-shrink-0">
                  {serviceCard.illustration_url ? (
                    <img 
                      src={serviceCard.illustration_url} 
                      alt={serviceCard.service_title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-cwcp-lightgray/80 to-gray-200/60 backdrop-blur-sm"></div>
                  )}
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-base font-medium text-cwcp-blue mb-1">
                    {serviceCard.service_title}
                  </h4>
                  <p className="text-sm text-cwcp-darkgray line-clamp-2">
                    {serviceCard.service_description}
                  </p>
                </div>
                
                {/* Selection indicator */}
                <div className="flex-shrink-0">
                  <div className={`w-5 h-5 rounded-full border-2 backdrop-blur-sm ${
                    selectedServices.includes(serviceCard.service_value) 
                      ? 'border-cwcp-blue bg-cwcp-blue/90' 
                      : 'border-gray-300/70 bg-white/50'
                  }`}>
                    {selectedServices.includes(serviceCard.service_value) && (
                      <div className="w-full h-full flex items-center justify-center">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Step0Services;
