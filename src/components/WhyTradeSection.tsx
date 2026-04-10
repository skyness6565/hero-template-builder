import { motion } from "framer-motion";
import { TrendingUp, Layers, Monitor, Wallet } from "lucide-react";

const items = [
  { icon: TrendingUp, title: "Trading Tools", desc: "Plan your trades effectively with our wide range of free professional trading tools" },
  { icon: Layers, title: "Trading Products", desc: "Diverse opportunities to optimize your trading portfolio across multiple markets" },
  { icon: Monitor, title: "Trading Platforms", desc: "Powerful platforms to suit all trading styles and needs on any device" },
  { icon: Wallet, title: "Funding Methods", desc: "Multiple quick, easy and secure methods to fund your trading account" },
];

const WhyTradeSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-heading">Why Trade With Us</h2>
        <p className="text-muted-foreground mt-4">Everything you need for successful trading</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 text-center hover:border-primary/30 transition-colors group"
          >
            <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
              <item.icon className="text-primary" size={24} />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WhyTradeSection;
