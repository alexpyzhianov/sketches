import { defineConfig } from "vite";
import glsl from "vite-plugin-glsl";
import path from "path";

export default defineConfig({
  plugins: [
    glsl({
      compress: true,
    }),
  ],
  build: {
    modulePreload: {
      polyfill: false,
    },
  },
  resolve: {
    alias: {
      utils: path.resolve(__dirname, "../utils/index.ts"),
    },
  },
});
