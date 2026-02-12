# Architecture: The Silo

## 1. Infrastructure Strategy
ZekerHR utilizes an **Isolated Single-Tenancy** model.

-   **Deployment:** One Supabase project + One Next.js deployment per client.
-   **Isolation:** No shared database tables. No multi-tenant schemas.
-   **Data Sovereignty:** The client effectively "owns" the instance.

## 2. Technology Stack

### Frontend / Application Layer
-   **Framework:** Next.js 15 (App Router).
-   **Styling:** Tailwind CSS.
-   **UI Library:** Shadcn/UI (inferred from `components.json`).

### Backend / Database Layer
-   **Platform:** Supabase.
-   **Database:** PostgreSQL.
-   **Auth:** Supabase Auth (Invite-only configuration).
-   **Security:** Supabase Vault / `pgsodium` for encryption.

## 3. Core System Invariants

### The Immutable Owner
To prevent hostile takeovers or accidental lockouts in a sovereign instance, the system enforces a rule:
-   The `super_admin` record marked as `is_owner` cannot be deleted.
-   Modification of this record is restricted via database triggers on `public.profiles`.

### Encryption Layer
-   **Library:** `pgsodium`.
-   **Method:** Transparent Column Encryption (TCE) or manual PGP encryption for specific columns.
-   **Key Management:** Keys managed within Supabase Vault.
