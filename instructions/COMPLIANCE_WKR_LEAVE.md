# Compliance: Leave & WKR (2026)

## 1. Holiday & Leave Logic
Based on the 2026 Dutch Civil Code.

### Leave Types
1.  **Wettelijk (Statutory):**
    *   **Calculation:** 4 $\times$ weekly contractual hours.
    *   **Expiration:** July 1st of the following year (6-month carryover).
    *   **Priority:** **MUST be deducted first.**
2.  **Bovenwettelijk (Non-statutory):**
    *   **Calculation:** Extra hours agreed in contract/CAO.
    *   **Expiration:** 5 years from accrual.

### Deduction Algorithm
When an employee requests leave:
1.  Check `wettelijk` balance for the oldest applicable year.
2.  If sufficient, deduct from `wettelijk`.
3.  If insufficient, deduct remainder from `bovenwettelijk`.
*This prevents employees from losing hours that expire sooner.*

## 2. WKR (Werkkostenregeling) 2026
Real-time budget tracking for "Vrije Ruimte" (Tax-free budget).

### Thresholds
*   **Tier 1:** 2.0% of fiscal wage bill for the first €400,000.
*   **Tier 2:** 1.18% of the excess fiscal wage bill above €400,000.

### Expense Tagging
Expenses must be categorized:
-   **WKR-Taxable:** Counts against the "Vrije Ruimte" budget (e.g., Christmas hampers, generic bonuses).
-   **Targeted Exemptions (Gerichte vrijstellingen):** Tax-free and *outside* the budget (e.g., Travel allowance, home-office costs, training).

### Dashboard Logic
-   Calculate Total Fiscal Wage Bill (Sum of all gross salaries).
-   Calculate Available Budget based on Tiers 1 & 2.
-   Sum all `WKR-Taxable` expenses.
-   Display: `Remaining Budget` and `Forecasted 80% Tax Penalty` if budget is exceeded.
