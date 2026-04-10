import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <section id="about" className="py-20">
      <div className="container mx-auto px-4 max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <span className="text-sm text-primary font-medium">Our Story</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">About Us</h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="space-y-6 text-muted-foreground leading-relaxed"
        >
          <p>
            CryptoExperTrade has become one of the most reputable brokers in the industry, offering traders CFDs across Forex, Equities, Commodities and Futures. Trading on the Forex market is a legitimate and straightforward way of generating income.
          </p>
          <p>
            The good news is that you don't have to be a professional trader in order to make money. All you need is the right personality and the right skill set and you can make money trading on foreign exchanges. CryptoExperTrade lets you trade in the way that best suits you.
          </p>

          <div className="grid md:grid-cols-2 gap-6 mt-8">
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-2">Personalized Trading</h3>
              <p className="text-sm">
                Do you want to risk a little or a lot? Do you want gains in the short term or are you playing a longer game? Are you a day trader, a swing trader or a scalper?
              </p>
            </div>
            <div className="glass-card rounded-xl p-6">
              <h3 className="font-heading font-semibold text-foreground mb-2">Complete Control</h3>
              <p className="text-sm">
                With the right tools, information and access to all the world's currencies, CryptoExperTrade puts you in control of the trades you make.
              </p>
            </div>
          </div>

          <div className="text-center mt-6">
            <Button variant="outline" onClick={() => navigate("/auth")}>Learn more about us</Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutSection;
