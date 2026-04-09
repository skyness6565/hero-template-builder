import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import {
  LayoutDashboard,
  Download,
  Upload,
  TrendingUp,
  DollarSign,
  Clock,
  Briefcase,
  BarChart3,
  Bot,
  LogOut,
  ChevronRight,
  X,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

const financeItems = [
  { label: "Deposit", icon: Download, path: "/dashboard/deposit" },
  { label: "Withdraw", icon: Upload, path: "/dashboard/withdraw" },
  { label: "Investment Plans", icon: TrendingUp, path: "/dashboard/plans" },
  { label: "Earnings / ROI", icon: DollarSign, path: "/dashboard/earnings" },
  { label: "Transaction History", icon: Clock, path: "/dashboard/history" },
];

const portfolioItems = [
  { label: "My Investments", icon: Briefcase, path: "/dashboard/investments" },
  { label: "Portfolio Performance", icon: BarChart3, path: "/dashboard/portfolio" },
  { label: "Trading Bots", icon: Bot, path: "/dashboard/bots" },
];

interface Props {
  open: boolean;
  onClose: () => void;
}

const DashboardSidebar = ({ open, onClose }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const { isAdmin } = useAdmin();

  const NavItem = ({ item }: { item: typeof mainItems[0] }) => {
    const active = location.pathname === item.path;
    return (
      <button
        onClick={() => { navigate(item.path); onClose(); }}
        className={cn(
          "flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm transition-colors",
          active
            ? "bg-primary/10 text-primary border border-primary/30"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30"
        )}
      >
        <item.icon size={18} />
        <span>{item.label}</span>
        {active && <ChevronRight size={14} className="ml-auto" />}
      </button>
    );
  };

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="text-xs font-semibold text-primary/70 uppercase tracking-wider px-4 pt-5 pb-2">
      {children}
    </p>
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-sidebar-border">
          <div className="font-heading text-xl font-bold flex items-center gap-1">
            <span className="text-foreground">Trade</span>
            <span className="text-primary">Hub</span>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground">
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-2 space-y-0.5">
          <SectionLabel>Main</SectionLabel>
          {mainItems.map((item) => (
            <div key={item.label} className="px-2"><NavItem item={item} /></div>
          ))}

          <SectionLabel>Finance</SectionLabel>
          {financeItems.map((item) => (
            <div key={item.label} className="px-2"><NavItem item={item} /></div>
          ))}

          <SectionLabel>Portfolio</SectionLabel>
          {portfolioItems.map((item) => (
            <div key={item.label} className="px-2"><NavItem item={item} /></div>
          ))}
        </nav>

        <div className="p-4 border-t border-sidebar-border space-y-1">
          {isAdmin && (
            <button
              onClick={() => { navigate("/admin"); onClose(); }}
              className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-yellow-400 hover:bg-yellow-500/10 transition-colors"
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            onClick={() => { signOut(); onClose(); }}
            className="flex items-center gap-3 w-full px-4 py-2.5 rounded-lg text-sm text-primary hover:bg-primary/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
