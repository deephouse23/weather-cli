# Weather CLI 🌤️

A beautiful command-line weather application that provides current weather and forecasts for any location.

## Features

- 🌡️ Current weather conditions
- 📅 24-hour forecast
- 🎨 Beautiful terminal UI with colors and emojis
- 💾 Save default location and preferences
- 🔄 Interactive mode with prompts
- 🌍 Support for any city worldwide
- 📊 Detailed weather metrics (humidity, pressure, wind speed)

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A terminal/command line interface
- An OpenWeatherMap API key (free)

## Installation

### Quick Setup (Copy & Paste)

```bash
# Clone the repository
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli

# Install dependencies
npm install

# Create your .env file
cp .env.example .env

# Now edit .env and add your API key (see below)
```

### Get Your API Key

1. Go to [OpenWeatherMap](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Go to "API Keys" in your account
4. Copy your API key
5. Open `.env` file in any text editor
6. Replace `your_api_key_here` with your actual key:
   ```
   WEATHER_API_KEY=put your key here bro
   ```

### Verify Installation

Test that everything is working:
```bash
node index.js now London
```

You should see weather data for London with colors and emojis!

## Usage

### Running the Application

This is a local CLI tool that runs in your terminal. No server or deployment needed!

### Interactive Mode (Default)
Just run the command without arguments:
```bash
node index.js
```
Or:
```bash
npm start
```

This will prompt you for location and preferences.

### Current Weather
```bash
node index.js now London
node index.js now "New York" --units imperial
node index.js now Tokyo --forecast
```

### Forecast
```bash
node index.js forecast Paris
node index.js forecast Berlin --units imperial
```

### Configure Defaults
```bash
node index.js config
```

### Global Installation (Optional)
To use the `weather` command globally:
```bash
npm link
```

Then you can use:
```bash
weather
weather now London
weather forecast Tokyo
```

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `now [location]` | Get current weather | `--units`, `--forecast` |
| `forecast [location]` | Get 24-hour forecast | `--units` |
| `config` | Set default location and units | - |
| `interactive` or `i` | Interactive mode with prompts | - |

## Options

- `--units <type>`: Temperature units (`metric` for Celsius, `imperial` for Fahrenheit)
- `--forecast`: Include 24-hour forecast with current weather
- `--help`: Show help information
- `--version`: Show version

## Examples

```bash
# Current weather in London
weather now London

# Current weather in New York with Fahrenheit
weather now "New York" --units imperial

# 24-hour forecast for Tokyo
weather forecast Tokyo

# Current weather with forecast
weather now Paris --forecast

# Interactive mode
weather i
```

## Troubleshooting

### "No API key found" Error
- Make sure `.env` file exists (not `.env.example`)
- Check that your API key is in `.env` file
- Ensure no spaces around the `=` sign: `WEATHER_API_KEY=yourkey`

### "Location not found" Error
- Try using a major city name
- Use quotes for multi-word cities: `"San Francisco"`
- Check spelling

### API Key Issues
- Free tier allows 1,000 calls/day
- New API keys may take 10-15 minutes to activate
- Check your key at: https://openweathermap.org/api/keys

## How It Works

This CLI application:
1. Reads your API key from `.env` file (kept private/local)
2. Makes HTTPS requests to OpenWeatherMap API
3. Formats and displays the data in your terminal
4. Saves preferences locally (never uploaded)

All data stays on your machine. The only external connection is to OpenWeatherMap's API to fetch weather data.

## Contributing

Feel free to fork and improve! Some ideas:
- Add weather maps
- Add severe weather alerts
- Support for multiple cities
- Weather graphs/charts
- Desktop notifications

## License

MIT

## Author

deephouse23

---

Built with ❤️ using Node.js, Commander.js, and OpenWeatherMap API