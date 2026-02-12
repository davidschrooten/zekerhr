-- Fix RLS policy for reporting recovery
-- The previous policy used the USING clause for both visibility and validity checks.
-- Since reporting recovery changes 'recovery_date' from NULL to a date, it violated the "recovery_date IS NULL" check on the new row.

DROP POLICY IF EXISTS "Employees can report recovery" ON public.sickness_logs;

CREATE POLICY "Employees can report recovery"
ON public.sickness_logs
FOR UPDATE
USING (auth.uid() = user_id AND recovery_date IS NULL)
WITH CHECK (auth.uid() = user_id);