//@ts-check
import globals from 'globals';
import plugin from "./internal/eslint/eslint-general.cjs";
import { defineConfig } from 'eslint/config';
import stylistic from "@stylistic/eslint-plugin";
import jsdoc from "eslint-plugin-jsdoc";
import { parser as tsParser, plugin as typescriptEslint } from 'typescript-eslint';
import { typescriptRules, definitionRules, testRules } from "./internal/eslint/eslint.js";

/**
 * 
 * @param {string} regex 
 * @param {Partial<import('eslint').Linter.RulesRecord>} rules 
 * @param {boolean} node
 * @param {Record<string, import('eslint').ESLint.Plugin>} [plugins] 
 * @returns {import('eslint').Linter.Config}
 */
const eslintConfiguration = (regex, rules, node, plugins) => ({
    files: [regex],
    ignores: ['node_modules/', "dist/"],
    settings: {
        jsdoc: {
            mode: "typescript"
        }
    },
    languageOptions: {
        sourceType: "module",
        ecmaVersion: 2022,
        parser: tsParser,
        parserOptions: {
            sourceType: "module",
            projectService: true,
            tsconfigRootDir: import.meta.dirname
        },
        globals: node ? globals.node : globals.browser,
    },
    plugins: {
        "@typescript-eslint": typescriptEslint,
        "@stylistic": stylistic,
        "custom-rules": plugin,
        "jsdoc": jsdoc,
        ...plugins
    },
    rules
});

export default defineConfig([
    {
        ignores: [
            "**/node_modules",
            "**/dist/",
            "**/build/",
            "**/coverage/",
            "**/_*.ts"
        ]
    },
    eslintConfiguration('**/*.{ts,tsx}', typescriptRules, false),
    eslintConfiguration('**/*.d.ts', definitionRules, false),
    eslintConfiguration('**/*.{test.js,test.ts}', testRules, false/*, {
        "opti": createTestResolutionPlugin("opti", "./package/types/Core/opti.lib.d.ts"),
        "crafty": createTestResolutionPlugin("crafty", "./package/types/Crafty/crafty.lib.d.ts"),
        "query": createTestResolutionPlugin("query", "./package/types/Query/query.lib.d.ts"),
        "requests": createTestResolutionPlugin("request", "./package/types/Requests/requests.lib.d.ts"),
        "unsync": createTestResolutionPlugin("unsync", "./package/types/Unsync/unsync.lib.d.ts"),
        "flow": createTestResolutionPlugin("flow", "./package/types/Flow/flow.lib.d.ts"),
    } */)
]);