#!usr/bin/env node

const fs = require('fs');
const path = require('path');
const tsNode = require('ts-node');

const scriptPath = process.argv[2];
const scriptDir = path.dirname(scriptPath);

const tsconfig = fs.readdirSync(scriptDir)
  .find(f => /^tsconfig.*\.json$/.test(f));

if (!tsconfig) {
  console.error("No tsconfig found in dir:", scriptDir);
  process.exit(1);
}

tsNode.register({
  project: path.join(scriptDir, tsconfig)
});

require(path.resolve(scriptPath));