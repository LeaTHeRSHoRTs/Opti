import fs from 'fs';
import path from 'path';
import ts from 'typescript';

function getDtsPaths(dir: string): string[] {
  let results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(getDtsPaths(fullPath));
    } else {
      results.push(fullPath);
    }
  }

  return results;
}

const parts = [
  "Opti",
  "Crafty",
  "Query",
  "Unsync",
  "Requests",
  "Flow",
  "Store"
] as const;

function filterOutLibs(arr: string[]): Record<(typeof parts)[number], string> {
  const results: Partial<Record<(typeof parts)[number], string | null>> = {};

  for (const part of parts) results[part] = null;

  arr.forEach(file => {
    if (!file.includes(".lib.")) return;
    const parent = path.basename(path.dirname(file));
    const key = parts.includes(parent as typeof parts[number])
      ? (parent as typeof parts[number])
      : "Opti";

    results[key] = file;
  });

  // check for missing files
  const missing = Object.entries(results)
    .filter(([_, v]) => v === null)
    .map(([k]) => k);

  if (missing.length > 0) throw new Error(`Missing lib files: ${missing.join(", ")}`);

  // type assertion is safe now
  return results as Record<(typeof parts)[number], string>;
};

const dtsPaths = filterOutLibs(getDtsPaths(path.resolve(__dirname, "..", "types")));
const jsonSourceFiles: Record<string, ts.SourceFile> = {};
for (const [k, v] of Object.entries(dtsPaths)) {
  jsonSourceFiles[k] = ts.createSourceFile(
    v,
    fs.readFileSync(v, 'utf-8'),
    ts.ScriptTarget.Latest,
    /* setParentNodes */ true,
    ts.ScriptKind.TS
  );
};

interface DocMap {
  __doc__?: string;
  [key: string]: string | DocMap | undefined;
};

function extractJsDoc(node: ts.Node) {
  const docs: DocMap = {};

  function visit(doc: DocMap, n: ts.Node) {
    let name: string | undefined;

    if (ts.isVariableStatement(n)) {
      // 1. Get the JSDoc from the STATEMENT (the whole line)
      const jsDocNodes = (n as any).jsDoc as ts.JSDoc[] | undefined;
      
      // Use optional chaining or a null check to prevent the TypeError
      const commentText = jsDocNodes?.map(d => d.getText()).join("\n") || "";

      // 2. Iterate through the declarations on that statement
      n.declarationList.declarations.forEach((decl) => {
        const varName = decl.name.getText();
        // Use the comment from the parent statement for each variable
        doc[varName] = { "__doc__": commentText };
      });
      
      return; // Stop; children of variables usually aren't documented separately
    }

    if (
      ts.isInterfaceDeclaration(n) || ts.isClassDeclaration(n) ||
      ts.isFunctionDeclaration(n) || ts.isTypeAliasDeclaration(n) ||
      ts.isEnumDeclaration(n) || ts.isPropertySignature(n) ||
      ts.isMethodSignature(n)
    ) {
      name = n.name?.getText();
    }


    if (name) {
      const entry = doc[name];
      const subDoc: DocMap = (typeof entry === 'object' && entry !== null) 
      ? entry 
      : (doc[name] = {});

      // Extract JSDoc safely
      const jsDocNodes = (n as any).jsDoc as ts.JSDoc[] | undefined;
      if (jsDocNodes) {
        subDoc["__doc__"] = jsDocNodes.map(d => d.getText()).join("\n");
      }

      // Recurse into this node's children
      ts.forEachChild(n, child => visit(subDoc, child));
    } else {
      ts.forEachChild(n, child => visit(doc, child));
    }

    ts.forEachChild(n, n => visit(docs, n));
  }

  visit(docs, node);
  return docs;
}

for (const [k, sourceFile] of Object.entries(jsonSourceFiles)) {
  const docData = extractJsDoc(sourceFile);
  fs.writeFileSync(path.resolve(__dirname, "..", "assets", k + ".json"), JSON.stringify(docData, null, 2), "utf-8");
}