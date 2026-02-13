import chalk from 'chalk';
import boxen from 'boxen';
import { getScene, isDaytime } from './ascii/index.js';
import { AsciiRenderer } from './ascii/renderer.js';

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

// Format temperature with color coding
function formatTemp(temp, displayUnit, options = {}) {
  const unit = displayUnit === 'fahrenheit' ? '°F' : '°C';
  const rounded = Math.round(temp);
  const tempString = `${rounded}${unit}`;

  if (options.colorCode) {
    if (options.type === 'max') return chalk.red(tempString);
    if (options.type === 'min') return chalk.blue(tempString);
    if (options.type === 'current') return chalk.yellow(tempString);
  }

  return tempString;
}

// Format time
function formatTime(timestamp) {
  return new Date(timestamp * 1000).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
}

// Convert wind speed based on units
function formatWindSpeed(speed, displayUnit) {
  if (displayUnit === 'fahrenheit') {
    const mph = speed * 2.237;
    return `${mph.toFixed(1)} mph`;
  }
  return `${speed} m/s`;
}

// Create a data row with consistent alignment
function createDataRow(label, value, options = {}) {
  const { labelWidth = 20, valueWidth = 30, icon = '' } = options;
  const formattedLabel = icon ? `${icon} ${label}` : label;
  return `${formattedLabel.padEnd(labelWidth)} ${value}`;
}

// Display weather banner with ASCII art
function displayWeatherBanner() {
  console.log(
    chalk.cyan.bold(`
╔════════════════════════════════════════════╗
║           🌤️  WEATHER CLI  🌤️              ║
║         Your Terminal Weather Friend       ║
╚════════════════════════════════════════════╝
`)
  );
}

// Get air quality description with color
function getAirQualityDescription(aqi) {
  const descriptions = {
    1: { text: 'Good', color: chalk.green },
    2: { text: 'Fair', color: chalk.greenBright },
    3: { text: 'Moderate', color: chalk.yellow },
    4: { text: 'Poor', color: chalk.red },
    5: { text: 'Very Poor', color: chalk.magenta }
  };
  const desc = descriptions[aqi] || { text: 'Unknown', color: chalk.gray };
  return desc.color(desc.text);
}

// Get terminal width
function getTerminalWidth() {
  return process.stdout.columns || 80;
}

// Display current weather in compact horizontal layout
function displayCurrentWeather(data, displayUnit, options = {}) {
  // Check if data has current property or is the weather data directly
  const weather = data.current || data;

  // Add safety checks for weather data
  if (!weather || !weather.weather || !weather.weather[0]) {
    console.error(chalk.red('❌ Invalid weather data structure'));
    return;
  }

  // If artOnly is set, suppress the weather card even when not a TTY
  if (options.artOnly && !process.stdout.isTTY) {
    return;
  }

  // ASCII art rendering (opt-in via --art flag)
  if (options.art && process.stdout.isTTY) {
    const conditionCode = weather.weather[0].id;
    const isDay = isDaytime(weather);
    const scene = getScene(conditionCode, weather);
    const paletteName = options.artStyle === 'retro' ? 'retro' : isDay ? 'day' : 'night';
    const renderer = new AsciiRenderer({
      termWidth: getTerminalWidth(),
      paletteName
    });

    renderer.render(scene, { isDay });

    if (options.artOnly) {
      return;
    }
    console.log();
  }

  const emoji = weatherEmojis[weather.weather[0].main] || '🌤️';
  const terminalWidth = getTerminalWidth();

  // Add timestamp
  const timestamp = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  // Compact location header with timestamp
  const locationHeader = `${emoji} ${chalk.cyan.bold(weather.name)}, ${chalk.yellow.bold(weather.sys.country)} ${chalk.gray(`• ${timestamp}`)}`;

  // Compact separator - shorter
  const separator = chalk.gray('─'.repeat(40));

  // More compact sections with tighter spacing
  const tempSection = [
    createDataRow(
      'Temp:',
      `${formatTemp(weather.main.temp, displayUnit, { colorCode: true, type: 'current' })} (feels ${formatTemp(weather.main.feels_like, displayUnit)})`,
      { labelWidth: 8 }
    ),
    createDataRow(
      'Range:',
      `${formatTemp(weather.main.temp_min, displayUnit, { colorCode: true, type: 'min' })} - ${formatTemp(weather.main.temp_max, displayUnit, { colorCode: true, type: 'max' })}`,
      { labelWidth: 8 }
    )
  ].join('\n');

  const conditionsSection = [
    createDataRow('Weather:', weather.weather[0].description, { labelWidth: 8 }),
    createDataRow(
      'Humidity:',
      `${weather.main.humidity}% • ${weather.main.pressure}hPa • ${(weather.visibility / 1000).toFixed(1)}km`,
      { labelWidth: 8 }
    )
  ].join('\n');

  const windSection = [
    createDataRow(
      'Wind:',
      `${formatWindSpeed(weather.wind.speed, displayUnit)} ${weather.wind.deg}°${weather.wind.gust ? ` (gust ${formatWindSpeed(weather.wind.gust, displayUnit)})` : ''}`,
      { labelWidth: 8 }
    )
  ].join('\n');

  const sunSection = [
    createDataRow(
      'Sun:',
      `${formatTime(weather.sys.sunrise)} - ${formatTime(weather.sys.sunset)}`,
      { labelWidth: 8 }
    )
  ].join('\n');

  // Air quality section - more compact
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualitySection = aqi
    ? [
        createDataRow('Air:', `${getAirQualityDescription(aqi)} (AQI: ${aqi})`, { labelWidth: 8 })
      ].join('\n')
    : '';

  // Always use single column for more compact display
  const content = [
    locationHeader,
    separator,
    tempSection,
    conditionsSection,
    windSection,
    sunSection,
    airQualitySection
  ]
    .filter(Boolean)
    .join('\n');

  // More compact box with smaller padding
  console.log(
    boxen(content, {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: 0,
      borderStyle: 'round',
      borderColor: 'cyan',
      width: Math.min(terminalWidth - 2, 80)
    })
  );
}

// Display compact 5-day forecast
function display5DayForecast(data, displayUnit) {
  const dailyData = {};
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const today = new Date().getDay();

  data.forecast.list.forEach((item) => {
    const date = new Date(item.dt * 1000);
    const dateKey = date.toDateString();
    const dayIndex = date.getDay();

    if (!dailyData[dateKey]) {
      dailyData[dateKey] = {
        temps: [],
        descriptions: [],
        dayName: dayNames[dayIndex],
        isToday: dayIndex === today,
        date: date
      };
    }
    dailyData[dateKey].temps.push(item.main.temp);
    dailyData[dateKey].descriptions.push({
      main: item.weather[0].main,
      description: item.weather[0].description
    });
  });

  const forecastLines = Object.entries(dailyData)
    .slice(0, 5)
    .map(([_, info]) => {
      const minTemp = Math.min(...info.temps);
      const maxTemp = Math.max(...info.temps);

      // Get most common weather
      const weatherCount = {};
      info.descriptions.forEach((desc) => {
        weatherCount[desc.main] = (weatherCount[desc.main] || 0) + 1;
      });
      const mostCommonWeather = Object.entries(weatherCount).sort(([, a], [, b]) => b - a)[0][0];
      const emoji = weatherEmojis[mostCommonWeather] || '🌤️';

      const dayLabel = info.isToday ? chalk.yellow(`${info.dayName}`) : info.dayName;
      const temps = `${formatTemp(minTemp, displayUnit, { colorCode: true, type: 'min' })}/${formatTemp(maxTemp, displayUnit, { colorCode: true, type: 'max' })}`;

      return `${emoji} ${dayLabel.padEnd(4)} ${temps}`;
    });

  console.log(
    boxen(forecastLines.join('\n'), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: 0,
      borderStyle: 'round',
      borderColor: 'green'
    })
  );
}

// Display compact 24-hour forecast
function display24HourForecast(data, displayUnit) {
  const next24Hours = data.forecast.list.slice(0, 8); // 3-hour intervals

  const forecastLines = next24Hours.map((item) => {
    const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: 'numeric',
      hour12: true
    });
    const emoji = weatherEmojis[item.weather[0].main] || '🌤️';
    const temp = formatTemp(item.main.temp, displayUnit);

    return `${time.padEnd(6)} ${emoji} ${temp.padEnd(6)} ${chalk.gray(item.weather[0].description)}`;
  });

  console.log(
    boxen(forecastLines.join('\n'), {
      padding: { top: 0, bottom: 0, left: 1, right: 1 },
      margin: 0,
      borderStyle: 'round',
      borderColor: 'blue'
    })
  );
}

export {
  formatTemp,
  formatTime,
  getAirQualityDescription,
  displayCurrentWeather,
  display5DayForecast,
  display24HourForecast,
  displayWeatherBanner,
  createDataRow
};
