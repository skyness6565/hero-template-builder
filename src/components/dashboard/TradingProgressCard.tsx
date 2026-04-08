import { Rocket } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const TradingProgressCard = () => {
  const progress = 74;

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-heading font-semibold text-foreground text-sm">Trading Progress</h3>
        <span className="text-chart-green font-bold text-lg">{progress}%</span>
      </div>
      <Progress value={progress} className="h-2.5 bg-muted [&>div]:bg-chart-green" />
      <div className="flex items-center gap-1.5 mt-3">
        <Rocket size={14} className="text-chart-green" />
        <span className="text-xs text-muted-foreground">Strong trading progress!</span>
      </div>
    </div>
  );
};

export default TradingProgressCard;
