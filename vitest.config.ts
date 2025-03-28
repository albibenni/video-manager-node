/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { config } from "dotenv";
import swc from "unplugin-swc";
import { resolve } from "path";

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
    // globalSetup: "./src/__tests__/global.setup.ts",
    passWithNoTests: true,
    globals: true,
    environment: "node",
    fileParallelism: false,
    poolOptions: {
      maxWorkers: 1,
    },
    coverage: {
      enabled: false,
      all: false,
      provider: "istanbul",
      include: ["src/**"],
      reporter: ["json-summary", "html"],
    },
    setupFiles: ["dotenv/config"],
    env: {
      ...config({ path: "./.env.local" }).parsed,
    },
    root: "./src",
  },
});
