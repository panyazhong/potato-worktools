import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/h5": {
        target: "https://h5api-m.hemayx.cn",
        changeOrigin: true,
        rewrite: (path) => path.replace("/h5", "/h5"),
      },
    },
  },
});
