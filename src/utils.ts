import { TextDocument } from 'vscode';
import { extensionLanguages } from './constants';

export function isValidDocumentLanguage(document: TextDocument) {
  return extensionLanguages.some((language) =>
    document.languageId.includes(language),
  );
}
