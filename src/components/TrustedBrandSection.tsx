import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Globe, Award, Headphones, Lock, UserCheck } from "lucide-react";

const trustItems = [
  { icon: Globe, title: "Globally Regulated", desc: "Operating under strict financial regulations to ensure maximum security for your assets" },
  { icon: Award, title: "40+ International Awards", desc: "Recognition for excellence in trading services, platform technology and customer support" },
  { icon: Headphones, title: "24/7 Multilingual Support", desc: "Expert assistance available around the clock in multiple languages" },
  { icon: Lock, title: "Segregated Client Funds", desc: "Your investments are kept in separate accounts for maximum security" },
  { icon: UserCheck, title: "Personal Account Managers", desc: "Dedicated professionals to guide your trading journey" },
];

const TrustedBrandSection = () => {
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
          <span className="text-sm text-primary font-medium">Global Trust</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">
            Why CryptoExpertTrade Is One of the World's Most Trusted Brands
          </h2>
          <p className="text-muted-foreground mt-4">
            Experience the reliability and security that our global clients have come to trust
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {trustItems.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="glass-card rounded-xl p-6 hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                <item.icon className="text-primary" size={22} />
              </div>
              <h3 className="font-heading font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Button onClick={() => navigate("/auth")}>Learn More</Button>
        </div>
      </div>
    </section>
  );
};

export default TrustedBrandSection;
