import { window } from 'vscode';
import { maxRange } from './constants';
import { transform } from './transform';
import { isValidDocumentLanguage } from './utils';

export function removeUnusedImports(preserve?: string[]) {
  return function () {
    const { activeTextEditor: editor } = window;

    if (!editor || !editor.document) {
      return;
    }

    if (!isValidDocumentLanguage(editor.document)) {
      return;
    }

    const result = transform(editor.document.getText(), preserve);

    if (result) {
      return editor.edit((edit) => edit.replace(maxRange, result));
    }
  };
}
