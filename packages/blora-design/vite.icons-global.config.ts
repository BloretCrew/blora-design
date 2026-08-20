import { defineConfig } from "vite";
import { resolve } from "node:path";

/** IIFE bundle for the opt-in full icon table — registers into window.Blora. */
export default defineConfig({
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/entries/icons-full.global.ts"),
      name: "BloraIconsFull",
      formats: ["iife"],
      fileName: () => "icons-full.global.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
    outDir: "dist",
  },
});
