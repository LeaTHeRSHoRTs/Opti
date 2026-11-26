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
            reporter: ["text", "lcov", "html"],
            include: ["src/**/*.ts"],
            exclude: [
                "src/**/_*.ts",
                "src/_*/*.ts",
                "src/helpers.ts",
                "src/registry.ts"
            ],
            reportsDirectory: "./coverage"
        },
        globals: true,
        isolate: true,
        projects: [
            {
                test: {
                    name: "browser",
                    include: ["tests/**/*.test.ts"],
                    exclude: ["tests/**/*.node.test.ts", "tests/**/*.types.test.ts"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium" }],
                        headless: true
                    }
                }
            },
            {
                test: {
                    name: "node",
                    include: ["tests/**/*.node.test.ts"],
                    browser: { enabled: false },
                    environment: 'node'
                }
            },
            {
                test: {
                    name: "types",
                    include: ["tests/**/*.types.test.ts"],
                    browser: {
                        enabled: true,
                        provider: playwright(),
                        instances: [{ browser: "chromium" }],
                        headless: true
                    }
                }
            }
        ],
        setupFiles: ["./internal/vitest.setup.ts"]
    },
    server: { fs: { allow: ["../"] } }
});