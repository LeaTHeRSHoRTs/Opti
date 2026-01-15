const globals =  require('globals');
const tsParser = require('@typescript-eslint/parser');

const tsconfigs = [
  // Source Files
  'src/modules/tsconfig.json',
  'src/command/tsconfig.json',

  // Test Files
  'tests/modules/tsconfig.json',
  'tests/command/tsconfig.json',
];


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
  'semi': ['error', 'always'],
  'no-var': 'off',
  'no-undef': 'off',
  'camelcase': 'warn',
  '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
  '@typescript-eslint/no-explicit-any': 'warn',
  "@typescript-eslint/no-empty-object-type": "off",
  "@typescript-eslint/no-restricted-types": [
    "error",
    {
      types: {
        "Function": "Use function literals or the catchall literal (this: any, ...args: any[]) => any",
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
  '@typescript-eslint/typedef': 'warn',  '@typescript-eslint/array-type': ['error', { default: 'array' }],
  '@typescript-eslint/no-floating-promises': 'error',
  '@typescript-eslint/explicit-module-boundary-types': 'error',
  '@typescript-eslint/no-restricted-types': [
    "error",
    {
      types: {
        "Object": "Use `object` or an object literal",
        "Function": "Use function literals or the catchall literal `(this: any, ...args: any[]) => any`",
      },
    },
  ]
};

/** @type {import('eslint').Linter.RulesRecord} */
const testRules = {
  ...typescriptRules,
  '@typescript-eslint/no-explicit-any': 'off',
};

/** @type {import('eslint').Linter.Config[]} */
module.exports = [
  {
    files: ['**/*.{ts,tsx}'],
    ignores: ['node_modules/', "dist/"],
    languageOptions: {
      sourceType: "module",
      parser: tsParser,
      parserOptions: {
        project: tsconfigs,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: typescriptRules
  },
  {
    files: ['**/*.{test.js,test.ts}'],
    ignores: ['node_modules/', "dist/"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: tsconfigs,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: testRules
  },
  {
    files: ['**/*.d.ts'],
    ignores: ['node_modules/', "dist/"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: tsconfigs,
        tsconfigRootDir: __dirname,
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        ...globals.browser,
        ...globals.node
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: definitionRules,
  },
  {
    files: ["**/*.{cts}"],
    ignores: ['node_modules/', "dist/"],
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      "@typescript-eslint": require("@typescript-eslint/eslint-plugin"),
    },
    rules: typescriptRules,
  }
];
