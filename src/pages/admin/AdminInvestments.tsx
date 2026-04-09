import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Zap } from "lucide-react";

interface Inv {
  id: string;
  user_id: string;
  amount: number;
  expected_return: number;
  status: string;
  start_date: string;
  end_date: string;
  roi_speed_multiplier: number;
  display_name?: string;
  plan_name?: string;
}

const AdminInvestments = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [investments, setInvestments] = useState<Inv[]>([]);
  const [speedEdit, setSpeedEdit] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchInvestments = async () => {
    const { data } = await supabase.from("user_investments").select("*, investment_plans(name)").order("created_at", { ascending: false });
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
    const pMap = new Map((profiles || []).map((p) => [p.user_id, p.display_name]));
    setInvestments((data || []).map((i: any) => ({
      ...i, amount: Number(i.amount), expected_return: Number(i.expected_return),
      roi_speed_multiplier: Number(i.roi_speed_multiplier || 1),
      display_name: pMap.get(i.user_id) || "Unknown",
      plan_name: i.investment_plans?.name || "—",
    })));
  };

  useEffect(() => { if (isAdmin) fetchInvestments(); }, [isAdmin]);

  const getProgress = (start: string, end: string, multiplier: number) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const elapsed = (Date.now() - s) * multiplier;
    const total = e - s;
    if (total <= 0) return 100;
    return Math.min(100, Math.max(0, (elapsed / total) * 100));
  };

  const updateSpeed = async (id: string) => {
    const val = Number(speedEdit[id]);
    if (!val || val < 1) return;
    const { error } = await supabase.from("user_investments").update({ roi_speed_multiplier: val }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Speed updated!" });
    setSpeedEdit((p) => ({ ...p, [id]: "" }));
    fetchInvestments();
  };

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
              <th className="pb-3 pr-4">Expected</th>
              <th className="pb-3 pr-4">Progress</th>
              <th className="pb-3 pr-4">Speed</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {investments.map((i) => {
              const progress = getProgress(i.start_date, i.end_date, i.roi_speed_multiplier);
              return (
                <tr key={i.id} className="border-b border-border/10">
                  <td className="py-3 pr-4">{i.display_name}</td>
                  <td className="py-3 pr-4">{i.plan_name}</td>
                  <td className="py-3 pr-4">${i.amount.toLocaleString()}</td>
                  <td className="py-3 pr-4">${i.expected_return.toLocaleString()}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-chart-green rounded-full transition-all" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs">{progress.toFixed(1)}%</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="text-xs font-medium">{i.roi_speed_multiplier}x</span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${i.status === "active" ? "bg-green-500/20 text-green-400" : "bg-muted text-muted-foreground"}`}>{i.status}</span>
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-1">
                      <Input
                        type="number" min="1" step="0.5" placeholder="x"
                        value={speedEdit[i.id] || ""}
                        onChange={(e) => setSpeedEdit((p) => ({ ...p, [i.id]: e.target.value }))}
                        className="w-16 h-7 text-xs"
                      />
                      <Button size="sm" variant="outline" className="h-7 px-2" onClick={() => updateSpeed(i.id)}>
                        <Zap size={12} />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
            {investments.length === 0 && <tr><td colSpan={8} className="py-8 text-center text-muted-foreground">No investments</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminInvestments;
