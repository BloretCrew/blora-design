import { copyFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";

const __dirname = dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      name: "BloraThread",
      formats: ["es", "iife"],
      fileName: (format) => (format === "es" ? "index.js" : "thread.global.js"),
    },
    rollupOptions: {
      output: {
        preserveModules: false,
      },
    },
    cssCodeSplit: true,
    outDir: "dist",
    emptyOutDir: true,
  },
  plugins: [
    {
      name: "copy-thread-css",
      closeBundle() {
        mkdirSync(resolve(__dirname, "dist"), { recursive: true });
        copyFileSync(resolve(__dirname, "src/thread.css"), resolve(__dirname, "dist/thread.css"));
      },
    },
  ],
});
