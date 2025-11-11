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
    image: "https://picsum.photos/seed/bayc/600/400",
    floor_price: 24.5,
    volume_24h: 315.2,
  },
  {
    id: "n2",
    name: "Azuki",
    image: "https://picsum.photos/seed/azuki/600/400",
    floor_price: 5.7,
    volume_24h: 74.3,
  },
  {
    id: "n3",
    name: "DeGods",
    image: "https://picsum.photos/seed/degods/600/400",
    floor_price: 8.9,
    volume_24h: 122.8,
  },
  {
    id: "n4",
    name: "Milady Maker",
    image: "https://picsum.photos/seed/milady/600/400",
    floor_price: 1.9,
    volume_24h: 14.5,
  },
];

export async function getNftCollections(limit = 12): Promise<NFTCollection[]> {
  return mock.slice(0, limit);
}
