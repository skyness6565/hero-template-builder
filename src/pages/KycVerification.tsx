import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CheckCircle2, Clock, XCircle, ShieldCheck } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface KycRow {
  id: string;
  status: "pending" | "approved" | "rejected";
  rejection_reason: string | null;
  created_at: string;
}

const KycVerification = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const [kyc, setKyc] = useState<KycRow | null>(null);
  const [front, setFront] = useState<File | null>(null);
  const [back, setBack] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (!loading && !user) navigate("/auth");
  }, [user, loading, navigate]);

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("kyc_verifications")
        .select("id,status,rejection_reason,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setKyc(data as KycRow | null);
      setFetching(false);
    };
    load();
  }, [user]);

  const upload = async (file: File, side: "front" | "back") => {
    const ext = file.name.split(".").pop();
    const path = `${user!.id}/${side}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from("kyc-documents").upload(path, file, { upsert: true });
    if (error) throw error;
    return path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !front || !back) {
      toast({ title: "Missing files", description: "Please upload both front and back of your ID.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      const [frontPath, backPath] = await Promise.all([upload(front, "front"), upload(back, "back")]);
      const { error } = await supabase.from("kyc_verifications").insert({
        user_id: user.id,
        front_image_url: frontPath,
        back_image_url: backPath,
        status: "pending",
      });
      if (error) throw error;
      toast({ title: "KYC submitted", description: "Your verification is pending admin review." });
      const { data } = await supabase
        .from("kyc_verifications")
        .select("id,status,rejection_reason,created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      setKyc(data as KycRow | null);
      setFront(null);
      setBack(null);
    } catch (err: any) {
      toast({ title: "Upload failed", description: err.message, variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || fetching) return null;

  const showForm = !kyc || kyc.status === "rejected";

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/15 flex items-center justify-center">
            <ShieldCheck className="text-primary" size={20} />
          </div>
          <div>
            <h1 className="text-xl font-bold">KYC Verification</h1>
            <p className="text-sm text-muted-foreground">Verify your identity to unlock all features.</p>
          </div>
        </div>

        {kyc?.status === "pending" && (
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4 flex items-start gap-3">
            <Clock className="text-yellow-500 shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-foreground">Pending review</p>
              <p className="text-sm text-muted-foreground">Your documents are being reviewed by our admin team.</p>
            </div>
          </div>
        )}

        {kyc?.status === "approved" && (
          <div className="bg-chart-green/10 border border-chart-green/30 rounded-lg p-4 flex items-start gap-3">
            <CheckCircle2 className="text-chart-green shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-foreground">Verified</p>
              <p className="text-sm text-muted-foreground">Your identity has been verified successfully.</p>
            </div>
          </div>
        )}

        {kyc?.status === "rejected" && (
          <div className="bg-chart-red/10 border border-chart-red/30 rounded-lg p-4 flex items-start gap-3">
            <XCircle className="text-chart-red shrink-0 mt-0.5" size={20} />
            <div>
              <p className="font-semibold text-foreground">Rejected</p>
              {kyc.rejection_reason && <p className="text-sm text-muted-foreground">Reason: {kyc.rejection_reason}</p>}
              <p className="text-sm text-muted-foreground mt-1">Please re-submit your documents below.</p>
            </div>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleSubmit} className="bg-card border border-border/30 rounded-lg p-5 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">ID Card — Front</label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-6 cursor-pointer hover:border-primary transition-colors">
                <Upload size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{front ? front.name : "Click to upload front"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setFront(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">ID Card — Back</label>
              <label className="flex items-center justify-center gap-2 border-2 border-dashed border-border rounded-lg py-6 cursor-pointer hover:border-primary transition-colors">
                <Upload size={18} className="text-muted-foreground" />
                <span className="text-sm text-muted-foreground">{back ? back.name : "Click to upload back"}</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setBack(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <button
              type="submit"
              disabled={submitting || !front || !back}
              className="w-full bg-primary text-primary-foreground rounded-lg py-2.5 font-medium disabled:opacity-50"
            >
              {submitting ? "Submitting..." : "Submit for Verification"}
            </button>
          </form>
        )}
      </div>
    </DashboardLayout>
  );
};

export default KycVerification;
