import chalk from 'chalk';

// Tokyo Night Color Palette
export const TokyoNight = {
  // Base colors from Tokyo Night theme
  bg: '#1a1b26',
  fg: '#c0caf5',
  comment: '#565f89',
  cyan: '#7dcfff',
  blue: '#7aa2f7',
  magenta: '#bb9af7',
  red: '#f7768e',
  orange: '#ff9e64',
  yellow: '#e0af68',
  green: '#9ece6a',
  purple: '#9d7cd8',
  teal: '#73daca'
};

// Themed chalk functions for weather-cli
export const theme = {
  // Primary text color
  text: chalk.hex(TokyoNight.fg),

  // Temperature and numbers
  temperature: chalk.hex(TokyoNight.blue).bold,
  number: chalk.hex(TokyoNight.blue),

  // Success states and good weather
  success: chalk.hex(TokyoNight.green),
  good: chalk.hex(TokyoNight.green).bold,

  // Warnings and alerts
  warning: chalk.hex(TokyoNight.yellow),
  alert: chalk.hex(TokyoNight.yellow).bold,

  // Errors and severe weather
  error: chalk.hex(TokyoNight.red),
  severe: chalk.hex(TokyoNight.red).bold,
  danger: chalk.hex(TokyoNight.red).inverse,

  // Info and conditions
  info: chalk.hex(TokyoNight.cyan),
  condition: chalk.hex(TokyoNight.cyan).italic,

  // Headers and locations
  header: chalk.hex(TokyoNight.magenta).bold,
  location: chalk.hex(TokyoNight.magenta).bold.underline,

  // Special weather elements
  sunrise: chalk.hex(TokyoNight.orange),
  sunset: chalk.hex(TokyoNight.orange),
  wind: chalk.hex(TokyoNight.cyan),
  humidity: chalk.hex(TokyoNight.blue),
  pressure: chalk.hex(TokyoNight.purple),

  // Utility colors
  muted: chalk.hex(TokyoNight.comment),
  dim: chalk.hex(TokyoNight.comment).dim,
  bright: chalk.hex(TokyoNight.fg).bold,

  // Temperature gradients
  tempCold: chalk.hex('#7aa2f7'),     // Blue for cold
  tempCool: chalk.hex('#7dcfff'),     // Cyan for cool
  tempMild: chalk.hex('#9ece6a'),     // Green for mild
  tempWarm: chalk.hex('#e0af68'),     // Yellow for warm
  tempHot: chalk.hex('#ff9e64'),      // Orange for hot
  tempVeryHot: chalk.hex('#f7768e')   // Red for very hot
};

// Temperature color function based on Celsius
export function getTemperatureColor(temp, unit = 'celsius') {
  let celsius = temp;

  // Convert to Celsius if needed
  if (unit === 'fahrenheit' || unit === 'imperial') {
    celsius = (temp - 32) * 5/9;
  }

  if (celsius <= 0) return theme.tempCold;
  if (celsius <= 10) return theme.tempCool;
  if (celsius <= 20) return theme.tempMild;
  if (celsius <= 30) return theme.tempWarm;
  if (celsius <= 35) return theme.tempHot;
  return theme.tempVeryHot;
}

// Weather condition color mapping
export function getWeatherConditionColor(condition) {
  const conditionLower = condition.toLowerCase();

  if (conditionLower.includes('clear') || conditionLower.includes('sunny')) {
    return theme.sunrise; // Orange for clear/sunny
  }
  if (conditionLower.includes('cloud') || conditionLower.includes('overcast')) {
    return theme.muted; // Muted for cloudy
  }
  if (conditionLower.includes('rain') || conditionLower.includes('drizzle')) {
    return theme.info; // Cyan for rain
  }
  if (conditionLower.includes('snow') || conditionLower.includes('sleet')) {
    return theme.tempCold; // Blue for snow
  }
  if (conditionLower.includes('storm') || conditionLower.includes('thunder')) {
    return theme.severe; // Red for storms
  }
  if (conditionLower.includes('fog') || conditionLower.includes('mist')) {
    return theme.dim; // Dim for fog
  }
  if (conditionLower.includes('wind')) {
    return theme.wind; // Cyan for windy
  }

  return theme.condition; // Default cyan italic
}

// Air Quality Index color mapping
export function getAQIColor(aqi) {
  switch(aqi) {
    case 1: return theme.good;      // Good - Green
    case 2: return theme.success;   // Fair - Light green
    case 3: return theme.warning;   // Moderate - Yellow
    case 4: return theme.alert;     // Poor - Bold yellow
    case 5: return theme.severe;    // Very Poor - Red
    default: return theme.info;     // Unknown - Cyan
  }
}

// Wind speed color (based on Beaufort scale approximation)
export function getWindColor(windSpeed, unit = 'metric') {
  let mps = windSpeed; // meters per second

  // Convert to m/s if needed
  if (unit === 'imperial') {
    mps = windSpeed * 0.44704; // mph to m/s
  } else if (unit === 'metric') {
    mps = windSpeed; // Already in m/s for OpenWeather
  }

  if (mps < 5.5) return theme.good;        // Light breeze - Green
  if (mps < 10.8) return theme.info;       // Moderate breeze - Cyan
  if (mps < 17.2) return theme.warning;    // Strong breeze - Yellow
  if (mps < 24.5) return theme.alert;      // Near gale - Bold yellow
  return theme.severe;                     // Gale+ - Red
}

// Box styling for weather display
export const boxTheme = {
  borderColor: TokyoNight.comment,
  title: theme.header,
  padding: 1,
  margin: 1,
  borderStyle: 'round'
};

export default theme;