module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  globals: {
    require: true,
    module: true,
  },
  rules: {
    'no-var': 2,
    'no-console': 2,
    'dot-notation': 2,
    'prefer-const': 2,
    '@typescript-eslint/member-delimiter-style': 0,
  },

  overrides: [
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 0,
        '@typescript-eslint/explicit-function-return-type': 0,
      },
    },
    {
      files: ['**/*.spec.js'],
      rules: {
        'prefer-arrow-callback': 0,
        'func-names': 0,
      },
      env: { mocha: true },
    },
  ],
}
