import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote: "The fastest payout I've ever experienced. Had funds in my bank within hours of withdrawal.",
    name: "Alex M.",
    role: "Professional Trader",
  },
  {
    quote: "A broker that values security. My crypto assets are safe and I have peace of mind.",
    name: "Jordan K.",
    role: "Crypto Investor",
  },
  {
    quote: "Transparent fees, instant execution, and amazing support. This is how trading should be.",
    name: "Chris L.",
    role: "Day Trader",
  },
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
        <h2 className="text-3xl md:text-4xl font-bold font-heading">What Our Traders Say</h2>
      </motion.div>

      <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {testimonials.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
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

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto text-center">
        {[
          { value: "$2.5B+", label: "Daily Volume" },
          { value: "500K+", label: "Active Traders" },
          { value: "<1hr", label: "Avg Payout Time" },
          { value: "99.9%", label: "Uptime" },
        ].map((s) => (
          <div key={s.label}>
            <div className="text-2xl font-bold font-heading">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default TestimonialsSection;
