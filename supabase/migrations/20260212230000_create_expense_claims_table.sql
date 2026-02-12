-- Create ENUM for Expense Claims
CREATE TYPE public.expense_status AS ENUM ('pending', 'approved', 'rejected', 'paid');
CREATE TYPE public.expense_category AS ENUM ('travel', 'equipment', 'meals', 'training', 'other');

-- Create Expense Claims Table
CREATE TABLE IF NOT EXISTS public.expense_claims (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  amount_cents INTEGER NOT NULL CHECK (amount_cents > 0),
  currency TEXT DEFAULT 'EUR',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  category public.expense_category NOT NULL DEFAULT 'other',
  status public.expense_status NOT NULL DEFAULT 'pending',
  receipt_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.expense_claims ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own claims" ON public.expense_claims
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create own claims" ON public.expense_claims
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "HR/Admins can view all claims" ON public.expense_claims
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('hr_admin', 'super_admin', 'manager')
    )
  );

CREATE POLICY "HR/Admins can update claims" ON public.expense_claims
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('hr_admin', 'super_admin')
    )
  );
