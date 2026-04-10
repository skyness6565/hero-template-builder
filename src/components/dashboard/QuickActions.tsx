import { useNavigate } from "react-router-dom";
import { Download, Upload, TrendingUp, Clock, Bot, Briefcase } from "lucide-react";

const actions = [
  { label: "Deposit", icon: Download, path: "/dashboard/deposit", color: "text-chart-green", bg: "bg-chart-green/10 hover:bg-chart-green/20" },
  { label: "Withdraw", icon: Upload, path: "/dashboard/withdraw", color: "text-orange-400", bg: "bg-orange-400/10 hover:bg-orange-400/20" },
  { label: "Invest", icon: TrendingUp, path: "/dashboard/plans", color: "text-primary", bg: "bg-primary/10 hover:bg-primary/20" },
  { label: "History", icon: Clock, path: "/dashboard/history", color: "text-cyan-400", bg: "bg-cyan-400/10 hover:bg-cyan-400/20" },
  { label: "Bots", icon: Bot, path: "/dashboard/bots", color: "text-purple-400", bg: "bg-purple-400/10 hover:bg-purple-400/20" },
  { label: "Portfolio", icon: Briefcase, path: "/dashboard/portfolio", color: "text-yellow-400", bg: "bg-yellow-400/10 hover:bg-yellow-400/20" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h3 className="text-sm font-heading font-semibold text-foreground mb-3">Quick Actions</h3>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
        {actions.map((action) => (
          <button
            key={action.label}
            onClick={() => navigate(action.path)}
            className={`${action.bg} rounded-xl p-3 flex flex-col items-center gap-2 transition-all duration-200 group border border-transparent hover:border-border/30`}
          >
            <div className={`h-10 w-10 rounded-xl bg-card/60 flex items-center justify-center ${action.color} transition-transform group-hover:scale-110`}>
              <action.icon size={20} />
            </div>
            <span className="text-xs text-muted-foreground group-hover:text-foreground font-medium transition-colors">{action.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
