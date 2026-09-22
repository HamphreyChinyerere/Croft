import { describe, expect, it } from '@jest/globals';
import { parsePort } from './port.js';

describe('parsePort', () => {
  it('defaults to port 3000 when PORT is absent', () => {
    expect(parsePort(undefined)).toBe(3000);
  });

  it.each(['1', '3001', '65535'])('accepts valid port %s', (value) => {
    expect(parsePort(value)).toBe(Number(value));
  });

  it.each(['', ' ', '0', '-1', '65536', '3000.5', '1e3', 'NaN', 'Infinity', '3000x'])(
    'rejects invalid PORT without echoing its value: %s',
    (value) => {
      expect(() => parsePort(value)).toThrow('PORT must be an integer between 1 and 65535');
    },
  );
});
