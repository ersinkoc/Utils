export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  extensionsToTreatAsEsm: ['.ts'],
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1',
  },
  transform: {
    '^.+\\.tsx?$': [
      'ts-jest',
      {
        useESM: true,
        tsconfig: {
          jsx: 'react',
        },
        // Disable source maps to use compiled JS for coverage
        sourceMaps: false,
        inlineSourceMap: false,
        inlineSources: false,
      },
    ],
  },
  testMatch: ['**/__tests__/**/*.test.ts'],
  collectCoverage: false,
  coverageProvider: 'v8',
  verbose: true,
};
