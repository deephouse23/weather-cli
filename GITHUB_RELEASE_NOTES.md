# weather-cli-16bit v0.3.52 - Tokyo Night Visual Refresh

Beautiful new Tokyo Night color theme brings modern, consistent visual design to your weather CLI experience.

## Tokyo Night Color Theme

Transform your weather display with the popular Tokyo Night color palette:
- **Temperature Gradients**: Dynamic color coding from cold blues to hot reds
- **Weather Condition Colors**: Contextual colors for rain (cyan), snow (blue), storms (red), etc.
- **Air Quality Colors**: Visual indicators from good (green) to very poor (red)
- **Wind Speed Colors**: Beaufort scale-based color coding for wind conditions

## Visual Enhancements

- **Smart Color Mapping**: Colors adapt intelligently to weather severity and conditions
- **High Contrast Design**: Improved accessibility with carefully chosen color combinations
- **Terminal Optimized**: Tested across modern terminal environments for consistent display
- **Unified Experience**: Consistent theming across all weather displays and outputs

## Technical Improvements

- **Modular Theme System**: New `src/theme.js` provides centralized color management
- **Unit-Aware Colors**: Temperature colors automatically adapt to Celsius/Fahrenheit
- **Extensible Design**: Easy to customize or extend color themes in the future

## Installation

```bash
npm install -g weather-cli-16bit@0.3.52
```

## Usage

The visual improvements are automatic - no configuration needed. Just use weather-cli as usual:

```bash
weather "London, UK"
weather forecast "Tokyo, Japan"
weather compare "Paris, France" "Rome, Italy"
```

## What's Next

This release focuses on visual design improvements. The Tokyo Night theme provides a solid foundation for future visual enhancements while maintaining the reliable functionality you expect from weather-cli.

---

**Full Changelog**: [View on GitHub](https://github.com/deephouse23/weather-cli/blob/main/CHANGELOG.md)