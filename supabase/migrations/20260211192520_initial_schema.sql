-- Extensions
CREATE EXTENSION IF NOT EXISTS pgsodium;
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Types
CREATE TYPE user_role AS ENUM ('super_admin', 'hr_admin', 'manager', 'employee');
CREATE TYPE leave_type AS ENUM ('wettelijk', 'bovenwettelijk');
CREATE TYPE wkr_category AS ENUM ('taxable', 'targeted_exemption');
CREATE TYPE sickness_status AS ENUM ('reported', 'problem_analysis', 'plan_of_approach', '42_week_notification', 'first_year_evaluation', 'wia_application_prep', 'final_evaluation', 'wia_dossier', 'recovered');

-- Profiles Table
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'employee',
  is_owner BOOLEAN NOT NULL DEFAULT FALSE,
  full_name TEXT,
  department_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Immutable Owner Trigger
CREATE OR REPLACE FUNCTION protect_owner()
RETURNS TRIGGER AS $$
BEGIN
  IF OLD.is_owner = TRUE AND (TG_OP = 'DELETE' OR NEW.is_owner = FALSE) THEN
    RAISE EXCEPTION 'Cannot delete or demote the owner account.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_owner_immutability
BEFORE UPDATE OR DELETE ON public.profiles
FOR EACH ROW EXECUTE FUNCTION protect_owner();

-- Contracts Table
CREATE TABLE public.contracts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE,
  fte NUMERIC(3, 2) NOT NULL CHECK (fte > 0 AND fte <= 1.0),
  salary_gross_cents INTEGER NOT NULL,
  vacation_hours_statutory INTEGER NOT NULL DEFAULT 0,
  vacation_hours_non_statutory INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sickness Logs Table
CREATE TABLE public.sickness_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  report_date DATE NOT NULL,
  recovery_date DATE,
  status sickness_status NOT NULL DEFAULT 'reported',
  uwv_notification_sent BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Leave Balances Table
CREATE TABLE public.leave_balances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  year INTEGER NOT NULL,
  type leave_type NOT NULL,
  balance_minutes INTEGER NOT NULL DEFAULT 0,
  expiration_date DATE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- WKR Expenses Table
CREATE TABLE public.wkr_expenses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  amount_cents INTEGER NOT NULL,
  category wkr_category NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on All Tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contracts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sickness_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leave_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wkr_expenses ENABLE ROW LEVEL SECURITY;

-- Basic Policies (To start with)
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = id);

-- Note: More sophisticated policies will be added later based on role checks.
