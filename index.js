#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import inquirer from 'inquirer';
import dotenv from 'dotenv';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// Import our modules
import { getWeather, getWeatherByCoords } from './src/weather.js';
import {
  getCachedWeather,
  setCachedWeather,
  cleanExpiredCache,
  getCacheStats,
  clearCache
} from './src/cache.js';
import {
  displayCurrentWeather,
  display5DayForecast,
  display24HourForecast,
  displayWeatherBanner
} from './src/display.js';
import {
  processTemperatureOptions,
  getDefaultLocation,
  getDefaultUnits,
  setDefaultLocation,
  setDefaultUnits
} from './src/config.js';
import { WeatherError, mapErrorToExitCode } from './src/utils/errors.js';
import { setApiKey, testApiKey } from './src/api/auth.js';
import { parseLocation } from './src/utils/locationParser.js';

// Load environment variables
dotenv.config();

// Get package version
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const packageJson = JSON.parse(readFileSync(join(__dirname, 'package.json'), 'utf8'));
const VERSION = packageJson.version;

// Beta banner function - now opt-in only
function showBetaBanner() {
  if (!process.argv.includes('--beta-banner') && !program.opts().betaBanner) return;

  console.log(
    chalk.yellow.bold(`
╔══════════════════════════════════════╗
║              BETA SOFTWARE           ║
║                                      ║
║    Weather CLI v${VERSION}               ║
║    Under active development          ║
║                                      ║
║    Feedback & bugs welcome at:       ║
║    github.com/deephouse23/weather-cli║
╚══════════════════════════════════════╝
`)
  );
}

// Compare weather between two cities
async function compareWeather(city1, city2, userUnits = null) {
  console.log(chalk.cyan.bold(`\n🌍 Comparing weather: ${city1} vs ${city2}`));

  const [data1, data2] = await Promise.all([
    getWeather(city1, userUnits),
    getWeather(city2, userUnits)
  ]);

  console.log(chalk.green('\n📍 City 1:'));
  displayCurrentWeather(data1, data1.displayUnit);

  console.log(chalk.green('\n📍 City 2:'));
  displayCurrentWeather(data2, data2.displayUnit);

  // Compare temperatures
  const temp1 = data1.current.main.temp;
  const temp2 = data2.current.main.temp;
  const diff = Math.abs(temp1 - temp2);

  console.log(
    chalk.yellow(
      `\n🌡️  Temperature difference: ${diff.toFixed(1)}°${data1.displayUnit === 'fahrenheit' ? 'F' : 'C'}`
    )
  );

  if (temp1 > temp2) {
    console.log(chalk.red(`${city1} is warmer by ${diff.toFixed(1)}°`));
  } else if (temp2 > temp1) {
    console.log(chalk.red(`${city2} is warmer by ${diff.toFixed(1)}°`));
  } else {
    console.log(chalk.green('Both cities have the same temperature!'));
  }
}

// Interactive mode
async function interactiveMode() {
  displayWeatherBanner();

  const defaultLocation = await getDefaultLocation();
  const defaultUnits = await getDefaultUnits();

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'location',
      message: 'Enter location:',
      default: defaultLocation || 'New York'
    },
    {
      type: 'list',
      name: 'units',
      message: 'Temperature units:',
      choices: [
        { name: 'Auto (based on location)', value: 'auto' },
        { name: 'Celsius (°C)', value: 'celsius' },
        { name: 'Fahrenheit (°F)', value: 'fahrenheit' }
      ],
      default: defaultUnits
    },
    {
      type: 'list',
      name: 'forecast',
      message: 'What would you like to see?',
      choices: [
        { name: 'Current weather only', value: 'current' },
        { name: 'Current + 24-hour forecast', value: '24h' },
        { name: 'Current + 5-day forecast', value: '5day' },
        { name: 'Everything', value: 'all' }
      ]
    }
  ]);

  const data = await getWeather(answers.location, answers.units);

  displayCurrentWeather(data, data.displayUnit);

  if (answers.forecast === '24h' || answers.forecast === 'all') {
    display24HourForecast(data, data.displayUnit);
  }

  if (answers.forecast === '5day' || answers.forecast === 'all') {
    display5DayForecast(data, data.displayUnit);
  }

  // Save as default if user wants
  const saveDefault = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'save',
      message: 'Save as default location?',
      default: false
    }
  ]);

  if (saveDefault.save) {
    await setDefaultLocation(answers.location);
    await setDefaultUnits(answers.units);
    console.log(chalk.green('✅ Default settings saved!'));
  }
}

// Error handler wrapper
function handleError(error) {
  if (error instanceof WeatherError) {
    console.error(chalk.red(`❌ ${error.message}`));

    // Add helpful hints for specific errors
    if (error.code === 'API_KEY_MISSING') {
      console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
      console.log(chalk.yellow('Then run: weather auth set'));
    } else if (error.code === 'LOCATION_NOT_FOUND') {
      console.log(chalk.yellow('Examples: "San Ramon, CA" or "London, UK"'));
    }
  } else {
    console.error(chalk.red(`❌ Unexpected error: ${error.message}`));
  }

  process.exit(mapErrorToExitCode(error));
}

// CLI Setup
program
  .name('weather')
  .description('A beautiful CLI weather application')
  .version(VERSION)
  .option('--beta-banner', 'Show the beta software banner');

program
  .command('now [location]')
  .description('Get current weather for a location (format: "City, State" or "City, Country")')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (location, options) => {
    if (!location) {
      const defaultLocation = await getDefaultLocation();
      if (!defaultLocation) {
        console.error(chalk.red('❌ No location provided and no default set'));
        console.log(chalk.yellow('Usage: weather "City, State" or weather "City, Country"'));
        console.log(chalk.yellow('Examples: weather "San Ramon, CA" or weather "London, UK"'));
        throw new WeatherError('No location provided', 'INVALID_INPUT');
      }
      location = defaultLocation;
    }

    const userUnits = processTemperatureOptions(options);

    // Check cache first
    const cacheKey = userUnits || 'auto';
    const cached = await getCachedWeather(location, cacheKey);
    if (cached) {
      console.log(chalk.gray('📦 Using cached data...'));
      displayCurrentWeather(cached, cached.displayUnit);
      return;
    }

    const data = await getWeather(location, userUnits);
    await setCachedWeather(location, cacheKey, data);
    displayCurrentWeather(data, data.displayUnit);
  });

program
  .command('forecast [location]')
  .description('Get 24-hour forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (location, options) => {
    if (!location) {
      const defaultLocation = await getDefaultLocation();
      if (!defaultLocation) {
        console.error(chalk.red('❌ No location provided and no default set'));
        throw new WeatherError('No location provided', 'INVALID_INPUT');
      }
      location = defaultLocation;
    }

    const userUnits = processTemperatureOptions(options);
    const data = await getWeather(location, userUnits);
    displayCurrentWeather(data, data.displayUnit);
    display24HourForecast(data, data.displayUnit);
  });

program
  .command('5day [location]')
  .description('Get 5-day forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (location, options) => {
    if (!location) {
      const defaultLocation = await getDefaultLocation();
      if (!defaultLocation) {
        console.error(chalk.red('❌ No location provided and no default set'));
        throw new WeatherError('No location provided', 'INVALID_INPUT');
      }
      location = defaultLocation;
    }

    const userUnits = processTemperatureOptions(options);
    const data = await getWeather(location, userUnits);
    displayCurrentWeather(data, data.displayUnit);
    display5DayForecast(data, data.displayUnit);
  });

program
  .command('compare <city1> <city2>')
  .description('Compare weather between two cities')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (city1, city2, options) => {
    const userUnits = processTemperatureOptions(options);
    await compareWeather(city1, city2, userUnits);
  });

program
  .command('coords <coordinates>')
  .description('Get weather by GPS coordinates (format: lat,lon)')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (coordinates, options) => {
    const [lat, lon] = coordinates.split(',').map((coord) => coord.trim());
    const userUnits = processTemperatureOptions(options);
    const data = await getWeatherByCoords(lat, lon, userUnits);
    displayCurrentWeather(data, data.displayUnit);
  });

program
  .command('config')
  .description('Configure default settings')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'defaultLocation',
        message: 'Default location:',
        default: (await getDefaultLocation()) || ''
      },
      {
        type: 'list',
        name: 'defaultUnits',
        message: 'Default temperature units:',
        choices: [
          { name: 'Auto (based on location)', value: 'auto' },
          { name: 'Celsius (°C)', value: 'celsius' },
          { name: 'Fahrenheit (°F)', value: 'fahrenheit' }
        ],
        default: await getDefaultUnits()
      }
    ]);

    await setDefaultLocation(answers.defaultLocation);
    await setDefaultUnits(answers.defaultUnits);
    console.log(chalk.green('✅ Configuration saved!'));
  });

const authCommand = program.command('auth').description('Manage API authentication');

authCommand
  .command('set')
  .description('Set API key securely')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'password',
        name: 'apiKey',
        message: 'Enter your OpenWeatherMap API key:',
        mask: '*',
        validate: (input) => input.length > 0 || 'API key cannot be empty'
      }
    ]);

    // Test the key
    console.log(chalk.blue('Testing API key...'));
    try {
      await testApiKey(answers.apiKey);
      const saved = await setApiKey(answers.apiKey);

      if (saved) {
        console.log(chalk.green('✅ API key saved to system keychain'));
      } else {
        console.log(
          chalk.yellow(
            '⚠️  Could not save to keychain, please set WEATHER_API_KEY environment variable'
          )
        );
      }
    } catch (_error) {
      throw new WeatherError('Invalid API key', 'API_KEY_INVALID');
    }
  });

authCommand
  .command('test')
  .description('Test API key validity')
  .action(async () => {
    await testApiKey();
    console.log(chalk.green('✅ API key is valid'));
  });

program
  .command('cache')
  .description('Manage weather cache')
  .option('-c, --clear', 'Clear all cached data')
  .option('--clean', 'Clean expired cache entries')
  .action(async (options) => {
    if (options.clear) {
      await clearCache();
      console.log(chalk.green('✅ Cache cleared!'));
    } else if (options.clean) {
      const cleaned = await cleanExpiredCache();
      if (cleaned === 0) {
        console.log(chalk.blue('📦 No expired entries to clean'));
      }
    } else {
      const stats = await getCacheStats();
      console.log(chalk.blue(`📦 Cache statistics:`));
      console.log(chalk.white(`  Total entries: ${stats.total}`));
      console.log(chalk.green(`  Valid entries: ${stats.valid}`));
      console.log(chalk.yellow(`  Expired entries: ${stats.expired}`));
    }
  });

program
  .command('interactive')
  .alias('i')
  .description('Interactive mode with prompts')
  .action(interactiveMode);

// Main execution
async function main() {
  try {
    // Handle default case - if arguments exist but don't match commands, treat as location
    const args = process.argv.slice(2);
    const knownCommands = [
      'now',
      'forecast',
      '5day',
      'compare',
      'coords',
      'config',
      'auth',
      'cache',
      'interactive',
      'i',
      'help',
      '--help',
      '-h',
      '--version',
      '-V'
    ];
    if (args.length === 0) {
      // No arguments, start interactive mode
      showBetaBanner();
      await interactiveMode();
    } else if (args.length > 0 && !knownCommands.includes(args[0])) {
      // First argument is not a known command, treat as location for current weather
      showBetaBanner();

      // Use parseLocation to intelligently parse the location
      const location = parseLocation(args);

      if (!location) {
        console.error(chalk.red('❌ Please specify a location'));
        console.log(chalk.yellow('Examples: weather CA, weather San Ramon CA, weather London'));
        process.exit(1);
      }

      // Process temperature options
      const options = {
        celsius: args.includes('--celsius'),
        fahrenheit: args.includes('--fahrenheit'),
        units:
          args.includes('-u') || args.includes('--units')
            ? args[args.indexOf(args.includes('-u') ? '-u' : '--units') + 1] || 'auto'
            : 'auto'
      };
      const userUnits = processTemperatureOptions(options);

      const showForecast = args.includes('-f') || args.includes('--forecast');

      // Check cache first
      const cacheKey = userUnits || 'auto';
      const cached = await getCachedWeather(location, cacheKey);
      let data;
      if (cached) {
        console.log(chalk.gray('📦 Using cached data...'));
        data = cached;
      } else {
        data = await getWeather(location, userUnits);
        await setCachedWeather(location, cacheKey, data);
      }
      displayCurrentWeather(data, data.displayUnit);

      if (showForecast) {
        display24HourForecast(data, data.displayUnit);
      }
    } else {
      // Parse as normal commander commands
      await program.parseAsync();
    }
  } catch (error) {
    handleError(error);
  }
}

// Run main function
main();
