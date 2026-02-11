# Payroll Export Specification

## 1. Objective
Enable `hr_admin` users to export monthly changes for external payroll processing (e.g., ADP, Nmbrs, Loket).

## 2. Export Format
-   **Format:** CSV or XML (SEPA compliant where applicable).
-   **Frequency:** Monthly.

## 3. Data Points

### Mutations (Mutaties)
-   New Hires (NAW data, BSN, IBAN, Salary).
-   Terminations (End date).
-   Salary Changes (New amount, Effective date).
-   Address Changes.

### Variable Pay
-   Overtime hours.
-   WKR taxable allowances.
-   Expense reimbursements.

### Sickness
-   Sickness % impact (e.g., salary reduction after 1 year sickness).

## 4. Security
-   Generating this export triggers a high-priority Audit Log event (`EXPORT_PAYROLL`).
-   File is generated on-the-fly and streamed to the client; never stored permanently on the file server.
