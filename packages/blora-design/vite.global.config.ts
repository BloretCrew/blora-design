import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));

/** IIFE / CDN bundle — does not empty dist (runs after main vite build). */
export default defineConfig({
  define: {
    __BLORA_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    emptyOutDir: false,
    lib: {
      entry: resolve(__dirname, "src/entries/global.ts"),
      name: "Blora",
      formats: ["iife"],
      fileName: () => "blora.global.js",
    },
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
        name: "Blora",
        extend: true,
      },
    },
    outDir: "dist",
  },
});
