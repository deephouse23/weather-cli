# Weather CLI [BETA] 🌤️

![License](https://img.shields.io/badge/license-MIT-blue)
![Version](https://img.shields.io/badge/version-0.0.2--beta-orange)
![16bitweather](https://img.shields.io/badge/16bitweather-weather_suite-brightgreen)
![Beta](https://img.shields.io/badge/status-beta-yellow.svg)
![Node](https://img.shields.io/badge/node-%3E%3D14-brightgreen.svg)

Part of the 16bitweather suite of weather tools

A beautiful command-line weather application that provides current weather and forecasts for any location.

**✨ Now with simplified global installation! Just type `weather london` from anywhere on your system.**

## About 16bitweather

This CLI is part of the 16bitweather ecosystem. Check out our web app at [16bitweather.co](https://16bitweather.co) for a full-featured weather experience.

## ⚠️ Beta Software

**This project is currently in beta development.** While fully functional, please note:

- 🚧 **Active Development**: Features and APIs may change between versions
- 🐛 **Bug Reports Welcome**: If you encounter issues, please [report them](https://github.com/deephouse23/weather-cli/issues)
- 💡 **Feedback Appreciated**: Your suggestions help improve the tool
- 🤝 **Contributions Welcome**: Pull requests and feature requests are encouraged
- 📋 **Stability**: Core weather functionality is stable, but CLI interface may evolve

**We recommend trying it out and providing feedback to help us reach v1.0!**

## Features

- ⚡ **Simplified commands** - `weather london` (no need for `weather now london`)
- 🌍 **Global installation** - Install once, use anywhere on your system
- 🌡️ Current weather conditions with beautiful ASCII art
- 📅 24-hour and 5-day forecasts
- 🎨 Beautiful terminal UI with colors and emojis
- 💾 Save default location and preferences
- 🔄 Interactive mode with prompts
- 🌍 Support for any city worldwide
- 📊 Detailed weather metrics (humidity, pressure, wind speed, air quality)
- ⚖️ Weather comparison between cities
- 📍 GPS coordinates support

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)
- A terminal/command line interface
- An OpenWeatherMap API key (free)

## Installation

### 🚀 Quick Start (Global Installation)

The easiest way to use Weather CLI is to install it globally. This gives you the `weather` command available system-wide:

```bash
# Clone and install globally
git clone https://github.com/deephouse23/weather-cli.git
cd weather-cli
npm install && npm install -g .

# Set up your API key
cp .env.example .env
# Edit .env and add your OpenWeatherMap API key

# Start using it immediately!
weather london
weather "new york" --forecast
weather tokyo --units imperial
```

**That's it! 🎉 The `weather` command is now available from any directory on your system.**

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

### ✅ Verify Installation

Test that everything is working:
```bash
weather london
```

You should see weather data for London with colors and emojis! 🌈

If you get an API error, make sure you've added your OpenWeatherMap API key to the `.env` file.

## Usage

### Quick Start

After global installation, you can use the `weather` command from anywhere:

```bash
# Get current weather (shorthand)
weather london
weather "new york"
weather tokyo --units imperial

# Interactive mode (no arguments)
weather

# Current weather with forecast
weather london --forecast

# 24-hour forecast
weather forecast paris

# Configure defaults
weather config
```

### All Commands

```bash
# Current weather (default command)
weather london
weather "san francisco" --units imperial
weather tokyo --forecast --alerts

# Interactive mode
weather
weather interactive

# Forecasts
weather forecast berlin
weather 5day miami

# Other commands
weather compare london paris
weather coords 40.7128,-74.0060
weather config
weather cache --clear
```

### Development Mode
If you're developing or haven't installed globally:
```bash
node index.js london
npm start
```

## Commands

| Command | Description | Options |
|---------|-------------|---------|
| `[location]` | Get current weather (default) | `--units`, `--forecast`, `--alerts` |
| `now [location]` | Get current weather | `--units`, `--forecast`, `--alerts` |
| `forecast [location]` | Get 24-hour forecast | `--units` |
| `5day [location]` | Get 5-day forecast | `--units` |
| `compare <city1> <city2>` | Compare weather between cities | `--units` |
| `coords <lat,lon>` | Weather by GPS coordinates | `--units` |
| `config` | Set default location and units | - |
| `interactive` or `i` | Interactive mode with prompts | - |
| `cache` | View/clear cache | `--clear` |

## Options

- `--units <type>`: Temperature units (`metric` for Celsius, `imperial` for Fahrenheit)
- `--forecast`: Include 24-hour forecast with current weather
- `--help`: Show help information
- `--version`: Show version

## Examples

```bash
# Current weather (simplified commands)
weather london
weather "new york" --units imperial
weather tokyo --forecast

# All other commands still work
weather now london
weather forecast tokyo
weather 5day berlin --units imperial
weather compare london paris
weather coords 51.5074,-0.1278

# Interactive mode
weather
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

MIT License - see [LICENSE](LICENSE) file for details. Created by 16bitweather.

## Author

16bitweather

---

Built with ❤️ using Node.js, Commander.js, and OpenWeatherMap API