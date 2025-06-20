
import React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Therapist } from "@/types";

interface CliniciansVideoCarouselProps {
  therapists: Therapist[];
}

const CliniciansVideoCarousel: React.FC<CliniciansVideoCarouselProps> = ({ therapists }) => {
  // Filter therapists that have intro videos
  const therapistsWithVideos = therapists.filter(therapist => therapist.introVideoUrl);

  if (therapistsWithVideos.length === 0) {
    return null;
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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
          {therapistsWithVideos.map((therapist) => {
            const videoId = getYouTubeVideoId(therapist.introVideoUrl);
            
            return (
              <CarouselItem key={therapist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                <div className="bg-white rounded-xl shadow-md overflow-hidden border border-cwcp-gray hover:shadow-lg transition-shadow duration-300">
                  <div className="p-6">
                    <div className="flex flex-col">
                      {/* Video embed */}
                      <div className="w-full aspect-video rounded-lg overflow-hidden mb-4">
                        {videoId ? (
                          <iframe
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title={`${therapist.name} Introduction Video`}
                            className="w-full h-full"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        ) : (
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                            <p className="text-gray-500 text-sm">Video not available</p>
                          </div>
                        )}
                      </div>
                      
                      <div className="text-center">
                        <h3 className="text-lg font-medium text-cwcp-blue mb-1">
                          {therapist.name}
                        </h3>
                        <div className="text-sm text-cwcp-darkgray mb-3">
                          {therapist.pronouns} • {therapist.designation}
                        </div>
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

export default CliniciansVideoCarousel;
