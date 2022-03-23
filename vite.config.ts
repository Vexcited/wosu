import { defineConfig } from "vite";
import mix from "vite-plugin-mix";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [
    mix({
      handler: "./handler.ts",
    }),
    react()
  ]
});
