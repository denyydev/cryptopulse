import axios from "./axiosInstance";

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
];

type Provider = "cryptopanic" | "mock";

const provider: Provider = import.meta.env.VITE_CRYPTOPANIC_TOKEN
  ? "cryptopanic"
  : "mock";

export async function getCryptoNews(limit = 12): Promise<NewsItem[]> {
  if (provider === "mock") {
    return mock.slice(0, limit);
  }
  const token = import.meta.env.VITE_CRYPTOPANIC_TOKEN!;
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
}
