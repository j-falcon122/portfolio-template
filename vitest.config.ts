import path from "node:path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    jsx: "automatic",
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    projects: [
      {
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "."),
          },
        },
        test: {
          name: "unit",
          environment: "node",
          include: ["lib/**/*.test.ts"],
        },
      },
      {
        esbuild: {
          jsx: "automatic",
        },
        resolve: {
          alias: {
            "@": path.resolve(__dirname, "."),
          },
        },
        test: {
          name: "a11y",
          environment: "jsdom",
          include: ["**/*.a11y.test.tsx"],
          setupFiles: ["./vitest.a11y.setup.ts"],
        },
      },
    ],
  },
});
