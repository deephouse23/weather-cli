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

// Display current weather in horizontal layout
function displayCurrentWeather(data, displayUnit) {
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
  display5DayForecast,
  display24HourForecast
};
