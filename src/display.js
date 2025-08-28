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
    // Convert m/s to mph
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
  console.log(chalk.cyan.bold(`
╔════════════════════════════════════════════╗
║           🌤️  WEATHER CLI  🌤️              ║
║         Your Terminal Weather Friend       ║
╚════════════════════════════════════════════╝
`));
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

// Display alerts
function displayAlerts(data) {
  if (!data.pollution?.list?.[0]?.main?.aqi) return;
  
  const aqi = data.pollution.list[0].main.aqi;
  const description = getAirQualityDescription(aqi);
  
  console.log(chalk.bold('\n⚠️  Air Quality Alert:'));
  console.log(boxen(
    `Air Quality Index: ${aqi}\nStatus: ${description}`,
    {
      padding: 0,
      margin: 0,
      borderStyle: 'round',
      borderColor: aqi >= 4 ? 'red' : aqi >= 3 ? 'yellow' : 'green'
    }
  ));
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
  
  // Location header
  const locationHeader = `${emoji} ${chalk.cyan.bold(weather.name)}, ${chalk.yellow.bold(weather.sys.country)}`;
  
  // Create main weather display
  const separator = chalk.gray('─'.repeat(60));
  
  // Temperature section
  const tempSection = [
    chalk.bold('🌡️  Temperature'),
    createDataRow('Current:', formatTemp(weather.main.temp, displayUnit, { colorCode: true, type: 'current' }), { labelWidth: 15 }),
    createDataRow('Feels like:', formatTemp(weather.main.feels_like, displayUnit), { labelWidth: 15 }),
    createDataRow('Min:', formatTemp(weather.main.temp_min, displayUnit, { colorCode: true, type: 'min' }), { labelWidth: 15 }),
    createDataRow('Max:', formatTemp(weather.main.temp_max, displayUnit, { colorCode: true, type: 'max' }), { labelWidth: 15 })
  ].join('\n');
  
  // Conditions section
  const conditionsSection = [
    chalk.bold('🌤️  Conditions'),
    createDataRow('Weather:', weather.weather[0].description, { labelWidth: 15 }),
    createDataRow('Humidity:', `${weather.main.humidity}%`, { labelWidth: 15 }),
    createDataRow('Pressure:', `${weather.main.pressure} hPa`, { labelWidth: 15 }),
    createDataRow('Visibility:', `${(weather.visibility / 1000).toFixed(1)} km`, { labelWidth: 15 })
  ].join('\n');
  
  // Wind section
  const windSection = [
    chalk.bold('💨 Wind'),
    createDataRow('Speed:', formatWindSpeed(weather.wind.speed, displayUnit), { labelWidth: 15 }),
    createDataRow('Direction:', `${weather.wind.deg}°`, { labelWidth: 15 }),
    weather.wind.gust ? createDataRow('Gust:', formatWindSpeed(weather.wind.gust, displayUnit), { labelWidth: 15 }) : ''
  ].filter(Boolean).join('\n');
  
  // Sun times
  const sunSection = [
    chalk.bold('🌅 Sun'),
    createDataRow('Sunrise:', formatTime(weather.sys.sunrise), { labelWidth: 15 }),
    createDataRow('Sunset:', formatTime(weather.sys.sunset), { labelWidth: 15 })
  ].join('\n');
  
  // Air quality section
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualitySection = aqi ? [
    chalk.bold('⚠️  Air Quality'),
    createDataRow('AQI:', `${aqi}`, { labelWidth: 15 }),
    createDataRow('Status:', getAirQualityDescription(aqi), { labelWidth: 15 })
  ].join('\n') : '';
  
  // Create two-column layout for wider terminals
  let content;
  if (terminalWidth >= 100) {
    // Two-column layout
    const leftColumn = [tempSection, '', windSection].join('\n');
    const rightColumn = [conditionsSection, '', sunSection, airQualitySection ? '\n' + airQualitySection : ''].join('\n');
    
    const leftLines = leftColumn.split('\n');
    const rightLines = rightColumn.split('\n');
    const maxLines = Math.max(leftLines.length, rightLines.length);
    
    const twoColumnContent = [];
    for (let i = 0; i < maxLines; i++) {
      const left = leftLines[i] || '';
      const right = rightLines[i] || '';
      twoColumnContent.push(`${left.padEnd(45)}${right}`);
    }
    
    content = [
      locationHeader,
      weather.weather[0].description,
      separator,
      twoColumnContent.join('\n')
    ].join('\n');
  } else {
    // Single column layout for narrow terminals
    content = [
      locationHeader,
      weather.weather[0].description,
      separator,
      tempSection,
      separator,
      conditionsSection,
      separator,
      windSection,
      separator,
      sunSection,
      airQualitySection ? separator + '\n' + airQualitySection : ''
    ].filter(Boolean).join('\n');
  }
  
  // Create the box with title
  console.log(boxen(
    content,
    {
      title: '🌍 Current Weather',
      titleAlignment: 'center',
      padding: 1,
      margin: 1,
      borderStyle: 'round',
      borderColor: 'cyan',
      width: Math.min(terminalWidth - 2, 120)
    }
  ));
}

// Display 5-day forecast
function display5DayForecast(data, displayUnit) {
  console.log(chalk.cyan.bold('\n📅 5-Day Forecast:'));
  
  const dailyData = {};
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  
  data.forecast.list.forEach(item => {
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
  
  const forecastLines = Object.entries(dailyData).slice(0, 5).map(([_, info]) => {
    const minTemp = Math.min(...info.temps);
    const maxTemp = Math.max(...info.temps);
    const avgTemp = info.temps.reduce((a, b) => a + b, 0) / info.temps.length;
    
    // Get most common weather
    const weatherCount = {};
    info.descriptions.forEach(desc => {
      weatherCount[desc.main] = (weatherCount[desc.main] || 0) + 1;
    });
    const mostCommonWeather = Object.entries(weatherCount)
      .sort(([,a], [,b]) => b - a)[0][0];
    const emoji = weatherEmojis[mostCommonWeather] || '🌤️';
    
    const dayLabel = info.isToday ? chalk.yellow(`${info.dayName} (Today)`) : info.dayName;
    const temps = `Min: ${formatTemp(minTemp, displayUnit, { colorCode: true, type: 'min' })} | ` +
                 `Max: ${formatTemp(maxTemp, displayUnit, { colorCode: true, type: 'max' })} | ` +
                 `Avg: ${formatTemp(avgTemp, displayUnit)}`;
    
    return createDataRow(
      `${emoji} ${dayLabel}:`,
      temps,
      { labelWidth: 25, valueWidth: 50 }
    );
  });
  
  console.log(boxen(
    forecastLines.join('\n'),
    {
      title: '📊 Temperature Trends',
      titleAlignment: 'center',
      padding: 1,
      margin: 0,
      borderStyle: 'round',
      borderColor: 'green'
    }
  ));
}

// Display 24-hour forecast in grid layout
function display24HourForecast(data, displayUnit) {
  console.log(chalk.cyan.bold('\n⏰ 24-Hour Forecast:'));
  
  const next24Hours = data.forecast.list.slice(0, 8); // 3-hour intervals
  const itemsPerRow = 4;
  const rows = [];
  
  for (let i = 0; i < next24Hours.length; i += itemsPerRow) {
    const rowItems = next24Hours.slice(i, i + itemsPerRow);
    const row = rowItems.map(item => {
      const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
        hour: '2-digit',
        hour12: true
      });
      const emoji = weatherEmojis[item.weather[0].main] || '🌤️';
      const temp = formatTemp(item.main.temp, displayUnit);
      const desc = item.weather[0].description;
      
      // Format as a compact box
      return [
        chalk.bold(time),
        `${emoji} ${temp}`,
        chalk.gray(desc.substring(0, 12))
      ].join('\n');
    });
    
    rows.push(row);
  }
  
  // Create grid layout
  const gridContent = rows.map(row => {
    const cells = row.map(cell => {
      const lines = cell.split('\n');
      return lines.map(line => line.padEnd(18)).join('\n');
    });
    
    // Combine cells horizontally
    const maxLines = 3;
    const combinedLines = [];
    for (let i = 0; i < maxLines; i++) {
      const lineContent = cells.map(cell => {
        const cellLines = cell.split('\n');
        return cellLines[i] || ''.padEnd(18);
      }).join(' │ ');
      combinedLines.push(lineContent);
    }
    
    return combinedLines.join('\n');
  }).join('\n' + chalk.gray('─'.repeat(80)) + '\n');
  
  console.log(boxen(
    gridContent,
    {
      title: '🕐 Hourly Breakdown',
      titleAlignment: 'center',
      padding: 1,
      margin: 0,
      borderStyle: 'round',
      borderColor: 'blue'
    }
  ));
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
  display24HourForecast,
  displayWeatherBanner,
  createDataRow
};