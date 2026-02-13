-- Create secure-documents bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('secure-documents', 'secure-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Policy: HR Admins can upload/manage all files
CREATE POLICY "HR Admins can manage all secure documents"
ON storage.objects FOR ALL
USING (
  bucket_id = 'secure-documents' AND
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('hr_admin', 'super_admin')
  )
);

-- Policy: Users can view their own files (based on path prefix being their user_id)
-- Path convention: {user_id}/{year}/{filename}
CREATE POLICY "Users can view own secure documents"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'secure-documents' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
