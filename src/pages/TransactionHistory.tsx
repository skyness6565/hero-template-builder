import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Clock, Search, Download, Upload, TrendingUp } from "lucide-react";
import { Input } from "@/components/ui/input";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { format } from "date-fns";

const typeIcons: Record<string, any> = { deposit: Download, withdrawal: Upload, investment: TrendingUp };
const statusColors: Record<string, string> = {
  completed: "bg-chart-green/20 text-chart-green",
  pending: "bg-yellow-500/20 text-yellow-400",
  failed: "bg-chart-red/20 text-chart-red",
};

const TransactionHistory = () => {
  const { user } = useAuth();
  const [txs, setTxs] = useState<any[]>([]);
  const [filter, setFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  useEffect(() => {
    if (!user) return;
    supabase.from("transactions").select("*").eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => { if (data) setTxs(data); });
  }, [user]);

  const filtered = txs.filter(tx => {
    if (typeFilter !== "all" && tx.type !== typeFilter) return false;
    if (filter && !tx.description?.toLowerCase().includes(filter.toLowerCase())) return false;
    return true;
  });

  return (
    <DashboardLayout>
      <div className="flex items-center gap-3 mb-6">
        <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
          <Clock size={20} className="text-primary" />
        </div>
        <h1 className="text-2xl font-heading font-bold text-foreground">Transaction History</h1>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <Input value={filter} onChange={(e) => setFilter(e.target.value)} placeholder="Search transactions..." className="pl-9" />
        </div>
        <div className="flex gap-2">
          {["all", "deposit", "withdrawal", "investment"].map(t => (
            <button key={t} onClick={() => setTypeFilter(t)}
              className={`px-3 py-2 rounded-lg text-xs font-medium capitalize transition-colors ${typeFilter === t ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"}`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card rounded-xl divide-y divide-border/30">
        {filtered.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-10">No transactions found</p>
        ) : filtered.map(tx => {
          const Icon = typeIcons[tx.type] || Clock;
          return (
            <div key={tx.id} className="flex items-center gap-4 p-4">
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${tx.type === 'deposit' ? 'bg-chart-green/20' : tx.type === 'withdrawal' ? 'bg-chart-red/20' : 'bg-primary/20'}`}>
                <Icon size={16} className={tx.type === 'deposit' ? 'text-chart-green' : tx.type === 'withdrawal' ? 'text-chart-red' : 'text-primary'} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">{tx.description || tx.type}</p>
                <p className="text-xs text-muted-foreground">{format(new Date(tx.created_at), "MMM d, yyyy • h:mm a")}</p>
              </div>
              <div className="text-right">
                <p className={`text-sm font-bold ${tx.type === 'withdrawal' ? 'text-chart-red' : 'text-chart-green'}`}>
                  {tx.type === 'withdrawal' ? '-' : '+'}${Number(tx.amount).toFixed(2)}
                </p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[tx.status]}`}>{tx.status}</span>
              </div>
            </div>
          );
        })}
      </div>
    </DashboardLayout>
  );
};

export default TransactionHistory;
