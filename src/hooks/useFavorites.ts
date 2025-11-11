export type FavCoin = {
  id: string;
  name: string;
  image: string;
  price?: number;
};
export type FavNft = {
  id: string;
  name: string;
  image: string;
  floor?: number;
};

const CKEY = "fav:coins";
const NKEY = "fav:nfts";

function read<T>(k: string): T[] {
  try {
    return JSON.parse(localStorage.getItem(k) || "[]") as T[];
  } catch {
    return [];
  }
}
function write<T>(k: string, v: T[]) {
  localStorage.setItem(k, JSON.stringify(v));
}

export function getFavCoins() {
  return read<FavCoin>(CKEY);
}
export function getFavNfts() {
  return read<FavNft>(NKEY);
}

export function isFavCoin(id: string) {
  return getFavCoins().some((x) => x.id === id);
}
export function isFavNft(id: string) {
  return getFavNfts().some((x) => x.id === id);
}

export function toggleFavCoin(item: FavCoin) {
  const list = getFavCoins();
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) {
    list.splice(i, 1);
  } else {
    list.push(item);
  }
  write(CKEY, list);
  return list;
}
export function toggleFavNft(item: FavNft) {
  const list = getFavNfts();
  const i = list.findIndex((x) => x.id === item.id);
  if (i >= 0) {
    list.splice(i, 1);
  } else {
    list.push(item);
  }
  write(NKEY, list);
  return list;
}
