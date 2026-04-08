import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

const tickerData = [
  { symbol: "BTC", price: "$71,284.30", change: "-2.4%", negative: true },
  { symbol: "ETH", price: "$2,105.18", change: "-1.8%", negative: true },
  { symbol: "SOL", price: "$178.42", change: "+3.2%", negative: false },
];

const DashboardTopBar = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 glass-card border-b border-border/30">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Logo */}
        <div className="font-heading text-xl font-bold flex items-center gap-1">
          <span className="text-foreground">Trade</span>
          <span className="text-primary">Hub</span>
        </div>

        {/* Ticker */}
        <div className="hidden md:flex items-center gap-6">
          {tickerData.map((t) => (
            <div key={t.symbol} className="flex items-center gap-2 text-sm">
              <span className="font-medium text-foreground">{t.symbol}</span>
              <span className={t.negative ? "text-chart-red" : "text-chart-green"}>{t.price}</span>
              <span className={`text-xs ${t.negative ? "text-chart-red" : "text-chart-green"}`}>{t.change}</span>
            </div>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <div className="hidden sm:block text-right mr-2">
            <p className="text-xs text-muted-foreground">Balance</p>
            <p className="text-sm font-heading font-bold text-foreground">$31,440.00</p>
          </div>

          <Button
            size="sm"
            className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 glow-blue text-primary-foreground font-semibold"
          >
            Deposit
          </Button>

          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center text-sm font-bold text-primary">
                {initial}
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-12 w-44 glass-card rounded-lg border border-border/50 shadow-2xl py-1 z-50">
                <button
                  onClick={() => { navigate("/profile"); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                >
                  <User size={14} /> Profile
                </button>
                <button
                  onClick={() => { signOut(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-chart-red hover:bg-muted/50 transition-colors"
                >
                  <LogOut size={14} /> Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
