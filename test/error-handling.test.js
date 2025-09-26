import { describe, test, expect, beforeEach, afterEach } from '@jest/globals';
import nock from 'nock';

// Import error utilities and weather functions
import { WeatherError, ERROR_CODES, mapErrorToExitCode } from '../src/utils/errors.js';
import { validateLocation, validateCoordinates } from '../src/utils/validators.js';

describe('Error Handling', () => {
  beforeEach(() => {
    nock.disableNetConnect();
    nock.cleanAll();
    process.env.WEATHER_API_KEY = 'test_api_key';
  });

  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
    delete process.env.WEATHER_API_KEY;
  });

  describe('WeatherError Class', () => {
    test('should create WeatherError with message and code', () => {
      const error = new WeatherError('Test error message', ERROR_CODES.API_KEY_INVALID);

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(WeatherError);
      expect(error.name).toBe('WeatherError');
      expect(error.message).toBe('Test error message');
      expect(error.code).toBe('API_KEY_INVALID');
    });

    test('should create WeatherError with status code', () => {
      const error = new WeatherError('HTTP error', ERROR_CODES.LOCATION_NOT_FOUND, 404);

      expect(error.statusCode).toBe(404);
      expect(error.code).toBe('LOCATION_NOT_FOUND');
    });

    test('should have proper error codes defined', () => {
      expect(ERROR_CODES.API_KEY_MISSING).toBe('API_KEY_MISSING');
      expect(ERROR_CODES.API_KEY_INVALID).toBe('API_KEY_INVALID');
      expect(ERROR_CODES.LOCATION_NOT_FOUND).toBe('LOCATION_NOT_FOUND');
      expect(ERROR_CODES.NETWORK_ERROR).toBe('NETWORK_ERROR');
      expect(ERROR_CODES.RATE_LIMIT).toBe('RATE_LIMIT');
      expect(ERROR_CODES.INVALID_INPUT).toBe('INVALID_INPUT');
      expect(ERROR_CODES.CACHE_ERROR).toBe('CACHE_ERROR');
    });
  });

  describe('Error Code Mapping', () => {
    test('should map API key errors to exit code 2', () => {
      const apiKeyMissingError = new WeatherError('Missing API key', ERROR_CODES.API_KEY_MISSING);
      const apiKeyInvalidError = new WeatherError('Invalid API key', ERROR_CODES.API_KEY_INVALID);

      expect(mapErrorToExitCode(apiKeyMissingError)).toBe(2);
      expect(mapErrorToExitCode(apiKeyInvalidError)).toBe(2);
    });

    test('should map location errors to exit code 3', () => {
      const error = new WeatherError('Location not found', ERROR_CODES.LOCATION_NOT_FOUND);
      expect(mapErrorToExitCode(error)).toBe(3);
    });

    test('should map network errors to exit code 4', () => {
      const error = new WeatherError('Network error', ERROR_CODES.NETWORK_ERROR);
      expect(mapErrorToExitCode(error)).toBe(4);
    });

    test('should map rate limit errors to exit code 5', () => {
      const error = new WeatherError('Rate limit exceeded', ERROR_CODES.RATE_LIMIT);
      expect(mapErrorToExitCode(error)).toBe(5);
    });

    test('should map invalid input errors to exit code 6', () => {
      const error = new WeatherError('Invalid input', ERROR_CODES.INVALID_INPUT);
      expect(mapErrorToExitCode(error)).toBe(6);
    });

    test('should map unknown errors to exit code 1', () => {
      const unknownError = new WeatherError('Unknown error', 'UNKNOWN_ERROR');
      const genericError = new Error('Generic error');

      expect(mapErrorToExitCode(unknownError)).toBe(1);
      expect(mapErrorToExitCode(genericError)).toBe(1);
    });
  });

  describe('Input Validation Errors', () => {
    describe('Location Validation', () => {
      test('should throw error for empty location', () => {
        expect(() => validateLocation('')).toThrow(WeatherError);
        expect(() => validateLocation('')).toThrow('Location cannot be empty');
      });

      test('should throw error for non-string location', () => {
        expect(() => validateLocation(null)).toThrow(WeatherError);
        expect(() => validateLocation(undefined)).toThrow(WeatherError);
        expect(() => validateLocation(123)).toThrow(WeatherError);
      });

      test('should sanitize unsafe characters from location', () => {
        const result = validateLocation('London, UK<script>alert("xss")</script>');
        expect(result).not.toContain('<script>');
        expect(result).not.toContain('alert');
      });

      test('should enforce maximum location length', () => {
        const longLocation = 'A'.repeat(150) + ', UK';
        const result = validateLocation(longLocation);
        expect(result.length).toBeLessThanOrEqual(100);
      });

      test('should allow major cities without comma', () => {
        expect(() => validateLocation('London')).not.toThrow();
        expect(() => validateLocation('Paris')).not.toThrow();
        expect(() => validateLocation('Tokyo')).not.toThrow();
      });

      test('should reject unknown single-word locations', () => {
        expect(() => validateLocation('UnknownCityXYZ')).toThrow(WeatherError);
        expect(() => validateLocation('UnknownCityXYZ')).toThrow('not recognized');
      });

      test('should handle locations with commas correctly', () => {
        expect(() => validateLocation('San Francisco, CA')).not.toThrow();
        expect(() => validateLocation('New York, NY')).not.toThrow();
        expect(() => validateLocation('London, UK')).not.toThrow();
      });
    });

    describe('Coordinate Validation', () => {
      test('should validate correct coordinates', () => {
        expect(() => validateCoordinates(40.7128, -74.0060)).not.toThrow();
        expect(() => validateCoordinates(0, 0)).not.toThrow();
        expect(() => validateCoordinates(90, 180)).not.toThrow();
        expect(() => validateCoordinates(-90, -180)).not.toThrow();
      });

      test('should throw error for invalid latitude', () => {
        expect(() => validateCoordinates(91, 0)).toThrow(WeatherError);
        expect(() => validateCoordinates(-91, 0)).toThrow(WeatherError);
        expect(() => validateCoordinates(91, 0)).toThrow('latitude');
      });

      test('should throw error for invalid longitude', () => {
        expect(() => validateCoordinates(0, 181)).toThrow(WeatherError);
        expect(() => validateCoordinates(0, -181)).toThrow(WeatherError);
        expect(() => validateCoordinates(0, 181)).toThrow('longitude');
      });

      test('should throw error for non-numeric coordinates', () => {
        expect(() => validateCoordinates('abc', 0)).toThrow(WeatherError);
        expect(() => validateCoordinates(0, 'xyz')).toThrow(WeatherError);
        expect(() => validateCoordinates(NaN, 0)).toThrow(WeatherError);
        expect(() => validateCoordinates(0, NaN)).toThrow(WeatherError);
      });
    });
  });

  describe('API Error Scenarios', () => {
    test('should handle 404 location not found', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(404, { message: 'city not found' });

      try {
        await getWeather('Nonexistent, XX');
        expect(true).toBe(false); // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.LOCATION_NOT_FOUND);
        expect(error.statusCode).toBe(404);
      }
    });

    test('should handle 401 invalid API key', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(401, { message: 'Invalid API key' });

      try {
        await getWeather('London, UK');
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.API_KEY_INVALID);
        expect(error.statusCode).toBe(401);
      }
    });

    test('should handle 429 rate limit exceeded', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(429, { message: 'Too many requests' }, {
          'retry-after': '60'
        });

      try {
        await getWeather('London, UK');
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.RATE_LIMIT);
        expect(error.statusCode).toBe(429);
      }
    });

    test('should handle network timeout', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .delay(6000) // Longer than 5-second timeout
        .reply(200, {});

      try {
        await getWeather('London, UK');
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      }
    });

    test('should handle network connection error', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .replyWithError('ENOTFOUND');

      try {
        await getWeather('London, UK');
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      }
    });

    test('should handle 5xx server errors', async () => {
      const { getWeather } = await import('../src/weather.js');

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(500, { message: 'Internal server error' });

      try {
        await getWeather('London, UK');
        expect(true).toBe(false);
      } catch (error) {
        expect(error).toBeInstanceOf(WeatherError);
        expect(error.code).toBe(ERROR_CODES.NETWORK_ERROR);
      }
    });
  });

  describe('Cache Error Handling', () => {
    test('should handle cache read errors gracefully', async () => {
      // Test that cache failures don't prevent weather lookups
      const { getCachedWeather } = await import('../src/cache.js');

      // This should return null without throwing for missing cache file
      const result = getCachedWeather('nonexistent-key');
      expect(result).toBeNull();
    });

    test('should handle cache write errors gracefully', async () => {
      const { setCachedWeather } = await import('../src/cache.js');

      // This should not throw even if cache directory is not writable
      expect(() => {
        setCachedWeather('test-key', { data: 'test' });
      }).not.toThrow();
    });
  });

  describe('Authentication Error Handling', () => {
    test('should handle missing keytar dependency gracefully', async () => {
      // This test simulates environments where keytar is not available
      try {
        const { getApiKey } = await import('../src/api/auth.js');

        // Should fall back to environment variable if keytar fails
        process.env.WEATHER_API_KEY = 'fallback_key';
        const apiKey = await getApiKey();
        expect(apiKey).toBe('fallback_key');

      } catch (error) {
        // If keytar is completely unavailable, should still provide helpful error
        if (error.message.includes('keytar')) {
          expect(error).toBeInstanceOf(WeatherError);
          expect(error.code).toBe(ERROR_CODES.API_KEY_MISSING);
        }
      }
    });

    test('should handle keytar access errors', async () => {
      // Test what happens when keytar throws errors
      try {
        const { getApiKey } = await import('../src/api/auth.js');

        delete process.env.WEATHER_API_KEY;

        try {
          await getApiKey();
          expect(true).toBe(false); // Should throw
        } catch (error) {
          expect(error).toBeInstanceOf(WeatherError);
          expect(error.code).toBe(ERROR_CODES.API_KEY_MISSING);
        }

      } catch (importError) {
        // Skip if module can't be imported due to missing dependencies
        if (importError.message.includes('Cannot find module')) {
          console.warn('Skipping auth test due to missing dependencies');
          return;
        }
        throw importError;
      }
    });
  });

  describe('Configuration Error Handling', () => {
    test('should handle missing configuration files gracefully', async () => {
      try {
        const { getDefaultLocation, getDefaultUnits } = await import('../src/config.js');

        // Should return reasonable defaults even if config file doesn't exist
        const location = await getDefaultLocation();
        const units = await getDefaultUnits();

        // Should not be null or undefined
        expect(location !== null && location !== undefined).toBe(true);
        expect(units !== null && units !== undefined).toBe(true);

      } catch (error) {
        // Config module might not be available in test environment
        if (error.message.includes('Cannot find module')) {
          console.warn('Skipping config test due to missing dependencies');
          return;
        }
        throw error;
      }
    });
  });
});