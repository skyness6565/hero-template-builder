
-- NOTIFICATIONS
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  target TEXT NOT NULL DEFAULT 'all', -- 'all' | 'user'
  target_user_id UUID,
  created_by UUID,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view notifications targeted to them or all"
ON public.notifications FOR SELECT
TO authenticated
USING (target = 'all' OR target_user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins insert notifications"
ON public.notifications FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins delete notifications"
ON public.notifications FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

-- NOTIFICATION READS (dismiss tracking)
CREATE TABLE public.notification_reads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  notification_id UUID NOT NULL REFERENCES public.notifications(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  read_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(notification_id, user_id)
);
ALTER TABLE public.notification_reads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own reads"
ON public.notification_reads FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users create own reads"
ON public.notification_reads FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- KYC
CREATE TABLE public.kyc_verifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  front_image_url TEXT NOT NULL,
  back_image_url TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending', -- pending | approved | rejected
  rejection_reason TEXT,
  reviewed_by UUID,
  reviewed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.kyc_verifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own kyc"
ON public.kyc_verifications FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE POLICY "Users insert own kyc"
ON public.kyc_verifications FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own pending kyc"
ON public.kyc_verifications FOR UPDATE
TO authenticated
USING (auth.uid() = user_id AND status = 'pending');

CREATE POLICY "Admins view all kyc"
ON public.kyc_verifications FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE POLICY "Admins update kyc"
ON public.kyc_verifications FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(),'admin'));

CREATE TRIGGER update_kyc_updated_at
BEFORE UPDATE ON public.kyc_verifications
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- STORAGE BUCKET (private)
INSERT INTO storage.buckets (id, name, public) VALUES ('kyc-documents','kyc-documents', false);

CREATE POLICY "Users upload own kyc files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users view own kyc files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'kyc-documents' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.has_role(auth.uid(),'admin')));

CREATE POLICY "Users update own kyc files"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'kyc-documents' AND auth.uid()::text = (storage.foldername(name))[1]);
