module.exports = function (api) {
  api.cache(true);

  let plugins = [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
          '.jsx',
        ],
        alias: {
          '@cambo': './src',
          '@native-modules': './src/native-modules',
        },
      },
    ],
    'lodash',
    'react-native-reanimated/plugin',
  ];

  if (
    process.env.NODE_ENV === 'production' ||
    process.env.BABEL_ENV === 'production'
  ) {
    // add transformer to remove console logs
    plugins.push(['transform-remove-console', { exclude: ['error', 'warn'] }]);
  }

  return {
    presets: ['module:metro-react-native-babel-preset'],
    plugins,
  };
};
