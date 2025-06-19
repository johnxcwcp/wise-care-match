
-- Add custom message field to therapists table
ALTER TABLE public.therapists ADD COLUMN custom_message TEXT;

-- Add extended bio field for the floating window
ALTER TABLE public.therapists ADD COLUMN extended_bio TEXT;

-- Add YouTube video link field
ALTER TABLE public.therapists ADD COLUMN intro_video_url TEXT;

-- Create a table for site settings (Terms of Use, Privacy Policy)
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default values for Terms of Use and Privacy Policy
INSERT INTO public.site_settings (setting_key, setting_value) VALUES 
('terms_of_use', 'Terms of Use content goes here...'),
('privacy_policy', 'Privacy Policy content goes here...');

-- Enable RLS on site_settings (publicly readable)
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access to site settings
CREATE POLICY "Site settings are publicly readable" 
  ON public.site_settings 
  FOR SELECT 
  USING (true);

-- Create policy for authenticated users to update site settings (admin only)
CREATE POLICY "Authenticated users can update site settings" 
  ON public.site_settings 
  FOR UPDATE 
  USING (true);
