import { motion } from "framer-motion";

const achievements = [
  { value: "2018", label: "Established" },
  { value: "2,190+", label: "Days Online" },
  { value: "5.8M+", label: "Global Investors" },
  { value: "150+", label: "Countries Served" },
  { value: "15%", label: "Referral Bonus" },
  { value: "12,847", label: "Active Traders" },
];

const AchievementsSection = () => (
  <section className="py-12 sm:py-20 border-y border-border/50">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-8 sm:mb-14"
      >
        <span className="text-xs sm:text-sm text-primary font-medium">Our Achievements</span>
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold font-heading mt-2">
          Trusted by Millions Worldwide
        </h2>
      </motion.div>

      <div className="grid grid-cols-3 md:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-8">
        {achievements.map((a, i) => (
          <motion.div
            key={a.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="text-center"
          >
            <div className="text-xl sm:text-3xl font-bold font-heading text-primary">{a.value}</div>
            <div className="text-xs sm:text-sm text-muted-foreground mt-1">{a.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default AchievementsSection;
