import { motion } from "framer-motion";
import { BookOpen, BarChart3, TrendingUp } from "lucide-react";

const cards = [
  {
    icon: BookOpen,
    title: "Learn",
    items: ["FREE Demo Account", "Step-by-step tutorials", "Online webinars & seminars", "Trading tips from experts"],
  },
  {
    icon: BarChart3,
    title: "Trade",
    items: ["Tight spreads", "Superfast execution", "Hi-tech trading tools", "Ultimate risk protection"],
  },
  {
    icon: TrendingUp,
    title: "Invest",
    items: ["No need to be an expert", "Large number of strategies", "Copy top traders", "Diversified portfolios"],
  },
];

const CTASection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-heading">Start Your Trading Journey</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Whether you're learning, trading, or investing, we provide the tools you need to succeed.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
        {cards.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
              <c.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-4">{c.title}</h3>
            <ul className="space-y-2">
              {c.items.map((item) => (
                <li key={item} className="text-sm text-muted-foreground flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default CTASection;
