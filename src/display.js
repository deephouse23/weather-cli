import chalk from 'chalk';
import boxen from 'boxen';
import { theme, getTemperatureColor, getWeatherConditionColor, getAQIColor, getWindColor, boxTheme } from './theme.js';

// Weather emoji mapping (removed - no longer using emojis)

// Format temperature with Tokyo Night colors
function formatTemp(temp, displayUnit) {
  const unit = displayUnit === 'fahrenheit' ? '°F' : '°C';
  const tempColor = getTemperatureColor(temp, displayUnit);
  return tempColor(`${Math.round(temp)}${unit}`);
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

// Display alerts with Tokyo Night colors
function displayAlerts(data) {
  if (!data.pollution?.list?.[0]?.main?.aqi) return;

  const aqi = data.pollution.list[0].main.aqi;
  const description = getAirQualityDescription(aqi);
  const aqiColor = getAQIColor(aqi);

  console.log(aqiColor(`\nAir Quality: ${description} (AQI: ${aqi})`));
}

// Display sun times with Tokyo Night colors
function displaySunTimes(data) {
  const { sunrise, sunset } = data.current.sys;
  console.log(theme.sunrise(`\nSunrise: ${formatTime(sunrise)}`));
  console.log(theme.sunset(`Sunset: ${formatTime(sunset)}`));
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

// Display current weather with new formatted layout
function displayCurrentWeather(data, displayUnit) {
  const weather = data.current;
  const layout = createFormattedLayout(weather, data, displayUnit);

  // Create the box with Tokyo Night styling
  console.log(boxen(
    layout,
    {
      padding: boxTheme.padding,
      margin: boxTheme.margin,
      borderStyle: boxTheme.borderStyle,
      borderColor: '#3b4261', // dark blue-gray border
      width: 60
    }
  ));
}

// Create formatted layout according to v0.3.6 specifications with Tokyo Night colors
function createFormattedLayout(weather, data, displayUnit) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'Moderate';
  const unit = displayUnit === 'fahrenheit' ? '°F' : '°C';

  // Tokyo Night color definitions
  const locationColor = chalk.hex('#7dcfff'); // cyan for location
  const conditionColor = chalk.hex('#9d7cd8'); // purple for weather condition
  const labelColor = chalk.hex('#a9b1d6'); // light gray-blue for labels
  const timeColor = chalk.hex('#bb9af7'); // magenta for time values
  const dimColor = chalk.hex('#565f89'); // dimmed gray-blue
  const separatorColor = chalk.hex('#3b4261'); // dark blue-gray for separators
  const tealColor = chalk.hex('#73daca'); // teal for atmospheric data
  const cyanColor = chalk.hex('#7dcfff'); // cyan for wind direction
  const orangeColor = chalk.hex('#ff9e64'); // orange

  // Temperature color function
  const getTempColorValue = (temp) => {
    const fahrenheitTemp = displayUnit === 'fahrenheit' ? temp : (temp * 9/5) + 32;
    if (fahrenheitTemp > 80) return chalk.hex('#f7768e'); // hot - red
    if (fahrenheitTemp > 70) return chalk.hex('#ff9e64'); // warm - orange
    if (fahrenheitTemp >= 60) return chalk.hex('#9ece6a'); // mild - green
    return chalk.hex('#7aa2f7'); // cool - blue
  };

  // AQI color function
  const getAQIColorValue = (aqi, desc) => {
    if (!aqi) return dimColor;
    switch(aqi) {
      case 1: return chalk.hex('#9ece6a'); // Good - green
      case 2: return chalk.hex('#9ece6a'); // Fair - green
      case 3: return chalk.hex('#e0af68'); // Moderate - yellow
      case 4:
      case 5: return chalk.hex('#f7768e'); // USG/Unhealthy - red
      default: return dimColor;
    }
  };

  // Header Section (2 lines)
  const headerLine1 = locationColor.bold(`${weather.name}, ${weather.sys.country}`);
  const headerLine2 = conditionColor(weather.weather[0].description);

  // Primary Temperature Section (1 line) with color based on value
  const tempColor = getTempColorValue(weather.main.temp);
  const feelsLikeColor = getTempColorValue(weather.main.feels_like);
  const tempLine = `${tempColor.bold(Math.round(weather.main.temp) + unit)} ${dimColor('(Feels like:')} ${feelsLikeColor(Math.round(weather.main.feels_like) + unit)}${dimColor(')')}`;

  // Calculate daily min/max from forecast data (today's actual low/high)
  const today = new Date().toDateString();
  const todayForecasts = data.forecast?.list?.filter(item => {
    const forecastDate = new Date(item.dt * 1000).toDateString();
    return forecastDate === today;
  }) || [];

  let dailyMin, dailyMax;
  if (todayForecasts.length > 0) {
    // Get the actual min/max from all today's forecast entries
    const allTemps = todayForecasts.flatMap(f => [f.main.temp, f.main.temp_min, f.main.temp_max]);
    dailyMin = Math.min(...allTemps, weather.main.temp); // Include current temp
    dailyMax = Math.max(...allTemps, weather.main.temp); // Include current temp
  } else {
    // Fallback: use first day of forecast if today's data not available
    const firstDayForecasts = data.forecast?.list?.slice(0, 8) || []; // First 8 entries (24 hours)
    if (firstDayForecasts.length > 0) {
      const allTemps = firstDayForecasts.flatMap(f => [f.main.temp, f.main.temp_min, f.main.temp_max]);
      dailyMin = Math.min(...allTemps, weather.main.temp);
      dailyMax = Math.max(...allTemps, weather.main.temp);
    } else {
      // Final fallback to current weather min/max
      dailyMin = weather.main.temp_min;
      dailyMax = weather.main.temp_max;
    }
  }

  // Time & Environmental Grid (2-column aligned) with colors
  const sunriseStr = timeColor(formatTime(sunrise));
  const sunsetStr = timeColor(formatTime(sunset));
  const minTempStr = getTempColorValue(dailyMin)(`${Math.round(dailyMin)}${unit}`);
  const maxTempStr = getTempColorValue(dailyMax)(`${Math.round(dailyMax)}${unit}`);
  const aqiColoredDesc = getAQIColorValue(aqi)(airQualityDesc);
  const aqiIndexStr = aqi ? getAQIColorValue(aqi)(aqi.toString()) : dimColor('3');

  const timeEnvGrid = [
    formatColoredGridRow(labelColor('Sunrise:'), sunriseStr, labelColor('Sunset:'), sunsetStr, separatorColor),
    formatColoredGridRow(labelColor('Min Temp:'), minTempStr, labelColor('Max Temp:'), maxTempStr, separatorColor),
    formatColoredGridRow(labelColor('Air Quality:'), aqiColoredDesc, labelColor('AQI Index:'), aqiIndexStr, separatorColor)
  ];

  // Atmospheric Conditions Grid (2-column aligned) with colors
  const humidityStr = tealColor(`${weather.main.humidity}%`);
  const pressureStr = tealColor(`${weather.main.pressure} hPa`);
  const windSpeedStr = tealColor(`${weather.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}`);
  const windDirStr = cyanColor(`${weather.wind.deg || 0}°`);
  const visibilityStr = tealColor(`${(weather.visibility / 1000)} km`);
  const uvIndexStr = dimColor('N/A'); // Dimmed when N/A

  const atmosphericGrid = [
    formatColoredGridRow(labelColor('Humidity:'), humidityStr, labelColor('Pressure:'), pressureStr, separatorColor),
    formatColoredGridRow(labelColor('Wind Speed:'), windSpeedStr, labelColor('Wind Dir:'), windDirStr, separatorColor),
    formatColoredGridRow(labelColor('Visibility:'), visibilityStr, labelColor('UV Index:'), uvIndexStr, separatorColor)
  ];

  // Combine all sections
  return [
    headerLine1,
    headerLine2,
    '',
    tempLine,
    '',
    ...timeEnvGrid,
    '',
    ...atmosphericGrid
  ].join('\n');
}

// Format colored grid row with consistent column widths
function formatColoredGridRow(label1, value1, label2, value2, separatorColor) {
  const labelWidth = 12;
  const valueWidth = 10;
  const separator = separatorColor(' | ');

  // Strip ANSI codes for length calculation
  const stripAnsi = (str) => {
    return str.replace(/\x1b\[[0-9;]*m/g, '');
  };

  // Pad based on actual string length without ANSI codes
  const padEndWithColor = (str, width) => {
    const actualLength = stripAnsi(str).length;
    const padding = Math.max(0, width - actualLength);
    return str + ' '.repeat(padding);
  };

  const padStartWithColor = (str, width) => {
    const actualLength = stripAnsi(str).length;
    const padding = Math.max(0, width - actualLength);
    return ' '.repeat(padding) + str;
  };

  const formattedLabel1 = padEndWithColor(label1, labelWidth);
  const formattedValue1 = padStartWithColor(value1, valueWidth);
  const formattedLabel2 = padEndWithColor(label2, labelWidth);
  const formattedValue2 = padStartWithColor(value2, valueWidth);

  return `${formattedLabel1}${formattedValue1}${separator}${formattedLabel2}${formattedValue2}`;
}

// Legacy display function for backward compatibility
function displayCurrentWeatherLegacy(data, displayUnit) {
  const weather = data.current;
  const terminalWidth = getTerminalWidth();

  // Responsive design based on terminal width
  let layout;
  if (terminalWidth < 60) {
    // Ultra compact layout for very small terminals
    layout = createUltraCompactLayout(weather, data, displayUnit);
  } else if (terminalWidth < 80) {
    // Compact layout for small terminals
    layout = createCompactLayout(weather, data, displayUnit);
  } else if (terminalWidth < 120) {
    // Medium layout
    layout = createMediumLayout(weather, data, displayUnit);
  } else {
    // Full horizontal layout
    layout = createFullLayout(weather, data, displayUnit);
  }

  // Create the box with Tokyo Night styling
  console.log(boxen(
    layout,
    {
      padding: boxTheme.padding,
      margin: boxTheme.margin,
      borderStyle: boxTheme.borderStyle,
      borderColor: boxTheme.borderColor,
      width: Math.min(terminalWidth - 2, 120)
    }
  ));
}

// Ultra compact layout for very small terminals
function createUltraCompactLayout(weather, data, displayUnit) {
  const conditionColor = getWeatherConditionColor(weather.weather[0].description);

  return [
    theme.location(weather.name),
    '',
    formatTemp(weather.main.temp, displayUnit),
    conditionColor(weather.weather[0].description),
    '',
    `Feels like: ${formatTemp(weather.main.feels_like, displayUnit)}`,
    `Humidity: ${theme.humidity(weather.main.humidity + '%')}`,
    `Wind: ${weather.wind.speed} ${displayUnit === 'fahrenheit' ? 'mph' : 'm/s'}`
  ].join('\n');
}

// Compact layout for small terminals with Tokyo Night colors
function createCompactLayout(weather, data, displayUnit) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  const conditionColor = getWeatherConditionColor(weather.weather[0].description);
  const windColor = getWindColor(weather.wind.speed, displayUnit);
  const aqiColor = getAQIColor(aqi);

  return [
    theme.location(`${weather.name}, ${weather.sys.country}`),
    '',
    conditionColor(weather.weather[0].description),
    '',
    `Temperature: ${formatTemp(weather.main.temp, displayUnit)}`,
    `Feels like: ${formatTemp(weather.main.feels_like, displayUnit)}`,
    '',
    `Humidity: ${theme.humidity(weather.main.humidity + '%')}`,
    `Wind: ${windColor(weather.wind.speed + ' ' + (displayUnit === 'fahrenheit' ? 'mph' : 'm/s'))}`,
    '',
    `Sunrise: ${theme.sunrise(formatTime(sunrise))}`,
    `Sunset: ${theme.sunset(formatTime(sunset))}`,
    '',
    `Air Quality: ${aqiColor(airQualityDesc + (aqi ? ` (AQI: ${aqi})` : ''))}`
  ].join('\n');
}

// Medium layout with Tokyo Night colors
function createMediumLayout(weather, data, displayUnit) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  const conditionColor = getWeatherConditionColor(weather.weather[0].description);
  const windColor = getWindColor(weather.wind.speed, displayUnit);
  const aqiColor = getAQIColor(aqi);

  const leftSection = [
    theme.location(`${weather.name}, ${weather.sys.country}`),
    '',
    conditionColor(weather.weather[0].description),
    '',
    formatTemp(weather.main.temp, displayUnit),
    `${theme.text('Feels like:')} ${formatTemp(weather.main.feels_like, displayUnit)}`,
    '',
    `${theme.text('Humidity:')} ${theme.humidity(weather.main.humidity + '%')}`
  ];

  const rightSection = [
    '',
    '',
    `${theme.text('Sunrise:')} ${theme.sunrise(formatTime(sunrise))}`,
    `${theme.text('Sunset:')} ${theme.sunset(formatTime(sunset))}`,
    '',
    `${theme.text('Air Quality:')} ${aqiColor(airQualityDesc + (aqi ? ` (AQI: ${aqi})` : ''))}`,
    '',
    `${theme.text('Wind:')} ${windColor(weather.wind.speed + ' ' + (displayUnit === 'fahrenheit' ? 'mph' : 'm/s'))}`
  ];
  
  return createHorizontalLayout(leftSection, rightSection, 35, 40);
}

// Full horizontal layout with Tokyo Night colors
function createFullLayout(weather, data, displayUnit) {
  const { sunrise, sunset } = weather.sys;
  const aqi = data.pollution?.list?.[0]?.main?.aqi;
  const airQualityDesc = aqi ? getAirQualityDescription(aqi) : 'N/A';
  const conditionColor = getWeatherConditionColor(weather.weather[0].description);
  const windColor = getWindColor(weather.wind.speed, displayUnit);
  const aqiColor = getAQIColor(aqi);

  const leftSection = [
    theme.location(`${weather.name}, ${weather.sys.country}`),
    '',
    conditionColor(weather.weather[0].description),
    '',
    formatTemp(weather.main.temp, displayUnit),
    '',
    `${theme.text('Feels like:')} ${formatTemp(weather.main.feels_like, displayUnit)}`,
    `${theme.text('Humidity:')} ${theme.humidity(weather.main.humidity + '%')}`,
    `${theme.text('Pressure:')} ${theme.pressure(weather.main.pressure + ' hPa')}`,
    `${theme.text('Wind:')} ${windColor(weather.wind.speed + ' ' + (displayUnit === 'fahrenheit' ? 'mph' : 'm/s'))}`
  ];

  const rightSection = [
    '',
    '',
    `${theme.text('Sunrise:')} ${theme.sunrise(formatTime(sunrise))}`,
    `${theme.text('Sunset:')} ${theme.sunset(formatTime(sunset))}`,
    '',
    `${theme.text('Air Quality:')} ${aqiColor(airQualityDesc + (aqi ? ` (AQI: ${aqi})` : ''))}`,
    `${theme.text('Min:')} ${formatTemp(weather.main.temp_min, displayUnit)}`,
    `${theme.text('Max:')} ${formatTemp(weather.main.temp_max, displayUnit)}`,
    `${theme.text('Wind Dir:')} ${theme.info(weather.wind.deg + '°')}`,
    `${theme.text('Visibility:')} ${theme.info((weather.visibility / 1000) + 'km')}`
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

// Display 5-day forecast with Tokyo Night colors
function display5DayForecast(data, displayUnit) {
  console.log(theme.header('\n5-Day Forecast:'));
  
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
    
    console.log(theme.text(`${date}: ${formatTemp(avgTemp, displayUnit)} - ${mostCommonDesc}`));
  });
}

// Display 24-hour forecast
function display24HourForecast(data, displayUnit) {
  console.log(theme.header('\n24-Hour Forecast:'));
  
  const next24Hours = data.forecast.list.slice(0, 8); // 3-hour intervals
  
  next24Hours.forEach(item => {
    const time = new Date(item.dt * 1000).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
    console.log(theme.text(`${time}: ${formatTemp(item.main.temp, displayUnit)} - ${item.weather[0].description}`));
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
  displayCurrentWeatherLegacy,
  display5DayForecast,
  display24HourForecast,
  createFormattedLayout,
  formatColoredGridRow
};
