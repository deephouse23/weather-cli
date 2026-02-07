import { describe, it, expect } from 'vitest';
import { processTemperatureOptions } from '../../src/config.js';

describe('processTemperatureOptions', () => {
  it('returns "celsius" when --celsius flag is set', () => {
    expect(processTemperatureOptions({ celsius: true })).toBe('celsius');
  });

  it('returns "fahrenheit" when --fahrenheit flag is set', () => {
    expect(processTemperatureOptions({ fahrenheit: true })).toBe('fahrenheit');
  });

  it('returns "celsius" for units=metric', () => {
    expect(processTemperatureOptions({ units: 'metric' })).toBe('celsius');
  });

  it('returns "fahrenheit" for units=imperial', () => {
    expect(processTemperatureOptions({ units: 'imperial' })).toBe('fahrenheit');
  });

  it('returns null for units=auto (auto-detection)', () => {
    expect(processTemperatureOptions({ units: 'auto' })).toBeNull();
  });

  it('returns null when no unit options are set', () => {
    expect(processTemperatureOptions({})).toBeNull();
  });

  it('prioritizes --celsius flag over units option', () => {
    expect(processTemperatureOptions({ celsius: true, units: 'imperial' })).toBe('celsius');
  });

  it('prioritizes --fahrenheit flag over units option', () => {
    expect(processTemperatureOptions({ fahrenheit: true, units: 'metric' })).toBe('fahrenheit');
  });
});
