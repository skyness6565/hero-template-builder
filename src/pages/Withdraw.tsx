import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload, ShieldAlert, ShieldCheck, Clock } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useUserBalance from "@/hooks/useUserBalance";

const Withdraw = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance } = useUserBalance();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);
  const [kycStatus, setKycStatus] = useState<"approved" | "pending" | "rejected" | "none" | "loading">("loading");

  useEffect(() => {
    const load = async () => {
      if (!user) return;
      const { data } = await supabase
        .from("kyc_verifications")
        .select("status")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      if (!data) setKycStatus("none");
      else setKycStatus(data.status as any);
    };
    load();
  }, [user]);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (kycStatus !== "approved") {
      toast({ title: "KYC required", description: "Please complete KYC verification first.", variant: "destructive" });
      return;
    }
    const amt = Number(amount);
    if (amt <= 0 || amt > balance) {
      toast({ title: "Invalid amount", description: amt > balance ? "Insufficient balance" : "Enter a valid amount", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id,
        type: "withdrawal",
        amount: amt,
        wallet_address: wallet,
        status: "pending",
        description: `Withdrawal of $${amt}`,
      });
      if (error) throw error;
      toast({ title: "Withdrawal submitted!", description: "Your withdrawal is being processed." });
      setAmount("");
      setWallet("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const renderKycGate = () => {
    if (kycStatus === "loading") return null;
    if (kycStatus === "approved") return null;

    const isPending = kycStatus === "pending";
    const isRejected = kycStatus === "rejected";

    return (
      <div className="glass-card rounded-xl p-6 border-2 border-chart-red/40 mb-6">
        <div className="flex items-start gap-4">
          <div className={`h-12 w-12 rounded-full flex items-center justify-center shrink-0 ${
            isPending ? "bg-yellow-500/15" : "bg-chart-red/15"
          }`}>
            {isPending ? (
              <Clock className="text-yellow-500" size={22} />
            ) : (
              <ShieldAlert className="text-chart-red" size={22} />
            )}
          </div>
          <div className="flex-1">
            <h3 className="font-heading text-lg font-bold text-foreground mb-1">
              {isPending
                ? "KYC Verification Pending"
                : isRejected
                ? "KYC Verification Rejected"
                : "KYC Verification Required"}
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              {isPending
                ? "Your ID documents are being reviewed by our team. Withdrawals will be enabled once your KYC is approved."
                : isRejected
                ? "Your previous KYC submission was rejected. Please re-submit valid documents to enable withdrawals."
                : "For security and compliance, you must complete identity verification (KYC) before you can withdraw funds."}
            </p>
            {!isPending && (
              <Link to="/dashboard/kyc">
                <Button className="bg-primary hover:bg-primary/90">
                  <ShieldCheck size={16} className="mr-2" />
                  {isRejected ? "Re-submit KYC" : "Complete KYC Verification"}
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    );
  };

  const blocked = kycStatus !== "approved" && kycStatus !== "loading";

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-chart-red/20 flex items-center justify-center">
            <Upload size={20} className="text-chart-red" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Withdraw Funds</h1>
        </div>

        {renderKycGate()}

        <div className={`glass-card rounded-xl p-6 ${blocked ? "opacity-60 pointer-events-none" : ""}`}>
          <div className="mb-4 p-3 rounded-lg bg-muted/50 text-sm">
            Available Balance: <span className="font-bold text-foreground">${balance.toFixed(2)}</span>
          </div>

          <form onSubmit={handleWithdraw} className="space-y-5">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input
                type="number" min="1" step="0.01"
                value={amount} onChange={(e) => setAmount(e.target.value)}
                placeholder="Enter amount" required
                disabled={blocked}
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <Input
                value={wallet} onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address" required
                disabled={blocked}
              />
            </div>
            <Button type="submit" disabled={loading || blocked} className="w-full" variant="destructive">
              {loading ? "Processing..." : blocked ? "KYC Required" : "Submit Withdrawal"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
