import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import mix from "vite-plugin-mix";
import { resolve } from "path";

export default defineConfig({
  plugins: [
    /** Add backend handler to Vite. */
    mix({ handler: "./handler.ts" }),
    react()
  ],
  resolve: {
    alias: {
      "@": resolve(__dirname, "src")
    }
  },
});
