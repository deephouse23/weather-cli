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
async function getWeatherByCoords(lat, lon, units = 'metric') {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // Get current weather
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
      }
    });

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        lat,
        lon,
        appid: API_KEY,
        units: units
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

    spinner.succeed('Weather data fetched!');
    return {
      current: weatherResponse.data,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data
    };
  } catch (error) {
    spinner.fail('Failed to fetch weather data');
    console.error(chalk.red('❌ Error:', error.message));
    process.exit(1);
  }
}

// Fetch weather data
async function getWeather(location, units = 'metric') {
  if (!API_KEY) {
    console.error(chalk.red('❌ No API key found. Please set WEATHER_API_KEY in your .env file'));
    console.log(chalk.yellow('Get your free API key at: https://openweathermap.org/api'));
    process.exit(1);
  }

  // Check cache first
  const cached = await getCachedWeather(location, units);
  if (cached) {
    console.log(chalk.gray('📦 Using cached data...'));
    return cached;
  }

  const spinner = ora('Fetching weather data...').start();
  
  try {
    // Get current weather
    const weatherResponse = await axios.get(`${BASE_URL}/weather`, {
      params: {
        q: location,
        appid: API_KEY,
        units: units
      }
    });

    // Get 5-day forecast
    const forecastResponse = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: location,
        appid: API_KEY,
        units: units
      }
    });

    // Get air pollution data for alerts
    const pollutionResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: {
        lat: weatherResponse.data.coord.lat,
        lon: weatherResponse.data.coord.lon,
        appid: API_KEY
      }
    });

    spinner.succeed('Weather data fetched!');
    
    const data = {
      current: weatherResponse.data,
      forecast: forecastResponse.data,
      pollution: pollutionResponse.data
    };

    // Cache the data
    await setCachedWeather(location, units, data);
    
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
function formatTemp(temp, units) {
  const unit = units === 'metric' ? '°C' : '°F';
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
function displayCurrentWeather(data, units) {
  const { name, sys, main, weather, wind, clouds } = data;
  const emoji = weatherEmojis[weather[0].main] || '🌈';
  
  // Display ASCII art
  displayASCIIArt(weather[0].main);
  
  const output = `
${chalk.cyan.bold(`${name}, ${sys.country}`)} ${emoji}

${chalk.yellow('Current Conditions:')}
${weather[0].description.charAt(0).toUpperCase() + weather[0].description.slice(1)}

${chalk.blue('Temperature:')} ${formatTemp(main.temp, units)}
${chalk.gray('Feels like:')} ${formatTemp(main.feels_like, units)}
${chalk.gray('Min/Max:')} ${formatTemp(main.temp_min, units)} / ${formatTemp(main.temp_max, units)}

${chalk.cyan('🌡️  Pressure:')} ${main.pressure} hPa
${chalk.cyan('💧 Humidity:')} ${main.humidity}%
${chalk.cyan('☁️  Clouds:')} ${clouds.all}%
${chalk.cyan('💨 Wind:')} ${wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}
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
function display5DayForecast(data, units) {
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
      chalk.blue(formatTemp(avgTemp, units)),
      chalk.gray(weather.description)
    );
    
    // Show min/max for the day
    const temps = items.map(item => item.main.temp);
    const min = Math.min(...temps);
    const max = Math.max(...temps);
    console.log(chalk.gray(`    Min: ${formatTemp(min, units)} | Max: ${formatTemp(max, units)}`));
    console.log('');
  });
}

// Display 24-hour forecast
function display24HourForecast(data, units) {
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
      chalk.blue(formatTemp(item.main.temp, units).padEnd(6)),
      chalk.gray(item.weather[0].description)
    );
  });
}

// Compare weather between two cities
async function compareWeather(city1, city2, units = 'metric') {
  console.log(chalk.yellow.bold(`\n🔍 Comparing weather: ${city1} vs ${city2}\n`));
  
  try {
    const [data1, data2] = await Promise.all([
      getWeather(city1, units),
      getWeather(city2, units)
    ]);

    const city1Data = data1.current;
    const city2Data = data2.current;

    console.log(boxen(`
${chalk.cyan.bold(city1Data.name)} ${weatherEmojis[city1Data.weather[0].main] || '🌈'}
${chalk.blue('Temperature:')} ${formatTemp(city1Data.main.temp, units)}
${chalk.gray('Humidity:')} ${city1Data.main.humidity}%
${chalk.gray('Wind:')} ${city1Data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}
${chalk.gray('Conditions:')} ${city1Data.weather[0].description}
    `.trim(), {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'blue'
    }));

    console.log(boxen(`
${chalk.cyan.bold(city2Data.name)} ${weatherEmojis[city2Data.weather[0].main] || '🌈'}
${chalk.blue('Temperature:')} ${formatTemp(city2Data.main.temp, units)}
${chalk.gray('Humidity:')} ${city2Data.main.humidity}%
${chalk.gray('Wind:')} ${city2Data.wind.speed} ${units === 'metric' ? 'm/s' : 'mph'}
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
    console.log(chalk.gray(`${warmer} is ${formatTemp(diff, units)} warmer`));

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
          { name: 'Celsius (°C)', value: 'metric' },
          { name: 'Fahrenheit (°F)', value: 'imperial' }
        ],
        default: config.defaultUnits || 'metric'
      }
    ]);
    
    await compareWeather(compareAnswers.city1, compareAnswers.city2, compareAnswers.units);
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
          { name: 'Celsius (°C)', value: 'metric' },
          { name: 'Fahrenheit (°F)', value: 'imperial' }
        ],
        default: config.defaultUnits || 'metric'
      }
    ]);
    
    const data = await getWeatherByCoords(coordsAnswers.lat, coordsAnswers.lon, coordsAnswers.units);
    displayCurrentWeather(data.current, coordsAnswers.units);
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

  const data = await getWeather(locationAnswers.location, locationAnswers.units);
  
  if (answers.mode === 'current') {
    displayCurrentWeather(data.current, locationAnswers.units);
    displayAlerts(data);
  } else if (answers.mode === '24h') {
    displayCurrentWeather(data.current, locationAnswers.units);
    display24HourForecast(data.forecast, locationAnswers.units);
    displayAlerts(data);
  } else if (answers.mode === '5day') {
    displayCurrentWeather(data.current, locationAnswers.units);
    display5DayForecast(data.forecast, locationAnswers.units);
    displayAlerts(data);
  }
}

// CLI Setup
program
  .name('weather')
  .description('A beautiful CLI weather application')
  .version('0.0.2');

program
  .command('now [location]')
  .description('Get current weather for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial)', 'metric')
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
    
    const data = await getWeather(location, options.units);
    displayCurrentWeather(data.current, options.units);
    
    if (options.alerts) {
      displayAlerts(data);
    }
    
    if (options.forecast) {
      display24HourForecast(data.forecast, options.units);
    }
  });

program
  .command('forecast [location]')
  .description('Get 24-hour forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial)', 'metric')
  .action(async (location, options) => {
    if (!location) {
      const config = await loadConfig();
      location = config.defaultLocation;
      if (!location) {
        console.error(chalk.red('❌ Please provide a location or set a default'));
        process.exit(1);
      }
    }
    
    const data = await getWeather(location, options.units);
    displayCurrentWeather(data.current, options.units);
    display24HourForecast(data.forecast, options.units);
    displayAlerts(data);
  });

program
  .command('5day [location]')
  .description('Get 5-day forecast for a location')
  .option('-u, --units <type>', 'Temperature units (metric/imperial)', 'metric')
  .action(async (location, options) => {
    if (!location) {
      const config = await loadConfig();
      location = config.defaultLocation;
      if (!location) {
        console.error(chalk.red('❌ Please provide a location or set a default'));
        process.exit(1);
      }
    }
    
    const data = await getWeather(location, options.units);
    displayCurrentWeather(data.current, options.units);
    display5DayForecast(data.forecast, options.units);
    displayAlerts(data);
  });

program
  .command('compare <city1> <city2>')
  .description('Compare weather between two cities')
  .option('-u, --units <type>', 'Temperature units (metric/imperial)', 'metric')
  .action(async (city1, city2, options) => {
    await compareWeather(city1, city2, options.units);
  });

program
  .command('coords <coordinates>')
  .description('Get weather by GPS coordinates (format: lat,lon)')
  .option('-u, --units <type>', 'Temperature units (metric/imperial)', 'metric')
  .action(async (coordinates, options) => {
    const [lat, lon] = coordinates.split(',').map(coord => parseFloat(coord.trim()));
    if (isNaN(lat) || isNaN(lon)) {
      console.error(chalk.red('❌ Invalid coordinates format. Use: lat,lon (e.g., 40.7128,-74.0060)'));
      process.exit(1);
    }
    const data = await getWeatherByCoords(lat, lon, options.units);
    displayCurrentWeather(data.current, options.units);
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
          { name: 'Celsius (°C)', value: 'metric' },
          { name: 'Fahrenheit (°F)', value: 'imperial' }
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

if (args.length === 0) {
  // No arguments, start interactive mode
  interactiveMode();
} else if (args.length > 0 && !knownCommands.includes(args[0]) && !args[0].startsWith('-')) {
  // First argument is not a known command and doesn't start with -, treat as location for current weather
  const location = args.join(' ');
  const units = args.includes('-u') || args.includes('--units') ? 
    (args[args.indexOf(args.includes('-u') ? '-u' : '--units') + 1] || 'metric') : 'metric';
  const showForecast = args.includes('-f') || args.includes('--forecast');
  const showAlerts = args.includes('-a') || args.includes('--alerts');
  
  try {
    const cleanLocation = location.replace(/(-u|--units|metric|imperial|-f|--forecast|-a|--alerts)/g, '').trim();
    const data = await getWeather(cleanLocation, units);
    displayCurrentWeather(data.current, units);
    
    if (showAlerts) {
      displayAlerts(data);
    }
    
    if (showForecast) {
      display24HourForecast(data.forecast, units);
    }
  } catch (error) {
    console.error(chalk.red(`❌ ${error.message}`));
    process.exit(1);
  }
} else {
  // Parse as normal commander commands
  program.parse();
}