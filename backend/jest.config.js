module.exports = {
  testEnvironment: "node",
  testTimeout: 3000,
  testMatch: ["**/*.test.js"],
  clearMocks: true,
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.js"],
};
