import axios from "./axiosInstance";
import { withMock } from "../utils/withMock";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

const mockCoins: Coin[] = [
  {
    id: "bitcoin",
    symbol: "btc",
    name: "Bitcoin",
    image: "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
    current_price: 67000,
    market_cap: 1250000000000,
    price_change_percentage_24h: 1.3,
  },
  {
    id: "ethereum",
    symbol: "eth",
    name: "Ethereum",
    image: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
    current_price: 3500,
    market_cap: 420000000000,
    price_change_percentage_24h: 0.9,
  },
  {
    id: "solana",
    symbol: "sol",
    name: "Solana",
    image: "https://cryptologos.cc/logos/solana-sol-logo.png",
    current_price: 180,
    market_cap: 85000000000,
    price_change_percentage_24h: -0.6,
  },
  {
    id: "dogecoin",
    symbol: "doge",
    name: "Dogecoin",
    image: "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
    current_price: 0.16,
    market_cap: 22000000000,
    price_change_percentage_24h: 2.1,
  },
  {
    id: "cardano",
    symbol: "ada",
    name: "Cardano",
    image: "https://cryptologos.cc/logos/cardano-ada-logo.png",
    current_price: 0.52,
    market_cap: 18000000000,
    price_change_percentage_24h: -1.4,
  },
];

export async function getCoins(limit = 20): Promise<Coin[]> {
  return withMock<Coin[]>(async () => {
    const { data } = await axios.get("/coins/markets", {
      params: { vs_currency: "usd", order: "market_cap_desc", per_page: limit },
    });
    return data;
  }, mockCoins.slice(0, limit));
}

export async function getCoin(id: string) {
  return withMock(async () => {
    const { data } = await axios.get(`/coins/${id}`);
    return data;
  }, mockCoins.find((c) => c.id === id) ?? mockCoins[0]);
}

export async function getCoinMarketChart(id: string, days = 7) {
  return withMock(
    async () => {
      const { data } = await axios.get(`/coins/${id}/market_chart`, {
        params: { vs_currency: "usd", days },
      });
      return data;
    },
    {
      prices: Array.from({ length: days }, (_, i) => [
        Date.now() - (days - i) * 86400000,
        mockCoins.find((c) => c.id === id)?.current_price ?? 100,
      ]),
    }
  );
}
