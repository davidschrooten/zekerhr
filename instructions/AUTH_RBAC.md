# Auth & RBAC

## 1. Authentication Model
-   **Invite-Only:** Public sign-up is disabled.
-   **Method:** Magic Link (Email) or Password set upon invitation acceptance.
-   **Provider:** Supabase Auth.

## 2. Roles (RBAC)

The system uses a strict hierarchy managed in the `profiles` table.

### `super_admin` (Owner)
-   **Scope:** Global.
-   **Permissions:**
    -   Invite/Delete HR Admins.
    -   Access Billing.
    -   View Audit Logs.
    -   *Constraint:* Cannot be deleted (Sovereignty Rule).

### `hr_admin`
-   **Scope:** Organization-wide.
-   **Permissions:**
    -   View all employee dossiers.
    -   Manage Compliance (Poortwachter, WKR).
    -   Run Payroll Exports.
    -   Invite Managers/Employees.
    -   View unmasked BSN/IBAN (Logged event).

### `manager`
-   **Scope:** Team / Department specific.
-   **Permissions:**
    -   View profiles of direct reports.
    -   Approve/Deny leave requests.
    -   Manage sickness reporting for team.
    -   *Restriction:* No access to BSN/IBAN or private notes.

### `employee`
-   **Scope:** Self.
-   **Permissions:**
    -   View own profile, contract, payslips.
    -   Request leave.
    -   Report sickness (Self).

## 3. Implementation
-   **Database:** Row Level Security (RLS) policies enforce these scopes at the database layer.
-   **Frontend:** Middleware checks role before rendering Protected Routes.
