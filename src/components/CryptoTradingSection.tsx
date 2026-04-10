import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const cryptos = [
  { symbol: "BTC", name: "Bitcoin", pair: "BTC/USD", desc: "Bitcoin is a decentralized digital currency without a central bank or administrator, allowing peer-to-peer transactions on the blockchain network.", color: "text-orange-400" },
  { symbol: "ETH", name: "Ethereum", pair: "ETH/USD", desc: "Ethereum is a decentralized, open-source blockchain with smart contract functionality. It is the largest cryptocurrency by market cap after Bitcoin.", color: "text-blue-400" },
  { symbol: "XRP", name: "Ripple", pair: "XRP/USD", desc: "Ripple is a real-time gross settlement system and remittance network. It uses XRP to facilitate fast, low-cost international transactions.", color: "text-slate-300" },
  { symbol: "ADA", name: "Cardano", pair: "ADA/USD", desc: "Cardano is a proof-of-stake blockchain platform aiming to be more scalable, sustainable, and interoperable than other blockchain platforms.", color: "text-blue-300" },
];

const CryptoTradingSection = () => {
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
          <span className="text-sm text-primary font-medium">Popular Asset Class</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Cryptocurrency Trading</h2>
          <p className="text-muted-foreground mt-4">
            Trade the world's most popular digital assets with competitive spreads and advanced tools
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {cryptos.map((c, i) => (
            <motion.div
              key={c.symbol}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className={`font-heading font-bold text-sm ${c.color}`}>{c.symbol}</span>
                </div>
                <h3 className="font-heading font-semibold text-lg">{c.name}</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{c.desc}</p>
              <div className="flex items-center justify-between">
                <Button size="sm" onClick={() => navigate("/auth")}>Trade now</Button>
                <span className="text-xs text-muted-foreground">{c.pair}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CryptoTradingSection;
