import { defineConfig } from 'vitest/config';
import { resolve } from 'path';
import baseConfig from "../vitest.base";

export default defineConfig({
  ...baseConfig(__dirname),
  test: {
    coverage: {
      provider: 'v8',
      include: ["../src/*.ts"],
    },
    globals: true,
    environment: 'node'
  },
  resolve: {
    alias: {
      'cli': "./src/opti.ts"
    }
  }
});