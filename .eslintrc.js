// .eslintrc.js
module.exports = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
      project: ['tsconfig.json'],
      sourceType: 'module',
    },
    plugins: ['@typescript-eslint', 'prettier'],
    extends: [
      'plugin:@typescript-eslint/recommended',
      'plugin:prettier/recommended',
    ],
    ignorePatterns: ['dist', 'node_modules'],
    rules: {
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      'prettier/prettier': ['error'],
    },
  };
  