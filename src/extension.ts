import { commands, ExtensionContext, languages } from 'vscode';
import CodeActionsProvider from './CodeActionsProvider';
import { removeUnusedImports } from './commands';

export function activate(context: ExtensionContext) {
  const codeActionsProvider = new CodeActionsProvider();

  context.subscriptions.push(
    commands.registerCommand('remove-unused-imports.main', removeUnusedImports),

    languages.registerCodeActionsProvider(
      { scheme: 'file', pattern: '**/*.{js,jsx,ts,tsx}' },
      codeActionsProvider,
      {
        providedCodeActionKinds: CodeActionsProvider.codeActionKinds,
      },
    ),
  );
}
