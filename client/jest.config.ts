import type { Config } from "jest";

const moduleNameMapper = {
  "^@/(.*)$": "<rootDir>/src/$1",
};

const config: Config = {
  roots: ["<rootDir>"],
  preset: "ts-jest",
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapper: moduleNameMapper,
  transform: {
    "^.+\\.tsx?$": "ts-jest",
    ".+\\.(css|less|sass|scss|png|jpg|gif|ttf|woff|woff2|svg)$":
      "jest-transform-stub",
  },
};

export default config;
