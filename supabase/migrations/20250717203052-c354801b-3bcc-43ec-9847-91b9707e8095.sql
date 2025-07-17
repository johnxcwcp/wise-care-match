
-- Insert meta description setting if it doesn't exist
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('meta_description', 'Find your perfect therapist with our matching quiz')
ON CONFLICT (setting_key) DO NOTHING;

-- Insert social media link settings
INSERT INTO site_settings (setting_key, setting_value) 
VALUES 
  ('social_facebook', 'https://www.facebook.com/cwcp.ca'),
  ('social_instagram', 'https://www.instagram.com/cwcp.ca'),
  ('social_youtube', 'https://www.youtube.com/@cwcp'),
  ('social_tiktok', 'https://www.tiktok.com/@cwcp.ca')
ON CONFLICT (setting_key) DO NOTHING;

-- Allow INSERT operations on site_settings for these new settings
DROP POLICY IF EXISTS "Authenticated users can update site settings" ON site_settings;
DROP POLICY IF EXISTS "Site settings are publicly readable" ON site_settings;

-- Create new policies that allow INSERT and UPDATE
CREATE POLICY "Site settings are publicly readable" 
ON site_settings FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can manage site settings" 
ON site_settings FOR ALL 
USING (true) 
WITH CHECK (true);
