import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface UserBalance {
  balance: number;
  bonus: number;
  total_deposits: number;
  total_withdrawals: number;
  total_profit: number;
}

const useUserBalance = () => {
  const { user } = useAuth();
  const [data, setData] = useState<UserBalance>({
    balance: 0, bonus: 0, total_deposits: 0, total_withdrawals: 0, total_profit: 0,
  });
  const [loading, setLoading] = useState(true);

  const fetchBalance = useCallback(async () => {
    if (!user) return;
    const { data: bal } = await supabase
      .from("user_balances")
      .select("*")
      .eq("user_id", user.id)
      .single();
    if (bal) {
      setData({
        balance: Number(bal.balance),
        bonus: Number(bal.bonus),
        total_deposits: Number(bal.total_deposits),
        total_withdrawals: Number(bal.total_withdrawals),
        total_profit: Number(bal.total_profit),
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  return { ...data, loading, refetch: fetchBalance };
};

export default useUserBalance;
