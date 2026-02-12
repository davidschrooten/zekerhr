# ZekerHR Project Context

## Overview
ZekerHR is a Sovereign HR SaaS built for the Dutch market (2026), targeting SMEs and Mid-Market companies (20-250 employees). The core philosophy is "Isolated Single-Tenancy" — every client owns their own data in a dedicated Supabase instance and Next.js deployment.

## Core Mandates
1.  **Sovereignty:** No shared database tables. Client data is physically isolated.
2.  **Compliance:** Strict adherence to Dutch labor laws (Wet verbetering poortwachter, WKR 2026).
3.  **Security:** Invite-only access. Undeletable Super Admin. BSN/IBAN encryption at rest.
4.  **Styling:** "Vercel-like" aesthetic. Wide, simplistic, functional. See `docs/STYLING.md`.

## Development Standards
1.  **Testing:** Maintain a minimum of 90% unit test coverage for all new code.
2.  **Workflow:** Use feature branches for significant functionality. Merge back to `main` only when complete.
3.  **Git Commits:** Keep commit messages concise and focused. Avoid verbose descriptions.
4.  **Documentation:** Reference sub-documents using the `@./path/to/file.md` syntax to indicate external context.

## Tech Stack
-   **Frontend:** Next.js 15 (App Router), Tailwind CSS.
-   **Backend:** Supabase (Auth, Postgres, Vault, Edge Functions).
-   **Encryption:** `pgsodium` for sensitive fields (BSN, IBAN).

## Documentation Map
Refer to the following documents for specific implementation details:

 @./instructions/PROJECT_SUMMARY.md
 @./instructions/ARCHITECTURE.md
 @./instructions/DATA_MODEL.md
 @./instructions/COMPLIANCE_POORTWACHTER.md
 @./instructions/COMPLIANCE_WKR_LEAVE.md
 @./instructions/AUTH_RBAC.md
 @./instructions/GDPR_AVG_LOGGING.md
 @./instructions/STYLING.md
 @./instructions/INSTANCE_PROVISIONING.md
 @./instructions/PAYROLL_EXPORT_SPEC.md
 @./instructions/USER_FLOWS_ADMIN.md
 @./instructions/USER_FLOWS_EMPLOYEE.md
