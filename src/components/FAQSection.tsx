import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const faqs = [
  { q: "How does the platform work?", a: "Our platform provides real-time access to global markets including forex, crypto, stocks, and commodities. Sign up, deposit funds, and start trading with professional-grade tools." },
  { q: "How long do withdrawals take?", a: "Most withdrawals are processed within 24 hours. Depending on your payment method, funds may arrive in your account within 1-3 business days." },
  { q: "Is my money safe?", a: "Absolutely. We use bank-grade 256-bit SSL encryption, keep crypto in cold storage, and offer two-factor authentication for all accounts." },
  { q: "What can I trade?", a: "You can trade major cryptocurrencies (BTC, ETH, etc.), forex pairs, stock indexes, commodities, and energies — all from a single platform." },
  { q: "What are the fees?", a: "We offer competitive, transparent pricing with tight spreads and low commissions. No hidden charges." },
  { q: "Do you offer leverage?", a: "Yes, we offer flexible leverage options suited to both beginners and experienced traders, with proper risk management tools." },
];

const FAQSection = () => (
  <section id="faq" className="py-20">
    <div className="container mx-auto px-4 max-w-3xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mb-14"
      >
        <span className="text-sm text-primary font-medium">Have Questions?</span>
        <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">Frequently Asked Questions</h2>
        <p className="text-muted-foreground mt-4">
          Everything you need to know about trading with us.
        </p>
      </motion.div>

      <Accordion type="single" collapsible className="space-y-3">
        {faqs.map((faq, i) => (
          <AccordionItem key={i} value={`faq-${i}`} className="glass-card rounded-xl border border-border/50 px-6">
            <AccordionTrigger className="font-heading text-sm font-medium hover:no-underline">
              {faq.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm text-muted-foreground">
              {faq.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="text-center mt-10">
        <p className="text-sm text-muted-foreground mb-4">Still have questions? We're here to help.</p>
        <Button variant="outline">Contact Support</Button>
      </div>
    </div>
  </section>
);

export default FAQSection;
