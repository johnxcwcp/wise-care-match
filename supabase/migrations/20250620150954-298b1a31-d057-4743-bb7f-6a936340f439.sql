
-- Create a table for service cards
CREATE TABLE public.service_cards (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  service_value TEXT NOT NULL UNIQUE,
  service_title TEXT NOT NULL,
  service_description TEXT NOT NULL,
  illustration_url TEXT,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert the two remaining services
INSERT INTO public.service_cards (service_value, service_title, service_description, display_order) VALUES
('Individual Counselling and Psychotherapy', 'Individual Counselling and Psychotherapy', 'One-on-one therapeutic sessions tailored to your personal needs and goals.', 1),
('Relationship and Couples Counselling and Psychotherapy', 'Relationship and Couples Counselling', 'Professional guidance to strengthen relationships and improve communication between partners.', 2);

-- Enable RLS (Row Level Security)
ALTER TABLE public.service_cards ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access for service cards
CREATE POLICY "Allow public read access to service cards" 
  ON public.service_cards 
  FOR SELECT 
  TO public
  USING (true);

-- Create policy to allow authenticated users to update service cards (for admin)
CREATE POLICY "Allow authenticated users to update service cards" 
  ON public.service_cards 
  FOR UPDATE 
  TO authenticated
  USING (true);

-- Create policy to allow authenticated users to insert service cards (for admin)
CREATE POLICY "Allow authenticated users to insert service cards" 
  ON public.service_cards 
  FOR INSERT 
  TO authenticated
  WITH CHECK (true);

-- Create policy to allow authenticated users to delete service cards (for admin)
CREATE POLICY "Allow authenticated users to delete service cards" 
  ON public.service_cards 
  FOR DELETE 
  TO authenticated
  USING (true);
