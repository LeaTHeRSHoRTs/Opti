import { defineConfig } from 'oxlint';
import { typescriptRules, definitionRules, testRules } from './internal/eslint/rules.js';

export default defineConfig({
    plugins: [
        'eslint',
        'typescript',
        'vitest',
        'promise',
        'node'
    ],
    jsPlugins: [
        {
            name: "esdoc",
            specifier: "eslint-plugin-jsdoc"
        }
    ],
    settings: { jsdoc: { mode: "typescript" } },
    options: { typeAware: true },
    categories: {
        correctness: 'error',
        suspicious: 'warn',
        perf: 'warn'
    },
    overrides: [
        {
            files: ["**/*.ts", "**/*.tsx"],
            rules: typescriptRules
        },
        {
            // Must go after ts files so they have a higher priority
            files: ["**/*.d.ts"],
            rules: definitionRules
        },
        {
            files: ["**/*.test.ts", "**/*.test.js"],
            rules: testRules
        }
    ],
});