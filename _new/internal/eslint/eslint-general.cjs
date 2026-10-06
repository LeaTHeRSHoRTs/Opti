//@ts-check

const { AST_NODE_TYPES } = require("@typescript-eslint/utils");

const allowed = new Set([
    "ReturnStatement",
    "ContinueStatement",
    "BreakStatement",
    "ThrowStatement"
]);

/**
 * @param {import("eslint").Rule.RuleContext} context
 * @param {import("estree").Statement} node
 */
function check(context, node) {
    if (node.type === AST_NODE_TYPES.BlockStatement) return;

    if (!allowed.has(node.type)) {
        context.report({
            node,
            message:
                "Single-line control flow is only allowed for return (value), continue, break, and throw."
        });
    }
}

/**
 * @type {import("eslint").Rule.RuleModule}
 */
const singleLineControlFlow = {
    meta: {
        type: "layout",
        schema: []
    },
    create(context) {
        return {
            IfStatement(node) {
                check(context, node.consequent);

                if (node.alternate) {
                    check(context, node.alternate);
                }
            },

            ForStatement(node) {
                check(context, node.body);
            },

            ForInStatement(node) {
                check(context, node.body);
            },

            ForOfStatement(node) {
                check(context, node.body);
            },

            WhileStatement(node) {
                check(context, node.body);
            },

            DoWhileStatement(node) {
                check(context, node.body);
            }
        };
    }
};

/**
 * @type {import("eslint").Rule.RuleModule}
 */
const conditionalSingles = {
    meta: {
        type: 'suggestion',
        hasSuggestions: true,
        schema: []
    },
    create(context) {
        return {
            Literal(node) {
                if (typeof node.value !== "string") return;

                const text = context.sourceCode.getText(node);

                if (node.value.length === 1) {
                    if (text.startsWith('"')) {
                        context.report({
                            node,
                            message: "Character literals must use single quotes"
                        })
                    }
                }  else {
                    if (text.startsWith("'")) {
                        context.report({
                            node,
                            message: "String literals must use double quotes."
                        });
                    }
                }
            },

            /**
             * @param {import("@typescript-eslint/utils").TSESTree.TSLiteralType} node
             */
            TSLiteralType(node) {
                if (node.literal.type !== "Literal") return;
                if (typeof node.literal.value !== "string") return;

                const text = context.sourceCode.getText(node);
            
                if (typeof node.literal.value !== "string") return;
            
                if (text.startsWith('"')) {
                    context.report({
                        node,
                        message: "String literal types must use single quotes."
                    });
                }
            }
        }
    }
} 

/**
 * @type {import("eslint").ESLint.Plugin}
 */
const plugin = {
    name: "eslint-multiline",
    rules: {
        "single-line-control-flow": singleLineControlFlow
    }
};

module.exports = plugin;