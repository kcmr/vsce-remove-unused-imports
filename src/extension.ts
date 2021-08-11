import { commands, ExtensionContext } from 'vscode';
import { removeUnusedImports } from './commands';

export function activate({ subscriptions }: ExtensionContext) {
  subscriptions.push(
    commands.registerCommand('remove-unused-imports.main', removeUnusedImports),
  );
}
