import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminLayout from "@/components/admin/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import useAdmin from "@/hooks/useAdmin";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import { ShieldCheck, Check, X } from "lucide-react";

interface KycRow {
  id: string;
  user_id: string;
  status: string;
  front_image_url: string;
  back_image_url: string;
  rejection_reason: string | null;
  created_at: string;
}

const AdminKyc = () => {
  const { user } = useAuth();
  const { isAdmin, loading } = useAdmin();
  const navigate = useNavigate();
  const [items, setItems] = useState<KycRow[]>([]);
  const [signed, setSigned] = useState<Record<string, { front: string; back: string }>>({});

  useEffect(() => {
    if (!loading && !isAdmin) navigate("/dashboard");
  }, [isAdmin, loading, navigate]);

  const load = async () => {
    const { data } = await supabase
      .from("kyc_verifications")
      .select("*")
      .order("created_at", { ascending: false });
    const rows = (data as KycRow[]) ?? [];
    setItems(rows);
    const signedMap: Record<string, { front: string; back: string }> = {};
    await Promise.all(
      rows.map(async (r) => {
        const [f, b] = await Promise.all([
          supabase.storage.from("kyc-documents").createSignedUrl(r.front_image_url, 3600),
          supabase.storage.from("kyc-documents").createSignedUrl(r.back_image_url, 3600),
        ]);
        signedMap[r.id] = { front: f.data?.signedUrl ?? "", back: b.data?.signedUrl ?? "" };
      })
    );
    setSigned(signedMap);
  };

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin]);

  const review = async (id: string, status: "approved" | "rejected") => {
    let reason: string | null = null;
    if (status === "rejected") {
      reason = window.prompt("Rejection reason (optional):") || null;
    }
    const { error } = await supabase
      .from("kyc_verifications")
      .update({
        status,
        rejection_reason: reason,
        reviewed_by: user?.id,
        reviewed_at: new Date().toISOString(),
      })
      .eq("id", id);
    if (error) {
      toast({ title: "Failed", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: `KYC ${status}` });
    load();
  };

  if (loading) return null;

  return (
    <AdminLayout>
      <div className="space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">KYC Verifications</h1>
            <p className="text-sm text-muted-foreground">Review and approve user identity submissions.</p>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="bg-card border border-border/30 rounded-lg p-6 text-sm text-muted-foreground">
            No KYC submissions yet.
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {items.map((k) => (
              <div key={k.id} className="bg-card border border-border/30 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">User</p>
                    <p className="text-sm font-mono break-all">{k.user_id}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      k.status === "approved"
                        ? "bg-chart-green/15 text-chart-green"
                        : k.status === "rejected"
                        ? "bg-chart-red/15 text-chart-red"
                        : "bg-yellow-500/15 text-yellow-500"
                    }`}
                  >
                    {k.status}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Front</p>
                    {signed[k.id]?.front && (
                      <a href={signed[k.id].front} target="_blank" rel="noreferrer">
                        <img src={signed[k.id].front} alt="ID Front" className="w-full h-32 object-cover rounded border border-border/30" />
                      </a>
                    )}
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Back</p>
                    {signed[k.id]?.back && (
                      <a href={signed[k.id].back} target="_blank" rel="noreferrer">
                        <img src={signed[k.id].back} alt="ID Back" className="w-full h-32 object-cover rounded border border-border/30" />
                      </a>
                    )}
                  </div>
                </div>
                {k.rejection_reason && (
                  <p className="text-xs text-chart-red">Reason: {k.rejection_reason}</p>
                )}
                {k.status === "pending" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => review(k.id, "approved")}
                      className="flex-1 bg-chart-green/15 text-chart-green rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-chart-green/25"
                    >
                      <Check size={16} /> Approve
                    </button>
                    <button
                      onClick={() => review(k.id, "rejected")}
                      className="flex-1 bg-chart-red/15 text-chart-red rounded-lg py-2 text-sm font-medium flex items-center justify-center gap-1 hover:bg-chart-red/25"
                    >
                      <X size={16} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminKyc;
