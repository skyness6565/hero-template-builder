import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Upload, TrendingUp, Clock } from "lucide-react";
import { format } from "date-fns";

const typeIcons: Record<string, any> = { deposit: Download, withdrawal: Upload, investment: TrendingUp };
const statusColors: Record<string, string> = {
  completed: "bg-chart-green/20 text-chart-green",
  pending: "bg-yellow-500/20 text-yellow-400",
  failed: "bg-chart-red/20 text-chart-red",
};

const RecentTransactionsWidget = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetch = async () => {
      const { data } = await supabase.from("transactions").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
      if (data) setTxs(data);
    };
    fetch();

    const channel = supabase
      .channel("recent-txs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "transactions" }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  if (txs.length === 0) return null;

  return (
    <div className="glass-card rounded-xl">
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <Clock size={16} className="text-primary" />
        <h3 className="font-heading font-semibold text-foreground text-sm">Recent Transactions</h3>
      </div>
      <div className="divide-y divide-border/30">
        {txs.map(tx => {
          const Icon = typeIcons[tx.type] || Clock;
          return (
            <div key={tx.id} className="flex items-center gap-3 px-5 py-3">
              <div className={`h-8 w-8 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-chart-green/20' : tx.type === 'withdrawal' ? 'bg-chart-red/20' : 'bg-primary/20'}`}>
                <Icon size={14} className={tx.type === 'deposit' ? 'text-chart-green' : tx.type === 'withdrawal' ? 'text-chart-red' : 'text-primary'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground capitalize">{tx.type}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "MMM d, h:mm a")}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-chart-red' : 'text-chart-green'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                </p>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${statusColors[tx.status]}`}>{tx.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RecentTransactionsWidget;
