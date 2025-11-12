import axios from "./axiosInstance";
import { withMock } from "../utils/withMock";

export interface NewsItem {
  id: string;
  title: string;
  url: string;
  source: string;
  published_at: string;
  image_url?: string;
  currencies?: string[];
}

const mock: NewsItem[] = [
  {
    id: "m1",
    title: "Bitcoin hits local resistance as volatility picks up",
    url: "https://example.com/bitcoin-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    image_url: "https://picsum.photos/seed/btc/600/400",
    currencies: ["BTC"],
  },
  {
    id: "m2",
    title: "Ethereum devs preview next hard fork timeline",
    url: "https://example.com/eth-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 90).toISOString(),
    image_url: "https://picsum.photos/seed/eth/600/400",
    currencies: ["ETH"],
  },
  {
    id: "m3",
    title: "Solana ecosystem sees surge in DeFi activity",
    url: "https://example.com/sol-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    image_url: "https://picsum.photos/seed/sol/600/400",
    currencies: ["SOL"],
  },
  {
    id: "m4",
    title: "Cardano upgrade improves network scalability",
    url: "https://example.com/ada-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 300).toISOString(),
    image_url: "https://picsum.photos/seed/ada/600/400",
    currencies: ["ADA"],
  },
  {
    id: "m5",
    title: "Dogecoin community plans next big marketing campaign",
    url: "https://example.com/doge-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 450).toISOString(),
    image_url: "https://picsum.photos/seed/doge/600/400",
    currencies: ["DOGE"],
  },
  {
    id: "m6",
    title: "Avalanche partnerships expand DeFi ecosystem",
    url: "https://example.com/avax-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 600).toISOString(),
    image_url: "https://picsum.photos/seed/avax/600/400",
    currencies: ["AVAX"],
  },
  {
    id: "m7",
    title: "Ripple gains momentum in cross-border payments",
    url: "https://example.com/xrp-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 720).toISOString(),
    image_url: "https://picsum.photos/seed/xrp/600/400",
    currencies: ["XRP"],
  },
  {
    id: "m8",
    title: "Polygon launches new zkEVM solution",
    url: "https://example.com/matic-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 900).toISOString(),
    image_url: "https://picsum.photos/seed/matic/600/400",
    currencies: ["MATIC"],
  },
  {
    id: "m9",
    title: "Chainlink adds new data oracles for DeFi protocols",
    url: "https://example.com/link-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 1200).toISOString(),
    image_url: "https://picsum.photos/seed/link/600/400",
    currencies: ["LINK"],
  },
  {
    id: "m10",
    title: "Litecoin halving event approaches as miners adjust",
    url: "https://example.com/ltc-news",
    source: "MockNews",
    published_at: new Date(Date.now() - 1000 * 60 * 1500).toISOString(),
    image_url: "https://picsum.photos/seed/ltc/600/400",
    currencies: ["LTC"],
  },
];

export async function getCryptoNews(limit = 12): Promise<NewsItem[]> {
  const token = import.meta.env.VITE_CRYPTOPANIC_TOKEN as string | undefined;
  return withMock<NewsItem[]>(async () => {
    if (!token) throw new Error("no token");
    const { data } = await axios.get("https://cryptopanic.com/api/v1/posts/", {
      params: {
        auth_token: token,
        public: "true",
        regions: "en",
        currencies: "BTC,ETH,SOL",
        kind: "news",
        filter: "rising",
      },
    });
    const items: NewsItem[] = (data?.results ?? []).map((p: any) => ({
      id: String(p.id),
      title: p.title,
      url: p.url,
      source: p.source?.title ?? "CryptoPanic",
      published_at: p.published_at,
      image_url: p.metadata?.image ?? undefined,
      currencies: p.currencies?.map((c: any) => c.code),
    }));
    return items.slice(0, limit);
  }, mock.slice(0, limit));
}
