import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { BarChart3 } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useUserBalance from "@/hooks/useUserBalance";
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";

const COLORS = ["hsl(217, 91%, 60%)", "hsl(142, 71%, 45%)", "hsl(270, 60%, 55%)", "hsl(43, 96%, 56%)"];

const PortfolioPerformance = () => {
  const { user } = useAuth();
  const { balance, total_deposits, total_withdrawals, total_profit } = useUserBalance();
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_investments").select("*, investment_plans(name)")
      .eq("user_id", user.id)
      .then(({ data }) => { if (data) setInvestments(data); });
  }, [user]);

  const pieData = [
    { name: "Balance", value: balance },
    { name: "Invested", value: investments.reduce((s, i) => s + Number(i.amount), 0) },
    { name: "Profit", value: total_profit },
  ].filter(d => d.value > 0);

  const barData = investments.map(inv => ({
    name: inv.investment_plans?.name || "Inv",
    invested: Number(inv.amount),
    expected: Number(inv.expected_return),
  }));

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <BarChart3 size={20} className="text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Portfolio Performance</h1>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Balance", value: `$${balance.toFixed(2)}`, color: "text-primary" },
          { label: "Total Deposits", value: `$${total_deposits.toFixed(2)}`, color: "text-chart-green" },
          { label: "Total Withdrawals", value: `$${total_withdrawals.toFixed(2)}`, color: "text-chart-red" },
          { label: "Total Profit", value: `$${total_profit.toFixed(2)}`, color: "text-chart-green" },
        ].map(stat => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <p className="text-xs text-muted-foreground uppercase">{stat.label}</p>
            <p className={`text-lg font-heading font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="glass-card rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Asset Distribution</h3>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                  {pieData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220 45% 10%)", border: "1px solid hsl(220 30% 18%)", borderRadius: 8 }} />
              </PieChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm text-center py-10">No data yet</p>}
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="font-heading font-semibold text-foreground mb-4">Investment Returns</h3>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220 30% 18%)" />
                <XAxis dataKey="name" stroke="hsl(220 15% 55%)" fontSize={12} />
                <YAxis stroke="hsl(220 15% 55%)" fontSize={12} />
                <Tooltip contentStyle={{ background: "hsl(220 45% 10%)", border: "1px solid hsl(220 30% 18%)", borderRadius: 8 }} />
                <Bar dataKey="invested" fill="hsl(217, 91%, 60%)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="expected" fill="hsl(142, 71%, 45%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-muted-foreground text-sm text-center py-10">No investments yet</p>}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PortfolioPerformance;
