import { useNavigate } from "react-router-dom";
import { Download, Upload, TrendingUp, Clock } from "lucide-react";

const actions = [
  { label: "Deposit", icon: Download, path: "/dashboard/deposit" },
  { label: "Withdraw", icon: Upload, path: "/dashboard/withdraw" },
  { label: "Invest", icon: TrendingUp, path: "/dashboard/plans" },
  { label: "History", icon: Clock, path: "/dashboard/history" },
];

const QuickActions = () => {
  const navigate = useNavigate();

  return (
    <div className="grid grid-cols-4 gap-3">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={() => navigate(action.path)}
          className="glass-card rounded-xl p-4 flex flex-col items-center gap-2 hover:bg-muted/50 transition-colors group"
        >
          <div className="h-10 w-10 rounded-full border border-primary/30 flex items-center justify-center group-hover:border-primary transition-colors">
            <action.icon size={18} className="text-primary" />
          </div>
          <span className="text-xs text-muted-foreground group-hover:text-foreground transition-colors">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
