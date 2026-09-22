import config from './jest.config.mjs';

export default {
  ...config,
  roots: ['<rootDir>/test'],
  testMatch: ['**/*.e2e-spec.ts'],
};
