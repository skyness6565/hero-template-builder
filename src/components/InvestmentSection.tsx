import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import btcChart from "@/assets/btc-chart.jpg";
import portfolioGrowth from "@/assets/portfolio-growth.jpg";

const InvestmentSection = () => {
  const navigate = useNavigate();
  return (
  <section id="markets" className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Investment Opportunities</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Massive Profit Potential</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Join thousands of successful investors growing their wealth with proven trading strategies.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden group"
        >
          <div className="relative overflow-hidden">
            <img src={btcChart} alt="Bitcoin trading chart" width={800} height={600} loading="lazy" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-4 right-4 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Live</span>
          </div>
          <div className="p-6">
            <div className="text-sm text-primary font-medium">Bitcoin Trading</div>
            <h3 className="font-heading text-xl font-semibold mt-1">High Average Returns</h3>
            <p className="text-sm text-muted-foreground mt-2">Our BTC trading strategies deliver consistent profits</p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl overflow-hidden group"
        >
          <div className="relative overflow-hidden">
            <img src={portfolioGrowth} alt="Portfolio growth dashboard" width={800} height={600} loading="lazy" className="w-full aspect-[4/3] object-cover group-hover:scale-105 transition-transform duration-500" />
            <span className="absolute top-4 right-4 bg-primary/90 text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Growing</span>
          </div>
          <div className="p-6">
            <div className="text-sm text-primary font-medium">Portfolio Growth</div>
            <h3 className="font-heading text-xl font-semibold mt-1">Smart Investment Tools</h3>
            <p className="text-sm text-muted-foreground mt-2">Professional-grade trading platform at your fingertips</p>
          </div>
        </motion.div>
      </div>

      <div className="text-center mt-10">
        <Button size="lg" onClick={() => navigate("/auth")}>Start Trading Now</Button>
      </div>
    </div>
  </section>
  );
};

export default InvestmentSection;
