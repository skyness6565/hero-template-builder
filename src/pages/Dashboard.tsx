import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardTopBar from "@/components/dashboard/DashboardTopBar";
import NotificationBanner from "@/components/dashboard/NotificationBanner";
import WelcomeSection from "@/components/dashboard/WelcomeSection";
import TradingProgressCard from "@/components/dashboard/TradingProgressCard";
import AccountCard from "@/components/dashboard/AccountCard";
import LiveChartWidget from "@/components/dashboard/LiveChartWidget";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import BotTradingWidget from "@/components/dashboard/BotTradingWidget";
import BottomNav from "@/components/dashboard/BottomNav";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-background pb-20 md:pb-6">
      <DashboardTopBar />
      <NotificationBanner />
      <WelcomeSection />

      <div className="px-4 md:px-6 py-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <TradingProgressCard />
        <AccountCard />
        <LiveChartWidget />
        <RecentTransactions />
        <BotTradingWidget />
      </div>

      <BottomNav />
    </div>
  );
};

export default Dashboard;
