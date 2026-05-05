import { fileURLToPath } from 'url';
import { defineConfig } from 'vitest/config';

export default function baseConfig(root: string) {
  return defineConfig({
    test: {
      setupFiles: [fileURLToPath(new URL("../vitest.functions.ts", import.meta.url))],
      include: ["**/*.test.ts"]
    }
  });
}
