-- Allow admins to manage WKR expenses
-- For MVP, we'll allow hr_admin and super_admin

CREATE POLICY "Admins can view all WKR expenses"
ON public.wkr_expenses
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('hr_admin', 'super_admin')
  )
);

CREATE POLICY "Admins can insert WKR expenses"
ON public.wkr_expenses
FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('hr_admin', 'super_admin')
  )
);

CREATE POLICY "Admins can update WKR expenses"
ON public.wkr_expenses
FOR UPDATE
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('hr_admin', 'super_admin')
  )
);
