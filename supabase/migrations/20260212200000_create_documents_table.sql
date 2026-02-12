-- Create documents table
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'contract', 'payslip', 'other'
  path TEXT NOT NULL, -- Storage path
  size_bytes BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
  ON public.documents FOR SELECT
  USING (auth.uid() = user_id);

-- Only HR/Admins can insert/update/delete documents (for now)
-- We need a policy for that if we want to enforce it at DB level, 
-- but we rely on service role or admin client in server actions mostly for HR tasks.
-- However, HR admins should be able to SELECT all documents.

CREATE POLICY "HR Admins can view all documents"
  ON public.documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND role IN ('hr_admin', 'super_admin')
    )
  );
