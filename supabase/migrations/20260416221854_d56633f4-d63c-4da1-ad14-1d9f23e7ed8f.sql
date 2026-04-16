-- 1. Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- 2. Create user_roles table
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- 3. Security definer function to check roles (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- 4. RLS for user_roles: users can read their own roles; admins can manage all
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert roles"
ON public.user_roles FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update roles"
ON public.user_roles FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete roles"
ON public.user_roles FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- 5. Lock down therapist-related tables: public read, admin-only writes
-- therapists
DROP POLICY IF EXISTS "Allow all operations on therapists" ON public.therapists;
CREATE POLICY "Public can view therapists" ON public.therapists FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapists" ON public.therapists FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapists" ON public.therapists FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapists" ON public.therapists FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_availability
DROP POLICY IF EXISTS "Allow all operations on therapist_availability" ON public.therapist_availability;
CREATE POLICY "Public can view therapist_availability" ON public.therapist_availability FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_availability" ON public.therapist_availability FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_availability" ON public.therapist_availability FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_availability" ON public.therapist_availability FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_modalities
DROP POLICY IF EXISTS "Allow all operations on therapist_modalities" ON public.therapist_modalities;
CREATE POLICY "Public can view therapist_modalities" ON public.therapist_modalities FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_modalities" ON public.therapist_modalities FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_modalities" ON public.therapist_modalities FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_modalities" ON public.therapist_modalities FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_specialties
DROP POLICY IF EXISTS "Allow all operations on therapist_specialties" ON public.therapist_specialties;
CREATE POLICY "Public can view therapist_specialties" ON public.therapist_specialties FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_specialties" ON public.therapist_specialties FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_specialties" ON public.therapist_specialties FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_specialties" ON public.therapist_specialties FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_languages
DROP POLICY IF EXISTS "Allow all operations on therapist_languages" ON public.therapist_languages;
CREATE POLICY "Public can view therapist_languages" ON public.therapist_languages FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_languages" ON public.therapist_languages FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_languages" ON public.therapist_languages FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_languages" ON public.therapist_languages FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_session_types
DROP POLICY IF EXISTS "Allow all operations on therapist_session_types" ON public.therapist_session_types;
CREATE POLICY "Public can view therapist_session_types" ON public.therapist_session_types FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_session_types" ON public.therapist_session_types FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_session_types" ON public.therapist_session_types FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_session_types" ON public.therapist_session_types FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_client_types
DROP POLICY IF EXISTS "Allow all operations on therapist_client_types" ON public.therapist_client_types;
CREATE POLICY "Public can view therapist_client_types" ON public.therapist_client_types FOR SELECT USING (true);
CREATE POLICY "Admins can insert therapist_client_types" ON public.therapist_client_types FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_client_types" ON public.therapist_client_types FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_client_types" ON public.therapist_client_types FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- therapist_services (already has SELECT policy)
CREATE POLICY "Admins can insert therapist_services" ON public.therapist_services FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update therapist_services" ON public.therapist_services FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete therapist_services" ON public.therapist_services FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 6. Lock down quiz tables to admin-only writes
DROP POLICY IF EXISTS "Allow all operations on quiz_questions" ON public.quiz_questions;
CREATE POLICY "Public can view quiz_questions" ON public.quiz_questions FOR SELECT USING (true);
CREATE POLICY "Admins can insert quiz_questions" ON public.quiz_questions FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update quiz_questions" ON public.quiz_questions FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete quiz_questions" ON public.quiz_questions FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow all operations on quiz_question_options" ON public.quiz_question_options;
CREATE POLICY "Public can view quiz_question_options" ON public.quiz_question_options FOR SELECT USING (true);
CREATE POLICY "Admins can insert quiz_question_options" ON public.quiz_question_options FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update quiz_question_options" ON public.quiz_question_options FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete quiz_question_options" ON public.quiz_question_options FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- 7. Tighten site_settings and service_cards write policies to admins
DROP POLICY IF EXISTS "Authenticated users can manage site settings" ON public.site_settings;
CREATE POLICY "Admins can insert site_settings" ON public.site_settings FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update site_settings" ON public.site_settings FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete site_settings" ON public.site_settings FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Allow authenticated users to insert service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Allow authenticated users to update service cards" ON public.service_cards;
DROP POLICY IF EXISTS "Allow authenticated users to delete service cards" ON public.service_cards;
CREATE POLICY "Admins can insert service_cards" ON public.service_cards FOR INSERT TO authenticated WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update service_cards" ON public.service_cards FOR UPDATE TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete service_cards" ON public.service_cards FOR DELETE TO authenticated USING (public.has_role(auth.uid(), 'admin'));