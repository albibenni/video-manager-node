import { resolve } from "path";
import swc from "unplugin-swc";
import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      src: resolve(__dirname, "./src"),
    },
  },
  plugins: [
    swc.vite({
      module: { type: "es6" },
      jsc: {
        transform: {
          useDefineForClassFields: false,
        },
      },
    }),
  ],
  test: {
    include: ["**/*.e2e-spec.ts"],
    globals: true,
    root: "./",
  },
});
