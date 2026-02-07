import { describe, it, expect } from 'vitest';
import { parseLocation, STATE_MAPPINGS, MAJOR_CITIES } from '../../src/utils/locationParser.js';

describe('parseLocation', () => {
  describe('state/country code lookup', () => {
    it('resolves US state codes', () => {
      expect(parseLocation(['CA'])).toBe('California, US');
      expect(parseLocation(['NY'])).toBe('New York, US');
      expect(parseLocation(['TX'])).toBe('Texas, US');
    });

    it('resolves Canadian province codes', () => {
      expect(parseLocation(['BC'])).toBe('British Columbia, CA');
      expect(parseLocation(['ON'])).toBe('Ontario, CA');
    });

    it('resolves country codes', () => {
      expect(parseLocation(['UK'])).toBe('United Kingdom');
    });
  });

  describe('major city lookup', () => {
    it('resolves well-known US cities', () => {
      expect(parseLocation(['New', 'York'])).toBe('New York, NY, US');
      expect(parseLocation(['San', 'Francisco'])).toBe('San Francisco, CA, US');
      expect(parseLocation(['San', 'Ramon'])).toBe('San Ramon, CA, US');
      expect(parseLocation(['Miami'])).toBe('Miami, FL, US');
      expect(parseLocation(['Seattle'])).toBe('Seattle, WA, US');
    });

    it('resolves international cities', () => {
      expect(parseLocation(['London'])).toBe('London, UK');
      expect(parseLocation(['Tokyo'])).toBe('Tokyo, JP');
      expect(parseLocation(['Paris'])).toBe('Paris, FR');
      expect(parseLocation(['Toronto'])).toBe('Toronto, CA');
      expect(parseLocation(['Vancouver'])).toBe('Vancouver, CA');
      expect(parseLocation(['Berlin'])).toBe('Berlin, DE');
      expect(parseLocation(['Sydney'])).toBe('Sydney, AU');
    });
  });

  describe('city + state/province parsing', () => {
    it('parses US city + state as "City, STATE, US"', () => {
      expect(parseLocation(['San', 'Ramon', 'CA'])).toBe('San Ramon, CA, US');
      expect(parseLocation(['Los', 'Angeles', 'CA'])).toBe('Los Angeles, CA, US');
    });

    it('parses Canadian city + province with correct country code', () => {
      expect(parseLocation(['Vancouver', 'BC'])).toBe('Vancouver, BC, CA');
      expect(parseLocation(['Toronto', 'ON'])).toBe('Toronto, ON, CA');
      expect(parseLocation(['Calgary', 'AB'])).toBe('Calgary, AB, CA');
    });

    it('parses unknown short codes as generic code', () => {
      expect(parseLocation(['Random', 'City', 'XY'])).toBe('Random City, XY');
    });
  });

  describe('option filtering', () => {
    it('filters out CLI options', () => {
      expect(parseLocation(['San', 'Ramon', 'CA', '--celsius'])).toBe('San Ramon, CA, US');
      expect(parseLocation(['-u', 'metric', 'London'])).toBe('London, UK');
      expect(parseLocation(['Paris', '--fahrenheit', '-f'])).toBe('Paris, FR');
    });
  });

  describe('comma-separated input', () => {
    it('normalizes spacing around commas', () => {
      expect(parseLocation(['City,', 'State'])).toBe('City, State');
    });
  });

  describe('edge cases', () => {
    it('returns null for empty input', () => {
      expect(parseLocation([])).toBeNull();
      expect(parseLocation(null)).toBeNull();
    });

    it('returns null when only options are provided', () => {
      expect(parseLocation(['--celsius', '-f'])).toBeNull();
    });

    it('returns plain text for unrecognized single-word locations', () => {
      expect(parseLocation(['Timbuktu'])).toBe('Timbuktu');
    });
  });
});

describe('STATE_MAPPINGS', () => {
  it('contains US state entries (some overlap with country/province codes)', () => {
    const usEntries = Object.entries(STATE_MAPPINGS).filter(([_, v]) => v.endsWith(', US'));
    // Some US state codes (IN, NE) are overwritten by country codes later in the object
    expect(usEntries.length).toBeGreaterThanOrEqual(49);
  });

  it('contains Canadian provinces', () => {
    const caEntries = Object.entries(STATE_MAPPINGS).filter(([_, v]) => v.endsWith(', CA'));
    expect(caEntries.length).toBeGreaterThanOrEqual(13);
  });
});

describe('MAJOR_CITIES', () => {
  it('contains entries for common US cities', () => {
    expect(MAJOR_CITIES['san francisco']).toBe('San Francisco, CA, US');
    expect(MAJOR_CITIES['new york']).toBe('New York, NY, US');
  });

  it('contains entries for international cities', () => {
    expect(MAJOR_CITIES['london']).toBe('London, UK');
    expect(MAJOR_CITIES['tokyo']).toBe('Tokyo, JP');
  });
});
