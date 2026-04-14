import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import heroPlatform from "@/assets/hero-platform.jpg";

const benefits = [
  "Trade Forex, Indices, Shares & Commodities",
  "Access global markets 24 hours / 7 days",
  "Multilingual customer support",
  "Trade on the go on our mobile apps",
];

const TradeFreedomSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm text-primary font-medium">Freedom to Trade</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">
            Trade What You Want, When You Want
          </h2>
          <p className="text-muted-foreground mt-4">
            Experience unlimited trading possibilities with our comprehensive platform
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src={heroPlatform}
              alt="CryptoExpertTrade trading platform"
              width={1280}
              height={720}
              loading="lazy"
              className="rounded-xl glow-primary"
            />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading font-semibold text-xl mb-4">Premium Trading Experience</h3>
            <p className="text-muted-foreground text-sm mb-6 leading-relaxed">
              One of the primary goals of CryptoExpertTrade is to provide the best product in the market. Our relationships with leading tier one financial institutions mean deep liquidity and tighter spreads for Forex traders.
            </p>
            <ul className="space-y-3 mb-6">
              {benefits.map((b) => (
                <li key={b} className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Check size={16} className="text-primary flex-shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/auth")}>Learn About Our Commissions</Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TradeFreedomSection;
