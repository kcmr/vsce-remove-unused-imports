import { NodePath, PluginObj, types } from '@babel/core';

type ImportSpecifier =
  | types.ImportDefaultSpecifier
  | types.ImportNamespaceSpecifier
  | types.ImportSpecifier;

function isUnusedImportSpecifier(path: NodePath<ImportSpecifier>) {
  return !path.scope.bindings[path.node.local.name].referenced;
}

function hasAllSpecifiersRemoved(path: NodePath<types.ImportDeclaration>) {
  return path.get('specifiers').length === 0;
}

export function removeUnusedImports(): PluginObj {
  return {
    visitor: {
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        path.get('specifiers').forEach((specifier) => {
          isUnusedImportSpecifier(specifier) && specifier.remove();
          hasAllSpecifiersRemoved(path) && path.remove();
        });
      },
    },
  };
}
