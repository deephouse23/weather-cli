# weather-cli-16bit v0.3.56 - Formatted Display & Enhanced Colors

Clean, structured weather display with improved Tokyo Night color theme for better readability and visual appeal.

## New Formatted Display Layout

Transform your weather experience with a professional grid layout:
- **Two-Column Grid**: Clean alignment of all weather data
- **Structured Sections**: Header, temperature, time/environmental, atmospheric
- **Consistent Spacing**: Perfect alignment with monospace-friendly formatting
- **Professional Look**: Organized display that's easy to scan and read

## Enhanced Tokyo Night Colors

Improved color scheme with semantic meaning:
- **Dynamic Temperature Colors**: Blue for cold, green for mild, orange for warm, red for hot
- **Smart AQI Indicators**: Green for good air quality, yellow for moderate, red for unhealthy
- **Time Value Highlights**: Magenta for sunrise/sunset times
- **Atmospheric Data**: Teal for humidity, pressure, and visibility
- **Dimmed Details**: Subtle colors for less important text and separators

## Technical Improvements

- **ANSI-Aware Padding**: Perfect alignment even with colored text
- **Semantic Color Logic**: Colors reflect actual data values (temperature-based coloring)
- **Improved Readability**: Better contrast and visual hierarchy
- **Consistent Formatting**: All data properly aligned in clean columns

## Installation

```bash
npm install -g weather-cli-16bit@0.3.56
```

## Usage

Experience the new display automatically with any weather command:

```bash
weather "San Francisco, US"
weather "London, UK"
weather forecast "Tokyo, Japan"
```

## Display Example

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

---

**Full Changelog**: [View on GitHub](https://github.com/deephouse23/weather-cli/blob/main/CHANGELOG.md)