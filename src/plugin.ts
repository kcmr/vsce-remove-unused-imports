import { NodePath, PluginObj, types } from '@babel/core';

type ImportSpecifier =
  | types.ImportDefaultSpecifier
  | types.ImportNamespaceSpecifier
  | types.ImportSpecifier;

const decorators = new Set();

function isUnusedImportSpecifier(path: NodePath<ImportSpecifier>) {
  return !path.scope.bindings[path.node.local.name].referenced;
}

function hasAllSpecifiersRemoved(path: NodePath<types.ImportDeclaration>) {
  return path.get('specifiers').length === 0;
}

function collectParameterDecorators(path: NodePath<types.TSParameterProperty>) {
  path.node.decorators?.forEach(({ expression }) => {
    if (expression.type !== 'CallExpression') return;

    if (expression.callee.type === 'Identifier') {
      decorators.add(expression.callee.name);
    }

    expression.arguments.forEach((arg) => {
      if (arg.type === 'Identifier') {
        decorators.add(arg.name);
      }
    });
  });
}

export function removeUnusedImports(preserve?: string[]): PluginObj {
  return {
    visitor: {
      Program(path: NodePath<types.Program>) {
        path.traverse({
          TSParameterProperty(path: NodePath<types.TSParameterProperty>) {
            collectParameterDecorators(path);
          },
        });
      },
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        path.get('specifiers').forEach((specifier) => {
          if (decorators.has(specifier.node.local.name)) return;
          if (preserve?.includes(specifier.node.local.name)) return;

          isUnusedImportSpecifier(specifier) && specifier.remove();
          hasAllSpecifiersRemoved(path) && path.remove();
        });
      },
    },
  };
}
