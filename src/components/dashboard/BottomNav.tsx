import { Home, PlusCircle, User, Headphones } from "lucide-react";
import { useNavigate } from "react-router-dom";

const items = [
  { icon: Home, label: "Home", path: "/dashboard", active: true },
  { icon: PlusCircle, label: "Deposit", path: "/dashboard" },
  { icon: User, label: "Profile", path: "/profile" },
  { icon: Headphones, label: "Support", path: "/dashboard" },
];

const BottomNav = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 glass-card border-t border-border/30 md:hidden">
      <div className="flex items-center justify-around py-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => navigate(item.path)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1.5 transition-colors ${
              item.active ? "text-primary" : "text-muted-foreground"
            }`}
          >
            <item.icon size={20} />
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
        <div className="flex flex-col items-center gap-0.5 px-3 py-1.5 text-muted-foreground">
          <span className="text-[10px] flex items-center gap-1">
            🇺🇸 <span className="font-medium">EN</span>
          </span>
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;
