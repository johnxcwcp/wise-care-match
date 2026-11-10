DROP POLICY IF EXISTS "Allow authenticated users to delete assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to update assets" ON storage.objects;
DROP POLICY IF EXISTS "Allow authenticated users to upload assets" ON storage.objects;
CREATE POLICY "Admins can upload assets" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can update assets" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));
CREATE POLICY "Admins can delete assets" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'assets' AND public.has_role(auth.uid(), 'admin'::public.app_role));

DROP POLICY IF EXISTS "Site settings are publicly readable" ON public.site_settings;
CREATE POLICY "Public can read non-private site settings" ON public.site_settings FOR SELECT
  USING (setting_key NOT LIKE 'private\_%');
CREATE POLICY "Admins can read all site settings" ON public.site_settings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));