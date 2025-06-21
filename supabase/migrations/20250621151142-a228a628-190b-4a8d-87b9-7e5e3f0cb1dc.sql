
-- Create a table to store therapist services (similar to other therapist attributes)
CREATE TABLE public.therapist_services (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  therapist_id uuid REFERENCES public.therapists(id) ON DELETE CASCADE,
  service text NOT NULL
);

-- Enable RLS on the new table
ALTER TABLE public.therapist_services ENABLE ROW LEVEL SECURITY;

-- Since this is admin-managed data that needs to be publicly readable for the quiz
CREATE POLICY "Anyone can view therapist services" 
  ON public.therapist_services 
  FOR SELECT 
  TO public 
  USING (true);

-- Add some initial data to match existing service options
INSERT INTO public.therapist_services (therapist_id, service)
SELECT t.id, 'Individual Counselling and Psychotherapy'
FROM public.therapists t;

INSERT INTO public.therapist_services (therapist_id, service)
SELECT t.id, 'Relationship and Couples Counselling and Psychotherapy'
FROM public.therapists t;
