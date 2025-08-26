import chalk from 'chalk';
import boxen from 'boxen';

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
    1: 'Good',
    2: 'Fair',
    3: 'Moderate',
    4: 'Poor',
    5: 'Very Poor'
  };
  return descriptions[aqi] || 'Unknown';
}

// Display alerts
function displayAlerts(data) {
  if (!data.pollution?.list?.[0]?.main?.aqi) return;
  
  const aqi = data.pollution.list[0].main.aqi;
  const description = getAirQualityDescription(aqi);
  
  let color = chalk.green;
  if (aqi >= 4) color = chalk.red;
  else if (aqi >= 3) color = chalk.yellow;
  
  console.log(color(`\n⚠️  Air Quality: ${description} (AQI: ${aqi})`));
}

// Display sun times
function displaySunTimes(data) {
  const { sunrise, sunset } = data.current.sys;
  console.log(chalk.yellow(`\n🌅 Sunrise: ${formatTime(sunrise)}`));
  console.log(chalk.magenta(`🌇 Sunset: ${formatTime(sunset)}`));
}

// Display ASCII art
function displayASCIIArt(weatherMain) {
  const art = {
    Clear: '    \\   /    \n     .-.     \n  ― (   ) ―  \n     `-´     \n    /   \\    ',
    Clouds: '     .--.     \n  .-(    ).   \n (___.__)__)  ',
    Rain: '     .--.     \n  .-(    ).   \n (___.__)__)  \n   ／|／|／   ',
    Snow: '     .--.     \n  .-(    ).   \n (___.__)__)  \n   * * * *   ',
    Thunderstorm: '     .--.     \n  .-(    ).   \n (___.__)__)  \n   ⚡⚡⚡   '
  };
  
  return art[weatherMain] || art.Clouds;
}

// Get terminal width
function getTerminalWidth() {
  return process.stdout.columns || 80;
}

// Display current weather in horizontal layout
function displayCurrentWeather(data, displayUnit) {
  // Check if data has current property or is the weather data directly
  const weather = data.current || data;
  
  // Add safety checks for weather data
  if (!weather || !weather.weather || !weather.weather[0]) {
    console.error(chalk.red('❌ Invalid weather data structure'));
    return;
  }
  
  const emoji = weatherEmojis[weather.weather[0].main] || '🌤️';
  const terminalWidth = getTerminalWidth();
  
  // Responsive design based on terminal width
  let layout;
  if (terminalWidth < 80) {
    // Compact layout for small terminals
    layout = createCompactLayout(weather, data, displayUnit, emoji);
  } else if (terminalWidth < 120) {
    // Medium layout
    layout = createMediumLayout(weather, data, displayUnit, emoji);
  } else {
    // Full horizontal layout
    layout = createFullLayout(weather, data, displayUnit, emoji);
  }
  
  // Create the box with appropriate width
  console.log(boxen(
    layout,
    {
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      width: Math.min(terminalWidth - 2, 120)
    }
  ));
}

// Compact layout for small terminals
function createCompactLayout(weather, data, displayUnit, emoji) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  
  return [
    `${emoji}  ${chalk.cyan.bold(weather.name)}, ${chalk.yellow.bold(weather.sys.country)}`,
    `${weather.weather[0].description}`,
    `🌡️  ${formatTemp(weather.main.temp, displayUnit)} | 💭 ${formatTemp(weather.main.feels_like, displayUnit)}`,
    `💧 ${weather.main.humidity}% | 💨 ${weather.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}`,
    `🌅 ${formatTime(sunrise)} | 🌇 ${formatTime(sunset)}`,
    `⚠️  Air Quality: ${airQualityDesc}${aqi ? ` (AQI: ${aqi})` : ''}`
  ].join('\n');
}

// Medium layout
function createMediumLayout(weather, data, displayUnit, emoji) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  
  const leftSection = [
    `${emoji}  ${chalk.cyan.bold(weather.name)}, ${chalk.yellow.bold(weather.sys.country)}`,
    `${weather.weather[0].description}`,
    `🌡️  ${formatTemp(weather.main.temp, displayUnit)}`,
    `💭 Feels like: ${formatTemp(weather.main.feels_like, displayUnit)}`,
    `💧 Humidity: ${weather.main.humidity}%`
  ];
  
  const rightSection = [
    `🌅 Sunrise: ${formatTime(sunrise)}`,
    `🌇 Sunset: ${formatTime(sunset)}`,
    `⚠️  Air Quality: ${airQualityDesc}${aqi ? ` (AQI: ${aqi})` : ''}`,
    `💨 Wind: ${weather.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}`
  ];
  
  return createHorizontalLayout(leftSection, rightSection, 35, 40);
}

// Full horizontal layout
function createFullLayout(weather, data, displayUnit, emoji) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  
  const leftSection = [
    `${emoji}  ${chalk.cyan.bold(weather.name)}, ${chalk.yellow.bold(weather.sys.country)}`,
    `${weather.weather[0].description}`,
    `🌡️  ${formatTemp(weather.main.temp, displayUnit)}`,
    `💭 Feels like: ${formatTemp(weather.main.feels_like, displayUnit)}`,
    `💧 Humidity: ${weather.main.humidity}%`,
    `📊 Pressure: ${weather.main.pressure} hPa`,
    `💨 Wind: ${weather.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}`
  ];
  
  const rightSection = [
    `🌅 Sunrise: ${formatTime(sunrise)}`,
    `🌇 Sunset: ${formatTime(sunset)}`,
    `⚠️  Air Quality: ${airQualityDesc}${aqi ? ` (AQI: ${aqi})` : ''}`,
    `🌡️  Min: ${formatTemp(weather.main.temp_min, displayUnit)}`,
    `🌡️  Max: ${formatTemp(weather.main.temp_max, displayUnit)}`,
    `🧭 Wind Dir: ${weather.wind.deg}°`,
    `👁️  Visibility: ${weather.visibility / 1000}km`
  ];
  
  return createHorizontalLayout(leftSection, rightSection, 50, 60);
}

// Helper function to create horizontal layout
function createHorizontalLayout(leftSection, rightSection, leftWidth, rightWidth) {
  const maxLines = Math.max(leftSection.length, rightSection.length);
  let layout = '';
  
  for (let i = 0; i < maxLines; i++) {
    const leftLine = leftSection[i] || '';
    const rightLine = rightSection[i] || '';
    
    const paddedLeft = leftLine.padEnd(leftWidth);
    const paddedRight = rightLine.padEnd(rightWidth);
    
    layout += `${paddedLeft}  ${paddedRight}\n`;
  }
  
  return layout;
}

// Display 5-day forecast
function display5DayForecast(data, displayUnit) {
  console.log(chalk.cyan.bold('\n📅 5-Day Forecast:'));
  
  const dailyData = {};
  data.forecast.list.forEach(item => {
    const date = new Date(item.dt * 1000).toDateString();
    if (!dailyData[date]) {
      dailyData[date] = {
        temps: [],
        descriptions: []
      };
    }
    dailyData[date].temps.push(item.main.temp);
    dailyData[date].descriptions.push(item.weather[0].description);
  });
  
  Object.entries(dailyData).forEach(([date, info]) => {
    const avgTemp = info.temps.reduce((a, b) => a + b, 0) / info.temps.length;
    const mostCommonDesc = info.descriptions.sort((a, b) => 
      info.descriptions.filter(v => v === a).length - info.descriptions.filter(v => v === b).length
    ).pop();
    
    console.log(chalk.white(`${date}: ${formatTemp(avgTemp, displayUnit)} - ${mostCommonDesc}`));
  });
}

// Display 24-hour forecast
function display24HourForecast(data, displayUnit) {
  console.log(chalk.cyan.bold('\n⏰ 24-Hour Forecast:'));
  
  const next24Hours = data.forecast.list.slice(0, 8); // 3-hour intervals
  
  next24Hours.forEach(item => {
    const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    const emoji = weatherEmojis[item.weather[0].main] || '🌤️';
    
    console.log(chalk.white(`${time}: ${emoji} ${formatTemp(item.main.temp, displayUnit)} - ${item.weather[0].description}`));
  });
}

export {
  formatTemp,
  formatTime,
  getAirQualityDescription,
  displayAlerts,
  displaySunTimes,
  displayASCIIArt,
  displayCurrentWeather,
  display5DayForecast,
  display24HourForecast
};
