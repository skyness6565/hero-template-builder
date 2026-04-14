import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Zap, Shield, BarChart3, Check, LogIn, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

const HeroSection = () => {
  const navigate = useNavigate();
  const [time, setTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date().toLocaleTimeString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="home" className="relative pt-20 sm:pt-28 pb-12 sm:pb-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm mb-6 font-medium uppercase tracking-wider">
              Innovative Trading Platform
            </span>

            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-4 sm:mb-6 font-heading">
              Trade Global Markets{" "}
              <span className="text-gradient-primary">With Confidence</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-lg">
              Access advanced trading tools for Forex, Cryptocurrencies, Commodities, Indices, and more with competitive spreads and lightning-fast execution.
            </p>

            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="gap-2" onClick={() => navigate("/auth")}>
                Create Account <ArrowRight size={16} />
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/auth")}>
                Login
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="glass-card rounded-2xl p-6 glow-primary">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  <span className="font-heading font-semibold text-primary text-sm">PROFESSIONAL TRADING</span>
                </div>
                <span className="text-xs text-muted-foreground">{time}</span>
              </div>

              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading font-semibold">Platform Features</h3>
                <span className="text-xs text-primary">Advanced Platform</span>
              </div>

              <div className="space-y-3 mb-6">
                {[
                  { icon: Zap, label: "Lightning Fast Execution", desc: "Ultra-low latency trading", color: "text-blue-400" },
                  { icon: Shield, label: "Advanced Risk Management", desc: "", color: "text-green-400" },
                  { icon: BarChart3, label: "Real-Time Analytics", desc: "Live market data & charts", color: "text-purple-400" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 bg-secondary/50 rounded-lg p-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <item.icon size={16} className={item.color} />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">{item.label}</div>
                      {item.desc && <div className="text-xs text-muted-foreground">{item.desc}</div>}
                    </div>
                    <Check size={16} className="text-green-500" />
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button className="w-full gap-2" onClick={() => navigate("/auth")}>
                  <Rocket size={16} /> Start Trading Today
                </Button>
                <Button variant="outline" className="w-full gap-2" onClick={() => navigate("/auth")}>
                  <LogIn size={16} /> Access Your Account
                </Button>
              </div>

              <p className="text-center text-xs text-muted-foreground mt-4">
                Regulated • Secure • Professional
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
