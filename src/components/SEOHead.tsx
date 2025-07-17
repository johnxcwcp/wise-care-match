
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
      const metaDescription = siteSettings.find(setting => setting.setting_key === 'meta_description')?.setting_value;
      const seoImageUrl = siteSettings.find(setting => setting.setting_key === 'seo_image_url')?.setting_value;

      // Update document title - use seo_title if available, otherwise use default
      const pageTitle = seoTitle || 'CWCP Therapist Matching Quiz';
      document.title = pageTitle;

      // Update or create meta description - use meta_description if available, otherwise fallback
      let metaDescriptionElement = document.querySelector('meta[name="description"]') as HTMLMetaElement;
      if (!metaDescriptionElement) {
        metaDescriptionElement = document.createElement('meta');
        metaDescriptionElement.setAttribute('name', 'description');
        document.head.appendChild(metaDescriptionElement);
      }
      const descriptionContent = metaDescription || seoDescription || 'Find your perfect therapist with our matching quiz';
      metaDescriptionElement.setAttribute('content', descriptionContent);

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

      if (pageTitle) {
        updateOrCreateMeta('og:title', pageTitle);
        updateOrCreateMeta('twitter:title', pageTitle, 'name');
      }

      if (descriptionContent) {
        updateOrCreateMeta('og:description', descriptionContent);
        updateOrCreateMeta('twitter:description', descriptionContent, 'name');
      }

      if (seoImageUrl) {
        updateOrCreateMeta('og:image', seoImageUrl);
        updateOrCreateMeta('twitter:image', seoImageUrl, 'name');
      }

      // Set additional Open Graph properties
      updateOrCreateMeta('og:type', 'website');
      updateOrCreateMeta('og:url', window.location.href);
      updateOrCreateMeta('twitter:card', 'summary_large_image', 'name');
    } else {
      // Set default title if no settings are loaded yet
      document.title = 'CWCP Therapist Matching Quiz';
    }
  }, [siteSettings]);

  return null;
};

export default SEOHead;
