import { useState, useEffect } from "react";

interface CryptoPrice {
  price: number;
  change24h: number;
}

interface CryptoPrices {
  btc: CryptoPrice;
  eth: CryptoPrice;
  loading: boolean;
}

const useCryptoPrices = (): CryptoPrices => {
  const [prices, setPrices] = useState<CryptoPrices>({
    btc: { price: 71284, change24h: -2.1 },
    eth: { price: 2105, change24h: -1.4 },
    loading: true,
  });

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const res = await fetch(
          "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum&vs_currencies=usd&include_24hr_change=true"
        );
        const data = await res.json();
        setPrices({
          btc: {
            price: data.bitcoin?.usd ?? 71284,
            change24h: data.bitcoin?.usd_24h_change ?? -2.1,
          },
          eth: {
            price: data.ethereum?.usd ?? 2105,
            change24h: data.ethereum?.usd_24h_change ?? -1.4,
          },
          loading: false,
        });
      } catch {
        setPrices((p) => ({ ...p, loading: false }));
      }
    };

    fetchPrices();
    const interval = setInterval(fetchPrices, 30000);
    return () => clearInterval(interval);
  }, []);

  return prices;
};

export default useCryptoPrices;
