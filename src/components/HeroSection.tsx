import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import heroImg from "@/assets/hero-trading.jpg";

const stats = [
  { value: "50K+", label: "Active Traders" },
  { value: "$2B+", label: "Daily Volume" },
  { value: "99.9%", label: "Uptime" },
];

const HeroSection = () => {
  const navigate = useNavigate();
  return (
  <section id="home" className="relative pt-28 pb-20 overflow-hidden">
    <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
    <div className="container mx-auto px-4">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6">
            <TrendingUp size={14} /> Trade with confidence
          </span>

          <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6 font-heading">
            Get more <span className="text-gradient-primary">freedom</span> in the markets.
          </h1>

          <p className="text-muted-foreground text-lg mb-8 max-w-lg">
            Trade Cryptocurrencies, Stock Indexes, Commodities and Forex with tight spreads and low commissions.
          </p>

          <div className="flex flex-wrap gap-4 mb-10">
            <Button size="lg" className="gap-2" onClick={() => navigate("/auth")}>
              Login Account <ArrowRight size={16} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
              Open Account
            </Button>
          </div>

          <div className="flex gap-10 border-t border-border pt-6">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-2xl font-bold font-heading">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <img
            src={heroImg}
            alt="Trading floor with market displays"
            width={1280}
            height={720}
            className="rounded-xl"
          />
          {/* Floating chart card */}
          <div className="absolute -bottom-6 -left-6 glass-card rounded-xl p-5 glow-primary max-w-[280px]">
            <div className="flex justify-between items-center mb-3">
              <span className="font-heading font-semibold">BTC/USD</span>
              <span className="text-sm font-semibold text-primary">+5.24%</span>
            </div>
            <svg viewBox="0 0 200 60" className="w-full h-12 mb-3">
              <polyline
                points="0,50 20,45 40,48 60,35 80,38 100,25 120,30 140,18 160,22 180,10 200,15"
                fill="none"
                stroke="hsl(0, 85%, 50%)"
                strokeWidth="2"
              />
            </svg>
            <div className="flex gap-4 text-xs">
              <div>
                <span className="text-muted-foreground">High</span>
                <div className="font-semibold">$67,890</div>
              </div>
              <div>
                <span className="text-muted-foreground">Low</span>
                <div className="font-semibold">$64,521</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
  );
};

export default HeroSection;
