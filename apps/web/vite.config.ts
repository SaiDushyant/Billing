import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    allowedHosts: ["sparrowless-noncapricious-emmie.ngrok-free.dev"],
    proxy: {
      "/api":"https://sparrowless-noncapricious-emmie.ngrok-free.dev",
    },
  },
})