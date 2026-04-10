import { Wallet, TrendingUp, Gift, Download, Upload, Bitcoin } from "lucide-react";
import useUserBalance from "@/hooks/useUserBalance";

const StatCards = () => {
  const { balance, total_profit, bonus, total_deposits, total_withdrawals } = useUserBalance();

  const stats = [
    { label: "Total Balance", value: `$${balance.toFixed(2)}`, icon: Wallet, color: "from-primary/20 to-primary/5", iconColor: "text-primary", borderColor: "border-primary/20" },
    { label: "Total Profit", value: `$${total_profit.toFixed(2)}`, icon: TrendingUp, color: "from-chart-green/20 to-chart-green/5", iconColor: "text-chart-green", borderColor: "border-chart-green/20" },
    { label: "Bonus", value: `$${bonus.toFixed(2)}`, icon: Gift, color: "from-purple-500/20 to-purple-500/5", iconColor: "text-purple-400", borderColor: "border-purple-500/20" },
    { label: "Deposits", value: `$${total_deposits.toFixed(2)}`, icon: Download, color: "from-cyan-500/20 to-cyan-500/5", iconColor: "text-cyan-400", borderColor: "border-cyan-500/20" },
    { label: "Withdrawals", value: `$${total_withdrawals.toFixed(2)}`, icon: Upload, color: "from-orange-500/20 to-orange-500/5", iconColor: "text-orange-400", borderColor: "border-orange-500/20" },
    { label: "Bitcoin", value: "0.000000 BTC", subValue: "≈ $0.00", icon: Bitcoin, color: "from-yellow-500/20 to-yellow-500/5", iconColor: "text-yellow-400", borderColor: "border-yellow-500/20" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {stats.map((stat) => (
        <div key={stat.label} className={`relative overflow-hidden rounded-xl p-4 bg-gradient-to-br ${stat.color} border ${stat.borderColor} backdrop-blur-sm`}>
          <div className="flex items-start justify-between mb-2">
            <div className={`h-9 w-9 rounded-lg bg-card/60 flex items-center justify-center`}>
              <stat.icon size={18} className={stat.iconColor} />
            </div>
          </div>
          <p className="text-xs text-muted-foreground font-medium mb-0.5">{stat.label}</p>
          <p className="text-lg font-heading font-bold text-foreground leading-tight">{stat.value}</p>
          {"subValue" in stat && stat.subValue && (
            <p className="text-[10px] text-muted-foreground mt-0.5">{stat.subValue}</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default StatCards;
