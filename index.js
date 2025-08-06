#!/usr/bin/env node

import { program } from 'commander';
import chalk from 'chalk';
import boxen from 'boxen';
import ora from 'ora';
import dotenv from 'dotenv';
import axios from 'axios';
import inquirer from 'inquirer';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Beta banner function
function showBetaBanner() {
  if (process.argv.includes('--no-beta-banner') || program.opts().noBetaBanner) return;
  
  console.log(chalk.yellow.bold(`
╔══════════════════════════════════════╗
║              BETA SOFTWARE           ║
║                                      ║
║    Weather CLI v0.0.22               ║
║    Under active development          ║
║                                      ║
║    Feedback & bugs welcome at:       ║
║    github.com/deephouse23/weather-cli║
╚══════════════════════════════════════╝
`));
}



// Configuration
const CONFIG_FILE = join(__dirname, '.weather-config.json');
const CACHE_FILE = join(__dirname, '.weather-cache.json');
const API_KEY = process.env.WEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// Weather emoji mapping
const weatherEmojis = {
  Clear: '☀️',
  Clouds: '☁️',
  Rain: '🌧️',
  Drizzle: '🌦️',
  Thunderstorm: '⛈️',
  Snow: '❄️',
  Mist: '🌫️',
  Fog: '🌫️',
  Haze: '🌫️'
};

// Regional temperature units mapping
const FAHRENHEIT_COUNTRIES = new Set([
  'US', 'USA', 'BS', 'BZ', 'KY', 'PW'  // US, Bahamas, Belize, Cayman Islands, Palau
]);

// Temperature conversion utilities
function celsiusToFahrenheit(celsius) {
  return (celsius * 9/5) + 32;
}

function fahrenheitToCelsius(fahrenheit) {
  return (fahrenheit - 32) * 5/9;
}

// Detect regional temperature unit preference
function getRegionalTempUnit(countryCode) {
  return FAHRENHEIT_COUNTRIES.has(countryCode?.toUpperCase()) ? 'fahrenheit' : 'celsius';
}

// Convert temperature between units
function convertTemperature(temp, fromUnit, toUnit) {
  if (fromUnit === toUnit) return temp;
  
  if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
    return celsiusToFahrenheit(temp);
  } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
    return fahrenheitToCelsius(temp);
  }
  
  return temp;
}

// Determine display unit system
function determineDisplayUnits(countryCode, userPreference = null) {
  // Manual override takes precedence
  if (userPreference === 'fahrenheit' || userPreference === 'imperial') {
    return { api: 'imperial', display: 'fahrenheit' };
  }
  if (userPreference === 'celsius' || userPreference === 'metric') {
    return { api: 'metric', display: 'celsius' };
  }
  
  // Auto-detect based on country
  const regionalUnit = getRegionalTempUnit(countryCode);
  return {
    api: regionalUnit === 'fahrenheit' ? 'imperial' : 'metric',
    display: regionalUnit
  };
}

// Process CLI options for temperature units
function processTemperatureOptions(options) {
  if (options.celsius) {
    return 'celsius';
  }
  if (options.fahrenheit) {
    return 'fahrenheit';
  }
  return options.units === 'auto' ? null : options.units;
}

// ASCII art for weather conditions
const weatherASCII = {
  Clear: `
    \\   /
     .-.
  --(   )--
     \`-'
      |
  `,
  Clouds: `
     .--.
   .(    ).
  (  .  .  )
   \`--\`--\`
  `,
  Rain: `
     .--.
   .(    ).
  (  .  .  )
   \`--\`--\`
    |  |  |
   /   /   \\
  `,
  Thunderstorm: `
     .--.
   .(    ).
  (  .  .  )
   \`--\`--\`
    |  |  |
   /   /   \\
    ⚡  ⚡
  `,
  Snow: `
     .--.
   .(    ).
  (  .  .  )
   \`--\`--\`
    *  *  *
   *  *  *  *
  `,
  Mist: `
     .--.
   .(    ).
  (  .  .  )
   \`--\`--\`
    ~  ~  ~
   ~  ~  ~  ~
  `
};

// Cache management
async function loadCache() {
  try {
    const data = await fs.readFile(CACHE_FILE, 'utf8');
    const cache = JSON.parse(data);
    // Remove expired cache entries (older than 30 minutes)
    const now = Date.now();
    const filtered = {};
    for (const [key, value] of Object.entries(cache)) {
      if (now - value.timestamp < 30 * 60 * 1000) {
        filtered[key] = value;
      }
    }
    return filtered;
  } catch {
    return {};
  }
}

async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

async function getCachedWeather(location, units) {
  const cache = await loadCache();
  const key = `${location}-${units}`;
  return cache[key]?.data || null;
}

async function setCachedWeather(location, units, data) {
  const cache = await loadCache();
  const key = `${location}-${units}`;
  cache[key] = {
    data,
    timestamp: Date.now()
  };
  await saveCache(cache);
}

// Load saved configuration
async function loadConfig() {
  try {
    const data = await fs.readFile(CONFIG_FILE, 'utf8');
    return JSON.parse(data);
  } catch {
    return {};
  }
}

// Save configuration
async function saveConfig(config) {
  await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2));
}

// Get location by coordinates
async function getWeatherByCoords(lat, lon, userUnits = null) {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // Get current weather (metric first to determine country)
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: 'metric'
      }
    });

    const countryCode = weatherResponse.data.sys.country;
    const unitSystem = determineDisplayUnits(countryCode, userUnits);
    
    // Get final weather data in correct units
    let finalWeatherData = weatherResponse.data;
    if (unitSystem.api !== 'metric') {
      const weatherResponseFinal = await axios.get(`${BASE_URL}/weather`, {
        params: {
          lat,
          lon,
          appid: API_KEY,
          units: unitSystem.api
        }
      });
      finalWeatherData = weatherResponseFinal.data;
    }

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: unitSystem.api
      }
    });

    // Get air pollution data for alerts
    const pollutionResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat,
        lon,
        appid: API_KEY
      }
    });

    spinner.succeed(`Weather data fetched! Using ${unitSystem.display === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'} for ${countryCode}`);
    return {
      current: finalWeatherData,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data,
      displayUnit: unitSystem.display,
      countryCode: countryCode
    };
  } catch (error) {
    spinner.fail('Failed to fetch weather data');
    console.error(chalk.red('❌ Error:', error.message));
    process.exit(1);
  }
}

// Fetch weather data
async function getWeather(location, userUnits = null) {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  // Check cache first (with user units preference)
  const cacheKey = userUnits || 'auto';
  const cached = await getCachedWeather(location, cacheKey);
  if (cached) {
    console.log(chalk.gray('📦 Using cached data...'));
    return cached;
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // First, get location info to determine regional preferences
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: 'metric' // Always fetch in metric first to get country code
      }
    });

    const countryCode = weatherResponse.data.sys.country;
    const unitSystem = determineDisplayUnits(countryCode, userUnits);
    
    // If we need different units than metric, fetch again
    let finalWeatherData = weatherResponse.data;
    let forecastData, pollutionData;
    
    if (unitSystem.api !== 'metric') {
      const weatherResponseFinal = await axios.get(`${BASE_URL}/weather`, {
        params: {
          q: location,
          appid: API_KEY,
          units: unitSystem.api
        }
      });
      finalWeatherData = weatherResponseFinal.data;
    }

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: unitSystem.api
      }
    });

    // Get air pollution data for alerts
    const pollutionResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: finalWeatherData.coord.lat,
        lon: finalWeatherData.coord.lon,
        appid: API_KEY
      }
    });

    spinner.succeed(`Weather data fetched! Using ${unitSystem.display === 'fahrenheit' ? 'Fahrenheit' : 'Celsius'} for ${countryCode}`);
    
    const data = {
      current: finalWeatherData,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data,
      displayUnit: unitSystem.display,
      countryCode: countryCode
    };

    // Cache the data
    await setCachedWeather(location, cacheKey, data);
    
    return data;
  } catch (error) {
    spinner.fail('Failed to fetch weather data');
    if (error.response?.status === 404) {
      console.error(chalk.red(`❌ Location "${location}" not found`));
    } else if (error.response?.status === 401) {
      console.error(chalk.red('❌ Invalid API key'));
    } else {
      console.error(chalk.red('❌ Error:', error.message));
    }
    process.exit(1);
  }
}

// Format temperature
function formatTemp(temp, displayUnit) {
  const unit = displayUnit === 'fahrenheit' ? '°F' : '°C';
  return `${Math.round(temp)}${unit}`;
}

// Format time
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Get air quality description
function getAirQualityDescription(aqi) {
  const descriptions = {
    1: { text: 'Good', color: 'green' },
    2: { text: 'Fair', color: 'yellow' },
    3: { text: 'Moderate', color: 'orange' },
    4: { text: 'Poor', color: 'red' },
    5: { text: 'Very Poor', color: 'red' }
  };
  return descriptions[aqi] || { text: 'Unknown', color: 'gray' };
}

// Display weather alerts
function displayAlerts(data) {
  const { pollution } = data;
  if (!pollution) return;

  const aqi = pollution.list[0]?.main?.aqi || 1;
  const quality = getAirQualityDescription(aqi);
  
  if (aqi >= 3) {
    console.log(chalk[quality.color].bold(`\n⚠️  Air Quality Alert: ${quality.text} (AQI: ${aqi})`));
    console.log(chalk.gray('Consider limiting outdoor activities.'));
  }
}

// Display sunrise/sunset times
function displaySunTimes(data) {
  const { sys } = data;
  const sunrise = formatTime(sys.sunrise);
  const sunset = formatTime(sys.sunset);
  
  console.log(chalk.yellow('\n🌅 Sunrise/Sunset:'));
  console.log(chalk.gray(`  Sunrise: ${sunrise}`));
  console.log(chalk.gray(`  Sunset:  ${sunset}`));
}

// Display ASCII art
function displayASCIIArt(weatherMain) {
  const art = weatherASCII[weatherMain] || weatherASCII.Clouds;
  console.log(chalk.cyan(art));
}

// Display current weather
function displayCurrentWeather(data, displayUnit) {
  const { name, sys, main, weather, wind, clouds } = data;
  const emoji = weatherEmojis[weather[0].main] || '🌈';
  
  // Display ASCII art
  displayASCIIArt(weather[0].main);
  
  const output = `
${chalk.cyan.bold(`${name}, ${sys.country}`)} ${emoji}

${chalk.yellow('Current Conditions:')}
${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}

${chalk.blue('Temperature:')} ${formatTemp(main.temp, displayUnit)}
${chalk.gray('Feels like:')} ${formatTemp(main.feels_like, displayUnit)}
${chalk.gray('Min/Max:')} ${formatTemp(main.temp_min, displayUnit)} / ${formatTemp(main.temp_max, displayUnit)}

${chalk.cyan('🌡️  Pressure:')} ${main.pressure} hPa
${chalk.cyan('💧 Humidity:')} ${main.humidity}%
${chalk.cyan('☁️  Clouds:')} ${clouds.all}%
${chalk.cyan('💨 Wind:')} ${wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}
  `;

  console.log(boxen(output.trim(), {
    padding: 1,
    margin: 1,
    borderStyle: 'round',
    borderColor: 'cyan'
  }));

  // Display sun times
  displaySunTimes(data);
}

// Display 5-day forecast
function display5DayForecast(data, displayUnit) {
  console.log(chalk.yellow.bold('\n📅 5-Day Forecast:\n'));
  
  // Group by day
  const dailyData = {};
  data.list.forEach(item => {
    const date = new Date(item.dt * 1000);
    const day = date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
    
    if (!dailyData[day]) {
      dailyData[day] = [];
    }
    dailyData[day].push(item);
  });

  // Display each day
  Object.entries(dailyData).forEach(([day, items]) => {
    const avgTemp = Math.round(items.reduce((sum, item) => sum + item.main.temp, 0) / items.length);
    const weather = items[0].weather[0];
    const emoji = weatherEmojis[weather.main] || '🌈';
    
    console.log(chalk.cyan.bold(day));
    console.log(
      chalk.gray('  '),
      emoji,
      chalk.blue(formatTemp(avgTemp, displayUnit)),
      chalk.gray(weather.description)
    );
    
    // Show min/max for the day
    const temps = items.map(item => item.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    console.log(chalk.gray(`    Min: ${formatTemp(min, displayUnit)} | Max: ${formatTemp(max, displayUnit)}`));
    console.log('');
  });
}

// Display 24-hour forecast
function display24HourForecast(data, displayUnit) {
  console.log(chalk.yellow.bold('\n📅 Next 24 Hours Forecast:\n'));
  
  data.list.slice(0, 8).forEach(item => {
    const date = new Date(item.dt * 1000);
    const time = date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: true 
    });
    const emoji = weatherEmojis[item.weather[0].main] || '🌈';
    
    console.log(
      chalk.gray(time.padEnd(10)),
      emoji,
      chalk.blue(formatTemp(item.main.temp, displayUnit).padEnd(6)),
      chalk.gray(item.weather[0].description)
    );
  });
}

// Compare weather between two cities
async function compareWeather(city1, city2, userUnits = null) {
  console.log(chalk.yellow.bold(`\n🔍 Comparing weather: ${city1} vs ${city2}\n`));
  
  try {
    const [data1, data2] = await Promise.all([
      getWeather(city1, userUnits),
      getWeather(city2, userUnits)
    ]);

    const city1Data = data1.current;
    const city2Data = data2.current;
    const displayUnit = data1.displayUnit;

    console.log(boxen(`
${chalk.cyan.bold(city1Data.name)} ${weatherEmojis[city1Data.weather[0].main] || '🌈'}
${chalk.blue('Temperature:')} ${formatTemp(city1Data.main.temp, displayUnit)}
${chalk.gray('Humidity:')} ${city1Data.main.humidity}%
${chalk.gray('Wind:')} ${city1Data.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}
${chalk.gray('Conditions:')} ${city1Data.weather[0].description}
    `.trim(), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }));

    console.log(boxen(`
${chalk.cyan.bold(city2Data.name)} ${weatherEmojis[city2Data.weather[0].main] || '🌈'}
${chalk.blue('Temperature:')} ${formatTemp(city2Data.main.temp, displayUnit)}
${chalk.gray('Humidity:')} ${city2Data.main.humidity}%
${chalk.gray('Wind:')} ${city2Data.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}
${chalk.gray('Conditions:')} ${city2Data.weather[0].description}
    `.trim(), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'green'
    }));

    // Temperature difference
    const tempDiff = city1Data.main.temp - city2Data.main.temp;
    const warmer = tempDiff > 0 ? city1Data.name : city2Data.name;
    const diff = Math.abs(tempDiff);
    
    console.log(chalk.yellow.bold(`\n🌡️  Temperature Difference:`));
    console.log(chalk.gray(`${warmer} is ${formatTemp(diff, displayUnit)} warmer`));

  } catch (error) {
    console.error(chalk.red('❌ Error comparing weather:', error.message));
  }
}

// Interactive mode
async function interactiveMode() {
  const config = await loadConfig();
  
  const answers = await inquirer.prompt([
    {
      type: 'list',
      name: 'mode',
      message: 'What would you like to do?',
      choices: [
        { name: 'Get current weather', value: 'current' },
        { name: 'Get 24-hour forecast', value: '24h' },
        { name: 'Get 5-day forecast', value: '5day' },
        { name: 'Compare two cities', value: 'compare' },
        { name: 'Get weather by coordinates', value: 'coords' }
      ]
    }
  ]);

  if (answers.mode === 'compare') {
    const compareAnswers = await inquirer.prompt([
      {
        type: 'input',
        name: 'city1',
        message: 'Enter first city:',
        default: config.defaultLocation || 'London'
      },
      {
        type: 'input',
        name: 'city2',
        message: 'Enter second city:',
        default: 'Tokyo'
      },
      {
        type: 'list',
        name: 'units',
        message: 'Choose temperature units:',
        choices: [
          { name: 'Auto (based on location)', value: 'auto' },
          { name: 'Celsius (°C)', value: 'celsius' },
          { name: 'Fahrenheit (°F)', value: 'fahrenheit' }
        ],
        default: config.defaultUnits || 'auto'
      }
    ]);
    
    const userUnits = compareAnswers.units === 'auto' ? null : compareAnswers.units;
    await compareWeather(compareAnswers.city1, compareAnswers.city2, userUnits);
    return;
  }

  if (answers.mode === 'coords') {
    const coordsAnswers = await inquirer.prompt([
      {
        type: 'number',
        name: 'lat',
        message: 'Enter latitude:',
        default: 51.5074
      },
      {
        type: 'number',
        name: 'lon',
        message: 'Enter longitude:',
        default: -0.1278
      },
      {
        type: 'list',
        name: 'units',
        message: 'Choose temperature units:',
        choices: [
          { name: 'Auto (based on location)', value: 'auto' },
          { name: 'Celsius (°C)', value: 'celsius' },
          { name: 'Fahrenheit (°F)', value: 'fahrenheit' }
        ],
        default: config.defaultUnits || 'auto'
      }
    ]);
    
    const userUnits = coordsAnswers.units === 'auto' ? null : coordsAnswers.units;
    const data = await getWeatherByCoords(coordsAnswers.lat, coordsAnswers.lon, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    displayAlerts(data);
    return;
  }

  const locationAnswers = await inquirer.prompt([
    {
      type: 'input',
      name: 'location',
      message: 'Enter location (city name or zip code):',
      default: config.defaultLocation || 'London'
    },
    {
      type: 'list',
      name: 'units',
      message: 'Choose temperature units:',
      choices: [
        { name: 'Celsius (°C)', value: 'metric' },
        { name: 'Fahrenheit (°F)', value: 'imperial' }
      ],
      default: config.defaultUnits || 'metric'
    }
  ]);

  const userUnits = locationAnswers.units === 'auto' ? null : locationAnswers.units;
  const data = await getWeather(locationAnswers.location, userUnits);
  
  if (answers.mode === 'current') {
    displayCurrentWeather(data.current, data.displayUnit);
    displayAlerts(data);
  } else if (answers.mode === '24h') {
    displayCurrentWeather(data.current, data.displayUnit);
    display24HourForecast(data.forecast, data.displayUnit);
    displayAlerts(data);
  } else if (answers.mode === '5day') {
    displayCurrentWeather(data.current, data.displayUnit);
    display5DayForecast(data.forecast, data.displayUnit);
    displayAlerts(data);
  }
}

// CLI Setup
program
  .name('weather')
  .description('A beautiful CLI weather application')
  .version('0.0.22')
  .option('--no-beta-banner', 'Hide the beta software banner');

program
  .command('now [location]')
  .description('Get current weather for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .option('-f, --forecast', 'Include 24-hour forecast')
  .option('-a, --alerts', 'Show weather alerts')
  .action(async (location, options) => {
    if (!location) {
      const config = await loadConfig();
      location = config.defaultLocation;
      if (!location) {
        console.error(chalk.red('❌ Please provide a location or set a default'));
        process.exit(1);
      }
    }
    
    const userUnits = processTemperatureOptions(options);
    const data = await getWeather(location, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    
    if (options.alerts) {
      displayAlerts(data);
    }
    
    if (options.forecast) {
      display24HourForecast(data.forecast, data.displayUnit);
    }
  });

program
  .command('forecast [location]')
  .description('Get 24-hour forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (location, options) => {
    if (!location) {
      const config = await loadConfig();
      location = config.defaultLocation;
      if (!location) {
        console.error(chalk.red('❌ Please provide a location or set a default'));
        process.exit(1);
      }
    }
    
    const userUnits = processTemperatureOptions(options);
    const data = await getWeather(location, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    display24HourForecast(data.forecast, data.displayUnit);
    displayAlerts(data);
  });

program
  .command('5day [location]')
  .description('Get 5-day forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial/celsius/fahrenheit)', 'auto')
  .option('--celsius', 'Force Celsius temperature display')
  .option('--fahrenheit', 'Force Fahrenheit temperature display')
  .action(async (location, options) => {
    if (!location) {
      const config = await loadConfig();
      location = config.defaultLocation;
      if (!location) {
        console.error(chalk.red('❌ Please provide a location or set a default'));
        process.exit(1);
      }
    }
    
    const userUnits = processTemperatureOptions(options);
    const data = await getWeather(location, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    display5DayForecast(data.forecast, data.displayUnit);
    displayAlerts(data);
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
    const [lat, lon] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lon)) {
      console.error(chalk.red('❌ Invalid coordinates format. Use: lat,lon (e.g., 40.7128,-74.0060)'));
      process.exit(1);
    }
    const userUnits = processTemperatureOptions(options);
    const data = await getWeatherByCoords(lat, lon, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    displayAlerts(data);
  });

program
  .command('config')
  .description('Configure default settings')
  .action(async () => {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'defaultLocation',
        message: 'Default location:'
      },
      {
        type: 'list',
        name: 'defaultUnits',
        message: 'Default temperature units:',
        choices: [
          { name: 'Auto (based on location)', value: 'auto' },
          { name: 'Celsius (°C)', value: 'celsius' },
          { name: 'Fahrenheit (°F)', value: 'fahrenheit' }
        ]
      }
    ]);
    
    await saveConfig(answers);
    console.log(chalk.green('✅ Configuration saved!'));
  });

program
  .command('cache')
  .description('Manage weather cache')
  .option('-c, --clear', 'Clear all cached data')
  .action(async (options) => {
    if (options.clear) {
      await fs.writeFile(CACHE_FILE, '{}');
      console.log(chalk.green('✅ Cache cleared!'));
    } else {
      const cache = await loadCache();
      const count = Object.keys(cache).length;
      console.log(chalk.blue(`📦 Cache contains ${count} entries`));
    }
  });

program
  .command('interactive')
  .alias('i')
  .description('Interactive mode with prompts')
  .action(interactiveMode);

// Handle default case - if arguments exist but don't match commands, treat as location
const args = process.argv.slice(2);
const knownCommands = ['now', 'forecast', '5day', 'compare', 'coords', 'config', 'cache', 'interactive', 'i', 'help', '--help', '-h', '--version', '-V'];
const knownOptions = ['--no-beta-banner', '-u', '--units', '-f', '--forecast', '-a', '--alerts', '--celsius', '--fahrenheit'];

if (args.length === 0) {
  // No arguments, start interactive mode
  showBetaBanner();
  interactiveMode();
} else if (args.length > 0 && (!knownCommands.includes(args[0]) || args.includes('--no-beta-banner')) && args.filter(arg => !knownOptions.includes(arg) && !arg.match(/^(metric|imperial|celsius|fahrenheit|auto)$/)).length > 0) {
  // First argument is not a known command and doesn't start with -, treat as location for current weather
  if (!args.includes('--no-beta-banner')) {
    showBetaBanner();
  }
  const location = args.join(' ');
  
  // Process temperature options
  const options = {
    celsius: args.includes('--celsius'),
    fahrenheit: args.includes('--fahrenheit'),
    units: args.includes('-u') || args.includes('--units') ? 
      (args[args.indexOf(args.includes('-u') ? '-u' : '--units') + 1] || 'auto') : 'auto'
  };
  const userUnits = processTemperatureOptions(options);
  
  const showForecast = args.includes('-f') || args.includes('--forecast');
  const showAlerts = args.includes('-a') || args.includes('--alerts');
  
  try {
    const cleanLocation = location.replace(/(-u|--units|metric|imperial|celsius|fahrenheit|auto|-f|--forecast|-a|--alerts|--celsius|--fahrenheit|--no-beta-banner)/g, '').trim();
    const data = await getWeather(cleanLocation, userUnits);
    displayCurrentWeather(data.current, data.displayUnit);
    
    if (showAlerts) {
      displayAlerts(data);
    }
    
    if (showForecast) {
      display24HourForecast(data.forecast, data.displayUnit);
    }
  } catch (error) {
    console.error(chalk.red(`❌ ${error.message}`));
    process.exit(1);
  }
} else {
  // Parse as normal commander commands
  program.parse();
}