ALTER TABLE public.therapists
  ADD COLUMN IF NOT EXISTS home_clinic text,
  ADD COLUMN IF NOT EXISTS in_person_locations text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS online_locations text[] NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS location_verified boolean NOT NULL DEFAULT false;

-- Legacy records were all configured for the Toronto (CWCP) quiz. Carry their existing
-- confirmed session types over to Toronto only, and flag them as unverified.
UPDATE public.therapists t SET
  in_person_locations = CASE WHEN EXISTS (SELECT 1 FROM public.therapist_session_types s WHERE s.therapist_id = t.id AND s.session_type = 'In-person') THEN ARRAY['Toronto'] ELSE '{}' END,
  online_locations = CASE WHEN EXISTS (SELECT 1 FROM public.therapist_session_types s WHERE s.therapist_id = t.id AND s.session_type = 'Virtually') THEN ARRAY['Toronto'] ELSE '{}' END,
  location_verified = false;