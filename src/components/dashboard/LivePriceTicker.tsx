import useCryptoPrices from "@/hooks/useCryptoPrices";
import { Bitcoin, CircleDollarSign, TrendingUp, TrendingDown } from "lucide-react";

const LivePriceTicker = () => {
  const { btc, eth } = useCryptoPrices();

  const tickers = [
    { symbol: "BTC", name: "Bitcoin", icon: Bitcoin, iconColor: "text-yellow-400", ...btc },
    { symbol: "ETH", name: "Ethereum", icon: CircleDollarSign, iconColor: "text-blue-400", ...eth },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1">
      {tickers.map((t) => {
        const isUp = t.change24h >= 0;
        return (
          <div key={t.symbol} className="flex items-center gap-3 bg-card/60 backdrop-blur-sm rounded-xl px-4 py-2.5 border border-border/30 min-w-fit">
            <div className={`h-8 w-8 rounded-lg bg-muted/50 flex items-center justify-center`}>
              <t.icon size={16} className={t.iconColor} />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-heading font-bold text-foreground">
                  ${t.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </span>
                <span className={`text-xs font-semibold flex items-center gap-0.5 ${isUp ? 'text-chart-green' : 'text-chart-red'}`}>
                  {isUp ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                  {isUp ? '+' : ''}{t.change24h.toFixed(1)}%
                </span>
              </div>
              <p className="text-[10px] text-muted-foreground">{t.symbol}/USD</p>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default LivePriceTicker;
