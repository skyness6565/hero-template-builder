import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { TrendingUp, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeBanner = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Trader";

  return (
    <div className="relative overflow-hidden rounded-2xl p-5 md:p-6 bg-gradient-to-r from-primary/20 via-card to-card border border-primary/20">
      {/* Background decoration */}
      <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 blur-2xl" />
      <div className="absolute right-10 bottom-0 h-20 w-20 rounded-full bg-chart-green/5 blur-xl" />
      
      <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="h-2 w-2 rounded-full bg-chart-green animate-pulse" />
            <span className="text-xs font-medium text-chart-green">Live Trading</span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-foreground">
            Welcome back, <span className="text-primary">{name}</span>!
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Your trading dashboard is ready. Start investing today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate("/dashboard/deposit")}
            className="bg-gradient-to-r from-chart-green to-emerald-500 hover:from-chart-green/90 hover:to-emerald-500/90 text-white font-semibold gap-2 shadow-lg shadow-chart-green/20"
          >
            <TrendingUp size={16} />
            Start Investing
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard/plans")}
            className="border-border/50 text-muted-foreground hover:text-foreground gap-1"
          >
            View Plans <ArrowRight size={14} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WelcomeBanner;
