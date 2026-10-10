//@ts-check

/**
 * @template {string} MessageIds
 * @template {readonly unknown[]} Options
 * @typedef {import("@typescript-eslint/utils").TSESLint.RuleModule<MessageIds, Options>} RuleModule
 */

/**
 * @template {string} MessageIds
 * @template {readonly unknown[]} Options
 * @typedef {import("@typescript-eslint/utils").TSESLint.RuleContext<MessageIds, Options>} RuleContext
 */

/**
 * @typedef {import("@typescript-eslint/utils").TSESTree.Statement} Statement
 * @typedef {import("@typescript-eslint/utils").TSESTree.Literal} Literal
 */

const { AST_NODE_TYPES } = require("@typescript-eslint/utils");
const ts = require("typescript");

const SQUOT = "'";
const DBLQUOT = '"';

const allowed = new Set([
    "ReturnStatement",
    "ContinueStatement",
    "BreakStatement",
    "ThrowStatement"
]);

/**
 * @param {RuleContext<string, []>} context
 * @param {Statement} node
 */
function check(context, node) {
    if (node.type === AST_NODE_TYPES.BlockStatement) return;

    if (!allowed.has(node.type)) {
        context.report({
            node,
            messageId: "quote",
            fix(fixer) {
                return [
                    fixer.insertTextBefore(node, "{\n"),
                    fixer.insertTextAfter(node, "\n}")
                ];
            }
        });
    }
}

/**
 * 
 * @param {import("@typescript-eslint/utils").TSESLint.RuleFixer} fixer 
 * @param {Literal} node
 * @param {string} text 
 * @param {string} quote 
 * @returns 
 */
function quoteFix(fixer, node, text, quote) {
    return fixer.replaceText(node, `${quote}${text.slice(1, -1)}${quote}`);
}

/**
 * @param {import("typescript").Type} type
 * @param {import("typescript").TypeChecker} checker
 * @returns {boolean}
 */
function isConstrainedString(type, checker) {
    if (type.flags & ts.TypeFlags.StringLiteral) return true;
    if (type.isUnion()) return type.types.every(type => isConstrainedString(type, checker));

    if (type.flags & ts.TypeFlags.TypeParameter) {
        const constraint = type.getConstraint();

        if (!constraint) return false;

        return isConstrainedString(constraint, checker);
    }

    return false;
}

/**
 * 
 * @param {RuleContext<string, []>} context 
 * @param {Literal} node 
 * @returns 
 */
function isConstrainedArgument(context, node) {
    const services = context.sourceCode.parserServices;
    const checker = services?.program?.getTypeChecker();

    if (!checker || !services) return false;

    if (node.parent?.type !== "CallExpression") return false;

    const call = node.parent;
    const index = call.arguments.indexOf(node);

    if (index === -1) return false;

    const tsCall = services.esTreeNodeToTSNodeMap?.get(call);

    if (!tsCall) return false;

    const signature = checker.getResolvedSignature(tsCall);

    if (!signature) return false;

    const parameter = signature.parameters[index];

    if (!parameter) return false;

    const declaration = parameter.valueDeclaration;

    if (!declaration) return false;

    const parameterType = checker.getTypeAtLocation(declaration);

    if (parameterType.flags & ts.TypeFlags.TypeParameter) {
        const signatureDeclaration = signature.getDeclaration();

        if (signatureDeclaration) {
            const typeParameter = signatureDeclaration.typeParameters?.find(
                typeParameter =>
                    typeParameter.name.escapedText ===
                    parameterType.symbol?.escapedName
            );

            if (!typeParameter) return;

            const constraint = typeParameter.constraint;

            if (
                constraint &&
                ts.isUnionTypeNode(constraint)
            ) {
                for (const member of constraint.types) {
                    if (
                        ts.isTypeReferenceNode(member) &&
                        ts.isIdentifier(member.typeName) &&
                        (
                            member.typeName.text === "Classes" ||
                            member.typeName.text === "Methods"
                        )
                    ) {
                        return true;
                    }
                }
            }
        }
    }

    return isConstrainedString(parameterType, checker);
}


/** @type {RuleModule<"quote", []>} */
const singleLineControlFlow = {
    meta: {
        type: "layout",
        messages: {
            quote: "Single-line control flow is only allowed for return (value), continue, break, and throw."
        },
        fixable: 'code',
        hasSuggestions: true,
        schema: []
    },
    create(context) {
        return {
            IfStatement(node) {
                check(context, node.consequent);

                if (node.alternate && node.alternate.type !== AST_NODE_TYPES.IfStatement) {
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

/** @type {RuleModule<"types" | "character" | "multiCharacter" | "typeof" | "constrained", []>} */
const conditionalSingles = {
    meta: {
        type: 'suggestion',
        fixable: "code",
        messages: {
            typeof: "Typeof values must use single quotes.",
            types: "String literal types must use single quotes.",
            character: "Character literals must use single quotes.",
            multiCharacter: "String literals that are not 1 character long must use double quotes.",
            constrained: "Parameters with constrained string arguments must use single quotes"
        },
        hasSuggestions: true,
        schema: []
    },
    create(context) {
        const services = context.sourceCode.parserServices;

        if (!services?.program) {
            throw new Error("Typescript configuration for eslint is required for this plugin to work");
        }

        const checker = services.program.getTypeChecker();

        return {
            Literal(node) {
                if (typeof node.value !== "string") return;
                if (node.parent?.type === "TSLiteralType") return;

                const text = context.sourceCode.getText(node);

                if (isConstrainedArgument(context, node)) {
                    if (text.startsWith('"')) {
                        context.report({
                            node,
                            messageId: "constrained",
                            fix(fixer) {
                                return quoteFix(fixer, node, text, SQUOT);
                            }
                        });
                    }
                } else if (
                    node.parent?.type === "BinaryExpression" &&
                    node.parent.right === node &&
                    node.parent.left.type === "UnaryExpression" &&
                    node.parent.left.operator === "typeof"
                ) {
                    if (text.startsWith('"')) {
                        context.report({
                            node,
                            messageId: "typeof",
                            fix(fixer) {
                                return quoteFix(fixer, node, context.sourceCode.getText(node), SQUOT)
                            }
                        });
                    }
                } else if (node.parent?.type === "ImportDeclaration") {
                    if (text.startsWith('"')) {
                        context.report({
                            node,
                            messageId: "multiCharacter",
                            fix(fixer) {
                                return quoteFix(fixer, node, context.sourceCode.getText(node), SQUOT)
                            }
                        });
                    }
                } else if (node.value.length === 1) {
                    if (text.startsWith('"')) {
                        context.report({
                            node,
                            messageId: "character",
                            fix(fixer) {
                                return quoteFix(fixer, node, context.sourceCode.getText(node), SQUOT)
                            }
                        })
                    }
                } else {
                    if (text.startsWith("'")) {
                        context.report({
                            node,
                            messageId: "multiCharacter",
                            fix(fixer) {
                                return quoteFix(fixer, node, context.sourceCode.getText(node), DBLQUOT)
                            }
                        });
                    }
                }
            },

            /**
             * @param {any} node
             */
            TSLiteralType(node) {
                if (node.literal.type !== "Literal") return;
                if (typeof node.literal.value !== "string") return;

                const text = context.sourceCode.getText(node);

                if (text.startsWith('"')) {
                    context.report({
                        node,
                        messageId: "types",
                        fix(fixer) {
                            return quoteFix(fixer, node, context.sourceCode.getText(node), SQUOT)
                        }
                    });
                }
            }
        }
    }
}

const plugin = {
    name: "eslint-multiline",
    /** @type {any} */// For compatibility
    rules: {
        "single-line-control-flow": singleLineControlFlow,
        "conditional-single": conditionalSingles
    }
};

module.exports = plugin;