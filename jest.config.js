module.exports = {
  preset: 'ts-jest',
  verbose: true,
  rootDir: '.',
  cache: false,
  moduleNameMapper: {
    '^~/(.*)$': '<rootDir>/src/$1'
  },
  moduleFileExtensions: ['js', 'ts', 'json'],
  transform: {
    '^.+\\.(ts|js)$': 'ts-jest'
  },
  setupFilesAfterEnv: ['jest-expect-message'],
  collectCoverage: false,
  coverageDirectory: '<rootDir>/coverage',
  collectCoverageFrom: ['<rootDir>/src/**/*'],
  testMatch: [
    '<rootDir>/spec/unit/**/*.spec.(js|jsx|ts|tsx)',
    '<rootDir>/spec/e2e/**/*.e2e-spec.(js|jsx|ts|tsx)'
  ],
  testEnvironment: 'node',
  reporters: [
    'default',
    [
      './node_modules/jest-html-reporter',
      {
        pageTitle: 'Test Report',
        outputPath: './reports/test-results.html',
        includeFailureMsg: true
      }
    ]
  ],
  coverageReporters: ['text', 'html', 'cobertura', 'lcov'],
  globals: {
    'ts-jest': {
      diagnostics: true
    }
  }
}
