import axios from "./axiosInstance";
import { withMock } from "../utils/withMock";

export interface NFTCollection {
  id: string;
  name: string;
  image: string;
  floor_price: number;
  volume_24h: number;
}

const mock: NFTCollection[] = [
  {
    id: "n1",
    name: "Bored Ape Yacht Club",
    image: "https://i.seadn.io/gae/bayc.png",
    floor_price: 24.5,
    volume_24h: 312.8,
  },
  {
    id: "n2",
    name: "Azuki",
    image: "https://i.seadn.io/gae/azuki.png",
    floor_price: 5.7,
    volume_24h: 74.3,
  },
  {
    id: "n3",
    name: "DeGods",
    image: "https://i.seadn.io/gae/degods.png",
    floor_price: 8.9,
    volume_24h: 122.8,
  },
  {
    id: "n4",
    name: "Doodles",
    image: "https://i.seadn.io/gae/doodles.png",
    floor_price: 2.8,
    volume_24h: 44.2,
  },
  {
    id: "n5",
    name: "CloneX",
    image: "https://i.seadn.io/gae/clonex.png",
    floor_price: 3.9,
    volume_24h: 61.5,
  },
  {
    id: "n6",
    name: "Otherdeed for Otherside",
    image: "https://i.seadn.io/gae/otherside.png",
    floor_price: 1.3,
    volume_24h: 18.7,
  },
  {
    id: "n7",
    name: "Moonbirds",
    image: "https://i.seadn.io/gae/moonbirds.png",
    floor_price: 4.6,
    volume_24h: 50.4,
  },
  {
    id: "n8",
    name: "Pudgy Penguins",
    image: "https://i.seadn.io/gae/pudgy.png",
    floor_price: 7.1,
    volume_24h: 38.2,
  },
  {
    id: "n9",
    name: "Milady Maker",
    image: "https://i.seadn.io/gae/milady.png",
    floor_price: 2.5,
    volume_24h: 29.9,
  },
  {
    id: "n10",
    name: "VeeFriends",
    image: "https://i.seadn.io/gae/veefriends.png",
    floor_price: 1.9,
    volume_24h: 21.6,
  },
  {
    id: "n11",
    name: "Mutant Ape Yacht Club",
    image: "https://i.seadn.io/gae/mayc.png",
    floor_price: 6.8,
    volume_24h: 89.4,
  },
  {
    id: "n12",
    name: "World of Women",
    image: "https://i.seadn.io/gae/wow.png",
    floor_price: 1.1,
    volume_24h: 14.2,
  },
];

export async function getNftCollections(limit = 12): Promise<NFTCollection[]> {
  const key = import.meta.env.VITE_OPENSEA_API_KEY as string | undefined;
  return withMock<NFTCollection[]>(async () => {
    if (!key) throw new Error("no key");
    const { data } = await axios.get(
      "https://api.opensea.io/api/v2/collections",
      {
        headers: { "x-api-key": key },
        params: {
          chain: "ethereum",
          order_by: "market_cap",
          limit: Math.min(limit, 50),
        },
      }
    );
    const items: NFTCollection[] = (data?.collections ?? []).map((c: any) => ({
      id: c.collection,
      name: c.name,
      image: c.image_url || c.banner_image_url || "",
      floor_price: Number(c.floor_price ?? 0),
      volume_24h: Number(c.total_volume ?? 0),
    }));
    return items.slice(0, limit);
  }, mock.slice(0, limit));
}
