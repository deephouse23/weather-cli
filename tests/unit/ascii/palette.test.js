import { describe, it, expect } from 'vitest';
import { palettes, PALETTE_KEYS, getPalette } from '../../../src/ascii/palette.js';

const HEX_REGEX = /^#[0-9A-Fa-f]{6}$/;

describe('palettes', () => {
  it('has day, night, and retro palettes', () => {
    expect(palettes).toHaveProperty('day');
    expect(palettes).toHaveProperty('night');
    expect(palettes).toHaveProperty('retro');
  });

  for (const [name, palette] of Object.entries(palettes)) {
    describe(`${name} palette`, () => {
      it('has all required keys', () => {
        for (const key of PALETTE_KEYS) {
          expect(palette).toHaveProperty(key);
        }
      });

      it('has only valid hex color values', () => {
        for (const [key, value] of Object.entries(palette)) {
          expect(value, `${name}.${key} should be valid hex`).toMatch(HEX_REGEX);
        }
      });

      it('has exactly the expected number of keys', () => {
        expect(Object.keys(palette)).toHaveLength(PALETTE_KEYS.length);
      });
    });
  }
});

describe('getPalette', () => {
  it('returns the day palette by name', () => {
    expect(getPalette('day')).toBe(palettes.day);
  });

  it('returns the night palette by name', () => {
    expect(getPalette('night')).toBe(palettes.night);
  });

  it('returns the retro palette by name', () => {
    expect(getPalette('retro')).toBe(palettes.retro);
  });

  it('falls back to day palette for unknown names', () => {
    expect(getPalette('unknown')).toBe(palettes.day);
  });

  it('falls back to day palette for undefined', () => {
    expect(getPalette(undefined)).toBe(palettes.day);
  });
});
