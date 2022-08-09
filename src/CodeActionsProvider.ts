import {
  CodeAction,
  CodeActionKind,
  CodeActionProvider,
  ProviderResult,
} from 'vscode';

const SOURCE_REMOVE_UNUSED_IMPORTS = CodeActionKind.Source.append(
  'removeUnusedImports',
);

export default class CodeActionsProvider implements CodeActionProvider {
  provideCodeActions(): ProviderResult<CodeAction[]> {
    return [this.createRemoveUnusedCommand()];
  }

  public static readonly codeActionKinds = [SOURCE_REMOVE_UNUSED_IMPORTS];

  private createRemoveUnusedCommand(): CodeAction {
    const action = new CodeAction(
      'Remove unused imports',
      SOURCE_REMOVE_UNUSED_IMPORTS,
    );

    action.command = {
      command: 'remove-unused-imports.main',
      title: action.title,
    };

    return action;
  }
}
