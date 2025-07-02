
-- The other_matches_message setting already exists, but let's ensure it's properly set up
-- Update the existing setting or insert if it doesn't exist
INSERT INTO site_settings (setting_key, setting_value) 
VALUES ('other_matches_message', 'The clinicians below may still be a good fit for you but don''t necessarily align with all of your input for "Gender", "Modalities", and "Virtual or in-person" preferences.')
ON CONFLICT (setting_key) DO UPDATE SET 
  updated_at = now();
