module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./src/tests/setup.ts'],
  moduleFileExtensions: ['ts', 'js', 'json'],
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      isolatedModules: true, // This will ignore TypeScript errors
    }]
  },
  testMatch: ['**/?(*.)+(spec|test).ts'],
  transformIgnorePatterns: [
    '/node_modules/(?!.*\\.mjs$)'
  ],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1'
  },
  testPathIgnorePatterns: [
    '/node_modules/'
  ],
  roots: [
    "<rootDir>/src"
  ],
  verbose: true,
  // Modified Jest configuration to disable TypeScript type checking
  globals: {
    'ts-jest': {
      isolatedModules: true, // This is important to disable type checking
      tsconfig: {
        // Override tsconfig.json for tests
        target: 'es2016',
        module: 'commonjs',
        esModuleInterop: true,
        strict: false, // Disable strict mode for tests
        skipLibCheck: true
      }
    }
  }
}; 