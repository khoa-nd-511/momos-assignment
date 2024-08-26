import type { Config } from "jest";

const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};

const config: Config = {
  clearMocks: true,
  moduleNameMapper: moduleNameMapper,
  testEnvironment: "jest-environment-jsdom",
  setupFilesAfterEnv: ["<rootDir>/src/test-setup.ts"],
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
      "jest-transform-stub",
  },
};

export default config;
