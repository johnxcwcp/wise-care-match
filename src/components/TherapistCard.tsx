
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Therapist } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TherapistBioModal from "./TherapistBioModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  const { data: siteSettings } = useQuery({
    queryKey: ['siteSettings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*');
      if (error) throw error;
      return data;
    }
  });

  const getSettingValue = (key: string, defaultValue: string) => {
    return siteSettings?.find(setting => setting.setting_key === key)?.setting_value || defaultValue;
  };

  const specialtiesDisplayCount = parseInt(getSettingValue('specialties_display_count', '3'));
  const initials = therapist.name.split(" ").map(n => n[0]).join("");
  const displayedSpecialties = showAllSpecialties ? therapist.specialties : therapist.specialties.slice(0, specialtiesDisplayCount);

  return (
    <>
      <div className="glass-card rounded-3xl shadow-sophisticated overflow-hidden border border-white/20 hover:shadow-floating transition-all duration-300 hover:scale-[1.01]">
        <div className="p-8 bg-gradient-to-br from-white/90 via-white/80 to-blue-50/20 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 rounded-2xl shadow-elegant">
                <AvatarImage src={therapist.photo} alt={therapist.name} className="object-cover" />
                <AvatarFallback className="bg-cwcp-blue text-white text-2xl font-medium rounded-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <div>
                  <h3 className="text-xl font-medium text-cwcp-blue">{therapist.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-cwcp-darkgray">
                    <span>{therapist.pronouns}</span>
                    <span>•</span>
                    <span>{therapist.designation}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                  <Button 
                    asChild 
                    className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white rounded-2xl shadow-elegant hover:shadow-floating transition-all duration-300"
                  >
                    <a href={therapist.bookingLink} target="_blank" rel="noopener noreferrer">
                      Book Appointment
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBioModalOpen(true)} 
                    className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50/80 backdrop-blur-sm rounded-2xl shadow-elegant"
                  >
                    Read Bio
                  </Button>
                </div>
              </div>
              
              {/* Custom Message */}
              {therapist.customMessage && (
                <div className="mb-4 p-4 bg-blue-50/60 border border-blue-200/50 rounded-2xl backdrop-blur-sm">
                  <p className="text-sm text-blue-800">{therapist.customMessage}</p>
                </div>
              )}
              
              <p className="mb-4 text-cwcp-text">{therapist.bio}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-cwcp-blue mb-2">Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayedSpecialties.map(specialty => (
                      <Badge 
                        key={specialty} 
                        className="bg-cwcp-lightgray/80 text-cwcp-text hover:bg-cwcp-gray font-normal rounded-xl px-3 py-1 backdrop-blur-sm"
                      >
                        {specialty}
                      </Badge>
                    ))}
                    {therapist.specialties.length > specialtiesDisplayCount && !showAllSpecialties && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAllSpecialties(true)} 
                        className="text-cwcp-blue hover:text-cwcp-lightblue px-3 py-1 h-auto text-xs rounded-xl"
                      >
                        Expand (+{therapist.specialties.length - specialtiesDisplayCount} more)
                      </Button>
                    )}
                    {showAllSpecialties && therapist.specialties.length > specialtiesDisplayCount && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAllSpecialties(false)} 
                        className="text-cwcp-blue hover:text-cwcp-lightblue px-3 py-1 h-auto text-xs rounded-xl"
                      >
                        Collapse
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm">
                  <div>
                    <span className="font-medium text-cwcp-blue">Available:</span>{" "}
                    {therapist.availability.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium text-cwcp-blue">Languages:</span>{" "}
                    {therapist.languages.join(", ")}
                  </div>
                  <div>
                    <span className="font-medium text-cwcp-blue">Session Type:</span>{" "}
                    {therapist.sessionType.join(", ")}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <TherapistBioModal 
        therapist={therapist} 
        isOpen={isBioModalOpen} 
        onClose={() => setIsBioModalOpen(false)} 
      />
    </>
  );
};

export default TherapistCard;
