ALTER TABLE public.sickness_logs
ADD COLUMN IF NOT EXISTS documents JSONB DEFAULT '[]'::JSONB;