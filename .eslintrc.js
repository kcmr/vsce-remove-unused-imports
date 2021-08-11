module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ['standard', 'prettier'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  plugins: ['jest', '@typescript-eslint'],
  overrides: [
    {
      files: ['__tests__/*.js'],
      env: {
        'jest/globals': true,
      },
      rules: {
        'node/no-unpublished-require': 'off',
      },
    },
  ],
};
