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
    'no-var': 'error',
    'no-console': 'error',
    'dot-notation': 'error',
    'prefer-const': 'error',
  },
  overrides: [
    {
      files: ['**/*.ts'],
      rules: {
        '@typescript-eslint/member-delimiter-style': 'off',
        '@typescript-eslint/member-ordering': 'warn',
        '@typescript-eslint/explicit-member-accessibility': [
          'warn',
          { overrides: { constructors: 'no-public' } },
        ],
      },
    },
    {
      files: ['**/*.js'],
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
      },
    },
    {
      files: ['**/*.spec.js'],
      rules: {
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
      },
      env: { mocha: true },
    },
  ],
}
