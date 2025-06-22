
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Therapist } from "@/types";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import TherapistBioModal from "./TherapistBioModal";

interface TherapistCardProps {
  therapist: Therapist;
}

const TherapistCard: React.FC<TherapistCardProps> = ({ therapist }) => {
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);
  
  const initials = therapist.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  const displayedSpecialties = showAllSpecialties 
    ? therapist.specialties 
    : therapist.specialties.slice(0, 3);

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden border border-cwcp-gray">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-24 h-24 rounded-full">
                <AvatarImage 
                  src={therapist.photo} 
                  alt={therapist.name} 
                  className="object-cover" 
                />
                <AvatarFallback className="bg-cwcp-blue text-white text-xl font-medium">
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
                    className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
                  >
                    <a href={therapist.bookingLink} target="_blank" rel="noopener noreferrer">
                      Book Appointment
                    </a>
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => setIsBioModalOpen(true)}
                    className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50"
                  >
                    Read Bio
                  </Button>
                </div>
              </div>
              
              {/* Custom Message */}
              {therapist.customMessage && (
                <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">{therapist.customMessage}</p>
                </div>
              )}
              
              <p className="mb-4 text-cwcp-text">{therapist.bio}</p>
              
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium text-cwcp-blue mb-1">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {displayedSpecialties.map(specialty => (
                      <Badge key={specialty} className="bg-cwcp-lightgray text-cwcp-text hover:bg-cwcp-gray font-normal">
                        {specialty}
                      </Badge>
                    ))}
                    {therapist.specialties.length > 3 && !showAllSpecialties && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllSpecialties(true)}
                        className="text-cwcp-blue hover:text-cwcp-lightblue px-2 py-1 h-auto text-xs"
                      >
                        Expand (+{therapist.specialties.length - 3} more)
                      </Button>
                    )}
                    {showAllSpecialties && therapist.specialties.length > 3 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAllSpecialties(false)}
                        className="text-cwcp-blue hover:text-cwcp-lightblue px-2 py-1 h-auto text-xs"
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
