import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import useAdmin from "@/hooks/useAdmin";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Wallet, Trash2, Plus } from "lucide-react";

interface WalletAddr {
  id: string;
  crypto_type: string;
  address: string;
  label: string | null;
}

const AdminWallets = () => {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [wallets, setWallets] = useState<WalletAddr[]>([]);
  const [editId, setEditId] = useState<string | null>(null);
  const [editAddr, setEditAddr] = useState("");
  const [newCrypto, setNewCrypto] = useState("BTC");
  const [newAddress, setNewAddress] = useState("");
  const [newLabel, setNewLabel] = useState("");

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
    if (!authLoading && !adminLoading && !isAdmin) navigate("/dashboard");
  }, [user, authLoading, isAdmin, adminLoading, navigate]);

  const fetchWallets = async () => {
    const { data } = await supabase.from("wallet_addresses").select("*").order("created_at", { ascending: true });
    if (data) setWallets(data);
  };

  useEffect(() => { if (isAdmin) fetchWallets(); }, [isAdmin]);

  const addWallet = async () => {
    if (!newAddress.trim()) return;
    const { error } = await supabase.from("wallet_addresses").insert({ crypto_type: newCrypto, address: newAddress, label: newLabel || null });
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Wallet added!" });
    setNewAddress(""); setNewLabel("");
    fetchWallets();
  };

  const updateAddress = async (id: string) => {
    const { error } = await supabase.from("wallet_addresses").update({ address: editAddr }).eq("id", id);
    if (error) { toast({ title: "Error", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Updated!" });
    setEditId(null);
    fetchWallets();
  };

  const deleteWallet = async (id: string) => {
    await supabase.from("wallet_addresses").delete().eq("id", id);
    toast({ title: "Deleted!" });
    fetchWallets();
  };

  if (authLoading || adminLoading) return null;

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 mb-6">
        <Wallet size={24} className="text-primary" />
        <h1 className="text-2xl font-bold font-heading">Wallet Addresses</h1>
      </div>

      {/* Add new wallet */}
      <div className="glass-card rounded-xl p-4 mb-6 flex flex-wrap gap-3 items-end">
        <div>
          <label className="text-xs text-muted-foreground">Crypto</label>
          <select value={newCrypto} onChange={(e) => setNewCrypto(e.target.value)}
            className="block w-24 h-9 rounded-md border border-border bg-background px-2 text-sm">
            <option>BTC</option><option>ETH</option><option>USDT</option><option>SOL</option><option>USDC</option>
          </select>
        </div>
        <div className="flex-1 min-w-[200px]">
          <label className="text-xs text-muted-foreground">Address</label>
          <Input value={newAddress} onChange={(e) => setNewAddress(e.target.value)} placeholder="Wallet address" className="h-9" />
        </div>
        <div className="w-32">
          <label className="text-xs text-muted-foreground">Label</label>
          <Input value={newLabel} onChange={(e) => setNewLabel(e.target.value)} placeholder="Label" className="h-9" />
        </div>
        <Button size="sm" onClick={addWallet}><Plus size={16} className="mr-1" />Add</Button>
      </div>

      {/* Wallet list */}
      <div className="space-y-3">
        {wallets.map((w) => (
          <div key={w.id} className="glass-card rounded-xl p-4 flex items-center gap-4 flex-wrap">
            <span className="text-xs font-bold bg-primary/20 text-primary px-2 py-1 rounded">{w.crypto_type}</span>
            {editId === w.id ? (
              <>
                <Input value={editAddr} onChange={(e) => setEditAddr(e.target.value)} className="flex-1 h-8" />
                <Button size="sm" onClick={() => updateAddress(w.id)}>Save</Button>
                <Button size="sm" variant="outline" onClick={() => setEditId(null)}>Cancel</Button>
              </>
            ) : (
              <>
                <code className="flex-1 text-sm text-foreground break-all">{w.address}</code>
                <span className="text-xs text-muted-foreground">{w.label}</span>
                <Button size="sm" variant="outline" onClick={() => { setEditId(w.id); setEditAddr(w.address); }}>Edit</Button>
                <Button size="sm" variant="destructive" onClick={() => deleteWallet(w.id)}><Trash2 size={14} /></Button>
              </>
            )}
          </div>
        ))}
      </div>
    </AdminLayout>
  );
};

export default AdminWallets;
