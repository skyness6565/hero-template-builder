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
        <span className="text-sm text-primary font-medium">Education Center</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2 mb-4">
          Learn From <span className="text-gradient-primary">Market Experts</span>
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Discover everything you need to know about cryptocurrency trading, from fundamentals to advanced strategies.
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
              src="https://www.youtube.com/embed/Gc2en3nHxA4"
              title="What is Bitcoin?"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
            />
          </div>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto mt-10"
      >
        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold text-lg mb-3">About Bitcoin</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bitcoin (₿) is a decentralized digital currency that operates without a central authority. Transactions are verified by network nodes through cryptography and recorded on a public distributed ledger called a blockchain. Bitcoin pioneered the concept of cryptocurrencies and remains the most widely adopted digital asset globally.
          </p>
        </div>
      </motion.div>
    </div>
  </section>
);

export default VideoSection;
