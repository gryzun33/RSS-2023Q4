module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  plugins: ['@typescript-eslint'],
  extends: ['airbnb-base', 'airbnb-typescript/base', 'prettier'],
  parser: '@typescript-eslint/parser',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: './tsconfig.json',
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 2,
    'no-console': 'off',
    'lines-between-class-members': 'off',
    '@typescript-eslint/lines-between-class-members': 'off',
    'class-methods-use-this': 'off',
  },
};
