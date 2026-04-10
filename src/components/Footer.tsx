const Footer = () => (
  <footer id="contact" className="border-t border-border/50 py-12">
    <div className="container mx-auto px-4">
      <div className="grid md:grid-cols-3 gap-8 mb-8">
        <div>
          <div className="font-heading text-xl font-bold mb-4">
            <span className="text-foreground">Crypto</span>
            <span className="text-primary">ExperTrade</span>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm">
            Your trusted partner in global trading. Trade forex, crypto, stocks, and commodities with confidence.
          </p>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Quick Links</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="#home" className="hover:text-primary transition-colors">Home</a></li>
            <li><a href="#about" className="hover:text-primary transition-colors">About</a></li>
            <li><a href="#markets" className="hover:text-primary transition-colors">Markets</a></li>
            <li><a href="#faq" className="hover:text-primary transition-colors">FAQ</a></li>
          </ul>
        </div>
        <div>
          <h4 className="font-heading font-semibold mb-3">Support</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>24/7 Live Chat Support</li>
            <li>WhatsApp: +48798448458</li>
            <li>Regulated & Licensed</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 pt-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} CryptoExperTrade. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
