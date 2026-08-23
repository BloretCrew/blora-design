import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      /* Bundle only the i18n + icon factory from core so the IIFE stays
         self-contained without shipping the whole core package. */
      "@bloret-crew/blora-design": resolve(
        __dirname,
        "../../packages/blora-design/src/core/addon-exports.ts",
      ),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BloraEffects",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "index.js" : "effects.global.js"),
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "copy-effects-css",
      closeBundle() {
        mkdirSync(resolve(__dirname, "dist"), { recursive: true });
        copyFileSync(resolve(__dirname, "src/effects.css"), resolve(__dirname, "dist/effects.css"));
      },
    },
  ],
});
