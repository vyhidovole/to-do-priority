// jest.config.js
/** @type {import('jest').Config} */
const config = {
  testEnvironment: 'jsdom', // 👈 Важно! Тесты в браузерной среде (DOM)
  transform: {
    '^.+\\.js$': '@swc/jest', // 👈 Транспилируем все .js файлы через SWC
  },
  transformIgnorePatterns: [
    '/node_modules/(?!nanoid|date-fns)', // 👈 Позволяем транспилировать nanoid и date-fns
  ],
  moduleNameMapper: {
    // Если ты используешь импорты с расширениями (например, '.js'), но Jest их не понимает
    '\\.(css|less|sass|scss)$': 'identity-obj-proxy',
  },
  coverageDirectory: 'coverage',
  collectCoverage: false, // можно включить позже
};

module.exports = config;

