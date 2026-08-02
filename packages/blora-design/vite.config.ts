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
      entry: {
        index: resolve(__dirname, "src/index.ts"),
        auto: resolve(__dirname, "src/auto.ts"),
        "compat/v1/index": resolve(__dirname, "src/compat/v1/index.ts"),
        "components/button/index": resolve(__dirname, "src/entries/button.ts"),
        "components/select/index": resolve(__dirname, "src/entries/select.ts"),
        "components/dialog/index": resolve(__dirname, "src/entries/dialog.ts"),
        "components/table/index": resolve(__dirname, "src/entries/table.ts"),
        "components/toast/index": resolve(__dirname, "src/entries/toast.ts"),
      },
      formats: ["es"],
      fileName: (_format, entryName) => `${entryName}.js`,
    },
    rollupOptions: {
      output: {
        // Prefer named files under components/* without hashed shared chunks when possible
        manualChunks: undefined,
        preserveModules: false,
      },
    },
    cssCodeSplit: true,
    outDir: "dist",
    emptyOutDir: true,
  },
});
