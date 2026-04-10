import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Download, Upload, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";

const typeIcons: Record<string, any> = { deposit: Download, withdrawal: Upload, investment: TrendingUp };
const statusColors: Record<string, string> = {
  completed: "bg-chart-green/15 text-chart-green",
  pending: "bg-yellow-500/15 text-yellow-400",
  failed: "bg-chart-red/15 text-chart-red",
};

const RecentTransactionsWidget = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [txs, setTxs] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    const fetchTxs = async () => {
      const { data } = await supabase.from("transactions").select("*")
        .eq("user_id", user.id).order("created_at", { ascending: false }).limit(5);
      if (data) setTxs(data);
    };
    fetchTxs();

    const channel = supabase
      .channel("recent-txs")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "transactions" }, () => fetchTxs())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user]);

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl border border-border/30 h-full flex flex-col">
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-primary" />
          <h3 className="font-heading font-semibold text-foreground text-sm">Recent Activity</h3>
        </div>
        <button 
          onClick={() => navigate("/dashboard/history")}
          className="text-xs text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
        >
          View All <ArrowRight size={12} />
        </button>
      </div>
      
      {txs.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center py-8 px-5">
          <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center mb-3">
            <Clock size={20} className="text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground text-center">No transactions yet</p>
          <p className="text-xs text-muted-foreground/60 text-center mt-1">Your activity will appear here</p>
        </div>
      ) : (
        <div className="flex-1 divide-y divide-border/20">
          {txs.map(tx => {
            const Icon = typeIcons[tx.type] || Clock;
            return (
              <div key={tx.id} className="flex items-center gap-3 px-5 py-3 hover:bg-muted/20 transition-colors">
                <div className={`h-8 w-8 rounded-lg flex items-center justify-center shrink-0 ${
                  tx.type === 'deposit' ? 'bg-chart-green/15' : tx.type === 'withdrawal' ? 'bg-chart-red/15' : 'bg-primary/15'
                }`}>
                  <Icon size={14} className={
                    tx.type === 'deposit' ? 'text-chart-green' : tx.type === 'withdrawal' ? 'text-chart-red' : 'text-primary'
                  } />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-foreground capitalize">{tx.type}</p>
                  <p className="text-[10px] text-muted-foreground">{format(new Date(tx.created_at), "MMM d, h:mm a")}</p>
                </div>
                <div className="text-right">
                  <p className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-chart-red' : 'text-chart-green'}`}>
                    {tx.type === 'withdrawal' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                  </p>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${statusColors[tx.status] || 'bg-muted text-muted-foreground'}`}>
                    {tx.status}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default RecentTransactionsWidget;
