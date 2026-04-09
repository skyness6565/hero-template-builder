import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Tx {
  id: string;
  user_id: string;
  type: string;
  amount: number;
  status: string;
  crypto_type: string | null;
  created_at: string;
  display_name?: string;
}

const AdminTransactions = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [txs, setTxs] = useState<Tx[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchTxs = async () => {
    let q = supabase.from("transactions").select("*").order("created_at", { ascending: false });
    if (filter !== "all") q = q.eq("status", filter);
    const { data } = await q;
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
    const pMap = new Map((profiles || []).map((p) => [p.user_id, p.display_name]));
    setTxs((data || []).map((t) => ({ ...t, amount: Number(t.amount), display_name: pMap.get(t.user_id) || "Unknown" })));
  };

  useEffect(() => { if (isAdmin) fetchTxs(); }, [isAdmin, filter]);

  const updateStatus = async (id: string, status: string) => {
    const { error } = await supabase.from("transactions").update({ status }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: `Transaction ${status}` });
    fetchTxs();
  };

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-heading">Transactions</h1>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="failed">Failed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left text-muted-foreground">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">Type</th>
              <th className="pb-3 pr-4">Amount</th>
              <th className="pb-3 pr-4">Crypto</th>
              <th className="pb-3 pr-4">Status</th>
              <th className="pb-3 pr-4">Date</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {txs.map((t) => (
              <tr key={t.id} className="border-b border-border/10">
                <td className="py-3 pr-4">{t.display_name}</td>
                <td className="py-3 pr-4 capitalize">{t.type}</td>
                <td className="py-3 pr-4">${t.amount.toLocaleString()}</td>
                <td className="py-3 pr-4">{t.crypto_type || "—"}</td>
                <td className="py-3 pr-4">
                  <span className={`px-2 py-1 rounded-full text-xs ${t.status === "completed" ? "bg-green-500/20 text-green-400" : t.status === "pending" ? "bg-yellow-500/20 text-yellow-400" : "bg-red-500/20 text-red-400"}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-3 pr-4">{new Date(t.created_at).toLocaleDateString()}</td>
                <td className="py-3 flex gap-2">
                  {t.status === "pending" && (
                    <>
                      <Button size="sm" onClick={() => updateStatus(t.id, "completed")} className="bg-green-600 hover:bg-green-700 text-white">Approve</Button>
                      <Button size="sm" variant="destructive" onClick={() => updateStatus(t.id, "failed")}>Reject</Button>
                    </>
                  )}
                </td>
              </tr>
            ))}
            {txs.length === 0 && <tr><td colSpan={7} className="py-8 text-center text-muted-foreground">No transactions found</td></tr>}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminTransactions;
