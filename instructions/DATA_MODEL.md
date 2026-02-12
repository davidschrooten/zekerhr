# Data Model

## 1. Overview
The database schema is designed for a single-tenant environment. RLS (Row Level Security) is used to separate access levels (Admin vs Employee) rather than Tenant IDs.

## 2. Core Tables

### `profiles`
Central user repository.
-   `id`: UUID (Primary Key, references `auth.users`).
-   `email`: String.
-   `role`: Enum (`super_admin`, `hr_admin`, `manager`, `employee`).
-   `is_owner`: Boolean (Immutable for the primary admin).
-   `full_name`: String.
-   `department_id`: FK.

### `contracts`
Employment history and terms.
-   `id`: UUID.
-   `user_id`: FK to `profiles`.
-   `start_date`: Date.
-   `end_date`: Date (nullable).
-   `fte`: Decimal (0.0 - 1.0).
-   `salary_gross`: Integer (Cents).
-   `vacation_hours_statutory`: Integer.
-   `vacation_hours_non_statutory`: Integer.

### `sickness_logs`
Tracks "Wet verbetering poortwachter" events.
-   `id`: UUID.
-   `user_id`: FK to `profiles`.
-   `report_date`: Date (Day 1).
-   `recovery_date`: Date (nullable).
-   `status`: Enum (Reported, Problem Analysis, Plan of Approach, etc.).
-   `uwv_notification_sent`: Boolean.

### `leave_balances`
Tracks available hours.
-   `id`: UUID.
-   `user_id`: FK to `profiles`.
-   `year`: Integer (e.g., 2026).
-   `type`: Enum (`wettelijk`, `bovenwettelijk`).
-   `balance_minutes`: Integer.
-   `expiration_date`: Date.

### `wkr_expenses`
Ledger for Work-related costs scheme.
-   `id`: UUID.
-   `amount_cents`: Integer.
-   `category`: Enum (`taxable`, `targeted_exemption`).
-   `description`: String.
-   `date`: Date.

## 3. Sensitive Data & Encryption
The following fields **MUST** be encrypted at rest using `pgsodium`. They are never stored in plain text.

-   **BSN (Burgerservicenummer):** Stored in a dedicated secure table or column `encrypted_bsn`.
-   **IBAN:** Stored as `encrypted_iban`.

UI Masking: These fields are returned masked (e.g., `NL89 RABO **** **** 12`) to the frontend by default. Full reveal requires a specific API call logged in the audit trail.
