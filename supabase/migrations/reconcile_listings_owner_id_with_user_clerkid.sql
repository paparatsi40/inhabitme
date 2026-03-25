-- Reconcile listings.owner_id with canonical Clerk user ids stored in public."User".
-- Safe migration: only updates rows where owner_id currently stores legacy public."User".id
-- and replaces it with the corresponding public."User"."clerkId".

UPDATE public.listings l
SET owner_id = u."clerkId"
FROM public."User" u
WHERE l.owner_id = u.id
  AND u."clerkId" IS NOT NULL;
