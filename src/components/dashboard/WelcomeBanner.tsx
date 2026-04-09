import { useAuth } from "@/contexts/AuthContext";
import { Rocket, CircleDot } from "lucide-react";
import { Button } from "@/components/ui/button";

const WelcomeBanner = () => {
  const { user } = useAuth();
  const name = user?.user_metadata?.display_name || user?.email?.split("@")[0] || "Trader";

  return (
    <div className="relative overflow-hidden rounded-xl p-6 bg-gradient-to-br from-card via-card/80 to-primary/10 border border-border/50">
      <div className="flex items-center gap-2 mb-3">
        <CircleDot size={10} className="text-chart-green" />
        <span className="text-xs font-medium text-chart-green">Markets Open</span>
      </div>
      <h2 className="text-2xl md:text-3xl font-heading font-bold text-foreground mb-2">
        Welcome back, {name}! <Rocket className="inline h-6 w-6" />
      </h2>
      <p className="text-sm text-muted-foreground mb-4">
        Your journey to <span className="text-chart-green font-medium">financial freedom</span> starts here. Start trading today and watch your wealth grow!
      </p>
      <Button className="bg-gradient-to-r from-primary to-blue-500 hover:from-primary/90 hover:to-blue-500/90 glow-blue text-primary-foreground font-semibold gap-2">
        <CircleDot size={14} />
        Make a Deposit & Start Earning
      </Button>
    </div>
  );
};

export default WelcomeBanner;
