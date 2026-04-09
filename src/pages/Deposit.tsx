import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Download, Bitcoin, CircleDollarSign, Coins, Copy } from "lucide-react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const cryptoOptions = [
  { value: "BTC", label: "Bitcoin (BTC)", icon: Bitcoin },
  { value: "ETH", label: "Ethereum (ETH)", icon: Coins },
  { value: "USDT", label: "Tether (USDT)", icon: CircleDollarSign },
];

const Deposit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [crypto, setCrypto] = useState("BTC");
  const [loading, setLoading] = useState(false);
  const [wallets, setWallets] = useState<Record<string, string>>({});

  useEffect(() => {
    supabase.from("wallet_addresses").select("crypto_type, address").then(({ data }) => {
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((w: any) => { map[w.crypto_type] = w.address; });
        setWallets(map);
      }
    });
  }, []);

  const copyAddress = () => {
    const addr = wallets[crypto];
    if (addr) {
      navigator.clipboard.writeText(addr);
      toast({ title: "Copied!", description: "Wallet address copied to clipboard." });
    }
  };

  const handleDeposit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !amount || Number(amount) <= 0) return;
    setLoading(true);
    try {
      const { error } = await supabase.from("transactions").insert({
        user_id: user.id, type: "deposit", amount: Number(amount),
        crypto_type: crypto, status: "pending",
        description: `Deposit ${amount} via ${crypto}`,
      });
      if (error) throw error;
      toast({ title: "Deposit submitted!", description: "Your deposit is pending confirmation." });
      setAmount("");
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally { setLoading(false); }
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="h-10 w-10 rounded-lg bg-primary/20 flex items-center justify-center">
            <Download size={20} className="text-primary" />
          </div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Deposit Funds</h1>
        </div>

        <div className="glass-card rounded-xl p-6">
          <form onSubmit={handleDeposit} className="space-y-5">
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <Input type="number" min="1" step="0.01" value={amount}
                onChange={(e) => setAmount(e.target.value)} placeholder="Enter amount" required />
            </div>

            <div className="space-y-2">
              <Label>Select Cryptocurrency</Label>
              <div className="grid grid-cols-3 gap-3">
                {cryptoOptions.map((opt) => (
                  <button key={opt.value} type="button" onClick={() => setCrypto(opt.value)}
                    className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all ${
                      crypto === opt.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"
                    }`}>
                    <opt.icon size={24} />
                    <span className="text-xs font-medium">{opt.value}</span>
                  </button>
                ))}
              </div>
            </div>

            {wallets[crypto] && (
              <div className="space-y-2">
                <Label>Send {crypto} to this address</Label>
                <div className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border">
                  <code className="flex-1 text-xs break-all text-foreground">{wallets[crypto]}</code>
                  <button type="button" onClick={copyAddress} className="text-primary hover:text-primary/80">
                    <Copy size={16} />
                  </button>
                </div>
              </div>
            )}

            <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-primary to-blue-500 glow-blue text-primary-foreground font-semibold">
              {loading ? "Processing..." : "Submit Deposit"}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Deposit;
