
import React from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { Therapist } from "@/types";

interface TherapistCardProps {
  therapist: Therapist;
  onEdit: (therapist: Therapist) => void;
  onDelete: (id: string) => void;
}

const TherapistCard: React.FC<TherapistCardProps> = ({
  therapist,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-cwcp-gray flex items-start gap-4">
      <Avatar className="w-16 h-16">
        <AvatarImage src={therapist.photo} alt={therapist.name} />
        <AvatarFallback>
          {therapist.name.split(" ").map(n => n[0]).join("")}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <div className="flex justify-between">
          <h3 className="text-xl font-medium text-cwcp-blue">{therapist.name}</h3>
          <div className="space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onEdit(therapist)}
            >
              <Edit className="w-4 h-4 mr-1" /> Edit
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onDelete(therapist.id)}
            >
              <Trash2 className="w-4 h-4 mr-1" /> Delete
            </Button>
          </div>
        </div>
        <div className="text-sm text-cwcp-darkgray">
          {therapist.pronouns} · {therapist.designation} · {therapist.gender}
        </div>
        <p className="text-sm my-2 line-clamp-2">{therapist.bio}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {therapist.specialties.slice(0, 3).map(specialty => (
            <Badge key={specialty} variant="outline">{specialty}</Badge>
          ))}
          {therapist.specialties.length > 3 && (
            <Badge variant="outline">+{therapist.specialties.length - 3} more</Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default TherapistCard;
