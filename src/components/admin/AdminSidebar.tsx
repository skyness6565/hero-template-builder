import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  LayoutDashboard, Users, Clock, TrendingUp, Bot, DollarSign, ArrowLeft, LogOut, ChevronRight, X, Wallet,
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Overview", icon: LayoutDashboard, path: "/admin" },
  { label: "Users & Balances", icon: Users, path: "/admin/users" },
  { label: "Transactions", icon: Clock, path: "/admin/transactions" },
  { label: "Investments", icon: TrendingUp, path: "/admin/investments" },
  { label: "Plans", icon: DollarSign, path: "/admin/plans" },
  { label: "Trading Bots", icon: Bot, path: "/admin/bots" },
  { label: "Wallets", icon: Wallet, path: "/admin/wallets" },
];

interface Props { open: boolean; onClose: () => void; }

const AdminSidebar = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <>
      {open && <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto",
        open ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="font-heading text-xl font-bold flex items-center gap-1">
            <span className="text-foreground">Crypto</span>
            <span className="text-primary">ExpertTrade</span>
            <span className="text-xs ml-2 bg-primary/20 text-primary px-2 py-0.5 rounded-full">Admin</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground"><X size={20} /></button>
        </div>

        <nav className="flex-1 overflow-y-auto py-3 space-y-1">
          {items.map((item) => {
            const active = location.pathname === item.path;
            return (
              <div key={item.label} className="px-2">
                <button
                  onClick={() => { navigate(item.path); onClose(); }}
                  className={cn(
                    "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
                    active ? "bg-primary/10 text-primary border border-primary/30" : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
                  )}
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                  {active && <ChevronRight size={14} className="ml-auto" />}
                </button>
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          <button onClick={() => { navigate("/dashboard"); onClose(); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted/30 transition-colors">
            <ArrowLeft size={18} /><span>Back to Dashboard</span>
          </button>
          <button onClick={() => { signOut(); onClose(); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors">
            <LogOut size={18} /><span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default AdminSidebar;
