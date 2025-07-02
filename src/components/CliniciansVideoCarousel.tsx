import React, { useState } from "react";
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import { Therapist } from "@/types";
import FloatingVideoPlayer from "./FloatingVideoPlayer";
interface CliniciansVideoCarouselProps {
  therapists: Therapist[];
}
const CliniciansVideoCarousel: React.FC<CliniciansVideoCarouselProps> = ({
  therapists
}) => {
  const [playingVideo, setPlayingVideo] = useState<{
    videoId: string;
    therapistName: string;
  } | null>(null);

  // Filter therapists that have intro videos
  const therapistsWithVideos = therapists.filter(therapist => therapist.introVideoUrl);
  if (therapistsWithVideos.length === 0) {
    return null;
  }

  // Function to extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };
  const handlePlayVideo = (url: string, name: string) => {
    const videoId = getYouTubeVideoId(url);
    if (videoId) {
      setPlayingVideo({
        videoId,
        therapistName: name
      });
    }
  };
  return <>
      <div className="w-full max-w-7xl mx-auto py-12 px-0">
        <h2 className="text-3xl font-medium text-cwcp-blue mb-8 text-center">Meet Our Clinicians</h2>
        
        {/* Increased padding significantly to prevent shadow clipping */}
        <div className="gap-x-12 space-x-16 px-0">
          <Carousel opts={{
          align: "start",
          loop: true
        }} className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {therapistsWithVideos.map(therapist => {
              const videoId = getYouTubeVideoId(therapist.introVideoUrl);
              return <CarouselItem key={therapist.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                    <div className="bg-white rounded-3xl shadow-sophisticated overflow-hidden border border-cwcp-gray/20 hover:shadow-floating transition-all duration-300 glass-light backdrop-blur-xl">
                      <div className="p-6 bg-zinc-50 px-[20px] rounded-none mx-0">
                        <div className="flex flex-col">
                          {/* Video thumbnail with play button */}
                          <div className="w-full aspect-video rounded-2xl overflow-hidden mb-4 relative group">
                            {videoId ? <>
                                <img src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`} alt={`${therapist.name} video thumbnail`} className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Button onClick={() => handlePlayVideo(therapist.introVideoUrl, therapist.name)} className="bg-white bg-opacity-90 hover:bg-opacity-100 text-cwcp-blue rounded-full p-4 shadow-sophisticated">
                                    <Play size={24} />
                                  </Button>
                                </div>
                              </> : <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <p className="text-gray-500 text-sm">Video not available</p>
                              </div>}
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
                  </CarouselItem>;
            })}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
        </div>
      </div>

      {/* Floating Video Player */}
      {playingVideo && <FloatingVideoPlayer videoId={playingVideo.videoId} therapistName={playingVideo.therapistName} onClose={() => setPlayingVideo(null)} />}
    </>;
};
export default CliniciansVideoCarousel;