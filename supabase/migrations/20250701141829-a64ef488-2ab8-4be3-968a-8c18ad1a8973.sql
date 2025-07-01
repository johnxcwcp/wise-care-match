
-- Insert the main heading text as a configurable site setting
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('main_heading', 'Explore Therapist Options With Ease')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();
