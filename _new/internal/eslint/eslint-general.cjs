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

/**
 * @template {string} MessageIds
 * @param {import("@typescript-eslint/utils").TSESLint.RuleMetaData<MessageIds>["type"]} type
 * @param {boolean} fixable
 * @param {Record<MessageIds, string>} messages
 * @param {((context: RuleContext<MessageIds, []>) => import("@typescript-eslint/utils").TSESLint.RuleListener) | import("@typescript-eslint/utils").TSESLint.RuleListener} create
 * @param {Partial<import("@typescript-eslint/utils").TSESLint.RuleMetaData<MessageIds>>} [extraMeta={}]
 * @returns {RuleModule<MessageIds, []>}
 */
function makePlugin(type, fixable, messages, create, extraMeta = {}) {
    return {
        meta: {
            type,
            ...(fixable && { fixable: "code" }),
            messages,
            schema: [],
            ...extraMeta
        },
        create: typeof create === "function"
            ? create
            : () => create
    };
}

//#region SingleLineControlFlow
const SQUOT = "'";
const DBLQUOT = '"';

const allowed = new Set([
    "ReturnStatement",
    "ContinueStatement",
    "BreakStatement",
    "ThrowStatement"
]);

/**
 * Check single-line control flow
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
//#endregion

//#region ConstrainedStrings
/**
 * Creates a quote fixer for the 
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
 * Checked if a string is a constrained string (? extends string, but ? != string)
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
 * Checks if the argument of a function is a constrained string (? extends string, but ? != string)
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

const constrainedStrings = makePlugin('suggestion', true, {
    typeof: "Typeof values must use single quotes.",
    types: "String literal types must use single quotes.",
    character: "Character literals must use single quotes.",
    multiCharacter: "String literals that are not 1 character long must use double quotes.",
    constrained: "Parameters with constrained string arguments must use single quotes"
}, function (context) {
    const services = context.sourceCode.parserServices;

    if (!services?.program) {
        throw new Error("Typescript configuration for eslint is required for this plugin to work");
    }

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
});
//#endregion

//#region ValidatedThrows
/** @type {RuleModule<"mismatchedThrows", []>} */
const validatedThrows = makePlugin('problem', false, {
    mismatchedThrows: `Expected implementation to be able to throw '{{expected}}'. Implementation actually throws '{{actual}}'.`
}, context => {
    const services = require("@typescript-eslint/utils")
        .ESLintUtils.getParserServices(context);

    const checker = services.program.getTypeChecker();

    /**
     * Gets the documented @throws types from a declaration.
     *
     * @param {import("typescript").Node} declaration
     * @returns {string[]}
     */
    function getThrowsTypes(declaration) {
        return ts.getJSDocTags(declaration)
            .filter(tag => tag.tagName.text === "throws" || tag.tagName.text === "exception")
            .map(tag => {
                const typeExpression = tag.getChildren()
                    .find(child => ts.isJSDocTypeExpression(child));
                return typeExpression
                    ? typeExpression.getText().replace(/^\{|\}$/g, "").trim()
                    : "unknown";
            }).sort();
    }

    /**
     * Gets the types of values thrown by an implementation.
     *
     * @param {import("typescript").Node} declaration
     * @returns {string[]}
     */
    function getActualThrowsTypes(declaration) {
        /** @type {Set<string>} */
        const types = new Set();

        /**
         * @param {import("typescript").Node} node
         */
        function visit(node) {
            if (
                node !== declaration &&
                (
                    ts.isFunctionDeclaration(node) ||
                    ts.isClassDeclaration(node)
                )
            ) {
                return;
            }

            if (ts.isThrowStatement(node) && node.expression) {
                const type = checker.getTypeAtLocation(node.expression);
                types.add(checker.typeToString(type));
                return;
            }

            ts.forEachChild(node, visit);
        }

        visit(declaration);
        return [...types].sort();
    }

    /**
     * Gets all declarations belonging to a symbol.
     *
     * @param {import("typescript").Symbol} symbol
     * @returns {import("typescript").Declaration[]}
     */
    function getDeclarations(symbol) {
        return [...(symbol.getDeclarations() ?? [])];
    }

    return {
        AssignmentExpression(node) {
            if (node.left.type !== "MemberExpression") return;
            if (node.right.type !== "MemberExpression") return;

            if (node.left.computed || node.right.computed) return;

            const assignment = services.esTreeNodeToTSNodeMap.get(node);

            if (!ts.isBinaryExpression(assignment)) return;
            if (!ts.isPropertyAccessExpression(assignment.left)) return;
            if (!ts.isPropertyAccessExpression(assignment.right)) return;

            const targetSymbol = checker.getSymbolAtLocation(
                assignment.left.name
            );

            const implementationSymbol = checker.getSymbolAtLocation(
                assignment.right.name
            );

            if (!targetSymbol || !implementationSymbol) return;

            // The .d.ts declaration is the source of truth.
            const declarations = getDeclarations(targetSymbol)
                .filter(declaration =>
                    declaration.getSourceFile().isDeclarationFile
                );

            const implementations = getDeclarations(implementationSymbol)
                .filter(declaration =>
                    !declaration.getSourceFile().isDeclarationFile
                );

            if (!declarations.length || !implementations.length) return;

            const expected = declarations.flatMap(getThrowsTypes).sort();
            const actual = implementations.flatMap(getActualThrowsTypes).sort();

            if (JSON.stringify(expected) === JSON.stringify(actual)) return;

            context.report({
                node,
                messageId: "mismatchedThrows",
                data: {
                    expected: expected.join(", ") || "(none)",
                    actual: actual.join(", ") || "(none)"
                }
            });
        }
    };
});
//#endregion
const plugin = {
    name: "eslint-multiline",
    /** @type {any} */// For compatibility
    rules: {
        "single-line-control-flow": singleLineControlFlow,
        "conditional-single": constrainedStrings,
        "validated-throws": validatedThrows
    }
};

module.exports = plugin;