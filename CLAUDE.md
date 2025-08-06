# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development
- `npm install` - Install dependencies
- `npm start` - Run the application using `node index.js`
- `npm run dev` - Run in development mode with auto-restart using `node --watch index.js`

### Running the CLI
- `node index.js` - Runs interactive mode by default
- `node index.js interactive` or `node index.js i` - Interactive mode with prompts
- `node index.js now [location]` - Get current weather
- `node index.js forecast [location]` - Get 24-hour forecast  
- `node index.js 5day [location]` - Get 5-day forecast
- `node index.js compare <city1> <city2>` - Compare weather between two cities
- `node index.js coords <lat,lon>` - Get weather by GPS coordinates
- `node index.js config` - Configure default settings
- `node index.js cache` - View cache status or clear with `-c` flag

### Common CLI Options
- `-u metric|imperial` - Temperature units (default: metric)
- `-f` - Include 24-hour forecast with current weather
- `-a` - Show weather alerts

## Architecture

### Single File Structure
This is a single-file CLI application (`index.js`) built with ES modules. The entire application logic is contained in one file for simplicity.

### Key Components
- **Weather API Integration**: Uses OpenWeatherMap API for current weather, forecasts, and air pollution data
- **Caching System**: Intelligent caching with 30-minute expiration stored in `.weather-cache.json`
- **Configuration**: User settings stored in `.weather-config.json`
- **Interactive Mode**: Uses `inquirer` for user-friendly prompts
- **Display System**: ASCII art weather representations with colored terminal output using `chalk` and `boxen`

### API Endpoints Used
- `weather` - Current weather conditions
- `forecast` - 5-day/3-hour forecast data
- `air_pollution` - Air quality index for weather alerts

### Configuration Files
- `.env` - Contains `WEATHER_API_KEY` (required for OpenWeatherMap API)
- `.weather-config.json` - User preferences (default location, units)
- `.weather-cache.json` - Cached API responses to reduce API calls

### Dependencies
- `axios` - HTTP requests to weather API
- `chalk` - Terminal text coloring
- `boxen` - Terminal boxes for formatted output
- `commander` - CLI command parsing
- `dotenv` - Environment variable loading
- `inquirer` - Interactive command-line prompts
- `ora` - Loading spinners

### Error Handling
- API key validation with helpful error messages
- Location not found (404) handling
- Network error handling with graceful degradation
- Coordinate validation for GPS input