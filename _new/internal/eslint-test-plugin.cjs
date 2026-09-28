//@ts-ignore

const { AST_NODE_TYPES } = require('@typescript-eslint/utils');
const fs = require('fs');
const ts = require('typescript');
const GLOBAL_IDENTIFIER = "globalThis";

/**
 * @param {string} filePath
 * @returns {Set<string>}
 */
function getImportedSets(filePath) {
  if (!fs.existsSync(filePath)) throw new Error(`File ${filePath} could not be found.`);
  const code = fs.readFileSync(filePath, 'utf8');
  const sourceFile = ts.createSourceFile(filePath, code, ts.ScriptTarget.Latest, true);
  /** @type {Set<string>} */
  const identifiers = new Set();

  function visit(/** @type {ts.Node | null} */ node) {
    if (!node) return;

    if (ts.isMethodSignature(node) || ts.isPropertySignature(node)) {
      const name = node.name?.getText();

      let parentNode = GLOBAL_IDENTIFIER;
      /** @type {ts.Node} */
      let p = node.parent;

      while (p) {
        if (ts.isInterfaceDeclaration(p)) {
          parentNode = p.name.getText();
          break;
        } 
        p = p.parent;
      }
      // console.log(`${parentNode},${name}`);
      if (name) identifiers.add(`${parentNode},${name}`);
    }

    if (ts.isClassDeclaration(node) || ts.isVariableDeclaration(node)) {
      const name = node.name?.getText();
      const parentNode = ts.isInterfaceDeclaration(node.parent) ? node.parent.name.getText() : GLOBAL_IDENTIFIER;
      // console.log(`${parentNode},${name}`);
      if (name) identifiers.add(`${parentNode},${name}`);
    }
    
    ts.forEachChild(node, visit);
  }

  visit(sourceFile);
  return identifiers;
}

/**
 * @returns {import('eslint').ESLint.Plugin}
 * @param {string} moduleImport
 * @param {string} file
 */
function createTestResolutionPlugin(moduleImport, file) {
  const restricted = getImportedSets(file);
  const internalModuleImport = moduleImport === "opti" ? moduleImport : `opti/${moduleImport}`;

  return {
    name: `eslint-${moduleImport}-test-plugin`,
    version: "1.0.0",
    rules: {
      "import-restricted": {
        meta: { type: "problem" },
        create(context) {
          let hasImport = false;

          return {
            /** @param {import('@typescript-eslint/utils').TSESTree.ImportDeclaration} node */ 
            ImportDeclaration(node) {
              if (node.source.value === internalModuleImport) hasImport = true;
            },
            Identifier(/** @type {import('@typescript-eslint/utils').TSESTree.Identifier} */ node) {
              if (hasImport) return;

              let parentNode = GLOBAL_IDENTIFIER;
              
              const parent = node.parent;
              if (parent.type === AST_NODE_TYPES.MemberExpression) {
                if (parent.property === node) {
                  parentNode = "Node"; 
                }
              } else if (parent.type === AST_NODE_TYPES.TSInterfaceDeclaration) {
                parentNode = parent.id.name;
              }

              if (restricted.has(`${parentNode},${node.name}`)) {
                console.log(`Restricted: ${parentNode},${node.name}`);
                context.report({
                  node,
                  message: `Member ${parentNode}.${node.name} requires an import from ${internalModuleImport} for vitest.`
                })
              }
            }
          }
        }
      }
    },
    configs: {
      
    },
    processors: {

    }
  };
}

module.exports = createTestResolutionPlugin;