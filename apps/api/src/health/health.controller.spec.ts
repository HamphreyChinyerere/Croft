import { describe, expect, it } from '@jest/globals';
import { HealthController } from './health.controller.js';

describe('HealthController', () => {
  it('returns only the deterministic process liveness response', () => {
    expect(new HealthController().getHealth()).toEqual({ status: 'ok' });
  });
});
