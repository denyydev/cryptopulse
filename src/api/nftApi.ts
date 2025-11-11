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
    name: "Sample IPFS",
    image: "ipfs://QmYwAPJzv5CZsnAzt8auV2.../image.png",
    floor_price: 2.1,
    volume_24h: 42.3,
  },
  {
    id: "n2",
    name: "HTTP Image",
    image: "https://picsum.photos/seed/nft1/800/600",
    floor_price: 1.4,
    volume_24h: 12.7,
  },
];

export async function getNftCollections(limit = 12): Promise<NFTCollection[]> {
  return mock.slice(0, limit);
}
