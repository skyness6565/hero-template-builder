import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import commissionImg from "@/assets/commission-scheme.jpg";

const conditions = [
  "Ultra-low spreads from 0.0 pips on major pairs",
  "Lightning-fast execution with minimal slippage",
  "Top-tier liquidity and market-leading pricing 24/5",
  "No dealing desk and no requotes, ever",
];

const TradingConditionsSection = () => {
  const navigate = useNavigate();
  return (
    <section className="py-20 border-y border-border/50">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm text-primary font-medium">Superior Trading Experience</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">
            Tighter Spreads. Faster Execution.
          </h2>
          <p className="text-muted-foreground mt-4">
            Experience institutional-grade trading conditions designed for professional traders
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="font-heading font-semibold text-xl mb-6">Premium Trading Conditions</h3>
            <ul className="space-y-4 mb-6">
              {conditions.map((c) => (
                <li key={c} className="flex items-start gap-3 text-muted-foreground">
                  <Check size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <span className="text-sm">{c}</span>
                </li>
              ))}
            </ul>
            <Button onClick={() => navigate("/auth")}>View detailed conditions</Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <img
              src={commissionImg}
              alt="Trading commission structure"
              width={800}
              height={600}
              loading="lazy"
              className="rounded-xl glow-primary"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default TradingConditionsSection;
