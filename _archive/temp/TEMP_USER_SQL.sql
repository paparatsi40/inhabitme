-- Usuario temporal para testing
-- Ejecuta esto en Supabase SQL Editor

INSERT INTO "User" (
  "id",
  "clerkId", 
  "email",
  "firstName",
  "lastName",
  "role",
  "createdAt",
  "updatedAt"
) VALUES (
  'temp-user-123',
  'temp-clerk-id',
  'test@inhabitme.com',
  'Test',
  'User',
  'HOST',
  NOW(),
  NOW()
) ON CONFLICT (id) DO NOTHING;