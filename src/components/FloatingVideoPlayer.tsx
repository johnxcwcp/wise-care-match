
import React from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingVideoPlayerProps {
  videoId: string;
  therapistName: string;
  onClose: () => void;
}

const FloatingVideoPlayer: React.FC<FloatingVideoPlayerProps> = ({
  videoId,
  therapistName,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium text-cwcp-blue">
            {therapistName} - Introduction Video
          </h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="sm"
            className="h-8 w-8 p-0"
          >
            <X size={16} />
          </Button>
        </div>
        <div className="aspect-video">
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
            title={`${therapistName} Introduction Video`}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    </div>
  );
};

export default FloatingVideoPlayer;
