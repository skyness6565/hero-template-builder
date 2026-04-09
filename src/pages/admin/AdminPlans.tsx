import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2 } from "lucide-react";

interface Plan {
  id: string;
  name: string;
  description: string | null;
  min_amount: number;
  max_amount: number;
  roi_percentage: number;
  duration_days: number;
  status: string;
}

const emptyPlan = { name: "", description: "", min_amount: 100, max_amount: 10000, roi_percentage: 5, duration_days: 30 };

const AdminPlans = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyPlan);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchPlans = async () => {
    const { data } = await supabase.from("investment_plans").select("*").order("created_at");
    setPlans((data || []).map((p) => ({ ...p, min_amount: Number(p.min_amount), max_amount: Number(p.max_amount), roi_percentage: Number(p.roi_percentage) })));
  };

  useEffect(() => { if (isAdmin) fetchPlans(); }, [isAdmin]);

  const createPlan = async () => {
    const { error } = await supabase.from("investment_plans").insert(form);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Plan created!" });
    setForm(emptyPlan);
    setShowForm(false);
    fetchPlans();
  };

  const deletePlan = async (id: string) => {
    const { error } = await supabase.from("investment_plans").delete().eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Plan deleted" });
    fetchPlans();
  };

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Investment Plans</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" />{showForm ? "Cancel" : "New Plan"}</Button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6 border border-border/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Min Amount</Label><Input type="number" value={form.min_amount} onChange={(e) => setForm({ ...form, min_amount: Number(e.target.value) })} /></div>
          <div><Label>Max Amount</Label><Input type="number" value={form.max_amount} onChange={(e) => setForm({ ...form, max_amount: Number(e.target.value) })} /></div>
          <div><Label>ROI %</Label><Input type="number" value={form.roi_percentage} onChange={(e) => setForm({ ...form, roi_percentage: Number(e.target.value) })} /></div>
          <div><Label>Duration (days)</Label><Input type="number" value={form.duration_days} onChange={(e) => setForm({ ...form, duration_days: Number(e.target.value) })} /></div>
          <div className="sm:col-span-2"><Button onClick={createPlan} className="w-full">Create Plan</Button></div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left text-muted-foreground">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Min</th>
              <th className="pb-3 pr-4">Max</th>
              <th className="pb-3 pr-4">ROI %</th>
              <th className="pb-3 pr-4">Days</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {plans.map((p) => (
              <tr key={p.id} className="border-b border-border/10">
                <td className="py-3 pr-4 font-medium">{p.name}</td>
                <td className="py-3 pr-4">${p.min_amount}</td>
                <td className="py-3 pr-4">${p.max_amount}</td>
                <td className="py-3 pr-4">{p.roi_percentage}%</td>
                <td className="py-3 pr-4">{p.duration_days}</td>
                <td className="py-3">
                  <Button size="sm" variant="destructive" onClick={() => deletePlan(p.id)}><Trash2 size={14} /></Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminPlans;
