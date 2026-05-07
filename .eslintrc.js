module.exports = {
  root: true,
  extends: '@react-native',

  ignorePatterns: [
    'babel.config.js',
    'metro.config.js',
    'jest.config.js',
    'react-native.config.js',
    '.eslintrc.js',
  ],

  overrides: [
    {
      files: ['**/*.ts', '**/*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
      rules: {
        '@typescript-eslint/no-deprecated': 'warn',
      },
    },
  ],
};
