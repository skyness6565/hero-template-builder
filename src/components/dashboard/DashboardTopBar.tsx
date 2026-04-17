import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogOut, User, ChevronDown, Menu, Wallet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import useUserBalance from "@/hooks/useUserBalance";
import NotificationBell from "./NotificationBell";

interface Props {
  onMenuClick: () => void;
}

const DashboardTopBar = ({ onMenuClick }: Props) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { balance } = useUserBalance();
  const displayName = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "User";
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border/40">
      <div className="flex items-center justify-between px-4 py-3 md:px-6">
        {/* Mobile menu + Logo */}
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <Menu size={22} />
          </button>
          <div className="font-heading text-lg font-bold flex items-center gap-1 lg:hidden">
            <span className="text-foreground">Crypto</span>
            <span className="text-primary">ExpertTrade</span>
          </div>
        </div>

        {/* Center - Market ticker (desktop) */}
        <div className="hidden lg:flex items-center gap-1 text-xs">
          <span className="text-muted-foreground">Welcome back,</span>
          <span className="text-foreground font-medium">{displayName}</span>
          <span className="mx-2 text-border">|</span>
          <div className="flex items-center gap-1">
            <div className="h-1.5 w-1.5 rounded-full bg-chart-green animate-pulse" />
            <span className="text-chart-green font-medium">Markets Open</span>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Balance chip */}
          <div className="hidden sm:flex items-center gap-2 bg-muted/50 rounded-lg px-3 py-1.5 border border-border/30">
            <Wallet size={14} className="text-primary" />
            <div>
              <p className="text-[10px] text-muted-foreground leading-none">Balance</p>
              <p className="text-sm font-heading font-bold text-foreground leading-tight">${balance.toFixed(2)}</p>
            </div>
          </div>

          {/* Notification bell */}
          <NotificationBell />

          {/* Deposit button */}
          <Button
            size="sm"
            onClick={() => navigate("/dashboard/deposit")}
            className="bg-gradient-to-r from-chart-green to-emerald-500 hover:from-chart-green/90 hover:to-emerald-500/90 text-white font-semibold text-xs h-9"
          >
            Deposit
          </Button>

          {/* User avatar dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2"
            >
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center text-sm font-bold text-white shadow-lg shadow-primary/20">
                {initial}
              </div>
              <ChevronDown size={14} className="text-muted-foreground hidden sm:block" />
            </button>
            {showMenu && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
                <div className="absolute right-0 top-12 w-48 bg-card rounded-xl border border-border/50 shadow-2xl py-1.5 z-50">
                  <div className="px-4 py-2 border-b border-border/30">
                    <p className="text-sm font-medium text-foreground">{displayName}</p>
                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={() => { navigate("/profile"); setShowMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-foreground hover:bg-muted/50 transition-colors"
                  >
                    <User size={14} /> Profile
                  </button>
                  <button
                    onClick={() => { signOut(); setShowMenu(false); }}
                    className="flex items-center gap-2.5 w-full px-4 py-2.5 text-sm text-chart-red hover:bg-muted/50 transition-colors"
                  >
                    <LogOut size={14} /> Logout
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default DashboardTopBar;
