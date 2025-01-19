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
});
