import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Copy, Check } from "lucide-react";

const WelcomeSection = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Trader";

  const copyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast({ title: "User ID copied" });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="px-4 pt-6 pb-2 md:px-6">
      <h1 className="text-2xl md:text-3xl font-heading font-bold text-foreground">
        Welcome back, <span className="text-primary">{name}</span>!
      </h1>
      <p className="text-muted-foreground text-sm mt-1">Your investment dashboard overview</p>
      {user?.id && (
        <div className="mt-2 inline-flex items-center gap-2 bg-muted/50 border border-border/40 rounded-lg px-3 py-1.5">
          <span className="text-xs text-muted-foreground">User ID:</span>
          <code className="text-xs font-mono text-foreground/80">
            {user.id.slice(0, 8)}...{user.id.slice(-4)}
          </code>
          <button
            onClick={copyId}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Copy User ID"
            title={user.id}
          >
            {copied ? <Check size={14} className="text-chart-green" /> : <Copy size={14} />}
          </button>
        </div>
      )}
    </div>
  );
};

export default WelcomeSection;
