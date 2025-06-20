
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

      // Update meta description
      if (seoDescription) {
        let metaDescription = document.querySelector('meta[name="description"]');
        if (!metaDescription) {
          metaDescription = document.createElement('meta');
          metaDescription.setAttribute('name', 'description');
          document.head.appendChild(metaDescription);
        }
        metaDescription.setAttribute('content', seoDescription);
      }

      // Update Open Graph meta tags
      if (seoTitle) {
        let ogTitle = document.querySelector('meta[property="og:title"]');
        if (!ogTitle) {
          ogTitle = document.createElement('meta');
          ogTitle.setAttribute('property', 'og:title');
          document.head.appendChild(ogTitle);
        }
        ogTitle.setAttribute('content', seoTitle);
      }

      if (seoDescription) {
        let ogDescription = document.querySelector('meta[property="og:description"]');
        if (!ogDescription) {
          ogDescription = document.createElement('meta');
          ogDescription.setAttribute('property', 'og:description');
          document.head.appendChild(ogDescription);
        }
        ogDescription.setAttribute('content', seoDescription);
      }

      if (seoImageUrl) {
        let ogImage = document.querySelector('meta[property="og:image"]');
        if (!ogImage) {
          ogImage = document.createElement('meta');
          ogImage.setAttribute('property', 'og:image');
          document.head.appendChild(ogImage);
        }
        ogImage.setAttribute('content', seoImageUrl);
      }

      // Update Twitter meta tags
      if (seoImageUrl) {
        let twitterImage = document.querySelector('meta[name="twitter:image"]');
        if (!twitterImage) {
          twitterImage = document.createElement('meta');
          twitterImage.setAttribute('name', 'twitter:image');
          document.head.appendChild(twitterImage);
        }
        twitterImage.setAttribute('content', seoImageUrl);
      }
    }
  }, [siteSettings]);

  return null;
};

export default SEOHead;
