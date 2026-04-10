import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from "recharts";

const generateData = (base: number, points: number) =>
  Array.from({ length: points }, (_, i) => ({
    time: i,
    price: base + (Math.random() - 0.48) * base * 0.02 * i,
  }));

const coins = {
  BTC: { price: 71284.3, change: -2.4, base: 71000 },
  ETH: { price: 2105.18, change: -1.8, base: 2100 },
  SOL: { price: 178.42, change: 3.2, base: 175 },
};

const timeFilters = ["1H", "24H", "7D", "1M"] as const;

const LiveChartWidget = () => {
  const [coin, setCoin] = useState<keyof typeof coins>("BTC");
  const [tf, setTf] = useState<(typeof timeFilters)[number]>("24H");
  const info = coins[coin];
  const isUp = info.change >= 0;
  const color = isUp ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";

  const data = useMemo(
    () => generateData(info.base, tf === "1H" ? 12 : tf === "24H" ? 24 : tf === "7D" ? 7 : 30),
    [coin, tf, info.base]
  );

  return (
    <div className="bg-card/60 backdrop-blur-sm rounded-2xl p-5 border border-border/30 h-full">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="flex bg-muted/60 rounded-lg p-0.5">
              {(Object.keys(coins) as (keyof typeof coins)[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCoin(c)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                    coin === c ? "bg-primary text-white shadow-md" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading font-bold text-foreground">
              ${info.price.toLocaleString()}
            </span>
            <span className={`text-sm font-bold ${isUp ? "text-chart-green" : "text-chart-red"}`}>
              {isUp ? "▲" : "▼"} {Math.abs(info.change)}%
            </span>
          </div>
        </div>
        <div className="flex bg-muted/60 rounded-lg p-0.5">
          {timeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-all ${
                tf === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-52 md:h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`gradient-${coin}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity={0.3} />
                <stop offset="100%" stopColor={color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "hsl(220 45% 10%)",
                border: "1px solid hsl(220 30% 18%)",
                borderRadius: "10px",
                fontSize: "12px",
                color: "hsl(210 20% 95%)",
                boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
              }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, coin]}
              labelFormatter={() => ""}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              fill={`url(#gradient-${coin})`}
              dot={false}
              activeDot={{ r: 4, fill: color, stroke: "hsl(220 45% 10%)", strokeWidth: 2 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveChartWidget;
