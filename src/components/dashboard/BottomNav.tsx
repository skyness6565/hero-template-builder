import { useNavigate, useLocation } from "react-router-dom";
import { Home, Download, User, MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Home", icon: Home, path: "/dashboard" },
  { label: "Deposit", icon: Download, path: "/dashboard/deposit" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Support", icon: MessageCircle, path: "/dashboard" },
];

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 lg:hidden glass-card border-t border-border/30">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1.5 rounded-lg transition-colors",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
