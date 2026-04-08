import { ArrowDownLeft, ArrowUpRight, RefreshCw } from "lucide-react";

const transactions = [
  { date: "Apr 7, 2026", type: "Deposit", amount: "+$5,000.00", status: "Completed", icon: ArrowDownLeft, color: "text-chart-green" },
  { date: "Apr 6, 2026", type: "Trade", amount: "-$1,230.50", status: "Completed", icon: RefreshCw, color: "text-chart-blue" },
  { date: "Apr 5, 2026", type: "Withdrawal", amount: "-$2,500.00", status: "Pending", icon: ArrowUpRight, color: "text-chart-red" },
  { date: "Apr 4, 2026", type: "Deposit", amount: "+$10,000.00", status: "Completed", icon: ArrowDownLeft, color: "text-chart-green" },
  { date: "Apr 3, 2026", type: "Trade", amount: "+$840.20", status: "Completed", icon: RefreshCw, color: "text-chart-green" },
];

const statusColors: Record<string, string> = {
  Completed: "bg-chart-green/15 text-chart-green",
  Pending: "bg-yellow-500/15 text-yellow-400",
};

const RecentTransactions = () => (
  <div className="glass-card rounded-xl p-5">
    <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Recent Transactions</h3>
    <div className="space-y-3">
      {transactions.map((tx, i) => (
        <div key={i} className="flex items-center gap-3 py-2 border-b border-border/30 last:border-0">
          <div className={`h-8 w-8 rounded-lg bg-muted flex items-center justify-center ${tx.color}`}>
            <tx.icon size={14} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground">{tx.type}</p>
            <p className="text-xs text-muted-foreground">{tx.date}</p>
          </div>
          <div className="text-right">
            <p className={`text-sm font-medium ${tx.amount.startsWith("+") ? "text-chart-green" : "text-chart-red"}`}>
              {tx.amount}
            </p>
            <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${statusColors[tx.status]}`}>
              {tx.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default RecentTransactions;
