import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  base: "/Interactive-Line-Chart-Arthur/",
  plugins: [
    react(),
    svgr({
      include: "**/*.svg?react",
      svgrOptions: {
        typescript: false,
      },
    }),
  ],
  resolve: {
    alias: {
      "@public": path.resolve(__dirname, "./public"),
      "@mocks": path.resolve(__dirname, "./mockData"),
    },
  },
});
