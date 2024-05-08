module.exports = {
  preset: 'react-native',
  verbose: true,
  globals: {
    __DEV__: true,
  },
  modulePathIgnorePatterns: ['<rootDir>/e2e/'],
  setupFilesAfterEnv: [
    './src/setup-tests.js',
    './node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  transform: {
    '\\.[jt]sx?$': 'ts-jest',
    '\\.[jt]sx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/fileTransformer.js',
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx,js,jsx}',
    '!src/anything.d.ts',
    '!src/types.ts',
    '!src/assets/*',
    '!src/demo',
    '!src/**/*/index.{ts,js}',
    '!src/index.tsx',
    '!src/store.ts',
    '!src/**/*/*.theme.{ts,js}',
    '!src/stores/*',
    '!src/navigators/*',
    '!src/networking/**/*',
    '!src/App.tsx',
    '!src/contexts/*',
  ],
  testEnvironment: 'node',
  reporters: ['default', 'jest-junit'],
  coverageReporters: ['text', 'html'],
  coverageDirectory: './output/coverage/',
  coveragePathIgnorePatterns: ['/node_modules/', '/.node/', '/jest/'],
  moduleNameMapper: {
    '^@cambo(.*)$': '<rootDir>/src$1',
    '.+\\.(css|styl|less|sass|scss|ttf|woff|woff2)$': 'jest-transform-stub',
  },
  globalSetup: './global-setup.js',
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-.*)?|@react-native(-community)?)/)',
    'node_modules/(?!(@react-native|react-native|@react-native-masked-view/masked-view))',
  ],
};
