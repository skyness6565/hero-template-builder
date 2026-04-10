import { useNavigate, useLocation } from "react-router-dom";
import { Home, Download, Upload, TrendingUp, User } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Deposit", icon: Download, path: "/dashboard/deposit" },
  { label: "Invest", icon: TrendingUp, path: "/dashboard/plans" },
  { label: "Withdraw", icon: Upload, path: "/dashboard/withdraw" },
  { label: "Profile", icon: User, path: "/profile" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden bg-card/95 backdrop-blur-xl border-t border-border/30">
      <div className="flex items-center justify-around py-1.5 px-1">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-all min-w-[52px]",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "p-1 rounded-lg transition-colors",
                active && "bg-primary/15"
              )}>
                <item.icon size={18} />
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
