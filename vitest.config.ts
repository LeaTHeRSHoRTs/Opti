import { defineConfig } from 'vitest/config';
import { playwright } from "@vitest/browser-playwright";
import path from 'path';

export default defineConfig({
    resolve: {
        alias: {
            opti: path.resolve(import.meta.dirname, "src", "index.ts")
        }
    },
    test: {
        root: import.meta.dirname,
        coverage: {
            provider: 'v8',
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
        include: ["tests/**/*.test.ts"],
        browser: {
            enabled: true,
            provider: playwright(),
            instances: [
                { browser: "chromium" }
            ],
            headless: true
        },
        setupFiles: ["@testing-library/jest-dom/vitest"]
    },
    server: { fs: { allow: ["../"] } }
});