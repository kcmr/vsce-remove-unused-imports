import { parse, print } from 'recast';
import { BabelFileResult, transformFromAstSync } from '@babel/core';
import { removeUnusedImports } from './plugin';

const options = {
  cloneInputAst: false,
  code: false,
  ast: true,
  plugins: [removeUnusedImports],
};

export function transform(code: string) {
  const ast = parse(code, {
    parser: require('recast/parsers/babel'),
  });

  const { ast: babelAst } = transformFromAstSync(
    ast,
    code,
    options,
  ) as BabelFileResult;

  return babelAst && print(babelAst).code;
}
