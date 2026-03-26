-- Enforce case-insensitive unique email in legacy public."User" table
-- to prevent duplicate identities that later break owner/listing matching.

-- Normalize existing emails to lowercase first
UPDATE public."User"
SET "email" = lower("email")
WHERE "email" IS NOT NULL;

-- Remove duplicates keeping the most recently updated row per email
DELETE FROM public."User" u
USING public."User" d
WHERE lower(u."email") = lower(d."email")
  AND u."id" <> d."id"
  AND COALESCE(u."updatedAt", u."createdAt") < COALESCE(d."updatedAt", d."createdAt");

-- Create unique index case-insensitive
CREATE UNIQUE INDEX IF NOT EXISTS user_email_unique_ci_idx
ON public."User" (lower("email"));
