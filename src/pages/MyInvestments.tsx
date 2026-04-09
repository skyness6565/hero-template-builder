import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Briefcase } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { format } from "date-fns";
import { Progress } from "@/components/ui/progress";

const MyInvestments = () => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("user_investments").select("*, investment_plans(name, roi_percentage, duration_days)")
      .eq("user_id", user.id).order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setInvestments(data); });
  }, [user]);

  // Refresh progress every 10 seconds
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 10000);
    return () => clearInterval(interval);
  }, []);

  const getProgress = (start: string, end: string, multiplier: number = 1) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const elapsed = (Date.now() - s) * multiplier;
    const total = e - s;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const getCurrentReturn = (amount: number, expectedReturn: number, progress: number) => {
    const profit = expectedReturn - amount;
    return amount + (profit * progress / 100);
  };

  const statusColors: Record<string, string> = {
    active: "bg-chart-green/20 text-chart-green",
    completed: "bg-primary/20 text-primary",
    cancelled: "bg-chart-red/20 text-chart-red",
  };

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
          <Briefcase size={20} className="text-purple-400" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">My Investments</h1>
      </div>

      {investments.length === 0 ? (
        <div className="glass-card rounded-xl p-10 text-center">
          <p className="text-muted-foreground">No active investments. Visit Investment Plans to get started!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {investments.map(inv => {
            const multiplier = Number(inv.roi_speed_multiplier || 1);
            const progress = getProgress(inv.start_date, inv.end_date, multiplier);
            const planName = inv.investment_plans?.name || "Investment";
            const amount = Number(inv.amount);
            const expectedReturn = Number(inv.expected_return);
            const currentReturn = getCurrentReturn(amount, expectedReturn, progress);
            const currentProfit = currentReturn - amount;
            return (
              <div key={inv.id} className="glass-card rounded-xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-heading font-semibold text-foreground">{planName}</h3>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[inv.status]}`}>{inv.status}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Invested</p>
                    <p className="font-bold text-foreground">${amount.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Current Return</p>
                    <p className="font-bold text-chart-green">${currentReturn.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Profit So Far</p>
                    <p className="font-bold text-chart-green">+${currentProfit.toFixed(2)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Expected Total</p>
                    <p className="font-bold text-foreground">${expectedReturn.toFixed(2)}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <p className="text-xs text-muted-foreground">Start</p>
                    <p className="font-medium text-foreground">{format(new Date(inv.start_date), "MMM d, yy")}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">End</p>
                    <p className="font-medium text-foreground">{format(new Date(inv.end_date), "MMM d, yy")}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={progress} className="flex-1 h-2" />
                  <span className="text-xs text-muted-foreground font-medium">{progress.toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default MyInvestments;
