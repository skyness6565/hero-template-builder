
-- Create wallet_addresses table for admin-managed crypto addresses
CREATE TABLE public.wallet_addresses (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crypto_type TEXT NOT NULL,
  address TEXT NOT NULL,
  label TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.wallet_addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view wallet addresses"
ON public.wallet_addresses FOR SELECT
USING (true);

CREATE POLICY "Admins can insert wallet addresses"
ON public.wallet_addresses FOR INSERT TO authenticated
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update wallet addresses"
ON public.wallet_addresses FOR UPDATE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete wallet addresses"
ON public.wallet_addresses FOR DELETE TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_wallet_addresses_updated_at
BEFORE UPDATE ON public.wallet_addresses
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Add speed multiplier to user_investments for admin to speed up ROI
ALTER TABLE public.user_investments ADD COLUMN roi_speed_multiplier NUMERIC NOT NULL DEFAULT 1.0;
