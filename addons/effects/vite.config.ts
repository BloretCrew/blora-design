import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
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
