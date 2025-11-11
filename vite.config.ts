import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/cg": {
        target: "https://api.coingecko.com/api/v3",
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/cg/, ""),
      },
    },
  },
});
