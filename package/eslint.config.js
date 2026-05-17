import globals from 'globals';
import stylistic from '@stylistic/eslint-plugin';
import createTestResolutionPlugin from './plugins/eslint-test-plugin.cjs';
import { defineConfig } from 'eslint/config';
import { parser as tsParser, plugin as typescriptEslint } from 'typescript-eslint';


/** @type {import('eslint').Linter.RulesRecord} */
const javascriptRules = {
  'no-undef': 'error',
  'no-unreachable': 'error',
  'no-self-assign': 'error',
  'no-constant-condition': 'warn',
  'no-dupe-else-if': 'error',
  'no-unused-vars': 'off',
  'getter-return': 'error',
  'use-isnan': 'warn',
  'no-setter-return': 'error',
  'eqeqeq': 'error',
  'no-var': 'error',
  'prefer-const': 'warn',
  'prefer-exponentiation-operator': 'warn',
  'require-await': 'error',
  'require-yield': 'error',
  'semi': ['error', 'always'],
  'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
  'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
  'no-useless-catch': 'warn',
  'no-useless-constructor': 'warn',
  'no-useless-escape': 'warn',
};

/** @type {import('eslint').Linter.RulesRecord} */
const definitionRules = {
  'no-var': 'off',
  'no-undef': 'off',
  'camelcase': 'warn',
  '@stylistic/semi': 'error',
  "@stylistic/member-delimiter-style": [
    "error", {
      "multiline": {
        "delimiter": "semi",
        "requireLast": true
      },
      "singleline": {
        "delimiter": "semi",
        "requireLast": true
      },
      "overrides": {
        "typeLiteral": {
          "multiline": {
            "delimiter": "comma",
            "requireLast": false
          },
          "singleline": {
            "delimiter": "comma",
            "requireLast": false
          },
        }
      }
    }
  ],
  '@typescript-eslint/no-explicit-any': 'warn',
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-restricted-types": [
    "error",
    {
      types: {
        "Function": "Use function literals or the catch-all literal (this: any, ...args: any[]) => any",
      },
    },
  ]
};

/** @type {import('eslint').Linter.RulesRecord} */
const typescriptRules = {
  ...javascriptRules,
  ...definitionRules,
  'camelcase': 'off',
  'no-compare-neg-zero': 'error',
  '@typescript-eslint/no-shadow': 'error',
  '@typescript-eslint/no-non-null-assertion': 'warn',
  '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
  '@typescript-eslint/typedef': 'warn',
  '@typescript-eslint/array-type': ['error', { default: 'array' }],
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-restricted-types': [
    "error",
    {
      types: {
        "Object": "Use `object` or an object literal",
        "Function": "Use function literals or the catch-all literal `(this: any, ...args: any[]) => any`",
      },
    },
  ]
};

/** @type {import('eslint').Linter.RulesRecord} */
const testRules = {
  ...typescriptRules,
  '@typescript-eslint/no-explicit-any': 'off',
  "opti/import-restricted": "error",
  "crafty/import-restricted": "error",
  "query/import-restricted": "error",
  "requests/import-restricted": "error",
  "unsync/import-restricted": "error",
  "flow/import-restricted": "error",
};

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
      projectService: {
        allowDefaultProject: ['*.js'],
        defaultProject: 'tsconfig.json',
      },
      tsconfigRootDir: import.meta.dirname,
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
    "requests": createTestResolutionPlugin("requests", "./types/Requests/requests.lib.d.ts"),
    "unsync":   createTestResolutionPlugin("unsync", "./types/Unsync/unsync.lib.d.ts"),
    "flow":     createTestResolutionPlugin("flow", "./types/Flow/flow.lib.d.ts"),
  })
]);