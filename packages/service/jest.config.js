module.exports = {
  testMatch: [
    '**/__tests__/**/*.spec.ts',
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest.setup.ts',
  ],
};
