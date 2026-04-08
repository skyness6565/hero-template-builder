import { motion } from "framer-motion";
import { Zap, Shield, Lock, Users, Eye, Headphones } from "lucide-react";

const features = [
  { icon: Zap, title: "Lightning-Fast Payouts", desc: "Withdraw your earnings within 24 hours. No delays, no hidden fees." },
  { icon: Shield, title: "Fully Regulated & Licensed", desc: "We operate under strict financial regulations to protect your investments." },
  { icon: Lock, title: "Bank-Grade Security", desc: "256-bit SSL encryption, cold storage, and two-factor authentication." },
  { icon: Users, title: "500K+ Trusted Traders", desc: "Join a community of traders who trust us with their investments daily." },
  { icon: Eye, title: "Transparent Trading", desc: "No hidden charges, real-time pricing, and complete transparency." },
  { icon: Headphones, title: "24/7 Expert Support", desc: "Our dedicated team is available around the clock to assist you." },
];

const FeaturesSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Why Choose Us</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Trade with Confidence</h2>
        <p className="text-muted-foreground mt-4 max-w-xl mx-auto">
          Your security and success are our top priorities.
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {features.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
              <f.icon className="text-primary" size={22} />
            </div>
            <h3 className="font-heading font-semibold text-lg mb-2">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default FeaturesSection;
