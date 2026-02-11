-- Leave Request Status Enum
CREATE TYPE leave_status AS ENUM ('pending', 'approved', 'denied');

-- Leave Requests Table
CREATE TABLE public.leave_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  minutes_requested INTEGER NOT NULL,
  status leave_status NOT NULL DEFAULT 'pending',
  reason TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT end_date_after_start_date CHECK (end_date >= start_date)
);

-- RLS for Leave Requests
ALTER TABLE public.leave_requests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own leave requests"
ON public.leave_requests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create leave requests"
ON public.leave_requests FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Only managers/admins can update status (This will be refined later with RBAC, 
-- currently restricting updates generally but allowing inserts)
