import { parse, print } from 'recast';
import { transformFromAstSync, parseSync, TransformOptions } from '@babel/core';
import { removeUnusedImports } from './plugin';

export function transform(code: string) {
  const ast = parse(code, {
    parser: {
      parse(code: string) {
        return parseSync(code, {
          plugins: [
            require('@babel/plugin-syntax-jsx'),
            [require('@babel/plugin-syntax-typescript'), { isTSX: true }],
            [require('@babel/plugin-proposal-decorators'), { legacy: true }],
          ],
          parserOpts: {
            tokens: true,
          },
        });
      },
    },
  });

  const { ast: babelAst } = transformFromAstSync(ast, code, {
    cloneInputAst: false,
    code: false,
    ast: true,
    plugins: [removeUnusedImports],
  } as TransformOptions)!;

  return babelAst && print(babelAst).code;
}
