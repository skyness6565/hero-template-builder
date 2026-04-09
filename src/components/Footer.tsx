const Footer = () => (
  <footer className="border-t border-border/50 py-10">
    <div className="container mx-auto px-4 text-center">
      <div className="font-heading text-xl font-bold mb-4">
        <span className="text-foreground">Crypto</span>
        <span className="text-primary">ExperTrade</span>
      </div>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
        Your trusted partner in global trading. Trade forex, crypto, stocks, and commodities with confidence.
      </p>
      <div className="text-xs text-muted-foreground">
        © {new Date().getFullYear()} CryptoExperTrade. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
