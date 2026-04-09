import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import SubscriptionBanner from "@/components/dashboard/SubscriptionBanner";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import VerificationBanner from "@/components/dashboard/VerificationBanner";
import StatCards from "@/components/dashboard/StatCards";
import QuickActions from "@/components/dashboard/QuickActions";
import StatusCard from "@/components/dashboard/StatusCard";
import RecentTransactionsWidget from "@/components/dashboard/RecentTransactionsWidget";
import LivePriceTicker from "@/components/dashboard/LivePriceTicker";

const Dashboard = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  if (loading) return null;

  return (
    <DashboardLayout>
      <div className="space-y-4">
        <LivePriceTicker />
        <SubscriptionBanner />
        <WelcomeBanner />
        <VerificationBanner />
        <StatCards />
        <QuickActions />
        <RecentTransactionsWidget />
        <StatusCard />
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
