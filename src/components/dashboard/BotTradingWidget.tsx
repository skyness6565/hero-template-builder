import { Bot } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useState } from "react";

const initialBots = [
  { name: "AI Scalper Bot", roi: "+12.4%", trades: 342, active: true },
  { name: "Trend Follower", roi: "+8.7%", trades: 128, active: true },
  { name: "Grid Bot Pro", roi: "-2.1%", trades: 89, active: false },
];

const BotTradingWidget = () => {
  const [bots, setBots] = useState(initialBots);

  const toggle = (idx: number) =>
    setBots((prev) => prev.map((b, i) => (i === idx ? { ...b, active: !b.active } : b)));

  return (
    <div className="glass-card rounded-xl p-5">
      <h3 className="font-heading font-semibold text-foreground text-sm mb-4">Trading Bots</h3>
      <div className="space-y-3">
        {bots.map((bot, i) => (
          <div key={i} className="flex items-center gap-3 py-2.5 border-b border-border/30 last:border-0">
            <div className="h-9 w-9 rounded-lg bg-primary/15 flex items-center justify-center">
              <Bot size={16} className="text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">{bot.name}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span className={bot.roi.startsWith("+") ? "text-chart-green" : "text-chart-red"}>
                  ROI: {bot.roi}
                </span>
                <span>{bot.trades} trades</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-[10px] font-medium ${bot.active ? "text-chart-green" : "text-muted-foreground"}`}>
                {bot.active ? "Active" : "Paused"}
              </span>
              <Switch checked={bot.active} onCheckedChange={() => toggle(i)} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BotTradingWidget;
