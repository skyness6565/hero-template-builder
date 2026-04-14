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
  User,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";

const mainItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
];

const financeItems = [
  { label: "Deposit Funds", icon: Download, path: "/dashboard/deposit" },
  { label: "Withdraw", icon: Upload, path: "/dashboard/withdraw" },
  { label: "Investment Plans", icon: TrendingUp, path: "/dashboard/plans" },
  { label: "Earnings / ROI", icon: DollarSign, path: "/dashboard/earnings" },
  { label: "Transactions", icon: Clock, path: "/dashboard/history" },
];

const portfolioItems = [
  { label: "My Investments", icon: Briefcase, path: "/dashboard/investments" },
  { label: "Portfolio", icon: BarChart3, path: "/dashboard/portfolio" },
  { label: "Trading Bots", icon: Bot, path: "/dashboard/bots" },
];

const accountItems = [
  { label: "My Profile", icon: User, path: "/profile" },
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
          "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
          active
            ? "bg-primary/15 text-primary border-l-2 border-primary ml-0"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-l-2 border-transparent"
        )}
      >
        <item.icon size={18} className={active ? "text-primary" : ""} />
        <span className="flex-1 text-left">{item.label}</span>
        {active && <ChevronRight size={14} className="text-primary" />}
      </button>
    );
  };

  const SectionLabel = ({ children }: { children: string }) => (
    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.15em] px-3 pt-5 pb-1.5">
      {children}
    </p>
  );

  return (
    <>
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-[260px] bg-card border-r border-border/30 flex flex-col transition-transform duration-300 lg:sticky lg:top-0 lg:translate-x-0 lg:z-auto",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-border/20">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-primary to-blue-400 flex items-center justify-center">
              <Zap size={16} className="text-white" />
            </div>
            <div className="font-heading text-lg font-bold">
              <span className="text-foreground">Crypto</span>
              <span className="text-primary">ExpertTrade</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-muted-foreground hover:text-foreground transition-colors">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-1 px-2 space-y-0.5">
          <SectionLabel>Overview</SectionLabel>
          {mainItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          <SectionLabel>Finance</SectionLabel>
          {financeItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          <SectionLabel>Portfolio & Trading</SectionLabel>
          {portfolioItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}

          <SectionLabel>Account</SectionLabel>
          {accountItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="p-3 border-t border-border/20 space-y-1">
          {isAdmin && (
            <button
              onClick={() => { navigate("/admin"); onClose(); }}
              className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-yellow-400 hover:bg-yellow-500/10 transition-colors"
            >
              <Shield size={18} />
              <span>Admin Panel</span>
            </button>
          )}
          <button
            onClick={() => { signOut(); onClose(); }}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-chart-red hover:bg-chart-red/10 transition-colors"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardSidebar;
