import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Users, DollarSign, TrendingUp, Clock } from "lucide-react";

const AdminDashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [stats, setStats] = useState({ users: 0, pendingTx: 0, totalDeposits: 0, activeInvestments: 0 });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetchStats = async () => {
      const [profiles, pendingTx, balances, investments] = await Promise.all([
        supabase.from("profiles").select("id", { count: "exact", head: true }),
        supabase.from("transactions").select("id", { count: "exact", head: true }).eq("status", "pending"),
        supabase.from("user_balances").select("total_deposits"),
        supabase.from("user_investments").select("id", { count: "exact", head: true }).eq("status", "active"),
      ]);
      const totalDep = (balances.data || []).reduce((s, b) => s + Number(b.total_deposits), 0);
      setStats({
        users: profiles.count || 0,
        pendingTx: pendingTx.count || 0,
        totalDeposits: totalDep,
        activeInvestments: investments.count || 0,
      });
    };
    fetchStats();
  }, [isAdmin]);

  if (authLoading || adminLoading) return null;

  const cards = [
    { label: "Total Users", value: stats.users, icon: Users, color: "from-blue-500/20 to-blue-600/10" },
    { label: "Pending Transactions", value: stats.pendingTx, icon: Clock, color: "from-yellow-500/20 to-yellow-600/10" },
    { label: "Total Deposits", value: `$${stats.totalDeposits.toLocaleString()}`, icon: DollarSign, color: "from-green-500/20 to-green-600/10" },
    { label: "Active Investments", value: stats.activeInvestments, icon: TrendingUp, color: "from-purple-500/20 to-purple-600/10" },
  ];

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold font-heading mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map((c) => (
          <div key={c.label} className={`glass-card rounded-xl p-5 bg-gradient-to-br ${c.color} border border-border/20`}>
            <div className="flex items-center gap-3 mb-3">
              <c.icon size={20} className="text-primary" />
              <span className="text-sm text-muted-foreground">{c.label}</span>
            </div>
            <p className="text-2xl font-bold">{c.value}</p>
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
