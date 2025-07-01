
-- Add site setting to control how many specialties to show by default in therapist cards
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('specialties_display_count', '3')
ON CONFLICT (setting_key) DO UPDATE SET 
  setting_value = EXCLUDED.setting_value,
  updated_at = now();
