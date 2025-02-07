import { NodePath, PluginObj, types } from '@babel/core';

type ImportSpecifier =
  | types.ImportDefaultSpecifier
  | types.ImportNamespaceSpecifier
  | types.ImportSpecifier;

class ImportTracker {
  private decorators = new Set<string>();
  private typeParameters = new Set<string>();

  addDecorator(name: string) {
    this.decorators.add(name);
  }

  addTypeParameter(name: string) {
    this.typeParameters.add(name);
  }

  shouldPreserve(name: string, userPreserved?: string[]) {
    return (
      this.decorators.has(name) ||
      this.typeParameters.has(name) ||
      userPreserved?.includes(name)
    );
  }
}

function isUnusedImportSpecifier(path: NodePath<ImportSpecifier>) {
  return !path.scope.bindings[path.node.local.name].referenced;
}

function hasAllSpecifiersRemoved(path: NodePath<types.ImportDeclaration>) {
  return path.get('specifiers').length === 0;
}

function collectParameterDecorators(
  path: NodePath<types.TSParameterProperty>,
  tracker: ImportTracker,
) {
  path.node.decorators?.forEach(({ expression }) => {
    if (expression.type !== 'CallExpression') return;

    if (expression.callee.type === 'Identifier') {
      tracker.addDecorator(expression.callee.name);
    }

    expression.arguments.forEach((arg) => {
      if (arg.type === 'Identifier') {
        tracker.addDecorator(arg.name);
      }
    });
  });
}

function collectJSXTypeParameters(
  path: NodePath<types.JSXElement>,
  tracker: ImportTracker,
) {
  const openingElement = path.node.openingElement;
  if (openingElement.typeParameters) {
    openingElement.typeParameters.params.forEach((param) => {
      if (
        param.type === 'TSTypeReference' &&
        param.typeName.type === 'Identifier'
      ) {
        tracker.addTypeParameter(param.typeName.name);
      }
    });
  }
}

export function removeUnusedImports(preserve?: string[]): PluginObj {
  const tracker = new ImportTracker();

  return {
    visitor: {
      Program(path: NodePath<types.Program>) {
        path.traverse({
          TSParameterProperty(path: NodePath<types.TSParameterProperty>) {
            collectParameterDecorators(path, tracker);
          },
          JSXElement(path: NodePath<types.JSXElement>) {
            collectJSXTypeParameters(path, tracker);
          },
        });
      },
      ImportDeclaration(path: NodePath<types.ImportDeclaration>) {
        path.get('specifiers').forEach((specifier) => {
          const localName = specifier.node.local.name;
          if (tracker.shouldPreserve(localName, preserve)) return;

          isUnusedImportSpecifier(specifier) && specifier.remove();
          hasAllSpecifiersRemoved(path) && path.remove();
        });
      },
    },
  };
}
