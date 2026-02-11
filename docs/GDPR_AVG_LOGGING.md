# GDPR, Privacy & Logging

## 1. Data Minimization & Encryption
To comply with GDPR (AVG - Algemene Verordening Gegevensbescherming):

-   **Encryption at Rest:**
    -   **BSN (Burgerservicenummer):** MUST be encrypted.
    -   **IBAN:** MUST be encrypted.
    -   **Tooling:** `pgsodium` extension in Supabase.

-   **UI Masking:**
    -   BSN and IBAN are masked by default (e.g., `********123`).
    -   "Click to Reveal" action is required to view full data.

## 2. Audit Logging
Every access to sensitive data is logged to an immutable audit trail.

### Logged Events
1.  **Authentication:** Login, Logout, Failed attempts.
2.  **Data Reveal:** User X viewed BSN of User Y.
3.  **Data Export:** User X downloaded Payroll Export.
4.  **Role Changes:** User X changed Role of User Y.

### Audit Table Schema
-   `id`: UUID.
-   `actor_id`: UUID (Who performed the action).
-   `target_id`: UUID (Who was affected).
-   `action`: String (`VIEW_BSN`, `EXPORT_PAYROLL`, `UPDATE_ROLE`).
-   `timestamp`: ISO 8601.
-   `metadata`: JSON (IP address, User Agent).

## 3. Retention Policies
-   Audit logs are retained for legal duration (typically 7 years for financial/payroll context).
-   Right to be Forgotten (Vergeetrecht): Supported for non-statutory data. Statutory data (Tax, Payroll) remains for 7 years as required by Belastingdienst.
