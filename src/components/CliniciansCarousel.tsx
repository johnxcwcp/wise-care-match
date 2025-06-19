
import React, { useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Therapist } from "@/types";
import TherapistBioModal from "./TherapistBioModal";

interface CliniciansCarouselProps {
  therapists: Therapist[];
}

const CliniciansCarousel: React.FC<CliniciansCarouselProps> = ({ therapists }) => {
  const [selectedTherapist, setSelectedTherapist] = useState<Therapist | null>(null);
  const [isBioModalOpen, setIsBioModalOpen] = useState(false);

  if (therapists.length === 0) {
    return null;
  }

  const handleReadBio = (therapist: Therapist) => {
    setSelectedTherapist(therapist);
    setIsBioModalOpen(true);
  };

  return (
    <>
      <div className="w-full max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-3xl font-medium text-cwcp-blue mb-8 text-center">
          Meet our clinicians
        </h2>
        
        <Carousel
          opts={{
            align: "start",
            loop: true,
          }}
          className="w-full"
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {therapists.map((therapist) => {
              const initials = therapist.name
                .split(" ")
                .map((n) => n[0])
                .join("");

              return (
                <CarouselItem key={therapist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <div className="bg-white rounded-xl shadow-md overflow-hidden border border-cwcp-gray hover:shadow-lg transition-shadow duration-300">
                    <div className="p-6">
                      <div className="flex flex-col items-center text-center">
                        <Avatar className="w-20 h-20 mb-4">
                          <AvatarImage 
                            src={therapist.photo} 
                            alt={therapist.name} 
                            className="object-cover" 
                          />
                          <AvatarFallback className="bg-cwcp-blue text-white text-lg font-medium">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        
                        <h3 className="text-lg font-medium text-cwcp-blue mb-1">
                          {therapist.name}
                        </h3>
                        
                        <div className="text-sm text-cwcp-darkgray mb-1">
                          {therapist.pronouns} • {therapist.designation}
                        </div>
                        
                        {/* Custom Message */}
                        {therapist.customMessage && (
                          <div className="mb-3 p-2 bg-blue-50 border border-blue-200 rounded text-xs text-blue-800">
                            {therapist.customMessage}
                          </div>
                        )}
                        
                        <p className="text-sm text-cwcp-text mb-4 line-clamp-3">
                          {therapist.bio}
                        </p>
                        
                        <div className="flex flex-wrap gap-1 justify-center mb-4">
                          {therapist.specialties.slice(0, 3).map(specialty => (
                            <Badge 
                              key={specialty} 
                              className="bg-cwcp-lightgray text-cwcp-text text-xs hover:bg-cwcp-gray"
                            >
                              {specialty}
                            </Badge>
                          ))}
                          {therapist.specialties.length > 3 && (
                            <Badge className="bg-cwcp-blue text-white text-xs">
                              +{therapist.specialties.length - 3}
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-2 w-full">
                          <Button 
                            asChild 
                            size="sm"
                            className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
                          >
                            <a href={therapist.bookingLink} target="_blank" rel="noopener noreferrer">
                              Book Appointment
                            </a>
                          </Button>
                          <Button 
                            variant="outline"
                            size="sm"
                            onClick={() => handleReadBio(therapist)}
                            className="border-cwcp-blue text-cwcp-blue hover:bg-blue-50"
                          >
                            Read Bio
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              );
            })}
          </CarouselContent>
          <CarouselPrevious className="hidden md:flex" />
          <CarouselNext className="hidden md:flex" />
        </Carousel>
      </div>
      
      {selectedTherapist && (
        <TherapistBioModal
          therapist={selectedTherapist}
          isOpen={isBioModalOpen}
          onClose={() => setIsBioModalOpen(false)}
        />
      )}
    </>
  );
};

export default CliniciansCarousel;
