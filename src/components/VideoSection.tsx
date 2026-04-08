import { motion } from "framer-motion";

const VideoSection = () => (
  <section className="py-20">
    <div className="container mx-auto px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-12"
      >
        <h2 className="text-3xl md:text-4xl font-bold font-heading mb-4">
          Market Analysis & <span className="text-gradient-primary">Trade Inspiration</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Access powerful market insights and top trade setups from industry experts. Learn strategies that drive results.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto"
      >
        <div className="glass-card rounded-2xl overflow-hidden glow-primary">
          <div className="aspect-video">
            <iframe
              src="https://www.youtube.com/embed/5iEHsRja8u0"
              title="Forex Trading Introduction"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 max-w-3xl mx-auto">
        {[
          { label: "Wide Range of", bold: "Instruments" },
          { label: "Globally", bold: "Licensed & Regulated" },
          { label: "Committed to", bold: "Education" },
          { label: "Regular", bold: "Promotions" },
        ].map((item) => (
          <div key={item.bold} className="text-center">
            <div className="text-sm text-muted-foreground">{item.label}</div>
            <div className="font-heading font-semibold text-primary">{item.bold}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default VideoSection;
