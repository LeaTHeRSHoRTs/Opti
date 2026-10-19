import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
    test: {
        root: import.meta.dirname,
        coverage: {
            provider: "v8",
            reporter: ["lcov"],
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
        environment: "jsdom",
        include: ["tests/**/*.test.ts"],
        setupFiles: [path.resolve(import.meta.dirname, "../vitest.setup.ts")]
    },
    server: { fs: { allow: ["../"] } }
});