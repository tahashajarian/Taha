import { defineConfig } from "vite";
import { compression } from 'vite-plugin-compression2';
import react from "@vitejs/plugin-react";
import glsl from 'vite-plugin-glsl';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    compression(),
    glsl(), // Add this line to handle GLSL files
  ],
  build: {
    rollupOptions: {
      output: {
        // Libraries change far less often than app code, so keep them in
        // their own chunk and let browsers reuse it across deploys. emailjs is
        // left out so it stays in the lazy EmailModal chunk.
        manualChunks: (id) =>
          id.includes("node_modules") && !id.includes("@emailjs")
            ? "vendor"
            : undefined,
      },
    },
  },
});
