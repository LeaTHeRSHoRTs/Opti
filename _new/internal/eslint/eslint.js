/** @type {string[]} */
const jsdocPluginContexts = [
    "TSDeclareFunction",
    "TSMethodSignature",
    "TSTypeAliasDeclaration",
    "TSDeclareMethod",
    "ClassDeclaration",
    "VariableDeclaration"
];

//#region Rules
/** @type {import('eslint').Linter.RulesRecord} */
const baseRules = {
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
    "@stylistic/indent": ["error", 4],
    "custom-rules/single-line-control-flow": "error",
    "custom-rules/conditional-single": "error",
    "custom-rules/validated-throws": "error"
};

/** @type {import('eslint').Linter.RulesRecord} */
export const definitionRules = {
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
                "requireLast": false
            }
        }
    ],
    "@typescript-eslint/no-explicit-any": 'warn',
    "@typescript-eslint/no-empty-object-type": "off",
    "@typescript-eslint/no-restricted-types": [
        "error",
        {
            types: {
                "Object": "Use `object` or an object literal",
                "Function": "Use function literals or the catch-all literal (`(this: any, ...args: any[]) => any`). If in a safe context, use the `Func` type provided by opti"
            },
        },
    ],
    "jsdoc/require-jsdoc": [
        "error",
        {
            skipInterveningOverloadedDeclarations: true,
            contexts: jsdocPluginContexts
        }
    ],
    "jsdoc/require-tags": ["error", { tags: ["since","opti"] }],
    "jsdoc/require-param": ["error", { contexts: jsdocPluginContexts }],
    "jsdoc/check-param-names": "error",
    "jsdoc/require-description": "error",
    "jsdoc/require-example": [
        "error",
        {
            contexts: [
                "TSDeclareFunction",
                "TSMethodSignature",
                "TSDeclareMethod"
            ]
        }
    ],
    "jsdoc/require-returns": ["error", {
        forceRequireReturn: false,
        contexts: jsdocPluginContexts 
    }],
    "jsdoc/sort-tags": [
        "error",
        {
            reportIntraTagGroupSpacing: false,
            reportTagGroupSpacing: false,
            tagSequence: [
                { tags: ["opti"] },
                { tags: ["deprecated"] },
                { tags: ["since"] },
                { tags: ["template"] },
                { tags: ["extends"] },
                { tags: ["implements"] },
                { tags: ["param"] },
                { tags: ["returns"] },
                { tags: ["throws"] },
                { tags: ["see"] },
                { tags: ["example"] }
            ]
        }
    ]
};

/** @type {import('eslint').Linter.RulesRecord} */
export const typescriptRules = {
    ...baseRules,
    ...definitionRules,
    'camelcase': 'off',
    'no-compare-neg-zero': 'error',
    "jsdoc/require-jsdoc": "off",
    "@typescript-eslint/no-explicit-any": 'error',
    '@typescript-eslint/no-shadow': 'error',
    '@typescript-eslint/no-non-null-assertion': 'warn',
    '@typescript-eslint/no-unnecessary-type-assertion': 'warn',
    '@typescript-eslint/typedef': 'warn',
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/no-floating-promises': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error'
};

/** @type {import('eslint').Linter.RulesRecord} */
export const testRules = {
    ...typescriptRules,
    '@typescript-eslint/no-explicit-any': 'off',
};
//#endregion