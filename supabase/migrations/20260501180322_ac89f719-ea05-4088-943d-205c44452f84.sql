INSERT INTO public.user_roles (user_id, role)
VALUES ('5e27e3da-b493-46bf-bed4-5fe5a5dace8a', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;