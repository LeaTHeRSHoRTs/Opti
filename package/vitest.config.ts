import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    root: import.meta.dirname,
    coverage: {
      provider: 'v8',
      reporter: ['lcov'],
      include: ["src/**/*.ts"],
      exclude: [
        "src/**/_*.ts", 
        "src/_*/*.ts",
        "src/**/helpers.ts",
        "src/Core/registry.ts"
      ]
    },
    globals: true,
    isolate: true,
    environment: 'jsdom',
    include: ["tests/**/*.test.ts"],
    setupFiles: [path.resolve(import.meta.dirname, "../vitest.setup.ts")]
  },
  resolve: {
    alias: [
      { find: 'opti/crafty', replacement: path.resolve(import.meta.dirname, './src/Crafty/crafty.ts') },
      { find: 'opti/query', replacement: path.resolve(import.meta.dirname, './src/Query/query.ts') },
      { find: 'opti/request', replacement: path.resolve(import.meta.dirname, './src/Requests/requests.ts') },
      { find: 'opti/unsync', replacement: path.resolve(import.meta.dirname, './src/Unsync/unsync.ts') },
      { find: 'opti/flow', replacement: path.resolve(import.meta.dirname, './src/Flow/flow.ts') },
      { find: 'opti', replacement: path.resolve(import.meta.dirname, './src/Core/opti.ts') },
    ]
  }
});