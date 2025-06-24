const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
  collectCoverageFrom: [
    'components/ui/button.tsx',
    'components/ui/badge.tsx',
    'components/ui/card.tsx',
    'components/ui/input.tsx',
    'components/ui/label.tsx',
    'components/ui/checkbox.tsx',
    'components/ui/skeleton.tsx',
    'components/ui/separator.tsx',
    'components/ui/alert.tsx',
    'components/ui/textarea.tsx',
    'components/ui/switch.tsx',
    'lib/utils.ts',
    'hooks/use-toast.ts',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/__tests__/**',
    '!**/coverage/**',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  // CI環境での設定
  verbose: true,
  bail: 1, // 最初のテスト失敗で停止
  maxWorkers: process.env.CI ? 1 : '50%',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
