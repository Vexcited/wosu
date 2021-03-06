import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mix, { vercelAdapter } from "vite-plugin-mix";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    /** Add backend handler to Vite. */
    mix({
      handler: resolve(__dirname, "src/api/index.ts"),
      adapter: vercelAdapter()
    }),
    react()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  }
});
