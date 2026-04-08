import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const generateData = (base: number, points: number) =>
  Array.from({ length: points }, (_, i) => ({
    time: i,
    price: base + (Math.random() - 0.48) * base * 0.02 * i,
  }));

const coins = {
  BTC: { price: 71284.3, change: -2.4, base: 71000 },
  ETH: { price: 2105.18, change: -1.8, base: 2100 },
};

const timeFilters = ["1H", "24H", "7D", "1M"] as const;

const LiveChartWidget = () => {
  const [coin, setCoin] = useState<"BTC" | "ETH">("BTC");
  const [tf, setTf] = useState<(typeof timeFilters)[number]>("24H");
  const info = coins[coin];
  const isUp = info.change >= 0;
  const color = isUp ? "hsl(142 71% 45%)" : "hsl(0 84% 60%)";

  const data = useMemo(
    () => generateData(info.base, tf === "1H" ? 12 : tf === "24H" ? 24 : tf === "7D" ? 7 : 30),
    [coin, tf, info.base]
  );

  return (
    <div className="glass-card rounded-xl p-5 col-span-full lg:col-span-2">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-3">
          <div className="flex bg-muted rounded-lg p-0.5">
            {(["BTC", "ETH"] as const).map((c) => (
              <button
                key={c}
                onClick={() => setCoin(c)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  coin === c ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div>
            <span className="text-lg font-heading font-bold text-foreground">
              ${info.price.toLocaleString()}
            </span>
            <span className={`ml-2 text-sm font-medium ${isUp ? "text-chart-green" : "text-chart-red"}`}>
              {isUp ? "+" : ""}{info.change}%
            </span>
          </div>
        </div>
        <div className="flex bg-muted rounded-lg p-0.5">
          {timeFilters.map((t) => (
            <button
              key={t}
              onClick={() => setTf(t)}
              className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
                tf === t ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="h-48 md:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <XAxis dataKey="time" hide />
            <YAxis hide domain={["auto", "auto"]} />
            <Tooltip
              contentStyle={{
                background: "hsl(220 45% 10%)",
                border: "1px solid hsl(220 30% 18%)",
                borderRadius: "8px",
                fontSize: "12px",
                color: "hsl(210 20% 95%)",
              }}
              formatter={(v: number) => [`$${v.toFixed(2)}`, coin]}
              labelFormatter={() => ""}
            />
            <Line
              type="monotone"
              dataKey="price"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: color }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LiveChartWidget;
