
import React from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Facebook, Instagram, Youtube } from "lucide-react";

// TikTok icon component since it's not in Lucide
const TikTokIcon = ({ size = 20 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.954-1.234-2.128-1.05-3.226-.054-.12-.054-.258 0-.378C16.691.516 16.691.516 16.691.516h-3.168s0 11.952 0 12.814c0 1.897-1.557 3.434-3.473 3.434s-3.473-1.537-3.473-3.434c0-1.897 1.557-3.434 3.473-3.434.360 0 .706.055 1.026.157V6.853c-2.144-.121-4.342.859-5.72 2.482C3.753 11.294 3.301 13.562 4.079 15.540c.777 1.977 2.38 3.442 4.441 4.06 2.061.618 4.292.258 6.182-.999 1.890-1.257 3.078-3.35 3.287-5.785.054-.517.054-1.034 0-1.551V8.12c1.137.517 2.38.773 3.659.773v-3.226c-.849 0-1.557-.378-2.327-.862v-.243Z"/>
  </svg>
);

const SocialMediaLinks: React.FC = () => {
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

  if (!siteSettings) return null;

  const facebookUrl = siteSettings.find(setting => setting.setting_key === 'social_facebook')?.setting_value;
  const instagramUrl = siteSettings.find(setting => setting.setting_key === 'social_instagram')?.setting_value;
  const youtubeUrl = siteSettings.find(setting => setting.setting_key === 'social_youtube')?.setting_value;
  const tiktokUrl = siteSettings.find(setting => setting.setting_key === 'social_tiktok')?.setting_value;

  return (
    <div className="flex items-center gap-3">
      {facebookUrl && (
        <a 
          href={facebookUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
          aria-label="Facebook"
        >
          <Facebook size={20} />
        </a>
      )}
      {instagramUrl && (
        <a 
          href={instagramUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
          aria-label="Instagram"
        >
          <Instagram size={20} />
        </a>
      )}
      {youtubeUrl && (
        <a 
          href={youtubeUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
          aria-label="YouTube"
        >
          <Youtube size={20} />
        </a>
      )}
      {tiktokUrl && (
        <a 
          href={tiktokUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-cwcp-blue hover:text-cwcp-lightblue transition-colors"
          aria-label="TikTok"
        >
          <TikTokIcon size={20} />
        </a>
      )}
    </div>
  );
};

export default SocialMediaLinks;
