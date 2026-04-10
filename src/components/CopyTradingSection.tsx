import { motion } from "framer-motion";
import { Copy, Award, ShieldCheck, Combine } from "lucide-react";

const items = [
  { icon: Copy, title: "Copy 400+ Strategies", desc: "Access hundreds of strategies for more than 1000 instruments across 7 asset classes." },
  { icon: Award, title: "Select Top Performers", desc: "Use our reporting tools to rank strategies according to performance and select the most suitable." },
  { icon: ShieldCheck, title: "Stay Protected", desc: "The system uses sophisticated calculations to keep your exposure at an optimal level for your account." },
  { icon: Combine, title: "Combine Methods", desc: "Our integrated platform allows you to combine copying with manual and automated trading." },
];

const CopyTradingSection = () => (
  <section className="py-20 border-y border-border/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Social Trading</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Copy Professional Traders</h2>
        <p className="text-muted-foreground mt-4">
          Let experienced traders do the work for you with our advanced copy trading system
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
        {items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 text-center hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <item.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CopyTradingSection;
