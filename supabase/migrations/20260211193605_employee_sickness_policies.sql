-- Allow employees to view their own sickness logs
CREATE POLICY "Employees can view own sickness logs"
ON public.sickness_logs
FOR SELECT
USING (auth.uid() = user_id);

-- Allow employees to insert a new sickness log (report sickness)
CREATE POLICY "Employees can report sickness"
ON public.sickness_logs
FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow employees to update their own sickness logs (report recovery)
-- Restricting updates to only where recovery_date is NULL ensures they don't modify historical records arbitrarily
CREATE POLICY "Employees can report recovery"
ON public.sickness_logs
FOR UPDATE
USING (auth.uid() = user_id AND recovery_date IS NULL);
