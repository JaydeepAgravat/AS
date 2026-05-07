module.exports = {
  presets: ['module:@react-native/babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./'],
        alias: {
          '@api': './src/api',
          '@assets': './src/assets',
          '@components': './src/components',
          '@config': './src/config',
          '@context': './src/context',
          '@navigation': './src/navigation',
          '@screens': './src/screens',
          '@appTypes': './src/appTypes',
          '@utils': './src/utils',
        },
      },
    ],
  ],
};
