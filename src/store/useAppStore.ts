import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

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

type State = {
  token: string | null;
  username: string | null;
  favCoins: FavCoin[];
  favNfts: FavNft[];
  theme: "dark" | "light";
};

type Actions = {
  login: (username: string, password: string) => boolean;
  logout: () => void;
  isAuthenticated: () => boolean;
  isFavCoin: (id: string) => boolean;
  isFavNft: (id: string) => boolean;
  toggleFavCoin: (item: FavCoin) => void;
  toggleFavNft: (item: FavNft) => void;
  toggleTheme: () => void;
};

export const useAppStore = create<State & Actions>()(
  persist(
    (set, get) => ({
      token: null,
      username: null,
      favCoins: [],
      favNfts: [],
      theme: "dark",

      login: (username, password) => {
        const users: Record<string, string> = { demo: "demo", alice: "123456" };
        if (users[username] === password) {
          const token = btoa(`${username}:${password}`);
          set({ token, username });
          return true;
        }
        return false;
      },
      logout: () => set({ token: null, username: null }),
      isAuthenticated: () => !!get().token,

      isFavCoin: (id) => get().favCoins.some((x) => x.id === id),
      isFavNft: (id) => get().favNfts.some((x) => x.id === id),

      toggleFavCoin: (item) => {
        const cur = get().favCoins;
        const i = cur.findIndex((x) => x.id === item.id);
        const next =
          i >= 0 ? [...cur.slice(0, i), ...cur.slice(i + 1)] : [...cur, item];
        set({ favCoins: next });
      },
      toggleFavNft: (item) => {
        const cur = get().favNfts;
        const i = cur.findIndex((x) => x.id === item.id);
        const next =
          i >= 0 ? [...cur.slice(0, i), ...cur.slice(i + 1)] : [...cur, item];
        set({ favNfts: next });
      },

      toggleTheme: () =>
        set((s) => ({ theme: s.theme === "dark" ? "light" : "dark" })),
    }),
    {
      name: "app-store",
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        token: s.token,
        username: s.username,
        favCoins: s.favCoins,
        favNfts: s.favNfts,
        theme: s.theme,
      }),
    }
  )
);
