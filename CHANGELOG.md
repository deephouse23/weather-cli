# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.0.2-beta] - 2025-08-06

> **⚠️ Beta Release**: This version is under active development. While fully functional, features and APIs may change between versions. Feedback and contributions are welcome!

### Added
- Global npm package installation support with `npm install -g .`
- Simplified command syntax - users can now type `weather london` without the `now` command
- `preferGlobal: true` in package.json to encourage global installation
- Repository, homepage, and bugs URLs in package.json
- Comprehensive documentation for global installation workflow
- Enhanced CLI argument parsing for more intuitive usage

### Changed
- Updated README.md to emphasize global installation as the primary setup method
- Improved command examples throughout documentation
- Enhanced CLAUDE.md with both global and local development commands
- Updated CLI help text and command descriptions

### Fixed
- Command parsing now correctly handles location names as the default action
- Improved error handling for command line arguments
- Better handling of multi-word city names in simplified syntax

### Known Limitations (Beta)
- CLI interface may evolve based on user feedback
- Some command patterns may change in future versions
- Package not yet published to npm registry (manual installation required)

### Upcoming Features
- npm registry publication for easier installation
- Additional weather data sources
- Desktop notifications
- Configuration improvements

## [0.0.1] - 2025-08-05

### Added
- Initial release of weather CLI application
- Current weather conditions display with ASCII art and emojis
- 24-hour forecast functionality
- 5-day weather forecast
- Interactive mode with user prompts
- Weather comparison between two cities
- GPS coordinates support for weather lookup
- Configuration system for default location and temperature units
- Intelligent caching system with 30-minute expiration
- Cache management commands
- Support for both metric and imperial temperature units
- Weather alerts and air quality information
- Beautiful terminal UI with colors and formatted boxes
- Comprehensive error handling and user-friendly messages
- OpenWeatherMap API integration
- Environment variable configuration for API key
- Command-line options for units, forecast inclusion, and alerts

### Features
- **Weather Data**: Current conditions, forecasts, air pollution data
- **Display**: ASCII weather art, colored terminal output, formatted boxes
- **Caching**: Local caching to reduce API calls and improve performance
- **Configuration**: Persistent user preferences storage
- **Interactive UI**: Inquirer-based prompts for user-friendly experience
- **Multiple Commands**: Support for various weather data types and comparisons