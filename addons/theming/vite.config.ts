import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  resolve: {
    alias: {
      /* Bundle icon factory + i18n so theming.global.js stays self-contained. */
      "@bloret-crew/blora-design": resolve(
        __dirname,
        "../../packages/blora-design/src/core/addon-exports.ts",
      ),
    },
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BloraTheming",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "index.js" : "theming.global.js"),
    },
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "copy-theming-css",
      closeBundle() {
        mkdirSync(resolve(__dirname, "dist"), { recursive: true });
        copyFileSync(resolve(__dirname, "src/theming.css"), resolve(__dirname, "dist/theming.css"));
      },
    },
  ],
});
