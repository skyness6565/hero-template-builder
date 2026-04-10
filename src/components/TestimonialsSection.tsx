import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  { quote: "Since I started using CryptoExperTrade, I have been earning like never before. You guys have the best signals.", name: "Malcom47", role: "Verified Trader" },
  { quote: "I already got more than $200,000 within a month investing with CryptoExperTrade. Will again invest soon.", name: "Christy", role: "Elite Investor" },
  { quote: "I was able to earn additional $30,000 to my profit. It's amazing, you guys are the best, keep it up.", name: "Linday8", role: "Professional Trader" },
  { quote: "This was a very easy process and I received my funds quickly as I needed them! Highly recommend CryptoExperTrade.", name: "Crian", role: "Active Trader" },
  { quote: "I rate CryptoExperTrade five stars because of the service, you register online, upload ID and you deposit and withdraw after trades.", name: "Claudia", role: "Satisfied Investor" },
  { quote: "I am very pleased with the customer service. Also online service is great and easy thank you CryptoExperTrade team.", name: "Jenny", role: "Premium Member" },
];

const TestimonialsSection = () => (
  <section className="py-20 border-y border-border/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Success Stories</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Client Testimonials</h2>
        <p className="text-muted-foreground mt-4">
          Hear from our satisfied clients who have achieved impressive results with our platform
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="glass-card rounded-xl p-6"
          >
            <div className="flex gap-1 mb-4">
              {[...Array(5)].map((_, j) => (
                <Star key={j} size={14} className="fill-primary text-primary" />
              ))}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">"{t.quote}"</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-heading font-bold text-primary text-sm">
                {t.name.charAt(0)}
              </div>
              <div>
                <div className="font-semibold text-sm">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.role}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
