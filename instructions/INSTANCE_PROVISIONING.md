# Instance Provisioning

## 1. Concept
ZekerHR does not use a multi-tenant database. New clients require a new "Silo".

## 2. Provisioning Flow
1.  **Infrastructure Setup:**
    -   Create new Supabase Project.
    -   Enable Extensions: `pgsodium`, `plpgsql`, `pg_cron`.
    -   Set `service_role` keys in deployment secrets.

2.  **Schema Hydration:**
    -   Run base migrations (Auth, Profiles, Compliance Tables).
    -   Apply RLS policies.
    -   Set up Database Triggers (Immutable Owner).

3.  **Seed Data:**
    -   Create the initial `super_admin` user (The Owner).
    -   Set `is_owner = true` in `profiles`.

4.  **Frontend Deployment:**
    -   Deploy Next.js instance.
    -   Inject Environment Variables:
        -   `NEXT_PUBLIC_SUPABASE_URL`
        -   `NEXT_PUBLIC_SUPABASE_ANON_KEY`
        -   `SUPABASE_SERVICE_ROLE_KEY` (Server-side only)

## 3. Maintenance
-   **Migrations:** Updates are pushed via CI/CD to all sovereign instances individually or via a management plane (future scope).
