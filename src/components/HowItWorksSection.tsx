import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Download, TrendingUp, Upload } from "lucide-react";

const steps = [
  { num: "1", icon: Download, title: "Deposit", desc: "Open real account and add funds. We work with more than 20 payment systems for your convenience.", cta: "Get Started" },
  { num: "2", icon: TrendingUp, title: "Trade", desc: "Trade any of 100 assets and stocks. Use technical analysis and trade the news for better results.", cta: "Explore Markets" },
  { num: "3", icon: Upload, title: "Withdraw", desc: "Get funds easily to your bank card or e-wallet with our fast and secure withdrawal process.", cta: "Learn More" },
];

const HowItWorksSection = () => {
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
          <span className="text-sm text-primary font-medium">Simple Process</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">How It Works</h2>
          <p className="text-muted-foreground mt-4">Get started with trading in three simple steps</p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-6 text-center relative"
            >
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center mx-auto mb-4 text-primary-foreground font-heading font-bold text-lg">
                {step.num}
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                <step.icon className="text-primary" size={20} />
              </div>
              <h3 className="font-heading font-semibold text-lg mb-2">{step.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">{step.desc}</p>
              <Button size="sm" variant="outline" onClick={() => navigate("/auth")}>
                {step.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
