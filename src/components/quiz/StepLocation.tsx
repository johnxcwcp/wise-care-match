import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion } from "@/types";
import { LOCATION_OPTIONS } from "@/lib/clinicLocations";
import { Building2, MapPin, Video } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface Props {
  selectedLocation: string;
  setSelectedLocation: (value: string) => void;
  question: QuizQuestion;
}

const StepLocation: React.FC<Props> = ({ selectedLocation, setSelectedLocation, question }) => {
  const { data: settings } = useQuery({
    queryKey: ["siteSettings"],
    queryFn: async () => {
      const { data, error } = await supabase.from("site_settings").select("*");
      if (error) throw error;
      return data;
    },
  });
  return (
  <div className="animate-fade-in">
    <h2 className="text-2xl font-normal text-foreground mb-3">{question.title}</h2>
    {question.description && <p className="mb-6 text-muted-foreground leading-relaxed">{question.description}</p>}
    <RadioGroup value={selectedLocation} onValueChange={setSelectedLocation} className="grid grid-cols-2 gap-3 sm:gap-4" aria-label={question.title}>
      {LOCATION_OPTIONS.map((loc) => {
        const logo = settings?.find(s => s.setting_key === `clinic_logo_${loc.value.toLowerCase()}`)?.setting_value;
        const Glyph = loc.value === "Online" ? Video : loc.value === "Toronto" ? Building2 : MapPin;
        return (
        <Label
          key={loc.value}
          htmlFor={`location-${loc.value}`}
          className={`option-card relative cursor-pointer flex flex-col gap-3 min-h-44 sm:min-h-48 h-full !p-4 sm:!p-5 ${selectedLocation === loc.value ? "selected" : ""}`}
        >
          <span className="flex items-start justify-between gap-3">
            <span className="flex h-12 sm:h-16 min-w-0 flex-1 items-center">
              {logo ? <img src={logo} alt={`${loc.clinic} logo`} className="max-h-full max-w-full object-contain" onError={e => { e.currentTarget.style.display = "none"; }} /> : <Glyph className="h-8 w-8 text-foreground" strokeWidth={1.25} aria-hidden="true" />}
            </span>
            <RadioGroupItem id={`location-${loc.value}`} value={loc.value} className="mt-1 h-5 w-5" />
          </span>
          <span className="font-normal text-base text-foreground">{loc.label}</span>
          <span className="text-sm text-muted-foreground font-normal leading-snug">{loc.description}</span>
        </Label>
      ); })}
    </RadioGroup>
  </div>
  );
};

export default StepLocation;
