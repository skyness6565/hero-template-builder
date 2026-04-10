import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import WelcomeBanner from "@/components/dashboard/WelcomeBanner";
import StatCards from "@/components/dashboard/StatCards";
import QuickActions from "@/components/dashboard/QuickActions";
import LiveChartWidget from "@/components/dashboard/LiveChartWidget";
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
      <div className="space-y-5">
        {/* Welcome + quick overview */}
        <WelcomeBanner />

        {/* Live price ticker */}
        <LivePriceTicker />

        {/* Stat cards */}
        <StatCards />

        {/* Quick actions */}
        <QuickActions />

        {/* Chart + Transactions grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2">
            <LiveChartWidget />
          </div>
          <div className="lg:col-span-1">
            <RecentTransactionsWidget />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
