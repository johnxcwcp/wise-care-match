UPDATE public.therapists
SET home_clinic = 'Toronto',
    in_person_locations = ARRAY['Toronto']::text[],
    online_locations = ARRAY['Toronto']::text[],
    location_verified = true,
    updated_at = now()
WHERE id IN (
'fb9be22e-5b2e-4f97-a257-825311cbc5dc', 'e40ed0e3-a58e-47c7-b85a-5f856152015a',
'5e095e23-c560-4602-b7f3-e6e8014f4b5c', '331971a4-3819-4fa5-b9a7-bbef1d6fa76e',
'af467da9-921e-4286-8a5a-e79c34c805b4', '74a1a8e1-801e-49eb-9f4a-3fa001d7bb82',
'1e17ab53-97e7-46bf-ba98-dacb67b4b196', '9dde1494-67df-4546-9ac8-9e9f7675e6d1',
'e1691fc3-ae84-466e-9c14-f7f16727ecba', '1ed8cf04-45b5-49e1-8b7c-874f67170a6d',
'4c6ecf7e-cd2e-4dc3-b1e3-5a8908f58fbc', '69b26d01-7288-4db2-9fb7-414d672c5484',
'c90ad906-e1fd-4c2b-af08-ec16f2866aab');

UPDATE public.therapists
SET home_clinic = 'Picton',
    in_person_locations = ARRAY['Picton']::text[],
    online_locations = ARRAY['Toronto', 'Yukon']::text[],
    location_verified = true,
    updated_at = now()
WHERE id IN ('7366594a-ce1b-4b4c-a95c-7a03667d9b06', '56b48bd8-f210-4131-a07a-93d3c90d2cfa', '3499c97c-b2fd-4e15-ac76-d3bdb39d0370');

UPDATE public.therapists
SET in_person_locations = ARRAY[]::text[],
    online_locations = ARRAY['Toronto', 'Picton']::text[],
    location_verified = true,
    updated_at = now()
WHERE id = '4f25f4b0-8e8c-4037-a5cb-301be2422a7e';