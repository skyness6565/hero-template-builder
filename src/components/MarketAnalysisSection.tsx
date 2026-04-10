import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MarketAnalysisSection = () => {
  const navigate = useNavigate();
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!widgetRef.current) return;
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-overview.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify({
      colorTheme: "dark",
      dateRange: "12M",
      showChart: true,
      locale: "en",
      width: "100%",
      height: "100%",
      largeChartUrl: "",
      isTransparent: true,
      showSymbolLogo: true,
      showFloatingTooltip: false,
      tabs: [
        {
          title: "Indices",
          symbols: [
            { s: "FOREXCOM:SPXUSD", d: "S&P 500" },
            { s: "FOREXCOM:NSXUSD", d: "US 100" },
            { s: "FOREXCOM:DJI", d: "Dow 30" },
            { s: "INDEX:NKY", d: "Nikkei 225" },
            { s: "INDEX:DEU40", d: "DAX Index" },
            { s: "FOREXCOM:UKXGBP", d: "UK 100" },
          ],
        },
        {
          title: "Forex",
          symbols: [
            { s: "FX:EURUSD", d: "EUR/USD" },
            { s: "FX:GBPUSD", d: "GBP/USD" },
            { s: "FX:USDJPY", d: "USD/JPY" },
            { s: "FX:AUDUSD", d: "AUD/USD" },
          ],
        },
      ],
    });
    widgetRef.current.appendChild(script);
  }, []);

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span className="text-sm text-primary font-medium">Real-Time Intelligence</span>
          <h2 className="text-3xl md:text-4xl font-bold font-heading mt-2">
            Market Analysis & Insights
          </h2>
          <p className="text-muted-foreground mt-4">
            Stay ahead with real-time market data, AI-powered insights, and expert analysis
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="glass-card rounded-2xl overflow-hidden p-1" style={{ height: 500 }}>
            <div className="tradingview-widget-container" ref={widgetRef} style={{ height: "100%", width: "100%" }}>
              <div className="tradingview-widget-container__widget" style={{ height: "100%", width: "100%" }} />
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="font-heading text-xl font-semibold">Expert Market Analysis</h3>

            {[
              { title: "Daily Market Updates", desc: "Receive daily market analysis directly to your inbox. Our team of expert analysts provide actionable insights on market trends and trading opportunities." },
              { title: "Premium Trading Tools", desc: "Access advanced trading tools designed for all experience levels. Our platform offers customizable solutions to meet diverse trading needs." },
              { title: "Funds Protection", desc: "Your security is our priority. We provide industry-leading insurance protection for client funds, ensuring your investments are protected." },
            ].map((item) => (
              <div key={item.title} className="glass-card rounded-xl p-5">
                <h4 className="font-heading font-semibold mb-2">{item.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
            ))}

            <Button variant="outline" onClick={() => navigate("/auth")}>
              Learn more about our services
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default MarketAnalysisSection;
