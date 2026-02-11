-- Notifications Table (for In-App alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('info', 'warning', 'critical')),
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  action_url TEXT -- Optional link to relevant page
);

-- RLS
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
USING (auth.uid() = user_id);

-- Only service role (via functions) or admins should insert, but we'll lock it down to RLS for now.
-- Let's allow admins to insert for manual notifications if needed.
CREATE POLICY "Admins can create notifications"
ON public.notifications FOR INSERT
WITH CHECK (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role IN ('hr_admin', 'super_admin')
  )
);

-- Function to Check Compliance Deadlines (Poortwachter)
CREATE OR REPLACE FUNCTION check_compliance_deadlines()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  log record;
  days_sick integer;
  profile_record record;
BEGIN
  -- Loop through all active sickness cases (recovery_date is NULL)
  FOR log IN 
    SELECT s.id, s.user_id, s.report_date, p.full_name
    FROM public.sickness_logs s
    JOIN public.profiles p ON s.user_id = p.id
    WHERE s.recovery_date IS NULL
  LOOP
    days_sick := (CURRENT_DATE - log.report_date);

    -- Week 6 (42 days) - Probleemanalyse
    IF days_sick = 42 THEN
      -- Notify all HR Admins and Super Admins
      FOR profile_record IN SELECT id FROM public.profiles WHERE role IN ('hr_admin', 'super_admin')
      LOOP
        INSERT INTO public.notifications (user_id, title, message, type, action_url)
        VALUES (
          profile_record.id, 
          'Compliance Alert: Week 6', 
          'Probleemanalyse is due for ' || COALESCE(log.full_name, 'Employee'), 
          'warning',
          '/dashboard/hr/sickness/' || log.id
        );
      END LOOP;
    END IF;

    -- Week 42 (294 days) - 42e-weeksmelding
    IF days_sick = 294 THEN
      FOR profile_record IN SELECT id FROM public.profiles WHERE role IN ('hr_admin', 'super_admin')
      LOOP
        INSERT INTO public.notifications (user_id, title, message, type, action_url)
        VALUES (
          profile_record.id, 
          'Compliance Critical: Week 42', 
          'Mandatory 42th-week notification to UWV due for ' || COALESCE(log.full_name, 'Employee'), 
          'critical',
          '/dashboard/hr/sickness/' || log.id
        );
      END LOOP;
    END IF;

  END LOOP;
END;
$$;

-- Schedule the job to run daily at 6:00 AM Europe/Amsterdam time (or UTC depending on server)
-- We use cron.schedule.
-- Note: This requires pg_cron extension to be enabled (it is in initial_schema).
SELECT cron.schedule('compliance_check_daily', '0 6 * * *', $$SELECT check_compliance_deadlines()$$);
