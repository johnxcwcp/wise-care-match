INSERT INTO public.therapist_session_types (therapist_id, session_type)
SELECT t.id, 'Virtually' FROM public.therapists t
WHERE t.location_verified = true AND cardinality(t.online_locations) > 0
AND NOT EXISTS (SELECT 1 FROM public.therapist_session_types st WHERE st.therapist_id = t.id AND st.session_type = 'Virtually');