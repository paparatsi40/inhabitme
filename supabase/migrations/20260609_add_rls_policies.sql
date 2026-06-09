-- ============================================================================
-- ADD ROW LEVEL SECURITY (RLS) POLICIES — defense in depth
-- InhabitMe — 2026-06-09
-- ============================================================================
--
-- ACCESS MODEL (read this before editing):
--
--   * The application authenticates users with CLERK and accesses Postgres
--     exclusively through the Supabase SERVICE-ROLE key (server-side). The
--     service-role bypasses RLS, so enabling RLS DOES NOT change how the app
--     works today.
--   * The browser/anon Supabase client exists in the codebase but is NOT used
--     by any component, and the drizzle (direct postgres) client is not used in
--     active code paths. There is therefore no anon/authenticated traffic to
--     break.
--   * Ownership columns (owner_id, host_id, guest_id, host_user_id, ...) store
--     CLERK ids as TEXT (e.g. 'user_37Xx...'), NOT Supabase auth UUIDs.
--     auth.uid() (a uuid, and NULL outside a Supabase-auth session) can never
--     match a Clerk id, so a functional auth.uid() ownership policy is not
--     possible here. Per-row authorization is enforced in the app layer.
--
-- WHAT THIS MIGRATION DOES:
--   * Enables RLS on every sensitive table so a leaked/misused ANON key (or any
--     future accidental anon/authenticated access) is blocked by default.
--   * Owned/sensitive tables get NO anon/authenticated policy → full block for
--     those roles; the service-role continues to bypass RLS. These are marked:
--       -- NOTE: service-role only, clerk auth bypass
--   * Genuinely public data (active listings) gets a public SELECT policy.
--
-- Uses ALTER TABLE IF EXISTS / DROP POLICY IF EXISTS so it is idempotent and
-- safe to run even if a given (legacy) table is absent.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. PUBLIC CATALOG — listings
--    Active listings are public (shown on the public site). Reads by the app
--    go through the service-role, but we also expose active rows to anon/
--    authenticated so a public read is possible without leaking drafts.
--    Writes have no policy → service-role only.
--    NOTE: service-role only, clerk auth bypass  (owner writes via clerkId text)
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS listings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active listings" ON listings;
CREATE POLICY "Public can view active listings" ON listings
  FOR SELECT
  TO anon, authenticated
  USING (status = 'active');


-- ----------------------------------------------------------------------------
-- 2. OWNED / SENSITIVE — service-role only
--    RLS enabled with NO anon/authenticated policy = blocked for those roles.
--    Service-role bypasses RLS, so the app is unaffected.
--    NOTE: service-role only, clerk auth bypass (host_id / guest_id / owner_id
--          are Clerk text ids; per-row authz enforced in the app layer)
-- ----------------------------------------------------------------------------

-- Bookings & payments (financial + guest PII)
ALTER TABLE IF EXISTS bookings             ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS booking_requests     ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS booking_flow_events  ENABLE ROW LEVEL SECURITY;

-- Messaging (conversations between host and guest)
ALTER TABLE IF EXISTS conversations        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages             ENABLE ROW LEVEL SECURITY;

-- Availability (host-managed) and inbound leads (contain guest emails)
ALTER TABLE IF EXISTS property_availability_periods ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS availability_leads            ENABLE ROW LEVEL SECURITY;

-- Growth / CRM (owner-scoped internal ops data)
ALTER TABLE IF EXISTS growth_pipeline_leads  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS growth_lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS growth_daily_kpis      ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- 3. USER / PII table — service-role only
--    "User" (synced from the Clerk webhook) holds email / clerkId / role.
--    NOTE: service-role only, clerk auth bypass
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS "User" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS users  ENABLE ROW LEVEL SECURITY;  -- lowercase variant, if present


-- ----------------------------------------------------------------------------
-- 4. LEGACY / UNCERTAIN tables — lock down if they still exist
--    Referenced by code (.from('host_payments'/'property_leads')) or by the
--    legacy drizzle schema (PascalCase Prisma-era tables). IF EXISTS makes each
--    a no-op when the table is absent.
--    NOTE: service-role only, clerk auth bypass
-- ----------------------------------------------------------------------------
ALTER TABLE IF EXISTS host_payments   ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS property_leads  ENABLE ROW LEVEL SECURITY;

ALTER TABLE IF EXISTS "Property"      ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "PropertyImage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Booking"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Payment"       ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Review"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Availability"  ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS "Message"       ENABLE ROW LEVEL SECURITY;


-- ----------------------------------------------------------------------------
-- Already had RLS (left untouched by this migration):
--   listing_themes, listing_views, user_preferences, property_waitlist
-- ----------------------------------------------------------------------------

-- Verification (run manually after applying):
--   SELECT relname, relrowsecurity
--   FROM pg_class
--   WHERE relkind = 'r' AND relnamespace = 'public'::regnamespace
--   ORDER BY relname;
