import { Range } from 'vscode';

export const extensionLanguages = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
];

export const maxRange: Range = new Range(
  0,
  0,
  Number.MAX_VALUE,
  Number.MAX_VALUE,
);
