-- Profiles
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_department ON public.profiles(department_id);

-- Contracts
CREATE INDEX IF NOT EXISTS idx_contracts_user_id ON public.contracts(user_id);
CREATE INDEX IF NOT EXISTS idx_contracts_dates ON public.contracts(start_date, end_date);

-- Sickness Logs
CREATE INDEX IF NOT EXISTS idx_sickness_user_id ON public.sickness_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sickness_status ON public.sickness_logs(status);
CREATE INDEX IF NOT EXISTS idx_sickness_report_date ON public.sickness_logs(report_date);

-- Leave Balances
CREATE INDEX IF NOT EXISTS idx_leave_balances_user_id ON public.leave_balances(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_balances_expiry ON public.leave_balances(expiration_date);

-- Leave Requests
CREATE INDEX IF NOT EXISTS idx_leave_requests_user_id ON public.leave_requests(user_id);
CREATE INDEX IF NOT EXISTS idx_leave_requests_status ON public.leave_requests(status);
CREATE INDEX IF NOT EXISTS idx_leave_requests_dates ON public.leave_requests(start_date);

-- WKR Expenses
CREATE INDEX IF NOT EXISTS idx_wkr_expenses_date ON public.wkr_expenses(date);
CREATE INDEX IF NOT EXISTS idx_wkr_expenses_category ON public.wkr_expenses(category);

-- Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON public.audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_target ON public.audit_logs(target_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
