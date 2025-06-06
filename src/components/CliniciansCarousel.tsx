
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Therapist } from "@/types";

interface CliniciansCarouselProps {
  therapists: Therapist[];
}

const CliniciansCarousel: React.FC<CliniciansCarouselProps> = ({ therapists }) => {
  if (therapists.length === 0) {
    return null;
  }

  return (
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
  );
};

export default CliniciansCarousel;
