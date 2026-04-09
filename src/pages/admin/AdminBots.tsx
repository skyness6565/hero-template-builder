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

interface BotRow { id: string; name: string; description: string | null; roi_min: number; roi_max: number; status: string; }

const emptyBot = { name: "", description: "", roi_min: 1, roi_max: 5 };

const AdminBots = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bots, setBots] = useState<BotRow[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyBot);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchBots = async () => {
    const { data } = await supabase.from("trading_bots").select("*").order("created_at");
    setBots((data || []).map((b) => ({ ...b, roi_min: Number(b.roi_min), roi_max: Number(b.roi_max) })));
  };

  useEffect(() => { if (isAdmin) fetchBots(); }, [isAdmin]);

  const createBot = async () => {
    const { error } = await supabase.from("trading_bots").insert(form);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Bot created!" });
    setForm(emptyBot);
    setShowForm(false);
    fetchBots();
  };

  const deleteBot = async (id: string) => {
    const { error } = await supabase.from("trading_bots").update({ status: "inactive" }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Bot deactivated" });
    fetchBots();
  };

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Trading Bots</h1>
        <Button onClick={() => setShowForm(!showForm)}><Plus size={16} className="mr-2" />{showForm ? "Cancel" : "New Bot"}</Button>
      </div>

      {showForm && (
        <div className="glass-card rounded-xl p-6 mb-6 border border-border/20 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
          <div><Label>Description</Label><Input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></div>
          <div><Label>Min ROI %</Label><Input type="number" value={form.roi_min} onChange={(e) => setForm({ ...form, roi_min: Number(e.target.value) })} /></div>
          <div><Label>Max ROI %</Label><Input type="number" value={form.roi_max} onChange={(e) => setForm({ ...form, roi_max: Number(e.target.value) })} /></div>
          <div className="sm:col-span-2"><Button onClick={createBot} className="w-full">Create Bot</Button></div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left text-muted-foreground">
              <th className="pb-3 pr-4">Name</th>
              <th className="pb-3 pr-4">Description</th>
              <th className="pb-3 pr-4">ROI Range</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bots.map((b) => (
              <tr key={b.id} className="border-b border-border/10">
                <td className="py-3 pr-4 font-medium">{b.name}</td>
                <td className="py-3 pr-4 text-muted-foreground">{b.description || "—"}</td>
                <td className="py-3 pr-4">{b.roi_min}% – {b.roi_max}%</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${b.status === "active" ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}>{b.status}</span>
                </td>
                <td className="py-3">
                  {b.status === "active" && <Button size="sm" variant="destructive" onClick={() => deleteBot(b.id)}><Trash2 size={14} /></Button>}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminBots;
