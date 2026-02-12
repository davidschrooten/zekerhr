# Project Summary: ZekerHR

## 1. Product Core
ZekerHR is a Sovereign HR SaaS designed specifically for the Dutch market in 2026. It addresses the complexity of Dutch labor laws while ensuring absolute data sovereignty for clients.

### Target Audience
-   **Primary:** Dutch SMEs (MKB) and Mid-Market companies.
-   **Size:** 20–250 employees.

### Value Proposition
Unlike multi-tenant SaaS where data co-exists, ZekerHR offers "The Silo": an isolated single-tenancy architecture. This ensures that client data is not just logically separated, but physically isolated in dedicated instances.

## 2. Key Features

### Sovereignty Rule
-   **Immutable Owner:** The primary Super Admin (Owner) is undeletable and immutable. This is enforced via database triggers on `public.profiles`.
-   **Dedicated Infrastructure:** Every client has a dedicated Supabase instance and Next.js deployment.

### Dutch Compliance Engine
The system automates complex Dutch bureaucratic processes:
-   **Wet verbetering poortwachter:** Automated sickness tracking and mandatory notifications.
-   **WKR (Werkkostenregeling):** Real-time budget tracking against fiscal wage bills.
-   **Leave Management:** Statutory (Wettelijk) vs. Non-statutory (Bovenwettelijk) logic with specific expiration rules.

### Security & Privacy
-   **Invite-Only:** No public registration.
-   **Encryption:** BSN and IBAN numbers are encrypted at rest.
-   **Audit:** Extensive logging of all administrative views of sensitive data.
