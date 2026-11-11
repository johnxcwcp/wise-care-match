UPDATE public.therapists
SET
  in_person_locations = '{}'::text[],
  online_locations = ARRAY['Toronto', 'Picton', 'Yukon']::text[],
  location_verified = TRUE
WHERE id = '4f25f4b0-8e8c-4037-a5cb-301be2422a7e'
  AND name = 'Adam Terpstra';