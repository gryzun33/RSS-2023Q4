module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base', 'prettier'],
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
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    'import/extensions': 'off',
  },
};

// rules: {
//   'no-param-reassign': 0,
//   'import/prefer-default-export': 0,
//   'no-inner-declarations': 0,
//   'operator-linebreak': 0,
//   'import/no-unresolved': 0,
// },
