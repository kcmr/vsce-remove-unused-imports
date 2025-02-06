import { parse, print } from 'recast';
import { transformFromAstSync, parseSync, TransformOptions } from '@babel/core';
import { removeUnusedImports } from './plugin';

export function transform(code: string, preserve?: string[]) {
  const ast = parse(code, {
    parser: {
      parse(code: string) {
        return parseSync(code, {
          parserOpts: {
            tokens: true,
            errorRecovery: true,
            plugins: ['jsx', 'typescript', 'decorators-legacy'],
          },
        });
      },
    },
  });

  const { ast: babelAst } = transformFromAstSync(ast, code, {
    cloneInputAst: false,
    code: false,
    ast: true,
    plugins: [removeUnusedImports(preserve)],
  } as TransformOptions)!;

  return babelAst && print(babelAst).code;
}
