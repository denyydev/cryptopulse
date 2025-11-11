import axios from "./axiosInstance";

export interface Coin {
  id: string;
  symbol: string;
  name: string;
  image: string;
  current_price: number;
  market_cap: number;
  price_change_percentage_24h: number;
}

export async function getCoins(limit = 20): Promise<Coin[]> {
  const { data } = await axios.get("/coins/markets", {
    params: { vs_currency: "usd", order: "market_cap_desc", per_page: limit },
  });
  return data;
}

export async function getCoin(id: string) {
  const { data } = await axios.get(`/coins/${id}`);
  return data;
}

export async function getCoinMarketChart(id: string, days = 7) {
  const { data } = await axios.get(`/coins/${id}/market_chart`, {
    params: { vs_currency: "usd", days },
  });
  return data;
}
