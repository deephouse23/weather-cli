import { describe, it, expect } from 'vitest';
import {
  determineDisplayUnits,
  celsiusToFahrenheit,
  fahrenheitToCelsius,
  convertTemperature
} from '../../src/weather.js';

describe('determineDisplayUnits', () => {
  it('returns imperial for US country code', () => {
    const result = determineDisplayUnits('US');
    expect(result).toEqual({ api: 'imperial', display: 'fahrenheit' });
  });

  it('returns metric for non-US countries', () => {
    const result = determineDisplayUnits('GB');
    expect(result).toEqual({ api: 'metric', display: 'celsius' });
  });

  it('returns metric for JP', () => {
    const result = determineDisplayUnits('JP');
    expect(result).toEqual({ api: 'metric', display: 'celsius' });
  });

  it('returns imperial for Bahamas (BS)', () => {
    const result = determineDisplayUnits('BS');
    expect(result).toEqual({ api: 'imperial', display: 'fahrenheit' });
  });

  it('overrides with fahrenheit preference', () => {
    const result = determineDisplayUnits('GB', 'fahrenheit');
    expect(result).toEqual({ api: 'imperial', display: 'fahrenheit' });
  });

  it('overrides with celsius preference', () => {
    const result = determineDisplayUnits('US', 'celsius');
    expect(result).toEqual({ api: 'metric', display: 'celsius' });
  });

  it('handles imperial string as fahrenheit', () => {
    const result = determineDisplayUnits('GB', 'imperial');
    expect(result).toEqual({ api: 'imperial', display: 'fahrenheit' });
  });

  it('handles metric string as celsius', () => {
    const result = determineDisplayUnits('US', 'metric');
    expect(result).toEqual({ api: 'metric', display: 'celsius' });
  });

  it('returns auto-detection when preference is null', () => {
    const result = determineDisplayUnits('US', null);
    expect(result).toEqual({ api: 'imperial', display: 'fahrenheit' });
  });

  it('handles null country code gracefully', () => {
    const result = determineDisplayUnits(null);
    expect(result).toEqual({ api: 'metric', display: 'celsius' });
  });
});

describe('celsiusToFahrenheit', () => {
  it('converts 0°C to 32°F', () => {
    expect(celsiusToFahrenheit(0)).toBe(32);
  });

  it('converts 100°C to 212°F', () => {
    expect(celsiusToFahrenheit(100)).toBe(212);
  });

  it('converts -40°C to -40°F', () => {
    expect(celsiusToFahrenheit(-40)).toBe(-40);
  });
});

describe('fahrenheitToCelsius', () => {
  it('converts 32°F to 0°C', () => {
    expect(fahrenheitToCelsius(32)).toBe(0);
  });

  it('converts 212°F to 100°C', () => {
    expect(fahrenheitToCelsius(212)).toBe(100);
  });

  it('converts -40°F to -40°C', () => {
    expect(fahrenheitToCelsius(-40)).toBe(-40);
  });
});

describe('convertTemperature', () => {
  it('returns same value when units match', () => {
    expect(convertTemperature(20, 'celsius', 'celsius')).toBe(20);
    expect(convertTemperature(68, 'fahrenheit', 'fahrenheit')).toBe(68);
  });

  it('converts celsius to fahrenheit', () => {
    expect(convertTemperature(0, 'celsius', 'fahrenheit')).toBe(32);
  });

  it('converts fahrenheit to celsius', () => {
    expect(convertTemperature(32, 'fahrenheit', 'celsius')).toBe(0);
  });

  it('returns original value for unknown units', () => {
    expect(convertTemperature(20, 'kelvin', 'celsius')).toBe(20);
  });
});
