//@ts-check
import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import createTestResolutionPlugin from './plugins/eslint-test-plugin.cjs';
import { defineConfig } from 'eslint/config';
import { parser as tsParser, plugin as typescriptEslint } from 'typescript-eslint';
import { typescriptRules, javascriptRules, definitionRules, testRules } from "../utils/eslint.js";

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
    ...plugins
  },
  rules: rules
});


export default defineConfig([
  { ignores: [
    "**/node_modules", 
    "**/dist/", 
    "**/build/", 
    "**/coverage/", 
    "**/_*.ts"
  ] },
  eslintConfiguration('**/*.{ts,tsx}',          typescriptRules, false),
  eslintConfiguration('**/*.d.ts',              definitionRules, false),
  eslintConfiguration('**/*.{test.js,test.ts}', testRules,       false, {
    "opti":     createTestResolutionPlugin("opti", "./types/Core/opti.lib.d.ts"),
    "crafty":   createTestResolutionPlugin("crafty", "./types/Crafty/crafty.lib.d.ts"),
    "query":    createTestResolutionPlugin("query", "./types/Query/Query.lib.d.ts"),
    "requests": createTestResolutionPlugin("request", "./types/Requests/requests.lib.d.ts"),
    "unsync":   createTestResolutionPlugin("unsync", "./types/Unsync/unsync.lib.d.ts"),
    "flow":     createTestResolutionPlugin("flow", "./types/Flow/flow.lib.d.ts"),
  })
]);