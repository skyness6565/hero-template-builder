import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { TrendingUp } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useUserBalance from "@/hooks/useUserBalance";
import { Input } from "@/components/ui/input";

interface Plan {
  id: string;
  name: string;
  description: string;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
}

const InvestmentPlans = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance, refetch } = useUserBalance();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [investing, setInvesting] = useState<string | null>(null);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("investment_plans").select("*").eq("status", "active").then(({ data }) => {
      if (data) setPlans(data.map(p => ({ ...p, min_amount: Number(p.min_amount), max_amount: Number(p.max_amount), roi_percentage: Number(p.roi_percentage) })));
    });
  }, []);

  const handleInvest = async (plan: Plan) => {
    if (!user) return;
    const amt = Number(amounts[plan.id] || 0);
    if (amt < plan.min_amount || amt > plan.max_amount) {
      toast({ title: "Invalid amount", description: `Amount must be between $${plan.min_amount} and $${plan.max_amount}`, variant: "destructive" });
      return;
    }
    if (amt > balance) {
      toast({ title: "Insufficient balance", variant: "destructive" });
      return;
    }
    setInvesting(plan.id);
    try {
      const expectedReturn = amt + (amt * plan.roi_percentage / 100);
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + plan.duration_days);

      const { error: invError } = await supabase.from("user_investments").insert({
        user_id: user.id,
        plan_id: plan.id,
        amount: amt,
        expected_return: expectedReturn,
        end_date: endDate.toISOString(),
      });
      if (invError) throw invError;

      const { error: txError } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "investment",
        amount: amt,
        status: "completed",
        description: `Investment in ${plan.name}`,
      });
      if (txError) throw txError;

      // Update balance
      const { error: balError } = await supabase.from("user_balances")
        .update({ balance: balance - amt })
        .eq("user_id", user.id);
      if (balError) throw balError;

      toast({ title: "Investment successful!", description: `Invested $${amt} in ${plan.name}` });
      refetch();
      setAmounts(prev => ({ ...prev, [plan.id]: "" }));
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setInvesting(null);
    }
  };

  const gradients = ["from-blue-600 to-blue-500", "from-emerald-600 to-teal-500", "from-purple-600 to-violet-500"];

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-chart-green/20 flex items-center justify-center">
          <TrendingUp size={20} className="text-chart-green" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Investment Plans</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {plans.map((plan, i) => (
          <div key={plan.id} className={`rounded-xl p-6 bg-gradient-to-br ${gradients[i % 3]} border border-white/10`}>
            <h3 className="text-lg font-heading font-bold text-white mb-1">{plan.name}</h3>
            <p className="text-sm text-white/70 mb-4">{plan.description}</p>
            <div className="space-y-2 text-sm text-white/80 mb-4">
              <p>ROI: <span className="font-bold text-white">{plan.roi_percentage}%</span></p>
              <p>Duration: <span className="font-bold text-white">{plan.duration_days} days</span></p>
              <p>Min: ${plan.min_amount} — Max: ${plan.max_amount}</p>
            </div>
            <Input
              type="number"
              placeholder={`Min $${plan.min_amount}`}
              value={amounts[plan.id] || ""}
              onChange={(e) => setAmounts(prev => ({ ...prev, [plan.id]: e.target.value }))}
              className="mb-3 bg-white/10 border-white/20 text-white placeholder:text-white/50"
            />
            <Button
              onClick={() => handleInvest(plan)}
              disabled={investing === plan.id}
              className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
            >
              {investing === plan.id ? "Investing..." : "Invest Now"}
            </Button>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
};

export default InvestmentPlans;
