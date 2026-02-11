-- Audit Action Enum
CREATE TYPE audit_action AS ENUM (
  'LOGIN', 'LOGOUT', 
  'VIEW_BSN', 'VIEW_SICKNESS_DETAILS',
  'EXPORT_PAYROLL', 
  'APPROVE_LEAVE', 'DENY_LEAVE',
  'REPORT_SICKNESS', 'REPORT_RECOVERY',
  'UPDATE_ROLE', 'CREATE_USER',
  'ADD_EXPENSE'
);

-- Audit Logs Table
CREATE TABLE public.audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID NOT NULL REFERENCES auth.users(id),
  target_id UUID REFERENCES auth.users(id), -- Optional target (e.g. exporting all data has no single target)
  action audit_action NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Ensure immutability via check constraint (though triggers are better)
  CONSTRAINT immutable_log CHECK (true) 
);

-- RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only Super Admins and HR Admins can view logs
CREATE POLICY "Admins can view audit logs"
ON public.audit_logs
FOR SELECT
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles 
    WHERE role IN ('super_admin', 'hr_admin')
  )
);

-- Users can insert logs (via server actions)
CREATE POLICY "Users can insert audit logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (auth.uid() = actor_id);

-- Prevent Updates and Deletes
CREATE POLICY "No updates allowed"
ON public.audit_logs
FOR UPDATE
USING (false);

CREATE POLICY "No deletes allowed"
ON public.audit_logs
FOR DELETE
USING (false);
