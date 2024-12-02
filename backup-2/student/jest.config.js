module.exports = {
    roots: ["<rootDir>/src"],
    clearMocks: true,
    collectCoverage: true,
    collectCoverageFrom: ["src/**/*.{js,jsx,mjs}", "!**/node_modules/**", "!src/index.js","!src/reportWebVitals.js", "!src/App.js","!src/services/interceptors.js"],
    coverageDirectory: "coverage",
    coverageReporters: ["html", "text", "text-summary", "cobertura", "lcov"],
    moduleFileExtensions: ["js", "json", "jsx", "module.css", "css"],
    testEnvironment: "jsdom",
    testPathIgnorePatterns: ["\\\\node_modules\\\\"],
    testURL: "http://localhost",
    verbose: false,
    transformIgnorePatterns: ["node_modules/(?!axios)/"],
    moduleNameMapper: {
      "\\.(jpg|jpeg|png|gif)$": "identity-obj-proxy",
      '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    },
    transform: {
      "^.+\\.js$": "babel-jest",
      '^.+\\.jsx?$': 'babel-jest',
      "^.+\\.jsx$": "babel-jest",
    },
    // setupFilesAfterEnv: ["@testing-library/jest-dom/extend-expect", "react-dom/test-utils"],
  };