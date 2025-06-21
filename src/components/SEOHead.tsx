
import React, { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const SEOHead: React.FC = () => {
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

  useEffect(() => {
    if (siteSettings) {
      const seoTitle = siteSettings.find(setting => setting.setting_key === 'seo_title')?.setting_value;
      const seoDescription = siteSettings.find(setting => setting.setting_key === 'seo_description')?.setting_value;
      const seoImageUrl = siteSettings.find(setting => setting.setting_key === 'seo_image_url')?.setting_value;

      // Update document title
      if (seoTitle) {
        document.title = seoTitle;
      }

      // Update or create meta description
      let metaDescription = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescription) {
        metaDescription = document.createElement('meta');
        metaDescription.setAttribute('name', 'description');
        document.head.appendChild(metaDescription);
      }
      metaDescription.setAttribute('content', seoDescription || 'Find your perfect therapist with our matching quiz');

      // Update Open Graph meta tags
      const updateOrCreateMeta = (property: string, content: string, attribute: string = 'property') => {
        let meta = document.querySelector(`meta[${attribute}="${property}"]`) as HTMLMetaElement;
        if (!meta) {
          meta = document.createElement('meta');
          meta.setAttribute(attribute, property);
          document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
      };

      if (seoTitle) {
        updateOrCreateMeta('og:title', seoTitle);
        updateOrCreateMeta('twitter:title', seoTitle, 'name');
      }

      if (seoDescription) {
        updateOrCreateMeta('og:description', seoDescription);
        updateOrCreateMeta('twitter:description', seoDescription, 'name');
      }

      if (seoImageUrl) {
        updateOrCreateMeta('og:image', seoImageUrl);
        updateOrCreateMeta('twitter:image', seoImageUrl, 'name');
      }

      // Set additional Open Graph properties
      updateOrCreateMeta('og:type', 'website');
      updateOrCreateMeta('og:url', window.location.href);
      updateOrCreateMeta('twitter:card', 'summary_large_image', 'name');
    }
  }, [siteSettings]);

  return null;
};

export default SEOHead;
