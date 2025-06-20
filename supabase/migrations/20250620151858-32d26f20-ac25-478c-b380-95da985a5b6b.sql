
-- Add SEO settings to the site_settings table
INSERT INTO public.site_settings (setting_key, setting_value) VALUES
('seo_title', 'CWCP Therapist Matching Quiz - Find Your Perfect Therapist'),
('seo_description', 'Take our quick quiz to find the perfect therapist for your needs. Match with qualified mental health professionals based on your preferences and requirements.'),
('seo_image_url', '')
ON CONFLICT (setting_key) DO NOTHING;
