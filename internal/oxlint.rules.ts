import type { Linter } from 'eslint';

// 
const jsdocPluginContexts = [
    "TSDeclareFunction",
    "TSMethodSignature",
    "TSTypeAliasDeclaration",
    "TSDeclareMethod",
    "ClassDeclaration",
    "VariableDeclaration"
];


// Rules
const baseRules: Linter.RulesRecord = {
    'no-unreachable': 'error',
    'no-self-assign': 'error',
    'no-constant-condition': 'warn',
    'no-dupe-else-if': 'error',
    'no-unused-vars': 'off',
    'no-shadow': 'error',
    'no-setter-return': 'error',
    'no-var': 'error',
    'getter-return': 'error',
    'use-isnan': 'warn',
    'eqeqeq': 'error',
    'prefer-const': 'warn',
    'prefer-exponentiation-operator': 'warn',
    'require-yield': 'error',
    'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],
    'prefer-arrow-callback': ['warn', { allowNamedFunctions: true }],
    'no-useless-catch': 'warn',
    'no-useless-constructor': 'warn',
    'no-useless-escape': 'warn',

    
    "import/no-duplicates": "error",
    "import/no-cycle": "error",
    "import/no-self-import": "error",

    "eslint/no-extend-native": 'off',
    "eslint/no-underscore-dangle": 'off',

    "stylistic/indent": ["error", 4],
    "stylistic/semi": ['error', 'always'],

    // "custom-rules/single-line-control-flow": "error",
    // "custom-rules/conditional-single": "error",
    // "custom-rules/validated-throws": "error"
};

export const definitionRules: Linter.RulesRecord = {
    'no-var': 'off',
    'no-undef': 'off',

    "eslint/id-match": [
        "error",
        "^[A-Z_$][a-zA-Z0-9]*$|^[a-z_$][a-zA-Z0-9]*$|^[A-Z0-9_]+$"
    ],

    "typescript/no-explicit-any": 'warn',
    "typescript/no-empty-object-type": "off",
    "typescript/no-restricted-types": [
        "error",
        {
            types: {
                "Object": "Use `object` or an object literal",
                "Function": "Use function literals or the catch-all literal (`(this: any, ...args: any[]) => any`). If in a safe context, use the `Func` type provided by opti"
            },
        },
    ],

    "esdoc/require-jsdoc": [
        "error",
        {
            skipInterveningOverloadedDeclarations: true,
            contexts: jsdocPluginContexts
        }
    ],
    "esdoc/require-tags": ["error", { tags: ["since","opti"] }],
    "esdoc/require-param": ["error", { contexts: jsdocPluginContexts }],
    "esdoc/check-param-names": "error",
    "esdoc/require-description": "error",
    "esdoc/require-example": [
        "error",
        {
            contexts: [
                "TSDeclareFunction",
                "TSMethodSignature",
                "TSDeclareMethod"
            ]
        }
    ],
    "esdoc/require-returns": ["error", {
        forceRequireReturn: false,
        contexts: jsdocPluginContexts 
    }],
    "esdoc/sort-tags": [
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

export const typescriptRules: Linter.RulesRecord = {
    ...baseRules,
    ...definitionRules,

    'no-compare-neg-zero': 'error',

    "esdoc/require-jsdoc": 'off',
    "esdoc/require-tags": 'off',

    "typescript/consistent-return": 'off',
    "typescript/no-unsafe-type-assertion": 'off',
    "typescript/no-explicit-any": 'error',
    'typescript/no-non-null-assertion': 'warn',
    'typescript/no-unnecessary-type-assertion': 'warn',
    'typescript/array-type': ['error', { default: 'array' }],
    'typescript/no-floating-promises': 'error',
    'typescript/explicit-module-boundary-types': 'error'
};

export const testRules: Linter.RulesRecord = {
    ...typescriptRules,

    "typescript/no-explicit-any": "off",

    "vitest/expect-expect": "error",
    "vitest/max-nested-describe": ["error", { max: 1 }],
    "vitest/no-focused-tests": 'error',
    "vitest/no-disabled-tests": 'error',
    "vitest/valid-expect": 'error',
    "vitest/no-conditional-expect": 'error',
    "vitest/no-standalone-expect": 'error'
};