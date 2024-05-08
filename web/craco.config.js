const CracoAlias = require('craco-alias');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: {
      resolve: {
        fallback: {
          crypto: false, // require.resolve("crypto-browserify") can be polyfilled here if needed
          stream: false, // require.resolve("stream-browserify") can be polyfilled here if needed
          assert: false, // require.resolve("assert") can be polyfilled here if needed
          http: false, // require.resolve("stream-http") can be polyfilled here if needed
          https: false, // require.resolve("https-browserify") can be polyfilled here if needed
          os: false, // require.resolve("os-browserify") can be polyfilled here if needed
          url: false, // require.resolve("url") can be polyfilled here if needed
          zlib: false, // require.resolve("browserify-zlib") can be polyfilled here if needed
        },
      },
      module: {
        rules: [
          {
            test: /\.(js|mjs|jsx)$/,
            enforce: 'pre',
            loader: require.resolve('source-map-loader'),
            resolve: {
              fullySpecified: false,
            },
          },
        ],
      },
      ignoreWarnings: [
        // INFO:this can be ignored due to CRA: ref: https://github.com/facebook/create-react-app/discussions/11767
        function ignoreSourcemapsloaderWarnings(warning) {
          return (
            warning.module &&
            warning.module.resource.includes('node_modules') &&
            warning.details &&
            warning.details.includes('source-map-loader')
          );
        },
      ],
    },
    plugins: [
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
        process: 'process/browser',
      }),
    ],
  },
  babel: {
    presets: ['@emotion/babel-preset-css-prop'],
  },
  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: 'tsconfig',
        baseUrl: '.',
        tsConfigPath: './tsconfig.paths.json',
      },
    },
    {
      plugin: require('craco-plugin-scoped-css'),
    },
  ],
};
