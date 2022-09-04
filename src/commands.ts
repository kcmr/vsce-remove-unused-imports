import { window, workspace } from 'vscode';
import { maxRange } from './constants';
import { transform } from './transform';
import { isValidDocumentLanguage } from './utils';

async function getProjectConfigFile() {
  const files = await workspace.findFiles('(ts|js)config.json');
  console.log(files);
}

export function removeUnusedImports() {
  const { activeTextEditor: editor } = window;
  getProjectConfigFile();

  if (!editor || !editor.document) {
    return;
  }

  if (!isValidDocumentLanguage(editor.document)) {
    return;
  }

  const result = transform(editor.document.getText());

  if (result) {
    return editor.edit((edit) => edit.replace(maxRange, result));
  }
}
