import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";
import useUserBalance from "@/hooks/useUserBalance";

const Withdraw = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { balance } = useUserBalance();
  const [amount, setAmount] = useState("");
  const [wallet, setWallet] = useState("");
  const [loading, setLoading] = useState(false);

  const handleWithdraw = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
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

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-chart-red/20 flex items-center justify-center">
            <Upload size={20} className="text-chart-red" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Withdraw Funds</h1>
        </div>

        <div className="glass-card rounded-xl p-6">
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
              />
            </div>
            <div className="space-y-2">
              <Label>Wallet Address</Label>
              <Input
                value={wallet} onChange={(e) => setWallet(e.target.value)}
                placeholder="Enter wallet address" required
              />
            </div>
            <Button type="submit" disabled={loading} className="w-full" variant="destructive">
              {loading ? "Processing..." : "Submit Withdrawal"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
