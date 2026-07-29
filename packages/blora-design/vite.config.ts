import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { defineConfig } from "vite";

const packageJson = JSON.parse(readFileSync(resolve(__dirname, "package.json"), "utf8"));

export default defineConfig({
  define: {
    __BLORA_VERSION__: JSON.stringify(packageJson.version),
  },
  build: {
    lib: {
      entry: resolve(__dirname, "src/index.ts"),
      formats: ["es"],
      fileName: "index",
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
});
