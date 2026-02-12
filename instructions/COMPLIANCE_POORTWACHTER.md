# Compliance: Wet verbetering poortwachter (Sickness)

## 1. Overview
The system automates the strict timeline required by Dutch law for long-term sickness. Failure to comply results in sanctions from the UWV.

## 2. Timeline Logic & Triggers

The system monitors active `sickness_logs` where `recovery_date` is NULL.

| Timeframe | Event | System Action |
| :--- | :--- | :--- |
| **Day 1** | Ziekmelding (Report) | Employee or Manager creates record. HR Admin notified. |
| **Week 6** | Probleemanalyse | Deadline warning sent to HR/Manager. Document upload required. |
| **Week 8** | Plan van Aanpak (PvA) | Deadline warning. Action plan must be drafted. |
| **Week 42** | 42e-weeksmelding | **CRITICAL:** Mandatory notification to UWV. Admin dashboard alert. |
| **Week 52** | Eerstejaarsevaluatie | Evaluation reminder. |
| **Week 88** | WIA Application Prep | Reminder to start WIA benefit application. |
| **Week 91** | Eindevaluatie | Final evaluation required. |
| **Week 93** | WIA Dossier | Full Re-integration report (RIV) due. |

## 3. Implementation Details
-   **Cron Jobs:** Daily check of all open sickness cases against the `report_date`.
-   **Notifications:** Email and In-App notifications sent to `hr_admin` and `manager`.
-   **Task Blocking:** Managers cannot archive a case without required document uploads (e.g., PvA) if duration exceeds threshold.
