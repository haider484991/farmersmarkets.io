-- Fixes Supabase security advisor: rls_disabled_in_public (public.ad_impressions)
--
-- 001_initial_schema.sql enabled RLS on 9 tables but omitted ad_impressions,
-- so the anon role kept the default public-schema grants: full SELECT/INSERT/
-- UPDATE/DELETE for anyone holding the (public) anon key.
--
-- Verified 2026-08-14 before writing this migration:
--   * ad_impressions contains 0 rows -> nothing has leaked
--   * an anon INSERT reached the NOT NULL constraint (23502) rather than being
--     rejected by RLS (42501) -> anon write access was real
--   * no application code calls the table or its two RPCs; the only references
--     are 001_initial_schema.sql and the generated types/database.ts
--
-- Enabling RLS with no policies denies anon and authenticated outright.
-- service_role bypasses RLS, so server-side writes are unaffected.

ALTER TABLE public.ad_impressions ENABLE ROW LEVEL SECURITY;

-- NOTE: increment_ad_impression() and increment_ad_click() are plain plpgsql
-- (not SECURITY DEFINER), so they execute as the caller. They are currently
-- unused. If ad tracking is ever wired up to the browser client, uncomment the
-- block below, or those RPCs will silently fail under RLS.
--
-- ALTER FUNCTION public.increment_ad_impression(VARCHAR, VARCHAR) SECURITY DEFINER;
-- ALTER FUNCTION public.increment_ad_click(VARCHAR, VARCHAR) SECURITY DEFINER;
