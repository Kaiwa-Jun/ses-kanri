const nextJest = require('next/jest');

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: './',
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/.next/',
    '<rootDir>/node_modules/',
    '<rootDir>/e2e/', // E2Eテストを除外
  ],
  moduleNameMapper: {
    // Handle module aliases (this will be automatically configured for you based on your tsconfig.json paths)
    '^@/(.*)$': '<rootDir>/$1',
  },
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
    '!**/coverage/**',
    '!**/playwright-report/**',
    '!**/test-results/**',
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
  bail: process.env.CI ? 1 : 0,
  maxWorkers: process.env.CI ? 1 : '50%',
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
