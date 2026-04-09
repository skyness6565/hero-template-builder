import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Menu } from "lucide-react";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import SubscriptionBanner from "@/components/dashboard/SubscriptionBanner";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import VerificationBanner from "@/components/dashboard/VerificationBanner";
import StatCards from "@/components/dashboard/StatCards";
import QuickActions from "@/components/dashboard/QuickActions";
import StatusCard from "@/components/dashboard/StatusCard";
import BottomNav from "@/components/dashboard/BottomNav";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 min-w-0 pb-20 lg:pb-6">
        {/* Mobile top bar */}
        <header className="sticky top-0 z-30 lg:hidden flex items-center justify-between px-4 py-3 glass-card border-b border-border/30">
          <button onClick={() => setSidebarOpen(true)} className="text-foreground">
            <Menu size={24} />
          </button>
          <div className="font-heading text-lg font-bold flex items-center gap-1">
            <span className="text-foreground">Trade</span>
            <span className="text-primary">Hub</span>
          </div>
          <div className="w-6" />
        </header>

        <div className="px-4 md:px-6 py-6 space-y-4 max-w-4xl">
          <SubscriptionBanner />
          <WelcomeBanner />
          <VerificationBanner />
          <StatCards />
          <QuickActions />
          <StatusCard />
        </div>
      </main>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
