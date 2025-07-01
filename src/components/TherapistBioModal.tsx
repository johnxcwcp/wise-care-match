
import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import { Therapist } from "@/types";

interface TherapistBioModalProps {
  therapist: Therapist;
  isOpen: boolean;
  onClose: () => void;
}

const TherapistBioModal: React.FC<TherapistBioModalProps> = ({ therapist, isOpen, onClose }) => {
  const initials = therapist.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  // Extract YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = therapist.introVideoUrl ? getYouTubeVideoId(therapist.introVideoUrl) : null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-white rounded-2xl border-0 shadow-2xl">
        <DialogHeader className="relative">
          <DialogClose className="absolute right-0 top-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </DialogClose>
          <DialogTitle className="text-2xl font-medium text-cwcp-blue">
            {therapist.name}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0">
              <Avatar className="w-32 h-32">
                <AvatarImage 
                  src={therapist.photo} 
                  alt={therapist.name} 
                  className="object-cover" 
                />
                <AvatarFallback className="bg-cwcp-blue text-white text-2xl font-medium">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </div>
            
            <div className="flex-1">
              <div className="text-lg text-cwcp-darkgray mb-2">
                {therapist.pronouns} • {therapist.designation}
              </div>
              
              <div className="space-y-3 mb-4">
                <div>
                  <h4 className="font-medium text-cwcp-blue mb-1">Specialties</h4>
                  <div className="flex flex-wrap gap-1">
                    {therapist.specialties.map(specialty => (
                      <Badge key={specialty} className="bg-cwcp-lightgray text-cwcp-text hover:bg-cwcp-gray">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-cwcp-blue mb-1">Modalities</h4>
                  <div className="flex flex-wrap gap-1">
                    {therapist.modalities.map(modality => (
                      <Badge key={modality} className="bg-cwcp-lightgray text-cwcp-text hover:bg-cwcp-gray">
                        {modality}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              
              <Button 
                asChild 
                className="bg-cwcp-blue hover:bg-cwcp-lightblue text-white"
              >
                <a href={therapist.bookingLink} target="_blank" rel="noopener noreferrer">
                  Book Appointment
                </a>
              </Button>
            </div>
          </div>
          
          {/* Extended Bio Section */}
          <div>
            <h3 className="text-xl font-medium text-cwcp-blue mb-4">About {therapist.name.split(' ')[0]}</h3>
            <div className="prose max-w-none text-cwcp-text">
              {therapist.extendedBio ? (
                <div className="whitespace-pre-wrap">{therapist.extendedBio}</div>
              ) : (
                <p>{therapist.bio}</p>
              )}
            </div>
          </div>
          
          {/* YouTube Video Section */}
          {videoId && (
            <div>
              <h3 className="text-xl font-medium text-cwcp-blue mb-4">Introduction Video</h3>
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="Therapist Introduction Video"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-lg"
                ></iframe>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TherapistBioModal;
