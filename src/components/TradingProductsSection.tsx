import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DollarSign, BarChart3, Flame, TrendingUp } from "lucide-react";

const products = [
  { icon: DollarSign, title: "Forex", desc: "Trade 70+ major, minor & exotic currency pairs with competitive spreads and conditions" },
  { icon: BarChart3, title: "Shares", desc: "Access hundreds of public companies from the US, UK, Germany and more markets" },
  { icon: Flame, title: "Energies", desc: "Discover opportunities on UK & US Crude Oil as well as Natural Gas with tight spreads" },
  { icon: TrendingUp, title: "Indices", desc: "Trade major and minor Index CFDs from around the globe with competitive conditions" },
];

const TradingProductsSection = () => {
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
          <h2 className="text-3xl md:text-4xl font-bold font-heading">Diverse Trading Products</h2>
          <p className="text-muted-foreground mt-4">Access global markets with competitive conditions</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group cursor-pointer"
              onClick={() => navigate("/auth")}
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <p.icon className="text-primary" size={22} />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{p.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TradingProductsSection;
