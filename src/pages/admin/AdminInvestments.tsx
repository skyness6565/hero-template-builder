import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";

interface Inv {
  id: string;
  user_id: string;
  amount: number;
  expected_return: number;
  status: string;
  start_date: string;
  end_date: string;
  display_name?: string;
  plan_name?: string;
}

const AdminInvestments = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const [investments, setInvestments] = useState<Inv[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  useEffect(() => {
    if (!isAdmin) return;
    const fetch = async () => {
      const { data } = await supabase.from("user_investments").select("*, investment_plans(name)").order("created_at", { ascending: false });
      const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
      const pMap = new Map((profiles || []).map((p) => [p.user_id, p.display_name]));
      setInvestments((data || []).map((i: any) => ({
        ...i, amount: Number(i.amount), expected_return: Number(i.expected_return),
        display_name: pMap.get(i.user_id) || "Unknown",
        plan_name: i.investment_plans?.name || "—",
      })));
    };
    fetch();
  }, [isAdmin]);

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold font-heading mb-6">User Investments</h1>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left text-muted-foreground">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Plan</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Expected Return</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Start</th>
              <th className="pb-3">End</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((i) => (
              <tr key={i.id} className="border-b border-border/10">
                <td className="py-3 pr-4">{i.display_name}</td>
                <td className="py-3 pr-4">{i.plan_name}</td>
                <td className="py-3 pr-4">${i.amount.toLocaleString()}</td>
                <td className="py-3 pr-4">${i.expected_return.toLocaleString()}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${i.status === "active" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>{i.status}</span>
                </td>
                <td className="py-3 pr-4">{new Date(i.start_date).toLocaleDateString()}</td>
                <td className="py-3">{new Date(i.end_date).toLocaleDateString()}</td>
              </tr>
            ))}
            {investments.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No investments</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminInvestments;
