import { Download, Upload, TrendingUp, ClipboardList } from "lucide-react";

const actions = [
  { label: "Deposit", icon: Download },
  { label: "Withdraw", icon: Upload },
  { label: "Invest", icon: TrendingUp },
  { label: "History", icon: ClipboardList },
];

const QuickActions = () => (
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
    {actions.map((action) => (
      <button
        key={action.label}
        className="glass-card rounded-xl p-5 flex flex-col items-center gap-3 hover:bg-muted/40 transition-colors group"
      >
        <div className="h-10 w-10 rounded-full border border-primary/40 flex items-center justify-center text-primary group-hover:bg-primary/10 transition-colors">
          <action.icon size={20} />
        </div>
        <span className="text-sm text-muted-foreground group-hover:text-foreground transition-colors">
          {action.label}
        </span>
      </button>
    ))}
  </div>
);

export default QuickActions;
