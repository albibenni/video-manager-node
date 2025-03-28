/// <reference types="vitest" />
import { defineConfig } from "vitest/config";
import { config } from "dotenv";

export default defineConfig({
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
      exclude: ["**/*.spec.ts"],
      reporter: ["json-summary", "html"],
    },
    //include: ["**/*.spec.ts"],
    exclude: ["**/*.spec.ts"],
    setupFiles: ["dotenv/config"],
    env: {
      ...config({ path: "./.env.local" }).parsed,
    },
    root: "./src",
  },
});
