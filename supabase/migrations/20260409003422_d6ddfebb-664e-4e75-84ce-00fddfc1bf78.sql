
-- User balances
CREATE TABLE public.user_balances (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  balance NUMERIC NOT NULL DEFAULT 0,
  bonus NUMERIC NOT NULL DEFAULT 0,
  total_deposits NUMERIC NOT NULL DEFAULT 0,
  total_withdrawals NUMERIC NOT NULL DEFAULT 0,
  total_profit NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_balances ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own balance" ON public.user_balances FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own balance" ON public.user_balances FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own balance" ON public.user_balances FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_balances_updated_at BEFORE UPDATE ON public.user_balances FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Transactions
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('deposit', 'withdrawal', 'investment')),
  amount NUMERIC NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed')),
  crypto_type TEXT,
  wallet_address TEXT,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own transactions" ON public.transactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Investment plans (public catalog)
CREATE TABLE public.investment_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  min_amount NUMERIC NOT NULL DEFAULT 100,
  max_amount NUMERIC NOT NULL DEFAULT 10000,
  roi_percentage NUMERIC NOT NULL DEFAULT 5,
  duration_days INTEGER NOT NULL DEFAULT 30,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.investment_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active plans" ON public.investment_plans FOR SELECT USING (true);

-- User investments
CREATE TABLE public.user_investments (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  plan_id UUID REFERENCES public.investment_plans(id),
  amount NUMERIC NOT NULL,
  expected_return NUMERIC NOT NULL,
  start_date TIMESTAMPTZ NOT NULL DEFAULT now(),
  end_date TIMESTAMPTZ NOT NULL,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_investments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own investments" ON public.user_investments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own investments" ON public.user_investments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_user_investments_updated_at BEFORE UPDATE ON public.user_investments FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Trading bots (public catalog)
CREATE TABLE public.trading_bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  roi_min NUMERIC NOT NULL DEFAULT 1,
  roi_max NUMERIC NOT NULL DEFAULT 5,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.trading_bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view active bots" ON public.trading_bots FOR SELECT USING (true);

-- User bots
CREATE TABLE public.user_bots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  bot_id UUID REFERENCES public.trading_bots(id),
  is_active BOOLEAN NOT NULL DEFAULT false,
  total_profit NUMERIC NOT NULL DEFAULT 0,
  trades_executed INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.user_bots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own bots" ON public.user_bots FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create own bots" ON public.user_bots FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own bots" ON public.user_bots FOR UPDATE USING (auth.uid() = user_id);
CREATE TRIGGER update_user_bots_updated_at BEFORE UPDATE ON public.user_bots FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Auto-create balance row on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user_balance()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.user_balances (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created_balance
AFTER INSERT ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_balance();

-- Seed investment plans
INSERT INTO public.investment_plans (name, description, min_amount, max_amount, roi_percentage, duration_days) VALUES
  ('Starter Plan', 'Low-risk entry plan for beginners', 100, 1000, 5, 7),
  ('Growth Plan', 'Medium-risk plan with solid returns', 500, 5000, 12, 30),
  ('Premium Plan', 'High-yield plan for experienced traders', 1000, 50000, 25, 90);

-- Seed trading bots
INSERT INTO public.trading_bots (name, description, roi_min, roi_max) VALUES
  ('AI Scalper Bot', 'High-frequency scalping with AI signals', 2, 8),
  ('Trend Rider Bot', 'Follows market trends for steady gains', 1, 5),
  ('DCA Master Bot', 'Dollar-cost averaging strategy bot', 3, 10);
