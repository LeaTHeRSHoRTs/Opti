import * as vscode from 'vscode';

const tokenTypes = ["opti"];

const legend = new vscode.SemanticTokensLegend(tokenTypes, []);

export function activate(context: vscode.ExtensionContext) {
  const provider = new JSDocOptiTagProvider();
  context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'typescript', scheme: 'file' }, provider, legend));
  context.subscriptions.push(vscode.languages.registerDocumentSemanticTokensProvider({ language: 'javascript', scheme: 'file' }, provider, legend));
}

class JSDocOptiTagProvider implements vscode.DocumentSemanticTokensProvider {
  private optiCache = new Set<string>();

  async provideDocumentSemanticTokens(document: vscode.TextDocument) {
    const builder = new vscode.SemanticTokensBuilder(legend);
    const text = document.getText();
    const wordRegex = /\b\w+\b/g;
    let match;

    const keywords = new Set(['function', 'const', 'let', 'var', 'async', 'class', 'interface', 'return', 'new']);

    while ((match = wordRegex.exec(text)) !== null) {
      const word = match[0];
      const startPos = document.positionAt(match.index);

      if (keywords.has(word)) continue;

      if (this.optiCache.has(word)) {
        builder.push(startPos.line, startPos.character, word.length, 0, 0);
        continue;
      }

      const hovers = await vscode.commands.executeCommand<vscode.Hover[]>(
        'vscode.executeHoverProvider',
        document.uri,
        startPos
      );

      if (!hovers || hovers.length === 0) continue;

      const hasOpti = hovers.some(hover => 
        hover.contents.some(content => {
          const val = typeof content === 'object' && 'value' in content ? content.value : content.toString();
          return val.includes('@opti');
        })
      );

      if (hasOpti) {
        this.optiCache.add(word);
        builder.push(startPos.line, startPos.character, word.length, 0);
      }
    }
    return builder.build();
  }
}

export function deactivate() { }