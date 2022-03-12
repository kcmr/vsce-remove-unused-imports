import { parse, print } from 'recast';
import { transformFromAstSync, parseSync } from '@babel/core';
import { removeUnusedImports } from './plugin';

const options = {
  cloneInputAst: false,
  code: false,
  ast: true,
  plugins: [removeUnusedImports],
};

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

  const { ast: babelAst } = transformFromAstSync(ast, code, options)!;

  return babelAst && print(babelAst).code;
}
