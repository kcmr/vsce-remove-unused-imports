import { commands, ExtensionContext, languages, workspace } from 'vscode';
import CodeActionsProvider from './CodeActionsProvider';
import { removeUnusedImports } from './commands';

export function activate(context: ExtensionContext) {
  const codeActionsProvider = new CodeActionsProvider();

  const preserve = workspace
    .getConfiguration('removeUnusedImports')
    .get<string[]>('preserve');

  context.subscriptions.push(
    commands.registerCommand(
      'remove-unused-imports.main',
      removeUnusedImports(preserve),
    ),

    languages.registerCodeActionsProvider(
      { scheme: 'file', pattern: '**/*.{js,jsx,ts,tsx}' },
      codeActionsProvider,
      {
        providedCodeActionKinds: CodeActionsProvider.codeActionKinds,
      },
    ),
  );
}
