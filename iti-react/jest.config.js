module.exports = {
    testEnvironment: 'jsdom',
    transformIgnorePatterns: ["node_modules/(?!@interface-technologies)"],

    transform: { "\\.tsx?$": "@sucrase/jest-plugin" },

    // ignore files that don't have test.ts or test.tsx extension (.e.g. __helpers__)
    testMatch: ['**/__tests__/**/*.test.ts?(x)']
}
