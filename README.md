# weather-cli-16bit v0.3.6

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.3.6-orange)
![16bitweather](https://img.shields.io/badge/16bitweather-weather_suite-brightgreen)
![Beta](https://img.shields.io/badge/status-beta-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)

A command-line weather tool that shows current conditions in a clean, formatted display. Get weather data for any location with a simple terminal command.

## What's New in v0.3.6

### Formatted Display Layout
- Clean two-column grid layout for weather data
- Consistent spacing and alignment for better readability
- Structured sections: header, temperature, time/environmental, atmospheric

### Tokyo Night Color Theme
- Beautiful color scheme with semantic meaning
- Temperature colors that change based on actual values (blue for cold, red for hot)
- Air quality indicators with appropriate colors (green=good, red=unhealthy)
- Dimmed text for less important information

## Quick Start

### Installation
```bash
npm install -g weather-cli-16bit
```

### Setup
```bash
# Set your API key (get free one at openweathermap.org/api)
weather auth set

# Test it works
weather auth test
```

### Usage
```bash
# Basic weather lookup
weather "New York, US"
weather "London, UK"
weather "Tokyo, JP"

# Some major cities work without country
weather London
weather Paris
weather Tokyo
```

## Features

- Current weather conditions with feels-like temperature
- Sunrise/sunset times and min/max temperatures
- Air quality index with color coding
- Humidity, pressure, wind speed and direction
- Visibility and atmospheric data
- Smart caching to reduce API calls
- Secure API key storage in system keychain

## Display Format

The weather data is shown in a structured format:

```
San Francisco, US
clear sky

75°F (Feels like: 73°F)

Sunrise:      06:43 AM  |  Sunset:       06:37 PM
Min Temp:        71°F  |  Max Temp:        75°F
Air Quality: Moderate  |  AQI Index:          3

Humidity:        27%  |  Pressure:    1011 hPa
Wind Speed:  0.38 mph  |  Wind Dir:         36°
Visibility:      10 km  |  UV Index:        N/A
```

## Configuration

### API Key
```bash
# Secure storage (recommended)
weather auth set

# Or set environment variable
export WEATHER_API_KEY=your_key_here
```

### Cache Management
```bash
weather cache           # View cache stats
weather cache --clean   # Remove expired entries
weather cache --clear   # Clear all cache
```

## Commands

```bash
weather "City, Country"     # Current weather
weather now "City"          # Current weather
weather forecast "City"     # 24-hour forecast
weather 5day "City"         # 5-day forecast
weather compare city1 city2 # Compare two cities
weather coords lat,lon      # Weather by coordinates
weather config              # Configure defaults
```

## Installation Options

### Global (Recommended)
```bash
npm install -g weather-cli-16bit
weather "New York, US"
```

### Local Development
```bash
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install
node index.js "New York, US"
```

## Requirements

- Node.js 14 or higher
- OpenWeatherMap API key (free at openweathermap.org/api)

## License

MIT License - see LICENSE file for details.

## Links

- Homepage: [16bitweather.co](https://16bitweather.co)
- Repository: [GitHub](https://github.com/deephouse23/weather-cli)
- Issues: [GitHub Issues](https://github.com/deephouse23/weather-cli/issues)