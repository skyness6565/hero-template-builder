import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface UserRow {
  user_id: string;
  display_name: string | null;
  balance: number;
  bonus: number;
  total_deposits: number;
  total_withdrawals: number;
  total_profit: number;
}

const AdminUsers = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [users, setUsers] = useState<UserRow[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<Partial<UserRow>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const copyId = (id: string) => {
    navigator.clipboard.writeText(id);
    setCopiedId(id);
    toast({ title: "User ID copied" });
    setTimeout(() => setCopiedId(null), 1500);
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchUsers = async () => {
    const { data: balances } = await supabase.from("user_balances").select("*");
    const { data: profiles } = await supabase.from("profiles").select("user_id, display_name");
    if (!balances) return;
    const profileMap = new Map((profiles || []).map((p) => [p.user_id, p.display_name]));
    setUsers(balances.map((b) => ({
      user_id: b.user_id,
      display_name: profileMap.get(b.user_id) || "Unknown",
      balance: Number(b.balance),
      bonus: Number(b.bonus),
      total_deposits: Number(b.total_deposits),
      total_withdrawals: Number(b.total_withdrawals),
      total_profit: Number(b.total_profit),
    })));
  };

  useEffect(() => { if (isAdmin) fetchUsers(); }, [isAdmin]);

  const startEdit = (u: UserRow) => {
    setEditId(u.user_id);
    setEditValues({ balance: u.balance, bonus: u.bonus, total_deposits: u.total_deposits, total_withdrawals: u.total_withdrawals, total_profit: u.total_profit });
  };

  const saveEdit = async () => {
    if (!editId) return;
    const { error } = await supabase.from("user_balances").update({
      balance: editValues.balance,
      bonus: editValues.bonus,
      total_deposits: editValues.total_deposits,
      total_withdrawals: editValues.total_withdrawals,
      total_profit: editValues.total_profit,
    }).eq("user_id", editId);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated!" });
    setEditId(null);
    fetchUsers();
  };

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold font-heading mb-2">Users & Balances</h1>
      <p className="text-sm text-muted-foreground mb-6">Click the copy icon next to a User ID to use it in the Notifications page.</p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border/30 text-left text-muted-foreground">
              <th className="pb-3 pr-4">User</th>
              <th className="pb-3 pr-4">User ID</th>
              <th className="pb-3 pr-4">Balance</th>
              <th className="pb-3 pr-4">Bonus</th>
              <th className="pb-3 pr-4">Deposits</th>
              <th className="pb-3 pr-4">Withdrawals</th>
              <th className="pb-3 pr-4">Profit</th>
              <th className="pb-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.user_id} className="border-b border-border/10">
                <td className="py-3 pr-4 font-medium">{u.display_name}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-muted px-2 py-1 rounded font-mono">
                      {u.user_id.slice(0, 8)}...{u.user_id.slice(-4)}
                    </code>
                    <button
                      onClick={() => copyId(u.user_id)}
                      className="text-muted-foreground hover:text-primary transition-colors"
                      aria-label="Copy User ID"
                      title={u.user_id}
                    >
                      {copiedId === u.user_id ? <Check size={14} className="text-chart-green" /> : <Copy size={14} />}
                    </button>
                  </div>
                </td>
                {editId === u.user_id ? (
                  <>
                    {(["balance", "bonus", "total_deposits", "total_withdrawals", "total_profit"] as const).map((f) => (
                      <td key={f} className="py-3 pr-4">
                        <Input type="number" className="w-28 h-8" value={editValues[f] ?? ""} onChange={(e) => setEditValues({ ...editValues, [f]: Number(e.target.value) })} />
                      </td>
                    ))}
                    <td className="py-3 flex gap-2">
                      <Button size="sm" onClick={saveEdit}>Save</Button>
                      <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="py-3 pr-4">${u.balance.toLocaleString()}</td>
                    <td className="py-3 pr-4">${u.bonus.toLocaleString()}</td>
                    <td className="py-3 pr-4">${u.total_deposits.toLocaleString()}</td>
                    <td className="py-3 pr-4">${u.total_withdrawals.toLocaleString()}</td>
                    <td className="py-3 pr-4">${u.total_profit.toLocaleString()}</td>
                    <td className="py-3">
                      <Button size="sm" variant="outline" onClick={() => startEdit(u)}>Edit</Button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
};

export default AdminUsers;
