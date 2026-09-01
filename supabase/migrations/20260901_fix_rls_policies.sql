-- ============================================================================
-- FIX RLS POLICIES — cerrar accesos anónimos heredados
-- InhabitMe — 2026-09-01
-- ============================================================================
--
-- Continúa el modelo de acceso fijado en 20260609_add_rls_policies.sql:
--
--   * La app autentica con CLERK y habla con Postgres SIEMPRE con la
--     service-role key desde el servidor. La service-role ignora RLS, así que
--     nada de lo que hay aquí cambia el comportamiento de la aplicación.
--   * Las columnas de propiedad (owner_id, user_id, ...) guardan ids de Clerk
--     como TEXT. auth.uid() es un uuid y es NULL fuera de una sesión de
--     Supabase Auth, así que NUNCA puede coincidir con un id de Clerk.
--   * La autorización por fila vive en la capa de aplicación (cada route
--     handler comprueba owner_id/guest_id contra el userId de Clerk).
--
-- Lo que arregla esta migración: políticas heredadas que abrían acceso a
-- anon/authenticated y que la aplicación no necesita.
--
-- Idempotente (IF EXISTS en todo). Segura de re-ejecutar.
-- ============================================================================


-- ----------------------------------------------------------------------------
-- 1. property_waitlist — la política "de service role" era pública
--
--    "Service role can manage waitlist" se creó como:
--        FOR ALL USING (true)
--    sin cláusula TO, así que en Postgres aplica a PUBLIC — anon incluido.
--    Efecto real: cualquiera con la anon key podía SELECT / UPDATE / DELETE
--    todos los emails de la waitlist.
--
--    La service-role no necesita ninguna política: bypassa RLS.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Service role can manage waitlist" ON property_waitlist;


-- ----------------------------------------------------------------------------
-- 2. Vistas — SECURITY INVOKER
--
--    Una vista sin security_invoker se ejecuta con los permisos de su OWNER
--    (postgres), así que salta la RLS de las tablas base. listing_views_summary
--    exponía title y owner_id de TODOS los listings —borradores incluidos— a
--    cualquiera con la anon key, pese a que `listings` solo publica las filas
--    con status = 'active'.
--
--    Con security_invoker la vista aplica la RLS del rol que consulta. La app
--    lee estas vistas con service-role (bypassa RLS), así que no se ve afectada.
--
--    Se aplica a todas las vistas del esquema, no solo a la reportada: comparten
--    el mismo defecto, y booking_revenue / host_fee_revenue exponen ingresos.
-- ----------------------------------------------------------------------------
ALTER VIEW IF EXISTS listing_views_summary       SET (security_invoker = true);
ALTER VIEW IF EXISTS listings_with_themes        SET (security_invoker = true);
ALTER VIEW IF EXISTS theme_analytics             SET (security_invoker = true);
ALTER VIEW IF EXISTS booking_revenue             SET (security_invoker = true);
ALTER VIEW IF EXISTS host_fee_revenue            SET (security_invoker = true);
ALTER VIEW IF EXISTS amenities_popularity        SET (security_invoker = true);
ALTER VIEW IF EXISTS listing_availability_status SET (security_invoker = true);


-- ----------------------------------------------------------------------------
-- 3. INSERT anónimos — la app escribe siempre con service-role
--
--    Estas políticas solo permitían escribir saltándose los route handlers y,
--    con ellos, el rate limiting y la validación Zod.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Anyone can record a view"        ON listing_views;
DROP POLICY IF EXISTS "Anyone can subscribe to waitlist" ON property_waitlist;


-- ----------------------------------------------------------------------------
-- 4. Políticas de owner con auth.uid() — código muerto
--
--    Comparan un uuid de Supabase Auth con un id de Clerk (TEXT): nunca
--    coinciden, así que fallan cerradas y no conceden nada. Se eliminan para
--    que el modelo de acceso quede legible y nadie asuma que hay autorización
--    por fila donde no la hay.
--
--    RECORDATORIO: la autorización por fila de estas tablas está en la capa de
--    aplicación. Ver los route handlers de listings/[id]/theme,
--    properties/[id]/update y user/preferences.
-- ----------------------------------------------------------------------------
DROP POLICY IF EXISTS "Owners can view their listing views"      ON listing_views;
DROP POLICY IF EXISTS "Owners can update their listing themes"   ON listing_themes;
DROP POLICY IF EXISTS "Owners can insert themes for their listings" ON listing_themes;
DROP POLICY IF EXISTS "Users can view their own preferences"     ON user_preferences;
DROP POLICY IF EXISTS "Users can insert their own preferences"   ON user_preferences;
DROP POLICY IF EXISTS "Users can update their own preferences"   ON user_preferences;


-- ----------------------------------------------------------------------------
-- Verificación (ejecutar a mano tras aplicar):
--
--   select schemaname, tablename, policyname, roles, cmd
--     from pg_policies
--    where schemaname = 'public'
--    order by tablename, policyname;
--
--   -- Ninguna vista debe quedar sin security_invoker:
--   select c.relname, c.reloptions
--     from pg_class c
--     join pg_namespace n on n.oid = c.relnamespace
--    where c.relkind = 'v' and n.nspname = 'public';
-- ----------------------------------------------------------------------------
