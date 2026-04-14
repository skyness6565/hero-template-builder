import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Zap, Brain, BarChart3, Layout } from "lucide-react";

const tools = [
  { icon: Zap, title: "Reliable Execution", desc: "Featuring the market's sharpest execution, CryptoExpertTrade fills your orders in milliseconds without any requotes or price manipulation." },
  { icon: Brain, title: "Intelligent Analysis", desc: "Make informed decisions with smart market analysis tools, Live Sentiment data and in-platform market insights." },
  { icon: BarChart3, title: "Transparent Reporting", desc: "Access transaction statistics, equity charts and detailed history of your deals for a crystal clear understanding of your performance." },
  { icon: Layout, title: "Intuitive Interface", desc: "Easy to use and navigate, CryptoExpertTrade was built with real traders' needs in mind. Trade and experience its distinct advantage." },
];

const AdvancedToolsSection = () => (
  <section className="py-20 border-y border-border/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Platform Features</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Advanced Trading Tools</h2>
        <p className="text-muted-foreground mt-4">
          Our platform provides everything you need for successful trading in one powerful interface
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        {tools.map((t, i) => (
          <motion.div
            key={t.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <t.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">{t.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AdvancedToolsSection;
