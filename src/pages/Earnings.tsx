import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { DollarSign } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useUserBalance from "@/hooks/useUserBalance";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const Earnings = () => {
  const { user } = useAuth();
  const { total_profit, balance } = useUserBalance();
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_investments").select("*, investment_plans(name, roi_percentage)")
      .eq("user_id", user.id).order("created_at", { ascending: true })
      .then(({ data }) => { if (data) setInvestments(data); });
  }, [user]);

  const chartData = investments.map((inv, i) => ({
    name: `Inv ${i + 1}`,
    amount: Number(inv.amount),
    expectedReturn: Number(inv.expected_return),
    profit: Number(inv.expected_return) - Number(inv.amount),
  }));

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-chart-green/20 flex items-center justify-center">
          <DollarSign size={20} className="text-chart-green" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Earnings / ROI</h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="glass-card rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase">Total Profit</p>
          <p className="text-2xl font-heading font-bold text-chart-green">${total_profit.toFixed(2)}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase">Current Balance</p>
          <p className="text-2xl font-heading font-bold text-foreground">${balance.toFixed(2)}</p>
        </div>
        <div className="glass-card rounded-xl p-5">
          <p className="text-xs text-muted-foreground uppercase">Active Investments</p>
          <p className="text-2xl font-heading font-bold text-primary">{investments.filter(i => i.status === 'active').length}</p>
        </div>
      </div>

      <div className="glass-card rounded-xl p-5">
        <h3 className="font-heading font-semibold text-foreground mb-4">Profit Overview</h3>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
              <XAxis dataKey="name" stroke="hsl(220 15% 55%)" fontSize={12} />
              <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
              <Tooltip contentStyle={{ background: "hsl(220 45% 10%)", border: "1px solid hsl(220 30% 18%)", borderRadius: 8 }} />
              <Area type="monotone" dataKey="profit" stroke="hsl(142 71% 45%)" fill="hsl(142 71% 45% / 0.2)" />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-muted-foreground text-sm text-center py-10">No investment data yet. Start investing to see your earnings!</p>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Earnings;
