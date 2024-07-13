import { defineConfig } from "vite";
import { compression, tarball } from 'vite-plugin-compression2'
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), compression()],
});
