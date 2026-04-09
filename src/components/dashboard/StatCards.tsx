import { Wallet, TrendingUp, Gift, Download, Upload, Bitcoin } from "lucide-react";

const stats = [
  {
    label: "Balance",
    value: "$0.00",
    icon: Wallet,
    gradient: "from-blue-600 to-blue-500",
  },
  {
    label: "Profit/ROI",
    value: "$0.00",
    icon: TrendingUp,
    gradient: "from-emerald-600 to-teal-500",
  },
  {
    label: "Bonus",
    value: "$0.00",
    icon: Gift,
    gradient: "from-purple-600 to-violet-500",
  },
  {
    label: "Deposits",
    value: "$0.00",
    icon: Download,
    gradient: "from-teal-500 to-cyan-400",
  },
  {
    label: "Withdrawals",
    value: "$0.00",
    icon: Upload,
    gradient: "from-orange-500 to-amber-400",
  },
  {
    label: "Bitcoin",
    value: "0.000000 BTC",
    subValue: "≈ $0.00",
    icon: Bitcoin,
    gradient: "from-yellow-600 to-amber-500",
  },
];

const StatCards = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
    {stats.map((stat) => (
      <div
        key={stat.label}
        className={`relative overflow-hidden rounded-xl p-5 bg-gradient-to-br ${stat.gradient} border border-white/10`}
      >
        <div className="absolute right-4 top-4 opacity-30">
          <stat.icon size={28} className="text-white" />
        </div>
        <p className="text-xs font-semibold text-white/80 uppercase tracking-wider mb-1">
          {stat.label}
        </p>
        <p className="text-xl font-heading font-bold text-white">{stat.value}</p>
        {stat.subValue && (
          <p className="text-xs text-white/60 mt-0.5">{stat.subValue}</p>
        )}
      </div>
    ))}
  </div>
);

export default StatCards;
