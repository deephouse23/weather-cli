# weather-cli-16bit v0.3.55

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.3.55-orange)
![16bitweather](https://img.shields.io/badge/16bitweather-weather_suite-brightgreen)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)

Command-line weather application with clean horizontal layout and responsive design.

## Installation

Install globally:
```bash
npm i -g weather-cli-16bit
```

## Usage

Get current weather:
```bash
weather "New York"
weather "London, UK"
weather "Tokyo"
```

Get forecast:
```bash
weather forecast "Paris"
weather 5day "Berlin"
```

Compare cities:
```bash
weather compare "Tokyo" "New York"
```

Use coordinates:
```bash
weather coords "40.7128,-74.0060"
```

Interactive mode:
```bash
weather
```

## Features

- Current weather conditions
- 24-hour and 5-day forecasts
- Air quality information
- City comparisons
- GPS coordinate support
- Responsive terminal layout
- Automatic unit detection
- Data caching for performance
- Tokyo Night color theme

## Configuration

Set default location and units:
```bash
weather config
```

Manage API key:
```bash
weather auth set
weather auth test
```

Cache management:
```bash
weather cache --clear
weather cache --clean
```

## API Key

Get a free API key from [OpenWeatherMap](https://openweathermap.org/api):
1. Create an account
2. Generate an API key
3. Run `weather auth set` to configure

## Requirements

- Node.js 14 or higher
- OpenWeatherMap API key

## License

MIT

## Author

16bitweather