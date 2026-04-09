import useCryptoPrices from "@/hooks/useCryptoPrices";
import { Bitcoin, CircleDollarSign } from "lucide-react";

const LivePriceTicker = () => {
  const { btc, eth } = useCryptoPrices();

  return (
    <div className="flex items-center gap-4 text-sm">
      <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
        <Bitcoin size={16} className="text-yellow-500" />
        <span className="text-muted-foreground">BTC</span>
        <span className={`font-bold ${btc.change24h >= 0 ? 'text-chart-green' : 'text-chart-red'}`}>
          ${btc.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <span className={`text-xs ${btc.change24h >= 0 ? 'text-chart-green' : 'text-chart-red'}`}>
          {btc.change24h >= 0 ? '+' : ''}{btc.change24h.toFixed(1)}%
        </span>
      </div>
      <div className="flex items-center gap-2 glass-card rounded-lg px-3 py-2">
        <CircleDollarSign size={16} className="text-blue-400" />
        <span className="text-muted-foreground">ETH</span>
        <span className={`font-bold ${eth.change24h >= 0 ? 'text-chart-green' : 'text-chart-red'}`}>
          ${eth.price.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </span>
        <span className={`text-xs ${eth.change24h >= 0 ? 'text-chart-green' : 'text-chart-red'}`}>
          {eth.change24h >= 0 ? '+' : ''}{eth.change24h.toFixed(1)}%
        </span>
      </div>
    </div>
  );
};

export default LivePriceTicker;
