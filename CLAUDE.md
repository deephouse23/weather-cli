# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

### Development

- `npm install` - Install dependencies
- `npm start` - Run the application using `node bin/weather.js`
- `npm run dev` - Run in development mode with auto-restart using `node --watch bin/weather.js`

### Testing & Quality

- `npm test` - Run all unit tests (Vitest)
- `npm run test:watch` - Run tests in watch mode
- `npm run test:coverage` - Run tests with coverage report
- `npm run lint` - Check for ESLint errors
- `npm run lint:fix` - Auto-fix ESLint errors
- `npm run format` - Format all files with Prettier
- `npm run format:check` - Check formatting without writing

### Running the CLI

#### Global Installation (Recommended)

After `npm install -g .`:

- `weather` - Interactive mode by default
- `weather <location>` - Get current weather (flexible format)
- `weather london` - Current weather for London
- `weather "new york"` - Current weather for New York
- `weather "san ramon, ca"` - Current weather with state
- `weather forecast [location]` - Get 24-hour forecast
- `weather 5day [location]` - Get 5-day forecast
- `weather compare <city1> <city2>` - Compare weather between two cities
- `weather coords <lat,lon>` - Get weather by GPS coordinates
- `weather config` - Configure default settings
- `weather cache` - View cache status
- `weather cache -c` - Clear cache
- `weather auth set` - Store API key securely
- `weather auth test` - Test API key validity

#### Local Development

- `node index.js` - Runs interactive mode by default
- `node index.js london` - Get current weather for London
- `node index.js now [location]` - Get current weather
- `node index.js forecast [location]` - Get 24-hour forecast
- `node index.js 5day [location]` - Get 5-day forecast

### Common CLI Options

- `-u metric|imperial` - Temperature units (default: metric)
- `-f` - Include 24-hour forecast with current weather
- `-a` - Show weather alerts

## Architecture

### Module Structure

The CLI entry point is `index.js`, with supporting modules in `src/`:

- `src/weather.js` - Weather data fetching (shared `_fetchWeatherData` helper)
- `src/display.js` - Terminal display formatting (boxen, chalk)
- `src/config.js` - User configuration (load/save `.weather-config.json`)
- `src/cache.js` - Response caching with LRU eviction
- `src/api/http.js` - Axios HTTP client with retry and rate limit handling
- `src/api/auth.js` - API key management (keytar + env fallback)
- `src/utils/errors.js` - WeatherError class and exit code mapping
- `src/utils/validators.js` - Input sanitization and validation
- `src/utils/locationParser.js` - Smart location parsing (state/province codes, major cities)

### Key Components

- **Weather API Integration**: Uses OpenWeatherMap API for current weather, forecasts, and air pollution data
- **Caching System**: Intelligent caching with 30-minute expiration stored in `.weather-cache.json`
- **Configuration**: User settings stored in `.weather-config.json`
- **Interactive Mode**: Uses `inquirer` for user-friendly prompts
- **Display System**: Colored terminal output using `chalk` and `boxen`

### API Endpoints Used

- `weather` - Current weather conditions
- `forecast` - 5-day/3-hour forecast data
- `air_pollution` - Air quality index for weather alerts

### Configuration Files

- `.env` - Contains `WEATHER_API_KEY` (required for OpenWeatherMap API)
- `.weather-config.json` - User preferences (default location, units)
- `.weather-cache.json` - Cached API responses to reduce API calls

### Dependencies

- `axios` / `axios-retry` - HTTP requests with retry logic
- `chalk` - Terminal text coloring
- `boxen` - Terminal boxes for formatted output
- `commander` - CLI command parsing
- `dotenv` - Environment variable loading
- `inquirer` - Interactive command-line prompts
- `ora` - Loading spinners
- `keytar` - Secure API key storage

### Error Handling

- API key validation with helpful error messages
- Location not found (404) handling
- Network error handling with graceful degradation
- Coordinate validation for GPS input
- Rate limit detection with retry-after support
