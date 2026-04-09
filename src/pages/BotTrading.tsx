import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Bot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

interface TradingBot {
  id: string;
  name: string;
  description: string;
  roi_min: number;
  roi_max: number;
}

interface UserBot {
  id: string;
  bot_id: string;
  is_active: boolean;
  total_profit: number;
  trades_executed: number;
}

const BotTrading = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [bots, setBots] = useState<TradingBot[]>([]);
  const [userBots, setUserBots] = useState<UserBot[]>([]);

  useEffect(() => {
    if (!user) return;
    supabase.from("trading_bots").select("*").eq("status", "active")
      .then(({ data }) => { if (data) setBots(data.map(b => ({ ...b, roi_min: Number(b.roi_min), roi_max: Number(b.roi_max) }))); });
    supabase.from("user_bots").select("*").eq("user_id", user.id)
      .then(({ data }) => { if (data) setUserBots(data.map(ub => ({ ...ub, total_profit: Number(ub.total_profit) }))); });
  }, [user]);

  const toggleBot = async (bot: TradingBot) => {
    if (!user) return;
    const existing = userBots.find(ub => ub.bot_id === bot.id);
    try {
      if (existing) {
        const { error } = await supabase.from("user_bots")
          .update({ is_active: !existing.is_active })
          .eq("id", existing.id);
        if (error) throw error;
        setUserBots(prev => prev.map(ub => ub.id === existing.id ? { ...ub, is_active: !ub.is_active } : ub));
      } else {
        const { data, error } = await supabase.from("user_bots")
          .insert({ user_id: user.id, bot_id: bot.id, is_active: true })
          .select().single();
        if (error) throw error;
        if (data) setUserBots(prev => [...prev, { ...data, total_profit: Number(data.total_profit) }]);
      }
      toast({ title: "Bot updated!" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
  };

  const gradients = ["from-blue-600 to-blue-500", "from-emerald-600 to-teal-500", "from-purple-600 to-violet-500"];

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Bot size={20} className="text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Trading Bots</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {bots.map((bot, i) => {
          const ub = userBots.find(u => u.bot_id === bot.id);
          return (
            <div key={bot.id} className={`rounded-xl p-6 bg-gradient-to-br ${gradients[i % 3]} border border-white/10`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-heading font-bold text-white">{bot.name}</h3>
                <Switch checked={ub?.is_active ?? false} onCheckedChange={() => toggleBot(bot)} />
              </div>
              <p className="text-sm text-white/70 mb-4">{bot.description}</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-xs text-white/60">ROI</p>
                  <p className="text-sm font-bold text-white">{bot.roi_min}-{bot.roi_max}%</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Profit</p>
                  <p className="text-sm font-bold text-white">${(ub?.total_profit ?? 0).toFixed(2)}</p>
                </div>
                <div>
                  <p className="text-xs text-white/60">Trades</p>
                  <p className="text-sm font-bold text-white">{ub?.trades_executed ?? 0}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <div className={`h-2 w-2 rounded-full ${ub?.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />
                <span className="text-xs text-white/70">{ub?.is_active ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default BotTrading;
