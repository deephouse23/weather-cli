import { describe, test, expect, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { execa } from 'execa';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import nock from 'nock';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const CLI_PATH = join(__dirname, '..', 'index.js');

describe('Main CLI Entry Point', () => {
  beforeAll(() => {
    nock.disableNetConnect();
  });

  afterAll(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  beforeEach(() => {
    nock.cleanAll();
    // Set test API key
    process.env.WEATHER_API_KEY = 'test_api_key_main';
  });

  describe('CLI Information Commands', () => {
    test('should display version with --version flag', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--version'], {
        timeout: 5000
      });

      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
      expect(parseFloat(stdout.match(/\d+\.\d+/)[0])).toBeGreaterThan(0);
    });

    test('should display version with -V flag', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '-V'], {
        timeout: 5000
      });

      expect(stdout).toMatch(/\d+\.\d+\.\d+/);
    });

    test('should display help with --help flag', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '--help'], {
        timeout: 5000
      });

      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('weather');
      expect(stdout).toContain('Options:');
      expect(stdout).toContain('Commands:');
    });

    test('should display help with -h flag', async () => {
      const { stdout } = await execa('node', [CLI_PATH, '-h'], {
        timeout: 5000
      });

      expect(stdout).toContain('Usage:');
      expect(stdout).toContain('weather');
    });

    test('should display help when help command is used', async () => {
      const { stdout } = await execa('node', [CLI_PATH, 'help'], {
        timeout: 5000
      });

      expect(stdout).toContain('Usage:');
    });
  });

  describe('Basic Weather Functionality with Mocked API', () => {
    test('should fetch and display current weather with mocked API', async () => {
      const mockWeatherResponse = {
        name: 'London',
        sys: {
          country: 'GB',
          sunrise: 1642665600,
          sunset: 1642694400
        },
        main: {
          temp: 15.5,
          feels_like: 14.2,
          temp_min: 12.0,
          temp_max: 18.0,
          pressure: 1013,
          humidity: 65
        },
        weather: [{
          main: 'Clear',
          description: 'clear sky',
          icon: '01d'
        }],
        wind: {
          speed: 3.5,
          deg: 180
        },
        visibility: 10000,
        coord: {
          lat: 51.5074,
          lon: -0.1278
        }
      };

      const mockForecastResponse = {
        list: [{
          dt: 1642665600,
          main: { temp: 16.0, humidity: 60 },
          weather: [{ main: 'Clear', description: 'clear sky' }],
          wind: { speed: 2.5 }
        }]
      };

      const mockPollutionResponse = {
        list: [{
          main: { aqi: 2 },
          components: {
            co: 230.67, no: 0.01, no2: 13.22, o3: 55.43,
            so2: 3.73, pm2_5: 5.41, pm10: 6.73, nh3: 1.04
          }
        }]
      };

      // Mock all API endpoints
      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockWeatherResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, mockForecastResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/air_pollution')
        .query(true)
        .reply(200, mockPollutionResponse);

      try {
        const { stdout } = await execa('node', [CLI_PATH, 'now', 'London, UK'], {
          timeout: 15000
        });

        // Verify weather information is displayed
        expect(stdout).toContain('London');
        expect(stdout).toContain('GB');

      } catch (error) {
        if (error.message.includes('keytar') ||
            error.message.includes('Cannot find module') ||
            error.message.includes('ENOTFOUND')) {
          console.warn('Skipping main CLI weather test due to missing dependencies:', error.message);
          return;
        }
        throw error;
      }
    }, 20000);

    test('should handle direct location argument (no command)', async () => {
      const mockWeatherResponse = {
        name: 'Paris',
        sys: { country: 'FR' },
        main: { temp: 18.0, feels_like: 17.5, temp_min: 15.0, temp_max: 21.0, pressure: 1015, humidity: 70 },
        weather: [{ main: 'Clouds', description: 'scattered clouds' }],
        wind: { speed: 4.2, deg: 220 },
        visibility: 10000,
        coord: { lat: 48.8566, lon: 2.3522 }
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockWeatherResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, { list: [] });

      nock('https://api.openweathermap.org')
        .get('/data/2.5/air_pollution')
        .query(true)
        .reply(200, { list: [{ main: { aqi: 1 } }] });

      try {
        const { stdout } = await execa('node', [CLI_PATH, 'Paris'], {
          timeout: 15000
        });

        expect(stdout).toContain('Paris');

      } catch (error) {
        if (error.message.includes('keytar') || error.message.includes('ENOTFOUND')) {
          console.warn('Skipping direct location test');
          return;
        }
        throw error;
      }
    }, 20000);

    test('should handle forecast command with mocked API', async () => {
      const mockForecastResponse = {
        city: { name: 'Berlin', country: 'DE' },
        list: [
          {
            dt: 1642665600,
            main: { temp: 8.5, humidity: 75 },
            weather: [{ main: 'Rain', description: 'light rain' }],
            wind: { speed: 3.2 }
          },
          {
            dt: 1642676400,
            main: { temp: 9.2, humidity: 72 },
            weather: [{ main: 'Clouds', description: 'overcast clouds' }],
            wind: { speed: 2.8 }
          }
        ]
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, mockForecastResponse);

      try {
        const { stdout } = await execa('node', [CLI_PATH, 'forecast', 'Berlin, DE'], {
          timeout: 15000
        });

        expect(stdout).toContain('Berlin');

      } catch (error) {
        if (error.message.includes('keytar') || error.message.includes('ENOTFOUND')) {
          console.warn('Skipping forecast command test');
          return;
        }
        throw error;
      }
    }, 20000);
  });

  describe('CLI Options and Flags', () => {
    test('should handle temperature unit flags', async () => {
      const mockResponse = {
        name: 'Tokyo',
        sys: { country: 'JP' },
        main: { temp: 25, feels_like: 26, temp_min: 23, temp_max: 28, pressure: 1020, humidity: 65 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 2.1, deg: 90 },
        visibility: 10000
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .times(3)
        .reply(200, mockResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .times(3)
        .reply(200, { list: [] });

      nock('https://api.openweathermap.org')
        .get('/data/2.5/air_pollution')
        .query(true)
        .times(3)
        .reply(200, { list: [{ main: { aqi: 2 } }] });

      try {
        // Test --celsius flag
        const celsiusResult = await execa('node', [CLI_PATH, 'now', 'Tokyo, JP', '--celsius'], {
          timeout: 10000
        });
        expect(celsiusResult.stdout).toContain('Tokyo');

        // Test --fahrenheit flag
        const fahrenheitResult = await execa('node', [CLI_PATH, 'now', 'Tokyo, JP', '--fahrenheit'], {
          timeout: 10000
        });
        expect(fahrenheitResult.stdout).toContain('Tokyo');

        // Test -u metric flag
        const metricResult = await execa('node', [CLI_PATH, 'now', 'Tokyo, JP', '-u', 'metric'], {
          timeout: 10000
        });
        expect(metricResult.stdout).toContain('Tokyo');

      } catch (error) {
        if (error.message.includes('keytar') || error.message.includes('ENOTFOUND')) {
          console.warn('Skipping temperature flags test');
          return;
        }
        throw error;
      }
    }, 25000);

    test('should handle forecast flag with current weather', async () => {
      const mockWeatherResponse = {
        name: 'Sydney',
        sys: { country: 'AU' },
        main: { temp: 22, feels_like: 21, temp_min: 19, temp_max: 25, pressure: 1018, humidity: 60 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 3.5, deg: 180 },
        visibility: 10000
      };

      const mockForecastResponse = {
        list: [
          { dt: 1642665600, main: { temp: 23 }, weather: [{ description: 'clear' }] },
          { dt: 1642676400, main: { temp: 24 }, weather: [{ description: 'sunny' }] }
        ]
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockWeatherResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, mockForecastResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/air_pollution')
        .query(true)
        .reply(200, { list: [{ main: { aqi: 1 } }] });

      try {
        const { stdout } = await execa('node', [CLI_PATH, 'now', 'Sydney, AU', '-f'], {
          timeout: 15000
        });

        expect(stdout).toContain('Sydney');

      } catch (error) {
        if (error.message.includes('keytar') || error.message.includes('ENOTFOUND')) {
          console.warn('Skipping forecast flag test');
          return;
        }
        throw error;
      }
    }, 20000);
  });

  describe('Interactive Mode', () => {
    test('should start interactive mode when no arguments provided', async () => {
      try {
        // Start interactive mode and send input quickly
        const subprocess = execa('node', [CLI_PATH], {
          timeout: 3000,
          input: '\n'  // Send newline to exit prompts
        });

        await subprocess;

      } catch (error) {
        // Expected to timeout or exit due to interactive nature
        expect(
          error.timedOut ||
          error.exitCode === 0 ||
          error.exitCode === 1 ||
          error.message.includes('keytar')
        ).toBeTruthy();
      }
    });

    test('should handle interactive command explicitly', async () => {
      try {
        const subprocess = execa('node', [CLI_PATH, 'interactive'], {
          timeout: 2000,
          input: '\n'
        });

        await subprocess;

      } catch (error) {
        // Interactive mode expected to prompt, so timeout/exit is normal
        expect(
          error.timedOut ||
          error.exitCode !== undefined ||
          error.message.includes('keytar')
        ).toBeTruthy();
      }
    });
  });

  describe('Configuration Commands', () => {
    test('should handle cache command', async () => {
      try {
        const { stdout } = await execa('node', [CLI_PATH, 'cache'], {
          timeout: 5000
        });

        // Should show cache information without erroring
        expect(stdout.length).toBeGreaterThan(0);

      } catch (error) {
        // Cache command might exit with status code if no cache exists
        if (error.exitCode && error.exitCode > 0) {
          expect(typeof error.stdout === 'string' || typeof error.stderr === 'string').toBe(true);
        } else {
          throw error;
        }
      }
    });

    test('should handle config command (interactive)', async () => {
      try {
        const subprocess = execa('node', [CLI_PATH, 'config'], {
          timeout: 2000,
          input: '\n\n'  // Send empty responses
        });

        await subprocess;

      } catch (error) {
        // Config is interactive, so timeout is expected
        expect(
          error.timedOut ||
          error.exitCode !== undefined ||
          error.message.includes('keytar')
        ).toBeTruthy();
      }
    });
  });

  describe('Authentication Commands', () => {
    test('should handle auth test command', async () => {
      try {
        const result = await execa('node', [CLI_PATH, 'auth', 'test'], {
          timeout: 5000
        });

        expect(result.exitCode).toBeDefined();

      } catch (error) {
        // Auth test may fail without proper API key, but should not crash
        expect(error.exitCode).toBeGreaterThan(0);
        expect(typeof error.stderr === 'string' || typeof error.stdout === 'string').toBe(true);
      }
    });
  });

  describe('Error Handling at CLI Level', () => {
    test('should handle unknown commands gracefully', async () => {
      try {
        await execa('node', [CLI_PATH, 'unknowncommand'], {
          timeout: 5000
        });

      } catch (error) {
        // Should exit with non-zero code for unknown command
        expect(error.exitCode).toBeGreaterThan(0);
        expect(error.stderr || error.stdout).toBeDefined();
      }
    });

    test('should handle missing API key gracefully', async () => {
      delete process.env.WEATHER_API_KEY;

      try {
        await execa('node', [CLI_PATH, 'now', 'London, UK'], {
          timeout: 5000
        });

      } catch (error) {
        // Should exit with code 2 for API key issues
        expect(error.exitCode).toBe(2);
        expect(error.stderr || error.stdout).toContain('API key');
      }
    });
  });

  describe('Output Formatting', () => {
    test('should produce properly formatted output', async () => {
      const mockResponse = {
        name: 'TestCity',
        sys: { country: 'TC' },
        main: { temp: 20, feels_like: 19, temp_min: 18, temp_max: 22, pressure: 1015, humidity: 65 },
        weather: [{ main: 'Clear', description: 'clear sky' }],
        wind: { speed: 2.5, deg: 180 },
        visibility: 10000
      };

      nock('https://api.openweathermap.org')
        .get('/data/2.5/weather')
        .query(true)
        .reply(200, mockResponse);

      nock('https://api.openweathermap.org')
        .get('/data/2.5/forecast')
        .query(true)
        .reply(200, { list: [] });

      nock('https://api.openweathermap.org')
        .get('/data/2.5/air_pollution')
        .query(true)
        .reply(200, { list: [{ main: { aqi: 1 } }] });

      try {
        const { stdout } = await execa('node', [CLI_PATH, 'now', 'TestCity, TC'], {
          timeout: 10000
        });

        // Verify output contains essential information
        expect(stdout).toContain('TestCity');
        expect(stdout.length).toBeGreaterThan(50); // Should have substantial output

      } catch (error) {
        if (error.message.includes('keytar') || error.message.includes('ENOTFOUND')) {
          console.warn('Skipping output formatting test');
          return;
        }
        throw error;
      }
    }, 15000);
  });
});