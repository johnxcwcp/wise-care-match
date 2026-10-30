
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Therapist } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TherapistBioModal from "./TherapistBioModal";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarDays, Languages, Video, MapPin, Heart, ArrowUpRight, UserRound, MessageCircle, ChevronDown, ChevronUp } from "lucide-react";

interface TherapistCardProps {
  therapist: Therapist;
  modes?: string[];
  locationName?: string;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist, modes, locationName }) => {
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
      <div className="bg-card rounded-2xl shadow-elegant overflow-hidden border border-border transition-colors duration-300 hover:border-foreground/30">
        <div className="p-5 sm:p-7">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32 rounded-2xl shadow-elegant">
                <AvatarImage src={therapist.photo} alt={therapist.name} className="object-cover" />
                <AvatarFallback className="bg-secondary text-foreground text-2xl font-normal rounded-2xl">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-3">
                <div>
                  <h3 className="text-xl font-medium text-cwcp-blue">{therapist.name}</h3>
                  <div className="flex flex-wrap items-center gap-2 mt-1 text-muted-foreground text-sm">
                    <span>{therapist.pronouns}</span>
                    <span>•</span>
                    <span>{therapist.designation}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-2 mt-3 sm:mt-0">
                  <Button 
                    asChild 
                    className="rounded-full"
                  >
                    <a href={therapist.bookingLink} target="_blank" rel="noopener noreferrer">
                      Book Appointment <ArrowUpRight aria-hidden="true" />
                    </a>
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setIsBioModalOpen(true)} 
                    className="rounded-full"
                  >
                    <UserRound aria-hidden="true" /> Read Bio
                  </Button>
                </div>
              </div>
              
              {/* Custom Message */}
              {therapist.customMessage && (
                <div className="mb-4 flex items-start gap-2 border-l border-border pl-3">
                  <MessageCircle className="h-4 w-4 mt-1 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <p className="text-sm text-muted-foreground">{therapist.customMessage}</p>
                </div>
              )}
              
              <p className="mb-5 text-muted-foreground leading-relaxed">{therapist.bio}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="flex items-center gap-2 font-normal text-foreground mb-2"><Heart className="h-4 w-4 text-muted-foreground" aria-hidden="true" />Specialties</h4>
                  <div className="flex flex-wrap gap-2">
                    {displayedSpecialties.map(specialty => (
                      <Badge 
                        key={specialty} 
                        className="bg-secondary text-foreground hover:bg-muted border-transparent font-normal rounded-full px-3 py-1"
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
                        <ChevronDown aria-hidden="true" /> {therapist.specialties.length - specialtiesDisplayCount} more
                      </Button>
                    )}
                    {showAllSpecialties && therapist.specialties.length > specialtiesDisplayCount && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => setShowAllSpecialties(false)} 
                        className="text-cwcp-blue hover:text-cwcp-lightblue px-3 py-1 h-auto text-xs rounded-xl"
                      >
                        <ChevronUp aria-hidden="true" /> Less
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm border-t border-border pt-4 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only">Available:</span>{" "}
                    {therapist.availability.join(", ")}
                  </div>
                  <div className="flex items-center gap-2">
                    <Languages className="h-4 w-4 shrink-0" aria-hidden="true" />
                    <span className="sr-only">Languages:</span>{" "}
                    {therapist.languages.join(", ")}
                  </div>
                  <div className="flex items-center gap-2">
                    {modes?.includes("Online") ? <Video className="h-4 w-4 shrink-0" aria-hidden="true" /> : <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />}
                    <span className="sr-only">{locationName ? `Available for ${locationName}:` : "Session Type:"}</span>{" "}
                    {modes ? modes.join(", ") : therapist.sessionType.join(", ")}
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
