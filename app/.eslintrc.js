module.exports = {
  root: true,
  extends: '@react-native',
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  env: {
    'jest/globals': true,
  },
  globals: {
    JSX: true,
  },
  ignorePatterns: ['src/networking/*', 'output/*'],
  rules: {
    'dot-notation': 'off',
    'no-shadow': 'off',
    'no-catch-shadow': 'off',
    'prettier/prettier': 'off',
    'react-native/no-inline-styles': 'off',
    'react-hooks/exhaustive-deps': 'off',
    curly: 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
};
