/** @type {import('eslint').Linter.RulesRecord} */
export const javascriptRules = {
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
export const definitionRules = {
  'no-var': 'off',
  'no-undef': 'off',
  'camelcase': 'warn',
  'semi': ["error", "always"],
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
export const typescriptRules = {
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
export const testRules = {
  ...typescriptRules,
  '@typescript-eslint/no-explicit-any': 'off',
  "opti/import-restricted": "error",
  "crafty/import-restricted": "error",
  "query/import-restricted": "error",
  "requests/import-restricted": "error",
  "unsync/import-restricted": "error",
  "flow/import-restricted": "error",
};

