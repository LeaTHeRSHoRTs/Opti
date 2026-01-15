"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = __importStar(require("vscode"));
const tokenTypes = ["opti"];
const legend = new vscode.SemanticTokensLegend(tokenTypes, []);
function activate(context) {
    const provider = new JSDocOptiTagProvider();
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'typescript', scheme: 'file' }, provider, legend));
    context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'javascript', scheme: 'file' }, provider, legend));
}
class JSDocOptiTagProvider {
    optiCache = new Set();
    async provideDocumentSemanticTokens(document) {
        const builder = new vscode.SemanticTokensBuilder(legend);
        const text = document.getText();
        const wordRegex = /\b\w+\b/g;
        let match;
        const keywords = new Set(['function', 'const', 'let', 'var', 'async', 'class', 'interface', 'return', 'new']);
        while ((match = wordRegex.exec(text)) !== null) {
            const word = match[0];
            const startPos = document.positionAt(match.index);
            if (keywords.has(word))
                continue;
            if (this.optiCache.has(word)) {
                builder.push(startPos.line, startPos.character, word.length, 0, 0);
                continue;
            }
            const hovers = await vscode.commands.executeCommand('vscode.executeHoverProvider', document.uri, startPos);
            if (!hovers || hovers.length === 0)
                continue;
            const hasOpti = hovers.some(hover => hover.contents.some(content => {
                const val = typeof content === 'object' && 'value' in content ? content.value : content.toString();
                return val.includes('@opti');
            }));
            if (hasOpti) {
                this.optiCache.add(word);
                builder.push(startPos.line, startPos.character, word.length, 0);
            }
        }
        return builder.build();
    }
}
function deactivate() { }
//# sourceMappingURL=extension.js.map