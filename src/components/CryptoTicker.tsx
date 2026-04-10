import { useEffect, useRef } from "react";

const CryptoTicker = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://widget.coinlib.io/widget/coinlib-widget.js";
    script.async = true;
    document.body.appendChild(script);
    return () => { script.remove(); };
  }, []);

  return (
    <div className="w-full overflow-hidden bg-card/80 border-b border-border/30">
      <div
        ref={containerRef}
        dangerouslySetInnerHTML={{
          __html: `<div class="coinlib-widget" data-type="horizontal_v2" data-theme="dark" data-pref_coin_id="1505,382,1519,1518,1514,1520" data-font_color="#ccc" data-bg_color="transparent" data-ticker_speed="1"></div>`,
        }}
      />
    </div>
  );
};

export default CryptoTicker;
