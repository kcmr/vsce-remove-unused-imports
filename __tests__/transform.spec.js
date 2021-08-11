const { transform } = require('../dist/transform');

it('removes unused import specifiers and import declarations', () => {
  const code = `
  import 'side-effects';
  import unUsedImport from 'package-1';
  import { used, unused } from 'package-2';
  import usedImport from 'package-3';
  import { something as alias } from 'package-4';
  import * as group from 'package-3';
  
  used();
  usedImport();
  alias.method();
  group.property;
  `;

  const result = transform(code);
  expect(result).toMatchSnapshot();
});
